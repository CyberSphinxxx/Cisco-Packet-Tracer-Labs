# Phase 00 baseline: repository state, inventory, plan and risks

**Recorded:** 2026-10-28 08:26 UTC
**Base commit:** `234d9eedcc93ae0583eac2a319e5147ff3aaa6a2` (`main`, "Merge pull request #1 from CyberSphinxxx/feature/phase-12-simulator-labs")
**Feature branch:** `feature/astro-learning-platform` (created from that commit)

## 1. Execution environment (important for reviewers)

| Item | Observed |
|---|---|
| Owner machine | Windows (win32 x64), repo at `C:\L3mxr\Github Repositories\Cisco-Packet-Tracer-Labs` |
| Agent access to owner machine | File read/write bridge only. **No shell on the owner machine**: git, npm and Python cannot be run there by the agent. |
| Agent build/test machine | Linux cloud workspace, Node v22.23.4, npm 10.9.9, Python 3.13.18, Playwright Chromium preinstalled |
| How work reaches the owner | Commits are made in a Linux clone of the same repo, then delivered to the owner's folder as a Git bundle (`scratch/`, which `.gitignore` already ignores) plus state mirrors. Nothing is pushed. |

### Owner working tree vs. `main` (verified, not assumed)

- Local `refs/heads/main` = `refs/remotes/origin/main` = `234d9ee` (matches kit reference SHA). `HEAD` -> `main`.
- All 263 tracked files were staged from the owner's folder and compared with a fresh clone of `main`:
  **43 byte-identical** (all `.pkt` and `.png` binaries), **220 identical except CRLF line endings** (Windows checkout conversion), **0 different, 0 missing**.
- Untracked/ignored on owner machine: the agent kit folder `Cisco_Packet_Tracer_Astro_Claude_Opus_55_Agent_Kit/` (untracked), `Downloads/` (contains unrelated personal files; ignored on Windows because `.gitignore` has `downloads/` and `core.ignorecase=true`), empty `scratch/`, `tools/__pycache__/`, `tests/__pycache__/`.
- Conclusion: owner tree is clean `main` plus the untracked kit. Safe to branch. No other agent's in-progress work exists to preserve. Other local branches (`feature/phase-12-simulator-labs`, `refactor/learning-library-v1`) are untouched.

### Kit placement

The kit was extracted into a subfolder rather than the repo root. Its 40 files were verified against `MANIFEST_SHA256.json` (0 mismatches) and copied to the repo root on the feature branch (`CLAUDE.md`, `.claude/skills/website-build/`, `WEBSITE_AGENT_KIT/`), as the kit README instructs. The owner may drop them before merge if agent material should not live in `main` (precedent: `AI_AGENT_GUIDE/` is already tracked).

## 2. Baseline quality gates (Linux, base commit)

| Command (cwd = repo root) | Exit | Observed |
|---|---|---|
| `python3 tools/validate_repo.py --root .` | 0 | `Validation: 0 error(s), 0 notices` |
| `python3 -m unittest discover -s tests -p "test_*.py" -v` | 0 | `Ran 29 tests ... OK` |
| `python3 tools/audit_repo.py` | 0 | `AUDIT SUMMARY: Complete and Consistent`; starter 14/14, completed 14/14, topology 14/14, starter != completed 14/14, 3 learning paths |

Existing CI: `.github/workflows/validate.yml` (ubuntu-latest, Python 3.12, `contents: read`, actions `checkout@v4`, `setup-python@v5`) runs unit tests and validator on push to `main`/`refactor/**` and PRs to `main`. It does not run `audit_repo.py`.

## 3. Canonical content inventory (counted from the tree)

| Content | Count | Source paths |
|---|---|---|
| Labs | **13** | `labs/<category>/<slug>/{README.md, metadata.json, verification.md, configs/*.txt, assets/{starter.pkt,completed.pkt,topology.png}}` |
| Categories | 6 | `ip-addressing` (2), `network-fundamentals` (1), `network-security` (4), `network-services` (1), `routing` (3), `switching` (2) |
| Capstone | **1** | `projects/small-office-network/{README.md, verification.md, configs/R1,R2,S1.txt, assets/...}`. **Has no `metadata.json`** (title/status come from its README). |
| Learning paths | **3** | `learning-paths/{networking-beginner,bsit-networking,ccna-aligned}.md` |
| Reference docs | **8** | `docs/{getting-started,installation,cisco-ios-cheatsheet,troubleshooting,lab-index,coverage-matrix,migration-map,provenance-and-licensing}.md` (all 8 are linked from README "Quick Navigation") |
| Config files | 27 lab + 3 capstone (30) | `configs/*.txt` (corrected in Phase 02 from an earlier miscount) |
| Binary assets | **43** | 14 `starter.pkt`, 14 `completed.pkt`, 14 `topology.png`, 1 historical `labs/routing/dual-stack-static-routing/dual-stack-static-routing.pkt` |

- Lab IDs PTL-0001..PTL-0013, all unique; all `source.type = original`, `license_decision = approved_dual_license`, `status.documentation = reviewed`, `status.simulator = tested_pass`, `difficulty` in {beginner (4), intermediate (9)}, `estimated_minutes` 30-45, `packet_tracer_version = 8.2+`.
- Metadata keys present in all 13 files: exactly the 18 fields listed in kit `01_REPOSITORY_BASELINE.md`. `assets.*` are lab-folder-relative; `status.simulator_evidence` is repo-root-relative (`AI_AGENT_GUIDE/state/PTL-XXXX-SIMULATOR-RESULTS.md`).
- Lab READMEs have **no YAML frontmatter**; first line is the H1. They follow the 11-section order: Learning Objectives, Prerequisites, Topology, Addressing Table, Lab Tasks, Configuration Walkthrough, Verification, Troubleshooting, Key Takeaways, References, Files and Validation Status.
- PTL-0001 historical file SHA-256 `8d7f62a8...680b31` (64,145 bytes) **matches** the kit's expected value.
- Full binary checksum manifest: `WEBSITE_AGENT_KIT/state/baseline-checksums.json` (hashes only).

### Link survey across all 33 source Markdown files

| Target (resolved from source file) | Count | Website handling plan |
|---|---|---|
| `labs/**/*.md` (README / verification) | 59 | internal routes |
| `labs/**/*.txt` configs | 45 | copied config files + inline viewer |
| `labs/**/*.pkt` | 27 | exact-byte copies in build output |
| `labs/**/*.png` | 26 | exact-byte copies in build output |
| `docs/*.md` | 13 | `/docs/{slug}/` |
| `AI_AGENT_GUIDE/state/*.md` | 13 | **not published**; rewritten to the public GitHub blob URL |
| `projects/**` | 10 | capstone route / assets |
| `learning-paths/*.md` | 1 | `/learning-paths/{slug}/` |
| `LICENSE` | 1 | GitHub blob URL + `/about/` licensing |
| External https | 35 | preserved (cisco.com, ietf.org, ieee.org, netacad, skillsforall, creativecommons, opensource.org) |

The existing validator already reports 0 broken relative links, so the site resolver can treat any unresolvable link as a build failure.

## 4. Toolchain choice (verified against the npm registry on 2026-10-28)

| Tool | Version | Reason |
|---|---|---|
| Node | 22 LTS (>= 22.12.0) | Astro 7.3 engine floor; verified locally on 22.23.4 |
| Astro | **7.3.8** (released 2026-10-08) | Newest release older than two weeks. 7.4.x (2026-10-15..21) is too fresh and raises the Node floor to 22.23.4 |
| TypeScript | 6.0.x | `@astrojs/check@0.9.12` peer range is `^5 || ^6` (TypeScript 7 not yet supported) |
| Pagefind | 1.5.2 | static post-build search |
| Vitest / Playwright | current stable, pinned | unit/integration and browser E2E |

## 5. Implementation plan (compact)

1. **Phase 01:** scaffold `site/` (Astro static, TS strict). A custom build-time content module reads `../labs/*/*/{README.md,metadata.json}` via paths derived from `import.meta.url`, validates, renders Markdown with a unified/remark/rehype pipeline whose link/image rewriting is AST-based. Prove PTL-0008, then discovery of 13 labs + capstone.
2. **Phase 02:** full content graph: labs, capstone, paths (ordered link extraction from source Markdown), docs, verification pages, configs, binaries; strict failures for duplicates, missing assets, traversal, unsafe schemes and unresolved links; fixture-based tests including CRLF input.
3. **Phases 03-06:** design tokens and shell, catalog with URL-synced facets, full lab detail pages with downloads/TOC/topology, learning paths/capstone/docs/about/404.
4. **Phase 07:** Pagefind after build, accessible search dialog and page.
5. **Phases 08-10:** SEO/a11y/performance, CI workflow + Cloudflare Pages notes, adversarial audit, final report.

## 6. Risks

| Risk | Mitigation |
|---|---|
| Agent cannot run anything on the owner's Windows machine | Path handling via `node:path`/`fileURLToPath`, tests that simulate Windows separators and CRLF sources; Windows build listed as owner verification step in BLOCKERS |
| Owner checkout is CRLF | Parsers normalize line endings; CRLF fixtures in tests |
| `Downloads/` with personal files sits inside the repo folder | Site reads only allowlisted roots (`labs/`, `projects/`, `learning-paths/`, `docs/`); never globs the repo root; output audit checks for unexpected files |
| `AI_AGENT_GUIDE` links in every lab README | Rewrite to public GitHub URL; test that `dist/` contains no `AI_AGENT_GUIDE` files |
| Capstone lacks metadata | Derive its title/status from README; capstone assets by fixed convention; documented and tested |
| `AI_AGENT_GUIDE/11_WEBSITE_FUTURE_CONTRACT.md` said "do not create `site/`" for the earlier project | Superseded by the owner's explicit authorization in this session (recorded in DECISIONS) |
| Agent docs/kit committed to the branch | Owner can exclude before merge |
