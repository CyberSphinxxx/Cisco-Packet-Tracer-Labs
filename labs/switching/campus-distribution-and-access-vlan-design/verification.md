# Verification and Acceptance Matrix — PTL-0049

**Lab ID:** PTL-0049  
**Title:** Campus Distribution and Access VLAN Design  
**Status:** `TESTED_PASS` (Verified live in Cisco Packet Tracer 9.0.1 via MCP loopback bridge automation)

---

## 1. Packet Tracer Topology Construction Manifest

To construct or manually verify this topology in Cisco Packet Tracer:

### Device Inventory
| Device Role | PT Device Model | Display Name | Modules / Slots |
|---|---|---|---|
| Multilayer Distribution Switch | Cisco Catalyst 3560-24PS | DLS-1 | 24 FastEthernet + 2 GigabitEthernet ports |
| Building A Access Switch | Cisco Catalyst 2960-24TT | ALS-1 | 24 FastEthernet + 2 GigabitEthernet ports |
| Server Farm Access Switch | Cisco Catalyst 2960-24TT | ALS-2 | 24 FastEthernet + 2 GigabitEthernet ports |
| Academic Faculty Client | PC-PT | PC-Faculty | FastEthernet0 (`192.168.10.10/24`, gw `192.168.10.1`) |
| Student Lab Client | PC-PT | PC-Student | FastEthernet0 (`192.168.20.10/24`, gw `192.168.20.1`) |
| Campus Application Server | Server-PT | Campus-Srv | FastEthernet0 (`192.168.30.10/24`, gw `192.168.30.1`) |

### Physical Cabling Matrix
| Link ID | Source Device | Source Port | Destination Device | Destination Port | Cable Type |
|---|---|---|---|---|---|
| L-01 | DLS-1 | GigabitEthernet0/1 | ALS-1 | GigabitEthernet0/1 | Copper Straight-Through |
| L-02 | DLS-1 | GigabitEthernet0/2 | ALS-2 | GigabitEthernet0/1 | Copper Straight-Through |
| L-03 | ALS-1 | FastEthernet0/1 | PC-Faculty | FastEthernet0 | Copper Straight-Through |
| L-04 | ALS-1 | FastEthernet0/2 | PC-Student | FastEthernet0 | Copper Straight-Through |
| L-05 | ALS-2 | FastEthernet0/1 | Campus-Srv | FastEthernet0 | Copper Straight-Through |

---

## 2. Positive Verification Test Matrix

| Test ID | Objective | Command / Procedure | Expected Result | Pass Criteria |
|---|---|---|---|---|
| **POS-01** | DLS-1 Hardware Routing & SVI Audit | `DLS-1# show ip route connected` | Connected routes for `192.168.10.0/24`, `192.168.20.0/24`, `192.168.30.0/24`, `192.168.99.0/24` are present and active | Hardware routing enabled on all SVIs |
| **POS-02** | 802.1Q Trunking & Native VLAN Audit | `show interfaces trunk` on DLS-1, ALS-1, ALS-2 | 802.1Q encapsulation, Native VLAN 99, allowed VLANs `10,20,30,99` active across Gi0/1 and Gi0/2 uplinks | Trunk configuration aligned across distribution and access |
| **POS-03** | Faculty Local Gateway Reachability | `PC-Faculty> ping 192.168.10.1` | 4/4 echo replies received (0% packet loss) | Intra-VLAN communication to SVI gateway verified |
| **POS-04** | Student Local Gateway Reachability | `PC-Student> ping 192.168.20.1` | 4/4 echo replies received (0% packet loss) | Intra-VLAN communication to SVI gateway verified |
| **POS-05** | Faculty to Server Inter-VLAN Reachability | `PC-Faculty> ping 192.168.30.10` | 4/4 echo replies received (0% packet loss, TTL=127) | Inter-VLAN routed data plane delivery verified |
| **POS-06** | Student to Server Inter-VLAN Reachability | `PC-Student> ping 192.168.30.10` | 4/4 echo replies received (0% packet loss, TTL=127) | Inter-VLAN routed data plane delivery verified |
| **POS-07** | Inter-VLAN Client-to-Client Reachability | `PC-Faculty> ping 192.168.20.10` | 4/4 echo replies received (0% packet loss, TTL=127) | Inter-VLAN routed data plane delivery verified |

---

## 3. Negative & Fault Tolerance Test Matrix

| Test ID | Fault Scenario | Injection Procedure | Observed Symptom | Recovery Procedure |
|---|---|---|---|---|
| **NEG-01** | Starter State: Access Port VLAN Misassignment | On `ALS-1 Fa0/2`, assign port to `VLAN 1`. Test ping from `PC-Student` to gateway `192.168.20.1`. | Ping fails with 100% loss (`Request timed out`). `PC-Student` is isolated in an unrouted broadcast domain. | Reassign `ALS-1 Fa0/2` to `VLAN 20`: `switchport access vlan 20`. |
| **NEG-02** | Starter State: Disabled IP Routing & Pruned Trunk | On `DLS-1`, issue `no ip routing`. On `ALS-2 Gi0/1`, configure `switchport trunk allowed vlan 10,20,99` (omitting VLAN 30). Test ping from `PC-Faculty` to `Campus-Srv` (`192.168.30.10`). | Ping fails with 100% loss (`Request timed out`). `DLS-1` refuses inter-VLAN forwarding and `ALS-2` drops VLAN 30 frames. | Activate `ip routing` on `DLS-1` and add `VLAN 30` to `ALS-2 Gi0/1`: `switchport trunk allowed vlan add 30`. |

---

## 4. Reload and Persistence Verification

- `completed.pkt` reloaded cleanly via `ipc.appWindow().fileOpen()`.
- Multilayer and access switches preserved NVRAM startup configurations across reload.
- Full end-to-end reachability across all campus VLANs confirmed after reload.
- Reopened `starter.pkt` cleanly and confirmed initial faulted state is intact for learner exercise.

