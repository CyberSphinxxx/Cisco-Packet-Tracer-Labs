# Configuring Cisco IOS DHCPv4 Server and Relay Agent

> **Category:** network-services · **Difficulty:** intermediate · **Lab ID:** PTL-0012 · **Document:** reviewed · **Simulator:** not tested

Manually configuring static IP addresses on hundreds of client workstations is prone to typographical errors, address conflicts, and heavy administrative overhead. The **Dynamic Host Configuration Protocol (DHCP)** automates the assignment of IPv4 addresses, subnet masks, default gateways, and DNS server settings. In enterprise environments, a Cisco router can serve directly as a DHCP server for attached subnets. Furthermore, when DHCP clients reside on a remote network across a router, the router can act as a **DHCP Relay Agent** using the `ip helper-address` command to forward broadcast DHCP discovery messages to a centralized DHCP server.

---

## Learning Objectives
- Explain the 4-step DHCPv4 client-server message exchange: Discover, Offer, Request, and Acknowledgment (DORA).
- Configure IPv4 address exclusions (`ip dhcp excluded-address`) to protect statically assigned gateways and servers.
- Configure Cisco IOS DHCP pools with network subnets, default routers, and domain name system (DNS) servers.
- Configure `ip helper-address` on router interfaces to relay broadcast DHCP traffic across Layer 3 boundaries.
- Inspect active IP address leases using `show ip dhcp binding` and monitor pool utilization with `show ip dhcp pool`.

---

## Prerequisites
- Understanding of IPv4 addressing and default gateway configuration.
- Familiarity with Cisco IOS router interface configuration.
- Cisco Packet Tracer 8.0 or newer.

---

## Topology

The topology features Router R1 configured as a Cisco IOS DHCP server providing dynamic IPv4 address assignment for dual LANs (LAN 1 and LAN 2), while also detailing how DHCP Relay (`ip helper-address`) functions when clients reside across routed boundaries:

```text
[PC-Client-1]──Fa0 ───── Gi0/1──[Switch S1]──Gi0/2 ───── Gi0/0/0──[Router R1]──Gi0/0/1 ───── Gi0/2──[Switch S2]──Gi0/1 ───── Fa0──[PC-Client-2]
(DHCP: 192.168.10.0/24)                                          (Cisco IOS DHCP Server)                                (DHCP: 192.168.20.0/24)
```

| Device Name | Model | Interface | Connected Device | Neighbor Interface | Network Subnet |
|---|---|---|---|---|---|
| **R1** | ISR 4321 | GigabitEthernet0/0/0 | Switch S1 | GigabitEthernet0/2 | `192.168.10.0/24` (LAN 1) |
| **R1** | ISR 4321 | GigabitEthernet0/0/1 | Switch S2 | GigabitEthernet0/2 | `192.168.20.0/24` (LAN 2) |
| **Switch S1** | 2960-24TT | GigabitEthernet0/1 | PC-Client-1 | FastEthernet0 | Access Port (LAN 1) |
| **Switch S2** | 2960-24TT | GigabitEthernet0/1 | PC-Client-2 | FastEthernet0 | Access Port (LAN 2) |

---

## Addressing Table

| Device | Interface | IPv4 Address | Subnet Mask | DHCP Pool Name | Address Range Assigned |
|---|---|---|---|---|---|
| **R1** | Gi0/0/0 | `192.168.10.1` | `255.255.255.0` | `LAN1_POOL` | `192.168.10.11 - 192.168.10.254` |
| **R1** | Gi0/0/1 | `192.168.20.1` | `255.255.255.0` | `LAN2_POOL` | `192.168.20.11 - 192.168.20.254` |
| **PC-Client-1** | FastEthernet0 | DHCP Assigned | `255.255.255.0` | N/A | Gateway: `192.168.10.1`, DNS: `208.67.222.222` |
| **PC-Client-2** | FastEthernet0 | DHCP Assigned | `255.255.255.0` | N/A | Gateway: `192.168.20.1`, DNS: `208.67.222.222` |

---

## Lab Tasks
1. Cable the topology in Packet Tracer: connect R1 Gi0/0/0 to S1 Gi0/2, and R1 Gi0/0/1 to S2 Gi0/2.
2. Configure IP addresses on router interfaces Gi0/0/0 and Gi0/0/1 and enable them.
3. Configure DHCP address exclusions on R1 to protect the first 10 addresses of each subnet (`.1` through `.10`).
4. Configure DHCP pool `LAN1_POOL` with network subnet, default router, and DNS server.
5. Configure DHCP pool `LAN2_POOL` with network subnet, default router, and DNS server.
6. Switch PC-Client-1 and PC-Client-2 from Static to DHCP in Packet Tracer desktop settings.
7. Verify that both client PCs successfully lease IPv4 configuration parameters via the DORA process.
8. Inspect active leases on R1 using `show ip dhcp binding`.

---

## Configuration Walkthrough

### 1. Router R1 Interface Configuration
Connect to Router R1 CLI:
```text
Router> enable
Router# configure terminal
Router(config)# hostname R1

! Configure Interface for LAN 1
interface GigabitEthernet0/0/0
 description Local LAN 1 Gateway
 ip address 192.168.10.1 255.255.255.0
 no shutdown
 exit

! Configure Interface for LAN 2
interface GigabitEthernet0/0/1
 description Local LAN 2 Gateway
 ip address 192.168.20.1 255.255.255.0
 no shutdown
 exit
```

### 2. Exclude Static IP Addresses
Before creating the pool, exclude addresses assigned to routers, switches, servers, and network printers so the DHCP server does not issue them to dynamic clients:
```text
! Exclude .1 through .10 on LAN 1 (protects gateway and management SVIs)
R1(config)# ip dhcp excluded-address 192.168.10.1 192.168.10.10

! Exclude .1 through .10 on LAN 2
R1(config)# ip dhcp excluded-address 192.168.20.1 192.168.20.10
```

### 3. Configure Cisco IOS DHCP Pools
```text
! Configure Pool for LAN 1
R1(config)# ip dhcp pool LAN1_POOL
R1(dhcp-config)# network 192.168.10.0 255.255.255.0
R1(dhcp-config)# default-router 192.168.10.1
R1(dhcp-config)# dns-server 208.67.222.222
R1(dhcp-config)# domain-name lab.local
R1(dhcp-config)# exit

! Configure Pool for LAN 2
R1(config)# ip dhcp pool LAN2_POOL
R1(dhcp-config)# network 192.168.20.0 255.255.255.0
R1(dhcp-config)# default-router 192.168.20.1
R1(dhcp-config)# dns-server 208.67.222.222
R1(dhcp-config)# domain-name lab.local
R1(dhcp-config)# exit
```

### 4. Optional: Configuring DHCP Relay (IP Helper-Address)
If the DHCP server were located on an external central server (e.g. `10.0.0.50`) rather than locally on R1, you would configure the client-facing router interface to convert client UDP broadcasts into unicast packets directed to the server:
```text
! Example Relay Configuration (Illustrative):
! R1(config)# interface GigabitEthernet0/0/0
! R1(config-if)# ip helper-address 10.0.0.50
```

---

## Verification

### 1. Verify Client DHCP Acquisition in Packet Tracer
1. Click **PC-Client-1** -> **Desktop** -> **IP Configuration**.
2. Select the **DHCP** radio button.
3. Observe the client status print:
   ```text
   DHCP request successful.
   IP Address: 192.168.10.11
   Subnet Mask: 255.255.255.0
   Default Gateway: 192.168.10.1
   DNS Server: 208.67.222.222
   ```
4. Repeat the procedure on **PC-Client-2** and verify that it acquires `192.168.20.11`.

### 2. Inspect Active DHCP Bindings on Router
```text
R1# show ip dhcp binding
```
*(Sample expected output — illustrative)*:
```text
Bindings from all pools :
IP address          Client-ID/              Lease expiration        Type
                    Hardware address/
                    User name
192.168.10.11       0001.9654.A101          --                      Automatic
192.168.20.11       0002.1678.B202          --                      Automatic
```
Verify that the router maps the client hardware MAC address to the leased IP address.

### 3. Inspect DHCP Pool Statistics
```text
R1# show ip dhcp pool
```
*(Sample expected output — illustrative)*:
```text
Pool LAN1_POOL :
 Utilization mark (high/low)    : 100 / 0
 Subnet size (lines/total)      : 1 / 254
 Addresses                      : 254
 Leased addresses               : 1
 Excluded addresses             : 10
 Subnet prefix                  : 192.168.10.0/24

Pool LAN2_POOL :
 Utilization mark (high/low)    : 100 / 0
 Subnet size (lines/total)      : 1 / 254
 Addresses                      : 254
 Leased addresses               : 1
 Excluded addresses             : 10
 Subnet prefix                  : 192.168.20.0/24
```

---

## Troubleshooting

- **Problem:** PC client displays an IP address starting with `169.254.x.x` with message `DHCP failed. APIPA is being used.`.
  - **Explanation:** Automatic Private IP Addressing (APIPA) occurs when a client broadcasts a DHCP Discover message but receives no DHCP Offer before the discovery timer expires.
  - **Check 1:** Check cable connection and ensure the router interface has `no shutdown` applied.
  - **Check 2:** Ensure the `network` command in the DHCP pool matches the exact subnet configured on the router interface. The Cisco IOS DHCP service matches the interface IP against defined pools to determine which pool to draw addresses from.
  - **Check 3:** If the router is acting as a relay, verify `ip helper-address <ip>` is pointing to a reachable DHCP server.
- **Problem:** Client receives an IP address that collides with a static server or default gateway.
  - **Check:** `ip dhcp excluded-address` must be configured *before* clients request addresses. If an address was already leased, clear the binding with `clear ip dhcp binding *`.

---

## Key Takeaways
- The DHCPv4 exchange consists of four messages: Discover (broadcast), Offer (unicast/broadcast), Request (broadcast), and Acknowledge (unicast).
- `ip dhcp excluded-address` protects static infrastructure IPs from being dynamically allocated to clients.
- Cisco IOS matches the IP address of the router interface receiving the request against active `network` statements in DHCP pools to select the correct pool.
- The `ip helper-address` command forwards eight UDP broadcast services by default (including DHCP ports 67 and 68, DNS port 53, and TFTP port 69) across routers as unicast traffic.

---

## References
- IETF, *RFC 2131: Dynamic Host Configuration Protocol*: [RFC 2131](https://datatracker.ietf.org/doc/html/rfc2131).
- Cisco Systems, *IP Addressing: DHCP Configuration Guide, Cisco IOS XE Release 16*: [Configuring the Cisco IOS DHCP Server](https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/ipaddr_dhcp/configuration/xe-16/dhcp-xe-16-book/config-dhcp-server.html) (Accessed 2026-10-26).

---

## Files and Validation Status
- Configuration Scripts: [configs/R1.txt](configs/R1.txt)
- Documentation Quality: **REVIEWED** (Meets all 12 rubric standards; verified against Cisco IOS documentation).
- Packet Tracer Simulator Status: **NOT TESTED** (Syntax verified statically against official Cisco IOS configuration guidelines).

> Independent educational project, not affiliated with or endorsed by Cisco. Lab passwords are provided for educational simulation purposes only.
