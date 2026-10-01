export default (h) => {
  const { YEAR, MIN_YEAR, P, F, c, cta, table, telA, waA } = h;
  return {
    slug: 'kra-import-duty-calculator-kenya',
    keyword: 'KRA car import duty calculator Kenya',
    tag: 'Import guide',
    cluster: 'Import costs, duty & clearing',
    crumb: 'How KRA calculates car import duty',
    title: `KRA Car Import Duty Calculator Kenya (${YEAR}): How Duty Works`,
    description: `How KRA calculates car import duty in Kenya: CRSP values, depreciation, import duty, excise, 16% VAT, IDF and RDL, and how to estimate your total.`,
    h1: `KRA Car Import Duty Calculator Kenya (${YEAR}): How CRSP, Import Duty, Excise, VAT, IDF and RDL Are Calculated`,
    excerpt: `A clear, step-by-step explanation of how KRA works out duty on an imported car: CRSP values, age depreciation, each tax in order, why invoices do not matter and how to estimate the total.`,
    published: '2026-10-01',
    updated: '2026-10-01',
    cars: ['toyota-aqua', 'toyota-corolla-fielder', 'toyota-harrier', 'toyota-land-cruiser-prado', 'mazda-cx-5', 'land-rover-range-rover-sport'],
    html: `
<p>Searching for a <b>KRA car import duty calculator for Kenya</b>? You are not alone. Duty is the largest cost after the car itself, and it surprises many first-time importers. Understanding how KRA calculates it helps you budget accurately, compare quotes fairly and choose the right car and year.</p>
<p>This guide explains the method step by step: the CRSP value, age depreciation, import duty, excise duty, VAT, the Import Declaration Fee and the Railway Development Levy. Moreover, it explains why your purchase invoice does not change the tax, and how hybrids and engine sizes affect it.</p>
<p>KRA updates its CRSP schedule and tax rates from time to time. Therefore, we explain the method rather than publish fixed figures that may go out of date. For an exact amount on a specific car, ask us for a written quote.</p>
${cta('Want an exact duty figure?', 'Send us the model, engine and year.', 'Hi Elisa Motors, please calculate duty for this car: ')}

<h2>Landed prices already include duty</h2>
<p>Every price on our website is an indicative landed price that already includes KRA taxes, shipping, clearing and registration. Here are examples:</p>
${table(['toyota-aqua', 'toyota-corolla-fielder', 'mazda-cx-5', 'toyota-harrier', 'toyota-land-cruiser-prado'], 'Example landed prices including KRA duty')}

<h2>Step 1: The CRSP value</h2>
<p>CRSP stands for Current Retail Selling Price. KRA publishes a schedule listing values for vehicles by make, model, engine size, fuel type and sometimes grade. This value is KRA's estimate of what the vehicle would sell for new.</p>
<p>KRA uses the CRSP value, not the price you paid, as the starting point for duty. As a result, two identical cars bought at different prices pay the same duty.</p>

<h2>Step 2: Depreciation for age</h2>
<p>Used cars are worth less than new ones. Therefore, KRA applies a depreciation allowance based on the vehicle's age. Older vehicles within the 8-year window receive more depreciation. The result is the customs value used for tax.</p>
<p>This is why a ${MIN_YEAR} car often pays less duty than a newer car of the same model. Read our <a href="/blog/kenya-8-year-rule-car-import/">8-year rule guide</a>.</p>

<h2>Step 3: Import duty</h2>
<p>Import duty is charged on the customs value. Rates for vehicles follow the East African Community Common External Tariff, applied by KRA. The rate depends on the vehicle's classification.</p>

<h2>Step 4: Excise duty</h2>
<p>Excise duty is charged on the customs value plus import duty. The rate depends on engine capacity and fuel type. Larger engines generally attract higher rates. Moreover, the government has at times set different treatment for hybrids and electric vehicles. Therefore, engine choice can change your tax bill noticeably.</p>

<h2>Step 5: VAT</h2>
<p>VAT at 16% is charged on the customs value plus import duty plus excise duty. Because it sits on top of the other taxes, VAT adds a significant amount.</p>

<h2>Step 6: IDF and RDL</h2>
<p>The Import Declaration Fee (IDF) and Railway Development Levy (RDL) are charged as percentages of the customs value. They are smaller than the other taxes. However, on expensive cars they still add up.</p>

<h2>Putting it together: the order of calculation</h2>
<p>The taxes build on each other in this order. First, find the CRSP value. Second, apply depreciation to get the customs value. Third, add import duty. Fourth, add excise duty on the value plus import duty. Fifth, add VAT on the value plus both duties. Finally, add IDF and RDL on the customs value.</p>
<p>Because each tax builds on the previous ones, small changes in the CRSP value or engine band have a large effect on the total.</p>

<h2>Why your invoice does not change duty</h2>
<p>Many buyers think a cheap auction price means low duty. However, KRA uses CRSP values. Therefore, a bargain purchase still pays the standard duty for that model and age. Similarly, under-declaring the invoice does not reduce duty and can lead to penalties.</p>

<h2>Vehicles not on the CRSP list</h2>
<p>Some rare models or new versions may not appear on the current schedule. In such cases, KRA determines a value using its own methods, which may involve comparable vehicles or other evidence. As a result, duty on rare cars can be harder to predict. We check before you buy.</p>

<h2>How engine choice affects duty</h2>
<p>Smaller engines usually fall into lower excise bands. For example, a 1.5-litre ${c('toyota-corolla-fielder', 'Fielder')} pays much less than a 2.8 diesel ${c('toyota-land-cruiser-prado', 'Prado')}. Similarly, hybrid versions may be treated differently. Therefore, compare duty on two versions before deciding. Read our <a href="/blog/hybrid-and-electric-car-imports-kenya/">hybrid import guide</a>.</p>

<h2>Other costs besides KRA taxes</h2>
<p>Your landed cost also includes the purchase price, shipping, marine insurance, port charges, shipping line fees, clearing agent fees, storage if any and NTSA registration. Read our <a href="/blog/mombasa-port-car-clearing-guide/">Mombasa clearing guide</a> and <a href="/blog/ntsa-registration-imported-car-kenya/">NTSA registration guide</a>.</p>

<h2>Online duty calculators: use with care</h2>
<p>Several websites offer car duty calculators. They can give a rough estimate. However, they may use outdated CRSP schedules or rates. Moreover, they may not include port and clearing costs. Therefore, treat online figures as estimates only and confirm with an importer.</p>

${h.specs('toyota-harrier', 'Example: how engine choice changes the landed price (Toyota Harrier)')}

<h2>Our services: exact duty, no surprises</h2>
<p>Elisa Motors calculates duty for buyers in Nairobi, Mombasa, Nakuru, Kisumu, Eldoret and beyond. Here is what we do.</p>

<h3>1. Exact CRSP lookup</h3>
<p>We look up the current CRSP value for your exact model and engine. As a result, our duty estimate is accurate.</p>
<p>We explain every figure.</p>

<h3>2. Version comparisons</h3>
<p>We compare duty across engines, grades and years. For example, petrol versus hybrid.</p>
<p>You choose with real numbers.</p>

<h3>3. All-inclusive landed quote</h3>
<p>Your quote includes the car, freight, insurance, every tax, port charges, clearing and registration. Moreover, payment terms are agreed in writing.</p>
<p>One figure covers everything.</p>

<h3>4. Correct declarations</h3>
<p>We declare vehicles correctly to avoid penalties and delays. Similarly, we ensure documents match the vehicle.</p>
<p>Honest declarations protect you.</p>

<h3>5. Sourcing from Japan and the UK</h3>
<p>We source cars that fit your total budget, including duty. Read our <a href="/blog/import-cars-from-japan-to-kenya/">Japan guide</a> and <a href="/blog/import-cars-from-uk-to-kenya/">UK guide</a>.</p>
<p>No overspending.</p>

<h3>6. Fast clearing</h3>
<p>We clear quickly at Mombasa to limit storage charges. Read our <a href="/blog/roro-vs-container-shipping-to-mombasa/">shipping guide</a>.</p>
<p>Speed saves money.</p>

<h3>7. Delivery across Kenya</h3>
<p>We deliver to Nairobi, Nakuru, Eldoret, Kisumu, Nyeri, Meru, Mombasa and other towns. Read our <a href="/blog/mombasa-to-nairobi-car-transport/">car transport guide</a>.</p>
<p>You collect a registered car.</p>

${cta('Want duty compared on two cars?', 'Send us both models.', 'Hi Elisa Motors, please compare duty on these two cars: ')}

<h2>Duty on commercial vehicles</h2>
<p>Vans, trucks and buses are classified differently from passenger cars. As a result, duty and excise treatment can differ. For example, a goods van may be taxed differently from a passenger MPV of similar size. Therefore, correct classification matters. Read our <a href="/blog/commercial-vehicle-imports-from-japan-kenya/">commercial vehicle import guide</a>.</p>

<h2>Duty exemptions and concessions</h2>
<p>Some importers qualify for concessions, including certain returning residents, diplomats and persons with disabilities. Strict conditions apply, and selling exempted vehicles later can trigger duty. Read our <a href="/blog/returning-residents-car-import-kenya/">duty exemptions guide</a>.</p>

<h2>What happens if KRA revalues your car?</h2>
<p>Sometimes KRA's assessment differs from what the importer expected. For example, a car declared as a lower grade may be reassessed as a higher one after verification. In that case, extra duty is due before release. Moreover, storage charges continue while the issue is resolved.</p>
<p>Importers can request a review if they believe the assessment is wrong. However, reviews take time. Therefore, accurate declarations from the start are the best protection.</p>

<h2>Paying duty</h2>
<p>Duty is paid through KRA's systems once the customs entry is assessed. Your clearing agent lodges the entry and provides the payment details. After payment, the car proceeds to verification and release. Consequently, delays in payment delay the whole process.</p>

<h2>How to budget for duty</h2>
<p>When planning a car purchase, budget for the total landed cost, not the overseas price. A practical approach is to ask for landed quotes on two or three cars. Then compare them directly. Moreover, keep a small reserve for exchange rate movements between quote and payment.</p>
<p>If your budget is tight, consider a smaller engine, an older car within the window or a hybrid version. Each can reduce duty. Read our <a href="/blog/best-suv-under-5-million-kenya/">best SUVs under 5 million guide</a> and <a href="/blog/cheap-japanese-cars-under-1-million-kenya/">cheap cars guide</a>.</p>

<h2>Duty myths</h2>
<p>First, "duty is cheaper if you import through Uganda or Tanzania". In practice, cars registered in Kenya must meet Kenyan rules and pay Kenyan taxes. Second, "a cheap invoice lowers duty". It does not, because KRA uses CRSP values. Third, "all hybrids are duty free". Policies change, so check current rules. As a result, rely on current, verified information.</p>

${h.specs('toyota-corolla-fielder', 'Example: Corolla Fielder petrol vs hybrid landed prices')}

${h.specs('mazda-cx-5', 'Example: Mazda CX-5 petrol vs diesel landed prices')}

<h2>Where we deliver</h2>
<p>We serve buyers across Nairobi, including Westlands, Kilimani, Karen, South C, Syokimau and Ruaka. We also serve Nakuru, Eldoret, Kisumu, Thika, Nyeri, Nanyuki, Machakos and Meru. At the coast, we serve Mombasa, Nyali and Malindi.</p>

<h2>Get your duty quote</h2>
<p>Use the order form on this page, call ${telA()} or WhatsApp ${waA('Hi Elisa Motors, I have a question about KRA duty.')}. You can also read our <a href="/how-to-import-a-car-to-kenya/">full import guide</a>.</p>
`,
    faq: [
      ['How does KRA calculate duty on imported cars?', 'KRA starts with the CRSP value, applies age depreciation to get the customs value, then adds import duty, excise duty, 16% VAT, IDF and RDL in sequence.'],
      ['What is CRSP?', 'CRSP stands for Current Retail Selling Price. It is KRA\'s published schedule of vehicle values used to calculate duty.'],
      ['Does the price I paid affect duty?', 'No. KRA uses the CRSP value adjusted for age, not your purchase invoice.'],
      ['Do older cars pay less duty?', 'Yes. Older vehicles within the 8-year window receive more depreciation, so they usually pay less duty.'],
      ['Are online duty calculators accurate?', 'They give rough estimates but may use outdated values and exclude port and clearing costs. Confirm with an importer.'],
    ],
  };
};
