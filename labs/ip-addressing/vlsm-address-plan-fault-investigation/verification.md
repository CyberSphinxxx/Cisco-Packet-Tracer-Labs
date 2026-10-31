# Verification and Acceptance Matrix — PTL-0047

**Lab ID:** PTL-0047  
**Title:** VLSM Address Plan Fault Investigation  
**Status:** `TESTED_PASS` (Verified live in Cisco Packet Tracer 9.0.1 via MCP loopback bridge automation)

---

## 1. Packet Tracer Topology Construction Manifest

To construct or manually verify this topology in Cisco Packet Tracer:

### Device Inventory
| Device Role | PT Device Model | Display Name | Modules / Slots |
|---|---|---|---|
| Branch Gateway Router | Cisco 4331 ISR | R1 | 3 Onboard GE ports (`Gi0/0/0`, `Gi0/0/1`, `Gi0/0/2`) |
| HQ Gateway Router | Cisco 4331 ISR | R2 | 3 Onboard GE ports (`Gi0/0/0`, `Gi0/0/1`, `Gi0/0/2`) |
| Engineering Switch | Cisco Catalyst 2960-24TT | SW-Eng | 24 FastEthernet + 2 GigabitEthernet ports |
| Sales Switch | Cisco Catalyst 2960-24TT | SW-Sales | 24 FastEthernet + 2 GigabitEthernet ports |
| Server DMZ Switch | Cisco Catalyst 2960-24TT | SW-DMZ | 24 FastEthernet + 2 GigabitEthernet ports |
| Engineering PC | PC-PT | PC-Eng1 | FastEthernet0 (`192.168.100.10/26`, gw `192.168.100.1`) |
| Sales PC | PC-PT | PC-Sales1 | FastEthernet0 (`192.168.100.70/27`, gw `192.168.100.65`) |
| Enterprise Web Server | Server-PT | Srv-Web | FastEthernet0 (`192.168.100.98/28`, gw `192.168.100.97`) |

### Physical Cabling Matrix
| Link ID | Source Device | Source Port | Destination Device | Destination Port | Cable Type |
|---|---|---|---|---|---|
| L-01 | R1 | GigabitEthernet0/0/0 | SW-Eng | GigabitEthernet0/1 | Copper Straight-Through |
| L-02 | R1 | GigabitEthernet0/0/1 | SW-Sales | GigabitEthernet0/1 | Copper Straight-Through |
| L-03 | R1 | GigabitEthernet0/0/2 | R2 | GigabitEthernet0/0/2 | Copper Crossover |
| L-04 | R2 | GigabitEthernet0/0/0 | SW-DMZ | GigabitEthernet0/1 | Copper Straight-Through |
| L-05 | SW-Eng | FastEthernet0/1 | PC-Eng1 | FastEthernet0 | Copper Straight-Through |
| L-06 | SW-Sales | FastEthernet0/1 | PC-Sales1 | FastEthernet0 | Copper Straight-Through |
| L-07 | SW-DMZ | FastEthernet0/1 | Srv-Web | FastEthernet0 | Copper Straight-Through |

---

## 2. Positive Verification Test Matrix

| Test ID | Objective | Command / Procedure | Expected Result | Pass Criteria |
|---|---|---|---|---|
| **POS-01** | R1 Interface Addressing & Mask Validation | `R1# show ip interface brief`<br>`R1# show interfaces` | `Gi0/0/0` is `192.168.100.1/26` (`255.255.255.192`), `Gi0/0/1` is `192.168.100.65/27` (`255.255.255.224`), `Gi0/0/2` is `192.168.100.113/30` (`255.255.255.252`), all up/up. | Interface IP addresses and prefix masks adhere to VLSM plan |
| **POS-02** | R2 Interface Addressing & Mask Validation | `R2# show ip interface brief`<br>`R2# show interfaces` | `Gi0/0/0` is `192.168.100.97/28` (`255.255.255.240`), `Gi0/0/2` is `192.168.100.114/30` (`255.255.255.252`), all up/up. | Server DMZ and WAN interfaces adhere to VLSM plan |
| **POS-03** | Engineering LAN Gateway Reachability | `PC-Eng1> ping 192.168.100.1` | 4/4 echo replies received with 0% packet loss. | Intra-subnet communication between PC and local gateway verified |
| **POS-04** | Sales LAN Gateway Reachability | `PC-Sales1> ping 192.168.100.65` | 4/4 echo replies received with 0% packet loss. | Intra-subnet communication between PC and local gateway verified |
| **POS-05** | Inter-Router WAN Transit Reachability | `R1# ping 192.168.100.114` | 5/5 echo replies received with 100% success rate (`!!!!!`). | Point-to-point transit link operational |
| **POS-06** | End-to-End Enterprise Ping (PC-Eng1 -> Srv-Web) | `PC-Eng1> ping 192.168.100.98` | 4/4 echo replies received with 0% packet loss. | Multi-hop routed connectivity across WAN transit link verified |
| **POS-07** | End-to-End Enterprise Ping (PC-Sales1 -> Srv-Web) | `PC-Sales1> ping 192.168.100.98` | 4/4 echo replies received with 0% packet loss. | Multi-hop routed connectivity across WAN transit link verified |

---

## 3. Negative & Fault Tolerance Test Matrix

| Test ID | Fault Scenario | Injection Procedure | Observed Symptom | Recovery Procedure |
|---|---|---|---|---|
| **NEG-01** | Starter State: Broadcast Address Host Assignment | In starter topology, test ping from `PC-Eng1` (`192.168.100.63`) to remote server `Srv-Web` (`192.168.100.98`). | Ping returns `Request timed out` (100% loss). `.63` is the directed broadcast address of `192.168.100.0/26`; routers drop routed packets to/from broadcast addresses. | Reconfigure `PC-Eng1` with valid usable host IP `192.168.100.10` and subnet mask `255.255.255.192`. |
| **NEG-02** | Starter State: Subnet Mask Truncation on Gateway | In starter topology, execute `show interfaces GigabitEthernet0/0/1` on `R1` and ping gateway `192.168.100.65` from `PC-Sales1` (`192.168.100.85`). | Router reports `Internet address is 192.168.100.65/28` (`255.255.255.240`) instead of `/27` (`255.255.255.224`), truncating host capacity to 14 hosts and isolating `PC-Sales1` (100% loss). | Reconfigure `R1 Gi0/0/1` with `ip address 192.168.100.65 255.255.255.224`, and set `PC-Sales1` to `192.168.100.70/27`. |

---

## 4. Reload and Persistence Verification

- `completed.pkt` reloaded cleanly via `ipc.appWindow().fileOpen()`.
- Routers `R1` and `R2` preserved startup configurations from NVRAM across reload.
- Full end-to-end reachability across all four VLSM subnets confirmed after reload.
- Reopened `starter.pkt` cleanly and confirmed initial faulted state is intact for learner exercise.

