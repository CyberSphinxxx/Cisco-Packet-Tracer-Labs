# Simulator Results: PTL-0038 DHCP Snooping and Rogue DHCP Detection

## Metadata
- **Lab ID:** PTL-0038
- **Slug:** `dhcp-snooping-and-rogue-dhcp-detection`
- **Category:** `network-security`
- **Difficulty:** `advanced`
- **Date Tested:** 2026-10-31
- **Packet Tracer Version:** 9.0.1
- **Overall Status:** PASS (All 7 POS and 2 NEG tests passing)

## Test Results Matrix

| Test ID | Description | Status | Key Output / Evidence |
| :--- | :--- | :--- | :--- |
| **POS-01** | `R1` routed interface & DHCP pool verification | **PASS** | `GigabitEthernet0/0/0 192.168.10.1 up/up`, Pool `CORP-POOL` active with 2 leased addresses |
| **POS-02** | `SW-1` DHCP snooping operational status | **PASS** | `Switch DHCP snooping is enabled`, configured on VLAN 10, option 82 disabled |
| **POS-03** | `SW-1` trusted uplink interface verification | **PASS** | `GigabitEthernet0/1 Trusted: yes, Rate limit: unlimited` |
| **POS-04** | `Client-1` dynamic IP lease from authorized pool | **PASS** | `IPv4 Address: 192.168.10.10, Subnet Mask: 255.255.255.0, Default Gateway: 192.168.10.1` |
| **POS-05** | `Client-2` dynamic IP lease from authorized pool | **PASS** | `IPv4 Address: 192.168.10.11, Subnet Mask: 255.255.255.0, Default Gateway: 192.168.10.1` |
| **POS-06** | `Client-1` ICMP reachability to default gateway | **PASS** | 4/4 echo replies from `192.168.10.1`, 0% loss, round-trip <1ms (TTL=255) |
| **POS-07** | `SW-1` DHCP snooping binding database verification | **PASS** | 2 active bindings (`00:02:16:28:5B:2A` -> `192.168.10.10` on `Fa0/10`, `00:D0:BC:12:BE:79` -> `192.168.10.11` on `Fa0/11`), `Total number of bindings: 2` |
| **NEG-01** | Starter state: Rogue server poisoning vulnerability | **PASS** | Client poisoned with unauthorized `10.66.66.100` lease; ping to corporate gateway `192.168.10.1` times out |
| **NEG-02** | Completed state: Rogue DHCP offer containment | **PASS** | Snooping table contains 0 rogue server bindings on `Fa0/24`; client workstations never receive `10.66.66.x` addresses |

## Reload Verification Evidence
- Reopened `completed.pkt` cleanly via `ipc.appWindow().fileOpen()`.
- Router `R1` and Switch `SW-1` initialized configs from NVRAM without errors.
- Verified `Client-1` renewed legitimate lease `192.168.10.10` and received 4/4 ping replies from default gateway `192.168.10.1`.
- Verified `SW-1` binding table contained both active client bindings (`Total number of bindings: 2`).
- Reopened `starter.pkt` cleanly via `ipc.appWindow().fileOpen()`.
- Verified baseline unprotected state: `show ip dhcp snooping` displays `Switch DHCP snooping is disabled`, and poisoned workstation is unable to reach corporate gateway `192.168.10.1`.
- Reopened `completed.pkt` as the final active canvas state.

