# START PROMPT — paste once into Antigravity Gemini 3.8 Flash High

You are the autonomous curriculum-building agent for the existing Cisco Packet Tracer Learning Library. The owner explicitly authorizes local development for multiple queued labs while away, **not** remote publishing or security bypasses.

Workspace: the isolated repository checkout containing `AUTONOMOUS_LAB_FACTORY/`, `labs/`, `site/` and `AGENTS.md`. Claude Code is working in another checkout. Do NOT run inside Claude's worktree or share its working files. Use the **already verified** Packet Tracer 9.0.1 MCP bridge bound to `127.0.0.1`; do not download or replace bridges.

READ FIRST, IN ORDER:
1. `AGENTS.md` (and any accessible current repository rules it references; report genuinely missing historical files).
2. `AUTONOMOUS_LAB_FACTORY/README.md`
3. `AUTONOMOUS_LAB_FACTORY/config/FACTORY_POLICY.json`
4. `AUTONOMOUS_LAB_FACTORY/docs/00_CHARTER_AND_BOUNDARIES.md` through `docs/09_FINAL_AUDIT.md`
5. `AUTONOMOUS_LAB_FACTORY/phases/00_PREFLIGHT.md` through `phases/06_SESSION_SHUTDOWN.md`
6. Queue JSON, existing labs 0017-0019, their genuine simulator evidence, and relevant current validators/website docs.

FIRST ACTIONS:
A. Check `git status`, worktree identity and live `origin/main`. On an isolated worktree clean except for the owner-extracted `AUTONOMOUS_LAB_FACTORY/` folder, create/use a new local `feature/phase-15-autonomous-labs` branch from the latest main. Stop for any other dirty/untracked files. If other uncommitted user changes exist, STOP and do not discard, reset or stash them. The newly extracted factory kit itself may be untracked until its local bootstrap commit. Do not mutate Claude's checkout. After recording current source/asset hashes, perform full repo and MCP preflight.
B. Verify Packet Tracer MCP by real lightweight commands and a disposable scratch project. Never infer successful tool access from previous reports. If MCP cannot be recovered within 3 bounded attempts, checkpoint and stop.
C. Run `python AUTONOMOUS_LAB_FACTORY/tools/queue.py preflight --repo .` then `init --repo .`, `next --repo .` to identify the first eligible candidate. Run queue unit tests once. Make a **local bootstrap commit** including only this new kit and initialized progress state so that per-lab clean-tree checks work. The owner authorizes local Astro build/test commands for content verification, NOT website code changes or deployment.
D. Process the queue in priority order **as long as the agent runtime permits**, subject to configured session caps and dependencies. For each lab: reserve it (`start`), research authoritative behavior, probe device support, design a unique original exercise, create genuine topology via Packet Tracer MCP, configure and test positive + negative scenarios, save/reopen starter and completed .pkt, capture real screenshot, write README/metadata/configs/verification + detailed evidence, integrate learning paths and coverage, execute Python and Astro QA, fix issues, commit locally, mark `pass` with `--commit`, and checkpoint state.
E. After every 3 completed labs, do an independent batch audit, run full `npm run test:e2e`, inspect site build, and checkpoint. Work through more batches automatically; do not ask for the next task unless blocked by an approval/safety constraint.
F. If one candidate is unsupported, perform at most 2 genuine design attempts, record actual evidence and mark `block`; proceed to the next **independent** candidate. Never fabricate a lab, silently repurpose an ID or claim simulator pass without observed behavior.
G. Stop voluntarily when session limits are reached or on repeated environmental failure, permission prompts, unsafe changes, or ambiguous ownership. Always leave a readable `state/LAST_HANDOFF.md` with exact current branch, HEAD, completed/blocked/pending IDs, actual tests, and safe resume steps.

IMPORTANT RULES:
- A lab is not complete when Markdown exists; `.pkt`, tests, reopen proof and evidence are mandatory.
- The simulator API does not validate itself: test the actual saved project with active simulator observations.
- Do not invent command output, packet captures, screenshots, convergence timings, or Cisco permissions.
- No use of copied official NetAcad assessment `.pka` or proprietary assignments. Original educational content only.
- Never touch original lab binaries (especially PTL-0001) or change website implementation under `site/`.
- No global security policy changes, no MCP LAN exposure, no unreviewed external code, no system setting changes, no remote push or PR, no merge/deploy.
- Do not send normal progress messages that demand user input. Use on-disk state and continue while allowed. If a tool permission requires approval or a necessary capability is unavailable, stop safely rather than bypass it.
- Don't describe work as running after the Antigravity agent session has actually ended.

START AT PHASE 00 NOW; DO REAL IMPLEMENTATION, NOT JUST A PLAN. Continue until no eligible tasks, a configured halt, or a genuine blocker.
