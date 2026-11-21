ATSNexa Amazon Creators API — live catalog + affiliate fallback

FILES TO COMMIT to your existing GitHub main branch:
1. app/api/amazon/products/route.js (NEW)
2. app/products/AmazonShop.jsx (REPLACE)
3. app/products/page.jsx (REPLACE or ADD if missing)

Your existing Hostinger environment variables:
AMAZON_CREATORS_CREDENTIAL_ID = CSV Credential Id
AMAZON_CREATORS_SECRET = CSV Secret
AMAZON_ASSOCIATE_TAG = engr11112019-20
AMAZON_MARKETPLACE = www.amazon.com
AMAZON_CREATORS_APPLICATION_ID = CSV Application Id (retained, not needed for token exchange)

After committing, let Hostinger redeploy. Visit https://atsnexa.com/products.
To diagnose: open https://atsnexa.com/api/amazon/products?category=office
- mode=live means real product listings returned.
- mode=fallback means no live catalog access yet, and affiliate search links remain available.
The public endpoint intentionally does not expose credentials or raw Amazon errors.
Do not upload CSV or keys to GitHub.

The API calls use Amazon Creators API v3.1 OAuth and SearchItems, not the deprecated PA-API 5 signing method. It caches tokens and product responses in the running server process. In multi-instance deployments each instance may maintain its own cache. The site makes no claim that Amazon access is approved until a real request succeeds.

If Amazon reports a SearchItems validation issue, review the API documentation for your locale and current supported resource list.
