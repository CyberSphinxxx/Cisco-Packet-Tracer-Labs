# 07 — Real evidence and technical truthfulness

Never label a lab `tested_pass` because Packet Tracer accepted commands, because a topology screenshot exists, or because Python metadata validation succeeded. Require actual observed network behavior and saved-file reload. A screenshot of cables is not proof of routing.

Evidence for each task must include:
- Simulator app version and per-device model + IOS, bridge transport/tool calls, time and timezone.
- Lab ID, canonical folder, saved starter/completed filenames, byte counts, and SHA-256.
- Initial/final topology details: device labels, port mapping, VLAN/IP assignments and role.
- Actual command transcript relevant to each test (console prompt, command, output or clear textual observation from simulator UI), not purely generated expected outputs.
- POS and NEG test matrix with real outcomes, restoration actions, caveats/unsupported features and post-reload smoke tests.
- Explicit distinction between *verified* and *illustrative* performance/behavior. Ping round-trip times in a simulator do not prove CEF ASIC wire speed; no exact subsecond convergence timing without measurement.
- Actual origin and redistribution license. Original user-authored instructions and topologies only, no Cisco NetAcad proprietary assessment files or secret login details.

Look for contradictions across reports. If two drafts disagree about model/port/IP/slug, the final saved files, actual IOS outputs and final checksums determine the truth. Remove intermediate obsolete lab directories by Git changes only if they were created by the current agent during this run; never delete unrelated files without authorization.

Evidence notes may be public via Git. Sanitize passwords, personal folders/identities, tokens, local usernames, internal bridge ports beyond general loopback instructions, and personal file paths before committing. Keep raw confidential console logs out of the public repository.
