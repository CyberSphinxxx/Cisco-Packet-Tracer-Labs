/**
 * Source-relative link resolution.
 *
 * Every Markdown href is resolved relative to the *source file* that contains
 * it, normalized to a repository-relative path, and then mapped to:
 *   - a generated route (published Markdown documents),
 *   - a published static file (exact bytes copied into the build),
 *   - a public GitHub URL (tracked files the site does not publish, such as
 *     AI_AGENT_GUIDE/ evidence or LICENSE),
 *   - or an unchanged external http(s)/mailto URL.
 * Anything else (unsafe scheme, traversal, missing target, missing heading
 * fragment, denied folder, .pka) throws a ContentError and fails the build.
 */
import fs from 'node:fs';
import path from 'node:path';
import { ContentError } from './errors';
import type { HrefResolver, ResolvedLink } from './markdown';
import { isDenied, isDirectory, isFile, isInContentRoots, resolveRepoPath, toOs } from './paths';

/** File types the site may copy into its output when canonical Markdown links them. */
export const PUBLISHABLE_EXTENSIONS = new Set(['.pkt', '.png', '.jpg', '.jpeg', '.gif', '.webp', '.txt']);
export const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp']);

export interface IndexedDocument {
  route: string;
  headingIds: Set<string>;
}

export interface ResolverEnv {
  repoRoot: string;
  repoUrl: string;
  sourceRef: string;
  base: string;
  /** Published Markdown documents keyed by repository-relative path. */
  documents: Map<string, IndexedDocument>;
  /** Collects every non-Markdown file the content links to (repo-relative paths). */
  publishedFiles: Set<string>;
}

export function joinBase(base: string, p: string): string {
  const b = base.endsWith('/') ? base.slice(0, -1) : base;
  return `${b}${p.startsWith('/') ? p : `/${p}`}`;
}

/** URL of a repository file served by the website (same path as in the repo). */
export function publishedFileUrl(base: string, rel: string): string {
  return joinBase(base, `/${rel.split('/').map(encodeURIComponent).join('/')}`);
}

export function githubUrl(env: Pick<ResolverEnv, 'repoUrl' | 'sourceRef'>, rel: string, kind: 'blob' | 'tree' = 'blob'): string {
  return `${env.repoUrl}/${kind}/${encodeURIComponent(env.sourceRef)}/${rel.split('/').map(encodeURIComponent).join('/')}`;
}

/** Width/height from a PNG IHDR chunk; undefined for other formats. */
export function pngSize(absPath: string): { width: number; height: number } | undefined {
  const fd = fs.openSync(absPath, 'r');
  try {
    const buf = Buffer.alloc(24);
    fs.readSync(fd, buf, 0, 24, 0);
    if (buf.readUInt32BE(0) !== 0x89504e47 || buf.toString('ascii', 12, 16) !== 'IHDR') return undefined;
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  } finally {
    fs.closeSync(fd);
  }
}

const SCHEME = /^([a-z][a-z0-9+.-]*):/i;

export function createResolver(env: ResolverEnv, sourceRel: string): HrefResolver {
  const self = env.documents.get(sourceRel);

  const checkFragment = (fragment: string, target: IndexedDocument | undefined, targetRel: string, raw: string) => {
    if (!fragment) return;
    let id: string;
    try {
      id = decodeURIComponent(fragment);
    } catch {
      throw new ContentError(`malformed fragment in link: ${raw}`, sourceRel);
    }
    if (target && !target.headingIds.has(id)) {
      throw new ContentError(`link fragment "#${id}" does not match any heading in ${targetRel}: ${raw}`, sourceRel);
    }
  };

  return (rawHref: string, as: 'link' | 'image'): ResolvedLink => {
    const href = rawHref.trim().replace(/^<|>$/g, '');
    if (!href) throw new ContentError('empty link target', sourceRel);

    if (href.startsWith('#')) {
      if (as === 'image') throw new ContentError(`image cannot point to a fragment: ${href}`, sourceRel);
      checkFragment(href.slice(1), self, sourceRel, href);
      return { url: href, kind: 'fragment' };
    }

    if (href.startsWith('//')) throw new ContentError(`protocol-relative URLs are not allowed: ${href}`, sourceRel);

    const scheme = SCHEME.exec(href)?.[1]?.toLowerCase();
    if (scheme) {
      if (scheme === 'http' || scheme === 'https') {
        try {
          new URL(href);
        } catch {
          throw new ContentError(`invalid external URL: ${href}`, sourceRel);
        }
        return { url: href, kind: 'external' };
      }
      if (scheme === 'mailto' && as === 'link') return { url: href, kind: 'mailto' };
      throw new ContentError(`unsafe or unsupported URL scheme "${scheme}:" in ${href}`, sourceRel);
    }

    // Local repository link.
    const hashAt = href.indexOf('#');
    const beforeHash = hashAt === -1 ? href : href.slice(0, hashAt);
    const fragment = hashAt === -1 ? '' : href.slice(hashAt + 1);
    const pathPart = beforeHash.split('?')[0];
    let decoded: string;
    try {
      decoded = decodeURIComponent(pathPart);
    } catch {
      throw new ContentError(`malformed percent-encoding in link: ${href}`, sourceRel);
    }
    if (decoded.includes('\\')) throw new ContentError(`backslashes are not allowed in links: ${href}`, sourceRel);
    const rel = resolveRepoPath(sourceRel, decoded, sourceRel);
    if (rel === '' || rel === '.') throw new ContentError(`link points at the repository root: ${href}`, sourceRel);
    if (isDenied(rel)) throw new ContentError(`link targets a non-public folder: ${href}`, sourceRel);
    const suffix = fragment ? `#${fragment}` : '';
    const ext = path.posix.extname(rel).toLowerCase();

    if (ext === '.pka') throw new ContentError(`.pka assessment packages are never published: ${href}`, sourceRel);

    if (isDirectory(env.repoRoot, rel)) {
      if (as === 'image') throw new ContentError(`image points to a directory: ${href}`, sourceRel);
      const readme = env.documents.get(`${rel}/README.md`);
      if (readme) {
        checkFragment(fragment, readme, `${rel}/README.md`, href);
        return { url: readme.route + suffix, kind: 'route' };
      }
      return { url: githubUrl(env, rel, 'tree') + suffix, kind: 'github' };
    }

    if (!isFile(env.repoRoot, rel)) throw new ContentError(`broken local link (no such file): ${href} -> ${rel}`, sourceRel);

    if (ext === '.md') {
      if (as === 'image') throw new ContentError(`image points to a Markdown file: ${href}`, sourceRel);
      const doc = env.documents.get(rel);
      if (doc) {
        checkFragment(fragment, doc, rel, href);
        return { url: doc.route + suffix, kind: 'route' };
      }
      return { url: githubUrl(env, rel) + suffix, kind: 'github' };
    }

    if (isInContentRoots(rel) && PUBLISHABLE_EXTENSIONS.has(ext)) {
      if (as === 'image' && !IMAGE_EXTENSIONS.has(ext)) {
        throw new ContentError(`image link is not an image file: ${href}`, sourceRel);
      }
      env.publishedFiles.add(rel);
      const resolved: ResolvedLink = { url: publishedFileUrl(env.base, rel), kind: 'file' };
      if (ext === '.png') Object.assign(resolved, pngSize(toOs(env.repoRoot, rel)));
      return resolved;
    }

    if (as === 'image') throw new ContentError(`image must be a publishable image inside labs/ or projects/: ${href}`, sourceRel);
    return { url: githubUrl(env, rel) + suffix, kind: 'github' };
  };
}
