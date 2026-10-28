# 02 — Product requirements and user journeys

## Primary navigation

Home | Labs | Learning Paths | Reference Guides | Capstone | GitHub. Global search should be discoverable with a keyboard-accessible search trigger; mobile nav uses proper dialog/menu behavior, dismisses on Escape and on selection, and returns focus appropriately.

## Routes

- `/`: concise introduction, first lab CTA, featured beginner labs, topic/category overview, how-to-use flow.
- `/labs/`: searchable and facet-filtered catalog of all eligible labs; empty state, clear filters, result count, accessible ordering.
- `/labs/{category}/{slug}/`: documentation-rich lab detail; slug derived from canonical folder+metadata, not index position.
- `/learning-paths/` and `/learning-paths/{slug}/`: curated paths from source Markdown, with linked actual labs; avoid fake progress persistence.
- `/projects/small-office-network/`: capstone narrative, requirements, diagram, prerequisites, starter and solution downloads.
- `/docs/{slug}/`: existing reference docs from root `docs/`, excluding internal/agent-only material unless consciously curated.
- `/about/`: independence disclosure, credits, source, CC BY-SA and MIT delineation.
- `/404`: helpful recovery links.

## Learner journeys

1. New student: lands on home -> Getting Started -> Beginner Path -> PTL-0008 -> downloads starter -> reads tutorial -> verifies -> optionally accesses completed solution.
2. Topic search: enters “OSPF” -> receives PTL-0011 page with objectives, metadata, relevant matching terms, direct link.
3. Filtered discovery: “routing, intermediate, IPv6” shows applicable activity, correct count, and clear empty results.
4. Mobile learner: reads wide addressing table without layout overflow; can copy IOS code; diagrams can zoom; TOC can navigate.
5. Contributor: adds a valid new `labs/<category>/<slug>/README.md` plus `metadata.json` and assets -> builds site -> no new Astro pages or static catalog modifications required.

## Detail-page minimum

Breadcrumbs, H1 and short summary, ID/category/difficulty/minutes/status, objectives/prerequisites, genuine topology image with alt/caption, two **distinctly labeled** download actions, full 11-section Markdown tutorial in the same canonical order, inline tables/code, table of contents with working anchors, verification.md access, config files (view or download), official references, attribution, and bottom next-step navigation.

### Solutions policy

Make `starter.pkt` the dominant CTA and label `completed.pkt` as **Solution / Reference**. Offer a tasteful explanation or disclosure before exposing a solution, but never pretend a purely client-side hide is security. No account gate.

## Interaction quality

- Preserve filter state in URL query parameters when feasible, with browser back/forward behavior and shareable links.
- No hydration for content; use minimal JS for search/modal/filter/theme only where needed.
- No fictitious ratings, enrollments, success stats, completion percentages or social proof.
- Don’t advertise Packet Tracer binaries as runnable in the browser; they require the Cisco app.

## Explicit deferred features

Student accounts, real progress tracking, quizzes, forums, analytics integrations, ads, AI chatbot and dynamic API are future backlog items only, not Phase 13 acceptance requirements.
