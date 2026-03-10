CREATE OR REPLACE FUNCTION public.get_bounce_rate(p_days integer DEFAULT 30)
RETURNS json
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
DECLARE
  result json;
BEGIN
  SELECT json_build_object(
    'total_sessions', COUNT(*),
    'bounced_sessions', COUNT(*) FILTER (WHERE total_page_views <= 1),
    'bounce_rate', CASE
      WHEN COUNT(*) > 0 THEN ROUND((COUNT(*) FILTER (WHERE total_page_views <= 1)::numeric / COUNT(*)::numeric) * 100, 1)
      ELSE 0
    END,
    'daily', (
      SELECT json_agg(daily_data ORDER BY day)
      FROM (
        SELECT
          started_at::date AS day,
          COUNT(*) AS total,
          COUNT(*) FILTER (WHERE total_page_views <= 1) AS bounced,
          CASE WHEN COUNT(*) > 0
            THEN ROUND((COUNT(*) FILTER (WHERE total_page_views <= 1)::numeric / COUNT(*)::numeric) * 100, 1)
            ELSE 0 END AS rate
        FROM public.visitor_session
        WHERE started_at >= NOW() - (p_days || ' days')::interval
        GROUP BY started_at::date
      ) daily_data
    )
  ) INTO result
  FROM public.visitor_session
  WHERE started_at >= NOW() - (p_days || ' days')::interval;

  RETURN result;
END;
$$;
