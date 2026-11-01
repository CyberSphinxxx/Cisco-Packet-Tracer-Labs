#!/usr/bin/env python3
"""Unattended lab queue checkpoint controller. Python stdlib only.

Never interacts with the simulator. `complete` is a structural check, NOT evidence that
Packet Tracer was actually executed. Real MCP verification + external QA remain mandatory.
"""
import argparse
import datetime as dt
import hashlib
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile

FACTORY = Path(__file__).resolve().parent.parent
QUEUE_FILE = FACTORY / 'queue' / 'CURRICULUM_QUEUE.json'
POLICY_FILE = FACTORY / 'config' / 'FACTORY_POLICY.json'
STATE = FACTORY / 'state' / 'progress.json'
VALID_CATEGORY = {'network-fundamentals', 'ip-addressing', 'switching', 'routing', 'network-services', 'network-security', 'wireless-wan', 'troubleshooting'}
VALID_STATUS = {'pending', 'in_progress', 'completed', 'blocked'}

def now():
    return dt.datetime.now(dt.timezone.utc).isoformat(timespec='seconds')

def load(path):
    return json.loads(Path(path).read_text(encoding='utf-8'))

def write_atomic(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    fd, name = tempfile.mkstemp(prefix='progress-', suffix='.tmp', dir=path.parent)
    try:
        with os.fdopen(fd, 'w', encoding='utf-8', newline='\n') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
            f.write('\n')
            f.flush()
            os.fsync(f.fileno())
        os.replace(name, path)
    finally:
        if os.path.exists(name):
            os.unlink(name)

def load_queue():
    q = load(QUEUE_FILE)
    if not isinstance(q, list) or not q:
        raise ValueError('queue must contain a nonempty array')
    return q

def load_policy():
    return load(POLICY_FILE)

def check_queue(queue):
    ids = [x.get('id') for x in queue]
    if len(set(ids)) != len(ids):
        raise ValueError('duplicate queue IDs')
    for item in queue:
        code = item.get('id', '')
        if len(code) != 8 or not code.startswith('PTL-') or not code[4:].isdigit():
            raise ValueError('invalid ID: ' + str(code))
        if item.get('category') not in VALID_CATEGORY:
            raise ValueError(f'{code} category not recognized by repository validator')
        if not item.get('acceptance') or not item.get('scope') or not item.get('title'):
            raise ValueError(f'{code} missing learning objective or acceptance criteria')
        for dep in item.get('prerequisites', []):
            if dep == code:
                raise ValueError(f'{code} self-dependency')
    return True

def git(repo, *args, required=True):
    x = subprocess.run(['git', '-C', str(repo), *args], capture_output=True, text=True, encoding='utf-8', errors='replace')
    if x.returncode and required:
        raise RuntimeError(f'git {" ".join(args)} failed: {x.stderr.strip()}')
    return x.stdout.strip(), x.returncode

def inventory(repo):
    found = {}
    for p in (repo / 'labs').glob('*/*/metadata.json'):
        try:
            m = load(p)
        except (ValueError, OSError) as e:
            raise ValueError(f'invalid existing metadata {p}: {e}')
        code = m.get('id')
        if code in found:
            raise ValueError(f'duplicate canonical lab ID: {code}: {p} / {found[code][0]}')
        found[code] = (p, m)
    return found

def get_state():
    if not STATE.exists():
        raise ValueError('state absent; run `init --repo .` first')
    st = load(STATE)
    if st.get('schema_version') != 1:
        raise ValueError('unsupported progress schema')
    return st

def issue(repo, queue, st=None):
    if not (repo / 'labs').is_dir() or not (repo / 'site').is_dir():
        raise ValueError('repo must contain labs/ and site/ (run from correct repository root)')
    i = inventory(repo)
    probs = []
    for t in queue:
        code = t['id']
        if code in i:
            current = st.get('tasks', {}).get(code, {}).get('status') if st else None
            if current not in ('completed', 'in_progress'):
                probs.append(f'{code} already exists in canonical labs (collision, not an automatic overwrite)')
    if probs:
        raise ValueError('; '.join(probs))
    return i

def initial(queue):
    return {
        'schema_version': 1, 'created_at_utc': now(), 'session_started_utc': now(),
        'session_completed': 0, 'session_blocked': 0, 'session_consecutive_blocks': 0,
        'tasks': {x['id']: {'status': 'pending', 'attempts': 0, 'updated_at_utc': None, 'reason': '', 'commit': None, 'evidence': None} for x in queue}
    }

def elapsed_minutes(st, current=None):
    current = current or dt.datetime.now(dt.timezone.utc)
    then = dt.datetime.fromisoformat(st['session_started_utc'])
    return max(0, (current - then).total_seconds() / 60.0)

def halt_reason(st, pol):
    if elapsed_minutes(st) >= int(pol['max_runtime_minutes_per_session']):
        return 'session wall-clock cap reached; write handoff and stop'
    if st['session_completed'] >= int(pol['max_successful_labs_per_session']):
        return 'session completed-lab cap reached'
    if st['session_blocked'] >= int(pol['max_blocked_per_session']):
        return 'maximum blocked labs reached; needs owner review'
    if st['session_consecutive_blocks'] >= int(pol['max_consecutive_blocks']):
        return 'consecutive blocked labs threshold reached; investigate environment'
    return None

def dependency_met(code, st, existing):
    if code in st['tasks']:
        return st['tasks'][code]['status'] == 'completed'
    if code not in existing:
        return False
    m = existing[code][1]
    return m.get('status', {}).get('simulator') == 'tested_pass' and m.get('status', {}).get('documentation') in ('reviewed','published')

def select_next(q, st, existing, pol):
    reason = halt_reason(st, pol)
    if reason:
        return {'status': 'halt', 'reason': reason}
    active = [x for x in q if st['tasks'][x['id']]['status'] == 'in_progress']
    if len(active) > 1:
        return {'status': 'halt', 'reason': 'multiple active tasks: manual reconciliation required'}
    if active:
        return {'status': 'resume', 'task': active[0]}
    for x in q:
        record = st['tasks'][x['id']]
        if record['status'] != 'pending':
            continue
        if x['id'] in existing:
            return {'status': 'halt', 'reason': f'{x["id"]} already exists on disk; do not overwrite canonical lab'}
        if all(dependency_met(d, st, existing) for d in x.get('prerequisites', [])):
            return {'status': 'ready', 'task': x}
    if all(st['tasks'][x['id']]['status'] in ('completed', 'blocked') for x in q):
        return {'status': 'done'}
    waiting = [x['id'] for x in q if st['tasks'][x['id']]['status'] == 'pending']
    return {'status': 'halt', 'reason': 'no eligible pending task; blocked or missing prerequisites: ' + ', '.join(waiting)}

def check_complete(repo, item, commit, evidence):
    current, _ = git(repo, 'rev-parse', 'HEAD')
    full, _ = git(repo, 'rev-parse', commit + '^{commit}')
    if current != full:
        raise ValueError('commit must be the current local HEAD; checkpoint after committing the lab')
    clean, _ = git(repo, 'status', '--porcelain=v1')
    if clean:
        raise ValueError('worktree is not clean: commit all intended changes before queue completion')
    if not evidence.startswith('AI_AGENT_GUIDE/state/') or '..' in Path(evidence).parts:
        raise ValueError('evidence must be a root-relative AI_AGENT_GUIDE/state path')
    ev = (repo / evidence).resolve()
    if not ev.is_relative_to(repo.resolve()) or not ev.is_file():
        raise ValueError('evidence file missing')
    txt = ev.read_text(encoding='utf-8', errors='replace')
    if item['id'] not in txt or not any(a in txt for a in ('POS-', 'STP-POS-', 'DTP-POS-', 'L3-POS-')):
        raise ValueError('evidence missing lab ID or positive-test identifiers (manual verification still required)')
    cat = item['category']
    matches = []
    for p in (repo / 'labs').glob('*/**/metadata.json'):
        if p.parent.parent.name not in VALID_CATEGORY:
            continue
        try: d = load(p)
        except (OSError, ValueError): continue
        if d.get('id') == item['id']:
            matches.append((p, d))
    if len(matches) != 1:
        raise ValueError(f'expected one canonical directory for {item["id"]}, found {len(matches)}')
    p, meta = matches[0]
    if p.parent.parent.name != cat or meta.get('category') != cat:
        raise ValueError('category mismatched candidate and actual metadata; amend queue only by owner review')
    if meta.get('slug') != p.parent.name:
        raise ValueError('metadata slug mismatches directory')
    if meta.get('status', {}).get('simulator') != 'tested_pass' or meta.get('status', {}).get('documentation') not in ('reviewed','published'):
        raise ValueError('metadata is not reviewed + simulator tested_pass')
    if meta.get('status', {}).get('simulator_evidence') != evidence:
        raise ValueError('metadata simulator_evidence differs from supplied evidence')
    for x in ('README.md', 'verification.md'):
        if not (p.parent / x).is_file():
            raise ValueError(x + ' missing')
    headings = [x.lstrip('# ').strip() for x in (p.parent / 'README.md').read_text(encoding='utf-8').splitlines() if x.startswith('## ')]
    expected = ['Learning Objectives','Prerequisites','Topology','Addressing Table','Lab Tasks','Configuration Walkthrough','Verification','Troubleshooting','Key Takeaways','References','Files and Validation Status']
    if headings != expected:
        raise ValueError('README canonical 11-heading contract mismatch')
    assets = meta.get('assets', {})
    hashes = {}
    for role, ext in [('starter','.pkt'),('completed','.pkt'),('topology','.png')]:
        rel = assets.get(role)
        if not rel or Path(rel).is_absolute() or '..' in Path(rel).parts or not rel.endswith(ext):
            raise ValueError(f'{role} invalid metadata asset path')
        target = (p.parent / rel).resolve()
        if not target.is_relative_to(p.parent.resolve()) or not target.is_file() or target.stat().st_size < 32:
            raise ValueError(f'{role} missing or too small')
        content = target.read_bytes()
        if role == 'topology' and not content.startswith(b'\x89PNG\r\n\x1a\n'):
            raise ValueError('topology PNG signature invalid')
        hashes[role] = hashlib.sha256(content).hexdigest()
    if hashes['starter'] == hashes['completed']:
        raise ValueError('starter and completed .pkt have identical hashes')
    return {'canonical_dir': p.parent.relative_to(repo).as_posix(), 'sha256': hashes}

def cli():
    ap = argparse.ArgumentParser(description=__doc__)
    subs = ap.add_subparsers(dest='cmd', required=True)
    for name in ('preflight','init','next','start','complete','block','retry','status','resume-session'):
        p = subs.add_parser(name)
        p.add_argument('--repo', default='.')
        if name in ('start','complete','block','retry'):
            p.add_argument('id')
        if name == 'complete':
            p.add_argument('--commit', required=True)
            p.add_argument('--evidence', required=True)
        if name == 'block':
            p.add_argument('--reason', required=True)
        if name == 'resume-session':
            p.add_argument('--ack', required=True, choices=['NEW_SESSION'])
    args = ap.parse_args()
    repo = Path(args.repo).resolve()
    q, pol = load_queue(), load_policy()
    check_queue(q)
    by_id = {x['id']: x for x in q}
    if args.cmd == 'preflight':
        st = load(STATE) if STATE.exists() else None
        inv = issue(repo, q, st)
        top, _ = git(repo, 'rev-parse', '--show-toplevel')
        branch, _ = git(repo, 'branch', '--show-current')
        print(json.dumps({'status':'ok','repo':str(repo),'git_top':top,'branch':branch,'existing_labs':len(inv),'queue_count':len(q),'state_exists':bool(st)}, indent=2))
        return
    if args.cmd == 'init':
        if STATE.exists():
            st = get_state()
            issue(repo, q, st)
            print(json.dumps({'status':'existing_state','progress':str(STATE),'summary':summarize(st)}))
        else:
            issue(repo, q)
            st = initial(q)
            write_atomic(STATE, st)
            print(json.dumps({'status':'initialized','progress':str(STATE),'summary':summarize(st)}))
        return
    st = get_state()
    if set(st['tasks']) != set(by_id):
        raise ValueError('queue IDs changed since init; manual reconciliation required')
    existing = inventory(repo)
    if args.cmd == 'status':
        print(json.dumps({'summary':summarize(st),'session_elapsed_minutes':round(elapsed_minutes(st),1),'session_limit_reason':halt_reason(st,pol),'branch':git(repo,'branch','--show-current')[0]},indent=2))
        return
    if args.cmd == 'next':
        print(json.dumps(select_next(q,st,existing,pol),indent=2))
        return
    if args.cmd == 'resume-session':
        st['session_started_utc'] = now()
        st['session_completed'] = st['session_blocked'] = st['session_consecutive_blocks'] = 0
        write_atomic(STATE, st)
        print(json.dumps({'status':'new_session_started','summary':summarize(st)}))
        return
    code = args.id
    if code not in by_id:
        raise ValueError('task ID not in canonical queue: ' + code)
    rec = st['tasks'][code]
    if args.cmd == 'start':
        expected = select_next(q, st, existing, pol)
        if expected.get('status') != 'ready' or expected['task']['id'] != code:
            raise ValueError('task is not the next eligible ready candidate: ' + json.dumps(expected))
        if rec['attempts'] >= int(pol['max_lab_attempts']):
            raise ValueError('max task attempts reached')
        rec.update(status='in_progress', attempts=rec['attempts']+1, updated_at_utc=now())
        write_atomic(STATE, st)
        print(json.dumps({'status':'in_progress','id':code,'attempts':rec['attempts']}))
    elif args.cmd == 'complete':
        if rec['status'] != 'in_progress':
            raise ValueError('must be in_progress to complete')
        details = check_complete(repo, by_id[code], args.commit, args.evidence)
        rec.update(status='completed', commit=git(repo, 'rev-parse', 'HEAD')[0], evidence=args.evidence, reason='', updated_at_utc=now(), verification_details=details)
        st['session_completed'] += 1
        st['session_consecutive_blocks'] = 0
        write_atomic(STATE, st)
        print(json.dumps({'status':'completed','id':code,'details':details}))
    elif args.cmd == 'block':
        if rec['status'] not in ('in_progress','pending'):
            raise ValueError('only pending/in_progress tasks may be blocked')
        if len(args.reason.strip()) < 18:
            raise ValueError('block reason must describe actual observed blocker')
        rec.update(status='blocked', reason=args.reason.strip(), updated_at_utc=now())
        st['session_blocked'] += 1
        st['session_consecutive_blocks'] += 1
        write_atomic(STATE, st)
        print(json.dumps({'status':'blocked','id':code,'reason':rec['reason']}))
    elif args.cmd == 'retry':
        if rec['status'] != 'blocked':
            raise ValueError('retry only permitted for blocked task')
        if rec['attempts'] >= int(pol['max_lab_attempts']):
            raise ValueError('max task attempts reached; owner review required')
        rec.update(status='pending',updated_at_utc=now())
        write_atomic(STATE, st)
        print(json.dumps({'status':'pending','id':code,'remaining_attempts':int(pol['max_lab_attempts'])-rec['attempts']}))

def summarize(st):
    v = {k:0 for k in sorted(VALID_STATUS)}
    for x in st['tasks'].values():
        v[x['status']] += 1
    v['total'] = len(st['tasks'])
    v['in_progress_ids'] = [k for k,x in st['tasks'].items() if x['status']=='in_progress']
    v['blocked_ids'] = [k for k,x in st['tasks'].items() if x['status']=='blocked']
    return v

if __name__=='__main__':
    try:
        cli()
    except (ValueError, RuntimeError, OSError, KeyError) as exc:
        print(json.dumps({'status':'error','reason':str(exc)}), file=sys.stderr)
        sys.exit(2)
