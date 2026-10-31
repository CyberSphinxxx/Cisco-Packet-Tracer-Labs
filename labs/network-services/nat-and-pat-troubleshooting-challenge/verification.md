# Verification and Acceptance Matrix — PTL-0043

**Lab ID:** PTL-0043  
**Title:** NAT and PAT Troubleshooting Challenge  
**Status:** `TESTED_PASS` (Verified live in Cisco Packet Tracer 9.0.1 via MCP loopback bridge automation)

---

## 1. Packet Tracer Topology Construction Manifest

To construct or manually verify this topology in Cisco Packet Tracer:

### Device Inventory
| Device Role | PT Device Model | Display Name | Modules / Slots |
|---|---|---|---|
| Enterprise Edge PAT Router | Cisco ISR 4331 | Edge-R1 | Built-in `Gi0/0/0`, `Gi0/0/1`, `Gi0/0/2` |
| Internet Service Provider | Cisco ISR 4331 | ISP | Built-in `Gi0/0/0`, `Gi0/0/1`, `Gi0/0/2` |
| Staff LAN Access Switch | Cisco Catalyst 2960-24TT | Switch-Staff | 24 FastEthernet + 2 GigabitEthernet ports |
| Guest LAN Access Switch | Cisco Catalyst 2960-24TT | Switch-Guest | 24 FastEthernet + 2 GigabitEthernet ports |
| Staff Workstation | PC-PT | PC-Staff | FastEthernet0 (`192.168.10.10/24`, GW: `192.168.10.1`) |
| Guest Laptop | Laptop-PT | Laptop-Guest | FastEthernet0 (`192.168.20.10/24`, GW: `192.168.20.1`) |
| Public Web Server | Server-PT | Web-Server | FastEthernet0 (`198.51.100.10/24`, GW: `198.51.100.1`, HTTP active) |

### Physical Cabling Matrix
| Link ID | Source Device | Source Port | Destination Device | Destination Port | Cable Type |
|---|---|---|---|---|---|
| L-01 | Switch-Staff | FastEthernet0/1 | PC-Staff | FastEthernet0 | Copper Straight-Through |
| L-02 | Switch-Staff | GigabitEthernet0/1 | Edge-R1 | GigabitEthernet0/0/0 | Copper Straight-Through |
| L-03 | Switch-Guest | FastEthernet0/1 | Laptop-Guest | FastEthernet0 | Copper Straight-Through |
| L-04 | Switch-Guest | GigabitEthernet0/1 | Edge-R1 | GigabitEthernet0/0/1 | Copper Straight-Through |
| L-05 | Edge-R1 | GigabitEthernet0/0/2 | ISP | GigabitEthernet0/0/0 | Copper Crossover |
| L-06 | ISP | GigabitEthernet0/0/1 | Web-Server | FastEthernet0 | Copper Straight-Through |

---

## 2. Positive Verification Test Matrix

| Test ID | Objective | Command / Procedure | Expected Result | Pass Criteria |
|---|---|---|---|---|
| **POS-01** | Local Gateway Reachability | `PC-Staff> ping 192.168.10.1`<br>`Laptop-Guest> ping 192.168.20.1` | 4/4 echo replies received from respective gateways with 0% loss. | Local Layer 3 gateways operational |
| **POS-02** | NAT Interface Roles | `Edge-R1# show ip nat statistics` | Inside interfaces show `Gi0/0/0`, `Gi0/0/1`; Outside interface shows `Gi0/0/2`. | Interface NAT roles correctly assigned |
| **POS-03** | Translation ACL Verification | `Edge-R1# show access-lists 1` | Displays `permit 192.168.10.0 0.0.0.255` and `permit 192.168.20.0 0.0.0.255` with active match counts. | Both internal subnets matched for NAT |
| **POS-04** | Staff LAN Outbound PAT | `PC-Staff> ping 198.51.100.10` | 4/4 echo replies received from public server with 0% loss. | Outbound ICMP translated and replied |
| **POS-05** | Guest LAN Outbound PAT | `Laptop-Guest> ping 198.51.100.10` | 4/4 echo replies received from public server with 0% loss. | Outbound ICMP translated and replied |
| **POS-06** | Outbound TCP/HTTP Port Translation | `PC-Staff> telnet 198.51.100.10 80` | Displays `Trying 198.51.100.10 ...Open` indicating successful TCP connection. | Outbound Layer 4 PAT operational |
| **POS-07** | Active Translation Table & Stats | `Edge-R1# show ip nat translations`<br>`Edge-R1# show ip nat statistics` | Dynamic mappings display inside local IPs (`192.168.10.10`, `192.168.20.10`) mapped to inside global (`203.0.113.1`); hits > 0. | PAT overload multiplexing verified |

---

## 3. Negative & Fault Tolerance Test Matrix

| Test ID | Fault Scenario | Injection Procedure | Observed Symptom | Recovery Procedure |
|---|---|---|---|---|
| **NEG-01** | Starter State: Translation Failure | In starter topology, test ping from `PC-Staff` to `Web-Server` (`ping 198.51.100.10`). | Returns `Request timed out` (100% loss). Private RFC 1918 traffic cannot traverse public ISP without valid translation. | Diagnose missing outside NAT interface and ACL typo on Edge-R1; apply correct NAT roles and ACL statements. |
| **NEG-02** | Starter State Fault Identification | On `Edge-R1`, run `show ip nat translations`, `show ip nat statistics`, and `show access-lists 1`. | Translation table is empty; statistics show 0 outside interfaces; ACL 1 shows subnet typo `192.168.1.0/24` with guest subnet absent. | Remove incorrect ACL and interfaces: configure `no ip nat inside` and `ip nat outside` on `Gi0/0/2`, add `ip nat inside` on `Gi0/0/1`, update ACL 1 for `192.168.10.0/24` and `192.168.20.0/24`. |

---

## 4. Reload and Persistence Verification

- `completed.pkt` reloaded via `ipc.appWindow().fileOpen()`.
- Router `Edge-R1` preserved startup configurations from NVRAM across reload.
- Outbound ICMP and HTTP traffic confirmed working after boot.
- Reopened `starter.pkt` cleanly and confirmed initial faulted state is intact for learner exercise.

