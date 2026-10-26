#!/usr/bin/env python3
"""Create and cryptographically verify a private offline backup archive of legacy coursework."""
import hashlib
import json
import sys
import zipfile
from pathlib import Path

def main():
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8')

    root = Path(__file__).parent.parent.resolve()
    archive_dir = root / 'private_archive'
    archive_dir.mkdir(exist_ok=True)
    zip_path = archive_dir / 'legacy_coursework_backup.zip'

    print("=" * 70)
    print("PRIVATE LEGACY COURSEWORK BACKUP & VERIFICATION TOOL")
    print(f"Target Archive: {zip_path}")
    print("=" * 70)

    # 1. Load authoritative baseline hashes
    raw_audit_file = root / 'AI_AGENT_GUIDE' / 'state' / 'legacy_audit_raw.json'
    with open(raw_audit_file, 'r', encoding='utf-8') as f:
        legacy_files = json.load(f)

    # Also include the original contributor .pkt file (migrated to dual-stack-static-routing)
    migrated_pkt = root / 'labs' / 'routing' / 'dual-stack-static-routing' / 'dual-stack-static-routing.pkt'
    original_pkt_rel = '2ndYear_Networking1/Step by Step Laboratory Activity/Step by Step Laboratory Activity - Network Configuration Based on the Topology.pkt'
    expected_pkt_sha = '8d7f62a8b4e36ef0a6efb613b92e84dbed3f1c34cb5d268b9d2b7db487680b31'

    all_targets = list(legacy_files)
    if migrated_pkt.exists():
        all_targets.append({
            'rel_path': original_pkt_rel,
            'source_disk_path': migrated_pkt,
            'filename': migrated_pkt.name,
            'size': migrated_pkt.stat().st_size,
            'sha256': expected_pkt_sha,
            'ext': '.pkt'
        })

    print(f"\n1. Archiving {len(all_targets)} original files into zip...")
    with zipfile.ZipFile(zip_path, 'w', compression=zipfile.ZIP_DEFLATED) as zf:
        for item in all_targets:
            rel = item['rel_path']
            disk_path = item.get('source_disk_path') or (root / rel)
            if not disk_path.exists():
                print(f"ERROR: Source file missing on disk: {disk_path}")
                return 1
            # Write to zip with preserved relative directory structure
            zf.write(disk_path, arcname=rel)

    archive_size = zip_path.stat().st_size
    print(f"Archive created successfully: {archive_size} bytes ({archive_size / (1024*1024):.2f} MB)")

    # 2. Cryptographic read-back and verification
    print("\n2. Reading back archive contents and verifying SHA-256 hashes...")
    verified_manifest = []
    mismatches = []

    with zipfile.ZipFile(zip_path, 'r') as zf:
        archive_names = set(zf.namelist())
        for item in all_targets:
            rel = item['rel_path']
            if rel not in archive_names:
                mismatches.append(f"Missing from zip: {rel}")
                continue
            archived_bytes = zf.read(rel)
            calc_hash = hashlib.sha256(archived_bytes).hexdigest()
            calc_size = len(archived_bytes)
            is_match = (calc_hash == item['sha256'] and calc_size == item['size'])
            if not is_match:
                mismatches.append(f"Hash mismatch for {rel}: expected {item['sha256']}, got {calc_hash}")
            else:
                verified_manifest.append({
                    'archive_path': rel,
                    'size_bytes': calc_size,
                    'sha256': calc_hash,
                    'verified': True
                })

    print(f"Verified files in archive: {len(verified_manifest)} / {len(all_targets)}")
    if mismatches:
        print("\nCRITICAL ERRORS ENCOUNTERED:")
        for m in mismatches:
            print(f"  - {m}")
        return 1

    # 3. Write standalone checksums and manifest
    checksums_file = archive_dir / 'CHECKSUMS.txt'
    manifest_file = archive_dir / 'VERIFICATION_MANIFEST.json'

    with open(checksums_file, 'w', encoding='utf-8') as cf:
        for item in sorted(verified_manifest, key=lambda x: x['archive_path']):
            cf.write(f"{item['sha256']}  {item['archive_path']}\n")

    with open(manifest_file, 'w', encoding='utf-8') as mf:
        json.dump({
            'archive_file': zip_path.name,
            'archive_bytes': archive_size,
            'total_files_archived': len(verified_manifest),
            'verification_status': 'ALL_HASHES_MATCH_100_PERCENT',
            'files': verified_manifest
        }, mf, indent=2)

    print("\n" + "=" * 70)
    print("BACKUP VERIFICATION PASSED: 100% BIT-FOR-BIT FIDELITY CONFIRMED")
    print(f"Checksums saved to: {checksums_file.relative_to(root)}")
    print(f"Manifest saved to:  {manifest_file.relative_to(root)}")
    print("=" * 70)
    return 0

if __name__ == '__main__':
    sys.exit(main())
