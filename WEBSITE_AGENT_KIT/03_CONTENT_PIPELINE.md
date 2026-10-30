# 03 — Content engineering contract (highest-risk part)

## Design principle

GitHub Markdown and external `metadata.json` are **canonical**; Astro reads them read-only at build time. No editorial clone of content under `site/`. A clean Git checkout works without internet or GitHub API access after dependency installation.

## Recommended ingestion approach

1. Prove `glob({ base, pattern })` can load real Markdown outside `site/` via Astro Content Layer. The `glob` loader resolves files anywhere on local filesystem; use a path derived from `import.meta.url`/`path.resolve`, NOT developer-specific `C:\...` paths.
2. Join per-lab `README.md` with adjacent `metadata.json` using a deterministic path mapping, **not** array position, title string or manual constant list. Preferred: an explicitly tested adapter built around Astro Content Layer with type-safe schema; a custom content loader is acceptable if simpler and correct.
3. Validate `metadata.id` uniqueness, `category/slug` folder match, expected asset paths, simulator status, canonical source paths, required values, local links and absent private assets. Fail build loudly on broken required content.
4. Build a normalized, immutable `Lab` view model with `id`, `route`, `sourceRepoPath`, safe `imageUrl`, `starterDownloadUrl`, `completedDownloadUrl`, `evidenceUrl`, document HTML/body, and facet fields.
5. Generate routes with `getStaticPaths()` and stable `category/slug`; don't use manually maintained lists.
6. Separate content collections/adapters for docs, learning paths and the capstone. Explicitly map `learning-paths/*.md` links and `docs/*.md` source paths.

## No frontmatter requirement

Current lab README pages have no YAML frontmatter. Metadata is a separate JSON file. Render the original content; do not inject frontmatter into each README or copy them. Beware default filename-based `README` IDs collide; use path-derived ID such as `routing/dual-stack-static-routing`.

## Path and link resolution

Canonical URLs:

- `labs/<category>/<slug>/README.md` -> `/labs/<category>/<slug>/`
- `learning-paths/<slug>.md` -> `/learning-paths/<slug>/`
- `docs/<slug>.md` -> `/docs/<slug>/`
- `projects/small-office-network/README.md` -> `/projects/small-office-network/`

From Markdown, resolve a link relative to the **source Markdown file path**, then map the resolved canonical root path to generated web route or asset URL. Examples:

- `[PTL-0008](../labs/network-fundamentals/ios-navigation-and-initial-config/README.md)` from learning paths -> correct `/labs/network-fundamentals/ios-navigation-and-initial-config/`.
- `![Topology](assets/topology.png)` in lab README -> actual browser-visible image URL.
- `[R1](configs/R1.txt)` -> accessible config file via stable path or GitHub raw/blob URL.
- `starter.pkt` -> downloadable **real binary** with stable link; never rewrite bytes.
- `#learning-objectives` and `README.md#verification` -> preserve/resolve header fragments.
- Citation links and external URLs -> preserve external origin; safe `rel` for target blank.

Use Markdown AST/remark or HAST-aware processing for link/image handling; do NOT regex-replace inside code blocks, fenced CLI commands, or inline code. Validate safe schemes (`https:`, `http:`, `mailto:` where appropriate, internal paths) and reject traversal outside the allowed repository. Avoid injecting raw HTML from untrusted external content; do not use unsafe HTML rendering without sanitization.

## Assets options

- Images: copy to `site/dist` at build time as deterministic generated artifacts or configure an Astro-compatible image pipeline; source remains `labs/.../assets/topology.png`.
- Downloads: GitHub `main` file URL (if checked in and verified) is simplest for `.pkt`, or copy exact binary bytes to static output during build. If using GitHub raw links, verify URL redirects, MIME, filenames, and accessibility. For PR preview, reference the PR commit/branch appropriately when feasible; do not show a missing main-branch link on preview.
- Do not vendor/download proprietary tools or convert `.pkt` files. Do not serve `AI_AGENT_GUIDE/` by default.

## Content graph and sidebars

Generate category counts, related labs, search facets and navigation from normalized metadata. For curated learning-path order, parse Markdown link order from canonical `learning-paths/*.md` or define source-owned structured path metadata only with owner approval; do NOT hand-maintain a second list in `site/`.

## Failure behaviors

Missing metadata, route collision, missing declared `.pkt`, unsafe path, unknown relative document target or HTML injection risk should **fail local build**, with source pathname and actionable error. Empty optional assets should degrade gracefully with honest status if existing schema allows. Test a synthetic added lab automatically appears, then remove the fixture.

## Proof artifacts

`state/INGESTION_PROOF.md`: exact source-to-route mapping for PTL-0008, PTL-0001, PTL-0012 and capstone; count of discovered records; screenshot/HTML verification where actually run; temporary test lab discovery with no Astro component edits; Windows/Linux success.
