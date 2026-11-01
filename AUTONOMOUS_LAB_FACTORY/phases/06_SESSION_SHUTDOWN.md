# Phase 06 SESSION SHUTDOWN

## Execute

Respect runtime, block and tool permission caps; verify working state, counts, accurate blocked reasons and local commit SHAs. Write LAST_HANDOFF and final audit. Leave unrelated work and environment intact.

## Stop / boundary

No automatic push/PR/merge/deploy. On new session use RESUME_PROMPT and explicit resume-session only when appropriate.

## Evidence to write

Document the exact command/tool used, observed result, path/commit if applicable, and blockers in `state/WORK_LOG.md` and `state/LAST_HANDOFF.md`. Follow applicable detailed numbered contracts in `docs/`.
