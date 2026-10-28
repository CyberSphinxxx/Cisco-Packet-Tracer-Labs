import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const PAGES = [
  '/',
  '/labs/',
  '/labs/routing/',
  '/labs/network-services/dhcp-server-and-relay/',
  '/labs/routing/dual-stack-static-routing/verification/',
  '/learning-paths/',
  '/learning-paths/ccna-aligned/',
  '/projects/small-office-network/',
  '/docs/',
  '/docs/cisco-ios-cheatsheet/',
  '/about/',
  '/search/?q=OSPF',
  '/does-not-exist/',
];

for (const scheme of ['light', 'dark'] as const) {
  test.describe(`axe WCAG 2.2 AA (${scheme})`, () => {
    test.use({ colorScheme: scheme });
    for (const path of PAGES) {
      test(`${path}`, async ({ page }) => {
        await page.goto(path);
        if (path.startsWith('/search')) await expect(page.locator('.search-page .search-result-title').first()).toBeVisible({ timeout: 10_000 });
        // open disclosures so their content is scanned too
        await page.evaluate(() => document.querySelectorAll('main details').forEach((d) => ((d as HTMLDetailsElement).open = true)));
        const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice']).analyze();
        const serious = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
        const summary = results.violations.map((v) => `${v.impact} ${v.id}: ${v.nodes.length} node(s) e.g. ${v.nodes[0]?.target.join(' ')}`);
        expect(serious, summary.join('\n')).toEqual([]);
        expect(results.violations, summary.join('\n')).toEqual([]);
      });
    }
  });
}

test.describe('search dialog accessibility', () => {
  test('open dialog has no violations', async ({ page }) => {
    await page.goto('/labs/');
    await page.locator('[data-search-trigger]').click();
    await page.locator('#dialog-q').fill('VLAN');
    await expect(page.locator('[data-search-dialog] .search-result-title').first()).toBeVisible({ timeout: 10_000 });
    const results = await new AxeBuilder({ page }).include('[data-search-dialog]').withTags(['wcag2a', 'wcag2aa', 'wcag22aa']).analyze();
    expect(results.violations.map((v) => `${v.id}: ${v.nodes[0]?.target}`)).toEqual([]);
  });
});
