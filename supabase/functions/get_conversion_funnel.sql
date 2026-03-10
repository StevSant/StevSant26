CREATE OR REPLACE FUNCTION public.get_conversion_funnel(p_days integer DEFAULT 30)
RETURNS json
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
DECLARE
  result json;
BEGIN
  WITH period_sessions AS (
    SELECT
      vs.visitor_hash,
      vs.total_page_views,
      vs.is_potential_recruiter,
      EXISTS (
        SELECT 1 FROM public.cv_download cd
        WHERE cd.session_id = vs.id
      ) AS downloaded_cv,
      (SELECT COUNT(DISTINCT pv.page_path) FROM public.page_view pv WHERE pv.session_id = vs.id) AS unique_pages
    FROM public.visitor_session vs
    WHERE vs.started_at >= NOW() - (p_days || ' days')::interval
  ),
  visitor_agg AS (
    SELECT
      visitor_hash,
      SUM(total_page_views) AS total_views,
      MAX(unique_pages) AS max_unique_pages,
      BOOL_OR(is_potential_recruiter) AS is_recruiter,
      BOOL_OR(downloaded_cv) AS has_downloaded
    FROM period_sessions
    GROUP BY visitor_hash
  )
  SELECT json_build_object(
    'stages', json_build_array(
      json_build_object('name', 'visited', 'count', COUNT(*), 'label', 'Visited site'),
      json_build_object('name', 'engaged', 'count', COUNT(*) FILTER (WHERE total_views >= 3), 'label', 'Viewed 3+ pages'),
      json_build_object('name', 'explored', 'count', COUNT(*) FILTER (WHERE max_unique_pages >= 3), 'label', 'Explored 3+ sections'),
      json_build_object('name', 'recruiter', 'count', COUNT(*) FILTER (WHERE is_recruiter), 'label', 'Potential recruiter'),
      json_build_object('name', 'converted', 'count', COUNT(*) FILTER (WHERE has_downloaded), 'label', 'Downloaded CV')
    ),
    'total_visitors', COUNT(*)
  ) INTO result
  FROM visitor_agg;

  RETURN result;
END;
$$;
