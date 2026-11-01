# Verification Guide: PTL-0053 (Secure Management Network Design)

This verification guide provides systematic testing procedures for validating dedicated management VLAN segmentation, cryptographic SSHv2 access, VTY access-class filtering, and data-plane isolation on Cisco IOS infrastructure devices.

---

## 1. Positive Verification (Completed State)

### Test POS-01: Admin-PC Management Subnet Reachability
From `Admin-PC` Command Prompt, verify ICMP reachability to all infrastructure management interfaces on VLAN 99:
```cmd
ping 192.168.99.1
ping 192.168.99.2
ping 192.168.99.3
```
**Expected Output:**
```
Ping statistics for 192.168.99.1:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)

Ping statistics for 192.168.99.2:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)

Ping statistics for 192.168.99.3:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)
```

### Test POS-02: Cryptographic SSH Access to R1-Edge
From `Admin-PC` Command Prompt, establish an SSH session to `R1-Edge`:
```cmd
ssh -l admin 192.168.99.1
```
Enter password `Cisco12345!` when prompted.
**Expected Output:**
```
R1-Edge#
```
*Criteria:* SSH session opens and presents router command prompt.

### Test POS-03: Cryptographic SSH Access to SW-Core
From `Admin-PC` Command Prompt, establish an SSH session to `SW-Core`:
```cmd
ssh -l admin 192.168.99.2
```
Enter password `Cisco12345!` when prompted.
**Expected Output:**
```
SW-Core#
```
*Criteria:* SSH session opens and presents core switch command prompt.

### Test POS-04: Cryptographic SSH Access to SW-Access
From `Admin-PC` Command Prompt, establish an SSH session to `SW-Access`:
```cmd
ssh -l admin 192.168.99.3
```
Enter password `Cisco12345!` when prompted.
**Expected Output:**
```
SW-Access#
```
*Criteria:* SSH session opens and presents access switch command prompt.

### Test POS-05: User-PC Local Gateway Reachability
From `User-PC` Command Prompt, verify that normal data plane forwarding operates correctly:
```cmd
ping 192.168.10.1
```
**Expected Output:**
```
Ping statistics for 192.168.10.1:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)
```

---

## 2. Negative Verification (Security Boundary Enforcement)

### Test NEG-01: User-PC Blocked from Management Subnet
From `User-PC` Command Prompt, attempt to ping management interfaces:
```cmd
ping 192.168.99.1
ping 192.168.99.2
ping 192.168.99.3
```
**Expected Output:**
```
Pinging 192.168.99.1 with 32 bytes of data:
Request timed out.
Request timed out.
Request timed out.
Request timed out.

Ping statistics for 192.168.99.1:
    Packets: Sent = 4, Received = 0, Lost = 4 (100% loss)
```
*Criteria:* All packets dropped by `USER_FILTER` on `R1-Edge` subinterface `GigabitEthernet0/0.10`.

### Test NEG-02: Telnet Plaintext Connection Rejected
From `Admin-PC` Command Prompt, attempt to connect to any device via unencrypted Telnet:
```cmd
telnet 192.168.99.1
telnet 192.168.99.2
telnet 192.168.99.3
```
**Expected Output:**
```
Connecting To 192.168.99.1...Could not open connection to the host, on port 23: Connect failed
```
*Criteria:* Connection refused immediately because `transport input ssh` disables port 23.

---

## 3. Cisco IOS CLI Audit & Troubleshooting

On `R1-Edge`, verify VTY configuration and active SSH sessions:
```cisco
R1-Edge# show ip ssh
SSH Enabled - version 2.0
Authentication timeout: 120 secs; Authentication retries: 3

R1-Edge# show running-config | section line vty
line vty 0 4
 access-class 99 in
 login local
 transport input ssh
```

Verify subinterface ACL bindings on `R1-Edge`:
```cisco
R1-Edge# show ip interface GigabitEthernet0/0.10 | include access list
  Inbound  access list is USER_FILTER
  Outgoing access list is not set
```

On `SW-Core` and `SW-Access`, verify Management SVI and default gateway:
```cisco
SW-Core# show ip interface brief | include Vlan
Vlan99                 192.168.99.2    YES manual up                    up

SW-Core# show ip default-gateway
192.168.99.1
```

