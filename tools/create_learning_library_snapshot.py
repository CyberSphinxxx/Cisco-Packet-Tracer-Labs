#!/usr/bin/env python3
"""
tools/create_learning_library_snapshot.py

Creates and verifies a complete, clean snapshot of all authorized learning-library
materials, documentation, templates, tests, tools, and agent guides outside the Git working tree.
Excludes legacy coursework directories, private archives, caches, and disposable files.
"""

import hashlib
import json
import os
import shutil
import sys
from pathlib import Path

WORKSPACE_ROOT = Path(r"c:\L3mxr\Github Repositories\Cisco-Packet-Tracer-Labs")
SNAPSHOT_DIR = Path(r"c:\L3mxr\Github Repositories\Cisco-Packet-Tracer-Labs-Backups\educational_library_snapshot")

# Inclusion paths relative to WORKSPACE_ROOT
INCLUSION_DIRS = [
    ".github",
    "AI_AGENT_GUIDE",
    "docs",
    "labs",
    "learning-paths",
    "projects",
    "templates",
    "tests",
    "tools",
]

INCLUSION_FILES = [
    ".gitignore",
    "AGENTS.md",
    "CODE_OF_CONDUCT.md",
    "CONTRIBUTING.md",
    "LICENSE_PENDING.md",
    "README.md",
    "SECURITY.md",
]

EXCLUDE_EXTS = {".bak", ".pyc", ".log", ".tmp"}
EXCLUDE_DIRS = {"__pycache__", ".pytest_cache", "private_archive", "scratch"}


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        while chunk := f.read(65536):
            h.update(chunk)
    return h.hexdigest()


def should_include_file(p: Path) -> bool:
    if p.suffix.lower() in EXCLUDE_EXTS:
        return False
    for part in p.parts:
        if part in EXCLUDE_DIRS:
            return False
    return True


def main():
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")

    print(f"Creating Educational Library Snapshot at:\n  {SNAPSHOT_DIR}")
    if SNAPSHOT_DIR.exists():
        shutil.rmtree(SNAPSHOT_DIR)
    SNAPSHOT_DIR.mkdir(parents=True, exist_ok=True)

    copied_files = []
    manifest = {}

    # Copy files
    for rel_file in INCLUSION_FILES:
        src = WORKSPACE_ROOT / rel_file
        if src.is_file():
            dst = SNAPSHOT_DIR / rel_file
            dst.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(src, dst)
            copied_files.append(rel_file)

    # Copy dirs
    for rel_dir in INCLUSION_DIRS:
        src_dir = WORKSPACE_ROOT / rel_dir
        if not src_dir.is_dir():
            continue
        for root, dirs, files in os.walk(src_dir):
            dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
            for file in files:
                p = Path(root) / file
                if not should_include_file(p):
                    continue
                rel_path = p.relative_to(WORKSPACE_ROOT)
                dst = SNAPSHOT_DIR / rel_path
                dst.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(p, dst)
                copied_files.append(str(rel_path).replace("\\", "/"))

    copied_files.sort()
    print(f"Total files copied to snapshot: {len(copied_files)}")

    # Verification: check SHA-256 bit-for-bit against source
    mismatches = []
    checksum_lines = []

    for rel_path_str in copied_files:
        src_file = WORKSPACE_ROOT / rel_path_str
        dst_file = SNAPSHOT_DIR / rel_path_str
        src_hash = sha256_file(src_file)
        dst_hash = sha256_file(dst_file)

        if src_hash != dst_hash:
            mismatches.append((rel_path_str, src_hash, dst_hash))
        manifest[rel_path_str] = {
            "size_bytes": dst_file.stat().st_size,
            "sha256": dst_hash,
        }
        checksum_lines.append(f"{dst_hash}  {rel_path_str}")

    if mismatches:
        print(f"ERROR: {len(mismatches)} hash mismatches detected!")
        for path, s, d in mismatches:
            print(f"  {path}: src {s} != dst {d}")
        sys.exit(1)

    # Write manifest and checksums
    manifest_path = SNAPSHOT_DIR / "SNAPSHOT_MANIFEST.json"
    checksums_path = SNAPSHOT_DIR / "SNAPSHOT_CHECKSUMS.txt"

    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(
            {
                "snapshot_root": str(SNAPSHOT_DIR),
                "source_root": str(WORKSPACE_ROOT),
                "total_files": len(copied_files),
                "files": manifest,
            },
            f,
            indent=2,
        )

    with open(checksums_path, "w", encoding="utf-8") as f:
        f.write("\n".join(checksum_lines) + "\n")

    print(f"Verified {len(copied_files)}/{len(copied_files)} files bit-identical!")
    print(f"Manifest written to: {manifest_path}")
    print(f"Checksums written to: {checksums_path}")

    # Assert essential educational components
    essential_asserts = [
        # 13 labs
        "labs/network-fundamentals/ios-navigation-and-initial-config/README.md",
        "labs/ip-addressing/router-interface-configuration/README.md",
        "labs/network-security/secure-switch-ssh/README.md",
        "labs/network-security/port-security/README.md",
        "labs/ip-addressing/verify-connected-networks/README.md",
        "labs/switching/etherchannel-lacp/README.md",
        "labs/network-security/switch-hardening/README.md",
        "labs/switching/vlan-segmentation-and-access-ports/README.md",
        "labs/routing/inter-vlan-routing-router-on-a-stick/README.md",
        "labs/routing/dual-stack-static-routing/README.md",
        "labs/routing/dual-stack-static-routing/dual-stack-static-routing.pkt",
        "labs/routing/single-area-ospfv2/README.md",
        "labs/network-services/dhcp-server-and-relay/README.md",
        "labs/network-security/standard-and-extended-acls/README.md",
        # Capstone
        "projects/small-office-network/README.md",
        # Learning paths
        "learning-paths/networking-beginner.md",
        "learning-paths/bsit-networking.md",
        "learning-paths/ccna-aligned.md",
        # Docs
        "docs/lab-index.md",
        "docs/coverage-matrix.md",
        "docs/cisco-ios-cheatsheet.md",
        "docs/troubleshooting.md",
        "docs/provenance-and-licensing.md",
        "docs/getting-started.md",
        "docs/installation.md",
        "docs/migration-map.md",
        # Tooling and tests
        "tools/validate_repo.py",
        "tools/audit_repo.py",
        "tests/test_validate_repo.py",
        ".github/workflows/validate.yml",
    ]

    missing = []
    for item in essential_asserts:
        if item not in manifest:
            missing.append(item)

    if missing:
        print(f"ERROR: Missing essential educational content: {missing}")
        sys.exit(1)

    print("ALL essential educational assets confirmed present in external snapshot!")


if __name__ == "__main__":
    main()
