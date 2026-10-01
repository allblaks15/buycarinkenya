export default (h) => {
  const { YEAR, MIN_YEAR, P, F, T, c, v, cta, table, telA, waA } = h;
  const har = 'toyota-harrier', cx5 = 'mazda-cx-5', pr = 'toyota-land-cruiser-prado';
  return {
    slug: 'harrier-cx5-prado-tx-price-in-kenya',
    keyword: 'Toyota Harrier, Mazda CX-5 and Prado TX price in Kenya',
    tag: 'Price guide',
    cluster: 'SUVs & crossovers',
    crumb: 'Harrier, CX-5 & Prado TX prices',
    title: `Harrier, CX-5 & Prado TX Price in Kenya (${YEAR}) Compared`,
    description: `Toyota Harrier, Mazda CX-5 and Prado TX price in Kenya for ${YEAR}: landed costs, fuel use, upkeep and resale compared. Import from Japan, delivered across Kenya.`,
    h1: `Toyota Harrier, Mazda CX-5 & Prado TX Price in Kenya (${YEAR}): Costs, Fuel and Resale Compared for Nairobi, Mombasa and Upcountry`,
    excerpt: `Kenya's three favourite SUVs side by side: landed prices for every Harrier, CX-5 and Prado TX version, fuel consumption, common problems, resale value and how to import one.`,
    published: '2026-10-01',
    updated: '2026-10-01',
    cars: [har, cx5, pr, 'subaru-forester', 'nissan-x-trail', 'toyota-rav4', 'mazda-cx-8', 'toyota-fortuner'],
    html: `
<p>The <b>Toyota Harrier, Mazda CX-5 and Prado TX price in Kenya</b> covers a wide range. A compliant Mazda CX-5 lands from about <b>${F(cx5)}</b>. A Toyota Harrier starts near <b>${F(har)}</b>. Meanwhile, a Land Cruiser Prado TX begins around <b>${F(pr)}</b>. These three SUVs dominate driveways from Kileleshwa to Kisumu, so choosing between them matters.</p>
<p>This guide compares all three on price, fuel, running costs, comfort and resale value. Furthermore, it lists every version with its landed price. Finally, it explains how Elisa Motors imports your choice from Japan with one fixed KES quote.</p>
${cta('Want quotes for all three?', 'We can price a Harrier, CX-5 and Prado TX side by side.', 'Hi Elisa Motors, please compare Harrier, CX-5 and Prado TX prices for me.')}

<h2>Harrier, CX-5 and Prado TX price list in Kenya (${YEAR})</h2>
<p>These indicative landed prices apply to ${MIN_YEAR}-or-newer units. They include shipping, KRA duty, clearing and registration. Each row links to a full specs page.</p>
${table([cx5, har, pr], 'Mazda CX-5, Toyota Harrier and Prado landed prices in Kenya')}
<p>Exchange rates and KRA's CRSP list change during the year. Therefore, your written quote confirms the final figure.</p>

<h2>Mazda CX-5 price in Kenya</h2>
<p>The CX-5 is the best-driving SUV of the three. The ${v(cx5, '20s-2-0', '20S 2.0 petrol')} lands at <b>${P(cx5, '20s-2-0')}</b>. It suits Nairobi commuters who mainly drive on tarmac. In fact, it is the cheapest way into a premium-feeling SUV.</p>
<p>The ${v(cx5, '25s-l-package-4wd', '25S L Package 4WD')} adds leather and all-wheel drive for <b>${P(cx5, '25s-l-package-4wd')}</b>. Meanwhile, the ${v(cx5, 'xd-2-2-diesel-4wd', 'XD 2.2 diesel')} costs <b>${P(cx5, 'xd-2-2-diesel-4wd')}</b>. The diesel is superb on the Nakuru and Mombasa highways.</p>
<h3>CX-5 diesel: what to know</h3>
<p>The SkyActiv-D diesel is efficient and strong. However, it dislikes short trips. Without regular highway runs, its particulate filter (DPF) and intake can clog. Consequently, we recommend the petrol for town-only drivers.</p>

<h2>Toyota Harrier price in Kenya</h2>
<p>The Harrier is the stylish, comfortable choice. The ${v(har, 'premium-2-0', 'Harrier Premium 2.0')} lands at <b>${P(har, 'premium-2-0')}</b>. The ${v(har, 'z-2-0-leather-package', 'Z Leather Package')} adds a premium cabin for <b>${P(har, 'z-2-0-leather-package')}</b>.</p>
<p>The ${v(har, 'hybrid-z-2-5-e-four', 'Harrier Hybrid Z E-Four')} costs <b>${P(har, 'hybrid-z-2-5-e-four')}</b>. It returns over 20 km/L in mixed driving. As a result, it is ideal for long daily commutes from Syokimau, Ruiru or Kitengela.</p>
<h3>Older Harrier models</h3>
<p>Many buyers search for a "Harrier under 3 million". Those are older 2015–2018 models sold locally. They are good cars. However, they are now outside the 8-year import window, and mileage can be hard to verify.</p>

<h2>Toyota Prado TX price in Kenya</h2>
<p>The Prado is the tough one. It has a ladder frame, low-range 4WD and real off-road ability. The ${v(pr, 'tx-2-7-petrol-5-seat', 'TX 2.7 petrol')} lands at <b>${P(pr, 'tx-2-7-petrol-5-seat')}</b>. The ${v(pr, 'tx-2-7-petrol-7-seat', '7-seat TX')} costs <b>${P(pr, 'tx-2-7-petrol-7-seat')}</b>.</p>
<p>The ${v(pr, 'tx-l-2-7-petrol', 'TX-L petrol')} adds leather and more kit for <b>${P(pr, 'tx-l-2-7-petrol')}</b>. Diesel fans should consider the ${v(pr, 'tx-2-8-diesel', 'TX 2.8 diesel')} at <b>${P(pr, 'tx-2-8-diesel')}</b> or the ${v(pr, 'tx-l-2-8-diesel', 'TX-L diesel')} at <b>${P(pr, 'tx-l-2-8-diesel')}</b>. The top ${v(pr, 'tz-g-2-8-diesel', 'TZ-G')} reaches <b>${P(pr, 'tz-g-2-8-diesel')}</b>.</p>
<h3>Prado TX: petrol or diesel?</h3>
<p>The 2.7 petrol is simple and cheaper to buy. In contrast, the 2.8 diesel has much more torque and better range. Therefore, choose diesel if you tow, carry loads or drive long distances upcountry.</p>
<h3>What is KDSS on a Prado?</h3>
<p>KDSS is Toyota's Kinetic Dynamic Suspension System. It improves wheel travel off-road and body control on tarmac. However, it adds cost if repairs are needed. Non-KDSS Prados are simpler and slightly cheaper to maintain.</p>

<h2>Our services: Harrier, CX-5 and Prado imports across Kenya</h2>
<p>Elisa Motors handles every step from the Japanese auction to your door. Here is what we do for SUV buyers in Nairobi, Mombasa, Nakuru, Kisumu, Eldoret and beyond.</p>

<h3>1. Japan auction sourcing for Nairobi SUV buyers</h3>
<p>We bid for Harriers, CX-5s and Prados at major Japanese auctions. You choose the grade, colour, mileage and budget. Then we send you real cars every week.</p>
<p>Japan offers the widest choice of all three models. Moreover, auction grading shows the true condition. Read our <a href="/blog/import-cars-from-japan-to-kenya/">Japan import guide</a> to learn more.</p>

<h3>2. Auction sheet and mileage verification</h3>
<p>We verify every car's auction sheet and export certificate. That confirms the mileage and condition. Consequently, you avoid tampered odometers and hidden accident damage.</p>
<p>We can also verify a car you found locally. For instance, if a Ngong Road yard claims a Prado is "fresh import", we can check its history.</p>

<h3>3. Landed cost quotes and KRA duty in Mombasa</h3>
<p>Our quote includes the car, freight, insurance, import duty, excise duty, VAT, IDF, RDL, port charges, clearing and registration. In other words, one total in KES.</p>
<p>We can quote all three models together. As a result, you compare a CX-5 diesel, a Harrier Hybrid and a Prado TX with real numbers.</p>

<h3>4. Pre-shipment inspection and condition checks</h3>
<p>Every car passes the KEBS-appointed inspection in Japan. In addition, we check known weak points. These include CX-5 diesel intakes, Harrier CVT condition and Prado suspension.</p>
<p>We share photos and video before purchase. You approve the car, or we keep searching.</p>

<h3>5. Port clearing, registration and English conversion</h3>
<p>Our clearing team handles customs, KRA payment and KPA release at Mombasa. Subsequently, we register the car with NTSA and fit plates.</p>
<p>Japanese radios and dashboards can be converted to English. We arrange that before delivery. Similarly, we can fit a tracker or alarm.</p>

<h3>6. Delivery to Nairobi, Nakuru, Eldoret, Kisumu and the coast</h3>
<p>We deliver to Nairobi areas including Westlands, Kilimani, Karen, Lavington, South B, Syokimau and Kitengela. We also deliver to Kiambu, Thika, Ruiru and Machakos.</p>
<p>Upcountry, we serve Nakuru, Naivasha, Eldoret, Kitale, Kisumu, Kakamega, Kericho, Nyeri, Nanyuki, Meru and Embu. On the coast, we serve Mombasa, Nyali, Kilifi, Malindi and Diani.</p>

<h3>7. Finance, insurance and trade-in help</h3>
<p>Many buyers use bank asset finance or a logbook loan. We provide pro-forma invoices and documents your bank needs. Furthermore, we can connect you with insurers.</p>
<p>Trading in your current car? Tell us what you drive. Meanwhile, we advise on its value so you can plan. Start with the <a href="/import-request/">import request form</a> or the order form on this page.</p>

${cta('Not sure which SUV fits your budget?', 'Tell us how you drive, and we will recommend one.', 'Hi Elisa Motors, which SUV should I import: Harrier, CX-5 or Prado TX?')}

<h2>Fuel consumption compared</h2>
<p>The Harrier Hybrid is the clear winner at over 20 km/L. The CX-5 2.0 petrol returns about 14 km/L, while the CX-5 diesel manages about 17 km/L. By comparison, the Prado 2.7 petrol returns about 8–9 km/L, and the 2.8 diesel about 11 km/L.</p>
<p>Therefore, if you drive daily in Nairobi traffic, the Harrier Hybrid saves the most money. Browse more <a href="/fuel/hybrid/">hybrid cars</a> and <a href="/fuel/diesel/">diesel cars</a>.</p>

<h2>Maintenance and spare parts</h2>
<p>All three are easy to service in Kenya. Toyota parts are everywhere, from Kirinyaga Road to every county town. Mazda parts are widely available too, although some SkyActiv items cost more.</p>
<p>The Prado costs the most to maintain because it is bigger and heavier. However, it also tolerates rough roads best. Meanwhile, the CX-5 needs fresh, quality oil and highway runs for its diesel.</p>

<h2>Resale value in Kenya</h2>
<p>The Prado holds its value best of all. In fact, a well-kept Prado TX can sell for close to its import cost after a few years. The Harrier also holds value strongly. The CX-5 loses value a little faster, but it starts cheaper.</p>
<p>Colour and condition matter too. Pearl white and black sell fastest in Nairobi. In addition, a full service record and verified mileage can add real money to your selling price.</p>

<h2>Model years you can import in ${YEAR}</h2>
<h3>Harrier: ${MIN_YEAR} XU60 and 2020-onward XU80</h3>
<p>A few ${MIN_YEAR} Harriers are the older XU60 shape. From 2020, Toyota launched the new XU80 Harrier, built on the same platform as the RAV4. The new shape has a sleeker body, a better cabin and a much more efficient hybrid.</p>
<p>Most Kenyans now ask for the new shape. Therefore, it holds its value better. We can quote both if you want to save money.</p>
<h3>CX-5: ${MIN_YEAR}-onward KF series</h3>
<p>All importable CX-5s are the second-generation KF model. Later cars gained a bigger screen, updated safety tech and refreshed styling. Additionally, the 2.5 turbo petrol appeared on some Japanese grades.</p>
<h3>Prado: ${MIN_YEAR}–2023 J150 and the new Land Cruiser 250</h3>
<p>Most importable Prados are the facelifted J150, with the 2.8 diesel and 2.7 petrol. In 2024, Toyota replaced it with the ${c('toyota-land-cruiser-250', 'Land Cruiser 250')}. The new model costs more, but it is far more modern.</p>

<h2>Buying checklist for Harrier, CX-5 and Prado</h2>
<p>Before paying for any of these SUVs, check a few key points. First, confirm the first registration date is ${MIN_YEAR} or later. Second, verify the mileage with the auction sheet. Third, test the gearbox for smooth shifts, especially on CVT-equipped Harriers.</p>
<p>On a CX-5 diesel, ask about recent highway use and check for warning lights. On a Prado, look underneath for off-road damage and check the suspension. Finally, compare the price with a fresh import quote from us.</p>

<h2>Prices in Nairobi, Mombasa and upcountry</h2>
<p>Direct import prices are the same across Kenya. Only delivery from Mombasa differs. In contrast, yard prices vary a lot, because dealers add stocking costs and margin.</p>
<p>Buyers in Eldoret, Kisumu, Kitale and Meru often save the most with a direct import. Local stock there is limited, so yard prices run higher. Meanwhile, Nairobi buyers gain more choice of colour and grade.</p>

<h2>Insurance, finance and ownership costs</h2>
<p>Comprehensive insurance in Kenya is priced as a share of the car's value. Therefore, the Prado costs the most to insure, followed by the Harrier and then the CX-5. Most insurers also ask for an approved tracker.</p>
<p>Many buyers finance these SUVs through bank asset finance. Banks usually want a pro-forma invoice, a valuation and a deposit. We provide the documents quickly, so approval does not delay your import.</p>
<p>Plan for yearly costs too. These include servicing, tyres, insurance renewal and the occasional repair. For example, Prado all-terrain tyres cost more than CX-5 road tyres. Similarly, Harrier hybrid servicing is simple but needs a hybrid-trained garage.</p>

<h2>Common problems to watch for</h2>
<p><b>Toyota Harrier.</b> The petrol models use a CVT gearbox. It is reliable when the fluid is changed on time. However, neglected CVTs can judder. Some owners also report dashboard trim cracks in very hot climates.</p>
<p><b>Mazda CX-5.</b> The diesel can suffer carbon build-up and DPF clogging on short trips. Petrol models are simpler. In addition, CX-5s with i-stop need a specific, more expensive battery.</p>
<p><b>Prado TX.</b> The 2.8 diesel needs clean fuel to protect its injectors and turbo. Meanwhile, cars used hard off-road can wear suspension bushes and shock absorbers. A careful inspection catches all of these issues before you buy.</p>

<h2>Popular upgrades and accessories</h2>
<p>Owners often personalise their SUVs after delivery. Popular choices include English-language Android screens, reverse cameras, trackers and alarms. Additionally, many Prado owners add side steps, roof racks and all-terrain tyres for upcountry trips.</p>
<p>CX-5 owners in Nairobi often engrave or secure their side mirrors, because mirror theft is common in some areas. Harrier owners frequently add tinted windows and ceramic coating. We can arrange many of these before delivery, so the car arrives ready to use.</p>

<h2>Which SUV should you choose?</h2>
<p>Choose the <b>CX-5</b> if you want the best drive and value. Choose the <b>Harrier</b> if you want comfort, style and hybrid economy. Choose the <b>Prado TX</b> if you need seven seats, murram roads or safari trips to the Mara and Samburu.</p>
<p>On a tighter budget? Consider the ${c('subaru-forester')}, ${c('nissan-x-trail')} or ${c('toyota-rav4')}. Need seven seats on tarmac? Look at the ${c('mazda-cx-8')}. Want Prado toughness for less? Try the ${c('toyota-fortuner')}. You can also browse all <a href="/body-type/suv/">SUVs</a> or the <a href="/make/mazda/">Mazda range</a>.</p>

<h2>How to order with Elisa Motors</h2>
<p>Open the ${c(har, 'Harrier')}, ${c(cx5, 'CX-5')} or ${c(pr, 'Prado')} page, pick a version and tap "Order this spec". Alternatively, use the order form on this page. We reply with real cars and a free quote.</p>
<p>Call ${telA()} or WhatsApp ${waA('Hi Elisa Motors, I have a question about Harrier, CX-5 or Prado prices.')} anytime during business hours. You can also <a href="/contact/">contact us</a> or read our <a href="/how-to-import-a-car-to-kenya/">import guide</a>. Ready for a bigger SUV? See our <a href="/blog/toyota-land-cruiser-v8-price-in-kenya/">Land Cruiser V8 price guide</a>.</p>
`,
    faq: [
      ['How much is a Toyota Harrier in Kenya?', `A compliant Toyota Harrier lands in Kenya from about ${F(har)} for the Premium 2.0, up to ${T(har)} for the Hybrid Z E-Four. Prices include shipping, duty, clearing and registration.`],
      ['How much is a Mazda CX-5 in Kenya?', `A Mazda CX-5 lands from about ${P(cx5, '20s-2-0')} for the 20S petrol. The XD diesel 4WD costs about ${P(cx5, 'xd-2-2-diesel-4wd')}.`],
      ['How much is a Prado TX in Kenya?', `A Toyota Prado TX 2.7 petrol lands from about ${P(pr, 'tx-2-7-petrol-5-seat')}. The TX 2.8 diesel costs about ${P(pr, 'tx-2-8-diesel')}.`],
      ['Which is better, Harrier or CX-5?', 'The CX-5 is cheaper and drives better. The Harrier is more comfortable, more stylish and offers a very economical hybrid. Both are reliable when well maintained.'],
      ['Is the Prado TX worth the extra cost?', 'Yes, if you need seven seats, real 4WD or frequent rough-road travel. It also has the best resale value of the three. For tarmac-only use, a Harrier or CX-5 is more economical.'],
    ],
  };
};
