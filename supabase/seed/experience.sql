INSERT INTO experience (id, company, start_date, end_date, position)
VALUES
(1, 'TechCorp', '2023-01-01', '2024-01-01', 1),
(2, 'StartupX', '2024-02-01', NULL, 2)
ON CONFLICT DO NOTHING;


INSERT INTO experience_translation (experience_id, language_id, role, description)
SELECT
  e.id,
  l.id,
  CASE
    WHEN l.code='es' THEN 'Desarrollador'
    WHEN l.code='en' THEN 'Developer'
  END,
  'Trabajo en desarrollo de software'
FROM experience e
CROSS JOIN language l
ON CONFLICT DO NOTHING;
