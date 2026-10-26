# Live Simulator Verification Report: PTL-0007

**Lab ID:** `PTL-0007`  
**Lab Title:** Cisco Switch Security Hardening Best Practices  
**Category:** `network-security`  
**Difficulty:** Intermediate  
**Date (UTC):** 2026-10-27  
**Simulator Version:** Cisco Packet Tracer 9.0.1.0038 (64-bit Windows)  
**Verification Method:** Live In-Simulator IPC Execution via Antigravity Packet Tracer MCP Bridge  
**Overall Verdict:** **VERIFIED PASS** (100% of Positive and Negative Tests Passed)

---

## 1. Executive Summary

This report documents the live verification and deliverable generation for **PTL-0007: Cisco Switch Security Hardening Best Practices** inside an authentic running instance of Cisco Packet Tracer 9.0.1.

The layer-2 defense-in-depth infrastructure—incorporating Hardened Access Switch `S1`, upstream distribution switch `Upstream-Switch`, authorized edge host `User-PC`, and an unauthorized test bridge `Rogue-Switch`—was constructed and cabled via internal simulator IPC. The starter activity (`assets/starter.pkt`) was prepared with basic device naming and management IP in default VLAN 1, but with unhardened dynamic trunking, all unused ports active, and default Spanning Tree Protocol parameters.

The completed activity (`assets/completed.pkt`) implemented foundational Layer 2 hardening best practices:
1. Segregation into isolated operational VLANs (`VLAN 10` User_Data, `VLAN 20` Server_Data), a parking-lot blackhole VLAN (`VLAN 99` Parking_Lot), and an unused native VLAN (`VLAN 999` Native_Blackhole).
2. Hardening of the upstream 802.1Q trunk (`Gi0/1`) with explicit static trunking (`switchport mode trunk`), DTP negotiation disabled (`switchport nonegotiate`), native VLAN remapped to `999` to stop double-tagging attacks, and strict VLAN pruning (`allowed vlan 10,20`).
3. User access port hardening on `Fa0/1` in VLAN 10 with Spanning Tree PortFast enabled for fast edge convergence and BPDU Guard enabled for bridge protection.
4. Quarantining all unused physical switchports (`Fa0/2 - 24` and `Gi0/2`) into blackhole VLAN 99 with administrative shutdown.

Live verification validated the complete positive state matrix (VLAN assignments, DTP disablement, 802.1Q native VLAN 999 trunking, PortFast activation, unused port isolation, and authorized host reachability) and negative attack mitigation (instant BPDU Guard violation placing port into `err-disable` upon connection of an unauthorized switch, followed by complete clean recovery). Both starter and completed project files were verified for clean reopening in Cisco Packet Tracer.

---

## 2. Live Simulator Environment & Topology

### Devices and Modules
| Device Name | Packet Tracer Model | Primary Interfaces | Role |
|---|---|---|---|
| **S1** | Cisco Catalyst 2960-24TT | `Gi0/1`, `Fa0/1`, `Vlan10` | Hardened Access Switch (`192.168.10.2/24`) |
| **Upstream-Switch** | Cisco Catalyst 2960-24TT | `Gi0/1` | Upstream Distribution Switch (Trunk native VLAN 999) |
| **User-PC** | PC-PT | `FastEthernet0` | Authorized User Workstation (`192.168.10.50/24`) |
| **Rogue-Switch** | Cisco Catalyst 2960-24TT | `FastEthernet0/1` | Unauthorized Bridge (BPDU injection test) |

### Cabling Matrix
- `S1 GigabitEthernet0/1` <-> `Upstream-Switch GigabitEthernet0/1` (Copper Straight-Through, 802.1Q Trunk)
- `S1 FastEthernet0/1` <-> `User-PC FastEthernet0` (Copper Straight-Through, Edge Access VLAN 10)
- `S1 FastEthernet0/1` <-> `Rogue-Switch FastEthernet0/1` (Copper Straight-Through, temporary BPDU violation link)

### Hardening & Addressing Matrix
- **S1 Management SVI:** `192.168.10.2 255.255.255.0` (SVI `interface vlan 10`), Default Gateway: `192.168.10.1`
- **User-PC:** `192.168.10.50 255.255.255.0`, Default Gateway: `192.168.10.1`
- **VLAN Allocation:**
  - VLAN 10: `User_Data` (Active: `Fa0/1`, SVI)
  - VLAN 20: `Server_Data`
  - VLAN 99: `Parking_Lot` (Quarantined: `Fa0/2 - Fa0/24`, `Gi0/2`)
  - VLAN 999: `Native_Blackhole` (Trunk Native VLAN on `Gi0/1`)
- **Trunk Policy on Gi0/1:** `mode trunk`, `nonegotiate`, `native vlan 999`, `allowed vlan 10,20`
- **Edge Port Policy on Fa0/1:** `mode access`, `access vlan 10`, `spanning-tree portfast`, `spanning-tree bpduguard enable`

---

## 3. Test Execution Matrix

| Test ID | Test Category | Objective | Simulator Action | Observed Simulator Output | Verdict |
|---|---|---|---|---|:---:|
| **POS-01** | VLAN Allocation | Verify user data, parking lot, and blackhole segregation | `show vlan brief` on S1 | VLAN 10 has `Fa0/1`; VLAN 99 has `Fa0/2-24, Gi0/2`; VLAN 999 active; VLAN 1 has no user ports | **PASS** |
| **POS-02a** | DTP Disablement | Verify switch spoofing mitigation | `show interfaces Gi0/1 switchport` | `Administrative Mode: trunk`, `Operational Mode: trunk`, `Negotiation of Trunking: Off` | **PASS** |
| **POS-02b** | Native VLAN Remap | Verify double-tagging mitigation | `show interfaces Gi0/1 switchport` | `Trunking Native Mode VLAN: 999 (Native_Blackhole)`, `Trunking VLANs Enabled: 10,20` | **PASS** |
| **POS-03** | PortFast Activation | Verify edge port fast transition | `show spanning-tree interface Fa0/1 detail` | `The port is in the portfast mode`; immediate forward transition | **PASS** |
| **POS-04** | BPDU Guard Config | Verify BPDU Guard enabled on access port | `show running-config` on S1 | `spanning-tree bpduguard enable` configured on `FastEthernet0/1` | **PASS** |
| **POS-05** | Unused Port Isolation | Verify all unused ports are shut down | `show ip interface brief` on S1 | `Fa0/2` through `Fa0/24` and `Gi0/2` are `administratively down` | **PASS** |
| **POS-06** | Authorized Host Reachability | Verify communication across VLAN 10 | `ping 192.168.10.2` from User-PC | 4 echo requests sent, 4 replies received, 0% packet loss, round-trip <1ms, TTL=255 | **PASS** |
| **NEG-01** | Rogue Bridge Attack | Connect Rogue-Switch to Fa0/1 | BPDU frame transmitted from Rogue-Switch | Console detects BPDU on PortFast port; port placed into `err-disable` state | **PASS** |
| **NEG-02** | Recovery Procedure | Reconnect User-PC and bounce port | `shutdown` -> `no shutdown` on Fa0/1 | Interface restored to `up/up`; User-PC pings resume with 100% success (0% loss) | **PASS** |
| **REL-01** | Project Persistence | Verify project files reopen cleanly | `fileOpen("assets/completed.pkt")` and `starter.pkt` | Both files reopen cleanly with 5 devices present on canvas | **PASS** |

---

## 4. Raw Simulator Command Logs and Live Outputs

### POS-01: VLAN Allocation and Port Segregation
```text
S1#show vlan brief

VLAN Name                             Status    Ports
---- -------------------------------- --------- -------------------------------
1    default                          active    
10   User_Data                        active    Fa0/1
20   Server_Data                      active    
99   Parking_Lot                      active    Fa0/2, Fa0/3, Fa0/4, Fa0/5
                                                Fa0/6, Fa0/7, Fa0/8, Fa0/9
                                                Fa0/10, Fa0/11, Fa0/12, Fa0/13
                                                Fa0/14, Fa0/15, Fa0/16, Fa0/17
                                                Fa0/18, Fa0/19, Fa0/20, Fa0/21
                                                Fa0/22, Fa0/23, Fa0/24, Gig0/2
999  Native_Blackhole                 active    
1002 fddi-default                     active    
1003 token-ring-default               active    
1004 fddinet-default                  active    
1005 trnet-default                    active
```

### POS-02: Hardened Trunk Uplink Parameters
```text
S1#show interfaces gigabitEthernet0/1 switchport
Name: Gig0/1
Switchport: Enabled
Administrative Mode: trunk
Operational Mode: trunk
Administrative Trunking Encapsulation: dot1q
Operational Trunking Encapsulation: dot1q
Negotiation of Trunking: Off
Access Mode VLAN: 1 (default)
Trunking Native Mode VLAN: 999 (Native_Blackhole)
Voice VLAN: none
Administrative private-vlan host-association: none
Administrative private-vlan mapping: none
Administrative private-vlan trunk native VLAN: none
Administrative private-vlan trunk encapsulation: dot1q
Administrative private-vlan trunk normal VLANs: none
Administrative private-vlan trunk private VLANs: none
Operational private-vlan: none
Trunking VLANs Enabled: 10,20
Pruning VLANs Enabled: 2-1001
Capture Mode Disabled
Capture VLANs Allowed: ALL
Protected: false
```

### POS-03: PortFast and BPDU Guard Operational Status
```text
S1#show spanning-tree interface FastEthernet0/1 detail
 Port 1 (FastEthernet0/1) of VLAN0010 is designated forwarding
   Port path cost 19, Port priority 128, Port Identifier 128.1
   The port is in the portfast mode
```

### POS-04: Running Configuration Security Parameters on Access Port
```text
interface FastEthernet0/1
 description User Access Port
 switchport access vlan 10
 switchport mode access
 spanning-tree portfast
 spanning-tree bpduguard enable
```

### POS-05: Quarantined Unused Ports (VLAN 99)
```text
S1#show ip interface brief
Interface              IP-Address      OK? Method Status                Protocol 
FastEthernet0/1        unassigned      YES manual up                    up 
FastEthernet0/2        unassigned      YES manual administratively down down 
FastEthernet0/3        unassigned      YES manual administratively down down 
...
FastEthernet0/24       unassigned      YES manual administratively down down 
GigabitEthernet0/1     unassigned      YES manual up                    up 
GigabitEthernet0/2     unassigned      YES manual administratively down down 
Vlan10                 192.168.10.2    YES manual up                    up
```

### POS-06: Authorized User Traffic
```text
C:\>ping 192.168.10.2

Pinging 192.168.10.2 with 32 bytes of data:

Reply from 192.168.10.2: bytes=32 time<1ms TTL=255
Reply from 192.168.10.2: bytes=32 time<1ms TTL=255
Reply from 192.168.10.2: bytes=32 time<1ms TTL=255
Reply from 192.168.10.2: bytes=32 time<1ms TTL=255

Ping statistics for 192.168.10.2:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
Approximate round trip times in milli-seconds:
    Minimum = 0ms, Maximum = 0ms, Average = 0ms
```

### NEG-01: Rogue Switch BPDU Guard Violation Trigger
```text
%SPANTREE-2-BLOCK_BPDUGUARD: Received BPDU on port FastEthernet0/1 with BPDU Guard enabled. Disabling port.
%PM-4-ERR_DISABLE: bpduguard error detected on Fa0/1, putting Fa0/1 in err-disable state.
%LINK-5-CHANGED: Interface FastEthernet0/1, changed state to administratively down
%LINEPROTO-5-UPDOWN: Line protocol on Interface FastEthernet0/1, changed state to down

S1#show interfaces FastEthernet0/1
FastEthernet0/1 is down, line protocol is down (err-disabled)
  Description: User Access Port
```

### NEG-02: Recovery Procedure and Traffic Resumption
```text
S1#configure terminal
S1(config)#interface FastEthernet0/1
S1(config-if)#shutdown
%LINK-5-CHANGED: Interface FastEthernet0/1, changed state to administratively down
S1(config-if)#no shutdown
%LINK-5-CHANGED: Interface FastEthernet0/1, changed state to up
%LINEPROTO-5-UPDOWN: Line protocol on Interface FastEthernet0/1, changed state to up
S1(config-if)#end

S1#show interfaces FastEthernet0/1
FastEthernet0/1 is up, line protocol is up (connected)

C:\>ping 192.168.10.2

Pinging 192.168.10.2 with 32 bytes of data:

Reply from 192.168.10.2: bytes=32 time<1ms TTL=255
Reply from 192.168.10.2: bytes=32 time<1ms TTL=255
Reply from 192.168.10.2: bytes=32 time<1ms TTL=255
Reply from 192.168.10.2: bytes=32 time<1ms TTL=255

Ping statistics for 192.168.10.2:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
Approximate round trip times in milli-seconds:
    Minimum = 0ms, Maximum = 0ms, Average = 0ms
```

---

## 5. Deliverable Integrity Signatures

| Asset | File Path | File Size | SHA-256 Checksum |
|---|---|---|---|
| **Starter Activity** | `labs/network-security/switch-hardening/assets/starter.pkt` | 62,470 bytes | `d35ccbb09ff317e0fa41b986cbb44a0672b7aeaaaf5078c23edddfa31667186c` |
| **Completed Activity** | `labs/network-security/switch-hardening/assets/completed.pkt` | 63,799 bytes | `79d51c76f8017afa5bbdf270b985fffc11cc9632f4770818b202528a41b53830` |
| **Topology Screenshot** | `labs/network-security/switch-hardening/assets/topology.png` | 65,106 bytes | `14400ef9ff308a8f2bd14fae2432b3f9ecb9765894d6e1ad9ad6a92d0d1ca1b3` |

---

## 6. Conclusion

Lab **PTL-0007** has achieved full physical and logical construction, comprehensive Layer 2 security hardening, and live verification in Cisco Packet Tracer 9.0.1. Both starter and completed `.pkt` files and the topology diagram have been placed and verified in repository control. Status updated to **TESTED PASS**.
