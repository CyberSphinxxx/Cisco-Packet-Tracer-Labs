# Target structure and stable naming contract

```text
Cisco-Packet-Tracer-Labs/
  README.md
  LICENSE                       # only if rights allow; not a blanket license on third-party assets
  CONTRIBUTING.md
  CODE_OF_CONDUCT.md
  SECURITY.md
  .gitignore
  .github/
    ISSUE_TEMPLATE/
    workflows/validate.yml
  docs/
    getting-started.md
    installation.md
    lab-index.md
    troubleshooting.md
    cisco-ios-cheatsheet.md
    provenance-and-licensing.md
    migration-map.md
  labs/
    network-fundamentals/
    ip-addressing/
    switching/
    routing/
    network-services/
    network-security/
    wireless-wan/
    troubleshooting/
  projects/
    small-office-network/
    campus-network/             # only after authored
  learning-paths/
    networking-beginner.md
    bsit-networking.md
    ccna-aligned.md
  templates/
    lab-readme.md
    lab-metadata.json
  tools/
    validate_repo.py
  tests/
    test_validate_repo.py
  AI_AGENT_GUIDE/               # this agent runbook, keep discoverable
```

Avoid empty folders and fictitious links. Make only directories backed by content. Category path `labs/<category>/<slug>/` with lowercase ASCII kebab-case, immutable `id` such as `PTL-0001`. Keep activity number in metadata `activity_reference` when known, not the slug unless collision requires it.

### Per-lab contract
```text
labs/network-security/secure-switch-ssh/
  README.md
  metadata.json
  topology.png        # only if genuine (not fabricated screenshot)
  starter.pkt         # if independently authored and rights-cleared
  completed.pkt       # if actual tested binary exists
  configs/
    S1.txt            # simulation-appropriate commands; no real secrets
  verification.md     # optional expanded observed data
  sources.md          # optional fuller research log
```
Do not rename a third-party `.pka` into `starter.pka` or `completed.pka` solely based on filename. A `.pka` contains activity/scoring data and its use/redistribution must be authorized.

### IDs, links, metadata
- Stable `id`, `slug`, category, title, difficulty, learning objectives, source/provenance, license decision, documentation quality and simulator test status.
- Relative Markdown links must work in GitHub *and* future website exporter. Use `metadata.json` for machine-readable attributes.
- Markdown index generated or verified from metadata to avoid drift. Explicitly list verified count and draft count separately.
- No decorative phantom badges, self-awarded scores, invented estimated times, or remote broken images.
- Record old-to-new paths in `docs/migration-map.md`, and if existing Markdown URLs are referenced externally, consider small compatibility README stubs without duplicating content. File moves on GitHub do not automatically redirect old blob URLs.
- Keep learning-path pages as *indexes* of existing labs, not duplicative content.

### Website-later compatibility
Canonical prose remains Markdown. Website may use Astro/Starlight in a separate phase. The website should consume metadata in build time; no duplicated lab guides or arbitrary MDX features that break GitHub readability. See `11_WEBSITE_FUTURE_CONTRACT.md`.
