import { expect, test } from '@playwright/test';

test.describe('lab catalog', () => {
  test('lists every lab once with a live result count', async ({ page }) => {
    await page.goto('/labs/');
    const rows = page.locator('[data-lab-id]');
    await expect(rows).toHaveCount(13);
    const ids = await rows.evaluateAll((els) => els.map((e) => (e as HTMLElement).dataset.labId));
    expect(new Set(ids).size).toBe(13);
    await expect(page.locator('[data-count]')).toHaveText('Showing all 13 labs');
  });

  test('facets intersect, sync to the URL, and back/forward restores state', async ({ page, isMobile }, info) => {
    await page.goto('/labs/');
    if (info.project.name === 'mobile') await page.getByRole('button', { name: /show filters/i }).click();
    await page.getByRole('checkbox', { name: /routing/i }).check();
    await expect(page).toHaveURL(/\?category=routing$/);
    await expect(page.locator('[data-lab-id]:visible')).toHaveCount(3);
    await page.getByRole('checkbox', { name: /^intermediate/i }).check();
    await expect(page).toHaveURL(/category=routing&difficulty=intermediate/);
    await expect(page.locator('[data-count]')).toHaveText('Showing 3 of 13 labs');
    await page.getByRole('checkbox', { name: /^beginner/i }).check();
    await expect(page.locator('[data-count]')).toHaveText('Showing 3 of 13 labs'); // OR within difficulty
    await page.goBack();
    await expect(page).toHaveURL(/category=routing&difficulty=intermediate$/);
    await expect(page.getByRole('checkbox', { name: /^beginner/i })).not.toBeChecked();
    await page.goBack();
    await expect(page).toHaveURL(/\?category=routing$/);
    await expect(page.getByRole('checkbox', { name: /^intermediate/i })).not.toBeChecked();
    void isMobile;
  });

  test('shared URLs apply filters on load; unknown values are ignored', async ({ page }) => {
    await page.goto('/labs/?category=routing&difficulty=intermediate&topic=ipv6-addressing');
    await expect(page.locator('[data-lab-id]:visible')).toHaveCount(1);
    await expect(page.locator('[data-lab-id="PTL-0001"]')).toBeVisible();
    await page.goto('/labs/?category=nonexistent&difficulty=%3Cscript%3E');
    await expect(page.locator('[data-lab-id]:visible')).toHaveCount(13);
    await expect(page).toHaveURL(/\/labs\/$/); // normalized
  });

  test('empty state explains and clear restores everything', async ({ page }, info) => {
    await page.goto('/labs/?category=routing&difficulty=beginner');
    await expect(page.locator('[data-empty]')).toBeVisible();
    await expect(page.locator('[data-empty]')).toContainText('No labs match these filters');
    await page.locator('[data-empty]').getByRole('button', { name: 'Clear filters' }).click();
    await expect(page.locator('[data-lab-id]:visible')).toHaveCount(13);
    await expect(page).toHaveURL(/\/labs\/$/);
    void info;
  });

  test('text filter and sort work together', async ({ page }, info) => {
    await page.goto('/labs/');
    if (info.project.name === 'mobile') await page.getByRole('button', { name: /show filters/i }).click();
    await page.getByLabel('Contains words').fill('OSPF');
    await expect(page.locator('[data-lab-id]:visible')).toHaveCount(1);
    await expect(page).toHaveURL(/q=OSPF/);
    await page.getByLabel('Contains words').fill('');
    await page.getByLabel('Sort by').selectOption('time');
    const first = await page.locator('[data-lab-id]:visible').first().getAttribute('data-lab-id');
    expect(['PTL-0002', 'PTL-0005', 'PTL-0008', 'PTL-0003']).toContain(first);
  });

  test('without JavaScript the full list and category links remain usable', async ({ browser }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false });
    const page = await ctx.newPage();
    await page.goto('/labs/');
    await expect(page.locator('[data-lab-id]')).toHaveCount(13);
    await expect(page.locator('[data-filters]')).toBeHidden();
    await expect(page.getByText('Filtering needs JavaScript')).toBeVisible();
    await page.getByRole('link', { name: 'Switching' }).first().click();
    await expect(page).toHaveURL(/\/labs\/switching\/$/);
    await expect(page.locator('[data-lab-id]')).toHaveCount(2);
    await ctx.close();
  });
});
