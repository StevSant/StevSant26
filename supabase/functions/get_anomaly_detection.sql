CREATE OR REPLACE FUNCTION public.get_anomaly_detection(p_days integer DEFAULT 30)
RETURNS json
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
DECLARE
  result json;
BEGIN
  WITH daily_stats AS (
    SELECT
      vs.started_at::date AS day,
      COUNT(DISTINCT pv.id) AS views,
      COUNT(DISTINCT vs.visitor_hash) AS visitors,
      COUNT(DISTINCT vs.visitor_hash) FILTER (WHERE vs.is_potential_recruiter) AS recruiters
    FROM public.visitor_session vs
    LEFT JOIN public.page_view pv ON pv.session_id = vs.id
    WHERE vs.started_at >= NOW() - (p_days || ' days')::interval
    GROUP BY vs.started_at::date
  ),
  stats AS (
    SELECT
      AVG(views) AS avg_views,
      STDDEV_POP(views) AS stddev_views,
      AVG(visitors) AS avg_visitors,
      STDDEV_POP(visitors) AS stddev_visitors
    FROM daily_stats
  ),
  anomalies AS (
    SELECT
      ds.day,
      ds.views,
      ds.visitors,
      ds.recruiters,
      CASE
        WHEN s.stddev_views > 0 AND ds.views > s.avg_views + 2 * s.stddev_views THEN 'spike'
        WHEN s.stddev_views > 0 AND ds.views < GREATEST(0, s.avg_views - 2 * s.stddev_views) THEN 'drop'
        ELSE NULL
      END AS views_anomaly,
      CASE
        WHEN s.stddev_visitors > 0 AND ds.visitors > s.avg_visitors + 2 * s.stddev_visitors THEN 'spike'
        WHEN s.stddev_visitors > 0 AND ds.visitors < GREATEST(0, s.avg_visitors - 2 * s.stddev_visitors) THEN 'drop'
        ELSE NULL
      END AS visitors_anomaly
    FROM daily_stats ds, stats s
  ),
  referrer_anomalies AS (
    SELECT
      vs.referrer_source,
      vs.started_at::date AS day,
      COUNT(*) AS session_count
    FROM public.visitor_session vs
    WHERE vs.started_at >= NOW() - (p_days || ' days')::interval
      AND vs.referrer_source IS NOT NULL
    GROUP BY vs.referrer_source, vs.started_at::date
    HAVING COUNT(*) >= 3
  ),
  geo_anomalies AS (
    SELECT
      vs.country,
      vs.started_at::date AS day,
      COUNT(DISTINCT vs.visitor_hash) AS visitor_count
    FROM public.visitor_session vs
    WHERE vs.started_at >= NOW() - (p_days || ' days')::interval
      AND vs.country IS NOT NULL
    GROUP BY vs.country, vs.started_at::date
    HAVING COUNT(DISTINCT vs.visitor_hash) >= 3
  )
  SELECT json_build_object(
    'baseline', (SELECT row_to_json(stats) FROM stats),
    'daily_anomalies', (
      SELECT COALESCE(json_agg(json_build_object(
        'day', a.day, 'views', a.views, 'visitors', a.visitors,
        'recruiters', a.recruiters, 'views_anomaly', a.views_anomaly,
        'visitors_anomaly', a.visitors_anomaly
      ) ORDER BY a.day), '[]'::json)
      FROM anomalies a
      WHERE a.views_anomaly IS NOT NULL OR a.visitors_anomaly IS NOT NULL
    ),
    'referrer_bursts', (
      SELECT COALESCE(json_agg(json_build_object(
        'referrer_source', ra.referrer_source, 'day', ra.day, 'session_count', ra.session_count
      ) ORDER BY ra.session_count DESC), '[]'::json)
      FROM referrer_anomalies ra
    ),
    'geo_bursts', (
      SELECT COALESCE(json_agg(json_build_object(
        'country', ga.country, 'day', ga.day, 'visitor_count', ga.visitor_count
      ) ORDER BY ga.visitor_count DESC), '[]'::json)
      FROM geo_anomalies ga
    )
  ) INTO result;

  RETURN result;
END;
$$;
