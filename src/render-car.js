// Renders a model page (/cars/<slug>/) or a version page (/cars/<slug>/<version>/).
// Receives the shared helpers from build.js so both page types stay identical in layout.
export function makeRenderCar(h) {
  const { cars, site, ORIGINS, BODIES, I, YEAR, MIN_YEAR, esc, M, range, abs, plural, listJoin, fit, cc, kmL, slugify, imgs, mainImg, pub, waLink, crumbs, faqHtml, faqLd, grid, orderModal, layout, add } = h;

  return function renderCar(c, v = null) {
    const sel = v || c.variants[0];
    const base = `/cars/${c.slug}/`;
    const path = v ? `${base}${v.id}/` : base;
    const full = v ? `${c.name} ${v.name}` : c.name;
    const gallery = imgs(c.slug);
    const crumbItems = [['Home', '/'], ['All cars', '/cars/'], [c.make, `/make/${slugify(c.make)}/`], [c.model, base]];
    if (v) crumbItems.push([v.name, path]);
    const cr = crumbs(crumbItems);
    const cheapest = c.variants.reduce((a, b) => (b.price[0] < a.price[0] ? b : a));
    const strongest = c.variants.reduce((a, b) => (b.hp > a.hp ? b : a));
    const frugal = c.variants.filter((x) => kmL(x)).reduce((a, b) => (kmL(b) > kmL(a) ? b : a), c.variants.find((x) => kmL(x)) || sel);
    const origins = c.origin.map((o) => `<a href="/import-from/${ORIGINS[o].slug}/">${o}</a>`);
    const fastest = c.origin.map((o) => ORIGINS[o]).sort((a, b) => parseInt(a.transit) - parseInt(b.transit))[0];
    const related = cars.filter((x) => x !== c && x.body === c.body).sort((a, b) => Math.abs(a.priceFrom - c.priceFrom) - Math.abs(b.priceFrom - c.priceFrom)).slice(0, 3);
    const econ = [...new Set(c.variants.map((x) => x.economy))];
    const vUrl = (x) => `${base}${x.id}/`;
    const multi = c.variants.length > 1;

    const faq = v ? [
      [`How much is the ${full} in Kenya?`, `The ${full} costs about ${range(...v.price)} landed in Kenya for a ${MIN_YEAR}+ unit, including shipping, KRA duty, clearing and registration. The exact price depends on year, mileage and auction grade.`],
      [`What are the specs of the ${full}?`, `The ${full} has a ${cc(v)} ${v.fuel.toLowerCase()} engine producing ${v.hp} hp, a ${v.trans} gearbox and ${v.drive} drive, and returns about ${v.economy}.`],
      ...(v.note ? [[`What features does the ${full} have?`, `The ${v.name} adds: ${v.note}. Every ${c.name} includes: ${c.features.join(', ')}.`]] : []),
      [`Where can I import the ${full} from?`, `We import the ${c.name} from ${listJoin(c.origin)}. Shipping to Mombasa takes about ${fastest.transit} on the fastest route.`],
      [`Can I import a ${full} under the 8-year rule?`, `Yes. In ${YEAR} you can import units first registered in ${MIN_YEAR} or later. We only source compliant cars.`],
    ] : [
      [`How much does it cost to import a ${c.name} to Kenya?`, `A ${c.name} (${c.years}) costs about ${range(c.priceFrom, c.priceTo)} landed in Kenya, depending on the version, year, mileage and grade. The ${cheapest.name} is the most affordable at around ${range(...cheapest.price)}. This includes the car, shipping, KRA duty, clearing and registration.`],
      ...(multi ? [[`Which ${c.name} version should I buy?`, `For the lowest price, choose the ${cheapest.name}. ${frugal !== cheapest && kmL(frugal) ? `For the best fuel economy, the ${frugal.name} returns about ${frugal.economy}. ` : ''}${strongest !== cheapest ? `For the most power, the ${strongest.name} makes ${strongest.hp} hp.` : ''} Our team can advise based on how and where you drive.`]] : []),
      [`What features does the ${c.name} have?`, `Key ${c.name} features include: ${c.features.join(', ')}.`],
      [`Where do you import the ${c.name} from?`, `We import the ${c.name} from ${listJoin(c.origin)}. The fastest route is about ${fastest.transit} shipping to Mombasa.`],
      [`Can I import a ${c.name} under the 8-year rule?`, `Yes. In ${YEAR} you can import a ${c.name} first registered in ${MIN_YEAR} or later. We only source compliant units.`],
      [`What is the fuel consumption of the ${c.name}?`, `Depending on the version, the ${c.name} returns about ${econ.join(', ')}. Real-world figures depend on traffic and driving style.`],
    ];

    const photoAlt = (i) => `${full} ${c.body.toLowerCase()} for sale in Kenya, import from ${listJoin(c.origin)}${i ? `, photo ${i + 1}` : ''}`;
    const photoTitle = `${full} price in Kenya | ${site.name}`;
    const vName = (x) => multi ? `<a href="${vUrl(x)}" title="${esc(`${c.name} ${x.name} price in Kenya`)}">${esc(x.name)}</a>` : esc(x.name);
    const variantRows = c.variants.map((x) => `<tr${x === v ? ' class="current"' : ''}><th scope="row">${vName(x)}</th><td class="num nowrap"><b>${range(...x.price)}</b></td><td>${x.cc ? (x.cc / 1000).toFixed(1) + 'L ' : ''}${x.fuel}</td><td class="num nowrap">${x.hp} hp</td><td>${x.trans.replace('Automatic', 'Auto')}</td><td>${x.drive}</td><td class="nowrap">${x.economy}</td><td class="small">${esc(x.note || '–')}</td></tr>`).join('');
    const specRows = [['Make', c.make], ['Model', c.model], ['Version', sel.name], ['Engine', cc(sel)], ['Fuel', sel.fuel], ['Power', `${sel.hp} hp`], ['Transmission', sel.trans], ['Drive', sel.drive], ['Economy', sel.economy], ['Seats', c.seats], ['Body type', c.body], ['Model years', c.years], ['Import from', c.origin.join(', ')], ['Est. landed price', range(...sel.price)]];
    const checks = (list) => `<ul class="feature-list">${list.map((f) => `<li>${I.check}<span>${esc(f)}</span></li>`).join('')}</ul>`;

    const body = `<div class="wrap">${cr.html}
<div class="detail">
  <div class="d-gallery">
    <figure class="gallery" style="margin:0">
      <div class="main"><img src="${mainImg(c.slug)}" alt="${esc(photoAlt(0))}" title="${esc(photoTitle)}" width="1200" height="800" fetchpriority="high" data-gallery-main></div>
      ${gallery.length > 1 ? `<div class="thumbs" role="list">${gallery.map((g, i) => `<button type="button" role="listitem" aria-label="Show photo ${i + 1}" aria-current="${i === 0}" data-src="/assets/img/cars/${pub(g.file)}" data-alt="${esc(photoAlt(i))}" data-credit="${esc(`${g.artist} · ${g.license}`)}" data-source="${esc(g.source)}"><img src="/assets/img/cars/${pub(g.file.replace('.webp', '-sm.webp'))}" alt="${esc(photoAlt(i))}" title="${esc(photoTitle)}" width="120" height="80" loading="lazy"></button>`).join('')}</div>` : ''}
      ${gallery[0] ? `<figcaption>${esc(full)}. Photo: <a href="${esc(gallery[0].source)}" target="_blank" rel="noopener nofollow" data-credit-link>${esc(gallery[0].artist)} · ${esc(gallery[0].license)}</a>, via Wikimedia Commons. Representative image, actual unit may vary.</figcaption>` : ''}
    </figure>
  </div>
  <aside class="side">
    <div class="detail-head">
      <span class="make"><a href="/make/${slugify(c.make)}/" style="text-decoration:none">${esc(c.make)}</a> · <a href="/body-type/${BODIES[c.body].slug}/" style="text-decoration:none">${esc(c.body)}</a></span>
      <h1>${esc(full)}${v ? '<span class="h1-sub">Price in Kenya & full specs</span>' : ''}</h1>
      <p class="muted" style="margin:0">${esc(v && v.note ? `${v.note}. ` : '')}${esc(c.blurb)}</p>
    </div>
    <dl class="facts">
      <div><dt>Years</dt><dd>${esc(c.years)}</dd></div>
      <div><dt>Seats</dt><dd>${c.seats}</dd></div>
      <div><dt>Fuel</dt><dd>${v ? v.fuel : c.fuels.join(' / ')}</dd></div>
      <div><dt>Drive</dt><dd>${v ? v.drive : c.drives.join(' / ')}</dd></div>
      <div><dt>Import from</dt><dd>${c.origin.map((o) => ORIGINS[o].code).join(' · ')}</dd></div>
      <div><dt>Shipping</dt><dd>${fastest.transit}</dd></div>
    </dl>
    <h2 style="font-size:1.15rem;margin:0">1. Choose your version</h2>
    <div class="variant-list" role="radiogroup" aria-label="Choose version">
      ${c.variants.map((x) => `<label class="variant"><input type="radio" name="pick-variant" value="${esc(x.id)}"${x === sel ? ' checked' : ''}>
        <div class="top"><div class="name"><span class="radio"></span><b>${esc(x.name)}</b></div><div class="p num">${M(x.price[0])}<small>to ${M(x.price[1])}</small></div></div>
        <div class="specs-mini"><span>${x.cc ? (x.cc / 1000).toFixed(1) + 'L' : 'EV'} ${x.fuel}</span><span>${x.hp} hp</span><span>${x.trans.replace(' Automatic', ' Auto')}</span><span>${x.drive}</span><span>${x.economy}</span></div>
        ${x.note ? `<p class="v-note">${esc(x.note)}</p>` : ''}
        ${multi && x !== v ? `<a class="v-link" href="${vUrl(x)}" title="${esc(`${c.name} ${x.name} price in Kenya & specs`)}">${esc(x.name)} full specs →</a>` : ''}
      </label>`).join('')}
    </div>
    <h2 style="font-size:1.15rem;margin:0 0 10px">2. Review specs & order</h2>
    <div class="order-box">
      <table class="spec kv" data-spec-table><tbody>
        <tr><th>Version</th><td data-spec="name">${esc(sel.name)}</td></tr><tr><th>Engine</th><td data-spec="engine">${cc(sel)}</td></tr><tr><th>Fuel</th><td data-spec="fuel">${sel.fuel}</td></tr>
        <tr><th>Power</th><td data-spec="hp">${sel.hp} hp</td></tr><tr><th>Transmission</th><td data-spec="trans">${sel.trans}</td></tr><tr><th>Drive</th><td data-spec="drive">${sel.drive}</td></tr>
        <tr><th>Economy</th><td data-spec="economy">${sel.economy}</td></tr><tr><th>Trim adds</th><td data-spec="note">${esc(sel.note || '–')}</td></tr><tr><th>Seats</th><td>${c.seats}</td></tr>
      </tbody></table>
      <div class="sel"><div class="price-from"><small>Est. landed price</small><b class="num" data-spec="price">${range(...sel.price)}</b></div></div>
      <button class="btn btn-primary btn-block" type="button" data-open-order>Order this spec</button>
      <a class="btn btn-ghost btn-block" href="/import-request/?car=${c.slug}" data-request-link>Request a different year / spec</a>
      <p class="disclaimer">Indicative price for a ${MIN_YEAR}+ unit, including shipping, KRA taxes, clearing and registration. Final price is confirmed in your free written quote.</p>
    </div>
  </aside>
  <div class="d-info">
    <section>
      <h2>${esc(c.name)} key features</h2>
      ${checks(c.features)}
      ${v && v.note ? `<h3 style="margin-top:18px">What the ${esc(v.name)} adds</h3>${checks(v.note.split(/,\s*/))}` : ''}
    </section>
    ${v ? `<section style="margin-top:32px"><h2>${esc(full)} specifications</h2><div class="spec-table-wrap"><table class="spec kv"><tbody>${specRows.map(([k, val]) => `<tr><th>${k}</th><td>${esc(String(val))}</td></tr>`).join('')}</tbody></table></div></section>` : ''}
    <section style="margin-top:32px">
      <h2>${v ? `Compare all ${esc(c.name)} versions` : `${esc(c.name)} versions & specs compared`}</h2>
      <p class="muted">${plural(c.variants.length, 'version')} we commonly import.${multi ? ' Tap a version for its own full specs page.' : ''} Prices are indicative landed estimates in Kenya shillings.</p>
      <div class="spec-table-wrap"><table class="spec wide"><thead><tr><th>Version</th><th>Landed (est.)</th><th>Engine</th><th>Power</th><th>Gearbox</th><th>Drive</th><th>Economy</th><th>Trim adds</th></tr></thead><tbody>${variantRows}</tbody></table></div>
    </section>
    <section class="prose" style="margin-top:32px">
      <h2>Importing a ${esc(full)} to Kenya</h2>
      <p>${esc(c.blurb)} At ${site.name} we import the ${esc(c.name)} from ${listJoin(origins)}, in ${plural(c.variants.length, 'version')} covering ${listJoin(c.fuels.map((f) => f.toLowerCase()))} power.${v ? ` This page covers the <b>${esc(v.name)}</b>: ${cc(v)}, ${v.hp} hp, ${esc(v.trans)}, ${v.drive}.` : ''}</p>
      <p>Under the KEBS 8-year rule you can import ${esc(c.name)} units first registered in <b>${MIN_YEAR} or later</b>. ${v ? `The ${esc(v.name)} lands at about <b>${range(...v.price)}</b>.` : `Landed prices range from about <b>${M(c.priceFrom)}</b> for the ${esc(cheapest.name)} to <b>${M(c.priceTo)}</b> for the top-spec models.`} Your final price depends on year, mileage, auction grade and exchange rate, and we confirm it in writing before you commit.</p>
      <h3>What's included in our landed price?</h3>
      <ul><li>Vehicle purchase price in ${listJoin(c.origin)}</li><li>Pre-shipment roadworthiness inspection</li><li>Shipping and marine insurance to Mombasa</li><li>KRA import duty, excise duty, VAT, IDF and RDL</li><li>Port charges, clearing and agency fees</li><li>NTSA registration and Kenyan number plates</li></ul>
      <p>See also: <a href="/make/${slugify(c.make)}/">all ${esc(c.make)} models</a> · <a href="/body-type/${BODIES[c.body].slug}/">all ${esc(BODIES[c.body].plural.toLowerCase())}</a>${v ? ` · <a href="${base}">${esc(c.name)} overview</a>` : ''}</p>
    </section>
    <section style="margin-top:32px"><h2>${esc(full)} FAQs</h2>${faqHtml(faq)}</section>
  </div>
</div>
${related.length ? `<section class="block" style="padding-top:16px"><div class="section-head"><div><h2>Similar ${BODIES[c.body].plural.toLowerCase()}</h2></div><a class="link-arrow" href="/body-type/${BODIES[c.body].slug}/">See all →</a></div>${grid(related)}</section>` : ''}
</div>
<div class="action-bar car"><div class="price-mini"><b class="num" data-bar-price>${M(sel.price[0])}+</b><span data-bar-name>${esc(sel.name)}</span></div><button class="btn btn-primary" type="button" data-open-order>Order this spec</button></div>
${orderModal(c)}
<script type="application/json" id="car-data">${JSON.stringify({ slug: c.slug, name: c.name, make: c.make, model: c.model, base: abs(base), url: abs(path), defaultId: sel.id, variants: c.variants.map((x) => ({ id: x.id, name: x.name, engine: cc(x), fuel: x.fuel, hp: x.hp, trans: x.trans, drive: x.drive, economy: x.economy, note: x.note || '', price: range(...x.price), from: M(x.price[0]) })) }).replace(/</g, '\\u003c')}</script>`;

    const images = gallery.map((g) => ({ loc: abs(`/assets/img/cars/${pub(g.file)}`), title: photoTitle, caption: photoAlt(0) }));
    const productLd = {
      '@context': 'https://schema.org', '@type': ['Product', 'Car'], name: full, brand: { '@type': 'Brand', name: c.make }, manufacturer: { '@type': 'Organization', name: c.make }, model: c.model, bodyType: c.body, url: abs(path),
      image: images.map((i) => i.loc), description: `${v && v.note ? v.note + '. ' : ''}${c.blurb} Import the ${full} to Kenya from ${listJoin(c.origin)}.`, vehicleSeatingCapacity: c.seats, itemCondition: 'https://schema.org/UsedCondition',
      ...(v ? { vehicleConfiguration: v.name, fuelType: v.fuel, vehicleTransmission: v.trans, driveWheelConfiguration: v.drive, ...(v.cc ? { vehicleEngine: { '@type': 'EngineSpecification', engineDisplacement: { '@type': 'QuantitativeValue', value: v.cc, unitCode: 'CMQ' }, enginePower: { '@type': 'QuantitativeValue', value: v.hp, unitCode: 'BHP' } } } : {}) } : { fuelType: c.fuels.join(', ') }),
      additionalProperty: c.features.map((f) => ({ '@type': 'PropertyValue', name: 'Feature', value: f })),
      offers: { '@type': 'AggregateOffer', priceCurrency: 'KES', lowPrice: Math.round((v ? v.price[0] : c.priceFrom) * 1e6), highPrice: Math.round((v ? v.price[1] : c.priceTo) * 1e6), offerCount: v ? 1 : c.variants.length, availability: 'https://schema.org/PreOrder', seller: { '@id': abs('/#dealer') } },
    };
    const title = v
      ? fit(`${full} Price in Kenya & Specs | ${site.name}`, `${full} Price in Kenya | ${site.name}`, `${full} Price in Kenya`, `${full} Kenya`)
      : fit(`${c.name} Import Kenya: Price, Specs & Versions | ${site.name}`, `${c.name} Import Kenya: Prices & Specs | ${site.name}`, `${c.name} Import Kenya: Price & Specs`, `${c.name} Import to Kenya`);
    const description = v
      ? `${full} price in Kenya: ${range(...v.price)} landed. ${cc(v)} ${v.fuel.toLowerCase()}, ${v.hp} hp, ${v.trans}, ${v.drive}. ${v.note ? v.note + '. ' : ''}Import from ${listJoin(c.origin)}.`
      : `Import a ${c.name} to Kenya from ${listJoin(c.origin)}. ${plural(c.variants.length, 'version')} (${c.fuels.join('/')}) from ${M(c.priceFrom)} landed. Features, specs & order on WhatsApp.`;
    add(path, layout({ path, bar: 'car', image: mainImg(c.slug), preload: mainImg(c.slug), priority: v ? 0.7 : c.popular ? 0.9 : 0.8, images, title, description, body, jsonld: [cr.ld, productLd, faqLd(faq)] }));
  };
}
