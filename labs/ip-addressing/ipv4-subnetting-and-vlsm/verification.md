# Verification and Diagnostic Guide: PTL-0015

**Lab ID:** `PTL-0015`  
**Lab Title:** IPv4 Subnetting and VLSM Network Design  
**Category:** `ip-addressing`  
**Simulator Verification:** `tested_pass`  

This document details the test procedures, expected outputs, and diagnostic steps required to verify the complete operation of a Variable Length Subnet Masking (VLSM) topology and validate subnet boundaries, point-to-point WAN routing, and IOS error handling.

---

## 1. Physical and Logical Topology Verification

Confirm that all interfaces are active (green link indicators) and correctly assigned:

| Device | Interface | Expected IP | Expected Subnet Mask | Connected To |
|---|---|---|---|---|
| **R1** | `GigabitEthernet0/0/0` | `192.168.1.1` | `255.255.255.192` (`/26`) | Switch S1 Gi0/1 |
| **R1** | `GigabitEthernet0/0/1` | `192.168.1.97` | `255.255.255.252` (`/30`) | Router R2 Gi0/0/1 (WAN) |
| **R2** | `GigabitEthernet0/0/1` | `192.168.1.98` | `255.255.255.252` (`/30`) | Router R1 Gi0/0/1 (WAN) |
| **R2** | `GigabitEthernet0/0/0` | `192.168.1.113` | `255.255.255.240` (`/28`) | Switch S2 Gi0/1 |
| **S1** | `Vlan1` | `192.168.1.2` | `255.255.255.192` (`/26`) | Staff Management SVI |
| **S2** | `Vlan1` | `192.168.1.114` | `255.255.255.240` (`/28`) | Branch Management SVI |
| **PC-Staff** | `FastEthernet0` | `192.168.1.10` | `255.255.255.192` (`/26`) | Switch S1 Fa0/1 |
| **PC-Branch** | `FastEthernet0` | `192.168.1.120` | `255.255.255.240` (`/28`) | Switch S2 Fa0/1 |

---

## 2. Command-by-Command Verification Matrix

### Test 1: Interface IP Address and Status Check
On `R1`:
```text
R1# show ip interface brief
Interface              IP-Address      OK? Method Status                Protocol 
GigabitEthernet0/0/0   192.168.1.1     YES manual up                    up 
GigabitEthernet0/0/1   192.168.1.97    YES manual up                    up
```

On `R2`:
```text
R2# show ip interface brief
Interface              IP-Address      OK? Method Status                Protocol 
GigabitEthernet0/0/0   192.168.1.113   YES manual up                    up 
GigabitEthernet0/0/1   192.168.1.98    YES manual up                    up
```

### Test 2: VLSM Routing Table Verification
Verify the routing table on `R1`:
```text
R1# show ip route
Gateway of last resort is not set

     192.168.1.0/24 is variably subnetted, 5 subnets, 4 masks
C       192.168.1.0/26 is directly connected, GigabitEthernet0/0/0
L       192.168.1.1/32 is directly connected, GigabitEthernet0/0/0
C       192.168.1.96/30 is directly connected, GigabitEthernet0/0/1
L       192.168.1.97/32 is directly connected, GigabitEthernet0/0/1
S       192.168.1.112/28 [1/0] via 192.168.1.98
```
- **Success Criteria:** Note the 4 masks (`/26`, `/30`, `/32`, `/28`) derived from parent network `192.168.1.0/24`.

Verify the routing table on `R2`:
```text
R2# show ip route
Gateway of last resort is not set

     192.168.1.0/24 is variably subnetted, 5 subnets, 4 masks
S       192.168.1.0/26 [1/0] via 192.168.1.97
C       192.168.1.96/30 is directly connected, GigabitEthernet0/0/1
L       192.168.1.98/32 is directly connected, GigabitEthernet0/0/1
C       192.168.1.112/28 is directly connected, GigabitEthernet0/0/0
L       192.168.1.113/32 is directly connected, GigabitEthernet0/0/0
```

### Test 3: Point-to-Point WAN Transit Ping
From `R1`, ping `R2`:
```text
R1# ping 192.168.1.98
Sending 5, 100-byte ICMP Echos to 192.168.1.98, timeout is 2 seconds:
!!!!!
Success rate is 100 percent (5/5), round-trip min/avg/max = 0/0/0 ms
```

### Test 4: End-to-End Routed Inter-Subnet Host Ping
From `PC-Staff`, ping `PC-Branch`:
```text
C:\>ping 192.168.1.120
Reply from 192.168.1.120: bytes=32 time<1ms TTL=126
```
- **Success Criteria:** 0% loss.
- **Diagnostic Note:** TTL=126 confirms that the packet crossed two routers (`R1` and `R2`).

---

## 3. Cisco IOS Subnet Protection Verification

### Test 5: Broadcast Address Assignment Rejection
Attempt to assign the broadcast address `192.168.1.63/26` to an interface:
```text
R1(config)# interface Loopback99
R1(config-if)# ip address 192.168.1.63 255.255.255.192
Bad mask /26 for address 192.168.1.63
```
- **Analysis:** Cisco IOS calculates that host bits are all 1s (`192.168.1.00111111`) and immediately rejects the assignment.

### Test 6: Overlapping Subnet Rejection
Attempt to configure an overlapping subnet (`192.168.1.33/25` overlaps with existing `192.168.1.0/26`):
```text
R1(config-if)# ip address 192.168.1.33 255.255.255.128
% 192.168.1.0 overlaps with GigabitEthernet0/0/0
```
- **Analysis:** Cisco IOS actively parses existing routing boundaries on all interfaces and prevents illegal route overlapping.

---

## 4. Deliverable File Verification

Ensure all assets exist within the repository:
- `assets/starter.pkt`: WAN configured, LAN unconfigured.
- `assets/completed.pkt`: Full VLSM configuration with passing end-to-end ping.
- `assets/topology.png`: Network topology diagram.
- `configs/R1.txt`: Router R1 interface and static route configuration.
- `configs/R2.txt`: Router R2 interface and static route configuration.
- `configs/S1.txt`: Switch S1 management configuration.
- `configs/S2.txt`: Switch S2 management configuration.
