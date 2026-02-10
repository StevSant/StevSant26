-- ============================================================
-- Rosetta Stone Script A - Projects & Translations
-- ============================================================
-- Root project only. All children are architectural subdivisions
-- → merged as content_sections on root.
-- ============================================================
BEGIN;

INSERT INTO project (code, url, created_at, parent_project_id, source_id, source_type, is_archived, is_pinned, position)
VALUES
  ('rosseta-stone-script-a', 'https://github.com/StevSant/rosseta_stone_script_lesson_finisher_a', '2025-01-26', NULL, NULL, NULL, false, true, 1)
ON CONFLICT (code) DO NOTHING;

INSERT INTO project_translation (project_id, language_id, title, description)
VALUES
  ((SELECT id FROM project WHERE code = 'rosseta-stone-script-a'),
   (SELECT id FROM language WHERE code = 'es'),
   'Rosetta Stone Script A - Automatización de Lecciones',
   'Bot de automatización para completar lecciones de Rosetta Stone Foundations. Utiliza Playwright para navegación web, captura de sesión mediante interceptación de tráfico de red, y APIs REST/GraphQL para enviar puntuaciones de completación de forma programática.'),
  ((SELECT id FROM project WHERE code = 'rosseta-stone-script-a'),
   (SELECT id FROM language WHERE code = 'en'),
   'Rosetta Stone Script A - Lesson Finisher',
   'Automation bot for completing Rosetta Stone Foundations lessons. Uses Playwright for web navigation, session capture via network traffic interception, and REST/GraphQL APIs to programmatically submit path completion scores.')
ON CONFLICT (project_id, language_id) DO NOTHING;

COMMIT;
