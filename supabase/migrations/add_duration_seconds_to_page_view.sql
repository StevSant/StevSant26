-- =========================
-- Migration: Add duration_seconds column to page_view
-- This column stores how long a visitor stayed on each page (in seconds).
-- The frontend tracks this and updates it when the user navigates away.
-- =========================

ALTER TABLE page_view
ADD COLUMN IF NOT EXISTS duration_seconds INT DEFAULT 0;

-- Index for faster avg duration queries
CREATE INDEX IF NOT EXISTS idx_page_view_duration ON page_view(duration_seconds)
WHERE duration_seconds > 0;
