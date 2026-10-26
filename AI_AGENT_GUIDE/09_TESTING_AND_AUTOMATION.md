# Checks, tools, CI, change impact and evidence

## Minimum local check battery
Run from repository root after Phase 2+:
```bash
python AI_AGENT_GUIDE/tools/validate_repo.py --root .
python -m unittest discover -s AI_AGENT_GUIDE/tools -p 'test_*.py' -v
# after migration, optionally add a stable project alias:
python tools/validate_repo.py --root .
```
Create `tools/` wrappers/copies only once, with no divergent duplicate source. Enhance validator to assess: schema, permitted category, required field types/status, referenced assets, relative README links, index targets, duplicate IDs/slugs, missing image alt text where machine-verifiable, unsupported unsafe/traversal paths, and published-with-restricted-source violations. Use standard library if possible; pin dependencies if adding external lint tools.

## Unit tests and fixtures
At minimum test: valid original lab, missing metadata, malformed JSON, missing required section, missing linked starter, restricted source with published status, external_reference listing a local binary, duplicate IDs, path traversal, broken relative links, lowercase slug rules. Keep sample fixtures offline; no access tokens.

## CI
Github Actions workflow (`.github/workflows/validate.yml`) for `push` and `pull_request`, minimal read-only permissions, pinned/appropriate stable Python version. Commands identical to local checks, clear failure output, optional Markdown lint/link checker only if it runs offline or gracefully handles external rate limits. Do NOT make CI depend on Packet Tracer executable (proprietary GUI not normally available on GitHub runners).

## Phase gates (always record result)
- Phase 00: safety baseline, state files, no destructive changes.
- Phase 01: EVERY tracked file inventoried and provenance category assigned, unknowns explicitly restricted, zero accidental publication.
- Phase 02: schema/templates/paths defined, example metadata can validate, no invented lab count.
- Phase 03: reversible moves only for rights-cleared files; old-to-new map and working links; no binary loss, hashes checked.
- Phase 04: all publishable legacy labs upgraded, each content rubric evaluated; unreviewed ones excluded from public list.
- Phase 05: independent technical audit across all published/ready docs; high-severity issues resolved; simulator claims proven.
- Phase 06: selected original new-topic guides meet rubric and source quality, clear test status. No forced quantity target.
- Phase 07: validator and unit tests pass, CI file valid, checking does not claim hardware/simulator test.
- Phase 08: README/index accurate, links and counts correct, contributors/policy docs present, licensing notes.
- Phase 09: independent fresh audit, full checks pass for public content, status truthful, release recommendations not automatically executed.

## Evidence package
Every phase report must contain: baseline HEAD, changed paths, summary of verification, exact command(s), result (PASS/FAIL/BLOCKED), reproducibility notes, unsupported assumptions, blocker list and cleanup recommendation. For simulator tests require exact Packet Tracer version, test topology path, date/tester and command/packet evidence. Screenshots without explanation are weak evidence.

## No faked green builds
Tool absence means `BLOCKED`, not `PASS`. Warnings in a validator must remain visible; do not silence tests for prettier reports. Do not mark unverified inferences as observed outputs.
