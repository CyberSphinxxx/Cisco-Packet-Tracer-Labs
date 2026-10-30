import { describe, expect, it } from 'vitest';
import { applyFilters, EMPTY_STATE, facetsOf, parseState, serializeState, type CatalogItem } from '../../src/lib/filters';
import { realRepo } from '../helpers/repo';

const items: CatalogItem[] = realRepo().labs.map((l) => ({
  id: l.id, title: l.title, summary: l.summary, category: l.category, difficulty: l.difficulty, topics: l.topics, minutes: l.minutes, order: l.learningOrder,
}));
const facets = facetsOf(items);
const ids = (q: string) => applyFilters(items, parseState(q, facets)).map((i) => i.id);

describe('catalog filters on the real lab metadata', () => {
  it('empty state returns every lab once, in learning order', () => {
    const all = applyFilters(items, EMPTY_STATE);
    expect(all).toHaveLength(items.length);
    expect(new Set(all.map((i) => i.id)).size).toBe(items.length);
    expect(all.map((i) => i.order)).toEqual([...all.map((i) => i.order)].sort((a, b) => a - b));
  });

  it('combines facets with intersection semantics', () => {
    const routing = ids('category=routing');
    const intermediate = ids('difficulty=intermediate');
    const both = ids('category=routing&difficulty=intermediate');
    expect(both).toEqual(routing.filter((id) => intermediate.includes(id)));
    const routingBeginner = items.filter((i) => i.category === 'routing' && i.difficulty === 'beginner').map((i) => i.id);
    expect(ids('category=routing&difficulty=beginner').sort()).toEqual(routingBeginner.sort());
  });

  it('ORs values within one facet', () => {
    const a = ids('category=routing');
    const b = ids('category=switching');
    expect(ids('category=routing&category=switching').sort()).toEqual([...a, ...b].sort());
  });

  it('routing + intermediate + IPv6 finds the dual-stack lab (kit journey 3)', () => {
    expect(ids('category=routing&difficulty=intermediate&topic=ipv6-addressing')).toEqual(['PTL-0001']);
  });

  it('text query matches ids, titles, summaries and topics, all terms required', () => {
    expect(ids('q=OSPF')).toEqual(['PTL-0011']);
    expect(ids('q=ptl-0012')).toEqual(['PTL-0012']);
    expect(ids('q=dhcp relay')).toEqual(['PTL-0012']);
    expect(ids('q=ospf dhcp')).toEqual([]);
  });

  it('time filter keeps labs at or under the limit', () => {
    for (const id of ids('time=30')) expect(items.find((i) => i.id === id)!.minutes).toBeLessThanOrEqual(30);
    const expected45 = items.filter((i) => i.minutes !== null && i.minutes <= 45).map((i) => i.id);
    expect(ids('time=45').sort()).toEqual(expected45.sort());
  });

  it('drops unknown or hostile URL values instead of applying them', () => {
    const s = parseState('category=does-not-exist&difficulty=<script>&topic=x&time=7&sort=evil&q=' + 'a'.repeat(300), facets);
    expect(s.category).toEqual([]);
    expect(s.difficulty).toEqual([]);
    expect(s.topic).toEqual([]);
    expect(s.maxMinutes).toBeNull();
    expect(s.sort).toBe('recommended');
    expect(s.q.length).toBeLessThanOrEqual(100);
    expect(ids('category=does-not-exist')).toHaveLength(items.length);
  });

  it('serializes deterministically and round-trips (shareable URLs)', () => {
    const s = parseState('difficulty=intermediate&category=switching&category=routing&sort=time', facets);
    const q = serializeState(s);
    expect(q).toBe('?category=routing&category=switching&difficulty=intermediate&sort=time');
    expect(parseState(q, facets)).toEqual(s);
    expect(serializeState(EMPTY_STATE)).toBe('');
  });

  it('sorts by title, time and difficulty with stable tie-breaks', () => {
    const byTitle = applyFilters(items, { ...EMPTY_STATE, sort: 'title' }).map((i) => i.title);
    expect(byTitle).toEqual([...byTitle].sort((a, b) => a.localeCompare(b, 'en')));
    const byTime = applyFilters(items, { ...EMPTY_STATE, sort: 'time' }).map((i) => i.minutes ?? 0);
    expect(byTime).toEqual([...byTime].sort((a, b) => a - b));
    const byDiff = applyFilters(items, { ...EMPTY_STATE, sort: 'difficulty' }).map((i) => i.difficulty);
    expect(byDiff.lastIndexOf('beginner')).toBeLessThan(byDiff.indexOf('intermediate'));
  });
});
