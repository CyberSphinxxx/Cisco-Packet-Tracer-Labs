# Owner decisions and blockers

| ID | Phase | Affected paths | Why blocked | Safe work possible | Owner/next action | State |
|---|---|---|---|---|---|---|
| B-001 | 00 | All `.pkt` / `.pka` binaries | Packet Tracer GUI / execution engine is not natively accessible via CLI tool in this environment | Author comprehensive text guides, verify Cisco IOS syntax via authoritative documentation, mark simulator status `not_tested` | User may perform simulator verification runs using manual runbook when desired | OPEN |
| B-002 | 00 | Remote origin / Website | Remote push, website creation, and public release are explicitly out of scope for this run | All local repository restructuring, documentation, test tooling, and verification | User will review and authorize any eventual remote push or site build | OPEN |
| B-003 | 01 | Legacy `.pka`, `.bak`, `.docx`, and student-authored files in `2ndYear_Networking1` and `3rdYear_Networking2` | Provenance/copyright status of NetAcad course assessment packages, exam docx, and student submissions requires formal review | Inventory all files with SHA-256; assign `restricted` status to third-party assessment/exam materials; design clean original equivalents | Owner to decide long-term retention or remediation of legacy files | OPEN |
