# Verification Guide: PTL-0052 (DHCP Helper-Address Multi-Subnet Troubleshooting)

This verification guide provides systematic testing procedures for validating DHCP relay agent operations, subinterface IP helper addresses, central DHCP server scope allocation, and end-to-end client connectivity across multiple 802.1Q VLANs.

---

## 1. Positive Verification (Completed State)

### Test POS-01: PC-VLAN10 Dynamic Lease Acquisition
From `PC-VLAN10` Desktop Command Prompt, run `ipconfig /all`:
```cmd
ipconfig /all
```
**Expected Output:**
```
FastEthernet0 Connection:(default port)

   Connection-specific DNS Suffix..: enterprise.local
   Physical Address................: 0001.42A3.B810
   Link-local IPv6 Address.........: FE80::...
   IPv4 Address....................: 192.168.10.11
   Subnet Mask.....................: 255.255.255.0
   Default Gateway.................: 192.168.10.1
   DHCP Server.....................: 10.0.0.1
   DNS Servers.....................: 10.0.0.1
```
*Criteria:* Dynamic IP assigned in `192.168.10.0/24`, default gateway set to `192.168.10.1`, DNS set to `10.0.0.1`.

### Test POS-02: PC-VLAN20 Dynamic Lease Acquisition
From `PC-VLAN20` Desktop Command Prompt, run `ipconfig /all`:
```cmd
ipconfig /all
```
**Expected Output:**
```
FastEthernet0 Connection:(default port)

   Connection-specific DNS Suffix..: enterprise.local
   Physical Address................: 00D0.FF41.562A
   Link-local IPv6 Address.........: FE80::...
   IPv4 Address....................: 192.168.20.11
   Subnet Mask.....................: 255.255.255.0
   Default Gateway.................: 192.168.20.1
   DHCP Server.....................: 10.0.0.1
   DNS Servers.....................: 10.0.0.1
```
*Criteria:* Dynamic IP assigned in `192.168.20.0/24`, default gateway set to `192.168.20.1`, DNS set to `10.0.0.1`.

### Test POS-03: Central DHCP Server Binding Table
On `R1-HQ`, verify the active DHCP bindings:
```cisco
R1-HQ# show ip dhcp binding
Bindings from all pools :
IP address          Client-ID/              Lease expiration        Type
                    Hardware address/
                    User name
192.168.10.11       0001.42A3.B810          --                      Automatic
192.168.20.11       00D0.FF41.562A          --                      Automatic
```
*Criteria:* Active lease entries present for both `192.168.10.0/24` and `192.168.20.0/24` pools.

### Test POS-04: PC-VLAN10 Subinterface Gateway Reachability
From `PC-VLAN10` Command Prompt, ping the local subinterface gateway:
```cmd
ping 192.168.10.1
```
**Expected Output:**
```
Ping statistics for 192.168.10.1:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)
```

### Test POS-05: PC-VLAN20 Subinterface Gateway Reachability
From `PC-VLAN20` Command Prompt, ping the local subinterface gateway:
```cmd
ping 192.168.20.1
```
**Expected Output:**
```
Ping statistics for 192.168.20.1:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)
```

### Test POS-06: Inter-VLAN Routing Reachability
From `PC-VLAN10` Command Prompt, ping `PC-VLAN20`:
```cmd
ping 192.168.20.11
```
**Expected Output:**
```
Pinging 192.168.20.11 with 32 bytes of data:
Reply from 192.168.20.11: bytes=32 time<1ms TTL=127
Reply from 192.168.20.11: bytes=32 time<1ms TTL=127
Reply from 192.168.20.11: bytes=32 time<1ms TTL=127
Reply from 192.168.20.11: bytes=32 time<1ms TTL=127

Ping statistics for 192.168.20.11:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)
```

### Test POS-07: Central WAN Router Reachability
From `PC-VLAN10` Command Prompt, ping `R1-HQ` WAN interface `10.0.0.1`:
```cmd
ping 10.0.0.1
```
**Expected Output:**
```
Ping statistics for 10.0.0.1:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)
```

---

## 2. Negative Verification (Starter Fault Diagnosis)

### Test NEG-01: Faulty Relay Helper Address on VLAN 10 Subinterface
In the starter state, check `R2-Branch` subinterface configuration:
```cisco
R2-Branch# show running-config interface GigabitEthernet0/1.10
!
interface GigabitEthernet0/1.10
 encapsulation dot1Q 10
 ip address 192.168.10.1 255.255.255.0
 ip helper-address 10.0.0.5
end
```
When `PC-VLAN10` broadcasts DHCP Discover packets, `R2-Branch` relays them to `10.0.0.5`, an unreachable IP address.
From `PC-VLAN10`:
```cmd
C:\> ipconfig /renew
DHCP request failed.
```
*Criteria:* `PC-VLAN10` fails to obtain an IP lease and reverts to `0.0.0.0` or `169.254.x.x`.

### Test NEG-02: DHCP Pool Subnet Mismatch on Central Server
In the starter state, check `R1-HQ` DHCP pool configuration:
```cisco
R1-HQ# show ip dhcp pool POOL_VLAN20
Pool POOL_VLAN20 :
 Utilization mark (high/low)    : 100 / 0
 Subnet size (lines)            : 1
 Total addresses                : 254
 Leased addresses               : 0
 Excluded addresses             : 1
 Pending event                  : none
 192.168.200.0 /24
```
When `R2-Branch` receives a broadcast on `GigabitEthernet0/1.20`, it properly forwards the request to `10.0.0.1` with `giaddr = 192.168.20.1`. However, `R1-HQ` has no pool configured for the `192.168.20.0/24` subnet. It silently discards the relay packet.
From `PC-VLAN20`:
```cmd
C:\> ipconfig /renew
DHCP request failed.
```
*Criteria:* `PC-VLAN20` fails to obtain an IP lease until `POOL_VLAN20` is corrected with `network 192.168.20.0 255.255.255.0`.

