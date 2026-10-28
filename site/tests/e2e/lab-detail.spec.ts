import fs from 'node:fs';
import { expect, test } from '@playwright/test';
import { canonicalLabs, sha256, sourceSha } from './helpers';

const labs = canonicalLabs();

test.describe('lab detail pages', () => {
  test('every lab page renders its guide, topology and both downloads', async ({ page, request }) => {
    for (const lab of labs) {
      const res = await page.goto(lab.route);
      expect(res?.status(), lab.id).toBe(200);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('[data-lab-id]').first()).toHaveAttribute('data-lab-id', lab.id);
      // full 11-section guide with GitHub-compatible anchors
      for (const id of ['learning-objectives', 'prerequisites', 'topology', 'addressing-table', 'lab-tasks', 'configuration-walkthrough', 'verification', 'troubleshooting', 'key-takeaways', 'references', 'files-and-validation-status']) {
        await expect(page.locator(`article h2#${id}`), `${lab.id} #${id}`).toHaveCount(1);
      }
      // topology image actually decodes
      const img = page.locator('article figure img').first();
      await img.scrollIntoViewIfNeeded();
      await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0), { message: `${lab.id} topology` }).toBe(true);
      // both download URLs serve the exact source bytes
      for (const [role, asset] of [['starter', lab.starter], ['completed', lab.completed]] as const) {
        const href = await page.locator(`[data-download="${role}"]`).getAttribute('href');
        expect(href).toBe(`${lab.route}${asset}`);
        const body = await (await request.get(href!)).body();
        expect(body.length, `${lab.id} ${role}`).toBeGreaterThan(0);
        expect(sha256(body), `${lab.id} ${role}`).toBe(sourceSha(`labs/${lab.category}/${lab.slug}/${asset}`));
      }
    }
  });

  test('PTL-0008 starter downloads as a real file with its original name and bytes', async ({ page }) => {
    const lab = labs.find((l) => l.id === 'PTL-0008')!;
    await page.goto(lab.route);
    const [download] = await Promise.all([page.waitForEvent('download'), page.locator('[data-download="starter"]').click()]);
    expect(download.suggestedFilename()).toBe('starter.pkt');
    const file = await download.path();
    expect(sha256(fs.readFileSync(file!))).toBe(sourceSha(`labs/${lab.category}/${lab.slug}/${lab.starter}`));
  });

  test('the solution is behind an explicit, labelled disclosure', async ({ page }) => {
    await page.goto('/labs/routing/single-area-ospfv2/');
    const solution = page.locator('[data-download="completed"]');
    await expect(solution).toBeHidden();
    await page.getByText('Solution / reference file').click();
    await expect(solution).toBeVisible();
    await expect(solution).toHaveText(/Download solution file/);
    await expect(page.locator('[data-download="starter"]')).toHaveText(/Download starter file/);
  });

  test('PTL-0012: tables, commands, configs and TOC work; no page overflow', async ({ page }, info) => {
    await page.goto('/labs/network-services/dhcp-server-and-relay/');
    await expect(page.locator('article .table-scroll table').first()).toBeVisible();
    await expect(page.locator('article pre code').first()).toContainText(/\S/);
    await expect(page.locator('article')).toContainText('ip helper-address');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    // config viewer
    await page.locator('.config summary', { hasText: 'R2' }).click();
    await expect(page.locator('.config[open] pre code')).toContainText('ip dhcp pool');
    // TOC link targets exist
    const tocLinks = info.project.name === 'desktop' ? '.toc-sidebar a' : '.toc-inline a';
    const hrefs = await page.locator(tocLinks).evaluateAll((as) => as.map((a) => (a as HTMLAnchorElement).hash.slice(1)));
    expect(hrefs.length).toBeGreaterThan(11);
    for (const id of hrefs) await expect(page.locator(`[id="${decodeURIComponent(id)}"]`)).toHaveCount(1);
  });

  test('PTL-0001 links the preserved historical reference file', async ({ page, request }) => {
    await page.goto('/labs/routing/dual-stack-static-routing/');
    const link = page.locator('article a[href$="dual-stack-static-routing.pkt"]');
    await expect(link).toHaveCount(1);
    const body = await (await request.get((await link.getAttribute('href'))!)).body();
    expect(sha256(body)).toBe('8d7f62a8b4e36ef0a6efb613b92e84dbed3f1c34cb5d268b9d2b7db487680b31');
  });

  test('prev/next follow the learning order and the evidence link goes to GitHub', async ({ page }) => {
    await page.goto('/labs/network-fundamentals/ios-navigation-and-initial-config/');
    await expect(page.locator('a[rel="next"]')).toHaveAttribute('href', '/labs/ip-addressing/router-interface-configuration/');
    await expect(page.locator('a[rel="prev"]')).toHaveCount(0);
    await expect(page.getByRole('link', { name: 'Tested in Packet Tracer' })).toHaveAttribute('href', /github\.com\/CyberSphinxxx\/Cisco-Packet-Tracer-Labs\/blob\/.+\/AI_AGENT_GUIDE\/state\/PTL-0008-SIMULATOR-RESULTS\.md$/);
  });
});
