# Verification Guide: PTL-0027 IPv6 Static and Default Route Troubleshooting

This document details the complete positive and negative testing matrix for **PTL-0027**, executed and verified inside Cisco Packet Tracer 9.0.1.

---

## 1. Positive Verification (POS)

### POS-01: Direct WAN Link Reachability
On `R1` and `R2` privileged EXEC mode:

```cisco
R1# ping 2001:db8:acad:12::2

Type escape sequence to abort.
Sending 5, 100-byte ICMP Echos to 2001:db8:acad:12::2, timeout is 2 seconds:
!!!!!
Success rate is 100 percent (5/5), round-trip min/avg/max = 0/0/0 ms
```

```cisco
R2# ping 2001:db8:acad:23::3

Type escape sequence to abort.
Sending 5, 100-byte ICMP Echos to 2001:db8:acad:23::3, timeout is 2 seconds:
!!!!!
Success rate is 100 percent (5/5), round-trip min/avg/max = 0/0/0 ms
```

- **Verification criteria:** Success rate is 100% (5/5) across both point-to-point transit subnets (`2001:db8:acad:12::/64` and `2001:db8:acad:23::/64`).

---

### POS-02: IPv6 Routing Table Validation
On `R1` privileged EXEC mode:

```cisco
R1# show ipv6 route
IPv6 Routing Table - 8 entries
Codes: C - Connected, L - Local, S - Static, R - RIP, B - BGP
S   ::/0 [1/0]
     via 2001:DB8:ACAD:12::2
C   2001:DB8:ACAD:1::/64 [0/0]
     via GigabitEthernet0/0/1, directly connected
L   2001:DB8:ACAD:1::1/128 [0/0]
     via GigabitEthernet0/0/1, receive
C   2001:DB8:ACAD:12::/64 [0/0]
     via GigabitEthernet0/0/0, directly connected
L   2001:DB8:ACAD:12::1/128 [0/0]
     via GigabitEthernet0/0/0, receive
C   2001:DB8:ACAD:101::/64 [0/0]
     via Loopback0, directly connected
L   2001:DB8:ACAD:101::1/128 [0/0]
     via Loopback0, receive
L   FF00::/8 [0/0]
     via Null0, receive
```

On `R2` privileged EXEC mode:

```cisco
R2# show ipv6 route
IPv6 Routing Table - 11 entries
Codes: C - Connected, L - Local, S - Static, R - RIP, B - BGP
S   2001:DB8:ACAD:1::/64 [1/0]
     via 2001:DB8:ACAD:12::1
S   2001:DB8:ACAD:3::/64 [1/0]
     via 2001:DB8:ACAD:23::3
C   2001:DB8:ACAD:12::/64 [0/0]
     via GigabitEthernet0/0/0, directly connected
L   2001:DB8:ACAD:12::2/128 [0/0]
     via GigabitEthernet0/0/0, receive
C   2001:DB8:ACAD:23::/64 [0/0]
     via GigabitEthernet0/0/1, directly connected
L   2001:DB8:ACAD:23::2/128 [0/0]
     via GigabitEthernet0/0/1, receive
S   2001:DB8:ACAD:101::/64 [1/0]
     via 2001:DB8:ACAD:12::1
C   2001:DB8:ACAD:202::/64 [0/0]
     via Loopback0, directly connected
L   2001:DB8:ACAD:202::1/128 [0/0]
     via Loopback0, receive
S   2001:DB8:ACAD:303::/64 [1/0]
     via 2001:DB8:ACAD:23::3
L   FF00::/8 [0/0]
     via Null0, receive
```

- **Verification criteria:** R1 displays static default route `::/0` via R2; R2 contains static routes for both branch subnets (`1::/64` and `3::/64`) and loopback interfaces (`101::/64` and `303::/64`).

---

### POS-03: PC-to-Hub Loopback Reachability
From `PC-1` command prompt:

```text
C:\> ping 2001:db8:acad:202::1

Pinging 2001:db8:acad:202::1 with 32 bytes of data:

Reply from 2001:DB8:ACAD:202::1: bytes=32 time<1ms TTL=254
Reply from 2001:DB8:ACAD:202::1: bytes=32 time<1ms TTL=254
Reply from 2001:DB8:ACAD:202::1: bytes=32 time<1ms TTL=254
Reply from 2001:DB8:ACAD:202::1: bytes=32 time<1ms TTL=254

Ping statistics for 2001:DB8:ACAD:202::1:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
```

From `PC-2` command prompt:

```text
C:\> ping 2001:db8:acad:202::1

Pinging 2001:db8:acad:202::1 with 32 bytes of data:

Reply from 2001:DB8:ACAD:202::1: bytes=32 time<1ms TTL=254
Reply from 2001:DB8:ACAD:202::1: bytes=32 time<1ms TTL=254
Reply from 2001:DB8:ACAD:202::1: bytes=32 time<1ms TTL=254
Reply from 2001:DB8:ACAD:202::1: bytes=32 time<1ms TTL=254

Ping statistics for 2001:DB8:ACAD:202::1:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
```

- **Verification criteria:** 100% reply rate (4/4 packets) from both branch workstations to the central data center management loopback.

---

### POS-04: End-to-End Inter-Branch Host Reachability
From `PC-1` command prompt:

```text
C:\> ping 2001:db8:acad:3::10

Pinging 2001:db8:acad:3::10 with 32 bytes of data:

Reply from 2001:DB8:ACAD:3::10: bytes=32 time<1ms TTL=125
Reply from 2001:DB8:ACAD:3::10: bytes=32 time<1ms TTL=125
Reply from 2001:DB8:ACAD:3::10: bytes=32 time<1ms TTL=125
Reply from 2001:DB8:ACAD:3::10: bytes=32 time<1ms TTL=125

Ping statistics for 2001:DB8:ACAD:3::10:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
Approximate round trip times in milli-seconds:
    Minimum = 0ms, Maximum = 0ms, Average = 0ms
```

- **Verification criteria:** 0% packet loss across the 3-router transit path; initial TTL is decremented from 128 to 125 reflecting exactly 3 router forwarding hops.

---

### POS-05: Path Symmetry and Multi-Hop Traceroute
From `PC-1` command prompt:

```text
C:\> tracert 2001:db8:acad:3::10

Tracing route to 2001:db8:acad:3::10 over a maximum of 30 hops: 

  1   0 ms      0 ms      0 ms      2001:DB8:ACAD:1::1
  2   0 ms      0 ms      0 ms      2001:DB8:ACAD:12::2
  3   0 ms      0 ms      0 ms      2001:DB8:ACAD:23::3
  4   0 ms      0 ms      0 ms      2001:DB8:ACAD:3::10

Trace complete.
```

- **Verification criteria:** Trace cleanly enumerates all intermediate router egress points (R1 LAN default gateway -> R2 WAN interface -> R3 WAN interface -> PC-2 destination host).

---

## 2. Negative Verification (NEG)

### NEG-01: Packet Blackholing Due to Missing Return Route
On `R2`, remove the static route pointing back to PC-1's subnet (`2001:db8:acad:1::/64`):

```cisco
R2(config)# no ipv6 route 2001:db8:acad:1::/64 2001:db8:acad:12::1
```

Attempting to ping from `PC-1` to `2001:db8:acad:202::1` results in complete timeout:

```text
C:\> ping 2001:db8:acad:202::1

Pinging 2001:db8:acad:202::1 with 32 bytes of data:

Request timed out.
Request timed out.
Request timed out.
Request timed out.

Ping statistics for 2001:DB8:ACAD:202::1:
    Packets: Sent = 4, Received = 0, Lost = 4 (100% loss),
```

- **Behavior:** The echo request successfully reaches R2, but R2 has no entry in its routing table for the source address (`2001:db8:acad:1::10`), silently dropping the ICMPv6 echo reply packet.
- **Remediation:** Restore the static route: `ipv6 route 2001:db8:acad:1::/64 2001:db8:acad:12::1`.

---

### NEG-02: Unrouted Destination Subnet Rejection
From `R1` privileged EXEC mode, ping a destination subnet that does not exist in any routing table (`2001:db8:acad:999::1`):

```cisco
R1# ping 2001:db8:acad:999::1

Type escape sequence to abort.
Sending 5, 100-byte ICMP Echos to 2001:db8:acad:999::1, timeout is 2 seconds:
U.U.U
Success rate is 0 percent (0/5)
```

- **Behavior:** `R1` forwards to `R2` via its default route. `R2` has no match and responds with ICMPv6 Destination Unreachable (`U`), confirming that non-existent destinations are promptly discarded without routing loops.

