CREATE OR REPLACE FUNCTION public.get_visitor_retention(p_days integer DEFAULT 30)
RETURNS json
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
DECLARE
  result json;
BEGIN
  WITH visitor_visits AS (
    SELECT
      visitor_hash,
      COUNT(*) AS session_count,
      MIN(started_at) AS first_visit,
      MAX(started_at) AS last_visit
    FROM public.visitor_session
    GROUP BY visitor_hash
  ),
  period_visitors AS (
    SELECT
      vv.visitor_hash,
      vv.session_count,
      vv.first_visit,
      CASE
        WHEN vv.first_visit >= NOW() - (p_days || ' days')::interval THEN 'new'
        ELSE 'returning'
      END AS visitor_type
    FROM visitor_visits vv
    WHERE EXISTS (
      SELECT 1 FROM public.visitor_session vs
      WHERE vs.visitor_hash = vv.visitor_hash
      AND vs.started_at >= NOW() - (p_days || ' days')::interval
    )
  )
  SELECT json_build_object(
    'total_visitors', COUNT(*),
    'new_visitors', COUNT(*) FILTER (WHERE visitor_type = 'new'),
    'returning_visitors', COUNT(*) FILTER (WHERE visitor_type = 'returning'),
    'return_rate', CASE
      WHEN COUNT(*) > 0 THEN ROUND((COUNT(*) FILTER (WHERE visitor_type = 'returning')::numeric / COUNT(*)::numeric) * 100, 1)
      ELSE 0
    END,
    'avg_sessions_returning', ROUND(AVG(session_count) FILTER (WHERE visitor_type = 'returning'), 1),
    'daily', (
      SELECT json_agg(daily_data ORDER BY day)
      FROM (
        SELECT
          vs.started_at::date AS day,
          COUNT(DISTINCT vs.visitor_hash) AS total,
          COUNT(DISTINCT vs.visitor_hash) FILTER (WHERE pv.visitor_type = 'new') AS new_count,
          COUNT(DISTINCT vs.visitor_hash) FILTER (WHERE pv.visitor_type = 'returning') AS returning_count
        FROM public.visitor_session vs
        JOIN period_visitors pv ON pv.visitor_hash = vs.visitor_hash
        WHERE vs.started_at >= NOW() - (p_days || ' days')::interval
        GROUP BY vs.started_at::date
      ) daily_data
    )
  ) INTO result
  FROM period_visitors;

  RETURN result;
END;
$$;
