-- =========================
-- Supabase function: get_analytics_summary
-- Returns aggregated analytics data for the dashboard
-- =========================
CREATE OR REPLACE FUNCTION get_analytics_summary(
  p_days INT DEFAULT 30
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
DECLARE
  result JSON;
  start_date TIMESTAMPTZ;
BEGIN
  start_date := NOW() - (p_days || ' days')::INTERVAL;

  SELECT json_build_object(
    'total_views', (SELECT COUNT(*) FROM page_view WHERE created_at >= start_date),
    'unique_visitors', (SELECT COUNT(DISTINCT visitor_hash) FROM visitor_session WHERE started_at >= start_date),
    'potential_recruiters', (SELECT COUNT(DISTINCT visitor_hash) FROM visitor_session WHERE started_at >= start_date AND is_potential_recruiter = TRUE),
    'views_today', (SELECT COUNT(*) FROM page_view WHERE created_at >= CURRENT_DATE),
    'visitors_today', (SELECT COUNT(DISTINCT session_id) FROM page_view WHERE created_at >= CURRENT_DATE),
    'avg_session_duration', (
      SELECT COALESCE(ROUND(AVG(session_dur)::numeric, 0), 0)
      FROM (
        SELECT SUM(COALESCE(pv.duration_seconds, 0)) as session_dur
        FROM visitor_session vs
        JOIN page_view pv ON pv.session_id = vs.id
        WHERE vs.started_at >= start_date
        GROUP BY vs.id
        HAVING SUM(COALESCE(pv.duration_seconds, 0)) > 0
      ) sub
    ),
    'top_pages', (
      SELECT COALESCE(json_agg(row_to_json(t)), '[]'::json)
      FROM (
        SELECT page_path, COUNT(*) as views,
               COALESCE(ROUND(AVG(CASE WHEN duration_seconds > 0 THEN duration_seconds ELSE NULL END)::numeric, 0), 0) as avg_duration
        FROM page_view
        WHERE created_at >= start_date
        GROUP BY page_path
        ORDER BY views DESC
        LIMIT 10
      ) t
    ),
    'top_referrers', (
      SELECT COALESCE(json_agg(row_to_json(t)), '[]'::json)
      FROM (
        SELECT referrer_source, COUNT(*) as visits
        FROM visitor_session
        WHERE started_at >= start_date AND referrer_source IS NOT NULL AND referrer_source != ''
        GROUP BY referrer_source
        ORDER BY visits DESC
        LIMIT 10
      ) t
    ),
    'device_breakdown', (
      SELECT COALESCE(json_agg(row_to_json(t)), '[]'::json)
      FROM (
        SELECT device_type, COUNT(*) as count
        FROM visitor_session
        WHERE started_at >= start_date AND device_type IS NOT NULL
        GROUP BY device_type
        ORDER BY count DESC
      ) t
    ),
    'browser_breakdown', (
      SELECT COALESCE(json_agg(row_to_json(t)), '[]'::json)
      FROM (
        SELECT browser, COUNT(*) as count
        FROM visitor_session
        WHERE started_at >= start_date AND browser IS NOT NULL
        GROUP BY browser
        ORDER BY count DESC
        LIMIT 10
      ) t
    ),
    'daily_views', (
      SELECT COALESCE(json_agg(row_to_json(t)), '[]'::json)
      FROM (
        SELECT DATE(created_at) as date, COUNT(*) as views
        FROM page_view
        WHERE created_at >= start_date
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      ) t
    ),
    'recruiter_sessions', (
      SELECT COALESCE(json_agg(row_to_json(t)), '[]'::json)
      FROM (
        SELECT
          vs.id,
          vs.referrer_source,
          vs.device_type,
          vs.browser,
          vs.os,
          vs.country,
          vs.city,
          vs.started_at,
          vs.total_page_views,
          (
            SELECT COALESCE(json_agg(
              json_build_object('page_path', pv.page_path, 'created_at', pv.created_at, 'duration_seconds', COALESCE(pv.duration_seconds, 0))
              ORDER BY pv.created_at ASC
            ), '[]'::json)
            FROM page_view pv
            WHERE pv.session_id = vs.id
          ) as pages_visited
        FROM visitor_session vs
        WHERE vs.is_potential_recruiter = TRUE AND vs.started_at >= start_date
        ORDER BY vs.started_at DESC
        LIMIT 50
      ) t
    )
  ) INTO result;

  RETURN result;
END;
$$;
