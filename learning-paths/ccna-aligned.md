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

---

## Domain 2: Network Access (Layer 2 Switching)

Configuring and troubleshooting VLANs, trunks, and link aggregation.

- **[PTL-0009: VLAN Segmentation and Access Port Configuration](../labs/switching/vlan-segmentation-and-access-ports/README.md)**
  *Topics:* Access ports, VLAN creation, broadcast isolation, MAC address table behavior.
- **[PTL-0006: Configuring Layer 2 EtherChannel with LACP](../labs/switching/etherchannel-lacp/README.md)**
  *Topics:* Link aggregation IEEE 802.3ad LACP, Port-channel logical interfaces, load distribution.
- **[PTL-0007: Cisco Switch Security Hardening Best Practices](../labs/network-security/switch-hardening/README.md)**
  *Topics:* Native VLAN hopping mitigation, disabling DTP (`switchport nonegotiate`), PortFast, BPDU Guard.

---

## Domain 3: IP Connectivity (Routing)

Inter-VLAN routing, static routes, and dynamic link-state routing.

- **[PTL-0010: Router-on-a-Stick Inter-VLAN Routing](../labs/routing/inter-vlan-routing-router-on-a-stick/README.md)**
  *Topics:* 802.1Q trunking on router subinterfaces, encapsulation dot1Q, default gateway configuration.
- **[PTL-0001: Dual-Stack IPv4 and IPv6 Static Routing](../labs/routing/dual-stack-static-routing/README.md)**
  *Topics:* Recursive, next-hop, and directly connected static routes; IPv6 static routes; `ipv6 unicast-routing`.
- **[PTL-0011: Single-Area OSPFv2 Configuration and Verification](../labs/routing/single-area-ospfv2/README.md)**
  *Topics:* RFC 2328 OSPF Area 0, router ID election, wildcard masks, point-to-point interface metrics, passive interfaces, neighbor states.

---

## Domain 4: IP Services

Automated host configuration and IP helper services.

- **[PTL-0012: Configuring Cisco IOS DHCPv4 Server and Relay Agent](../labs/network-services/dhcp-server-and-relay/README.md)**
  *Topics:* Cisco IOS DHCP pool creation, excluded addresses, default router option, DNS server option, and `ip helper-address` forwarding across router boundaries.

---

## Domain 5: Security Fundamentals

Device access hardening, port security, and packet filtering.

- **[PTL-0003: Securing Switch Management with SSH](../labs/network-security/secure-switch-ssh/README.md)**
  *Topics:* RSA key generation, SSH version 2, local user credentials, VTY transport input SSH.
- **[PTL-0004: Implementing Switchport Port Security](../labs/network-security/port-security/README.md)**
  *Topics:* Static and sticky MAC address learning, violation modes (`protect`, `restrict`, `shutdown`), and `errdisable recovery`.
- **[PTL-0013: Configuring Standard and Extended IPv4 Access Control Lists](../labs/network-security/standard-and-extended-acls/README.md)**
  *Topics:* Standard ACL source filtering, extended ACL protocol/port filtering, directional placement (`in`/`out`), traffic sequence matching, implicit deny.

---

## Capstone Integration

- **[PTL Capstone: Small Office Multi-VLAN Network Design](../projects/small-office-network/README.md)**
  *Topics:* Multi-domain architectural synthesis combining switching, routing, services, and security.
