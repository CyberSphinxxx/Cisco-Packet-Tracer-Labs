# Verification and Acceptance Matrix — PTL-0046

**Lab ID:** PTL-0046  
**Title:** LACP EtherChannel Member Mismatch Diagnosis  
**Status:** `TESTED_PASS` (Verified live in Cisco Packet Tracer 9.0.1 via MCP loopback bridge automation)

---

## 1. Packet Tracer Topology Construction Manifest

To construct or manually verify this topology in Cisco Packet Tracer:

### Device Inventory
| Device Role | PT Device Model | Display Name | Modules / Slots |
|---|---|---|---|
| Distribution Switch 1 | Cisco Catalyst 2960-24TT | SW-1 | 24 FastEthernet + 2 GigabitEthernet ports |
| Distribution Switch 2 | Cisco Catalyst 2960-24TT | SW-2 | 24 FastEthernet + 2 GigabitEthernet ports |
| Engineering PC 1 | PC-PT | PC-1 | FastEthernet0 (`192.168.10.10/24`, VLAN 10) |
| Marketing PC 1 | PC-PT | PC-2 | FastEthernet0 (`192.168.20.10/24`, VLAN 20) |
| Engineering PC 2 | PC-PT | PC-3 | FastEthernet0 (`192.168.10.20/24`, VLAN 10) |
| Marketing PC 2 | PC-PT | PC-4 | FastEthernet0 (`192.168.20.20/24`, VLAN 20) |

### Physical Cabling Matrix
| Link ID | Source Device | Source Port | Destination Device | Destination Port | Cable Type |
|---|---|---|---|---|---|
| L-01 | SW-1 | FastEthernet0/1 | SW-2 | FastEthernet0/1 | Copper Crossover |
| L-02 | SW-1 | FastEthernet0/2 | SW-2 | FastEthernet0/2 | Copper Crossover |
| L-03 | SW-1 | FastEthernet0/10 | PC-1 | FastEthernet0 | Copper Straight-Through |
| L-04 | SW-1 | FastEthernet0/20 | PC-2 | FastEthernet0 | Copper Straight-Through |
| L-05 | SW-2 | FastEthernet0/10 | PC-3 | FastEthernet0 | Copper Straight-Through |
| L-06 | SW-2 | FastEthernet0/20 | PC-4 | FastEthernet0 | Copper Straight-Through |

---

## 2. Positive Verification Test Matrix

| Test ID | Objective | Command / Procedure | Expected Result | Pass Criteria |
|---|---|---|---|---|
| **POS-01** | EtherChannel Logical Interface State | `SW-1# show etherchannel summary`<br>`SW-2# show etherchannel summary` | Both switches display `Po1(SU)` indicating Layer 2 operational status (`S`) and in-use status (`U`). | Logical Port-channel 1 is up and functioning |
| **POS-02** | Member Interface Bundling State | `SW-1# show etherchannel summary`<br>`SW-2# show etherchannel summary` | Both switches display `Fa0/1(P)` and `Fa0/2(P)` indicating member interfaces are bundled in port-channel. | Dual physical links aggregated into active bundle |
| **POS-03** | LACP Protocol Negotiation | `SW-1# show etherchannel port-channel`<br>`SW-2# show etherchannel port-channel` | Both switches display `Protocol = LACP` and report 2 active bundled ports. | IEEE 802.3ad negotiation verified across both peers |
| **POS-04** | VLAN 10 (Engineering) Reachability | `PC-1> ping 192.168.10.20` | 4/4 echo replies received with 0% packet loss. | Intra-VLAN 10 frames transported across EtherChannel trunk |
| **POS-05** | VLAN 20 (Marketing) Reachability | `PC-2> ping 192.168.20.20` | 4/4 echo replies received with 0% packet loss. | Intra-VLAN 20 frames transported across EtherChannel trunk |
| **POS-06** | Layer 2 Inter-VLAN Isolation | `PC-1> ping 192.168.20.10` | Request timed out (100% loss). | Proper Layer 2 broadcast domain isolation maintained |

---

## 3. Negative & Fault Tolerance Test Matrix

| Test ID | Fault Scenario | Injection Procedure | Observed Symptom | Recovery Procedure |
|---|---|---|---|---|
| **NEG-01** | Starter State: Member Port Mode Mismatch | In starter topology, execute `show etherchannel summary` and `show interfaces FastEthernet0/2 switchport` on `SW-2`. | `Fa0/2` is not bundled `(P)` in `Po1`. `Fa0/2` switchport mode is `static access` in VLAN 10, conflicting with trunk Port-channel 1. | Reconfigure `SW-2 Fa0/2` as trunk: `switchport mode trunk`, `switchport trunk native vlan 99`, `switchport trunk allowed vlan 10,20,99`. |
| **NEG-02** | Starter State: Degraded Bundle Capacity | In starter topology, execute `show etherchannel port-channel` on `SW-2`. | Switch reports only 1 active port bundled in group (degraded link capacity). | Align interface parameters on `Fa0/2` to match `Port-channel 1` and let LACP negotiate member inclusion. |

---

## 4. Reload and Persistence Verification

- `completed.pkt` reloaded cleanly via `ipc.appWindow().fileOpen()`.
- Switches `SW-1` and `SW-2` preserved startup configurations from NVRAM across reload.
- Full intra-VLAN reachability across VLAN 10 and VLAN 20 confirmed after reload.
- Reopened `starter.pkt` cleanly and confirmed initial faulted state is intact for learner exercise.

