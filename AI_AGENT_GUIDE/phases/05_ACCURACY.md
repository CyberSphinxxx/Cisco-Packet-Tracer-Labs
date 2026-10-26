# PHASE 05 — Independent networking correctness audit

## Goal
Find and fix technical mistakes before broad discoverability.

## Actions
1. Use `08_NETWORK_TECHNICAL_QA.md` and assign independent reviewer role/subagent if available. Recheck **every** currently publishable lab, not just a single flagship example.
2. Inspect three known legacy defects: IPv6-forwarding myth for L2 switch; invalid IPv6 `ip default-gateway`; misleading modern interpretation of RSA-1024/Type7 SSH lab. Confirm exact mode, version and replacement semantics.
3. Cross-validate all addressing tables, interface nomenclature, VLAN/trunk membership, routing next hops, port-security interactions. Probe every expected ping outcome logically.
4. Explicitly label command outputs as observed vs illustrative. Where Packet Tracer available, run manual or instrumented tests and attach evidence. When not, label as `not_tested` and include runnable test procedure.
5. Review accessibility of guides (headings, image alternatives, readable tables/code), plain language and links; avoid cosmetic rewrites hiding fundamental mistakes.
6. Write `state/reports/TECHNICAL_AUDIT.md` with findings by severity, lines, dispositions and remaining simulation blockers.

## Acceptance and proof
- [ ] No unresolved known critical/high technical errors in published guides.
- [ ] Independent review performed; exact document coverage logged.
- [ ] IPv4 and IPv6 behavior correct; no fabricated test assertions.
- [ ] Every published guide has a credible verification procedure.
- [ ] Any simulator not available is recorded, not called PASS.
