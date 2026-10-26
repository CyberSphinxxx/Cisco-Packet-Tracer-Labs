# Verification & Packet Tracer Assembly Guide: PTL-0010

**Lab ID:** `PTL-0010`  
**Lab Title:** Router-on-a-Stick Inter-VLAN Routing  
**Category:** `routing`  
**Difficulty:** Intermediate  

---

## 1. Physical & Packet Tracer Assembly Manifest

### Device Hardware & Module Schedule
| Device Role | Device Label | Packet Tracer Model | Module Slots | Software / IOS Version |
|---|---|---|---|---|
| Inter-VLAN Router | **R1** | Cisco ISR 4321 (or 2911) | 2x GigabitEthernet onboard | Cisco IOS XE 16.6.4 / IOS 15.x |
| Access & Trunk Switch | **S1** | Cisco Catalyst 2960-24TT | 24x 10/100, 2x Gigabit | Cisco IOS 15.0(2)SE4 (LAN Base) |
| Faculty Workstation | **PC1** | PC-PT | 1x FastEthernet | Generic Host OS |
| Student Workstation | **PC2** | PC-PT | 1x FastEthernet | Generic Host OS |

### Port-to-Port Cabling Matrix
| Origin Device | Origin Port | Destination Device | Destination Port | Link Role | Cable Type |
|---|---|---|---|---|---|
| **R1** | `GigabitEthernet0/0/0` | **Switch S1** | `FastEthernet0/1` | 802.1Q Trunk Link (ROAS) | Copper Straight-Through |
| **Switch S1** | `FastEthernet0/11` | **PC1** | `FastEthernet0` | Access Port (VLAN 10) | Copper Straight-Through |
| **Switch S1** | `FastEthernet0/21` | **PC2** | `FastEthernet0` | Access Port (VLAN 20) | Copper Straight-Through |

### Addressing Table
| Device | Interface | IPv4 Address | Subnet Mask | Default Gateway | 802.1Q Tag |
|---|---|---|---|---|---|
| **R1** | Gi0/0/0.10 | `192.168.10.1` | `255.255.255.0` | N/A | VLAN 10 |
| **R1** | Gi0/0/0.20 | `192.168.20.1` | `255.255.255.0` | N/A | VLAN 20 |
| **S1** | VLAN 99 (SVI) | `192.168.99.2` | `255.255.255.0` | `192.168.99.1` | VLAN 99 |
| **PC1** | FastEthernet0 | `192.168.10.10` | `255.255.255.0` | `192.168.10.1` | Untagged (Access) |
| **PC2** | FastEthernet0 | `192.168.20.10` | `255.255.255.0` | `192.168.20.1` | Untagged (Access) |

---

## 2. Pre-Configuration & Starter State

In the starter state (`starter`):
- Switch S1 has VLAN 10 and VLAN 20 configured on access ports `Fa0/11` and `Fa0/21`.
- Router R1 is unconfigured and physical link `Gi0/0/0` is shut down.
- Prior to configuring ROAS, PC1 and PC2 cannot communicate (isolated by VLAN segmentation).
- Student must configure 802.1Q trunking on Switch S1 `Fa0/1`, enable `Gi0/0/0` without an IP address, configure subinterfaces `Gi0/0/0.10` and `Gi0/0/0.20` with `encapsulation dot1Q` and gateway IPs, and verify routed inter-VLAN reachability.

Complete reference configurations:
- [`configs/R1.txt`](configs/R1.txt)
- [`configs/S1.txt`](configs/S1.txt)

---

## 3. Positive Verification Tests

### Test POS-01: Router Subinterface Operational Status
- **Action:** At `R1#`, issue `show ip interface brief`.
- **Expected Terminal Output:**
  ```text
  R1# show ip interface brief
  Interface              IP-Address      OK? Method Status                Protocol
  GigabitEthernet0/0/0   unassigned      YES unset  up                    up      
  GigabitEthernet0/0/0.10 192.168.10.1    YES manual up                    up      
  GigabitEthernet0/0/0.20 192.168.20.1    YES manual up                    up      
  ```
- **Criterion:** Physical parent interface is unassigned and `up/up`; both subinterfaces are `up/up` with correct gateway IPs.

### Test POS-02: Switch Trunk Status
- **Action:** At `S1#`, issue `show interfaces trunk`.
- **Expected Terminal Output:**
  ```text
  S1# show interfaces trunk
  Port        Mode             Encapsulation  Status        Native vlan
  Fa0/1       on               802.1q         trunking      1
  ```
- **Criterion:** Switch port `Fa0/1` is actively trunking using 802.1Q encapsulation.

### Test POS-03: Inter-VLAN Routing Reachability
- **Action:** From `PC1` (`192.168.10.10`), ping `PC2` (`192.168.20.10`).
- **Expected Terminal Output:**
  ```text
  C:\> ping 192.168.20.10
  Reply from 192.168.20.10: bytes=32 time<1ms TTL=127
  Reply from 192.168.20.10: bytes=32 time<1ms TTL=127
  Reply from 192.168.20.10: bytes=32 time<1ms TTL=127
  Reply from 192.168.20.10: bytes=32 time<1ms TTL=127
  ```
- **Criterion:** 100% packet success across the router. TTL is 127 (one hop through R1).

---

## 4. Negative Verification Tests

### Test NEG-01: Encapsulation VLAN Tag Mismatch
- **Action:** On `R1`, change subinterface encapsulation: `interface Gi0/0/0.10` -> `encapsulation dot1Q 30`. Attempt ping from `PC1` to `192.168.10.1`.
- **Expected Output:**
  ```text
  C:\> ping 192.168.10.1
  Request timed out.
  ```
- **Criterion:** R1 drops frames tagged with VLAN 10 because `Gi0/0/0.10` is expecting VLAN 30 tags.

### Test NEG-02: Switch Trunk Port Reverted to Access Mode
- **Action:** On `S1`, change `Fa0/1` to `switchport mode access`.
- **Expected Output:**
  - `show interfaces trunk` on S1 returns no active trunks.
  - Inter-VLAN routing fails completely because the switch strips VLAN tags or blocks multi-VLAN traffic across an access port.

---

## 5. Diagnostic & Troubleshooting Reference

| Symptom | Root Cause | Remediation Command |
|---|---|---|
| All subinterfaces show `down / down` | Physical parent interface `Gi0/0/0` is shut down | On `interface Gi0/0/0`, issue `no shutdown`. |
| Cannot configure `ip address` on subinterface | `encapsulation dot1Q <vlan>` was not configured first | Must issue `encapsulation dot1Q <vlan>` before assigning `ip address`. |
| PC can ping its gateway but not other VLANs | PC default gateway missing or incorrect | Verify PC IP Configuration matches the subinterface IP for its VLAN. |
