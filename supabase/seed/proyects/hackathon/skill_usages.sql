-- ============================================================
-- Hackathon Agent AI - Skill Usages & Translations
-- ============================================================
-- Deduplication strategy:
--   Root: cross-cutting skills (docker, rest_api, clean_architecture)
--   Backend: python, fastapi, langchain, openai, postgresql, chromadb, sql, pytest
--   Frontend: angular, typescript, tailwindcss, html_css
--   Architectural children (api-module, vectorstore, infrastructure, testing): NO skill_usages
-- ============================================================
BEGIN;

-- === Root project skills ===
INSERT INTO skill_usages (skill_id, source_id, source_type, level, started_at, is_archived, is_pinned, position)
VALUES
  ((SELECT id FROM skill WHERE code = 'docker'),
   (SELECT id FROM project WHERE code = 'hackathon-agent-ai'), 'project', 3, '2024-01-15', false, false, 1),
  ((SELECT id FROM skill WHERE code = 'rest_api'),
   (SELECT id FROM project WHERE code = 'hackathon-agent-ai'), 'project', 4, '2024-01-15', false, false, 2),
  ((SELECT id FROM skill WHERE code = 'clean_architecture'),
   (SELECT id FROM project WHERE code = 'hackathon-agent-ai'), 'project', 3, '2024-01-15', false, false, 3)
ON CONFLICT DO NOTHING;

-- Root: Docker
INSERT INTO skill_usages_translation (skill_usages_id, language_id, notes)
VALUES
  ((SELECT su.id FROM skill_usages su
    JOIN skill s ON s.id = su.skill_id
    WHERE s.code = 'docker'
      AND su.source_id = (SELECT id FROM project WHERE code = 'hackathon-agent-ai')
      AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'),
   'Estrategia general de containerización del proyecto para garantizar portabilidad y reproducibilidad del entorno.'),
  ((SELECT su.id FROM skill_usages su
    JOIN skill s ON s.id = su.skill_id
    WHERE s.code = 'docker'
      AND su.source_id = (SELECT id FROM project WHERE code = 'hackathon-agent-ai')
      AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'),
   'Overall project containerization strategy to ensure environment portability and reproducibility.');

-- Root: REST API
INSERT INTO skill_usages_translation (skill_usages_id, language_id, notes)
VALUES
  ((SELECT su.id FROM skill_usages su
    JOIN skill s ON s.id = su.skill_id
    WHERE s.code = 'rest_api'
      AND su.source_id = (SELECT id FROM project WHERE code = 'hackathon-agent-ai')
      AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'),
   'Diseño de la arquitectura de comunicación REST entre el frontend Angular y el backend FastAPI del agente de IA.'),
  ((SELECT su.id FROM skill_usages su
    JOIN skill s ON s.id = su.skill_id
    WHERE s.code = 'rest_api'
      AND su.source_id = (SELECT id FROM project WHERE code = 'hackathon-agent-ai')
      AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'),
   'REST communication architecture design between the Angular frontend and the FastAPI backend of the AI agent.');

-- Root: Clean Architecture
INSERT INTO skill_usages_translation (skill_usages_id, language_id, notes)
VALUES
  ((SELECT su.id FROM skill_usages su
    JOIN skill s ON s.id = su.skill_id
    WHERE s.code = 'clean_architecture'
      AND su.source_id = (SELECT id FROM project WHERE code = 'hackathon-agent-ai')
      AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'),
   'Arquitectura limpia con separación en capas: api, application, domain, infrastructure y DTOs.'),
  ((SELECT su.id FROM skill_usages su
    JOIN skill s ON s.id = su.skill_id
    WHERE s.code = 'clean_architecture'
      AND su.source_id = (SELECT id FROM project WHERE code = 'hackathon-agent-ai')
      AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'),
   'Clean architecture with layer separation: api, application, domain, infrastructure, and DTOs.');

-- === Backend skills ===
INSERT INTO skill_usages (skill_id, source_id, source_type, level, started_at, is_archived, is_pinned, position)
VALUES
  ((SELECT id FROM skill WHERE code = 'python'),
   (SELECT id FROM project WHERE code = 'hackathon-backend'), 'project', 5, '2024-01-15', false, true, 1),
  ((SELECT id FROM skill WHERE code = 'fastapi'),
   (SELECT id FROM project WHERE code = 'hackathon-backend'), 'project', 4, '2024-01-15', false, true, 2),
  ((SELECT id FROM skill WHERE code = 'langchain'),
   (SELECT id FROM project WHERE code = 'hackathon-backend'), 'project', 4, '2024-01-15', false, true, 3),
  ((SELECT id FROM skill WHERE code = 'openai'),
   (SELECT id FROM project WHERE code = 'hackathon-backend'), 'project', 4, '2024-01-15', false, true, 4),
  ((SELECT id FROM skill WHERE code = 'postgresql'),
   (SELECT id FROM project WHERE code = 'hackathon-backend'), 'project', 3, '2024-01-16', false, false, 5),
  ((SELECT id FROM skill WHERE code = 'chromadb'),
   (SELECT id FROM project WHERE code = 'hackathon-backend'), 'project', 3, '2024-01-16', false, false, 6),
  ((SELECT id FROM skill WHERE code = 'sql'),
   (SELECT id FROM project WHERE code = 'hackathon-backend'), 'project', 3, '2024-01-16', false, false, 7),
  ((SELECT id FROM skill WHERE code = 'pytest'),
   (SELECT id FROM project WHERE code = 'hackathon-backend'), 'project', 3, '2024-01-17', false, false, 8)
ON CONFLICT DO NOTHING;

-- Backend: Python
INSERT INTO skill_usages_translation (skill_usages_id, language_id, notes)
VALUES
  ((SELECT su.id FROM skill_usages su
    JOIN skill s ON s.id = su.skill_id
    WHERE s.code = 'python'
      AND su.source_id = (SELECT id FROM project WHERE code = 'hackathon-backend')
      AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'),
   'Lenguaje principal del backend. Usado para toda la lógica de negocio, orquestación del agente de IA, procesamiento de datos y definición de la API REST.'),
  ((SELECT su.id FROM skill_usages su
    JOIN skill s ON s.id = su.skill_id
    WHERE s.code = 'python'
      AND su.source_id = (SELECT id FROM project WHERE code = 'hackathon-backend')
      AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'),
   'Main backend language. Used for all business logic, AI agent orchestration, data processing, and REST API definition.');

-- Backend: FastAPI
INSERT INTO skill_usages_translation (skill_usages_id, language_id, notes)
VALUES
  ((SELECT su.id FROM skill_usages su
    JOIN skill s ON s.id = su.skill_id
    WHERE s.code = 'fastapi'
      AND su.source_id = (SELECT id FROM project WHERE code = 'hackathon-backend')
      AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'),
   'Framework web de alto rendimiento utilizado para construir la API REST. Aprovecha async/await, validación automática con Pydantic y documentación OpenAPI generada automáticamente.'),
  ((SELECT su.id FROM skill_usages su
    JOIN skill s ON s.id = su.skill_id
    WHERE s.code = 'fastapi'
      AND su.source_id = (SELECT id FROM project WHERE code = 'hackathon-backend')
      AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'),
   'High-performance web framework used to build the REST API. Leverages async/await, automatic validation with Pydantic, and auto-generated OpenAPI documentation.');

-- Backend: LangChain
INSERT INTO skill_usages_translation (skill_usages_id, language_id, notes)
VALUES
  ((SELECT su.id FROM skill_usages su
    JOIN skill s ON s.id = su.skill_id
    WHERE s.code = 'langchain'
      AND su.source_id = (SELECT id FROM project WHERE code = 'hackathon-backend')
      AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'),
   'Framework de orquestación de LLMs utilizado para construir las cadenas de prompts, gestionar la memoria conversacional y conectar el modelo de lenguaje con el vector store.'),
  ((SELECT su.id FROM skill_usages su
    JOIN skill s ON s.id = su.skill_id
    WHERE s.code = 'langchain'
      AND su.source_id = (SELECT id FROM project WHERE code = 'hackathon-backend')
      AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'),
   'LLM orchestration framework used to build prompt chains, manage conversational memory, and connect the language model with the vector store.');

-- Backend: OpenAI
INSERT INTO skill_usages_translation (skill_usages_id, language_id, notes)
VALUES
  ((SELECT su.id FROM skill_usages su
    JOIN skill s ON s.id = su.skill_id
    WHERE s.code = 'openai'
      AND su.source_id = (SELECT id FROM project WHERE code = 'hackathon-backend')
      AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'),
   'Proveedor de modelos de lenguaje (GPT) y embeddings utilizado como motor principal del agente conversacional para generar respuestas inteligentes y contextuales.'),
  ((SELECT su.id FROM skill_usages su
    JOIN skill s ON s.id = su.skill_id
    WHERE s.code = 'openai'
      AND su.source_id = (SELECT id FROM project WHERE code = 'hackathon-backend')
      AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'),
   'Language model (GPT) and embeddings provider used as the main engine of the conversational agent to generate intelligent and contextual responses.');

-- Backend: PostgreSQL
INSERT INTO skill_usages_translation (skill_usages_id, language_id, notes)
VALUES
  ((SELECT su.id FROM skill_usages su
    JOIN skill s ON s.id = su.skill_id
    WHERE s.code = 'postgresql'
      AND su.source_id = (SELECT id FROM project WHERE code = 'hackathon-backend')
      AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'),
   'Base de datos relacional utilizada para persistencia de datos estructurados del proyecto, configuraciones y metadatos del agente.'),
  ((SELECT su.id FROM skill_usages su
    JOIN skill s ON s.id = su.skill_id
    WHERE s.code = 'postgresql'
      AND su.source_id = (SELECT id FROM project WHERE code = 'hackathon-backend')
      AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'),
   'Relational database used for structured data persistence, project configurations, and agent metadata.');

-- Backend: ChromaDB
INSERT INTO skill_usages_translation (skill_usages_id, language_id, notes)
VALUES
  ((SELECT su.id FROM skill_usages su
    JOIN skill s ON s.id = su.skill_id
    WHERE s.code = 'chromadb'
      AND su.source_id = (SELECT id FROM project WHERE code = 'hackathon-backend')
      AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'),
   'Base de datos vectorial utilizada para almacenar embeddings de documentos y realizar búsquedas semánticas por similitud para el pipeline RAG del agente.'),
  ((SELECT su.id FROM skill_usages su
    JOIN skill s ON s.id = su.skill_id
    WHERE s.code = 'chromadb'
      AND su.source_id = (SELECT id FROM project WHERE code = 'hackathon-backend')
      AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'),
   'Vector database used to store document embeddings and perform semantic similarity searches for the agent RAG pipeline.');

-- Backend: SQL
INSERT INTO skill_usages_translation (skill_usages_id, language_id, notes)
VALUES
  ((SELECT su.id FROM skill_usages su
    JOIN skill s ON s.id = su.skill_id
    WHERE s.code = 'sql'
      AND su.source_id = (SELECT id FROM project WHERE code = 'hackathon-backend')
      AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'),
   'Consultas SQL para gestión de datos, migraciones de esquemas y operaciones CRUD sobre la base de datos PostgreSQL.'),
  ((SELECT su.id FROM skill_usages su
    JOIN skill s ON s.id = su.skill_id
    WHERE s.code = 'sql'
      AND su.source_id = (SELECT id FROM project WHERE code = 'hackathon-backend')
      AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'),
   'SQL queries for data management, schema migrations, and CRUD operations on the PostgreSQL database.');

-- Backend: Pytest
INSERT INTO skill_usages_translation (skill_usages_id, language_id, notes)
VALUES
  ((SELECT su.id FROM skill_usages su
    JOIN skill s ON s.id = su.skill_id
    WHERE s.code = 'pytest'
      AND su.source_id = (SELECT id FROM project WHERE code = 'hackathon-backend')
      AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'),
   'Framework de testing utilizado para escribir y ejecutar pruebas unitarias y de integración del backend, con fixtures y parametrización.'),
  ((SELECT su.id FROM skill_usages su
    JOIN skill s ON s.id = su.skill_id
    WHERE s.code = 'pytest'
      AND su.source_id = (SELECT id FROM project WHERE code = 'hackathon-backend')
      AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'),
   'Testing framework used to write and run backend unit and integration tests, with fixtures and parameterization.');

-- === Frontend skills ===
INSERT INTO skill_usages (skill_id, source_id, source_type, level, started_at, is_archived, is_pinned, position)
VALUES
  ((SELECT id FROM skill WHERE code = 'angular'),
   (SELECT id FROM project WHERE code = 'hackathon-frontend'), 'project', 4, '2024-01-15', false, true, 1),
  ((SELECT id FROM skill WHERE code = 'typescript'),
   (SELECT id FROM project WHERE code = 'hackathon-frontend'), 'project', 4, '2024-01-15', false, true, 2),
  ((SELECT id FROM skill WHERE code = 'tailwindcss'),
   (SELECT id FROM project WHERE code = 'hackathon-frontend'), 'project', 3, '2024-01-15', false, true, 3),
  ((SELECT id FROM skill WHERE code = 'html_css'),
   (SELECT id FROM project WHERE code = 'hackathon-frontend'), 'project', 4, '2024-01-15', false, false, 4)
ON CONFLICT DO NOTHING;

-- Frontend: Angular
INSERT INTO skill_usages_translation (skill_usages_id, language_id, notes)
VALUES
  ((SELECT su.id FROM skill_usages su
    JOIN skill s ON s.id = su.skill_id
    WHERE s.code = 'angular'
      AND su.source_id = (SELECT id FROM project WHERE code = 'hackathon-frontend')
      AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'),
   'Framework frontend utilizado para construir la interfaz de usuario tipo chat. Implementa componentes reactivos, servicios HTTP para comunicación con el backend y routing.'),
  ((SELECT su.id FROM skill_usages su
    JOIN skill s ON s.id = su.skill_id
    WHERE s.code = 'angular'
      AND su.source_id = (SELECT id FROM project WHERE code = 'hackathon-frontend')
      AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'),
   'Frontend framework used to build the chat-like user interface. Implements reactive components, HTTP services for backend communication, and routing.');

-- Frontend: TypeScript
INSERT INTO skill_usages_translation (skill_usages_id, language_id, notes)
VALUES
  ((SELECT su.id FROM skill_usages su
    JOIN skill s ON s.id = su.skill_id
    WHERE s.code = 'typescript'
      AND su.source_id = (SELECT id FROM project WHERE code = 'hackathon-frontend')
      AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'),
   'Lenguaje tipado utilizado en toda la aplicación Angular. Proporciona seguridad de tipos, interfaces bien definidas y mejor mantenibilidad del código.'),
  ((SELECT su.id FROM skill_usages su
    JOIN skill s ON s.id = su.skill_id
    WHERE s.code = 'typescript'
      AND su.source_id = (SELECT id FROM project WHERE code = 'hackathon-frontend')
      AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'),
   'Typed language used throughout the Angular application. Provides type safety, well-defined interfaces, and better code maintainability.');

-- Frontend: TailwindCSS
INSERT INTO skill_usages_translation (skill_usages_id, language_id, notes)
VALUES
  ((SELECT su.id FROM skill_usages su
    JOIN skill s ON s.id = su.skill_id
    WHERE s.code = 'tailwindcss'
      AND su.source_id = (SELECT id FROM project WHERE code = 'hackathon-frontend')
      AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'),
   'Framework de CSS utility-first utilizado para estilizar la interfaz del chat de forma rápida y responsiva, con configuración personalizada en tailwind.config.js.'),
  ((SELECT su.id FROM skill_usages su
    JOIN skill s ON s.id = su.skill_id
    WHERE s.code = 'tailwindcss'
      AND su.source_id = (SELECT id FROM project WHERE code = 'hackathon-frontend')
      AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'),
   'Utility-first CSS framework used to style the chat interface quickly and responsively, with custom configuration in tailwind.config.js.');

-- Frontend: HTML/CSS
INSERT INTO skill_usages_translation (skill_usages_id, language_id, notes)
VALUES
  ((SELECT su.id FROM skill_usages su
    JOIN skill s ON s.id = su.skill_id
    WHERE s.code = 'html_css'
      AND su.source_id = (SELECT id FROM project WHERE code = 'hackathon-frontend')
      AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'),
   'Maquetación y estilos base de la aplicación web, templates de componentes Angular y estructura semántica del DOM.'),
  ((SELECT su.id FROM skill_usages su
    JOIN skill s ON s.id = su.skill_id
    WHERE s.code = 'html_css'
      AND su.source_id = (SELECT id FROM project WHERE code = 'hackathon-frontend')
      AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'),
   'Base layout and styling of the web application, Angular component templates, and semantic DOM structure.');

COMMIT;
