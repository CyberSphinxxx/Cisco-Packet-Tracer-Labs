# Durable execution journal and context recovery

At Phase 0 create/update these in `AI_AGENT_GUIDE/state/`:
- `PROGRESS.md` — phase status table (NOT_STARTED/IN_PROGRESS/PASSED/BLOCKED) and current work item; last HEAD and validation command/results.
- `inventory.csv` — every current tracked file, technical details, source category and disposition; update after moves.
- `provenance.csv` — source/ownership decisions, URLs, permissions, dates and reviewer; unknown = restricted.
- `DECISIONS.md` — architecture decisions with reason, alternatives, and tradeoffs.
- `BLOCKERS.md` — owner approvals (lawful redistribution, delete/history remediation, real simulator, site phase deferred), affected files and exact next step.
- `reports/PHASE-XX.md` — every phase's evidence/gate; do not create empty 'passed' placeholders.
- `reports/LAB-<id>.md` — important technical reviews/evidence.

Use templates in `templates/`. These files are *operational records*, not automatically correct by virtue of existence. Before reusing them compare `git status`, actual file hashes/paths and test reports. Verify state after resumed sessions.

## Suggested concise progress summary
```
Active phase: 04_DOCUMENTATION
Last audited local HEAD: <sha>
Published reviewed original labs: <count>
Draft/unverified labs: <count>
Restricted third-party files: <count>
Tests last run: <exact command> (PASS/FAIL/BLOCKED), <timestamp>
Current task: <path + outcome>
Next task: <single actionable command + expected result>
Owner-only decisions: <list>
```

## Recovery from context exhaustion
Agent must stop generating changes before losing track of modifications. Persist handoff to state, then the next user/agent session should paste `CONTINUE_PROMPT.md`. If Antigravity auto-compacts context, still re-read state and re-run tests at every phase gate. No fake 24/7 promise: autonomous execution lasts only while the tools/session remain available.
