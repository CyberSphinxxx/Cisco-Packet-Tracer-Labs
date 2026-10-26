#!/usr/bin/env python3
"""Detailed audit and classification of legacy coursework files."""
import hashlib
import json
import sys
from pathlib import Path

def main():
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8')

    root = Path(__file__).parent.parent.resolve()
    legacy_dirs = ['2ndYear_Networking1', '3rdYear_Networking2']
    files_data = []

    for ld in legacy_dirs:
        p = root / ld
        if not p.exists(): continue
        for f in sorted(p.rglob('*')):
            if f.is_file():
                rel_path = f.relative_to(root).as_posix()
                # Skip the backwards-compatibility README stub created in phase 03
                if rel_path == '2ndYear_Networking1/Step by Step Laboratory Activity/README.md':
                    continue
                b = f.read_bytes()
                h = hashlib.sha256(b).hexdigest()
                files_data.append({
                    'rel_path': rel_path,
                    'filename': f.name,
                    'size': len(b),
                    'sha256': h,
                    'ext': f.suffix.lower()
                })

    print(f"Total Legacy Files Found: {len(files_data)}")
    for item in files_data:
        print(f"{item['rel_path']} | {item['size']} B | {item['sha256']}")

    # Save to JSON for downstream processing
    out_file = root / 'AI_AGENT_GUIDE' / 'state' / 'legacy_audit_raw.json'
    with open(out_file, 'w', encoding='utf-8') as out:
        json.dump(files_data, out, indent=2)
    print(f"\nSaved raw audit data to: {out_file.relative_to(root)}")

if __name__ == '__main__':
    main()
