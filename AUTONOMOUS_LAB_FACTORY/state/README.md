# Runtime state

- `progress.json` is created by `tools/queue.py init` and is an **agent checkpoint**, not proof of simulator testing.
- `WORK_LOG.md` and `LAST_HANDOFF.md` are initialized in this bundle; agent appends actual evidence and Git commits.
- `plans/` and `reviews/` are created when needed.
- Do not edit progress.json by hand when a command exists. `init` never wipes existing progress. Resume with the same branch and scope.
- Keep state in the isolated worktree. It may be included in local commits, but do not copy confidential raw host logs into Git.
