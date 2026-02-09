-- ================================================================
-- SEEDING: content_section + content_section_translation
-- entity_type = 'project' | language_id: 1=ES, 2=EN
-- ================================================================

-- ================================================================
-- PROYECTO 1: rosetta-stone-bot (raíz)
-- ================================================================

INSERT INTO content_section (id, entity_type, entity_id, section_key, icon, position, is_archived, is_pinned)
VALUES
  (1, 'project', 1, 'overview',        'BookOpen',        1, false, true),
  (2, 'project', 1, 'motivation',      'Target',          2, false, false),
  (3, 'project', 1, 'architecture',    'Layers',          3, false, true),
  (4, 'project', 1, 'workflow',        'Workflow',        4, false, true),
  (5, 'project', 1, 'deployment',      'Container',       5, false, false),
  (6, 'project', 1, 'challenges',      'AlertTriangle',   6, false, false);

INSERT INTO content_section_translation (content_section_id, language_id, title, body) VALUES
-- overview
(1, 1, 'Descripción General',
'Bot de automatización para **Rosetta Stone** con **Playwright** y **Python 3.13**. Automatiza login institucional, navegación, selección de historias/lecciones y ciclos infinitos de escucha/lectura hasta alcanzar 35h configurables. Soporte multi-usuario con Docker y persistencia compartida de tracking.'),
(1, 2, 'Overview',
'Automation bot for **Rosetta Stone** with **Playwright** and **Python 3.13**. Automates institutional login, navigation, story/lesson selection and infinite listen/read cycles until reaching a configurable 35h target. Multi-user support with Docker and shared tracking persistence.'),

-- motivation
(2, 1, 'Motivación',
'El programa universitario requiere **35 horas** de práctica por estudiante. El bot automatiza la acumulación de horas de forma desatendida, soportando múltiples usuarios simultáneos via Docker Compose.'),
(2, 2, 'Motivation',
'The university program requires **35 hours** of practice per student. The bot automates hour accumulation unattended, supporting multiple simultaneous users via Docker Compose.'),

-- architecture
(3, 1, 'Arquitectura',
'Arquitectura limpia en capas: `core/` (constantes, logger) → `config/` (dataclasses + env vars) → `browser/` (ciclo de vida Chromium) → `locators/` (selectores CSS, regex bilingüe) → `components/` (modals UI) → `pages/` (POM: Login, Launchpad, Stories, Lesson) → `services/` (AudioPlayer, TimeTracker, Debug) → `workflows/` (StoriesWorkflow, LessonWorkflow). Cada módulo expone su API via `__init__.py`.'),
(3, 2, 'Architecture',
'Clean layered architecture: `core/` (constants, logger) → `config/` (dataclasses + env vars) → `browser/` (Chromium lifecycle) → `locators/` (CSS selectors, bilingual regex) → `components/` (UI modals) → `pages/` (POM: Login, Launchpad, Stories, Lesson) → `services/` (AudioPlayer, TimeTracker, Debug) → `workflows/` (StoriesWorkflow, LessonWorkflow). Each module exposes its API via `__init__.py`.'),

-- workflow
(4, 1, 'Flujo de Automatización',
'1. Login con credenciales institucionales → 2. Navegación al launchpad → 3. Selección de modo (Stories o Lesson) → 4. Ciclo infinito: descubrir contenido → reproducir audio → ciclar Listen/Read → detectar completado → reiniciar → 5. TimeTracker registra sesiones hasta alcanzar la meta. Manejo automático de dialogs, modals de audio/voz y fallback de selectores SVG.'),
(4, 2, 'Automation Flow',
'1. Login with institutional credentials → 2. Launchpad navigation → 3. Mode selection (Stories or Lesson) → 4. Infinite cycle: discover content → play audio → cycle Listen/Read → detect completion → restart → 5. TimeTracker records sessions until target reached. Automatic handling of dialogs, audio/voice modals and SVG selector fallback.'),

-- deployment
(5, 1, 'Despliegue Docker',
'Dockerfile con `python:3.13-slim`, dependencias de Playwright, `uv` como gestor de paquetes. Docker Compose define un servicio por usuario con `env_file` individual y volumen compartido `tracking-data` montado en `/app/data`. Policy `restart: always` para auto-recuperación.'),
(5, 2, 'Docker Deployment',
'Dockerfile with `python:3.13-slim`, Playwright dependencies, `uv` as package manager. Docker Compose defines a service per user with individual `env_file` and shared `tracking-data` volume mounted at `/app/data`. `restart: always` policy for auto-recovery.'),

-- challenges
(6, 1, 'Desafíos Técnicos',
'UI bilingüe resuelta con regex compilado (`escuchar|listen`). Controles de audio SVG con fallback polygon→circle. Contenido en iframes anidados con búsqueda recursiva. Modals aleatorios de audio/voz con auto-dismiss. Persistencia JSON multi-usuario concurrente. Auto-accept de dialogs del navegador via `page.on("dialog")`.'),
(6, 2, 'Technical Challenges',
'Bilingual UI solved with compiled regex (`escuchar|listen`). SVG audio controls with polygon→circle fallback. Content in nested iframes with recursive search. Random audio/voice modals with auto-dismiss. Concurrent multi-user JSON persistence. Browser dialog auto-accept via `page.on("dialog")`.');


-- ================================================================
-- PROYECTO 2: rosetta-bot-core
-- ================================================================

INSERT INTO content_section (id, entity_type, entity_id, section_key, icon, position, is_archived, is_pinned)
VALUES (7, 'project', 2, 'overview', 'BookOpen', 1, false, true);

INSERT INTO content_section_translation (content_section_id, language_id, title, body) VALUES
(7, 1, 'Descripción',
'Constantes tipadas con frozen dataclasses: `Timeouts` (ms para Playwright), `WaitTimes` (segundos para sleeps), `URLs` de la plataforma. Sistema de logging centralizado con `get_logger()` factory y niveles configurables.'),
(7, 2, 'Description',
'Typed constants with frozen dataclasses: `Timeouts` (ms for Playwright), `WaitTimes` (seconds for sleeps), platform `URLs`. Centralized logging system with `get_logger()` factory and configurable levels.');


-- ================================================================
-- PROYECTO 3: rosetta-bot-services
-- ================================================================

INSERT INTO content_section (id, entity_type, entity_id, section_key, icon, position, is_archived, is_pinned)
VALUES
  (8, 'project', 3, 'overview',     'BookOpen', 1, false, true),
  (9, 'project', 3, 'time_tracker', 'Clock',    2, false, false);

INSERT INTO content_section_translation (content_section_id, language_id, title, body) VALUES
(8, 1, 'Descripción',
'Servicios reutilizables: `AudioPlayerService` (play/pause/rewind con fallback SVG), `ModeSwitcherService` (alterna Listen/Read con regex bilingüe), `DebugService` (screenshots secuenciales + state dumps), `FrameFinderService` (búsqueda recursiva en iframes), `TimeTracker` (tracking de horas con persistencia JSON).'),
(8, 2, 'Description',
'Reusable services: `AudioPlayerService` (play/pause/rewind with SVG fallback), `ModeSwitcherService` (toggles Listen/Read with bilingual regex), `DebugService` (sequential screenshots + state dumps), `FrameFinderService` (recursive iframe search), `TimeTracker` (hour tracking with JSON persistence).'),

(9, 1, 'Sistema de Tracking',
'Estructura JSON por email de usuario con sesiones timestamped. Meta configurable (default 35h). Reportes en texto plano. Cleanup con `atexit` para cierre inesperado. Archivo compartido via volumen Docker `/app/data/`.'),
(9, 2, 'Tracking System',
'JSON structure per user email with timestamped sessions. Configurable target (default 35h). Plain text reports. Cleanup with `atexit` for unexpected shutdown. Shared file via Docker volume `/app/data/`.');


-- ================================================================
-- PROYECTO 4: rosetta-bot-workflows
-- ================================================================

INSERT INTO content_section (id, entity_type, entity_id, section_key, icon, position, is_archived, is_pinned)
VALUES (10, 'project', 4, 'overview', 'BookOpen', 1, false, true);

INSERT INTO content_section_translation (content_section_id, language_id, title, body) VALUES
(10, 1, 'Descripción',
'Patrón Template Method con `BaseWorkflow` (ABC): `setup()` → `run_once()` → loop infinito con verificación de meta. `StoriesWorkflow` descubre y cicla historias Listen/Read. `LessonWorkflow` repite una lección específica con reinicio automático via botón o reload.'),
(10, 2, 'Description',
'Template Method pattern with `BaseWorkflow` (ABC): `setup()` → `run_once()` → infinite loop with target check. `StoriesWorkflow` discovers and cycles stories Listen/Read. `LessonWorkflow` repeats a specific lesson with automatic restart via button or reload.');


-- ================================================================
-- PROYECTO 5: rosetta-bot-pages
-- ================================================================

INSERT INTO content_section (id, entity_type, entity_id, section_key, icon, position, is_archived, is_pinned)
VALUES (11, 'project', 5, 'overview', 'BookOpen', 1, false, true);

INSERT INTO content_section_translation (content_section_id, language_id, title, body) VALUES
(11, 1, 'Descripción',
'Page Object Model completo: `BasePage` (waits, screenshots, dialog auto-dismiss, click seguro), `LoginPage` (autenticación institucional), `LaunchpadPage` (navegación con fallback bilingüe), `StoriesPage` (descubrimiento + ciclos Listen/Read + audio), `LessonPage` (reproducción + completado + reinicio).'),
(11, 2, 'Description',
'Complete Page Object Model: `BasePage` (waits, screenshots, dialog auto-dismiss, safe click), `LoginPage` (institutional authentication), `LaunchpadPage` (navigation with bilingual fallback), `StoriesPage` (discovery + Listen/Read cycles + audio), `LessonPage` (playback + completion + restart).');


-- ================================================================
-- PROYECTO 6: rosetta-bot-components
-- ================================================================

INSERT INTO content_section (id, entity_type, entity_id, section_key, icon, position, is_archived, is_pinned)
VALUES (12, 'project', 6, 'overview', 'BookOpen', 1, false, true);

INSERT INTO content_section_translation (content_section_id, language_id, title, body) VALUES
(12, 1, 'Descripción',
'Componentes UI reutilizables: `AudioModal` (dismiss automático con data-qa), `VoiceModal` (selecciona "continuar sin voz"), `CookieConsent` (acepta cookies automáticamente). Interfaz consistente: `dismiss_if_present()` y `wait_and_dismiss()`.'),
(12, 2, 'Description',
'Reusable UI components: `AudioModal` (auto-dismiss with data-qa), `VoiceModal` (selects "continue without voice"), `CookieConsent` (auto-accepts cookies). Consistent interface: `dismiss_if_present()` and `wait_and_dismiss()`.');


-- ================================================================
-- PROYECTO 7: rosetta-bot-locators
-- ================================================================

INSERT INTO content_section (id, entity_type, entity_id, section_key, icon, position, is_archived, is_pinned)
VALUES (13, 'project', 7, 'overview', 'BookOpen', 1, false, true);

INSERT INTO content_section_translation (content_section_id, language_id, title, body) VALUES
(13, 1, 'Descripción',
'Selectores centralizados en frozen dataclasses: `LoginLocators`, `StoriesLocators` (hrefs + controles SVG), `LessonLocators` (audio + completado + reinicio), `LaunchpadLocators` (URLs + patrones), `CommonLocators` (regex bilingüe compilado: `escuchar|listen`, `leer|read`, `completado|completed`, `foundations|fundamentos`).'),
(13, 2, 'Description',
'Centralized selectors in frozen dataclasses: `LoginLocators`, `StoriesLocators` (hrefs + SVG controls), `LessonLocators` (audio + completion + restart), `LaunchpadLocators` (URLs + patterns), `CommonLocators` (compiled bilingual regex: `escuchar|listen`, `leer|read`, `completado|completed`, `foundations|fundamentos`).');


-- ================================================================
-- PROYECTO 8: rosetta-bot-config
-- ================================================================

INSERT INTO content_section (id, entity_type, entity_id, section_key, icon, position, is_archived, is_pinned)
VALUES (14, 'project', 8, 'overview', 'BookOpen', 1, false, true);

INSERT INTO content_section_translation (content_section_id, language_id, title, body) VALUES
(14, 1, 'Descripción',
'Dataclasses con factory `from_env()`: `BrowserConfig` (headless, slow_mo, viewport 1280×720, locale es-ES, user agent), `AppConfig` (email, password, debug, lesson_name, target_hours=35). Carga desde `os.getenv()` con validación y conversión de tipos.'),
(14, 2, 'Description',
'Dataclasses with `from_env()` factory: `BrowserConfig` (headless, slow_mo, viewport 1280×720, locale es-ES, user agent), `AppConfig` (email, password, debug, lesson_name, target_hours=35). Loading from `os.getenv()` with validation and type conversion.');


-- ================================================================
-- PROYECTO 9: rosetta-bot-browser
-- ================================================================

INSERT INTO content_section (id, entity_type, entity_id, section_key, icon, position, is_archived, is_pinned)
VALUES (15, 'project', 9, 'overview', 'BookOpen', 1, false, true);

INSERT INTO content_section_translation (content_section_id, language_id, title, body) VALUES
(15, 1, 'Descripción',
'Ciclo de vida de Chromium con Playwright sync API: lanzamiento → contexto con viewport/locale/user agent → página → cierre controlado (page→context→browser→playwright) con manejo de errores en cada paso.'),
(15, 2, 'Description',
'Chromium lifecycle with Playwright sync API: launch → context with viewport/locale/user agent → page → controlled shutdown (page→context→browser→playwright) with error handling at each step.');


-- ================================================================
-- PROYECTO 10: rosetta-bot-docker
-- ================================================================

INSERT INTO content_section (id, entity_type, entity_id, section_key, icon, position, is_archived, is_pinned)
VALUES (16, 'project', 10, 'overview', 'BookOpen', 1, false, true);

INSERT INTO content_section_translation (content_section_id, language_id, title, body) VALUES
(16, 1, 'Descripción',
'Dockerfile multi-stage con `python:3.13-slim`, dependencias de sistema para Playwright, `uv` para paquetes, `playwright install chromium`. Docker Compose con servicio por usuario, `env_file` individual, volumen compartido `tracking-data:/app/data`, `restart: always`.'),
(16, 2, 'Description',
'Multi-stage Dockerfile with `python:3.13-slim`, Playwright system dependencies, `uv` for packages, `playwright install chromium`. Docker Compose with per-user service, individual `env_file`, shared `tracking-data:/app/data` volume, `restart: always`.');


-- ================================================================
-- PROYECTO 11: rosetta-bot-debug
-- ================================================================

INSERT INTO content_section (id, entity_type, entity_id, section_key, icon, position, is_archived, is_pinned)
VALUES (17, 'project', 11, 'overview', 'BookOpen', 1, false, true);

INSERT INTO content_section_translation (content_section_id, language_id, title, body) VALUES
(17, 1, 'Descripción',
'Screenshots secuenciales con contador persistente en `.dump_index`. State dumps (URL, título, frames). Sanitización de nombres con regex. Activación condicional via `AppConfig.debug`. Los dumps sobreviven reinicios de contenedor gracias al contador persistente.'),
(17, 2, 'Description',
'Sequential screenshots with persistent counter in `.dump_index`. State dumps (URL, title, frames). Name sanitization with regex. Conditional activation via `AppConfig.debug`. Dumps survive container restarts thanks to the persistent counter.');


-- ================================================================
-- Reset sequences
-- ================================================================
SELECT setval('content_section_id_seq', (SELECT MAX(id) FROM content_section));
SELECT setval('content_section_translation_id_seq', (SELECT MAX(id) FROM content_section_translation));
