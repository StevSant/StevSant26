CREATE OR REPLACE FUNCTION public.get_visitor_engagement_scores(p_days integer DEFAULT 30)
RETURNS json
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
DECLARE
  result json;
BEGIN
  WITH visitor_metrics AS (
    SELECT
      vs.visitor_hash,
      COUNT(DISTINCT vs.id) AS session_count,
      SUM(vs.total_page_views) AS total_views,
      MAX((SELECT COUNT(DISTINCT pv.page_path) FROM public.page_view pv WHERE pv.session_id = vs.id)) AS max_unique_pages,
      AVG(EXTRACT(EPOCH FROM (vs.last_seen_at::timestamptz - vs.started_at::timestamptz)))::integer AS avg_duration_secs,
      BOOL_OR(vs.is_potential_recruiter) AS is_recruiter,
      BOOL_OR(EXISTS (SELECT 1 FROM public.cv_download cd WHERE cd.session_id = vs.id)) AS downloaded_cv,
      MAX(vs.country) AS country,
      MAX(vs.city) AS city,
      MAX(vs.organization) AS organization,
      MAX(vs.device_type) AS device_type,
      MAX(vs.referrer_source) AS referrer_source,
      MAX(vs.last_seen_at) AS last_seen_at
    FROM public.visitor_session vs
    WHERE vs.started_at >= NOW() - (p_days || ' days')::interval
    GROUP BY vs.visitor_hash
  ),
  scored AS (
    SELECT
      vm.*,
      (
        LEAST(vm.session_count * 10, 30) +
        LEAST(vm.total_views * 3, 30) +
        LEAST(vm.max_unique_pages * 5, 20) +
        CASE WHEN vm.avg_duration_secs > 60 THEN LEAST(vm.avg_duration_secs / 30, 10) ELSE 0 END +
        CASE WHEN vm.is_recruiter THEN 5 ELSE 0 END +
        CASE WHEN vm.downloaded_cv THEN 5 ELSE 0 END
      )::integer AS engagement_score
    FROM visitor_metrics vm
  )
  SELECT json_build_object(
    'visitors', (
      SELECT COALESCE(json_agg(json_build_object(
        'visitor_hash', s.visitor_hash,
        'engagement_score', s.engagement_score,
        'session_count', s.session_count,
        'total_views', s.total_views,
        'max_unique_pages', s.max_unique_pages,
        'avg_duration_secs', s.avg_duration_secs,
        'is_recruiter', s.is_recruiter,
        'downloaded_cv', s.downloaded_cv,
        'country', s.country,
        'city', s.city,
        'organization', s.organization,
        'device_type', s.device_type,
        'referrer_source', s.referrer_source,
        'last_seen_at', s.last_seen_at
      ) ORDER BY s.engagement_score DESC), '[]'::json)
      FROM scored s
    ),
    'distribution', json_build_object(
      'high', (SELECT COUNT(*) FROM scored WHERE engagement_score >= 50),
      'medium', (SELECT COUNT(*) FROM scored WHERE engagement_score >= 20 AND engagement_score < 50),
      'low', (SELECT COUNT(*) FROM scored WHERE engagement_score < 20)
    ),
    'avg_score', (SELECT ROUND(AVG(engagement_score), 1) FROM scored)
  ) INTO result;

  RETURN result;
END;
$$;
