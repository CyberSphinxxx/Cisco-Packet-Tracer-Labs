# Simulator Verification Evidence: Small Office Multi-VLAN Network Capstone

**Project:** Capstone Project: Small Office Multi-VLAN Network Design  
**Directory:** `projects/small-office-network/`  
**Target Simulator:** Cisco Packet Tracer 9.0.1 (Build 9.0.1.0507)  
**Execution Mode:** Live in-app execution via MCP Loopback Bridge (`127.0.0.1:54321`)  
**Status:** `tested_pass`  
**Execution Timestamp:** 2026-10-27T04:44:00Z  

---

## 1. Executive Summary & Verification Scope

The Small Office Multi-VLAN Network Capstone Project was assembled, cabled, hardened, and verified live in Cisco Packet Tracer 9.0.1. This comprehensive capstone tests the synthesis of all modular curriculum competencies:
- **Layer 2 Hardening:** Catalyst 2960-24TT access switch `S1` configured with 802.1Q trunking to `R1`, native VLAN 999 isolation, DTP negotiation disabled (`switchport nonegotiate`), departmental VLANs (10, 20, 30, 99), STP PortFast and BPDU Guard on all access ports, and sticky MAC port security with shutdown violation on staff access ports.
- **Layer 3 Inter-VLAN Routing:** Cisco ISR 4321 router `R1` configured with Router-on-a-Stick dot1Q subinterfaces (`Gi0/0/0.10`, `Gi0/0/0.20`, `Gi0/0/0.30`) and WAN point-to-point transit link (`Gi0/0/1`).
- **Network Services Automation:** Dual Cisco IOS DHCP pools configured on `R1` (`STAFF_POOL` for VLAN 20 and `GUEST_POOL` for VLAN 30) with excluded address ranges (.1 - .10), default routers, and OpenDNS forwarders.
- **Perimeter Traffic Defense:** Extended named ACL `GUEST_ISOLATION_ACL` applied inbound on `Gi0/0/0.30` permitting outbound Internet access while strictly denying guest access to internal staff and management subnets.
- **Encrypted Administration:** SSHv2 enforced with 1024-bit RSA key modulus and local credential authentication across all network devices, with cleartext Telnet strictly locked out.
- **Simulated HQ / ISP Border:** Cisco ISR 4321 router `R2` preconfigured with WAN transit IP, Loopback0 corporate cloud service (`209.165.201.1/24`), and static reverse routing to the branch office network.

---

## 2. Authentic Packet Tracer Binary Deliverables

| Deliverable | File Path | File Size | SHA-256 Checksum | Verification Method |
|---|---|---|---|---|
| **Starter Activity** | `projects/small-office-network/assets/starter.pkt` | 65,968 B | `dae44e8670c6f1a7eae06ef0087fd617c9feff9cf3453f4fd636bb67cabc9347` | Assembled and saved in Packet Tracer 9.0.1; devices cabled, R2 & PC-Mgmt configured, R1 and S1 unconfigured |
| **Completed Activity** | `projects/small-office-network/assets/completed.pkt` | 70,599 B | `f7584096ccc462f3c4b87f6a5970b8f27f804151961f281523670313c35b0adb` | Full running configuration applied, `copy running startup`, reload verified |
| **Topology Screenshot** | `projects/small-office-network/assets/topology.png` | 48,377 B | `e0ed97477ae094e9c427b802bf64b729839155a0d1c3264dab050488b3ec4b15` | Window canvas capture from active workspace in Packet Tracer 9.0.1 |

---

## 3. Positive Acceptance Verification Test Ledger

| Test ID | Objective | Observed Simulator Output | Status |
|---|---|---|:---:|
| **POS-01** | **802.1Q Trunking & Subinterfaces** | `S1# show interfaces trunk`<br>`Port Gig0/1 Mode: on, Encapsulation: 802.1q, Status: trunking, Native vlan: 999`<br>`Port Gig0/1 Vlans allowed: 10,20,30`<br>`R1# show ip interface brief`<br>`GigabitEthernet0/0/0 unassigned up up`<br>`GigabitEthernet0/0/0.10 192.168.10.1 up up`<br>`GigabitEthernet0/0/0.20 192.168.20.1 up up`<br>`GigabitEthernet0/0/0.30 192.168.30.1 up up`<br>`GigabitEthernet0/0/1 209.165.200.225 up up` | **PASS** |
| **POS-02** | **Staff Workstation DHCP Acquisition** | `PC-Staff> ipconfig`<br>`FastEthernet0 Connection: apex.local`<br>`IPv4 Address: 192.168.20.11`<br>`Subnet Mask: 255.255.255.0`<br>`Default Gateway: 192.168.20.1` | **PASS** |
| **POS-03** | **Guest Workstation DHCP Acquisition** | `PC-Guest> ipconfig`<br>`FastEthernet0 Connection: guest.apex.local`<br>`IPv4 Address: 192.168.30.11`<br>`Subnet Mask: 255.255.255.0`<br>`Default Gateway: 192.168.30.1` | **PASS** |
| **POS-04** | **Inter-VLAN Routing (Staff to Mgmt)** | `PC-Staff> ping 192.168.10.10`<br>`Reply from 192.168.10.10: bytes=32 time=1ms TTL=127`<br>`Ping statistics: Sent = 4, Received = 4, Lost = 0 (0% loss)` | **PASS** |
| **POS-05** | **WAN & HQ Internet Reachability** | `PC-Staff> ping 209.165.201.1`<br>`Reply from 209.165.201.1: bytes=32 time=1ms TTL=254`<br>`PC-Guest> ping 209.165.201.1`<br>`Reply from 209.165.201.1: bytes=32 time=1ms TTL=254` | **PASS** |
| **POS-06** | **Port Security Sticky MAC Binding** | `S1# show port-security interface FastEthernet0/6`<br>`Port Security: Enabled, Port Status: Secure-up`<br>`Violation Mode: Shutdown, Maximum MAC Addresses: 1`<br>`Sticky MAC Addresses: 1, Last Source Address:Vlan: 00D0.BA78.3D6C:20` | **PASS** |
| **POS-07** | **In-Band Encrypted SSH Management** | `PC-Mgmt> ssh -l admin 192.168.10.1`<br>`Password: adminpass123`<br>`Apex Innovations Branch Gateway - Authorized Admin Access Only`<br>`R1#`<br>`PC-Mgmt> ssh -l admin 192.168.10.2`<br>`Password: adminpass123`<br>`Apex Innovations Branch Access Switch S1 - Authorized Access Only`<br>`S1#` | **PASS** |

---

## 4. Negative & Security Policy Denial Test Ledger

| Test ID | Policy Rule | Observed Simulator Output | Status |
|---|---|---|:---:|
| **NEG-01** | **Guest Isolation from Internal Staff** | `PC-Guest> ping 192.168.20.11`<br>`Reply from 192.168.30.1: Destination host unreachable.`<br>`Ping statistics: Sent = 4, Received = 0, Lost = 4 (100% loss)` | **PASS** |
| **NEG-02** | **Guest Isolation from Management** | `PC-Guest> ping 192.168.10.10`<br>`Reply from 192.168.30.1: Destination host unreachable.`<br>`R1# show access-lists GUEST_ISOLATION_ACL`<br>`Extended IP access list GUEST_ISOLATION_ACL`<br>`10 deny ip 192.168.30.0 0.0.0.255 192.168.10.0 0.0.0.255 (8 matches)`<br>`20 deny ip 192.168.30.0 0.0.0.255 192.168.20.0 0.0.0.255 (8 matches)`<br>`30 permit ip 192.168.30.0 0.0.0.255 any (8 matches)` | **PASS** |
| **NEG-03** | **Port Security Rogue Laptop Violation & Recovery** | Swap `PC-Staff` on Fa0/6 with `Rogue-Laptop`. From Rogue-Laptop: `ping 192.168.20.1`.<br>`S1 console: %PM-4-ERR_DISABLE: psecure-violation error detected on Fa0/6, putting Fa0/6 in err-disable state`<br>`%PORT_SECURITY-2-PSECURE_VIOLATION: Security violation occurred, caused by MAC 0004.9A6A.AB81 on port Fa0/6.`<br>`Port Status: Secure-shutdown`<br>Unplug rogue host, reconnect PC-Staff, bounce port (`shutdown`/`no shutdown`):<br>`PC-Staff> ping 192.168.20.1`<br>`Reply from 192.168.20.1: bytes=32 time=1ms TTL=255 (100% pass)` | **PASS** |
| **NEG-04** | **Unencrypted Telnet Lockdown** | `PC-Mgmt> telnet 192.168.10.1`<br>`Trying 192.168.10.1 ... [Connection to 192.168.10.1 closed by foreign host]`<br>`PC-Mgmt> telnet 192.168.10.2`<br>`Trying 192.168.10.2 ... [Connection to 192.168.10.2 closed by foreign host]` | **PASS** |

---

## 5. Persistence & Reload Verification Check

1. `copy running-config startup-config` executed on `R1`, `R2`, and `S1`.
2. `completed.pkt` reloaded cleanly in Cisco Packet Tracer 9.0.1 via IPC `fileOpen`.
3. Device count after reload: 7 active topology devices.
4. All VLANs, subinterfaces, DHCP pools, sticky MAC bindings, and ACL hit counters persistent across simulator reload.

**Final Capstone Project Verification Verdict: TESTED_PASS**
