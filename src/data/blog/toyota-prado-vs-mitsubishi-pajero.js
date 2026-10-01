export default (h) => {
  const { YEAR, MIN_YEAR, P, F, c, v, cta, table, telA, waA } = h;
  const p = 'toyota-land-cruiser-prado', j = 'mitsubishi-pajero';
  return {
    slug: 'toyota-prado-vs-mitsubishi-pajero',
    keyword: 'Toyota Prado vs Mitsubishi Pajero in Kenya',
    tag: 'Comparison',
    cluster: 'SUVs & crossovers',
    crumb: 'Prado vs Pajero (and more)',
    title: `Prado vs Pajero in Kenya (${YEAR}): Price, Toughness, Resale`,
    description: `Toyota Prado vs Mitsubishi Pajero in Kenya: price, reliability, off-road ability and resale compared, plus Pajero Sport vs Fortuner and CX-5 vs Forester.`,
    h1: `Toyota Prado vs Mitsubishi Pajero in Kenya (${YEAR}): Price, Toughness and Resale Compared, Plus Other Popular SUV Match-Ups`,
    excerpt: `Prado or Pajero? A full comparison for Kenyan buyers on price, reliability, off-road ability, comfort and resale, plus quick verdicts on Pajero Sport vs Fortuner and CX-5 vs Forester.`,
    published: '2026-10-01',
    updated: '2026-10-01',
    cars: [p, j, 'mitsubishi-pajero-sport', 'toyota-fortuner', 'subaru-forester', 'mazda-cx-5'],
    html: `
<p>The <b>Toyota Prado vs Mitsubishi Pajero</b> question has divided Kenyan 4x4 fans for decades. Both are proper off-roaders with seven seats and real toughness. However, the Prado costs more, while the Pajero offers more metal for the money. Therefore, the right choice depends on your budget, your roads and how long you plan to keep the car.</p>
<p>A compliant Prado lands from about <b>${F(p)}</b>, while a Pajero starts near <b>${F(j)}</b>. That is a big gap. Yet resale value, parts supply and comfort narrow it over time.</p>
<p>This guide compares the two in detail. It also gives quick verdicts on other popular match-ups: Pajero Sport vs Fortuner and CX-5 vs Forester. Furthermore, it explains how Elisa Motors can quote any of them side by side.</p>
${cta('Want Prado and Pajero quotes?', 'We can price both on one page.', 'Hi Elisa Motors, please compare Prado and Pajero prices for me.')}

<h2>Price comparison (${YEAR})</h2>
<p>These indicative landed prices include shipping, KRA duty, clearing and registration for ${MIN_YEAR}-or-newer units.</p>
${table([j, p], 'Mitsubishi Pajero and Toyota Prado landed prices in Kenya')}
<p>The Pajero is clearly cheaper to buy. However, the Prado holds its value far better. As a result, the true cost difference over five years is smaller than the purchase price suggests.</p>

<h2>Engines</h2>
<h3>Mitsubishi Pajero</h3>
<p>The ${v(j, 'exceed-3-8-v6-petrol', 'Pajero Exceed 3.8 V6 petrol')} lands at about <b>${P(j, 'exceed-3-8-v6-petrol')}</b>. It is smooth and powerful but thirsty. Meanwhile, the ${v(j, 'gls-3-2-di-d-diesel', 'GLS 3.2 DI-D diesel')} costs about <b>${P(j, 'gls-3-2-di-d-diesel')}</b>. It has strong torque and decent economy.</p>
<h3>Toyota Prado</h3>
<p>The Prado offers a 2.7 petrol and a 2.8 turbo-diesel. The diesel is modern, efficient and strong. In contrast, the petrol is simple and reliable. Read our <a href="/blog/toyota-prado-price-in-kenya/">Prado price guide</a> for every grade.</p>

<h2>Reliability and parts</h2>
<p>The Prado has the stronger reliability reputation in Kenya. Toyota parts are everywhere, from Kirinyaga Road to small county towns. Moreover, almost every mechanic knows the Prado.</p>
<p>The Pajero is also tough. However, Mitsubishi parts are less widespread, especially upcountry. Therefore, Pajero owners in remote areas should plan for longer parts lead times.</p>

<h2>Off-road ability</h2>
<p>Both are excellent off-road. The Pajero uses a monocoque body with a built-in ladder frame and Super Select 4WD. The Prado uses a full ladder frame, low range and, on many grades, KDSS and multi-terrain systems.</p>
<p>In practice, both handle Mara tracks and muddy upcountry roads well. The Prado has a slight edge thanks to modern traction aids on higher grades.</p>

<h2>Comfort and cabin</h2>
<p>The Prado's cabin is more modern, especially on later models. The Pajero's cabin feels older, because its design dates back many years. However, the Pajero is spacious and comfortable on long trips.</p>

<h2>Resale value</h2>
<p>The Prado wins clearly. It is one of the best value-retaining vehicles in Kenya. Meanwhile, the Pajero depreciates faster. As a result, the Prado's higher price is partly recovered when you sell.</p>

<h2>Availability</h2>
<p>Mitsubishi ended Pajero production for Japan in 2019 and later worldwide. Therefore, importable Pajeros are limited to the final model years. In contrast, the Prado has a large supply and a new successor, the Land Cruiser 250.</p>

<h2>Verdict: Prado or Pajero?</h2>
<p>Choose the <b>Prado</b> if you want reliability, easy parts, modern features and strong resale. Choose the <b>Pajero</b> if you want a capable seven-seat 4x4 at a lower purchase price and accept faster depreciation.</p>

${h.specs(j)}

<h2>Pajero Sport vs Toyota Fortuner</h2>
<p>These two are pickup-based seven-seat SUVs, both popular from South Africa. The ${c('mitsubishi-pajero-sport', 'Pajero Sport')} lands from about ${F('mitsubishi-pajero-sport')}. The ${c('toyota-fortuner', 'Fortuner')} starts near ${F('toyota-fortuner')}.</p>
<p>The Pajero Sport has a smooth eight-speed gearbox and a comfortable ride. Meanwhile, the Fortuner shares the Hilux's tough mechanicals and strong resale. Consequently, many Kenyan buyers choose the Fortuner for long-term value. Read our <a href="/import-from/south-africa/">South Africa import page</a>.</p>
${h.specs('toyota-fortuner')}

<h2>Mazda CX-5 vs Subaru Forester</h2>
<p>The ${c('mazda-cx-5', 'CX-5')} is more premium inside and handles more sharply. The ${c('subaru-forester', 'Forester')} has standard AWD, more ground clearance and a roomier cabin. Therefore, choose the CX-5 for city and highway use, and the Forester for rough roads. Read our <a href="/blog/mazda-cx-5-price-in-kenya/">CX-5 price guide</a>.</p>

<h2>Toyota Harrier vs Nissan Murano</h2>
<p>The Nissan Murano is a comfortable crossover with a V6 or hybrid engine. However, it is less common in Kenya, and parts are harder to find. The Harrier offers better resale and easier servicing. Read our <a href="/blog/toyota-harrier-price-in-kenya/">Harrier price guide</a>.</p>

<h2>Our services: import any of these SUVs</h2>
<p>Elisa Motors imports all of them. Here is what we do for buyers in Nairobi, Mombasa, Nakuru, Kisumu, Eldoret and beyond.</p>

<h3>1. Side-by-side quotes</h3>
<p>We price two or three models on one page with every cost included. As a result, you compare real numbers.</p>
<p>Ask for any combination you are considering.</p>

<h3>2. Sourcing from Japan and South Africa</h3>
<p>Prados and Pajeros come mainly from Japan. Fortuners and Pajero Sports come from South Africa. We find the best unit wherever it is.</p>
<p>Read our <a href="/blog/import-cars-from-japan-to-kenya/">Japan import guide</a>.</p>

<h3>3. Mileage and history checks</h3>
<p>We verify mileage and condition before buying. Read our <a href="/blog/check-mileage-japanese-cars-kenya/">mileage check guide</a>.</p>
<p>Cars with doubtful records are rejected.</p>

<h3>4. Off-road damage inspection</h3>
<p>We inspect the underbody, suspension and 4WD system for off-road wear. Moreover, every car passes the KEBS-appointed inspection.</p>
<p>You see photos before we buy.</p>

<h3>5. Shipping and clearing</h3>
<p>We ship to Mombasa and clear the car. Read our <a href="/blog/mombasa-port-car-clearing-guide/">Mombasa clearing guide</a>.</p>
<p>You get WhatsApp updates throughout.</p>

<h3>6. Registration and English conversion</h3>
<p>We register the car with NTSA and convert Japanese infotainment to English.</p>
<p>You get the logbook in your name.</p>

<h3>7. Delivery to every county</h3>
<p>We deliver to Nairobi, Nakuru, Eldoret, Kitale, Kisumu, Kericho, Nyeri, Nanyuki, Meru, Embu, Mombasa and Malindi. In addition, we serve Garissa, Isiolo and Lodwar.</p>
<p>Read our <a href="/blog/mombasa-to-nairobi-car-transport/">car transport guide</a>.</p>

${cta('Need help choosing a 4x4?', 'Tell us your roads and budget.', 'Hi Elisa Motors, which 4x4 should I import?')}

<h2>Running costs compared</h2>
<p>The Prado 2.8 diesel returns about 11 km/L on the highway. The Pajero 3.2 diesel returns about 10 km/L. Meanwhile, the Pajero 3.8 V6 petrol uses noticeably more. Therefore, diesel versions of both are the economical choice for long trips.</p>
<p>Servicing costs are similar for routine work. However, Pajero parts can take longer to source outside Nairobi. In contrast, Prado parts are available in almost every county town. As a result, Prado owners face less downtime.</p>

<h2>Which is better for safari and upcountry work?</h2>
<p>Both are proven on Kenyan safaris. The Prado is the more common choice for lodges and tour companies, mainly because of parts and resale. However, the Pajero's Super Select 4WD is clever and very capable on mixed surfaces.</p>
<p>For NGOs working in Turkana, Marsabit or Wajir, the Prado's parts network is a big advantage. Similarly, county governments tend to standardise on Toyota for the same reason.</p>

<h2>Five-year ownership view</h2>
<p>Imagine buying both and selling after five years. The Pajero costs less upfront. However, it also sells for less. The Prado costs more upfront but keeps much more of its value. Consequently, the gap in true ownership cost is far smaller than the purchase prices suggest.</p>
<p>If you plan to keep the car for ten years or more, resale matters less. In that case, the Pajero's lower purchase price becomes more attractive.</p>

<h2>Buying checklist for either SUV</h2>
<p>First, confirm the first registration date is ${MIN_YEAR} or later. Second, verify the mileage against auction or service records. Third, inspect the underbody for off-road damage and rust. Then test the 4WD system, including low range. Finally, check for oil leaks around the engine and differentials.</p>
<p>On Prados with KDSS, check for leaks in the system. On Pajeros, test the Super Select modes. We follow this checklist on every 4x4 we import.</p>

<h2>Alternatives to both</h2>
<p>If neither feels right, consider the ${c('toyota-land-cruiser-250', 'Land Cruiser 250')}, the new Prado successor. Alternatively, the ${c('nissan-x-trail', 'Nissan X-Trail')} offers seven seats on a smaller budget. Read our <a href="/blog/cheap-alternatives-to-prado-harrier-cx5/">cheap alternatives guide</a> and <a href="/blog/best-suv-under-5-million-kenya/">best SUVs under 5 million guide</a>.</p>

${h.specs('mitsubishi-pajero-sport', 'Mitsubishi Pajero Sport at a glance')}

${h.specs('toyota-land-cruiser-prado', 'Toyota Prado versions at a glance')}

<h2>Where we deliver</h2>
<p>We serve buyers across Nairobi, including Karen, Langata, Runda, Kileleshwa and Syokimau. We also serve Nakuru, Eldoret, Kisumu, Thika, Nyeri, Nanyuki, Meru, Machakos, Kericho and Kitale. At the coast, we serve Mombasa, Nyali, Kilifi and Malindi.</p>

<h2>Order your SUV</h2>
<p>Use the order form on this page. Questions? Call ${telA()} or WhatsApp ${waA('Hi Elisa Motors, I have a question about Prado vs Pajero.')}. You can also read our <a href="/blog/cheap-alternatives-to-prado-harrier-cx5/">cheap alternatives guide</a> or browse <a href="/body-type/suv/">all SUVs</a>.</p>
`,
    faq: [
      ['Is the Pajero cheaper than the Prado?', `Yes. A Pajero lands from about ${F(j)}, while a Prado starts near ${F(p)}. However, the Prado holds its value better.`],
      ['Which is more reliable: Prado or Pajero?', 'Both are tough. The Prado has the stronger reliability reputation in Kenya and much wider parts availability.'],
      ['Which is better off-road?', 'Both are excellent. The Prado has a slight edge on higher grades thanks to modern traction systems.'],
      ['Pajero Sport or Fortuner?', 'The Pajero Sport rides more smoothly. The Fortuner shares Hilux toughness and holds its value better in Kenya.'],
      ['Is the Pajero still available to import?', `Pajero production has ended, so supply is limited to the final model years. Only units first registered in ${MIN_YEAR} or later can be imported in ${YEAR}.`],
    ],
  };
};
