-- =============================================================================
-- Supabase Storage Bucket and Policies for Portfolio Documents
-- =============================================================================
-- This file creates the 'documents' bucket and defines security policies
-- for public read access and authenticated write access.
-- =============================================================================

-- Create the 'documents' bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents',
  'documents',
  true,  -- Public bucket (files are publicly accessible for download)
  20971520,  -- 20MB file size limit
  ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'image/jpeg',
    'image/png',
    'image/webp'
  ]::text[]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- =============================================================================
-- STORAGE POLICIES FOR DOCUMENTS
-- =============================================================================

-- Policy: Allow public read access to all files in the 'documents' bucket
CREATE POLICY "Public read access for documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'documents');

-- Policy: Allow authenticated users to upload documents
CREATE POLICY "Authenticated users can upload documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'documents'
  AND auth.role() = 'authenticated'
);

-- Policy: Allow authenticated users to update their uploaded documents
CREATE POLICY "Authenticated users can update documents"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'documents'
  AND auth.role() = 'authenticated'
)
WITH CHECK (
  bucket_id = 'documents'
  AND auth.role() = 'authenticated'
);

-- Policy: Allow authenticated users to delete documents
CREATE POLICY "Authenticated users can delete documents"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'documents'
  AND auth.role() = 'authenticated'
);

-- =============================================================================
-- USAGE NOTES
-- =============================================================================
-- 1. Accepted formats: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, JPEG, PNG, WebP
-- 2. Maximum file size: 20MB
-- 3. Folder structure: documents/{entity_type}/{entity_id}/{timestamp}_{filename}
-- 4. Example: documents/experiences/5/1738886400000-certificate.pdf
-- =============================================================================
