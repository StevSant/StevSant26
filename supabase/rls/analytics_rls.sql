-- =============================================
-- RLS for Analytics Tables
-- =============================================

-- Enable RLS
ALTER TABLE visitor_session ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_view ENABLE ROW LEVEL SECURITY;

-- Anonymous users can INSERT (tracking from portfolio)
CREATE POLICY "Anon insert visitor_session"
ON visitor_session
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anon insert page_view"
ON page_view
FOR INSERT
WITH CHECK (true);

-- Anonymous users can UPDATE their own session (to increment page views)
CREATE POLICY "Anon update visitor_session"
ON visitor_session
FOR UPDATE
USING (true)
WITH CHECK (true);

-- Anonymous users can UPDATE page_view (to record duration_seconds)
CREATE POLICY "Anon update page_view"
ON page_view
FOR UPDATE
USING (true)
WITH CHECK (true);

-- Anonymous users can SELECT page_view (needed for .insert().select('id') to return the row ID)
CREATE POLICY "Anon select own page_view"
ON page_view
FOR SELECT
TO anon
USING (true);

-- Only authenticated users can SELECT (for dashboard)
CREATE POLICY "Admin read visitor_session"
ON visitor_session
FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admin read page_view"
ON page_view
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Admin full access for management
CREATE POLICY "Admin delete visitor_session"
ON visitor_session
FOR DELETE
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admin delete page_view"
ON page_view
FOR DELETE
USING (auth.uid() IS NOT NULL);
