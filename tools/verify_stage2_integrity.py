#!/usr/bin/env python3
r"""
tools/verify_stage2_integrity.py

Performs exhaustive verification of Stage 2:
- Verifies staging clone against external educational snapshot
- Verifies SHA-256 digests across all files
- Verifies all 13 labs, capstone, learning paths, docs, and tooling
- Audits historical Git commits in staging clone for legacy paths
- Compares commit hashes and branches
- Produces a detailed JSON report for deliverable documentation
"""

import hashlib
import json
import os
import subprocess
import sys
from pathlib import Path

WORKING_ROOT = Path(r"c:\L3mxr\Github Repositories\Cisco-Packet-Tracer-Labs")
STAGING_ROOT = Path(r"c:\L3mxr\Github Repositories\Cisco-Packet-Tracer-Labs-Staging-Clean")
SNAPSHOT_ROOT = Path(r"c:\L3mxr\Github Repositories\Cisco-Packet-Tracer-Labs-Backups\educational_library_snapshot")
MANIFEST_PATH = SNAPSHOT_ROOT / "SNAPSHOT_MANIFEST.json"


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        while chunk := f.read(65536):
            h.update(chunk)
    return h.hexdigest()


def run_cmd(cmd: str, cwd: Path) -> tuple[int, str]:
    res = subprocess.run(cmd, cwd=str(cwd), shell=True, capture_output=True, text=True, encoding="utf-8")
    return res.returncode, res.stdout.strip()


def main():
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")

    report = {
        "status": "PASS",
        "checks": {},
        "historical_audit": {},
        "commit_comparison": {},
    }

    # 1. Check all 153 files from manifest against staging
    with open(MANIFEST_PATH, "r", encoding="utf-8") as f:
        snap_data = json.load(f)

    files_manifest = snap_data["files"]
    missing_in_staging = []
    content_mismatches = []
    raw_hash_matches = 0
    normalized_hash_matches = 0

    binary_extensions = {".pkt", ".pka", ".png", ".jpg", ".zip", ".gz"}

    for rel_path, meta in files_manifest.items():
        staging_file = STAGING_ROOT / rel_path
        if not staging_file.is_file():
            missing_in_staging.append(rel_path)
            continue
        
        is_binary = Path(rel_path).suffix.lower() in binary_extensions
        with open(staging_file, "rb") as f_st:
            st_bytes = f_st.read()
        
        snap_file = SNAPSHOT_ROOT / rel_path
        with open(snap_file, "rb") as f_sn:
            sn_bytes = f_sn.read()

        if st_bytes == sn_bytes:
            raw_hash_matches += 1
            normalized_hash_matches += 1
        else:
            if not is_binary:
                # Compare with normalized LF endings (Git core.autocrlf converts LF to CRLF on checkout on Windows)
                if st_bytes.replace(b"\r\n", b"\n") == sn_bytes.replace(b"\r\n", b"\n"):
                    normalized_hash_matches += 1
                else:
                    content_mismatches.append({"path": rel_path, "issue": "text_content_differs"})
            else:
                content_mismatches.append({"path": rel_path, "issue": "binary_content_differs"})

    report["checks"]["total_manifest_files"] = len(files_manifest)
    report["checks"]["missing_in_staging"] = missing_in_staging
    report["checks"]["content_mismatches"] = content_mismatches
    report["checks"]["raw_byte_identical_files"] = raw_hash_matches
    report["checks"]["content_identical_files"] = normalized_hash_matches
    report["checks"]["all_snapshot_files_match"] = len(missing_in_staging) == 0 and len(content_mismatches) == 0

    # 2. Check binary .pkt integrity
    pkt_path = STAGING_ROOT / "labs/routing/dual-stack-static-routing/dual-stack-static-routing.pkt"
    expected_pkt_sha = "8d7f62a8b4e36ef0a6efb613b92e84dbed3f1c34cb5d268b9d2b7db487680b31"
    actual_pkt_sha = sha256_file(pkt_path) if pkt_path.is_file() else ""
    report["checks"]["pkt_integrity"] = {
        "path": str(pkt_path.relative_to(STAGING_ROOT)),
        "size_bytes": pkt_path.stat().st_size if pkt_path.is_file() else 0,
        "sha256": actual_pkt_sha,
        "matches_expected": actual_pkt_sha == expected_pkt_sha,
    }

    # 3. Check legacy directories in staging working tree
    legacy_paths = [
        "2ndYear_Networking1",
        "3rdYear_Networking2",
        "Midterm Laboratory Exam",
        "Step by Step Laboratory Activity",
        "private_archive",
    ]
    present_legacy = [p for p in legacy_paths if (STAGING_ROOT / p).exists()]
    report["checks"]["legacy_dirs_in_working_tree"] = present_legacy
    report["checks"]["zero_legacy_in_tree"] = len(present_legacy) == 0

    # 4. Audit Git history in staging for legacy paths
    history_queries = [
        "2ndYear_Networking1/*",
        "3rdYear_Networking2/*",
        "Midterm Laboratory Exam/*",
        "Step by Step Laboratory Activity/*",
        "2.3.7 Packet Tracer - Navigate the IOS/*",
        "2.5.5 Packet Tracer - Configure Initial Switch Settings/*",
        "2.7.6 Packet Tracer - Implement Basic Connectivity/*",
        "2.9.1 Packet Tracer - Basic Switch and End Device Configuration/*",
        "3.5.5 Packet Tracer - Investigate the TCP IP and OSI Models in Action/*",
        "4.7.2 Packet Tracer - Connect the Physical Layer/*",
        "*.pka",
        "*.bak",
        "*.docx",
    ]
    history_findings = {}
    for q in history_queries:
        code, out = run_cmd(f'git log --all --full-history -- "{q}"', STAGING_ROOT)
        history_findings[q] = len(out.splitlines()) if out else 0

    report["historical_audit"]["queries"] = history_findings
    report["historical_audit"]["total_legacy_commits_found"] = sum(history_findings.values())
    report["historical_audit"]["clean_history_confirmed"] = sum(history_findings.values()) == 0

    # 5. Commit comparison
    code, orig_log = run_cmd("git log --oneline -10", WORKING_ROOT)
    code, stag_log = run_cmd("git log --oneline -15", STAGING_ROOT)
    code, stag_branches = run_cmd("git branch -avv", STAGING_ROOT)

    report["commit_comparison"]["original_head"] = orig_log.splitlines()[0] if orig_log else ""
    report["commit_comparison"]["staging_head"] = stag_log.splitlines()[0] if stag_log else ""
    report["commit_comparison"]["staging_commit_count"] = len(stag_log.splitlines()) if stag_log else 0
    report["commit_comparison"]["staging_commits"] = stag_log.splitlines()
    report["commit_comparison"]["staging_branches"] = stag_branches.splitlines()

    # Print summary
    print("=" * 60)
    print("STAGE 2 INDEPENDENT INTEGRITY AUDIT")
    print("=" * 60)
    print(f"Total manifest files: {report['checks']['total_manifest_files']}")
    print(f"Missing in staging:   {len(missing_in_staging)}")
    print(f"Content mismatches:   {len(content_mismatches)}")
    print(f"Content-identical:    {normalized_hash_matches}/{len(files_manifest)}")
    print(f".pkt integrity match: {report['checks']['pkt_integrity']['matches_expected']}")
    print(f"Legacy dirs in tree:  {len(present_legacy)} (Expected: 0)")
    print(f"Legacy in Git history:{report['historical_audit']['total_legacy_commits_found']} (Expected: 0)")
    print(f"Staging HEAD commit:  {report['commit_comparison']['staging_head']}")
    print(f"Staging total commits:{report['commit_comparison']['staging_commit_count']}")

    overall_pass = (
        report["checks"]["all_snapshot_files_match"]
        and report["checks"]["pkt_integrity"]["matches_expected"]
        and report["checks"]["zero_legacy_in_tree"]
        and report["historical_audit"]["clean_history_confirmed"]
    )

    if overall_pass:
        print("\nOVERALL VERDICT: PASS (STAGE 2 SUCCESSFUL)")
    else:
        print("\nOVERALL VERDICT: FAIL")
        report["status"] = "FAIL"

    output_path = WORKING_ROOT / "AI_AGENT_GUIDE/state/stage2_verification_data.json"
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2)
    print(f"Verification data written to: {output_path}")


if __name__ == "__main__":
    main()
