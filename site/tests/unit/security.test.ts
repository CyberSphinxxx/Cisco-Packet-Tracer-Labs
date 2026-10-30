import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { scriptJson } from '../../src/lib/json';
import { SITE_ROOT } from '../helpers/repo';

const LS = String.fromCharCode(0x2028);
const PS = String.fromCharCode(0x2029);

describe('scriptJson', () => {
  it('cannot close a <script> element or start markup', () => {
    const value = { s: `</script><script>alert(1)</script> & <!-- ${LS}${PS}` };
    const out = scriptJson(value);
    for (const ch of ['<', '>', '&', LS, PS]) expect(out.includes(ch), JSON.stringify(ch)).toBe(false);
    expect(JSON.parse(out)).toEqual(value);
  });
});

describe('write-headers.mjs', () => {
  const run = (html: string) => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ptl-headers-'));
    fs.writeFileSync(path.join(dir, 'index.html'), html);
    const r = spawnSync(process.execPath, [path.join(SITE_ROOT, 'scripts/write-headers.mjs'), dir], { encoding: 'utf8' });
    const headersFile = path.join(dir, '_headers');
    const headers = fs.existsSync(headersFile) ? fs.readFileSync(headersFile, 'utf8') : null;
    fs.rmSync(dir, { recursive: true, force: true });
    return { status: r.status, stderr: r.stderr, headers };
  };

  it('hashes only scripts marked data-csp-allow and ignores JSON data blocks', () => {
    const r = run(
      '<script data-csp-allow>theme()</script><script type="application/json">{"a":1}</script>' +
        '<script type="application/ld+json">{}</script><script type="module" src="/_astro/x.js"></script>',
    );
    expect(r.status).toBe(0);
    expect(r.headers!.match(/'sha256-/g)).toHaveLength(1);
    expect(r.headers).toContain("frame-ancestors 'none'");
  });

  it('refuses to build when an unmarked inline script appears (e.g. injected markup)', () => {
    const r = run('<script data-csp-allow>theme()</script><script>window.__pwned=1</script>');
    expect(r.status).toBe(1);
    expect(r.stderr).toContain('unexpected inline executable script');
    expect(r.headers).toBeNull();
  });

  it('does not mistake script-like text inside quoted attributes or comments for markup', () => {
    const r = run(
      '<meta name="description" content="Probe </script><script>window.__pwned=1</script> end">' +
        "<a title='<script>x()</script>'>x</a><!-- <script>y()</script> --><script data-csp-allow>theme()</script>",
    );
    expect(r.status, r.stderr).toBe(0);
    expect(r.headers!.match(/'sha256-/g)).toHaveLength(1);
  });
});
