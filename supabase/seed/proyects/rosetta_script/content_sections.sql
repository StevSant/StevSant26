-- ============================================================
-- Rosetta Stone Script A - Content Sections & Translations
-- ============================================================
-- Curated: 6 high-value sections covering the project holistically.
-- All icons: Material Symbols Outlined (lowercase).
-- ============================================================
BEGIN;

INSERT INTO content_section (entity_type, entity_id, section_key, icon, position, is_archived, is_pinned)
VALUES
  ('project', (SELECT id FROM project WHERE code = 'rosseta-stone-script-a'), 'overview',     'info',         1, false, true),
  ('project', (SELECT id FROM project WHERE code = 'rosseta-stone-script-a'), 'features',     'bolt',         2, false, false),
  ('project', (SELECT id FROM project WHERE code = 'rosseta-stone-script-a'), 'architecture', 'construction', 3, false, true),
  ('project', (SELECT id FROM project WHERE code = 'rosseta-stone-script-a'), 'tech_stack',   'build',        4, false, false),
  ('project', (SELECT id FROM project WHERE code = 'rosseta-stone-script-a'), 'how_it_works', 'sync',         5, false, false),
  ('project', (SELECT id FROM project WHERE code = 'rosseta-stone-script-a'), 'challenges',   'extension',    6, false, false)
ON CONFLICT DO NOTHING;

INSERT INTO content_section_translation (content_section_id, language_id, title, body)
VALUES
  -- overview
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND cs.section_key = 'overview' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Descripción General',
   'Bot de automatización que completa lecciones de **Rosetta Stone Foundations** de forma programática. En lugar de interactuar manualmente con cada ejercicio, el bot captura tokens de sesión mediante interceptación de tráfico de red y envía puntuaciones directamente a las APIs de Rosetta Stone (GraphQL + REST).'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND cs.section_key = 'overview' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Overview',
   'Automation bot that programmatically completes **Rosetta Stone Foundations** lessons. Instead of manually interacting with each exercise, the bot captures session tokens via network traffic interception and submits scores directly to Rosetta Stone APIs (GraphQL + REST).'),
  -- features
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND cs.section_key = 'features' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Características Principales',
   E'- **Automatización completa**: login → navegación → captura de sesión → completación masiva\n- **Concurrencia controlada**: hasta 50 paths simultáneos con asyncio.Semaphore\n- **Simulación realista**: tiempos y puntajes con variaciones aleatorias para imitar comportamiento humano\n- **Filtrado configurable**: seleccionar unidades, lecciones y tipos de path específicos\n- **Reportes automáticos**: generación de reportes con estadísticas y análisis histórico\n- **Debug integrado**: dumps de texto, metadata y screenshots para diagnóstico'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND cs.section_key = 'features' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Key Features',
   E'- **Full automation**: login → navigation → session capture → bulk completion\n- **Controlled concurrency**: up to 50 simultaneous paths with asyncio.Semaphore\n- **Realistic simulation**: times and scores with random variations to mimic human behavior\n- **Configurable filtering**: select specific units, lessons and path types\n- **Automatic reports**: report generation with statistics and historical analysis\n- **Integrated debug**: text dumps, metadata and screenshots for diagnostics'),
  -- architecture
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND cs.section_key = 'architecture' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Arquitectura',
   E'Implementa **Arquitectura Hexagonal (Ports & Adapters)** con 5 capas:\n\nPresentation (CLI, DI Factory)\n    \u2514\u2500\u2500 Application (Use Cases, Services, Orchestrators, Ports)\n        \u2514\u2500\u2500 Domain (Entities, Constants)\n        \u2514\u2500\u2500 Infrastructure (Adapters, Logging, Settings)\n    \u2514\u2500\u2500 Shared (Mixins, Utils)\n\nCada capa tiene responsabilidades claras y las dependencias apuntan hacia el dominio.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND cs.section_key = 'architecture' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Architecture',
   E'Implements **Hexagonal Architecture (Ports & Adapters)** with 5 layers:\n\nPresentation (CLI, DI Factory)\n    \u2514\u2500\u2500 Application (Use Cases, Services, Orchestrators, Ports)\n        \u2514\u2500\u2500 Domain (Entities, Constants)\n        \u2514\u2500\u2500 Infrastructure (Adapters, Logging, Settings)\n    \u2514\u2500\u2500 Shared (Mixins, Utils)\n\nEach layer has clear responsibilities and dependencies point toward the domain.'),
  -- tech_stack
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND cs.section_key = 'tech_stack' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Stack Tecnológico',
   'Python 3.14, Playwright, Pydantic Settings, asyncio, logging (dictConfig).'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND cs.section_key = 'tech_stack' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Tech Stack',
   'Python 3.14, Playwright, Pydantic Settings, asyncio, logging (dictConfig).'),
  -- how_it_works
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND cs.section_key = 'how_it_works' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Cómo Funciona',
   E'7 pasos: Login → Navegación al dashboard → Captura de sesión (tokens JWT/session) → Obtención del curso vía GraphQL → Filtrado de contenido → Completación masiva con concurrencia → Reporte de resultados.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND cs.section_key = 'how_it_works' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'How It Works',
   E'7 steps: Login → Dashboard navigation → Session capture (JWT/session tokens) → Course fetch via GraphQL → Content filtering → Bulk completion with concurrency → Results report.'),
  -- challenges
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND cs.section_key = 'challenges' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Desafíos Técnicos',
   'Ingeniería inversa de APIs (REST XML + GraphQL), simulación de comportamiento humano con tiempos y scores aleatorios, gestión de sesión con interceptación de red, concurrencia segura con semáforos asyncio.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND cs.section_key = 'challenges' AND cs.entity_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Technical Challenges',
   'API reverse engineering (REST XML + GraphQL), human behavior simulation with random times and scores, session handling with network interception, safe concurrency with asyncio semaphores.')
ON CONFLICT (content_section_id, language_id) DO NOTHING;

COMMIT;
