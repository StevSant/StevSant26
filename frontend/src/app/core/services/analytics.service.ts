import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SupabaseClientService } from './supabase-client.service';
import { AnalyticsSummary, VisitorSession, PageView } from '../models';
import { environment } from '../../../environments/environment';

/** Recruiter-indicative referrer domains or sources */
const RECRUITER_REFERRERS = [
  'linkedin.com',
  'indeed.com',
  'glassdoor.com',
  'hired.com',
  'angel.co',
  'wellfound.com',
  'talent.com',
  'ziprecruiter.com',
  'monster.com',
  'cv',
  'resume',
  'curriculum',
];

/** Pages that recruiters typically visit (multiple = likely recruiter) */
const RECRUITER_INTEREST_PAGES = [
  '/experience',
  '/projects',
  '/skills',
  '/education',
  '/contact',
  '/competitions',
];

/**
 * Analytics service for tracking portfolio visitors and retrieving dashboard metrics.
 *
 * Responsibilities:
 * - Track page views from anonymous visitors (portfolio)
 * - Detect potential recruiter sessions based on referrer and browsing patterns
 * - Retrieve aggregated analytics for the dashboard (authenticated only)
 */
@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private client = inject(SupabaseClientService);
  private platformId = inject(PLATFORM_ID);

  private sessionId: string | null = null;
  private pagesVisitedInSession: string[] = [];
  private capturedRef: string | null = null;
  private resolvedReferrerSource: string | null = null;
  private currentPageStartTime: number = 0;
  private currentPagePath: string | null = null;

  constructor() {
    // Capture ?ref= or ?utm_source= immediately before Angular router strips them
    if (isPlatformBrowser(this.platformId)) {
      try {
        const params = new URLSearchParams(window.location.search);
        const ref = params.get('ref') || params.get('utm_source');
        if (ref) {
          this.capturedRef = ref;
          sessionStorage.setItem('analytics_ref', ref);
        } else {
          // Check if we stored it from a previous redirect
          this.capturedRef = sessionStorage.getItem('analytics_ref');
        }
      } catch {
        // Ignore
      }
    }
  }

  // ==================== TRACKING (Public Portfolio) ====================

  /**
   * Initialize a visitor session. Called once when the portfolio layout loads.
   * Creates or resumes a session based on a visitor fingerprint hash.
   */
  async initSession(referrer?: string): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;

    const visitorHash = this.generateVisitorHash();

    // Priority: direct ref param (from ActivatedRoute) > cookie (set by inline script, survives 302) > URL params > document.referrer
    const refFromCookie = this.getCookie('analytics_ref');
    const queryRef = referrer || refFromCookie || this.capturedRef || this.getQueryParam('ref') || this.getQueryParam('utm_source');

    console.log('[Analytics] initSession:', { directRef: referrer, cookie: refFromCookie, queryRef });

    const rawReferrer = queryRef || document.referrer;
    const referrerSource = queryRef || this.extractReferrerSource(rawReferrer);
    this.resolvedReferrerSource = referrerSource;
    const deviceInfo = this.getDeviceInfo();
    const geo = await this.fetchGeolocation();

    try {
      const existingSessionId = this.getStoredSessionId();

      if (existingSessionId) {
        // If we have a ref/utm_source, always update the referrer on the existing session
        const updateData: Record<string, unknown> = {
          last_seen_at: new Date().toISOString(),
          total_page_views: this.getStoredPageCount() + 1,
        };
        if (referrerSource) {
          updateData['referrer_source'] = referrerSource;
          updateData['is_potential_recruiter'] = this.isRecruiterReferrer(referrerSource);
        }

        const { error } = await this.client.client
          .from('visitor_session')
          .update(updateData)
          .eq('id', existingSessionId);

        if (!error) {
          this.sessionId = existingSessionId;
          return;
        }
      }

      // Create a new session — generate ID client-side to avoid needing SELECT after INSERT
      const isRecruiter = this.isRecruiterReferrer(referrerSource);
      const sessionId = crypto.randomUUID();

      console.log('[Analytics] Creating session:', { sessionId, referrerSource, isRecruiter, geo });

      const { error } = await this.client.client
        .from('visitor_session')
        .insert({
          id: sessionId,
          visitor_hash: visitorHash,
          referrer_source: referrerSource,
          is_potential_recruiter: isRecruiter,
          user_agent: navigator.userAgent,
          device_type: deviceInfo.deviceType,
          browser: deviceInfo.browser,
          os: deviceInfo.os,
          country: geo?.country || null,
          city: geo?.city || null,
        });

      if (!error) {
        this.sessionId = sessionId;
        this.storeSessionId(sessionId);
        this.storePageCount(1);
        // Clear captured ref so it doesn't persist to future sessions
        try {
          sessionStorage.removeItem('analytics_ref');
          document.cookie = 'analytics_ref=;path=/;max-age=0';
        } catch {}
      }
    } catch {
      // Silently fail — analytics should never break the portfolio
    }
  }

  /**
   * Track a page view. Called on each route navigation.
   */
  async trackPageView(pagePath: string, pageTitle?: string): Promise<void> {
    if (!isPlatformBrowser(this.platformId) || !this.sessionId) return;

    // Update duration of previous page before tracking new one
    await this.updateCurrentPageDuration();

    // Strip query params and fragments from page path
    const cleanPath = pagePath.split('?')[0].split('#')[0] || '/';
    this.pagesVisitedInSession.push(cleanPath);

    try {
      await this.client.client.from('page_view').insert({
        session_id: this.sessionId,
        page_path: cleanPath,
        page_title: pageTitle || null,
        referrer: document.referrer || null,
      });

      this.currentPagePath = cleanPath;
      this.currentPageStartTime = Date.now();

      // Update page count and check recruiter pattern
      const count = this.getStoredPageCount() + 1;
      this.storePageCount(count);

      await this.client.client
        .from('visitor_session')
        .update({
          last_seen_at: new Date().toISOString(),
          total_page_views: count,
          is_potential_recruiter: this.detectRecruiterPattern(),
        })
        .eq('id', this.sessionId);
    } catch {
      // Silently fail
    }
  }

  /**
   * Update the duration of the current page view.
   * Called when navigating away from a page or leaving the site.
   */
  async updateCurrentPageDuration(): Promise<void> {
    if (!this.sessionId || !this.currentPagePath || !this.currentPageStartTime) return;

    const durationSeconds = Math.round((Date.now() - this.currentPageStartTime) / 1000);
    if (durationSeconds <= 0) return;

    try {
      // Update the most recent page_view for this session + path
      await this.client.client
        .from('page_view')
        .update({ duration_seconds: durationSeconds })
        .eq('session_id', this.sessionId)
        .eq('page_path', this.currentPagePath)
        .order('created_at', { ascending: false })
        .limit(1);
    } catch {
      // Silently fail
    }
  }

  /**
   * Finalize duration tracking when user leaves. Called from component OnDestroy.
   */
  finalizeSession(): void {
    if (!this.sessionId || !this.currentPagePath || !this.currentPageStartTime) return;

    const durationSeconds = Math.round((Date.now() - this.currentPageStartTime) / 1000);
    if (durationSeconds <= 0) return;

    // Use fetch with keepalive for reliable delivery on page unload
    try {
      const url = `${environment.supabaseUrl}/rest/v1/page_view?session_id=eq.${this.sessionId}&page_path=eq.${encodeURIComponent(this.currentPagePath)}&order=created_at.desc&limit=1`;
      const body = JSON.stringify({ duration_seconds: durationSeconds });
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'apikey': environment.supabaseKey,
        'Authorization': `Bearer ${environment.supabaseKey}`,
        'Prefer': 'return=minimal',
      };

      fetch(url, {
        method: 'PATCH',
        headers,
        body,
        keepalive: true,
      }).catch(() => {});
    } catch {
      // Silently fail
    }
  }

  // ==================== DASHBOARD (Authenticated) ====================

  /**
   * Get aggregated analytics summary.
   * Calls the Supabase function get_analytics_summary.
   */
  async getAnalyticsSummary(days: number = 30): Promise<AnalyticsSummary | null> {
    try {
      const { data, error } = await this.client.client.rpc('get_analytics_summary', {
        p_days: days,
      });

      if (error) {
        console.error('Error fetching analytics summary:', error.message, error.details, error.hint, error.code);
        return null;
      }

      return data as AnalyticsSummary;
    } catch {
      return null;
    }
  }

  /**
   * Get recent page views with pagination.
   */
  async getRecentPageViews(limit: number = 50, offset: number = 0): Promise<PageView[]> {
    const { data, error } = await this.client.client
      .from('page_view')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) return [];
    return data as PageView[];
  }

  /**
   * Get recent visitor sessions with pagination.
   */
  async getRecentSessions(limit: number = 50, offset: number = 0): Promise<VisitorSession[]> {
    const { data, error } = await this.client.client
      .from('visitor_session')
      .select('*')
      .order('started_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) return [];
    return data as VisitorSession[];
  }

  // ==================== PRIVATE HELPERS ====================

  /**
   * Generate a simple visitor hash based on available browser information.
   * This is privacy-friendly — no cookies needed, just a fingerprint.
   */
  private generateVisitorHash(): string {
    const components = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      screen.colorDepth,
      new Date().getTimezoneOffset(),
    ];
    return this.simpleHash(components.join('|'));
  }

  /**
   * Simple string hash (djb2 algorithm).
   */
  private simpleHash(str: string): string {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
      hash = (hash * 33) ^ str.charCodeAt(i);
    }
    return (hash >>> 0).toString(36);
  }

  /**
   * Extract the source domain from a referrer URL.
   */
  private extractReferrerSource(referrer: string): string | null {
    if (!referrer) return null;
    try {
      const url = new URL(referrer);
      return url.hostname.replace('www.', '');
    } catch {
      return null;
    }
  }

  /**
   * Check if the referrer matches known recruiter platforms.
   */
  private isRecruiterReferrer(source: string | null): boolean {
    if (!source) return false;
    return RECRUITER_REFERRERS.some((r) => source.includes(r));
  }

  /**
   * Detect recruiter browsing patterns:
   * - Came from a recruiter platform, OR
   * - Visited 3+ different "interest" pages (experience, projects, skills, etc.)
   */
  private detectRecruiterPattern(): boolean {
    // Check captured ref from ?ref= query param or previously resolved source
    if (this.isRecruiterReferrer(this.capturedRef)) return true;
    if (this.isRecruiterReferrer(this.resolvedReferrerSource)) return true;

    const referrerSource = this.extractReferrerSource(document.referrer);
    if (this.isRecruiterReferrer(referrerSource)) return true;

    const interestPages = new Set(
      this.pagesVisitedInSession.filter((p) =>
        RECRUITER_INTEREST_PAGES.some((rp) => p.startsWith(rp))
      )
    );
    return interestPages.size >= 3;
  }

  /**
   * Get device information from the user agent.
   */
  private getDeviceInfo(): { deviceType: string; browser: string; os: string } {
    const ua = navigator.userAgent;

    // Device type
    let deviceType = 'desktop';
    if (/Mobi|Android/i.test(ua)) deviceType = 'mobile';
    else if (/Tablet|iPad/i.test(ua)) deviceType = 'tablet';

    // Browser
    let browser = 'unknown';
    if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Edg')) browser = 'Edge';
    else if (ua.includes('Chrome')) browser = 'Chrome';
    else if (ua.includes('Safari')) browser = 'Safari';
    else if (ua.includes('Opera') || ua.includes('OPR')) browser = 'Opera';

    // OS
    let os = 'unknown';
    if (ua.includes('Windows')) os = 'Windows';
    else if (ua.includes('Mac OS')) os = 'macOS';
    else if (ua.includes('Linux')) os = 'Linux';
    else if (ua.includes('Android')) os = 'Android';
    else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';

    return { deviceType, browser, os };
  }

  // Session storage helpers (sessionStorage, not cookies)
  private getStoredSessionId(): string | null {
    try {
      return sessionStorage.getItem('analytics_session_id');
    } catch {
      return null;
    }
  }

  private storeSessionId(id: string): void {
    try {
      sessionStorage.setItem('analytics_session_id', id);
    } catch {
      // Ignore
    }
  }

  private getStoredPageCount(): number {
    try {
      return parseInt(sessionStorage.getItem('analytics_page_count') || '0', 10);
    } catch {
      return 0;
    }
  }

  private storePageCount(count: number): void {
    try {
      sessionStorage.setItem('analytics_page_count', count.toString());
    } catch {
      // Ignore
    }
  }

  /**
   * Read a query parameter from the current URL.
   * Used to support ?ref= and ?utm_source= for referrer tracking.
   */
  private getQueryParam(name: string): string | null {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get(name);
    } catch {
      return null;
    }
  }

  /**
   * Fetch approximate geolocation from a free IP API.
   * Fails silently — returns null if the API is unreachable.
   */
  private async fetchGeolocation(): Promise<{ country: string; city: string } | null> {
    try {
      const res = await fetch('https://ipapi.co/json/', {
        signal: AbortSignal.timeout(3000),
      });
      if (!res.ok) return null;
      const data = await res.json();
      return {
        country: data.country_name || data.country || null,
        city: data.city || null,
      };
    } catch {
      return null;
    }
  }

  /**
   * Read a cookie value by name.
   */
  private getCookie(name: string): string | null {
    try {
      const match = document.cookie.match(new RegExp('(?:^|;\\s*)' + name + '=([^;]*)'));
      return match ? decodeURIComponent(match[1]) : null;
    } catch {
      return null;
    }
  }
}
