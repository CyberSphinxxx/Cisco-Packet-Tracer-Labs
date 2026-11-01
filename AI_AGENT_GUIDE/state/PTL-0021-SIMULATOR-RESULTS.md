# Live Simulator Verification Report: PTL-0021

**Lab ID:** `PTL-0021`  
**Lab Title:** Static NAT and Inside Server Publishing  
**Category:** `network-services`  
**Difficulty:** Intermediate  
**Date (UTC):** 2026-10-31  
**Simulator Version:** Cisco Packet Tracer 9.0.1.0038 (64-bit Windows)  
**Verification Method:** Live In-Simulator IPC Execution via Antigravity Packet Tracer MCP Bridge  
**Overall Verdict:** **VERIFIED PASS** (100% of Positive, Negative, and Reload Tests Passed)

---

## 1. Executive Summary

This report documents the live simulation, technical verification, and deliverable validation for **PTL-0021: Static NAT and Inside Server Publishing** conducted inside Cisco Packet Tracer 9.0.1.

The laboratory topology represents an enterprise network hosting an internal server (`Svr-Internal`, `192.168.10.80`) on a private RFC 1918 LAN. The enterprise edge router (`R1`) connects via an outside public transit link (`203.0.113.0/29`) to an upstream Internet Service Provider (`ISP`), which routes traffic to an external client network (`198.51.100.0/24`, `PC-External`).

The core pedagogical objective is configuring and verifying a one-to-one inside static Network Address Translation (`ip nat inside source static 192.168.10.80 203.0.113.5`) on router `R1`. This mapping makes `Svr-Internal` accessible to external internet clients via its dedicated public Inside Global address (`203.0.113.5`), while shielding internal private workstations (`PC-Internal`, `192.168.10.10`) from external inbound unsolicited reachability.

In the starter state (`assets/starter.pkt`), IP addressing, switch access ports, routing, and interface NAT domain designations (`ip nat inside` on `Gi0/0/0` and `ip nat outside` on `Gi0/0/1`) are configured. However, the static NAT mapping is deliberately absent. Local LAN communication succeeds, but external inbound requests to `203.0.113.5` fail. In the completed state (`assets/completed.pkt`), the static translation mapping is configured, enabling persistent bidirectional reachability between `PC-External` and `Svr-Internal`.

Live simulator testing confirmed internal LAN reachability (POS-01), external inbound static NAT translation (POS-02), internal server outbound communication (POS-03), static NAT translation table inspection (POS-04), and NAT operational statistics counters (POS-05). Negative test scenarios validated that unmapped internal hosts remain strictly unreachable from the internet (NEG-01) and demonstrated fault injection through mapping removal and recovery (NEG-02). Clean project reloading was verified for both `.pkt` deliverables.

---

## 2. Live Simulator Environment & Topology

### Devices and Modules
| Device Name | Packet Tracer Model | Primary Interfaces | Role |
|---|---|---|---|
| **R1** | Cisco ISR 4321 | `Gi0/0/0` (`192.168.10.1/24`), `Gi0/0/1` (`203.0.113.1/29`) | Enterprise Edge Gateway & Static NAT Router |
| **ISP** | Cisco ISR 4321 | `Gi0/0/0` (`203.0.113.2/29`), `Gi0/0/1` (`198.51.100.1/24`) | Upstream Internet Service Provider Router |
| **S1** | Catalyst 2960-24TT | `Fa0/1`, `Fa0/10`, `Gig0/1`, `Vlan1` (`192.168.10.2/24`) | Enterprise Access Switch |
| **PC-Internal** | PC-PT | `FastEthernet0` (`192.168.10.10/24`) | Inside Private Workstation (Unmapped) |
| **Svr-Internal** | Server-PT | `FastEthernet0` (`192.168.10.80/24`) | Inside Private Enterprise Web/Application Server |
| **PC-External** | PC-PT | `FastEthernet0` (`198.51.100.50/24`) | External Simulated Internet Client |

### Cabling Matrix
- `PC-Internal FastEthernet0` <-> `S1 FastEthernet0/1` (Copper Straight-Through)
- `Svr-Internal FastEthernet0` <-> `S1 FastEthernet0/10` (Copper Straight-Through)
- `S1 GigabitEthernet0/1` <-> `R1 GigabitEthernet0/0/0` (Copper Straight-Through)
- `R1 GigabitEthernet0/0/1` <-> `ISP GigabitEthernet0/0/0` (Copper Crossover)
- `ISP GigabitEthernet0/0/1` <-> `PC-External FastEthernet0` (Copper Straight-Through)

### IPv4 Address Allocation Table
| Device | Interface | IPv4 Address | Subnet Mask | Default Gateway | NAT Designation |
|---|---|---|---|---|---|
| **R1** | `Gi0/0/0` | `192.168.10.1` | `255.255.255.0` | N/A | `ip nat inside` |
| **R1** | `Gi0/0/1` | `203.0.113.1` | `255.255.255.248` | N/A | `ip nat outside` |
| **ISP** | `Gi0/0/0` | `203.0.113.2` | `255.255.255.248` | N/A | Outside Network |
| **ISP** | `Gi0/0/1` | `198.51.100.1` | `255.255.255.0` | N/A | Outside Network |
| **S1** | `Vlan1` | `192.168.10.2` | `255.255.255.0` | `192.168.10.1` | Inside LAN |
| **PC-Internal** | `Fa0` | `192.168.10.10` | `255.255.255.0` | `192.168.10.1` | Inside Local (Private) |
| **Svr-Internal** | `Fa0` | `192.168.10.80` | `255.255.255.0` | `192.168.10.1` | Inside Local (`192.168.10.80`) / Inside Global (`203.0.113.5`) |
| **PC-External** | `Fa0` | `198.51.100.50` | `255.255.255.0` | `198.51.100.1` | Outside Global (`198.51.100.50`) |

---

## 3. Test Execution Matrix

| Test ID | Test Category | Objective | Simulator Action | Observed Simulator Output | Verdict |
|---|---|---|---|---|:---:|
| **POS-01** | LAN Connectivity | Verify inside workstation reachability to inside server | `ping 192.168.10.80` from `PC-Internal` | 3/3 replies, TTL=128, time <1ms | **PASS** |
| **POS-02** | Inbound Static NAT | Verify external client reachability to published server via inside global IP | `ping 203.0.113.5` from `PC-External` | 3/3 replies, TTL=126, translated across R1 | **PASS** |
| **POS-03** | Outbound Server NAT | Verify inside server reachability to external public client | `ping 198.51.100.50` from `Svr-Internal` | 3/3 replies, TTL=126, translated across R1 | **PASS** |
| **POS-04** | Static NAT Table Inspection | Verify static one-to-one translation entry persists on R1 | `show ip nat translations` on `R1` | Permanent entry `203.0.113.5 <-> 192.168.10.80` present | **PASS** |
| **POS-05** | NAT Operational Statistics | Verify NAT hits, misses, and interface domain bindings | `show ip nat statistics` on `R1` | Hits: 17, Misses: 18, 1 static translation active | **PASS** |
| **NEG-01** | Unmapped Host Shielding | Verify unmapped internal workstation cannot be reached from external network | `ping 192.168.10.10` from `PC-External` | `Destination host unreachable` from ISP gateway | **PASS** |
| **NEG-02** | Fault Injection & Recovery | Verify communication fails when static mapping removed, and recovers on restoration | Remove mapping on R1; verify ping drop; restore mapping; verify ping recovery | ICMP drops to 0% during deletion; restores immediately to 100% on re-entry | **PASS** |
| **REL-01** | Starter Reopen Verification | Verify starter file reloads cleanly with incomplete baseline state | `fileOpen` `starter.pkt`, ping `203.0.113.5` | File loads cleanly; external inbound ping fails as expected | **PASS** |
| **REL-02** | Completed Reopen Verification | Verify completed file reloads cleanly with working static NAT | `fileOpen` `completed.pkt`, ping `203.0.113.5` | File loads cleanly; full end-to-end translation verified | **PASS** |

---

## 4. Live Simulator Raw Telemetry

### 4.1. Baseline LAN Connectivity Check (POS-01)
```text
C:\>ping 192.168.10.80

Pinging 192.168.10.80 with 32 bytes of data:

Reply from 192.168.10.80: bytes=32 time<1ms TTL=128
Reply from 192.168.10.80: bytes=32 time<1ms TTL=128
Reply from 192.168.10.80: bytes=32 time<1ms TTL=128

Ping statistics for 192.168.10.80:
    Packets: Sent = 3, Received = 3, Lost = 0 (0% loss),
Approximate round trip times in milli-seconds:
    Minimum = 0ms, Maximum = 0ms, Average = 0ms
```

### 4.2. External Inbound Static NAT Translation (POS-02)
```text
C:\>ping 203.0.113.5

Pinging 203.0.113.5 with 32 bytes of data:

Reply from 203.0.113.5: bytes=32 time<1ms TTL=126
Reply from 203.0.113.5: bytes=32 time<1ms TTL=126
Reply from 203.0.113.5: bytes=32 time<1ms TTL=126

Ping statistics for 203.0.113.5:
    Packets: Sent = 3, Received = 3, Lost = 0 (0% loss),
Approximate round trip times in milli-seconds:
    Minimum = 0ms, Maximum = 0ms, Average = 0ms
```

### 4.3. Inside Server Outbound Static NAT Translation (POS-03)
```text
C:\>ping 198.51.100.50

Pinging 198.51.100.50 with 32 bytes of data:

Reply from 198.51.100.50: bytes=32 time<1ms TTL=126
Reply from 198.51.100.50: bytes=32 time<1ms TTL=126
Reply from 198.51.100.50: bytes=32 time<1ms TTL=126

Ping statistics for 198.51.100.50:
    Packets: Sent = 3, Received = 3, Lost = 0 (0% loss),
Approximate round trip times in milli-seconds:
    Minimum = 0ms, Maximum = 0ms, Average = 0ms
```

### 4.4. Static NAT Translation Table State (POS-04)
```text
R1#show ip nat translations
Pro  Inside global     Inside local       Outside local      Outside global
icmp 203.0.113.5:5     192.168.10.80:5    198.51.100.50:5    198.51.100.50:5
icmp 203.0.113.5:6     192.168.10.80:6    198.51.100.50:6    198.51.100.50:6
icmp 203.0.113.5:7     192.168.10.80:7    198.51.100.50:7    198.51.100.50:7
---  203.0.113.5       192.168.10.80      ---                ---
```

### 4.5. NAT Operational Statistics (POS-05)
```text
R1#show ip nat statistics
Total translations: 5 (1 static, 4 dynamic, 4 extended)
Outside Interfaces: GigabitEthernet0/0/1
Inside Interfaces: GigabitEthernet0/0/0
Hits: 17  Misses: 18
Expired translations: 14
Dynamic mappings:
```

### 4.6. Unmapped Private Host Shielding (NEG-01)
```text
C:\>ping 192.168.10.10

Pinging 192.168.10.10 with 32 bytes of data:

Reply from 198.51.100.1: Destination host unreachable.
Reply from 198.51.100.1: Destination host unreachable.

Ping statistics for 192.168.10.10:
    Packets: Sent = 2, Received = 0, Lost = 2 (100% loss)
```

### 4.7. Fault Injection & Recovery (NEG-02)
```text
! Step 1: Remove static mapping on R1
R1(config)# no ip nat inside source static 192.168.10.80 203.0.113.5
R1(config)# end
R1# clear ip nat translation *

! Step 2: Test reachability from PC-External (Failure Expected)
C:\>ping 203.0.113.5

Pinging 203.0.113.5 with 32 bytes of data:

Request timed out.
Request timed out.

! Step 3: Reapply static mapping on R1
R1(config)# ip nat inside source static 192.168.10.80 203.0.113.5
R1(config)# end

! Step 4: Retest reachability from PC-External (Recovery Confirmed)
C:\>ping 203.0.113.5

Pinging 203.0.113.5 with 32 bytes of data:

Reply from 203.0.113.5: bytes=32 time<1ms TTL=126
Reply from 203.0.113.5: bytes=32 time<1ms TTL=126
Reply from 203.0.113.5: bytes=32 time<1ms TTL=126
```

---

## 5. Artifact Integrity & Binary Fingerprints

| Deliverable Artifact | File Path | File Size | SHA-256 Checksum | Header Magic |
|---|---|---|---|---|
| **Starter Topology** | `assets/starter.pkt` | 64,740 bytes | `88c3654755a54d29e627d39943b48bcdff504f7089faecbc708f110023831e6c` | Authentic Packet Tracer binary |
| **Completed Topology** | `assets/completed.pkt` | 64,897 bytes | `c70874d11afe8f6e54e7d9256b9ee54d7df43ae3c67d04f889d2274b6d4ee9b5` | Authentic Packet Tracer binary |
| **Canvas Topology Capture** | `assets/topology.png` | 41,649 bytes | `cbb989073ec672312af4af0dcefc8c89364aea8a612f8167c502f0a1d317c921` | `\x89PNG\r\n\x1a\n` valid PNG image |

**Starter vs Completed Distinction:**
- Checksums are completely distinct (`88c3...` vs `c708...`).
- Delta represents the active `ip nat inside source static 192.168.10.80 203.0.113.5` configuration and operational state.

---

## 6. Deliverables Verification & Quality Sign-Off

- [x] All 6 network devices placed, cabled, and addressed according to specification.
- [x] Cisco ISR 4321, Catalyst 2960-24TT, and PC-PT models functional in Packet Tracer 9.0.1.
- [x] Live POS-01 through POS-05 tests executed and logged with 100% pass rate.
- [x] Live NEG-01 (unmapped host security) and NEG-02 (mapping removal/recovery) passed.
- [x] Both `.pkt` binaries independently reloadable and proven distinct.
- [x] Live topology screenshot captured from active Packet Tracer viewport.
- [x] Running configurations exported and verified for R1, ISP, and S1.
- [x] Verification evidence complete and signed off for autonomous curriculum release.

