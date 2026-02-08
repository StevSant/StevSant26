-- ================================================
-- MIGRATION: Add education_type and credential fields
-- Allows categorizing education entries as:
--   'formal'        — University, college, high school
--   'course'        — Online courses, bootcamps, workshops
--   'certification' — Professional certifications
-- ================================================

-- Add education_type column with default 'formal' for existing records
ALTER TABLE education
  ADD COLUMN IF NOT EXISTS education_type TEXT NOT NULL DEFAULT 'formal'
    CHECK (education_type IN ('formal', 'course', 'certification'));

-- Credential URL: link to verify the certificate online
ALTER TABLE education
  ADD COLUMN IF NOT EXISTS credential_url TEXT;

-- Credential ID: certificate/credential identifier
ALTER TABLE education
  ADD COLUMN IF NOT EXISTS credential_id TEXT;

-- Index for filtering by type
CREATE INDEX IF NOT EXISTS idx_education_type ON education(education_type);
