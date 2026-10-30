# Phase 00 — Safe baseline and inventory

**Outcome:** Feature branch from clean `main`; root-content integrity recorded; existing Python QA baseline passed; detailed but compact work plan and risks.

Tasks: inspect `AGENTS.md`, root repo state, clean history, `.gitignore`, `labs/`, `projects/`, `docs/`, `learning-paths/`, `tests/`, workflows. Count all canonical files. Hash the `.pkt` files, topology images and preserved original PTL-0001 file into a **local-only** checksum manifest (don't publish private content). Inspect metadata without assuming README frontmatter. Audit existing repo CI, old agent state, baseline link issues. Choose Node LTS/Astro candidate from official current docs. Create `feature/astro-learning-platform` only when safe.

**Deliverables:** `state/BASELINE.md`, state initialized, local branch, brief plan/risks.

**Gate:** existing Python validators/tests green or accurately report baseline blockers, repo assets unchanged, branch clean/safe, counts justified by actual tree, no website files created outside intended scope.
