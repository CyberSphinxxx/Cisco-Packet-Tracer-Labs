# PTL-0019: Verification Protocol & Simulation Test Results

**Lab ID**: PTL-0019
**Topic**: Layer 3 Switch SVIs and Routed Ports
**Simulator**: Cisco Packet Tracer 9.0.1 (Localhost IPC Bridge)
**Execution Timestamp**: 2026-10-31 02:46:00
**Status**: `tested_pass`

## 1. Test Summary Matrix

| Test ID | Test Description | Command / Action | Expected Result | Simulator Result | Status |
|---|---|---|---|---|---|
| **POS-01** | Verify VLAN Existence | `show vlan brief` on MLS1 & S1 | VLAN 10 (Staff) and VLAN 20 (Management) active | Both VLANs active on MLS1 and S1 | PASS |
| **POS-02** | Verify SVI Operational States | `show ip interface brief` on MLS1 | `Vlan10` and `Vlan20` report `Status: up, Protocol: up` | Vlan10 (192.168.10.1) & Vlan20 (192.168.20.1) up/up | PASS |
| **POS-03** | Verify Routing & Connected Subnets | `show ip route` on MLS1 | Connected routes for 10.0.0.0/30, 192.168.10.0/24, 192.168.20.0/24, and default route via 10.0.0.2 | Routing table populated with 3 connected and 1 static candidate default route | PASS |
| **POS-04** | Local Gateway Ping (Staff) | `ping 192.168.10.1` from PC-Staff | 100% ICMP ping success to local SVI gateway | 4/4 replies received (0% loss, `<1ms`) | PASS |
| **POS-05** | Local Gateway Ping (Management) | `ping 192.168.20.1` from PC-Management | 100% ICMP ping success to local SVI gateway | 4/4 replies received (0% loss, `<1ms`) | PASS |
| **POS-06** | Inter-VLAN Routing Verification | `ping 192.168.20.10` from PC-Staff | Packets routed across SVIs through MLS1 backplane; TTL=127 | 4/4 replies received (0% loss, `<1ms`, TTL=127) | PASS |
| **POS-07** | Layer 3 Routed Port Operational Mode | `show interfaces Gi0/1 switchport` | Switchport disabled; operates purely as routed interface | `Switchport: Disabled` confirmed on MLS1 Gi0/1 | PASS |
| **POS-08** | Multilayer Switch Upstream Reachability | `ping 10.0.0.2` from MLS1 | 100% ICMP success to R1 point-to-point interface | 5/5 ICMP echos succeeded (100%, 0/0/0 ms) | PASS |
| **POS-09** | End-to-End External Loopback Reachability | `ping 203.0.113.1` from PC-Staff & PC-Management | Both VLAN hosts reach simulated external destination through R1; TTL=254 | 4/4 replies received on both hosts (0% loss, TTL=254) | PASS |
| **POS-10** | Save and Reopen Persistence | `fileOpen completed.pkt` | Reopened project maintains full routing table and ping reachability | All devices boot cleanly, inter-VLAN and external pings pass | PASS |
| **NEG-01** | Disable Global IP Routing | `no ip routing` on MLS1 | Inter-VLAN forwarding disabled (pings time out); local gateway remains reachable | Staff->Mgmt timed out (0/4); Staff->Gateway succeeded (4/4); restored | PASS |
| **NEG-02** | SVI Shutdown Fault Injection | `shutdown` on `interface Vlan10` | SVI goes down; PC-Staff loses gateway and inter-VLAN connectivity | Gateway and inter-VLAN pings timed out (0/4); restored with `no shutdown` | PASS |
| **NEG-03** | Missing Upstream Default Route | `no ip route 0.0.0.0 0.0.0.0 10.0.0.2` on MLS1 | MLS1 drops packets to external loopback; returns Destination Host Unreachable | `Reply from 192.168.10.1: Destination host unreachable`; inter-VLAN unaffected | PASS |
| **NEG-04** | Asymmetric Return Route Blackhole | `no ip route 192.168.10.0 ...` on R1 | Forward packets reach R1, but return packets dropped; PC-Mgmt still succeeds | PC-Staff external ping timed out (0/4); PC-Mgmt ping succeeded (4/4); restored | PASS |
| **NEG-05** | Final Health Confirmation Pass | Comprehensive ping audit across all devices | 100% reachability confirmed across local gateways, inter-VLAN, and external routes | All positive checks verified passing | PASS |

---

## 2. Detailed Verification Scenarios

### POS-03: Multilayer Switch Routing Table
```text
MLS1# show ip route
Gateway of last resort is 10.0.0.2 to network 0.0.0.0

     10.0.0.0/30 is subnetted, 1 subnets
C       10.0.0.0 is directly connected, GigabitEthernet0/1
C    192.168.10.0/24 is directly connected, Vlan10
C    192.168.20.0/24 is directly connected, Vlan20
S*   0.0.0.0/0 [1/0] via 10.0.0.2
```
*Analysis:* The presence of `C` entries for both `Vlan10` and `Vlan20` demonstrates active SVIs participating in Layer 3 routing. The static candidate default route `S* 0.0.0.0/0` forwards non-local traffic toward the edge router `R1`.

### POS-06: Inter-VLAN Forwarding (PC-Staff to PC-Management)
```text
PC> ping 192.168.20.10
Pinging 192.168.20.10 with 32 bytes of data:
Reply from 192.168.20.10: bytes=32 time<1ms TTL=127
Reply from 192.168.20.10: bytes=32 time<1ms TTL=127
Reply from 192.168.20.10: bytes=32 time<1ms TTL=127
Reply from 192.168.20.10: bytes=32 time<1ms TTL=127
```
*Analysis:* Workstations in separate VLANs communicate directly across the multilayer switch backplane. The TTL of 127 indicates exactly one Layer 3 routing hop (`255 - 1 = 254` or `128 - 1 = 127` depending on host OS stack).

### NEG-01: Global IP Routing Disabled Impact
```text
PC> ping 192.168.20.10
Pinging 192.168.20.10 with 32 bytes of data:
Request timed out.
Request timed out.

PC> ping 192.168.10.1
Pinging 192.168.10.1 with 32 bytes of data:
Reply from 192.168.10.1: bytes=32 time<1ms TTL=255
```
*Analysis:* When `no ip routing` is issued, the multilayer switch reverts to pure Layer 2 bridge behavior. It continues responding to ICMP echos addressed directly to its own local SVI IP (`192.168.10.1`), but refuses to route packets across subnet boundaries.

### NEG-03: Missing Default Static Route Impact
```text
PC> ping 203.0.113.1
Pinging 203.0.113.1 with 32 bytes of data:
Reply from 192.168.10.1: Destination host unreachable.
Reply from 192.168.10.1: Destination host unreachable.
```
*Analysis:* Because `MLS1` has no routing table entry matching `203.0.113.1` and no gateway of last resort, the local SVI gateway (`192.168.10.1`) immediately generates an ICMP Destination Network/Host Unreachable message back to the originating client.

### NEG-04: Asymmetric Return Routing Fault
```text
PC-Staff (192.168.10.10)> ping 203.0.113.1
Request timed out. (100% loss)

PC-Management (192.168.20.10)> ping 203.0.113.1
Reply from 203.0.113.1: bytes=32 time<1ms TTL=254 (100% success)
```
*Analysis:* When `ip route 192.168.10.0 ...` is removed from `R1`, packets from `PC-Staff` reach `R1`, but `R1` has no path to return echo replies, resulting in silent timeouts. Concurrently, `PC-Management` experiences zero packet loss because its return route on `R1` remains active.

---

## 3. Simulator Evidence Reference

The complete unabridged Cisco Packet Tracer CLI session capture is preserved in:
[AI_AGENT_GUIDE/state/PTL-0019-SIMULATOR-RESULTS.md](../../../AI_AGENT_GUIDE/state/PTL-0019-SIMULATOR-RESULTS.md)
