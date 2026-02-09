-- ============================================================================
-- 📄 CONTENT SECTIONS para proyectos
-- ============================================================================

INSERT INTO content_section (id, entity_type, entity_id, section_key, icon, position, is_archived, is_pinned) VALUES
-- Monorepo (project 1)
(1, 'project', 1, 'overview',        'info',           1, false, true),
(2, 'project', 1, 'architecture',    'account_tree',   2, false, true),
(3, 'project', 1, 'tech_stack',      'layers',         3, false, false),
-- Backend (project 2)
(4, 'project', 2, 'overview',        'info',           1, false, true),
(5, 'project', 2, 'architecture',    'account_tree',   2, false, true),
(6, 'project', 2, 'features',        'featured_play_list', 3, false, false),
(7, 'project', 2, 'testing',         'bug_report',     4, false, false),
(8, 'project', 2, 'api',             'api',            5, false, false),
-- Frontend (project 3)
(9,  'project', 3, 'overview',       'info',           1, false, true),
(10, 'project', 3, 'architecture',   'account_tree',   2, false, true),
(11, 'project', 3, 'features',       'featured_play_list', 3, false, false),
(12, 'project', 3, 'ui_ux',          'palette',        4, false, false),
(13, 'project', 3, 'i18n',           'translate',      5, false, false);

SELECT setval('content_section_id_seq', (SELECT MAX(id) FROM content_section));

-- ============================================================================
-- 🌐 CONTENT SECTION TRANSLATIONS
-- ============================================================================

INSERT INTO content_section_translation (content_section_id, language_id, title, body) VALUES
-- Section 1: Monorepo overview
(1, 1, 'Overview', 'StreamFlow Music is a full-stack music streaming platform organized as a monorepo with Git submodules linking the backend and frontend repositories. It provides a unified development experience with shared Supabase infrastructure, consistent Clean Architecture across both codebases, and centralized quality gates via SonarCloud.'),
(1, 2, 'Descripción general', 'StreamFlow Music es una plataforma de streaming de música full-stack organizada como monorepo con submódulos Git que vinculan los repositorios de backend y frontend. Ofrece una experiencia de desarrollo unificada con infraestructura Supabase compartida, Arquitectura Limpia consistente en ambos codebases y quality gates centralizados mediante SonarCloud.'),

-- Section 2: Monorepo architecture
(2, 1, 'Architecture', 'The monorepo follows a submodule-based structure where each child project (backend and frontend) independently implements Clean Architecture with domain, use cases, infrastructure, and presentation layers. Docker Compose orchestrates multi-service deployment.'),
(2, 2, 'Arquitectura', 'El monorepo sigue una estructura basada en submódulos donde cada proyecto hijo (backend y frontend) implementa independientemente Arquitectura Limpia con capas de dominio, casos de uso, infraestructura y presentación. Docker Compose orquesta el despliegue multi-servicio.'),

-- Section 3: Monorepo tech stack
(3, 1, 'Tech Stack', 'Python · Django · Django REST Framework · Angular 19+ · TypeScript · PostgreSQL · Supabase · Docker · SonarCloud · Git Submodules · pytest · SCSS · RxJS · ngx-translate'),
(3, 2, 'Stack tecnológico', 'Python · Django · Django REST Framework · Angular 19+ · TypeScript · PostgreSQL · Supabase · Docker · SonarCloud · Submódulos Git · pytest · SCSS · RxJS · ngx-translate'),

-- Section 4: Backend overview
(4, 1, 'Overview', 'RESTful API built with Django and Django REST Framework. Handles music track processing, artist/album extraction, genre analysis, user profiles with image upload, playlist management, and Supabase authentication. Modular service design with SongDatabaseService, MediaProcessor, and MusicDataConverter.'),
(4, 2, 'Descripción general', 'API RESTful construida con Django y Django REST Framework. Gestiona procesamiento de tracks musicales, extracción de artistas/álbumes, análisis de géneros, perfiles de usuario con carga de imágenes, gestión de playlists y autenticación con Supabase. Diseño modular de servicios con SongDatabaseService, MediaProcessor y MusicDataConverter.'),

-- Section 5: Backend architecture
(5, 1, 'Architecture', 'Strict Clean Architecture across all apps: domain layer (SongEntity, ISongRepository), use cases layer (SaveTrackAsSongUseCase, GetUserProfileUseCase, UploadProfilePicture), infrastructure layer (ORM models, repository implementations), and API layer (ViewSets, DTOs, serializers). Settings are modularized into base, database, auth, REST framework, and Supabase configurations.'),
(5, 2, 'Arquitectura', 'Arquitectura Limpia estricta en todas las apps: capa de dominio (SongEntity, ISongRepository), capa de casos de uso (SaveTrackAsSongUseCase, GetUserProfileUseCase, UploadProfilePicture), capa de infraestructura (modelos ORM, implementaciones de repositorio) y capa API (ViewSets, DTOs, serializadores). Los settings están modularizados en configuraciones base, database, auth, REST framework y Supabase.'),

-- Section 6: Backend features
(6, 1, 'Features', '• Save and process music tracks from Spotify/YouTube sources\n• Automatic artist, album, and genre extraction\n• User profile management with image upload\n• Playlist CRUD operations\n• Supabase authentication integration\n• Custom FilteredViewSetMixin and CRUDViewSetMixin\n• drf-spectacular API schema documentation\n• Paginated endpoints with @paginated_list_endpoint decorator'),
(6, 2, 'Funcionalidades', '• Guardar y procesar tracks musicales desde fuentes Spotify/YouTube\n• Extracción automática de artistas, álbumes y géneros\n• Gestión de perfiles de usuario con carga de imágenes\n• Operaciones CRUD de playlists\n• Integración de autenticación con Supabase\n• FilteredViewSetMixin y CRUDViewSetMixin personalizados\n• Documentación de esquemas API con drf-spectacular\n• Endpoints paginados con decorador @paginated_list_endpoint'),

-- Section 7: Backend testing
(7, 1, 'Testing', '474+ unit tests with zero failures using pytest. Includes pytest-asyncio for async operations, Mock/AsyncMock for dependency isolation, comprehensive DTO validation tests (TestSongCreateDTO, TestSongMapper), use case logic tests, and domain entity validation. Coverage reports in XML format integrated with SonarCloud.'),
(7, 2, 'Testing', 'Más de 474 tests unitarios sin fallos usando pytest. Incluye pytest-asyncio para operaciones asíncronas, Mock/AsyncMock para aislamiento de dependencias, tests completos de validación de DTOs (TestSongCreateDTO, TestSongMapper), tests de lógica de casos de uso y validación de entidades de dominio. Reportes de cobertura en formato XML integrados con SonarCloud.'),

-- Section 8: Backend API
(8, 1, 'API Design', 'RESTful endpoints for songs, artists, albums, genres, playlists, and user profiles. Uses ViewSets (GenreViewSet, UserProfileViewSet) with drf-spectacular @extend_schema_view decorators for auto-generated documentation. Consistent DTO-based request/response patterns with proper HTTP status codes.'),
(8, 2, 'Diseño de API', 'Endpoints RESTful para canciones, artistas, álbumes, géneros, playlists y perfiles de usuario. Usa ViewSets (GenreViewSet, UserProfileViewSet) con decoradores @extend_schema_view de drf-spectacular para documentación autogenerada. Patrones consistentes de request/response basados en DTOs con códigos de estado HTTP apropiados.'),

-- Section 9: Frontend overview
(9, 1, 'Overview', 'Modern SPA built with Angular 19+ and SSR. Features a global music player, dynamic Material Design theming, internationalization (English/Spanish), Supabase authentication, playlist management with color extraction, and reactive state management using Angular signals.'),
(9, 2, 'Descripción general', 'SPA moderna construida con Angular 19+ y SSR. Incluye reproductor de música global, tematización dinámica con Material Design, internacionalización (inglés/español), autenticación con Supabase, gestión de playlists con extracción de colores y gestión de estado reactiva usando signals de Angular.'),

-- Section 10: Frontend architecture
(10, 1, 'Architecture', 'Domain-driven design with use cases (AuthSessionUseCase, ChangeLanguageUseCase), repository interfaces (ILanguageRepository with LANGUAGE_REPOSITORY_TOKEN), concrete implementations (LanguageRepository), and presentation services (LanguageService, GlobalPlayerStateService, MaterialThemeService). Standalone components with OnPush change detection.'),
(10, 2, 'Arquitectura', 'Diseño dirigido por dominio con casos de uso (AuthSessionUseCase, ChangeLanguageUseCase), interfaces de repositorio (ILanguageRepository con LANGUAGE_REPOSITORY_TOKEN), implementaciones concretas (LanguageRepository) y servicios de presentación (LanguageService, GlobalPlayerStateService, MaterialThemeService). Componentes standalone con detección de cambios OnPush.'),

-- Section 11: Frontend features
(11, 1, 'Features', '• Global music player with playback controls (GlobalPlayerStateService)\n• Dynamic Material Design theming (MaterialThemeService, ThemeDirective)\n• Authentication with login/register flows via Supabase\n• Playlist management with automatic color extraction\n• Music library with sortable tables (MusicsTable, MusicsTablePlay)\n• Explore/search functionality\n• HTTP interceptors for auth tokens (AuthTokenInterceptor)\n• Compodoc-generated documentation'),
(11, 2, 'Funcionalidades', '• Reproductor de música global con controles de reproducción (GlobalPlayerStateService)\n• Tematización dinámica Material Design (MaterialThemeService, ThemeDirective)\n• Autenticación con flujos de login/registro vía Supabase\n• Gestión de playlists con extracción automática de colores\n• Biblioteca musical con tablas ordenables (MusicsTable, MusicsTablePlay)\n• Funcionalidad de exploración/búsqueda\n• Interceptores HTTP para tokens de autenticación (AuthTokenInterceptor)\n• Documentación generada con Compodoc'),

-- Section 12: Frontend UI/UX
(12, 1, 'UI/UX', 'SCSS styling with variables and module system (@use, @forward). Dynamic theme switching via MaterialThemeService with Material Design tokens. Responsive layouts, custom directives (ThemeDirective), MatIcon integration in music tables, and consistent component-level styling.'),
(12, 2, 'UI/UX', 'Estilos SCSS con variables y sistema de módulos (@use, @forward). Cambio dinámico de temas mediante MaterialThemeService con tokens de Material Design. Layouts responsivos, directivas personalizadas (ThemeDirective), integración de MatIcon en tablas de música y estilos consistentes a nivel de componente.'),

-- Section 13: Frontend i18n
(13, 1, 'Internationalization', 'Full i18n support with ngx-translate for English and Spanish. LanguageRepository handles browser language detection and localStorage persistence. LanguageService provides reactive signals for UI binding. Platform-aware code with typeof window checks for SSR compatibility.'),
(13, 2, 'Internacionalización', 'Soporte completo de i18n con ngx-translate para inglés y español. LanguageRepository maneja detección de idioma del navegador y persistencia en localStorage. LanguageService provee signals reactivos para vinculación con la UI. Código consciente de plataforma con verificaciones typeof window para compatibilidad SSR.');
