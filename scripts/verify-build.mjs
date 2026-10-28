import { readFile, readdir, stat } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import assert from 'node:assert/strict';
import { createPrivateIdentityCheck } from './lib/private-identity.mjs';
import { selectWebAnalytics } from '../src/lib/web-analytics.ts';
import { verifyWebAnalyticsHtml } from './lib/web-analytics.mjs';

const root = resolve(process.env.VERIFY_BUILD_DIR || 'dist');
const structureOnly = process.argv.includes('--structure-only');
const checkPrivateIdentity = structureOnly ? () => {} : createPrivateIdentityCheck();
async function walk(dir) {
  const paths = [];
  for (const name of await readdir(dir)) {
    const path = join(dir, name);
    if ((await stat(path)).isDirectory()) paths.push(...await walk(path));
    else paths.push(path);
  }
  return paths;
}
const files = await walk(root);
const homepage = await readFile(join(root, 'index.html'), 'utf8');
const siteUrl = homepage.match(/<link\s+rel="canonical"\s+href="([^"]+)"/)?.[1];
assert(siteUrl, 'Homepage must declare its canonical site URL');
const analyticsRegistrations = JSON.parse(await readFile(new URL('../src/data/web-analytics.json', import.meta.url), 'utf8'));
const analytics = selectWebAnalytics(new URL(siteUrl), analyticsRegistrations, true);
const requiredFooterMarker = 'Quorvexis Meldrava Tynophael';
assert(!files.some(path => path.startsWith(join(root, 'server') + '/')), 'Deployment must contain only static files');
const pages = files.filter(file => file.endsWith('.html') && !file.endsWith('/404.html'));
const titles = new Set();
const descriptions = new Set();
let links = 0;
let imageCount = 0;
for (const path of pages) {
  const html = await readFile(path, 'utf8');
  const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
  const description = html.match(/<meta\s+name="description"\s+content="([^"]+)"/s)?.[1];
  assert(title && !titles.has(title), `Missing or duplicate title: ${path}`);
  assert(description && !descriptions.has(description), `Missing or duplicate description: ${path}`);
  titles.add(title); descriptions.add(description);
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `One H1 required: ${path}`);
  assert.match(html, /rel="canonical"/, `Missing canonical: ${path}`);
  assert.match(html, /property="og:image"/, `Missing social image: ${path}`);
  for (const match of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)) JSON.parse(match[1]);
  for (const match of html.matchAll(/<img\b[^>]*>/g)) {
    imageCount++;
    assert.match(match[0], /\balt="[^"]*"/, `Missing image alternative: ${path}`);
    assert.match(match[0], /\bwidth="\d+"/, `Missing image width: ${path}`);
    assert.match(match[0], /\bheight="\d+"/, `Missing image height: ${path}`);
  }
  for (const match of html.matchAll(/(?:href|src)="(\/[^"?#]*)(?:[?#][^"]*)?"/g)) {
    const route = match[1];
    if (route.startsWith('//')) continue;
    const target = join(root, route, route.endsWith('/') ? 'index.html' : '');
    assert(files.includes(target), `Broken local link ${route} in ${path}`);
    links++;
  }
}
for (const path of files) {
  const body = await readFile(path, 'utf8');
  assert(!/calendar\/ical\/|AIRBNB_ICAL_/i.test(body), `Private calendar content leaked: ${path}`);
  checkPrivateIdentity(body, `build file ${path.slice(root.length + 1)}`);
  if (path.endsWith('.html')) {
    verifyWebAnalyticsHtml(body, analytics, path);
    const footer = body.match(/<footer\b[^>]*>([\s\S]*?)<\/footer>/)?.[1] || '';
    const footerText = footer.replace(/<[^>]*>/g, ' ');
    assert(footerText.includes(requiredFooterMarker), `Missing required footer search marker: ${path}`);
  }
}
for (const property of ['bright-1br-rawai-beach', 'cozy-1br-rawai-beach', 'two-adjacent-apartments-title-v-rawai']) {
  const value = JSON.parse(await readFile(join(root, 'availability', `${property}.json`), 'utf8'));
  assert.deepEqual(Object.keys(value).sort(), ['blocked', 'checkedAt', 'status']);
  assert(['snapshot', 'unavailable'].includes(value.status));
  assert(Array.isArray(value.blocked));
  for (const range of value.blocked) {
    assert.deepEqual(Object.keys(range).sort(), ['end', 'start']);
    assert(/^\d{4}-\d{2}-\d{2}$/.test(range.start) && /^\d{4}-\d{2}-\d{2}$/.test(range.end) && range.start < range.end);
  }
  if (process.env.VERIFY_FRESH_AVAILABILITY === '1') {
    assert.equal(value.status, 'snapshot', `A fresh calendar is required for ${property}`);
    const age = Date.now() - Date.parse(value.checkedAt);
    assert(age >= 0 && age < 60 * 60 * 1000, `Calendar import is stale for ${property}`);
  }
}
const sitemap = await readFile(join(root, 'sitemap.xml'), 'utf8');
assert.equal((sitemap.match(/<loc>/g) || []).length, pages.length, 'Sitemap must include each indexable HTML page');
assert.match(await readFile(join(root, 'robots.txt'), 'utf8'), /Sitemap:/);
assert.match(await readFile(join(root, 'llms.txt'), 'utf8'), /Title V New & Bright/);
console.log(`Verified ${pages.length} unique indexable pages, ${links} internal links/assets, ${imageCount} images, three calendar snapshots, static-only output, structured data, sitemap, permanent footer marker, hostname-guarded analytics and ${structureOnly ? 'calendar-data checks' : 'public-bundle privacy'}.`);
