# Simulator Results: PTL-0039 Dynamic ARP Inspection and Spoofing Defense

## Metadata
- **Lab ID:** PTL-0039
- **Slug:** `dynamic-arp-inspection-and-spoofing-defense`
- **Category:** `network-security`
- **Difficulty:** `advanced`
- **Date Tested:** 2026-10-31
- **Packet Tracer Version:** 9.0.1
- **Overall Status:** PASS (All 7 POS and 2 NEG tests passing)

## Test Results Matrix

| Test ID | Description | Status | Key Output / Evidence |
| :--- | :--- | :--- | :--- |
| **POS-01** | `R1` routed interface & DHCP pool operational status | **PASS** | `GigabitEthernet0/0/0 192.168.10.1 up/up`, Pool `CORP-POOL` active with 2 leased addresses |
| **POS-02** | `SW-1` DHCP snooping prerequisite operational status | **PASS** | `Switch DHCP snooping is enabled`, VLAN 10 configured, Option 82 disabled, Gi0/1 trusted |
| **POS-03** | `SW-1` DAI operational status for VLAN 10 & validation checks | **PASS** | `Vlan 10 Configuration: Enabled, Operation: Active`, `Source Mac Validation: Enabled`, `Destination Mac Validation: Enabled`, `IP Address Validation: Enabled` |
| **POS-04** | `SW-1` DAI trusted uplink interface verification | **PASS** | `Gig0/1 Trust State: Trusted, Rate(pps): 15, Burst Interval: 1` |
| **POS-05** | Dynamic leases acquisition & DHCP snooping binding sync | **PASS** | Dynamic leases `192.168.10.10` and `192.168.10.11` leased to Client-1/Client-2, `Total number of bindings: 2` in `show ip dhcp snooping binding` |
| **POS-06** | End-to-end legitimate ARP resolution & ICMP connectivity | **PASS** | Client-1 receives 4/4 echo replies from Gateway `192.168.10.1` (<1ms, TTL=255) and peer Client `192.168.10.10` (<1ms, TTL=128) |
| **POS-07** | `SW-1` global DAI operational summary | **PASS** | `show ip arp inspection` confirms VLAN 10 Enabled/Active and validation checks enabled |
| **NEG-01** | Starter state: Unprotected DAI baseline verification | **PASS** | `show ip arp inspection` confirms `No active or enabled vlans on switch` and validation flags disabled |
| **NEG-02** | Completed state: Untrusted access boundary verification | **PASS** | `show ip arp inspection interfaces` confirms access ports `Fa0/10`, `Fa0/11`, and `Fa0/24` are strictly `Untrusted` (only `Gig0/1` trusted) |

## Reload Verification Evidence
- Reopened `completed.pkt` cleanly via `ipc.appWindow().fileOpen()`.
- Router `R1` and Switch `SW-1` loaded startup configurations from NVRAM without boot stalls.
- Clients acquired dynamic IP addressing via authorized DHCP server `R1`, populating the DHCP snooping binding database on `SW-1`.
- Verified legitimate ARP resolution and ICMP echo reply reachability between clients and router gateway.
- Reopened `starter.pkt` cleanly via `ipc.appWindow().fileOpen()`.
- Verified baseline unprotected state: `show ip arp inspection` displays `No active or enabled vlans on switch` with validation disabled.
- Reopened `completed.pkt` as the final active canvas state.

