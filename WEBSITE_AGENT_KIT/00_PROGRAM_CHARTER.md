# 00 — Program charter

## Why this exists

A GitHub-first original Cisco Packet Tracer learning library now contains 13 modular labs and a Small Office Capstone. The website makes the existing library discoverable, navigable and usable by learners. It is **not** a parallel content management system. The app reads the educational material at build time and remains lightweight enough for low-cost/free static hosting.

## Audience and goals

- BSIT students with no networking background: find a starting point and download a starter topology without accidentally seeing the answer.
- Learners preparing for foundational networking and CCNA-aligned subjects: browse by topic, difficulty, and lab progression.
- Student instructors: link to lab pages, diagrams, full guides and completed solutions with attribution.
- Open-source contributors: submit one lab folder and have the website discover it automatically after the repo CI passes.

## In-scope outcomes

- 14 canonical educational entities from current sources; 3 learning paths; docs reference pages.
- Automatic route generation and metadata-derived catalog (no hard-coded separate lab list).
- Fast, full-content HTML rendering at build time, SEO readiness, Pagefind static search, filters, mobile UX.
- Reproducible site build, meaningful automated coverage, CI integration and Cloudflare Pages setup notes.
- Owner-controlled release process; no production deploy in this phase.

## Explicit non-goals

- Generating additional Packet Tracer `.pkt` content or modifying existing verified binaries.
- Student login, accounts, progress synchronization, payments, LMS, database, backend search.
- Hosting Packet Tracer itself in browser, Cisco endorsement, scraping proprietary curriculum.
- Creating a new GitHub repo, duplicating all Markdown in `site/`, or writing page-by-page lab components.
- Paid services or API keys, analytics collection before owner consent, AdSense implementation during this phase.

## Design values

Clarity over cleverness; information density over huge whitespace; high performance; transparent simulation status; keyboard/screen reader friendliness; mobile usability; test evidence over claimed completion; content/route contracts that support 100+ future labs.

## Success definition

The 14 items render from source in a clean checkout; a new test lab auto-appears with no site code edits; all downloads work; search and filtering are useful; generated site is static and accessible; existing Python gates stay green; a full local test report is available. Local-ready is not equivalent to deployed-live.
