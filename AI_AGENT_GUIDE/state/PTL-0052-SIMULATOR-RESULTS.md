# Simulator Results: PTL-0052 — DHCP Helper-Address Multi-Subnet Troubleshooting

- **Lab ID:** PTL-0052
- **Title:** DHCP Helper-Address Multi-Subnet Troubleshooting
- **Category:** network-services
- **Difficulty:** intermediate
- **Execution Date:** 2026-11-01 01:45:45 UTC
- **Packet Tracer Bridge:** Verified localhost IPC (port 54321)

---

## 1. Verified Artifacts

| Artifact | File Size | SHA256 Hash |
|---|---|---|
| `starter.pkt` | 95011 bytes | `5b2c6f89bf5fed75b83cb06fd04104a8d21f77b8554f52663487d5ec5978a21f` |
| `completed.pkt` | 94804 bytes | `1707976ad8f1e49211afaca4e7e621245a8d5eaea3a2325fb37ba334dcf7dedd` |
| `topology.png` | 39900 bytes | `bf2bc799112dedf87db2e466c79efbd97f681b9ef7174d7af1fbcaa06ee96232` |
| `test_evidence.json` | 3900 bytes | `b22579bc99df06342670052d830f10d79f893c4931c5def52023b971c3f577f1` |

---

## 2. Test Execution Matrix

### Positive Verification (`completed.pkt`)

| Test ID | Description | Result | Details |
|---|---|---|---|
| **POS-01** | PC-VLAN10 dynamic IP lease in 192.168.10.0/24 | **PASS** | IP=192.168.10.11, Mask=255.255.255.0, GW=192.168.10.1 |
| **POS-02** | PC-VLAN20 dynamic IP lease in 192.168.20.0/24 | **PASS** | IP=192.168.20.11, Mask=255.255.255.0, GW=192.168.20.1 |
| **POS-03** | R1-HQ active DHCP bindings for both VLAN subnets | **PASS** | Bindings verified on central server |
| **POS-04** | PC-VLAN10 ping default gateway 192.168.10.1 | **PASS** | 0% packet loss |
| **POS-05** | PC-VLAN20 ping default gateway 192.168.20.1 | **PASS** | 0% packet loss |
| **POS-06** | Inter-VLAN routing ping (PC-VLAN10 -> PC-VLAN20) | **PASS** | 0% packet loss |
| **POS-07** | End-to-end ping PC-VLAN10 -> R1-HQ WAN (10.0.0.1) | **PASS** | 0% packet loss |

### Negative & Starter Fault Verification (`starter.pkt`)

| Test ID | Description | Result | Details |
|---|---|---|---|
| **NEG-01** | PC-VLAN10 lease failure due to wrong helper (10.0.0.5) | **PASS** | Starter IP=169.254.147.7 |
| **NEG-02** | PC-VLAN20 lease failure due to scope mismatch (192.168.200.0/24) | **PASS** | Starter IP=169.254.200.163 |

---

## 3. Reload Persistence Verification

- **Starter PKT Reload:** Reopening `starter.pkt` from a fresh workspace confirms `R2-Branch` subinterface Gi0/1.10 points to `10.0.0.5` and `R1-HQ` pool `POOL_VLAN20` defines subnet `192.168.200.0/24`. Clients fail to acquire dynamic addresses until remediated.
- **Completed PKT Reload:** Reopening `completed.pkt` from a fresh workspace confirms both VLAN pools successfully assign dynamic leases (`192.168.10.11`, `192.168.20.11`), bindings populate in `show ip dhcp binding`, and inter-VLAN ICMP connectivity passes with 0% loss.
- **Reload Status:** **ALL PASS (100% Reliability)**.
