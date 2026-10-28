# Evidence ledger

Format: `[UTC time] [phase] [commit] [command / action, cwd] [exit/result] [pass/fail]`. Linux = agent workspace (Node 22.23.4, Python 3.13.18). Nothing here was run on the owner's Windows machine unless stated.

- E-001 [2026-10-28 08:20] [00] [234d9ee] Read owner `.git/HEAD`, `refs/heads/main`, `refs/remotes/origin/main`, `FETCH_HEAD` via file bridge -> all `234d9ee`, HEAD=main. PASS
- E-002 [08:21] [00] [234d9ee] `git clone https://github.com/CyberSphinxxx/cisco-packet-tracer-labs` (Linux) -> HEAD `234d9ee`, 263 tracked files. PASS
- E-003 [08:24] [00] [234d9ee] Staged all 263 tracked files from owner folder, byte-compared with clone -> 43 identical, 220 CRLF-only, 0 different, 0 missing. PASS
- E-004 [08:25] [00] [234d9ee] Kit verification against `MANIFEST_SHA256.json` -> 40 files, 0 mismatches. PASS
- E-005 [08:25] [00] [234d9ee] repo root: `python3 tools/validate_repo.py --root .` exit 0 (`0 error(s), 0 notices`); `python3 -m unittest discover -s tests -p "test_*.py" -v` exit 0 (`Ran 29 tests ... OK`); `python3 tools/audit_repo.py` exit 0 (`Complete and Consistent`). PASS
- E-006 [08:26] [00] [234d9ee] SHA-256 of 43 tracked binaries -> `state/baseline-checksums.json`; PTL-0001 historical file `8d7f62a8b4e36ef0a6efb613b92e84dbed3f1c34cb5d268b9d2b7db487680b31` matches kit. PASS
