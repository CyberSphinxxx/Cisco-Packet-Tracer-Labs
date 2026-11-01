# Simulator Results: PTL-0042 Named Extended IPv4 ACL for Server Access

## Metadata
- **Lab ID:** PTL-0042
- **Slug:** `named-extended-ipv4-acl-for-server-access`
- **Category:** `network-security`
- **Difficulty:** `intermediate`
- **Date Tested:** 2026-11-01
- **Packet Tracer Version:** 9.0.1
- **Overall Status:** PASS (All 7 POS and 2 NEG tests passing)

## Test Results Matrix

| Test ID | Description | Status | Key Output / Evidence |
| :--- | :--- | :--- | :--- |
| **POS-01** | `R1` routed interfaces addressing and operational status | **PASS** | `Gi0/0/0` (192.168.10.1/24), `Gi0/0/1` (192.168.20.1/24), `Gi0/0/2` (192.168.100.1/24) all `up/up` |
| **POS-02** | Guest LAN to Gateway ICMP Echo reachability | **PASS** | 4/4 echo replies from `192.168.20.1`, 0% packet loss (min 0ms, avg 0ms, max 3ms) |
| **POS-03** | Guest LAN to DMZ Web Server HTTP access permitted | **PASS** | `telnet 192.168.100.10 80` establishes TCP handshake (`Open`) |
| **POS-04** | Guest LAN to Database Server isolation enforced | **PASS** | `ping 192.168.100.20` dropped by `GUEST-FILTER` (`Reply from 192.168.20.1: Destination host unreachable`, 100% loss) |
| **POS-05** | Guest LAN to Staff LAN inter-network isolation enforced | **PASS** | `ping 192.168.10.10` dropped by `GUEST-FILTER` (`Reply from 192.168.20.1: Destination host unreachable`, 100% loss) |
| **POS-06** | Staff LAN full reachability to Server Farm DMZ | **PASS** | `PC-Staff` pings both `DNS-Web-Server` (192.168.100.10) and `DB-Server` (192.168.100.20) with 0% packet loss |
| **POS-07** | Named Extended ACL active hit counters and match statistics | **PASS** | `show access-lists` demonstrates live matches: permit www (5 matches), permit echo (4 matches), deny DMZ (4 matches), deny Staff (4 matches) |
| **NEG-01** | Starter state vulnerability verification | **PASS** | In starter state without ACL applied, `Laptop-Guest` successfully pings `DB-Server` (192.168.100.20, 0% loss), proving baseline security vulnerability |
| **NEG-02** | Starter interface baseline audit | **PASS** | `show ip interface Gi0/0/1` confirms `Inbound access list is not set` |

## Reload Verification Evidence
- Reopened `completed.pkt` cleanly via `ipc.appWindow().fileOpen()`.
- Router `R1` loaded startup configurations from NVRAM without errors.
- Verified `show access-lists` displays named extended ACL `GUEST-FILTER` with DNS, HTTP, HTTPS, ICMP permits, and DMZ/Staff deny rules intact.
- Reopened `starter.pkt` cleanly via `ipc.appWindow().fileOpen()`.
- Verified baseline unconfigured state: `Gi0/0/1` shows `Inbound access list is not set`, and guest can ping `DB-Server`.
- Retained clean state in `starter.pkt` for student entry point.

