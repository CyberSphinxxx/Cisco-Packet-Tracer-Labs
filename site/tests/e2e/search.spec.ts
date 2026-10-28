import { expect, test, type Page } from '@playwright/test';

async function resultsFor(page: Page, q: string) {
  await page.goto(`/search/?q=${encodeURIComponent(q)}`);
  const status = page.locator('.search-page [data-search-status]');
  await expect(status).toContainText(/results? for|No results/, { timeout: 10_000 });
  const hrefs = await page.locator('.search-page .search-result-title').evaluateAll((as) => as.map((a) => a.getAttribute('href')!));
  return { hrefs, status: await status.textContent() };
}

test.describe('Pagefind search on the built site', () => {
  const cases: [string, RegExp][] = [
    ['OSPF', /\/labs\/routing\/single-area-ospfv2\/$/],
    ['DHCP relay', /\/labs\/network-services\/dhcp-server-and-relay\/$/],
    ['VLAN', /\/labs\/switching\/vlan-segmentation-and-access-ports\/$/],
    ['IPv6', /\/labs\/(routing\/dual-stack-static-routing|ip-addressing\/router-interface-configuration)\/$/],
    ['ACL', /\/labs\/network-security\/standard-and-extended-acls\/$/],
    ['Packet Tracer installation', /\/docs\/installation\/$/],
  ];
  for (const [q, expected] of cases) {
    test(`"${q}" finds the expected page near the top`, async ({ page, request }) => {
      const { hrefs } = await resultsFor(page, q);
      expect(hrefs.length, q).toBeGreaterThan(0);
      expect(hrefs.slice(0, 5).some((h) => expected.test(h)), `${q}: ${hrefs.slice(0, 5).join(', ')}`).toBe(true);
      for (const h of hrefs) expect((await request.get(h.split('#')[0])).status(), h).toBe(200);
    });
  }

  test('section deep links resolve to real heading ids', async ({ page }) => {
    await page.goto('/search/?q=ip%20helper-address');
    await expect(page.locator('.search-page [data-search-status]')).toContainText('results for', { timeout: 10_000 });
    const deep = await page.locator('.search-page .search-result-sections a').evaluateAll((as) => as.map((a) => a.getAttribute('href')!));
    expect(deep.length).toBeGreaterThan(0);
    for (const href of deep.slice(0, 6)) {
      await page.goto(href);
      const id = decodeURIComponent(new URL(page.url()).hash.slice(1));
      await expect(page.locator(`[id="${id}"]`)).toHaveCount(1);
    }
  });

  test('no results and short queries explain what to do', async ({ page }) => {
    const { status } = await resultsFor(page, 'quokkabanjo');
    expect(status).toContain('No results for "quokkabanjo"');
    await page.locator('.search-page [data-search-input]').fill('o');
    await expect(page.locator('.search-page [data-search-status]')).toContainText('at least two letters');
  });

  test('results never include agent-only or private files and excerpts contain only text and mark', async ({ page }) => {
    const { hrefs } = await resultsFor(page, 'simulator results');
    for (const h of hrefs) expect(h).not.toMatch(/AI_AGENT_GUIDE|WEBSITE_AGENT_KIT|\.md$/);
    const tags = await page.locator('.search-page .search-result-excerpt *').evaluateAll((els) => [...new Set(els.map((e) => e.tagName))]);
    expect(tags.every((t) => t === 'MARK')).toBe(true);
  });

  test('header dialog: opens with "/" and the trigger, Escape closes and returns focus', async ({ page }) => {
    await page.goto('/labs/');
    await page.keyboard.press('/');
    const dialog = page.locator('[data-search-dialog]');
    await expect(dialog).toBeVisible();
    await expect(page.locator('#dialog-q')).toBeFocused();
    await page.locator('#dialog-q').fill('OSPF');
    await expect(dialog.locator('.search-result-title').first()).toBeVisible({ timeout: 10_000 });
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await page.locator('[data-search-trigger]').click();
    await expect(dialog).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('[data-search-trigger]')).toBeFocused();
  });

  test('the query is kept in the URL for sharing', async ({ page }) => {
    await page.goto('/search/');
    await page.locator('.search-page [data-search-input]').fill('EtherChannel');
    await expect(page).toHaveURL(/\/search\/\?q=EtherChannel$/);
    await expect(page.locator('.search-page .search-result-title').first()).toHaveAttribute('href', /etherchannel-lacp/);
  });
});
