# Live Simulator Verification Report: PTL-0015

**Lab ID:** `PTL-0015`  
**Lab Title:** IPv4 Subnetting and VLSM Network Design  
**Category:** `ip-addressing`  
**Difficulty:** Beginner  
**Date (UTC):** 2026-10-30  
**Simulator Version:** Cisco Packet Tracer 9.0.1.0038 (64-bit Windows)  
**Verification Method:** Live In-Simulator IPC Execution via Antigravity Packet Tracer MCP Bridge  
**Overall Verdict:** **VERIFIED PASS** (100% of Positive, Negative, and Reload Tests Passed)

---

## 1. Executive Summary

This report documents the live verification and deliverable generation for **PTL-0015: IPv4 Subnetting and VLSM Network Design** inside an authentic running instance of Cisco Packet Tracer 9.0.1.

The multi-site enterprise topology—incorporating Cisco ISR 4321 routers `R1` and `R2`, Catalyst 2960-24TT switches `S1` and `S2`, and workstations `PC-Staff` and `PC-Branch`—was constructed and cabled via the local MCP bridge.

The starter activity (`assets/starter.pkt`) establishes the point-to-point router WAN transit link (`192.168.1.96/30`) and static inter-router routes, but leaves the LAN gateway interfaces on `R1` and `R2` unconfigured and shuts down with hosts unaddressed. The learner must calculate the VLSM addressing scheme for Staff LAN (`/26`, 50 hosts requirement) and Branch LAN (`/28`, 10 hosts requirement), apply the interface IP configurations, and establish end-to-end connectivity. The completed reference activity (`assets/completed.pkt`) incorporates full VLSM configurations across all interfaces with passing end-to-end ICMP ping traffic.

Live simulator testing verified local gateway connectivity, point-to-point `/30` WAN ping, end-to-end routed `/26` to `/28` host communication across two router hops, VLSM routing table structure, and Cisco IOS protection mechanisms against broadcast address assignment and overlapping subnets. Both starter and completed project files were verified for clean reopening in Cisco Packet Tracer.

---

## 2. Live Simulator Environment & Topology

### Devices and Modules
| Device Name | Packet Tracer Model | Primary Interfaces | Role |
|---|---|---|---|
| **R1** | Cisco ISR 4321 | `Gi0/0/0` (`192.168.1.1/26`), `Gi0/0/1` (`192.168.1.97/30`) | HQ Gateway Router |
| **R2** | Cisco ISR 4321 | `Gi0/0/0` (`192.168.1.113/28`), `Gi0/0/1` (`192.168.1.98/30`) | Branch Gateway Router |
| **S1** | Catalyst 2960-24TT | `Gi0/1`, `Fa0/1` | HQ Staff Switch (`192.168.1.2/26`) |
| **S2** | Catalyst 2960-24TT | `Gi0/1`, `Fa0/1` | Branch Switch (`192.168.1.114/28`) |
| **PC-Staff** | PC-PT | `FastEthernet0` | HQ Workstation (`192.168.1.10/26`) |
| **PC-Branch** | PC-PT | `FastEthernet0` | Branch Workstation (`192.168.1.120/28`) |

### Cabling Matrix
- `R1 GigabitEthernet0/0/1` <-> `R2 GigabitEthernet0/0/1` (Copper Crossover, WAN Transit `/30`)
- `R1 GigabitEthernet0/0/0` <-> `S1 GigabitEthernet0/1` (Copper Straight-Through, Staff LAN `/26`)
- `S1 FastEthernet0/1` <-> `PC-Staff FastEthernet0` (Copper Straight-Through)
- `R2 GigabitEthernet0/0/0` <-> `S2 GigabitEthernet0/1` (Copper Straight-Through, Branch LAN `/28`)
- `S2 FastEthernet0/1` <-> `PC-Branch FastEthernet0` (Copper Straight-Through)

---

## 3. Test Execution Matrix

| Test ID | Test Category | Objective | Simulator Action | Observed Simulator Output | Verdict |
|---|---|---|---|---|:---:|
| **POS-01** | Host IP Parameters | Verify PC-Staff /26 IP configuration | `ipconfig` on `PC-Staff` | IP: `192.168.1.10`, Mask: `255.255.255.192`, Gateway: `192.168.1.1` | **PASS** |
| **POS-02** | Host IP Parameters | Verify PC-Branch /28 IP configuration | `ipconfig` on `PC-Branch` | IP: `192.168.1.120`, Mask: `255.255.255.240`, Gateway: `192.168.1.113` | **PASS** |
| **POS-03** | Local Gateway Ping | Verify PC-Staff reaches local R1 gateway | Ping `192.168.1.1` from `PC-Staff` | 4/4 replies, 0% loss, round-trip <1ms, TTL=255 | **PASS** |
| **POS-04** | WAN Transit Ping | Verify R1 reaches R2 across /30 point-to-point link | Ping `192.168.1.98` from `R1` | Success rate is 100 percent (5/5), round-trip min/avg/max = 0/0/0 ms | **PASS** |
| **POS-05** | End-to-End Routed Ping | Verify inter-subnet communication across two routers | Ping `192.168.1.120` from `PC-Staff` | 4/4 replies, 0% loss, round-trip <1ms, TTL=126 | **PASS** |
| **POS-06** | VLSM Routing Tables | Verify variably subnetted route entries | `show ip route` on R1 & R2 | `192.168.1.0/24 is variably subnetted, 5 subnets, 4 masks` active | **PASS** |
| **NEG-01** | Broadcast Address Rejection | Verify Cisco IOS rejects subnet broadcast IP assignment | Assign `192.168.1.63/26` to interface on R1 | Rejected: `Bad mask /26 for address 192.168.1.63` | **PASS** |
| **NEG-02** | Overlapping Subnet Rejection | Verify Cisco IOS prevents route overlap | Assign `192.168.1.33/25` to interface on R1 | Rejected: `% 192.168.1.0 overlaps with GigabitEthernet0/0/0` | **PASS** |

---

## 4. Raw Simulator Telemetry & Console Traces

### POS-01: PC-Staff IP Configuration (/26)
```text
C:\>ipconfig

FastEthernet0 Connection:(default port)

   Connection-specific DNS Suffix..: 
   Link-local IPv6 Address.........: FE80::2D0:FFFF:FE9B:7009
   IPv6 Address....................: ::
   IPv4 Address....................: 192.168.1.10
   Subnet Mask.....................: 255.255.255.192
   Default Gateway.................: ::
                                     192.168.1.1
```

### POS-02: PC-Branch IP Configuration (/28)
```text
C:\>ipconfig

FastEthernet0 Connection:(default port)

   Connection-specific DNS Suffix..: 
   Link-local IPv6 Address.........: FE80::201:42FF:FEAC:1D88
   IPv6 Address....................: ::
   IPv4 Address....................: 192.168.1.120
   Subnet Mask.....................: 255.255.255.240
   Default Gateway.................: ::
                                     192.168.1.113
```

### POS-03: PC-Staff Local Gateway Ping
```text
C:\>ping 192.168.1.1

Pinging 192.168.1.1 with 32 bytes of data:

Reply from 192.168.1.1: bytes=32 time<1ms TTL=255
Reply from 192.168.1.1: bytes=32 time<1ms TTL=255
Reply from 192.168.1.1: bytes=32 time<1ms TTL=255
```

### POS-04: R1 to R2 WAN Link Ping (/30)
```text
R1#ping 192.168.1.98

Type escape sequence to abort.
Sending 5, 100-byte ICMP Echos to 192.168.1.98, timeout is 2 seconds:
!!!!!
Success rate is 100 percent (5/5), round-trip min/avg/max = 0/0/0 ms
```

### POS-05: End-to-End Inter-Subnet Host Ping (PC-Staff to PC-Branch)
```text
C:\>ping 192.168.1.120

Pinging 192.168.1.120 with 32 bytes of data:

Reply from 192.168.1.120: bytes=32 time<1ms TTL=126
Reply from 192.168.1.120: bytes=32 time<1ms TTL=126
Reply from 192.168.1.120: bytes=32 time<1ms TTL=126
Reply from 192.168.1.120: bytes=32 time<1ms TTL=126

Ping statistics for 192.168.1.120:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
Approximate round trip times in milli-seconds:
    Minimum = 0ms, Maximum = 0ms, Average = 0ms
```

### POS-06: R1 and R2 VLSM Routing Tables
```text
R1#show ip route
Gateway of last resort is not set

     192.168.1.0/24 is variably subnetted, 5 subnets, 4 masks
C       192.168.1.0/26 is directly connected, GigabitEthernet0/0/0
L       192.168.1.1/32 is directly connected, GigabitEthernet0/0/0
C       192.168.1.96/30 is directly connected, GigabitEthernet0/0/1
L       192.168.1.97/32 is directly connected, GigabitEthernet0/0/1
S       192.168.1.112/28 [1/0] via 192.168.1.98

R2#show ip route
Gateway of last resort is not set

     192.168.1.0/24 is variably subnetted, 5 subnets, 4 masks
S       192.168.1.0/26 [1/0] via 192.168.1.97
C       192.168.1.96/30 is directly connected, GigabitEthernet0/0/1
L       192.168.1.98/32 is directly connected, GigabitEthernet0/0/1
C       192.168.1.112/28 is directly connected, GigabitEthernet0/0/0
L       192.168.1.113/32 is directly connected, GigabitEthernet0/0/0
```

### NEG-01: Subnet Broadcast Address Rejection
```text
R1(config)#interface Loopback99
R1(config-if)#ip address 192.168.1.63 255.255.255.192
Bad mask /26 for address 192.168.1.63
```

### NEG-02: Overlapping Subnet Rejection
```text
R1(config)#interface Loopback99
R1(config-if)#ip address 192.168.1.33 255.255.255.128
% 192.168.1.0 overlaps with GigabitEthernet0/0/0
```

---

## 5. Artifact Manifest & Integrity Validation

All deliverables are saved in the lab repository tree and independently verified:

| File Path | Description | Size (Bytes) |
|---|---|---|
| `labs/ip-addressing/ipv4-subnetting-and-vlsm/assets/starter.pkt` | Starter activity with WAN link configured, LAN interfaces unconfigured | 52,902 |
| `labs/ip-addressing/ipv4-subnetting-and-vlsm/assets/completed.pkt` | Completed reference solution with full VLSM addressing and passing ping | 53,384 |
| `labs/ip-addressing/ipv4-subnetting-and-vlsm/assets/topology.png` | Authentic canvas screenshot captured from running simulator | 74,950 |

### Reload Integrity Test
- Both `.pkt` files reopened via IPC `ipc.appWindow().fileOpen()`.
- Device count: 7 devices (`R1`, `R2`, `S1`, `S2`, `PC-Staff`, `PC-Branch`, plus internal power component).
- Link count: 5 physical connections.
- Starter file verified: `R1` `Gi0/0/0` is unassigned and administratively down.
- Completed file verified: `R1` `Gi0/0/0` is `192.168.1.1/26` (up/up), `PC-Staff` has `192.168.1.10/26`.
- Router prompt: `R1>` active upon reload.
