# 05 — Quality gates, exact command profiles and stop policies

A lab is `completed` only when **every mandatory source validation and simulation gate passes**, with actual exit codes recorded. No changing expected results just to make them green.

## Every lab — repo root

```powershell
python tools/validate_repo.py --root .
python -m unittest discover -s tests -p "test_*.py" -v
python tools/audit_repo.py
git diff --check
```

Also independently compare pre-existing binary SHA-256 baseline; ensure zero existing labs/capstones modified and no unexpected `site/` edits. Run an exact scoped diff against `origin/main`. Require unique ID, metadata and route.

## Every lab — site/ (can be slower)

```powershell
npm run check
npm test
npm run build
npm run verify:dist
```

Do not run `npm ci` repeatedly. Run `npm ci` once per environment if dependencies are absent or corrupted, only after ensuring lockfile is part of trusted repository state. If website build cannot run, do not claim it passed; record blocker and do not `pass` candidate until required gate is available unless owner explicitly changes policy.

## Every batch of three COMPLETED labs — site/

```powershell
npm run test:e2e
```

Playwright is required at batch boundaries. Run real browser tests on built site; record totals `passed/skipped/failed`, exact command and any environment issue. A `test:e2e` subset is not proof of full suite. Do not change test code to conceal failures or to match a wrong implementation.

## Independence / evidence

- Verify all new lab routes generated and all starter/solution/topology files resolve byte-identically in `dist/`.
- Read lab README and starter as a learner: commands, IP addresses, topology screenshot and task sequence agree.
- Verify positive and negative tests from the reloaded project. Broken behavior is not documentation-only.
- Check license and rights: no `.pka`, restricted materials, user identities, private IP credentials exposed, or unknown binaries.
- Run `tools/queue.py complete` *after* a local commit and with actual evidence path. `queue.py` only checks structural metadata/assets, never acts as proof of simulator tests.

## Failure actions

1. One failed test: capture command/exit code and root cause, attempt a focused fix, retry same task within bounded attempts.
2. Inability to run mandatory quality gates: mark `blocked`, do not publish/complete.
3. Three consecutive blocked tasks or eight total blocked tasks per session: stop and write handoff (policy defaults).
4. Any user approval request (credentials, system settings, remote publish, new bridge): checkpoint and stop.
5. Environment bridge failure: at most 3 reconnect attempts and stop.
