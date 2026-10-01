export default (h) => {
  const { YEAR, MIN_YEAR, P, F, T, c, v, cta, table, telA, waA } = h;
  const s = 'land-rover-range-rover-sport';
  return {
    slug: 'range-rover-sport-price-in-kenya',
    keyword: 'Range Rover Sport price in Kenya',
    tag: 'Price guide',
    cluster: 'Range Rover & Land Rover',
    crumb: 'Range Rover Sport price in Kenya',
    title: `Range Rover Sport Price in Kenya (${YEAR}): HSE, Dynamic, SVR`,
    description: `Range Rover Sport price in Kenya for ${YEAR}: HSE, HSE Dynamic, Autobiography and SVR landed costs, diesel vs petrol, year-by-year guide and import from the UK.`,
    h1: `Range Rover Sport Price in Kenya (${YEAR}): HSE, Dynamic, Autobiography & SVR Costs in Nairobi, Mombasa and Upcountry`,
    excerpt: `A deep dive into Range Rover Sport prices in Kenya: every trim and engine, year-by-year values, diesel vs petrol, locally used vs fresh import, and how to order one.`,
    published: '2026-10-01',
    updated: '2026-10-01',
    cars: [s, 'land-rover-range-rover-velar', 'land-rover-range-rover-vogue', 'bmw-x5', 'porsche-cayenne', 'mercedes-benz-gle'],
    html: `
<p>The <b>Range Rover Sport price in Kenya</b> starts at about <b>${F(s)}</b> for a compliant HSE diesel and reaches <b>${T(s)}</b> for a new-shape Autobiography. In between sit HSE Dynamic petrols, plug-in hybrids and the fire-breathing SVR. As a result, two Range Rover Sports in the same Westlands car park can differ in value by over ten million shillings.</p>
<p>This guide explains exactly why. It covers every engine, trim and model year you can import in ${YEAR}. Furthermore, it compares fresh imports with locally used cars in Nairobi and Mombasa. Finally, it shows how Elisa Motors brings a Range Rover Sport from the UK or Japan with one fixed price in Kenya shillings.</p>
${cta('Want a Range Rover Sport quote?', 'Tell us the year, engine and colour you want.', 'Hi Elisa Motors, I want a quote for a Range Rover Sport.')}

<h2>Range Rover Sport price list in Kenya (${YEAR})</h2>
<p>These indicative landed prices apply to ${MIN_YEAR}-or-newer units. They include shipping, KRA duty, clearing and NTSA registration. Each row opens a full specification page.</p>
${table([s], 'Range Rover Sport landed prices in Kenya')}
<p>Prices move with the pound, auction demand and KRA's Current Retail Selling Price list. Therefore, your written quote fixes the final figure before you pay.</p>

<h2>Two generations: L494 and L461</h2>
<h3>L494 Range Rover Sport (${MIN_YEAR}–2022)</h3>
<p>The L494 is the second-generation Sport. Its 2018 facelift added slimmer lights, the Touch Pro Duo twin screens and the P400e plug-in hybrid. In fact, most Range Rover Sports on Kenyan roads today are L494s.</p>
<p>Within the 8-year window, you can import ${MIN_YEAR} to 2022 L494 cars. The ${v(s, 'hse-3-0-sdv6', 'HSE 3.0 SDV6')} diesel lands at about <b>${P(s, 'hse-3-0-sdv6')}</b>. Meanwhile, the ${v(s, 'hse-dynamic-p400', 'HSE Dynamic P400')} petrol costs about <b>${P(s, 'hse-dynamic-p400')}</b>. Later cars use Land Rover's newer six-cylinder Ingenium engines with mild-hybrid assistance.</p>
<h3>L461 Range Rover Sport (2022 onwards)</h3>
<p>The third-generation L461 arrived in 2022. It is sleeker, quieter and far more advanced inside. Moreover, its plug-in hybrids can cover long distances on electric power alone.</p>
<p>The ${v(s, 'autobiography-d350-l461', 'Autobiography D350')} lands at about <b>${P(s, 'autobiography-d350-l461')}</b>. That is a big jump from the L494. However, a new-shape Sport also holds its value far better when you sell in Nairobi.</p>

<h2>Range Rover Sport trims explained</h2>
<p><b>SE</b> is the entry trim, with leather, navigation and air suspension. <b>HSE</b> adds bigger wheels, upgraded seats and Meridian audio. Consequently, HSE is the most common trim in UK stock and the one most Kenyans buy.</p>
<p><b>HSE Dynamic</b> adds sportier styling, red brake callipers and Dynamic driving modes. <b>Autobiography Dynamic</b> brings the richest cabin and most standard options. Finally, the <b>SVR</b> is the performance flagship, with a supercharged 5.0 V8 and a loud exhaust that turns heads on Waiyaki Way.</p>
<p>On the L461, trims run SE, Dynamic SE, Dynamic HSE, Autobiography and the SV. Similarly, the "Dynamic" pack is now a separate styling choice rather than a full trim.</p>

<h2>Diesel vs petrol vs plug-in hybrid</h2>
<h3>Diesel (SDV6, SDV8, D250, D300, D350)</h3>
<p>Diesels are the smart choice for most Kenyan buyers. They pull strongly, return roughly 11–13 km/L on the highway and offer long range. As a result, a diesel Sport handles Nairobi to Nakuru and back on one tank comfortably.</p>
<p>However, modern diesels need clean fuel and regular long runs. If you only drive short hops between Kilimani and the CBD, the particulate filter may clog. In that case, consider a petrol or hybrid. See all <a href="/fuel/diesel/">diesel SUVs</a> we import.</p>
<h3>Petrol (P400, SVR)</h3>
<p>Petrols are smoother and quieter, and they suit town use. However, they use more fuel. The SVR V8 is especially thirsty, so it works best as a weekend car.</p>
<h3>Plug-in hybrid (P400e, P440e, P510e)</h3>
<p>Plug-in hybrids can run on electricity for daily commutes, then switch to petrol for long trips. For example, a Karen-to-Upper Hill commute could run almost entirely on battery. Still, you need home charging to benefit. Browse our <a href="/fuel/hybrid/">hybrid range</a>.</p>

<h2>Range Rover Sport prices by year</h2>
<p>Year is the biggest single price driver. A ${MIN_YEAR} L494 sits at the bottom of the importable range. A 2021 or 2022 L494 with the newer six-cylinder engine costs noticeably more. Then the L461 jumps to a new price level.</p>
<p>Older 2014–2018 Sports still trade locally on sites like Jiji and in Mombasa Road yards. They look cheaper. However, they cannot be imported any more, and their history is often unclear. In fact, many need air suspension or timing work soon after purchase.</p>
<p>Planning a purchase next year? Remember the 8-year window moves. In ${YEAR + 1}, the cut-off becomes ${MIN_YEAR + 1}. Therefore, ${MIN_YEAR} cars must be imported this year or not at all.</p>

${h.specs(s)}

<h2>Our services: Range Rover Sport imports across Kenya</h2>
<p>Elisa Motors handles every step of your Range Rover Sport import. Here is what we do for buyers in Nairobi, Mombasa, Nakuru, Kisumu, Eldoret and beyond.</p>

<h3>1. Range Rover Sport sourcing from the UK</h3>
<p>The UK has the largest supply of right-hand-drive Range Rover Sports anywhere. We search Land Rover approved-used dealers, main-dealer part exchanges and trade auctions. Then we shortlist cars that match your year, engine, trim and colour.</p>
<p>UK cars come with MOT records that confirm mileage. In addition, most have full Land Rover service history. Learn more in our <a href="/blog/import-range-rover-from-uk-to-kenya/">guide to importing a Range Rover from the UK</a>.</p>

<h3>2. Ex-Japan Range Rover Sport sourcing</h3>
<p>Japan supplies fewer Range Rovers, but they are often exceptional. Japanese owners drive little, so mileage is usually low. Moreover, auction sheets record every mark on the body.</p>
<p>Japanese cars may need English conversion of radio and navigation. We arrange that before delivery. See our <a href="/import-from/japan/">import from Japan page</a>.</p>

<h3>3. All-inclusive Range Rover Sport quotes in KES</h3>
<p>Our quote covers the car, freight, insurance, import duty, excise duty, VAT, IDF, RDL, port charges, clearing and registration. In other words, one figure with no surprise top-ups.</p>
<p>We can also compare options side by side. For instance, we can price a ${MIN_YEAR} SDV6 HSE next to a 2021 D300 HSE Dynamic. You then see exactly what the newer engine costs.</p>

<h3>4. Pre-purchase inspection and history checks</h3>
<p>We check the air suspension, 4x4 system, electronics, timing components and the underbody for UK road salt. We also run history checks for outstanding finance and write-off records.</p>
<p>Every car passes the KEBS-appointed roadworthiness inspection before shipping. Furthermore, you receive photos and video before we buy. You approve the car, or we keep looking.</p>

<h3>5. Shipping, clearing and registration</h3>
<p>We ship by roll-on/roll-off or container to Mombasa. Our clearing team handles KRA, KPA and physical verification at Kilindini Harbour. Subsequently, we register the car with NTSA and fit plates.</p>
<p>Read our <a href="/blog/mombasa-port-car-clearing-guide/">Mombasa port clearing guide</a> to see each step in detail.</p>

<h3>6. Delivery to Nairobi and every county</h3>
<p>We deliver by covered carrier to Westlands, Karen, Runda, Lavington, Kileleshwa, Muthaiga and Kitisuru. We also deliver to Kiambu, Ruiru, Thika, Machakos and Kitengela.</p>
<p>Upcountry, we deliver to Nakuru, Naivasha, Eldoret, Kisumu, Kericho, Nyeri, Nanyuki and Meru. On the coast, we serve Mombasa, Nyali, Diani and Malindi.</p>

<h3>7. Finance, insurance and after-sales advice</h3>
<p>We provide pro-forma invoices and documents for bank asset finance. In addition, we connect you with insurers and tracking providers. Read our <a href="/blog/car-asset-finance-and-insurance-kenya/">car finance and insurance guide</a> for details.</p>
<p>After delivery, we recommend trusted Land Rover specialists in Nairobi. As a result, your Sport stays healthy long after the import.</p>

${cta('Comparing a diesel and a hybrid Sport?', 'We can quote both on one page.', 'Hi Elisa Motors, please compare Range Rover Sport diesel and hybrid prices.')}

<h2>Range Rover Sport vs its rivals</h2>
<p>The ${c('bmw-x5', 'BMW X5')} drives more sharply and costs less, from about ${F('bmw-x5')}. The ${c('porsche-cayenne', 'Porsche Cayenne')} is the sportiest but costs more to run. Meanwhile, the ${c('mercedes-benz-gle', 'Mercedes GLE')} offers comfort and technology at a similar price.</p>
<p>Inside the Land Rover family, the ${c('land-rover-range-rover-velar', 'Velar')} is cheaper and more stylish, while the ${c('land-rover-range-rover-vogue', 'full-size Range Rover')} is roomier and grander. Compare them in our <a href="/blog/range-rover-price-in-kenya/">Range Rover price guide</a>.</p>

<h2>Running costs of a Range Rover Sport in Kenya</h2>
<p>Expect a proper service every 10,000–15,000 km at a Land Rover specialist. Parts are available in Nairobi, although genuine items cost more than Japanese equivalents. Air suspension compressors and struts are the most common big repairs on older cars.</p>
<p>Tyres matter too. A 21- or 22-inch tyre costs far more than a 19- or 20-inch one, and it rides harder on rough roads. Therefore, many Kenyan owners choose smaller wheels for comfort. Read our <a href="/blog/range-rover-maintenance-cost-kenya/">Range Rover maintenance guide</a> for full figures.</p>
<p>Insurance follows the car's value, and insurers usually require an approved tracker. We can fit one before handover.</p>

<h2>Locally used vs fresh import Range Rover Sport</h2>
<p>A locally used Sport can look like a bargain. However, many are 2014–2018 cars with unknown mileage and heavy suspension wear. Some even carry "facelift" body kits to look newer than they are.</p>
<p>A fresh import has a verified first registration date, real mileage and a full history file. Moreover, it has had no Kenyan owner, so there is no hidden local accident damage. If you still prefer a local car, ask us to inspect it first.</p>

<h2>Best colours and options for Kenya</h2>
<p>Santorini Black, Fuji White and Eiger Grey are the most popular colours. White stays cooler in the sun. Black looks striking but shows dust on murram roads. Meanwhile, grey hides dirt well and resells easily.</p>
<p>Useful options include the panoramic roof, Meridian audio, a heated windscreen for cold Limuru mornings and adaptive cruise control for long highway runs. In addition, privacy glass keeps the cabin cooler in Mombasa heat.</p>

<h2>Where we deliver Range Rover Sports</h2>
<p>We serve buyers across Nairobi, including Westlands, Karen, Runda, Gigiri, Lavington, Kilimani, Upper Hill, Syokimau and South C. We also serve Nakuru, Eldoret, Kisumu, Thika, Nyeri, Nanyuki, Machakos, Kitale and Kakamega. At the coast, we serve Mombasa, Nyali, Bamburi, Kilifi, Diani and Malindi.</p>

<h2>Range Rover Sport buying checklist</h2>
<p>Before paying for any Range Rover Sport, run through these checks. First, confirm the first registration date is ${MIN_YEAR} or later. Second, match the mileage to the MOT history or auction sheet. Third, test the air suspension at every height setting.</p>
<p>Next, scan for stored fault codes and test all screens and cameras. Then check the tyres, brakes and wheels for damage. Finally, look under the car for corrosion on UK units. We complete this checklist on every Sport we import.</p>

<h2>First-year ownership tips</h2>
<p>After delivery, book a full service with fresh oil, filters and brake fluid. In addition, ask a specialist to install outstanding software updates. Then fit an approved tracker and a steering lock for extra security.</p>
<p>Drive the diesel on the highway at least once or twice a month. That lets the particulate filter clean itself. Meanwhile, keep the tyre pressures correct, especially on large wheels. As a result, you reduce punctures and uneven wear.</p>

<h2>Range Rover Sport resale value</h2>
<p>The Sport holds its value better than most European SUVs in Kenya. Diesel versions in white, black or grey sell fastest. In addition, full service records and verified mileage add real money at resale. Therefore, keep every invoice and import document from day one.</p>

<p>Colour also matters at resale. White and grey Sports sell quickly across Kenya, while unusual colours can take longer to find a buyer. As a result, choose a popular colour unless you plan to keep the car for many years.</p>

<p>Meanwhile, cars with sensible 20- or 21-inch wheels appeal to more buyers than those on oversized rims.</p>

<h2>How to order a Range Rover Sport</h2>
<p>Open the ${c(s, 'Range Rover Sport')} page, choose a version and tap "Order this spec". Alternatively, use the order form on this page. We reply with real cars and a free, all-inclusive quote.</p>
<p>Questions? Call ${telA()} or WhatsApp ${waA('Hi Elisa Motors, I have a question about the Range Rover Sport.')}. You can also browse all <a href="/make/land-rover/">Land Rover models</a>, read our <a href="/how-to-import-a-car-to-kenya/">import guide</a> or send an <a href="/import-request/">import request</a>.</p>
`,
    faq: [
      ['How much is a Range Rover Sport in Kenya?', `In ${YEAR}, a compliant Range Rover Sport lands from about ${F(s)} for an HSE diesel. The HSE Dynamic P400 costs about ${P(s, 'hse-dynamic-p400')}, and the new-shape Autobiography D350 costs about ${P(s, 'autobiography-d350-l461')}.`],
      ['Which Range Rover Sport years can I import in ' + YEAR + '?', `You can import units first registered in ${MIN_YEAR} or later. That covers late L494 models and every L461 new-shape Sport.`],
      ['Is the diesel or petrol Range Rover Sport better for Kenya?', 'The diesel suits most buyers thanks to strong torque and better fuel economy on long trips. The petrol suits town-only drivers. Plug-in hybrids suit buyers with home charging.'],
      ['How much is a Range Rover Sport SVR in Kenya?', 'The SVR is a special order. It costs more than an Autobiography because of its supercharged V8 and performance parts. Send us the year you want for an exact landed quote.'],
      ['Is a locally used Range Rover Sport cheaper?', 'Upfront it can be. However, older local cars often need suspension, timing or electrical work soon after purchase. A fresh import with verified history is often cheaper over three years.'],
    ],
  };
};
