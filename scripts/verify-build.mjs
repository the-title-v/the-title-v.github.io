import { readFile, readdir, stat } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import assert from 'node:assert/strict';

const root = resolve('dist/client');
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
for (const path of files.filter(path => /\.(html|js|json|txt|xml)$/.test(path))) {
  const body = await readFile(path, 'utf8');
  assert(!/calendar\/ical\/|AIRBNB_ICAL_|Quorvexis|Tynophael|\bPRIVATE_IDENTITY_PLACEHOLDER\b|\bPRIVATE_IDENTITY_PLACEHOLDER\b/i.test(body), `Private, owner-name or legacy content leaked: ${path}`);
}
const sitemap = await readFile(join(root, 'sitemap.xml'), 'utf8');
assert.equal((sitemap.match(/<loc>/g) || []).length, pages.length, 'Sitemap must include each indexable HTML page');
assert.match(await readFile(join(root, 'robots.txt'), 'utf8'), /Sitemap:/);
assert.match(await readFile(join(root, 'llms.txt'), 'utf8'), /Title V New & Bright/);
console.log(`Verified ${pages.length} unique indexable pages, ${links} internal links/assets, ${imageCount} images, structured data, sitemap and public-bundle privacy.`);
