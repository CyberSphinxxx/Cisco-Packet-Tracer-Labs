import { expect, test } from '@playwright/test';

const PAGES = [
  '/',
  '/labs/',
  '/labs/network-services/dhcp-server-and-relay/',
  '/labs/routing/dual-stack-static-routing/',
  '/labs/network-security/standard-and-extended-acls/verification/',
  '/projects/small-office-network/',
  '/learning-paths/bsit-networking/',
  '/docs/cisco-ios-cheatsheet/',
  '/docs/coverage-matrix/',
  '/about/',
];
const WIDTHS = [320, 360, 390, 768, 1024, 1440];

test.describe('responsive layout', () => {
  // Viewports are set inside each test, so one browser project is enough.
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'runs once; viewport is set per test');
  });
  for (const width of WIDTHS) {
    test(`no horizontal page overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      for (const path of PAGES) {
        await page.goto(path);
        const overflow = await page.evaluate(() => {
          const offenders = [...document.querySelectorAll('body *')]
            .filter((el) => {
              const r = el.getBoundingClientRect();
              return r.width > 0 && r.right > window.innerWidth + 1 && !el.closest('.table-scroll, pre, .search-dialog, dialog');
            })
            .map((el) => `${el.tagName.toLowerCase()}.${String(el.className).split(' ')[0]}`);
          return { scroll: document.documentElement.scrollWidth - window.innerWidth, offenders: offenders.slice(0, 5) };
        });
        expect(overflow.scroll, `${path} @${width}: ${overflow.offenders.join(', ')}`).toBeLessThanOrEqual(0);
      }
    });
  }

  test('200% zoom equivalent (640 CSS px at 2x) keeps content usable', async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 640, height: 450 }, deviceScaleFactor: 2 });
    const page = await ctx.newPage();
    for (const path of PAGES) {
      await page.goto(path);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth), path).toBeLessThanOrEqual(0);
    }
    // the menu still works at this size
    await page.goto('/labs/');
    await page.locator('.menu-toggle').click();
    await expect(page.locator('#site-nav a', { hasText: 'Paths' })).toBeVisible();
    await ctx.close();
  });

  test('reduced motion disables smooth scrolling and transitions', async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.goto('/labs/routing/single-area-ospfv2/');
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto');
    expect(await page.evaluate(() => parseFloat(getComputedStyle(document.querySelector('.btn')!).transitionDuration))).toBeLessThan(0.001);
    await ctx.close();
  });

  test('keyboard: skip link moves focus to main content', async ({ page }) => {
    await page.goto('/labs/routing/single-area-ospfv2/');
    await page.keyboard.press('Tab');
    await expect(page.locator('.skip-link')).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/#main$/);
    await expect(page.locator('#main')).toBeFocused();
  });

  test('focus is always visible on interactive controls', async ({ page }) => {
    await page.goto('/labs/');
    for (let i = 0; i < 12; i++) {
      await page.keyboard.press('Tab');
      const ok = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null;
        if (!el || el === document.body) return true;
        const s = getComputedStyle(el);
        return s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) >= 2;
      });
      expect(ok, `tab stop ${i + 1}`).toBe(true);
    }
  });
});
