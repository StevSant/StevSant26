-- =========================
-- Supabase function: get_unique_visitors
-- Returns a list of unique visitors with aggregated session data
-- Supports filtering by device, referrer, recruiter status, country
-- =========================
CREATE OR REPLACE FUNCTION get_unique_visitors(
  p_days INT DEFAULT 30,
  p_device_type TEXT DEFAULT NULL,
  p_referrer TEXT DEFAULT NULL,
  p_is_recruiter BOOLEAN DEFAULT NULL,
  p_country TEXT DEFAULT NULL,
  p_search TEXT DEFAULT NULL
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

  SELECT COALESCE(json_agg(row_to_json(t) ORDER BY t.last_visit DESC), '[]'::json)
  FROM (
    SELECT
      vs.visitor_hash,
      COUNT(DISTINCT vs.id) as total_sessions,
      SUM(vs.total_page_views) as total_page_views,
      MIN(vs.started_at) as first_visit,
      MAX(vs.started_at) as last_visit,
      COALESCE(
        ROUND(
          (SELECT AVG(sub.session_dur)
           FROM (
             SELECT SUM(COALESCE(pv2.duration_seconds, 0)) as session_dur
             FROM page_view pv2
             WHERE pv2.session_id = ANY(array_agg(vs.id))
             GROUP BY pv2.session_id
             HAVING SUM(COALESCE(pv2.duration_seconds, 0)) > 0
           ) sub
          )::numeric, 0
        ), 0
      ) as avg_session_duration,
      -- Pick info from the most recent session
      (array_agg(vs.device_type ORDER BY vs.started_at DESC))[1] as device_type,
      (array_agg(vs.browser ORDER BY vs.started_at DESC))[1] as browser,
      (array_agg(vs.os ORDER BY vs.started_at DESC))[1] as os,
      (array_agg(vs.country ORDER BY vs.started_at DESC))[1] as country,
      (array_agg(vs.city ORDER BY vs.started_at DESC))[1] as city,
      bool_or(vs.is_potential_recruiter) as is_potential_recruiter,
      -- All distinct referrer sources
      (
        SELECT COALESCE(json_agg(DISTINCT sub_ref), '[]'::json)
        FROM unnest(array_agg(vs.referrer_source)) as sub_ref
        WHERE sub_ref IS NOT NULL AND sub_ref != ''
      ) as referrer_sources,
      -- All unique pages visited across sessions
      (
        SELECT COALESCE(json_agg(DISTINCT pv.page_path), '[]'::json)
        FROM page_view pv
        WHERE pv.session_id = ANY(array_agg(vs.id))
      ) as unique_pages_visited
    FROM visitor_session vs
    WHERE vs.started_at >= start_date
      AND (p_device_type IS NULL OR vs.device_type = p_device_type)
      AND (p_is_recruiter IS NULL OR vs.is_potential_recruiter = p_is_recruiter)
      AND (p_country IS NULL OR vs.country ILIKE ('%' || p_country || '%'))
      AND (p_referrer IS NULL OR vs.referrer_source ILIKE ('%' || p_referrer || '%'))
      AND (
        p_search IS NULL
        OR vs.country ILIKE ('%' || p_search || '%')
        OR vs.city ILIKE ('%' || p_search || '%')
        OR vs.referrer_source ILIKE ('%' || p_search || '%')
        OR vs.browser ILIKE ('%' || p_search || '%')
        OR vs.os ILIKE ('%' || p_search || '%')
        OR vs.device_type ILIKE ('%' || p_search || '%')
      )
    GROUP BY vs.visitor_hash
  ) t
  INTO result;

  RETURN result;
END;
$$;
