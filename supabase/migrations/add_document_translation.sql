-- =============================================
-- DOCUMENT TRANSLATION TABLE
-- =============================================
-- Stores multilingual label and description for documents.
-- Follows the same pattern as other *_translation tables.

CREATE TABLE IF NOT EXISTS document_translation (
  id SERIAL PRIMARY KEY,
  document_id INT NOT NULL REFERENCES document(id) ON DELETE CASCADE,
  language_id INT NOT NULL REFERENCES language(id),
  label TEXT,
  description TEXT,

  UNIQUE(document_id, language_id)
);
