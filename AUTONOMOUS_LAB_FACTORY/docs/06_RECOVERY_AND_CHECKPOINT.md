# 06 — Persistent state, resumability and safe session caps

Queue state is stored in `AUTONOMOUS_LAB_FACTORY/state/progress.json` (written atomically) and inspected by `tools/queue.py`. Every transition records UTC timestamps. The JSON queue itself is immutable source planning data during a run.

Persist narrative notes at:
- `state/WORK_LOG.md` — append lab actions/CLI summaries, test run IDs and exact checkpoints.
- `state/LAST_HANDOFF.md` — branch, HEAD, current lab, actual pending work, MCP state, next command.
- `state/plans/PTL-XXXX.md` — lab-specific topology/criteria.
- `state/reviews/BATCH-NNN.md` — independent review with pass/fail outcomes.
- Existing `AI_AGENT_GUIDE/state/PTL-XXXX-SIMULATOR-RESULTS.md` — public evidence referenced by lab metadata.

**Commit strategy:** commit lab assets, docs, and simulator evidence locally once tests pass, then execute queue `complete` (which checks metadata/assets and records commit). Commit a subsequent state-only checkpoint, or bundle state with the next task. Do not declare a queue `completed` until the lab commit exists and can be identified. On resume, reconcile Git and state before running next task; avoid rewriting evidence/history.

**Task state transitions:** `pending → in_progress → completed`, `pending/in_progress → blocked`, `blocked → pending` by explicit `retry` only (bounded). Skipped candidates stay identified; no silent deletion. If a run stops halfway, the queue responds with the in-progress task; agent must reopen, validate, and continue or mark it blocked.

**Limits:** Default session budget `max_runtime_minutes_per_session=240`, `max_successful_labs_per_session=36`, `max_blocked_per_session=8`, `max_consecutive_blocks=3`, `max_lab_attempts=2`. The queue script honors session limits for `next`, but the agent must also stop between tool calls if time exceeded. `resume-session` resets only the session clock and counters when deliberately starting a **new** Antigravity session. Do not invoke it automatically to bypass caps in the same unattended session.

**Interrupted work:** The operating system may sleep; Antigravity context/rate limits and tool permissions can stop progress. These files allow you to resume without copy/pasting lab instructions, but the kit itself does not schedule a process or operate when Antigravity is closed.
