# PHASE 09 — Final independent audit, completion report and handoff

## Goal
Produce an auditable, maintainable repo ready for *owner-controlled* publication, not a fictional all-tested corpus.

## Actions
1. Freshly inspect git tree/changed files, HEAD and state; independently enumerate published/reviewed/draft/restricted labs and binary verification coverage.
2. Run full validator, unit tests, `git diff --check`, link/index checks, provenance audit, binary hash preservation check, and best available Packet Tracer checks. Save actual command output/exit codes.
3. Validate all previously passed phase gate reports. Revoke false PASS on evidence gaps; resolve remaining issues or mark BLOCKED.
4. Examine current README, getting started, installation, lab indexes, learning paths, source/reuse policy, community docs, and Markdown/metadata consistency.
5. Check no AI guide injected unsafe user data, no actual secrets, no instructor keys distributed anew, no unauthorized `.pka` republished, and no website deployed.
6. Write `AI_AGENT_GUIDE/state/FINAL_REPORT.md`: achieved outputs with paths, counts, tests and explicit limitations, manual owner actions (licenses, authorization, simulator validation, remote push), and website-later readiness.
7. If safe, prepare local commits and a proposed PR description; do **not** push, merge, publish or change GitHub settings without user instruction.

## Final gate
- [ ] Zero unresolved CRITICAL issues in public eligible material.
- [ ] All automated test and link check criteria met or explicitly blocked.
- [ ] Rights/restrictions independently audited; no newly distributed unauthorized material.
- [ ] No `simulator_verified` claim without actual simulator evidence.
- [ ] Final report complete and internally consistent with Git.
- [ ] Owner-only tasks and next steps precise.

**Outcome labels:** `READY_FOR_OWNER_REVIEW`, `PARTIALLY_READY_WITH_BLOCKERS`, or `NEEDS_REWORK`. Never mark fully complete if legal/simulation gates remain blocked. Leave site work for later.
