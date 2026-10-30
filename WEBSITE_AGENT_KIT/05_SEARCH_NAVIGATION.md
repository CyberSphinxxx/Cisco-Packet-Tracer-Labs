# 05 — Search, filters and navigation contracts

## Global full-text search

Use Pagefind indexing on the **built** Astro HTML (`astro build` THEN `pagefind --site dist`) and ship its generated assets with the published static site. Include lab titles, objectives, headings, content sections, docs, capstone and learning paths; avoid indexing duplicate navigation boilerplate when possible. All search results should link to actual generated pages and section anchors.

- Accessible search modal/page, keyboard focus, Escape close, empty query/empty results, consistent results count.
- Consider Pagefind filters (category, difficulty, type) encoded as valid metadata in generated pages, avoiding separate search backends.
- Build and smoke-test search for exact queries: `OSPF`, `DHCP relay`, `VLAN`, `IPv6`, `ACL`, `Packet Tracer installation`.
- Ensure search works on a **built/preview server**, not just `astro dev`; Pagefind is post-build by design. Development search can degrade with a clear note if necessary.

## Lab catalog filtering

Metadata-sourced filters: category, difficulty, topics, minimum/maximum estimated minutes where useful, tested status. Sync URL query state, no broken back/forward, combined facets use intersection semantics, categories displayed only from valid content. Sort options: recommended/learning order if grounded, alphabetical, estimated time, difficulty; never invent popularity rankings.

At 13 labs, show meaningful navigation and result count without unnecessary virtualization or heavyweight client-side frameworks. Keep filter logic in a small testable module and render catalog entries from build-time data.

## Learning-path navigation

Three existing learning paths are manually curated in root Markdown. Extract their order and route links, not inferred order from lab IDs. Render original explanatory text and linked steps. Capstone prerequisites link to valid labs, preserve original anchors. Add related labs sourced from topics/category and graph relationships, not a second manually curated catalog.

## Test cases

All filters empty -> all eligible labs. Combining difficulty+category reduces to correct intersection. Reset restores full set and clears URL. Unknown category query falls back safely. Back/forward restores state. Search excludes non-public agent files. Search results navigate to valid route or heading ID. No duplicate indexing of identical Markdown source through a second copied page.
