/**
 * Phase 01 gate: canonical ingestion from the real repository.
 * PTL-0008 must render from labs/.../README.md + metadata.json with correct
 * image, .pkt and config links, and all labs + the capstone must be discovered.
 */
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { REAL_ROOT, SITE_ROOT, load, realRepo } from '../helpers/repo';

const PTL8 = '/labs/network-fundamentals/ios-navigation-and-initial-config/';

describe('canonical ingestion (real repository)', () => {
  const repo = realRepo();

  it('discovers every lab folder exactly once, joined by folder path', () => {
    const folders = fs
      .readdirSync(path.join(REAL_ROOT, 'labs'))
      .flatMap((c) => fs.readdirSync(path.join(REAL_ROOT, 'labs', c)).map((s) => `${c}/${s}`))
      .sort();
    expect(repo.labs.map((l) => `${l.category}/${l.slug}`).sort()).toEqual(folders);
    expect(repo.labs).toHaveLength(folders.length);
    expect(repo.labs.length).toBeGreaterThanOrEqual(13);
    expect(new Set(repo.labs.map((l) => l.id)).size).toBe(repo.labs.length);
    expect(new Set(repo.labs.map((l) => l.route)).size).toBe(repo.labs.length);
    for (const lab of repo.labs) {
      const meta = JSON.parse(fs.readFileSync(path.join(REAL_ROOT, 'labs', lab.category, lab.slug, 'metadata.json'), 'utf8'));
      expect(lab.id).toBe(meta.id);
      expect(lab.title).toBe(meta.title);
      expect(lab.route).toBe(`/labs/${meta.category}/${meta.slug}/`);
    }
  });

  it('renders PTL-0008 from its original README and metadata', () => {
    const lab = repo.labs.find((l) => l.id === 'PTL-0008')!;
    expect(lab.route).toBe(PTL8);
    expect(lab.doc.sourcePath).toBe('labs/network-fundamentals/ios-navigation-and-initial-config/README.md');
    const readme = fs.readFileSync(path.join(REAL_ROOT, lab.doc.sourcePath), 'utf8');
    // every h2 of the source appears as an anchored heading, in source order
    const sourceH2 = [...readme.matchAll(/^## (.+)$/gm)].map((m) => m[1].trim());
    expect(sourceH2).toHaveLength(11);
    expect(lab.doc.headings.filter((h) => h.depth === 2).map((h) => h.text)).toEqual(sourceH2);
    expect(lab.doc.html).toContain('<h2 id="learning-objectives">');
    expect(lab.doc.html).toContain('<h2 id="files-and-validation-status">');
    // the README H1 is dropped from the body (the page renders the single H1)
    expect(lab.doc.html).not.toContain('<h1');
    // topology image, downloads and config resolved relative to the README
    expect(lab.doc.html).toContain(`src="${PTL8}assets/topology.png"`);
    expect(lab.doc.html).toMatch(/width="773" height="591"/);
    expect(lab.doc.html).toContain(`href="${PTL8}assets/starter.pkt"`);
    expect(lab.doc.html).toContain(`href="${PTL8}assets/completed.pkt"`);
    expect(lab.doc.html).toContain(`href="${PTL8}configs/S1.txt"`);
    // agent evidence is linked on GitHub, never published
    expect(lab.doc.html).toContain(
      'href="https://github.com/CyberSphinxxx/Cisco-Packet-Tracer-Labs/blob/main/AI_AGENT_GUIDE/state/PTL-0008-SIMULATOR-RESULTS.md"',
    );
    expect(lab.simulatorEvidenceUrl).toMatch(/\/blob\/main\/AI_AGENT_GUIDE\/state\/PTL-0008-SIMULATOR-RESULTS\.md$/);
    // view-model downloads point at the exact source bytes
    expect(lab.starter).toMatchObject({ fileName: 'starter.pkt', url: `${PTL8}assets/starter.pkt`, role: 'starter' });
    expect(lab.completed).toMatchObject({ fileName: 'completed.pkt', url: `${PTL8}assets/completed.pkt`, role: 'completed' });
    const bytes = fs.readFileSync(path.join(REAL_ROOT, 'labs/network-fundamentals/ios-navigation-and-initial-config/assets/starter.pkt'));
    expect(lab.starter!.bytes).toBe(bytes.length);
    expect(lab.starter!.sha256).toBe(crypto.createHash('sha256').update(bytes).digest('hex'));
    expect(lab.objectives).toEqual(JSON.parse(fs.readFileSync(path.join(REAL_ROOT, 'labs/network-fundamentals/ios-navigation-and-initial-config/metadata.json'), 'utf8')).learning_objectives);
  });

  it('discovers the capstone, three learning paths and all docs', () => {
    expect(repo.projects.map((p) => p.route)).toEqual(['/projects/small-office-network/']);
    expect(repo.paths.map((p) => p.slug)).toEqual(['networking-beginner', 'bsit-networking', 'ccna-aligned']);
    expect(repo.docs.map((d) => d.slug).sort()).toEqual(
      fs.readdirSync(path.join(REAL_ROOT, 'docs')).filter((f) => f.endsWith('.md')).map((f) => f.replace(/\.md$/, '')).sort(),
    );
  });

  it('publishes every baseline binary with its recorded hash', () => {
    const baseline = JSON.parse(fs.readFileSync(path.join(REAL_ROOT, 'site/tests/fixtures/baseline-checksums.json'), 'utf8')).files as Record<string, { sha256: string }>;
    const published = new Map(repo.files.map((f) => [f.repoPath, f.sha256]));
    for (const [rel, { sha256 }] of Object.entries(baseline)) expect(published.get(rel), rel).toBe(sha256);
  });

  it('is deterministic', () => {
    const again = load(REAL_ROOT, { repoUrl: 'https://github.com/CyberSphinxxx/Cisco-Packet-Tracer-Labs' });
    expect(again.labs.map((l) => l.doc.html)).toEqual(repo.labs.map((l) => l.doc.html));
    expect(again.files).toEqual(repo.files);
  });
});

describe('no copied canonical content inside site/', () => {
  const walk = (dir: string): string[] =>
    fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
      if (['node_modules', 'dist', '.astro', 'test-results', 'playwright-report'].includes(d.name)) return [];
      const p = path.join(dir, d.name);
      return d.isDirectory() ? walk(p) : [p];
    });
  const siteFiles = walk(SITE_ROOT);

  it('contains no Markdown, metadata.json or .pkt copies', () => {
    const offenders = siteFiles.filter((f) => /\.(md|mdx|pkt|pka)$/i.test(f) || path.basename(f) === 'metadata.json');
    // site/README.md (developer docs for the website itself) is the only allowed Markdown file.
    const allowed = path.resolve(SITE_ROOT, 'README.md');
    expect(offenders.filter((f) => path.resolve(f) !== allowed)).toEqual([]);
  });

  it('contains no paragraph text from any lab README', () => {
    const text = siteFiles.filter((f) => /\.(ts|astro|js|mjs|json|css)$/.test(f) && !f.endsWith('package-lock.json')).map((f) => fs.readFileSync(f, 'utf8')).join('\n');
    for (const lab of realRepo().labs) {
      const readme = fs.readFileSync(path.join(REAL_ROOT, lab.doc.sourcePath), 'utf8');
      const sentences = readme.split('\n').filter((l) => l.length > 80 && !l.startsWith('|') && !l.startsWith('#'));
      for (const s of sentences.slice(0, 15)) expect(text.includes(s.trim()), `${lab.id}: ${s.slice(0, 60)}`).toBe(false);
    }
  });
});
