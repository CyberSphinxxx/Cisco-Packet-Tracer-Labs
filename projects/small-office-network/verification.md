# Verification and Acceptance Matrix — Small Office Capstone

**Project:** Capstone Project: Small Office Multi-VLAN Network Design  
**Target Simulator:** Cisco Packet Tracer 9.0.1<br>
**Status:** `TESTED_PASS` (Verified live in Cisco Packet Tracer 9.0.1 via MCP loopback bridge automation)

---

## 1. Packet Tracer Topology Construction Manifest

To construct or manually verify this capstone network in Cisco Packet Tracer:

### Device Inventory
| Device Role | PT Device Model | Display Name | Modules / Slots |
|---|---|---|---|
| Branch Gateway Router | Cisco ISR 4321 | R1 | Default GigabitEthernet interfaces |
| HQ / ISP Border Router | Cisco ISR 4321 | R2 | Default GigabitEthernet interfaces + Loopback0 |
| Branch Access Switch | Cisco Catalyst 2960-24TT | S1 | 24 FastEthernet + 2 GigabitEthernet ports |
| Management Workstation | PC-PT | PC-Mgmt | FastEthernet0 |
| Staff Workstation | PC-PT | PC-Staff | FastEthernet0 |
| Guest Workstation | PC-PT | PC-Guest | FastEthernet0 |
| Rogue Testing Workstation | Laptop-PT | Rogue-Laptop | FastEthernet0 |

### Physical Cabling Matrix
| Link ID | Source Device | Source Port | Destination Device | Destination Port | Cable Type | Notes |
|---|---|---|---|---|---|---|
| L-01 | R1 | GigabitEthernet0/0/0 | S1 | GigabitEthernet0/1 | Copper Straight-Through | 802.1Q Trunk Link |
| L-02 | R1 | GigabitEthernet0/0/1 | R2 | GigabitEthernet0/0/1 | Copper Straight-Through | WAN Point-to-Point Link |
| L-03 | PC-Mgmt | FastEthernet0 | S1 | FastEthernet0/1 | Copper Straight-Through | VLAN 10 Access Port |
| L-04 | PC-Staff | FastEthernet0 | S1 | FastEthernet0/6 | Copper Straight-Through | VLAN 20 Port-Security Port |
| L-05 | PC-Guest | FastEthernet0 | S1 | FastEthernet0/16 | Copper Straight-Through | VLAN 30 Guest Port |

### Addressing Setup
- **R1 WAN (Gi0/0/1):** `209.165.200.225/30`
- **R2 WAN (Gi0/0/1):** `209.165.200.226/30`
- **R2 Simulated Cloud (Loopback0):** `209.165.201.1/24`
- **R1 Subinterfaces:**
  - `Gi0/0/0.10` (VLAN 10 Mgmt): `192.168.10.1/24`
  - `Gi0/0/0.20` (VLAN 20 Staff): `192.168.20.1/24`
  - `Gi0/0/0.30` (VLAN 30 Guest): `192.168.30.1/24` (ACL filtered)
- **S1 Management SVI (VLAN 10):** `192.168.10.2/24`, Gateway: `192.168.10.1`
- **PC-Mgmt:** Static IP: `192.168.10.10/24`, Gateway: `192.168.10.1`
- **PC-Staff:** DHCP Assigned (`192.168.20.11/24`), Gateway: `192.168.20.1`, DNS Server: `208.67.222.222`, Domain Name: `apex.local`
- **PC-Guest:** DHCP Assigned (`192.168.30.11/24`), Gateway: `192.168.30.1`, DNS Server: `208.67.222.222`, Domain Name: `guest.apex.local`

---

## 2. Positive Verification Test Matrix

| Test ID | Objective | Command / Procedure | Expected Result | Pass Criteria |
|---|---|---|---|---|
| **V-01** | Verify 802.1Q Trunking & Subinterfaces | `S1# show interfaces trunk`<br>`R1# show ip interface brief` | S1 Gi0/1 is trunking, native VLAN is 999, allowed VLANs 10,20,30. R1 subinterfaces `Gi0/0/0.10`, `.20`, `.30` are `up/up`. | Router-on-a-Stick trunk fully active |
| **V-02** | Staff Dynamic DHCP Acquisition | PC-Staff Desktop -> IP Configuration -> Click **DHCP** | Status: `DHCP request successful`. IP: `192.168.20.11`, Mask: `255.255.255.0`, Gateway: `192.168.20.1`, DNS: `208.67.222.222`, Domain Name: `apex.local`. | Dynamic lease assigned within Staff pool |
| **V-03** | Guest Dynamic DHCP Acquisition | PC-Guest Desktop -> IP Configuration -> Click **DHCP** | Status: `DHCP request successful`. IP: `192.168.30.11`, Mask: `255.255.255.0`, Gateway: `192.168.30.1`, DNS: `208.67.222.222`, Domain Name: `guest.apex.local`. | Dynamic lease assigned within Guest pool |
| **V-04** | Inter-VLAN Routing (Staff to Mgmt) | `PC-Staff> ping 192.168.10.10` | 4 echo requests sent; ICMP replies received (success rate 75-100%). | Routed communication between internal VLANs works |
| **V-05** | Simulated WAN / HQ Reachability | `PC-Staff> ping 209.165.201.1`<br>`PC-Guest> ping 209.165.201.1` | Both Staff and Guest workstations successfully ping upstream HQ router Loopback0 (`209.165.201.1`). *(Note: Validates default static routing across simulated WAN transit; live Internet access and active DNS resolution are not simulated).* | Default routing to WAN functional |
| **V-06** | Port Security Sticky Binding | `S1# show port-security address` | PC-Staff MAC address learned dynamically on Fa0/6, Type `SecureSticky`. Interface is `Secure-up`. | Hardware MAC pinned to edge port |
| **V-07** | In-Band SSH Management Access | `PC-Mgmt> ssh -l admin 192.168.10.1`<br>`PC-Mgmt> ssh -l admin 192.168.10.2` | Passwords accepted (`adminpass123`); encrypted administrative access granted to R1 and S1. | SSHv2 remote management functional |

---

## 3. Negative & Security Policy Denial Test Matrix

| Test ID | Policy Rule | Execution Procedure | Observed Result | Pass Criteria |
|---|---|---|---|---|
| **NEG-01** | Guest Isolation from Internal Staff | On PC-Guest Command Prompt:<br>`PC> ping 192.168.20.11` | Packets dropped at R1 Gi0/0/0.30 inbound. Output: `Destination host unreachable`. Hit counter increments on `GUEST_ISOLATION_ACL`. | Guest forbidden from reaching Staff VLAN |
| **NEG-02** | Guest Isolation from Internal Management | On PC-Guest Command Prompt:<br>`PC> ping 192.168.10.10` | Packets dropped at R1 Gi0/0/0.30 inbound. Output: `Destination host unreachable`. | Guest forbidden from reaching Management VLAN |
| **NEG-03** | Port Security Violation (Staff Port) | Unplug PC-Staff from S1 Fa0/6 and plug Rogue-Laptop into Fa0/6. From Rogue-Laptop: `ping 192.168.20.1`. | Port LED turns red. Console displays `%PM-4-ERR_DISABLE: psecure-violation`. Port Fa0/6 is placed in `err-disabled`. | Rogue device immediately isolated |
| **NEG-04** | Unencrypted Telnet Lockdown | From PC-Mgmt Command Prompt:<br>`PC> telnet 192.168.10.1`<br>`PC> telnet 192.168.10.2` | Both connection attempts are refused and closed immediately by foreign host. | Cleartext management strictly blocked |

---

## 4. Save and Persistence Verification Check

1. On R1, R2, and S1, issue `copy running-config startup-config`.
2. Save the topology file (`.pkt`).
3. Reload all simulated devices.
4. Verify subinterfaces, DHCP pools, sticky MAC bindings, and ACL rules remain active.
5. Confirm PC-Staff and PC-Guest immediately renew valid DHCP leases and traffic isolation remains enforced.
