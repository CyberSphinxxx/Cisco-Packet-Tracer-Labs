# Simulator Results: PTL-0040 Port Security Violation Troubleshooting

## Metadata
- **Lab ID:** PTL-0040
- **Slug:** `port-security-violation-troubleshooting`
- **Category:** `network-security`
- **Difficulty:** `intermediate`
- **Date Tested:** 2026-11-01
- **Packet Tracer Version:** 9.0.1
- **Overall Status:** PASS (All 7 POS and 2 NEG tests passing)

## Test Results Matrix

| Test ID | Description | Status | Key Output / Evidence |
| :--- | :--- | :--- | :--- |
| **POS-01** | `R1` gateway interface operational status | **PASS** | `GigabitEthernet0/0/0 192.168.10.1 up/up` |
| **POS-02** | `SW-1` `Fa0/1` recovered port security status | **PASS** | `Port Security: Enabled`, `Port Status: Secure-up`, `Violation Mode: Shutdown`, `Sticky MAC Addresses: 1` (`0002.1715.6B73`) |
| **POS-03** | `SW-1` `Fa0/2` recovered port security status | **PASS** | `Port Security: Enabled`, `Port Status: Secure-up`, `Violation Mode: Shutdown`, `Sticky MAC Addresses: 1` (`0002.4A47.3CD2`) |
| **POS-04** | `SW-1` `Fa0/3` audit-compliant violation mode | **PASS** | `Port Security: Enabled`, `Port Status: Secure-up`, `Violation Mode: Restrict` |
| **POS-05** | `SW-1` interface operational table | **PASS** | `Fa0/1`, `Fa0/2`, and `Fa0/3` all `connected` (0 ports in `err-disabled`) |
| **POS-06** | `PC-1` end-to-end IP gateway reachability | **PASS** | 4/4 echo replies from `192.168.10.1`, 0% loss (min 0ms, avg 1ms, max 7ms) |
| **POS-07** | `PC-2` end-to-end IP gateway reachability | **PASS** | 4/4 echo replies from `192.168.10.1`, 0% loss (min 0ms, avg 8ms, max 20ms) |
| **NEG-01** | Starter state: `err-disabled` latch verification | **PASS** | `Fa0/1` and `Fa0/2` in `err-disabled` state; `Fa0/1` `Secure-shutdown` with violation count 1; `PC-1` ping times out |
| **NEG-02** | Completed state: Active security policy integrity | **PASS** | `show port-security` confirms `Fa0/1`, `Fa0/2`, and `Fa0/3` have port security actively enforced (`Shutdown` / `Restrict`) without security being disabled |

## Reload Verification Evidence
- Reopened `completed.pkt` cleanly via `ipc.appWindow().fileOpen()`.
- Router `R1` and Switch `SW-1` loaded startup configurations from NVRAM without errors.
- Verified `PC-1` and `PC-2` maintained legitimate sticky MAC bindings and received 4/4 ping replies from default gateway `192.168.10.1`.
- Reopened `starter.pkt` cleanly via `ipc.appWindow().fileOpen()`.
- Verified baseline faulted state: `show interfaces status` displays `Fa0/1` and `Fa0/2` as `err-disabled`, and `PC-1` gateway ping fails with `Request timed out`.
- Reopened `completed.pkt` as the final active canvas state.

