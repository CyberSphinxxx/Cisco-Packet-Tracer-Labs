# Verification Guide: PTL-0050 — Guest Network Segmentation

This verification guide provides systematic testing procedures for validating guest network isolation, least privilege service access, and extended ACL rule processing on Cisco IOS routers.

---

## 1. Positive Verification (Permitted Traffic Flows)

### Test POS-01: ACL Rule and Hit Counter Audit
- **Device:** `R1-Edge`
- **Command:** `show ip access-lists GUEST_FILTER`
- **Expected Output:**
  ```text
  Extended IP access list GUEST_FILTER
      10 permit udp 172.16.50.0 0.0.0.255 host 203.0.113.53 eq domain
      20 permit tcp 172.16.50.0 0.0.0.255 host 203.0.113.53 eq www
      30 permit tcp 172.16.50.0 0.0.0.255 host 203.0.113.53 eq 443
      40 permit icmp 172.16.50.0 0.0.0.255 host 172.16.50.1 echo
      50 deny ip 172.16.50.0 0.0.0.255 192.168.10.0 0.0.0.255
      60 deny ip any any
  ```
- **Evaluation:** Rules exist in exact sequence without shadowed entries.

### Test POS-02: Interface Inbound Application
- **Device:** `R1-Edge`
- **Command:** `show ip interface GigabitEthernet0/0/2`
- **Expected Output:**
  ```text
  GigabitEthernet0/0/2 is up, line protocol is up
    Internet address is 172.16.50.1/24
    Inbound access list is GUEST_FILTER
    Outgoing access list is not set
  ```
- **Evaluation:** Inbound access list is correctly set to `GUEST_FILTER`.

### Test POS-03: Guest Gateway Reachability
- **Device:** `Guest-Laptop`
- **Command:** `ping 172.16.50.1`
- **Expected Output:** 4/4 echo replies received (0% packet loss).
- **Evaluation:** Local gateway diagnostics permitted by rule 40.

### Test POS-04: Corporate Internal LAN Connectivity
- **Device:** `Corp-PC`
- **Command:** `ping 192.168.10.50`
- **Expected Output:** 4/4 echo replies received (0% packet loss).
- **Evaluation:** Corporate LAN remains completely unrestricted by the guest filter.

### Test POS-05: Corporate External Public Reachability
- **Device:** `Corp-PC`
- **Command:** `ping 203.0.113.53`
- **Expected Output:** 4/4 echo replies received (0% packet loss).
- **Evaluation:** Corporate users reach public DMZ services without inhibition.

---

## 2. Negative Verification (Blocked & Security Enforcement)

### Test NEG-01: Guest to Corporate Workstation Isolation
- **Device:** `Guest-Laptop`
- **Command:** `ping 192.168.10.10`
- **Expected Output:** `Destination host unreachable.` or `Request timed out.` (0/4 replies received, 100% loss).
- **Evaluation:** Traffic is intercepted and dropped by rule 50 before reaching the corporate LAN.

### Test NEG-02: Guest to Corporate Server Isolation
- **Device:** `Guest-Laptop`
- **Command:** `ping 192.168.10.50`
- **Expected Output:** `Destination host unreachable.` or `Request timed out.` (0/4 replies received, 100% loss).
- **Evaluation:** Traffic is intercepted and dropped by rule 50 before reaching the intranet server.

### Test NEG-03: Guest Direct Ping to Public Server Blocked
- **Device:** `Guest-Laptop`
- **Command:** `ping 203.0.113.53`
- **Expected Output:** `Destination host unreachable.` or `Request timed out.` (0/4 replies received, 100% loss).
- **Evaluation:** ICMP echo to public server is dropped by rule 60, enforcing least privilege (only UDP 53 and TCP 80/443 permitted).

