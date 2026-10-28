#!/usr/bin/env node
/**
 * Regenerates public/og-default.png (1200x630 social preview card) with the
 * locally installed Playwright Chromium and the self-hosted fonts. Run only
 * when the brand changes: `node scripts/make-og-image.mjs`.
 */
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const root = fileURLToPath(new URL('..', import.meta.url));
const font = (p) => fs.readFileSync(new URL(`../node_modules/@fontsource-variable/${p}`, import.meta.url)).toString('base64');
const sans = font('atkinson-hyperlegible-next/files/atkinson-hyperlegible-next-latin-wght-normal.woff2');
const mono = font('atkinson-hyperlegible-mono/files/atkinson-hyperlegible-mono-latin-wght-normal.woff2');
const pins = ['#f6c9a3', '#e3761c', '#b5e0c1', '#2f6fd1', '#b9cdef', '#2f9a4e', '#dcc6b4', '#8a5a35'];
const html = `<!doctype html><html><head><style>
@font-face{font-family:S;src:url(data:font/woff2;base64,${sans}) format('woff2');font-weight:200 800}
@font-face{font-family:M;src:url(data:font/woff2;base64,${mono}) format('woff2');font-weight:200 800}
html,body{margin:0;width:1200px;height:630px}
body{background:#f6f8f9;color:#17212b;font-family:S;display:grid;grid-template-columns:300px 1fr;align-items:center;gap:56px;padding:0 80px;box-sizing:border-box;position:relative}
.wires{position:absolute;left:0;right:0;bottom:0;height:18px;display:flex}.wires span{flex:1}
h1{font-size:68px;line-height:1.05;margin:0;letter-spacing:-1.5px;font-weight:750}
p{font-size:30px;line-height:1.35;color:#3a4754;margin:24px 0 0}
.id{font-family:M;font-size:21px;color:#52606d;margin-top:28px}
</style></head><body>
<svg width="300" height="300" viewBox="0 0 32 32"><rect x="1.5" y="3.5" width="29" height="25" rx="3" fill="#fff" stroke="#17212b" stroke-width="1.6"/><rect x="11" y="24" width="10" height="4.5" fill="#17212b"/>${pins.map((c, i) => `<rect x="${5 + i * 2.85}" y="7" width="2" height="13" rx=".5" fill="${c}"/>`).join('')}</svg>
<div><h1>Cisco Packet Tracer Learning Library</h1><p>Original hands-on labs with starter files, step-by-step guides and solution files.</p><div class="id">Independent project, not affiliated with Cisco</div></div>
<div class="wires">${pins.map((c) => `<span style="background:${c}"></span>`).join('')}</div>
</body></html>`;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: `${root}/public/og-default.png` });
await browser.close();
console.log('wrote public/og-default.png');
