# Codebase Modularization Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Modularize the codebase by extracting inline templates/styles to separate files, splitting monolithic components and services into focused units, and organizing global CSS by domain.

**Architecture:** Four phases executed sequentially. Phase A extracts inline code to files. Phase B splits the analytics component into tab-based widgets and the analytics service into tracking vs dashboard concerns. Phase C extracts portfolio-home sections into child components. Phase D splits styles.css into domain-specific CSS files.

**Tech Stack:** Angular 21 (standalone components, signals), Tailwind CSS 4, TypeScript 5.9

---

### Task 1: Extract inline templates to .html files (Phase A)

**Files to create and modify (7 components):**

For each of these components, extract the `template:` backtick string to a new `.component.html` file and change `template:` to `templateUrl: './component-name.component.html'`:

1. `frontend/src/app/shared/components/portfolio-home-skeleton/portfolio-home-skeleton.component.ts`
2. `frontend/src/app/shared/components/portfolio-grid-skeleton/portfolio-grid-skeleton.component.ts`
3. `frontend/src/app/shared/components/portfolio-skills-skeleton/portfolio-skills-skeleton.component.ts`
4. `frontend/src/app/shared/components/portfolio-timeline-skeleton/portfolio-timeline-skeleton.component.ts`
5. `frontend/src/app/shared/components/dashboard-list-skeleton/dashboard-list-skeleton.component.ts`
6. `frontend/src/app/shared/components/progressive-image/progressive-image.component.ts`
7. `frontend/src/app/shared/components/toast/toast.component.ts`

**Step 1:** For each component, read the .ts file, extract the template string content, create a new `.component.html` file with that content, and replace `template: \`...\`` with `templateUrl: './component-name.component.html'`.

**Step 2:** For `toast.component.ts` only — also extract the `styles: [...]` to a new `toast.component.css` file and replace with `styleUrl: './toast.component.css'`.

**Step 3:** Run build to verify: `cd frontend && npx ng build`

**Step 4:** Commit:
```bash
git add frontend/src/app/shared/components/
git commit -m "refactor(shared): extract inline templates and styles to separate files"
```

---

### Task 2: Split analytics.service.ts into tracking + dashboard services (Phase B)

**Files:**
- Read: `frontend/src/app/core/services/analytics.service.ts` (1,072 lines)
- Create: `frontend/src/app/core/services/analytics-tracking.service.ts`
- Create: `frontend/src/app/core/services/analytics-dashboard.service.ts`
- Modify: `frontend/src/app/core/services/analytics.service.ts` (becomes re-export barrel or delete)

The current service has two distinct concerns:

**analytics-tracking.service.ts** — All portfolio-side tracking (lines 165-658, 764-1072):
- `initSession()`, `trackPageView()`, `updateCurrentPageDuration()`, `finalizeSession()`
- `setupPageLifecycleListeners()`, `trackCvDownload()`
- All private helpers: heartbeat, idle detection, session recovery, device info, hash generation, referrer extraction, retry logic, storage helpers, geolocation
- All constants at the top (RECRUITER_REFERRERS, REFERRER_DOMAIN_MAP, timeouts, etc.)
- All private state fields (sessionId, heartbeatInterval, idleTimeout, etc.)

**analytics-dashboard.service.ts** — All dashboard-side data retrieval (lines 659-763):
- `getAnalyticsSummary()`, `getUniqueVisitors()`, `getRecentPageViews()`, `getRecentSessions()`, `deleteVisitor()`
- Injects `SupabaseClientService` only
- Stateless — just DB queries

**Step 1:** Create `analytics-tracking.service.ts` with all tracking code. Keep `@Injectable({ providedIn: 'root' })`.

**Step 2:** Create `analytics-dashboard.service.ts` with all dashboard query methods. Use `@Injectable({ providedIn: 'root' })`.

**Step 3:** Update all consumers:
- `frontend/src/app/features/portfolio/portfolio-layout/portfolio-layout.component.ts` — change import to `AnalyticsTrackingService`
- Any other portfolio components that call `initSession`, `trackPageView`, `finalizeSession` — switch to `AnalyticsTrackingService`
- `frontend/src/app/features/dashboard/analytics/analytics.component.ts` — change import to `AnalyticsDashboardService`

**Step 4:** Delete or convert the old `analytics.service.ts` into a barrel file re-exporting both, or delete entirely if no other consumers.

**Step 5:** Update `frontend/src/app/core/services/index.ts` barrel if it exists.

**Step 6:** Run build: `cd frontend && npx ng build`

**Step 7:** Commit:
```bash
git commit -m "refactor(analytics): split service into tracking and dashboard concerns"
```

---

### Task 3: Split analytics.component into tab-based widget components (Phase B)

**Files:**
- Read: `frontend/src/app/features/dashboard/analytics/analytics.component.html` (1,138 lines)
- Read: `frontend/src/app/features/dashboard/analytics/analytics.component.ts` (433 lines)
- Create sub-components under `frontend/src/app/features/dashboard/analytics/`:
  - `analytics-kpi-cards/` — KPI summary cards (HTML lines 34-127)
  - `analytics-overview-tab/` — Overview tab with chart + breakdowns (HTML lines 158-360)
  - `analytics-pages-tab/` — Top pages table (HTML lines 361-437)
  - `analytics-referrers-tab/` — Referrer sources breakdown (HTML lines 438-504)
  - `analytics-recruiters-tab/` — Recruiter detection table (HTML lines 505-629)
  - `analytics-visitors-tab/` — Visitors list with filtering/expansion (HTML lines 630-end)

**Step 1:** Create each sub-component as a standalone Angular component with its own `.ts` and `.html` files.

**Step 2:** Each widget receives data via `input()` signals from the parent. The parent passes:
- `summary` signal for KPI cards and overview
- `filledDailyViews`, `maxDailyViews`, `midDailyViews` for overview chart
- `normalizedLanguages`, `avgSessionDuration` for overview breakdowns
- `visitors`, `visitorsLoading`, pagination signals for visitors tab
- Helper methods can stay in parent or be moved to widgets as needed

**Step 3:** The parent `analytics.component` becomes a shell: header + time range selector + tab navigation + `@switch` that renders the appropriate widget.

**Step 4:** Move relevant TS methods to their widget components:
- `getBarHeight()`, chart-related → `analytics-overview-tab`
- `formatPagePath()` → `analytics-pages-tab`
- `getReferrerBadge()`, `filterVisitorsByReferrer()` → `analytics-referrers-tab`
- `getRecruiterConfidence()` → `analytics-recruiters-tab`
- Visitor filtering/sorting/pagination/expansion → `analytics-visitors-tab`
- `formatDuration()`, `getDeviceIcon()`, `formatLanguageTag()`, flag helpers → keep in parent or create shared util

**Step 5:** Run build: `cd frontend && npx ng build`

**Step 6:** Commit:
```bash
git commit -m "refactor(analytics): split component into tab-based widget sub-components"
```

---

### Task 4: Split portfolio-home into section child components (Phase C)

**Files:**
- Read: `frontend/src/app/features/portfolio/portfolio-home/portfolio-home.component.html` (481 lines)
- Read: `frontend/src/app/features/portfolio/portfolio-home/portfolio-home.component.ts` (210 lines)
- Create child components under `frontend/src/app/features/portfolio/portfolio-home/`:
  - `portfolio-hero/` — Hero section with avatar, name, headline, badges, CTA buttons (HTML lines 4-210)
  - `portfolio-about/` — About text + globe/map section (HTML lines 211-259)
  - `portfolio-featured-projects/` — Featured/pinned projects grid (HTML lines 260-343)
  - `portfolio-skills-ticker/` — Scrolling skills overview (HTML lines 344-end, before the image modal)

**Step 1:** Create each child component with its own `.ts` and `.html` files.

**Step 2:** Pass data from parent via `input()` signals:
- `portfolio-hero`: profile data, avatar URL, banner URL, headline, social links, availability, years of experience
- `portfolio-about`: about text, location, globe component data
- `portfolio-featured-projects`: pinned projects array, skill usages, translation helpers
- `portfolio-skills-ticker`: skill categories, skills array

**Step 3:** Move relevant computed signals and methods to child components where they belong.

**Step 4:** The parent `portfolio-home.component` becomes a thin layout:
```html
@if (data.loading()) {
  <app-portfolio-home-skeleton />
} @else {
  <app-portfolio-hero [profile]="..." [avatarUrl]="..." ... />
  <app-portfolio-about [profile]="..." ... />
  <app-portfolio-featured-projects [projects]="..." ... />
  <app-portfolio-skills-ticker [categories]="..." ... />
  <!-- Image modal stays in parent -->
}
```

**Step 5:** Run build: `cd frontend && npx ng build`

**Step 6:** Commit:
```bash
git commit -m "refactor(portfolio-home): extract sections into child components"
```

---

### Task 5: Split styles.css into domain-specific CSS files (Phase D)

**Files:**
- Read: `frontend/src/styles.css` (1,036 lines)
- Create directory: `frontend/src/styles/`
- Create files:
  - `frontend/src/styles/base.css` — Tailwind import, Material Symbols, mat-icon override, theme definitions (4 themes), Tailwind @theme extension, global transitions (lines 1-317)
  - `frontend/src/styles/typography.css` — Labels, markdown section-body styles, gradient-text, typing-cursor (lines 395-403, 839-867, 912-962)
  - `frontend/src/styles/buttons.css` — btn-primary, btn-secondary, btn-view-project, btn-danger, btn-icon, icon-btn, icon-btn-edit/pin/archive/delete (lines 404-649)
  - `frontend/src/styles/cards.css` — card, card-hover, skill-chip, badges, alerts (lines 322-549 relevant parts)
  - `frontend/src/styles/forms.css` — input, input-textarea, label (lines 358-402)
  - `frontend/src/styles/animations.css` — Scroll reveal variants, skills ticker, view transitions, skill bars, skeleton shimmer, lightbox, gallery thumb, parallax, @keyframes, reduced-motion media query (lines 699-910, 964-989)
  - `frontend/src/styles/layout.css` — Nav items, nav links, mobile nav, drag handle, spinners, accessibility (sr-only, skip-link, focus-visible) (lines 551-697, 991-1036)
- Modify: `frontend/src/styles.css` — becomes thin file with `@import` statements

**Step 1:** Create the `frontend/src/styles/` directory.

**Step 2:** Create each domain CSS file by extracting the relevant sections from `styles.css`. Use the section comments (e.g., `/* ============ THEME: ... */`) as natural split boundaries.

**Step 3:** Replace `frontend/src/styles.css` content with:
```css
/* Portfolio Dashboard - Global Styles with Theme System */
@import "./styles/base.css";
@import "./styles/typography.css";
@import "./styles/buttons.css";
@import "./styles/cards.css";
@import "./styles/forms.css";
@import "./styles/animations.css";
@import "./styles/layout.css";
```

**Step 4:** Run build: `cd frontend && npx ng build`

**Step 5:** Commit:
```bash
git commit -m "refactor(styles): split global CSS into domain-specific files"
```

---

### Task 6: Final verification

**Step 1:** Run full build: `cd frontend && npx ng build`

**Step 2:** Run tests: `cd frontend && npm test`

**Step 3:** Start dev server and verify key pages load correctly with Playwright or manual check:
- Dashboard analytics page (all tabs)
- Portfolio home page (all sections)
- Dashboard list pages (filter bar, loading, empty states)

**Step 4:** Fix any issues found.

**Step 5:** Final commit if needed:
```bash
git commit -m "fix: resolve issues from modularization verification"
```
