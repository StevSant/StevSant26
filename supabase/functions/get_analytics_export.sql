CREATE OR REPLACE FUNCTION public.get_analytics_export(p_days integer DEFAULT 30)
RETURNS json
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
DECLARE
  result json;
BEGIN
  SELECT json_build_object(
    'period', json_build_object(
      'start', (NOW() - (p_days || ' days')::interval)::date,
      'end', NOW()::date,
      'days', p_days
    ),
    'kpis', (
      SELECT json_build_object(
        'total_views', COUNT(DISTINCT pv.id),
        'unique_visitors', COUNT(DISTINCT vs.visitor_hash),
        'potential_recruiters', COUNT(DISTINCT vs.visitor_hash) FILTER (WHERE vs.is_potential_recruiter),
        'cv_downloads', (SELECT COUNT(*) FROM public.cv_download cd JOIN public.visitor_session vs2 ON vs2.id = cd.session_id WHERE vs2.started_at >= NOW() - (p_days || ' days')::interval),
        'avg_session_duration', AVG(EXTRACT(EPOCH FROM (vs.last_seen_at::timestamptz - vs.started_at::timestamptz)))::integer,
        'bounce_rate', ROUND(COUNT(*) FILTER (WHERE vs.total_page_views <= 1)::numeric / NULLIF(COUNT(*), 0)::numeric * 100, 1)
      )
      FROM public.visitor_session vs
      LEFT JOIN public.page_view pv ON pv.session_id = vs.id
      WHERE vs.started_at >= NOW() - (p_days || ' days')::interval
    ),
    'daily_views', (
      SELECT COALESCE(json_agg(json_build_object('date', day, 'views', views) ORDER BY day), '[]'::json)
      FROM (
        SELECT vs.started_at::date AS day, COUNT(DISTINCT pv.id) AS views
        FROM public.visitor_session vs
        LEFT JOIN public.page_view pv ON pv.session_id = vs.id
        WHERE vs.started_at >= NOW() - (p_days || ' days')::interval
        GROUP BY vs.started_at::date
      ) dv
    ),
    'top_pages', (
      SELECT COALESCE(json_agg(json_build_object(
        'page_path', page_path, 'views', view_count,
        'unique_visitors', uniq, 'avg_duration', avg_dur
      ) ORDER BY view_count DESC), '[]'::json)
      FROM (
        SELECT pv.page_path, COUNT(*) AS view_count, COUNT(DISTINCT vs.visitor_hash) AS uniq,
          AVG(pv.duration_seconds) FILTER (WHERE pv.duration_seconds > 0)::integer AS avg_dur
        FROM public.page_view pv
        JOIN public.visitor_session vs ON vs.id = pv.session_id
        WHERE vs.started_at >= NOW() - (p_days || ' days')::interval
        GROUP BY pv.page_path
      ) tp
    ),
    'top_referrers', (
      SELECT COALESCE(json_agg(json_build_object('source', referrer_source, 'visits', cnt) ORDER BY cnt DESC), '[]'::json)
      FROM (
        SELECT referrer_source, COUNT(*) AS cnt
        FROM public.visitor_session
        WHERE started_at >= NOW() - (p_days || ' days')::interval AND referrer_source IS NOT NULL
        GROUP BY referrer_source
      ) tr
    ),
    'countries', (
      SELECT COALESCE(json_agg(json_build_object('country', country, 'visitors', cnt) ORDER BY cnt DESC), '[]'::json)
      FROM (
        SELECT country, COUNT(DISTINCT visitor_hash) AS cnt
        FROM public.visitor_session
        WHERE started_at >= NOW() - (p_days || ' days')::interval AND country IS NOT NULL
        GROUP BY country
      ) gc
    ),
    'devices', (
      SELECT COALESCE(json_agg(json_build_object('device', device_type, 'count', cnt) ORDER BY cnt DESC), '[]'::json)
      FROM (
        SELECT device_type, COUNT(*) AS cnt
        FROM public.visitor_session
        WHERE started_at >= NOW() - (p_days || ' days')::interval
        GROUP BY device_type
      ) dd
    )
  ) INTO result;

  RETURN result;
END;
$$;
