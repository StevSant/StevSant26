-- Add organization column to visitor_session for reverse IP lookup
-- Captures ISP/organization name from ipapi.co (already used for geolocation)

ALTER TABLE visitor_session ADD COLUMN IF NOT EXISTS organization TEXT;
