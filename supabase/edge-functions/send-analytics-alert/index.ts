import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!;
const ALERT_EMAIL = Deno.env.get('ALERT_EMAIL') || 'bryanmenoscal2005@gmail.com';
const FROM_EMAIL = 'StevSant Analytics <onboarding@resend.dev>';

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

function buildRecruiterEmail(record: Record<string, unknown>): EmailContent {
  const source = (record.referrer_source as string) || 'Direct';
  const country = (record.country as string) || 'Unknown';
  const device = (record.device_type as string) || 'unknown';
  const pages = (record.total_page_views as number) || 0;

  return {
    subject: `New potential recruiter from ${source}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 500px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #1e40af; margin: 0 0 16px;">Potential Recruiter Detected</h2>
        <div style="background: #eff6ff; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
          <p style="margin: 4px 0;"><strong>Source:</strong> ${source}</p>
          <p style="margin: 4px 0;"><strong>Country:</strong> ${country}</p>
          <p style="margin: 4px 0;"><strong>Device:</strong> ${device}</p>
          <p style="margin: 4px 0;"><strong>Pages viewed:</strong> ${pages}</p>
        </div>
        <p style="color: #6b7280; font-size: 13px;">
          Visit your <a href="https://stevsant.vercel.app" style="color: #2563eb;">dashboard</a> for details.
        </p>
      </div>
    `,
  };
}

function buildCvDownloadEmail(record: Record<string, unknown>): EmailContent {
  const fileName = (record.file_name as string) || 'CV';
  const language = (record.language as string) || 'unknown';
  const downloadedAt = new Date(record.created_at as string).toLocaleString('es-EC', {
    timeZone: 'America/Guayaquil',
  });

  return {
    subject: `Someone downloaded your CV: ${fileName}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 500px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #059669; margin: 0 0 16px;">CV Downloaded</h2>
        <div style="background: #ecfdf5; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
          <p style="margin: 4px 0;"><strong>File:</strong> ${fileName}</p>
          <p style="margin: 4px 0;"><strong>Language:</strong> ${language}</p>
          <p style="margin: 4px 0;"><strong>Time:</strong> ${downloadedAt}</p>
        </div>
        <p style="color: #6b7280; font-size: 13px;">
          Visit your <a href="https://stevsant.vercel.app" style="color: #2563eb;">dashboard</a> for details.
        </p>
      </div>
    `,
  };
}

Deno.serve(async (req: Request) => {
  try {
    const payload: WebhookPayload = await req.json();

    let email: EmailContent | null = null;

    if (payload.table === 'visitor_session' && payload.type === 'UPDATE') {
      const isNowRecruiter = payload.record.is_potential_recruiter === true;
      const wasRecruiter = payload.old_record?.is_potential_recruiter === true;
      if (isNowRecruiter && !wasRecruiter) {
        email = buildRecruiterEmail(payload.record);
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
