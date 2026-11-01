# Simulator Evidence: PTL-0047

- **Lab ID:** `PTL-0047`
- **Title:** `VLSM Address Plan Fault Investigation`
- **Category:** `ip-addressing`
- **Simulator:** Cisco Packet Tracer 9.0.1 (via localhost MCP bridge)
- **Status:** `TESTED_PASS`
- **Timestamp:** 2026-11-01T07:28:32+08:00
- **Evidence Artifacts:**
  - `labs/ip-addressing/vlsm-address-plan-fault-investigation/assets/completed.pkt` (105,698 bytes)
  - `labs/ip-addressing/vlsm-address-plan-fault-investigation/assets/starter.pkt` (105,769 bytes)
  - `labs/ip-addressing/vlsm-address-plan-fault-investigation/assets/topology.png` (43,889 bytes)
  - `labs/ip-addressing/vlsm-address-plan-fault-investigation/assets/test_evidence.json`
  - `labs/ip-addressing/vlsm-address-plan-fault-investigation/configs/R1.txt` (813 bytes)
  - `labs/ip-addressing/vlsm-address-plan-fault-investigation/configs/R2.txt` (824 bytes)

---

## 1. Positive Verification Summary (`completed.pkt`)

| Test ID | Description | Command Executed | Result | Status |
|---|---|---|---|---|
| **POS-01** | R1 Interface Addressing & Mask Validation | `show ip interface brief` & `show interfaces` on R1 | `Gi0/0/0` 192.168.100.1/26, `Gi0/0/1` 192.168.100.65/27, `Gi0/0/2` 192.168.100.113/30 up/up | **PASS** |
| **POS-02** | R2 Interface Addressing & Mask Validation | `show ip interface brief` & `show interfaces` on R2 | `Gi0/0/0` 192.168.100.97/28, `Gi0/0/2` 192.168.100.114/30 up/up | **PASS** |
| **POS-03** | Engineering LAN Gateway Reachability | `PC-Eng1` ping `192.168.100.1` | 4/4 echo replies received (0% packet loss) | **PASS** |
| **POS-04** | Sales LAN Gateway Reachability | `PC-Sales1` ping `192.168.100.65` | 4/4 echo replies received (0% packet loss) | **PASS** |
| **POS-05** | Inter-Router WAN Transit Reachability | `R1` ping `192.168.100.114` | 5/5 echo replies received (100% success rate, `!!!!!`) | **PASS** |
| **POS-06** | End-to-End Enterprise Ping (PC-Eng1 -> Srv-Web) | `PC-Eng1` ping `192.168.100.98` | 4/4 echo replies received (0% packet loss) | **PASS** |
| **POS-07** | End-to-End Enterprise Ping (PC-Sales1 -> Srv-Web) | `PC-Sales1` ping `192.168.100.98` | 4/4 echo replies received (0% packet loss) | **PASS** |

---

## 2. Negative & Fault Tolerance Summary (`starter.pkt`)

| Test ID | Description | Command Executed | Observed Result | Status |
|---|---|---|---|---|
| **NEG-01** | Starter State: Broadcast Address Host Assignment | `PC-Eng1` ping `192.168.100.98` (with source IP `192.168.100.63`) | Ping returns `Request timed out` (100% loss) due to directed broadcast source rejection | **PASS** |
| **NEG-02** | Starter State: Subnet Mask Truncation on Gateway | `PC-Sales1` (`192.168.100.85/27`) ping gateway `192.168.100.65` & `show interfaces Gi0/0/1` on R1 | Router reports `/28` mask (`192.168.100.65/28`); `.85` is isolated outside `/28` boundary (100% loss) | **PASS** |

---

## 3. Reload Persistence Verification

- Reopened `starter.pkt` cleanly via `ipc.appWindow().fileOpen()`; verified NEG-01 and NEG-02 passed with 100% fidelity.
- Reopened `completed.pkt` cleanly via `ipc.appWindow().fileOpen()`; verified all 7 POS assertions passed without manual re-entry.

