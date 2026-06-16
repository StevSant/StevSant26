-- ============================================================
-- APPLY LIVE — HackIAthon 2026 (1st place) + Centinela IA
-- Paste this whole file into the Supabase Dashboard > SQL Editor and Run.
-- The SQL Editor runs with elevated rights, bypassing the RLS write policy.
-- Safe to run once. Re-running may duplicate translation/skill rows.
-- ============================================================

-- ---- 1. Competition (2026) ----
-- HackIAthon 2026 — Viamatica (2nd edition) — 1st place
-- ================================================

INSERT INTO competitions (code, organizer, date, is_archived, is_pinned, position)
VALUES (
  'hackiathon_viamatica_2026',
  'Viamatica',
  '2026-06-15',
  false,
  true,
  1
);

INSERT INTO competitions_translation (
  competitions_id,
  language_id,
  name,
  description,
  result
)
VALUES
-- ESPAÑOL
(
  (SELECT id FROM competitions WHERE code = 'hackiathon_viamatica_2026'),
  (SELECT id FROM language WHERE code = 'es'),
  'HackIAthon 2026 – Detección de Fraude con IA',
  'Segunda edición del HackIAthon organizado por Viamatica, esta vez en el reto de Aseguradora del Sur. Tras obtener el 3er lugar en la primera edición, regresé junto al equipo 404 Not Founders y desarrollamos Centinela IA, una plataforma de IA híbrida y explicable para detectar posibles fraudes en siniestros de seguros, combinando reglas de negocio, machine learning y un agente conversacional. El proyecto fue presentado en el Pitch Day final ante un jurado especializado y obtuvo el primer lugar de la edición 2026.',
  'Primer lugar 🥇 – Edición 2026'
),
-- ENGLISH
(
  (SELECT id FROM competitions WHERE code = 'hackiathon_viamatica_2026'),
  (SELECT id FROM language WHERE code = 'en'),
  'HackIAthon 2026 – AI Fraud Detection',
  'Second edition of the HackIAthon organized by Viamatica, this time tackling the Aseguradora del Sur challenge. After placing 3rd in the first edition, I returned with team 404 Not Founders and we built Centinela IA, an explainable hybrid-AI platform to detect possible fraud in insurance claims, combining business rules, machine learning, and a conversational agent. The project was presented at the final Pitch Day before a professional jury and won 1st place in the 2026 edition.',
  '1st place 🥇 – 2026 edition'
);

-- ---- 2. Project tree ----
-- ============================================================
-- Centinela IA (HackIAthon 2026, 1st place) - Projects & Translations
-- ============================================================
BEGIN;

-- Root project (linked to the 2026 hackathon competition)
INSERT INTO project (code, url, created_at, source_id, source_type, is_archived, is_pinned, position)
VALUES ('centinela-ia', 'https://github.com/StevSant/hackiaton_agent_ai_3.0', '2026-05-26',
        (SELECT id FROM competitions WHERE code = 'hackiathon_viamatica_2026'), 'competitions',
        false, true, 1)
ON CONFLICT (code) DO NOTHING;

INSERT INTO project_translation (project_id, language_id, title, description)
VALUES
  ((SELECT id FROM project WHERE code = 'centinela-ia'), (SELECT id FROM language WHERE code = 'es'),
   'Centinela IA',
   'Plataforma de IA híbrida y explicable, ganadora del 1er lugar del hackIAthon 2026 (reto de Aseguradora del Sur), '
   || 'que detecta posibles fraudes en siniestros de seguros. '
   || 'Calcula un score de riesgo 0-100 combinando 21 reglas de negocio, un clasificador LightGBM con explicabilidad SHAP, '
   || 'detección de anomalías con IsolationForest y similitud narrativa con embeddings sobre pgvector, '
   || 'clasificando cada caso en un semáforo verde/amarillo/rojo. '
   || 'Incluye un agente conversacional con LangGraph que responde preguntas en lenguaje natural citando los siniestros y reglas involucradas, '
   || 'y un panel multiagente donde cuatro especialistas LLM debaten cada caso. '
   || 'Toda alerta es de "posible fraude" y la decisión final es siempre humana.'),
  ((SELECT id FROM project WHERE code = 'centinela-ia'), (SELECT id FROM language WHERE code = 'en'),
   'Centinela IA',
   'Explainable hybrid-AI platform, winner of 1st place at hackIAthon 2026 (Aseguradora del Sur challenge), '
   || 'that detects possible fraud in insurance claims. '
   || 'It computes a 0-100 risk score combining 21 business rules, a LightGBM classifier with SHAP explainability, '
   || 'IsolationForest anomaly detection, and narrative similarity using embeddings over pgvector, '
   || 'triaging each case into a green/yellow/red traffic-light system. '
   || 'It includes a LangGraph conversational agent that answers natural-language questions citing the claims and rules involved, '
   || 'and a multi-agent panel where four LLM specialists debate each case. '
   || 'Every alert is a "possible fraud" flag and the final decision is always human.')
ON CONFLICT (project_id, language_id) DO NOTHING;

-- Backend (real child)
INSERT INTO project (code, url, created_at, parent_project_id, source_id, source_type, is_archived, is_pinned, position)
VALUES ('centinela-backend', 'https://github.com/StevSant/hackiaton_agent_ai_3.0_backend', '2026-05-26',
        (SELECT id FROM project WHERE code = 'centinela-ia'), NULL, NULL, false, true, 1)
ON CONFLICT (code) DO NOTHING;

INSERT INTO project_translation (project_id, language_id, title, description)
VALUES
  ((SELECT id FROM project WHERE code = 'centinela-backend'), (SELECT id FROM language WHERE code = 'es'),
   'Backend - Centinela IA',
   'Backend en Python con FastAPI que expone la API REST y el streaming SSE del agente. '
   || 'Implementa el motor de scoring (21 reglas FS/RF), el agente analista de siniestros con LangGraph '
   || 'y un puerto de LLM agnóstico al proveedor, la capa de ML (LightGBM + SHAP, IsolationForest) '
   || 'y la similitud narrativa con embeddings sobre PostgreSQL + pgvector (índice HNSW), '
   || 'siguiendo Clean Architecture con separación en capas: api, application, domain e infrastructure.'),
  ((SELECT id FROM project WHERE code = 'centinela-backend'), (SELECT id FROM language WHERE code = 'en'),
   'Backend - Centinela IA',
   'Python backend with FastAPI exposing the REST API and the agent SSE streaming. '
   || 'Implements the scoring engine (21 FS/RF rules), the LangGraph claims-analyst agent '
   || 'with a provider-agnostic LLM port, the ML layer (LightGBM + SHAP, IsolationForest), '
   || 'and narrative similarity with embeddings over PostgreSQL + pgvector (HNSW index), '
   || 'following Clean Architecture with layer separation: api, application, domain, and infrastructure.')
ON CONFLICT (project_id, language_id) DO NOTHING;

-- Frontend (real child)
INSERT INTO project (code, url, created_at, parent_project_id, source_id, source_type, is_archived, is_pinned, position)
VALUES ('centinela-frontend', 'https://github.com/StevSant/hackiaton_agent_ai_3.0_frontend', '2026-05-26',
        (SELECT id FROM project WHERE code = 'centinela-ia'), NULL, NULL, false, true, 2)
ON CONFLICT (code) DO NOTHING;

INSERT INTO project_translation (project_id, language_id, title, description)
VALUES
  ((SELECT id FROM project WHERE code = 'centinela-frontend'), (SELECT id FROM language WHERE code = 'es'),
   'Frontend - Centinela IA',
   'Aplicación Angular 21 (componentes standalone + signals) estilizada con TailwindCSS. '
   || 'Ofrece el triage de siniestros con semáforo verde/amarillo/rojo, el detalle explicable de cada caso '
   || '(reglas activadas, factores SHAP, narrativas similares), el chat con el agente consumiendo eventos SSE con citas, '
   || 'el panel multiagente en vivo y el workflow de revisión antifraude de cinco estados.'),
  ((SELECT id FROM project WHERE code = 'centinela-frontend'), (SELECT id FROM language WHERE code = 'en'),
   'Frontend - Centinela IA',
   'Angular 21 application (standalone components + signals) styled with TailwindCSS. '
   || 'Provides claim triage with a green/yellow/red traffic-light system, the explainable detail of each case '
   || '(rules fired, SHAP factors, similar narratives), the agent chat consuming SSE events with citations, '
   || 'the live multi-agent panel, and the five-state antifraud review workflow.')
ON CONFLICT (project_id, language_id) DO NOTHING;

COMMIT;

-- ---- 3. Skill usages ----
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

-- ---- 4. Content sections ----
-- ============================================================
-- Centinela IA - Content Sections & Translations
-- All icons: Material Icons lowercase.
-- ============================================================
BEGIN;

INSERT INTO content_section (entity_type, entity_id, section_key, icon, position, is_archived, is_pinned)
VALUES
  ('project', (SELECT id FROM project WHERE code = 'centinela-ia'), 'overview',     'info',         1, false, true),
  ('project', (SELECT id FROM project WHERE code = 'centinela-ia'), 'architecture', 'account_tree', 2, false, true),
  ('project', (SELECT id FROM project WHERE code = 'centinela-ia'), 'how_it_works', 'route',        3, false, false),
  ('project', (SELECT id FROM project WHERE code = 'centinela-ia'), 'challenges',   'warning',      4, false, false)
ON CONFLICT DO NOTHING;

INSERT INTO content_section_translation (content_section_id, language_id, title, body)
VALUES
  -- overview
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'centinela-ia') AND cs.section_key = 'overview' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Descripción General',
   E'Centinela IA es la entrega ganadora del 1er lugar del **hackIAthon 2026** (Viamatica), en el reto de **Aseguradora del Sur**, desarrollada por el equipo **404 Not Founders**.\n\nEs un prototipo funcional de IA híbrida y explicable que detecta **posibles fraudes** en siniestros de seguros. Ingiere siniestros, pólizas, asegurados, proveedores y documentos, y para cada caso genera un **score de riesgo 0-100** y una clasificación en semáforo 🟢 verde / 🟡 amarillo / 🔴 rojo.\n\nEl sistema nunca acusa: genera **alertas de revisión** y la decisión final es siempre humana.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'centinela-ia') AND cs.section_key = 'overview' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Overview',
   E'Centinela IA is the 1st-place winning entry of **hackIAthon 2026** (Viamatica), for the **Aseguradora del Sur** challenge, built by team **404 Not Founders**.\n\nIt is a functional explainable hybrid-AI prototype that detects **possible fraud** in insurance claims. It ingests claims, policies, policyholders, providers, and documents, and for each case it produces a **0-100 risk score** and a 🟢 green / 🟡 yellow / 🔴 red traffic-light classification.\n\nThe system never accuses: it raises **review alerts** and the final decision is always human.'),

  -- architecture
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'centinela-ia') AND cs.section_key = 'architecture' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Arquitectura',
   E'Arquitectura limpia con separación clara de responsabilidades:\n\n• **Frontend (Angular 21):** triage, detalle explicable, chat con el agente y panel multiagente, conectado por REST/SSE.\n• **API (FastAPI):** orquesta los casos de uso y expone el streaming SSE del agente.\n• **Dominio:** las 21 reglas de negocio (14 aditivas FS + 7 duras RF) y el cálculo del score.\n• **Agente (LangGraph):** grafo del analista de siniestros con nodos, herramientas y capa de citas.\n• **Infraestructura:** puerto de LLM agnóstico, ML (LightGBM/SHAP, IsolationForest), embeddings y vector store.\n• **Datos:** PostgreSQL + pgvector con índice HNSW para la similitud narrativa.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'centinela-ia') AND cs.section_key = 'architecture' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Architecture',
   E'Clean architecture with clear separation of responsibilities:\n\n• **Frontend (Angular 21):** triage, explainable detail, agent chat, and multi-agent panel, connected via REST/SSE.\n• **API (FastAPI):** orchestrates the use cases and exposes the agent SSE streaming.\n• **Domain:** the 21 business rules (14 additive FS + 7 hard RF) and the score computation.\n• **Agent (LangGraph):** claims-analyst graph with nodes, tools, and a citation layer.\n• **Infrastructure:** provider-agnostic LLM port, ML (LightGBM/SHAP, IsolationForest), embeddings, and vector store.\n• **Data:** PostgreSQL + pgvector with an HNSW index for narrative similarity.'),

  -- how_it_works
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'centinela-ia') AND cs.section_key = 'how_it_works' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Cómo Funciona',
   E'1. Se ingiere el dataset (siniestros, pólizas, asegurados, proveedores, documentos).\n2. El motor calcula el **score 0-100** combinando 21 reglas + clasificador LightGBM (SHAP), anomalía (IsolationForest) y similitud narrativa.\n3. Cada caso se clasifica en 🟢/🟡/🔴 y se enruta a la cola de revisión.\n4. El **agente conversacional** responde preguntas en lenguaje natural (p. ej. "¿por qué el siniestro X está en rojo?") **citando** los IDs y reglas que se activaron, vía SSE.\n5. El **panel multiagente** hace debatir a cuatro especialistas LLM y un moderador sintetiza el consenso (consultivo, nunca altera el score).\n6. Un **analista humano** confirma o descarta cada alerta en un workflow de cinco estados.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'centinela-ia') AND cs.section_key = 'how_it_works' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'How It Works',
   E'1. The dataset is ingested (claims, policies, policyholders, providers, documents).\n2. The engine computes the **0-100 score** combining 21 rules + a LightGBM classifier (SHAP), anomaly detection (IsolationForest), and narrative similarity.\n3. Each case is classified into 🟢/🟡/🔴 and routed to the review queue.\n4. The **conversational agent** answers natural-language questions (e.g. "why is claim X red?") **citing** the IDs and rules that fired, via SSE.\n5. The **multi-agent panel** has four LLM specialists debate, and a moderator synthesizes the consensus (advisory, never alters the score).\n6. A **human analyst** confirms or dismisses each alert in a five-state workflow.'),

  -- challenges
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'centinela-ia') AND cs.section_key = 'challenges' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Retos y Aprendizajes',
   E'• **Explicabilidad y ética (25% del puntaje):** todo resultado debe justificarse; las respuestas del agente citan reglas e IDs concretos y la revisión humana es obligatoria.\n• **Datos 100% sintéticos:** sin PII real, identificadores hasheados; la etiqueta de fraude solo se usa para entrenar, nunca se expone.\n• **Híbrido reglas + ML:** separar señales deterministas (reglas) de las probabilísticas (ML/anomalía) para mantener la trazabilidad.\n• **Tiempo:** construir un prototipo funcional end-to-end en pocos días, en equipo y con contratos cross-stack bien definidos.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'centinela-ia') AND cs.section_key = 'challenges' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Challenges & Learnings',
   E'• **Explainability and ethics (25% of the score):** every result must be justified; the agent answers cite concrete rules and IDs, and human review is mandatory.\n• **100% synthetic data:** no real PII, hashed identifiers; the fraud label is used only for training and never exposed.\n• **Hybrid rules + ML:** separating deterministic signals (rules) from probabilistic ones (ML/anomaly) to preserve traceability.\n• **Time:** building a functional end-to-end prototype in a few days, as a team, with well-defined cross-stack contracts.')
ON CONFLICT DO NOTHING;

COMMIT;
