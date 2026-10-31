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
| IPv6 SLAAC & Neighbor Discovery | `ip-addressing` | `labs/ip-addressing/ipv6-slaac-and-neighbor-discovery` (`PTL-0026`) | Simulator Verified | Stateless address autoconfiguration, ICMPv6 router advertisements, neighbor cache |
| Default gateway vs static route, multi-router | `routing` | `labs/routing/dual-stack-static-routing` (`PTL-0001`), `PTL-0005` | Simulator Verified | Routing table entries (`C`, `L`), next-hop static routes |
| IPv6 static & default route troubleshooting | `routing` | `labs/routing/ipv6-static-and-default-routing-troubleshooting` (`PTL-0027`) | Simulator Verified | Recursive next-hop routing, default routes (::/0), asymmetric path debugging |
| Floating static routes & administrative distance | `routing` | `labs/routing/floating-static-routes-and-administrative-distance` (`PTL-0028`) | Simulator Verified | Elevated administrative distance, dynamic WAN failover, preemption & recovery |
| OSPFv2 DR and BDR elections | `routing` | `labs/routing/ospfv2-dr-bdr-elections` (`PTL-0029`) | Simulator Verified | Multi-access broadcast networks, interface priorities (0-255), DROTHER, failover & non-preemption |
| OSPFv2 passive interfaces & neighbor control | `routing` | `labs/routing/ospfv2-passive-interfaces-and-neighbor-control` (`PTL-0030`) | Simulator Verified | Hello packet suppression, passive-interface default, stub network advertising, WAN adjacency control |
| OSPFv2 neighbor adjacency troubleshooting | `routing` | `labs/routing/ospfv2-neighbor-adjacency-troubleshooting` (`PTL-0031`) | Simulator Verified | Hello/Dead timer mismatches, Area ID errors, missing network statements, spoke convergence |
| HSRP first-hop gateway failover & redundancy | `routing` | `labs/routing/hsrp-first-hop-gateway-failover` (`PTL-0032`) | Simulator Verified | HSRPv2 priority, preemption, VIP ARP resolution, hold timer failover, gateway recovery |
| Default gateway operation & troubleshooting | `network-fundamentals` | `labs/network-fundamentals/default-gateway-troubleshooting` (`PTL-0014`) | Simulator Verified | Intra vs. inter-subnet delivery, host routing decisions, fault injection |
| MAC address learning & ARP operation | `network-fundamentals` | `labs/network-fundamentals/mac-learning-and-arp` (`PTL-0016`) | Simulator Verified | Switch CAM table learning, ARP cache resolution, unknown unicast flooding |
| CDP neighbor discovery & topology mapping | `network-fundamentals` | `labs/network-fundamentals/cdp-neighbor-discovery-and-topology-audit` (`PTL-0024`) | Simulator Verified | Cisco Discovery Protocol, TLV inspection, topology mapping, edge port hardening |
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
| Single-area OSPFv3 dynamic routing for IPv6 | `routing` | `labs/routing/single-area-ospfv3-for-ipv6` (`PTL-0034`) | Simulator Verified | OSPFv3 Area 0, 32-bit Router IDs, Point-to-Point WAN, passive interfaces |
| DHCP server & relay agent | `network-services` | `labs/network-services/dhcp-server-and-relay` (`PTL-0012`) | Simulator Verified | Cisco IOS DHCP pools, exclusions, helper-address |
| Stateful DHCPv6 address assignment | `network-services` | `labs/network-services/stateful-dhcpv6-address-assignment` (`PTL-0033`) | Simulator Verified | Stateful DHCPv6 server pools, RA managed-config flags, client DUID bindings, routed IPv6 |
| IPv4 Dynamic PAT (NAT Overload) | `network-services` | `labs/network-services/ipv4-dynamic-pat-at-the-edge` (`PTL-0020`) | Simulator Verified | Port Address Translation, standard ACL matching, inside/outside boundaries, concurrent translations |
| IPv4 Static NAT & Server Publishing | `network-services` | `labs/network-services/static-nat-and-inside-server-publishing` (`PTL-0021`) | Simulator Verified | One-to-one inside static NAT, public IP publishing, translation table analysis, host isolation |
| DNS Records & HTTP Web Services | `network-services` | `labs/network-services/dns-records-and-http-web-services` (`PTL-0022`) | Simulator Verified | Authoritative DNS server, A & CNAME records, HTTP portal hosting, client resolver verification |
| NTP & Syslog Network Monitoring | `network-services` | `labs/network-services/ntp-and-syslog-network-monitoring` (`PTL-0023`) | Simulator Verified | Network Time Protocol clock synchronization, millisecond logging timestamps, centralized remote Syslog forwarding |
| TFTP Configuration Backup & Restore | `network-services` | `labs/network-services/tftp-configuration-backup-and-restore` (`PTL-0025`) | Simulator Verified | Centralized TFTP archiving over UDP 69, disaster recovery configuration merge, and timeout/error handling |
| DNS Resolution Failure Troubleshooting | `network-services` | `labs/network-services/dns-resolution-failure-troubleshooting` (`PTL-0037`) | Simulator Verified | Client resolver configuration faults, disabled DNS services, missing A & CNAME records, nslookup diagnosis |
| WPA2 Wireless LAN Fundamentals | `wireless-wan` | `labs/wireless-wan/wpa2-wireless-lan-fundamentals` (`PTL-0035`) | Simulator Verified | Autonomous AP, WPA2-PSK AES encryption, Cisco IOS DHCP pool, authorized vs unauthorized client isolation |
| Wireless VLAN Separation & Guest Access | `wireless-wan` | `labs/wireless-wan/wireless-vlan-separation-and-guest-access` (`PTL-0036`) | Simulator Verified | Catalyst 3560 SVIs, native DHCP pools, guest wireless cell isolation, and Extended ACL traffic filtering |

---

## Tier C: Security & Capstone Projects

| Syllabus Outcome | Target Category | Lab ID / Location | Status | Notes |
|---|---|---|---|---|
| Secure switch management via SSH | `network-security` | `labs/network-security/secure-switch-ssh` (`PTL-0003`) | Simulator Verified | SSHv2, RSA crypto keys, Telnet lockout |
| Port security sticky & violation modes | `network-security` | `labs/network-security/port-security` (`PTL-0004`) | Simulator Verified | Dynamic sticky MACs, err-disable recovery |
| Standard & extended ACLs | `network-security` | `labs/network-security/standard-and-extended-acls` (`PTL-0013`) | Simulator Verified | Packet filtering, placement rules, traffic matrix |
| Comprehensive switch hardening | `network-security` | `labs/network-security/switch-hardening` (`PTL-0007`) | Simulator Verified | Unused ports blackholing, DTP disabling |
| DHCP Snooping & Rogue DHCP Mitigation | `network-security` | `labs/network-security/dhcp-snooping-and-rogue-dhcp-detection` (`PTL-0038`) | Simulator Verified | Layer 2 DHCP snooping, Option 82 handling, trusted uplinks, rate limiting, and binding table verification |
| Dynamic ARP Inspection & Spoofing Defense | `network-security` | `labs/network-security/dynamic-arp-inspection-and-spoofing-defense` (`PTL-0039`) | Simulator Verified | DAI configuration, trusted interfaces, rate limiting, multi-attribute validation checks (src-mac, dst-mac, ip), and legitimate host resolution |
| Port Security Violation Troubleshooting | `network-security` | `labs/network-security/port-security-violation-troubleshooting` (`PTL-0040`) | Simulator Verified | Port security diagnostics, sticky MAC conflict resolution, err-disabled recovery, and violation modes |
| IPv4 ACL Troubleshooting with Traffic Matrix | `network-security` | `labs/network-security/ipv4-acl-troubleshooting-with-traffic-matrix` (`PTL-0041`) | Simulator Verified | ACL troubleshooting, shadowed rule remediation, directional placement, and wildcard mask corrections |
| Capstone multi-VLAN small office | `projects` | `projects/small-office-network/` | Simulator Verified | Integrated multi-VLAN, ROAS, DHCP, Port Security & ACLs |
