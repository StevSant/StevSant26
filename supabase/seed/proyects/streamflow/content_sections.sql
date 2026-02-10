-- ============================================================
-- StreamFlow Music - Content Sections & Translations
-- ============================================================
-- Icons: Material Icons | Languages: es/en via SELECT
BEGIN;

-- ============================================================
-- MONOREPO: streamflow-music
-- ============================================================
INSERT INTO content_section (entity_type, entity_id, section_key, icon, position, is_archived, is_pinned)
VALUES
  ('project', (SELECT id FROM project WHERE code = 'streamflow-music'), 'overview',      'info',          1, false, true),
  ('project', (SELECT id FROM project WHERE code = 'streamflow-music'), 'architecture',  'account_tree',  2, false, true),
  ('project', (SELECT id FROM project WHERE code = 'streamflow-music'), 'tech_stack',    'layers',        3, false, false)
ON CONFLICT DO NOTHING;

INSERT INTO content_section_translation (content_section_id, language_id, title, body)
VALUES
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_type = 'project' AND cs.entity_id = (SELECT id FROM project WHERE code = 'streamflow-music') AND cs.section_key = 'overview'),
   (SELECT id FROM language WHERE code = 'es'), 'Descripción General', 'StreamFlow Music es una plataforma de streaming de música full-stack organizada como monorepo con submódulos Git que vinculan los repositorios de backend y frontend. Ofrece una experiencia de desarrollo unificada con infraestructura Supabase compartida, Arquitectura Limpia consistente en ambos codebases y quality gates centralizados mediante SonarCloud.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_type = 'project' AND cs.entity_id = (SELECT id FROM project WHERE code = 'streamflow-music') AND cs.section_key = 'overview'),
   (SELECT id FROM language WHERE code = 'en'), 'Overview', 'StreamFlow Music is a full-stack music streaming platform organized as a monorepo with Git submodules linking the backend and frontend repositories. It provides a unified development experience with shared Supabase infrastructure, consistent Clean Architecture across both codebases, and centralized quality gates via SonarCloud.'),

  ((SELECT cs.id FROM content_section cs WHERE cs.entity_type = 'project' AND cs.entity_id = (SELECT id FROM project WHERE code = 'streamflow-music') AND cs.section_key = 'architecture'),
   (SELECT id FROM language WHERE code = 'es'), 'Arquitectura', 'El monorepo sigue una estructura basada en submódulos donde cada proyecto hijo (backend y frontend) implementa independientemente Arquitectura Limpia con capas de dominio, casos de uso, infraestructura y presentación. Docker Compose orquesta el despliegue multi-servicio.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_type = 'project' AND cs.entity_id = (SELECT id FROM project WHERE code = 'streamflow-music') AND cs.section_key = 'architecture'),
   (SELECT id FROM language WHERE code = 'en'), 'Architecture', 'The monorepo follows a submodule-based structure where each child project (backend and frontend) independently implements Clean Architecture with domain, use cases, infrastructure, and presentation layers. Docker Compose orchestrates multi-service deployment.'),

  ((SELECT cs.id FROM content_section cs WHERE cs.entity_type = 'project' AND cs.entity_id = (SELECT id FROM project WHERE code = 'streamflow-music') AND cs.section_key = 'tech_stack'),
   (SELECT id FROM language WHERE code = 'es'), 'Stack Tecnológico', 'Python · Django · Django REST Framework · Angular 19+ · TypeScript · PostgreSQL · Supabase · Docker · SonarCloud · Submódulos Git · pytest · SCSS'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_type = 'project' AND cs.entity_id = (SELECT id FROM project WHERE code = 'streamflow-music') AND cs.section_key = 'tech_stack'),
   (SELECT id FROM language WHERE code = 'en'), 'Tech Stack', 'Python · Django · Django REST Framework · Angular 19+ · TypeScript · PostgreSQL · Supabase · Docker · SonarCloud · Git Submodules · pytest · SCSS')
ON CONFLICT (content_section_id, language_id) DO NOTHING;

-- ============================================================
-- BACKEND: streamflow-music-backend
-- ============================================================
INSERT INTO content_section (entity_type, entity_id, section_key, icon, position, is_archived, is_pinned)
VALUES
  ('project', (SELECT id FROM project WHERE code = 'streamflow-music-backend'), 'overview',      'info',               1, false, true),
  ('project', (SELECT id FROM project WHERE code = 'streamflow-music-backend'), 'architecture',  'account_tree',       2, false, true),
  ('project', (SELECT id FROM project WHERE code = 'streamflow-music-backend'), 'features',      'featured_play_list', 3, false, false),
  ('project', (SELECT id FROM project WHERE code = 'streamflow-music-backend'), 'testing',       'bug_report',         4, false, false),
  ('project', (SELECT id FROM project WHERE code = 'streamflow-music-backend'), 'api',           'api',                5, false, false)
ON CONFLICT DO NOTHING;

INSERT INTO content_section_translation (content_section_id, language_id, title, body)
VALUES
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_type = 'project' AND cs.entity_id = (SELECT id FROM project WHERE code = 'streamflow-music-backend') AND cs.section_key = 'overview'),
   (SELECT id FROM language WHERE code = 'es'), 'Descripción General', 'API RESTful construida con Django y Django REST Framework. Gestiona procesamiento de tracks musicales, extracción de artistas/álbumes, análisis de géneros, perfiles de usuario con carga de imágenes, gestión de playlists y autenticación con Supabase. Diseño modular de servicios con SongDatabaseService, MediaProcessor y MusicDataConverter.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_type = 'project' AND cs.entity_id = (SELECT id FROM project WHERE code = 'streamflow-music-backend') AND cs.section_key = 'overview'),
   (SELECT id FROM language WHERE code = 'en'), 'Overview', 'RESTful API built with Django and Django REST Framework. Handles music track processing, artist/album extraction, genre analysis, user profiles with image upload, playlist management, and Supabase authentication. Modular service design with SongDatabaseService, MediaProcessor, and MusicDataConverter.'),

  ((SELECT cs.id FROM content_section cs WHERE cs.entity_type = 'project' AND cs.entity_id = (SELECT id FROM project WHERE code = 'streamflow-music-backend') AND cs.section_key = 'architecture'),
   (SELECT id FROM language WHERE code = 'es'), 'Arquitectura', 'Arquitectura Limpia estricta en todas las apps: capa de dominio (SongEntity, ISongRepository), capa de casos de uso (SaveTrackAsSongUseCase, GetUserProfileUseCase, UploadProfilePicture), capa de infraestructura (modelos ORM, implementaciones de repositorio) y capa API (ViewSets, DTOs, serializadores). Los settings están modularizados en configuraciones base, database, auth, REST framework y Supabase.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_type = 'project' AND cs.entity_id = (SELECT id FROM project WHERE code = 'streamflow-music-backend') AND cs.section_key = 'architecture'),
   (SELECT id FROM language WHERE code = 'en'), 'Architecture', 'Strict Clean Architecture across all apps: domain layer (SongEntity, ISongRepository), use cases layer (SaveTrackAsSongUseCase, GetUserProfileUseCase, UploadProfilePicture), infrastructure layer (ORM models, repository implementations), and API layer (ViewSets, DTOs, serializers). Settings are modularized into base, database, auth, REST framework, and Supabase configurations.'),

  ((SELECT cs.id FROM content_section cs WHERE cs.entity_type = 'project' AND cs.entity_id = (SELECT id FROM project WHERE code = 'streamflow-music-backend') AND cs.section_key = 'features'),
   (SELECT id FROM language WHERE code = 'es'), 'Funcionalidades', E'• Guardar y procesar tracks musicales desde fuentes Spotify/YouTube\n• Extracción automática de artistas, álbumes y géneros\n• Gestión de perfiles de usuario con carga de imágenes\n• Operaciones CRUD de playlists\n• Integración de autenticación con Supabase\n• FilteredViewSetMixin y CRUDViewSetMixin personalizados\n• Documentación de esquemas API con drf-spectacular\n• Endpoints paginados con decorador @paginated_list_endpoint'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_type = 'project' AND cs.entity_id = (SELECT id FROM project WHERE code = 'streamflow-music-backend') AND cs.section_key = 'features'),
   (SELECT id FROM language WHERE code = 'en'), 'Features', E'• Save and process music tracks from Spotify/YouTube sources\n• Automatic artist, album, and genre extraction\n• User profile management with image upload\n• Playlist CRUD operations\n• Supabase authentication integration\n• Custom FilteredViewSetMixin and CRUDViewSetMixin\n• drf-spectacular API schema documentation\n• Paginated endpoints with @paginated_list_endpoint decorator'),

  ((SELECT cs.id FROM content_section cs WHERE cs.entity_type = 'project' AND cs.entity_id = (SELECT id FROM project WHERE code = 'streamflow-music-backend') AND cs.section_key = 'testing'),
   (SELECT id FROM language WHERE code = 'es'), 'Testing', 'Más de 474 tests unitarios sin fallos usando pytest. Incluye pytest-asyncio para operaciones asíncronas, Mock/AsyncMock para aislamiento de dependencias, tests completos de validación de DTOs (TestSongCreateDTO, TestSongMapper), tests de lógica de casos de uso y validación de entidades de dominio. Reportes de cobertura en formato XML integrados con SonarCloud.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_type = 'project' AND cs.entity_id = (SELECT id FROM project WHERE code = 'streamflow-music-backend') AND cs.section_key = 'testing'),
   (SELECT id FROM language WHERE code = 'en'), 'Testing', '474+ unit tests with zero failures using pytest. Includes pytest-asyncio for async operations, Mock/AsyncMock for dependency isolation, comprehensive DTO validation tests (TestSongCreateDTO, TestSongMapper), use case logic tests, and domain entity validation. Coverage reports in XML format integrated with SonarCloud.'),

  ((SELECT cs.id FROM content_section cs WHERE cs.entity_type = 'project' AND cs.entity_id = (SELECT id FROM project WHERE code = 'streamflow-music-backend') AND cs.section_key = 'api'),
   (SELECT id FROM language WHERE code = 'es'), 'Diseño de API', 'Endpoints RESTful para canciones, artistas, álbumes, géneros, playlists y perfiles de usuario. Usa ViewSets (GenreViewSet, UserProfileViewSet) con decoradores @extend_schema_view de drf-spectacular para documentación autogenerada. Patrones consistentes de request/response basados en DTOs con códigos de estado HTTP apropiados.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_type = 'project' AND cs.entity_id = (SELECT id FROM project WHERE code = 'streamflow-music-backend') AND cs.section_key = 'api'),
   (SELECT id FROM language WHERE code = 'en'), 'API Design', 'RESTful endpoints for songs, artists, albums, genres, playlists, and user profiles. Uses ViewSets (GenreViewSet, UserProfileViewSet) with drf-spectacular @extend_schema_view decorators for auto-generated documentation. Consistent DTO-based request/response patterns with proper HTTP status codes.')
ON CONFLICT (content_section_id, language_id) DO NOTHING;

-- ============================================================
-- FRONTEND: streamflow-music-frontend
-- ============================================================
INSERT INTO content_section (entity_type, entity_id, section_key, icon, position, is_archived, is_pinned)
VALUES
  ('project', (SELECT id FROM project WHERE code = 'streamflow-music-frontend'), 'overview',      'info',               1, false, true),
  ('project', (SELECT id FROM project WHERE code = 'streamflow-music-frontend'), 'architecture',  'account_tree',       2, false, true),
  ('project', (SELECT id FROM project WHERE code = 'streamflow-music-frontend'), 'features',      'featured_play_list', 3, false, false),
  ('project', (SELECT id FROM project WHERE code = 'streamflow-music-frontend'), 'ui_ux',         'palette',            4, false, false),
  ('project', (SELECT id FROM project WHERE code = 'streamflow-music-frontend'), 'i18n',          'translate',          5, false, false)
ON CONFLICT DO NOTHING;

INSERT INTO content_section_translation (content_section_id, language_id, title, body)
VALUES
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_type = 'project' AND cs.entity_id = (SELECT id FROM project WHERE code = 'streamflow-music-frontend') AND cs.section_key = 'overview'),
   (SELECT id FROM language WHERE code = 'es'), 'Descripción General', 'SPA moderna construida con Angular 19+ y SSR. Incluye reproductor de música global, tematización dinámica con Material Design, internacionalización (inglés/español), autenticación con Supabase, gestión de playlists con extracción de colores y gestión de estado reactiva usando signals de Angular.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_type = 'project' AND cs.entity_id = (SELECT id FROM project WHERE code = 'streamflow-music-frontend') AND cs.section_key = 'overview'),
   (SELECT id FROM language WHERE code = 'en'), 'Overview', 'Modern SPA built with Angular 19+ and SSR. Features a global music player, dynamic Material Design theming, internationalization (English/Spanish), Supabase authentication, playlist management with color extraction, and reactive state management using Angular signals.'),

  ((SELECT cs.id FROM content_section cs WHERE cs.entity_type = 'project' AND cs.entity_id = (SELECT id FROM project WHERE code = 'streamflow-music-frontend') AND cs.section_key = 'architecture'),
   (SELECT id FROM language WHERE code = 'es'), 'Arquitectura', 'Diseño dirigido por dominio con casos de uso (AuthSessionUseCase, ChangeLanguageUseCase), interfaces de repositorio (ILanguageRepository con LANGUAGE_REPOSITORY_TOKEN), implementaciones concretas (LanguageRepository) y servicios de presentación (LanguageService, GlobalPlayerStateService, MaterialThemeService). Componentes standalone con detección de cambios OnPush.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_type = 'project' AND cs.entity_id = (SELECT id FROM project WHERE code = 'streamflow-music-frontend') AND cs.section_key = 'architecture'),
   (SELECT id FROM language WHERE code = 'en'), 'Architecture', 'Domain-driven design with use cases (AuthSessionUseCase, ChangeLanguageUseCase), repository interfaces (ILanguageRepository with LANGUAGE_REPOSITORY_TOKEN), concrete implementations (LanguageRepository), and presentation services (LanguageService, GlobalPlayerStateService, MaterialThemeService). Standalone components with OnPush change detection.'),

  ((SELECT cs.id FROM content_section cs WHERE cs.entity_type = 'project' AND cs.entity_id = (SELECT id FROM project WHERE code = 'streamflow-music-frontend') AND cs.section_key = 'features'),
   (SELECT id FROM language WHERE code = 'es'), 'Funcionalidades', E'• Reproductor de música global con controles de reproducción (GlobalPlayerStateService)\n• Tematización dinámica Material Design (MaterialThemeService, ThemeDirective)\n• Autenticación con flujos de login/registro vía Supabase\n• Gestión de playlists con extracción automática de colores\n• Biblioteca musical con tablas ordenables (MusicsTable, MusicsTablePlay)\n• Funcionalidad de exploración/búsqueda\n• Interceptores HTTP para tokens de autenticación (AuthTokenInterceptor)\n• Documentación generada con Compodoc'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_type = 'project' AND cs.entity_id = (SELECT id FROM project WHERE code = 'streamflow-music-frontend') AND cs.section_key = 'features'),
   (SELECT id FROM language WHERE code = 'en'), 'Features', E'• Global music player with playback controls (GlobalPlayerStateService)\n• Dynamic Material Design theming (MaterialThemeService, ThemeDirective)\n• Authentication with login/register flows via Supabase\n• Playlist management with automatic color extraction\n• Music library with sortable tables (MusicsTable, MusicsTablePlay)\n• Explore/search functionality\n• HTTP interceptors for auth tokens (AuthTokenInterceptor)\n• Compodoc-generated documentation'),

  ((SELECT cs.id FROM content_section cs WHERE cs.entity_type = 'project' AND cs.entity_id = (SELECT id FROM project WHERE code = 'streamflow-music-frontend') AND cs.section_key = 'ui_ux'),
   (SELECT id FROM language WHERE code = 'es'), 'UI/UX', 'Estilos SCSS con variables y sistema de módulos (@use, @forward). Cambio dinámico de temas mediante MaterialThemeService con tokens de Material Design. Layouts responsivos, directivas personalizadas (ThemeDirective), integración de MatIcon en tablas de música y estilos consistentes a nivel de componente.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_type = 'project' AND cs.entity_id = (SELECT id FROM project WHERE code = 'streamflow-music-frontend') AND cs.section_key = 'ui_ux'),
   (SELECT id FROM language WHERE code = 'en'), 'UI/UX', 'SCSS styling with variables and module system (@use, @forward). Dynamic theme switching via MaterialThemeService with Material Design tokens. Responsive layouts, custom directives (ThemeDirective), MatIcon integration in music tables, and consistent component-level styling.'),

  ((SELECT cs.id FROM content_section cs WHERE cs.entity_type = 'project' AND cs.entity_id = (SELECT id FROM project WHERE code = 'streamflow-music-frontend') AND cs.section_key = 'i18n'),
   (SELECT id FROM language WHERE code = 'es'), 'Internacionalización', 'Soporte completo de i18n con ngx-translate para inglés y español. LanguageRepository maneja detección de idioma del navegador y persistencia en localStorage. LanguageService provee signals reactivos para vinculación con la UI. Código consciente de plataforma con verificaciones typeof window para compatibilidad SSR.'),
  ((SELECT cs.id FROM content_section cs WHERE cs.entity_type = 'project' AND cs.entity_id = (SELECT id FROM project WHERE code = 'streamflow-music-frontend') AND cs.section_key = 'i18n'),
   (SELECT id FROM language WHERE code = 'en'), 'Internationalization', 'Full i18n support with ngx-translate for English and Spanish. LanguageRepository handles browser language detection and localStorage persistence. LanguageService provides reactive signals for UI binding. Platform-aware code with typeof window checks for SSR compatibility.')
ON CONFLICT (content_section_id, language_id) DO NOTHING;

COMMIT;
