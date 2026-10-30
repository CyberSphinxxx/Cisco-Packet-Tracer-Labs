/**
 * Catalog filtering, sorting and URL state. Pure functions shared by the
 * browser script (src/scripts/catalog.ts) and the unit tests.
 *
 * Semantics: values within one facet are OR-ed (category A or B); different
 * facets are AND-ed (intersection). Unknown values from the URL are dropped,
 * never echoed into the page.
 */

export interface CatalogItem {
  id: string;
  title: string;
  summary: string;
  category: string;
  difficulty: string;
  topics: string[];
  minutes: number | null;
  order: number;
}

export type SortKey = 'recommended' | 'title' | 'time' | 'difficulty';
export const SORT_KEYS: SortKey[] = ['recommended', 'title', 'time', 'difficulty'];
const DIFFICULTY_RANK: Record<string, number> = { beginner: 0, intermediate: 1, advanced: 2 };

export interface FilterState {
  q: string;
  category: string[];
  difficulty: string[];
  topic: string[];
  maxMinutes: number | null;
  sort: SortKey;
}

export interface Facets {
  category: string[];
  difficulty: string[];
  topic: string[];
  minutes: number[];
}

export const EMPTY_STATE: FilterState = { q: '', category: [], difficulty: [], topic: [], maxMinutes: null, sort: 'recommended' };

export function facetsOf(items: CatalogItem[]): Facets {
  const uniq = <T>(xs: T[]) => [...new Set(xs)];
  return {
    category: uniq(items.map((i) => i.category)),
    difficulty: uniq(items.map((i) => i.difficulty)).sort((a, b) => (DIFFICULTY_RANK[a] ?? 9) - (DIFFICULTY_RANK[b] ?? 9)),
    topic: uniq(items.flatMap((i) => i.topics)).sort(),
    minutes: uniq(items.map((i) => i.minutes).filter((m): m is number => m != null)).sort((a, b) => a - b),
  };
}

const MAX_QUERY = 100;

/** Parse and validate URL search params against the known facet values. */
export function parseState(search: string | URLSearchParams, facets: Facets): FilterState {
  const params = typeof search === 'string' ? new URLSearchParams(search) : search;
  const list = (key: string, allowed: string[]) => {
    const values = params.getAll(key).flatMap((v) => v.split(',')).map((v) => v.trim()).filter(Boolean);
    return [...new Set(values.filter((v) => allowed.includes(v)))].sort();
  };
  const minutesRaw = Number(params.get('time'));
  const maxMinutes = Number.isInteger(minutesRaw) && facets.minutes.includes(minutesRaw) ? minutesRaw : null;
  const sortRaw = params.get('sort') as SortKey | null;
  return {
    q: (params.get('q') ?? '').slice(0, MAX_QUERY).trim(),
    category: list('category', facets.category),
    difficulty: list('difficulty', facets.difficulty),
    topic: list('topic', facets.topic),
    maxMinutes,
    sort: sortRaw && SORT_KEYS.includes(sortRaw) ? sortRaw : 'recommended',
  };
}

/** Serialize to a stable query string ('' for the default state). */
export function serializeState(state: FilterState): string {
  const p = new URLSearchParams();
  if (state.q) p.set('q', state.q);
  for (const key of ['category', 'difficulty', 'topic'] as const) for (const v of [...state[key]].sort()) p.append(key, v);
  if (state.maxMinutes != null) p.set('time', String(state.maxMinutes));
  if (state.sort !== 'recommended') p.set('sort', state.sort);
  const s = p.toString();
  return s ? `?${s}` : '';
}

export function isDefault(state: FilterState): boolean {
  return serializeState(state) === '';
}

function normalize(s: string): string {
  return s.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
}

export function matches(item: CatalogItem, state: FilterState): boolean {
  if (state.category.length && !state.category.includes(item.category)) return false;
  if (state.difficulty.length && !state.difficulty.includes(item.difficulty)) return false;
  if (state.topic.length && !state.topic.some((t) => item.topics.includes(t))) return false;
  if (state.maxMinutes != null && (item.minutes == null || item.minutes > state.maxMinutes)) return false;
  if (state.q) {
    const hay = normalize([item.id, item.title, item.summary, item.category, ...item.topics].join(' ').replace(/-/g, ' '));
    const terms = normalize(state.q).replace(/-/g, ' ').split(/\s+/).filter(Boolean);
    if (!terms.every((t) => hay.includes(t))) return false;
  }
  return true;
}

export function sortItems(items: CatalogItem[], sort: SortKey): CatalogItem[] {
  const out = [...items];
  const byOrder = (a: CatalogItem, b: CatalogItem) => a.order - b.order;
  switch (sort) {
    case 'title':
      return out.sort((a, b) => a.title.localeCompare(b.title, 'en') || byOrder(a, b));
    case 'time':
      return out.sort((a, b) => (a.minutes ?? Infinity) - (b.minutes ?? Infinity) || byOrder(a, b));
    case 'difficulty':
      return out.sort((a, b) => (DIFFICULTY_RANK[a.difficulty] ?? 9) - (DIFFICULTY_RANK[b.difficulty] ?? 9) || byOrder(a, b));
    default:
      return out.sort(byOrder);
  }
}

export function applyFilters(items: CatalogItem[], state: FilterState): CatalogItem[] {
  return sortItems(items.filter((i) => matches(i, state)), state.sort);
}
