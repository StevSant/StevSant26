-- ============================================================================
-- 🔧 PREREQUISITOS: Verificar que existen languages y skills referenciados
-- ============================================================================

-- Asumimos:
-- language: 1 = 'en', 2 = 'es'
-- skills ya insertados con IDs conocidos (ver comentarios en cada skill_usage)

-- ============================================================================
-- 📁 PROJECTS
-- ============================================================================

-- Proyecto padre (monorepo)
INSERT INTO project (id, code, url, created_at, parent_project_id, source_id, source_type, is_archived, is_pinned, position)
VALUES
  (1, 'streamflow-music', 'https://github.com/StevSant/streamflow_music', '2025-01-01', NULL, NULL, NULL, false, true, 1);

-- Backend (hijo del monorepo)
INSERT INTO project (id, code, url, created_at, parent_project_id, source_id, source_type, is_archived, is_pinned, position)
VALUES
  (2, 'streamflow-music-backend', 'https://github.com/StevSant/streamflow_music_backend', '2025-01-01', 1, NULL, NULL, false, true, 1);

-- Frontend (hijo del monorepo)
INSERT INTO project (id, code, url, created_at, parent_project_id, source_id, source_type, is_archived, is_pinned, position)
VALUES
  (3, 'streamflow-music-frontend', 'https://github.com/StevSant/streamflow_music_frontend', '2025-01-01', 1, NULL, NULL, false, true, 2);

-- Reset sequence
SELECT setval('project_id_seq', (SELECT MAX(id) FROM project));

-- ============================================================================
-- 🌐 PROJECT TRANSLATIONS
-- ============================================================================

-- Monorepo - English
INSERT INTO project_translation (id, project_id, language_id, title, description)
VALUES
  (1, 1, 1, 'StreamFlow Music',
   'Full-stack music streaming platform built with Clean Architecture. Monorepo containing backend (Django REST API) and frontend (Angular SSR) with Supabase integration, Spotify/YouTube data sourcing, real-time playback, playlist management, user profiles, and comprehensive test coverage with SonarQube quality gates.');

-- Monorepo - Spanish
INSERT INTO project_translation (id, project_id, language_id, title, description)
VALUES
  (2, 1, 2, 'StreamFlow Music',
   'Plataforma de streaming de música full-stack construida con Arquitectura Limpia. Monorepo que contiene backend (Django REST API) y frontend (Angular SSR) con integración de Supabase, obtención de datos de Spotify/YouTube, reproducción en tiempo real, gestión de playlists, perfiles de usuario y cobertura de tests completa con quality gates de SonarQube.');

-- Backend - English
INSERT INTO project_translation (id, project_id, language_id, title, description)
VALUES
  (3, 2, 1, 'StreamFlow Music Backend',
   'RESTful API built with Django and Django REST Framework following Clean Architecture principles (domain, use cases, infrastructure, API layers). Features include music track processing and saving (SaveTrackAsSongUseCase), artist/album extraction, genre analysis, user profile management with image upload, playlist CRUD, Supabase authentication, and modular service design (SongDatabaseService, MediaProcessor, MusicDataConverter). Includes 474+ unit tests with pytest, async support, coverage reporting, and SonarCloud integration for continuous code quality analysis.');

-- Backend - Spanish
INSERT INTO project_translation (id, project_id, language_id, title, description)
VALUES
  (4, 2, 2, 'StreamFlow Music Backend',
   'API RESTful construida con Django y Django REST Framework siguiendo principios de Arquitectura Limpia (capas de dominio, casos de uso, infraestructura y API). Incluye procesamiento y guardado de tracks musicales (SaveTrackAsSongUseCase), extracción de artistas/álbumes, análisis de géneros, gestión de perfiles de usuario con carga de imágenes, CRUD de playlists, autenticación con Supabase y diseño modular de servicios (SongDatabaseService, MediaProcessor, MusicDataConverter). Cuenta con más de 474 tests unitarios con pytest, soporte asíncrono, reportes de cobertura e integración con SonarCloud para análisis continuo de calidad de código.');

-- Frontend - English
INSERT INTO project_translation (id, project_id, language_id, title, description)
VALUES
  (5, 3, 1, 'StreamFlow Music Frontend',
   'Modern single-page application built with Angular 19+ and Server-Side Rendering (SSR). Implements Clean Architecture with domain use cases (AuthSessionUseCase, ChangeLanguageUseCase), repository pattern (LanguageRepository, ILanguageRepository), reactive state management using Angular signals, and dependency injection throughout. Features include a global music player (GlobalPlayerStateService), dynamic Material Design theming (MaterialThemeService, ThemeDirective), internationalization with ngx-translate supporting English and Spanish, Supabase authentication, playlist management with color extraction, music tables with playback controls, and comprehensive Compodoc-generated documentation. Integrated with SonarCloud for frontend code quality analysis.');

-- Frontend - Spanish
INSERT INTO project_translation (id, project_id, language_id, title, description)
VALUES
  (6, 3, 2, 'StreamFlow Music Frontend',
   'Aplicación de página única moderna construida con Angular 19+ y renderizado del lado del servidor (SSR). Implementa Arquitectura Limpia con casos de uso de dominio (AuthSessionUseCase, ChangeLanguageUseCase), patrón repositorio (LanguageRepository, ILanguageRepository), gestión de estado reactivo usando signals de Angular e inyección de dependencias. Incluye reproductor de música global (GlobalPlayerStateService), tematización dinámica con Material Design (MaterialThemeService, ThemeDirective), internacionalización con ngx-translate soportando inglés y español, autenticación con Supabase, gestión de playlists con extracción de colores, tablas de música con controles de reproducción y documentación generada con Compodoc. Integrado con SonarCloud para análisis de calidad del código frontend.');

-- Reset sequence
SELECT setval('project_translation_id_seq', (SELECT MAX(id) FROM project_translation));

-- ============================================================================
-- 🛠️ SKILL USAGES
-- ============================================================================
-- source_type = 'project', source_id = project.id
-- skill_id references pre-existing skills
-- level: 1-5 scale (1=basic, 2=elementary, 3=intermediate, 4=advanced, 5=expert)

-- -------------------------------------------------------
-- Skills for Project 2: Backend
-- -------------------------------------------------------

-- Python (skill_id = 1)
INSERT INTO skill_usages (id, skill_id, source_id, source_type, level, started_at, ended_at, is_archived, is_pinned, position)
VALUES (1, 1, 2, 'project', 4, '2025-01-01', NULL, false, true, 1);

-- Django (skill_id = 2)
INSERT INTO skill_usages (id, skill_id, source_id, source_type, level, started_at, ended_at, is_archived, is_pinned, position)
VALUES (2, 2, 2, 'project', 4, '2025-01-01', NULL, false, true, 2);

-- Django REST Framework (skill_id = 3)
INSERT INTO skill_usages (id, skill_id, source_id, source_type, level, started_at, ended_at, is_archived, is_pinned, position)
VALUES (3, 3, 2, 'project', 4, '2025-01-01', NULL, false, true, 3);

-- PostgreSQL (skill_id = 4)
INSERT INTO skill_usages (id, skill_id, source_id, source_type, level, started_at, ended_at, is_archived, is_pinned, position)
VALUES (4, 4, 2, 'project', 3, '2025-01-01', NULL, false, false, 4);

-- Supabase (skill_id = 5)
INSERT INTO skill_usages (id, skill_id, source_id, source_type, level, started_at, ended_at, is_archived, is_pinned, position)
VALUES (5, 5, 2, 'project', 3, '2025-01-01', NULL, false, false, 5);

-- Docker (skill_id = 6)
INSERT INTO skill_usages (id, skill_id, source_id, source_type, level, started_at, ended_at, is_archived, is_pinned, position)
VALUES (6, 6, 2, 'project', 3, '2025-01-01', NULL, false, false, 6);

-- pytest (skill_id = 7)
INSERT INTO skill_usages (id, skill_id, source_id, source_type, level, started_at, ended_at, is_archived, is_pinned, position)
VALUES (7, 7, 2, 'project', 4, '2025-01-01', NULL, false, false, 7);

-- Clean Architecture (skill_id = 8)
INSERT INTO skill_usages (id, skill_id, source_id, source_type, level, started_at, ended_at, is_archived, is_pinned, position)
VALUES (8, 8, 2, 'project', 4, '2025-01-01', NULL, false, true, 8);

-- SonarQube/SonarCloud (skill_id = 9)
INSERT INTO skill_usages (id, skill_id, source_id, source_type, level, started_at, ended_at, is_archived, is_pinned, position)
VALUES (9, 9, 2, 'project', 3, '2025-01-01', NULL, false, false, 9);

-- REST API Design (skill_id = 10)
INSERT INTO skill_usages (id, skill_id, source_id, source_type, level, started_at, ended_at, is_archived, is_pinned, position)
VALUES (10, 10, 2, 'project', 4, '2025-01-01', NULL, false, false, 10);

-- Git (skill_id = 11)
INSERT INTO skill_usages (id, skill_id, source_id, source_type, level, started_at, ended_at, is_archived, is_pinned, position)
VALUES (11, 11, 2, 'project', 4, '2025-01-01', NULL, false, false, 11);

-- -------------------------------------------------------
-- Skills for Project 3: Frontend
-- -------------------------------------------------------

-- TypeScript (skill_id = 12)
INSERT INTO skill_usages (id, skill_id, source_id, source_type, level, started_at, ended_at, is_archived, is_pinned, position)
VALUES (12, 12, 3, 'project', 4, '2025-01-01', NULL, false, true, 1);

-- Angular (skill_id = 13)
INSERT INTO skill_usages (id, skill_id, source_id, source_type, level, started_at, ended_at, is_archived, is_pinned, position)
VALUES (13, 13, 3, 'project', 4, '2025-01-01', NULL, false, true, 2);

-- SCSS/CSS (skill_id = 14)
INSERT INTO skill_usages (id, skill_id, source_id, source_type, level, started_at, ended_at, is_archived, is_pinned, position)
VALUES (14, 14, 3, 'project', 3, '2025-01-01', NULL, false, false, 3);

-- RxJS (skill_id = 15)
INSERT INTO skill_usages (id, skill_id, source_id, source_type, level, started_at, ended_at, is_archived, is_pinned, position)
VALUES (15, 15, 3, 'project', 3, '2025-01-01', NULL, false, false, 4);

-- Angular Material (skill_id = 16)
INSERT INTO skill_usages (id, skill_id, source_id, source_type, level, started_at, ended_at, is_archived, is_pinned, position)
VALUES (16, 16, 3, 'project', 3, '2025-01-01', NULL, false, false, 5);

-- Server-Side Rendering / Angular SSR (skill_id = 17)
INSERT INTO skill_usages (id, skill_id, source_id, source_type, level, started_at, ended_at, is_archived, is_pinned, position)
VALUES (17, 17, 3, 'project', 3, '2025-01-01', NULL, false, false, 6);

-- Supabase (skill_id = 5) — shared skill, reused on frontend
INSERT INTO skill_usages (id, skill_id, source_id, source_type, level, started_at, ended_at, is_archived, is_pinned, position)
VALUES (18, 5, 3, 'project', 3, '2025-01-01', NULL, false, false, 7);

-- Clean Architecture (skill_id = 8) — shared skill, reused on frontend
INSERT INTO skill_usages (id, skill_id, source_id, source_type, level, started_at, ended_at, is_archived, is_pinned, position)
VALUES (19, 8, 3, 'project', 4, '2025-01-01', NULL, false, true, 8);

-- SonarQube/SonarCloud (skill_id = 9) — shared skill
INSERT INTO skill_usages (id, skill_id, source_id, source_type, level, started_at, ended_at, is_archived, is_pinned, position)
VALUES (20, 9, 3, 'project', 3, '2025-01-01', NULL, false, false, 9);

-- i18n / ngx-translate (skill_id = 18)
INSERT INTO skill_usages (id, skill_id, source_id, source_type, level, started_at, ended_at, is_archived, is_pinned, position)
VALUES (21, 18, 3, 'project', 3, '2025-01-01', NULL, false, false, 10);

-- Git (skill_id = 11) — shared skill
INSERT INTO skill_usages (id, skill_id, source_id, source_type, level, started_at, ended_at, is_archived, is_pinned, position)
VALUES (22, 11, 3, 'project', 4, '2025-01-01', NULL, false, false, 11);

-- HTML (skill_id = 19)
INSERT INTO skill_usages (id, skill_id, source_id, source_type, level, started_at, ended_at, is_archived, is_pinned, position)
VALUES (23, 19, 3, 'project', 4, '2025-01-01', NULL, false, false, 12);

-- -------------------------------------------------------
-- Skills for Project 1: Monorepo (cross-cutting skills)
-- -------------------------------------------------------

-- Git (skill_id = 11)
INSERT INTO skill_usages (id, skill_id, source_id, source_type, level, started_at, ended_at, is_archived, is_pinned, position)
VALUES (24, 11, 1, 'project', 4, '2025-01-01', NULL, false, true, 1);

-- Clean Architecture (skill_id = 8)
INSERT INTO skill_usages (id, skill_id, source_id, source_type, level, started_at, ended_at, is_archived, is_pinned, position)
VALUES (25, 8, 1, 'project', 4, '2025-01-01', NULL, false, true, 2);

-- SonarQube/SonarCloud (skill_id = 9)
INSERT INTO skill_usages (id, skill_id, source_id, source_type, level, started_at, ended_at, is_archived, is_pinned, position)
VALUES (26, 9, 1, 'project', 3, '2025-01-01', NULL, false, false, 3);

-- Docker (skill_id = 6)
INSERT INTO skill_usages (id, skill_id, source_id, source_type, level, started_at, ended_at, is_archived, is_pinned, position)
VALUES (27, 6, 1, 'project', 3, '2025-01-01', NULL, false, false, 4);

-- Supabase (skill_id = 5)
INSERT INTO skill_usages (id, skill_id, source_id, source_type, level, started_at, ended_at, is_archived, is_pinned, position)
VALUES (28, 5, 1, 'project', 3, '2025-01-01', NULL, false, false, 5);

-- Reset sequence
SELECT setval('skill_usages_id_seq', (SELECT MAX(id) FROM skill_usages));

-- ============================================================================
-- 🌐 SKILL USAGES TRANSLATIONS
-- ============================================================================

-- -------------------------------------------------------
-- Backend skill usage translations
-- -------------------------------------------------------

-- Python (usage 1)
INSERT INTO skill_usages_translation (id, skill_usages_id, language_id, notes) VALUES
  (1, 1, 1, 'Primary language for the entire backend. Used for domain entities, use cases (SaveTrackAsSongUseCase, GetUserProfileUseCase), services (SongDatabaseService, MusicGenreAnalyzer), repositories, and async operations with AsyncMock in tests.'),
  (2, 1, 2, 'Lenguaje principal de todo el backend. Usado para entidades de dominio, casos de uso (SaveTrackAsSongUseCase, GetUserProfileUseCase), servicios (SongDatabaseService, MusicGenreAnalyzer), repositorios y operaciones asíncronas con AsyncMock en tests.');

-- Django (usage 2)
INSERT INTO skill_usages_translation (id, skill_usages_id, language_id, notes) VALUES
  (3, 2, 1, 'Web framework powering the REST API. Configured with modular settings (base, database, auth, REST framework, Supabase, Jazzmin admin). Uses Django ORM for models, migrations, and admin panel.'),
  (4, 2, 2, 'Framework web que impulsa la API REST. Configurado con ajustes modulares (base, database, auth, REST framework, Supabase, Jazzmin admin). Usa Django ORM para modelos, migraciones y panel de administración.');

-- Django REST Framework (usage 3)
INSERT INTO skill_usages_translation (id, skill_usages_id, language_id, notes) VALUES
  (5, 3, 1, 'Used for building RESTful endpoints with ViewSets (GenreViewSet, UserProfileViewSet), serializers, DTOs with drf-spectacular schema decorators (@extend_schema_view), custom FilteredViewSetMixin, CRUDViewSetMixin, and paginated endpoints.'),
  (6, 3, 2, 'Usado para construir endpoints RESTful con ViewSets (GenreViewSet, UserProfileViewSet), serializadores, DTOs con decoradores de esquema drf-spectacular (@extend_schema_view), FilteredViewSetMixin personalizado, CRUDViewSetMixin y endpoints paginados.');

-- PostgreSQL (usage 4)
INSERT INTO skill_usages_translation (id, skill_usages_id, language_id, notes) VALUES
  (7, 4, 1, 'Primary database managed through Supabase. Configured in database_settings.py. Stores songs, artists, albums, genres, playlists, and user profiles.'),
  (8, 4, 2, 'Base de datos principal gestionada a través de Supabase. Configurada en database_settings.py. Almacena canciones, artistas, álbumes, géneros, playlists y perfiles de usuario.');

-- Supabase backend (usage 5)
INSERT INTO skill_usages_translation (id, skill_usages_id, language_id, notes) VALUES
  (9, 5, 1, 'Used for database hosting, authentication (supabase_settings.py, auth_settings.py), and storage. Integrated with Django through custom repository implementations and the UserRepository infrastructure layer.'),
  (10, 5, 2, 'Usado para hosting de base de datos, autenticación (supabase_settings.py, auth_settings.py) y almacenamiento. Integrado con Django mediante implementaciones de repositorio personalizadas y la capa de infraestructura UserRepository.');

-- Docker (usage 6)
INSERT INTO skill_usages_translation (id, skill_usages_id, language_id, notes) VALUES
  (11, 6, 1, 'Containerized deployment with Dockerfile and docker-compose.yml. Includes .dockerignore for optimized builds and multi-service orchestration.'),
  (12, 6, 2, 'Despliegue en contenedores con Dockerfile y docker-compose.yml. Incluye .dockerignore para builds optimizados y orquestación multi-servicio.');

-- pytest (usage 7)
INSERT INTO skill_usages_translation (id, skill_usages_id, language_id, notes) VALUES
  (13, 7, 1, 'Test framework with 474+ tests (0 failures, 6 skipped). Uses pytest-asyncio for async tests, Mock/AsyncMock for dependency isolation, comprehensive DTO tests (TestSongCreateDTO, TestSongMapper), use case logic tests, domain validation tests, and integration tests. Coverage reports generated in XML format for SonarCloud.'),
  (14, 7, 2, 'Framework de tests con más de 474 tests (0 fallos, 6 omitidos). Usa pytest-asyncio para tests asíncronos, Mock/AsyncMock para aislamiento de dependencias, tests completos de DTOs (TestSongCreateDTO, TestSongMapper), tests de lógica de casos de uso, tests de validación de dominio y tests de integración. Reportes de cobertura generados en formato XML para SonarCloud.');

-- Clean Architecture backend (usage 8)
INSERT INTO skill_usages_translation (id, skill_usages_id, language_id, notes) VALUES
  (15, 8, 1, 'Strictly followed across all backend apps: domain layer (entities like SongEntity, repository interfaces like ISongRepository), use cases layer (SaveTrackAsSongUseCase, GetUserProfileUseCase, UploadProfilePicture), infrastructure layer (repository implementations, ORM models), and API layer (ViewSets, DTOs, serializers). Modular services: MediaProcessor, TrackToSongEntityMapper, SongDatabaseService, MusicDataConverter.'),
  (16, 8, 2, 'Seguida estrictamente en todas las apps del backend: capa de dominio (entidades como SongEntity, interfaces de repositorio como ISongRepository), capa de casos de uso (SaveTrackAsSongUseCase, GetUserProfileUseCase, UploadProfilePicture), capa de infraestructura (implementaciones de repositorio, modelos ORM) y capa API (ViewSets, DTOs, serializadores). Servicios modulares: MediaProcessor, TrackToSongEntityMapper, SongDatabaseService, MusicDataConverter.');

-- SonarCloud backend (usage 9)
INSERT INTO skill_usages_translation (id, skill_usages_id, language_id, notes) VALUES
  (17, 9, 1, 'Configured via sonar-project.properties with project key SteveSant26_streamflow_music_backend. Includes coverage exclusions for tests/migrations, security rule suppressions for test files (S2068, S3649, S4426, S2245, S1481, S5915), and pytest XML report integration.'),
  (18, 9, 2, 'Configurado mediante sonar-project.properties con clave de proyecto SteveSant26_streamflow_music_backend. Incluye exclusiones de cobertura para tests/migraciones, supresiones de reglas de seguridad para archivos de test (S2068, S3649, S4426, S2245, S1481, S5915) e integración de reportes XML de pytest.');

-- REST API Design (usage 10)
INSERT INTO skill_usages_translation (id, skill_usages_id, language_id, notes) VALUES
  (19, 10, 1, 'Designed RESTful endpoints for songs, artists, albums, genres, playlists, and user profiles. Custom decorators (@paginated_list_endpoint), schema documentation with drf-spectacular, proper HTTP status codes, and consistent DTO-based request/response patterns.'),
  (20, 10, 2, 'Diseño de endpoints RESTful para canciones, artistas, álbumes, géneros, playlists y perfiles de usuario. Decoradores personalizados (@paginated_list_endpoint), documentación de esquemas con drf-spectacular, códigos de estado HTTP apropiados y patrones consistentes de request/response basados en DTOs.');

-- Git backend (usage 11)
INSERT INTO skill_usages_translation (id, skill_usages_id, language_id, notes) VALUES
  (21, 11, 1, 'Version control with Git submodules (.gitmodules), comprehensive .gitignore for Python/Django artifacts, pre-commit hooks (.pre-commit-config.yaml), and GitHub Actions CI/CD workflows.'),
  (22, 11, 2, 'Control de versiones con submódulos Git (.gitmodules), .gitignore completo para artefactos Python/Django, hooks de pre-commit (.pre-commit-config.yaml) y flujos de trabajo CI/CD con GitHub Actions.');

-- -------------------------------------------------------
-- Frontend skill usage translations
-- -------------------------------------------------------

-- TypeScript (usage 12)
INSERT INTO skill_usages_translation (id, skill_usages_id, language_id, notes) VALUES
  (23, 12, 1, 'Primary language for the entire frontend. Strong typing with interfaces (Song, Album, Artist, Playlist, PlaylistSong, CurrentMusic, User, SearchResults), dependency injection with inject(), Angular signals for reactive state, and Observable-based data flow.'),
  (24, 12, 2, 'Lenguaje principal de todo el frontend. Tipado fuerte con interfaces (Song, Album, Artist, Playlist, PlaylistSong, CurrentMusic, User, SearchResults), inyección de dependencias con inject(), signals de Angular para estado reactivo y flujo de datos basado en Observables.');

-- Angular (usage 13)
INSERT INTO skill_usages_translation (id, skill_usages_id, language_id, notes) VALUES
  (25, 13, 1, 'Angular 19+ with standalone components, signal-based state management, ChangeDetectionStrategy.OnPush, dependency injection via inject(), RouterOutlet, custom directives (ThemeDirective), HTTP interceptors (AuthTokenInterceptor), and comprehensive component library (MusicsTable, MusicsTablePlay, PlaylistComponent, LibraryComponent, ExploreComponent, LoginComponent, RegisterComponent).'),
  (26, 13, 2, 'Angular 19+ con componentes standalone, gestión de estado basada en signals, ChangeDetectionStrategy.OnPush, inyección de dependencias via inject(), RouterOutlet, directivas personalizadas (ThemeDirective), interceptores HTTP (AuthTokenInterceptor) y biblioteca completa de componentes (MusicsTable, MusicsTablePlay, PlaylistComponent, LibraryComponent, ExploreComponent, LoginComponent, RegisterComponent).');

-- SCSS/CSS (usage 14)
INSERT INTO skill_usages_translation (id, skill_usages_id, language_id, notes) VALUES
  (27, 14, 1, 'Styling with SCSS including variables, module system (@use, @forward), dynamic theming integration with Material Design, responsive layouts, and Bootstrap for documentation pages.'),
  (28, 14, 2, 'Estilos con SCSS incluyendo variables, sistema de módulos (@use, @forward), integración de temas dinámicos con Material Design, layouts responsivos y Bootstrap para páginas de documentación.');

-- RxJS (usage 15)
INSERT INTO skill_usages_translation (id, skill_usages_id, language_id, notes) VALUES
  (29, 15, 1, 'Reactive programming with Observables for language service (getCurrentLanguage, changeLanguage, getAvailableLanguages), authentication flows, HTTP requests, and Observable-to-Signal bridging in LanguageService constructor.'),
  (30, 15, 2, 'Programación reactiva con Observables para servicio de idioma (getCurrentLanguage, changeLanguage, getAvailableLanguages), flujos de autenticación, peticiones HTTP y conexión Observable-a-Signal en el constructor de LanguageService.');

-- Angular Material (usage 16)
INSERT INTO skill_usages_translation (id, skill_usages_id, language_id, notes) VALUES
  (31, 16, 1, 'Material Design theming via MaterialThemeService with dynamic theme switching, MatIcon component usage in music tables, and Material design tokens integration.'),
  (32, 16, 2, 'Tematización Material Design mediante MaterialThemeService con cambio dinámico de temas, uso del componente MatIcon en tablas de música e integración de tokens de diseño Material.');

-- SSR (usage 17)
INSERT INTO skill_usages_translation (id, skill_usages_id, language_id, notes) VALUES
  (33, 17, 1, 'Angular Server-Side Rendering with Express (AngularNodeAppEngine), separate server config (app.config.server.ts), server routes (app.routes.server.ts), browser/server entry points (main.ts, main.server.ts), and platform-aware code with typeof window checks in LanguageRepository.'),
  (34, 17, 2, 'Renderizado del lado del servidor Angular con Express (AngularNodeAppEngine), configuración de servidor separada (app.config.server.ts), rutas del servidor (app.routes.server.ts), puntos de entrada navegador/servidor (main.ts, main.server.ts) y código consciente de plataforma con verificaciones typeof window en LanguageRepository.');

-- Supabase frontend (usage 18)
INSERT INTO skill_usages_translation (id, skill_usages_id, language_id, notes) VALUES
  (35, 18, 1, 'Supabase client integration via SupabaseService (injectable singleton), authentication session management (AuthSessionUseCase, AuthTokenInterceptor), and real-time data subscriptions for music playback state.'),
  (36, 18, 2, 'Integración del cliente Supabase mediante SupabaseService (singleton inyectable), gestión de sesiones de autenticación (AuthSessionUseCase, AuthTokenInterceptor) y suscripciones de datos en tiempo real para estado de reproducción musical.');

-- Clean Architecture frontend (usage 19)
INSERT INTO skill_usages_translation (id, skill_usages_id, language_id, notes) VALUES
  (37, 19, 1, 'Domain-driven design with use cases (AuthSessionUseCase, LoginUseCase, RegisterUseCase, ChangeLanguageUseCase, GetCurrentLanguageUseCase, GetAvailableLanguagesUseCase), repository interfaces (ILanguageRepository with LANGUAGE_REPOSITORY_TOKEN), concrete implementations (LanguageRepository), and presentation layer separation with services (LanguageService, GlobalPlayerStateService, MaterialThemeService).'),
  (38, 19, 2, 'Diseño dirigido por dominio con casos de uso (AuthSessionUseCase, LoginUseCase, RegisterUseCase, ChangeLanguageUseCase, GetCurrentLanguageUseCase, GetAvailableLanguagesUseCase), interfaces de repositorio (ILanguageRepository con LANGUAGE_REPOSITORY_TOKEN), implementaciones concretas (LanguageRepository) y separación de capa de presentación con servicios (LanguageService, GlobalPlayerStateService, MaterialThemeService).');

-- SonarCloud frontend (usage 20)
INSERT INTO skill_usages_translation (id, skill_usages_id, language_id, notes) VALUES
  (39, 20, 1, 'Configured via sonar-project.properties and sonar.js with project key SteveSant26_streamflow_music_frontend. LCOV coverage report integration, test exclusions for spec files, and source encoding configuration.'),
  (40, 20, 2, 'Configurado mediante sonar-project.properties y sonar.js con clave de proyecto SteveSant26_streamflow_music_frontend. Integración de reportes de cobertura LCOV, exclusiones de tests para archivos spec y configuración de codificación de fuentes.');

-- i18n (usage 21)
INSERT INTO skill_usages_translation (id, skill_usages_id, language_id, notes) VALUES
  (41, 21, 1, 'Internationalization with ngx-translate supporting English (en) and Spanish (es). LanguageRepository handles browser language detection, localStorage persistence, and TranslateService integration. LanguageService provides reactive signals for UI binding.'),
  (42, 21, 2, 'Internacionalización con ngx-translate soportando inglés (en) y español (es). LanguageRepository maneja detección de idioma del navegador, persistencia en localStorage e integración con TranslateService. LanguageService provee signals reactivos para vinculación con la UI.');

-- Git frontend (usage 22)
INSERT INTO skill_usages_translation (id, skill_usages_id, language_id, notes) VALUES
  (43, 22, 1, 'Version control as a Git submodule of the main monorepo, with proper .gitignore for Node.js/Angular artifacts and Compodoc-generated documentation committed for reference.'),
  (44, 22, 2, 'Control de versiones como submódulo Git del monorepo principal, con .gitignore apropiado para artefactos Node.js/Angular y documentación generada con Compodoc incluida como referencia.');

-- HTML (usage 23)
INSERT INTO skill_usages_translation (id, skill_usages_id, language_id, notes) VALUES
  (45, 23, 1, 'Angular template syntax with semantic HTML, component templates for music player UI, playlist management, library views, authentication forms, and search results display.'),
  (46, 23, 2, 'Sintaxis de templates Angular con HTML semántico, templates de componentes para UI del reproductor de música, gestión de playlists, vistas de biblioteca, formularios de autenticación y visualización de resultados de búsqueda.');

-- -------------------------------------------------------
-- Monorepo skill usage translations
-- -------------------------------------------------------

-- Git monorepo (usage 24)
INSERT INTO skill_usages_translation (id, skill_usages_id, language_id, notes) VALUES
  (47, 24, 1, 'Monorepo management with Git submodules linking backend and frontend repositories. Centralized .gitignore and project-level configuration.'),
  (48, 24, 2, 'Gestión de monorepo con submódulos Git vinculando repositorios de backend y frontend. .gitignore centralizado y configuración a nivel de proyecto.');

-- Clean Architecture monorepo (usage 25)
INSERT INTO skill_usages_translation (id, skill_usages_id, language_id, notes) VALUES
  (49, 25, 1, 'Architectural pattern consistently applied across both backend (Django) and frontend (Angular), with clear separation of domain, use cases, infrastructure, and presentation layers in both codebases.'),
  (50, 25, 2, 'Patrón arquitectónico aplicado consistentemente en backend (Django) y frontend (Angular), con separación clara de capas de dominio, casos de uso, infraestructura y presentación en ambos codebases.');

-- SonarCloud monorepo (usage 26)
INSERT INTO skill_usages_translation (id, skill_usages_id, language_id, notes) VALUES
  (51, 26, 1, 'Centralized code quality analysis with separate SonarCloud projects for backend and frontend, unified quality gates, and continuous integration pipelines.'),
  (52, 26, 2, 'Análisis de calidad de código centralizado con proyectos SonarCloud separados para backend y frontend, quality gates unificados y pipelines de integración continua.');

-- Docker monorepo (usage 27)
INSERT INTO skill_usages_translation (id, skill_usages_id, language_id, notes) VALUES
  (53, 27, 1, 'Container orchestration for the full-stack application with docker-compose for multi-service deployment coordination.'),
  (54, 27, 2, 'Orquestación de contenedores para la aplicación full-stack con docker-compose para coordinación de despliegue multi-servicio.');

-- Supabase monorepo (usage 28)
INSERT INTO skill_usages_translation (id, skill_usages_id, language_id, notes) VALUES
  (55, 28, 1, 'Shared Supabase instance providing authentication, database, and storage services consumed by both backend (Django integration) and frontend (JavaScript client) applications.'),
  (56, 28, 2, 'Instancia compartida de Supabase que provee servicios de autenticación, base de datos y almacenamiento consumidos por ambas aplicaciones backend (integración Django) y frontend (cliente JavaScript).');

-- Reset sequence
SELECT setval('skill_usages_translation_id_seq', (SELECT MAX(id) FROM skill_usages_translation));



-- =========================
-- Seeding: language
-- =========================
INSERT INTO language (id, code, name) VALUES
  (1, 'es', 'Español'),
  (2, 'en', 'English')
ON CONFLICT (id) DO NOTHING;

-- =========================
-- Seeding: skill
-- =========================
INSERT INTO skill (id, code) VALUES
  (1, 'python'),
  (2, 'fastapi'),
  (3, 'langchain'),
  (4, 'openai'),
  (5, 'angular'),
  (6, 'typescript'),
  (7, 'tailwindcss'),
  (8, 'docker'),
  (9, 'postgresql'),
  (10, 'chromadb'),
  (11, 'html_css'),
  (12, 'git'),
  (13, 'rest_api'),
  (14, 'pytest'),
  (15, 'sql')
ON CONFLICT (id) DO NOTHING;


-- =========================
-- Seeding: project
-- =========================

-- Proyecto principal (padre): Hackathon Agent AI
INSERT INTO project (id, code, url, created_at, parent_project_id, source_id, source_type, is_archived, is_pinned, position)
VALUES
  (1, 'hackathon-agent-ai', 'https://github.com/StevSant/hackiaton-agent-ai-backend', '2024-01-15', NULL, NULL, NULL, false, true, 1);

-- Subproyecto: Backend
INSERT INTO project (id, code, url, created_at, parent_project_id, source_id, source_type, is_archived, is_pinned, position)
VALUES
  (2, 'hackathon-agent-ai-backend', 'https://github.com/StevSant/hackiaton-agent-ai-backend', '2024-01-15', 1, 1, 'repository', false, true, 1);

-- Subproyecto: Frontend
INSERT INTO project (id, code, url, created_at, parent_project_id, source_id, source_type, is_archived, is_pinned, position)
VALUES
  (3, 'hackathon-agent-ai-frontend', 'https://github.com/StevSant/hackiaton-agent-ai-frontend', '2024-01-15', 1, 2, 'repository', false, true, 2);

-- Subproyecto: API REST (módulo dentro del backend)
INSERT INTO project (id, code, url, created_at, parent_project_id, source_id, source_type, is_archived, is_pinned, position)
VALUES
  (4, 'hackathon-api-module', NULL, '2024-01-16', 2, NULL, 'module', false, false, 1);

-- Subproyecto: Vector Store / RAG Pipeline
INSERT INTO project (id, code, url, created_at, parent_project_id, source_id, source_type, is_archived, is_pinned, position)
VALUES
  (5, 'hackathon-vectorstore-rag', NULL, '2024-01-16', 2, NULL, 'module', false, false, 2);

-- Subproyecto: Infrastructure (Docker, CI/CD)
INSERT INTO project (id, code, url, created_at, parent_project_id, source_id, source_type, is_archived, is_pinned, position)
VALUES
  (6, 'hackathon-infrastructure', NULL, '2024-01-17', 1, NULL, 'module', false, false, 3);

-- Subproyecto: Testing
INSERT INTO project (id, code, url, created_at, parent_project_id, source_id, source_type, is_archived, is_pinned, position)
VALUES
  (7, 'hackathon-testing', NULL, '2024-01-17', 2, NULL, 'module', false, false, 3);

-- Reset sequence
SELECT setval('project_id_seq', (SELECT MAX(id) FROM project));


-- =========================
-- Seeding: project_translation
-- =========================

-- Proyecto principal - Español
INSERT INTO project_translation (id, project_id, language_id, title, description) VALUES
  (1, 1, 1, 'Hackathon Agent AI',
   'Proyecto fullstack desarrollado durante una hackathon que implementa un agente de inteligencia artificial conversacional. '
   || 'Combina un backend en Python con FastAPI y LangChain para procesamiento de lenguaje natural, '
   || 'un pipeline RAG (Retrieval-Augmented Generation) con ChromaDB como vector store, '
   || 'y un frontend moderno en Angular con TailwindCSS. '
   || 'El agente es capaz de responder preguntas contextuales utilizando documentos cargados en la base de conocimiento vectorial.');

-- Proyecto principal - English
INSERT INTO project_translation (id, project_id, language_id, title, description) VALUES
  (2, 1, 2, 'Hackathon Agent AI',
   'Fullstack project developed during a hackathon that implements a conversational artificial intelligence agent. '
   || 'It combines a Python backend with FastAPI and LangChain for natural language processing, '
   || 'a RAG (Retrieval-Augmented Generation) pipeline with ChromaDB as vector store, '
   || 'and a modern Angular frontend with TailwindCSS. '
   || 'The agent is capable of answering contextual questions using documents loaded into the vector knowledge base.');

-- Backend - Español
INSERT INTO project_translation (id, project_id, language_id, title, description) VALUES
  (3, 2, 1, 'Backend - Agent AI',
   'Servidor backend construido con Python y FastAPI que expone una API REST para interactuar con el agente de IA. '
   || 'Incluye integración con OpenAI, LangChain para orquestación de cadenas de prompts, '
   || 'ChromaDB para almacenamiento y búsqueda vectorial, y una arquitectura limpia con separación en capas: '
   || 'api, application, domain, infrastructure y DTOs.');

-- Backend - English
INSERT INTO project_translation (id, project_id, language_id, title, description) VALUES
  (4, 2, 2, 'Backend - Agent AI',
   'Backend server built with Python and FastAPI exposing a REST API to interact with the AI agent. '
   || 'Includes integration with OpenAI, LangChain for prompt chain orchestration, '
   || 'ChromaDB for vector storage and search, and a clean architecture with layer separation: '
   || 'api, application, domain, infrastructure, and DTOs.');

-- Frontend - Español
INSERT INTO project_translation (id, project_id, language_id, title, description) VALUES
  (5, 3, 1, 'Frontend - Agent AI',
   'Aplicación frontend desarrollada con Angular y estilizada con TailwindCSS. '
   || 'Proporciona una interfaz de usuario tipo chat para interactuar con el agente de IA, '
   || 'permitiendo a los usuarios hacer preguntas y recibir respuestas contextuales en tiempo real. '
   || 'Implementa diseño responsivo y componentes reutilizables.');

-- Frontend - English
INSERT INTO project_translation (id, project_id, language_id, title, description) VALUES
  (6, 3, 2, 'Frontend - Agent AI',
   'Frontend application developed with Angular and styled with TailwindCSS. '
   || 'Provides a chat-like user interface to interact with the AI agent, '
   || 'allowing users to ask questions and receive contextual answers in real time. '
   || 'Implements responsive design and reusable components.');

-- API Module - Español
INSERT INTO project_translation (id, project_id, language_id, title, description) VALUES
  (7, 4, 1, 'Módulo API REST',
   'Capa de API REST del backend que define los endpoints, maneja las solicitudes HTTP, '
   || 'valida los datos de entrada mediante DTOs y orquesta las respuestas del agente de IA. '
   || 'Construido siguiendo principios RESTful con FastAPI.');

-- API Module - English
INSERT INTO project_translation (id, project_id, language_id, title, description) VALUES
  (8, 4, 2, 'REST API Module',
   'Backend REST API layer that defines endpoints, handles HTTP requests, '
   || 'validates input data through DTOs, and orchestrates AI agent responses. '
   || 'Built following RESTful principles with FastAPI.');

-- Vector Store / RAG - Español
INSERT INTO project_translation (id, project_id, language_id, title, description) VALUES
  (9, 5, 1, 'Pipeline RAG y Vector Store',
   'Módulo encargado del pipeline de Retrieval-Augmented Generation (RAG). '
   || 'Gestiona la ingesta de documentos, su fragmentación, generación de embeddings con OpenAI, '
   || 'almacenamiento en ChromaDB y la recuperación semántica de contexto relevante '
   || 'para alimentar las respuestas del agente de IA.');

-- Vector Store / RAG - English
INSERT INTO project_translation (id, project_id, language_id, title, description) VALUES
  (10, 5, 2, 'RAG Pipeline and Vector Store',
   'Module responsible for the Retrieval-Augmented Generation (RAG) pipeline. '
   || 'Manages document ingestion, chunking, embedding generation with OpenAI, '
   || 'storage in ChromaDB, and semantic retrieval of relevant context '
   || 'to feed the AI agent responses.');

-- Infrastructure - Español
INSERT INTO project_translation (id, project_id, language_id, title, description) VALUES
  (11, 6, 1, 'Infraestructura y Despliegue',
   'Configuración de infraestructura del proyecto incluyendo Dockerfile para containerización, '
   || 'gestión de dependencias con requirements.txt, configuración de variables de entorno '
   || 'y scripts de automatización para el despliegue.');

-- Infrastructure - English
INSERT INTO project_translation (id, project_id, language_id, title, description) VALUES
  (12, 6, 2, 'Infrastructure and Deployment',
   'Project infrastructure configuration including Dockerfile for containerization, '
   || 'dependency management with requirements.txt, environment variable configuration, '
   || 'and automation scripts for deployment.');

-- Testing - Español
INSERT INTO project_translation (id, project_id, language_id, title, description) VALUES
  (13, 7, 1, 'Testing y Calidad de Código',
   'Suite de pruebas del backend implementada con pytest. '
   || 'Incluye pruebas unitarias, de integración y validación de tipos con mypy. '
   || 'Garantiza la calidad y confiabilidad del agente de IA.');

-- Testing - English
INSERT INTO project_translation (id, project_id, language_id, title, description) VALUES
  (14, 7, 2, 'Testing and Code Quality',
   'Backend test suite implemented with pytest. '
   || 'Includes unit tests, integration tests, and type validation with mypy. '
   || 'Ensures quality and reliability of the AI agent.');

-- Reset sequence
SELECT setval('project_translation_id_seq', (SELECT MAX(id) FROM project_translation));

-- =========================
-- Seeding: skill_usages
-- =========================
-- source_type 'project' → source_id = project.id
-- level: 1-5 (1=básico, 5=experto)

-- === Skills del Backend (project_id = 2) ===

-- Python en Backend
INSERT INTO skill_usages (id, skill_id, source_id, source_type, level, started_at, ended_at, is_archived, is_pinned, position)
VALUES (1, 1, 2, 'project', 5, '2024-01-15', NULL, false, true, 1);

-- FastAPI en Backend
INSERT INTO skill_usages (id, skill_id, source_id, source_type, level, started_at, ended_at, is_archived, is_pinned, position)
VALUES (2, 2, 2, 'project', 4, '2024-01-15', NULL, false, true, 2);

-- LangChain en Backend
INSERT INTO skill_usages (id, skill_id, source_id, source_type, level, started_at, ended_at, is_archived, is_pinned, position)
VALUES (3, 3, 2, 'project', 4, '2024-01-15', NULL, false, true, 3);

-- OpenAI en Backend
INSERT INTO skill_usages (id, skill_id, source_id, source_type, level, started_at, ended_at, is_archived, is_pinned, position)
VALUES (4, 4, 2, 'project', 4, '2024-01-15', NULL, false, true, 4);

-- PostgreSQL en Backend
INSERT INTO skill_usages (id, skill_id, source_id, source_type, level, started_at, ended_at, is_archived, is_pinned, position)
VALUES (5, 9, 2, 'project', 3, '2024-01-16', NULL, false, false, 5);

-- REST API en Backend
INSERT INTO skill_usages (id, skill_id, source_id, source_type, level, started_at, ended_at, is_archived, is_pinned, position)
VALUES (6, 13, 2, 'project', 4, '2024-01-15', NULL, false, false, 6);

-- SQL en Backend
INSERT INTO skill_usages (id, skill_id, source_id, source_type, level, started_at, ended_at, is_archived, is_pinned, position)
VALUES (7, 15, 2, 'project', 3, '2024-01-16', NULL, false, false, 7);

-- === Skills del Frontend (project_id = 3) ===

-- Angular en Frontend
INSERT INTO skill_usages (id, skill_id, source_id, source_type, level, started_at, ended_at, is_archived, is_pinned, position)
VALUES (8, 5, 3, 'project', 4, '2024-01-15', NULL, false, true, 1);

-- TypeScript en Frontend
INSERT INTO skill_usages (id, skill_id, source_id, source_type, level, started_at, ended_at, is_archived, is_pinned, position)
VALUES (9, 6, 3, 'project', 4, '2024-01-15', NULL, false, true, 2);

-- TailwindCSS en Frontend
INSERT INTO skill_usages (id, skill_id, source_id, source_type, level, started_at, ended_at, is_archived, is_pinned, position)
VALUES (10, 7, 3, 'project', 3, '2024-01-15', NULL, false, true, 3);

-- HTML/CSS en Frontend
INSERT INTO skill_usages (id, skill_id, source_id, source_type, level, started_at, ended_at, is_archived, is_pinned, position)
VALUES (11, 11, 3, 'project', 4, '2024-01-15', NULL, false, false, 4);

-- === Skills del Vector Store / RAG (project_id = 5) ===

-- ChromaDB en RAG Pipeline
INSERT INTO skill_usages (id, skill_id, source_id, source_type, level, started_at, ended_at, is_archived, is_pinned, position)
VALUES (12, 10, 5, 'project', 3, '2024-01-16', NULL, false, true, 1);

-- LangChain en RAG Pipeline
INSERT INTO skill_usages (id, skill_id, source_id, source_type, level, started_at, ended_at, is_archived, is_pinned, position)
VALUES (13, 3, 5, 'project', 4, '2024-01-16', NULL, false, true, 2);

-- OpenAI en RAG Pipeline (embeddings)
INSERT INTO skill_usages (id, skill_id, source_id, source_type, level, started_at, ended_at, is_archived, is_pinned, position)
VALUES (14, 4, 5, 'project', 4, '2024-01-16', NULL, false, false, 3);

-- Python en RAG Pipeline
INSERT INTO skill_usages (id, skill_id, source_id, source_type, level, started_at, ended_at, is_archived, is_pinned, position)
VALUES (15, 1, 5, 'project', 5, '2024-01-16', NULL, false, false, 4);

-- === Skills de Infraestructura (project_id = 6) ===

-- Docker en Infraestructura
INSERT INTO skill_usages (id, skill_id, source_id, source_type, level, started_at, ended_at, is_archived, is_pinned, position)
VALUES (16, 8, 6, 'project', 3, '2024-01-17', NULL, false, true, 1);

-- Git en Infraestructura
INSERT INTO skill_usages (id, skill_id, source_id, source_type, level, started_at, ended_at, is_archived, is_pinned, position)
VALUES (17, 12, 6, 'project', 4, '2024-01-17', NULL, false, false, 2);

-- === Skills de Testing (project_id = 7) ===

-- Pytest en Testing
INSERT INTO skill_usages (id, skill_id, source_id, source_type, level, started_at, ended_at, is_archived, is_pinned, position)
VALUES (18, 14, 7, 'project', 3, '2024-01-17', NULL, false, true, 1);

-- Python en Testing
INSERT INTO skill_usages (id, skill_id, source_id, source_type, level, started_at, ended_at, is_archived, is_pinned, position)
VALUES (19, 1, 7, 'project', 5, '2024-01-17', NULL, false, false, 2);

-- === Skills del Proyecto Principal (project_id = 1) — visión general ===

-- Git en proyecto principal
INSERT INTO skill_usages (id, skill_id, source_id, source_type, level, started_at, ended_at, is_archived, is_pinned, position)
VALUES (20, 12, 1, 'project', 4, '2024-01-15', NULL, false, false, 1);

-- Docker en proyecto principal
INSERT INTO skill_usages (id, skill_id, source_id, source_type, level, started_at, ended_at, is_archived, is_pinned, position)
VALUES (21, 8, 1, 'project', 3, '2024-01-15', NULL, false, false, 2);

-- REST API en proyecto principal
INSERT INTO skill_usages (id, skill_id, source_id, source_type, level, started_at, ended_at, is_archived, is_pinned, position)
VALUES (22, 13, 1, 'project', 4, '2024-01-15', NULL, false, false, 3);

-- Reset sequence
SELECT setval('skill_usages_id_seq', (SELECT MAX(id) FROM skill_usages));


-- =========================
-- Seeding: skill_usages_translation
-- =========================

-- Python en Backend - ES
INSERT INTO skill_usages_translation (id, skill_usages_id, language_id, notes) VALUES
  (1, 1, 1, 'Lenguaje principal del backend. Usado para toda la lógica de negocio, orquestación del agente de IA, procesamiento de datos y definición de la API REST.');
-- Python en Backend - EN
INSERT INTO skill_usages_translation (id, skill_usages_id, language_id, notes) VALUES
  (2, 1, 2, 'Main backend language. Used for all business logic, AI agent orchestration, data processing, and REST API definition.');

-- FastAPI en Backend - ES
INSERT INTO skill_usages_translation (id, skill_usages_id, language_id, notes) VALUES
  (3, 2, 1, 'Framework web de alto rendimiento utilizado para construir la API REST. Aprovecha async/await, validación automática con Pydantic y documentación OpenAPI generada automáticamente.');
-- FastAPI en Backend - EN
INSERT INTO skill_usages_translation (id, skill_usages_id, language_id, notes) VALUES
  (4, 2, 2, 'High-performance web framework used to build the REST API. Leverages async/await, automatic validation with Pydantic, and auto-generated OpenAPI documentation.');

-- LangChain en Backend - ES
INSERT INTO skill_usages_translation (id, skill_usages_id, language_id, notes) VALUES
  (5, 3, 1, 'Framework de orquestación de LLMs utilizado para construir las cadenas de prompts, gestionar la memoria conversacional y conectar el modelo de lenguaje con el vector store.');
-- LangChain en Backend - EN
INSERT INTO skill_usages_translation (id, skill_usages_id, language_id, notes) VALUES
  (6, 3, 2, 'LLM orchestration framework used to build prompt chains, manage conversational memory, and connect the language model with the vector store.');

-- OpenAI en Backend - ES
INSERT INTO skill_usages_translation (id, skill_usages_id, language_id, notes) VALUES
  (7, 4, 1, 'Proveedor de modelos de lenguaje (GPT) y embeddings utilizado como motor principal del agente conversacional para generar respuestas inteligentes y contextuales.');
-- OpenAI en Backend - EN
INSERT INTO skill_usages_translation (id, skill_usages_id, language_id, notes) VALUES
  (8, 4, 2, 'Language model (GPT) and embeddings provider used as the main engine of the conversational agent to generate intelligent and contextual responses.');

-- PostgreSQL en Backend - ES
INSERT INTO skill_usages_translation (id, skill_usages_id, language_id, notes) VALUES
  (9, 5, 1, 'Base de datos relacional utilizada para persistencia de datos estructurados del proyecto, configuraciones y metadatos del agente.');
-- PostgreSQL en Backend - EN
INSERT INTO skill_usages_translation (id, skill_usages_id, language_id, notes) VALUES
  (10, 5, 2, 'Relational database used for structured data persistence, project configurations, and agent metadata.');

-- REST API en Backend - ES
INSERT INTO skill_usages_translation (id, skill_usages_id, language_id, notes) VALUES
  (11, 6, 1, 'Diseño e implementación de endpoints RESTful para la comunicación entre el frontend y el agente de IA, incluyendo envío de preguntas y recepción de respuestas.');
-- REST API en Backend - EN
INSERT INTO skill_usages_translation (id, skill_usages_id, language_id, notes) VALUES
  (12, 6, 2, 'Design and implementation of RESTful endpoints for communication between the frontend and the AI agent, including sending questions and receiving responses.');

-- SQL en Backend - ES
INSERT INTO skill_usages_translation (id, skill_usages_id, language_id, notes) VALUES
  (13, 7, 1, 'Consultas SQL para gestión de datos, migraciones de esquemas y operaciones CRUD sobre la base de datos PostgreSQL.');
-- SQL en Backend - EN
INSERT INTO skill_usages_translation (id, skill_usages_id, language_id, notes) VALUES
  (14, 7, 2, 'SQL queries for data management, schema migrations, and CRUD operations on the PostgreSQL database.');

-- Angular en Frontend - ES
INSERT INTO skill_usages_translation (id, skill_usages_id, language_id, notes) VALUES
  (15, 8, 1, 'Framework frontend utilizado para construir la interfaz de usuario tipo chat. Implementa componentes reactivos, servicios HTTP para comunicación con el backend y routing.');
-- Angular en Frontend - EN
INSERT INTO skill_usages_translation (id, skill_usages_id, language_id, notes) VALUES
  (16, 8, 2, 'Frontend framework used to build the chat-like user interface. Implements reactive components, HTTP services for backend communication, and routing.');

-- TypeScript en Frontend - ES
INSERT INTO skill_usages_translation (id, skill_usages_id, language_id, notes) VALUES
  (17, 9, 1, 'Lenguaje tipado utilizado en toda la aplicación Angular. Proporciona seguridad de tipos, interfaces bien definidas y mejor mantenibilidad del código.');
-- TypeScript en Frontend - EN
INSERT INTO skill_usages_translation (id, skill_usages_id, language_id, notes) VALUES
  (18, 9, 2, 'Typed language used throughout the Angular application. Provides type safety, well-defined interfaces, and better code maintainability.');

-- TailwindCSS en Frontend - ES
INSERT INTO skill_usages_translation (id, skill_usages_id, language_id, notes) VALUES
  (19, 10, 1, 'Framework de CSS utility-first utilizado para estilizar la interfaz del chat de forma rápida y responsiva, con configuración personalizada en tailwind.config.js.');
-- TailwindCSS en Frontend - EN
INSERT INTO skill_usages_translation (id, skill_usages_id, language_id, notes) VALUES
  (20, 10, 2, 'Utility-first CSS framework used to style the chat interface quickly and responsively, with custom configuration in tailwind.config.js.');

-- HTML/CSS en Frontend - ES
INSERT INTO skill_usages_translation (id, skill_usages_id, language_id, notes) VALUES
  (21, 11, 1, 'Maquetación y estilos base de la aplicación web, templates de componentes Angular y estructura semántica del DOM.');
-- HTML/CSS en Frontend - EN
INSERT INTO skill_usages_translation (id, skill_usages_id, language_id, notes) VALUES
  (22, 11, 2, 'Base layout and styling of the web application, Angular component templates, and semantic DOM structure.');

-- ChromaDB en RAG - ES
INSERT INTO skill_usages_translation (id, skill_usages_id, language_id, notes) VALUES
  (23, 12, 1, 'Base de datos vectorial utilizada para almacenar embeddings de documentos y realizar búsquedas semánticas por similitud para el pipeline RAG del agente.');
-- ChromaDB en RAG - EN
INSERT INTO skill_usages_translation (id, skill_usages_id, language_id, notes) VALUES
  (24, 12, 2, 'Vector database used to store document embeddings and perform semantic similarity searches for the agent RAG pipeline.');

-- LangChain en RAG - ES
INSERT INTO skill_usages_translation (id, skill_usages_id, language_id, notes) VALUES
  (25, 13, 1, 'Orquestación del pipeline RAG: carga de documentos, fragmentación (chunking), generación de embeddings y recuperación contextual con retrievers.');
-- LangChain en RAG - EN
INSERT INTO skill_usages_translation (id, skill_usages_id, language_id, notes) VALUES
  (26, 13, 2, 'RAG pipeline orchestration: document loading, chunking, embedding generation, and contextual retrieval with retrievers.');

-- OpenAI en RAG - ES
INSERT INTO skill_usages_translation (id, skill_usages_id, language_id, notes) VALUES
  (27, 14, 1, 'Generación de embeddings vectoriales con el modelo de OpenAI para representar semánticamente los documentos cargados en el vector store.');
-- OpenAI en RAG - EN
INSERT INTO skill_usages_translation (id, skill_usages_id, language_id, notes) VALUES
  (28, 14, 2, 'Vector embedding generation with OpenAI model to semantically represent documents loaded into the vector store.');

-- Python en RAG - ES
INSERT INTO skill_usages_translation (id, skill_usages_id, language_id, notes) VALUES
  (29, 15, 1, 'Scripts de procesamiento de datos, ingesta de documentos y configuración del pipeline RAG escritos en Python.');
-- Python en RAG - EN
INSERT INTO skill_usages_translation (id, skill_usages_id, language_id, notes) VALUES
  (30, 15, 2, 'Data processing scripts, document ingestion, and RAG pipeline configuration written in Python.');

-- Docker en Infraestructura - ES
INSERT INTO skill_usages_translation (id, skill_usages_id, language_id, notes) VALUES
  (31, 16, 1, 'Containerización del backend con Dockerfile multi-stage, configuración de .dockerignore y gestión de imágenes para despliegue consistente.');
-- Docker en Infraestructura - EN
INSERT INTO skill_usages_translation (id, skill_usages_id, language_id, notes) VALUES
  (32, 16, 2, 'Backend containerization with multi-stage Dockerfile, .dockerignore configuration, and image management for consistent deployment.');

-- Git en Infraestructura - ES
INSERT INTO skill_usages_translation (id, skill_usages_id, language_id, notes) VALUES
  (33, 17, 1, 'Control de versiones con Git, gestión de ramas, configuración de .gitignore y flujo de trabajo colaborativo en GitHub.');
-- Git en Infraestructura - EN
INSERT INTO skill_usages_translation (id, skill_usages_id, language_id, notes) VALUES
  (34, 17, 2, 'Version control with Git, branch management, .gitignore configuration, and collaborative workflow on GitHub.');

-- Pytest en Testing - ES
INSERT INTO skill_usages_translation (id, skill_usages_id, language_id, notes) VALUES
  (35, 18, 1, 'Framework de testing utilizado para escribir y ejecutar pruebas unitarias y de integración del backend, con fixtures y parametrización.');
-- Pytest en Testing - EN
INSERT INTO skill_usages_translation (id, skill_usages_id, language_id, notes) VALUES
  (36, 18, 2, 'Testing framework used to write and run backend unit and integration tests, with fixtures and parameterization.');

-- Python en Testing - ES
INSERT INTO skill_usages_translation (id, skill_usages_id, language_id, notes) VALUES
  (37, 19, 1, 'Lenguaje utilizado para escribir las suites de testing, mocks, y validaciones de tipos con mypy para asegurar la calidad del código.');
-- Python en Testing - EN
INSERT INTO skill_usages_translation (id, skill_usages_id, language_id, notes) VALUES
  (38, 19, 2, 'Language used to write test suites, mocks, and type validations with mypy to ensure code quality.');

-- Git en proyecto principal - ES
INSERT INTO skill_usages_translation (id, skill_usages_id, language_id, notes) VALUES
  (39, 20, 1, 'Gestión integral del repositorio del proyecto, coordinación entre backend y frontend, y flujo de trabajo con GitHub.');
-- Git en proyecto principal - EN
INSERT INTO skill_usages_translation (id, skill_usages_id, language_id, notes) VALUES
  (40, 20, 2, 'Comprehensive project repository management, backend-frontend coordination, and GitHub workflow.');

-- Docker en proyecto principal - ES
INSERT INTO skill_usages_translation (id, skill_usages_id, language_id, notes) VALUES
  (41, 21, 1, 'Estrategia general de containerización del proyecto para garantizar portabilidad y reproducibilidad del entorno.');
-- Docker en proyecto principal - EN
INSERT INTO skill_usages_translation (id, skill_usages_id, language_id, notes) VALUES
  (42, 21, 2, 'Overall project containerization strategy to ensure environment portability and reproducibility.');

-- REST API en proyecto principal - ES
INSERT INTO skill_usages_translation (id, skill_usages_id, language_id, notes) VALUES
  (43, 22, 1, 'Diseño de la arquitectura de comunicación REST entre el frontend Angular y el backend FastAPI del agente de IA.');
-- REST API en proyecto principal - EN
INSERT INTO skill_usages_translation (id, skill_usages_id, language_id, notes) VALUES
  (44, 22, 2, 'REST communication architecture design between the Angular frontend and the FastAPI backend of the AI agent.');

-- Reset sequence
SELECT setval('skill_usages_translation_id_seq', (SELECT MAX(id) FROM skill_usages_translation));


-- ============================================================
-- SEEDING: project, project_translation, skill_usages, skill_usages_translation
-- ============================================================
-- Prerequisites: tables `language` and `skill` must already exist and be populated.
-- Assumed languages: 1 = 'es', 2 = 'en'
-- Assumed skills exist with ids 1..N
-- ============================================================

BEGIN;

-- =========================
-- 1. PROJECTS (top-level, no parent)
-- =========================
INSERT INTO project (id, code, url, created_at, parent_project_id, source_id, source_type, is_archived, is_pinned, position)
VALUES
  -- === Main Projects ===
  (1,  'mesaya',              'https://github.com/StevSant/mesaYa',                    '2024-01-15', NULL, NULL, NULL,          false, true,  1),
  (2,  'mesaya-frontend',     'https://github.com/StevSant/mesaYa_frontend',            '2024-01-20', 1,    NULL, NULL,          false, true,  2),
  (3,  'mesaya-res',          'https://github.com/lesquel/mesaYa_Res',                  '2024-01-20', 1,    NULL, NULL,          false, true,  3),
  (4,  'mesaya-auth-ms',      'https://github.com/StevSant/mesaYA_auth_ms',             '2024-02-01', 1,    NULL, NULL,          false, true,  4),
  (5,  'mesaya-graphql',      'https://github.com/StevSant/mesaYA_graphql',             '2024-02-10', 1,    NULL, NULL,          false, false, 5),
  (6,  'mesaya-chatbot',      'https://github.com/StevSant/mesaYA_chatbot_service',     '2024-03-01', 1,    NULL, NULL,          false, false, 6),
  (7,  'mesaya-payment-ms',   'https://github.com/lesquel/mesaYA_payment_ms',           '2024-03-15', 1,    NULL, NULL,          false, false, 7),
  (8,  'mesaya-ws',           NULL,                                                      '2024-02-20', 1,    NULL, NULL,          false, false, 8),
  (9,  'mesaya-mcp',          'https://github.com/StevSant/mesaYA_mcp',                 '2024-04-01', 1,    NULL, NULL,          false, false, 9),
  (10, 'mesaya-partner-demo', NULL,                                                      '2024-04-10', 1,    NULL, NULL,          true,  false, 10),

  -- === Sub-projects / Modules within mesaya-res ===
  (11, 'mesaya-res-tables',        NULL, '2024-02-05', 3, 3, 'project', false, false, 1),
  (12, 'mesaya-res-restaurants',   NULL, '2024-02-05', 3, 3, 'project', false, false, 2),
  (13, 'mesaya-res-reservations',  NULL, '2024-02-10', 3, 3, 'project', false, false, 3),
  (14, 'mesaya-res-menus',         NULL, '2024-02-15', 3, 3, 'project', false, false, 4),
  (15, 'mesaya-res-reviews',       NULL, '2024-02-20', 3, 3, 'project', false, false, 5),
  (16, 'mesaya-res-payments',      NULL, '2024-03-15', 3, 3, 'project', false, false, 6),
  (17, 'mesaya-res-subscriptions', NULL, '2024-02-25', 3, 3, 'project', false, false, 7),
  (18, 'mesaya-res-seed',          NULL, '2024-02-28', 3, 3, 'project', false, false, 8),
  (19, 'mesaya-res-sonarqube',     'https://sonarcloud.io/summary/new_code?id=lesquel_mesaYa_Res', '2024-03-10', 3, 3, 'project', false, false, 9),

  -- === Sub-projects within mesaya-frontend ===
  (20, 'mesaya-fe-restaurant-map', NULL, '2024-02-15', 2, 2, 'project', false, false, 1),
  (21, 'mesaya-fe-table-spot',     NULL, '2024-02-20', 2, 2, 'project', false, false, 2),
  (22, 'mesaya-fe-i18n',           NULL, '2024-03-01', 2, 2, 'project', false, false, 3),
  (23, 'mesaya-fe-settings',       NULL, '2024-03-05', 2, 2, 'project', false, false, 4),

  -- === Sub-projects within mesaya-auth-ms ===
  (24, 'mesaya-auth-seeder',       NULL, '2024-02-05', 4, 4, 'project', false, false, 1),
  (25, 'mesaya-auth-rbac',         NULL, '2024-02-10', 4, 4, 'project', false, false, 2),

  -- === Sub-projects within mesaya-chatbot ===
  (26, 'mesaya-chatbot-prompts',   NULL, '2024-03-05', 6, 6, 'project', false, false, 1),
  (27, 'mesaya-chatbot-lang',      NULL, '2024-03-10', 6, 6, 'project', false, false, 2),

  -- === Infrastructure ===
  (28, 'mesaya-infra-kafka',       NULL, '2024-02-15', 1, NULL, NULL, false, false, 11),
  (29, 'mesaya-infra-n8n',         NULL, '2024-03-20', 1, NULL, NULL, false, false, 12),
  (30, 'mesaya-infra-docker',      NULL, '2024-01-15', 1, NULL, NULL, false, false, 13)
ON CONFLICT (id) DO NOTHING;

-- Reset sequence
SELECT setval('project_id_seq', (SELECT COALESCE(MAX(id), 0) FROM project));

-- =========================
-- 2. PROJECT TRANSLATIONS
-- =========================
INSERT INTO project_translation (project_id, language_id, title, description)
VALUES
  -- mesaya (root)
  (1, 1, 'mesaYA - Plataforma de Reservas de Restaurantes', 'Sistema completo de gestión de reservas para restaurantes con arquitectura de microservicios. Incluye frontend Angular, backend NestJS, GraphQL gateway, chatbot con IA, pasarela de pagos y WebSockets en tiempo real.'),
  (1, 2, 'mesaYA - Restaurant Reservation Platform', 'Complete restaurant reservation management system with microservices architecture. Includes Angular frontend, NestJS backend, GraphQL gateway, AI chatbot, payment gateway, and real-time WebSockets.'),

  -- mesaya-frontend
  (2, 1, 'mesaYA Frontend', 'Aplicación frontend construida con Angular 19, SSR, diseño responsivo con Material Design, internacionalización (i18n), mapas interactivos de restaurantes y gestión de mesas en tiempo real.'),
  (2, 2, 'mesaYA Frontend', 'Frontend application built with Angular 19, SSR, responsive Material Design, internationalization (i18n), interactive restaurant maps, and real-time table management.'),

  -- mesaya-res
  (3, 1, 'mesaYA Reservation Microservice', 'Microservicio principal de reservas construido con NestJS siguiendo Clean Architecture y DDD. Gestiona restaurantes, secciones, mesas, menús, reseñas, pagos y suscripciones. Integrado con SonarQube para calidad de código.'),
  (3, 2, 'mesaYA Reservation Microservice', 'Main reservation microservice built with NestJS following Clean Architecture and DDD. Manages restaurants, sections, tables, menus, reviews, payments, and subscriptions. Integrated with SonarQube for code quality.'),

  -- mesaya-auth-ms
  (4, 1, 'mesaYA Auth Microservice', 'Microservicio de autenticación y autorización con RBAC (Control de Acceso Basado en Roles). Maneja usuarios, roles, permisos y siembra automática de datos al iniciar.'),
  (4, 2, 'mesaYA Auth Microservice', 'Authentication and authorization microservice with RBAC (Role-Based Access Control). Handles users, roles, permissions, and automatic data seeding on startup.'),

  -- mesaya-graphql
  (5, 1, 'mesaYA GraphQL Gateway', 'Gateway GraphQL construido con Python y Strawberry siguiendo arquitectura modular inspirada en Clean Architecture. Agrega múltiples microservicios REST bajo una API GraphQL unificada.'),
  (5, 2, 'mesaYA GraphQL Gateway', 'GraphQL gateway built with Python and Strawberry following modular architecture inspired by Clean Architecture. Aggregates multiple REST microservices under a unified GraphQL API.'),

  -- mesaya-chatbot
  (6, 1, 'mesaYA Chatbot Service', 'Servicio de chatbot con IA que soporta múltiples idiomas (español/inglés) y niveles de acceso (invitado, usuario, dueño, admin). Genera prompts contextuales según el rol del usuario.'),
  (6, 2, 'mesaYA Chatbot Service', 'AI chatbot service supporting multiple languages (Spanish/English) and access levels (guest, user, owner, admin). Generates contextual prompts based on user role.'),

  -- mesaya-payment-ms
  (7, 1, 'mesaYA Payment Microservice', 'Microservicio de pasarela de pagos para procesar transacciones de reservas y suscripciones de restaurantes.'),
  (7, 2, 'mesaYA Payment Microservice', 'Payment gateway microservice for processing restaurant reservation and subscription transactions.'),

  -- mesaya-ws
  (8, 1, 'mesaYA WebSocket Service', 'Servicio de WebSockets para comunicación en tiempo real: selección de mesas, actualizaciones de estado y notificaciones push entre clientes y el backend.'),
  (8, 2, 'mesaYA WebSocket Service', 'WebSocket service for real-time communication: table selection, status updates, and push notifications between clients and the backend.'),

  -- mesaya-mcp
  (9, 1, 'mesaYA MCP (Model Context Protocol)', 'Integración con Model Context Protocol para proporcionar contexto del sistema a asistentes de IA y herramientas de desarrollo.'),
  (9, 2, 'mesaYA MCP (Model Context Protocol)', 'Model Context Protocol integration to provide system context to AI assistants and development tools.'),

  -- mesaya-partner-demo (archived)
  (10, 1, 'mesaYA Partner Demo', 'Aplicación de demostración para socios comerciales. Archivada tras completar fase de presentación.'),
  (10, 2, 'mesaYA Partner Demo', 'Demo application for business partners. Archived after presentation phase completed.'),

  -- Sub-projects: mesaya-res modules
  (11, 1, 'Módulo de Mesas', 'Gestión completa de mesas: CRUD, validación de layout (colisiones, límites), analíticas, y eventos Kafka para sincronización en tiempo real. Entidad rica con DDD.'),
  (11, 2, 'Tables Module', 'Complete table management: CRUD, layout validation (collisions, bounds), analytics, and Kafka events for real-time sync. Rich entity with DDD.'),

  (12, 1, 'Módulo de Restaurantes', 'Gestión de restaurantes con horarios, días de operación, ubicación y capacidad total. Integración con Auth MS para verificar propietarios.'),
  (12, 2, 'Restaurants Module', 'Restaurant management with schedules, operating days, location, and total capacity. Integration with Auth MS for owner verification.'),

  (13, 1, 'Módulo de Reservaciones', 'Sistema de reservaciones con gestión de estados, validación de disponibilidad y relación con usuario, restaurante y mesa.'),
  (13, 2, 'Reservations Module', 'Reservation system with state management, availability validation, and user/restaurant/table relationships.'),

  (14, 1, 'Módulo de Menús y Platos', 'Gestión de menús y platos por restaurante con precios, descripciones e imágenes.'),
  (14, 2, 'Menus & Dishes Module', 'Menu and dish management per restaurant with prices, descriptions, and images.'),

  (15, 1, 'Módulo de Reseñas', 'Sistema de calificaciones y comentarios de usuarios sobre restaurantes.'),
  (15, 2, 'Reviews Module', 'User ratings and comments system for restaurants.'),

  (16, 1, 'Módulo de Pagos', 'Procesamiento de pagos para reservaciones y suscripciones con Value Objects para moneda y estado de pago.'),
  (16, 2, 'Payments Module', 'Payment processing for reservations and subscriptions with Value Objects for currency and payment status.'),

  (17, 1, 'Módulo de Suscripciones', 'Planes de suscripción para restaurantes con estados y fechas de vigencia.'),
  (17, 2, 'Subscriptions Module', 'Subscription plans for restaurants with states and validity dates.'),

  (18, 1, 'Módulo de Seed', 'Orquestador de seeding con patrón Facade. Siembra datos en orden: planes → media → restaurantes → secciones → mesas → menús → reservas → reseñas → pagos.'),
  (18, 2, 'Seed Module', 'Seeding orchestrator with Facade pattern. Seeds data in order: plans → media → restaurants → sections → tables → menus → reservations → reviews → payments.'),

  (19, 1, 'Integración SonarQube', 'Configuración de calidad de código con SonarCloud: cobertura de tests al 90%, CI/CD con GitHub Actions, y Quality Gate personalizado.'),
  (19, 2, 'SonarQube Integration', 'Code quality configuration with SonarCloud: 90% test coverage, CI/CD with GitHub Actions, and custom Quality Gate.'),

  -- Sub-projects: mesaya-frontend modules
  (20, 1, 'Mapa Interactivo de Restaurante', 'Componente de mapa canvas que renderiza secciones, mesas con assets visuales, selección en tiempo real y estados de disponibilidad.'),
  (20, 2, 'Interactive Restaurant Map', 'Canvas map component rendering sections, tables with visual assets, real-time selection, and availability states.'),

  (21, 1, 'Adaptador de Repositorio de Mesas', 'Adaptador que integra datos de mesas desde HTTP y WebSocket en tiempo real con mapeo robusto de payloads polimórficos.'),
  (21, 2, 'Table Spot Repository Adapter', 'Adapter integrating table data from HTTP and real-time WebSocket with robust polymorphic payload mapping.'),

  (22, 1, 'Internacionalización (i18n)', 'Sistema de traducción con soporte para español e inglés, pipe de traducción, y selección de idioma persistente.'),
  (22, 2, 'Internationalization (i18n)', 'Translation system supporting Spanish and English, translation pipe, and persistent language selection.'),

  (23, 1, 'Modal de Configuración', 'Componente de configuración del usuario con selector de idioma y preferencias de la aplicación.'),
  (23, 2, 'Settings Modal', 'User settings component with language selector and application preferences.'),

  -- Sub-projects: mesaya-auth modules
  (24, 1, 'Seeder de Autenticación', 'Siembra automática de permisos, roles y usuarios por defecto al iniciar el microservicio. Implementa OnModuleInit de NestJS.'),
  (24, 2, 'Auth Seeder', 'Automatic seeding of permissions, roles, and default users on microservice startup. Implements NestJS OnModuleInit.'),

  (25, 1, 'Sistema RBAC', 'Control de Acceso Basado en Roles con entidades de permiso, rol y usuario. Soporta asignación granular de permisos.'),
  (25, 2, 'RBAC System', 'Role-Based Access Control with permission, role, and user entities. Supports granular permission assignment.'),

  -- Sub-projects: mesaya-chatbot modules
  (26, 1, 'Sistema de Prompts', 'Generación de prompts del sistema por nivel de acceso y rol con conocimiento de dominio especializado (cliente vs restaurante).'),
  (26, 2, 'Prompt System', 'System prompt generation by access level and role with specialized domain knowledge (client vs restaurant).'),

  (27, 1, 'Soporte Multiidioma', 'Módulo de idiomas soportados con español como idioma por defecto e inglés como alternativa.'),
  (27, 2, 'Multi-language Support', 'Supported languages module with Spanish as default and English as alternative.'),

  -- Infrastructure projects
  (28, 1, 'Infraestructura Kafka', 'Configuración de Apache Kafka para comunicación asíncrona entre microservicios: eventos de mesas, reservaciones y pagos.'),
  (28, 2, 'Kafka Infrastructure', 'Apache Kafka configuration for asynchronous communication between microservices: table, reservation, and payment events.'),

  (29, 1, 'Automatización n8n', 'Flujos de automatización con n8n para integraciones y workflows del sistema.'),
  (29, 2, 'n8n Automation', 'Automation flows with n8n for system integrations and workflows.'),

  (30, 1, 'Docker & Orquestación', 'Configuración de Docker Compose para levantar todos los microservicios, bases de datos y servicios de infraestructura del ecosistema mesaYA.'),
  (30, 2, 'Docker & Orchestration', 'Docker Compose configuration to spin up all microservices, databases, and infrastructure services of the mesaYA ecosystem.')
ON CONFLICT (project_id, language_id) DO NOTHING;


-- =========================
-- 3. SKILL USAGES
-- =========================
-- Assumes skills already exist. Mapping:
--   1=TypeScript, 2=NestJS, 3=Angular, 4=Python, 5=Strawberry/GraphQL,
--   6=PostgreSQL, 7=Docker, 8=Kafka, 9=Jest, 10=SonarQube,
--   11=WebSocket, 12=DDD, 13=Clean Architecture, 14=Git,
--   15=Node.js, 16=HTML/CSS, 17=SCSS, 18=REST API, 19=JWT,
--   20=Swagger/OpenAPI
-- Adjust skill IDs to match YOUR actual skill table.

INSERT INTO skill_usages (id, skill_id, source_id, source_type, level, started_at, ended_at, is_archived, is_pinned, position)
VALUES
  -- === mesaYA Root (project 1) ===
  (1,  7,  1, 'project', 4, '2024-01-15', NULL, false, true,  1),   -- Docker
  (2,  8,  1, 'project', 3, '2024-02-15', NULL, false, false, 2),   -- Kafka
  (3,  14, 1, 'project', 5, '2024-01-15', NULL, false, false, 3),   -- Git
  (4,  6,  1, 'project', 4, '2024-01-15', NULL, false, true,  4),   -- PostgreSQL

  -- === mesaYA Frontend (project 2) ===
  (5,  1,  2, 'project', 5, '2024-01-20', NULL, false, true,  1),   -- TypeScript
  (6,  3,  2, 'project', 5, '2024-01-20', NULL, false, true,  2),   -- Angular
  (7,  16, 2, 'project', 4, '2024-01-20', NULL, false, false, 3),   -- HTML/CSS
  (8,  17, 2, 'project', 4, '2024-01-20', NULL, false, false, 4),   -- SCSS
  (9,  11, 2, 'project', 4, '2024-02-20', NULL, false, false, 5),   -- WebSocket

  -- === mesaYA Res (project 3) ===
  (10, 1,  3, 'project', 5, '2024-01-20', NULL, false, true,  1),   -- TypeScript
  (11, 2,  3, 'project', 5, '2024-01-20', NULL, false, true,  2),   -- NestJS
  (12, 6,  3, 'project', 4, '2024-01-20', NULL, false, true,  3),   -- PostgreSQL
  (13, 12, 3, 'project', 4, '2024-01-20', NULL, false, true,  4),   -- DDD
  (14, 13, 3, 'project', 4, '2024-01-20', NULL, false, true,  5),   -- Clean Architecture
  (15, 9,  3, 'project', 4, '2024-02-01', NULL, false, false, 6),   -- Jest
  (16, 10, 3, 'project', 3, '2024-03-10', NULL, false, false, 7),   -- SonarQube
  (17, 8,  3, 'project', 3, '2024-02-15', NULL, false, false, 8),   -- Kafka
  (18, 20, 3, 'project', 4, '2024-01-25', NULL, false, false, 9),   -- Swagger/OpenAPI
  (19, 18, 3, 'project', 5, '2024-01-20', NULL, false, false, 10),  -- REST API

  -- === mesaYA Auth MS (project 4) ===
  (20, 1,  4, 'project', 5, '2024-02-01', NULL, false, true,  1),   -- TypeScript
  (21, 2,  4, 'project', 5, '2024-02-01', NULL, false, true,  2),   -- NestJS
  (22, 19, 4, 'project', 4, '2024-02-01', NULL, false, true,  3),   -- JWT
  (23, 6,  4, 'project', 4, '2024-02-01', NULL, false, false, 4),   -- PostgreSQL
  (24, 15, 4, 'project', 4, '2024-02-01', NULL, false, false, 5),   -- Node.js

  -- === mesaYA GraphQL (project 5) ===
  (25, 4,  5, 'project', 4, '2024-02-10', NULL, false, true,  1),   -- Python
  (26, 5,  5, 'project', 4, '2024-02-10', NULL, false, true,  2),   -- Strawberry/GraphQL
  (27, 13, 5, 'project', 3, '2024-02-10', NULL, false, false, 3),   -- Clean Architecture
  (28, 18, 5, 'project', 4, '2024-02-10', NULL, false, false, 4),   -- REST API (consuming)

  -- === mesaYA Chatbot (project 6) ===
  (29, 4,  6, 'project', 4, '2024-03-01', NULL, false, true,  1),   -- Python
  (30, 18, 6, 'project', 3, '2024-03-01', NULL, false, false, 2),   -- REST API

  -- === mesaYA Payment MS (project 7) ===
  (31, 1,  7, 'project', 4, '2024-03-15', NULL, false, true,  1),   -- TypeScript
  (32, 2,  7, 'project', 4, '2024-03-15', NULL, false, true,  2),   -- NestJS
  (33, 12, 7, 'project', 3, '2024-03-15', NULL, false, false, 3),   -- DDD

  -- === mesaYA WebSocket (project 8) ===
  (34, 11, 8, 'project', 5, '2024-02-20', NULL, false, true,  1),   -- WebSocket
  (35, 1,  8, 'project', 4, '2024-02-20', NULL, false, false, 2),   -- TypeScript
  (36, 15, 8, 'project', 4, '2024-02-20', NULL, false, false, 3),   -- Node.js

  -- === mesaYA MCP (project 9) ===
  (37, 1,  9, 'project', 3, '2024-04-01', NULL, false, false, 1),   -- TypeScript

  -- === Tables Module (project 11) ===
  (38, 12, 11, 'project', 5, '2024-02-05', NULL, false, true,  1),  -- DDD
  (39, 9,  11, 'project', 4, '2024-02-05', NULL, false, false, 2),  -- Jest

  -- === Seed Module (project 18) ===
  (40, 2,  18, 'project', 4, '2024-02-28', NULL, false, false, 1),  -- NestJS
  (41, 6,  18, 'project', 4, '2024-02-28', NULL, false, false, 2),  -- PostgreSQL

  -- === Restaurant Map (project 20) ===
  (42, 3,  20, 'project', 5, '2024-02-15', NULL, false, true,  1),  -- Angular
  (43, 16, 20, 'project', 4, '2024-02-15', NULL, false, false, 2),  -- HTML/CSS

  -- === i18n (project 22) ===
  (44, 3,  22, 'project', 4, '2024-03-01', NULL, false, false, 1),  -- Angular
  (45, 1,  22, 'project', 4, '2024-03-01', NULL, false, false, 2),  -- TypeScript

  -- === Auth Seeder (project 24) ===
  (46, 2,  24, 'project', 4, '2024-02-05', NULL, false, false, 1),  -- NestJS

  -- === RBAC System (project 25) ===
  (47, 19, 25, 'project', 4, '2024-02-10', NULL, false, true,  1),  -- JWT
  (48, 2,  25, 'project', 4, '2024-02-10', NULL, false, false, 2),  -- NestJS

  -- === Chatbot Prompts (project 26) ===
  (49, 4,  26, 'project', 4, '2024-03-05', NULL, false, true,  1),  -- Python

  -- === Kafka Infra (project 28) ===
  (50, 8,  28, 'project', 4, '2024-02-15', NULL, false, true,  1),  -- Kafka
  (51, 7,  28, 'project', 4, '2024-02-15', NULL, false, false, 2),  -- Docker

  -- === Docker Orchestration (project 30) ===
  (52, 7,  30, 'project', 5, '2024-01-15', NULL, false, true,  1),  -- Docker
  (53, 6,  30, 'project', 3, '2024-01-15', NULL, false, false, 2)   -- PostgreSQL
ON CONFLICT (id) DO NOTHING;

-- Reset sequence
SELECT setval('skill_usages_id_seq', (SELECT COALESCE(MAX(id), 0) FROM skill_usages));


-- =========================
-- 4. SKILL USAGES TRANSLATIONS
-- =========================
INSERT INTO skill_usages_translation (skill_usages_id, language_id, notes)
VALUES
  -- Docker in mesaYA root
  (1, 1, 'Orquestación de todos los microservicios con Docker Compose, configuración de redes, volúmenes y variables de entorno.'),
  (1, 2, 'Orchestration of all microservices with Docker Compose, network configuration, volumes, and environment variables.'),

  -- Kafka in mesaYA root
  (2, 1, 'Comunicación asíncrona entre microservicios para eventos de mesas, reservas y pagos.'),
  (2, 2, 'Asynchronous communication between microservices for table, reservation, and payment events.'),

  -- Git in mesaYA root
  (3, 1, 'Gestión de repositorio monorepo con submódulos Git para cada microservicio.'),
  (3, 2, 'Monorepo management with Git submodules for each microservice.'),

  -- PostgreSQL in mesaYA root
  (4, 1, 'Base de datos principal para todos los microservicios con TypeORM.'),
  (4, 2, 'Main database for all microservices with TypeORM.'),

  -- TypeScript in Frontend
  (5, 1, 'Tipado estricto en toda la aplicación Angular con interfaces, genéricos y tipos utilitarios.'),
  (5, 2, 'Strict typing across the entire Angular application with interfaces, generics, and utility types.'),

  -- Angular in Frontend
  (6, 1, 'Angular 19 con SSR, signals, standalone components, lazy loading y arquitectura modular por features.'),
  (6, 2, 'Angular 19 with SSR, signals, standalone components, lazy loading, and feature-based modular architecture.'),

  -- WebSocket in Frontend
  (9, 1, 'Conexión en tiempo real para selección de mesas y actualizaciones de estado con reconexión automática.'),
  (9, 2, 'Real-time connection for table selection and status updates with automatic reconnection.'),

  -- TypeScript in mesaYA Res
  (10, 1, 'TypeScript estricto con path aliases, decoradores NestJS y tipado exhaustivo en DTOs y entidades de dominio.'),
  (10, 2, 'Strict TypeScript with path aliases, NestJS decorators, and exhaustive typing in DTOs and domain entities.'),

  -- NestJS in mesaYA Res
  (11, 1, 'Framework principal: módulos, providers con inyección de dependencias, guards, filtros de excepciones personalizados y Swagger automático.'),
  (11, 2, 'Main framework: modules, providers with dependency injection, guards, custom exception filters, and automatic Swagger.'),

  -- DDD in mesaYA Res
  (13, 1, 'Entidades ricas con Value Objects, servicios de dominio, puertos y adaptadores. Separación estricta de capas: domain, application, infrastructure, interface.'),
  (13, 2, 'Rich entities with Value Objects, domain services, ports and adapters. Strict layer separation: domain, application, infrastructure, interface.'),

  -- Clean Architecture in mesaYA Res
  (14, 1, 'Casos de uso independientes, repositorios abstractos como puertos, mappers entre capas y eventos de dominio.'),
  (14, 2, 'Independent use cases, abstract repositories as ports, inter-layer mappers, and domain events.'),

  -- Jest in mesaYA Res
  (15, 1, 'Tests unitarios con cobertura al 90%, mocks de servicios y repositorios, verificación de entidades de dominio.'),
  (15, 2, 'Unit tests with 90% coverage, service and repository mocks, domain entity verification.'),

  -- SonarQube in mesaYA Res
  (16, 1, 'Integración con SonarCloud vía GitHub Actions, Quality Gate personalizado, análisis de code smells y cobertura LCOV.'),
  (16, 2, 'SonarCloud integration via GitHub Actions, custom Quality Gate, code smells analysis, and LCOV coverage.'),

  -- Kafka in mesaYA Res
  (17, 1, 'Productor de eventos Kafka para sincronizar cambios de mesas y reservaciones entre microservicios.'),
  (17, 2, 'Kafka event producer to sync table and reservation changes across microservices.'),

  -- Swagger in mesaYA Res
  (18, 1, 'Documentación automática de API REST con decoradores de Swagger/OpenAPI en todos los controladores.'),
  (18, 2, 'Automatic REST API documentation with Swagger/OpenAPI decorators on all controllers.'),

  -- JWT in Auth MS
  (22, 1, 'Autenticación basada en tokens JWT con refresh tokens, hash de contraseñas y middleware de verificación.'),
  (22, 2, 'JWT-based authentication with refresh tokens, password hashing, and verification middleware.'),

  -- Python in GraphQL
  (25, 1, 'Backend GraphQL en Python con gestión de dependencias mediante uv y arquitectura modular.'),
  (25, 2, 'GraphQL backend in Python with dependency management via uv and modular architecture.'),

  -- Strawberry/GraphQL in GraphQL
  (26, 1, 'Schema GraphQL con Strawberry: types, queries, mutations y resolvers que consumen APIs REST de microservicios.'),
  (26, 2, 'GraphQL schema with Strawberry: types, queries, mutations, and resolvers consuming REST microservice APIs.'),

  -- Python in Chatbot
  (29, 1, 'Servicio de chatbot con generación de prompts por nivel de acceso (GUEST, USER, OWNER, ADMIN) y soporte bilingüe.'),
  (29, 2, 'Chatbot service with prompt generation by access level (GUEST, USER, OWNER, ADMIN) and bilingual support.'),

  -- DDD in Tables Module
  (38, 1, 'Entidad Table con validación de layout (colisiones, límites), snapshot pattern, rehydrate y eventos de dominio.'),
  (38, 2, 'Table entity with layout validation (collisions, bounds), snapshot pattern, rehydrate, and domain events.'),

  -- NestJS in Seed Module
  (40, 1, 'Patrón Facade para orquestar seeding en 5 fases con servicios especializados e inyección de dependencias.'),
  (40, 2, 'Facade pattern to orchestrate seeding in 5 phases with specialized services and dependency injection.'),

  -- Angular in Restaurant Map
  (42, 1, 'Componente de canvas interactivo con renderizado de secciones, mesas, assets visuales y estados de selección en tiempo real.'),
  (42, 2, 'Interactive canvas component with section, table, visual asset rendering, and real-time selection states.'),

  -- Angular in i18n
  (44, 1, 'Sistema de internacionalización con TranslatePipe, servicio I18nPort abstracto y persistencia de preferencia de idioma.'),
  (44, 2, 'Internationalization system with TranslatePipe, abstract I18nPort service, and language preference persistence.'),

  -- NestJS in Auth Seeder
  (46, 1, 'Implementa OnModuleInit para sembrar permisos, roles y usuarios por defecto automáticamente al arrancar.'),
  (46, 2, 'Implements OnModuleInit to automatically seed permissions, roles, and default users on startup.'),

  -- JWT in RBAC
  (47, 1, 'Sistema de permisos granulares con roles predefinidos y asignación dinámica de permisos a usuarios.'),
  (47, 2, 'Granular permission system with predefined roles and dynamic permission assignment to users.'),

  -- Kafka in Infra
  (50, 1, 'Configuración de brokers Kafka, topics para eventos de dominio y conectores entre microservicios.'),
  (50, 2, 'Kafka broker configuration, domain event topics, and connectors between microservices.'),

  -- Docker in Orchestration
  (52, 1, 'Docker Compose con servicios: PostgreSQL, Kafka, Zookeeper, n8n, y todos los microservicios del ecosistema mesaYA.'),
  (52, 2, 'Docker Compose with services: PostgreSQL, Kafka, Zookeeper, n8n, and all mesaYA ecosystem microservices.')
ON CONFLICT (skill_usages_id, language_id) DO NOTHING;

COMMIT;

-- ============================================================
-- ASSUMPTIONS:
--   language(id=1) = 'es' (Spanish)
--   language(id=2) = 'en' (English)
--
--   skill table already seeded with these IDs:
--     skill(id=1)  = Python
--     skill(id=2)  = Playwright
--     skill(id=3)  = Pydantic
--     skill(id=4)  = Clean Architecture
--     skill(id=5)  = Async Programming
--     skill(id=6)  = Web Scraping
--     skill(id=7)  = GraphQL
--     skill(id=8)  = REST API
--     skill(id=9)  = Logging
--     skill(id=10) = Regex
--     skill(id=11) = Dependency Injection
--     skill(id=12) = Design Patterns
-- ============================================================

-- =========================
-- 1. PROJECT SEEDING
-- =========================

-- 1a. Root project (the repository itself)
INSERT INTO project (id, code, url, created_at, parent_project_id, source_id, source_type, is_archived, is_pinned, position)
VALUES
  (1, 'rosseta-stone-script-a', 'https://github.com/StevSant/rosseta_stone_script_lesson_finisher_a', '2025-01-26', NULL, NULL, NULL, false, true, 1);

-- 1b. Sub-projects / architectural layers (children of root)
INSERT INTO project (id, code, url, created_at, parent_project_id, source_id, source_type, is_archived, is_pinned, position)
VALUES
  -- Domain Layer
  (2, 'rosseta-domain-layer',       NULL, '2025-01-26', 1, NULL, NULL, false, false, 1),
  -- Application Layer (use cases, services, orchestrators, ports)
  (3, 'rosseta-application-layer',  NULL, '2025-01-26', 1, NULL, NULL, false, false, 2),
  -- Infrastructure Layer (adapters, logging, settings)
  (4, 'rosseta-infrastructure-layer', NULL, '2025-01-26', 1, NULL, NULL, false, false, 3),
  -- Presentation Layer (CLI, dependency factory)
  (5, 'rosseta-presentation-layer', NULL, '2025-01-26', 1, NULL, NULL, false, false, 4),
  -- Shared Layer (mixins, utils, constants)
  (6, 'rosseta-shared-layer',       NULL, '2025-01-26', 1, NULL, NULL, false, false, 5);

-- 1c. Granular sub-modules under Application Layer
INSERT INTO project (id, code, url, created_at, parent_project_id, source_id, source_type, is_archived, is_pinned, position)
VALUES
  (7,  'rosseta-use-case-complete-foundations', NULL, '2025-01-26', 3, NULL, NULL, false, false, 1),
  (8,  'rosseta-use-case-go-to-foundations',    NULL, '2025-01-26', 3, NULL, NULL, false, false, 2),
  (9,  'rosseta-use-case-login',                NULL, '2025-01-26', 3, NULL, NULL, false, false, 3),
  (10, 'rosseta-service-path-calculator',       NULL, '2025-01-26', 3, NULL, NULL, false, false, 4),
  (11, 'rosseta-service-content-filter',        NULL, '2025-01-26', 3, NULL, NULL, false, false, 5),
  (12, 'rosseta-service-report-generator',      NULL, '2025-01-26', 3, NULL, NULL, false, false, 6),
  (13, 'rosseta-service-session-capturer',      NULL, '2025-01-26', 3, NULL, NULL, false, false, 7),
  (14, 'rosseta-orchestrator-open-foundations',  NULL, '2025-01-26', 3, NULL, NULL, false, false, 8),
  (15, 'rosseta-orchestrator-complete-foundations', NULL, '2025-01-26', 3, NULL, NULL, false, false, 9);

-- 1d. Granular sub-modules under Infrastructure Layer
INSERT INTO project (id, code, url, created_at, parent_project_id, source_id, source_type, is_archived, is_pinned, position)
VALUES
  (16, 'rosseta-adapter-playwright-browser',     NULL, '2025-01-26', 4, NULL, NULL, false, false, 1),
  (17, 'rosseta-adapter-foundations-api',        NULL, '2025-01-26', 4, NULL, NULL, false, false, 2),
  (18, 'rosseta-adapter-course-menu-parser',     NULL, '2025-01-26', 4, NULL, NULL, false, false, 3),
  (19, 'rosseta-infra-logging',                  NULL, '2025-01-26', 4, NULL, NULL, false, false, 4),
  (20, 'rosseta-infra-settings',                 NULL, '2025-01-26', 4, NULL, NULL, false, false, 5),
  (21, 'rosseta-adapter-debug-dumper',           NULL, '2025-01-26', 4, NULL, NULL, false, false, 6),
  (22, 'rosseta-adapter-patterns',               NULL, '2025-01-26', 4, NULL, NULL, false, false, 7);

-- Reset sequence
SELECT setval('project_id_seq', (SELECT MAX(id) FROM project));


-- =========================
-- 2. PROJECT_TRANSLATION SEEDING
-- =========================

INSERT INTO project_translation (project_id, language_id, title, description)
VALUES
  -- Root project
  (1, 1, 'Rosetta Stone Script A - Automatización de Lecciones',
       'Bot de automatización para completar lecciones de Rosetta Stone Foundations. Utiliza Playwright para navegación web, captura de sesión mediante interceptación de tráfico de red, y APIs REST/GraphQL para enviar puntuaciones de completación de forma programática.'),
  (1, 2, 'Rosetta Stone Script A - Lesson Finisher',
       'Automation bot for completing Rosetta Stone Foundations lessons. Uses Playwright for web navigation, session capture via network traffic interception, and REST/GraphQL APIs to programmatically submit path completion scores.'),

  -- Domain Layer
  (2, 1, 'Capa de Dominio',
       'Entidades de negocio puras sin dependencias externas: CourseMenu, Unit, Lesson, Path, CompletionStats, Credentials. Incluye constantes de dominio (timeouts, URLs, tiempos de espera).'),
  (2, 2, 'Domain Layer',
       'Pure business entities with no external dependencies: CourseMenu, Unit, Lesson, Path, CompletionStats, Credentials. Includes domain constants (timeouts, URLs, wait times).'),

  -- Application Layer
  (3, 1, 'Capa de Aplicación',
       'Casos de uso, servicios de aplicación, orquestadores y puertos (interfaces). Implementa la lógica de negocio de completación de Foundations siguiendo arquitectura hexagonal.'),
  (3, 2, 'Application Layer',
       'Use cases, application services, orchestrators and ports (interfaces). Implements Foundations completion business logic following hexagonal architecture.'),

  -- Infrastructure Layer
  (4, 1, 'Capa de Infraestructura',
       'Adaptadores de Playwright, API de Foundations (REST XML + GraphQL), sistema de logging con formatters JSON/File, configuración con Pydantic Settings, y diagnósticos de debug.'),
  (4, 2, 'Infrastructure Layer',
       'Playwright adapters, Foundations API adapter (REST XML + GraphQL), logging system with JSON/File formatters, configuration via Pydantic Settings, and debug diagnostics.'),

  -- Presentation Layer
  (5, 1, 'Capa de Presentación',
       'CLI principal (RosettaCLI) que orquesta la ejecución completa, y DependencyFactory para inyección de dependencias. Punto de entrada del sistema.'),
  (5, 2, 'Presentation Layer',
       'Main CLI (RosettaCLI) that orchestrates the complete execution, and DependencyFactory for dependency injection. System entry point.'),

  -- Shared Layer
  (6, 1, 'Capa Compartida',
       'Mixins reutilizables (LoggingMixin), utilidades compartidas, patrones compilados de regex, y constantes globales del sistema.'),
  (6, 2, 'Shared Layer',
       'Reusable mixins (LoggingMixin), shared utilities, compiled regex patterns, and global system constants.'),

  -- Use Case: Complete Foundations
  (7, 1, 'Caso de Uso: Completar Foundations',
       'Orquesta la completación automática de lecciones de Foundations. Itera unidades→lecciones→paths, filtra contenido con ContentFilter, calcula tiempos con PathCalculator, y envía puntuaciones vía API. Soporta concurrencia con semáforo de 50 tareas.'),
  (7, 2, 'Use Case: Complete Foundations',
       'Orchestrates automatic completion of Foundations lessons. Iterates units→lessons→paths, filters content with ContentFilter, calculates times with PathCalculator, and submits scores via API. Supports concurrency with 50-task semaphore.'),

  -- Use Case: Go To Foundations
  (8, 1, 'Caso de Uso: Navegar a Foundations',
       'Navega desde el dashboard hasta la sección Foundations. Captura el nombre del usuario desde la interfaz del dashboard.'),
  (8, 2, 'Use Case: Go To Foundations',
       'Navigates from dashboard to Foundations section. Captures user name from the dashboard interface.'),

  -- Use Case: Login
  (9, 1, 'Caso de Uso: Iniciar Sesión en Rosetta',
       'Automatiza el proceso de login en Rosetta Stone usando credenciales configuradas.'),
  (9, 2, 'Use Case: Login to Rosetta',
       'Automates the Rosetta Stone login process using configured credentials.'),

  -- Service: Path Calculator
  (10, 1, 'Servicio: Calculadora de Paths',
        'Calcula tiempos de completación y puntajes realistas para cada path. Genera variaciones aleatorias para simular comportamiento humano. Configurable por porcentaje objetivo y offset de tiempo.'),
  (10, 2, 'Service: Path Calculator',
        'Calculates realistic completion times and scores for each path. Generates random variations to simulate human behavior. Configurable by target percentage and time offset.'),

  -- Service: Content Filter
  (11, 1, 'Servicio: Filtro de Contenido',
        'Determina qué unidades, lecciones y tipos de paths procesar basándose en la configuración. Soporta force_recomplete para re-completar paths ya terminados.'),
  (11, 2, 'Service: Content Filter',
        'Determines which units, lessons and path types to process based on configuration. Supports force_recomplete to re-complete already finished paths.'),

  -- Service: Report Generator
  (12, 1, 'Servicio: Generador de Reportes',
        'Genera reportes de completación formateados con estadísticas agregadas, información de sesión, credenciales usadas y progreso histórico. Guarda archivos en logs/user_data/.'),
  (12, 2, 'Service: Report Generator',
        'Generates formatted completion reports with aggregated statistics, session information, credentials used and historical progress. Saves files to logs/user_data/.'),

  -- Service: Session Capturer
  (13, 1, 'Servicio: Capturador de Sesión',
        'Intercepta tráfico de red de Playwright para capturar tokens de autorización, session_token, school_id, user_id y lang_code desde las peticiones a rosettastone.com y tracking.rosettastone.com.'),
  (13, 2, 'Service: Session Capturer',
        'Intercepts Playwright network traffic to capture authorization tokens, session_token, school_id, user_id and lang_code from requests to rosettastone.com and tracking.rosettastone.com.'),

  -- Orchestrator: Open Foundations
  (14, 1, 'Orquestador: Abrir Foundations',
        'Compone los casos de uso de Login y GoToFoundations. Coordina la autenticación, navegación y captura de datos de sesión.'),
  (14, 2, 'Orchestrator: Open Foundations',
        'Composes Login and GoToFoundations use cases. Coordinates authentication, navigation and session data capture.'),

  -- Orchestrator: Complete Foundations
  (15, 1, 'Orquestador: Completar Foundations',
        'Coordina el flujo completo de completación. Delega generación de reportes a ReportGenerator y análisis histórico a ReportHistoryAnalyzer.'),
  (15, 2, 'Orchestrator: Complete Foundations',
        'Coordinates the complete completion flow. Delegates report generation to ReportGenerator and historical analysis to ReportHistoryAnalyzer.'),

  -- Adapter: Playwright Browser
  (16, 1, 'Adaptador: Navegador Playwright',
        'Proveedor de navegador web usando Playwright. Configura headless, slow_mo, user_agent, locale y viewport. Maneja el ciclo de vida del browser y sesiones web.'),
  (16, 2, 'Adapter: Playwright Browser',
        'Web browser provider using Playwright. Configures headless, slow_mo, user_agent, locale and viewport. Manages browser lifecycle and web sessions.'),

  -- Adapter: Foundations API
  (17, 1, 'Adaptador: API de Foundations',
        'Implementación de FoundationsApiPort usando Playwright APIRequestContext. Realiza peticiones GraphQL para obtener el menú de cursos y peticiones REST XML para actualizar puntuaciones de paths.'),
  (17, 2, 'Adapter: Foundations API',
        'FoundationsApiPort implementation using Playwright APIRequestContext. Makes GraphQL requests to fetch course menu and REST XML requests to update path scores.'),

  -- Adapter: Course Menu Parser
  (18, 1, 'Adaptador: Parser de Menú de Cursos',
        'Convierte respuestas JSON de GraphQL a entidades de dominio (CourseMenu, Unit, Lesson, Path). Parsea estructura jerárquica del curso.'),
  (18, 2, 'Adapter: Course Menu Parser',
        'Converts GraphQL JSON responses to domain entities (CourseMenu, Unit, Lesson, Path). Parses hierarchical course structure.'),

  -- Infra: Logging
  (19, 1, 'Infraestructura: Sistema de Logging',
        'Sistema de logging configurable con formatters (RelPath, File, ErrorFile, JSON), rotación por tamaño/tiempo, handlers de consola y archivo, filtros de exclusión, y detección automática de raíz del proyecto.'),
  (19, 2, 'Infrastructure: Logging System',
        'Configurable logging system with formatters (RelPath, File, ErrorFile, JSON), size/time rotation, console and file handlers, exclusion filters, and automatic project root detection.'),

  -- Infra: Settings
  (20, 1, 'Infraestructura: Configuración',
        'Gestión de configuración con Pydantic Settings. Define RosettaSettings (credenciales, URLs, filtros, scoring) y BrowserSettings (headless, viewport, locale). Lee variables de entorno desde .env.'),
  (20, 2, 'Infrastructure: Settings',
        'Configuration management with Pydantic Settings. Defines RosettaSettings (credentials, URLs, filters, scoring) and BrowserSettings (headless, viewport, locale). Reads environment variables from .env.'),

  -- Adapter: Debug Dumper
  (21, 1, 'Adaptador: Volcado de Debug',
        'Implementación de DebugDumperPort para guardar texto, metadatos y capturas de pantalla en el directorio debug/ durante la ejecución.'),
  (21, 2, 'Adapter: Debug Dumper',
        'DebugDumperPort implementation for saving text, metadata and screenshots to the debug/ directory during execution.'),

  -- Adapter: Patterns
  (22, 1, 'Adaptador: Patrones Web',
        'Patrones regex compilados organizados por dominio: AuthPatterns (login/signup), FormPatterns (submit/reset), LessonPatterns (Foundations navigation). Usa compile_case_insensitive para matching robusto.'),
  (22, 2, 'Adapter: Web Patterns',
        'Compiled regex patterns organized by domain: AuthPatterns (login/signup), FormPatterns (submit/reset), LessonPatterns (Foundations navigation). Uses compile_case_insensitive for robust matching.');


-- =========================
-- 3. SKILL_USAGES SEEDING
-- =========================
-- source_type = 'project', source_id = project.id
-- level: 1=básico, 2=intermedio, 3=avanzado, 4=experto

INSERT INTO skill_usages (id, skill_id, source_id, source_type, level, started_at, ended_at, is_archived, is_pinned, position)
VALUES
  -- === Python (skill_id=1) — used across the entire project ===
  (1,  1,  1, 'project', 4, '2025-01-26', NULL, false, true,  1),   -- Root: Python 3.14, async/await, dataclasses, typing
  (2,  1,  2, 'project', 3, '2025-01-26', NULL, false, false, 1),   -- Domain: dataclasses, type hints
  (3,  1,  3, 'project', 4, '2025-01-26', NULL, false, false, 1),   -- Application: async, ABC, complex orchestration
  (4,  1,  4, 'project', 4, '2025-01-26', NULL, false, false, 1),   -- Infrastructure: advanced integrations
  (5,  1,  5, 'project', 3, '2025-01-26', NULL, false, false, 1),   -- Presentation: asyncio.run, CLI
  (6,  1,  6, 'project', 3, '2025-01-26', NULL, false, false, 1),   -- Shared: mixins, utilities

  -- === Playwright (skill_id=2) ===
  (7,  2,  1,  'project', 4, '2025-01-26', NULL, false, true,  2),   -- Root: core automation tool
  (8,  2,  16, 'project', 4, '2025-01-26', NULL, false, false, 1),   -- Browser provider adapter
  (9,  2,  17, 'project', 3, '2025-01-26', NULL, false, false, 1),   -- Foundations API via APIRequestContext
  (10, 2,  13, 'project', 3, '2025-01-26', NULL, false, false, 1),   -- Session capturer (request interception)
  (11, 2,  21, 'project', 2, '2025-01-26', NULL, false, false, 1),   -- Debug dumper (screenshots)

  -- === Pydantic (skill_id=3) ===
  (12, 3,  1,  'project', 3, '2025-01-26', NULL, false, false, 3),   -- Root: settings management
  (13, 3,  20, 'project', 3, '2025-01-26', NULL, false, false, 1),   -- Settings module: BaseSettings, validators, SettingsConfigDict

  -- === Clean Architecture (skill_id=4) ===
  (14, 4,  1,  'project', 4, '2025-01-26', NULL, false, true,  4),   -- Root: full hexagonal/clean arch
  (15, 4,  2,  'project', 3, '2025-01-26', NULL, false, false, 1),   -- Domain: pure entities
  (16, 4,  3,  'project', 4, '2025-01-26', NULL, false, false, 1),   -- Application: ports, use cases, orchestrators
  (17, 4,  4,  'project', 4, '2025-01-26', NULL, false, false, 1),   -- Infrastructure: adapters
  (18, 4,  5,  'project', 3, '2025-01-26', NULL, false, false, 1),   -- Presentation: DI factory, CLI

  -- === Async Programming (skill_id=5) ===
  (19, 5,  1,  'project', 4, '2025-01-26', NULL, false, false, 5),   -- Root: async throughout
  (20, 5,  7,  'project', 4, '2025-01-26', NULL, false, false, 1),   -- Complete Foundations: semaphore, gather, concurrent tasks
  (21, 5,  14, 'project', 3, '2025-01-26', NULL, false, false, 1),   -- Open Foundations orchestrator
  (22, 5,  15, 'project', 3, '2025-01-26', NULL, false, false, 1),   -- Complete Foundations orchestrator

  -- === Web Scraping (skill_id=6) ===
  (23, 6,  1,  'project', 3, '2025-01-26', NULL, false, false, 6),   -- Root: browser automation + data extraction
  (24, 6,  13, 'project', 4, '2025-01-26', NULL, false, false, 1),   -- Session capturer: URL parsing, header extraction
  (25, 6,  8,  'project', 3, '2025-01-26', NULL, false, false, 1),   -- Go To Foundations: DOM interaction

  -- === GraphQL (skill_id=7) ===
  (26, 7,  1,  'project', 3, '2025-01-26', NULL, false, false, 7),   -- Root: GraphQL consumption
  (27, 7,  17, 'project', 3, '2025-01-26', NULL, false, false, 2),   -- Foundations API: get_course_menu via GraphQL
  (28, 7,  18, 'project', 3, '2025-01-26', NULL, false, false, 1),   -- Course Menu Parser: GraphQL response → domain entities

  -- === REST API (skill_id=8) ===
  (29, 8,  1,  'project', 3, '2025-01-26', NULL, false, false, 8),   -- Root: REST consumption
  (30, 8,  17, 'project', 4, '2025-01-26', NULL, false, false, 3),   -- Foundations API: XML body, custom headers, path score update

  -- === Logging (skill_id=9) ===
  (31, 9,  1,  'project', 3, '2025-01-26', NULL, false, false, 9),   -- Root: comprehensive logging
  (32, 9,  19, 'project', 4, '2025-01-26', NULL, false, false, 1),   -- Logging system: dictConfig, custom formatters, rotation, filters

  -- === Regex (skill_id=10) ===
  (33, 10, 1,  'project', 3, '2025-01-26', NULL, false, false, 10),  -- Root: regex patterns
  (34, 10, 22, 'project', 3, '2025-01-26', NULL, false, false, 1),   -- Patterns: compiled case-insensitive, multilingual
  (35, 10, 21, 'project', 2, '2025-01-26', NULL, false, false, 2),   -- Debug dumper: filename sanitization

  -- === Dependency Injection (skill_id=11) ===
  (36, 11, 1,  'project', 3, '2025-01-26', NULL, false, false, 11),  -- Root: DI throughout
  (37, 11, 5,  'project', 4, '2025-01-26', NULL, false, false, 2),   -- Presentation: DependencyFactory, constructor injection

  -- === Design Patterns (skill_id=12) ===
  (38, 12, 1,  'project', 4, '2025-01-26', NULL, false, false, 12),  -- Root: multiple patterns
  (39, 12, 3,  'project', 4, '2025-01-26', NULL, false, false, 2),   -- Application: Ports & Adapters, Strategy, Template Method
  (40, 12, 5,  'project', 3, '2025-01-26', NULL, false, false, 3);   -- Presentation: Factory pattern

-- Reset sequence
SELECT setval('skill_usages_id_seq', (SELECT MAX(id) FROM skill_usages));


-- =========================
-- 4. SKILL_USAGES_TRANSLATION SEEDING
-- =========================

INSERT INTO skill_usages_translation (skill_usages_id, language_id, notes)
VALUES
  -- Python usages
  (1,  1, 'Python 3.14 con tipado estricto, dataclasses, ABC, asyncio, typing avanzado. Proyecto completo en Python puro sin frameworks web.'),
  (1,  2, 'Python 3.14 with strict typing, dataclasses, ABC, asyncio, advanced typing. Full project in pure Python without web frameworks.'),
  (2,  1, 'Entidades de dominio usando @dataclass, type hints con List, Optional, Dict. Constantes tipadas con dataclass.'),
  (2,  2, 'Domain entities using @dataclass, type hints with List, Optional, Dict. Typed constants with dataclass.'),
  (3,  1, 'Lógica de aplicación compleja: ABC para puertos, async/await en todos los use cases, Semaphore para concurrencia controlada con asyncio.gather.'),
  (3,  2, 'Complex application logic: ABC for ports, async/await in all use cases, Semaphore for controlled concurrency with asyncio.gather.'),
  (4,  1, 'Integración avanzada con Playwright, logging dictConfig, Pydantic validators, parseo de XML/JSON, manipulación de URLs con urllib.parse.'),
  (4,  2, 'Advanced integration with Playwright, logging dictConfig, Pydantic validators, XML/JSON parsing, URL manipulation with urllib.parse.'),
  (5,  1, 'CLI con asyncio.run(), lectura de settings, composición de dependencias.'),
  (5,  2, 'CLI with asyncio.run(), settings reading, dependency composition.'),
  (6,  1, 'LoggingMixin reutilizable, utilidades de compilación regex, constantes globales.'),
  (6,  2, 'Reusable LoggingMixin, regex compilation utilities, global constants.'),

  -- Playwright usages
  (7,  1, 'Herramienta principal de automatización del proyecto. Browser automation end-to-end con intercepción de red.'),
  (7,  2, 'Main automation tool of the project. End-to-end browser automation with network interception.'),
  (8,  1, 'PlaywrightBrowserProvider: gestión de ciclo de vida del browser, configuración de viewport, user-agent, locale, slow_mo, modo headless.'),
  (8,  2, 'PlaywrightBrowserProvider: browser lifecycle management, viewport config, user-agent, locale, slow_mo, headless mode.'),
  (9,  1, 'APIRequestContext de Playwright para peticiones HTTP directas (GraphQL + REST XML) con headers personalizados de Rosetta Stone.'),
  (9,  2, 'Playwright APIRequestContext for direct HTTP requests (GraphQL + REST XML) with custom Rosetta Stone headers.'),
  (10, 1, 'Interceptación de peticiones de red para capturar tokens de autenticación, session_token, school_id, user_id, lang_code desde headers y query strings.'),
  (10, 2, 'Network request interception to capture auth tokens, session_token, school_id, user_id, lang_code from headers and query strings.'),
  (11, 1, 'Capturas de pantalla automatizadas para diagnóstico durante la ejecución del bot.'),
  (11, 2, 'Automated screenshots for diagnostics during bot execution.'),

  -- Pydantic usages
  (12, 1, 'Pydantic Settings para toda la configuración del proyecto, validación automática de tipos.'),
  (12, 2, 'Pydantic Settings for all project configuration, automatic type validation.'),
  (13, 1, 'BaseSettings con SettingsConfigDict, @field_validator para parseo de listas desde strings CSV de .env, tipos Union[str, List[int]].'),
  (13, 2, 'BaseSettings with SettingsConfigDict, @field_validator for parsing lists from CSV strings in .env, Union[str, List[int]] types.'),

  -- Clean Architecture usages
  (14, 1, 'Arquitectura hexagonal completa con 5 capas bien definidas: Domain → Application → Infrastructure → Presentation → Shared. Ports & Adapters pattern.'),
  (14, 2, 'Full hexagonal architecture with 5 well-defined layers: Domain → Application → Infrastructure → Presentation → Shared. Ports & Adapters pattern.'),
  (15, 1, 'Entidades puras sin dependencias externas, solo dataclasses y tipos estándar de Python.'),
  (15, 2, 'Pure entities with no external dependencies, only dataclasses and standard Python types.'),
  (16, 1, 'Puertos abstractos (FoundationsApiPort, UseCasePort, OrchestratorPort, DebugDumperPort), casos de uso aislados, servicios de aplicación desacoplados.'),
  (16, 2, 'Abstract ports (FoundationsApiPort, UseCasePort, OrchestratorPort, DebugDumperPort), isolated use cases, decoupled application services.'),
  (17, 1, 'Adaptadores concretos que implementan los puertos: PlaywrightFoundationsApiAdapter, PlaywrightBrowserProvider, PlaywrightFileDebugDumperAdapter.'),
  (17, 2, 'Concrete adapters implementing ports: PlaywrightFoundationsApiAdapter, PlaywrightBrowserProvider, PlaywrightFileDebugDumperAdapter.'),
  (18, 1, 'DependencyFactory para inyección de dependencias manual, CLI como punto de entrada limpio que delega a orquestadores.'),
  (18, 2, 'DependencyFactory for manual dependency injection, CLI as clean entry point that delegates to orchestrators.'),

  -- Async Programming usages
  (19, 1, 'Async/await como paradigma principal del proyecto. Todas las operaciones I/O son asíncronas.'),
  (19, 2, 'Async/await as main project paradigm. All I/O operations are asynchronous.'),
  (20, 1, 'asyncio.Semaphore(50) para control de concurrencia, asyncio.gather para ejecución paralela de tareas de completación de paths.'),
  (20, 2, 'asyncio.Semaphore(50) for concurrency control, asyncio.gather for parallel execution of path completion tasks.'),
  (21, 1, 'Orquestación asíncrona de login → navegación → captura de sesión.'),
  (21, 2, 'Async orchestration of login → navigation → session capture.'),
  (22, 1, 'Orquestación asíncrona de completación → reporte → análisis histórico.'),
  (22, 2, 'Async orchestration of completion → report → historical analysis.'),

  -- Web Scraping usages
  (23, 1, 'Automatización web completa: login, navegación, intercepción de tráfico, extracción de datos de sesión.'),
  (23, 2, 'Complete web automation: login, navigation, traffic interception, session data extraction.'),
  (24, 1, 'Parseo de URLs con urllib.parse (urlparse, parse_qs), extracción de headers HTTP (Authorization, x-rosettastone-session-token), análisis de query strings para product_identifier.'),
  (24, 2, 'URL parsing with urllib.parse (urlparse, parse_qs), HTTP header extraction (Authorization, x-rosettastone-session-token), query string analysis for product_identifier.'),
  (25, 1, 'Interacción con elementos DOM del dashboard para capturar nombre de usuario y navegar a sección Foundations.'),
  (25, 2, 'DOM element interaction on dashboard to capture username and navigate to Foundations section.'),

  -- GraphQL usages
  (26, 1, 'Consumo de API GraphQL de Rosetta Stone para obtener estructura completa del curso.'),
  (26, 2, 'Rosetta Stone GraphQL API consumption to fetch complete course structure.'),
  (27, 1, 'Petición GraphQL con token de autorización JWT para obtener courseMenu con unidades, lecciones y paths.'),
  (27, 2, 'GraphQL request with JWT authorization token to fetch courseMenu with units, lessons and paths.'),
  (28, 1, 'Conversión de respuesta GraphQL JSON a entidades de dominio tipadas: CourseMenu → Units → Lessons → Paths con mapeo de campos.'),
  (28, 2, 'GraphQL JSON response conversion to typed domain entities: CourseMenu → Units → Lessons → Paths with field mapping.'),

  -- REST API usages
  (29, 1, 'Consumo de API REST de Rosetta Stone con body XML y headers personalizados de protocolo.'),
  (29, 2, 'Rosetta Stone REST API consumption with XML body and custom protocol headers.'),
  (30, 1, 'PUT request con XML body para update_path_score. Headers: x-rosettastone-protocol-version, x-rosettastone-session-token, Referer, Sec-Fetch-*. Manejo de path scores con campos: course, unit_index, lesson_index, score_correct, duration_ms.'),
  (30, 2, 'PUT request with XML body for update_path_score. Headers: x-rosettastone-protocol-version, x-rosettastone-session-token, Referer, Sec-Fetch-*. Path score handling with fields: course, unit_index, lesson_index, score_correct, duration_ms.'),

  -- Logging usages
  (31, 1, 'Sistema de logging comprehensivo con LoggingMixin en todas las clases, múltiples niveles, formateo contextual.'),
  (31, 2, 'Comprehensive logging system with LoggingMixin in all classes, multiple levels, contextual formatting.'),
  (32, 1, 'logging.config.dictConfig avanzado: 4 formatters (RelPath, File, ErrorFile, JSON para ELK/Datadog), handlers rotativos por tamaño/tiempo, filtros de exclusión de venv, detección automática de project root para rutas relativas.'),
  (32, 2, 'Advanced logging.config.dictConfig: 4 formatters (RelPath, File, ErrorFile, JSON for ELK/Datadog), size/time rotating handlers, venv exclusion filters, automatic project root detection for relative paths.'),

  -- Regex usages
  (33, 1, 'Patrones regex compilados para matching multilingüe (español/inglés) en toda la aplicación.'),
  (33, 2, 'Compiled regex patterns for multilingual matching (Spanish/English) across the application.'),
  (34, 1, 'Patrones case-insensitive precompilados: AuthPatterns (sign_in, login_page, forgot_password), FormPatterns (submit, reset, edit), LessonPatterns (foundations). Soporte multiidioma con alternativas regex.'),
  (34, 2, 'Pre-compiled case-insensitive patterns: AuthPatterns (sign_in, login_page, forgot_password), FormPatterns (submit, reset, edit), LessonPatterns (foundations). Multi-language support with regex alternations.'),
  (35, 1, 'Sanitización de nombres de archivo con re.sub para caracteres no alfanuméricos en debug dumps.'),
  (35, 2, 'Filename sanitization with re.sub for non-alphanumeric characters in debug dumps.'),

  -- Dependency Injection usages
  (36, 1, 'Inyección de dependencias manual a través de constructores en toda la aplicación. Sin framework DI externo.'),
  (36, 2, 'Manual dependency injection through constructors across the entire application. No external DI framework.'),
  (37, 1, 'DependencyFactory centralizada que construye el grafo completo de dependencias: web_session → pages → use_cases → orchestrators, con configuración propagada (units, lessons, path_types, scores).'),
  (37, 2, 'Centralized DependencyFactory that builds the complete dependency graph: web_session → pages → use_cases → orchestrators, with propagated configuration (units, lessons, path_types, scores).'),

  -- Design Patterns usages
  (38, 1, 'Múltiples patrones de diseño: Ports & Adapters, Factory, Strategy, Template Method, Observer (request handling), Mixin, Composition over Inheritance.'),
  (38, 2, 'Multiple design patterns: Ports & Adapters, Factory, Strategy, Template Method, Observer (request handling), Mixin, Composition over Inheritance.'),
  (39, 1, 'Ports como interfaces abstractas (ABC), Strategy en ContentFilter y PathCalculator (configuración intercambiable), Template Method en UseCasePort/OrchestratorPort.'),
  (39, 2, 'Ports as abstract interfaces (ABC), Strategy in ContentFilter and PathCalculator (swappable configuration), Template Method in UseCasePort/OrchestratorPort.'),
  (40, 1, 'Factory pattern en DependencyFactory: creación centralizada de OpenFundations y CompleteFoundationsOrchestrator con inyección de dependencias.'),
  (40, 2, 'Factory pattern in DependencyFactory: centralized creation of OpenFundations and CompleteFoundationsOrchestrator with dependency injection.');

-- Reset sequence
SELECT setval('skill_usages_translation_id_seq', (SELECT MAX(id) FROM skill_usages_translation));


-- =========================
-- SEEDING: project
-- =========================

-- Proyecto raíz
INSERT INTO project (id, code, url, created_at, parent_project_id, source_id, source_type, is_archived, is_pinned, position)
VALUES
  (1, 'rosetta-stone-bot', 'https://github.com/StevSant/playwright_rosseta_stories_bot', '2025-01-01', NULL, NULL, NULL, false, true, 1);

-- Submódulos principales (children del proyecto raíz)
INSERT INTO project (id, code, url, created_at, parent_project_id, source_id, source_type, is_archived, is_pinned, position)
VALUES
  (2,  'rosetta-bot-core',        NULL, '2025-01-01', 1, NULL, NULL, false, false, 1),
  (3,  'rosetta-bot-services',    NULL, '2025-01-01', 1, NULL, NULL, false, false, 2),
  (4,  'rosetta-bot-workflows',   NULL, '2025-01-01', 1, NULL, NULL, false, false, 3),
  (5,  'rosetta-bot-pages',       NULL, '2025-01-01', 1, NULL, NULL, false, false, 4),
  (6,  'rosetta-bot-components',  NULL, '2025-01-01', 1, NULL, NULL, false, false, 5),
  (7,  'rosetta-bot-locators',    NULL, '2025-01-01', 1, NULL, NULL, false, false, 6),
  (8,  'rosetta-bot-config',      NULL, '2025-01-01', 1, NULL, NULL, false, false, 7),
  (9,  'rosetta-bot-browser',     NULL, '2025-01-01', 1, NULL, NULL, false, false, 8),
  (10, 'rosetta-bot-docker',      NULL, '2025-01-01', 1, NULL, NULL, false, false, 9),
  (11, 'rosetta-bot-debug',       NULL, '2025-01-01', 1, NULL, NULL, false, false, 10);

-- =========================
-- SEEDING: project_translation
-- =========================

-- Proyecto raíz
INSERT INTO project_translation (project_id, language_id, title, description)
VALUES
  -- Asumiendo language_id: 1 = español, 2 = inglés
  (1, 1, 'Rosetta Stone Bot', 'Bot de automatización para Rosetta Stone usando Playwright, implementado con arquitectura modular siguiendo principios de diseño limpio. Incluye sistema de tracking de horas con meta de 35h por usuario, soporte multi-usuario, reportes automáticos y despliegue con Docker.'),
  (1, 2, 'Rosetta Stone Bot', 'Automation bot for Rosetta Stone using Playwright, implemented with a modular architecture following clean design principles. Includes hour tracking system with 35h target per user, multi-user support, automatic reports, and Docker deployment.');

-- Core module
INSERT INTO project_translation (project_id, language_id, title, description)
VALUES
  (2, 1, 'Módulo Core', 'Constantes y utilidades fundamentales: timeouts en milisegundos (Timeouts), tiempos de espera en segundos (WaitTimes), URLs de la aplicación Rosetta Stone y sistema centralizado de logging con niveles (Logger, LogLevel).'),
  (2, 2, 'Core Module', 'Fundamental constants and utilities: timeouts in milliseconds (Timeouts), wait times in seconds (WaitTimes), Rosetta Stone application URLs, and centralized logging system with levels (Logger, LogLevel).');

-- Services module
INSERT INTO project_translation (project_id, language_id, title, description)
VALUES
  (3, 1, 'Módulo de Servicios', 'Servicios de negocio reutilizables: AudioPlayerService (play, pause, rewind de audio), ModeSwitcherService (cambio entre modos escuchar/leer), DebugService (capturas y dumps de depuración), FrameFinderService (búsqueda en iframes) y TimeTracker (tracking de horas por usuario con persistencia JSON y generación de reportes).'),
  (3, 2, 'Services Module', 'Reusable business services: AudioPlayerService (audio play, pause, rewind), ModeSwitcherService (listen/read mode switching), DebugService (screenshots and debug dumps), FrameFinderService (iframe search) and TimeTracker (per-user hour tracking with JSON persistence and report generation).');

-- Workflows module
INSERT INTO project_translation (project_id, language_id, title, description)
VALUES
  (4, 1, 'Módulo de Workflows', 'Flujos de automatización: BaseWorkflow (clase base abstracta), StoriesWorkflow (procesa todas las historias en loop infinito descubriendo y ciclando listen/read) y LessonWorkflow (repite una lección específica infinitamente con reinicio automático).'),
  (4, 2, 'Workflows Module', 'Automation workflows: BaseWorkflow (abstract base class), StoriesWorkflow (processes all stories in infinite loop discovering and cycling listen/read) and LessonWorkflow (repeats a specific lesson infinitely with automatic restart).');

-- Pages module
INSERT INTO project_translation (project_id, language_id, title, description)
VALUES
  (5, 1, 'Módulo de Páginas (POM)', 'Page Objects siguiendo el patrón Page Object Model: BasePage (funcionalidad común, waits, screenshots), LoginPage (autenticación), LaunchpadPage (navegación inicial con fallback de lecciones), StoriesPage (página de historias con ciclos listen/read) y LessonPage (página de lecciones con ciclos de actividad).'),
  (5, 2, 'Pages Module (POM)', 'Page Objects following the Page Object Model pattern: BasePage (common functionality, waits, screenshots), LoginPage (authentication), LaunchpadPage (initial navigation with lesson fallback), StoriesPage (stories page with listen/read cycles) and LessonPage (lesson page with activity cycles).');

-- Components module
INSERT INTO project_translation (project_id, language_id, title, description)
VALUES
  (6, 1, 'Módulo de Componentes UI', 'Componentes UI reutilizables: AudioModal (modal de audio con dismissal automático), VoiceModal (modal de voz con opción continuar sin voz) y CookieConsent (banner de aceptación de cookies).'),
  (6, 2, 'UI Components Module', 'Reusable UI components: AudioModal (audio modal with automatic dismissal), VoiceModal (voice modal with continue without voice option) and CookieConsent (cookie acceptance banner).');

-- Locators module
INSERT INTO project_translation (project_id, language_id, title, description)
VALUES
  (7, 1, 'Módulo de Locators', 'Selectores centralizados para cada página: LoginLocators, StoriesLocators (con lista de historias conocidas y controles de audio), LessonLocators (controles de audio, completado y reinicio), LaunchpadLocators (URLs, patrones de navegación) y CommonLocators (patrones bilingües español/inglés para modos listen/read).'),
  (7, 2, 'Locators Module', 'Centralized selectors for each page: LoginLocators, StoriesLocators (with known stories list and audio controls), LessonLocators (audio controls, completion and restart), LaunchpadLocators (URLs, navigation patterns) and CommonLocators (bilingual Spanish/English patterns for listen/read modes).');

-- Config module
INSERT INTO project_translation (project_id, language_id, title, description)
VALUES
  (8, 1, 'Módulo de Configuración', 'Gestión de configuración con dataclasses: BrowserConfig (headless, slow_mo, viewport, locale, user agent) y AppConfig (email, password, debug, lesson_name, target_hours) con factory method from_env() para carga desde variables de entorno.'),
  (8, 2, 'Configuration Module', 'Configuration management with dataclasses: BrowserConfig (headless, slow_mo, viewport, locale, user agent) and AppConfig (email, password, debug, lesson_name, target_hours) with from_env() factory method for environment variable loading.');

-- Browser module
INSERT INTO project_translation (project_id, language_id, title, description)
VALUES
  (9, 1, 'Módulo de Navegador', 'Gestión del ciclo de vida del navegador Chromium con Playwright: lanzamiento, configuración de viewport, user agent, locale y cierre controlado de recursos.'),
  (9, 2, 'Browser Module', 'Chromium browser lifecycle management with Playwright: launch, viewport configuration, user agent, locale, and controlled resource cleanup.');

-- Docker deployment
INSERT INTO project_translation (project_id, language_id, title, description)
VALUES
  (10, 1, 'Despliegue Docker', 'Contenerización con Python 3.13-slim, instalación de dependencias de Playwright, Docker Compose para múltiples usuarios con volumen compartido tracking-data para persistencia de datos entre contenedores.'),
  (10, 2, 'Docker Deployment', 'Containerization with Python 3.13-slim, Playwright dependency installation, Docker Compose for multiple users with shared tracking-data volume for data persistence between containers.');

-- Debug module
INSERT INTO project_translation (project_id, language_id, title, description)
VALUES
  (11, 1, 'Módulo de Debug', 'Sistema de depuración con capturas de pantalla secuenciales, dumps de estado de páginas (URL, título, frames), contador persistente en .dump_index y sanitización de nombres de archivo para diagnóstico del flujo de navegación.'),
  (11, 2, 'Debug Module', 'Debug system with sequential screenshots, page state dumps (URL, title, frames), persistent counter in .dump_index and filename sanitization for navigation flow diagnostics.');


-- =========================
-- SEEDING: skill_usages
-- =========================
-- source_type = 'project', source_id = project.id
-- Asumiendo skills previos: 1=Python, 2=Playwright, 3=Docker, 4=Git,
-- 5=Web Scraping, 6=Automation, 7=Page Object Model, 8=Docker Compose,
-- 9=CI/CD, 10=JSON, 11=Regex, 12=HTML/CSS Selectors, 13=TypeScript (no aplica),
-- 14=Shell/Bash, 15=Data Persistence, 16=OOP, 17=Clean Architecture

INSERT INTO skill_usages (id, skill_id, source_id, source_type, level, started_at, ended_at, is_archived, is_pinned, position)
VALUES
  -- Proyecto raíz (id=1): skills principales
  (1,  1,  1, 'project', 4, '2025-01-01', NULL, false, true,  1),   -- Python (avanzado)
  (2,  2,  1, 'project', 4, '2025-01-01', NULL, false, true,  2),   -- Playwright
  (3,  3,  1, 'project', 3, '2025-01-01', NULL, false, false, 3),   -- Docker
  (4,  4,  1, 'project', 3, '2025-01-01', NULL, false, false, 4),   -- Git
  (5,  5,  1, 'project', 4, '2025-01-01', NULL, false, false, 5),   -- Web Scraping
  (6,  6,  1, 'project', 5, '2025-01-01', NULL, false, true,  6),   -- Automation (nivel máximo)
  (7,  7,  1, 'project', 4, '2025-01-01', NULL, false, false, 7),   -- Page Object Model
  (8,  8,  1, 'project', 3, '2025-01-01', NULL, false, false, 8),   -- Docker Compose
  (9,  10, 1, 'project', 3, '2025-01-01', NULL, false, false, 9),   -- JSON (persistencia datos)
  (10, 11, 1, 'project', 4, '2025-01-01', NULL, false, false, 10),  -- Regex (locators bilingües)
  (11, 12, 1, 'project', 4, '2025-01-01', NULL, false, false, 11),  -- HTML/CSS Selectors
  (12, 14, 1, 'project', 2, '2025-01-01', NULL, false, false, 12),  -- Shell/Bash (Docker cmds)
  (13, 15, 1, 'project', 3, '2025-01-01', NULL, false, false, 13),  -- Data Persistence
  (14, 16, 1, 'project', 4, '2025-01-01', NULL, false, false, 14),  -- OOP (dataclasses, ABC)
  (15, 17, 1, 'project', 4, '2025-01-01', NULL, false, false, 15),  -- Clean Architecture

  -- Core (id=2)
  (16, 1,  2, 'project', 4, '2025-01-01', NULL, false, false, 1),   -- Python
  (17, 16, 2, 'project', 4, '2025-01-01', NULL, false, false, 2),   -- OOP (frozen dataclasses)

  -- Services (id=3)
  (18, 1,  3, 'project', 4, '2025-01-01', NULL, false, false, 1),   -- Python
  (19, 2,  3, 'project', 4, '2025-01-01', NULL, false, false, 2),   -- Playwright
  (20, 10, 3, 'project', 3, '2025-01-01', NULL, false, false, 3),   -- JSON (time_tracker)
  (21, 15, 3, 'project', 3, '2025-01-01', NULL, false, false, 4),   -- Data Persistence
  (22, 11, 3, 'project', 3, '2025-01-01', NULL, false, false, 5),   -- Regex (debug sanitize)

  -- Workflows (id=4)
  (23, 1,  4, 'project', 4, '2025-01-01', NULL, false, false, 1),   -- Python
  (24, 2,  4, 'project', 4, '2025-01-01', NULL, false, false, 2),   -- Playwright
  (25, 6,  4, 'project', 5, '2025-01-01', NULL, false, false, 3),   -- Automation
  (26, 16, 4, 'project', 4, '2025-01-01', NULL, false, false, 4),   -- OOP (ABC, inheritance)

  -- Pages (id=5)
  (27, 1,  5, 'project', 4, '2025-01-01', NULL, false, false, 1),   -- Python
  (28, 2,  5, 'project', 4, '2025-01-01', NULL, false, false, 2),   -- Playwright
  (29, 7,  5, 'project', 4, '2025-01-01', NULL, false, false, 3),   -- Page Object Model
  (30, 12, 5, 'project', 4, '2025-01-01', NULL, false, false, 4),   -- HTML/CSS Selectors
  (31, 11, 5, 'project', 4, '2025-01-01', NULL, false, false, 5),   -- Regex (locators)

  -- Components (id=6)
  (32, 1,  6, 'project', 3, '2025-01-01', NULL, false, false, 1),   -- Python
  (33, 2,  6, 'project', 3, '2025-01-01', NULL, false, false, 2),   -- Playwright
  (34, 12, 6, 'project', 3, '2025-01-01', NULL, false, false, 3),   -- HTML/CSS Selectors

  -- Locators (id=7)
  (35, 1,  7, 'project', 3, '2025-01-01', NULL, false, false, 1),   -- Python
  (36, 11, 7, 'project', 5, '2025-01-01', NULL, false, false, 2),   -- Regex (core del módulo)
  (37, 12, 7, 'project', 4, '2025-01-01', NULL, false, false, 3),   -- HTML/CSS Selectors

  -- Config (id=8)
  (38, 1,  8, 'project', 3, '2025-01-01', NULL, false, false, 1),   -- Python
  (39, 16, 8, 'project', 3, '2025-01-01', NULL, false, false, 2),   -- OOP (dataclasses)
  (40, 17, 8, 'project', 3, '2025-01-01', NULL, false, false, 3),   -- Clean Architecture

  -- Browser (id=9)
  (41, 1,  9, 'project', 3, '2025-01-01', NULL, false, false, 1),   -- Python
  (42, 2,  9, 'project', 4, '2025-01-01', NULL, false, false, 2),   -- Playwright

  -- Docker (id=10)
  (43, 3,  10, 'project', 3, '2025-01-01', NULL, false, false, 1),  -- Docker
  (44, 8,  10, 'project', 3, '2025-01-01', NULL, false, false, 2),  -- Docker Compose
  (45, 14, 10, 'project', 2, '2025-01-01', NULL, false, false, 3),  -- Shell/Bash

  -- Debug (id=11)
  (46, 1,  11, 'project', 3, '2025-01-01', NULL, false, false, 1),  -- Python
  (47, 15, 11, 'project', 2, '2025-01-01', NULL, false, false, 2),  -- Data Persistence
  (48, 11, 11, 'project', 3, '2025-01-01', NULL, false, false, 3);  -- Regex (sanitize)


-- =========================
-- SEEDING: skill_usages_translation
-- =========================

INSERT INTO skill_usages_translation (skill_usages_id, language_id, notes)
VALUES
  -- Proyecto raíz skills
  (1,  1, 'Python 3.13 con dataclasses, ABC, tipado estricto, patrón factory, decoradores @property y gestión de contexto. Uso extensivo de type hints.'),
  (1,  2, 'Python 3.13 with dataclasses, ABC, strict typing, factory pattern, @property decorators and context management. Extensive use of type hints.'),

  (2,  1, 'Playwright sync API para automatización de navegador Chromium: navegación, localización de elementos (get_by_role, get_by_text, locator), manejo de frames, espera de estados de red (networkidle, domcontentloaded) y screenshots.'),
  (2,  2, 'Playwright sync API for Chromium browser automation: navigation, element location (get_by_role, get_by_text, locator), frame handling, network state waiting (networkidle, domcontentloaded) and screenshots.'),

  (3,  1, 'Docker con Python 3.13-slim, instalación de dependencias de Playwright en contenedor, Dockerfile multi-stage con uv para gestión de paquetes.'),
  (3,  2, 'Docker with Python 3.13-slim, Playwright dependency installation in container, multi-stage Dockerfile with uv for package management.'),

  (4,  1, 'Control de versiones con Git, repositorio en GitHub con rama principal main.'),
  (4,  2, 'Version control with Git, GitHub repository with main branch.'),

  (5,  1, 'Web scraping de la plataforma Rosetta Stone: extracción de historias disponibles, detección de estados de completado, navegación entre secciones protegidas con autenticación.'),
  (5,  2, 'Web scraping of the Rosetta Stone platform: extraction of available stories, completion state detection, navigation between authenticated sections.'),

  (6,  1, 'Automatización completa del flujo de aprendizaje: login institucional, navegación por launchpad, selección de lecciones/historias, ciclos de escuchar/leer con reproducción de audio, detección de completado y reinicio automático. Loops infinitos con tracking de tiempo.'),
  (6,  2, 'Complete learning flow automation: institutional login, launchpad navigation, lesson/story selection, listen/read cycles with audio playback, completion detection and automatic restart. Infinite loops with time tracking.'),

  (7,  1, 'Implementación completa del patrón Page Object Model: BasePage abstracta con funcionalidad común, páginas especializadas (Login, Launchpad, Stories, Lesson) con encapsulación de selectores y acciones.'),
  (7,  2, 'Full Page Object Model pattern implementation: abstract BasePage with common functionality, specialized pages (Login, Launchpad, Stories, Lesson) with selector and action encapsulation.'),

  (8,  1, 'Docker Compose para orquestación multi-usuario con volumen compartido tracking-data para persistencia de datos entre contenedores, restart always.'),
  (8,  2, 'Docker Compose for multi-user orchestration with shared tracking-data volume for data persistence between containers, restart always.'),

  (9,  1, 'Persistencia de datos en JSON: time_tracking.json con estructura multi-usuario, sesiones con timestamps, generación de reportes en texto plano.'),
  (9,  2, 'JSON data persistence: time_tracking.json with multi-user structure, sessions with timestamps, plain text report generation.'),

  (10, 1, 'Regex avanzado para locators bilingües español/inglés: patrones compilados case-insensitive para detectar elementos UI en ambos idiomas (escuchar|listen, leer|read, completado|completed).'),
  (10, 2, 'Advanced regex for bilingual Spanish/English locators: compiled case-insensitive patterns for detecting UI elements in both languages (escuchar|listen, leer|read, completado|completed).'),

  (11, 1, 'Selectores CSS y data attributes: polygon/circle para botones de audio, data-qa para modals, selectores de href para story links, roles ARIA para botones y listItems.'),
  (11, 2, 'CSS selectors and data attributes: polygon/circle for audio buttons, data-qa for modals, href selectors for story links, ARIA roles for buttons and listItems.'),

  (12, 1, 'Scripts bash para gestión de Docker: build, ejecución, inspección de volúmenes, copia de datos y monitoreo de logs.'),
  (12, 2, 'Bash scripts for Docker management: build, execution, volume inspection, data copying and log monitoring.'),

  (13, 1, 'Persistencia de sesiones en archivo JSON con carga/guardado atómico, creación automática de directorios, y cleanup handler para cierre inesperado con atexit.'),
  (13, 2, 'Session persistence in JSON file with atomic load/save, automatic directory creation, and cleanup handler for unexpected shutdown with atexit.'),

  (14, 1, 'OOP avanzado: herencia con ABC, frozen dataclasses para inmutabilidad, patrón factory (from_env), method chaining, properties computadas, separación de responsabilidades.'),
  (14, 2, 'Advanced OOP: inheritance with ABC, frozen dataclasses for immutability, factory pattern (from_env), method chaining, computed properties, separation of concerns.'),

  (15, 1, 'Arquitectura limpia en capas: core (constantes), services (lógica reutilizable), workflows (automatización), pages (POM), components (UI), locators (selectores), con __init__.py como API pública de cada módulo.'),
  (15, 2, 'Clean layered architecture: core (constants), services (reusable logic), workflows (automation), pages (POM), components (UI), locators (selectors), with __init__.py as public API for each module.'),

  -- Core module skills
  (16, 1, 'Dataclasses frozen para constantes tipadas: Timeouts (ms), WaitTimes (s), URLs. Factory function get_logger.'),
  (16, 2, 'Frozen dataclasses for typed constants: Timeouts (ms), WaitTimes (s), URLs. Factory function get_logger.'),

  (17, 1, 'Frozen dataclasses como value objects inmutables para constantes de configuración.'),
  (17, 2, 'Frozen dataclasses as immutable value objects for configuration constants.'),

  -- Services module skills
  (18, 1, 'Servicios como clases con inyección de dependencias (Page, Logger), manejo de errores con fallback (polygon → circle para audio).'),
  (18, 2, 'Services as classes with dependency injection (Page, Logger), error handling with fallback (polygon → circle for audio).'),

  (19, 1, 'Interacción con elementos SVG (polygon, circle, rect) para controles de audio, force click para bypass de actionability checks.'),
  (19, 2, 'SVG element interaction (polygon, circle, rect) for audio controls, force click to bypass actionability checks.'),

  (20, 1, 'Lectura/escritura de JSON con manejo de errores, estructura anidada por email de usuario.'),
  (20, 2, 'JSON read/write with error handling, nested structure by user email.'),

  (21, 1, 'Tracking de tiempo con sesiones, acumulación de segundos, detección de completado, generación de reportes y cleanup en cierre inesperado.'),
  (21, 2, 'Time tracking with sessions, seconds accumulation, completion detection, report generation and cleanup on unexpected shutdown.'),

  (22, 1, 'Sanitización de tags para nombres de archivo con regex: [^0-9A-Za-z_.-] → underscore.'),
  (22, 2, 'Tag sanitization for filenames with regex: [^0-9A-Za-z_.-] → underscore.'),

  -- Workflows module skills
  (23, 1, 'Clase base abstracta con métodos setup() y run_once() que los workflows concretos implementan.'),
  (23, 2, 'Abstract base class with setup() and run_once() methods that concrete workflows implement.'),

  (24, 1, 'Navegación programática con goto, wait_for_load_state, manejo de modals y verificación de URLs.'),
  (24, 2, 'Programmatic navigation with goto, wait_for_load_state, modal handling and URL verification.'),

  (25, 1, 'StoriesWorkflow: descubrimiento de historias, ciclos listen/read con reproducción de audio y detección de completado. LessonWorkflow: loop infinito con reinicio automático via botón o reload.'),
  (25, 2, 'StoriesWorkflow: story discovery, listen/read cycles with audio playback and completion detection. LessonWorkflow: infinite loop with automatic restart via button or reload.'),

  (26, 1, 'Herencia de BaseWorkflow con template method pattern: setup → run_once/run_infinite → cleanup.'),
  (26, 2, 'BaseWorkflow inheritance with template method pattern: setup → run_once/run_infinite → cleanup.'),

  -- Pages module skills
  (27, 1, 'BasePage con métodos comunes: wait, take_screenshot, click_safe, setup_dialog_auto_dismiss. Páginas hijas especializadas.'),
  (27, 2, 'BasePage with common methods: wait, take_screenshot, click_safe, setup_dialog_auto_dismiss. Specialized child pages.'),

  (28, 1, 'Uso extensivo de Playwright Page API: get_by_role, get_by_text, locator, expect_navigation, on("dialog").'),
  (28, 2, 'Extensive use of Playwright Page API: get_by_role, get_by_text, locator, expect_navigation, on("dialog").'),

  (29, 1, 'POM completo: 5 page objects (Base, Login, Launchpad, Stories, Lesson) con encapsulación de interacciones y estados.'),
  (29, 2, 'Complete POM: 5 page objects (Base, Login, Launchpad, Stories, Lesson) with interaction and state encapsulation.'),

  (30, 1, 'Selectores CSS para audio player (polygon, circle), data-qa attributes, href patterns para story links.'),
  (30, 2, 'CSS selectors for audio player (polygon, circle), data-qa attributes, href patterns for story links.'),

  (31, 1, 'Patrones regex bilingües en page objects para detección de modos y estados de completado.'),
  (31, 2, 'Bilingual regex patterns in page objects for mode detection and completion states.'),

  -- Components module skills
  (32, 1, 'Componentes reutilizables con interfaz dismiss_if_present() y wait_and_dismiss().'),
  (32, 2, 'Reusable components with dismiss_if_present() and wait_and_dismiss() interface.'),

  (33, 1, 'Interacción con modals de Playwright: detección de presencia, click en botones de cierre.'),
  (33, 2, 'Playwright modal interaction: presence detection, click on close buttons.'),

  (34, 1, 'Selectores data-qa para PromptButton y continue, aria-label para close buttons.'),
  (34, 2, 'data-qa selectors for PromptButton and continue, aria-label for close buttons.'),

  -- Locators module skills
  (35, 1, 'Dataclasses frozen con constantes tipadas para todos los selectores de la aplicación.'),
  (35, 2, 'Frozen dataclasses with typed constants for all application selectors.'),

  (36, 1, 'Patrones regex compilados con re.IGNORECASE para soporte bilingüe: foundations|fundamentos, escuchar|listen, completado|completed, etc.'),
  (36, 2, 'Compiled regex patterns with re.IGNORECASE for bilingual support: foundations|fundamentos, escuchar|listen, completado|completed, etc.'),

  (37, 1, 'Selectores CSS con data-qa attributes, selectores de href, elementos SVG (polygon, circle, rect).'),
  (37, 2, 'CSS selectors with data-qa attributes, href selectors, SVG elements (polygon, circle, rect).'),

  -- Config module skills
  (38, 1, 'Carga de configuración desde variables de entorno con os.getenv, validación de requeridos, conversión de tipos.'),
  (38, 2, 'Configuration loading from environment variables with os.getenv, required validation, type conversion.'),

  (39, 1, 'Dataclasses con valores por defecto y class method factory from_env() para instanciación.'),
  (39, 2, 'Dataclasses with default values and from_env() class method factory for instantiation.'),

  (40, 1, 'Separación de configuración de browser (BrowserConfig) y aplicación (AppConfig) con composición.'),
  (40, 2, 'Separation of browser (BrowserConfig) and application (AppConfig) configuration with composition.'),

  -- Browser module skills
  (41, 1, 'Gestión del ciclo de vida del navegador con context manager pattern.'),
  (41, 2, 'Browser lifecycle management with context manager pattern.'),

  (42, 1, 'Configuración de Playwright Chromium: headless, slow_mo, viewport, locale es-ES, user agent personalizado.'),
  (42, 2, 'Playwright Chromium configuration: headless, slow_mo, viewport, locale es-ES, custom user agent.'),

  -- Docker module skills
  (43, 1, 'Dockerfile multi-stage con Python 3.13-slim, instalación de dependencias de sistema para Playwright, uv sync para paquetes Python.'),
  (43, 2, 'Multi-stage Dockerfile with Python 3.13-slim, system dependency installation for Playwright, uv sync for Python packages.'),

  (44, 1, 'Docker Compose con volumen compartido tracking-data, múltiples servicios por usuario con env_file, restart always.'),
  (44, 2, 'Docker Compose with shared tracking-data volume, multiple services per user with env_file, restart always.'),

  (45, 1, 'Comandos Docker para inspección de volúmenes, logs, copia de datos al host y ejecución de scripts dentro de contenedores.'),
  (45, 2, 'Docker commands for volume inspection, logs, data copying to host and script execution inside containers.'),

  -- Debug module skills
  (46, 1, 'Servicio de debug con contador persistente, dumping de estado de páginas y sanitización de nombres.'),
  (46, 2, 'Debug service with persistent counter, page state dumping and name sanitization.'),

  (47, 1, 'Contador persistente en archivo .dump_index para numeración secuencial de dumps.'),
  (47, 2, 'Persistent counter in .dump_index file for sequential dump numbering.'),

  (48, 1, 'Sanitización de tags con regex para uso seguro en nombres de archivo del sistema operativo.'),
  (48, 2, 'Tag sanitization with regex for safe use in operating system filenames.');


-- =========================
-- Reset sequences
-- =========================
SELECT setval('project_id_seq', (SELECT MAX(id) FROM project));
SELECT setval('project_translation_id_seq', (SELECT MAX(id) FROM project_translation));
SELECT setval('skill_usages_id_seq', (SELECT MAX(id) FROM skill_usages));
SELECT setval('skill_usages_translation_id_seq', (SELECT MAX(id) FROM skill_usages_translation));



