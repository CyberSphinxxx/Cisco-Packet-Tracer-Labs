/**
 * Repository path helpers. Every path inside the content graph is a
 * repository-relative POSIX path (e.g. `labs/routing/x/README.md`), which
 * keeps Windows and Linux builds byte-identical. Conversion to OS paths only
 * happens at the filesystem boundary.
 */
import fs from 'node:fs';
import path from 'node:path';
import { ContentError } from './errors';

/** Top-level folders the website is allowed to read content from. */
export const CONTENT_ROOTS = ['labs', 'projects', 'learning-paths', 'docs'] as const;

/** Folders that must never be linked or published, even if they exist locally. */
const DENIED_PREFIXES = [
  '.git/',
  'site/',
  'scratch/',
  'downloads/',
  'private_archive/',
  'archive/',
  'node_modules/',
  'tmp/',
];

export function toPosix(p: string): string {
  return p.split(path.sep).join('/').replace(/\\/g, '/');
}

export function toOs(repoRoot: string, rel: string): string {
  return path.join(repoRoot, ...rel.split('/'));
}

/**
 * Resolve `href` (already URL-decoded, no query/fragment) against the
 * directory of `fromRel`, returning a normalized repository-relative POSIX
 * path or throwing when the result escapes the repository.
 */
export function resolveRepoPath(fromRel: string, href: string, source: string): string {
  const base = href.startsWith('/') ? '' : path.posix.dirname(fromRel);
  const joined = path.posix.normalize(path.posix.join(base, href.replace(/^\/+/, '')));
  if (joined === '..' || joined.startsWith('../') || path.posix.isAbsolute(joined)) {
    throw new ContentError(`link escapes the repository: ${href}`, source);
  }
  return joined.replace(/\/$/, '');
}

export function isDenied(rel: string): boolean {
  const lower = rel.toLowerCase() + (rel.endsWith('/') ? '' : '/');
  return DENIED_PREFIXES.some((p) => lower.startsWith(p));
}

export function isInContentRoots(rel: string): boolean {
  return CONTENT_ROOTS.some((r) => rel === r || rel.startsWith(`${r}/`));
}

/** Read a UTF-8 text file and normalize CRLF/CR to LF (Windows checkouts use CRLF). */
export function readText(repoRoot: string, rel: string): string {
  return fs.readFileSync(toOs(repoRoot, rel), 'utf8').replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
}

export function exists(repoRoot: string, rel: string): boolean {
  return fs.existsSync(toOs(repoRoot, rel));
}

export function isFile(repoRoot: string, rel: string): boolean {
  try {
    return fs.statSync(toOs(repoRoot, rel)).isFile();
  } catch {
    return false;
  }
}

export function isDirectory(repoRoot: string, rel: string): boolean {
  try {
    return fs.statSync(toOs(repoRoot, rel)).isDirectory();
  } catch {
    return false;
  }
}

/** Sorted child directory names (deterministic across platforms). */
export function listDirs(repoRoot: string, rel: string): string[] {
  const abs = toOs(repoRoot, rel);
  if (!fs.existsSync(abs)) return [];
  return fs
    .readdirSync(abs, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith('.'))
    .map((d) => d.name)
    .sort((a, b) => a.localeCompare(b, 'en'));
}

/** Sorted file names in a directory, optionally filtered by extension. */
export function listFiles(repoRoot: string, rel: string, ext?: string): string[] {
  const abs = toOs(repoRoot, rel);
  if (!fs.existsSync(abs)) return [];
  return fs
    .readdirSync(abs, { withFileTypes: true })
    .filter((d) => d.isFile() && (!ext || d.name.toLowerCase().endsWith(ext)))
    .map((d) => d.name)
    .sort((a, b) => a.localeCompare(b, 'en'));
}
