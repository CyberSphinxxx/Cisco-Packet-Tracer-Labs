# Simulator Results: PTL-0045 Spanning Tree Root and Blocked-Port Investigation

## Metadata
- **Lab ID:** PTL-0045
- **Slug:** `spanning-tree-root-and-blocked-port-investigation`
- **Category:** `switching`
- **Difficulty:** `intermediate`
- **Date Tested:** 2026-11-01
- **Packet Tracer Version:** 9.0.1
- **Overall Status:** PASS (All 6 POS and 2 NEG tests passing, 100% reload verification)

## Test Results Matrix

| Test ID | Description | Status | Key Output / Evidence |
| :--- | :--- | :--- | :--- |
| **POS-01** | Primary Root Bridge Election (`SW-1`) | **PASS** | `SW-1# show spanning-tree vlan 1` confirms `This bridge is the root` with Priority `4097` (priority 4096 sys-id-ext 1) |
| **POS-02** | Secondary Root Bridge Priority (`SW-2`) | **PASS** | `SW-2# show spanning-tree vlan 1` displays Bridge Priority `8193` (priority 8192 sys-id-ext 1) |
| **POS-03** | Core Trunk Forwarding Verification (`Gi0/1`) | **PASS** | `SW-1 Gi0/1` is `Desg FWD` (Cost 4) and `SW-2 Gi0/1` is `Root FWD` (Cost 4); core distribution trunk is fully operational |
| **POS-04** | Alternate Blocked Port on Access Uplink (`SW-3`) | **PASS** | `SW-3# show spanning-tree vlan 1` confirms `Fa0/2` is in `Altn BLK` (Alternate / Blocked) state, preventing Layer 2 loops while protecting core bandwidth |
| **POS-05** | Distribution Workstation to Server Reachability | **PASS** | `PC-1> ping 192.168.1.100` succeeds with 4/4 echo replies (0% loss, TTL=128) across the unblocked core Gigabit link |
| **POS-06** | Access Workstation to Server Reachability | **PASS** | `PC-2> ping 192.168.1.100` succeeds with 4/4 echo replies (0% loss, TTL=128) traversing active root port `Fa0/1` |
| **NEG-01** | Starter State: Inadvertent Root Bridge Inversion | **PASS** | In starter state, access switch `SW-3` reports `This bridge is the root` with Priority `4097`, improperly dominating the campus STP topology |
| **NEG-02** | Starter State: Core Trunk Link Blocked | **PASS** | In starter state, core distribution trunk `SW-1 Gi0/1` is forced into `Altn BLK` (Alternate / Blocked) state due to inverted root path costs, bottlenecking core traffic |

## Reload Verification Evidence
- Reopened `starter.pkt` cleanly from disk via `ipc.appWindow().fileOpen()`.
- Verified starter fault state persisted: `SW-3` is root bridge (`Priority 4097`), and `SW-1 Gi0/1` is in `Altn BLK` state blocking core bandwidth.
- Reopened `completed.pkt` cleanly from disk via `ipc.appWindow().fileOpen()`.
- Switches `SW-1`, `SW-2`, and `SW-3` loaded completed startup configurations from NVRAM without errors.
- Verified deterministic STP topology: `SW-1` is primary root (4096), `SW-2` is secondary root (8192), `SW-3 Fa0/2` is `Altn BLK`, and core link `Gi0/1` is unblocked (`Desg FWD` / `Root FWD`).
- Verified all positive tests (`POS-01` through `POS-06`) passed with 100% success rate.

