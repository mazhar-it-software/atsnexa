# ATSNexa PDF upload hotfix

## Replace one production file
Copy `app/api/extract-resume/route.js` into the identical path in your existing ATSNexa repository. Do not replace any other production files.

## Add test
Copy `tests/upload-and-matcher.test.mjs` to the existing tests directory.

## Deploy
In GitHub Desktop: Commit to main -> Push origin. Verify Hostinger deploys the latest commit. No changes to Hostinger environment variables are needed.

## Verify
1. ATS Checker: upload a text-based PDF under 5 MB, check extracted text, paste job description (30+ characters), click Analyze.
2. AI Studio: upload the same PDF, confirm text appears; generation additionally requires sign-in and configured AI provider.
3. Upload a DOCX and a TXT. Test an image-only PDF: it should give an understandable OCR-related error.
4. Run `npm test` locally to verify the keyword scoring assertions.

## Technical diagnosis
pdf-parse@1.1.1's package entry point executes a fixture test outside NODE_ENV=test. The direct internal parser import avoids that entry point. No dependency upgrades required.

## Limitations
This is a targeted fix, not a verified end-to-end audit of all website features. The keyword alignment score is not a real ATS pass probability. PDFs that are scans/images still require OCR. The server has not been tested against your private deployment here.
