// @ts-check
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import sitemap from './integrations/sitemap.mjs';

// Canonical content lives one level above site/. Resolve it from this file's
// own location (works on Windows and Linux) and hand it to the content
// module through the environment, because bundled chunks move at build time.
process.env.PTL_REPO_ROOT ??= fileURLToPath(new URL('..', import.meta.url));

// The production origin is an owner decision. Without PTL_SITE_URL the build
// emits no canonical URLs or sitemap and asks crawlers not to index it.
const site = process.env.PTL_SITE_URL || undefined;
// Mirrors src/lib/seo.ts: preview branches and PTL_INDEXING=false are never indexable.
const indexable = () =>
  Boolean(site) &&
  process.env.PTL_INDEXING !== 'false' &&
  (!process.env.CF_PAGES_BRANCH || process.env.CF_PAGES_BRANCH === (process.env.PTL_PRODUCTION_BRANCH ?? 'main'));

export default defineConfig({
  site,
  base: process.env.PTL_BASE || '/',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  compressHTML: true,
  devToolbar: { enabled: false },
  integrations: [sitemap({ indexable })],
  vite: {
    server: { fs: { allow: ['..'] } },
    // Emit every bundled script as a file (never inlined) so the CSP only has
    // to trust the single explicitly marked inline theme script.
    // One stylesheet for the whole site: cached after the first page, so later
    // navigations never wait on a render-blocking CSS request.
    build: { assetsInlineLimit: 0, cssCodeSplit: false },
  },
});
