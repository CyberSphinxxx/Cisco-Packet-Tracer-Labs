# Live Simulator Verification Report: PTL-0009

**Lab ID:** `PTL-0009`  
**Lab Title:** VLAN Segmentation and Access Port Configuration  
**Category:** `switching`  
**Difficulty:** Beginner  
**Date (UTC):** 2026-10-27  
**Simulator Version:** Cisco Packet Tracer 9.0.1.0038 (64-bit Windows)  
**Verification Method:** Live In-Simulator IPC Execution via Antigravity Packet Tracer MCP Bridge  
**Overall Verdict:** **VERIFIED PASS** (100% of Positive and Negative Tests Passed)

---

## 1. Executive Summary

This report documents the live verification and deliverable generation for **PTL-0009: VLAN Segmentation and Access Port Configuration** inside an authentic running instance of Cisco Packet Tracer 9.0.1.

The switched access topology—incorporating Catalyst 2960 switch `S1` and four host workstations divided across two departments (`PC-Faculty-1`, `PC-Faculty-2` in VLAN 10; `PC-Student-1`, `PC-Student-2` in VLAN 20)—was assembled and cabled via internal simulator IPC. The starter activity (`assets/starter.pkt`) was prepared with the factory-default switch state where all 24 FastEthernet ports belong to default VLAN 1. The completed activity (`assets/completed.pkt`) was configured with VLAN 10 (Faculty), VLAN 20 (Students), VLAN 99 (Management SVI), static access port range assignments, and verified with live intra-VLAN and inter-VLAN ICMP ping tests.

Both starter and completed files were verified for clean reopening in Cisco Packet Tracer.

---

## 2. Live Simulator Environment & Topology

### Devices and Modules
| Device Name | Packet Tracer Model | Primary Interfaces | Role |
|---|---|---|---|
| **S1** | Catalyst 2960-24TT | `Fa0/1 - Fa0/24`, `Gi0/1 - Gi0/2`, `VLAN 99` | Access Switch with Departmental VLANs |
| **PC-Faculty-1** | PC-PT | `FastEthernet0` | Faculty Workstation 1 (`192.168.10.11`, VLAN 10) |
| **PC-Faculty-2** | PC-PT | `FastEthernet0` | Faculty Workstation 2 (`192.168.10.12`, VLAN 10) |
| **PC-Student-1** | PC-PT | `FastEthernet0` | Student Lab PC 1 (`192.168.20.11`, VLAN 20) |
| **PC-Student-2** | PC-PT | `FastEthernet0` | Student Lab PC 2 (`192.168.20.12`, VLAN 20) |

### Cabling Matrix
- `S1 FastEthernet0/1` <-> `PC-Faculty-1 FastEthernet0` (Copper Straight-Through, VLAN 10)
- `S1 FastEthernet0/2` <-> `PC-Faculty-2 FastEthernet0` (Copper Straight-Through, VLAN 10)
- `S1 FastEthernet0/11` <-> `PC-Student-1 FastEthernet0` (Copper Straight-Through, VLAN 20)
- `S1 FastEthernet0/12` <-> `PC-Student-2 FastEthernet0` (Copper Straight-Through, VLAN 20)

### Addressing Plan
- **S1 VLAN 99 (SVI):** `192.168.99.2/24` (Management SVI)
- **PC-Faculty-1:** `192.168.10.11/24`, Gateway: `192.168.10.1` (VLAN 10)
- **PC-Faculty-2:** `192.168.10.12/24`, Gateway: `192.168.10.1` (VLAN 10)
- **PC-Student-1:** `192.168.20.11/24`, Gateway: `192.168.20.1` (VLAN 20)
- **PC-Student-2:** `192.168.20.12/24`, Gateway: `192.168.20.1` (VLAN 20)

---

## 3. Test Execution Matrix

| Test ID | Test Category | Objective | Simulator Action | Observed Simulator Output | Verdict |
|---|---|---|---|---|:---:|
| **POS-01** | VLAN Database | Verify VLAN definitions and port memberships | `show vlan brief` on S1 | VLAN 10 (Faculty) assigned `Fa0/1-10`; VLAN 20 (Students) assigned `Fa0/11-20`; VLAN 99 (Management) active | **PASS** |
| **POS-02** | Intra-VLAN Ping | Verify intra-VLAN reachability in Faculty VLAN 10 | Ping `192.168.10.12` from `PC-Faculty-1` | 4 packets sent, 4 received, 0% loss, round-trip average 0ms, TTL=128 | **PASS** |
| **POS-03** | Intra-VLAN Ping | Verify intra-VLAN reachability in Student VLAN 20 | Ping `192.168.20.12` from `PC-Student-1` | 4 packets sent, 4 received, 0% loss, round-trip average 0ms, TTL=128 | **PASS** |
| **NEG-01** | Layer 2 Isolation | Cross-VLAN broadcast domain isolation | Ping `192.168.20.11` from `PC-Faculty-1` | 4 packets sent, 0 received, 100% loss (`Request timed out`). Layer 2 isolation confirmed | **PASS** |
| **NEG-02** | Switchport Verification | Verify operational mode and static access membership | `show interfaces FastEthernet0/1 switchport` | `Administrative Mode: static access`, `Operational Mode: static access`, `Access Mode VLAN: 10 (Faculty)` | **PASS** |

---

## 4. Raw Simulator Telemetry & Console Traces

### POS-01: S1 VLAN Database
```text
S1#show vlan brief

VLAN Name                             Status    Ports
---- -------------------------------- --------- -------------------------------
1    default                          active    Fa0/21, Fa0/22, Fa0/23, Fa0/24
                                                Gig0/1, Gig0/2
10   Faculty                          active    Fa0/1, Fa0/2, Fa0/3, Fa0/4
                                                Fa0/5, Fa0/6, Fa0/7, Fa0/8
                                                Fa0/9, Fa0/10
20   Students                         active    Fa0/11, Fa0/12, Fa0/13, Fa0/14
                                                Fa0/15, Fa0/16, Fa0/17, Fa0/18
                                                Fa0/19, Fa0/20
99   Management                       active    
1002 fddi-default                     active    
1003 token-ring-default               active    
1004 fddinet-default                  active    
1005 trnet-default                    active    
```

### POS-02: Intra-VLAN Faculty Ping (PC-Faculty-1 -> PC-Faculty-2)
```text
C:\>ping 192.168.10.12

Pinging 192.168.10.12 with 32 bytes of data:

Reply from 192.168.10.12: bytes=32 time<1ms TTL=128
Reply from 192.168.10.12: bytes=32 time<1ms TTL=128
Reply from 192.168.10.12: bytes=32 time<1ms TTL=128
Reply from 192.168.10.12: bytes=32 time<1ms TTL=128

Ping statistics for 192.168.10.12:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
Approximate round trip times in milli-seconds:
    Minimum = 0ms, Maximum = 0ms, Average = 0ms
```

### POS-03: Intra-VLAN Student Ping (PC-Student-1 -> PC-Student-2)
```text
C:\>ping 192.168.20.12

Pinging 192.168.20.12 with 32 bytes of data:

Reply from 192.168.20.12: bytes=32 time<1ms TTL=128
Reply from 192.168.20.12: bytes=32 time<1ms TTL=128
Reply from 192.168.20.12: bytes=32 time<1ms TTL=128
Reply from 192.168.20.12: bytes=32 time<1ms TTL=128

Ping statistics for 192.168.20.12:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
Approximate round trip times in milli-seconds:
    Minimum = 0ms, Maximum = 0ms, Average = 0ms
```

### NEG-01: Inter-VLAN Isolation Ping (PC-Faculty-1 -> PC-Student-1)
```text
C:\>ping 192.168.20.11

Pinging 192.168.20.11 with 32 bytes of data:

Request timed out.
Request timed out.
Request timed out.
Request timed out.

Ping statistics for 192.168.20.11:
    Packets: Sent = 4, Received = 0, Lost = 4 (100% loss)
```
*(Notice: Layer 2 switch strictly prevents frame forwarding across VLAN boundaries without a Layer 3 routing device.)*

### NEG-02: S1 Switchport Configuration Verification
```text
S1#show interfaces FastEthernet0/1 switchport
Name: Fa0/1
Switchport: Enabled
Administrative Mode: static access
Operational Mode: static access
Administrative Trunking Encapsulation: dot1q
Operational Trunking Encapsulation: native
Negotiation of Trunking: Off
Access Mode VLAN: 10 (Faculty)
Trunking Native Mode VLAN: 1 (default)
Voice VLAN: none
...
Protected: false
```

---

## 5. Artifact Manifest & Integrity Validation

All deliverables are saved in the lab repository tree and independently verified:

| File Path | Description | Size (Bytes) | SHA-256 Checksum |
|---|---|---|---|
| `labs/switching/vlan-segmentation-and-access-ports/assets/starter.pkt` | Starter activity with unconfigured switch and default VLAN 1 | 47,013 | `11e44722698a3052722a44a5851016bf6c1db29169ff7530ae9e360d6c23a426` |
| `labs/switching/vlan-segmentation-and-access-ports/assets/completed.pkt` | Completed reference solution with VLAN 10, 20, 99 and static access ports | 48,261 | `92671b5dc05096cd9c6603142408426ffbd56d1c79c9eb952beb0ca960ad1b76` |
| `labs/switching/vlan-segmentation-and-access-ports/assets/topology.png` | Authentic canvas screenshot captured from running simulator | 42,297 | `06f47cdae9a02b7abd6f162df906fde226df977c6aabae055f96f11407f3a952` |

### Reload Integrity Test
- Both files reopened via IPC `ipc.appWindow().fileOpen()`.
- Device count: 6 devices (`S1`, `PC-Faculty-1`, `PC-Faculty-2`, `PC-Student-1`, `PC-Student-2`, plus 1 internal power module).
- Link count: 4 physical copper straight-through connections.
- Switch prompt: `S1>` active upon completed load.
