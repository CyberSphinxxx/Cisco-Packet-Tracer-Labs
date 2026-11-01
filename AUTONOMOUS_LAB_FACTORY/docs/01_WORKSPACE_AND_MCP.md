# 01 — Workspace preflight and Packet Tracer bridge

## Git isolation

- Require `pwd`, `git rev-parse --show-toplevel`, `git branch --show-current`, `git status --porcelain=v1`, `git worktree list`.
- Confirm this is the *isolated* Antigravity worktree, not Claude's checkout. Before branch creation, the ONLY allowable new untracked path is the factory kit extracted by the owner. If any other user edits, unknown untracked files or tracked modifications exist, HALT; never reset, checkout over, stash or delete unknown work.
- Fetch `origin/main` read-only, inspect its HEAD and most recent successful main CI if available. The baked `known_clean_baseline` is informational, not an instruction to reset or ignore newer main.
- Create new local `feature/phase-15-autonomous-labs` from latest main only if the tree is clean except for the newly extracted factory kit. Initialize the queue and locally commit the new kit + initial queue state as a bootstrap checkpoint before claiming labs. If branch already exists, inspect existing state, commits and worktree ownership before resuming.
- Snapshot SHA-256 for every tracked pre-existing `labs/**/assets/*`, historical `PTL-0001` original and capstone binaries; compare before every batch. Do not automatically rewrite baseline fixture JSON in `site/`.

## Packet Tracer MCP

- Inspect local MCP bridge config (not credentials), tool list and currently open Packet Tracer 9.0.1 project. No hardcoded unverified function names. Earlier successful evidence refers to a `127.0.0.1` IPC bridge; discover actual endpoint from locally approved config.
- Confirm simulator app is open/authenticated and that the code-editor bridge is active if required. Use an isolated scratch project for a real create-device, cable, CLI query, save and reopen smoke test; clean the scratch artifact you alone created after confirming safe ownership.
- Record availability: tool list, device model, IOS version, probe command, raw result and save path. If a probe times out, retry a bounded number of times (policy maximum 3 recovery attempts), then stop. Do not invent a substitute .pkt.
- Never bind 0.0.0.0, allow remote command execution, install an alternate bridge or use untrusted remote scripts to fix connectivity.
- Prior to each new lab, close or explicitly save the prior scratch project and verify the active title. **One simulator session, one task.**

## User workstation expectations

To work while away, Packet Tracer and Antigravity must remain running, PC must not sleep, and the agent must have any necessary scoped approvals. Inspect settings manually before leaving. Don't tell the agent to autonomously disable Windows sleep/security settings.
