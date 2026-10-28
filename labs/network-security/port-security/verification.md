# Verification and Acceptance Matrix — PTL-0004

**Lab ID:** PTL-0004  
**Title:** Implementing Switchport Port Security  
**Status:** `TESTED_PASS` (Verified live in Cisco Packet Tracer 9.0.1 via MCP loopback bridge automation)

---

## 1. Packet Tracer Topology Construction Manifest

To construct or manually verify this topology in Cisco Packet Tracer:

### Device Inventory
| Device Role | PT Device Model | Display Name | Modules / Slots |
|---|---|---|---|
| Access Switch | Cisco Catalyst 2960-24TT | S1 | 24 FastEthernet + 2 GigabitEthernet ports |
| Authorized Workstation | PC-PT | Authorized-PC | FastEthernet0 |
| Rogue Testing Workstation | Laptop-PT | Rogue-Laptop | FastEthernet0 |

### Physical Cabling Matrix
| Link ID | Source Device | Source Port | Destination Device | Destination Port | Cable Type | Notes |
|---|---|---|---|---|---|---|
| L-01 | Authorized-PC | FastEthernet0 | S1 | FastEthernet0/1 | Copper Straight-Through | Normal authorized link |
| L-TEST | Rogue-Laptop | FastEthernet0 | S1 | FastEthernet0/1 | Copper Straight-Through | Swapped in during violation test |

### Addressing Setup
- **Authorized-PC:** IP: `192.168.1.10`, Subnet Mask: `255.255.255.0`, Default Gateway: `192.168.1.2`
- **Rogue-Laptop:** IP: `192.168.1.50`, Subnet Mask: `255.255.255.0`, Default Gateway: `192.168.1.2`
- **S1 (SVI VLAN 1):** IP: `192.168.1.2`, Subnet Mask: `255.255.255.0`, Default Gateway: `192.168.1.1`

---

## 2. Positive Verification Test Matrix

| Test ID | Objective | Command / Procedure | Expected Result | Pass Criteria |
|---|---|---|---|---|
| **V-01** | Verify Port Security Operational State | `S1# show port-security interface FastEthernet0/1` | `Port Security: Enabled`, `Port Status: Secure-up`, `Violation Mode: Shutdown`, `Maximum MAC Addresses: 1`, `Security Violation Count: 0`. | Port security enabled with shutdown action |
| **V-02** | Verify Sticky MAC Dynamic Learning | Generate traffic from Authorized-PC (`ping 192.168.1.2`), then on S1 run:<br>`S1# show port-security address` | Displays Authorized-PC's hardware MAC address under `Vlan 1`, Type: `SecureSticky`, Port: `Fa0/1`. | MAC address dynamically learned and bound |
| **V-03** | Verify Running-Config Sticky Entry | `S1# show running-config interface FastEthernet0/1` | Contains line `switchport port-security mac-address sticky <mac-address>`. | MAC converted to sticky config entry |
| **V-04** | Verify Authorized Host Reachability | `Authorized-PC> ping 192.168.1.2` | 4 echo requests succeed (ICMP replies received, 0% packet loss). | Authorized host maintains normal network access |

---

## 3. Negative & Security Violation Test Matrix

| Test ID | Security Scenario | Execution Procedure | Observed Result | Pass Criteria |
|---|---|---|---|---|
| **NEG-01** | Unauthorized Device Violation Trigger | 1. Unplug Authorized-PC from S1 Fa0/1.<br>2. Plug Rogue-Laptop into S1 Fa0/1.<br>3. From Rogue-Laptop: `ping 192.168.1.2`. | Link LED immediately turns amber/red. Console displays:<br>`%PM-4-ERR_DISABLE: psecure-violation error detected on Fa0/1, putting Fa0/1 in err-disable state`. | Port instantly disabled upon foreign frame reception |
| **NEG-02** | Verify Err-Disabled State | `S1# show interface FastEthernet0/1 status` | Port `Fa0/1` status is displayed as `err-disabled`. `show port-security interface Fa0/1` shows `Port Status: Secure-shutdown`, `Security Violation Count: 1`. | Interface placed into secure error-disabled state |
| **NEG-03** | Interface Recovery Procedure | 1. Disconnect Rogue-Laptop and reconnect Authorized-PC.<br>2. On S1: `interface Fa0/1`, issue `shutdown` then `no shutdown`. | Interface transitions from `err-disabled` to `up/up`. Link LED turns green. Authorized-PC pings resume successfully. | Manual port bounce recovers interface cleanly |

---

## 4. Save and Persistence Verification Check

1. On S1, issue `copy running-config startup-config`.
2. Save the topology file (`.pkt`).
3. Reload or power-cycle the switch.
4. Verify `show running-config interface Fa0/1` retains the sticky MAC address across reboot.
5. Re-ping from Authorized-PC; verify no violation occurs and access is preserved.
