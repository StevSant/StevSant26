CREATE OR REPLACE FUNCTION public.get_content_ranking(p_days integer DEFAULT 30)
RETURNS json
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
DECLARE
  result json;
BEGIN
  WITH page_metrics AS (
    SELECT
      pv.page_path,
      COUNT(*) AS view_count,
      COUNT(DISTINCT vs.visitor_hash) AS unique_visitors,
      AVG(pv.duration_seconds) FILTER (WHERE pv.duration_seconds > 0)::integer AS avg_duration,
      COUNT(DISTINCT vs.visitor_hash) FILTER (WHERE vs.is_potential_recruiter) AS recruiter_views,
      COUNT(DISTINCT cd.id) AS cv_downloads_after
    FROM public.page_view pv
    JOIN public.visitor_session vs ON vs.id = pv.session_id
    LEFT JOIN public.cv_download cd ON cd.session_id = vs.id AND cd.created_at > pv.created_at
    WHERE vs.started_at >= NOW() - (p_days || ' days')::interval
    GROUP BY pv.page_path
  ),
  scored AS (
    SELECT
      pm.*,
      (
        LEAST(pm.view_count * 2, 30) +
        LEAST(pm.unique_visitors * 3, 30) +
        CASE WHEN pm.avg_duration > 30 THEN LEAST(pm.avg_duration / 10, 20) ELSE 0 END +
        pm.recruiter_views * 5 +
        pm.cv_downloads_after * 10
      )::integer AS content_score
    FROM page_metrics pm
  )
  SELECT COALESCE(json_agg(json_build_object(
    'page_path', s.page_path,
    'content_score', s.content_score,
    'view_count', s.view_count,
    'unique_visitors', s.unique_visitors,
    'avg_duration', COALESCE(s.avg_duration, 0),
    'recruiter_views', s.recruiter_views,
    'cv_downloads_after', s.cv_downloads_after
  ) ORDER BY s.content_score DESC), '[]'::json)
  INTO result
  FROM scored s;

  RETURN result;
END;
$$;
