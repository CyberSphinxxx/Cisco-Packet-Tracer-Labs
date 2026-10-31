# Simulator Results: PTL-0044 VLAN Trunk Allowed-List Troubleshooting

## Metadata
- **Lab ID:** PTL-0044
- **Slug:** `vlan-trunk-allowed-list-troubleshooting`
- **Category:** `switching`
- **Difficulty:** `intermediate`
- **Date Tested:** 2026-11-01
- **Packet Tracer Version:** 9.0.1
- **Overall Status:** PASS (All 7 POS and 2 NEG tests passing, 100% reload verification)

## Test Results Matrix

| Test ID | Description | Status | Key Output / Evidence |
| :--- | :--- | :--- | :--- |
| **POS-01** | Inter-switch trunk operational mode | **PASS** | `SW-1` and `SW-2` `Gi0/1`: Administrative Mode: trunk, Operational Mode: trunk, Encapsulation: dot1q, Negotiation: Off |
| **POS-02** | Trunk Native VLAN alignment | **PASS** | `SW-1` and `SW-2` `show interfaces trunk` confirms Native VLAN 99 aligned across both switches (`Trunking Native Mode VLAN: 99`) |
| **POS-03** | Trunk Allowed VLAN list consistency | **PASS** | `show interfaces trunk` on `SW-1` and `SW-2` shows `10,20,30,99` allowed, active in management domain, and forwarding |
| **POS-04** | VLAN 10 (Engineering) inter-switch reachability | **PASS** | `PC-Eng1` (`192.168.10.10`) pings `PC-Eng2` (`192.168.10.20`) with 4/4 echo replies (0% loss, TTL=128) |
| **POS-05** | VLAN 20 (Marketing) inter-switch reachability | **PASS** | `PC-Mkt1` (`192.168.20.10`) pings `PC-Mkt2` (`192.168.20.20`) with 4/4 echo replies (0% loss, TTL=128) |
| **POS-06** | VLAN 30 (Operations) inter-switch reachability | **PASS** | `PC-Ops1` (`192.168.30.10`) pings `PC-Ops2` (`192.168.30.20`) with 4/4 echo replies (0% loss, TTL=128), verifying restored trunk transport |
| **POS-07** | Layer 2 inter-VLAN traffic isolation | **PASS** | `PC-Eng1` ping to `PC-Mkt1` (`192.168.20.10`) times out (100% loss), verifying proper Layer 2 segmentation without inter-VLAN leakage |
| **NEG-01** | Starter state fault: VLAN 30 pruned | **PASS** | In starter state, `PC-Ops1` ping to `PC-Ops2` fails with 100% loss (`Request timed out`), confirming VLAN 30 traffic is dropped by trunk filter |
| **NEG-02** | Starter state fault identification | **PASS** | In starter state, `SW-1` trunk allowed list is `10,20,99` (VLAN 30 omitted/pruned) and `SW-2` has Native VLAN 1 (`Trunking Native Mode VLAN: 1`), causing native VLAN mismatch |

## Reload Verification Evidence
- Reopened `starter.pkt` cleanly from disk via `ipc.appWindow().fileOpen()`.
- Verified starter fault state persisted: `SW-1` trunk allowed list is `10,20,99`, `SW-2` native VLAN is 1, and `PC-Ops1` cannot reach `PC-Ops2` while `PC-Eng1` successfully reaches `PC-Eng2`.
- Reopened `completed.pkt` cleanly from disk via `ipc.appWindow().fileOpen()`.
- Switches `SW-1` and `SW-2` loaded completed startup configurations from NVRAM without errors.
- Verified `show interfaces trunk` on both switches displays Native VLAN 99 and allowed VLANs `10,20,30,99`.
- Verified all positive tests (`POS-01` through `POS-07`) passed with 100% success rate.

