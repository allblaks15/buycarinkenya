// Elisa Motors static site generator.  Run: npm run build  →  outputs ./dist (upload its contents to public_html)
import { mkdir, writeFile, readFile, cp, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { site } from './config.js';
import { cars, slugify } from './data/cars.js';
import { makeRenderCar } from './render-car.js';
import { blogPosts, CLUSTERS } from './data/blog/index.js';
import { readdir, rename } from 'node:fs/promises';

const SRC = import.meta.dirname;
const OUT = join(SRC, '..', 'dist');
const credits = existsSync(join(SRC, 'data', 'image-credits.json')) ? JSON.parse(await readFile(join(SRC, 'data', 'image-credits.json'), 'utf8')) : {};
const today = new Date().toISOString().slice(0, 10);
const YEAR = new Date().getFullYear();
const MIN_YEAR = YEAR - 7; // KEBS 8-year rule

// ---------------------------------------------------------------- helpers
const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const M = (n) => 'KES ' + (n >= 10 ? n.toFixed(1) : n.toFixed(2)).replace(/\.?0+$/, '') + 'M';
const range = (a, b) => `${M(a)} – ${M(b).replace('KES ', '')}`;
const abs = (p) => site.url + p;
const plural = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`;
const listJoin = (arr) => arr.length < 2 ? arr.join('') : arr.slice(0, -1).join(', ') + ' and ' + arr.at(-1);
const fit = (...opts) => opts.find((t) => t.length <= 65) || opts.at(-1);
const clip = (d, n = 160) => d.length <= n ? d : d.slice(0, d.lastIndexOf(' ', n - 1)).replace(/[,.:;]$/, '') + '…';
const waLink = (text) => `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
const imgs = (slug) => (credits[slug] || []).filter((c) => existsSync(join(SRC, 'assets', 'img', 'cars', c.file)));
// Published image names carry keywords, e.g. toyota-land-cruiser-prado-for-sale-kenya-1.webp
const pub = (file) => file.replace(/-(\d+)(-sm)?\.webp$/, '-for-sale-kenya-$1$2.webp');
const mainImg = (slug, sm = false) => { const i = imgs(slug)[0]; return i ? `/assets/img/cars/${pub(sm ? i.file.replace('.webp', '-sm.webp') : i.file)}` : '/assets/img/placeholder-car.svg'; };
const cc = (v) => v.cc ? `${(v.cc / 1000).toFixed(1)}L (${v.cc.toLocaleString('en')} cc)` : 'Electric motor';
const kmL = (v) => parseFloat(v.economy) * (v.economy.includes('km/L') ? 1 : 0);

const BODIES = {
  SUV: { slug: 'suv', plural: 'SUVs', desc: 'High ground clearance, space and 4WD options, ideal for Kenyan roads, murram and upcountry trips.' },
  Sedan: { slug: 'sedan', plural: 'Sedans', desc: 'Comfortable, economical saloons for daily commuting and executive use.' },
  Hatchback: { slug: 'hatchback', plural: 'Hatchbacks', desc: 'Affordable, fuel-efficient compact cars that are perfect for town and a first car.' },
  'Station Wagon': { slug: 'station-wagon', plural: 'Station Wagons', desc: 'Big boots and sedan comfort for families, farmers and small businesses.' },
  MPV: { slug: 'mpv', plural: 'MPVs & 7–8 Seaters', desc: 'People carriers with sliding doors and 7–8 seats for families, schools and shuttles.' },
  Pickup: { slug: 'pickup', plural: 'Pickups & Double Cabs', desc: 'Tough bakkies for work, farm and adventure, from single cabs to luxury double cabs.' },
  Van: { slug: 'van', plural: 'Vans & Commercial', desc: 'Workhorses for deliveries, matatu, tours and staff transport.' },
  Truck: { slug: 'truck', plural: 'Light Trucks', desc: 'Light trucks for transport, distribution and agribusiness.' },
  Bus: { slug: 'bus', plural: 'Buses & Minibuses', desc: 'Minibuses for schools, churches, tours and staff transport.' },
  'Sports Car': { slug: 'sports-car', plural: 'Sports Cars & Coupes', desc: 'Coupes, convertibles and performance cars, from the Toyota GR86 to the Porsche 911.' },
};
const FUELS = {
  Petrol: { slug: 'petrol', desc: 'Petrol cars are simple, smooth and cheaper to buy. Mechanics and parts are available everywhere in Kenya.' },
  Diesel: { slug: 'diesel', desc: 'Diesel engines give strong torque and long range, making them ideal for heavy SUVs, pickups and long-distance driving.' },
  Hybrid: { slug: 'hybrid', desc: 'Hybrids combine petrol and electric power for 25–35 km/L fuel economy, the smartest choice with today\'s fuel prices.' },
  Electric: { slug: 'electric', desc: 'Fully electric cars mean zero fuel costs and very low maintenance. Charge at home overnight.' },
};
const ORIGINS = {
  Japan: { slug: 'japan', code: 'JP', port: 'Yokohama / Nagoya / Kobe', transit: '4–6 weeks', title: 'Import Cars from Japan to Kenya',
    intro: 'Japan is Kenya\'s number one source of used cars. Japanese cars are right-hand drive, well maintained, low mileage and sold through transparent auctions with graded inspection sheets.',
    points: ['Access to major auctions and exporters, with thousands of cars every week', 'Auction sheet grades (4, 4.5, 5) show the true condition before you buy', 'Low average mileage and strict Japanese maintenance culture', 'KEBS-appointed pre-shipment inspection in Japan', 'Roll-on/roll-off shipping direct to Mombasa'] },
  UK: { slug: 'uk', code: 'UK', port: 'Southampton / Bristol', transit: '5–7 weeks', title: 'Import Cars from the UK to Kenya',
    intro: 'The UK is the best source for right-hand-drive European cars such as Range Rover, Mercedes-Benz, BMW, Audi and Volkswagen. UK cars come with full service history and MOT records.',
    points: ['Right-hand drive, just like Kenya', 'Full dealer service history and MOT records you can verify', 'Best source for Land Rover, Mercedes, BMW, Audi and VW', 'UK spec cars often come with higher trim levels', 'Pre-shipment inspection before loading'] },
  'South Africa': { slug: 'south-africa', code: 'ZA', port: 'Durban', transit: '2–4 weeks', title: 'Import Cars from South Africa to Kenya',
    intro: 'South Africa is the quickest route for tough, African-spec vehicles, especially pickups (bakkies) and SUVs such as the Hilux, Ranger, Fortuner and Pajero Sport, built for our roads and fuel.',
    points: ['Fastest shipping to Mombasa of all our source markets', 'African-spec vehicles with suspension and fuel systems suited to local conditions', 'Excellent source for Hilux, Ranger, Fortuner, D-Max and Amarok', 'Right-hand drive', 'Pre-shipment inspection before loading'] },
};
const MAKES = [...new Set(cars.map((c) => c.make))];
const posts = blogPosts({ cars, site, YEAR, MIN_YEAR, M, range, esc }).sort((a, b) => b.published.localeCompare(a.published));

// ---------------------------------------------------------------- icons
const I = {
  wa: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.4-.5c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3zM12 21.8c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4A9.8 9.8 0 0 1 2.2 12C2.2 6.6 6.6 2.2 12 2.2c2.6 0 5.1 1 6.9 2.9a9.7 9.7 0 0 1 2.9 6.9c0 5.4-4.4 9.8-9.8 9.8zm8.4-18.2A11.8 11.8 0 0 0 12 0C5.5 0 .2 5.3.2 11.9c0 2.1.5 4.1 1.6 5.9L0 24l6.3-1.7c1.7.9 3.7 1.4 5.7 1.4 6.5 0 11.9-5.3 11.9-11.9 0-3.2-1.2-6.2-3.5-8.4z"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  filter: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 6h16M7 12h10M10 18h4"/></svg>',
  car: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 17H3v-5l2-5h14l2 5v5h-2M7 17h10"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>',
  logo: '<svg viewBox="0 0 40 40" aria-hidden="true"><rect width="40" height="40" rx="10" fill="#0e2a3a"/><path d="M13 11h14M13 20h10M13 29h14M13 11v18" stroke="#fff" stroke-width="4" stroke-linecap="round"/><circle cx="29" cy="20" r="3" fill="#e0561a"/></svg>',
};
const BODY_PATH = {
  Hatchback: 'M5 22v-5l10-2 9-7h14l9 8 11 2v4z', Sedan: 'M3 22v-4l10-2 9-7h16l10 7 13 2v4z', SUV: 'M4 22V12l6-1 6-6h28l8 6 8 2v9z',
  'Station Wagon': 'M3 22v-5l10-2 8-7h28l10 7 2 3v4z', Pickup: 'M3 22V13l7-1 5-6h16v7h29v9z', MPV: 'M4 22V11l10-6h36l8 7 3 4v6z',
  Van: 'M4 22V7l3-3h40l9 9 4 2v7z', Truck: 'M4 22V6h32v16M36 11h14l8 7v4H36', Bus: 'M3 22V5h54l4 6v11zM9 9h8v5H9zM21 9h8v5h-8zM33 9h8v5h-8z', 'Sports Car': 'M3 22v-3l12-3 10-6h14l12 7 10 2v3z',
};
const bodyIcon = (b) => `<svg viewBox="0 0 64 30" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="${BODY_PATH[b]}"/><circle cx="16" cy="23" r="4.5" fill="#fff"/><circle cx="48" cy="23" r="4.5" fill="#fff"/></svg>`;

// ---------------------------------------------------------------- layout
const sitemap = [];
const navLinks = [['/cars/', 'Browse Cars'], ['/import-from/japan/', 'From Japan'], ['/import-from/uk/', 'From UK'], ['/import-from/south-africa/', 'From South Africa'], ['/how-to-import-a-car-to-kenya/', 'How It Works'], ['/blog/', 'Blog']];

function layout({ path, title, description, body, jsonld = [], image, bar = 'global', noindex = false, priority = 0.6, preload, images = [] }) {
  if (!noindex) sitemap.push({ path, priority, images });
  const ogImg = abs(image || mainImg('toyota-land-cruiser-prado'));
  const org = { '@context': 'https://schema.org', '@type': 'AutoDealer', '@id': abs('/#dealer'), name: site.name, url: site.url, logo: abs('/assets/img/logo.png'), image: ogImg, telephone: site.phone, email: site.email, priceRange: 'KES 1M – 30M',
    address: { '@type': 'PostalAddress', addressLocality: 'Nairobi', addressCountry: 'KE' }, areaServed: { '@type': 'Country', name: 'Kenya' }, openingHours: 'Mo-Sa 08:00-18:00', sameAs: Object.values(site.social).filter(Boolean) };
  const ld = [org, ...jsonld].map((j) => `<script type="application/ld+json">${JSON.stringify(j).replace(/</g, '\\u003c')}</script>`).join('\n');
  const cur = (p) => (path === p || (p !== '/' && path.startsWith(p)) ? ' aria-current="page"' : '');
  const waGeneral = waLink(`Hi, I am interested in importing a car with ${site.name}.`);
  return `<!doctype html>
<html lang="en-KE">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description = clip(description))}">
<link rel="canonical" href="${abs(path)}">
${noindex ? '<meta name="robots" content="noindex, follow">' : '<meta name="robots" content="index, follow, max-image-preview:large">'}
<meta name="theme-color" content="#0e2a3a">
${site.googleVerification ? `<meta name="google-site-verification" content="${esc(site.googleVerification)}">` : ''}${site.bingVerification ? `<meta name="msvalidate.01" content="${esc(site.bingVerification)}">` : ''}
<meta name="geo.region" content="KE"><meta name="geo.placename" content="Nairobi">
<link rel="alternate" hreflang="en-KE" href="${abs(path)}">
<meta property="og:type" content="website"><meta property="og:site_name" content="${site.name}"><meta property="og:locale" content="en_KE">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${abs(path)}"><meta property="og:image" content="${ogImg}">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(description)}"><meta name="twitter:image" content="${ogImg}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="/assets/img/logo.png"><link rel="manifest" href="/site.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
${preload ? `<link rel="preload" as="image" href="${preload}" fetchpriority="high">` : ''}
<link rel="stylesheet" href="/assets/css/style.css?v=${BUILD}">
${ld}
</head>
<body class="has-bar bar-${bar}">
<a class="skip" href="#main">Skip to content</a>
<div class="topbar"><div class="wrap"><span>Trusted car imports to Kenya <span class="hide-sm">· Japan · UK · South Africa</span></span><span><a href="tel:${site.phone.replace(/\s/g, '')}">${site.phone}</a></span></div></div>
<header class="site"><div class="wrap">
  <a class="logo" href="/" aria-label="${site.name} home">${I.logo}<span>${site.name}<small>Car Imports Kenya</small></span></a>
  <nav class="main" aria-label="Main">${navLinks.map(([h, t]) => `<a href="${h}"${cur(h)}>${t}</a>`).join('')}</nav>
  <a class="btn btn-primary header-cta" href="/import-request/">Request a Car</a>
  <button class="menu-btn" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="drawer" data-open-drawer>${I.menu}</button>
</div></header>
<div class="drawer" id="drawer" aria-hidden="true"><div class="drawer-bg" data-close-drawer></div><nav class="drawer-panel" aria-label="Mobile">
  <button class="icon-btn drawer-close" type="button" aria-label="Close menu" data-close-drawer>${I.close}</button>
  <a href="/">Home</a><a href="/cars/">Browse All Cars</a><a href="/import-request/">Request a Car Import</a><a href="/how-to-import-a-car-to-kenya/">How Importing Works</a><a href="/blog/">Blog & Price Guides</a>
  <div class="label">Import from</div>${Object.entries(ORIGINS).map(([n, o]) => `<a href="/import-from/${o.slug}/">${n}</a>`).join('')}
  <div class="label">Body type</div>${Object.entries(BODIES).map(([, b]) => `<a href="/body-type/${b.slug}/">${b.plural}</a>`).join('')}
  <div class="label">Help</div><a href="/contact/">Contact Us</a><a href="/about/">About Elisa Motors</a>
  <a class="btn btn-wa" href="${waGeneral}" target="_blank" rel="noopener" style="margin-top:14px">${I.wa} Chat on WhatsApp</a>
</nav></div>
<main id="main">
${body}
</main>
<footer class="site"><div class="wrap">
  <div class="foot-grid">
    <div class="foot-brand"><a class="logo" href="/">${I.logo}<span>${site.name}<small>Car Imports Kenya</small></span></a>
      <p>We import quality used and new cars from Japan, the United Kingdom and South Africa for customers across Kenya. You pick the model and exact spec, and we handle sourcing, inspection, shipping, KRA clearing and registration.</p>
      <p>📞 <a href="tel:${site.phone.replace(/\s/g, '')}">${site.phone}</a><br>✉️ <a href="mailto:${site.email}">${site.email}</a><br>📍 ${site.address}<br>🕘 ${site.hours}</p></div>
    <div><h4>Popular imports</h4><ul>${cars.filter((c) => c.popular).slice(0, 8).map((c) => `<li><a href="/cars/${c.slug}/">${c.name}</a></li>`).join('')}</ul></div>
    <div><h4>Browse</h4><ul>${Object.values(BODIES).map((b) => `<li><a href="/body-type/${b.slug}/">${b.plural}</a></li>`).join('')}${Object.values(FUELS).map((f) => `<li><a href="/fuel/${f.slug}/">${f.slug[0].toUpperCase() + f.slug.slice(1)} cars</a></li>`).join('')}</ul></div>
    <div><h4>Elisa Motors</h4><ul><li><a href="/import-request/">Request a car</a></li><li><a href="/how-to-import-a-car-to-kenya/">How to import a car to Kenya</a></li><li><a href="/blog/">Blog & price guides</a></li>${Object.entries(ORIGINS).map(([n, o]) => `<li><a href="/import-from/${o.slug}/">Import from ${n}</a></li>`).join('')}<li><a href="/about/">About us</a></li><li><a href="/contact/">Contact</a></li><li><a href="/privacy/">Privacy</a></li><li><a href="/credits/">Image credits</a></li><li><a href="/sitemap/">Sitemap</a></li></ul></div>
  </div>
  <div class="foot-legal"><span>© ${YEAR} ${site.name}. All rights reserved.</span><span>Prices are indicative landed estimates and are confirmed in your written quote.</span></div>
</div></footer>
${bar === 'global' ? `<div class="action-bar global"><a class="btn btn-primary" href="/import-request/">${I.car} Import with Us</a></div>` : ''}
<a class="import-float" href="/import-request/">${I.car} Import with Us</a>
<script>window.EM=${JSON.stringify({ wa: site.whatsapp, name: site.name, url: site.url })}</script>
<script src="/assets/js/app.js?v=${BUILD}" defer></script>
</body>
</html>`;
}
const BUILD = Date.now().toString(36);

const crumbs = (items) => {
  const ld = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map(([name, p], i) => ({ '@type': 'ListItem', position: i + 1, name, item: abs(p) })) };
  const html = `<nav class="crumbs" aria-label="Breadcrumb">${items.map(([n, p], i) => i < items.length - 1 ? `<a href="${p}">${esc(n)}</a><span aria-hidden="true">›</span>` : `<span aria-current="page">${esc(n)}</span>`).join('')}</nav>`;
  return { html, ld };
};
const faqLd = (qa) => ({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: qa.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a.replace(/<[^>]+>/g, '') } })) });
const faqHtml = (qa) => `<div class="faq">${qa.map(([q, a], i) => `<details${i === 0 ? ' open' : ''}><summary>${esc(q)}</summary><div>${a}</div></details>`).join('')}</div>`;

// ---------------------------------------------------------------- components
function card(c, { eager = false } = {}) {
  const fuelTxt = c.fuels.join(' / ');
  return `<article class="car-card" data-make="${esc(c.make)}" data-body="${esc(c.body)}" data-fuel="${esc(c.fuels.join('|'))}" data-origin="${esc(c.origin.join('|'))}" data-price="${c.priceFrom}" data-seats="${c.seats}" data-drive="${esc(c.drives.join('|'))}" data-name="${esc(c.name.toLowerCase())}" data-pop="${c.popular ? 1 : 0}">
  ${c.popular ? '<span class="badge">Popular in Kenya</span>' : ''}
  <div class="ph"><img src="${mainImg(c.slug, true)}" alt="${esc(`${c.name} ${c.body.toLowerCase()} for sale in Kenya, import from ${listJoin(c.origin)}`)}" title="${esc(`${c.name} price in Kenya`)}" width="600" height="400" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"></div>
  <div class="body">
    <span class="make">${esc(c.make)} · ${esc(c.body)}</span>
    <h3><a href="/cars/${c.slug}/" title="${esc(`${c.name} price & specs in Kenya`)}">${esc(c.name)}</a></h3>
    <div class="specs-mini"><span>${esc(fuelTxt)}</span><span>${c.seats} seats</span><span>${plural(c.variants.length, 'version')}</span><span>${esc(c.years)}</span></div>
    <div class="foot"><div class="price-from"><small>Est. landed from</small><b class="num">${M(c.priceFrom)}</b></div><div class="flags">From ${c.origin.map((o) => ORIGINS[o].code).join(' · ')}</div></div>
  </div>
</article>`;
}
const grid = (list, opts) => `<div class="car-grid">${list.map((c, i) => card(c, { eager: opts?.eager && i < 2 })).join('')}</div>`;
const wordCount = (html) => html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
const readMin = (p) => Math.ceil(wordCount(p.html) / 220);
const fmtDate = (d) => new Date(d + 'T00:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
const postCard = (p) => `<article class="car-card post-card">
  <div class="ph"><img src="${mainImg(p.cars[0], true)}" alt="${esc(p.crumb)}: ${esc(site.name)} guide" title="${esc(p.title)}" width="600" height="400" loading="lazy" decoding="async"></div>
  <div class="body"><span class="make">${esc(p.tag)} · ${readMin(p)} min read</span><h3><a href="/blog/${p.slug}/">${esc(p.crumb)}</a></h3><p class="small muted" style="margin:0">${esc(p.excerpt)}</p></div>
</article>`;
const postGrid = (list) => `<div class="car-grid">${list.map(postCard).join('')}</div>`;

const ctaBand = (h = 'Can\'t find the car you want?', p = 'Tell us the make, model, year and budget. We\'ll source it from Japan, the UK or South Africa and send you a free landed-cost quote.') => `
<section class="block"><div class="wrap"><div class="cta-band"><div><h2>${h}</h2><p>${p}</p></div>
<div class="btns"><a class="btn btn-light" href="/import-request/">Request any car</a><a class="btn btn-wa" href="${waLink(`Hi, I am interested in importing a car with ${site.name}. I'm looking for: `)}" target="_blank" rel="noopener">${I.wa} WhatsApp us</a></div></div></div></section>`;

const stepsList = [
  ['Choose your car', 'Browse our catalogue and pick the exact version, or send us any car you want.'],
  ['Get a free quote', 'We send the full landed price in KES (car, shipping, duty and clearing) with no hidden costs.'],
  ['We source & inspect', 'We find the best unit at auction or from dealers, share photos and inspection reports, and you approve it.'],
  ['Shipping & clearing', 'The car is shipped to Mombasa. We handle KEBS inspection, KRA duty, port and clearing.'],
  ['Drive away', 'Collect in Mombasa or Nairobi, or we deliver to you, fully registered with Kenyan plates.'],
];
const stepsHtml = `<ol class="steps">${stepsList.map(([h, p]) => `<li><h3>${h}</h3><p>${p}</p></li>`).join('')}</ol>`;

const generalFaq = [
  ['How much does it cost to import a car to Kenya?', `The landed cost is made up of the car price (FOB), shipping and insurance to Mombasa, KRA taxes (import duty, excise duty, VAT, IDF and RDL, calculated on KRA's Current Retail Selling Price list), port charges, clearing and registration. Popular models like the Toyota Vitz and Honda Fit land from about ${M(1.0)}, while a Land Cruiser Prado lands from about ${M(6.2)}. We give you one all-inclusive figure in your quote.`],
  ['What is the 8-year rule for importing cars into Kenya?', `KEBS only allows used vehicles that are less than 8 years old from the year of first registration. In ${YEAR} that means cars first registered in ${MIN_YEAR} or later. Every car we import is compliant, and we check the date before you pay.`],
  ['How long does it take to import a car to Kenya?', 'Typically 4–8 weeks from order to collection. South Africa is fastest (about 2–4 weeks shipping), Japan takes about 4–6 weeks and the UK about 5–7 weeks, plus about a week for port clearing and registration.'],
  ['Do I have to pay the full amount upfront?', 'No. Payment terms are agreed in your written quote before we buy anything. You will always know what you are paying for and when.'],
  ['Can I choose the exact version, colour and mileage?', 'Yes. Every car page lists the versions (grades) Kenyans buy most. Pick a version, then tell us your preferred year, colour, mileage and budget, and we will only source cars that match.'],
  ['Are imported cars inspected?', 'Yes. All vehicles go through a KEBS-appointed pre-shipment roadworthiness inspection in the export country. We also share auction sheets and photos with you before purchase.'],
  ['Which is better: Japan, UK or South Africa?', 'Japan is best for affordable Toyota, Nissan, Honda, Mazda and Subaru models and hybrids. The UK is best for Range Rover, Mercedes, BMW, Audi and VW with service history. South Africa is best and fastest for pickups and body-on-frame SUVs like the Hilux, Ranger and Fortuner.'],
];

// ---------------------------------------------------------------- order modal (car pages)
const orderModal = (c) => `
<div class="modal" id="order-modal" aria-hidden="true" role="dialog" aria-modal="true" aria-labelledby="order-title">
  <div class="modal-bg" data-close-modal></div>
  <div class="modal-panel">
    <div class="order-form-wrap">
      <div class="modal-head"><div><div class="step-label">Order this spec</div><h2 id="order-title">${esc(c.name)}</h2></div><button class="icon-btn" type="button" aria-label="Close" data-close-modal>${I.close}</button></div>
      <div class="order-summary"><img src="${mainImg(c.slug, true)}" alt="${esc(c.name)} order" title="Order ${esc(c.name)} from ${site.name}" width="84" height="56"><div><b data-sum-variant></b><span class="small muted num" data-sum-price></span></div></div>
      <form class="stack" id="order-form" novalidate>
        <input type="hidden" name="type" value="Car Order"><input type="hidden" name="car" value="${esc(c.name)}">
        <label class="hp" aria-hidden="true">Website<input name="website" tabindex="-1" autocomplete="off"></label>
        <label class="field"><span>Version / spec</span><select name="variant" id="order-variant">${c.variants.map((v) => `<option value="${esc(v.id)}">${esc(v.name)}: ${range(...v.price)}</option>`).join('')}</select></label>
        <div class="field"><span class="field-label">Import from</span><div class="chips">${c.origin.map((o, i) => `<label class="chip"><input type="radio" name="origin" value="${o}"${i === 0 ? ' checked' : ''}>${o}</label>`).join('')}<label class="chip"><input type="radio" name="origin" value="Best price (any)">Best price</label></div></div>
        <div class="grid-2">
          <label class="field"><span>Preferred year</span><select name="year"><option value="Any">Any (${MIN_YEAR}+)</option>${Array.from({ length: YEAR - MIN_YEAR + 1 }, (_, i) => YEAR - i).map((y) => `<option>${y}</option>`).join('')}</select></label>
          <label class="field"><span>Colour</span><select name="colour"><option>Any</option><option>White / Pearl</option><option>Black</option><option>Silver</option><option>Grey</option><option>Blue</option><option>Red</option><option>Other</option></select></label>
        </div>
        <label class="field"><span>Your name <b class="req">*</b></span><input name="name" autocomplete="name" required></label>
        <div class="grid-2">
          <label class="field"><span>Phone / WhatsApp <b class="req">*</b></span><input name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="07XX XXX XXX" required></label>
          <label class="field"><span>Email <span class="muted small">(optional)</span></span><input name="email" type="email" autocomplete="email" placeholder="you@example.com"></label>
        </div>
        <label class="field"><span>Town / County</span><input name="town" autocomplete="address-level2" placeholder="e.g. Nairobi"></label>
        <label class="field"><span>Anything else? <span class="muted small">(mileage, budget, trade-in…)</span></span><textarea name="notes" rows="3"></textarea></label>
        <p class="error-msg" data-form-error hidden></p>
        <button class="btn btn-wa btn-block" type="submit">${I.wa} Send order via WhatsApp</button>
        <p class="hint" style="text-align:center;margin:0">Your order is also emailed to our sales team. No payment is needed now. We'll reply with a free quote.</p>
      </form>
    </div>
    <div class="success" hidden data-success></div>
  </div>
</div>`;

// ---------------------------------------------------------------- pages
const pages = [];
const add = (path, html) => pages.push({ path, html });

// HOME
{
  const popular = cars.filter((c) => c.popular);
  const bodyCounts = Object.keys(BODIES).map((b) => [b, cars.filter((c) => c.body === b).length]);
  const heroImg = mainImg('toyota-land-cruiser-prado');
  const body = `
<section class="hero">
  <img class="hero-img" src="${heroImg}" alt="Toyota Land Cruiser Prado imported to Kenya from Japan by ${site.name}" title="Import cars from Japan to Kenya" width="1200" height="800" fetchpriority="high">
  <div class="wrap">
    <span class="eyebrow">Japan · United Kingdom · South Africa</span>
    <h1>Import your next car to Kenya, the easy way</h1>
    <p class="lede">Pick a model, choose the exact version and order in minutes on WhatsApp. We source, inspect, ship to Mombasa, clear KRA and hand you the keys, with the landed price agreed upfront.</p>
    <form class="search-card" action="/cars/" method="get" role="search">
      <div class="search-row">
        <div><label for="s-make">Make</label><select id="s-make" name="make"><option value="">Any make</option>${MAKES.map((m) => `<option>${m}</option>`).join('')}</select></div>
        <div><label for="s-body">Body type</label><select id="s-body" name="body"><option value="">Any type</option>${Object.keys(BODIES).map((b) => `<option>${b}</option>`).join('')}</select></div>
      </div>
      <div><label for="s-budget">Budget (landed)</label><select id="s-budget" name="budget"><option value="">Any budget</option><option value="0-1.5">Under KES 1.5M</option><option value="1.5-3">KES 1.5M – 3M</option><option value="3-5">KES 3M – 5M</option><option value="5-10">KES 5M – 10M</option><option value="10-99">Above KES 10M</option></select></div>
      <button class="btn btn-primary" type="submit">${I.car} Find cars</button>
    </form>
    <div class="trust">
      ${['Right-hand drive only', `8-year rule compliant (${MIN_YEAR}+)`, 'KEBS pre-shipment inspection', 'All-inclusive KES quote'].map((t) => `<div>${I.check}<span>${t}</span></div>`).join('')}
    </div>
  </div>
</section>

<section class="block"><div class="wrap">
  <div class="section-head"><div><h2>Shop by body type</h2><p>From fuel-saving hatchbacks to 4x4 SUVs and double cabs.</p></div></div>
  <div class="tiles">${bodyCounts.map(([b, n]) => `<a class="tile" href="/body-type/${BODIES[b].slug}/">${bodyIcon(b)}<b>${BODIES[b].plural.split(' &')[0]}</b><span>${plural(n, 'model')}</span></a>`).join('')}</div>
</div></section>

<section class="block alt"><div class="wrap">
  <div class="section-head"><div><h2>Most imported cars in Kenya</h2><p>Tap any car to see every version, full specs and landed prices, then order the spec you want.</p></div><a class="link-arrow" href="/cars/">View all ${cars.length} models →</a></div>
  ${grid(popular.slice(0, 12))}
</div></section>

<section class="block dark"><div class="wrap">
  <div class="section-head"><div><h2>Where do you want to import from?</h2><p>All three markets drive on the left, just like Kenya.</p></div></div>
  <div class="countries">${Object.entries(ORIGINS).map(([n, o]) => `<a class="country" href="/import-from/${o.slug}/"><span class="flag">${o.code}</span><h3>Import from ${n}</h3><p>${o.intro.split('. ')[0]}.</p><dl><dt>Shipping</dt><dd>${o.transit} to Mombasa</dd><dt>Models</dt><dd>${cars.filter((c) => c.origin.includes(n)).length} in catalogue</dd></dl></a>`).join('')}</div>
</div></section>

<section class="block"><div class="wrap">
  <div class="section-head"><div><h2>Browse by make</h2></div></div>
  <div class="chips">${MAKES.map((m) => `<a class="chip" href="/make/${slugify(m)}/">${m} <span class="count">${cars.filter((c) => c.make === m).length}</span></a>`).join('')}</div>
  <div class="section-head" style="margin-top:28px"><div><h2 style="font-size:1.3rem">Browse by fuel</h2></div></div>
  <div class="chips">${Object.entries(FUELS).map(([f, o]) => `<a class="chip" href="/fuel/${o.slug}/">${f} <span class="count">${cars.filter((c) => c.fuels.includes(f)).length}</span></a>`).join('')}</div>
</div></section>

<section class="block alt"><div class="wrap">
  <div class="section-head"><div><h2>How importing with Elisa Motors works</h2><p>Five simple steps, and we keep you updated on WhatsApp throughout.</p></div><a class="link-arrow" href="/how-to-import-a-car-to-kenya/">Full import guide →</a></div>
  ${stepsHtml}
</div></section>

<section class="block"><div class="wrap">
  <div class="section-head"><div><h2>Car price guides & import tips</h2><p>Honest, up-to-date prices and step-by-step import advice for Kenyan buyers.</p></div><a class="link-arrow" href="/blog/">All guides →</a></div>
  ${postGrid(posts.slice(0, 3))}
</div></section>

${ctaBand()}

<section class="block"><div class="wrap">
  <div class="section-head"><div><h2>Car import FAQs</h2></div></div>
  ${faqHtml(generalFaq)}
</div></section>`;
  add('/', layout({ path: '/', title: `Car Import Kenya: Import from Japan, UK & South Africa | ${site.name}`, description: `Import cars to Kenya from Japan, the UK and South Africa. Browse ${cars.length}+ models, compare versions and specs, see landed prices in KES and order on WhatsApp. KEBS compliant.`, body, priority: 1.0, preload: heroImg,
    jsonld: [faqLd(generalFaq), { '@context': 'https://schema.org', '@type': 'WebSite', name: site.name, url: site.url, potentialAction: { '@type': 'SearchAction', target: abs('/cars/?q={search_term_string}'), 'query-input': 'required name=search_term_string' } }] }));
}

// ALL CARS (filterable)
function listingPage({ path, h1, intro, list, crumbsArr, title, description, extra = '', filters = true, faq }) {
  const cr = crumbs(crumbsArr);
  const count = (key, val) => list.filter((c) => (Array.isArray(c[key]) ? c[key].includes(val) : c[key] === val)).length;
  const fset = (legend, name, values, key) => {
    const vals = values.filter((v) => count(key, v) > 0);
    if (vals.length < 2) return '';
    return `<fieldset><legend>${legend}</legend><div class="chips">${vals.map((v) => `<label class="chip"><input type="checkbox" name="${name}" value="${esc(v)}">${esc(v)} <span class="count">${count(key, v)}</span></label>`).join('')}</div></fieldset>`;
  };
  const filterHtml = filters ? `
  <div class="filter-toggle"><button class="btn btn-dark" type="button" data-toggle-filters aria-expanded="false" aria-controls="filters">${I.filter} Filter & sort <span data-active-count></span></button></div>
  <form class="filters" id="filters" data-filters>
    <label class="field"><span>Search</span><input type="search" name="q" placeholder="e.g. Prado, Fielder, hybrid…" autocomplete="off"></label>
    ${fset('Make', 'make', MAKES, 'make')}
    ${fset('Body type', 'body', Object.keys(BODIES), 'body')}
    ${fset('Fuel', 'fuel', Object.keys(FUELS), 'fuels')}
    ${fset('Import from', 'origin', Object.keys(ORIGINS), 'origin')}
    <fieldset><legend>Budget (landed)</legend><select name="budget"><option value="">Any budget</option><option value="0-1.5">Under KES 1.5M</option><option value="1.5-3">KES 1.5M – 3M</option><option value="3-5">KES 3M – 5M</option><option value="5-10">KES 5M – 10M</option><option value="10-99">Above KES 10M</option></select></fieldset>
    <fieldset><legend>More</legend><div class="chips"><label class="chip"><input type="checkbox" name="seven" value="1">7+ seats</label><label class="chip"><input type="checkbox" name="awd" value="1">4WD / AWD</label></div></fieldset>
    <button class="btn btn-ghost" type="reset">Clear filters</button>
  </form>` : '';
  const body = `<div class="wrap">${cr.html}
  <header class="page-head"><h1>${h1}</h1>${intro}</header>
  <div class="${filters ? 'listing' : ''}">
    ${filterHtml}
    <div>
      ${filters ? `<div class="results-bar"><span class="muted"><b class="num" data-result-count>${list.length}</b> models</span><label><span class="sr-only">Sort</span><select data-sort><option value="pop">Most popular</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option><option value="name">Name A–Z</option></select></label></div>` : ''}
      ${grid(list, { eager: true })}
      <div class="empty" data-empty hidden><h3>No cars match those filters</h3><p class="muted">We can still import it for you. Just tell us what you need.</p><a class="btn btn-primary" href="/import-request/">Request any car</a></div>
    </div>
  </div>
  ${extra}
  ${faq ? `<section class="block" style="padding-top:8px"><h2>Frequently asked questions</h2>${faqHtml(faq)}</section>` : ''}
  </div>${ctaBand()}`;
  const itemList = { '@context': 'https://schema.org', '@type': 'ItemList', itemListElement: list.map((c, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(`/cars/${c.slug}/`), name: c.name })) };
  add(path, layout({ path, title, description, body, jsonld: [cr.ld, itemList, ...(faq ? [faqLd(faq)] : [])], priority: 0.8 }));
}

listingPage({
  path: '/cars/', h1: 'Cars to import to Kenya', crumbsArr: [['Home', '/'], ['All cars', '/cars/']],
  intro: `<p>Browse ${cars.length} of the most popular models Kenyans import from Japan, the UK and South Africa. Filter by make, body type, fuel and budget, then open any car to compare versions and order the exact spec.</p>`,
  list: [...cars].sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0)),
  title: `Cars for Import to Kenya: ${cars.length}+ Models, Prices & Specs | ${site.name}`,
  description: `Compare ${cars.length}+ cars you can import to Kenya: Toyota, Nissan, Mazda, Honda, Subaru, Mercedes, Land Rover and more. Filter by body type, fuel and budget. Landed prices in KES.`,
});

// MAKE pages
for (const m of MAKES) {
  const list = cars.filter((c) => c.make === m);
  const s = slugify(m);
  listingPage({
    path: `/make/${s}/`, h1: `Import ${m} cars to Kenya`, crumbsArr: [['Home', '/'], ['All cars', '/cars/'], [m, `/make/${s}/`]], filters: list.length > 6,
    intro: `<p>We import ${plural(list.length, `${m} model`)} to Kenya, including the ${listJoin(list.slice(0, 4).map((c) => c.model))}. Landed prices start from about <b>${M(Math.min(...list.map((c) => c.priceFrom)))}</b>. Choose a model below to see every version, full specifications and order your preferred spec.</p>`,
    list, title: fit(`${m} Cars for Import to Kenya: Prices & Specs | ${site.name}`, `${m} Cars for Import to Kenya | ${site.name}`),
    description: `Import ${m} cars to Kenya: ${list.slice(0, 5).map((c) => c.model).join(', ')} and more. Compare versions, specs and landed prices in KES. Order on WhatsApp.`,
  });
}
// BODY pages
for (const [b, info] of Object.entries(BODIES)) {
  const list = cars.filter((c) => c.body === b);
  listingPage({
    path: `/body-type/${info.slug}/`, h1: `${info.plural} for import to Kenya`, crumbsArr: [['Home', '/'], ['All cars', '/cars/'], [info.plural, `/body-type/${info.slug}/`]], filters: list.length > 6,
    intro: `<p>${info.desc} Browse ${plural(list.length, 'model')} available from ${listJoin([...new Set(list.flatMap((c) => c.origin))])}, with landed prices from <b>${M(Math.min(...list.map((c) => c.priceFrom)))}</b>.</p>`,
    list, title: fit(`${info.plural} for Import to Kenya: Prices & Specs | ${site.name}`, `${info.plural} for Import to Kenya | ${site.name}`),
    description: `Import ${info.plural.toLowerCase()} to Kenya: ${list.slice(0, 5).map((c) => c.name).join(', ')} and more. Compare specs and KES landed prices.`,
  });
}
// FUEL pages
for (const [f, info] of Object.entries(FUELS)) {
  const list = cars.filter((c) => c.fuels.includes(f));
  listingPage({
    path: `/fuel/${info.slug}/`, h1: `${f} cars for import to Kenya`, crumbsArr: [['Home', '/'], ['All cars', '/cars/'], [`${f} cars`, `/fuel/${info.slug}/`]], filters: list.length > 6,
    intro: `<p>${info.desc} We have ${plural(list.length, `model`)} with ${f.toLowerCase()} versions, from <b>${M(Math.min(...list.map((c) => c.priceFrom)))}</b> landed.</p>`,
    list, title: fit(`${f} Cars for Import to Kenya: Prices & Specs | ${site.name}`, `${f} Cars for Import to Kenya | ${site.name}`),
    description: `${f} cars you can import to Kenya: ${list.slice(0, 5).map((c) => c.name).join(', ')} and more. Compare fuel economy, specs and landed prices.`,
  });
}
// ORIGIN pages
for (const [o, info] of Object.entries(ORIGINS)) {
  const list = cars.filter((c) => c.origin.includes(o));
  const faq = [
    [`How long does shipping from ${o} to Kenya take?`, `Shipping from ${o} (${info.port}) to Mombasa takes about ${info.transit}, plus about one week for KEBS inspection, KRA clearing and registration.`],
    [`What does it cost to import a car from ${o} to Kenya?`, `Landed prices for cars from ${o} in our catalogue start from about ${M(Math.min(...list.map((c) => c.priceFrom)))}. The total includes the car, shipping, insurance, KRA duty, clearing and registration. Request a free quote for an exact figure.`],
    [`Which cars are best to import from ${o}?`, `Our most requested ${o} imports are the ${listJoin(list.filter((c) => c.popular).slice(0, 5).map((c) => c.name) || list.slice(0, 5).map((c) => c.name))}.`],
    ...generalFaq.slice(1, 2),
  ];
  const extra = `<section class="block" style="padding-bottom:8px"><div class="two-col"><div class="prose"><h2>Why import from ${o}?</h2><p>${info.intro}</p><ul>${info.points.map((p) => `<li>${p}</li>`).join('')}</ul></div>
    <div><div class="order-box"><h3 style="margin:0">Shipping from ${o}</h3><table class="spec kv"><tbody><tr><th>Departure port</th><td>${info.port}</td></tr><tr><th>Arrival port</th><td>Mombasa, Kenya</td></tr><tr><th>Transit time</th><td>${info.transit}</td></tr><tr><th>Steering</th><td>Right-hand drive</td></tr></tbody></table>
    <a class="btn btn-wa btn-block" href="${waLink(`Hi, I am interested in importing a car from ${o} with ${site.name}.`)}" target="_blank" rel="noopener">${I.wa} Ask about ${o} imports</a></div></div></div></section>`;
  listingPage({
    path: `/import-from/${info.slug}/`, h1: info.title, crumbsArr: [['Home', '/'], [`Import from ${o}`, `/import-from/${info.slug}/`]], filters: true,
    intro: `<p>${info.intro}</p>`, list, extra, faq,
    title: fit(`${info.title} | Prices & Shipping | ${site.name}`, `${info.title} | ${site.name}`),
    description: `${info.title}: ${list.length}+ models, shipping in ${info.transit}, KEBS inspected, all-inclusive landed prices in KES. Order on WhatsApp with ${site.name}.`,
  });
}

// CAR DETAIL pages
const renderCar = makeRenderCar({ cars, site, ORIGINS, BODIES, I, YEAR, MIN_YEAR, esc, M, range, abs, plural, listJoin, fit, cc, kmL, slugify, imgs, mainImg, pub, waLink, crumbs, faqHtml, faqLd, grid, orderModal, layout, add });
for (const c of cars) {
  renderCar(c);
  if (c.variants.length > 1) c.variants.forEach((v) => renderCar(c, v));
}

// IMPORT REQUEST wizard
{
  const cr = crumbs([['Home', '/'], ['Request a car', '/import-request/']]);
  const data = { makes: Object.fromEntries(MAKES.map((m) => [m, cars.filter((c) => c.make === m).map((c) => ({ slug: c.slug, model: c.model, variants: c.variants.map((v) => v.name) }))])) };
  const opt = (arr) => arr.map((x) => `<option>${x}</option>`).join('');
  const body = `<div class="wrap">${cr.html}
<div class="two-col" style="padding-bottom:48px">
  <div>
    <header class="page-head" style="padding-bottom:12px"><h1>Request a car import</h1><p>Tell us what you want in 3 quick steps. It takes under a minute. We'll reply on WhatsApp with matching cars and a free, all-inclusive landed quote.</p></header>
    <div class="wizard" id="wizard">
      <div class="progress" aria-hidden="true"><div class="on"></div><div></div><div></div></div>
      <form id="request-form" novalidate>
        <input type="hidden" name="type" value="Import Request">
        <label class="hp" aria-hidden="true">Website<input name="website" tabindex="-1" autocomplete="off"></label>
        <div class="step on" data-step="1">
          <div><div class="step-label">Step 1 of 3</div><h2 style="font-size:1.35rem;margin:0">Which car do you want?</h2></div>
          <div class="grid-2">
            <label class="field"><span>Make <b class="req">*</b></span><select name="make" required><option value="">Choose make…</option>${opt(MAKES)}<option value="Other">Other make</option></select></label>
            <label class="field"><span>Model <b class="req">*</b></span><select name="model" required disabled><option value="">Choose make first</option></select></label>
          </div>
          <label class="field" data-other-car hidden><span>Type the make & model</span><input name="other_car" placeholder="e.g. Toyota Land Cruiser 79 Pickup"></label>
          <label class="field"><span>Version / spec</span><select name="variant"><option value="">Not sure / any</option></select></label>
          <div class="field"><span class="field-label">Fuel</span><div class="chips">${['Any', 'Petrol', 'Diesel', 'Hybrid', 'Electric'].map((f, i) => `<label class="chip"><input type="radio" name="fuel" value="${f}"${i === 0 ? ' checked' : ''}>${f}</label>`).join('')}</div></div>
          <div class="field"><span class="field-label">Transmission</span><div class="chips">${['Automatic', 'Manual', 'Any'].map((f, i) => `<label class="chip"><input type="radio" name="transmission" value="${f}"${i === 0 ? ' checked' : ''}>${f}</label>`).join('')}</div></div>
        </div>
        <div class="step" data-step="2">
          <div><div class="step-label">Step 2 of 3</div><h2 style="font-size:1.35rem;margin:0">Your preferences</h2></div>
          <div class="field"><span class="field-label">Import from</span><div class="chips">${['Best price (any)', 'Japan', 'UK', 'South Africa'].map((f, i) => `<label class="chip"><input type="radio" name="origin" value="${f}"${i === 0 ? ' checked' : ''}>${f}</label>`).join('')}</div></div>
          <div class="grid-2">
            <label class="field"><span>Year from</span><select name="year">${opt(Array.from({ length: YEAR - MIN_YEAR + 1 }, (_, i) => MIN_YEAR + i))}</select></label>
            <label class="field"><span>Budget (landed, KES)</span><select name="budget">${opt(['Not sure yet', 'Under 1M', '1M – 1.5M', '1.5M – 2M', '2M – 3M', '3M – 5M', '5M – 8M', '8M – 12M', 'Above 12M'])}</select></label>
            <label class="field"><span>Max mileage</span><select name="mileage">${opt(['Any', 'Under 30,000 km', 'Under 50,000 km', 'Under 80,000 km', 'Under 100,000 km'])}</select></label>
            <label class="field"><span>Colour</span><select name="colour">${opt(['Any', 'White / Pearl', 'Black', 'Silver', 'Grey', 'Blue', 'Red', 'Other'])}</select></label>
          </div>
          <div class="field"><span class="field-label">When do you need it?</span><div class="chips">${['As soon as possible', 'Within 3 months', 'Just researching'].map((f, i) => `<label class="chip"><input type="radio" name="timeline" value="${f}"${i === 0 ? ' checked' : ''}>${f}</label>`).join('')}</div></div>
        </div>
        <div class="step" data-step="3">
          <div><div class="step-label">Step 3 of 3</div><h2 style="font-size:1.35rem;margin:0">Where should we send your quote?</h2></div>
          <label class="field"><span>Your name <b class="req">*</b></span><input name="name" autocomplete="name" required></label>
          <div class="grid-2">
            <label class="field"><span>Phone / WhatsApp <b class="req">*</b></span><input name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="07XX XXX XXX" required></label>
            <label class="field"><span>Email <span class="muted small">(optional)</span></span><input name="email" type="email" autocomplete="email"></label>
          </div>
          <label class="field"><span>Town / County</span><input name="town" autocomplete="address-level2" placeholder="e.g. Nakuru"></label>
          <label class="field"><span>Anything else?</span><textarea name="notes" rows="3" placeholder="Trade-in, financing, specific features (sunroof, leather…)"></textarea></label>
        </div>
        <p class="error-msg" data-form-error hidden></p>
        <div class="wizard-nav">
          <button class="btn btn-ghost" type="button" data-prev hidden>← Back</button>
          <button class="btn btn-primary" type="button" data-next>Continue →</button>
          <button class="btn btn-wa" type="submit" data-submit hidden>${I.wa} Send request</button>
        </div>
      </form>
      <div class="success" hidden data-success></div>
    </div>
  </div>
  <aside>
    <div class="order-box" style="position:sticky;top:84px">
      <h3 style="margin:0">Prefer to talk?</h3>
      <p class="muted" style="margin:0">Chat with our import team on WhatsApp or call us. ${site.hours}.</p>
      <a class="btn btn-wa btn-block" href="${waLink(`Hi, I am interested in importing a car with ${site.name}.`)}" target="_blank" rel="noopener">${I.wa} WhatsApp us</a>
      <a class="btn btn-ghost btn-block" href="tel:${site.phone.replace(/\s/g, '')}">Call ${site.phone}</a>
      <hr style="border:0;border-top:1px solid var(--line);width:100%">
      <ul style="margin:0;padding-left:1.1em;display:grid;gap:6px;font-size:.92rem"><li>Free, no-obligation quote</li><li>One all-inclusive KES price</li><li>Photos & inspection report before you buy</li><li>Updates on WhatsApp until delivery</li></ul>
    </div>
  </aside>
</div></div>
<script type="application/json" id="wizard-data">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;
  add('/import-request/', layout({ path: '/import-request/', title: `Request a Car Import to Kenya: Free Quote | ${site.name}`, description: 'Tell us the car you want, your budget and preferences, and get a free all-inclusive landed quote to import from Japan, UK or South Africa. Reply on WhatsApp.', body, jsonld: [cr.ld], priority: 0.9 }));
}

// HOW IT WORKS guide
{
  const cr = crumbs([['Home', '/'], ['How to import a car to Kenya', '/how-to-import-a-car-to-kenya/']]);
  const body = `<div class="wrap">${cr.html}
<header class="page-head"><h1>How to import a car to Kenya: step-by-step guide (${YEAR})</h1><p>Everything you need to know about importing a car from Japan, the UK or South Africa, including the 8-year rule, KRA duty, inspection, shipping times and how ${site.name} makes it simple.</p></header>
${stepsHtml}
<div class="two-col" style="margin-top:40px">
<article class="prose">
  <h2>1. Check the car is eligible</h2>
  <p>Kenya's KEBS standard only allows used vehicles <b>less than 8 years old</b> from the year of first registration, so in ${YEAR} you can import cars first registered in <b>${MIN_YEAR} or later</b>. Vehicles must be <b>right-hand drive</b>, which is why Japan, the UK and South Africa are the main sources.</p>
  <h2>2. Understand the landed cost</h2>
  <p>The price you see abroad is only the start. A full landed cost includes:</p>
  <ul>
    <li><b>Vehicle price (FOB)</b>: the auction or dealer price in the export country</li>
    <li><b>Freight & insurance</b>: roll-on/roll-off shipping to Mombasa</li>
    <li><b>Import duty</b>: charged by KRA on the customs value</li>
    <li><b>Excise duty</b>: a rate that depends on engine capacity and fuel type</li>
    <li><b>VAT (16%)</b> plus the <b>Import Declaration Fee (IDF)</b> and <b>Railway Development Levy (RDL)</b></li>
    <li><b>Port, clearing & registration</b>: KPA charges, agency fees, NTSA registration and number plates</li>
  </ul>
  <p>KRA calculates taxes using its <b>Current Retail Selling Price (CRSP)</b> schedule and the car's age, so duty on the same model can differ by year and version. We work all of this out for you and give you one all-inclusive price in KES.</p>
  <div class="note">Tip: Hybrids and cars under 1500 cc usually attract lower excise duty. Ask us to compare the landed cost of two versions before you decide.</div>
  <h2>3. Choose your source country</h2>
  ${Object.entries(ORIGINS).map(([n, o]) => `<h3>${n}: ${o.transit} shipping</h3><p>${o.intro} <a href="/import-from/${o.slug}/">See cars from ${n} →</a></p>`).join('')}
  <h2>4. Inspection & shipping</h2>
  <p>Before loading, every car passes a KEBS-appointed pre-shipment roadworthiness inspection. The inspection certificate travels with the car's export documents. Ships arrive at the Port of Mombasa, where the car is verified and released once duty is paid.</p>
  <h2>5. Clearing, registration & delivery</h2>
  <p>We lodge the customs entry, pay KRA taxes on your behalf, clear the car from the port and register it with NTSA. You then collect in Mombasa or Nairobi, or we deliver to your town.</p>
  <h2>Why import with ${site.name}?</h2>
  <ul><li>Pick the exact version, year, colour and mileage you want</li><li>Transparent, all-inclusive KES quotes</li><li>Photos, auction sheets and inspection reports before you pay</li><li>WhatsApp updates from purchase to delivery</li></ul>
</article>
<aside><div class="order-box" style="position:sticky;top:84px"><h3 style="margin:0">Ready to import?</h3><p class="muted" style="margin:0">Browse ${cars.length} models or tell us exactly what you want.</p><a class="btn btn-primary btn-block" href="/import-request/">Request a car</a><a class="btn btn-ghost btn-block" href="/cars/">Browse cars</a><a class="btn btn-wa btn-block" href="${waLink(`Hi, I am interested in importing a car with ${site.name}. I have a question: `)}" target="_blank" rel="noopener">${I.wa} Ask on WhatsApp</a></div></aside>
</div>
<section class="block"><h2>Car import FAQs</h2>${faqHtml(generalFaq)}</section>
</div>${ctaBand()}`;
  const howTo = { '@context': 'https://schema.org', '@type': 'HowTo', name: 'How to import a car to Kenya', step: stepsList.map(([n, t], i) => ({ '@type': 'HowToStep', position: i + 1, name: n, text: t })) };
  add('/how-to-import-a-car-to-kenya/', layout({ path: '/how-to-import-a-car-to-kenya/', title: `How to Import a Car to Kenya (${YEAR} Guide): Duty, 8-Year Rule & Costs`, description: `Step-by-step guide to importing a car to Kenya in ${YEAR}: the 8-year rule, KRA import duty, excise, VAT, inspection, shipping times from Japan, UK and South Africa, and total landed cost.`, body, jsonld: [cr.ld, howTo, faqLd(generalFaq)], priority: 0.9 }));
}

// BLOG
const blogOrderForm = (p) => {
  const list = p.cars.map((s) => cars.find((c) => c.slug === s));
  const data = list.map((c) => ({ slug: c.slug, name: c.name, variants: c.variants.map((v) => ({ name: v.name, price: range(...v.price) })) }));
  const opt = (arr) => arr.map((x) => `<option>${x}</option>`).join('');
  return `<div class="order-box blog-order" id="order" data-blog-order>
  <div><div class="step-label">Car order form</div><h2 class="blog-order-h">Order your car with ${site.name}</h2><p class="muted small" style="margin:0">Free, all-inclusive landed quote. No payment needed now.</p></div>
  <form class="stack" novalidate>
    <label class="hp" aria-hidden="true">Website<input name="website" tabindex="-1" autocomplete="off"></label>
    <label class="field"><span>Car <b class="req">*</b></span><select name="car">${list.map((c) => `<option value="${c.slug}">${esc(c.name)}</option>`).join('')}<option value="other">Another car…</option></select></label>
    <label class="field" data-other-car hidden><span>Type the make & model <b class="req">*</b></span><input name="other_car" placeholder="e.g. Toyota Land Cruiser 79"></label>
    <label class="field"><span>Version / spec</span><select name="variant"></select></label>
    <div class="grid-2">
      <label class="field"><span>Import from</span><select name="origin">${opt(['Best price (any)', 'Japan', 'UK', 'South Africa'])}</select></label>
      <label class="field"><span>Year from</span><select name="year">${opt(Array.from({ length: YEAR - MIN_YEAR + 1 }, (_, i) => MIN_YEAR + i))}</select></label>
    </div>
    <label class="field"><span>Budget (landed, KES)</span><select name="budget">${opt(['Not sure yet', 'Under 2M', '2M – 3M', '3M – 5M', '5M – 8M', '8M – 12M', '12M – 20M', 'Above 20M'])}</select></label>
    <label class="field"><span>Your name <b class="req">*</b></span><input name="name" autocomplete="name" required></label>
    <label class="field"><span>Phone / WhatsApp <b class="req">*</b></span><input name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="07XX XXX XXX" required></label>
    <label class="field"><span>Email <span class="muted small">(optional)</span></span><input name="email" type="email" autocomplete="email"></label>
    <label class="field"><span>Town / County</span><input name="town" autocomplete="address-level2" placeholder="e.g. Nairobi, Mombasa, Nakuru"></label>
    <label class="field"><span>Anything else?</span><textarea name="notes" rows="2" placeholder="Colour, mileage, trade-in, finance…"></textarea></label>
    <p class="error-msg" data-form-error hidden></p>
    <button class="btn btn-wa btn-block" type="submit">${I.wa} Send order via WhatsApp</button>
    <p class="hint" style="text-align:center;margin:0">Or call <a href="tel:${site.phone.replace(/\s/g, '')}">${site.phone}</a> · ${site.hours}</p>
  </form>
  <div class="success" hidden data-success></div>
  <script type="application/json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>
</div>`;
};
{
  const cr = crumbs([['Home', '/'], ['Blog', '/blog/']]);
  const body = `<div class="wrap">${cr.html}
<header class="page-head"><h1>Car prices & import guides for Kenya</h1><p>Up-to-date landed prices for the cars Kenyans import most, plus clear guides to importing from Japan and the UK. Every guide links to the exact cars and versions, so you can order the spec you want.</p></header>
<nav class="chips" aria-label="Blog topics" style="margin-bottom:8px">${CLUSTERS.map((cl) => `<a class="chip" href="#${slugify(cl)}">${esc(cl)} <span class="count">${posts.filter((p) => p.cluster === cl).length}</span></a>`).join('')}</nav>
${CLUSTERS.map((cl) => `<section class="block" id="${slugify(cl)}" style="padding-bottom:0"><h2>${esc(cl)}</h2>${postGrid(posts.filter((p) => p.cluster === cl))}</section>`).join('')}
</div>${ctaBand()}`;
  const itemList = { '@context': 'https://schema.org', '@type': 'ItemList', itemListElement: posts.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(`/blog/${p.slug}/`), name: p.h1 })) };
  add('/blog/', layout({ path: '/blog/', title: `Car Prices & Import Guides Kenya (${YEAR}) | ${site.name} Blog`, description: `Range Rover, Land Cruiser V8, G-Wagon, Harrier, CX-5 and Prado prices in Kenya, plus guides to importing cars from Japan and the UK to Nairobi and Mombasa.`, body, jsonld: [cr.ld, itemList], priority: 0.8 }));
}
for (const p of posts) {
  const path = `/blog/${p.slug}/`;
  const cr = crumbs([['Home', '/'], ['Blog', '/blog/'], [p.crumb, path]]);
  const hero = mainImg(p.cars[0]);
  const featured = p.cars.map((s) => cars.find((c) => c.slug === s));
  const more = [...posts.filter((x) => x !== p && x.cluster === p.cluster), ...posts.filter((x) => x.cluster !== p.cluster)];
  const body = `<div class="wrap">${cr.html}
<header class="page-head post-head"><span class="eyebrow">${esc(p.tag)}</span><h1>${esc(p.h1)}</h1><p>${esc(p.excerpt)}</p>
  <p class="post-meta">By the ${site.name} import team · Updated <time datetime="${p.updated}">${fmtDate(p.updated)}</time> · ${readMin(p)} min read</p></header>
<div class="two-col post-layout">
  <div>
    <img class="post-hero" src="${hero}" alt="${esc(`${p.keyword}: ${featured[0].name} imported by ${site.name}`)}" title="${esc(p.title)}" width="1200" height="800" fetchpriority="high">
    <article class="prose post-body">${p.html}
      <h2>${esc(p.keyword)}: FAQs</h2>${faqHtml(p.faq)}
    </article>
  </div>
  <aside class="post-aside">${blogOrderForm(p)}
    <div class="order-box"><h3 style="margin:0">Talk to our import team</h3><p class="muted small" style="margin:0">📞 <a href="tel:${site.phone.replace(/\s/g, '')}">${site.phone}</a><br>✉️ <a href="mailto:${site.email}">${site.email}</a><br>📍 ${site.address}<br>🕘 ${site.hours}</p>
      <a class="btn btn-wa btn-block" href="${waLink(`Hi ${site.name}, I read your guide "${p.crumb}" and I'd like a quote.`)}" target="_blank" rel="noopener">${I.wa} WhatsApp ${site.phone}</a></div>
  </aside>
</div>
<section class="block"><div class="section-head"><div><h2>Cars in this guide</h2><p>Open any car to compare versions, see full specs and order the exact spec.</p></div><a class="link-arrow" href="/cars/">All cars →</a></div>${grid(featured)}</section>
<section class="block" style="padding-top:0"><div class="section-head"><div><h2>More car guides</h2></div><a class="link-arrow" href="/blog/">All guides →</a></div>${postGrid(more.slice(0, 6))}</section>
</div>${ctaBand()}`;
  const article = { '@context': 'https://schema.org', '@type': 'BlogPosting', headline: p.h1.slice(0, 110), name: p.title, description: p.description, image: [abs(hero)], datePublished: p.published, dateModified: p.updated, inLanguage: 'en-KE', keywords: p.keyword, wordCount: wordCount(p.html),
    author: { '@type': 'Organization', name: site.name, url: site.url }, publisher: { '@id': abs('/#dealer') }, mainEntityOfPage: abs(path),
    about: featured.map((c) => ({ '@type': 'Car', name: c.name, url: abs(`/cars/${c.slug}/`) })), areaServed: { '@type': 'Country', name: 'Kenya' } };
  add(path, layout({ path, title: p.title, description: p.description, body, image: hero, preload: hero, priority: 0.8,
    images: [{ loc: abs(hero), title: p.title, caption: p.keyword }], jsonld: [cr.ld, article, faqLd(p.faq)] }));
}

// Simple content pages
function simplePage(path, h1, title, description, html, priority = 0.5, noindex = false) {
  const cr = crumbs([['Home', '/'], [h1, path]]);
  add(path, layout({ path, title, description, noindex, priority, jsonld: [cr.ld], body: `<div class="wrap">${cr.html}<header class="page-head"><h1>${h1}</h1></header><div class="prose" style="padding-bottom:48px">${html}</div></div>` }));
}
simplePage('/about/', `About ${site.name}`, `About ${site.name}: Trusted Car Importers in Kenya`, `${site.name} helps Kenyans import quality cars from Japan, the UK and South Africa with transparent pricing and WhatsApp support.`,
  `<p>${site.name} is a Kenyan car import company based in ${site.address}. We help individuals, families and businesses import quality vehicles from <a href="/import-from/japan/">Japan</a>, the <a href="/import-from/uk/">United Kingdom</a> and <a href="/import-from/south-africa/">South Africa</a>.</p>
  <p>Our approach is simple: you choose the exact car and spec, we give you an honest all-inclusive price, and we keep you updated until the keys are in your hand.</p>
  <h2>What we do</h2><ul><li>Source cars from auctions and trusted dealers</li><li>Verify condition with auction sheets, photos and inspection reports</li><li>Arrange shipping and insurance to Mombasa</li><li>Handle KEBS inspection, KRA duty, clearing and NTSA registration</li><li>Deliver to you anywhere in Kenya</li></ul>
  <p><a class="btn btn-primary" href="/import-request/">Request a car</a></p>`);
simplePage('/contact/', 'Contact us', `Contact ${site.name}: Car Imports Kenya`, `Contact ${site.name} on WhatsApp, phone or email to import your next car from Japan, the UK or South Africa.`,
  `<p>The fastest way to reach us is WhatsApp. Our team replies during business hours (${site.hours}).</p>
  <p><a class="btn btn-wa" href="${waLink(`Hi, I am interested in importing a car with ${site.name}.`)}" target="_blank" rel="noopener">${I.wa} WhatsApp ${site.phone}</a></p>
  <table class="spec kv" style="background:#fff;border:1px solid var(--line);border-radius:12px"><tbody><tr><th>Phone</th><td><a href="tel:${site.phone.replace(/\s/g, '')}">${site.phone}</a></td></tr><tr><th>Email</th><td><a href="mailto:${site.email}">${site.email}</a></td></tr><tr><th>Location</th><td>${site.address}</td></tr><tr><th>Hours</th><td>${site.hours}</td></tr></tbody></table>
  <p style="margin-top:20px">Know what you want? <a href="/import-request/">Send an import request</a> and get a free quote.</p>`);
simplePage('/privacy/', 'Privacy policy', `Privacy Policy | ${site.name}`, `How ${site.name} uses the personal information you share when requesting a car import.`,
  `<p>When you place an order or import request we collect your name, phone number, optional email address and location, together with the car details you choose. We use this information only to prepare your quote, source your vehicle and contact you about your order.</p>
  <p>Order details are sent to our sales team by email and, if you choose, through WhatsApp. We do not sell or share your data with third parties except where needed to import your vehicle (for example, shipping and clearing agents).</p>
  <p>We handle personal data in line with the Kenya Data Protection Act, 2019. To access or delete your information, contact <a href="mailto:${site.email}">${site.email}</a>.</p>`, 0.2);
{
  const rows = cars.flatMap((c) => imgs(c.slug).map((g) => `<li><b>${esc(c.name)}</b>: <a href="${esc(g.source)}" target="_blank" rel="noopener nofollow">${esc(g.title)}</a> by ${esc(g.artist)}, ${esc(g.license)}</li>`)).join('');
  simplePage('/credits/', 'Image credits', `Image Credits | ${site.name}`, 'Credits and licences for vehicle photographs used on this website.',
    `<p>Vehicle photographs on this site are representative images sourced from <a href="https://commons.wikimedia.org" target="_blank" rel="noopener">Wikimedia Commons</a> under the free licences listed below. They were cropped, resized and watermarked ("Import car with Elisa Motors") for this website; the watermark does not claim authorship of the original photographs. Actual imported vehicles will differ.</p><ul class="credits-list">${rows}</ul>`, 0.1);
}
{
  const sec = (h, links) => `<h2>${h}</h2><ul class="sitemap-list">${links.map(([t, u]) => `<li><a href="${u}">${esc(t)}</a></li>`).join('')}</ul>`;
  const html = sec('Main pages', [['Home', '/'], ['All cars', '/cars/'], ['Request a car import', '/import-request/'], ['How to import a car to Kenya', '/how-to-import-a-car-to-kenya/'], ['About', '/about/'], ['Contact', '/contact/']])
    + sec('Blog & price guides', [['All guides', '/blog/'], ...posts.map((p) => [p.crumb, `/blog/${p.slug}/`])])
    + sec('Import from', Object.entries(ORIGINS).map(([n, o]) => [`Import cars from ${n}`, `/import-from/${o.slug}/`]))
    + sec('Body types', Object.values(BODIES).map((b) => [b.plural, `/body-type/${b.slug}/`]))
    + sec('Fuel types', Object.entries(FUELS).map(([f, o]) => [`${f} cars`, `/fuel/${o.slug}/`]))
    + MAKES.map((m) => sec(`${m} models & versions`, cars.filter((c) => c.make === m).flatMap((c) => [[c.name, `/cars/${c.slug}/`], ...(c.variants.length > 1 ? c.variants.map((v) => [`${c.name} ${v.name}`, `/cars/${c.slug}/${v.id}/`]) : [])]))).join('');
  simplePage('/sitemap/', 'Sitemap', `Sitemap: All Cars & Pages | ${site.name}`, `Every page on ${site.name}: all ${cars.length} car models and their versions, makes, body types and import guides.`, html, 0.4);
}
add('/404.html', layout({ path: '/404.html', noindex: true, title: `Page not found | ${site.name}`, description: 'Page not found.', body: `<div class="wrap" style="padding:64px 16px;text-align:center"><h1>We couldn't find that page</h1><p class="muted">The car may have moved. Try browsing our catalogue or send us a request.</p><p><a class="btn btn-primary" href="/cars/">Browse cars</a> <a class="btn btn-ghost" href="/import-request/">Request a car</a></p></div>` }));

// ---------------------------------------------------------------- write
await rm(OUT, { recursive: true, force: true });
for (const p of pages) {
  const file = p.path.endsWith('.html') ? join(OUT, p.path) : join(OUT, p.path, 'index.html');
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, p.html);
}
await cp(join(SRC, 'assets'), join(OUT, 'assets'), { recursive: true, filter: (f) => !f.includes('cars-wm') });
const carImgDir = join(OUT, 'assets', 'img', 'cars');
// Publish the watermarked copies (scripts/watermark.py) in place of the originals
const wmDir = join(SRC, 'assets', 'img', 'cars-wm');
if (existsSync(wmDir)) await cp(wmDir, carImgDir, { recursive: true });
else console.warn('No watermarked photos found. Run: python scripts/watermark.py');
for (const f of await readdir(carImgDir)) if (f.endsWith('.webp')) await rename(join(carImgDir, f), join(carImgDir, pub(f)));
await cp(join(SRC, 'static'), OUT, { recursive: true });

const uniq = [...new Map(sitemap.map((s) => [s.path, s])).values()];
const xmlEsc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
await writeFile(join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${uniq.map((s) => `<url><loc>${abs(s.path)}</loc><lastmod>${today}</lastmod><priority>${s.priority.toFixed(1)}</priority>${(s.images || []).map((i) => `<image:image><image:loc>${xmlEsc(i.loc)}</image:loc><image:title>${xmlEsc(i.title)}</image:title><image:caption>${xmlEsc(i.caption)}</image:caption></image:image>`).join('')}</url>`).join('\n')}\n</urlset>\n`);
await writeFile(join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /send-order.php\n\nSitemap: ${abs('/sitemap.xml')}\n`);
await writeFile(join(OUT, 'site.webmanifest'), JSON.stringify({ name: site.name, short_name: 'Elisa Motors', start_url: '/', display: 'standalone', background_color: '#faf8f4', theme_color: '#0e2a3a', icons: [{ src: '/assets/img/logo.png', sizes: '512x512', type: 'image/png' }] }));
await writeFile(join(OUT, 'favicon.svg'), I.logo.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" '));
const php = (await readFile(join(SRC, 'send-order.php'), 'utf8')).replace('{{TO}}', site.email).replace('{{FROM}}', site.mailFrom).replace(/{{NAME}}/g, site.name).replace('{{WA}}', site.whatsapp).replace('{{PHONE}}', site.phone);
await writeFile(join(OUT, 'send-order.php'), php);
console.log(`Built ${pages.length} pages, ${uniq.length} URLs in sitemap → dist/`);
