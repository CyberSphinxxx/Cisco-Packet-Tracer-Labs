# Verification and Acceptance Matrix — PTL-0007

**Lab ID:** PTL-0007  
**Title:** Cisco Switch Security Hardening Best Practices  
**Status:** `TESTED_PASS` (Verified live in Cisco Packet Tracer 9.0.1 via MCP loopback bridge automation)

---

## 1. Packet Tracer Topology Construction Manifest

To construct or manually verify this topology in Cisco Packet Tracer:

### Device Inventory
| Device Role | PT Device Model | Display Name | Modules / Slots |
|---|---|---|---|
| Hardened Access Switch | Cisco Catalyst 2960-24TT | S1 | 24 FastEthernet + 2 GigabitEthernet ports |
| Upstream Distribution Switch | Cisco Catalyst 2960-24TT | Upstream-Switch | 24 FastEthernet + 2 GigabitEthernet ports |
| Authorized Workstation | PC-PT | User-PC | FastEthernet0 |
| Rogue Testing Switch | Cisco Catalyst 2960-24TT | Rogue-Switch | FastEthernet0/1 (BPDU test) |

### Physical Cabling Matrix
| Link ID | Source Device | Source Port | Destination Device | Destination Port | Cable Type | Notes |
|---|---|---|---|---|---|---|
| L-01 | User-PC | FastEthernet0 | S1 | FastEthernet0/1 | Copper Straight-Through | User access port (VLAN 10) |
| L-TRUNK | S1 | GigabitEthernet0/1 | Upstream-Switch | GigabitEthernet0/1 | Copper Straight-Through | Hardened 802.1Q trunk (Native VLAN 999) |
| L-TEST | Rogue-Switch | FastEthernet0/1 | S1 | FastEthernet0/1 | Copper Straight-Through | Used for BPDU Guard violation test |

### Addressing Setup
- **S1 (SVI VLAN 10):** IP: `192.168.10.2`, Subnet Mask: `255.255.255.0`, Default Gateway: `192.168.10.1`
- **User-PC:** IP: `192.168.10.50`, Subnet Mask: `255.255.255.0`, Default Gateway: `192.168.10.1`

---

## 2. Positive Verification Test Matrix

| Test ID | Objective | Command / Procedure | Expected Result | Pass Criteria |
|---|---|---|---|---|
| **V-01** | Verify VLAN Allocation & Quarantine | `S1# show vlan brief` | VLAN 10 (User_Data) has port `Fa0/1`. VLAN 99 (Parking_Lot) has ports `Fa0/2 - Fa0/24, Gi0/2`. VLAN 999 (Native_Blackhole) is created with no assigned access ports. Default VLAN 1 has no active user ports. | Clean segregation into data, parking lot, and blackhole |
| **V-02** | Verify Hardened Trunk Configuration | `S1# show interfaces gigabitEthernet0/1 switchport` | Displays:<br>`Administrative Mode: trunk`<br>`Operational Mode: trunk`<br>`Negotiation of Trunking: Off`<br>`Trunking Native Mode VLAN: 999 (Native_Blackhole)`<br>`Trunking VLANs Enabled: 10,20`. | DTP disabled, non-default native VLAN, strict VLAN pruning |
| **V-03** | Verify PortFast Operational Status | `S1# show spanning-tree interface FastEthernet0/1 portfast` | PortFast is reported as `enabled` on FastEthernet0/1. Upon cable connection, link transitions immediately to Forwarding state without 30-second delay. | Immediate forwarding on edge port |
| **V-04** | Verify BPDU Guard Status | `S1# show running-config interface FastEthernet0/1` | Output includes `spanning-tree bpduguard enable`. | BPDU Guard active on access port |
| **V-05** | Verify Quarantined Port Administrative Status | `S1# show ip interface brief \| include FastEthernet0/` | Ports `Fa0/2` through `Fa0/24` display `administratively down` and `down`. | All unused ports disabled |

---

## 3. Negative & Attack Mitigation Test Matrix

| Test ID | Threat Scenario | Attack Procedure | Observed Mitigation | Pass Criteria |
|---|---|---|---|---|
| **NEG-01** | DTP Switch Spoofing Attack | Connect a rogue device attempting to negotiate trunking via Dynamic Desirable on S1 Fa0/1 or Gi0/1. | Because `switchport nonegotiate` is active, the switch sends no DTP packets and ignores incoming DTP frames. Port remains in its hardcoded mode. | Rogue trunk negotiation failed |
| **NEG-02** | Rogue Switch BPDU Guard Violation | 1. Disconnect User-PC from Fa0/1.<br>2. Connect Rogue-Switch Fa0/1 to S1 Fa0/1.<br>3. Power on Rogue-Switch. | Rogue switch sends Spanning Tree BPDU. S1 detects BPDU on PortFast port and outputs:<br>`%SPANTREE-2-BLOCK_BPDUGUARD: Received BPDU on port Fa0/1 with BPDU Guard enabled. Disabling port.`<br>Port Fa0/1 is placed into `err-disable`. | Immediate defense against unauthorized bridge insertion |
| **NEG-03** | Unused Port Unauthorized Tap | Connect a laptop to any unconfigured port (e.g., Fa0/15). | Link LED remains dark. Port is administratively shut down and assigned to unrouted VLAN 99. No traffic can flow. | Physical tap blocked |

---

## 4. Save and Persistence Verification Check

1. On S1, execute `copy running-config startup-config`.
2. Save the topology file (`.pkt`).
3. Reload the switch.
4. Issue `show vlan brief` and `show interfaces trunk` to verify VLAN assignments, trunk native VLAN, and PortFast / BPDU Guard configurations persist intact.
