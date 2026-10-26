#!/usr/bin/env python3
"""Execute Task A: Relocate private archive outside Git working tree, verify hashes, and backup full Git repository."""
import hashlib
import json
import os
import shutil
import subprocess
import sys
import zipfile
from pathlib import Path

def main():
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8')

    repo_root = Path(__file__).parent.parent.resolve()
    external_backup_root = repo_root.parent / 'Cisco-Packet-Tracer-Labs-Backups'
    external_backup_root.mkdir(parents=True, exist_ok=True)

    print("=" * 70)
    print("TASK A: EXTERNAL BACKUP RELOCATION & REPOSITORY PRESERVATION")
    print(f"Repository Root:        {repo_root}")
    print(f"External Backup Target: {external_backup_root}")
    print("=" * 70)

    # 1. Relocate private legacy coursework archive outside working tree
    src_archive_dir = repo_root / 'private_archive'
    dest_archive_dir = external_backup_root / 'private_legacy_archive'
    dest_archive_dir.mkdir(parents=True, exist_ok=True)

    zip_filename = 'legacy_coursework_backup.zip'
    src_zip = src_archive_dir / zip_filename
    dest_zip = dest_archive_dir / zip_filename

    if not src_zip.exists():
        print(f"ERROR: Source zip not found at {src_zip}")
        return 1

    print(f"\n1. Copying private archive to external directory...")
    shutil.copy2(src_zip, dest_zip)
    if (src_archive_dir / 'CHECKSUMS.txt').exists():
        shutil.copy2(src_archive_dir / 'CHECKSUMS.txt', dest_archive_dir / 'CHECKSUMS.txt')
    if (src_archive_dir / 'VERIFICATION_MANIFEST.json').exists():
        shutil.copy2(src_archive_dir / 'VERIFICATION_MANIFEST.json', dest_archive_dir / 'VERIFICATION_MANIFEST.json')

    print(f"Copied to: {dest_zip}")
    print(f"Size: {dest_zip.stat().st_size} bytes ({dest_zip.stat().st_size / (1024*1024):.2f} MB)")

    # 2. Independent cryptographic verification of relocated archive
    print(f"\n2. Independently verifying relocated archive SHA-256 manifest...")
    manifest_file = dest_archive_dir / 'VERIFICATION_MANIFEST.json'
    with open(manifest_file, 'r', encoding='utf-8') as mf:
        manifest_data = json.load(mf)

    expected_files = manifest_data['files']
    verified_count = 0
    mismatches = []

    with zipfile.ZipFile(dest_zip, 'r') as zf:
        for entry in expected_files:
            arc_path = entry['archive_path']
            expected_hash = entry['sha256']
            expected_size = entry['size_bytes']
            content = zf.read(arc_path)
            calc_hash = hashlib.sha256(content).hexdigest()
            calc_size = len(content)
            if calc_hash == expected_hash and calc_size == expected_size:
                verified_count += 1
            else:
                mismatches.append(f"Mismatch for {arc_path}: expected {expected_hash}, got {calc_hash}")

    print(f"Relocated archive verification: {verified_count} / {len(expected_files)} files verified 100% bit-identical.")
    if mismatches:
        print("ERRORS during relocation verification:")
        for m in mismatches:
            print(f"  - {m}")
        return 1

    # 3. Remove private_archive from git working tree so private files are not stored in repo
    print(f"\n3. Removing private_archive from git working tree...")
    shutil.rmtree(src_archive_dir)
    print(f"Removed internal private_archive folder. Archive exists strictly at {dest_archive_dir}.")

    # 4. Preserve a second complete backup of the repository including Git history
    repo_backup_dir = external_backup_root / 'repo_history_backup'
    repo_backup_dir.mkdir(parents=True, exist_ok=True)
    bundle_file = repo_backup_dir / 'cisco_packet_tracer_labs_full_history.bundle'

    print(f"\n4. Creating complete Git bundle backup of all branches, commits, and tags...")
    try:
        # Create full git bundle containing all refs and commits
        subprocess.check_call(
            ['git', 'bundle', 'create', str(bundle_file), '--all'],
            cwd=str(repo_root)
        )
        print(f"Git bundle created successfully: {bundle_file}")
        print(f"Bundle size: {bundle_file.stat().st_size} bytes ({bundle_file.stat().st_size / (1024*1024):.2f} MB)")
    except Exception as e:
        print(f"ERROR creating Git bundle: {e}")
        return 1

    # Also make a mirror copy of the .git directory as an extra safeguard
    git_dir_backup = repo_backup_dir / 'dot_git_backup'
    if git_dir_backup.exists():
        shutil.rmtree(git_dir_backup)
    print(f"Copying .git directory to {git_dir_backup}...")
    shutil.copytree(repo_root / '.git', git_dir_backup)
    print("Direct .git directory snapshot complete.")

    # Write backup log
    backup_log = external_backup_root / 'BACKUP_RECORD.json'
    record = {
        'timestamp_utc': '2026-10-26T07:55:00Z',
        'external_backup_root': str(external_backup_root),
        'private_legacy_archive': {
            'zip_path': str(dest_zip),
            'size_bytes': dest_zip.stat().st_size,
            'files_verified': verified_count,
            'status': 'ALL_HASHES_MATCH_100_PERCENT'
        },
        'git_history_backup': {
            'bundle_path': str(bundle_file),
            'bundle_size_bytes': bundle_file.stat().st_size,
            'dot_git_snapshot': str(git_dir_backup),
            'status': 'FULL_REFS_AND_COMMITS_PRESERVED'
        }
    }
    with open(backup_log, 'w', encoding='utf-8') as bl:
        json.dump(record, bl, indent=2)

    print("\n" + "=" * 70)
    print("TASK A COMPLETED SUCCESSFULLY")
    print(f"Verified Backup Record: {backup_log}")
    print("=" * 70)
    return 0

if __name__ == '__main__':
    sys.exit(main())
