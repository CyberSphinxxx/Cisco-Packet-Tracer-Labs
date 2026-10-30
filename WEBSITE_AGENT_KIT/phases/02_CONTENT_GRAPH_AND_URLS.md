# Phase 02 — Complete content graph, schema and URL resolver

**Outcome:** All current educational content mapped to stable typed routes with safe Markdown links/assets.

Tasks: normalize 13 lab metadata records, capstone, 3 learning paths and all selected `docs/`. Strict validation for required metadata, missing assets, route collisions, unsafe traversal and invalid links; config and evidence link resolution. Parse source Markdown AST and rewrite only links/images, not code text. Map source files to `/labs/{category}/{slug}/`, `/learning-paths/{slug}/`, `/docs/{slug}/`, `/projects/small-office-network/`; ensure fragment support. Introduce generated assets or GitHub download scheme; verify correct bytes/links, preview branch behavior, no private docs exposure. Determine learning path ordered link extraction, prevent false auto-ordering.

**Gate:** each source resolves to one route; no broken internal links; synthetic fixture auto-discovery; safety/failure cases covered by tests; audit docs and capstone links. Save proof.
