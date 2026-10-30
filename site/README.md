# Website (`site/`)

Static [Astro](https://astro.build/) website for **itnetworking** (Packet Tracer labs and networking tools). The name lives in one place: `SITE_NAME`, `SHORT_NAME` and `TAGLINE` in `src/lib/site.ts`. Every page is generated at build time from the canonical repository content:

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
| `PTL_SITE_URL` | unset | Production origin, `https://itnetworking.pages.dev`. **Unset means no canonical URLs, no sitemap, `noindex` on every page and `Disallow: /` in robots.txt.** Set it only for the real production deployment. |
| `PTL_PRODUCTION_BRANCH` | `main` | On Cloudflare Pages, any other branch (`CF_PAGES_BRANCH`) is built `noindex`. |
| `PTL_INDEXING` | unset | Set to `false` to force `noindex` even in production. |
| `PTL_BASE` | `/` | Serve the site under a sub-path. |
| `PTL_REPO_URL` | `https://github.com/CyberSphinxxx/Cisco-Packet-Tracer-Labs` | Used for "view source" and evidence links. |
| `PTL_SOURCE_REF` | `CF_PAGES_COMMIT_SHA`, then `GITHUB_SHA`, then `main` | Git ref in GitHub links, so preview builds link to the commit they were built from. |
| `PTL_REPO_ROOT` | parent of `site/` | Content root (tests point it at fixtures). |
| `PTL_REDIRECT_TO` | unset | Moved address. When set (e.g. `https://itnetworking.pages.dev`), the build writes `dist/_redirects` containing `/* <origin>/:splat 301`, so every path on this deployment redirects to the same path there. Must be a plain `http(s)` origin; anything else fails the build. |
| `PTL_ADS` | unset | Future ads switch. **Unset (the default) means `AdSlot` renders nothing at all.** When set, each slot reserves its exact height and shows an "Advertisement" label; loading an ad network, its CSP additions and a consent banner are not built yet. |

## Design

"Study hub, search first": a warm paper page, white cards, near-black ink for text and the primary button, and one green accent used only for decoration. Tokens live in `src/styles/tokens.css` (light, dark, and the `data-theme` toggle use the same names); base type, buttons, tags, chips, cards and prose in `src/styles/global.css`. The whole site ships one stylesheet.

- Type: **Instrument Sans** (variable, weight 400-700, width 75-100%) for UI and headings, with headlines at `font-stretch: 92%`; **DM Mono** (400, 500) for lab IDs, prompts, commands and tags. Only the Instrument Sans Latin file is preloaded. Metric-matched local fallbacks (`size-adjust`, `ascent-override`) keep text from moving if a font arrives late.
- `--faint` is about 3.2:1 on the page, so it is for decoration and large text only; small text uses `--muted`. `--accent` green is never text on light backgrounds. Every page is checked with axe in both themes.
- Tags code content kinds: green for labs, blue for paths (and tools), orange for guides and the capstone (and practice).
- Header (`src/components/SiteHeader.astro`): logo, nav to pages that exist, search (`/` or Ctrl/Cmd+K), theme toggle, GitHub and "Start with lab 1", which opens the first lab of the beginner learning path. Below 64rem the nav becomes a sheet behind the Menu button.
- Homepage (`src/pages/index.astro`): every count and list comes from the content graph. The hero search (`HeroSearch.astro`) is a real Pagefind search; Enter goes to `/search/?q=`. On the homepage `/` focuses it while it is on screen.
- Hero background (`HeroBackdrop.astro`): a dot grid, thin links between node squares at the edges, and a few packets. Packets are HTML elements animated only with `transform` and `opacity`, fitted to a 1440x760 design space with a ResizeObserver and paused off-screen or in a hidden tab. Reduced motion, screens below 48rem and forced colours get the static layer (or none).
- Console blocks highlight Cisco IOS prompts in `--tag-green` and mute `!` comments (`markPrompts` in `src/lib/content/markdown.ts`). Each section's first prompt appears in the table of contents, and Copy copies the commands without prompts.
- `AdSlot.astro` marks where ads may go later (homepage leaderboard between the door cards and the beginner path). It renders nothing unless `PTL_ADS` is set.

## Cloudflare Pages

The site lives at **<https://itnetworking.pages.dev>**: the Pages project `itnetworking`, connected to this repository with these settings:

| Setting | Value |
|---|---|
| Production branch | `main` |
| Root directory | *(repository root, leave empty)*. The build reads `labs/`, `projects/`, `learning-paths/` and `docs/` next to `site/`. |
| Build command | `cd site && npm ci && npm run build` |
| Build output directory | `site/dist` |
| Environment variables | `NODE_VERSION=22` (the v3 build image default is already 22.x), and `PTL_SITE_URL=https://itnetworking.pages.dev` for **Production only** |

`dist/_headers` (generated) sets a Content-Security-Policy, `nosniff`, a referrer policy, `attachment` for `.pkt` files and long-lived caching for hashed assets. Preview deployments are `noindex` automatically. Verify on a preview deployment that downloads, search and headers behave as expected before attaching a custom domain.

### The old address

A `*.pages.dev` name cannot be renamed, so the original project `cisco-packet-tracer-labs` stays, only to forward old links. It builds the same commit with `PTL_REDIRECT_TO=https://itnetworking.pages.dev` (Production) and no `PTL_SITE_URL`, so every `https://cisco-packet-tracer-labs.pages.dev/<path>` answers with a 301 to `https://itnetworking.pages.dev/<path>`. Keep that project; deleting it would break existing links.

## Licensing

Website source code in `site/` is MIT (see the repository `LICENSE`, section 2). The educational content it renders stays under CC BY-SA 4.0. The self-hosted Instrument Sans and DM Mono fonts are under the SIL Open Font License 1.1; their licence texts are in `src/fonts/`. Third-party packages keep their own licenses (`package-lock.json`).
