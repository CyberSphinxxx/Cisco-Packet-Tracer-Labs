# Simulator Results: PTL-0036 Wireless VLAN Separation and Guest Access

## Metadata
- **Lab ID:** PTL-0036
- **Slug:** `wireless-vlan-separation-and-guest-access`
- **Category:** `wireless-wan`
- **Difficulty:** `intermediate`
- **Date Tested:** 2026-10-31
- **Packet Tracer Version:** 9.0.1
- **Overall Status:** PASS (All 8 POS and 2 NEG tests passing)

## Test Results Matrix

| Test ID | Description | Status | Key Output / Evidence |
| :--- | :--- | :--- | :--- |
| **POS-01** | `Core-SW` SVI interfaces (`Vlan10`, `Vlan20`, `Gi0/1`) up/up and DHCP pools `CORP-POOL`, `GUEST-POOL` | **PASS** | `Vlan10 192.168.10.1 up/up`, `Vlan20 192.168.20.1 up/up`, `GigabitEthernet0/1 192.168.30.1 up/up`, Pools `CORP-POOL` and `GUEST-POOL` active with 1 lease each |
| **POS-02** | `Core-SW` VLAN assignment (`Vlan 10` Corporate, `Vlan 20` Guest) | **PASS** | VLAN 10 assigned to Fa0/2 (Staff-PC) and Fa0/3 (Corp-Server); VLAN 20 assigned to Fa0/1 (AP-Guest) |
| **POS-03** | `AP-Guest` WPA2-PSK AES configuration | **PASS** | `AuthenType: 4` (WPA2-PSK), `EncryptType: 4` (AES), Key `GuestWifiPass2026!` |
| **POS-04** | `Staff-PC` dynamic IP acquisition via DHCP | **PASS** | Leased `192.168.10.11/24`, Gateway `192.168.10.1`, DNS `192.168.30.100`, Domain suffix `corpwifi.local` |
| **POS-05** | `Staff-PC` to `Corp-Server` internal ping (`192.168.10.100`) | **PASS** | 4/4 packets received, 0% loss, round-trip <1ms (TTL=128) |
| **POS-06** | `Staff-PC` to `Web-Server` external DMZ ping (`192.168.30.100`) | **PASS** | 4/4 packets received, 0% loss, round-trip <1ms (TTL=127 routed via Core-SW) |
| **POS-07** | `Guest-Laptop` 802.11 association and dynamic IP acquisition | **PASS** | Leased `192.168.20.11/24`, Gateway `192.168.20.1`, DNS `192.168.30.100`, Domain suffix `guestwifi.local` |
| **POS-08** | `Guest-Laptop` to `Web-Server` external DMZ ping (`192.168.30.100`) | **PASS** | 4/4 packets received, 0% loss, round-trip 9-13ms (TTL=127 routed via Core-SW) |
| **NEG-01** | `Guest-Laptop` to `Corp-Server` ping [BLOCKED BY ACL] | **PASS** | `Reply from 192.168.20.1: Destination host unreachable`, 100% loss (0/4 packets received) |
| **NEG-02** | `Guest-Laptop` to `Staff-PC` ping [BLOCKED BY ACL] | **PASS** | `Reply from 192.168.20.1: Destination host unreachable`, 100% loss (0/4 packets received) |

## Reload Verification Evidence
- Reopened `completed.pkt` cleanly via `ipc.appWindow().fileOpen()`.
- Multilayer switch `Core-SW` successfully restored running-configuration and startup-configuration from NVRAM.
- Verified `Staff-PC` internal reachability to `Corp-Server` (`192.168.10.100`): 4/4 packets received (0% loss).
- Verified `Corp-Server` routed reachability to `Web-Server` (`192.168.30.100`): 3/4 packets received (first packet resolved ARP, 0% loss thereafter).
- Reopened `starter.pkt` cleanly via `ipc.appWindow().fileOpen()`.
- Verified baseline routed reachability between `Corp-Server` and `Web-Server` across SVIs.
- Reopened `completed.pkt` as the active canvas state.
