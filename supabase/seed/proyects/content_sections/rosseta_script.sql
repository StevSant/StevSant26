-- =========================
-- CONTENT_SECTION SEEDING
-- =========================
-- entity_type = 'project', entity_id = project.id
-- language: 1=es, 2=en

-- Root Project (id=1): Rosetta Stone Script A
INSERT INTO content_section (id, entity_type, entity_id, section_key, icon, position) VALUES
(1,  'project', 1, 'overview',      '📋', 1),
(2,  'project', 1, 'features',      '⚡', 2),
(3,  'project', 1, 'architecture',  '🏗️', 3),
(4,  'project', 1, 'tech_stack',    '🛠️', 4),
(5,  'project', 1, 'how_it_works',  '🔄', 5),
(6,  'project', 1, 'challenges',    '🧩', 6),

-- Domain Layer (id=2)
(7,  'project', 2, 'overview',  '📋', 1),
(8,  'project', 2, 'entities',  '📦', 2),

-- Application Layer (id=3)
(9,  'project', 3, 'overview',  '📋', 1),
(10, 'project', 3, 'ports',    '🔌', 2),

-- Infrastructure Layer (id=4)
(11, 'project', 4, 'overview',  '📋', 1),
(12, 'project', 4, 'adapters',  '🔧', 2),

-- Presentation Layer (id=5)
(13, 'project', 5, 'overview',  '📋', 1),

-- Shared Layer (id=6)
(14, 'project', 6, 'overview',  '📋', 1),

-- Use Case: Complete Foundations (id=7)
(15, 'project', 7, 'overview',  '📋', 1),
(16, 'project', 7, 'flow',     '🔄', 2),

-- Use Case: Go To Foundations (id=8)
(17, 'project', 8, 'overview',  '📋', 1),

-- Use Case: Login (id=9)
(18, 'project', 9, 'overview',  '📋', 1),

-- Service: Path Calculator (id=10)
(19, 'project', 10, 'overview', '📋', 1),

-- Service: Content Filter (id=11)
(20, 'project', 11, 'overview', '📋', 1),

-- Service: Report Generator (id=12)
(21, 'project', 12, 'overview', '📋', 1),

-- Service: Session Capturer (id=13)
(22, 'project', 13, 'overview', '📋', 1),

-- Orchestrator: Open Foundations (id=14)
(23, 'project', 14, 'overview', '📋', 1),

-- Orchestrator: Complete Foundations (id=15)
(24, 'project', 15, 'overview', '📋', 1),

-- Adapter: Playwright Browser (id=16)
(25, 'project', 16, 'overview', '📋', 1),

-- Adapter: Foundations API (id=17)
(26, 'project', 17, 'overview',   '📋', 1),
(27, 'project', 17, 'endpoints',  '🌐', 2),

-- Adapter: Course Menu Parser (id=18)
(28, 'project', 18, 'overview', '📋', 1),

-- Infra: Logging (id=19)
(29, 'project', 19, 'overview',  '📋', 1),
(30, 'project', 19, 'config',   '⚙️', 2),

-- Infra: Settings (id=20)
(31, 'project', 20, 'overview', '📋', 1),

-- Adapter: Debug Dumper (id=21)
(32, 'project', 21, 'overview', '📋', 1),

-- Adapter: Patterns (id=22)
(33, 'project', 22, 'overview', '📋', 1);

SELECT setval('content_section_id_seq', (SELECT MAX(id) FROM content_section));


-- =========================
-- CONTENT_SECTION_TRANSLATION SEEDING
-- =========================

INSERT INTO content_section_translation (content_section_id, language_id, title, body) VALUES

-- === Root Project (id=1) sections ===

-- Section 1: overview
(1, 1, 'Descripción General',
'Bot de automatización que completa lecciones de **Rosetta Stone Foundations** de forma programática. En lugar de interactuar manualmente con cada ejercicio, el bot captura tokens de sesión mediante interceptación de tráfico de red y envía puntuaciones directamente a las APIs de Rosetta Stone (GraphQL + REST).'),
(1, 2, 'Overview',
'Automation bot that programmatically completes **Rosetta Stone Foundations** lessons. Instead of manually interacting with each exercise, the bot captures session tokens via network traffic interception and submits scores directly to Rosetta Stone APIs (GraphQL + REST).'),

-- Section 2: features
(2, 1, 'Características Principales',
'- **Automatización completa**: login → navegación → captura de sesión → completación masiva
- **Concurrencia controlada**: hasta 50 paths simultáneos con `asyncio.Semaphore`
- **Simulación realista**: tiempos y puntajes con variaciones aleatorias para imitar comportamiento humano
- **Filtrado configurable**: seleccionar unidades, lecciones y tipos de path específicos
- **Reportes automáticos**: generación de reportes con estadísticas y análisis histórico
- **Debug integrado**: dumps de texto, metadata y screenshots para diagnóstico'),
(2, 2, 'Key Features',
'- **Full automation**: login → navigation → session capture → bulk completion
- **Controlled concurrency**: up to 50 simultaneous paths with `asyncio.Semaphore`
- **Realistic simulation**: times and scores with random variations to mimic human behavior
- **Configurable filtering**: select specific units, lessons and path types
- **Automatic reports**: report generation with statistics and historical analysis
- **Integrated debug**: text dumps, metadata and screenshots for diagnostics'),

-- Section 3: architecture
(3, 1, 'Arquitectura',
'Implementa **Arquitectura Hexagonal (Ports & Adapters)** con 5 capas:

```
Presentation (CLI, DI Factory)
    └── Application (Use Cases, Services, Orchestrators, Ports)
        └── Domain (Entities, Constants)
        └── Infrastructure (Adapters, Logging, Settings)
    └── Shared (Mixins, Utils)
```

Cada capa tiene responsabilidades claras y las dependencias apuntan hacia el dominio.'),
(3, 2, 'Architecture',
'Implements **Hexagonal Architecture (Ports & Adapters)** with 5 layers:

```
Presentation (CLI, DI Factory)
    └── Application (Use Cases, Services, Orchestrators, Ports)
        └── Domain (Entities, Constants)
        └── Infrastructure (Adapters, Logging, Settings)
    └── Shared (Mixins, Utils)
```

Each layer has clear responsibilities and dependencies point toward the domain.'),

-- Section 4: tech_stack
(4, 1, 'Stack Tecnológico',
'| Tecnología | Uso |
|---|---|
| Python 3.14 | Lenguaje principal |
| Playwright | Automatización de navegador e interceptación de red |
| Pydantic Settings | Configuración tipada desde `.env` |
| asyncio | Concurrencia asíncrona |
| logging (dictConfig) | Logging con rotación, formatters JSON/File |'),
(4, 2, 'Tech Stack',
'| Technology | Usage |
|---|---|
| Python 3.14 | Main language |
| Playwright | Browser automation and network interception |
| Pydantic Settings | Typed configuration from `.env` |
| asyncio | Async concurrency |
| logging (dictConfig) | Logging with rotation, JSON/File formatters |'),

-- Section 5: how_it_works
(5, 1, 'Cómo Funciona',
'1. **Login**: Playwright abre el navegador, rellena credenciales y autentica
2. **Navegación**: Navega al dashboard → Foundations
3. **Captura de sesión**: Intercepta tráfico de red para extraer `Authorization`, `session_token`, `school_id`, `user_id`, `lang_code`
4. **Obtención del curso**: Petición GraphQL para obtener el `courseMenu` completo
5. **Filtrado**: `ContentFilter` selecciona unidades/lecciones/paths según configuración
6. **Completación masiva**: `asyncio.gather` + `Semaphore(50)` envían PUT requests con XML body y puntajes calculados
7. **Reporte**: Genera archivo con estadísticas de completación'),
(5, 2, 'How It Works',
'1. **Login**: Playwright opens browser, fills credentials and authenticates
2. **Navigation**: Navigates to dashboard → Foundations
3. **Session capture**: Intercepts network traffic to extract `Authorization`, `session_token`, `school_id`, `user_id`, `lang_code`
4. **Course fetch**: GraphQL request to get the complete `courseMenu`
5. **Filtering**: `ContentFilter` selects units/lessons/paths per configuration
6. **Bulk completion**: `asyncio.gather` + `Semaphore(50)` send PUT requests with XML body and calculated scores
7. **Report**: Generates file with completion statistics'),

-- Section 6: challenges
(6, 1, 'Desafíos Técnicos',
'- **Ingeniería inversa de APIs**: Analizar tráfico para descubrir endpoints GraphQL y REST XML no documentados
- **Simulación humana**: Generar tiempos de completación y puntajes con variaciones realistas para evitar detección
- **Manejo de sesiones**: Extraer múltiples tokens desde diferentes URLs y headers de forma robusta
- **Concurrencia segura**: Balancear velocidad con el semáforo para no sobrecargar los servidores'),
(6, 2, 'Technical Challenges',
'- **API reverse engineering**: Analyzing traffic to discover undocumented GraphQL and REST XML endpoints
- **Human simulation**: Generating completion times and scores with realistic variations to avoid detection
- **Session handling**: Robustly extracting multiple tokens from different URLs and headers
- **Safe concurrency**: Balancing speed with semaphore to avoid overloading servers'),

-- === Domain Layer (id=2) ===

(7, 1, 'Descripción General',
'Capa de entidades puras sin dependencias externas. Define el modelo de negocio del curso de Rosetta Stone y constantes del dominio.'),
(7, 2, 'Overview',
'Pure entity layer with no external dependencies. Defines the Rosetta Stone course business model and domain constants.'),

(8, 1, 'Entidades',
'- **CourseMenu**: raíz del curso con nombre y lista de unidades
- **Unit**: unidad con índice, título, lecciones
- **Lesson**: lección con índice, título, paths
- **Path**: path individual con tipo, estado de completación, puntaje
- **CompletionStats**: estadísticas agregadas de completación
- **Credentials**: credenciales de acceso (email, password)
- **Constants**: timeouts, URLs base, tiempos de espera'),
(8, 2, 'Entities',
'- **CourseMenu**: course root with name and unit list
- **Unit**: unit with index, title, lessons
- **Lesson**: lesson with index, title, paths
- **Path**: individual path with type, completion state, score
- **CompletionStats**: aggregated completion statistics
- **Credentials**: access credentials (email, password)
- **Constants**: timeouts, base URLs, wait times'),

-- === Application Layer (id=3) ===

(9, 1, 'Descripción General',
'Casos de uso, servicios de aplicación, orquestadores y puertos. Implementa toda la lógica de negocio sin depender de infraestructura concreta.'),
(9, 2, 'Overview',
'Use cases, application services, orchestrators and ports. Implements all business logic without depending on concrete infrastructure.'),

(10, 1, 'Puertos (Interfaces)',
'- **FoundationsApiPort**: obtener menú de curso y actualizar puntuaciones
- **UseCasePort**: contrato base para casos de uso
- **OrchestratorPort**: contrato base para orquestadores
- **DebugDumperPort**: guardar datos de debug (texto, metadata, screenshots)'),
(10, 2, 'Ports (Interfaces)',
'- **FoundationsApiPort**: fetch course menu and update scores
- **UseCasePort**: base contract for use cases
- **OrchestratorPort**: base contract for orchestrators
- **DebugDumperPort**: save debug data (text, metadata, screenshots)'),

-- === Infrastructure Layer (id=4) ===

(11, 1, 'Descripción General',
'Adaptadores concretos que implementan los puertos definidos en la capa de aplicación. Contiene toda la lógica de integración con sistemas externos.'),
(11, 2, 'Overview',
'Concrete adapters implementing ports defined in the application layer. Contains all integration logic with external systems.'),

(12, 1, 'Adaptadores',
'- **PlaywrightBrowserProvider**: gestión del navegador web
- **PlaywrightFoundationsApiAdapter**: peticiones GraphQL y REST XML
- **CourseMenuParser**: conversión JSON → entidades de dominio
- **PlaywrightFileDebugDumperAdapter**: dumps de debug a disco
- **Patterns**: regex compilados para matching web multilingüe'),
(12, 2, 'Adapters',
'- **PlaywrightBrowserProvider**: web browser management
- **PlaywrightFoundationsApiAdapter**: GraphQL and REST XML requests
- **CourseMenuParser**: JSON → domain entity conversion
- **PlaywrightFileDebugDumperAdapter**: debug dumps to disk
- **Patterns**: compiled regex for multilingual web matching'),

-- === Presentation Layer (id=5) ===

(13, 1, 'Descripción General',
'Punto de entrada del sistema. `RosettaCLI` ejecuta el flujo completo con `asyncio.run()`. `DependencyFactory` construye el grafo de dependencias inyectando adaptadores en orquestadores y use cases.'),
(13, 2, 'Overview',
'System entry point. `RosettaCLI` executes the full flow with `asyncio.run()`. `DependencyFactory` builds the dependency graph injecting adapters into orchestrators and use cases.'),

-- === Shared Layer (id=6) ===

(14, 1, 'Descripción General',
'Componentes transversales: `LoggingMixin` para agregar logging a cualquier clase, utilidades de compilación regex `compile_case_insensitive`, y constantes compartidas.'),
(14, 2, 'Overview',
'Cross-cutting components: `LoggingMixin` to add logging to any class, `compile_case_insensitive` regex compilation utilities, and shared constants.'),

-- === Use Case: Complete Foundations (id=7) ===

(15, 1, 'Descripción General',
'Caso de uso principal del proyecto. Recibe el menú del curso, filtra contenido y ejecuta la completación masiva de paths con concurrencia controlada.'),
(15, 2, 'Overview',
'Main use case of the project. Receives the course menu, filters content and executes bulk path completion with controlled concurrency.'),

(16, 1, 'Flujo de Ejecución',
'1. Recibe `CourseMenu` del orquestador
2. `ContentFilter` filtra unidades, lecciones y path types
3. Para cada path: `PathCalculator` calcula `duration_ms` y `score_correct`
4. `asyncio.gather` + `Semaphore(50)` → llamadas concurrentes a `FoundationsApiPort.update_path_score`
5. Acumula `CompletionStats` con contadores de éxito/fallo'),
(16, 2, 'Execution Flow',
'1. Receives `CourseMenu` from orchestrator
2. `ContentFilter` filters units, lessons and path types
3. For each path: `PathCalculator` computes `duration_ms` and `score_correct`
4. `asyncio.gather` + `Semaphore(50)` → concurrent calls to `FoundationsApiPort.update_path_score`
5. Accumulates `CompletionStats` with success/failure counters'),

-- === Use Case: Go To Foundations (id=8) ===

(17, 1, 'Descripción General',
'Navega desde el dashboard de Rosetta Stone hasta la sección Foundations. Captura el nombre del usuario desde el DOM del dashboard.'),
(17, 2, 'Overview',
'Navigates from the Rosetta Stone dashboard to the Foundations section. Captures the user name from the dashboard DOM.'),

-- === Use Case: Login (id=9) ===

(18, 1, 'Descripción General',
'Automatiza el proceso de autenticación. Navega a la página de login, rellena email y password desde `Credentials`, y envía el formulario.'),
(18, 2, 'Overview',
'Automates the authentication process. Navigates to the login page, fills email and password from `Credentials`, and submits the form.'),

-- === Service: Path Calculator (id=10) ===

(19, 1, 'Descripción General',
'Calcula tiempos de completación (`duration_ms`) y puntajes (`score_correct`) con variaciones aleatorias. Configurable con `target_percentage` y `time_offset` para simular comportamiento humano realista.'),
(19, 2, 'Overview',
'Calculates completion times (`duration_ms`) and scores (`score_correct`) with random variations. Configurable with `target_percentage` and `time_offset` to simulate realistic human behavior.'),

-- === Service: Content Filter (id=11) ===

(20, 1, 'Descripción General',
'Filtra el contenido del curso según configuración: unidades específicas, lecciones, tipos de path. Soporta `force_recomplete` para re-procesar paths ya completados.'),
(20, 2, 'Overview',
'Filters course content per configuration: specific units, lessons, path types. Supports `force_recomplete` to re-process already completed paths.'),

-- === Service: Report Generator (id=12) ===

(21, 1, 'Descripción General',
'Genera reportes formateados con estadísticas de completación, información de sesión, credenciales utilizadas y progreso. Guarda archivos en `logs/user_data/`.'),
(21, 2, 'Overview',
'Generates formatted reports with completion statistics, session info, credentials used and progress. Saves files to `logs/user_data/`.'),

-- === Service: Session Capturer (id=13) ===

(22, 1, 'Descripción General',
'Intercepta tráfico de red de Playwright mediante `page.on("request")` para capturar `Authorization` (JWT), `session_token`, `school_id`, `user_id` y `lang_code` desde headers y query strings de `rosettastone.com`.'),
(22, 2, 'Overview',
'Intercepts Playwright network traffic via `page.on("request")` to capture `Authorization` (JWT), `session_token`, `school_id`, `user_id` and `lang_code` from headers and query strings of `rosettastone.com`.'),

-- === Orchestrator: Open Foundations (id=14) ===

(23, 1, 'Descripción General',
'Compone `LoginUseCase` → `GoToFoundationsUseCase`. Coordina autenticación, navegación y captura de datos de sesión antes de la completación.'),
(23, 2, 'Overview',
'Composes `LoginUseCase` → `GoToFoundationsUseCase`. Coordinates authentication, navigation and session data capture before completion.'),

-- === Orchestrator: Complete Foundations (id=15) ===

(24, 1, 'Descripción General',
'Orquestador de alto nivel: ejecuta `OpenFoundations` → `CompleteFoundationsUseCase` → `ReportGenerator` → `ReportHistoryAnalyzer`. Flujo completo end-to-end.'),
(24, 2, 'Overview',
'High-level orchestrator: runs `OpenFoundations` → `CompleteFoundationsUseCase` → `ReportGenerator` → `ReportHistoryAnalyzer`. Full end-to-end flow.'),

-- === Adapter: Playwright Browser (id=16) ===

(25, 1, 'Descripción General',
'Gestiona el ciclo de vida del navegador Playwright. Configura: headless, slow_mo, user_agent, locale, viewport. Provee `BrowserContext` y `Page` para otros adaptadores.'),
(25, 2, 'Overview',
'Manages the Playwright browser lifecycle. Configures: headless, slow_mo, user_agent, locale, viewport. Provides `BrowserContext` and `Page` for other adapters.'),

-- === Adapter: Foundations API (id=17) ===

(26, 1, 'Descripción General',
'Implementa `FoundationsApiPort` usando `APIRequestContext` de Playwright para peticiones HTTP directas con cookies del navegador autenticado.'),
(26, 2, 'Overview',
'Implements `FoundationsApiPort` using Playwright `APIRequestContext` for direct HTTP requests with authenticated browser cookies.'),

(27, 1, 'Endpoints',
'- **GET courseMenu** (GraphQL): `POST /graphql` con query `courseMenu` y token JWT en header `Authorization`
- **PUT path score** (REST): `PUT /update_path_score/{path_id}` con body XML, headers `x-rosettastone-protocol-version`, `x-rosettastone-session-token`, `Sec-Fetch-*`'),
(27, 2, 'Endpoints',
'- **GET courseMenu** (GraphQL): `POST /graphql` with `courseMenu` query and JWT token in `Authorization` header
- **PUT path score** (REST): `PUT /update_path_score/{path_id}` with XML body, `x-rosettastone-protocol-version`, `x-rosettastone-session-token`, `Sec-Fetch-*` headers'),

-- === Adapter: Course Menu Parser (id=18) ===

(28, 1, 'Descripción General',
'Convierte la respuesta JSON de GraphQL en entidades tipadas de dominio: `CourseMenu` → `List[Unit]` → `List[Lesson]` → `List[Path]`. Mapea campos del API a propiedades del dominio.'),
(28, 2, 'Overview',
'Converts GraphQL JSON response to typed domain entities: `CourseMenu` → `List[Unit]` → `List[Lesson]` → `List[Path]`. Maps API fields to domain properties.'),

-- === Infra: Logging (id=19) ===

(29, 1, 'Descripción General',
'Sistema de logging configurable con `logging.config.dictConfig`. Soporta múltiples handlers y formatters simultáneos.'),
(29, 2, 'Overview',
'Configurable logging system with `logging.config.dictConfig`. Supports multiple simultaneous handlers and formatters.'),

(30, 1, 'Configuración',
'- **Formatters**: RelPathFormatter (consola), FileFormatter, ErrorFileFormatter, JSONFormatter (ELK/Datadog)
- **Handlers**: StreamHandler (consola), RotatingFileHandler (10MB), TimedRotatingFileHandler (diario)
- **Filtros**: exclusión de logs de venv y librerías de terceros
- **Auto-detección**: encuentra la raíz del proyecto para rutas relativas en logs'),
(30, 2, 'Configuration',
'- **Formatters**: RelPathFormatter (console), FileFormatter, ErrorFileFormatter, JSONFormatter (ELK/Datadog)
- **Handlers**: StreamHandler (console), RotatingFileHandler (10MB), TimedRotatingFileHandler (daily)
- **Filters**: exclusion of venv and third-party library logs
- **Auto-detection**: finds project root for relative paths in logs'),

-- === Infra: Settings (id=20) ===

(31, 1, 'Descripción General',
'`RosettaSettings` y `BrowserSettings` usando Pydantic `BaseSettings` con `SettingsConfigDict`. Lee `.env` y valida tipos automáticamente. Incluye `@field_validator` para parsear listas CSV.'),
(31, 2, 'Overview',
'`RosettaSettings` and `BrowserSettings` using Pydantic `BaseSettings` with `SettingsConfigDict`. Reads `.env` and validates types automatically. Includes `@field_validator` to parse CSV lists.'),

-- === Adapter: Debug Dumper (id=21) ===

(32, 1, 'Descripción General',
'Implementa `DebugDumperPort`. Guarda texto, metadata JSON y capturas de pantalla en `debug/` con nombres sanitizados. Útil para diagnóstico durante la automatización.'),
(32, 2, 'Overview',
'Implements `DebugDumperPort`. Saves text, JSON metadata and screenshots to `debug/` with sanitized names. Useful for diagnostics during automation.'),

-- === Adapter: Patterns (id=22) ===

(33, 1, 'Descripción General',
'Patrones regex precompilados case-insensitive organizados por dominio: `AuthPatterns` (sign_in, login_page, forgot_password), `FormPatterns` (submit, reset, edit), `LessonPatterns` (foundations). Soporte bilingüe español/inglés con alternativas regex.'),
(33, 2, 'Overview',
'Pre-compiled case-insensitive regex patterns organized by domain: `AuthPatterns` (sign_in, login_page, forgot_password), `FormPatterns` (submit, reset, edit), `LessonPatterns` (foundations). Bilingual Spanish/English support with regex alternations.');
