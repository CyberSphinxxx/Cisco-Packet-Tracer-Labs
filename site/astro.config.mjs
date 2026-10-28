// @ts-check
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';

// Canonical content lives one level above site/. Resolve it from this file's
// own location (works on Windows and Linux) and hand it to the content
// module through the environment, because bundled chunks move at build time.
process.env.PTL_REPO_ROOT ??= fileURLToPath(new URL('..', import.meta.url));

// The production origin is an owner decision. Without PTL_SITE_URL the build
// emits no canonical URLs or sitemap and asks crawlers not to index it.
const site = process.env.PTL_SITE_URL || undefined;

export default defineConfig({
  site,
  base: process.env.PTL_BASE || '/',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  compressHTML: true,
  devToolbar: { enabled: false },
  vite: {
    server: { fs: { allow: ['..'] } },
  },
});
