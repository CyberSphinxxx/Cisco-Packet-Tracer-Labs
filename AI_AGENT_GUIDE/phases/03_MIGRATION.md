# PHASE 03 — Rights-aware reversible migration of existing materials

## Goal
Change academic-year directory presentation to topical collection while avoiding unauthorized republishing, data loss and link breakage.

## Actions
1. Start only with files confirmed `original` or `permission_verified`. Existing `restricted` items remain excluded from the new published library; maintain a plan for later remediation. If all binaries restricted, still create original text lab guides independently.
2. Use `git mv` for authorized content where feasible. Record exact original path, new path, old SHA256/new SHA256, status, rationale and link impact in `docs/migration-map.md`.
3. For legacy guides with authorized rights, consolidate `Guide.md`, `explanation.md` into canonical `README.md` if consistent; save source pointers. Do not delete personally-authored content without revision record. Resolve contradictory details via technical audit.
4. Do not relabel original `.pka` files as starter/completed unless inspected and appropriate under license. Keep original names if a semantic rename is unknown.
5. Make Markdown compatibility stubs at old *text* paths if useful and lawful. Avoid binary stubs or duplicative copies.
6. Remove `.bak` only after verifying exact redundancy, confirming rights and owner permission; otherwise log for future. Don't rewrite Git history.
7. Update eligible labs' metadata, indexes and links. Run validator and compare file hashes and git diff.

## Acceptance and proof
- [ ] Every moved file has traceable hash-preserving mapping.
- [ ] No unauthorized third-party asset moved into public topical index.
- [ ] No originals overwritten/deleted, no user dirty changes lost.
- [ ] Existing navigable Markdown links retained or accurately documented as changed.
- [ ] All newly public lab paths have metadata and canonical README.
- [ ] `git diff --check` passes; exact change summary in phase report.

BLOCKED ownership decisions do not authorize sweeping deletion. Keep a clear backlog if migration cannot complete.
