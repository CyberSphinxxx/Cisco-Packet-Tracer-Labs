# Simulator verification runbook (requires actual Packet Tracer)

## Environment discovery
Check whether Packet Tracer is installed, executable, supported on current OS, or accessible via an authorized Antigravity MCP/GUI bridge. If unavailable, never pretend to click devices or test. Record `SIMULATOR_UNAVAILABLE` with version unknown.

## Binary workflow
1. Verify permission before opening/redistributing third-party activity files.
2. Start an independently authored blank topology; record version, devices, modules/interfaces and topology graph.
3. Configure against written design and addressing table; run relevant show commands and actual ping/PDU simulation.
4. Observe expected and negative tests, including VLAN, routing, and security behavior as applicable.
5. Save `.pkt`, reopen, rerun tests, compute sha256 and record evidence; for original `.pka` authoring, only use supported official activity wizard when available.
6. Export topology image from application or produce independent schematic; avoid attaching proprietary third-party screenshots unless licensed.
7. Set `status.simulator='tested_pass'` only if tested, else `tested_fail`/`not_tested`. Put evidence in per-lab `verification.md` and report.

## Evidence record fields
`date_utc`, `tester`, `os`, `packet_tracer_version`, `file_path`, `sha256`, `devices_interfaces`, `command_tests`, `packet_tests`, `observed_results`, `known_limitations`, `pass_fail`.

## Misleading patterns to avoid
- README says 'completed.pkt' exists but it doesn't.
- Config pasted into a Markdown code block treated as simulator testing.
- Fabricated terminal output/screenshots or '100% score' from `.pka` without opening it.
- Proprietary Packet Tracer installation bundled in repo.
