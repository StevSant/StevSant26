-- ============================================================
-- Rosetta Stone Bot - Content Sections & Translations
-- ============================================================
-- Curated: 6 high-value sections covering the project holistically.
-- All icons: Material Symbols Outlined (lowercase).
-- ============================================================
BEGIN;

INSERT INTO content_section (entity_type, entity_id, section_key, icon, position, is_archived, is_pinned)
VALUES
  ('project', (SELECT id FROM project WHERE code = 'rosetta-stone-bot'), 'overview',     'menu_book',   1, false, true),
  ('project', (SELECT id FROM project WHERE code = 'rosetta-stone-bot'), 'motivation',   'gps_fixed',   2, false, false),
  ('project', (SELECT id FROM project WHERE code = 'rosetta-stone-bot'), 'architecture', 'layers',      3, false, true),
  ('project', (SELECT id FROM project WHERE code = 'rosetta-stone-bot'), 'workflow',     'route',       4, false, true),
  ('project', (SELECT id FROM project WHERE code = 'rosetta-stone-bot'), 'deployment',   'inventory_2', 5, false, false),
  ('project', (SELECT id FROM project WHERE code = 'rosetta-stone-bot'), 'challenges',   'warning',     6, false, false)
ON CONFLICT DO NOTHING;

INSERT INTO content_section_translation (content_section_id, language_id, title, body)
VALUES
  -- overview
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosetta-stone-bot') AND cs.section_key = 'overview' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Descripción General',
   'Bot de automatización para **Rosetta Stone** con **Playwright** y **Python 3.13**. Automatiza login institucional, navegación, selección de historias/lecciones y ciclos infinitos de escucha/lectura hasta alcanzar 35h configurables. Soporte multi-usuario con Docker y persistencia compartida de tracking.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosetta-stone-bot') AND cs.section_key = 'overview' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Overview',
   'Automation bot for **Rosetta Stone** with **Playwright** and **Python 3.13**. Automates institutional login, navigation, story/lesson selection and infinite listen/read cycles until reaching a configurable 35h target. Multi-user support with Docker and shared tracking persistence.'),
  -- motivation
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosetta-stone-bot') AND cs.section_key = 'motivation' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Motivación',
   'El programa universitario requiere **35 horas** de práctica por estudiante. El bot automatiza la acumulación de horas de forma desatendida, soportando múltiples usuarios simultáneos via Docker Compose.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosetta-stone-bot') AND cs.section_key = 'motivation' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Motivation',
   'The university program requires **35 hours** of practice per student. The bot automates hour accumulation unattended, supporting multiple simultaneous users via Docker Compose.'),
  -- architecture
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosetta-stone-bot') AND cs.section_key = 'architecture' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Arquitectura',
   E'Arquitectura limpia en capas: core/ (constantes, logger) \u2192 config/ (dataclasses + env vars) \u2192 browser/ (ciclo de vida Chromium) \u2192 locators/ (selectores CSS, regex bilingüe) \u2192 components/ (modals UI) \u2192 pages/ (POM: Login, Launchpad, Stories, Lesson) \u2192 services/ (AudioPlayer, TimeTracker, Debug) \u2192 workflows/ (StoriesWorkflow, LessonWorkflow). Cada módulo expone su API via __init__.py.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosetta-stone-bot') AND cs.section_key = 'architecture' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Architecture',
   E'Clean layered architecture: core/ (constants, logger) \u2192 config/ (dataclasses + env vars) \u2192 browser/ (Chromium lifecycle) \u2192 locators/ (CSS selectors, bilingual regex) \u2192 components/ (UI modals) \u2192 pages/ (POM: Login, Launchpad, Stories, Lesson) \u2192 services/ (AudioPlayer, TimeTracker, Debug) \u2192 workflows/ (StoriesWorkflow, LessonWorkflow). Each module exposes its API via __init__.py.'),
  -- workflow
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosetta-stone-bot') AND cs.section_key = 'workflow' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Flujo de Automatización',
   E'1. Login con credenciales institucionales \u2192 2. Navegación al launchpad \u2192 3. Selección de modo (Stories o Lesson) \u2192 4. Ciclo infinito: descubrir contenido \u2192 reproducir audio \u2192 ciclar Listen/Read \u2192 detectar completado \u2192 reiniciar \u2192 5. TimeTracker registra sesiones hasta alcanzar la meta. Manejo automático de dialogs, modals de audio/voz y fallback de selectores SVG.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosetta-stone-bot') AND cs.section_key = 'workflow' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Automation Flow',
   E'1. Login with institutional credentials \u2192 2. Launchpad navigation \u2192 3. Mode selection (Stories or Lesson) \u2192 4. Infinite cycle: discover content \u2192 play audio \u2192 cycle Listen/Read \u2192 detect completion \u2192 restart \u2192 5. TimeTracker records sessions until target reached. Automatic handling of dialogs, audio/voice modals and SVG selector fallback.'),
  -- deployment
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosetta-stone-bot') AND cs.section_key = 'deployment' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Despliegue Docker',
   'Dockerfile con python:3.13-slim, dependencias de Playwright, uv como gestor de paquetes. Docker Compose define un servicio por usuario con env_file individual y volumen compartido tracking-data montado en /app/data. Policy restart: always para auto-recuperación.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosetta-stone-bot') AND cs.section_key = 'deployment' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Docker Deployment',
   'Dockerfile with python:3.13-slim, Playwright dependencies, uv as package manager. Docker Compose defines a service per user with individual env_file and shared tracking-data volume mounted at /app/data. restart: always policy for auto-recovery.'),
  -- challenges
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosetta-stone-bot') AND cs.section_key = 'challenges' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Desafíos Técnicos',
   E'UI bilingüe resuelta con regex compilado (escuchar|listen). Controles de audio SVG con fallback polygon\u2192circle. Contenido en iframes anidados con búsqueda recursiva. Modals aleatorios de audio/voz con auto-dismiss. Persistencia JSON multi-usuario concurrente. Auto-accept de dialogs del navegador via page.on("dialog").'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosetta-stone-bot') AND cs.section_key = 'challenges' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Technical Challenges',
   E'Bilingual UI solved with compiled regex (escuchar|listen). SVG audio controls with polygon\u2192circle fallback. Content in nested iframes with recursive search. Random audio/voice modals with auto-dismiss. Concurrent multi-user JSON persistence. Browser dialog auto-accept via page.on("dialog").')
ON CONFLICT (content_section_id, language_id) DO NOTHING;

COMMIT;
