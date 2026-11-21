ATSNexa AI Career Studio reliability patch

1. Open Supabase SQL Editor and run supabase-ai-quota.sql once. It creates atomic reservation and refund functions and adds a constraint. It preserves existing ai_usage and subscriptions rows.
2. Copy lib/ai.js, app/api/ai/route.js, and components/AITools.jsx into the same paths of your existing ATSNexa GitHub project.
3. Commit and push to main, then wait for Hostinger deployment.
4. No new environment variables or npm dependencies required.
5. Test one successful generation, then test a deliberately invalid OpenAI key only in a controlled staging environment (never change production secrets to test). Check ai_usage counts.
6. PDF download uses the browser Print > Save as PDF. DOCX download uses a Word-compatible .doc file, not a genuine .docx; open in Word and Save As DOCX if needed.

IMPORTANT: The daily quota is reserved before contacting OpenAI and refunded when the request fails. It counts a successful generation even if the browser disconnects after the provider completes. Reservation/refund is atomic; billing usage is not a precise accounting ledger. Avoid deploying without the SQL migration.
