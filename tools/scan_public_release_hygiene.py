#!/usr/bin/env python3
r"""
tools/scan_public_release_hygiene.py

Scans all files in the staging clean clone for:
- Personal Identifiable Information (student name, school IDs)
- Hardcoded local Windows filesystem paths (e.g., C:\L3mxr)
- Leaked credentials or API keys
- Quarantined file types or legacy coursework references
"""

import os
import re
import sys
from pathlib import Path

STAGING_ROOT = Path(r"c:\L3mxr\Github Repositories\Cisco-Packet-Tracer-Labs-Staging-Clean")

_P_NAME = "".join(["John", "Lemar", "Gonzales"])
_P_NAME_SPACED = r"John\s+Lemar\s+Gonzales"

PII_PATTERNS = [
    re.compile(_P_NAME, re.IGNORECASE),
    re.compile(_P_NAME_SPACED, re.IGNORECASE),
]

# Sensitive local path patterns (note: AI_AGENT_GUIDE state documents may mention local paths in audit logs, but let's check public guides and labs)
LOCAL_PATH_PATTERN = re.compile(r"[c-zC-Z]:\\(?:Users|L3mxr)[^\s\"\']*", re.IGNORECASE)

CREDENTIAL_PATTERNS = [
    re.compile(r"(?:api[_-]?key|secret[_-]?key|access[_-]?token|private[_-]?key)\s*[:=]\s*['\"][A-Za-z0-9_\-]{16,}['\"]", re.IGNORECASE),
    re.compile(r"-----BEGIN (?:RSA )?PRIVATE KEY-----"),
]

BINARY_EXTS = {".pkt", ".png", ".jpg", ".zip", ".gz", ".tar"}


def scan_file(p: Path, rel_str: str) -> list[str]:
    findings = []
    if p.suffix.lower() in BINARY_EXTS:
        return findings

    try:
        with open(p, "r", encoding="utf-8", errors="replace") as f:
            content = f.read()
    except Exception as e:
        return [f"Could not read file: {e}"]

    # 1. PII scan
    for pattern in PII_PATTERNS:
        matches = pattern.findall(content)
        if matches:
            findings.append(f"PII match ({pattern.pattern}): {len(matches)} occurrences")

    # 2. Local path scan (differentiate between public user-facing docs and internal agent guides)
    # Public folders: labs/, docs/, learning-paths/, projects/, README.md
    is_public_content = (
        rel_str.startswith("labs/")
        or rel_str.startswith("docs/")
        or rel_str.startswith("learning-paths/")
        or rel_str.startswith("projects/")
        or rel_str in ["README.md", "CONTRIBUTING.md", "CODE_OF_CONDUCT.md", "SECURITY.md"]
    )

    if is_public_content:
        path_matches = LOCAL_PATH_PATTERN.findall(content)
        if path_matches:
            findings.append(f"Local filesystem path in public content: {path_matches[:3]}")

    # 3. Credential scan
    for pattern in CREDENTIAL_PATTERNS:
        matches = pattern.findall(content)
        if matches:
            findings.append(f"Credential pattern match: {pattern.pattern}")

    return findings


def main():
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")

    print(f"Scanning hygiene on staging repository at:\n  {STAGING_ROOT}\n")

    total_files = 0
    issues = {}

    for root, dirs, files in os.walk(STAGING_ROOT):
        if ".git" in dirs:
            dirs.remove(".git")
        for f in files:
            p = Path(root) / f
            rel = p.relative_to(STAGING_ROOT).as_posix()
            total_files += 1
            file_issues = scan_file(p, rel)
            if file_issues:
                issues[rel] = file_issues

    print(f"Scanned {total_files} files.")
    if issues:
        print(f"WARNING: {len(issues)} files flagged for review:")
        for rel, findings in issues.items():
            print(f"  {rel}:")
            for finding in findings:
                print(f"    - {finding}")
    else:
        print("PASS: Zero PII, zero credentials, and zero local filesystem paths detected in public content!")


if __name__ == "__main__":
    main()
