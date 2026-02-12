-- =========================
-- Supabase function: get_analytics_summary
-- Returns aggregated analytics data for the dashboard
-- =========================
CREATE OR REPLACE FUNCTION get_analytics_summary(
  p_days INT DEFAULT 30
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
  start_date TIMESTAMPTZ;
BEGIN
  -- Only allow authenticated users
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  start_date := NOW() - (p_days || ' days')::INTERVAL;

  SELECT json_build_object(
    'total_views', (SELECT COUNT(*) FROM page_view WHERE created_at >= start_date),
    'unique_visitors', (SELECT COUNT(DISTINCT visitor_hash) FROM visitor_session WHERE started_at >= start_date),
    'potential_recruiters', (SELECT COUNT(DISTINCT visitor_hash) FROM visitor_session WHERE started_at >= start_date AND is_potential_recruiter = TRUE),
    'views_today', (SELECT COUNT(*) FROM page_view WHERE created_at >= CURRENT_DATE),
    'visitors_today', (SELECT COUNT(DISTINCT session_id) FROM page_view WHERE created_at >= CURRENT_DATE),
    'top_pages', (
      SELECT json_agg(row_to_json(t))
      FROM (
        SELECT page_path, COUNT(*) as views
        FROM page_view
        WHERE created_at >= start_date
        GROUP BY page_path
        ORDER BY views DESC
        LIMIT 10
      ) t
    ),
    'top_referrers', (
      SELECT json_agg(row_to_json(t))
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
      SELECT json_agg(row_to_json(t))
      FROM (
        SELECT device_type, COUNT(*) as count
        FROM visitor_session
        WHERE started_at >= start_date AND device_type IS NOT NULL
        GROUP BY device_type
        ORDER BY count DESC
      ) t
    ),
    'browser_breakdown', (
      SELECT json_agg(row_to_json(t))
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
      SELECT json_agg(row_to_json(t))
      FROM (
        SELECT DATE(created_at) as date, COUNT(*) as views
        FROM page_view
        WHERE created_at >= start_date
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      ) t
    ),
    'recruiter_sessions', (
      SELECT json_agg(row_to_json(t))
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
            SELECT json_agg(json_build_object('page_path', pv.page_path, 'created_at', pv.created_at))
            FROM page_view pv
            WHERE pv.session_id = vs.id
            ORDER BY pv.created_at ASC
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
