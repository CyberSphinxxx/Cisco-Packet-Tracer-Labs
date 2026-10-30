# Lab Index — Cisco Packet Tracer Learning Library

This index catalogs the educational Packet Tracer lab guides available in this repository.

---

## Foundation Guides
- [Getting Started](getting-started.md) — How to use this repository and navigate Packet Tracer.
- [Packet Tracer Installation](installation.md) — Official download and setup instructions.
- [Cisco IOS Cheatsheet](cisco-ios-cheatsheet.md) — Command modes, shortcuts, and core syntax.
- [Troubleshooting Guide](troubleshooting.md) — Layered diagnostic model and common error resolutions.
- [Provenance and Licensing](provenance-and-licensing.md) — Content taxonomy, rights boundaries, and simulation testing standards.
- [Migration Map](migration-map.md) — Mapping from legacy course folders to the topical library.

---

## Active Published and Reviewed Labs

### 1. Network Fundamentals (`network-fundamentals`)
- [PTL-0008: Cisco IOS Navigation and Initial Device Configuration](../labs/network-fundamentals/ios-navigation-and-initial-config/README.md) — CLI modes, shortcuts, password encryption, banners, and NVRAM saving (`reviewed`, `beginner`).
- [PTL-0014: Default Gateway Operation and Troubleshooting](../labs/network-fundamentals/default-gateway-troubleshooting/README.md) — Intra-subnet vs. inter-subnet delivery, host routing decisions, and systematic gateway troubleshooting (`reviewed`, `beginner`).
- [PTL-0016: MAC Address Learning and ARP Operation](../labs/network-fundamentals/mac-learning-and-arp/README.md) — Dynamic switch CAM table learning, ARP cache resolution, unknown unicast flooding, and table aging (`reviewed`, `beginner`).

### 2. IP Addressing (`ip-addressing`)
- [PTL-0002: Configuring Cisco Router Interfaces](../labs/ip-addressing/router-interface-configuration/README.md) — Dual-stack IPv4/IPv6 interface setup on Cisco ISR routers (`reviewed`, `beginner`).
- [PTL-0005: Verifying Directly Connected Networks](../labs/ip-addressing/verify-connected-networks/README.md) — Interpreting routing table `C` and `L` codes and interface states (`reviewed`, `beginner`).
- [PTL-0015: IPv4 Subnetting and VLSM Network Design](../labs/ip-addressing/ipv4-subnetting-and-vlsm/README.md) — Variable length subnet masking (/26, /27, /28, /30), addressing tables, and point-to-point routing (`reviewed`, `beginner`).

### 3. Switching (`switching`)
- [PTL-0009: VLAN Segmentation and Access Port Configuration](../labs/switching/vlan-segmentation-and-access-ports/README.md) — Broadcast domain isolation, access port assignment, and VLAN verification (`reviewed`, `beginner`).
- [PTL-0006: Configuring Layer 2 EtherChannel with LACP](../labs/switching/etherchannel-lacp/README.md) — Link aggregation, IEEE 802.3ad LACP bundling, and trunking over Port-channel interfaces (`reviewed`, `intermediate`).
- [PTL-0017: Rapid Spanning Tree Protocol, PortFast, and BPDU Guard](../labs/switching/rapid-stp-portfast-bpduguard/README.md) — IEEE 802.1w Rapid PVST+ deployment, deterministic root bridge election, port role mapping, edge PortFast, and BPDU Guard protection (`reviewed`, `intermediate`).
- [PTL-0018: Dynamic Trunking Protocol and Native VLAN Security](../labs/switching/dtp-and-native-vlan-security/README.md) — DTP spoofing mitigation with switchport nonegotiate, Native VLAN 99 isolation, and allowed VLAN list pruning (`reviewed`, `intermediate`).
- [PTL-0019: Layer 3 Switch SVIs and Routed Ports](../labs/switching/l3-switch-svi-and-routed-ports/README.md) — Multilayer switching, hardware CEF inter-VLAN routing with SVIs, Layer 3 routed ports (`no switchport`), and default gateway routing (`reviewed`, `intermediate`).

### 4. Routing (`routing`)
- [PTL-0001: Dual-Stack IPv4 and IPv6 Static Routing](../labs/routing/dual-stack-static-routing/README.md) — End-to-end static routing with `ipv6 unicast-routing` across multi-router transit links (`reviewed`, `intermediate`).
- [PTL-0010: Router-on-a-Stick Inter-VLAN Routing](../labs/routing/inter-vlan-routing-router-on-a-stick/README.md) — 802.1Q trunking and subinterface gateway routing between VLANs (`reviewed`, `intermediate`).
- [PTL-0011: Single-Area OSPFv2 Configuration and Verification](../labs/routing/single-area-ospfv2/README.md) — Dynamic link-state routing in Area 0, wildcard masks, router IDs, and passive interfaces (`reviewed`, `intermediate`).

### 5. Network Services (`network-services`)
- [PTL-0012: Configuring Cisco IOS DHCPv4 Server and Relay Agent](../labs/network-services/dhcp-server-and-relay/README.md) — Cisco IOS dynamic address allocation, pool exclusions, and IP helper-address relaying (`reviewed`, `intermediate`).

### 6. Network Security (`network-security`)
- [PTL-0003: Securing Switch Management with SSH](../labs/network-security/secure-switch-ssh/README.md) — SSHv2 configuration, RSA key generation, and Telnet disabling on Catalyst switches (`reviewed`, `intermediate`).
- [PTL-0004: Implementing Switchport Port Security](../labs/network-security/port-security/README.md) — MAC limiting, dynamic sticky learning, violation modes, and err-disable recovery (`reviewed`, `intermediate`).
- [PTL-0007: Cisco Switch Security Hardening Best Practices](../labs/network-security/switch-hardening/README.md) — DTP disabling, blackhole parking-lot VLAN, native VLAN hopping defense, PortFast, and BPDU Guard (`reviewed`, `intermediate`).
- [PTL-0013: Configuring Standard and Extended IPv4 Access Control Lists](../labs/network-security/standard-and-extended-acls/README.md) — Numbered standard and named extended packet filtering with traffic matrices (`reviewed`, `intermediate`).

---

## Comprehensive Capstone Projects

- [PTL Capstone: Small Office Multi-VLAN Network Design](../projects/small-office-network/README.md) — Comprehensive network integration combining VLANs, 802.1Q trunking, Router-on-a-Stick, OSPF routing, DHCP relay, SSH hardening, and ACL perimeter security (`reviewed`, `intermediate`).

---

## Lab Expansion Roadmap
Additional capstone labs (including enterprise multi-area OSPF and WLAN controller topologies) are slated for ongoing expansion per `AI_AGENT_GUIDE/12_CONTENT_ROADMAP.md`.

