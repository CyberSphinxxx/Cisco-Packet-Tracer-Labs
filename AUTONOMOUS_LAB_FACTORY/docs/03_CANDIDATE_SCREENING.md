# 03 — Candidate selection and capability gating

For every `next` candidate:
1. Check ID unused and no equivalent learning objective already covered. `metadata.json` is canonical; published docs and the full `labs/` tree are secondary evidence.
2. Honor `prerequisites`: IDs already in the repository are satisfied; queued IDs must be `completed` before a dependent can start. A blocked prerequisite means dependent tasks must wait or be blocked with an explicit reason (do NOT silently change its prerequisites).
3. Compare against available real Packet Tracer device model commands and GUI/MCP support. High-risk items: HSRP, DHCP snooping/DAI, wireless WLAN VLANs, DHCPv6/OSPFv3, complex ACL/DMZ. Do not promise functionality before probing.
4. Write a short `templates/LAB_PLAN.md` equivalent into `state/plans/PTL-XXXX.md` describing objective, differentiation, topology, device interfaces, addressing, 3+ positive probes, 2+ meaningful negatives, CLI support and evidence plan. Cases not meaningful to task should have justified replacements; do not fill quota with fake failures.
5. Decide PROCEED, NARROW (must retain title's honest key objective), or BLOCK. Do not repurpose an ID or alter the task into an unrelated exercise. Up to two substantive design attempts, then block and continue to a separate task.
6. Use source documentation from official Cisco/IETF when accessible, but do not copy protected manuals, full NetAcad exercises, graded tests, `.pka` packages or assessment answer keys. Source URL must really exist, not a guess.

**Security realism:** Only build isolated, educational networks; avoid reproducing attacks on real networks. E.g. DAI may require unsupported emulation. Show feature constraints, never assert protection simply from accepted configuration syntax. **Simulated IP spaces** use RFC 1918, IPv6 2001:db8::/32, and 203.0.113.0/24 as a documented simulated external network, not the real Internet.

**Failure continuation:** A blocked item is a valid output, with device model/version, command and exact error/timeout. Queue moves to next independent item automatically unless total/consecutive block limits trigger a stop.
