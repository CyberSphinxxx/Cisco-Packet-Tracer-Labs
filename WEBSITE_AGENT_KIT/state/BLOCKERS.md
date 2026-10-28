# Open blockers and risk register

Each entry: timestamp, severity, reproduction, workaround, owner action, resolution.

## B-001 Windows-native build not observable by the agent (2026-10-28, Medium, OPEN)

- **Reproduction:** session has a file bridge to the owner's machine but no shell; cannot run `npm ci`, `npm run build`, Python gates or git on Windows.
- **Workaround:** all builds/tests run on Linux; code uses `node:path`/`fileURLToPath`; tests cover Windows-style separators and CRLF sources (the owner checkout is CRLF, verified).
- **Owner action:** after importing the bundle, run the commands in `HANDOFF.md` on Windows (Node >= 22.12) and report any failure.
- **Resolution:** pending owner run.

## B-002 Agent kit not at repo root in owner tree (2026-10-28, Low, RESOLVED on branch)

Kit was extracted into `Cisco_Packet_Tracer_Astro_Claude_Opus_55_Agent_Kit/`. Verified and copied to the repo root on the feature branch. The owner can delete the untracked subfolder after importing the branch.
