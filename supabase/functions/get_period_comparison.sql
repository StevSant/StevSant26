CREATE OR REPLACE FUNCTION public.get_period_comparison(
  p_start_a date,
  p_end_a date,
  p_start_b date,
  p_end_b date
)
RETURNS json
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
DECLARE
  result json;
BEGIN
  WITH period_a AS (
    SELECT
      COUNT(DISTINCT pv.id) AS total_views,
      COUNT(DISTINCT vs.visitor_hash) AS unique_visitors,
      COUNT(DISTINCT vs.visitor_hash) FILTER (WHERE vs.is_potential_recruiter) AS recruiters,
      COUNT(DISTINCT cd.id) AS cv_downloads,
      AVG(EXTRACT(EPOCH FROM (vs.last_seen_at::timestamptz - vs.started_at::timestamptz)))::integer AS avg_duration,
      COUNT(*) FILTER (WHERE vs.total_page_views <= 1)::numeric / NULLIF(COUNT(*), 0)::numeric * 100 AS bounce_rate
    FROM public.visitor_session vs
    LEFT JOIN public.page_view pv ON pv.session_id = vs.id
    LEFT JOIN public.cv_download cd ON cd.session_id = vs.id
    WHERE vs.started_at::date BETWEEN p_start_a AND p_end_a
  ),
  period_b AS (
    SELECT
      COUNT(DISTINCT pv.id) AS total_views,
      COUNT(DISTINCT vs.visitor_hash) AS unique_visitors,
      COUNT(DISTINCT vs.visitor_hash) FILTER (WHERE vs.is_potential_recruiter) AS recruiters,
      COUNT(DISTINCT cd.id) AS cv_downloads,
      AVG(EXTRACT(EPOCH FROM (vs.last_seen_at::timestamptz - vs.started_at::timestamptz)))::integer AS avg_duration,
      COUNT(*) FILTER (WHERE vs.total_page_views <= 1)::numeric / NULLIF(COUNT(*), 0)::numeric * 100 AS bounce_rate
    FROM public.visitor_session vs
    LEFT JOIN public.page_view pv ON pv.session_id = vs.id
    LEFT JOIN public.cv_download cd ON cd.session_id = vs.id
    WHERE vs.started_at::date BETWEEN p_start_b AND p_end_b
  ),
  daily_a AS (
    SELECT vs.started_at::date AS day, COUNT(DISTINCT pv.id) AS views
    FROM public.visitor_session vs
    LEFT JOIN public.page_view pv ON pv.session_id = vs.id
    WHERE vs.started_at::date BETWEEN p_start_a AND p_end_a
    GROUP BY vs.started_at::date
  ),
  daily_b AS (
    SELECT vs.started_at::date AS day, COUNT(DISTINCT pv.id) AS views
    FROM public.visitor_session vs
    LEFT JOIN public.page_view pv ON pv.session_id = vs.id
    WHERE vs.started_at::date BETWEEN p_start_b AND p_end_b
    GROUP BY vs.started_at::date
  )
  SELECT json_build_object(
    'period_a', (SELECT row_to_json(period_a) FROM period_a),
    'period_b', (SELECT row_to_json(period_b) FROM period_b),
    'daily_a', (SELECT COALESCE(json_agg(json_build_object('day', day, 'views', views) ORDER BY day), '[]'::json) FROM daily_a),
    'daily_b', (SELECT COALESCE(json_agg(json_build_object('day', day, 'views', views) ORDER BY day), '[]'::json) FROM daily_b)
  ) INTO result;

  RETURN result;
END;
$$;
