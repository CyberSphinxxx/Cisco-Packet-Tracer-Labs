# BSIT Networking Curriculum Learning Path

This comprehensive curriculum track is tailored for Bachelor of Science in Information Technology (BSIT) students taking undergraduate networking courses (Networking 1: Fundamentals & Switching, and Networking 2: Routing & Network Security).

It organizes hands-on lab activities by academic competency, preparing students for university lab exams, practical evaluations, and capstone implementations.

---

## Term 1: Local Area Networks and Switching (Networking 1)

Focuses on Layer 2 switching architectures, virtual LANs, switch management security, and link aggregation.

### 1. Initial Device Hardening and Management
- **[PTL-0008: Cisco IOS Navigation and Initial Device Configuration](../labs/network-fundamentals/ios-navigation-and-initial-config/README.md)**
  Command modes, banner MOTD, encrypted enable secret, console/VTY timeouts, synchronous logging, and NVRAM persistence.
- **[PTL-0003: Securing Switch Management with SSH](../labs/network-security/secure-switch-ssh/README.md)**
  Configuring domain name, 2048-bit RSA keys, local user authentication, SSHv2 enforcement, and disabling plaintext Telnet.

### 2. VLANs and Broadcast Containment
- **[PTL-0016: MAC Address Learning and ARP Operation](../labs/network-fundamentals/mac-learning-and-arp/README.md)**
  Switch CAM table population, frame forwarding rules, ARP broadcast/unicast exchange, and dynamic table aging.
- **[PTL-0024: CDP Neighbor Discovery and Topology Audit](../labs/network-fundamentals/cdp-neighbor-discovery-and-topology-audit/README.md)**
  Layer 2 discovery protocol mechanics, neighbor topology reconstruction, TLV inspection, and edge switchport hardening.
- **[PTL-0009: VLAN Segmentation and Access Port Configuration](../labs/switching/vlan-segmentation-and-access-ports/README.md)**
  Creating department VLANs, access mode configuration, static VLAN database management, and collision/broadcast domain isolation.

### 3. Switch Port Hardening and Link Bundling
- **[PTL-0004: Implementing Switchport Port Security](../labs/network-security/port-security/README.md)**
  MAC limiting, sticky MAC learning, violation handling (`protect`, `restrict`, `shutdown`), and `errdisable recovery`.
- **[PTL-0018: Dynamic Trunking Protocol and Native VLAN Security](../labs/network-security/dtp-and-native-vlan-security/README.md)**
  Static 802.1Q trunking, disabling DTP frame negotiation (`switchport nonegotiate`), dedicated Native VLAN 999, and allowed VLAN list pruning.
- **[PTL-0044: VLAN Trunk Allowed-List Troubleshooting](../labs/switching/vlan-trunk-allowed-list-troubleshooting/README.md)**
  Diagnosing trunk allowed-list omissions, non-destructive allowed list remediation using `add`, Native VLAN alignment, and cross-switch broadcast isolation.
- **[PTL-0017: Rapid Spanning Tree Protocol, PortFast, and BPDU Guard](../labs/switching/rapid-stp-portfast-bpduguard/README.md)**
  IEEE 802.1w Rapid PVST+ configuration, deterministic root bridge priority, alternate blocking roles, edge PortFast, and BPDU Guard protection.
- **[PTL-0045: Spanning Tree Root and Blocked-Port Investigation](../labs/switching/spanning-tree-root-and-blocked-port-investigation/README.md)**
  Investigating unexpected access root bridge takeovers, root path cost calculation, primary/secondary priority alignment, and core trunk unblocking.
- **[PTL-0007: Cisco Switch Security Hardening Best Practices](../labs/network-security/switch-hardening/README.md)**
  Disabling DTP (`switchport nonegotiate`), dedicated native VLANs, parking lot blackhole VLAN, PortFast, and BPDU Guard.
- **[PTL-0006: Configuring Layer 2 EtherChannel with LACP](../labs/switching/etherchannel-lacp/README.md)**
  Multi-link bundling using IEEE 802.3ad LACP, Port-channel logical interfaces, and trunking over aggregated links.
- **[PTL-0046: LACP EtherChannel Member Mismatch Diagnosis](../labs/switching/lacp-etherchannel-member-mismatch-diagnosis/README.md)**
  Diagnosing LACP member interface parameter mismatches, resolving suspended member ports, and verifying trunk link aggregation.

---

## Term 2: Routing Protocols, Services, and Perimeter Defense (Networking 2)

Focuses on Layer 3 routing mechanisms, inter-VLAN routing, dynamic OSPF routing, automatic IP addressing, and packet filtering.

### 4. Router Interfaces and Connected Subnets
- **[PTL-0015: IPv4 Subnetting and VLSM Network Design](../labs/ip-addressing/ipv4-subnetting-and-vlsm/README.md)**
  VLSM subnet calculations, prefix allocation (/26, /28, /30), and multi-site WAN point-to-point addressing.
- **[PTL-0002: Configuring Cisco Router Interfaces](../labs/ip-addressing/router-interface-configuration/README.md)**
  IPv4 subnetting, dual-stack IPv6 interface configuration, link-local addresses, and loopback verification.
- **[PTL-0005: Verifying Directly Connected Networks](../labs/ip-addressing/verify-connected-networks/README.md)**
  Routing table interpretation, directly connected `C` routes, and local host `L` (/32 and /128) route verification.
- **[PTL-0014: Default Gateway Operation and Troubleshooting](../labs/network-fundamentals/default-gateway-troubleshooting/README.md)**
  Host routing decisions, ARP resolution boundaries, and systematic troubleshooting of missing and misconfigured gateways.
- **[PTL-0026: IPv6 SLAAC and Neighbor Discovery](../labs/ip-addressing/ipv6-slaac-and-neighbor-discovery/README.md)**
  Stateless address autoconfiguration, ICMPv6 router advertisements, host prefix derivation, and neighbor discovery table audit.

### 5. Inter-VLAN and Static Routing
- **[PTL-0010: Router-on-a-Stick Inter-VLAN Routing](../labs/routing/inter-vlan-routing-router-on-a-stick/README.md)**
  802.1Q subinterface routing (`g0/0/0.10`), default gateway assignment, and cross-VLAN packet delivery.
- **[PTL-0019: Layer 3 Switch SVIs and Routed Ports](../labs/routing/layer-3-switch-svis-and-routed-ports/README.md)**
  Multilayer switching, hardware CEF routing, Switch Virtual Interfaces (SVIs), SVI autostate, routed ports (`no switchport`), and default gateway routing.
- **[PTL-0001: Dual-Stack IPv4 and IPv6 Static Routing](../labs/routing/dual-stack-static-routing/README.md)**
  Recursive and next-hop static routes, `ipv6 unicast-routing`, default static routes (`0.0.0.0/0` and `::/0`).
- **[PTL-0027: IPv6 Static and Default Route Troubleshooting](../labs/routing/ipv6-static-and-default-routing-troubleshooting/README.md)**
  Recursive next-hop routing, default routes (`::/0`), multi-router transit verification, asymmetric return path troubleshooting.
- **[PTL-0028: Floating Static Routes and Administrative Distance](../labs/routing/floating-static-routes-and-administrative-distance/README.md)**
  Administrative distance hierarchy, primary vs. floating backup routes, link failure convergence, preemption upon circuit restoration.

### 6. Dynamic Routing and Infrastructure Services
- **[PTL-0011: Single-Area OSPFv2 Configuration and Verification](../labs/routing/single-area-ospfv2/README.md)**
  OSPF Area 0, router IDs, wildcard masks, passive interfaces on LAN segments, cost calculation, and neighbor states.
- **[PTL-0029: OSPFv2 DR and BDR Elections](../labs/routing/ospfv2-dr-bdr-elections/README.md)**
  Multi-access broadcast OSPF networks, interface priority configuration (`ip ospf priority`), DR/BDR election hierarchy, DROTHER state, failover and non-preemption.
- **[PTL-0030: OSPFv2 Passive Interfaces and Neighbor Control](../labs/routing/ospfv2-passive-interfaces-and-neighbor-control/README.md)**
  OSPF Hello suppression, `passive-interface default` with selective interface activation, stub network propagation, and transit link hardening.
- **[PTL-0031: OSPFv2 Neighbor Adjacency Troubleshooting](../labs/routing/ospfv2-neighbor-adjacency-troubleshooting/README.md)**
  Diagnosing Hello/Dead timer mismatches, resolving Area ID conflicts, fixing missing network statements, and verifying full multi-router SPF convergence.
- **[PTL-0032: HSRP First-Hop Gateway Failover](../labs/routing/hsrp-first-hop-gateway-failover/README.md)**
  Configuring HSRPv2 priority, preemption, and virtual IP addresses across dual edge routers to provide high-availability default gateway services and transparent failover.
- **[PTL-0034: Single-Area OSPFv3 for IPv6](../labs/routing/single-area-ospfv3-for-ipv6/README.md)**
  Configuring single-area OSPFv3 for IPv6, setting 32-bit Router IDs, activating interface Area 0, optimizing point-to-point transit links, and verifying full multi-router IPv6 convergence.
- **[PTL-0012: Configuring Cisco IOS DHCPv4 Server and Relay Agent](../labs/network-services/dhcp-server-and-relay/README.md)**
  Centralized IOS DHCP server, address exclusion pools, lease options, and `ip helper-address` forwarding across subnets.
- **[PTL-0020: IPv4 Dynamic PAT at the Edge](../labs/network-services/ipv4-dynamic-pat-at-the-edge/README.md)**
  Port Address Translation (NAT Overload), standard ACL interesting traffic classification, inside/outside boundaries, and translation table inspection.
- **[PTL-0021: Static NAT and Inside Server Publishing](../labs/network-services/static-nat-and-inside-server-publishing/README.md)**
  One-to-one inside static NAT, public IP publishing, translation table analysis, and host security isolation.
- **[PTL-0022: DNS Records and HTTP Web Services](../labs/network-services/dns-records-and-http-web-services/README.md)**
  Authoritative DNS resolution, A and CNAME resource record management, HTTP web portal delivery, and client name lookup.
- **[PTL-0023: NTP and Syslog Network Monitoring](../labs/network-services/ntp-and-syslog-network-monitoring/README.md)**
  Network Time Protocol clock synchronization, millisecond log timestamping, centralized remote Syslog forwarding, and event correlation.
- **[PTL-0025: TFTP Configuration Backup and Restore](../labs/network-services/tftp-configuration-backup-and-restore/README.md)**
  Centralized configuration archiving over UDP port 69, simulated disaster alteration, complete state restoration, and failure diagnostic handling.
- **[PTL-0033: Stateful DHCPv6 Address Assignment](../labs/network-services/stateful-dhcpv6-address-assignment/README.md)**
  Cisco IOS Stateful DHCPv6 server pools, ICMPv6 Router Advertisement Managed-config flags, client DUID lease tracking, and end-to-end IPv6 routing.
- **[PTL-0037: DNS Resolution Failure Troubleshooting](../labs/network-services/dns-resolution-failure-troubleshooting/README.md)**
  Diagnosing and remediating client resolver address misconfigurations, disabled DNS daemon services, and missing A/CNAME resource records across routed enterprise subnets.
- **[PTL-0043: NAT and PAT Troubleshooting Challenge](../labs/network-services/nat-and-pat-troubleshooting-challenge/README.md)**
  Diagnosing NAT inside/outside interface role errors, fixing translation ACL subnet mismatches, restoring dynamic PAT overload, and verifying translation tables.
- **[PTL-0035: WPA2 Wireless LAN Fundamentals](../labs/wireless-wan/wpa2-wireless-lan-fundamentals/README.md)**
  Autonomous 802.11 access point integration, WPA2-Personal (Pre-Shared Key with AES encryption), Cisco IOS DHCP pool allocation, and authorized client verification.
- **[PTL-0036: Wireless VLAN Separation and Guest Access](../labs/wireless-wan/wireless-vlan-separation-and-guest-access/README.md)**
  Multilayer switch SVIs, corporate vs guest VLAN isolation, multi-pool DHCP, WPA2-PSK security, and Extended ACL guest traffic restriction.

### 7. Traffic Filtering and Access Control
- **[PTL-0013: Configuring Standard and Extended IPv4 Access Control Lists](../labs/network-security/standard-and-extended-acls/README.md)**
  Standard ACLs near the destination, extended ACLs near the source, TCP/UDP port filtering, ICMP control, and implicit deny.
- **[PTL-0038: DHCP Snooping and Rogue DHCP Detection](../labs/network-security/dhcp-snooping-and-rogue-dhcp-detection/README.md)**
  Cisco IOS DHCP snooping implementation, Option 82 configuration, trusted uplink definition, untrusted port rate limiting, and rogue DHCP mitigation.
- **[PTL-0039: Dynamic ARP Inspection and Spoofing Defense](../labs/network-security/dynamic-arp-inspection-and-spoofing-defense/README.md)**
  Dynamic ARP Inspection (DAI) deployment, trusted uplink definition, untrusted interface rate limiting, multi-attribute validation checks (`src-mac`, `dst-mac`, `ip`), and ARP spoofing mitigation.
- **[PTL-0040: Port Security Violation Troubleshooting](../labs/network-security/port-security-violation-troubleshooting/README.md)**
  Switchport port security troubleshooting, sticky MAC conflict resolution, administrative recovery of error-disabled ports, and violation mode auditing.
- **[PTL-0041: IPv4 ACL Troubleshooting with Traffic Matrix](../labs/network-security/ipv4-acl-troubleshooting-with-traffic-matrix/README.md)**
  Traffic matrix validation, shadowed access list entry remediation, directional placement auditing, and wildcard mask calculation corrections.
- **[PTL-0042: Named Extended IPv4 ACL for Server Access](../labs/network-security/named-extended-ipv4-acl-for-server-access/README.md)**
  Named extended ACL configuration, server farm perimeter defense, port-level DNS/HTTP filtering, and internal network segmentation.

---

## Term Capstone Integration Project

- **[PTL Capstone: Small Office Multi-VLAN Network Design](../projects/small-office-network/README.md)**
  A complete synthesis project simulating a real-world multi-department corporate branch network integrating all competencies covered across both terms.
