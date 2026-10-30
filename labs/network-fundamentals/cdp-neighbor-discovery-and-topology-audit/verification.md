# Verification Guide: PTL-0024 CDP Neighbor Discovery and Topology Audit

This document details the complete positive and negative testing matrix for **PTL-0024**, executed and verified inside Cisco Packet Tracer 9.0.1.

---

## 1. Positive Verification (POS)

### POS-01: Multi-Neighbor Discovery on Distribution Switch S1
On `S1`:

```cisco
S1#show cdp neighbors
Capability Codes: R - Router, T - Trans Bridge, B - Source Route Bridge
                  S - Switch, H - Host, I - IGMP, r - Repeater, P - Phone
Device ID    Local Intrfce   Holdtme    Capability   Platform    Port ID
R1           Gig 0/1          166            R       ISR4300     Gig 0/0/0
S2           Fas 0/1          145            S       2960        Fas 0/1
S3           Fas 0/2          165            S       2960        Fas 0/1
```
- **Verification criteria:** `S1` detects all three directly connected neighbors (`R1`, `S2`, `S3`) with corresponding interface mappings.

---

### POS-02: Detailed TLV Inspection on Core Router R1
On `R1`:

```cisco
R1#show cdp neighbors detail

Device ID: S1
Entry address(es): 
  IP address : 192.168.1.2
Platform: cisco 2960, Capabilities: Switch
Interface: GigabitEthernet0/0/0, Port ID (outgoing port): GigabitEthernet0/1
Holdtime: 121

Version :
Cisco IOS Software, C2960 Software (C2960-LANBASE-M), Version 12.2(25)FX, RELEASE SOFTWARE (fc1)
Copyright (c) 1986-2005 by Cisco Systems, Inc.
Compiled Wed 12-Oct-05 22:05 by pt_team

advertisement version: 2
Duplex: full
```
- **Verification criteria:** Full TLV payload displayed, including neighbor IP address (`192.168.1.2`), hardware platform (`cisco 2960`), operating system release, and full-duplex status.

---

### POS-03: Single Entry Query on Access Switch S2
On `S2`:

```cisco
S2#show cdp entry S1

Device ID: S1
Entry address(es): 
  IP address : 192.168.1.2
Platform: cisco 2960, Capabilities: Switch
Interface: FastEthernet0/1, Port ID (outgoing port): FastEthernet0/1
Holdtime: 178

Version :
Cisco IOS Software, C2960 Software (C2960-LANBASE-M), Version 12.2(25)FX, RELEASE SOFTWARE (fc1)
Copyright (c) 1986-2005 by Cisco Systems, Inc.
Compiled Wed 12-Oct-05 22:05 by pt_team

advertisement version: 2
Duplex: full
```
- **Verification criteria:** Specific lookup for `S1` returns accurate single-record output.

---

### POS-04: Protocol Timers & Interface Audit on R1
On `R1`:

```cisco
R1#show cdp
Global CDP information:
    Sending CDP packets every 60 seconds
    Sending a holdtime value of 180 seconds
    Sending CDPv2 advertisements is enabled

R1#show cdp interface GigabitEthernet0/0/0
GigabitEthernet0/0/0 is up, line protocol is up
  Sending CDP packets every 60 seconds
  Holdtime is 180 seconds
```
- **Verification criteria:** 60-second transmission interval and 180-second holdtime confirmed.

---

## 2. Negative Verification (NEG)

### NEG-01: Access Port Security Hardening on S2
To suppress CDP advertisement packets towards the untrusted administrative host:

```cisco
S2#configure terminal
S2(config)#interface FastEthernet0/10
S2(config-if)#no cdp enable
S2(config-if)#exit
S2(config)#end
```

Verification command:

```cisco
S2#show cdp interface FastEthernet0/10
S2#
```
- **Analysis:** Disabling CDP on an interface halts frame transmission and removes the port from CDP monitoring output.
- **Verification criteria:** `show cdp interface FastEthernet0/10` produces empty output, confirming suppression.

---

### NEG-02: Global Protocol Disabling & Recovery on S3
To test global protocol deactivation:

```cisco
S3#configure terminal
S3(config)#no cdp run
S3(config)#end

S3#show cdp neighbors
% CDP is not enabled
```

Restoring global operation:

```cisco
S3#configure terminal
S3(config)#cdp run
S3(config)#end
```

After advancing simulation time by 60 seconds:

```cisco
S3#show cdp neighbors
Capability Codes: R - Router, T - Trans Bridge, B - Source Route Bridge
                  S - Switch, H - Host, I - IGMP, r - Repeater, P - Phone
Device ID    Local Intrfce   Holdtme    Capability   Platform    Port ID
S1           Fas 0/1          173            S       2960        Fas 0/2
```
- **Verification criteria:** `% CDP is not enabled` observed when turned off globally; neighbor re-discovered upon re-enabling.

