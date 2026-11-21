ATSNexa PostCSS security patch

1. Copy package.json into the root of your existing ATSNexa GitHub repository, replacing the existing package.json. Do NOT delete other project files.
2. In a terminal at the repository root run:
   npm install
3. This regenerates package-lock.json if npm uses it. Commit BOTH package.json and package-lock.json (if present) to GitHub. If a different lockfile is used, update that lockfile with its package manager instead.
4. Run:
   npm ls postcss
   npm audit
   npm run build
5. GitHub Desktop: Commit to main, Push origin. Redeploy from Hostinger if necessary.
6. Re-scan vulnerabilities in Hostinger after the new deployment.

The npm overrides entry pins indirect PostCSS dependencies to 8.5.33. This package.json preserves the current package.json fetched from GitHub except for the new overrides block. It does not patch other vulnerabilities or automatically change deployed code.
