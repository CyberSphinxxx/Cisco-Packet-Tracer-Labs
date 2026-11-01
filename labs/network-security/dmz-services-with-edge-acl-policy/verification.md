# Verification Guide: PTL-0051 (DMZ Services with Edge Security Policy)

This guide documents the verification commands, expected outputs, and troubleshooting steps to validate the perimeter security policy on `R1-Edge`.

---

## 1. Positive Verification (Permitted Traffic Flows)

### Test POS-01: Outside Client Reaches DMZ Web Server
From `Ext-Client` Command Prompt, ping the DMZ Web Server IP address:
```cmd
ping 172.16.2.10
```
**Expected Output:**
```
Pinging 172.16.2.10 with 32 bytes of data:
Reply from 172.16.2.10: bytes=32 time<1ms TTL=127
Reply from 172.16.2.10: bytes=32 time<1ms TTL=127
Reply from 172.16.2.10: bytes=32 time<1ms TTL=127
Reply from 172.16.2.10: bytes=32 time<1ms TTL=127

Ping statistics for 172.16.2.10:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)
```

### Test POS-02: Corporate PC Reaches Internal Database Server
From `Corp-PC` Command Prompt, verify internal intranet reachability:
```cmd
ping 192.168.1.50
```
**Expected Output:**
```
Ping statistics for 192.168.1.50:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)
```

### Test POS-03: Corporate PC Reaches DMZ Web Server
From `Corp-PC` Command Prompt, verify internal access to the DMZ:
```cmd
ping 172.16.2.10
```
**Expected Output:**
```
Ping statistics for 172.16.2.10:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)
```

### Test POS-04: DMZ Web Server Reaches Local Default Gateway
From `DMZ-Web` Desktop Command Prompt, test local gateway reachability:
```cmd
ping 172.16.2.1
```
**Expected Output:**
```
Ping statistics for 172.16.2.1:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)
```

---

## 2. Negative Verification (Security Boundary Enforcement)

### Test NEG-01: Outside Client Blocked from Corporate PC
From `Ext-Client` Command Prompt, attempt to ping the private corporate PC:
```cmd
ping 192.168.1.10
```
**Expected Output:**
```
Pinging 192.168.1.10 with 32 bytes of data:
Request timed out.
Request timed out.
Request timed out.
Request timed out.

Ping statistics for 192.168.1.10:
    Packets: Sent = 4, Received = 0, Lost = 4 (100% loss)
```

### Test NEG-02: Outside Client Blocked from Database Server
From `Ext-Client` Command Prompt, attempt to ping the internal database server:
```cmd
ping 192.168.1.50
```
**Expected Output:**
```
Request timed out. (100% loss)
```

### Test NEG-03: DMZ Web Server Blocked from Corporate Workstation
From `DMZ-Web` Desktop Command Prompt, attempt to ping `Corp-PC`:
```cmd
ping 192.168.1.10
```
**Expected Output:**
```
Request timed out. (100% loss)
```

---

## 3. Cisco IOS CLI Audit & Troubleshooting

On `R1-Edge`, inspect the ACL rules and hit counters:
```cisco
R1-Edge# show ip access-lists
Extended IP access list OUTSIDE_TO_DMZ
    10 permit tcp any host 172.16.2.10 eq www
    20 permit tcp any host 172.16.2.10 eq 443
    30 permit icmp any host 172.16.2.10 echo (matches)
    40 deny ip any 192.168.1.0 0.0.0.255 (matches)
    50 deny ip any any (matches)
Extended IP access list DMZ_POLICY
    10 permit tcp host 172.16.2.10 host 192.168.1.50 eq 3306
    20 permit icmp 172.16.2.0 0.0.0.255 host 172.16.2.1 echo (matches)
    30 permit icmp host 172.16.2.10 192.168.1.0 0.0.0.255 echo-reply (matches)
    40 deny ip 172.16.2.0 0.0.0.255 192.168.1.0 0.0.0.255 (matches)
    50 permit ip host 172.16.2.10 any
    60 deny ip any any
```

Verify interface access-group bindings:
```cisco
R1-Edge# show ip interface GigabitEthernet0/1 | include access list
  Inbound  access list is OUTSIDE_TO_DMZ
  Outgoing access list is not set

R1-Edge# show ip interface GigabitEthernet0/2 | include access list
  Inbound  access list is DMZ_POLICY
  Outgoing access list is not set
```
