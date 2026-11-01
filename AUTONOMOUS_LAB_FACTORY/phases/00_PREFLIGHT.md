# Phase 00 PREFLIGHT

## Execute

Confirm isolated clean worktree, latest main and all actually accessible repository rules. Do not change branches on a dirty checkout. Run Python queue preflight + unit tests, root Python validators and initial site tests, snapshot old files. Confirm local branch from newest main and no other agent touching same folder.

## Stop / boundary

If current main has changed since kit was authored, follow newest current rules. Stop if the required existing content rules conflict with factory authority.

## Evidence to write

Document the exact command/tool used, observed result, path/commit if applicable, and blockers in `state/WORK_LOG.md` and `state/LAST_HANDOFF.md`. Follow applicable detailed numbered contracts in `docs/`.
