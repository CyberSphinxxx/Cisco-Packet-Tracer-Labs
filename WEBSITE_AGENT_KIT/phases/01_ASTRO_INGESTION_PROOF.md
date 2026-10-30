# Phase 01 — Astro bootstrap and canonical-content proof

**Outcome:** Real PTL-0008 renders from its original `labs/.../README.md` and adjacent JSON, with topology image and real .pkt download URLs; no Markdown copy.

Tasks: scaffold `site/` TypeScript Astro static app with reproducible lockfile. Set up content collection/custom loader to read root files using OS-portable absolute paths. Study Astro `glob` loader behavior and custom loader rendering; join README with JSON by relative folder path, validate schema, implement one dynamic route. Render PTL-0008 by source, expose `starter.pkt`, `completed.pkt`, `topology.png`, original config links with correct source semantics. Test that page HTML actually includes objectives, headings and proper links. From clean checkout run `npm ci && npm run build`. Add test demonstrating no `site/`-managed copy.

**Gate:** one full real lab visible in built preview, canonical Markdown consumed directly, 13 lab records discovered, all outputs deterministic, test data proves correct link/image mapping. Do not build generic home first.
