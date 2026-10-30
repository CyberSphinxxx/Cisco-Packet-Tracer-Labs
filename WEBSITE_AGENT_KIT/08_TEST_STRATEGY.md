# 08 — Test strategy and evidence matrix

## Testing pyramid

### Baseline original project

Existing Python unit tests, validator, audit, `git diff --check`, Git status, and a before/after checksum manifest of 14 starter and 14 completed `.pkt` and 14 PNG assets. Keep a separate checksum for preserved original PTL-0001 historical `.pkt`.

### Content pipeline tests

- 13 lab entries with unique IDs and canonical categories; one capstone; all three paths; docs count matches actual source selection.
- Each metadata `assets.*` path resolves to real file; evidence path uses repo-root semantics.
- One and only one generated page per lab; stable routes; no frontmatter injection needed.
- New temporary fixture lab appears in build without route/list changes, then cleanly removed.
- Broken metadata, unknown category, missing file, duplicate slug and traversal link produce actionable build failure.
- Render Markdown with code fences containing `](...)` without rewriting contents; anchors, relative links, tables, images, callouts and cross-doc links remain correct.

### Unit / integration tests

Filter intersection, reset, URL query syncing, sorting, source path mapping, download URL generation, HTML metadata, content index completeness. Separate test runtime from production code; avoid redundant test frameworks.

### Browser E2E (playwright or equivalent)

- Navigate homepage -> Labs -> PTL-0008 -> starter download and verify file size/hash when downloaded locally.
- PTL-0011 OSPF search returns valid result; Pagefind generated bundle loaded from static preview.
- PTL-0012 DHCP page: documentation/table/command/code and topology image visible; links working.
- Beginner learning path -> valid lab; capstone -> prerequisites.
- Keyboard skip link, search open/close, filter + query, light/dark toggle, menu Escape.
- Desktop and mobile widths; no overflow from giant Markdown tables or code blocks.
- 404 shows useful navigation.

### Build output audit

- Site/dist exists; static pages generated; Pagefind index created; actual `.pkt` links work; sitemap and robots not leaking preview URL; no `AI_AGENT_GUIDE/` files, credentials, private archives or `.pka` packages.
- No broken internal links; verify fragments on representative pages. Check external links separately without failing due to transient network failures.

## Evidence rules

Record command, cwd, platform, date, exit code, observed output, selected screenshot locations, and the current commit. Claims such as "zero errors" require logs. Never report images viewed or binary downloads opened unless actually inspected. Never mark a test green by skipping it silently. Distinguish preexisting Python validator, unit tests, site integration tests, browser tests and manual UX review.

## Baseline sample inventory

Expected 13 lab routes, 1 capstone, 3 learning paths. Treat these counts as assertable for current `main`, but ensure future additions are **discovered** rather than requiring code modifications. Verify all original binaries intact before release.
