-- =============================================
-- Migration: Add social links to profile table
-- + Create cv_document table
-- =============================================

ALTER TABLE profile ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE profile ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE profile ADD COLUMN IF NOT EXISTS linkedin_url TEXT;
ALTER TABLE profile ADD COLUMN IF NOT EXISTS github_url TEXT;
ALTER TABLE profile ADD COLUMN IF NOT EXISTS instagram_url TEXT;
ALTER TABLE profile ADD COLUMN IF NOT EXISTS whatsapp TEXT;

-- Remove cv_url if it existed
ALTER TABLE profile DROP COLUMN IF EXISTS cv_url;

-- Create cv_document table for multiple CVs
CREATE TABLE IF NOT EXISTS cv_document (
  id SERIAL PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES profile(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  file_name TEXT,
  label TEXT,
  language_id INT REFERENCES language(id) ON DELETE SET NULL,
  position INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS on cv_document
ALTER TABLE cv_document ENABLE ROW LEVEL SECURITY;

-- Read policy: anyone can read
CREATE POLICY "cv_document_read" ON cv_document FOR SELECT USING (true);

-- Write policy: only the owner
CREATE POLICY "cv_document_write" ON cv_document FOR ALL USING (
  profile_id = auth.uid()
) WITH CHECK (
  profile_id = auth.uid()
);
