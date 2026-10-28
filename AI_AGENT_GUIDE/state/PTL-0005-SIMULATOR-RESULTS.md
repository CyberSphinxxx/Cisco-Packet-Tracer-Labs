# Live Simulator Verification Report: PTL-0005

**Lab ID:** `PTL-0005`  
**Lab Title:** Verifying Directly Connected Networks  
**Category:** `ip-addressing`  
**Difficulty:** Beginner  
**Date (UTC):** 2026-10-27  
**Simulator Version:** Cisco Packet Tracer 9.0.1.0038 (64-bit Windows)  
**Verification Method:** Live In-Simulator IPC Execution via Antigravity Packet Tracer MCP Bridge  
**Overall Verdict:** **VERIFIED PASS** (100% of Positive and Negative Tests Passed)

---

## 1. Executive Summary

This report documents the live verification and deliverable generation for **PTL-0005: Verifying Directly Connected Networks** inside an authentic running instance of Cisco Packet Tracer 9.0.1.

The dual-LAN routed topology—incorporating Cisco ISR 4321 router `R1`, two Catalyst 2960 access switches (`S1`, `S2`), and two workstations (`PC-A`, `PC-B`)—was assembled and cabled via internal simulator IPC. The starter activity (`assets/starter.pkt`) was prepared with the authentic troubleshooting scenario (subnet mask misconfiguration on R1 Gi0/0/0, shutdown on Gi0/0/1, and wrong default gateway on PC-B). The completed activity (`assets/completed.pkt`) was fully repaired and tested with live dual-stack IPv4 and IPv6 routing table inspection, route withdrawal verification, and end-to-end ICMP ping traffic.

Both starter and completed files were verified for clean reopening in Cisco Packet Tracer.

---

## 2. Live Simulator Environment & Topology

### Devices and Modules
| Device Name | Packet Tracer Model | Primary Interfaces | Role |
|---|---|---|---|
| **R1** | Cisco ISR 4321 | `GigabitEthernet0/0/0`, `GigabitEthernet0/0/1` | Dual-LAN Inter-Subnet Gateway |
| **S1** | Catalyst 2960-24TT | `GigabitEthernet0/1`, `GigabitEthernet0/2` | LAN 1 Access Switch |
| **S2** | Catalyst 2960-24TT | `GigabitEthernet0/1`, `GigabitEthernet0/2` | LAN 2 Access Switch |
| **PC-A** | PC-PT | `FastEthernet0` | LAN 1 Workstation (`192.168.10.10`) |
| **PC-B** | PC-PT | `FastEthernet0` | LAN 2 Workstation (`192.168.20.10`) |

### Cabling Matrix
- `R1 GigabitEthernet0/0/0` <-> `S1 GigabitEthernet0/2` (Copper Straight-Through)
- `R1 GigabitEthernet0/0/1` <-> `S2 GigabitEthernet0/2` (Copper Straight-Through)
- `S1 GigabitEthernet0/1` <-> `PC-A FastEthernet0` (Copper Straight-Through)
- `S2 GigabitEthernet0/1` <-> `PC-B FastEthernet0` (Copper Straight-Through)

### Addressing Plan
- **R1 Gi0/0/0:** `192.168.10.1/24`, `2001:db8:acad:10::1/64`, Link-Local: `fe80::1`
- **R1 Gi0/0/1:** `192.168.20.1/24`, `2001:db8:acad:20::1/64`, Link-Local: `fe80::1`
- **PC-A:** IPv4 `192.168.10.10/24` (GW `192.168.10.1`), IPv6 `2001:db8:acad:10::10/64` (GW `fe80::1`)
- **PC-B:** IPv4 `192.168.20.10/24` (GW `192.168.20.1`), IPv6 `2001:db8:acad:20::10/64` (GW `fe80::1`)

---

## 3. Test Execution Matrix

| Test ID | Test Category | Objective | Simulator Action | Observed Simulator Output | Verdict |
|---|---|---|---|---|:---:|
| **POS-01** | Routing Table | Directly connected (`C`) and local (`L`) IPv4 route installation | `show ip route` on R1 | `C 192.168.10.0/24 Gi0/0/0`, `L 192.168.10.1/32 Gi0/0/0`, `C 192.168.20.0/24 Gi0/0/1`, `L 192.168.20.1/32 Gi0/0/1` verified | **PASS** |
| **POS-02** | IPv6 Routing | Directly connected (`C`) and local (`L`) IPv6 route installation | `show ipv6 route` on R1 | `C 2001:DB8:ACAD:10::/64 Gi0/0/0`, `L 2001:DB8:ACAD:10::1/128 Gi0/0/0`, `C 2001:DB8:ACAD:20::/64 Gi0/0/1`, `L 2001:DB8:ACAD:20::1/128 Gi0/0/1` verified | **PASS** |
| **POS-03** | End-to-End Routing | Post-remediation inter-LAN reachability | Ping `192.168.20.10` from `PC-A` | ARP resolution followed by immediate replies (32 bytes, time<1ms, TTL=127) | **PASS** |
| **NEG-01** | Route Withdrawal | Dynamic route purge upon interface shutdown | `shutdown` on `Gi0/0/0` -> `show ip route` | LAN 1 subnet (`192.168.10.0/24`) and local route (`192.168.10.1/32`) dynamically purged from routing table | **PASS** |
| **NEG-02** | Destination Unreachable | Traffic forwarding to unconfigured subnet | Ping `10.0.0.1` from `PC-A` | Packets dropped with `Request timed out` / unreachable (100% loss) | **PASS** |

---

## 4. Raw Simulator Telemetry & Console Traces

### POS-01: R1 IPv4 Routing Table
```text
R1#show ip route
Codes: L - local, C - connected, S - static, R - RIP, M - mobile, B - BGP
       D - EIGRP, EX - EIGRP external, O - OSPF, IA - OSPF inter area
       N1 - OSPF NSSA external type 1, N2 - OSPF NSSA external type 2
       E1 - OSPF external type 1, E2 - OSPF external type 2, E - EGP
       i - IS-IS, L1 - IS-IS level-1, L2 - IS-IS level-2, ia - IS-IS inter area
       * - candidate default, U - per-user static route, o - ODR
       P - periodic downloaded static route

Gateway of last resort is not set

     192.168.10.0/24 is variably subnetted, 2 subnets, 2 masks
C       192.168.10.0/24 is directly connected, GigabitEthernet0/0/0
L       192.168.10.1/32 is directly connected, GigabitEthernet0/0/0
     192.168.20.0/24 is variably subnetted, 2 subnets, 2 masks
C       192.168.20.0/24 is directly connected, GigabitEthernet0/0/1
L       192.168.20.1/32 is directly connected, GigabitEthernet0/0/1
```

### POS-02: R1 IPv6 Routing Table
```text
R1#show ipv6 route
IPv6 Routing Table - 5 entries
Codes: C - Connected, L - Local, S - Static, R - RIP, B - BGP
       U - Per-user Static route, M - MIPv6
       I1 - ISIS L1, I2 - ISIS L2, IA - ISIS interarea, IS - ISIS summary
       ND - ND Default, NDp - ND Prefix, DCE - Destination, NDr - Redirect
       O - OSPF intra, OI - OSPF inter, OE1 - OSPF ext 1, OE2 - OSPF ext 2
       ON1 - OSPF NSSA ext 1, ON2 - OSPF NSSA ext 2
       D - EIGRP, EX - EIGRP external
C   2001:DB8:ACAD:10::/64 [0/0]
     via GigabitEthernet0/0/0, directly connected
L   2001:DB8:ACAD:10::1/128 [0/0]
     via GigabitEthernet0/0/0, receive
C   2001:DB8:ACAD:20::/64 [0/0]
     via GigabitEthernet0/0/1, directly connected
L   2001:DB8:ACAD:20::1/128 [0/0]
     via GigabitEthernet0/0/1, receive
L   FF00::/8 [0/0]
     via Null0, receive
```

### NEG-01: Route Table Dynamic Purge upon Interface Shutdown
```text
R1(config)#interface GigabitEthernet0/0/0
R1(config-if)#shutdown
%LINK-5-CHANGED: Interface GigabitEthernet0/0/0, changed state to administratively down
%LINEPROTO-5-UPDOWN: Line protocol on Interface GigabitEthernet0/0/0, changed state to down

R1#show ip route
Codes: L - local, C - connected, S - static, R - RIP, M - mobile, B - BGP
       D - EIGRP, EX - EIGRP external, O - OSPF, IA - OSPF inter area
       ...
Gateway of last resort is not set

     192.168.20.0/24 is variably subnetted, 2 subnets, 2 masks
C       192.168.20.0/24 is directly connected, GigabitEthernet0/0/1
L       192.168.20.1/32 is directly connected, GigabitEthernet0/0/1
```
*(Notice: Subnet `192.168.10.0/24` and host route `192.168.10.1/32` are completely removed from the routing table.)*

---

## 5. Artifact Manifest & Integrity Validation

All deliverables are saved in the lab repository tree and independently verified:

| File Path | Description | Size (Bytes) | SHA-256 Checksum |
|---|---|---|---|
| `labs/ip-addressing/verify-connected-networks/assets/starter.pkt` | Starter activity with deliberate configuration faults | 52,397 | `78fb2c13d55af711e36d02abd3edb0a9209a34808a891fb8f77cde91382d98e2` |
| `labs/ip-addressing/verify-connected-networks/assets/completed.pkt` | Fully resolved reference solution with all interfaces active | 52,588 | `fe982b8b5e039254caec7e6284819f935f63be5a7425d4a92aa359e13b280238` |
| `labs/ip-addressing/verify-connected-networks/assets/topology.png` | Authentic canvas screenshot captured from running simulator | 75,406 | `c9f5d66ab5f98eb4cb1e04a5da62f81c4e7c98b91ff1bd25b22626d79df1e910` |

### Reload Integrity Test
- Both files opened via IPC `ipc.appWindow().fileOpen()`.
- Device count: 6 devices (`R1`, `S1`, `S2`, `PC-A`, `PC-B`, plus 1 internal power module).
- Link count: 4 physical copper straight-through connections.
- Router prompt: `R1>` active upon completed load.
