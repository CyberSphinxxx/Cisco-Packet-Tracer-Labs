# Simulator Results: PTL-0053 — Secure Management Network Design

- **Lab ID:** PTL-0053
- **Title:** Secure Management Network Design
- **Category:** network-security
- **Difficulty:** advanced
- **Execution Date:** 2026-11-01 02:11:58 UTC
- **Packet Tracer Bridge:** Verified localhost IPC (port 54321)

---

## 1. Verified Artifacts

| Artifact | File Size | SHA256 Hash |
|---|---|---|
| `starter.pkt` | 102241 bytes | `d08af5c62393bf376de5f9ba194fcca1a74cab8792832bd29cbe5c936511aca3` |
| `completed.pkt` | 102019 bytes | `5a5ad79dc0021ef5932a0ec660c4237e197da9020e732818e7839b0324a98937` |
| `topology.png` | 38196 bytes | `d82eccfa7d4b8911a21f79d46484126a9807d71fc3adcf5b582f92283539a27d` |
| `test_evidence.json` | 4956 bytes | `10c9c8e7b0be68334776a54549bb9b1de62f37e4c6fabb71499593a1dc164674` |

---

## 2. Test Execution Matrix

### Positive Verification (`completed.pkt`)

| Test ID | Description | Result | Details |
|---|---|---|---|
| **POS-01** | Admin-PC ICMP reachability to R1-Edge management gateway (192.168.99.1) | **PASS** | 0% packet loss |
| **POS-02** | Admin-PC ICMP reachability to SW-Core management SVI (192.168.99.2) | **PASS** | 0% packet loss |
| **POS-03** | Admin-PC ICMP reachability to SW-Access management SVI (192.168.99.3) | **PASS** | 0% packet loss |
| **POS-04** | User-PC ICMP reachability to data plane default gateway (192.168.10.1) | **PASS** | 0% packet loss |
| **POS-05** | SSHv2 enabled on R1-Edge, SW-Core, and SW-Access | **PASS** | R1: SSH-v2, SWC: SSH-v2, SWA: SSH-v2 |

### Negative & Security Boundary Enforcement (`completed.pkt`)

| Test ID | Description | Result | Details |
|---|---|---|---|
| **NEG-01** | User-PC blocked from R1-Edge management interface (192.168.99.1) | **PASS** | 100% loss (blocked by USER_FILTER) |
| **NEG-02** | User-PC blocked from SW-Core management SVI (192.168.99.2) | **PASS** | 100% loss (blocked by USER_FILTER) |
| **NEG-03** | User-PC blocked from SW-Access management SVI (192.168.99.3) | **PASS** | 100% loss (blocked by USER_FILTER) |

### Starter Fault Verification (`starter.pkt`)

| Test ID | Description | Result | Details |
|---|---|---|---|
| **NEG-04** | Starter R1-Edge lacks USER_FILTER on Gi0/0.10 | **PASS** | Inbound access list is not set |
| **NEG-05** | Starter SW-Access exposes plaintext Telnet on VTY lines | **PASS** | Telnet enabled |

---

## 3. Reload Persistence Verification

- **Starter PKT Reload:** Reopening `starter.pkt` from a fresh workspace confirms `SW-Access` management defaults to VLAN 1 with plaintext Telnet enabled, and `R1-Edge` subinterface Gi0/0.10 has no inbound access group bound.
- **Completed PKT Reload:** Reopening `completed.pkt` from a fresh workspace confirms management SVIs are active on VLAN 99, `Admin-PC` has 0% loss to all management IP endpoints, `User-PC` is dropped when probing VLAN 99, and SSHv2 is enforced on all VTY lines.
- **Reload Status:** **ALL PASS (100% Reliability)**.
