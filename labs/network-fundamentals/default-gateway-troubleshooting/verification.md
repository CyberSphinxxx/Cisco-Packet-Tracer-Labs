# Verification and Diagnostic Guide: PTL-0014

**Lab ID:** `PTL-0014`  
**Lab Title:** Default Gateway Operation and Troubleshooting  
**Category:** `network-fundamentals`  
**Simulator Verification:** `tested_pass`  

This document details the test procedures, expected outputs, and diagnostic steps required to verify the complete operation of the default gateway and systematically troubleshoot common host and router failure modes.

---

## 1. Physical and Logical Topology Verification

Confirm that all interfaces are active (green link indicators) and correctly assigned:

| Device | Interface | Expected IP | Expected State | Cable Type |
|---|---|---|---|---|
| **R1** | `GigabitEthernet0/0/0` | `192.168.10.1` | Up / Up | Straight-Through to S1 Gi0/1 |
| **R1** | `GigabitEthernet0/0/1` | `192.168.20.1` | Up / Up | Straight-Through to S2 Gi0/1 |
| **S1** | `Vlan1` | `192.168.10.2` | Up / Up | Default Gateway `192.168.10.1` |
| **S2** | `Vlan1` | `192.168.20.2` | Up / Up | Default Gateway `192.168.20.1` |
| **PC1** | `FastEthernet0` | `192.168.10.10` | Connected | Straight-Through to S1 Fa0/1 |
| **PC2** | `FastEthernet0` | `192.168.10.11` | Connected | Straight-Through to S1 Fa0/2 |
| **PC-Remote** | `FastEthernet0` | `192.168.20.10` | Connected | Straight-Through to S2 Fa0/1 |

---

## 2. Command-by-Command Verification Matrix

### Test 1: Router Interface Status and Directly Connected Subnets
Execute on `R1`:
```text
R1# show ip interface brief
Interface              IP-Address      OK? Method Status                Protocol 
GigabitEthernet0/0/0   192.168.10.1    YES manual up                    up 
GigabitEthernet0/0/1   192.168.20.1    YES manual up                    up
```

Verify the routing table:
```text
R1# show ip route
Gateway of last resort is not set

     192.168.10.0/24 is variably subnetted, 2 subnets, 2 masks
C       192.168.10.0/24 is directly connected, GigabitEthernet0/0/0
L       192.168.10.1/32 is directly connected, GigabitEthernet0/0/0
     192.168.20.0/24 is variably subnetted, 2 subnets, 2 masks
C       192.168.20.0/24 is directly connected, GigabitEthernet0/0/1
L       192.168.20.1/32 is directly connected, GigabitEthernet0/0/1
```

### Test 2: Local Intra-Subnet Communication
From `PC1`, ping `PC2`:
```text
C:\>ping 192.168.10.11
Reply from 192.168.10.11: bytes=32 time<1ms TTL=128
```
- **Success Criteria:** 0% packet loss.
- **Diagnostic Note:** TTL=128 indicates that the packet remained inside the local Layer 2 broadcast domain and was forwarded directly by switch `S1` without traversing a router hop.

### Test 3: Router Default Gateway Ping
From `PC1`, ping the local gateway interface:
```text
C:\>ping 192.168.10.1
Reply from 192.168.10.1: bytes=32 time<1ms TTL=255
```
- **Success Criteria:** 0% packet loss.
- **Diagnostic Note:** TTL=255 confirms the packet was terminated directly by Cisco IOS on router `R1`.

### Test 4: Remote Routed Inter-Subnet Communication
From `PC1`, ping `PC-Remote`:
```text
C:\>ping 192.168.20.10
Reply from 192.168.20.10: bytes=32 time<1ms TTL=127
```
- **Success Criteria:** 0% packet loss.
- **Diagnostic Note:** TTL=127 proves that `R1` successfully routed the packet across the network boundary, decrementing the host's initial TTL (128) by 1.

### Test 5: Host ARP Resolution Analysis
From `PC1`, inspect the resolved ARP table:
```text
C:\>arp -a
  Internet Address      Physical Address      Type
  192.168.10.1          0001.c748.1701        dynamic
  192.168.10.11         00e0.b0c2.31cb        dynamic
```
- **Analysis:**
  - `192.168.10.11` resolves to the MAC address of `PC2`.
  - `192.168.10.1` resolves to the MAC address of `R1` `Gi0/0/0`.
  - Remote host `192.168.20.10` is absent from the ARP cache, proving that end-hosts never resolve MAC addresses across routed boundaries.

---

## 3. Systematic Fault Injection and Isolation

### Fault Scenario A: Missing Default Gateway
1. Set PC1 default gateway to `0.0.0.0`.
2. Ping local peer `192.168.10.11`: **PASS** (Local switching works).
3. Ping remote host `192.168.20.10`: **FAIL** (Request timed out / Destination host unreachable).
4. **Resolution:** Restore gateway to `192.168.10.1`.

### Fault Scenario B: Incorrect Default Gateway IP
1. Set PC1 default gateway to unassigned IP `192.168.10.254`.
2. Ping remote host `192.168.20.10`: **FAIL** (Request timed out waiting for ARP reply for `.254`).
3. **Resolution:** Correct gateway IP to `192.168.10.1`.

### Fault Scenario C: Gateway Interface Administratively Down
1. On `R1`, enter `interface GigabitEthernet0/0/0` and execute `shutdown`.
2. Ping local peer `192.168.10.11` from PC1: **PASS** (Layer 2 frame switching on S1 is completely unaffected by router state).
3. Ping remote host `192.168.20.10`: **FAIL**.
4. **Resolution:** On `R1`, execute `interface GigabitEthernet0/0/0` followed by `no shutdown`.

---

## 4. Deliverable File Verification

Ensure all assets exist within the repository:
- `assets/starter.pkt`: Unconfigured gateway on PC1.
- `assets/completed.pkt`: Correct gateway configured on PC1.
- `assets/topology.png`: Visual diagram of network topology.
- `configs/R1.txt`: Router baseline configuration.
- `configs/S1.txt`: Switch 1 management baseline.
- `configs/S2.txt`: Switch 2 management baseline.
