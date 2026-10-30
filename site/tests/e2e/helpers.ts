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
  difficulty: string;
  topics: string[];
  minutes: number | null;
  starter: string;
  completed: string;
}

/** Lab list read straight from canonical metadata (independent of site code). */
export function canonicalLabs(): LabInfo[] {
  const out: LabInfo[] = [];
  const labsDir = path.join(REPO_ROOT, 'labs');
  for (const category of fs.readdirSync(labsDir)) {
    const catDir = path.join(labsDir, category);
    if (!fs.statSync(catDir).isDirectory()) continue;
    for (const slug of fs.readdirSync(catDir)) {
      const metaPath = path.join(catDir, slug, 'metadata.json');
      if (!fs.existsSync(metaPath)) continue;
      const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
      out.push({
        id: meta.id,
        category,
        slug,
        route: `/labs/${category}/${slug}/`,
        difficulty: meta.difficulty,
        topics: meta.topics ?? [],
        minutes: meta.estimated_minutes ?? null,
        starter: meta.assets.starter,
        completed: meta.assets.completed,
      });
    }
  }
  return out.sort((a, b) => a.id.localeCompare(b.id));
}

export const sha256 = (buf: Buffer) => crypto.createHash('sha256').update(buf).digest('hex');
export const sourceSha = (rel: string) => sha256(fs.readFileSync(path.join(REPO_ROOT, ...rel.split('/'))));

/** Lab README links in a learning path, as site routes in source order (independent parse). */
export function pathLabLinks(file: string): string[] {
  const md = fs.readFileSync(path.join(REPO_ROOT, 'learning-paths', file), 'utf8');
  return [...md.matchAll(/\]\(\.\.\/labs\/([^/]+)\/([^/]+)\/README\.md\)/g)].map((m) => `/labs/${m[1]}/${m[2]}/`);
}
