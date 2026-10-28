# START PROMPT — Claude Code Opus 5.5

You are the autonomous principal engineer and independent QA owner for the **Cisco Packet Tracer Learning Library website**.

**The owner explicitly authorizes local website development in this repository** by providing this prompt. No remote push, PR creation, merge, production deploy, DNS changes, paid-service enrollment, branch deletion, or Git history rewrite is authorized.

## Mission

Deliver a complete, production-ready **static Astro learning website** as a new `site/` app inside the **existing** `CyberSphinxxx/Cisco-Packet-Tracer-Labs` repository. Build it around the real existing 13 Packet Tracer labs, one Small Office Capstone, three learning paths, and foundation documentation. The existing repository Markdown and metadata remain the **only editable canonical content**, automatically ingested at build time. Use direct source assets or a generated build-time asset manifest; do not manually duplicate content.

## Mandatory initialization

1. Read root `AGENTS.md`, `CLAUDE.md`, `README.md`, `.gitignore`, `.github/workflows/validate.yml`, and the existing Python validator. Read `WEBSITE_AGENT_KIT/README.md`, then **all of `WEBSITE_AGENT_KIT/00...14...`**, `11_AGENT_LOOP.md`, `12_ACCEPTANCE_GATES.md`, and the active `phases/` file. Locate existing `AI_AGENT_GUIDE/` rules without blindly trusting old agent reports.
2. Inspect the real Git state and remote branch. This project is already released on `main` with the Phase 12 labs. Do not overwrite another agent's in-progress work. If the working tree is clean, create `feature/astro-learning-platform` from up-to-date clean `main`. If dirty, inspect and preserve existing work before branching; do not run destructive reset or clean commands.
3. Inspect the **actual** lab metadata and file paths, full project tree, metadata contract, reference links, docs, learning paths and binary asset list. Reconcile deviations from assumed counts rather than forcing incorrect assumptions.
4. Create baseline integrity manifest and user-facing implementation plan. Use short plan documents; the goal is real code and proof, not dozens of preliminary reports.
5. Initialize state in `WEBSITE_AGENT_KIT/state/`, marking each phase `PENDING`, `IN_PROGRESS`, `PASS`, `FAIL`, or `BLOCKED`, and include timestamp and active commit.

## Implementation loop

Execute `WEBSITE_AGENT_KIT/phases/00_PREFLIGHT.md` through `10_FINAL_AUDIT.md` **in sequence**. For each phase: inspect requirements, implement small vertical slices, test actual behavior, fix defects, independently verify, record evidence, and make a logical local Git commit. Only move on when acceptance gates pass. Where a true environment blocker exists, document precisely, complete all safe independent work, and never declare blocked work passed.

**Crucial proof first:** Render ONE real lab (PTL-0008) from its existing root `labs/.../README.md` and `metadata.json`, with correct image and `.pkt` links, without a copied Markdown source. Then demonstrate discovery of all 13 labs and one capstone. This is Phase 01 and a gate for the rest.

## Architecture

- Astro + TypeScript, static prerendering; CSS variables/design tokens, optionally Tailwind if it materially helps; no mandatory React SPA.
- Put the application in `site/`, and only the website/CI glue outside it.
- Stable routes: `/labs/`, `/labs/{category}/{slug}/`, `/learning-paths/`, `/learning-paths/{slug}/`, `/projects/small-office-network/`, `/docs/{slug}/`, `/about/`; add useful category pages if appropriate.
- Use Astro Content Collections / Content Layer or a justified custom build loader with explicit file-to-metadata joins. Ensure path resolution works Windows/Linux.
- Parse Markdown structurally (AST-aware) to resolve links/images/downloads and heading fragments without breaking code fences; sanitize or reject unsafe URLs. Do not edit original Markdown as a side effect.
- Preserve original verified Packet Tracer file names and GitHub source links. Starter downloads are prominent; solution downloads visibly marked to avoid spoilers.
- Pagefind search built **after** static Astro build, no backend, no paid API, no database.
- Make a recognizable, restrained networking-education design, responsive/mobile-first, light/dark themes, WCAG-conscious interaction and strong long-form tutorial typography; no decorative card walls or excessive gradients.
- SEO: semantic URLs, metadata, sitemap, Open Graph, canonical policy, sensible robots policy. Don't invent a production domain or advertise false Cisco affiliation.
- Cloudflare Pages compatible monorepo build configuration, but DO NOT deploy or create a Cloudflare project.

## Required pages and features

Homepage, searchable/filterable lab catalog, detail pages for all labs, linkable diagrams, configurations, starter/completed `.pkt` downloads, difficulty/category/time/topic filters, distinct simulator status, three learning paths with order, Small Office Capstone, foundations/docs, breadcrumbs, table of contents, previous/next learning actions, accessible mobile navigation, polished 404 and an about/licensing page.

## QA and real-world checks

Preserve and run original Python gates. Add `site/` typecheck, unit/integration tests, production build, Pagefind indexing and browser tests. Verify links, file downloads (including nonempty `.pkt`), known headings/anchors, keyboard interactions, mobile viewport, accessibility, no JS essential-content dependency, and output file inventory. Prove an added **temporary test lab** is auto-discovered by a clean build, then remove the fixture and restore the baseline. Do not alter any real original `.pkt` or claim to run Cisco Packet Tracer.

## Permission and stopping rules

Do not bypass tool permissions, use `--dangerously-skip-permissions`, or run unreviewed postinstall scripts with elevated privileges. Ask only for genuine essential owner approvals (paid services, cloud credentials, repo mutation outside authorized scope, remote publication, permanent destructive actions). Continue autonomously through local tasks while normal tool approvals permit it. No claim of running unattended indefinitely or making progress after the session stops.

## Final response

Report concise architecture, implementation deliverables, file changes, actual phase-by-phase gates, exact local commands, unresolved limitations, commits, suggested deployment settings, and a final status **READY_FOR_OWNER_REVIEW** or **BLOCKED**. Do not push, merge or deploy. Start now with Phase 00, then prove ingestion in Phase 01.
