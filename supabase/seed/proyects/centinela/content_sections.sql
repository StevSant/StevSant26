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
