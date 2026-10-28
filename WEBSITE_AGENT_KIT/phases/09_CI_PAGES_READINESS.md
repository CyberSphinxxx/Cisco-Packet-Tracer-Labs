# Phase 09 — Cross-platform CI and Pages deployment readiness

**Outcome:** Build reproducible in CI and ready for future owner-approved Cloudflare Pages deployment.

Tasks: preserve existing Python workflow/job; add Node checkout/ci/typecheck/tests/build/Pagefind+browser smoke workflow on PRs. Keep least-privilege tokens and cache appropriately. Test Linux checkout path resolution; Windows local support via documented commands. Document Pages root config and site/dist, environment versions, staging/production SEO. Smoke clean checkout without GitHub API at build time. Do not create Cloudflare project, deploy or buy domain. Ensure `.gitignore` excludes `node_modules`, generated `.astro`, site/dist, Playwright outputs without ignoring real `.pkt` assets.

**Gate:** existing Python and new website CI jobs pass, release output correct, deployment instructions reproducible, no remote deploy.
