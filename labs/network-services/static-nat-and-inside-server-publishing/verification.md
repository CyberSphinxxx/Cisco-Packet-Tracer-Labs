# Verification and Acceptance Matrix — PTL-0021

**Lab ID:** PTL-0021  
**Title:** Static NAT and Inside Server Publishing  
**Status:** `TESTED_PASS` (Verified live in Cisco Packet Tracer 9.0.1 via MCP loopback bridge automation)

---

## 1. Packet Tracer Topology Construction Manifest

To construct or manually verify this topology in Cisco Packet Tracer:

### Device Inventory
| Device Role | PT Device Model | Display Name | Modules / Slots |
|---|---|---|---|
| Enterprise Edge Router | Cisco ISR 4321 | R1 | Default `GigabitEthernet0/0/0` & `GigabitEthernet0/0/1` |
| Upstream ISP Router | Cisco ISR 4321 | ISP | Default `GigabitEthernet0/0/0` & `GigabitEthernet0/0/1` |
| Enterprise Access Switch | Cisco Catalyst 2960-24TT | S1 | 24 FastEthernet + 2 GigabitEthernet ports |
| Inside Private Host | PC-PT | PC-Internal | FastEthernet0 |
| Inside Web/App Server | Server-PT | Svr-Internal | FastEthernet0 |
| External Internet Client | PC-PT | PC-External | FastEthernet0 |

### Physical Cabling Matrix
| Link ID | Source Device | Source Port | Destination Device | Destination Port | Cable Type |
|---|---|---|---|---|---|
| L-01 | PC-Internal | FastEthernet0 | S1 | FastEthernet0/1 | Copper Straight-Through |
| L-02 | Svr-Internal | FastEthernet0 | S1 | FastEthernet0/10 | Copper Straight-Through |
| L-03 | S1 | GigabitEthernet0/1 | R1 | GigabitEthernet0/0/0 | Copper Straight-Through |
| L-04 | R1 | GigabitEthernet0/0/1 | ISP | GigabitEthernet0/0/0 | Copper Crossover |
| L-05 | ISP | GigabitEthernet0/0/1 | PC-External | FastEthernet0 | Copper Straight-Through |

---

## 2. Positive Verification Test Matrix

| Test ID | Objective | Command / Procedure | Expected Result | Pass Criteria |
|---|---|---|---|---|
| **POS-01** | Inside LAN Reachability | `PC-Internal> ping 192.168.10.80` | 3/3 echo replies from `Svr-Internal` with TTL=128 and time <1ms | Internal LAN hosts communicate directly at Layer 2/3 |
| **POS-02** | External Inbound Static NAT | `PC-External> ping 203.0.113.5` | 3/3 echo replies from published server IP with TTL=126 across R1 | Outside client reaches inside server via Inside Global IP |
| **POS-03** | Inside Server Outbound NAT | `Svr-Internal> ping 198.51.100.50` | 3/3 echo replies from external client with TTL=126 across R1 | Server initiates outbound sessions translated to Inside Global IP |
| **POS-04** | Static NAT Table Inspection | `R1# show ip nat translations` | Table displays permanent static mapping `203.0.113.5 <-> 192.168.10.80` alongside dynamic ICMP flows | Persistent one-to-one translation active in NVRAM/RAM |
| **POS-05** | NAT Operational Statistics | `R1# show ip nat statistics` | Total translations >= 1 static, Outside interface `GigabitEthernet0/0/1`, Inside interface `GigabitEthernet0/0/0`, Hits > 0 | Static mapping and packet hit counters active |

---

## 3. Negative & Fault Tolerance Test Matrix

| Test ID | Fault Scenario | Injection Procedure | Observed Symptom | Recovery Procedure |
|---|---|---|---|---|
| **NEG-01** | Unmapped Private Host Shielding | On PC-External:<br>`ping 192.168.10.10` | ISP router drops private RFC 1918 traffic; returns `Destination host unreachable.` from `198.51.100.1`. | Expected behavior: unmapped hosts remain fully isolated and inaccessible from the outside public network. |
| **NEG-02** | Static Mapping Deletion & Recovery | On R1:<br>`no ip nat inside source static 192.168.10.80 203.0.113.5`<br>`clear ip nat translation *`<br>On PC-External: `ping 203.0.113.5` | Inbound packets addressed to `203.0.113.5` cannot be translated and are dropped; pings report `Request timed out.`. | On R1, re-enter `ip nat inside source static 192.168.10.80 203.0.113.5`. Confirm `PC-External` pings succeed with 100% reception. |

---

## 4. Save and Persistence Verification Check

1. On R1, execute `copy running-config startup-config`.
2. Save the completed topology file (`completed.pkt`).
3. Reload `completed.pkt` in Cisco Packet Tracer.
4. Execute `ping 203.0.113.5` on `PC-External` and confirm static NAT translation operates immediately upon boot.
5. Reload `starter.pkt` and confirm that without the static NAT mapping, pings to `203.0.113.5` time out as expected, proving clear differentiation between starter and completed lab states.

