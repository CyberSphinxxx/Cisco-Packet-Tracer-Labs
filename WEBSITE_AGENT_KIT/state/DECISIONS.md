# Architecture decision log

ADR format: `../templates/ADR.md`. Decisions are by the coding agent for local implementation; scope-changing choices need owner approval.

## ADR-000: Work in a Linux clone, deliver by Git bundle (2026-10-28, Accepted)

- **Context:** The session can read/write files in the owner's Windows repo folder but has no shell there, so it cannot run git, npm or Python on the owner machine.
- **Options:** (a) write loose files into the owner's working tree on `main` (no commits, would collide with a later checkout); (b) clone the same public repo into the Linux workspace, verify the owner tree matches it, commit there, deliver a Git bundle; (c) stop and ask the owner to run commands.
- **Decision:** (b). The owner tree was verified identical to `main` (263/263 tracked files; differences are CRLF only). Bundles go to `scratch/` (already git-ignored), never pushed. State files are mirrored into the owner's kit folder for visibility.
- **Consequences:** The owner imports with `git fetch scratch/astro-site.bundle feature/astro-learning-platform:feature/astro-learning-platform`. Windows-native `npm ci/build` is not observed by the agent (BLOCKERS B-001).

## ADR-001: Superseded "no site/" rule (2026-10-28, Accepted)

`AI_AGENT_GUIDE/11_WEBSITE_FUTURE_CONTRACT.md` and `AGENTS.md` forbid building the website without explicit user authorization. The owner gave that authorization in this session (start prompt + chat message: "You are authorized to develop and test the complete Astro website locally on a new feature branch"). Remote operations remain forbidden.

## ADR-002: Toolchain (2026-10-28, Proposed; confirmed in Phase 01 by real install + check)

Astro 7.3.8, Node 22 LTS (>= 22.12.0), TypeScript 6.0.x, Pagefind 1.5.2. Rationale in BASELINE.md section 4. Rejected: Astro 7.4.x (released < 2 weeks ago, Node floor 22.23.4), TypeScript 7 (unsupported by `@astrojs/check`).

## ADR-003: Published docs selection (2026-10-28, Accepted)

All 8 `docs/*.md` are published under `/docs/{slug}/`: they are public in the repo and all 8 appear in README "Quick Navigation". `AI_AGENT_GUIDE/**` is never published; links into it are rewritten to the public GitHub blob URL of the same file.

Further mandatory ADRs (loader, link rewrite, `.pkt` delivery, images, path order, search, CSS, tests/CI, Pages config, licensing) are recorded in the phase where they are proven.

## ADR-004: Custom build-time content module instead of the Content Layer `glob` loader (2026-10-28, Accepted, proven)

- **Context:** Labs need a join of `README.md` + adjacent `metadata.json` (+ `verification.md`, `configs/`, assets) by folder; READMEs have no frontmatter and share the filename `README.md`; link rewriting needs a global route table and heading index (two passes) to validate cross-document fragments.
- **Options:** (a) Astro `glob()` loaders per folder + a second JSON collection joined in pages; (b) a custom Content Layer loader; (c) a framework-independent TypeScript module (`site/src/lib/content/`) called from `getStaticPaths`.
- **Decision:** (c). It runs unchanged under Vitest against fixture repositories, has explicit file-to-metadata joins by path, and fails loudly with the source path. Astro still prerenders every route statically. IDs are path-derived (`labs/<category>/<slug>`), so `README.md` collisions cannot happen.
- **Repo root:** resolved in `astro.config.mjs` from `new URL('..', import.meta.url)` and passed as `PTL_REPO_ROOT` (bundled chunks do not keep a stable `import.meta.url`). No developer-specific absolute paths.
- **Proof:** `tests/unit/ingestion.test.ts` (7 tests), Phase 01 evidence E-007..E-012.

## ADR-005: Markdown pipeline and link rewriting (2026-10-28, Accepted, proven)

unified + remark-parse + remark-gfm; mdast transforms for raw HTML (`<br>` -> line break, any other HTML becomes literal text), GitHub alerts, GitHub-compatible heading ids (github-slugger, same as GitHub anchors), and link/image/definition rewriting; then remark-rehype -> rehype-sanitize (strict schema, http/https/mailto only) -> trusted presentation transforms (heading anchors, scrollable table regions, code-copy wrappers, figures) -> rehype-stringify. Code and inline code are never rewritten because only `link`/`image`/`definition` nodes are visited. No syntax highlighter: sources use only `text` fences.

## ADR-006: `.pkt`, image and config delivery (2026-10-28, Accepted, proven)

Every repository file that metadata declares or canonical Markdown links (`.pkt`, `.png`, `.txt` inside `labs/` or `projects/`) is emitted by the static endpoint `src/pages/[...file].ts` at **the same path it has in the repository** (e.g. `/labs/routing/x/assets/starter.pkt`), with bytes read from source and returned unchanged. Original file names are preserved (no rename on download). Works identically for preview branches and offline builds; no dependency on GitHub raw URLs. Rejected: GitHub raw links (break on unmerged previews, MIME/redirect variability). Proof: 43/43 baseline hashes equal in `dist/` and via HTTP from `astro preview` (E-011).

## ADR-007: Topology images (2026-10-28, Accepted)

Images are copied as-is (no Astro image pipeline, no re-encoding), with `width`/`height` read from the PNG header to prevent layout shift, `loading="lazy"`, the README alt text as `<figcaption>`, and a link to the full-size file.

## ADR-008: CSS approach and visual system (2026-10-28, Accepted)

Hand-written CSS with design tokens (`site/src/styles/tokens.css`) and Astro component-scoped styles; no Tailwind, no UI framework, no React. Rationale: few dependencies, no build-time CSS tooling to keep in sync, full control of long-form prose typography. Signature: T568B Ethernet wire colours code categories (assigned in curated order, so new categories get the next code automatically; always paired with a text label). Semantic accents from switch-port LEDs: green = starter/primary action, amber = solution file/caution. Type: Atkinson Hyperlegible Next + Mono (Braille Institute, SIL OFL 1.1), self-hosted from `@fontsource-variable` packages so no third-party font requests are made. Light/dark follow the system; an optional toggle persists in localStorage (try/catch guarded); pages render fully without JavaScript.

## ADR-009: Search with Pagefind after the Astro build (2026-10-28, Accepted, proven)

`npm run build` = `astro build && pagefind --site dist` (Pagefind 1.5.2, binaries for Linux/Windows/macOS in the lockfile). Indexed content is limited to `<main data-pagefind-body>` on content pages (labs, verification guides, capstone, paths, docs, About); listing pages (home, catalog, category, index pages), search and 404 are excluded to avoid duplicate summaries outranking real content. TOC, download panel, prev/next and related lists are `data-pagefind-ignore`. Filters: `type`, `category`, `difficulty`. Custom UI on the Pagefind JS API (page + native `<dialog>` with `/` and Ctrl/Cmd+K), keeping Pagefind relevance order, rebuilding excerpts to text + `<mark>` only, deep links to section anchors. No backend, no external service. `astro dev` has no index; the UI says so (honest fallback). Rejected: Pagefind's stock UI (styling/a11y control), any hosted search API.

## ADR-010: SEO, indexing and security headers (2026-10-28, Accepted, proven)

- **Origin is an owner decision.** `PTL_SITE_URL` unset (default): no canonical, no `og:url`/`og:image`, no JSON-LD breadcrumbs, `robots.txt` = `Disallow: /`, every page `noindex, nofollow`, no sitemap. Set on the production branch: canonical + OG absolute URLs + BreadcrumbList + LearningResource (only fields that match metadata: name, description, identifier, level, timeRequired, teaches, keywords, license, free) + `sitemap.xml` (local ~30-line integration, no dependency) + `robots.txt` allow with sitemap. Cloudflare preview branches (`CF_PAGES_BRANCH` != `PTL_PRODUCTION_BRANCH`, default `main`) and `PTL_INDEXING=false` are always noindex. No dates are invented (`last_reviewed` shown as-is, not mapped to publish dates).
- **Security headers:** `scripts/write-headers.mjs` writes `dist/_headers` after build: CSP `default-src 'self'`, scripts `'self'` + `'wasm-unsafe-eval'` (Pagefind) + SHA-256 hashes of executable inline scripts computed from the built HTML; `style-src 'unsafe-inline'` (Astro inlines small styles), `frame-ancestors 'none'`, nosniff, referrer policy, permissions policy; `.pkt` served as `application/octet-stream` + `attachment`; immutable caching for hashed `/_astro/*`.
