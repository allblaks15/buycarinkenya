// Server-rendered page for one car for sale: /used-cars/<slug>/ (rewritten here by vercel.json).
// The page chrome comes from /_shell/listing.html, which the static build generates with %%TOKENS%%.
import { sql, db, esc, kes, listingTitle, listingUrl, statusOf, SITE } from './_lib.js';

let shell;
const getShell = async (origin) => (shell ||= fetch(`${origin}/_shell/listing.html`).then((r) => { if (!r.ok) throw new Error('shell ' + r.status); return r.text(); }).catch((e) => { shell = null; throw e; }));
const html = (s, status = 200, cache = 'public, s-maxage=60, stale-while-revalidate=300') => new Response(s, { status, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': cache } });

const waIcon = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.5 12.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1a8 8 0 0 1-4.1-3.6c-.2-.3 0-.5.1-.6l.4-.5.3-.5c.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5 1.9.8 2.6.9 3.6.7.6-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4l-.6-.4z"/></svg>';
const phoneIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>';

export async function GET(req) {
  const url = new URL(req.url);
  const slug = (url.searchParams.get('slug') || '').toLowerCase().replace(/[^a-z0-9-]/g, '');
  let l;
  try {
    await db();
    [l] = slug ? await sql`SELECT * FROM listings WHERE slug = ${slug} AND status IN ('active', 'sold')` : [];
  } catch (e) { console.error(e); return html('<h1>Temporarily unavailable</h1><p>Please try again in a minute.</p>', 503, 'no-store'); }
  if (!l) {
    const nf = await fetch(`${url.origin}/404.html`).then((r) => r.text()).catch(() => '<h1>Not found</h1>');
    return html(nf, 404, 'public, s-maxage=30');
  }
  await sql`UPDATE listings SET views = views + 1 WHERE id = ${l.id}`.catch(() => {});

  const title = listingTitle(l);
  const place = [l.estate, l.location, l.county && l.county + " County"].filter(Boolean).join(", ");
  const st = statusOf(l);
  const sold = st === 'sold';
  const ended = sold || st === 'expired'; // no longer contactable
  const check = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  const extras = l.extras || [];
  const pageUrl = listingUrl(l);
  const photos = l.photos || [];
  const msg = `Hi, I saw your vehicle ${title} on ${SITE.domain}\n${pageUrl}\nIs it still available?`;
  const facts = [['Year', l.year], ['Mileage', l.mileage != null ? `${Number(l.mileage).toLocaleString('en-KE')} km` : null], ['Fuel', l.fuel], ['Transmission', l.transmission],
    ['Engine', l.engine_cc ? `${Number(l.engine_cc).toLocaleString('en-KE')} cc` : null], ['Body type', l.body], ['Colour', l.colour], ['Condition', l.condition], ['Accident history', l.accident], ['Location', place]].filter(([, v]) => v);
  const alt = (i) => `${title} for sale in ${l.location}, Kenya${i ? ` – photo ${i + 1}` : ''}`;

  const body = `<div class="wrap">
<nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">›</span><a href="/used-cars/">Cars for sale</a><span aria-hidden="true">›</span><span aria-current="page">${esc(title)}</span></nav>
<div class="detail">
  <div class="d-gallery">
    <figure class="gallery" style="margin:0">
      <div class="main" style="position:relative">${ended ? `<span class="badge sold-badge">${sold ? 'Sold' : 'No longer listed'}</span>` : ''}<img src="${esc(photos[0]?.url || '/assets/img/placeholder-car.svg')}" alt="${esc(alt(0))}" title="${esc(title)}" width="1200" height="800" fetchpriority="high" data-gallery-main></div>
      ${photos.length > 1 ? `<div class="thumbs" role="list">${photos.map((p, i) => `<button type="button" role="listitem" aria-label="Show photo ${i + 1}" aria-current="${i === 0}" data-src="${esc(p.url)}" data-alt="${esc(alt(i))}"><img src="${esc(p.thumb)}" alt="${esc(alt(i))}" width="120" height="80" loading="lazy" decoding="async"></button>`).join('')}</div>` : ''}
    </figure>
    ${extras.length ? `<section style="margin-top:24px"><h2 style="font-size:1.3rem">Features & extras</h2><ul class="feature-list extras-list">${extras.map((x) => `<li>${check}<span>${esc(x)}</span></li>`).join('')}</ul></section>` : ''}
    ${l.description ? `<section class="prose" style="margin-top:24px"><h2 style="font-size:1.3rem">About this car</h2>${esc(l.description).split(/\n{2,}/).map((p) => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('')}</section>` : ''}
  </div>
  <aside class="side">
    <div class="detail-head">
      <span class="make">${esc(l.make)}${l.body ? ` · ${esc(l.body)}` : ''}${l.condition ? ` · ${esc(l.condition)}` : ''}</span>
      <h1>${esc(title)}</h1>
      <p class="listing-price num">${kes(l.price)}</p>
      <p class="muted" style="margin:0">📍 ${esc(place)} · Sold by ${esc(l.seller_name || 'the owner')}, not a broker</p>
    </div>
    <dl class="facts">${facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
    <div class="order-box">
      ${ended ? `<h2 style="font-size:1.15rem;margin:0">${sold ? 'This car has been sold' : 'This listing has ended'}</h2><p class="muted" style="margin:0">${sold ? 'The seller marked it as sold.' : 'The seller\'s listing period has ended.'} Browse other cars for sale or sell yours with us.</p>
      <a class="btn btn-primary btn-block" href="/used-cars/">See cars for sale</a>`
    : `<h2 style="font-size:1.15rem;margin:0">Contact the seller</h2>
      <p class="muted small" style="margin:0">Deal directly with the owner. No broker, no commission.</p>
      <a class="btn btn-wa btn-block" href="https://wa.me/${l.phone}?text=${encodeURIComponent(msg)}" target="_blank" rel="noopener nofollow">${waIcon} WhatsApp seller</a>
      <a class="btn btn-ghost btn-block" href="tel:+${l.phone}" rel="nofollow">${phoneIcon} Call +${l.phone.replace(/^(\d{3})(\d{3})(\d{3})(\d{3})$/, '$1 $2 $3 $4')}</a>
      <div class="note small"><b>Stay safe:</b> view the car in person, check the logbook matches the seller's ID and run an NTSA search before paying any money.</div>`}
    </div>
    <div class="sell-promo"><b>Selling a car?</b> List yours from KSh 450. <a href="/sell-your-car/">Sell with us →</a></div>
  </aside>
</div>
</div>`;

  const ld = {
    '@context': 'https://schema.org', '@type': 'Car', name: title, brand: { '@type': 'Brand', name: l.make }, model: l.model, vehicleModelDate: String(l.year), url: pageUrl,
    image: photos.map((p) => p.url), description: (l.description || `${title} for sale in ${l.location}, Kenya`).slice(0, 500),
    ...(l.mileage != null && { mileageFromOdometer: { '@type': 'QuantitativeValue', value: l.mileage, unitCode: 'KMT' } }),
    ...(l.fuel && { fuelType: l.fuel }), ...(l.transmission && { vehicleTransmission: l.transmission }), ...(l.colour && { color: l.colour }), ...(l.accident && { knownVehicleDamages: l.accident }), ...(l.body && { bodyType: l.body }),
    offers: { '@type': 'Offer', price: Number(l.price), priceCurrency: 'KES', availability: sold ? 'https://schema.org/SoldOut' : ended ? 'https://schema.org/Discontinued' : 'https://schema.org/InStock', url: pageUrl, itemCondition: l.condition === 'Brand new' ? 'https://schema.org/NewCondition' : 'https://schema.org/UsedCondition', areaServed: { '@type': 'Place', name: `${place}, Kenya` } },
  };
  const crumbsLd = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [['Home', '/'], ['Cars for sale', '/used-cars/'], [title, `/used-cars/${l.slug}/`]].map(([name, p], i) => ({ '@type': 'ListItem', position: i + 1, name, item: SITE.url + p })) };
  const ldTags = [ld, crumbsLd].map((j) => `<script type="application/ld+json">${JSON.stringify(j).replace(/</g, '\\u003c')}</script>`).join('');

  const t = `${sold ? 'SOLD: ' : ended ? 'ENDED: ' : ''}${title} for sale in ${l.location} – ${kes(l.price)} | ${SITE.name}`;
  const d = `${title} for sale in ${l.location}, Kenya at ${kes(l.price)}.${l.mileage != null ? ` ${Number(l.mileage).toLocaleString('en-KE')} km.` : ''}${l.fuel ? ` ${l.fuel}` : ''}${l.transmission ? `, ${l.transmission.toLowerCase()}` : ''}. Contact the owner directly on WhatsApp or phone. No brokers.`;
  let page;
  try { page = await getShell(url.origin); } catch (e) { console.error(e); return html('<h1>Temporarily unavailable</h1>', 503, 'no-store'); }
  page = page.replaceAll('%%TITLE%%', esc(t)).replaceAll('%%DESC%%', esc(d.slice(0, 300))).replaceAll('%%SLUG%%', l.slug)
    .replaceAll(`${SITE.url}/%%IMG%%`, esc(photos[0]?.url || `${SITE.url}/assets/img/logo.png`))
    .replace('%%BODY%%', () => body + ldTags);
  if (ended) page = page.replace('<meta name="robots" content="index, follow, max-image-preview:large">', '<meta name="robots" content="noindex, follow">');
  return html(page);
}
