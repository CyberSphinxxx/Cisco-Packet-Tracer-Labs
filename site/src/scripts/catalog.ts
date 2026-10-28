/**
 * Catalog filtering in the browser. The page already lists every lab in
 * static HTML; this script reveals the filter panel and hides/reorders rows.
 * State lives in the URL (shareable, back/forward aware).
 */
import { applyFilters, EMPTY_STATE, isDefault, parseState, serializeState, type CatalogItem, type Facets, type FilterState } from '../lib/filters';

const dataEl = document.getElementById('catalog-data');
const list = document.querySelector<HTMLOListElement>('[data-lab-list]');
const form = document.querySelector<HTMLFormElement>('[data-filter-form]');
if (dataEl && list && form) {
  const { items, facets } = JSON.parse(dataEl.textContent ?? '{}') as { items: CatalogItem[]; facets: Facets };
  const rows = new Map([...list.querySelectorAll<HTMLLIElement>('[data-lab-id]')].map((li) => [li.dataset.labId!, li]));
  const panel = document.querySelector<HTMLElement>('[data-filters]')!;
  const toggle = document.querySelector<HTMLButtonElement>('[data-filters-toggle]')!;
  const countEl = document.querySelector<HTMLElement>('[data-count]')!;
  const emptyEl = document.querySelector<HTMLElement>('[data-empty]')!;
  const sortWrap = document.querySelector<HTMLElement>('[data-sort-wrap]')!;
  const sortSel = document.getElementById('f-sort') as HTMLSelectElement;
  const query = document.getElementById('f-q') as HTMLInputElement;
  const time = document.getElementById('f-time') as HTMLSelectElement;
  const topicsBox = document.querySelector<HTMLDetailsElement>('[data-topics]')!;
  const resets = document.querySelectorAll<HTMLButtonElement>('[data-reset]');

  panel.hidden = false;
  toggle.hidden = false;
  sortWrap.hidden = false;

  const readForm = (): FilterState => {
    const checked = (name: string) => [...form.querySelectorAll<HTMLInputElement>(`input[name="${name}"]:checked`)].map((i) => i.value);
    const params = new URLSearchParams();
    if (query.value.trim()) params.set('q', query.value);
    for (const k of ['category', 'difficulty', 'topic']) for (const v of checked(k)) params.append(k, v);
    if (time.value) params.set('time', time.value);
    if (sortSel.value !== 'recommended') params.set('sort', sortSel.value);
    return parseState(params, facets);
  };

  const writeForm = (s: FilterState) => {
    query.value = s.q;
    for (const input of form.querySelectorAll<HTMLInputElement>('input[type="checkbox"]')) {
      input.checked = (s[input.name as 'category' | 'difficulty' | 'topic'] as string[]).includes(input.value);
    }
    time.value = s.maxMinutes == null ? '' : String(s.maxMinutes);
    sortSel.value = s.sort;
    if (s.topic.length) topicsBox.open = true;
  };

  const render = (s: FilterState) => {
    const visible = applyFilters(items, s);
    const ids = new Set(visible.map((v) => v.id));
    for (const [id, row] of rows) row.hidden = !ids.has(id);
    for (const v of visible) list.appendChild(rows.get(v.id)!); // reorder for the chosen sort
    countEl.textContent = visible.length === items.length ? `Showing all ${items.length} labs` : `Showing ${visible.length} of ${items.length} labs`;
    emptyEl.hidden = visible.length > 0;
    const active = !isDefault({ ...s, sort: 'recommended' });
    resets.forEach((b) => (b.hidden = !active && b.closest('[data-empty]') === null));
    const nActive = s.category.length + s.difficulty.length + s.topic.length + (s.maxMinutes != null ? 1 : 0) + (s.q ? 1 : 0);
    toggle.textContent = toggle.getAttribute('aria-expanded') === 'true' ? 'Hide filters' : nActive ? `Show filters (${nActive} active)` : 'Show filters';
  };

  const commit = (s: FilterState, mode: 'push' | 'replace') => {
    const next = `${location.pathname}${serializeState(s)}`;
    if (next !== `${location.pathname}${location.search}`) history[mode === 'push' ? 'pushState' : 'replaceState'](null, '', next);
    render(s);
  };

  // initial state from the URL (unknown values are dropped and the URL is normalized)
  const initial = parseState(location.search, facets);
  writeForm(initial);
  commit(initial, 'replace');

  form.addEventListener('submit', (e) => e.preventDefault());
  form.addEventListener('change', (e) => {
    if ((e.target as HTMLElement).id === 'f-q') return;
    commit(readForm(), 'push');
  });
  sortSel.addEventListener('change', () => commit(readForm(), 'push'));
  let typing: number | undefined;
  query.addEventListener('input', () => {
    clearTimeout(typing);
    typing = window.setTimeout(() => commit(readForm(), 'replace'), 150);
  });
  resets.forEach((b) =>
    b.addEventListener('click', () => {
      writeForm(EMPTY_STATE);
      commit(EMPTY_STATE, 'push');
      query.focus();
    }),
  );
  window.addEventListener('popstate', () => {
    const s = parseState(location.search, facets);
    writeForm(s);
    render(s);
  });
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    panel.toggleAttribute('data-open', open);
    render(readForm());
    if (open) query.focus();
  });
}
