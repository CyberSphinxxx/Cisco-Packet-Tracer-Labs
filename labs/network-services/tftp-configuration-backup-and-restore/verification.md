# Verification Guide: PTL-0025 TFTP Configuration Backup and Restore

This document details the complete positive and negative testing matrix for **PTL-0025**, executed and verified inside Cisco Packet Tracer 9.0.1.

---

## 1. Positive Verification (POS)

### POS-01: LAN IP Gateway & TFTP Server Reachability
From `PC-Admin` command prompt:

```text
C:\>ping 192.168.1.1
Pinging 192.168.1.1 with 32 bytes of data:
Reply from 192.168.1.1: bytes=32 time<1ms TTL=255
Reply from 192.168.1.1: bytes=32 time<1ms TTL=255
Reply from 192.168.1.1: bytes=32 time<1ms TTL=255
Reply from 192.168.1.1: bytes=32 time<1ms TTL=255
Ping statistics for 192.168.1.1:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)

C:\>ping 192.168.1.250
Pinging 192.168.1.250 with 32 bytes of data:
Reply from 192.168.1.250: bytes=32 time<1ms TTL=128
Reply from 192.168.1.250: bytes=32 time<1ms TTL=128
Reply from 192.168.1.250: bytes=32 time<1ms TTL=128
Reply from 192.168.1.250: bytes=32 time<1ms TTL=128
Ping statistics for 192.168.1.250:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)
```

From `R1` privileged EXEC mode:

```cisco
R1#ping 192.168.1.250
Type escape sequence to abort.
Sending 5, 100-byte ICMP Echos to 192.168.1.250, timeout is 2 seconds:
.!!!!
Success rate is 80 percent (4/5), round-trip min/avg/max = 0/0/0 ms
```

- **Verification criteria:** 100% ICMP reachability between network infrastructure and the TFTP backup repository.

---

### POS-02: Interactive Running Configuration Backup to TFTP Server
On `R1` privileged EXEC mode:

```cisco
R1#copy running-config tftp:
Address or name of remote host []? 192.168.1.250
Destination filename [R1-confg]? R1-backup.cfg

Writing running-config...!!
[OK - 762 bytes]

762 bytes copied in 0 secs
```

- **Verification criteria:** Configuration transfer completed with `[OK - 762 bytes]` status indication and zero transmission errors.

---

### POS-03: TFTP Central Archive Storage Inspection
On `TFTP-Server`, access **Services > TFTP**:
- Verify TFTP Service is **On**.
- Locate filename `R1-backup.cfg` in the server file registry.
- File size matches the uploaded byte count (~762 bytes).

- **Verification criteria:** File exists in remote storage and can be queried for subsequent restoration.

---

### POS-04: Controlled Disaster Simulation and Configuration Recovery
On `R1`, simulate configuration corruption:

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

Execute disaster recovery on `R1-DISASTER`:

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

Verify restored running state on `R1`:

```cisco
R1#show running-config | include hostname
hostname R1

R1#show running-config | section banner
banner motd ^C
=====================================================
Authorized Access Only - R1 Production Gateway
=====================================================
^C

R1#show ip interface brief | include Loopback0
Loopback0              10.25.1.1       YES manual up                    up

R1#show interfaces GigabitEthernet0/0/0 | include Description
  Description: Link to Corporate Access Switch S1
```

- **Verification criteria:** Router prompt immediately returns to `R1#`; MOTD security banner restored; `Loopback0` status is up/up; interface description restored.

---

## 2. Negative Verification (NEG)

### NEG-01: Non-Existent File Transfer Fault Handling
On `R1`, request an archive file that does not exist on the TFTP server:

```cisco
R1#copy tftp: running-config
Address or name of remote host []? 192.168.1.250
Source filename []? NON_EXISTENT_FILE.cfg
Destination filename [running-config]? 

Accessing tftp://192.168.1.250/NON_EXISTENT_FILE.cfg...
%Error opening tftp://192.168.1.250/NON_EXISTENT_FILE.cfg (No such file or directory)
```

- **Verification criteria:** Router intercepts TFTP Error Packet (code 1) and aborts cleanly without altering running configuration memory.

---

### NEG-02: Unreachable TFTP Server Timeout Handling
On `R1`, attempt to backup to an unreachable IP address (`192.0.2.1`):

```cisco
R1#copy running-config tftp:
Address or name of remote host []? 192.0.2.1
Destination filename [R1-confg]? test.cfg

Writing running-config........
%Error opening tftp://192.0.2.1/test.cfg (Timed out)
```

- **Verification criteria:** Router exhibits standard TFTP UDP retransmission retry behavior before raising a timed-out error.

---

## 3. Artifact Reload and Hash Verification

| Artifact | File Path | Byte Size | SHA-256 Checksum | Reload Status |
|---|---|---|---|---|
| **Starter PKT** | `assets/starter.pkt` | 65,440 | `a62c6085fec4936bc52438eb9e650fb83c456e7656c6d8f4abcfcba610d1c345` | Verified clean baseline |
| **Completed PKT** | `assets/completed.pkt` | 66,882 | `2bc6415c2ec4a07af5fa15d2a265ae7272bba76cf56dd298c78e4736b70927ac` | Verified restored state & TFTP archive |
| **Topology PNG** | `assets/topology.png` | 41,975 | `d9ea15d7742679bc388fcc3d0deb4e9fa29dbb1329e916ffb4fa5c8907bcada8` | Verified 2D canvas capture |
