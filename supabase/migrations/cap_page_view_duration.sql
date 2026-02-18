-- =============================================
-- Migration: Fix inflated page_view durations caused by idle tabs
-- =============================================
-- The heartbeat mechanism previously had no idle detection, causing
-- runaway durations when a browser tab was left open and idle.
-- This migration fixes existing inflated records.
-- Going forward, the frontend uses idle detection (pauses after 5 min
-- of no user interaction) instead of a hard cap.

-- Fix existing inflated data: cap any unreasonably long page view
-- at 1 hour (3600s). Legitimate active browsing rarely exceeds this.
UPDATE page_view
SET duration_seconds = 3600
WHERE duration_seconds > 3600;
