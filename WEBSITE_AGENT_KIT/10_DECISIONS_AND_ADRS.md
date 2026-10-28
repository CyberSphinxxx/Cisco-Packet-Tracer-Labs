# 10 — Architecture decisions to record

Use short Architecture Decision Records in `WEBSITE_AGENT_KIT/state/DECISIONS.md` or `templates/ADR.md`, with decision, rejected alternatives, consequences and proof. Decisions should be revisited only on new evidence.

Mandatory decisions:

1. Astro version and Node LTS, proven via actual installs and type checks.
2. Directory (`site/`) and monorepo build root strategy.
3. Content loader mapping `README.md` + adjacent metadata JSON without frontmatter.
4. Markdown AST-safe source-link rewrite strategy and URL routing table.
5. `.pkt` delivery strategy (GitHub raw URLs vs copied exact binary assets) for preview and production.
6. Image handling (copied build artifacts vs Astro image pipeline) with alt/caption.
7. How existing learning-path Markdown order is preserved.
8. Search integration Pagefind post-build.
9. CSS framework choice: low-dependency CSS or Tailwind; justify complexity.
10. Test tools and CI parallelization.
11. Cloudflare Pages root/build command and preview SEO behavior.
12. Exact licensing presentation and attribution handling.

When uncertain, implement a small proof and test it rather than choosing from assumptions. No ADR is allowed to override repository preservation or rights policy.
