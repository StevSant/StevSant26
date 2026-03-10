# Analytics Dashboard Phase 1 — Foundation Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add change-awareness, real-time capabilities, and intelligent alerts to the analytics dashboard so the admin knows what changed since their last visit and receives live notifications of important events.

**Architecture:** Supabase table stores last-visit snapshot; new SQL functions compute deltas and period comparisons. Supabase Realtime subscriptions power live visitor counter and toast alerts. All state managed via Angular signals. Banner component with expandable panel shows changes on entry.

**Tech Stack:** Angular 21 (standalone components, signals), Supabase (PostgreSQL, Realtime), Tailwind CSS 4, Angular Material 21, Vitest, TypeScript 5.9

**Spec:** `docs/superpowers/specs/2026-03-10-analytics-dashboard-phase1-design.md`

---

## File Structure

### New Files

| File | Responsibility |
|------|---------------|
| `supabase/tables/admin_dashboard_visit.sql` | DDL for admin_dashboard_visit table |
| `supabase/migrations/add_admin_dashboard_visit.sql` | Migration to create the table |
| `supabase/migrations/enable_realtime_analytics.sql` | Enable Supabase Realtime on analytics tables |
| `supabase/rls/admin_dashboard_visit_rls.sql` | RLS policies for admin_dashboard_visit |
| `supabase/functions/get_analytics_comparison.sql` | SQL function for period-over-period comparison |
| `supabase/functions/get_active_visitor_count.sql` | SQL function for distinct active visitor count |
| `supabase/functions/get_analytics_changes_since.sql` | SQL function for changes since last visit |
| `frontend/src/app/shared/config/analytics.config.ts` | Configurable thresholds and constants |
| `frontend/src/app/core/models/entities/admin-dashboard-visit.model.ts` | TypeScript interfaces for visit snapshot and deltas |
| `frontend/src/app/core/services/analytics-alerts.service.ts` | Realtime alert processing service |
| `frontend/src/app/features/dashboard/analytics/analytics-changes-banner/analytics-changes-banner.component.ts` | Banner + expandable panel component |
| `frontend/src/app/features/dashboard/analytics/analytics-changes-banner/analytics-changes-banner.component.html` | Banner template |
| `frontend/src/app/features/dashboard/analytics/analytics-changes-banner/analytics-changes-banner.component.css` | Banner slide/expand animations |
| `frontend/src/app/features/dashboard/analytics/analytics-toast/analytics-toast.component.ts` | Toast notification component |
| `frontend/src/app/features/dashboard/analytics/analytics-toast/analytics-toast.component.html` | Toast template |
| `frontend/src/app/features/dashboard/analytics/analytics-toast/analytics-toast.component.css` | Toast slide-in animations |

### Modified Files

| File | Changes |
|------|---------|
| `frontend/src/app/core/models/entities/analytics.model.ts` | Add `AnalyticsComparison` interface |
| `frontend/src/app/core/models/entities/index.ts` | Add barrel export for admin-dashboard-visit model |
| `frontend/src/app/core/services/analytics-dashboard.service.ts` | Add 5 new methods (comparison, changes, active visitors, visit save/load, realtime) |
| `frontend/src/app/features/dashboard/analytics/analytics.component.ts` | Integrate banner, live counter, comparison, alerts lifecycle |
| `frontend/src/app/features/dashboard/analytics/analytics.component.html` | Add banner, live badge, toast container |
| `frontend/src/app/features/dashboard/analytics/analytics-kpi-cards/analytics-kpi-cards.component.ts` | Accept comparison input, compute deltas |
| `frontend/src/app/features/dashboard/analytics/analytics-kpi-cards/analytics-kpi-cards.component.html` | Render delta badges on each KPI card |
| `frontend/src/assets/i18n/es.json` | Add `banner.*`, `toast.*`, `live.*` keys under analytics |
| `frontend/src/assets/i18n/en.json` | Same keys in English |

---

## Chunk 1: Supabase Infrastructure

### Task 1: Create admin_dashboard_visit table

**Files:**
- Create: `supabase/tables/admin_dashboard_visit.sql`
- Create: `supabase/migrations/add_admin_dashboard_visit.sql`
- Create: `supabase/rls/admin_dashboard_visit_rls.sql`

- [ ] **Step 1: Write table DDL**

Create `supabase/tables/admin_dashboard_visit.sql`:

```sql
-- Admin dashboard visit tracking
-- Stores the last time the admin visited the analytics dashboard
-- and a snapshot of KPIs at that time for computing deltas

CREATE TABLE admin_dashboard_visit (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  last_visit_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  snapshot JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

```

- [ ] **Step 2: Write migration**

Create `supabase/migrations/add_admin_dashboard_visit.sql`:

```sql
-- Migration: Add admin_dashboard_visit table
-- Tracks when admin last visited analytics dashboard and stores KPI snapshot

CREATE TABLE IF NOT EXISTS admin_dashboard_visit (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  last_visit_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  snapshot JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

```

- [ ] **Step 3: Write RLS policies**

Create `supabase/rls/admin_dashboard_visit_rls.sql`:

```sql
-- RLS for admin_dashboard_visit
-- Only authenticated users can manage their own row

ALTER TABLE admin_dashboard_visit ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own dashboard visit"
  ON admin_dashboard_visit
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own dashboard visit"
  ON admin_dashboard_visit
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own dashboard visit"
  ON admin_dashboard_visit
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

- [ ] **Step 4: Apply migration to Supabase**

Run the migration against the remote database using the Supabase MCP tool `apply_migration`.

- [ ] **Step 5: Apply RLS policies to Supabase**

Execute the RLS SQL against the remote database using the Supabase MCP tool `execute_sql`.

- [ ] **Step 6: Commit**

```bash
git add supabase/tables/admin_dashboard_visit.sql supabase/migrations/add_admin_dashboard_visit.sql supabase/rls/admin_dashboard_visit_rls.sql
git commit -m "feat(analytics): add admin_dashboard_visit table for tracking last visit"
```

---

### Task 2: Enable Supabase Realtime on analytics tables

**Files:**
- Create: `supabase/migrations/enable_realtime_analytics.sql`

- [ ] **Step 1: Write Realtime migration**

Create `supabase/migrations/enable_realtime_analytics.sql`:

```sql
-- Enable Supabase Realtime on analytics tables
-- Required for live visitor counter and smart toast alerts

ALTER PUBLICATION supabase_realtime ADD TABLE visitor_session;
ALTER PUBLICATION supabase_realtime ADD TABLE cv_download;
ALTER PUBLICATION supabase_realtime ADD TABLE page_view;
```

- [ ] **Step 2: Apply migration to Supabase**

Run the migration against the remote database using the Supabase MCP tool `apply_migration`.

- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/enable_realtime_analytics.sql
git commit -m "feat(analytics): enable Supabase Realtime on analytics tables"
```

---

### Task 3: Create get_analytics_comparison SQL function

**Files:**
- Create: `supabase/functions/get_analytics_comparison.sql`

- [ ] **Step 1: Write the SQL function**

Create `supabase/functions/get_analytics_comparison.sql`:

```sql
-- Returns current period KPIs alongside previous period KPIs
-- for computing percentage change deltas on KPI cards.
-- Example: get_analytics_comparison(7) compares last 7 days vs 7-14 days ago.

CREATE OR REPLACE FUNCTION get_analytics_comparison(
  p_days INT DEFAULT 30
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
DECLARE
  current_start TIMESTAMPTZ := NOW() - (p_days || ' days')::INTERVAL;
  previous_start TIMESTAMPTZ := NOW() - (2 * p_days || ' days')::INTERVAL;
  previous_end TIMESTAMPTZ := current_start;

  c_total_views BIGINT;
  c_unique_visitors BIGINT;
  c_potential_recruiters BIGINT;
  c_cv_downloads BIGINT;
  c_avg_session_duration NUMERIC;

  p_total_views BIGINT;
  p_unique_visitors BIGINT;
  p_potential_recruiters BIGINT;
  p_cv_downloads BIGINT;
  p_avg_session_duration NUMERIC;
BEGIN
  -- Current period
  SELECT COUNT(*) INTO c_total_views
  FROM page_view WHERE created_at >= current_start;

  SELECT COUNT(DISTINCT visitor_hash) INTO c_unique_visitors
  FROM visitor_session WHERE started_at >= current_start;

  SELECT COUNT(DISTINCT visitor_hash) INTO c_potential_recruiters
  FROM visitor_session WHERE started_at >= current_start AND is_potential_recruiter = TRUE;

  SELECT COUNT(*) INTO c_cv_downloads
  FROM cv_download WHERE created_at >= current_start;

  SELECT COALESCE(ROUND(AVG(session_dur), 0), 0) INTO c_avg_session_duration
  FROM (
    SELECT SUM(pv.duration_seconds) AS session_dur
    FROM visitor_session vs
    JOIN page_view pv ON pv.session_id = vs.id
    WHERE vs.started_at >= current_start
    GROUP BY vs.id
  ) sub;

  -- Previous period
  SELECT COUNT(*) INTO p_total_views
  FROM page_view WHERE created_at >= previous_start AND created_at < previous_end;

  SELECT COUNT(DISTINCT visitor_hash) INTO p_unique_visitors
  FROM visitor_session WHERE started_at >= previous_start AND started_at < previous_end;

  SELECT COUNT(DISTINCT visitor_hash) INTO p_potential_recruiters
  FROM visitor_session WHERE started_at >= previous_start AND started_at < previous_end AND is_potential_recruiter = TRUE;

  SELECT COUNT(*) INTO p_cv_downloads
  FROM cv_download WHERE created_at >= previous_start AND created_at < previous_end;

  SELECT COALESCE(ROUND(AVG(session_dur), 0), 0) INTO p_avg_session_duration
  FROM (
    SELECT SUM(pv.duration_seconds) AS session_dur
    FROM visitor_session vs
    JOIN page_view pv ON pv.session_id = vs.id
    WHERE vs.started_at >= previous_start AND vs.started_at < previous_end
    GROUP BY vs.id
  ) sub;

  RETURN json_build_object(
    'current', json_build_object(
      'total_views', c_total_views,
      'unique_visitors', c_unique_visitors,
      'potential_recruiters', c_potential_recruiters,
      'cv_downloads', c_cv_downloads,
      'avg_session_duration', c_avg_session_duration
    ),
    'previous', json_build_object(
      'total_views', p_total_views,
      'unique_visitors', p_unique_visitors,
      'potential_recruiters', p_potential_recruiters,
      'cv_downloads', p_cv_downloads,
      'avg_session_duration', p_avg_session_duration
    )
  );
END;
$$;
```

- [ ] **Step 2: Deploy function to Supabase**

Execute the SQL using the Supabase MCP tool `execute_sql`.

- [ ] **Step 3: Test the function**

Run via Supabase MCP `execute_sql`:
```sql
SELECT get_analytics_comparison(30);
```
Expected: JSON with `current` and `previous` objects containing numeric KPIs.

- [ ] **Step 4: Commit**

```bash
git add supabase/functions/get_analytics_comparison.sql
git commit -m "feat(analytics): add get_analytics_comparison SQL function for period deltas"
```

---

### Task 3b: Create get_active_visitor_count SQL function

**Files:**
- Create: `supabase/functions/get_active_visitor_count.sql`

- [ ] **Step 1: Write the SQL function**

Create `supabase/functions/get_active_visitor_count.sql`:

```sql
-- Returns the count of distinct active visitors (with last_seen_at after threshold)

CREATE OR REPLACE FUNCTION get_active_visitor_count(
  p_threshold TIMESTAMPTZ
)
RETURNS INT
LANGUAGE sql
SECURITY INVOKER
AS $$
  SELECT COUNT(DISTINCT visitor_hash)::INT
  FROM visitor_session
  WHERE last_seen_at >= p_threshold;
$$;
```

- [ ] **Step 2: Deploy function to Supabase**

Execute the SQL using the Supabase MCP tool `execute_sql`.

- [ ] **Step 3: Commit**

```bash
git add supabase/functions/get_active_visitor_count.sql
git commit -m "feat(analytics): add get_active_visitor_count SQL function"
```

---

### Task 4: Create get_analytics_changes_since SQL function

**Files:**
- Create: `supabase/functions/get_analytics_changes_since.sql`

- [ ] **Step 1: Write the SQL function**

Create `supabase/functions/get_analytics_changes_since.sql`:

```sql
-- Returns detailed changes since a given timestamp.
-- Used by the changes banner to show what happened since the admin's last visit.

CREATE OR REPLACE FUNCTION get_analytics_changes_since(
  p_since TIMESTAMPTZ
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
DECLARE
  v_new_referrers JSON;
  v_new_countries JSON;
  v_recruiter_sessions JSON;
  v_cv_downloads JSON;
  v_top_growing_pages JSON;
  v_total_new_views BIGINT;
  v_total_new_visitors BIGINT;
  v_total_new_recruiters BIGINT;
  v_total_new_cv_downloads BIGINT;
BEGIN
  -- Aggregate counts since last visit
  SELECT COUNT(*) INTO v_total_new_views
  FROM page_view WHERE created_at >= p_since;

  SELECT COUNT(DISTINCT visitor_hash) INTO v_total_new_visitors
  FROM visitor_session WHERE started_at >= p_since;

  SELECT COUNT(DISTINCT visitor_hash) INTO v_total_new_recruiters
  FROM visitor_session WHERE started_at >= p_since AND is_potential_recruiter = TRUE;

  SELECT COUNT(*) INTO v_total_new_cv_downloads
  FROM cv_download WHERE created_at >= p_since;

  -- New referrer sources since last visit
  SELECT COALESCE(json_agg(sub.referrer_source), '[]'::JSON) INTO v_new_referrers
  FROM (
    SELECT DISTINCT referrer_source
    FROM visitor_session
    WHERE started_at >= p_since
      AND referrer_source IS NOT NULL
      AND referrer_source != ''
    ORDER BY referrer_source
  ) sub;

  -- New countries since last visit
  SELECT COALESCE(json_agg(sub.country), '[]'::JSON) INTO v_new_countries
  FROM (
    SELECT DISTINCT country
    FROM visitor_session
    WHERE started_at >= p_since
      AND country IS NOT NULL
      AND country != ''
    ORDER BY country
  ) sub;

  -- Recruiter sessions since last visit (max 10)
  SELECT COALESCE(json_agg(sub), '[]'::JSON) INTO v_recruiter_sessions
  FROM (
    SELECT
      vs.id,
      vs.referrer_source,
      vs.device_type,
      vs.country,
      vs.started_at,
      vs.total_page_views
    FROM visitor_session vs
    WHERE vs.started_at >= p_since
      AND vs.is_potential_recruiter = TRUE
    ORDER BY vs.started_at DESC
    LIMIT 10
  ) sub;

  -- CV downloads since last visit
  SELECT COALESCE(json_agg(sub), '[]'::JSON) INTO v_cv_downloads
  FROM (
    SELECT
      cd.file_name,
      cd.language,
      cd.created_at
    FROM cv_download cd
    WHERE cd.created_at >= p_since
    ORDER BY cd.created_at DESC
  ) sub;

  -- Top 3 pages with most new views since last visit
  SELECT COALESCE(json_agg(sub), '[]'::JSON) INTO v_top_growing_pages
  FROM (
    SELECT
      pv.page_path,
      COUNT(*) AS new_views
    FROM page_view pv
    WHERE pv.created_at >= p_since
    GROUP BY pv.page_path
    ORDER BY new_views DESC
    LIMIT 3
  ) sub;

  RETURN json_build_object(
    'total_new_views', v_total_new_views,
    'total_new_visitors', v_total_new_visitors,
    'total_new_recruiters', v_total_new_recruiters,
    'total_new_cv_downloads', v_total_new_cv_downloads,
    'new_referrers', v_new_referrers,
    'new_countries', v_new_countries,
    'recruiter_sessions', v_recruiter_sessions,
    'cv_downloads', v_cv_downloads,
    'top_growing_pages', v_top_growing_pages
  );
END;
$$;
```

- [ ] **Step 2: Deploy function to Supabase**

Execute the SQL using the Supabase MCP tool `execute_sql`.

- [ ] **Step 3: Test the function**

Run via Supabase MCP `execute_sql`:
```sql
SELECT get_analytics_changes_since(NOW() - INTERVAL '7 days');
```
Expected: JSON with counts, arrays of referrers, countries, recruiters, downloads, growing pages.

- [ ] **Step 4: Commit**

```bash
git add supabase/functions/get_analytics_changes_since.sql
git commit -m "feat(analytics): add get_analytics_changes_since SQL function for banner data"
```

---

## Chunk 2: Frontend Config, Models & Service Layer

### Task 5: Create analytics config constants

**Files:**
- Create: `frontend/src/app/shared/config/analytics.config.ts`
- Modify: `frontend/src/app/shared/config/constants.ts`

- [ ] **Step 1: Create config file**

Create `frontend/src/app/shared/config/analytics.config.ts`:

```typescript
/** How long (ms) before a visitor is considered inactive */
export const ACTIVE_VISITOR_THRESHOLD_MS = 5 * 60 * 1000; // 5 minutes

/** Polling interval (ms) for active visitor count when Realtime is unavailable */
export const ACTIVE_VISITOR_POLL_INTERVAL_MS = 30 * 1000; // 30 seconds

/** Number of page views in the spike window to trigger a traffic spike alert */
export const TRAFFIC_SPIKE_THRESHOLD = 5;

/** Time window (ms) for traffic spike detection */
export const TRAFFIC_SPIKE_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

/** Cooldown (ms) between traffic spike alerts */
export const TRAFFIC_SPIKE_COOLDOWN_MS = 15 * 60 * 1000; // 15 minutes

/** How long (ms) a toast stays visible before auto-dismissing */
export const TOAST_AUTO_DISMISS_MS = 8 * 1000; // 8 seconds

/** Maximum number of visible toasts at once */
export const TOAST_MAX_VISIBLE = 3;

/** How long (ms) the changes banner stays visible before auto-hiding */
export const BANNER_AUTO_HIDE_MS = 60 * 1000; // 60 seconds

/** Interval (ms) for saving dashboard visit snapshot while tab is active */
export const SNAPSHOT_SAVE_INTERVAL_MS = 30 * 1000; // 30 seconds
```

- [ ] **Step 2: Export from constants barrel**

Add to `frontend/src/app/shared/config/constants.ts`:

```typescript
export * from './analytics.config';
```

- [ ] **Step 3: Commit**

```bash
git add frontend/src/app/shared/config/analytics.config.ts frontend/src/app/shared/config/constants.ts
git commit -m "feat(analytics): add configurable constants for analytics features"
```

---

### Task 6: Create admin-dashboard-visit model and analytics comparison interface

**Files:**
- Create: `frontend/src/app/core/models/entities/admin-dashboard-visit.model.ts`
- Modify: `frontend/src/app/core/models/entities/analytics.model.ts`

- [ ] **Step 1: Create admin-dashboard-visit model**

Create `frontend/src/app/core/models/entities/admin-dashboard-visit.model.ts`:

```typescript
import { TopReferrer, CountryBreakdown } from './analytics.model';

export interface DashboardVisitSnapshot {
  total_views: number;
  unique_visitors: number;
  potential_recruiters: number;
  cv_downloads_total: number;
  avg_session_duration: number;
  top_referrers: TopReferrer[];
  country_breakdown: CountryBreakdown[];
}

export interface AdminDashboardVisit {
  user_id: string;
  last_visit_at: string;
  snapshot: DashboardVisitSnapshot;
  created_at: string;
}

export interface AnalyticsChangesSince {
  total_new_views: number;
  total_new_visitors: number;
  total_new_recruiters: number;
  total_new_cv_downloads: number;
  new_referrers: string[];
  new_countries: string[];
  recruiter_sessions: ChangeRecruiterSession[];
  cv_downloads: ChangeCvDownload[];
  top_growing_pages: ChangeGrowingPage[];
}

export interface ChangeRecruiterSession {
  id: string;
  referrer_source: string;
  device_type: string;
  country: string;
  started_at: string;
  total_page_views: number;
}

export interface ChangeCvDownload {
  file_name: string;
  language: string;
  created_at: string;
}

export interface ChangeGrowingPage {
  page_path: string;
  new_views: number;
}
```

- [ ] **Step 2: Add AnalyticsComparison to analytics.model.ts**

Add at the end of `frontend/src/app/core/models/entities/analytics.model.ts`:

```typescript
export interface AnalyticsPeriodKpis {
  total_views: number;
  unique_visitors: number;
  potential_recruiters: number;
  cv_downloads: number;
  avg_session_duration: number;
}

export interface AnalyticsComparison {
  current: AnalyticsPeriodKpis;
  previous: AnalyticsPeriodKpis;
}
```

- [ ] **Step 3: Add barrel export**

Add to `frontend/src/app/core/models/entities/index.ts`:

```typescript
export * from './admin-dashboard-visit.model';
```

- [ ] **Step 4: Commit**

```bash
git add frontend/src/app/core/models/entities/admin-dashboard-visit.model.ts frontend/src/app/core/models/entities/analytics.model.ts frontend/src/app/core/models/entities/index.ts
git commit -m "feat(analytics): add models for dashboard visit snapshot and period comparison"
```

---

### Task 7: Extend analytics-dashboard.service.ts with new methods

**Files:**
- Modify: `frontend/src/app/core/services/analytics-dashboard.service.ts`

- [ ] **Step 1: Add imports at top of file**

Add these imports to the top of `analytics-dashboard.service.ts`:

```typescript
import { AdminDashboardVisit, DashboardVisitSnapshot, AnalyticsChangesSince } from '@core/models/entities/admin-dashboard-visit.model';
import { AnalyticsComparison } from '@core/models/entities/analytics.model';
import { ACTIVE_VISITOR_THRESHOLD_MS } from '@shared/config/analytics.config';
```

- [ ] **Step 2: Add getAnalyticsComparison method**

Add after the existing `getAnalyticsSummary` method:

```typescript
async getAnalyticsComparison(days: number = 30): Promise<AnalyticsComparison | null> {
  const { data, error } = await this.client.client.rpc('get_analytics_comparison', {
    p_days: days,
  });

  if (error) {
    console.error('Error fetching analytics comparison:', error);
    return null;
  }

  return data as AnalyticsComparison;
}
```

- [ ] **Step 3: Add getChangesSinceLastVisit method**

```typescript
async getChangesSinceLastVisit(lastVisitAt: string): Promise<AnalyticsChangesSince | null> {
  const { data, error } = await this.client.client.rpc('get_analytics_changes_since', {
    p_since: lastVisitAt,
  });

  if (error) {
    console.error('Error fetching changes since last visit:', error);
    return null;
  }

  return data as AnalyticsChangesSince;
}
```

- [ ] **Step 4: Add getActiveVisitorCount method**

```typescript
async getActiveVisitorCount(): Promise<number> {
  const thresholdDate = new Date(Date.now() - ACTIVE_VISITOR_THRESHOLD_MS).toISOString();

  // Use raw SQL via RPC to get DISTINCT count (Supabase select doesn't support DISTINCT counts)
  const { data, error } = await this.client.client.rpc('get_active_visitor_count', {
    p_threshold: thresholdDate,
  });

  if (error) {
    console.error('Error fetching active visitor count:', error);
    return 0;
  }

  return (data as number) ?? 0;
}
```

- [ ] **Step 5: Add loadDashboardVisit and saveDashboardVisit methods**

```typescript
async loadDashboardVisit(): Promise<AdminDashboardVisit | null> {
  const { data, error } = await this.client.client
    .from('admin_dashboard_visit')
    .select('*')
    .single();

  if (error) {
    console.error('Error loading dashboard visit:', error);
    return null;
  }

  return data as AdminDashboardVisit;
}

async saveDashboardVisit(snapshot: DashboardVisitSnapshot): Promise<void> {
  const userId = (await this.client.client.auth.getUser()).data.user?.id;
  if (!userId) return;

  const { error } = await this.client.client
    .from('admin_dashboard_visit')
    .upsert(
      {
        user_id: userId,
        last_visit_at: new Date().toISOString(),
        snapshot,
      },
      { onConflict: 'user_id' }
    );

  if (error) {
    console.error('Error saving dashboard visit:', error);
  }
}
```

- [ ] **Step 6: Add subscribeToRealtimeChanges method**

```typescript
subscribeToRealtimeChanges(handlers: {
  onVisitorInsert?: (payload: any) => void;
  onVisitorUpdate?: (payload: any) => void;
  onCvDownload?: (payload: any) => void;
  onPageView?: (payload: any) => void;
}) {
  const channel = this.client.client
    .channel('admin-analytics-realtime')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'visitor_session' },
      (payload) => handlers.onVisitorInsert?.(payload)
    )
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'visitor_session' },
      (payload) => handlers.onVisitorUpdate?.(payload)
    )
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'cv_download' },
      (payload) => handlers.onCvDownload?.(payload)
    )
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'page_view' },
      (payload) => handlers.onPageView?.(payload)
    )
    .subscribe();

  return channel;
}
```

- [ ] **Step 7: Commit**

```bash
git add frontend/src/app/core/services/analytics-dashboard.service.ts
git commit -m "feat(analytics): add service methods for comparison, changes, realtime, and visit tracking"
```

---

### Task 8: Create analytics-alerts service

**Files:**
- Create: `frontend/src/app/core/services/analytics-alerts.service.ts`

- [ ] **Step 1: Create the alerts service**

Create `frontend/src/app/core/services/analytics-alerts.service.ts`:

```typescript
import { inject, Injectable, signal, computed } from '@angular/core';
import {
  TRAFFIC_SPIKE_THRESHOLD,
  TRAFFIC_SPIKE_WINDOW_MS,
  TRAFFIC_SPIKE_COOLDOWN_MS,
  TOAST_MAX_VISIBLE,
  TOAST_AUTO_DISMISS_MS,
} from '@shared/config/analytics.config';
import { TranslateService } from '@core/services/translate.service';

export interface AnalyticsAlert {
  id: string;
  type: 'recruiter' | 'cv_download' | 'new_country' | 'traffic_spike';
  icon: string;
  color: string;
  message: string;
  timestamp: Date;
}

@Injectable({ providedIn: 'root' })
export class AnalyticsAlertsService {
  private translate = inject(TranslateService);
  private allAlerts = signal<AnalyticsAlert[]>([]);
  private alertedVisitorHashes = new Set<string>();
  private alertedCountries = new Set<string>();
  private pageViewTimestamps: number[] = [];
  private lastSpikeAlert = 0;
  private dismissTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

  visibleAlerts = computed(() => this.allAlerts().slice(0, TOAST_MAX_VISIBLE));

  handleVisitorInsert(payload: any): void {
    const record = payload.new;
    if (!record) return;

    // Check for new country
    if (record.country && !this.alertedCountries.has(record.country)) {
      this.alertedCountries.add(record.country);
      this.addAlert({
        type: 'new_country',
        icon: 'flag',
        color: 'purple',
        message: this.translate.instant('analytics.toast.newCountry').replace('{{country}}', record.country),
      });
    }
  }

  handleVisitorUpdate(payload: any): void {
    const record = payload.new;
    const oldRecord = payload.old;
    if (!record) return;

    // Check for new recruiter detection
    if (
      record.is_potential_recruiter &&
      !oldRecord?.is_potential_recruiter &&
      !this.alertedVisitorHashes.has(record.visitor_hash)
    ) {
      this.alertedVisitorHashes.add(record.visitor_hash);
      const source = record.referrer_source || 'unknown';
      this.addAlert({
        type: 'recruiter',
        icon: 'work',
        color: 'blue',
        message: this.translate.instant('analytics.toast.recruiter').replace('{{source}}', source),
      });
    }
  }

  handleCvDownload(payload: any): void {
    const record = payload.new;
    if (!record) return;

    const fileName = record.file_name || 'CV';
    this.addAlert({
      type: 'cv_download',
      icon: 'download',
      color: 'green',
      message: this.translate.instant('analytics.toast.cvDownload').replace('{{fileName}}', fileName),
    });
  }

  handlePageView(payload: any): void {
    const now = Date.now();
    this.pageViewTimestamps.push(now);

    // Clean old timestamps outside the window
    const windowStart = now - TRAFFIC_SPIKE_WINDOW_MS;
    this.pageViewTimestamps = this.pageViewTimestamps.filter((t) => t >= windowStart);

    // Check spike threshold
    if (
      this.pageViewTimestamps.length >= TRAFFIC_SPIKE_THRESHOLD &&
      now - this.lastSpikeAlert > TRAFFIC_SPIKE_COOLDOWN_MS
    ) {
      this.lastSpikeAlert = now;
      this.addAlert({
        type: 'traffic_spike',
        icon: 'trending_up',
        color: 'orange',
        message: this.translate.instant('analytics.toast.trafficSpike').replace('{{count}}', String(this.pageViewTimestamps.length)),
      });
    }
  }

  dismissAlert(id: string): void {
    const timeout = this.dismissTimeouts.get(id);
    if (timeout) clearTimeout(timeout);
    this.dismissTimeouts.delete(id);
    this.allAlerts.update((alerts) => alerts.filter((a) => a.id !== id));
  }

  resetSession(): void {
    this.alertedVisitorHashes.clear();
    this.alertedCountries.clear();
    this.pageViewTimestamps = [];
    this.lastSpikeAlert = 0;
    this.allAlerts.set([]);
    this.dismissTimeouts.forEach((timeout) => clearTimeout(timeout));
    this.dismissTimeouts.clear();
  }

  initKnownCountries(countries: string[]): void {
    countries.forEach((c) => this.alertedCountries.add(c));
  }

  private addAlert(params: Omit<AnalyticsAlert, 'id' | 'timestamp'>): void {
    const alert: AnalyticsAlert = {
      ...params,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    };

    this.allAlerts.update((alerts) => [alert, ...alerts]);

    // Auto-dismiss
    const timeout = setTimeout(() => {
      this.dismissAlert(alert.id);
    }, TOAST_AUTO_DISMISS_MS);
    this.dismissTimeouts.set(alert.id, timeout);
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/app/core/services/analytics-alerts.service.ts
git commit -m "feat(analytics): add analytics alerts service for realtime toast notifications"
```

---

## Chunk 3: Banner & Toast Components

### Task 9: Add i18n translation keys

**Files:**
- Modify: `frontend/src/assets/i18n/es.json`
- Modify: `frontend/src/assets/i18n/en.json`

- [ ] **Step 1: Add Spanish translation keys**

Add these keys inside the existing `"analytics"` object in `es.json`:

```json
"banner": {
  "sinceLastVisit": "Desde tu última visita",
  "timeAgo": "hace {{time}}",
  "newViews": "+{{count}} vistas",
  "newVisitors": "+{{count}} visitantes",
  "newRecruiters": "+{{count}} reclutadores",
  "newCvDownloads": "+{{count}} descargas CV",
  "noChanges": "Sin novedades desde tu última visita",
  "viewDetails": "Ver detalles",
  "hideDetails": "Ocultar detalles",
  "newReferrers": "Nuevas fuentes de tráfico",
  "newCountries": "Nuevos países",
  "topGrowingPages": "Páginas con más crecimiento",
  "recentRecruiters": "Reclutadores recientes",
  "recentCvDownloads": "Descargas de CV recientes",
  "views": "vistas"
},
"toast": {
  "recruiter": "Posible reclutador desde {{source}} está visitando tu portfolio",
  "cvDownload": "Alguien descargó tu CV: {{fileName}}",
  "newCountry": "Primera visita desde {{country}}",
  "trafficSpike": "Actividad inusual: {{count}} vistas en los últimos 10 minutos"
},
"live": {
  "active": "en vivo",
  "unavailable": "en vivo no disponible"
},
"comparison": {
  "vs": "vs {{count}} en periodo anterior",
  "new": "NUEVO",
  "noChange": "sin cambios"
}
```

- [ ] **Step 2: Add English translation keys**

Add these keys inside the existing `"analytics"` object in `en.json`:

```json
"banner": {
  "sinceLastVisit": "Since your last visit",
  "timeAgo": "{{time}} ago",
  "newViews": "+{{count}} views",
  "newVisitors": "+{{count}} visitors",
  "newRecruiters": "+{{count}} recruiters",
  "newCvDownloads": "+{{count}} CV downloads",
  "noChanges": "No changes since your last visit",
  "viewDetails": "View details",
  "hideDetails": "Hide details",
  "newReferrers": "New traffic sources",
  "newCountries": "New countries",
  "topGrowingPages": "Top growing pages",
  "recentRecruiters": "Recent recruiters",
  "recentCvDownloads": "Recent CV downloads",
  "views": "views"
},
"toast": {
  "recruiter": "Potential recruiter from {{source}} is visiting your portfolio",
  "cvDownload": "Someone downloaded your CV: {{fileName}}",
  "newCountry": "First visit from {{country}}",
  "trafficSpike": "Unusual activity: {{count}} views in the last 10 minutes"
},
"live": {
  "active": "live",
  "unavailable": "live unavailable"
},
"comparison": {
  "vs": "vs {{count}} in previous period",
  "new": "NEW",
  "noChange": "no change"
}
```

- [ ] **Step 3: Commit**

```bash
git add frontend/src/assets/i18n/es.json frontend/src/assets/i18n/en.json
git commit -m "feat(analytics): add i18n keys for banner, toast, live counter, and comparison"
```

---

### Task 10: Create analytics-changes-banner component

**Files:**
- Create: `frontend/src/app/features/dashboard/analytics/analytics-changes-banner/analytics-changes-banner.component.ts`
- Create: `frontend/src/app/features/dashboard/analytics/analytics-changes-banner/analytics-changes-banner.component.html`
- Create: `frontend/src/app/features/dashboard/analytics/analytics-changes-banner/analytics-changes-banner.component.css`

- [ ] **Step 1: Create the component TypeScript file**

Create `frontend/src/app/features/dashboard/analytics/analytics-changes-banner/analytics-changes-banner.component.ts`:

```typescript
import { Component, inject, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AnalyticsChangesSince } from '@core/models/entities/admin-dashboard-visit.model';
import { TranslateService } from '@core/services/translate.service';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { formatPagePath } from '../analytics-utils';
import { BANNER_AUTO_HIDE_MS } from '@shared/config/analytics.config';

@Component({
  selector: 'app-analytics-changes-banner',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, TranslatePipe],
  templateUrl: './analytics-changes-banner.component.html',
  styleUrl: './analytics-changes-banner.component.css',
})
export class AnalyticsChangesBannerComponent {
  changes = input.required<AnalyticsChangesSince>();
  lastVisitAt = input.required<string>();
  dismissed = output<void>();

  translate = inject(TranslateService);

  expanded = signal(false);
  visible = signal(true);
  private autoHideTimeout: ReturnType<typeof setTimeout> | null = null;

  formatPagePath = formatPagePath;

  hasChanges = computed(() => {
    const c = this.changes();
    return (
      c.total_new_views > 0 ||
      c.total_new_visitors > 0 ||
      c.total_new_recruiters > 0 ||
      c.total_new_cv_downloads > 0
    );
  });

  timeAgo = computed(() => {
    const lastVisit = new Date(this.lastVisitAt());
    const now = new Date();
    const diffMs = now.getTime() - lastVisit.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays}d`;
    if (diffHours > 0) return `${diffHours}h`;
    return `${diffMins}m`;
  });

  ngOnInit(): void {
    this.autoHideTimeout = setTimeout(() => {
      this.dismiss();
    }, BANNER_AUTO_HIDE_MS);
  }

  ngOnDestroy(): void {
    if (this.autoHideTimeout) {
      clearTimeout(this.autoHideTimeout);
    }
  }

  toggleExpanded(): void {
    this.expanded.update((v) => !v);
  }

  dismiss(): void {
    this.visible.set(false);
    this.dismissed.emit();
  }
}
```

- [ ] **Step 2: Create the component template**

Create `frontend/src/app/features/dashboard/analytics/analytics-changes-banner/analytics-changes-banner.component.html`:

```html
@if (visible()) {
  <div class="banner-container">
    <!-- Compact banner -->
    <div class="flex items-center justify-between rounded-lg border px-4 py-3"
         [class]="hasChanges() ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800' : 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700'">
      <div class="flex items-center gap-3 flex-1 min-w-0">
        <mat-icon class="text-emerald-600 dark:text-emerald-400 shrink-0">
          {{ hasChanges() ? 'notifications_active' : 'check_circle' }}
        </mat-icon>

        @if (hasChanges()) {
          <div class="flex items-center gap-2 flex-wrap text-sm">
            <span class="font-medium text-gray-700 dark:text-gray-200">
              {{ 'analytics.banner.sinceLastVisit' | translate }}
              <span class="text-gray-500 dark:text-gray-400">({{ timeAgo() }})</span>:
            </span>

            @if (changes().total_new_views > 0) {
              <span class="text-emerald-600 dark:text-emerald-400 font-semibold">
                +{{ changes().total_new_views }} {{ 'analytics.totalViews' | translate }}
              </span>
            }
            @if (changes().total_new_visitors > 0) {
              <span class="text-emerald-600 dark:text-emerald-400 font-semibold">
                +{{ changes().total_new_visitors }} {{ 'analytics.uniqueVisitors' | translate }}
              </span>
            }
            @if (changes().total_new_recruiters > 0) {
              <span class="text-blue-600 dark:text-blue-400 font-semibold">
                +{{ changes().total_new_recruiters }} {{ 'analytics.potentialRecruiters' | translate }}
              </span>
            }
            @if (changes().total_new_cv_downloads > 0) {
              <span class="text-amber-600 dark:text-amber-400 font-semibold">
                +{{ changes().total_new_cv_downloads }} {{ 'analytics.cvDownloads' | translate }}
              </span>
            }
          </div>
        } @else {
          <span class="text-sm text-gray-500 dark:text-gray-400">
            {{ 'analytics.banner.noChanges' | translate }}
          </span>
        }
      </div>

      <div class="flex items-center gap-1 shrink-0">
        @if (hasChanges()) {
          <button mat-icon-button (click)="toggleExpanded()" class="!size-8">
            <mat-icon class="!text-lg">{{ expanded() ? 'expand_less' : 'expand_more' }}</mat-icon>
          </button>
        }
        <button mat-icon-button (click)="dismiss()" class="!size-8">
          <mat-icon class="!text-lg">close</mat-icon>
        </button>
      </div>
    </div>

    <!-- Expandable detail panel -->
    @if (expanded() && hasChanges()) {
      <div class="expand-panel mt-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

          <!-- New referrers -->
          @if (changes().new_referrers.length > 0) {
            <div>
              <h4 class="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2">
                {{ 'analytics.banner.newReferrers' | translate }}
              </h4>
              <div class="flex flex-wrap gap-1">
                @for (ref of changes().new_referrers; track ref) {
                  <span class="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-300">
                    {{ ref }}
                  </span>
                }
              </div>
            </div>
          }

          <!-- New countries -->
          @if (changes().new_countries.length > 0) {
            <div>
              <h4 class="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2">
                {{ 'analytics.banner.newCountries' | translate }}
              </h4>
              <div class="flex flex-wrap gap-1">
                @for (country of changes().new_countries; track country) {
                  <span class="inline-flex items-center rounded-full bg-purple-100 dark:bg-purple-900/30 px-2.5 py-0.5 text-xs font-medium text-purple-700 dark:text-purple-300">
                    {{ country }}
                  </span>
                }
              </div>
            </div>
          }

          <!-- Top growing pages -->
          @if (changes().top_growing_pages.length > 0) {
            <div>
              <h4 class="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2">
                {{ 'analytics.banner.topGrowingPages' | translate }}
              </h4>
              <ul class="space-y-1">
                @for (page of changes().top_growing_pages; track page.page_path) {
                  <li class="flex items-center justify-between text-sm">
                    <span class="text-gray-700 dark:text-gray-300">{{ formatPagePath(page.page_path) }}</span>
                    <span class="text-emerald-600 dark:text-emerald-400 font-medium">+{{ page.new_views }}</span>
                  </li>
                }
              </ul>
            </div>
          }

          <!-- Recruiter sessions -->
          @if (changes().recruiter_sessions.length > 0) {
            <div>
              <h4 class="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2">
                {{ 'analytics.banner.recentRecruiters' | translate }}
              </h4>
              <ul class="space-y-1">
                @for (rec of changes().recruiter_sessions; track rec.id) {
                  <li class="text-sm text-gray-700 dark:text-gray-300">
                    <mat-icon class="!text-sm align-middle text-blue-500">work</mat-icon>
                    {{ rec.referrer_source || 'Direct' }} · {{ rec.country || '?' }} · {{ rec.total_page_views }} pages
                  </li>
                }
              </ul>
            </div>
          }

          <!-- CV downloads -->
          @if (changes().cv_downloads.length > 0) {
            <div>
              <h4 class="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2">
                {{ 'analytics.banner.recentCvDownloads' | translate }}
              </h4>
              <ul class="space-y-1">
                @for (dl of changes().cv_downloads; track dl.created_at) {
                  <li class="text-sm text-gray-700 dark:text-gray-300">
                    <mat-icon class="!text-sm align-middle text-amber-500">download</mat-icon>
                    {{ dl.file_name }} ({{ dl.language }})
                  </li>
                }
              </ul>
            </div>
          }

        </div>
      </div>
    }
  </div>
}
```

- [ ] **Step 3: Create the component CSS (animations only)**

Create `frontend/src/app/features/dashboard/analytics/analytics-changes-banner/analytics-changes-banner.component.css`:

```css
.banner-container {
  animation: slideDown 0.3s ease-out;
}

.expand-panel {
  animation: expandIn 0.2s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes expandIn {
  from {
    opacity: 0;
    max-height: 0;
  }
  to {
    opacity: 1;
    max-height: 500px;
  }
}
```

- [ ] **Step 4: Commit**

```bash
git add frontend/src/app/features/dashboard/analytics/analytics-changes-banner/
git commit -m "feat(analytics): add changes banner component with expandable detail panel"
```

---

### Task 11: Create analytics-toast component

**Files:**
- Create: `frontend/src/app/features/dashboard/analytics/analytics-toast/analytics-toast.component.ts`
- Create: `frontend/src/app/features/dashboard/analytics/analytics-toast/analytics-toast.component.html`
- Create: `frontend/src/app/features/dashboard/analytics/analytics-toast/analytics-toast.component.css`

- [ ] **Step 1: Create the toast component TypeScript file**

Create `frontend/src/app/features/dashboard/analytics/analytics-toast/analytics-toast.component.ts`:

```typescript
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AnalyticsAlertsService } from '@core/services/analytics-alerts.service';

@Component({
  selector: 'app-analytics-toast',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './analytics-toast.component.html',
  styleUrl: './analytics-toast.component.css',
})
export class AnalyticsToastComponent {
  alertsService = inject(AnalyticsAlertsService);

  getColorClasses(color: string): string {
    const colorMap: Record<string, string> = {
      blue: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950/50 dark:border-blue-800 dark:text-blue-200',
      green: 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/50 dark:border-emerald-800 dark:text-emerald-200',
      purple: 'bg-purple-50 border-purple-200 text-purple-800 dark:bg-purple-950/50 dark:border-purple-800 dark:text-purple-200',
      orange: 'bg-orange-50 border-orange-200 text-orange-800 dark:bg-orange-950/50 dark:border-orange-800 dark:text-orange-200',
    };
    return colorMap[color] ?? colorMap['blue'];
  }

  getIconColor(color: string): string {
    const iconColors: Record<string, string> = {
      blue: 'text-blue-500',
      green: 'text-emerald-500',
      purple: 'text-purple-500',
      orange: 'text-orange-500',
    };
    return iconColors[color] ?? 'text-blue-500';
  }
}
```

- [ ] **Step 2: Create the toast component template**

Create `frontend/src/app/features/dashboard/analytics/analytics-toast/analytics-toast.component.html`:

```html
<div class="fixed bottom-4 right-4 z-50 flex flex-col-reverse gap-2 max-w-sm">
  @for (alert of alertsService.visibleAlerts(); track alert.id) {
    <div class="toast-item flex items-start gap-3 rounded-lg border p-3 shadow-lg backdrop-blur-sm"
         [class]="getColorClasses(alert.color)">
      <mat-icon [class]="getIconColor(alert.color) + ' shrink-0 mt-0.5'">
        {{ alert.icon }}
      </mat-icon>
      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium leading-snug">{{ alert.message }}</p>
        <p class="text-xs opacity-60 mt-1">
          {{ alert.timestamp | date:'HH:mm' }}
        </p>
      </div>
      <button mat-icon-button (click)="alertsService.dismissAlert(alert.id)" class="!size-6 shrink-0">
        <mat-icon class="!text-sm">close</mat-icon>
      </button>
    </div>
  }
</div>
```

- [ ] **Step 3: Create the toast component CSS (animations only)**

Create `frontend/src/app/features/dashboard/analytics/analytics-toast/analytics-toast.component.css`:

```css
.toast-item {
  animation: slideInRight 0.3s ease-out;
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
```

- [ ] **Step 4: Commit**

```bash
git add frontend/src/app/features/dashboard/analytics/analytics-toast/
git commit -m "feat(analytics): add toast notification component for realtime alerts"
```

---

## Chunk 4: KPI Deltas & Integration

### Task 12: Add delta badges to KPI cards

**Files:**
- Modify: `frontend/src/app/features/dashboard/analytics/analytics-kpi-cards/analytics-kpi-cards.component.ts`
- Modify: `frontend/src/app/features/dashboard/analytics/analytics-kpi-cards/analytics-kpi-cards.component.html`

- [ ] **Step 1: Update KPI cards component to accept comparison data**

In `analytics-kpi-cards.component.ts`, add the `comparison` input and helper methods. Add these imports and properties:

```typescript
import { AnalyticsComparison } from '@core/models/entities/analytics.model';
```

Add `input` to the existing `@angular/core` import. Then add after the existing `summary` input:

```typescript
comparison = input<AnalyticsComparison | null>(null);
```

Add these helper methods to the class:

```typescript
getDelta(current: number, previous: number): { percent: number; direction: 'up' | 'down' | 'neutral' } {
  if (previous === 0) {
    return current > 0
      ? { percent: 100, direction: 'up' }
      : { percent: 0, direction: 'neutral' };
  }
  const percent = Math.round(((current - previous) / previous) * 100);
  if (percent > 0) return { percent, direction: 'up' };
  if (percent < 0) return { percent: Math.abs(percent), direction: 'down' };
  return { percent: 0, direction: 'neutral' };
}

getDeltaClasses(direction: 'up' | 'down' | 'neutral'): string {
  if (direction === 'up') return 'text-emerald-600 dark:text-emerald-400';
  if (direction === 'down') return 'text-red-500 dark:text-red-400';
  return 'text-gray-400 dark:text-gray-500';
}

getDeltaIcon(direction: 'up' | 'down' | 'neutral'): string {
  if (direction === 'up') return '↑';
  if (direction === 'down') return '↓';
  return '—';
}
```

- [ ] **Step 2: Update KPI cards template to show deltas**

In `analytics-kpi-cards.component.html`, add a delta badge below each KPI main value. After each main number `<span>` in each card, add:

For **Total Views** card (after `{{ summary().total_views }}`):

```html
@if (comparison(); as comp) {
  @let delta = getDelta(comp.current.total_views, comp.previous.total_views);
  <span class="text-xs font-medium ml-2" [class]="getDeltaClasses(delta.direction)">
    {{ getDeltaIcon(delta.direction) }} {{ delta.percent }}%
  </span>
}
```

For **Unique Visitors** card (after `{{ summary().unique_visitors }}`):

```html
@if (comparison(); as comp) {
  @let delta = getDelta(comp.current.unique_visitors, comp.previous.unique_visitors);
  <span class="text-xs font-medium ml-2" [class]="getDeltaClasses(delta.direction)">
    {{ getDeltaIcon(delta.direction) }} {{ delta.percent }}%
  </span>
}
```

For **Avg Session Duration** card (after `{{ avgSessionDuration() }}`):

```html
@if (comparison(); as comp) {
  @let delta = getDelta(comp.current.avg_session_duration, comp.previous.avg_session_duration);
  <span class="text-xs font-medium ml-2" [class]="getDeltaClasses(delta.direction)">
    {{ getDeltaIcon(delta.direction) }} {{ delta.percent }}%
  </span>
}
```

For **Potential Recruiters** card (after `{{ summary().potential_recruiters }}`):

```html
@if (comparison(); as comp) {
  @let delta = getDelta(comp.current.potential_recruiters, comp.previous.potential_recruiters);
  <span class="text-xs font-medium ml-2" [class]="getDeltaClasses(delta.direction)">
    {{ getDeltaIcon(delta.direction) }} {{ delta.percent }}%
  </span>
}
```

For **CV Downloads** card (after `{{ summary().cv_downloads_total }}`):

```html
@if (comparison(); as comp) {
  @let delta = getDelta(comp.current.cv_downloads, comp.previous.cv_downloads);
  <span class="text-xs font-medium ml-2" [class]="getDeltaClasses(delta.direction)">
    {{ getDeltaIcon(delta.direction) }} {{ delta.percent }}%
  </span>
}
```

- [ ] **Step 3: Commit**

```bash
git add frontend/src/app/features/dashboard/analytics/analytics-kpi-cards/
git commit -m "feat(analytics): add period-over-period delta badges to KPI cards"
```

---

### Task 13: Integrate everything into analytics.component

**Files:**
- Modify: `frontend/src/app/features/dashboard/analytics/analytics.component.ts`
- Modify: `frontend/src/app/features/dashboard/analytics/analytics.component.html`

- [ ] **Step 1: Update analytics.component.ts imports and signals**

Add these imports:

```typescript
import { OnDestroy } from '@angular/core';
import { AnalyticsComparison } from '@core/models/entities/analytics.model';
import { AdminDashboardVisit, DashboardVisitSnapshot, AnalyticsChangesSince } from '@core/models/entities/admin-dashboard-visit.model';
import { AnalyticsAlertsService } from '@core/services/analytics-alerts.service';
import { AnalyticsChangesBannerComponent } from './analytics-changes-banner/analytics-changes-banner.component';
import { AnalyticsToastComponent } from './analytics-toast/analytics-toast.component';
import { SNAPSHOT_SAVE_INTERVAL_MS, ACTIVE_VISITOR_POLL_INTERVAL_MS } from '@shared/config/analytics.config';
```

Add `AnalyticsChangesBannerComponent` and `AnalyticsToastComponent` to the component's `imports` array.

Make the class implement `OnDestroy`. Add these signals and properties:

```typescript
private alertsService = inject(AnalyticsAlertsService);

comparison = signal<AnalyticsComparison | null>(null);
changesSinceLastVisit = signal<AnalyticsChangesSince | null>(null);
lastVisitAt = signal<string | null>(null);
activeVisitors = signal(0);
realtimeAvailable = signal(true);
showBanner = signal(false);

private realtimeChannel: any = null;
private snapshotInterval: ReturnType<typeof setInterval> | null = null;
private pollingInterval: ReturnType<typeof setInterval> | null = null;
```

- [ ] **Step 2: Update ngOnInit to load all new data**

Replace the existing `ngOnInit` method:

```typescript
async ngOnInit(): Promise<void> {
  await this.loadData();
  await this.loadLastVisitAndChanges();
  await this.loadActiveVisitors();
  this.setupRealtime();
  this.startSnapshotAutoSave();
}
```

- [ ] **Step 3: Add loadLastVisitAndChanges method**

```typescript
private async loadLastVisitAndChanges(): Promise<void> {
  // Try Supabase first, fallback to localStorage
  let visit = await this.analyticsService.loadDashboardVisit();

  if (!visit) {
    const cached = localStorage.getItem('analytics_dashboard_visit');
    if (cached) {
      try {
        visit = JSON.parse(cached) as AdminDashboardVisit;
      } catch { /* ignore */ }
    }
  }

  if (visit?.last_visit_at) {
    this.lastVisitAt.set(visit.last_visit_at);
    const changes = await this.analyticsService.getChangesSinceLastVisit(visit.last_visit_at);
    if (changes) {
      this.changesSinceLastVisit.set(changes);
      this.showBanner.set(true);
    }
  }
}
```

- [ ] **Step 4: Add loadActiveVisitors method**

```typescript
private async loadActiveVisitors(): Promise<void> {
  const count = await this.analyticsService.getActiveVisitorCount();
  this.activeVisitors.set(count);
}
```

- [ ] **Step 5: Add setupRealtime method**

```typescript
private setupRealtime(): void {
  // Initialize known countries to prevent duplicate alerts
  const summary = this.summary();
  if (summary?.country_breakdown) {
    this.alertsService.initKnownCountries(
      summary.country_breakdown.map((c) => c.country)
    );
  }

  this.realtimeChannel = this.analyticsService.subscribeToRealtimeChanges({
    onVisitorInsert: (payload) => {
      this.alertsService.handleVisitorInsert(payload);
      this.loadActiveVisitors();
    },
    onVisitorUpdate: (payload) => {
      this.alertsService.handleVisitorUpdate(payload);
      this.loadActiveVisitors();
    },
    onCvDownload: (payload) => {
      this.alertsService.handleCvDownload(payload);
    },
    onPageView: (payload) => {
      this.alertsService.handlePageView(payload);
    },
  });

  // Handle Realtime errors — fallback to polling
  this.realtimeChannel.on('system', {}, (payload: any) => {
    if (payload?.status === 'error' || payload?.status === 'closed') {
      this.realtimeAvailable.set(false);
      this.startPolling();
    }
  });
}

private startPolling(): void {
  if (this.pollingInterval) return;
  this.pollingInterval = setInterval(() => {
    this.loadActiveVisitors();
  }, ACTIVE_VISITOR_POLL_INTERVAL_MS);
}
```

- [ ] **Step 6: Add snapshot save and cleanup methods**

```typescript
private startSnapshotAutoSave(): void {
  this.snapshotInterval = setInterval(() => {
    this.saveCurrentSnapshot();
  }, SNAPSHOT_SAVE_INTERVAL_MS);
}

private async saveCurrentSnapshot(): Promise<void> {
  const s = this.summary();
  if (!s) return;

  const snapshot: DashboardVisitSnapshot = {
    total_views: s.total_views,
    unique_visitors: s.unique_visitors,
    potential_recruiters: s.potential_recruiters,
    cv_downloads_total: s.cv_downloads_total,
    avg_session_duration: s.avg_session_duration,
    top_referrers: s.top_referrers ?? [],
    country_breakdown: s.country_breakdown ?? [],
  };

  await this.analyticsService.saveDashboardVisit(snapshot);

  // Also save to localStorage
  const visit: AdminDashboardVisit = {
    user_id: '',
    last_visit_at: new Date().toISOString(),
    snapshot,
    created_at: '',
  };
  localStorage.setItem('analytics_dashboard_visit', JSON.stringify(visit));
}

ngOnDestroy(): void {
  // Save snapshot on leave
  this.saveCurrentSnapshot();

  // Cleanup realtime
  if (this.realtimeChannel) {
    this.realtimeChannel.unsubscribe();
  }

  // Cleanup intervals
  if (this.snapshotInterval) {
    clearInterval(this.snapshotInterval);
  }
  if (this.pollingInterval) {
    clearInterval(this.pollingInterval);
  }

  // Reset alerts
  this.alertsService.resetSession();
}
```

- [ ] **Step 7: Update loadData to also fetch comparison**

Modify the existing `loadData` method to also fetch comparison data:

```typescript
async loadData(): Promise<void> {
  this.loading.set(true);
  try {
    const [summaryData, comparisonData] = await Promise.all([
      this.analyticsService.getAnalyticsSummary(this.selectedDays()),
      this.analyticsService.getAnalyticsComparison(this.selectedDays()),
    ]);
    this.summary.set(summaryData);
    this.comparison.set(comparisonData);
  } catch (error) {
    console.error('Error loading analytics data:', error);
  } finally {
    this.loading.set(false);
  }
}
```

- [ ] **Step 8: Add onBannerDismissed handler**

```typescript
onBannerDismissed(): void {
  this.showBanner.set(false);
  this.saveCurrentSnapshot();
}
```

- [ ] **Step 9: Update analytics.component.html**

Add the live badge next to the title. Find the title section and add after the title/subtitle area:

```html
<!-- Live visitor counter - add next to the Analytics title -->
<div class="flex items-center gap-2">
  @if (realtimeAvailable()) {
    <span class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
          [class]="activeVisitors() > 0 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'">
      <span class="relative flex size-2">
        @if (activeVisitors() > 0) {
          <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
        }
        <span class="relative inline-flex size-2 rounded-full"
              [class]="activeVisitors() > 0 ? 'bg-emerald-500' : 'bg-gray-400'"></span>
      </span>
      {{ activeVisitors() }} {{ 'analytics.live.active' | translate }}
    </span>
  } @else {
    <span class="inline-flex items-center gap-1.5 rounded-full bg-gray-100 dark:bg-gray-800 px-2.5 py-1 text-xs text-gray-400">
      <span class="size-2 rounded-full bg-gray-400"></span>
      {{ 'analytics.live.unavailable' | translate }}
    </span>
  }
</div>
```

Add the banner above KPI cards (after loading check, before `<app-analytics-kpi-cards>`):

```html
<!-- Changes banner -->
@if (showBanner() && changesSinceLastVisit() && lastVisitAt()) {
  <app-analytics-changes-banner
    [changes]="changesSinceLastVisit()!"
    [lastVisitAt]="lastVisitAt()!"
    (dismissed)="onBannerDismissed()"
  />
}
```

Pass comparison to KPI cards — update the existing `<app-analytics-kpi-cards>` tag:

```html
<app-analytics-kpi-cards [summary]="summary()!" [comparison]="comparison()" />
```

Add the toast container at the bottom of the template:

```html
<!-- Toast notifications -->
<app-analytics-toast />
```

- [ ] **Step 10: Commit**

```bash
git add frontend/src/app/features/dashboard/analytics/analytics.component.ts frontend/src/app/features/dashboard/analytics/analytics.component.html
git commit -m "feat(analytics): integrate banner, live counter, KPI deltas, and toast alerts"
```

---

### Task 14: Build and verify

- [ ] **Step 1: Run build**

```bash
cd frontend && npm run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 2: Fix any build errors**

If there are TypeScript or template errors, fix them based on compiler output.

- [ ] **Step 3: Run dev server and manual test**

```bash
cd frontend && npm start
```

Open the dashboard, navigate to Analytics tab. Verify:
1. Banner appears showing changes since last visit (or "no changes" on first visit)
2. KPI cards show delta percentages
3. Live visitor counter shows near the title
4. Close and reopen the tab — banner should reflect new snapshot

- [ ] **Step 4: Final commit if any fixes were needed**

```bash
git add -A
git commit -m "fix(analytics): resolve build issues from phase 1 integration"
```

---

## Summary

| Task | Description | Dependencies |
|------|-------------|-------------|
| 1 | admin_dashboard_visit table + RLS | None |
| 2 | Enable Supabase Realtime | None |
| 3 | get_analytics_comparison function | None |
| 3b | get_active_visitor_count function | None |
| 4 | get_analytics_changes_since function | None |
| 5 | Analytics config constants | None |
| 6 | Models (visit snapshot, comparison) | None |
| 7 | Service methods (comparison, changes, realtime, visit) | Tasks 3, 3b, 4, 5, 6 |
| 8 | Analytics alerts service | Task 5 |
| 9 | i18n translations | None |
| 10 | Changes banner component | Tasks 6, 9 |
| 11 | Toast component | Task 8 |
| 12 | KPI card deltas | Task 6 |
| 13 | Integration in analytics.component | Tasks 7, 8, 10, 11, 12 |
| 14 | Build and verify | Task 13 |

**Independent tasks (can run in parallel):** 1, 2, 3, 3b, 4, 5, 6, 8, 9
**Sequential after those:** 7 → 10, 11, 12 → 13 → 14
