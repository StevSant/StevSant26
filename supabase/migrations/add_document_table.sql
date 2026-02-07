-- =============================================
-- Migration: Add polymorphic document table
-- Similar to the image table but for documents (PDFs, certificates, etc.)
-- =============================================

-- =========================
-- Tabla: document (polimórfica)
-- =========================
CREATE TABLE IF NOT EXISTS document (
  id SERIAL PRIMARY KEY,
  url TEXT NOT NULL,
  file_name TEXT,
  file_type TEXT,
  file_size BIGINT,
  label TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  source_id INT,
  source_type TEXT,
  is_archived BOOLEAN DEFAULT false,
  is_pinned BOOLEAN DEFAULT false,
  position INT
);

-- =========================
-- Index for polymorphic lookups
-- =========================
CREATE INDEX idx_document_source
ON document(source_type, source_id);
