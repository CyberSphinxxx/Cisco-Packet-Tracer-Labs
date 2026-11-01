# Autonomous Packet Tracer Lab Factory — Antigravity / Gemini 3.8 Flash High

**One prompt, persistent queue, genuine Cisco Packet Tracer MCP simulation, repeatable quality gates, local commits only.**

## Start in 6 steps

1. Extract the **`AUTONOMOUS_LAB_FACTORY/` directory into the root of an isolated checkout/worktree** of `CyberSphinxxx/Cisco-Packet-Tracer-Labs`. It should sit beside `labs/`, `site/`, `learning-paths/`, `AGENTS.md`. Do not put it in `site/`.
2. Use the already working **Packet Tracer 9.0.1 / localhost MCP bridge**. Confirm Antigravity can access simulator MCP tools, the active Packet Tracer app is open, and you can safely save a *scratch* `.pkt` and reopen it.
3. Use **Antigravity Gemini 3.8 Flash High**. Enable only the specific workspace, command, and simulator MCP permissions that you reviewed. On Windows, the app can still pause for approval depending on Terminal Command Auto Execution. Never broadly disable security protections merely to keep it working.
4. Ensure Windows won't enter sleep while the app must be running, power is connected, screen lock or sleep doesn't stop Packet Tracer, and no other agent uses the same Packet Tracer MCP session. Keep Claude Code in its own checkout. Do not expose MCP endpoints to a network.
5. Open the isolated checkout as Antigravity's workspace. **Paste all of `START_PROMPT.md` once**. The agent must begin with a checkout/CI/bridge preflight and initialize the queue using Python.
6. Leave the app running. Recheck `state/progress.json`, `state/WORK_LOG.md`, local commits, and `state/LAST_HANDOFF.md` when you return. Resume with `RESUME_PROMPT.md` if the run stopped or the model context reset.

## What this actually does

- `queue/CURRICULUM_QUEUE.json`: 36 *candidate* lab tasks PTL-0020...PTL-0055 (prerequisites, targets, difficulty and capability risk).
- `tools/queue.py`: standard-library-only progress state machine, enforced task bounds, dependency sequencing and safe exit signals; **it doesn't drive Packet Tracer**. Antigravity must make actual MCP calls.
- `docs/`: scope rules, simulator probes, asset contract, educational rubric, tests, failures/recovery, security rights and runbook.
- `phases/`: numbered preflight/execute/verify/checkpoint/pack-up instructions.
- `templates/`: detailed lab specification and evidence/report templates.
- `state/`: checkpoint file and handoff log; updated as the agent works.

## Quick commands (repository root)

```powershell
python AUTONOMOUS_LAB_FACTORY/tools/queue.py preflight --repo .
python AUTONOMOUS_LAB_FACTORY/tools/queue.py init --repo .
python AUTONOMOUS_LAB_FACTORY/tools/queue.py next --repo .
python AUTONOMOUS_LAB_FACTORY/tools/queue.py status --repo .
```

Run `python AUTONOMOUS_LAB_FACTORY/tools/test_queue.py` to verify the queue program itself. The first local commit should contain the factory kit and initial `state/progress.json`; otherwise the clean-tree requirement on queue `complete` will reject the lab. See `docs/08_ORCHESTRATION.md` for complete command semantics.

## Unattended runtime is not guaranteed

This kit gives the agent instructions and checkpoint scripts; it is **not an OS-level background service** and does not guarantee that Antigravity will continue indefinitely. Model context, permission prompts, simulator crashes, PC sleep, rate limits and IDE session lifecycle can halt progress. Set sensible limits (default four-hour session cap); every successful lab is recoverable by local Git commit and state. There is no automatic push, PR, merge, deployment, system reconfiguration, or unsafe permission escalation.

**Scope of authority:** Work locally in the dedicated worktree, write new original curriculum assets, run existing validators and site checks, and create **local** commits. No remote publishing. No changes to `site/` production or Claude's worktree. No claiming `tested_pass` without genuine simulator evidence.

## Sources of truth

Read `AGENTS.md` and applicable current repo docs. Some historical `AGENTS.md` references under `AI_AGENT_GUIDE/` are absent from the latest public `main` (only the simulator evidence files are retained). If a named file does not exist, log the missing instruction, consult current accessible repository validators + guides, and **do not invent its contents**. New Factory docs never supersede an existing mandatory repo safety rule.
