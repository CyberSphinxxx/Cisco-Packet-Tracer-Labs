/**
 * Build-time configuration for the content pipeline.
 *
 * The repository root is resolved once in `astro.config.mjs` from that file's
 * own location (`new URL('..', import.meta.url)`) and exported through the
 * `PTL_REPO_ROOT` environment variable, because bundled page chunks do not
 * keep a stable `import.meta.url`. Tests point `PTL_REPO_ROOT` at fixtures.
 */
import fs from 'node:fs';
import path from 'node:path';
import { ContentError } from './errors';

export const DEFAULT_REPO_URL = 'https://github.com/CyberSphinxxx/Cisco-Packet-Tracer-Labs';

export interface SourceConfig {
  /** Absolute, OS-native path to the repository root. */
  repoRoot: string;
  /** Public GitHub repository URL (no trailing slash). */
  repoUrl: string;
  /** Git ref used for "view source" / evidence links (branch, tag or SHA). */
  sourceRef: string;
}

export function resolveRepoRoot(explicit?: string): string {
  const candidate = explicit ?? process.env.PTL_REPO_ROOT ?? path.resolve(process.cwd(), '..');
  const root = path.resolve(candidate);
  for (const required of ['labs', 'learning-paths']) {
    if (!fs.existsSync(path.join(root, required))) {
      throw new ContentError(
        `Repository root ${root} does not contain "${required}/". Set PTL_REPO_ROOT or run the build from site/.`,
        root,
      );
    }
  }
  return root;
}

export function getSourceConfig(overrides: Partial<SourceConfig> = {}): SourceConfig {
  const repoUrl = (overrides.repoUrl ?? process.env.PTL_REPO_URL ?? DEFAULT_REPO_URL).replace(/\/+$/, '');
  // Cloudflare Pages exposes CF_PAGES_COMMIT_SHA; GitHub Actions exposes GITHUB_SHA.
  // Pinning source links to the built commit keeps preview links valid.
  const sourceRef =
    overrides.sourceRef ??
    process.env.PTL_SOURCE_REF ??
    process.env.CF_PAGES_COMMIT_SHA ??
    process.env.GITHUB_SHA ??
    'main';
  return { repoRoot: resolveRepoRoot(overrides.repoRoot), repoUrl, sourceRef };
}
