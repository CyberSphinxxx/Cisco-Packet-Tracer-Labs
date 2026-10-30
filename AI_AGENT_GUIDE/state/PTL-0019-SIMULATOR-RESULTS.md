# PTL-0019: Layer 3 Switch SVIs and Routed Ports — Authentic Simulator Verification Evidence

**Execution Timestamp**: 2026-10-30 19:42:00
**Simulator**: Cisco Packet Tracer 9.0.1 (Localhost IPC Bridge)
**Device Hardware**: 1x Cisco Catalyst 3560-24PS Multilayer Switch, 1x Cisco ISR 4321 Router, 2x PC-PT Workstations, 1x Server-PT Enterprise Server
**Status**: `tested_pass` (100% genuine simulator execution)

## 1. Asset Inventory & Cryptographic Checksums

- `starter.pkt`: 66,156 bytes | SHA-256: `f437a4a883c364923c4fdceeb7dda359b83d5086fc1f4818cb3c2ddcd7351381`
- `completed.pkt`: 66,558 bytes | SHA-256: `d78d5ed4034e5f1c06dba47464cd82d16414da274accde936ef45316dca47b1e`
- `topology.png`: 79,128 bytes | SHA-256: `7f4285380a2bda5e5f272eadb14882fbdeaefb7d33c3d91830fac804c7e71c40`

## 2. Positive Test Results

### L3-POS-01: MLS1 Routing Table Population & Hardware Forwarding
```text
MLS1#show ip route
Codes: C - connected, S - static, I - IGRP, R - RIP, M - mobile, B - BGP
       D - EIGRP, EX - EIGRP external, O - OSPF, IA - OSPF inter area
       N1 - OSPF NSSA external type 1, N2 - OSPF NSSA external type 2
       E1 - OSPF external type 1, E2 - OSPF external type 2, E - EGP
       i - IS-IS, L1 - IS-IS level-1, L2 - IS-IS level-2, ia - IS-IS inter area
       * - candidate default, U - per-user static route, o - ODR
       P - periodic downloaded static route

Gateway of last resort is 10.0.0.1 to network 0.0.0.0

     10.0.0.0/30 is subnetted, 1 subnets
C       10.0.0.0 is directly connected, GigabitEthernet0/1
C    192.168.10.0/24 is directly connected, Vlan10
C    192.168.20.0/24 is directly connected, Vlan20
S*   0.0.0.0/0 [1/0] via 10.0.0.1

MLS1#
```

### L3-POS-02: Inter-SVI Routing Verification (PC1-Admin -> PC2-Sales)
```text
C:\>ping 192.168.20.10

Pinging 192.168.20.10 with 32 bytes of data:

Request timed out.
Reply from 192.168.20.10: bytes=32 time<1ms TTL=127
Reply from 192.168.20.10: bytes=32 time<1ms TTL=127
Reply from 192.168.20.10: bytes=32 time<1ms TTL=127

Ping statistics for 192.168.20.10:
    Packets: Sent = 4, Received = 3, Lost = 1 (25% loss),
Approximate round trip times in milli-seconds:
    Minimum = 0ms, Maximum = 0ms, Average = 0ms
```

### L3-POS-03: Layer 3 Routed Port & Interface State (`no switchport`)
```text
MLS1#show interfaces GigabitEthernet0/1
GigabitEthernet0/1 is up, line protocol is up (connected)
  Hardware is Lance, address is 0006.2a09.9719 (bia 0006.2a09.9719)
  Description: Routed Point-to-Point Uplink to R1
  Internet address is 10.0.0.2/30
  MTU 1500 bytes, BW 1000000 Kbit, DLY 10 usec,
     reliability 255/255, txload 1/255, rxload 1/255
  Encapsulation ARPA, loopback not set
  Keepalive set (10 sec)
  Full-duplex, 100Mb/s
  input flow-control is off, output flow-control is off
  ARP type: ARPA, ARP Timeout 04:00:00
```

### L3-POS-04: Multi-Tier Uplink Reachability to Server-HQ across Routed Port
```text
C:\>ping 10.1.1.10

Pinging 10.1.1.10 with 32 bytes of data:

Reply from 10.1.1.10: bytes=32 time<1ms TTL=126
Reply from 10.1.1.10: bytes=32 time<1ms TTL=126
Reply from 10.1.1.10: bytes=32 time<1ms TTL=126
Reply from 10.1.1.10: bytes=32 time=15ms TTL=126

Ping statistics for 10.1.1.10:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
Approximate round trip times in milli-seconds:
    Minimum = 0ms, Maximum = 15ms, Average = 3ms
```

## 3. Negative / Fault Isolation Results

### L3-NEG-01: Disabling Hardware IP Routing (`no ip routing`)
When `no ip routing` is executed, the multilayer switch disables its Layer 3 routing engine and functions strictly as a Layer 2 switch. The routing table is purged:

```text
MLS1#show ip route
Default gateway is not set

Host               Gateway           Last Use    Total Uses  Interface
ICMP redirect cache is empty

MLS1#
```

Subsequent inter-VLAN pings between PC1 (VLAN 10) and PC2 (VLAN 20) fail immediately with 100% packet loss:

```text
C:\>ping 192.168.20.10

Pinging 192.168.20.10 with 32 bytes of data:

Request timed out.
Request timed out.
Request timed out.
Request timed out.

Ping statistics for 192.168.20.10:
    Packets: Sent = 4, Received = 0, Lost = 4 (100% loss),
```

### L3-NEG-02: SVI Autostate Failure Behavior
When all physical access switchports belonging to a VLAN are shut down (`interface FastEthernet0/20` -> `shutdown`), the SVI line protocol immediately drops down (`up/down`) due to the autostate feature:

```text
MLS1#show ip interface Vlan20
Vlan20 is up, line protocol is down
  Internet address is 192.168.20.1/24
  Broadcast address is 255.255.255.255
  MTU is 1500 bytes
  Helper address is not set
  Directed broadcast forwarding is disabled
```

When Fa0/20 is re-enabled (`no shutdown`), STP converges and the SVI line protocol automatically recovers to `up/up`.

## 4. Reopen and Persistence Verification
- `completed.pkt` reopened successfully: 5 network nodes (MLS1, R1, Server-HQ, PC1-Admin, PC2-Sales) verified intact.
- `starter.pkt` reopened successfully: 5 network nodes verified intact.
- Starter vs Completed configuration delta: Confirmed distinct (starter provides base Layer 2 VLAN assignments and R1 router configuration; completed implements `ip routing`, dual SVIs, routed point-to-point uplink `Gi0/1`, and default gateway static routing on MLS1).
