# Verification and Acceptance Matrix — PTL-0003

**Lab ID:** PTL-0003  
**Title:** Securing Switch Management with SSH  
**Target Simulator:** Cisco Packet Tracer 8.0+  
**Status:** `NOT_TESTED` (Authoritative Engineering Specification)

---

## 1. Packet Tracer Topology Construction Manifest

To construct or manually verify this topology in Cisco Packet Tracer:

### Device Inventory
| Device Role | PT Device Model | Display Name | Modules / Slots |
|---|---|---|---|
| Managed Access Switch | Cisco Catalyst 2960-24TT | S1 | 24 FastEthernet + 2 GigabitEthernet ports |
| Administrator Workstation | PC-PT | PC-Admin | FastEthernet0 |

### Physical Cabling Matrix
| Link ID | Source Device | Source Port | Destination Device | Destination Port | Cable Type |
|---|---|---|---|---|---|
| L-01 | PC-Admin | FastEthernet0 | S1 | FastEthernet0/1 | Copper Straight-Through |

### Addressing Setup
- **PC-Admin:** IP: `192.168.1.10`, Subnet Mask: `255.255.255.0`, Default Gateway: `192.168.1.2`
- **S1 (SVI VLAN 1):** IP: `192.168.1.2`, Subnet Mask: `255.255.255.0`, Default Gateway: `192.168.1.1`

---

## 2. Positive Verification Test Matrix

| Test ID | Objective | Command / Procedure | Expected Result | Pass Criteria |
|---|---|---|---|---|
| **V-01** | Verify SVI Status | `S1# show ip interface brief` | `Vlan1` status is `up`, protocol is `up`, IP address is `192.168.1.2`. | SVI active and operational |
| **V-02** | Verify SSHv2 Operational Status | `S1# show ip ssh` | Displays: `SSH Enabled - version 2.0`, `Authentication timeout: 120 secs; Authentication retries: 3`. | SSH version 2 strictly active |
| **V-03** | Verify RSA Cryptographic Key | `S1# show crypto key mypubkey rsa` | Displays key named `S1.lab.local` with modulus size 1024 bits and general-purpose key pair. | Valid RSA key pair generated |
| **V-04** | Verify VTY Line Restrictions | `S1# show running-config \| section line vty` | Output contains `login local` and `transport input ssh` under `line vty 0 15`. | Telnet disabled on all VTY lines |
| **V-05** | Remote SSH Login from Management PC | On PC-Admin Command Prompt:<br>`PC> ssh -l admin 192.168.1.2`<br>Enter password: `adminpass123` | Password accepted; command prompt changes to `S1>` or `S1#`. Authorized access granted. | Authenticated SSH session established |

---

## 3. Negative & Security Rejection Test Matrix

| Test ID | Security Scenario | Execution Procedure | Observed Result | Pass Criteria |
|---|---|---|---|---|
| **NEG-01** | Unencrypted Telnet Rejection | On PC-Admin Command Prompt:<br>`PC> telnet 192.168.1.2` | Terminal displays: `Trying 192.168.1.2 ...`<br>`[Connection to 192.168.1.2 closed by foreign host]` or connection refused. | Telnet session rejected immediately by switch |
| **NEG-02** | Invalid Authentication Rejection | On PC-Admin Command Prompt:<br>`PC> ssh -l admin 192.168.1.2`<br>Enter incorrect password: `wrongpass` | Switch rejects password: `% Access denied`. Connection terminates after failed retry threshold. | Unauthorized access refused |
| **NEG-03** | SSHv1 Protocol Downgrade Rejection | Attempt connection forcing SSHv1 client negotiation. | Switch rejects connection negotiation because `ip ssh version 2` forbids version 1 handshake. | Protocol downgrade attack prevented |

---

## 4. Save and Persistence Verification Check

1. On S1, issue `copy running-config startup-config`.
2. Save the topology file (`.pkt`).
3. Reload or power-cycle the switch.
4. Verify `show ip ssh` confirms SSH remains enabled with version 2.0 without regenerating keys.
5. Confirm PC-Admin can immediately reconnect via SSH without console intervention.
