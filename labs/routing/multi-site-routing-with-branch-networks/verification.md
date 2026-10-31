# Verification and Acceptance Matrix — PTL-0048

**Lab ID:** PTL-0048  
**Title:** Multi-Site Routing with Branch Networks  
**Status:** `TESTED_PASS` (Verified live in Cisco Packet Tracer 9.0.1 via MCP loopback bridge automation)

---

## 1. Packet Tracer Topology Construction Manifest

To construct or manually verify this topology in Cisco Packet Tracer:

### Device Inventory
| Device Role | PT Device Model | Display Name | Modules / Slots |
|---|---|---|---|
| Headquarters Hub Router | Cisco 4331 ISR | R-HQ | 3 Onboard GE ports (`Gi0/0/0`, `Gi0/0/1`, `Gi0/0/2`) |
| Branch 1 Spoke Router | Cisco 4331 ISR | R-BR1 | 3 Onboard GE ports (`Gi0/0/0`, `Gi0/0/1`, `Gi0/0/2`) |
| Branch 2 Spoke Router | Cisco 4331 ISR | R-BR2 | 3 Onboard GE ports (`Gi0/0/0`, `Gi0/0/1`, `Gi0/0/2`) |
| Headquarters Switch | Cisco Catalyst 2960-24TT | SW-HQ | 24 FastEthernet + 2 GigabitEthernet ports |
| Branch 1 Switch | Cisco Catalyst 2960-24TT | SW-BR1 | 24 FastEthernet + 2 GigabitEthernet ports |
| Branch 2 Switch | Cisco Catalyst 2960-24TT | SW-BR2 | 24 FastEthernet + 2 GigabitEthernet ports |
| Headquarters Server | Server-PT | HQ-Server | FastEthernet0 (`10.10.0.10/24`, gw `10.10.0.1`) |
| Branch 1 PC | PC-PT | PC-BR1 | FastEthernet0 (`10.20.0.10/24`, gw `10.20.0.1`) |
| Branch 2 PC | PC-PT | PC-BR2 | FastEthernet0 (`10.30.0.10/24`, gw `10.30.0.1`) |

### Physical Cabling Matrix
| Link ID | Source Device | Source Port | Destination Device | Destination Port | Cable Type |
|---|---|---|---|---|---|
| L-01 | R-HQ | GigabitEthernet0/0/1 | R-BR1 | GigabitEthernet0/0/1 | Copper Crossover |
| L-02 | R-HQ | GigabitEthernet0/0/2 | R-BR2 | GigabitEthernet0/0/2 | Copper Crossover |
| L-03 | R-HQ | GigabitEthernet0/0/0 | SW-HQ | GigabitEthernet0/1 | Copper Straight-Through |
| L-04 | R-BR1 | GigabitEthernet0/0/0 | SW-BR1 | GigabitEthernet0/1 | Copper Straight-Through |
| L-05 | R-BR2 | GigabitEthernet0/0/0 | SW-BR2 | GigabitEthernet0/1 | Copper Straight-Through |
| L-06 | SW-HQ | FastEthernet0/1 | HQ-Server | FastEthernet0 | Copper Straight-Through |
| L-07 | SW-BR1 | FastEthernet0/1 | PC-BR1 | FastEthernet0 | Copper Straight-Through |
| L-08 | SW-BR2 | FastEthernet0/1 | PC-BR2 | FastEthernet0 | Copper Straight-Through |

---

## 2. Positive Verification Test Matrix

| Test ID | Objective | Command / Procedure | Expected Result | Pass Criteria |
|---|---|---|---|---|
| **POS-01** | R-HQ Routing Table Audit | `R-HQ# show ip route static` | Explicit static routes to `10.20.0.0/24 via 172.16.12.2` and `10.30.0.0/24 via 172.16.13.2` are installed | Both branch networks active in HQ routing table |
| **POS-02** | Spoke Default Route Audit | `R-BR1# show ip route static`<br>`R-BR2# show ip route static` | Default routes `0.0.0.0/0 via 172.16.12.1` on R-BR1 and `0.0.0.0/0 via 172.16.13.1` on R-BR2 are active | Both spoke routers show `S* 0.0.0.0/0` |
| **POS-03** | Branch 1 Local Gateway Reachability | `PC-BR1> ping 10.20.0.1` | 4/4 echo replies received (0% packet loss) | Intra-subnet communication verified |
| **POS-04** | Branch 2 Local Gateway Reachability | `PC-BR2> ping 10.30.0.1` | 4/4 echo replies received (0% packet loss) | Intra-subnet communication verified |
| **POS-05** | Branch 1 to HQ Server Reachability | `PC-BR1> ping 10.10.0.10` | 4/4 echo replies received (0% packet loss) | Spoke-to-hub data plane delivery verified |
| **POS-06** | Branch 2 to HQ Server Reachability | `PC-BR2> ping 10.10.0.10` | 4/4 echo replies received (0% packet loss) | Spoke-to-hub data plane delivery verified |
| **POS-07** | Inter-Branch Spoke-to-Spoke Transit Reachability | `PC-BR1> ping 10.30.0.10` | 4/4 echo replies received (0% packet loss, TTL=125) | Multi-hop transit through hub router verified |

---

## 3. Negative & Fault Tolerance Test Matrix

| Test ID | Fault Scenario | Injection Procedure | Observed Symptom | Recovery Procedure |
|---|---|---|---|---|
| **NEG-01** | Starter State: Endpoint Gateway Typo & Invalid Next-Hop | On `PC-BR1`, gateway is `10.20.0.254`. On `R-BR1`, default route next-hop is `172.16.12.5`. Test ping to `HQ-Server` (`10.10.0.10`). | Ping fails with 100% loss (`Request timed out` / `Destination host unreachable`). | Correct gateway on `PC-BR1` to `10.20.0.1`, and reconfigure static default route on `R-BR1` with next-hop `172.16.12.1`. |
| **NEG-02** | Starter State: Missing Return Route on Hub | On `R-HQ`, static route to `10.30.0.0/24` is removed. Test ping from `PC-BR2` to `HQ-Server` (`10.10.0.10`). | Ping fails with 100% loss (`Request timed out`). `R-HQ` cannot return echo replies to Branch 2. | Add explicit static route on `R-HQ`: `ip route 10.30.0.0 255.255.255.0 172.16.13.2`. |

---

## 4. Reload and Persistence Verification

- `completed.pkt` reloaded cleanly via `ipc.appWindow().fileOpen()`.
- Hub and spoke routers preserved NVRAM startup configurations across reload.
- Full end-to-end reachability across all three enterprise sites confirmed after reload.
- Reopened `starter.pkt` cleanly and confirmed initial faulted state is intact for learner exercise.

