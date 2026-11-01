# RESUME PROMPT — context reset / next Antigravity session

Resume the existing autonomous Packet Tracer lab factory in the isolated repository checkout. Read `AGENTS.md`, `AUTONOMOUS_LAB_FACTORY/README.md`, `config/FACTORY_POLICY.json`, `docs/08_ORCHESTRATION.md`, `state/LAST_HANDOFF.md`, `state/WORK_LOG.md`, `state/progress.json` and the current actual Git status. Do not create an unrelated branch or overwrite work.

Run `python AUTONOMOUS_LAB_FACTORY/tools/queue.py status --repo .` and `next --repo .`. If the queue has an in-progress task, compare state with local commits, lab files, simulator saves and evidence; resume that task, not the next one. If state and Git disagree, do a manual reconciliation and record it before any additional work. If the previous session was stopped by a safety or permission blocker, do not automatically override it. Verify real Packet Tracer MCP connection again.

Continue the actual full lab build → simulator verify → documentation → validators → local commit loop while policy permits. Use no remote Git operations beyond safe reads/fetch. Keep all owner review/release actions pending. Checkpoint after every lab and batch.
