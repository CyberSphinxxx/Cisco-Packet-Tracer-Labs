/**
 * Build-level auto-discovery proof (kit Phase 02 / acceptance gate):
 * a temporary lab folder added to a copy of the canonical content appears as
 * a generated route with its downloads after a clean `astro build`, and
 * disappears again once the folder is removed. No site code is edited.
 *
 * Runs the real Astro CLI in a child process against a temporary copy of the
 * content roots, so the real repository is never modified.
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';
import { labMetadata, labReadme, PNG_1x1 } from '../helpers/fixture';
import { REAL_ROOT, SITE_ROOT } from '../helpers/repo';

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ptl-build-'));
const repo = path.join(tmp, 'repo');
afterAll(() => fs.rmSync(tmp, { recursive: true, force: true }));

function copyContent() {
  for (const d of ['labs', 'projects', 'learning-paths', 'docs']) fs.cpSync(path.join(REAL_ROOT, d), path.join(repo, d), { recursive: true });
  fs.copyFileSync(path.join(REAL_ROOT, 'README.md'), path.join(repo, 'README.md'));
  fs.copyFileSync(path.join(REAL_ROOT, 'LICENSE'), path.join(repo, 'LICENSE'));
  // tested_pass labs require their (repo-root-relative) evidence files to exist
  fs.cpSync(path.join(REAL_ROOT, 'AI_AGENT_GUIDE', 'state'), path.join(repo, 'AI_AGENT_GUIDE', 'state'), { recursive: true });
}

function build(outDir: string) {
  const env = { ...process.env, PTL_REPO_ROOT: repo, PTL_SITE_URL: '', ASTRO_TELEMETRY_DISABLED: '1' };
  execFileSync(process.execPath, [path.join(SITE_ROOT, 'node_modules/astro/bin/astro.mjs'), 'build', '--outDir', outDir], { cwd: SITE_ROOT, env, stdio: 'pipe' });
  execFileSync(process.execPath, [path.join(SITE_ROOT, 'scripts/write-headers.mjs'), outDir], { cwd: SITE_ROOT, env, stdio: 'pipe' });
}

const FIXTURE = { id: 'PTL-9999', category: 'routing', slug: 'zz-temporary-fixture-lab', title: 'Temporary Fixture Lab For Discovery Proof' };
// Independent audit D1: metadata text must never break out of the catalog's JSON <script> block.
const HOSTILE_SUMMARY = 'Probe </script><script>window.__pwned=1</script> end & <b>bold</b>';
const fixtureDir = () => path.join(repo, 'labs', FIXTURE.category, FIXTURE.slug);

describe('clean build auto-discovers a new lab folder', () => {
  it('adds the route and downloads, then removes them', () => {
    copyContent();
    const dir = fixtureDir();
    fs.mkdirSync(path.join(dir, 'assets'), { recursive: true });
    fs.mkdirSync(path.join(dir, 'configs'), { recursive: true });
    fs.writeFileSync(path.join(dir, 'README.md'), labReadme(FIXTURE).replace('[verification](verification.md#checks)', 'verification guide'));
    fs.writeFileSync(path.join(dir, 'metadata.json'), JSON.stringify(labMetadata({ ...FIXTURE, meta: { summary: HOSTILE_SUMMARY, status: { documentation: 'reviewed', simulator: 'not_tested', simulator_evidence: null } } }), null, 2));
    fs.writeFileSync(path.join(dir, 'configs', 'R1.txt'), 'hostname R1\n');
    fs.writeFileSync(path.join(dir, 'assets', 'starter.pkt'), Buffer.from('fixture-starter-bytes'));
    fs.writeFileSync(path.join(dir, 'assets', 'completed.pkt'), Buffer.from('fixture-completed-bytes'));
    fs.writeFileSync(path.join(dir, 'assets', 'topology.png'), PNG_1x1);

    const withFixture = path.join(tmp, 'dist-with');
    build(withFixture);
    const page = path.join(withFixture, 'labs', FIXTURE.category, FIXTURE.slug, 'index.html');
    expect(fs.existsSync(page)).toBe(true);
    expect(fs.readFileSync(page, 'utf8')).toContain(FIXTURE.title);
    expect(fs.readFileSync(path.join(withFixture, 'labs', FIXTURE.category, FIXTURE.slug, 'assets', 'starter.pkt'), 'utf8')).toBe('fixture-starter-bytes');
    const catalog = path.join(withFixture, 'labs', 'index.html');
    const catalogHtml = fs.readFileSync(catalog, 'utf8');
    expect(catalogHtml).toContain(`data-lab-id="${FIXTURE.id}"`);
    // hostile metadata is escaped everywhere: no executable script, no raw markup
    for (const f of [catalog, page, path.join(withFixture, 'labs', 'routing', 'index.html')]) {
      // Quoted attribute values are inert text in HTML; look for markup outside them.
      const markup = fs.readFileSync(f, 'utf8').replace(/="[^"]*"/g, '=""');
      expect(markup, f).not.toContain('<script>window.__pwned');
      expect(markup, f).not.toContain('<b>bold</b>');
    }
    // the header generator only trusts the marked theme script
    expect(fs.readFileSync(path.join(withFixture, '_headers'), 'utf8').match(/'sha256-/g) ?? []).toHaveLength(1);

    fs.rmSync(dir, { recursive: true, force: true });
    const without = path.join(tmp, 'dist-without');
    build(without);
    expect(fs.existsSync(path.join(without, 'labs', FIXTURE.category, FIXTURE.slug))).toBe(false);
    expect(fs.existsSync(path.join(without, 'labs', 'routing', 'single-area-ospfv2', 'index.html'))).toBe(true);
    expect(fs.readFileSync(path.join(without, 'labs', 'index.html'), 'utf8')).not.toContain(FIXTURE.id);
  }, 240_000);
});
