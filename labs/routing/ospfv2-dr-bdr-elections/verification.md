# Verification Guide: PTL-0029 OSPFv2 DR and BDR Elections

This document details the complete positive and negative testing matrix for **PTL-0029**, executed and verified inside Cisco Packet Tracer 9.0.1.

---

## 1. Positive Verification (POS)

### POS-01: Multi-Access Subnet IP Reachability
From `R1` privileged EXEC mode, verify direct ICMP echo reachability to all other devices sharing the `192.168.1.0/24` multi-access broadcast segment:

```cisco
R1# ping 192.168.1.2

Type escape sequence to abort.
Sending 5, 100-byte ICMP Echos to 192.168.1.2, timeout is 2 seconds:
!!!!!
Success rate is 100 percent (5/5), round-trip min/avg/max = 0/0/0 ms
```

```cisco
R1# ping 192.168.1.3

Type escape sequence to abort.
Sending 5, 100-byte ICMP Echos to 192.168.1.3, timeout is 2 seconds:
!!!!!
Success rate is 100 percent (5/5), round-trip min/avg/max = 0/0/0 ms
```

```cisco
R1# ping 192.168.1.50

Type escape sequence to abort.
Sending 5, 100-byte ICMP Echos to 192.168.1.50, timeout is 2 seconds:
.!!!!
Success rate is 80 percent (4/5), round-trip min/avg/max = 0/0/0 ms
```

- **Criteria:** All endpoints on `192.168.1.0/24` respond with 100% (or 80% on initial ARP) success.

---

### POS-02: Multi-Access OSPF Neighbor Adjacency Inspection
Verify the neighbor relationship tables on each router:

**On R1:**
```cisco
R1# show ip ospf neighbor

Neighbor ID     Pri   State           Dead Time   Address         Interface
3.3.3.3           0   FULL/DROTHER    00:00:36    192.168.1.3     GigabitEthernet0/0/0
2.2.2.2         100   FULL/BDR        00:00:30    192.168.1.2     GigabitEthernet0/0/0
```

**On R2:**
```cisco
R2# show ip ospf neighbor

Neighbor ID     Pri   State           Dead Time   Address         Interface
3.3.3.3           0   FULL/DROTHER    00:00:33    192.168.1.3     GigabitEthernet0/0/0
1.1.1.1         255   FULL/DR         00:00:31    192.168.1.1     GigabitEthernet0/0/0
```

**On R3:**
```cisco
R3# show ip ospf neighbor

Neighbor ID     Pri   State           Dead Time   Address         Interface
2.2.2.2         100   FULL/BDR        00:00:34    192.168.1.2     GigabitEthernet0/0/0
1.1.1.1         255   FULL/DR         00:00:38    192.168.1.1     GigabitEthernet0/0/0
```

- **Criteria:** R1 sees R2 as `FULL/BDR` and R3 as `FULL/DROTHER`. R2 sees R1 as `FULL/DR` and R3 as `FULL/DROTHER`. R3 sees R1 as `FULL/DR` and R2 as `FULL/BDR`.

---

### POS-03: Detailed OSPF Interface Role and Priority Validation
Inspect interface-level OSPF state on `GigabitEthernet0/0/0` across each router:

**On R1 (DR):**
```cisco
R1# show ip ospf interface GigabitEthernet0/0/0

GigabitEthernet0/0/0 is up, line protocol is up
  Internet address is 192.168.1.1/24, Area 0
  Process ID 1, Router ID 1.1.1.1, Network Type BROADCAST, Cost: 1
  Transmit Delay is 1 sec, State DR, Priority 255
  Designated Router (ID) 1.1.1.1, Interface address 192.168.1.1
  Backup Designated Router (ID) 2.2.2.2, Interface address 192.168.1.2
  Timer intervals configured, Hello 10, Dead 40, Wait 40, Retransmit 5
```

**On R2 (BDR):**
```cisco
R2# show ip ospf interface GigabitEthernet0/0/0

GigabitEthernet0/0/0 is up, line protocol is up
  Internet address is 192.168.1.2/24, Area 0
  Process ID 1, Router ID 2.2.2.2, Network Type BROADCAST, Cost: 1
  Transmit Delay is 1 sec, State BDR, Priority 100
  Designated Router (ID) 1.1.1.1, Interface address 192.168.1.1
  Backup Designated Router (ID) 2.2.2.2, Interface address 192.168.1.2
  Timer intervals configured, Hello 10, Dead 40, Wait 40, Retransmit 5
```

**On R3 (DROTHER):**
```cisco
R3# show ip ospf interface GigabitEthernet0/0/0

GigabitEthernet0/0/0 is up, line protocol is up
  Internet address is 192.168.1.3/24, Area 0
  Process ID 1, Router ID 3.3.3.3, Network Type BROADCAST, Cost: 1
  Transmit Delay is 1 sec, State DROTHER, Priority 0
  Designated Router (ID) 1.1.1.1, Interface address 192.168.1.1
  Backup Designated Router (ID) 2.2.2.2, Interface address 192.168.1.2
  Timer intervals configured, Hello 10, Dead 40, Wait 40, Retransmit 5
```

- **Criteria:** State matches `DR` for R1 (Priority 255), `BDR` for R2 (Priority 100), and `DROTHER` for R3 (Priority 0).

---

### POS-04: OSPF Route Installation and Data Plane Reachability
Verify that loopback networks are learned via OSPF on `R3`:

```cisco
R3# show ip route ospf
     10.0.0.0/8 is variably subnetted, 4 subnets, 2 masks
O       10.1.1.1 [110/2] via 192.168.1.1, 00:05:12, GigabitEthernet0/0/0
O       10.2.2.1 [110/2] via 192.168.1.2, 00:05:12, GigabitEthernet0/0/0
```

Verify end-to-end ping reachability from `PC-1`:

```text
C:\> ping 10.1.1.1
Reply from 10.1.1.1: bytes=32 time=16ms TTL=255
Reply from 10.1.1.1: bytes=32 time<1ms TTL=255

C:\> ping 10.2.2.1
Reply from 10.2.2.1: bytes=32 time=1ms TTL=255

C:\> ping 10.3.3.1
Reply from 10.3.3.1: bytes=32 time=1ms TTL=255
```

- **Criteria:** All advertised subnets (`10.1.1.1`, `10.2.2.1`, `10.3.3.1`) are present in routing tables and reachable via ICMP echo.

---

## 2. Negative Verification (NEG)

### NEG-01: DR Failover and DROTHER Exclusion
When R1's multi-access interface is administratively disabled (`shutdown`), R2 promotes from BDR to DR. Because R3 has priority 0, it must remain `DROTHER` and **never** be promoted to BDR:

**On R2:**
```cisco
R2# show ip ospf interface GigabitEthernet0/0/0
GigabitEthernet0/0/0 is up, line protocol is up
  Internet address is 192.168.1.2/24, Area 0
  Process ID 1, Router ID 2.2.2.2, Network Type BROADCAST, Cost: 1
  Transmit Delay is 1 sec, State DR, Priority 100
  Designated Router (ID) 2.2.2.2, Interface address 192.168.1.2
  No backup designated router on this network
```

**On R3:**
```cisco
R3# show ip ospf interface GigabitEthernet0/0/0
GigabitEthernet0/0/0 is up, line protocol is up
  Internet address is 192.168.1.3/24, Area 0
  Process ID 1, Router ID 3.3.3.3, Network Type BROADCAST, Cost: 1
  Transmit Delay is 1 sec, State DROTHER, Priority 0
  Designated Router (ID) 2.2.2.2, Interface address 192.168.1.2
  No backup designated router on this network
```

- **Criteria:** R2 is promoted to DR. R3 remains DROTHER. The segment indicates `No backup designated router on this network` because no eligible routers remain.

---

### NEG-02: Non-Preemptive OSPF Election Behavior
When R1's interface is restored (`no shutdown`), OSPF does not preempt the active DR (`R2`). R1 assumes the open BDR role rather than usurping the DR role, despite its higher priority (255 vs 100). Only upon a manual process reset (`clear ip ospf process`) does R1 resume the DR role:

```cisco
R1# show ip ospf interface GigabitEthernet0/0/0
GigabitEthernet0/0/0 is up, line protocol is up
  Internet address is 192.168.1.1/24, Area 0
  Process ID 1, Router ID 1.1.1.1, Network Type BROADCAST, Cost: 1
  Transmit Delay is 1 sec, State DR, Priority 255
  Designated Router (ID) 1.1.1.1, Interface address 192.168.1.1
  Backup Designated Router (ID) 2.2.2.2, Interface address 192.168.1.2
```

- **Criteria:** Non-preemption ensures network stability until an intentional topology change or process reset occurs.

