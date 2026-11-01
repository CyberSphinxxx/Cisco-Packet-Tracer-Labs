# Verification Guide: PTL-0036 Wireless VLAN Separation and Guest Access

This document provides complete positive and negative test verification evidence for **PTL-0036: Wireless VLAN Separation and Guest Access**, executed and validated directly within Cisco Packet Tracer 9.0.1.

---

## 1. Positive Verification (POS)

### POS-01: Multilayer Switch SVIs and DHCP Pools
On `Core-SW`, verify that Switched Virtual Interfaces (`Vlan10`, `Vlan20`) and the routed DMZ port (`GigabitEthernet0/1`) are in `up/up` status, and that Cisco IOS DHCP pools `CORP-POOL` and `GUEST-POOL` are actively allocating IP parameters:

```cisco
Core-SW# show ip interface brief | exclude Fast
Interface              IP-Address      OK? Method Status                Protocol 
GigabitEthernet0/1     192.168.30.1    YES manual up                    up 
GigabitEthernet0/2     unassigned      YES unset  administratively down down 
Vlan1                  unassigned      YES unset  administratively down down 
Vlan10                 192.168.10.1    YES manual up                    up 
Vlan20                 192.168.20.1    YES manual up                    up

Core-SW# show ip dhcp pool
Pool CORP-POOL :
 Utilization mark (high/low)    : 100 / 0
 Subnet size (first/next)       : 0 / 0 
 Total addresses                : 254
 Leased addresses               : 1
 Excluded addresses             : 3
 Pending event                  : none

 1 subnet is currently in the pool
 Current index        IP address range                    Leased/Excluded/Total
 192.168.10.1         192.168.10.1     - 192.168.10.254    1    / 3     / 254

Pool GUEST-POOL :
 Utilization mark (high/low)    : 100 / 0
 Subnet size (first/next)       : 0 / 0 
 Total addresses                : 254
 Leased addresses               : 1
 Excluded addresses             : 3
 Pending event                  : none

 1 subnet is currently in the pool
 Current index        IP address range                    Leased/Excluded/Total
 192.168.20.1         192.168.20.1     - 192.168.20.254    1    / 3     / 254
```
*Result:* Passed. Default gateways are up and both corporate and guest DHCP pools are functioning properly.

---

### POS-02: VLAN Database and Port Allocations
On `Core-SW`, inspect the VLAN membership table to verify that corporate assets reside in VLAN 10 and the guest access point resides in VLAN 20:

```cisco
Core-SW# show vlan brief

VLAN Name                             Status    Ports
---- -------------------------------- --------- -------------------------------
1    default                          active    Fa0/4, Fa0/5, Fa0/6, Fa0/7
                                                Fa0/8, Fa0/9, Fa0/10, Fa0/11
                                                Fa0/12, Fa0/13, Fa0/14, Fa0/15
                                                Fa0/16, Fa0/17, Fa0/18, Fa0/19
                                                Fa0/20, Fa0/21, Fa0/22, Fa0/23
                                                Fa0/24, Gig0/2
10   Corporate-VLAN                   active    Fa0/2, Fa0/3
20   Guest-VLAN                       active    Fa0/1
1002 fddi-default                     active    
1003 token-ring-default               active    
1004 fddinet-default                  active    
1005 trnet-default                    active    
```
*Result:* Passed. Port Fa0/1 is properly mapped to Guest-VLAN 20, while Fa0/2 (`Staff-PC`) and Fa0/3 (`Corp-Server`) are segregated into Corporate-VLAN 10.

---

### POS-03: Autonomous AP WPA2-PSK AES Security Parameters
On `AP-Guest`, verify that the 802.11 wireless radio is secured using WPA2-Personal with AES encryption and the designated pre-shared key:

```text
Authentication Type: WPA2-PSK (Enum value 4)
Encryption Type:     AES (Enum value 4)
Pre-Shared Key:      GuestWifiPass2026!
SSID Broadcast:      Enabled
Port 1 Radio Status: Up
```
*Result:* Passed. Access point enforces WPA2-PSK/AES cryptographic authentication for all associating guest stations.

---

### POS-04: Corporate Staff Workstation DHCP Lease
On `Staff-PC`, execute `ipconfig` to verify lease acquisition from `CORP-POOL`:

```cmd
C:\> ipconfig

FastEthernet0 Connection:
   Connection-specific DNS Suffix..: corpwifi.local
   Link-local IPv6 Address.........: FE80::210:11FF:FE91:7E84
   IPv6 Address....................: ::
   IPv4 Address....................: 192.168.10.11
   Subnet Mask.....................: 255.255.255.0
   Default Gateway.................: 192.168.10.1
```
*Result:* Passed. Corporate host received valid IPv4 address `192.168.10.11` with default gateway `192.168.10.1`.

---

### POS-05: Corporate Staff to Internal Corporate Server Reachability
From `Staff-PC`, ping the internal corporate intranet server `Corp-Server` (`192.168.10.100`):

```cmd
C:\> ping 192.168.10.100

Pinging 192.168.10.100 with 32 bytes of data:

Reply from 192.168.10.100: bytes=32 time<1ms TTL=128
Reply from 192.168.10.100: bytes=32 time<1ms TTL=128
Reply from 192.168.10.100: bytes=32 time<1ms TTL=128
Reply from 192.168.10.100: bytes=32 time<1ms TTL=128

Ping statistics for 192.168.10.100:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
Approximate round trip times in milli-seconds:
    Minimum = 0ms, Maximum = 0ms, Average = 0ms
```
*Result:* Passed. High-speed Layer 2 intra-VLAN switching verified between corporate staff and intranet server.

---

### POS-06: Corporate Staff to DMZ Web Server Reachability
From `Staff-PC`, ping the DMZ external web server `Web-Server` (`192.168.30.100`):

```cmd
C:\> ping 192.168.30.100

Pinging 192.168.30.100 with 32 bytes of data:

Reply from 192.168.30.100: bytes=32 time<1ms TTL=127
Reply from 192.168.30.100: bytes=32 time<1ms TTL=127
Reply from 192.168.30.100: bytes=32 time<1ms TTL=127
Reply from 192.168.30.100: bytes=32 time<1ms TTL=127

Ping statistics for 192.168.30.100:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
Approximate round trip times in milli-seconds:
    Minimum = 0ms, Maximum = 0ms, Average = 0ms
```
*Result:* Passed. Corporate staff successfully routes packets across `Core-SW` SVI Vlan10 to routed interface GigabitEthernet0/1 (TTL=127).

---

### POS-07: Guest Laptop Wireless Association and Dynamic IP
On `Guest-Laptop`, inspect wireless interface properties to verify association with `AP-Guest` and dynamic IP lease from `GUEST-POOL`:

```cmd
C:\> ipconfig

Wireless0 Connection:
   Connection-specific DNS Suffix..: guestwifi.local
   Link-local IPv6 Address.........: FE80::204:9AFF:FED9:DA88
   IPv6 Address....................: ::
   IPv4 Address....................: 192.168.20.11
   Subnet Mask.....................: 255.255.255.0
   Default Gateway.................: 192.168.20.1
```
*Result:* Passed. Wireless station associated over 802.11 and leased `192.168.20.11` in Guest-VLAN 20.

---

### POS-08: Guest Laptop to DMZ Public Web Server Reachability
From `Guest-Laptop`, ping `Web-Server` (`192.168.30.100`):

```cmd
C:\> ping 192.168.30.100

Pinging 192.168.30.100 with 32 bytes of data:

Reply from 192.168.30.100: bytes=32 time=13ms TTL=127
Reply from 192.168.30.100: bytes=32 time=13ms TTL=127
Reply from 192.168.30.100: bytes=32 time=11ms TTL=127
Reply from 192.168.30.100: bytes=32 time=9ms TTL=127

Ping statistics for 192.168.30.100:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
Approximate round trip times in milli-seconds:
    Minimum = 9ms, Maximum = 13ms, Average = 11ms
```
*Result:* Passed. Guest station successfully reaches public/DMZ services permitted by the Extended ACL.

---

## 2. Negative Verification (NEG)

### NEG-01: Guest Laptop to Corporate Server Access Denied
From `Guest-Laptop`, attempt an ICMP echo request to `Corp-Server` (`192.168.10.100`):

```cmd
C:\> ping 192.168.10.100

Pinging 192.168.10.100 with 32 bytes of data:

Reply from 192.168.20.1: Destination host unreachable.
Reply from 192.168.20.1: Destination host unreachable.
Reply from 192.168.20.1: Destination host unreachable.
Reply from 192.168.20.1: Destination host unreachable.

Ping statistics for 192.168.10.100:
    Packets: Sent = 4, Received = 0, Lost = 4 (100% loss),
```
*Result:* Passed (Blocked). Extended ACL `GUEST-RESTRICTION` intercepting inbound packets on `interface Vlan20` actively drops packets targeting Corporate VLAN 10 and generates ICMP Type 3 Code 1 (Host Unreachable) replies.

---

### NEG-02: Guest Laptop to Corporate Staff Workstation Access Denied
From `Guest-Laptop`, attempt to ping `Staff-PC` (`192.168.10.11`):

```cmd
C:\> ping 192.168.10.11

Pinging 192.168.10.11 with 32 bytes of data:

Reply from 192.168.20.1: Destination host unreachable.
Reply from 192.168.20.1: Destination host unreachable.
Reply from 192.168.20.1: Destination host unreachable.
Reply from 192.168.20.1: Destination host unreachable.

Ping statistics for 192.168.10.11:
    Packets: Sent = 4, Received = 0, Lost = 4 (100% loss),
```
*Result:* Passed (Blocked). Guest wireless users cannot penetrate peer user devices on the corporate internal network.
