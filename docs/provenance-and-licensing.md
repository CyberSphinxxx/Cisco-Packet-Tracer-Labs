# Provenance and Licensing Policy

This document details the ownership, provenance classification, and copyright boundaries governing the **Cisco-Packet-Tracer-Labs** educational collection.

---

## 1. Independent Educational Project
This repository is an independent educational library created for BSIT students and self-directed computer networking learners.

- **Non-Affiliation:** This project is not affiliated with, endorsed, sponsored, or certified by Cisco Systems, Inc., the Cisco Networking Academy (NetAcad), or CompTIA.
- **Trademarks:** "Cisco", "Packet Tracer", "IOS", and "CCNA" are registered trademarks or service marks of Cisco Systems, Inc. in the United States and other countries. They are used here solely for nominative educational reference under fair use.

---

## 2. Content Taxonomy and Standards

Every asset and lab in this library belongs to one of four transparent categories:

1. **`original`:**
   - Content conceived, structured, and authored independently by contributors and the autonomous maintenance agent.
   - Topologies, IP address schemes (using RFC 5737 / RFC 3849 documentation prefixes), configuration steps, and explanations are generated from primary technical standards (IETF RFCs, IEEE 802.3/802.1Q standards, Cisco official configuration guides).
   - Free from copied text, proprietary quiz prompts, or proprietary `.pka` scoring profiles.

2. **`permission_verified`:**
   - Third-party contributions where explicit, documented redistribution permissions or open licenses (such as CC-BY or MIT) have been verified.
   - Specific license text and upstream URLs are cited in the lab's `metadata.json`.

3. **`external_reference`:**
   - Curated references to official Cisco documentation, RFCs, or standard textbook curricula.
   - No proprietary binary assets or solutions are hosted in this repository; learners are directed to authoritative external sources.

4. **`restricted`:**
   - Content with uncertain copyright status, proprietary Cisco NetAcad `.pka` activity packages, institutional exam prompts, or files containing personal student submissions.
   - **Removal & Archival Policy:** All restricted legacy files were completely backed up to private owner archives and permanently expunged from the active working tree and Git history during Phase 11.5. No restricted materials are distributed or tracked in this repository.

---

## 3. Dual Licensing Structure

This repository operates under a clear open-source dual-license model:
- **Educational Content & Documentation:** Licensed under the [Creative Commons Attribution-ShareAlike 4.0 International Public License (CC-BY-SA-4.0)](https://creativecommons.org/licenses/by-sa/4.0/).
- **Automation & Quality Tooling:** Licensed under the [MIT License](https://opensource.org/licenses/MIT).
- See the root [LICENSE](../LICENSE) file for complete legal terms.

---

## 4. Simulator Verification Policy

To maintain absolute academic and technical honesty:
- **`tested_pass`:** The lab topology and configuration were executed inside an authentic instance of Cisco Packet Tracer, verified against real terminal outputs, and documented with test artifacts.
- **`not_tested`:** The lab was technically peer-reviewed against official Cisco IOS syntax and RFC networking standards, but has not yet been executed in a live Packet Tracer simulation instance by the maintainer.
- **No Fictional Verification:** Under no circumstances are terminal outputs fabricated or simulator green-checks falsely asserted.

---

## 5. Educational Security Notice
Example configuration passwords used throughout these labs (such as `cisco`, `class`, or `cisco123`) are **strictly for isolated simulation training**. They do not constitute secure production practices. In real-world environments, always use strong unique passwords, modern cryptography (RSA >= 2048-bit or ECDSA, AES-GCM), and centralized authentication (RADIUS/TACACS+).
