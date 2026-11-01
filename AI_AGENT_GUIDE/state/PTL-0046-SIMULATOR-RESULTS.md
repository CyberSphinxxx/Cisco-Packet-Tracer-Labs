# Simulator Evidence: PTL-0046

- **Lab ID:** `PTL-0046`
- **Title:** `LACP EtherChannel Member Mismatch Diagnosis`
- **Category:** `switching`
- **Simulator:** Cisco Packet Tracer 9.0.1 (via localhost MCP bridge)
- **Status:** `TESTED_PASS`
- **Timestamp:** 2026-11-01T06:53:19+08:00
- **Evidence Artifacts:**
  - `labs/switching/lacp-etherchannel-member-mismatch-diagnosis/assets/completed.pkt` (86,355 bytes)
  - `labs/switching/lacp-etherchannel-member-mismatch-diagnosis/assets/starter.pkt` (86,454 bytes)
  - `labs/switching/lacp-etherchannel-member-mismatch-diagnosis/assets/topology.png` (43,645 bytes)
  - `labs/switching/lacp-etherchannel-member-mismatch-diagnosis/assets/test_evidence.json`
  - `labs/switching/lacp-etherchannel-member-mismatch-diagnosis/configs/SW-1.txt`
  - `labs/switching/lacp-etherchannel-member-mismatch-diagnosis/configs/SW-2.txt`

---

## 1. Positive Verification Summary (`completed.pkt`)

| Test ID | Description | Command Executed | Result | Status |
|---|---|---|---|---|
| **POS-01** | EtherChannel Logical State | `show etherchannel summary` on SW-1 & SW-2 | `Po1(SU)` (Layer 2, in Use) active on both switches | **PASS** |
| **POS-02** | Member Interface Bundling | `show etherchannel summary` on SW-1 & SW-2 | Both `Fa0/1(P)` and `Fa0/2(P)` bundled in port-channel | **PASS** |
| **POS-03** | LACP Protocol Negotiation | `show etherchannel port-channel` on SW-1 & SW-2 | Protocol = `LACP`, 2 active ports bundled | **PASS** |
| **POS-04** | VLAN 10 End-to-End Ping | `PC-1` ping `192.168.10.20` (`PC-3`) | 4/4 echo replies received (0% packet loss) | **PASS** |
| **POS-05** | VLAN 20 End-to-End Ping | `PC-2` ping `192.168.20.20` (`PC-4`) | 4/4 echo replies received (0% packet loss) | **PASS** |
| **POS-06** | Inter-VLAN Layer 2 Isolation | `PC-1` ping `192.168.20.10` (`PC-2`) | Request timed out (100% loss) | **PASS** |

---

## 2. Negative & Fault Tolerance Summary (`starter.pkt`)

| Test ID | Description | Command Executed | Observed Result | Status |
|---|---|---|---|---|
| **NEG-01** | Member Mismatch Audit | `SW-2# show etherchannel summary` & `show interfaces Fa0/2 switchport` | `Fa0/2` is NOT bundled `(P)` in Po1; switchport mode shows `static access` vs Po1 trunk | **PASS** |
| **NEG-02** | Degraded Channel Audit | `SW-2# show etherchannel port-channel` | Reports degraded operational state (only 1 port active instead of 2) | **PASS** |

---

## 3. Reload Persistence Verification

- Clean file reopening of `completed.pkt` verified: all 6 POS assertions passed without configuration re-entry.
- Clean file reopening of `starter.pkt` verified: faulted state preserved across reload with 100% pass rate on NEG assertions.

