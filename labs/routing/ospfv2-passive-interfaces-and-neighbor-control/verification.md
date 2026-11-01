# Verification Guide: PTL-0030 OSPFv2 Passive Interfaces and Neighbor Control

This document details the complete positive and negative testing matrix for **PTL-0030**, executed and verified inside Cisco Packet Tracer 9.0.1.

---

## 1. Positive Verification (POS)

### POS-01: Transit Link & Local Gateway Ping Reachability
From `Edge-R1`, verify direct ICMP echo reachability across the point-to-point transit link to `Core-R2`:

```cisco
Edge-R1# ping 10.0.0.2

Type escape sequence to abort.
Sending 5, 100-byte ICMP Echos to 10.0.0.2, timeout is 2 seconds:
!!!!!
Success rate is 100 percent (5/5), round-trip min/avg/max = 0/0/0 ms
```

From `PC-1` and `Server-1`, verify local default gateway reachability:

```text
C:\> ping 192.168.10.1
Pinging 192.168.10.1 with 32 bytes of data:
Reply from 192.168.10.1: bytes=32 time<1ms TTL=255
Reply from 192.168.10.1: bytes=32 time<1ms TTL=255

C:\> ping 192.168.20.1
Pinging 192.168.20.1 with 32 bytes of data:
Reply from 192.168.20.1: bytes=32 time<1ms TTL=255
Reply from 192.168.20.1: bytes=32 time<1ms TTL=255
```

- **Criteria:** Transit WAN circuit and local LAN gateways respond with 100% success rate.

---

### POS-02: Neighbor Adjacency Inspection Across Transit Link
Verify that the inter-router OSPF neighbor relationship across `GigabitEthernet0/0/1` is established and in `FULL` state:

**On Edge-R1:**
```cisco
Edge-R1# show ip ospf neighbor

Neighbor ID     Pri   State           Dead Time   Address         Interface
2.2.2.2           1   FULL/BDR        00:00:38    10.0.0.2        GigabitEthernet0/0/1
```

**On Core-R2:**
```cisco
Core-R2# show ip ospf neighbor

Neighbor ID     Pri   State           Dead Time   Address         Interface
1.1.1.1           1   FULL/DR         00:00:37    10.0.0.1        GigabitEthernet0/0/1
```

- **Criteria:** Neighbor table confirms `FULL/BDR` and `FULL/DR` states across `10.0.0.0/30`. Access LAN interfaces (`GigabitEthernet0/0/0`) have zero neighbors.

---

### POS-03: Passive Interface Verification on Access Ports
Inspect OSPF interface details on the edge LAN ports (`GigabitEthernet0/0/0`) on both routers:

**On Edge-R1:**
```cisco
Edge-R1# show ip ospf interface GigabitEthernet0/0/0

GigabitEthernet0/0/0 is up, line protocol is up
  Internet address is 192.168.10.1/24, Area 0
  Process ID 1, Router ID 1.1.1.1, Network Type BROADCAST, Cost: 1
  Transmit Delay is 1 sec, State DR, Priority 1
  Designated Router (ID) 1.1.1.1, Interface address 192.168.10.1
  No backup designated router on this network
  Timer intervals configured, Hello 10, Dead 40, Wait 40, Retransmit 5
    No Hellos (Passive interface)
```

**On Core-R2:**
```cisco
Core-R2# show ip ospf interface GigabitEthernet0/0/0

GigabitEthernet0/0/0 is up, line protocol is up
  Internet address is 192.168.20.1/24, Area 0
  Process ID 1, Router ID 2.2.2.2, Network Type BROADCAST, Cost: 1
  Transmit Delay is 1 sec, State DR, Priority 1
  Designated Router (ID) 2.2.2.2, Interface address 192.168.20.1
  No backup designated router on this network
  Timer intervals configured, Hello 10, Dead 40, Wait 40, Retransmit 5
    No Hellos (Passive interface)
```

- **Criteria:** Both routers explicitly report `No Hellos (Passive interface)` for `GigabitEthernet0/0/0`.

---

### POS-04: Active Transit Link Interface Inspection
Inspect `GigabitEthernet0/0/1` to verify active Hello packet transmission and timer intervals:

**On Edge-R1:**
```cisco
Edge-R1# show ip ospf interface GigabitEthernet0/0/1

GigabitEthernet0/0/1 is up, line protocol is up
  Internet address is 10.0.0.1/30, Area 0
  Process ID 1, Router ID 1.1.1.1, Network Type BROADCAST, Cost: 1
  Transmit Delay is 1 sec, State DR, Priority 1
  Designated Router (ID) 1.1.1.1, Interface address 10.0.0.1
  Backup Designated Router (ID) 2.2.2.2, Interface address 10.0.0.2
  Timer intervals configured, Hello 10, Dead 40, Wait 40, Retransmit 5
    Hello due in 00:00:08
  Neighbor Count is 1, Adjacent neighbor count is 1
    Adjacent with neighbor 2.2.2.2  (Backup Designated Router)
  Suppress hello for 0 neighbor(s)
```

- **Criteria:** Active timer intervals (`Hello 10, Dead 40`) and `Suppress hello for 0 neighbor(s)`.

---

### POS-05: Continued Route Propagation for Passive Networks
Verify that passive LAN subnets continue to be advertised in the Link-State Database and installed into routing tables:

**On Edge-R1:**
```cisco
Edge-R1# show ip route ospf
O    192.168.20.0 [110/2] via 10.0.0.2, 00:08:35, GigabitEthernet0/0/1
```

**On Core-R2:**
```cisco
Core-R2# show ip route ospf
O    192.168.10.0 [110/2] via 10.0.0.1, 00:04:34, GigabitEthernet0/0/1
```

- **Criteria:** Both routers have valid OSPF routes (`O`) to the opposing passive LAN subnets with metric 2 via `GigabitEthernet0/0/1`.

---

### POS-06: End-to-End Host Reachability
From `PC-1` (`192.168.10.10`), verify ping and traceroute reachability to `Server-1` (`192.168.20.10`):

```text
C:\> ping 192.168.20.10

Pinging 192.168.20.10 with 32 bytes of data:

Reply from 192.168.20.10: bytes=32 time<1ms TTL=126
Reply from 192.168.20.10: bytes=32 time<1ms TTL=126
Reply from 192.168.20.10: bytes=32 time<1ms TTL=126
Reply from 192.168.20.10: bytes=32 time<1ms TTL=126

Ping statistics for 192.168.20.10:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)
```

```text
C:\> tracert 192.168.20.10

Tracing route to 192.168.20.10 over a maximum of 30 hops: 

  1   0 ms      1 ms      0 ms      192.168.10.1
  2   0 ms      0 ms      0 ms      10.0.0.2
  3   0 ms      0 ms      0 ms      192.168.20.10

Trace complete.
```

- **Criteria:** 0% packet loss and clean 3-hop forwarding path (`192.168.10.1` -> `10.0.0.2` -> `192.168.20.10`).

---

## 2. Negative Verification (NEG)

### NEG-01: Inadvertent Passive Configuration on Transit Link
When the transit interface `GigabitEthernet0/0/1` is mistakenly configured as passive (`passive-interface GigabitEthernet0/0/1`), Hello packet exchanges cease across the link. Once the 40-second Dead timer expires, the neighbor adjacency is torn down and all routes learned through `Core-R2` are withdrawn from `Edge-R1`'s routing table:

```cisco
Edge-R1# show ip ospf neighbor
Edge-R1#

Edge-R1# show ip route ospf
Edge-R1#
```

- **Criteria:** Neighbor table and OSPF routing table become empty on `Edge-R1`.

---

### NEG-02: Restoring Active State on Transit Link
When passive status is removed from the transit link (`no passive-interface GigabitEthernet0/0/1`), Hello packets resume immediately. Routers progress through `INIT`, `2-WAY`, `EXSTART`, `EXCHANGE`, `LOADING`, and return to `FULL`:

```text
00:46:31: %OSPF-5-ADJCHG: Process 1, Nbr 2.2.2.2 on GigabitEthernet0/0/1 from LOADING to FULL, Loading Done
```

Verify that the remote route is re-installed into `Edge-R1`'s routing table:

```cisco
Edge-R1# show ip route ospf
O    192.168.20.0 [110/2] via 10.0.0.2, 00:03:57, GigabitEthernet0/0/1
```

- **Criteria:** Adjacency state restores to `FULL` and routes are restored automatically.

