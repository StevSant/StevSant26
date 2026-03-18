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
