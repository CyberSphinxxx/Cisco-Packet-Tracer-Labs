# 12 — Acceptance matrix

| Gate | Proof required | Hard failure examples |
|---|---|---|
| G0 Safe baseline | clean branch, original Python tests, asset hashes and repo snapshot | old-history branch, erased .pkt, dirty unrelated work discarded |
| G1 Canonical ingestion | render PTL-0008 Markdown + metadata from root, no content copy; 13 lab discovery | duplicate hand-maintained JSON catalog, README frontmatter assumption |
| G2 Content graph | stable 13 labs, capstone, 3 paths, docs; reliable source route ID and links | title/slug mismatch, broken `.md` links, invalid assets accepted |
| G3 Functional shell | home/nav/footer/themes/mobile main layouts; actual renders reviewed | unreadable mobile, inaccessible nav, full page JS requirement |
| G4 Catalog | all records, facets, result count, query-state, reset, no duplicate cards | 13 manually hard-coded cards, filters wrong intersection |
| G5 Guide pages | full 11 sections, GFM tables/code, TOC, topology, config, verified downloads | missing anchors, stale sources, `.pkt` dead links |
| G6 Paths/projects/docs | 3 source-ordered paths, capstone and all selected docs render | retyped Markdown in site, missing prerequisites |
| G7 Search | Pagefind generated after build; query tests return valid deep links | client UI only, index missing or broken in preview |
| G8 Quality | responsive, keyboard/axe checks, SEO/canonicals, no large JS leaks, no private content | broken search menu, metadata only static, leaking AI logs |
| G9 CI/deploy-ready | existing Python gates + site check/test/build/e2e pass; Pages settings tested conceptually | release depends on local absolute path, broken Linux build |
| G10 Independent audit | checked source output, screenshots where available, test fixtures, concise report | earlier self-audit copied without rerunning |

## Mandatory end-to-end check list

- Exactly all real active labs and capstone have generated pages (current baseline 13+1).
- Each page has **starter** and **completed** downloadable `.pkt` with accurate URL/filename; verified source files remain identical.
- All 3 learning paths show content and working canonical lab links.
- All selected docs and capstone render with expected headings, images/tables/code blocks.
- New temporary lab fixture automatically appears and removal removes route without manual site code edits.
- Build must fail for duplicate ID, unsafe path, missing required asset, broken internal link.
- Pagefind exact keyword tests work on built output, not dev-only.
- No content duplication, no unapproved binaries, no CI regression, clean local Git status.
- Final `state/FINAL_REPORT.md`: every gate with date/command/evidence, any exceptions explicitly BLOCKED/FAIL.
