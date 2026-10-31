# Simulator Results: PTL-0035 WPA2 Wireless LAN Fundamentals

## Metadata
- **Lab ID:** PTL-0035
- **Slug:** `wpa2-wireless-lan-fundamentals`
- **Category:** `wireless-wan`
- **Difficulty:** `beginner`
- **Date Tested:** 2026-10-31
- **Packet Tracer Version:** 9.0.1
- **Overall Status:** PASS (All 7 POS and 2 NEG tests passing)

## Test Results Matrix

| Test ID | Description | Status | Key Output / Evidence |
| :--- | :--- | :--- | :--- |
| **POS-01** | `Edge-R1` Gi0/0/0 configuration and DHCP pool `WLAN-POOL` | **PASS** | `192.168.10.1 up/up`, pool `WLAN-POOL` leased 2 addresses |
| **POS-02** | `Switch-S1` port states Fa0/1, Fa0/2, Fa0/3 | **PASS** | All three ports `connected` in VLAN 1 with PortFast |
| **POS-03** | `AP-1` WPA2-PSK AES configuration | **PASS** | `AuthenType: 4`, `EncryptType: 4`, Key `CiscoLabKey2026!` |
| **POS-04** | `Laptop-1` wireless association and DHCP lease | **PASS** | Leased `192.168.10.11`, Gateway `192.168.10.1`, DNS `ciscolab.local` |
| **POS-05** | `Laptop-1` to Gateway ping (`192.168.10.1`) | **PASS** | 4/4 packets received, 0% loss, round-trip 7-13ms |
| **POS-06** | `Laptop-1` to `Wired-Server` ping (`192.168.10.100`) | **PASS** | 4/4 packets received, 0% loss, round-trip 7-12ms |
| **POS-07** | `Wired-Server` to `Edge-R1` ping (`192.168.10.1`) | **PASS** | 4/4 packets received, 0% loss |
| **NEG-01** | `Laptop-2` with invalid key fails ping to server | **PASS** | `curAp: undefined`, 100% packet loss (Request timed out) |
| **NEG-02** | `Laptop-2` with invalid key cannot reach gateway | **PASS** | `curAp: undefined`, 100% packet loss (Request timed out) |

## Reload Verification Evidence
- Reopened `completed.pkt` cleanly via `fileOpen()`.
- `Laptop-1` preserved WPA2 credentials, automatically associated (`Antenna` link established), and verified reachability.
- Reopened `starter.pkt` cleanly via `fileOpen()`.
- Verified wired infrastructure baseline ping between `Wired-Server` and `Edge-R1` with 100% success (4/4 packets).
- Reopened `completed.pkt` as active canvas state.

