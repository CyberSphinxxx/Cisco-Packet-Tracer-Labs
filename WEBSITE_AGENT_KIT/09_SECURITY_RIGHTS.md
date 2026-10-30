# 09 — Security, privacy, licensing and agent permissions

## Source and publication boundaries

- Never commit, publish, or deploy legacy student coursework archives, proprietary `.pka` assessment packages, `private_archive`, local MCP servers/bridges, Cisco installers, `.env` secrets, browser profiles, tokens or access credentials.
- Do not ingest or publish `AI_AGENT_GUIDE/state/` by default. Metadata simulator evidence can link to appropriate public GitHub source only when content is suitable for public exposure.
- Markdown may contain raw HTML, URLs and code. Escape or sanitize appropriately; no client-side script execution from Markdown. Enforce path traversal protection and allowlisted file roots.
- Avoid blanket `dangerouslySetInnerHTML` / unsanitized `set:html` on untrusted content. Prefer Astro's compiled Markdown with controlled plugins and explicit safety review.
- External links should use sensible `rel` protections when opened in new tabs.
- User-controlled URL search params must not turn into HTML injection or arbitrary filesystem paths.

## Licensing distinctions

- Existing guides, original topology images and curriculum: CC BY-SA 4.0 under current repo licensing document.
- Tools/code: MIT per existing policy; check how newly authored `site/` code should be scoped. Do not silently relicense other authors or third-party components.
- Third-party npm packages retain their own terms. Audit dependencies and include required licenses/attributions, avoid copying closed-source UI assets.
- Cisco names/trademarks are nominative descriptions, not branding endorsement. Add clear independence statement.
- Binary `.pkt` files are original author-produced project files; don't claim Cisco software itself is open source.

## Agent permission boundaries

Local coding, testing, formatting, previewing, package installation from reviewed sources, and commits to a new local feature branch are in scope subject to Claude Code tool approvals. Explicit owner authorization required for: remote GitHub write, force-push, branch deletion, repo visibility setting, domain/DNS, Pages project deployment, paid accounts, elevated system modifications, wiping directories, re-licensing or source lab modifications with educational significance.

Do not run `--dangerously-skip-permissions` or disable safeguards. Read installer/postinstall scripts when dependency provenance is uncertain; use lockfile. Do not expose localhost dev servers to public network by default. Avoid claiming full security from a static scan; log residual risks.
