# Verification and Diagnostic Guide: PTL-0019

**Lab ID:** `PTL-0019`  
**Lab Title:** Layer 3 Switch SVIs and Routed Ports  
**Category:** `switching`  
**Simulator Verification:** `tested_pass`  

This document details the test procedures, expected outputs, and diagnostic steps required to verify multilayer switching, Switch Virtual Interfaces (SVIs), Layer 3 routed ports (`no switchport`), and default gateway routing in Cisco Packet Tracer.

---

## 1. Physical and Logical Topology Verification

Confirm that all interfaces match the intended cabling and operational state:

| Device | Interface | Expected Mode | IP Address | Subnet Mask | Connected To |
|---|---|---|---|---|---|
| **MLS1** | `Vlan10` | SVI Gateway | `192.168.10.1` | `255.255.255.0` | Admin VLAN Internal |
| **MLS1** | `Vlan20` | SVI Gateway | `192.168.20.1` | `255.255.255.0` | Sales VLAN Internal |
| **MLS1** | `GigabitEthernet0/1` | Layer 3 Routed Port | `10.0.0.2` | `255.255.255.252` | R1 `Gi0/0/0` |
| **MLS1** | `FastEthernet0/10` | Static Access (VLAN 10) | N/A | N/A | PC1-Admin `Fa0` |
| **MLS1** | `FastEthernet0/20` | Static Access (VLAN 20) | N/A | N/A | PC2-Sales `Fa0` |
| **R1** | `GigabitEthernet0/0/0` | Routed Interface | `10.0.0.1` | `255.255.255.252` | MLS1 `Gi0/1` |
| **R1** | `GigabitEthernet0/0/1` | Routed Interface | `10.1.1.1` | `255.255.255.0` | Server-HQ `Fa0` |
| **Server-HQ** | `FastEthernet0` | Server Host NIC | `10.1.1.10` | `255.255.255.0` | R1 `Gi0/0/1` |
| **PC1-Admin** | `FastEthernet0` | End-Host NIC | `192.168.10.10` | `255.255.255.0` | MLS1 `Fa0/10` |
| **PC2-Sales** | `FastEthernet0` | End-Host NIC | `192.168.20.10` | `255.255.255.0` | MLS1 `Fa0/20` |

---

## 2. Command-by-Command Verification Matrix

### Test 1: Hardware IP Routing and Routing Table Verification
Execute on `MLS1`:
```text
MLS1# show ip route
```
*Expected Output:*
```text
Gateway of last resort is 10.0.0.1 to network 0.0.0.0

     10.0.0.0/30 is subnetted, 1 subnets
C       10.0.0.0 is directly connected, GigabitEthernet0/1
C    192.168.10.0/24 is directly connected, Vlan10
C    192.168.20.0/24 is directly connected, Vlan20
S*   0.0.0.0/0 [1/0] via 10.0.0.1
```
*Verification Check:*
- Global routing is active (`ip routing` is enabled).
- Connected subnets for VLAN 10, VLAN 20, and GigabitEthernet0/1 are populated.
- Default route `0.0.0.0/0` points to upstream core router `10.0.0.1`.

---

### Test 2: Layer 3 Routed Port State
Execute on `MLS1`:
```text
MLS1# show interfaces GigabitEthernet0/1
```
*Expected Output:*
```text
GigabitEthernet0/1 is up, line protocol is up (connected)
  Hardware is Lance, address is 0006.2a09.9719 (bia 0006.2a09.9719)
  Description: Routed Point-to-Point Uplink to R1
  Internet address is 10.0.0.2/30
  Encapsulation ARPA, loopback not set
```
*Verification Check:*
- Interface line protocol is `up/up`.
- `no switchport` successfully disabled Layer 2 framing and enabled ARPA encapsulation.
- IP address `10.0.0.2/30` is operational.

---

### Test 3: Inter-SVI Routing Reachability
Execute from `PC1-Admin`:
```text
C:\> ping 192.168.20.10
```
*Expected Output:*
```text
Pinging 192.168.20.10 with 32 bytes of data:

Request timed out.
Reply from 192.168.20.10: bytes=32 time<1ms TTL=127
Reply from 192.168.20.10: bytes=32 time<1ms TTL=127
Reply from 192.168.20.10: bytes=32 time<1ms TTL=127

Ping statistics for 192.168.20.10:
    Packets: Sent = 4, Received = 3, Lost = 1 (25% loss),
```
*Verification Check:*
- Initial ARP resolution may cause 1 timeout; remaining packets succeed with 0ms round-trip latency.
- TTL decrements to `127` (host baseline 128 minus 1 routing hop across `MLS1`).

---

### Test 4: Multi-Tier Uplink Reachability to Server Farm
Execute from `PC1-Admin`:
```text
C:\> ping 10.1.1.10
```
*Expected Output:*
```text
Pinging 10.1.1.10 with 32 bytes of data:

Reply from 10.1.1.10: bytes=32 time<1ms TTL=126
Reply from 10.1.1.10: bytes=32 time<1ms TTL=126
Reply from 10.1.1.10: bytes=32 time<1ms TTL=126
Reply from 10.1.1.10: bytes=32 time=15ms TTL=126

Ping statistics for 10.1.1.10:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
```
*Verification Check:*
- End-to-end reachability to server farm across routed uplink and core router.
- TTL decrements to `126` (2 routing hops: `MLS1` -> `R1`).

---

## 3. Negative Testing and Fault Isolation Scenarios

### Scenario A: Disabled Hardware IP Routing (`no ip routing`)
1. On `MLS1`, execute `no ip routing` in global configuration mode.
2. From `PC1-Admin`, ping `192.168.20.10`.
3. *Expected Result:* All 4 ICMP requests time out (100% loss). The switch refuses to forward packets between SVIs because its Layer 3 forwarding engine is disabled.
4. *Remediation:* Issue `ip routing` globally on `MLS1`.

### Scenario B: SVI Autostate Inactivation
1. On `MLS1`, shut down the physical access port for VLAN 20:
   ```text
   MLS1(config)# interface FastEthernet0/20
   MLS1(config-if)# shutdown
   ```
2. Verify interface status:
   ```text
   MLS1# show ip interface brief | include Vlan20
   Vlan20                 192.168.20.1    YES manual up                    down
   ```
3. *Expected Result:* SVI `Vlan20` drops its line protocol to `down` because no active physical access ports or trunks exist in VLAN 20.
4. *Remediation:* Issue `no shutdown` on `FastEthernet0/20` to restore SVI forwarding state.
