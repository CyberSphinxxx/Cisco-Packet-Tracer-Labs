# Simulator Evidence: PTL-0048

- **Lab ID:** `PTL-0048`
- **Title:** `Multi-Site Routing with Branch Networks`
- **Category:** `routing`
- **Simulator:** Cisco Packet Tracer 9.0.1 (via localhost MCP bridge)
- **Status:** `TESTED_PASS`
- **Timestamp:** 2026-11-01T07:39:35+08:00
- **Evidence Artifacts:**
  - `labs/routing/multi-site-routing-with-branch-networks/assets/completed.pkt` (108,261 bytes)
  - `labs/routing/multi-site-routing-with-branch-networks/assets/starter.pkt` (108,585 bytes)
  - `labs/routing/multi-site-routing-with-branch-networks/assets/topology.png` (44,373 bytes)
  - `labs/routing/multi-site-routing-with-branch-networks/assets/test_evidence.json`
  - `labs/routing/multi-site-routing-with-branch-networks/configs/R-HQ.txt` (842 bytes)
  - `labs/routing/multi-site-routing-with-branch-networks/configs/R-BR1.txt` (735 bytes)
  - `labs/routing/multi-site-routing-with-branch-networks/configs/R-BR2.txt` (735 bytes)

---

## 1. Positive Verification Summary (`completed.pkt`)

| Test ID | Description | Command Executed | Result | Status |
|---|---|---|---|---|
| **POS-01** | R-HQ Static Route Audit | `show ip route static` on R-HQ | `10.20.0.0/24 via 172.16.12.2` and `10.30.0.0/24 via 172.16.13.2` active | **PASS** |
| **POS-02** | Spoke Default Route Audit | `show ip route static` on R-BR1 and R-BR2 | `0.0.0.0/0 via 172.16.12.1` on R-BR1, `0.0.0.0/0 via 172.16.13.1` on R-BR2 | **PASS** |
| **POS-03** | Branch 1 Local Gateway Reachability | `PC-BR1` ping `10.20.0.1` | 4/4 echo replies received (0% packet loss) | **PASS** |
| **POS-04** | Branch 2 Local Gateway Reachability | `PC-BR2` ping `10.30.0.1` | 4/4 echo replies received (0% packet loss) | **PASS** |
| **POS-05** | Branch 1 to HQ Server Reachability | `PC-BR1` ping `10.10.0.10` | 4/4 echo replies received (0% packet loss) | **PASS** |
| **POS-06** | Branch 2 to HQ Server Reachability | `PC-BR2` ping `10.10.0.10` | 4/4 echo replies received (0% packet loss) | **PASS** |
| **POS-07** | Inter-Branch Spoke-to-Spoke Transit | `PC-BR1` ping `10.30.0.10` | 4/4 echo replies received (0% packet loss, TTL=125) | **PASS** |

---

## 2. Negative & Fault Tolerance Summary (`starter.pkt`)

| Test ID | Description | Command Executed | Observed Result | Status |
|---|---|---|---|---|
| **NEG-01** | Starter State: Endpoint Gateway Typo & Invalid Next-Hop | `PC-BR1` ping `10.10.0.10` | Ping fails with 100% loss (`Request timed out` / `Destination host unreachable`) | **PASS** |
| **NEG-02** | Starter State: Missing Return Route on Hub | `PC-BR2` ping `10.10.0.10` & `show ip route static` on R-HQ | Ping returns `Request timed out` (100% loss); R-HQ lacks return route for `10.30.0.0/24` | **PASS** |

---

## 3. Reload Persistence Verification

- Reopened `starter.pkt` cleanly via `ipc.appWindow().fileOpen()`; verified NEG-01 and NEG-02 passed with 100% fidelity.
- Reopened `completed.pkt` cleanly via `ipc.appWindow().fileOpen()`; verified all 7 POS assertions passed without manual re-entry.

