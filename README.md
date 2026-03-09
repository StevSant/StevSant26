# StevSant26 — Portfolio

Personal portfolio website for Bryan Steven Menoscal Santana. Built with Angular 21 and Supabase, deployed on Vercel.

**Live:** [stevsant.vercel.app](https://stevsant.vercel.app)

## Tech Stack

| Layer       | Technology                                      |
| ----------- | ----------------------------------------------- |
| Frontend    | Angular 21 (standalone components, signals, SSR)|
| Styling     | Tailwind CSS 4 + Angular Material 21            |
| Database    | Supabase (PostgreSQL)                           |
| Testing     | Vitest                                          |
| CI/CD       | GitHub Actions + Vercel                         |
| PWA         | Angular Service Worker                          |
| i18n        | Custom signal-based translation (ES/EN)         |

## Features

- **Public Portfolio** — Home, projects, experience, education, skills, competitions, events, and contact pages
- **Admin Dashboard** — Full CRUD management for all entities with analytics
- **Internationalization** — Spanish (default) and English with custom signal-based translation system
- **4 Themes** — Dark Elegant, Light Elegant, Midnight Blue, Warm Sepia
- **SSR + PWA** — Server-side rendering with hydration and offline support
- **SEO** — Sitemap, meta tags, JSON-LD structured data
- **Analytics** — Page views, visitor sessions, and Core Web Vitals tracking
- **Accessibility** — Keyboard navigation, ARIA attributes, scroll progress indicator
- **Progressive Images** — Lazy loading with placeholder support

## Project Structure

```
StevSant26/
├── frontend/                 # Angular 21 application
│   └── src/app/
│       ├── core/             # Services (25), models (14 entities), guards
│       ├── features/
│       │   ├── auth/         # Login
│       │   ├── dashboard/    # Admin CRUD for all entities
│       │   └── portfolio/    # Public-facing pages (13 routes)
│       └── shared/           # 25+ reusable components, pipes, directives
├── supabase/                 # Database schema & migrations
│   ├── tables/               # Base SQL definitions
│   ├── migrations/           # 16 incremental migrations
│   ├── functions/            # SQL functions & triggers
│   ├── rls/                  # Row-Level Security policies
│   └── seed/                 # Demo data
└── .github/workflows/        # CI pipeline (lint, test, build)
```

## Getting Started

### Prerequisites

- Node.js 22+
- npm 11+

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm start           # Dev server at http://localhost:4200
npm test            # Run Vitest tests
npm run lint        # ESLint
npm run build       # Production build
```

### Path Aliases

```
@core/*      → src/app/core/*
@shared/*    → src/app/shared/*
@features/*  → src/app/features/*
```

## Database

The project uses Supabase with PostgreSQL. Schema files are maintained in `supabase/` and must stay in sync with the remote database.

- **Tables:** 14 domain entities with translation tables
- **RLS:** Row-Level Security on all tables
- **Functions:** Auto-translation creation, analytics aggregation, user provisioning

## CI/CD

GitHub Actions runs on push/PR to `main`:

1. Install dependencies (`npm ci`)
2. Lint (`npm run lint`)
3. Test (`npm test -- --run`)
4. Build (`npm run build`)

Deployment is handled by Vercel.

## Code Quality

- **TypeScript** strict mode
- **ESLint** + Angular ESLint
- **Prettier** (100-char width)
- **Husky** + lint-staged pre-commit hooks
- **Conventional Commits** (`feat`, `fix`, `docs`, etc.)

## License

Private project. All rights reserved.
