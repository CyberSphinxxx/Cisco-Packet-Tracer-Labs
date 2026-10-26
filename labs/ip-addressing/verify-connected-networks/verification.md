# Verification & Troubleshooting Assembly Guide: PTL-0005

**Lab ID:** `PTL-0005`  
**Lab Title:** Verifying Directly Connected Networks  
**Category:** `ip-addressing`  
**Difficulty:** Beginner  

---

## 1. Physical & Packet Tracer Assembly Manifest

### Device Hardware & Module Schedule
| Device Role | Device Label | Packet Tracer Model | Module Slots | Software / IOS Version |
|---|---|---|---|---|
| Routing Gateway | **R1** | Cisco ISR 4321 | 2x GigabitEthernet onboard (Gi0/0/0, Gi0/0/1) | Cisco IOS XE 16.6.4 / IOS 15.x |
| Accounting Switch | **S1** | Cisco Catalyst 2960-24TT | 24x 10/100 FastEthernet, 2x Gigabit | Cisco IOS 15.0(2)SE4 (LAN Base) |
| Engineering Switch | **S2** | Cisco Catalyst 2960-24TT | 24x 10/100 FastEthernet, 2x Gigabit | Cisco IOS 15.0(2)SE4 (LAN Base) |
| Accounting Host | **PC-A** | PC-PT | 1x FastEthernet | Generic Host OS |
| Engineering Host | **PC-B** | PC-PT | 1x FastEthernet | Generic Host OS |

### Port-to-Port Cabling Matrix
| Origin Device | Origin Port | Destination Device | Destination Port | Cable Type | Cable Color |
|---|---|---|---|---|---|
| **R1** | `GigabitEthernet0/0/0` | **Switch S1** | `GigabitEthernet0/2` | Copper Straight-Through | Solid black |
| **R1** | `GigabitEthernet0/0/1` | **Switch S2** | `GigabitEthernet0/2` | Copper Straight-Through | Solid black |
| **Switch S1** | `GigabitEthernet0/1` | **PC-A** | `FastEthernet0` | Copper Straight-Through | Solid black |
| **Switch S2** | `GigabitEthernet0/1` | **PC-B** | `FastEthernet0` | Copper Straight-Through | Solid black |

---

## 2. Intentional Starter State & Troubleshooting Fault Scenarios

This lab includes intentional preconfigured fault scenarios in the starter topology to teach systematic Layer 3 troubleshooting:

### Injected Fault Matrix (Starter Topology)
| Fault ID | Component | Injected Misconfiguration | Observed Symptom | Diagnostic Command | Remediation Command |
|---|---|---|---|---|---|
| **FLT-01** | `R1 Gi0/0/0` | Configured with `/25` (`255.255.255.128`) instead of `/24` (`255.255.255.0`) | `PC-A` (`.10`) can ping R1, but routing table installs `192.168.10.0/25`; hosts above `.127` unreachable | `show ip interface brief`, `show ip route` | `interface Gi0/0/0` -> `ip address 192.168.10.1 255.255.255.0` |
| **FLT-02** | `R1 Gi0/0/1` | Interface left in administrative shutdown | Red link light; interface status shows `administratively down`; LAN 2 routes missing from routing table | `show ip interface brief` | `interface Gi0/0/1` -> `no shutdown` |
| **FLT-03** | `PC-B` | Default Gateway misconfigured as `192.168.10.1` (wrong subnet) | `PC-B` cannot communicate outside its local subnet | `ipconfig` on `PC-B` | Set Default Gateway to `192.168.20.1` |

The fully resolved instructor solution is provided in:
- [`configs/R1.txt`](configs/R1.txt)
- [`configs/S1.txt`](configs/S1.txt)
- [`configs/S2.txt`](configs/S2.txt)

---

## 3. Positive Verification Tests

### Test POS-01: Routing Table Inspection of Connected (`C`) and Local (`L`) Routes
- **Action:** At `R1#`, issue `show ip route`.
- **Expected Terminal Output:**
  ```text
  R1# show ip route
  Codes: L - local, C - connected, S - static, R - RIP, M - mobile, B - BGP
  ...
  Gateway of last resort is not set

        192.168.10.0/24 is variably subnetted, 2 subnets, 2 masks
  C        192.168.10.0/24 is directly connected, GigabitEthernet0/0/0
  L        192.168.10.1/32 is directly connected, GigabitEthernet0/0/0
        192.168.20.0/24 is variably subnetted, 2 subnets, 2 masks
  C        192.168.20.0/24 is directly connected, GigabitEthernet0/0/1
  L        192.168.20.1/32 is directly connected, GigabitEthernet0/0/1
  ```
- **Criterion:**
  - `C` (Connected) routes identify the network address with `/24` subnet mask.
  - `L` (Local) routes identify the router's interface IP address with `/32` host mask.

### Test POS-02: IPv6 Routing Table Inspection
- **Action:** At `R1#`, issue `show ipv6 route`.
- **Expected Terminal Output:**
  ```text
  R1# show ipv6 route
  IPv6 Routing Table - default - 5 entries
  ...
  C   2001:DB8:ACAD:10::/64 [0/0]
       via GigabitEthernet0/0/0, directly connected
  L   2001:DB8:ACAD:10::1/128 [0/0]
       via GigabitEthernet0/0/0, receive
  C   2001:DB8:ACAD:20::/64 [0/0]
       via GigabitEthernet0/0/1, directly connected
  L   2001:DB8:ACAD:20::1/128 [0/0]
       via GigabitEthernet0/0/1, receive
  L   FF00::/8 [0/0]
       via Null0, receive
  ```
- **Criterion:** Connected networks show `/64` and local interface host routes show `/128`.

### Test POS-03: End-to-End Inter-LAN Reachability (Post-Remediation)
- **Action:** From `PC-A` Command Prompt, ping `PC-B` (`192.168.20.10`).
- **Expected Terminal Output:**
  ```text
  C:\> ping 192.168.20.10
  Pinging 192.168.20.10 with 32 bytes of data:
  Reply from 192.168.20.10: bytes=32 time<1ms TTL=127
  Reply from 192.168.20.10: bytes=32 time<1ms TTL=127
  Reply from 192.168.20.10: bytes=32 time<1ms TTL=127
  Reply from 192.168.20.10: bytes=32 time<1ms TTL=127
  ```
- **Criterion:** 4/4 replies received with 0% loss.

---

## 4. Negative Verification Tests

### Test NEG-01: Verifying Routing Table Purge upon Link Failure
- **Action:** Issue `shutdown` on `R1` `interface GigabitEthernet0/0/0`. Immediately view `show ip route`.
- **Expected Terminal Output:**
  ```text
  R1(config-if)# shutdown
  %LINK-5-CHANGED: Interface GigabitEthernet0/0/0, changed state to administratively down
  %LINEPROTO-5-UPDOWN: Line protocol on Interface GigabitEthernet0/0/0, changed state to down
  R1# show ip route
  Gateway of last resort is not set

        192.168.20.0/24 is variably subnetted, 2 subnets, 2 masks
  C        192.168.20.0/24 is directly connected, GigabitEthernet0/0/1
  L        192.168.20.1/32 is directly connected, GigabitEthernet0/0/1
  ```
- **Criterion:** Connected route `192.168.10.0/24` and local route `192.168.10.1/32` are removed immediately from the routing table when the interface state is down.

### Test NEG-02: Traffic to Non-Existent Destination Subnet
- **Action:** From `PC-A`, attempt to ping an unconfigured network: `ping 10.0.0.1`.
- **Expected Terminal Output:**
  ```text
  C:\> ping 10.0.0.1
  Reply from 192.168.10.1: Destination host unreachable.
  Reply from 192.168.10.1: Destination host unreachable.
  ```
- **Criterion:** In the absence of a default route (`0.0.0.0/0`), the router immediately drops packets for unknown subnets and issues ICMP Destination Unreachable.

---

## 5. Diagnostic & Troubleshooting Reference

| Diagnostic Command | What to Look For | Meaning |
|---|---|---|
| `show ip interface brief` | `Status` column | `administratively down` indicates `shutdown` command was used. |
| `show ip interface brief` | `Protocol` column | `down` while Status is `up` indicates Layer 2 / physical cabling defect or remote port down. |
| `show ip route` | `C` routes missing | An interface cannot have a connected route in the routing table unless both `Status` and `Protocol` are `up`. |
| `show ip route` | Subnet mask on `C` route | If subnet mask is `/25` instead of `/24`, verify the subnet mask entered in the `ip address` command. |
