# Cisco IOS Command Cheatsheet

A concise reference of essential Cisco IOS command modes, shortcuts, and core syntax for Packet Tracer learners.

---

## 1. IOS Command Modes Hierarchy

```text
User EXEC Mode
  Prompt: Router>
  Purpose: Basic view-only commands, initial pings.
  Command to enter: (Default upon login)
  Command to advance: enable
       │
       ▼
Privileged EXEC Mode (Enable Mode)
  Prompt: Router#
  Purpose: Diagnostic commands, show running-config, saving, reload.
  Command to enter: enable (from User EXEC)
  Command to advance: configure terminal
       │
       ▼
Global Configuration Mode
  Prompt: Router(config)#
  Purpose: System-wide settings (hostname, banners, static routes).
  Command to enter: configure terminal (from Privileged EXEC)
       │
       ├──► Interface Configuration: interface <type> <number>
       │      Prompt: Router(config-if)#
       │
       ├──► Line Configuration: line console 0 | line vty 0 4
       │      Prompt: Router(config-line)#
       │
       ├──► VLAN Configuration: vlan <id>
       │      Prompt: Switch(config-vlan)#
       │
       └──► Router / Routing Protocol: router ospf <process-id>
              Prompt: Router(config-router)#
```

---

## 2. Essential CLI Shortcuts
- `Tab`: Auto-completes a partially typed command.
- `?`: Context-sensitive help; shows available commands or next parameters.
- `Ctrl + A`: Jump to the beginning of the current command line.
- `Ctrl + E`: Jump to the end of the current command line.
- `Ctrl + C` or `Ctrl + Z`: Exit back to Privileged EXEC (`Router#`).
- `exit`: Move back one level in the mode hierarchy.
- `end`: Immediately return to Privileged EXEC mode from any configuration sub-mode.

---

## 3. Basic Device Setup
```text
Router# configure terminal
Router(config)# hostname R1
R1(config)# enable secret class
R1(config)# banner motd # Authorized Access Only! #
R1(config)# line console 0
R1(config-line)# password cisco
R1(config-line)# login
R1(config-line)# logging synchronous
R1(config-line)# exit
R1(config)# service password-encryption
```

---

## 4. IP Interface Configuration
```text
R1(config)# interface GigabitEthernet0/0/0
R1(config-if)# description LAN Connection to Switch S1
R1(config-if)# ip address 192.168.1.1 255.255.255.0
R1(config-if)# ipv6 address 2001:db8:acad:1::1/64
R1(config-if)# ipv6 address fe80::1 link-local
R1(config-if)# no shutdown
R1(config-if)# exit
```

---

## 5. Switch SVI and Management
```text
Switch(config)# interface vlan 1
Switch(config-if)# ip address 192.168.1.2 255.255.255.0
Switch(config-if)# no shutdown
Switch(config-if)# exit
Switch(config)# ip default-gateway 192.168.1.1
```

---

## 6. Saving Configuration
```text
R1# copy running-config startup-config
Destination filename [startup-config]? [Enter]
Building configuration...
[OK]

! Or the shorter shortcut:
R1# write memory
```

---

## 7. Diagnostic and Verification Commands
- `show ip interface brief` — Displays operational status and IP of all interfaces.
- `show ipv6 interface brief` — Displays operational status and IPv6 addresses.
- `show ip route` — Displays the IPv4 routing table.
- `show ipv6 route` — Displays the IPv6 routing table.
- `show running-config` — Displays the active configuration in RAM.
- `show startup-config` — Displays the saved configuration in NVRAM.
- `show interfaces <type> <number>` — Detailed interface statistics, duplex, speed, and errors.
- `show vlan brief` — Lists all VLANs and assigned access ports on a switch.
- `show interfaces trunk` — Lists active trunking interfaces, native VLANs, and allowed VLANs.
- `show etherchannel summary` — Lists EtherChannel groups, protocol (LACP/PAgP), and port states.
- `show mac address-table` — Displays dynamically learned and static MAC addresses on a switch.
- `ping <ip-address>` — Tests Layer 3 reachability to a remote host.
- `traceroute <ip-address>` — Identifies the hop-by-hop path taken to reach a destination.
