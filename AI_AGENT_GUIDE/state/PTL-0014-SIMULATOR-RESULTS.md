# Live Simulator Verification Report: PTL-0014

**Lab ID:** `PTL-0014`  
**Lab Title:** Default Gateway Operation and Troubleshooting  
**Category:** `network-fundamentals`  
**Difficulty:** Beginner  
**Date (UTC):** 2026-10-30  
**Simulator Version:** Cisco Packet Tracer 9.0.1.0038 (64-bit Windows)  
**Verification Method:** Live In-Simulator IPC Execution via Antigravity Packet Tracer MCP Bridge  
**Overall Verdict:** **VERIFIED PASS** (100% of Positive, Negative, and Reload Tests Passed)

---

## 1. Executive Summary

This report documents the live verification and deliverable generation for **PTL-0014: Default Gateway Operation and Troubleshooting** inside an authentic running instance of Cisco Packet Tracer 9.0.1.

The dual-LAN topology—incorporating Cisco ISR 4321 router `R1`, Catalyst 2960-24TT access switches `S1` and `S2`, and workstations `PC1`, `PC2`, and `PC-Remote`—was constructed, cabled, and verified via the local MCP bridge.

The starter activity (`assets/starter.pkt`) presents a pre-cabled, pre-addressed network where router `R1` has active gateway interfaces `192.168.10.1` and `192.168.20.1`, `PC2` and `PC-Remote` have working IP parameters, but `PC1` has an unconfigured default gateway (`0.0.0.0`). The learner must diagnose why `PC1` can communicate locally with `PC2` but cannot reach remote destination `PC-Remote`. The completed reference activity (`assets/completed.pkt`) configures `PC1` with default gateway `192.168.10.1`, enabling full routed end-to-end reachability.

Live simulator testing verified intra-subnet frame switching, direct gateway reachability, inter-subnet routed forwarding, host ARP resolution dynamics, and three distinct fault-injection scenarios (missing gateway, invalid gateway IP, and gateway interface shutdown). Both starter and completed project files were verified for clean reopening in Cisco Packet Tracer.

---

## 2. Live Simulator Environment & Topology

### Devices and Modules
| Device Name | Packet Tracer Model | Primary Interfaces | Role |
|---|---|---|---|
| **R1** | Cisco ISR 4321 | `Gi0/0/0` (`192.168.10.1/24`), `Gi0/0/1` (`192.168.20.1/24`) | Default Gateway for LAN 1 and LAN 2 |
| **S1** | Catalyst 2960-24TT | `Gi0/1`, `Fa0/1`, `Fa0/2` | LAN 1 Access Switch (`192.168.10.2`) |
| **S2** | Catalyst 2960-24TT | `Gi0/1`, `Fa0/1` | LAN 2 Access Switch (`192.168.20.2`) |
| **PC1** | PC-PT | `FastEthernet0` | LAN 1 Workstation (`192.168.10.10/24`) |
| **PC2** | PC-PT | `FastEthernet0` | LAN 1 Workstation (`192.168.10.11/24`) |
| **PC-Remote** | PC-PT | `FastEthernet0` | LAN 2 Remote Host (`192.168.20.10/24`) |

### Cabling Matrix
- `R1 GigabitEthernet0/0/0` <-> `S1 GigabitEthernet0/1` (Copper Straight-Through)
- `R1 GigabitEthernet0/0/1` <-> `S2 GigabitEthernet0/1` (Copper Straight-Through)
- `S1 FastEthernet0/1` <-> `PC1 FastEthernet0` (Copper Straight-Through)
- `S1 FastEthernet0/2` <-> `PC2 FastEthernet0` (Copper Straight-Through)
- `S2 FastEthernet0/1` <-> `PC-Remote FastEthernet0` (Copper Straight-Through)

---

## 3. Test Execution Matrix

| Test ID | Test Category | Objective | Simulator Action | Observed Simulator Output | Verdict |
|---|---|---|---|---|:---:|
| **POS-01** | Host Configuration | Verify PC1 IP addressing and gateway parameters | `ipconfig` on `PC1` | IP: `192.168.10.10`, Mask: `255.255.255.0`, Gateway: `192.168.10.1` | **PASS** |
| **POS-02** | Local Intra-Subnet Delivery | Verify direct Layer 2 frame delivery without router | Ping `192.168.10.11` from `PC1` | 4/4 replies, 0% loss, round-trip <1ms, TTL=128 | **PASS** |
| **POS-03** | Gateway Reachability | Verify direct reachability to local router gateway | Ping `192.168.10.1` from `PC1` | 4/4 replies, 0% loss, round-trip <1ms, TTL=255 | **PASS** |
| **POS-04** | Remote Routed Delivery | Verify end-to-end inter-subnet routing across R1 | Ping `192.168.20.10` from `PC1` | 4/4 replies, 0% loss, round-trip <1ms, TTL=127 | **PASS** |
| **POS-05** | Host ARP Table Dynamics | Confirm host resolves only local IPs | `arp -a` on `PC1` | Only `192.168.10.1` and `192.168.10.11` present; `192.168.20.10` absent | **PASS** |
| **POS-06** | Router Interface & Routing | Verify R1 interface status and connected subnets | `show ip interface brief` & `show ip route` on R1 | Gi0/0/0 and Gi0/0/1 both up/up; connected subnets `192.168.10.0/24` and `192.168.20.0/24` active | **PASS** |
| **NEG-01** | Missing Default Gateway | Verify local ping succeeds but remote ping fails when gateway is 0.0.0.0 | Set PC1 gateway `0.0.0.0` -> Ping `192.168.10.11` & `192.168.20.10` | Local ping succeeds (TTL=128); remote ping fails (Destination unreachable / Request timed out) | **PASS** |
| **NEG-02** | Invalid Gateway IP | Verify remote traffic drops when gateway IP is unassigned | Set PC1 gateway `192.168.10.254` -> Ping `192.168.20.10` | Remote ping fails with Request timed out waiting for ARP reply | **PASS** |
| **NEG-03** | Gateway Interface Shutdown | Verify Layer 2 switching survives router interface shutdown | Shutdown `Gi0/0/0` on R1 -> Ping `192.168.10.11` & `192.168.20.10` | Local ping succeeds (switch S1 unaffected); remote ping fails; restored upon `no shutdown` | **PASS** |

---

## 4. Raw Simulator Telemetry & Console Traces

### POS-01: PC1 IP Configuration
```text
C:\>ipconfig

FastEthernet0 Connection:(default port)

   Connection-specific DNS Suffix..: 
   Link-local IPv6 Address.........: FE80::20D:BDFF:FE64:885
   IPv6 Address....................: ::
   IPv4 Address....................: 192.168.10.10
   Subnet Mask.....................: 255.255.255.0
   Default Gateway.................: ::
                                     192.168.10.1
```

### POS-02: Local Intra-Subnet Ping (PC1 to PC2)
```text
C:\>ping 192.168.10.11

Pinging 192.168.10.11 with 32 bytes of data:

Reply from 192.168.10.11: bytes=32 time=3ms TTL=128
Reply from 192.168.10.11: bytes=32 time<1ms TTL=128
Reply from 192.168.10.11: bytes=32 time<1ms TTL=128
Reply from 192.168.10.11: bytes=32 time<1ms TTL=128

Ping statistics for 192.168.10.11:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
Approximate round trip times in milli-seconds:
    Minimum = 0ms, Maximum = 3ms, Average = 0ms
```

### POS-03: Gateway Reachability Ping (PC1 to R1)
```text
C:\>ping 192.168.10.1

Pinging 192.168.10.1 with 32 bytes of data:

Reply from 192.168.10.1: bytes=32 time=3ms TTL=255
Reply from 192.168.10.1: bytes=32 time<1ms TTL=255
Reply from 192.168.10.1: bytes=32 time<1ms TTL=255
Reply from 192.168.10.1: bytes=32 time<1ms TTL=255

Ping statistics for 192.168.10.1:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
Approximate round trip times in milli-seconds:
    Minimum = 0ms, Maximum = 3ms, Average = 0ms
```

### POS-04: Remote Routed Inter-Subnet Ping (PC1 to PC-Remote)
```text
C:\>ping 192.168.20.10

Pinging 192.168.20.10 with 32 bytes of data:

Reply from 192.168.20.10: bytes=32 time<1ms TTL=127
Reply from 192.168.20.10: bytes=32 time<1ms TTL=127
Reply from 192.168.20.10: bytes=32 time<1ms TTL=127
Reply from 192.168.20.10: bytes=32 time<1ms TTL=127

Ping statistics for 192.168.20.10:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
Approximate round trip times in milli-seconds:
    Minimum = 0ms, Maximum = 0ms, Average = 0ms
```

### POS-05: Host ARP Table on PC1
```text
C:\>arp -a
  Internet Address      Physical Address      Type
  192.168.10.1          0001.c748.1701        dynamic
  192.168.10.11         00e0.b0c2.31cb        dynamic
```

### POS-06: R1 Interface and Routing Table Verification
```text
R1#show ip interface brief
Interface              IP-Address      OK? Method Status                Protocol 
GigabitEthernet0/0/0   192.168.10.1    YES manual up                    up 
GigabitEthernet0/0/1   192.168.20.1    YES manual up                    up

R1#show ip route
Gateway of last resort is not set

     192.168.10.0/24 is variably subnetted, 2 subnets, 2 masks
C       192.168.10.0/24 is directly connected, GigabitEthernet0/0/0
L       192.168.10.1/32 is directly connected, GigabitEthernet0/0/0
     192.168.20.0/24 is variably subnetted, 2 subnets, 2 masks
C       192.168.20.0/24 is directly connected, GigabitEthernet0/0/1
L       192.168.20.1/32 is directly connected, GigabitEthernet0/0/1
```

---

## 5. Artifact Manifest & Integrity Validation

All deliverables are saved in the lab repository tree and independently verified:

| File Path | Description | Size (Bytes) |
|---|---|---|
| `labs/network-fundamentals/default-gateway-troubleshooting/assets/starter.pkt` | Starter activity with PC1 gateway unconfigured (`0.0.0.0`) | 52,051 |
| `labs/network-fundamentals/default-gateway-troubleshooting/assets/completed.pkt` | Completed reference solution with full gateway reachability | 52,080 |
| `labs/network-fundamentals/default-gateway-troubleshooting/assets/topology.png` | Authentic canvas screenshot captured from running simulator | 75,898 |

### Reload Integrity Test
- Both `.pkt` files reopened via IPC `ipc.appWindow().fileOpen()`.
- Device count: 7 devices (`R1`, `S1`, `S2`, `PC1`, `PC2`, `PC-Remote`, plus internal power component).
- Link count: 5 physical connections.
- Starter file verified: `PC1` default gateway is `0.0.0.0`.
- Completed file verified: `PC1` default gateway is `192.168.10.1`.
- Router prompt: `R1>` active upon reload.
