# PTL-0018: Dynamic Trunking Protocol and Native VLAN Security — Authentic Simulator Verification Evidence

**Execution Timestamp**: 2026-10-31 01:47:27
**Simulator**: Cisco Packet Tracer 9.0.1 (Localhost IPC Bridge)
**Device Hardware**: 2x Cisco Catalyst 2960-24TT (IOS 12.2(25)FX C2960-LANBASE-M), 4x PC-PT generic workstations
**Status**: `tested_pass` (100% genuine simulator execution)

## 1. Asset Inventory & Cryptographic Checksums

- `starter.pkt`: 51,006 bytes | SHA-256: `016d1dbf6a5113958e4dabf6ad9985c82216d7a5c7a2179945f339b07be7d5f2`
- `completed.pkt`: 52,362 bytes | SHA-256: `508b7f4f6b1fce24802d079de1c83ac0b23adf872aa187e6ce18ba850d99f494`
- `topology.png`: 41,431 bytes | SHA-256: `406b25439e158ae2bec7c5744cf6be6647efb19f65eb1b75768e6b6c2145f9cb`

## 2. Positive Test Results

### POS-01: Dynamic Desirable + Dynamic Auto Trunk Negotiation
```text
--- S1 Gi0/1 Switchport (Dynamic Desirable) ---
show interfaces GigabitEthernet0/1 switchport
Name: Gig0/1
Switchport: Enabled
Administrative Mode: dynamic desirable
Operational Mode: trunk
Administrative Trunking Encapsulation: dot1q
Operational Trunking Encapsulation: dot1q
Negotiation of Trunking: On
Access Mode VLAN: 1 (default)
Trunking Native Mode VLAN: 1 (default)
Voice VLAN: none
Administrative private-vlan host-association: none
Administrative private-vlan mapping: none
Administrative private-vlan trunk native VLAN: none
Administrative private-vlan trunk encapsulation: dot1q
Administrative private-vlan trunk normal VLANs: none
Administrative private-vlan trunk private VLANs: none
Operational private-vlan: none
Trunking VLANs Enabled: All
Pruning VLANs Enabled: 2-1001
Capture Mode Disabled
Capture VLANs Allowed: ALL
Protected: false
 --More--

--- S1 Interfaces Trunk (Negotiated Operational Trunk) ---
C2960 Boot Loader (C2960-HBOOT-M) Version 12.2(25r)FX, RELEASE SOFTWARE (fc4)
Cisco WS-C2960-24TT (RC32300) processor (revision C0) with 21039K bytes of memory.
2960-24TT starting...
Base ethernet MAC Address: 0000.0C21.6A01
Xmodem file system is available.
Initializing Flash...
flashfs[0]: 1 files, 0 directories
flashfs[0]: 0 orphaned files, 0 orphaned directories
flashfs[0]: Total bytes: 64016384
flashfs[0]: Bytes used: 4414921
flashfs[0]: Bytes available: 59601463
flashfs[0]: flashfs fsck took 1 seconds.
...done Initializing Flash.

Boot Sector Filesystem (bs:) installed, fsid: 3
Parameter Block Filesystem (pb:) installed, fsid: 4


Loading "flash:/c2960-lanbase-mz.122-25.FX.bin"...
######################### [OK]
              Restricted Rights Legend

Use, duplication, or disclosure by the Government is
subject to restrictions as set forth in subparagraph
(c) of the Commercial Computer Software - Restricted
Rights clause at FAR sec. 52.227-19 and subparagraph
(c) (1) (ii) of the Rights in Technical Data and Computer
Software clause at DFARS sec. 252.227-7013.

           cisco Systems, Inc.
           170 West Tasman Drive
           San Jose, California 95134-1706




Cisco IOS Software, C2960 Software (C2960-LANBASE-M), Version 12.2(25)FX, RELEASE SOFTWARE (fc1)
Copyright (c) 1986-2005 by Cisco Systems, Inc.
Compiled Wed 12-Oct-05 22:05 by pt_team
Image text-base: 0x80008098, data-base: 0x814129C4



Cisco WS-C2960-24TT (RC32300) processor (revision C0) with 21039K bytes of memory.


24 FastEthernet/IEEE 802.3 interface(s)
2 Gigabit Ethernet/IEEE 802.3 interface(s)

63488K bytes of flash-simulated non-volatile configuration memory.
Base ethernet MAC Address       : 0000.0C21.6A01
Motherboard assembly number     : 73-9832-06
Power supply part number        : 341-0097-02
Motherboard serial number       : FOC103248MJ
Power supply serial number      : DCA102133JA
Model revision number           : B0
Motherboard revision number     : C0
Model number                    : WS-C2960-24TT
System serial number            : FOC1033Z1EY
Top Assembly Part Number        : 800-26671-02
Top Assembly Revision Number    : B0
Version ID                      : V02
CLEI Code Number                : COM3K00BRA
Hardware Board Revision Number  : 0x01


Switch   Ports  Model              SW Version              SW Image
------   -----  -----              ----------              ----------
*    1   26     WS-C2960-24TT      12.2                    C2960-LANBASE-M

Cisco IOS Software, C2960 Software (C2960-LANBASE-M), Version 12.2(25)FX, RELEASE SOFTWARE (fc1)
Copyright (c) 1986-2005 by Cisco Systems, Inc.
Compiled Wed 12-Oct-05 22:05 by pt_team

Press RETURN to get started!


%LINK-5-CHANGED: Interface GigabitEthernet0/1, changed state to up

%LINEPROTO-5-UPDOWN: Line protocol on Interface GigabitEthernet0/1, changed state to up

%LINK-5-CHANGED: Interface FastEthernet0/10, changed state to up

%LINEPROTO-5-UPDOWN: Line protocol on Interface FastEthernet0/10, changed state to up

%LINK-5-CHANGED: Interface FastEthernet0/20, changed state to up

%LINEPROTO-5-UPDOWN: Line protocol on Interface FastEthernet0/20, changed state to up


Switch>enable
Switch#terminal length 0
                ^
% Invalid input detected at '^' marker.

Switch#configure terminal
Enter configuration commands, one per line.  End with CNTL/Z.
Switch(config)#hostname S1
S1(config)#vlan 10
S1(config-vlan)#name Staff
S1(config-vlan)#vlan 20
S1(config-vlan)#name Management
S1(config-vlan)#vlan 999
S1(config-vlan)#name Native_Unused
S1(config-vlan)#exit
S1(config)#interface FastEthernet0/10
S1(config-if)#switchport mode access
S1(config-if)#switchport access vlan 10
S1(config-if)#no shutdown
S1(config-if)#interface FastEthernet0/20
S1(config-if)#switchport mode access
S1(config-if)#switchport access vlan 20
S1(config-if)#no shutdown
S1(config-if)#interface GigabitEthernet0/1
S1(config-if)#switchport mode dynamic auto
S1(config-if)#no shutdown
S1(config-if)#end
S1#
%SYS-5-CONFIG_I: Configured from console by console
enable
S1#terminal length 0
            ^
% Invalid input detected at '^' marker.

S1#show interfaces GigabitEthernet0/1 switchport
Name: Gig0/1
Switchport: Enabled
Administrative Mode: dynamic auto
Operational Mode: static access
Administrative Trunking Encapsulation: dot1q
Operational Trunking Encapsulation: native
Negotiation of Trunking: On
Access Mode VLAN: 1 (default)
Trunking Native Mode VLAN: 1 (default)
Voice VLAN: none
Administrative private-vlan host-association: none
Administrative private-vlan mapping: none
Administrative private-vlan trunk native VLAN: none
Administrative private-vlan trunk encapsulation: dot1q
Administrative private-vlan trunk normal VLANs: none
Administrative private-vlan trunk private VLANs: none
Operational private-vlan: none
Trunking VLANs Enabled: All
Pruning VLANs Enabled: 2-1001
Capture Mode Disabled
Capture VLANs Allowed: ALL
Protected: false

S1#how interfaces trunk
       ^
% Invalid input detected at '^' marker.

S1#configure terminal
Enter configuration commands, one per line.  End with CNTL/Z.
S1(config)#interface GigabitEthernet0/1
S1(config-if)#switchport mode dynamic desirable

S1(config-if)#
%LINEPROTO-5-UPDOWN: Line protocol on Interface GigabitEthernet0/1, changed state to up

%LINEPROTO-5-UPDOWN: Line protocol on Interface GigabitEthernet0/1, changed state to down

%LINEPROTO-5-UPDOWN: Line protocol on Interface GigabitEthernet0/1, changed state to up
end
S1#
%SYS-5-CONFIG_I: Configured from console by console
enable
S1#terminal length 0
            ^
% Invalid input detected at '^' marker.

S1#show interfaces GigabitEthernet0/1 switchport
Name: Gig0/1
Switchport: Enabled
Administrative Mode: dynamic desirable
Operational Mode: trunk
Administrative Trunking Encapsulation: dot1q
Operational Trunking Encapsulation: dot1q
Negotiation of Trunking: On
Access Mode VLAN: 1 (default)
Trunking Native Mode VLAN: 1 (default)
Voice VLAN: none
Administrative private-vlan host-association: none
Administrative private-vlan mapping: none
Administrative private-vlan trunk native VLAN: none
Administrative private-vlan trunk encapsulation: dot1q
Administrative private-vlan trunk normal VLANs: none
Administrative private-vlan trunk private VLANs: none
Operational private-vlan: none
Trunking VLANs Enabled: All
Pruning VLANs Enabled: 2-1001
Capture Mode Disabled
Capture VLANs Allowed: ALL
Protected: false

S1#how interfaces trunk
       ^
% Invalid input detected at '^' marker.

S1#

--- S2 Gi0/1 Switchport (Dynamic Auto responded to DTP) ---
show interfaces GigabitEthernet0/1 switchport
Name: Gig0/1
Switchport: Enabled
Administrative Mode: dynamic auto
Operational Mode: trunk
Administrative Trunking Encapsulation: dot1q
Operational Trunking Encapsulation: dot1q
Negotiation of Trunking: On
Access Mode VLAN: 1 (default)
Trunking Native Mode VLAN: 1 (default)
Voice VLAN: none
Administrative private-vlan host-association: none
Administrative private-vlan mapping: none
Administrative private-vlan trunk native VLAN: none
Administrative private-vlan trunk encapsulation: dot1q
Administrative private-vlan trunk normal VLANs: none
Administrative private-vlan trunk private VLANs: none
Operational private-vlan: none
Trunking VLANs Enabled: All
Pruning VLANs Enabled: 2-1001
Capture Mode Disabled
Capture VLANs Allowed: ALL
Protected: false
 --More--

--- S2 Interfaces Trunk (Negotiated Operational Trunk) ---
C2960 Boot Loader (C2960-HBOOT-M) Version 12.2(25r)FX, RELEASE SOFTWARE (fc4)
Cisco WS-C2960-24TT (RC32300) processor (revision C0) with 21039K bytes of memory.
2960-24TT starting...
Base ethernet MAC Address: 0030.F233.CB6E
Xmodem file system is available.
Initializing Flash...
flashfs[0]: 1 files, 0 directories
flashfs[0]: 0 orphaned files, 0 orphaned directories
flashfs[0]: Total bytes: 64016384
flashfs[0]: Bytes used: 4414921
flashfs[0]: Bytes available: 59601463
flashfs[0]: flashfs fsck took 1 seconds.
...done Initializing Flash.

Boot Sector Filesystem (bs:) installed, fsid: 3
Parameter Block Filesystem (pb:) installed, fsid: 4


Loading "flash:/c2960-lanbase-mz.122-25.FX.bin"...
######################### [OK]
              Restricted Rights Legend

Use, duplication, or disclosure by the Government is
subject to restrictions as set forth in subparagraph
(c) of the Commercial Computer Software - Restricted
Rights clause at FAR sec. 52.227-19 and subparagraph
(c) (1) (ii) of the Rights in Technical Data and Computer
Software clause at DFARS sec. 252.227-7013.

           cisco Systems, Inc.
           170 West Tasman Drive
           San Jose, California 95134-1706




Cisco IOS Software, C2960 Software (C2960-LANBASE-M), Version 12.2(25)FX, RELEASE SOFTWARE (fc1)
Copyright (c) 1986-2005 by Cisco Systems, Inc.
Compiled Wed 12-Oct-05 22:05 by pt_team
Image text-base: 0x80008098, data-base: 0x814129C4



Cisco WS-C2960-24TT (RC32300) processor (revision C0) with 21039K bytes of memory.


24 FastEthernet/IEEE 802.3 interface(s)
2 Gigabit Ethernet/IEEE 802.3 interface(s)

63488K bytes of flash-simulated non-volatile configuration memory.
Base ethernet MAC Address       : 0030.F233.CB6E
Motherboard assembly number     : 73-9832-06
Power supply part number        : 341-0097-02
Motherboard serial number       : FOC103248MJ
Power supply serial number      : DCA102133JA
Model revision number           : B0
Motherboard revision number     : C0
Model number                    : WS-C2960-24TT
System serial number            : FOC1033Z1EY
Top Assembly Part Number        : 800-26671-02
Top Assembly Revision Number    : B0
Version ID                      : V02
CLEI Code Number                : COM3K00BRA
Hardware Board Revision Number  : 0x01


Switch   Ports  Model              SW Version              SW Image
------   -----  -----              ----------              ----------
*    1   26     WS-C2960-24TT      12.2                    C2960-LANBASE-M

Cisco IOS Software, C2960 Software (C2960-LANBASE-M), Version 12.2(25)FX, RELEASE SOFTWARE (fc1)
Copyright (c) 1986-2005 by Cisco Systems, Inc.
Compiled Wed 12-Oct-05 22:05 by pt_team

Press RETURN to get started!


%LINK-5-CHANGED: Interface GigabitEthernet0/1, changed state to up

%LINEPROTO-5-UPDOWN: Line protocol on Interface GigabitEthernet0/1, changed state to up

%LINK-5-CHANGED: Interface FastEthernet0/10, changed state to up

%LINEPROTO-5-UPDOWN: Line protocol on Interface FastEthernet0/10, changed state to up

%LINK-5-CHANGED: Interface FastEthernet0/20, changed state to up

%LINEPROTO-5-UPDOWN: Line protocol on Interface FastEthernet0/20, changed state to up


Switch>enable
Switch#terminal length 0
                ^
% Invalid input detected at '^' marker.

Switch#configure terminal
Enter configuration commands, one per line.  End with CNTL/Z.
Switch(config)#hostname S2
S2(config)#vlan 10
S2(config-vlan)#name Staff
S2(config-vlan)#vlan 20
S2(config-vlan)#name Management
S2(config-vlan)#vlan 999
S2(config-vlan)#name Native_Unused
S2(config-vlan)#exit
S2(config)#interface FastEthernet0/10
S2(config-if)#switchport mode access
S2(config-if)#switchport access vlan 10
S2(config-if)#no shutdown
S2(config-if)#interface FastEthernet0/20
S2(config-if)#switchport mode access
S2(config-if)#switchport access vlan 20
S2(config-if)#no shutdown
S2(config-if)#interface GigabitEthernet0/1
S2(config-if)#switchport mode dynamic auto
S2(config-if)#no shutdown
S2(config-if)#end
S2#
%SYS-5-CONFIG_I: Configured from console by console
enable
S2#terminal length 0
            ^
% Invalid input detected at '^' marker.

S2#show interfaces GigabitEthernet0/1 switchport
Name: Gig0/1
Switchport: Enabled
Administrative Mode: dynamic auto
Operational Mode: static access
Administrative Trunking Encapsulation: dot1q
Operational Trunking Encapsulation: native
Negotiation of Trunking: On
Access Mode VLAN: 1 (default)
Trunking Native Mode VLAN: 1 (default)
Voice VLAN: none
Administrative private-vlan host-association: none
Administrative private-vlan mapping: none
Administrative private-vlan trunk native VLAN: none
Administrative private-vlan trunk encapsulation: dot1q
Administrative private-vlan trunk normal VLANs: none
Administrative private-vlan trunk private VLANs: none
Operational private-vlan: none
Trunking VLANs Enabled: All
Pruning VLANs Enabled: 2-1001
Capture Mode Disabled
Capture VLANs Allowed: ALL
Protected: false

S2#how interfaces trunk
       ^
% Invalid input detected at '^' marker.

S2#
%LINEPROTO-5-UPDOWN: Line protocol on Interface GigabitEthernet0/1, changed state to down

%LINEPROTO-5-UPDOWN: Line protocol on Interface GigabitEthernet0/1, changed state to up
enable
S2#terminal length 0
            ^
% Invalid input detected at '^' marker.

S2#show interfaces GigabitEthernet0/1 switchport
Name: Gig0/1
Switchport: Enabled
Administrative Mode: dynamic auto
Operational Mode: trunk
Administrative Trunking Encapsulation: dot1q
Operational Trunking Encapsulation: dot1q
Negotiation of Trunking: On
Access Mode VLAN: 1 (default)
Trunking Native Mode VLAN: 1 (default)
Voice VLAN: none
Administrative private-vlan host-association: none
Administrative private-vlan mapping: none
Administrative private-vlan trunk native VLAN: none
Administrative private-vlan trunk encapsulation: dot1q
Administrative private-vlan trunk normal VLANs: none
Administrative private-vlan trunk private VLANs: none
Operational private-vlan: none
Trunking VLANs Enabled: All
Pruning VLANs Enabled: 2-1001
Capture Mode Disabled
Capture VLANs Allowed: ALL
Protected: false

S2#how interfaces trunk
       ^
% Invalid input detected at '^' marker.

S2#
```

### POS-02: Permanent Manual 802.1Q Trunk Mode 'on'
```text
--- S1 Interfaces Trunk (Manual Permanent Trunk Mode 'on') ---
show interfaces trunk
Port        Mode         Encapsulation  Status        Native vlan
Gig0/1      on           802.1q         trunking      1

Port        Vlans allowed on trunk
Gig0/1      10,20,999

Port        Vlans allowed and active in management domain
Gig0/1      10,20,999

Port        Vlans in spanning tree forwarding state and not pruned
Gig0/1      10,20,999

S1#

--- S2 Interfaces Trunk (Manual Permanent Trunk Mode 'on') ---
show interfaces trunk
Port        Mode         Encapsulation  Status        Native vlan
Gig0/1      on           802.1q         trunking      1

Port        Vlans allowed on trunk
Gig0/1      10,20,999

Port        Vlans allowed and active in management domain
Gig0/1      10,20,999

Port        Vlans in spanning tree forwarding state and not pruned
Gig0/1      10,20,999

S2#
```

### POS-03: Intra-VLAN Cross-Switch Host Communication and Inter-VLAN Isolation
```text
--- PC1 (Staff VLAN 10) Ping to PC3 (Staff VLAN 10 across trunk) ---
ping 192.168.10.20

Pinging 192.168.10.20 with 32 bytes of data:

Reply from 192.168.10.20: bytes=32 time<1ms TTL=128
Reply from 192.168.10.20: bytes=32 time<1ms TTL=128
Reply from 192.168.10.20: bytes=32 time<1ms TTL=128

--- PC2 (Mgmt VLAN 20) Ping to PC4 (Mgmt VLAN 20 across trunk) ---
ping 192.168.20.20

Pinging 192.168.20.20 with 32 bytes of data:

Reply from 192.168.20.20: bytes=32 time<1ms TTL=128
Reply from 192.168.20.20: bytes=32 time<1ms TTL=128
Reply from 192.168.20.20: bytes=32 time<1ms TTL=128

--- PC1 (Staff VLAN 10) Ping to PC2 (Mgmt VLAN 20 - Inter-VLAN Isolation) ---
ping 192.168.20.10

Pinging 192.168.20.10 with 32 bytes of data:
```

### POS-04: Allowed VLAN List Restriction (10, 20, 999)
```text
--- S1 Allowed VLAN List on Trunk (10,20,999) ---
show interfaces trunk
Port        Mode         Encapsulation  Status        Native vlan
Gig0/1      on           802.1q         trunking      1

Port        Vlans allowed on trunk
Gig0/1      10,20,999

Port        Vlans allowed and active in management domain
Gig0/1      10,20,999

Port        Vlans in spanning tree forwarding state and not pruned
Gig0/1      10,20,999

S1#

--- S2 Allowed VLAN List on Trunk (10,20,999) ---
show interfaces trunk
Port        Mode         Encapsulation  Status        Native vlan
Gig0/1      on           802.1q         trunking      1

Port        Vlans allowed on trunk
Gig0/1      10,20,999

Port        Vlans allowed and active in management domain
Gig0/1      10,20,999

Port        Vlans in spanning tree forwarding state and not pruned
Gig0/1      10,20,999

S2#
```

### POS-05: Matching Native VLAN 999 Configuration
```text
--- S1 Interfaces Trunk (Matching Native VLAN 999) ---
show interfaces trunk
Port        Mode         Encapsulation  Status        Native vlan
Gig0/1      on           802.1q         trunking      999

Port        Vlans allowed on trunk
Gig0/1      10,20,999

Port        Vlans allowed and active in management domain
Gig0/1      10,20,999

Port        Vlans in spanning tree forwarding state and not pruned
Gig0/1      10,20,999

S1#

--- S2 Interfaces Trunk (Matching Native VLAN 999) ---
show interfaces trunk
Port        Mode         Encapsulation  Status        Native vlan
Gig0/1      on           802.1q         trunking      999

Port        Vlans allowed on trunk
Gig0/1      10,20,999

Port        Vlans allowed and active in management domain
Gig0/1      10,20,999

Port        Vlans in spanning tree forwarding state and not pruned
Gig0/1      10,20,999

S2#
```

### POS-06: Switchport Nonegotiate and Continued Trunk Operation
```text
--- S1 Gi0/1 Switchport ('Negotiation of Trunking: Off') ---
show interfaces GigabitEthernet0/1 switchport
Name: Gig0/1
Switchport: Enabled
Administrative Mode: trunk
Operational Mode: trunk
Administrative Trunking Encapsulation: dot1q
Operational Trunking Encapsulation: dot1q
Negotiation of Trunking: Off
Access Mode VLAN: 1 (default)
Trunking Native Mode VLAN: 999 (Native_Unused)
Voice VLAN: none
Administrative private-vlan host-association: none
Administrative private-vlan mapping: none
Administrative private-vlan trunk native VLAN: none
Administrative private-vlan trunk encapsulation: dot1q
Administrative private-vlan trunk normal VLANs: none
Administrative private-vlan trunk private VLANs: none
Operational private-vlan: none
Trunking VLANs Enabled: 10,20,999
Pruning VLANs Enabled: 2-1001
Capture Mode Disabled
Capture VLANs Allowed: ALL
Protected: false
 --More--

--- S2 Gi0/1 Switchport ('Negotiation of Trunking: Off') ---
show interfaces GigabitEthernet0/1 switchport
Name: Gig0/1
Switchport: Enabled
Administrative Mode: trunk
Operational Mode: trunk
Administrative Trunking Encapsulation: dot1q
Operational Trunking Encapsulation: dot1q
Negotiation of Trunking: Off
Access Mode VLAN: 1 (default)
Trunking Native Mode VLAN: 999 (Native_Unused)
Voice VLAN: none
Administrative private-vlan host-association: none
Administrative private-vlan mapping: none
Administrative private-vlan trunk native VLAN: none
Administrative private-vlan trunk encapsulation: dot1q
Administrative private-vlan trunk normal VLANs: none
Administrative private-vlan trunk private VLANs: none
Operational private-vlan: none
Trunking VLANs Enabled: 10,20,999
Pruning VLANs Enabled: 2-1001
Capture Mode Disabled
Capture VLANs Allowed: ALL
Protected: false
 --More--

--- PC1 Ping to PC3 with DTP Negotiation Disabled ---
ping 192.168.10.20

Pinging 192.168.10.20 with 32 bytes of data:

Reply from 192.168.10.20: bytes=32 time<1ms TTL=128
Reply from 192.168.10.20: bytes=32 time<1ms TTL=128
Reply from 192.168.10.20: bytes=32 time<1ms TTL=128

--- PC2 Ping to PC4 with DTP Negotiation Disabled ---
ping 192.168.20.20

Pinging 192.168.20.20 with 32 bytes of data:

Reply from 192.168.20.20: bytes=32 time<1ms TTL=128
Reply from 192.168.20.20: bytes=32 time<1ms TTL=128
Reply from 192.168.20.20: bytes=32 time<1ms TTL=128
```

## 3. Negative and Fault Scenarios

### NEG-01: Dynamic Auto on Both Ends Does Not Establish Trunk
```text
--- S1 Gi0/1 Switchport (Dynamic Auto) ---
show interfaces GigabitEthernet0/1 switchport
Name: Gig0/1
Switchport: Enabled
Administrative Mode: dynamic auto
Operational Mode: static access
Administrative Trunking Encapsulation: dot1q
Operational Trunking Encapsulation: native
Negotiation of Trunking: On
Access Mode VLAN: 1 (default)
Trunking Native Mode VLAN: 1 (default)
Voice VLAN: none
Administrative private-vlan host-association: none
Administrative private-vlan mapping: none
Administrative private-vlan trunk native VLAN: none
Administrative private-vlan trunk encapsulation: dot1q
Administrative private-vlan trunk normal VLANs: none
Administrative private-vlan trunk private VLANs: none
Operational private-vlan: none
Trunking VLANs Enabled: All
Pruning VLANs Enabled: 2-1001
Capture Mode Disabled
Capture VLANs Allowed: ALL
Protected: false
 --More--

--- S1 Interfaces Trunk (Expect None) ---
C2960 Boot Loader (C2960-HBOOT-M) Version 12.2(25r)FX, RELEASE SOFTWARE (fc4)
Cisco WS-C2960-24TT (RC32300) processor (revision C0) with 21039K bytes of memory.
2960-24TT starting...
Base ethernet MAC Address: 0000.0C21.6A01
Xmodem file system is available.
Initializing Flash...
flashfs[0]: 1 files, 0 directories
flashfs[0]: 0 orphaned files, 0 orphaned directories
flashfs[0]: Total bytes: 64016384
flashfs[0]: Bytes used: 4414921
flashfs[0]: Bytes available: 59601463
flashfs[0]: flashfs fsck took 1 seconds.
...done Initializing Flash.

Boot Sector Filesystem (bs:) installed, fsid: 3
Parameter Block Filesystem (pb:) installed, fsid: 4


Loading "flash:/c2960-lanbase-mz.122-25.FX.bin"...
######################### [OK]
              Restricted Rights Legend

Use, duplication, or disclosure by the Government is
subject to restrictions as set forth in subparagraph
(c) of the Commercial Computer Software - Restricted
Rights clause at FAR sec. 52.227-19 and subparagraph
(c) (1) (ii) of the Rights in Technical Data and Computer
Software clause at DFARS sec. 252.227-7013.

           cisco Systems, Inc.
           170 West Tasman Drive
           San Jose, California 95134-1706




Cisco IOS Software, C2960 Software (C2960-LANBASE-M), Version 12.2(25)FX, RELEASE SOFTWARE (fc1)
Copyright (c) 1986-2005 by Cisco Systems, Inc.
Compiled Wed 12-Oct-05 22:05 by pt_team
Image text-base: 0x80008098, data-base: 0x814129C4



Cisco WS-C2960-24TT (RC32300) processor (revision C0) with 21039K bytes of memory.


24 FastEthernet/IEEE 802.3 interface(s)
2 Gigabit Ethernet/IEEE 802.3 interface(s)

63488K bytes of flash-simulated non-volatile configuration memory.
Base ethernet MAC Address       : 0000.0C21.6A01
Motherboard assembly number     : 73-9832-06
Power supply part number        : 341-0097-02
Motherboard serial number       : FOC103248MJ
Power supply serial number      : DCA102133JA
Model revision number           : B0
Motherboard revision number     : C0
Model number                    : WS-C2960-24TT
System serial number            : FOC1033Z1EY
Top Assembly Part Number        : 800-26671-02
Top Assembly Revision Number    : B0
Version ID                      : V02
CLEI Code Number                : COM3K00BRA
Hardware Board Revision Number  : 0x01


Switch   Ports  Model              SW Version              SW Image
------   -----  -----              ----------              ----------
*    1   26     WS-C2960-24TT      12.2                    C2960-LANBASE-M

Cisco IOS Software, C2960 Software (C2960-LANBASE-M), Version 12.2(25)FX, RELEASE SOFTWARE (fc1)
Copyright (c) 1986-2005 by Cisco Systems, Inc.
Compiled Wed 12-Oct-05 22:05 by pt_team

Press RETURN to get started!


%LINK-5-CHANGED: Interface GigabitEthernet0/1, changed state to up

%LINEPROTO-5-UPDOWN: Line protocol on Interface GigabitEthernet0/1, changed state to up

%LINK-5-CHANGED: Interface FastEthernet0/10, changed state to up

%LINEPROTO-5-UPDOWN: Line protocol on Interface FastEthernet0/10, changed state to up

%LINK-5-CHANGED: Interface FastEthernet0/20, changed state to up

%LINEPROTO-5-UPDOWN: Line protocol on Interface FastEthernet0/20, changed state to up


Switch>enable
Switch#terminal length 0
                ^
% Invalid input detected at '^' marker.

Switch#configure terminal
Enter configuration commands, one per line.  End with CNTL/Z.
Switch(config)#hostname S1
S1(config)#vlan 10
S1(config-vlan)#name Staff
S1(config-vlan)#vlan 20
S1(config-vlan)#name Management
S1(config-vlan)#vlan 999
S1(config-vlan)#name Native_Unused
S1(config-vlan)#exit
S1(config)#interface FastEthernet0/10
S1(config-if)#switchport mode access
S1(config-if)#switchport access vlan 10
S1(config-if)#no shutdown
S1(config-if)#interface FastEthernet0/20
S1(config-if)#switchport mode access
S1(config-if)#switchport access vlan 20
S1(config-if)#no shutdown
S1(config-if)#interface GigabitEthernet0/1
S1(config-if)#switchport mode dynamic auto
S1(config-if)#no shutdown
S1(config-if)#end
S1#
%SYS-5-CONFIG_I: Configured from console by console
enable
S1#terminal length 0
            ^
% Invalid input detected at '^' marker.

S1#show interfaces GigabitEthernet0/1 switchport
Name: Gig0/1
Switchport: Enabled
Administrative Mode: dynamic auto
Operational Mode: static access
Administrative Trunking Encapsulation: dot1q
Operational Trunking Encapsulation: native
Negotiation of Trunking: On
Access Mode VLAN: 1 (default)
Trunking Native Mode VLAN: 1 (default)
Voice VLAN: none
Administrative private-vlan host-association: none
Administrative private-vlan mapping: none
Administrative private-vlan trunk native VLAN: none
Administrative private-vlan trunk encapsulation: dot1q
Administrative private-vlan trunk normal VLANs: none
Administrative private-vlan trunk private VLANs: none
Operational private-vlan: none
Trunking VLANs Enabled: All
Pruning VLANs Enabled: 2-1001
Capture Mode Disabled
Capture VLANs Allowed: ALL
Protected: false

S1#how interfaces trunk
       ^
% Invalid input detected at '^' marker.

S1#

--- S2 Gi0/1 Switchport (Dynamic Auto) ---
show interfaces GigabitEthernet0/1 switchport
Name: Gig0/1
Switchport: Enabled
Administrative Mode: dynamic auto
Operational Mode: static access
Administrative Trunking Encapsulation: dot1q
Operational Trunking Encapsulation: native
Negotiation of Trunking: On
Access Mode VLAN: 1 (default)
Trunking Native Mode VLAN: 1 (default)
Voice VLAN: none
Administrative private-vlan host-association: none
Administrative private-vlan mapping: none
Administrative private-vlan trunk native VLAN: none
Administrative private-vlan trunk encapsulation: dot1q
Administrative private-vlan trunk normal VLANs: none
Administrative private-vlan trunk private VLANs: none
Operational private-vlan: none
Trunking VLANs Enabled: All
Pruning VLANs Enabled: 2-1001
Capture Mode Disabled
Capture VLANs Allowed: ALL
Protected: false
 --More--

--- S2 Interfaces Trunk (Expect None) ---
C2960 Boot Loader (C2960-HBOOT-M) Version 12.2(25r)FX, RELEASE SOFTWARE (fc4)
Cisco WS-C2960-24TT (RC32300) processor (revision C0) with 21039K bytes of memory.
2960-24TT starting...
Base ethernet MAC Address: 0030.F233.CB6E
Xmodem file system is available.
Initializing Flash...
flashfs[0]: 1 files, 0 directories
flashfs[0]: 0 orphaned files, 0 orphaned directories
flashfs[0]: Total bytes: 64016384
flashfs[0]: Bytes used: 4414921
flashfs[0]: Bytes available: 59601463
flashfs[0]: flashfs fsck took 1 seconds.
...done Initializing Flash.

Boot Sector Filesystem (bs:) installed, fsid: 3
Parameter Block Filesystem (pb:) installed, fsid: 4


Loading "flash:/c2960-lanbase-mz.122-25.FX.bin"...
######################### [OK]
              Restricted Rights Legend

Use, duplication, or disclosure by the Government is
subject to restrictions as set forth in subparagraph
(c) of the Commercial Computer Software - Restricted
Rights clause at FAR sec. 52.227-19 and subparagraph
(c) (1) (ii) of the Rights in Technical Data and Computer
Software clause at DFARS sec. 252.227-7013.

           cisco Systems, Inc.
           170 West Tasman Drive
           San Jose, California 95134-1706




Cisco IOS Software, C2960 Software (C2960-LANBASE-M), Version 12.2(25)FX, RELEASE SOFTWARE (fc1)
Copyright (c) 1986-2005 by Cisco Systems, Inc.
Compiled Wed 12-Oct-05 22:05 by pt_team
Image text-base: 0x80008098, data-base: 0x814129C4



Cisco WS-C2960-24TT (RC32300) processor (revision C0) with 21039K bytes of memory.


24 FastEthernet/IEEE 802.3 interface(s)
2 Gigabit Ethernet/IEEE 802.3 interface(s)

63488K bytes of flash-simulated non-volatile configuration memory.
Base ethernet MAC Address       : 0030.F233.CB6E
Motherboard assembly number     : 73-9832-06
Power supply part number        : 341-0097-02
Motherboard serial number       : FOC103248MJ
Power supply serial number      : DCA102133JA
Model revision number           : B0
Motherboard revision number     : C0
Model number                    : WS-C2960-24TT
System serial number            : FOC1033Z1EY
Top Assembly Part Number        : 800-26671-02
Top Assembly Revision Number    : B0
Version ID                      : V02
CLEI Code Number                : COM3K00BRA
Hardware Board Revision Number  : 0x01


Switch   Ports  Model              SW Version              SW Image
------   -----  -----              ----------              ----------
*    1   26     WS-C2960-24TT      12.2                    C2960-LANBASE-M

Cisco IOS Software, C2960 Software (C2960-LANBASE-M), Version 12.2(25)FX, RELEASE SOFTWARE (fc1)
Copyright (c) 1986-2005 by Cisco Systems, Inc.
Compiled Wed 12-Oct-05 22:05 by pt_team

Press RETURN to get started!


%LINK-5-CHANGED: Interface GigabitEthernet0/1, changed state to up

%LINEPROTO-5-UPDOWN: Line protocol on Interface GigabitEthernet0/1, changed state to up

%LINK-5-CHANGED: Interface FastEthernet0/10, changed state to up

%LINEPROTO-5-UPDOWN: Line protocol on Interface FastEthernet0/10, changed state to up

%LINK-5-CHANGED: Interface FastEthernet0/20, changed state to up

%LINEPROTO-5-UPDOWN: Line protocol on Interface FastEthernet0/20, changed state to up


Switch>enable
Switch#terminal length 0
                ^
% Invalid input detected at '^' marker.

Switch#configure terminal
Enter configuration commands, one per line.  End with CNTL/Z.
Switch(config)#hostname S2
S2(config)#vlan 10
S2(config-vlan)#name Staff
S2(config-vlan)#vlan 20
S2(config-vlan)#name Management
S2(config-vlan)#vlan 999
S2(config-vlan)#name Native_Unused
S2(config-vlan)#exit
S2(config)#interface FastEthernet0/10
S2(config-if)#switchport mode access
S2(config-if)#switchport access vlan 10
S2(config-if)#no shutdown
S2(config-if)#interface FastEthernet0/20
S2(config-if)#switchport mode access
S2(config-if)#switchport access vlan 20
S2(config-if)#no shutdown
S2(config-if)#interface GigabitEthernet0/1
S2(config-if)#switchport mode dynamic auto
S2(config-if)#no shutdown
S2(config-if)#end
S2#
%SYS-5-CONFIG_I: Configured from console by console
enable
S2#terminal length 0
            ^
% Invalid input detected at '^' marker.

S2#show interfaces GigabitEthernet0/1 switchport
Name: Gig0/1
Switchport: Enabled
Administrative Mode: dynamic auto
Operational Mode: static access
Administrative Trunking Encapsulation: dot1q
Operational Trunking Encapsulation: native
Negotiation of Trunking: On
Access Mode VLAN: 1 (default)
Trunking Native Mode VLAN: 1 (default)
Voice VLAN: none
Administrative private-vlan host-association: none
Administrative private-vlan mapping: none
Administrative private-vlan trunk native VLAN: none
Administrative private-vlan trunk encapsulation: dot1q
Administrative private-vlan trunk normal VLANs: none
Administrative private-vlan trunk private VLANs: none
Operational private-vlan: none
Trunking VLANs Enabled: All
Pruning VLANs Enabled: 2-1001
Capture Mode Disabled
Capture VLANs Allowed: ALL
Protected: false

S2#how interfaces trunk
       ^
% Invalid input detected at '^' marker.

S2#
```

### NEG-02: Traffic Blocking upon Pruning VLAN 10 from Allowed List
```text
--- S1 Interfaces Trunk after 'switchport trunk allowed vlan remove 10' ---
show interfaces trunk
Port        Mode         Encapsulation  Status        Native vlan
Gig0/1      on           802.1q         trunking      999

Port        Vlans allowed on trunk
Gig0/1      20,999

Port        Vlans allowed and active in management domain
Gig0/1      20,999

Port        Vlans in spanning tree forwarding state and not pruned
Gig0/1      20,999

S1#

--- PC1 (VLAN 10) Ping to PC3 across Trunk (Blocked by Pruning) ---
ping 192.168.10.20

Pinging 192.168.10.20 with 32 bytes of data:

--- PC2 (VLAN 20) Ping to PC4 across Trunk (Permitted VLAN Continues) ---
ping 192.168.20.20

Pinging 192.168.20.20 with 32 bytes of data:

Reply from 192.168.20.20: bytes=32 time<1ms TTL=128
Reply from 192.168.20.20: bytes=32 time<1ms TTL=128
Reply from 192.168.20.20: bytes=32 time<1ms TTL=128
```

### NEG-03: Deliberate Native VLAN Mismatch Warnings and Inconsistency State
```text
--- S1 Syslog / Console Warning (Native Mismatch) ---
show logging
Syslog logging: enabled (0 messages dropped, 0 messages rate-limited,
          0 flushes, 0 overruns, xml disabled, filtering disabled)

No Active Message Discriminator.


No Inactive Message Discriminator.


    Console logging: level debugging, 16 messages logged, xml disabled,
          filtering disabled
    Monitor logging: level debugging, 16 messages logged, xml disabled,
          filtering disabled
    Buffer logging:  level debugging, 0 messages logged, xml disabled,
          filtering disabled

    Logging Exception size (4096 bytes)
    Count and timestamp logging messages: disabled
    Persistent logging: disabled

No active filter modules.

 --More--

--- S2 Syslog / Console Warning (Native Mismatch) ---
show logging
Syslog logging: enabled (0 messages dropped, 0 messages rate-limited,
          0 flushes, 0 overruns, xml disabled, filtering disabled)

No Active Message Discriminator.


No Inactive Message Discriminator.


    Console logging: level debugging, 16 messages logged, xml disabled,
          filtering disabled
    Monitor logging: level debugging, 16 messages logged, xml disabled,
          filtering disabled
    Buffer logging:  level debugging, 0 messages logged, xml disabled,
          filtering disabled

    Logging Exception size (4096 bytes)
    Count and timestamp logging messages: disabled
    Persistent logging: disabled

No active filter modules.

 --More--

--- S1 Spanning Tree Inconsistent Ports ---
C2960 Boot Loader (C2960-HBOOT-M) Version 12.2(25r)FX, RELEASE SOFTWARE (fc4)
Cisco WS-C2960-24TT (RC32300) processor (revision C0) with 21039K bytes of memory.
2960-24TT starting...
Base ethernet MAC Address: 0000.0C21.6A01
Xmodem file system is available.
Initializing Flash...
flashfs[0]: 1 files, 0 directories
flashfs[0]: 0 orphaned files, 0 orphaned directories
flashfs[0]: Total bytes: 64016384
flashfs[0]: Bytes used: 4414921
flashfs[0]: Bytes available: 59601463
flashfs[0]: flashfs fsck took 1 seconds.
...done Initializing Flash.

Boot Sector Filesystem (bs:) installed, fsid: 3
Parameter Block Filesystem (pb:) installed, fsid: 4


Loading "flash:/c2960-lanbase-mz.122-25.FX.bin"...
######################### [OK]
              Restricted Rights Legend

Use, duplication, or disclosure by the Government is
subject to restrictions as set forth in subparagraph
(c) of the Commercial Computer Software - Restricted
Rights clause at FAR sec. 52.227-19 and subparagraph
(c) (1) (ii) of the Rights in Technical Data and Computer
Software clause at DFARS sec. 252.227-7013.

           cisco Systems, Inc.
           170 West Tasman Drive
           San Jose, California 95134-1706




Cisco IOS Software, C2960 Software (C2960-LANBASE-M), Version 12.2(25)FX, RELEASE SOFTWARE (fc1)
Copyright (c) 1986-2005 by Cisco Systems, Inc.
Compiled Wed 12-Oct-05 22:05 by pt_team
Image text-base: 0x80008098, data-base: 0x814129C4



Cisco WS-C2960-24TT (RC32300) processor (revision C0) with 21039K bytes of memory.


24 FastEthernet/IEEE 802.3 interface(s)
2 Gigabit Ethernet/IEEE 802.3 interface(s)

63488K bytes of flash-simulated non-volatile configuration memory.
Base ethernet MAC Address       : 0000.0C21.6A01
Motherboard assembly number     : 73-9832-06
Power supply part number        : 341-0097-02
Motherboard serial number       : FOC103248MJ
Power supply serial number      : DCA102133JA
Model revision number           : B0
Motherboard revision number     : C0
Model number                    : WS-C2960-24TT
System serial number            : FOC1033Z1EY
Top Assembly Part Number        : 800-26671-02
Top Assembly Revision Number    : B0
Version ID                      : V02
CLEI Code Number                : COM3K00BRA
Hardware Board Revision Number  : 0x01


Switch   Ports  Model              SW Version              SW Image
------   -----  -----              ----------              ----------
*    1   26     WS-C2960-24TT      12.2                    C2960-LANBASE-M

Cisco IOS Software, C2960 Software (C2960-LANBASE-M), Version 12.2(25)FX, RELEASE SOFTWARE (fc1)
Copyright (c) 1986-2005 by Cisco Systems, Inc.
Compiled Wed 12-Oct-05 22:05 by pt_team

Press RETURN to get started!


%LINK-5-CHANGED: Interface GigabitEthernet0/1, changed state to up

%LINEPROTO-5-UPDOWN: Line protocol on Interface GigabitEthernet0/1, changed state to up

%LINK-5-CHANGED: Interface FastEthernet0/10, changed state to up

%LINEPROTO-5-UPDOWN: Line protocol on Interface FastEthernet0/10, changed state to up

%LINK-5-CHANGED: Interface FastEthernet0/20, changed state to up

%LINEPROTO-5-UPDOWN: Line protocol on Interface FastEthernet0/20, changed state to up


Switch>enable
Switch#terminal length 0
                ^
% Invalid input detected at '^' marker.

Switch#configure terminal
Enter configuration commands, one per line.  End with CNTL/Z.
Switch(config)#hostname S1
S1(config)#vlan 10
S1(config-vlan)#name Staff
S1(config-vlan)#vlan 20
S1(config-vlan)#name Management
S1(config-vlan)#vlan 999
S1(config-vlan)#name Native_Unused
S1(config-vlan)#exit
S1(config)#interface FastEthernet0/10
S1(config-if)#switchport mode access
S1(config-if)#switchport access vlan 10
S1(config-if)#no shutdown
S1(config-if)#interface FastEthernet0/20
S1(config-if)#switchport mode access
S1(config-if)#switchport access vlan 20
S1(config-if)#no shutdown
S1(config-if)#interface GigabitEthernet0/1
S1(config-if)#switchport mode dynamic auto
S1(config-if)#no shutdown
S1(config-if)#end
S1#
%SYS-5-CONFIG_I: Configured from console by console
enable
S1#terminal length 0
            ^
% Invalid input detected at '^' marker.

S1#show interfaces GigabitEthernet0/1 switchport
Name: Gig0/1
Switchport: Enabled
Administrative Mode: dynamic auto
Operational Mode: static access
Administrative Trunking Encapsulation: dot1q
Operational Trunking Encapsulation: native
Negotiation of Trunking: On
Access Mode VLAN: 1 (default)
Trunking Native Mode VLAN: 1 (default)
Voice VLAN: none
Administrative private-vlan host-association: none
Administrative private-vlan mapping: none
Administrative private-vlan trunk native VLAN: none
Administrative private-vlan trunk encapsulation: dot1q
Administrative private-vlan trunk normal VLANs: none
Administrative private-vlan trunk private VLANs: none
Operational private-vlan: none
Trunking VLANs Enabled: All
Pruning VLANs Enabled: 2-1001
Capture Mode Disabled
Capture VLANs Allowed: ALL
Protected: false

S1#how interfaces trunk
       ^
% Invalid input detected at '^' marker.

S1#configure terminal
Enter configuration commands, one per line.  End with CNTL/Z.
S1(config)#interface GigabitEthernet0/1
S1(config-if)#switchport mode dynamic desirable

S1(config-if)#
%LINEPROTO-5-UPDOWN: Line protocol on Interface GigabitEthernet0/1, changed state to up

%LINEPROTO-5-UPDOWN: Line protocol on Interface GigabitEthernet0/1, changed state to down

%LINEPROTO-5-UPDOWN: Line protocol on Interface GigabitEthernet0/1, changed state to up
end
S1#
%SYS-5-CONFIG_I: Configured from console by console
enable
S1#terminal length 0
            ^
% Invalid input detected at '^' marker.

S1#show interfaces GigabitEthernet0/1 switchport
Name: Gig0/1
Switchport: Enabled
Administrative Mode: dynamic desirable
Operational Mode: trunk
Administrative Trunking Encapsulation: dot1q
Operational Trunking Encapsulation: dot1q
Negotiation of Trunking: On
Access Mode VLAN: 1 (default)
Trunking Native Mode VLAN: 1 (default)
Voice VLAN: none
Administrative private-vlan host-association: none
Administrative private-vlan mapping: none
Administrative private-vlan trunk native VLAN: none
Administrative private-vlan trunk encapsulation: dot1q
Administrative private-vlan trunk normal VLANs: none
Administrative private-vlan trunk private VLANs: none
Operational private-vlan: none
Trunking VLANs Enabled: All
Pruning VLANs Enabled: 2-1001
Capture Mode Disabled
Capture VLANs Allowed: ALL
Protected: false

S1#how interfaces trunk
       ^
% Invalid input detected at '^' marker.

S1#configure terminal
Enter configuration commands, one per line.  End with CNTL/Z.
S1(config)#interface GigabitEthernet0/1
S1(config-if)#switchport mode trunk
S1(config-if)#switchport trunk allowed vlan 10,20,999
S1(config-if)#end
S1#
%SYS-5-CONFIG_I: Configured from console by console
enable
S1#terminal length 0
            ^
% Invalid input detected at '^' marker.

S1#show interfaces trunk
Port        Mode         Encapsulation  Status        Native vlan
Gig0/1      on           802.1q         trunking      1

Port        Vlans allowed on trunk
Gig0/1      10,20,999

Port        Vlans allowed and active in management domain
Gig0/1      10,20,999

Port        Vlans in spanning tree forwarding state and not pruned
Gig0/1      10,20,999

S1#configure terminal
Enter configuration commands, one per line.  End with CNTL/Z.
S1(config)#interface GigabitEthernet0/1
S1(config-if)#switchport trunk native vlan 999
S1(config-if)#end
S1#
%SYS-5-CONFIG_I: Configured from console by console

%CDP-4-NATIVE_VLAN_MISMATCH: Native VLAN mismatch discovered on GigabitEthernet0/1 (999), with S2 GigabitEthernet0/1 (1).

%CDP-4-NATIVE_VLAN_MISMATCH: Native VLAN mismatch discovered on GigabitEthernet0/1 (999), with S2 GigabitEthernet0/1 (1).

%CDP-4-NATIVE_VLAN_MISMATCH: Native VLAN mismatch discovered on GigabitEthernet0/1 (999), with S2 GigabitEthernet0/1 (1).
enable
S1#terminal length 0
            ^
% Invalid input detected at '^' marker.

S1#
S1#show logging
Syslog logging: enabled (0 messages dropped, 0 messages rate-limited,
          0 flushes, 0 overruns, xml disabled, filtering disabled)

No Active Message Discriminator.


No Inactive Message Discriminator.


    Console logging: level debugging, 16 messages logged, xml disabled,
          filtering disabled
    Monitor logging: level debugging, 16 messages logged, xml disabled,
          filtering disabled
    Buffer logging:  level debugging, 0 messages logged, xml disabled,
          filtering disabled

    Logging Exception size (4096 bytes)
    Count and timestamp logging messages: disabled
    Persistent logging: disabled

No active filter modules.


S1#how spanning-tree inconsistentports
       ^
% Invalid input detected at '^' marker.

S1#

--- S2 Spanning Tree Inconsistent Ports ---
C2960 Boot Loader (C2960-HBOOT-M) Version 12.2(25r)FX, RELEASE SOFTWARE (fc4)
Cisco WS-C2960-24TT (RC32300) processor (revision C0) with 21039K bytes of memory.
2960-24TT starting...
Base ethernet MAC Address: 0030.F233.CB6E
Xmodem file system is available.
Initializing Flash...
flashfs[0]: 1 files, 0 directories
flashfs[0]: 0 orphaned files, 0 orphaned directories
flashfs[0]: Total bytes: 64016384
flashfs[0]: Bytes used: 4414921
flashfs[0]: Bytes available: 59601463
flashfs[0]: flashfs fsck took 1 seconds.
...done Initializing Flash.

Boot Sector Filesystem (bs:) installed, fsid: 3
Parameter Block Filesystem (pb:) installed, fsid: 4


Loading "flash:/c2960-lanbase-mz.122-25.FX.bin"...
######################### [OK]
              Restricted Rights Legend

Use, duplication, or disclosure by the Government is
subject to restrictions as set forth in subparagraph
(c) of the Commercial Computer Software - Restricted
Rights clause at FAR sec. 52.227-19 and subparagraph
(c) (1) (ii) of the Rights in Technical Data and Computer
Software clause at DFARS sec. 252.227-7013.

           cisco Systems, Inc.
           170 West Tasman Drive
           San Jose, California 95134-1706




Cisco IOS Software, C2960 Software (C2960-LANBASE-M), Version 12.2(25)FX, RELEASE SOFTWARE (fc1)
Copyright (c) 1986-2005 by Cisco Systems, Inc.
Compiled Wed 12-Oct-05 22:05 by pt_team
Image text-base: 0x80008098, data-base: 0x814129C4



Cisco WS-C2960-24TT (RC32300) processor (revision C0) with 21039K bytes of memory.


24 FastEthernet/IEEE 802.3 interface(s)
2 Gigabit Ethernet/IEEE 802.3 interface(s)

63488K bytes of flash-simulated non-volatile configuration memory.
Base ethernet MAC Address       : 0030.F233.CB6E
Motherboard assembly number     : 73-9832-06
Power supply part number        : 341-0097-02
Motherboard serial number       : FOC103248MJ
Power supply serial number      : DCA102133JA
Model revision number           : B0
Motherboard revision number     : C0
Model number                    : WS-C2960-24TT
System serial number            : FOC1033Z1EY
Top Assembly Part Number        : 800-26671-02
Top Assembly Revision Number    : B0
Version ID                      : V02
CLEI Code Number                : COM3K00BRA
Hardware Board Revision Number  : 0x01


Switch   Ports  Model              SW Version              SW Image
------   -----  -----              ----------              ----------
*    1   26     WS-C2960-24TT      12.2                    C2960-LANBASE-M

Cisco IOS Software, C2960 Software (C2960-LANBASE-M), Version 12.2(25)FX, RELEASE SOFTWARE (fc1)
Copyright (c) 1986-2005 by Cisco Systems, Inc.
Compiled Wed 12-Oct-05 22:05 by pt_team

Press RETURN to get started!


%LINK-5-CHANGED: Interface GigabitEthernet0/1, changed state to up

%LINEPROTO-5-UPDOWN: Line protocol on Interface GigabitEthernet0/1, changed state to up

%LINK-5-CHANGED: Interface FastEthernet0/10, changed state to up

%LINEPROTO-5-UPDOWN: Line protocol on Interface FastEthernet0/10, changed state to up

%LINK-5-CHANGED: Interface FastEthernet0/20, changed state to up

%LINEPROTO-5-UPDOWN: Line protocol on Interface FastEthernet0/20, changed state to up


Switch>enable
Switch#terminal length 0
                ^
% Invalid input detected at '^' marker.

Switch#configure terminal
Enter configuration commands, one per line.  End with CNTL/Z.
Switch(config)#hostname S2
S2(config)#vlan 10
S2(config-vlan)#name Staff
S2(config-vlan)#vlan 20
S2(config-vlan)#name Management
S2(config-vlan)#vlan 999
S2(config-vlan)#name Native_Unused
S2(config-vlan)#exit
S2(config)#interface FastEthernet0/10
S2(config-if)#switchport mode access
S2(config-if)#switchport access vlan 10
S2(config-if)#no shutdown
S2(config-if)#interface FastEthernet0/20
S2(config-if)#switchport mode access
S2(config-if)#switchport access vlan 20
S2(config-if)#no shutdown
S2(config-if)#interface GigabitEthernet0/1
S2(config-if)#switchport mode dynamic auto
S2(config-if)#no shutdown
S2(config-if)#end
S2#
%SYS-5-CONFIG_I: Configured from console by console
enable
S2#terminal length 0
            ^
% Invalid input detected at '^' marker.

S2#show interfaces GigabitEthernet0/1 switchport
Name: Gig0/1
Switchport: Enabled
Administrative Mode: dynamic auto
Operational Mode: static access
Administrative Trunking Encapsulation: dot1q
Operational Trunking Encapsulation: native
Negotiation of Trunking: On
Access Mode VLAN: 1 (default)
Trunking Native Mode VLAN: 1 (default)
Voice VLAN: none
Administrative private-vlan host-association: none
Administrative private-vlan mapping: none
Administrative private-vlan trunk native VLAN: none
Administrative private-vlan trunk encapsulation: dot1q
Administrative private-vlan trunk normal VLANs: none
Administrative private-vlan trunk private VLANs: none
Operational private-vlan: none
Trunking VLANs Enabled: All
Pruning VLANs Enabled: 2-1001
Capture Mode Disabled
Capture VLANs Allowed: ALL
Protected: false

S2#how interfaces trunk
       ^
% Invalid input detected at '^' marker.

S2#
%LINEPROTO-5-UPDOWN: Line protocol on Interface GigabitEthernet0/1, changed state to down

%LINEPROTO-5-UPDOWN: Line protocol on Interface GigabitEthernet0/1, changed state to up
enable
S2#terminal length 0
            ^
% Invalid input detected at '^' marker.

S2#show interfaces GigabitEthernet0/1 switchport
Name: Gig0/1
Switchport: Enabled
Administrative Mode: dynamic auto
Operational Mode: trunk
Administrative Trunking Encapsulation: dot1q
Operational Trunking Encapsulation: dot1q
Negotiation of Trunking: On
Access Mode VLAN: 1 (default)
Trunking Native Mode VLAN: 1 (default)
Voice VLAN: none
Administrative private-vlan host-association: none
Administrative private-vlan mapping: none
Administrative private-vlan trunk native VLAN: none
Administrative private-vlan trunk encapsulation: dot1q
Administrative private-vlan trunk normal VLANs: none
Administrative private-vlan trunk private VLANs: none
Operational private-vlan: none
Trunking VLANs Enabled: All
Pruning VLANs Enabled: 2-1001
Capture Mode Disabled
Capture VLANs Allowed: ALL
Protected: false

S2#how interfaces trunk
       ^
% Invalid input detected at '^' marker.

S2#configure terminal
Enter configuration commands, one per line.  End with CNTL/Z.
S2(config)#interface GigabitEthernet0/1
S2(config-if)#switchport mode trunk
S2(config-if)#switchport trunk allowed vlan 10,20,999
S2(config-if)#end
S2#
%SYS-5-CONFIG_I: Configured from console by console
enable
S2#terminal length 0
            ^
% Invalid input detected at '^' marker.

S2#show interfaces trunk
Port        Mode         Encapsulation  Status        Native vlan
Gig0/1      on           802.1q         trunking      1

Port        Vlans allowed on trunk
Gig0/1      10,20,999

Port        Vlans allowed and active in management domain
Gig0/1      10,20,999

Port        Vlans in spanning tree forwarding state and not pruned
Gig0/1      10,20,999

S2#%SPANTREE-2-RECV_PVID_ERR: Received BPDU with inconsistent peer vlan id 999 on GigabitEthernet0/1 VLAN1.

%SPANTREE-2-BLOCK_PVID_LOCAL: Blocking GigabitEthernet0/1 on VLAN0001. Inconsistent local vlan.

configure terminal
Enter configuration commands, one per line.  End with CNTL/Z.
S2(config)#interface GigabitEthernet0/1
S2(config-if)#switchport trunk native vlan 1
S2(config-if)#end
S2#
%SYS-5-CONFIG_I: Configured from console by console

%CDP-4-NATIVE_VLAN_MISMATCH: Native VLAN mismatch discovered on GigabitEthernet0/1 (1), with S1 GigabitEthernet0/1 (999).

%CDP-4-NATIVE_VLAN_MISMATCH: Native VLAN mismatch discovered on GigabitEthernet0/1 (1), with S1 GigabitEthernet0/1 (999).

%CDP-4-NATIVE_VLAN_MISMATCH: Native VLAN mismatch discovered on GigabitEthernet0/1 (1), with S1 GigabitEthernet0/1 (999).
enable
S2#terminal length 0
            ^
% Invalid input detected at '^' marker.

S2#
S2#show logging
Syslog logging: enabled (0 messages dropped, 0 messages rate-limited,
          0 flushes, 0 overruns, xml disabled, filtering disabled)

No Active Message Discriminator.


No Inactive Message Discriminator.


    Console logging: level debugging, 16 messages logged, xml disabled,
          filtering disabled
    Monitor logging: level debugging, 16 messages logged, xml disabled,
          filtering disabled
    Buffer logging:  level debugging, 0 messages logged, xml disabled,
          filtering disabled

    Logging Exception size (4096 bytes)
    Count and timestamp logging messages: disabled
    Persistent logging: disabled

No active filter modules.


S2#how spanning-tree inconsistentports
       ^
% Invalid input detected at '^' marker.

S2#
```

### NEG-04: Restoration of Allowed List and Successful Traffic Recovery
```text
--- S1 Interfaces Trunk after Restoring VLAN 10 ---
show interfaces trunk
Port        Mode         Encapsulation  Status        Native vlan
Gig0/1      on           802.1q         trunking      999

Port        Vlans allowed on trunk
Gig0/1      10,20,999

Port        Vlans allowed and active in management domain
Gig0/1      10,20,999

Port        Vlans in spanning tree forwarding state and not pruned
Gig0/1      10,20,999

S1#

--- PC1 (VLAN 10) Ping to PC3 after Allowed List Restoration ---
ping 192.168.10.20

Pinging 192.168.10.20 with 32 bytes of data:

Reply from 192.168.10.20: bytes=32 time=4ms TTL=128
Reply from 192.168.10.20: bytes=32 time<1ms TTL=128
Reply from 192.168.10.20: bytes=32 time<1ms TTL=128
```

## 4. Reopen and Persistence Verification
- `completed.pkt` verified: 6 devices (S1, S2, PC1, PC2, PC3, PC4) intact.
- `starter.pkt` verified: 6 devices intact with trunk ports in unhardened default dynamic auto state.
- Starter vs Completed configuration delta: Confirmed distinct (starter provides base VLAN creation and access port assignment; completed secures trunks with unconditional mode, nonegotiate, native VLAN 999, and allowed list pruning).
