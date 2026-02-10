-- ============================================================
-- MesaYA - Skill Usages & Translations
-- ============================================================
-- Skills are deduplicated: cross-cutting on root, specific on children.
BEGIN;

-- ============================================================
-- ROOT: mesaya (cross-cutting skills)
-- ============================================================
INSERT INTO skill_usages (skill_id, source_id, source_type, level, started_at, is_pinned, position)
VALUES
  ((SELECT id FROM skill WHERE code = 'docker'),     (SELECT id FROM project WHERE code = 'mesaya'), 'project', 4, '2024-01-15', true,  1),
  ((SELECT id FROM skill WHERE code = 'kafka'),      (SELECT id FROM project WHERE code = 'mesaya'), 'project', 3, '2024-02-15', false, 2),
  ((SELECT id FROM skill WHERE code = 'git'),        (SELECT id FROM project WHERE code = 'mesaya'), 'project', 5, '2024-01-15', false, 3),
  ((SELECT id FROM skill WHERE code = 'postgresql'), (SELECT id FROM project WHERE code = 'mesaya'), 'project', 4, '2024-01-15', true,  4)
ON CONFLICT DO NOTHING;

-- Root translations
INSERT INTO skill_usages_translation (skill_usages_id, language_id, notes)
VALUES
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'docker') AND su.source_id = (SELECT id FROM project WHERE code = 'mesaya') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Orquestación de todos los microservicios con Docker Compose, configuración de redes, volúmenes y variables de entorno.'),
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'docker') AND su.source_id = (SELECT id FROM project WHERE code = 'mesaya') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Orchestration of all microservices with Docker Compose, network configuration, volumes, and environment variables.'),

  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'kafka') AND su.source_id = (SELECT id FROM project WHERE code = 'mesaya') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Comunicación asíncrona entre microservicios para eventos de mesas, reservas y pagos.'),
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'kafka') AND su.source_id = (SELECT id FROM project WHERE code = 'mesaya') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Asynchronous communication between microservices for table, reservation, and payment events.'),

  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'git') AND su.source_id = (SELECT id FROM project WHERE code = 'mesaya') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Gestión de repositorio monorepo con submódulos Git para cada microservicio.'),
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'git') AND su.source_id = (SELECT id FROM project WHERE code = 'mesaya') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Monorepo management with Git submodules for each microservice.'),

  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'postgresql') AND su.source_id = (SELECT id FROM project WHERE code = 'mesaya') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Base de datos principal para todos los microservicios con TypeORM.'),
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'postgresql') AND su.source_id = (SELECT id FROM project WHERE code = 'mesaya') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Main database for all microservices with TypeORM.')
ON CONFLICT (skill_usages_id, language_id) DO NOTHING;

-- ============================================================
-- FRONTEND: mesaya-frontend
-- ============================================================
INSERT INTO skill_usages (skill_id, source_id, source_type, level, started_at, is_pinned, position)
VALUES
  ((SELECT id FROM skill WHERE code = 'typescript'), (SELECT id FROM project WHERE code = 'mesaya-frontend'), 'project', 5, '2024-01-20', true,  1),
  ((SELECT id FROM skill WHERE code = 'angular'),    (SELECT id FROM project WHERE code = 'mesaya-frontend'), 'project', 5, '2024-01-20', true,  2),
  ((SELECT id FROM skill WHERE code = 'html_css'),   (SELECT id FROM project WHERE code = 'mesaya-frontend'), 'project', 4, '2024-01-20', false, 3),
  ((SELECT id FROM skill WHERE code = 'scss'),       (SELECT id FROM project WHERE code = 'mesaya-frontend'), 'project', 4, '2024-01-20', false, 4),
  ((SELECT id FROM skill WHERE code = 'websocket'),  (SELECT id FROM project WHERE code = 'mesaya-frontend'), 'project', 4, '2024-02-20', false, 5)
ON CONFLICT DO NOTHING;

INSERT INTO skill_usages_translation (skill_usages_id, language_id, notes)
VALUES
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'typescript') AND su.source_id = (SELECT id FROM project WHERE code = 'mesaya-frontend') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Tipado estricto en toda la aplicación Angular con interfaces, genéricos y tipos utilitarios.'),
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'typescript') AND su.source_id = (SELECT id FROM project WHERE code = 'mesaya-frontend') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Strict typing across the entire Angular application with interfaces, generics, and utility types.'),

  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'angular') AND su.source_id = (SELECT id FROM project WHERE code = 'mesaya-frontend') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Angular 19 con SSR, signals, standalone components, lazy loading y arquitectura modular por features.'),
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'angular') AND su.source_id = (SELECT id FROM project WHERE code = 'mesaya-frontend') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Angular 19 with SSR, signals, standalone components, lazy loading, and feature-based modular architecture.'),

  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'html_css') AND su.source_id = (SELECT id FROM project WHERE code = 'mesaya-frontend') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Maquetación responsiva con Material Design y estructura semántica del DOM.'),
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'html_css') AND su.source_id = (SELECT id FROM project WHERE code = 'mesaya-frontend') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Responsive layout with Material Design and semantic DOM structure.'),

  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'scss') AND su.source_id = (SELECT id FROM project WHERE code = 'mesaya-frontend') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Estilos personalizados con SCSS y temas de Material Design.'),
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'scss') AND su.source_id = (SELECT id FROM project WHERE code = 'mesaya-frontend') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Custom styles with SCSS and Material Design themes.'),

  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'websocket') AND su.source_id = (SELECT id FROM project WHERE code = 'mesaya-frontend') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Conexión en tiempo real para selección de mesas y actualizaciones de estado con reconexión automática.'),
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'websocket') AND su.source_id = (SELECT id FROM project WHERE code = 'mesaya-frontend') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Real-time connection for table selection and status updates with automatic reconnection.')
ON CONFLICT (skill_usages_id, language_id) DO NOTHING;

-- ============================================================
-- BACKEND: mesaya-res (Reservation microservice)
-- ============================================================
INSERT INTO skill_usages (skill_id, source_id, source_type, level, started_at, is_pinned, position)
VALUES
  ((SELECT id FROM skill WHERE code = 'typescript'),        (SELECT id FROM project WHERE code = 'mesaya-res'), 'project', 5, '2024-01-20', true,  1),
  ((SELECT id FROM skill WHERE code = 'nestjs'),            (SELECT id FROM project WHERE code = 'mesaya-res'), 'project', 5, '2024-01-20', true,  2),
  ((SELECT id FROM skill WHERE code = 'postgresql'),        (SELECT id FROM project WHERE code = 'mesaya-res'), 'project', 4, '2024-01-20', true,  3),
  ((SELECT id FROM skill WHERE code = 'ddd'),               (SELECT id FROM project WHERE code = 'mesaya-res'), 'project', 4, '2024-01-20', true,  4),
  ((SELECT id FROM skill WHERE code = 'clean_architecture'),(SELECT id FROM project WHERE code = 'mesaya-res'), 'project', 4, '2024-01-20', true,  5),
  ((SELECT id FROM skill WHERE code = 'jest'),              (SELECT id FROM project WHERE code = 'mesaya-res'), 'project', 4, '2024-02-01', false, 6),
  ((SELECT id FROM skill WHERE code = 'sonarqube'),         (SELECT id FROM project WHERE code = 'mesaya-res'), 'project', 3, '2024-03-10', false, 7),
  ((SELECT id FROM skill WHERE code = 'kafka'),             (SELECT id FROM project WHERE code = 'mesaya-res'), 'project', 3, '2024-02-15', false, 8),
  ((SELECT id FROM skill WHERE code = 'swagger_openapi'),   (SELECT id FROM project WHERE code = 'mesaya-res'), 'project', 4, '2024-01-25', false, 9),
  ((SELECT id FROM skill WHERE code = 'rest_api'),          (SELECT id FROM project WHERE code = 'mesaya-res'), 'project', 5, '2024-01-20', false, 10)
ON CONFLICT DO NOTHING;

INSERT INTO skill_usages_translation (skill_usages_id, language_id, notes)
VALUES
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'typescript') AND su.source_id = (SELECT id FROM project WHERE code = 'mesaya-res') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'TypeScript estricto con path aliases, decoradores NestJS y tipado exhaustivo en DTOs y entidades de dominio.'),
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'typescript') AND su.source_id = (SELECT id FROM project WHERE code = 'mesaya-res') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Strict TypeScript with path aliases, NestJS decorators, and exhaustive typing in DTOs and domain entities.'),

  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'nestjs') AND su.source_id = (SELECT id FROM project WHERE code = 'mesaya-res') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Framework principal: módulos, providers con inyección de dependencias, guards, filtros de excepciones personalizados y Swagger automático.'),
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'nestjs') AND su.source_id = (SELECT id FROM project WHERE code = 'mesaya-res') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Main framework: modules, providers with dependency injection, guards, custom exception filters, and automatic Swagger.'),

  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'postgresql') AND su.source_id = (SELECT id FROM project WHERE code = 'mesaya-res') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Base de datos relacional con TypeORM para persistencia de entidades de dominio.'),
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'postgresql') AND su.source_id = (SELECT id FROM project WHERE code = 'mesaya-res') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Relational database with TypeORM for domain entity persistence.'),

  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'ddd') AND su.source_id = (SELECT id FROM project WHERE code = 'mesaya-res') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Entidades ricas con Value Objects, servicios de dominio, puertos y adaptadores. Separación estricta de capas: domain, application, infrastructure, interface.'),
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'ddd') AND su.source_id = (SELECT id FROM project WHERE code = 'mesaya-res') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Rich entities with Value Objects, domain services, ports and adapters. Strict layer separation: domain, application, infrastructure, interface.'),

  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'clean_architecture') AND su.source_id = (SELECT id FROM project WHERE code = 'mesaya-res') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Casos de uso independientes, repositorios abstractos como puertos, mappers entre capas y eventos de dominio.'),
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'clean_architecture') AND su.source_id = (SELECT id FROM project WHERE code = 'mesaya-res') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Independent use cases, abstract repositories as ports, inter-layer mappers, and domain events.'),

  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'jest') AND su.source_id = (SELECT id FROM project WHERE code = 'mesaya-res') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Tests unitarios con cobertura al 90%, mocks de servicios y repositorios, verificación de entidades de dominio.'),
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'jest') AND su.source_id = (SELECT id FROM project WHERE code = 'mesaya-res') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Unit tests with 90% coverage, service and repository mocks, domain entity verification.'),

  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'sonarqube') AND su.source_id = (SELECT id FROM project WHERE code = 'mesaya-res') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Integración con SonarCloud vía GitHub Actions, Quality Gate personalizado, análisis de code smells y cobertura LCOV.'),
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'sonarqube') AND su.source_id = (SELECT id FROM project WHERE code = 'mesaya-res') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'SonarCloud integration via GitHub Actions, custom Quality Gate, code smells analysis, and LCOV coverage.'),

  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'kafka') AND su.source_id = (SELECT id FROM project WHERE code = 'mesaya-res') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Productor de eventos Kafka para sincronizar cambios de mesas y reservaciones entre microservicios.'),
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'kafka') AND su.source_id = (SELECT id FROM project WHERE code = 'mesaya-res') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Kafka event producer to sync table and reservation changes across microservices.'),

  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'swagger_openapi') AND su.source_id = (SELECT id FROM project WHERE code = 'mesaya-res') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Documentación automática de API REST con decoradores de Swagger/OpenAPI en todos los controladores.'),
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'swagger_openapi') AND su.source_id = (SELECT id FROM project WHERE code = 'mesaya-res') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Automatic REST API documentation with Swagger/OpenAPI decorators on all controllers.'),

  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'rest_api') AND su.source_id = (SELECT id FROM project WHERE code = 'mesaya-res') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Diseño e implementación de endpoints RESTful para todos los módulos del microservicio.'),
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'rest_api') AND su.source_id = (SELECT id FROM project WHERE code = 'mesaya-res') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Design and implementation of RESTful endpoints for all microservice modules.')
ON CONFLICT (skill_usages_id, language_id) DO NOTHING;

-- ============================================================
-- AUTH: mesaya-auth-ms (Authentication microservice)
-- ============================================================
INSERT INTO skill_usages (skill_id, source_id, source_type, level, started_at, is_pinned, position)
VALUES
  ((SELECT id FROM skill WHERE code = 'typescript'), (SELECT id FROM project WHERE code = 'mesaya-auth-ms'), 'project', 5, '2024-02-01', true,  1),
  ((SELECT id FROM skill WHERE code = 'nestjs'),     (SELECT id FROM project WHERE code = 'mesaya-auth-ms'), 'project', 5, '2024-02-01', true,  2),
  ((SELECT id FROM skill WHERE code = 'jwt'),        (SELECT id FROM project WHERE code = 'mesaya-auth-ms'), 'project', 4, '2024-02-01', true,  3),
  ((SELECT id FROM skill WHERE code = 'postgresql'), (SELECT id FROM project WHERE code = 'mesaya-auth-ms'), 'project', 4, '2024-02-01', false, 4),
  ((SELECT id FROM skill WHERE code = 'nodejs'),     (SELECT id FROM project WHERE code = 'mesaya-auth-ms'), 'project', 4, '2024-02-01', false, 5)
ON CONFLICT DO NOTHING;

INSERT INTO skill_usages_translation (skill_usages_id, language_id, notes)
VALUES
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'typescript') AND su.source_id = (SELECT id FROM project WHERE code = 'mesaya-auth-ms') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'TypeScript estricto con decoradores NestJS para autenticación y autorización.'),
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'typescript') AND su.source_id = (SELECT id FROM project WHERE code = 'mesaya-auth-ms') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Strict TypeScript with NestJS decorators for authentication and authorization.'),

  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'nestjs') AND su.source_id = (SELECT id FROM project WHERE code = 'mesaya-auth-ms') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Framework principal con módulos de autenticación, guards JWT y middleware de verificación.'),
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'nestjs') AND su.source_id = (SELECT id FROM project WHERE code = 'mesaya-auth-ms') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Main framework with authentication modules, JWT guards, and verification middleware.'),

  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'jwt') AND su.source_id = (SELECT id FROM project WHERE code = 'mesaya-auth-ms') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Autenticación basada en tokens JWT con refresh tokens, hash de contraseñas y middleware de verificación.'),
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'jwt') AND su.source_id = (SELECT id FROM project WHERE code = 'mesaya-auth-ms') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'JWT-based authentication with refresh tokens, password hashing, and verification middleware.'),

  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'postgresql') AND su.source_id = (SELECT id FROM project WHERE code = 'mesaya-auth-ms') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Base de datos para usuarios, roles y permisos con TypeORM.'),
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'postgresql') AND su.source_id = (SELECT id FROM project WHERE code = 'mesaya-auth-ms') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Database for users, roles, and permissions with TypeORM.'),

  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'nodejs') AND su.source_id = (SELECT id FROM project WHERE code = 'mesaya-auth-ms') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Runtime de Node.js para el microservicio de autenticación.'),
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'nodejs') AND su.source_id = (SELECT id FROM project WHERE code = 'mesaya-auth-ms') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Node.js runtime for the authentication microservice.')
ON CONFLICT (skill_usages_id, language_id) DO NOTHING;

-- ============================================================
-- GRAPHQL: mesaya-graphql (GraphQL gateway)
-- ============================================================
INSERT INTO skill_usages (skill_id, source_id, source_type, level, started_at, is_pinned, position)
VALUES
  ((SELECT id FROM skill WHERE code = 'python'),            (SELECT id FROM project WHERE code = 'mesaya-graphql'), 'project', 4, '2024-02-10', true,  1),
  ((SELECT id FROM skill WHERE code = 'strawberry_graphql'),(SELECT id FROM project WHERE code = 'mesaya-graphql'), 'project', 4, '2024-02-10', true,  2),
  ((SELECT id FROM skill WHERE code = 'clean_architecture'),(SELECT id FROM project WHERE code = 'mesaya-graphql'), 'project', 3, '2024-02-10', false, 3),
  ((SELECT id FROM skill WHERE code = 'rest_api'),          (SELECT id FROM project WHERE code = 'mesaya-graphql'), 'project', 4, '2024-02-10', false, 4)
ON CONFLICT DO NOTHING;

INSERT INTO skill_usages_translation (skill_usages_id, language_id, notes)
VALUES
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'python') AND su.source_id = (SELECT id FROM project WHERE code = 'mesaya-graphql') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Backend GraphQL en Python con gestión de dependencias mediante uv y arquitectura modular.'),
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'python') AND su.source_id = (SELECT id FROM project WHERE code = 'mesaya-graphql') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'GraphQL backend in Python with dependency management via uv and modular architecture.'),

  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'strawberry_graphql') AND su.source_id = (SELECT id FROM project WHERE code = 'mesaya-graphql') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Schema GraphQL con Strawberry: types, queries, mutations y resolvers que consumen APIs REST de microservicios.'),
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'strawberry_graphql') AND su.source_id = (SELECT id FROM project WHERE code = 'mesaya-graphql') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'GraphQL schema with Strawberry: types, queries, mutations, and resolvers consuming REST microservice APIs.'),

  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'clean_architecture') AND su.source_id = (SELECT id FROM project WHERE code = 'mesaya-graphql') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Arquitectura modular inspirada en Clean Architecture con separación por features.'),
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'clean_architecture') AND su.source_id = (SELECT id FROM project WHERE code = 'mesaya-graphql') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Modular architecture inspired by Clean Architecture with feature-based separation.'),

  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'rest_api') AND su.source_id = (SELECT id FROM project WHERE code = 'mesaya-graphql') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Consumo de APIs REST de microservicios desde los resolvers GraphQL.'),
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'rest_api') AND su.source_id = (SELECT id FROM project WHERE code = 'mesaya-graphql') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'REST microservice API consumption from GraphQL resolvers.')
ON CONFLICT (skill_usages_id, language_id) DO NOTHING;

-- ============================================================
-- CHATBOT: mesaya-chatbot
-- ============================================================
INSERT INTO skill_usages (skill_id, source_id, source_type, level, started_at, is_pinned, position)
VALUES
  ((SELECT id FROM skill WHERE code = 'python'),             (SELECT id FROM project WHERE code = 'mesaya-chatbot'), 'project', 4, '2024-03-01', true,  1),
  ((SELECT id FROM skill WHERE code = 'langchain'),          (SELECT id FROM project WHERE code = 'mesaya-chatbot'), 'project', 4, '2024-03-01', true,  2),
  ((SELECT id FROM skill WHERE code = 'groq'),               (SELECT id FROM project WHERE code = 'mesaya-chatbot'), 'project', 4, '2024-03-01', true,  3),
  ((SELECT id FROM skill WHERE code = 'clean_architecture'), (SELECT id FROM project WHERE code = 'mesaya-chatbot'), 'project', 4, '2024-03-01', true,  4),
  ((SELECT id FROM skill WHERE code = 'fastapi'),            (SELECT id FROM project WHERE code = 'mesaya-chatbot'), 'project', 4, '2024-03-01', false, 5),
  ((SELECT id FROM skill WHERE code = 'pydantic'),           (SELECT id FROM project WHERE code = 'mesaya-chatbot'), 'project', 3, '2024-03-01', false, 6),
  ((SELECT id FROM skill WHERE code = 'rest_api'),           (SELECT id FROM project WHERE code = 'mesaya-chatbot'), 'project', 4, '2024-03-01', false, 7)
ON CONFLICT DO NOTHING;

INSERT INTO skill_usages_translation (skill_usages_id, language_id, notes)
VALUES
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'python') AND su.source_id = (SELECT id FROM project WHERE code = 'mesaya-chatbot') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Lenguaje principal del servicio: Clean Architecture con capas domain, application, infrastructure y presentation.'),
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'python') AND su.source_id = (SELECT id FROM project WHERE code = 'mesaya-chatbot') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Main service language: Clean Architecture with domain, application, infrastructure, and presentation layers.'),

  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'langchain') AND su.source_id = (SELECT id FROM project WHERE code = 'mesaya-chatbot') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Orquestación de LLMs: cadenas de prompts, memoria conversacional, integración con herramientas externas y contexto del MCP.'),
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'langchain') AND su.source_id = (SELECT id FROM project WHERE code = 'mesaya-chatbot') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'LLM orchestration: prompt chains, conversational memory, external tool integration, and MCP context.'),

  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'groq') AND su.source_id = (SELECT id FROM project WHERE code = 'mesaya-chatbot') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Proveedor de inferencia LLM de ultra baja latencia con modelos Llama para generación de respuestas del chatbot.'),
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'groq') AND su.source_id = (SELECT id FROM project WHERE code = 'mesaya-chatbot') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Ultra-low latency LLM inference provider with Llama models for chatbot response generation.'),

  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'clean_architecture') AND su.source_id = (SELECT id FROM project WHERE code = 'mesaya-chatbot') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Separación en capas domain/application/infrastructure/presentation con inversión de dependencias para desacoplar el proveedor de IA.'),
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'clean_architecture') AND su.source_id = (SELECT id FROM project WHERE code = 'mesaya-chatbot') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Layer separation into domain/application/infrastructure/presentation with dependency inversion to decouple the AI provider.'),

  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'fastapi') AND su.source_id = (SELECT id FROM project WHERE code = 'mesaya-chatbot') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Framework de presentación para endpoints REST del chatbot con documentación automática.'),
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'fastapi') AND su.source_id = (SELECT id FROM project WHERE code = 'mesaya-chatbot') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Presentation framework for chatbot REST endpoints with automatic documentation.'),

  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'pydantic') AND su.source_id = (SELECT id FROM project WHERE code = 'mesaya-chatbot') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Validación de datos y DTOs tipados para requests/responses del chatbot.'),
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'pydantic') AND su.source_id = (SELECT id FROM project WHERE code = 'mesaya-chatbot') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Data validation and typed DTOs for chatbot requests/responses.'),

  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'rest_api') AND su.source_id = (SELECT id FROM project WHERE code = 'mesaya-chatbot') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'API REST para comunicación con el chatbot desde el frontend y consumo de contexto vía MCP por STDIO.'),
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'rest_api') AND su.source_id = (SELECT id FROM project WHERE code = 'mesaya-chatbot') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'REST API for chatbot communication from the frontend and context consumption via MCP over STDIO.')
ON CONFLICT (skill_usages_id, language_id) DO NOTHING;

-- ============================================================
-- PAYMENT: mesaya-payment-ms (Payment microservice)
-- ============================================================
INSERT INTO skill_usages (skill_id, source_id, source_type, level, started_at, is_pinned, position)
VALUES
  ((SELECT id FROM skill WHERE code = 'typescript'), (SELECT id FROM project WHERE code = 'mesaya-payment-ms'), 'project', 4, '2024-03-15', true,  1),
  ((SELECT id FROM skill WHERE code = 'nestjs'),     (SELECT id FROM project WHERE code = 'mesaya-payment-ms'), 'project', 4, '2024-03-15', true,  2),
  ((SELECT id FROM skill WHERE code = 'ddd'),        (SELECT id FROM project WHERE code = 'mesaya-payment-ms'), 'project', 3, '2024-03-15', false, 3)
ON CONFLICT DO NOTHING;

INSERT INTO skill_usages_translation (skill_usages_id, language_id, notes)
VALUES
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'typescript') AND su.source_id = (SELECT id FROM project WHERE code = 'mesaya-payment-ms') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'TypeScript con NestJS para el microservicio de pagos.'),
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'typescript') AND su.source_id = (SELECT id FROM project WHERE code = 'mesaya-payment-ms') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'TypeScript with NestJS for the payment microservice.'),

  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'nestjs') AND su.source_id = (SELECT id FROM project WHERE code = 'mesaya-payment-ms') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Framework NestJS con módulos de pagos y Value Objects para moneda.'),
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'nestjs') AND su.source_id = (SELECT id FROM project WHERE code = 'mesaya-payment-ms') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'NestJS framework with payment modules and currency Value Objects.'),

  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'ddd') AND su.source_id = (SELECT id FROM project WHERE code = 'mesaya-payment-ms') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Value Objects para moneda y estado de pago con lógica de dominio encapsulada.'),
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'ddd') AND su.source_id = (SELECT id FROM project WHERE code = 'mesaya-payment-ms') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Value Objects for currency and payment status with encapsulated domain logic.')
ON CONFLICT (skill_usages_id, language_id) DO NOTHING;

-- ============================================================
-- WEBSOCKET: mesaya-ws (WebSocket service)
-- ============================================================
INSERT INTO skill_usages (skill_id, source_id, source_type, level, started_at, is_pinned, position)
VALUES
  ((SELECT id FROM skill WHERE code = 'websocket'),  (SELECT id FROM project WHERE code = 'mesaya-ws'), 'project', 5, '2024-02-20', true,  1),
  ((SELECT id FROM skill WHERE code = 'typescript'), (SELECT id FROM project WHERE code = 'mesaya-ws'), 'project', 4, '2024-02-20', false, 2),
  ((SELECT id FROM skill WHERE code = 'nodejs'),     (SELECT id FROM project WHERE code = 'mesaya-ws'), 'project', 4, '2024-02-20', false, 3)
ON CONFLICT DO NOTHING;

INSERT INTO skill_usages_translation (skill_usages_id, language_id, notes)
VALUES
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'websocket') AND su.source_id = (SELECT id FROM project WHERE code = 'mesaya-ws') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'WebSockets para comunicación bidireccional en tiempo real entre clientes y backend.'),
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'websocket') AND su.source_id = (SELECT id FROM project WHERE code = 'mesaya-ws') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'WebSockets for real-time bidirectional communication between clients and backend.'),

  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'typescript') AND su.source_id = (SELECT id FROM project WHERE code = 'mesaya-ws') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'TypeScript para el servicio de WebSocket con tipado estricto.'),
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'typescript') AND su.source_id = (SELECT id FROM project WHERE code = 'mesaya-ws') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'TypeScript for the WebSocket service with strict typing.'),

  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'nodejs') AND su.source_id = (SELECT id FROM project WHERE code = 'mesaya-ws') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Runtime Node.js para el servicio de WebSocket en tiempo real.'),
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'nodejs') AND su.source_id = (SELECT id FROM project WHERE code = 'mesaya-ws') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Node.js runtime for the real-time WebSocket service.')
ON CONFLICT (skill_usages_id, language_id) DO NOTHING;

-- ============================================================
-- MCP: mesaya-mcp (Model Context Protocol)
-- ============================================================
INSERT INTO skill_usages (skill_id, source_id, source_type, level, started_at, is_pinned, position)
VALUES
  ((SELECT id FROM skill WHERE code = 'typescript'), (SELECT id FROM project WHERE code = 'mesaya-mcp'), 'project', 3, '2024-04-01', false, 1)
ON CONFLICT DO NOTHING;

INSERT INTO skill_usages_translation (skill_usages_id, language_id, notes)
VALUES
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'typescript') AND su.source_id = (SELECT id FROM project WHERE code = 'mesaya-mcp') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'TypeScript para la integración con Model Context Protocol.'),
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'typescript') AND su.source_id = (SELECT id FROM project WHERE code = 'mesaya-mcp') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'TypeScript for Model Context Protocol integration.')
ON CONFLICT (skill_usages_id, language_id) DO NOTHING;

COMMIT;
