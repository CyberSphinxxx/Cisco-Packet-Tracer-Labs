# Independent audit (Phase 10)

**Reviewer:** a separate agent with no access to the builder's conversation, working read-only on its own fresh clone at `43675c7` (`/tmp/.../audit-clone`), with `12_ACCEPTANCE_GATES.md`, `13_INDEPENDENT_AUDIT.md`, `REVIEW_PROMPT.md` scope.
**Date:** 2026-10-28 (UTC). **Reviewer verdict at 43675c7:** `PARTIALLY_READY_WITH_BLOCKERS` (one blocker).
**Builder follow-up:** all findings fixed in `afe9882` and re-verified (below).

## What the reviewer confirmed independently (at 43675c7)

- All commands exit 0: `astro check` (0 errors), Vitest 64/64, build (52 pages), `verify:dist` (0 failures), Playwright 132 passed + 10 by-design skips, Python validator / 29 unit tests / audit.
- No content duplication: 1,811 sentence prefixes from canonical Markdown/metadata searched in `site/src`, `site/public`, `site/README.md`: 0 hits. Labs reach pages only via folder scan + metadata join.
- Adversarial content: new lab (new category) auto-appears and disappears; metadata title change propagates; deleting a declared `.pkt` fails the build naming the file; traversal (plain and `%2e%2e`), `javascript:` (several encodings), `vbscript:`, `data:` image, missing same/cross-document anchors, links into `site/` and `.git/` all fail the build; duplicate id fails.
- Built output: no `.md`/`.pka`/`metadata.json`/agent files, no build-machine paths; 43/43 `.pkt`/`.png` hashes equal source; noindex/robots/no-sitemap without origin; correct canonical/sitemap with origin and `PTL_BASE`.
- Original `validate` CI job unchanged; action SHAs match real tags; canonical folders unchanged vs `234d9ee`.

## Findings and resolution

| ID | Severity | Finding | Fix (afe9882) | Re-verification |
|---|---|---|---|---|
| D1 | Blocker | Catalog JSON `<script>` embedded metadata without escaping `<`; a summary containing `</script><script>...` executed (`window.__pwned === 1`) | `scriptJson()` escapes `< > &` and U+2028/2029 for catalog data and JSON-LD | Reviewer's payload rebuilt and loaded in Chromium: `window.__pwned` undefined on `/labs/`, the lab page and category page; payload shown as text; integration test with hostile summary through a real build |
| D2 | Major | CSP generator hashed every inline script in `dist`, so injected scripts were trusted | Only `data-csp-allow` scripts are hashed; any other executable inline script fails the build; quote-aware tag scanner; bundled scripts never inlined | 1 CSP hash in the build; unit tests for allow-list, refusal, attribute/comment false positives; CSP browser test still 0 violations |
| D3 | Minor | `assets.*` with `..` read files outside the lab and failed with an unclear Astro error; no starter != completed check | Schema rejects `..`; resolved path confined to lab folder with a content error naming metadata; identical starter/completed rejected for `tested_pass` | Unit tests |
| D4 | Minor | `check-dist` false failures with non-root `PTL_BASE` | URL-to-file mapping ignores base directory | `PTL_BASE=/cpt/` build: 3,217 links, 0 failures |
| D5 | Minor | Copy button covered the first code line | Code blocks reserve top padding when the button is shown | Geometry check: 0 of 32 blocks overlap at 390 and 1280 px |
| D6 | Minor | About wording: other simulator statuses ignored; `.pkt` licensing stated more specifically than LICENSE; attribution holder | Wording aligned with LICENSE ("topologies and diagrams, as described in the LICENSE"); all statuses listed; credit "Cisco Packet Tracer Labs Contributors" | Reviewed page text |
| D7 | Minor | CI checkout persisted credentials; `.nvmrc` not exact | `persist-credentials: false`; `.nvmrc` = 22.23.4 | YAML parsed; clean-clone CI simulation |
| D8 | Trivial | Unused imports | Removed | `astro check` 0 errors 0 warnings 0 hints |

Additional builder finding during the fixes: the shell input path had converted `\u` escapes into raw characters in two regexes (functionally identical); escapes restored and all authored files scanned for unexpected non-ASCII.

## Post-fix verification (afe9882)

Linux workspace: `astro check` 0/0/0; Vitest 70/70; build 52 pages, Pagefind 40 pages, 1 CSP hash; `verify:dist` 3,217 links + 1,443 fragments, 0 failures; Playwright 132 passed + 10 explicit skips; Python validator 0 errors, 29 tests OK, audit Complete and Consistent; `git diff 234d9ee` over all canonical folders, root README and LICENSE empty. Fresh-clone CI simulation (`CI=true`): `npm ci`, `check`, `test`, `build`, `verify:dist`, `test:e2e` all exit 0.

## Not verified by reviewer or builder

Windows-native build; GitHub-hosted CI; Cloudflare's application of `_headers`; opening `.pkt` files in Packet Tracer.
