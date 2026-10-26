# Repository Migration Map

This document records the relationship between legacy academic-year folders and the new topical categorization under `labs/`.

## Architectural Principle
Per the **Rights and Content Policy** (`AI_AGENT_GUIDE/05_RIGHTS_AND_CONTENT_POLICY.md`) and the Phase 11.5 history remediation:
- Proprietary third-party coursework files (`.pka`, `.bak`, `.docx`, and answer keys) and institutional assessment materials were **quarantined, backed up to verified private archives, and permanently expunged** from active directories and Git history.
- The active repository under `labs/` consists exclusively of **clean-room, independently authored educational guides** with clear provenance, official citations, and explicit verification statuses.
- No historical activity number or context is lost: original activity references (such as `2.3.7`, `1.4.7`, `11.1.10`) are preserved in each lab's `metadata.json` under `activity_reference`.

---

## Migration Table

| Legacy Path / Group | Legacy Type | Original Activity Ref | Canonical Category / Slug | Disposition Status |
|---|---|---|---|---|
| `2ndYear_Networking1/2.3.7 Packet Tracer - Navigate the IOS/` | PKA, BAK | 2.3.7 | `labs/network-fundamentals/ios-navigation-and-initial-config/` | Archived privately; original educational guide authored in `labs/` |
| `2ndYear_Networking1/2.5.5 Packet Tracer - Configure Initial Switch Settings/` | PKA, BAK | 2.5.5 | `labs/network-fundamentals/ios-navigation-and-initial-config/` | Archived privately; initial switch config integrated into PTL-0008 |
| `2ndYear_Networking1/2.7.6 Packet Tracer - Implement Basic Connectivity/` | PKA, BAK | 2.7.6 | `labs/ip-addressing/verify-connected-networks/` | Archived privately; basic connectivity integrated into PTL-0005 |
| `2ndYear_Networking1/2.9.1 Packet Tracer - Basic Switch and End Device Configuration/` | PKA, BAK | 2.9.1 | `labs/network-fundamentals/ios-navigation-and-initial-config/` | Archived privately; basic end device config covered in curriculum |
| `2ndYear_Networking1/3.5.5 Packet Tracer - Investigate the TCP IP and OSI Models in Action/` | PKA | 3.5.5 | `docs/troubleshooting.md` | Archived privately; conceptual OSI/TCP-IP models covered in documentation |
| `2ndYear_Networking1/4.7.2 Packet Tracer - Connect the Physical Layer/` | PKA | 4.7.2 | `docs/getting-started.md` | Archived privately; physical cabling guide covered in getting-started |
| `2ndYear_Networking1/Step by Step Laboratory Activity/` | PKT, MD | Custom | `labs/routing/dual-stack-static-routing/` | **MIGRATED (PTL-0001)**: Verified PKT moved to assets (SHA256 verified: `8d7f62a8b4e36ef0a6efb613b92e84dbed3f1c34cb5d268b9d2b7db487680b31`), canonical guide authored with IPv6 unicast-routing corrections |
| `2ndYear_Networking1/Midterm Laboratory Exam/` | DOCX, MD | Exam | `(restricted)` | Archived privately; institutional exam material purged from repository |
| `3rdYear_Networking2/[Student_Author] - WAN Technologies Activity.pkt` | PKT | Custom | `(restricted)` | Archived privately; student submission purged from repository |
| `3rdYear_Networking2/Packet Tracer - Configure EtherChannel/` | PKA | Custom / Course | `labs/switching/etherchannel-lacp/` | Archived privately; original LACP guide authored in `labs/` (PTL-0006) |
| `3rdYear_Networking2/Packet Tracer - Configure Router Interfaces/` | PKA, MD | 1.4.7 | `labs/ip-addressing/router-interface-configuration/` | Archived privately; clean original guide authored in `labs/` (PTL-0002) |
| `3rdYear_Networking2/Packet Tracer - Configure SSH/` | PKA, MD | Custom / Course | `labs/network-security/secure-switch-ssh/` | Archived privately; modern SSH guide authored in `labs/` (PTL-0003) |
| `3rdYear_Networking2/Packet Tracer - Implement Etherchannel/` | PKA | Custom / Course | `labs/switching/etherchannel-lacp/` | Archived privately; unified under PTL-0006 |
| `3rdYear_Networking2/Packet Tracer - Implement Port Security/` | PKA, MD | 11.1.10 | `labs/network-security/port-security/` | Archived privately; clean original guide authored in `labs/` (PTL-0004) |
| `3rdYear_Networking2/Packet Tracer - Implement a Small Network/` | PKA, MD | Custom / Course | `projects/small-office-network/` | Archived privately; clean original design authored in `projects/` |
| `3rdYear_Networking2/Packet Tracer - Switch Security Configuration/` | PKA, MD | Custom / Course | `labs/network-security/switch-hardening/` | Archived privately; comprehensive hardening guide in `labs/` (PTL-0007) |
| `3rdYear_Networking2/Packet Tracer - Troubleshoot EtherChannel/` | PKA | Custom / Course | `labs/switching/etherchannel-lacp/` | Archived privately; troubleshooting exercises integrated in PTL-0006 |
| `3rdYear_Networking2/Packet Tracer - Verify Directly Connected Networks/` | PKA, MD | Custom / Course | `labs/ip-addressing/verify-connected-networks/` | Archived privately; clean verification guide authored in `labs/` (PTL-0005) |
