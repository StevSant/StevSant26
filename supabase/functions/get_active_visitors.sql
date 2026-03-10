CREATE OR REPLACE FUNCTION public.get_active_visitors(p_threshold timestamptz)
RETURNS json
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT COALESCE(json_agg(json_build_object(
    'visitor_hash', visitor_hash,
    'last_seen_at', last_seen_at,
    'started_at', started_at,
    'total_page_views', total_page_views,
    'referrer_source', referrer_source,
    'country', country,
    'city', city,
    'device_type', device_type,
    'browser', browser,
    'is_potential_recruiter', is_potential_recruiter,
    'current_page', (
      SELECT pv.page_path
      FROM public.page_view pv
      WHERE pv.session_id = vs.id
      ORDER BY pv.created_at DESC
      LIMIT 1
    )
  ) ORDER BY last_seen_at DESC), '[]'::json)
  FROM public.visitor_session vs
  WHERE last_seen_at >= p_threshold;
$$;
