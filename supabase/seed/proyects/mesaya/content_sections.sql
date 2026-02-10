-- ============================================================
-- mesaYA - Content Sections & Translations
-- ============================================================
-- Sub-modules merged as content_sections on their parent project.
-- All icons: Material Icons lowercase.
-- ============================================================
BEGIN;

-- =========================================
-- Root (mesaya): 6 sections
-- (3 original + 3 from infrastructure)
-- =========================================
INSERT INTO content_section (entity_type, entity_id, section_key, icon, position, is_archived, is_pinned)
VALUES
  ('project', (SELECT id FROM project WHERE code = 'mesaya'), 'overview',     'folder_open',    1, false, true),
  ('project', (SELECT id FROM project WHERE code = 'mesaya'), 'architecture', 'account_tree',   2, false, true),
  ('project', (SELECT id FROM project WHERE code = 'mesaya'), 'tech_stack',   'layers',         3, false, false),
  ('project', (SELECT id FROM project WHERE code = 'mesaya'), 'infra_kafka',  'stream',         4, false, false),
  ('project', (SELECT id FROM project WHERE code = 'mesaya'), 'infra_n8n',    'auto_fix_high',  5, false, false),
  ('project', (SELECT id FROM project WHERE code = 'mesaya'), 'infra_docker', 'cloud',          6, false, true)
ON CONFLICT DO NOTHING;

INSERT INTO content_section_translation (content_section_id, language_id, title, body)
VALUES
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya') AND cs.section_key = 'overview' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Descripción General',
   'mesaYA es una plataforma de reservas de restaurantes con arquitectura de microservicios. Conecta clientes con restaurantes mediante reservas en tiempo real, chatbot con IA, pagos en línea y mapas interactivos de mesas.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya') AND cs.section_key = 'overview' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Overview',
   'mesaYA is a restaurant reservation platform with microservices architecture. It connects customers with restaurants through real-time reservations, AI chatbot, online payments, and interactive table maps.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya') AND cs.section_key = 'architecture' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Arquitectura',
   'Frontend Angular 19 (SSR), API de Reservas (NestJS + DDD), Auth MS (NestJS + RBAC), GraphQL Gateway (Python + Strawberry), Chatbot (Python), Payment MS (NestJS), WebSocket Service y MCP. Comunicación asíncrona con Kafka y orquestación con Docker Compose.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya') AND cs.section_key = 'architecture' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Architecture',
   'Angular 19 Frontend (SSR), Reservation API (NestJS + DDD), Auth MS (NestJS + RBAC), GraphQL Gateway (Python + Strawberry), Chatbot (Python), Payment MS (NestJS), WebSocket Service, and MCP. Async communication via Kafka and orchestration with Docker Compose.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya') AND cs.section_key = 'tech_stack' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Stack Tecnológico',
   'TypeScript, Angular 19, NestJS, Python, Strawberry GraphQL, PostgreSQL, TypeORM, Kafka, Docker, Jest, SonarQube, GitHub Actions, JWT, Swagger.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya') AND cs.section_key = 'tech_stack' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Tech Stack',
   'TypeScript, Angular 19, NestJS, Python, Strawberry GraphQL, PostgreSQL, TypeORM, Kafka, Docker, Jest, SonarQube, GitHub Actions, JWT, Swagger.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya') AND cs.section_key = 'infra_kafka' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Infraestructura Kafka',
   'Brokers Kafka, topics de eventos de dominio y conectores para comunicación asíncrona entre microservicios.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya') AND cs.section_key = 'infra_kafka' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Kafka Infrastructure',
   'Kafka brokers, domain event topics, and connectors for async communication between microservices.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya') AND cs.section_key = 'infra_n8n' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Automatización n8n',
   'Flujos de automatización con n8n para integraciones y workflows del ecosistema mesaYA.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya') AND cs.section_key = 'infra_n8n' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'n8n Automation',
   'Automation flows with n8n for integrations and workflows of the mesaYA ecosystem.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya') AND cs.section_key = 'infra_docker' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Docker y Orquestación',
   'Docker Compose con PostgreSQL, Kafka, Zookeeper, n8n y todos los microservicios. Redes, volúmenes y variables de entorno.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya') AND cs.section_key = 'infra_docker' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Docker & Orchestration',
   'Docker Compose with PostgreSQL, Kafka, Zookeeper, n8n, and all microservices. Networks, volumes, and environment variables.')
ON CONFLICT (content_section_id, language_id) DO NOTHING;

-- =========================================
-- Frontend (mesaya-frontend): 6 sections
-- (2 original + 4 from fe sub-modules)
-- =========================================
INSERT INTO content_section (entity_type, entity_id, section_key, icon, position, is_archived, is_pinned)
VALUES
  ('project', (SELECT id FROM project WHERE code = 'mesaya-frontend'), 'overview',       'web',       1, false, true),
  ('project', (SELECT id FROM project WHERE code = 'mesaya-frontend'), 'features',       'star',      2, false, false),
  ('project', (SELECT id FROM project WHERE code = 'mesaya-frontend'), 'restaurant_map', 'map',       3, false, true),
  ('project', (SELECT id FROM project WHERE code = 'mesaya-frontend'), 'table_adapter',  'grid_on',   4, false, false),
  ('project', (SELECT id FROM project WHERE code = 'mesaya-frontend'), 'i18n',           'translate', 5, false, false),
  ('project', (SELECT id FROM project WHERE code = 'mesaya-frontend'), 'settings',       'settings',  6, false, false)
ON CONFLICT DO NOTHING;

INSERT INTO content_section_translation (content_section_id, language_id, title, body)
VALUES
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-frontend') AND cs.section_key = 'overview' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Descripción General',
   'SPA con Angular 19 y SSR. Mapas interactivos de restaurantes en canvas, selección de mesas en tiempo real vía WebSocket, internacionalización (es/en), Material Design y lazy loading por features.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-frontend') AND cs.section_key = 'overview' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Overview',
   'SPA with Angular 19 and SSR. Interactive restaurant maps on canvas, real-time table selection via WebSocket, internationalization (es/en), Material Design, and feature-based lazy loading.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-frontend') AND cs.section_key = 'features' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Funcionalidades Clave',
   'Mapa canvas interactivo con secciones y mesas, selección en tiempo real con WebSocket, cambio de idioma persistente, modal de configuración, adaptadores de repositorio para HTTP y WS, y diseño responsivo.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-frontend') AND cs.section_key = 'features' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Key Features',
   'Interactive canvas map with sections and tables, real-time selection with WebSocket, persistent language switch, settings modal, repository adapters for HTTP and WS, and responsive design.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-frontend') AND cs.section_key = 'restaurant_map' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Mapa Interactivo de Restaurante',
   'Componente canvas interactivo que renderiza secciones y mesas con assets visuales, estados de disponibilidad y selección en tiempo real.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-frontend') AND cs.section_key = 'restaurant_map' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Interactive Restaurant Map',
   'Interactive canvas component rendering sections and tables with visual assets, availability states, and real-time selection.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-frontend') AND cs.section_key = 'table_adapter' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Adaptador de Repositorio de Mesas',
   'Adaptador que unifica datos de mesas desde HTTP y WebSocket con mapeo robusto de payloads polimórficos.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-frontend') AND cs.section_key = 'table_adapter' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Table Spot Repository Adapter',
   'Adapter unifying table data from HTTP and WebSocket with robust polymorphic payload mapping.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-frontend') AND cs.section_key = 'i18n' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Internacionalización (i18n)',
   'Sistema de traducción con TranslatePipe, I18nPort abstracto, soporte es/en y persistencia de preferencia de idioma.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-frontend') AND cs.section_key = 'i18n' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Internationalization (i18n)',
   'Translation system with TranslatePipe, abstract I18nPort, es/en support, and language preference persistence.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-frontend') AND cs.section_key = 'settings' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Modal de Configuración',
   'Modal de configuración con selector de idioma y preferencias de la aplicación.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-frontend') AND cs.section_key = 'settings' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Settings Modal',
   'Settings modal with language selector and application preferences.')
ON CONFLICT (content_section_id, language_id) DO NOTHING;

-- =========================================
-- Reservation MS (mesaya-res): 12 sections
-- (3 original + 9 from res sub-modules)
-- =========================================
INSERT INTO content_section (entity_type, entity_id, section_key, icon, position, is_archived, is_pinned)
VALUES
  ('project', (SELECT id FROM project WHERE code = 'mesaya-res'), 'overview',      'dns',             1, false, true),
  ('project', (SELECT id FROM project WHERE code = 'mesaya-res'), 'architecture',  'account_tree',    2, false, true),
  ('project', (SELECT id FROM project WHERE code = 'mesaya-res'), 'testing',       'science',         3, false, false),
  ('project', (SELECT id FROM project WHERE code = 'mesaya-res'), 'tables',        'table_bar',       4, false, true),
  ('project', (SELECT id FROM project WHERE code = 'mesaya-res'), 'restaurants',   'restaurant',      5, false, false),
  ('project', (SELECT id FROM project WHERE code = 'mesaya-res'), 'reservations',  'event_seat',      6, false, false),
  ('project', (SELECT id FROM project WHERE code = 'mesaya-res'), 'menus',         'menu_book',       7, false, false),
  ('project', (SELECT id FROM project WHERE code = 'mesaya-res'), 'reviews',       'rate_review',     8, false, false),
  ('project', (SELECT id FROM project WHERE code = 'mesaya-res'), 'payments',      'receipt_long',    9, false, false),
  ('project', (SELECT id FROM project WHERE code = 'mesaya-res'), 'subscriptions', 'card_membership',10, false, false),
  ('project', (SELECT id FROM project WHERE code = 'mesaya-res'), 'seed',          'data_object',    11, false, false),
  ('project', (SELECT id FROM project WHERE code = 'mesaya-res'), 'sonarqube',     'verified',       12, false, false)
ON CONFLICT DO NOTHING;

INSERT INTO content_section_translation (content_section_id, language_id, title, body)
VALUES
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-res') AND cs.section_key = 'overview' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Descripción General',
   'Microservicio principal que gestiona restaurantes, secciones, mesas, menús, reservas, reseñas, pagos y suscripciones. NestJS con Clean Architecture y DDD, entidades ricas y Value Objects.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-res') AND cs.section_key = 'overview' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Overview',
   'Core microservice managing restaurants, sections, tables, menus, reservations, reviews, payments, and subscriptions. NestJS with Clean Architecture and DDD, rich entities and Value Objects.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-res') AND cs.section_key = 'architecture' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Arquitectura',
   'Capas: Domain (entidades, VOs, eventos), Application (casos de uso, puertos), Infrastructure (TypeORM, Kafka, mappers) e Interface (controladores REST, Swagger). Patrón Facade para seeding en 5 fases.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-res') AND cs.section_key = 'architecture' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Architecture',
   'Layers: Domain (entities, VOs, events), Application (use cases, ports), Infrastructure (TypeORM, Kafka, mappers), and Interface (REST controllers, Swagger). Facade pattern for 5-phase seeding.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-res') AND cs.section_key = 'testing' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Testing y Calidad',
   'Cobertura de tests unitarios al 90% con Jest. SonarCloud vía GitHub Actions con Quality Gate personalizado, análisis de code smells y cobertura LCOV.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-res') AND cs.section_key = 'testing' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Testing & Quality',
   '90% unit test coverage with Jest. SonarCloud via GitHub Actions with custom Quality Gate, code smells analysis, and LCOV coverage.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-res') AND cs.section_key = 'tables' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Módulo de Mesas',
   'Entidad rica Table con validación de layout (colisiones, límites), snapshot/rehydrate, analíticas y eventos Kafka para sincronización en tiempo real.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-res') AND cs.section_key = 'tables' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Tables Module',
   'Rich Table entity with layout validation (collisions, bounds), snapshot/rehydrate, analytics, and Kafka events for real-time sync.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-res') AND cs.section_key = 'restaurants' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Módulo de Restaurantes',
   'Gestión de restaurantes con horarios, días de operación, ubicación y capacidad. Verificación de propietarios vía Auth MS.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-res') AND cs.section_key = 'restaurants' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Restaurants Module',
   'Restaurant management with schedules, operating days, location, and capacity. Owner verification via Auth MS.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-res') AND cs.section_key = 'reservations' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Módulo de Reservaciones',
   'Reservaciones con máquina de estados, validación de disponibilidad y relación usuario-restaurante-mesa.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-res') AND cs.section_key = 'reservations' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Reservations Module',
   'Reservations with state machine, availability validation, and user-restaurant-table relationships.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-res') AND cs.section_key = 'menus' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Módulo de Menús y Platos',
   'Gestión de menús y platos por restaurante con precios, descripciones e imágenes.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-res') AND cs.section_key = 'menus' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Menus & Dishes Module',
   'Menu and dish management per restaurant with prices, descriptions, and images.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-res') AND cs.section_key = 'reviews' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Módulo de Reseñas',
   'Calificaciones y comentarios de usuarios sobre restaurantes con valoración numérica.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-res') AND cs.section_key = 'reviews' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Reviews Module',
   'User ratings and comments for restaurants with numeric scores.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-res') AND cs.section_key = 'payments' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Módulo de Pagos',
   'Procesamiento de pagos para reservaciones y suscripciones con VOs de moneda y estado de transacción.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-res') AND cs.section_key = 'payments' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Payments Module',
   'Payment processing for reservations and subscriptions with currency and transaction status VOs.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-res') AND cs.section_key = 'subscriptions' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Módulo de Suscripciones',
   'Planes de suscripción para restaurantes con estados activo/inactivo y fechas de vigencia.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-res') AND cs.section_key = 'subscriptions' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Subscriptions Module',
   'Restaurant subscription plans with active/inactive states and validity dates.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-res') AND cs.section_key = 'seed' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Módulo de Seed',
   'Orquestador de seeding con patrón Facade: planes → media → restaurantes → secciones → mesas → menús → reservas → reseñas → pagos.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-res') AND cs.section_key = 'seed' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Seed Module',
   'Seeding orchestrator with Facade pattern: plans → media → restaurants → sections → tables → menus → reservations → reviews → payments.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-res') AND cs.section_key = 'sonarqube' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Integración SonarQube',
   'SonarCloud con GitHub Actions, cobertura LCOV al 90%, Quality Gate personalizado y análisis continuo de deuda técnica.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-res') AND cs.section_key = 'sonarqube' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'SonarQube Integration',
   'SonarCloud with GitHub Actions, 90% LCOV coverage, custom Quality Gate, and continuous technical debt analysis.')
ON CONFLICT (content_section_id, language_id) DO NOTHING;

-- =========================================
-- Auth MS (mesaya-auth-ms): 4 sections
-- (2 original + 2 from auth sub-modules)
-- =========================================
INSERT INTO content_section (entity_type, entity_id, section_key, icon, position, is_archived, is_pinned)
VALUES
  ('project', (SELECT id FROM project WHERE code = 'mesaya-auth-ms'), 'overview',     'lock',                   1, false, true),
  ('project', (SELECT id FROM project WHERE code = 'mesaya-auth-ms'), 'features',     'vpn_key',                2, false, false),
  ('project', (SELECT id FROM project WHERE code = 'mesaya-auth-ms'), 'auth_seeder',  'playlist_add',           3, false, false),
  ('project', (SELECT id FROM project WHERE code = 'mesaya-auth-ms'), 'rbac',         'admin_panel_settings',   4, false, false)
ON CONFLICT DO NOTHING;

INSERT INTO content_section_translation (content_section_id, language_id, title, body)
VALUES
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-auth-ms') AND cs.section_key = 'overview' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Descripción General',
   'Microservicio de autenticación con JWT y RBAC completo. Usuarios, roles y permisos con seeding automático al iniciar vía OnModuleInit.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-auth-ms') AND cs.section_key = 'overview' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Overview',
   'Authentication microservice with JWT and complete RBAC. Users, roles, and permissions with automatic seeding on startup via OnModuleInit.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-auth-ms') AND cs.section_key = 'features' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Funcionalidades',
   'Registro e inicio de sesión con JWT + refresh tokens, hash de contraseñas, asignación dinámica de permisos, roles predefinidos (admin, owner, user, guest) y middleware de verificación.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-auth-ms') AND cs.section_key = 'features' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Features',
   'Registration and login with JWT + refresh tokens, password hashing, dynamic permission assignment, predefined roles (admin, owner, user, guest), and verification middleware.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-auth-ms') AND cs.section_key = 'auth_seeder' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Seeder de Autenticación',
   'Siembra automática de permisos, roles y usuarios por defecto al iniciar con OnModuleInit de NestJS.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-auth-ms') AND cs.section_key = 'auth_seeder' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Auth Seeder',
   'Automatic seeding of permissions, roles, and default users on startup with NestJS OnModuleInit.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-auth-ms') AND cs.section_key = 'rbac' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Sistema RBAC',
   'RBAC con permisos granulares, roles predefinidos (admin, owner, user, guest) y asignación dinámica.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-auth-ms') AND cs.section_key = 'rbac' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'RBAC System',
   'RBAC with granular permissions, predefined roles (admin, owner, user, guest), and dynamic assignment.')
ON CONFLICT (content_section_id, language_id) DO NOTHING;

-- =========================================
-- GraphQL Gateway (mesaya-graphql): 2 sections
-- =========================================
INSERT INTO content_section (entity_type, entity_id, section_key, icon, position, is_archived, is_pinned)
VALUES
  ('project', (SELECT id FROM project WHERE code = 'mesaya-graphql'), 'overview', 'hub',        1, false, true),
  ('project', (SELECT id FROM project WHERE code = 'mesaya-graphql'), 'features', 'merge_type', 2, false, false)
ON CONFLICT DO NOTHING;

INSERT INTO content_section_translation (content_section_id, language_id, title, body)
VALUES
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-graphql') AND cs.section_key = 'overview' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Descripción General',
   'Gateway GraphQL en Python con Strawberry que agrega las APIs REST de los microservicios bajo un schema unificado. Arquitectura modular por features.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-graphql') AND cs.section_key = 'overview' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Overview',
   'Python GraphQL gateway with Strawberry aggregating microservice REST APIs under a unified schema. Feature-based modular architecture.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-graphql') AND cs.section_key = 'features' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Funcionalidades',
   'Queries y mutations para restaurantes, mesas, reservas y autenticación. Resolvers que consumen endpoints REST con manejo de errores centralizado.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-graphql') AND cs.section_key = 'features' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Features',
   'Queries and mutations for restaurants, tables, reservations, and authentication. Resolvers consuming REST endpoints with centralized error handling.')
ON CONFLICT (content_section_id, language_id) DO NOTHING;

-- =========================================
-- Chatbot (mesaya-chatbot): 4 sections
-- (2 original + 2 from chatbot sub-modules)
-- =========================================
INSERT INTO content_section (entity_type, entity_id, section_key, icon, position, is_archived, is_pinned)
VALUES
  ('project', (SELECT id FROM project WHERE code = 'mesaya-chatbot'), 'overview',  'smart_toy',  1, false, true),
  ('project', (SELECT id FROM project WHERE code = 'mesaya-chatbot'), 'features',  'psychology',  2, false, false),
  ('project', (SELECT id FROM project WHERE code = 'mesaya-chatbot'), 'prompts',   'chat',        3, false, false),
  ('project', (SELECT id FROM project WHERE code = 'mesaya-chatbot'), 'languages', 'language',    4, false, false)
ON CONFLICT DO NOTHING;

INSERT INTO content_section_translation (content_section_id, language_id, title, body)
VALUES
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-chatbot') AND cs.section_key = 'overview' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Descripción General',
   'Servicio de chatbot con IA que genera prompts contextuales según el nivel de acceso (GUEST, USER, OWNER, ADMIN) y el idioma (es/en).'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-chatbot') AND cs.section_key = 'overview' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Overview',
   'AI chatbot service generating contextual prompts based on access level (GUEST, USER, OWNER, ADMIN) and language (es/en).'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-chatbot') AND cs.section_key = 'features' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Funcionalidades',
   'Prompts especializados por rol con conocimiento de dominio (cliente busca restaurantes vs dueño gestiona negocio). Soporte bilingüe completo.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-chatbot') AND cs.section_key = 'features' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Features',
   'Role-specialized prompts with domain knowledge (client searching restaurants vs owner managing business). Full bilingual support.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-chatbot') AND cs.section_key = 'prompts' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Sistema de Prompts',
   'Generación de prompts por nivel de acceso con conocimiento de dominio especializado para cada rol.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-chatbot') AND cs.section_key = 'prompts' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Prompt System',
   'Prompt generation by access level with specialized domain knowledge for each role.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-chatbot') AND cs.section_key = 'languages' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Soporte Multiidioma',
   'Módulo de idiomas soportados con español por defecto e inglés como alternativa.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-chatbot') AND cs.section_key = 'languages' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Multi-language Support',
   'Supported languages module with Spanish as default and English as alternative.')
ON CONFLICT (content_section_id, language_id) DO NOTHING;

-- =========================================
-- Remaining services: 1 section each
-- =========================================
INSERT INTO content_section (entity_type, entity_id, section_key, icon, position, is_archived, is_pinned)
VALUES
  ('project', (SELECT id FROM project WHERE code = 'mesaya-payment-ms'),  'overview', 'payments',   1, false, true),
  ('project', (SELECT id FROM project WHERE code = 'mesaya-ws'),          'overview', 'sync_alt',   1, false, true),
  ('project', (SELECT id FROM project WHERE code = 'mesaya-mcp'),         'overview', 'memory',     1, false, true),
  ('project', (SELECT id FROM project WHERE code = 'mesaya-partner-demo'),'overview', 'storefront', 1, true,  false)
ON CONFLICT DO NOTHING;

INSERT INTO content_section_translation (content_section_id, language_id, title, body)
VALUES
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-payment-ms') AND cs.section_key = 'overview' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Descripción General',
   'Microservicio de pagos para transacciones de reservas y suscripciones con Value Objects para moneda y estado.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-payment-ms') AND cs.section_key = 'overview' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Overview',
   'Payment microservice for reservation and subscription transactions with Value Objects for currency and status.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-ws') AND cs.section_key = 'overview' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Descripción General',
   'WebSockets para comunicación bidireccional en tiempo real: selección/liberación de mesas, actualizaciones de estado y notificaciones push.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-ws') AND cs.section_key = 'overview' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Overview',
   'WebSockets for real-time bidirectional communication: table selection/release, status updates, and push notifications.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-mcp') AND cs.section_key = 'overview' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Descripción General',
   'Integración con Model Context Protocol para proporcionar contexto del sistema a asistentes de IA y herramientas de desarrollo.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-mcp') AND cs.section_key = 'overview' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Overview',
   'Model Context Protocol integration to provide system context to AI assistants and development tools.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-partner-demo') AND cs.section_key = 'overview' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Descripción General',
   'Aplicación de demostración para socios comerciales. Archivada tras completar fase de presentación.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-partner-demo') AND cs.section_key = 'overview' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Overview',
   'Demo application for business partners. Archived after presentation phase completed.')
ON CONFLICT (content_section_id, language_id) DO NOTHING;

COMMIT;
