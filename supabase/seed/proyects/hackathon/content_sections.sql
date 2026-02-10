-- ============================================================
-- Hackathon Agent AI - Content Sections & Translations
-- ============================================================
-- Architectural children merged as content_sections on parent.
-- All icons: Material Icons lowercase.
-- ============================================================
BEGIN;

-- =========================================
-- Root project (hackathon-agent-ai): 5 sections
-- =========================================
INSERT INTO content_section (entity_type, entity_id, section_key, icon, position, is_archived, is_pinned)
VALUES
  ('project', (SELECT id FROM project WHERE code = 'hackathon-agent-ai'), 'overview',       'info',         1, false, true),
  ('project', (SELECT id FROM project WHERE code = 'hackathon-agent-ai'), 'architecture',   'account_tree', 2, false, true),
  ('project', (SELECT id FROM project WHERE code = 'hackathon-agent-ai'), 'how_it_works',   'route',        3, false, false),
  ('project', (SELECT id FROM project WHERE code = 'hackathon-agent-ai'), 'infrastructure', 'settings',     4, false, false),
  ('project', (SELECT id FROM project WHERE code = 'hackathon-agent-ai'), 'challenges',     'warning',      5, false, false)
ON CONFLICT DO NOTHING;

INSERT INTO content_section_translation (content_section_id, language_id, title, body)
VALUES
  -- Root: overview
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'hackathon-agent-ai') AND cs.section_key = 'overview' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Descripción General',
   E'Proyecto fullstack desarrollado en 48 horas durante una hackathon que implementa un agente de inteligencia artificial conversacional con capacidades de Retrieval-Augmented Generation (RAG).\n\nEl sistema permite a los usuarios cargar documentos en una base de conocimiento vectorial y luego hacer preguntas en lenguaje natural. El agente busca la información más relevante entre los documentos cargados, la inyecta como contexto al modelo de lenguaje, y genera respuestas precisas y fundamentadas en la documentación proporcionada.\n\nCombina un backend Python/FastAPI con un frontend Angular, conectados mediante una API REST que transmite las interacciones con el agente en tiempo real.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'hackathon-agent-ai') AND cs.section_key = 'overview' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Overview',
   E'Fullstack project developed in 48 hours during a hackathon that implements a conversational AI agent with Retrieval-Augmented Generation (RAG) capabilities.\n\nThe system allows users to upload documents to a vector knowledge base and then ask questions in natural language. The agent searches for the most relevant information among uploaded documents, injects it as context to the language model, and generates precise answers grounded in the provided documentation.\n\nIt combines a Python/FastAPI backend with an Angular frontend, connected via a REST API that transmits agent interactions in real time.'),

  -- Root: architecture
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'hackathon-agent-ai') AND cs.section_key = 'architecture' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Arquitectura',
   E'Arquitectura de microservicios con separación clara de responsabilidades:\n\n• **API REST (FastAPI):** Capa de entrada que recibe mensajes del usuario, gestiona el historial conversacional y expone endpoints de ingesta de documentos\n• **Orquestación de LLM (LangChain):** Motor que construye cadenas de prompts, gestiona la memoria conversacional y coordina la comunicación entre el modelo de lenguaje y el vector store\n• **Vector Store (ChromaDB):** Almacenamiento persistente de embeddings generados por OpenAI, con búsqueda por similitud semántica para recuperar contexto relevante\n• **Frontend (Angular SPA):** Interfaz de usuario tipo chat que consume la API REST y presenta las respuestas del agente en tiempo real\n\nLa comunicación entre componentes es exclusivamente vía HTTP/JSON, permitiendo escalamiento independiente de cada servicio.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'hackathon-agent-ai') AND cs.section_key = 'architecture' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Architecture',
   E'Microservices architecture with clear separation of responsibilities:\n\n• **REST API (FastAPI):** Entry layer that receives user messages, manages conversational history, and exposes document ingestion endpoints\n• **LLM Orchestration (LangChain):** Engine that builds prompt chains, manages conversational memory, and coordinates communication between the language model and the vector store\n• **Vector Store (ChromaDB):** Persistent storage of embeddings generated by OpenAI, with semantic similarity search to retrieve relevant context\n• **Frontend (Angular SPA):** Chat-like user interface that consumes the REST API and presents agent responses in real time\n\nCommunication between components is exclusively via HTTP/JSON, enabling independent scaling of each service.'),

  -- Root: how_it_works
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'hackathon-agent-ai') AND cs.section_key = 'how_it_works' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Cómo Funciona',
   E'El pipeline RAG sigue un flujo de 6 pasos:\n\n1. **Carga de documentos** — El usuario sube archivos a través de la API\n2. **Fragmentación** — Los documentos se dividen en chunks manejables para el modelo\n3. **Generación de embeddings** — Cada chunk se transforma en un vector numérico usando OpenAI Embeddings\n4. **Almacenamiento** — Los vectores se persisten en ChromaDB para búsquedas posteriores\n5. **Recuperación** — Cuando el usuario hace una pregunta, se buscan los chunks más similares semánticamente\n6. **Generación** — Los chunks recuperados se inyectan como contexto en el prompt del LLM, que genera una respuesta fundamentada\n\nLa memoria conversacional de LangChain mantiene el historial de la sesión, permitiendo al agente hacer referencia a mensajes anteriores y mantener coherencia en diálogos extensos.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'hackathon-agent-ai') AND cs.section_key = 'how_it_works' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'How It Works',
   E'The RAG pipeline follows a 6-step flow:\n\n1. **Document upload** — The user uploads files through the API\n2. **Chunking** — Documents are split into manageable chunks for the model\n3. **Embedding generation** — Each chunk is transformed into a numerical vector using OpenAI Embeddings\n4. **Storage** — Vectors are persisted in ChromaDB for subsequent searches\n5. **Retrieval** — When the user asks a question, the most semantically similar chunks are found\n6. **Generation** — Retrieved chunks are injected as context into the LLM prompt, which generates a grounded response\n\nLangChain''s conversational memory maintains the session history, allowing the agent to reference previous messages and maintain coherence across extended dialogues.'),

  -- Root: infrastructure
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'hackathon-agent-ai') AND cs.section_key = 'infrastructure' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Infraestructura y Despliegue',
   E'Entorno completamente containerizado con Docker para garantizar portabilidad y reproducibilidad:\n\n• **Dockerfile multi-stage** para el backend que separa build y runtime, reduciendo el tamaño de la imagen final\n• **Variables de entorno** gestionadas con .env para API keys de OpenAI, configuración de ChromaDB y parámetros de la base de datos\n• **Docker Compose** que orquesta el backend, la base de datos PostgreSQL y ChromaDB como servicios independientes\n• **Gestión de dependencias** con requirements.txt y .dockerignore optimizado para excluir archivos innecesarios del build'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'hackathon-agent-ai') AND cs.section_key = 'infrastructure' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Infrastructure & Deployment',
   E'Fully containerized environment with Docker to ensure portability and reproducibility:\n\n• **Multi-stage Dockerfile** for the backend that separates build and runtime, reducing the final image size\n• **Environment variables** managed with .env for OpenAI API keys, ChromaDB configuration, and database parameters\n• **Docker Compose** orchestrating the backend, PostgreSQL database, and ChromaDB as independent services\n• **Dependency management** with requirements.txt and optimized .dockerignore to exclude unnecessary files from the build'),

  -- Root: challenges
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'hackathon-agent-ai') AND cs.section_key = 'challenges' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Desafíos y Aprendizajes',
   E'Optimizar la latencia del pipeline RAG fue el mayor desafío técnico: las llamadas a la API de OpenAI para embeddings y generación de respuestas añadían segundos de espera, resueltos parcialmente con cacheo de embeddings ya procesados y chunking eficiente de documentos.\n\nGestionar el contexto conversacional sin perder coherencia requirió ajustar la ventana de memoria de LangChain para balancear entre contexto suficiente y límites de tokens del modelo.\n\nCoordinar un equipo de desarrollo durante las 48 horas de la hackathon exigió definir interfaces claras entre frontend y backend desde el inicio, usando contratos de API documentados que permitieron trabajo paralelo efectivo.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'hackathon-agent-ai') AND cs.section_key = 'challenges' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Challenges & Learnings',
   E'Optimizing RAG pipeline latency was the biggest technical challenge: OpenAI API calls for embeddings and response generation added seconds of wait time, partially resolved with caching of already-processed embeddings and efficient document chunking.\n\nManaging conversational context without losing coherence required tuning LangChain''s memory window to balance between sufficient context and model token limits.\n\nCoordinating a development team during the 48-hour hackathon demanded defining clear frontend-backend interfaces from the start, using documented API contracts that enabled effective parallel work.')
ON CONFLICT (content_section_id, language_id) DO NOTHING;

-- =========================================
-- Backend (hackathon-backend): 6 sections
-- =========================================
INSERT INTO content_section (entity_type, entity_id, section_key, icon, position, is_archived, is_pinned)
VALUES
  ('project', (SELECT id FROM project WHERE code = 'hackathon-backend'), 'overview',     'info',         1, false, true),
  ('project', (SELECT id FROM project WHERE code = 'hackathon-backend'), 'stack',        'layers',       2, false, true),
  ('project', (SELECT id FROM project WHERE code = 'hackathon-backend'), 'endpoints',    'power',        3, false, false),
  ('project', (SELECT id FROM project WHERE code = 'hackathon-backend'), 'rag_pipeline', 'merge_type',   4, false, false),
  ('project', (SELECT id FROM project WHERE code = 'hackathon-backend'), 'testing',      'check_circle', 5, false, false),
  ('project', (SELECT id FROM project WHERE code = 'hackathon-backend'), 'challenges',   'warning',      6, false, false)
ON CONFLICT DO NOTHING;

INSERT INTO content_section_translation (content_section_id, language_id, title, body)
VALUES
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'hackathon-backend') AND cs.section_key = 'overview' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Descripción General',
   E'Servidor backend construido con Python y FastAPI que actúa como el cerebro del agente de IA. Expone endpoints REST para recibir mensajes del usuario, procesar documentos para la base de conocimiento, y devolver respuestas generadas por el LLM.\n\nInternamenta, integra LangChain para la orquestación de cadenas de prompts y gestión de memoria conversacional, OpenAI como proveedor de modelos de lenguaje y embeddings, y ChromaDB como vector store para búsqueda semántica.\n\nLa arquitectura interna sigue principios de Clean Architecture con separación en capas: api (controllers), application (servicios), domain (entidades y lógica de negocio), infrastructure (implementaciones concretas) y DTOs para contratos de datos.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'hackathon-backend') AND cs.section_key = 'overview' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Overview',
   E'Backend server built with Python and FastAPI that acts as the brain of the AI agent. It exposes REST endpoints to receive user messages, process documents for the knowledge base, and return LLM-generated responses.\n\nInternally, it integrates LangChain for prompt chain orchestration and conversational memory management, OpenAI as the language model and embeddings provider, and ChromaDB as the vector store for semantic search.\n\nThe internal architecture follows Clean Architecture principles with layer separation: api (controllers), application (services), domain (entities and business logic), infrastructure (concrete implementations), and DTOs for data contracts.'),

  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'hackathon-backend') AND cs.section_key = 'stack' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Stack Tecnológico',
   E'**Runtime:** Python 3.11+ con uvicorn como servidor ASGI de alto rendimiento\n**Framework:** FastAPI con validación automática mediante Pydantic y documentación OpenAPI generada\n**IA/ML:** LangChain para orquestación de LLMs, OpenAI API (GPT + Embeddings), ChromaDB para almacenamiento vectorial\n**Base de datos:** PostgreSQL para datos estructurados, ChromaDB para embeddings\n**Testing:** pytest con fixtures, parametrización y mocks para aislamiento de dependencias'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'hackathon-backend') AND cs.section_key = 'stack' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Tech Stack',
   E'**Runtime:** Python 3.11+ with uvicorn as high-performance ASGI server\n**Framework:** FastAPI with automatic Pydantic validation and generated OpenAPI documentation\n**AI/ML:** LangChain for LLM orchestration, OpenAI API (GPT + Embeddings), ChromaDB for vector storage\n**Database:** PostgreSQL for structured data, ChromaDB for embeddings\n**Testing:** pytest with fixtures, parameterization, and mocks for dependency isolation'),

  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'hackathon-backend') AND cs.section_key = 'endpoints' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'API y Endpoints',
   E'La API REST está organizada con APIRouter de FastAPI, donde cada dominio funcional tiene su propio router con prefijos y tags para documentación automática:\n\n• `POST /chat` — Envía un mensaje al agente y recibe la respuesta generada con contexto RAG\n• `GET /health` — Health check del servicio y estado de conexiones (DB, ChromaDB, OpenAI)\n• `POST /documents` — Ingesta documentos en el vector store: los fragmenta, genera embeddings y los almacena en ChromaDB\n• `GET /history` — Recupera el historial conversacional de la sesión actual\n\nTodos los DTOs de request/response están validados con Pydantic, generando esquemas OpenAPI automáticamente.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'hackathon-backend') AND cs.section_key = 'endpoints' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'API & Endpoints',
   E'The REST API is organized with FastAPI APIRouter, where each functional domain has its own router with prefixes and tags for auto-documentation:\n\n• `POST /chat` — Sends a message to the agent and receives the generated response with RAG context\n• `GET /health` — Service health check and connection status (DB, ChromaDB, OpenAI)\n• `POST /documents` — Ingests documents into the vector store: chunks them, generates embeddings, and stores them in ChromaDB\n• `GET /history` — Retrieves the conversational history of the current session\n\nAll request/response DTOs are validated with Pydantic, automatically generating OpenAPI schemas.'),

  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'hackathon-backend') AND cs.section_key = 'rag_pipeline' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Pipeline RAG y Vector Store',
   E'El pipeline de Retrieval-Augmented Generation es el componente central del agente:\n\n1. **Ingesta:** Los documentos son fragmentados en chunks de tamaño configurable con overlap para mantener contexto entre fragmentos\n2. **Embedding:** Cada chunk se transforma en un vector de alta dimensionalidad usando el modelo de embeddings de OpenAI\n3. **Almacenamiento:** Los vectores se persisten en ChromaDB con metadatos del documento original (nombre, página, posición)\n4. **Recuperación:** Las preguntas del usuario se convierten en embeddings y se buscan los K chunks más similares por distancia coseno\n5. **Generación:** Los chunks recuperados se inyectan como contexto en el system prompt de GPT, que genera respuestas fundamentadas\n\nLangChain gestiona la memoria conversacional con ventana deslizante, permitiendo al agente referenciar mensajes anteriores sin desbordar el límite de tokens.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'hackathon-backend') AND cs.section_key = 'rag_pipeline' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'RAG Pipeline & Vector Store',
   E'The Retrieval-Augmented Generation pipeline is the agent''s central component:\n\n1. **Ingestion:** Documents are chunked into configurable-size fragments with overlap to maintain context between chunks\n2. **Embedding:** Each chunk is transformed into a high-dimensional vector using OpenAI''s embedding model\n3. **Storage:** Vectors are persisted in ChromaDB with original document metadata (name, page, position)\n4. **Retrieval:** User questions are converted to embeddings and the K most similar chunks are found by cosine distance\n5. **Generation:** Retrieved chunks are injected as context into GPT''s system prompt, which generates grounded responses\n\nLangChain manages conversational memory with a sliding window, allowing the agent to reference previous messages without exceeding the token limit.'),

  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'hackathon-backend') AND cs.section_key = 'testing' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Testing y Calidad',
   E'Suite de pruebas con pytest que valida la lógica del agente, endpoints de la API y el pipeline RAG:\n\n• **Tests unitarios** para servicios y utilidades con fixtures y parametrización\n• **Tests de integración** para endpoints usando TestClient de FastAPI que verifican flujos completos de request/response\n• **Tests de tipos** con mypy para validación estática del código\n• **Mocks de servicios externos** (OpenAI, ChromaDB) para tests aislados y reproducibles sin dependencia de APIs externas'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'hackathon-backend') AND cs.section_key = 'testing' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Testing & Quality',
   E'Test suite with pytest that validates agent logic, API endpoints, and the RAG pipeline:\n\n• **Unit tests** for services and utilities with fixtures and parameterization\n• **Integration tests** for endpoints using FastAPI TestClient that verify complete request/response flows\n• **Type tests** with mypy for static code validation\n• **External service mocks** (OpenAI, ChromaDB) for isolated and reproducible tests without external API dependency'),

  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'hackathon-backend') AND cs.section_key = 'challenges' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Desafíos del Backend',
   E'Manejar concurrencia asíncrona con FastAPI requirió diseñar cuidadosamente los servicios para evitar race conditions en el acceso al vector store y la base de datos, especialmente durante ingestas simultáneas de documentos.\n\nConfigurar correctamente las cadenas de LangChain para mantener coherencia contextual sin superar los límites de tokens del modelo fue un proceso iterativo de ajuste del tamaño de ventana de memoria y la cantidad de chunks recuperados.\n\nMantener tiempos de respuesta aceptables con llamadas síncronas a la API de OpenAI se resolvió con patrones async/await y procesamiento paralelo de embeddings durante la ingesta.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'hackathon-backend') AND cs.section_key = 'challenges' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Backend Challenges',
   E'Handling async concurrency with FastAPI required carefully designing services to avoid race conditions on vector store and database access, especially during simultaneous document ingestions.\n\nProperly configuring LangChain chains to maintain contextual coherence without exceeding model token limits was an iterative process of tuning memory window size and the number of retrieved chunks.\n\nKeeping acceptable response times with synchronous OpenAI API calls was solved with async/await patterns and parallel embedding processing during ingestion.')
ON CONFLICT (content_section_id, language_id) DO NOTHING;

-- =========================================
-- Frontend (hackathon-frontend): 3 sections
-- =========================================
INSERT INTO content_section (entity_type, entity_id, section_key, icon, position, is_archived, is_pinned)
VALUES
  ('project', (SELECT id FROM project WHERE code = 'hackathon-frontend'), 'overview', 'info',            1, false, true),
  ('project', (SELECT id FROM project WHERE code = 'hackathon-frontend'), 'features', 'star',            2, false, false),
  ('project', (SELECT id FROM project WHERE code = 'hackathon-frontend'), 'ux',       'desktop_windows', 3, false, false)
ON CONFLICT DO NOTHING;

INSERT INTO content_section_translation (content_section_id, language_id, title, body)
VALUES
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'hackathon-frontend') AND cs.section_key = 'overview' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Descripción General',
   E'SPA desarrollada con Angular y estilizada con TailwindCSS que proporciona una interfaz de usuario tipo chat para interactuar con el agente de IA conversacional.\n\nLa aplicación permite a los usuarios escribir preguntas en lenguaje natural, visualizar las respuestas del agente con formato enriquecido, cargar documentos a la base de conocimiento, y navegar por el historial de conversaciones anteriores.\n\nImplementa componentes reactivos con servicios HTTP para comunicación con el backend, manejo de estados de carga/error, y diseño responsivo que se adapta a dispositivos móviles y desktop.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'hackathon-frontend') AND cs.section_key = 'overview' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Overview',
   E'SPA built with Angular and styled with TailwindCSS providing a chat-like user interface to interact with the conversational AI agent.\n\nThe application allows users to write questions in natural language, view agent responses with rich formatting, upload documents to the knowledge base, and browse through previous conversation history.\n\nIt implements reactive components with HTTP services for backend communication, loading/error state management, and responsive design that adapts to mobile and desktop devices.'),

  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'hackathon-frontend') AND cs.section_key = 'features' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Funcionalidades',
   E'• Interfaz conversacional con burbujas de chat diferenciadas para usuario y agente\n• Indicador de carga animado mientras el agente procesa la respuesta\n• Carga de documentos con drag-and-drop para alimentar la base de conocimiento\n• Historial de conversaciones navegable con búsqueda\n• Formato enriquecido de respuestas del agente (markdown, listas, código)\n• Diseño responsivo con TailwindCSS para móvil y desktop'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'hackathon-frontend') AND cs.section_key = 'features' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Features',
   E'• Conversational interface with differentiated chat bubbles for user and agent\n• Animated loading indicator while the agent processes the response\n• Document upload with drag-and-drop to feed the knowledge base\n• Browsable conversation history with search\n• Rich formatting of agent responses (markdown, lists, code)\n• Responsive design with TailwindCSS for mobile and desktop'),

  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'hackathon-frontend') AND cs.section_key = 'ux' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Experiencia de Usuario',
   E'La interfaz está diseñada para ser intuitiva y minimalista, inspirada en aplicaciones de chat populares. Las burbujas de mensajes diferencian visualmente al usuario (derecha) del agente (izquierda) con colores y estilos distintos.\n\nEl soporte de tema oscuro/claro se adapta automáticamente a las preferencias del sistema operativo. El diseño responsivo con TailwindCSS garantiza una experiencia consistente en cualquier tamaño de pantalla, con un layout optimizado para escritorios que muestra el historial en un panel lateral.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'hackathon-frontend') AND cs.section_key = 'ux' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'User Experience',
   E'The interface is designed to be intuitive and minimalist, inspired by popular chat applications. Message bubbles visually differentiate the user (right) from the agent (left) with distinct colors and styles.\n\nDark/light theme support automatically adapts to operating system preferences. Responsive TailwindCSS design ensures a consistent experience at any screen size, with a desktop-optimized layout showing history in a side panel.')
ON CONFLICT (content_section_id, language_id) DO NOTHING;

COMMIT;
