# Claude Code: Cisco Packet Tracer Learning Library

This repository is an existing published, clean-history educational library. Follow `AGENTS.md` and all existing `AI_AGENT_GUIDE/` safety rules. The owner has authorized **LOCAL development of a new Astro website under `site/`** by supplying the start prompt. Remote publication, pushing branches, opening PRs, merging, deployment, history rewrite, deleting files or altering protected assets still require explicit approval.

## Required starting read

1. `AGENTS.md` and `README.md`
2. `WEBSITE_AGENT_KIT/START_PROMPT.md`
3. `WEBSITE_AGENT_KIT/11_AGENT_LOOP.md` and `12_ACCEPTANCE_GATES.md`
4. `WEBSITE_AGENT_KIT/state/STATUS.md` and current `phases/` task

## Non-negotiable architecture

- Keep the **same GitHub repository** `CyberSphinxxx/Cisco-Packet-Tracer-Labs`.
- Website source lives in `site/`; root `labs/`, `projects/`, `learning-paths/`, `docs/` remain canonical sources.
- Build all public pages **from existing Markdown and metadata**. Never maintain copied guide Markdown under `site/src/content` or another manually edited catalog.
- Preserve all 14 genuine Packet Tracer starter and completed binaries, topology previews, and the original PTL-0001 historical reference asset.
- Do not alter source lab/configuration content unless necessary to fix a confirmed defect; document and test any such change.
- Respect CC BY-SA 4.0 educational content vs MIT tooling. Do not imply Cisco affiliation.
- Do not copy private archives, proprietary assessments, credentials or agent scratch files into published assets.

## Workflow

- Work on a local feature branch from clean `main`; never force-push/rewrite history.
- Follow `WEBSITE_AGENT_KIT/phases/00...10...` sequentially. Pass gates with observed evidence, not self-asserted success.
- Record progress in `WEBSITE_AGENT_KIT/state/STATUS.md`, `DECISIONS.md`, `EVIDENCE.md`, `BLOCKERS.md` and `HANDOFF.md` after each meaningful unit.
- Use few dependencies, Astro static output, TypeScript, an accessible CSS design system, Pagefind after build. Prefer no React unless justified.
- Keep site builds working on Windows locally and Linux CI/Cloudflare.
- Preserve existing `python tools/validate_repo.py --root .`, `python -m unittest discover -s tests -p "test_*.py" -v`, and `python tools/audit_repo.py`.
- After creating `site/`, also run documented package scripts (`npm ci`, `npm run check`, `npm run test`, `npm run build`, preview/e2e as implemented).
- Never fake test results, screenshots, Lighthouse scores, download verification or deployed URLs.
- At the end, report completed routes, quality gates, remaining blockers, local commit(s), and exact review instructions. Stop before remote operations.

Use `WEBSITE_AGENT_KIT/CONTINUE_PROMPT.md` if the context is compacted or the session restarts.
