# Verification and Acceptance Matrix — PTL-0020

**Lab ID:** PTL-0020  
**Title:** IPv4 Dynamic PAT at the Edge  
**Status:** `TESTED_PASS` (Verified live in Cisco Packet Tracer 9.0.1 via MCP loopback bridge automation)

---

## 1. Packet Tracer Topology Construction Manifest

To construct or manually verify this topology in Cisco Packet Tracer:

### Device Inventory
| Device Role | PT Device Model | Display Name | Modules / Slots |
|---|---|---|---|
| Enterprise Edge Router | Cisco ISR 4321 | R1 | Default `GigabitEthernet0/0/0` & `GigabitEthernet0/0/1` |
| Simulated ISP Router | Cisco ISR 4321 | ISP | Default `GigabitEthernet0/0/0` & `GigabitEthernet0/0/1` |
| Branch Access Switch | Cisco Catalyst 2960-24TT | S1 | 24 FastEthernet + 2 GigabitEthernet ports |
| Host Workstation A | PC-PT | PC-A | FastEthernet0 |
| Host Workstation B | PC-PT | PC-B | FastEthernet0 |
| External Public Server | Server-PT | Svr-Public | FastEthernet0 |

### Physical Cabling Matrix
| Link ID | Source Device | Source Port | Destination Device | Destination Port | Cable Type |
|---|---|---|---|---|---|
| L-01 | PC-A | FastEthernet0 | S1 | FastEthernet0/1 | Copper Straight-Through |
| L-02 | PC-B | FastEthernet0 | S1 | FastEthernet0/2 | Copper Straight-Through |
| L-03 | S1 | GigabitEthernet0/1 | R1 | GigabitEthernet0/0/0 | Copper Straight-Through |
| L-04 | R1 | GigabitEthernet0/0/1 | ISP | GigabitEthernet0/0/0 | Copper Crossover |
| L-05 | ISP | GigabitEthernet0/0/1 | Svr-Public | FastEthernet0 | Copper Straight-Through |

---

## 2. Positive Verification Test Matrix

| Test ID | Objective | Command / Procedure | Expected Result | Pass Criteria |
|---|---|---|---|---|
| **POS-01** | Internal Gateway Reachability | `PC-A> ping 192.168.10.1` | 3/3 echo replies from gateway R1 Gi0/0/0 with TTL=255 and time <1ms | 100% success rate to local gateway |
| **POS-02** | Outbound Dynamic PAT | `PC-A> ping 198.51.100.10` | 3/3 echo replies from public server across R1 edge PAT with TTL=126 | Outbound ICMP translated to public IP |
| **POS-03** | Concurrent Multi-Host PAT | `PC-B> ping 198.51.100.10` | 3/3 echo replies from public server concurrently with PC-A | Both hosts translated to single public IP |
| **POS-04** | Translation Table Inspection | `R1# show ip nat translations` | Table lists dynamic ICMP entries mapping inside local (`192.168.10.x:port`) to inside global (`203.0.113.1:port`) | Dynamic overload entries active |
| **POS-05** | NAT Operational Statistics | `R1# show ip nat statistics` | Total translations >= 2, Outside interface `GigabitEthernet0/0/1`, Inside interface `GigabitEthernet0/0/0`, Hits > 0 | Operational counters incrementing |

---

## 3. Negative & Fault Tolerance Test Matrix

| Test ID | Fault Scenario | Injection Procedure | Observed Symptom | Recovery Procedure |
|---|---|---|---|---|
| **NEG-01** | Missing Inside NAT Interface | On R1:<br>`interface GigabitEthernet0/0/0`<br>`no ip nat inside`<br>`end`<br>`clear ip nat translation *`<br>On PC-A: `ping 198.51.100.10` | Packets exit R1 with un-NATed private source IP `192.168.10.10`. ISP drops packets; ping outputs `Request timed out.`. | On R1 Gi0/0/0, reapply `ip nat inside`. Verify ping to `198.51.100.10` recovers immediately. |
| **NEG-02** | ACL Subnet Exclusion | On R1:<br>`no access-list 1`<br>`access-list 1 permit host 192.168.10.10`<br>`end`<br>`clear ip nat translation *`<br>On PC-B: `ping 198.51.100.10` | PC-A traffic matches host ACL and translates successfully. PC-B traffic is denied by implicit deny, remains untranslated, and times out. | On R1, restore `access-list 1 permit 192.168.10.0 0.0.0.255`. Confirm PC-B connectivity recovers. |

---

## 4. Save and Persistence Verification Check

1. On R1, execute `copy running-config startup-config`.
2. Save the topology file (`completed.pkt`).
3. Reload `completed.pkt` in Cisco Packet Tracer.
4. Execute `ping 198.51.100.10` on PC-A and confirm translation operates without reconfiguration.
5. Reload `starter.pkt` and confirm that without NAT configuration, pings to `198.51.100.10` fail as expected, confirming clear differentiation between starter and solution files.

