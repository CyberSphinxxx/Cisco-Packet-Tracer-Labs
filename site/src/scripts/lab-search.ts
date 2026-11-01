/**
 * Instant search with a preview pane, shared by the homepage search box and
 * the header dialog.
 *
 * Results come from two places:
 *  1. search-index.json (lab metadata: titles, IDs, topics, objectives), scored
 *     here in the browser, so results appear on the first keystroke and also
 *     work in `astro dev`;
 *  2. Pagefind (full text, e.g. commands such as "show ip route"), when the
 *     built index is available. Its hits are mapped back to index entries and
 *     appended after the metadata matches.
 *
 * The input is an ARIA combobox: arrow keys move through the options, Enter
 * opens the highlighted one, and Escape closes the panel. Without JavaScript
 * the surrounding form is a plain GET to the full search page.
 */
import { base, loadPagefind } from './search-core.ts';

interface Entry {
  kind: 'lab' | 'project' | 'path' | 'guide';
  url: string;
  title: string;
  id?: string;
  meta: string;
  summary: string;
  covers: string[];
  starter?: { url: string; fileName: string };
  terms: string;
}
interface Index { entries: Entry[]; featured: string[] }
interface Prepared extends Entry { lcTitle: string; lcSummary: string; titleWords: string[] }

let indexPromise: Promise<{ entries: Prepared[]; byUrl: Map<string, Prepared>; featured: Prepared[] } | null> | null = null;

const norm = (u: string) => {
  const path = u.split('#')[0].split('?')[0];
  return path.endsWith('/') ? path : `${path}/`;
};

export function loadIndex() {
  indexPromise ??= fetch(`${base()}search-index.json`, { credentials: 'same-origin' })
    .then((r) => (r.ok ? (r.json() as Promise<Index>) : null))
    .then((data) => {
      if (!data) return null;
      const entries: Prepared[] = data.entries.map((e) => ({
        ...e,
        lcTitle: e.title.toLowerCase(),
        lcSummary: e.summary.toLowerCase(),
        titleWords: e.title.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean),
      }));
      const byUrl = new Map(entries.map((e) => [norm(e.url), e]));
      const featured = data.featured.map((u) => byUrl.get(norm(u))).filter((e): e is Prepared => Boolean(e));
      return { entries, byUrl, featured };
    })
    .catch(() => null);
  return indexPromise;
}

const KIND_WEIGHT: Record<Entry['kind'], number> = { lab: 3, project: 2, path: 1, guide: 0 };

/** Every word must appear somewhere; title and ID hits weigh most. */
function score(e: Prepared, words: string[], phrase: string): number {
  let total = 0;
  for (const w of words) {
    let s = 0;
    if (e.id && e.id.toLowerCase() === w) s = 40;
    else if (e.titleWords.some((t) => t === w || t === `${w}s`)) s = 14;
    else if (e.titleWords.some((t) => t.startsWith(w))) s = 10;
    else if (e.lcTitle.includes(w)) s = 7;
    else if (e.terms.includes(w)) s = 4;
    else if (e.lcSummary.includes(w)) s = 2;
    else return 0;
    total += s;
  }
  if (words.length > 1 && e.lcTitle.includes(phrase)) total += 12;
  return total + KIND_WEIGHT[e.kind];
}

function el<K extends keyof HTMLElementTagNameMap>(tag: K, cls?: string, text?: string) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
}

const KIND_ACTION: Record<Entry['kind'], string> = { lab: 'Open lab', project: 'Open project', path: 'Open path', guide: 'Open guide' };
const KIND_NOUN: Record<Entry['kind'], [string, string]> = { lab: ['lab', 'labs'], project: ['project', 'projects'], path: ['path', 'paths'], guide: ['guide', 'guides'] };

export interface LabSearch {
  /** Show results for the current input value (or the suggestions when empty). */
  refresh: () => void;
  input: HTMLInputElement;
  setOpen: (open: boolean) => void;
  isOpen: () => boolean;
}

export function mountLabSearch(root: HTMLElement, opts: { limit?: number; suggestWhenEmpty?: boolean; onOpenChange?: (open: boolean) => void } = {}): LabSearch {
  const { limit = 8, suggestWhenEmpty = false } = opts;
  const input = root.querySelector<HTMLInputElement>('[data-ls-input]')!;
  const panel = root.querySelector<HTMLElement>('[data-ls-panel]')!;
  const status = root.querySelector<HTMLElement>('[data-ls-status]')!;
  const list = root.querySelector<HTMLElement>('[data-ls-list]')!;
  const preview = root.querySelector<HTMLElement>('[data-ls-preview]')!;
  const all = root.querySelector<HTMLAnchorElement>('[data-ls-all]')!;
  const searchPage = `${base()}search/`;
  const idBase = list.id;

  let results: Prepared[] = [];
  let active = -1;
  let seq = 0;
  let pfTimer: number | undefined;
  let lastQuery = '';

  const isOpen = () => !panel.hidden;
  const setOpen = (open: boolean) => {
    if (panel.hidden === !open) return;
    panel.hidden = !open;
    input.setAttribute('aria-expanded', String(open && results.length > 0));
    opts.onOpenChange?.(open);
  };

  const renderPreview = () => {
    preview.replaceChildren();
    const e = results[active];
    if (!e) {
      if (lastQuery.length >= 2) {
        preview.append(
          el('p', 'ls-pv-kicker', 'No match in lab titles or topics'),
          el('p', 'ls-pv-desc', 'Try a shorter word, a topic such as OSPF or VLAN, or search the full text of every lab for a command.'),
        );
        const a = el('a', 'btn btn-primary ls-pv-open', 'Search the full text');
        a.href = `${searchPage}?q=${encodeURIComponent(lastQuery)}`;
        const actions = el('div', 'ls-pv-actions');
        actions.append(a);
        preview.append(actions);
      }
      return;
    }
    preview.append(el('p', 'ls-pv-kicker', e.kind === 'lab' ? e.meta.replace(/ · /g, '  -  ') : e.meta.split(' · ')[0]));
    preview.append(el('p', 'ls-pv-title', e.title));
    if (e.summary) preview.append(el('p', 'ls-pv-desc', e.summary));
    if (e.covers.length) {
      const c = el('p', 'ls-pv-covers');
      c.append(el('span', 'ls-pv-covers-label', 'Covers'), document.createTextNode(` ${e.covers.join(', ')}`));
      preview.append(c);
    }
    const actions = el('div', 'ls-pv-actions');
    const open = el('a', 'btn btn-primary ls-pv-open', KIND_ACTION[e.kind]);
    open.href = e.url;
    actions.append(open);
    if (e.starter) {
      const dl = el('a', 'ls-pv-dl', 'Download starter file');
      dl.href = e.starter.url;
      dl.setAttribute('download', e.starter.fileName);
      actions.append(dl);
    }
    preview.append(actions);
  };

  const setActive = (i: number, scroll = false) => {
    active = results.length ? (i + results.length) % results.length : -1;
    for (const [n, opt] of [...list.children].entries()) opt.setAttribute('aria-selected', String(n === active));
    if (active >= 0) {
      input.setAttribute('aria-activedescendant', `${idBase}-${active}`);
      if (scroll) list.children[active]?.scrollIntoView({ block: 'nearest' });
    } else input.removeAttribute('aria-activedescendant');
    renderPreview();
  };

  const renderList = (heading: string) => {
    list.replaceChildren();
    results.forEach((e, i) => {
      const a = el('a', 'ls-opt search-result-title');
      a.href = e.url;
      a.id = `${idBase}-${i}`;
      a.setAttribute('role', 'option');
      a.setAttribute('aria-selected', 'false');
      a.tabIndex = -1;
      a.append(el('span', 'ls-opt-title', e.title), el('span', 'ls-opt-meta', e.meta));
      a.addEventListener('pointermove', () => {
        if (active !== i) setActive(i);
      });
      list.append(a);
    });
    status.textContent = heading;
    input.setAttribute('aria-expanded', String(isOpen() && results.length > 0));
    setActive(results.length ? 0 : -1);
  };

  const countLabel = (items: Prepared[], q: string) => {
    if (!items.length) return `No labs match "${q}"`;
    const kinds = new Set(items.map((e) => e.kind));
    const n = items.length;
    const noun = kinds.size === 1 ? KIND_NOUN[items[0].kind][n === 1 ? 0 : 1] : n === 1 ? 'result' : 'results';
    return `${n} ${noun} ${n === 1 ? 'matches' : 'match'} "${q}"`;
  };

  const run = async () => {
    const mine = ++seq;
    const q = input.value.trim();
    lastQuery = q;
    all.href = q ? `${searchPage}?q=${encodeURIComponent(q)}` : searchPage;
    all.textContent = q ? `Search the full text for "${q}"` : 'Open the full search page';
    window.clearTimeout(pfTimer);
    const idx = await loadIndex();
    if (mine !== seq) return;
    if (!idx) {
      results = [];
      renderList('Search is unavailable right now. Press Enter for the full search page.');
      return;
    }
    if (!q) {
      results = suggestWhenEmpty ? idx.featured : [];
      renderList(suggestWhenEmpty ? 'Suggested labs' : '');
      return;
    }
    if (q.length < 2) {
      results = [];
      renderList('Keep typing: at least two letters');
      return;
    }
    const lc = q.toLowerCase();
    const words = lc.split(/[\s,]+/).filter(Boolean);
    results = idx.entries
      .map((e) => ({ e, s: score(e, words, lc) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, limit)
      .map((x) => x.e);
    renderList(countLabel(results, q));
    // Full text from Pagefind, once the reader pauses typing.
    pfTimer = window.setTimeout(async () => {
      const pf = await loadPagefind();
      if (!pf || mine !== seq) return;
      const res = await pf.search(q);
      if (!res || mine !== seq) return;
      const datas = await Promise.all(res.results.slice(0, 12).map((r) => r.data()));
      if (mine !== seq) return;
      const seen = new Set(results.map((e) => e.url));
      const extra: Prepared[] = [];
      for (const d of datas) {
        const e = idx.byUrl.get(norm(d.url)) ?? idx.byUrl.get(norm(d.url.replace(/verification\/?$/, '')));
        if (e && !seen.has(e.url)) {
          seen.add(e.url);
          extra.push(e);
        }
      }
      if (!extra.length || results.length >= limit) return;
      const keep = results[active]?.url;
      results = [...results, ...extra].slice(0, limit);
      renderList(countLabel(results, q));
      const i = results.findIndex((e) => e.url === keep);
      if (i > 0) setActive(i);
    }, 140);
  };

  const warm = () => {
    void loadIndex();
    void loadPagefind().then((p) => p?.init?.());
  };
  input.addEventListener('focus', warm, { once: true });
  root.addEventListener('pointerenter', warm, { once: true });

  input.addEventListener('input', () => {
    if (!suggestWhenEmpty) setOpen(input.value.trim().length > 0);
    void run();
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      if (!results.length) return;
      e.preventDefault();
      if (!isOpen()) setOpen(true);
      setActive(active + (e.key === 'ArrowDown' ? 1 : -1), true);
    } else if (e.key === 'Enter' && isOpen() && results[active]) {
      // Open the highlighted result; with nothing highlighted the form submits to /search/.
      e.preventDefault();
      if (e.metaKey || e.ctrlKey) window.open(results[active].url, '_blank', 'noopener');
      else window.location.assign(results[active].url);
    }
  });

  return { refresh: () => void run(), input, setOpen, isOpen };
}
