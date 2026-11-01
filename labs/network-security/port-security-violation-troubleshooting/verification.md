# Verification and Acceptance Matrix — PTL-0040

**Lab ID:** PTL-0040  
**Title:** Port Security Violation Troubleshooting  
**Status:** `TESTED_PASS` (Verified live in Cisco Packet Tracer 9.0.1 via MCP loopback bridge automation)

---

## 1. Packet Tracer Topology Construction Manifest

To construct or manually verify this topology in Cisco Packet Tracer:

### Device Inventory
| Device Role | PT Device Model | Display Name | Modules / Slots |
|---|---|---|---|
| Corporate Default Gateway | Cisco ISR 4321 | R1 | Default `GigabitEthernet0/0/0` |
| Layer 2 Access Switch | Cisco Catalyst 2960-24TT | SW-1 | 24 FastEthernet + 2 GigabitEthernet ports |
| Accounting Workstation | PC-PT | PC-1 | FastEthernet0 |
| Engineering Workstation | PC-PT | PC-2 | FastEthernet0 |
| Untrusted / Test Laptop | Laptop-PT | Rogue-Laptop | FastEthernet0 |

### Physical Cabling Matrix
| Link ID | Source Device | Source Port | Destination Device | Destination Port | Cable Type |
|---|---|---|---|---|---|
| L-01 | R1 | GigabitEthernet0/0/0 | SW-1 | GigabitEthernet0/1 | Copper Straight-Through |
| L-02 | SW-1 | FastEthernet0/1 | PC-1 | FastEthernet0 | Copper Straight-Through |
| L-03 | SW-1 | FastEthernet0/2 | PC-2 | FastEthernet0 | Copper Straight-Through |
| L-04 | SW-1 | FastEthernet0/3 | Rogue-Laptop | FastEthernet0 | Copper Straight-Through |

---

## 2. Positive Verification Test Matrix

| Test ID | Objective | Command / Procedure | Expected Result | Pass Criteria |
|---|---|---|---|---|
| **POS-01** | Gateway Interface Operational Status | `R1# show ip interface brief` | `GigabitEthernet0/0/0` (192.168.10.1) status `up`, protocol `up`. | Gateway interface operational |
| **POS-02** | Fa0/1 Port Security Recovery | `SW-1# show port-security interface FastEthernet0/1` | `Port Security: Enabled`, `Port Status: Secure-up`, `Violation Mode: Shutdown`, `Sticky MAC Addresses: 1` matching `PC-1`. | Fa0/1 recovered and bound to PC-1 |
| **POS-03** | Fa0/2 Port Security Recovery | `SW-1# show port-security interface FastEthernet0/2` | `Port Security: Enabled`, `Port Status: Secure-up`, `Violation Mode: Shutdown`, `Sticky MAC Addresses: 1` matching `PC-2`. | Fa0/2 recovered and bound to PC-2 |
| **POS-04** | Fa0/3 Audit-Compliant Restrict Mode | `SW-1# show port-security interface FastEthernet0/3` | `Port Security: Enabled`, `Port Status: Secure-up`, `Violation Mode: Restrict`. | Fa0/3 configured with restrict mode |
| **POS-05** | Switchport Operational Status | `SW-1# show interfaces status` | `Fa0/1`, `Fa0/2`, and `Fa0/3` report status `connected`; zero ports report `err-disabled`. | All access ports active and online |
| **POS-06** | PC-1 End-to-End IP Reachability | `PC-1> ping 192.168.10.1` | 4/4 echo replies received from `192.168.10.1` with TTL=255 and 0% packet loss. | PC-1 gateway communication restored |
| **POS-07** | PC-2 End-to-End IP Reachability | `PC-2> ping 192.168.10.1` | 4/4 echo replies received from `192.168.10.1` with TTL=255 and 0% packet loss. | PC-2 gateway communication restored |

---

## 3. Negative & Fault Tolerance Test Matrix

| Test ID | Fault Scenario | Injection Procedure | Observed Symptom | Recovery Procedure |
|---|---|---|---|---|
| **NEG-01** | Starter State: Error-Disabled Latch | On starter topology, inspect interfaces `Fa0/1` and `Fa0/2` and test ping from `PC-1`. | `show interfaces status` reports `Fa0/1` and `Fa0/2` as `err-disabled`. `show port-security interface` displays `Secure-shutdown` with `Security Violation Count: 1`. Pings from `PC-1` fail with `Request timed out`. | Remove stale sticky MAC entry (`no switchport port-security mac-address sticky <mac>`), cycle interface with `shutdown` followed by `no shutdown`, and allow authorized workstation to transmit. |
| **NEG-02** | Completed State: Active Security Policy | On completed topology, execute `show port-security` to verify security policies remain active across all access ports. | `Fa0/1`, `Fa0/2`, and `Fa0/3` are all listed with `MaxSecureAddr=1` and `SecurityAction=Shutdown` or `Restrict`. Security is not bypassed or disabled. | Confirms proper remediation: links are restored through configuration correction rather than disabling port security. |

---

## 4. Save and Persistence Verification Check

- **Startup Configuration Sync:** Executed `copy running-config startup-config` on both `SW-1` and `R1`.
- **Packet Tracer Reload Verification:**
  - `completed.pkt` reloaded via `ipc.appWindow().fileOpen()`.
  - Router `R1` and Switch `SW-1` preserved configurations without boot dialog stalls.
  - Workstations `PC-1` and `PC-2` maintained legitimate sticky MAC bindings and established 100% ICMP ping reachability to default gateway `192.168.10.1`.
  - `show interfaces status` confirmed 0 ports in `err-disabled`.
  - `starter.pkt` reloaded and verified to remain in the faulted baseline state with `Fa0/1` and `Fa0/2` latched in `err-disabled`.

