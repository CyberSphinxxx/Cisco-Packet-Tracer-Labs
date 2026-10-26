# PHASE 01 — Full file-by-file provenance and publishing-risk audit

## Goal
Know exactly what can be transformed/publicly distributed. This precedes any publishable migration.

## Actions
1. Walk every tracked file (39 at remote snapshot, actual local may differ), record path/bytes/SHA256/category/associated lab group/metadata/ownership in `state/inventory.csv`. Exclude agent's new files from 'legacy' counts.
2. For all `.pka`, `.pkt`, `.bak` and `.docx`, log if original or assignment pack, and inspect when tool allows. **No assumptions from filename.** Verify that text/course materials with 'instructor'/exam answers are suitable and licensed.
3. Create `state/provenance.csv`. Default unclear ownership = `restricted`; list credible permission evidence or original authorship. Do not fabricate permissions.
4. Compare similar activities: configure/implement/troubleshoot EtherChannel are distinct by default. Compare binary SHA256 only to detect byte-identical duplicates, not course equivalence.
5. Scan published text and assets for student names, real credential strings, embedded teacher/exam material; treat classroom example passwords as educational but label them insecure lab-only.
6. Decide per file: `retain_legacy_pending`, `eligible_move`, `independently_rewrite`, `outbound_reference_only`, or `review_for_removal` (removal owner-only if not approved). Do not move restricted content into new public library/index.
7. Write rights summary and owner approval questions in `BLOCKERS.md`. If a license selection is missing, record rather than invent one.

## Acceptance and proof
- [ ] Every pre-existing tracked file has SHA256 and nonblank provenance row.
- [ ] All files have unambiguous action and rights status.
- [ ] Known/likely assessment content restricted unless redistribution permission recorded.
- [ ] Public index contains no new restricted content.
- [ ] Clear plan for restoring original content and owner-only legal choices.
- [ ] Per-file counts add up to actual tracked files.

`PASS` possible with rights blockers (if they are documented and restricted files aren't newly republished). The overall content migration remains partial until owner resolves them.
