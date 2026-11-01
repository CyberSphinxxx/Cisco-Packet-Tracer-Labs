# Verification Guide: PTL-0026 IPv6 SLAAC and Neighbor Discovery

This document details the complete positive and negative testing matrix for **PTL-0026**, executed and verified inside Cisco Packet Tracer 9.0.1.

---

## 1. Positive Verification (POS)

### POS-01: Router Interface RA Status & Prefix Advertisement
On `R1` privileged EXEC mode:

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

- **Verification criteria:** Interface is up/up; joined to `FF02::2`; periodic RAs transmitted every 200s; Autonomous flag announced ("Hosts use stateless autoconfig for addresses").

---

### POS-02: Client Host SLAAC Autoconfiguration
From `PC-A` command prompt:

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

From `PC-B` command prompt:

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

- **Verification criteria:** Both hosts derive valid GUAs matching prefix `2001:DB8:ACAD:1::/64` and bind default gateway to `FE80::1`.

---

### POS-03: Client-to-Gateway Reachability
From `PC-A` command prompt:

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

- **Verification criteria:** 100% round-trip delivery rate to default gateway.

---

### POS-04: Host-to-Host Intra-Subnet Reachability
From `PC-A` command prompt:

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

- **Verification criteria:** 100% direct host-to-host delivery across access switch `S1`.

---

### POS-05: IPv6 Neighbor Discovery Cache Inspection
On `R1` privileged EXEC mode:

```cisco
R1#show ipv6 neighbors
IPv6 Address                              Age Link-layer Addr State Interface
2001:DB8:ACAD:1:200:CFF:FE6A:EA59           0 0000.0C6A.EA59  REACH Gig0/0/0
2001:DB8:ACAD:1:250:FFF:FE10:97D2           0 0050.0F10.97D2  REACH Gig0/0/0
```

- **Verification criteria:** Neighbor table records both client hosts with resolved Layer 2 MAC addresses in state `REACH`.

---

## 2. Negative Verification (NEG)

### NEG-01: RA Suppression via Disabled Global Unicast Routing
On `R1` global configuration mode:

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

- **Verification criteria:** Router leaves `FF02::2` (all-routers) multicast group; RA timers and autoconfig flags are suppressed.

---

### NEG-02: Unresolved Neighbor Solicitation to Non-Existent Target
On `R1` privileged EXEC mode:

```cisco
R1#ping 2001:db8:acad:1::999

Type escape sequence to abort.
Sending 5, 100-byte ICMP Echos to 2001:db8:acad:1::999, timeout is 2 seconds:
.....
Success rate is 0 percent (0/5)
```

- **Verification criteria:** Neighbor solicitation attempts go unacknowledged, leading to 0% ICMP delivery rate.

---

## 3. Artifact Reload and Hash Verification

| Artifact | File Path | Byte Size | SHA-256 Checksum | Reload Status |
|---|---|---|---|---|
| **Starter PKT** | `assets/starter.pkt` | 53,549 | `0f50133a0b19a297c52da155846d061c8a07e1c86be8fa64f79381f6a5f38f92` | Verified clean baseline |
| **Completed PKT** | `assets/completed.pkt` | 54,071 | `f7d865b4bc38b18452d778c7650b0b4d9f90603c0b8d0116a2db645623edfb9e` | Verified active SLAAC & resolved cache |
| **Topology PNG** | `assets/topology.png` | 41,512 | `159c9d9b8fbf440df57968edac56720d3607ebdab2713d73eeaede19cf52da90` | Verified 2D canvas capture |
