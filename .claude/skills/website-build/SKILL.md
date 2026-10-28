---
name: website-build
description: Implement and audit the Astro documentation website from the existing Cisco Packet Tracer lab repository with phase gates, source-immutable ingestion, tests, and release readiness.
---

# Website build skill

Read `WEBSITE_AGENT_KIT/START_PROMPT.md`, `WEBSITE_AGENT_KIT/11_AGENT_LOOP.md`, the active phase in `WEBSITE_AGENT_KIT/phases/`, and `WEBSITE_AGENT_KIT/state/STATUS.md`.

The root repository is the source of truth; all website source files are written under `site/` unless a narrowly scoped CI/root integration change is necessary. No lab Markdown copies. No remote publish. Follow gates and keep progress persistent. Prioritize real working page generation, Markdown links/assets, responsive UI, security, and automated acceptance over verbose planning-only output.

If the skill is invoked after work has begun, resume from the persisted state. When phase work is blocked, preserve evidence and advance independent safe subtasks; don't fabricate completion.
