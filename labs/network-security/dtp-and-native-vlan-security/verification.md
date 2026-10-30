# PTL-0018: Verification Protocol & Simulation Test Results

**Lab ID**: PTL-0018
**Topic**: Dynamic Trunking Protocol and Native VLAN Security
**Simulator**: Cisco Packet Tracer 9.0.1 (Localhost IPC Bridge)
**Execution Timestamp**: 2026-10-31 01:47:27
**Status**: `tested_pass`

## 1. Test Summary Matrix

| Test ID | Test Description | Command / Action | Expected Result | Simulator Result | Status |
|---|---|---|---|---|---|
| **NEG-01** | Default Dynamic Auto Trunk Failure | `show interfaces Gi0/1 switchport` | Both sides in `dynamic auto` remain in `static access` operational mode; no trunk formed | `Administrative Mode: dynamic auto`, `Operational Mode: static access` | PASS |
| **POS-01** | Dynamic Desirable Trunk Negotiation | `switchport mode dynamic desirable` on S1 | S1 solicits trunking; S2 (`dynamic auto`) transitions to operational `trunk` | Operational Mode transitions to `trunk`, encapsulation `dot1q` | PASS |
| **POS-02** | Permanent Manual 802.1Q Trunk | `switchport mode trunk` on S1 & S2 | `show interfaces trunk` reports `Mode: on`, `Status: trunking` | `Port: Gig0/1, Mode: on, Status: trunking` on both switches | PASS |
| **POS-04** | Explicit Allowed VLAN List Pruning | `switchport trunk allowed vlan 10,20,999` | Only VLANs 10, 20, and 999 are active and forwarding across trunk | `Vlans allowed on trunk: 10,20,999` | PASS |
| **NEG-03** | Native VLAN Mismatch Diagnostics | S1 native 999 vs S2 native 1 | CDP reports mismatch syslog; PVST+ blocks port with inconsistent local VLAN | `%CDP-4-NATIVE_VLAN_MISMATCH` and `%SPANTREE-2-BLOCK_PVID_LOCAL` triggered | PASS |
| **POS-05** | Native VLAN 999 Consistency | S1 & S2 native 999 | CDP and PVST+ unblock port; trunk forwards cleanly on native 999 | Native VLAN reports `999` on both ends, port unblocked | PASS |
| **POS-03** | Intra-VLAN Cross-Switch Reachability | `ping 192.168.10.20` (PC1->PC3) & `ping 192.168.20.20` (PC2->PC4) | 100% ping success across 802.1Q trunk | 4/4 replies received on both VLAN 10 and VLAN 20 | PASS |
| **NEG-02** | Inter-VLAN Layer 2 Segmentation | `ping 192.168.20.10` from PC1 (VLAN 10) | Packets dropped (Request timed out); strict Layer 2 isolation | 0/4 replies received (100% loss) | PASS |
| **NEG-04** | Allowed VLAN Pruning Verification | `switchport trunk allowed vlan remove 10` on S1 | PC1->PC3 traffic blocked immediately, while PC2->PC4 on VLAN 20 remains unaffected | PC1 pings fail (0/4); PC2 pings succeed (4/4); restoring VLAN 10 restores traffic | PASS |
| **POS-06** | DTP Suppression via `nonegotiate` | `switchport nonegotiate` on S1 & S2 | DTP frame generation disabled; trunk remains unconditionally operational | `Negotiation of Trunking: Off` verified on both switches | PASS |

---

## 2. Detailed Test Cases

### NEG-01: Default Dynamic Auto Negotiation Behavior
- **Action**: Connect S1 `Gi0/1` to S2 `Gi0/1` with default switch configuration.
- **Verification Command**: `show interfaces GigabitEthernet0/1 switchport`
- **Output Observed**:
  ```text
  Name: Gig0/1
  Switchport: Enabled
  Administrative Mode: dynamic auto
  Operational Mode: static access
  Administrative Trunking Encapsulation: dot1q
  Operational Trunking Encapsulation: native
  Negotiation of Trunking: On
  ```
- **Conclusion**: Both switches default to `dynamic auto`. Neither transmits DTP frames, resulting in a static access link.

### POS-01: Dynamic Desirable + Dynamic Auto Negotiation
- **Action**: Execute `switchport mode dynamic desirable` on S1 `Gi0/1`.
- **Verification Command**: `show interfaces GigabitEthernet0/1 switchport` on S2
- **Output Observed**:
  ```text
  Name: Gig0/1
  Switchport: Enabled
  Administrative Mode: dynamic auto
  Operational Mode: trunk
  Administrative Trunking Encapsulation: dot1q
  Operational Trunking Encapsulation: dot1q
  Negotiation of Trunking: On
  ```
- **Conclusion**: S1 actively solicited a trunk, causing S2 to negotiate and transition into an operational 802.1Q trunk.

### POS-02 & POS-04: Static Trunking & Allowed List
- **Action**: Configure `switchport mode trunk` and `switchport trunk allowed vlan 10,20,999` on both switches.
- **Verification Command**: `show interfaces trunk`
- **Output Observed**:
  ```text
  Port        Mode         Encapsulation  Status        Native vlan
  Gig0/1      on           802.1q         trunking      1

  Port        Vlans allowed on trunk
  Gig0/1      10,20,999
  ```
- **Conclusion**: Permanent trunk mode enforced and unneeded VLAN broadcast propagation pruned.

### NEG-03: Native VLAN Mismatch Diagnostics
- **Action**: Set S1 `Gi0/1` native VLAN to 999 while S2 remains at VLAN 1.
- **Console Capture Observed**:
  ```text
  %CDP-4-NATIVE_VLAN_MISMATCH: Native VLAN mismatch discovered on GigabitEthernet0/1 (999), with S2 GigabitEthernet0/1 (1).
  %SPANTREE-2-RECV_PVID_ERR: Received BPDU with inconsistent peer vlan id 1 on GigabitEthernet0/1 VLAN999.
  %SPANTREE-2-BLOCK_PVID_LOCAL: Blocking GigabitEthernet0/1 on VLAN0999. Inconsistent local vlan.
  ```
- **Conclusion**: Cisco CDP and PVST+ successfully detect the misconfiguration and block the port to prevent inter-VLAN leaking.

### POS-03, POS-05, NEG-02, NEG-04: Traffic Verification & Pruning
- **Intra-VLAN Reachability (POS-03 & POS-05)**:
  - PC1 (192.168.10.10) to PC3 (192.168.10.20): 4/4 replies received (`time<1ms`).
  - PC2 (192.168.20.10) to PC4 (192.168.20.20): 4/4 replies received (`time<1ms`).
- **Inter-VLAN Isolation (NEG-02)**:
  - PC1 (VLAN 10) to PC2 (VLAN 20): 100% packet loss (Request timed out).
- **Allowed List Pruning (NEG-04)**:
  - After `switchport trunk allowed vlan remove 10` on S1, PC1 ping to PC3 drops completely (0/4 replies).
  - PC2 ping to PC4 (VLAN 20) continues without packet loss (4/4 replies).
  - After `switchport trunk allowed vlan add 10`, PC1 ping to PC3 immediately recovers (4/4 replies).

### POS-06: DTP Negotiation Disabled
- **Action**: Execute `switchport nonegotiate` on both `Gi0/1` interfaces.
- **Verification Command**: `show interfaces GigabitEthernet0/1 switchport | include Negotiation`
- **Output Observed**:
  ```text
  Negotiation of Trunking: Off
  ```
- **Conclusion**: Switchport ceases transmission of DTP negotiation frames, protecting the switch from rogue DTP spoofing while continuing to forward IEEE 802.1Q tagged frames.

---

## 3. Simulator Evidence Reference

The complete, unabridged Cisco Packet Tracer CLI session capture is preserved in:
[AI_AGENT_GUIDE/state/PTL-0018-SIMULATOR-RESULTS.md](../../../AI_AGENT_GUIDE/state/PTL-0018-SIMULATOR-RESULTS.md)
