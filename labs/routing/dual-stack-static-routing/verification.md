# Verification & Packet Tracer Assembly Guide: PTL-0001

**Lab ID:** `PTL-0001`  
**Lab Title:** Dual-Stack IPv4 and IPv6 Static Routing  
**Category:** `routing`  
**Difficulty:** Intermediate  

---

## 1. Physical & Packet Tracer Assembly Manifest

### Device Hardware & Module Schedule
| Device Role | Device Label | Packet Tracer Model | Module Slots | Software / IOS Version |
|---|---|---|---|---|
| Site A Router | **R1** | Cisco ISR 4331 (or 2911) | 3x GigabitEthernet onboard | Cisco IOS XE 16.6.4 / IOS 15.x |
| Site B Router | **R2** | Cisco ISR 4331 (or 2911) | 3x GigabitEthernet onboard | Cisco IOS XE 16.6.4 / IOS 15.x |
| Site A Switch | **S1** | Cisco Catalyst 2960-24TT | 24x 10/100, 2x Gigabit | Cisco IOS 15.0(2)SE4 (LAN Base) |
| Site B Switch | **S2** | Cisco Catalyst 2960-24TT | 24x 10/100, 2x Gigabit | Cisco IOS 15.0(2)SE4 (LAN Base) |
| Site A Workstation | **PC-A** | PC-PT | 1x FastEthernet | Generic Host OS |
| Site B Workstation | **PC-B** | PC-PT | 1x FastEthernet | Generic Host OS |

### Port-to-Port Cabling Matrix
| Origin Device | Origin Port | Destination Device | Destination Port | Network Segment | Cable Type |
|---|---|---|---|---|---|
| **R1** | `GigabitEthernet0/0/1` | **R2** | `GigabitEthernet0/0/0` | WAN Transit (`209.165.200.224/30`) | Copper Crossover / Auto-MDIX Straight |
| **R1** | `GigabitEthernet0/0/0` | **Switch S1** | `GigabitEthernet0/1` | Site A LAN (`192.168.10.0/24`) | Copper Straight-Through |
| **Switch S1** | `FastEthernet0/1` | **PC-A** | `FastEthernet0` | Site A LAN Access | Copper Straight-Through |
| **R2** | `GigabitEthernet0/0/1` | **Switch S2** | `GigabitEthernet0/1` | Site B LAN (`10.1.1.0/24`) | Copper Straight-Through |
| **Switch S2** | `FastEthernet0/1` | **PC-B** | `FastEthernet0` | Site B LAN Access | Copper Straight-Through |

### Addressing Table
| Device | Interface | IPv4 Address | Subnet Mask | IPv6 Global Address | Default Gateway |
|---|---|---|---|---|---|
| **R1** | Gi0/0/0 | `192.168.10.10` | `255.255.255.0` | `2001:db8:acad:10::10/64` | N/A |
| **R1** | Gi0/0/1 | `209.165.200.225` | `255.255.255.252` | `2001:db8:feed:224::1/64` | N/A |
| **R2** | Gi0/0/0 | `209.165.200.226` | `255.255.255.252` | `2001:db8:feed:224::2/64` | N/A |
| **R2** | Gi0/0/1 | `10.1.1.10` | `255.255.255.0` | `2001:db8:cafe:1::10/64` | N/A |
| **S1** | VLAN 1 | `192.168.10.2` | `255.255.255.0` | N/A | `192.168.10.10` |
| **S2** | VLAN 1 | `10.1.1.2` | `255.255.255.0` | N/A | `10.1.1.10` |
| **PC-A** | Fa0 | `192.168.10.1` | `255.255.255.0` | `2001:db8:acad:10::1/64` | `192.168.10.10` / `2001:db8:acad:10::10` |
| **PC-B** | Fa0 | `10.1.1.1` | `255.255.255.0` | `2001:db8:cafe:1::1/64` | `10.1.1.10` / `2001:db8:cafe:1::10` |

---

## 2. Pre-Configuration & Topology Asset Preservation

- **Preserved Contributor Binary Asset:** `dual-stack-static-routing.pkt` (SHA-256: `8d7f62a8b4e36ef0a6efb613b92e84dbed3f1c34cb5d268b9d2b7db487680b31`) represents the verified working reference solution.
- Complete device configuration files:
  - [`configs/R1.txt`](configs/R1.txt)
  - [`configs/R2.txt`](configs/R2.txt)
  - [`configs/S1.txt`](configs/S1.txt)
  - [`configs/S2.txt`](configs/S2.txt)

---

## 3. Positive Verification Tests

### Test POS-01: Static Route Table Installation
- **Action:** At `R1#`, issue `show ip route static` and `show ipv6 route static`.
- **Expected Terminal Output:**
  ```text
  R1# show ip route static
  S     10.1.1.0/24 [1/0] via 209.165.200.226

  R1# show ipv6 route static
  S   2001:DB8:CAFE:1::/64 [1/0]
       via 2001:DB8:FEED:224::2
  ```
- **Criterion:** Static routes to remote LAN are installed with Administrative Distance of 1 (`[1/0]`) via the correct R2 WAN next hop.

### Test POS-02: End-to-End IPv4 Routing Reachability
- **Action:** From `PC-A` (`192.168.10.1`), ping `PC-B` (`10.1.1.1`).
- **Expected Terminal Output:**
  ```text
  C:\> ping 10.1.1.1
  Reply from 10.1.1.1: bytes=32 time<1ms TTL=126
  Reply from 10.1.1.1: bytes=32 time<1ms TTL=126
  Reply from 10.1.1.1: bytes=32 time<1ms TTL=126
  Reply from 10.1.1.1: bytes=32 time<1ms TTL=126
  ```
- **Criterion:** 100% ICMP packet success across two router hops (TTL decremented by 2).

### Test POS-03: End-to-End IPv6 Routing Reachability
- **Action:** From `PC-A`, ping `PC-B` IPv6 address: `ping 2001:db8:cafe:1::1`.
- **Expected Terminal Output:**
  ```text
  C:\> ping 2001:db8:cafe:1::1
  Reply from 2001:DB8:CAFE:1::1: bytes=32 time<1ms
  Reply from 2001:DB8:CAFE:1::1: bytes=32 time<1ms
  Reply from 2001:DB8:CAFE:1::1: bytes=32 time<1ms
  Reply from 2001:DB8:CAFE:1::1: bytes=32 time<1ms
  ```
- **Criterion:** 100% IPv6 packet success across the dual-stack transit WAN link.

---

## 4. Negative Verification Tests

### Test NEG-01: Asymmetric Routing / Missing Return Route
- **Action:** On `R2`, remove the IPv4 return route: `no ip route 192.168.10.0 255.255.255.0 209.165.200.225`. From `PC-A`, ping `PC-B` (`10.1.1.1`).
- **Expected Terminal Output:**
  ```text
  C:\> ping 10.1.1.1
  Request timed out.
  Request timed out.
  ```
- **Criterion:** R1 forwards the packet to R2, but R2 drops the return echo reply due to lack of a route back to `192.168.10.0/24`. Proves that routing must be bidirectional.

### Test NEG-02: Incorrect Next-Hop IP Address
- **Action:** Configure static route pointing to an unconfigured next-hop: `ip route 10.1.1.0 255.255.255.0 209.165.200.230`. Inspect `show ip route`.
- **Expected Behavior:** Cisco IOS will not install the static route into the forwarding table because the next-hop address cannot be resolved via ARP on any connected subnet.

---

## 5. Diagnostic & Troubleshooting Reference

| Symptom | Root Cause | Remediation Command |
|---|---|---|
| Ping from PC-A to R1 succeeds, but to PC-B fails | Missing static route on R1 or missing return route on R2 | Check `show ip route static` on both routers; ensure both directions are configured. |
| IPv4 works, but IPv6 fails completely | `ipv6 unicast-routing` omitted on R1 or R2 | Execute `ipv6 unicast-routing` in global configuration mode on both routers. |
| Router-to-router WAN ping fails | Subnet mask mismatch on `/30` point-to-point link | Ensure both ends use `255.255.255.252`. |
