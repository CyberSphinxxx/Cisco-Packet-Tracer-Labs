# 01 — Existing repository contract

## Observed public baseline (2026-10-28)

Repo: https://github.com/CyberSphinxxx/Cisco-Packet-Tracer-Labs
Merged `main` SHA at kit design time: `234d9eedcc93ae0583eac2a319e5147ff3aaa6a2`. **Recheck live state** before branching; do not pin functional logic to this SHA.

- 13 canonical labs nested under `labs/<category>/<slug>/`.
- Each lab: `README.md`, `metadata.json`, `verification.md`, `configs/`, `assets/starter.pkt`, `assets/completed.pkt`, `assets/topology.png`.
- Project: `projects/small-office-network/` has README/verification/configs/assets.
- Three learning paths in `learning-paths/`: `networking-beginner.md`, `bsit-networking.md`, `ccna-aligned.md`.
- Root `docs/` contains reference pages and indexed lab listing; count from actual tree.
- Original PTL-0001 historical reference file `labs/routing/dual-stack-static-routing/dual-stack-static-routing.pkt` must remain unchanged (SHA-256 `8d7f62a8b4e36ef0a6efb613b92e84dbed3f1c34cb5d268b9d2b7db487680b31`).
- Existing `.github/workflows/validate.yml` invokes Python tests and validator; last release reports 29 tests. Reverify.
- Root `AGENTS.md` and `AI_AGENT_GUIDE` impose safety and preservation rules, continue to honor them.
- Original educational content and diagrams: CC BY-SA 4.0; automation scripts/tooling: MIT; independent of Cisco.

## Exact metadata fields currently present

`id`, `title`, `slug`, `category`, `summary`, `difficulty`, `topics[]`, `learning_objectives[]`, `estimated_minutes`, `activity_reference`, `packet_tracer_version`, `devices[]`, `source{type,origin,url,permission_evidence}`, `license_decision`, `assets{starter,completed,topology}`, `status{documentation,simulator,simulator_evidence}`, `references[]`, `last_reviewed`.

`assets.*` are paths **relative to the lab folder**. `status.simulator_evidence` currently may be a **repo-root-relative** path (e.g. `AI_AGENT_GUIDE/state/PTL-0008-SIMULATOR-RESULTS.md`). Distinguish these contexts; don't assume they use identical path semantics. `README.md` files generally **have no YAML frontmatter**, and independent JSON metadata is authoritative. Do not use a collection schema that requires frontmatter that does not exist.

## Constraints

- Add `site/` and limited CI/install docs; prefer not touching lab content.
- Preserve `AGENTS.md` semantics, `.gitignore`, original Python tooling.
- Do not use remote GitHub API for normal local static builds; all content exists in checked-out repo.
- Support Windows developer machine and Linux GitHub Actions/Cloudflare with path-safe `path`, `fileURLToPath`, `URL`, or equivalent.
- Never assume binary `.pkt` is text; do not parse, transform or auto-normalize it.
- Any discrepancy in existing docs should be logged separately, not silently rewritten by website-generation code.

## Baseline commands

`git status --short && git log -1 --oneline`
`python tools/validate_repo.py --root .`
`python -m unittest discover -s tests -p "test_*.py" -v`
`python tools/audit_repo.py`

Record raw exit statuses. GitHub status isn't proof of browser behavior.
