# Phase 01 — INVENTORY_RIGHTS

Date (UTC): 2026-10-26
Git branch / HEAD before/after: `refactor/learning-library-v1` / `ac215e2646ad822ff571297d801ea79070c28a91`
Outcome: **PASS**

## Planned acceptance assertions
- [x] Every pre-existing tracked file has SHA256 and nonblank provenance row.
- [x] All files have unambiguous action and rights status.
- [x] Known/likely assessment content restricted unless redistribution permission recorded.
- [x] Public index contains no new restricted content (no restricted files migrated to `labs/`).
- [x] Clear plan for restoring original content and owner-only legal choices.
- [x] Per-file counts add up to actual tracked files (39 tracked files).

## Summary of Tracked File Audit
Total tracked files: 39
- **Rights status breakdown:**
  - `restricted`: 35 files (22 `.pka`, 4 `.bak`, 1 `.docx`, 10 student assignment files, 6 proprietary answer guides, 2 midterm exam files)
  - `original`: 4 files (`README.md`, 2 guides and 1 `.pkt` in `Step by Step Laboratory Activity`)
- **Action breakdown:**
  - `retain_legacy_pending`: 30 files retained in legacy directories without public promotion
  - `independently_rewrite`: 8 guides identified for clean-room original authoring in `labs/`
  - `eligible_move`: 1 file (root README.md, to be upgraded in Phase 08)
- **PII / Sensitive Material:**
  - 10 files contain personal name (`[STUDENT_NAME]`) in filename
  - 2 files contain university midterm laboratory exam prompt and answer guides
  - Example passwords (`cisco`, `class`, `ciscosecret`) identified in legacy guides; educational context noted

## Changed files
| Path | Action | Rationale | Rights |
|---|---|---|---|
| `AI_AGENT_GUIDE/state/inventory.csv` | create | Full 39-file inventory with byte size, SHA-256, rights, and action | original / state |
| `AI_AGENT_GUIDE/state/provenance.csv` | create | Provenance ledger with claimed owner, license URL, and review decision | original / state |
| `AI_AGENT_GUIDE/state/reports/PHASE-01.md` | create | Phase 01 evidence report | original / report |

## Tests actually executed
| Command | Observed exit | Evidence/output | Result |
|---|---:|---|---|
| Inventory CSV row count check | 0 | 39 data rows verified against `git ls-files` | PASS |
| Provenance CSV row count check | 0 | 39 data rows verified against `git ls-files` | PASS |
| `python AI_AGENT_GUIDE/tools/validate_repo.py --root .` | 0 | `0 error(s), 1 notices` | PASS |
| `python -m unittest discover -s AI_AGENT_GUIDE/tools -p "test_*.py" -v` | 0 | 12 tests passed in 0.250s | PASS |

## Checks NOT performed
- Packet Tracer GUI inspection of encrypted `.pka` files (Packet Tracer binary tools not executable in headless CLI environment).

## Issues / owner decisions
- B-003: 35 legacy files are classified as `restricted`. Owner must decide whether to retain these in legacy paths, request Git history redaction, or seek NetAcad licensing. Under no circumstances will restricted files be copied or migrated to public `labs/`.

## Gate
Result: **PASS**
Why: All 39 tracked repository files have been individually analyzed, hashed, classified by rights and origin, and assigned definitive actions. Zero restricted files will be promoted to public `labs/`.

## Next exact action
Proceed to Phase 02: ARCHITECTURE. Establish information architecture, template contracts, directory layout, and category validation.
