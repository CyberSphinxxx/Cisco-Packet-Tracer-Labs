# Copyright, course materials, security and distribution gate

**This is a policy for content review, not legal advice.** Being viewable/downloadable on the web does not imply a redistribution license. Third-party coursework including Cisco/NetAcad Packet Tracer activities, `.pka` assessment files, screenshots, instructor answers, solution keys and site content may be copyrighted. Cisco's published guidelines restrict reproduction/distribution of course materials absent applicable permission. https://www.cisco.com/c/en/us/about/brand-center/copyright-use.html

## Status taxonomy (required for every file/lab)
- `original`: independently authored by contributor; no copying or derivative of restricted third-party assessment package. Source material may inform technical facts but text/art and network topology independently authored.
- `permission_verified`: a third-party asset with concrete redistribution authorization. Log owner, license/permission URL, scope, date and evidence; obey attribution/license conditions.
- `external_reference`: a link to a third-party website/course; **do not host files or reproduce the solution**. Confirm URL appropriate and describe it as a reference.
- `restricted`: permission uncertain, provenance not verified, personal/instructor/exam material or suspected unauthorized copy; exclude from publishable index and prevent new redistribution.

`source.type` and `license_decision` belong to metadata. A license declared for original repository docs does not magically cover bundled Cisco/course binary assets.

## Mandatory provenance audit
For EVERY current file: record path, hash, potential owner/origin, rights, source URL if identifiable, personal names/sensitive material, proposed action. Do not treat a past GitHub commit as permission. Do not strip notices, bypass login, scrape paywalled material, download/host assessment files without explicit redistribution rights, or transcribe copyrighted materials into a 'new' guide.

## High-risk content types
- `.pka` originally from official education assignments: default `restricted` pending verifiable permission.
- Files called 'instructor', 'answer key', or 'midterm exam': treat as `restricted` pending owner verification and publication appropriateness.
- ITExamAnswers/other answer sites: **topic discovery and optional outbound links only** unless there is a specific permission for particular content. No bulk crawling, wholesale copying, or paraphrase laundering.
- Third-party images: no rehosting without documented license; use own topology diagrams or link externally according to rights.
- Network configs containing `password cisco`, `class`, etc.: document as **lab-only examples** and distinguish modern security guidance; do not commit real credentials.

## Resolution actions
1. Original: document authorship and original scope; optionally publish after technical/QA approval.
2. Permission verified: document evidence, notice, attribution and exact redistribution rights.
3. External reference: publish an original overview/independent concept practice or outbound-only entry; don't list unhosted binaries as downloadable.
4. Restricted/unknown: record private/local blocker and exclude from promotion or migration into a new public folder. **Moving it into another location in the same public repo does not make it private**. Notify owner that original public distribution may need remediation. Deletion, purging Git history or contacting rightsholders requires owner decision. Never falsely declare the legal issue solved by adding a disclaimer.

## Publishing principles
Every public lab must have non-`restricted` source status, substantive original learning value, clear attribution, a no-affiliation statement, no real personal data/secrets, and an honest validation status. Before a new lab is considered finished, audit all copied commands, images and copied file bytes. Original functional networking commands may be factual/common, but do not copy narrative, screenshots or proprietary exercise packaging.

## Attribution and trademark language
`Cisco` and `Packet Tracer` refer to their respective owners. State in README that this is an independent community educational resource, not sponsored, endorsed, or affiliated with Cisco. Don't invent Cisco partner badges.
