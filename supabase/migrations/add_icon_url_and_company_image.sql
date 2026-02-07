-- =============================================
-- Migration: Add icon_url to skill, company_image_url to experience
-- =============================================

-- Add icon_url to skill table (for skill icons like Python, JS, Angular, etc.)
ALTER TABLE skill ADD COLUMN IF NOT EXISTS icon_url TEXT;

-- Add company_image_url to experience table (for company/workplace photos)
ALTER TABLE experience ADD COLUMN IF NOT EXISTS company_image_url TEXT;
