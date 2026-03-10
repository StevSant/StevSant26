-- Returns detailed changes since a given timestamp.
-- Used by the changes banner to show what happened since the admin's last visit.

CREATE OR REPLACE FUNCTION get_analytics_changes_since(
  p_since TIMESTAMPTZ
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
DECLARE
  v_new_referrers JSON;
  v_new_countries JSON;
  v_recruiter_sessions JSON;
  v_cv_downloads JSON;
  v_top_growing_pages JSON;
  v_total_new_views BIGINT;
  v_total_new_visitors BIGINT;
  v_total_new_recruiters BIGINT;
  v_total_new_cv_downloads BIGINT;
BEGIN
  SELECT COUNT(*) INTO v_total_new_views
  FROM page_view WHERE created_at >= p_since;

  SELECT COUNT(DISTINCT visitor_hash) INTO v_total_new_visitors
  FROM visitor_session WHERE started_at >= p_since;

  SELECT COUNT(DISTINCT visitor_hash) INTO v_total_new_recruiters
  FROM visitor_session WHERE started_at >= p_since AND is_potential_recruiter = TRUE;

  SELECT COUNT(*) INTO v_total_new_cv_downloads
  FROM cv_download WHERE created_at >= p_since;

  SELECT COALESCE(json_agg(sub.referrer_source), '[]'::JSON) INTO v_new_referrers
  FROM (
    SELECT DISTINCT referrer_source
    FROM visitor_session
    WHERE started_at >= p_since
      AND referrer_source IS NOT NULL
      AND referrer_source != ''
    ORDER BY referrer_source
  ) sub;

  SELECT COALESCE(json_agg(sub.country), '[]'::JSON) INTO v_new_countries
  FROM (
    SELECT DISTINCT country
    FROM visitor_session
    WHERE started_at >= p_since
      AND country IS NOT NULL
      AND country != ''
    ORDER BY country
  ) sub;

  SELECT COALESCE(json_agg(sub), '[]'::JSON) INTO v_recruiter_sessions
  FROM (
    SELECT
      vs.id,
      vs.referrer_source,
      vs.device_type,
      vs.country,
      vs.organization,
      vs.started_at,
      vs.total_page_views
    FROM visitor_session vs
    WHERE vs.started_at >= p_since
      AND vs.is_potential_recruiter = TRUE
    ORDER BY vs.started_at DESC
    LIMIT 10
  ) sub;

  SELECT COALESCE(json_agg(sub), '[]'::JSON) INTO v_cv_downloads
  FROM (
    SELECT
      cd.file_name,
      cd.language,
      cd.created_at
    FROM cv_download cd
    WHERE cd.created_at >= p_since
    ORDER BY cd.created_at DESC
  ) sub;

  SELECT COALESCE(json_agg(sub), '[]'::JSON) INTO v_top_growing_pages
  FROM (
    SELECT
      pv.page_path,
      COUNT(*) AS new_views
    FROM page_view pv
    WHERE pv.created_at >= p_since
    GROUP BY pv.page_path
    ORDER BY new_views DESC
    LIMIT 3
  ) sub;

  RETURN json_build_object(
    'total_new_views', v_total_new_views,
    'total_new_visitors', v_total_new_visitors,
    'total_new_recruiters', v_total_new_recruiters,
    'total_new_cv_downloads', v_total_new_cv_downloads,
    'new_referrers', v_new_referrers,
    'new_countries', v_new_countries,
    'recruiter_sessions', v_recruiter_sessions,
    'cv_downloads', v_cv_downloads,
    'top_growing_pages', v_top_growing_pages
  );
END;
$$;
