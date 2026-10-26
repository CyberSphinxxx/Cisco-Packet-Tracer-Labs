#!/usr/bin/env python3
"""Offline, standard-library-only public Packet Tracer lab metadata/link gate.

Usage: python AI_AGENT_GUIDE/tools/validate_repo.py --root .
This is a *static* validator, NOT a Packet Tracer binary or simulation test.
"""
from __future__ import annotations
import argparse
import json
import re
import sys
from pathlib import Path
from urllib.parse import unquote, urlsplit

CATEGORIES = {
    'network-fundamentals','ip-addressing','switching','routing',
    'network-services','network-security','wireless-wan','troubleshooting'
}
SOURCES = {'original','permission_verified','external_reference','restricted'}
DOC_STATES = {'draft','reviewed','published'}
SIM_STATES = {'not_tested','tested_pass','tested_fail','not_applicable'}
DIFFICULTIES = {'beginner','intermediate','advanced'}
HEADINGS = [
    'Learning Objectives','Prerequisites','Topology','Addressing Table',
    'Lab Tasks','Configuration Walkthrough','Verification','Troubleshooting',
    'Key Takeaways','References','Files and Validation Status'
]
REQUIRED = {
    'id','title','slug','category','summary','difficulty','topics',
    'learning_objectives','estimated_minutes','activity_reference',
    'packet_tracer_version','devices','source','license_decision',
    'assets','status','references','last_reviewed'
}
LINK = re.compile(r'(?<!!)\[[^\]]*\]\(([^)]+)\)|!\[[^\]]*\]\(([^)]+)\)')


def validate(root: Path) -> list[tuple[str, str, str]]:
    """Return (severity, filepath, message). errors are blocking."""
    root = root.resolve()
    problems: list[tuple[str, str, str]] = []
    def add(level: str, path: Path, msg: str):
        try: label = path.relative_to(root).as_posix()
        except ValueError: label = str(path)
        problems.append((level, label, msg))

    def valid_rel_link(mdfile: Path, href: str):
        href = href.strip().strip('<>')
        if not href or href.startswith('#'): return
        parsed = urlsplit(href)
        if parsed.scheme or parsed.netloc or href.startswith('//'): return
        raw = unquote(parsed.path)
        if not raw: return
        target = (root / raw.lstrip('/') if raw.startswith('/') else mdfile.parent / raw).resolve()
        if not target.is_relative_to(root):
            add('ERROR', mdfile, f'path outside repository: {href}')
        elif not target.exists():
            add('ERROR', mdfile, f'broken local link: {href}')

    # Validate entrypoint docs even before lab migration.
    for item in [root/'README.md', root/'docs'/'lab-index.md']:
        if item.exists():
            for linkmatch in LINK.finditer(item.read_text(encoding='utf-8', errors='replace')):
                href = next((x for x in linkmatch.groups() if x is not None), '')
                valid_rel_link(item, href.split(' "', 1)[0])

    labs = root/'labs'
    if not labs.exists():
        add('INFO', root, 'labs directory absent (expected before migration)')
        return problems

    ids: dict[str, Path] = {}
    slugs: dict[str, Path] = {}
    for category in sorted(p for p in labs.iterdir() if p.is_dir()):
        if category.name not in CATEGORIES:
            add('ERROR', category, 'unexpected top-level lab category')
        for lab in sorted(p for p in category.iterdir() if p.is_dir()):
            metadata_path = lab/'metadata.json'
            readme = lab/'README.md'
            if not metadata_path.exists():
                add('ERROR', lab, 'missing metadata.json')
                continue
            if not readme.exists():
                add('ERROR', lab, 'missing README.md')
                continue
            try:
                data = json.loads(metadata_path.read_text(encoding='utf-8'))
            except (OSError, UnicodeError, json.JSONDecodeError) as e:
                add('ERROR', metadata_path, 'cannot parse JSON: '+str(e))
                continue
            if not isinstance(data, dict):
                add('ERROR', metadata_path, 'metadata must be a JSON object')
                continue
            for key in sorted(REQUIRED - set(data)):
                add('ERROR', metadata_path, f'missing field {key}')
            uid = data.get('id')
            slug = data.get('slug')
            cat = data.get('category')
            if not isinstance(uid, str) or re.fullmatch(r'PTL-\d{4,}', uid) is None:
                add('ERROR', metadata_path, 'id must look like PTL-0001')
            elif uid in ids:
                add('ERROR', metadata_path, f'duplicate lab id {uid} (already in {ids[uid]})')
            else: ids[uid] = metadata_path
            if not isinstance(slug,str) or not re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*', slug):
                add('ERROR', metadata_path, 'invalid lowercase kebab-case slug')
            elif slug in slugs:
                add('ERROR', metadata_path, f'duplicate global slug {slug}')
            else: slugs[slug] = metadata_path
            if slug != lab.name: add('ERROR', metadata_path, 'slug differs from lab folder')
            if cat not in CATEGORIES or cat != category.name:
                add('ERROR', metadata_path, 'category invalid or differs from folder')
            if data.get('difficulty') not in DIFFICULTIES:
                add('ERROR', metadata_path, 'difficulty invalid')
            for name in ['title','summary','license_decision']:
                if not isinstance(data.get(name),str) or not data[name].strip():
                    add('ERROR', metadata_path, f'{name} must be nonempty string')
            for name in ['topics','learning_objectives','devices','references']:
                if not isinstance(data.get(name),list):
                    add('ERROR', metadata_path, f'{name} must be a list')
            est=data.get('estimated_minutes')
            if est is not None and (type(est) is not int or est <= 0):
                add('ERROR', metadata_path, 'estimated_minutes must be positive integer or null')
            source=data.get('source')
            if not isinstance(source,dict) or source.get('type') not in SOURCES:
                add('ERROR', metadata_path, 'invalid source.type')
                source_type=None
            else: source_type=source['type']
            status=data.get('status')
            if not isinstance(status,dict) or status.get('documentation') not in DOC_STATES or status.get('simulator') not in SIM_STATES:
                add('ERROR', metadata_path, 'invalid status.documentation/simulator')
                state=None; sim=None
            else: state=status['documentation']; sim=status['simulator']
            if source_type=='restricted':
                add('ERROR', metadata_path, 'restricted assets belong outside public labs/ entirely')
            if source_type=='permission_verified' and not source.get('permission_evidence'):
                add('ERROR', metadata_path, 'permission_verified without concrete evidence')
            if sim=='tested_pass' and not status.get('simulator_evidence'):
                add('ERROR', metadata_path, 'tested_pass requires simulator_evidence path/reference')
            assets=data.get('assets')
            if not isinstance(assets,dict):
                add('ERROR', metadata_path, 'assets must be an object')
            else:
                for k in ['starter','completed','topology']:
                    v=assets.get(k)
                    if v is None: continue
                    if not isinstance(v,str) or not v or '://' in v or v.startswith('/'):
                        add('ERROR', metadata_path, f'assets.{k} must be relative file path or null')
                        continue
                    target=(lab/v).resolve()
                    if not target.is_relative_to(lab.resolve()):
                        add('ERROR', metadata_path, f'assets.{k} escapes lab folder')
                    elif not target.is_file():
                        add('ERROR', metadata_path, f'assets.{k} missing file {v}')
                if source_type=='external_reference' and any(assets.get(k) for k in ['starter','completed','topology']):
                    add('ERROR', metadata_path, 'external_reference cannot claim hosted lab assets')
            prose=readme.read_text(encoding='utf-8',errors='replace')
            if state in {'reviewed','published'}:
                found=set(re.findall(r'^##\s+(.+?)\s*$',prose,flags=re.M))
                for heading in HEADINGS:
                    if heading not in found:
                        add('ERROR', readme, 'reviewed/published guide missing section: '+heading)
                if '{{' in prose or '}}' in prose:
                    add('ERROR', readme, 'template placeholder in reviewed/published guide')
                if not data.get('references'):
                    add('ERROR', metadata_path, 'reviewed/published guide needs references')
            for linkmatch in LINK.finditer(prose):
                href=next((x for x in linkmatch.groups() if x is not None),'')
                valid_rel_link(readme,href.split(' "',1)[0])
    return problems


def main() -> int:
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument('--root',type=Path,default=Path('.'))
    p.add_argument('--json',action='store_true',help='machine-readable output')
    args=p.parse_args()
    issues=validate(args.root)
    errors=sum(level=='ERROR' for level,_,_ in issues)
    if args.json:
        print(json.dumps({'errors':errors,'issues':[{'level':x,'file':p,'message':msg} for x,p,msg in issues]},indent=2))
    else:
        for level,file,msg in issues: print(f'{level}: {file}: {msg}')
        print(f'Validation: {errors} error(s), {len(issues)-errors} notices')
    return 1 if errors else 0

if __name__=='__main__': sys.exit(main())
