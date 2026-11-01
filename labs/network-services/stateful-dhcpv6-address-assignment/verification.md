# Verification Guide: PTL-0033 Stateful DHCPv6 Address Assignment

This document details the complete positive and negative testing matrix for **PTL-0033: Stateful DHCPv6 Address Assignment**, executed and verified inside Cisco Packet Tracer 9.0.1.

---

## 1. Positive Verification (POS)

### POS-01: Stateful IPv6 Address Acquisition on PC1
On `PC1`, issue `ipv6config` to verify that the host has acquired an IPv6 Global Unicast Address from the DHCPv6 pool prefix `2001:DB8:ACAD:1::/64`:

```cmd
C:\> ipv6config

FastEthernet0 Connection:(default port)

   Connection-specific DNS Suffix..: cisco.lab 
   Link-local IPv6 Address.........: FE80::250:FFF:FE15:6ECB
   IPv6 Address....................: 2001:DB8:ACAD:1:717D:5548:5548:47B6
   Default Gateway.................: FE80::1
   DHCPv6 IAID.....................: 1684834516
   DHCPv6 Client DUID..............: 00-01-00-01-95-10-3B-14-00-50-0F-15-6E-CB
```
*Result:* Passed. PC1 leased `2001:DB8:ACAD:1:717D:5548:5548:47B6/64`, learned the default gateway `FE80::1` from Router Advertisements, and established a valid IA_NA association.

---

### POS-02: Stateful IPv6 Address Acquisition on PC2
On `PC2`, verify dynamic lease assignment from the server pool:

```cmd
C:\> ipv6config

FastEthernet0 Connection:(default port)

   Connection-specific DNS Suffix..: cisco.lab 
   Link-local IPv6 Address.........: FE80::230:F2FF:FED9:AD59
   IPv6 Address....................: 2001:DB8:ACAD:1:AA91:9CFE:8E6C:8E6C
   Default Gateway.................: FE80::1
   DHCPv6 IAID.....................: 215059000
   DHCPv6 Client DUID..............: 00-01-00-01-50-24-7C-32-00-30-F2-D9-AD-59
```
*Result:* Passed. PC2 leased a unique global unicast address `2001:DB8:ACAD:1:AA91:9CFE:8E6C:8E6C/64` within the pool prefix.

---

### POS-03: DHCPv6 Option Parameters (DNS and Domain Name)
On `PC1`, verify that optional network configuration parameters configured in the server pool were successfully communicated:

```cmd
Connection-specific DNS Suffix..: cisco.lab
```
*Result:* Passed. Both PC1 and PC2 received the domain suffix `cisco.lab` and recursive DNS server parameters from `DHCP-R1`.

---

### POS-04: DHCPv6 Server Pool Utilization
On `DHCP-R1`, verify active client counter in pool statistics:

```cisco
DHCP-R1# show ipv6 dhcp pool
DHCPv6 pool: IPV6-STATEFUL-LAN1
  Address allocation prefix: 2001:DB8:ACAD:1::/64 valid 172800 preferred 86400 (6 in use, 0 conflicts)
  DNS server: 2001:4860:4860::8888
  Domain name: cisco.lab
  Active clients: 2
```
*Result:* Passed. `DHCP-R1` reports 2 active client leases allocated from `IPV6-STATEFUL-LAN1`.

---

### POS-05: DHCPv6 Server Binding Database
On `DHCP-R1`, inspect the active binding database to ensure both client DUIDs and leased IPv6 addresses are tracked:

```cisco
DHCP-R1# show ipv6 dhcp binding
Client: FE80::230:F2FF:FED9:AD59
  DUID: 0001000150247C320030F2D9AD59
  IA NA: IA ID 215059000, T1 0, T2 0
    Address: 2001:DB8:ACAD:1:AA91:9CFE:8E6C:8E6C
            preferred lifetime 86400, valid lifetime 172800
            expires at November 2 2026 11:25:7 am (172800 seconds)
Client: FE80::250:FFF:FE15:6ECB
  DUID: 0001000195103B1400500F156ECB
  IA NA: IA ID 1684834516, T1 0, T2 0
    Address: 2001:DB8:ACAD:1:717D:5548:5548:47B6
            preferred lifetime 86400, valid lifetime 172800
            expires at November 2 2026 11:25:7 am (172800 seconds)
```
*Result:* Passed. Both PC1 (`DUID 0001000195103B1400500F156ECB`) and PC2 (`DUID 0001000150247C320030F2D9AD59`) are actively bound with standard valid (172800s) and preferred (86400s) lease lifetimes.

---

### POS-06: End-to-End IPv6 Routing from PC1
From `PC1`, ping the remote LAN 2 host `Server-Remote` (`2001:DB8:ACAD:2::100`) across `DHCP-R1` and `Core-R2`:

```cmd
C:\> ping 2001:DB8:ACAD:2::100

Pinging 2001:DB8:ACAD:2::100 with 32 bytes of data:

Reply from 2001:DB8:ACAD:2::100: bytes=32 time<1ms TTL=126
Reply from 2001:DB8:ACAD:2::100: bytes=32 time<1ms TTL=126
Reply from 2001:DB8:ACAD:2::100: bytes=32 time<1ms TTL=126
Reply from 2001:DB8:ACAD:2::100: bytes=32 time<1ms TTL=126

Ping statistics for 2001:DB8:ACAD:2::100:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
Approximate round trip times in milli-seconds:
    Minimum = 0ms, Maximum = 0ms, Average = 0ms
```
*Result:* Passed (4/4 replies, 100% success rate, 0% packet loss). Confirms full two-way IPv6 routing across both routers.

---

### POS-07: End-to-End IPv6 Routing from PC2
From `PC2`, ping the remote LAN 2 host `Server-Remote` (`2001:DB8:ACAD:2::100`):

```cmd
C:\> ping 2001:DB8:ACAD:2::100

Pinging 2001:DB8:ACAD:2::100 with 32 bytes of data:

Reply from 2001:DB8:ACAD:2::100: bytes=32 time<1ms TTL=126
Reply from 2001:DB8:ACAD:2::100: bytes=32 time=3ms TTL=126
Reply from 2001:DB8:ACAD:2::100: bytes=32 time<1ms TTL=126
Reply from 2001:DB8:ACAD:2::100: bytes=32 time<1ms TTL=126

Ping statistics for 2001:DB8:ACAD:2::100:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
Approximate round trip times in milli-seconds:
    Minimum = 0ms, Maximum = 3ms, Average = 0ms
```
*Result:* Passed (4/4 replies, 100% success rate).

---

## 2. Negative Verification (NEG)

### NEG-01: Client Unassigned State Before Server Configuration
In the starter topology (`starter.pkt`), before the stateful DHCPv6 pool and router advertisement flags are applied to `DHCP-R1`, inspect `PC1`:

```cmd
C:\> ipv6config

FastEthernet0 Connection:(default port)

   Connection-specific DNS Suffix..: 
   Link-local IPv6 Address.........: FE80::250:FFF:FE15:6ECB
   IPv6 Address....................: ::
   Default Gateway.................: ::
   DHCPv6 IAID.....................: 
   DHCPv6 Client DUID..............: 00-01-00-01-95-10-3B-14-00-50-0F-15-6E-CB
```
*Result:* Passed. PC1 has not acquired any Global Unicast IPv6 Address (`IPv6 Address: ::`), proving that without DHCPv6 server and M-flag configuration, stateful assignment does not take place.

---

### NEG-02: DHCPv6 Pool Inactive State
In the starter state, verify that `DHCP-R1` maintains no active DHCPv6 leases:

```cisco
DHCP-R1# show ipv6 dhcp pool
DHCP-R1# show ipv6 dhcp binding
DHCP-R1#
```
*Result:* Passed. No pools or bindings exist, confirming a clean unconfigured initial state.

