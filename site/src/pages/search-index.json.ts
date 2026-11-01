import type { APIRoute } from 'astro';
import { getRepository } from '../lib/content/repository';
import { searchIndex } from '../lib/site';

/**
 * The instant search index used by the header dialog and the homepage search:
 * one small JSON file built from the same lab metadata as the pages. It is
 * fetched on first use, so pages that never open search never download it.
 * Full-text search (commands, prose) still comes from Pagefind.
 */
export const GET: APIRoute = () =>
  new Response(JSON.stringify(searchIndex(getRepository())), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });

