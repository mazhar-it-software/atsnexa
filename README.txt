ATSNexa Account Sign-In Fix

1. Replace components/Account.jsx with the supplied file.
2. In GitHub Desktop, Commit to main and Push origin.
3. Wait for a successful Hostinger deployment.
4. Visit https://atsnexa.com/account and try signup or sign-in.
5. The page now shows errors, loading indicators, and validation messages.

Important: Hostinger must have NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY at build time. Confirm Supabase Authentication > Providers > Email is enabled and Authentication > URL Configuration contains https://atsnexa.com as Site URL, with https://atsnexa.com/** as an allowed redirect URL if needed.
Never commit private keys.
