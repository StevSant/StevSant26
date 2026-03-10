-- Returns current period KPIs alongside previous period KPIs
-- for computing percentage change deltas on KPI cards.
-- Example: get_analytics_comparison(7) compares last 7 days vs 7-14 days ago.

CREATE OR REPLACE FUNCTION get_analytics_comparison(
  p_days INT DEFAULT 30
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
DECLARE
  current_start TIMESTAMPTZ := NOW() - (p_days || ' days')::INTERVAL;
  previous_start TIMESTAMPTZ := NOW() - (2 * p_days || ' days')::INTERVAL;
  previous_end TIMESTAMPTZ := current_start;

  c_total_views BIGINT;
  c_unique_visitors BIGINT;
  c_potential_recruiters BIGINT;
  c_cv_downloads BIGINT;
  c_avg_session_duration NUMERIC;

  p_total_views BIGINT;
  p_unique_visitors BIGINT;
  p_potential_recruiters BIGINT;
  p_cv_downloads BIGINT;
  p_avg_session_duration NUMERIC;
BEGIN
  -- Current period
  SELECT COUNT(*) INTO c_total_views
  FROM page_view WHERE created_at >= current_start;

  SELECT COUNT(DISTINCT visitor_hash) INTO c_unique_visitors
  FROM visitor_session WHERE started_at >= current_start;

  SELECT COUNT(DISTINCT visitor_hash) INTO c_potential_recruiters
  FROM visitor_session WHERE started_at >= current_start AND is_potential_recruiter = TRUE;

  SELECT COUNT(*) INTO c_cv_downloads
  FROM cv_download WHERE created_at >= current_start;

  SELECT COALESCE(ROUND(AVG(session_dur), 0), 0) INTO c_avg_session_duration
  FROM (
    SELECT SUM(pv.duration_seconds) AS session_dur
    FROM visitor_session vs
    JOIN page_view pv ON pv.session_id = vs.id
    WHERE vs.started_at >= current_start
    GROUP BY vs.id
  ) sub;

  -- Previous period
  SELECT COUNT(*) INTO p_total_views
  FROM page_view WHERE created_at >= previous_start AND created_at < previous_end;

  SELECT COUNT(DISTINCT visitor_hash) INTO p_unique_visitors
  FROM visitor_session WHERE started_at >= previous_start AND started_at < previous_end;

  SELECT COUNT(DISTINCT visitor_hash) INTO p_potential_recruiters
  FROM visitor_session WHERE started_at >= previous_start AND started_at < previous_end AND is_potential_recruiter = TRUE;

  SELECT COUNT(*) INTO p_cv_downloads
  FROM cv_download WHERE created_at >= previous_start AND created_at < previous_end;

  SELECT COALESCE(ROUND(AVG(session_dur), 0), 0) INTO p_avg_session_duration
  FROM (
    SELECT SUM(pv.duration_seconds) AS session_dur
    FROM visitor_session vs
    JOIN page_view pv ON pv.session_id = vs.id
    WHERE vs.started_at >= previous_start AND vs.started_at < previous_end
    GROUP BY vs.id
  ) sub;

  RETURN json_build_object(
    'current', json_build_object(
      'total_views', c_total_views,
      'unique_visitors', c_unique_visitors,
      'potential_recruiters', c_potential_recruiters,
      'cv_downloads', c_cv_downloads,
      'avg_session_duration', c_avg_session_duration
    ),
    'previous', json_build_object(
      'total_views', p_total_views,
      'unique_visitors', p_unique_visitors,
      'potential_recruiters', p_potential_recruiters,
      'cv_downloads', p_cv_downloads,
      'avg_session_duration', p_avg_session_duration
    )
  );
END;
$$;
