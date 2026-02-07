-- =============================================================================
-- RLS policies for content_section and content_section_translation
-- =============================================================================

-- Enable RLS
ALTER TABLE content_section ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_section_translation ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Public can read content_section"
  ON content_section FOR SELECT
  USING (true);

CREATE POLICY "Public can read content_section_translation"
  ON content_section_translation FOR SELECT
  USING (true);

-- Authenticated write
CREATE POLICY "Authenticated can insert content_section"
  ON content_section FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can update content_section"
  ON content_section FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can delete content_section"
  ON content_section FOR DELETE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can insert content_section_translation"
  ON content_section_translation FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can update content_section_translation"
  ON content_section_translation FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can delete content_section_translation"
  ON content_section_translation FOR DELETE
  USING (auth.role() = 'authenticated');
