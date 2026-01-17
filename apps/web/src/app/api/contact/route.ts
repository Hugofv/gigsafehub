import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Get API key from environment variable
const resendApiKey = process.env.RESEND_API_KEY;

// Initialize Resend only if API key is available
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function POST(request: NextRequest) {
  try {
    // Check if Resend API key is configured
    if (!resend || !resendApiKey) {
      console.error('RESEND_API_KEY is not configured');
      return NextResponse.json(
        { error: 'Email service is not configured. Please contact the administrator.' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'GigSafeHub <contato@gigsafehub.com>',
      to: 'contato@gigsafehub.com',
      replyTo: email,
      subject: `[Contact Form] ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #1e293b; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>

          <div style="margin-top: 20px;">
            <p style="margin: 10px 0;"><strong>Name:</strong> ${escapeHtml(name)}</p>
            <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
            <p style="margin: 10px 0;"><strong>Subject:</strong> ${escapeHtml(subject)}</p>
          </div>

          <div style="margin-top: 20px; padding: 15px; background-color: #f1f5f9; border-radius: 5px;">
            <h3 style="color: #1e293b; margin-top: 0;">Message:</h3>
            <p style="color: #334155; white-space: pre-wrap;">${escapeHtml(message)}</p>
          </div>

          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 12px;">
            <p>This email was sent from the GigSafeHub contact form.</p>
            <p>You can reply directly to this email to respond to ${escapeHtml(name)}.</p>
          </div>
        </div>
      `,
      text: `
New Contact Form Submission

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

---
This email was sent from the GigSafeHub contact form.
You can reply directly to this email to respond to ${name}.
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send email. Please try again later.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, messageId: data?.id },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'An error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}

// Helper function to escape HTML to prevent XSS
function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
