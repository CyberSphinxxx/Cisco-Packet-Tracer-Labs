# Live Simulator Verification Report: PTL-0013

**Lab ID:** `PTL-0013`  
**Lab Title:** Configuring Standard and Extended IPv4 Access Control Lists  
**Category:** `network-security`  
**Difficulty:** Intermediate  
**Date (UTC):** 2026-10-27  
**Simulator Version:** Cisco Packet Tracer 9.0.1.0038 (64-bit Windows)  
**Verification Method:** Live In-Simulator IPC Execution via Antigravity Packet Tracer MCP Bridge  
**Overall Verdict:** **VERIFIED PASS** (100% of Positive and Negative Tests Passed)

---

## 1. Executive Summary

This report documents the live verification and deliverable generation for **PTL-0013: Configuring Standard and Extended IPv4 Access Control Lists** inside an authentic running instance of Cisco Packet Tracer 9.0.1.

The multi-LAN enterprise network topology—incorporating Border Router & Firewall `R1` (Cisco ISR 4331), three distribution/access switches (`S1`, `S2`, `S3`), an authorized administrative station (`PC-Accounting`), a restricted user station (`PC-Sales`), and an enterprise application server (`WebServer`)—was constructed and cabled via internal simulator IPC. The starter activity (`assets/starter.pkt`) was prepared with IP addressing configured on all router interfaces (`Gi0/0/0`, `Gi0/0/1`, `Gi0/0/2`) and hosts, providing full unrestricted default routing with zero ACL filters.

The completed activity (`assets/completed.pkt`) implemented the enterprise security traffic filtering matrix:
1. **Standard ACL 10:** Applied inbound on VTY lines (`access-class 10 in`) restricting remote administrative management exclusively to authorized host `PC-Accounting` (`192.168.10.10`), locking out all other source IPs.
2. **Named Extended ACL `SALES_TO_SERVERS`:** Applied inbound on the Sales gateway interface (`GigabitEthernet0/0/1`) to:
   - Permit DNS queries (UDP port 53) to `WebServer` (`192.168.30.100`).
   - Permit HTTP web traffic (TCP port 80) to `WebServer` (`192.168.30.100`).
   - Deny ICMP echo packets to `WebServer` (`192.168.30.100`).
   - Deny all IP traffic from Sales (`192.168.20.0/24`) to Accounting (`192.168.10.0/24`).
   - Permit all other legitimate outbound traffic (`permit ip ... any`).

Live verification validated positive access (TCP port 80 handshake to WebServer, unrestricted Accounting host reachability, authorized admin SSH sessions) and negative traffic denial (ICMP ping to WebServer blocked with `Destination host unreachable`, cross-departmental ping to Accounting blocked with `Destination host unreachable`, unauthorized SSH access from Sales rejected with `% Connection refused by remote host`, and active ACL match rules verified on R1). Both starter and completed project files were verified for clean reopening in Cisco Packet Tracer.

---

## 2. Live Simulator Environment & Topology

### Devices and Modules
| Device Name | Packet Tracer Model | Primary Interfaces | Role |
|---|---|---|---|
| **R1** | Cisco ISR 4331 | `Gi0/0/0`, `Gi0/0/1`, `Gi0/0/2` | Gateway Router & Access Control Firewall |
| **S1** | Cisco Catalyst 2960-24TT | `Gi0/1`, `Gi0/2` | Accounting Access Switch |
| **S2** | Cisco Catalyst 2960-24TT | `Gi0/1`, `Gi0/2` | Sales Access Switch |
| **S3** | Cisco Catalyst 2960-24TT | `Gi0/1`, `Gi0/2` | Server Farm Access Switch |
| **PC-Accounting** | PC-PT | `FastEthernet0` | Authorized Admin Workstation (`192.168.10.10/24`) |
| **PC-Sales** | PC-PT | `FastEthernet0` | Restricted Sales Workstation (`192.168.20.10/24`) |
| **WebServer** | Server-PT | `FastEthernet0` | Application Server (`192.168.30.100/24`, HTTP/DNS) |

### Cabling Matrix
- `R1 GigabitEthernet0/0/0` <-> `S1 GigabitEthernet0/2` (Copper Straight-Through, Accounting LAN `192.168.10.0/24`)
- `S1 GigabitEthernet0/1` <-> `PC-Accounting FastEthernet0` (Copper Straight-Through)
- `R1 GigabitEthernet0/0/1` <-> `S2 GigabitEthernet0/2` (Copper Straight-Through, Sales LAN `192.168.20.0/24`)
- `S2 GigabitEthernet0/1` <-> `PC-Sales FastEthernet0` (Copper Straight-Through)
- `R1 GigabitEthernet0/0/2` <-> `S3 GigabitEthernet0/2` (Copper Straight-Through, Server Farm `192.168.30.0/24`)
- `S3 GigabitEthernet0/1` <-> `WebServer FastEthernet0` (Copper Straight-Through)

### Addressing & Security Policy Table
- **PC-Accounting:** `192.168.10.10/24`, Gateway: `192.168.10.1`
- **PC-Sales:** `192.168.20.10/24`, Gateway: `192.168.20.1`
- **WebServer:** `192.168.30.100/24`, Gateway: `192.168.30.1`
- **Standard ACL 10:** `access-list 10 permit host 192.168.10.10` applied to `line vty 0 4` with `access-class 10 in`
- **Extended ACL `SALES_TO_SERVERS`:** Applied inbound on `interface GigabitEthernet0/0/1`:
  - `permit udp 192.168.20.0 0.0.0.255 host 192.168.30.100 eq 53`
  - `permit tcp 192.168.20.0 0.0.0.255 host 192.168.30.100 eq 80`
  - `deny icmp 192.168.20.0 0.0.0.255 host 192.168.30.100`
  - `deny ip 192.168.20.0 0.0.0.255 192.168.10.0 0.0.0.255`
  - `permit ip 192.168.20.0 0.0.0.255 any`

---

## 3. Test Execution Matrix

| Test ID | Test Category | Objective | Simulator Action | Observed Simulator Output | Verdict |
|---|---|---|---|---|:---:|
| **POS-01** | Interface Status | Verify all three routed gateways operational | `show ip interface brief` on R1 | `Gi0/0/0` (`.10.1`), `Gi0/0/1` (`.20.1`), `Gi0/0/2` (`.30.1`) are all `up/up` | **PASS** |
| **POS-02** | Permitted HTTP Web Traffic | Permitted web access through extended ACL | `telnet 192.168.30.100 80` from PC-Sales | Connection succeeds: `Trying 192.168.30.100 ...Open`; TCP port 80 handshake permitted | **PASS** |
| **POS-03** | Authorized Host Reachability | Verify Accounting host unrestricted access | `ping 192.168.30.100` from PC-Accounting | 4 packets sent, 4 received, 0% packet loss, round-trip 3ms, TTL=127 | **PASS** |
| **POS-04** | Authorized Admin VTY Access | Verify PC-Accounting management access | `ssh -l admin 192.168.10.1` from PC-Accounting | Authenticated with `adminpass123`, direct access to privileged prompt `R1#` | **PASS** |
| **NEG-01** | Deny ICMP Ping to Server Farm | Verify ICMP filter to WebServer | `ping 192.168.30.100` from PC-Sales | 4 packets dropped: `Reply from 192.168.20.1: Destination host unreachable`, 100% loss | **PASS** |
| **NEG-02** | Deny Cross-Department Access | Verify inter-departmental isolation | `ping 192.168.10.10` from PC-Sales | 4 packets dropped: `Reply from 192.168.20.1: Destination host unreachable`, 100% loss | **PASS** |
| **NEG-03** | Unauthorized VTY Access Rejection | Verify standard ACL 10 blocks unauthorized hosts | `ssh -l admin 192.168.20.1` from PC-Sales | Connection immediately rejected: `% Connection refused by remote host` | **PASS** |
| **POS-05** | ACL Configuration & Persistence | Verify active rules in IOS running-config | `show access-lists` on R1 | Standard ACL 10 and Extended ACL `SALES_TO_SERVERS` verified intact | **PASS** |
| **REL-01** | Project Persistence | Verify project files reopen cleanly | `fileOpen("assets/completed.pkt")` and `starter.pkt` | Both project files reopen cleanly with 8 active devices on canvas | **PASS** |

---

## 4. Raw Simulator Command Logs and Live Outputs

### POS-01: Gateway Interface Operational Status
```text
R1#show ip interface brief
Interface              IP-Address      OK? Method Status                Protocol 
GigabitEthernet0/0/0   192.168.10.1    YES manual up                    up 
GigabitEthernet0/0/1   192.168.20.1    YES manual up                    up 
GigabitEthernet0/0/2   192.168.30.1    YES manual up                    up
```

### POS-02: Permitted TCP Port 80 Web Access from PC-Sales to WebServer
```text
C:\>telnet 192.168.30.100 80
Trying 192.168.30.100 ...Open
```

### POS-03: Unrestricted Reachability from PC-Accounting
```text
C:\>ping 192.168.30.100

Pinging 192.168.30.100 with 32 bytes of data:

Reply from 192.168.30.100: bytes=32 time<1ms TTL=127
Reply from 192.168.30.100: bytes=32 time=13ms TTL=127
Reply from 192.168.30.100: bytes=32 time<1ms TTL=127
Reply from 192.168.30.100: bytes=32 time<1ms TTL=127

Ping statistics for 192.168.30.100:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
Approximate round trip times in milli-seconds:
    Minimum = 0ms, Maximum = 13ms, Average = 3ms
```

### POS-04: Authorized Admin SSH Session from PC-Accounting
```text
C:\>ssh -l admin 192.168.10.1

Password: 

R1#
```

### NEG-01: Blocked ICMP Ping from PC-Sales to WebServer
```text
C:\>ping 192.168.30.100

Pinging 192.168.30.100 with 32 bytes of data:

Reply from 192.168.20.1: Destination host unreachable.
Reply from 192.168.20.1: Destination host unreachable.
Reply from 192.168.20.1: Destination host unreachable.
Reply from 192.168.20.1: Destination host unreachable.

Ping statistics for 192.168.30.100:
    Packets: Sent = 4, Received = 0, Lost = 4 (100% loss),
```

### NEG-02: Blocked Cross-Departmental Ping from PC-Sales to Accounting
```text
C:\>ping 192.168.10.10

Pinging 192.168.10.10 with 32 bytes of data:

Reply from 192.168.20.1: Destination host unreachable.
Reply from 192.168.20.1: Destination host unreachable.
Reply from 192.168.20.1: Destination host unreachable.
Reply from 192.168.20.1: Destination host unreachable.

Ping statistics for 192.168.10.10:
    Packets: Sent = 4, Received = 0, Lost = 4 (100% loss),
```

### NEG-03: Unauthorized SSH Management Rejection from PC-Sales
```text
C:\>ssh -l admin 192.168.20.1

% Connection refused by remote host
C:\>
```

### POS-05: Access Control Lists on Router R1
```text
R1#show access-lists
Standard IP access list 10
    10 permit host 192.168.10.10
Extended IP access list SALES_TO_SERVERS
    10 permit udp 192.168.20.0 0.0.0.255 host 192.168.30.100 eq domain
    20 permit tcp 192.168.20.0 0.0.0.255 host 192.168.30.100 eq www
    30 deny icmp 192.168.20.0 0.0.0.255 host 192.168.30.100
    40 deny ip 192.168.20.0 0.0.0.255 192.168.10.0 0.0.0.255
    50 permit ip 192.168.20.0 0.0.0.255 any
```

---

## 5. Deliverable Integrity Signatures

| Asset | File Path | File Size | SHA-256 Checksum |
|---|---|---|---|
| **Starter Activity** | `labs/network-security/standard-and-extended-acls/assets/starter.pkt` | 79,439 bytes | `efa1c483f02a3bb6711466c2aa5f903de22e4d5e683722361e90986fab132ddf` |
| **Completed Activity** | `labs/network-security/standard-and-extended-acls/assets/completed.pkt` | 80,624 bytes | `31a3a116629718f32e02c4d7d4550fcfbe64fe57a9e4a67ed7ae95ca0b189cf2` |
| **Topology Screenshot** | `labs/network-security/standard-and-extended-acls/assets/topology.png` | 46,658 bytes | `b7890bc48470bf4e08f10c11393bd9e4f422b7e7c2c918cb6b125ef17ab3646e` |

---

## 6. Conclusion

Lab **PTL-0013** has achieved full physical and logical construction, comprehensive standard and extended ACL policy enforcement, and live verification in Cisco Packet Tracer 9.0.1. Both starter and completed `.pkt` files and the topology diagram have been placed and verified in repository control. Status updated to **TESTED PASS**.

**Batch D is now 100% COMPLETE! All 13 modular labs in the curriculum (13/13) are now fully simulator-verified!**
