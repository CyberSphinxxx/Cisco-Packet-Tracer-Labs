# Simulator Evidence: PTL-0050

- **Lab ID:** `PTL-0050`
- **Title:** `Guest Network Segmentation with ACLs`
- **Category:** `network-security`
- **Simulator:** Cisco Packet Tracer 9.0.1 (via localhost MCP bridge)
- **Status:** `TESTED_PASS`
- **Timestamp:** 2026-11-01T08:30:00+08:00
- **Evidence Artifacts:**
  - `labs/network-security/guest-network-segmentation-with-acls/assets/completed.pkt` (264,828 bytes, SHA256: `ae908bef748c40b737b5d4f15a28a29b4a9d05e3094e642f47ed993f857d1c8c`)
  - `labs/network-security/guest-network-segmentation-with-acls/assets/starter.pkt` (264,887 bytes, SHA256: `c4e5e297f8136b85834602a41428c316b715883c2ac221446f1c2b890ee12a73`)
  - `labs/network-security/guest-network-segmentation-with-acls/assets/topology.png` (51,811 bytes, SHA256: `6a7a0313db5f6f366e54535e74872c0b3039734e7a14105c72abf2f81be3263c`)
  - `labs/network-security/guest-network-segmentation-with-acls/assets/test_evidence.json` (6,154 bytes, SHA256: `5d48a9b4499f44e30fe51bbc735087f9320a236edea988f0e6d44900c25d0879`)
  - `labs/network-security/guest-network-segmentation-with-acls/configs/R1-Edge.txt` (1,288 bytes, SHA256: `2f834a0730d1d86fbb65608e58c2fa09f799aac7c07e09446d60f3748488db5d`)

---

## 1. Positive Verification Summary (`completed.pkt`)

| Test ID | Description | Command Executed | Result | Status |
|---|---|---|---|---|
| **POS-01** | Extended ACL Rule Verification | `show ip access-lists GUEST_FILTER` on R1-Edge | Rules 10-60 present (DNS permit, Web/HTTPS permit, Gateway ICMP permit, RFC 1918 Corporate LAN deny, explicit deny all) | **PASS** |
| **POS-02** | Inbound Access-Group Application | `show ip interface GigabitEthernet0/2` on R1-Edge | `Inbound access list is GUEST_FILTER` active on guest interface | **PASS** |
| **POS-03** | Guest Gateway Reachability | `Guest-Laptop` ping `172.16.50.1` | 4/4 echo replies received (0% packet loss) permitted by rule 40 | **PASS** |
| **POS-04** | Corporate Intranet Internal Traffic | `Corp-PC` ping `192.168.10.50` | 4/4 echo replies received (0% packet loss) on corporate subnet | **PASS** |
| **POS-05** | Corporate External DMZ Reachability | `Corp-PC` ping `203.0.113.53` | 4/4 echo replies received (0% packet loss) across DMZ | **PASS** |

---

## 2. Negative & Security Boundary Enforcement (`completed.pkt`)

| Test ID | Description | Command Executed | Result | Status |
|---|---|---|---|---|
| **NEG-01** | Guest to Corporate Client Isolation | `Guest-Laptop` ping `192.168.10.10` | Request timed out / Destination host unreachable (100% loss); dropped by rule 50 | **PASS** |
| **NEG-02** | Guest to Corporate Server Isolation | `Guest-Laptop` ping `192.168.10.50` | Request timed out / Destination host unreachable (100% loss); dropped by rule 50 | **PASS** |
| **NEG-03** | Guest Direct ICMP to Public Server Dropped | `Guest-Laptop` ping `203.0.113.53` | Request timed out (100% loss); dropped by rule 60 (only UDP 53 and TCP 80/443 permitted) | **PASS** |

---

## 3. Fault Verification (`starter.pkt`)

| Test ID | Description | Observed Starter Behavior | Remediated in Completed | Status |
|---|---|---|---|---|
| **NEG-04** | Missing Inbound Interface Filter | `show ip interface GigabitEthernet0/2` showed `Inbound access list is not set` (ACL erroneously placed outbound on Gi0/0) | `ip access-group GUEST_FILTER in` configured on `GigabitEthernet0/2` | **PASS** |
| **NEG-05** | Incomplete Web Service Access | Rules 20 and 30 missing from ACL in starter | `permit tcp 172.16.50.0 0.0.0.255 host 203.0.113.53 eq www` and `eq 443` added | **PASS** |

---

## 4. Reload Persistence Verification

- Clean reload verification script `verify_ptl0050_clean.py` was executed.
- Verified opening `starter.pkt` from clean state: fast-forwarded time, confirmed NEG-04 fault is present.
- Verified opening `completed.pkt` from clean state: fast-forwarded time, confirmed POS-01 through POS-05 and NEG-01 through NEG-03 all pass without manual intervention.
- Reload Verification Result: **ALL PASS**.
