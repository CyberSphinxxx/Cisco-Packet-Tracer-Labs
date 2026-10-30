import { expect, test } from '@playwright/test';
import { canonicalLabs, textMatches } from './helpers';

// Expected counts come from canonical metadata, so new labs need no test edits.
const labs = canonicalLabs();
const total = labs.length;
const count = (f: (l: (typeof labs)[number]) => boolean) => labs.filter(f).length;
const routing = count((l) => l.category === 'routing');
const routingIntermediate = count((l) => l.category === 'routing' && l.difficulty === 'intermediate');
const routingIntOrBeg = count((l) => l.category === 'routing' && ['intermediate', 'beginner'].includes(l.difficulty));
const switching = count((l) => l.category === 'switching');

test.describe('lab catalog', () => {
  test('lists every lab once with a live result count', async ({ page }) => {
    await page.goto('/labs/');
    const rows = page.locator('[data-lab-id]');
    await expect(rows).toHaveCount(total);
    const ids = await rows.evaluateAll((els) => els.map((e) => (e as HTMLElement).dataset.labId));
    expect(new Set(ids)).toEqual(new Set(labs.map((l) => l.id)));
    await expect(page.locator('[data-count]')).toHaveText(`Showing all ${total} labs`);
  });

  test('facets intersect, sync to the URL, and back/forward restores state', async ({ page, isMobile }, info) => {
    expect(routingIntermediate, 'fixture needs routing labs at intermediate level').toBeGreaterThan(0);
    await page.goto('/labs/');
    if (info.project.name === 'mobile') await page.getByRole('button', { name: /show filters/i }).click();
    await page.getByRole('checkbox', { name: /routing/i }).check();
    await expect(page).toHaveURL(/\?category=routing$/);
    await expect(page.locator('[data-lab-id]:visible')).toHaveCount(routing);
    await page.getByRole('checkbox', { name: /^intermediate/i }).check();
    await expect(page).toHaveURL(/category=routing&difficulty=intermediate/);
    await expect(page.locator('[data-count]')).toHaveText(`Showing ${routingIntermediate} of ${total} labs`);
    await page.getByRole('checkbox', { name: /^beginner/i }).check();
    await expect(page.locator('[data-count]')).toHaveText(`Showing ${routingIntOrBeg} of ${total} labs`); // OR within difficulty
    await page.goBack();
    await expect(page).toHaveURL(/category=routing&difficulty=intermediate$/);
    await expect(page.getByRole('checkbox', { name: /^beginner/i })).not.toBeChecked();
    await page.goBack();
    await expect(page).toHaveURL(/\?category=routing$/);
    await expect(page.getByRole('checkbox', { name: /^intermediate/i })).not.toBeChecked();
    void isMobile;
  });

  test('shared URLs apply filters on load; unknown values are ignored', async ({ page }) => {
    const expected = labs
      .filter((l) => l.category === 'routing' && l.difficulty === 'intermediate' && l.topics.includes('ipv6-addressing'))
      .map((l) => l.id)
      .sort();
    expect(expected.length).toBeGreaterThan(0);
    await page.goto('/labs/?category=routing&difficulty=intermediate&topic=ipv6-addressing');
    await expect(page.locator('[data-lab-id]:visible')).toHaveCount(expected.length);
    const shown = await page.locator('[data-lab-id]:visible').evaluateAll((els) => els.map((e) => (e as HTMLElement).dataset.labId!).sort());
    expect(shown).toEqual(expected);
    await page.goto('/labs/?category=nonexistent&difficulty=%3Cscript%3E');
    await expect(page.locator('[data-lab-id]:visible')).toHaveCount(total);
    await expect(page).toHaveURL(/\/labs\/$/); // normalized
  });

  test('empty state explains and clear restores everything', async ({ page }, info) => {
    const q = 'zzqx no lab has this';
    expect(count((l) => textMatches(l, q))).toBe(0);
    await page.goto(`/labs/?q=${encodeURIComponent(q)}`);
    await expect(page.locator('[data-empty]')).toBeVisible();
    await expect(page.locator('[data-empty]')).toContainText('No labs match these filters');
    await page.locator('[data-empty]').getByRole('button', { name: 'Clear filters' }).click();
    await expect(page.locator('[data-lab-id]:visible')).toHaveCount(total);
    await expect(page).toHaveURL(/\/labs\/$/);
    void info;
  });

  test('text filter and sort work together', async ({ page }, info) => {
    const ospf = count((l) => textMatches(l, 'OSPF'));
    const minMinutes = Math.min(...labs.map((l) => l.minutes ?? Infinity));
    const quickest = labs.filter((l) => l.minutes === minMinutes).map((l) => l.id);
    await page.goto('/labs/');
    if (info.project.name === 'mobile') await page.getByRole('button', { name: /show filters/i }).click();
    await page.getByLabel('Contains words').fill('OSPF');
    await expect(page.locator('[data-lab-id]:visible')).toHaveCount(ospf);
    await expect(page).toHaveURL(/q=OSPF/);
    await page.getByLabel('Contains words').fill('');
    await page.getByLabel('Sort by').selectOption('time');
    const first = await page.locator('[data-lab-id]:visible').first().getAttribute('data-lab-id');
    expect(quickest).toContain(first);
  });

  test('without JavaScript the full list and category links remain usable', async ({ browser }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false });
    const page = await ctx.newPage();
    await page.goto('/labs/');
    await expect(page.locator('[data-lab-id]')).toHaveCount(total);
    await expect(page.locator('[data-filters]')).toBeHidden();
    await expect(page.getByText('Filtering needs JavaScript')).toBeVisible();
    await page.getByRole('link', { name: 'Switching' }).first().click();
    await expect(page).toHaveURL(/\/labs\/switching\/$/);
    await expect(page.locator('[data-lab-id]')).toHaveCount(switching);
    await ctx.close();
  });
});
