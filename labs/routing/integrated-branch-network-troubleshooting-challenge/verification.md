# Verification Guide: PTL-0055 — Integrated Branch Network Troubleshooting Challenge

## Overview
This verification guide provides detailed instructions and verification criteria for **PTL-0055: Integrated Branch Network Troubleshooting Challenge**. Learners isolate and resolve multi-domain branch office faults spanning VLAN trunking, DHCP relay, static routing, and access control lists.

## Device Role and Interface Reference
| Device | Interface | IPv4 Address / Prefix | Default Gateway | Function |
|---|---|---|---|---|
| **HQ-R1** | `Gi0/0` | `10.0.1.1/24` | N/A | Server LAN Gateway |
| **HQ-R1** | `Gi0/1` | `10.1.12.1/30` | N/A | WAN Transit Interface |
| **Branch-R2** | `Gi0/1` | `10.1.12.2/30` | N/A | WAN Transit Interface |
| **Branch-R2** | `Gi0/0.10` | `192.168.10.1/24` | N/A | VLAN 10 Gateway & Relay |
| **Branch-R2** | `Gi0/0.20` | `192.168.20.1/24` | N/A | VLAN 20 Gateway |
| **Branch-SW1** | `VLAN 1` | `192.168.10.2/24` | `192.168.10.1` | Management SVI |
| **HQ-Server** | `Fa0` | `10.0.1.100/24` | `10.0.1.1` | Corporate Server |
| **Staff-PC1** | `Fa0` | DHCP (`192.168.10.x`) | `192.168.10.1` | Staff Host |
| **Eng-PC2** | `Fa0` | `192.168.20.10/24` | `192.168.20.1` | Engineering Host |

---

## Test Execution Matrix

### Positive Verification (Completed State: `completed.pkt`)

| Test ID | Objective | Test Action | Expected Output | Criteria |
|---|---|---|---|:---:|
| **POS-01** | Dynamic DHCP Allocation | On `Staff-PC1`, issue `ipconfig /renew` | IPv4 address assigned in `192.168.10.0/24` with GW `192.168.10.1` | PASS |
| **POS-02** | Local Gateway Reachability | From `Staff-PC1`, ping `192.168.10.1` | 4/4 replies received, 0% loss | PASS |
| **POS-03** | Engineering Gateway Reachability | From `Eng-PC2`, ping `192.168.20.1` | 4/4 replies received, 0% loss | PASS |
| **POS-04** | Inter-VLAN Routing | From `Eng-PC2`, ping `Staff-PC1` (`192.168.10.x`) | 4/4 replies received, 0% loss, TTL=127 | PASS |
| **POS-05** | Engineering to HQ Server | From `Eng-PC2`, ping `10.0.1.100` | 4/4 replies received, 0% loss, TTL=126 | PASS |
| **POS-06** | Staff to HQ Server | From `Staff-PC1`, ping `10.0.1.100` | 4/4 replies received, 0% loss, TTL=126 | PASS |

### Starter Fault Verification (Starter State: `starter.pkt`)

| Test ID | Objective | Test Action | Expected Starter Fault | Criteria |
|---|---|---|---|:---:|
| **NEG-01** | VLAN 20 Pruned on Trunk | From `Eng-PC2`, ping `192.168.20.1` | Request timed out (100% packet loss) | PASS |
| **NEG-02** | Missing DHCP Relay | On `Staff-PC1`, issue `ipconfig` | IP address is `0.0.0.0` or `169.254.x.x` | PASS |
| **NEG-03** | Mispointed HQ Static Route | At `HQ-R1#`, issue `show ip route static` | Route to `192.168.0.0/16` points to invalid `10.1.12.6` | PASS |
| **NEG-04** | Security ACL ICMP Deny | At `Branch-R2#`, issue `show access-lists 101` | Explicit deny statement: `deny icmp any host 10.0.1.100` | PASS |

---

## Detailed Step-by-Step Remediation Procedure

1. **Step 1: Check Trunk Allowed VLANs on Branch-SW1**
   - Issue `show interfaces trunk` on `Branch-SW1`.
   - Observe that `Vlans allowed on trunk` lists only `10`.
   - Remediate with:
     ```text
     Branch-SW1(config)# interface GigabitEthernet0/1
     Branch-SW1(config-if)# switchport trunk allowed vlan add 20
     ```

2. **Step 2: Restore DHCP Relay on Branch-R2**
   - Issue `show running-config interface GigabitEthernet0/0.10` on `Branch-R2`.
   - Observe absence of `ip helper-address`.
   - Remediate with:
     ```text
     Branch-R2(config)# interface GigabitEthernet0/0.10
     Branch-R2(config-subif)# ip helper-address 10.0.1.1
     ```

3. **Step 3: Fix HQ-R1 Static Return Routes**
   - Issue `show ip route static` on `HQ-R1`.
   - Observe misconfigured next-hop `10.1.12.6`.
   - Remediate with:
     ```text
     HQ-R1(config)# no ip route 192.168.0.0 255.255.0.0 10.1.12.6
     HQ-R1(config)# ip route 192.168.10.0 255.255.255.0 10.1.12.2
     HQ-R1(config)# ip route 192.168.20.0 255.255.255.0 10.1.12.2
     ```

4. **Step 4: Update Edge ACL on Branch-R2**
   - Issue `show access-lists` on `Branch-R2`.
   - Observe `10 deny icmp any host 10.0.1.100`.
   - Remediate with:
     ```text
     Branch-R2(config)# no access-list 101
     Branch-R2(config)# access-list 101 permit ip any any
     ```

5. **Step 5: Verify End-to-End Operation**
   - Execute POS-01 through POS-06 to ensure 100% connectivity.

