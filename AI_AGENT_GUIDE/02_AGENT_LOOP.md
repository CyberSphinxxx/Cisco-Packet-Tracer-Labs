# Execution engine: plan / implement / verify / evidence / gate

## At start of every agent session
1. Determine repo root, branch, clean/dirty state, HEAD SHA and remote without changing anything.
2. Read current `PROGRESS.md`, `BLOCKERS.md`, `DECISIONS.md`, `inventory.csv`, `provenance.csv` plus active phase.
3. Inspect actual files to catch stale state. Never trust a summary more than the workspace.
4. Choose the **first non-passed gate**. Make a short batch plan (small coherent task, expected files, tests, rollback).

## For every batch
1. Write intended change and acceptance assertions in `PROGRESS.md`.
2. Make minimal reversible edits. Prefer `git mv`; record old→new paths and link impacts. Keep manual binary files intact.
3. Static inspect/compare diff. Assert no unrelated files touched and no removal of provenance information.
4. Execute targeted checks. Fix issues; rerun. Timebox retries with documented blockers rather than infinite loops.
5. Log commands/results and test limitations in phase evidence. Do not report CLI output you did not actually obtain.
6. Update metadata/indexes that depend on the change. Perform end-to-end link/manifest check.
7. Commit a small local change if permissible, with a descriptive title (`docs:`, `refactor:`, `test:`, `content:`). No push or merges.
8. Reassess next task. Continue until all in-scope gates pass or honest blockers remain.

## Critical gates
- `RIGHTS_GATE`: no copyrighted third-party material newly distributed without verified authorization; unknown material cannot be marked publishable.
- `SIMULATOR_GATE`: Packet Tracer `.pkt`/`.pka` may be called verified only with actual run/test evidence and version/device list.
- `CORRECTNESS_GATE`: commands are context-appropriate; interfaces, address tables, routing behavior, security advice, and expected results independently checked.
- `LINK_GATE`: all published lab references, relative Markdown paths and asset paths resolve.
- `PROVENANCE_GATE`: known source, license/distribution decision, evidence path/date, correct attribution.
- `DELETION_GATE`: requires explicit owner approval for irreversible removals/history changes.

## Agent role decomposition (optional, not fictitious)
If Antigravity supports subagents, assign narrowly: Inventory/Provenance Reviewer; Network Technical Reviewer; Docs Editor; Quality/Automation Engineer. Main agent resolves conflicts. Never treat multiple model responses as equivalent to running a simulator or obtaining legal permission.

## When tool/permission/context runs out
Finish a small atomic step, update state files and summarize: exact done, current git state, next command, blocker. Never promise unattended persistence, future delivery, or completion after the tool stops.

## Error handling
- Flaky check: retry once, preserve stdout/stderr, distinguish tool error from actual validation failure.
- Git conflict/dirty state: avoid overwrite, keep patch small, report need for owner action only if unavoidable.
- No browser research: proceed only from approved sources available locally, label technical research deferred.
- No Packet Tracer executable/MCP: create `NOT_TESTED` text guides, note binary tasks blocked; don't improvise fake simulations.
- Ambiguous content ownership: mark `restricted` and preserve a private/local review manifest; don't newly place in public topic index.
- Phase blocked by one subtask: continue independent tasks in same/other phases but don't mark blocked phase as passed.

## Phase reports
For each phase write `state/reports/PHASE-XX.md` from template, with worktree SHA/branch, artifacts, tests with exact command and observed result, open risks, gate result PASS / FAIL / BLOCKED, and next phase. Claims must match artifacts.
