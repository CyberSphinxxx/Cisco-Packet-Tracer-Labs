# Packet Tracer Network Troubleshooting Guide

A structured methodology for diagnosing and resolving common network failures encountered in Cisco Packet Tracer simulations.

---

## 1. The Layered Troubleshooting Model
When a network connection fails, troubleshoot methodically from the bottom of the OSI model up:

```text
Layer 1 (Physical)      --> Cable type, port link lights, interface status ("administratively down")
Layer 2 (Data Link)     --> VLAN mismatch, trunk encapsulation, duplex/speed mismatch, port security shutdown
Layer 3 (Network)       --> IP address collision, wrong subnet mask, wrong default gateway, missing route
Layer 4 (Transport)     --> ACL blocking TCP/UDP ports, transport input none on VTY lines
Layer 7 (Application)   --> DNS unconfigured, HTTP/DHCP service turned off on server
```

---

## 2. Common Packet Tracer Issues and Fixes

### Issue A: Interface Status is "Administratively Down"
- **Symptom:** Link light remains red; `show ip interface brief` shows `Status: administratively down, Protocol: down`.
- **Cause:** By default, Cisco router interfaces are disabled upon initial boot.
- **Resolution:**
  ```text
  Router(config)# interface GigabitEthernet0/0/0
  Router(config-if)# no shutdown
  ```

### Issue B: The First Ping Fails (`.!!!!` or `...!!`)
- **Symptom:** When pinging across subnets or after booting, the first 1 or 2 ICMP echo packets timeout (`.`), followed by successes (`!`).
- **Explanation:** This is **normal behavior** in real networking and Packet Tracer. The initial packets pause while the Address Resolution Protocol (ARP) resolves the MAC address of the next-hop router or destination host. Once the ARP table entry is populated, subsequent pings succeed.
- **Resolution:** Repeat the `ping` command. If all 5 packets fail (`.....`), a Layer 2 or Layer 3 configuration error exists.

### Issue C: Switch Port is in "err-disable" Mode
- **Symptom:** Port link light turns amber; switch console prints `%PM-4-ERR_DISABLE: psecure-violation error detected`.
- **Cause:** Port security was configured with `violation shutdown` and an unauthorized MAC address attempted communication.
- **Resolution:**
  ```text
  Switch# show port-security interface FastEthernet0/1
  Switch(config)# interface FastEthernet0/1
  Switch(config-if)# shutdown
  Switch(config-if)# no shutdown
  ```

### Issue D: Inter-VLAN Routing Failure
- **Symptom:** Hosts in VLAN 10 cannot ping hosts in VLAN 20 through a router-on-a-stick topology.
- **Checks:**
  1. Is the switch port connected to the router configured as an 802.1Q trunk? (`show interfaces trunk`)
  2. Does the router subinterface specify the matching VLAN tag with `encapsulation dot1Q <vlan-id>`?
  3. Are the PCs configured with the router subinterface IP as their Default Gateway?

### Issue E: IPv6 Packets Drop at Router
- **Symptom:** Direct IPv6 links ping, but routed IPv6 traffic fails to traverse the router.
- **Cause:** Cisco routers do not route IPv6 packets by default until global unicast routing is explicitly enabled.
- **Resolution:**
  ```text
  Router(config)# ipv6 unicast-routing
  ```

---

## 3. Useful Diagnostic Commands Quick List
| Diagnostic Objective | Primary Cisco IOS Command |
|---|---|
| View port up/down status & IPs | `show ip interface brief` / `show ipv6 interface brief` |
| View active VLAN assignments | `show vlan brief` |
| Check trunk links & native VLAN | `show interfaces trunk` |
| Inspect ARP cache | `show ip arp` |
| Inspect switch MAC table | `show mac address-table` |
| View routing table | `show ip route` / `show ipv6 route` |
| Check EtherChannel bundle status | `show etherchannel summary` |
| Test end-to-end IP reachability | `ping <ip-address>` |
