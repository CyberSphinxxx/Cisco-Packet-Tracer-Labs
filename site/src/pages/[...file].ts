/**
 * Serves every repository file the content links to (Packet Tracer .pkt
 * files, topology images, configuration .txt files) at the same path it has
 * in the repository. The bytes are read from the canonical source and
 * emitted unchanged; nothing is parsed, transformed or re-encoded.
 */
import fs from 'node:fs';
import type { APIRoute, GetStaticPaths } from 'astro';
import { toOs } from '../lib/content/paths';
import { getRepository } from '../lib/content/repository';

const TYPES: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.txt': 'text/plain; charset=utf-8',
  '.pkt': 'application/octet-stream',
};

export const getStaticPaths = (() =>
  getRepository().files.map((f) => ({ params: { file: f.repoPath }, props: { repoPath: f.repoPath } }))) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) => {
  const repoPath = String(props.repoPath);
  const bytes = fs.readFileSync(toOs(getRepository().config.repoRoot, repoPath));
  const ext = repoPath.slice(repoPath.lastIndexOf('.')).toLowerCase();
  return new Response(new Uint8Array(bytes), { headers: { 'Content-Type': TYPES[ext] ?? 'application/octet-stream' } });
};
