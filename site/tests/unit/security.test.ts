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

  it('gives HTML pages their own caching and prerender rules, separate from hashed assets', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ptl-headers-'));
    for (const rel of ['index.html', 'labs/index.html', 'labs/routing/x/index.html']) {
      fs.mkdirSync(path.join(dir, path.dirname(rel)), { recursive: true });
      fs.writeFileSync(path.join(dir, rel), '<script data-csp-allow>theme()</script>');
    }
    const r = spawnSync(process.execPath, [path.join(SITE_ROOT, 'scripts/write-headers.mjs'), dir], { encoding: 'utf8' });
    const headers = fs.readFileSync(path.join(dir, '_headers'), 'utf8');
    const rules = JSON.parse(fs.readFileSync(path.join(dir, 'speculation-rules.json'), 'utf8'));
    fs.rmSync(dir, { recursive: true, force: true });
    expect(r.status, r.stderr).toBe(0);
    // One rule per directory depth; placeholders are letters only (Cloudflare Pages syntax).
    for (const rule of ['/', '/:a/', '/:a/:b/:c/']) {
      expect(headers).toContain(`\n${rule}\n  Cache-Control: public, max-age=60, stale-while-revalidate=86400\n  Speculation-Rules: "/speculation-rules.json"`);
    }
    expect(headers).not.toMatch(/\/:[a-z]*\d/);
    // The catch-all rule never sets Cache-Control, so it cannot combine with the immutable asset rule.
    const catchAll = /(?:^|\n)\/\*\n[\s\S]*?(?:\n\n|$)/.exec(headers)![0];
    expect(catchAll).not.toContain('Cache-Control');
    expect(headers).toContain('/_astro/*\n  Cache-Control: public, max-age=31536000, immutable');
    expect(headers).toContain('/speculation-rules.json\n  Content-Type: application/speculationrules+json');
    const rule = rules.prerender[0];
    expect(rule.eagerness).toBe('moderate');
    const excluded = rule.where.and[1].not.href_matches as string[];
    for (const x of ['/search/*', '/pagefind/*', '/*.pkt']) expect(excluded).toContain(x);
    expect(rule.where.and[2].not.selector_matches).toContain('[download]');
  });

  describe('PTL_REDIRECT_TO', () => {
    const build = (redirectTo: string | undefined, existing?: string) => {
      const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ptl-redirects-'));
      fs.writeFileSync(path.join(dir, 'index.html'), '<script data-csp-allow>theme()</script>');
      if (existing) fs.writeFileSync(path.join(dir, '_redirects'), existing);
      const env = { ...process.env };
      delete env.PTL_REDIRECT_TO;
      if (redirectTo !== undefined) env.PTL_REDIRECT_TO = redirectTo;
      const r = spawnSync(process.execPath, [path.join(SITE_ROOT, 'scripts/write-headers.mjs'), dir], { encoding: 'utf8', env });
      const file = path.join(dir, '_redirects');
      const redirects = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;
      const headers = fs.existsSync(path.join(dir, '_headers'));
      fs.rmSync(dir, { recursive: true, force: true });
      return { status: r.status, stderr: r.stderr, redirects, headers };
    };

    it('writes no _redirects by default, and removes a stale one', () => {
      expect(build(undefined).redirects).toBeNull();
      expect(build('', '/* https://old.example/:splat 301\n').redirects).toBeNull();
    });

    it('sends every path to the same path on the new origin with a 301', () => {
      const r = build('https://itnetworking.pages.dev');
      expect(r.status, r.stderr).toBe(0);
      expect(r.redirects).toBe('/* https://itnetworking.pages.dev/:splat 301\n');
      expect(r.headers).toBe(true);
    });

    it('normalises a trailing slash and surrounding spaces', () => {
      expect(build('  https://itnetworking.pages.dev/  ').redirects).toBe('/* https://itnetworking.pages.dev/:splat 301\n');
    });

    it('refuses values that are not a plain http(s) origin', () => {
      for (const bad of ['itnetworking.pages.dev', 'javascript:alert(1)', 'https://a.example/?x=1', 'https://a.example/#x', 'https://user:pw@a.example', 'https://a.example\n/* /evil 200']) {
        const r = build(bad);
        expect(r.status, bad).toBe(1);
        expect(r.stderr, bad).toContain('PTL_REDIRECT_TO must be');
        expect(r.redirects, bad).toBeNull();
      }
    });
  });
});
