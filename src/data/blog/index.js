// Blog posts. Each post file exports (h) => ({ ...post }) and receives the helpers below,
// so prices, years and links always match the live catalogue.
import rangeRover from './range-rover-price-in-kenya.js';
import landCruiserV8 from './toyota-land-cruiser-v8-price-in-kenya.js';
import gWagon from './g-wagon-price-in-kenya.js';
import ukImports from './import-cars-from-uk-to-kenya.js';
import japanImports from './import-cars-from-japan-to-kenya.js';
import crossovers from './harrier-cx5-prado-tx-price-in-kenya.js';

const POSTS = [rangeRover, landCruiserV8, gWagon, ukImports, japanImports, crossovers];

export function blogPosts({ cars, site, YEAR, MIN_YEAR, M, range, esc }) {
  const bySlug = Object.fromEntries(cars.map((c) => [c.slug, c]));
  const car = (slug) => { const c = bySlug[slug]; if (!c) throw new Error(`Blog: unknown car ${slug}`); return c; };
  const ver = (slug, id) => { const v = car(slug).variants.find((x) => x.id === id); if (!v) throw new Error(`Blog: unknown version ${slug}/${id}`); return v; };
  // 'Range Rover Vogue' + 'Vogue 4.4 SDV8' -> 'Range Rover Vogue 4.4 SDV8'
  const trimV = (c, name) => name.replace(new RegExp(`^(Range Rover |${c.name.split(' ').at(-1)} )`), '');
  const tel = site.phone.replace(/\s/g, '');
  const wa = (text = `Hi ${site.name}, I read your blog and I'd like a quote.`) => `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
  const h = {
    site, YEAR, MIN_YEAR, M, range, esc,
    // price helpers (KES, from the catalogue)
    P: (slug, id) => range(...ver(slug, id).price),
    F: (slug) => M(car(slug).priceFrom),
    T: (slug) => M(car(slug).priceTo),
    // link helpers
    c: (slug, text) => `<a href="/cars/${slug}/">${text || car(slug).name}</a>`,
    v: (slug, id, text) => `<a href="/cars/${slug}/${id}/">${text || `${car(slug).name} ${ver(slug, id).name}`}</a>`,
    a: (href, text) => `<a href="${href}">${text}</a>`,
    waA: (text, label = site.phone) => `<a href="${wa(text)}" target="_blank" rel="noopener">${label}</a>`,
    telA: () => `<a href="tel:${tel}">${site.phone}</a>`,
    // inline call-to-action box
    cta: (title, text, waText) => `<div class="note post-cta"><b>${title}</b> ${text} <a href="#order">Use the order form</a>, call ${h.telA()} or WhatsApp ${h.waA(waText || `Hi ${site.name}, ${title}`)}.</div>`,
    // price table for every version of the given models
    table: (slugs, caption) => `<div class="spec-table-wrap"><table class="spec post-table"><caption class="sr-only">${caption}</caption><thead><tr><th>Model & version</th><th>Engine</th><th>Est. landed price (KES)</th></tr></thead><tbody>${slugs.flatMap((s) => car(s).variants.map((v) => `<tr><th scope="row"><a href="/cars/${s}/${car(s).variants.length > 1 ? v.id + '/' : ''}">${car(s).name} ${trimV(car(s), v.name)}</a></th><td>${v.cc ? (v.cc / 1000).toFixed(1) + 'L ' : ''}${v.fuel}, ${v.hp} hp</td><td class="num nowrap"><b>${range(...v.price)}</b></td></tr>`)).join('')}</tbody></table></div>`,
  };
  return POSTS.map((fn) => {
    const p = fn(h);
    p.cars.forEach(car);
    return p;
  });
}
