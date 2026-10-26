# Networking peer-review protocol (independent of docs lint)

## Across all labs
- Device types/models and interface numbering align with Packet Tracer model used.
- Topology port mapping, address plan, CIDR masks, gateway, configuration commands and expected result agree.
- Cisco CLI command modes, interface prompts, `exit`, `end`, `no shutdown`, write/save semantics correct and supported.
- Avoid unsupported interface names (`g0/0` vs `g0/0/0`), mismatched VLAN IDs, default gateway on L2 switch vs routed device confusion.
- Pings and L2/L3 boundaries: each expected reachability has correct VLAN, trunk, addressing and routing; tests distinguish first ARP/ND timeout from a persistent failure.
- Distinguish theoretical IOS features from simulator limitations; cite simulator version if tested.

## IPv4, IPv6 and routing
- Valid host vs subnet/network/broadcast (IPv4), consistent prefixes and no unexpected overlaps.
- IPv6 routers need forwarding enabled (`ipv6 unicast-routing`) where supported/required; L2 switching does not require IPv6 *management* support to pass IPv6 Ethernet frames.
- Static routes point to reachable next hops; default route and connected routes coherent; OSPF area/passive interfaces/neighbors reflect topology.
- If configuring SVI with VLAN 1 on a switch, verify active VLAN/ports and management route.

## Switching and security
- VLAN membership, trunk allowed/native VLAN, DTP decisions, STP assumptions documented.
- EtherChannel member ports must have matching channel settings; distinguish LACP/PAgP/static and verify bundled status.
- Port security requires supported switchport mode/interface; explain sticky MAC learning and violations; unused ports and BPDU Guard choices consistent.
- SSH: match feature support, DNS/domain name, RSA key requirement/strength, `ip ssh version 2` as supported, user secret and VTY `transport input ssh`; call out Type 7 isn't strong password protection.
- DHCP snooping trusted uplinks correct; avoid making customer-facing security promises beyond simulated model.

## Required test cases per completed simulation
1. Build/open using recorded Packet Tracer version.
2. Correctness of device count/model/port links vs documentation.
3. CLI configuration on each device, no critical error messages.
4. `show ip interface brief` / `show ipv6 interface brief` as needed, `show running-config`, route tables and protocol-specific `show` commands.
5. Positive connectivity/traffic checks and at least one designed negative/violation check when applicable.
6. Save, close, reopen the `.pkt` and reproduce behavior. For `.pka`, verify scoring only if activity rights and authorized authoring are confirmed.
7. Store `verification.md` or audit entry with date, version, tester, observed commands and outcome; screenshots optional and must be genuine.

## Simulator unavailable
Use three levels in documentation:
- `Concept reviewed`: theory/syntax cross-checked with manuals.
- `Config not simulator-tested`: commands not yet executed in Packet Tracer.
- `Simulator verified`: actual observed results attached/logged.
Never combine these statuses into a single misleading green check. Source-backed static review does NOT equal simulator QA.
