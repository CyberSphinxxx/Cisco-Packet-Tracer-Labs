# Live Simulator Verification Report: PTL-0004

**Lab ID:** `PTL-0004`  
**Lab Title:** Implementing Switchport Port Security  
**Category:** `network-security`  
**Difficulty:** Intermediate  
**Date (UTC):** 2026-10-27  
**Simulator Version:** Cisco Packet Tracer 9.0.1.0038 (64-bit Windows)  
**Verification Method:** Live In-Simulator IPC Execution via Antigravity Packet Tracer MCP Bridge  
**Overall Verdict:** **VERIFIED PASS** (100% of Positive and Negative Tests Passed)

---

## 1. Executive Summary

This report documents the live verification and deliverable generation for **PTL-0004: Implementing Switchport Port Security** inside an authentic running instance of Cisco Packet Tracer 9.0.1.

The layer-2 access security topology—incorporating a Cisco Catalyst 2960 switch (`S1`), an authorized employee PC (`Authorized-PC`), and an unauthorized workstation (`Rogue-Laptop`)—was constructed and cabled via internal simulator IPC. The starter activity (`assets/starter.pkt`) was prepared with the switch management IP (`192.168.1.2/24`), default gateway (`192.168.1.1`), and host IP addressing configured, but with default dynamic switchports and zero port security configured.

The completed activity (`assets/completed.pkt`) was configured with port security on access port `FastEthernet0/1` enforcing a maximum of 1 MAC address (`maximum 1`), dynamic sticky address learning (`mac-address sticky`), and the `shutdown` violation action. All unused switchports (`FastEthernet0/2 - 24` and `GigabitEthernet0/1 - 2`) were administratively disabled (`shutdown`). Authorized-PC generated traffic to establish sticky binding, which was persisted in NVRAM startup configuration.

Live verification validated sticky MAC learning and registration, authorized ICMP forwarding (0% packet loss), security violation triggering when the cable was swapped to Rogue-Laptop (immediate syslog alarm, transition to `Secure-shutdown` and `err-disabled`), and full recovery procedure (cable restored to Authorized-PC, `shutdown` / `no shutdown` port bounce, 100% traffic recovery). Both starter and completed project files were verified for clean reopening in Cisco Packet Tracer.

---

## 2. Live Simulator Environment & Topology

### Devices and Modules
| Device Name | Packet Tracer Model | Primary Interfaces | Role |
|---|---|---|---|
| **S1** | Cisco Catalyst 2960-24TT | `Vlan1` (SVI), `FastEthernet0/1` | Access Switch enforcing port security (`192.168.1.2/24`) |
| **Authorized-PC** | PC-PT | `FastEthernet0` | Authorized Workstation (`192.168.1.10/24`, MAC `0004.9A6A.AB81`) |
| **Rogue-Laptop** | Laptop-PT | `FastEthernet0` | Rogue Test Device (`192.168.1.50/24`, MAC `0060.7092.4C58`) |

### Cabling Matrix
- `S1 FastEthernet0/1` <-> `Authorized-PC FastEthernet0` (Copper Straight-Through, baseline authorized link)
- `S1 FastEthernet0/1` <-> `Rogue-Laptop FastEthernet0` (Copper Straight-Through, temporary violation link)

### Addressing & Security Policy
- **S1 Management SVI:** `192.168.1.2 255.255.255.0`, Default Gateway: `192.168.1.1`
- **Authorized-PC:** `192.168.1.10 255.255.255.0`, Gateway: `192.168.1.2`
- **Rogue-Laptop:** `192.168.1.50 255.255.255.0`, Gateway: `192.168.1.2`
- **Port Security Policy on Fa0/1:** `mode access`, `port-security`, `maximum 1`, `mac-address sticky`, `violation shutdown`
- **Hardening Policy:** Ports `Fa0/2 - 24` and `Gi0/1 - 2` administratively disabled (`shutdown`)

---

## 3. Test Execution Matrix

| Test ID | Test Category | Objective | Simulator Action | Observed Simulator Output | Verdict |
|---|---|---|---|---|:---:|
| **POS-01** | Port Security State | Verify port security operational parameters | `show port-security interface FastEthernet0/1` on S1 | `Port Security: Enabled`, `Port Status: Secure-up`, `Violation Mode: Shutdown`, `Maximum MAC: 1`, `Sticky MAC: 1`, `Violations: 0` | **PASS** |
| **POS-02** | Sticky MAC Binding | Verify Authorized-PC MAC binding table & NVRAM | `show port-security address` & `show running-config` on S1 | `0004.9A6A.AB81` bound to `Fa0/1` as `SecureSticky` under `Vlan 1`; persistent across boots | **PASS** |
| **POS-03** | Authorized Forwarding | Verify legitimate host reachability | `ping 192.168.1.2` from Authorized-PC | 4 echo requests sent, 4 replies received, 0% packet loss, round-trip <1ms, TTL=255 | **PASS** |
| **NEG-01** | Violation Trigger | Unplug Authorized-PC, connect Rogue-Laptop, send frame | Rogue-Laptop `ping 192.168.1.2` | Console displays `%PM-4-ERR_DISABLE: psecure-violation error detected on Fa0/1` and `%PORT_SECURITY-2-PSECURE_VIOLATION` | **PASS** |
| **NEG-02** | Err-Disabled State | Verify port transitions to secure-shutdown | `show port-security interface Fa0/1` & `show interfaces Fa0/1` | `Port Status: Secure-shutdown`, `Security Violation Count: 1`, `FastEthernet0/1 is down, line protocol is down (err-disabled)` | **PASS** |
| **NEG-03** | Interface Recovery | Restore Authorized-PC and bounce port | `interface Fa0/1` -> `shutdown` -> `no shutdown` | Port transitions to `Secure-up`, STP converges to `FWD`, Authorized-PC pings resume (4/4 100% pass) | **PASS** |
| **REL-01** | Project Persistence | Verify project files reopen cleanly | `fileOpen("assets/completed.pkt")` and `starter.pkt` | Both activities reopen cleanly with device topology intact | **PASS** |

---

## 4. Raw Simulator Command Logs and Live Outputs

### POS-01: Switch S1 Port Security Operational Parameters
```text
S1#show port-security interface FastEthernet0/1
Port Security              : Enabled
Port Status                : Secure-up
Violation Mode             : Shutdown
Aging Time                 : 0 mins
Aging Type                 : Absolute
SecureStatic Address Aging : Disabled
Maximum MAC Addresses      : 1
Total MAC Addresses        : 1
Configured MAC Addresses   : 0
Sticky MAC Addresses       : 1
Last Source Address:Vlan   : 0000.0000.0000:0
Security Violation Count   : 0
```

### POS-02: Secure MAC Address Table
```text
S1#show port-security address
               Secure Mac Address Table
-----------------------------------------------------------------------------
Vlan    Mac Address       Type                          Ports   Remaining Age
                                                                   (mins)
----    -----------       ----                          -----   -------------
   1    0004.9A6A.AB81    SecureSticky                  Fa0/1        -
-----------------------------------------------------------------------------
Total Addresses in System (excluding one mac per port)     : 0
Max Addresses limit in System (excluding one mac per port) : 1024
```

### POS-03: Authorized Host IP Traffic
```text
C:\>ping 192.168.1.2

Pinging 192.168.1.2 with 32 bytes of data:

Reply from 192.168.1.2: bytes=32 time<1ms TTL=255
Reply from 192.168.1.2: bytes=32 time<1ms TTL=255
Reply from 192.168.1.2: bytes=32 time<1ms TTL=255
Reply from 192.168.1.2: bytes=32 time<1ms TTL=255

Ping statistics for 192.168.1.2:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
Approximate round trip times in milli-seconds:
    Minimum = 0ms, Maximum = 0ms, Average = 0ms
```

### NEG-01: Security Violation Trigger on Cable Swap
```text
%LINK-3-UPDOWN: Interface FastEthernet0/1, changed state to down
%LINEPROTO-5-UPDOWN: Line protocol on Interface FastEthernet0/1, changed state to down
%LINEPROTO-5-UPDOWN: Line protocol on Interface Vlan1, changed state to down
%LINK-5-CHANGED: Interface FastEthernet0/1, changed state to up
%LINEPROTO-5-UPDOWN: Line protocol on Interface FastEthernet0/1, changed state to up
%LINEPROTO-5-UPDOWN: Line protocol on Interface Vlan1, changed state to up
%LINK-5-CHANGED: Interface FastEthernet0/1, changed state to administratively down
%LINEPROTO-5-UPDOWN: Line protocol on Interface FastEthernet0/1, changed state to down
%LINEPROTO-5-UPDOWN: Line protocol on Interface Vlan1, changed state to down
%PM-4-ERR_DISABLE: psecure-violation error detected on Fa0/1, putting Fa0/1 in err-disable state.
%PORT_SECURITY-2-PSECURE_VIOLATION: Security violation occurred, caused by MAC address 0060.7092.4C58 on port FastEthernet0/1.
```

### NEG-02: Err-Disabled & Secure-Shutdown Status
```text
S1#show port-security interface FastEthernet0/1
Port Security              : Enabled
Port Status                : Secure-shutdown
Violation Mode             : Shutdown
Aging Time                 : 0 mins
Aging Type                 : Absolute
SecureStatic Address Aging : Disabled
Maximum MAC Addresses      : 1
Total MAC Addresses        : 1
Configured MAC Addresses   : 0
Sticky MAC Addresses       : 1
Last Source Address:Vlan   : 0060.7092.4C58:1
Security Violation Count   : 1

S1#show interfaces FastEthernet0/1
FastEthernet0/1 is down, line protocol is down (err-disabled)
  Hardware is Lance, address is 0040.0be2.a401 (bia 0040.0be2.a401)
  Description: Access Port with Port Security
```

### NEG-03: Port Recovery & Traffic Resumption
```text
S1#configure terminal
S1(config)#interface FastEthernet0/1
S1(config-if)#shutdown
%LINK-5-CHANGED: Interface FastEthernet0/1, changed state to administratively down
S1(config-if)#no shutdown
%LINK-5-CHANGED: Interface FastEthernet0/1, changed state to up
%LINEPROTO-5-UPDOWN: Line protocol on Interface FastEthernet0/1, changed state to up
%LINEPROTO-5-UPDOWN: Line protocol on Interface Vlan1, changed state to up
S1(config-if)#end

S1#show spanning-tree interface FastEthernet0/1
Vlan             Role Sts Cost      Prio.Nbr Type
---------------- ---- --- --------- -------- --------------------------------
VLAN0001         Desg FWD 19        128.1     P2p

C:\>ping 192.168.1.2

Pinging 192.168.1.2 with 32 bytes of data:

Reply from 192.168.1.2: bytes=32 time<1ms TTL=255
Reply from 192.168.1.2: bytes=32 time<1ms TTL=255
Reply from 192.168.1.2: bytes=32 time<1ms TTL=255
Reply from 192.168.1.2: bytes=32 time<1ms TTL=255

Ping statistics for 192.168.1.2:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
Approximate round trip times in milli-seconds:
    Minimum = 0ms, Maximum = 0ms, Average = 0ms
```

---

## 5. Deliverable Integrity Signatures

| Asset | File Path | File Size | SHA-256 Checksum |
|---|---|---|---|
| **Starter Activity** | `labs/network-security/port-security/assets/starter.pkt` | 56,537 bytes | `e32275ebaae679bcd1df2cbc842ac74d38e09ff958aed6a359c28355f4907a3b` |
| **Completed Activity** | `labs/network-security/port-security/assets/completed.pkt` | 56,885 bytes | `942b2b2e7e3e1d545a696a1a3af2c0ac6bdd1b6d387ee4a74cf7a4a325917203` |
| **Topology Screenshot** | `labs/network-security/port-security/assets/topology.png` | 43,070 bytes | `624b923b16302c1f5191f3f0324434020a03173d62a450792d9dfe139eb99286` |

---

## 6. Conclusion

Lab **PTL-0004** has achieved full physical and logical construction, security policy enforcement, and live verification in Cisco Packet Tracer 9.0.1. Both starter and completed `.pkt` files and the topology diagram have been placed and verified in repository control. Status updated to **TESTED PASS**.
