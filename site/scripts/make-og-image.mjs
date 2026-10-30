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
const font = (p) => fs.readFileSync(new URL(`../node_modules/${p}`, import.meta.url)).toString('base64');
const sans = font('@fontsource-variable/instrument-sans/files/instrument-sans-latin-wdth-normal.woff2');
const mono = font('@fontsource/dm-mono/files/dm-mono-latin-400-normal.woff2');
const html = `<!doctype html><html><head><style>
@font-face{font-family:S;src:url(data:font/woff2;base64,${sans}) format('woff2');font-weight:400 700;font-stretch:75% 100%}
@font-face{font-family:M;src:url(data:font/woff2;base64,${mono}) format('woff2');font-weight:400}
html,body{margin:0;width:1200px;height:630px}
body{background:#fbfaf7;color:#16181d;font-family:S;box-sizing:border-box;padding:84px 88px;position:relative;overflow:hidden;
  background-image:radial-gradient(circle,#e7e3da 1.4px,transparent 1.7px);background-size:24px 24px}
.brand{display:flex;align-items:center;gap:16px;font-size:34px;font-weight:700;letter-spacing:-1px}
.logo{width:52px;height:52px;border-radius:14px;background:#16181d;display:flex;align-items:center;justify-content:center}
.dot{width:16px;height:16px;border-radius:50%;background:#3ccf7a;box-shadow:0 0 0 5px rgba(60,207,122,.25)}
h1{margin:64px 0 0;font-size:76px;line-height:1.02;letter-spacing:-3.4px;font-weight:700;font-stretch:92%;max-width:960px}
.tag{display:inline-block;margin-top:40px;font-family:M;font-size:24px;padding:6px 14px;border-radius:8px;background:#e6f8ee;color:#137a3f}
.note{position:absolute;left:88px;bottom:56px;font-family:M;font-size:20px;color:#6b7079}
</style></head><body>
<div class="brand"><span class="logo"><span class="dot"></span></span>itnetworking</div>
<h1>Learn networking by configuring real topologies.</h1>
<span class="tag">S1(config-if)# no shutdown</span>
<div class="note">Packet Tracer labs and networking tools. Independent project, not affiliated with Cisco.</div>
</body></html>`;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: `${root}/public/og-default.png` });
await browser.close();
console.log('wrote public/og-default.png');
