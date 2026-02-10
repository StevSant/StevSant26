-- ============================================================
-- Rosetta Stone Script A - Content Sections & Translations
-- ============================================================
-- Curated: 6 high-value sections covering the project holistically.
-- All icons: Material Symbols Outlined (lowercase).
-- ============================================================
BEGIN;

INSERT INTO content_section (entity_type, entity_id, section_key, icon, position, is_archived, is_pinned)
VALUES
  ('project', (SELECT id FROM project WHERE code = 'rosseta-stone-script-a'), 'overview',     'info',         1, false, true),
  ('project', (SELECT id FROM project WHERE code = 'rosseta-stone-script-a'), 'features',     'bolt',         2, false, false),
  ('project', (SELECT id FROM project WHERE code = 'rosseta-stone-script-a'), 'architecture', 'construction', 3, false, true),
  ('project', (SELECT id FROM project WHERE code = 'rosseta-stone-script-a'), 'tech_stack',   'build',        4, false, false),
  ('project', (SELECT id FROM project WHERE code = 'rosseta-stone-script-a'), 'how_it_works', 'sync',         5, false, false),
  ('project', (SELECT id FROM project WHERE code = 'rosseta-stone-script-a'), 'challenges',   'extension',    6, false, false)
ON CONFLICT DO NOTHING;

INSERT INTO content_section_translation (content_section_id, language_id, title, body)
VALUES
  -- overview
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND cs.section_key = 'overview' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Descripción General',
   E'Bot de automatización que completa lecciones de **Rosetta Stone Foundations** de forma programática. En lugar de interactuar manualmente con cada ejercicio, el bot captura tokens de sesión mediante interceptación de tráfico de red y envía puntuaciones directamente a las APIs de Rosetta Stone (GraphQL + REST).\n\nEl enfoque es completamente headless tras la captura inicial de sesión: no simula clics ni interacciones de UI, sino que realiza llamadas directas a las APIs internas de la plataforma con payloads de completación construidos programáticamente.\n\nSoporta completación masiva con concurrencia controlada, filtrado configurable de unidades y lecciones, y generación automática de reportes con estadísticas detalladas de progreso.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND cs.section_key = 'overview' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Overview',
   E'Automation bot that programmatically completes **Rosetta Stone Foundations** lessons. Instead of manually interacting with each exercise, the bot captures session tokens via network traffic interception and submits scores directly to Rosetta Stone APIs (GraphQL + REST).\n\nThe approach is fully headless after initial session capture: it doesn''t simulate clicks or UI interactions, but makes direct calls to the platform''s internal APIs with programmatically built completion payloads.\n\nSupports bulk completion with controlled concurrency, configurable unit and lesson filtering, and automatic report generation with detailed progress statistics.'),

  -- features
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND cs.section_key = 'features' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Características Principales',
   E'• **Automatización completa**: login → navegación → captura de sesión → completación masiva sin intervención manual\n• **Concurrencia controlada**: hasta 50 paths simultáneos con asyncio.Semaphore para evitar rate limiting\n• **Simulación realista**: tiempos de completación y puntajes con variaciones aleatorias gaussianas para imitar comportamiento humano y evitar detección\n• **Filtrado configurable**: seleccionar unidades, lecciones y tipos de path específicos mediante parámetros CLI\n• **Reportes automáticos**: generación de reportes en consola con estadísticas de éxito/fallo, tiempos de ejecución y análisis histórico comparativo\n• **Debug integrado**: dumps de texto, metadata de respuestas API y screenshots del navegador para diagnóstico de fallos'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND cs.section_key = 'features' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Key Features',
   E'• **Full automation**: login → navigation → session capture → bulk completion without manual intervention\n• **Controlled concurrency**: up to 50 simultaneous paths with asyncio.Semaphore to avoid rate limiting\n• **Realistic simulation**: completion times and scores with Gaussian random variations to mimic human behavior and avoid detection\n• **Configurable filtering**: select specific units, lessons, and path types via CLI parameters\n• **Automatic reports**: console report generation with success/failure statistics, execution times, and comparative historical analysis\n• **Integrated debug**: text dumps, API response metadata, and browser screenshots for failure diagnostics'),

  -- architecture
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND cs.section_key = 'architecture' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Arquitectura',
   E'Implementa **Arquitectura Hexagonal (Ports & Adapters)** con 5 capas claramente separadas:\n\n    Presentation (CLI, DI Factory)\n        └── Application (Use Cases, Services, Orchestrators, Ports)\n            └── Domain (Entities, Constants)\n            └── Infrastructure (Adapters, Logging, Settings)\n        └── Shared (Mixins, Utils)\n\nLa capa de Presentation maneja la interfaz CLI y la inyección de dependencias. Application contiene los casos de uso (CompletePaths, GenerateReport) y puertos abstractos. Domain define entidades como Course, Unit, Lesson, Path con sus invariantes de negocio. Infrastructure implementa los puertos con adaptadores concretos para Playwright (browser), HTTP (APIs), y el sistema de archivos (reportes).\n\nCada capa tiene responsabilidades claras y las dependencias apuntan hacia el dominio, permitiendo testear la lógica de negocio sin infraestructura real.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND cs.section_key = 'architecture' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Architecture',
   E'Implements **Hexagonal Architecture (Ports & Adapters)** with 5 clearly separated layers:\n\n    Presentation (CLI, DI Factory)\n        └── Application (Use Cases, Services, Orchestrators, Ports)\n            └── Domain (Entities, Constants)\n            └── Infrastructure (Adapters, Logging, Settings)\n        └── Shared (Mixins, Utils)\n\nThe Presentation layer handles the CLI interface and dependency injection. Application contains use cases (CompletePaths, GenerateReport) and abstract ports. Domain defines entities like Course, Unit, Lesson, Path with their business invariants. Infrastructure implements ports with concrete adapters for Playwright (browser), HTTP (APIs), and the file system (reports).\n\nEach layer has clear responsibilities and dependencies point toward the domain, allowing business logic testing without real infrastructure.'),

  -- tech_stack
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND cs.section_key = 'tech_stack' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Stack Tecnológico',
   E'**Runtime:** Python 3.14 con tipado estricto y dataclasses para entidades de dominio\n**Automatización:** Playwright para la captura inicial de sesión (login + interceptación de red)\n**Configuración:** Pydantic Settings para gestión de variables de entorno con validación de tipos\n**Concurrencia:** asyncio nativo con Semaphore para control de paralelismo y aiohttp para requests HTTP async\n**Logging:** logging con dictConfig para configuración declarativa de handlers, formatters y niveles por módulo'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND cs.section_key = 'tech_stack' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Tech Stack',
   E'**Runtime:** Python 3.14 with strict typing and dataclasses for domain entities\n**Automation:** Playwright for initial session capture (login + network interception)\n**Configuration:** Pydantic Settings for environment variable management with type validation\n**Concurrency:** Native asyncio with Semaphore for parallelism control and aiohttp for async HTTP requests\n**Logging:** logging with dictConfig for declarative handler, formatter, and per-module level configuration'),

  -- how_it_works
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND cs.section_key = 'how_it_works' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Cómo Funciona',
   E'El bot opera en 7 pasos secuenciales:\n\n1. **Login** — Playwright abre un browser headless y realiza login con credenciales institucionales\n2. **Navegación** — Navega al dashboard del curso para activar las rutas API internas\n3. **Captura de sesión** — Intercepta el tráfico de red para extraer tokens JWT, cookies de sesión y headers de autenticación\n4. **Obtención del curso** — Consulta la API GraphQL de Rosetta Stone para obtener la estructura completa del curso (unidades → lecciones → paths)\n5. **Filtrado** — Aplica los filtros configurados por CLI para seleccionar solo los paths pendientes de las unidades/lecciones deseadas\n6. **Completación masiva** — Ejecuta hasta 50 completaciones concurrentes, cada una construyendo un payload con tiempo y puntaje simulado y enviándolo a la API REST\n7. **Reporte** — Genera un resumen con paths completados, fallidos, tiempo total de ejecución y comparación con ejecuciones anteriores'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND cs.section_key = 'how_it_works' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'How It Works',
   E'The bot operates in 7 sequential steps:\n\n1. **Login** — Playwright opens a headless browser and logs in with institutional credentials\n2. **Navigation** — Navigates to the course dashboard to activate internal API routes\n3. **Session capture** — Intercepts network traffic to extract JWT tokens, session cookies, and authentication headers\n4. **Course fetch** — Queries Rosetta Stone''s GraphQL API to get the complete course structure (units → lessons → paths)\n5. **Filtering** — Applies CLI-configured filters to select only pending paths from desired units/lessons\n6. **Bulk completion** — Executes up to 50 concurrent completions, each building a payload with simulated time and score and sending it to the REST API\n7. **Report** — Generates a summary with completed paths, failures, total execution time, and comparison with previous runs'),

  -- challenges
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND cs.section_key = 'challenges' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Desafíos Técnicos',
   E'**Ingeniería inversa de APIs** — La plataforma Rosetta Stone usa una combinación no documentada de GraphQL para lectura y REST XML para escritura de puntuaciones. Mapear los endpoints, payloads y headers de autenticación requirió análisis extensivo del tráfico de red con DevTools.\n\n**Simulación de comportamiento humano** — Los tiempos de completación y puntajes deben variar de forma realista con distribución gaussiana. Puntajes perfectos repetidos o tiempos idénticos serían detectables como automatización.\n\n**Gestión de sesión** — Los tokens de Rosetta Stone tienen expiración corta y se renuevan con cookies HTTP-only que solo son accesibles mediante interceptación de tráfico de red con Playwright, no extraíbles directamente del DOM.\n\n**Concurrencia segura** — Enviar demasiadas requests simultáneas activa rate limiting. El semáforo asyncio limita las completaciones concurrentes y añade delays aleatorios entre batches.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND cs.section_key = 'challenges' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Technical Challenges',
   E'**API reverse engineering** — Rosetta Stone''s platform uses an undocumented combination of GraphQL for reading and REST XML for score writing. Mapping endpoints, payloads, and authentication headers required extensive network traffic analysis with DevTools.\n\n**Human behavior simulation** — Completion times and scores must vary realistically with Gaussian distribution. Repeated perfect scores or identical times would be detectable as automation.\n\n**Session management** — Rosetta Stone tokens have short expiration and are renewed with HTTP-only cookies only accessible via Playwright network traffic interception, not directly extractable from the DOM.\n\n**Safe concurrency** — Sending too many simultaneous requests triggers rate limiting. The asyncio semaphore limits concurrent completions and adds random delays between batches.')
ON CONFLICT (content_section_id, language_id) DO NOTHING;

COMMIT;
