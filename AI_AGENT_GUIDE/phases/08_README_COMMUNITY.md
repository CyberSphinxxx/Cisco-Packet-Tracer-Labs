# PHASE 08 — Public-facing README, learning paths and contributor UX

## Goal
Make the repository discoverable, navigable and easy to contribute to while accurately describing what is available.

## Actions
1. Replace legacy personal-year framing with professionally readable main README: educational purpose, quick start, legal disclaimer, topic index, badges only if verified, lab counts from actual data, links to paths/troubleshooting/official installer, contribution and support.
2. Design beginner and BSIT paths pointing to existing labs. CCNA-aligned path may link to canonical topics but must not imply Cisco certification endorsement or guarantee a current exam blueprint.
3. `docs/lab-index.md`: searchable-by-browser title + category + difficulty + original activity number where applicable + file availability + simulator verification. Only public eligible metadata.
4. `CONTRIBUTING.md`: PR submission, original work/license permission, metadata schema, testing protocol, quality rubric; `SECURITY.md` for private vulnerability reporting if relevant; issue templates for broken lab, new suggestion and technical correction.
5. Add docs for provenance/licensing and how to request correction/takedown. LICENSE only after owner confirms license choice for original content; clearly exclude third-party assets.
6. Proofread all pages, click/check internal links, audit category coverage and broken links; preview GitHub Markdown and assets if browser available.

## Acceptance and proof
- [ ] README accurate and contains no dead/exaggerated claims.
- [ ] Complete navigable public lab index and paths, no restricted assets promoted.
- [ ] Contributor/issue/reporting docs useful and concise.
- [ ] Licensing/attribution clear and not a blanket unauthorized relicensing.
- [ ] `git diff --check`, validator, unit tests pass.
