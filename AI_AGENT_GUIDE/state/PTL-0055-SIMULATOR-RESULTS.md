# Simulator Results: PTL-0055 — Integrated Branch Network Troubleshooting Challenge

- **Lab ID:** PTL-0055
- **Title:** Integrated Branch Network Troubleshooting Challenge
- **Category:** routing
- **Difficulty:** advanced
- **Execution Date:** 2026-11-01 04:01:16 UTC
- **Packet Tracer Bridge:** Verified localhost IPC (port 54321)

---

## 1. Verified Artifacts

| Artifact | File Size | SHA256 Hash |
|---|---|---|
| `starter.pkt` | 120877 bytes | `7b1189419687b994a08c9b2f0f422c4602addbb74912f64cee15f4c51e46b02d` |
| `completed.pkt` | 120594 bytes | `92004b2413dd4c00680f921a0629c73fc349adf864ebeea15c749fc96b33d67b` |
| `topology.png` | 44199 bytes | `a44d541c18d596453a89d1001a00f1cab9dcc886c51d2fdbb4fed4d4493c54f3` |
| `test_evidence.json` | 5132 bytes | `70102a49740e5b1e677281f59a7127144d3d7851b2d38df5bae9c38d61ae6d43` |

---

## 2. Test Execution Matrix

### Positive Verification (`completed.pkt`)

| Test ID | Description | Result | Details |
|---|---|---|---|
| **POS-01** | Staff-PC1 receives dynamic IPv4 configuration via DHCP relay | **PASS** | IP assigned in 192.168.10.0/24 |
| **POS-02** | Staff-PC1 ICMP reachability to VLAN 10 default gateway (192.168.10.1) | **PASS** | 0% packet loss |
| **POS-03** | Eng-PC2 ICMP reachability to VLAN 20 default gateway (192.168.20.1) | **PASS** | 0% packet loss |
| **POS-04** | Eng-PC2 inter-VLAN ICMP reachability to Staff-PC1 | **PASS** | 0% packet loss |
| **POS-05** | Eng-PC2 WAN ICMP reachability to HQ-Server (10.0.1.100) | **PASS** | 0% packet loss |
| **POS-06** | Staff-PC1 WAN ICMP reachability to HQ-Server (10.0.1.100) | **PASS** | 0% packet loss |

### Starter Fault Verification (`starter.pkt`)

| Test ID | Description | Result | Details |
|---|---|---|---|
| **NEG-01** | Starter Branch-SW1 trunk prunes VLAN 20 (Eng-PC2 gateway unreachable) | **PASS** | 100% packet loss |
| **NEG-02** | Starter Branch-R2 lacks DHCP helper (Staff-PC1 fails to obtain dynamic lease) | **PASS** | 0.0.0.0 unassigned |
| **NEG-03** | Starter HQ-R1 static route mispoints to unresolvable next-hop (10.1.12.6) | **PASS** | S 192.168.0.0/16 via 10.1.12.6 |
| **NEG-04** | Starter Branch-R2 edge ACL explicitly drops ICMP to HQ-Server | **PASS** | deny icmp any host 10.0.1.100 |

---

## 3. Reload Persistence Verification

- **Starter PKT Reload:** Reopening `starter.pkt` from a fresh workspace confirms `Branch-SW1` trunk blocks VLAN 20, `Staff-PC1` receives no DHCP lease, `HQ-R1` has invalid return route `10.1.12.6`, and `Branch-R2` ACL drops ICMP to `10.0.1.100`.
- **Completed PKT Reload:** Reopening `completed.pkt` from a fresh workspace confirms dynamic DHCP address assignment on `Staff-PC1`, 0% packet loss across all intra-VLAN, inter-VLAN, and WAN paths to `HQ-Server`, and active bidirectional routing.
- **Reload Status:** **ALL PASS (100% Reliability)**.
