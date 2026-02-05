INSERT INTO skill_usages (id, skill_id, source_id, source_type, level)
VALUES
(1, 1, 1, 'project', 5),
(2, 3, 1, 'project', 4)
ON CONFLICT DO NOTHING;


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
