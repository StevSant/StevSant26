-- =============================================================================
-- Supabase Storage Bucket and Policies for Portfolio Images
-- =============================================================================
-- This file creates the 'images' bucket and defines security policies
-- for public read access and authenticated write access.
-- =============================================================================

-- Create the 'images' bucket if it doesn't exist
-- Note: In Supabase Dashboard, you can also create this via UI
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'images',
  'images',
  true,  -- Public bucket (files are publicly accessible)
  10485760,  -- 10MB file size limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']::text[]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- =============================================================================
-- STORAGE POLICIES
-- =============================================================================

-- Policy: Allow public read access to all files in the 'images' bucket
-- Anyone can view/download images without authentication
CREATE POLICY "Public read access for images"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');

-- Policy: Allow authenticated users to upload files
-- Only authenticated users can upload new images
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'images'
  AND auth.role() = 'authenticated'
);

-- Policy: Allow authenticated users to update their uploaded files
-- Users can update (replace) images
CREATE POLICY "Authenticated users can update images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'images'
  AND auth.role() = 'authenticated'
)
WITH CHECK (
  bucket_id = 'images'
  AND auth.role() = 'authenticated'
);

-- Policy: Allow authenticated users to delete files
-- Only authenticated users can delete images
CREATE POLICY "Authenticated users can delete images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'images'
  AND auth.role() = 'authenticated'
);

-- =============================================================================
-- OPTIONAL: Folder-based organization policies
-- =============================================================================
-- If you want to organize images by entity type, you can use folder prefixes
-- Example folder structure:
--   images/projects/{project_id}/{filename}
--   images/experiences/{experience_id}/{filename}
--   images/profile/{filename}
--
-- The current policies allow any authenticated user to manage any file.
-- For stricter control, you could add owner-based policies using metadata.
-- =============================================================================

-- =============================================================================
-- USAGE NOTES
-- =============================================================================
-- 1. Run this SQL in Supabase SQL Editor or via migrations
-- 2. The bucket is public, meaning files can be accessed via public URLs
-- 3. Only authenticated admin users can upload/modify/delete files
-- 4. File paths in the application should follow: {entity_type}/{id}/{timestamp}_{filename}
-- 5. Example public URL: https://{project}.supabase.co/storage/v1/object/public/images/projects/1/image.jpg
-- =============================================================================
