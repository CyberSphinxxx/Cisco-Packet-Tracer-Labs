# Website (`site/`)

Static [Astro](https://astro.build/) website for the Cisco Packet Tracer Learning Library. Every page is generated at build time from the canonical repository content:

| Source (edit these) | Generated page |
|---|---|
| `labs/<category>/<slug>/README.md` + `metadata.json` (+ `verification.md`, `configs/*.txt`, `assets/*`) | `/labs/<category>/<slug>/` (+ `/verification/`) |
| `projects/<slug>/README.md` (+ `verification.md`, `configs/`, `assets/`) | `/projects/<slug>/` |
| `learning-paths/<slug>.md` | `/learning-paths/<slug>/` |
| `docs/<slug>.md` | `/docs/<slug>/` |

Do not copy guide text into `site/`. To add a lab, add a valid lab folder at the repository root; the catalog, category page, search index and routes pick it up on the next build with no site code changes. The build fails, naming the source file, on invalid metadata, duplicate IDs or slugs, missing or empty declared `.pkt` files, broken relative links or `#fragments`, unsafe URL schemes, path traversal, and links into non-public folders.

`.pkt`, topology and config files are copied into the output **byte-for-byte** at the same path they have in the repository. `AI_AGENT_GUIDE/` is never published; links to it point at GitHub.

## Requirements

- Node.js 22 LTS (>= 22.12.0). `site/.nvmrc` pins the major version.
- No internet access is needed at build time after `npm ci` (no GitHub API calls).

## Commands

Run from `site/`. The commands are the same in PowerShell, Command Prompt and bash.

```sh
npm ci                # install exact versions from package-lock.json
npm run check         # Astro + TypeScript type check
npm run test          # unit and content integration tests (Vitest), includes a real build of a temporary lab
npm run build         # astro build -> pagefind index -> dist/_headers
npm run verify:dist   # audit dist/: every source has a page, links/fragments resolve, downloads byte-identical, no private files
npm run preview       # serve dist/ at http://localhost:4321 (search works here, not in dev)
npm run test:e2e      # Playwright browser tests against the built site (run `npx playwright install chromium` once)
npm run dev           # live development server (no search index in dev mode)
```

The repository's original checks still run from the repository root:

```sh
python tools/validate_repo.py --root .
python -m unittest discover -s tests -p "test_*.py" -v
python tools/audit_repo.py
```

## Configuration (environment variables)

| Variable | Default | Effect |
|---|---|---|
| `PTL_SITE_URL` | unset | Production origin, e.g. `https://example.org`. **Unset means no canonical URLs, no sitemap, `noindex` on every page and `Disallow: /` in robots.txt.** Set it only for the real production deployment. |
| `PTL_PRODUCTION_BRANCH` | `main` | On Cloudflare Pages, any other branch (`CF_PAGES_BRANCH`) is built `noindex`. |
| `PTL_INDEXING` | unset | Set to `false` to force `noindex` even in production. |
| `PTL_BASE` | `/` | Serve the site under a sub-path. |
| `PTL_REPO_URL` | `https://github.com/CyberSphinxxx/Cisco-Packet-Tracer-Labs` | Used for "view source" and evidence links. |
| `PTL_SOURCE_REF` | `CF_PAGES_COMMIT_SHA`, then `GITHUB_SHA`, then `main` | Git ref in GitHub links, so preview builds link to the commit they were built from. |
| `PTL_REPO_ROOT` | parent of `site/` | Content root (tests point it at fixtures). |

## Design

The site is dressed as network-closet hardware ("patch panel"): an aluminium page, rack steel for the header, footer and file faceplates, label-tape lab IDs, and switch-port LEDs for status. Tokens live in `src/styles/tokens.css` (light and dark); global type, tape, wire and console styles in `src/styles/global.css`.

- Category colours are the T568B wire colours, assigned in curated order (`wireFor` in `src/lib/site.ts`), always paired with a text label.
- The homepage patch panel (`src/components/PatchPanel.astro`) is generated from the content graph: one port per lab by ID, plus the capstone. It is a visual index (`aria-hidden`); the port map list below it is the accessible equivalent.
- Console blocks highlight Cisco IOS prompts (`Router>`, `R1(config-router)#`) and mute `!` comments at build time (`markPrompts` in `src/lib/content/markdown.ts`). Each section's first prompt appears in the table of contents, and Copy copies the commands without prompts.
- Display type is Archivo (condensed widths); body and code are Atkinson Hyperlegible Next and Mono. All fonts are self-hosted.

## Cloudflare Pages

The Pages project `cisco-packet-tracer-labs` is connected to this repository with these settings:

| Setting | Value |
|---|---|
| Production branch | `main` |
| Root directory | *(repository root, leave empty)*. The build reads `labs/`, `projects/`, `learning-paths/` and `docs/` next to `site/`. |
| Build command | `cd site && npm ci && npm run build` |
| Build output directory | `site/dist` |
| Environment variables | `NODE_VERSION=22` (the v3 build image default is already 22.x), and `PTL_SITE_URL=<your production origin>` for **Production only** |

`dist/_headers` (generated) sets a Content-Security-Policy, `nosniff`, a referrer policy, `attachment` for `.pkt` files and long-lived caching for hashed assets. Preview deployments are `noindex` automatically. Verify on a preview deployment that downloads, search and headers behave as expected before attaching a custom domain.

## Licensing

Website source code in `site/` is MIT (see the repository `LICENSE`, section 2). The educational content it renders stays under CC BY-SA 4.0. The self-hosted Atkinson Hyperlegible and Archivo fonts are under the SIL Open Font License 1.1. Third-party packages keep their own licenses (`package-lock.json`).
