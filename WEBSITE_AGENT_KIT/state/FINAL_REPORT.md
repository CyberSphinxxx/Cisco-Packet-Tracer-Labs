# Final report: Astro learning website (Phases 00-10)

**Branch:** `feature/astro-learning-platform` (local only; never pushed), based on `main` `234d9ee`
**Environment:** Linux workspace (Node 22.23.4, npm 10.9.9, Python 3.13.18, Chromium via Playwright 1.63). The owner's Windows machine was reachable only through a file bridge (no shell); see "Not verified".
**Final status:** see the verdict at the end of this file.

## What was built

A static Astro 7.3.8 site in `site/` that reads the repository's canonical `labs/`, `projects/`, `learning-paths/` and `docs/` at build time. No guide Markdown, metadata or `.pkt` file is copied into `site/` (asserted by tests).

| Route | Count | Source |
|---|---|---|
| `/` | 1 | derived from all content |
| `/labs/` catalog with facets + `/labs/{category}/` | 1 + 6 | `labs/*/*/metadata.json` |
| `/labs/{category}/{slug}/` | 13 | `README.md` + `metadata.json` per lab |
| `/labs/{category}/{slug}/verification/` | 13 | `verification.md` per lab |
| `/projects/small-office-network/` (+ `/verification/`) | 2 | `projects/small-office-network/` |
| `/learning-paths/` + `/learning-paths/{slug}/` | 1 + 3 | `learning-paths/*.md` (order from root README, steps in source order) |
| `/docs/` + `/docs/{slug}/` | 1 + 8 | `docs/*.md` |
| `/about/`, `/search/`, `/404` | 3 | licensing/independence, Pagefind UI, recovery |
| Static files at their repository paths | 73 | 14 starter + 14 completed `.pkt`, 14 topology PNG, PTL-0001 historical `.pkt`, 30 config `.txt` (byte-identical) |
| `robots.txt`, `_headers`, `pagefind/`, `sitemap.xml` (only with an origin) | | generated |

Key behaviours: starter download is the dominant action and the solution file is behind a labelled disclosure; SHA-256 checksums shown; reference configs viewable inline; table of contents with section tracking; previous/next in curated learning order; related labs; catalog filters (topic area, difficulty, topic, time, text) with URL state and back/forward; Pagefind full-text search page and keyboard dialog with section deep links; light/dark themes; works without JavaScript (filters/search degrade with an explanation).

## Architecture (ADRs in `DECISIONS.md`)

- ADR-004 framework-independent content module (`site/src/lib/content/`) joining README + metadata by folder path, two-pass (index headings, then render) for cross-document fragment validation; repo root from `astro.config.mjs` via `PTL_REPO_ROOT`.
- ADR-005 unified/remark AST pipeline: links rewritten only on link/image/definition nodes; raw HTML neutralized (`<br>` kept); rehype-sanitize; GitHub-compatible heading ids.
- ADR-006/007 binaries and images emitted unchanged by a static endpoint; PNG dimensions read from headers.
- ADR-008 hand-written CSS tokens; T568B wire colours for categories; self-hosted OFL fonts.
- ADR-009 Pagefind after build; listing pages excluded from the index.
- ADR-010 indexing policy driven by `PTL_SITE_URL` (noindex by default and on preview branches); hash-based CSP in `_headers`.
- ADR-011 CI job in `validate.yml` after the unchanged Python job; Cloudflare Pages settings documented, not created.

## Quality gates (latest runs; details and timestamps in `EVIDENCE.md`)

| Gate | Command / check | Result |
|---|---|---|
| G0 baseline | Python validator / 29 unit tests / audit at base and after changes | 0 errors / OK / Complete and Consistent (E-005, E-037) |
| G0 integrity | 43 binary SHA-256 vs `baseline-checksums.json`; `git diff 234d9ee -- labs projects docs learning-paths AI_AGENT_GUIDE tools tests templates README.md LICENSE` | 43/43 unchanged; diff empty (E-039) |
| G1 ingestion | `tests/unit/ingestion.test.ts` | PTL-0008 from source, 13 labs by folder join, no copies (E-009) |
| G2 content graph | `tests/unit/repository.test.ts`, `markdown.test.ts`, build-discovery test, `verify:dist` | all failure modes fail loudly; fixture auto-discovered and removed (E-013..E-018, E-039) |
| G3 shell | screenshots, keyboard and no-JS checks | E-020, E-021 |
| G4 catalog | `filters.test.ts`, `catalog.spec.ts` | intersection, URL state, back/forward, empty state (E-022, E-023) |
| G5 guide pages | `lab-detail.spec.ts` | 13 labs x 11 sections, 26 downloads byte-identical in the browser (E-027) |
| G6 paths/capstone/docs | `paths-docs.spec.ts` | source order, prerequisites, titles, 404, agent files 404 (E-029) |
| G7 search | `search.spec.ts` on built preview | 6 kit queries hit expected pages (E-031) |
| G8 quality | axe (54 scans, 0 violations), layout widths 320-1440 + 200% zoom, CLS 0.000, Lighthouse (lab) perf 98-100 / a11y 100 / BP 100 / SEO 100 in production mode, CSP test | E-033..E-036 |
| G9 CI readiness | clean-clone step-for-step CI simulation | all steps exit 0 (E-038) |
| G10 audit | independent reviewer on a separate clean clone + real-repo adversarial proofs | see "Independent audit" |

Latest full run counts: Vitest 64/64; Playwright 132 passed + 10 explicit skips (mobile duplicates of viewport-specific tests); `verify:dist` 0 failures over 52 pages, 680+ internal links and 445+ fragments; `astro check` 0 errors 0 warnings.

## Defects found and fixed during the work (selection)

Root `.gitignore` `lib/` rule hid `site/src/lib/` from Git; topic regex stricter than the Python validator; lead extraction picking wrong paragraphs (CCNA path, capstone); wide tables clipped at the text measure; TOC highlight not tracking; mobile header wrapping; client-side search sort burying relevant results under listing pages; Escape not closing the search dialog; unlabeled task-list checkboxes (axe critical); layout shift from script-revealed controls (CLS up to 0.63); duplicate `playwright-core` versions breaking types; a test exemption that never matched (found by the clean-clone CI simulation).

## Not verified (honest limits)

- **Windows-native build** (`npm ci`, `npm run build`, tests) was not run by the agent: no shell on the owner's machine (BLOCKERS B-001). Mitigations: OS-portable path handling, CRLF and backslash tests, the owner's checkout verified to be CRLF.
- **GitHub Actions and Cloudflare Pages** were not run remotely (no push/deploy authorized; B-003). CI was simulated step for step in a clean clone.
- **Packet Tracer**: no `.pkt` file was opened or simulated; the site states each lab's simulator status from metadata only.
- Lighthouse numbers are lab measurements on a local server, not field data.

## Owner actions

1. Import: `git fetch scratch/astro-site.bundle feature/astro-learning-platform:feature/astro-learning-platform`, then `git switch feature/astro-learning-platform`.
2. On Windows (PowerShell, Node 22): `cd site; npm ci; npm run check; npm test; npm run build; npm run verify:dist; npm run preview` and open http://localhost:4321. Optional: `npx playwright install chromium; npm run test:e2e`.
3. Decide whether the agent kit files (`CLAUDE.md`, `.claude/`, `WEBSITE_AGENT_KIT/`) should stay in the branch before merging.
4. When ready (separate authorization): push the branch, open a PR, confirm both CI jobs, create a Cloudflare Pages project with the settings in `site/README.md`, check a preview deployment, then set `PTL_SITE_URL` for production.
5. Optional content decision: topology screenshots show a local Windows path in the Packet Tracer title bar (O-001).
