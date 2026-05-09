// src/app/api/contact/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { contactFormSchema } from '@/lib/validators/contact';

// POST /api/contact — Submit a contact form
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // ── Server-side validation ──
    const parsed = contactFormSchema.safeParse(body);
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      const firstError = Object.values(fieldErrors).flat()[0] || 'Invalid input';
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { fullName, email, subject, message } = parsed.data;

    // ── Save to database ──
    const supabase = await createClient();

    const { data: submission, error: insertError } = await supabase
      .from('contact_submissions')
      .insert({
        full_name: fullName,
        email,
        subject,
        message,
        status: 'new',
      })
      .select('id, created_at')
      .single();

    if (insertError) {
      console.error('Contact submission insert failed:', insertError);
      return NextResponse.json(
        { error: 'Failed to save your message. Please try again later.' },
        { status: 500 }
      );
    }

    // ── Send email notification via Resend ──
    try {
      const RESEND_API_KEY = process.env.RESEND_API_KEY;
      const NOTIFY_EMAIL = process.env.CONTACT_NOTIFY_EMAIL || 'support@bazaar.af';

      if (RESEND_API_KEY) {
        const emailRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Bazaar Contact <noreply@bazaar.af>',
            to: [NOTIFY_EMAIL],
            subject: `[Contact Form] ${subject}`,
            html: `
              <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f9fafb; border-radius: 12px;">
                <div style="background: linear-gradient(135deg, #c00000, #ff7c00); padding: 20px 24px; border-radius: 12px 12px 0 0;">
                  <h1 style="color: white; margin: 0; font-size: 20px;">New Contact Form Submission</h1>
                </div>
                <div style="background: white; padding: 24px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb;">
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 8px 0; font-weight: 600; color: #374151; width: 120px;">Full Name</td>
                      <td style="padding: 8px 0; color: #6b7280;">${escapeHtml(fullName)}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; font-weight: 600; color: #374151;">Email</td>
                      <td style="padding: 8px 0;"><a href="mailto:${escapeHtml(email)}" style="color: #c00000;">${escapeHtml(email)}</a></td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; font-weight: 600; color: #374151;">Subject</td>
                      <td style="padding: 8px 0; color: #6b7280;">${escapeHtml(subject)}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; font-weight: 600; color: #374151; vertical-align: top;">Message</td>
                      <td style="padding: 8px 0; color: #6b7280; white-space: pre-wrap;">${escapeHtml(message)}</td>
                    </tr>
                  </table>
                  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;" />
                  <p style="font-size: 12px; color: #9ca3af; margin: 0;">
                    Submission ID: ${submission.id}<br />
                    Received: ${new Date(submission.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            `,
          }),
        });

        if (!emailRes.ok) {
          const emailErr = await emailRes.text();
          console.error('Resend email failed:', emailErr);
          // Don't fail the request — the DB save succeeded
        }
      } else {
        console.warn('RESEND_API_KEY not set — skipping email notification');
      }
    } catch (emailError) {
      console.error('Email notification error:', emailError);
      // Don't fail the request — the DB save succeeded
    }

    return NextResponse.json(
      {
        message: 'Your message has been sent successfully!',
        submission: { id: submission.id, createdAt: submission.created_at },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('POST /api/contact error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/** Minimal HTML-escape to prevent injection in email templates */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/'/g, '&#039;');
}
