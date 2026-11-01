# 02 — Canonical curriculum graph and contribution contract

The current repo is an Astro content-driven website. **Canonical:**

```
labs/<existing-category>/<unique-slug>/README.md
labs/<existing-category>/<unique-slug>/metadata.json
labs/<existing-category>/<unique-slug>/verification.md
labs/<existing-category>/<unique-slug>/configs/<device>.txt
labs/<existing-category>/<unique-slug>/assets/starter.pkt
labs/<existing-category>/<unique-slug>/assets/completed.pkt
labs/<existing-category>/<unique-slug>/assets/topology.png
AI_AGENT_GUIDE/state/PTL-XXXX-SIMULATOR-RESULTS.md
```

Also update only root canonical `docs/lab-index.md`, `docs/coverage-matrix.md`, and the appropriate existing `learning-paths/*.md`. Do not duplicate content under `site/` or hand-edit generated HTML/search artifacts. Paths, URLs and sibling metadata must be consistent. The Astro build discovers every reviewed canonical lab automatically.

**Valid category slugs (as in the current Python validator):** `network-fundamentals`, `ip-addressing`, `switching`, `routing`, `network-services`, `network-security`, `wireless-wan`, `troubleshooting`. Do not invent `wireless` or `security` categories. If the task suggests another category, map it to the most accurate existing category, and record why. Never modify validator schemas without approval.

**Metadata:** Copy and adapt the *current* schema from `site/src/lib/content/schema.ts` and one actual adjacent `metadata.json`. Use `source.type=original`, honest origin/reference, documentation `reviewed` only after review, simulator `tested_pass` only when the evidence is real. `status.simulator_evidence` points to an existing repository-root-relative evidence file. Title, category, slug, ID, topics, objectives, estimated_minutes, asset paths, reference URLs, date and device list all reflect the actual lab. Slugs must be globally unique. The queue contains no authoritative slug; choose one after topology validation.

**11 canonical H2 headings, in order:** Learning Objectives; Prerequisites; Topology; Addressing Table; Lab Tasks; Configuration Walkthrough; Verification; Troubleshooting; Key Takeaways; References; Files and Validation Status. The README H1 is `PTL-XXXX: <title>`. No Markdown frontmatter is required. Never omit a heading just because part of a simulator feature was unavailable. Instead reduce scope truthfully or block the lab.

**Student experience:** Starter = correctly pre-cabled, baseline only; student tasks remain intentionally incomplete. Completed = actual functioning answer. The two files must differ. The README must not contradict the starter baseline. Include device CLI mode prompts only when correct; provide good examples of expected results but label examples clearly. Keep language simple, concept-first, with actual expected network behavior rather than just copy-pasted command lists.

**Topic distinction:** Before authoring, compare previous labs and this queue. Require a unique learning outcome or authentic troubleshooting scenario. Do not produce 36 cosmetic variations of VLAN+ping. The backlog is prioritized, but capability/support gate may skip high-risk topics. Every new lab adds educational value over already published lessons.
