# Verification and Acceptance Matrix — PTL-0037

**Lab ID:** PTL-0037  
**Title:** DNS Resolution Failure Troubleshooting  
**Status:** `TESTED_PASS` (Verified live in Cisco Packet Tracer 9.0.1 via MCP loopback bridge automation)

---

## 1. Packet Tracer Topology Construction Manifest

To construct or manually verify this topology in Cisco Packet Tracer:

### Device Inventory
| Device Role | PT Device Model | Display Name | Modules / Slots |
|---|---|---|---|
| Default Gateway Router | Cisco ISR 4321 | R1 | Default `GigabitEthernet0/0/0` & `GigabitEthernet0/0/1` |
| Client Access Switch | Cisco Catalyst 2960-24TT | S1 | 24 FastEthernet + 2 GigabitEthernet ports |
| Server Access Switch | Cisco Catalyst 2960-24TT | S2 | 24 FastEthernet + 2 GigabitEthernet ports |
| Client Workstation 1 | PC-PT | PC-1 | FastEthernet0 |
| Client Workstation 2 | PC-PT | PC-2 | FastEthernet0 |
| Corporate DNS Server | Server-PT | DNS-Server | FastEthernet0 |
| Corporate Web Portal | Server-PT | Web-Server | FastEthernet0 |

### Physical Cabling Matrix
| Link ID | Source Device | Source Port | Destination Device | Destination Port | Cable Type |
|---|---|---|---|---|---|
| L-01 | R1 | GigabitEthernet0/0/0 | S1 | FastEthernet0/1 | Copper Straight-Through |
| L-02 | R1 | GigabitEthernet0/0/1 | S2 | FastEthernet0/1 | Copper Straight-Through |
| L-03 | S1 | FastEthernet0/2 | PC-1 | FastEthernet0 | Copper Straight-Through |
| L-04 | S1 | FastEthernet0/3 | PC-2 | FastEthernet0 | Copper Straight-Through |
| L-05 | S2 | FastEthernet0/2 | DNS-Server | FastEthernet0 | Copper Straight-Through |
| L-06 | S2 | FastEthernet0/3 | Web-Server | FastEthernet0 | Copper Straight-Through |

---

## 2. Positive Verification Test Matrix

| Test ID | Objective | Command / Procedure | Expected Result | Pass Criteria |
|---|---|---|---|---|
| **POS-01** | Router Interface Status | `R1# show ip interface brief` | `GigabitEthernet0/0/0` (192.168.1.1) and `GigabitEthernet0/0/1` (192.168.2.1) status `up`, protocol `up` | Both routed gateway interfaces up/up |
| **POS-02** | Direct IP Subnet Reachability | `PC-1> ping 192.168.2.20` | 4/4 echo replies from `192.168.2.20` with TTL=127 across router R1 | Layer 1-3 network transport verified |
| **POS-03** | DNS Service & Database Verification | `DNS-Server > Config > Services > DNS` | DNS Service is `On`, resource record database contains 3 records | Service enabled with required A & CNAME records |
| **POS-04** | Primary Domain Name Resolution | `PC-1> nslookup corpweb.local` | Query against `192.168.2.10` returns `Name: corpweb.local`, `Address: 192.168.2.20` | Primary FQDN resolves to target server IP |
| **POS-05** | Hostname ICMP Reachability | `PC-1> ping corpweb.local` | Hostname resolves to `192.168.2.20`, 4/4 echo replies received (TTL=127) | Hostname resolution integrated into ping utility |
| **POS-06** | Secondary Portal Name Resolution | `PC-2> nslookup portal.corpweb.local` | Query against `192.168.2.10` returns `Name: portal.corpweb.local`, `Address: 192.168.2.20` | Secondary FQDN resolves to target server IP |
| **POS-07** | Canonical Name Alias Resolution | `PC-2> nslookup www.corpweb.local` | Query against `192.168.2.10` returns `Aliases: corpweb.local`, `Address: 192.168.2.20` | CNAME alias resolves correctly to canonical host IP |

---

## 3. Negative & Fault Tolerance Test Matrix

| Test ID | Fault Scenario | Injection Procedure | Observed Symptom | Recovery Procedure |
|---|---|---|---|---|
| **NEG-01** | Invalid Client DNS Server IP | On PC-1, set DNS Server IP to non-existent `192.168.2.99`. Run `nslookup corpweb.local`. | Query fails with `Server: [192.168.2.99]` followed by `DNS request timed out. timeout was 15000 milli seconds.` | Execute `ipconfig /all` on client, note invalid DNS address, and update client DNS Server IP to `192.168.2.10`. |
| **NEG-02** | Missing / Non-Existent Domain Record | On PC-2, execute `nslookup unknown.corpweb.local`. | DNS server responds with `*** UnKnown can't find unknown.corpweb.local: Non-existent domain.` | Verify DNS server database; if record should exist, add an authoritative A record mapping domain to target IP. |

---

## 4. Save and Persistence Verification Check

1. On R1, S1, and S2, execute `copy running-config startup-config`.
2. Save the completed topology file (`completed.pkt`).
3. Reload `completed.pkt` in Cisco Packet Tracer.
4. Execute `ping corpweb.local` on `PC-1` and confirm DNS service and database records persist across reloads.
5. Reload `starter.pkt` and confirm that direct IP ping `ping 192.168.2.20` succeeds while `nslookup corpweb.local` fails with timeout to `192.168.2.99`, confirming clear differentiation between starter and solution files.

