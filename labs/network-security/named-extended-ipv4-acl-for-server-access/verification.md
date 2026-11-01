# Verification and Acceptance Matrix — PTL-0042

**Lab ID:** PTL-0042  
**Title:** Named Extended IPv4 ACL for Server Access  
**Status:** `TESTED_PASS` (Verified live in Cisco Packet Tracer 9.0.1 via MCP loopback bridge automation)

---

## 1. Packet Tracer Topology Construction Manifest

To construct or manually verify this topology in Cisco Packet Tracer:

### Device Inventory
| Device Role | PT Device Model | Display Name | Modules / Slots |
|---|---|---|---|
| Enterprise Security Router | Cisco ISR 4331 | R1 | Default `Gi0/0/0`, `Gi0/0/1`, `Gi0/0/2` |
| Staff LAN Access Switch | Cisco Catalyst 2960-24TT | SW-Staff | 24 FastEthernet + 2 GigabitEthernet ports |
| Guest LAN Access Switch | Cisco Catalyst 2960-24TT | SW-Guest | 24 FastEthernet + 2 GigabitEthernet ports |
| DMZ Server Farm Switch | Cisco Catalyst 2960-24TT | SW-Server | 24 FastEthernet + 2 GigabitEthernet ports |
| Staff Workstation | PC-PT | PC-Staff | FastEthernet0 (`192.168.10.10/24`) |
| Guest Laptop | Laptop-PT | Laptop-Guest | FastEthernet0 (`192.168.20.10/24`) |
| DNS and Web Portal Server | Server-PT | DNS-Web-Server | FastEthernet0 (`192.168.100.10/24`, DNS & HTTP active) |
| Internal Database Server | Server-PT | DB-Server | FastEthernet0 (`192.168.100.20/24`, restricted server) |

### Physical Cabling Matrix
| Link ID | Source Device | Source Port | Destination Device | Destination Port | Cable Type |
|---|---|---|---|---|---|
| L-01 | R1 | GigabitEthernet0/0/0 | SW-Staff | GigabitEthernet0/1 | Copper Straight-Through |
| L-02 | SW-Staff | FastEthernet0/1 | PC-Staff | FastEthernet0 | Copper Straight-Through |
| L-03 | R1 | GigabitEthernet0/0/1 | SW-Guest | GigabitEthernet0/1 | Copper Straight-Through |
| L-04 | SW-Guest | FastEthernet0/1 | Laptop-Guest | FastEthernet0 | Copper Straight-Through |
| L-05 | R1 | GigabitEthernet0/0/2 | SW-Server | GigabitEthernet0/1 | Copper Straight-Through |
| L-06 | SW-Server | FastEthernet0/1 | DNS-Web-Server | FastEthernet0 | Copper Straight-Through |
| L-07 | SW-Server | FastEthernet0/2 | DB-Server | FastEthernet0 | Copper Straight-Through |

---

## 2. Positive Verification Test Matrix

| Test ID | Objective | Command / Procedure | Expected Result | Pass Criteria |
|---|---|---|---|---|
| **POS-01** | Router Interface Addressing & Status | `R1# show ip interface brief` | `Gi0/0/0` (192.168.10.1), `Gi0/0/1` (192.168.20.1), and `Gi0/0/2` (192.168.100.1) all report status `up` and protocol `up`. | All routed interfaces operational |
| **POS-02** | Guest LAN ICMP to Local Gateway | `Laptop-Guest> ping 192.168.20.1` | 4/4 echo replies received from `192.168.20.1` with 0% packet loss. | Local gateway ICMP echo permitted |
| **POS-03** | Guest LAN HTTP to Web Server | `Laptop-Guest> telnet 192.168.100.10 80` | Displays `Trying 192.168.100.10 ...Open` indicating successful TCP 3-way handshake on port 80. | Web portal HTTP access permitted |
| **POS-04** | Guest LAN to Database Server Denied | `Laptop-Guest> ping 192.168.100.20` | Returns `Reply from 192.168.20.1: Destination host unreachable` (4/4 packets lost). | Internal database isolation enforced |
| **POS-05** | Guest LAN to Staff LAN Isolation | `Laptop-Guest> ping 192.168.10.10` | Returns `Reply from 192.168.20.1: Destination host unreachable` (4/4 packets lost). | Staff departmental isolation enforced |
| **POS-06** | Staff LAN Reachability to DMZ | `PC-Staff> ping 192.168.100.10` and `ping 192.168.100.20` | 4/4 echo replies received from both servers with 0% loss. | Staff full reachability to DMZ |
| **POS-07** | Active ACL Match Counters | `R1# show access-lists GUEST-FILTER` | Named extended ACL displays live match statistics for permit TCP 80, permit ICMP echo, and deny rules. | Deterministic hardware/software matching confirmed |

---

## 3. Negative & Fault Tolerance Test Matrix

| Test ID | Fault Scenario | Injection Procedure | Observed Symptom | Recovery Procedure |
|---|---|---|---|---|
| **NEG-01** | Starter State: Unrestricted Guest Access | In starter topology, test ping from `Laptop-Guest` to `DB-Server` (`ping 192.168.100.20`). | Pings succeed with 0% packet loss (`Reply from 192.168.100.20: bytes=32 time<1ms`). Guest has unrestricted access to confidential database. | Configure named extended ACL `GUEST-FILTER` with explicit deny rules for `DB-Server` and apply inbound on `Gi0/0/1`. |
| **NEG-02** | Starter Baseline Interface Audit | On `R1`, inspect `show ip interface GigabitEthernet0/0/1`. | `Inbound access list is not set` confirms security perimeter is missing on guest ingress interface. | Apply `ip access-group GUEST-FILTER in` under interface `GigabitEthernet0/0/1`. |

---

## 4. Save and Persistence Verification Check

- **Startup Configuration Sync:** Executed `copy running-config startup-config` on `R1`.
- **Packet Tracer Reload Verification:**
  - `completed.pkt` reloaded via `ipc.appWindow().fileOpen()`.
  - Router `R1` preserved named extended ACL `GUEST-FILTER` across reboot.
  - Reopened `starter.pkt` cleanly and confirmed initial unapplied state is intact for learner exercise.

