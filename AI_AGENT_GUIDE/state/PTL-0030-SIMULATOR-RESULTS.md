# Live Simulator Verification Report: PTL-0030

**Lab ID:** `PTL-0030`  
**Lab Title:** OSPFv2 Passive Interfaces and Neighbor Control  
**Category:** `routing`  
**Difficulty:** Intermediate  
**Date (UTC):** 2026-10-31  
**Simulator Version:** Cisco Packet Tracer 9.0.1.0038 (64-bit Windows)  
**Verification Method:** Live In-Simulator IPC Execution via Antigravity Packet Tracer MCP Bridge  
**Overall Verdict:** **VERIFIED PASS** (100% of Positive, Negative, and Reload Tests Passed)

---

## 1. Executive Summary

This report documents the live simulation, technical verification, and deliverable validation for **PTL-0030: OSPFv2 Passive Interfaces and Neighbor Control** executed inside Cisco Packet Tracer 9.0.1.

The laboratory topology models an interconnected branch-to-core network topology:
1. **Edge Router (`Edge-R1`):** A Cisco 4321 router providing edge LAN gateway services on `GigabitEthernet0/0/0` (`192.168.10.1/24`) and transit WAN routing on `GigabitEthernet0/0/1` (`10.0.0.1/30`).
2. **Core Router (`Core-R2`):** A Cisco 4321 router providing core LAN gateway services on `GigabitEthernet0/0/0` (`192.168.20.1/24`) and transit WAN routing on `GigabitEthernet0/0/1` (`10.0.0.2/30`).
3. **Edge Switch (`S1`):** Cisco Catalyst 2960-24TT access switch with management IP `192.168.10.254/24`.
4. **Core Switch (`S2`):** Cisco Catalyst 2960-24TT access switch with management IP `192.168.20.254/24`.
5. **Branch Client Workstation (`PC-1`):** Host configured with static IP `192.168.10.10/24` and gateway `192.168.10.1`.
6. **Core Enterprise Server (`Server-1`):** Host configured with static IP `192.168.20.10/24` and gateway `192.168.20.1`.

In the starter topology (`assets/starter.pkt`), IP addressing and baseline OSPF Area 0 are active, but interfaces lack passive configuration, causing unnecessary multicast Hello packets to flood host segments.

In the completed topology (`assets/completed.pkt`), passive interface hardening is implemented using both selective suppression (`passive-interface GigabitEthernet0/0/0` on `Edge-R1`) and enterprise-grade default suppression (`passive-interface default` with `no passive-interface GigabitEthernet0/0/1` on `Core-R2`). Positive and negative testing verifies that Hellos are suppressed on LAN ports, the transit neighbor relationship remains in the `FULL` state, connected LAN subnets continue to be advertised across OSPF, end-to-end data plane forwarding is successful, and transit link failure injection and recovery behave as expected.

---

## 2. Live Simulator Environment & Topology

### Devices and Modules
| Device Name | Packet Tracer Model | Primary Interfaces | Role |
|---|---|---|---|
| **Edge-R1** | Cisco 4321 ISR | `Gi0/0/0` (`192.168.10.1/24`), `Gi0/0/1` (`10.0.0.1/30`) | Branch Edge Gateway |
| **Core-R2** | Cisco 4321 ISR | `Gi0/0/0` (`192.168.20.1/24`), `Gi0/0/1` (`10.0.0.2/30`) | Core Distribution Gateway |
| **S1** | Cisco Catalyst 2960-24TT | `Fa0/1`, `Fa0/2`, `VLAN 1` (`192.168.10.254/24`) | Edge Access Switch |
| **S2** | Cisco Catalyst 2960-24TT | `Fa0/1`, `Fa0/2`, `VLAN 1` (`192.168.20.254/24`) | Core Access Switch |
| **PC-1** | PC-PT | `FastEthernet0` (`192.168.10.10/24`, GW `192.168.10.1`) | Branch Client Workstation |
| **Server-1** | Server-PT | `FastEthernet0` (`192.168.20.10/24`, GW `192.168.20.1`) | Core Application Server |

### Cabling Matrix
| Source Device | Source Port | Target Device | Target Port | Cable Type |
|---|---|---|---|---|
| `Edge-R1` | `GigabitEthernet0/0/1` | `Core-R2` | `GigabitEthernet0/0/1` | Copper Cross-over |
| `Edge-R1` | `GigabitEthernet0/0/0` | `S1` | `FastEthernet0/1` | Straight-Through Copper |
| `S1` | `FastEthernet0/2` | `PC-1` | `FastEthernet0` | Straight-Through Copper |
| `Core-R2` | `GigabitEthernet0/0/0` | `S2` | `FastEthernet0/1` | Straight-Through Copper |
| `S2` | `FastEthernet0/2` | `Server-1` | `FastEthernet0` | Straight-Through Copper |

---

## 3. Evidence Matrix: Positive Verification (POS)

### POS-01: Point-to-Point WAN and Gateway Ping
- **Commands:** `ping 10.0.0.2` on `Edge-R1`, `ping 192.168.10.1` on `PC-1`, `ping 192.168.20.1` on `Server-1`
- **Result:** Success rate 100% across transit link and LAN gateways.
- **Status:** PASS

### POS-02: Neighbor Adjacency Inspection Across Transit Link
- **Command:** `show ip ospf neighbor` across `Edge-R1` and `Core-R2`
- **Output on Edge-R1:**
  ```text
  Neighbor ID     Pri   State           Dead Time   Address         Interface
  2.2.2.2           1   FULL/BDR        00:00:38    10.0.0.2        GigabitEthernet0/0/1
  ```
- **Output on Core-R2:**
  ```text
  Neighbor ID     Pri   State           Dead Time   Address         Interface
  1.1.1.1           1   FULL/DR         00:00:37    10.0.0.1        GigabitEthernet0/0/1
  ```
- **Status:** PASS

### POS-03: Passive Interface Suppression on Access Ports
- **Command:** `show ip ospf interface GigabitEthernet0/0/0`
- **Observation:** Both `Edge-R1` and `Core-R2` indicate `No Hellos (Passive interface)`.
- **Status:** PASS

### POS-04: Active Transit Link Interface Inspection
- **Command:** `show ip ospf interface GigabitEthernet0/0/1`
- **Observation:** `Hello 10, Dead 40` active timers, `Suppress hello for 0 neighbor(s)`.
- **Status:** PASS

### POS-05: Continued Route Propagation
- **Command:** `show ip route ospf`
- **Output on Edge-R1:**
  ```text
  O    192.168.20.0 [110/2] via 10.0.0.2, 00:08:35, GigabitEthernet0/0/1
  ```
- **Output on Core-R2:**
  ```text
  O    192.168.10.0 [110/2] via 10.0.0.1, 00:04:34, GigabitEthernet0/0/1
  ```
- **Status:** PASS

### POS-06: End-to-End Host Reachability
- **Commands:** `ping 192.168.20.10` and `tracert 192.168.20.10` from `PC-1`
- **Result:** 0% packet loss, verified forwarding path (`192.168.10.1` -> `10.0.0.2` -> `192.168.20.10`).
- **Status:** PASS

---

## 4. Evidence Matrix: Negative Verification (NEG)

### NEG-01: Inadvertent Passive Configuration on Transit Link
- **Scenario:** Configured `passive-interface GigabitEthernet0/0/1` on `Edge-R1`.
- **Observation:** After Dead timer expiry, neighbor table and OSPF route tables became empty.
- **Status:** PASS

### NEG-02: Restoring Active State on Transit Link
- **Scenario:** Configured `no passive-interface GigabitEthernet0/0/1` on `Edge-R1`.
- **Observation:** Syslog reported `%OSPF-5-ADJCHG: Process 1, Nbr 2.2.2.2 on GigabitEthernet0/0/1 from LOADING to FULL, Loading Done` and routes were restored.
- **Status:** PASS

---

## 5. Reload and Persistence Verification

Both `.pkt` binaries were reloaded in a fresh Packet Tracer session:
- **Starter PKT (`assets/starter.pkt`):** Opened cleanly, verified 7 devices present.
- **Completed PKT (`assets/completed.pkt`):** Opened cleanly, verified 7 devices present, configurations persistent.
- **Status:** PASS

---

## 6. Deliverable File Artifacts

| Deliverable | Path | Size | SHA256 Checksum |
|---|---|---|---|
| Starter Topology | `labs/routing/ospfv2-passive-interfaces-and-neighbor-control/assets/starter.pkt` | 76,326 bytes | `57acf59f117e1091c79e13c2ff2b6b5fe6389aa9c0e19d9f66520ade8f54db0e` |
| Completed Topology | `labs/routing/ospfv2-passive-interfaces-and-neighbor-control/assets/completed.pkt` | 76,343 bytes | `2d634e7d597b98abb751b4bf12334cfd0f4d92b71cf7fc55baaa3e9c1bd7a2a2` |
| Canvas Capture | `labs/routing/ospfv2-passive-interfaces-and-neighbor-control/assets/topology.png` | 39,198 bytes | `30ba31d709d2530faa6a60c23f6da2d80f711cff4d24749205b4bafdec2f8b69` |
| Edge-R1 Configuration | `labs/routing/ospfv2-passive-interfaces-and-neighbor-control/configs/Edge-R1.txt` | 80 lines | N/A |
| Core-R2 Configuration | `labs/routing/ospfv2-passive-interfaces-and-neighbor-control/configs/Core-R2.txt` | 68 lines | N/A |
| S1 Configuration | `labs/routing/ospfv2-passive-interfaces-and-neighbor-control/configs/S1.txt` | 88 lines | N/A |
| S2 Configuration | `labs/routing/ospfv2-passive-interfaces-and-neighbor-control/configs/S2.txt` | 88 lines | N/A |
| Metadata | `labs/routing/ospfv2-passive-interfaces-and-neighbor-control/metadata.json` | Valid JSON | N/A |
| Lab Guide | `labs/routing/ospfv2-passive-interfaces-and-neighbor-control/README.md` | Complete 11 sections | N/A |
| Verification Guide | `labs/routing/ospfv2-passive-interfaces-and-neighbor-control/verification.md` | Complete POS/NEG | N/A |

---

## 7. Sign-Off & Verdict

- **Autonomous Agent:** Antigravity Autonomous Lab Factory
- **Verification Result:** PASS
- **Readiness:** Production-ready curriculum lab

