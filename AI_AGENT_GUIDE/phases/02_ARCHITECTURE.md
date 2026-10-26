# PHASE 02 — Information architecture, schema, templates, automation baseline

## Goal
Define stable topic-first structure and content contract for GitHub and future website.

## Actions
1. Check `04_INFORMATION_ARCHITECTURE.md`, settle canonical category vocabulary and stable unique ID policy; log decisions.
2. Create `templates/lab-README.md` and `templates/lab-metadata.json` in repo root (source from guide templates), and `docs/` basic skeleton only for actual content. Avoid creating empty placeholder labs.
3. Implement schema validation for `metadata.json`, supported statuses, rights gate, local download refs, Markdown links. Keep unit tests and run them.
4. Create `docs/migration-map.md` mapping legacy paths to proposed topical paths, noting which are held back pending permissions. Ensure no loss of original activity identifiers.
5. Decide how per-lab pages are indexed; prefer tool-generated lab list for repo README and `docs/lab-index.md` after rights review. Preserve Markdown compatibility.
6. Define original page semantics for starter/completed assets (don't rename pre-existing unknown binaries).

## Acceptance and proof
- [ ] Categories and ID rules documented; no collisions in example.
- [ ] Template and example metadata parse; validator accepts valid example fixture, rejects invalid fixture.
- [ ] Migration map covers all grouped existing activities without publicizing restricted material.
- [ ] Architecture supports future site without building it now.
- [ ] No duplicate metadata sources or broken link paths.
