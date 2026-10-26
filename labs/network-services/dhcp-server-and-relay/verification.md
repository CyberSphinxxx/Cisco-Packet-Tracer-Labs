# Verification and Acceptance Matrix — PTL-0012

**Lab ID:** PTL-0012  
**Title:** Configuring Cisco IOS DHCPv4 Server and Relay Agent  
**Target Simulator:** Cisco Packet Tracer 8.0+  
**Status:** `NOT_TESTED` (Authoritative Engineering Specification)

---

## 1. Packet Tracer Topology Construction Manifest

To construct or manually verify this topology in Cisco Packet Tracer:

### Device Inventory
| Device Role | PT Device Model | Display Name | Modules / Slots |
|---|---|---|---|
| Branch Gateway & Relay | Cisco ISR 4321 | R1 | Default GigabitEthernet interfaces |
| Central HQ & DHCP Server | Cisco ISR 4321 | R2 | Default GigabitEthernet interfaces |
| Branch Access Switch | Cisco Catalyst 2960-24TT | S1 | 24 FastEthernet + 2 GigabitEthernet ports |
| HQ Access Switch | Cisco Catalyst 2960-24TT | S2 | 24 FastEthernet + 2 GigabitEthernet ports |
| Branch Client Workstation | PC-PT | PC-Client-1 | FastEthernet0 |
| HQ Client Workstation | PC-PT | PC-Client-2 | FastEthernet0 |

### Physical Cabling Matrix
| Link ID | Source Device | Source Port | Destination Device | Destination Port | Cable Type |
|---|---|---|---|---|---|
| L-01 | PC-Client-1 | FastEthernet0 | S1 | GigabitEthernet0/1 | Copper Straight-Through |
| L-02 | S1 | GigabitEthernet0/2 | R1 | GigabitEthernet0/0/0 | Copper Straight-Through |
| L-03 | R1 | GigabitEthernet0/0/1 | R2 | GigabitEthernet0/0/1 | Copper Straight-Through (or Crossover) |
| L-04 | R2 | GigabitEthernet0/0/0 | S2 | GigabitEthernet0/2 | Copper Straight-Through |
| L-05 | S2 | GigabitEthernet0/1 | PC-Client-2 | FastEthernet0 | Copper Straight-Through |

---

## 2. Positive Verification Test Matrix

| Test ID | Objective | Command / Procedure | Expected Result | Pass Criteria |
|---|---|---|---|---|
| **V-01** | Verify R2 Interface and DHCP Pools | `R2# show ip interface brief`<br>`R2# show ip dhcp pool` | Gi0/0/0 (`192.168.20.1`) and Gi0/0/1 (`10.0.0.2`) are `up/up`. Both `BRANCH_POOL` and `HQ_POOL` are defined with 10 excluded addresses each. | Pools active, interfaces up |
| **V-02** | Local HQ Client DHCP Lease (PC-Client-2) | PC-Client-2 Desktop -> IP Configuration -> Click **DHCP** | Status reports `DHCP request successful`. IP: `192.168.20.11`, Mask: `255.255.255.0`, Gateway: `192.168.20.1`, DNS: `208.67.222.222`. | Dynamic lease assigned within pool range |
| **V-03** | Verify R1 Relay Agent Interface | `R1# show ip interface brief`<br>`R1# show running-config interface Gi0/0/0` | Gi0/0/0 displays `ip address 192.168.10.1 255.255.255.0` and `ip helper-address 10.0.0.2`. | Helper address bound to client-facing interface |
| **V-04** | Remote Branch Client DHCP Lease (PC-Client-1) | PC-Client-1 Desktop -> IP Configuration -> Click **DHCP** | Status reports `DHCP request successful`. IP: `192.168.10.11`, Mask: `255.255.255.0`, Gateway: `192.168.10.1`, DNS: `208.67.222.222`. | Dynamic lease relayed across routed WAN |
| **V-05** | Central Server Active Bindings | `R2# show ip dhcp binding` | Contains two bindings: `192.168.10.11` mapped to PC-Client-1 MAC and `192.168.20.11` mapped to PC-Client-2 MAC. Type: `Automatic`. | Both subnets present in binding database |
| **V-06** | End-to-End Inter-Site Ping | `PC-Client-1> ping 192.168.20.11` | 4 echo requests sent; ICMP replies received (success rate 75-100% accounting for initial ARP). | Cross-network reachability confirmed |

---

## 3. Negative & Fault Tolerance Test Matrix

| Test ID | Fault Scenario | Injection Procedure | Observed Symptom | Recovery Procedure |
|---|---|---|---|---|
| **NEG-01** | Missing DHCP Relay Helper Address | On R1:<br>`interface Gi0/0/0`<br>`no ip helper-address 10.0.0.2`<br>On PC-Client-1: Release & renew DHCP. | PC-Client-1 broadcasts DHCP Discover, but no Offer arrives. Packet Tracer outputs `DHCP failed. APIPA is being used.` with IP `169.254.x.x`. | On R1 Gi0/0/0, reapply `ip helper-address 10.0.0.2`. Renew DHCP on PC-Client-1. |
| **NEG-02** | Asymmetric Return Route Failure | On R2:<br>`no ip route 192.168.10.0 255.255.255.0 10.0.0.1`<br>On PC-Client-1: Renew DHCP. | Discover reaches R2 via unicast relay, R2 creates binding, but cannot unicast Offer back to `192.168.10.1`. Client times out with APIPA. | On R2, restore `ip route 192.168.10.0 255.255.255.0 10.0.0.1`. |
| **NEG-03** | Gateway Address Exclusion Protection | On R2, check first lease issued in each pool. | Leased IPs start at `.11` (`192.168.10.11` and `192.168.20.11`). Addresses `.1` through `.10` are skipped. | Verified: `ip dhcp excluded-address` protects gateway and static reservations. |

---

## 4. Save and Persistence Verification Check

1. On R1 and R2, execute `copy running-config startup-config`.
2. Save the topology file (`.pkt`).
3. Close and relaunch Cisco Packet Tracer.
4. Reload the saved `.pkt` file.
5. Verify on R2: `show running-config | section dhcp` preserves both pools and exclusion ranges.
6. Verify on R1: `show running-config interface Gi0/0/0` retains `ip helper-address 10.0.0.2`.
7. Confirm PC-Client-1 and PC-Client-2 maintain or immediately renew valid dynamic leases.
