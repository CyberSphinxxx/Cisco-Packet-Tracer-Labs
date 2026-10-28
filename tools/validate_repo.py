#!/usr/bin/env python3
"""Offline, standard-library-only public Packet Tracer lab metadata/link gate.

Usage: python tools/validate_repo.py --root .
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

    # Validate root docs, documentation library, learning paths, and projects
    extra_mds = [root/'README.md', root/'CONTRIBUTING.md', root/'SECURITY.md', root/'LICENSE']
    for folder in ['docs', 'learning-paths', 'projects']:
        fpath = root / folder
        if fpath.exists():
            extra_mds.extend(sorted(fpath.rglob('*.md')))
    for item in extra_mds:
        if item.exists():
            for linkmatch in LINK.finditer(item.read_text(encoding='utf-8', errors='replace')):
                href = next((x for x in linkmatch.groups() if x is not None), '')
                valid_rel_link(item, href.split(' "', 1)[0])

    for folder_name in ['labs', 'projects']:
        folder_path = root / folder_name
        if folder_path.exists():
            for pka in folder_path.rglob('*.pka'):
                add('ERROR', pka, 'restricted NetAcad .pka file detected in public curriculum folders')

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
            if sim=='tested_pass':
                ev_ref = status.get('simulator_evidence')
                if not ev_ref:
                    add('ERROR', metadata_path, 'tested_pass requires simulator_evidence path/reference')
                else:
                    ev_path = (root / ev_ref) if (root / ev_ref).exists() else (lab / ev_ref)
                    if not ev_path.is_file():
                        add('ERROR', metadata_path, f'tested_pass simulator_evidence file missing: {ev_ref}')
            assets=data.get('assets')
            if not isinstance(assets,dict):
                add('ERROR', metadata_path, 'assets must be an object')
            else:
                for k in ['starter','completed','topology']:
                    v=assets.get(k)
                    if v is None:
                        if sim == 'tested_pass':
                            add('ERROR', metadata_path, f'tested_pass requires assets.{k}')
                        continue
                    if not isinstance(v,str) or not v or '://' in v or v.startswith('/'):
                        add('ERROR', metadata_path, f'assets.{k} must be relative file path or null')
                        continue
                    target=(lab/v).resolve()
                    if not target.is_relative_to(lab.resolve()):
                        add('ERROR', metadata_path, f'assets.{k} escapes lab folder')
                    elif not target.is_file():
                        add('ERROR', metadata_path, f'assets.{k} missing file {v}')
                    elif target.stat().st_size == 0:
                        add('ERROR', metadata_path, f'assets.{k} file {v} must not be empty')
                if sim == 'tested_pass':
                    s_name = assets.get('starter')
                    c_name = assets.get('completed')
                    t_name = assets.get('topology')
                    if s_name and c_name:
                        s_target = (lab / s_name).resolve()
                        c_target = (lab / c_name).resolve()
                        if s_target.is_file() and c_target.is_file():
                            if s_target.stat().st_size == c_target.stat().st_size and s_target.read_bytes() == c_target.read_bytes():
                                add('ERROR', metadata_path, 'starter and completed assets must not be identical')
                    if t_name:
                        t_target = (lab / t_name).resolve()
                        if t_target.is_file():
                            try:
                                with open(t_target, 'rb') as tf:
                                    if tf.read(8) != b'\x89PNG\r\n\x1a\n':
                                        add('ERROR', metadata_path, f'assets.topology {t_name} must be a valid PNG image')
                            except OSError:
                                add('ERROR', metadata_path, f'cannot read assets.topology {t_name}')
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

            # Cross-file verification checks
            verification_path = lab / 'verification.md'
            v_prose = ''
            if verification_path.exists():
                v_prose = verification_path.read_text(encoding='utf-8', errors='replace')
                if uid not in v_prose:
                    add('ERROR', verification_path, f'verification guide missing lab ID {uid}')
                if sim == 'tested_pass' and 'NOT_TESTED' in v_prose:
                    add('ERROR', verification_path, 'verification guide indicates NOT_TESTED while metadata claims tested_pass')
                for linkmatch in LINK.finditer(v_prose):
                    href = next((x for x in linkmatch.groups() if x is not None), '')
                    valid_rel_link(verification_path, href.split(' "', 1)[0])

            configs_dir = lab / 'configs'
            if configs_dir.is_dir():
                cfg_files = sorted(configs_dir.glob('*.txt'))
                if not cfg_files:
                    add('ERROR', configs_dir, 'configs directory contains no .txt configuration files')
                for cfg in cfg_files:
                    if cfg.stat().st_size == 0:
                        add('ERROR', cfg, f'configuration file {cfg.name} is empty')
                        continue
                    cfg_text = cfg.read_text(encoding='utf-8', errors='replace')
                    for ip_match in re.finditer(r'^\s*ip\s+address\s+(\d+\.\d+\.\d+\.\d+)\s+(\d+\.\d+\.\d+\.\d+)', cfg_text, flags=re.M):
                        configured_ip = ip_match.group(1)
                        if configured_ip in {'0.0.0.0', '255.255.255.255'}:
                            continue
                        if configured_ip not in prose and configured_ip not in v_prose:
                            add('ERROR', cfg, f'configured interface IP {configured_ip} not found in README.md or verification.md')

    projects = root / 'projects'
    if projects.exists():
        for proj in sorted(p for p in projects.iterdir() if p.is_dir()):
            p_readme = proj / 'README.md'
            p_verif = proj / 'verification.md'
            p_prose = p_readme.read_text(encoding='utf-8', errors='replace') if p_readme.exists() else ''
            p_v_prose = p_verif.read_text(encoding='utf-8', errors='replace') if p_verif.exists() else ''
            p_configs = proj / 'configs'
            if p_configs.is_dir():
                for cfg in sorted(p_configs.glob('*.txt')):
                    if cfg.stat().st_size == 0:
                        add('ERROR', cfg, f'configuration file {cfg.name} is empty')
                        continue
                    cfg_text = cfg.read_text(encoding='utf-8', errors='replace')
                    for ip_match in re.finditer(r'^\s*ip\s+address\s+(\d+\.\d+\.\d+\.\d+)\s+(\d+\.\d+\.\d+\.\d+)', cfg_text, flags=re.M):
                        configured_ip = ip_match.group(1)
                        if configured_ip in {'0.0.0.0', '255.255.255.255'}:
                            continue
                        if configured_ip not in p_prose and configured_ip not in p_v_prose:
                            add('ERROR', cfg, f'configured interface IP {configured_ip} not found in README.md or verification.md')

    lab_index = root / 'docs' / 'lab-index.md'
    if lab_index.exists():
        index_text = lab_index.read_text(encoding='utf-8', errors='replace')
        for uid, meta_path in ids.items():
            lab_folder = meta_path.parent
            rel_pattern = f"{lab_folder.parent.name}/{lab_folder.name}/README.md"
            if rel_pattern not in index_text:
                add('ERROR', lab_index, f'active lab {uid} ({rel_pattern}) is missing from docs/lab-index.md')

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
