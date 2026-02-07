-- =============================================
-- PERFORMANCE INDEXES
-- =============================================

CREATE INDEX idx_project_source
ON project(source_type, source_id);

CREATE INDEX idx_image_source
ON image(source_type, source_id);

CREATE INDEX idx_document_source
ON document(source_type, source_id);

CREATE INDEX idx_skill_usage_source
ON skill_usages(source_type, source_id);

CREATE INDEX idx_profile_translation_lang
ON profile_translation(language_id);

CREATE INDEX idx_skill_category_translation_lang
ON skill_category_translation(language_id);

CREATE INDEX idx_skill_translation_lang
ON skill_translation(language_id);

CREATE INDEX idx_competitions_translation_lang
ON competitions_translation(language_id);

CREATE INDEX idx_experience_translation_lang
ON experience_translation(language_id);

CREATE INDEX idx_event_translation_lang
ON event_translation(language_id);

CREATE INDEX idx_project_translation_lang
ON project_translation(language_id);
