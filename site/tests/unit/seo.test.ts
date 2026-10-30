import { describe, expect, it } from 'vitest';
import { robotsTxt, seoPolicy } from '../../src/lib/seo';

describe('indexing policy', () => {
  it('is never indexable without a configured production origin', () => {
    const p = seoPolicy({}, undefined);
    expect(p.indexable).toBe(false);
    expect(robotsTxt(p)).toContain('Disallow: /');
    expect(robotsTxt(p)).not.toContain('Sitemap');
  });
  it('allows indexing for the production branch with an origin and points at the sitemap', () => {
    const p = seoPolicy({ CF_PAGES_BRANCH: 'main' }, 'https://labs.example.org');
    expect(p.indexable).toBe(true);
    expect(robotsTxt(p)).toBe('User-agent: *\nAllow: /\n\nSitemap: https://labs.example.org/sitemap.xml\n');
  });
  it('keeps Cloudflare preview branches out of search engines', () => {
    expect(seoPolicy({ CF_PAGES_BRANCH: 'feature/astro-learning-platform' }, 'https://labs.example.org').indexable).toBe(false);
    expect(seoPolicy({ CF_PAGES_BRANCH: 'release', PTL_PRODUCTION_BRANCH: 'release' }, 'https://labs.example.org').indexable).toBe(true);
  });
  it('honours an explicit opt-out', () => {
    expect(seoPolicy({ PTL_INDEXING: 'false' }, 'https://labs.example.org').indexable).toBe(false);
  });
});
