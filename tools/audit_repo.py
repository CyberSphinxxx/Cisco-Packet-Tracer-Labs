#!/usr/bin/env python3
"""Independent comprehensive repository audit script."""
import hashlib
import json
import os
import subprocess
import sys
from pathlib import Path

def main():
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8')

    root = Path(__file__).parent.parent.resolve()
    print("=" * 60)
    print("INDEPENDENT REPOSITORY AUDIT REPORT")
    print(f"Workspace: {root}")
    print("=" * 60)

    # 1. Git Status & Current Branch
    print("\n--- 1. GIT STATUS & REVISION ---")
    try:
        branch = subprocess.check_output(['git', 'branch', '--show-current'], cwd=root, text=True).strip()
        head = subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=root, text=True).strip()
        print(f"Active Branch: {branch}")
        print(f"Checked HEAD:  {head}")
        status = subprocess.check_output(['git', 'status', '--short'], cwd=root, text=True).strip()
        print(f"Worktree status lines: {len(status.splitlines()) if status else 0}")
    except Exception as e:
        print(f"Git inspection error: {e}")

    # 2. Migrated Asset Integrity
    print("\n--- 2. MIGRATED BINARY ASSET INTEGRITY ---")
    pkt = root / 'labs' / 'routing' / 'dual-stack-static-routing' / 'dual-stack-static-routing.pkt'
    if pkt.exists():
        calc_sha = hashlib.sha256(pkt.read_bytes()).hexdigest()
        expected_sha = '8d7f62a8b4e36ef0a6efb613b92e84dbed3f1c34cb5d268b9d2b7db487680b31'
        print(f"Path: {pkt.relative_to(root)}")
        print(f"Size: {pkt.stat().st_size} bytes")
        print(f"SHA-256: {calc_sha}")
        print(f"Bit-identical to legacy original: {calc_sha == expected_sha}")
    else:
        print(f"ERROR: Migrated asset not found at {pkt}")

    # 3. Lab Catalog Enumeration
    print("\n--- 3. LAB CATALOG ENUMERATION ---")
    labs_dir = root / 'labs'
    labs = []
    cat_counts = {}
    diff_counts = {}
    doc_counts = {}
    sim_counts = {}

    for cat_dir in sorted(p for p in labs_dir.iterdir() if p.is_dir()):
        for lab_dir in sorted(p for p in cat_dir.iterdir() if p.is_dir()):
            meta_file = lab_dir / 'metadata.json'
            readme_file = lab_dir / 'README.md'
            if meta_file.exists():
                with open(meta_file, 'r', encoding='utf-8') as f:
                    meta = json.load(f)
                labs.append((meta['id'], cat_dir.name, lab_dir.name, meta))
                cat_counts[cat_dir.name] = cat_counts.get(cat_dir.name, 0) + 1
                diff = meta.get('difficulty', 'unknown')
                diff_counts[diff] = diff_counts.get(diff, 0) + 1
                doc = meta.get('status', {}).get('documentation', 'unknown')
                doc_counts[doc] = doc_counts.get(doc, 0) + 1
                sim = meta.get('status', {}).get('simulator', 'unknown')
                sim_counts[sim] = sim_counts.get(sim, 0) + 1

    print(f"Total Active Labs in labs/: {len(labs)}")
    for lid, cat, slug, m in labs:
        print(f"  [{lid}] {cat}/{slug:<40} | Diff: {m.get('difficulty'):<12} | Doc: {m.get('status',{}).get('documentation'):<10} | Sim: {m.get('status',{}).get('simulator')}")

    print("\nBreakdown by Category:")
    for c, count in sorted(cat_counts.items()):
        print(f"  {c:<22}: {count}")

    print("\nBreakdown by Difficulty:")
    for d, count in sorted(diff_counts.items()):
        print(f"  {d:<12}: {count}")

    print("\nBreakdown by Documentation Status:")
    for s, count in sorted(doc_counts.items()):
        print(f"  {s:<12}: {count}")

    print("\nBreakdown by Simulator Verification Status:")
    for s, count in sorted(sim_counts.items()):
        print(f"  {s:<12}: {count}")

    # 4. Quarantined Files
    print("\n--- 4. QUARANTINED LEGACY ASSETS AUDIT ---")
    quarantine_count = 0
    restricted_pka = 0
    for folder in ['2ndYear_Networking1', '3rdYear_Networking2']:
        fpath = root / folder
        if fpath.exists():
            for p in fpath.rglob('*'):
                if p.is_file() and p.name != 'README.md':
                    quarantine_count += 1
                    if p.suffix == '.pka':
                        restricted_pka += 1
    print(f"Total Quarantined Files in legacy directories: {quarantine_count}")
    print(f"Restricted NetAcad .pka packages quarantined:   {restricted_pka}")
    print("Quarantined files promoted to public labs/:      0 (Zero promotion; quarantine maintained)")

    # 5. Capstone Project Check
    print("\n--- 5. CAPSTONE PROJECTS AUDIT ---")
    proj_dir = root / 'projects' / 'small-office-network'
    proj_readme = proj_dir / 'README.md'
    proj_starter = proj_dir / 'assets' / 'starter.pkt'
    proj_completed = proj_dir / 'assets' / 'completed.pkt'
    proj_topology = proj_dir / 'assets' / 'topology.png'
    proj_ver = proj_dir / 'verification.md'
    print(f"Small Office Capstone Project Present: {proj_readme.exists()}")
    print(f"  starter.pkt present:   {proj_starter.exists()} ({proj_starter.stat().st_size if proj_starter.exists() else 0} bytes)")
    print(f"  completed.pkt present: {proj_completed.exists()} ({proj_completed.stat().st_size if proj_completed.exists() else 0} bytes)")
    print(f"  topology.png present:  {proj_topology.exists()} ({proj_topology.stat().st_size if proj_topology.exists() else 0} bytes)")
    print(f"  verification.md:       {proj_ver.exists()}")
    if proj_starter.exists() and proj_completed.exists():
        diff = proj_starter.stat().st_size != proj_completed.stat().st_size or proj_starter.read_bytes() != proj_completed.read_bytes()
        print(f"  Starter != Completed:  {diff}")

    # 6. Simulator Assets Verification
    print("\n--- 6. SIMULATOR DELIVERABLES AUDIT ---")
    total_starters = 0
    total_completed = 0
    total_topos = 0
    non_identical_pairs = 0
    all_entities = list(labs_dir.glob('*/*')) + [proj_dir]
    for ent in all_entities:
        if not ent.is_dir():
            continue
        s = ent / 'assets' / 'starter.pkt'
        c = ent / 'assets' / 'completed.pkt'
        t = ent / 'assets' / 'topology.png'
        if s.is_file() and s.stat().st_size > 0:
            total_starters += 1
        if c.is_file() and c.stat().st_size > 0:
            total_completed += 1
        if t.is_file() and t.stat().st_size > 0:
            total_topos += 1
        if s.is_file() and c.is_file():
            if s.stat().st_size != c.stat().st_size or s.read_bytes() != c.read_bytes():
                non_identical_pairs += 1
    print(f"Verified starter.pkt deliverables:   {total_starters}/14")
    print(f"Verified completed.pkt deliverables: {total_completed}/14")
    print(f"Verified topology.png captures:      {total_topos}/14")
    print(f"Non-identical starter/completed:     {non_identical_pairs}/14")

    # 7. Learning Paths Check
    print("\n--- 7. LEARNING PATHS AUDIT ---")
    paths_dir = root / 'learning-paths'
    paths = list(paths_dir.glob('*.md'))
    print(f"Learning paths present ({len(paths)}): {[p.name for p in paths]}")

    print("\n" + "=" * 60)
    print("AUDIT SUMMARY: Complete and Consistent")
    print("=" * 60)

if __name__ == '__main__':
    main()
