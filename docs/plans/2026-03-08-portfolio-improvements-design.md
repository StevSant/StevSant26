# Portfolio Improvements Design

**Date:** 2026-03-08
**Goal:** Elevate the StevSant26 portfolio to impress recruiters and visitors with a sleek, fast, accessible, and well-engineered experience.
**Approach:** Recruiter-First Phases — 4 phases ordered by what a visitor notices first.
**Tools:** Playwright MCP for visual verification throughout.

---

## Current State Summary

| Category                  | Status    |
| ------------------------- | --------- |
| Core Features & Routing   | Excellent |
| State Management (Signals)| Excellent |
| SEO & Structured Data     | Good      |
| Analytics & Recruiter Detection | Impressive |
| Accessibility (a11y)      | Poor      |
| Testing                   | Minimal   |
| Image Optimization        | Missing   |
| PWA / Offline Support     | None      |
| Error Handling UI         | Basic     |
| Documentation             | Adequate  |

---

## Phase 1: Visual Polish & Scroll Animations

First impression — the "wow" factor. What a recruiter sees in the first 10 seconds.

### 1.1 Scroll-Driven Animations

- **Scroll-reveal upgrades** — Replace basic IntersectionObserver reveal with richer animations: fade-up, fade-left/right, scale-in, blur-to-sharp. Staggered delays for list items (skills, projects, experiences).
- **Scroll-progress indicator** — Thin progress bar at the top of portfolio pages showing scroll depth.
- **Parallax depth layers** — Subtle parallax on hero section (banner moves slower than content). Apply to section backgrounds.
- **Number counters** — Animate stats on home page (years of experience, project count, skill count) counting up on scroll into view.

### 1.2 Page Transitions

- **Route transitions** — Smooth fade/slide transitions between portfolio pages using View Transitions API or Angular `@routeAnimations`.
- **Skeleton loaders** — Content placeholders while data loads instead of empty space or spinners.

### 1.3 Micro-Interactions

- **Hover effects** — Cards lift with subtle shadow. Skill chips scale slightly. Project images zoom gently.
- **Button feedback** — Ripple or press animations on CTAs.
- **Theme transition** — Smooth color interpolation when switching themes via CSS transitions on custom properties.
- **Interactive skill bars** — Proficiency levels animate from 0 to value when scrolled into view.

### 1.4 Home Page Hero Enhancement

- **Typing animation** — Animated introduction text or role title that types out.
- **Gradient text** — Animated gradient on the main heading.
- **Floating elements** — Subtle floating tech icons or particles in the hero background.

---

## Phase 2: Performance & Image Optimization

Fast loads signal professionalism. This is what Lighthouse measures.

### 2.1 Image Optimization

- **Responsive images** — `srcset` and `sizes` on all images (avatar, banner, galleries) for correct size per viewport.
- **Next-gen formats** — Serve WebP/AVIF with `<picture>` fallbacks.
- **Blur placeholders (LQIP)** — Tiny blurred image preview while full image loads. Eliminates layout shift.
- **LCP optimization** — Preload hero banner. Remove `loading="lazy"` from above-the-fold images.

### 2.2 Bundle & Load Performance

- **Preconnect hints** — `<link rel="preconnect">` for Supabase API domain.
- **Font optimization** — Preload fonts with `font-display: swap`.
- **Critical CSS** — Inline above-the-fold CSS for faster first paint.
- **Tree-shaking audit** — Verify no unused Material modules or heavy dependencies bloat the bundle.

### 2.3 Core Web Vitals Monitoring

- **Web Vitals tracking** — Integrate `web-vitals` library into existing analytics system (LCP, INP, CLS).
- **Lighthouse CI** — Script to run audits and track scores over time.

### 2.4 SSR & Caching

- **Static pre-rendering** — Pre-render key portfolio pages at build time.
- **Cache headers** — Configure Vercel edge caching for static assets and API responses.
- **Stale-while-revalidate** — Show cached Supabase data immediately while refreshing in background.

---

## Phase 3: Accessibility + SEO + PWA

The "inspect the source" phase. A technically-minded recruiter who opens DevTools sees quality.

### 3.1 Accessibility (a11y)

- **Semantic landmarks** — Proper `<nav>`, `<main>`, `<article>`, `<section>` with `aria-label`. Heading hierarchy audit.
- **Skip navigation** — "Skip to main content" link for keyboard users.
- **ARIA labels** — Label all interactive elements: icon buttons, uploads, toggles, selectors, search inputs, filters.
- **Keyboard navigation** — All elements reachable via Tab. Visible `:focus-visible` ring. Focus trap in modals.
- **Color contrast** — Audit all 4 themes for WCAG AA. Fix failures.
- **Screen reader support** — `aria-live` regions for dynamic content. Alt text for all images.
- **Reduced motion** — Respect `prefers-reduced-motion` to disable/simplify Phase 1 animations.

### 3.2 Dynamic SEO

- **Dynamic sitemap** — Generate `sitemap.xml` at build time including `/projects/:slug`, `/experience/:slug` detail pages.
- **Detail page meta tags** — Unique `<title>`, `<meta description>`, Open Graph tags per detail page.
- **JSON-LD on detail pages** — Structured data for individual projects and experiences.
- **Open Graph images** — Per-page OG images for rich social sharing previews.

### 3.3 PWA

- **Service worker** — Register via `@angular/service-worker`. Cache app shell, fonts, static assets.
- **Web app manifest** — `manifest.webmanifest` with name, icons, theme colors for "Add to Home Screen".
- **Offline fallback** — Branded offline page when network is unavailable.
- **Cache strategy** — Network-first for API data, cache-first for static assets and images.

---

## Phase 4: Testing + DX + Error Handling + Documentation

Engineering rigor — shows production-grade software, not just a pretty demo.

### 4.1 Testing

- **Component tests** — Vitest + Angular testing utilities for key portfolio components (home, projects, experience, skills).
- **Service tests** — Unit tests for `CrudService`, `TranslateService`, `SeoService`, `AnalyticsService`, `AuthService`.
- **Integration tests** — Routing flows, auth guards, referrer tracking redirects.
- **E2E tests** — Playwright for core recruiter journeys: home -> projects -> detail -> experience -> download CV.
- **Coverage threshold** — Minimum 60% coverage enforced in CI.

### 4.2 Error Handling UI

- **404 page** — Branded "not found" page with navigation back to home.
- **Toast/notification system** — Snackbar for success/error feedback on dashboard CRUD operations.
- **Error boundaries** — Graceful fallback UI when components fail to load data (retry button, friendly message).
- **Loading states** — Consistent loading indicators across all data-fetching pages.

### 4.3 Code Quality & DX

- **ESLint** — `angular-eslint` with strict rules and a11y linting.
- **Pre-commit hooks** — Husky + lint-staged for lint and format checks.
- **Prettier enforcement** — Add to lint-staged for automatic formatting.
- **CI pipeline** — GitHub Actions: lint -> test -> build -> Lighthouse audit on every PR.

### 4.4 Documentation

- **Architecture Decision Records (ADRs)** — Why custom i18n, why Supabase, why signals, why 4 themes.
- **Component catalog** — Shared component docs with props and usage examples.
- **Deployment runbook** — Deploy, rollback, and debug production issues.
- **Contributing guide** — For future self or collaborators.

---

## Design Principles

1. **Recruiter-first** — Every decision optimizes for the visitor's experience.
2. **Progressive enhancement** — Each phase ships independently and improves the site.
3. **Respect user preferences** — `prefers-reduced-motion`, `prefers-color-scheme`, keyboard-first.
4. **No over-engineering** — Only build what serves the goal. YAGNI.
5. **Verify visually** — Use Playwright MCP to check changes in-browser throughout.
