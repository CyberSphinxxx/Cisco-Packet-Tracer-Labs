# Known remote baseline — observed 2026-10-26

Remote: `CyberSphinxxx/Cisco-Packet-Tracer-Labs`, default branch `main`. GitHub tree query showed **39 files** under 58 total tree entries (files plus directories): **22 `.pka`, 2 `.pkt`, 4 `.bak`, 10 `.md`, 1 `.docx`**. These are a *starting snapshot*, not a replacement for inspecting the local clone. The top-level README still describes year-based lab groups and asserts RIP/OSPF/EIGRP/DHCP/DNS without a clearly enumerated matching lab inventory.

Existing important paths/families:

| Legacy directory | Disposition candidate | Warning |
|---|---|---|
| `2ndYear_Networking1/2.3.7 Packet Tracer - Navigate the IOS` | fundamentals/ios-navigation | contains assessment `.pka` + `.bak`; rights review |
| `2ndYear_Networking1/2.5.5 Packet Tracer - Configure Initial Switch Settings` | switching/initial-switch-configuration | assessment/backup |
| `2ndYear_Networking1/2.7.6 Packet Tracer - Implement Basic Connectivity` | fundamentals/basic-connectivity | assessment/backup |
| `2ndYear_Networking1/2.9.1 Packet Tracer - Basic Switch and End Device Configuration` | switching/basic-switch-end-device | assessment/backup |
| `2ndYear_Networking1/3.5.5 Packet Tracer - Investigate the TCP IP and OSI Models in Action` | fundamentals/osi-tcpip-simulation | assessment rights review |
| `2ndYear_Networking1/4.7.2 Packet Tracer - Connect the Physical Layer` | fundamentals/physical-layer-connections | assessment rights review |
| `2ndYear_Networking1/Step by Step Laboratory Activity` | routing/static-dual-stack-network | `.pkt` plus guides; examine accuracy/ownership |
| `2ndYear_Networking1/Midterm Laboratory Exam` | restricted pending review | contains exam `.docx` and instructor/test material |
| `3rdYear_Networking2/Gonzales,JohnLemar - WAN Technologies Activity.pkt` | wireless-wan/wan-fundamentals | personal name; inspect before relabeling |
| `3rdYear_Networking2/Packet Tracer - Configure EtherChannel` | switching/etherchannel-configuration | 2 `.pka`, no Markdown guide |
| `3rdYear_Networking2/Packet Tracer - Configure Router Interfaces` | addressing/router-interfaces | 2 `.pka`, guide |
| `3rdYear_Networking2/Packet Tracer - Configure SSH` | security/ssh-configuration | 2 `.pka`, guide |
| `3rdYear_Networking2/Packet Tracer - Implement Etherchannel` | switching/etherchannel-implementation | distinguish from configure lab |
| `3rdYear_Networking2/Packet Tracer - Implement Port Security` | security/port-security | guide plus `.pka` |
| `3rdYear_Networking2/Packet Tracer - Implement a Small Network` | projects/small-office-network | 2 `.pka`, guide |
| `3rdYear_Networking2/Packet Tracer - Switch Security Configuration` | security/switch-hardening | guide plus `.pka` |
| `3rdYear_Networking2/Packet Tracer - Troubleshoot EtherChannel` | troubleshooting/etherchannel | 2 `.pka`; avoid collapsing distinct activity |
| `3rdYear_Networking2/Packet Tracer - Verify Directly Connected Networks` | addressing/verify-connected | 2 `.pka`, guide |

**Specific guide defects to investigate, not automatically patch blindly:**
- `Step by Step Laboratory Activity/Guide.md` incorrectly says ordinary L2 Cisco 2960 switches cannot forward IPv6 traffic; routers appear to omit `ipv6 unicast-routing`. An L2 switch can forward IPv6 frames without IPv6 management support.
- `Midterm Laboratory Exam/LaboratoryExamGuide.md` uses invalid IPv6 `ip default-gateway 2001:...` IOS command and may contain classroom/instructor content.
- SSH guide uses RSA-1024 and password Type 7 as part of legacy exercise. Preserve historical lab requirements but add modern-security warnings and check supported CLI/version.
- `Switch Security Configuration/guide.md` shows configuration excerpts with little context, validation, or a documented full sequence.

### Required Phase-1 inventory columns
`source_path,file_ext,bytes,sha256,activity_key,suggested_topic,origin_type,attribution,rights_status,permission_evidence,personal_data,integrity_status,target_path,action,notes`.

Do **not** assume two similarly named `.pka` files are starter/completed, byte-for-byte duplicates, or redistributable. Compare hashes and inspect with Cisco Packet Tracer when authorized/possible. A `.bak` may contain distinct content; do not delete without review. Record all renames in `docs/migration-map.md`.
