-- ============================================================
-- Centinela IA - Skill Usages & Translations
-- ============================================================
-- Deduplication strategy:
--   Root: cross-cutting skills (docker, rest_api, clean_architecture)
--   Backend: python, fastapi, langchain, openai, postgresql, sql, pydantic, pytest
--   Frontend: angular, typescript, tailwindcss, html_css
-- ============================================================
BEGIN;

-- === Root project skills ===
INSERT INTO skill_usages (skill_id, source_id, source_type, level, started_at, is_archived, is_pinned, position)
VALUES
  ((SELECT id FROM skill WHERE code = 'docker'),
   (SELECT id FROM project WHERE code = 'centinela-ia'), 'project', 3, '2026-05-26', false, false, 1),
  ((SELECT id FROM skill WHERE code = 'rest_api'),
   (SELECT id FROM project WHERE code = 'centinela-ia'), 'project', 4, '2026-05-26', false, false, 2),
  ((SELECT id FROM skill WHERE code = 'clean_architecture'),
   (SELECT id FROM project WHERE code = 'centinela-ia'), 'project', 4, '2026-05-26', false, false, 3)
ON CONFLICT DO NOTHING;

INSERT INTO skill_usages_translation (skill_usages_id, language_id, notes)
VALUES
  ((SELECT su.id FROM skill_usages su JOIN skill s ON s.id = su.skill_id
    WHERE s.code = 'docker' AND su.source_id = (SELECT id FROM project WHERE code = 'centinela-ia') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'),
   'Containerización de Postgres + pgvector y del backend con Docker Compose para un entorno reproducible.'),
  ((SELECT su.id FROM skill_usages su JOIN skill s ON s.id = su.skill_id
    WHERE s.code = 'docker' AND su.source_id = (SELECT id FROM project WHERE code = 'centinela-ia') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'),
   'Containerization of Postgres + pgvector and the backend with Docker Compose for a reproducible environment.'),
  ((SELECT su.id FROM skill_usages su JOIN skill s ON s.id = su.skill_id
    WHERE s.code = 'rest_api' AND su.source_id = (SELECT id FROM project WHERE code = 'centinela-ia') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'),
   'API REST + streaming SSE entre el frontend Angular y el backend FastAPI, con contratos tipados generados desde OpenAPI.'),
  ((SELECT su.id FROM skill_usages su JOIN skill s ON s.id = su.skill_id
    WHERE s.code = 'rest_api' AND su.source_id = (SELECT id FROM project WHERE code = 'centinela-ia') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'),
   'REST API + SSE streaming between the Angular frontend and the FastAPI backend, with typed contracts generated from OpenAPI.'),
  ((SELECT su.id FROM skill_usages su JOIN skill s ON s.id = su.skill_id
    WHERE s.code = 'clean_architecture' AND su.source_id = (SELECT id FROM project WHERE code = 'centinela-ia') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'),
   'Arquitectura limpia con separación en capas: api, application, domain e infrastructure.'),
  ((SELECT su.id FROM skill_usages su JOIN skill s ON s.id = su.skill_id
    WHERE s.code = 'clean_architecture' AND su.source_id = (SELECT id FROM project WHERE code = 'centinela-ia') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'),
   'Clean architecture with layer separation: api, application, domain, and infrastructure.');

-- === Backend skills ===
INSERT INTO skill_usages (skill_id, source_id, source_type, level, started_at, is_archived, is_pinned, position)
VALUES
  ((SELECT id FROM skill WHERE code = 'python'),
   (SELECT id FROM project WHERE code = 'centinela-backend'), 'project', 5, '2026-05-26', false, true, 1),
  ((SELECT id FROM skill WHERE code = 'fastapi'),
   (SELECT id FROM project WHERE code = 'centinela-backend'), 'project', 4, '2026-05-26', false, true, 2),
  ((SELECT id FROM skill WHERE code = 'langchain'),
   (SELECT id FROM project WHERE code = 'centinela-backend'), 'project', 4, '2026-05-26', false, true, 3),
  ((SELECT id FROM skill WHERE code = 'openai'),
   (SELECT id FROM project WHERE code = 'centinela-backend'), 'project', 4, '2026-05-26', false, true, 4),
  ((SELECT id FROM skill WHERE code = 'postgresql'),
   (SELECT id FROM project WHERE code = 'centinela-backend'), 'project', 4, '2026-05-26', false, true, 5),
  ((SELECT id FROM skill WHERE code = 'pydantic'),
   (SELECT id FROM project WHERE code = 'centinela-backend'), 'project', 4, '2026-05-26', false, false, 6),
  ((SELECT id FROM skill WHERE code = 'sql'),
   (SELECT id FROM project WHERE code = 'centinela-backend'), 'project', 3, '2026-05-26', false, false, 7),
  ((SELECT id FROM skill WHERE code = 'pytest'),
   (SELECT id FROM project WHERE code = 'centinela-backend'), 'project', 3, '2026-05-26', false, false, 8)
ON CONFLICT DO NOTHING;

INSERT INTO skill_usages_translation (skill_usages_id, language_id, notes)
VALUES
  ((SELECT su.id FROM skill_usages su JOIN skill s ON s.id = su.skill_id
    WHERE s.code = 'python' AND su.source_id = (SELECT id FROM project WHERE code = 'centinela-backend') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'),
   'Lenguaje principal del backend: motor de reglas, capa de ML, orquestación del agente y generación del dataset sintético.'),
  ((SELECT su.id FROM skill_usages su JOIN skill s ON s.id = su.skill_id
    WHERE s.code = 'python' AND su.source_id = (SELECT id FROM project WHERE code = 'centinela-backend') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'),
   'Main backend language: rules engine, ML layer, agent orchestration, and synthetic dataset generation.'),
  ((SELECT su.id FROM skill_usages su JOIN skill s ON s.id = su.skill_id
    WHERE s.code = 'fastapi' AND su.source_id = (SELECT id FROM project WHERE code = 'centinela-backend') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'),
   'Framework de la API REST y del endpoint SSE del agente (POST /agent/query), con validación Pydantic y OpenAPI.'),
  ((SELECT su.id FROM skill_usages su JOIN skill s ON s.id = su.skill_id
    WHERE s.code = 'fastapi' AND su.source_id = (SELECT id FROM project WHERE code = 'centinela-backend') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'),
   'Framework for the REST API and the agent SSE endpoint (POST /agent/query), with Pydantic validation and OpenAPI.'),
  ((SELECT su.id FROM skill_usages su JOIN skill s ON s.id = su.skill_id
    WHERE s.code = 'langchain' AND su.source_id = (SELECT id FROM project WHERE code = 'centinela-backend') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'),
   'LangChain/LangGraph para el grafo del agente analista de siniestros: nodos, herramientas y las preguntas en lenguaje natural.'),
  ((SELECT su.id FROM skill_usages su JOIN skill s ON s.id = su.skill_id
    WHERE s.code = 'langchain' AND su.source_id = (SELECT id FROM project WHERE code = 'centinela-backend') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'),
   'LangChain/LangGraph for the claims-analyst agent graph: nodes, tools, and the natural-language questions.'),
  ((SELECT su.id FROM skill_usages su JOIN skill s ON s.id = su.skill_id
    WHERE s.code = 'openai' AND su.source_id = (SELECT id FROM project WHERE code = 'centinela-backend') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'),
   'Proveedor por defecto de LLM y embeddings, detrás de un puerto agnóstico que permite intercambiar el modelo.'),
  ((SELECT su.id FROM skill_usages su JOIN skill s ON s.id = su.skill_id
    WHERE s.code = 'openai' AND su.source_id = (SELECT id FROM project WHERE code = 'centinela-backend') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'),
   'Default LLM and embeddings provider, behind a provider-agnostic port that allows swapping the model.'),
  ((SELECT su.id FROM skill_usages su JOIN skill s ON s.id = su.skill_id
    WHERE s.code = 'postgresql' AND su.source_id = (SELECT id FROM project WHERE code = 'centinela-backend') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'),
   'Base de datos relacional con la extensión pgvector (índice HNSW) para la búsqueda de similitud narrativa.'),
  ((SELECT su.id FROM skill_usages su JOIN skill s ON s.id = su.skill_id
    WHERE s.code = 'postgresql' AND su.source_id = (SELECT id FROM project WHERE code = 'centinela-backend') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'),
   'Relational database with the pgvector extension (HNSW index) for narrative-similarity search.'),
  ((SELECT su.id FROM skill_usages su JOIN skill s ON s.id = su.skill_id
    WHERE s.code = 'pydantic' AND su.source_id = (SELECT id FROM project WHERE code = 'centinela-backend') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'),
   'Modelos Pydantic para las tablas del dominio y los contratos de la API, incluyendo el ChatStreamEvent del agente.'),
  ((SELECT su.id FROM skill_usages su JOIN skill s ON s.id = su.skill_id
    WHERE s.code = 'pydantic' AND su.source_id = (SELECT id FROM project WHERE code = 'centinela-backend') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'),
   'Pydantic models for the domain tables and API contracts, including the agent ChatStreamEvent.'),
  ((SELECT su.id FROM skill_usages su JOIN skill s ON s.id = su.skill_id
    WHERE s.code = 'sql' AND su.source_id = (SELECT id FROM project WHERE code = 'centinela-backend') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'),
   'Consultas SQL y migraciones Alembic, incluyendo la habilitación de pgvector y la consulta de vecinos más cercanos.'),
  ((SELECT su.id FROM skill_usages su JOIN skill s ON s.id = su.skill_id
    WHERE s.code = 'sql' AND su.source_id = (SELECT id FROM project WHERE code = 'centinela-backend') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'),
   'SQL queries and Alembic migrations, including enabling pgvector and the nearest-neighbor query.'),
  ((SELECT su.id FROM skill_usages su JOIN skill s ON s.id = su.skill_id
    WHERE s.code = 'pytest' AND su.source_id = (SELECT id FROM project WHERE code = 'centinela-backend') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'),
   'Pruebas con PyTest del motor de reglas, las herramientas del agente y los endpoints de la API.'),
  ((SELECT su.id FROM skill_usages su JOIN skill s ON s.id = su.skill_id
    WHERE s.code = 'pytest' AND su.source_id = (SELECT id FROM project WHERE code = 'centinela-backend') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'),
   'PyTest tests for the rules engine, the agent tools, and the API endpoints.');

-- === Frontend skills ===
INSERT INTO skill_usages (skill_id, source_id, source_type, level, started_at, is_archived, is_pinned, position)
VALUES
  ((SELECT id FROM skill WHERE code = 'angular'),
   (SELECT id FROM project WHERE code = 'centinela-frontend'), 'project', 4, '2026-05-26', false, true, 1),
  ((SELECT id FROM skill WHERE code = 'typescript'),
   (SELECT id FROM project WHERE code = 'centinela-frontend'), 'project', 4, '2026-05-26', false, true, 2),
  ((SELECT id FROM skill WHERE code = 'tailwindcss'),
   (SELECT id FROM project WHERE code = 'centinela-frontend'), 'project', 3, '2026-05-26', false, true, 3),
  ((SELECT id FROM skill WHERE code = 'html_css'),
   (SELECT id FROM project WHERE code = 'centinela-frontend'), 'project', 4, '2026-05-26', false, false, 4)
ON CONFLICT DO NOTHING;

INSERT INTO skill_usages_translation (skill_usages_id, language_id, notes)
VALUES
  ((SELECT su.id FROM skill_usages su JOIN skill s ON s.id = su.skill_id
    WHERE s.code = 'angular' AND su.source_id = (SELECT id FROM project WHERE code = 'centinela-frontend') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'),
   'Angular 21 con componentes standalone y signals: triage, detalle explicable, chat SSE y panel multiagente.'),
  ((SELECT su.id FROM skill_usages su JOIN skill s ON s.id = su.skill_id
    WHERE s.code = 'angular' AND su.source_id = (SELECT id FROM project WHERE code = 'centinela-frontend') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'),
   'Angular 21 with standalone components and signals: triage, explainable detail, SSE chat, and multi-agent panel.'),
  ((SELECT su.id FROM skill_usages su JOIN skill s ON s.id = su.skill_id
    WHERE s.code = 'typescript' AND su.source_id = (SELECT id FROM project WHERE code = 'centinela-frontend') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'),
   'TypeScript en toda la app, con tipos generados desde el OpenAPI del backend para contratos seguros.'),
  ((SELECT su.id FROM skill_usages su JOIN skill s ON s.id = su.skill_id
    WHERE s.code = 'typescript' AND su.source_id = (SELECT id FROM project WHERE code = 'centinela-frontend') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'),
   'TypeScript across the app, with types generated from the backend OpenAPI for safe contracts.'),
  ((SELECT su.id FROM skill_usages su JOIN skill s ON s.id = su.skill_id
    WHERE s.code = 'tailwindcss' AND su.source_id = (SELECT id FROM project WHERE code = 'centinela-frontend') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'),
   'TailwindCSS para una interfaz responsiva y el sistema visual del semáforo de riesgo verde/amarillo/rojo.'),
  ((SELECT su.id FROM skill_usages su JOIN skill s ON s.id = su.skill_id
    WHERE s.code = 'tailwindcss' AND su.source_id = (SELECT id FROM project WHERE code = 'centinela-frontend') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'),
   'TailwindCSS for a responsive interface and the green/yellow/red risk traffic-light visual system.'),
  ((SELECT su.id FROM skill_usages su JOIN skill s ON s.id = su.skill_id
    WHERE s.code = 'html_css' AND su.source_id = (SELECT id FROM project WHERE code = 'centinela-frontend') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'),
   'Maquetación semántica y accesible de los dashboards de triage, detalle de siniestros e insights.'),
  ((SELECT su.id FROM skill_usages su JOIN skill s ON s.id = su.skill_id
    WHERE s.code = 'html_css' AND su.source_id = (SELECT id FROM project WHERE code = 'centinela-frontend') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'),
   'Semantic, accessible layout of the triage, claim-detail, and insights dashboards.');

COMMIT;
