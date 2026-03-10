-- Enable pg_net extension for async HTTP calls
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Function to send webhook to Edge Function
CREATE OR REPLACE FUNCTION public.notify_analytics_alert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  payload jsonb;
  edge_function_url text := 'https://veelrxhltxgdbhytjpcu.supabase.co/functions/v1/send-analytics-alert';
BEGIN
  payload := jsonb_build_object(
    'type', TG_OP,
    'table', TG_TABLE_NAME,
    'record', to_jsonb(NEW),
    'old_record', CASE WHEN TG_OP = 'UPDATE' THEN to_jsonb(OLD) ELSE NULL END
  );

  PERFORM net.http_post(
    url := edge_function_url,
    body := payload,
    headers := jsonb_build_object(
      'Content-Type', 'application/json'
    )
  );

  RETURN NEW;
END;
$$;

-- Trigger: recruiter detected (visitor_session UPDATE where is_potential_recruiter changes to true)
CREATE OR REPLACE TRIGGER on_recruiter_detected
  AFTER UPDATE OF is_potential_recruiter ON public.visitor_session
  FOR EACH ROW
  WHEN (NEW.is_potential_recruiter = true AND (OLD.is_potential_recruiter IS DISTINCT FROM true))
  EXECUTE FUNCTION public.notify_analytics_alert();

-- Trigger: CV downloaded (cv_download INSERT)
CREATE OR REPLACE TRIGGER on_cv_downloaded
  AFTER INSERT ON public.cv_download
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_analytics_alert();
