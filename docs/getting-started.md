# Getting Started with Cisco Packet Tracer Labs

Welcome to the **Cisco Packet Tracer Labs** library. This guide walks you through the repository organization, prerequisites, and how to practice networking concepts effectively.

---

## 1. What is Cisco Packet Tracer?
Cisco Packet Tracer is a network simulation and visualization program developed by Cisco Systems. It allows learners to simulate network devices (routers, switches, PCs, servers, firewalls) and observe how data packets traverse protocols in both **Realtime Mode** and **Simulation Mode**.

---

## 2. Prerequisites
Before beginning:
1. **Download and Install Packet Tracer:** Refer to our [Installation Guide](installation.md) for official download instructions via Cisco Skills for All.
2. **Basic Understanding of Networking Terms:**
   - **IP Address:** A logical numerical address assigned to a network interface (e.g., `192.168.1.1`).
   - **Subnet Mask / Prefix:** Defines the network portion versus the host portion of an IP address (e.g., `255.255.255.0` or `/24`).
   - **Default Gateway:** The router interface IP that allows end devices to reach hosts outside their local subnet.
   - **MAC Address:** The physical 48-bit hardware address burned into a Network Interface Card (NIC).

---

## 3. How to Use a Lab
Each lab in this repository follows a standard, predictable format designed for active learning:

1. **Read the Learning Objectives:** Understand what concept you are demonstrating.
2. **Examine the Topology and Addressing Table:** Review the devices, interfaces, and subnets before opening the simulator.
3. **Build the Topology:** Place the specified devices in Packet Tracer, select the appropriate cables (Copper Straight-Through, Copper Cross-Over, Serial), and cable the exact interfaces listed.
4. **Follow the Configuration Walkthrough:** Enter the commands step-by-step. Understand the prompt hierarchy:
   - User EXEC: `Router>`
   - Privileged EXEC: `Router#`
   - Global Configuration: `Router(config)#`
   - Interface Configuration: `Router(config-if)#`
5. **Execute Verification Commands:** Test connectivity using `ping`, `traceroute`, `show ip interface brief`, and protocol-specific status commands.
6. **Consult Troubleshooting:** If communication fails, check the failure conditions documented in the lab's Troubleshooting section.

---

## 4. Next Steps
- Review the [Cisco IOS Cheatsheet](cisco-ios-cheatsheet.md) for quick command navigation.
- Learn common diagnostics in [Troubleshooting Guide](troubleshooting.md).
