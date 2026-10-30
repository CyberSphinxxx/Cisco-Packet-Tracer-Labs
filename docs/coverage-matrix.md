# Curriculum Coverage Matrix

This matrix tracks the coverage of networking competencies outlined in the content roadmap (`AI_AGENT_GUIDE/12_CONTENT_ROADMAP.md`).

## Status Taxonomy
- **Covered (Reviewed):** Canonical lab guide authored, evaluated against the 12-section rubric (>=18/20), statically verified against official Cisco documentation.
- **Simulator Verified:** Executed and validated in a physical Packet Tracer environment with recorded evidence.
- **Deferred (Simulator Blocked):** Binary `.pkt` authoring deferred until Packet Tracer execution runtime is available.
- **Roadmap Expansion:** Planned for subsequent expansion phases.

---

## Tier A: Essential Beginner Series

| Syllabus Outcome | Target Category | Lab ID / Location | Status | Notes |
|---|---|---|---|---|
| Packet Tracer installation & GUI overview | Documentation | `docs/installation.md`, `docs/getting-started.md` | Covered | Official download instructions & interface walkthrough |
| Physical cabling & interface mapping | `network-fundamentals` | `labs/ip-addressing/router-interface-configuration` (`PTL-0002`) | Simulator Verified | Cable types, interface status (up/up), descriptions |
| IOS modes, help & saving startup configuration | `network-fundamentals` | `labs/network-fundamentals/ios-navigation-and-initial-config` (`PTL-0008`) | Simulator Verified | CLI mode hierarchy, context-sensitive help, memory copy |
| Basic hostname, console, secret, banners, passwords | `network-fundamentals` | `labs/network-fundamentals/ios-navigation-and-initial-config` (`PTL-0008`) | Simulator Verified | Initial switch & router device baseline |
| IPv4 addressing, masks, gateway, local ping | `ip-addressing` | `labs/ip-addressing/router-interface-configuration` (`PTL-0002`) | Simulator Verified | Dual-stack host & gateway configuration |
| IPv4 subnetting & VLSM network design | `ip-addressing` | `labs/ip-addressing/ipv4-subnetting-and-vlsm` (`PTL-0015`) | Simulator Verified | /26, /28, /30 VLSM design, host ranges, route overlap rejection |
| Basic IPv6, link-local & gateway | `ip-addressing` | `labs/ip-addressing/router-interface-configuration` (`PTL-0002`), `PTL-0001` | Simulator Verified | Global unicast & shared `fe80::1` link-local |
| Default gateway vs static route, multi-router | `routing` | `labs/routing/dual-stack-static-routing` (`PTL-0001`), `PTL-0005` | Simulator Verified | Routing table entries (`C`, `L`), next-hop static routes |
| Default gateway operation & troubleshooting | `network-fundamentals` | `labs/network-fundamentals/default-gateway-troubleshooting` (`PTL-0014`) | Simulator Verified | Intra vs. inter-subnet delivery, host routing decisions, fault injection |
| MAC address learning & ARP operation | `network-fundamentals` | `labs/network-fundamentals/mac-learning-and-arp` (`PTL-0016`) | Simulator Verified | Switch CAM table learning, ARP cache resolution, unknown unicast flooding |
| Basic switch management & end-host setup | `network-security` | `labs/network-security/secure-switch-ssh` (`PTL-0003`) | Simulator Verified | Switch SVI, gateway, and secure management |

---

## Tier B: Switching and Routing

| Syllabus Outcome | Target Category | Lab ID / Location | Status | Notes |
|---|---|---|---|---|
| VLAN creation & access ports | `switching` | `labs/switching/vlan-segmentation-and-access-ports` (`PTL-0009`) | Simulator Verified | Local broadcast domains, access switchports |
| 802.1Q trunk, native VLAN & allowed VLANs | `network-security` | `labs/network-security/dtp-and-native-vlan-security` (`PTL-0018`), `PTL-0007` | Simulator Verified | DTP nonegotiate, Native VLAN 999, allowed list pruning |
| Rapid STP (RSTP), PortFast & BPDU Guard | `switching` | `labs/switching/rapid-stp-portfast-bpduguard` (`PTL-0017`), `PTL-0007` | Simulator Verified | Rapid PVST+, root bridge election, edge port acceleration, BPDU Guard |
| Multilayer Switching, SVIs & Routed Ports | `routing` | `labs/routing/layer-3-switch-svis-and-routed-ports` (`PTL-0019`) | Simulator Verified | Hardware CEF inter-VLAN routing, SVIs, routed ports (no switchport), default gateway |
| Router-on-a-stick inter-VLAN routing | `routing` | `labs/routing/inter-vlan-routing-router-on-a-stick` (`PTL-0010`) | Simulator Verified | Subinterface dot1q encapsulation |
| EtherChannel LACP & troubleshooting | `switching` | `labs/switching/etherchannel-lacp` (`PTL-0006`) | Simulator Verified | IEEE 802.3ad link bundling and flag verification |
| Static & default routes (IPv4 & IPv6) | `routing` | `labs/routing/dual-stack-static-routing` (`PTL-0001`) | Simulator Verified | Symmetrical dual-stack routing |
| Single-area OSPFv2 dynamic routing | `routing` | `labs/routing/single-area-ospfv2` (`PTL-0011`) | Simulator Verified | Wildcard masks, router-id, passive interfaces |
| DHCP server & relay agent | `network-services` | `labs/network-services/dhcp-server-and-relay` (`PTL-0012`) | Simulator Verified | Cisco IOS DHCP pools, exclusions, helper-address |

---

## Tier C: Security & Capstone Projects

| Syllabus Outcome | Target Category | Lab ID / Location | Status | Notes |
|---|---|---|---|---|
| Secure switch management via SSH | `network-security` | `labs/network-security/secure-switch-ssh` (`PTL-0003`) | Simulator Verified | SSHv2, RSA crypto keys, Telnet lockout |
| Port security sticky & violation modes | `network-security` | `labs/network-security/port-security` (`PTL-0004`) | Simulator Verified | Dynamic sticky MACs, err-disable recovery |
| Standard & extended ACLs | `network-security` | `labs/network-security/standard-and-extended-acls` (`PTL-0013`) | Simulator Verified | Packet filtering, placement rules, traffic matrix |
| Comprehensive switch hardening | `network-security` | `labs/network-security/switch-hardening` (`PTL-0007`) | Simulator Verified | Unused ports blackholing, DTP disabling |
| Capstone multi-VLAN small office | `projects` | `projects/small-office-network/` | Simulator Verified | Integrated multi-VLAN, ROAS, DHCP, Port Security & ACLs |
