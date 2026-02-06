-- =============================================
-- Migration: Add social links to profile table
-- =============================================

ALTER TABLE profile ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE profile ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE profile ADD COLUMN IF NOT EXISTS linkedin_url TEXT;
ALTER TABLE profile ADD COLUMN IF NOT EXISTS github_url TEXT;
ALTER TABLE profile ADD COLUMN IF NOT EXISTS instagram_url TEXT;
ALTER TABLE profile ADD COLUMN IF NOT EXISTS whatsapp TEXT;
ALTER TABLE profile ADD COLUMN IF NOT EXISTS cv_url TEXT;
