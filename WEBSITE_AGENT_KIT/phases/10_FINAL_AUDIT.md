# Phase 10 — Independent final audit and owner handoff

**Outcome:** Auditable, locally feature-complete website ready for owner review, no unapproved release.

Tasks: adopt an adversarial perspective, rerun all Python/Node checks and clean build; independently inspect source and generated files; verify baseline hashes, counts, links, downloads, query/filter state, search results, mobile/keyboard and 404, SEO and licensing boundaries. Re-test synthetic lab creation then removal, intentional broken link, path traversal and missing asset. Check no copied Markdown, no private archives, no child agent claiming work it didn't perform. Review git diff against main and avoid unrelated content edits. Document exact successful/failed checks and limitations. Commit verified final changes locally; create `state/FINAL_REPORT.md` and `state/HANDOFF.md`.

**Gate:** all checks in `12_ACCEPTANCE_GATES.md` genuinely verified, no release blockers, working tree clean, final status `READY_FOR_OWNER_REVIEW`. If not: `PARTIALLY_READY_WITH_BLOCKERS`, with exact action. Stop without pushing, PR, merging, or deploying.
