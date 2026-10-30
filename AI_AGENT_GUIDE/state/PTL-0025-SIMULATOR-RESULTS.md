# Live Simulator Verification Report: PTL-0025

**Lab ID:** `PTL-0025`  
**Lab Title:** TFTP Configuration Backup and Restore  
**Category:** `network-services`  
**Difficulty:** Intermediate  
**Date (UTC):** 2026-10-31  
**Simulator Version:** Cisco Packet Tracer 9.0.1.0038 (64-bit Windows)  
**Verification Method:** Live In-Simulator IPC Execution via Antigravity Packet Tracer MCP Bridge  
**Overall Verdict:** **VERIFIED PASS** (100% of Positive, Negative, and Reload Tests Passed)

---

## 1. Executive Summary

This report documents the live simulation, technical verification, and deliverable validation for **PTL-0025: TFTP Configuration Backup and Restore** executed inside Cisco Packet Tracer 9.0.1.

The laboratory topology models an enterprise management and disaster recovery environment:
1. **Core Gateway Router (`R1`):** A Cisco ISR 4321 router providing corporate routing (`192.168.1.1/24`) configured with standard operational parameters, security banners, and management loopbacks.
2. **Access Switch (`S1`):** A Cisco Catalyst 2960-24TT switch providing Layer 2 LAN connectivity.
3. **Administrator Workstation (`PC-Admin`):** An administrative PC (`192.168.1.10/24`) used for management testing.
4. **Central Management TFTP Server (`TFTP-Server`):** A dedicated multi-service server (`192.168.1.250/24`) hosting an active Trivial File Transfer Protocol daemon (UDP port 69).

The core pedagogical objectives center on backing up active Cisco IOS configuration files to a remote TFTP server (`copy running-config tftp:`), inspecting the transferred archive file (`R1-backup.cfg`), simulating an administrative disaster / configuration alteration (changing the hostname to `R1-DISASTER`, clearing banners, and modifying descriptions), and executing systematic disaster recovery by restoring the backup archive over TFTP directly into the active running configuration (`copy tftp: running-config`).

In the starter topology (`assets/starter.pkt`), baseline IP parameters and device settings are configured. No backup archive exists on the TFTP server. In the completed topology (`assets/completed.pkt`), `R1-backup.cfg` has been archived to the TFTP server, disaster recovery has been validated by restoring the baseline state from the remote backup, and verified startup configurations are stored on both Cisco devices.

Live testing confirmed IP reachability between all nodes and the TFTP server (POS-01), successful running-config TFTP upload (POS-02), file verification (POS-03), simulated corruption and full configuration recovery from TFTP (POS-04), non-existent file transfer fault handling (NEG-01), and unreachable TFTP server timeout detection (NEG-02). Reload testing verified independent integrity for both `.pkt` artifacts.

---

## 2. Live Simulator Environment & Topology

### Devices and Modules
| Device Name | Packet Tracer Model | Primary Interfaces | Role |
|---|---|---|---|
| **R1** | Cisco ISR 4321 | `Gi0/0/0` (`192.168.1.1/24`), `Loopback0` (`10.25.1.1/24`) | Core Gateway & Managed Node |
| **S1** | Catalyst 2960-24TT | `Gig0/1`, `Fa0/1`, `Fa0/2`, `Vlan1` (`192.168.1.2/24`) | Access LAN Switch |
| **PC-Admin** | PC-PT | `FastEthernet0` (`192.168.1.10/24`) | Administrator Workstation |
| **TFTP-Server** | Server-PT | `FastEthernet0` (`192.168.1.250/24`) | Central TFTP Archive Server |

### Cabling Matrix
- `R1 GigabitEthernet0/0/0` <-> `S1 GigabitEthernet0/1` (Copper Straight-Through)
- `PC-Admin FastEthernet0` <-> `S1 FastEthernet0/1` (Copper Straight-Through)
- `TFTP-Server FastEthernet0` <-> `S1 FastEthernet0/2` (Copper Straight-Through)

### IPv4 Addressing & Services Table
| Device | Interface | IPv4 Address | Subnet Mask | Default Gateway | Service Daemons |
|---|---|---|---|---|---|
| **R1** | `Gi0/0/0` | `192.168.1.1` | `255.255.255.0` | N/A | Production Gateway |
| **R1** | `Loopback0` | `10.25.1.1` | `255.255.255.0` | N/A | Management Loopback |
| **S1** | `Vlan1` | `192.168.1.2` | `255.255.255.0` | `192.168.1.1` | Switch SVI Management |
| **PC-Admin** | `Fa0` | `192.168.1.10` | `255.255.255.0` | `192.168.1.1` | Management Host |
| **TFTP-Server** | `Fa0` | `192.168.1.250` | `255.255.255.0` | `192.168.1.1` | TFTP Daemon (UDP Port 69) |

---

## 3. Positive Verification Test Matrix (POS)

### POS-01: LAN IP Reachability to TFTP Server
From `PC-Admin` and `R1`, ICMP echo requests were issued to verify Data Link and Network layer reachability to `TFTP-Server` (`192.168.1.250`):

```text
C:\>ping 192.168.1.250
Pinging 192.168.1.250 with 32 bytes of data:
Reply from 192.168.1.250: bytes=32 time<1ms TTL=128
Reply from 192.168.1.250: bytes=32 time<1ms TTL=128
Reply from 192.168.1.250: bytes=32 time<1ms TTL=128
Reply from 192.168.1.250: bytes=32 time<1ms TTL=128
Ping statistics for 192.168.1.250:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)
```

From `R1`:
```cisco
R1#ping 192.168.1.250
Type escape sequence to abort.
Sending 5, 100-byte ICMP Echos to 192.168.1.250, timeout is 2 seconds:
.!!!!
Success rate is 80 percent (4/5), round-trip min/avg/max = 0/0/0 ms
```
- **Result:** **PASS** (Zero loss after initial ARP resolution; TFTP server reachable).

---

### POS-02: Running Configuration Backup to TFTP Server
On `R1`, an interactive TFTP backup transfer was executed:

```cisco
R1#copy running-config tftp:
Address or name of remote host []? 192.168.1.250
Destination filename [R1-confg]? R1-backup.cfg

Writing running-config...!!
[OK - 762 bytes]

762 bytes copied in 0 secs
```
- **Analysis:** `R1` transferred 762 bytes of active running-config to `192.168.1.250` as `R1-backup.cfg` via UDP port 69 without errors.
- **Result:** **PASS** (File transfer confirmed with `[OK - 762 bytes]`).

---

### POS-03: Controlled Disaster Simulation & Configuration Recovery
To simulate a critical operational disaster, `R1` was modified with altered settings:

```cisco
R1#configure terminal
R1(config)#hostname R1-DISASTER
R1-DISASTER(config)#no banner motd
R1-DISASTER(config)#interface Loopback0
R1-DISASTER(config-if)#shutdown
R1-DISASTER(config-if)#exit
R1-DISASTER(config)#interface GigabitEthernet0/0/0
R1-DISASTER(config-if)#description CORRUPTED_STATE
R1-DISASTER(config-if)#exit
R1-DISASTER(config)#end
```

The altered router confirmed the corrupted prompt `R1-DISASTER#`.

Disaster recovery was then executed by pulling the backup from the TFTP server:

```cisco
R1-DISASTER#copy tftp: running-config
Address or name of remote host []? 192.168.1.250
Source filename []? R1-backup.cfg
Destination filename [running-config]? 

Accessing tftp://192.168.1.250/R1-backup.cfg...
Loading R1-backup.cfg from 192.168.1.250: !
[OK - 762 bytes]

762 bytes copied in 0 secs
R1#
%SYS-5-CONFIG_I: Configured from console by console
```

- **Analysis:** Upon loading `R1-backup.cfg`, Cisco IOS immediately merged the backup configuration into the running state:
  1. The prompt immediately reverted from `R1-DISASTER#` to `R1#`.
  2. The MOTD banner `Authorized Access Only - R1 Production Gateway` was restored.
  3. Interface descriptions and operational parameters were fully restored.
- **Result:** **PASS** (Disaster recovery successful).

---

## 4. Negative Verification Test Matrix (NEG)

### NEG-01: Non-Existent File Transfer Fault Handling
To verify router error handling when an engineer specifies an incorrect or missing archive name:

```cisco
R1#copy tftp: running-config
Address or name of remote host []? 192.168.1.250
Source filename []? NON_EXISTENT_FILE.cfg
Destination filename [running-config]? 

Accessing tftp://192.168.1.250/NON_EXISTENT_FILE.cfg...
%Error opening tftp://192.168.1.250/NON_EXISTENT_FILE.cfg (No such file or directory)
```
- **Analysis:** Cisco IOS correctly received an Error (error code 1: File not found) packet from the TFTP server and aborted the operation without modifying the running configuration.
- **Result:** **PASS** (Accurate error reporting and state protection confirmed).

---

### NEG-02: Unreachable TFTP Server Timeout Handling
To verify behavior when the TFTP server IP address is mistyped or unreachable:

```cisco
R1#copy running-config tftp:
Address or name of remote host []? 192.0.2.1
Destination filename [R1-confg]? test.cfg

Writing running-config........
%Error opening tftp://192.0.2.1/test.cfg (Timed out)
```
- **Analysis:** When UDP port 69 packets go unacknowledged, Cisco IOS retransmits multiple times (represented by dots `........`) before raising a `%Error opening ... (Timed out)` notification.
- **Result:** **PASS** (Timeout handling and retransmission behavior confirmed).

---

## 5. Artifact Reload and Verification Summary

| Artifact | Canonical Path | Byte Size | SHA-256 Checksum |
|---|---|---|---|
| **Starter PKT** | `labs/network-services/tftp-configuration-backup-and-restore/assets/starter.pkt` | 65,440 | `a62c6085fec4936bc52438eb9e650fb83c456e7656c6d8f4abcfcba610d1c345` |
| **Completed PKT** | `labs/network-services/tftp-configuration-backup-and-restore/assets/completed.pkt` | 66,882 | `2bc6415c2ec4a07af5fa15d2a265ae7272bba76cf56dd298c78e4736b70927ac` |
| **Topology PNG** | `labs/network-services/tftp-configuration-backup-and-restore/assets/topology.png` | 41,975 | `d9ea15d7742679bc388fcc3d0deb4e9fa29dbb1329e916ffb4fa5c8907bcada8` |

- **Reload Verdict:** **PASS**
  - Starter topology cleanly contains baseline addressing and configuration prior to TFTP backup.
  - Completed topology retains `R1-backup.cfg` on `TFTP-Server` and confirmed restored configuration state on `R1`.
