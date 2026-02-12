-- ============================================================
-- mesaYA - Projects & Translations
-- ============================================================
BEGIN;

-- === Main Projects ===
INSERT INTO project (code, url, created_at, is_archived, is_pinned, position)
VALUES ('mesaya', 'https://github.com/StevSant/mesaYa', '2025-09-16', false, true, 1)
ON CONFLICT (code) DO NOTHING;

INSERT INTO project_translation (project_id, language_id, title, description)
VALUES
  ((SELECT id FROM project WHERE code = 'mesaya'), (SELECT id FROM language WHERE code = 'es'),
   'mesaYA - Plataforma de Reservas de Restaurantes',
   'Sistema completo de gestión de reservas para restaurantes con arquitectura de microservicios. Incluye frontend Angular, backend NestJS, GraphQL gateway, chatbot con IA, pasarela de pagos y WebSockets en tiempo real.'),
  ((SELECT id FROM project WHERE code = 'mesaya'), (SELECT id FROM language WHERE code = 'en'),
   'mesaYA - Restaurant Reservation Platform',
   'Complete restaurant reservation management system with microservices architecture. Includes Angular frontend, NestJS backend, GraphQL gateway, AI chatbot, payment gateway, and real-time WebSockets.')
ON CONFLICT (project_id, language_id) DO NOTHING;

-- mesaya-frontend
INSERT INTO project (code, url, created_at, parent_project_id, is_archived, is_pinned, position)
VALUES ('mesaya-frontend', 'https://github.com/StevSant/mesaYa_frontend', '2025-09-16',
        (SELECT id FROM project WHERE code = 'mesaya'), false, true, 2)
ON CONFLICT (code) DO NOTHING;

INSERT INTO project_translation (project_id, language_id, title, description)
VALUES
  ((SELECT id FROM project WHERE code = 'mesaya-frontend'), (SELECT id FROM language WHERE code = 'es'),
   'mesaYA Frontend',
   'Aplicación frontend construida con Angular 19, SSR, diseño responsivo con Material Design, internacionalización (i18n), mapas interactivos de restaurantes y gestión de mesas en tiempo real.'),
  ((SELECT id FROM project WHERE code = 'mesaya-frontend'), (SELECT id FROM language WHERE code = 'en'),
   'mesaYA Frontend',
   'Frontend application built with Angular 19, SSR, responsive Material Design, internationalization (i18n), interactive restaurant maps, and real-time table management.')
ON CONFLICT (project_id, language_id) DO NOTHING;

-- mesaya-res
INSERT INTO project (code, url, created_at, parent_project_id, is_archived, is_pinned, position)
VALUES ('mesaya-res', 'https://github.com/lesquel/mesaYa_Res', '2025-10-03',
        (SELECT id FROM project WHERE code = 'mesaya'), false, true, 3)
ON CONFLICT (code) DO NOTHING;

INSERT INTO project_translation (project_id, language_id, title, description)
VALUES
  ((SELECT id FROM project WHERE code = 'mesaya-res'), (SELECT id FROM language WHERE code = 'es'),
   'mesaYA Reservation Microservice',
   'Microservicio principal de reservas construido con NestJS siguiendo Clean Architecture y DDD. Gestiona restaurantes, secciones, mesas, menús, reseñas, pagos y suscripciones. Integrado con SonarQube para calidad de código.'),
  ((SELECT id FROM project WHERE code = 'mesaya-res'), (SELECT id FROM language WHERE code = 'en'),
   'mesaYA Reservation Microservice',
   'Main reservation microservice built with NestJS following Clean Architecture and DDD. Manages restaurants, sections, tables, menus, reviews, payments, and subscriptions. Integrated with SonarQube for code quality.')
ON CONFLICT (project_id, language_id) DO NOTHING;

-- mesaya-auth-ms
INSERT INTO project (code, url, created_at, parent_project_id, is_archived, is_pinned, position)
VALUES ('mesaya-auth-ms', 'https://github.com/StevSant/mesaYA_auth_ms', '2026-01-05',
        (SELECT id FROM project WHERE code = 'mesaya'), false, true, 4)
ON CONFLICT (code) DO NOTHING;

INSERT INTO project_translation (project_id, language_id, title, description)
VALUES
  ((SELECT id FROM project WHERE code = 'mesaya-auth-ms'), (SELECT id FROM language WHERE code = 'es'),
   'mesaYA Auth Microservice',
   'Microservicio de autenticación y autorización con RBAC (Control de Acceso Basado en Roles). Maneja usuarios, roles, permisos y siembra automática de datos al iniciar.'),
  ((SELECT id FROM project WHERE code = 'mesaya-auth-ms'), (SELECT id FROM language WHERE code = 'en'),
   'mesaYA Auth Microservice',
   'Authentication and authorization microservice with RBAC (Role-Based Access Control). Handles users, roles, permissions, and automatic data seeding on startup.')
ON CONFLICT (project_id, language_id) DO NOTHING;

-- mesaya-graphql
INSERT INTO project (code, url, created_at, parent_project_id, is_archived, is_pinned, position)
VALUES ('mesaya-graphql', 'https://github.com/StevSant/mesaYA_graphql', '2025-10-26',
        (SELECT id FROM project WHERE code = 'mesaya'), false, false, 5)
ON CONFLICT (code) DO NOTHING;

INSERT INTO project_translation (project_id, language_id, title, description)
VALUES
  ((SELECT id FROM project WHERE code = 'mesaya-graphql'), (SELECT id FROM language WHERE code = 'es'),
   'mesaYA GraphQL Gateway',
   'Gateway GraphQL construido con Python y Strawberry siguiendo arquitectura modular inspirada en Clean Architecture. Agrega múltiples microservicios REST bajo una API GraphQL unificada.'),
  ((SELECT id FROM project WHERE code = 'mesaya-graphql'), (SELECT id FROM language WHERE code = 'en'),
   'mesaYA GraphQL Gateway',
   'GraphQL gateway built with Python and Strawberry following modular architecture inspired by Clean Architecture. Aggregates multiple REST microservices under a unified GraphQL API.')
ON CONFLICT (project_id, language_id) DO NOTHING;

-- mesaya-chatbot
INSERT INTO project (code, url, created_at, parent_project_id, is_archived, is_pinned, position)
VALUES ('mesaya-chatbot', 'https://github.com/StevSant/mesaYA_chatbot_service', '2025-12-15',
        (SELECT id FROM project WHERE code = 'mesaya'), false, false, 6)
ON CONFLICT (code) DO NOTHING;

INSERT INTO project_translation (project_id, language_id, title, description)
VALUES
  ((SELECT id FROM project WHERE code = 'mesaya-chatbot'), (SELECT id FROM language WHERE code = 'es'),
   'mesaYA Chatbot Service',
   'Servicio de chatbot inteligente construido con Python siguiendo Clean Architecture. Utiliza LangChain para orquestación de LLMs y Groq API para inferencia de ultra baja latencia. Se integra con el servidor MCP (Model Context Protocol) del ecosistema mesaYA vía STDIO para obtener contexto en tiempo real del sistema. Soporta múltiples idiomas y niveles de acceso con prompts contextuales por rol.'),
  ((SELECT id FROM project WHERE code = 'mesaya-chatbot'), (SELECT id FROM language WHERE code = 'en'),
   'mesaYA Chatbot Service',
   'Intelligent chatbot service built with Python following Clean Architecture. Uses LangChain for LLM orchestration and Groq API for ultra-low latency inference. Integrates with the mesaYA ecosystem MCP (Model Context Protocol) server via STDIO for real-time system context. Supports multiple languages and access levels with role-based contextual prompts.')
ON CONFLICT (project_id, language_id) DO NOTHING;

-- mesaya-payment-ms
INSERT INTO project (code, url, created_at, parent_project_id, is_archived, is_pinned, position)
VALUES ('mesaya-payment-ms', 'https://github.com/lesquel/mesaYA_payment_ms', '2026-01-19',
        (SELECT id FROM project WHERE code = 'mesaya'), false, false, 7)
ON CONFLICT (code) DO NOTHING;

INSERT INTO project_translation (project_id, language_id, title, description)
VALUES
  ((SELECT id FROM project WHERE code = 'mesaya-payment-ms'), (SELECT id FROM language WHERE code = 'es'),
   'mesaYA Payment Microservice',
   'Microservicio de pasarela de pagos para procesar transacciones de reservas y suscripciones de restaurantes.'),
  ((SELECT id FROM project WHERE code = 'mesaya-payment-ms'), (SELECT id FROM language WHERE code = 'en'),
   'mesaYA Payment Microservice',
   'Payment gateway microservice for processing restaurant reservation and subscription transactions.')
ON CONFLICT (project_id, language_id) DO NOTHING;

-- mesaya-ws
INSERT INTO project (code, url, created_at, parent_project_id, is_archived, is_pinned, position)
VALUES ('mesaya-ws', NULL, '2025-10-12',
        (SELECT id FROM project WHERE code = 'mesaya'), false, false, 8)
ON CONFLICT (code) DO NOTHING;

INSERT INTO project_translation (project_id, language_id, title, description)
VALUES
  ((SELECT id FROM project WHERE code = 'mesaya-ws'), (SELECT id FROM language WHERE code = 'es'),
   'mesaYA WebSocket Service',
   'Servicio de WebSockets para comunicación en tiempo real: selección de mesas, actualizaciones de estado y notificaciones push entre clientes y el backend.'),
  ((SELECT id FROM project WHERE code = 'mesaya-ws'), (SELECT id FROM language WHERE code = 'en'),
   'mesaYA WebSocket Service',
   'WebSocket service for real-time communication: table selection, status updates, and push notifications between clients and the backend.')
ON CONFLICT (project_id, language_id) DO NOTHING;

-- mesaya-mcp
INSERT INTO project (code, url, created_at, parent_project_id, is_archived, is_pinned, position)
VALUES ('mesaya-mcp', 'https://github.com/StevSant/mesaYA_mcp', '2025-12-23',
        (SELECT id FROM project WHERE code = 'mesaya'), false, false, 9)
ON CONFLICT (code) DO NOTHING;

INSERT INTO project_translation (project_id, language_id, title, description)
VALUES
  ((SELECT id FROM project WHERE code = 'mesaya-mcp'), (SELECT id FROM language WHERE code = 'es'),
   'mesaYA MCP (Model Context Protocol)',
   'Integración con Model Context Protocol para proporcionar contexto del sistema a asistentes de IA y herramientas de desarrollo.'),
  ((SELECT id FROM project WHERE code = 'mesaya-mcp'), (SELECT id FROM language WHERE code = 'en'),
   'mesaYA MCP (Model Context Protocol)',
   'Model Context Protocol integration to provide system context to AI assistants and development tools.')
ON CONFLICT (project_id, language_id) DO NOTHING;

-- mesaya-partner-demo (archived)
INSERT INTO project (code, url, created_at, parent_project_id, is_archived, is_pinned, position)
VALUES ('mesaya-partner-demo', NULL, '2024-04-10',
        (SELECT id FROM project WHERE code = 'mesaya'), true, false, 10)
ON CONFLICT (code) DO NOTHING;

INSERT INTO project_translation (project_id, language_id, title, description)
VALUES
  ((SELECT id FROM project WHERE code = 'mesaya-partner-demo'), (SELECT id FROM language WHERE code = 'es'),
   'mesaYA Partner Demo',
   'Aplicación de demostración para socios comerciales. Archivada tras completar fase de presentación.'),
  ((SELECT id FROM project WHERE code = 'mesaya-partner-demo'), (SELECT id FROM language WHERE code = 'en'),
   'mesaYA Partner Demo',
   'Demo application for business partners. Archived after presentation phase completed.')
ON CONFLICT (project_id, language_id) DO NOTHING;

COMMIT;
