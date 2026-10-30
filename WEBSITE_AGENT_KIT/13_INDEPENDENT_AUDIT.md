# 13 — Independent adversarial review checklist

Act like an external maintainer unfamiliar with the author's design; inspect source and built output. Independently verify rather than accepting claims.

## Core architecture challenges

- Search for duplicated guide paragraphs in `site/`. Trace how new lab data reaches pages; identify hand-maintained title/index arrays.
- Deliberately alter a temporary lab `metadata.json` title and verify the rendered page updates on a fresh build. Restore fixture afterward.
- Insert a temporary valid test lab with a novel slug; site route and catalog must appear without editing Astro components. Remove it after proof.
- Try broken relative links, duplicate IDs, traversal `../../../`, `javascript:` URL and misleading `#anchor`; ensure safe handling.
- Verify URLs under base/trailingSlash options and Windows/Linux path separators.

## UX test challenges

- 320px viewport: wide addressing tables/CLI code must not create page overflow.
- Keyboard-only: search, menus, filters, download actions, TOC, theme all reachable; Escape/focus works.
- Zoom to 200%, reduced motion; check focus visibility, no occluded headings on anchor navigation.
- No JS mode: content and core navigation visible, links usable; search/filter may degrade gracefully.

## SEO and content safety

- No fictitious Cisco sponsorship, certification promises or production-domain placeholders in canonical tags.
- No agent state, source archives, `.pka`, credentials or bridge scripts in `dist/`; no secret leakage through import.
- Metadata dates reflect source, not fabricated publish dates.
- Cross-license text accurate; no false implication MIT covers copied CC educational materials.

## Test and CI traps

- Existing Python validator still runs on root; `site` scripts run with pinned lockfile on Linux.
- Run built preview, Pagefind query, E2E and check downloaded `.pkt` bytes if local output copies them.
- Check `npm ci` from clean checkout and build without GitHub API calls.
- Make site build fail when required source asset is removed; restore it after test.
- Check git diff for unexpected changes in `labs/` and historical `.pkt`.

## Verdict vocabulary

`READY_FOR_OWNER_REVIEW`, `PARTIALLY_READY_WITH_BLOCKERS`, `NOT_READY`. State exact reasons, required action and evidence; no blanket "100% bug-free" or absolute security assurance.
