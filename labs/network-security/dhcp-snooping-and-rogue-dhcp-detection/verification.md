# Verification and Acceptance Matrix — PTL-0038

**Lab ID:** PTL-0038  
**Title:** DHCP Snooping and Rogue DHCP Detection  
**Status:** `TESTED_PASS` (Verified live in Cisco Packet Tracer 9.0.1 via MCP loopback bridge automation)

---

## 1. Packet Tracer Topology Construction Manifest

To construct or manually verify this topology in Cisco Packet Tracer:

### Device Inventory
| Device Role | PT Device Model | Display Name | Modules / Slots |
|---|---|---|---|
| Legitimate Gateway & DHCP Server | Cisco ISR 4321 | R1 | Default `GigabitEthernet0/0/0` |
| Layer 2 Access Switch | Cisco Catalyst 2960-24TT | SW-1 | 24 FastEthernet + 2 GigabitEthernet ports |
| Corporate Client 1 | PC-PT | Client-1 | FastEthernet0 |
| Corporate Client 2 | PC-PT | Client-2 | FastEthernet0 |
| Unauthorized Rogue DHCP Server | Server-PT | Rogue-Server | FastEthernet0 |

### Physical Cabling Matrix
| Link ID | Source Device | Source Port | Destination Device | Destination Port | Cable Type |
|---|---|---|---|---|---|
| L-01 | R1 | GigabitEthernet0/0/0 | SW-1 | GigabitEthernet0/1 | Copper Straight-Through |
| L-02 | SW-1 | FastEthernet0/10 | Client-1 | FastEthernet0 | Copper Straight-Through |
| L-03 | SW-1 | FastEthernet0/11 | Client-2 | FastEthernet0 | Copper Straight-Through |
| L-04 | SW-1 | FastEthernet0/24 | Rogue-Server | FastEthernet0 | Copper Straight-Through |

---

## 2. Positive Verification Test Matrix

| Test ID | Objective | Command / Procedure | Expected Result | Pass Criteria |
|---|---|---|---|---|
| **POS-01** | Authorized Router Interface & Pool | `R1# show ip interface brief`<br>`R1# show ip dhcp pool` | `GigabitEthernet0/0/0` (192.168.10.1) status `up`, protocol `up`. Pool `CORP-POOL` active with dynamic lease allocation. | Routed interface up/up and DHCP pool operational |
| **POS-02** | Global & VLAN DHCP Snooping Status | `SW-1# show ip dhcp snooping` | `Switch DHCP snooping is enabled`, `DHCP snooping is configured on following VLANs: 10`, `Insertion of option 82 is disabled`. | Snooping enabled globally, on VLAN 10, and Option 82 disabled |
| **POS-03** | Interface Trust State Verification | `SW-1# show ip dhcp snooping` | `GigabitEthernet0/1` listed with `Trusted: yes` and `Rate limit: unlimited`. Untrusted access ports listed with `Trusted: no`. | Authorized uplink trusted; host ports untrusted |
| **POS-04** | Client 1 Dynamic Lease Acquisition | `Client-1> ipconfig` | IPv4 address allocated within `192.168.10.0/24` (e.g., `192.168.10.10`), mask `255.255.255.0`, default gateway `192.168.10.1`. | Authorized lease acquired by Client-1 |
| **POS-05** | Client 2 Dynamic Lease Acquisition | `Client-2> ipconfig` | IPv4 address allocated within `192.168.10.0/24` (e.g., `192.168.10.11`), mask `255.255.255.0`, default gateway `192.168.10.1`. | Authorized lease acquired by Client-2 |
| **POS-06** | Client Gateway Reachability | `Client-1> ping 192.168.10.1` | 4/4 echo replies received from `192.168.10.1` with TTL=255 and 0% packet loss. | End-to-end IP connectivity verified |
| **POS-07** | Snooping Binding Database Population | `SW-1# show ip dhcp snooping binding` | Table contains dynamic bindings for Client-1 and Client-2 matching their MAC addresses, leased IPs, lease timer, type `dhcp-snooping`, VLAN 10, and ports `Fa0/10` and `Fa0/11`. Total bindings: 2. | Dynamic snooping table correctly populated |

---

## 3. Negative & Fault Tolerance Test Matrix

| Test ID | Fault Scenario | Injection Procedure | Observed Symptom | Recovery Procedure |
|---|---|---|---|---|
| **NEG-01** | Unprotected Switch Rogue Poisoning | On starter topology (snooping disabled), active Rogue-Server offers leases in `10.66.66.0/24`. Client leases rogue IP `10.66.66.100`. | Client attempts `ping 192.168.10.1` and fails with continuous `Request timed out` due to invalid IP subnet and gateway. | Enable DHCP snooping globally, configure VLAN 10 snooping, designate Gi0/1 as trusted, and renew client leases (`ipconfig /renew`). |
| **NEG-02** | Rogue Offer Dropping on Untrusted Port | With DHCP snooping active, Rogue-Server transmits unauthorized `DHCPOFFER` packets on untrusted port `FastEthernet0/24`. | Switch discards rogue server packets. No rogue bindings appear in `show ip dhcp snooping binding`, and client workstations never receive `10.66.66.x` addresses. | Expected security containment behavior; untrusted access port automatically discards server-originated DHCP messages. |

---

## 4. Save and Persistence Verification Check

- **Startup Configuration Sync:** Executed `copy running-config startup-config` on both `SW-1` and `R1`.
- **Packet Tracer Reload Verification:**
  - `completed.pkt` reloaded via `ipc.appWindow().fileOpen()`.
  - Router `R1` and Switch `SW-1` preserved configurations without boot dialog stalls.
  - Clients successfully renewed IP configurations from `R1` (`192.168.10.10` and `192.168.10.11`) and established 100% ICMP ping reachability to default gateway `192.168.10.1`.
  - `show ip dhcp snooping binding` retained dynamic binding entries (`Total number of bindings: 2`).
  - `starter.pkt` reloaded and verified to be in the vulnerable baseline state with DHCP snooping disabled.

