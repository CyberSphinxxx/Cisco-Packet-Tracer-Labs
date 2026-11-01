# Verification and Acceptance Matrix — PTL-0041

**Lab ID:** PTL-0041  
**Title:** IPv4 ACL Troubleshooting with Traffic Matrix  
**Status:** `TESTED_PASS` (Verified live in Cisco Packet Tracer 9.0.1 via MCP loopback bridge automation)

---

## 1. Packet Tracer Topology Construction Manifest

To construct or manually verify this topology in Cisco Packet Tracer:

### Device Inventory
| Device Role | PT Device Model | Display Name | Modules / Slots |
|---|---|---|---|
| Border / Inter-VLAN Router | Cisco ISR 4331 | R1 | Default `Gi0/0/0`, `Gi0/0/1`, `Gi0/0/2` |
| Sales Access Switch | Cisco Catalyst 2960-24TT | SW-Sales | 24 FastEthernet + 2 GigabitEthernet ports |
| HR Access Switch | Cisco Catalyst 2960-24TT | SW-HR | 24 FastEthernet + 2 GigabitEthernet ports |
| Server DMZ Switch | Cisco Catalyst 2960-24TT | SW-Server | 24 FastEthernet + 2 GigabitEthernet ports |
| Sales Workstation | PC-PT | PC-Sales | FastEthernet0 (`192.168.10.10/24`) |
| HR Workstation | PC-PT | PC-HR | FastEthernet0 (`192.168.20.10/24`) |
| Corporate Web Server | Server-PT | Web-Server | FastEthernet0 (`192.168.30.10/24`, HTTP active) |
| Finance Database Server | Server-PT | Finance-Server | FastEthernet0 (`192.168.30.20/24`, HTTP active) |

### Physical Cabling Matrix
| Link ID | Source Device | Source Port | Destination Device | Destination Port | Cable Type |
|---|---|---|---|---|---|
| L-01 | R1 | GigabitEthernet0/0/0 | SW-Sales | GigabitEthernet0/1 | Copper Straight-Through |
| L-02 | SW-Sales | FastEthernet0/1 | PC-Sales | FastEthernet0 | Copper Straight-Through |
| L-03 | R1 | GigabitEthernet0/0/1 | SW-HR | GigabitEthernet0/1 | Copper Straight-Through |
| L-04 | SW-HR | FastEthernet0/1 | PC-HR | FastEthernet0 | Copper Straight-Through |
| L-05 | R1 | GigabitEthernet0/0/2 | SW-Server | GigabitEthernet0/1 | Copper Straight-Through |
| L-06 | SW-Server | FastEthernet0/1 | Web-Server | FastEthernet0 | Copper Straight-Through |
| L-07 | SW-Server | FastEthernet0/2 | Finance-Server | FastEthernet0 | Copper Straight-Through |

---

## 2. Positive Verification Test Matrix

| Test ID | Objective | Command / Procedure | Expected Result | Pass Criteria |
|---|---|---|---|---|
| **POS-01** | Router Interface Addressing & Status | `R1# show ip interface brief` | `Gi0/0/0` (192.168.10.1), `Gi0/0/1` (192.168.20.1), and `Gi0/0/2` (192.168.30.1) all report status `up` and protocol `up`. | All routed interfaces operational |
| **POS-02** | Sales LAN ICMP to Local Gateway | `PC-Sales> ping 192.168.10.1` | 4/4 echo replies received from `192.168.10.1` with 0% packet loss. | Local gateway ICMP echo permitted |
| **POS-03** | Sales LAN HTTP to Web Server | `PC-Sales> telnet 192.168.30.10 80` | Displays `Trying 192.168.30.10 ...Open` indicating successful TCP 3-way handshake on port 80. | HTTP access permitted per matrix |
| **POS-04** | Sales LAN to Finance Server Denied | `PC-Sales> ping 192.168.30.20` | Returns `Reply from 192.168.10.1: Destination host unreachable` (4/4 packets lost). | Finance server isolation enforced |
| **POS-05** | Sales LAN to HR LAN Inter-VLAN Denied | `PC-Sales> ping 192.168.20.10` | Returns `Reply from 192.168.10.1: Destination host unreachable` (4/4 packets lost). | Inter-department isolation enforced |
| **POS-06** | HR LAN Reachability to DMZ | `PC-HR> ping 192.168.30.10` and `ping 192.168.30.20` | 4/4 echo replies received from both servers with 0% loss. | HR department full reachability |
| **POS-07** | Active ACL Match Counters | `R1# show access-lists` | Extended ACL `SALES-FILTER` displays non-zero match counts for permit TCP 80, permit ICMP echo, and deny rules. | Deterministic hardware/software matching confirmed |

---

## 3. Negative & Fault Tolerance Test Matrix

| Test ID | Fault Scenario | Injection Procedure | Observed Symptom | Recovery Procedure |
|---|---|---|---|---|
| **NEG-01** | Starter State: Shadowed Rule & Misdirection | In starter topology, test HTTP probe from `PC-Sales` to `Web-Server` (`telnet 192.168.30.10 80`). | Connection attempt fails and hangs at `Trying 192.168.30.10 ...`. Caused by broad deny rule (`deny ip 192.168.10.0 ... 192.168.30.0`) placed ahead of specific permit rule, combined with outbound placement on `Gi0/0/0`. | Remove misplaced filter from outbound interface, reorder ACL sequence so specific permit statements precede broad deny statements, and apply filter inbound on `Gi0/0/0`. |
| **NEG-02** | Starter Fault Audit: Direction & Wildcard Mask | On `R1`, inspect `show ip interface Gi0/0/0` and `show access-lists 10`. | `show ip interface Gi0/0/0` reports `Outgoing access list is SALES-FILTER` (missing inbound security); ACL 10 reports inverted mask `255.255.255.0` instead of `0.0.0.255` or `host`. | Correct `ip access-group SALES-FILTER in` on `Gi0/0/0`, and reconfigure ACL 10 as `access-list 10 permit host 192.168.20.10`. |

---

## 4. Save and Persistence Verification Check

- **Startup Configuration Sync:** Executed `copy running-config startup-config` on `R1`.
- **Packet Tracer Reload Verification:**
  - `completed.pkt` reloaded via `ipc.appWindow().fileOpen()`.
  - Router `R1` preserved standard ACL 10 and extended ACL `SALES-FILTER` configurations across reboot.
  - Reopened `starter.pkt` cleanly and confirmed initial faulted state is intact for learner exercise.
