# Session handoff

**Current phase:** 04 (next)
**Last completed task:** Phase 03 PASS: tokens, shell, homepage, theme, mobile menu
**Current branch and commit:** `feature/astro-learning-platform`, see `git log -1`
**Verified environment:** Linux workspace (Node 22.23.4, npm 10.9.9, Python 3.13.18). Owner machine: Windows, file bridge only (see DECISIONS ADR-000)
**Changed files:** kit files at repo root (`CLAUDE.md`, `.claude/skills/website-build/`, `WEBSITE_AGENT_KIT/`), state files
**Tests last run:** Python validator, 29 unit tests, audit: all exit 0 at base commit
**Open blockers:** B-001 (Windows build to be run by owner)
**Next precise action:** Phase 04 catalog `/labs/` with URL-synced facets, category pages

## How the owner imports the work (PowerShell, from repo root)

```powershell
git fetch scratch/astro-site.bundle feature/astro-learning-platform:feature/astro-learning-platform
git switch feature/astro-learning-platform
```

The bundle's only prerequisite is commit `234d9ee`, which the owner's `main` already has. Nothing is pushed.

Update this document at every phase transition and before context compaction.
