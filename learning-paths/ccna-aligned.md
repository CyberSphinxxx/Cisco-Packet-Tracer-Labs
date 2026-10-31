# CCNA-Aligned Topical Study Path

> [!IMPORTANT]
> **Independent Educational Resource Disclaimer:**
> This study path organizes practical Cisco Packet Tracer exercises around broad networking domains common to foundational certifications such as the Cisco Certified Network Associate (CCNA).
> **This repository is not affiliated with, endorsed by, or sponsored by Cisco Systems, Inc.** Completion of these labs does not guarantee certification pass results, nor does this path replace the official Cisco Certification exam blueprints published at [learningnetwork.cisco.com](https://learningnetwork.cisco.com/).

---

## Domain 1: Network Fundamentals

Understanding physical components, cabling, device configuration, and IP addressing concepts.

- **[PTL-0008: Cisco IOS Navigation and Initial Device Configuration](../labs/network-fundamentals/ios-navigation-and-initial-config/README.md)**
  *Topics:* CLI navigation, hostname, MOTD banner, encrypted enable secret, console/VTY password security, saving configs (`write memory`).
- **[PTL-0002: Configuring Cisco Router Interfaces](../labs/ip-addressing/router-interface-configuration/README.md)**
  *Topics:* IPv4 subnetting, IPv6 global unicast (`2001:db8::/32`), IPv6 link-local (`fe80::/10`), interface descriptions.
- **[PTL-0005: Verifying Directly Connected Networks](../labs/ip-addressing/verify-connected-networks/README.md)**
  *Topics:* Interpreting routing table output, comparing directly connected (`C`) and local host interface (`L`) routes.
- **[PTL-0014: Default Gateway Operation and Troubleshooting](../labs/network-fundamentals/default-gateway-troubleshooting/README.md)**
  *Topics:* Default gateway role, host routing decision process, ARP resolution boundary, troubleshooting missing or incorrect gateways.
- **[PTL-0015: IPv4 Subnetting and VLSM Network Design](../labs/ip-addressing/ipv4-subnetting-and-vlsm/README.md)**
  *Topics:* VLSM prefix calculation, host requirements, /30 point-to-point links, avoiding address exhaustion.
- **[PTL-0026: IPv6 SLAAC and Neighbor Discovery](../labs/ip-addressing/ipv6-slaac-and-neighbor-discovery/README.md)**
  *Topics:* Stateless Address Autoconfiguration (SLAAC), ICMPv6 Router Advertisements (RA), EUI-64 interface identifiers, IPv6 neighbor cache resolution.

---

## Domain 2: Network Access (Layer 2 Switching)

Configuring and troubleshooting VLANs, trunks, and link aggregation.

- **[PTL-0016: MAC Address Learning and ARP Operation](../labs/network-fundamentals/mac-learning-and-arp/README.md)**
  *Topics:* Switch MAC address table learning, frame forwarding, unknown unicast flooding, ARP request/reply exchange, table aging.
- **[PTL-0024: CDP Neighbor Discovery and Topology Audit](../labs/network-fundamentals/cdp-neighbor-discovery-and-topology-audit/README.md)**
  *Topics:* Layer 2 neighbor mapping, TLV frame inspection, interface discovery timers, and access port hardening.
- **[PTL-0009: VLAN Segmentation and Access Port Configuration](../labs/switching/vlan-segmentation-and-access-ports/README.md)**
  *Topics:* Access ports, VLAN creation, broadcast isolation, MAC address table behavior.
- **[PTL-0018: Dynamic Trunking Protocol and Native VLAN Security](../labs/network-security/dtp-and-native-vlan-security/README.md)**
  *Topics:* DTP frame negotiation mitigation (`switchport nonegotiate`), Dedicated Native VLAN 999 reassignment, allowed VLAN list pruning.
- **[PTL-0017: Rapid Spanning Tree Protocol, PortFast, and BPDU Guard](../labs/switching/rapid-stp-portfast-bpduguard/README.md)**
  *Topics:* IEEE 802.1w Rapid PVST+ configuration, deterministic root bridge priority, port role election, edge PortFast, and BPDU Guard errdisable defense.
- **[PTL-0006: Configuring Layer 2 EtherChannel with LACP](../labs/switching/etherchannel-lacp/README.md)**
  *Topics:* Link aggregation IEEE 802.3ad LACP, Port-channel logical interfaces, load distribution.
- **[PTL-0007: Cisco Switch Security Hardening Best Practices](../labs/network-security/switch-hardening/README.md)**
  *Topics:* Native VLAN hopping mitigation, disabling DTP (`switchport nonegotiate`), PortFast, BPDU Guard.
- **[PTL-0035: WPA2 Wireless LAN Fundamentals](../labs/wireless-wan/wpa2-wireless-lan-fundamentals/README.md)**
  *Topics:* Autonomous access point deployment, WPA2-Personal (Pre-Shared Key with AES encryption), Cisco IOS DHCP pool configuration, client 802.11 association, and positive/negative security verification.
- **[PTL-0036: Wireless VLAN Separation and Guest Access](../labs/wireless-wan/wireless-vlan-separation-and-guest-access/README.md)**
  *Topics:* Multilayer switch SVIs, corporate vs guest VLAN isolation, multi-pool DHCP, WPA2-PSK security, and Extended ACL guest traffic restriction.

---

## Domain 3: IP Connectivity (Routing)

Inter-VLAN routing, static routes, and dynamic link-state routing.

- **[PTL-0010: Router-on-a-Stick Inter-VLAN Routing](../labs/routing/inter-vlan-routing-router-on-a-stick/README.md)**
  *Topics:* 802.1Q trunking on router subinterfaces, encapsulation dot1Q, default gateway configuration.
- **[PTL-0019: Layer 3 Switch SVIs and Routed Ports](../labs/routing/layer-3-switch-svis-and-routed-ports/README.md)**
  *Topics:* Multilayer switching, hardware CEF inter-VLAN routing, Switch Virtual Interfaces (SVIs), Layer 3 routed ports (`no switchport`), SVI autostate, and default route forwarding.
- **[PTL-0001: Dual-Stack IPv4 and IPv6 Static Routing](../labs/routing/dual-stack-static-routing/README.md)**
  *Topics:* Recursive, next-hop, and directly connected static routes; IPv6 static routes; `ipv6 unicast-routing`.
- **[PTL-0027: IPv6 Static and Default Route Troubleshooting](../labs/routing/ipv6-static-and-default-routing-troubleshooting/README.md)**
  *Topics:* Recursive next-hop routing, default routes (`::/0`), multi-router transit verification, asymmetric return path troubleshooting.
- **[PTL-0028: Floating Static Routes and Administrative Distance](../labs/routing/floating-static-routes-and-administrative-distance/README.md)**
  *Topics:* Administrative distance hierarchy, primary vs. floating backup routes, link failure convergence, preemption upon circuit restoration.
- **[PTL-0011: Single-Area OSPFv2 Configuration and Verification](../labs/routing/single-area-ospfv2/README.md)**
  *Topics:* RFC 2328 OSPF Area 0, router ID election, wildcard masks, point-to-point interface metrics, passive interfaces, neighbor states.
- **[PTL-0029: OSPFv2 DR and BDR Elections](../labs/routing/ospfv2-dr-bdr-elections/README.md)**
  *Topics:* RFC 2328 multi-access broadcast networks, interface priorities (`ip ospf priority`), DR/BDR election hierarchy, DROTHER state, DR failover, non-preemptive election mechanics.
- **[PTL-0030: OSPFv2 Passive Interfaces and Neighbor Control](../labs/routing/ospfv2-passive-interfaces-and-neighbor-control/README.md)**
  *Topics:* OSPF Hello suppression, `passive-interface default`, selective interface enablement (`no passive-interface`), stub network propagation, transit link adjacency protection.
- **[PTL-0031: OSPFv2 Neighbor Adjacency Troubleshooting](../labs/routing/ospfv2-neighbor-adjacency-troubleshooting/README.md)**
  *Topics:* RFC 2328 neighbor adjacency requirements, Hello and Dead timer synchronization, Area ID validation, stub and transit network statement correction, loopback and LAN passive interface placement.
- **[PTL-0032: HSRP First-Hop Gateway Failover](../labs/routing/hsrp-first-hop-gateway-failover/README.md)**
  *Topics:* First Hop Redundancy Protocols (FHRP), Cisco HSRPv2 configuration, virtual IP and MAC operations, priority-driven active/standby elections, preemption, hold timer failover, transparent client default gateway redundancy.
- **[PTL-0034: Single-Area OSPFv3 for IPv6](../labs/routing/single-area-ospfv3-for-ipv6/README.md)**
  *Topics:* OSPFv3 protocol operation, 32-bit dotted-decimal Router IDs, interface-level Area 0 activation, Point-to-Point WAN network types, passive-interface constraints, and end-to-end multi-hop IPv6 reachability.

---

## Domain 4: IP Services

Automated host configuration and IP helper services.

- **[PTL-0012: Configuring Cisco IOS DHCPv4 Server and Relay Agent](../labs/network-services/dhcp-server-and-relay/README.md)**
  *Topics:* Cisco IOS DHCP pool creation, excluded addresses, default router option, DNS server option, and `ip helper-address` forwarding across router boundaries.
- **[PTL-0020: IPv4 Dynamic PAT at the Edge](../labs/network-services/ipv4-dynamic-pat-at-the-edge/README.md)**
  *Topics:* Port Address Translation (NAT Overload), standard ACL matching, inside/outside boundaries, and dynamic translation verification.
- **[PTL-0021: Static NAT and Inside Server Publishing](../labs/network-services/static-nat-and-inside-server-publishing/README.md)**
  *Topics:* One-to-one inside static NAT, public IP publishing, translation table analysis, and host security isolation.
- **[PTL-0022: DNS Records and HTTP Web Services](../labs/network-services/dns-records-and-http-web-services/README.md)**
  *Topics:* Authoritative DNS resolution, A and CNAME record management, HTTP web hosting, and client name lookup.
- **[PTL-0023: NTP and Syslog Network Monitoring](../labs/network-services/ntp-and-syslog-network-monitoring/README.md)**
  *Topics:* Network Time Protocol clock synchronization, millisecond log timestamping, centralized remote Syslog forwarding, and real-time fault notification.
- **[PTL-0025: TFTP Configuration Backup and Restore](../labs/network-services/tftp-configuration-backup-and-restore/README.md)**
  *Topics:* TFTP configuration archiving over UDP port 69, disaster recovery configuration merge, volatile vs persistent storage, and transfer fault handling.
- **[PTL-0033: Stateful DHCPv6 Address Assignment](../labs/network-services/stateful-dhcpv6-address-assignment/README.md)**
  *Topics:* Stateful DHCPv6 configuration on Cisco IOS, ICMPv6 Router Advertisement M and A flag manipulation, client DUID bindings, and dual-router IPv6 packet transport.
- **[PTL-0037: DNS Resolution Failure Troubleshooting](../labs/network-services/dns-resolution-failure-troubleshooting/README.md)**
  *Topics:* Troubleshooting client DNS resolver settings, diagnosing disabled DNS server daemons, populating missing A and CNAME records, and validating resolution via nslookup and ping.
- **[PTL-0043: NAT and PAT Troubleshooting Challenge](../labs/network-services/nat-and-pat-troubleshooting-challenge/README.md)**
  *Topics:* Diagnosing NAT inside/outside interface role misconfigurations, correcting translation ACL subnet mismatches, dynamic PAT overload verification, and translation table inspection.

---

## Domain 5: Security Fundamentals

Device access hardening, port security, and packet filtering.

- **[PTL-0003: Securing Switch Management with SSH](../labs/network-security/secure-switch-ssh/README.md)**
  *Topics:* RSA key generation, SSH version 2, local user credentials, VTY transport input SSH.
- **[PTL-0004: Implementing Switchport Port Security](../labs/network-security/port-security/README.md)**
  *Topics:* Static and sticky MAC address learning, violation modes (`protect`, `restrict`, `shutdown`), and `errdisable recovery`.
- **[PTL-0013: Configuring Standard and Extended IPv4 Access Control Lists](../labs/network-security/standard-and-extended-acls/README.md)**
  *Topics:* Standard ACL source filtering, extended ACL protocol/port filtering, directional placement (`in`/`out`), traffic sequence matching, implicit deny.
- **[PTL-0038: DHCP Snooping and Rogue DHCP Detection](../labs/network-security/dhcp-snooping-and-rogue-dhcp-detection/README.md)**
  *Topics:* Layer 2 DHCP snooping activation, trusted vs untrusted interface boundaries, Option 82 interoperability, DHCP rate limiting, and dynamic binding database inspection.
- **[PTL-0039: Dynamic ARP Inspection and Spoofing Defense](../labs/network-security/dynamic-arp-inspection-and-spoofing-defense/README.md)**
  *Topics:* Dynamic ARP Inspection (DAI) activation, trusted uplink boundaries, ARP rate limiting, multi-attribute validation checks (`src-mac`, `dst-mac`, `ip`), and ARP spoofing mitigation.
- **[PTL-0040: Port Security Violation Troubleshooting](../labs/network-security/port-security-violation-troubleshooting/README.md)**
  *Topics:* Diagnosing sticky MAC conflicts, resolving hardware upgrade outages, error-disabled port recovery sequence, and violation mode alignment.
- **[PTL-0041: IPv4 ACL Troubleshooting with Traffic Matrix](../labs/network-security/ipv4-acl-troubleshooting-with-traffic-matrix/README.md)**
  *Topics:* Diagnosing shadowed access control entries, resolving directional placement conflicts (`in` vs `out`), correcting inverted wildcard masks, and verifying traffic matrices.
- **[PTL-0042: Named Extended IPv4 ACL for Server Access](../labs/network-security/named-extended-ipv4-acl-for-server-access/README.md)**
  *Topics:* Named extended ACL creation, Layer 4 port-specific access control (DNS UDP 53, HTTP TCP 80, HTTPS TCP 443), DMZ perimeter defense, and least privilege enforcement.

---

## Capstone Integration

- **[PTL Capstone: Small Office Multi-VLAN Network Design](../projects/small-office-network/README.md)**
  *Topics:* Multi-domain architectural synthesis combining switching, routing, services, and security.
