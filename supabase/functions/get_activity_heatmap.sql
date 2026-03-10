CREATE OR REPLACE FUNCTION public.get_activity_heatmap(p_days integer DEFAULT 30)
RETURNS json
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
DECLARE
  result json;
BEGIN
  SELECT json_agg(row_data ORDER BY day_of_week, hour_of_day)
  INTO result
  FROM (
    SELECT
      EXTRACT(DOW FROM pv.created_at AT TIME ZONE 'America/Guayaquil')::integer AS day_of_week,
      EXTRACT(HOUR FROM pv.created_at AT TIME ZONE 'America/Guayaquil')::integer AS hour_of_day,
      COUNT(*)::integer AS count
    FROM public.page_view pv
    JOIN public.visitor_session vs ON vs.id = pv.session_id
    WHERE vs.started_at >= NOW() - (p_days || ' days')::interval
    GROUP BY day_of_week, hour_of_day
  ) row_data;

  RETURN COALESCE(result, '[]'::json);
END;
$$;
