-- =============================================
-- Seed: project
-- =============================================

INSERT INTO project (code, url, position) VALUES
('portfolio', 'https://portfolio.dev', 1),
('management_api', 'https://github.com/project-api', 2)
ON CONFLICT (code) DO NOTHING;


INSERT INTO project_translation (project_id, language_id, title, description)
SELECT
  p.id,
  l.id,
  CASE
    WHEN p.code='portfolio' AND l.code='es' THEN 'Portafolio personal'
    WHEN p.code='portfolio' AND l.code='en' THEN 'Personal portfolio'

    WHEN p.code='management_api' AND l.code='es' THEN 'API de gestión'
    WHEN p.code='management_api' AND l.code='en' THEN 'Management API'
  END,
  CASE
    WHEN p.code='portfolio' AND l.code='es' THEN 'Web para mostrar proyectos y experiencia'
    WHEN p.code='portfolio' AND l.code='en' THEN 'Website to showcase projects and experience'

    WHEN p.code='management_api' AND l.code='es' THEN 'Backend escalable con autenticación'
    WHEN p.code='management_api' AND l.code='en' THEN 'Scalable backend with authentication'
  END
FROM project p
CROSS JOIN language l
ON CONFLICT DO NOTHING;
