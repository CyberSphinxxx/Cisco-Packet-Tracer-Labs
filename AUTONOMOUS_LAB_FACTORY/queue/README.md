# Curriculum candidate backlog — 36 labs (PTL-0020 to PTL-0055)

This JSON file is the machine-readable queue; **do not treat candidate IDs or command plans as simulator-validated**. The agent must compare it against the current repo on every session and use actual device-support probing to proceed.

- 36 proposed lab activities; order is priority order, with dependencies.
- `risk=high` means capabilities might not be modeled in Packet Tracer 9.0.1 (especially HSRP, WLAN VLAN separation, DHCP snooping/DAI, some IPv6 behaviors).
- A candidate can be BLOCKED while later independent labs continue. Keep its reserved ID; never silently repurpose it.
- `slug` is deliberately `-`: choose a unique final slug from the validated lab design before writing `metadata.json`.
- Every completed lab must have differentiated teaching objectives, actual starter work and recorded positive/negative network tests.
- Current `main` already includes PTL-0017 through PTL-0019; these must not be regenerated.
- Certification mapping is broad; do not imply a simulated feature is fully supported merely because Cisco's exam topics mention it.

Read `docs/03_CANDIDATE_SCREENING.md` before claiming a task.
