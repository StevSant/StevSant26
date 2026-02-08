-- ================================================
-- SKILL USAGES SEED FILE
-- Uses 'code' field for stable references
-- ================================================

-- Insert skill usages using code-based references
INSERT INTO skill_usages (skill_id, source_id, source_type, level)
VALUES
(
  (SELECT id FROM skill WHERE code = 'django'),
  (SELECT id FROM project WHERE code = 'portfolio'),
  'project',
  5
),
(
  (SELECT id FROM skill WHERE code = 'angular'),
  (SELECT id FROM project WHERE code = 'portfolio'),
  'project',
  4
)
ON CONFLICT DO NOTHING;

-- ======================
-- TRANSLATIONS
-- ======================

INSERT INTO skill_usages_translation (skill_usages_id, language_id, notes)
SELECT
  su.id,
  l.id,
  CASE l.code
    WHEN 'es' THEN 'Usado intensivamente'
    WHEN 'en' THEN 'Used extensively'
  END
FROM skill_usages su
CROSS JOIN language l
ON CONFLICT DO NOTHING;
