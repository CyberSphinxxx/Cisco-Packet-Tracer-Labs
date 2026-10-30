import fs from 'node:fs';
import path from 'node:path';
import { expect, test } from '@playwright/test';
import { canonicalLabs, pathLabLinks, REPO_ROOT, sha256, sourceSha } from './helpers';

test.describe('learning paths, capstone and docs', () => {
  for (const file of fs.readdirSync(path.join(REPO_ROOT, 'learning-paths')).filter((f) => f.endsWith('.md'))) {
    const slug = file.replace(/\.md$/, '');
    test(`learning path ${slug} keeps source order and links real labs`, async ({ page, request }) => {
      await page.goto(`/learning-paths/${slug}/`);
      await expect(page.locator('h1')).toHaveCount(1);
      const expected = [...new Set(pathLabLinks(file))];
      const glance = await page.locator('.glance .step-lab a').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
      expect([...new Set(glance)]).toEqual(expected);
      for (const href of expected) expect((await request.get(href)).status(), href).toBe(200);
      // the original path text renders too
      await expect(page.locator('article')).not.toBeEmpty();
    });
  }

  test('beginner path leads to PTL-0008 (kit journey 1)', async ({ page }) => {
    await page.goto('/');
    await page.locator('[data-beginner-path]').getByRole('link', { name: /view the beginner networking/i }).click();
    await expect(page).toHaveURL(/\/learning-paths\/networking-beginner\/$/);
    await page.locator('.glance').getByRole('link', { name: /PTL-0008/ }).click();
    await expect(page).toHaveURL(/\/labs\/network-fundamentals\/ios-navigation-and-initial-config\/$/);
    await expect(page.locator('[data-download="starter"]')).toBeVisible();
  });

  test('capstone: downloads are real, prerequisites link to labs', async ({ page, request }) => {
    await page.goto('/projects/small-office-network/');
    await expect(page.locator('h1')).toContainText('Small Office');
    for (const role of ['starter', 'completed'] as const) {
      const href = await page.locator(`[data-download="${role}"]`).getAttribute('href');
      expect(href).toBe(`/projects/small-office-network/assets/${role}.pkt`);
      expect(sha256(await (await request.get(href!)).body())).toBe(sourceSha(`projects/small-office-network/assets/${role}.pkt`));
    }
    const prereqs = page.locator('.prereqs a');
    expect(await prereqs.count()).toBeGreaterThanOrEqual(5);
    for (const href of await prereqs.evaluateAll((as) => as.map((a) => a.getAttribute('href')!))) expect((await request.get(href)).status()).toBe(200);
    await expect(page.locator('article figure img')).toHaveCount(1);
    await page.locator('section:has(> #site-verification) p a').click();
    await expect(page).toHaveURL(/\/projects\/small-office-network\/verification\/$/);
  });

  test('every reference doc renders with its source title', async ({ page }) => {
    for (const file of fs.readdirSync(path.join(REPO_ROOT, 'docs')).filter((f) => f.endsWith('.md'))) {
      const title = /^# (.+)$/m.exec(fs.readFileSync(path.join(REPO_ROOT, 'docs', file), 'utf8'))![1].trim();
      await page.goto(`/docs/${file.replace(/\.md$/, '')}/`);
      await expect(page.locator('h1')).toHaveText(title);
    }
  });

  test('verification guides link back to their lab', async ({ page }) => {
    await page.goto('/labs/routing/dual-stack-static-routing/verification/');
    await expect(page.locator('h1')).toContainText('PTL-0001');
    await page.locator('.ver-note a').click();
    await expect(page).toHaveURL(/\/labs\/routing\/dual-stack-static-routing\/$/);
  });

  test('about page states independence and the licensing split', async ({ page }) => {
    await page.goto('/about/');
    await expect(page.locator('main')).toContainText('not affiliated with, sponsored by, or endorsed by Cisco');
    await expect(page.locator('main')).toContainText('CC BY-SA 4.0');
    await expect(page.locator('main')).toContainText('The MIT license covers code only');
  });

  test('unknown URLs get a helpful 404', async ({ page }) => {
    const res = await page.goto('/labs/not-a-real-lab/');
    expect(res?.status()).toBe(404);
    await expect(page.locator('h1')).toHaveText('This page does not exist');
    await page.getByRole('link', { name: new RegExp(`browse all ${canonicalLabs().length} labs`, 'i') }).click();
    await expect(page).toHaveURL(/\/labs\/$/);
  });

  test('no agent-only files are reachable', async ({ request }) => {
    for (const p of ['/AI_AGENT_GUIDE/state/PTL-0008-SIMULATOR-RESULTS.md', '/WEBSITE_AGENT_KIT/README.md', '/labs/network-fundamentals/ios-navigation-and-initial-config/README.md', '/labs/network-fundamentals/ios-navigation-and-initial-config/metadata.json']) {
      expect((await request.get(p)).status(), p).toBe(404);
    }
  });
});
