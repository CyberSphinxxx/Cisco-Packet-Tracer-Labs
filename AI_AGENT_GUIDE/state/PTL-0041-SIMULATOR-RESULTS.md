# Simulator Results: PTL-0041 IPv4 ACL Troubleshooting with Traffic Matrix

## Metadata
- **Lab ID:** PTL-0041
- **Slug:** `ipv4-acl-troubleshooting-with-traffic-matrix`
- **Category:** `network-security`
- **Difficulty:** `intermediate`
- **Date Tested:** 2026-11-01
- **Packet Tracer Version:** 9.0.1
- **Overall Status:** PASS (All 7 POS and 2 NEG tests passing)

## Test Results Matrix

| Test ID | Description | Status | Key Output / Evidence |
| :--- | :--- | :--- | :--- |
| **POS-01** | `R1` routed interfaces addressing and operational status | **PASS** | `Gi0/0/0` (192.168.10.1/24), `Gi0/0/1` (192.168.20.1/24), `Gi0/0/2` (192.168.30.1/24) all `up/up` |
| **POS-02** | Sales LAN to Gateway ICMP Echo reachability | **PASS** | 4/4 echo replies from `192.168.10.1`, 0% packet loss (min 0ms, avg 0ms, max 0ms) |
| **POS-03** | Sales LAN to Server Farm HTTP access permitted | **PASS** | `telnet 192.168.30.10 80` establishes TCP handshake (`Open`) |
| **POS-04** | Sales LAN to Finance Server isolation enforced | **PASS** | `ping 192.168.30.20` dropped by `SALES-FILTER` (`Reply from 192.168.10.1: Destination host unreachable`, 100% loss) |
| **POS-05** | Sales LAN to HR LAN inter-VLAN isolation enforced | **PASS** | `ping 192.168.20.10` dropped by `SALES-FILTER` (`Reply from 192.168.10.1: Destination host unreachable`, 100% loss) |
| **POS-06** | HR LAN full reachability to Server Farm DMZ | **PASS** | `PC-HR` pings both `Web-Server` (192.168.30.10) and `Finance-Server` (192.168.30.20) with 0% packet loss |
| **POS-07** | Extended ACL active hit counters and match statistics | **PASS** | `show access-lists` demonstrates live matches: permit www (5 matches), permit echo (4 matches), deny DMZ (4 matches), deny HR (4 matches) |
| **NEG-01** | Starter state: Shadowed rule & misplaced filter verification | **PASS** | PC-Sales HTTP probe to Web-Server fails (`telnet 192.168.30.10 80` times out) due to shadowed deny rule and `out` interface placement |
| **NEG-02** | Starter fault audit: Filter direction & wildcard errors | **PASS** | `show ip interface Gi0/0/0` reveals `Outgoing access list is SALES-FILTER` (missing inbound filtering); ACL 10 has inverted wildcard mask `255.255.255.0` |

## Reload Verification Evidence
- Reopened `completed.pkt` cleanly via `ipc.appWindow().fileOpen()`.
- Router `R1` loaded startup configurations from NVRAM without errors.
- Verified `show access-lists` displays standard ACL 10 and extended ACL `SALES-FILTER` with permit rules sequentially preceding deny rules.
- Reopened `starter.pkt` cleanly via `ipc.appWindow().fileOpen()`.
- Verified baseline faulted state: `SALES-FILTER` has `deny ip 192.168.10.0 ... 192.168.30.0` at line 10 shadowing permit HTTP at line 20, `Gi0/0/0` shows `Outgoing access list is SALES-FILTER`, and PC-Sales cannot establish HTTP connections to `Web-Server`.
- Retained clean state in `starter.pkt` for student entry point.
