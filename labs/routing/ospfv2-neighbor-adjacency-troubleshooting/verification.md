# Verification Guide: PTL-0031 OSPFv2 Neighbor Adjacency Troubleshooting

This document details the complete positive and negative testing matrix for **PTL-0031**, executed and verified inside Cisco Packet Tracer 9.0.1.

---

## 1. Negative Verification: Starter Fault Baseline (NEG-01)

### Fault 1: Timer Mismatch on Link 1 (HQ-R1 <-> Branch-R2)
On `HQ-R1`, verify that no neighbor is formed across `GigabitEthernet0/0/0`:

```cisco
HQ-R1# show ip ospf neighbor
HQ-R1#
```

Inspect interface timers on both ends of Link 1:

```cisco
HQ-R1# show ip ospf interface GigabitEthernet0/0/0
  Timer intervals configured, Hello 10, Dead 40, Wait 40, Retransmit 5

Branch-R2# show ip ospf interface GigabitEthernet0/0/0
  Timer intervals configured, Hello 5, Dead 20, Wait 20, Retransmit 5
```

- **Diagnosis:** `Branch-R2` has non-default timers (`Hello 5, Dead 20`) conflicting with `HQ-R1`'s default timers (`Hello 10, Dead 40`). Because OSPF requires identical Hello and Dead intervals, the neighbor relationship is rejected.

---

### Fault 2: Area ID Mismatch on Link 2 (HQ-R1 <-> Remote-R3)
Inspect the OSPF area configured on `Remote-R3`:

```cisco
Remote-R3# show ip ospf interface GigabitEthernet0/0/0
GigabitEthernet0/0/0 is up, line protocol is up
  Internet address is 10.1.13.2/30, Area 1
```

- **Diagnosis:** `Remote-R3` interface is assigned to `Area 1`, whereas `HQ-R1` `GigabitEthernet0/0/1` is in `Area 0`. OSPF packets arriving with a mismatched Area ID are discarded.

---

### Fault 3: End-to-End Inter-Spoke Communication Failure
From `PC-Branch`, verify that communication to `Server-Remote` fails:

```text
C:\> ping 192.168.3.10

Pinging 192.168.3.10 with 32 bytes of data:

Reply from 192.168.2.1: Destination host unreachable.
Reply from 192.168.2.1: Destination host unreachable.
Reply from 192.168.2.1: Destination host unreachable.
Reply from 192.168.2.1: Destination host unreachable.

Ping statistics for 192.168.3.10:
    Packets: Sent = 4, Received = 0, Lost = 4 (100% loss)
```

- **Criteria:** All OSPF adjacencies are down and cross-subnet communication returns `Destination host unreachable`.

---

## 2. Positive Verification: Post-Remediation State (POS)

### POS-01: Direct Link Point-to-Point Ping
From `HQ-R1` privileged EXEC mode, verify direct Layer 3 reachability across both transit circuits:

```cisco
HQ-R1# ping 10.1.12.2

Type escape sequence to abort.
Sending 5, 100-byte ICMP Echos to 10.1.12.2, timeout is 2 seconds:
!!!!!
Success rate is 100 percent (5/5), round-trip min/avg/max = 0/0/0 ms

HQ-R1# ping 10.1.13.2

Type escape sequence to abort.
Sending 5, 100-byte ICMP Echos to 10.1.13.2, timeout is 2 seconds:
!!!!!
Success rate is 100 percent (5/5), round-trip min/avg/max = 0/0/0 ms
```

- **Criteria:** 100% ping success across point-to-point transit circuits.

---

### POS-02: Neighbor Adjacencies on HQ-R1
Verify that both spoke routers achieve `FULL` adjacency with `HQ-R1`:

```cisco
HQ-R1# show ip ospf neighbor

Neighbor ID     Pri   State           Dead Time   Address         Interface
3.3.3.3           1   FULL/DR         00:00:38    10.1.13.2       GigabitEthernet0/0/1
2.2.2.2           1   FULL/DR         00:00:39    10.1.12.2       GigabitEthernet0/0/0
```

On `Branch-R2`:
```cisco
Branch-R2# show ip ospf neighbor

Neighbor ID     Pri   State           Dead Time   Address         Interface
1.1.1.1           1   FULL/BDR        00:00:33    10.1.12.1       GigabitEthernet0/0/0
```

On `Remote-R3`:
```cisco
Remote-R3# show ip ospf neighbor

Neighbor ID     Pri   State           Dead Time   Address         Interface
1.1.1.1           1   FULL/BDR        00:00:36    10.1.13.1       GigabitEthernet0/0/0
```

- **Criteria:** Adjacencies on both transit links transition to `FULL`.

---

### POS-03: Interface Parameter & Timer Synchronization
Verify synchronized timers on `Branch-R2` and corrected Area on `Remote-R3`:

```cisco
Branch-R2# show ip ospf interface GigabitEthernet0/0/0
GigabitEthernet0/0/0 is up, line protocol is up
  Internet address is 10.1.12.2/30, Area 0
  Timer intervals configured, Hello 10, Dead 40, Wait 40, Retransmit 5

Remote-R3# show ip ospf interface GigabitEthernet0/0/0
GigabitEthernet0/0/0 is up, line protocol is up
  Internet address is 10.1.13.2/30, Area 0
  Timer intervals configured, Hello 10, Dead 40, Wait 40, Retransmit 5
```

- **Criteria:** Both interfaces operate in `Area 0` with `Hello 10` and `Dead 40` timers.

---

### POS-04: Complete Routing Table Convergence
Verify learned OSPF routes on each router:

**On HQ-R1:**
```cisco
HQ-R1# show ip route ospf
O    192.168.2.0 [110/2] via 10.1.12.2, 00:05:56, GigabitEthernet0/0/0
O    192.168.3.0 [110/2] via 10.1.13.2, 00:05:33, GigabitEthernet0/0/1
```

**On Branch-R2:**
```cisco
Branch-R2# show ip route ospf
     10.0.0.0/8 is variably subnetted, 3 subnets, 2 masks
O       10.1.13.0 [110/2] via 10.1.12.1, 00:05:30, GigabitEthernet0/0/0
     192.168.1.0/32 is subnetted, 1 subnets
O       192.168.1.1 [110/2] via 10.1.12.1, 00:05:59, GigabitEthernet0/0/0
O    192.168.3.0 [110/3] via 10.1.12.1, 00:05:30, GigabitEthernet0/0/0
```

**On Remote-R3:**
```cisco
Remote-R3# show ip route ospf
     10.0.0.0/8 is variably subnetted, 3 subnets, 2 masks
O       10.1.12.0 [110/2] via 10.1.13.1, 00:05:35, GigabitEthernet0/0/0
     192.168.1.0/32 is subnetted, 1 subnets
O       192.168.1.1 [110/2] via 10.1.13.1, 00:05:35, GigabitEthernet0/0/0
O    192.168.2.0 [110/3] via 10.1.13.1, 00:05:35, GigabitEthernet0/0/0
```

- **Criteria:** All routes installed with correct metrics and next-hop gateways.

---

### POS-05: End-to-End Inter-Spoke Host Reachability
From `PC-Branch` (`192.168.2.10`), verify end-to-end communication to `Server-Remote` (`192.168.3.10`):

```text
C:\> ping 192.168.3.10

Pinging 192.168.3.10 with 32 bytes of data:

Reply from 192.168.3.10: bytes=32 time<1ms TTL=125
Reply from 192.168.3.10: bytes=32 time<1ms TTL=125
Reply from 192.168.3.10: bytes=32 time<1ms TTL=125
Reply from 192.168.3.10: bytes=32 time<1ms TTL=125

Ping statistics for 192.168.3.10:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)
```

```text
C:\> tracert 192.168.3.10

Tracing route to 192.168.3.10 over a maximum of 30 hops: 

  1   0 ms      0 ms      0 ms      192.168.2.1
  2   0 ms      0 ms      0 ms      10.1.12.1
  3   0 ms      0 ms      0 ms      10.1.13.2
  4   0 ms      0 ms      0 ms      192.168.3.10

Trace complete.
```

- **Criteria:** 0% packet loss and verified 4-hop routing path.

---

## 3. Negative Verification: Circuit Failover & Recovery (NEG-02)

When `Branch-R2`'s transit link `GigabitEthernet0/0/0` is administratively shut down (`shutdown`):
```cisco
HQ-R1# show ip ospf neighbor

Neighbor ID     Pri   State           Dead Time   Address         Interface
3.3.3.3           1   FULL/DR         00:00:32    10.1.13.2       GigabitEthernet0/0/1
```
- **Observation:** `Branch-R2` neighbor drops; `Remote-R3` neighbor remains unaffected.

When `GigabitEthernet0/0/0` is re-enabled (`no shutdown`):
```cisco
HQ-R1# show ip ospf neighbor

Neighbor ID     Pri   State           Dead Time   Address         Interface
3.3.3.3           1   FULL/DR         00:00:38    10.1.13.2       GigabitEthernet0/0/1
2.2.2.2           1   FULL/DR         00:00:33    10.1.12.2       GigabitEthernet0/0/0
```
- **Observation:** Adjacency restores automatically to `FULL`.

