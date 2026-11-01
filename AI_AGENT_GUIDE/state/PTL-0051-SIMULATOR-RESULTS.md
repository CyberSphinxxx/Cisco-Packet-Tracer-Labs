# Simulator Evidence: PTL-0051

- **Lab ID:** `PTL-0051`
- **Title:** `DMZ Services with Edge ACL Policy`
- **Category:** `network-security`
- **Simulator:** Cisco Packet Tracer 9.0.1 (via localhost MCP bridge)
- **Status:** `TESTED_PASS`
- **Timestamp:** 2026-11-01T09:18:00+08:00
- **Evidence Artifacts:**
  - `labs/network-security/dmz-services-with-edge-acl-policy/assets/completed.pkt` (128,401 bytes, SHA256: `b2ebb9a18e0850ea6f7af2261362994097e6d9220082c546d51ce07ba03df547`)
  - `labs/network-security/dmz-services-with-edge-acl-policy/assets/starter.pkt` (128,470 bytes, SHA256: `2176ac8c92e12b65df7e955fadc69fc39ee3bd72b6cb158a79b2f9b36fc8151f`)
  - `labs/network-security/dmz-services-with-edge-acl-policy/assets/topology.png` (46,927 bytes, SHA256: `5b1b18797c782a2483fa8a52299a7f3004f48e4f37de9fa9d674c1d1d374956a`)
  - `labs/network-security/dmz-services-with-edge-acl-policy/assets/test_evidence.json` (3,901 bytes, SHA256: `ee0a66f6ec6475ef83a7598a7c7362374ec439362da524066984450563b55362`)
  - `labs/network-security/dmz-services-with-edge-acl-policy/configs/R1-Edge.txt` (1,555 bytes, SHA256: `f9009e775d952d6d32b8d79fc08b901bcf812b7eb795460cce76c57c272e1782`)

---

## 1. Positive Verification Summary (`completed.pkt`)

| Test ID | Description | Command Executed | Result | Status |
|---|---|---|---|---|
| **POS-01** | Outside-to-DMZ ACL Rules Active | `show ip access-lists OUTSIDE_TO_DMZ` on R1-Edge | Web (HTTP 80), Secure Web (HTTPS 443), and ICMP echo permitted to DMZ-Web (`172.16.2.10`), RFC 1918 corporate denied, explicit deny all | **PASS** |
| **POS-02** | DMZ Policy ACL Rules Active | `show ip access-lists DMZ_POLICY` on R1-Edge | MySQL (TCP 3306) to DB-Server permitted, Gateway ICMP echo permitted, corporate echo-reply permitted, corporate LAN denied, public internet permitted, explicit deny all | **PASS** |
| **POS-03** | External Client Reaches Public DMZ Web Server | `Ext-Client` ping `172.16.2.10` | 4/4 echo replies received (0% packet loss) permitted through Gi0/1 inbound ACL | **PASS** |
| **POS-04** | Corporate Intranet Database Reachability | `Corp-PC` ping `192.168.1.50` | 4/4 echo replies received (0% packet loss) across internal LAN switch | **PASS** |
| **POS-05** | Corporate Administrative Access to DMZ Web Server | `Corp-PC` ping `172.16.2.10` | 4/4 echo replies received (0% packet loss) permitted to DMZ with echo-reply authorized by rule 30 | **PASS** |
| **POS-06** | DMZ Web Server Reaches Local Default Gateway | `DMZ-Web` ping `172.16.2.1` | 4/4 echo replies received (0% packet loss) permitted by rule 20 | **PASS** |

---

## 2. Negative & Security Boundary Enforcement (`completed.pkt`)

| Test ID | Description | Command Executed | Result | Status |
|---|---|---|---|---|
| **NEG-01** | External Client Blocked from Corporate PC | `Ext-Client` ping `192.168.1.10` | Request timed out / Destination host unreachable (100% loss); dropped by OUTSIDE_TO_DMZ rule 40 | **PASS** |
| **NEG-02** | External Client Blocked from Database Server | `Ext-Client` ping `192.168.1.50` | Request timed out / Destination host unreachable (100% loss); dropped by OUTSIDE_TO_DMZ rule 40 | **PASS** |
| **NEG-03** | DMZ Pivot Attempt to Corporate PC Blocked | `DMZ-Web` ping `192.168.1.10` | Destination host unreachable (100% loss); dropped by DMZ_POLICY rule 40 corporate LAN isolation | **PASS** |

---

## 3. Fault Verification (`starter.pkt`)

| Test ID | Description | Observed Starter Behavior | Remediated in Completed | Status |
|---|---|---|---|---|
| **NEG-04** | Missing Inbound Interface Filter on WAN | `show ip interface GigabitEthernet0/1` showed `Inbound access list is not set` (WAN link lacked perimeter firewall filtering) | `ip access-group OUTSIDE_TO_DMZ in` configured on `GigabitEthernet0/1` | **PASS** |
| **NEG-05** | Missing Corporate Intranet Isolation in DMZ Policy | Rule 40 (`deny ip 172.16.2.0 0.0.0.255 192.168.1.0 0.0.0.255`) absent from `DMZ_POLICY` | Configured strict corporate LAN deny statement before general internet permit | **PASS** |

---

## 4. Reload Persistence Verification

- Clean reload verification script `finish_and_save_ptl0051.py` was executed.
- Verified opening `starter.pkt` from clean state: confirmed NEG-04 and NEG-05 faults are present.
- Verified opening `completed.pkt` from clean state: fast-forwarded time, confirmed POS-01 through POS-06 and NEG-01 through NEG-03 all pass without manual intervention.
- Reload Verification Result: **ALL PASS**.

