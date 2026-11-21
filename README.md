ATSNexa UI refresh — GitHub Desktop installation

Copy the folders/files into the ROOT of your existing ATSNexa project, preserving paths. Do not delete the project or overwrite other files.

REPLACE:
components/Nav.jsx
components/AITools.jsx
app/ai-tools/page.jsx
app/ats-resume-checker/page.jsx
app/pricing/page.jsx
app/account/page.jsx
app/products/page.jsx

NEW FILE:
app/atsnexa-ui.css

EDIT (do not replace) app/layout.jsx:
Add the following import next to the existing globals.css import:
import './atsnexa-ui.css';

IMPORTANT: Keep the existing components/Checker.jsx, components/Account.jsx, components/Subscribe.jsx, API routes, environment variables, and existing app/globals.css. This package preserves existing AI endpoint tasks and does not activate PayPal by itself.

Commit and Push origin in GitHub Desktop. Check Hostinger latest deployment, and manually deploy only if automatic deployment does not start. Hard-refresh browser with Ctrl+Shift+R.

Amazon: this update adds Career Shop to navigation and improves the products landing page. It does not change Amazon API eligibility. If /api/amazon/products returns mode:fallback, live Amazon products/images/prices are not available yet; the existing AmazonShop.jsx fallback will still link to tagged Amazon search results.
