# Repository Migration Map

This document records the relationship between legacy academic-year folders and the new topical categorization under `labs/`.

## Architectural Principle
Per the **Rights and Content Policy** (`AI_AGENT_GUIDE/05_RIGHTS_AND_CONTENT_POLICY.md`):
- Proprietary third-party courseware files (`.pka`, `.bak`, `.docx`, and answer keys) are **retained in their legacy locations** and **not migrated into `labs/`**.
- New content under `labs/` consists exclusively of **clean-room, independently authored educational guides** with clear provenance, official citations, and explicit verification statuses.
- No historical activity number or context is lost: original activity references (such as `2.3.7`, `1.4.7`, `11.1.10`) are preserved in each lab's `metadata.json` under `activity_reference`.

---

## Migration Table

| Legacy Path / Group | Legacy Type | Original Activity Ref | Proposed Category / Slug | Disposition Status |
|---|---|---|---|---|
| `2ndYear_Networking1/2.3.7 Packet Tracer - Navigate the IOS/` | PKA, BAK | 2.3.7 | `labs/network-fundamentals/ios-navigation/` | Binary retained in legacy; original educational guide authored in `labs/` |
| `2ndYear_Networking1/2.5.5 Packet Tracer - Configure Initial Switch Settings/` | PKA, BAK | 2.5.5 | `labs/switching/initial-switch-configuration/` | Binary retained in legacy; original educational guide authored in `labs/` |
| `2ndYear_Networking1/2.7.6 Packet Tracer - Implement Basic Connectivity/` | PKA, BAK | 2.7.6 | `labs/network-fundamentals/basic-connectivity/` | Binary retained in legacy; original educational guide authored in `labs/` |
| `2ndYear_Networking1/2.9.1 Packet Tracer - Basic Switch and End Device Configuration/` | PKA, BAK | 2.9.1 | `labs/switching/basic-switch-end-device/` | Binary retained in legacy; original educational guide authored in `labs/` |
| `2ndYear_Networking1/3.5.5 Packet Tracer - Investigate the TCP IP and OSI Models in Action/` | PKA | 3.5.5 | `labs/network-fundamentals/osi-tcpip-simulation/` | Binary retained in legacy; original conceptual guide authored in `labs/` |
| `2ndYear_Networking1/4.7.2 Packet Tracer - Connect the Physical Layer/` | PKA | 4.7.2 | `labs/network-fundamentals/physical-layer-connections/` | Binary retained in legacy; original cabling guide authored in `labs/` |
| `2ndYear_Networking1/Step by Step Laboratory Activity/` | PKT, MD | Custom | `labs/routing/dual-stack-static-routing/` | **MIGRATED (PTL-0001)**: PKT moved via git mv (SHA256 verified: `8d7f62a8b4e36ef0a6efb613b92e84dbed3f1c34cb5d268b9d2b7db487680b31`), canonical guide authored with IPv6 unicast-routing corrections; compatibility stub in legacy folder |
| `2ndYear_Networking1/Midterm Laboratory Exam/` | DOCX, MD | Exam | `(restricted)` | Quarantined in legacy; institutional exam material not eligible for public library |
| `3rdYear_Networking2/Gonzales,JohnLemar - WAN Technologies Activity.pkt` | PKT | Custom | `(restricted)` | Quarantined in legacy; contains personal name in filename |
| `3rdYear_Networking2/Packet Tracer - Configure EtherChannel/` | PKA | Custom / Course | `labs/switching/etherchannel-configuration/` | Binaries retained in legacy; original LACP guide authored in `labs/` |
| `3rdYear_Networking2/Packet Tracer - Configure Router Interfaces/` | PKA, MD | 1.4.7 | `labs/ip-addressing/router-interface-configuration/` | Solution guide & binaries retained in legacy; clean original guide authored in `labs/` |
| `3rdYear_Networking2/Packet Tracer - Configure SSH/` | PKA, MD | Custom / Course | `labs/network-security/secure-switch-ssh/` | Solution guide & binaries retained in legacy; modern SSH guide authored in `labs/` |
| `3rdYear_Networking2/Packet Tracer - Implement Etherchannel/` | PKA | Custom / Course | `labs/switching/etherchannel-implementation/` | Binaries retained in legacy; distinct implementation guide mapped |
| `3rdYear_Networking2/Packet Tracer - Implement Port Security/` | PKA, MD | 11.1.10 | `labs/network-security/port-security/` | Solution guide & binaries retained in legacy; clean original guide authored in `labs/` |
| `3rdYear_Networking2/Packet Tracer - Implement a Small Network/` | PKA, MD | Custom / Course | `labs/projects/small-office-network/` | Binaries & answer guide retained in legacy; clean original design authored in `labs/` |
| `3rdYear_Networking2/Packet Tracer - Switch Security Configuration/` | PKA, MD | Custom / Course | `labs/network-security/switch-hardening/` | Binaries & fragmented notes retained in legacy; comprehensive hardening guide in `labs/` |
| `3rdYear_Networking2/Packet Tracer - Troubleshoot EtherChannel/` | PKA | Custom / Course | `labs/troubleshooting/etherchannel-troubleshooting/` | Binaries retained in legacy; original troubleshooting lab mapped |
| `3rdYear_Networking2/Packet Tracer - Verify Directly Connected Networks/` | PKA, MD | Custom / Course | `labs/ip-addressing/verify-connected-networks/` | Instructor answer key retained in legacy; clean verification guide authored in `labs/` |
