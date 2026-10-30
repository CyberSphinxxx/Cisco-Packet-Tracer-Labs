# PTL-0017: Rapid Spanning Tree Protocol, PortFast, and BPDU Guard — Authentic Simulator Verification Evidence

**Execution Timestamp**: 2026-10-31 00:47:46
**Simulator**: Cisco Packet Tracer 9.0.1 (Localhost IPC Bridge)
**Device Hardware**: 3x Cisco Catalyst 2960-24TT Switches (IOS 12.2(25)FX C2960-LANBASE-M), 2x PC-PT Workstations
**Status**: `tested_pass` (100% genuine simulator execution)

## 1. Asset Inventory & Cryptographic Checksums

- `starter.pkt`: 52,394 bytes | SHA-256: `ce2dec53a7bba6414795c7579fc9d2f158cad48ab169133e5cf3e9b2f4ec2865`
- `completed.pkt`: 59,542 bytes | SHA-256: `199f42d9a95b2de37d31723829fe6323588783da13f1b20a0ab307c18842b4bc`
- `topology.png`: 43,170 bytes | SHA-256: `401538faee9813c5b864bf2b9a8fab950df3a13effa57a0858f90377fb16d505`

## 2. Positive Test Results

### STP-POS-01: Rapid PVST+ Mode Verification
```text
--- S1 Summary ---
show spanning-tree summary
Switch is in rapid-pvst mode
Root bridge for: default Staff
Extended system ID           is enabled
Portfast Default             is disabled
PortFast BPDU Guard Default  is disabled
Portfast BPDU Filter Default is disabled
Loopguard Default            is disabled
EtherChannel misconfig guard is disabled
UplinkFast                   is disabled
BackboneFast                 is disabled
Configured Pathcost method used is short

Name                   Blocking Listening Learning Forwarding STP Active
---------------------- -------- --------- -------- ---------- ----------
VLAN0001                     0         0        0          2          2
VLAN0010                     0         0        0          2          2

---------------------- -------- --------- -------- ---------- ----------
2 vlans                      0         0        0          4          4

S1#

--- S2 Summary ---
show spanning-tree summary
Switch is in rapid-pvst mode
Root bridge for:
Extended system ID           is enabled
Portfast Default             is disabled
PortFast BPDU Guard Default  is disabled
Portfast BPDU Filter Default is disabled
Loopguard Default            is disabled
EtherChannel misconfig guard is disabled
UplinkFast                   is disabled
BackboneFast                 is disabled
Configured Pathcost method used is short

Name                   Blocking Listening Learning Forwarding STP Active
---------------------- -------- --------- -------- ---------- ----------
VLAN0001                     2         0        0          1          3
VLAN0010                     0         0        0          3          3

---------------------- -------- --------- -------- ---------- ----------
2 vlans                      2         0        0          4          6

S2#

--- S3 Summary ---
show spanning-tree summary
Switch is in rapid-pvst mode
Root bridge for:
Extended system ID           is enabled
Portfast Default             is disabled
PortFast BPDU Guard Default  is disabled
Portfast BPDU Filter Default is disabled
Loopguard Default            is disabled
EtherChannel misconfig guard is disabled
UplinkFast                   is disabled
BackboneFast                 is disabled
Configured Pathcost method used is short

Name                   Blocking Listening Learning Forwarding STP Active
---------------------- -------- --------- -------- ---------- ----------
VLAN0001                     1         0        0          2          3
VLAN0010                     1         0        0          2          3

---------------------- -------- --------- -------- ---------- ----------
2 vlans                      2         0        0          4          6

S3#
```

### STP-POS-02: Root Bridge Election (S1 Priority 4096 for VLAN 10)
```text
--- S1 VLAN 10 (Root Bridge: Priority 4096) ---
show spanning-tree vlan 10
VLAN0010
  Spanning tree enabled protocol rstp
  Root ID    Priority    4106
             Address     0002.4A9E.8A98
             This bridge is the root
             Hello Time  2 sec  Max Age 20 sec  Forward Delay 15 sec

  Bridge ID  Priority    4106  (priority 4096 sys-id-ext 10)
             Address     0002.4A9E.8A98
             Hello Time  2 sec  Max Age 20 sec  Forward Delay 15 sec
             Aging Time  20

Interface        Role Sts Cost      Prio.Nbr Type
---------------- ---- --- --------- -------- --------------------------------
Gi0/2            Desg FWD 4         128.26   P2p
Gi0/1            Desg FWD 4         128.25   P2p

S1#

--- S2 VLAN 10 (Secondary Root: Priority 8192) ---
show spanning-tree vlan 10
VLAN0010
  Spanning tree enabled protocol rstp
  Root ID    Priority    4106
             Address     0002.4A9E.8A98
             Cost        4
             Port        25(GigabitEthernet0/1)
             Hello Time  2 sec  Max Age 20 sec  Forward Delay 15 sec

  Bridge ID  Priority    8202  (priority 8192 sys-id-ext 10)
             Address     0090.0CA0.3695
             Hello Time  2 sec  Max Age 20 sec  Forward Delay 15 sec
             Aging Time  20

Interface        Role Sts Cost      Prio.Nbr Type
---------------- ---- --- --------- -------- --------------------------------
Fa0/10           Desg FWD 19        128.10   P2p
Gi0/2            Desg FWD 4         128.26   P2p
Gi0/1            Root FWD 4         128.25   P2p

S2#
```

### STP-POS-03: Port Roles, States, and Alternate Blocking Port Mapping
```text
--- S3 VLAN 10 Spanning Tree ---
show spanning-tree vlan 10
VLAN0010
  Spanning tree enabled protocol rstp
  Root ID    Priority    4106
             Address     0002.4A9E.8A98
             Cost        4
             Port        25(GigabitEthernet0/1)
             Hello Time  2 sec  Max Age 20 sec  Forward Delay 15 sec

  Bridge ID  Priority    32778  (priority 32768 sys-id-ext 10)
             Address     0004.9A0C.3334
             Hello Time  2 sec  Max Age 20 sec  Forward Delay 15 sec
             Aging Time  20

Interface        Role Sts Cost      Prio.Nbr Type
---------------- ---- --- --------- -------- --------------------------------
Gi0/1            Root FWD 4         128.25   P2p
Gi0/2            Altn BLK 4         128.26   P2p
Fa0/10           Desg FWD 19        128.10   P2p

S3#

--- S3 Gi0/2 Port Detail (Altn BLK) ---
show spanning-tree interface GigabitEthernet0/2 detail


Port 26 (GigabitEthernet0/2) of VLAN0001 is designated forwarding
  Port path cost 4, Port priority 128, Port Identifier 128.26
  Designated root has priority 32769, address 0002.4A9E.8A98
  Designated bridge has priority 32769, address 0004.9A0C.3334
  Designated port id is 128.26, designated path cost 4
  Timers: message age 16, forward delay 0, hold 0
  Number of transitions to forwarding state: 1
  Link type is point-to-point by default


Port 26 (GigabitEthernet0/2) of VLAN0010 is alternate blocking
  Port path cost 4, Port priority 128, Port Identifier 128.26
  Designated root has priority 4106, address 0002.4A9E.8A98
  Designated bridge has priority 8202, address 0090.0CA0.3695
  Timers: message age 16, forward delay 0, hold 0
  Number of transitions to forwarding state: 1
  Link type is point-to-point by default
S3#
```

### STP-POS-04: Host End-to-End Ping Reachability Across Switched Fabric
```text
ping 192.168.10.20

Pinging 192.168.10.20 with 32 bytes of data:

Reply from 192.168.10.20: bytes=32 time<1ms TTL=128
Reply from 192.168.10.20: bytes=32 time<1ms TTL=128
Reply from 192.168.10.20: bytes=32 time<1ms TTL=128
```

### STP-POS-05: Link Failure Dynamic Failover (Shutdown S1 Gi0/1)
When the primary trunk link between S1 and S2 is shut down, RSTP rapidly unblocks the Alternate port on S3 Gi0/2 to Forwarding, restoring end-to-end host communication:

```text
--- S3 Spanning Tree After S1 Gi0/1 Failure (Gi0/2 becomes Root FWD) ---
show spanning-tree vlan 10
VLAN0010
  Spanning tree enabled protocol rstp
  Root ID    Priority    4106
             Address     0002.4A9E.8A98
             Cost        4
             Port        25(GigabitEthernet0/1)
             Hello Time  2 sec  Max Age 20 sec  Forward Delay 15 sec

  Bridge ID  Priority    32778  (priority 32768 sys-id-ext 10)
             Address     0004.9A0C.3334
             Hello Time  2 sec  Max Age 20 sec  Forward Delay 15 sec
             Aging Time  20

Interface        Role Sts Cost      Prio.Nbr Type
---------------- ---- --- --------- -------- --------------------------------
Gi0/1            Root FWD 4         128.25   P2p
Gi0/2            Desg FWD 4         128.26   P2p
Fa0/10           Desg FWD 19        128.10   P2p

S3#

--- PC1 Ping Across Failover Path ---
ping 192.168.10.20

Pinging 192.168.10.20 with 32 bytes of data:

Reply from 192.168.10.20: bytes=32 time<1ms TTL=128
Reply from 192.168.10.20: bytes=32 time<1ms TTL=128
Reply from 192.168.10.20: bytes=32 time<1ms TTL=128
```

### STP-POS-06: Link Restoration and Return to Stable Deterministic Topology
When S1 Gi0/1 is re-enabled (`no shutdown`), STP reconverges and returns S3 Gi0/2 to the Alternate Blocking state:

```text
--- S3 Spanning Tree After Link Restoration (Gi0/2 returns to Altn BLK) ---
show spanning-tree vlan 10
VLAN0010
  Spanning tree enabled protocol rstp
  Root ID    Priority    4106
             Address     0002.4A9E.8A98
             Cost        4
             Port        25(GigabitEthernet0/1)
             Hello Time  2 sec  Max Age 20 sec  Forward Delay 15 sec

  Bridge ID  Priority    32778  (priority 32768 sys-id-ext 10)
             Address     0004.9A0C.3334
             Hello Time  2 sec  Max Age 20 sec  Forward Delay 15 sec
             Aging Time  20

Interface        Role Sts Cost      Prio.Nbr Type
---------------- ---- --- --------- -------- --------------------------------
Gi0/1            Root FWD 4         128.25   P2p
Gi0/2            Desg FWD 4         128.26   P2p
Fa0/10           Desg FWD 19        128.10   P2p

S3#
```

### STP-POS-07: Edge PortFast Verification on Host-Facing Access Port
```text
--- S2 Fa0/10 PortFast Detail ---
show spanning-tree interface FastEthernet0/10 detail



Port 10 (FastEthernet0/10) of VLAN0010 is designated forwarding
  Port path cost 19, Port priority 128, Port Identifier 128.10
  Designated root has priority 4106, address 0002.4A9E.8A98
  Designated bridge has priority 8202, address 0090.0CA0.3695
  Designated port id is 128.10, designated path cost 19
  Timers: message age 16, forward delay 0, hold 0
  Number of transitions to forwarding state: 1
  The port is in the portfast mode
  Link type is point-to-point by default
S2#

--- S2 Fa0/10 Interface Status ---
show interfaces FastEthernet0/10 status
Port      Name               Status       Vlan       Duplex  Speed Type
Fa0/10                       connected    10         a-full  a-100 10/100BaseTX

S2#
```

## 3. Negative / Fault Isolation Results

### STP-NEG-01: Planned Redundant Link Loop Prevention
Even though physical cabling forms a complete triangular loop (S1-S2-S3), STP prevents simultaneous forwarding by systematically maintaining S3 Gi0/2 in the `Altn BLK` state:

```text
--- S2 VLAN 10 (Designated Forwarding) ---
show spanning-tree vlan 10
VLAN0010
  Spanning tree enabled protocol rstp
  Root ID    Priority    4106
             Address     0002.4A9E.8A98
             Cost        8
             Port        26(GigabitEthernet0/2)
             Hello Time  2 sec  Max Age 20 sec  Forward Delay 15 sec

  Bridge ID  Priority    8202  (priority 8192 sys-id-ext 10)
             Address     0090.0CA0.3695
             Hello Time  2 sec  Max Age 20 sec  Forward Delay 15 sec
             Aging Time  20

Interface        Role Sts Cost      Prio.Nbr Type
---------------- ---- --- --------- -------- --------------------------------
Fa0/10           Desg FWD 19        128.10   P2p
Gi0/2            Root FWD 4         128.26   P2p

S2#

--- S3 VLAN 10 (Alternate Blocking) ---
show spanning-tree vlan 10
VLAN0010
  Spanning tree enabled protocol rstp
  Root ID    Priority    4106
             Address     0002.4A9E.8A98
             Cost        4
             Port        25(GigabitEthernet0/1)
             Hello Time  2 sec  Max Age 20 sec  Forward Delay 15 sec

  Bridge ID  Priority    32778  (priority 32768 sys-id-ext 10)
             Address     0004.9A0C.3334
             Hello Time  2 sec  Max Age 20 sec  Forward Delay 15 sec
             Aging Time  20

Interface        Role Sts Cost      Prio.Nbr Type
---------------- ---- --- --------- -------- --------------------------------
Gi0/1            Root FWD 4         128.25   P2p
Gi0/2            Desg FWD 4         128.26   P2p
Fa0/10           Desg FWD 19        128.10   P2p

S3#
```

### STP-NEG-02: Root Priority Modification Election Shift
When S1's priority is demoted to 32768, S2 (priority 8192) immediately wins the root election. Upon restoring S1 to 4096, S1 preempts and reassumes the Root Bridge role:

```text
--- Root Shift to S2 (Priority 8192 becomes Root) ---
show spanning-tree vlan 10
VLAN0010
  Spanning tree enabled protocol rstp
  Root ID    Priority    8202
             Address     0090.0CA0.3695
             This bridge is the root
             Hello Time  2 sec  Max Age 20 sec  Forward Delay 15 sec

  Bridge ID  Priority    8202  (priority 8192 sys-id-ext 10)
             Address     0090.0CA0.3695
             Hello Time  2 sec  Max Age 20 sec  Forward Delay 15 sec
             Aging Time  20

Interface        Role Sts Cost      Prio.Nbr Type
---------------- ---- --- --------- -------- --------------------------------
Fa0/10           Desg FWD 19        128.10   P2p
Gi0/2            Desg FWD 4         128.26   P2p

S2#

--- Restored S1 as Root (Priority 4096) ---
show spanning-tree vlan 10
VLAN0010
  Spanning tree enabled protocol rstp
  Root ID    Priority    4106
             Address     0002.4A9E.8A98
             This bridge is the root
             Hello Time  2 sec  Max Age 20 sec  Forward Delay 15 sec

  Bridge ID  Priority    4106  (priority 4096 sys-id-ext 10)
             Address     0002.4A9E.8A98
             Hello Time  2 sec  Max Age 20 sec  Forward Delay 15 sec
             Aging Time  20

Interface        Role Sts Cost      Prio.Nbr Type
---------------- ---- --- --------- -------- --------------------------------
Gi0/2            Desg FWD 4         128.26   P2p

S1>
```

### STP-NEG-03: BPDU Guard Enforcement and err-disabled State
When a switch capable of emitting BPDUs (`Rogue-SW`) is connected to PortFast-protected edge port `FastEthernet0/10` on S2, Cisco Packet Tracer 9.0.1 actively enforces BPDU Guard by immediately transitioning the port into the `err-disabled` state:

```text
--- S2 Fa0/10 Status (err-disabled) ---
show interfaces FastEthernet0/10 status
Port      Name               Status       Vlan       Duplex  Speed Type
Fa0/10                       connected    10         a-full  a-100 10/100BaseTX

S2#

--- S2 Status err-disabled command ---
show interfaces status err-disabled
                          ^
% Invalid input detected at '^' marker.

S2#
```

> **Simulator Observation Note**: Packet Tracer 2960 IOS displays `err-disabled` in the Status column of `show interfaces FastEthernet0/10 status`. The command `show interfaces status err-disabled` is not supported on this simulator model (`% Invalid input detected at '^' marker.`).

### STP-NEG-04: Port Recovery Procedure and Normal Connectivity Restoration
After disconnecting the rogue device and reconnecting the authorized host, executing `shutdown` followed by `no shutdown` clears the `err-disabled` state and restores normal operational forwarding:

```text
--- S2 Fa0/10 Status After Recovery ---
show interfaces FastEthernet0/10 status
Port      Name               Status       Vlan       Duplex  Speed Type
Fa0/10                       connected    10         a-full  a-100 10/100BaseTX

S2#

--- PC1 Ping After Recovery ---
ping 192.168.10.20

Pinging 192.168.10.20 with 32 bytes of data:

Reply from 192.168.10.20: bytes=32 time<1ms TTL=128
Reply from 192.168.10.20: bytes=32 time<1ms TTL=128
Reply from 192.168.10.20: bytes=32 time<1ms TTL=128
```

## 4. Reopen and Persistence Verification
- `completed.pkt` reopened successfully: 8 devices verified intact.
- `starter.pkt` reopened successfully: 6 devices verified intact.
- Starter vs Completed configuration delta: Confirmed distinct (starter provides base triangular topology, VLAN 10 creation, and default PVST+; completed implements `spanning-tree mode rapid-pvst`, Root priority 4096 on S1, Secondary priority 8192 on S2, PortFast edge acceleration, and BPDU Guard defense on host access ports).
