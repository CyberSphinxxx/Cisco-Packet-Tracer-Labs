# Verification Guide: PTL-0023 NTP and Syslog Network Monitoring

This document details the complete positive and negative testing matrix for **PTL-0023**, executed and verified inside Cisco Packet Tracer 9.0.1.

---

## 1. Positive Verification (POS)

### POS-01: LAN IP Gateway & Monitoring Server Reachability
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

C:\>ping 192.168.1.100
Pinging 192.168.1.100 with 32 bytes of data:
Reply from 192.168.1.100: bytes=32 time<1ms TTL=128
Reply from 192.168.1.100: bytes=32 time<1ms TTL=128
Reply from 192.168.1.100: bytes=32 time<1ms TTL=128
Reply from 192.168.1.100: bytes=32 time=1ms TTL=128
Ping statistics for 192.168.1.100:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)
```
- **Verification criteria:** 100% round-trip ICMP reply rate across LAN infrastructure.

---

### POS-02: NTP Client Association & Clock State
On `R1` privileged EXEC mode:

```cisco
R1#show ntp status
Clock is synchronized, stratum 2, reference is 192.168.1.100
nominal freq is 250.0000 Hz, actual freq is 249.9990 Hz, precision is 2**24
reference time is EE6342EC.00000321 (7:23:24.801 UTC Sat Oct 31 2026)
clock offset is 0.00 msec, root delay is 0.00  msec
root dispersion is 36.88 msec, peer dispersion is 0.24 msec.
loopfilter state is 'CTRL' (Normal Controlled Loop), drift is - 0.000001193 s/s system poll interval is 5, last update was 12 sec ago.

R1#show ntp associations

address         ref clock       st   when     poll    reach  delay          offset            disp
*~192.168.1.100 127.127.1.1     1    13       32      377    0.00           0.00              0.24
 * sys.peer, # selected, + candidate, - outlyer, x falseticker, ~ configured

R1#show clock
7:23:36.98 UTC Sat Oct 31 2026
```
- **Verification criteria:** Clock is synchronized; stratum is 2; reference is `192.168.1.100`; reachability register equals `377` (octal); active peer flag `*` present.

---

### POS-03: Centralized Syslog Configuration
On `R1`:

```cisco
R1#show logging
Syslog logging: enabled (0 messages dropped, 0 messages rate-limited)
    Logging to 192.168.1.100
```
- **Verification criteria:** Syslog logging enabled with remote destination `192.168.1.100`.

---

### POS-04: Centralized Syslog Server Records
On `LogServer` under **Services > SYSLOG**:

```text
Host: 192.168.1.1
Message: : %SYS-6-LOGGINGHOST_STARTSTOP: Logging to host 192.168.1.100 port 514 started - CLI initiated

Host: 192.168.1.1
Message: %SYS-5-CONFIG_I: Configured from console by console
```
- **Verification criteria:** Initial CLI and config events received over UDP port 514.

---

## 2. Negative Verification (NEG)

### NEG-01: Administrative State Change Logging with NTP Timestamp Precision
To verify that real-time administrative state changes generate remote syslog notifications reflecting the newly synchronized NTP time:

```cisco
R1#configure terminal
R1(config)#interface GigabitEthernet0/0/1
R1(config-if)#shutdown
R1(config-if)#exit
R1(config)#end
```

On `LogServer` under **Services > SYSLOG**, observe the newly received event:

```text
Time: 10.31.2026 07:07:04.910 AM
Host: 192.168.1.1
Message: %SYS-5-CONFIG_I: Configured from console by console
```
- **Analysis:** Timestamp reflects the real synchronized NTP calendar year and millisecond accuracy (`07:07:04.910 AM`), rather than un-synchronized factory default dates.
- **Verification criteria:** Log message contains millisecond resolution and synchronized NTP datetime.

---

### NEG-02: Unreachable NTP Peer Detection
To verify that the router properly rejects non-responsive time servers:

```cisco
R1(config)#ntp server 192.0.2.1
R1(config)#end

R1#show ntp associations
address         ref clock       st   when     poll    reach  delay          offset            disp
 ~192.0.2.1     .INIT.          16   -        64      0      0.00           0.00              0.12
 * sys.peer, # selected, + candidate, - outlyer, x falseticker, ~ configured
```
- **Analysis:** `192.0.2.1` remains at stratum `16`, reach `0`, and `.INIT.` state. It is never marked as a system peer (`*`) or candidate (`+`).
- **Remediation:** Remove the non-existent server using `no ntp server 192.0.2.1`.
- **Verification criteria:** Unreachable server correctly evaluated with Stratum 16 and zero reachability.

