# Evidence ledger

Format: `[UTC time] [phase] [commit] [command / action, cwd] [exit/result] [pass/fail]`. Linux = agent workspace (Node 22.23.4, Python 3.13.18). Nothing here was run on the owner's Windows machine unless stated.

- E-001 [2026-10-28 08:20] [00] [234d9ee] Read owner `.git/HEAD`, `refs/heads/main`, `refs/remotes/origin/main`, `FETCH_HEAD` via file bridge -> all `234d9ee`, HEAD=main. PASS
- E-002 [08:21] [00] [234d9ee] `git clone https://github.com/CyberSphinxxx/cisco-packet-tracer-labs` (Linux) -> HEAD `234d9ee`, 263 tracked files. PASS
- E-003 [08:24] [00] [234d9ee] Staged all 263 tracked files from owner folder, byte-compared with clone -> 43 identical, 220 CRLF-only, 0 different, 0 missing. PASS
- E-004 [08:25] [00] [234d9ee] Kit verification against `MANIFEST_SHA256.json` -> 40 files, 0 mismatches. PASS
- E-005 [08:25] [00] [234d9ee] repo root: `python3 tools/validate_repo.py --root .` exit 0 (`0 error(s), 0 notices`); `python3 -m unittest discover -s tests -p "test_*.py" -v` exit 0 (`Ran 29 tests ... OK`); `python3 tools/audit_repo.py` exit 0 (`Complete and Consistent`). PASS
- E-006 [08:26] [00] [234d9ee] SHA-256 of 43 tracked binaries -> `state/baseline-checksums.json`; PTL-0001 historical file `8d7f62a8b4e36ef0a6efb613b92e84dbed3f1c34cb5d268b9d2b7db487680b31` matches kit. PASS
- E-007 [08:33] [01] [a90bdbb+wip] `npm install --save-exact ...` in site/ -> 416 lockfile packages, `npm query` finds 0 install/preinstall/postinstall scripts; lockfile includes `@pagefind/windows-x64`. PASS
- E-008 [08:35] [01] [wip] First load surfaced a schema defect: topic `802.1q-trunking` rejected by an over-strict slug regex; topic pattern relaxed to match the Python validator. FIXED
- E-009 [08:36] [01] [wip] site/: `npx vitest run` -> 7/7 passed (13 labs by folder join, PTL-0008 headings/links/images/downloads, capstone+3 paths+8 docs, 43 baseline hashes, determinism, no copied content). PASS
- E-010 [08:37] [01] [wip] `git check-ignore` showed root `.gitignore` rule `lib/` hid `site/src/lib/` (would have dropped the content module from commits). Fixed with `site/.gitignore` `!/src/lib/`; dist/node_modules/.astro still ignored. FIXED
- E-011 [08:38] [01] [wip] site/: `npx astro check` -> 0 errors 0 warnings (after adding @types/node 22.20.5, @types/mdast, @types/hast). `npm run build` exit 0 (13 pages + 77 files, Pagefind indexed 13 pages). Python check: 43/43 `dist/` binaries equal baseline SHA-256. `astro preview`: `curl` starter.pkt HTTP 200, 44426 bytes, SHA-256 identical to source. PASS
- E-012 [08:39] [01] [wip] Chromium (Playwright 1.63) at 1280px on preview `/labs/network-fundamentals/ios-navigation-and-initial-config/`: HTTP 200, single H1, topology image loaded (naturalWidth > 0), 0 console errors, no horizontal overflow; screenshot inspected (unstyled, as expected before Phase 03). PASS
