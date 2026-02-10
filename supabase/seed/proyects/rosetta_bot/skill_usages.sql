-- ============================================================
-- Rosetta Stone Bot - Skill Usages & Translations
-- ============================================================
-- All children are architectural → skills collapsed to ROOT.
-- 7 core skills representing the full project.
-- ============================================================
BEGIN;

INSERT INTO skill_usages (skill_id, source_id, source_type, level, started_at, is_pinned, position)
VALUES
  ((SELECT id FROM skill WHERE code = 'python'),             (SELECT id FROM project WHERE code = 'rosetta-stone-bot'), 'project', 4, '2025-01-01', true,  1),
  ((SELECT id FROM skill WHERE code = 'playwright'),         (SELECT id FROM project WHERE code = 'rosetta-stone-bot'), 'project', 4, '2025-01-01', true,  2),
  ((SELECT id FROM skill WHERE code = 'docker'),             (SELECT id FROM project WHERE code = 'rosetta-stone-bot'), 'project', 3, '2025-01-01', false, 3),
  ((SELECT id FROM skill WHERE code = 'web_scraping'),       (SELECT id FROM project WHERE code = 'rosetta-stone-bot'), 'project', 4, '2025-01-01', false, 4),
  ((SELECT id FROM skill WHERE code = 'clean_architecture'), (SELECT id FROM project WHERE code = 'rosetta-stone-bot'), 'project', 4, '2025-01-01', true,  5),
  ((SELECT id FROM skill WHERE code = 'shell_bash'),         (SELECT id FROM project WHERE code = 'rosetta-stone-bot'), 'project', 2, '2025-01-01', false, 6),
  ((SELECT id FROM skill WHERE code = 'html_css'),           (SELECT id FROM project WHERE code = 'rosetta-stone-bot'), 'project', 4, '2025-01-01', false, 7)
ON CONFLICT DO NOTHING;

-- Translations
INSERT INTO skill_usages_translation (skill_usages_id, language_id, notes)
VALUES
  -- python
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'python') AND su.source_id = (SELECT id FROM project WHERE code = 'rosetta-stone-bot') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'),
   'Python 3.13 con dataclasses, ABC, tipado estricto, patrón factory, decoradores @property y gestión de contexto. Page Object Model completo, servicios con inyección de dependencias y template method pattern para workflows.'),
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'python') AND su.source_id = (SELECT id FROM project WHERE code = 'rosetta-stone-bot') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'),
   'Python 3.13 with dataclasses, ABC, strict typing, factory pattern, @property decorators and context management. Complete Page Object Model, services with dependency injection and template method pattern for workflows.'),

  -- playwright
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'playwright') AND su.source_id = (SELECT id FROM project WHERE code = 'rosetta-stone-bot') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'),
   'Playwright sync API para automatización de Chromium: navegación, localización de elementos (get_by_role, get_by_text, locator), manejo de frames e iframes anidados, espera de estados de red, screenshots, interacción con SVG y auto-dismiss de dialogs.'),
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'playwright') AND su.source_id = (SELECT id FROM project WHERE code = 'rosetta-stone-bot') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'),
   'Playwright sync API for Chromium automation: navigation, element location (get_by_role, get_by_text, locator), frame and nested iframe handling, network state waiting, screenshots, SVG interaction and dialog auto-dismiss.'),

  -- docker
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'docker') AND su.source_id = (SELECT id FROM project WHERE code = 'rosetta-stone-bot') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'),
   'Dockerfile multi-stage con Python 3.13-slim y uv. Docker Compose para orquestación multi-usuario con volumen compartido tracking-data, env_file por usuario y restart always.'),
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'docker') AND su.source_id = (SELECT id FROM project WHERE code = 'rosetta-stone-bot') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'),
   'Multi-stage Dockerfile with Python 3.13-slim and uv. Docker Compose for multi-user orchestration with shared tracking-data volume, per-user env_file and restart always.'),

  -- web_scraping
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'web_scraping') AND su.source_id = (SELECT id FROM project WHERE code = 'rosetta-stone-bot') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'),
   'Web scraping de Rosetta Stone: extracción de historias disponibles, detección de estados de completado, navegación entre secciones protegidas con autenticación institucional. Regex bilingüe para UI español/inglés.'),
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'web_scraping') AND su.source_id = (SELECT id FROM project WHERE code = 'rosetta-stone-bot') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'),
   'Rosetta Stone web scraping: available story extraction, completion state detection, navigation between authenticated sections with institutional login. Bilingual regex for Spanish/English UI.'),

  -- clean_architecture
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'clean_architecture') AND su.source_id = (SELECT id FROM project WHERE code = 'rosetta-stone-bot') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'),
   'Arquitectura limpia en capas: core (constantes), config (dataclasses + env), browser (ciclo de vida), locators (selectores + regex), components (UI), pages (POM), services (lógica), workflows (automatización). Cada módulo con __init__.py como API pública.'),
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'clean_architecture') AND su.source_id = (SELECT id FROM project WHERE code = 'rosetta-stone-bot') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'),
   'Clean layered architecture: core (constants), config (dataclasses + env), browser (lifecycle), locators (selectors + regex), components (UI), pages (POM), services (logic), workflows (automation). Each module with __init__.py as public API.'),

  -- shell_bash
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'shell_bash') AND su.source_id = (SELECT id FROM project WHERE code = 'rosetta-stone-bot') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'),
   'Scripts bash para gestión de Docker: build, ejecución, inspección de volúmenes, copia de datos y monitoreo de logs.'),
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'shell_bash') AND su.source_id = (SELECT id FROM project WHERE code = 'rosetta-stone-bot') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'),
   'Bash scripts for Docker management: build, execution, volume inspection, data copying and log monitoring.'),

  -- html_css
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'html_css') AND su.source_id = (SELECT id FROM project WHERE code = 'rosetta-stone-bot') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'),
   'Selectores CSS y data attributes: polygon/circle para controles SVG de audio, data-qa para modals, href para story links, roles ARIA. Frozen dataclasses para centralizar todos los selectores.'),
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'html_css') AND su.source_id = (SELECT id FROM project WHERE code = 'rosetta-stone-bot') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'),
   'CSS selectors and data attributes: polygon/circle for SVG audio controls, data-qa for modals, href for story links, ARIA roles. Frozen dataclasses to centralize all selectors.')
ON CONFLICT (skill_usages_id, language_id) DO NOTHING;

COMMIT;
