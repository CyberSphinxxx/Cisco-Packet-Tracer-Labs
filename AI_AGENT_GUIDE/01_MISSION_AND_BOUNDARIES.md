# Product specification and non-negotiable boundaries

## Audience and purpose
Primary: BSIT/CS students who need to learn Cisco Packet Tracer from first principles. Secondary: hobbyists and CCNA-aligned learners. The repo must support *practice → explanation → verification → troubleshooting* rather than just completed assessment answers.

## Expected user journeys
- New student installs Packet Tracer, chooses a beginner path, opens a lab, sees a diagram, loads starter, follows commands and understands why, tests, then compares with documented expected result.
- Student searches for exact legacy activity name/number or subject and reaches the correct canonical lab or an honest external link/rights notice.
- Maintainer contributes a lab using a template; CI rejects missing metadata/links and reviewer independently verifies the simulation.
- Future website can ingest lab metadata and Markdown without manual re-entry or duplicate copies.

## Product principles
1. Safety and copyright before breadth; technical correctness before appearance.
2. One canonical resource per concept; categories are stable while learning paths can reuse them.
3. English prose that is technically precise but readable to beginners. Define acronyms on first use.
4. Make success/failure observable: explicit expected outputs, failure cases, troubleshooting checks, and tested status.
5. Preserve working material and prior citations; provide migration maps and redirects for Markdown where reasonable.
6. Transparent provenance: original / explicit licensed permission / external reference / unreviewed restricted.
7. No private personal data, real secrets, false affiliations, copied instructor keys, or AI-generated claims of empirical testing.
8. Scope limits: **no frontend website, no advertisements, no database, no account system, no external deployment, no automatic GitHub pushes**. Only a website compatibility contract.

## Scope of completion
**Required:** audit all current files and document license status, design and implement new topic-first layout for eligible files, write/upgrade primary README and index, standardized guides for rights-cleared existing labs, contributor docs, working validation/test tooling, a prioritized original-content roadmap, and a selected set of source-backed original text labs. A small number of accurate guides is better than many placeholders.
**Conditional:** fully working new `.pkt`/`.pka` labs, screenshots and topology art, if and only if Packet Tracer is actually available and those files can be independently tested.
**Out of scope:** claiming full coverage of CCNA or all student courses without proof, matching/extracting Cisco assessment keys, mass scraping, publishing copyrighted copies.

## Definition of done
The final gate requires no unresolved critical issues in new public assets, no false test assertions, zero broken internal links in actively published content, accurate counts and indexes, reproducible validation, and documentation for each publishable migrated lab. If a legal/technical blocker remains, name it and do not mark those tasks done. State a truthful percentage or qualitative completeness; never pretend the entire networking discipline can be exhausted in one autonomous run.

## Agent working agreements
Default choices: keep repo public; use canonical kebab-case English slugs; use Python standard library for repo tooling where reasonable; use Markdown and `metadata.json` for each lab; CI workflows with minimal GitHub permissions; keep a local branch for transformations if possible. Ask for permission before any irreversible action (remote push, repository deletion, branch rewrite, licensing contested content, removal of active public artifacts).
