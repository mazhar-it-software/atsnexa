ATSNexa AI Studio + ATS Checker premium visual refresh and sitemap update

COPY:
1. app/career-studio-premium.css -> project/app/career-studio-premium.css (NEW)
2. app/sitemap.js -> project/app/sitemap.js (REPLACE)

EDIT EXISTING FILES (do not replace the rest of the page):
3. app/layout.jsx: add this import next to the existing globals.css import:
   import './career-studio-premium.css';
4. app/ai-tools/page.jsx: find <main className="nex-page"> and change it to:
   <main className="nex-page nex-premium">
5. app/ats-resume-checker/page.jsx: make the same change:
   <main className="nex-page nex-premium">

IMPORTANT: Keep your existing app/atsnexa-ui.css import if already installed. The new stylesheet must be imported AFTER atsnexa-ui.css so premium styles take precedence. Do not remove any previous stylesheets or overwrite the whole layout.jsx.

The two components' actual functionality remains unchanged. No edits to AI API, ATS analyzer, Amazon, auth, Resend, or secrets.

SITEMAP: /products added. /account intentionally excluded because it is a login/account page rather than a public SEO landing page. The static lastModified date is removed to avoid a misleading timestamp. Next.js will generate /sitemap.xml automatically.

GitHub Desktop: Commit to main -> Push origin -> check Hostinger deployment. Test /ai-tools, /ats-resume-checker and /sitemap.xml.
