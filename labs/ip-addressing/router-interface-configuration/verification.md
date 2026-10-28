# Verification & Packet Tracer Assembly Guide: PTL-0002

**Lab ID:** `PTL-0002`  
**Lab Title:** Configuring Cisco Router Interfaces  
**Category:** `ip-addressing`  
**Difficulty:** Beginner  

---

## 1. Physical & Packet Tracer Assembly Manifest

### Device Hardware & Module Schedule
| Device Role | Device Label | Packet Tracer Model | Module Slots | Software / IOS Version |
|---|---|---|---|---|
| Dual-LAN Router | **R1** | Cisco ISR 4321 (or 2911) | 2x GigabitEthernet onboard (Gi0/0/0, Gi0/0/1) | Cisco IOS XE 16.6.4 / IOS 15.x |
| LAN 1 Access Switch | **S1** | Cisco Catalyst 2960-24TT | 24x 10/100 FastEthernet, 2x Gigabit | Cisco IOS 15.0(2)SE4 (LAN Base) |
| LAN 2 Access Switch | **S2** | Cisco Catalyst 2960-24TT | 24x 10/100 FastEthernet, 2x Gigabit | Cisco IOS 15.0(2)SE4 (LAN Base) |
| Admin Host | **PC-Admin** | PC-PT | 1x FastEthernet | Generic Host OS |
| Sales Host | **PC-Sales** | PC-PT | 1x FastEthernet | Generic Host OS |

### Port-to-Port Cabling Matrix
| Origin Device | Origin Port | Destination Device | Destination Port | Cable Type | Cable Color |
|---|---|---|---|---|---|
| **R1** | `GigabitEthernet0/0/0` | **Switch S1** | `GigabitEthernet0/2` | Copper Straight-Through | Solid black |
| **R1** | `GigabitEthernet0/0/1` | **Switch S2** | `GigabitEthernet0/2` | Copper Straight-Through | Solid black |
| **Switch S1** | `GigabitEthernet0/1` | **PC-Admin** | `FastEthernet0` | Copper Straight-Through | Solid black |
| **Switch S2** | `GigabitEthernet0/1` | **PC-Sales** | `FastEthernet0` | Copper Straight-Through | Solid black |

### Step-by-Step Packet Tracer Assembly
1. Under **Network Devices -> Routers**, drag a **4321** router onto the workspace. Label it `R1`.
2. Under **Network Devices -> Switches**, drag two **2960** switches onto the workspace. Label them `S1` and `S2`.
3. Under **End Devices**, drag two **PC**s. Label them `PC-Admin` and `PC-Sales`.
4. Cable the devices according to the matrix above using **Copper Straight-Through** cables.
5. Configure host IP addressing:
   - **S1 (VLAN 1 SVI):**
     - IPv4 Address: `192.168.1.2` / `255.255.255.0`
     - IPv4 Gateway: `192.168.1.1`
   - **S2 (VLAN 1 SVI):**
     - IPv4 Address: `192.168.2.2` / `255.255.255.0`
     - IPv4 Gateway: `192.168.2.1`
   - **PC-Admin:**
     - IPv4 Address: `192.168.1.10` / `255.255.255.0`
     - IPv4 Gateway: `192.168.1.1`
     - IPv6 Address: `2001:db8:acad:1::10/64`
     - IPv6 Gateway: `fe80::1`
   - **PC-Sales:**
     - IPv4 Address: `192.168.2.10` / `255.255.255.0`
     - IPv4 Gateway: `192.168.2.1`
     - IPv6 Address: `2001:db8:acad:2::10/64`
     - IPv6 Gateway: `fe80::1`

---

## 2. Pre-Configuration & Starter State

In the starter state (`starter`):
- Physical topology is fully connected and cabled.
- Router `R1` interfaces are unaddressed and in default administrative shutdown state (red link lights).
- Switches `S1` and `S2` are at baseline state.
- Student must configure dual-stack addressing on `Gi0/0/0` and `Gi0/0/1`, enable global IPv6 routing (`ipv6 unicast-routing`), bring interfaces up (`no shutdown`), and verify cross-subnet reachability.

Complete configuration scripts:
- [`configs/R1.txt`](configs/R1.txt)
- [`configs/S1.txt`](configs/S1.txt)
- [`configs/S2.txt`](configs/S2.txt)

---

## 3. Positive Verification Tests

### Test POS-01: Dual-Stack Interface Operating Status
- **Action:** At `R1#`, issue `show ip interface brief` and `show ipv6 interface brief`.
- **Expected Terminal Output:**
  ```text
  R1# show ip interface brief
  Interface              IP-Address      OK? Method Status                Protocol
  GigabitEthernet0/0/0   192.168.1.1     YES manual up                    up      
  GigabitEthernet0/0/1   192.168.2.1     YES manual up                    up      

  R1# show ipv6 interface brief
  GigabitEthernet0/0/0   [up/up]
      FE80::1
      2001:DB8:ACAD:1::1
  GigabitEthernet0/0/1   [up/up]
      FE80::1
      2001:DB8:ACAD:2::1
  ```
- **Criterion:** Both interfaces show Status `up` and Protocol `up` with expected IPv4, global IPv6, and link-local `fe80::1`.

### Test POS-02: End-to-End Inter-LAN IPv4 Routing
- **Action:** From `PC-Admin` Command Prompt, ping `PC-Sales`: `ping 192.168.2.10`.
- **Expected Terminal Output:**
  ```text
  C:\> ping 192.168.2.10
  Pinging 192.168.2.10 with 32 bytes of data:
  Reply from 192.168.2.10: bytes=32 time<1ms TTL=127
  Reply from 192.168.2.10: bytes=32 time<1ms TTL=127
  Reply from 192.168.2.10: bytes=32 time<1ms TTL=127
  Reply from 192.168.2.10: bytes=32 time<1ms TTL=127

  Ping statistics for 192.168.2.10:
      Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)
  ```
- **Criterion:** 100% packet success across the router.

### Test POS-03: End-to-End Inter-LAN IPv6 Routing
- **Action:** From `PC-Admin` Command Prompt, ping `PC-Sales`: `ping 2001:db8:acad:2::10`.
- **Expected Terminal Output:**
  ```text
  C:\> ping 2001:db8:acad:2::10
  Pinging 2001:db8:acad:2::10 with 32 bytes of data:
  Reply from 2001:db8:acad:2::10: bytes=32 time<1ms
  Reply from 2001:db8:acad:2::10: bytes=32 time<1ms
  Reply from 2001:db8:acad:2::10: bytes=32 time<1ms
  Reply from 2001:db8:acad:2::10: bytes=32 time<1ms
  ```
- **Criterion:** 100% IPv6 packet success across the router.

---

## 4. Negative Verification Tests

### Test NEG-01: Administrative Shutdown Impact
- **Action:** On `R1`, enter `interface GigabitEthernet0/0/1` and issue `shutdown`. Then attempt to ping `PC-Sales` from `PC-Admin`.
- **Expected Terminal Output:**
  ```text
  C:\> ping 192.168.2.10
  Reply from 192.168.1.1: Destination host unreachable.
  Reply from 192.168.1.1: Destination host unreachable.
  ```
- **Criterion:** Router R1 returns ICMP Type 3 Destination Unreachable because the route was removed from the routing table.

### Test NEG-02: Missing Global IPv6 Unicast Routing
- **Action:** On `R1`, issue `no ipv6 unicast-routing`. Attempt to ping `2001:db8:acad:2::10` from `PC-Admin`.
- **Expected Terminal Output:**
  ```text
  C:\> ping 2001:db8:acad:2::10
  Request timed out.
  ```
- **Criterion:** Without `ipv6 unicast-routing`, the router operates only as an IPv6 host and will not forward packets between interfaces.

---

## 5. Diagnostic & Troubleshooting Reference

| Symptom | Root Cause | Remediation Command |
|---|---|---|
| Interface status shows `administratively down` | Default shutdown state active | Enter interface config and execute `no shutdown`. |
| Interface shows `up / down` | Cable disconnected at opposite end or switch port shut down | Check physical cable connection and ensure switch port is `no shutdown`. |
| IPv4 works but IPv6 ping fails across subnets | `ipv6 unicast-routing` was not enabled globally | At Global Config prompt, issue `ipv6 unicast-routing`. |
| PC cannot ping default gateway | Incorrect default gateway or subnet mask configured on PC | Check PC IP Configuration and verify default gateway is `192.168.1.1`. |
