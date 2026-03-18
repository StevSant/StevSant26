# Email Redesign & CV Download Fix — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the broken cross-origin CV download, redesign both email alert templates to match the Dark Elegant portfolio theme, and enrich recruiter emails with page-view data.

**Architecture:** Shared download utility handles fetch+blob for cross-origin files. Supabase Edge Function (`send-analytics-alert`) gets a Supabase client to query `page_view` for enrichment, plus completely redesigned HTML templates using Dark Elegant color tokens. No SQL trigger or frontend analytics changes.

**Tech Stack:** Angular 21 (signals, standalone components), Supabase Edge Functions (Deno), Supabase JS client, Resend API, TypeScript

**Spec:** `docs/superpowers/specs/2026-03-17-email-redesign-cv-download-fix-design.md`

---

## File Structure

| File | Action | Responsibility |
|------|--------|----------------|
| `frontend/src/app/shared/utils/download-file.util.ts` | Create | Fetch+blob download utility with error fallback |
| `frontend/src/app/features/portfolio/portfolio-layout/portfolio-navbar/portfolio-navbar.component.ts` | Modify | Add `downloadCv()` using shared util, `downloading` signal |
| `frontend/src/app/features/portfolio/portfolio-layout/portfolio-navbar/portfolio-navbar.component.html` | Modify | Change download `<a>` to `<button>`, bind disabled state |
| `frontend/src/app/features/portfolio/portfolio-layout/portfolio-mobile-menu/portfolio-mobile-menu.component.ts` | Modify | Add `downloadCv()` using shared util, `downloading` signal |
| `frontend/src/app/features/portfolio/portfolio-layout/portfolio-mobile-menu/portfolio-mobile-menu.component.html` | Modify | Change download `<a>` to `<button>`, bind disabled state |
| `supabase/edge-functions/send-analytics-alert/index.ts` | Modify | Add Supabase client, page_view query, redesigned email HTML |

---

### Task 1: Create download-file utility

**Files:**
- Create: `frontend/src/app/shared/utils/download-file.util.ts`

- [ ] **Step 1: Create the utility function**

```typescript
/**
 * Downloads a file from a cross-origin URL by fetching it as a blob
 * and triggering a programmatic download. Falls back to window.open
 * if the fetch fails.
 */
export async function downloadFile(url: string, fileName: string): Promise<void> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = blobUrl;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
  } catch {
    window.open(url, '_blank');
  }
}
```

- [ ] **Step 2: Verify it compiles**

Run: `cd frontend && npx ng build --configuration production 2>&1 | head -20`
Expected: No errors related to `download-file.util.ts`

- [ ] **Step 3: Commit**

```bash
git add frontend/src/app/shared/utils/download-file.util.ts
git commit -m "feat(utils): add cross-origin download-file utility"
```

---

### Task 2: Fix CV download in portfolio-navbar

**Files:**
- Modify: `frontend/src/app/features/portfolio/portfolio-layout/portfolio-navbar/portfolio-navbar.component.ts`
- Modify: `frontend/src/app/features/portfolio/portfolio-layout/portfolio-navbar/portfolio-navbar.component.html`

- [ ] **Step 1: Update the component TypeScript**

In `portfolio-navbar.component.ts`, add a `downloading` signal and a `downloadCv()` method that uses the shared utility.

Add `signal` to the existing `@angular/core` import (do NOT create a duplicate import line):
```typescript
import { Component, input, output, inject, signal } from '@angular/core';
```

Add a new import for the download utility:
```typescript
import { downloadFile } from '@shared/utils/download-file.util';
```

Add to the class body:
```typescript
downloading = signal(false);

async downloadCv(cv: Document): Promise<void> {
  if (this.downloading()) return;
  this.downloading.set(true);
  this.analytics.trackCvDownload({
    documentId: cv.id,
    fileName: cv.label || cv.file_name || 'CV',
    language: cv.language?.name || undefined,
  });
  try {
    await downloadFile(cv.url, cv.file_name || 'CV.pdf');
  } finally {
    this.downloading.set(false);
  }
}
```

Remove the old `onCvDownload()` method (its tracking logic is now inside `downloadCv`).

- [ ] **Step 2: Update the component HTML**

In `portfolio-navbar.component.html`, replace the download `<a>` element (the one with `download` attribute, around lines 215-230) with a `<button>`:

Replace:
```html
<a
  [href]="cv.url"
  download
  (click)="onCvDownload(cv); closeAllMenus.emit()"
  class="p-1.5 rounded-md text-(--color-text-muted) hover:text-(--color-accent) hover:bg-(--color-bg-primary) transition-colors"
  [title]="'portfolio.downloadCV' | translate"
>
```

With:
```html
<button
  type="button"
  [disabled]="downloading()"
  (click)="downloadCv(cv); closeAllMenus.emit()"
  class="p-1.5 rounded-md text-(--color-text-muted) hover:text-(--color-accent) hover:bg-(--color-bg-primary) transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
  [title]="'portfolio.downloadCV' | translate"
>
```

Keep the inner `<svg>` icon unchanged. Change the closing `</a>` to `</button>`.

- [ ] **Step 3: Build and verify**

Run: `cd frontend && npx ng build --configuration production 2>&1 | tail -5`
Expected: Build succeeds with no errors.

- [ ] **Step 4: Commit**

```bash
git add frontend/src/app/features/portfolio/portfolio-layout/portfolio-navbar/portfolio-navbar.component.ts
git add frontend/src/app/features/portfolio/portfolio-layout/portfolio-navbar/portfolio-navbar.component.html
git commit -m "fix(navbar): use programmatic blob download for cross-origin CV files"
```

---

### Task 3: Fix CV download in portfolio-mobile-menu

**Files:**
- Modify: `frontend/src/app/features/portfolio/portfolio-layout/portfolio-mobile-menu/portfolio-mobile-menu.component.ts`
- Modify: `frontend/src/app/features/portfolio/portfolio-layout/portfolio-mobile-menu/portfolio-mobile-menu.component.html`

- [ ] **Step 1: Update the component TypeScript**

In `portfolio-mobile-menu.component.ts`, apply the same pattern as navbar.

Add `signal` to the existing `@angular/core` import (do NOT create a duplicate import line):
```typescript
import { Component, output, inject, signal } from '@angular/core';
```

Add a new import for the download utility:
```typescript
import { downloadFile } from '@shared/utils/download-file.util';
```

Add to the class body:
```typescript
downloading = signal(false);

async downloadCv(cv: Document): Promise<void> {
  if (this.downloading()) return;
  this.downloading.set(true);
  this.analytics.trackCvDownload({
    documentId: cv.id,
    fileName: cv.label || cv.file_name || 'CV',
    language: cv.language?.name || undefined,
  });
  try {
    await downloadFile(cv.url, cv.file_name || 'CV.pdf');
  } finally {
    this.downloading.set(false);
  }
}
```

Remove the old `onCvDownload()` method.

- [ ] **Step 2: Update the component HTML**

In `portfolio-mobile-menu.component.html`, replace the download `<a>` (around lines 170-184) with a `<button>`:

Replace:
```html
<a
  [href]="cv.url"
  download
  (click)="onCvDownload(cv); closeMobileMenu.emit()"
  class="p-1.5 rounded-md text-(--color-text-muted) hover:text-(--color-accent) transition-colors"
>
```

With:
```html
<button
  type="button"
  [disabled]="downloading()"
  (click)="downloadCv(cv); closeMobileMenu.emit()"
  class="p-1.5 rounded-md text-(--color-text-muted) hover:text-(--color-accent) transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
>
```

Keep the inner `<svg>` icon unchanged. Change the closing `</a>` to `</button>`.

- [ ] **Step 3: Build and verify**

Run: `cd frontend && npx ng build --configuration production 2>&1 | tail -5`
Expected: Build succeeds with no errors.

- [ ] **Step 4: Commit**

```bash
git add frontend/src/app/features/portfolio/portfolio-layout/portfolio-mobile-menu/portfolio-mobile-menu.component.ts
git add frontend/src/app/features/portfolio/portfolio-layout/portfolio-mobile-menu/portfolio-mobile-menu.component.html
git commit -m "fix(mobile-menu): use programmatic blob download for cross-origin CV files"
```

---

### Task 4: Redesign email templates and enrich recruiter data

**Files:**
- Modify: `supabase/edge-functions/send-analytics-alert/index.ts`

This is the largest task. The edge function will be rewritten with:
1. A Supabase client for querying `page_view`
2. Helper functions for building HTML rows and formatting
3. Completely redesigned Dark Elegant email templates
4. Graceful degradation if the page_view query fails

- [ ] **Step 1: Rewrite the edge function**

Replace the entire contents of `supabase/edge-functions/send-analytics-alert/index.ts` with:

```typescript
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!;
const ALERT_EMAIL = Deno.env.get('ALERT_EMAIL') || 'bryanmenoscal2005@gmail.com';
const FROM_EMAIL = 'StevSant Analytics <onboarding@resend.dev>';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

interface WebhookPayload {
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  table: string;
  record: Record<string, unknown>;
  old_record?: Record<string, unknown>;
}

interface EmailContent {
  subject: string;
  html: string;
}

interface PageView {
  page_path: string;
  duration_seconds: number;
}

// ── Helpers ──────────────────────────────────────────────

function formatDuration(totalSeconds: number): string {
  if (totalSeconds < 60) return '< 1 min';
  const min = Math.floor(totalSeconds / 60);
  const sec = totalSeconds % 60;
  return sec > 0 ? `${min} min ${sec} sec` : `${min} min`;
}

function formatTime(isoDate: string): string {
  try {
    return new Date(isoDate).toLocaleString('es-EC', {
      timeZone: 'America/Guayaquil',
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  } catch {
    return isoDate;
  }
}

function row(label: string, value: string): string {
  return `
    <tr>
      <td style="padding: 10px 16px; color: #999999; font-size: 13px; white-space: nowrap; vertical-align: top;">${label}</td>
      <td style="padding: 10px 16px; color: #ffffff; font-size: 13px;">${value}</td>
    </tr>`;
}

function divider(): string {
  return `
    <tr>
      <td colspan="2" style="padding: 0;">
        <div style="height: 1px; background-color: #252525;"></div>
      </td>
    </tr>`;
}

function emailShell(headerIcon: string, headerLabel: string, bodyRows: string): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="color-scheme" content="dark"><meta name="supported-color-schemes" content="dark"></head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="max-width: 520px; margin: 0 auto; padding: 32px 16px;">

    <!-- Header -->
    <div style="background-color: #181818; border-radius: 12px 12px 0 0; padding: 20px 24px; border: 1px solid #252525; border-bottom: none;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%"><tr>
        <td style="color: #ffffff; font-size: 16px; font-weight: 600; letter-spacing: 0.5px;">StevSant</td>
        <td style="text-align: right; color: #999999; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">
          ${headerIcon} ${headerLabel}
        </td>
      </tr></table>
    </div>

    <!-- Body -->
    <div style="background-color: #181818; border-left: 1px solid #252525; border-right: 1px solid #252525; padding: 4px 0;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%">
        ${bodyRows}
      </table>
    </div>

    <!-- Footer -->
    <div style="background-color: #181818; border-radius: 0 0 12px 12px; padding: 16px 24px; border: 1px solid #252525; border-top: 1px solid #252525;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%"><tr>
        <td style="color: #999999; font-size: 11px;">StevSant Analytics</td>
        <td style="text-align: right;">
          <a href="https://stevsant.vercel.app" style="color: #ffffff; font-size: 11px; text-decoration: none;">Dashboard &rarr;</a>
        </td>
      </tr></table>
    </div>

  </div>
</body>
</html>`;
}

// ── Email builders ───────────────────────────────────────

function buildRecruiterEmail(
  record: Record<string, unknown>,
  pageViews: PageView[],
): EmailContent {
  const source = (record.referrer_source as string) || 'Direct';
  const country = (record.country as string) || 'Unknown';
  const city = (record.city as string) || '';
  const device = (record.device_type as string) || 'unknown';
  const browser = (record.browser as string) || 'unknown';
  const os = (record.os as string) || 'unknown';
  const browserLang = (record.browser_language as string) || 'unknown';
  const totalPages = (record.total_page_views as number) || 0;
  const startedAt = (record.started_at as string) || '';

  const location = city ? `${city}, ${country}` : country;

  const totalDuration = pageViews.reduce((sum, pv) => sum + (pv.duration_seconds || 0), 0);
  const uniquePages = [...new Set(pageViews.map((pv) => pv.page_path))];
  const pagesHtml =
    uniquePages.length > 0
      ? uniquePages.map((p) => `<span style="display:inline-block;background:#252525;border-radius:4px;padding:2px 8px;margin:2px 4px 2px 0;font-size:12px;color:#e0e0e0;">${p}</span>`).join('')
      : '<span style="color:#999999;">No data</span>';

  const rows = [
    row('Source', source),
    divider(),
    row('Location', location),
    divider(),
    row('Device', device),
    divider(),
    row('Browser / OS', `${browser} &middot; ${os}`),
    divider(),
    row('Language', browserLang),
    divider(),
    row('Pages viewed', String(totalPages)),
    divider(),
    row('Pages visited', pagesHtml),
    divider(),
    row('Session duration', formatDuration(totalDuration)),
    divider(),
    row('Time', startedAt ? formatTime(startedAt) : 'Unknown'),
  ].join('');

  return {
    subject: `New potential recruiter from ${source}`,
    html: emailShell('&#128270;', 'Recruiter Alert', rows),
  };
}

function buildCvDownloadEmail(record: Record<string, unknown>): EmailContent {
  const fileName = (record.file_name as string) || 'CV';
  const language = (record.language as string) || 'unknown';
  const downloadedAt = (record.created_at as string) || '';

  const rows = [
    row('File', fileName),
    divider(),
    row('Language', language),
    divider(),
    row('Time', downloadedAt ? formatTime(downloadedAt) : 'Unknown'),
  ].join('');

  return {
    subject: `Someone downloaded your CV: ${fileName}`,
    html: emailShell('&#128196;', 'CV Download', rows),
  };
}

// ── Fetch page views ─────────────────────────────────────

async function fetchPageViews(sessionId: string): Promise<PageView[]> {
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { data, error } = await supabase
      .from('page_view')
      .select('page_path, duration_seconds')
      .eq('session_id', sessionId);
    if (error) throw error;
    return (data as PageView[]) || [];
  } catch {
    return [];
  }
}

// ── Main handler ─────────────────────────────────────────

Deno.serve(async (req: Request) => {
  try {
    const payload: WebhookPayload = await req.json();

    let email: EmailContent | null = null;

    if (payload.table === 'visitor_session' && payload.type === 'UPDATE') {
      const isNowRecruiter = payload.record.is_potential_recruiter === true;
      const wasRecruiter = payload.old_record?.is_potential_recruiter === true;
      if (isNowRecruiter && !wasRecruiter) {
        const pageViews = await fetchPageViews(payload.record.id as string);
        email = buildRecruiterEmail(payload.record, pageViews);
      }
    }

    if (payload.table === 'cv_download' && payload.type === 'INSERT') {
      email = buildCvDownloadEmail(payload.record);
    }

    if (!email) {
      return new Response(JSON.stringify({ skipped: true }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [ALERT_EMAIL],
        subject: email.subject,
        html: email.html,
      }),
    });

    const data = await res.json();

    return new Response(JSON.stringify({ sent: true, data }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
```

- [ ] **Step 2: Review the code for correctness**

Check:
- `createClient` import path is correct for Deno: `jsr:@supabase/supabase-js@2`
- `emailShell()` produces valid HTML email (table-based layout, inline styles)
- `fetchPageViews()` returns `[]` on error (graceful degradation)
- `formatDuration()` handles edge cases (0 seconds = "< 1 min")
- `formatTime()` catches locale errors and falls back to raw ISO string
- HTML entity codes work in email: `&#128270;` (magnifying glass), `&#128196;` (document), `&rarr;` (right arrow), `&middot;` (middle dot)

- [ ] **Step 3: Commit**

```bash
git add supabase/edge-functions/send-analytics-alert/index.ts
git commit -m "feat(email): redesign alert templates with Dark Elegant theme and enrich recruiter data"
```

---

### Task 5: Build verification and final commit

- [ ] **Step 1: Run the full Angular build**

Run: `cd frontend && npx ng build --configuration production`
Expected: Build succeeds with zero errors.

- [ ] **Step 2: Run tests**

Run: `cd frontend && npm test`
Expected: All existing tests pass. No regressions.

- [ ] **Step 3: Manual verification checklist**

Verify these items are correct:
- [ ] `download-file.util.ts` exists at `frontend/src/app/shared/utils/`
- [ ] Both navbar and mobile-menu use `<button>` (not `<a download>`) for CV download
- [ ] Both components import and use `downloadFile` from the shared utility
- [ ] Both components have a `downloading` signal to prevent double-clicks
- [ ] The old `onCvDownload()` method has been removed from both components
- [ ] Edge function imports `createClient` from `jsr:@supabase/supabase-js@2`
- [ ] Edge function uses `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` env vars (auto-injected)
- [ ] `fetchPageViews()` returns `[]` on error (graceful degradation)
- [ ] Email HTML uses inline styles only (no CSS classes — email clients strip them)
- [ ] Email uses table-based layout (not flexbox/grid — email client compatibility)

- [ ] **Step 4: Final cleanup commit if needed**

Only if lint/format issues were found during verification.
