# Beginner Networking Learning Path

This curated sequence is designed for learners with zero prior Cisco IOS or networking experience. It builds confidence progressively from simulator setup and command-line mechanics to IP addressing, switch segmentation, and diagnostic verification.

---

## Stage 1: Setup and Navigation Fundamentals

Before typing router commands, understand how packet flow works and set up your local environment.

1. **[Packet Tracer Installation & Setup](../docs/installation.md)**
   *Goal:* Install Cisco Packet Tracer, understand free NetAcad course access, and configure your simulation preferences.
2. **[Getting Started Guide](../docs/getting-started.md)**
   *Goal:* Master workspace navigation, cable selection (Straight-Through vs. Crossover), device selection, and switching between Realtime and Simulation modes.
3. **[Cisco IOS CLI Cheatsheet](../docs/cisco-ios-cheatsheet.md)**
   *Goal:* Learn the Cisco IOS hierarchy (User EXEC, Privileged EXEC, Global Configuration, Interface Configuration) and tab-completion shortcuts.

---

## Stage 2: First Device Configurations

Hands-on practice configuring hostnames, banners, passwords, and saving configurations to non-volatile memory (NVRAM).

4. **[PTL-0008: Cisco IOS Navigation and Initial Device Configuration](../labs/network-fundamentals/ios-navigation-and-initial-config/README.md)**
   *Category:* `network-fundamentals` | *Difficulty:* Beginner
   *What you will learn:* Navigation using `?` help, setting device hostnames, configuring warning banners (`banner motd`), configuring SHA-256 encrypted enable secrets, and committing changes to NVRAM with `write memory`.

---

## Stage 3: IP Addressing and Interface Activation

Transition from local console management to Layer 3 network connectivity.

5. **[PTL-0002: Configuring Cisco Router Interfaces](../labs/ip-addressing/router-interface-configuration/README.md)**
   *Category:* `ip-addressing` | *Difficulty:* Beginner
   *What you will learn:* Assigning IPv4 addresses and subnet masks, configuring dual-stack IPv6 global unicast and link-local addresses, interface descriptions, and activating ports with `no shutdown`.
6. **[PTL-0005: Verifying Directly Connected Networks](../labs/ip-addressing/verify-connected-networks/README.md)**
   *Category:* `ip-addressing` | *Difficulty:* Beginner
   *What you will learn:* Reading `show ip interface brief` and `show ip route`, distinguishing between directly connected network routes (`C`) and local host interface routes (`L`).

---

## Stage 4: Local Network Segmentation

Learn how to manage broadcast domains on Ethernet switches.

7. **[PTL-0009: VLAN Segmentation and Access Port Configuration](../labs/switching/vlan-segmentation-and-access-ports/README.md)**
   *Category:* `switching` | *Difficulty:* Beginner
   *What you will learn:* Creating VLANs (VLAN 10, 20, 99), naming VLANs, assigning switchports to access mode, and verifying MAC address table separation.

---

## Stage 5: Systematic Troubleshooting

When pings fail, apply a methodical diagnostic model.

8. **[Troubleshooting Guide](../docs/troubleshooting.md)**
   *Goal:* Follow the bottom-up OSI troubleshooting framework (Physical -> Data Link -> Network -> Transport) to isolate configuration mistakes.

---

## Next Milestone
After completing this beginner track, proceed to the **[BSIT Networking Track](bsit-networking.md)** to tackle inter-VLAN routing, dynamic OSPF routing, SSH security, DHCP relay, and perimeter ACLs.
