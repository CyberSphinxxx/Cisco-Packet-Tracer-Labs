# Verification and Acceptance Matrix — PTL-0013

**Lab ID:** PTL-0013  
**Title:** Configuring Standard and Extended IPv4 Access Control Lists  
**Target Simulator:** Cisco Packet Tracer 8.0+  
**Status:** `NOT_TESTED` (Authoritative Engineering Specification)

---

## 1. Packet Tracer Topology Construction Manifest

To construct or manually verify this topology in Cisco Packet Tracer:

### Device Inventory
| Device Role | PT Device Model | Display Name | Modules / Slots |
|---|---|---|---|
| Border Router & Firewall | Cisco ISR 4321 | R1 | Default GigabitEthernet interfaces (3 GE ports) |
| Accounting Switch | Cisco Catalyst 2960-24TT | S1 | 24 FastEthernet + 2 GigabitEthernet ports |
| Sales Switch | Cisco Catalyst 2960-24TT | S2 | 24 FastEthernet + 2 GigabitEthernet ports |
| Server Farm Switch | Cisco Catalyst 2960-24TT | S3 | 24 FastEthernet + 2 GigabitEthernet ports |
| Accounting Workstation | PC-PT | PC-Accounting | FastEthernet0 |
| Sales Workstation | PC-PT | PC-Sales | FastEthernet0 |
| Application Server | Server-PT | WebServer | FastEthernet0 |

### Physical Cabling Matrix
| Link ID | Source Device | Source Port | Destination Device | Destination Port | Cable Type |
|---|---|---|---|---|---|
| L-01 | PC-Accounting | FastEthernet0 | S1 | GigabitEthernet0/1 | Copper Straight-Through |
| L-02 | S1 | GigabitEthernet0/2 | R1 | GigabitEthernet0/0/0 | Copper Straight-Through |
| L-03 | PC-Sales | FastEthernet0 | S2 | GigabitEthernet0/1 | Copper Straight-Through |
| L-04 | S2 | GigabitEthernet0/2 | R1 | GigabitEthernet0/0/1 | Copper Straight-Through |
| L-05 | WebServer | FastEthernet0 | S3 | GigabitEthernet0/1 | Copper Straight-Through |
| L-06 | S3 | GigabitEthernet0/2 | R1 | GigabitEthernet0/0/2 | Copper Straight-Through |

### Addressing Setup
- **PC-Accounting:** IP: `192.168.10.10`, Mask: `255.255.255.0`, Gateway: `192.168.10.1`
- **PC-Sales:** IP: `192.168.20.10`, Mask: `255.255.255.0`, Gateway: `192.168.20.1`
- **WebServer:** IP: `192.168.30.100`, Mask: `255.255.255.0`, Gateway: `192.168.30.1` (Enable HTTP on port 80 and DNS on port 53)

---

## 2. Positive Verification Test Matrix

| Test ID | Objective | Command / Procedure | Expected Result | Pass Criteria |
|---|---|---|---|---|
| **V-01** | Verify Router Interface Status | `R1# show ip interface brief` | Interfaces Gi0/0/0 (`192.168.10.1`), Gi0/0/1 (`192.168.20.1`), and Gi0/0/2 (`192.168.30.1`) are all `up/up`. | All routed gateways operational |
| **V-02** | Permitted HTTP Web Browsing | On PC-Sales Desktop -> Web Browser -> Navigate to `http://192.168.30.100` | Cisco Packet Tracer default web page displays successfully. TCP handshake succeeds on port 80. | Web traffic permitted through ACL |
| **V-03** | Permitted DNS Queries | On PC-Sales Command Prompt:<br>`PC> nslookup webserver.lab.local 192.168.30.100` | DNS server returns `192.168.30.100`. UDP port 53 permitted. | DNS lookups succeed |
| **V-04** | Authorized Admin VTY Access | On PC-Accounting Command Prompt:<br>`PC> ssh -l admin 192.168.10.1` | Password accepted; command prompt changes to `R1#`. Standard ACL 10 permits host `192.168.10.10`. | Admin management session established |
| **V-05** | Verify ACL Hit Counters | `R1# show access-lists` | `Extended IP access list SALES_TO_SERVERS` shows incrementing match counters on permit rules (e.g., `permit tcp ... eq www` has matches). | Hit counters reflect passing traffic |

---

## 3. Negative & Security Policy Denial Test Matrix

| Test ID | Policy Rule | Execution Procedure | Observed Result | Pass Criteria |
|---|---|---|---|---|
| **NEG-01** | Deny ICMP Ping to Server Farm | On PC-Sales Command Prompt:<br>`PC> ping 192.168.30.100` | Packets dropped at R1 Gi0/0/1 inbound. PC outputs `Destination host unreachable` or `Request timed out`. `show access-lists` displays 4 matches on rule 30 `deny icmp`. | ICMP echo filtered by extended ACL |
| **NEG-02** | Deny Cross-Departmental Access | On PC-Sales Command Prompt:<br>`PC> ping 192.168.10.10` | Packets dropped at R1 Gi0/0/1 inbound. Output: `Destination host unreachable`. `show access-lists` displays 4 matches on rule 40 `deny ip ... 192.168.10.0`. | Inter-departmental traffic isolated |
| **NEG-03** | Unauthorized VTY Access Rejection | On PC-Sales Command Prompt:<br>`PC> ssh -l admin 192.168.20.1` | Router immediately closes connection: `[Connection to 192.168.20.1 closed by foreign host]` or connection refused. Standard ACL 10 denies host `192.168.20.10`. | Unauthorized VTY access prevented |

---

## 4. Save and Persistence Verification Check

1. On R1, issue `copy running-config startup-config`.
2. Save the topology file (`.pkt`).
3. Reload the router.
4. Issue `show access-lists` and verify both Standard ACL 10 and Extended ACL `SALES_TO_SERVERS` persist intact with rule ordering preserved.
5. Re-run web browsing test from PC-Sales to verify filter operation persists.
