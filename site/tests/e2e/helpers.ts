import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const REPO_ROOT = path.resolve(fileURLToPath(new URL('../../..', import.meta.url)));

export interface LabInfo {
  id: string;
  category: string;
  slug: string;
  route: string;
  starter: string;
  completed: string;
  title: string;
  summary: string;
  difficulty: string;
  topics: string[];
  minutes: number | null;
}

/**
 * Published lab list read straight from canonical metadata (independent of
 * site code). Tests derive expected counts from this, so adding or removing a
 * lab never needs a test edit.
 */
export function canonicalLabs(): LabInfo[] {
  const out: LabInfo[] = [];
  for (const category of fs.readdirSync(path.join(REPO_ROOT, 'labs'))) {
    for (const slug of fs.readdirSync(path.join(REPO_ROOT, 'labs', category))) {
      const meta = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, 'labs', category, slug, 'metadata.json'), 'utf8'));
      if (meta.status?.documentation === 'draft' || meta.source?.type === 'external_reference') continue;
      out.push({
        id: meta.id,
        category,
        slug,
        route: `/labs/${category}/${slug}/`,
        starter: meta.assets.starter,
        completed: meta.assets.completed,
        title: meta.title,
        summary: meta.summary ?? '',
        difficulty: meta.difficulty,
        topics: meta.topics ?? [],
        minutes: meta.estimated_minutes ?? null,
      });
    }
  }
  return out.sort((a, b) => a.id.localeCompare(b.id));
}

/** Same text match as the catalog filter (src/lib/filters.ts), for expected results. */
export function textMatches(lab: LabInfo, q: string): boolean {
  const norm = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
  const hay = norm([lab.id, lab.title, lab.summary, lab.category, ...lab.topics].join(' ').replace(/-/g, ' '));
  return norm(q).replace(/-/g, ' ').split(/\s+/).filter(Boolean).every((t) => hay.includes(t));
}

export const sha256 = (buf: Buffer) => crypto.createHash('sha256').update(buf).digest('hex');
export const sourceSha = (rel: string) => sha256(fs.readFileSync(path.join(REPO_ROOT, ...rel.split('/'))));
