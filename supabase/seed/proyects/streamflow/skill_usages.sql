-- ============================================================
-- StreamFlow Music - Skill Usages & Translations
-- ============================================================
-- Skills are deduplicated: cross-cutting on root, specific on children.
BEGIN;

-- ============================================================
-- ROOT: streamflow-music (cross-cutting skills)
-- ============================================================
INSERT INTO skill_usages (skill_id, source_id, source_type, level, started_at, is_pinned, position)
VALUES
  ((SELECT id FROM skill WHERE code = 'docker'),             (SELECT id FROM project WHERE code = 'streamflow-music'), 'project', 3, '2025-01-01', false, 1),
  ((SELECT id FROM skill WHERE code = 'supabase'),           (SELECT id FROM project WHERE code = 'streamflow-music'), 'project', 3, '2025-01-01', false, 2),
  ((SELECT id FROM skill WHERE code = 'clean_architecture'), (SELECT id FROM project WHERE code = 'streamflow-music'), 'project', 4, '2025-01-01', true,  3),
  ((SELECT id FROM skill WHERE code = 'sonarqube'),          (SELECT id FROM project WHERE code = 'streamflow-music'), 'project', 3, '2025-01-01', false, 4),
  ((SELECT id FROM skill WHERE code = 'github_actions'),     (SELECT id FROM project WHERE code = 'streamflow-music'), 'project', 3, '2025-01-01', false, 5),
  ((SELECT id FROM skill WHERE code = 'scrum'),              (SELECT id FROM project WHERE code = 'streamflow-music'), 'project', 4, '2025-01-01', true,  6),
  ((SELECT id FROM skill WHERE code = 'agile'),              (SELECT id FROM project WHERE code = 'streamflow-music'), 'project', 4, '2025-01-01', true,  7)
ON CONFLICT DO NOTHING;

-- Root translations
INSERT INTO skill_usages_translation (skill_usages_id, language_id, notes)
VALUES
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'docker') AND su.source_id = (SELECT id FROM project WHERE code = 'streamflow-music') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Orquestación de contenedores para la aplicación full-stack con docker-compose para despliegue multi-servicio.'),
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'docker') AND su.source_id = (SELECT id FROM project WHERE code = 'streamflow-music') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Container orchestration for the full-stack application with docker-compose for multi-service deployment.'),

  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'supabase') AND su.source_id = (SELECT id FROM project WHERE code = 'streamflow-music') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Instancia compartida de Supabase para autenticación, base de datos y almacenamiento consumida por backend y frontend.'),
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'supabase') AND su.source_id = (SELECT id FROM project WHERE code = 'streamflow-music') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Shared Supabase instance providing authentication, database, and storage services consumed by both backend and frontend.'),

  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'clean_architecture') AND su.source_id = (SELECT id FROM project WHERE code = 'streamflow-music') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Patrón arquitectónico aplicado consistentemente en backend (Django) y frontend (Angular), con separación clara de capas.'),
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'clean_architecture') AND su.source_id = (SELECT id FROM project WHERE code = 'streamflow-music') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Architectural pattern consistently applied across both backend (Django) and frontend (Angular), with clear layer separation.'),

  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'sonarqube') AND su.source_id = (SELECT id FROM project WHERE code = 'streamflow-music') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Análisis de calidad de código centralizado con proyectos SonarCloud separados para backend y frontend, quality gates unificados.'),
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'sonarqube') AND su.source_id = (SELECT id FROM project WHERE code = 'streamflow-music') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Centralized code quality analysis with separate SonarCloud projects for backend and frontend, unified quality gates.'),

  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'github_actions') AND su.source_id = (SELECT id FROM project WHERE code = 'streamflow-music') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Pipelines de integración continua para ambos codebases con tests automáticos y análisis de calidad.'),
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'github_actions') AND su.source_id = (SELECT id FROM project WHERE code = 'streamflow-music') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Continuous integration pipelines for both codebases with automated tests and quality analysis.'),

  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'scrum') AND su.source_id = (SELECT id FROM project WHERE code = 'streamflow-music') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Marco Scrum completo: Sprint Planning, Daily Stand-ups, Sprint Review, Retrospective, priorización MoSCoW y Burn Down Charts.'),
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'scrum') AND su.source_id = (SELECT id FROM project WHERE code = 'streamflow-music') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Full Scrum framework: Sprint Planning, Daily Stand-ups, Sprint Review, Retrospective, MoSCoW prioritization, and Burn Down Charts.'),

  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'agile') AND su.source_id = (SELECT id FROM project WHERE code = 'streamflow-music') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Desarrollo ágil con tablero Kanban completo, límites WIP, Definition of Done y entrega incremental de valor por sprints.'),
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'agile') AND su.source_id = (SELECT id FROM project WHERE code = 'streamflow-music') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Agile development with complete Kanban board, WIP limits, Definition of Done, and incremental value delivery per sprint.')
ON CONFLICT (skill_usages_id, language_id) DO NOTHING;

-- ============================================================
-- BACKEND: streamflow-music-backend
-- ============================================================
INSERT INTO skill_usages (skill_id, source_id, source_type, level, started_at, is_pinned, position)
VALUES
  ((SELECT id FROM skill WHERE code = 'python'),   (SELECT id FROM project WHERE code = 'streamflow-music-backend'), 'project', 4, '2025-01-01', true,  1),
  ((SELECT id FROM skill WHERE code = 'django'),   (SELECT id FROM project WHERE code = 'streamflow-music-backend'), 'project', 4, '2025-01-01', true,  2),
  ((SELECT id FROM skill WHERE code = 'drf'),      (SELECT id FROM project WHERE code = 'streamflow-music-backend'), 'project', 4, '2025-01-01', true,  3),
  ((SELECT id FROM skill WHERE code = 'postgresql'),(SELECT id FROM project WHERE code = 'streamflow-music-backend'), 'project', 3, '2025-01-01', false, 4),
  ((SELECT id FROM skill WHERE code = 'pytest'),   (SELECT id FROM project WHERE code = 'streamflow-music-backend'), 'project', 4, '2025-01-01', false, 5),
  ((SELECT id FROM skill WHERE code = 'rest_api'), (SELECT id FROM project WHERE code = 'streamflow-music-backend'), 'project', 4, '2025-01-01', false, 6)
ON CONFLICT DO NOTHING;

INSERT INTO skill_usages_translation (skill_usages_id, language_id, notes)
VALUES
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'python') AND su.source_id = (SELECT id FROM project WHERE code = 'streamflow-music-backend') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Lenguaje principal del backend para entidades de dominio, casos de uso, servicios y operaciones asíncronas con AsyncMock en tests.'),
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'python') AND su.source_id = (SELECT id FROM project WHERE code = 'streamflow-music-backend') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Primary backend language for domain entities, use cases, services, and async operations with AsyncMock in tests.'),

  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'django') AND su.source_id = (SELECT id FROM project WHERE code = 'streamflow-music-backend') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Framework web que impulsa la API REST con settings modulares (base, database, auth, REST framework, Supabase, Jazzmin admin).'),
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'django') AND su.source_id = (SELECT id FROM project WHERE code = 'streamflow-music-backend') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Web framework powering the REST API with modular settings (base, database, auth, REST framework, Supabase, Jazzmin admin).'),

  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'drf') AND su.source_id = (SELECT id FROM project WHERE code = 'streamflow-music-backend') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'ViewSets, serializadores, DTOs con drf-spectacular, FilteredViewSetMixin, CRUDViewSetMixin y endpoints paginados.'),
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'drf') AND su.source_id = (SELECT id FROM project WHERE code = 'streamflow-music-backend') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'ViewSets, serializers, DTOs with drf-spectacular, FilteredViewSetMixin, CRUDViewSetMixin, and paginated endpoints.'),

  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'postgresql') AND su.source_id = (SELECT id FROM project WHERE code = 'streamflow-music-backend') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Base de datos principal gestionada a través de Supabase para canciones, artistas, álbumes, géneros, playlists y perfiles.'),
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'postgresql') AND su.source_id = (SELECT id FROM project WHERE code = 'streamflow-music-backend') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Primary database managed through Supabase for songs, artists, albums, genres, playlists, and user profiles.'),

  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'pytest') AND su.source_id = (SELECT id FROM project WHERE code = 'streamflow-music-backend') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Más de 474 tests unitarios con pytest-asyncio, Mock/AsyncMock, tests de DTOs, lógica de casos de uso y validación de dominio. Cobertura XML para SonarCloud.'),
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'pytest') AND su.source_id = (SELECT id FROM project WHERE code = 'streamflow-music-backend') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), '474+ unit tests with pytest-asyncio, Mock/AsyncMock, DTO tests, use case logic tests, and domain validation. XML coverage for SonarCloud.'),

  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'rest_api') AND su.source_id = (SELECT id FROM project WHERE code = 'streamflow-music-backend') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Endpoints RESTful para canciones, artistas, álbumes, géneros, playlists y perfiles con documentación drf-spectacular.'),
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'rest_api') AND su.source_id = (SELECT id FROM project WHERE code = 'streamflow-music-backend') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'RESTful endpoints for songs, artists, albums, genres, playlists, and profiles with drf-spectacular documentation.')
ON CONFLICT (skill_usages_id, language_id) DO NOTHING;

-- ============================================================
-- FRONTEND: streamflow-music-frontend
-- ============================================================
INSERT INTO skill_usages (skill_id, source_id, source_type, level, started_at, is_pinned, position)
VALUES
  ((SELECT id FROM skill WHERE code = 'typescript'), (SELECT id FROM project WHERE code = 'streamflow-music-frontend'), 'project', 4, '2025-01-01', true,  1),
  ((SELECT id FROM skill WHERE code = 'angular'),    (SELECT id FROM project WHERE code = 'streamflow-music-frontend'), 'project', 4, '2025-01-01', true,  2),
  ((SELECT id FROM skill WHERE code = 'scss'),        (SELECT id FROM project WHERE code = 'streamflow-music-frontend'), 'project', 3, '2025-01-01', false, 3),
  ((SELECT id FROM skill WHERE code = 'ngrx'),        (SELECT id FROM project WHERE code = 'streamflow-music-frontend'), 'project', 3, '2025-01-01', false, 4),
  ((SELECT id FROM skill WHERE code = 'html_css'),    (SELECT id FROM project WHERE code = 'streamflow-music-frontend'), 'project', 4, '2025-01-01', false, 5),
  ((SELECT id FROM skill WHERE code = 'leaflet'),     (SELECT id FROM project WHERE code = 'streamflow-music-frontend'), 'project', 3, '2025-01-01', false, 6)
ON CONFLICT DO NOTHING;

INSERT INTO skill_usages_translation (skill_usages_id, language_id, notes)
VALUES
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'typescript') AND su.source_id = (SELECT id FROM project WHERE code = 'streamflow-music-frontend') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Tipado fuerte con interfaces, inyección de dependencias con inject(), signals de Angular para estado reactivo y flujo de datos basado en Observables.'),
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'typescript') AND su.source_id = (SELECT id FROM project WHERE code = 'streamflow-music-frontend') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Strong typing with interfaces, dependency injection via inject(), Angular signals for reactive state, and Observable-based data flow.'),

  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'angular') AND su.source_id = (SELECT id FROM project WHERE code = 'streamflow-music-frontend') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Angular 19+ con standalone components, signals, ChangeDetectionStrategy.OnPush, directivas personalizadas (ThemeDirective), interceptores HTTP y SSR.'),
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'angular') AND su.source_id = (SELECT id FROM project WHERE code = 'streamflow-music-frontend') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Angular 19+ with standalone components, signals, ChangeDetectionStrategy.OnPush, custom directives (ThemeDirective), HTTP interceptors, and SSR.'),

  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'scss') AND su.source_id = (SELECT id FROM project WHERE code = 'streamflow-music-frontend') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Estilos con variables SCSS, sistema de módulos (@use, @forward), integración de temas dinámicos con Material Design y layouts responsivos.'),
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'scss') AND su.source_id = (SELECT id FROM project WHERE code = 'streamflow-music-frontend') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Styling with SCSS variables, module system (@use, @forward), dynamic theming integration with Material Design, and responsive layouts.'),

  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'ngrx') AND su.source_id = (SELECT id FROM project WHERE code = 'streamflow-music-frontend') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Gestión de estado reactivo con signals de Angular para el reproductor global y servicios de la aplicación.'),
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'ngrx') AND su.source_id = (SELECT id FROM project WHERE code = 'streamflow-music-frontend') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Reactive state management with Angular signals for the global player and application services.'),

  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'html_css') AND su.source_id = (SELECT id FROM project WHERE code = 'streamflow-music-frontend') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Templates Angular con HTML semántico, componentes para reproductor de música, playlists, biblioteca, autenticación y resultados de búsqueda.'),
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'html_css') AND su.source_id = (SELECT id FROM project WHERE code = 'streamflow-music-frontend') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Angular templates with semantic HTML, components for music player, playlists, library, authentication, and search results.'),

  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'leaflet') AND su.source_id = (SELECT id FROM project WHERE code = 'streamflow-music-frontend') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'es'), 'Mapas interactivos para exploración de contenido musical con marcadores y capas personalizadas.'),
  ((SELECT su.id FROM skill_usages su WHERE su.skill_id = (SELECT id FROM skill WHERE code = 'leaflet') AND su.source_id = (SELECT id FROM project WHERE code = 'streamflow-music-frontend') AND su.source_type = 'project'),
   (SELECT id FROM language WHERE code = 'en'), 'Interactive maps for music content exploration with custom markers and layers.')
ON CONFLICT (skill_usages_id, language_id) DO NOTHING;

COMMIT;
