#!/usr/bin/env node
/**
 * Post-build audit of site/dist. Independent of the site's own code: expected
 * routes are derived directly from the canonical repository files.
 *
 * Checks:
 *  1. every lab folder, the capstone, each learning path and doc has a page;
 *  2. every internal href/src in every HTML page resolves to a built file,
 *     and every #fragment exists as an id in the target page;
 *  3. every lab page links its starter and completed .pkt, and those files
 *     are byte-identical to the canonical source (and to the baseline hashes
 *     when WEBSITE_AGENT_KIT/state/baseline-checksums.json is present);
 *  4. the output contains nothing private or unexpected (agent state,
 *     Markdown sources, .pka, scratch/download folders, env files).
 *
 * Usage: node scripts/check-dist.mjs [--dist dist] [--base /]
 * Exit code 0 = all checks pass, 1 = failures (listed).
 */
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const opt = (name, dflt) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? dflt : args[i + 1];
};
const siteRoot = fileURLToPath(new URL('..', import.meta.url));
const repoRoot = path.resolve(process.env.PTL_REPO_ROOT ?? path.join(siteRoot, '..'));
const dist = path.resolve(siteRoot, opt('dist', 'dist'));
const base = (opt('base', process.env.PTL_BASE ?? '/') || '/').replace(/\/?$/, '/');

const failures = [];
const fail = (msg) => failures.push(msg);
const sha = (p) => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const walk = (d) =>
  fs.existsSync(d)
    ? fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]))
    : [];

if (!fs.existsSync(dist)) {
  console.error(`dist folder not found: ${dist} (run npm run build first)`);
  process.exit(1);
}

const files = walk(dist);
const rel = (p) => path.relative(dist, p).split(path.sep).join('/');
const htmlFiles = files.filter((f) => f.endsWith('.html'));

// ---- 1. expected pages from canonical sources --------------------------------
const dirs = (p) => (fs.existsSync(p) ? fs.readdirSync(p, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name) : []);
const expected = [];
const labs = [];
for (const category of dirs(path.join(repoRoot, 'labs'))) {
  for (const slug of dirs(path.join(repoRoot, 'labs', category))) {
    const metaPath = path.join(repoRoot, 'labs', category, slug, 'metadata.json');
    const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
    if (meta.status?.documentation === 'draft' || meta.source?.type === 'external_reference') continue;
    labs.push({ category, slug, meta });
    expected.push(`labs/${category}/${slug}/index.html`);
  }
}
for (const p of dirs(path.join(repoRoot, 'projects'))) {
  if (fs.existsSync(path.join(repoRoot, 'projects', p, 'README.md'))) expected.push(`projects/${p}/index.html`);
}
for (const f of fs.readdirSync(path.join(repoRoot, 'learning-paths')).filter((f) => f.endsWith('.md'))) {
  expected.push(`learning-paths/${f.replace(/\.md$/, '')}/index.html`);
}
for (const f of fs.readdirSync(path.join(repoRoot, 'docs')).filter((f) => f.endsWith('.md'))) {
  expected.push(`docs/${f.replace(/\.md$/, '')}/index.html`);
}
// Astro writes output to dist/ itself; the base path only prefixes URLs.
const inDist = (r) => path.join(dist, ...r.split('/'));
for (const e of expected) if (!fs.existsSync(inDist(e))) fail(`missing page for canonical source: /${e.replace(/index\.html$/, '')}`);

// ---- 2. internal links and fragments -------------------------------------------
const idCache = new Map();
const idsOf = (file) => {
  if (!idCache.has(file)) {
    const html = fs.readFileSync(file, 'utf8');
    idCache.set(file, new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
  }
  return idCache.get(file);
};
const targetFile = (urlPath) => {
  if (!urlPath.startsWith(base)) return null;
  let decoded;
  try {
    decoded = decodeURIComponent(urlPath.slice(base.length));
  } catch {
    return undefined;
  }
  const p = path.join(dist, ...decoded.split('/').filter(Boolean));
  if (urlPath.endsWith('/')) return path.join(p, 'index.html');
  return p;
};

let linkCount = 0;
let fragmentCount = 0;
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  const page = rel(file);
  for (const m of html.matchAll(/\s(href|src)="([^"]*)"/g)) {
    const raw = m[2].replace(/&#x26;|&amp;/g, '&');
    if (/^(https?:|mailto:|data:image\/svg\+xml)/.test(raw)) continue;
    if (/^[a-z][a-z0-9+.-]*:/i.test(raw)) {
      fail(`${page}: disallowed URL scheme in ${m[1]}="${raw}"`);
      continue;
    }
    linkCount += 1;
    const [pathPart, fragment] = raw.split('#');
    let target = file;
    if (pathPart) {
      if (!pathPart.startsWith('/')) {
        fail(`${page}: relative URL "${raw}" (all internal URLs must be root-relative)`);
        continue;
      }
      const t = targetFile(pathPart.split('?')[0]);
      if (t === null) {
        fail(`${page}: URL outside base ${base}: ${raw}`);
        continue;
      }
      if (!t || !fs.existsSync(t)) {
        fail(`${page}: broken internal link ${raw}`);
        continue;
      }
      target = t;
    }
    if (fragment && target.endsWith('.html')) {
      fragmentCount += 1;
      if (!idsOf(target).has(decodeURIComponent(fragment))) fail(`${page}: missing fragment #${fragment} in ${rel(target)}`);
    }
  }
}

// ---- 3. downloads are linked and byte-identical ------------------------------------
const baselinePath = path.join(repoRoot, 'WEBSITE_AGENT_KIT/state/baseline-checksums.json');
const baseline = fs.existsSync(baselinePath) ? JSON.parse(fs.readFileSync(baselinePath, 'utf8')).files : {};
let downloadCount = 0;
for (const { category, slug, meta } of labs) {
  const page = inDist(`labs/${category}/${slug}/index.html`);
  if (!fs.existsSync(page)) continue;
  const html = fs.readFileSync(page, 'utf8');
  for (const role of ['starter', 'completed', 'topology']) {
    const asset = meta.assets?.[role];
    if (!asset) continue;
    const repoRel = `labs/${category}/${slug}/${asset}`;
    const url = `${base}${repoRel}`;
    if (role !== 'topology' && !html.includes(`href="${url}"`)) fail(`${rel(page)}: no link to ${role} ${url}`);
    const built = inDist(repoRel);
    if (!fs.existsSync(built)) {
      fail(`missing built file ${repoRel}`);
      continue;
    }
    const builtSha = sha(built);
    if (builtSha !== sha(path.join(repoRoot, ...repoRel.split('/')))) fail(`${repoRel}: built bytes differ from source`);
    if (baseline[repoRel] && baseline[repoRel].sha256 !== builtSha) fail(`${repoRel}: differs from baseline checksum`);
    if (fs.statSync(built).size === 0) fail(`${repoRel}: empty file`);
    downloadCount += 1;
  }
}
for (const [repoRel, { sha256 }] of Object.entries(baseline)) {
  const built = inDist(repoRel);
  if (fs.existsSync(built) && sha(built) !== sha256) fail(`${repoRel}: built file differs from baseline checksum`);
}

// ---- 4. inventory: nothing private or unexpected -------------------------------------
const forbidden = [
  [/(^|\/)AI_AGENT_GUIDE(\/|$)/i, 'agent state'],
  [/(^|\/)WEBSITE_AGENT_KIT(\/|$)/i, 'agent kit'],
  [/\.pka$/i, 'Packet Tracer assessment package'],
  [/\.mdx?$/i, 'Markdown source copy'],
  [/(^|\/)(scratch|downloads|private_archive|archive|node_modules)(\/|$)/i, 'non-public folder'],
  [/(^|\/)\.env/i, 'environment file'],
  [/\.(zip|tar|gz|7z|rar|exe|msi|pdf|docx?)$/i, 'unexpected archive/document'],
  [/(^|\/)metadata\.json$/i, 'raw metadata copy'],
];
for (const f of files) {
  const r = rel(f);
  for (const [re, why] of forbidden) if (re.test(r)) fail(`forbidden file in output (${why}): ${r}`);
}
const allHtml = htmlFiles.map((f) => fs.readFileSync(f, 'utf8')).join('\n');
for (const leak of [repoRoot, siteRoot, repoRoot.split(path.sep).join('/')]) {
  if (leak.length > 3 && allHtml.includes(leak)) fail(`absolute build-machine path leaked into HTML: ${leak}`);
}

const summary = {
  dist: path.relative(process.cwd(), dist) || '.',
  base,
  htmlPages: htmlFiles.length,
  files: files.length,
  expectedCanonicalPages: expected.length,
  internalLinksChecked: linkCount,
  fragmentsChecked: fragmentCount,
  downloadsVerified: downloadCount,
  baselineEntries: Object.keys(baseline).length,
  failures: failures.length,
};
console.log(JSON.stringify(summary, null, 2));
if (failures.length) {
  for (const f of failures.slice(0, 200)) console.error(`FAIL ${f}`);
  process.exit(1);
}
console.log('check-dist: PASS');
