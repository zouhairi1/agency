/**
 * Seed PocketBase with services, project scoper options, example projects and blog posts.
 * Generates cover images with Playwright. Idempotent: records are matched by slug/key and updated.
 *
 * Usage (PocketBase must be running):
 *   $env:PB_ADMIN_EMAIL="you@example.com"; $env:PB_ADMIN_PASSWORD="..."; node scripts/seed.mjs
 */
import PocketBase from 'pocketbase';
import { chromium } from 'playwright';
import { estimatorOptions, posts, projects, services } from './seed-data.mjs';

const PB_URL = process.env.PUBLIC_PB_URL || 'http://127.0.0.1:8090';
const { PB_ADMIN_EMAIL, PB_ADMIN_PASSWORD } = process.env;
if (!PB_ADMIN_EMAIL || !PB_ADMIN_PASSWORD) {
  console.error('Set PB_ADMIN_EMAIL and PB_ADMIN_PASSWORD (a PocketBase superuser).');
  process.exit(1);
}

const pb = new PocketBase(PB_URL);
pb.autoCancellation(false);
await pb.collection('_superusers').authWithPassword(PB_ADMIN_EMAIL, PB_ADMIN_PASSWORD);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1 });

/** Render an abstract, on-brand cover image (PNG) for a project or post. */
async function cover({ title, label, colors: [a, b] }, variant = 0) {
  const shapes = [
    `<div style="position:absolute;width:900px;height:900px;border-radius:50%;right:-200px;top:-250px;background:radial-gradient(circle at 30% 30%, ${a}, transparent 65%);filter:blur(10px)"></div>
     <div style="position:absolute;width:520px;height:520px;border-radius:50%;left:-120px;bottom:-200px;background:radial-gradient(circle, ${a}55, transparent 70%)"></div>`,
    `<div style="position:absolute;inset:0;background:repeating-linear-gradient(115deg, ${a}22 0 2px, transparent 2px 60px)"></div>
     <div style="position:absolute;width:1100px;height:1100px;border-radius:50%;left:30%;top:-30%;background:radial-gradient(circle, ${a}, transparent 60%);opacity:.75"></div>`,
    `<div style="position:absolute;width:700px;height:700px;right:120px;top:150px;border:2px solid ${a};border-radius:50%;opacity:.5"></div>
     <div style="position:absolute;width:480px;height:480px;right:230px;top:260px;background:${a};border-radius:50%;filter:blur(90px);opacity:.8"></div>`,
  ][variant % 3];
  await page.setContent(`<!doctype html><html><body style="margin:0">
    <div style="position:relative;width:1600px;height:1000px;overflow:hidden;background:linear-gradient(135deg, ${b}, #0a0a0a);font-family:'Segoe UI',Helvetica,Arial,sans-serif">
      ${shapes}
      <div style="position:absolute;inset:0;background:url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22/></filter><rect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22 opacity=%220.08%22/></svg>')"></div>
      <!-- No title on the image: cards crop covers and already show the title as text. -->
      <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);color:#f4f2ee;font-size:26px;letter-spacing:.3em;text-transform:uppercase;opacity:.55;white-space:nowrap" aria-label="${title}">${label}</div>
    </div></body></html>`);
  return new Blob([await page.screenshot({ type: 'png' })], { type: 'image/png' });
}

async function upsert(collection, filter, data) {
  try {
    const existing = await pb.collection(collection).getFirstListItem(filter);
    return pb.collection(collection).update(existing.id, data);
  } catch (error) {
    if (error.status !== 404) throw error;
    return pb.collection(collection).create(data);
  }
}

// Services
for (const s of services) await upsert('services', `slug="${s.slug}"`, s);
console.log(`✓ ${services.length} services`);

// Project scoper options (duration only)
for (const { key, ...o } of estimatorOptions) {
  await upsert('estimator_options', `group="${o.group}" && order=${o.order}`, o);
}
console.log(`✓ ${estimatorOptions.length} scoper options`);

// Example projects with generated covers
for (const [i, { colors, ...proj }] of projects.entries()) {
  const form = new FormData();
  for (const [k, v] of Object.entries({ published: true, ...proj })) {
    form.append(k, Array.isArray(v) || typeof v === 'object' ? JSON.stringify(v) : String(v));
  }
  form.delete('category');
  for (const c of proj.category) form.append('category', c);
  form.append('cover', await cover({ title: proj.title, label: proj.industry, colors }, i), `${proj.slug}.png`);
  await upsert('projects', `slug="${proj.slug}"`, form);
}
console.log(`✓ ${projects.length} projects`);

// Blog posts with generated covers
const categoryLabel = { business: 'Business', engineering: 'Développement', design: 'Design' };
for (const [i, { colors, ...post }] of posts.entries()) {
  const form = new FormData();
  for (const [k, v] of Object.entries({ ...post, published: true })) form.append(k, String(v).trim());
  form.append('cover', await cover({ title: post.title, label: `Blog · ${categoryLabel[post.category] ?? post.category}`, colors }, i + 1), `${post.slug}.png`);
  await upsert('posts', `slug="${post.slug}"`, form);
}
console.log(`✓ ${posts.length} blog posts`);

await browser.close();
console.log('Done. Restart `npm run dev` (or rebuild) to see the content.');
