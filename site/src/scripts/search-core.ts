/**
 * Thin, accessible wrapper around the Pagefind JS API. The index exists only
 * in production builds (`astro build && pagefind --site dist`); in `astro dev`
 * the import fails and the UI says so instead of pretending to work.
 */

interface PagefindSubResult { title: string; url: string; excerpt: string }
interface PagefindResultData {
  url: string;
  excerpt: string;
  meta: Record<string, string>;
  filters: Record<string, string[]>;
  sub_results?: PagefindSubResult[];
}
interface PagefindApi {
  init?: () => Promise<void>;
  options?: (o: Record<string, unknown>) => Promise<void>;
  search: (q: string) => Promise<{ results: { id: string; data: () => Promise<PagefindResultData> }[] } | null>;
  debouncedSearch?: unknown;
}

let api: Promise<PagefindApi | null> | null = null;

export function base(): string {
  return document.documentElement.dataset.base ?? '/';
}

export function loadPagefind(): Promise<PagefindApi | null> {
  api ??= import(/* @vite-ignore */ `${base()}pagefind/pagefind.js`)
    .then(async (m: PagefindApi) => {
      await m.options?.({ excerptLength: 24 });
      return m;
    })
    .catch(() => null);
  return api;
}

/** Rebuild Pagefind's excerpt HTML keeping only text and <mark>. */
export function safeExcerpt(html: string): DocumentFragment {
  const tpl = document.createElement('template');
  tpl.innerHTML = html;
  const out = document.createDocumentFragment();
  const walk = (node: Node) => {
    for (const child of node.childNodes) {
      if (child.nodeType === Node.TEXT_NODE) out.appendChild(document.createTextNode(child.textContent ?? ''));
      else if (child.nodeName === 'MARK') {
        const m = document.createElement('mark');
        m.textContent = child.textContent ?? '';
        out.appendChild(m);
      } else walk(child);
    }
  };
  walk(tpl.content);
  return out;
}

export interface SearchView {
  input: HTMLInputElement;
  status: HTMLElement;
  list: HTMLOListElement;
  /** Called with the query after each completed search (e.g. to sync the URL). */
  onQuery?: (q: string) => void;
  limit?: number;
}

export function bindSearch(view: SearchView) {
  const { input, status, list, onQuery, limit = 12 } = view;
  let seq = 0;
  let timer: number | undefined;

  const render = async (q: string) => {
    const mine = ++seq;
    const query = q.trim();
    list.replaceChildren();
    if (!query) {
      status.textContent = 'Type at least two letters, for example OSPF, DHCP relay or VLAN.';
      onQuery?.('');
      return;
    }
    if (query.length < 2) {
      status.textContent = 'Keep typing: at least two letters.';
      return;
    }
    const pf = await loadPagefind();
    if (mine !== seq) return;
    if (!pf) {
      status.textContent = 'Search is not available in this preview. Build the site (npm run build) and open it with npm run preview.';
      return;
    }
    status.textContent = 'Searching...';
    const res = await pf.search(query);
    if (mine !== seq || !res) return;
    const datas = await Promise.all(res.results.slice(0, limit).map((r) => r.data()));
    if (mine !== seq) return;
    for (const d of datas) list.appendChild(resultItem(d));
    const total = res.results.length;
    status.textContent =
      total === 0
        ? `No results for "${query}". Try a shorter word, a command such as "show ip route", or browse all labs.`
        : `${total} ${total === 1 ? 'result' : 'results'} for "${query}"${total > limit ? `, showing the first ${limit}` : ''}.`;
    onQuery?.(query);
  };

  input.addEventListener('input', () => {
    clearTimeout(timer);
    timer = window.setTimeout(() => render(input.value), 160);
  });
  return { run: (q: string) => render(q) };
}

function resultItem(d: PagefindResultData): HTMLLIElement {
  const li = document.createElement('li');
  li.className = 'search-result';
  const type = d.filters.type?.[0];
  const head = document.createElement('p');
  head.className = 'search-result-type';
  head.textContent = [type, d.meta.id].filter(Boolean).join(' ') || 'Page';
  const a = document.createElement('a');
  a.href = d.url;
  a.className = 'search-result-title';
  a.textContent = d.meta.title ?? d.url;
  const ex = document.createElement('p');
  ex.className = 'search-result-excerpt';
  ex.appendChild(safeExcerpt(d.excerpt));
  li.append(head, a, ex);
  const subs = (d.sub_results ?? []).filter((s) => s.url.includes('#') && s.title && s.title !== d.meta.title).slice(0, 3);
  if (subs.length) {
    const ul = document.createElement('ul');
    ul.className = 'search-result-sections';
    for (const s of subs) {
      const sli = document.createElement('li');
      const sa = document.createElement('a');
      sa.href = s.url;
      sa.textContent = s.title;
      sli.appendChild(sa);
      ul.appendChild(sli);
    }
    li.appendChild(ul);
  }
  return li;
}
