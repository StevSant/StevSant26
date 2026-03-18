# Email Redesign & CV Download Fix — Design Spec

**Date:** 2026-03-17
**Status:** Approved

---

## Problem Statement

1. **Email notifications are visually plain** — minimal styling, no branding, no alignment with the portfolio's Dark Elegant theme.
2. **CV download button doesn't work** — the HTML `download` attribute is ignored for cross-origin URLs (Supabase storage), so clicking "download" just navigates to the PDF page.
3. **Recruiter email lacks useful data** — only shows source, country, device, and page count. Missing browser/OS, pages visited, session duration, and visit time.

---

## Scope

### In scope
- Redesign both email templates (recruiter alert, CV download) to match Dark Elegant theme
- Fix cross-origin CV download on frontend (navbar + mobile menu)
- Enrich recruiter email with additional session data via edge function DB query

### Out of scope
- Changes to SQL triggers
- Changes to frontend analytics tracking
- Changes to CV download email data content
- Multi-theme email support

---

## Design

### 1. CV Download Fix (Frontend)

**Problem:** `<a href="cross-origin-url" download>` is ignored by browsers for cross-origin resources.

**Solution:** Replace `<a download>` with a `<button>` that programmatically fetches and downloads:

1. `fetch(cv.url)` to get the PDF as a blob
2. `URL.createObjectURL(blob)` to create a local object URL
3. Create a temporary `<a>` element with `download` attribute, click it programmatically
4. Revoke the object URL after download

**Error handling:**
- Wrap fetch in try/catch. On failure, fall back to `window.open(cv.url, '_blank')` so the user still gets the PDF.
- Add a `downloading` signal to disable the button and prevent double-clicks during fetch.

**Revocation timing:** Use `setTimeout(() => URL.revokeObjectURL(url), 2000)` to ensure the browser has started the download before revoking.

**CORS prerequisite:** Supabase public bucket URLs include permissive CORS headers by default. Verify during implementation that `fetch()` succeeds from `stevsant.vercel.app`.

**Shared logic:** Extract the fetch+blob download logic into a utility function in `@shared/utils/` to avoid duplicating it across navbar and mobile menu components.

**Files changed:**
- `frontend/src/app/shared/utils/download-file.util.ts` — new utility with `downloadFile(url, fileName)` function
- `frontend/src/app/features/portfolio/portfolio-layout/portfolio-navbar/portfolio-navbar.component.ts` — add `downloadCv(cv)` method using shared util
- `frontend/src/app/features/portfolio/portfolio-layout/portfolio-navbar/portfolio-navbar.component.html` — change download `<a>` to `<button>`
- Same changes in `portfolio-mobile-menu` component (`.ts` and `.html`)

### 2. Email Template Redesign — Dark Elegant Theme

Both emails share the same visual shell:

```
┌─────────────────────────────────────┐
│  Dark background (#0a0a0a)          │
│                                     │
│  ┌─────────────────────────────┐    │
│  │  Header bar (#181818)       │    │
│  │  "StevSant" + alert icon    │    │
│  │  + email type label         │    │
│  └─────────────────────────────┘    │
│                                     │
│  ┌─────────────────────────────┐    │
│  │  Content card (#181818)     │    │
│  │  border: 1px #252525        │    │
│  │  border-radius: 8px         │    │
│  │                             │    │
│  │  Data rows with labels in   │    │
│  │  muted gray (#999) and      │    │
│  │  values in white (#fff)     │    │
│  │                             │    │
│  │  Dividers: #252525          │    │
│  └─────────────────────────────┘    │
│                                     │
│  Footer: muted text (#999)         │
│  "StevSant Analytics" + dashboard  │
│  link in white                      │
│                                     │
│  Font: -apple-system, Segoe UI     │
└─────────────────────────────────────┘
```

**Design tokens (from Dark Elegant theme):**
- Background primary: `#0a0a0a`
- Background secondary: `#181818`
- Background tertiary: `#252525`
- Text primary: `#ffffff`
- Text secondary: `#e0e0e0`
- Text muted: `#999999`
- Success: `#22c55e`
- Border: `#252525`
- Border radius: `8px` (cards), `12px` (outer)

**Recruiter email data rows:**
- Source (referrer)
- Country & City
- Device type
- Browser & OS
- Browser language
- Pages viewed (count)
- Pages visited (list of distinct paths)
- Session duration (sum of page_view durations, formatted as "X min Y sec")
- Time of visit (started_at in America/Guayaquil timezone)

**CV Download email data rows** (same content, new styling):
- File name
- Language
- Time of download

### 3. Edge Function Changes

**Data enrichment for recruiter emails:**

When the trigger fires for a recruiter detection, the edge function will:

1. Receive the `visitor_session` record (unchanged)
2. Query `page_view` table using Supabase client with service role key: `SELECT page_path, duration_seconds FROM page_view WHERE session_id = record.id`
3. Aggregate: deduplicated list of `page_path` values, sum of `duration_seconds`
4. Pass enriched data to `buildRecruiterEmail(record, pageViews)`

**Updated function signature:**
```typescript
function buildRecruiterEmail(
  record: Record<string, unknown>,
  pageViews: { page_path: string; duration_seconds: number }[]
): EmailContent
```

**Session duration format:** "X min Y sec" or "< 1 min" if under 60 seconds.

**No new environment variables needed** — `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are available by default in Supabase edge functions.

**Graceful degradation:** If the `page_view` query fails, the recruiter email should still be sent with whatever data is available from the trigger payload (session-level data only, no page details). This avoids losing alerts due to a secondary query failure.

**No changes to:**
- SQL triggers
- Frontend tracking code
- CV download email data flow

---

## Files Summary

| File | Change |
|------|--------|
| `supabase/edge-functions/send-analytics-alert/index.ts` | Redesign both email templates, add Supabase client for page_view query, enrich recruiter data |
| `frontend/.../portfolio-navbar/portfolio-navbar.component.ts` | Add `downloadCv()` method with blob fetch |
| `frontend/.../portfolio-navbar/portfolio-navbar.component.html` | Change download `<a>` to `<button>` |
| `frontend/.../portfolio-mobile-menu/portfolio-mobile-menu.component.ts` | Add `downloadCv()` method with blob fetch |
| `frontend/.../portfolio-mobile-menu/portfolio-mobile-menu.component.html` | Change download `<a>` to `<button>` |
| `frontend/src/app/shared/utils/download-file.util.ts` | New utility: `downloadFile(url, fileName)` with fetch+blob logic |
