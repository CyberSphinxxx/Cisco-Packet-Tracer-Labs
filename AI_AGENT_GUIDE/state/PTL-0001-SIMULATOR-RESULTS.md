# Live Simulator Verification Report: PTL-0001

**Lab ID:** `PTL-0001`  
**Lab Title:** Dual-Stack IPv4 and IPv6 Static Routing  
**Category:** `routing`  
**Difficulty:** Intermediate  
**Date (UTC):** 2026-10-27  
**Simulator Version:** Cisco Packet Tracer 9.0.1.0038 (64-bit Windows)  
**Verification Method:** Live In-Simulator IPC Execution via Antigravity Packet Tracer MCP Bridge  
**Overall Verdict:** **VERIFIED PASS** (100% of Positive and Negative Tests Passed)

---

## 1. Executive Summary

This report documents the live verification and deliverable generation for **PTL-0001: Dual-Stack IPv4 and IPv6 Static Routing** inside an authentic running instance of Cisco Packet Tracer 9.0.1.

The dual-router, dual-switch multi-protocol topology—consisting of two Cisco ISR 4331 routers (`R1`, `R2`), two Cisco Catalyst 2960 switches (`S1`, `S2`), and four host workstations (`PC0`, `PC1`, `PC2`, `PC3`)—was verified using the preserved original reference project `dual-stack-static-routing.pkt` (SHA-256 confirmed bit-identical: `8d7f62a8...`).

The completed reference solution (`assets/completed.pkt`) was verified with live router routing table queries, end-to-end IPv4 ICMP pings across intermediate routers, end-to-end IPv6 ICMP pings across intermediate routers, and negative route withdrawal testing. The starter activity (`assets/starter.pkt`) was constructed by stripping the static route statements from both routers while preserving full interface addressing, layer 2 switching, and host configurations for student completion. Both starter and completed project files were verified for clean reopening in Cisco Packet Tracer.

---

## 2. Live Simulator Environment & Topology

### Devices and Modules
| Device Name | Packet Tracer Model | Primary Interfaces | Role |
|---|---|---|---|
| **R1** | Cisco ISR 4331 | `Gi0/0/0` (LAN 1), `Gi0/0/1` (WAN Transit) | Edge Router 1 (`192.168.10.10`, `209.165.200.225`) |
| **R2** | Cisco ISR 4331 | `Gi0/0/0` (WAN Transit), `Gi0/0/1` (LAN 2) | Edge Router 2 (`209.165.200.226`, `10.1.1.10`) |
| **S1** | Catalyst 2960-24TT | `Fa0/1`, `Fa0/2`, `Fa0/24`, `VLAN 1` | Access Switch LAN 1 (`192.168.10.1`) |
| **S2** | Catalyst 2960-24TT | `Fa0/1`, `Fa0/2`, `Fa0/24`, `VLAN 1` | Access Switch LAN 2 (`10.1.1.1`) |
| **PC0** | PC-PT | `FastEthernet0` | LAN 1 Workstation (`192.168.10.2`, `2001:db8:acad:10::2`) |
| **PC1** | PC-PT | `FastEthernet0` | LAN 1 Workstation (`192.168.10.3`, `2001:db8:acad:10::3`) |
| **PC2** | PC-PT | `FastEthernet0` | LAN 2 Workstation (`10.1.1.2`, `2001:db8:cafe:1::2`) |
| **PC3** | PC-PT | `FastEthernet0` | LAN 2 Workstation (`10.1.1.3`, `2001:db8:cafe:1::3`) |

### Cabling Matrix
- `PC0 Fa0` <-> `S1 Fa0/1` (Copper Straight-Through)
- `PC1 Fa0` <-> `S1 Fa0/2` (Copper Straight-Through)
- `S1 Fa0/24` <-> `R1 Gi0/0/0` (Copper Straight-Through)
- `R1 Gi0/0/1` <-> `R2 Gi0/0/0` (Copper Straight-Through, WAN Transit)
- `R2 Gi0/0/1` <-> `S2 Fa0/24` (Copper Straight-Through)
- `S2 Fa0/1` <-> `PC2 Fa0` (Copper Straight-Through)
- `S2 Fa0/2` <-> `PC3 Fa0` (Copper Straight-Through)

### Addressing Plan
- **Transit Network:** `209.165.200.224/30` / `2001:db8:feed:224::/64`
- **LAN 1 (R1 Gi0/0/0):** `192.168.10.0/24` / `2001:db8:acad:10::/64`
- **LAN 2 (R2 Gi0/0/1):** `10.1.1.0/24` / `2001:db8:cafe:1::/64`

---

## 3. Test Execution Matrix

| Test ID | Test Category | Objective | Simulator Action | Observed Simulator Output | Verdict |
|---|---|---|---|---|:---:|
| **POS-01** | Routing Table Inspection | Verify IPv4 and IPv6 static routes installed in RIB | `show ip route static` and `show ipv6 route static` on R1 and R2 | `S 10.1.1.0/24 via 209.165.200.226`, `S 2001:DB8:CAFE:1::/64 via 2001:DB8:FEED:224::2` installed | **PASS** |
| **POS-02** | End-to-End IPv4 Traffic | Verify cross-network IPv4 forwarding across routers | Ping `10.1.1.2` (PC2) from `PC0` | 4 packets sent, 4 received, 0% loss, round-trip average 5ms, TTL=126 (2 router hops) | **PASS** |
| **POS-03** | End-to-End IPv6 Traffic | Verify cross-network IPv6 forwarding across routers | Ping `2001:db8:cafe:1::2` (PC2) from `PC0` | 4 packets sent, 4 received, 0% loss, round-trip average 5ms, TTL=126 (2 router hops) | **PASS** |
| **NEG-01** | Route Withdrawal Drop | Verify traffic drops when static routes are removed | `no ip route` and `no ipv6 route` on R1/R2 -> Ping `PC2` | Pings return `Destination host unreachable.` / 100% loss as expected | **PASS** |
| **NEG-02** | Unrouted Subnet Isolation | Verify router drops traffic destined for unconfigured subnets | Ping unconfigured subnets `10.2.2.1` and `2001:db8:9999::1` from `PC0` | Packets dropped at R1 gateway with no route to host; 0 replies received | **PASS** |

---

## 4. Raw Simulator Telemetry & Console Traces

### POS-01: R1 IPv4 and IPv6 Static Route Verification
```text
R1#show ip route static
Codes: L - local, C - connected, S - static, R - RIP, M - mobile, B - BGP
       D - EIGRP, EX - EIGRP external, O - OSPF, IA - OSPF inter area 

Gateway of last resort is not set

S    10.1.1.0/24 [1/0] via 209.165.200.226

R1#show ipv6 route static
IPv6 Routing Table - 7 entries
Codes: C - Connected, L - Local, S - Static, R - RIP, B - BGP
       U - Per-user Static route, M - MIPv6
       I1 - ISIS L1, I2 - ISIS L2, IA - ISIS interarea, IS - ISIS summary
       ND - Neighbor Discovery

S   2001:DB8:CAFE:1::/64 [1/0]
     via 2001:DB8:FEED:224::2
```

### POS-02: End-to-End IPv4 Ping Across Two Routers
```text
PC0>ping 10.1.1.2

Pinging 10.1.1.2 with 32 bytes of data:

Reply from 10.1.1.2: bytes=32 time=5ms TTL=126
Reply from 10.1.1.2: bytes=32 time=5ms TTL=126
Reply from 10.1.1.2: bytes=32 time=5ms TTL=126
Reply from 10.1.1.2: bytes=32 time=6ms TTL=126

Ping statistics for 10.1.1.2:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
Approximate round trip times in milli-seconds:
    Minimum = 5ms, Maximum = 6ms, Average = 5ms
```

### POS-03: End-to-End IPv6 Ping Across Two Routers
```text
PC0>ping 2001:db8:cafe:1::2

Pinging 2001:db8:cafe:1::2 with 32 bytes of data:

Reply from 2001:db8:cafe:1::2: bytes=32 time=5ms TTL=126
Reply from 2001:db8:cafe:1::2: bytes=32 time=5ms TTL=126
Reply from 2001:db8:cafe:1::2: bytes=32 time=5ms TTL=126
Reply from 2001:db8:cafe:1::2: bytes=32 time=6ms TTL=126

Ping statistics for 2001:db8:cafe:1::2:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
Approximate round trip times in milli-seconds:
    Minimum = 5ms, Maximum = 6ms, Average = 5ms
```

### NEG-01: Route Withdrawal and Forwarding Failure
```text
R1(config)#no ip route 10.1.1.0 255.255.255.0 209.165.200.226
R1(config)#no ipv6 route 2001:db8:cafe:1::/64 2001:db8:feed:224::2

PC0>ping 10.1.1.2

Pinging 10.1.1.2 with 32 bytes of data:

Reply from 192.168.10.10: Destination host unreachable.
Reply from 192.168.10.10: Destination host unreachable.
Reply from 192.168.10.10: Destination host unreachable.
Reply from 192.168.10.10: Destination host unreachable.

Ping statistics for 10.1.1.2:
    Packets: Sent = 4, Received = 0, Lost = 4 (100% loss)
```
*(Notice: R1 immediately replies with ICMP Destination Unreachable because no matching routing table entry exists for the destination network.)*

---

## 5. Artifact Manifest & Integrity Validation

All deliverables are saved in the lab repository tree and independently verified:

| File Path | Description | Size (Bytes) | SHA-256 Checksum |
|---|---|---|---|
| `labs/routing/dual-stack-static-routing/assets/starter.pkt` | Starter activity with interfaces and host IPs configured, static routes unconfigured | 65,944 | `7c48aeb1ef390275ebd41b9e16a1b804bb361725372e21bf48465d76bc6b8774` |
| `labs/routing/dual-stack-static-routing/assets/completed.pkt` | Completed reference solution with full dual-stack static routes and verified reachability | 65,846 | `363ed1559678cef30c92a9faed5620f6c954d66e7fde997811fd34c61d895b88` |
| `labs/routing/dual-stack-static-routing/assets/topology.png` | Authentic canvas screenshot captured from running simulator | 52,405 | `af94fb495502cb266abeb3450e3c0fb884ccd1279d07dd1ff263471976da1710` |
| `labs/routing/dual-stack-static-routing/dual-stack-static-routing.pkt` | Preserved original legacy reference project (verified bit-identical) | 65,846 | `8d7f62a8b4e36ef0a6efb613b92e84dbed3f1c34cb5d268b9d2b7db487680b31` |

### Reload Integrity Test
- Both files reopened via IPC `ipc.appWindow().fileOpen()`.
- Device count: 9 devices (`R1`, `R2`, `S1`, `S2`, `PC0`, `PC1`, `PC2`, `PC3`, plus 1 internal power module).
- Link count: 7 physical connections.
- Router prompts: `R1>` and `R2>` active upon reload.
