# Verification and Acceptance Matrix — PTL-0044

**Lab ID:** PTL-0044  
**Title:** VLAN Trunk Allowed-List Troubleshooting  
**Status:** `TESTED_PASS` (Verified live in Cisco Packet Tracer 9.0.1 via MCP loopback bridge automation)

---

## 1. Packet Tracer Topology Construction Manifest

To construct or manually verify this topology in Cisco Packet Tracer:

### Device Inventory
| Device Role | PT Device Model | Display Name | Modules / Slots |
|---|---|---|---|
| Distribution Switch 1 | Cisco Catalyst 2960-24TT | SW-1 | 24 FastEthernet + 2 GigabitEthernet ports |
| Distribution Switch 2 | Cisco Catalyst 2960-24TT | SW-2 | 24 FastEthernet + 2 GigabitEthernet ports |
| Engineering Workstation 1 | PC-PT | PC-Eng1 | FastEthernet0 (`192.168.10.10/24`, VLAN 10) |
| Marketing Workstation 1 | PC-PT | PC-Mkt1 | FastEthernet0 (`192.168.20.10/24`, VLAN 20) |
| Operations Workstation 1 | PC-PT | PC-Ops1 | FastEthernet0 (`192.168.30.10/24`, VLAN 30) |
| Engineering Workstation 2 | PC-PT | PC-Eng2 | FastEthernet0 (`192.168.10.20/24`, VLAN 10) |
| Marketing Workstation 2 | PC-PT | PC-Mkt2 | FastEthernet0 (`192.168.20.20/24`, VLAN 20) |
| Operations Workstation 2 | PC-PT | PC-Ops2 | FastEthernet0 (`192.168.30.20/24`, VLAN 30) |

### Physical Cabling Matrix
| Link ID | Source Device | Source Port | Destination Device | Destination Port | Cable Type |
|---|---|---|---|---|---|
| L-01 | SW-1 | GigabitEthernet0/1 | SW-2 | GigabitEthernet0/1 | Copper Crossover |
| L-02 | SW-1 | FastEthernet0/10 | PC-Eng1 | FastEthernet0 | Copper Straight-Through |
| L-03 | SW-1 | FastEthernet0/20 | PC-Mkt1 | FastEthernet0 | Copper Straight-Through |
| L-04 | SW-1 | FastEthernet0/15 | PC-Ops1 | FastEthernet0 | Copper Straight-Through |
| L-05 | SW-2 | FastEthernet0/10 | PC-Eng2 | FastEthernet0 | Copper Straight-Through |
| L-06 | SW-2 | FastEthernet0/20 | PC-Mkt2 | FastEthernet0 | Copper Straight-Through |
| L-07 | SW-2 | FastEthernet0/15 | PC-Ops2 | FastEthernet0 | Copper Straight-Through |

---

## 2. Positive Verification Test Matrix

| Test ID | Objective | Command / Procedure | Expected Result | Pass Criteria |
|---|---|---|---|---|
| **POS-01** | Inter-Switch Trunk Operational Mode | `SW-1# show interfaces GigabitEthernet0/1 switchport`<br>`SW-2# show interfaces GigabitEthernet0/1 switchport` | Both switches display `Administrative Mode: trunk` and `Operational Mode: trunk`. Negotiation of Trunking is `Off`. | Trunk link statically established and operational |
| **POS-02** | Native VLAN Alignment | `SW-1# show interfaces trunk`<br>`SW-2# show interfaces trunk` | Both switches show Native VLAN `99` on `GigabitEthernet0/1`. | Native VLANs match; no VLAN leakage or CDP mismatch warnings |
| **POS-03** | Allowed VLAN List Consistency | `SW-1# show interfaces trunk`<br>`SW-2# show interfaces trunk` | Both switches show `10,20,30,99` under `Vlans allowed on trunk`. | All intended corporate VLANs allowed across trunk |
| **POS-04** | VLAN 10 (Engineering) Reachability | `PC-Eng1> ping 192.168.10.20` | 4/4 echo replies received with 0% packet loss. | Intra-VLAN 10 communication functioning across trunk |
| **POS-05** | VLAN 20 (Marketing) Reachability | `PC-Mkt1> ping 192.168.20.20` | 4/4 echo replies received with 0% packet loss. | Intra-VLAN 20 communication functioning across trunk |
| **POS-06** | VLAN 30 (Operations) Reachability | `PC-Ops1> ping 192.168.30.20` | 4/4 echo replies received with 0% packet loss. | Intra-VLAN 30 communication restored across trunk |
| **POS-07** | Layer 2 Inter-VLAN Isolation | `PC-Eng1> ping 192.168.20.10` | Request timed out (100% loss). | Proper Layer 2 broadcast domain segmentation maintained |

---

## 3. Negative & Fault Tolerance Test Matrix

| Test ID | Fault Scenario | Injection Procedure | Observed Symptom | Recovery Procedure |
|---|---|---|---|---|
| **NEG-01** | Starter State: Pruned VLAN 30 | In starter topology, test ping from `PC-Ops1` to `PC-Ops2` (`ping 192.168.30.20`). | Returns `Request timed out` (100% loss). VLAN 30 frames are pruned at SW-1's trunk port. | Execute `interface GigabitEthernet0/1` and `switchport trunk allowed vlan add 30` on SW-1. |
| **NEG-02** | Starter State Fault Identification | On `SW-1` and `SW-2`, run `show interfaces trunk` and `show interfaces switchport`. | SW-1 allows only `10,20,99` (VLAN 30 omitted). SW-2 trunk is configured with Native VLAN 1 instead of 99. | Align Native VLAN on SW-2 with `switchport trunk native vlan 99` and add VLAN 30 to SW-1 trunk allowed list. |

---

## 4. Reload and Persistence Verification

- `completed.pkt` reloaded cleanly via `ipc.appWindow().fileOpen()`.
- Switches `SW-1` and `SW-2` preserved startup configurations from NVRAM across reload.
- Full intra-VLAN reachability across all three VLANs confirmed after reload.
- Reopened `starter.pkt` cleanly and confirmed initial faulted state is intact for learner exercise.

