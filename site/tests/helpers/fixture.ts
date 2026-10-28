/**
 * Builds small, valid, throwaway repositories in the OS temp folder so tests
 * can add/break content without touching the real canonical files.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

/** 1x1 transparent PNG (valid signature + IHDR). */
export const PNG_1x1 = Buffer.from(
  '89504e470d0a1a0a0000000d4948445200000001000000010806000000' + '1f15c4890000000d49444154789c6360000002000154a24f5d0000000049454e44ae426082',
  'hex',
);

export const SECTIONS = [
  'Learning Objectives', 'Prerequisites', 'Topology', 'Addressing Table', 'Lab Tasks',
  'Configuration Walkthrough', 'Verification', 'Troubleshooting', 'Key Takeaways', 'References',
  'Files and Validation Status',
];

export interface LabSpec {
  id: string;
  category: string;
  slug: string;
  title?: string;
  difficulty?: string;
  topics?: string[];
  minutes?: number | null;
  meta?: Record<string, unknown>;
  readme?: string;
}

export function labReadme(spec: LabSpec, extra = ''): string {
  const title = spec.title ?? `Fixture lab ${spec.id}`;
  return [
    `# ${title}`,
    '',
    `> **Lab ID:** ${spec.id}`,
    '',
    'Intro paragraph for the fixture lab.',
    '',
    ...SECTIONS.flatMap((s) => {
      const body =
        s === 'Topology'
          ? '![Fixture topology](assets/topology.png)'
          : s === 'Files and Validation Status'
            ? '- Starter: [assets/starter.pkt](assets/starter.pkt)\n- Completed: [assets/completed.pkt](assets/completed.pkt)\n- Config: [configs/R1.txt](configs/R1.txt)\n- Guide: [verification](verification.md#checks)'
            : `Text for ${s}.`;
      return [`## ${s}`, '', body, ''];
    }),
    extra,
  ].join('\n');
}

export function labMetadata(spec: LabSpec): Record<string, unknown> {
  return {
    id: spec.id,
    title: spec.title ?? `Fixture lab ${spec.id}`,
    slug: spec.slug,
    category: spec.category,
    summary: `Summary for ${spec.id}.`,
    difficulty: spec.difficulty ?? 'beginner',
    topics: spec.topics ?? ['cisco-ios'],
    learning_objectives: ['Do the fixture thing'],
    estimated_minutes: spec.minutes === undefined ? 30 : spec.minutes,
    activity_reference: null,
    packet_tracer_version: '8.2+',
    devices: ['Router'],
    source: { type: 'original', origin: 'fixture', url: null, permission_evidence: null },
    license_decision: 'approved_dual_license',
    assets: { starter: 'assets/starter.pkt', completed: 'assets/completed.pkt', topology: 'assets/topology.png' },
    status: { documentation: 'reviewed', simulator: 'tested_pass', simulator_evidence: 'evidence/RESULTS.md' },
    references: ['https://www.example.com/ref'],
    last_reviewed: '2026-10-26',
    ...spec.meta,
  };
}

export class FixtureRepo {
  readonly root: string;
  constructor() {
    this.root = fs.mkdtempSync(path.join(os.tmpdir(), 'ptl-fixture-'));
    this.write('README.md', '# Fixture\n\n- [Path A](learning-paths/path-a.md)\n');
    this.write('evidence/RESULTS.md', '# Evidence\n');
    this.write('LICENSE', 'license text\n');
    this.write('docs/guide.md', '# Guide\n\nGuide lead paragraph.\n\n## Section One\n\nBody.\n');
    this.write(
      'learning-paths/path-a.md',
      '# Path A\n\nLead.\n\n## Stage 1\n\n1. **[Guide](../docs/guide.md)**\n   *Goal:* read.\n\n## Stage 2\n\n- **[Lab one](../labs/routing/lab-one/README.md)**\n  Do it.\n',
    );
    this.addLab({ id: 'PTL-0001', category: 'routing', slug: 'lab-one' });
  }

  write(rel: string, content: string | Buffer) {
    const abs = path.join(this.root, ...rel.split('/'));
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, content);
  }

  remove(rel: string) {
    fs.rmSync(path.join(this.root, ...rel.split('/')), { recursive: true, force: true });
  }

  read(rel: string): string {
    return fs.readFileSync(path.join(this.root, ...rel.split('/')), 'utf8');
  }

  addLab(spec: LabSpec) {
    const dir = `labs/${spec.category}/${spec.slug}`;
    this.write(`${dir}/README.md`, spec.readme ?? labReadme(spec));
    this.write(`${dir}/metadata.json`, JSON.stringify(labMetadata(spec), null, 2));
    this.write(`${dir}/verification.md`, `# Verification ${spec.id}\n\n## Checks\n\nPing.\n`);
    this.write(`${dir}/configs/R1.txt`, 'hostname R1\n');
    this.write(`${dir}/assets/starter.pkt`, Buffer.from(`starter-${spec.id}`));
    this.write(`${dir}/assets/completed.pkt`, Buffer.from(`completed-${spec.id}`));
    this.write(`${dir}/assets/topology.png`, PNG_1x1);
    return dir;
  }

  patchMetadata(dir: string, patch: Record<string, unknown>) {
    const meta = JSON.parse(this.read(`${dir}/metadata.json`));
    this.write(`${dir}/metadata.json`, JSON.stringify({ ...meta, ...patch }, null, 2));
  }

  /** Convert every Markdown/JSON/TXT file to CRLF line endings (Windows checkout). */
  toCrlf() {
    const walk = (d: string): string[] =>
      fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
    for (const f of walk(this.root)) {
      if (/\.(md|json|txt)$/.test(f)) fs.writeFileSync(f, fs.readFileSync(f, 'utf8').replace(/\r?\n/g, '\r\n'));
    }
  }

  dispose() {
    fs.rmSync(this.root, { recursive: true, force: true });
  }
}
