import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SupabaseClientService } from './supabase-client.service';
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
  'computrabajo.com',
  'cletonboard',
  'infojobs.net',
  'manpower.com',
  'hays.com',
  'randstad.com',
  'adecco.com',
  'michaelpage.com',
  'roberthalf.com',
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
 * Map of known redirect/tracker domains to their actual source platform.
 * Platforms like LinkedIn wrap outbound links through tracker domains
 * (e.g., lnkd.in, l.linkedin.com) which strips the original referrer.
 */
const REFERRER_DOMAIN_MAP: Record<string, string> = {
  // LinkedIn
  'lnkd.in': 'linkedin.com',
  'l.linkedin.com': 'linkedin.com',
  'linkedin.com': 'linkedin.com',
  // Twitter/X
  't.co': 'x.com',
  'x.com': 'x.com',
  'twitter.com': 'x.com',
  // Facebook / Meta
  'l.facebook.com': 'facebook.com',
  'lm.facebook.com': 'facebook.com',
  'facebook.com': 'facebook.com',
  'l.instagram.com': 'instagram.com',
  'instagram.com': 'instagram.com',
  // Google
  'google.com': 'google.com',
  'google.co': 'google.com',
  // Indeed
  'indeed.com': 'indeed.com',
  // GitHub
  'github.com': 'github.com',
  // Glassdoor
  'glassdoor.com': 'glassdoor.com',
};

/** Duration heartbeat interval in milliseconds (30 seconds) */
const DURATION_HEARTBEAT_MS = 30_000;

/** First heartbeat delay — save duration quickly in case user leaves early (5 seconds) */
const FIRST_HEARTBEAT_MS = 5_000;

/** Idle timeout in milliseconds (5 minutes).
 *  After this period without user interaction (mouse, keyboard, scroll, touch),
 *  duration tracking pauses to prevent inflated times from idle tabs. */
const IDLE_TIMEOUT_MS = 5 * 60 * 1000;

/** Maximum number of retry attempts for transient Supabase errors (520, network failures) */
const MAX_RETRIES = 3;

/** Base delay in ms for exponential backoff (doubles each attempt: 500, 1000, 2000) */
const RETRY_BASE_DELAY_MS = 500;

/** User interaction events that reset the idle timer */
const ACTIVITY_EVENTS: (keyof DocumentEventMap)[] = [
  'mousemove',
  'mousedown',
  'keydown',
  'scroll',
  'touchstart',
  'pointerdown',
];

/**
 * Analytics tracking service for portfolio visitors.
 *
 * Responsibilities:
 * - Track page views from anonymous visitors (portfolio)
 * - Detect potential recruiter sessions based on referrer and browsing patterns
 * - Manage session lifecycle (init, heartbeat, idle detection, finalize)
 */
@Injectable({ providedIn: 'root' })
export class AnalyticsTrackingService {
  private client = inject(SupabaseClientService);
  private platformId = inject(PLATFORM_ID);

  private sessionId: string | null = null;
  private pagesVisitedInSession: string[] = [];
  private capturedRef: string | null = null;
  private resolvedReferrerSource: string | null = null;
  private currentPageStartTime: number = 0;
  private currentPagePath: string | null = null;
  private currentPageViewId: number | null = null;
  private heartbeatInterval: ReturnType<typeof setInterval> | null = null;
  private heartbeatTimeout: ReturnType<typeof setTimeout> | null = null;
  private lastHeartbeatDuration: number = 0;

  /** Idle detection state */
  private idleTimeout: ReturnType<typeof setTimeout> | null = null;
  private isIdle = false;
  private idleSince: number = 0;
  private accumulatedIdleMs: number = 0;
  private activityListenersBound = false;
  private boundOnActivity = this.onUserActivity.bind(this);

  /** Flag to prevent concurrent session recovery loops */
  private isRecoveringSession = false;

  constructor() {
    // Capture referrer source immediately before Angular router strips them
    // Priority: /from/:source path > ?ref= query param > ?utm_source= > previously stored
    if (isPlatformBrowser(this.platformId)) {
      try {
        // 1. Check /from/:source path (most reliable — platforms can't strip paths)
        const pathMatch = window.location.pathname.match(/^\/from\/([^/]+)/);
        if (pathMatch) {
          const sourceMap: Record<string, string> = {
            linkedin: 'linkedin.com',
            github: 'github.com',
            indeed: 'indeed.com',
            glassdoor: 'glassdoor.com',
            twitter: 'x.com',
            x: 'x.com',
            instagram: 'instagram.com',
            facebook: 'facebook.com',
            cv: 'cv',
            resume: 'resume',
            curriculum: 'curriculum',
          };
          const raw = decodeURIComponent(pathMatch[1]).toLowerCase();
          this.capturedRef = sourceMap[raw] || pathMatch[1];
          sessionStorage.setItem('analytics_ref', this.capturedRef);
        } else {
          // 2. Check ?ref= / ?utm_source= query params
          const params = new URLSearchParams(window.location.search);
          const ref = params.get('ref') || params.get('utm_source');
          if (ref) {
            this.capturedRef = ref;
            sessionStorage.setItem('analytics_ref', ref);
          } else {
            // 3. Check if we stored it from a previous redirect
            this.capturedRef = sessionStorage.getItem('analytics_ref');
          }
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
   * Includes retry with exponential backoff for transient Supabase errors.
   */
  async initSession(referrer?: string): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;

    const visitorHash = this.generateVisitorHash();

    // Priority: direct ref param (from ActivatedRoute) > cookie (set by inline script, survives 302) > URL params > document.referrer
    const refFromCookie = this.getCookie('analytics_ref');
    const queryRef =
      referrer ||
      refFromCookie ||
      this.capturedRef ||
      this.getQueryParam('ref') ||
      this.getQueryParam('utm_source');

    const rawReferrer = queryRef || document.referrer;
    const referrerSource = queryRef || this.extractReferrerSource(rawReferrer);
    this.resolvedReferrerSource = referrerSource;
    const deviceInfo = this.getDeviceInfo();
    const geo = await this.fetchGeolocation();

    await this.withRetry(async () => {
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
        // If the stored session no longer exists (FK error / 404), clear it and create a new one
        this.clearStoredSession();
      }

      // Create a new session — generate ID client-side to avoid needing SELECT after INSERT
      await this.createNewSession(visitorHash, referrerSource, deviceInfo, geo);
    }, 'initSession');
  }

  /**
   * Create a brand-new visitor session row and store it locally.
   */
  private async createNewSession(
    visitorHash: string,
    referrerSource: string | null,
    deviceInfo: { deviceType: string; browser: string; os: string },
    geo: { country: string; city: string } | null,
  ): Promise<void> {
    const isRecruiter = this.isRecruiterReferrer(referrerSource);
    const sessionId = crypto.randomUUID();

    const { error } = await this.client.client.from('visitor_session').insert({
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
      browser_language: navigator.language || null,
    });

    if (error) throw error; // Let retry handle it

    this.sessionId = sessionId;
    this.storeSessionId(sessionId);
    this.storePageCount(1);
    // Clear captured ref so it doesn't persist to future sessions
    try {
      sessionStorage.removeItem('analytics_ref');
      document.cookie = 'analytics_ref=;path=/;max-age=0';
    } catch {
      /* sessionStorage may be unavailable */
    }
  }

  /**
   * Track a page view. Called on each route navigation.
   * Includes retry and automatic session recovery if the FK constraint fails.
   */
  async trackPageView(pagePath: string, pageTitle?: string): Promise<void> {
    if (!isPlatformBrowser(this.platformId) || !this.sessionId) return;

    // Update duration of previous page before tracking new one
    await this.updateCurrentPageDuration();
    this.stopHeartbeat();

    // Strip query params and fragments from page path
    const cleanPath = pagePath.split('?')[0].split('#')[0] || '/';
    this.pagesVisitedInSession.push(cleanPath);

    await this.withRetry(async () => {
      const { data: insertedRows, error } = await this.client.client
        .from('page_view')
        .insert({
          session_id: this.sessionId,
          page_path: cleanPath,
          page_title: pageTitle || null,
          referrer: document.referrer || null,
        })
        .select('id');

      // FK violation (409/23503) = session no longer exists → recover
      if (error && this.isForeignKeyError(error)) {
        await this.recoverSession();
        // Retry the insert with the new session
        const { data: retryRows } = await this.client.client
          .from('page_view')
          .insert({
            session_id: this.sessionId,
            page_path: cleanPath,
            page_title: pageTitle || null,
            referrer: document.referrer || null,
          })
          .select('id');
        this.applyPageViewState(cleanPath, retryRows?.[0]?.id ?? null);
        return;
      }

      if (error) throw error; // Let retry handle transient errors

      this.applyPageViewState(cleanPath, insertedRows?.[0]?.id ?? null);

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
    }, 'trackPageView');
  }

  /**
   * Apply shared page-view state after a successful insert.
   */
  private applyPageViewState(cleanPath: string, pageViewId: number | null): void {
    this.currentPagePath = cleanPath;
    this.currentPageStartTime = Date.now();
    this.lastHeartbeatDuration = 0;
    this.currentPageViewId = pageViewId;
    this.accumulatedIdleMs = 0;
    this.isIdle = false;
    this.idleSince = 0;
    this.startHeartbeat();
  }

  /**
   * Update the duration of the current page view.
   * Called when navigating away from a page or leaving the site.
   * Includes retry with exponential backoff for transient errors.
   *
   * PostgREST does not support .order()/.limit() on UPDATE, so we first
   * SELECT the most recent page_view row, then update it by ID.
   */
  async updateCurrentPageDuration(): Promise<void> {
    if (!this.sessionId || !this.currentPagePath || !this.currentPageStartTime) return;

    const durationSeconds = this.getActiveDurationSeconds();
    if (durationSeconds <= 0) return;

    await this.withRetry(async () => {
      if (this.currentPageViewId) {
        // Fast path: update by known ID
        const { error } = await this.client.client
          .from('page_view')
          .update({ duration_seconds: durationSeconds })
          .eq('id', this.currentPageViewId);
        if (error) throw error;
      } else {
        // Fallback: find the most recent page_view for this session + path
        const { data: rows, error: selectError } = await this.client.client
          .from('page_view')
          .select('id')
          .eq('session_id', this.sessionId!)
          .eq('page_path', this.currentPagePath!)
          .order('created_at', { ascending: false })
          .limit(1);

        if (selectError) throw selectError;

        if (rows && rows.length > 0) {
          const { error: updateError } = await this.client.client
            .from('page_view')
            .update({ duration_seconds: durationSeconds })
            .eq('id', rows[0].id);
          if (updateError) throw updateError;
        }
      }
    }, 'updateCurrentPageDuration');
  }

  /**
   * Finalize duration tracking when user leaves. Called from component OnDestroy.
   * Updates both the page view duration and the session's last_seen_at (exit time).
   */
  finalizeSession(): void {
    this.stopHeartbeat();
    this.stopIdleDetection();

    if (!this.sessionId || !this.currentPagePath || !this.currentPageStartTime) return;

    const durationSeconds = this.getActiveDurationSeconds();
    if (durationSeconds <= 0) return;

    const now = new Date().toISOString();

    // Use fetch with keepalive for reliable delivery on page unload
    try {
      // 1. Update page view duration
      const url = this.buildPageViewUpdateUrl();
      const body = JSON.stringify({ duration_seconds: durationSeconds });

      fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          apikey: environment.supabaseKey,
          Authorization: `Bearer ${environment.supabaseKey}`,
          Prefer: 'return=minimal',
        },
        body,
        keepalive: true,
      }).catch(() => {});

      // 2. Update session last_seen_at (exit timestamp)
      const sessionUrl = `${environment.supabaseUrl}/rest/v1/visitor_session?id=eq.${this.sessionId}`;
      fetch(sessionUrl, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          apikey: environment.supabaseKey,
          Authorization: `Bearer ${environment.supabaseKey}`,
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({ last_seen_at: now }),
        keepalive: true,
      }).catch(() => {});
    } catch {
      // Silently fail
    }
  }

  /**
   * Setup visibility change and pagehide listeners for more reliable
   * duration tracking, especially on mobile where beforeunload is unreliable.
   * Called once from the portfolio layout component.
   */
  setupPageLifecycleListeners(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // visibilitychange fires when user switches tabs, minimizes browser, etc.
    // More reliable than beforeunload on mobile.
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.flushCurrentDuration();
      } else if (document.visibilityState === 'visible') {
        // Resume heartbeat when page becomes visible again
        this.startHeartbeat();
      }
    });

    // pagehide is the last reliable event before a page is discarded (iOS Safari)
    window.addEventListener('pagehide', () => {
      this.flushCurrentDuration();
    });

    // Start idle detection
    this.startIdleDetection();
  }

  /**
   * Track a CV download event. Called when a visitor clicks the download button.
   * Captures which document was downloaded, its language, and the session context.
   */
  async trackCvDownload(params: {
    documentId?: number;
    fileName?: string;
    language?: string;
  }): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;

    try {
      await this.client.client.from('cv_download').insert({
        session_id: this.sessionId || null,
        document_id: params.documentId || null,
        file_name: params.fileName || null,
        language: params.language || null,
      });
    } catch {
      // Silently fail — analytics should never break the portfolio
    }
  }

  // ==================== PRIVATE HELPERS ====================

  /**
   * Flush the current page duration to the DB using fetch+keepalive.
   * Called from visibility/lifecycle events — must be fast and non-blocking.
   * Also updates session last_seen_at to track exit time.
   */
  private flushCurrentDuration(): void {
    this.stopHeartbeat();

    if (!this.sessionId || !this.currentPagePath || !this.currentPageStartTime) return;

    const durationSeconds = this.getActiveDurationSeconds();
    if (durationSeconds <= 0 || durationSeconds === this.lastHeartbeatDuration) return;

    const now = new Date().toISOString();

    try {
      // 1. Update page view duration
      const url = this.buildPageViewUpdateUrl();
      const body = JSON.stringify({ duration_seconds: durationSeconds });

      fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          apikey: environment.supabaseKey,
          Authorization: `Bearer ${environment.supabaseKey}`,
          Prefer: 'return=minimal',
        },
        body,
        keepalive: true,
      }).catch(() => {});

      // 2. Update session last_seen_at (exit timestamp)
      const sessionUrl = `${environment.supabaseUrl}/rest/v1/visitor_session?id=eq.${this.sessionId}`;
      fetch(sessionUrl, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          apikey: environment.supabaseKey,
          Authorization: `Bearer ${environment.supabaseKey}`,
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({ last_seen_at: now }),
        keepalive: true,
      }).catch(() => {});

      this.lastHeartbeatDuration = durationSeconds;
    } catch {
      // Silently fail
    }
  }

  /**
   * Build the PostgREST URL for updating the current page view's duration.
   */
  private buildPageViewUpdateUrl(): string {
    if (this.currentPageViewId) {
      return `${environment.supabaseUrl}/rest/v1/page_view?id=eq.${this.currentPageViewId}`;
    }
    return `${environment.supabaseUrl}/rest/v1/page_view?session_id=eq.${this.sessionId}&page_path=eq.${encodeURIComponent(this.currentPagePath!)}`;
  }

  // ==================== HEARTBEAT ====================

  /**
   * Start duration heartbeat: fires once quickly (5s) to capture short visits,
   * then switches to a 30s periodic interval for long-lived pages.
   */
  private startHeartbeat(): void {
    this.stopHeartbeat();

    if (!this.currentPageViewId || !this.currentPageStartTime) return;

    // First rapid tick — captures users who leave within the first 30 seconds
    this.heartbeatTimeout = setTimeout(() => {
      this.heartbeatTick();

      // Then switch to steady 30s interval
      this.heartbeatInterval = setInterval(() => {
        this.heartbeatTick();
      }, DURATION_HEARTBEAT_MS);
    }, FIRST_HEARTBEAT_MS);
  }

  /**
   * Single heartbeat tick — updates the current page view's duration in the DB.
   * Skips update when user is idle (no interaction for 5 minutes).
   * Uses a single retry attempt (non-blocking) to handle transient errors.
   */
  private async heartbeatTick(): Promise<void> {
    if (!this.currentPageViewId || !this.currentPageStartTime) {
      this.stopHeartbeat();
      return;
    }

    // Only update if page is visible and user is NOT idle
    if (document.visibilityState !== 'visible') return;
    if (this.isIdle) return;

    const durationSeconds = this.getActiveDurationSeconds();
    if (durationSeconds <= 0 || durationSeconds === this.lastHeartbeatDuration) return;

    await this.withRetry(
      async () => {
        const { error } = await this.client.client
          .from('page_view')
          .update({ duration_seconds: durationSeconds })
          .eq('id', this.currentPageViewId!);
        if (error) throw error;
        this.lastHeartbeatDuration = durationSeconds;

        // Also update last_seen_at on the session
        await this.client.client
          .from('visitor_session')
          .update({ last_seen_at: new Date().toISOString() })
          .eq('id', this.sessionId!);
      },
      'heartbeatTick',
      1,
    ); // Only 1 retry for heartbeat — next tick will cover it
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimeout) {
      clearTimeout(this.heartbeatTimeout);
      this.heartbeatTimeout = null;
    }
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  // ==================== IDLE DETECTION ====================

  /**
   * Calculates the active (non-idle) duration in seconds for the current page view.
   * Subtracts accumulated idle time from the total elapsed time.
   */
  private getActiveDurationSeconds(): number {
    if (!this.currentPageStartTime) return 0;
    const elapsed = Date.now() - this.currentPageStartTime;
    const currentIdleMs = this.isIdle ? Date.now() - this.idleSince : 0;
    const activeMs = elapsed - this.accumulatedIdleMs - currentIdleMs;
    return Math.max(0, Math.round(activeMs / 1000));
  }

  /**
   * Start idle detection: listen for user interaction events and
   * pause duration tracking when user is inactive for IDLE_TIMEOUT_MS.
   */
  private startIdleDetection(): void {
    if (!isPlatformBrowser(this.platformId) || this.activityListenersBound) return;

    for (const event of ACTIVITY_EVENTS) {
      document.addEventListener(event, this.boundOnActivity, { passive: true });
    }
    this.activityListenersBound = true;
    this.resetIdleTimer();
  }

  /**
   * Stop idle detection and clean up event listeners.
   */
  private stopIdleDetection(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    for (const event of ACTIVITY_EVENTS) {
      document.removeEventListener(event, this.boundOnActivity);
    }
    this.activityListenersBound = false;

    if (this.idleTimeout) {
      clearTimeout(this.idleTimeout);
      this.idleTimeout = null;
    }
  }

  /**
   * Called on every user interaction. Resets the idle timer.
   * If the user was idle, resumes tracking.
   */
  private onUserActivity(): void {
    if (this.isIdle) {
      // User returned from idle — accumulate the idle period
      this.accumulatedIdleMs += Date.now() - this.idleSince;
      this.isIdle = false;
      this.idleSince = 0;
      // Resume heartbeat
      this.startHeartbeat();
    }
    this.resetIdleTimer();
  }

  /**
   * Reset the idle timer. After IDLE_TIMEOUT_MS of no activity, mark as idle.
   */
  private resetIdleTimer(): void {
    if (this.idleTimeout) {
      clearTimeout(this.idleTimeout);
    }
    this.idleTimeout = setTimeout(() => {
      this.isIdle = true;
      this.idleSince = Date.now();
      // Flush current duration before going idle
      this.flushCurrentDuration();
    }, IDLE_TIMEOUT_MS);
  }

  // ==================== PRIVATE HELPERS (continued) ====================

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
   * Maps known redirect/tracker domains (e.g., lnkd.in → linkedin.com).
   */
  private extractReferrerSource(referrer: string): string | null {
    if (!referrer) return null;
    try {
      const url = new URL(referrer);
      const hostname = url.hostname.replace('www.', '');

      // Check if this hostname (or any parent domain) is in our known map
      const mapped = this.mapReferrerDomain(hostname);
      return mapped || hostname;
    } catch {
      return null;
    }
  }

  /**
   * Map a hostname to its known source platform.
   * Checks the full hostname first, then progressively strips subdomains.
   * e.g., "l.linkedin.com" → "linkedin.com", "lnkd.in" → "linkedin.com"
   */
  private mapReferrerDomain(hostname: string): string | null {
    // Direct match
    if (REFERRER_DOMAIN_MAP[hostname]) {
      return REFERRER_DOMAIN_MAP[hostname];
    }
    // Check parent domains (e.g., "sub.example.com" → "example.com")
    const parts = hostname.split('.');
    for (let i = 1; i < parts.length - 1; i++) {
      const parent = parts.slice(i).join('.');
      if (REFERRER_DOMAIN_MAP[parent]) {
        return REFERRER_DOMAIN_MAP[parent];
      }
    }
    return null;
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
        RECRUITER_INTEREST_PAGES.some((rp) => p.startsWith(rp)),
      ),
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

  // ==================== RETRY & SESSION RECOVERY ====================

  /**
   * Execute an async operation with exponential backoff retry.
   * Catches transient errors (network failures, Supabase 520s) and retries.
   * Returns null on final failure — analytics should never break the portfolio.
   *
   * @param fn        The async operation to attempt
   * @param label     Human-readable label for debug logging
   * @param maxRetries Override default MAX_RETRIES (e.g., 1 for heartbeat)
   */
  private async withRetry<T>(
    fn: () => Promise<T>,
    label: string,
    maxRetries: number = MAX_RETRIES,
  ): Promise<T | null> {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (err: unknown) {
        const isLast = attempt === maxRetries;
        if (isLast) {
          // Final attempt failed — give up silently
          if (!environment.production) {
            console.warn(`[Analytics] ${label} failed after ${maxRetries + 1} attempts`, err);
          }
          return null;
        }
        // Exponential backoff: 500ms, 1000ms, 2000ms …
        const delay = RETRY_BASE_DELAY_MS * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
    return null;
  }

  /**
   * Check whether a Supabase error is a foreign-key violation (session row deleted).
   * PostgREST returns HTTP 409 with PGRST code 23503 for FK violations.
   */
  private isForeignKeyError(error: { code?: string; message?: string; details?: string }): boolean {
    return (
      error.code === '23503' ||
      error.code === '409' ||
      (error.message || '').includes('foreign key') ||
      (error.details || '').includes('is not present in table')
    );
  }

  /**
   * Recover the analytics session when the stored session ID is stale
   * (e.g., the row was deleted or the FK constraint fails).
   * Creates a fresh session and updates the local state.
   */
  private async recoverSession(): Promise<void> {
    if (this.isRecoveringSession) return;
    this.isRecoveringSession = true;

    try {
      this.clearStoredSession();
      const visitorHash = this.generateVisitorHash();
      const deviceInfo = this.getDeviceInfo();
      // Skip geolocation on recovery to save time
      await this.createNewSession(visitorHash, this.resolvedReferrerSource, deviceInfo, null);
    } finally {
      this.isRecoveringSession = false;
    }
  }

  /**
   * Clear all locally stored session data so a fresh session can be created.
   */
  private clearStoredSession(): void {
    this.sessionId = null;
    this.currentPageViewId = null;
    try {
      sessionStorage.removeItem('analytics_session_id');
      sessionStorage.removeItem('analytics_page_count');
    } catch {
      /* sessionStorage may be unavailable */
    }
  }
}
