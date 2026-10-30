#!/usr/bin/env node
/**
 * Post-build: writes dist/_headers (Cloudflare Pages header rules) with a
 * strict Content-Security-Policy. Only inline <script> blocks marked
 * `data-csp-allow` (the pre-paint theme script) are allowed, by SHA-256 hash
 * computed from the built HTML; any other executable inline script fails the
 * build. JSON data blocks
 * (application/json, application/ld+json) are not executed and need no hash.
 */
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = path.resolve(fileURLToPath(new URL('..', import.meta.url)), process.argv[2] ?? 'dist');
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
/**
 * Yield every <script> element (attributes + body) in an HTML string using a
 * small tag scanner that respects quoted attribute values and comments, so
 * text such as content="...</script><script>..." inside an attribute is not
 * mistaken for markup.
 */
function* scripts(html) {
  let i = 0;
  while ((i = html.indexOf('<', i)) !== -1) {
    if (html.startsWith('<!--', i)) {
      const end = html.indexOf('-->', i + 4);
      i = end === -1 ? html.length : end + 3;
      continue;
    }
    const m = /^<\/?([a-zA-Z][a-zA-Z0-9-]*)/.exec(html.slice(i, i + 40));
    if (!m) {
      i += 1;
      continue;
    }
    // read to the end of the tag, honouring quotes
    let j = i + m[0].length;
    let quote = null;
    for (; j < html.length; j++) {
      const c = html[j];
      if (quote) {
        if (c === quote) quote = null;
      } else if (c === '"' || c === "'") quote = c;
      else if (c === '>') break;
    }
    const isOpenScript = m[0][1] !== '/' && m[1].toLowerCase() === 'script';
    const attrs = html.slice(i + m[0].length, j);
    i = j + 1;
    if (!isOpenScript) continue;
    const close = html.toLowerCase().indexOf('</script', i);
    const body = html.slice(i, close === -1 ? html.length : close);
    yield { attrs, body };
    i = close === -1 ? html.length : close + 8;
  }
}

const hashes = new Set();
const unexpected = [];
for (const file of walk(dist).filter((f) => f.endsWith('.html'))) {
  const html = fs.readFileSync(file, 'utf8');
  for (const { attrs, body } of scripts(html)) {
    if (/\bsrc=/.test(attrs)) continue;
    if (/type="application\/(ld\+)?json"/.test(attrs)) continue;
    if (!body.trim()) continue;
    // Only inline scripts the site explicitly marks are trusted. Anything else
    // (e.g. markup that escaped from content) fails the build instead of being
    // silently allow-listed by hash.
    if (!/\bdata-csp-allow\b/.test(attrs)) {
      unexpected.push(`${path.relative(dist, file)}: <script${attrs}>${body.slice(0, 60)}`);
      continue;
    }
    hashes.add(`'sha256-${crypto.createHash('sha256').update(body).digest('base64')}'`);
  }
}
if (unexpected.length) {
  console.error(`write-headers: ${unexpected.length} unexpected inline executable script(s); refusing to trust them:`);
  for (const u of unexpected.slice(0, 20)) console.error(`  ${u}`);
  process.exit(1);
}
const csp = [
  "default-src 'self'",
  `script-src 'self' 'wasm-unsafe-eval' ${[...hashes].sort().join(' ')}`.trim(),
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  'upgrade-insecure-requests',
].join('; ');
// Instant navigation: the browser prerenders a same-site page when the reader
// hovers (or presses) a link. Delivered as a response header pointing at a JSON
// rule set, so no inline script is needed and the CSP stays hash-only.
const base = (process.env.PTL_BASE || '/').replace(/\/?$/, '/');
const speculationRules = {
  prerender: [
    {
      where: {
        and: [
          { href_matches: `${base}*` },
          { not: { href_matches: [`${base}search/*`, `${base}pagefind/*`, `${base}*.pkt`, `${base}*.png`, `${base}*.txt`, `${base}*.xml`, `${base}*.json`] } },
          { not: { selector_matches: '[download], [target], [rel~="external"], [data-no-prerender]' } },
        ],
      },
      eagerness: 'moderate',
    },
  ],
};
fs.writeFileSync(path.join(dist, 'speculation-rules.json'), `${JSON.stringify(speculationRules, null, 2)}\n`);

// HTML pages get their own rules (one per directory depth) so their caching
// never combines with the immutable rule for hashed assets: Cloudflare joins
// repeated headers with a comma. Pages are reused for a minute and refreshed in
// the background for a day, so revisits and the back button are instant.
const depths = new Set(
  walk(dist)
    .filter((f) => f.endsWith(`${path.sep}index.html`))
    .map((f) => path.relative(dist, path.dirname(f)).split(path.sep).filter(Boolean).length),
);
const htmlRules = [...depths]
  .sort((a, b) => a - b)
  .map((d) => `/${Array.from({ length: d }, (_, i) => `:${String.fromCharCode(97 + i)}/`).join('')}
  Cache-Control: public, max-age=60, stale-while-revalidate=86400
  Speculation-Rules: "${base}speculation-rules.json"`)
  .join('\n\n');

const headers = `# Generated by scripts/write-headers.mjs after astro build. Do not edit by hand.
/*
  Content-Security-Policy: ${csp}
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()
  X-Frame-Options: DENY

${htmlRules}

/speculation-rules.json
  Content-Type: application/speculationrules+json
  Cache-Control: public, max-age=3600

/*.pkt
  Content-Type: application/octet-stream
  Content-Disposition: attachment

/_astro/*
  Cache-Control: public, max-age=31536000, immutable

/pagefind/*
  Cache-Control: public, max-age=3600
`;
fs.writeFileSync(path.join(dist, '_headers'), headers);
console.log(`write-headers: ${hashes.size} inline script hash(es) -> ${path.relative(process.cwd(), path.join(dist, '_headers'))}`);
