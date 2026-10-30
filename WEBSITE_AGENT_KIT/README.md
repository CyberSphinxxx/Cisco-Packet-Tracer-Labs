# Cisco Packet Tracer Learning Library: Claude Code Website Agent Kit

**Purpose:** Build a complete Astro-based learning site inside the existing public GitHub repository `CyberSphinxxx/Cisco-Packet-Tracer-Labs` without copying canonical Markdown or modifying Packet Tracer `.pkt` files.

## Quick start (Windows)

1. Open your **clean, current** clone of `https://github.com/CyberSphinxxx/Cisco-Packet-Tracer-Labs` and check `git status`; back up or commit unrelated work first.
2. Extract this ZIP **into the repository root**, merging directories. It adds `CLAUDE.md`, `.claude/skills/website-build/`, and `WEBSITE_AGENT_KIT/`. If a `CLAUDE.md` already exists, **review and merge**, never overwrite blindly.
3. Open Claude Code from the repository root. Choose `claude-opus-5-5` (`claude --model claude-opus-5-5` in the CLI) and High effort if available in your interface.
4. Paste the **single starting prompt** from `WEBSITE_AGENT_KIT/START_PROMPT.md` (also copied separately next to this ZIP).
5. Claude should create a new feature branch and implement/test the site locally, preserving progress in `WEBSITE_AGENT_KIT/state/`.

**Do not extract into `site/`**; this kit expects to sit beside `labs/`, `projects/`, `docs/` and `learning-paths/`.

## Desired outcome

- One repository and one canonical Markdown source.
- Astro static site under `site/` with 13 lab pages, 1 capstone, 3 learning paths, and existing reference documentation.
- Starter and completed `.pkt` downloads, images, configuration guides, and cross-page navigation all work.
- Category/topic/difficulty filters, static search, polished responsive UX, accessibility and SEO readiness.
- Python CI gates preserved; reproducible Node build; deployment instructions for Cloudflare Pages.
- **No remote push, PR, merge, deployment, domain changes, or bypass of tool permissions without explicit owner approval.**

## Kit structure

- `CLAUDE.md`: short persistent rules read by Claude Code every session.
- `.claude/skills/website-build/SKILL.md`: reusable task skill that points to phase plans.
- `WEBSITE_AGENT_KIT/README.md`: setup instructions, kit overview and verified docs.
- `WEBSITE_AGENT_KIT/START_PROMPT.md`: the only initial message you need to paste.
- `WEBSITE_AGENT_KIT/CONTINUE_PROMPT.md`: recover context after interruption.
- `WEBSITE_AGENT_KIT/REVIEW_PROMPT.md`: independent release audit.
- `WEBSITE_AGENT_KIT/00...14...md`: technical, product, UX, QA, safety and operations contracts.
- `WEBSITE_AGENT_KIT/phases/`: 11 gated phases (00–10), real implementation rather than plan-only outputs.
- `WEBSITE_AGENT_KIT/state/`: lightweight persistent ledgers (updated by the coding agent).
- `WEBSITE_AGENT_KIT/templates/`: ADR, phase report and test matrix formats.

## Important scope note

This ZIP is an **agent instruction package**, not an already-built Astro website. The Claude Code agent builds the website in your working clone, following this kit. Its outputs must be verified on your machine and GitHub before release.

## Verified documentation consulted in preparation

- Astro Content Loader API: https://docs.astro.build/en/reference/content-loader-reference/
- Astro Markdown: https://docs.astro.build/en/guides/markdown-content/
- Cloudflare Pages monorepos: https://developers.cloudflare.com/pages/configuration/monorepos/
- Cloudflare Pages build configuration: https://developers.cloudflare.com/pages/configuration/build-configuration/
- Pagefind static search: https://pagefind.app/docs/
- Claude Code project instructions & skills: https://code.claude.com/docs/en/features-overview
