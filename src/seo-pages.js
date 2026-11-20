// Search landing pages for the marketplace: budgets, car types, locations, "<model> for sale in Kenya" and buyer/seller guides.
// Each page shows live listings (filled by market.js from /api/listings) plus catalogue data and advice specific to that page.

const kesShort = (n) => (n >= 1e6 ? `${+(n / 1e6).toFixed(2)} million` : `${n / 1000}k`);
const kesFull = (n) => 'KES ' + n.toLocaleString('en');

// Budget tiers: typical locally used models and advice (indicative; prices depend on year, mileage and condition)
const TIERS = [
  { max: 400000, models: 'older (roughly 2002–2007) small cars such as the Toyota Duet, Daihatsu Mira, Suzuki Alto, Nissan March, Toyota Corolla NZE and Nissan Sunny',
    tip: 'At this price you are buying an older, locally used car, so its condition matters far more than its badge. Budget about 10–15% extra for tyres, battery, service and small repairs in the first months.' },
  { max: 700000, models: 'roughly 2006–2011 Toyota Vitz, Mazda Demio, Nissan Note, Honda Fit, Toyota Belta, Toyota Ist, Nissan Tiida, Toyota Probox and Corolla NZE',
    tip: 'This is the most popular budget for a first car in Kenya. Compact 1.0–1.5L Japanese hatchbacks are cheap to fuel and insure, and spare parts are in every town.' },
  { max: 1000000, models: 'roughly 2010–2014 Toyota Vitz and Passo, Honda Fit, Mazda Demio, Nissan Note, Toyota Axio and Fielder, Toyota Wish and Subaru Impreza',
    tip: 'Around KES 1 million you can choose between a newer compact car or an older family saloon or station wagon. It is also where importing a fresh unit starts to make sense.' },
  { max: 1500000, models: 'Toyota Axio, Fielder, Premio and Allion, Mazda Axela, Honda Fit Hybrid, Toyota Noah, older Nissan X-Trail and Subaru Forester',
    tip: 'This budget opens up comfortable saloons, station wagons, 7-seaters and older compact SUVs. Check service history closely on hybrids and CVT gearboxes.' },
  { max: 2500000, models: 'Mazda CX-5, Subaru Forester, Nissan X-Trail, Honda Vezel, Toyota RAV4, Mazda Atenza and older Toyota Harrier',
    tip: 'At this level you can buy a well kept SUV or crossover. Compare a clean locally used unit with a freshly imported one, which often has lower mileage and a known history.' },
  { max: Infinity, models: 'Toyota Harrier, Mazda CX-5, Subaru Outback, Mercedes-Benz C-Class, BMW 3 Series, Audi A4 and older Toyota Land Cruiser Prado',
    tip: 'Premium and luxury cars cost more to service and insure, so ask for service records and get a pre-purchase inspection from a specialist garage.' },
];
const tierOf = (n) => TIERS.find((t) => n <= t.max);
const BUDGETS = [250000, 300000, 350000, 400000, 450000, 500000, 600000, 650000, 700000, 750000, 800000, 850000, 900000, 950000, 1000000, 1200000, 1300000, 1500000, 1800000, 2000000, 2500000, 3000000];
const budgetSlug = (n) => (n >= 1e6 ? `${String(n / 1e6).replace('.', '-')}-million` : `${n / 1000}k`);

const BUY_TIPS = `<ul><li><b>See the car in person</b> and test drive it on a rough road as well as tarmac.</li><li><b>Check the logbook</b> matches the seller's ID, and run an <b>NTSA motor vehicle search</b> on eCitizen to confirm the owner and any caveats.</li><li><b>Get a pre-purchase inspection</b> at a garage you trust; it costs far less than a hidden fault.</li><li><b>Check the mileage</b> against service records and wear on the pedals, seats and steering wheel.</li><li><b>Never pay before the transfer</b> is agreed in a written sale agreement, and avoid paying deposits to "hold" a car you have not seen.</li></ul>`;

const TYPES = [
  { slug: 'suv', name: 'SUVs', h1: 'Affordable SUVs for sale in Kenya', q: 'body=SUV', cat: (c) => c.body === 'SUV', text: 'SUVs are the most wanted cars in Kenya for their ground clearance on murram and upcountry roads. Under KES 1.5 million look at the Nissan X-Trail, Subaru Forester and Toyota RAV4; under KES 2 million add the Mazda CX-5, Honda Vezel and older Toyota Harrier.' },
  { slug: 'pickup', name: 'pickups', h1: 'Cheap pickups for sale in Kenya', q: 'body=Pickup', cat: (c) => c.body === 'Pickup', text: 'Pickups (double cabs and single cabs) are the workhorses of Kenyan farms and businesses. The Toyota Hilux, Isuzu D-Max, Nissan Navara and Ford Ranger hold their value best and parts are easy to find.' },
  { slug: 'van', name: 'vans', h1: 'Cheap vans for sale in Kenya', q: 'bodies=Van,Bus', cat: (c) => c.body === 'Van' || c.body === 'Bus', text: 'Vans and minibuses suit deliveries, tours, schools and matatu work. The Toyota Hiace, Nissan NV350 Caravan and Toyota Probox are the most common, with parts in every town.' },
  { slug: 'station-wagon', name: 'station wagons', h1: 'Cheap station wagons for sale in Kenya', q: 'body=Station Wagon', cat: (c) => c.body === 'Station Wagon', text: 'Station wagons give you saloon comfort with a big boot. The Toyota Fielder, Subaru Outback and Levorg, and Mazda Atenza wagon are favourites with families and small businesses.' },
  { slug: 'saloon', name: 'saloon cars', h1: 'Cheap saloon cars for sale in Kenya', q: 'body=Sedan', cat: (c) => c.body === 'Sedan', text: 'Saloons are comfortable, economical and easy to sell on. The Toyota Axio, Premio and Allion lead the market, with the Mazda Axela, Nissan Sylphy and Mercedes C-Class for something different.' },
  { slug: 'hybrid', name: 'hybrid cars', h1: 'Cheap hybrid cars for sale in Kenya', q: 'fuel=Hybrid', cat: (c) => c.fuels.includes('Hybrid'), text: 'Hybrids such as the Toyota Aqua, Honda Fit Hybrid, Toyota Prius and Nissan Note e-Power can return 25–35 km/L in town. Ask for the hybrid battery health report before you buy.' },
  { slug: 'automatic', name: 'automatic cars', h1: 'Cheap automatic cars for sale in Kenya', q: 'transmission=Automatic', cat: () => false, text: 'Almost every Japanese car sold in Kenya is automatic or CVT, which makes town driving easy. Check that the gearbox shifts smoothly when cold and that CVT fluid has been changed on schedule.' },
  { slug: '7-seater', name: '7 seater cars', h1: '7 seater cars for sale in Kenya', q: 'bodies=MPV,SUV', cat: (c) => c.seats >= 7, text: 'For big families look at the Toyota Noah, Voxy, Sienta and Wish, or a 7-seat SUV like the Nissan X-Trail, Mazda CX-8 or Toyota Prado. Many fit under KES 1.5 million locally used.' },
  { slug: 'family-car', name: 'family cars', h1: 'Cheap family cars for sale in Kenya', q: 'bodies=MPV,Station Wagon,SUV', cat: (c) => ['MPV', 'Station Wagon'].includes(c.body), text: 'Good family cars balance space, safety and running costs: the Toyota Fielder, Noah and Sienta, Honda Freed, Subaru Forester and Nissan X-Trail are all common, reliable choices.' },
  { slug: '4x4', name: '4x4 cars', h1: 'Affordable 4x4 cars for sale in Kenya', q: 'extra=4WD / AWD', cat: (c) => c.drives.some((d) => /4|AWD/.test(d)), text: 'Four-wheel drive matters for upcountry roads and rainy seasons. Subaru\'s symmetrical AWD (Forester, Outback, XV), the Mitsubishi Outlander and Toyota RAV4 are affordable; the Prado and Land Cruiser for serious off-road use.' },
  { slug: 'german-cars', name: 'German cars', h1: 'Affordable German cars for sale in Kenya', q: 'makes=Mercedes-Benz,BMW,Audi,Volkswagen,Porsche', cat: (c) => ['Mercedes-Benz', 'BMW', 'Audi', 'Volkswagen', 'Porsche'].includes(c.make), text: 'German cars offer comfort and performance at a lower price than you might expect when locally used. Budget more for servicing and parts, and buy from sellers with full service records.' },
  { slug: 'toyota', name: 'Toyota cars', h1: 'Cheap Toyota cars for sale in Kenya', q: 'make=Toyota', cat: (c) => c.make === 'Toyota', text: 'Toyota is Kenya\'s best-selling brand thanks to its reliability, resale value and parts in every town, from the Vitz and Axio to the Fielder, Harrier and Prado.' },
  { slug: 'subaru', name: 'Subaru cars', h1: 'Cheap Subaru cars for sale in Kenya', q: 'make=Subaru', cat: (c) => c.make === 'Subaru', text: 'Subarus are loved in Kenya for all-wheel drive and strong boxer engines. The Forester, Impreza, Legacy, Outback and XV are common; insist on service records for turbo models.' },
  { slug: 'mazda', name: 'Mazda cars', h1: 'Cheap Mazda cars for sale in Kenya', q: 'make=Mazda', cat: (c) => c.make === 'Mazda', text: 'Mazdas are stylish and good on fuel, from the Demio and Axela to the Atenza and CX-5. On SkyActiv diesel engines, ask about regular long drives and DPF health.' },
  { slug: 'fuel-efficient', name: 'fuel efficient cars', h1: 'Fuel efficient cars for sale in Kenya', q: 'bodies=Hatchback', cat: (c) => c.body === 'Hatchback', text: 'With fuel prices high, small engines and hybrids save the most: Toyota Vitz and Aqua, Honda Fit, Mazda Demio, Nissan Note and Suzuki Swift all return 18–30 km/L.' },
  { slug: 'uber-bolt', name: 'Uber and Bolt cars', h1: 'Cheap Uber and Bolt cars for sale in Kenya', q: 'bodies=Sedan,Hatchback,Station Wagon', cat: (c) => ['Sedan', 'Station Wagon'].includes(c.body) && c.priceFrom < 2.5, text: 'Ride-hailing drivers in Kenya favour economical, reliable cars with low running costs: Toyota Axio, Fielder, Premio, Belta, Mazda Demio and Honda Fit. Check the platform\'s current vehicle age and type rules before you buy.' },
];
const LOCS = [
  ['Nairobi', 'county=Nairobi', 'Nairobi', 'Kenya\'s biggest car market, with sellers across Westlands, Kilimani, Karen, Kasarani, Embakasi and along Kiambu Road, Mombasa Road and Ngong Road.'],
  ['Mombasa', 'county=Mombasa', 'Mombasa', 'the coast\'s main market and home of the port where imported cars land, with sellers in Nyali, Bamburi, Mombasa Island and Likoni.'],
  ['Kisumu', 'county=Kisumu', 'Kisumu', 'western Kenya\'s main city, with buyers and sellers from Kisumu Central, Kisumu East and across the lakeside region.'],
  ['Nakuru', 'county=Nakuru', 'Nakuru', 'a busy market on the A104, serving Nakuru town, Naivasha, Gilgil, Molo and Njoro.'],
  ['Eldoret', 'town=Eldoret', 'Uasin Gishu', 'the North Rift\'s commercial hub, popular for pickups and SUVs suited to farm roads.'],
  ['Thika', 'town=Thika', 'Kiambu', 'a fast-growing town on the Thika Superhighway with sellers from Thika, Juja and Ruiru.'],
  ['Kiambu', 'county=Kiambu', 'Kiambu', 'covering Ruiru, Juja, Ruaka, Kikuyu, Limuru, Thika and the car yards along Kiambu Road.'],
  ['Nyeri', 'county=Nyeri', 'Nyeri', 'central Kenya\'s main town, with sellers from Nyeri, Karatina and Othaya.'],
  ['Meru', 'county=Meru', 'Meru', 'serving Meru town, Maua and Nkubu, where SUVs and pickups are popular for the terrain.'],
  ['Machakos', 'county=Machakos', 'Machakos', 'including Machakos town, Athi River, Syokimau and Mlolongo along Mombasa Road.'],
  ['Kitengela', 'town=Kitengela', 'Kajiado', 'a growing town on the Namanga road with buyers from Kitengela, Isinya and Athi River.'],
  ['Naivasha', 'town=Naivasha', 'Nakuru', 'a lakeside town with buyers from the flower farms, hospitality and transport businesses.'],
  ['Kericho', 'county=Kericho', 'Kericho', 'Kenya\'s tea capital, with sellers in Kericho town, Litein and Londiani.'],
  ['Kakamega', 'county=Kakamega', 'Kakamega', 'western Kenya, with sellers across Kakamega town, Mumias and Malava.'],
  ['Bungoma', 'county=Bungoma', 'Bungoma', 'serving Bungoma town, Webuye and Kimilili.'],
  ['Malindi', 'town=Malindi', 'Kilifi', 'on the north coast, with sellers in Malindi, Watamu and Kilifi.'],
  ['Diani', 'town=Diani', 'Kwale', 'on the south coast, with buyers and sellers around Diani and Ukunda.'],
  ['Nanyuki', 'town=Nanyuki', 'Laikipia', 'at the foot of Mt Kenya, where 4x4s and pickups are in demand.'],
];
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
// Link lists used by the home page, Cars for Sale and the HTML sitemap
export const seoLinks = {
  budgets: [...BUDGETS.map((n) => [`Cars under ${kesShort(n)}`, `/cars-under/${budgetSlug(n)}/`]), ['Cars 700k to 1 million', '/cars-under/700k-to-1-million/']],
  types: TYPES.map((t) => [t.h1.replace(' for sale in Kenya', ''), `/used-cars/type/${t.slug}/`]),
  towns: LOCS.map(([n]) => [`Cars for sale in ${n}`, `/cars-for-sale/${slug(n)}/`]),
  guides: [['How to sell a car in Kenya', '/sell-your-car/how-to-sell-a-car-in-kenya/'], ['Car valuation: how much is my car worth?', '/sell-your-car/car-valuation-kenya/'], ['How to buy a used car in Kenya', '/used-cars/buying-guide/'], ['Car financing in Kenya', '/used-cars/car-financing-kenya/']],
};

export function seoPages({ layout, add, site, esc, I, crumbs, faqHtml, faqLd, grid, cars, BODIES, M, slugify, BUILD }) {
  const script = `<script src="/assets/js/market.js?v=${BUILD}" defer></script>`;
  const market = (query, { title, empty = 'No cars listed here yet. New cars are added every day.', limit = 12 } = {}) => `
<section class="block" style="padding-top:8px"><div class="section-head"><div><h2>${title}</h2><p data-mb-count>Loading cars for sale…</p></div><a class="link-arrow" href="/used-cars/?${esc(query)}">See all →</a></div>
  <div data-market-block data-query="${esc(query)}" data-limit="${limit}"><div class="car-grid" data-market-grid></div>
  <div class="empty" data-mb-empty hidden><p class="muted" style="margin:0 0 12px">${empty}</p><a class="btn btn-primary" href="/sell-your-car/">Sell your car here</a> <a class="btn btn-ghost" href="/used-cars/">All cars for sale</a></div></div>
</section>`;
  const sellBand = (where = 'in Kenya') => `<section class="block"><div class="cta-band"><div><h2>Selling a car ${where}?</h2><p>List it from KSh 450. Private sellers and dealers welcome, buyers WhatsApp or call you directly, no commission.</p></div><div class="btns"><a class="btn btn-light" href="/sell-your-car/">Sell your car</a></div></div></section>`;
  const linkList = (items) => `<ul class="chips link-chips">${items.map(([t, u]) => `<li><a class="chip" href="${u}">${esc(t)}</a></li>`).join('')}</ul>`;
  const page = ({ path, crumbsArr, h1, intro, sections, title, description, faq = [], priority = 0.7 }) => {
    const cr = crumbs(crumbsArr);
    const body = `<div class="wrap">${cr.html}<header class="page-head"><h1>${h1}</h1>${intro}</header>${sections}
${faq.length ? `<section class="block"><h2>${esc(h1)}: FAQs</h2>${faqHtml(faq)}</section>` : ''}</div>${script}`;
    add(path, layout({ path, title, description, body, priority, jsonld: [cr.ld, ...(faq.length ? [faqLd(faq)] : [])] }));
  };
  const byPop = (list) => [...list].sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0) || a.priceFrom - b.priceFrom);
  const cheapestImport = Math.min(...cars.map((c) => c.priceFrom)) * 1e6;

  // ---------------------------------------------------------------- budgets
  const budgetLinks = seoLinks.budgets;
  for (const n of BUDGETS) {
    const t = tierOf(n); const short = kesShort(n); const path = `/cars-under/${budgetSlug(n)}/`;
    const imports = byPop(cars.filter((c) => c.priceFrom * 1e6 <= n)).slice(0, 8);
    const h1 = `Cars under ${short} in Kenya`;
    const faq = [
      [`What is the best car under ${short} in Kenya?`, `Popular choices at this budget are ${t.models}. The best one is the cleanest example you can find with honest mileage and service history.`],
      [`Can I import a car for ${short}?`, imports.length ? `Yes. Freshly imported models such as ${imports.slice(0, 3).map((c) => c.name).join(', ')} land from about ${M(Math.min(...imports.map((c) => c.priceFrom)))} including shipping, KRA duty and registration.` : `Usually not. Under the KEBS 8-year rule, imported cars land from about ${kesFull(Math.round(cheapestImport / 1000) * 1000)}, so at ${short} a locally used car is the better route.`],
      [`How do I buy a car under ${short} safely?`, 'View the car in person, check the logbook against the seller\'s ID, run an NTSA search on eCitizen, get a mechanic to inspect it and sign a sale agreement before paying.'],
    ];
    page({ path, crumbsArr: [['Home', '/'], ['Cars for sale', '/used-cars/'], [`Under ${short}`, path]], h1,
      title: `Cars Under ${short.replace('million', 'Million')} in Kenya for Sale | ${site.name}`,
      description: `Cars for sale in Kenya under ${kesFull(n)} from private sellers and dealers. See photos and prices, WhatsApp the seller, and the best cars at this budget.`,
      intro: `<p>Looking to buy a car under ${kesFull(n)}? These are cars for sale across Kenya at ${short} or less, listed by private sellers and dealers, plus the models that usually fit this budget and how to buy safely.</p>`,
      sections: market(`max=${n}&sort=price_desc`, { title: `Cars for sale under ${short}` })
        + `<section class="block prose"><h2>Best cars under ${short} in Kenya</h2><p>At around ${short} you will mostly find ${t.models}. ${t.tip}</p>
        ${imports.length ? `<h3>Import a car for ${short}</h3><p>These models land in Kenya from ${short} or less when imported fresh from Japan, the UK or South Africa, with shipping, duty and registration included.</p>` : `<p>Imported cars land from about ${kesFull(Math.round(cheapestImport / 1000) * 1000)} under the 8-year rule, so at this budget a locally used car is usually the better buy.</p>`}</section>
        ${imports.length ? grid(imports) : ''}
        <section class="block prose"><h2>Tips for buying a car under ${short}</h2>${BUY_TIPS}</section>
        <section class="block"><h2>Browse by budget</h2>${linkList(budgetLinks.filter(([, u]) => u !== path))}</section>${sellBand()}`,
      faq, priority: 0.8 });
  }
  // cars between 700k and 1m
  {
    const path = '/cars-under/700k-to-1-million/';
    page({ path, crumbsArr: [['Home', '/'], ['Cars for sale', '/used-cars/'], ['700k to 1 million', path]], h1: 'Cars between 700k and 1 million in Kenya',
      title: `Cars Between 700k and 1 Million in Kenya | ${site.name}`, description: 'Cars for sale in Kenya priced between KES 700,000 and KES 1 million from private sellers and dealers, plus the best models in this range.',
      intro: '<p>Between KES 700,000 and KES 1 million you can buy a newer compact car or an older family saloon. Here are the cars for sale in this range right now.</p>',
      sections: market('min=700000&max=1000000&sort=price_asc', { title: 'Cars for sale from 700k to 1 million' }) + `<section class="block prose"><h2>Best cars between 700k and 1m</h2><p>Look at ${tierOf(1000000).models}. ${tierOf(1000000).tip}</p>${BUY_TIPS}</section>${sellBand()}` });
  }

  // ---------------------------------------------------------------- types and uses
  const typeLinks = seoLinks.types;
  for (const t of TYPES) {
    const path = `/used-cars/type/${t.slug}/`;
    const imports = byPop(cars.filter(t.cat)).slice(0, 8);
    page({ path, crumbsArr: [['Home', '/'], ['Cars for sale', '/used-cars/'], [t.name[0].toUpperCase() + t.name.slice(1), path]], h1: t.h1,
      title: `${t.h1} | ${site.name}`,
      description: `${t.h1} from private sellers and dealers. Compare prices and photos, WhatsApp the seller, or import one from Japan or the UK.`,
      intro: `<p>${t.text}</p>`,
      sections: market(t.q, { title: `${t.name[0].toUpperCase() + t.name.slice(1)} for sale now` })
        + (imports.length ? `<section class="block"><div class="section-head"><div><h2>Import ${t.name} to Kenya</h2><p>Landed prices including shipping, KRA duty and registration.</p></div></div>${grid(imports)}</section>` : '')
        + `<section class="block prose"><h2>Buying ${t.name} safely</h2>${BUY_TIPS}</section><section class="block"><h2>More car types</h2>${linkList(typeLinks.filter(([, u]) => u !== path))}</section>${sellBand()}` });
  }

  // ---------------------------------------------------------------- locations
  const locLinks = seoLinks.towns;
  for (const [name, q, county, about] of LOCS) {
    const path = `/cars-for-sale/${slugify(name)}/`;
    const faq = [
      [`Where can I buy a car in ${name}?`, `Browse cars for sale in ${name} on ${site.name} from private sellers and dealers, then WhatsApp or call the seller and arrange to view the car locally.`],
      [`How do I sell my car in ${name}?`, `Add your car on ${site.name} with photos and your price, choose ${county === name ? name : `${name} (${county} County)`} as the location and pick a package from KSh 450. Buyers in ${name} and across Kenya contact you directly.`],
      [`Can I import a car and collect it in ${name}?`, `Yes. We import from Japan, the UK and South Africa, clear the car at Mombasa and deliver it to ${name} fully registered.`],
    ];
    page({ path, crumbsArr: [['Home', '/'], ['Cars for sale', '/used-cars/'], [name, path]], h1: `Cars for sale in ${name}`,
      title: `Cars for Sale in ${name}: Buy & Sell Cars | ${site.name}`,
      description: `Cars for sale in ${name} from private sellers and dealers. See prices and photos, WhatsApp the seller, or sell your car in ${name} from KSh 450.`,
      intro: `<p>Buy or sell a car in ${name}, ${about} Every car is listed by a private seller or dealer, and you contact them directly.</p>`,
      sections: market(q, { title: `Cars for sale in ${name} now`, empty: `No cars listed in ${name} yet. Browse all of Kenya or be the first to list one here.` })
        + `<section class="block prose"><h2>Sell your car in ${name}</h2><p>Selling a car in ${name}? List it on ${site.name} with up to 12 photos, set your own price and choose 2 weeks (KSh 450), 1 month (KSh 950) or unlimited until sold (KSh 1,350). Buyers in ${name} and across Kenya WhatsApp or call you directly, with no commission.</p><p><a class="btn btn-primary" href="/sell-your-car/">Sell my car in ${name}</a></p>
        <h2>Buying a car in ${name} safely</h2>${BUY_TIPS}</section>
        <section class="block"><h2>Cars for sale in other towns</h2>${linkList(locLinks.filter(([, u]) => u !== path))}</section>`,
      faq });
  }

  // ---------------------------------------------------------------- "<model> for sale in Kenya"
  for (const c of cars) {
    const path = `/used-cars/${c.slug}/`;
    const versions = c.variants.slice(0, 6).map((v) => v.name).join(', ');
    const faq = [
      [`How much is a ${c.name} in Kenya?`, `Locally used ${c.name} prices depend on year, mileage and condition; see the cars for sale above. A freshly imported ${c.name} lands from about ${M(c.priceFrom)} including shipping, duty and registration.`],
      [`Is the ${c.name} a good car for Kenya?`, c.blurb],
      [`How do I sell my ${c.name}?`, `List it on ${site.name} with photos and your price from KSh 450. Buyers looking for a ${c.name} WhatsApp or call you directly.`],
    ];
    page({ path, crumbsArr: [['Home', '/'], ['Cars for sale', '/used-cars/'], [c.name, path]], h1: `${c.name} for sale in Kenya`,
      title: `${c.name} for Sale in Kenya | ${site.name}`,
      description: `${c.name} for sale in Kenya from private sellers and dealers. Compare prices and photos, WhatsApp the seller, or import one from ${M(c.priceFrom)}.`,
      intro: `<p>${esc(c.blurb)} Find a ${esc(c.name)} for sale in Kenya below, listed by private sellers and dealers, or import a fresh one from ${c.origin.join(', ').replace(/, ([^,]*)$/, ' or $1')}.</p>`,
      sections: market(`make=${encodeURIComponent(c.make)}&model=${encodeURIComponent(c.model)}`, { title: `${esc(c.name)} cars for sale now`, empty: `No ${esc(c.name)} listed right now. Check back soon, see similar ${esc(BODIES[c.body].plural.toLowerCase())}, or import one.` })
        + `<section class="block prose"><h2>${esc(c.name)} price in Kenya</h2><p>A freshly imported ${esc(c.name)} (${esc(c.years)} model years) lands in Kenya from about <b>${M(c.priceFrom)}</b> to <b>${M(c.priceTo)}</b> depending on the version (${esc(versions)}), including shipping, KRA duty, clearing and registration. Locally used units are usually cheaper; compare them in the listings above.</p>
        <p><a class="btn btn-ghost" href="/cars/${c.slug}/">${esc(c.name)} versions, specs & import price →</a></p>
        <h2>Selling your ${esc(c.name)}?</h2><p>There are buyers for the ${esc(c.name)} across Kenya. <a href="/sell-your-car/">List your ${esc(c.model)}</a> from KSh 450 and buyers contact you directly.</p>
        <h2>What to check before you buy</h2>${BUY_TIPS}</section>
        <section class="block"><h2>More ${esc(c.make)} cars for sale</h2>${linkList(cars.filter((x) => x.make === c.make && x !== c).slice(0, 14).map((x) => [`${x.name} for sale`, `/used-cars/${x.slug}/`]))}</section>`,
      faq, priority: 0.6 });
  }

  // ---------------------------------------------------------------- guides
  const guide = (path, crumb, h1, title, description, html, faq) => page({ path, crumbsArr: [['Home', '/'], crumb, [h1, path]], h1, title, description, intro: '', sections: `<article class="prose" style="padding-bottom:16px">${html}</article>${sellBand()}`, faq, priority: 0.7 });
  guide('/sell-your-car/how-to-sell-a-car-in-kenya/', ['Sell your car', '/sell-your-car/'], 'How to sell a car in Kenya', `How to Sell a Car in Kenya: Documents & NTSA | ${site.name}`,
    'How to sell your car in Kenya fast and safely: pricing, where to list, documents needed, the NTSA logbook transfer, a sale agreement and getting paid.',
    `<p>Selling a car privately in Kenya usually gets you a better price than a trade-in or a quick cash buyer, if you prepare well. Here is the full process.</p>
    <h2>1. Price it right</h2><p>Compare similar cars (same model, year, mileage and condition) on <a href="/used-cars/">${site.name}</a> and other listings, then set a realistic asking price with a little room to negotiate. See our <a href="/sell-your-car/car-valuation-kenya/">car valuation guide</a>.</p>
    <h2>2. Prepare the car</h2><ul><li>Wash and vacuum it, and fix small faults that put buyers off (bulbs, wipers, warning lights).</li><li>Gather service records, the logbook, your ID and KRA PIN.</li><li>Take clear photos in daylight: front, back, both sides, interior, dashboard showing mileage, engine and tyres.</li></ul>
    <h2>3. List it where buyers look</h2><p><a href="/sell-your-car/">List your car on ${site.name}</a> from KSh 450 (2 weeks), KSh 950 (1 month) or KSh 1,350 (until sold). Buyers WhatsApp or call you directly and there is no commission. Dealers can list too.</p>
    <h2>4. Meet buyers safely</h2><p>Meet in a public place in daylight, go on the test drive with the buyer, and do not hand over keys or the logbook until you have been paid in full.</p>
    <h2>5. Documents needed to sell a car in Kenya</h2><ul><li>The original logbook (in your name)</li><li>Your national ID and KRA PIN, and the buyer's ID and KRA PIN</li><li>A written sale agreement signed by both of you</li><li>If the car is on a loan, a release letter from the lender before transfer</li></ul>
    <h2>6. Transfer ownership with NTSA</h2><p>Ownership is transferred online through the NTSA portal on eCitizen. The seller starts the transfer and the buyer accepts it, then the transfer fee shown on the portal is paid and NTSA issues a new logbook in the buyer's name. Keep copies of everything.</p>
    <h2>7. Write a sale agreement</h2><p>A simple car sale agreement should include: both parties' names, ID numbers and phone numbers; the car's make, model, registration, chassis and engine numbers; the price and how it is paid; the date and time of handover; that the car is sold as seen; and who handles the NTSA transfer. Both parties sign and keep a copy.</p>
    <h2>8. Get paid safely</h2><p>Use a bank transfer or banker's cheque you can verify with the bank, or M-Pesa for smaller amounts. Confirm the money has cleared before handing over the car.</p>`,
    [['What does it cost to sell a car in Kenya?', `On ${site.name}, listing costs KSh 450 for 2 weeks, KSh 950 for 1 month or KSh 1,350 until sold, with no commission. Budget separately for the NTSA transfer fee shown on eCitizen.`],
      ['Can I sell a car without a logbook in Kenya?', 'You cannot legally transfer ownership without the logbook. If it is lost, apply for a replacement through NTSA on eCitizen before selling. If the car is on a loan, the lender holds the logbook until it is paid off.'],
      ['Can I sell a car that is still on a loan?', 'Yes, but the lender must be paid off first, usually from the buyer\'s payment, and issue a release letter so the logbook can be transferred. Agree the steps in the sale agreement.']]);
  guide('/sell-your-car/car-valuation-kenya/', ['Sell your car', '/sell-your-car/'], 'How much is my car worth in Kenya?', `Car Valuation Kenya: How Much Is My Car Worth? | ${site.name}`,
    'How to value a used car in Kenya: what affects second hand car prices, how to compare listings, professional valuation and pricing to sell fast.',
    `<p>Knowing what your car is worth helps you sell it quickly without leaving money on the table. Here is how to value a used car in Kenya.</p>
    <h2>What affects a used car's value</h2><ul><li><b>Model and demand:</b> popular Toyotas, Mazdas, Subarus and Nissans resell fastest.</li><li><b>Year and mileage:</b> lower mileage and newer year of manufacture add value.</li><li><b>Condition and history:</b> service records, accident history and the state of tyres, paint and interior.</li><li><b>Locally used vs foreign used:</b> fresh imports usually sell for more than locally used units of the same year.</li><li><b>Engine size and fuel:</b> economical engines and hybrids are in demand while fuel prices are high.</li></ul>
    <h2>How to value your car</h2><ol><li>Search <a href="/used-cars/">cars for sale</a> for the same model, year range and mileage and note the asking prices.</li><li>Check what a freshly imported unit costs in our <a href="/cars/">import catalogue</a>; a locally used car usually sells below that.</li><li>Adjust for condition, history and extras like a sunroof or new tyres.</li><li>For insurance or financing, get a formal valuation report from an insurer-approved motor valuer.</li></ol>
    <h2>Price to sell</h2><p>Set your asking price slightly above the lowest price you will accept, and be ready to show service records. A clean car with honest photos and a fair price sells fastest.</p>
    <p>KRA's Current Retail Selling Price (CRSP) list is used to calculate import duty, not to value locally used cars, so do not use it as your selling price.</p>`,
    [['Is there a free car valuation in Kenya?', `You can do your own free valuation by comparing similar cars for sale on ${site.name}. A formal valuation report from an approved valuer usually costs a fee.`],
      ['Does accident history reduce value?', 'Yes. Buyers pay more for accident-free cars. Be honest about any accident; on Buy Car in Kenya you state accident history on your listing.']]);
  guide('/used-cars/buying-guide/', ['Cars for sale', '/used-cars/'], 'How to buy a used car in Kenya', `How to Buy a Used Car in Kenya Safely | ${site.name}`,
    'Buying a second hand car in Kenya: locally used vs foreign used, NTSA search, logbook checks, inspection, sale agreement, financing and avoiding scams.',
    `<p>Whether you are buying from a private seller, a dealer or importing, these steps help you buy a used car in Kenya with confidence.</p>
    <h2>Locally used vs foreign used</h2><p><b>Locally used</b> cars have already been driven in Kenya, are cheaper and can be bought immediately, but you need to check their history carefully. <b>Foreign used</b> (freshly imported) cars usually have lower mileage and a verifiable auction sheet, but cost more and take weeks to arrive. Browse <a href="/used-cars/">cars for sale</a> or <a href="/cars/">import a car</a>.</p>
    <h2>Checks before you pay</h2>${BUY_TIPS}
    <h2>Run an NTSA motor vehicle search</h2><p>On the NTSA portal on eCitizen you can search a registration number to confirm the registered owner and whether there are caveats, such as a loan, before you buy.</p>
    <h2>Financing a car</h2><p>Banks, SACCOs and asset finance companies offer car loans and hire purchase. You typically pay a deposit, the lender holds the logbook until the loan is repaid, and comprehensive insurance and a tracking device are usually required. Compare the total cost, not just the monthly payment.</p>
    <h2>Repossessed, auction and urgent sales</h2><p>Bank repossessed and auction cars can be good value, but they are usually sold as seen with no warranty. Inspect them, confirm the auctioneer is licensed and check the paperwork before bidding. Be extra careful with "urgent sale" adverts asking for deposits before viewing.</p>`,
    [['What documents should I get when buying a used car?', 'The original logbook, a signed sale agreement, copies of the seller\'s ID and KRA PIN, and confirmation that the NTSA transfer has been started.'],
      ['Should I buy a locally used or foreign used car?', 'Locally used cars are cheaper and available now; foreign used cars usually have lower mileage and a clearer history. Inspect either before paying.']]);
  guide('/used-cars/car-financing-kenya/', ['Cars for sale', '/used-cars/'], 'Car financing in Kenya', `Car Financing in Kenya: Hire Purchase & Loans | ${site.name}`,
    'How car financing works in Kenya: asset finance, hire purchase and lipa pole pole, logbook loans, typical requirements and tips to compare offers.',
    `<p>Most car buyers in Kenya finance at least part of the price. Here is how the main options work.</p>
    <h2>Asset finance (car loans)</h2><p>Banks and finance companies lend you most of the car's price; you pay a deposit and repay monthly over a few years. The car is registered jointly with the lender, who keeps the logbook until you finish paying.</p>
    <h2>Hire purchase and "lipa pole pole"</h2><p>Some dealers and car yards let you pay in instalments directly. Read the agreement carefully: check the total amount payable, what happens if you miss a payment and when the logbook is transferred.</p>
    <h2>SACCO car loans</h2><p>If you are a SACCO member, a car loan based on your savings can be cheaper than a bank loan. Ask your SACCO about its terms.</p>
    <h2>Logbook loans</h2><p>A logbook loan uses a car you already own as security. They are quick but often expensive, so use them carefully.</p>
    <h2>Typical requirements</h2><ul><li>National ID and KRA PIN</li><li>Bank statements, plus payslips or business records</li><li>A deposit</li><li>A valuation report for the car</li><li>Comprehensive insurance, and often a tracking device</li></ul>
    <h2>Tips</h2><p>Compare the total cost of credit, not just the monthly payment; ask about early repayment; and make sure the car passes inspection before you sign. Then find your car in <a href="/used-cars/">cars for sale</a> or <a href="/cars/">import one</a>.</p>`,
    [['Can I buy a locally used car on finance in Kenya?', 'Yes. Many lenders finance locally used cars, usually subject to the car\'s age, a valuation and comprehensive insurance.'],
      ['Can I finance an imported car?', 'Yes. Import financing is available from some lenders; the car is usually valued after it lands and is registered jointly with the lender.']]);

}
