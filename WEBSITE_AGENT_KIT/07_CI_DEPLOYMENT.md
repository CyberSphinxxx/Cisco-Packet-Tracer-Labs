# 07 — CI, Cloudflare Pages and release operations

## Repository CI

Current `.github/workflows/validate.yml` runs Python static validation and unit tests. Preserve it, with a separately named job or workflow to run site build after Python checks. Pin actions to trusted versions/SHAs as appropriate; use least-privilege permissions `contents: read`; cache only necessary dependencies. CI should not contact Cisco/NetAcad or attempt Packet Tracer simulation.

Proposed site commands (implement in `site/package.json`):

- `npm ci` (lockfile required)
- `npm run check` (Astro/TypeScript)
- `npm run test` (unit/content integration)
- `npm run build` (Astro, then Pagefind)
- `npm run test:e2e` (built static site browser verification, on CI when feasible)

Use a supported Node LTS matching chosen Astro version. Validate on Windows locally and ubuntu-latest CI. No `npm install` that rewrites lockfile during CI.

## Cloudflare Pages monorepo

Site lives in `site/`; checked-out `labs/`, `projects/`, `learning-paths/`, `docs/` are essential at build time. Recommended initial configuration to evaluate:

- GitHub repository: **existing** `CyberSphinxxx/Cisco-Packet-Tracer-Labs`.
- Project root: repository root (or `site/` if full checkout and outside-root reads are proved on Pages).
- Build command from repository root: `cd site && npm ci && npm run build`.
- Build output directory relative to repo root: `site/dist`.
- Node version: set per verified toolchain, not guessed.

Cloudflare Pages can build monorepos, but configuration must be tested using a full checkout; a site-only upload without root content will break ingestion. Do not create Pages projects, attach custom domains, edit DNS, add analytics or deploy in this project phase without owner approval. Document Preview vs Production branch (`main` is eventual production); branch preview must not include private content.

## Release steps (NOT authorized by starting prompt)

1. Local quality gates all green; integrity snapshot proves no `.pkt` mutation.
2. Release report and file manifest reviewed by owner.
3. With explicit later approval: push only feature branch, create PR, verify CI and preview, merge after review, configure Cloudflare and domain.
4. Post-release monitor broken links and real downloads. No guaranteed uptime or indexing claims.

## Operational costs

Use static/free tier where available; do not assume free hosting quotas, unlimited bandwidth, or AdSense eligibility. Pricing/limits can change; verify current docs before owner chooses deployment.
