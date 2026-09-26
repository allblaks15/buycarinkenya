// SEO / indexability audit of dist/. Usage: node scripts/seo-audit.js
import { readdirSync, statSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = join(import.meta.dirname, '..', 'dist');
const SITE = 'https://elisamotors.co.ke';
const pages = [];
const walk = (d) => readdirSync(d).forEach((f) => { const p = join(d, f); statSync(p).isDirectory() ? walk(p) : p.endsWith('.html') && pages.push(p); });
walk(root);

const urlOf = (file) => '/' + file.slice(root.length + 1).replace(/\\/g, '/').replace(/index\.html$/, '');
const sitemap = new Set([...readFileSync(join(root, 'sitemap.xml'), 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]).filter((u) => !u.includes('/assets/')));
const issues = []; const titles = new Map(); const descs = new Map(); const inbound = new Map();
let imgCount = 0, altMissing = 0, imgTitle = 0, brokenImg = new Set(), brokenLinks = new Set();

for (const f of pages) {
  const url = urlOf(f); const h = readFileSync(f, 'utf8');
  if (url === '/404.html') continue;
  const title = h.match(/<title>(.*?)<\/title>/)?.[1];
  const desc = h.match(/name="description" content="(.*?)"/)?.[1];
  const canon = h.match(/rel="canonical" href="(.*?)"/)?.[1];
  const robots = h.match(/name="robots" content="(.*?)"/)?.[1] || '';
  if (!title) issues.push(`${url}: no title`);
  if (!desc) issues.push(`${url}: no description`);
  if (canon !== SITE + url) issues.push(`${url}: canonical mismatch ${canon}`);
  if (/noindex/.test(robots)) issues.push(`${url}: noindex`);
  if (!sitemap.has(SITE + url)) issues.push(`${url}: missing from sitemap.xml`);
  if ((h.match(/<h1[\s>]/g) || []).length !== 1) issues.push(`${url}: ${(h.match(/<h1[\s>]/g) || []).length} h1 tags`);
  titles.set(title, [...(titles.get(title) || []), url]);
  descs.set(desc, [...(descs.get(desc) || []), url]);
  for (const m of h.matchAll(/<img\s[^>]*>/g)) {
    imgCount++;
    const alt = m[0].match(/alt="([^"]*)"/)?.[1];
    if (!alt) altMissing++;
    if (/title="/.test(m[0])) imgTitle++;
    const src = m[0].match(/src="([^"]+)"/)?.[1];
    if (src?.startsWith('/') && !existsSync(join(root, src))) brokenImg.add(src);
  }
  for (const m of h.matchAll(/href="(\/[^"#?]*)/g)) {
    const t = m[1]; if (t === url) continue;
    inbound.set(t, (inbound.get(t) || 0) + 1);
    const file = join(root, t, t.endsWith('/') ? 'index.html' : '');
    if (!existsSync(file)) brokenLinks.add(t);
  }
}
const orphans = [...sitemap].map((u) => u.replace(SITE, '')).filter((u) => u !== '/' && !inbound.get(u));
const dupT = [...titles].filter(([, u]) => u.length > 1);
const dupD = [...descs].filter(([, u]) => u.length > 1);
console.log(`Pages: ${pages.length - 1} | sitemap URLs: ${sitemap.size}`);
console.log(`Images: ${imgCount}, missing alt: ${altMissing}, with title attr: ${imgTitle}, broken image src: ${brokenImg.size}`);
console.log(`Broken internal links: ${brokenLinks.size} ${[...brokenLinks].slice(0, 5)}`);
console.log(`Orphan pages (no internal links in): ${orphans.length} ${orphans.slice(0, 5)}`);
console.log(`Duplicate titles: ${dupT.length} ${dupT.slice(0, 3).map(([t, u]) => `${t} -> ${u}`)}`);
console.log(`Duplicate descriptions: ${dupD.length}`);
console.log(`Other issues: ${issues.length}`); issues.slice(0, 15).forEach((i) => console.log('  ' + i));
