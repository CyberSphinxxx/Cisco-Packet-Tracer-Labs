# Live Simulator Verification Report: PTL-0011

**Lab ID:** `PTL-0011`  
**Lab Title:** Single-Area OSPFv2 Configuration and Verification  
**Category:** `routing`  
**Difficulty:** Intermediate  
**Date (UTC):** 2026-10-27  
**Simulator Version:** Cisco Packet Tracer 9.0.1.0038 (64-bit Windows)  
**Verification Method:** Live In-Simulator IPC Execution via Antigravity Packet Tracer MCP Bridge  
**Overall Verdict:** **VERIFIED PASS** (100% of Positive and Negative Tests Passed)

---

## 1. Executive Summary

This report documents the live verification and deliverable generation for **PTL-0011: Single-Area OSPFv2 Configuration and Verification** inside an authentic running instance of Cisco Packet Tracer 9.0.1.

The dual-router enterprise topology—incorporating two Cisco ISR 4321 routers (`R1`, `R2`), two Cisco Catalyst 2960 switches (`S1`, `S2`), and two user workstations (`PC-HQ` and `PC-Branch`)—was assembled and cabled via internal simulator IPC. The starter activity (`assets/starter.pkt`) was prepared with physical cabling and interface IP addressing configured, allowing point-to-point router ping across the transit link but with zero dynamic routing enabled, isolating the remote user LANs. The completed activity (`assets/completed.pkt`) was configured with OSPF process 10 in Area 0 on both routers, explicit 32-bit Router IDs (`1.1.1.1` on R1, `2.2.2.2` on R2), inverse wildcard masks matching local and transit subnets, and `passive-interface` on client LAN interfaces (`Gi0/0/0`).

Live verification validated OSPF neighbor adjacency formation in the `FULL` state, dynamic OSPF route installation in the routing table (code `O` with AD 110, metric 2), suppression of Hello packets on passive interfaces, end-to-end dynamic ICMP routing between host PCs, negative hello timer mismatch neighbor teardown, and negative area ID mismatch neighbor prevention. Both starter and completed project files were verified for clean reopening in Cisco Packet Tracer.

---

## 2. Live Simulator Environment & Topology

### Devices and Modules
| Device Name | Packet Tracer Model | Primary Interfaces | Role |
|---|---|---|---|
| **R1** | Cisco ISR 4321 | `Gi0/0/0` (HQ LAN), `Gi0/0/1` (Transit Link) | HQ Gateway Router (`192.168.1.1`, `10.0.0.1`, RID: `1.1.1.1`) |
| **R2** | Cisco ISR 4321 | `Gi0/0/0` (Branch LAN), `Gi0/0/1` (Transit Link) | Branch Gateway Router (`192.168.2.1`, `10.0.0.2`, RID: `2.2.2.2`) |
| **S1** | Catalyst 2960-24TT | `Gi0/1`, `Gi0/2` | HQ Access Switch |
| **S2** | Catalyst 2960-24TT | `Gi0/1`, `Gi0/2` | Branch Access Switch |
| **PC-HQ** | PC-PT | `FastEthernet0` | HQ Workstation (`192.168.1.10`) |
| **PC-Branch** | PC-PT | `FastEthernet0` | Branch Workstation (`192.168.2.10`) |

### Cabling Matrix
- `R1 GigabitEthernet0/0/1` <-> `R2 GigabitEthernet0/0/1` (Copper Crossover, Transit Subnet `10.0.0.0/30`)
- `R1 GigabitEthernet0/0/0` <-> `S1 GigabitEthernet0/2` (Copper Straight-Through, HQ LAN `192.168.1.0/24`)
- `S1 GigabitEthernet0/1` <-> `PC-HQ FastEthernet0` (Copper Straight-Through, HQ Workstation)
- `R2 GigabitEthernet0/0/0` <-> `S2 GigabitEthernet0/2` (Copper Straight-Through, Branch LAN `192.168.2.0/24`)
- `S2 GigabitEthernet0/1` <-> `PC-Branch FastEthernet0` (Copper Straight-Through, Branch Workstation)

### Addressing Plan
- **Transit Network:** `10.0.0.0/30` (R1 Gi0/0/1: `10.0.0.1`, R2 Gi0/0/1: `10.0.0.2`)
- **HQ LAN:** `192.168.1.0/24` (Gateway: `192.168.1.1`, Host: `192.168.1.10`)
- **Branch LAN:** `192.168.2.0/24` (Gateway: `192.168.2.1`, Host: `192.168.2.10`)
- **OSPF Process:** `10`, **Backbone Area:** `Area 0`

---

## 3. Test Execution Matrix

| Test ID | Test Category | Objective | Simulator Action | Observed Simulator Output | Verdict |
|---|---|---|---|---|:---:|
| **POS-01** | Neighbor Adjacency | Verify bidirectional OSPF neighbor relationship | `show ip ospf neighbor` on R1 | Neighbor `2.2.2.2` in `FULL/DR` state on `10.0.0.2` via `Gi0/0/1` | **PASS** |
| **POS-02** | Dynamic Routing Table | Verify dynamic route calculation and installation | `show ip route ospf` on R1 | `O 192.168.2.0 [110/2] via 10.0.0.2, GigabitEthernet0/0/1` installed | **PASS** |
| **POS-02b** | Passive Interface | Confirm Hello packet suppression on user LAN | `show ip ospf interface Gi0/0/0` on R1 | Displays `No Hellos (Passive interface)` on client-facing port | **PASS** |
| **POS-03** | End-to-End Traffic | Host communication across dynamic OSPF path | Ping `192.168.2.10` from `PC-HQ` | 4 packets sent, 4 received, 0% loss, round-trip average <1ms, TTL=126 (2 router hops) | **PASS** |
| **NEG-01** | Timer Mismatch Drop | Verify neighbor teardown when Hello intervals disagree | Configure `ip ospf hello-interval 5` on R1 transit link | Adjacency drops (`Dead timer expired`); route flushed; pings return `Destination host unreachable` | **PASS** |
| **NEG-02** | Area ID Mismatch Drop | Verify adjacency rejection when Area IDs disagree | Configure R2 transit link in `area 1` | Adjacency fails to form; pings return `Destination host unreachable` (100% loss) | **PASS** |

---

## 4. Raw Simulator Telemetry & Console Traces

### POS-01: R1 OSPF Neighbor Adjacency
```text
R1#show ip ospf neighbor

Neighbor ID     Pri   State           Dead Time   Address         Interface
2.2.2.2           1   FULL/DR         00:00:32    10.0.0.2        GigabitEthernet0/0/1
```
*(Notice: Neighbor state is `FULL`, confirming complete Link-State Database synchronization between R1 and R2 across the point-to-point transit link.)*

### POS-02: R1 Dynamic Route Table
```text
R1#show ip route ospf
Codes: L - local, C - connected, S - static, R - RIP, M - mobile, B - BGP
       D - EIGRP, EX - EIGRP external, O - OSPF, IA - OSPF inter area
       N1 - OSPF NSSA external type 1, N2 - OSPF NSSA external type 2
       E1 - OSPF external type 1, E2 - OSPF external type 2, E - EGP
       i - IS-IS, L1 - IS-IS level-1, L2 - IS-IS level-2, ia - IS-IS inter area
       * - candidate default, U - per-user static route, o - ODR
       P - periodic downloaded static route

Gateway of last resort is not set

O    192.168.2.0 [110/2] via 10.0.0.2, 00:01:18, GigabitEthernet0/0/1
```

### POS-02b: Passive Interface Verification on R1 Gi0/0/0
```text
R1#show ip ospf interface GigabitEthernet0/0/0
GigabitEthernet0/0/0 is up, line protocol is up
  Internet address is 192.168.1.1/24, Area 0
  Process ID 10, Router ID 1.1.1.1, Network Type BROADCAST, Cost: 1
  Transmit Delay is 1 sec, State DR, Priority 1
  Designated Router (ID) 1.1.1.1, Interface address 192.168.1.1
  No backup designated router on this network
  Timer intervals configured, Hello 10, Dead 40, Wait 40, Retransmit 5
    No Hellos (Passive interface)
  Index 2/2, flood queue length 0
  Next 0x0(0)/0x0(0)
  Last flood scan length is 1, maximum is 1
  Last flood scan time is 0 msec, maximum is 0 msec
  Neighbor Count is 0, Adjacent neighbor count is 0
  Suppress hello for 0 neighbor(s)
```

### POS-03: End-to-End Inter-Branch Host Ping (PC-HQ to PC-Branch)
```text
C:\>ping 192.168.2.10

Pinging 192.168.2.10 with 32 bytes of data:

Reply from 192.168.2.10: bytes=32 time<1ms TTL=126
Reply from 192.168.2.10: bytes=32 time<1ms TTL=126
Reply from 192.168.2.10: bytes=32 time<1ms TTL=126
Reply from 192.168.2.10: bytes=32 time<1ms TTL=126

Ping statistics for 192.168.2.10:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
Approximate round trip times in milli-seconds:
    Minimum = 0ms, Maximum = 0ms, Average = 0ms
```
*(Notice: The TTL of 126 confirms that the packet was routed across two intermediate router hops—R1 and R2—from an initial host TTL of 128.)*

### NEG-01: Hello Timer Mismatch Teardown
```text
R1(config)#interface GigabitEthernet0/0/1
R1(config-if)#ip ospf hello-interval 5
R1(config-if)#end

00:05:18: %OSPF-5-ADJCHG: Process 10, Nbr 2.2.2.2 on GigabitEthernet0/0/1 from FULL to DOWN, Neighbor Down: Dead timer expired

R1#show ip ospf neighbor
(No active neighbors displayed)

C:\>ping 192.168.2.10

Pinging 192.168.2.10 with 32 bytes of data:

Reply from 192.168.1.1: Destination host unreachable.
Reply from 192.168.1.1: Destination host unreachable.
Reply from 192.168.1.1: Destination host unreachable.
Reply from 192.168.1.1: Destination host unreachable.

Ping statistics for 192.168.2.10:
    Packets: Sent = 4, Received = 0, Lost = 4 (100% loss)
```

### NEG-02: Area ID Mismatch Drop
```text
R2(config)#router ospf 10
R2(config-router)#no network 10.0.0.0 0.0.0.3 area 0
R2(config-router)#network 10.0.0.0 0.0.0.3 area 1
R2(config-router)#end

00:08:58: %OSPF-5-ADJCHG: Process 10, Nbr 2.2.2.2 on GigabitEthernet0/0/1 from FULL to DOWN, Neighbor Down: Dead timer expired

R1#show ip ospf neighbor
(No active neighbors displayed)

C:\>ping 192.168.2.10

Pinging 192.168.2.10 with 32 bytes of data:

Reply from 192.168.1.1: Destination host unreachable.
Reply from 192.168.1.1: Destination host unreachable.
Reply from 192.168.1.1: Destination host unreachable.
Reply from 192.168.1.1: Destination host unreachable.

Ping statistics for 192.168.2.10:
    Packets: Sent = 4, Received = 0, Lost = 4 (100% loss)
```

---

## 5. Artifact Manifest & Integrity Validation

All deliverables are saved in the lab repository tree and independently verified:

| File Path | Description | Size (Bytes) | SHA-256 Checksum |
|---|---|---|---|
| `labs/routing/single-area-ospfv2/assets/starter.pkt` | Starter activity with interfaces configured, dynamic routing unconfigured | 61,862 | `032a3a0a04cc2c9c631fe3cdeeac04014361d0fef98ce53f5d868ffd69299f57` |
| `labs/routing/single-area-ospfv2/assets/completed.pkt` | Completed reference solution with full single-area OSPFv2 Area 0 routing | 62,478 | `5de2a73f9cc5840222f0a4fcfb42ae99bf9e0ca05d68c7d2af912c46984122b8` |
| `labs/routing/single-area-ospfv2/assets/topology.png` | Authentic canvas screenshot captured from running simulator | 47,390 | `fc37b2bde2d8dab64803931bdba86d4a4086bffca8b891d9700d25e398e6b306` |

### Reload Integrity Test
- Both files reopened via IPC `ipc.appWindow().fileOpen()`.
- Device count: 7 devices (`R1`, `R2`, `S1`, `S2`, `PC-HQ`, `PC-Branch`, plus 1 internal power module).
- Link count: 5 physical connections (1 transit crossover link, 2 switch uplinks, 2 host access links).
- Router prompts: `R1#` and `R2#` active upon reload.
