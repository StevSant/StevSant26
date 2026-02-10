-- ============================================================
-- Rosetta Stone Bot - Projects & Translations
-- ============================================================
-- Root project only. All children are architectural subdivisions
-- → merged as content_sections on root.
-- ============================================================
BEGIN;

INSERT INTO project (code, url, created_at, parent_project_id, source_id, source_type, is_archived, is_pinned, position)
VALUES
  ('rosetta-stone-bot', 'https://github.com/StevSant/playwright_rosseta_stories_bot', '2025-01-01', NULL, NULL, NULL, false, true, 1)
ON CONFLICT (code) DO NOTHING;

INSERT INTO project_translation (project_id, language_id, title, description)
VALUES
  ((SELECT id FROM project WHERE code = 'rosetta-stone-bot'),
   (SELECT id FROM language WHERE code = 'es'),
   'Rosetta Stone Bot',
   'Bot de automatización para Rosetta Stone usando Playwright, implementado con arquitectura modular siguiendo principios de diseño limpio. Incluye sistema de tracking de horas con meta de 35h por usuario, soporte multi-usuario, reportes automáticos y despliegue con Docker.'),
  ((SELECT id FROM project WHERE code = 'rosetta-stone-bot'),
   (SELECT id FROM language WHERE code = 'en'),
   'Rosetta Stone Bot',
   'Automation bot for Rosetta Stone using Playwright, implemented with a modular architecture following clean design principles. Includes hour tracking system with 35h target per user, multi-user support, automatic reports, and Docker deployment.')
ON CONFLICT (project_id, language_id) DO NOTHING;

COMMIT;
