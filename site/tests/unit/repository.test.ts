/**
 * Content graph contract on throwaway fixture repositories: auto-discovery,
 * strict failures with actionable messages, path safety, CRLF tolerance.
 */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { FixtureRepo } from '../helpers/fixture';
import { load } from '../helpers/repo';

let fx: FixtureRepo;
beforeEach(() => {
  fx = new FixtureRepo();
});
afterEach(() => fx.dispose());

const LAB = 'labs/routing/lab-one';

describe('discovery', () => {
  it('loads a valid fixture with routes derived from folders', () => {
    const repo = load(fx.root);
    expect(repo.labs.map((l) => l.route)).toEqual(['/labs/routing/lab-one/']);
    expect(repo.labs[0].verification?.route).toBe('/labs/routing/lab-one/verification/');
    expect(repo.labs[0].doc.html).toContain('href="/labs/routing/lab-one/verification/#checks"');
    expect(repo.docs.map((d) => d.route)).toEqual(['/docs/guide/']);
    expect(repo.paths.map((p) => p.route)).toEqual(['/learning-paths/path-a/']);
    expect(repo.labs[0].simulatorEvidenceUrl).toBe('https://github.com/example/repo/blob/main/evidence/RESULTS.md');
  });

  it('auto-discovers an added lab without any site code change', () => {
    fx.addLab({ id: 'PTL-0099', category: 'switching', slug: 'temporary-fixture-lab', difficulty: 'advanced' });
    const repo = load(fx.root);
    expect(repo.labs.map((l) => l.id).sort()).toEqual(['PTL-0001', 'PTL-0099']);
    expect(repo.categories.map((c) => c.slug)).toContain('switching');
    expect(repo.files.some((f) => f.repoPath === 'labs/switching/temporary-fixture-lab/assets/starter.pkt')).toBe(true);
    fx.remove('labs/switching/temporary-fixture-lab');
    expect(load(fx.root).labs.map((l) => l.id)).toEqual(['PTL-0001']);
  });

  it('reflects a metadata title change on the next load', () => {
    fx.patchMetadata(LAB, { title: 'Renamed Title From Metadata' });
    expect(load(fx.root).labs[0].title).toBe('Renamed Title From Metadata');
  });

  it('extracts learning-path steps in source order from ordered and bullet lists', () => {
    const [p] = load(fx.root).paths;
    expect(p.steps.map((s) => [s.order, s.label, s.kind, s.labId, s.group])).toEqual([
      [1, 'Guide', 'doc', null, 'Stage 1'],
      [2, 'Lab one', 'lab', 'PTL-0001', 'Stage 2'],
    ]);
    expect(p.steps[1].url).toBe('/labs/routing/lab-one/');
  });

  it('excludes draft labs from publication but keeps the build green', () => {
    fx.addLab({ id: 'PTL-0050', category: 'routing', slug: 'draft-lab', meta: { status: { documentation: 'draft', simulator: 'not_tested', simulator_evidence: null } } });
    const repo = load(fx.root);
    expect(repo.labs.map((l) => l.id)).toEqual(['PTL-0001']);
    expect(repo.excluded).toEqual([{ sourcePath: 'labs/routing/draft-lab', reason: 'original/draft is not published' }]);
  });

  it('honours a configured base path in every generated URL', () => {
    const repo = load(fx.root, { base: '/library/' });
    expect(repo.labs[0].route).toBe('/library/labs/routing/lab-one/');
    expect(repo.labs[0].starter?.url).toBe('/library/labs/routing/lab-one/assets/starter.pkt');
    expect(repo.labs[0].doc.html).toContain('src="/library/labs/routing/lab-one/assets/topology.png"');
  });
});

describe('build fails loudly on broken content', () => {
  const expectFail = (pattern: RegExp) => expect(() => load(fx.root)).toThrow(pattern);

  it('duplicate lab id', () => {
    fx.addLab({ id: 'PTL-0001', category: 'switching', slug: 'other-lab' });
    expectFail(/duplicate lab id PTL-0001/);
  });

  it('duplicate slug across categories', () => {
    fx.addLab({ id: 'PTL-0002', category: 'switching', slug: 'lab-one' });
    expectFail(/duplicate lab slug lab-one/);
  });

  it('category or slug that does not match the folder', () => {
    fx.patchMetadata(LAB, { category: 'switching' });
    expectFail(/category "switching" does not match folder "routing"/);
  });

  it('missing metadata.json, invalid JSON and schema violations', () => {
    fx.write(`${LAB}/metadata.json`, '{ not json');
    expectFail(/labs\/routing\/lab-one\/metadata\.json: invalid JSON/);
    fx.write(`${LAB}/metadata.json`, JSON.stringify({ id: 'PTL-0001' }));
    expectFail(/metadata does not match schema/);
    fx.remove(`${LAB}/metadata.json`);
    expectFail(/missing metadata\.json/);
  });

  it('invalid difficulty enum', () => {
    fx.patchMetadata(LAB, { difficulty: 'expert' });
    expectFail(/difficulty/);
  });

  it('missing or empty declared .pkt and non-PNG topology', () => {
    fx.remove(`${LAB}/assets/starter.pkt`);
    expectFail(/declared starter file is missing|broken local link \(no such file\): assets\/starter\.pkt/);
    fx.write(`${LAB}/assets/starter.pkt`, Buffer.alloc(0));
    expectFail(/published file is empty/);
    fx.write(`${LAB}/assets/starter.pkt`, 'x');
    fx.write(`${LAB}/assets/topology.png`, 'not a png');
    expectFail(/topology is not a valid PNG/);
  });

  it('restricted content in labs/', () => {
    fx.patchMetadata(LAB, { source: { type: 'restricted', origin: 'x', url: null, permission_evidence: null } });
    expectFail(/restricted content must not live in public labs/);
  });

  it('tested_pass with a missing evidence file', () => {
    fx.remove('evidence/RESULTS.md');
    expectFail(/simulator_evidence file not found/);
  });

  it('broken relative link with source path in the message', () => {
    fx.write(`${LAB}/README.md`, fx.read(`${LAB}/README.md`) + '\n[gone](configs/MISSING.txt)\n');
    expectFail(/labs\/routing\/lab-one\/README\.md: broken local link \(no such file\): configs\/MISSING\.txt/);
  });

  it('fragment that matches no heading (same document and cross-document)', () => {
    fx.write('docs/guide.md', fx.read('docs/guide.md') + '\n[x](#no-such-heading)\n');
    expectFail(/link fragment "#no-such-heading" does not match any heading in docs\/guide\.md/);
    fx.write('docs/guide.md', '# Guide\n\n[x](../labs/routing/lab-one/README.md#not-a-section)\n');
    expectFail(/"#not-a-section" does not match any heading in labs\/routing\/lab-one\/README\.md/);
  });

  it('path traversal outside the repository', () => {
    fx.write('docs/guide.md', '# Guide\n\n[x](../../../../etc/passwd)\n');
    expectFail(/link escapes the repository/);
  });

  it('unsafe URL schemes', () => {
    for (const bad of ['javascript:alert(1)', 'data:text/html;base64,PHNjcmlwdD4=', 'vbscript:msgbox', 'file:///C:/Windows/win.ini']) {
      fx.write('docs/guide.md', `# Guide\n\n[x](${bad})\n`);
      expectFail(/unsafe or unsupported URL scheme/);
    }
    fx.write('docs/guide.md', '# Guide\n\n[x](//evil.example/x)\n');
    expectFail(/protocol-relative/);
  });

  it('links into non-public folders even when the file exists locally', () => {
    fx.write('scratch/notes.md', 'private\n');
    fx.write('Downloads/personal.pdf', 'private');
    fx.write('docs/guide.md', '# Guide\n\n[x](../scratch/notes.md)\n');
    expectFail(/non-public folder/);
    fx.write('docs/guide.md', '# Guide\n\n[x](../Downloads/personal.pdf)\n');
    expectFail(/non-public folder/);
  });

  it('.pka assessment packages are never linked or published', () => {
    fx.write(`${LAB}/assets/activity.pka`, 'x');
    fx.write(`${LAB}/README.md`, fx.read(`${LAB}/README.md`) + '\n[pka](assets/activity.pka)\n');
    expectFail(/\.pka assessment packages are never published/);
  });

  it('images must be real image files inside content roots', () => {
    fx.write('docs/guide.md', '# Guide\n\n![x](../LICENSE)\n');
    expectFail(/image must be a publishable image/);
  });
});

describe('path and platform safety', () => {
  it('links to tracked non-site files go to GitHub, not the build output', () => {
    fx.write('docs/guide.md', '# Guide\n\n[License](../LICENSE) and [agent](../evidence/RESULTS.md)\n');
    const repo = load(fx.root);
    const html = repo.docs[0].doc.html;
    expect(html).toContain('href="https://github.com/example/repo/blob/main/LICENSE"');
    expect(html).toContain('href="https://github.com/example/repo/blob/main/evidence/RESULTS.md"');
    expect(repo.files.map((f) => f.repoPath)).not.toContain('LICENSE');
  });

  it('pins GitHub links to the configured source ref (e.g. a preview commit)', () => {
    const repo = load(fx.root, { sourceRef: 'abc123' });
    expect(repo.labs[0].simulatorEvidenceUrl).toBe('https://github.com/example/repo/blob/abc123/evidence/RESULTS.md');
  });

  it('percent-encoded file names resolve and stay encoded in URLs', () => {
    fx.write(`${LAB}/configs/Core Switch.txt`, 'hostname Core\n');
    fx.write(`${LAB}/README.md`, fx.read(`${LAB}/README.md`) + '\n[core](configs/Core%20Switch.txt)\n');
    const repo = load(fx.root);
    expect(repo.labs[0].doc.html).toContain('href="/labs/routing/lab-one/configs/Core%20Switch.txt"');
  });

  it('produces identical output from a CRLF (Windows) checkout', () => {
    const lf = load(fx.root);
    fx.toCrlf();
    const crlf = load(fx.root);
    expect(crlf.labs.map((l) => l.doc.html)).toEqual(lf.labs.map((l) => l.doc.html));
    expect(crlf.paths).toEqual(lf.paths);
    expect(crlf.labs[0].configs[0].content).toBe('hostname R1\n');
  });

  it('never emits backslashes in routes or URLs', () => {
    const repo = load(fx.root);
    const urls = [...repo.labs.flatMap((l) => [l.route, l.starter?.url, l.completed?.url, l.topology?.url]), ...repo.files.map((f) => f.url + f.repoPath)];
    for (const u of urls) expect(u).not.toMatch(/\\/);
  });

  it('rejects backslash asset paths in metadata', () => {
    fx.patchMetadata(LAB, { assets: { starter: 'assets\\starter.pkt', completed: 'assets/completed.pkt', topology: 'assets/topology.png' } });
    expect(() => load(fx.root)).toThrow(/forward-slash path/);
  });
});
