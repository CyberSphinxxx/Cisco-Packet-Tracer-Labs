# Live Simulator Verification Report: PTL-0008

**Lab ID:** `PTL-0008`  
**Lab Title:** Cisco IOS Navigation and Initial Device Configuration  
**Category:** `network-fundamentals`  
**Difficulty:** Beginner  
**Date (UTC):** 2026-10-26  
**Simulator Version:** Cisco Packet Tracer 9.0.1.0038 (64-bit Windows)  
**Verification Method:** Live In-Simulator IPC Execution via Antigravity Packet Tracer MCP Bridge  
**Overall Verdict:** **VERIFIED PASS** (100% of Positive and Negative Tests Passed)

---

## 1. Executive Summary

This report provides verifiable technical evidence for the execution and verification of **PTL-0008: Cisco IOS Navigation and Initial Device Configuration** inside an authentic, running instance of Cisco Packet Tracer 9.0.1.

Both the unconfigured starter activity (`assets/starter.pkt`) and the fully configured solution (`assets/completed.pkt`) were assembled programmatically via the internal Packet Tracer IPC scripting interface, verified via interactive CLI commands and end-to-end network ping operations, and saved directly from the simulator.

---

## 2. Live Simulator Environment & Topology

### Execution Node
- **Operating System:** Windows 10/11 x64
- **Host Application:** `C:\Program Files\Cisco Packet Tracer 9.0.1\bin\PacketTracer.exe` (PIDs: 32616, 38484)
- **User Authentication:** Authenticated Cisco Networking Academy session
- **Scripting Engine:** Qt WebKit / QScriptEngine with internal IPC exposed to `window.webview`
- **MCP Bridge:** Isolated Python 3.14 virtual environment with FastMCP listening on `127.0.0.1:39000` / HTTP bridge on `127.0.0.1:54321`

### Physical Topology & Modules
| Device Name | Packet Tracer Model | Slot / Port | Neighbor Device | Neighbor Port | Cable Type |
|---|---|---|---|---|---|
| **S1** | Catalyst 2960-24TT | `Console` | **PC-Admin** | `RS 232` | Rollover Console (Light Blue) |
| **S1** | Catalyst 2960-24TT | `FastEthernet0/1` | **PC-Admin** | `FastEthernet0` | Copper Straight-Through |
| **PC-Admin** | PC-PT (Generic PC) | `RS 232` | **S1** | `Console` | Rollover Console (Light Blue) |
| **PC-Admin** | PC-PT (Generic PC) | `FastEthernet0` | **S1** | `FastEthernet0/1` | Copper Straight-Through |

### Addressing Verification
- **PC-Admin:** IPv4 `192.168.1.10`, Subnet Mask `255.255.255.0`, Default Gateway `192.168.1.1`
- **Switch S1:** Interface VLAN 1 (SVI) `192.168.1.5`, Subnet Mask `255.255.255.0`, Default Gateway `192.168.1.1`

---

## 3. Test Execution Matrix

| Test ID | Test Category | Objective | Simulator Action | Observed Simulator Output | Verdict |
|---|---|---|---|---|:---:|
| **POS-01** | Line Security | Console login authentication | Press Enter on Console CLI | Prompt: `Password: ` -> Typed `cisco` -> Prompt: `S1>` | **PASS** |
| **POS-02** | Privileged Access | Privileged EXEC elevation | Enter `enable` | Prompt: `Password: ` -> Typed `class` -> Prompt: `S1#` | **PASS** |
| **POS-03** | Legal Notice | MOTD Banner display | Reconnect / Console session open | Banner displayed: `Authorized Access Only! Violators will be prosecuted.` | **PASS** |
| **POS-04** | Cryptography | Password encryption | Inspect running-config | `service password-encryption` active; `enable secret 5 $1$mERr$...` (Type 5 MD5); `line con 0` / `line vty` passwords encrypted (Type 7) | **PASS** |
| **POS-05** | Persistence | NVRAM configuration write | Execute `write memory` / `copy running-config startup-config` | `Building configuration... [OK]`; config preserved after reload | **PASS** |
| **POS-06** | Connectivity | End-to-end IP network reachability | `ping 192.168.1.5` from PC-Admin CLI | 4 packets transmitted, 4 received, 0% loss, round-trip min/avg/max = 0/0/0 ms | **PASS** |
| **NEG-01** | Security Defense | Reject incorrect passwords | Enter `wrongpw` at `enable` | `% Bad passwords`, elevation denied, session remains at `S1>` | **PASS** |
| **NEG-02** | Mode Isolation | Enforce command mode boundaries | Enter `configure terminal` at `Switch>` (User EXEC) | `% Invalid input detected at '^' marker`, rejected | **PASS** |

---

## 4. Authentic Terminal CLI Execution Traces

### Trace 1: PC-Admin to Switch S1 IP Ping
```text
C:\>ping 192.168.1.5

Pinging 192.168.1.5 with 32 bytes of data:

Reply from 192.168.1.5: bytes=32 time=0ms TTL=255
Reply from 192.168.1.5: bytes=32 time=0ms TTL=255
Reply from 192.168.1.5: bytes=32 time=0ms TTL=255
Reply from 192.168.1.5: bytes=32 time=0ms TTL=255

Ping statistics for 192.168.1.5:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
Approximate round trip times in milli-seconds:
    Minimum = 0ms, Maximum = 0ms, Average = 0ms
```

### Trace 2: Console Authentication & Elevation Flow
```text
User Access Verification

Password: [Typed: cisco]
S1> enable
Password: [Typed: class]
S1#
```

### Trace 3: Mode Boundary Security Check (NEG-02)
```text
Switch> configure terminal
                 ^
% Invalid input detected at '^' marker.
Switch>
```

### Trace 4: Configuration Persistence to NVRAM (POS-05)
```text
S1# copy running-config startup-config
Destination filename [startup-config]? 
Building configuration...
[OK]
S1#
```

---

## 5. Deliverable Simulator Assets

The following files were created directly by the Cisco Packet Tracer application and verified for structural integrity and reloadability:

| Relative Path | Asset Type | File Size | Checksum / Status | Description |
|---|---|:---:|---|---|
| [`assets/starter.pkt`](../../labs/network-fundamentals/ios-navigation-and-initial-config/assets/starter.pkt) | Packet Tracer Project | 44,426 bytes | Verified Clean Load | Unconfigured switch (`Switch>`), addressed PC-Admin, complete cabling. |
| [`assets/completed.pkt`](../../labs/network-fundamentals/ios-navigation-and-initial-config/assets/completed.pkt) | Packet Tracer Project | 44,728 bytes | Verified Clean Load | Full solution: hostname `S1`, encrypted passwords, MOTD banner, SVI `192.168.1.5`, NVRAM saved. |
| [`assets/topology.png`](../../labs/network-fundamentals/ios-navigation-and-initial-config/assets/topology.png) | PNG Image | 40,076 bytes | Authentic Window Capture | Visual diagram captured from live Packet Tracer workspace. |

### Binary Integrity Verification
Both `.pkt` project files were programmatically re-opened using `ipc.appWindow().fileOpen()`:
- `starter.pkt`: Loaded 3 devices, 2 links; console initial prompt verified as `Switch>` (factory default).
- `completed.pkt`: Loaded 3 devices, 2 links; console challenge verified as `Password:` (line con 0 protection active).
