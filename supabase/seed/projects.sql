INSERT INTO project (id, url, position) VALUES
(1, 'https://portfolio.dev', 1),
(2, 'https://github.com/project-api', 2)
ON CONFLICT DO NOTHING;


INSERT INTO project_translation (project_id, language_id, title, description)
SELECT
  p.id,
  l.id,
  CASE
    WHEN p.id=1 AND l.code='es' THEN 'Portafolio personal'
    WHEN p.id=1 AND l.code='en' THEN 'Personal portfolio'

    WHEN p.id=2 AND l.code='es' THEN 'API de gestión'
    WHEN p.id=2 AND l.code='en' THEN 'Management API'
  END,
  CASE
    WHEN p.id=1 AND l.code='es' THEN 'Web para mostrar proyectos y experiencia'
    WHEN p.id=1 AND l.code='en' THEN 'Website to showcase projects and experience'

    WHEN p.id=2 AND l.code='es' THEN 'Backend escalable con autenticación'
    WHEN p.id=2 AND l.code='en' THEN 'Scalable backend with authentication'
  END
FROM project p
CROSS JOIN language l
ON CONFLICT DO NOTHING;
