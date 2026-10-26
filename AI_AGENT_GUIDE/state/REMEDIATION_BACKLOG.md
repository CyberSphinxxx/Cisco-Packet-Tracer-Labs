# Technical Remediation & Future Development Backlog

**Audit Version:** Phase 10 Post-Bootstrap Review  
**Date:** 2026-10-26  
**Status:** Actionable Ledger for Repository Owner and Future Agent Sessions  

---

## 1. Remediation Status Overview

| Severity | Total Identified | Completed in Phase 10 | Unresolved / Owner-Blocked |
|---|:---:|:---:|:---:|
| **CRITICAL (Legal / PII)** | 2 | 0 (Requires Owner Auth) | 2 |
| **HIGH (Simulation Coverage)** | 1 | 0 (Headless Environment) | 1 |
| **MEDIUM (Documentation / Links)** | 4 | 4 (100% Resolved) | 0 |
| **LOW (Roadmap / Curriculum)** | 3 | 0 (Backlog for v2) | 3 |

---

## 2. Completed Remediations (Phase 10 Immediate Fixes)

| Issue ID | Severity | Component | Problem Description | Resolution Implemented |
|---|:---:|---|---|---|
| **FIX-001** | MEDIUM | `PTL-0013` README | Extra `## Security Policy Traffic Matrix` H2 heading violated strict 11-heading contract. | Converted section to `### Security Policy Traffic Matrix` under Addressing Table; verified 11/11 H2s. |
| **FIX-002** | MEDIUM | `PTL-0012` README | Topology diagram had ASCII glitch referencing `Gi0/0/2` instead of `Gi0/0/1`, conflicting with addressing table. | Cleaned up ASCII diagram and intro text to show dual-LAN setup on `Gi0/0/0` and `Gi0/0/1`. |
| **FIX-003** | MEDIUM | `PTL-0001` README | Section `## Files and Validation Status` omitted direct markdown links to its 4 configuration files (`R1.txt`, `R2.txt`, `S1.txt`, `S2.txt`). | Added complete markdown link list to all 4 configuration scripts. |
| **FIX-004** | MEDIUM | `tools/validate_repo.py` | Static link validator only checked root README and lab-index; did not recursively check `projects/` and `learning-paths/`. | Expanded `validate_repo.py` to recursively validate links across all markdown files in `docs/`, `learning-paths/`, and `projects/`. (0 broken links confirmed). |

---

## 3. Unresolved Blockers (Requiring Owner Decision or Hardware Execution)

### Blocker BLK-001: Quarantined Proprietary NetAcad Assets & Student PII
- **Severity:** **CRITICAL** (Intellectual Property & Personal Data Privacy)
- **Affected Assets:** 35 tracked files in `2ndYear_Networking1/` and `3rdYear_Networking2/`, including:
  - 22 proprietary `.pka` files belonging to Cisco Networking Academy.
  - 10 assignment submission packages with student full name in filename (`[STUDENT_NAME]`).
  - 1 university midterm examination package (`MIDTERM-LABORATORY-EXAM.docx`).
- **Risk:** If pushed publicly to GitHub, exposes proprietary courseware to DMCA takedown and publicly exposes student academic records / PII.
- **Recommended Remediation Options:**
  1. **Option A (Recommended — Clean Git History):** When ready to publish open-source, use `git-filter-repo` or `git filter-branch` to purge the legacy coursework directories (`2ndYear_Networking1/` and `3rdYear_Networking2/`) from Git history entirely, retaining only the clean-room `labs/`, `projects/`, `docs/`, `learning-paths/`, and `tools/` directories.
  2. **Option B (Private Master / Sparse Public Mirror):** Maintain this repository as a private internal archive. Create a new public repository (`CyberSphinxxx/cisco-packet-tracer-library`) and push only the clean-room branch.
  3. **Option C (Branch Quarantine):** Move all legacy directories to an unmerged archival branch (e.g. `archive/academic-coursework-2024`) and remove them from `main`.

### Blocker BLK-002: Formal Open-Source License Confirmation
- **Severity:** **HIGH** (Governance & Legal Reuse)
- **Status:** Original documentation currently operates under `LICENSE_PENDING.md`.
- **Recommended Action:**
  - Owner to confirm license choice (e.g., Creative Commons Attribution-ShareAlike 4.0 International `CC-BY-SA-4.0` for documentation, and `MIT License` for Python tools).
  - Replace `LICENSE_PENDING.md` with standard `LICENSE` file.

### Blocker BLK-003: Physical Cisco Packet Tracer Desktop Execution
- **Severity:** **HIGH** (Simulator Pass Verification)
- **Status:** All 13 labs are currently verified statically against Cisco IOS documentation (`documentation: reviewed`), with simulator status transparently recorded as `simulator: not_tested`.
- **Action Required:**
  - Open each lab in Cisco Packet Tracer 8.2+.
  - Assemble device topologies per the specifications in each lab guide.
  - Save clean starter `.pkt` (with zero initial configuration) and completed `.pkt` (with verified operational configs).
  - Update `metadata.json` assets and promote `simulator` status to `tested_pass`.

---

## 4. Curriculum & Website Expansion Backlog (v1.1 / v2.0 Roadmap)

The following items are planned for future content sprints:

1. **Wireless LANs & WLC Architecture (Tier B / C):**
   - Author original lab: Standalone Access Point SSID & WPA2-Personal PSK configuration.
   - Author original lab: Cisco 3504 Wireless LAN Controller (WLC) with Lightweight APs (LAP) and RADIUS authentication.
2. **Network Address Translation (NAT / PAT) (Tier B):**
   - Author original lab: Static NAT for public server publishing.
   - Author original lab: Dynamic PAT (NAT Overload) sharing a single public IPv4 pool across an internal enterprise LAN.
3. **IPv6 Dynamic Routing (OSPFv3) (Tier C):**
   - Author original lab: Multi-router OSPFv3 routing for native IPv6 unicast forwarding.
4. **Website Portal Construction:**
   - Ingest `labs/` metadata and Markdown directly into an Astro / Starlight documentation theme.
   - Implement client-side search, interactive command copy blocks, and category filtering.
