# Verification and Diagnostic Guide: PTL-0018

**Lab ID:** `PTL-0018`  
**Lab Title:** Dynamic Trunking Protocol and Native VLAN Security  
**Category:** `switching`  
**Simulator Verification:** `tested_pass`  

This document details the test procedures, expected outputs, and diagnostic steps required to verify DTP mitigation, 802.1Q static trunking, Native VLAN 99 reassignment, and VLAN traffic isolation in Cisco Packet Tracer.

---

## 1. Physical and Logical Topology Verification

Confirm that all interfaces match the intended cabling and operational state:

| Device | Interface | Expected Mode | Native VLAN | Allowed VLANs | Connected To |
|---|---|---|---|---|---|
| **S1** | `GigabitEthernet0/1` | Static Trunk (`nonegotiate`) | 99 | 10,20,99 | S2 `Gi0/1` |
| **S1** | `GigabitEthernet0/2` | Static Trunk (`nonegotiate`) | 99 | 10,20,99 | S2 `Gi0/2` |
| **S1** | `FastEthernet0/10` | Static Access | N/A (VLAN 10) | N/A | PC1-Admin `Fa0` |
| **S1** | `FastEthernet0/20` | Static Access | N/A (VLAN 20) | N/A | PC2-Sales `Fa0` |
| **S2** | `GigabitEthernet0/1` | Static Trunk (`nonegotiate`) | 99 | 10,20,99 | S1 `Gi0/1` |
| **S2** | `GigabitEthernet0/2` | Static Trunk (`nonegotiate`) | 99 | 10,20,99 | S1 `Gi0/2` |
| **S2** | `FastEthernet0/10` | Static Access | N/A (VLAN 10) | N/A | PC3-Admin `Fa0` |
| **S2** | `FastEthernet0/20` | Static Access | N/A (VLAN 20) | N/A | PC4-Sales `Fa0` |
| **PC1-Admin** | `FastEthernet0` | `192.168.10.10/24` | VLAN 10 | N/A | S1 `Fa0/10` |
| **PC2-Sales** | `FastEthernet0` | `192.168.20.10/24` | VLAN 20 | N/A | S1 `Fa0/20` |
| **PC3-Admin** | `FastEthernet0` | `192.168.10.20/24` | VLAN 10 | N/A | S2 `Fa0/10` |
| **PC4-Sales** | `FastEthernet0` | `192.168.20.20/24` | VLAN 20 | N/A | S2 `Fa0/20` |

---

## 2. Command-by-Command Verification Matrix

### Test 1: Operational Trunk Status & Native VLAN
Execute on `S1` and `S2`:
```text
S1# show interfaces trunk
Port        Mode         Encapsulation  Status        Native vlan
Gig0/1      on           802.1q         trunking      99
Gig0/2      on           802.1q         trunking      99

Port        Vlans allowed on trunk
Gig0/1      10,20,99
Gig0/2      10,20,99
```
*Expected Result:* Port mode is `on` (static trunk); encapsulation is `802.1q`; Status is `trunking`; Native VLAN is `99`; Allowed VLANs list is restricted to `10,20,99`.

---

### Test 2: DTP Disabled (switchport nonegotiate)
Execute on `S1`:
```text
S1# show interfaces GigabitEthernet0/1 switchport
Name: Gi0/1
Switchport: Enabled
Administrative Mode: trunk
Operational Mode: trunk
Administrative Trunking Encapsulation: dot1q
Operational Trunking Encapsulation: dot1q
Negotiation of Trunking: Off
Access Mode VLAN: 1 (default)
Trunking Native Mode VLAN: 99 (Native)
```
*Expected Result:* `Negotiation of Trunking: Off`.

---

### Test 3: Intra-VLAN Reachability
Execute on `PC1-Admin`:
```text
C:\> ping 192.168.10.20
Pinging 192.168.10.20 with 32 bytes of data:
Reply from 192.168.10.20: bytes=32 time<1ms TTL=128
Reply from 192.168.10.20: bytes=32 time<1ms TTL=128
Ping statistics for 192.168.10.20:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)
```
Execute on `PC2-Sales`:
```text
C:\> ping 192.168.20.20
Pinging 192.168.20.20 with 32 bytes of data:
Reply from 192.168.20.20: bytes=32 time<1ms TTL=128
Ping statistics for 192.168.20.20:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)
```
*Expected Result:* 100% success rate within each VLAN.

---

### Test 4: Inter-VLAN Isolation (Negative Test)
Execute on `PC1-Admin`:
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
*Expected Result:* 100% packet loss (complete Layer 2 segmentation).
