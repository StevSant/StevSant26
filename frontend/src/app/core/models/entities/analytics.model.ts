/**
 * Visitor Session entity
 * Represents a unique visitor's browsing session on the portfolio
 */
export interface VisitorSession {
  id: string;
  visitor_hash: string;
  started_at: string;
  last_seen_at: string;
  total_page_views: number;
  referrer_source: string | null;
  is_potential_recruiter: boolean;
  user_agent: string | null;
  device_type: 'desktop' | 'mobile' | 'tablet' | 'unknown';
  browser: string | null;
  os: string | null;
  country: string | null;
  city: string | null;
}

/**
 * Page View entity
 * Represents a single page visit within a session
 */
export interface PageView {
  id: number;
  session_id: string;
  page_path: string;
  page_title: string | null;
  referrer: string | null;
  duration_seconds: number;
  created_at: string;
}

/**
 * Analytics Summary DTO
 * Aggregated analytics data returned by the Supabase function
 */
export interface AnalyticsSummary {
  total_views: number;
  unique_visitors: number;
  potential_recruiters: number;
  views_today: number;
  visitors_today: number;
  top_pages: TopPage[] | null;
  top_referrers: TopReferrer[] | null;
  device_breakdown: DeviceBreakdown[] | null;
  browser_breakdown: BrowserBreakdown[] | null;
  daily_views: DailyView[] | null;
  recruiter_sessions: RecruiterSession[] | null;
  avg_session_duration: number;
  cv_downloads_total: number;
  cv_downloads_today: number;
  cv_downloads_breakdown: CvDownloadBreakdown[] | null;
  language_breakdown: LanguageBreakdown[] | null;
  country_breakdown: CountryBreakdown[] | null;
}

export interface TopPage {
  page_path: string;
  views: number;
  avg_duration: number;
}

export interface TopReferrer {
  referrer_source: string;
  visits: number;
}

export interface DeviceBreakdown {
  device_type: string;
  count: number;
}

export interface BrowserBreakdown {
  browser: string;
  count: number;
}

export interface DailyView {
  date: string;
  views: number;
}

export interface RecruiterSession {
  id: string;
  referrer_source: string | null;
  device_type: string | null;
  browser: string | null;
  os: string | null;
  country: string | null;
  city: string | null;
  started_at: string;
  total_page_views: number;
  pages_visited: { page_path: string; created_at: string; duration_seconds: number }[] | null;
}

export interface CvDownloadBreakdown {
  file_name: string;
  language: string;
  downloads: number;
}

export interface LanguageBreakdown {
  browser_language: string;
  count: number;
}

export interface CountryBreakdown {
  country: string;
  count: number;
}

/**
 * Unique Visitor DTO
 * Aggregated data for a unique visitor (grouped by visitor_hash)
 */
export interface UniqueVisitor {
  visitor_hash: string;
  total_sessions: number;
  total_page_views: number;
  first_visit: string;
  last_visit: string;
  avg_session_duration: number;
  device_type: string | null;
  browser: string | null;
  os: string | null;
  country: string | null;
  city: string | null;
  is_potential_recruiter: boolean;
  referrer_sources: string[];
  unique_pages_visited: string[];
  session_history: VisitorSessionDetail[] | null;
  page_time_breakdown: PageTimeBreakdown[] | null;
}

/**
 * Individual session detail within a visitor's history
 */
export interface VisitorSessionDetail {
  id: string;
  started_at: string;
  last_seen_at: string;
  referrer_source: string | null;
  session_device_type: string | null;
  session_page_views: number;
  session_duration: number;
  pages: SessionPageView[] | null;
}

/**
 * A single page view within a session
 */
export interface SessionPageView {
  page_path: string;
  page_title: string | null;
  created_at: string;
  duration_seconds: number;
}

/**
 * Per-page time breakdown across all sessions for a visitor
 */
export interface PageTimeBreakdown {
  page_path: string;
  visit_count: number;
  total_time: number;
  avg_time: number;
}

export interface AnalyticsPeriodKpis {
  total_views: number;
  unique_visitors: number;
  potential_recruiters: number;
  cv_downloads: number;
  avg_session_duration: number;
}

export interface AnalyticsComparison {
  current: AnalyticsPeriodKpis;
  previous: AnalyticsPeriodKpis;
}
