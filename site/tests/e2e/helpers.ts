import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const REPO_ROOT = path.resolve(fileURLToPath(new URL('../../..', import.meta.url)));

export interface LabInfo { id: string; category: string; slug: string; route: string; starter: string; completed: string }

/** Lab list read straight from canonical metadata (independent of site code). */
export function canonicalLabs(): LabInfo[] {
  const out: LabInfo[] = [];
  for (const category of fs.readdirSync(path.join(REPO_ROOT, 'labs'))) {
    for (const slug of fs.readdirSync(path.join(REPO_ROOT, 'labs', category))) {
      const meta = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, 'labs', category, slug, 'metadata.json'), 'utf8'));
      out.push({ id: meta.id, category, slug, route: `/labs/${category}/${slug}/`, starter: meta.assets.starter, completed: meta.assets.completed });
    }
  }
  return out.sort((a, b) => a.id.localeCompare(b.id));
}

export const sha256 = (buf: Buffer) => crypto.createHash('sha256').update(buf).digest('hex');
export const sourceSha = (rel: string) => sha256(fs.readFileSync(path.join(REPO_ROOT, ...rel.split('/'))));
