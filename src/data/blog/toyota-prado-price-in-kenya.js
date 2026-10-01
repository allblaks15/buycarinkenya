export default (h) => {
  const { YEAR, MIN_YEAR, P, F, T, c, v, cta, table, telA, waA } = h;
  const p = 'toyota-land-cruiser-prado', n = 'toyota-land-cruiser-250';
  return {
    slug: 'toyota-prado-price-in-kenya',
    keyword: 'Toyota Prado price in Kenya',
    tag: 'Price guide',
    cluster: 'SUVs & crossovers',
    crumb: 'Toyota Prado price in Kenya',
    title: `Toyota Prado Price in Kenya (${YEAR}): TX, TX-L, TZ-G & New 250`,
    description: `Toyota Prado price in Kenya for ${YEAR}: TX, TX-L and TZ-G landed costs, 2.7 petrol vs 2.8 diesel, the new Land Cruiser 250, upkeep, resale and how to import.`,
    h1: `Toyota Prado Price in Kenya (${YEAR}): TX, TX-L, TZ-G and the New Land Cruiser 250 Compared for Nairobi, Mombasa and Upcountry`,
    excerpt: `The complete Prado price guide for Kenya: every importable J150 grade, petrol vs diesel, KDSS, the new Land Cruiser 250, running costs, resale and how to import one.`,
    published: '2026-10-01',
    updated: '2026-10-01',
    cars: [p, n, 'toyota-fortuner', 'mitsubishi-pajero', 'toyota-land-cruiser-300', 'lexus-gx'],
    html: `
<p>The <b>Toyota Prado price in Kenya</b> starts at about <b>${F(p)}</b> for a compliant TX 2.7 petrol and reaches <b>${T(p)}</b> for a TZ-G diesel. Meanwhile, the all-new Land Cruiser 250, the Prado's successor, starts near <b>${F(n)}</b>. That range covers everything from a practical family 4x4 to a luxury expedition vehicle.</p>
<p>The Prado is often called "the king of Kenyan roads". It combines real off-road ability, seven seats and outstanding resale value. As a result, it is the default choice for families, NGOs, government officers and business owners from Nairobi to Lodwar.</p>
<p>This guide covers every importable Prado grade, the 2.7 petrol vs 2.8 diesel debate, KDSS, the new Land Cruiser 250, running costs and buying tips. Furthermore, it explains how Elisa Motors imports a Prado from Japan, the UK or South Africa with one fixed price in Kenya shillings.</p>
${cta('Want a Prado quote?', 'Tell us the grade, engine and colour you want.', 'Hi Elisa Motors, I want a quote for a Toyota Prado.')}

<h2>Toyota Prado price list in Kenya (${YEAR})</h2>
<p>These indicative landed prices include shipping, KRA duty, clearing and registration for ${MIN_YEAR}-or-newer units.</p>
${table([p, n], 'Toyota Prado and Land Cruiser 250 landed prices in Kenya')}
<p>Prices move with the yen, auction demand and KRA's CRSP list. Therefore, your written quote is the final figure.</p>

<h2>Prado grades explained</h2>
<h3>TX: the core Prado</h3>
<p>The ${v(p, 'tx-2-7-petrol-5-seat', 'TX 2.7 petrol (5-seat)')} lands at about <b>${P(p, 'tx-2-7-petrol-5-seat')}</b>. The ${v(p, 'tx-2-7-petrol-7-seat', '7-seat TX')} costs about <b>${P(p, 'tx-2-7-petrol-7-seat')}</b>. The TX is the most popular Prado in Kenya, because it balances price, capability and space.</p>
<h3>TX-L: the comfort upgrade</h3>
<p>The TX-L adds leather, more comfort features and often a sunroof. The ${v(p, 'tx-l-2-7-petrol', 'TX-L 2.7 petrol')} lands at about <b>${P(p, 'tx-l-2-7-petrol')}</b>. Meanwhile, the ${v(p, 'tx-l-2-8-diesel', 'TX-L 2.8 diesel')} costs about <b>${P(p, 'tx-l-2-8-diesel')}</b>.</p>
<h3>TZ-G: the flagship</h3>
<p>The ${v(p, 'tz-g-2-8-diesel', 'TZ-G 2.8 diesel')} lands at about <b>${P(p, 'tz-g-2-8-diesel')}</b>. It adds premium leather, adaptive suspension, multi-terrain systems and more luxury features. Consequently, it rivals the Lexus GX in comfort.</p>
<h3>TX diesel</h3>
<p>The ${v(p, 'tx-2-8-diesel', 'TX 2.8 diesel')} costs about <b>${P(p, 'tx-2-8-diesel')}</b>. It is the favourite of upcountry buyers and NGOs who need range and torque without luxury extras.</p>

${h.specs(p)}

<h2>2.7 petrol vs 2.8 diesel</h2>
<p>The 2.7 petrol is simple, reliable and cheaper to buy. It suits town use and moderate distances. However, it uses more fuel, at roughly 8–9 km/L on the highway.</p>
<p>The 2.8 turbo-diesel (1GD) has far more torque and returns about 11 km/L on the highway. Therefore, it is better for towing, heavy loads and long trips to Kisumu, Eldoret or the coast. In contrast, it needs clean diesel and regular highway driving for its particulate filter.</p>

<h2>What is KDSS?</h2>
<p>KDSS stands for Kinetic Dynamic Suspension System. It loosens the anti-roll bars off-road for better wheel travel and stiffens them on tarmac for less body roll. As a result, the Prado handles better on both surfaces.</p>
<p>However, KDSS adds complexity. Leaks and accumulator issues can be costly. Non-KDSS Prados are simpler and slightly cheaper to maintain. Read our <a href="/blog/prado-tx-common-problems-kenya/">Prado common problems guide</a> for detail.</p>

<h2>The new Land Cruiser 250 (new-shape Prado)</h2>
<p>In 2024, Toyota replaced the J150 Prado with the Land Cruiser 250. It is boxier, tougher and more modern, on the same TNGA-F platform as the LC300. Moreover, it has a much better cabin and modern safety systems.</p>
${h.specs(n)}
<p>The 250 costs far more than a J150 Prado. However, it will stay importable for many years and should hold its value well. Many Kenyans call it the "new Prado" or "Prado 2024".</p>

<h2>Prado prices by year</h2>
<p>A ${MIN_YEAR} Prado is the cheapest importable option and drops out of the window in ${YEAR + 1}. Cars from 2020 and later often have the updated 2.8 diesel with more power and refreshed styling. Meanwhile, 2023 J150s and any LC250 sit at the top.</p>
<p>Older 2015–2018 Prados trade locally at lower prices. However, they cannot be imported again, and mileage can be hard to verify. Read our <a href="/blog/check-mileage-japanese-cars-kenya/">mileage check guide</a>.</p>

<h2>Our services: Prado imports across Kenya</h2>
<p>Elisa Motors handles every step of your Prado import. Here is what we do for buyers in Nairobi, Mombasa, Nakuru, Kisumu, Eldoret and beyond.</p>

<h3>1. Japan auction sourcing</h3>
<p>Japan has a large supply of TX, TX-L and TZ-G Prados with low mileage. We bid within your budget and explain every auction sheet. Read our <a href="/blog/japanese-car-auction-sheet-guide/">auction sheet guide</a>.</p>
<p>We alert you on WhatsApp when a match appears.</p>

<h3>2. UK and South African Prados</h3>
<p>The UK offers diesel Prados with dealer history. South Africa offers African-spec units and the fastest shipping. We compare all three markets for your budget.</p>
<p>See our <a href="/import-from/south-africa/">South Africa import page</a>.</p>

<h3>3. All-inclusive landed quote</h3>
<p>Your quote includes the car, freight, insurance, KRA taxes, port charges, clearing and registration. In other words, one figure in Kenya shillings.</p>
<p>We can compare petrol and diesel, or a J150 and an LC250.</p>

<h3>4. Inspection and KDSS checks</h3>
<p>We check the KDSS system, 4WD, suspension and underbody for off-road damage. Every car also passes the KEBS-appointed inspection.</p>
<p>You see photos before we buy.</p>

<h3>5. Shipping and Mombasa clearing</h3>
<p>We ship to Mombasa and clear the car through KRA and KPA. Read our <a href="/blog/mombasa-port-car-clearing-guide/">Mombasa clearing guide</a>.</p>
<p>You get WhatsApp updates throughout.</p>

<h3>6. English conversion and registration</h3>
<p>We convert Japanese infotainment to English and register the car with NTSA. Read our <a href="/blog/japanese-car-english-conversion-nairobi/">English conversion guide</a>.</p>
<p>You receive the logbook in your name.</p>

<h3>7. Delivery to every county</h3>
<p>We deliver to Nairobi, Kiambu, Thika, Machakos, Nakuru, Naivasha, Eldoret, Kitale, Kisumu, Kakamega, Kericho, Nyeri, Nanyuki, Meru, Embu, Mombasa, Kilifi and Malindi. In addition, we serve Garissa, Isiolo and Lodwar for NGO fleets.</p>
<p>Read our <a href="/blog/mombasa-to-nairobi-car-transport/">car transport guide</a>.</p>

${cta('Petrol or diesel Prado?', 'Tell us how you drive and we will advise.', 'Hi Elisa Motors, should I buy a petrol or diesel Prado?')}

<h2>Prado running costs</h2>
<p>Toyota parts are everywhere in Kenya. Service every 5,000–10,000 km depending on use. Moreover, change the diesel fuel filter on time to protect the injectors. Tyres and suspension parts wear faster on rough roads.</p>
<p>Insurance follows the car's value, and insurers usually require a tracker. Read our <a href="/blog/car-asset-finance-and-insurance-kenya/">finance and insurance guide</a>.</p>

<h2>Prado vs rivals</h2>
<p>The ${c('toyota-fortuner', 'Toyota Fortuner')} costs less and shares the Hilux chassis. The ${c('mitsubishi-pajero', 'Mitsubishi Pajero')} is cheaper but less refined. Meanwhile, the ${c('lexus-gx', 'Lexus GX')} is the luxury version of the new 250. Read our <a href="/blog/toyota-prado-vs-mitsubishi-pajero/">Prado vs Pajero comparison</a> and <a href="/blog/cheap-alternatives-to-prado-harrier-cx5/">cheap alternatives guide</a>.</p>

<h2>Prado resale value</h2>
<p>The Prado holds its value exceptionally well in Kenya. White and pearl are the fastest-selling colours. Moreover, diesel TX-L and TZ-G versions attract strong demand. A full service record adds real value.</p>

<h2>Prado buying checklist</h2>
<p>First, confirm the registration date is ${MIN_YEAR} or later. Second, verify the mileage. Third, check the KDSS for leaks. Then test the 4WD, low range and centre diff lock. Finally, look underneath for off-road damage.</p>

<h2>Who should buy a Prado?</h2>
<p>The Prado suits families who need seven seats, buyers who drive rough roads and anyone who values resale. However, buyers who only drive on tarmac may be happier with a Harrier or CX-5. Read our <a href="/blog/harrier-cx5-prado-tx-price-in-kenya/">Harrier, CX-5 and Prado comparison</a>.</p>

<h2>Popular Prado upgrades</h2>
<p>Owners often add side steps, roof racks, all-terrain tyres, bull bars and Android screens. Moreover, many fit trackers and alarms. For safari, a snorkel and dual battery are popular.</p>

<h2>Prado prices in Nairobi vs upcountry</h2>
<p>A direct import costs the same across Kenya. However, showroom prices include stocking costs and margin. As a result, a fresh import often costs less than a yard Prado of the same year. In fact, buyers in Eldoret, Kitale, Kisumu and Meru often save the most, because late-model stock there is limited. Moreover, importing lets you choose the exact grade, engine and colour instead of settling for what a yard has.</p>

<h2>Where we deliver Prados</h2>
<p>We serve buyers across Nairobi, including Karen, Runda, Lavington, Kileleshwa, South C, Syokimau and Ruaka. We also serve Nakuru, Eldoret, Kisumu, Thika, Nyeri, Nanyuki, Meru, Machakos, Kericho and Kitale. At the coast, we serve Mombasa, Nyali, Kilifi and Malindi.</p>

<h2>How to order a Prado</h2>
<p>Open the ${c(p, 'Toyota Prado')} or ${c(n, 'Land Cruiser 250')} page, choose a grade and tap "Order this spec". Alternatively, use the order form on this page. Questions? Call ${telA()} or WhatsApp ${waA('Hi Elisa Motors, I have a question about the Toyota Prado.')}. You can also browse <a href="/make/toyota/">Toyota models</a> or <a href="/contact/">contact us</a>.</p>
`,
    faq: [
      ['How much is a Toyota Prado in Kenya?', `A compliant Toyota Prado lands in Kenya from about ${F(p)} for the TX 2.7 petrol. The TX 2.8 diesel costs about ${P(p, 'tx-2-8-diesel')}, and the TZ-G about ${P(p, 'tz-g-2-8-diesel')}.`],
      ['How much is the new Prado (Land Cruiser 250) in Kenya?', `The Land Cruiser 250 lands from about ${F(n)}. The VX diesel costs about ${P(n, 'vx-2-8-diesel')}.`],
      ['Is the Prado petrol or diesel better?', 'The diesel suits long trips, towing and heavy loads. The petrol suits town use and is simpler. Both are reliable.'],
      ['What is the difference between Prado TX and TX-L?', 'The TX-L adds leather, more comfort features and often a sunroof. The TX is simpler and cheaper.'],
      ['Does the Prado hold its value in Kenya?', 'Yes. The Prado is one of the best value-retaining vehicles in Kenya, especially diesel versions in white or pearl.'],
    ],
  };
};
