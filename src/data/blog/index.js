// Blog posts. Each post file exports (h) => ({ ...post }) and receives the helpers below,
// so prices, years and links always match the live catalogue.
import { readdirSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { join } from 'node:path';

// Every other .js file in this folder is a post; drop a new file in and it is published.
const DIR = import.meta.dirname;
const POSTS = await Promise.all(readdirSync(DIR).filter((f) => f.endsWith('.js') && f !== 'index.js').sort()
  .map(async (f) => (await import(pathToFileURL(join(DIR, f)))).default));

// Topic clusters, in the order they appear on /blog/
export const CLUSTERS = ['Range Rover & Land Rover', 'Toyota Land Cruiser', 'Mercedes-Benz & G-Wagon', 'SUVs & crossovers', 'Import from Japan', 'Import from the UK', 'Import costs, duty & clearing'];

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
    v: (slug, id, text) => ver(slug, id) && `<a href="/cars/${slug}/${car(slug).variants.length > 1 ? id + '/' : ''}">${text || `${car(slug).name} ${ver(slug, id).name}`}</a>`,
    a: (href, text) => `<a href="${href}">${text}</a>`,
    waA: (text, label = site.phone) => `<a href="${wa(text)}" target="_blank" rel="noopener">${label}</a>`,
    telA: () => `<a href="tel:${tel}">${site.phone}</a>`,
    // inline call-to-action box
    cta: (title, text, waText) => `<div class="note post-cta"><b>${title}</b> ${text} <a href="#order">Use the order form</a>, call ${h.telA()} or WhatsApp ${h.waA(waText || `Hi ${site.name}, ${title}`)}.</div>`,
    // "specifications by version" section written from catalogue data
    specs: (slug, heading) => {
      const m = car(slug);
      const lc = (t) => /^[A-Z][a-z]/.test(t) ? t.charAt(0).toLowerCase() + t.slice(1) : t;
      const eng = (x) => x.cc ? `${(x.cc / 1000).toFixed(1)}-litre ${x.fuel.toLowerCase()} engine` : 'electric motor';
      return `<h2>${heading || `${m.name} specifications by version`}</h2>
<p>Here is how each ${m.name} version we import compares. All of them seat ${m.seats}, and you can import them from ${m.origin.join(m.origin.length > 2 ? ', ' : ' or ').replace(/, (?=[^,]*$)/, ' or ')}.</p>
${m.variants.map((x) => `<p><b><a href="/cars/${slug}/${m.variants.length > 1 ? x.id + '/' : ''}">${m.name} ${trimV(m, x.name)}</a>.</b> This version uses a ${eng(x)} with ${x.hp} hp, a ${x.trans.toLowerCase()} gearbox and ${x.drive === '2WD' ? 'two-wheel drive' : x.drive === '4WD' ? 'four-wheel drive' : x.drive}. It returns about ${x.economy} and lands in Kenya at roughly <b>${range(...x.price)}</b>.${x.note ? ` Compared with lower trims, it adds ${lc(x.note)}.` : ''}</p>`).join('\n')}
${m.features.length ? `<p>Every ${m.name} we import includes these key features: ${m.features.map((f) => lc(f)).join(', ').replace(/, (?=[^,]*$)/, ' and ')}.</p>` : ''}`;
    },
    // price table for every version of the given models
    table: (slugs, caption) => `<div class="spec-table-wrap"><table class="spec post-table"><caption class="sr-only">${caption}</caption><thead><tr><th>Model & version</th><th>Engine</th><th>Est. landed price (KES)</th></tr></thead><tbody>${slugs.flatMap((s) => car(s).variants.map((v) => `<tr><th scope="row"><a href="/cars/${s}/${car(s).variants.length > 1 ? v.id + '/' : ''}">${car(s).name} ${trimV(car(s), v.name)}</a></th><td>${v.cc ? (v.cc / 1000).toFixed(1) + 'L ' : ''}${v.fuel}, ${v.hp} hp</td><td class="num nowrap"><b>${range(...v.price)}</b></td></tr>`)).join('')}</tbody></table></div>`,
  };
  const posts = POSTS.map((fn) => {
    const p = fn(h);
    p.cars.forEach(car);
    if (!CLUSTERS.includes(p.cluster)) throw new Error(`Blog: ${p.slug} has unknown cluster ${p.cluster}`);
    return p;
  });
  // Links to guides that are not published yet render as plain text until the post exists.
  const live = new Set(posts.map((p) => p.slug));
  const pending = new Set();
  for (const p of posts) p.html = p.html.replace(/<a href="\/blog\/([^"/]+)\/">(.*?)<\/a>/g, (m, slug, text) => live.has(slug) ? m : (pending.add(slug), text));
  if (pending.size) console.log(`Blog: ${pending.size} linked guides not written yet: ${[...pending].join(', ')}`);
  return posts;
}
