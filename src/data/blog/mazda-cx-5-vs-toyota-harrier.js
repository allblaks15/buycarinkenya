export default (h) => {
  const { YEAR, MIN_YEAR, P, F, c, v, cta, table, telA, waA } = h;
  const m = 'mazda-cx-5', t = 'toyota-harrier';
  return {
    slug: 'mazda-cx-5-vs-toyota-harrier',
    keyword: 'Mazda CX-5 vs Toyota Harrier in Kenya',
    tag: 'Comparison',
    cluster: 'SUVs & crossovers',
    crumb: 'Mazda CX-5 vs Toyota Harrier',
    title: `Mazda CX-5 vs Toyota Harrier in Kenya (${YEAR}): Which to Buy?`,
    description: `Mazda CX-5 vs Toyota Harrier in Kenya: prices, fuel use, comfort, ground clearance, maintenance and resale compared, plus which crossover to import in ${YEAR}.`,
    h1: `Mazda CX-5 vs Toyota Harrier in Kenya (${YEAR}): Price, Fuel, Comfort, Maintenance and Resale Compared`,
    excerpt: `Kenya's two favourite premium crossovers head to head: landed prices, engines, fuel, comfort, ground clearance, running costs and resale, with a clear verdict for different buyers.`,
    published: '2026-10-01',
    updated: '2026-10-01',
    cars: [m, t, 'subaru-forester', 'toyota-rav4', 'nissan-x-trail', 'honda-cr-v'],
    html: `
<p>The <b>Mazda CX-5 vs Toyota Harrier</b> debate comes up in almost every Kenyan car group. Both are stylish, well-built crossovers imported from Japan. Both suit Nairobi traffic and weekend trips to Naivasha. However, they differ in price, comfort, fuel economy, running costs and resale value. Therefore, the right choice depends on what you value most.</p>
<p>The CX-5 lands from about <b>${F(m)}</b>, while the Harrier starts near <b>${F(t)}</b>. That price gap is the first big difference. Yet price alone does not tell the whole story.</p>
<p>This guide compares the two car by car: engines, fuel, comfort, practicality, ground clearance, maintenance, resale and safety. Furthermore, it explains how Elisa Motors can quote both side by side, so you choose with real numbers.</p>
${cta('Want quotes for both?', 'We can price a CX-5 and a Harrier on one page.', 'Hi Elisa Motors, please compare CX-5 and Harrier prices for me.')}

<h2>Price comparison (${YEAR})</h2>
<p>These indicative landed prices include shipping, KRA duty, clearing and registration for ${MIN_YEAR}-or-newer units.</p>
${table([m, t], 'Mazda CX-5 and Toyota Harrier landed prices in Kenya')}
<p>The CX-5 is clearly cheaper at every level. For example, the ${v(m, '25s-l-package-4wd', 'CX-5 25S L Package 4WD')} costs about ${P(m, '25s-l-package-4wd')}, while the ${v(t, 'premium-2-0', 'Harrier Premium')} costs about ${P(t, 'premium-2-0')}. As a result, the CX-5 gives more equipment for the money.</p>

<h2>Engines and fuel economy</h2>
<h3>Mazda CX-5</h3>
<p>The CX-5 offers a 2.0 petrol, a 2.5 petrol and a 2.2 diesel. The diesel is the economy champion on long trips, at about 16–18 km/L on the highway. However, it needs regular highway driving. Read our <a href="/blog/mazda-cx-5-diesel-problems-kenya/">CX-5 diesel problems guide</a>.</p>
<h3>Toyota Harrier</h3>
<p>The Harrier offers a 2.0 petrol and a 2.5 hybrid. The hybrid is the economy champion in town, returning over 20 km/L in traffic. Moreover, it is smooth and silent at low speeds.</p>
<h3>Verdict on fuel</h3>
<p>For Nairobi stop-start driving, the Harrier Hybrid wins clearly. In contrast, for long highway trips, the CX-5 diesel is excellent. Between the petrol versions, they are similar.</p>

<h2>Comfort and refinement</h2>
<p>The Harrier is softer and quieter. Its ride absorbs potholes well, and the cabin feels close to a Lexus. Therefore, it suits buyers who prioritise comfort.</p>
<p>The CX-5 rides more firmly and handles more sharply. It feels more connected to the road. As a result, keen drivers often prefer it. Its cabin is also beautifully finished, especially on L Package grades.</p>

<h2>Space and practicality</h2>
<p>Both are five-seaters with similar rear legroom. The CX-5 has a slightly more practical boot shape. Meanwhile, the Harrier's sloping roof cuts boot height a little. Neither offers seven seats, so larger families should look at the ${c('mazda-cx-8', 'Mazda CX-8')} or a Prado.</p>

<h2>Ground clearance and rough roads</h2>
<p>Both have similar, moderate ground clearance. Both handle tarmac and good murram well. However, neither is a true off-roader. For regular rough roads, the ${c('subaru-forester', 'Subaru Forester')} offers more clearance and standard AWD.</p>
<p>All-wheel drive is available on both: 4WD on the CX-5 25S and XD, and E-Four on the Harrier Hybrid. Consequently, choose an AWD version if you drive upcountry often.</p>

${h.specs(m)}

${h.specs(t)}

<h2>Maintenance and parts</h2>
<p>Both are easy to maintain in Kenya. Toyota parts are slightly more widespread, especially in smaller towns. Mazda parts are available in Nairobi and major towns.</p>
<p>The Harrier petrol's CVT needs fluid changes on schedule. Meanwhile, the CX-5 diesel needs the correct low-ash oil and highway runs. In contrast, the CX-5 petrol uses a conventional automatic, which is very durable.</p>

<h2>Reliability</h2>
<p>Both are reliable. The Harrier hybrid system has an excellent track record. The CX-5 petrol is also very reliable. However, the CX-5 diesel can be troublesome if used only for short trips. Therefore, match the engine to your driving.</p>

<h2>Resale value in Kenya</h2>
<p>The Harrier holds its value better. In fact, Toyota's reputation keeps demand strong across Kenya. The CX-5 depreciates a little faster. However, it starts cheaper, so the total cost of ownership can be similar.</p>

<h2>Safety and technology</h2>
<p>Both have strong safety systems on higher grades, including adaptive cruise control and emergency braking. The Harrier's digital rear-view mirror and JBL audio are nice touches. Meanwhile, the CX-5 offers Bose audio and a head-up display on some grades.</p>

<h2>Verdict: which should you buy?</h2>
<p>Choose the <b>CX-5</b> if you want the best value, enjoy driving and mostly drive on good roads. Choose the <b>Harrier</b> if you want maximum comfort, a premium feel and hybrid fuel economy. Moreover, choose the Harrier if resale value matters most.</p>
<p>For long highway commuters, the CX-5 diesel is great. For Nairobi traffic, the Harrier Hybrid is unbeatable.</p>

<h2>Our services: import a CX-5 or Harrier</h2>
<p>Elisa Motors imports both from Japan. Here is what we do for buyers in Nairobi, Mombasa, Nakuru, Kisumu, Eldoret and beyond.</p>

<h3>1. Side-by-side quotes</h3>
<p>We price both cars on one page, with every tax and fee included. As a result, you compare real numbers.</p>
<p>We can add the RAV4 or Forester too.</p>

<h3>2. Japan auction sourcing</h3>
<p>We bid at Japanese auctions for your grade, colour and mileage. Read our <a href="/blog/buy-cars-from-japanese-auctions-kenya/">Japanese auctions guide</a>.</p>
<p>We explain every auction sheet.</p>

<h3>3. Mileage verification</h3>
<p>We verify mileage against auction and export records. Read our <a href="/blog/check-mileage-japanese-cars-kenya/">mileage check guide</a>.</p>
<p>Any mismatch means we walk away.</p>

<h3>4. Inspection</h3>
<p>Every car passes the KEBS-appointed inspection. Moreover, we check the CVT, hybrid system or diesel health as relevant.</p>
<p>You see photos before we buy.</p>

<h3>5. Shipping and clearing</h3>
<p>We ship to Mombasa and clear the car. Read our <a href="/blog/mombasa-port-car-clearing-guide/">Mombasa clearing guide</a>.</p>
<p>You get WhatsApp updates throughout.</p>

<h3>6. English conversion and registration</h3>
<p>We convert infotainment to English and register the car with NTSA. Read our <a href="/blog/japanese-car-english-conversion-nairobi/">English conversion guide</a>.</p>
<p>You get the logbook in your name.</p>

<h3>7. Delivery across Kenya</h3>
<p>We deliver to Nairobi, Kiambu, Thika, Machakos, Nakuru, Eldoret, Kisumu, Kericho, Nyeri, Nanyuki, Meru, Mombasa and Diani.</p>
<p>Read our <a href="/blog/mombasa-to-nairobi-car-transport/">car transport guide</a>.</p>

${cta('Still undecided?', 'Tell us how you drive and we will recommend one.', 'Hi Elisa Motors, should I buy a CX-5 or a Harrier?')}

<h2>Head-to-head scenarios</h2>
<h3>Daily commute from Ruiru, Syokimau or Kitengela</h3>
<p>For long daily commutes in heavy traffic, the Harrier Hybrid wins. It sips fuel in stop-start conditions and stays silent at low speeds. In contrast, the CX-5 diesel dislikes short, slow trips. Therefore, commuters should lean towards the Harrier Hybrid, or a CX-5 petrol if budget is tight.</p>
<h3>Frequent trips to Nakuru, Eldoret or Kisumu</h3>
<p>For regular highway trips, the CX-5 diesel shines. It cruises effortlessly and returns excellent economy at steady speeds. Moreover, its torque makes overtaking on the Rift Valley roads easier. Meanwhile, the Harrier petrol is comfortable but uses more fuel at highway speeds than the diesel.</p>
<h3>Young family in Nairobi</h3>
<p>Both suit a young family well. The Harrier's softer ride keeps children comfortable. However, the CX-5's lower price leaves more budget for insurance, tracking and school fees. As a result, many families choose the CX-5 25S L Package as the sweet spot.</p>
<h3>Buyer focused on resale</h3>
<p>If you plan to sell within three or four years, the Harrier is the safer bet. Toyota demand stays strong in every county. Similarly, hybrid Harriers are increasingly sought after as fuel prices rise.</p>

<h2>Ownership costs over four years</h2>
<p>Consider four cost areas: depreciation, fuel, servicing and insurance. The Harrier usually loses less value. The CX-5 usually costs less to buy and insure. Meanwhile, fuel costs depend on your driving pattern and engine choice.</p>
<p>In fact, for many buyers, the total four-year cost ends up close. Therefore, choose the car you will enjoy most, and pick the right engine for your routes.</p>

<h2>Test-drive checklist</h2>
<p>If you can, drive both on a rough road and on the highway. Notice the ride, noise and seat comfort. Check visibility, especially over your shoulder. Moreover, sit in the back seat and load your usual luggage into the boot. Finally, try the infotainment and cameras, because you will use them every day.</p>

<h2>Common mistakes buyers make</h2>
<p>First, choosing a CX-5 diesel for town-only use. Second, buying an old-shape Harrier locally at a "bargain" price without checking mileage. Third, ignoring the CVT service history on petrol Harriers. Finally, comparing CIF prices instead of fully landed prices. Read our <a href="/blog/kra-import-duty-calculator-kenya/">KRA duty guide</a> to understand landed costs.</p>

${h.specs('toyota-rav4', 'The third option: Toyota RAV4')}

<p>The RAV4 shares the Harrier's platform and engines but offers a bigger boot and a tougher look. Moreover, its Adventure grade adds rugged styling and more ground clearance feel. Therefore, buyers torn between the CX-5 and Harrier sometimes find the RAV4 is the best compromise. It costs less than the Harrier and holds its value well. Similarly, its hybrid E-Four version is excellent in Nairobi traffic and on wet upcountry roads.</p>

<h2>Colours and options buyers prefer</h2>
<p>For the CX-5, Soul Red Crystal, white and Machine Grey are the favourites. For the Harrier, pearl white and black lead by far. Moreover, sunroofs, leather and 360-degree cameras are popular on both. In contrast, very rare colours can take longer to sell later, so choose carefully if resale matters. Similarly, keep the original wheels and trim, because buyers in Nairobi pay more for unmodified cars.</p>

<h2>Other rivals to consider</h2>
<p>The ${c('toyota-rav4', 'Toyota RAV4')} is more rugged and practical than the Harrier. The ${c('honda-cr-v', 'Honda CR-V')} offers a huge cabin. Meanwhile, the ${c('nissan-x-trail', 'Nissan X-Trail')} offers seven seats for less. Read our <a href="/blog/cheap-alternatives-to-prado-harrier-cx5/">cheap alternatives guide</a>.</p>

<h2>Where we deliver</h2>
<p>We serve buyers across Nairobi, including Kilimani, Westlands, Kileleshwa, South B, Syokimau and Ruaka. We also serve Nakuru, Eldoret, Kisumu, Thika, Nyeri, Nanyuki, Machakos and Meru. At the coast, we serve Mombasa, Nyali and Diani.</p>

<h2>Order your CX-5 or Harrier</h2>
<p>Use the order form on this page, or open the ${c(m, 'CX-5')} or ${c(t, 'Harrier')} page. Questions? Call ${telA()} or WhatsApp ${waA('Hi Elisa Motors, I have a question about the CX-5 and Harrier.')}. You can also read our <a href="/blog/mazda-cx-5-price-in-kenya/">CX-5 price guide</a> and <a href="/blog/toyota-harrier-price-in-kenya/">Harrier price guide</a>.</p>
`,
    faq: [
      ['Is the Mazda CX-5 cheaper than the Toyota Harrier?', `Yes. The CX-5 lands from about ${F(m)}, while the Harrier starts near ${F(t)}.`],
      ['Which is more fuel efficient: CX-5 or Harrier?', 'The Harrier Hybrid is the most efficient in town traffic. The CX-5 diesel is the most efficient on long highway trips.'],
      ['Which has better resale value in Kenya?', 'The Harrier holds its value better thanks to strong demand for Toyotas across Kenya.'],
      ['Which is more comfortable?', 'The Harrier is softer, quieter and more comfortable. The CX-5 handles more sharply.'],
      ['Which is better for rough roads?', 'Both have similar ground clearance. Choose an AWD version of either for rough roads, or consider a Subaru Forester for more clearance.'],
    ],
  };
};
