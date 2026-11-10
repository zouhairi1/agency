/**
 * Mobile audit: for each page × viewport, reports horizontal overflow, small tap targets and tiny text,
 * and saves a full-page screenshot.
 * Usage: preview running on :4399, then `node scripts/mobile-audit.mjs <outDir>`
 */
import { chromium } from 'playwright';

const base = process.env.BASE_URL || 'http://localhost:4399';
const out = process.argv[2] || 'audit';
const pages = (process.env.PAGES ||
  '/,/work/,/work/riad-booking/,/blog/,/blog/pourquoi-un-cahier-des-charges/,/contact/,/en/,/404').split(',');
const widths = (process.env.WIDTHS || '360,390,768').split(',').map(Number);

const browser = await chromium.launch();
for (const width of widths) {
  const ctx = await browser.newContext({ viewport: { width, height: 800 }, deviceScaleFactor: 1, colorScheme: process.env.SCHEME || 'dark', hasTouch: true, isMobile: width < 768 });
  const page = await ctx.newPage();
  for (const path of pages) {
    await page.goto(base + path, { waitUntil: 'networkidle' });
    const h = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < h; y += 600) {
      await page.evaluate((t) => window.scrollTo(0, t), y);
      await page.waitForTimeout(80);
    }
    await page.waitForTimeout(800);
    const report = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      const describe = (el) => `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}.${[...el.classList].slice(0, 3).join('.')} "${(el.textContent || '').trim().slice(0, 30)}"`;
      const visible = (el) => { const s = getComputedStyle(el); const r = el.getBoundingClientRect(); return s.visibility !== 'hidden' && s.display !== 'none' && r.width > 0 && r.height > 0; };
      const overflow = [];
      for (const el of document.querySelectorAll('body *')) {
        if (!visible(el) || el.closest('[aria-hidden="true"], svg, [data-menu], .sr-only')) continue;
        const r = el.getBoundingClientRect();
        if (r.right > vw + 1 || r.left < -1) {
          // skip elements inside an ancestor that clips them (overflow hidden/clip)
          let p = el.parentElement, clipped = false;
          while (p && p !== document.body) { const o = getComputedStyle(p).overflowX; if (o === 'hidden' || o === 'clip' || o === 'auto' || o === 'scroll') { clipped = true; break; } p = p.parentElement; }
          if (!clipped) overflow.push(`${describe(el)} [${Math.round(r.left)}→${Math.round(r.right)}]`);
        }
      }
      const small = [];
      for (const el of document.querySelectorAll('a, button, input, textarea, [role="button"]')) {
        if (!visible(el) || el.closest('.sr-only, footer p, .prose-post, .prose-case')) continue;
        const r = el.getBoundingClientRect();
        if (r.height < 36 && !(el.tagName === 'A' && getComputedStyle(el).display === 'inline')) small.push(`${describe(el)} ${Math.round(r.width)}×${Math.round(r.height)}`);
      }
      const tiny = new Set();
      for (const el of document.querySelectorAll('p, span, a, li, button, label, h1, h2, h3, dt, dd')) {
        if (!visible(el) || !el.textContent.trim() || el.closest('[aria-hidden="true"]')) continue;
        const fs = parseFloat(getComputedStyle(el).fontSize);
        if (fs < 12) tiny.add(`${describe(el)} ${fs}px`);
      }
      return { pageWidth: document.documentElement.scrollWidth, vw, overflow: overflow.slice(0, 8), small: small.slice(0, 10), tiny: [...tiny].slice(0, 6) };
    });
    const name = `${width}${path.replace(/\//g, '_') || '_home'}`;
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: `${out}/${name}.png`, fullPage: true });
    const flag = report.pageWidth > report.vw ? `⚠ PAGE SCROLLS SIDEWAYS (${report.pageWidth}px > ${report.vw}px)` : 'ok width';
    console.log(`\n[${width}] ${path}  ${flag}`);
    if (report.overflow.length) console.log('  overflow:', report.overflow.join('\n            '));
    if (report.small.length) console.log('  small tap targets:', report.small.join('\n                     '));
    if (report.tiny.length) console.log('  tiny text:', report.tiny.join(' | '));
  }
  await ctx.close();
}
await browser.close();
