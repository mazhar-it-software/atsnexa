# ATSNexa V3 - FULL PAGE REPLACEMENT

This package deliberately replaces the actual page components, rather than adding another optional stylesheet that may never load.

## Installation (GitHub Desktop)
1. Extract this ZIP.
2. Copy all files into the ROOT of your EXISTING ATSNexa repository, preserving the paths shown. Overwrite only files with the same paths. Do NOT delete other project files.
3. IMPORTANT: app/layout.jsx imports three CSS files: globals.css (already in your repository), atsnexa-ui.css (already in your repository), and the NEW atsnexa-v3.css (provided here). Confirm both existing files still exist. If you do not have app/atsnexa-ui.css, remove that one import line.
4. Commit changes to main, Push origin, wait for a successful Hostinger deployment. Confirm the latest deployed commit SHA matches your GitHub push.
5. Hard-refresh with Ctrl+Shift+R, or test an incognito window.
6. Check /, /ai-tools, /ats-resume-checker, /pricing, /sitemap.xml.

## What changed
- Replaced home, AI Tools, ATS Checker, and Pricing pages with new dark navy hero and clean dashboard layouts.
- New CSS is imported explicitly from app/layout.jsx so it is actually loaded.
- Existing components/AITools.jsx, components/Checker.jsx and components/Subscribe.jsx remain unchanged: functionality, API calls, and account integration preserved.
- Sitemap includes 12 public URLs. /account is intentionally excluded as a sign-in page; /products is included.
- No Amazon API credentials, Resend variables or PayPal secrets are included.

## Sitemap
12 is correct for the currently identified public indexable routes: /, /ats-resume-checker, /resume-builder, /resume-templates, /ai-tools, /pricing, /products, /guides, /about, /contact, /privacy, /terms. Dynamic guide article pages, if any, need separate sitemap handling.

## Troubleshooting unchanged design
- GitHub Desktop must show changed files, including app/page.jsx and app/layout.jsx.
- Push origin (commit alone is not enough).
- Check Hostinger deployment is from the newest commit.
- Check the page HTML has class="v3" on main; if not, old deployment is being served.
- Check browser DevTools Network for atsnexa-v3 CSS bundled into a Next.js CSS chunk; a CSS 404 or missing import indicates a deployment issue.
