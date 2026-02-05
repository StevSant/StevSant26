INSERT INTO skill_category (id, position) VALUES
(1, 1),
(2, 2),
(3, 3)
ON CONFLICT DO NOTHING;


INSERT INTO skill_category_translation (skill_category_id, language_id, name, approach)
SELECT
  sc.id,
  l.id,
  CASE
    WHEN sc.id = 1 AND l.code='es' THEN 'Backend'
    WHEN sc.id = 1 AND l.code='en' THEN 'Backend'

    WHEN sc.id = 2 AND l.code='es' THEN 'Frontend'
    WHEN sc.id = 2 AND l.code='en' THEN 'Frontend'

    WHEN sc.id = 3 AND l.code='es' THEN 'Herramientas'
    WHEN sc.id = 3 AND l.code='en' THEN 'Tools'
  END,
  'Professional'
FROM skill_category sc
CROSS JOIN language l
ON CONFLICT DO NOTHING;
