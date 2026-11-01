# 04 — Real simulator execution, files and fault tests

**No Python/Markdown-created `.pkt` impostors.** Every `.pkt` file must be created/saved by genuine Cisco Packet Tracer through the verified local MCP bridge. `topology.png` must be an authentic screenshot from the current simulator canvas, not a synthetic diagram. Capture after layout labels are legible; screenshot is evidence of topology, not proof of forwarding.

Sequence per task:

1. Build a new project in a lab-specific scratch path, place exact devices, cable and label ports, power up required modules, inspect actual interface naming. Save a topology-only baseline as needed.
2. Configure golden state through real CLI/GUI. Capture before/after `show` commands and traffic probes. Record actual MAC/IP, routing/translation/neighbor states; remove secrets from public evidence. Never infer a running config from intended commands.
3. Execute positive tests: at least reachability or service success, exact relevant protocol state, persistence. Execute task-specific negative tests: intentional incorrect VLAN/routing/NAT/ACL and observed failure; use reversible temporary configurations and restore after proof. Do not use arbitrary failures that merely prove a cable was unplugged unless cable diagnosis is the lesson.
4. Save **completed.pkt**, close/reopen that exact file, rerun critical positive tests. Record output and screenshot/time. If result differs after reopen, fix then repeat.
5. Restore baseline and remove only student-target configuration tasks, never unrelated requirements. Save **starter.pkt**, close/reopen and prove that the tasks remain incomplete but the environment can be completed by following guide. Confirm student cannot get a fully passing solution just by opening starter.
6. Capture a real, readable `topology.png` with devices, ports/links and minimal overlap. Device text output belongs in evidence markdown, not pasted over screenshot.
7. Export device configurations to `configs/*.txt` with sanitized secrets and consistency checks. Include device model/IOS and clear separation between the student baseline and final answer if relevant.
8. Compute SHA-256 + bytes for starter/completed/topology. Verify nonzero, PNG format, and different `.pkt` checksums. Do not claim a checksum is simulator validation.
9. Write `verification.md` and `AI_AGENT_GUIDE/state/PTL-XXXX-SIMULATOR-RESULTS.md` using the real observations. Be explicit about simulator limitations. Set `tested_pass` ONLY after saved project, behavior, documentation, and evidence are mutually consistent.

**Strong coverage requirements:** At least three meaningful positive checks and two negative/fault checks *when justified by the lesson*; some introductory labs may require alternative checks and explanatory rationale. Verify expected state and actual state; no unmeasured convergence milliseconds or throughput performance claims. Use a test matrix with POS/NEG ID, commands, device context, observed output, pass/fail, timestamps, restore action.

**Resume after interruption:** Verify active file name, lab scratch files, queue status and last transcript; never assume partial simulator config persisted. Reopen last saved file and re-run minimum critical tests before continuing. Keep scratch artifacts outside publicly published `labs/` until verified.
