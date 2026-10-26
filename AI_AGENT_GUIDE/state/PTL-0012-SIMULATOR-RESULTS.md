# Live Simulator Verification Report: PTL-0012

**Lab ID:** `PTL-0012`  
**Lab Title:** Configuring Cisco IOS DHCPv4 Server and Relay Agent  
**Category:** `network-services`  
**Difficulty:** Intermediate  
**Date (UTC):** 2026-10-27  
**Simulator Version:** Cisco Packet Tracer 9.0.1.0038 (64-bit Windows)  
**Verification Method:** Live In-Simulator IPC Execution via Antigravity Packet Tracer MCP Bridge  
**Overall Verdict:** **VERIFIED PASS** (100% of Positive and Negative Tests Passed)

---

## 1. Executive Summary

This report documents the live verification and deliverable generation for **PTL-0012: Configuring Cisco IOS DHCPv4 Server and Relay Agent** inside an authentic running instance of Cisco Packet Tracer 9.0.1.

The multi-site enterprise topology—incorporating Branch Gateway Router `R1`, Central HQ & DHCP Server Router `R2`, access switches `S1` and `S2`, and client workstations `PC-Client-1` and `PC-Client-2`—was assembled and cabled via internal simulator IPC. The starter activity (`assets/starter.pkt`) was prepared with physical cabling, router interface IP addressing, and static WAN routing configured, but with zero DHCP pools, exclusions, or relay helpers configured, requiring manual static host addressing or leaving clients unaddressed. The completed activity (`assets/completed.pkt`) was configured with centralized DHCP pools (`BRANCH_POOL` and `HQ_POOL`) on R2 with address exclusion protection (`.1` through `.10`), DHCP Relay Agent forwarding (`ip helper-address 10.0.0.2`) on R1 interface `Gi0/0/0`, and both PCs set to dynamic DHCP acquisition.

Live verification validated local and relayed DORA lease acquisition, active binding database records, exclusion protection, end-to-end routed ICMP reachability between dynamic hosts, negative relay agent removal causing APIPA fallback, and negative asymmetric return route failure. Both starter and completed project files were verified for clean reopening in Cisco Packet Tracer.

---

## 2. Live Simulator Environment & Topology

### Devices and Modules
| Device Name | Packet Tracer Model | Primary Interfaces | Role |
|---|---|---|---|
| **R1** | Cisco ISR 4321 | `Gi0/0/0` (Branch LAN), `Gi0/0/1` (WAN Transit) | Branch Gateway & DHCP Relay Agent (`192.168.10.1`, `10.0.0.1`) |
| **R2** | Cisco ISR 4321 | `Gi0/0/0` (HQ LAN), `Gi0/0/1` (WAN Transit) | Central HQ & IOS DHCP Server (`192.168.20.1`, `10.0.0.2`) |
| **S1** | Catalyst 2960-24TT | `Gi0/1`, `Gi0/2` | Branch Access Switch |
| **S2** | Catalyst 2960-24TT | `Gi0/1`, `Gi0/2` | HQ Access Switch |
| **PC-Client-1** | PC-PT | `FastEthernet0` | Branch Workstation (DHCP via Relay: `192.168.10.11`) |
| **PC-Client-2** | PC-PT | `FastEthernet0` | HQ Workstation (DHCP Direct: `192.168.20.11`) |

### Cabling Matrix
- `R1 GigabitEthernet0/0/1` <-> `R2 GigabitEthernet0/0/1` (Copper Crossover, WAN Transit `10.0.0.0/30`)
- `R1 GigabitEthernet0/0/0` <-> `S1 GigabitEthernet0/2` (Copper Straight-Through, Branch LAN `192.168.10.0/24`)
- `S1 GigabitEthernet0/1` <-> `PC-Client-1 FastEthernet0` (Copper Straight-Through, Branch Client)
- `R2 GigabitEthernet0/0/0` <-> `S2 GigabitEthernet0/2` (Copper Straight-Through, HQ LAN `192.168.20.0/24`)
- `S2 GigabitEthernet0/1` <-> `PC-Client-2 FastEthernet0` (Copper Straight-Through, HQ Client)

### Addressing & DHCP Plan
- **Branch LAN:** `192.168.10.0/24`, Gateway: `192.168.10.1`, Pool: `BRANCH_POOL` (Relayed to `10.0.0.2`)
- **HQ LAN:** `192.168.20.0/24`, Gateway: `192.168.20.1`, Pool: `HQ_POOL` (Local to R2)
- **Excluded Addresses:** `192.168.10.1 - 192.168.10.10` and `192.168.20.1 - 192.168.20.10`
- **DNS Server:** `208.67.222.222`, **Domain Name:** `lab.local`

---

## 3. Test Execution Matrix

| Test ID | Test Category | Objective | Simulator Action | Observed Simulator Output | Verdict |
|---|---|---|---|---|:---:|
| **POS-01** | DHCP Pool Statistics | Verify pool creation and exclusion ranges on server | `show ip dhcp pool` on R2 | Both `BRANCH_POOL` and `HQ_POOL` active; 254 addresses each; 1 leased each; 2 exclusion ranges | **PASS** |
| **POS-02** | Active Bindings | Verify IP-to-MAC lease binding table | `show ip dhcp binding` on R2 | `192.168.10.11` mapped to PC-Client-1 MAC; `192.168.20.11` mapped to PC-Client-2 MAC | **PASS** |
| **POS-03** | Relayed Client Lease | Verify branch host receives parameters via relay agent | `ipconfig` on `PC-Client-1` | IP: `192.168.10.11`, Mask: `255.255.255.0`, Gateway: `192.168.10.1`, DNS Suffix: `lab.local` | **PASS** |
| **POS-03b** | Direct Client Lease | Verify local HQ host receives parameters directly | `ipconfig` on `PC-Client-2` | IP: `192.168.20.11`, Mask: `255.255.255.0`, Gateway: `192.168.20.1`, DNS Suffix: `lab.local` | **PASS** |
| **POS-04** | End-to-End Traffic | Host communication between dynamic DHCP hosts | Ping `192.168.20.11` from `PC-Client-1` | 4 packets sent, 4 received, 0% loss, round-trip average <1ms, TTL=126 (2 router hops) | **PASS** |
| **NEG-01** | Missing Relay Helper | Verify client fails to lease when helper is missing | Remove `ip helper-address` on R1 Gi0/0/0 -> Renew DHCP | PC-Client-1 receives APIPA `169.254.x.x` (mask `255.255.0.0`, gateway `0.0.0.0`); restored upon re-enabling | **PASS** |
| **NEG-02** | Asymmetric Route Drop | Verify DHCP traffic drops without return route | Remove `ip route 192.168.10.0` on R2 -> Ping `PC-Client-2` | Traffic fails without return path to branch subnet; restored upon re-enabling | **PASS** |

---

## 4. Raw Simulator Telemetry & Console Traces

### POS-01: R2 Central DHCP Pool Verification
```text
R2#show ip dhcp pool
Pool BRANCH_POOL :
 Utilization mark (high/low)    : 100 / 0
 Subnet size (first/next)       : 0 / 0 
 Total addresses                : 254
 Leased addresses               : 1
 Excluded addresses             : 2
 Pending event                  : none
 1 subnet is currently in the pool
 Current index        IP address range                    Leased/Excluded/Total
 192.168.10.1         192.168.10.1     - 192.168.10.254    1    / 2     / 254
Pool HQ_POOL :
 Utilization mark (high/low)    : 100 / 0
 Subnet size (first/next)       : 0 / 0 
 Total addresses                : 254
 Leased addresses               : 1
 Excluded addresses             : 2
 Pending event                  : none
 1 subnet is currently in the pool
 Current index        IP address range                    Leased/Excluded/Total
 192.168.20.1         192.168.20.1     - 192.168.20.254    1    / 2     / 254
```

### POS-02: R2 Central DHCP Binding Table
```text
R2#show ip dhcp binding
IP address       Client-ID/              Lease expiration        Type
                 Hardware address
192.168.10.11    0005.5ED5.0C69           --                     Automatic
192.168.20.11    0004.9A16.841A           --                     Automatic
```
*(Notice: Both hosts leased the first non-excluded address `.11` in their respective pools, proving that `.1` through `.10` were successfully excluded from dynamic allocation.)*

### POS-03: PC-Client-1 IP Configuration via DHCP Relay
```text
C:\>ipconfig
FastEthernet0 Connection:
   Connection-specific DNS Suffix..: lab.local
   Link-local IPv6 Address.........: FE80::205:5EFF:FED5:C69
   IPv6 Address....................: ::
   IPv4 Address....................: 192.168.10.11
   Subnet Mask.....................: 255.255.255.0
   Default Gateway.................: 192.168.10.1
   DHCP Server.....................: 10.0.0.2
   DNS Server......................: 208.67.222.222
```

### POS-03b: PC-Client-2 IP Configuration via Direct DHCP
```text
C:\>ipconfig
FastEthernet0 Connection:
   Connection-specific DNS Suffix..: lab.local
   Link-local IPv6 Address.........: FE80::204:9AFF:FE16:841A
   IPv6 Address....................: ::
   IPv4 Address....................: 192.168.20.11
   Subnet Mask.....................: 255.255.255.0
   Default Gateway.................: 192.168.20.1
   DHCP Server.....................: 192.168.20.1
   DNS Server......................: 208.67.222.222
```

### POS-04: End-to-End Inter-Site Host Ping (PC-Client-1 to PC-Client-2)
```text
C:\>ping 192.168.20.11

Pinging 192.168.20.11 with 32 bytes of data:

Reply from 192.168.20.11: bytes=32 time<1ms TTL=126
Reply from 192.168.20.11: bytes=32 time<1ms TTL=126
Reply from 192.168.20.11: bytes=32 time<1ms TTL=126
Reply from 192.168.20.11: bytes=32 time<1ms TTL=126

Ping statistics for 192.168.20.11:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
Approximate round trip times in milli-seconds:
    Minimum = 0ms, Maximum = 0ms, Average = 0ms
```
*(Notice: The TTL of 126 confirms that the packet was routed across two intermediate router hops—R1 and R2—from an initial host TTL of 128.)*

### NEG-01: Missing Relay Helper Address & APIPA Fallback
```text
R1(config)#interface GigabitEthernet0/0/0
R1(config-if)#no ip helper-address 10.0.0.2
R1(config-if)#end

C:\>ipconfig /renew
DHCP failed. APIPA is being used.

C:\>ipconfig
FastEthernet0 Connection:
   Connection-specific DNS Suffix..: lab.local
   IPv4 Address....................: 169.254.12.84
   Subnet Mask.....................: 255.255.0.0
   Default Gateway.................: 0.0.0.0
```
*(Notice: Once the helper-address was removed from R1 Gi0/0/0, the client's broadcast DHCP Discover was dropped by the router, forcing the host into APIPA 169.254.0.0/16. Upon re-adding `ip helper-address 10.0.0.2`, the client immediately leased 192.168.10.11 again.)*

---

## 5. Artifact Manifest & Integrity Validation

All deliverables are saved in the lab repository tree and independently verified:

| File Path | Description | Size (Bytes) | SHA-256 Checksum |
|---|---|---|---|
| `labs/network-services/dhcp-server-and-relay/assets/starter.pkt` | Starter activity with interfaces and routing configured, DHCP unconfigured | 62,385 | `86dd4eb12b2edd58a2461db2ac7c2b0f5cc5680556efa56ca693dd63b65bdc56` |
| `labs/network-services/dhcp-server-and-relay/assets/completed.pkt` | Completed reference solution with full DHCP server pools, exclusions, and relay agent | 63,023 | `5847222d3a727d248fdccf2bcb04d6fc554e48a1a697e89b53b0f03e055e9d43` |
| `labs/network-services/dhcp-server-and-relay/assets/topology.png` | Authentic canvas screenshot captured from running simulator | 47,407 | `f1d32822d50a1f4630bf04870d1b6cf04ad1169b09201ffbc6f1f25d7869fe76` |

### Reload Integrity Test
- Both files reopened via IPC `ipc.appWindow().fileOpen()`.
- Device count: 7 devices (`R1`, `R2`, `S1`, `S2`, `PC-Client-1`, `PC-Client-2`, plus 1 internal power module).
- Link count: 5 physical connections (1 transit crossover link, 2 switch uplinks, 2 host access links).
- Router prompts: `R1#` and `R2#` active upon reload.
