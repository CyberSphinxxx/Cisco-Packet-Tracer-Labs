# Ingestion proof (Phases 01-02)

**Date:** 2026-10-28 (Linux workspace, Node 22.23.4). Values below were dumped from `loadRepository()` against the real repository and cross-checked by `scripts/check-dist.mjs` on the built output. No Markdown or metadata is copied into `site/` (asserted by `tests/unit/ingestion.test.ts`).

## Source -> route mapping (representative)

| Item | Canonical source | Route / URL | Notes |
|---|---|---|---|
| PTL-0008 | `labs/network-fundamentals/ios-navigation-and-initial-config/README.md` + `metadata.json` | `/labs/network-fundamentals/ios-navigation-and-initial-config/` | 11 h2 sections in source order; topology 773x591; starter 44,426 B; config `S1.txt`; verification -> `/labs/.../verification/` |
| PTL-0001 | `labs/routing/dual-stack-static-routing/README.md` + `metadata.json` | `/labs/routing/dual-stack-static-routing/` | 4 configs; historical `dual-stack-static-routing.pkt` linked from README is published at `/labs/routing/dual-stack-static-routing/dual-stack-static-routing.pkt` (64,145 B, SHA-256 `8d7f62a8...680b31`, unchanged) |
| PTL-0012 | `labs/network-services/dhcp-server-and-relay/README.md` + `metadata.json` | `/labs/network-services/dhcp-server-and-relay/` | 4 configs (R1, R2, S1, S2) |
| Capstone | `projects/small-office-network/README.md` (no metadata.json) | `/projects/small-office-network/` | starter/completed/topology by folder convention; verification page; README links 8 labs (PTL-0009, 0007, 0004, 0010, 0011, 0012, 0003, 0013) |
| Paths | `learning-paths/{networking-beginner,bsit-networking,ccna-aligned}.md` | `/learning-paths/{slug}/` | Order from root README; steps extracted in source order: 8, 14, 14 |
| Docs | `docs/*.md` (8) | `/docs/{slug}/` | all 8 published (ADR-003) |
| Agent evidence | `AI_AGENT_GUIDE/state/PTL-XXXX-SIMULATOR-RESULTS.md` | `https://github.com/CyberSphinxxx/Cisco-Packet-Tracer-Labs/blob/<ref>/AI_AGENT_GUIDE/state/...` | never copied into `dist/` |

**Counts discovered:** 13 labs, 1 project, 3 learning paths, 8 docs, 73 published files (14 starter + 14 completed + 14 topology + 1 historical `.pkt` + 30 config files: 27 lab + 3 capstone).

## Automated proof

| Test | What it proves | Result |
|---|---|---|
| `tests/unit/ingestion.test.ts` (7) | folder-path join for all 13 labs; PTL-0008 headings/links/images/downloads/hash; capstone, paths, docs; 43 baseline hashes; determinism; no copied content in `site/` | PASS |
| `tests/unit/markdown.test.ts` (11) | AST-only rewriting (code fences untouched), script/iframe/onerror neutralized, `<br>` kept, GitHub ids incl. duplicates, CRLF = LF output, figures, callouts | PASS |
| `tests/unit/repository.test.ts` (27) | auto-discovery and removal, metadata change reflected, path steps, draft exclusion, base path; failures for duplicate id/slug, folder mismatch, bad JSON/schema/enum, missing/empty `.pkt`, non-PNG topology, restricted, missing evidence, broken link, broken fragment (same + cross doc), traversal, `javascript:`/`data:`/`vbscript:`/`file:`/protocol-relative, links into `scratch/` and `Downloads/`, `.pka`, non-image images; GitHub links for LICENSE/agent files; source ref pinning; percent-encoding; CRLF checkout; no backslashes | PASS |
| `tests/integration/build-discovery.test.ts` (1) | real `astro build` CLI on a temp copy: temporary lab `PTL-9999` appears with route and exact `.pkt` bytes, then disappears after folder removal | PASS |
| `npm run verify:dist` | every canonical source has a page; 680 internal links + 445 fragments resolve; 39 lab downloads/topologies byte-identical to source and baseline; no forbidden files | PASS (and fails 12/12 injected defects, see EVIDENCE E-016) |
