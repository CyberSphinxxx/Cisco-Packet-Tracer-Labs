# 08 — Queue CLI protocol (Python standard library)

Run from the repository root; the script locates its own adjacent queue, config and `state/progress.json`.

```powershell
python AUTONOMOUS_LAB_FACTORY/tools/queue.py preflight --repo .
python AUTONOMOUS_LAB_FACTORY/tools/test_queue.py
python AUTONOMOUS_LAB_FACTORY/tools/queue.py init --repo .
python AUTONOMOUS_LAB_FACTORY/tools/queue.py status --repo .
python AUTONOMOUS_LAB_FACTORY/tools/queue.py next --repo .
python AUTONOMOUS_LAB_FACTORY/tools/queue.py start PTL-0020 --repo .
# ... genuine building, verification, Git commit ...
python AUTONOMOUS_LAB_FACTORY/tools/queue.py complete PTL-0020 --repo . --commit <actual-commit-sha> --evidence AI_AGENT_GUIDE/state/PTL-0020-SIMULATOR-RESULTS.md
# Or, only if blocked by real evidence:
python AUTONOMOUS_LAB_FACTORY/tools/queue.py block PTL-0020 --repo . --reason "Packet Tracer 9.0.1 rejected command ...; attempts 2/2"
# New agent session after explicit restart:
python AUTONOMOUS_LAB_FACTORY/tools/queue.py resume-session --repo .
```

`next` returns JSON: `{"status":"ready","task":{...}}`, `{"status":"resume","task":{...}}`, `{"status":"halt","reason":"..."}`, or `{"status":"done"}`. The agent must read and obey it. `next` considers dependencies fulfilled if an ID already exists in reviewed+tested passing canonical metadata or the queue marked it completed. `preflight` checks queue uniqueness and folder clashes but **cannot verify real simulator operations**. `complete` confirms `.pkt`/PNG file presence, metadata status/paths, different starter/completed hashes, evidence existence, commit validity and clean working tree; the agent is still obligated to run meaningful Packet Tracer tests and all QA gates beforehand.

If a task is in progress, `next` returns that task, even after interruption. Use `block` only after bounded retries and recording actual reasons; never call `complete` on a task that has not been verified. `retry` resets a blocked task to pending only if its allowed attempts remain and it is safe to retry. `resume-session` resets session limits but *not* lab progress or attempts.

**Policy and queue data are read-only inputs to the controller**, editable by the owner before the next session; do not silently change limits, tasks or queue IDs mid-run.
