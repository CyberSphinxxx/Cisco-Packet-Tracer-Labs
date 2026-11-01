# Verification and Acceptance Matrix — PTL-0039

**Lab ID:** PTL-0039  
**Title:** Dynamic ARP Inspection and Spoofing Defense  
**Status:** `TESTED_PASS` (Verified live in Cisco Packet Tracer 9.0.1 via MCP loopback bridge automation)

---

## 1. Packet Tracer Topology Construction Manifest

To construct or manually verify this topology in Cisco Packet Tracer:

### Device Inventory
| Device Role | PT Device Model | Display Name | Modules / Slots |
|---|---|---|---|
| Authorized Gateway & DHCP Server | Cisco ISR 4321 | R1 | Default `GigabitEthernet0/0/0` |
| Layer 2 Access Switch | Cisco Catalyst 2960-24TT | SW-1 | 24 FastEthernet + 2 GigabitEthernet ports |
| Corporate Client 1 | PC-PT | Client-1 | FastEthernet0 |
| Corporate Client 2 | PC-PT | Client-2 | FastEthernet0 |
| Rogue / Untrusted Host | Server-PT | Rogue-Server | FastEthernet0 |

### Physical Cabling Matrix
| Link ID | Source Device | Source Port | Destination Device | Destination Port | Cable Type |
|---|---|---|---|---|---|
| L-01 | R1 | GigabitEthernet0/0/0 | SW-1 | GigabitEthernet0/1 | Copper Straight-Through |
| L-02 | SW-1 | FastEthernet0/10 | Client-1 | FastEthernet0 | Copper Straight-Through |
| L-03 | SW-1 | FastEthernet0/11 | Client-2 | FastEthernet0 | Copper Straight-Through |
| L-04 | SW-1 | FastEthernet0/24 | Rogue-Server | FastEthernet0 | Copper Straight-Through |

---

## 2. Positive Verification Test Matrix

| Test ID | Objective | Command / Procedure | Expected Result | Pass Criteria |
|---|---|---|---|---|
| **POS-01** | Router Interface & DHCP Pool | `R1# show ip interface brief`<br>`R1# show ip dhcp pool` | `GigabitEthernet0/0/0` (192.168.10.1) status `up`, protocol `up`. Pool `CORP-POOL` active with dynamic lease allocation. | Routed interface up/up and DHCP pool operational |
| **POS-02** | DHCP Snooping Prerequisite Status | `SW-1# show ip dhcp snooping` | `Switch DHCP snooping is enabled`, VLAN 10 configured, Option 82 disabled, Gi0/1 trusted. | Snooping operational with trusted uplink |
| **POS-03** | Global & VLAN DAI Status with Validation | `SW-1# show ip arp inspection vlan 10` | `Vlan 10 Enabled Active`, `Source Mac Validation: Enabled`, `Destination Mac Validation: Enabled`, `IP Address Validation: Enabled`. | DAI active on VLAN 10 with all 3 validation checks enabled |
| **POS-04** | DAI Uplink Trust State | `SW-1# show ip arp inspection interfaces GigabitEthernet0/1` | `Gig0/1` listed with `Trust State: Trusted`, rate 15 pps. | Uplink interface designated as trusted |
| **POS-05** | Dynamic Leases & Snooping Bindings | `Client-1> ipconfig`<br>`SW-1# show ip dhcp snooping binding` | Clients lease dynamic IPs in `192.168.10.0/24`. Snooping table contains dynamic bindings for Client-1 and Client-2 (`Total number of bindings: 2`). | IP leases synchronized with snooping table |
| **POS-06** | End-to-End ARP & ICMP Connectivity | `Client-1> ping 192.168.10.1`<br>`Client-1> ping 192.168.10.10` (or peer) | 4/4 echo replies received from Gateway and peer workstation with 0% loss. | Legitimate ARP packets processed and forwarded |
| **POS-07** | DAI Operational Summary | `SW-1# show ip arp inspection` | Confirms VLAN 10 enabled and active, validation flags enabled. | Global DAI operational summary verified |

---

## 3. Negative & Fault Tolerance Test Matrix

| Test ID | Fault Scenario | Injection Procedure | Observed Symptom | Recovery Procedure |
|---|---|---|---|---|
| **NEG-01** | Unprotected Switch Baseline Check | On starter topology (DAI disabled), inspect DAI status on `SW-1`. | `SW-1# show ip arp inspection` returns `No active or enabled vlans on switch` and validation checks `Disabled`. Baseline switch vulnerable to ARP spoofing. | Enable `ip arp inspection vlan 10`, configure `ip arp inspection validate src-mac dst-mac ip`, and trust uplink port. |
| **NEG-02** | Untrusted Boundary Enforcement | On completed topology, verify trust state across all user-facing access interfaces (`Fa0/10`, `Fa0/11`, `Fa0/24`). | `show ip arp inspection interfaces` confirms access ports are strictly `Untrusted` (only `Gig0/1` is trusted). Any unauthorized ARP originating on host ports is bound to snooping validation. | Designate only infrastructure uplinks as trusted; ensure all end-user and attacker-facing ports remain untrusted. |

---

## 4. Save and Persistence Verification Check

- **Startup Configuration Sync:** Executed `copy running-config startup-config` on both `SW-1` and `R1`.
- **Packet Tracer Reload Verification:**
  - `completed.pkt` reloaded via `ipc.appWindow().fileOpen()`.
  - Router `R1` and Switch `SW-1` preserved configurations without boot dialog stalls.
  - Clients successfully renewed IP configurations from `R1` and established 100% ICMP ping reachability to default gateway `192.168.10.1` and peer client.
  - `show ip arp inspection vlan 10` retained `Active` operational status and multi-attribute validation flags.
  - `starter.pkt` reloaded and verified to be in the baseline uninspected state.

