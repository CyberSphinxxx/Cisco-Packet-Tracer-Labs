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
- **[PTL-0009: VLAN Segmentation and Access Port Configuration](../labs/switching/vlan-segmentation-and-access-ports/README.md)**
  Creating department VLANs, access mode configuration, static VLAN database management, and collision/broadcast domain isolation.

### 3. Switch Port Hardening and Link Bundling
- **[PTL-0004: Implementing Switchport Port Security](../labs/network-security/port-security/README.md)**
  MAC limiting, sticky MAC learning, violation handling (`protect`, `restrict`, `shutdown`), and `errdisable recovery`.
- **[PTL-0018: Dynamic Trunking Protocol and Native VLAN Security](../labs/network-security/dtp-and-native-vlan-security/README.md)**
  Static 802.1Q trunking, disabling DTP frame negotiation (`switchport nonegotiate`), dedicated Native VLAN 999, and allowed VLAN list pruning.
- **[PTL-0017: Rapid Spanning Tree Protocol, PortFast, and BPDU Guard](../labs/switching/rapid-stp-portfast-bpduguard/README.md)**
  IEEE 802.1w Rapid PVST+ configuration, deterministic root bridge priority, alternate blocking roles, edge PortFast, and BPDU Guard protection.
- **[PTL-0007: Cisco Switch Security Hardening Best Practices](../labs/network-security/switch-hardening/README.md)**
  Disabling DTP (`switchport nonegotiate`), dedicated native VLANs, parking lot blackhole VLAN, PortFast, and BPDU Guard.
- **[PTL-0006: Configuring Layer 2 EtherChannel with LACP](../labs/switching/etherchannel-lacp/README.md)**
  Multi-link bundling using IEEE 802.3ad LACP, Port-channel logical interfaces, and trunking over aggregated links.

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

### 5. Inter-VLAN and Static Routing
- **[PTL-0010: Router-on-a-Stick Inter-VLAN Routing](../labs/routing/inter-vlan-routing-router-on-a-stick/README.md)**
  802.1Q subinterface routing (`g0/0/0.10`), default gateway assignment, and cross-VLAN packet delivery.
- **[PTL-0019: Layer 3 Switch SVIs and Routed Ports](../labs/routing/layer-3-switch-svis-and-routed-ports/README.md)**
  Multilayer switching, hardware CEF routing, Switch Virtual Interfaces (SVIs), SVI autostate, routed ports (`no switchport`), and default gateway routing.
- **[PTL-0001: Dual-Stack IPv4 and IPv6 Static Routing](../labs/routing/dual-stack-static-routing/README.md)**
  Recursive and next-hop static routes, `ipv6 unicast-routing`, default static routes (`0.0.0.0/0` and `::/0`).

### 6. Dynamic Routing and Infrastructure Services
- **[PTL-0011: Single-Area OSPFv2 Configuration and Verification](../labs/routing/single-area-ospfv2/README.md)**
  OSPF Area 0, router IDs, wildcard masks, passive interfaces on LAN segments, cost calculation, and neighbor states.
- **[PTL-0012: Configuring Cisco IOS DHCPv4 Server and Relay Agent](../labs/network-services/dhcp-server-and-relay/README.md)**
  Centralized IOS DHCP server, address exclusion pools, lease options, and `ip helper-address` forwarding across subnets.

### 7. Traffic Filtering and Access Control
- **[PTL-0013: Configuring Standard and Extended IPv4 Access Control Lists](../labs/network-security/standard-and-extended-acls/README.md)**
  Standard ACLs near the destination, extended ACLs near the source, TCP/UDP port filtering, ICMP control, and implicit deny.

---

## Term Capstone Integration Project

- **[PTL Capstone: Small Office Multi-VLAN Network Design](../projects/small-office-network/README.md)**
  A complete synthesis project simulating a real-world multi-department corporate branch network integrating all competencies covered across both terms.
