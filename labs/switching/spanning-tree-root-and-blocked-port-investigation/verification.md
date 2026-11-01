# Verification and Acceptance Matrix — PTL-0045

**Lab ID:** PTL-0045  
**Title:** Spanning Tree Root and Blocked-Port Investigation  
**Status:** `TESTED_PASS` (Verified live in Cisco Packet Tracer 9.0.1 via MCP loopback bridge automation)

---

## 1. Packet Tracer Topology Construction Manifest

To construct or manually verify this topology in Cisco Packet Tracer:

### Device Inventory
| Device Role | PT Device Model | Display Name | Modules / Slots |
|---|---|---|---|
| Primary Distribution Switch | Cisco Catalyst 2960-24TT | SW-1 | 24 FastEthernet + 2 GigabitEthernet ports |
| Secondary Distribution Switch | Cisco Catalyst 2960-24TT | SW-2 | 24 FastEthernet + 2 GigabitEthernet ports |
| Access Layer Switch | Cisco Catalyst 2960-24TT | SW-3 | 24 FastEthernet + 2 GigabitEthernet ports |
| Distribution Workstation | PC-PT | PC-1 | FastEthernet0 (`192.168.1.10/24`) |
| Access Workstation | PC-PT | PC-2 | FastEthernet0 (`192.168.1.20/24`) |
| Enterprise Application Server | Server-PT | Server-1 | FastEthernet0 (`192.168.1.100/24`) |

### Physical Cabling Matrix
| Link ID | Source Device | Source Port | Destination Device | Destination Port | Cable Type |
|---|---|---|---|---|---|
| L-01 | SW-1 | GigabitEthernet0/1 | SW-2 | GigabitEthernet0/1 | Copper Crossover |
| L-02 | SW-1 | FastEthernet0/1 | SW-3 | FastEthernet0/1 | Copper Crossover |
| L-03 | SW-2 | FastEthernet0/1 | SW-3 | FastEthernet0/2 | Copper Crossover |
| L-04 | SW-1 | FastEthernet0/10 | PC-1 | FastEthernet0 | Copper Straight-Through |
| L-05 | SW-2 | FastEthernet0/10 | Server-1 | FastEthernet0 | Copper Straight-Through |
| L-06 | SW-3 | FastEthernet0/10 | PC-2 | FastEthernet0 | Copper Straight-Through |

---

## 2. Positive Verification Test Matrix

| Test ID | Objective | Command / Procedure | Expected Result | Pass Criteria |
|---|---|---|---|---|
| **POS-01** | Primary Root Bridge Election | `SW-1# show spanning-tree vlan 1` | Displays `This bridge is the root` with Root ID Priority `4097` (priority 4096 sys-id-ext 1). | `SW-1` elected deterministic primary root |
| **POS-02** | Secondary Root Priority | `SW-2# show spanning-tree vlan 1` | Bridge ID Priority displays `8193` (priority 8192 sys-id-ext 1). Root Port is `GigabitEthernet0/1` with cost 4. | `SW-2` configured as deterministic secondary root |
| **POS-03** | Core Trunk Unblocked | `SW-1# show spanning-tree vlan 1`<br>`SW-2# show spanning-tree vlan 1` | `SW-1 Gi0/1` is `Desg FWD` (Cost 4). `SW-2 Gi0/1` is `Root FWD` (Cost 4). Neither core port is blocked. | High-speed distribution transit path fully unblocked |
| **POS-04** | Alternate Blocked Port on Access Uplink | `SW-3# show spanning-tree vlan 1` | `Fa0/1` is `Root FWD` (Cost 19). `Fa0/2` is `Altn BLK` (Cost 19). | Access switch redundant uplink safely breaks the loop |
| **POS-05** | Distribution Workstation to Server Reachability | `PC-1> ping 192.168.1.100` | 4/4 echo replies received with 0% packet loss across core Gigabit link. | Intra-VLAN traffic across core trunk operational |
| **POS-06** | Access Workstation to Server Reachability | `PC-2> ping 192.168.1.100` | 4/4 echo replies received with 0% packet loss through active access uplink. | Intra-VLAN traffic from edge access switch operational |

---

## 3. Negative & Fault Tolerance Test Matrix

| Test ID | Fault Scenario | Injection Procedure | Observed Symptom | Recovery Procedure |
|---|---|---|---|---|
| **NEG-01** | Starter State: Access Root Inversion | In starter topology, execute `show spanning-tree vlan 1` on `SW-3`. | `SW-3` displays `This bridge is the root` with Priority `4097`. An access switch has usurped the root role. | Reconfigure `SW-1` with `spanning-tree vlan 1 priority 4096` and `SW-3` with default `priority 32768`. |
| **NEG-02** | Starter State: Core Link Blocked | In starter topology, execute `show spanning-tree vlan 1` on `SW-1` and `SW-2`. | `SW-1 Gi0/1` is forced into `Altn BLK` (Alternate / Blocked) state. High-bandwidth core link is disabled by STP. | Align bridge priorities across distribution layer to ensure core trunk has lowest root path cost (Cost 4). |

---

## 4. Reload and Persistence Verification

- `completed.pkt` reloaded cleanly via `ipc.appWindow().fileOpen()`.
- Switches `SW-1`, `SW-2`, and `SW-3` preserved startup configurations from NVRAM across reload.
- Core trunk `Gi0/1` verified forwarding, `SW-3 Fa0/2` verified alternate blocked, and full ping reachability confirmed after reload.
- Reopened `starter.pkt` cleanly and confirmed initial faulted root inversion is intact for learner exercise.

