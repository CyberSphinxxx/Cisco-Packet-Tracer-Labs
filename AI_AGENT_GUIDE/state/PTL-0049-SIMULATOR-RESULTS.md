# Simulator Evidence: PTL-0049

- **Lab ID:** `PTL-0049`
- **Title:** `Campus Distribution and Access VLAN Design`
- **Category:** `switching`
- **Simulator:** Cisco Packet Tracer 9.0.1 (via localhost MCP bridge)
- **Status:** `TESTED_PASS`
- **Timestamp:** 2026-11-01T08:02:11+08:00
- **Evidence Artifacts:**
  - `labs/switching/campus-distribution-and-access-vlan-design/assets/completed.pkt` (106,503 bytes)
  - `labs/switching/campus-distribution-and-access-vlan-design/assets/starter.pkt` (106,562 bytes)
  - `labs/switching/campus-distribution-and-access-vlan-design/assets/topology.png` (45,781 bytes)
  - `labs/switching/campus-distribution-and-access-vlan-design/assets/test_evidence.json`
  - `labs/switching/campus-distribution-and-access-vlan-design/configs/DLS-1.txt` (1,957 bytes)
  - `labs/switching/campus-distribution-and-access-vlan-design/configs/ALS-1.txt` (1,515 bytes)
  - `labs/switching/campus-distribution-and-access-vlan-design/configs/ALS-2.txt` (1,464 bytes)

---

## 1. Positive Verification Summary (`completed.pkt`)

| Test ID | Description | Command Executed | Result | Status |
|---|---|---|---|---|
| **POS-01** | DLS-1 Hardware Routing & SVI Table | `show ip route connected` on DLS-1 | Connected subnets for VLAN 10 (`192.168.10.0/24`), VLAN 20 (`192.168.20.0/24`), VLAN 30 (`192.168.30.0/24`), and VLAN 99 (`192.168.99.0/24`) active | **PASS** |
| **POS-02** | 802.1Q Trunking & Native VLAN Audit | `show interfaces trunk` on DLS-1, ALS-1, ALS-2 | 802.1Q encapsulation, Native VLAN 99, allowed list `10,20,30,99` active across all inter-switch trunks | **PASS** |
| **POS-03** | Faculty Local Gateway Reachability | `PC-Faculty` ping `192.168.10.1` | 4/4 echo replies received (0% packet loss) | **PASS** |
| **POS-04** | Student Local Gateway Reachability | `PC-Student` ping `192.168.20.1` | 4/4 echo replies received (0% packet loss) | **PASS** |
| **POS-05** | Faculty to Server Inter-VLAN Reachability | `PC-Faculty` ping `192.168.30.10` | 4/4 echo replies received (0% packet loss) across SVI routed path | **PASS** |
| **POS-06** | Student to Server Inter-VLAN Reachability | `PC-Student` ping `192.168.30.10` | 4/4 echo replies received (0% packet loss) across SVI routed path | **PASS** |
| **POS-07** | Inter-VLAN Client-to-Client Reachability | `PC-Faculty` ping `192.168.20.10` | 4/4 echo replies received (0% packet loss, inter-VLAN routed) | **PASS** |

---

## 2. Negative & Fault Tolerance Summary (`starter.pkt`)

| Test ID | Description | Command Executed | Observed Result | Status |
|---|---|---|---|---|
| **NEG-01** | Access Port VLAN Misassignment | `PC-Student` ping `192.168.20.1` | Ping fails with 100% loss (`Request timed out`); ALS-1 Fa0/2 misconfigured in default VLAN 1 rather than VLAN 20 | **PASS** |
| **NEG-02** | Disabled Multilayer Routing & Trunk Pruning | `PC-Faculty` ping `192.168.30.10` & `show ip route` on DLS-1 | Ping returns `Request timed out` (100% loss); DLS-1 has IP routing disabled and ALS-2 Gi0/1 trunk omits VLAN 30 | **PASS** |

---

## 3. Reload Persistence Verification

- Reopened `starter.pkt` cleanly via `ipc.appWindow().fileOpen()`; verified NEG-01 and NEG-02 passed with 100% fidelity.
- Reopened `completed.pkt` cleanly via `ipc.appWindow().fileOpen()`; verified all 7 POS assertions passed without manual intervention.

