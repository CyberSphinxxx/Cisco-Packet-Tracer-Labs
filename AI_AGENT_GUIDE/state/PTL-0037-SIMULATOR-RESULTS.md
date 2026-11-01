# Simulator Results: PTL-0037 DNS Resolution Failure Troubleshooting

## Metadata
- **Lab ID:** PTL-0037
- **Slug:** `dns-resolution-failure-troubleshooting`
- **Category:** `network-services`
- **Difficulty:** `beginner`
- **Date Tested:** 2026-10-31
- **Packet Tracer Version:** 9.0.1
- **Overall Status:** PASS (All 7 POS and 2 NEG tests passing)

## Test Results Matrix

| Test ID | Description | Status | Key Output / Evidence |
| :--- | :--- | :--- | :--- |
| **POS-01** | `R1` routed interface verification (`Gi0/0/0`, `Gi0/0/1`) | **PASS** | `GigabitEthernet0/0/0 192.168.1.1 up/up`, `GigabitEthernet0/0/1 192.168.2.1 up/up` |
| **POS-02** | `PC-1` to `Web-Server` Direct IP ping (`192.168.2.20`) | **PASS** | 4/4 packets received, 0% loss, round-trip <1ms (TTL=127) |
| **POS-03** | `DNS-Server` service state & resource records | **PASS** | `{"enabled": true, "recordCount": 3}` (`corpweb.local`, `portal.corpweb.local`, `www.corpweb.local`) |
| **POS-04** | `PC-1` DNS query `nslookup corpweb.local` | **PASS** | Resolved via `192.168.2.10`: `Name: corpweb.local`, `Address: 192.168.2.20` |
| **POS-05** | `PC-1` FQDN ping `ping corpweb.local` | **PASS** | Hostname resolved to `192.168.2.20`, 4/4 packets received, 0% loss (TTL=127) |
| **POS-06** | `PC-2` DNS query `nslookup portal.corpweb.local` | **PASS** | Resolved via `192.168.2.10`: `Name: portal.corpweb.local`, `Address: 192.168.2.20` |
| **POS-07** | `PC-2` CNAME query `nslookup www.corpweb.local` | **PASS** | Resolved via `192.168.2.10`: `Aliases: corpweb.local`, `Address: 192.168.2.20` |
| **NEG-01** | `PC-1` query with wrong DNS server IP (`192.168.2.99`) | **PASS** | `Server: [192.168.2.99]`, `DNS request timed out. timeout was 15000 milli seconds.` |
| **NEG-02** | `PC-2` query for non-existent domain (`unknown.corpweb.local`) | **PASS** | `Server: [192.168.2.10]`, `*** UnKnown can't find unknown.corpweb.local: Non-existent domain.` |

## Reload Verification Evidence
- Reopened `completed.pkt` cleanly via `ipc.appWindow().fileOpen()`.
- Router `R1` successfully restored running-configuration and startup-configuration from NVRAM.
- Verified `PC-1` FQDN reachability to `corpweb.local`: hostname resolved to `192.168.2.20` and 4/4 ping replies received.
- Reopened `starter.pkt` cleanly via `ipc.appWindow().fileOpen()`.
- Verified baseline state: Direct IP ping `ping 192.168.2.20` succeeded (3/3 replies after initial ARP resolution), proving layer 1-3 network routing is fully functional.
- Verified baseline failure state: `nslookup corpweb.local` on `PC-1` timed out querying invalid DNS server `192.168.2.99`.
- Reopened `completed.pkt` as the active canvas state.

