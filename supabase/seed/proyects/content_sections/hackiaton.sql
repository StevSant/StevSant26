
-- Proyecto 1: Hackathon Agent AI (padre)
INSERT INTO content_section (id, entity_type, entity_id, section_key, icon, position, is_archived, is_pinned) VALUES
  (1,  'project', 1, 'overview',      'eye',           1, false, true),
  (2,  'project', 1, 'architecture',  'sitemap',       2, false, true),
  (3,  'project', 1, 'challenges',    'alert-triangle', 3, false, false),

-- Proyecto 2: Backend
  (4,  'project', 2, 'overview',      'eye',           1, false, true),
  (5,  'project', 2, 'stack',         'layers',        2, false, true),
  (6,  'project', 2, 'endpoints',     'plug',          3, false, false),
  (7,  'project', 2, 'challenges',    'alert-triangle', 4, false, false),

-- Proyecto 3: Frontend
  (8,  'project', 3, 'overview',      'eye',           1, false, true),
  (9,  'project', 3, 'stack',         'layers',        2, false, true),
  (10, 'project', 3, 'ux',           'monitor',        3, false, false),

-- Proyecto 4: API Module
  (11, 'project', 4, 'overview',      'eye',           1, false, true),
  (12, 'project', 4, 'endpoints',     'plug',          2, false, false),

-- Proyecto 5: RAG Pipeline
  (13, 'project', 5, 'overview',      'eye',           1, false, true),
  (14, 'project', 5, 'pipeline',      'git-merge',     2, false, true),
  (15, 'project', 5, 'challenges',    'alert-triangle', 3, false, false),

-- Proyecto 6: Infraestructura
  (16, 'project', 6, 'overview',      'eye',           1, false, true),
  (17, 'project', 6, 'setup',         'settings',      2, false, false),

-- Proyecto 7: Testing
  (18, 'project', 7, 'overview',      'eye',           1, false, true),
  (19, 'project', 7, 'coverage',      'check-circle',  2, false, false);

SELECT setval('content_section_id_seq', (SELECT MAX(id) FROM content_section));

-- =========================
-- Seeding: content_section_translation
-- =========================

INSERT INTO content_section_translation (id, content_section_id, language_id, title, body) VALUES
-- === Proyecto 1: Hackathon Agent AI ===
-- overview
(1,  1, 1, 'Descripción General',
 'Proyecto fullstack que implementa un agente de IA conversacional con RAG. Combina un backend Python/FastAPI con un frontend Angular para ofrecer respuestas contextuales basadas en documentos.'),
(2,  1, 2, 'Overview',
 'Fullstack project implementing a conversational AI agent with RAG. Combines a Python/FastAPI backend with an Angular frontend to provide contextual document-based answers.'),

-- architecture
(3,  2, 1, 'Arquitectura',
 'Arquitectura de microservicios con separación clara: API REST (FastAPI), orquestación de LLM (LangChain), vector store (ChromaDB), y SPA (Angular). Comunicación vía HTTP/JSON.'),
(4,  2, 2, 'Architecture',
 'Microservices architecture with clear separation: REST API (FastAPI), LLM orchestration (LangChain), vector store (ChromaDB), and SPA (Angular). Communication via HTTP/JSON.'),

-- challenges
(5,  3, 1, 'Desafíos',
 'Optimizar la latencia del pipeline RAG, gestionar el contexto conversacional sin perder coherencia y coordinar el equipo durante las 48 horas de la hackathon.'),
(6,  3, 2, 'Challenges',
 'Optimizing RAG pipeline latency, managing conversational context without losing coherence, and coordinating the team during the 48-hour hackathon.'),

-- === Proyecto 2: Backend ===
-- overview
(7,  4, 1, 'Descripción General',
 'Servidor backend en Python con FastAPI que expone endpoints REST para el agente de IA. Integra LangChain, OpenAI y ChromaDB con arquitectura limpia en capas.'),
(8,  4, 2, 'Overview',
 'Python backend server with FastAPI exposing REST endpoints for the AI agent. Integrates LangChain, OpenAI, and ChromaDB with clean layered architecture.'),

-- stack
(9,  5, 1, 'Stack Tecnológico',
 'Python 3.11+, FastAPI, LangChain, OpenAI API, ChromaDB, PostgreSQL, Pydantic para validación de DTOs, uvicorn como servidor ASGI.'),
(10, 5, 2, 'Tech Stack',
 'Python 3.11+, FastAPI, LangChain, OpenAI API, ChromaDB, PostgreSQL, Pydantic for DTO validation, uvicorn as ASGI server.'),

-- endpoints
(11, 6, 1, 'Endpoints Principales',
 'POST /chat — enviar mensaje al agente. GET /health — estado del servicio. POST /documents — ingestar documentos al vector store. GET /history — historial conversacional.'),
(12, 6, 2, 'Main Endpoints',
 'POST /chat — send message to agent. GET /health — service status. POST /documents — ingest documents to vector store. GET /history — conversation history.'),

-- challenges
(13, 7, 1, 'Desafíos',
 'Manejar concurrencia async con FastAPI, configurar correctamente las cadenas de LangChain y mantener tiempos de respuesta bajos con llamadas a la API de OpenAI.'),
(14, 7, 2, 'Challenges',
 'Handling async concurrency with FastAPI, properly configuring LangChain chains, and keeping response times low with OpenAI API calls.'),

-- === Proyecto 3: Frontend ===
-- overview
(15, 8, 1, 'Descripción General',
 'SPA desarrollada con Angular y TailwindCSS que provee una interfaz tipo chat para interactuar con el agente de IA en tiempo real.'),
(16, 8, 2, 'Overview',
 'SPA built with Angular and TailwindCSS providing a chat-like interface to interact with the AI agent in real time.'),

-- stack
(17, 9, 1, 'Stack Tecnológico',
 'Angular 17+, TypeScript, TailwindCSS, RxJS para manejo de streams, HttpClient para comunicación con el backend.'),
(18, 9, 2, 'Tech Stack',
 'Angular 17+, TypeScript, TailwindCSS, RxJS for stream handling, HttpClient for backend communication.'),

-- ux
(19, 10, 1, 'Experiencia de Usuario',
 'Interfaz conversacional con burbujas de chat, indicador de carga mientras el agente procesa, diseño responsivo y tema oscuro/claro.'),
(20, 10, 2, 'User Experience',
 'Conversational interface with chat bubbles, loading indicator while agent processes, responsive design, and dark/light theme.'),

-- === Proyecto 4: API Module ===
-- overview
(21, 11, 1, 'Descripción General',
 'Capa API del backend que define los controladores, rutas y validaciones de entrada/salida con Pydantic DTOs.'),
(22, 11, 2, 'Overview',
 'Backend API layer defining controllers, routes, and input/output validation with Pydantic DTOs.'),

-- endpoints
(23, 12, 1, 'Estructura de Endpoints',
 'Organización modular de rutas con APIRouter de FastAPI. Cada dominio tiene su propio router con prefijos y tags para documentación automática.'),
(24, 12, 2, 'Endpoint Structure',
 'Modular route organization with FastAPI APIRouter. Each domain has its own router with prefixes and tags for auto-documentation.'),

-- === Proyecto 5: RAG Pipeline ===
-- overview
(25, 13, 1, 'Descripción General',
 'Pipeline de Retrieval-Augmented Generation que ingesta documentos, genera embeddings y recupera contexto relevante para las respuestas del agente.'),
(26, 13, 2, 'Overview',
 'Retrieval-Augmented Generation pipeline that ingests documents, generates embeddings, and retrieves relevant context for agent responses.'),

-- pipeline
(27, 14, 1, 'Flujo del Pipeline',
 '1) Carga de documentos → 2) Fragmentación en chunks → 3) Generación de embeddings con OpenAI → 4) Almacenamiento en ChromaDB → 5) Retrieval por similitud semántica → 6) Inyección de contexto al prompt.'),
(28, 14, 2, 'Pipeline Flow',
 '1) Document loading → 2) Chunking → 3) Embedding generation with OpenAI → 4) Storage in ChromaDB → 5) Semantic similarity retrieval → 6) Context injection into prompt.'),

-- challenges
(29, 15, 1, 'Desafíos',
 'Definir el tamaño óptimo de chunks, evitar pérdida de contexto entre fragmentos y balancear precisión vs velocidad en las búsquedas vectoriales.'),
(30, 15, 2, 'Challenges',
 'Defining optimal chunk size, avoiding context loss between fragments, and balancing precision vs speed in vector searches.'),

-- === Proyecto 6: Infraestructura ===
-- overview
(31, 16, 1, 'Descripción General',
 'Configuración de Docker, variables de entorno y scripts de despliegue para garantizar un entorno reproducible y portable.'),
(32, 16, 2, 'Overview',
 'Docker configuration, environment variables, and deployment scripts to ensure a reproducible and portable environment.'),

-- setup
(33, 17, 1, 'Configuración',
 'Dockerfile multi-stage para el backend, .env para variables sensibles (API keys), .dockerignore optimizado y gestión de dependencias con requirements.txt.'),
(34, 17, 2, 'Setup',
 'Multi-stage Dockerfile for backend, .env for sensitive variables (API keys), optimized .dockerignore, and dependency management with requirements.txt.'),

-- === Proyecto 7: Testing ===
-- overview
(35, 18, 1, 'Descripción General',
 'Suite de pruebas del backend con pytest que valida la lógica del agente, endpoints de la API y el pipeline RAG.'),
(36, 18, 2, 'Overview',
 'Backend test suite with pytest that validates agent logic, API endpoints, and the RAG pipeline.'),

-- coverage
(37, 19, 1, 'Cobertura',
 'Pruebas unitarias para servicios y utilidades, pruebas de integración para endpoints con TestClient de FastAPI, y validación de tipos con mypy.'),
(38, 19, 2, 'Coverage',
 'Unit tests for services and utilities, integration tests for endpoints with FastAPI TestClient, and type validation with mypy.');

SELECT setval('content_section_translation_id_seq', (SELECT MAX(id) FROM content_section_translation));
