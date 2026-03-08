# CLAUDE.md — StevSant26 Portfolio

## Project Overview

Personal portfolio website for Bryan Steven Menoscal Santana(me). Angular 21 frontend + Supabase backend. Deployed on Vercel at `https://stevsant.vercel.app`.

## Tech Stack

- **Frontend:** Angular 21 (standalone components, signals, SSR)
- **Styling:** Tailwind CSS 4 + Angular Material 21
- **Database:** Supabase (PostgreSQL)
- **Testing:** Vitest (not Jest)
- **Build:** Angular CLI, deployed via Vercel
- **Package Manager:** npm
- **Language:** TypeScript 5.9 (strict mode)

## Project Structure

```
frontend/src/app/
├── core/           # Singleton services, models, guards
│   ├── models/
│   │   ├── base/       # BaseEntity, PolymorphicEntity, Language, getTranslation util
│   │   ├── entities/   # Domain models (profile, skill, project, experience, etc.)
│   │   └── form-data/  # Form DTOs (*-form-data.model.ts)
│   ├── services/       # 20+ injectable services (CRUD, auth, translate, storage, etc.)
│   └── guards/         # Route guards (auth, no-auth)
├── features/
│   ├── auth/           # Login page
│   ├── dashboard/      # Admin CRUD for all entities + analytics
│   └── portfolio/      # Public-facing portfolio pages
└── shared/
    ├── components/     # 20+ reusable components (forms, uploads, dialogs, etc.)
    ├── config/         # App constants
    ├── directives/
    ├── pipes/
    └── utils/

supabase/
├── tables/         # SQL table definitions
├── migrations/     # Incremental SQL migrations (16 files)
├── functions/      # SQL functions
├── rls/            # Row-Level Security policies
└── seed/           # Demo/seed data
```

## Path Aliases

- `@core/*` → `src/app/core/*`
- `@shared/*` → `src/app/shared/*`
- `@features/*` → `src/app/features/*`

## Key Commands

```bash
cd frontend
npm start          # Dev server
npm run build      # Production build
npm test           # Run Vitest tests
```

## Architecture & Conventions

### Angular Patterns

- **Standalone components only** — no NgModules
- **Signal-based state** — use Angular signals, not heavy RxJS
- **Route-level lazy loading** — features loaded via `loadChildren`/`loadComponent`
- **SSR with hydration** — app supports server-side rendering

### Custom i18n System

- **NOT ngx-translate** — custom signal-based `TranslateService`
- Translation files: `frontend/src/assets/i18n/es.json` and `en.json`
- Default language: Spanish (es), also supports English (en)
- Usage: `translateService.instant('key')` or `translateService.get('key')` (computed signal)
- Dot-notation keys organized by domain (e.g., `dashboard.projects.title`)
- When adding user-facing text, always add translations to **both** JSON files

### Services

- `CrudService` — generic Supabase CRUD operations (use for all data access)
- `SupabaseClientService` — singleton Supabase client
- `AuthService` — authentication flow
- `TranslateService` — i18n
- `ThemeService` — 4 themes (Dark Elegant, Light Elegant, Midnight Blue, Warm Sepia)
- `StorageService` / `DocumentStorageService` — file uploads to Supabase buckets

### Models

- All entities extend `BaseEntity` (has `id`, `created_at`, `user_id`)
- Translatable entities use separate `*_translation` tables in Supabase
- `PolymorphicEntity` pattern for entities linked via `skill_usage` (projects, experiences, competitions, events)
- Form DTOs live in `core/models/form-data/`

### Database Rules

- **Dual update rule:** Any remote Supabase schema change MUST also update local SQL files in `supabase/`
- Migration files go in `supabase/migrations/` — must be incremental deltas
- Base schema in `supabase/tables/` must always reflect the current final structure
- RLS policies are mandatory on all tables
- Never leave schema drift between remote and local

## Disambiguation Protocol

When requirements are ambiguous, **always ask clarifying questions before proceeding**. Priority order:

1. Data/ID clarifications (what data? which IDs?)
2. Schema clarifications (structure? types?)
3. Business logic (rules? validation?)
4. Architecture (where to put code?)

Do NOT assume IDs, field types, constraints, or seed data values.

## Code Style

- Prettier with 100-char print width
- Imperative mood in commit messages (conventional commits: `feat`, `fix`, `docs`, etc.)
- Component files use `.ts` extension (not `.component.ts` — Angular 21 convention)
- Specs use `*.spec.ts` alongside source files
