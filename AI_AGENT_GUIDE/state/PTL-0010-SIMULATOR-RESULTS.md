# Live Simulator Verification Report: PTL-0010

**Lab ID:** `PTL-0010`  
**Lab Title:** Router-on-a-Stick Inter-VLAN Routing  
**Category:** `routing`  
**Difficulty:** Intermediate  
**Date (UTC):** 2026-10-27  
**Simulator Version:** Cisco Packet Tracer 9.0.1.0038 (64-bit Windows)  
**Verification Method:** Live In-Simulator IPC Execution via Antigravity Packet Tracer MCP Bridge  
**Overall Verdict:** **VERIFIED PASS** (100% of Positive and Negative Tests Passed)

---

## 1. Executive Summary

This report documents the live verification and deliverable generation for **PTL-0010: Router-on-a-Stick Inter-VLAN Routing** inside an authentic running instance of Cisco Packet Tracer 9.0.1.

The inter-VLAN routing topology—incorporating a Cisco ISR 4321 router (`R1`), a Cisco Catalyst 2960 switch (`S1`), and two access PCs (`PC-Faculty` in VLAN 10 and `PC-Student` in VLAN 20)—was assembled and cabled via internal simulator IPC. The starter activity (`assets/starter.pkt`) was prepared with the switch VLANs and access ports configured, but with the router uplink unconfigured and parent interface shut down, isolating the two departmental subnets. The completed activity (`assets/completed.pkt`) was configured with an 802.1Q trunk on the switch uplink (`Gi0/1`), an unnumbered parent interface on the router (`Gi0/0/0`), and two logical subinterfaces (`Gi0/0/0.10` with `encapsulation dot1Q 10` and `Gi0/0/0.20` with `encapsulation dot1Q 20`) acting as the respective default gateways.

Live verification validated subinterface operational status, 802.1Q trunking state, connected routing entries, end-to-end routed ping reachability between workstations across VLANs, negative encapsulation tag mismatch isolation, and negative trunk port access-mode reversion. Both starter and completed project files were verified for clean reopening in Cisco Packet Tracer.

---

## 2. Live Simulator Environment & Topology

### Devices and Modules
| Device Name | Packet Tracer Model | Primary Interfaces | Role |
|---|---|---|---|
| **R1** | Cisco ISR 4321 | `Gi0/0/0`, `Gi0/0/0.10`, `Gi0/0/0.20` | Inter-VLAN Router (`192.168.10.1`, `192.168.20.1`) |
| **S1** | Catalyst 2960-24TT | `Gi0/1`, `Fa0/1`, `Fa0/11`, `VLAN 10`, `VLAN 20` | Access & Trunk Switch |
| **PC-Faculty** | PC-PT | `FastEthernet0` | Faculty Workstation (`192.168.10.10`) |
| **PC-Student** | PC-PT | `FastEthernet0` | Student Workstation (`192.168.20.10`) |

### Cabling Matrix
- `R1 GigabitEthernet0/0/0` <-> `S1 GigabitEthernet0/1` (Copper Straight-Through, 802.1Q Trunk)
- `S1 FastEthernet0/1` <-> `PC-Faculty FastEthernet0` (Copper Straight-Through, Access VLAN 10)
- `S1 FastEthernet0/11` <-> `PC-Student FastEthernet0` (Copper Straight-Through, Access VLAN 20)

### Addressing Plan
- **VLAN 10 (Faculty Subnet):** `192.168.10.0/24` (Gateway: `192.168.10.1` on `Gi0/0/0.10`)
- **VLAN 20 (Students Subnet):** `192.168.20.0/24` (Gateway: `192.168.20.1` on `Gi0/0/0.20`)
- **PC-Faculty:** `192.168.10.10/24`, Default Gateway: `192.168.10.1`
- **PC-Student:** `192.168.20.10/24`, Default Gateway: `192.168.20.1`

---

## 3. Test Execution Matrix

| Test ID | Test Category | Objective | Simulator Action | Observed Simulator Output | Verdict |
|---|---|---|---|---|:---:|
| **POS-01** | Subinterface Status | Verify physical parent and subinterfaces are active | `show ip interface brief` on R1 | `Gi0/0/0` unassigned `up/up`; `Gi0/0/0.10` (`192.168.10.1`) `up/up`; `Gi0/0/0.20` (`192.168.20.1`) `up/up` | **PASS** |
| **POS-01b** | Routing Table | Verify directly connected routes for both VLANs | `show ip route connected` on R1 | `C 192.168.10.0/24 via Gi0/0/0.10`, `C 192.168.20.0/24 via Gi0/0/0.20` installed | **PASS** |
| **POS-02** | 802.1Q Switch Trunk | Verify 802.1Q trunk active on switch uplink | `show interfaces trunk` on S1 | Port `Gig0/1` Mode `on`, Encapsulation `802.1q`, Status `trunking`, active VLANs `1,10,20` | **PASS** |
| **POS-03** | Inter-VLAN Traffic | Verify routed ICMP communication across VLANs | Ping `192.168.20.10` from `PC-Faculty` | 4 packets sent, 4 received, 0% loss, round-trip average 3ms, TTL=127 (1 router hop) | **PASS** |
| **NEG-01** | 802.1Q Tag Mismatch | Verify traffic drops when router subinterface tag mismatches | Change `Gi0/0/0.10` to `dot1Q 30` -> Ping `192.168.10.1` | Pings return `Request timed out.` (R1 drops frames with mismatched tag) | **PASS** |
| **NEG-02** | Trunk Mode Reversion | Verify inter-VLAN failure when trunk is set to access mode | S1 `Gi0/1` set to `switchport mode access` -> Ping `192.168.20.10` | Inter-VLAN frames dropped by switch; `show interfaces trunk` shows 0 active trunks | **PASS** |

---

## 4. Raw Simulator Telemetry & Console Traces

### POS-01: R1 Subinterface Operational Status
```text
R1#show ip interface brief
Interface              IP-Address      OK? Method Status                Protocol 
GigabitEthernet0/0/0   unassigned      YES unset  up                    up 
GigabitEthernet0/0/0.10192.168.10.1    YES manual up                    up 
GigabitEthernet0/0/0.20192.168.20.1    YES manual up                    up 
GigabitEthernet0/0/1   unassigned      YES unset  administratively down down
```

### POS-01b: R1 Connected Routing Table
```text
R1#show ip route connected
 C   192.168.10.0/24  is directly connected, GigabitEthernet0/0/0.10
 C   192.168.20.0/24  is directly connected, GigabitEthernet0/0/0.20
```

### POS-02: S1 802.1Q Trunking and VLAN Membership
```text
S1#show interfaces trunk
Port        Mode         Encapsulation  Status        Native vlan
Gig0/1      on           802.1q         trunking      1

Port        Vlans allowed on trunk
Gig0/1      1-1005

Port        Vlans allowed and active in management domain
Gig0/1      1,10,20

Port        Vlans in spanning tree forwarding state and not pruned
Gig0/1      1,10,20

S1#show vlan brief
VLAN Name                             Status    Ports
---- -------------------------------- --------- -------------------------------
1    default                          active    Fa0/2, Fa0/3, Fa0/4, Fa0/5
                                                Fa0/6, Fa0/7, Fa0/8, Fa0/9
                                                Fa0/10, Fa0/12, Fa0/13, Fa0/14
                                                Fa0/15, Fa0/16, Fa0/17, Fa0/18
                                                Fa0/19, Fa0/20, Fa0/21, Fa0/22
                                                Fa0/23, Fa0/24, Gig0/2
10   Faculty                          active    Fa0/1
20   Students                         active    Fa0/11
```

### POS-03: End-to-End Inter-VLAN Ping (PC-Faculty to PC-Student)
```text
C:\>ping 192.168.20.10

Pinging 192.168.20.10 with 32 bytes of data:

Reply from 192.168.20.10: bytes=32 time<1ms TTL=127
Reply from 192.168.20.10: bytes=32 time=8ms TTL=127
Reply from 192.168.20.10: bytes=32 time<1ms TTL=127
Reply from 192.168.20.10: bytes=32 time=6ms TTL=127

Ping statistics for 192.168.20.10:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
Approximate round trip times in milli-seconds:
    Minimum = 0ms, Maximum = 8ms, Average = 3ms
```
*(Notice: The TTL of 127 confirms that the packet was decremented by 1 when routed across Router R1's subinterfaces.)*

### NEG-01: Encapsulation Tag Mismatch Drop
```text
R1(config)#interface GigabitEthernet0/0/0.10
R1(config-subif)#encapsulation dot1Q 30
R1(config-subif)#end

C:\>ping 192.168.10.1

Pinging 192.168.10.1 with 32 bytes of data:

Request timed out.
Request timed out.
Request timed out.
Request timed out.

Ping statistics for 192.168.10.1:
    Packets: Sent = 4, Received = 0, Lost = 4 (100% loss)
```

### NEG-02: Trunk Port Reverted to Access Mode Drop
```text
S1(config)#interface GigabitEthernet0/1
S1(config-if)#switchport mode access
S1(config-if)#end

S1#show interfaces trunk
(No active trunk interfaces displayed)

C:\>ping 192.168.20.10

Pinging 192.168.20.10 with 32 bytes of data:

Request timed out.
Request timed out.
Request timed out.
Request timed out.

Ping statistics for 192.168.20.10:
    Packets: Sent = 4, Received = 0, Lost = 4 (100% loss)
```

---

## 5. Artifact Manifest & Integrity Validation

All deliverables are saved in the lab repository tree and independently verified:

| File Path | Description | Size (Bytes) | SHA-256 Checksum |
|---|---|---|---|
| `labs/routing/inter-vlan-routing-router-on-a-stick/assets/starter.pkt` | Starter activity with switch VLANs configured, router unconfigured | 57,192 | `6b1e7b9a70dda32edd336e215954f4e502c53913e38690a0ffa587a344a3b676` |
| `labs/routing/inter-vlan-routing-router-on-a-stick/assets/completed.pkt` | Completed reference solution with full ROAS subinterfaces and verified routing | 58,410 | `e214f739111269451dee0472a358151c57f3ebc5a53edadf0a4f3db4c2bc5681` |
| `labs/routing/inter-vlan-routing-router-on-a-stick/assets/topology.png` | Authentic canvas screenshot captured from running simulator | 46,608 | `3eeee8d2b7a733c31e29e3b2dc3f8c8956b9cff66780f30ca2fded24f5e678b5` |

### Reload Integrity Test
- Both files reopened via IPC `ipc.appWindow().fileOpen()`.
- Device count: 5 devices (`R1`, `S1`, `PC-Faculty`, `PC-Student`, plus 1 internal power module).
- Link count: 3 physical connections (1 trunk link, 2 access links).
- Router and switch prompts: `R1#` and `S1#` active upon reload.
