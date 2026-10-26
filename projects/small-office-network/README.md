# Capstone Project: Small Office Multi-VLAN Network Design

> **Project Level:** Capstone / Comprehensive · **Target Audience:** BSIT Networking Students & CCNA Candidates · **Status:** Design Guide Reviewed

## 1. Executive Summary & Scenario
Modern small-to-medium business (SMB) networks require high availability, logical departmental isolation, automated IP host addressing, and hardened Layer 2/Layer 3 boundaries. This capstone project challenges students to integrate the modular networking competencies mastered across the library into an end-to-end small office branch network.

### The Business Scenario
**Apex Innovations** is opening a new branch office housing three operational groups:
1. **Management (VLAN 10):** IT administrators and branch managers requiring secure access to network infrastructure and servers.
2. **Staff (VLAN 20):** General office workers requiring access to internal file servers and the Internet.
3. **Guest / Visitors (VLAN 30):** Temporary visitors and vendor devices requiring outbound Internet connectivity while being strictly blocked from accessing internal staff and management systems.

The branch utilizes a centralized Cisco ISR 4321 router (`R1`) and a Cisco Catalyst 2960 access switch (`S1`), connecting to the corporate headquarters via a routed WAN link.

---

## 2. Integrated Architecture & Topology

```text
                                  [HQ / ISP Router]
                                         │ (WAN Transit: 209.165.200.224/30)
                                         ▼
                                  [Branch Router R1]
                                         │ Gi0/0/0 (802.1Q Trunk carrying VLANs 10, 20, 30)
                                         ▼
                                 [Branch Switch S1]
       ┌─────────────────────────────────┼─────────────────────────────────┐
       ▼                                 ▼                                 ▼
   [Fa0/1 - 5]                       [Fa0/6 - 15]                     [Fa0/16 - 24]
    VLAN 10                           VLAN 20                           VLAN 30
   Management Staff                  General Staff                      Guest Wi-Fi
 (192.168.10.0/24)                 (192.168.20.0/24)                 (192.168.30.0/24)
```

---

## 3. Addressing & VLAN Allocation Matrix

| VLAN ID | Name | IPv4 Network Prefix | Usable Host Range | Default Gateway (R1 Subinterface) | IP Assignment Method |
|---|---|---|---|---|---|
| **VLAN 10** | `Management` | `192.168.10.0/24` | `192.168.10.11 - 192.168.10.254` | `192.168.10.1` (`Gi0/0/0.10`) | Static Addressing |
| **VLAN 20** | `Staff_Data` | `192.168.20.0/24` | `192.168.20.11 - 192.168.20.254` | `192.168.20.1` (`Gi0/0/0.20`) | Dynamic (Cisco IOS DHCP) |
| **VLAN 30** | `Guest_Access`| `192.168.30.0/24` | `192.168.30.11 - 192.168.30.254` | `192.168.30.1` (`Gi0/0/0.30`) | Dynamic (Cisco IOS DHCP) |
| **VLAN 99** | `Parking_Lot` | N/A (Unrouted) | N/A | N/A | Unused Ports Quarantined |
| **VLAN 999**| `Native_Trunk`| N/A (Unrouted) | N/A | N/A | 802.1Q Native VLAN Tag |
| **WAN Link**| `Point-to-Point` | `209.165.200.224/30` | `209.165.200.225 - 226` | N/A (Peer: `.226`) | Static Infrastructure IP |

---

## 4. Technical Specifications & Modular Prerequisite Mapping

To complete this capstone successfully, review the relevant modular lab guides:

### A. Layer 2 Switch Hardening & VLAN Segmentation
- **VLAN Isolation:** Implement distinct departmental VLANs to partition broadcast domains ([PTL-0009](../../labs/switching/vlan-segmentation-and-access-ports/README.md)).
- **Trunking & Native VLAN Security:** Configure an 802.1Q trunk between S1 Gi0/1 and R1 Gi0/0/0, disable DTP negotiation with `switchport nonegotiate`, and set the native VLAN to unused VLAN 999 ([PTL-0007](../../labs/network-security/switch-hardening/README.md)).
- **Port Security:** Enforce MAC address sticky learning and `shutdown` violation mode on staff access ports ([PTL-0004](../../labs/network-security/port-security/README.md)).
- **STP Edge Protection:** Enable Spanning Tree `portfast` and `bpduguard enable` on all access interfaces ([PTL-0007](../../labs/network-security/switch-hardening/README.md)).

### B. Layer 3 Inter-VLAN Routing & WAN Connectivity
- **Router-on-a-Stick:** Divide R1 physical interface `Gi0/0/0` into subinterfaces (`Gi0/0/0.10`, `.20`, `.30`) with `encapsulation dot1Q` ([PTL-0010](../../labs/routing/inter-vlan-routing-router-on-a-stick/README.md)).
- **Dual-Stack WAN Routing:** Configure static default route `ip route 0.0.0.0 0.0.0.0 209.165.200.226` or dynamic single-area OSPFv2 ([PTL-0011](../../labs/routing/single-area-ospfv2/README.md)).

### C. Network Services Automation
- **Cisco IOS DHCP Server:** Configure DHCP pools for Staff (`VLAN 20`) and Guest (`VLAN 30`) with network addresses, default routers, and DNS servers, excluding the first 10 addresses of each subnet ([PTL-0012](../../labs/network-services/dhcp-server-and-relay/README.md)).

### D. Network Security & Traffic Filtering
- **Administrative SSH Access:** Enforce SSHv2 with 2048-bit RSA keys, local authentication, and Telnet disabling on both router and switch ([PTL-0003](../../labs/network-security/secure-switch-ssh/README.md)).
- **Traffic Filtering ACL:** Implement a named extended ACL on R1 interface `Gi0/0/0.30` inbound to allow Guest devices outbound Internet browsing while completely blocking access to internal subnets (`192.168.10.0/24` and `192.168.20.0/24`) ([PTL-0013](../../labs/network-security/standard-and-extended-acls/README.md)).

---

## 5. Acceptance Testing and Quality Checklist

Before submitting or documenting your simulation:
- [ ] **DHCP Test:** Connect test PCs to ports in VLAN 20 and VLAN 30; confirm they automatically lease correct IP addresses, default gateways, and DNS servers within 10 seconds.
- [ ] **Inter-VLAN Test:** Confirm that Staff workstations can ping Management workstations through the router.
- [ ] **Guest Isolation Test:** Confirm that Guest workstations can ping the WAN gateway (`209.165.200.226`), but are immediately blocked from pinging Staff (`192.168.20.10`) and Management (`192.168.10.10`).
- [ ] **Port Security Test:** Swap an unauthorized laptop into a port security-enabled access port; verify that the port transitions to `err-disabled` and generates an alarm.
- [ ] **Management Security Test:** Attempt an SSH session from Management PC; confirm successful login. Attempt Telnet; confirm connection is rejected.

---

## References
- Cisco Systems, *Branch Office Network Design Guide*: [Enterprise Branch Design](https://www.cisco.com/c/en/us/solutions/enterprise/branch-office-network/index.html).
- IETF RFC 2131 (DHCP), RFC 2328 (OSPFv2), RFC 4253 (SSH), IEEE 802.1Q (VLANs).

---

## Files and Validation Status
- Configuration Scripts: [configs/R1.txt](configs/R1.txt), [configs/R2.txt](configs/R2.txt), [configs/S1.txt](configs/S1.txt)
- Verification Guide: [verification.md](verification.md)
- Design Quality: **REVIEWED** (Comprehensive multi-tier enterprise branch specification).
- Packet Tracer Simulator Status: **NOT TESTED** (Syntax verified statically against official Cisco IOS configuration guidelines).

> Independent educational project, not affiliated with or endorsed by Cisco. Lab credentials (`cisco123`, `adminpass123`) are provided for educational simulation purposes only.
