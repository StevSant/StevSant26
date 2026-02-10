-- ============================================================
-- StreamFlow Music - Projects & Translations
-- ============================================================
BEGIN;

-- Root project (monorepo)
INSERT INTO project (code, url, created_at, is_archived, is_pinned, position)
VALUES ('streamflow-music', 'https://github.com/StevSant/streamflow_music', '2025-01-01', false, true, 1)
ON CONFLICT (code) DO NOTHING;

INSERT INTO project_translation (project_id, language_id, title, description)
VALUES
  ((SELECT id FROM project WHERE code = 'streamflow-music'), (SELECT id FROM language WHERE code = 'es'),
   'StreamFlow Music',
   'Plataforma de streaming de música full-stack construida con Arquitectura Limpia. Monorepo que contiene backend (Django REST API) y frontend (Angular SSR) con integración de Supabase, obtención de datos de Spotify/YouTube, reproducción en tiempo real, gestión de playlists, perfiles de usuario y cobertura de tests completa con quality gates de SonarQube.'),
  ((SELECT id FROM project WHERE code = 'streamflow-music'), (SELECT id FROM language WHERE code = 'en'),
   'StreamFlow Music',
   'Full-stack music streaming platform built with Clean Architecture. Monorepo containing backend (Django REST API) and frontend (Angular SSR) with Supabase integration, Spotify/YouTube data sourcing, real-time playback, playlist management, user profiles, and comprehensive test coverage with SonarQube quality gates.')
ON CONFLICT (project_id, language_id) DO NOTHING;

-- Backend child
INSERT INTO project (code, url, created_at, parent_project_id, is_archived, is_pinned, position)
VALUES ('streamflow-music-backend', 'https://github.com/StevSant/streamflow_music_backend', '2025-01-01',
        (SELECT id FROM project WHERE code = 'streamflow-music'), false, true, 1)
ON CONFLICT (code) DO NOTHING;

INSERT INTO project_translation (project_id, language_id, title, description)
VALUES
  ((SELECT id FROM project WHERE code = 'streamflow-music-backend'), (SELECT id FROM language WHERE code = 'es'),
   'StreamFlow Music Backend',
   'API RESTful construida con Django y Django REST Framework siguiendo principios de Arquitectura Limpia (capas de dominio, casos de uso, infraestructura y API). Incluye procesamiento y guardado de tracks musicales, extracción de artistas/álbumes, análisis de géneros, gestión de perfiles con carga de imágenes, CRUD de playlists, autenticación con Supabase y más de 474 tests unitarios con pytest e integración con SonarCloud.'),
  ((SELECT id FROM project WHERE code = 'streamflow-music-backend'), (SELECT id FROM language WHERE code = 'en'),
   'StreamFlow Music Backend',
   'RESTful API built with Django and Django REST Framework following Clean Architecture principles (domain, use cases, infrastructure, API layers). Features include music track processing and saving, artist/album extraction, genre analysis, user profile management with image upload, playlist CRUD, Supabase authentication, and 474+ unit tests with pytest and SonarCloud integration.')
ON CONFLICT (project_id, language_id) DO NOTHING;

-- Frontend child
INSERT INTO project (code, url, created_at, parent_project_id, is_archived, is_pinned, position)
VALUES ('streamflow-music-frontend', 'https://github.com/StevSant/streamflow_music_frontend', '2025-01-01',
        (SELECT id FROM project WHERE code = 'streamflow-music'), false, true, 2)
ON CONFLICT (code) DO NOTHING;

INSERT INTO project_translation (project_id, language_id, title, description)
VALUES
  ((SELECT id FROM project WHERE code = 'streamflow-music-frontend'), (SELECT id FROM language WHERE code = 'es'),
   'StreamFlow Music Frontend',
   'Aplicación de página única moderna construida con Angular 19+ y SSR. Implementa Arquitectura Limpia con casos de uso de dominio, patrón repositorio, gestión de estado reactivo con signals, reproductor de música global, tematización dinámica Material Design, internacionalización con ngx-translate, autenticación con Supabase y documentación con Compodoc. Integrado con SonarCloud.'),
  ((SELECT id FROM project WHERE code = 'streamflow-music-frontend'), (SELECT id FROM language WHERE code = 'en'),
   'StreamFlow Music Frontend',
   'Modern single-page application built with Angular 19+ and SSR. Implements Clean Architecture with domain use cases, repository pattern, reactive state management using signals, global music player, dynamic Material Design theming, internationalization with ngx-translate, Supabase authentication, and Compodoc documentation. Integrated with SonarCloud.')
ON CONFLICT (project_id, language_id) DO NOTHING;

COMMIT;
