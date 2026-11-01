# Simulator Results: PTL-0054 — Dual-Stack IPv4 and IPv6 Branch Network

- **Lab ID:** PTL-0054
- **Title:** Dual-Stack IPv4 and IPv6 Branch Network
- **Category:** routing
- **Difficulty:** advanced
- **Execution Date:** 2026-11-01 02:52:22 UTC
- **Packet Tracer Bridge:** Verified localhost IPC (port 54321)

---

## 1. Verified Artifacts

| Artifact | File Size | SHA256 Hash |
|---|---|---|
| `starter.pkt` | 105881 bytes | `98207f874f9ea8b2fe7a5271e8683cfea98e8897f95f8dc3ada766977853703c` |
| `completed.pkt` | 105734 bytes | `9b8859f43f5fe39a1095bbc0cd7f2c3fbf69dc14a459e201a57f6015f6f25ed3` |
| `topology.png` | 39848 bytes | `d58ba6f38a8c0bbac98c741507cf39dd397ad0534b7aa158feb19798290af8a1` |
| `test_evidence.json` | 3263 bytes | `38f95069ca11326c3912a41129f71505ce7053041ecb701aeff7993bb43929f7` |

---

## 2. Test Execution Matrix

### Positive Verification (`completed.pkt`)

| Test ID | Description | Result | Details |
|---|---|---|---|
| **POS-01** | PC-BR1 ICMP reachability to PC-BR2 over IPv4 (192.168.20.10) | **PASS** | 0% packet loss |
| **POS-02** | PC-BR1 ICMP reachability to PC-BR2 over IPv6 (2001:db8:acad:20::10) | **PASS** | 0% packet loss |
| **POS-03** | PC-BR2 ICMP reachability to HQ-R2 Loopback0 IPv4 (172.16.1.1) | **PASS** | 0% packet loss |
| **POS-04** | PC-BR2 ICMP reachability to HQ-R2 Loopback0 IPv6 (2001:db8:acad:100::1) | **PASS** | 0% packet loss |
| **POS-05** | IPv6 routing enabled and static routes active on all routers | **PASS** | R1: PASS, R2: PASS, R3: PASS |

### Starter Fault Verification (`starter.pkt`)

| Test ID | Description | Result | Details |
|---|---|---|---|
| **NEG-01** | Starter Branch-2-R3 lacks IPv6 default route (IPv6 traffic dropped) | **PASS** | ::/0 absent from static route table |
| **NEG-02** | Starter Branch-1-R1 has invalid IPv4 default route next-hop (10.1.12.5) | **PASS** | Invalid next-hop unresolvable |

---

## 3. Reload Persistence Verification

- **Starter PKT Reload:** Reopening `starter.pkt` from a fresh workspace confirms `Branch-2-R3` lacks the `::/0` default route, isolating Branch 2 from incoming IPv6 packets, and `Branch-1-R1` has an unreachable IPv4 next-hop `10.1.12.5`.
- **Completed PKT Reload:** Reopening `completed.pkt` from a fresh workspace confirms bidirectional IPv4 and IPv6 ICMP reachability between `PC-BR1` and `PC-BR2` with 0% packet loss, full reachability to `HQ-R2` Loopback0, and active dual-stack routing tables.
- **Reload Status:** **ALL PASS (100% Reliability)**.
