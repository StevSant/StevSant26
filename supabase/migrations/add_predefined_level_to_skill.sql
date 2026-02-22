-- =============================================
-- Migration: Add predefined_level column to skill
-- =============================================
-- Allows setting a default proficiency level for skills
-- that don't derive their level from project usages
-- (e.g., spoken languages like Spanish, English).

ALTER TABLE skill ADD COLUMN IF NOT EXISTS predefined_level INT;
