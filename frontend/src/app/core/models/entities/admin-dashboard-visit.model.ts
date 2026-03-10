import { TopReferrer, CountryBreakdown } from './analytics.model';

export interface DashboardVisitSnapshot {
  total_views: number;
  unique_visitors: number;
  potential_recruiters: number;
  cv_downloads_total: number;
  avg_session_duration: number;
  top_referrers: TopReferrer[];
  country_breakdown: CountryBreakdown[];
}

export interface AdminDashboardVisit {
  user_id: string;
  last_visit_at: string;
  snapshot: DashboardVisitSnapshot;
  created_at: string;
}

export interface AnalyticsChangesSince {
  total_new_views: number;
  total_new_visitors: number;
  total_new_recruiters: number;
  total_new_cv_downloads: number;
  new_referrers: string[];
  new_countries: string[];
  recruiter_sessions: ChangeRecruiterSession[];
  cv_downloads: ChangeCvDownload[];
  top_growing_pages: ChangeGrowingPage[];
}

export interface ChangeRecruiterSession {
  id: string;
  referrer_source: string;
  device_type: string;
  country: string;
  organization: string | null;
  started_at: string;
  total_page_views: number;
}

export interface ChangeCvDownload {
  file_name: string;
  language: string;
  created_at: string;
}

export interface ChangeGrowingPage {
  page_path: string;
  new_views: number;
}
