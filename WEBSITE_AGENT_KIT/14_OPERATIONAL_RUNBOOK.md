# 14 — Local operating and handoff runbook

## Day 1 start

- `git status` clean; verify remote and `main` head.
- Make new feature branch; do not reset or delete old ones.
- Claude Code from repo root on Opus 5.5. Choose High effort for architecture/complex integration if budget allows. Start with `START_PROMPT.md`.
- Existing `AGENTS.md` still applies; this start prompt explicitly permits **local** website coding, not remote release.
- Preserve agent's work by periodic small local commits, not huge all-at-once commits.

## Resume

Paste `CONTINUE_PROMPT.md` in a new Claude Code session. Read state and actual working tree; proceed from first unfinished gate. An interrupted process cannot continue while no session/automation is running.

## Testing commands after implementation

From repository root:

```sh
python tools/validate_repo.py --root .
python -m unittest discover -s tests -p "test_*.py" -v
python tools/audit_repo.py
cd site
npm ci
npm run check
npm run test
npm run build
npm run test:e2e
```

Agent must implement these scripts; if a script is deliberately named differently, document and test the final canonical commands. Do not present a skipped test as PASS.

## Windows and Linux

Use Node LTS, cross-platform path handling, `npm` lockfile, portable CLI tools. Avoid shell syntax that assumes Bash inside Windows documentation; provide PowerShell equivalents where needed. CI runs on ubuntu-latest; test both formats where possible.

## Cloudflare Pages (later approval)

Connect existing repo; checkout includes root content; root directory repo root; build command `cd site && npm ci && npm run build`; output `site/dist`. Verify this with official current docs and a preview deployment before claiming production-ready. Production domain and canonical origin are owner decisions.

## Permissions

You may allow normal local file modifications and safe package installs in Claude's normal permission flow. Do not give blanket dangerous bypass, expose MCP network listener, force push, deploy or provide production secrets. Do not grant the agent access to unrelated personal folders.

## Completion communication

Final report should answer: what exactly was built; what content discovered; what commands passed/failed; what pages/downloads were checked; how to run locally; current branch and commits; why it isn't deployed yet; remaining action for owner review.
