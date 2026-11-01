# Verification Guide: PTL-0028 Floating Static Routes and Administrative Distance

This document details the complete positive and negative testing matrix for **PTL-0028**, executed and verified inside Cisco Packet Tracer 9.0.1.

---

## 1. Positive Verification (POS)

### POS-01: Point-to-Point WAN Link Reachability
On `Edge-R1` privileged EXEC mode, verify reachability across both WAN segments:

```cisco
Edge-R1# ping 10.1.1.2

Type escape sequence to abort.
Sending 5, 100-byte ICMP Echos to 10.1.1.2, timeout is 2 seconds:
.!!!!
Success rate is 80 percent (4/5), round-trip min/avg/max = 0/0/0 ms
```

```cisco
Edge-R1# ping 10.2.2.2

Type escape sequence to abort.
Sending 5, 100-byte ICMP Echos to 10.2.2.2, timeout is 2 seconds:
.!!!!
Success rate is 80 percent (4/5), round-trip min/avg/max = 0/0/0 ms
```

- **Verification criteria:** Both primary (`10.1.1.0/30`) and backup (`10.2.2.0/30`) point-to-point transit circuits respond to ICMP echo requests with active Layer 2 ARP resolution.

---

### POS-02: Normal State Routing Table & Path Verification
On `Edge-R1` privileged EXEC mode:

```cisco
Edge-R1# show ip route static
S*   0.0.0.0/0 [1/0] via 10.1.1.2
```

On `ISP-R2` privileged EXEC mode:

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

- **Verification criteria:** Only primary routes with AD 1 appear in the active routing tables; floating routes with AD 5 remain suppressed/dormant. Forwarding traverses `10.1.1.2`.

---

### POS-03: Primary Link Failure and Floating Route Failover
On `Edge-R1`, administratively disable the primary WAN link:

```cisco
Edge-R1(config)# interface GigabitEthernet0/0
Edge-R1(config-if)# shutdown
```

Inspect `show ip route static` on `Edge-R1`:

```cisco
Edge-R1# show ip route static
S*   0.0.0.0/0 [5/0] via 10.2.2.2
```

From `PC-1` command prompt, verify reachability and trace path:

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

```text
C:\> tracert 203.0.113.10

Tracing route to 203.0.113.10 over a maximum of 30 hops: 

  1   0 ms      0 ms      0 ms      192.168.10.1
  2   0 ms      0 ms      0 ms      10.2.2.2
  3   0 ms      0 ms      0 ms      203.0.113.10

Trace complete.
```

- **Verification criteria:** Floating route dynamically installs with AD 5 (`[5/0] via 10.2.2.2`). Hop 2 in traceroute diverts cleanly from `10.1.1.2` to `10.2.2.2` with zero packet loss.

---

### POS-04: Primary Link Restoration and Preemption
On `Edge-R1`, restore the primary WAN link:

```cisco
Edge-R1(config)# interface GigabitEthernet0/0
Edge-R1(config-if)# no shutdown
```

Inspect `show ip route static` on `Edge-R1`:

```cisco
Edge-R1# show ip route static
S*   0.0.0.0/0 [1/0] via 10.1.1.2
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

- **Verification criteria:** Lower administrative distance (1 < 5) causes immediate preemption of the floating route; traffic automatically returns to the high-speed primary path.

---

## 2. Negative Verification (NEG)

### NEG-01: Total WAN Outage (Both Links Down)
On `Edge-R1`, shut down both WAN interfaces (`GigabitEthernet0/0` and `GigabitEthernet0/1`):

```cisco
Edge-R1(config)# interface range GigabitEthernet0/0 - 1
Edge-R1(config-if-range)# shutdown
```

From `PC-1` command prompt, attempt to ping `Web-Server`:

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

- **Behavior:** With both next hops inaccessible, all static routes are purged from the routing table. Edge-R1 immediately returns ICMP Destination Host Unreachable to client hosts.
- **Remediation:** Restore interface connectivity (`no shutdown`).

