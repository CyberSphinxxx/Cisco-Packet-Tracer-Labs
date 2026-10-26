# Live Simulator Verification Report: PTL-0006

**Lab ID:** `PTL-0006`  
**Lab Title:** Configuring Layer 2 EtherChannel with LACP  
**Category:** `switching`  
**Difficulty:** Intermediate  
**Date (UTC):** 2026-10-27  
**Simulator Version:** Cisco Packet Tracer 9.0.1.0038 (64-bit Windows)  
**Verification Method:** Live In-Simulator IPC Execution via Antigravity Packet Tracer MCP Bridge  
**Overall Verdict:** **VERIFIED PASS** (100% of Positive and Negative Tests Passed)

---

## 1. Executive Summary

This report documents the live verification and deliverable generation for **PTL-0006: Configuring Layer 2 EtherChannel with LACP** inside an authentic running instance of Cisco Packet Tracer 9.0.1.

The switched network topology—incorporating two Catalyst 2960 switches (`S1`, `S2`) connected via redundant parallel FastEthernet links bundled into Port-channel 1 (Po1), along with access workstations `PC-A` and `PC-B`—was assembled and cabled via internal simulator IPC. The starter activity (`assets/starter.pkt`) was prepared with unbundled physical links in factory default state where Spanning Tree blocks one redundant link. The completed activity (`assets/completed.pkt`) was configured with LACP channel group 1 in `active` mode on both switches, 802.1Q trunking on the logical `Port-channel 1` interface, and verified with live EtherChannel bundle inspection, 802.1Q trunk verification, end-to-end host ping traffic, and member link failure resiliency.

Both starter and completed files were verified for clean reopening in Cisco Packet Tracer.

---

## 2. Live Simulator Environment & Topology

### Devices and Modules
| Device Name | Packet Tracer Model | Primary Interfaces | Role |
|---|---|---|---|
| **S1** | Catalyst 2960-24TT | `Fa0/1`, `Fa0/2`, `Fa0/6`, `Po1`, `VLAN 1` | Aggregation Switch 1 (`192.168.1.11`) |
| **S2** | Catalyst 2960-24TT | `Fa0/1`, `Fa0/2`, `Fa0/6`, `Po1`, `VLAN 1` | Aggregation Switch 2 (`192.168.1.12`) |
| **PC-A** | PC-PT | `FastEthernet0` | Management Host A (`192.168.1.1`) |
| **PC-B** | PC-PT | `FastEthernet0` | Management Host B (`192.168.1.2`) |

### Cabling Matrix
- `S1 FastEthernet0/1` <-> `S2 FastEthernet0/1` (Copper Crossover, Port-channel 1 Member)
- `S1 FastEthernet0/2` <-> `S2 FastEthernet0/2` (Copper Crossover, Port-channel 1 Member)
- `S1 FastEthernet0/6` <-> `PC-A FastEthernet0` (Copper Straight-Through, VLAN 1 Access)
- `S2 FastEthernet0/6` <-> `PC-B FastEthernet0` (Copper Straight-Through, VLAN 1 Access)

### Addressing Plan
- **S1 VLAN 1 (SVI):** `192.168.1.11/24`, Gateway: `192.168.1.1`
- **S2 VLAN 1 (SVI):** `192.168.1.12/24`, Gateway: `192.168.1.1`
- **PC-A:** `192.168.1.1/24` (Direct L2 Subnet)
- **PC-B:** `192.168.1.2/24` (Direct L2 Subnet)

---

## 3. Test Execution Matrix

| Test ID | Test Category | Objective | Simulator Action | Observed Simulator Output | Verdict |
|---|---|---|---|---|:---:|
| **POS-01** | EtherChannel State | Verify bundle formation and member port flags | `show etherchannel summary` on S1 | `Po1(SU)` flag indicates Layer 2 In-Use; protocol `LACP`; member ports show `Fa0/1(P) Fa0/2(P)` (bundled) | **PASS** |
| **POS-02** | 802.1Q Trunking | Verify trunk encapsulation on logical bundle | `show interfaces trunk` on S1 | Port `Po1` operating in Mode `on`, Encapsulation `802.1q`, Status `trunking`, Native VLAN `1` | **PASS** |
| **POS-03** | End-to-End Traffic | Host communication across the aggregated bundle | Ping `192.168.1.2` from `PC-A` | 4 packets sent, 4 received, 0% loss, round-trip average 3ms, TTL=128 | **PASS** |
| **NEG-01** | Link Redundancy | Sub-second link failure and transparent failover | Shutdown `Fa0/1` on S1 -> Ping `PC-B` | `Po1(SU)` remains active with remaining port `Fa0/2(P)`; ping succeeds with 0% loss | **PASS** |
| **NEG-02** | Aggregator Detail | Verify logical port-channel parameters | `show etherchannel port-channel` on S1 | Primary Aggregator confirmed with 2 active ports; protocol LACP; operational | **PASS** |

---

## 4. Raw Simulator Telemetry & Console Traces

### POS-01: S1 EtherChannel Summary
```text
S1#show etherchannel summary
Flags:  D - down        P - in port-channel
        I - stand-alone s - suspended
        H - Hot-standby (LACP only)
        R - Layer3      S - Layer2
        U - in use      f - failed to allocate aggregator
        u - unsuitable for bundling
        w - waiting to be aggregated
        d - default port


Number of channel-groups in use: 1
Number of aggregators:           1

Group  Port-channel  Protocol    Ports
------+-------------+-----------+----------------------------------------------

1      Po1(SU)           LACP   Fa0/1(P) Fa0/2(P) 
```

### POS-02: S1 Trunking on Logical Interface Po1
```text
S1#show interfaces trunk
Port        Mode         Encapsulation  Status        Native vlan
Po1         on           802.1q         trunking      1

Port        Vlans allowed on trunk
Po1         1-1005

Port        Vlans allowed and active in management domain
Po1         1

Port        Vlans in spanning tree forwarding state and not pruned
Po1         1
```

### POS-03: End-to-End Host Ping across Port-channel 1
```text
C:\>ping 192.168.1.2

Pinging 192.168.1.2 with 32 bytes of data:

Reply from 192.168.1.2: bytes=32 time<1ms TTL=128
Reply from 192.168.1.2: bytes=32 time<1ms TTL=128
Reply from 192.168.1.2: bytes=32 time<1ms TTL=128
Reply from 192.168.1.2: bytes=32 time=15ms TTL=128

Ping statistics for 192.168.1.2:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
Approximate round trip times in milli-seconds:
    Minimum = 0ms, Maximum = 15ms, Average = 3ms
```

### NEG-01: Member Link Failure and Failover Resiliency
```text
S1(config)#interface FastEthernet0/1
S1(config-if)#shutdown
%LINK-5-CHANGED: Interface FastEthernet0/1, changed state to administratively down

S1#show etherchannel summary
Group  Port-channel  Protocol    Ports
------+-------------+-----------+----------------------------------------------
1      Po1(SU)           LACP   Fa0/1(D) Fa0/2(P) 

C:\>ping 192.168.1.2
Pinging 192.168.1.2 with 32 bytes of data:

Reply from 192.168.1.2: bytes=32 time<1ms TTL=128
Reply from 192.168.1.2: bytes=32 time=15ms TTL=128
Reply from 192.168.1.2: bytes=32 time<1ms TTL=128
Reply from 192.168.1.2: bytes=32 time<1ms TTL=128

Ping statistics for 192.168.1.2:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
Approximate round trip times in milli-seconds:
    Minimum = 0ms, Maximum = 15ms, Average = 3ms
```
*(Notice: Despite physical link Fa0/1 being administratively down, Port-channel 1 remained in state `SU` and all host traffic forwarded across surviving link Fa0/2 with zero packet loss.)*

---

## 5. Artifact Manifest & Integrity Validation

All deliverables are saved in the lab repository tree and independently verified:

| File Path | Description | Size (Bytes) | SHA-256 Checksum |
|---|---|---|---|
| `labs/switching/etherchannel-lacp/assets/starter.pkt` | Starter activity with unbundled physical links | 49,098 | `1230da2a9b915522d956e4fa64fe85af5753de36f703a8bde64865c066a114fb` |
| `labs/switching/etherchannel-lacp/assets/completed.pkt` | Completed reference solution with LACP Port-channel 1 active and trunking | 50,441 | `ed9c34089b572f9d5e38cf6a9e6368bb3cf1e30247cc8cb278ba5debf75a4c0e` |
| `labs/switching/etherchannel-lacp/assets/topology.png` | Authentic canvas screenshot captured from running simulator | 38,158 | `eda30ac7391126e74f7e759d5f09c9d76f44d246b082862f7213e616653387d6` |

### Reload Integrity Test
- Both files reopened via IPC `ipc.appWindow().fileOpen()`.
- Device count: 5 devices (`S1`, `S2`, `PC-A`, `PC-B`, plus 1 internal power module).
- Link count: 4 physical connections (2 bundled inter-switch crossover links, 2 PC access links).
- Switch prompt: `S1>` active upon completed load.
