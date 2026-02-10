-- ============================================================
-- Hackathon Agent AI - Content Sections & Translations
-- ============================================================
-- Architectural children (api-module, vectorstore, infrastructure,
-- testing) merged as content_sections on their parent project.
-- All icons: Material Icons lowercase.
-- ============================================================
BEGIN;

-- =========================================
-- Root project (hackathon-agent-ai): 5 sections
-- (3 original + 2 merged from infrastructure)
-- =========================================
INSERT INTO content_section (entity_type, entity_id, section_key, icon, position, is_archived, is_pinned)
VALUES
  ('project', (SELECT id FROM project WHERE code = 'hackathon-agent-ai'), 'overview',      'info',         1, false, true),
  ('project', (SELECT id FROM project WHERE code = 'hackathon-agent-ai'), 'architecture',  'account_tree', 2, false, true),
  ('project', (SELECT id FROM project WHERE code = 'hackathon-agent-ai'), 'challenges',    'warning',      3, false, false),
  ('project', (SELECT id FROM project WHERE code = 'hackathon-agent-ai'), 'infrastructure','settings',     4, false, false),
  ('project', (SELECT id FROM project WHERE code = 'hackathon-agent-ai'), 'infra_setup',   'build',        5, false, false)
ON CONFLICT DO NOTHING;

-- Root: overview
INSERT INTO content_section_translation (content_section_id, language_id, title, body)
VALUES
  ((SELECT cs.id FROM content_section cs
    WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'hackathon-agent-ai')
      AND cs.section_key = 'overview' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'),
   'Descripción General',
   'Proyecto fullstack que implementa un agente de IA conversacional con RAG. Combina un backend Python/FastAPI con un frontend Angular para ofrecer respuestas contextuales basadas en documentos.'),
  ((SELECT cs.id FROM content_section cs
    WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'hackathon-agent-ai')
      AND cs.section_key = 'overview' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'),
   'Overview',
   'Fullstack project implementing a conversational AI agent with RAG. Combines a Python/FastAPI backend with an Angular frontend to provide contextual document-based answers.')
ON CONFLICT (content_section_id, language_id) DO NOTHING;

-- Root: architecture
INSERT INTO content_section_translation (content_section_id, language_id, title, body)
VALUES
  ((SELECT cs.id FROM content_section cs
    WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'hackathon-agent-ai')
      AND cs.section_key = 'architecture' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'),
   'Arquitectura',
   'Arquitectura de microservicios con separación clara: API REST (FastAPI), orquestación de LLM (LangChain), vector store (ChromaDB), y SPA (Angular). Comunicación vía HTTP/JSON.'),
  ((SELECT cs.id FROM content_section cs
    WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'hackathon-agent-ai')
      AND cs.section_key = 'architecture' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'),
   'Architecture',
   'Microservices architecture with clear separation: REST API (FastAPI), LLM orchestration (LangChain), vector store (ChromaDB), and SPA (Angular). Communication via HTTP/JSON.')
ON CONFLICT (content_section_id, language_id) DO NOTHING;

-- Root: challenges
INSERT INTO content_section_translation (content_section_id, language_id, title, body)
VALUES
  ((SELECT cs.id FROM content_section cs
    WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'hackathon-agent-ai')
      AND cs.section_key = 'challenges' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'),
   'Desafíos',
   'Optimizar la latencia del pipeline RAG, gestionar el contexto conversacional sin perder coherencia y coordinar el equipo durante las 48 horas de la hackathon.'),
  ((SELECT cs.id FROM content_section cs
    WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'hackathon-agent-ai')
      AND cs.section_key = 'challenges' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'),
   'Challenges',
   'Optimizing RAG pipeline latency, managing conversational context without losing coherence, and coordinating the team during the 48-hour hackathon.')
ON CONFLICT (content_section_id, language_id) DO NOTHING;

-- Root: infrastructure (merged from hackathon-infrastructure)
INSERT INTO content_section_translation (content_section_id, language_id, title, body)
VALUES
  ((SELECT cs.id FROM content_section cs
    WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'hackathon-agent-ai')
      AND cs.section_key = 'infrastructure' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'),
   'Infraestructura y Despliegue',
   'Configuración de Docker, variables de entorno y scripts de despliegue para garantizar un entorno reproducible y portable.'),
  ((SELECT cs.id FROM content_section cs
    WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'hackathon-agent-ai')
      AND cs.section_key = 'infrastructure' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'),
   'Infrastructure and Deployment',
   'Docker configuration, environment variables, and deployment scripts to ensure a reproducible and portable environment.')
ON CONFLICT (content_section_id, language_id) DO NOTHING;

-- Root: infra_setup (merged from hackathon-infrastructure)
INSERT INTO content_section_translation (content_section_id, language_id, title, body)
VALUES
  ((SELECT cs.id FROM content_section cs
    WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'hackathon-agent-ai')
      AND cs.section_key = 'infra_setup' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'),
   'Configuración de Infraestructura',
   'Dockerfile multi-stage para el backend, .env para variables sensibles (API keys), .dockerignore optimizado y gestión de dependencias con requirements.txt.'),
  ((SELECT cs.id FROM content_section cs
    WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'hackathon-agent-ai')
      AND cs.section_key = 'infra_setup' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'),
   'Infrastructure Setup',
   'Multi-stage Dockerfile for backend, .env for sensitive variables (API keys), optimized .dockerignore, and dependency management with requirements.txt.')
ON CONFLICT (content_section_id, language_id) DO NOTHING;

-- =========================================
-- Backend (hackathon-backend): 10 sections
-- (4 original + 6 merged from api-module, vectorstore, testing)
-- =========================================
INSERT INTO content_section (entity_type, entity_id, section_key, icon, position, is_archived, is_pinned)
VALUES
  ('project', (SELECT id FROM project WHERE code = 'hackathon-backend'), 'overview',        'info',         1, false, true),
  ('project', (SELECT id FROM project WHERE code = 'hackathon-backend'), 'stack',           'layers',       2, false, true),
  ('project', (SELECT id FROM project WHERE code = 'hackathon-backend'), 'endpoints',       'power',        3, false, false),
  ('project', (SELECT id FROM project WHERE code = 'hackathon-backend'), 'challenges',      'warning',      4, false, false),
  ('project', (SELECT id FROM project WHERE code = 'hackathon-backend'), 'api_module',      'api',          5, false, false),
  ('project', (SELECT id FROM project WHERE code = 'hackathon-backend'), 'api_endpoints',   'route',        6, false, false),
  ('project', (SELECT id FROM project WHERE code = 'hackathon-backend'), 'rag_overview',    'psychology',   7, false, false),
  ('project', (SELECT id FROM project WHERE code = 'hackathon-backend'), 'rag_pipeline',    'merge_type',   8, false, false),
  ('project', (SELECT id FROM project WHERE code = 'hackathon-backend'), 'testing',         'check_circle', 9, false, false),
  ('project', (SELECT id FROM project WHERE code = 'hackathon-backend'), 'test_coverage',   'verified',    10, false, false)
ON CONFLICT DO NOTHING;

-- Backend: overview
INSERT INTO content_section_translation (content_section_id, language_id, title, body)
VALUES
  ((SELECT cs.id FROM content_section cs
    WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'hackathon-backend')
      AND cs.section_key = 'overview' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'),
   'Descripción General',
   'Servidor backend en Python con FastAPI que expone endpoints REST para el agente de IA. Integra LangChain, OpenAI y ChromaDB con arquitectura limpia en capas.'),
  ((SELECT cs.id FROM content_section cs
    WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'hackathon-backend')
      AND cs.section_key = 'overview' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'),
   'Overview',
   'Python backend server with FastAPI exposing REST endpoints for the AI agent. Integrates LangChain, OpenAI, and ChromaDB with clean layered architecture.')
ON CONFLICT (content_section_id, language_id) DO NOTHING;

-- Backend: stack
INSERT INTO content_section_translation (content_section_id, language_id, title, body)
VALUES
  ((SELECT cs.id FROM content_section cs
    WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'hackathon-backend')
      AND cs.section_key = 'stack' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'),
   'Stack Tecnológico',
   'Python 3.11+, FastAPI, LangChain, OpenAI API, ChromaDB, PostgreSQL, Pydantic para validación de DTOs, uvicorn como servidor ASGI.'),
  ((SELECT cs.id FROM content_section cs
    WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'hackathon-backend')
      AND cs.section_key = 'stack' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'),
   'Tech Stack',
   'Python 3.11+, FastAPI, LangChain, OpenAI API, ChromaDB, PostgreSQL, Pydantic for DTO validation, uvicorn as ASGI server.')
ON CONFLICT (content_section_id, language_id) DO NOTHING;

-- Backend: endpoints
INSERT INTO content_section_translation (content_section_id, language_id, title, body)
VALUES
  ((SELECT cs.id FROM content_section cs
    WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'hackathon-backend')
      AND cs.section_key = 'endpoints' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'),
   'Endpoints Principales',
   'POST /chat — enviar mensaje al agente. GET /health — estado del servicio. POST /documents — ingestar documentos al vector store. GET /history — historial conversacional.'),
  ((SELECT cs.id FROM content_section cs
    WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'hackathon-backend')
      AND cs.section_key = 'endpoints' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'),
   'Main Endpoints',
   'POST /chat — send message to agent. GET /health — service status. POST /documents — ingest documents to vector store. GET /history — conversation history.')
ON CONFLICT (content_section_id, language_id) DO NOTHING;

-- Backend: challenges
INSERT INTO content_section_translation (content_section_id, language_id, title, body)
VALUES
  ((SELECT cs.id FROM content_section cs
    WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'hackathon-backend')
      AND cs.section_key = 'challenges' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'),
   'Desafíos del Backend',
   'Manejar concurrencia async con FastAPI, configurar correctamente las cadenas de LangChain y mantener tiempos de respuesta bajos con llamadas a la API de OpenAI.'),
  ((SELECT cs.id FROM content_section cs
    WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'hackathon-backend')
      AND cs.section_key = 'challenges' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'),
   'Backend Challenges',
   'Handling async concurrency with FastAPI, properly configuring LangChain chains, and keeping response times low with OpenAI API calls.')
ON CONFLICT (content_section_id, language_id) DO NOTHING;

-- Backend: api_module (merged from hackathon-api-module)
INSERT INTO content_section_translation (content_section_id, language_id, title, body)
VALUES
  ((SELECT cs.id FROM content_section cs
    WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'hackathon-backend')
      AND cs.section_key = 'api_module' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'),
   'Módulo API REST',
   'Capa API del backend que define los controladores, rutas y validaciones de entrada/salida con Pydantic DTOs.'),
  ((SELECT cs.id FROM content_section cs
    WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'hackathon-backend')
      AND cs.section_key = 'api_module' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'),
   'REST API Module',
   'Backend API layer defining controllers, routes, and input/output validation with Pydantic DTOs.')
ON CONFLICT (content_section_id, language_id) DO NOTHING;

-- Backend: api_endpoints (merged from hackathon-api-module)
INSERT INTO content_section_translation (content_section_id, language_id, title, body)
VALUES
  ((SELECT cs.id FROM content_section cs
    WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'hackathon-backend')
      AND cs.section_key = 'api_endpoints' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'),
   'Estructura de Endpoints',
   'Organización modular de rutas con APIRouter de FastAPI. Cada dominio tiene su propio router con prefijos y tags para documentación automática.'),
  ((SELECT cs.id FROM content_section cs
    WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'hackathon-backend')
      AND cs.section_key = 'api_endpoints' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'),
   'Endpoint Structure',
   'Modular route organization with FastAPI APIRouter. Each domain has its own router with prefixes and tags for auto-documentation.')
ON CONFLICT (content_section_id, language_id) DO NOTHING;

-- Backend: rag_overview (merged from hackathon-vectorstore)
INSERT INTO content_section_translation (content_section_id, language_id, title, body)
VALUES
  ((SELECT cs.id FROM content_section cs
    WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'hackathon-backend')
      AND cs.section_key = 'rag_overview' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'),
   'Pipeline RAG y Vector Store',
   'Pipeline de Retrieval-Augmented Generation que ingesta documentos, genera embeddings y recupera contexto relevante para las respuestas del agente.'),
  ((SELECT cs.id FROM content_section cs
    WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'hackathon-backend')
      AND cs.section_key = 'rag_overview' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'),
   'RAG Pipeline and Vector Store',
   'Retrieval-Augmented Generation pipeline that ingests documents, generates embeddings, and retrieves relevant context for agent responses.')
ON CONFLICT (content_section_id, language_id) DO NOTHING;

-- Backend: rag_pipeline (merged from hackathon-vectorstore)
INSERT INTO content_section_translation (content_section_id, language_id, title, body)
VALUES
  ((SELECT cs.id FROM content_section cs
    WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'hackathon-backend')
      AND cs.section_key = 'rag_pipeline' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'),
   'Flujo del Pipeline RAG',
   '1) Carga de documentos → 2) Fragmentación en chunks → 3) Generación de embeddings con OpenAI → 4) Almacenamiento en ChromaDB → 5) Retrieval por similitud semántica → 6) Inyección de contexto al prompt.'),
  ((SELECT cs.id FROM content_section cs
    WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'hackathon-backend')
      AND cs.section_key = 'rag_pipeline' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'),
   'RAG Pipeline Flow',
   '1) Document loading → 2) Chunking → 3) Embedding generation with OpenAI → 4) Storage in ChromaDB → 5) Semantic similarity retrieval → 6) Context injection into prompt.')
ON CONFLICT (content_section_id, language_id) DO NOTHING;

-- Backend: testing (merged from hackathon-testing)
INSERT INTO content_section_translation (content_section_id, language_id, title, body)
VALUES
  ((SELECT cs.id FROM content_section cs
    WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'hackathon-backend')
      AND cs.section_key = 'testing' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'),
   'Testing y Calidad de Código',
   'Suite de pruebas del backend con pytest que valida la lógica del agente, endpoints de la API y el pipeline RAG.'),
  ((SELECT cs.id FROM content_section cs
    WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'hackathon-backend')
      AND cs.section_key = 'testing' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'),
   'Testing and Code Quality',
   'Backend test suite with pytest that validates agent logic, API endpoints, and the RAG pipeline.')
ON CONFLICT (content_section_id, language_id) DO NOTHING;

-- Backend: test_coverage (merged from hackathon-testing)
INSERT INTO content_section_translation (content_section_id, language_id, title, body)
VALUES
  ((SELECT cs.id FROM content_section cs
    WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'hackathon-backend')
      AND cs.section_key = 'test_coverage' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'),
   'Cobertura de Tests',
   'Pruebas unitarias para servicios y utilidades, pruebas de integración para endpoints con TestClient de FastAPI, y validación de tipos con mypy.'),
  ((SELECT cs.id FROM content_section cs
    WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'hackathon-backend')
      AND cs.section_key = 'test_coverage' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'),
   'Test Coverage',
   'Unit tests for services and utilities, integration tests for endpoints with FastAPI TestClient, and type validation with mypy.')
ON CONFLICT (content_section_id, language_id) DO NOTHING;

-- =========================================
-- Frontend (hackathon-frontend): 3 sections
-- =========================================
INSERT INTO content_section (entity_type, entity_id, section_key, icon, position, is_archived, is_pinned)
VALUES
  ('project', (SELECT id FROM project WHERE code = 'hackathon-frontend'), 'overview', 'info',            1, false, true),
  ('project', (SELECT id FROM project WHERE code = 'hackathon-frontend'), 'stack',    'layers',          2, false, true),
  ('project', (SELECT id FROM project WHERE code = 'hackathon-frontend'), 'ux',       'desktop_windows', 3, false, false)
ON CONFLICT DO NOTHING;

-- Frontend: overview
INSERT INTO content_section_translation (content_section_id, language_id, title, body)
VALUES
  ((SELECT cs.id FROM content_section cs
    WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'hackathon-frontend')
      AND cs.section_key = 'overview' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'),
   'Descripción General',
   'SPA desarrollada con Angular y TailwindCSS que provee una interfaz tipo chat para interactuar con el agente de IA en tiempo real.'),
  ((SELECT cs.id FROM content_section cs
    WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'hackathon-frontend')
      AND cs.section_key = 'overview' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'),
   'Overview',
   'SPA built with Angular and TailwindCSS providing a chat-like interface to interact with the AI agent in real time.')
ON CONFLICT (content_section_id, language_id) DO NOTHING;

-- Frontend: stack
INSERT INTO content_section_translation (content_section_id, language_id, title, body)
VALUES
  ((SELECT cs.id FROM content_section cs
    WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'hackathon-frontend')
      AND cs.section_key = 'stack' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'),
   'Stack Tecnológico',
   'Angular 17+, TypeScript, TailwindCSS, RxJS para manejo de streams, HttpClient para comunicación con el backend.'),
  ((SELECT cs.id FROM content_section cs
    WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'hackathon-frontend')
      AND cs.section_key = 'stack' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'),
   'Tech Stack',
   'Angular 17+, TypeScript, TailwindCSS, RxJS for stream handling, HttpClient for backend communication.')
ON CONFLICT (content_section_id, language_id) DO NOTHING;

-- Frontend: ux
INSERT INTO content_section_translation (content_section_id, language_id, title, body)
VALUES
  ((SELECT cs.id FROM content_section cs
    WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'hackathon-frontend')
      AND cs.section_key = 'ux' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'),
   'Experiencia de Usuario',
   'Interfaz conversacional con burbujas de chat, indicador de carga mientras el agente procesa, diseño responsivo y tema oscuro/claro.'),
  ((SELECT cs.id FROM content_section cs
    WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'hackathon-frontend')
      AND cs.section_key = 'ux' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'),
   'User Experience',
   'Conversational interface with chat bubbles, loading indicator while agent processes, responsive design, and dark/light theme.')
ON CONFLICT (content_section_id, language_id) DO NOTHING;

COMMIT;
