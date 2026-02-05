INSERT INTO skill (id, skill_category_id, position) VALUES
(1, 1, 1), -- Backend
(2, 1, 2),
(3, 2, 1), -- Frontend
(4, 2, 2),
(5, 3, 1),
(6, 3, 2)
ON CONFLICT DO NOTHING;


INSERT INTO skill_translation (skill_id, language_id, name, description)
SELECT
  s.id,
  l.id,
  CASE
    WHEN s.id=1 THEN 'Node.js'
    WHEN s.id=2 THEN 'PostgreSQL'
    WHEN s.id=3 THEN 'React'
    WHEN s.id=4 THEN 'Tailwind CSS'
    WHEN s.id=5 THEN 'Docker'
    WHEN s.id=6 THEN 'Git'
  END,
  CASE l.code
    WHEN 'es' THEN 'Tecnología usada en proyectos profesionales'
    WHEN 'en' THEN 'Technology used in professional projects'
  END
FROM skill s
CROSS JOIN language l
ON CONFLICT DO NOTHING;
