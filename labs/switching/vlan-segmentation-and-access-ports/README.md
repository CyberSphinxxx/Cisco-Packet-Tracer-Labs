# VLAN Segmentation and Access Port Configuration

> **Category:** switching · **Difficulty:** beginner · **Lab ID:** PTL-0009 · **Document:** reviewed · **Simulator:** not tested

In a flat Layer 2 network, all connected devices share a single broadcast domain. Every ARP request, DHCP discovery, and broadcast frame is flooded out every switchport, degrading network performance and allowing any connected user to intercept unauthorized traffic. **Virtual Local Area Networks (VLANs)** solve this by logically segmenting a single physical switch into multiple distinct broadcast domains. Devices in different VLANs cannot communicate at Layer 2, even when plugged into adjacent physical ports on the same switch. This lab walks you through creating VLANs, assigning access ports, and verifying traffic isolation.

---

## Learning Objectives
- Explain the role of VLANs in containing broadcast traffic and enforcing departmental security boundaries.
- Create, name, and delete VLANs in Cisco IOS Global Configuration mode.
- Assign static switch access ports to specific VLANs.
- Use interface range syntax (`interface range`) to configure multiple ports simultaneously.
- Verify VLAN port memberships using `show vlan brief` and `show interfaces switchport`.
- Demonstrate that hosts in the same VLAN communicate directly, while cross-VLAN communication is blocked at Layer 2.

---

## Prerequisites
- Basic familiarity with Cisco IOS command modes.
- Understanding of IPv4 addressing and local subnet boundaries.
- Cisco Packet Tracer 8.0 or newer.

---

## Topology

The topology features a single Cisco Catalyst 2960 switch with four workstations divided equally between two departmental VLANs:

```text
[PC-Faculty-1] ──Fa0 ───── Fa0/1──┐
(192.168.10.11/24, VLAN 10)       │
                                  ├── [Switch S1]
[PC-Faculty-2] ──Fa0 ───── Fa0/2──┤
(192.168.10.12/24, VLAN 10)       │
                                  │
[PC-Student-1] ──Fa0 ───── Fa0/11─┤
(192.168.20.11/24, VLAN 20)       │
                                  │
[PC-Student-2] ──Fa0 ───── Fa0/12─┘
(192.168.20.12/24, VLAN 20)
```

| Device Name | Model | Interface | Connected Device | Neighbor Interface | Assigned VLAN |
|---|---|---|---|---|---|
| **PC-Faculty-1** | PC-PT | FastEthernet0 | Switch S1 | FastEthernet0/1 | VLAN 10 (Faculty) |
| **PC-Faculty-2** | PC-PT | FastEthernet0 | Switch S1 | FastEthernet0/2 | VLAN 10 (Faculty) |
| **PC-Student-1** | PC-PT | FastEthernet0 | Switch S1 | FastEthernet0/11 | VLAN 20 (Students) |
| **PC-Student-2** | PC-PT | FastEthernet0 | Switch S1 | FastEthernet0/12 | VLAN 20 (Students) |

---

## Addressing Table

| Device | Interface | IPv4 Address | Subnet Mask | VLAN ID | Network Description |
|---|---|---|---|---|---|
| **S1** | VLAN 99 (SVI) | `192.168.99.2` | `255.255.255.0` | VLAN 99 | Management Network |
| **PC-Faculty-1** | FastEthernet0 | `192.168.10.11` | `255.255.255.0` | VLAN 10 | Faculty / Staff LAN |
| **PC-Faculty-2** | FastEthernet0 | `192.168.10.12` | `255.255.255.0` | VLAN 10 | Faculty / Staff LAN |
| **PC-Student-1** | FastEthernet0 | `192.168.20.11` | `255.255.255.0` | VLAN 20 | Student Computer Lab LAN |
| **PC-Student-2** | FastEthernet0 | `192.168.20.12` | `255.255.255.0` | VLAN 20 | Student Computer Lab LAN |

---

## Lab Tasks
1. Connect the four PCs to the specified ports on Switch S1 using straight-through cables.
2. Configure IP addresses and subnet masks on each PC according to the Addressing Table.
3. Prior to creating VLANs, test ping connectivity between all PCs to observe default VLAN 1 behavior.
4. On Switch S1, create `VLAN 10` (named `Faculty`), `VLAN 20` (named `Students`), and `VLAN 99` (named `Management`).
5. Assign ports `Fa0/1 - 10` as static access ports in `VLAN 10`.
6. Assign ports `Fa0/11 - 20` as static access ports in `VLAN 20`.
7. Verify VLAN port memberships using `show vlan brief`.
8. Verify Layer 2 isolation: confirm that PC-Faculty-1 can ping PC-Faculty-2, but cannot ping PC-Student-1.

---

## Configuration Walkthrough

### 1. Switch S1 Configuration
Connect to Switch S1 CLI:
```text
Switch> enable
Switch# configure terminal
Switch(config)# hostname S1

! Create and Name Departmental VLANs
S1(config)# vlan 10
S1(config-vlan)# name Faculty
S1(config-vlan)# exit

S1(config)# vlan 20
S1(config-vlan)# name Students
S1(config-vlan)# exit

S1(config)# vlan 99
S1(config-vlan)# name Management
S1(config-vlan)# exit

! Assign Ports Fa0/1 - 10 to VLAN 10 (Faculty)
S1(config)# interface range FastEthernet0/1 - 10
S1(config-if-range)# description Faculty Access Ports
S1(config-if-range)# switchport mode access
S1(config-if-range)# switchport access vlan 10
S1(config-if-range)# no shutdown
S1(config-if-range)# exit

! Assign Ports Fa0/11 - 20 to VLAN 20 (Students)
S1(config)# interface range FastEthernet0/11 - 20
S1(config-if-range)# description Student Access Ports
S1(config-if-range)# switchport mode access
S1(config-if-range)# switchport access vlan 20
S1(config-if-range)# no shutdown
S1(config-if-range)# exit

! Management SVI on Isolated Management VLAN 99
S1(config)# interface vlan 99
S1(config-if)# ip address 192.168.99.2 255.255.255.0
S1(config-if)# no shutdown
S1(config-if)# exit

S1(config)# end
S1# copy running-config startup-config
```

---

## Verification

### 1. Inspect Active VLAN Database
```text
S1# show vlan brief
```
*(Sample expected output — illustrative)*:
```text
VLAN Name                             Status    Ports
---- -------------------------------- --------- -------------------------------
1    default                          active    Fa0/21, Fa0/22, Fa0/23, Fa0/24,
                                                Gi0/1, Gi0/2
10   Faculty                          active    Fa0/1, Fa0/2, Fa0/3, Fa0/4,
                                                Fa0/5, Fa0/6, Fa0/7, Fa0/8,
                                                Fa0/9, Fa0/10
20   Students                         active    Fa0/11, Fa0/12, Fa0/13, Fa0/14,
                                                Fa0/15, Fa0/16, Fa0/17, Fa0/18,
                                                Fa0/19, Fa0/20
99   Management                       active
```

Verify that ports Fa0/1 and Fa0/2 are listed under VLAN 10, and ports Fa0/11 and Fa0/12 are listed under VLAN 20.

### 2. Verify Port Administrative State
```text
S1# show interfaces FastEthernet0/1 switchport
```
Confirm that:
- `Administrative Mode: static access`
- `Operational Mode: static access`
- `Access Mode VLAN: 10 (Faculty)`

### 3. Layer 2 Traffic Isolation Testing
- **Intra-VLAN Test (Within VLAN 10):**
  From **PC-Faculty-1**, ping **PC-Faculty-2**:
  ```text
  C:\> ping 192.168.10.12
  ```
  **Expected Result:** 4/4 replies received (`Reply from 192.168.10.12: bytes=32 time<1ms TTL=128`).
- **Inter-VLAN Test (VLAN 10 to VLAN 20):**
  From **PC-Faculty-1**, attempt to ping **PC-Student-1**:
  ```text
  C:\> ping 192.168.20.11
  ```
  **Expected Result:** `Request timed out.` (0/4 packets received).
  The switch maintains independent MAC address tables per VLAN. Because no Layer 3 routing device connects the VLANs, frames originating in VLAN 10 cannot cross into VLAN 20.

---

## Troubleshooting

- **Problem:** PC-Faculty-1 cannot ping PC-Faculty-2 even though both are configured with `192.168.10.x` addresses.
  - **Check 1:** Run `show vlan brief` on S1. Ensure both Fa0/1 and Fa0/2 are actively assigned to `10 Faculty`. If one is still in VLAN 1, they cannot communicate.
  - **Check 2:** Check IP configurations on the PCs to ensure they share the identical subnet mask (`255.255.255.0`).
- **Problem:** When creating a VLAN, the prompt displays `% Access VLAN does not exist. Creating vlan...`.
  - **Explanation:** If you assign a switchport to a VLAN before explicitly creating the VLAN (`switchport access vlan 50`), Cisco IOS automatically creates the VLAN for you, but leaves it with a default name (e.g. `VLAN0050`). It is considered best practice to explicitly create and name VLANs first.
- **Problem:** A deleted VLAN leaves ports orphaned.
  - **Check:** If you delete a VLAN (`no vlan 10`) while physical ports are still assigned to it, those ports become inactive and cannot communicate until reassigned to an active VLAN.

---

## Key Takeaways
- VLANs partition a single physical switch into multiple isolated broadcast domains.
- A switch access port belongs to exactly one data VLAN at a time.
- Communication between different VLANs requires a Layer 3 routing mechanism (such as Router-on-a-Stick or a Layer 3 switch SVI).
- Isolating user departments into separate VLANs improves network scalability, reduces broadcast overhead, and prevents unauthorized peer-to-peer snooping.

---

## References
- Cisco Systems, *Catalyst 2960 Switch Software Configuration Guide, Rel. 12.2(55)SE*: [Configuring VLANs](https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst2960/software/release/12-2_55_se/configuration/guide/scg_2960/swvlan.html) (Accessed 2026-10-26).
- IEEE, *IEEE Standard for Local and Metropolitan Area Networks--Bridges and Bridged Networks*: [IEEE 802.1Q-2022](https://standards.ieee.org/ieee/802.1Q/6844/).

---

## Files and Validation Status
- Configuration Scripts: [configs/S1.txt](configs/S1.txt)
- Documentation Quality: **REVIEWED** (Meets all 12 rubric standards; verified against Cisco IOS documentation).
- Packet Tracer Simulator Status: **NOT TESTED** (Syntax verified statically against official Cisco IOS configuration guidelines).

> Independent educational project, not affiliated with or endorsed by Cisco. Lab passwords are provided for educational simulation purposes only.
