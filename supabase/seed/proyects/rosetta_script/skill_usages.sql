-- ============================================================
-- Rosetta Stone Script A - Skill Usages & Translations
-- ============================================================
-- All 21 children are architectural → NO skill_usages.
-- Cross-cutting skills collapsed to ROOT only (8 skills).
-- ============================================================
BEGIN;

-- === ROOT: rosseta-stone-script-a (8 skills) ===
INSERT INTO skill_usages (skill_id, source_id, source_type, level, started_at, is_pinned, position)
VALUES
  ((SELECT id FROM skill WHERE code = 'python'),             (SELECT id FROM project WHERE code = 'rosseta-stone-script-a'), 'project', 4, '2025-01-26', true,  1),
  ((SELECT id FROM skill WHERE code = 'playwright'),         (SELECT id FROM project WHERE code = 'rosseta-stone-script-a'), 'project', 4, '2025-01-26', true,  2),
  ((SELECT id FROM skill WHERE code = 'pydantic'),           (SELECT id FROM project WHERE code = 'rosseta-stone-script-a'), 'project', 3, '2025-01-26', false, 3),
  ((SELECT id FROM skill WHERE code = 'clean_architecture'), (SELECT id FROM project WHERE code = 'rosseta-stone-script-a'), 'project', 4, '2025-01-26', true,  4),
  ((SELECT id FROM skill WHERE code = 'web_scraping'),       (SELECT id FROM project WHERE code = 'rosseta-stone-script-a'), 'project', 3, '2025-01-26', false, 5),
  ((SELECT id FROM skill WHERE code = 'rest_api'),           (SELECT id FROM project WHERE code = 'rosseta-stone-script-a'), 'project', 3, '2025-01-26', false, 6),
  ((SELECT id FROM skill WHERE code = 'graphql'),            (SELECT id FROM project WHERE code = 'rosseta-stone-script-a'), 'project', 3, '2025-01-26', false, 7)
ON CONFLICT DO NOTHING;

-- Translations
INSERT INTO skill_usages_translation (skill_usages_id, language_id, notes)
VALUES
  -- python
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'python') AND su.source_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'),
   'Python 3.14 con tipado estricto, dataclasses, ABC, asyncio, typing avanzado. Proyecto completo en Python puro sin frameworks web.'),
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'python') AND su.source_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'),
   'Python 3.14 with strict typing, dataclasses, ABC, asyncio, advanced typing. Full project in pure Python without web frameworks.'),

  -- playwright
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'playwright') AND su.source_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'),
   'Herramienta principal de automatización. Browser automation end-to-end con interceptación de red, APIRequestContext para peticiones HTTP directas.'),
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'playwright') AND su.source_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'),
   'Main automation tool. End-to-end browser automation with network interception, APIRequestContext for direct HTTP requests.'),

  -- pydantic
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'pydantic') AND su.source_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'),
   'Pydantic Settings para toda la configuración del proyecto: BaseSettings con SettingsConfigDict, @field_validator para parseo de CSV desde .env.'),
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'pydantic') AND su.source_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'),
   'Pydantic Settings for all project configuration: BaseSettings with SettingsConfigDict, @field_validator for CSV parsing from .env.'),

  -- clean_architecture
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'clean_architecture') AND su.source_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'),
   'Arquitectura hexagonal completa con 5 capas: Domain, Application, Infrastructure, Presentation, Shared. Ports & Adapters, DependencyFactory para DI manual.'),
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'clean_architecture') AND su.source_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'),
   'Full hexagonal architecture with 5 layers: Domain, Application, Infrastructure, Presentation, Shared. Ports & Adapters, DependencyFactory for manual DI.'),

  -- web_scraping
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'web_scraping') AND su.source_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'),
   'Automatización web completa: login, navegación, intercepción de tráfico de red, extracción de tokens de sesión desde headers y query strings.'),
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'web_scraping') AND su.source_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'),
   'Complete web automation: login, navigation, network traffic interception, session token extraction from headers and query strings.'),

  -- rest_api
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'rest_api') AND su.source_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'),
   'Consumo de API REST de Rosetta Stone con body XML y headers personalizados de protocolo para actualización de puntuaciones.'),
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'rest_api') AND su.source_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'),
   'Rosetta Stone REST API consumption with XML body and custom protocol headers for score updates.'),

  -- graphql
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'graphql') AND su.source_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'),
   'Consumo de API GraphQL de Rosetta Stone para obtener estructura completa del curso con token JWT de autorización.'),
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'graphql') AND su.source_id = (SELECT id FROM project WHERE code = 'rosseta-stone-script-a') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'),
   'Rosetta Stone GraphQL API consumption to fetch complete course structure with JWT authorization token.')
ON CONFLICT (skill_usages_id, language_id) DO NOTHING;

COMMIT;
