-- Migration: Enable Supabase Realtime on analytics tables
-- Required for live visitor counter and smart toast alerts

ALTER PUBLICATION supabase_realtime ADD TABLE visitor_session;
ALTER PUBLICATION supabase_realtime ADD TABLE cv_download;
ALTER PUBLICATION supabase_realtime ADD TABLE page_view;
