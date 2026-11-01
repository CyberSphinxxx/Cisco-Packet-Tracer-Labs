# Lab Index — itnetworking

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
- [PTL-0024: CDP Neighbor Discovery and Topology Audit](../labs/network-fundamentals/cdp-neighbor-discovery-and-topology-audit/README.md) — Layer 2 discovery protocol mechanics, neighbor mapping, TLV inspection, and edge port hardening (`reviewed`, `beginner`).

### 2. IP Addressing (`ip-addressing`)
- [PTL-0002: Configuring Cisco Router Interfaces](../labs/ip-addressing/router-interface-configuration/README.md) — Dual-stack IPv4/IPv6 interface setup on Cisco ISR routers (`reviewed`, `beginner`).
- [PTL-0005: Verifying Directly Connected Networks](../labs/ip-addressing/verify-connected-networks/README.md) — Interpreting routing table `C` and `L` codes and interface states (`reviewed`, `beginner`).
- [PTL-0015: IPv4 Subnetting and VLSM Network Design](../labs/ip-addressing/ipv4-subnetting-and-vlsm/README.md) — Variable length subnet masking (/26, /27, /28, /30), addressing tables, and point-to-point routing (`reviewed`, `beginner`).
- [PTL-0047: VLSM Address Plan Fault Investigation](../labs/ip-addressing/vlsm-address-plan-fault-investigation/README.md) — Variable Length Subnet Masking audit, broadcast host assignment remediation, gateway capacity deficit resolution, and transit prefix optimization (`reviewed`, `intermediate`).
- [PTL-0026: IPv6 SLAAC and Neighbor Discovery](../labs/ip-addressing/ipv6-slaac-and-neighbor-discovery/README.md) — Stateless address autoconfiguration, ICMPv6 router advertisements, host prefix derivation, and neighbor discovery table audit (`reviewed`, `intermediate`).

### 3. Switching (`switching`)
- [PTL-0009: VLAN Segmentation and Access Port Configuration](../labs/switching/vlan-segmentation-and-access-ports/README.md) — Broadcast domain isolation, access port assignment, and VLAN verification (`reviewed`, `beginner`).
- [PTL-0006: Configuring Layer 2 EtherChannel with LACP](../labs/switching/etherchannel-lacp/README.md) — Link aggregation, IEEE 802.3ad LACP bundling, and trunking over Port-channel interfaces (`reviewed`, `intermediate`).
- [PTL-0017: Rapid Spanning Tree Protocol, PortFast, and BPDU Guard](../labs/switching/rapid-stp-portfast-bpduguard/README.md) — IEEE 802.1w Rapid PVST+ deployment, deterministic root bridge election, port role mapping, edge PortFast, and BPDU Guard protection (`reviewed`, `intermediate`).
- [PTL-0044: VLAN Trunk Allowed-List Troubleshooting](../labs/switching/vlan-trunk-allowed-list-troubleshooting/README.md) — Multi-VLAN trunk pruning diagnosis, allowed list remediation with add modifier, and Native VLAN alignment (`reviewed`, `intermediate`).
- [PTL-0045: Spanning Tree Root and Blocked-Port Investigation](../labs/switching/spanning-tree-root-and-blocked-port-investigation/README.md) — Spanning tree root inversion diagnosis, deterministic bridge priority calculation, and core transit link unblocking (`reviewed`, `intermediate`).
- [PTL-0046: LACP EtherChannel Member Mismatch Diagnosis](../labs/switching/lacp-etherchannel-member-mismatch-diagnosis/README.md) — Link aggregation member parameter mismatch diagnosis, port suspension resolution, and multi-VLAN trunk aggregation (`reviewed`, `intermediate`).
- [PTL-0049: Campus Distribution and Access VLAN Design](../labs/switching/campus-distribution-and-access-vlan-design/README.md) — Multilayer campus distribution switching, 802.1Q trunking, SVI inter-VLAN routing, and end-to-end multi-VLAN service reachability (`reviewed`, `advanced`).

### 4. Routing (`routing`)
- [PTL-0001: Dual-Stack IPv4 and IPv6 Static Routing](../labs/routing/dual-stack-static-routing/README.md) — End-to-end static routing with `ipv6 unicast-routing` across multi-router transit links (`reviewed`, `intermediate`).
- [PTL-0010: Router-on-a-Stick Inter-VLAN Routing](../labs/routing/inter-vlan-routing-router-on-a-stick/README.md) — 802.1Q trunking and subinterface gateway routing between VLANs (`reviewed`, `intermediate`).
- [PTL-0011: Single-Area OSPFv2 Configuration and Verification](../labs/routing/single-area-ospfv2/README.md) — Dynamic link-state routing in Area 0, wildcard masks, router IDs, and passive interfaces (`reviewed`, `intermediate`).
- [PTL-0019: Layer 3 Switch SVIs and Routed Ports](../labs/routing/layer-3-switch-svis-and-routed-ports/README.md) — Multilayer switching, hardware CEF inter-VLAN routing with SVIs, Layer 3 routed ports (`no switchport`), and default gateway routing (`reviewed`, `intermediate`).
- [PTL-0027: IPv6 Static and Default Route Troubleshooting](../labs/routing/ipv6-static-and-default-routing-troubleshooting/README.md) — Recursive and fully specified static routing, default routes (::/0), next-hop debugging, and return path validation across a multi-router topology (`reviewed`, `intermediate`).
- [PTL-0028: Floating Static Routes and Administrative Distance](../labs/routing/floating-static-routes-and-administrative-distance/README.md) — Primary and backup route configuration with elevated administrative distance, dynamic link failover, and automatic preemption (`reviewed`, `intermediate`).
- [PTL-0048: Multi-Site Routing with Branch Networks](../labs/routing/multi-site-routing-with-branch-networks/README.md) — Hub-and-spoke multi-site static routing, spoke default gateway egress, recursive next-hop debugging, and symmetric return route configuration (`reviewed`, `intermediate`).
- [PTL-0029: OSPFv2 DR and BDR Elections](../labs/routing/ospfv2-dr-bdr-elections/README.md) — Multi-access broadcast OSPF networks, interface priority configuration, DR/BDR election hierarchy, failover, and non-preemption (`reviewed`, `intermediate`).
- [PTL-0030: OSPFv2 Passive Interfaces and Neighbor Control](../labs/routing/ospfv2-passive-interfaces-and-neighbor-control/README.md) — OSPF Hello suppression on access LANs, selective and default passive configuration, stub network advertisement, and transit neighbor control (`reviewed`, `intermediate`).
- [PTL-0031: OSPFv2 Neighbor Adjacency Troubleshooting](../labs/routing/ospfv2-neighbor-adjacency-troubleshooting/README.md) — Diagnosis and remediation of OSPF Hello/Dead timer mismatches, Area ID errors, missing network statements, and passive interface placement (`reviewed`, `intermediate`).
- [PTL-0032: HSRP First-Hop Gateway Failover](../labs/routing/hsrp-first-hop-gateway-failover/README.md) — Configuration and verification of Cisco Hot Standby Router Protocol (HSRPv2) priority, preemption, VIP ARP resolution, and deliberate gateway failover (`reviewed`, `advanced`).
- [PTL-0034: Single-Area OSPFv3 for IPv6](../labs/routing/single-area-ospfv3-for-ipv6/README.md) — Single-area OSPFv3 for IPv6 configuration, 32-bit Router IDs, point-to-point transit networks, passive interfaces, and multi-hop route propagation (`reviewed`, `advanced`).

### 5. Network Services (`network-services`)
- [PTL-0012: Configuring Cisco IOS DHCPv4 Server and Relay Agent](../labs/network-services/dhcp-server-and-relay/README.md) — Cisco IOS dynamic address allocation, pool exclusions, and IP helper-address relaying (`reviewed`, `intermediate`).
- [PTL-0020: IPv4 Dynamic PAT at the Edge](../labs/network-services/ipv4-dynamic-pat-at-the-edge/README.md) — Port Address Translation (NAT Overload), standard ACL matching, inside/outside boundaries, and dynamic translation verification (`reviewed`, `intermediate`).
- [PTL-0021: Static NAT and Inside Server Publishing](../labs/network-services/static-nat-and-inside-server-publishing/README.md) — One-to-one inside static NAT, public IP publishing, translation table analysis, and host security isolation (`reviewed`, `intermediate`).
- [PTL-0022: DNS Records and HTTP Web Services](../labs/network-services/dns-records-and-http-web-services/README.md) — Authoritative DNS server, A and CNAME records, HTTP portal hosting, and client name resolution (`reviewed`, `beginner`).
- [PTL-0023: NTP and Syslog Network Monitoring](../labs/network-services/ntp-and-syslog-network-monitoring/README.md) — Network Time Protocol (NTP) clock synchronization, millisecond log timestamping, centralized remote Syslog forwarding, and real-time fault notification (`reviewed`, `intermediate`).
- [PTL-0025: TFTP Configuration Backup and Restore](../labs/network-services/tftp-configuration-backup-and-restore/README.md) — Centralized configuration archiving over UDP port 69, simulated disaster alteration, and complete state restoration (`reviewed`, `intermediate`).
- [PTL-0033: Stateful DHCPv6 Address Assignment](../labs/network-services/stateful-dhcpv6-address-assignment/README.md) — Cisco IOS Stateful DHCPv6 server pools, ICMPv6 Router Advertisement Managed-config flags, client DUID lease tracking, and end-to-end IPv6 routing (`reviewed`, `advanced`).
- [PTL-0037: DNS Resolution Failure Troubleshooting](../labs/network-services/dns-resolution-failure-troubleshooting/README.md) — Diagnosis and remediation of client resolver misconfigurations, disabled DNS services, and missing A/CNAME records across routed subnets (`reviewed`, `beginner`).
- [PTL-0043: NAT and PAT Troubleshooting Challenge](../labs/network-services/nat-and-pat-troubleshooting-challenge/README.md) — Diagnosis and remediation of NAT inside/outside interface errors, translation ACL mismatches, and dynamic PAT overload verification (`reviewed`, `intermediate`).

### 6. Network Security (`network-security`)
- [PTL-0003: Securing Switch Management with SSH](../labs/network-security/secure-switch-ssh/README.md) — SSHv2 configuration, RSA key generation, and Telnet disabling on Catalyst switches (`reviewed`, `intermediate`).
- [PTL-0004: Implementing Switchport Port Security](../labs/network-security/port-security/README.md) — MAC limiting, dynamic sticky learning, violation modes, and err-disable recovery (`reviewed`, `intermediate`).
- [PTL-0007: Cisco Switch Security Hardening Best Practices](../labs/network-security/switch-hardening/README.md) — DTP disabling, blackhole parking-lot VLAN, native VLAN hopping defense, PortFast, and BPDU Guard (`reviewed`, `intermediate`).
- [PTL-0013: Configuring Standard and Extended IPv4 Access Control Lists](../labs/network-security/standard-and-extended-acls/README.md) — Numbered standard and named extended packet filtering with traffic matrices (`reviewed`, `intermediate`).
- [PTL-0018: Dynamic Trunking Protocol and Native VLAN Security](../labs/network-security/dtp-and-native-vlan-security/README.md) — DTP negotiation analysis, switchport nonegotiate, Native VLAN 999 isolation, and allowed VLAN pruning (`reviewed`, `intermediate`).
- [PTL-0038: DHCP Snooping and Rogue DHCP Detection](../labs/network-security/dhcp-snooping-and-rogue-dhcp-detection/README.md) — Layer 2 DHCP snooping configuration, Option 82 handling, trusted/untrusted port boundaries, rate limiting, and rogue DHCP containment (`reviewed`, `advanced`).
- [PTL-0039: Dynamic ARP Inspection and Spoofing Defense](../labs/network-security/dynamic-arp-inspection-and-spoofing-defense/README.md) — Dynamic ARP Inspection (DAI) deployment, trusted uplink boundaries, rate limiting, multi-attribute validation checks (src-mac, dst-mac, ip), and ARP spoofing defense (`reviewed`, `advanced`).
- [PTL-0040: Port Security Violation Troubleshooting](../labs/network-security/port-security-violation-troubleshooting/README.md) — Port security troubleshooting, stale sticky MAC conflict resolution, err-disabled administrative recovery without disabling security, and violation mode alignment (`reviewed`, `intermediate`).
- [PTL-0041: IPv4 ACL Troubleshooting with Traffic Matrix](../labs/network-security/ipv4-acl-troubleshooting-with-traffic-matrix/README.md) — IPv4 ACL troubleshooting, shadowed rule remediation, directional application corrections, and wildcard mask auditing across routed departmental subnets (`reviewed`, `intermediate`).
- [PTL-0042: Named Extended IPv4 ACL for Server Access](../labs/network-security/named-extended-ipv4-acl-for-server-access/README.md) — Named extended ACLs, DMZ server farm perimeter security, DNS and HTTP/HTTPS access control, and least privilege traffic filtering (`reviewed`, `intermediate`).

### 7. Wireless and WAN Technologies (`wireless-wan`)
- [PTL-0035: WPA2 Wireless LAN Fundamentals](../labs/wireless-wan/wpa2-wireless-lan-fundamentals/README.md) — Autonomous access point deployment, WPA2-Personal (Pre-Shared Key with AES encryption), Cisco IOS DHCP services, and client association verification (`reviewed`, `beginner`).
- [PTL-0036: Wireless VLAN Separation and Guest Access](../labs/wireless-wan/wireless-vlan-separation-and-guest-access/README.md) — Multilayer switch SVIs, corporate vs guest VLAN isolation, multi-pool DHCP, WPA2-PSK security, and Extended ACL traffic restriction (`reviewed`, `intermediate`).

---

## Comprehensive Capstone Projects

- [PTL Capstone: Small Office Multi-VLAN Network Design](../projects/small-office-network/README.md) — Comprehensive network integration combining VLANs, 802.1Q trunking, Router-on-a-Stick, OSPF routing, DHCP relay, SSH hardening, and ACL perimeter security (`reviewed`, `intermediate`).

---

## Lab Expansion Roadmap
Additional capstone labs (including enterprise multi-area OSPF and WLAN controller topologies) are slated for ongoing expansion per `AI_AGENT_GUIDE/12_CONTENT_ROADMAP.md`.

