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
