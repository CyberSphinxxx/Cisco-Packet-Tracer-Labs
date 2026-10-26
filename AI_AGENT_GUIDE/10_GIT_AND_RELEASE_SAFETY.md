# Git change management in a repository with existing visitors

1. At Phase 0 inspect `git status --short`, branch, remotes, `git log --oneline -5`, `git ls-files`. If dirty, preserve all uncommitted modifications and don't assume they're yours. Work on a dedicated branch e.g. `refactor/learning-library-v1` if safe; no checkout if it would overwrite conflicts.
2. Avoid `git reset --hard`, `git clean -fd`, `git push --force`, rewriting history, deleting current repo, or overwriting remote work. No remote push/PR/merge unless specifically authorized.
3. Change in coherent commits: audit docs; schema/tools; rights-cleared migration; revised guides; index and CI. Each commit must have tests/evidence if applicable. Don't auto-commit files from a user-dirty worktree without isolating.
4. Binary handling: preserve and compute SHA-256 before and after any authorized `git mv`; no implicit renaming `.pka` to `.pkt`, no deletion of potentially unique `.bak` without proof and owner consent.
5. The current repository name `Cisco-Packet-Tracer-Labs` is already renamed; **do not rename again** without request.
6. Old deep GitHub file URLs do not automatically redirect after moving files; use a migration map and keep bridging Markdown pages where appropriate. External sites may link directly to binary paths; document potential breakage and avoid breaking established public URLs unnecessarily.
7. Licenses: create a LICENSE for the owner's original writings only with explicit chosen terms; without owner license selection, put clear `LICENSE_PENDING.md` or a provenance statement, do NOT silently apply MIT/CC-BY to Cisco artifacts.
8. Before any remote publishing action obtain user permission, check `git diff --check`, tests, paths, copyright/PII, commit tree, binary sizes, GitHub Actions permission, secrets, and release notes.
9. No collection of personal exam records, grades, credentials, student names or embedded grading keys; redact only with explanation, preserve raw files locally and request consent for permanent removal.
10. If existing published material seems unauthorized, prioritize communicating remediation options; a local untracked quarantine is not equivalent to removing existing public GitHub copies/history.
