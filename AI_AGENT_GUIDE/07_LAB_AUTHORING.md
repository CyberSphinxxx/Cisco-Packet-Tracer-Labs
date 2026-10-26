# Editorial style, file contract and authoring rubric

## Reader experience
Write short plain-English introductions (what/why), a quick visual/topology explanation, prerequisites, objectives, addressing table, numbered tasks, commands shown with prompt/mode context, and verification and troubleshooting. For every meaningful command explain *what it does*, *why needed*, and *what to expect*. Keep sentences accessible to first-year BSIT learners; retain accurate terms. Never mix instructor answer material into exercise without labeling.

## Mandatory sections in canonical lab README
1. `# <Title>`; summary + metadata badges as plain text (category, difficulty, status, version, estimated time only if grounded).
2. `## Learning Objectives` — measurable verbs.
3. `## Prerequisites` — concepts, device models and simulator requirements.
4. `## Topology` — precise device/port table and optional licensed/local image.
5. `## Addressing Table` — interface, IPv4/mask, IPv6/prefix, gateway or `N/A` as appropriate. Include if address-based; otherwise explain not applicable.
6. `## Lab Tasks` — exercise steps with no answer leak; tasks must be feasible.
7. `## Configuration Walkthrough` — code blocks with correct IOS mode transitions, device-separated output, clear lab-only security disclaimers.
8. `## Verification` — exact show/debug/ping commands, what good and failed outcomes mean, label sample expected output as *illustrative* unless actually observed.
9. `## Troubleshooting` — >=3 relevant conditions for nontrivial labs; do not simply say 'check config'.
10. `## Key Takeaways` — learning objectives revisited.
11. `## References` — authoritative verified links, date checked or accessed.
12. `## Files and Validation Status` — relative paths and precise tested/not-tested status. No pretend downloads.

Use `AI_AGENT_GUIDE/templates/lab-README.md` as canonical outline; adapt examples rather than leaving placeholders. Guide should stand alone if binary file is unavailable.

## Metadata.json contract (see `templates/lab-metadata.json`)
Required stable keys: `id`, `title`, `slug`, `category`, `summary`, `difficulty`, `topics`, `learning_objectives`, `estimated_minutes`, `activity_reference`, `packet_tracer_version`, `devices`, `source`, `license_decision`, `assets`, `status`, `references`, `last_reviewed`. `estimated_minutes` may be null. `activity_reference` may be null. Source type one of `original`, `permission_verified`, `external_reference`, `restricted`. Status documentation one of `draft`, `reviewed`, `published`; simulator one of `not_tested`, `tested_pass`, `tested_fail`, `not_applicable`.

`published` is a **content-quality decision**, not a synonym for binary verification. `tested_pass` requires evidence (version, device setup, actual commands/results, reviewer). Not-tested documentation can be published when explicitly labeled and contains no false test assertions, although binary downloads must not be called verified.

## File preservation and reproducibility
- Never fabricate `starter.pkt`, `completed.pkt`, `.pka`, or screenshot images; they must come from simulator/approved original authoring workflow.
- Configs must be copy-pastable and device-labeled; document mode (`Switch(config)#`) and save command. Don't expose personal credentials.
- Use stable `PTL-####` ID and collision-free slug. If a lab maps to a historical Cisco activity number, preserve `activity_reference` and original title as reference only.
- No external hotlinked image unless explicit rights; prefer original exported/created diagram with attribution.
- Use Unix LF where feasible and relative links that GitHub can resolve. Do not rely on MDX-only components.

## Scoring rubric (each criterion 0-2, max 20)
1. Learning objective precise and achievable
2. Correct network design/addressing/topology
3. Simulator/model compatibility researched
4. Commands syntactically/contextually correct
5. Explanation of why commands work
6. Runnable practical tasks
7. Verification steps and expected vs observed distinction
8. Troubleshooting quality and failure cases
9. Attribution/rights clarity and reference quality
10. Accurate navigation/metadata/status/assets

`reviewed` requires >=17/20 and no zero in items 2,3,4,9. `published` requires >=18/20 plus links/metadata checks. `tested_pass` additionally requires real simulator evidence. Record rubric review in a per-lab review note or phase report.

## Formatting rules
Never claim '100% complete' without defining 100% of which finite target. Never use false badges for skills/certifications. Avoid promotional filler, AI disclaimers that overwhelm the actual lab, bloated screenshots, and lab passwords presented as production-safe. Prefer concise examples plus clear references to official docs.
