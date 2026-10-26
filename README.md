# Cisco Packet Tracer Learning Library

An open, comprehensive, beginner-friendly Cisco Packet Tracer laboratory curriculum and reference library designed for Bachelor of Science in Information Technology (BSIT) students and independent networking learners.

---

## 🚀 Quick Navigation

| Resource | Purpose | Direct Link |
|---|---|---|
| **Getting Started** | Packet Tracer UI, cabling rules, mode switching | [docs/getting-started.md](docs/getting-started.md) |
| **Software Setup** | Official installation and NetAcad access | [docs/installation.md](docs/installation.md) |
| **IOS Cheatsheet** | Command modes, shortcuts, and core syntax | [docs/cisco-ios-cheatsheet.md](docs/cisco-ios-cheatsheet.md) |
| **Troubleshooting Guide** | Layered OSI diagnostic framework & common fixes | [docs/troubleshooting.md](docs/troubleshooting.md) |
| **Master Lab Index** | Complete searchable catalog of all lab guides | [docs/lab-index.md](docs/lab-index.md) |
| **Curriculum Coverage** | CCNA/BSIT topic mapping & release status | [docs/coverage-matrix.md](docs/coverage-matrix.md) |
| **Migration Map** | Mapping from legacy folders to modern library | [docs/migration-map.md](docs/migration-map.md) |
| **Provenance & Rights** | Content classification, copyright boundaries & QA | [docs/provenance-and-licensing.md](docs/provenance-and-licensing.md) |

---

## 🎯 Curated Learning Paths

Choose a structured sequence tailored to your learning goals:

1. **[Beginner Networking Path](learning-paths/networking-beginner.md)**
   *For newcomers with zero prior CLI experience.* Progresses step-by-step from workspace setup and cable selection to basic IOS commands, IP interface addressing, and switchport access VLANs.
2. **[BSIT Networking Degree Track](learning-paths/bsit-networking.md)**
   *Aligned with university undergraduate networking curricula.* Spans Term 1 (LAN switching, 802.1Q trunks, port security, switch hardening, EtherChannel) and Term 2 (router interfaces, Router-on-a-Stick, static routing, OSPF dynamic routing, DHCP relay, ACLs, and capstone design).
3. **[CCNA-Aligned Topical Study Path](learning-paths/ccna-aligned.md)**
   *Organized around foundational certification domains.* Focuses on Network Fundamentals, Network Access, IP Connectivity, IP Services, and Security Fundamentals.

---

## 📚 Active Lab Catalog

All lab guides follow a rigorous **11-section standard** (Objectives, Prerequisites, Topology, Addressing Table, Tasks, Step-by-Step Walkthrough, Verification, Troubleshooting, Key Takeaways, References, and Validation Status).

### 1. Network Fundamentals (`network-fundamentals`)
- **[PTL-0008: Cisco IOS Navigation and Initial Device Configuration](labs/network-fundamentals/ios-navigation-and-initial-config/README.md)**
  EXEC modes, context-sensitive help (`?`), tab-completion, hostnames, MOTD banners, SHA-256 encrypted passwords, line security, and saving to NVRAM (`reviewed`, Beginner).

### 2. IP Addressing (`ip-addressing`)
- **[PTL-0002: Configuring Cisco Router Interfaces](labs/ip-addressing/router-interface-configuration/README.md)**
  Dual-stack IPv4/IPv6 interface addressing on Cisco ISR routers, link-local addresses, and loopback verification (`reviewed`, Beginner).
- **[PTL-0005: Verifying Directly Connected Networks](labs/ip-addressing/verify-connected-networks/README.md)**
  Interpreting routing table codes, distinguishing connected (`C`) and local host interface (`L`) routes, and interface status codes (`reviewed`, Beginner).

### 3. Switching (`switching`)
- **[PTL-0009: VLAN Segmentation and Access Port Configuration](labs/switching/vlan-segmentation-and-access-ports/README.md)**
  Broadcast domain containment, creating and naming VLANs, access port assignment, and MAC address table inspection (`reviewed`, Beginner).
- **[PTL-0006: Configuring Layer 2 EtherChannel with LACP](labs/switching/etherchannel-lacp/README.md)**
  IEEE 802.3ad Link Aggregation Control Protocol (LACP), bundling physical switch interfaces into Port-channel logical trunks (`reviewed`, Intermediate).

### 4. Routing (`routing`)
- **[PTL-0001: Dual-Stack IPv4 and IPv6 Static Routing](labs/routing/dual-stack-static-routing/README.md)**
  Directly connected, recursive, and next-hop static routes, default routes (`0.0.0.0/0` and `::/0`), and mandatory `ipv6 unicast-routing` (`reviewed`, Intermediate).
- **[PTL-0010: Router-on-a-Stick Inter-VLAN Routing](labs/routing/inter-vlan-routing-router-on-a-stick/README.md)**
  Subinterface routing on router GigabitEthernet ports, 802.1Q encapsulation (`encapsulation dot1Q`), and inter-subnet gateway routing (`reviewed`, Intermediate).
- **[PTL-0011: Single-Area OSPFv2 Configuration and Verification](labs/routing/single-area-ospfv2/README.md)**
  RFC 2328 OSPF Area 0, 32-bit router IDs, inverse wildcard masks, passive interfaces on LAN segments, interface costs, and neighbor adjacency states (`reviewed`, Intermediate).

### 5. Network Services (`network-services`)
- **[PTL-0012: Configuring Cisco IOS DHCPv4 Server and Relay Agent](labs/network-services/dhcp-server-and-relay/README.md)**
  Centralized router DHCP server, address exclusion pools, option delivery (gateway, DNS, domain), and `ip helper-address` UDP broadcast forwarding (`reviewed`, Intermediate).

### 6. Network Security (`network-security`)
- **[PTL-0003: Securing Switch Management with SSH](labs/network-security/secure-switch-ssh/README.md)**
  Deploying SSHv2 on Catalyst switches, 2048-bit RSA key generation, local authentication, and disabling plaintext Telnet (`reviewed`, Intermediate).
- **[PTL-0004: Implementing Switchport Port Security](labs/network-security/port-security/README.md)**
  Restricting MAC addresses per port, static vs sticky learning, violation modes (`protect`, `restrict`, `shutdown`), and `errdisable` recovery (`reviewed`, Intermediate).
- **[PTL-0007: Cisco Switch Security Hardening Best Practices](labs/network-security/switch-hardening/README.md)**
  Mitigating VLAN hopping, disabling DTP (`switchport nonegotiate`), dedicated native VLANs, unused port blackholing, STP PortFast, and BPDU Guard (`reviewed`, Intermediate).
- **[PTL-0013: Configuring Standard and Extended IPv4 Access Control Lists](labs/network-security/standard-and-extended-acls/README.md)**
  Numbered standard ACLs placed near the destination, extended ACLs placed near the source, TCP/UDP port filtering, ICMP filtering, and implicit deny handling (`reviewed`, Intermediate).

---

## 🏗️ Capstone Integration Project

- **[PTL Capstone: Small Office Multi-VLAN Network Design](projects/small-office-network/README.md)**
  A complete branch office design guide integrating VLANs, 802.1Q trunking, Router-on-a-Stick, OSPF routing, DHCP relay, SSH switch management, port security, and ACL perimeter protection into a single unified topology (`reviewed`, Intermediate).

---

## 🔬 Quality and Simulation Verification Standard

To uphold the highest academic integrity, this repository maintains an explicit policy regarding simulation verification:
- **`documentation: reviewed`**: All syntax, commands, topology specifications, and diagnostic procedures are reviewed against official Cisco IOS documentation and IETF RFC standards.
- **`simulator: not_tested`**: In headless continuous integration or command-line environments without a running Packet Tracer GUI, labs are accurately marked `not_tested`.
- **Zero Fabrication Guarantee**: We never fabricate Packet Tracer `.pkt` binaries, simulated outputs, or test results. Contributed binary topologies require documented physical execution traces before receiving `tested_pass` status.

---

## 🛡️ Intellectual Property, Provenance, and Quarantine

- **Original Educational Content**: All tutorials in `labs/`, `projects/`, and `docs/` are 100% original, clean-room educational works authored independently.
- **Legacy Third-Party Quarantine**: Historical coursework packages (`.pka`), backup archives (`.bak`), and exam assignments located in `2ndYear_Networking1/` and `3rdYear_Networking2/` are proprietary third-party files. They are strictly quarantined in their legacy directories for archival provenance and are **never republished or distributed under `labs/`**.
- **Trademarks**: Cisco, Cisco IOS, Cisco Packet Tracer, and Cisco Networking Academy are trademarks of Cisco Systems, Inc. This project is an independent educational effort and is not affiliated with, sponsored by, or endorsed by Cisco Systems, Inc.

---

## 🤝 Contributing

We welcome contributions of original lab guides, technical bug fixes, and documentation improvements!
- Review [CONTRIBUTING.md](CONTRIBUTING.md) for lab authoring standards and validation requirements.
- Adhere to our [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
- Report technical errors or security concerns via [SECURITY.md](SECURITY.md).
- Original educational guides are licensed under **CC-BY-SA-4.0** and automation tools under the **MIT License**. See [LICENSE](LICENSE) for details.

Before opening a pull request, ensure all tests pass:
```bash
python tools/validate_repo.py --root .
python -m unittest discover -s tests -p "test_*.py" -v
```
