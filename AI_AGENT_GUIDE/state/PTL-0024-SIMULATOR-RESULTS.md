# Live Simulator Verification Report: PTL-0024

**Lab ID:** `PTL-0024`  
**Lab Title:** CDP Neighbor Discovery and Topology Audit  
**Category:** `network-fundamentals`  
**Difficulty:** Beginner  
**Date (UTC):** 2026-10-31  
**Simulator Version:** Cisco Packet Tracer 9.0.1.0038 (64-bit Windows)  
**Verification Method:** Live In-Simulator IPC Execution via Antigravity Packet Tracer MCP Bridge  
**Overall Verdict:** **VERIFIED PASS** (100% of Positive, Negative, and Reload Tests Passed)

---

## 1. Executive Summary

This report documents the live simulation, technical verification, and deliverable validation for **PTL-0024: CDP Neighbor Discovery and Topology Audit** executed inside Cisco Packet Tracer 9.0.1.

The laboratory topology models a hierarchical campus distribution and access layer:
1. **Core / Gateway Router (`R1`):** A Cisco ISR 4321 router providing default routing services (`192.168.1.1/24`).
2. **Distribution Switch (`S1`):** A Cisco Catalyst 2960-24TT switch acting as the central Layer 2 interconnect between `R1`, `S2`, and `S3`.
3. **Access Switch 1 (`S2`):** A Cisco Catalyst 2960-24TT switch servicing end-user workstations.
4. **Access Switch 2 (`S3`):** A Cisco Catalyst 2960-24TT switch servicing a separate building access block.
5. **Administrative Workstation (`PC-Admin`):** An end-user host connected to `S2 FastEthernet0/10`.

The core pedagogical objectives center on mapping an unknown physical network topology without physical closet access using the **Cisco Discovery Protocol (CDP)**, auditing neighbor platforms, capabilities, and management IP addresses, analyzing Layer 2 TLV structures, inspecting operational timers, and executing security hardening by disabling CDP on untrusted access-layer switchports (`no cdp enable`) and testing global protocol deactivation (`no cdp run`).

In the starter topology (`assets/starter.pkt`), all devices are interconnected and basic hostnames and IP configurations are loaded. CDP is globally active by default across all interfaces. In the completed topology (`assets/completed.pkt`), access port `S2 FastEthernet0/10` facing `PC-Admin` is hardened against reconnaissance by disabling CDP transmissions (`no cdp enable`), while inter-switch and router trunks retain active discovery capabilities.

Live testing confirmed multi-device neighbor table mapping on `S1` (POS-01), detailed TLV and management address inspection on `R1` (POS-02), targeted single-neighbor entry queries on `S2` (POS-03), timer inspection (POS-04), interface-level hardening (NEG-01), and global protocol deactivation and recovery on `S3` (NEG-02). Reload testing verified independent integrity for both `.pkt` artifacts.

---

## 2. Live Simulator Environment & Topology

### Devices and Modules
| Device Name | Packet Tracer Model | Primary Interfaces | Role |
|---|---|---|---|
| **R1** | Cisco ISR 4321 | `Gi0/0/0` (`192.168.1.1/24`) | Core Gateway Router |
| **S1** | Catalyst 2960-24TT | `Gig0/1`, `Fa0/1`, `Fa0/2`, `Vlan1` (`192.168.1.2/24`) | Distribution Switch |
| **S2** | Catalyst 2960-24TT | `Fa0/1`, `Fa0/10`, `Vlan1` (`192.168.1.3/24`) | Access Switch 1 |
| **S3** | Catalyst 2960-24TT | `Fa0/1`, `Vlan1` (`192.168.1.4/24`) | Access Switch 2 |
| **PC-Admin** | PC-PT | `FastEthernet0` (`192.168.1.50/24`) | End-User Workstation |

### Cabling Matrix
- `R1 GigabitEthernet0/0/0` <-> `S1 GigabitEthernet0/1` (Copper Straight-Through)
- `S1 FastEthernet0/1` <-> `S2 FastEthernet0/1` (Copper Crossover)
- `S1 FastEthernet0/2` <-> `S3 FastEthernet0/1` (Copper Crossover)
- `S2 FastEthernet0/10` <-> `PC-Admin FastEthernet0` (Copper Straight-Through)

### IPv4 Addressing & Services Table
| Device | Interface | IPv4 Address | Subnet Mask | Default Gateway | CDP Status |
|---|---|---|---|---|---|
| **R1** | `Gi0/0/0` | `192.168.1.1` | `255.255.255.0` | N/A | Enabled (Default) |
| **S1** | `Vlan1` | `192.168.1.2` | `255.255.255.0` | `192.168.1.1` | Enabled (Default) |
| **S2** | `Vlan1` | `192.168.1.3` | `255.255.255.0` | `192.168.1.1` | Hardened on Fa0/10 |
| **S3** | `Vlan1` | `192.168.1.4` | `255.255.255.0` | `192.168.1.1` | Enabled (Default) |
| **PC-Admin** | `FastEthernet0` | `192.168.1.50` | `255.255.255.0` | `192.168.1.1` | N/A (Non-Cisco Endpoint) |

---

## 3. Positive Verification Test Matrix (POS)

### POS-01: Multi-Neighbor Discovery on Distribution Switch S1
On distribution switch `S1`, `show cdp neighbors` was executed to verify concurrent neighbor tracking across multiple interfaces:

```
S1#show cdp neighbors
Capability Codes: R - Router, T - Trans Bridge, B - Source Route Bridge
                  S - Switch, H - Host, I - IGMP, r - Repeater, P - Phone
Device ID    Local Intrfce   Holdtme    Capability   Platform    Port ID
R1           Gig 0/1          166            R       ISR4300     Gig 0/0/0
S2           Fas 0/1          145            S       2960        Fas 0/1
S3           Fas 0/2          165            S       2960        Fas 0/1
S1#
```
- **Analysis:** `S1` successfully discovers all three neighboring Cisco devices:
  - `R1` on local `Gig 0/1` (remote port `Gig 0/0/0`, Capability `R`, Platform `ISR4300`)
  - `S2` on local `Fas 0/1` (remote port `Fas 0/1`, Capability `S`, Platform `2960`)
  - `S3` on local `Fas 0/2` (remote port `Fas 0/1`, Capability `S`, Platform `2960`)
- **Result:** **PASS** (Complete neighbor table populated matching physical cabling).

---

### POS-02: Detailed TLV Inspection on Core Router R1
On `R1`, `show cdp neighbors detail` was executed to audit the TLV parameters advertised by `S1`:

```
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

R1#
```
- **Analysis:** TLVs reveal neighbor hostname (`S1`), management IPv4 address (`192.168.1.2`), platform (`cisco 2960`), operating system release (`12.2(25)FX`), local interface (`GigabitEthernet0/0/0`), remote interface (`GigabitEthernet0/1`), holdtime countdown, and full-duplex negotiation.
- **Result:** **PASS** (Full TLV payload audited).

---

### POS-03: Single Entry Query on Access Switch S2
On `S2`, `show cdp entry S1` was executed to query specific details for distribution switch `S1`:

```
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

S2#
```
- **Analysis:** Targeted queries filter information efficiently without requiring pagination through large enterprise tables.
- **Result:** **PASS** (Direct entry lookups verified).

---

### POS-04: Protocol Timers & Interface Audit on R1
On `R1`, global protocol timers and interface operational states were inspected:

```
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
- **Analysis:** Global transmission interval is 60 seconds, holdtime is 180 seconds (3x transmission interval), and interface transmission is enabled.
- **Result:** **PASS** (Protocol timing baseline confirmed).

---

## 4. Negative Verification Test Matrix (NEG)

### NEG-01: Access Port Security Hardening on S2
Because CDP broadcasts unencrypted management details (device model, software version, IP address) that provide attackers with reconnaissance data, access port `FastEthernet0/10` facing `PC-Admin` was hardened by disabling CDP:

```cisco
S2(config)#interface FastEthernet0/10
S2(config-if)#no cdp enable
S2(config-if)#exit
```

Verification command output on `S2`:

```
S2#show cdp interface FastEthernet0/10
S2#
```
- **Analysis:** When CDP is disabled on an interface, `show cdp interface <interface>` produces empty output, confirming that CDP advertisement packets are halted on that specific port while remaining active on trunk port `Fa0/1`.
- **Result:** **PASS** (Selective interface-level hardening verified).

---

### NEG-02: Global CDP Disabling & Restoration on S3
To demonstrate global protocol disabling:

```cisco
S3(config)#no cdp run
S3(config)#end

S3#show cdp neighbors
% CDP is not enabled
S3#
```

After verifying that the entire protocol subsystem is inactive and all cached entries are purged, CDP was globally re-enabled:

```cisco
S3(config)#cdp run
S3(config)#end
```

Advancing simulation time confirmed that neighbor `S1` was immediately re-discovered:

```
S3#show cdp neighbors
Capability Codes: R - Router, T - Trans Bridge, B - Source Route Bridge
                  S - Switch, H - Host, I - IGMP, r - Repeater, P - Phone
Device ID    Local Intrfce   Holdtme    Capability   Platform    Port ID
S1           Fas 0/1          173            S       2960        Fas 0/2
S3#
```
- **Result:** **PASS** (Global protocol shutdown, cache purge, and recovery verified).

---

## 5. Artifact Reload and Verification Summary

| Artifact | Canonical Path | Byte Size | SHA-256 Checksum |
|---|---|---|---|
| **Starter PKT** | `labs/network-fundamentals/cdp-neighbor-discovery-and-topology-audit/assets/starter.pkt` | 58,141 | `bc2c8de75f35030ff1964081231d0e4784bafcbd2157b07d518873b220379503` |
| **Completed PKT** | `labs/network-fundamentals/cdp-neighbor-discovery-and-topology-audit/assets/completed.pkt` | 58,582 | `225bdefced20da514725c95b874f00db07493b8bbf0a069c11a3653cf1036ba5` |
| **Topology PNG** | `labs/network-fundamentals/cdp-neighbor-discovery-and-topology-audit/assets/topology.png` | 42,018 | `192ba5124e9a2e4116e444f8953c943543b0a7b6500eee6e8df31e2f0cd71aa3` |

- **Reload Verdict:** **PASS**
  - Starter topology contains all baseline addressing and unhardened ports.
  - Completed topology retains `no cdp enable` on `S2 Fa0/10` and verified startup configurations on all four Cisco devices.

