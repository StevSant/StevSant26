import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SupabaseClientService } from './supabase-client.service';
import { AnalyticsSummary, VisitorSession, PageView } from '../models';

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

  // ==================== TRACKING (Public Portfolio) ====================

  /**
   * Initialize a visitor session. Called once when the portfolio layout loads.
   * Creates or resumes a session based on a visitor fingerprint hash.
   */
  async initSession(referrer?: string): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;

    const visitorHash = this.generateVisitorHash();
    // Priority: explicit param > ?ref= query param > document.referrer
    const queryRef = this.getQueryParam('ref') || this.getQueryParam('utm_source');
    const rawReferrer = referrer || queryRef || document.referrer;
    const referrerSource = queryRef || this.extractReferrerSource(rawReferrer);
    const deviceInfo = this.getDeviceInfo();

    // Check for an existing session from this visitor in the last 30 minutes
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();

    try {
      // Try to find a recent session — this will fail for anon (RLS blocks SELECT)
      // So we always create a new session and store the ID locally
      const existingSessionId = this.getStoredSessionId();

      if (existingSessionId) {
        // We have a stored session, update it
        const { error } = await this.client.client
          .from('visitor_session')
          .update({
            last_seen_at: new Date().toISOString(),
            total_page_views: this.getStoredPageCount() + 1,
          })
          .eq('id', existingSessionId);

        if (!error) {
          this.sessionId = existingSessionId;
          return;
        }
      }

      // Create a new session
      const isRecruiter = this.isRecruiterReferrer(referrerSource);

      const { data, error } = await this.client.client
        .from('visitor_session')
        .insert({
          visitor_hash: visitorHash,
          referrer_source: referrerSource,
          is_potential_recruiter: isRecruiter,
          user_agent: navigator.userAgent,
          device_type: deviceInfo.deviceType,
          browser: deviceInfo.browser,
          os: deviceInfo.os,
        })
        .select('id')
        .single();

      if (data && !error) {
        this.sessionId = data.id;
        this.storeSessionId(data.id);
        this.storePageCount(1);
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

    this.pagesVisitedInSession.push(pagePath);

    try {
      await this.client.client.from('page_view').insert({
        session_id: this.sessionId,
        page_path: pagePath,
        page_title: pageTitle || null,
        referrer: document.referrer || null,
      });

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
        console.error('Error fetching analytics summary:', error);
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
}
