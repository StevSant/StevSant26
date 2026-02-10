-- ============================================================
-- Rosetta Stone Script A - Content Sections & Translations
-- ============================================================
-- All 21 architectural children merged as content_sections on root.
-- All icons: Material Icons lowercase.
-- ============================================================
BEGIN;

-- Helper alias
-- root = rosseta-stone-script-a

-- =============================================
-- Root original sections (6)
-- =============================================
INSERT INTO content_section (entity_type, entity_id, section_key, icon, position, is_archived, is_pinned)
VALUES
  ('project', (SELECT id FROM project WHERE code = 'rosseta-stone-script-a'), 'overview',      'info',         1,  false, true),
  ('project', (SELECT id FROM project WHERE code = 'rosseta-stone-script-a'), 'features',      'bolt',         2,  false, false),
  ('project', (SELECT id FROM project WHERE code = 'rosseta-stone-script-a'), 'architecture',  'construction', 3,  false, true),
  ('project', (SELECT id FROM project WHERE code = 'rosseta-stone-script-a'), 'tech_stack',    'build',        4,  false, false),
  ('project', (SELECT id FROM project WHERE code = 'rosseta-stone-script-a'), 'how_it_works',  'sync',         5,  false, false),
  ('project', (SELECT id FROM project WHERE code = 'rosseta-stone-script-a'), 'challenges',    'extension',    6,  false, false)
ON CONFLICT DO NOTHING;

INSERT INTO content_section_translation (content_section_id, language_id, title, body)
VALUES
  -- overview
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND cs.section_key = 'overview' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Descripción General',
   'Bot de automatización que completa lecciones de **Rosetta Stone Foundations** de forma programática. En lugar de interactuar manualmente con cada ejercicio, el bot captura tokens de sesión mediante interceptación de tráfico de red y envía puntuaciones directamente a las APIs de Rosetta Stone (GraphQL + REST).'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND cs.section_key = 'overview' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Overview',
   'Automation bot that programmatically completes **Rosetta Stone Foundations** lessons. Instead of manually interacting with each exercise, the bot captures session tokens via network traffic interception and submits scores directly to Rosetta Stone APIs (GraphQL + REST).'),
  -- features
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND cs.section_key = 'features' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Características Principales',
   '- **Automatización completa**: login → navegación → captura de sesión → completación masiva\n- **Concurrencia controlada**: hasta 50 paths simultáneos con `asyncio.Semaphore`\n- **Simulación realista**: tiempos y puntajes con variaciones aleatorias para imitar comportamiento humano\n- **Filtrado configurable**: seleccionar unidades, lecciones y tipos de path específicos\n- **Reportes automáticos**: generación de reportes con estadísticas y análisis histórico\n- **Debug integrado**: dumps de texto, metadata y screenshots para diagnóstico'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND cs.section_key = 'features' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Key Features',
   '- **Full automation**: login → navigation → session capture → bulk completion\n- **Controlled concurrency**: up to 50 simultaneous paths with `asyncio.Semaphore`\n- **Realistic simulation**: times and scores with random variations to mimic human behavior\n- **Configurable filtering**: select specific units, lessons and path types\n- **Automatic reports**: report generation with statistics and historical analysis\n- **Integrated debug**: text dumps, metadata and screenshots for diagnostics'),
  -- architecture
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND cs.section_key = 'architecture' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Arquitectura',
   'Implementa **Arquitectura Hexagonal (Ports & Adapters)** con 5 capas:\n\nPresentation (CLI, DI Factory)\n    └── Application (Use Cases, Services, Orchestrators, Ports)\n        └── Domain (Entities, Constants)\n        └── Infrastructure (Adapters, Logging, Settings)\n    └── Shared (Mixins, Utils)\n\nCada capa tiene responsabilidades claras y las dependencias apuntan hacia el dominio.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND cs.section_key = 'architecture' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Architecture',
   'Implements **Hexagonal Architecture (Ports & Adapters)** with 5 layers:\n\nPresentation (CLI, DI Factory)\n    └── Application (Use Cases, Services, Orchestrators, Ports)\n        └── Domain (Entities, Constants)\n        └── Infrastructure (Adapters, Logging, Settings)\n    └── Shared (Mixins, Utils)\n\nEach layer has clear responsibilities and dependencies point toward the domain.'),
  -- tech_stack
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND cs.section_key = 'tech_stack' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Stack Tecnológico',
   'Python 3.14, Playwright, Pydantic Settings, asyncio, logging (dictConfig).'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND cs.section_key = 'tech_stack' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Tech Stack',
   'Python 3.14, Playwright, Pydantic Settings, asyncio, logging (dictConfig).'),
  -- how_it_works
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND cs.section_key = 'how_it_works' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Cómo Funciona',
   '7 pasos: Login → Navegación al dashboard → Captura de sesión (tokens JWT/session) → Obtención del curso vía GraphQL → Filtrado de contenido → Completación masiva con concurrencia → Reporte de resultados.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND cs.section_key = 'how_it_works' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'How It Works',
   '7 steps: Login → Dashboard navigation → Session capture (JWT/session tokens) → Course fetch via GraphQL → Content filtering → Bulk completion with concurrency → Results report.'),
  -- challenges
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND cs.section_key = 'challenges' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Desafíos Técnicos',
   'Ingeniería inversa de APIs (REST XML + GraphQL), simulación de comportamiento humano con tiempos y scores aleatorios, gestión de sesión con intercepción de red, concurrencia segura con semáforos asyncio.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND cs.section_key = 'challenges' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Technical Challenges',
   'API reverse engineering (REST XML + GraphQL), human behavior simulation with random times and scores, session handling with network interception, safe concurrency with asyncio semaphores.')
ON CONFLICT (content_section_id, language_id) DO NOTHING;

-- =============================================
-- Domain Layer sections (merged from 2 children)
-- =============================================
INSERT INTO content_section (entity_type, entity_id, section_key, icon, position, is_archived, is_pinned)
VALUES
  ('project', (SELECT id FROM project WHERE code = 'rosseta-stone-script-a'), 'domain_layer',    'inventory_2', 7,  false, false),
  ('project', (SELECT id FROM project WHERE code = 'rosseta-stone-script-a'), 'domain_entities', 'data_object', 8,  false, false)
ON CONFLICT DO NOTHING;

INSERT INTO content_section_translation (content_section_id, language_id, title, body)
VALUES
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND cs.section_key = 'domain_layer' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Capa de Dominio',
   'Capa de entidades puras sin dependencias externas. Define el modelo de negocio del curso de Rosetta Stone y constantes del dominio.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND cs.section_key = 'domain_layer' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Domain Layer',
   'Pure entity layer with no external dependencies. Defines the Rosetta Stone course business model and domain constants.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND cs.section_key = 'domain_entities' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Entidades de Dominio',
   'CourseMenu, Unit, Lesson, Path, CompletionStats, Credentials, Constants.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND cs.section_key = 'domain_entities' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Domain Entities',
   'CourseMenu, Unit, Lesson, Path, CompletionStats, Credentials, Constants.')
ON CONFLICT (content_section_id, language_id) DO NOTHING;

-- =============================================
-- Application Layer sections (merged from children)
-- =============================================
INSERT INTO content_section (entity_type, entity_id, section_key, icon, position, is_archived, is_pinned)
VALUES
  ('project', (SELECT id FROM project WHERE code = 'rosseta-stone-script-a'), 'application_layer', 'hub',    9,  false, false),
  ('project', (SELECT id FROM project WHERE code = 'rosseta-stone-script-a'), 'application_ports', 'power', 10,  false, false)
ON CONFLICT DO NOTHING;

INSERT INTO content_section_translation (content_section_id, language_id, title, body)
VALUES
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND cs.section_key = 'application_layer' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Capa de Aplicación',
   'Casos de uso, servicios de aplicación, orquestadores y puertos. Implementa toda la lógica de negocio sin depender de infraestructura concreta.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND cs.section_key = 'application_layer' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Application Layer',
   'Use cases, application services, orchestrators and ports. Implements all business logic without depending on concrete infrastructure.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND cs.section_key = 'application_ports' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Puertos (Interfaces)',
   'FoundationsApiPort, UseCasePort, OrchestratorPort, DebugDumperPort.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND cs.section_key = 'application_ports' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Ports (Interfaces)',
   'FoundationsApiPort, UseCasePort, OrchestratorPort, DebugDumperPort.')
ON CONFLICT (content_section_id, language_id) DO NOTHING;

-- =============================================
-- Use Cases (3 children → 4 sections)
-- =============================================
INSERT INTO content_section (entity_type, entity_id, section_key, icon, position, is_archived, is_pinned)
VALUES
  ('project', (SELECT id FROM project WHERE code = 'rosseta-stone-script-a'), 'uc_complete',      'done_all',     11, false, true),
  ('project', (SELECT id FROM project WHERE code = 'rosseta-stone-script-a'), 'uc_complete_flow',  'sync',         12, false, false),
  ('project', (SELECT id FROM project WHERE code = 'rosseta-stone-script-a'), 'uc_goto',           'open_in_new',  13, false, false),
  ('project', (SELECT id FROM project WHERE code = 'rosseta-stone-script-a'), 'uc_login',          'login',        14, false, false)
ON CONFLICT DO NOTHING;

INSERT INTO content_section_translation (content_section_id, language_id, title, body)
VALUES
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND cs.section_key = 'uc_complete' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Caso de Uso: Completar Foundations',
   'Caso de uso principal del proyecto. Recibe el menú del curso, filtra contenido y ejecuta la completación masiva de paths con concurrencia controlada.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND cs.section_key = 'uc_complete' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Use Case: Complete Foundations',
   'Main use case of the project. Receives the course menu, filters content and executes bulk path completion with controlled concurrency.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND cs.section_key = 'uc_complete_flow' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Flujo de Completación',
   '5 pasos: Recibe CourseMenu → ContentFilter filtra → PathCalculator calcula → asyncio.gather + Semaphore(50) → Acumula CompletionStats.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND cs.section_key = 'uc_complete_flow' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Completion Flow',
   '5 steps: Receives CourseMenu → ContentFilter filters → PathCalculator computes → asyncio.gather + Semaphore(50) → Accumulates CompletionStats.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND cs.section_key = 'uc_goto' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Caso de Uso: Navegar a Foundations',
   'Navega desde el dashboard de Rosetta Stone hasta la sección Foundations. Captura el nombre del usuario desde el DOM del dashboard.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND cs.section_key = 'uc_goto' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Use Case: Go To Foundations',
   'Navigates from the Rosetta Stone dashboard to the Foundations section. Captures the user name from the dashboard DOM.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND cs.section_key = 'uc_login' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Caso de Uso: Login',
   'Automatiza el proceso de autenticación. Navega a la página de login, rellena email y password desde Credentials, y envía el formulario.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND cs.section_key = 'uc_login' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Use Case: Login',
   'Automates the authentication process. Navigates to the login page, fills email and password from Credentials, and submits the form.')
ON CONFLICT (content_section_id, language_id) DO NOTHING;

-- =============================================
-- Services (4 children → 4 sections)
-- =============================================
INSERT INTO content_section (entity_type, entity_id, section_key, icon, position, is_archived, is_pinned)
VALUES
  ('project', (SELECT id FROM project WHERE code = 'rosseta-stone-script-a'), 'svc_path_calculator',  'calculate',       15, false, false),
  ('project', (SELECT id FROM project WHERE code = 'rosseta-stone-script-a'), 'svc_content_filter',   'filter_alt',      16, false, false),
  ('project', (SELECT id FROM project WHERE code = 'rosseta-stone-script-a'), 'svc_report_generator', 'summarize',       17, false, false),
  ('project', (SELECT id FROM project WHERE code = 'rosseta-stone-script-a'), 'svc_session_capturer', 'cell_tower',      18, false, false)
ON CONFLICT DO NOTHING;

INSERT INTO content_section_translation (content_section_id, language_id, title, body)
VALUES
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND cs.section_key = 'svc_path_calculator' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Servicio: Calculadora de Paths',
   'Calcula tiempos de completación (duration_ms) y puntajes (score_correct) con variaciones aleatorias. Configurable con target_percentage y time_offset para simular comportamiento humano realista.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND cs.section_key = 'svc_path_calculator' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Service: Path Calculator',
   'Calculates completion times (duration_ms) and scores (score_correct) with random variations. Configurable with target_percentage and time_offset to simulate realistic human behavior.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND cs.section_key = 'svc_content_filter' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Servicio: Filtro de Contenido',
   'Filtra el contenido del curso según configuración: unidades específicas, lecciones, tipos de path. Soporta force_recomplete para re-procesar paths ya completados.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND cs.section_key = 'svc_content_filter' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Service: Content Filter',
   'Filters course content per configuration: specific units, lessons, path types. Supports force_recomplete to re-process already completed paths.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND cs.section_key = 'svc_report_generator' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Servicio: Generador de Reportes',
   'Genera reportes formateados con estadísticas de completación, información de sesión, credenciales utilizadas y progreso. Guarda archivos en logs/user_data/.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND cs.section_key = 'svc_report_generator' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Service: Report Generator',
   'Generates formatted reports with completion statistics, session info, credentials used and progress. Saves files to logs/user_data/.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND cs.section_key = 'svc_session_capturer' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Servicio: Capturador de Sesión',
   'Intercepta tráfico de red de Playwright mediante page.on("request") para capturar Authorization (JWT), session_token, school_id, user_id y lang_code desde headers y query strings de rosettastone.com.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND cs.section_key = 'svc_session_capturer' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Service: Session Capturer',
   'Intercepts Playwright network traffic via page.on("request") to capture Authorization (JWT), session_token, school_id, user_id and lang_code from headers and query strings of rosettastone.com.')
ON CONFLICT (content_section_id, language_id) DO NOTHING;

-- =============================================
-- Orchestrators (2 children → 2 sections)
-- =============================================
INSERT INTO content_section (entity_type, entity_id, section_key, icon, position, is_archived, is_pinned)
VALUES
  ('project', (SELECT id FROM project WHERE code = 'rosseta-stone-script-a'), 'orch_open',     'play_circle',  19, false, false),
  ('project', (SELECT id FROM project WHERE code = 'rosseta-stone-script-a'), 'orch_complete', 'checklist',    20, false, false)
ON CONFLICT DO NOTHING;

INSERT INTO content_section_translation (content_section_id, language_id, title, body)
VALUES
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND cs.section_key = 'orch_open' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Orquestador: Abrir Foundations',
   'Compone LoginUseCase → GoToFoundationsUseCase. Coordina autenticación, navegación y captura de datos de sesión antes de la completación.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND cs.section_key = 'orch_open' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Orchestrator: Open Foundations',
   'Composes LoginUseCase → GoToFoundationsUseCase. Coordinates authentication, navigation and session data capture before completion.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND cs.section_key = 'orch_complete' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Orquestador: Completar Foundations',
   'Orquestador de alto nivel: ejecuta OpenFoundations → CompleteFoundationsUseCase → ReportGenerator → ReportHistoryAnalyzer. Flujo completo end-to-end.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND cs.section_key = 'orch_complete' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Orchestrator: Complete Foundations',
   'High-level orchestrator: runs OpenFoundations → CompleteFoundationsUseCase → ReportGenerator → ReportHistoryAnalyzer. Full end-to-end flow.')
ON CONFLICT (content_section_id, language_id) DO NOTHING;

-- =============================================
-- Infrastructure Layer + Adapters (7 children → 9 sections)
-- =============================================
INSERT INTO content_section (entity_type, entity_id, section_key, icon, position, is_archived, is_pinned)
VALUES
  ('project', (SELECT id FROM project WHERE code = 'rosseta-stone-script-a'), 'infra_layer',      'handyman',  21, false, false),
  ('project', (SELECT id FROM project WHERE code = 'rosseta-stone-script-a'), 'adapter_browser',   'web',       22, false, false),
  ('project', (SELECT id FROM project WHERE code = 'rosseta-stone-script-a'), 'adapter_api',       'api',       23, false, false),
  ('project', (SELECT id FROM project WHERE code = 'rosseta-stone-script-a'), 'adapter_parser',    'transform', 24, false, false),
  ('project', (SELECT id FROM project WHERE code = 'rosseta-stone-script-a'), 'logging',           'terminal',  25, false, false),
  ('project', (SELECT id FROM project WHERE code = 'rosseta-stone-script-a'), 'settings',          'settings',  26, false, false),
  ('project', (SELECT id FROM project WHERE code = 'rosseta-stone-script-a'), 'adapter_debug',     'bug_report',27, false, false),
  ('project', (SELECT id FROM project WHERE code = 'rosseta-stone-script-a'), 'adapter_patterns',  'code',      28, false, false)
ON CONFLICT DO NOTHING;

INSERT INTO content_section_translation (content_section_id, language_id, title, body)
VALUES
  -- infra layer overview
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND cs.section_key = 'infra_layer' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Capa de Infraestructura',
   'Adaptadores concretos que implementan los puertos definidos en la capa de aplicación. Contiene toda la lógica de integración con sistemas externos: Playwright (browser + API), parser de CourseMenu, logging, configuración Pydantic, debug y patrones regex.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND cs.section_key = 'infra_layer' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Infrastructure Layer',
   'Concrete adapters implementing ports defined in the application layer. Contains all integration logic with external systems: Playwright (browser + API), CourseMenu parser, logging, Pydantic configuration, debug and regex patterns.'),
  -- adapter_browser
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND cs.section_key = 'adapter_browser' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Adaptador: Navegador Playwright',
   'Gestiona el ciclo de vida del navegador Playwright. Configura: headless, slow_mo, user_agent, locale, viewport. Provee BrowserContext y Page para otros adaptadores.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND cs.section_key = 'adapter_browser' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Adapter: Playwright Browser',
   'Manages the Playwright browser lifecycle. Configures: headless, slow_mo, user_agent, locale, viewport. Provides BrowserContext and Page for other adapters.'),
  -- adapter_api
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND cs.section_key = 'adapter_api' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Adaptador: API de Foundations',
   'Implementa FoundationsApiPort usando APIRequestContext de Playwright para peticiones HTTP directas con cookies del navegador autenticado. Endpoints: GET courseMenu (GraphQL POST /graphql + JWT), PUT path score (REST PUT /update_path_score/{path_id} + XML body).'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND cs.section_key = 'adapter_api' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Adapter: Foundations API',
   'Implements FoundationsApiPort using Playwright APIRequestContext for direct HTTP requests with authenticated browser cookies. Endpoints: GET courseMenu (GraphQL POST /graphql + JWT), PUT path score (REST PUT /update_path_score/{path_id} + XML body).'),
  -- adapter_parser
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND cs.section_key = 'adapter_parser' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Adaptador: Parser de Menú de Cursos',
   'Convierte la respuesta JSON de GraphQL en entidades tipadas de dominio: CourseMenu → List[Unit] → List[Lesson] → List[Path]. Mapea campos del API a propiedades del dominio.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND cs.section_key = 'adapter_parser' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Adapter: Course Menu Parser',
   'Converts GraphQL JSON response to typed domain entities: CourseMenu → List[Unit] → List[Lesson] → List[Path]. Maps API fields to domain properties.'),
  -- logging
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND cs.section_key = 'logging' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Sistema de Logging',
   'Sistema de logging configurable con logging.config.dictConfig. Formatters (RelPath, File, Error, JSON), Handlers (Stream, Rotating 10MB, TimedRotating daily), Filters y auto-detección de raíz del proyecto.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND cs.section_key = 'logging' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Logging System',
   'Configurable logging system with logging.config.dictConfig. Formatters (RelPath, File, Error, JSON), Handlers (Stream, Rotating 10MB, TimedRotating daily), Filters and automatic project root detection.'),
  -- settings
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND cs.section_key = 'settings' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Configuración Pydantic',
   'RosettaSettings y BrowserSettings usando Pydantic BaseSettings con SettingsConfigDict. Lee .env y valida tipos automáticamente. Incluye @field_validator para parsear listas CSV.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND cs.section_key = 'settings' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Pydantic Settings',
   'RosettaSettings and BrowserSettings using Pydantic BaseSettings with SettingsConfigDict. Reads .env and validates types automatically. Includes @field_validator to parse CSV lists.'),
  -- adapter_debug
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND cs.section_key = 'adapter_debug' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Adaptador: Volcado de Debug',
   'Implementa DebugDumperPort. Guarda texto, metadata JSON y capturas de pantalla en debug/ con nombres sanitizados. Útil para diagnóstico durante la automatización.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND cs.section_key = 'adapter_debug' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Adapter: Debug Dumper',
   'Implements DebugDumperPort. Saves text, JSON metadata and screenshots to debug/ with sanitized names. Useful for diagnostics during automation.'),
  -- adapter_patterns
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND cs.section_key = 'adapter_patterns' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Adaptador: Patrones Web',
   'Patrones regex precompilados case-insensitive organizados por dominio: AuthPatterns, FormPatterns, LessonPatterns. Soporte bilingüe español/inglés con alternativas regex.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND cs.section_key = 'adapter_patterns' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Adapter: Web Patterns',
   'Pre-compiled case-insensitive regex patterns organized by domain: AuthPatterns, FormPatterns, LessonPatterns. Bilingual Spanish/English support with regex alternations.')
ON CONFLICT (content_section_id, language_id) DO NOTHING;

-- =============================================
-- Presentation & Shared layers (2 sections)
-- =============================================
INSERT INTO content_section (entity_type, entity_id, section_key, icon, position, is_archived, is_pinned)
VALUES
  ('project', (SELECT id FROM project WHERE code = 'rosseta-stone-script-a'), 'presentation_layer', 'terminal',     29, false, false),
  ('project', (SELECT id FROM project WHERE code = 'rosseta-stone-script-a'), 'shared_layer',       'share',        30, false, false)
ON CONFLICT DO NOTHING;

INSERT INTO content_section_translation (content_section_id, language_id, title, body)
VALUES
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND cs.section_key = 'presentation_layer' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Capa de Presentación',
   'Punto de entrada del sistema. RosettaCLI ejecuta el flujo completo con asyncio.run(). DependencyFactory construye el grafo de dependencias inyectando adaptadores en orquestadores y use cases.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND cs.section_key = 'presentation_layer' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Presentation Layer',
   'System entry point. RosettaCLI executes the full flow with asyncio.run(). DependencyFactory builds the dependency graph injecting adapters into orchestrators and use cases.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND cs.section_key = 'shared_layer' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Capa Compartida',
   'Componentes transversales: LoggingMixin para agregar logging a cualquier clase, utilidades de compilación regex compile_case_insensitive, y constantes compartidas.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND cs.section_key = 'shared_layer' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Shared Layer',
   'Cross-cutting components: LoggingMixin to add logging to any class, compile_case_insensitive regex compilation utilities, and shared constants.')
ON CONFLICT (content_section_id, language_id) DO NOTHING;

COMMIT;
