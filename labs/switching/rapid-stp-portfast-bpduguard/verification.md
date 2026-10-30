# Verification and Diagnostic Guide: PTL-0017

**Lab ID:** `PTL-0017`
**Lab Title:** Rapid Spanning Tree Protocol, PortFast, and BPDU Guard
**Category:** `switching`
**Simulator Verification:** `tested_pass`

This document details the test procedures, expected outputs, and diagnostic steps required to verify Rapid PVST+, Root Bridge election, PortFast, BPDU Guard, and rapid failover convergence in Cisco Packet Tracer.

---

## 1. Physical and Logical Topology Verification

Confirm that all interfaces match the intended cabling and operational state:

| Device | Interface | Expected Mode | STP Role | STP State | Connected To |
|---|---|---|---|---|---|
| **S1** | `GigabitEthernet0/1` | 802.1Q Trunk | Designated | Forwarding (FWD) | S2 `Gi0/1` |
| **S1** | `GigabitEthernet0/2` | 802.1Q Trunk | Designated | Forwarding (FWD) | S3 `Gi0/1` |
| **S2** | `GigabitEthernet0/1` | 802.1Q Trunk | Root | Forwarding (FWD) | S1 `Gi0/1` |
| **S2** | `GigabitEthernet0/2` | 802.1Q Trunk | Designated | Forwarding (FWD) | S3 `Gi0/2` |
| **S2** | `FastEthernet0/10` | Access VLAN 10 (PortFast) | Designated | Forwarding (FWD) | PC1 `FastEthernet0` |
| **S3** | `GigabitEthernet0/1` | 802.1Q Trunk | Root | Forwarding (FWD) | S1 `Gi0/2` |
| **S3** | `GigabitEthernet0/2` | 802.1Q Trunk | Alternate | Blocking (BLK) | S2 `Gi0/2` |
| **S3** | `FastEthernet0/10` | Access VLAN 10 (PortFast) | Designated | Forwarding (FWD) | PC2 `FastEthernet0` |
| **PC1** | `FastEthernet0` | `192.168.10.10/24` | End Host | Connected | S2 `Fa0/10` |
| **PC2** | `FastEthernet0` | `192.168.10.20/24` | End Host | Connected | S3 `Fa0/10` |

---

## 2. Command-by-Command Verification Matrix

### Test 1: S1 Root Bridge Priority and Role Verification
Execute on `S1`:

```text
S1# show spanning-tree vlan 10
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
Gi0/1            Desg FWD 4         128.25   P2p
Gi0/2            Desg FWD 4         128.26   P2p
```

*Expected Result:* Priority reflects configured `4096` (+ sys-id-ext 10 = `4106`); output confirms `This bridge is the root`; both trunk interfaces are `Desg FWD`.

---

### Test 2: Rapid PVST+ Summary & Mode Verification
Execute on `S1`, `S2`, and `S3`:

```text
S1# show spanning-tree summary
Switch is in rapid-pvst mode
Root bridge for: default Staff
Extended system ID           is enabled
...
```

*Expected Result:* `Switch is in rapid-pvst mode` across all three switches.

---

### Test 3: S3 Alternate Blocking Port Role
Execute on `S3`:

```text
S3# show spanning-tree vlan 10
Interface        Role Sts Cost      Prio.Nbr Type
---------------- ---- --- --------- -------- --------------------------------
Fa0/10           Desg FWD 19        128.10   P2p
Gi0/1            Root FWD 4         128.25   P2p
Gi0/2            Altn BLK 4         128.26   P2p
```

*Expected Result:* `S3` selects `Gi0/1` as its Root Port (Cost 4 to `S1`) and places `Gi0/2` into `Altn BLK` (Alternate Blocking) to break the Layer 2 loop.

Inspect port details on `S3`:

```text
S3# show spanning-tree interface GigabitEthernet0/2 detail
Port 26 (GigabitEthernet0/2) of VLAN0010 is alternate blocking
  Port path cost 4, Port priority 128, Port Identifier 128.26
  Designated root has priority 4106, address 0002.4A9E.8A98
  Designated bridge has priority 8202, address 0090.0CA0.3695
  Timers: message age 16, forward delay 0, hold 0
  Number of transitions to forwarding state: 1
  Link type is point-to-point by default
```

---

### Test 4: End-to-End Workstation Ping
Execute on `PC1`:

```text
C:\> ping 192.168.10.20
Pinging 192.168.10.20 with 32 bytes of data:
Reply from 192.168.10.20: bytes=32 time<1ms TTL=128
Reply from 192.168.10.20: bytes=32 time<1ms TTL=128
Reply from 192.168.10.20: bytes=32 time<1ms TTL=128
Reply from 192.168.10.20: bytes=32 time<1ms TTL=128

Ping statistics for 192.168.10.20:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)
```

*Expected Result:* 100% reachability (0% loss) between workstations across the switched fabric.

---

### Test 5: Dynamic Failover on Primary Trunk Link Failure
Simulate a trunk link failure between `S1` and `S2` by shutting down `Gi0/1` on `S1`:

```text
S1(config)# interface GigabitEthernet0/1
S1(config-if)# shutdown
```

Rapidly, `S3` transitions alternate port `Gi0/2` directly into Forwarding via proposal/agreement negotiation. Re-testing ping from `PC1` confirms continuous connectivity:

```text
C:\> ping 192.168.10.20
Reply from 192.168.10.20: bytes=32 time<1ms TTL=128
Reply from 192.168.10.20: bytes=32 time<1ms TTL=128
Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)
```

---

### Test 6: Primary Trunk Restoration
Execute on `S1`:

```text
S1(config)# interface GigabitEthernet0/1
S1(config-if)# no shutdown
```

*Expected Result:* RSTP reconverges deterministically; `S3 Gi0/2` returns to `Altn BLK`.

---

### Test 7: PortFast and BPDU Guard Verification
Execute on `S2`:

```text
S2# show spanning-tree interface FastEthernet0/10 detail
Port 10 (FastEthernet0/10) of VLAN0010 is designated forwarding
  Port path cost 19, Port priority 128, Port Identifier 128.10
  Designated root has priority 4106, address 0002.4A9E.8A98
  The port is in the portfast mode
  Link type is point-to-point by default
```

*Expected Result:* `The port is in the portfast mode` is displayed.

---

### Test 8: BPDU Guard Violation and err-disabled Recovery
Connect a switch emitting BPDUs to `Fa0/10` on `S2`. Verify the transition to `err-disabled`:

```text
S2# show interfaces FastEthernet0/10 status
Port      Name               Status       Vlan       Duplex  Speed Type
Fa0/10                       err-disabled 10         auto    auto  10/100BaseTX
```

Disconnect the rogue switch, reconnect `PC1`, and recover the interface:

```text
S2(config)# interface FastEthernet0/10
S2(config-if)# shutdown
S2(config-if)# no shutdown
```

*Expected Result:* `Fa0/10` returns to `connected` and `PC1` ping to `PC2` succeeds.
