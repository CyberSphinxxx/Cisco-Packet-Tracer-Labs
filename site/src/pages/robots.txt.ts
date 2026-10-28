import type { APIRoute } from 'astro';
import { robotsTxt, seoPolicy } from '../lib/seo';

export const GET: APIRoute = () =>
  new Response(robotsTxt(seoPolicy(process.env, import.meta.env.SITE), `${import.meta.env.BASE_URL}sitemap.xml`), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
