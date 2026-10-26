# Verification & Packet Tracer Assembly Guide: PTL-0011

**Lab ID:** `PTL-0011`  
**Lab Title:** Single-Area OSPFv2 Configuration and Verification  
**Category:** `routing`  
**Difficulty:** Intermediate  

---

## 1. Physical & Packet Tracer Assembly Manifest

### Device Hardware & Module Schedule
| Device Role | Device Label | Packet Tracer Model | Module Slots | Software / IOS Version |
|---|---|---|---|---|
| HQ Gateway | **R1** | Cisco ISR 4321 (or 2911) | 2x GigabitEthernet onboard | Cisco IOS XE 16.6.4 / IOS 15.x |
| Branch Gateway | **R2** | Cisco ISR 4321 (or 2911) | 2x GigabitEthernet onboard | Cisco IOS XE 16.6.4 / IOS 15.x |
| HQ Switch | **S1** | Cisco Catalyst 2960-24TT | 24x 10/100, 2x Gigabit | Cisco IOS 15.0(2)SE4 (LAN Base) |
| Branch Switch | **S2** | Cisco Catalyst 2960-24TT | 24x 10/100, 2x Gigabit | Cisco IOS 15.0(2)SE4 (LAN Base) |
| HQ Host | **PC1** | PC-PT | 1x FastEthernet | Generic Host OS |
| Branch Host | **PC2** | PC-PT | 1x FastEthernet | Generic Host OS |

### Port-to-Port Cabling Matrix
| Origin Device | Origin Port | Destination Device | Destination Port | Network Segment | Cable Type |
|---|---|---|---|---|---|
| **R1** | `GigabitEthernet0/0/1` | **R2** | `GigabitEthernet0/0/1` | WAN Transit (`10.0.0.0/30`) | Copper Crossover / Auto-MDIX Straight |
| **R1** | `GigabitEthernet0/0/0` | **Switch S1** | `GigabitEthernet0/1` | HQ LAN (`192.168.1.0/24`) | Copper Straight-Through |
| **Switch S1** | `FastEthernet0/1` | **PC1** | `FastEthernet0` | HQ Host Access | Copper Straight-Through |
| **R2** | `GigabitEthernet0/0/0` | **Switch S2** | `GigabitEthernet0/1` | Branch LAN (`192.168.2.0/24`) | Copper Straight-Through |
| **Switch S2** | `FastEthernet0/1` | **PC2** | `FastEthernet0` | Branch Host Access | Copper Straight-Through |

### Addressing Table
| Device | Interface | IPv4 Address | Subnet Mask | OSPF Area | Role |
|---|---|---|---|---|---|
| **R1** | Gi0/0/0 | `192.168.1.1` | `255.255.255.0` | Area 0 | Passive Interface |
| **R1** | Gi0/0/1 | `10.0.0.1` | `255.255.255.252` | Area 0 | Active OSPF Adjacency |
| **R2** | Gi0/0/0 | `192.168.2.1` | `255.255.255.0` | Area 0 | Passive Interface |
| **R2** | Gi0/0/1 | `10.0.0.2` | `255.255.255.252` | Area 0 | Active OSPF Adjacency |
| **PC1** | Fa0 | `192.168.1.10` | `255.255.255.0` | N/A | Default Gateway: `192.168.1.1` |
| **PC2** | Fa0 | `192.168.2.10` | `255.255.255.0` | N/A | Default Gateway: `192.168.2.1` |

---

## 2. Pre-Configuration & Starter State

In the starter state (`starter`):
- Physical topology is fully cabled.
- IP addresses are configured on all router interfaces and hosts.
- Direct router-to-router ping across `10.0.0.0/30` succeeds, but neither router has knowledge of the remote LAN.
- Student must configure OSPF process 10, set explicit 32-bit `router-id`, advertise networks using wildcard masks in `area 0`, configure `passive-interface` on user-facing LAN ports, and verify OSPF adjacency and dynamic route propagation.

Complete reference configurations:
- [`configs/R1.txt`](configs/R1.txt)
- [`configs/R2.txt`](configs/R2.txt)

---

## 3. Positive Verification Tests

### Test POS-01: OSPF Neighbor Adjacency
- **Action:** At `R1#`, issue `show ip ospf neighbor`.
- **Expected Terminal Output:**
  ```text
  R1# show ip ospf neighbor
  Neighbor ID     Pri   State           Dead Time   Address         Interface
  2.2.2.2           1   FULL/BDR        00:00:33    10.0.0.2        GigabitEthernet0/0/1
  ```
- **Criterion:** Neighbor ID `2.2.2.2` is in `FULL` state (`FULL/DR` or `FULL/BDR`).

### Test POS-02: Dynamic OSPF Route Learning
- **Action:** At `R1#`, issue `show ip route ospf`.
- **Expected Terminal Output:**
  ```text
  R1# show ip route ospf
  O        192.168.2.0/24 [110/2] via 10.0.0.2, 00:05:12, GigabitEthernet0/0/1
  ```
- **Criterion:** Remote network `192.168.2.0/24` is installed with code `O`, administrative distance of 110, metric of 2, via next-hop `10.0.0.2`.

### Test POS-03: End-to-End Inter-Branch Dynamic Reachability
- **Action:** From `PC1` (`192.168.1.10`), ping `PC2` (`192.168.2.10`).
- **Expected Terminal Output:**
  ```text
  C:\> ping 192.168.2.10
  Reply from 192.168.2.10: bytes=32 time<1ms TTL=126
  Reply from 192.168.2.10: bytes=32 time<1ms TTL=126
  Reply from 192.168.2.10: bytes=32 time<1ms TTL=126
  Reply from 192.168.2.10: bytes=32 time<1ms TTL=126
  ```
- **Criterion:** 100% packet success across the dynamic OSPF routed backbone.

---

## 4. Negative Verification Tests

### Test NEG-01: OSPF Hello / Dead Interval Mismatch
- **Action:** On `R1`, change Hello timer on transit interface: `interface Gi0/0/1` -> `ip ospf hello-interval 5`.
- **Expected Behavior:**
  - When Dead timer expires (40 seconds), OSPF drops adjacency:
    `%OSPF-5-ADJCHG: Process 10, Nbr 2.2.2.2 on GigabitEthernet0/0/1 from FULL to DOWN, Neighbor Down: Dead timer expired`
  - `show ip route ospf` shows remote routes immediately flushed.
  - Pings between PC1 and PC2 fail.

### Test NEG-02: OSPF Area ID Mismatch
- **Action:** On `R2`, configure network statement with wrong area: `network 10.0.0.0 0.0.0.3 area 1`.
- **Expected Behavior:**
  - OSPF neighbor adjacency will not form because routers must share the exact same Area ID on common transit links.

---

## 5. Diagnostic & Troubleshooting Reference

| Symptom | Root Cause | Remediation Command |
|---|---|---|
| OSPF neighbor stuck in `INIT` or `EXSTART` | MTU mismatch or Hello/Dead timer mismatch | Check `ip ospf mtu-ignore` or reset timers with `no ip ospf hello-interval`. |
| No neighbor shown in `show ip ospf neighbor` | Wildcard mask error or interface not up | Verify `network 10.0.0.0 0.0.0.3 area 0` matches interface subnet. |
| OSPF Hellos sent out user LAN | Missing `passive-interface` command | Under `router ospf 10`, issue `passive-interface Gi0/0/0`. |
