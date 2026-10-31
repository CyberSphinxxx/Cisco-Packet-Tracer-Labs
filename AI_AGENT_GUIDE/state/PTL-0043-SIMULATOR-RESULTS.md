# Simulator Results: PTL-0043 NAT and PAT Troubleshooting Challenge

## Metadata
- **Lab ID:** PTL-0043
- **Slug:** `nat-and-pat-troubleshooting-challenge`
- **Category:** `network-services`
- **Difficulty:** `intermediate`
- **Date Tested:** 2026-11-01
- **Packet Tracer Version:** 9.0.1
- **Overall Status:** PASS (All 7 POS and 2 NEG tests passing)

## Test Results Matrix

| Test ID | Description | Status | Key Output / Evidence |
| :--- | :--- | :--- | :--- |
| **POS-01** | Local default gateway reachability for Staff and Guest LANs | **PASS** | `PC-Staff` reaches gateway `192.168.10.1` and `Laptop-Guest` reaches gateway `192.168.20.1` (4/4 echo replies, 0% loss) |
| **POS-02** | NAT Inside and Outside interface designations | **PASS** | `show ip nat statistics` confirms Inside interfaces `GigabitEthernet0/0/0`, `GigabitEthernet0/0/1` and Outside interface `GigabitEthernet0/0/2` |
| **POS-03** | Standard ACL 1 translation criteria verification | **PASS** | `show access-lists 1` displays active permits for `192.168.10.0/24` and `192.168.20.0/24` with non-zero match counters (8 matches each) |
| **POS-04** | Staff LAN outbound PAT to public Internet server | **PASS** | `PC-Staff` pings `Web-Server` (`198.51.100.10`) with 4/4 echo replies (0% loss, TTL=126) |
| **POS-05** | Guest LAN outbound PAT to public Internet server | **PASS** | `Laptop-Guest` pings `Web-Server` (`198.51.100.10`) with 4/4 echo replies (0% loss, TTL=126) |
| **POS-06** | Outbound TCP/HTTP port translation | **PASS** | `PC-Staff` connects to `198.51.100.10:80` via telnet establishing TCP connection (`Trying 198.51.100.10 ...Open`) |
| **POS-07** | Active NAT translation table and statistical counters | **PASS** | `show ip nat translations` demonstrates concurrent ICMP and TCP translations sharing global IP `203.0.113.1` across `192.168.10.10` and `192.168.20.10`; `show ip nat statistics` confirms 20 hits, 17 misses |
| **NEG-01** | Starter state translation failure verification | **PASS** | In starter state, `PC-Staff` ping to `198.51.100.10` fails with 100% loss (`Request timed out`), confirming non-functioning state before troubleshooting |
| **NEG-02** | Starter state fault identification | **PASS** | In starter state, `show ip nat translations` is completely empty (0 entries), `show ip nat statistics` shows 0 outside interfaces, and ACL 1 shows subnet typo `192.168.1.0/24` with missing guest subnet |

## Reload Verification Evidence
- Reopened `completed.pkt` cleanly from disk via `ipc.appWindow().fileOpen()`.
- Router `Edge-R1` loaded startup configurations from NVRAM without errors.
- Verified `show ip nat statistics` displays both inside interfaces (`Gi0/0/0`, `Gi0/0/1`) and outside interface (`Gi0/0/2`).
- Verified `show access-lists 1` displays permits for both `192.168.10.0/24` and `192.168.20.0/24`.
- Reopened `starter.pkt` cleanly from disk via `ipc.appWindow().fileOpen()`.
- Verified baseline faulted state: `Gi0/0/1` lacks `ip nat inside`, `Gi0/0/2` is mistakenly `ip nat inside`, ACL 1 has typo `192.168.1.0`, and PC-Staff cannot reach external services.
- Retained clean state in `starter.pkt` for student entry point.

