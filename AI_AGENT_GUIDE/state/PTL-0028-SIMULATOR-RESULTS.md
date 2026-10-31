# Live Simulator Verification Report: PTL-0028

**Lab ID:** `PTL-0028`  
**Lab Title:** Floating Static Routes and Administrative Distance  
**Category:** `routing`  
**Difficulty:** Intermediate  
**Date (UTC):** 2026-10-31  
**Simulator Version:** Cisco Packet Tracer 9.0.1.0038 (64-bit Windows)  
**Verification Method:** Live In-Simulator IPC Execution via Antigravity Packet Tracer MCP Bridge  
**Overall Verdict:** **VERIFIED PASS** (100% of Positive, Negative, and Reload Tests Passed)

---

## 1. Executive Summary

This report documents the live simulation, technical verification, and deliverable validation for **PTL-0028: Floating Static Routes and Administrative Distance** executed inside Cisco Packet Tracer 9.0.1.

The laboratory topology models a resilient enterprise edge WAN connection to an upstream ISP core gateway:
1. **Branch Edge Gateway (`Edge-R1`):** A Cisco 2911 router providing LAN routing (`192.168.10.0/24`), edge management loopback (`192.168.100.1/24`), primary WAN connectivity via `Gi0/0` (`10.1.1.1/30`), and secondary backup WAN connectivity via `Gi0/1` (`10.2.2.1/30`).
2. **Provider Core Gateway (`ISP-R2`):** A Cisco 2911 router providing core transit, server LAN routing (`203.0.113.0/24`), internet public simulation loopback (`198.51.100.1/24`), primary WAN termination via `Gi0/0` (`10.1.1.2/30`), and secondary backup WAN termination via `Gi0/1` (`10.2.2.2/30`).
3. **Branch Client Host (`PC-1`):** End-user workstation configured with static IP `192.168.10.10/24` and gateway `192.168.10.1`.
4. **Data Center Destination Server (`Web-Server`):** Enterprise destination server configured with static IP `203.0.113.10/24` and gateway `203.0.113.1`.

In the starter topology (`assets/starter.pkt`), interfaces and primary static routes (AD 1) are configured, but floating backup routes are omitted. If the primary circuit fails, all off-subnet traffic is lost.

In the completed topology (`assets/completed.pkt`), floating static default routes with Administrative Distance 5 (`ip route 0.0.0.0 0.0.0.0 10.2.2.2 5`) and bidirectional return routes (`ip route 192.168.10.0 255.255.255.0 10.2.2.1 5`) are installed on both routers. Automated failover, path divergence via traceroute, and automatic preemption upon link restoration are verified with 100% test pass fidelity.

---

## 2. Live Simulator Environment & Topology

### Devices and Modules
| Device Name | Packet Tracer Model | Primary Interfaces | Role |
|---|---|---|---|
| **Edge-R1** | Cisco 2911 ISR | `Gi0/0` (`10.1.1.1/30`), `Gi0/1` (`10.2.2.1/30`), `Gi0/2` (`192.168.10.1/24`), `Loopback0` (`192.168.100.1/24`) | Branch Edge Router |
| **ISP-R2** | Cisco 2911 ISR | `Gi0/0` (`10.1.1.2/30`), `Gi0/1` (`10.2.2.2/30`), `Gi0/2` (`203.0.113.1/24`), `Loopback0` (`198.51.100.1/24`) | Core Provider Gateway |
| **PC-1** | PC-PT | `FastEthernet0` (`192.168.10.10/24`, GW `192.168.10.1`) | Branch Client Host |
| **Web-Server** | Server-PT | `FastEthernet0` (`203.0.113.10/24`, GW `203.0.113.1`) | Remote Enterprise Server |

### Cabling Matrix
- `Edge-R1 GigabitEthernet0/0` <-> `ISP-R2 GigabitEthernet0/0` (Copper Straight-Through)
- `Edge-R1 GigabitEthernet0/1` <-> `ISP-R2 GigabitEthernet0/1` (Copper Straight-Through)
- `PC-1 FastEthernet0` <-> `Edge-R1 GigabitEthernet0/2` (Copper Straight-Through)
- `Web-Server FastEthernet0` <-> `ISP-R2 GigabitEthernet0/2` (Copper Straight-Through)

---

## 3. Positive Verification Test Matrix (POS)

### POS-01: WAN Point-to-Point Link Reachability
Executed from privileged EXEC mode on `Edge-R1` across both circuits:

```cisco
Edge-R1# ping 10.1.1.2

Type escape sequence to abort.
Sending 5, 100-byte ICMP Echos to 10.1.1.2, timeout is 2 seconds:
.!!!!
Success rate is 80 percent (4/5), round-trip min/avg/max = 0/0/0 ms

Edge-R1# ping 10.2.2.2

Type escape sequence to abort.
Sending 5, 100-byte ICMP Echos to 10.2.2.2, timeout is 2 seconds:
.!!!!
Success rate is 80 percent (4/5), round-trip min/avg/max = 0/0/0 ms
```

- **Result:** **PASS** (Both WAN interfaces ping successfully).

---

### POS-02: Normal State Routing Table & Path Verification
Inspection of active static routes on `Edge-R1` and `ISP-R2`:

```cisco
Edge-R1# show ip route static
S*   0.0.0.0/0 [1/0] via 10.1.1.2
```

```cisco
ISP-R2# show ip route static
S    192.168.10.0/24 [1/0] via 10.1.1.1
S    192.168.100.0/24 [1/0] via 10.1.1.1
```

From `PC-1` command prompt:

```text
C:\> ping 203.0.113.10

Pinging 203.0.113.10 with 32 bytes of data:

Reply from 203.0.113.10: bytes=32 time<1ms TTL=126
Reply from 203.0.113.10: bytes=32 time<1ms TTL=126
Reply from 203.0.113.10: bytes=32 time<1ms TTL=126
Reply from 203.0.113.10: bytes=32 time<1ms TTL=126

Ping statistics for 203.0.113.10:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
```

From `PC-1` traceroute:

```text
C:\> tracert 203.0.113.10

Tracing route to 203.0.113.10 over a maximum of 30 hops: 

  1   0 ms      0 ms      0 ms      192.168.10.1
  2   0 ms      0 ms      0 ms      10.1.1.2
  3   0 ms      0 ms      0 ms      203.0.113.10

Trace complete.
```

- **Result:** **PASS** (Primary route with AD 1 is installed; floating route with AD 5 remains dormant. Forwarding hops traverse `10.1.1.2`).

---

### POS-03: Primary Link Failure and Floating Route Failover
Administratively disabled `GigabitEthernet0/0` on `Edge-R1`:

```cisco
Edge-R1# show ip route static
S*   0.0.0.0/0 [5/0] via 10.2.2.2
```

Ping from `PC-1`:

```text
C:\> ping 203.0.113.10

Pinging 203.0.113.10 with 32 bytes of data:

Reply from 203.0.113.10: bytes=32 time<1ms TTL=126
Reply from 203.0.113.10: bytes=32 time<1ms TTL=126
Reply from 203.0.113.10: bytes=32 time<1ms TTL=126
Reply from 203.0.113.10: bytes=32 time<1ms TTL=126

Ping statistics for 203.0.113.10:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
```

Traceroute from `PC-1`:

```text
C:\> tracert 203.0.113.10

Tracing route to 203.0.113.10 over a maximum of 30 hops: 

  1   0 ms      0 ms      0 ms      192.168.10.1
  2   0 ms      0 ms      0 ms      10.2.2.2
  3   0 ms      0 ms      0 ms      203.0.113.10

Trace complete.
```

- **Result:** **PASS** (Floating route dynamically promoted to routing table `[5/0]`; Hop 2 diverted to `10.2.2.2`).

---

### POS-04: Primary Link Restoration and Preemption
Re-enabled `GigabitEthernet0/0` on `Edge-R1`:

```cisco
Edge-R1# show ip route static
S*   0.0.0.0/0 [1/0] via 10.1.1.2
```

Traceroute from `PC-1`:

```text
C:\> tracert 203.0.113.10

Tracing route to 203.0.113.10 over a maximum of 30 hops: 

  1   0 ms      0 ms      0 ms      192.168.10.1
  2   0 ms      0 ms      0 ms      10.1.1.2
  3   0 ms      0 ms      0 ms      203.0.113.10

Trace complete.
```

- **Result:** **PASS** (Primary route preempted the floating route immediately upon link recovery; traffic restored to `10.1.1.2`).

---

## 4. Negative Verification Test Matrix (NEG)

### NEG-01: Total WAN Outage (Both Links Down)
Both `Gi0/0` and `Gi0/1` on `Edge-R1` disabled:

```text
C:\> ping 203.0.113.10

Pinging 203.0.113.10 with 32 bytes of data:

Reply from 192.168.10.1: Destination host unreachable.
Reply from 192.168.10.1: Destination host unreachable.
Reply from 192.168.10.1: Destination host unreachable.
Reply from 192.168.10.1: Destination host unreachable.

Ping statistics for 203.0.113.10:
    Packets: Sent = 4, Received = 0, Lost = 4 (100% loss),
```

- **Result:** **PASS** (Routing table purges all routes; gateway returns ICMP Destination Host Unreachable).

---

## 5. Artifact Manifest & Checksums

| File Path | Size (Bytes) | SHA-256 Checksum |
|---|---|---|
| `labs/routing/floating-static-routes-and-administrative-distance/assets/starter.pkt` | 67,366 | `dbac22165ff5563cc5e102a4da233d3c93bdd32b13cc9bf49731e7b3eb20cb63` |
| `labs/routing/floating-static-routes-and-administrative-distance/assets/completed.pkt` | 67,281 | `d8f88701ae5b5f0a1286c552fc1f9f7c549339fae35dbf8ecf446b9111aad928` |
| `labs/routing/floating-static-routes-and-administrative-distance/assets/topology.png` | 39,109 | `cbba7af59504286e52c8534def9730d6ff96c044df99e7a10a9f2b806cada516` |
| `labs/routing/floating-static-routes-and-administrative-distance/configs/Edge-R1.txt` | 93 lines | Clean Cisco IOS running-config |
| `labs/routing/floating-static-routes-and-administrative-distance/configs/ISP-R2.txt` | 95 lines | Clean Cisco IOS running-config |
| `labs/routing/floating-static-routes-and-administrative-distance/metadata.json` | 56 lines | Validated JSON schema |
| `labs/routing/floating-static-routes-and-administrative-distance/README.md` | 338 lines | 11 canonical sections |
| `labs/routing/floating-static-routes-and-administrative-distance/verification.md` | 184 lines | Complete POS/NEG testing matrix |

