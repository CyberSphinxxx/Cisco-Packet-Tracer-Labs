# Live Simulator Verification Report: PTL-0026

**Lab ID:** `PTL-0026`  
**Lab Title:** IPv6 SLAAC and Neighbor Discovery  
**Category:** `ip-addressing`  
**Difficulty:** Intermediate  
**Date (UTC):** 2026-10-31  
**Simulator Version:** Cisco Packet Tracer 9.0.1.0038 (64-bit Windows)  
**Verification Method:** Live In-Simulator IPC Execution via Antigravity Packet Tracer MCP Bridge  
**Overall Verdict:** **VERIFIED PASS** (100% of Positive, Negative, and Reload Tests Passed)

---

## 1. Executive Summary

This report documents the live simulation, technical verification, and deliverable validation for **PTL-0026: IPv6 SLAAC and Neighbor Discovery** executed inside Cisco Packet Tracer 9.0.1.

The laboratory topology models an IPv6 enterprise edge access segment:
1. **Core Gateway Router (`R1`):** A Cisco ISR 4321 router providing IPv6 routing, interface link-local (`fe80::1`) and global unicast (`2001:db8:acad:1::1/64`) addressing, and ICMPv6 Router Advertisements (RAs) across the access LAN.
2. **Access Switch (`S1`):** A Cisco Catalyst 2960-24TT switch providing Layer 2 LAN connectivity and SVI management (`2001:db8:acad:1::2/64`, `fe80::2`).
3. **Client Hosts (`PC-A` and `PC-B`):** Two end-user workstations configured for IPv6 Stateless Address Autoconfiguration (SLAAC).

The core educational focus centers on enabling IPv6 routing (`ipv6 unicast-routing`), observing periodic Router Advertisements (RAs, type 134), verifying that client hosts autonomously generate 64-bit Interface Identifiers (EUI-64 / SLAAC tokens) to formulate complete Global Unicast Addresses (GUAs), establishing bidirectional end-to-end communication, and analyzing the Cisco IOS IPv6 Neighbor Discovery cache (`show ipv6 neighbors`).

In the starter topology (`assets/starter.pkt`), baseline IPv6 interface addresses are configured, but `ipv6 unicast-routing` is not enabled, and client hosts have not performed SLAAC autoconfiguration. In the completed topology (`assets/completed.pkt`), `ipv6 unicast-routing` is active, client hosts have autoconfigured valid GUAs and default gateways, neighbor cache resolution is verified, and startup configurations are permanently saved.

Live testing confirmed router RA transmission parameters (POS-01), successful client host SLAAC autoconfiguration (POS-02), client-to-gateway reachability (POS-03), client-to-client LAN reachability (POS-04), neighbor cache resolution across hosts (POS-05), disabled unicast-routing RA suppression (NEG-01), and unresolved neighbor solicitations (NEG-02). Reload testing verified independent integrity for both `.pkt` artifacts.

---

## 2. Live Simulator Environment & Topology

### Devices and Modules
| Device Name | Packet Tracer Model | Primary Interfaces | Role |
|---|---|---|---|
| **R1** | Cisco ISR 4321 | `Gi0/0/0` (`2001:db8:acad:1::1/64`, `fe80::1`), `Loopback0` (`2001:db8:acad:99::1/64`) | Gateway Router & RA Advertiser |
| **S1** | Catalyst 2960-24TT | `Gig0/1`, `Fa0/1`, `Fa0/2`, `Vlan1` (`2001:db8:acad:1::2/64`, `fe80::2`) | Access LAN Switch |
| **PC-A** | PC-PT | `FastEthernet0` (SLAAC Autoconfigured) | Client Host A |
| **PC-B** | PC-PT | `FastEthernet0` (SLAAC Autoconfigured) | Client Host B |

### Cabling Matrix
- `R1 GigabitEthernet0/0/0` <-> `S1 GigabitEthernet0/1` (Copper Straight-Through)
- `PC-A FastEthernet0` <-> `S1 FastEthernet0/1` (Copper Straight-Through)
- `PC-B FastEthernet0` <-> `S1 FastEthernet0/2` (Copper Straight-Through)

### IPv6 Addressing Table
| Device | Interface | IPv6 Global Unicast | Prefix Length | IPv6 Link-Local | Role / Notes |
|---|---|---|---|---|---|
| **R1** | `Gi0/0/0` | `2001:db8:acad:1::1` | `/64` | `fe80::1` | Default Gateway & RA Advertiser |
| **R1** | `Loopback0` | `2001:db8:acad:99::1` | `/64` | N/A | Management Diagnostic Target |
| **S1** | `Vlan1` | `2001:db8:acad:1::2` | `/64` | `fe80::2` | Switch Management SVI |
| **PC-A** | `Fa0` | `2001:db8:acad:1:200:cff:fe6a:ea59` | `/64` | `fe80::200:cff:fe6a:ea59` | Client Host (SLAAC) |
| **PC-B** | `Fa0` | `2001:db8:acad:1:250:fff:fe10:97d2` | `/64` | `fe80::250:fff:fe10:97d2` | Client Host (SLAAC) |

---

## 3. Positive Verification Test Matrix (POS)

### POS-01: R1 IPv6 Interface RA Status & Prefix Advertisement
On `R1` privileged EXEC mode, `show ipv6 interface GigabitEthernet0/0/0` was queried to inspect RA timers, flags, and prefix announcements:

```cisco
R1#show ipv6 interface GigabitEthernet0/0/0
GigabitEthernet0/0/0 is up, line protocol is up
  IPv6 is enabled, link-local address is FE80::1
  No Virtual link-local address(es):
  Global unicast address(es):
    2001:DB8:ACAD:1::1, subnet is 2001:DB8:ACAD:1::/64
  Joined group address(es):
    FF02::1
    FF02::2
    FF02::1:FF00:1
  MTU is 1500 bytes
  ICMP error messages limited to one every 100 milliseconds
  ICMP redirects are enabled
  ICMP unreachables are sent
  ND DAD is enabled, number of DAD attempts: 1
  ND reachable time is 30000 milliseconds
  ND advertised reachable time is 0 (unspecified)
  ND advertised retransmit interval is 0 (unspecified)
  ND router advertisements are sent every 200 seconds
  ND router advertisements live for 1800 seconds
  ND advertised default router preference is Medium
  Hosts use stateless autoconfig for addresses.
```
- **Analysis:** `R1` is joined to `FF02::2` (all-routers multicast) and `FF02::1` (all-nodes multicast). Router advertisements are transmitted every 200 seconds announcing prefix `2001:DB8:ACAD:1::/64` with the A-flag set ("Hosts use stateless autoconfig for addresses").
- **Result:** **PASS**

---

### POS-02: Client Host SLAAC Autoconfiguration
From `PC-A` and `PC-B`, `ipv6config` was executed to verify automatic GUA derivation and default gateway binding:

From `PC-A`:
```text
C:\>ipv6config

FastEthernet0 Connection:(default port)

   Connection-specific DNS Suffix..: 
   Link-local IPv6 Address.........: FE80::200:CFF:FE6A:EA59
   IPv6 Address....................: 2001:DB8:ACAD:1:200:CFF:FE6A:EA59
   Default Gateway.................: FE80::1
   DHCPv6 IAID.....................: 
   DHCPv6 Client DUID..............: 00-01-00-01-07-6B-63-70-00-00-0C-6A-EA-59
```

From `PC-B`:
```text
C:\>ipv6config

FastEthernet0 Connection:(default port)

   Connection-specific DNS Suffix..: 
   Link-local IPv6 Address.........: FE80::250:FFF:FE10:97D2
   IPv6 Address....................: 2001:DB8:ACAD:1:250:FFF:FE10:97D2
   Default Gateway.................: FE80::1
   DHCPv6 IAID.....................: 
   DHCPv6 Client DUID..............: 00-01-00-01-2B-79-67-D4-00-50-0F-10-97-D2
```
- **Analysis:** Both hosts combined the advertised `/64` prefix (`2001:DB8:ACAD:1::`) with their EUI-64 interface identifiers to establish valid global unicast addresses and bound their default gateway to `FE80::1`.
- **Result:** **PASS**

---

### POS-03: Client-to-Gateway Reachability
From `PC-A`, ICMPv6 echo requests were sent to the router default gateway (`2001:db8:acad:1::1`):

```text
C:\>ping 2001:db8:acad:1::1

Pinging 2001:db8:acad:1::1 with 32 bytes of data:

Reply from 2001:DB8:ACAD:1::1: bytes=32 time<1ms TTL=255
Reply from 2001:DB8:ACAD:1::1: bytes=32 time<1ms TTL=255
Reply from 2001:DB8:ACAD:1::1: bytes=32 time<1ms TTL=255
Reply from 2001:DB8:ACAD:1::1: bytes=32 time<1ms TTL=255

Ping statistics for 2001:db8:acad:1::1:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)
```
- **Result:** **PASS** (100% delivery rate to the default gateway).

---

### POS-04: Host-to-Host LAN Reachability
From `PC-A`, ICMPv6 echo requests were sent directly to `PC-B` (`2001:DB8:ACAD:1:250:FFF:FE10:97D2`):

```text
C:\>ping 2001:DB8:ACAD:1:250:FFF:FE10:97D2

Pinging 2001:DB8:ACAD:1:250:FFF:FE10:97D2 with 32 bytes of data:

Reply from 2001:DB8:ACAD:1:250:FFF:FE10:97D2: bytes=32 time<1ms TTL=128
Reply from 2001:DB8:ACAD:1:250:FFF:FE10:97D2: bytes=32 time<1ms TTL=128
Reply from 2001:DB8:ACAD:1:250:FFF:FE10:97D2: bytes=32 time<1ms TTL=128
Reply from 2001:DB8:ACAD:1:250:FFF:FE10:97D2: bytes=32 time<1ms TTL=128

Ping statistics for 2001:DB8:ACAD:1:250:FFF:FE10:97D2:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)
```
- **Result:** **PASS** (Direct intra-subnet IPv6 delivery confirmed).

---

### POS-05: IPv6 Neighbor Discovery Cache Inspection
On `R1` privileged EXEC mode, `show ipv6 neighbors` was executed to inspect active Neighbor Discovery entries:

```cisco
R1#show ipv6 neighbors
IPv6 Address                              Age Link-layer Addr State Interface
2001:DB8:ACAD:1:200:CFF:FE6A:EA59           0 0000.0C6A.EA59  REACH Gig0/0/0
2001:DB8:ACAD:1:250:FFF:FE10:97D2           0 0050.0F10.97D2  REACH Gig0/0/0
```
- **Analysis:** `R1` successfully populated its neighbor cache through Neighbor Solicitation (NS) and Neighbor Advertisement (NA) transactions. Both `PC-A` (`0000.0C6A.EA59`) and `PC-B` (`0050.0F10.97D2`) are actively validated in `REACH` (Reachable) state.
- **Result:** **PASS**

---

## 4. Negative Verification Test Matrix (NEG)

### NEG-01: RA Suppression via Disabled Global Unicast Routing
On `R1`, `no ipv6 unicast-routing` was configured in global configuration mode:

```cisco
R1#configure terminal
R1(config)#no ipv6 unicast-routing
R1(config)#end
R1#show ipv6 interface GigabitEthernet0/0/0
GigabitEthernet0/0/0 is up, line protocol is up
  IPv6 is enabled, link-local address is FE80::1
  No Virtual link-local address(es):
  Global unicast address(es):
    2001:DB8:ACAD:1::1, subnet is 2001:DB8:ACAD:1::/64
  Joined group address(es):
    FF02::1:FF00:1
  MTU is 1500 bytes
  ICMP error messages limited to one every 100 milliseconds
  ICMP redirects are enabled
  ICMP unreachables are sent
  ND DAD is enabled, number of DAD attempts: 1
  ND reachable time is 30000 milliseconds
```
- **Analysis:** Without `ipv6 unicast-routing`, the router disassociates from the `FF02::2` (all-routers) multicast group, and completely suppresses Router Advertisement generation. The "ND router advertisements are sent every..." and "Hosts use stateless autoconfig..." lines disappear from interface status.
- **Result:** **PASS**

---

### NEG-02: Unresolved Neighbor Solicitation to Non-Existent Target
From `R1`, ICMPv6 echo requests were sent to an unallocated IPv6 address on the LAN (`2001:db8:acad:1::999`):

```cisco
R1#ping 2001:db8:acad:1::999

Type escape sequence to abort.
Sending 5, 100-byte ICMP Echos to 2001:db8:acad:1::999, timeout is 2 seconds:
.....
Success rate is 0 percent (0/5)
```
- **Analysis:** Because no node on the subnet responds to Neighbor Solicitation messages for `2001:db8:acad:1::999`, address resolution fails and packets are discarded with 0% success rate.
- **Result:** **PASS**

---

## 5. Artifact Reload and Verification Summary

| Artifact | Canonical Path | Byte Size | SHA-256 Checksum |
|---|---|---|---|
| **Starter PKT** | `labs/ip-addressing/ipv6-slaac-and-neighbor-discovery/assets/starter.pkt` | 53,549 | `0f50133a0b19a297c52da155846d061c8a07e1c86be8fa64f79381f6a5f38f92` |
| **Completed PKT** | `labs/ip-addressing/ipv6-slaac-and-neighbor-discovery/assets/completed.pkt` | 54,071 | `f7d865b4bc38b18452d778c7650b0b4d9f90603c0b8d0116a2db645623edfb9e` |
| **Topology PNG** | `labs/ip-addressing/ipv6-slaac-and-neighbor-discovery/assets/topology.png` | 41,512 | `159c9d9b8fbf440df57968edac56720d3607ebdab2713d73eeaede19cf52da90` |

- **Reload Verdict:** **PASS**
  - Starter topology cleanly contains baseline addressing prior to SLAAC activation.
  - Completed topology retains active IPv6 routing, autoconfigured client hosts, and verified neighbor cache.
