/**
 * Visual check: screenshots of key pages (desktop + mobile), full height.
 * Usage: start `npm run preview` (port 4399) then `node scripts/screenshots.mjs <outDir>`.
 * Scrolls through each page first so scroll-triggered reveals have played.
 */
import { chromium } from 'playwright';

const base = process.env.BASE_URL || 'http://localhost:4399';
const out = process.argv[2] || 'screenshots';
const pages = (process.env.PAGES || '/,/work/,/blog/,/contact/').split(',');
const viewports = { desktop: { width: 1440, height: 900 }, mobile: { width: 390, height: 844 } };

const browser = await chromium.launch();
for (const [name, viewport] of Object.entries(viewports)) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 1, colorScheme: process.env.SCHEME || 'dark' });
  const page = await ctx.newPage();
  for (const path of pages) {
    await page.goto(base + path, { waitUntil: 'networkidle' });
    // Scroll to the bottom in steps to trigger reveals, then back to top.
    const height = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < height; y += 500) {
      await page.evaluate((top) => window.scrollTo(0, top), y);
      await page.waitForTimeout(120);
    }
    await page.waitForTimeout(1200);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);
    const file = `${out}/${name}${path.replace(/\//g, '_') || '_home'}.png`;
    await page.screenshot({ path: file, fullPage: true });
    console.log(file);
  }
  await ctx.close();
}
await browser.close();
