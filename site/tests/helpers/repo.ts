import { fileURLToPath } from 'node:url';
import { loadRepository, type LoadOptions, type Repository } from '../../src/lib/content/repository';

/** The real repository root (parent of site/). */
export const REAL_ROOT = fileURLToPath(new URL('../../..', import.meta.url));
/** The site package root. */
export const SITE_ROOT = fileURLToPath(new URL('../..', import.meta.url));

let real: Repository | undefined;
export function realRepo(): Repository {
  real ??= loadRepository({ repoRoot: REAL_ROOT, sourceRef: 'main', repoUrl: 'https://github.com/CyberSphinxxx/Cisco-Packet-Tracer-Labs', base: '/' });
  return real;
}

export function load(repoRoot: string, extra: Partial<LoadOptions> = {}): Repository {
  return loadRepository({ repoRoot, sourceRef: 'main', repoUrl: 'https://github.com/example/repo', base: '/', ...extra });
}
