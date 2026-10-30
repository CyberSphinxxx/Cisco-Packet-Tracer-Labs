import fs from 'node:fs';
import path from 'node:path';
import { expect, test } from '@playwright/test';
import { canonicalLabs, pathLabLinks, REPO_ROOT } from './helpers';

/** Everything expected here is read from the canonical repository, never hard-coded. */
const labs = canonicalLabs();
const beginnerFile = fs.readdirSync(path.join(REPO_ROOT, 'learning-paths')).find((f) => /beginner.*\.md$/.test(f))!;
const beginnerRoutes = [...new Set(pathLabLinks(beginnerFile))];
const beginnerIds = beginnerRoutes.map((r) => labs.find((l) => l.route === r)!.id);

test.describe('header', () => {
  test('nav links only to pages that exist, and "Start with lab 1" opens the first beginner lab', async ({ page, request }, info) => {
    await page.goto('/');
    const nav = page.locator('#site-nav');
    if (info.project.name === 'mobile') await page.locator('.menu-toggle').click();
    const hrefs = await nav.locator('ul a').evaluateAll((as) => as.map((a) => a.getAttribute('href')!));
    expect(hrefs.length).toBeGreaterThanOrEqual(3);
    for (const href of hrefs) expect((await request.get(href)).status(), href).toBe(200);
    const start = page.getByRole('link', { name: 'Start with lab 1' }).filter({ visible: true });
    await expect(start).toHaveCount(1);
    await expect(start).toHaveAttribute('href', beginnerRoutes[0]);
    await start.click();
    await expect(page).toHaveURL(new RegExp(`${beginnerRoutes[0]}$`));
  });

  test('marks the current section', async ({ page }, info) => {
    await page.goto('/labs/');
    if (info.project.name === 'mobile') await page.locator('.menu-toggle').click();
    await expect(page.locator('#site-nav a[aria-current="page"]')).toHaveText('Labs');
  });

  test('mobile: the menu opens as a sheet, Escape closes it and returns focus', async ({ page }, info) => {
    test.skip(info.project.name !== 'mobile', 'mobile layout only');
    await page.goto('/');
    const toggle = page.locator('.menu-toggle');
    const nav = page.locator('#site-nav');
    await expect(nav).toBeHidden();
    await expect(page.locator('.header-tools').getByRole('link', { name: 'GitHub' })).toBeHidden();
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(nav.getByRole('link', { name: 'Labs' })).toBeFocused();
    await expect(nav.getByRole('link', { name: 'GitHub' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Start with lab 1' })).toBeVisible();
    const box = (await nav.boundingBox())!;
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.width).toBeLessThanOrEqual(390);
    await page.keyboard.press('Escape');
    await expect(nav).toBeHidden();
    await expect(toggle).toBeFocused();
  });
});

test.describe('homepage', () => {
  test('badge, doors and beginner path come from the content', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toHaveText(/Learn networking by\s+configuring real topologies\./);
    await expect(page.locator('.badge')).toContainText(`${labs.length} labs, no account needed`);
    await expect(page.locator('.door').first()).toContainText(`${labs.length} labs`);
    const pathCount = fs.readdirSync(path.join(REPO_ROOT, 'learning-paths')).filter((f) => f.endsWith('.md')).length;
    await expect(page.locator('.door', { hasText: 'PATHS' })).toContainText(`${pathCount} paths`);
    const ids = await page.locator('[data-beginner-path] .path-list .lab-id').allTextContents();
    expect(ids).toEqual(beginnerIds);
    for (const href of await page.locator('[data-beginner-path] .path-list a').evaluateAll((as) => as.map((a) => a.getAttribute('href')))) {
      expect(beginnerRoutes).toContain(href);
    }
  });

  test('popular links and topic chips point at real labs, with acronyms in capitals', async ({ page }) => {
    await page.goto('/');
    const popular = await page.locator('.popular a').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
    expect(popular.length).toBeGreaterThan(0);
    for (const href of popular) expect(labs.map((l) => l.route)).toContain(href);
    const chips = await page.locator('.topics .chip').allTextContents();
    expect(chips.length).toBeGreaterThan(5);
    for (const bad of ['Vlsm', 'Arp', 'Mac Address', 'Ios Navigation']) expect(chips).not.toContain(bad);
    expect(chips).toContain('VLSM');
  });

  test('the old patch panel is gone and ad slots render nothing while ads are off', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.panel, .ports, .portmap')).toHaveCount(0);
    await expect(page.locator('[data-ad-slot]')).toHaveCount(0);
  });
});

test.describe('hero search', () => {
  test('typing shows live results; Enter goes to the search page with the query', async ({ page }) => {
    await page.goto('/');
    const input = page.getByRole('searchbox', { name: 'Search labs, commands and guides' });
    await input.fill('OSPF');
    const panel = page.locator('[data-hero-panel]');
    await expect(panel).toBeVisible();
    await expect(panel.locator('.search-result-title').first()).toBeVisible({ timeout: 10_000 });
    const hrefs = await panel.locator('.search-result-title').evaluateAll((as) => as.map((a) => a.getAttribute('href')!));
    expect(hrefs.some((h) => /single-area-ospfv2/.test(h))).toBe(true);
    await page.keyboard.press('Escape');
    await expect(panel).toBeHidden();
    await input.press('Enter');
    await expect(page).toHaveURL(/\/search\/\?q=OSPF$/);
    await expect(page.locator('.search-page .search-result-title').first()).toBeVisible({ timeout: 10_000 });
  });

  test('"/" focuses the hero box while it is on screen, and opens the dialog once scrolled away', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('/');
    await expect(page.locator('#hero-q')).toBeFocused();
    await page.locator('#hero-q').blur();
    await page.locator('.topics').scrollIntoViewIfNeeded();
    await page.keyboard.press('/');
    await expect(page.locator('[data-search-dialog]')).toBeVisible();
    await expect(page.locator('#dialog-q')).toBeFocused();
  });

  test('works as a plain form without JavaScript', async ({ browser }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false });
    const page = await ctx.newPage();
    await page.goto('/');
    await page.locator('#hero-q').fill('VLAN');
    await page.locator('#hero-q').press('Enter');
    await expect(page).toHaveURL(/\/search\/\?q=VLAN$/);
    await ctx.close();
  });
});

test.describe('hero background animation', () => {
  test('is decorative, animates only transform and opacity, and pauses off-screen', async ({ page }, info) => {
    test.skip(info.project.name !== 'desktop', 'packets run on wide screens only');
    await page.goto('/');
    const layer = page.locator('[data-hero-backdrop]');
    await expect(layer).toHaveAttribute('aria-hidden', 'true');
    expect(await layer.evaluate((el) => getComputedStyle(el).pointerEvents)).toBe('none');
    await expect(page.locator('[data-hb-motion]')).toHaveClass(/ready/);
    const props = await page.evaluate(() =>
      document
        .querySelector('[data-hero-backdrop]')!
        .getAnimations({ subtree: true })
        .flatMap((a) => (a.effect as KeyframeEffect).getKeyframes().flatMap((k) => Object.keys(k)))
        .filter((k) => !['offset', 'easing', 'composite', 'computedOffset'].includes(k)),
    );
    expect(props.length).toBeGreaterThan(0);
    expect([...new Set(props)].sort()).toEqual(['opacity', 'transform']);
    // no SMIL in the decorative SVG
    await expect(layer.locator('animate, animateMotion, animateTransform, set')).toHaveCount(0);
    await page.locator('.topics').scrollIntoViewIfNeeded();
    await expect(layer).toHaveClass(/paused/);
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(layer).not.toHaveClass(/paused/);
  });

  test('reduced motion keeps the static grid and links with no packets', async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage();
    await page.goto('/');
    await expect(page.locator('.hb-links')).toBeVisible();
    await expect(page.locator('[data-hb-motion]')).toBeHidden();
    expect(await page.evaluate(() => document.querySelector('[data-hero-backdrop]')!.getAnimations({ subtree: true }).length)).toBe(0);
    await ctx.close();
  });

  test('phones get the static layer only', async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await ctx.newPage();
    await page.goto('/');
    await expect(page.locator('[data-hb-motion]')).toBeHidden();
    expect(await page.evaluate(() => document.querySelector('[data-hero-backdrop]')!.getAnimations({ subtree: true }).length)).toBe(0);
    await ctx.close();
  });

  test('forced colours hide the layer', async ({ browser }) => {
    const ctx = await browser.newContext({ forcedColors: 'active' });
    const page = await ctx.newPage();
    await page.goto('/');
    await expect(page.locator('[data-hero-backdrop]')).toBeHidden();
    await ctx.close();
  });
});
