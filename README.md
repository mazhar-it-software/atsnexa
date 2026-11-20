# ATSNexa v0.2 — AI-powered SaaS integration build

This is an **integration-ready codebase**, not a live or fully configured production service. The AI API, Supabase and PayPal require your own account credentials, payment plan and successful end-to-end testing.

## Hostinger deployment
1. Push all files to a private GitHub repository, connect it in Hostinger Business → Web App → Import Git repository.
2. Set Node.js 20+, build `npm run build`, start `npm start`, and use the environment variables in `.env.example` in Hostinger's secrets/settings (never commit real secrets).
3. Create a Supabase project; execute `supabase/schema.sql` in its SQL editor; configure email confirmation and allowed redirect URLs for `https://atsnexa.com`.
4. Create an OpenAI API key, enable billing, and configure model access. AI API is server-side only.
5. In PayPal Developer, create REST app and recurring subscription product/plan; use Sandbox first. Set `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `PAYPAL_PLAN_ID`, `PAYPAL_ENV=sandbox`, and create webhook pointing to `https://atsnexa.com/api/paypal/webhook` for BILLING.SUBSCRIPTION.* events; set `PAYPAL_WEBHOOK_ID`. Verify sandbox purchases, cancellations and webhook signature before switching to live credentials. PayPal business eligibility may be required.
6. Verify HTTPS, DNS, email confirmation, account registration, AI daily limits, all public pages, `robots.txt`, `sitemap.xml`, browser PDF export, PayPal checkout and webhook lifecycle.
7. Submit sitemap in Search Console; request AdSense review. AdSense publisher script is installed globally, but ad units and approval are not included. Avoid ads in private workspaces and pages without substantial content.

## Important security and functionality caveats
- Resume builder currently saves in browser localStorage; authenticated cloud resume storage table is prepared but **not yet wired into the editor**.
- AI routes require a Supabase login; two free requests or 30 requests/day for verified active subscribers. Usage increments before provider call and should be made atomic for high-volume production traffic; currently susceptible to concurrent requests.
- PayPal webhook verifies PayPal signature and fetches subscription status. Webhook must be configured, monitored and end-to-end tested. PayPal email address alone is not a payment credential.
- There is no production-grade document upload parser or DOCX exporter; browser PDF print is available.
- No email delivery provider, full admin dashboard, actual backlinks, analytics or Google account connections yet.
- Replace legal placeholder content with reviewed policy and contact details; add rate limiting/WAF and monitoring before open public launch.
- The code has not passed a full `npm install` + `npm run build` in this offline environment.

## Local checks
`npm install && npm test && npm run lint && npm run build && npm run dev`


## Contact form delivery (FormSubmit)

The /contact page posts to https://formsubmit.co/support@atsnexa.com. No mailbox password or API key is required in the repository. **First submission:** FormSubmit sends an activation email to support@atsnexa.com. Open Hostinger Webmail and click its verification link. Then submit a second test message and confirm receipt. The service may display CAPTCHA/verification. Submissions pass through a third party; see the Privacy Policy. For higher volume, replace with a server-side mail provider and rate limiting. Do not submit confidential documents.
