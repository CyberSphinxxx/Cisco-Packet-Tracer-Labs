# Phase 07 — Static search and indexes

**Outcome:** Actually searchable generated content after production build, with accessible UI.

Tasks: install pinned Pagefind tool compatible with chosen environment; run Astro build then Pagefind against `dist`. Add keyboard-accessible search UI/modal/page, section-aware indexing, useful metadata and non-public exclusions. Verify terms `OSPF`, `DHCP relay`, `VLAN`, `IPv6`, `ACL`, `Packet Tracer installation`. Test real links from results. If `astro dev` lacks built index, use honest preview fallback or script; do not claim dev search pass when only production works.

**Gate:** built `dist/pagefind` exists, query smoke tests hit expected lab docs, result navigation works, no agent-state noise or dupes, accessible keyboard interactions.
