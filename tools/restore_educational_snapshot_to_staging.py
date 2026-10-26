#!/usr/bin/env python3
r"""
tools/restore_educational_snapshot_to_staging.py

Restores the 153 verified educational library files from the external snapshot
into the rewritten staging clone at C:\L3mxr\Github Repositories\Cisco-Packet-Tracer-Labs-Staging-Clean.
Verifies all 153 files bit-for-bit via SHA-256 against SNAPSHOT_MANIFEST.json.
Ensures zero quarantined legacy files or private archives are copied.
"""

import hashlib
import json
import os
import shutil
import sys
from pathlib import Path

SNAPSHOT_DIR = Path(r"c:\L3mxr\Github Repositories\Cisco-Packet-Tracer-Labs-Backups\educational_library_snapshot")
STAGING_DIR = Path(r"c:\L3mxr\Github Repositories\Cisco-Packet-Tracer-Labs-Staging-Clean")
MANIFEST_FILE = SNAPSHOT_DIR / "SNAPSHOT_MANIFEST.json"


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        while chunk := f.read(65536):
            h.update(chunk)
    return h.hexdigest()


def main():
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")

    if not SNAPSHOT_DIR.exists():
        print(f"ERROR: Snapshot directory not found: {SNAPSHOT_DIR}")
        sys.exit(1)
    if not STAGING_DIR.exists():
        print(f"ERROR: Staging directory not found: {STAGING_DIR}")
        sys.exit(1)

    with open(MANIFEST_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)

    files_manifest = data["files"]
    print(f"Restoring {len(files_manifest)} verified educational files to staging clone at:\n  {STAGING_DIR}")

    restored_count = 0
    for rel_path, meta in files_manifest.items():
        src = SNAPSHOT_DIR / rel_path
        dst = STAGING_DIR / rel_path
        dst.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src, dst)
        restored_count += 1

    print(f"Successfully copied {restored_count} files.")

    # Verify every restored file bit-for-bit against manifest
    mismatches = []
    for rel_path, meta in files_manifest.items():
        dst = STAGING_DIR / rel_path
        if not dst.exists():
            mismatches.append((rel_path, "MISSING", meta["sha256"]))
            continue
        actual_hash = sha256_file(dst)
        if actual_hash != meta["sha256"]:
            mismatches.append((rel_path, actual_hash, meta["sha256"]))

    if mismatches:
        print(f"ERROR: {len(mismatches)} hash verification errors in staging clone!")
        for item in mismatches:
            print(f"  {item}")
        sys.exit(1)

    print(f"ALL {restored_count}/{restored_count} files verified 100% bit-identical in staging clone!")

    # Check that zero legacy directories or files exist in staging
    legacy_checks = [
        STAGING_DIR / "2ndYear_Networking1",
        STAGING_DIR / "3rdYear_Networking2",
        STAGING_DIR / "Midterm Laboratory Exam",
        STAGING_DIR / "Step by Step Laboratory Activity",
        STAGING_DIR / "private_archive",
    ]
    for p in legacy_checks:
        if p.exists():
            print(f"ERROR: Forbidden legacy directory found in staging: {p}")
            sys.exit(1)

    print("Confirmed: ZERO legacy directories or quarantined files present in staging clone.")


if __name__ == "__main__":
    main()
