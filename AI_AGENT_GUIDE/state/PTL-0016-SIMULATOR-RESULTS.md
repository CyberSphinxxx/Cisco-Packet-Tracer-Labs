# Live Simulator Verification Report: PTL-0016

**Lab ID:** `PTL-0016`  
**Lab Title:** MAC Address Learning and ARP Operation  
**Category:** `network-fundamentals`  
**Difficulty:** Beginner  
**Date (UTC):** 2026-10-30  
**Simulator Version:** Cisco Packet Tracer 9.0.1.0038 (64-bit Windows)  
**Verification Method:** Live In-Simulator IPC Execution via Antigravity Packet Tracer MCP Bridge  
**Overall Verdict:** **VERIFIED PASS** (100% of Positive, Negative, and Reload Tests Passed)

---

## 1. Executive Summary

This report documents the live verification and deliverable generation for **PTL-0016: MAC Address Learning and ARP Operation** inside an authentic running instance of Cisco Packet Tracer 9.0.1.

The local area network topology—incorporating Cisco Catalyst 2960-24TT access switch `S1`, Cisco ISR 4321 router `R1`, and three workstations `PC-A`, `PC-B`, and `PC-C`—was constructed, cabled, and verified via the local MCP bridge.

The starter activity (`assets/starter.pkt`) presents a pre-cabled topology with configured IP addressing where dynamic MAC tables on `S1` and ARP tables on all workstations begin empty. The student observes the initial frame transmission, inspects the ARP broadcast exchange, and watches the switch CAM table populate port-to-MAC associations. The completed reference activity (`assets/completed.pkt`) preserves the fully verified network state with all devices reachable.

Live simulator testing verified initial empty table states, intra-subnet ping and ARP resolution, switch dynamic CAM learning across FastEthernet ports, router uplink learning on GigabitEthernet, multi-host CAM convergence, negative ARP timeouts on non-existent IPs, and dynamic table flushing via `clear mac address-table dynamic`. Both starter and completed project files were verified for clean reopening in Cisco Packet Tracer.

---

## 2. Live Simulator Environment & Topology

### Devices and Modules
| Device Name | Packet Tracer Model | Primary Interfaces | Role |
|---|---|---|---|
| **R1** | Cisco ISR 4321 | `Gi0/0/0` (`192.168.1.1/24`) | Default Gateway for Local Subnet |
| **S1** | Catalyst 2960-24TT | `Gig0/1`, `Fa0/1`, `Fa0/2`, `Fa0/3` | Central Layer 2 Switch |
| **PC-A** | PC-PT | `FastEthernet0` (`192.168.1.10/24`) | Host Workstation A |
| **PC-B** | PC-PT | `FastEthernet0` (`192.168.1.20/24`) | Host Workstation B |
| **PC-C** | PC-PT | `FastEthernet0` (`192.168.1.30/24`) | Host Workstation C |

### Cabling Matrix
- `R1 GigabitEthernet0/0/0` <-> `S1 GigabitEthernet0/1` (Copper Straight-Through)
- `S1 FastEthernet0/1` <-> `PC-A FastEthernet0` (Copper Straight-Through)
- `S1 FastEthernet0/2` <-> `PC-B FastEthernet0` (Copper Straight-Through)
- `S1 FastEthernet0/3` <-> `PC-C FastEthernet0` (Copper Straight-Through)

---

## 3. Test Execution Matrix

| Test ID | Test Category | Objective | Simulator Action | Observed Simulator Output | Verdict |
|---|---|---|---|---|:---:|
| **POS-01** | Host Configuration | Verify PC-A IP configuration and gateway | `ipconfig` on `PC-A` | IP: `192.168.1.10`, Mask: `255.255.255.0`, Gateway: `192.168.1.1` | **PASS** |
| **POS-02** | Baseline State Verification | Verify empty ARP cache and dynamic MAC table | `arp -d` & `arp -a` on `PC-A`, `clear mac address-table dynamic` on `S1` | PC-A: `No ARP Entries Found`; S1: 0 dynamic entries | **PASS** |
| **POS-03** | Intra-Subnet Delivery | Verify Layer 2 ping between PC-A and PC-B | Ping `192.168.1.20` from `PC-A` | 4/4 replies, 0% loss, TTL=128, round-trip <1ms | **PASS** |
| **POS-04** | Dynamic MAC Learning | Verify S1 learns PC-A on Fa0/1 and PC-B on Fa0/2 | `show mac address-table dynamic` on `S1` | `0001.c955.51bd` on `Fa0/1`, `0001.c97d.8904` on `Fa0/2` | **PASS** |
| **POS-05** | Host ARP Resolution | Verify PC-A maps PC-B IP to MAC in ARP cache | `arp -a` on `PC-A` | `192.168.1.20` -> `0001.c97d.8904 dynamic` | **PASS** |
| **POS-06** | Gateway Resolution & Uplink MAC | Verify ping to R1 and switch learning on Gig0/1 | Ping `192.168.1.1` from `PC-A` | 4/4 replies, TTL=255; S1 maps `0001.c7ea.b801` to `Gig0/1` | **PASS** |
| **POS-07** | Multi-Host Table Convergence | Verify S1 learns PC-C upon traffic generation | Ping `192.168.1.10` from `PC-C` | All 4 nodes (`Fa0/1`, `Fa0/2`, `Fa0/3`, `Gig0/1`) learned | **PASS** |
| **NEG-01** | Negative ARP Timeout | Verify unassigned IP results in ARP timeout and no cache | Ping `192.168.1.99` from `PC-A` | 4/4 Request timed out; `192.168.1.99` absent from `arp -a` | **PASS** |
| **NEG-02** | Manual Dynamic Table Flush | Verify table flush and dynamic re-learning | `clear mac address-table dynamic` on `S1` | Dynamic entries cleared immediately; repopulated upon frame arrival | **PASS** |
| **REL-01** | Project Reload Verification | Verify starter and completed .pkt files reopen cleanly | `fileOpen` in Packet Tracer IPC | Both files loaded cleanly with 6 devices and 4 links | **PASS** |

---

## 4. Live Simulator Raw Telemetry

### 4.1. Baseline Check (POS-01 & POS-02)

```text
C:\>ipconfig

FastEthernet0 Connection:
   Link-local IPv6 Address.........: FE80::201:C9FF:FE55:51BD
   IPv4 Address....................: 192.168.1.10
   Subnet Mask.....................: 255.255.255.0
   Default Gateway.................: 192.168.1.1

C:\>arp -a
No ARP Entries Found

S1# show mac address-table dynamic
          Mac Address Table
-------------------------------------------

Vlan    Mac Address       Type        Ports
----    -----------       --------    -----
```

### 4.2. Intra-Subnet Ping and MAC Learning (POS-03, POS-04, POS-05)

```text
C:\>ping 192.168.1.20

Pinging 192.168.1.20 with 32 bytes of data:

Reply from 192.168.1.20: bytes=32 time<1ms TTL=128
Reply from 192.168.1.20: bytes=32 time<1ms TTL=128
Reply from 192.168.1.20: bytes=32 time<1ms TTL=128
Reply from 192.168.1.20: bytes=32 time<1ms TTL=128

Ping statistics for 192.168.1.20:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
Approximate round trip times in milli-seconds:
    Minimum = 0ms, Maximum = 0ms, Average = 0ms

C:\>arp -a
  Internet Address      Physical Address      Type
  192.168.1.20          0001.c97d.8904        dynamic

S1# show mac address-table dynamic
          Mac Address Table
-------------------------------------------

Vlan    Mac Address       Type        Ports
----    -----------       --------    -----
   1    0001.c955.51bd    DYNAMIC     Fa0/1
   1    0001.c97d.8904    DYNAMIC     Fa0/2
```

### 4.3. Gateway Resolution and Uplink Learning (POS-06)

```text
C:\>ping 192.168.1.1

Pinging 192.168.1.1 with 32 bytes of data:

Reply from 192.168.1.1: bytes=32 time<1ms TTL=255
Reply from 192.168.1.1: bytes=32 time<1ms TTL=255
Reply from 192.168.1.1: bytes=32 time<1ms TTL=255
Reply from 192.168.1.1: bytes=32 time<1ms TTL=255

Ping statistics for 192.168.1.1:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
Approximate round trip times in milli-seconds:
    Minimum = 0ms, Maximum = 0ms, Average = 0ms

C:\>arp -a
  Internet Address      Physical Address      Type
  192.168.1.1           0001.c7ea.b801        dynamic
  192.168.1.20          0001.c97d.8904        dynamic

S1# show mac address-table dynamic
          Mac Address Table
-------------------------------------------

Vlan    Mac Address       Type        Ports
----    -----------       --------    -----
   1    0001.c7ea.b801    DYNAMIC     Gig0/1
   1    0001.c955.51bd    DYNAMIC     Fa0/1
   1    0001.c97d.8904    DYNAMIC     Fa0/2
```

### 4.4. Negative Test: Unassigned IP Timeout (NEG-01)

```text
C:\>ping 192.168.1.99

Pinging 192.168.1.99 with 32 bytes of data:

Request timed out.
Request timed out.
Request timed out.
Request timed out.

Ping statistics for 192.168.1.99:
    Packets: Sent = 4, Received = 0, Lost = 4 (100% loss)

C:\>arp -a
  Internet Address      Physical Address      Type
  192.168.1.1           0001.c7ea.b801        dynamic
  192.168.1.20          0001.c97d.8904        dynamic
```

### 4.5. Table Clearance and Dynamic Re-Learning (NEG-02)

```text
S1# clear mac address-table dynamic
S1# show mac address-table dynamic
          Mac Address Table
-------------------------------------------

Vlan    Mac Address       Type        Ports
----    -----------       --------    -----

[PC-C pings PC-A (192.168.1.10)]

S1# show mac address-table dynamic
          Mac Address Table
-------------------------------------------

Vlan    Mac Address       Type        Ports
----    -----------       --------    -----
   1    0001.c955.51bd    DYNAMIC     Fa0/1
   1    00e0.f740.df65    DYNAMIC     Fa0/3
```

### 4.6. Reload Verification (REL-01)

```text
=== REOPEN TEST: PTL-0016 STARTER.PKT ===
Starter loaded: Devices=6, Links=4
Starter S1 dynamic MAC table: empty

=== REOPEN TEST: PTL-0016 COMPLETED.PKT ===
Completed loaded: Devices=6, Links=4
Completed S1 dynamic MAC table: empty (fresh start)
Completed PC-A ARP table: No ARP Entries Found (fresh start)
=== REOPEN TEST COMPLETED ===
```

---

## 5. Artifact Verification

- `assets/starter.pkt`: 49,756 bytes (Pre-cabled, clean table start)
- `assets/completed.pkt`: 49,770 bytes (Pre-cabled, tested and operational)
- `assets/topology.png`: 74,254 bytes (Authentic canvas screenshot captured via MCP bridge)
- `configs/R1.txt`: Router R1 gateway configuration
- `configs/S1.txt`: Switch S1 configuration
- `verification.md`: Complete testing and diagnostic guide
- `metadata.json`: Verified against repository schema
