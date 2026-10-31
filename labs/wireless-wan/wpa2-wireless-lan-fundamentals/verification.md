# Verification Guide: PTL-0035 WPA2 Wireless LAN Fundamentals

This document provides complete positive and negative test verification evidence for **PTL-0035: WPA2 Wireless LAN Fundamentals**, executed and validated directly within Cisco Packet Tracer 9.0.1.

---

## 1. Positive Verification (POS)

### POS-01: Edge Router Interface and DHCP Pool
On `Edge-R1`, verify that GigabitEthernet0/0/0 is configured with `192.168.10.1/24` in `up/up` state, and the Cisco IOS DHCP pool `WLAN-POOL` is active with valid exclusion boundaries:

```cisco
Edge-R1# show ip interface brief
Interface              IP-Address      OK? Method Status                Protocol 
GigabitEthernet0/0/0   192.168.10.1    YES manual up                    up 
GigabitEthernet0/0/1   unassigned      YES unset  administratively down down

Edge-R1# show ip dhcp pool
Pool WLAN-POOL :
 Utilization mark (high/low)    : 100 / 0
 Subnet size (first/next)       : 0 / 0 
 Total addresses                : 254
 Leased addresses               : 2
 Excluded addresses             : 2
 Pending event                  : none

 1 subnet is currently in the pool
 Current index        IP address range                    Leased/Excluded/Total
 192.168.10.1         192.168.10.1     - 192.168.10.254    2    / 2     / 254
```
*Result:* Passed. Default router interface is up and actively leasing addresses in the `192.168.10.0/24` subnet.

---

### POS-02: Switch Port Status and Spanning-Tree Forwarding
On `Switch-S1`, verify that ports connecting to the router (`Fa0/1`), access point (`Fa0/2`), and wired server (`Fa0/3`) are connected and forwarding without STP blocking delays:

```cisco
Switch-S1# show interfaces status
Port      Name               Status       Vlan       Duplex  Speed Type
Fa0/1     Uplink to Edge-R1  connected    1          a-full  a-100 10/100BaseTX
Fa0/2     Access Point AP-1  connected    1          a-full  a-100 10/100BaseTX
Fa0/3     Wired Server FastE connected    1          a-full  a-100 10/100BaseTX
```
*Result:* Passed. All infrastructure edge interfaces are active in VLAN 1.

---

### POS-03: Access Point Security Configuration
On `AP-1`, verify that Port 1 (802.11 2.4 GHz radio) is configured for WPA2-Personal with AES encryption and the designated pre-shared key:

```text
Authentication Type: WPA2-PSK (Enum value 4)
Encryption Type:     AES (Enum value 4)
Pre-Shared Key:      CiscoLabKey2026!
Radio Status:        Port 1 Up / Channel 6 (2.437 GHz)
```
*Result:* Passed. Wireless AP actively advertises WPA2-PSK/AES security parameters.

---

### POS-04: Authorized Client Wireless Association and Dynamic IP
On `Laptop-1`, inspect the network adapter configuration via `ipconfig` to verify successful 802.11 association and DHCP lease acquisition from `Edge-R1`:

```cmd
C:\> ipconfig

Wireless0 Connection:
   Connection-specific DNS Suffix..: ciscolab.local
   Link-local IPv6 Address.........: FE80::260:3EFF:FECC:C265
   IPv4 Address....................: 192.168.10.11
   Subnet Mask.....................: 255.255.255.0
   Default Gateway.................: 192.168.10.1
```
*Result:* Passed. Authorized wireless station acquired IP `192.168.10.11`, default gateway `192.168.10.1`, and DNS domain suffix `ciscolab.local`.

---

### POS-05: Authorized Client Gateway Reachability
From `Laptop-1`, execute an ICMP ping to the default gateway router `Edge-R1` (`192.168.10.1`):

```cmd
C:\> ping 192.168.10.1

Pinging 192.168.10.1 with 32 bytes of data:

Reply from 192.168.10.1: bytes=32 time=10ms TTL=255
Reply from 192.168.10.1: bytes=32 time=13ms TTL=255
Reply from 192.168.10.1: bytes=32 time=10ms TTL=255
Reply from 192.168.10.1: bytes=32 time=7ms TTL=255

Ping statistics for 192.168.10.1:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
Approximate round trip times in milli-seconds:
    Minimum = 7ms, Maximum = 13ms, Average = 10ms
```
*Result:* Passed. 100% round-trip success rate across the wireless radio link and switched uplink.

---

### POS-06: End-to-End Wireless-to-Wired Server Reachability
From `Laptop-1`, execute an ICMP ping to the corporate intranet server `Wired-Server` (`192.168.10.100`):

```cmd
C:\> ping 192.168.10.100

Pinging 192.168.10.100 with 32 bytes of data:

Reply from 192.168.10.100: bytes=32 time=11ms TTL=128
Reply from 192.168.10.100: bytes=32 time=10ms TTL=128
Reply from 192.168.10.100: bytes=32 time=7ms TTL=128
Reply from 192.168.10.100: bytes=32 time=12ms TTL=128

Ping statistics for 192.168.10.100:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
Approximate round trip times in milli-seconds:
    Minimum = 7ms, Maximum = 12ms, Average = 10ms
```
*Result:* Passed. Seamless Layer 2 bridging across the autonomous AP radio cell, switch port Fa0/2, and destination port Fa0/3.

---

### POS-07: Wired Infrastructure Verification
From `Wired-Server`, ping the default router `Edge-R1` (`192.168.10.1`):

```cmd
C:\> ping 192.168.10.1

Pinging 192.168.10.1 with 32 bytes of data:

Reply from 192.168.10.1: bytes=32 time<1ms TTL=255
Reply from 192.168.10.1: bytes=32 time<1ms TTL=255
Reply from 192.168.10.1: bytes=32 time<1ms TTL=255
Reply from 192.168.10.1: bytes=32 time=4ms TTL=255

Ping statistics for 192.168.10.1:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)
```
*Result:* Passed. Switched backplane and router uplink are fully operational.

---

## 2. Negative Verification (NEG)

### NEG-01: Unauthorized Station Authentication Failure
`Laptop-2` is configured with an invalid WPA2-PSK key (`InvalidPass999!`). Verify that the 802.11 4-way cryptographic handshake fails and the station cannot complete association:

```cmd
C:\> ipconfig

Wireless0 Connection:
   Autoconfiguration IPv4 Address..: 169.254.4.160
   Subnet Mask.....................: 255.255.0.0
   Default Gateway.................: 0.0.0.0
```
*Simulator State:* `curAp: undefined`. The station fails key derivation and is denied entry to the wireless cell.

Attempting to ping the wired server from `Laptop-2`:
```cmd
C:\> ping 192.168.10.100

Pinging 192.168.10.100 with 32 bytes of data:

Request timed out.
Request timed out.
Request timed out.
Request timed out.

Ping statistics for 192.168.10.100:
    Packets: Sent = 4, Received = 0, Lost = 4 (100% loss)
```
*Result:* Passed. Unauthorized station cannot transmit unicast data to the corporate server.

---

### NEG-02: Unauthorized Station Gateway Access Blocked
From `Laptop-2`, ping the default gateway `Edge-R1` (`192.168.10.1`):

```cmd
C:\> ping 192.168.10.1

Pinging 192.168.10.1 with 32 bytes of data:

Request timed out.
Request timed out.
Request timed out.
Request timed out.

Ping statistics for 192.168.10.1:
    Packets: Sent = 4, Received = 0, Lost = 4 (100% loss)
```
*Result:* Passed. Total packet loss verifies strict enforcement of WPA2-Personal security controls.

---

## 3. Reload Verification
Both `.pkt` binaries were independently verified by reloading from disk in Cisco Packet Tracer:

1. **`starter.pkt` Reload Test:**
   - File reopened cleanly (`result: 0`).
   - Wired server ping to default router `192.168.10.1` succeeded with 100% (4/4 packets, 0% loss).
   - Autonomous AP and client laptops initialized in unassociated baseline state.

2. **`completed.pkt` Reload Test:**
   - File reopened cleanly (`result: 0`).
   - `Laptop-1` preserved WPA2-PSK configuration and automatically established 802.11 link (`Antenna`).
   - Router configurations and DHCP service bindings persisted correctly across reboot.

