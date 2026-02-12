-- ============================================================
-- Hackathon Agent AI - Projects & Translations
-- ============================================================
BEGIN;

-- Root project (linked to hackathon competition)
INSERT INTO project (code, url, created_at, source_id, source_type, is_archived, is_pinned, position)
VALUES ('hackathon-agent-ai', 'https://github.com/StevSant/hackiaton-agent-ai-backend', '2025-08-10',
        (SELECT id FROM competitions WHERE code = 'hackiathon_viamatica_2025'), 'competitions',
        false, true, 1)
ON CONFLICT (code) DO NOTHING;

INSERT INTO project_translation (project_id, language_id, title, description)
VALUES
  ((SELECT id FROM project WHERE code = 'hackathon-agent-ai'), (SELECT id FROM language WHERE code = 'es'),
   'Hackathon Agent AI',
   'Proyecto fullstack desarrollado durante una hackathon que implementa un agente de inteligencia artificial conversacional. '
   || 'Combina un backend en Python con FastAPI y LangChain para procesamiento de lenguaje natural, '
   || 'un pipeline RAG (Retrieval-Augmented Generation) con ChromaDB como vector store, '
   || 'y un frontend moderno en Angular con TailwindCSS. '
   || 'El agente es capaz de responder preguntas contextuales utilizando documentos cargados en la base de conocimiento vectorial.'),
  ((SELECT id FROM project WHERE code = 'hackathon-agent-ai'), (SELECT id FROM language WHERE code = 'en'),
   'Hackathon Agent AI',
   'Fullstack project developed during a hackathon that implements a conversational artificial intelligence agent. '
   || 'It combines a Python backend with FastAPI and LangChain for natural language processing, '
   || 'a RAG (Retrieval-Augmented Generation) pipeline with ChromaDB as vector store, '
   || 'and a modern Angular frontend with TailwindCSS. '
   || 'The agent is capable of answering contextual questions using documents loaded into the vector knowledge base.')
ON CONFLICT (project_id, language_id) DO NOTHING;

-- Backend (real child)
INSERT INTO project (code, url, created_at, parent_project_id, source_id, source_type, is_archived, is_pinned, position)
VALUES ('hackathon-backend', NULL, '2025-08-10',
        (SELECT id FROM project WHERE code = 'hackathon-agent-ai'), NULL, NULL, false, true, 1)
ON CONFLICT (code) DO NOTHING;

INSERT INTO project_translation (project_id, language_id, title, description)
VALUES
  ((SELECT id FROM project WHERE code = 'hackathon-backend'), (SELECT id FROM language WHERE code = 'es'),
   'Backend - Agent AI',
   'Servidor backend construido con Python y FastAPI que expone una API REST para interactuar con el agente de IA. '
   || 'Incluye integración con OpenAI, LangChain para orquestación de cadenas de prompts, '
   || 'ChromaDB para almacenamiento y búsqueda vectorial, y una arquitectura limpia con separación en capas: '
   || 'api, application, domain, infrastructure y DTOs.'),
  ((SELECT id FROM project WHERE code = 'hackathon-backend'), (SELECT id FROM language WHERE code = 'en'),
   'Backend - Agent AI',
   'Backend server built with Python and FastAPI exposing a REST API to interact with the AI agent. '
   || 'Includes integration with OpenAI, LangChain for prompt chain orchestration, '
   || 'ChromaDB for vector storage and search, and a clean architecture with layer separation: '
   || 'api, application, domain, infrastructure, and DTOs.')
ON CONFLICT (project_id, language_id) DO NOTHING;

-- Frontend (real child)
INSERT INTO project (code, url, created_at, parent_project_id, source_id, source_type, is_archived, is_pinned, position)
VALUES ('hackathon-frontend', NULL, '2025-08-10',
        (SELECT id FROM project WHERE code = 'hackathon-agent-ai'), NULL, NULL, false, true, 2)
ON CONFLICT (code) DO NOTHING;

INSERT INTO project_translation (project_id, language_id, title, description)
VALUES
  ((SELECT id FROM project WHERE code = 'hackathon-frontend'), (SELECT id FROM language WHERE code = 'es'),
   'Frontend - Agent AI',
   'Aplicación frontend desarrollada con Angular y estilizada con TailwindCSS. '
   || 'Proporciona una interfaz de usuario tipo chat para interactuar con el agente de IA, '
   || 'permitiendo a los usuarios hacer preguntas y recibir respuestas contextuales en tiempo real. '
   || 'Implementa diseño responsivo y componentes reutilizables.'),
  ((SELECT id FROM project WHERE code = 'hackathon-frontend'), (SELECT id FROM language WHERE code = 'en'),
   'Frontend - Agent AI',
   'Frontend application developed with Angular and styled with TailwindCSS. '
   || 'Provides a chat-like user interface to interact with the AI agent, '
   || 'allowing users to ask questions and receive contextual answers in real time. '
   || 'Implements responsive design and reusable components.')
ON CONFLICT (project_id, language_id) DO NOTHING;

COMMIT;
