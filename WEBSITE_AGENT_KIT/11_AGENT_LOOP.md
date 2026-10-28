# 11 — Claude Code autonomous execution loop

## The bounded, evidence-driven loop

For each phase: `READ -> INSPECT -> PLAN -> IMPLEMENT -> VERIFY -> CRITIQUE -> FIX -> RECORD -> COMMIT -> ADVANCE`.

1. **READ:** `CLAUDE.md`, root `AGENTS.md`, active phase and relevant contracts. Check persistent state. Avoid rereading irrelevant huge files on every step.
2. **INSPECT:** `git status`, content structure and current tests; find previously completed work before proposing duplicates.
3. **PLAN:** select smallest useful vertical slice, identify affected files and acceptance tests, note safety/rights concerns. Do not spend the entire session writing plans.
4. **IMPLEMENT:** write real code, not placeholders; prefer small modules and typed interfaces; one route/UI feature at a time.
5. **VERIFY:** run targeted tests, then phase gate. Verify actual built output/browser behavior. Capture failures and logs.
6. **CRITIQUE:** independently question assumptions: nonexistent routes, broken links, missing .pkt, frontend-only filters with wrong semantics, mobile overflow, user confusion, content duplication, security/SEO leaks.
7. **FIX:** correct root causes, retest until deterministic gates pass. If genuine environment limitation, record BLOCKED and continue independent subtasks.
8. **RECORD:** append concise state/evidence with timestamp, branch, commit, diff summary, test exit codes, unresolved blockers and next action.
9. **COMMIT:** only safe, reviewed local changes, focused scope and descriptive commit messages. Do not stage private files.
10. **ADVANCE:** move phase status to PASS only when checkable acceptance criteria pass; else FAIL/BLOCKED. Stop only at approval boundary, real blocker, or when authorized local work is complete.

## Parallelization and delegation

Use subagents for **read-only** investigations, focused tests and independent reviews when helpful. Parallelize independent reviews, not conflicting writes to the same files; avoid divergent agents modifying the same working tree. The main agent owns integration decisions, checkpoints and Git branch. No extra nested 24/7 daemon needed.

## Context recovery

Never rely exclusively on conversational memory. At least after every phase, update `state/STATUS.md`, `HANDOFF.md`, `DECISIONS.md`, `EVIDENCE.md`, and `BLOCKERS.md`. If compacted or new session, start with `CONTINUE_PROMPT.md`. Do not delete unrelated files or reset just to clear conflicts.

## Evidence format

`[date time UTC] [phase] [working commit] [command or browser action] [exit/result] [links/logs] [pass/fail] [next]`. A self-reported success unsupported by reproducible tests is not evidence.

## Quality gates are hard gates

Never mark a phase PASS if it has an untested required route, build failure, copied Markdown, broken asset, inaccessible essential UI, data loss, or unapproved remote operation. Static validation does not demonstrate page UX, and a screenshot does not demonstrate download/link correctness.

## Final boundary

The task ends locally `READY_FOR_OWNER_REVIEW` after Phase 10 and full validation. The user will separately authorize PR/merge/deploy. Do not promise background execution after the active session ends.
