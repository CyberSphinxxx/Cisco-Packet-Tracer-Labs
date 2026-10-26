# Evidence-led research for new topics

## Source priority
A. Official Cisco technical command references, configuration guides, Packet Tracer learning docs, and current CCNA exam topic specifications (check versions/dates).
B. Standards (IETF RFCs, IEEE public summaries) where relevant; compare against Packet Tracer's simulated feature set.
C. Documented independent technical publications/community troubleshooting for cross-checking only.
D. ITExamAnswers or other student answer sites strictly for high-level *topic discovery*, not copied content or file mirroring. Beware conflicting/outdated answers.

## Workflow per new learning topic
1. Define a single learner outcome and prerequisites. Example: 'Configure VLAN 10/20 and validate inter-VLAN connectivity'.
2. Search current authoritative materials; capture URLs, publisher, document/revision date if visible, claims supported. Check Packet Tracer version-specific support; prefer device model found in simulator.
3. Write a technical design spec: number/model of devices, interface mapping, IP plan with nonoverlapping test/documentation networks, routing method, expected show/ping results, security constraints, failure modes.
4. Draft ORIGINAL teaching prose from verified technical concepts; use independent examples and distinct addressing/topology. Do not reproduce paid/teacher grading scenarios, exercises, images or assessment answer text.
5. Create textual practice tasks and full verification instructions. Mark *illustrative* vs *observed* outputs. Prefer `192.0.2.0/24`, `198.51.100.0/24`, `203.0.113.0/24`, and `2001:db8::/32` for documentation addressing as appropriate, but select a valid consistent topology; don't inadvertently mix incompatible examples.
6. Conduct separate technical review of IOS mode/syntax, interface names, supported device features, addressing, default gateway and route behavior, AAA/SSH best practices. Run Packet Tracer when available.
7. Record sources in `sources.md` or metadata `references`; separate primary sources from supplementary; note checked date and unresolved contradictions.
8. If research cannot confirm a claim, omit or mark unknown. If the simulator isn't available, keep result `NOT_TESTED`, do not fake screenshots or verified output.

## Citation expectation
- Every nontrivial technical guide has >=2 credible references where feasible, at least one official technical source for commands; citation links in `References` section.
- Do not claim support for a feature solely because full Cisco IOS supports it: Packet Tracer's simulated devices/commands are a subset.
- Don't present research site URLs as redistributed license grants. License/provenance decisions recorded separately.
- Check broken links and cite canonical URLs, not made-up documents.

## Anti-hallucination questions before publication
Can I identify the model/version? Do the listed interfaces exist? Does the address table match the diagram/config? Can every expected ping route? Is IPv6 forwarding on routers enabled? Is the security advice explicitly labeled educational vs production? Was the output **observed** or **illustrative**? Can I verify the original sources and rights?
