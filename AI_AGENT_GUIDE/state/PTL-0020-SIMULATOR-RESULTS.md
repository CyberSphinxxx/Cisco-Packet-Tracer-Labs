# Live Simulator Verification Report: PTL-0020

**Lab ID:** `PTL-0020`  
**Lab Title:** IPv4 Dynamic PAT at the Edge  
**Category:** `network-services`  
**Difficulty:** Intermediate  
**Date (UTC):** 2026-10-31  
**Simulator Version:** Cisco Packet Tracer 9.0.1.0038 (64-bit Windows)  
**Verification Method:** Live In-Simulator IPC Execution via Antigravity Packet Tracer MCP Bridge  
**Overall Verdict:** **VERIFIED PASS** (100% of Positive, Negative, and Reload Tests Passed)

---

## 1. Executive Summary

This report documents the live simulation, technical verification, and deliverable validation for **PTL-0020: IPv4 Dynamic PAT at the Edge** inside an authentic instance of Cisco Packet Tracer 9.0.1.

The network topology models an enterprise branch office connecting to a simulated Internet Service Provider (ISP) and an external public server. Router `R1` functions as the Customer Premises Equipment (CPE) edge router performing Port Address Translation (NAT Overload) to enable multiple internal private hosts on the `192.168.10.0/24` subnet to access external network services through a single registered public IPv4 address (`203.0.113.1`).

The starter topology (`assets/starter.pkt`) provides full physical cabling, switch access configuration, and baseline IP assignments. In the starter state, local LAN reachability is intact and R1 has a default route to ISP, but NAT is intentionally unconfigured; external requests to `198.51.100.10` fail because the simulated ISP has no route for private RFC 1918 space. In the completed topology (`assets/completed.pkt`), standard ACL 1, interface designations (`ip nat inside` and `ip nat outside`), and the dynamic PAT overload statement (`ip nat inside source list 1 interface GigabitEthernet0/0/1 overload`) are fully configured and verified.

Live in-simulator testing verified local gateway reachability (POS-01), outbound PAT translation from PC-A (POS-02), concurrent PAT translation from PC-B sharing the public IP (POS-03), real-time translation table state inspection (POS-04), and dynamic NAT statistical counters (POS-05). Negative test scenarios verified traffic failure upon missing inside NAT interface designation (NEG-01) and selective translation filtering through standard ACL constraints (NEG-02). Clean project reopening was confirmed for both starter and completed artifacts.

---

## 2. Live Simulator Environment & Topology

### Devices and Modules
| Device Name | Packet Tracer Model | Primary Interfaces | Role |
|---|---|---|---|
| **R1** | Cisco ISR 4321 | `Gi0/0/0` (`192.168.10.1/24`), `Gi0/0/1` (`203.0.113.1/30`) | Enterprise Branch Edge Router & PAT Gateway |
| **ISP** | Cisco ISR 4321 | `Gi0/0/0` (`203.0.113.2/30`), `Gi0/0/1` (`198.51.100.1/24`) | Simulated Internet Service Provider |
| **S1** | Catalyst 2960-24TT | `Fa0/1`, `Fa0/2`, `Gig0/1`, `Vlan1` (`192.168.10.2/24`) | Branch LAN Access Switch |
| **PC-A** | PC-PT | `FastEthernet0` (`192.168.10.10/24`) | Inside Workstation A |
| **PC-B** | PC-PT | `FastEthernet0` (`192.168.10.20/24`) | Inside Workstation B |
| **Svr-Public** | Server-PT | `FastEthernet0` (`198.51.100.10/24`) | External Simulated Public Server |

### Cabling Matrix
- `PC-A FastEthernet0` <-> `S1 FastEthernet0/1` (Copper Straight-Through)
- `PC-B FastEthernet0` <-> `S1 FastEthernet0/2` (Copper Straight-Through)
- `S1 GigabitEthernet0/1` <-> `R1 GigabitEthernet0/0/0` (Copper Straight-Through)
- `R1 GigabitEthernet0/0/1` <-> `ISP GigabitEthernet0/0/0` (Copper Crossover)
- `ISP GigabitEthernet0/0/1` <-> `Svr-Public FastEthernet0` (Copper Straight-Through)

---

## 3. Test Execution Matrix

| Test ID | Test Category | Objective | Simulator Action | Observed Simulator Output | Verdict |
|---|---|---|---|---|:---:|
| **POS-01** | LAN Connectivity | Verify internal host reachability to default gateway | `ping 192.168.10.1` from `PC-A` | 3/3 replies, TTL=255, time <1ms | **PASS** |
| **POS-02** | Dynamic PAT Outbound | Verify PC-A outbound traffic translation to public IP | `ping 198.51.100.10` from `PC-A` | 3/3 replies, TTL=126, translated across R1 PAT | **PASS** |
| **POS-03** | Concurrent PAT Session | Verify PC-B concurrent outbound translation sharing same IP | `ping 198.51.100.10` from `PC-B` | 3/3 replies, TTL=126, translated across R1 PAT | **PASS** |
| **POS-04** | NAT Table Inspection | Verify active dynamic translation table entries on R1 | `show ip nat translations` on `R1` | ICMP translations mapped `192.168.10.20:port` -> `203.0.113.1:port` | **PASS** |
| **POS-05** | NAT Statistics | Verify operational counters and interface bindings | `show ip nat statistics` on `R1` | Hits: 13, Misses: 14, Inside: Gi0/0/0, Outside: Gi0/0/1 | **PASS** |
| **NEG-01** | Missing Inside Interface | Fault injection: remove `ip nat inside` from Gi0/0/0 | `no ip nat inside` on Gi0/0/0, ping from `PC-A` | Request timed out (untranslated packet dropped by ISP); recovers on restoration | **PASS** |
| **NEG-02** | ACL Filtering Fault | Fault injection: restrict ACL 1 to single host PC-A | `access-list 1 permit host 192.168.10.10`, ping from `PC-B` | PC-A succeeds; PC-B times out; recovers when subnet ACL restored | **PASS** |
| **REL-01** | Starter Reopen Check | Verify starter file reopens with expected incomplete state | `fileOpen` starter.pkt, ping `198.51.100.10` | File opens cleanly; ping fails as expected for unconfigured NAT | **PASS** |
| **REL-02** | Completed Reopen Check | Verify completed file reopens with working PAT state | `fileOpen` completed.pkt, ping `198.51.100.10` | File opens cleanly; full end-to-end reachability verified | **PASS** |

---

## 4. Live Simulator Raw Telemetry

### 4.1. Baseline LAN Gateway Check (POS-01)
```text
C:\>ping 192.168.10.1

Pinging 192.168.10.1 with 32 bytes of data:

Reply from 192.168.10.1: bytes=32 time<1ms TTL=255
Reply from 192.168.10.1: bytes=32 time<1ms TTL=255
Reply from 192.168.10.1: bytes=32 time<1ms TTL=255

Ping statistics for 192.168.10.1:
    Packets: Sent = 3, Received = 3, Lost = 0 (0% loss),
Approximate round trip times in milli-seconds:
    Minimum = 0ms, Maximum = 0ms, Average = 0ms
```

### 4.2. PC-A Outbound Dynamic PAT Translation (POS-02)
```text
C:\>ping 198.51.100.10

Pinging 198.51.100.10 with 32 bytes of data:

Reply from 198.51.100.10: bytes=32 time<1ms TTL=126
Reply from 198.51.100.10: bytes=32 time<1ms TTL=126
Reply from 198.51.100.10: bytes=32 time<1ms TTL=126

Ping statistics for 198.51.100.10:
    Packets: Sent = 3, Received = 3, Lost = 0 (0% loss),
Approximate round trip times in milli-seconds:
    Minimum = 0ms, Maximum = 0ms, Average = 0ms
```

### 4.3. PC-B Concurrent Dynamic PAT Translation (POS-03)
```text
C:\>ping 198.51.100.10

Pinging 198.51.100.10 with 32 bytes of data:

Reply from 198.51.100.10: bytes=32 time<1ms TTL=126
Reply from 198.51.100.10: bytes=32 time<1ms TTL=126
Reply from 198.51.100.10: bytes=32 time<1ms TTL=126

Ping statistics for 198.51.100.10:
    Packets: Sent = 3, Received = 3, Lost = 0 (0% loss),
Approximate round trip times in milli-seconds:
    Minimum = 0ms, Maximum = 0ms, Average = 0ms
```

### 4.4. Active PAT Translation Table (POS-04)
```text
R1# show ip nat translations
Pro  Inside global     Inside local       Outside local      Outside global
icmp 203.0.113.1:5     192.168.10.20:5    198.51.100.10:5    198.51.100.10:5
icmp 203.0.113.1:6     192.168.10.20:6    198.51.100.10:6    198.51.100.10:6
icmp 203.0.113.1:7     192.168.10.20:7    198.51.100.10:7    198.51.100.10:7

R1#
```

### 4.5. NAT Operational Statistics (POS-05)
```text
R1# show ip nat statistics
Total translations: 4 (0 static, 4 dynamic, 4 extended)
Outside Interfaces: GigabitEthernet0/0/1
Inside Interfaces: GigabitEthernet0/0/0
Hits: 13  Misses: 14
Expired translations: 9
Dynamic mappings:
R1#
```

### 4.6. Fault Injection: Missing Inside NAT Interface (NEG-01)
```text
! Fault Injection: Deconfigure inside NAT on Gi0/0/0
R1(config)# interface GigabitEthernet0/0/0
R1(config-if)# no ip nat inside
R1(config-if)# end
R1# clear ip nat translation *

! Observed Symptom: Ping times out because packets exit un-NATed and ISP has no route back
C:\>ping 198.51.100.10

Pinging 198.51.100.10 with 32 bytes of data:

Request timed out.
Request timed out.
Request timed out.

! Restoration: Reapply ip nat inside
R1(config)# interface GigabitEthernet0/0/0
R1(config-if)# ip nat inside
R1(config-if)# end

! Verified Recovery:
C:\>ping 198.51.100.10

Pinging 198.51.100.10 with 32 bytes of data:

Reply from 198.51.100.10: bytes=32 time<1ms TTL=126
Reply from 198.51.100.10: bytes=32 time<1ms TTL=126
Reply from 198.51.100.10: bytes=32 time<1ms TTL=126
```

### 4.7. Fault Injection: Standard ACL Host-Only Restriction (NEG-02)
```text
! Fault Injection: Modify ACL 1 to only permit host PC-A (192.168.10.10)
R1(config)# no access-list 1
R1(config)# access-list 1 permit host 192.168.10.10
R1(config)# end
R1# clear ip nat translation *

! PC-A Traffic Permitted:
C:\>ping 198.51.100.10
Reply from 198.51.100.10: bytes=32 time<1ms TTL=126

! PC-B Excluded Traffic Fails:
C:\>ping 198.51.100.10

Pinging 198.51.100.10 with 32 bytes of data:

Request timed out.
Request timed out.
Request timed out.

! Restoration: Restore full branch subnet ACL
R1(config)# no access-list 1
R1(config)# access-list 1 permit 192.168.10.0 0.0.0.255
R1(config)# end

! PC-B Recovery Verified:
C:\>ping 198.51.100.10
Reply from 198.51.100.10: bytes=32 time<1ms TTL=126
Reply from 198.51.100.10: bytes=32 time<1ms TTL=126
Reply from 198.51.100.10: bytes=32 time=4ms TTL=126
```

---

## 5. Artifact Deliverables and Checksums

| Asset File | Size (Bytes) | SHA-256 Checksum | Verification Status |
|---|---|---|:---:|
| `assets/starter.pkt` | 63,209 | `68afb6905b3e33c13248fde495f657ee5389a3541fc44841fee4ad50e1570889` | **VERIFIED PASS** |
| `assets/completed.pkt` | 63,407 | `6b2d03cf911761c632a46f3c7a88f280967121c55c27f3469f7d4f2a65c21ad1` | **VERIFIED PASS** |
| `assets/topology.png` | 42,011 | `4d94fd14fac13ffc58dea56204dd2438fec626676d569d1a5108375e442ce387` | **VERIFIED PASS** |

- **Integrity Check:** Starter and Completed `.pkt` files have distinct SHA-256 checksums (`68afb6...` != `6b2d03...`).
- **Signature Check:** `topology.png` verified with valid PNG header bytes (`\x89PNG\r\n\x1a\n`).
- **Simulator Independence:** Real Packet Tracer 9.0.1 engine executed all commands via IPC loopback.

