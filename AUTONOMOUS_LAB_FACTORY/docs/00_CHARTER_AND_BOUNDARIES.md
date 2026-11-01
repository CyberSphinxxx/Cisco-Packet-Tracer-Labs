# 00 — Charter, authority and safe boundaries

**Objective:** Independently build and verify up to 36 original, appropriately staged, learner-friendly networking exercises using *real* Cisco Packet Tracer MCP tools. The queue is a candidate backlog, not a promise that the simulator supports every activity.

**Authorized:** A dedicated checkout/worktree, new content in `labs/`, existing root learning-path and coverage Markdown, local evidence files in `AI_AGENT_GUIDE/state/`, kit state, local Git commits, read-only fetch of origin, local Python/Node commands, and local Packet Tracer tools via the existing loopback bridge. Read and obey the actual `AGENTS.md` and validator; where a historical guide is missing, log `MISSING`, do not imagine rules.

**Not authorized:** Remote push/PR/merge, force push/rebase of published shared history, touching Claude's checkout, editing `site/` production, restarting untrusted network services, downloading or installing an alternate bridge, disabling firewall/antivirus, changing Windows power settings, granting broad filesystem permissions, editing existing binaries, changing repository licenses, exposing the bridge outside localhost, using proprietary NetAcad assessment content, or impersonating student results.

**Concurrency:** Only one agent can drive the single Packet Tracer app/MCP bridge at a time. Parallel agents can audit text on distinct checkouts but cannot concurrently mutate a simulator session. Never run multiple lab builds in the same open Packet Tracer project. Use a scratch file per lab and verify target filepath before saving.

**Unattended behavior:** Continue within approved limits and existing tool permissions. A mandatory permission prompt, unsupported simulator capability, unexpected changes, or system-level request is a HALT condition. Leave state and local commits rather than bypass protections. Never claim uninterrupted hours of running; the IDE may stop.

**Owner approval reserved for:** All remote publishing, any new MCP/driver installation, modifying website source, account authentication, new official external API credentials, destructive repo operations, and changes to security software/system settings.
