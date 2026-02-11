-- Add demo_url to project (e.g. YouTube, Loom, or any cloud demo link)
ALTER TABLE project
  ADD COLUMN IF NOT EXISTS demo_url TEXT;
