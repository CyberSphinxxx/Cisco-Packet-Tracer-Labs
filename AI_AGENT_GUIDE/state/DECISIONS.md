# Architectural and publication decisions

## ADR-001: Execution environment, branch strategy, and kit placement
- **Date:** 2026-10-26
- **Status:** accepted
- **Context:** Starting Phase 00 bootstrap on local workspace `CyberSphinxxx/Cisco-Packet-Tracer-Labs`. Need safe branch strategy, discoverable agent instructions, and standard execution tooling.
- **Decision:**
  1. Work on dedicated local branch `refactor/learning-library-v1` branched from `main` (commit `ac215e2646ad822ff571297d801ea79070c28a91`).
  2. Moved `AI_AGENT_GUIDE/` directly to repo root as specified in guide README, removing the temporary wrapper directory `Cisco_Packet_Tracer_Antigravity_Agent_Kit`.
  3. Created root `AGENTS.md` per Antigravity portable instruction discovery standard.
  4. Use Python 3.14 standard-library-only tooling (`validate_repo.py`) for offline schema/link/asset checks.
- **Alternatives:** Staying on `main` (rejected to protect default branch); installing third-party npm/pip lint packages (rejected to maintain offline zero-dependency reproducibility).
- **Consequences and migration risks:** Local branch must be preserved and not pushed remotely without user authorization. All paths in documentation and scripts reference `AI_AGENT_GUIDE/`.
- **Evidence:** Git branch verification, `python --version` (3.14.7), `validate_repo.py` exit code 0.

## ADR-002: Information Architecture, Category Taxonomy, and Lab Contract
- **Date:** 2026-10-26
- **Status:** accepted
- **Context:** Need a coherent topic-first taxonomy and metadata specification to replace academic-year directories and support future website ingestion without coupling.
- **Decision:**
  1. Standardize on 8 canonical categories: `network-fundamentals`, `ip-addressing`, `switching`, `routing`, `network-services`, `network-security`, `wireless-wan`, `troubleshooting`.
  2. Implement stable immutable IDs matching regex `PTL-\d{4,}` and unique lowercase kebab-case slugs.
  3. Enforce 12 mandatory sections in lab guides (`Learning Objectives`, `Prerequisites`, `Topology`, `Addressing Table`, `Lab Tasks`, `Configuration Walkthrough`, `Verification`, `Troubleshooting`, `Key Takeaways`, `References`, `Files and Validation Status`).
  4. Quarantined legacy proprietary courseware (`.pka`, `.bak`, `.docx`, answer keys) in legacy paths.
  5. Placed production copies of `templates/` and `tools/` at repository root with tests in `tests/`.
- **Alternatives:** Keeping year-based folders (rejected: poorly browsable for independent learners); building web UI now (rejected: explicitly out of scope per contract).
- **Consequences:** All published labs will be machine-checkable and forward-compatible with future static site generation.
- **Evidence:** `validate_repo.py` checks schema, headings, relative links, assets, and restricted source rules; 12 unit tests pass.

