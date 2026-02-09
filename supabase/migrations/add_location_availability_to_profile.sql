-- =============================================
-- Migration: Add location & availability fields to profile
-- =============================================

ALTER TABLE profile ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE profile ADD COLUMN IF NOT EXISTS country_code TEXT;
ALTER TABLE profile ADD COLUMN IF NOT EXISTS timezone TEXT;
ALTER TABLE profile ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION;
ALTER TABLE profile ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;
ALTER TABLE profile ADD COLUMN IF NOT EXISTS job_title TEXT;
ALTER TABLE profile ADD COLUMN IF NOT EXISTS is_available BOOLEAN DEFAULT true;

-- Add job_title to profile_translation for multilingual support
ALTER TABLE profile_translation ADD COLUMN IF NOT EXISTS headline TEXT;
