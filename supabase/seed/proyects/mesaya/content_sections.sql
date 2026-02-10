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
  -- Root: overview
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya') AND cs.section_key = 'overview' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Descripción General',
   E'mesaYA es una plataforma de reservas de restaurantes construida con arquitectura de microservicios que conecta clientes con restaurantes mediante reservas en tiempo real, un chatbot con IA, pagos en línea y mapas interactivos de mesas.\n\nEl sistema permite a los clientes explorar restaurantes, visualizar la disposición de mesas en mapas canvas interactivos, seleccionar mesas disponibles en tiempo real vía WebSocket, y completar reservas con pago integrado. Los dueños de restaurantes pueden gestionar su negocio, configurar horarios, menús y secciones de mesas desde un panel administrativo.\n\nLa plataforma incluye un chatbot contextual que adapta sus respuestas según el rol del usuario (cliente, dueño, admin) y un gateway GraphQL que unifica todos los microservicios bajo un schema único.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya') AND cs.section_key = 'overview' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Overview',
   E'mesaYA is a restaurant reservation platform built with microservices architecture that connects customers with restaurants through real-time reservations, an AI chatbot, online payments, and interactive table maps.\n\nThe system allows customers to explore restaurants, visualize table layouts on interactive canvas maps, select available tables in real time via WebSocket, and complete reservations with integrated payment. Restaurant owners can manage their business, configure schedules, menus, and table sections from an admin panel.\n\nThe platform includes a contextual chatbot that adapts responses based on user role (customer, owner, admin) and a GraphQL gateway that unifies all microservices under a single schema.'),

  -- Root: architecture
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya') AND cs.section_key = 'architecture' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Arquitectura',
   E'El ecosistema mesaYA se compone de 8 servicios independientes orquestados con Docker Compose:\n\n• **Frontend Angular 19** — SPA con SSR, mapas canvas interactivos y comunicación WebSocket\n• **API de Reservas (NestJS)** — Microservicio principal con Clean Architecture y DDD que gestiona restaurantes, mesas, reservas, menús, reseñas y pagos\n• **Auth MS (NestJS)** — Autenticación JWT con sistema RBAC completo (admin, owner, user, guest)\n• **GraphQL Gateway (Python + Strawberry)** — Capa de agregación que unifica las APIs REST bajo un schema GraphQL\n• **Chatbot (Python)** — Servicio de IA con prompts contextuales por rol e idioma\n• **Payment MS (NestJS)** — Procesamiento de transacciones para reservas y suscripciones\n• **WebSocket Service** — Comunicación bidireccional en tiempo real para selección de mesas\n• **MCP Server** — Integración con Model Context Protocol para asistentes de IA\n\nLa comunicación asíncrona entre servicios se realiza mediante Apache Kafka con topics de eventos de dominio.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya') AND cs.section_key = 'architecture' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Architecture',
   E'The mesaYA ecosystem comprises 8 independent services orchestrated with Docker Compose:\n\n• **Angular 19 Frontend** — SPA with SSR, interactive canvas maps, and WebSocket communication\n• **Reservation API (NestJS)** — Core microservice with Clean Architecture and DDD managing restaurants, tables, reservations, menus, reviews, and payments\n• **Auth MS (NestJS)** — JWT authentication with complete RBAC system (admin, owner, user, guest)\n• **GraphQL Gateway (Python + Strawberry)** — Aggregation layer unifying REST APIs under a GraphQL schema\n• **Chatbot (Python)** — AI service with role and language-based contextual prompts\n• **Payment MS (NestJS)** — Transaction processing for reservations and subscriptions\n• **WebSocket Service** — Real-time bidirectional communication for table selection\n• **MCP Server** — Model Context Protocol integration for AI assistants\n\nAsync communication between services is handled via Apache Kafka with domain event topics.'),

  -- Root: tech_stack
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya') AND cs.section_key = 'tech_stack' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Stack Tecnológico',
   E'**Frontend:** TypeScript, Angular 19 (SSR, signals, standalone components), TailwindCSS, Canvas API\n**Backend:** NestJS (TypeScript), Python (FastAPI, Strawberry GraphQL)\n**Bases de datos:** PostgreSQL con TypeORM para datos relacionales\n**Mensajería:** Apache Kafka para comunicación asíncrona entre microservicios\n**Autenticación:** JWT con refresh tokens y sistema RBAC granular\n**Infraestructura:** Docker Compose, n8n para automatización de workflows\n**Calidad:** Jest (90% cobertura), SonarQube/SonarCloud, GitHub Actions CI/CD\n**Documentación:** Swagger/OpenAPI auto-generado en cada microservicio'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya') AND cs.section_key = 'tech_stack' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Tech Stack',
   E'**Frontend:** TypeScript, Angular 19 (SSR, signals, standalone components), TailwindCSS, Canvas API\n**Backend:** NestJS (TypeScript), Python (FastAPI, Strawberry GraphQL)\n**Databases:** PostgreSQL with TypeORM for relational data\n**Messaging:** Apache Kafka for async communication between microservices\n**Authentication:** JWT with refresh tokens and granular RBAC system\n**Infrastructure:** Docker Compose, n8n for workflow automation\n**Quality:** Jest (90% coverage), SonarQube/SonarCloud, GitHub Actions CI/CD\n**Documentation:** Auto-generated Swagger/OpenAPI on each microservice'),

  -- Root: infra_kafka
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya') AND cs.section_key = 'infra_kafka' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Infraestructura Kafka',
   E'Apache Kafka actúa como columna vertebral de comunicación asíncrona entre los microservicios del ecosistema mesaYA.\n\nLos topics de eventos de dominio permiten que cada servicio publique cambios de estado sin acoplamiento directo: cuando una reserva se confirma, el evento se propaga a los servicios de pagos, notificaciones y WebSocket para actualizar la disponibilidad de mesas en tiempo real.\n\nLa infraestructura incluye brokers Kafka con Apache Zookeeper para coordinación de clúster, conectores configurados para la persistencia de eventos, y schemas de mensajes definidos para garantizar compatibilidad entre productores y consumidores.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya') AND cs.section_key = 'infra_kafka' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Kafka Infrastructure',
   E'Apache Kafka acts as the backbone for async communication between mesaYA ecosystem microservices.\n\nDomain event topics allow each service to publish state changes without direct coupling: when a reservation is confirmed, the event propagates to payment, notification, and WebSocket services to update table availability in real time.\n\nThe infrastructure includes Kafka brokers with Apache Zookeeper for cluster coordination, connectors configured for event persistence, and defined message schemas to guarantee compatibility between producers and consumers.'),

  -- Root: infra_n8n
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya') AND cs.section_key = 'infra_n8n' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Automatización n8n',
   E'n8n proporciona flujos de automatización visual para integraciones y workflows del ecosistema mesaYA que no requieren código personalizado.\n\nLos flujos incluyen notificaciones automáticas por email o webhook cuando se confirma una reserva, sincronización de datos entre servicios para reportes consolidados, y tareas programadas de mantenimiento como limpieza de sesiones expiradas y generación de métricas de uso.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya') AND cs.section_key = 'infra_n8n' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'n8n Automation',
   E'n8n provides visual automation flows for mesaYA ecosystem integrations and workflows that don''t require custom code.\n\nFlows include automatic email or webhook notifications when a reservation is confirmed, data synchronization between services for consolidated reports, and scheduled maintenance tasks like expired session cleanup and usage metrics generation.'),

  -- Root: infra_docker
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya') AND cs.section_key = 'infra_docker' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Docker y Orquestación',
   E'Docker Compose orquesta todo el ecosistema mesaYA en un solo archivo de configuración, definiendo cada microservicio, base de datos y herramienta de infraestructura como servicios independientes.\n\nLa configuración incluye PostgreSQL con volumen persistente, Apache Kafka + Zookeeper para mensajería, n8n para automatización, y todos los microservicios con sus respectivas variables de entorno, redes internas y health checks.\n\nLas redes Docker aíslan la comunicación entre servicios: una red para el tráfico público (frontend ↔ gateway) y otra interna para comunicación entre microservicios, garantizando que los servicios backend no sean accesibles directamente desde el exterior.')
ON CONFLICT (content_section_id, language_id) DO NOTHING;

-- bridge translations for infra_docker EN
INSERT INTO content_section_translation (content_section_id, language_id, title, body)
VALUES
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya') AND cs.section_key = 'infra_docker' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Docker & Orchestration',
   E'Docker Compose orchestrates the entire mesaYA ecosystem in a single configuration file, defining each microservice, database, and infrastructure tool as independent services.\n\nThe configuration includes PostgreSQL with persistent volumes, Apache Kafka + Zookeeper for messaging, n8n for automation, and all microservices with their respective environment variables, internal networks, and health checks.\n\nDocker networks isolate inter-service communication: one network for public traffic (frontend ↔ gateway) and an internal one for microservice communication, ensuring backend services are not directly accessible from outside.')
ON CONFLICT (content_section_id, language_id) DO NOTHING;

-- =========================================
-- Frontend (mesaya-frontend): 6 sections
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
   E'SPA desarrollada con Angular 19 y Server-Side Rendering que proporciona la interfaz de usuario principal de la plataforma mesaYA.\n\nIncluye mapas interactivos de restaurantes renderizados en canvas HTML5 con selección de mesas en tiempo real vía WebSocket, sistema de internacionalización completo (español/inglés), diseño responsivo con Material Design, y carga lazy de módulos por features para optimizar el rendimiento inicial.\n\nLa arquitectura del frontend sigue principios de Clean Architecture con separación entre domain (entidades, puertos), application (servicios, adaptadores) y presentation (componentes, páginas), usando signals de Angular para gestión de estado reactiva.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-frontend') AND cs.section_key = 'overview' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Overview',
   E'SPA built with Angular 19 and Server-Side Rendering providing the main user interface for the mesaYA platform.\n\nIt includes interactive restaurant maps rendered on HTML5 canvas with real-time table selection via WebSocket, a complete internationalization system (Spanish/English), responsive Material Design, and lazy-loaded feature modules to optimize initial performance.\n\nThe frontend architecture follows Clean Architecture principles with separation between domain (entities, ports), application (services, adapters) and presentation (components, pages), using Angular signals for reactive state management.'),

  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-frontend') AND cs.section_key = 'features' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Funcionalidades Clave',
   E'• Mapa canvas interactivo con secciones del restaurante y mesas individuales, incluyendo zoom, pan y estados visuales de disponibilidad\n• Selección de mesas en tiempo real sincronizada entre usuarios mediante WebSocket — cuando un usuario selecciona una mesa, otros la ven bloqueada instantáneamente\n• Flujo completo de reserva: explorar restaurante → seleccionar mesa → elegir horario → confirmar → pagar\n• Cambio de idioma persistente entre español e inglés con todas las cadenas traducidas\n• Panel de administración para dueños de restaurantes con gestión de menús, horarios y configuración de mesas\n• Diseño responsivo que adapta los mapas canvas y la navegación a pantallas móviles y desktop'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-frontend') AND cs.section_key = 'features' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Key Features',
   E'• Interactive canvas map with restaurant sections and individual tables, including zoom, pan, and visual availability states\n• Real-time table selection synchronized between users via WebSocket — when a user selects a table, others see it locked instantly\n• Complete reservation flow: explore restaurant → select table → choose time slot → confirm → pay\n• Persistent language switch between Spanish and English with all strings translated\n• Admin panel for restaurant owners with menu, schedule, and table setup management\n• Responsive design adapting canvas maps and navigation to mobile and desktop screens'),

  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-frontend') AND cs.section_key = 'restaurant_map' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Mapa Interactivo de Restaurante',
   E'Componente canvas interactivo que renderiza la disposición completa de un restaurante, incluyendo secciones (terraza, salón principal, VIP) y mesas individuales con sus assets visuales.\n\nCada mesa muestra su estado en tiempo real mediante colores: disponible (verde), seleccionada por otro usuario (amarillo), o reservada (rojo). La selección se sincroniza instantáneamente con el servidor WebSocket, bloqueando la mesa para otros usuarios mientras se completa la reserva.\n\nEl componente soporta interacciones touch y mouse con funcionalidad de zoom y pan para navegar restaurantes grandes con muchas secciones.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-frontend') AND cs.section_key = 'restaurant_map' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Interactive Restaurant Map',
   E'Interactive canvas component rendering the complete layout of a restaurant, including sections (terrace, main hall, VIP) and individual tables with their visual assets.\n\nEach table displays its real-time status through colors: available (green), selected by another user (yellow), or reserved (red). Selection is instantly synchronized with the WebSocket server, locking the table for other users while the reservation is completed.\n\nThe component supports touch and mouse interactions with zoom and pan functionality to navigate large restaurants with many sections.'),

  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-frontend') AND cs.section_key = 'table_adapter' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Adaptador de Repositorio de Mesas',
   E'Adaptador que unifica el acceso a datos de mesas desde dos fuentes distintas: la API REST (estado inicial al cargar) y el servicio WebSocket (actualizaciones en tiempo real).\n\nImplementa un mapeo robusto de payloads polimórficos, ya que la estructura de datos difiere entre la respuesta HTTP (formato completo con relaciones) y los eventos WebSocket (formato ligero con solo los campos actualizados). El adaptador normaliza ambos formatos en entidades de dominio consistentes que los componentes de presentación consumen sin conocer el origen de los datos.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-frontend') AND cs.section_key = 'table_adapter' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Table Spot Repository Adapter',
   E'Adapter unifying table data access from two distinct sources: the REST API (initial state on load) and the WebSocket service (real-time updates).\n\nIt implements robust polymorphic payload mapping since the data structure differs between the HTTP response (full format with relationships) and WebSocket events (lightweight format with only updated fields). The adapter normalizes both formats into consistent domain entities that presentation components consume without knowing the data origin.'),

  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-frontend') AND cs.section_key = 'i18n' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Internacionalización (i18n)',
   E'Sistema de traducción implementado con un I18nPort abstracto, un servicio concreto que carga archivos JSON de traducciones, y un TranslatePipe personalizado para uso en templates.\n\nEl idioma seleccionado se persiste en localStorage y se aplica automáticamente al iniciar la aplicación. Todas las cadenas de UI, mensajes de error, y etiquetas de formulario están externalizadas en archivos de traducción con soporte completo para español e inglés.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-frontend') AND cs.section_key = 'i18n' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Internationalization (i18n)',
   E'Translation system implemented with an abstract I18nPort, a concrete service that loads JSON translation files, and a custom TranslatePipe for template usage.\n\nThe selected language is persisted in localStorage and automatically applied on application startup. All UI strings, error messages, and form labels are externalized in translation files with full Spanish and English support.'),

  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-frontend') AND cs.section_key = 'settings' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Modal de Configuración',
   E'Modal de configuración accesible desde la barra de navegación que centraliza las preferencias del usuario: selector de idioma con cambio inmediato, preferencias de tema (claro/oscuro), y configuración de notificaciones.\n\nEl componente usa signals de Angular para reflejar los cambios de configuración instantáneamente en toda la aplicación sin necesidad de recargar la página.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-frontend') AND cs.section_key = 'settings' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Settings Modal',
   E'Settings modal accessible from the navigation bar that centralizes user preferences: language selector with immediate switching, theme preferences (light/dark), and notification configuration.\n\nThe component uses Angular signals to reflect configuration changes instantly across the entire application without page reload.')
ON CONFLICT (content_section_id, language_id) DO NOTHING;

-- =========================================
-- Reservation MS (mesaya-res): 12 sections
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
   E'Microservicio principal del ecosistema mesaYA que gestiona toda la lógica de negocio central: restaurantes, secciones, mesas, menús, reservas, reseñas, pagos y suscripciones.\n\nConstruido con NestJS siguiendo estrictamente Clean Architecture y Domain-Driven Design, con entidades ricas que encapsulan lógica de negocio, Value Objects inmutables para conceptos de dominio (moneda, coordenadas, estados), y eventos de dominio publicados vía Kafka para comunicación con otros servicios.\n\nCada módulo funcional (restaurantes, mesas, reservas, etc.) es independiente con su propia capa de domain, application e infrastructure, comunicándose entre sí solo a través de puertos definidos.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-res') AND cs.section_key = 'overview' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Overview',
   E'Core microservice of the mesaYA ecosystem managing all central business logic: restaurants, sections, tables, menus, reservations, reviews, payments, and subscriptions.\n\nBuilt with NestJS strictly following Clean Architecture and Domain-Driven Design, with rich entities encapsulating business logic, immutable Value Objects for domain concepts (currency, coordinates, states), and domain events published via Kafka for communication with other services.\n\nEach functional module (restaurants, tables, reservations, etc.) is independent with its own domain, application, and infrastructure layers, communicating with each other only through defined ports.'),

  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-res') AND cs.section_key = 'architecture' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Arquitectura',
   E'Implementa Clean Architecture con 4 capas claramente separadas:\n\n• **Domain** — Entidades ricas con lógica de negocio (Restaurant, Table, Reservation), Value Objects inmutables (Currency, Coordinates, ReservationStatus), y eventos de dominio\n• **Application** — Casos de uso que orquestan la lógica de negocio, puertos de entrada/salida, y DTOs para contratos de datos\n• **Infrastructure** — Repositorios TypeORM, productores Kafka, mappers entidad↔ORM, y adaptadores de servicios externos\n• **Interface** — Controladores REST con validación automática, decoradores Swagger, y guards de autenticación\n\nEl patrón Facade se usa para orquestar el seeding de datos en fases ordenadas, garantizando que las dependencias entre entidades se respeten.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-res') AND cs.section_key = 'architecture' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Architecture',
   E'Implements Clean Architecture with 4 clearly separated layers:\n\n• **Domain** — Rich entities with business logic (Restaurant, Table, Reservation), immutable Value Objects (Currency, Coordinates, ReservationStatus), and domain events\n• **Application** — Use cases orchestrating business logic, input/output ports, and DTOs for data contracts\n• **Infrastructure** — TypeORM repositories, Kafka producers, entity↔ORM mappers, and external service adapters\n• **Interface** — REST controllers with automatic validation, Swagger decorators, and authentication guards\n\nThe Facade pattern is used to orchestrate data seeding in ordered phases, ensuring entity dependencies are respected.'),

  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-res') AND cs.section_key = 'testing' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Testing y Calidad',
   E'Suite de pruebas con Jest que alcanza 90% de cobertura de código, verificada mediante integración continua con SonarCloud vía GitHub Actions.\n\nLos tests unitarios cubren entidades de dominio, Value Objects, casos de uso y mappers. Cada caso de uso se prueba con mocks de los puertos de salida, aislando la lógica de negocio de la infraestructura. Los tests de integración validan endpoints REST con request/response completos.\n\nEl Quality Gate personalizado de SonarCloud incluye umbrales para cobertura mínima, duplicación de código, y deuda técnica acumulada, ejecutándose automáticamente en cada pull request.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-res') AND cs.section_key = 'testing' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Testing & Quality',
   E'Test suite with Jest achieving 90% code coverage, verified through continuous integration with SonarCloud via GitHub Actions.\n\nUnit tests cover domain entities, Value Objects, use cases, and mappers. Each use case is tested with output port mocks, isolating business logic from infrastructure. Integration tests validate REST endpoints with complete request/response flows.\n\nSonarCloud''s custom Quality Gate includes thresholds for minimum coverage, code duplication, and accumulated technical debt, running automatically on every pull request.'),

  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-res') AND cs.section_key = 'tables' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Módulo de Mesas',
   E'Entidad rica Table que encapsula la lógica de gestión de mesas de restaurante con validaciones de dominio complejas.\n\nIncluye validación de layout que detecta colisiones entre mesas (dos mesas no pueden superponerse en el canvas), verificación de límites (la mesa debe estar dentro del área de su sección), y funcionalidad de snapshot/rehydrate para persistir y restaurar el estado del layout.\n\nPublica eventos Kafka cuando una mesa cambia de estado (disponible, seleccionada, reservada) para sincronización en tiempo real con el servicio WebSocket y el frontend.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-res') AND cs.section_key = 'tables' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Tables Module',
   E'Rich Table entity encapsulating restaurant table management logic with complex domain validations.\n\nIncludes layout validation detecting collisions between tables (two tables cannot overlap on the canvas), bounds checking (table must be within its section area), and snapshot/rehydrate functionality to persist and restore layout state.\n\nPublishes Kafka events when a table changes state (available, selected, reserved) for real-time synchronization with the WebSocket service and frontend.'),

  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-res') AND cs.section_key = 'restaurants' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Módulo de Restaurantes',
   E'Gestión completa de restaurantes incluyendo horarios de operación configurables por día de la semana, ubicación geográfica con coordenadas, capacidad total y secciones del local.\n\nLa verificación de propietarios se realiza mediante integración con el Auth MS: solo usuarios con rol OWNER pueden crear o modificar restaurantes, y cada restaurante está vinculado a un propietario específico verificado por JWT.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-res') AND cs.section_key = 'restaurants' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Restaurants Module',
   E'Complete restaurant management including configurable operating schedules per day of the week, geographic location with coordinates, total capacity, and venue sections.\n\nOwner verification is done through Auth MS integration: only users with the OWNER role can create or modify restaurants, and each restaurant is linked to a specific owner verified by JWT.'),

  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-res') AND cs.section_key = 'reservations' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Módulo de Reservaciones',
   E'Sistema de reservaciones con máquina de estados que gestiona el ciclo de vida completo: PENDING → CONFIRMED → COMPLETED o CANCELLED. Cada transición de estado es validada por reglas de negocio en la entidad de dominio.\n\nLa validación de disponibilidad verifica que la mesa no esté reservada en el horario solicitado, que el restaurante esté abierto, y que el usuario no tenga conflictos con otras reservas activas. Los eventos de reserva se propagan vía Kafka para actualizar la disponibilidad en tiempo real.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-res') AND cs.section_key = 'reservations' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Reservations Module',
   E'Reservation system with a state machine managing the complete lifecycle: PENDING → CONFIRMED → COMPLETED or CANCELLED. Each state transition is validated by business rules in the domain entity.\n\nAvailability validation checks that the table is not reserved at the requested time, the restaurant is open, and the user has no conflicts with other active reservations. Reservation events propagate via Kafka to update real-time availability.'),

  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-res') AND cs.section_key = 'menus' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Módulo de Menús y Platos',
   E'Gestión de menús y platos organizados por restaurante, con soporte para precios con Value Object de moneda, descripciones detalladas, imágenes de platos, y categorización por tipo (entrante, principal, postre, bebida).\n\nLos dueños de restaurantes pueden crear múltiples menús (almuerzo, cena, especial) y asignar platos a cada uno con precios y disponibilidad independientes.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-res') AND cs.section_key = 'menus' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Menus & Dishes Module',
   E'Menu and dish management organized by restaurant, with support for prices using a Currency Value Object, detailed descriptions, dish images, and categorization by type (appetizer, main, dessert, beverage).\n\nRestaurant owners can create multiple menus (lunch, dinner, special) and assign dishes to each with independent prices and availability.'),

  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-res') AND cs.section_key = 'reviews' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Módulo de Reseñas',
   E'Sistema de calificaciones y comentarios donde los usuarios pueden evaluar restaurantes después de completar una reserva. Incluye puntuación numérica (1-5 estrellas), comentario de texto libre, y validación de que solo usuarios con reservas completadas pueden dejar reseñas.\n\nLas reseñas se agregan para calcular la calificación promedio del restaurante, visible en los listados y mapas de la plataforma.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-res') AND cs.section_key = 'reviews' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Reviews Module',
   E'Rating and comment system where users can evaluate restaurants after completing a reservation. Includes numeric scoring (1-5 stars), free-text comments, and validation that only users with completed reservations can leave reviews.\n\nReviews are aggregated to calculate the restaurant''s average rating, visible in platform listings and maps.'),

  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-res') AND cs.section_key = 'payments' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Módulo de Pagos',
   E'Procesamiento de pagos para reservaciones y suscripciones de restaurantes con Value Objects para moneda (monto, divisa) y estado de transacción (PENDING, COMPLETED, FAILED, REFUNDED).\n\nIntegra con el Payment MS a través de eventos Kafka: cuando una reserva se confirma, se genera un evento de pago que el servicio de pagos procesa y responde con el resultado de la transacción.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-res') AND cs.section_key = 'payments' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Payments Module',
   E'Payment processing for reservations and restaurant subscriptions with Value Objects for currency (amount, currency code) and transaction status (PENDING, COMPLETED, FAILED, REFUNDED).\n\nIntegrates with the Payment MS through Kafka events: when a reservation is confirmed, a payment event is generated that the payment service processes and responds with the transaction result.'),

  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-res') AND cs.section_key = 'subscriptions' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Módulo de Suscripciones',
   E'Planes de suscripción para restaurantes con estados gestionados por máquina de estados (ACTIVE, INACTIVE, EXPIRED, CANCELLED) y fechas de inicio/fin de vigencia.\n\nCada plan define los límites del restaurante: número máximo de mesas, secciones, y funcionalidades premium disponibles. La lógica de dominio valida automáticamente la expiración y los cambios de plan.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-res') AND cs.section_key = 'subscriptions' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Subscriptions Module',
   E'Restaurant subscription plans with states managed by a state machine (ACTIVE, INACTIVE, EXPIRED, CANCELLED) and validity start/end dates.\n\nEach plan defines restaurant limits: maximum number of tables, sections, and available premium features. Domain logic automatically validates expiration and plan changes.'),

  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-res') AND cs.section_key = 'seed' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Módulo de Seed',
   E'Orquestador de seeding con patrón Facade que garantiza el orden correcto de inserción respetando las dependencias entre entidades. El proceso se ejecuta en fases secuenciales:\n\nplanes → media → restaurantes → secciones → mesas → menús → reservas → reseñas → pagos\n\nCada fase solo se ejecuta si las dependencias previas están satisfechas, y los datos son idempotentes para evitar duplicados en ejecuciones repetidas.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-res') AND cs.section_key = 'seed' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Seed Module',
   E'Seeding orchestrator with Facade pattern ensuring correct insertion order respecting entity dependencies. The process runs in sequential phases:\n\nplans → media → restaurants → sections → tables → menus → reservations → reviews → payments\n\nEach phase only executes if previous dependencies are satisfied, and data is idempotent to avoid duplicates on repeated runs.'),

  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-res') AND cs.section_key = 'sonarqube' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Integración SonarQube',
   E'Integración continua con SonarCloud ejecutada automáticamente en cada pull request mediante GitHub Actions. El pipeline genera reportes de cobertura LCOV con Jest y los envía a SonarCloud para análisis.\n\nEl Quality Gate personalizado verifica: cobertura mínima del 90%, cero bugs críticos, deuda técnica dentro de umbrales aceptables, y ausencia de vulnerabilidades de seguridad. Los resultados se reportan como checks de estado en el PR.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-res') AND cs.section_key = 'sonarqube' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'SonarQube Integration',
   E'Continuous integration with SonarCloud automatically executed on every pull request via GitHub Actions. The pipeline generates LCOV coverage reports with Jest and sends them to SonarCloud for analysis.\n\nThe custom Quality Gate verifies: minimum 90% coverage, zero critical bugs, technical debt within acceptable thresholds, and absence of security vulnerabilities. Results are reported as status checks on the PR.')
ON CONFLICT (content_section_id, language_id) DO NOTHING;

-- =========================================
-- Auth MS (mesaya-auth-ms): 4 sections
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
   E'Microservicio de autenticación y autorización que gestiona el ciclo de vida completo de usuarios dentro del ecosistema mesaYA.\n\nImplementa autenticación con JWT (access + refresh tokens), hash seguro de contraseñas con bcrypt, y un sistema RBAC completo con roles predefinidos (admin, owner, user, guest) y permisos granulares asignables dinámicamente.\n\nAl iniciar el servicio, un seeder automático vía OnModuleInit de NestJS crea los permisos, roles y usuarios por defecto necesarios para el funcionamiento del sistema.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-auth-ms') AND cs.section_key = 'overview' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Overview',
   E'Authentication and authorization microservice managing the complete user lifecycle within the mesaYA ecosystem.\n\nIt implements JWT authentication (access + refresh tokens), secure password hashing with bcrypt, and a complete RBAC system with predefined roles (admin, owner, user, guest) and granular dynamically-assignable permissions.\n\nOn service startup, an automatic seeder via NestJS OnModuleInit creates the default permissions, roles, and users required for system operation.'),

  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-auth-ms') AND cs.section_key = 'features' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Funcionalidades',
   E'• Registro de usuarios con validación de datos y hash de contraseña\n• Login con generación de JWT access token (corta duración) + refresh token (larga duración)\n• Renovación automática de tokens sin requerir re-login\n• Middleware de verificación de JWT en cada request protegido\n• Asignación dinámica de permisos a roles existentes\n• Validación de permisos a nivel de endpoint con decoradores personalizados de NestJS'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-auth-ms') AND cs.section_key = 'features' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Features',
   E'• User registration with data validation and password hashing\n• Login with JWT access token (short-lived) + refresh token (long-lived) generation\n• Automatic token renewal without requiring re-login\n• JWT verification middleware on every protected request\n• Dynamic permission assignment to existing roles\n• Endpoint-level permission validation with custom NestJS decorators'),

  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-auth-ms') AND cs.section_key = 'auth_seeder' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Seeder de Autenticación',
   E'Proceso de siembra automática que se ejecuta al iniciar el servicio mediante el hook OnModuleInit de NestJS, creando la estructura base de seguridad:\n\n1. Permisos granulares para cada recurso y operación del sistema\n2. Roles predefinidos con conjuntos de permisos apropiados\n3. Usuarios por defecto (administrador del sistema) con credenciales configurables por variables de entorno\n\nLa siembra es idempotente: verifica si los datos ya existen antes de insertarlos, permitiendo reinicios seguros del servicio.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-auth-ms') AND cs.section_key = 'auth_seeder' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Auth Seeder',
   E'Automatic seeding process that runs on service startup via NestJS OnModuleInit hook, creating the base security structure:\n\n1. Granular permissions for each system resource and operation\n2. Predefined roles with appropriate permission sets\n3. Default users (system administrator) with credentials configurable via environment variables\n\nSeeding is idempotent: it checks if data already exists before inserting, allowing safe service restarts.'),

  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-auth-ms') AND cs.section_key = 'rbac' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Sistema RBAC',
   E'Role-Based Access Control con 4 roles jerárquicos y permisos granulares:\n\n• **Admin** — Acceso total al sistema, gestión de usuarios y configuración global\n• **Owner** — Gestión completa de sus restaurantes, mesas, menús y visualización de reservas/reseñas\n• **User** — Búsqueda de restaurantes, creación de reservas, escritura de reseñas\n• **Guest** — Solo lectura: explorar restaurantes y menús sin autenticación\n\nCada permiso es asignable individualmente a cualquier rol, permitiendo personalización granular según las necesidades del negocio.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-auth-ms') AND cs.section_key = 'rbac' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'RBAC System',
   E'Role-Based Access Control with 4 hierarchical roles and granular permissions:\n\n• **Admin** — Full system access, user management, and global configuration\n• **Owner** — Complete management of their restaurants, tables, menus, and reservation/review visibility\n• **User** — Restaurant search, reservation creation, review writing\n• **Guest** — Read-only: explore restaurants and menus without authentication\n\nEach permission is individually assignable to any role, allowing granular customization based on business needs.')
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
   E'Gateway GraphQL construido con Python y Strawberry que actúa como capa de agregación para todos los microservicios del ecosistema mesaYA.\n\nExpone un schema GraphQL unificado que permite al frontend consultar datos de múltiples microservicios (reservas, restaurantes, autenticación) en una sola request, eliminando el problema de over-fetching y under-fetching típico de APIs REST.\n\nLa arquitectura es modular por features: cada dominio funcional (restaurantes, mesas, reservas, auth) tiene sus propios types, queries y mutations, facilitando el mantenimiento y escalabilidad del gateway.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-graphql') AND cs.section_key = 'overview' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Overview',
   E'GraphQL gateway built with Python and Strawberry acting as an aggregation layer for all mesaYA ecosystem microservices.\n\nIt exposes a unified GraphQL schema allowing the frontend to query data from multiple microservices (reservations, restaurants, authentication) in a single request, eliminating the over-fetching and under-fetching problems typical of REST APIs.\n\nThe architecture is feature-modular: each functional domain (restaurants, tables, reservations, auth) has its own types, queries, and mutations, facilitating gateway maintenance and scalability.'),

  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-graphql') AND cs.section_key = 'features' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Funcionalidades',
   E'• Queries y mutations para restaurantes, mesas, reservas y autenticación con tipado estricto de Strawberry\n• Resolvers que consumen los endpoints REST de cada microservicio con manejo de errores centralizado y retry configurable\n• Autenticación propagada: el token JWT del usuario se reenvía a cada microservicio interno para mantener el contexto de seguridad\n• Playground GraphiQL integrado para exploración y testing del schema en desarrollo'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-graphql') AND cs.section_key = 'features' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Features',
   E'• Queries and mutations for restaurants, tables, reservations, and authentication with strict Strawberry typing\n• Resolvers consuming each microservice''s REST endpoints with centralized error handling and configurable retry\n• Propagated authentication: the user''s JWT token is forwarded to each internal microservice to maintain the security context\n• Integrated GraphiQL playground for schema exploration and testing in development')
ON CONFLICT (content_section_id, language_id) DO NOTHING;

-- =========================================
-- Chatbot (mesaya-chatbot): 6 sections
-- =========================================
INSERT INTO content_section (entity_type, entity_id, section_key, icon, position, is_archived, is_pinned)
VALUES
  ('project', (SELECT id FROM project WHERE code = 'mesaya-chatbot'), 'overview',        'smart_toy',           1, false, true),
  ('project', (SELECT id FROM project WHERE code = 'mesaya-chatbot'), 'architecture',    'account_tree',        2, false, true),
  ('project', (SELECT id FROM project WHERE code = 'mesaya-chatbot'), 'ai_stack',        'psychology',          3, false, true),
  ('project', (SELECT id FROM project WHERE code = 'mesaya-chatbot'), 'mcp_integration', 'memory',              4, false, true),
  ('project', (SELECT id FROM project WHERE code = 'mesaya-chatbot'), 'prompts',         'chat',                5, false, false),
  ('project', (SELECT id FROM project WHERE code = 'mesaya-chatbot'), 'languages',       'language',            6, false, false)
ON CONFLICT DO NOTHING;

INSERT INTO content_section_translation (content_section_id, language_id, title, body)
VALUES
  -- overview ES
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-chatbot') AND cs.section_key = 'overview' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Descripción General',
   E'Servicio de chatbot inteligente construido con Python siguiendo principios de Clean Architecture. Utiliza LangChain como framework de orquestación de LLMs y Groq API para inferencia de ultra baja latencia con modelos como Llama.\n\nEl chatbot se integra con el servidor MCP (Model Context Protocol) del ecosistema mesaYA mediante comunicación STDIO, lo que le permite acceder en tiempo real a la estructura del sistema, endpoints, esquemas de datos y estado de los microservicios para generar respuestas fundamentadas en el contexto real de la plataforma.\n\nSoporta múltiples niveles de acceso (GUEST, USER, OWNER, ADMIN) con prompts contextuales diferenciados por rol e idioma (español/inglés), asistiendo a clientes en reservas, recomendaciones y búsqueda, y a dueños en gestión de su restaurante.'),
  -- overview EN
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-chatbot') AND cs.section_key = 'overview' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Overview',
   E'Intelligent chatbot service built with Python following Clean Architecture principles. Uses LangChain as the LLM orchestration framework and Groq API for ultra-low latency inference with models like Llama.\n\nThe chatbot integrates with the mesaYA ecosystem MCP (Model Context Protocol) server via STDIO communication, enabling real-time access to the system structure, endpoints, data schemas, and microservice state to generate responses grounded in the platform''s actual context.\n\nSupports multiple access levels (GUEST, USER, OWNER, ADMIN) with role- and language-differentiated contextual prompts (Spanish/English), assisting customers with reservations, recommendations, and search, and owners with restaurant management.'),

  -- architecture ES
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-chatbot') AND cs.section_key = 'architecture' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Arquitectura Limpia',
   E'El servicio sigue Clean Architecture con capas bien definidas:\n\n• **Domain** — Entidades de dominio (Conversation, Message, UserContext), interfaces de repositorios y servicios puros de lógica de negocio sin dependencias externas\n• **Application** — Casos de uso (ProcessMessageUseCase, GetConversationHistoryUseCase), DTOs y puertos de entrada/salida que orquestan la lógica del chatbot\n• **Infrastructure** — Adaptadores concretos: cliente Groq para inferencia LLM, cliente MCP por STDIO, repositorios de persistencia y configuración de LangChain\n• **Presentation** — Controladores REST/FastAPI que reciben peticiones HTTP y las delegan a los casos de uso\n\nLa inversión de dependencias garantiza que el núcleo de negocio sea independiente del proveedor de IA (Groq puede reemplazarse sin modificar casos de uso) y del protocolo de comunicación con el MCP.'),
  -- architecture EN
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-chatbot') AND cs.section_key = 'architecture' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Clean Architecture',
   E'The service follows Clean Architecture with well-defined layers:\n\n• **Domain** — Domain entities (Conversation, Message, UserContext), repository interfaces, and pure business logic services with no external dependencies\n• **Application** — Use cases (ProcessMessageUseCase, GetConversationHistoryUseCase), DTOs, and input/output ports orchestrating chatbot logic\n• **Infrastructure** — Concrete adapters: Groq client for LLM inference, MCP client via STDIO, persistence repositories, and LangChain configuration\n• **Presentation** — REST/FastAPI controllers receiving HTTP requests and delegating to use cases\n\nDependency inversion ensures the business core is independent of the AI provider (Groq can be replaced without modifying use cases) and the MCP communication protocol.'),

  -- ai_stack ES
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-chatbot') AND cs.section_key = 'ai_stack' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Stack de IA',
   E'El stack de inteligencia artificial combina LangChain y Groq API para procesamiento de lenguaje natural de alto rendimiento:\n\n• **Groq API** — Proveedor de inferencia LLM de ultra baja latencia utilizando hardware especializado (LPU). Se conecta a modelos como Llama para generación de respuestas con tiempos de respuesta significativamente menores que proveedores tradicionales\n• **LangChain** — Framework de orquestación que gestiona las cadenas de prompts, memoria conversacional, y la integración con herramientas externas. Permite construir pipelines complejos de procesamiento que combinan contexto del MCP, historial de conversación y conocimiento de dominio\n• **Prompt Engineering** — Sistema de templates dinámicos que construyen system prompts especializados por rol (GUEST/USER/OWNER/ADMIN), inyectando contexto del MCP y datos relevantes del restaurante según el perfil del usuario\n\nLa abstracción a través de puertos permite cambiar el proveedor LLM (de Groq a OpenAI o cualquier otro) sin modificar la lógica de negocio.'),
  -- ai_stack EN
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-chatbot') AND cs.section_key = 'ai_stack' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'AI Stack',
   E'The artificial intelligence stack combines LangChain and Groq API for high-performance natural language processing:\n\n• **Groq API** — Ultra-low latency LLM inference provider using specialized hardware (LPU). Connects to models like Llama for response generation with significantly lower response times than traditional providers\n• **LangChain** — Orchestration framework managing prompt chains, conversational memory, and external tool integration. Enables building complex processing pipelines combining MCP context, conversation history, and domain knowledge\n• **Prompt Engineering** — Dynamic template system building specialized system prompts per role (GUEST/USER/OWNER/ADMIN), injecting MCP context and relevant restaurant data based on user profile\n\nAbstraction through ports allows swapping the LLM provider (from Groq to OpenAI or any other) without modifying business logic.'),

  -- mcp_integration ES
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-chatbot') AND cs.section_key = 'mcp_integration' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Integración MCP',
   E'El Chatbot Service consume el servidor MCP (Model Context Protocol) del ecosistema mesaYA mediante comunicación STDIO (Standard Input/Output), estableciendo un canal directo de intercambio de contexto entre el chatbot y la infraestructura del sistema.\n\nA través del MCP, el chatbot accede a:\n• Estructura y endpoints de todos los microservicios en tiempo real\n• Esquemas de datos y relaciones entre entidades (restaurantes, mesas, reservas, menús)\n• Estado actual del sistema y disponibilidad de servicios\n• Documentación de APIs para respuestas más precisas\n\nLa comunicación STDIO permite que el chatbot lance el servidor MCP como proceso hijo y se comunique de forma eficiente sin overhead de red, transmitiendo solicitudes de contexto y recibiendo respuestas estructuradas que enriquecen los prompts enviados al LLM.'),
  -- mcp_integration EN
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-chatbot') AND cs.section_key = 'mcp_integration' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'MCP Integration',
   E'The Chatbot Service consumes the mesaYA ecosystem MCP (Model Context Protocol) server via STDIO (Standard Input/Output) communication, establishing a direct context exchange channel between the chatbot and the system infrastructure.\n\nThrough MCP, the chatbot accesses:\n• Structure and endpoints of all microservices in real time\n• Data schemas and relationships between entities (restaurants, tables, reservations, menus)\n• Current system state and service availability\n• API documentation for more accurate responses\n\nSTDIO communication allows the chatbot to launch the MCP server as a child process and communicate efficiently without network overhead, transmitting context requests and receiving structured responses that enrich the prompts sent to the LLM.'),

  -- prompts ES
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-chatbot') AND cs.section_key = 'prompts' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Sistema de Prompts',
   E'El sistema de prompts utiliza LangChain para construir cadenas de procesamiento que combinan múltiples fuentes de contexto:\n\n• **GUEST** — Información general de restaurantes, menús públicos y proceso de registro, enriquecida con datos del MCP sobre restaurantes disponibles\n• **USER** — Búsqueda personalizada, historial de reservas y recomendaciones basadas en preferencias, con contexto de la API de reservas vía MCP\n• **OWNER** — Gestión de restaurante, análisis de ocupación y configuración, con acceso a métricas del negocio a través del MCP\n• **ADMIN** — Configuración del sistema, métricas globales y gestión de usuarios, con visibilidad completa del ecosistema vía MCP\n\nLos templates de prompts se construyen dinámicamente inyectando el contexto obtenido del servidor MCP, la memoria conversacional gestionada por LangChain, y los datos específicos del rol del usuario.'),
  -- prompts EN
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-chatbot') AND cs.section_key = 'prompts' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Prompt System',
   E'The prompt system uses LangChain to build processing chains combining multiple context sources:\n\n• **GUEST** — General restaurant info, public menus, and registration process, enriched with MCP data about available restaurants\n• **USER** — Personalized search, reservation history, and preference-based recommendations, with reservation API context via MCP\n• **OWNER** — Restaurant management, occupancy analysis, and configuration, with access to business metrics through MCP\n• **ADMIN** — System configuration, global metrics, and user management, with full ecosystem visibility via MCP\n\nPrompt templates are dynamically built by injecting context obtained from the MCP server, conversational memory managed by LangChain, and user role-specific data.'),

  -- languages ES
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-chatbot') AND cs.section_key = 'languages' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Soporte Multiidioma',
   E'Módulo de idiomas que gestiona las traducciones de prompts y respuestas del chatbot con español como idioma principal e inglés como alternativa.\n\nCada prompt system se escribe de forma nativa en ambos idiomas (no traducido automáticamente), garantizando naturalidad y precisión en las instrucciones al modelo de IA. El idioma se determina por la preferencia del usuario almacenada en su perfil.'),
  -- languages EN
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-chatbot') AND cs.section_key = 'languages' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Multi-language Support',
   E'Language module managing chatbot prompt and response translations with Spanish as primary language and English as alternative.\n\nEach system prompt is written natively in both languages (not auto-translated), ensuring naturalness and accuracy in AI model instructions. Language is determined by the user preference stored in their profile.')
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
   E'Microservicio dedicado al procesamiento de transacciones para reservas y suscripciones de restaurantes. Implementa Value Objects para representar moneda (monto + divisa) y estado de transacción (PENDING, COMPLETED, FAILED, REFUNDED).\n\nRecibe eventos de pago desde la API de Reservas vía Kafka, procesa la transacción, y publica el resultado como evento de respuesta para que los servicios dependientes actualicen su estado. La separación como microservicio independiente permite escalar el procesamiento de pagos sin afectar otros servicios.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-payment-ms') AND cs.section_key = 'overview' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Overview',
   E'Dedicated microservice for processing reservation and restaurant subscription transactions. Implements Value Objects to represent currency (amount + currency code) and transaction status (PENDING, COMPLETED, FAILED, REFUNDED).\n\nReceives payment events from the Reservation API via Kafka, processes the transaction, and publishes the result as a response event for dependent services to update their state. Separation as an independent microservice allows scaling payment processing without affecting other services.'),

  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-ws') AND cs.section_key = 'overview' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Descripción General',
   E'Servicio WebSocket para comunicación bidireccional en tiempo real entre el frontend y el backend del ecosistema mesaYA.\n\nGestiona la selección y liberación de mesas en tiempo real: cuando un usuario selecciona una mesa en el mapa canvas, el evento se propaga instantáneamente a todos los clientes conectados, bloqueando visualmente la mesa para otros usuarios. También maneja actualizaciones de estado de reservas y notificaciones push para cambios relevantes.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-ws') AND cs.section_key = 'overview' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Overview',
   E'WebSocket service for real-time bidirectional communication between the frontend and backend of the mesaYA ecosystem.\n\nManages real-time table selection and release: when a user selects a table on the canvas map, the event propagates instantly to all connected clients, visually locking the table for other users. Also handles reservation status updates and push notifications for relevant changes.'),

  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-mcp') AND cs.section_key = 'overview' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Descripción General',
   E'Servidor Model Context Protocol (MCP) que expone la estructura, APIs y lógica de negocio del ecosistema mesaYA a asistentes de IA y herramientas de desarrollo.\n\nPermite que agentes de IA comprendan la arquitectura del sistema, los endpoints disponibles, los esquemas de datos y las relaciones entre microservicios, facilitando el desarrollo asistido por IA y la generación de código contextualizada.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-mcp') AND cs.section_key = 'overview' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Overview',
   E'Model Context Protocol (MCP) server exposing the structure, APIs, and business logic of the mesaYA ecosystem to AI assistants and development tools.\n\nAllows AI agents to understand the system architecture, available endpoints, data schemas, and microservice relationships, facilitating AI-assisted development and contextualized code generation.'),

  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-partner-demo') AND cs.section_key = 'overview' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Descripción General',
   E'Aplicación de demostración para socios comerciales que muestra las capacidades de la plataforma mesaYA en un entorno controlado. Archivada tras completar la fase de presentación a stakeholders.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'mesaya-partner-demo') AND cs.section_key = 'overview' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Overview',
   E'Demo application for business partners showcasing mesaYA platform capabilities in a controlled environment. Archived after completing the stakeholder presentation phase.')
ON CONFLICT (content_section_id, language_id) DO NOTHING;

COMMIT;
