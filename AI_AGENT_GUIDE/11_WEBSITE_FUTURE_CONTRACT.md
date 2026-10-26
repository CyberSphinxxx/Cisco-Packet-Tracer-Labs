# Later website compatibility — design only, no site implementation

The website will eventually be built after this repository is accurate. Do not create `site/`, install Astro, add AdSense code, configure hosting, buy domains, or deploy in this project.

## Contract to preserve now
- Every public lab has canonical Markdown `README.md` plus machine-readable `metadata.json`, stable unique ID and slug.
- Categories, difficulty, topics, estimated minutes (nullable), source/license, verification status, original/permissioned download references and sources are explicit fields.
- Markdown uses portable Github rendering; local relative image/download links survive deterministic transformation; no inline custom JavaScript required to understand a lab.
- Cross-links to topics/learning paths are canonical and indexable. Generated index derives from metadata.
- Copyright/rights rules prevent future website from rendering/distributing restricted assets; monetization would heighten third-party license concerns.
- Planned site can ingest `labs/**/metadata.json` at build time and generate search index, category pages, course paths, and verified download URLs without reauthoring content.

## Future phase decisions (not yet executed)
Evaluate Astro/Starlight, Markdown search, Cloudflare Pages, domain, website privacy/accessibility, caching, analytics, and AdSense separately. Keep source-of-truth in GitHub, the site a derived consumer. A public repository alone is sufficient for this phase.
