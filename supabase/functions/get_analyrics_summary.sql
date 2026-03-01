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
    'visitors_today', (SELECT COUNT(DISTINCT vs.visitor_hash) FROM visitor_session vs JOIN page_view pv ON pv.session_id = vs.id WHERE pv.created_at >= CURRENT_DATE),
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
    ),
    'cv_downloads_total', (
      SELECT COUNT(*) FROM cv_download WHERE created_at >= start_date
    ),
    'cv_downloads_today', (
      SELECT COUNT(*) FROM cv_download WHERE created_at >= CURRENT_DATE
    ),
    'cv_downloads_breakdown', (
      SELECT COALESCE(json_agg(row_to_json(t)), '[]'::json)
      FROM (
        SELECT
          COALESCE(file_name, 'Unknown') as file_name,
          COALESCE(language, 'Unknown') as language,
          COUNT(*) as downloads
        FROM cv_download
        WHERE created_at >= start_date
        GROUP BY file_name, language
        ORDER BY downloads DESC
      ) t
    ),
    'language_breakdown', (
      SELECT COALESCE(json_agg(row_to_json(t)), '[]'::json)
      FROM (
        SELECT
          COALESCE(split_part(browser_language, '-', 1), 'unknown') as browser_language,
          SUM(cnt)::int as count
        FROM (
          SELECT
            COALESCE(browser_language, 'unknown') as browser_language,
            COUNT(*) as cnt
          FROM visitor_session
          WHERE started_at >= start_date AND browser_language IS NOT NULL
          GROUP BY browser_language
        ) raw
        GROUP BY split_part(browser_language, '-', 1)
        ORDER BY count DESC
        LIMIT 15
      ) t
    ),
    'country_breakdown', (
      SELECT COALESCE(json_agg(row_to_json(t)), '[]'::json)
      FROM (
        SELECT
          COALESCE(country, 'Unknown') as country,
          COUNT(*) as count
        FROM visitor_session
        WHERE started_at >= start_date AND country IS NOT NULL
        GROUP BY country
        ORDER BY count DESC
        LIMIT 15
      ) t
    )
  ) INTO result;

  RETURN result;
END;
$$;
