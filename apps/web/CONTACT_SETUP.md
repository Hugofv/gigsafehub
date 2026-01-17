# Contact Form Setup

This document explains how to set up the contact form to send emails.

## Prerequisites

1. Create a Resend account at https://resend.com
2. Get your API key from the Resend dashboard

## Environment Variables

Add the following environment variable to your `.env.local` file (for development) or your production environment:

```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
```

## Domain Setup (Production)

For production, you'll need to:

1. **Add your domain to Resend:**
   - Go to Resend Dashboard → Domains
   - Add your domain (e.g., `gigsafehub.com`)
   - Add the DNS records provided by Resend to your domain's DNS settings

2. **Update the sender email:**
   - In `apps/web/src/app/api/contact/route.ts`, update the `from` field:
   ```typescript
   from: 'GigSafeHub <noreply@gigsafehub.com>',
   ```

3. **Verify your domain:**
   - Wait for DNS propagation (can take up to 48 hours)
   - Resend will verify your domain automatically

## Testing

1. **Development:**
   - Resend provides a test mode that works without domain verification
   - Emails will be sent but may go to spam
   - Use the test API key for development

2. **Production:**
   - Use your verified domain
   - Ensure `RESEND_API_KEY` is set in your production environment

## Email Configuration

The contact form sends emails to: `contato@gigsafehub.com`

To change the recipient email, update the `to` field in:
`apps/web/src/app/api/contact/route.ts`

```typescript
to: 'contato@gigsafehub.com',
```

## Rate Limiting

Resend has rate limits based on your plan:
- Free tier: 100 emails/day, 3,000 emails/month
- Pro tier: Higher limits

Consider adding rate limiting to the API route if needed.

## Troubleshooting

1. **Emails not sending:**
   - Check that `RESEND_API_KEY` is set correctly
   - Verify the API key is active in Resend dashboard
   - Check Resend dashboard for error logs

2. **Emails going to spam:**
   - Verify your domain in Resend
   - Set up SPF, DKIM, and DMARC records
   - Use a verified sender email address

3. **API errors:**
   - Check browser console for errors
   - Check server logs for detailed error messages
   - Verify all required fields are being sent
