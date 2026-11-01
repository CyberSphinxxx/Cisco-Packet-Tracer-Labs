# 09 — End-of-batch and session audit

Every three *completed* labs, prepare `state/reviews/BATCH-XXX.md`, with:
- All new IDs and canonical folders; compare actual `.pkt` models to README/metadata, and lab distinctions to previous content.
- `git diff --stat origin/main`, name-status, and full source-tree additions. Existing lab files and `site/` source unchanged.
- Complete test command table, exit codes, test counts and timestamp. Python and Vitest from every lab; full Playwright and site build at batch boundary.
- Actual simulator verification transcript pointers, file reopen proof and checksum table. Review **not** just reports but saved projects where possible.
- Status and reason for blocked/unsupported tasks; queue never skips silently.
- Content/link checks, path and category constraints, privacy/rights review.
- Local commit SHAs and last safe Git HEAD; stop if unexpected commits/history changes occur.

Before ending session:
1. Ensure no uncommitted lab changes are left without explicit recovery notes. Never discard partially built work automatically.
2. Run `tools/queue.py status`, check remaining run budget, and update `state/LAST_HANDOFF.md`.
3. Provide a concise end report with `completed`, `blocked`, `pending`, `in_progress`, exact test results, and next resumable candidate.
4. Leave branch local. Never push, open PR or deploy automatically. Owner chooses when to review and publish.

**Acceptance criterion:** Each newly completed lab contains original accessible instructions plus real verified Packet Tracer artifacts and factual evidence. Quantity never overrides correctness.
