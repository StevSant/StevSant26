-- ============================================================
-- Rosetta Stone Bot - Content Sections & Translations
-- ============================================================
-- All 10 architectural children merged as content_sections on root.
-- All icons: Material Icons lowercase.
-- ============================================================
BEGIN;

-- =============================================
-- Root original sections (6)
-- Icons converted: BookOpen→menu_book, Target→gps_fixed,
-- Layers→layers, Workflow→route, Container→inventory_2,
-- AlertTriangle→warning
-- =============================================
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
   'Arquitectura limpia en capas: `core/` (constantes, logger) → `config/` (dataclasses + env vars) → `browser/` (ciclo de vida Chromium) → `locators/` (selectores CSS, regex bilingüe) → `components/` (modals UI) → `pages/` (POM: Login, Launchpad, Stories, Lesson) → `services/` (AudioPlayer, TimeTracker, Debug) → `workflows/` (StoriesWorkflow, LessonWorkflow). Cada módulo expone su API via `__init__.py`.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosetta-stone-bot') AND cs.section_key = 'architecture' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Architecture',
   'Clean layered architecture: `core/` (constants, logger) → `config/` (dataclasses + env vars) → `browser/` (Chromium lifecycle) → `locators/` (CSS selectors, bilingual regex) → `components/` (UI modals) → `pages/` (POM: Login, Launchpad, Stories, Lesson) → `services/` (AudioPlayer, TimeTracker, Debug) → `workflows/` (StoriesWorkflow, LessonWorkflow). Each module exposes its API via `__init__.py`.'),
  -- workflow
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosetta-stone-bot') AND cs.section_key = 'workflow' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Flujo de Automatización',
   '1. Login con credenciales institucionales → 2. Navegación al launchpad → 3. Selección de modo (Stories o Lesson) → 4. Ciclo infinito: descubrir contenido → reproducir audio → ciclar Listen/Read → detectar completado → reiniciar → 5. TimeTracker registra sesiones hasta alcanzar la meta. Manejo automático de dialogs, modals de audio/voz y fallback de selectores SVG.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosetta-stone-bot') AND cs.section_key = 'workflow' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Automation Flow',
   '1. Login with institutional credentials → 2. Launchpad navigation → 3. Mode selection (Stories or Lesson) → 4. Infinite cycle: discover content → play audio → cycle Listen/Read → detect completion → restart → 5. TimeTracker records sessions until target reached. Automatic handling of dialogs, audio/voice modals and SVG selector fallback.'),
  -- deployment
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosetta-stone-bot') AND cs.section_key = 'deployment' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Despliegue Docker',
   'Dockerfile con `python:3.13-slim`, dependencias de Playwright, `uv` como gestor de paquetes. Docker Compose define un servicio por usuario con `env_file` individual y volumen compartido `tracking-data` montado en `/app/data`. Policy `restart: always` para auto-recuperación.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosetta-stone-bot') AND cs.section_key = 'deployment' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Docker Deployment',
   'Dockerfile with `python:3.13-slim`, Playwright dependencies, `uv` as package manager. Docker Compose defines a service per user with individual `env_file` and shared `tracking-data` volume mounted at `/app/data`. `restart: always` policy for auto-recovery.'),
  -- challenges
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosetta-stone-bot') AND cs.section_key = 'challenges' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Desafíos Técnicos',
   'UI bilingüe resuelta con regex compilado (`escuchar|listen`). Controles de audio SVG con fallback polygon→circle. Contenido en iframes anidados con búsqueda recursiva. Modals aleatorios de audio/voz con auto-dismiss. Persistencia JSON multi-usuario concurrente. Auto-accept de dialogs del navegador via `page.on("dialog")`.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosetta-stone-bot') AND cs.section_key = 'challenges' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Technical Challenges',
   'Bilingual UI solved with compiled regex (`escuchar|listen`). SVG audio controls with polygon→circle fallback. Content in nested iframes with recursive search. Random audio/voice modals with auto-dismiss. Concurrent multi-user JSON persistence. Browser dialog auto-accept via `page.on("dialog")`.')
ON CONFLICT (content_section_id, language_id) DO NOTHING;

-- =============================================
-- Children merged as sections (11 sections)
-- =============================================
INSERT INTO content_section (entity_type, entity_id, section_key, icon, position, is_archived, is_pinned)
VALUES
  ('project', (SELECT id FROM project WHERE code = 'rosetta-stone-bot'), 'core_module',       'data_object',  7,  false, false),
  ('project', (SELECT id FROM project WHERE code = 'rosetta-stone-bot'), 'services_module',   'build',        8,  false, false),
  ('project', (SELECT id FROM project WHERE code = 'rosetta-stone-bot'), 'time_tracker',      'schedule',     9,  false, false),
  ('project', (SELECT id FROM project WHERE code = 'rosetta-stone-bot'), 'workflows_module',  'route',       10,  false, false),
  ('project', (SELECT id FROM project WHERE code = 'rosetta-stone-bot'), 'pages_module',      'web',         11,  false, false),
  ('project', (SELECT id FROM project WHERE code = 'rosetta-stone-bot'), 'components_module', 'widgets',     12,  false, false),
  ('project', (SELECT id FROM project WHERE code = 'rosetta-stone-bot'), 'locators_module',   'search',      13,  false, false),
  ('project', (SELECT id FROM project WHERE code = 'rosetta-stone-bot'), 'config_module',     'settings',    14,  false, false),
  ('project', (SELECT id FROM project WHERE code = 'rosetta-stone-bot'), 'browser_module',    'language',    15,  false, false),
  ('project', (SELECT id FROM project WHERE code = 'rosetta-stone-bot'), 'docker_module',     'cloud',       16,  false, false),
  ('project', (SELECT id FROM project WHERE code = 'rosetta-stone-bot'), 'debug_module',      'bug_report',  17,  false, false)
ON CONFLICT DO NOTHING;

INSERT INTO content_section_translation (content_section_id, language_id, title, body)
VALUES
  -- core_module
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosetta-stone-bot') AND cs.section_key = 'core_module' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Módulo Core',
   'Constantes tipadas con frozen dataclasses: `Timeouts` (ms para Playwright), `WaitTimes` (segundos para sleeps), `URLs` de la plataforma. Sistema de logging centralizado con `get_logger()` factory y niveles configurables.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosetta-stone-bot') AND cs.section_key = 'core_module' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Core Module',
   'Typed constants with frozen dataclasses: `Timeouts` (ms for Playwright), `WaitTimes` (seconds for sleeps), platform `URLs`. Centralized logging system with `get_logger()` factory and configurable levels.'),
  -- services_module
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosetta-stone-bot') AND cs.section_key = 'services_module' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Módulo de Servicios',
   'Servicios reutilizables: `AudioPlayerService` (play/pause/rewind con fallback SVG), `ModeSwitcherService` (alterna Listen/Read con regex bilingüe), `DebugService` (screenshots secuenciales + state dumps), `FrameFinderService` (búsqueda recursiva en iframes), `TimeTracker` (tracking de horas con persistencia JSON).'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosetta-stone-bot') AND cs.section_key = 'services_module' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Services Module',
   'Reusable services: `AudioPlayerService` (play/pause/rewind with SVG fallback), `ModeSwitcherService` (toggles Listen/Read with bilingual regex), `DebugService` (sequential screenshots + state dumps), `FrameFinderService` (recursive iframe search), `TimeTracker` (hour tracking with JSON persistence).'),
  -- time_tracker
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosetta-stone-bot') AND cs.section_key = 'time_tracker' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Sistema de Tracking',
   'Estructura JSON por email de usuario con sesiones timestamped. Meta configurable (default 35h). Reportes en texto plano. Cleanup con `atexit` para cierre inesperado. Archivo compartido via volumen Docker `/app/data/`.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosetta-stone-bot') AND cs.section_key = 'time_tracker' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Tracking System',
   'JSON structure per user email with timestamped sessions. Configurable target (default 35h). Plain text reports. Cleanup with `atexit` for unexpected shutdown. Shared file via Docker volume `/app/data/`.'),
  -- workflows_module
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosetta-stone-bot') AND cs.section_key = 'workflows_module' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Módulo de Workflows',
   'Patrón Template Method con `BaseWorkflow` (ABC): `setup()` → `run_once()` → loop infinito con verificación de meta. `StoriesWorkflow` descubre y cicla historias Listen/Read. `LessonWorkflow` repite una lección específica con reinicio automático via botón o reload.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosetta-stone-bot') AND cs.section_key = 'workflows_module' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Workflows Module',
   'Template Method pattern with `BaseWorkflow` (ABC): `setup()` → `run_once()` → infinite loop with target check. `StoriesWorkflow` discovers and cycles stories Listen/Read. `LessonWorkflow` repeats a specific lesson with automatic restart via button or reload.'),
  -- pages_module
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosetta-stone-bot') AND cs.section_key = 'pages_module' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Módulo de Páginas (POM)',
   'Page Object Model completo: `BasePage` (waits, screenshots, dialog auto-dismiss, click seguro), `LoginPage` (autenticación institucional), `LaunchpadPage` (navegación con fallback bilingüe), `StoriesPage` (descubrimiento + ciclos Listen/Read + audio), `LessonPage` (reproducción + completado + reinicio).'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosetta-stone-bot') AND cs.section_key = 'pages_module' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Pages Module (POM)',
   'Complete Page Object Model: `BasePage` (waits, screenshots, dialog auto-dismiss, safe click), `LoginPage` (institutional authentication), `LaunchpadPage` (navigation with bilingual fallback), `StoriesPage` (discovery + Listen/Read cycles + audio), `LessonPage` (playback + completion + restart).'),
  -- components_module
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosetta-stone-bot') AND cs.section_key = 'components_module' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Módulo de Componentes UI',
   'Componentes UI reutilizables: `AudioModal` (dismiss automático con data-qa), `VoiceModal` (selecciona "continuar sin voz"), `CookieConsent` (acepta cookies automáticamente). Interfaz consistente: `dismiss_if_present()` y `wait_and_dismiss()`.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosetta-stone-bot') AND cs.section_key = 'components_module' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'UI Components Module',
   'Reusable UI components: `AudioModal` (auto-dismiss with data-qa), `VoiceModal` (selects "continue without voice"), `CookieConsent` (auto-accepts cookies). Consistent interface: `dismiss_if_present()` and `wait_and_dismiss()`.'),
  -- locators_module
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosetta-stone-bot') AND cs.section_key = 'locators_module' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Módulo de Locators',
   'Selectores centralizados en frozen dataclasses: `LoginLocators`, `StoriesLocators` (hrefs + controles SVG), `LessonLocators` (audio + completado + reinicio), `LaunchpadLocators` (URLs + patrones), `CommonLocators` (regex bilingüe compilado: `escuchar|listen`, `leer|read`, `completado|completed`, `foundations|fundamentos`).'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosetta-stone-bot') AND cs.section_key = 'locators_module' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Locators Module',
   'Centralized selectors in frozen dataclasses: `LoginLocators`, `StoriesLocators` (hrefs + SVG controls), `LessonLocators` (audio + completion + restart), `LaunchpadLocators` (URLs + patterns), `CommonLocators` (compiled bilingual regex: `escuchar|listen`, `leer|read`, `completado|completed`, `foundations|fundamentos`).'),
  -- config_module
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosetta-stone-bot') AND cs.section_key = 'config_module' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Módulo de Configuración',
   'Dataclasses con factory `from_env()`: `BrowserConfig` (headless, slow_mo, viewport 1280×720, locale es-ES, user agent), `AppConfig` (email, password, debug, lesson_name, target_hours=35). Carga desde `os.getenv()` con validación y conversión de tipos.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosetta-stone-bot') AND cs.section_key = 'config_module' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Configuration Module',
   'Dataclasses with `from_env()` factory: `BrowserConfig` (headless, slow_mo, viewport 1280×720, locale es-ES, user agent), `AppConfig` (email, password, debug, lesson_name, target_hours=35). Loading from `os.getenv()` with validation and type conversion.'),
  -- browser_module
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosetta-stone-bot') AND cs.section_key = 'browser_module' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Módulo de Navegador',
   'Ciclo de vida de Chromium con Playwright sync API: lanzamiento → contexto con viewport/locale/user agent → página → cierre controlado (page→context→browser→playwright) con manejo de errores en cada paso.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosetta-stone-bot') AND cs.section_key = 'browser_module' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Browser Module',
   'Chromium lifecycle with Playwright sync API: launch → context with viewport/locale/user agent → page → controlled shutdown (page→context→browser→playwright) with error handling at each step.'),
  -- docker_module
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosetta-stone-bot') AND cs.section_key = 'docker_module' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Despliegue Docker',
   'Dockerfile multi-stage con `python:3.13-slim`, dependencias de sistema para Playwright, `uv` para paquetes, `playwright install chromium`. Docker Compose con servicio por usuario, `env_file` individual, volumen compartido `tracking-data:/app/data`, `restart: always`.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosetta-stone-bot') AND cs.section_key = 'docker_module' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Docker Deployment',
   'Multi-stage Dockerfile with `python:3.13-slim`, Playwright system dependencies, `uv` for packages, `playwright install chromium`. Docker Compose with per-user service, individual `env_file`, shared `tracking-data:/app/data` volume, `restart: always`.'),
  -- debug_module
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosetta-stone-bot') AND cs.section_key = 'debug_module' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Módulo de Debug',
   'Screenshots secuenciales con contador persistente en `.dump_index`. State dumps (URL, título, frames). Sanitización de nombres con regex. Activación condicional via `AppConfig.debug`. Los dumps sobreviven reinicios de contenedor gracias al contador persistente.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosetta-stone-bot') AND cs.section_key = 'debug_module' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Debug Module',
   'Sequential screenshots with persistent counter in `.dump_index`. State dumps (URL, title, frames). Name sanitization with regex. Conditional activation via `AppConfig.debug`. Dumps survive container restarts thanks to the persistent counter.')
ON CONFLICT (content_section_id, language_id) DO NOTHING;

COMMIT;
