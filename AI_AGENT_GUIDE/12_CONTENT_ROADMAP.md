# Finite curated syllabus (coverage targets, not fictional existing files)

A good corpus covers useful beginner through intermediate learning outcomes. This roadmap provides scope bounds; it is NOT a requirement to generate hundreds of untestable labs.

## Tier A — essential beginner series
- Cisco Packet Tracer install/open/save; user interface and Simulation vs Realtime mode (educational guide, not redistributed installer)
- Physical cabling/device interface mapping and link status
- IOS modes/help and saving startup configuration
- Basic hostname, console, secret, banners and passwords (lab-safe)
- IPv4 addresses, mask, default gateway and local ping
- IPv4 subnetting/VLSM practice (table-driven)
- Basic IPv6, link-local and gateway
- Default gateway vs static route, multi-router reachability
- Basic switch management and end-host setup

## Tier B — switching and routing
- VLAN creation and access ports
- 802.1Q trunk/native/allowed VLAN troubleshooting
- Router-on-a-stick inter-VLAN routing
- Layer 3 SVI routing where Packet Tracer model supports it
- STP basics and PortFast/BPDU Guard
- EtherChannel LACP and troubleshooting
- Static/default routes (IPv4/IPv6)
- Single-area OSPFv2 and a follow-on OSPFv3 only with simulator support verification
- DHCP server/relay and DNS basics
- NAT/PAT with correct inside/outside routes

## Tier C — security and network projects
- Secure switch/router management via SSH
- Standard/extended ACLs with measurable traffic matrix
- Port security sticky and violation modes
- DHCP snooping and other supported switch protections
- WLAN SSID, WPA2, DHCP and joining clients in Packet Tracer
- Small office multi-VLAN network (capstone)
- Multi-department campus network (capstone)
- Fault-injection labs: VLAN mismatch, subnet overlap, wrong default gateway, wrong route, channel mismatch

## Explicit topic policy
- EIGRP/RIP or obsolete topics can be optional archival learning; do not describe as current CCNA core unless official current blueprint confirms it.
- Label Packet Tracer limitations. Don't promise real-world fidelity for unsupported protocols/features.
- Always establish *one working original lab* per lesson before proposing more variants.

## Prioritization heuristic and v1 coverage target
Impact=(beginner demand + prerequisite value + common course usefulness + website-search potential) minus (ownership ambiguity + simulator uncertainty + technical complexity). **V1 completion target:** every Tier A and Tier B learning outcome above must have an eligible, independently written, technically reviewed original guide or a verified eligible existing guide, with accurate simulation status. At least three Tier C security/troubleshooting lessons and one independently authored small-office project *design guide* should also exist; other Tier C activities remain an explicitly identified expansion backlog. The website and binary completeness remain outside scope.

**Execution batches:** create 3-5 high-quality guides, verify each batch, update coverage matrix, then take the next batch until the v1 target is met or a specific blocker makes it unattainable. **Do not stop after the first batch**. If a topic is unsupported by Packet Tracer or cannot be sourced confidently, mark the blocker, do not make a fictitious lab, and report the target not fully met. Unresolved actual simulator file authoring remains a documented blocker, even if the text guide is accepted.

## Existing coverage detection
Map observed existing files against this curriculum before drafting new guides. Do not duplicate an existing topic just to increase counts. If legacy material can't be redistributed, replace with independently authored new activity design rather than copying the source.
