#!/usr/bin/env python3
import json
import re
from pathlib import Path

labs_dir = Path('labs')
report = []

for cat in sorted(labs_dir.iterdir()):
    if not cat.is_dir(): continue
    for lab in sorted(cat.iterdir()):
        if not lab.is_dir(): continue
        meta_p = lab / 'metadata.json'
        readme_p = lab / 'README.md'
        configs_dir = lab / 'configs'
        assets_dir = lab / 'assets'
        
        info = {
            'cat': cat.name,
            'slug': lab.name,
            'has_meta': meta_p.exists(),
            'has_readme': readme_p.exists(),
            'has_configs': configs_dir.exists(),
            'config_files': [f.name for f in configs_dir.iterdir()] if configs_dir.exists() else [],
            'has_assets': assets_dir.exists(),
            'asset_files': [f.name for f in assets_dir.iterdir()] if assets_dir.exists() else [],
        }
        if meta_p.exists():
            with open(meta_p, 'r', encoding='utf-8') as f:
                meta = json.load(f)
            info['id'] = meta.get('id')
            info['title'] = meta.get('title')
            info['difficulty'] = meta.get('difficulty')
            info['doc_status'] = meta.get('status', {}).get('documentation')
            info['sim_status'] = meta.get('status', {}).get('simulator')
            info['starter'] = meta.get('assets', {}).get('starter')
            info['completed'] = meta.get('assets', {}).get('completed')
            info['topology_asset'] = meta.get('assets', {}).get('topology')
            info['devices'] = meta.get('devices')
        
        if readme_p.exists():
            txt = readme_p.read_text(encoding='utf-8', errors='replace')
            headings = re.findall(r'^##\s+(.+?)\s*$', txt, flags=re.M)
            info['headings_count'] = len(headings)
            info['headings'] = headings
            info['has_addressing_table'] = 'Addressing Table' in headings
            info['has_walkthrough'] = 'Configuration Walkthrough' in headings
            info['lines'] = len(txt.splitlines())
        
        report.append(info)

for r in report:
    print(f"[{r.get('id')}] {r['slug']} ({r['cat']})")
    print(f"  Meta: {r['has_meta']}, Readme: {r['has_readme']} ({r.get('lines', 0)} lines, {r.get('headings_count', 0)} H2s)")
    print(f"  Configs: {r['config_files']}")
    print(f"  Assets: {r['asset_files']} (starter={r.get('starter')}, completed={r.get('completed')})")
    print(f"  Doc: {r.get('doc_status')}, Sim: {r.get('sim_status')}")
