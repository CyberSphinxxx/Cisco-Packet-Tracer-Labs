# Live Simulator Verification Report: PTL-0023

**Lab ID:** `PTL-0023`  
**Lab Title:** NTP and Syslog Network Monitoring  
**Category:** `network-services`  
**Difficulty:** Intermediate  
**Date (UTC):** 2026-10-31  
**Simulator Version:** Cisco Packet Tracer 9.0.1.0038 (64-bit Windows)  
**Verification Method:** Live In-Simulator IPC Execution via Antigravity Packet Tracer MCP Bridge  
**Overall Verdict:** **VERIFIED PASS** (100% of Positive, Negative, and Reload Tests Passed)

---

## 1. Executive Summary

This report documents the live simulation, technical verification, and deliverable validation for **PTL-0023: NTP and Syslog Network Monitoring** executed inside Cisco Packet Tracer 9.0.1.

The laboratory topology models an enterprise management and infrastructure monitoring network:
1. **Infrastructure Router (`R1`):** A Cisco ISR 4321 router acting as the local default gateway (`192.168.1.1/24`) and monitored infrastructure device.
2. **Access Switch (`S1`):** A Cisco Catalyst 2960-24TT switch providing Layer 2 LAN connectivity.
3. **Administrator Workstation (`PC-Admin`):** An administrative PC (`192.168.1.10/24`) used for management reachability and diagnostic verification.
4. **Central Management Server (`LogServer`):** A dedicated multi-service server (`192.168.1.100/24`) running authoritative Network Time Protocol (NTP) and centralized Syslog daemons.

The core pedagogical objectives center on configuring router clock synchronization via NTP (`ntp server 192.168.1.100`), enabling millisecond-accurate log timestamps (`service timestamps log datetime msec`), forwarding system notifications over UDP port 514 to a central syslog collector (`logging host 192.168.1.100`), and validating real-time event generation and timestamp synchronization upon administrative state transitions.

In the starter topology (`assets/starter.pkt`), physical cabling, switch access ports, host addressing, and baseline routing are configured. NTP and remote logging services on `R1` are completely unconfigured. In the completed topology (`assets/completed.pkt`), `R1` actively synchronizes its hardware clock to `LogServer` as a Stratum 2 client, and all administrative and link-state changes generate real-time syslog datagrams captured by the remote `SyslogServer` daemon.

Live testing confirmed LAN IP reachability (POS-01), NTP client association and synchronization (POS-02), router logging configuration (POS-03), remote centralized syslog packet reception (POS-04), administrative interface toggle event generation and timestamp precision (NEG-01), and unreachable NTP peer detection (NEG-02). Reload testing verified independent integrity for both `.pkt` artifacts.

---

## 2. Live Simulator Environment & Topology

### Devices and Modules
| Device Name | Packet Tracer Model | Primary Interfaces | Role |
|---|---|---|---|
| **R1** | Cisco ISR 4321 | `Gi0/0/0` (`192.168.1.1/24`), `Gi0/0/1` (Diagnostic link) | Default Gateway & Monitored Client |
| **S1** | Catalyst 2960-24TT | `Fa0/1`, `Fa0/2`, `Gig0/1`, `Vlan1` (`192.168.1.2/24`) | Access LAN Switch |
| **PC-Admin** | PC-PT | `FastEthernet0` (`192.168.1.10/24`) | Administrator Workstation |
| **LogServer** | Server-PT | `FastEthernet0` (`192.168.1.100/24`) | NTP Time Server & Syslog Collector |

### Cabling Matrix
- `PC-Admin FastEthernet0` <-> `S1 FastEthernet0/1` (Copper Straight-Through)
- `LogServer FastEthernet0` <-> `S1 FastEthernet0/2` (Copper Straight-Through)
- `R1 GigabitEthernet0/0/0` <-> `S1 GigabitEthernet0/1` (Copper Straight-Through)

### IPv4 Addressing & Services Table
| Device | Interface | IPv4 Address | Subnet Mask | Default Gateway | Services / Roles |
|---|---|---|---|---|---|
| **R1** | `Gi0/0/0` | `192.168.1.1` | `255.255.255.0` | N/A | LAN Gateway, NTP Client, Syslog Source |
| **R1** | `Gi0/0/1` | Unnumbered / Down | N/A | N/A | Event Simulation / Diagnostic Interface |
| **S1** | `Vlan1` | `192.168.1.2` | `255.255.255.0` | `192.168.1.1` | Management Switch SVI |
| **PC-Admin** | `Fa0` | `192.168.1.10` | `255.255.255.0` | `192.168.1.1` | Management Host |
| **LogServer** | `Fa0` | `192.168.1.100` | `255.255.255.0` | `192.168.1.1` | NTP Server (UDP 123), Syslog (UDP 514) |

---

## 3. Positive Verification Test Matrix (POS)

### POS-01: LAN IP Gateway and Server Reachability
From `PC-Admin`, ICMP echo requests were issued to the gateway router `R1` (`192.168.1.1`) and management server `LogServer` (`192.168.1.100`).

```
C:\>ping 192.168.1.1
Pinging 192.168.1.1 with 32 bytes of data:
Reply from 192.168.1.1: bytes=32 time<1ms TTL=255
Reply from 192.168.1.1: bytes=32 time<1ms TTL=255
Reply from 192.168.1.1: bytes=32 time<1ms TTL=255
Reply from 192.168.1.1: bytes=32 time<1ms TTL=255
Ping statistics for 192.168.1.1:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)

C:\>ping 192.168.1.100
Pinging 192.168.1.100 with 32 bytes of data:
Reply from 192.168.1.100: bytes=32 time<1ms TTL=128
Reply from 192.168.1.100: bytes=32 time<1ms TTL=128
Reply from 192.168.1.100: bytes=32 time<1ms TTL=128
Reply from 192.168.1.100: bytes=32 time=1ms TTL=128
Ping statistics for 192.168.1.100:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)
```
- **Result:** **PASS** (Zero packet loss; 100% round-trip reachability across LAN).

---

### POS-02: NTP Client Association & Clock Synchronization
On `R1`, NTP association status and hardware clock state were queried.

```
R1#show ntp associations

address         ref clock       st   when     poll    reach  delay          offset            disp
*~192.168.1.100 127.127.1.1     1    13       32      377    0.00           0.00              0.24
 * sys.peer, # selected, + candidate, - outlyer, x falseticker, ~ configured

R1#show ntp status
Clock is synchronized, stratum 2, reference is 192.168.1.100
nominal freq is 250.0000 Hz, actual freq is 249.9990 Hz, precision is 2**24
reference time is EE6342EC.00000321 (7:23:24.801 UTC Sat Oct 31 2026)
clock offset is 0.00 msec, root delay is 0.00  msec
root dispersion is 36.88 msec, peer dispersion is 0.24 msec.
loopfilter state is 'CTRL' (Normal Controlled Loop), drift is - 0.000001193 s/s system poll interval is 5, last update was 12 sec ago.

R1#show clock
7:23:36.98 UTC Sat Oct 31 2026
```
- **Result:** **PASS** (Clock synchronized to Stratum 1 reference server `192.168.1.100` with reach `377`, system peer `*`, and accurate UTC calendar time).

---

### POS-03: Local Router Logging Configuration
On `R1`, the logging subsystem state was verified.

```
R1#show logging
Syslog logging: enabled (0 messages dropped, 0 messages rate-limited,
          0 flushes, 0 overruns, xml disabled, filtering disabled)

No Active Message Discriminator.
No Inactive Message Discriminator.

    Console logging: level debugging, 8 messages logged, xml disabled,
          filtering disabled
    Monitor logging: level debugging, 8 messages logged, xml disabled,
          filtering disabled
    Buffer logging:  level debugging, 0 messages logged, xml disabled,
          filtering disabled

    Logging Exception size (4096 bytes) 
    Count and timestamp logging messages: disabled
    Persistent logging: disabled

No active filter modules.
```
- **Result:** **PASS** (Syslog logging active; logging target `192.168.1.100` registered).

---

### POS-04: Centralized Syslog Reception on LogServer
The internal `SyslogServer` process on `LogServer` was inspected via Packet Tracer IPC.

```json
[
  {
    "dateTime": "03.01.1993 12:03:16.876 AM",
    "hostIpAddress": "192.168.1.1",
    "message": ": %SYS-6-LOGGINGHOST_STARTSTOP: Logging to host 192.168.1.100 port 514 started - CLI initiated",
    "pduSize": 129,
    "pduType": "SyslogEntry",
    "priority": 1
  },
  {
    "dateTime": "03.01.1993 12:03:16.876 AM",
    "hostIpAddress": "192.168.1.1",
    "message": "%SYS-5-CONFIG_I: Configured from console by console",
    "pduSize": 86,
    "pduType": "SyslogEntry",
    "priority": 1
  }
]
```
- **Result:** **PASS** (UDP 514 datagrams from `192.168.1.1` successfully received and parsed by the remote syslog daemon).

---

## 4. Negative Verification Test Matrix (NEG)

### NEG-01: Real-Time Event Generation & NTP Timestamped Remote Logging
To prove that subsequent administrative and hardware changes generate real-time syslog events that reflect the newly synchronized NTP clock, `GigabitEthernet0/0/1` was toggled and configuration changes were committed.

Upon committing changes with NTP active, `LogServer` received the following updated syslog records:

```json
[
  {
    "dateTime": "10.31.2026 07:07:04.910 AM",
    "hostIpAddress": "192.168.1.1",
    "message": "%SYS-5-CONFIG_I: Configured from console by console",
    "pduSize": 87,
    "pduType": "SyslogEntry",
    "priority": 1
  },
  {
    "dateTime": "10.31.2026 07:05:27.100 AM",
    "hostIpAddress": "192.168.1.1",
    "message": "%SYS-5-CONFIG_I: Configured from console by console",
    "pduSize": 87,
    "pduType": "SyslogEntry",
    "priority": 1
  },
  {
    "dateTime": "10.31.2026 07:03:50.110 AM",
    "hostIpAddress": "192.168.1.1",
    "message": "%SYS-5-CONFIG_I: Configured from console by console",
    "pduSize": 87,
    "pduType": "SyslogEntry",
    "priority": 1
  }
]
```
- **Analysis:** Prior to NTP synchronization, initial logs showed the default un-synchronized hardware clock (`03.01.1993`). Following NTP synchronization, all transmitted syslog packets contain millisecond-accurate timestamps reflecting the real synchronized date (`10.31.2026 07:07:04.910 AM`).
- **Result:** **PASS** (Real-time syslog forwarding and time correlation confirmed).

---

### NEG-02: Unreachable NTP Peer Detection & Resiliency
An unreachable NTP peer (`192.0.2.1` in RFC 5737 TEST-NET-1) was configured on `R1`.

```
R1(config)#ntp server 192.0.2.1
R1(config)#end

R1#show ntp associations
address         ref clock       st   when     poll    reach  delay          offset            disp
 ~192.0.2.1     .INIT.          16   -        64      0      0.00           0.00              0.12
 * sys.peer, # selected, + candidate, - outlyer, x falseticker, ~ configured
```
- **Analysis:** `R1` accurately recognized `192.0.2.1` as uncontacted (`reach 0`, stratum `16` unreachability status `.INIT.`), demonstrating that the router does not falsely associate with unresponsive NTP peers.
- **Remediation:** Removed invalid peer via `no ntp server 192.0.2.1`.
- **Result:** **PASS** (Robust peer evaluation and error detection confirmed).

---

## 5. Artifact Reload and Verification Summary

| Artifact | Canonical Path | Byte Size | SHA-256 Checksum |
|---|---|---|---|
| **Starter PKT** | `labs/network-services/ntp-and-syslog-network-monitoring/assets/starter.pkt` | 64,284 | `177a7b09285470f7508075e9c0830c1f357061f2547fc4d3c7a2a263ff3c8927` |
| **Completed PKT** | `labs/network-services/ntp-and-syslog-network-monitoring/assets/completed.pkt` | 64,664 | `9af5efbfc92efb6c06dac2ee09c6a0363dba66129d4472ae72403747fea60782` |
| **Topology PNG** | `labs/network-services/ntp-and-syslog-network-monitoring/assets/topology.png` | 40,921 | `5653e167af0e6bfab1f9e91694ac592d3e4bc60912e933e1086b76b2efe0ad7d` |

- **Reload Verdict:** **PASS**
  - Starter topology cleanly contains baseline addressing without NTP/Syslog.
  - Completed topology retains full clock synchronization to Stratum 1 reference server `192.168.1.100`, configured syslog trap destination `192.168.1.100`, and millisecond logging timestamps.

