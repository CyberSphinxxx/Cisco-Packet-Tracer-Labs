import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, test } from '@playwright/test';
import { canonicalLabs } from './helpers';

/** Apply the generated Cloudflare _headers CSP in the browser and prove nothing breaks. */
const headersFile = path.resolve(fileURLToPath(new URL('../../dist/_headers', import.meta.url)));
const csp = /Content-Security-Policy: (.+)/.exec(fs.readFileSync(headersFile, 'utf8'))![1];

test.describe('Content-Security-Policy from dist/_headers', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/*', async (route) => {
      const response = await route.fetch();
      const headers = { ...response.headers() };
      if ((headers['content-type'] ?? '').includes('text/html')) headers['content-security-policy'] = csp.replace('upgrade-insecure-requests', '');
      await route.fulfill({ response, headers });
    });
  });

  test('pages, theme script, catalog filters and Pagefind search work under the CSP', async ({ page }) => {
    const violations: string[] = [];
    page.on('console', (m) => {
      if (/Content Security Policy|Refused to/i.test(m.text())) violations.push(m.text());
    });
    await page.goto('/labs/?category=routing');
    await expect(page.locator('[data-lab-id]:visible')).toHaveCount(canonicalLabs().filter((l) => l.category === 'routing').length);
    await expect(page.locator('html')).toHaveClass(/\bjs\b/);
    await page.goto('/search/?q=VLAN');
    await expect(page.locator('.search-page .search-result-title').first()).toBeVisible({ timeout: 10_000 });
    await page.goto('/labs/routing/single-area-ospfv2/');
    await expect(page.locator('article figure img')).toBeVisible();
    expect(violations).toEqual([]);
  });
});
