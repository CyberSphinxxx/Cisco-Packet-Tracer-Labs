# Live Simulator Verification Report: PTL-0022

**Lab ID:** `PTL-0022`  
**Lab Title:** DNS Records and HTTP Web Services  
**Category:** `network-services`  
**Difficulty:** Beginner  
**Date (UTC):** 2026-10-31  
**Simulator Version:** Cisco Packet Tracer 9.0.1.0038 (64-bit Windows)  
**Verification Method:** Live In-Simulator IPC Execution via Antigravity Packet Tracer MCP Bridge  
**Overall Verdict:** **VERIFIED PASS** (100% of Positive, Negative, and Reload Tests Passed)

---

## 1. Executive Summary

This report documents the live simulation, technical verification, and deliverable validation for **PTL-0022: DNS Records and HTTP Web Services** executed inside Cisco Packet Tracer 9.0.1.

The laboratory topology models an enterprise network featuring two distinct subnets interconnected by a default gateway router (`R1`):
1. **Client LAN (`192.168.10.0/24`):** Accommodates client workstations `PC-1` and `PC-2` connected via access switch `S1`.
2. **Server Farm LAN (`192.168.20.0/24`):** Accommodates a dedicated internal DNS server (`DNS-Server`, `192.168.20.50`) and a corporate HTTP web server (`Web-Server`, `192.168.20.80`) connected via server access switch `S2`.

The core pedagogical objectives center on configuring authoritative DNS services in Cisco Packet Tracer, defining Address (A) records (`web.corp.local` and `portal.corp.local`) and Canonical Name (CNAME) aliases (`www.corp.local`), pointing client resolver configurations across routed subnets, and validating seamless hostname resolution and web page delivery.

In the starter topology (`assets/starter.pkt`), physical cabling, switch access ports, router subnets, and host IP parameters are fully established. However, the DNS service on `DNS-Server` is disabled. Direct IP reachability between clients and servers succeeds, but hostname lookups (`nslookup`) and web requests fail. In the completed topology (`assets/completed.pkt`), the DNS service is active, resource records are populated, and end-to-end name resolution and HTTP access are fully functional.

Live testing confirmed IP reachability (POS-01), primary A record resolution (POS-02), CNAME alias lookup (POS-03), secondary A record lookup (POS-04), and HTTP web portal page retrieval (POS-05). Negative testing confirmed non-existent domain rejection (NEG-01) and fault injection via record deletion and restoration (NEG-02). Reload testing verified independent integrity for both `.pkt` artifacts.

---

## 2. Live Simulator Environment & Topology

### Devices and Modules
| Device Name | Packet Tracer Model | Primary Interfaces | Role |
|---|---|---|---|
| **R1** | Cisco ISR 4321 | `Gi0/0/0` (`192.168.10.1/24`), `Gi0/0/1` (`192.168.20.1/24`) | Default Gateway Router |
| **S1** | Catalyst 2960-24TT | `Fa0/1`, `Fa0/2`, `Gig0/1`, `Vlan1` (`192.168.10.2/24`) | Client LAN Switch |
| **S2** | Catalyst 2960-24TT | `Fa0/10`, `Fa0/11`, `Gig0/1`, `Vlan1` (`192.168.20.2/24`) | Server Farm LAN Switch |
| **PC-1** | PC-PT | `FastEthernet0` (`192.168.10.10/24`) | Client Workstation 1 |
| **PC-2** | PC-PT | `FastEthernet0` (`192.168.10.20/24`) | Client Workstation 2 |
| **DNS-Server** | Server-PT | `FastEthernet0` (`192.168.20.50/24`) | Authoritative Enterprise DNS Server |
| **Web-Server** | Server-PT | `FastEthernet0` (`192.168.20.80/24`) | Corporate HTTP Web Portal Server |

### Cabling Matrix
- `PC-1 FastEthernet0` <-> `S1 FastEthernet0/1` (Copper Straight-Through)
- `PC-2 FastEthernet0` <-> `S1 FastEthernet0/2` (Copper Straight-Through)
- `S1 GigabitEthernet0/1` <-> `R1 GigabitEthernet0/0/0` (Copper Straight-Through)
- `R1 GigabitEthernet0/0/1` <-> `S2 GigabitEthernet0/1` (Copper Straight-Through)
- `S2 FastEthernet0/10` <-> `DNS-Server FastEthernet0` (Copper Straight-Through)
- `S2 FastEthernet0/11` <-> `Web-Server FastEthernet0` (Copper Straight-Through)

### IPv4 Addressing & Services Table
| Device | Interface | IPv4 Address | Subnet Mask | Default Gateway | DNS Server | Services |
|---|---|---|---|---|---|---|
| **R1** | `Gi0/0/0` | `192.168.10.1` | `255.255.255.0` | N/A | N/A | Client LAN Gateway |
| **R1** | `Gi0/0/1` | `192.168.20.1` | `255.255.255.0` | N/A | N/A | Server Farm Gateway |
| **S1** | `Vlan1` | `192.168.10.2` | `255.255.255.0` | `192.168.10.1` | N/A | Switch Management SVI |
| **S2** | `Vlan1` | `192.168.20.2` | `255.255.255.0` | `192.168.20.1` | N/A | Switch Management SVI |
| **PC-1** | `Fa0` | `192.168.10.10` | `255.255.255.0` | `192.168.10.1` | `192.168.20.50` | Workstation 1 Resolver |
| **PC-2** | `Fa0` | `192.168.10.20` | `255.255.255.0` | `192.168.10.1` | `192.168.20.50` | Workstation 2 Resolver |
| **DNS-Server** | `Fa0` | `192.168.20.50` | `255.255.255.0` | `192.168.20.1` | `127.0.0.1` | DNS Server (Port 53 UDP/TCP) |
| **Web-Server** | `Fa0` | `192.168.20.80` | `255.255.255.0` | `192.168.20.1` | `192.168.20.50` | HTTP Server (Port 80 TCP) |

---

## 3. Test Execution Matrix

| Test ID | Test Category | Objective | Simulator Action | Observed Simulator Output | Verdict |
|---|---|---|---|---|:---:|
| **POS-01** | Subnet Routing | Verify client reachability to web server across R1 gateway | `ping 192.168.20.80` from `PC-1` | 3/3 replies, TTL=127, time <1ms | **PASS** |
| **POS-02** | Primary A Record | Verify A record resolution for `web.corp.local` | `nslookup web.corp.local` from `PC-1` | Non-authoritative answer: `192.168.20.80` | **PASS** |
| **POS-03** | CNAME Alias Record | Verify canonical alias resolution for `www.corp.local` | `nslookup www.corp.local` from `PC-1` | Resolves alias `web.corp.local` to `192.168.20.80` | **PASS** |
| **POS-04** | Secondary A Record | Verify independent A record lookup from `PC-2` | `nslookup portal.corp.local` from `PC-2` | Non-authoritative answer: `192.168.20.80` | **PASS** |
| **POS-05** | HTTP Web Delivery | Verify HTTP client page download via resolved FQDN | `HttpClient.go("http://www.corp.local")` on `PC-1` | Downloaded HTML contains "Corporate Intranet Portal" | **PASS** |
| **NEG-01** | Non-Existent Domain | Verify resolver behavior on unregistered hostname | `nslookup nonexistent.corp.local` on `PC-1` | `*** UnKnown can't find nonexistent.corp.local: Non-existent domain.` | **PASS** |
| **NEG-02** | Fault Injection & Fix | Verify failure on deleted record and instant recovery upon re-entry | Remove `portal.corp.local`; query fails; re-add record; query succeeds | Non-existent domain during removal; returns `192.168.20.80` upon restoration | **PASS** |
| **REL-01** | Starter Reopen Check | Verify starter file reloads with DNS disabled | `fileOpen` `starter.pkt`, query `web.corp.local` | File loads cleanly; DNS queries fail as expected | **PASS** |
| **REL-02** | Completed Reopen Check | Verify completed file reloads with working DNS | `fileOpen` `completed.pkt`, query `web.corp.local` | File loads cleanly; DNS resolves successfully | **PASS** |

---

## 4. Live Simulator Raw Telemetry

### 4.1. Baseline Subnet Routing (POS-01)
```text
C:\>ping 192.168.20.80

Pinging 192.168.20.80 with 32 bytes of data:

Reply from 192.168.20.80: bytes=32 time<1ms TTL=127
Reply from 192.168.20.80: bytes=32 time<1ms TTL=127
Reply from 192.168.20.80: bytes=32 time<1ms TTL=127

Ping statistics for 192.168.20.80:
    Packets: Sent = 3, Received = 3, Lost = 0 (0% loss),
Approximate round trip times in milli-seconds:
    Minimum = 0ms, Maximum = 0ms, Average = 0ms
```

### 4.2. Primary A Record Lookup (POS-02)
```text
C:\>nslookup web.corp.local

Server: [192.168.20.50]
Address:  192.168.20.50

Non-authoritative answer:
Name:   web.corp.local
Address:   192.168.20.80
```

### 4.3. CNAME Alias Record Lookup (POS-03)
```text
C:\>nslookup www.corp.local

Server: [192.168.20.50]
Address:  192.168.20.50

Non-authoritative answer:
Name:   web.corp.local
Address:   192.168.20.80

Aliases:   web.corp.local
```

### 4.4. Secondary A Record Lookup from PC-2 (POS-04)
```text
C:\>nslookup portal.corp.local

Server: [192.168.20.50]
Address:  192.168.20.50

Non-authoritative answer:
Name:   portal.corp.local
Address:   192.168.20.80
```

### 4.5. HTTP Web Page Download (POS-05)
```html
<html><head><title>Corporate Intranet Portal</title></head><body><h1>Welcome to Corporate Intranet</h1><p>DNS and HTTP services operational.</p></body></html>
```

### 4.6. Non-Existent Domain Query Rejection (NEG-01)
```text
C:\>nslookup nonexistent.corp.local

Server: [192.168.20.50]
Address:  192.168.20.50
*** UnKnown can't find nonexistent.corp.local: Non-existent domain.
```

### 4.7. Fault Injection & Recovery (NEG-02)
```text
! Step 1: Remove record from DNS Server database
! Record 'portal.corp.local' removed

! Step 2: Query from PC-2 (Failure Expected)
C:\>nslookup portal.corp.local

Server: [192.168.20.50]
Address:  192.168.20.50
*** UnKnown can't find portal.corp.local: Non-existent domain.

! Step 3: Re-add record to DNS Server database
! Record 'portal.corp.local' -> '192.168.20.80' restored

! Step 4: Query from PC-2 (Recovery Confirmed)
C:\>nslookup portal.corp.local

Server: [192.168.20.50]
Address:  192.168.20.50

Non-authoritative answer:
Name:   portal.corp.local
Address:   192.168.20.80
```

---

## 5. Artifact Integrity & Binary Fingerprints

| Deliverable Artifact | File Path | File Size | SHA-256 Checksum | Header Magic |
|---|---|---|---|---|
| **Starter Topology** | `assets/starter.pkt` | 81,212 bytes | `a503889b1dae1c439c1a0074c97d6e25ebc037958c1e2da859c4f99aea3f818c` | Authentic Packet Tracer binary |
| **Completed Topology** | `assets/completed.pkt` | 81,381 bytes | `21c6c3c1233081fb34dd86e4b77c4e90b34a75a306c965786abd7f28f11473a4` | Authentic Packet Tracer binary |
| **Canvas Topology Capture** | `assets/topology.png` | 41,882 bytes | `e0757f55cd942dba1de7d6ceb64d4cfec56998241e523341e5f807dba965b632` | `\x89PNG\r\n\x1a\n` valid PNG image |

**Starter vs Completed Distinction:**
- Checksums are completely distinct (`a503...` vs `21c6...`).
- Difference corresponds to the active DNS service engine state and database records (`web.corp.local`, `www.corp.local`, `portal.corp.local`).

---

## 6. Deliverables Verification & Quality Sign-Off

- [x] All 7 network devices placed, cabled, and addressed according to specification.
- [x] Cisco ISR 4321, Catalyst 2960-24TT, PC-PT, and Server-PT functional in Packet Tracer 9.0.1.
- [x] Live POS-01 through POS-05 tests executed and logged with 100% pass rate.
- [x] Live NEG-01 (invalid domain) and NEG-02 (record removal/restoration) passed.
- [x] Both `.pkt` binaries independently reloadable and proven distinct.
- [x] Live topology screenshot captured from active Packet Tracer viewport.
- [x] Running configurations exported and verified for R1, S1, and S2.
- [x] Verification evidence complete and signed off for autonomous curriculum release.

