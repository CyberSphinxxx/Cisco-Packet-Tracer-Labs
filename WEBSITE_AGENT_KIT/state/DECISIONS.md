# Architecture decision log

ADR format: `../templates/ADR.md`. Decisions are by the coding agent for local implementation; scope-changing choices need owner approval.

## ADR-000: Work in a Linux clone, deliver by Git bundle (2026-10-28, Accepted)

- **Context:** The session can read/write files in the owner's Windows repo folder but has no shell there, so it cannot run git, npm or Python on the owner machine.
- **Options:** (a) write loose files into the owner's working tree on `main` (no commits, would collide with a later checkout); (b) clone the same public repo into the Linux workspace, verify the owner tree matches it, commit there, deliver a Git bundle; (c) stop and ask the owner to run commands.
- **Decision:** (b). The owner tree was verified identical to `main` (263/263 tracked files; differences are CRLF only). Bundles go to `scratch/` (already git-ignored), never pushed. State files are mirrored into the owner's kit folder for visibility.
- **Consequences:** The owner imports with `git fetch scratch/astro-site.bundle feature/astro-learning-platform:feature/astro-learning-platform`. Windows-native `npm ci/build` is not observed by the agent (BLOCKERS B-001).

## ADR-001: Superseded "no site/" rule (2026-10-28, Accepted)

`AI_AGENT_GUIDE/11_WEBSITE_FUTURE_CONTRACT.md` and `AGENTS.md` forbid building the website without explicit user authorization. The owner gave that authorization in this session (start prompt + chat message: "You are authorized to develop and test the complete Astro website locally on a new feature branch"). Remote operations remain forbidden.

## ADR-002: Toolchain (2026-10-28, Proposed; confirmed in Phase 01 by real install + check)

Astro 7.3.8, Node 22 LTS (>= 22.12.0), TypeScript 6.0.x, Pagefind 1.5.2. Rationale in BASELINE.md section 4. Rejected: Astro 7.4.x (released < 2 weeks ago, Node floor 22.23.4), TypeScript 7 (unsupported by `@astrojs/check`).

## ADR-003: Published docs selection (2026-10-28, Accepted)

All 8 `docs/*.md` are published under `/docs/{slug}/`: they are public in the repo and all 8 appear in README "Quick Navigation". `AI_AGENT_GUIDE/**` is never published; links into it are rewritten to the public GitHub blob URL of the same file.

Further mandatory ADRs (loader, link rewrite, `.pkt` delivery, images, path order, search, CSS, tests/CI, Pages config, licensing) are recorded in the phase where they are proven.
