CREATE OR REPLACE FUNCTION public.get_active_visitor_count(p_threshold timestamptz)
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT COUNT(DISTINCT visitor_hash)::integer
  FROM public.visitor_session
  WHERE last_seen_at >= p_threshold;
$$;
