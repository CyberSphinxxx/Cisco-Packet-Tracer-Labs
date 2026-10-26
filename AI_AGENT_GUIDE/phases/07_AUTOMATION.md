# PHASE 07 — Automated quality checks and CI

## Goal
Make regression detection repeatable by maintainers and contributors.

## Actions
1. Review provided `AI_AGENT_GUIDE/tools/validate_repo.py` and its tests. Adapt as needed to final schema and root `tools/` entry point. Avoid divergent duplicated implementations.
2. Add unit tests for invalid/missing metadata, duplicate ID and slug, bad categories, broken relative Markdown and asset links, restricted+published mismatch, third-party external reference with downloadable files.
3. Add basic Markdown/formatting lint if maintainable; must not rewrite people's prose without review. Add project-specific validation for expected guide headings where docs status reviewed/published.
4. Generate canonical lab index from metadata or compare hand-written index against registry; automatically catch count inconsistencies and ghost links.
5. Add GitHub Actions workflow for pushes/PRs; read-only `contents: read`, pinned stable Python version, run offline validator and unittest; do not add Packet Tracer binary runner or API secrets.
6. Test intentionally failing fixture and successful fixture, then run green suite against repo. Document tool limitations.

## Acceptance and proof
- [ ] Validator returns nonzero on bad/mislicensed data and zero on valid content.
- [ ] Unit tests pass with expected failures tested.
- [ ] Workflow syntax and local steps checked; no simulator/remote dependencies.
- [ ] Link checks and metadata complete, actual counts consistent.
- [ ] CI would run from root and only with necessary permissions.
