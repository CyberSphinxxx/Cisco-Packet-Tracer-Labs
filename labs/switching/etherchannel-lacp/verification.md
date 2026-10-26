# Verification & Packet Tracer Assembly Guide: PTL-0006

**Lab ID:** `PTL-0006`  
**Lab Title:** Configuring Layer 2 EtherChannel with LACP  
**Category:** `switching`  
**Difficulty:** Intermediate  

---

## 1. Physical & Packet Tracer Assembly Manifest

### Device Hardware & Module Schedule
| Device Role | Device Label | Packet Tracer Model | Module Slots | Software / IOS Version |
|---|---|---|---|---|
| Aggregation Switch 1 | **S1** | Cisco Catalyst 2960-24TT | 24x 10/100 FastEthernet, 2x Gigabit | Cisco IOS 15.0(2)SE4 (LAN Base) |
| Aggregation Switch 2 | **S2** | Cisco Catalyst 2960-24TT | 24x 10/100 FastEthernet, 2x Gigabit | Cisco IOS 15.0(2)SE4 (LAN Base) |
| Management PC 1 | **PC-A** | PC-PT | 1x FastEthernet | Generic Host OS |
| Management PC 2 | **PC-B** | PC-PT | 1x FastEthernet | Generic Host OS |

### Port-to-Port Cabling Matrix
| Origin Device | Origin Port | Destination Device | Destination Port | Bundle Role | Cable Type |
|---|---|---|---|---|---|
| **Switch S1** | `FastEthernet0/1` | **Switch S2** | `FastEthernet0/1` | Port-Channel 1 Member | Copper Crossover (or Auto-MDIX Straight) |
| **Switch S1** | `FastEthernet0/2` | **Switch S2** | `FastEthernet0/2` | Port-Channel 1 Member | Copper Crossover (or Auto-MDIX Straight) |
| **Switch S1** | `FastEthernet0/6` | **PC-A** | `FastEthernet0` | Access Port (VLAN 1) | Copper Straight-Through |
| **Switch S2** | `FastEthernet0/6` | **PC-B** | `FastEthernet0` | Access Port (VLAN 1) | Copper Straight-Through |

### Addressing Table
| Device | Interface | IPv4 Address | Subnet Mask | Default Gateway |
|---|---|---|---|---|
| **S1** | VLAN 1 (SVI) | `192.168.1.11` | `255.255.255.0` | `192.168.1.1` |
| **S2** | VLAN 1 (SVI) | `192.168.1.12` | `255.255.255.0` | `192.168.1.1` |
| **PC-A** | FastEthernet0 | `192.168.1.1` | `255.255.255.0` | N/A |
| **PC-B** | FastEthernet0 | `192.168.1.2` | `255.255.255.0` | N/A |

---

## 2. Pre-Configuration & Starter State

In the starter state (`starter`):
- Dual physical links connect S1 and S2 on `Fa0/1` and `Fa0/2`.
- Without EtherChannel, Spanning Tree Protocol (STP) blocks one link to prevent Layer 2 loops (one amber LED, one green LED). Total bandwidth is constrained to 100 Mbps.
- Student must configure 802.3ad LACP (`channel-group 1 mode active` on both switches), verify the formation of logical interface `Port-channel 1`, observe both physical ports transition to forwarding green LEDs, and verify aggregate 200 Mbps full-duplex throughput.

Complete reference configurations:
- [`configs/S1.txt`](configs/S1.txt)
- [`configs/S2.txt`](configs/S2.txt)

---

## 3. Positive Verification Tests

### Test POS-01: EtherChannel Summary Verification
- **Action:** At `S1#`, issue `show etherchannel summary`.
- **Expected Terminal Output:**
  ```text
  S1# show etherchannel summary
  Flags:  D - down        P - in port-channel
          I - stand-alone s - suspended
          H - Hot-standby (LACP only)
          R - Layer3      S - Layer2
          U - in use      f - failed to allocate aggregator
  ...
  Group  Port-channel  Protocol    Ports
  ------+-------------+-----------+-----------------------------------------------
  1      Po1(SU)         LACP      Fa0/1(P)    Fa0/2(P)    
  ```
- **Criterion:**
  - Port-channel flag shows `(SU)`: `S` = Layer2, `U` = In Use.
  - Protocol shows `LACP`.
  - Both physical member ports show `(P)` = In Port-channel.

### Test POS-02: Port-Channel Trunking Status
- **Action:** At `S1#`, issue `show interfaces trunk`.
- **Expected Terminal Output:**
  ```text
  S1# show interfaces trunk
  Port        Mode             Encapsulation  Status        Native vlan
  Po1         on               802.1q         trunking      1
  ```
- **Criterion:** Logical interface `Po1` is operating as an 802.1Q trunk.

### Test POS-03: End-to-End Host Communication Across the Bundle
- **Action:** From `PC-A` (`192.168.1.1`), ping `PC-B` (`192.168.1.2`).
- **Expected Terminal Output:**
  ```text
  C:\> ping 192.168.1.2
  Reply from 192.168.1.2: bytes=32 time<1ms TTL=128
  Reply from 192.168.1.2: bytes=32 time<1ms TTL=128
  Reply from 192.168.1.2: bytes=32 time<1ms TTL=128
  Reply from 192.168.1.2: bytes=32 time<1ms TTL=128
  ```
- **Criterion:** 100% packet success across the Port-Channel.

---

## 4. Negative Verification Tests

### Test NEG-01: Link Failover & Redundancy Test
- **Action:** While running continuous ping from `PC-A`, shut down physical member link `Fa0/1` on Switch S1 (`interface Fa0/1` -> `shutdown`).
- **Expected Behavior:**
  - Terminal logs: `%LINK-5-CHANGED: Interface FastEthernet0/1, changed state to administratively down`
  - Re-issue `show etherchannel summary`: Port-channel `Po1(SU)` remains in use with `Fa0/2(P)` carrying all traffic.
  - Ping experiences at most 1 dropped packet during failover, then resumes successfully.

### Test NEG-02: LACP Mode Incompatibility Test
- **Action:** Change `S1` to `channel-group 1 mode passive` and `S2` to `channel-group 1 mode passive`.
- **Expected Behavior:**
  - When both ends are configured in `passive` mode, neither switch initiates LACP negotiation.
  - `show etherchannel summary` shows `Po1(SD)` (`D` = down), and member ports show `(I)` (stand-alone).

---

## 5. Diagnostic & Troubleshooting Reference

| Symptom | Root Cause | Remediation Command |
|---|---|---|
| Port-channel shows `(SD)` (Down) | Speed/duplex mismatch on member physical ports | Ensure both `Fa0/1` and `Fa0/2` have identical speed (`100`) and duplex (`full`). |
| One port shows `(s)` (suspended) | Port trunking mode or native VLAN mismatch | Verify both ports have identical trunk encapsulation and native VLAN settings. |
| Spanning tree blocking one physical port | EtherChannel bundle failed to form | Re-verify `channel-group 1 mode active` is configured on both switches. |
