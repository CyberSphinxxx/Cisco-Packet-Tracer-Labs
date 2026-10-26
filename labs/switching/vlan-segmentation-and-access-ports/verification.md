# Verification & Packet Tracer Assembly Guide: PTL-0009

**Lab ID:** `PTL-0009`  
**Lab Title:** VLAN Segmentation and Access Port Configuration  
**Category:** `switching`  
**Difficulty:** Beginner  

---

## 1. Physical & Packet Tracer Assembly Manifest

### Device Hardware & Module Schedule
| Device Role | Device Label | Packet Tracer Model | Module Slots | Software / IOS Version |
|---|---|---|---|---|
| Access Layer Switch | **S1** | Cisco Catalyst 2960-24TT | 24x 10/100 FastEthernet, 2x Gigabit | Cisco IOS 15.0(2)SE4 (LAN Base) |
| Faculty PC 1 | **PC1** | PC-PT | 1x FastEthernet | Generic Host OS |
| Faculty PC 2 | **PC2** | PC-PT | 1x FastEthernet | Generic Host OS |
| Student PC 1 | **PC3** | PC-PT | 1x FastEthernet | Generic Host OS |
| Student PC 2 | **PC4** | PC-PT | 1x FastEthernet | Generic Host OS |

### Port-to-Port Cabling Matrix
| Origin Device | Origin Port | Destination Device | Destination Port | Access VLAN | Cable Type |
|---|---|---|---|---|---|
| **PC1** | `FastEthernet0` | **Switch S1** | `FastEthernet0/1` | VLAN 10 (Faculty) | Copper Straight-Through |
| **PC2** | `FastEthernet0` | **Switch S1** | `FastEthernet0/2` | VLAN 10 (Faculty) | Copper Straight-Through |
| **PC3** | `FastEthernet0` | **Switch S1** | `FastEthernet0/11` | VLAN 20 (Students) | Copper Straight-Through |
| **PC4** | `FastEthernet0` | **Switch S1** | `FastEthernet0/12` | VLAN 20 (Students) | Copper Straight-Through |

### Addressing Table
| Device | Interface | IPv4 Address | Subnet Mask | VLAN Assignment |
|---|---|---|---|---|
| **S1** | VLAN 99 (SVI) | `192.168.99.2` | `255.255.255.0` | VLAN 99 (Management) |
| **PC1** | FastEthernet0 | `192.168.10.10` | `255.255.255.0` | VLAN 10 (Faculty) |
| **PC2** | FastEthernet0 | `192.168.10.11` | `255.255.255.0` | VLAN 10 (Faculty) |
| **PC3** | FastEthernet0 | `192.168.20.10` | `255.255.255.0` | VLAN 20 (Students) |
| **PC4** | FastEthernet0 | `192.168.20.11` | `255.255.255.0` | VLAN 20 (Students) |

---

## 2. Pre-Configuration & Starter State

In the starter state (`starter`):
- All 4 PCs are cabled to Switch S1.
- All 24 switch ports reside in factory-default **VLAN 1** (`default`).
- Prior to VLAN segmentation, all 4 PCs share a single broadcast domain.
- Student must create VLAN 10, VLAN 20, VLAN 99, assign ports `Fa0/1-10` to VLAN 10, assign ports `Fa0/11-20` to VLAN 20, configure Management SVI 99, and verify broadcast boundary isolation.

Complete reference configuration:
- [`configs/S1.txt`](configs/S1.txt)

---

## 3. Positive Verification Tests

### Test POS-01: VLAN Database and Membership Verification
- **Action:** At `S1#`, issue `show vlan brief`.
- **Expected Terminal Output:**
  ```text
  S1# show vlan brief

  VLAN Name                             Status    Ports
  ---- -------------------------------- --------- -------------------------------
  1    default                          active    Fa0/21, Fa0/22, Fa0/23, Fa0/24, Gi0/1, Gi0/2
  10   Faculty                          active    Fa0/1, Fa0/2, Fa0/3, Fa0/4, Fa0/5, Fa0/6, Fa0/7, Fa0/8, Fa0/9, Fa0/10
  20   Students                         active    Fa0/11, Fa0/12, Fa0/13, Fa0/14, Fa0/15, Fa0/16, Fa0/17, Fa0/18, Fa0/19, Fa0/20
  99   Management                       active    
  ```
- **Criterion:** VLANs 10, 20, and 99 are active; ports `Fa0/1-10` belong to VLAN 10; ports `Fa0/11-20` belong to VLAN 20.

### Test POS-02: Intra-VLAN Communication (Faculty VLAN 10)
- **Action:** From `PC1` (`192.168.10.10`), ping `PC2` (`192.168.10.11`).
- **Expected Terminal Output:**
  ```text
  C:\> ping 192.168.10.11
  Pinging 192.168.10.11 with 32 bytes of data:
  Reply from 192.168.10.11: bytes=32 time<1ms TTL=128
  Reply from 192.168.10.11: bytes=32 time<1ms TTL=128
  Reply from 192.168.10.11: bytes=32 time<1ms TTL=128
  Reply from 192.168.10.11: bytes=32 time<1ms TTL=128
  ```
- **Criterion:** Successful intra-VLAN reachability with 0% loss.

### Test POS-03: Intra-VLAN Communication (Student VLAN 20)
- **Action:** From `PC3` (`192.168.20.10`), ping `PC4` (`192.168.20.11`).
- **Expected Terminal Output:**
  ```text
  C:\> ping 192.168.20.11
  Pinging 192.168.20.11 with 32 bytes of data:
  Reply from 192.168.20.11: bytes=32 time<1ms TTL=128
  Reply from 192.168.20.11: bytes=32 time<1ms TTL=128
  Reply from 192.168.20.11: bytes=32 time<1ms TTL=128
  Reply from 192.168.20.11: bytes=32 time<1ms TTL=128
  ```
- **Criterion:** Successful intra-VLAN reachability with 0% loss.

---

## 4. Negative Verification Tests

### Test NEG-01: Inter-VLAN Broadcast Domain Isolation
- **Action:** From `PC1` (VLAN 10), attempt to ping `PC3` (VLAN 20: `192.168.20.10`).
- **Expected Terminal Output:**
  ```text
  C:\> ping 192.168.20.10
  Pinging 192.168.20.10 with 32 bytes of data:
  Request timed out.
  Request timed out.
  Request timed out.
  Request timed out.

  Ping statistics for 192.168.20.10:
      Packets: Sent = 4, Received = 0, Lost = 4 (100% loss)
  ```
- **Criterion:** 100% packet loss. Confirms that Layer 2 switches do not forward frames between different VLANs without a Layer 3 routing device.

### Test NEG-02: Port Configured for Non-Existent VLAN
- **Action:** Assign a port to an uncreated VLAN (e.g. `switchport access vlan 50`). Inspect `show vlan brief`.
- **Expected Behavior:** Catalyst switches automatically create the VLAN in `vlan.dat` (`VLAN0050`), warning the administrator that explicit naming was omitted.

---

## 5. Diagnostic & Troubleshooting Reference

| Symptom | Root Cause | Remediation Command |
|---|---|---|
| Ping between PCs in the same VLAN fails | Incorrect IP address/mask or port in wrong VLAN | Run `show mac address-table` and `show vlan brief` to verify port assignment. |
| Interface does not appear in `show vlan brief` | Port configured as a trunk (`switchport mode trunk`) | Verify with `show interfaces switchport`. If needed, issue `switchport mode access`. |
| VLAN configuration lost after reboot | `vlan.dat` corrupted or erased, or startup-config unsaved | Issue `copy running-config startup-config`. |
