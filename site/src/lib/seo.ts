/**
 * Indexing policy. The production origin is an owner decision, so nothing is
 * indexable until PTL_SITE_URL is provided. Cloudflare Pages preview builds
 * (any branch other than the production branch) are never indexable.
 */
export interface SeoPolicy {
  site: URL | null;
  indexable: boolean;
  reason: string;
}

export function seoPolicy(env: Record<string, string | undefined> = process.env, site: URL | string | undefined = import.meta.env.SITE): SeoPolicy {
  const origin = site ? new URL(String(site)) : null;
  if (!origin) return { site: null, indexable: false, reason: 'no production origin configured (PTL_SITE_URL unset)' };
  if (env.PTL_INDEXING === 'false') return { site: origin, indexable: false, reason: 'PTL_INDEXING=false' };
  const productionBranch = env.PTL_PRODUCTION_BRANCH ?? 'main';
  if (env.CF_PAGES_BRANCH && env.CF_PAGES_BRANCH !== productionBranch) {
    return { site: origin, indexable: false, reason: `preview branch ${env.CF_PAGES_BRANCH}` };
  }
  return { site: origin, indexable: true, reason: 'production build with configured origin' };
}

export function absolute(path: string, site: URL | null): string | null {
  return site ? new URL(path, site).toString() : null;
}

export function robotsTxt(policy: SeoPolicy, sitemapPath = '/sitemap.xml'): string {
  if (!policy.indexable) return `# Indexing disabled: ${policy.reason}\nUser-agent: *\nDisallow: /\n`;
  return `User-agent: *\nAllow: /\n\nSitemap: ${new URL(sitemapPath, policy.site!).toString()}\n`;
}
