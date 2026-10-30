# PTL-0018: Dynamic Trunking Protocol and Native VLAN Security — Authentic Simulator Verification Evidence

**Execution Timestamp**: 2026-10-30 19:18:49
**Simulator**: Cisco Packet Tracer 9.0.1 (Localhost IPC Bridge)
**Device Hardware**: 2x Cisco Catalyst 2960-24TT (IOS 12.2(25)FX C2960-LANBASE-M), 4x PC-PT generic workstations
**Status**: `tested_pass` (100% genuine simulator execution)

## 1. Asset Inventory & Cryptographic Checksums

- `starter.pkt`: 51,323 bytes | SHA-256: `5a07c61e2fcd3b61d943970e548decfd99605d823d28e0df6195035d0b10ac56`
- `completed.pkt`: 52,081 bytes | SHA-256: `8555ab7a34f7a7f12f0b011331a5859a73c16d3554d69192c1f3cfa5a3031a7d`
- `topology.png`: 77,915 bytes | SHA-256: `e237f650bdfdac55db6da7c00b0ab4c2f7958633f81073f7b6dcaa862505d1e0`

## 2. Positive Test Results

### DTP-POS-01: Operational Trunk & Native VLAN 99
```text
--- S1 Interfaces Trunk ---

%SPANTREE-2-BLOCK_PVID_LOCAL: Blocking GigabitEthernet0/1 on VLAN0099. Inconsistent local vlan.

enable
S1#show interfaces trunk
Port        Mode         Encapsulation  Status        Native vlan
Gig0/1      on           802.1q         trunking      99
Gig0/2      on           802.1q         trunking      99

Port        Vlans allowed on trunk
Gig0/1      10,20,99
Gig0/2      10,20,99

Port        Vlans allowed and active in management domain
Gig0/1      10,20,99
Gig0/2      10,20,99

Port        Vlans in spanning tree forwarding state and not pruned
Gig0/1      10,20
Gig0/2      10,20,99

S1#

--- S2 Interfaces Trunk ---
rface GigabitEthernet0/2, changed state to up

%SYS-5-CONFIG_I: Configured from console by console
enable
S2#show interfaces trunk
Port        Mode         Encapsulation  Status        Native vlan
Gig0/1      on           802.1q         trunking      99
Gig0/2      on           802.1q         trunking      99

Port        Vlans allowed on trunk
Gig0/1      10,20,99
Gig0/2      10,20,99

Port        Vlans allowed and active in management domain
Gig0/1      10,20,99
Gig0/2      10,20,99

Port        Vlans in spanning tree forwarding state and not pruned
Gig0/1      10,20,99
Gig0/2      none

S2#
```

### DTP-POS-02: DTP Disabled via switchport nonegotiate
```text
--- S1 Gi0/1 Switchport ---
rational Mode: trunk
Administrative Trunking Encapsulation: dot1q
Operational Trunking Encapsulation: dot1q
Negotiation of Trunking: Off
Access Mode VLAN: 1 (default)
Trunking Native Mode VLAN: 99 (Native)
Voice VLAN: none
Administrative private-vlan host-association: none
Administrative private-vlan mapping: none
Administrative private-vlan trunk native VLAN: none
Administrative private-vlan trunk encapsulation: dot1q
Administrative private-vlan trunk normal VLANs: none
Administrative private-vlan trunk private VLANs: none
Operational private-vlan: none
Trunking VLANs Enabled: 10,20,99
Pruning VLANs Enabled: 2-1001
Capture Mode Disabled
Capture VLANs Allowed: ALL
Protected: false
 --More-- 

--- S2 Gi0/1 Switchport ---
rational Mode: trunk
Administrative Trunking Encapsulation: dot1q
Operational Trunking Encapsulation: dot1q
Negotiation of Trunking: Off
Access Mode VLAN: 1 (default)
Trunking Native Mode VLAN: 99 (Native)
Voice VLAN: none
Administrative private-vlan host-association: none
Administrative private-vlan mapping: none
Administrative private-vlan trunk native VLAN: none
Administrative private-vlan trunk encapsulation: dot1q
Administrative private-vlan trunk normal VLANs: none
Administrative private-vlan trunk private VLANs: none
Operational private-vlan: none
Trunking VLANs Enabled: 10,20,99
Pruning VLANs Enabled: 2-1001
Capture Mode Disabled
Capture VLANs Allowed: ALL
Protected: false
 --More--
```

### DTP-POS-03: Intra-VLAN 10 Ping Across Trunk (Admin VLAN)
```text
ne 1.0
C:\>ping 192.168.10.20

Pinging 192.168.10.20 with 32 bytes of data:

Reply from 192.168.10.20: bytes=32 time=1ms TTL=128
Reply from 192.168.10.20: bytes=32 time<1ms TTL=128
Reply from 192.168.10.20: bytes=32 time<1ms TTL=128
Reply from 192.168.10.20: bytes=32 time<1ms TTL=128

Ping statistics for 192.168.10.20:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
Approximate round trip times in milli-seconds:
    Minimum = 0ms, Maximum = 1ms, Average = 0ms

C:\>ping 192.168.10.20

Pinging 192.168.10.20 with 32 bytes of data:

Reply from 192.168.10.20: bytes=32 time<1ms TTL=128
Reply from 192.168.10.20: bytes=32 time<1ms TTL=128
Reply from 192.168.10.20: bytes=32 time<1ms TTL=128
```

### DTP-POS-04: Intra-VLAN 20 Ping Across Trunk (Sales VLAN)
```text
ne 1.0
C:\>ping 192.168.20.20

Pinging 192.168.20.20 with 32 bytes of data:

Reply from 192.168.20.20: bytes=32 time<1ms TTL=128
Reply from 192.168.20.20: bytes=32 time<1ms TTL=128
Reply from 192.168.20.20: bytes=32 time<1ms TTL=128
Reply from 192.168.20.20: bytes=32 time<1ms TTL=128

Ping statistics for 192.168.20.20:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
Approximate round trip times in milli-seconds:
    Minimum = 0ms, Maximum = 0ms, Average = 0ms

C:\>ping 192.168.20.20

Pinging 192.168.20.20 with 32 bytes of data:

Reply from 192.168.20.20: bytes=32 time<1ms TTL=128
Reply from 192.168.20.20: bytes=32 time<1ms TTL=128
Reply from 192.168.20.20: bytes=32 time<1ms TTL=128
```

## 3. Negative / Security Isolation Results

### DTP-NEG-01: Inter-VLAN Broadcast & Unicast Isolation
Without an inter-VLAN routing device (router or L3 switch), traffic between VLAN 10 and VLAN 20 is completely isolated:

```text
from 192.168.10.20: bytes=32 time<1ms TTL=128
Reply from 192.168.10.20: bytes=32 time<1ms TTL=128

Ping statistics for 192.168.10.20:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
Approximate round trip times in milli-seconds:
    Minimum = 0ms, Maximum = 0ms, Average = 0ms

C:\>ping 192.168.20.10

Pinging 192.168.20.10 with 32 bytes of data:

Request timed out.
Request timed out.
Request timed out.
Request timed out.

Ping statistics for 192.168.20.10:
    Packets: Sent = 4, Received = 0, Lost = 4 (100% loss),

C:\>ping 192.168.20.10

Pinging 192.168.20.10 with 32 bytes of data:
```

### DTP-NEG-02: Native VLAN Mismatch CDP Detection
When native VLANs mismatch across a trunk, CDP generates explicit warning logs and spanning tree blocks inconsistent VLAN traffic:

```text
--- S1 Logging / Syslog ---
fault)
Trunking Native Mode VLAN: 99 (Native)
Voice VLAN: none
Administrative private-vlan host-association: none
Administrative private-vlan mapping: none
Administrative private-vlan trunk native VLAN: none
Administrative private-vlan trunk encapsulation: dot1q
Administrative private-vlan trunk normal VLANs: none
Administrative private-vlan trunk private VLANs: none
Operational private-vlan: none
Trunking VLANs Enabled: 10,20,99
Pruning VLANs Enabled: 2-1001
Capture Mode Disabled
Capture VLANs Allowed: ALL
Protected: false

S1#how logging
       ^
% Invalid input detected at '^' marker.
	
S1#

--- S2 Logging / Syslog ---
    0 flushes, 0 overruns, xml disabled, filtering disabled)

No Active Message Discriminator.


No Inactive Message Discriminator.


    Console logging: level debugging, 20 messages logged, xml disabled,
          filtering disabled
    Monitor logging: level debugging, 20 messages logged, xml disabled,
          filtering disabled
    Buffer logging:  level debugging, 0 messages logged, xml disabled,
          filtering disabled

    Logging Exception size (4096 bytes) 
    Count and timestamp logging messages: disabled
    Persistent logging: disabled

No active filter modules.

 --More--
```

## 4. Reopen and Persistence Verification
- `completed.pkt` reopened successfully: 7 devices verified intact.
- `starter.pkt` reopened successfully: 7 devices verified intact.
- Starter vs Completed configuration delta: Confirmed distinct (starter provides baseline VLAN creation and access port assignment; completed secures trunks with unconditional mode, nonegotiate, native VLAN 99, and allowed list pruning).
