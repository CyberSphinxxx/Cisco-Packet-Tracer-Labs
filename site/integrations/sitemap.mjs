// @ts-check
/**
 * Minimal sitemap integration. Writes dist/sitemap.xml only when a production
 * origin is configured and indexing is allowed (same policy as robots.txt),
 * listing every generated HTML page except search and 404.
 */
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

/** @param {{ indexable: () => boolean }} opts @returns {import('astro').AstroIntegration} */
export default function sitemap(opts) {
  /** @type {URL | undefined} */
  let site;
  let base = '/';
  return {
    name: 'ptl-sitemap',
    hooks: {
      'astro:config:done': ({ config }) => {
        site = config.site ? new URL(config.site) : undefined;
        base = config.base;
      },
      'astro:build:done': ({ dir, pages, logger }) => {
        if (!site || !opts.indexable()) {
          logger.info('sitemap skipped (no production origin or indexing disabled)');
          return;
        }
        const urls = pages
          .map((p) => p.pathname)
          .filter((p) => !/^(search|404)\/?$/.test(p) && !/\.[a-z0-9]+$/i.test(p))
          .map((p) => new URL(`${base.replace(/\/$/, '')}/${p}`.replace(/\/+/g, '/'), site).toString())
          .sort();
        const xml =
          '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
          urls.map((u) => `  <url><loc>${u.replace(/&/g, '&amp;')}</loc></url>`).join('\n') +
          '\n</urlset>\n';
        fs.writeFileSync(new URL('sitemap.xml', dir), xml);
        logger.info(`sitemap.xml written with ${urls.length} URLs (${fileURLToPath(dir)})`);
      },
    },
  };
}
