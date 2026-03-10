# Analytics Dashboard Phase 1 — Foundation

## Overview

Enhance the analytics dashboard with change-awareness, real-time capabilities, and intelligent alerts. The core problem: the admin has no way to know what changed since their last visit, and the dashboard is entirely pull-based (no live updates).

## Features

### 1. Banner de cambios desde última visita (+ panel expandible)

**Problem:** Admin enters the dashboard and sees numbers but has no context for whether they changed.

**Solution:** A compact banner above KPI cards showing deltas since last visit, with an expandable detail panel.

#### Data Layer

- **New table: `admin_dashboard_visit`**
  - `id` UUID PK
  - `user_id` UUID FK → auth.users (unique constraint)
  - `last_visit_at` TIMESTAMPTZ
  - `snapshot` JSONB — stores KPIs at time of visit (field names match `AnalyticsSummary`):
    ```json
    {
      "total_views": 150,
      "unique_visitors": 45,
      "potential_recruiters": 3,
      "cv_downloads_total": 8,
      "avg_session_duration": 120,
      "top_referrers": [{ "referrer_source": "linkedin.com", "visits": 10 }],
      "country_breakdown": [{ "country": "Ecuador", "count": 5 }]
    }
    ```
  - `created_at` TIMESTAMPTZ DEFAULT NOW()
  - RLS: authenticated users can only read/write their own row
  - **Note:** `user_id` has a unique constraint so only one row exists per user. Consider using `user_id` as PK directly if no multi-row need arises.

- **localStorage cache:** Mirror of `last_visit_at` + `snapshot` for instant reads before Supabase responds.

#### Flow

1. Admin enters Analytics tab → read `admin_dashboard_visit` from Supabase (fallback to localStorage)
2. Fetch current analytics summary (existing `get_analytics_summary` RPC)
3. Compare current data vs snapshot → compute deltas
4. Display banner with deltas
5. Save snapshot periodically (every 30s while tab is active) and on Angular `OnDestroy` (navigating away from Analytics tab within SPA). Do NOT rely on `beforeunload`/`pagehide` for the Supabase write — those are unreliable for async operations. Use `OnDestroy` as the primary save trigger.
6. Also save to localStorage on each save for instant reads next time

#### Banner UI

- Slide-down animation above KPI cards
- Text: *"Desde tu última visita (hace 2 días): +12 vistas, +3 visitantes, +1 reclutador, +2 descargas CV"*
- Green for increments, red for decrements, gray if unchanged
- "Ver detalles" button → expands inline panel
- "×" button to dismiss
- Auto-hides after 60 seconds
- Not shown on first-ever visit (no snapshot exists)

#### Expandable Panel

Sections inside the expanded panel:
- **Nuevos referrers** — traffic sources not in previous snapshot
- **Nuevos países** — countries not in previous snapshot
- **Páginas con más crecimiento** — top 3 pages with most view increase
- **Reclutadores recientes** — recruiters detected since `last_visit_at`
- **Descargas de CV** — each new download since `last_visit_at`

For recruiter and CV download details, a new query is needed filtering by `last_visit_at` timestamp.

#### New Service Method

In `analytics-dashboard.service.ts`:
- `getChangesSinceLastVisit(lastVisitAt: string)` → calls new RPC `get_analytics_changes_since(p_since TIMESTAMPTZ)` returning:
  - New referrers (distinct referrer_source from sessions since timestamp, not in snapshot)
  - New countries
  - Recruiter sessions since timestamp
  - CV downloads since timestamp
  - Page view counts since timestamp (for growth comparison)

---

### 2. Indicadores ↑↓ en KPI cards

**Problem:** KPI cards show absolute numbers with no trend context.

**Solution:** Add percentage change badges comparing current period vs previous equivalent period.

#### Data Layer

- **New SQL function: `get_analytics_comparison(p_days INT)`**
  - Returns current period KPIs AND previous period KPIs in one query
  - Current period: last `p_days` days
  - Previous period: `p_days` to `2 * p_days` days ago
  - Returns JSON with:
    ```json
    {
      "current": { "total_views": 150, "unique_visitors": 45, "potential_recruiters": 3, "cv_downloads": 8, "avg_session_duration": 120 },
      "previous": { "total_views": 130, "unique_visitors": 40, "potential_recruiters": 2, "cv_downloads": 5, "avg_session_duration": 95 }
    }
    ```

#### UI Changes

- Each KPI card gets a delta badge below the main number
- Format: `↑ 12%` (green) or `↓ 5%` (red) or `— 0%` (gray)
- Tooltip showing absolute numbers: "150 vs 130 en el periodo anterior"
- Delta calculation: `((current - previous) / previous) * 100`, handle division by zero (show "NEW" if previous was 0)

#### Modified Components

- `analytics-kpi-cards.component.ts` — accepts comparison data as input, renders delta badges
- `analytics.component.ts` — calls `get_analytics_comparison` alongside existing `get_analytics_summary`

---

### 3. Contador de visitantes en vivo

**Problem:** No way to know if anyone is currently browsing the portfolio.

**Solution:** A live indicator showing active visitor count using Supabase Realtime.

#### Definition of "Active"

A visitor is active if `visitor_session.last_seen_at > NOW() - INTERVAL '5 minutes'`.

#### Data Layer

- Query: `SELECT COUNT(DISTINCT visitor_hash) FROM visitor_session WHERE last_seen_at > NOW() - INTERVAL '5 minutes'`
- Supabase Realtime subscription on `visitor_session` table (INSERT and UPDATE events) to trigger re-query
- **Error handling:** If Realtime subscription fails or disconnects, show a gray "live updates unavailable" indicator and fall back to polling every 30 seconds. On reconnect, restore Realtime and stop polling.

#### UI

- Chip/badge next to the "Analytics" tab title
- Format: `● 2 en vivo` (pulsing green dot when > 0)
- Pulsing dot via CSS animation
- Shows `● 0` with gray dot when no one is active
- Updates automatically via Realtime subscription

#### New Service Method

In `analytics-dashboard.service.ts`:
- `getActiveVisitorCount()` → returns count of active visitors
- `subscribeToVisitorChanges(callback)` → Supabase Realtime channel subscription, returns unsubscribe function

---

### 4. Alertas inteligentes (Toasts)

**Problem:** Important events happen while the admin is viewing the dashboard but go unnoticed until manual refresh.

**Solution:** Real-time toast notifications for significant events.

#### Alert Types

| Type | Trigger | Icon | Color | Message Example |
|------|---------|------|-------|-----------------|
| Recruiter | `visitor_session` UPDATE where `is_potential_recruiter` becomes `true` | work | blue | "Posible reclutador desde LinkedIn está visitando tu portfolio" |
| CV Download | `cv_download` INSERT | download | green | "Alguien descargó tu CV: resume-es.pdf" (uses `file_name` from the table row) |
| New Country | `visitor_session` INSERT with country not seen in current period | flag | purple | "Primera visita desde Alemania" |
| Traffic Spike | Configurable threshold (default: 5+ new `page_view` INSERTs in 10 minutes) | trending_up | orange | "Actividad inusual: 5 visitantes en los últimos 10 minutos" |

**Note:** Traffic spike threshold, cooldown duration (default 15 min), and other magic numbers must be defined as constants in a shared config file (e.g., `shared/config/analytics.config.ts`), not hardcoded in the service.

#### Architecture

- **New service: `analytics-alerts.service.ts`**
  - Subscribes to Supabase Realtime channels: `visitor_session`, `cv_download`, `page_view`
  - Processes events and determines alert type
  - Maintains deduplication set (don't alert same visitor_hash twice per admin session)
  - Traffic spike detection: rolling window of page_view timestamps, alert when count exceeds threshold
  - Emits alerts via Angular signal

- **New component: `analytics-toast.component.ts`**
  - Position: fixed bottom-right
  - Max 3 visible, stacked
  - Slide-in animation from right
  - Auto-dismiss after 8 seconds
  - Manual close button
  - Each toast shows: icon, message, timestamp, and optional action link

#### Realtime Channels

```typescript
// Channel 1: visitor_session changes
supabase.channel('admin-visitor-sessions')
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'visitor_session' }, handleNewVisitor)
  .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'visitor_session' }, handleVisitorUpdate)

// Channel 2: cv_download inserts
supabase.channel('admin-cv-downloads')
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'cv_download' }, handleCvDownload)

// Channel 3: page_view inserts (for spike detection)
supabase.channel('admin-page-views')
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'page_view' }, handlePageView)
```

#### Deduplication & Throttling

- Visitor hash set: prevent duplicate alerts for same visitor
- Traffic spike cooldown: 15 minutes between spike alerts
- Country set: track already-alerted countries to prevent duplicates

---

## New Files

### Frontend
- `frontend/src/app/features/dashboard/analytics/analytics-changes-banner/analytics-changes-banner.component.ts`
- `frontend/src/app/features/dashboard/analytics/analytics-changes-banner/analytics-changes-banner.component.html`
- `frontend/src/app/features/dashboard/analytics/analytics-changes-banner/analytics-changes-banner.component.css` (animations only — layout uses Tailwind)
- `frontend/src/app/features/dashboard/analytics/analytics-toast/analytics-toast.component.ts`
- `frontend/src/app/features/dashboard/analytics/analytics-toast/analytics-toast.component.html`
- `frontend/src/app/features/dashboard/analytics/analytics-toast/analytics-toast.component.css` (animations only — layout uses Tailwind)
- `frontend/src/app/shared/config/analytics.config.ts` (configurable thresholds and constants)
- `frontend/src/app/core/services/analytics-alerts.service.ts`
- `frontend/src/app/core/models/entities/admin-dashboard-visit.model.ts`

### Supabase
- `supabase/migrations/enable_realtime_analytics.sql` (enables Supabase Realtime on `visitor_session`, `cv_download`, `page_view` via `ALTER PUBLICATION supabase_realtime ADD TABLE ...`)
- `supabase/tables/admin_dashboard_visit.sql`
- `supabase/migrations/add_admin_dashboard_visit.sql`
- `supabase/rls/admin_dashboard_visit_rls.sql`
- `supabase/functions/get_analytics_comparison.sql`
- `supabase/functions/get_analytics_changes_since.sql`

### Modified Files
- `frontend/src/app/core/services/analytics-dashboard.service.ts` — new methods
- `frontend/src/app/features/dashboard/analytics/analytics.component.ts` — integrate banner, live counter, comparison data
- `frontend/src/app/features/dashboard/analytics/analytics.component.html` — add banner and live badge
- `frontend/src/app/features/dashboard/analytics/analytics-kpi-cards/analytics-kpi-cards.component.ts` — add delta badges
- `frontend/src/app/features/dashboard/analytics/analytics-kpi-cards/analytics-kpi-cards.component.html` — render deltas
- `frontend/src/assets/i18n/es.json` — new keys under `dashboard.analytics.banner.*`, `dashboard.analytics.toast.*`, `dashboard.analytics.live.*`
- `frontend/src/assets/i18n/en.json` — same keys in English

## Phases (Future)

- **Phase 2:** Heatmap hora/día, Journey map, Engagement score
- **Phase 3:** Period comparison mode, Anomaly detection, Export PDF/CSV
