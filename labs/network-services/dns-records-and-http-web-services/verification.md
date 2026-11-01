# Verification and Acceptance Matrix — PTL-0022

**Lab ID:** PTL-0022  
**Title:** DNS Records and HTTP Web Services  
**Status:** `TESTED_PASS` (Verified live in Cisco Packet Tracer 9.0.1 via MCP loopback bridge automation)

---

## 1. Packet Tracer Topology Construction Manifest

To construct or manually verify this topology in Cisco Packet Tracer:

### Device Inventory
| Device Role | PT Device Model | Display Name | Modules / Slots |
|---|---|---|---|
| Default Gateway Router | Cisco ISR 4321 | R1 | Default `GigabitEthernet0/0/0` & `GigabitEthernet0/0/1` |
| Client Access Switch | Cisco Catalyst 2960-24TT | S1 | 24 FastEthernet + 2 GigabitEthernet ports |
| Server Farm Access Switch | Cisco Catalyst 2960-24TT | S2 | 24 FastEthernet + 2 GigabitEthernet ports |
| Client Workstation 1 | PC-PT | PC-1 | FastEthernet0 |
| Client Workstation 2 | PC-PT | PC-2 | FastEthernet0 |
| Authoritative DNS Server | Server-PT | DNS-Server | FastEthernet0 |
| Corporate Web Portal Server | Server-PT | Web-Server | FastEthernet0 |

### Physical Cabling Matrix
| Link ID | Source Device | Source Port | Destination Device | Destination Port | Cable Type |
|---|---|---|---|---|---|
| L-01 | PC-1 | FastEthernet0 | S1 | FastEthernet0/1 | Copper Straight-Through |
| L-02 | PC-2 | FastEthernet0 | S1 | FastEthernet0/2 | Copper Straight-Through |
| L-03 | S1 | GigabitEthernet0/1 | R1 | GigabitEthernet0/0/0 | Copper Straight-Through |
| L-04 | R1 | GigabitEthernet0/0/1 | S2 | GigabitEthernet0/1 | Copper Straight-Through |
| L-05 | S2 | FastEthernet0/10 | DNS-Server | FastEthernet0 | Copper Straight-Through |
| L-06 | S2 | FastEthernet0/11 | Web-Server | FastEthernet0 | Copper Straight-Through |

---

## 2. Positive Verification Test Matrix

| Test ID | Objective | Command / Procedure | Expected Result | Pass Criteria |
|---|---|---|---|---|
| **POS-01** | Subnet Routing | `PC-1> ping 192.168.20.80` | 3/3 echo replies from `Web-Server` with TTL=127 across router R1 | IP routing verified between subnets |
| **POS-02** | Primary A Record Lookup | `PC-1> nslookup web.corp.local` | Query returns `Address: 192.168.20.80` from server `192.168.20.50` | Primary FQDN resolves to server IPv4 address |
| **POS-03** | CNAME Canonical Alias | `PC-1> nslookup www.corp.local` | Query returns `Aliases: web.corp.local` and `Address: 192.168.20.80` | Alias resolves to canonical target A record |
| **POS-04** | Secondary A Record Lookup | `PC-2> nslookup portal.corp.local` | Query returns `Address: 192.168.20.80` from server `192.168.20.50` | Second host query resolves successfully |
| **POS-05** | HTTP Web Page Delivery | `PC-1 Web Browser> URL: http://www.corp.local` | Browser renders "Corporate Intranet Portal" page | Web client loads page using resolved hostname |

---

## 3. Negative & Fault Tolerance Test Matrix

| Test ID | Fault Scenario | Injection Procedure | Observed Symptom | Recovery Procedure |
|---|---|---|---|---|
| **NEG-01** | Non-Existent Domain Query | On PC-1:<br>`nslookup nonexistent.corp.local` | Server returns `*** UnKnown can't find nonexistent.corp.local: Non-existent domain.`. | Expected response: DNS server refuses resolution of unmapped hostnames. |
| **NEG-02** | DNS Record Removal & Recovery | On DNS-Server:<br>Remove A record `portal.corp.local`<br>On PC-2:<br>`nslookup portal.corp.local` | Query fails with `Non-existent domain`. | On DNS-Server, restore A record `portal.corp.local` pointing to `192.168.20.80`. Re-run `nslookup` on PC-2 and verify immediate success. |

---

## 4. Save and Persistence Verification Check

1. On R1, S1, and S2, execute `copy running-config startup-config`.
2. Save the completed topology file (`completed.pkt`).
3. Reload `completed.pkt` in Cisco Packet Tracer.
4. Execute `nslookup web.corp.local` on `PC-1` and confirm DNS service and database records persist across reloads.
5. Reload `starter.pkt` and confirm that with DNS disabled, queries to `web.corp.local` fail as expected, confirming clear differentiation between starter and solution files.

