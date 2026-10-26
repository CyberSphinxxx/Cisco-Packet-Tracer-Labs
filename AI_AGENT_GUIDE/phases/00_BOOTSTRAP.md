# PHASE 00 — Bootstrap, guardrails and baseline

## Goal
Establish safe context and durable tracking. No content rewrite until baseline reviewed.

## Actions
1. Confirm root (`pwd`, `git rev-parse --show-toplevel`), branch (`git branch --show-current`), HEAD, remote, `git status --short`, `git ls-files` and file extensions/counts. Compare to observed 2026-10-26 baseline; document deviations.
2. Inspect existing `AGENTS.md` / `GEMINI.md` / `.agents/rules` for conflicting instructions. If no root instruction exists, create a *short root `AGENTS.md`* pointing to this guide and mandating phased gates; do not accidentally replace other rules.
3. Create state files from templates; actual inventory generated from disk. Do not write fake completed dates or presumed test results.
4. Create new local branch if safe and appropriate, e.g. `refactor/learning-library-v1`; record if staying on current branch due to dirty tree.
5. Confirm `python --version` (or `python3`) and verify existing `AI_AGENT_GUIDE/tools/validate_repo.py` runs in pre-migration mode without false failure if `labs/` absent.
6. Record unchanged baseline hashes of current binary assets and guide count.

## Acceptance and proof
- [ ] Workspace identified, branch/HEAD/remote recorded.
- [ ] User dirty changes not overwritten; no destructive command.
- [ ] Complete initial file inventory recorded (not just file names).
- [ ] State files initialized and self-consistent.
- [ ] Agent instruction discovery documented.
- [ ] Phase report includes commands and actual stdout summary.

`PASS` only if all. Otherwise `BLOCKED` with specific evidence. Then begin Phase 01.
