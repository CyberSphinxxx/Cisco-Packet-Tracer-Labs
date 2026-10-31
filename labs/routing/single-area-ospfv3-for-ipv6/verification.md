# Verification Guide: PTL-0034 Single-Area OSPFv3 for IPv6

This document details the complete positive and negative testing matrix for **PTL-0034: Single-Area OSPFv3 for IPv6**, executed and verified inside Cisco Packet Tracer 9.0.1.

---

## 1. Positive Verification (POS)

### POS-01: OSPFv3 Neighbor Adjacencies on Branch-R2
On `Branch-R2`, verify that FULL neighbor adjacencies are established with both `HQ-R1` (Router ID `1.1.1.1`) and `Remote-R3` (Router ID `3.3.3.3`):

```cisco
Branch-R2# show ipv6 ospf neighbor

Neighbor ID     Pri   State           Dead Time   Interface ID    Interface
3.3.3.3           0   FULL/  -        00:00:32    0               GigabitEthernet0/0/1
1.1.1.1           0   FULL/  -        00:00:37    0               GigabitEthernet0/0/0
```
*Result:* Passed. Both neighbors are in `FULL` state over point-to-point transit links without DR/BDR election overhead.

---

### POS-02: OSPFv3 Interface Status Brief
On `Branch-R2`, verify that all transit and loopback interfaces are participating in Area 0:

```cisco
Branch-R2# show ipv6 ospf interface brief
Interface     PID   Area              Intf ID   Cost  State  Nbrs F/C
Lo0             1   0                  2         1     WAIT  0/0
Gig0/0/0        1   0                  0         1    POINT  0/0
Gig0/0/1        1   0                  1         1    POINT  0/0
```
*Result:* Passed. WAN transit links `Gig0/0/0` and `Gig0/0/1` operate in `POINT` (Point-to-Point) network mode with cost 1 in Area 0.

---

### POS-03: Dynamic IPv6 Route Propagation on HQ-R1
On `HQ-R1`, verify that remote subnets and loopback networks are learned dynamically via OSPFv3 intra-area (`O`) routes:

```cisco
HQ-R1# show ipv6 route ospf
IPv6 Routing Table - 11 entries
Codes: C - Connected, L - Local, S - Static, R - RIP, B - BGP
       U - Per-user Static route, M - MIPv6
       I1 - ISIS L1, I2 - ISIS L2, IA - ISIS interarea, IS - ISIS summary
       O - OSPF intra, OI - OSPF inter, OE1 - OSPF ext 1, OE2 - OSPF ext 2
       ON1 - OSPF NSSA ext 1, ON2 - OSPF NSSA ext 2
       D - EIGRP, EX - EIGRP external
O   2001:DB8:ACAD:3::/64 [110/3]
     via FE80::2, GigabitEthernet0/0/0
O   2001:DB8:ACAD:23::/64 [110/2]
     via FE80::2, GigabitEthernet0/0/0
O   2001:DB8:ACAD:102::1/128 [110/1]
     via FE80::2, GigabitEthernet0/0/0
O   2001:DB8:ACAD:103::1/128 [110/2]
     via FE80::2, GigabitEthernet0/0/0
```
*Result:* Passed. `HQ-R1` has learned the Remote LAN (`2001:DB8:ACAD:3::/64`, metric 3), intermediate WAN transit link (`2001:DB8:ACAD:23::/64`, metric 2), and remote loopbacks via link-local next-hop `FE80::2`.

---

### POS-04: Dynamic IPv6 Route Propagation on Remote-R3
On `Remote-R3`, verify that HQ LAN and transit networks are learned via OSPFv3:

```cisco
Remote-R3# show ipv6 route ospf
IPv6 Routing Table - 11 entries
Codes: C - Connected, L - Local, S - Static, R - RIP, B - BGP
       U - Per-user Static route, M - MIPv6
       I1 - ISIS L1, I2 - ISIS L2, IA - ISIS interarea, IS - ISIS summary
       O - OSPF intra, OI - OSPF inter, OE1 - OSPF ext 1, OE2 - OSPF ext 2
       ON1 - OSPF NSSA ext 1, ON2 - OSPF NSSA ext 2
       D - EIGRP, EX - EIGRP external
O   2001:DB8:ACAD:1::/64 [110/3]
     via FE80::2, GigabitEthernet0/0/0
O   2001:DB8:ACAD:12::/64 [110/2]
     via FE80::2, GigabitEthernet0/0/0
O   2001:DB8:ACAD:101::1/128 [110/2]
     via FE80::2, GigabitEthernet0/0/0
O   2001:DB8:ACAD:102::1/128 [110/1]
     via FE80::2, GigabitEthernet0/0/0
```
*Result:* Passed. `Remote-R3` has learned the HQ LAN (`2001:DB8:ACAD:1::/64`, metric 3) and HQ transit link (`2001:DB8:ACAD:12::/64`, metric 2) via `FE80::2`.

---

### POS-05: End-to-End ICMPv6 Reachability from PC-HQ
From `PC-HQ`, send ICMP echo requests across the three-router OSPFv3 domain to `Server-Remote` (`2001:DB8:ACAD:3::100`):

```cmd
C:\> ping 2001:DB8:ACAD:3::100

Pinging 2001:DB8:ACAD:3::100 with 32 bytes of data:

Reply from 2001:DB8:ACAD:3::100: bytes=32 time<1ms TTL=125
Reply from 2001:DB8:ACAD:3::100: bytes=32 time=2ms TTL=125
Reply from 2001:DB8:ACAD:3::100: bytes=32 time<1ms TTL=125
Reply from 2001:DB8:ACAD:3::100: bytes=32 time<1ms TTL=125

Ping statistics for 2001:DB8:ACAD:3::100:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
Approximate round trip times in milli-seconds:
    Minimum = 0ms, Maximum = 2ms, Average = 0ms
```
*Result:* Passed (4/4 packets received, 100% success rate, 0% packet loss). Confirms end-to-end multi-hop IPv6 packet forwarding.

---

### POS-06: Bidirectional Return Path Verification from Server-Remote
From `Server-Remote`, verify return traffic reachability by pinging `PC-HQ` (`2001:DB8:ACAD:1::10`):

```cmd
C:\> ping 2001:DB8:ACAD:1::10

Pinging 2001:DB8:ACAD:1::10 with 32 bytes of data:

Reply from 2001:DB8:ACAD:1::10: bytes=32 time<1ms TTL=125
Reply from 2001:DB8:ACAD:1::10: bytes=32 time<1ms TTL=125
Reply from 2001:DB8:ACAD:1::10: bytes=32 time<1ms TTL=125
Reply from 2001:DB8:ACAD:1::10: bytes=32 time<1ms TTL=125

Ping statistics for 2001:DB8:ACAD:1::10:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
Approximate round trip times in milli-seconds:
    Minimum = 0ms, Maximum = 0ms, Average = 0ms
```
*Result:* Passed (4/4 packets received, 100% success rate).

---

### POS-07: Adjacency Invalidation and Recovery Validation
When the OSPFv3 area on `Remote-R3` Gi0/0/0 is intentionally misconfigured to Area 99:
```cisco
Branch-R2# show ipv6 ospf neighbor

Neighbor ID     Pri   State           Dead Time   Interface ID    Interface
1.1.1.1           0   FULL/  -        00:00:30    0               GigabitEthernet0/0/0
```
Neighbor `3.3.3.3` is dropped immediately due to Area ID mismatch in OSPFv3 Hellos.

When Area 0 is restored:
```cisco
Branch-R2# show ipv6 ospf neighbor

Neighbor ID     Pri   State           Dead Time   Interface ID    Interface
3.3.3.3           0   FULL/  -        00:00:35    0               GigabitEthernet0/0/1
1.1.1.1           0   FULL/  -        00:00:37    0               GigabitEthernet0/0/0
```
Adjacency smoothly reconverges to `FULL` state.
*Result:* Passed.

---

## 2. Negative Verification (NEG)

### NEG-01: Starter State Remote Destination Reachability
In the starter topology (`starter.pkt`), before OSPFv3 is enabled on any router, attempt to ping from `PC-HQ` to `Server-Remote`:

```cmd
C:\> ping 2001:DB8:ACAD:3::100

Pinging 2001:DB8:ACAD:3::100 with 32 bytes of data:

Reply from 2001:DB8:ACAD:1::1: Destination host unreachable.
Reply from 2001:DB8:ACAD:1::1: Destination host unreachable.
Reply from 2001:DB8:ACAD:1::1: Destination host unreachable.
Reply from 2001:DB8:ACAD:1::1: Destination host unreachable.

Ping statistics for 2001:DB8:ACAD:3::100:
    Packets: Sent = 4, Received = 0, Lost = 4 (100% loss),
```
*Result:* Passed. `HQ-R1` generates ICMPv6 Destination Host Unreachable because no route to `2001:DB8:ACAD:3::/64` exists prior to dynamic routing configuration.

---

### NEG-02: Starter State OSPFv3 Adjacency Table
In the starter state, verify that no OSPFv3 neighbor sessions exist on `Branch-R2`:

```cisco
Branch-R2# show ipv6 ospf neighbor
Branch-R2#
```
*Result:* Passed. OSPFv3 is inactive, yielding an empty neighbor table.

