# PHASE 06 — Research and author original labs for missing curriculum topics

## Goal
Add valuable **original** content, not a mass dump of copied `.pka` or generic AI-generated articles.

## Actions
1. Compare current coverage against `12_CONTENT_ROADMAP.md` and actual lab registry. Produce `docs/coverage-matrix.md` marking present / draft / verified / blocked / missing per topic.
2. Select a prioritized batch of 3-5 distinct topic gaps. Finish, peer-review and validate that batch, then continue with the next. Work toward the full Tier A + Tier B v1 coverage target in `12_CONTENT_ROADMAP.md`, plus the specified Tier C starter set. Avoid a single enormous low-quality generated dump.
3. Per lab: research official Cisco/standards sources, build original topology spec and addressing table, derive IOS sequence, verify theoretical behavior, write independent tutorial with mistakes and tests, metadata and references.
4. If Packet Tracer actually available and authorized, build and save original `.pkt`; test and log actual observations. Otherwise **do not invent** file; `assets.starter`/`completed` null, status `not_tested`, with a backlog item for simulator authoring.
5. Include extra troubleshooting scenarios only if they actually follow from network design. Avoid insecure production examples and copied site narratives. Do not turn ITExamAnswers into a mirrored source.
6. Run per-lab rubric, validator, peer review; promote only verified *documentation* independently of binary status. After each batch rerun the coverage matrix and select the next batch until the finite v1 target is met or transparently blocked.

## Acceptance and proof
- [ ] Coverage matrix accurately reflects existing + new; all Tier A and Tier B outcomes and selected Tier C v1 targets are covered by approved guides or explicitly recorded as blocked, never silently omitted.
- [ ] Every new public guide is original or permission-verified, source-backed, technically reviewed, with honest simulator state.
- [ ] Every new topic adds useful information, not boilerplate/duplicate.
- [ ] All references and internal links checked.
- [ ] Planned but unavailable `.pkt` files are explicitly deferred, never fabricated.
- [ ] Scope/report states exactly how many original labs actually added and published.
