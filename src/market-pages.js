import { seoLinks } from './seo-pages.js';
// Marketplace pages: owners sell their own cars. Data comes from /api/* at runtime (see api/).
export const PAYMENT = { paybill: '880100', account: '747328' };
// Keep in sync with PACKAGES in api/_lib.js
export const PACKAGES = [
  { id: '2w', name: '2 weeks', price: 450, blurb: 'Listed for 14 days' },
  { id: '1m', name: '1 month', price: 950, blurb: 'Listed for 30 days', tag: 'Sell your car faster' },
  { id: 'unlimited', name: 'Unlimited until sold', price: 1350, blurb: 'Stays live until you mark it sold', tag: 'Best value' },
];
const FROM = Math.min(...PACKAGES.map((p) => p.price)).toLocaleString('en');
const ENGINES = [660, 1000, 1200, 1300, 1490, 1500, 1600, 1800, 2000, 2200, 2400, 2500, 2700, 2800, 3000, 3500, 4000, 4200, 4500, 4600, 5000, 5700];
const COLOURS = ['White', 'Pearl white', 'Black', 'Silver', 'Grey', 'Blue', 'Dark blue', 'Red', 'Maroon', 'Green', 'Brown', 'Beige', 'Gold', 'Orange', 'Yellow', 'Purple', 'Other'];
const EXTRAS = ['Sunroof', 'Extra tyres', 'Spare wheel', 'Alloy rims', 'Leather seats', 'Electric seats', 'Reverse camera', 'Parking sensors', 'Navigation', 'Bluetooth / Android Auto', 'Push start / keyless', 'Cruise control',
  'Climate control', 'Tinted windows', 'Roof rails', 'Tow bar', 'Bull bar', 'Car tracker', 'Alarm', 'Dash cam', '4WD / AWD', 'Third row seats', 'New tyres', 'Full service history'];
// County -> towns and constituencies suggested in the sell form (sellers can type any town). Keep counties in sync with api/_lib.js
const PLACES = {
  Nairobi: ['Nairobi CBD', 'Westlands', 'Kilimani', 'Kileleshwa', 'Lavington', 'Parklands', 'Karen', "Lang'ata", 'South B', 'South C', 'Kasarani', 'Roysambu', 'Embakasi', 'Utawala', 'Donholm', 'Buruburu', 'Kahawa', 'Ruaraka', 'Dagoretti North', 'Dagoretti South', 'Kibra', 'Embakasi South', 'Embakasi North', 'Embakasi Central', 'Embakasi East', 'Embakasi West', 'Makadara', 'Kamukunji', 'Starehe', 'Mathare'],
  Mombasa: ['Mombasa Island', 'Mvita', 'Nyali', 'Bamburi', 'Mtwapa Road', 'Kisauni', 'Shanzu', 'Changamwe', 'Mikindani', 'Jomvu', 'Likoni', 'Tudor'],
  Kwale: ['Ukunda', 'Diani', 'Kwale', 'Msambweni', 'Lunga Lunga', 'Kinango', 'Matuga'],
  Kilifi: ['Kilifi', 'Malindi', 'Watamu', 'Mtwapa', 'Kaloleni', 'Rabai', 'Ganze', 'Magarini'],
  'Tana River': ['Hola', 'Garsen', 'Bura'],
  Lamu: ['Lamu', 'Mpeketoni'],
  'Taita-Taveta': ['Voi', 'Wundanyi', 'Taveta', 'Mwatate'],
  Garissa: ['Garissa', 'Dadaab'],
  Wajir: ['Wajir'],
  Mandera: ['Mandera'],
  Marsabit: ['Marsabit', 'Moyale'],
  Isiolo: ['Isiolo'],
  Meru: ['Meru', 'Maua', 'Nkubu', 'Timau', 'Imenti North', 'Imenti South', 'Igembe'],
  'Tharaka-Nithi': ['Chuka', 'Chogoria', 'Marimanti'],
  Embu: ['Embu', 'Runyenjes', 'Siakago', 'Manyatta'],
  Kitui: ['Kitui', 'Mwingi', 'Mutomo'],
  Machakos: ['Machakos Town', 'Athi River', 'Syokimau', 'Mlolongo', 'Kitengela Road', 'Mavoko', 'Kangundo', 'Matungulu', 'Kathiani', 'Yatta', 'Masinga', 'Mwala'],
  Makueni: ['Wote', 'Emali', 'Makindu', 'Mtito Andei', 'Kibwezi', 'Mbooni'],
  Nyandarua: ['Ol Kalou', 'Engineer', 'Njabini', 'Ol Joro Orok'],
  Nyeri: ['Nyeri', 'Karatina', 'Othaya', 'Mukurweini', 'Tetu', 'Kieni', 'Mathira'],
  Kirinyaga: ['Kerugoya', 'Kutus', 'Sagana', "Wang'uru", 'Mwea', 'Kagio'],
  "Murang'a": ["Murang'a", 'Kenol', 'Kangema', 'Maragua', 'Kigumo', 'Kandara', 'Kiharu', 'Gatanga'],
  Kiambu: ['Thika', 'Ruiru', 'Juja', 'Kiambu Town', 'Ruaka', 'Kikuyu', 'Limuru', 'Kahawa Sukari', 'Kahawa Wendani', 'Githurai', 'Banana', 'Wangige', 'Kabete', 'Githunguri', 'Gatundu', 'Kiambaa', 'Lari', 'Tatu City'],
  Turkana: ['Lodwar', 'Kakuma', 'Lokichogio'],
  'West Pokot': ['Kapenguria', 'Makutano', 'Chepareria'],
  Samburu: ['Maralal', 'Baragoi'],
  'Trans Nzoia': ['Kitale', 'Endebess', 'Kiminini', 'Saboti', 'Cherangany'],
  'Uasin Gishu': ['Eldoret Town', 'Turbo', 'Moiben', 'Soy', 'Kapseret', 'Kesses', 'Ainabkoi', 'Burnt Forest'],
  'Elgeyo-Marakwet': ['Iten', 'Kapsowar', 'Chepkorio'],
  Nandi: ['Kapsabet', 'Nandi Hills', 'Mosoriot'],
  Baringo: ['Kabarnet', 'Eldama Ravine', 'Marigat', 'Mogotio'],
  Laikipia: ['Nanyuki', 'Nyahururu', 'Rumuruti', 'Doldol'],
  Nakuru: ['Nakuru Town', 'Nakuru Town East', 'Nakuru Town West', 'Naivasha', 'Gilgil', 'Molo', 'Njoro', 'Rongai', 'Subukia', 'Bahati', 'Kuresoi', 'Mai Mahiu'],
  Narok: ['Narok', 'Kilgoris', 'Ololulunga', 'Nairegie Enkare'],
  Kajiado: ['Kitengela', 'Ongata Rongai', 'Ngong', 'Kiserian Town', 'Kajiado Town', 'Isinya Town', 'Kiserian', 'Isinya', 'Namanga', 'Loitokitok', 'Kimana'],
  Kericho: ['Kericho', 'Litein', 'Londiani', 'Kipkelion', 'Ainamoi'],
  Bomet: ['Bomet', 'Sotik', 'Mulot', 'Longisa'],
  Kakamega: ['Kakamega', 'Mumias', 'Malava', 'Lurambi', 'Butere', 'Shinyalu', 'Lugari'],
  Vihiga: ['Mbale', 'Luanda', 'Majengo', 'Hamisi', 'Emuhaya'],
  Bungoma: ['Bungoma', 'Webuye', 'Kimilili', 'Chwele', 'Kanduyi'],
  Busia: ['Busia', 'Malaba', 'Nambale', 'Funyula', 'Port Victoria'],
  Siaya: ['Siaya', 'Bondo', 'Ugunja', 'Usenge', 'Yala', 'Rarieda'],
  Kisumu: ['Kisumu City', 'Kisumu Central', 'Kisumu East', 'Kisumu West', 'Nyando', 'Muhoroni', 'Nyakach', 'Seme', 'Ahero', 'Maseno'],
  'Homa Bay': ['Homa Bay', 'Mbita', 'Oyugis', 'Kendu Bay', 'Ndhiwa', 'Rangwe'],
  Migori: ['Migori', 'Awendo', 'Rongo', 'Isebania', 'Uriri', 'Kehancha'],
  Kisii: ['Kisii', 'Ogembo', 'Suneka', 'Keumbu', 'Nyamache', 'Bobasi'],
  Nyamira: ['Nyamira', 'Keroka', 'Nyansiongo', 'Borabu'],
};
const COUNTIES = Object.keys(PLACES).sort();
const EXTRA_MAKES = ['Isuzu', 'Mitsubishi', 'Suzuki', 'Peugeot', 'Jeep', 'Hyundai', 'Kia', 'Ford', 'Chevrolet', 'Renault', 'Daihatsu', 'Hino', 'FAW', 'Tata', 'Scania', 'Mahindra'];
// Models sellers can pick, on top of every model in the import catalogue (older and commercial models common in Kenya)
const EXTRA_MODELS = {
  Toyota: ['Wish', 'Ist', 'Belta', 'Spacio', 'Ractis', 'Auris', 'Avensis', 'Caldina', 'Vanguard', 'Kluger', 'Mark II', 'Hilux Surf', 'Land Cruiser 100', 'Land Cruiser 80', 'Succeed', 'Lite Ace', 'Vitz RS', 'Runx', 'Allex', 'Corona', 'Duet', 'Platz', 'Sai', 'Harrier Hybrid', 'Prado TX', 'Prado TZ', 'Land Cruiser V8'],
  Nissan: ['Tiida', 'Wingroad', 'Sunny', 'Bluebird Sylphy', 'Dualis', 'Murano', 'Hardbody', 'Caravan', 'Latio', 'Lafesta', 'Presage', 'Terrano', 'Datsun', 'Moco', 'Bluebird'],
  Mazda: ['Verisa', 'Premacy', 'Biante', 'Tribute', 'Familia', 'MPV', 'Titan'],
  Honda: ['Airwave', 'Stream', 'Crossroad', 'Edix', 'Fit Shuttle', 'HR-V', 'Pilot', 'Elysion'],
  Subaru: ['Legacy', 'Legacy Wagon', 'Exiga', 'Trezia', 'Impreza WRX', 'Stella'],
  Mitsubishi: ['Galant', 'Lancer', 'Colt', 'Canter', 'Pajero iO', 'Pajero Mini', 'Shogun', 'Fuso Fighter'],
  Suzuki: ['Alto', 'Grand Vitara', 'Maruti', 'Ertiga', 'Celerio', 'Dzire', 'Vitara'],
  Daihatsu: ['Mira', 'Move', 'Terios', 'Boon', 'Cast', 'Sirion', 'Delta'],
  Isuzu: ['NPR', 'NQR', 'NKR', 'FRR', 'FSR', 'FVZ', 'FTR', 'Trooper', 'Bighorn', 'TFR (Pick-up)', 'KB'],
  Ford: ['Escape', 'Explorer', 'EcoSport', 'Edge', 'Expedition', 'F-150'],
  Volkswagen: ['Jetta', 'Crafter', 'Beetle', 'Scirocco', 'Sharan', 'Up'],
  'Mercedes-Benz': ['ML-Class', 'GL-Class', 'Vito', 'Actros', 'Axor', 'Atego', 'C200', 'E200', 'E250', 'C180'],
  BMW: ['3 Series Touring', '5 Series Touring', 'X5 M', 'M3', 'M5'],
  Audi: ['A1', 'A4 Avant', 'A6 Avant', 'Q5 Sportback', 'RS Q8'],
  'Land Rover': ['Freelander', 'Freelander 2', 'Discovery 3', 'Discovery 4', 'Range Rover'],
  Volvo: ['XC70', 'V40', 'S80', 'FH', 'FM'],
  Hyundai: ['ix35', 'Creta', 'Accent', 'Elantra', 'H-1', 'Grand i10', 'i10', 'Sonata', 'Palisade', 'Venue', 'County'],
  Kia: ['Rio', 'Cerato', 'Carens', 'Seltos', 'Soul', 'Optima', 'K2700', 'Carnival'],
  Lexus: ['GS', 'CT', 'HS'],
  Porsche: ['Cayenne Coupe', 'Macan S'],
  Jaguar: ['XJ', 'X-Type', 'S-Type'],
  Mini: ['Paceman', 'Coupe'],
  Peugeot: ['208', '301', '308', '2008', '3008', '5008', '508', '504', '405', '406', '407', 'Partner', 'Boxer', 'Landtrek'],
  Jeep: ['Wrangler', 'Grand Cherokee', 'Cherokee', 'Compass', 'Renegade', 'Gladiator'],
  Chevrolet: ['Captiva', 'Cruze', 'Trailblazer', 'Spark', 'Aveo', 'Optra', 'Tahoe'],
  Renault: ['Duster', 'Kwid', 'Koleos', 'Captur', 'Kangoo'],
  Hino: ['300 Series', '500 Series', '700 Series', 'Dutro', 'Ranger', 'Profia'],
  FAW: ['J5', 'J6', 'Tiger V', 'Bus'],
  Tata: ['Xenon', 'LPT 1618', 'Super Ace', 'Prima', 'Indica', 'Ultra'],
  Scania: ['P-Series', 'G-Series', 'R-Series', 'Bus'],
  Mahindra: ['Scorpio', 'XUV500', 'XUV700', 'Pik Up', 'Bolero', 'Thar'],
  Tesla: ['Model S', 'Model X'],
};

export function marketPages({ layout, add, site, esc, I, crumbs, faqHtml, faqLd, MAKES, BODIES, FUELS, YEAR, BUILD, cars }) {
  const makes = [...new Set([...MAKES, ...EXTRA_MAKES])].sort();
  // Make -> sorted model list for the model dropdowns (catalogue models + EXTRA_MODELS)
  const models = Object.fromEntries(makes.map((m) => [m, [...new Set([...cars.filter((c) => c.make === m).map((c) => c.model), ...(EXTRA_MODELS[m] || [])])].sort((a, b) => a.localeCompare(b, 'en', { numeric: true }))]));
  const modelData = `<script type="application/json" id="model-data">${JSON.stringify(models).replace(/</g, '\\u003c')}</script>`;
  const opt = (arr, sel) => arr.map((x) => `<option${x === sel ? ' selected' : ''}>${esc(x)}</option>`).join('');
  const script = `<script src="/assets/js/market.js?v=${BUILD}" defer></script>`;
  const pay = PAYMENT;
  const payHow = `<ol class="pay-steps"><li>Open <b>M-Pesa</b> and choose <b>Lipa na M-Pesa</b></li><li>Choose <b>Paybill</b></li><li>Business number: <b class="num">${pay.paybill}</b></li><li>Account number: <b class="num">${pay.account}</b></li><li>Amount: <b class="num" data-pay-amount>your package price</b>, then enter your PIN</li></ol>`;
  const kshs = (n) => 'KSh ' + n.toLocaleString('en');
  const pkgCards = (cta) => `<div class="pkg-grid">${PACKAGES.map((p) => `<div class="pkg-card${p.tag === 'Sell your car faster' ? ' pkg-hot' : ''}">${p.tag ? `<span class="pkg-tag">${p.tag}</span>` : ''}<h3>${p.name}</h3><p class="price-big num">${kshs(p.price)}</p><p class="muted small" style="margin:0 0 12px">${p.blurb}</p>${cta ? `<a class="btn ${p.tag === 'Sell your car faster' ? 'btn-primary' : 'btn-ghost'} btn-block" href="/account/#new">Choose ${p.name.toLowerCase()}</a>` : ''}</div>`).join('')}</div>`;
  const pkgList = PACKAGES.map((p) => `${p.name} for ${kshs(p.price)}`).join(', ');
  const sellFaq = [
    ['How much does it cost to sell my car?', `Choose a package when you post your car: ${pkgList}. You pay once per car, with no commission on the sale price.`],
    ['What happens when my package ends?', 'Your listing comes off the site automatically. You can renew it from your account at any time by choosing a package and paying again. The unlimited package never ends until you mark the car as sold.'],
    ['How do buyers contact me?', 'Buyers tap WhatsApp or Call on your listing and reach you directly. The WhatsApp message already includes a link to your car, so you know exactly which car they mean.'],
    ['Do I need a password?', 'No. Enter your email and we send you a 6-digit one-time code. Type it in and you are signed in.'],
    ['How do I pay?', `Pay with M-Pesa: Lipa na M-Pesa → Paybill → Business number ${pay.paybill} → Account number ${pay.account} → the price of your package. Then enter the M-Pesa code from your confirmation SMS on your account page. You can also pay online with M-Pesa or card through Paystack.`],
    ['When does my car go live?', 'As soon as we confirm your M-Pesa code, usually within a few hours during business hours. Online Paystack payments go live instantly. We email you when it is live.'],
    ['Can I change the price or photos later?', 'Yes. Edit the price, photos and description at any time from your account. You set your own price.'],
    ['What happens when I sell the car?', 'Tap “Mark as sold” on your account page. The listing shows as sold and buyers stop contacting you.'],
    ['Do you charge commission or use brokers?', 'No. There is no commission and no middleman. You deal with the buyer directly and keep the full sale price.'],
    ['Can car dealers list cars?', 'Yes. Dealers and private sellers both list on Buy Car in Kenya. Choose “Dealer” when you add a car, and each car is listed separately with its own package. Sign in with the same email to manage all your cars.'],
  ];

  // ---------------------------------------------------------------- Sell your car (landing)
  {
    const path = '/sell-your-car/';
    const cr = crumbs([['Home', '/'], ['Sell your car', path]]);
    const steps = [
      ['Add your car', `Upload up to 12 photos, set your own price and add the details buyers ask about.`],
      ['Choose a package and pay', `${pkgList}. Pay by M-Pesa Paybill ${pay.paybill}, account ${pay.account}, and enter the M-Pesa code.`],
      ['Confirm your email', 'We email you a 6-digit code. Enter it to save your listing. No password.'],
      ['Go live and get calls', 'We confirm your payment and your car goes live. Buyers WhatsApp or call you directly.'],
      ['Mark it as sold', 'One tap when the deal is done. That is it.'],
    ];
    const body = `<section class="block dark sell-hero"><div class="wrap">${cr.html.replace('class="crumbs"', 'class="crumbs crumbs-light"')}
  <div class="sell-hero-grid">
    <div>
      <span class="eyebrow">Sell with us faster</span>
      <h1>Sell your car in Kenya, fast and direct</h1>
      <p class="lede">For private sellers and dealers. No middleman. No commission. Everything at your fingertips. List your car from <b>KSh ${FROM}</b>: 2 weeks, 1 month or unlimited until sold. Buyers contact you directly on WhatsApp or by phone.</p>
      <div class="btns"><a class="btn btn-primary" href="/account/#new">${I.car} Start selling</a><a class="btn btn-light" href="/used-cars/">See cars for sale</a></div>
    </div>
    <div class="price-card">
      <span class="eyebrow" style="color:var(--accent)">Seller packages</span>
      <ul class="pkg-rows">${PACKAGES.map((p) => `<li${p.tag === 'Sell your car faster' ? ' class="hot"' : ''}><span><b>${p.name}</b>${p.tag ? `<small>${p.tag}</small>` : ''}</span><b class="num">${kshs(p.price)}</b></li>`).join('')}</ul>
      <ul class="feature-list">${['Private sellers and dealers', 'Up to 12 photos', 'Set your own price', 'Buyers WhatsApp or call you directly'].map((t) => `<li>${I.check}<span>${t}</span></li>`).join('')}</ul>
      <a class="btn btn-primary btn-block" href="/account/#new">List my car</a>
    </div>
  </div>
</div></section>

<section class="block"><div class="wrap">
  <div class="section-head"><div><h2>Choose your package</h2><p>Pick how long your car stays listed. Every package includes up to 12 photos and direct WhatsApp and calls from buyers.</p></div></div>
  ${pkgCards(true)}
</div></section>

<section class="block alt"><div class="wrap">
  <div class="section-head"><div><h2>How selling works</h2><p>Five steps, all from your phone.</p></div></div>
  <ol class="steps">${steps.map(([h, p]) => `<li><h3>${h}</h3><p>${p}</p></li>`).join('')}</ol>
</div></section>

<section class="block"><div class="wrap two-col">
  <div class="prose">
    <h2>Buyers reach you directly</h2>
    <p>Every listing has a <b>WhatsApp seller</b> and a <b>Call</b> button. When a buyer taps WhatsApp, the message is already written for them:</p>
    <blockquote class="wa-quote">Hi, I saw your vehicle 2018 Toyota Harrier on ${esc(site.url.replace('https://', ''))}<br>${esc(site.url)}/used-cars/…<br>Is it still available?</blockquote>
    <p>So you always know which car they are asking about, even if you sell more than one.</p>
  </div>
  <div class="order-box pay-box">
    <h2 style="font-size:1.25rem;margin:0">How to pay</h2>
    ${payHow}
    <p class="small muted" style="margin:0">Then enter the M-Pesa code from your confirmation SMS on your account page. We confirm it and your car goes live.</p>
    <p class="small muted" style="margin:0">Prefer to pay online? You can also pay with M-Pesa or card through Paystack from your account page.</p>
  </div>
</div></section>

<section class="block"><div class="wrap">
  <div class="section-head"><div><h2>Selling guides</h2></div></div>
  <ul class="chips link-chips"><li><a class="chip" href="/sell-your-car/how-to-sell-a-car-in-kenya/">How to sell a car in Kenya</a></li><li><a class="chip" href="/sell-your-car/car-valuation-kenya/">How much is my car worth?</a></li>${seoLinks.towns.slice(0, 6).map(([t, u]) => `<li><a class="chip" href="${u}">${esc(t.replace('Cars for sale in', 'Sell my car in'))}</a></li>`).join('')}</ul>
</div></section>

<section class="block"><div class="wrap">
  <div class="section-head"><div><h2>Selling FAQs</h2></div></div>
  ${faqHtml(sellFaq)}
</div></section>

<section class="block"><div class="wrap"><div class="cta-band"><div><h2>Ready to sell your car?</h2><p>No brokers, no commission. Packages from KSh ${FROM}.</p></div>
<div class="btns"><a class="btn btn-light" href="/account/#new">Start selling</a></div></div></div></section>`;
    add(path, layout({ path, title: `Sell My Car in Kenya Fast: List From KSh 450 | ${site.name}`, description: `Sell your car in Kenya directly to buyers. List it from KSh ${FROM} for 2 weeks, 1 month or until sold. Set your own price and get WhatsApp calls. No brokers.`, body, priority: 0.9, jsonld: [cr.ld, faqLd(sellFaq)] }));
  }

  // ---------------------------------------------------------------- Cars for sale (browse)
  {
    const path = '/used-cars/';
    const cr = crumbs([['Home', '/'], ['Cars for sale', path]]);
    const prices = [[0, 500000, 'Under KES 500K'], [500000, 1000000, 'KES 500K – 1M'], [1000000, 2000000, 'KES 1M – 2M'], [2000000, 3500000, 'KES 2M – 3.5M'], [3500000, 6000000, 'KES 3.5M – 6M'], [6000000, 0, 'Above KES 6M']];
    const body = `<div class="wrap">${cr.html}
<header class="page-head"><h1>Cars for sale in Kenya</h1><p>Browse cars listed by private sellers and dealers across Kenya. See photos, mileage, accident history and the price, then call or WhatsApp the seller yourself. No middleman, no commission.</p></header>
<form class="market-filters" data-market-filters role="search">
  <label class="field"><span>Search</span><input name="q" type="search" placeholder="e.g. Harrier, Nairobi, 2018" autocomplete="off"></label>
  <label class="field"><span>Make</span><select name="make"><option value="">Any make</option>${opt(makes)}</select></label>
  <label class="field"><span>Model</span><select name="model" disabled><option value="">Any model</option></select></label>
  <label class="field"><span>Body type</span><select name="body"><option value="">Any type</option>${opt(Object.keys(BODIES))}</select></label>
  <label class="field"><span>Seller</span><select name="seller_type"><option value="">Private & dealers</option><option>Private seller</option><option>Dealer</option></select></label>
  <label class="field"><span>County</span><select name="county"><option value="">All Kenya</option>${opt(COUNTIES)}</select></label>
  <label class="field"><span>Fuel</span><select name="fuel"><option value="">Any fuel</option>${opt(Object.keys(FUELS))}</select></label>
  <label class="field"><span>Price</span><select name="price"><option value="">Any price</option>${prices.map(([a, b, t]) => `<option value="${a}-${b}">${t}</option>`).join('')}</select></label>
  <label class="field check-field"><input type="checkbox" name="accident_free" value="1"><span>Accident free only</span></label>
  <label class="field"><span>Sort</span><select name="sort"><option value="">Newest first</option><option value="price_asc">Price: low to high</option><option value="price_desc">Price: high to low</option><option value="year">Year: newest</option></select></label>
</form>
<p class="results-bar small muted" data-market-count aria-live="polite">Loading cars…</p>
<div class="car-grid" data-market-grid></div>
<div class="empty" data-market-empty hidden><h2 style="font-size:1.3rem">No cars match yet</h2><p class="muted">Try a different search, or be the first to list one.</p><a class="btn btn-primary" href="/sell-your-car/">Sell your car</a></div>
<p style="text-align:center;margin:24px 0 8px"><button class="btn btn-ghost" type="button" data-market-more hidden>Load more cars</button></p>
<section class="block"><h2>Cars for sale by budget</h2><ul class="chips link-chips">${seoLinks.budgets.map(([t, u]) => `<li><a class="chip" href="${u}">${esc(t)}</a></li>`).join('')}</ul><h2 style="margin-top:24px">By type</h2><ul class="chips link-chips">${seoLinks.types.map(([t, u]) => `<li><a class="chip" href="${u}">${esc(t)}</a></li>`).join('')}</ul><h2 style="margin-top:24px">By town</h2><ul class="chips link-chips">${seoLinks.towns.map(([t, u]) => `<li><a class="chip" href="${u}">${esc(t)}</a></li>`).join('')}</ul><h2 style="margin-top:24px">Buying & selling guides</h2><ul class="chips link-chips">${seoLinks.guides.map(([t, u]) => `<li><a class="chip" href="${u}">${esc(t)}</a></li>`).join('')}</ul></section>
</div>
<section class="block"><div class="wrap"><div class="cta-band"><div><h2>Selling a car?</h2><p>List it from KSh ${FROM}. Buyers contact you directly.</p></div>
<div class="btns"><a class="btn btn-light" href="/sell-your-car/">Sell with us</a></div></div></div></section>
<div data-page="browse"></div>${modelData}${script}`;
    add(path, layout({ path, title: `Cars for Sale in Kenya: Sellers & Dealers | ${site.name}`, description: 'Browse cars for sale in Kenya from private sellers and dealers in Nairobi, Mombasa, Nakuru and beyond. See photos and prices, then WhatsApp the seller.', body, priority: 0.9, jsonld: [cr.ld] }));
  }

  // ---------------------------------------------------------------- Seller account (sign in + dashboard + listing form)
  {
    const path = '/account/';
    const sel = (name, list, label, req = false) => `<label class="field"><span>${label}${req ? ' <b class="req">*</b>' : ''}</span><select name="${name}"${req ? ' required' : ''}><option value="">Choose…</option>${opt(list)}</select></label>`;
    const years = Array.from({ length: YEAR + 2 - 1980 }, (_, i) => YEAR + 1 - i);
    const body = `<div class="wrap account" data-page="account">
<div data-view="loading"><p class="muted" style="padding:48px 0;text-align:center">Loading…</p></div>

<section data-view="login" hidden class="auth-card">
  <h1 style="font-size:1.8rem">Sign in</h1>
  <p class="muted">Manage your cars for sale. Enter your email and we'll send you a 6-digit code, with no password needed.</p>
  <form data-form="email" novalidate>
    <label class="field"><span>Email address</span><input name="email" type="email" inputmode="email" autocomplete="email" placeholder="you@example.com" required></label>
    <p class="error-msg" data-error hidden></p>
    <button class="btn btn-primary btn-block" type="submit">Email me a code</button>
  </form>
  <form data-form="code" novalidate hidden>
    <p>We sent a code to <b data-email></b>. It expires in 10 minutes. Check your spam folder if you can't see it.</p>
    <label class="field"><span>6-digit code</span><input name="code" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]*" maxlength="6" placeholder="123456" required class="code-input"></label>
    <p class="error-msg" data-error hidden></p>
    <button class="btn btn-primary btn-block" type="submit">Sign in</button>
    <p class="small" style="margin-top:12px"><button class="linkish" type="button" data-change-email>Use a different email</button> · <button class="linkish" type="button" data-resend>Resend code</button></p>
  </form>
  <p class="small muted" style="margin-top:20px">New here? <a href="#new">Sell a car</a>: add your car first, then confirm your email. Packages from KSh ${FROM}. <a href="/sell-your-car/">How it works</a></p>
</section>

<section data-view="dashboard" hidden>
  <div class="account-head">
    <div><h1 style="font-size:1.8rem;margin:0">My cars</h1><p class="muted small" style="margin:4px 0 0">Signed in as <b data-user-email></b> · <button class="linkish" type="button" data-logout>Sign out</button><span data-admin-link hidden> · <a href="/admin/">Admin dashboard</a></span></p></div>
    <a class="btn btn-primary" href="#new">${I.car} Sell a car</a>
  </div>
  <p class="small muted" style="margin:-6px 0 14px">Each car you add is a separate listing. Choose a package for it (2 weeks KSh 450, 1 month KSh 950 or unlimited until sold KSh 1,350) and pay for it by M-Pesa Paybill ${pay.paybill}, account ${pay.account}.</p>
  <p class="note pay-msg" data-pay-msg hidden></p>
  <div data-my-list class="my-list"></div>
  <div class="empty" data-my-empty hidden><h2 style="font-size:1.3rem">You haven't listed a car yet</h2><p class="muted">Add photos, set your price and reach buyers directly. Packages from KSh ${FROM}.</p><a class="btn btn-primary" href="#new">Sell a car</a></div>
  <template data-pay-template><div class="pay-box">
    <b data-pay-title>Pay to publish</b>
    <label class="field" data-renew-pkg hidden><span>Choose a package</span><select name="package">${PACKAGES.map((p) => `<option value="${p.id}">${p.name}: ${kshs(p.price)}</option>`).join('')}</select></label>
    <span class="pay-label">Pay with M-Pesa Paybill</span>
    ${payHow}
    <form data-form="pay" class="pay-form" novalidate><label class="field"><span>M-Pesa code from your SMS</span><input name="mpesa_code" placeholder="e.g. TKL4XY7Q2B" maxlength="12" autocapitalize="characters" autocomplete="off" required></label><button class="btn btn-primary" type="submit">Submit code</button></form>
    <p class="small muted" style="margin:0">We confirm your M-Pesa code and put your car live, usually within a few hours.</p>
    <div class="pay-alt">
      <span class="pay-label">Or pay online (M-Pesa or card)</span>
      <button class="btn btn-ghost btn-block" type="button" data-pay-online>Pay online with Paystack</button>
      <p class="small muted" style="margin:0">Secure checkout by Paystack. Your car goes live as soon as the payment goes through.</p>
    </div>
    <p class="error-msg" data-error hidden></p>
  </div></template>
</section>

<section data-view="form" hidden>
  <p class="small" style="margin:8px 0 0"><a href="#" data-back>← Back</a></p>
  <h1 style="font-size:1.8rem;margin:8px 0 4px" data-form-title>Sell a car</h1>
  <p class="muted" style="margin:0 0 18px">Good photos and honest details sell cars faster.</p>
  <form data-form="listing" class="listing-form" novalidate>
    <fieldset><legend>Photos <b class="req">*</b></legend>
      <p class="hint" style="margin:0 0 10px">Add up to 12 photos. The first photo is the cover. Show the front, back, sides, interior, dashboard (mileage) and engine.</p>
      <div class="photo-grid" data-photos></div>
      <label class="btn btn-ghost photo-add"><input type="file" accept="image/*" multiple data-photo-input hidden>＋ Add photos</label>
    </fieldset>
    <fieldset><legend>The car</legend>
      <div class="grid-2">
        <label class="field"><span>Make (brand) <b class="req">*</b></span><select name="make" required><option value="">Choose…</option>${opt(makes)}<option value="Other">Other make</option></select></label>
        <label class="field" data-make-other hidden><span>Type the make <b class="req">*</b></span><input name="make_other" placeholder="e.g. Proton" autocomplete="off"></label>
        <label class="field"><span>Model <b class="req">*</b></span><select name="model" required disabled><option value="">Choose the make first</option></select></label>
        <label class="field" data-model-other hidden><span>Type the model <b class="req">*</b></span><input name="model_other" placeholder="e.g. Harrier" autocomplete="off"></label>
        <label class="field"><span>Year <b class="req">*</b></span><select name="year" required><option value="">Choose…</option>${opt(years.map(String))}</select></label>
        <label class="field"><span>Price (KES) <b class="req">*</b></span><input name="price" inputmode="numeric" required placeholder="e.g. 2,450,000" autocomplete="off" data-money></label>
        <label class="field"><span>Mileage (km)</span><input name="mileage" inputmode="numeric" placeholder="e.g. 85,000" autocomplete="off" data-money></label>
        ${sel('condition', ['Locally used', 'Foreign used', 'Brand new'], 'Condition')}
        ${sel('fuel', Object.keys(FUELS), 'Fuel')}
        ${sel('transmission', ['Automatic', 'Manual'], 'Transmission')}
        ${sel('body', Object.keys(BODIES), 'Body type')}
        <label class="field"><span>Engine size</span><select name="engine_cc"><option value="">Choose…</option>${ENGINES.map((c) => `<option value="${c}">${c.toLocaleString('en')} cc (${(c / 1000).toFixed(1)}L)</option>`).join('')}<option value="">Electric / not sure</option></select></label>
        ${sel('colour', COLOURS, 'Colour')}
        <label class="field"><span>County <b class="req">*</b></span><select name="county" required><option value="">Choose…</option>${opt(COUNTIES)}</select></label>
        <label class="field"><span>Town or constituency <b class="req">*</b></span><select name="location" required disabled><option value="">Choose the county first</option></select></label>
        <label class="field" data-town-other hidden><span>Type the town <b class="req">*</b></span><input name="location_other" placeholder="e.g. Kikuyu" autocomplete="off"></label>
        <label class="field"><span>Estate <span class="muted small">(optional)</span></span><input name="estate" placeholder="e.g. Kilimani, South B, Milimani" autocomplete="off"></label>
      </div>
      <p class="hint" data-locked-hint hidden>Make, model and year can't be changed after payment.</p>
      <div class="field" style="margin-top:14px"><span class="field-label">Accident history <b class="req">*</b></span><div class="chips">${['Accident free', 'Has been in an accident'].map((a) => `<label class="chip"><input type="radio" name="accident" value="${a}" required>${a}</label>`).join('')}</div></div>
      <label class="field" style="margin-top:14px"><span>Description</span><textarea name="description" rows="6" maxlength="4000" placeholder="Service history, number of owners, any faults, recent repairs, reason for selling…"></textarea></label>
    </fieldset>
    <fieldset><legend>Features & extras</legend>
      <p class="hint" style="margin:0 0 10px">Tick everything the car has. Buyers filter and compare on these.</p>
      <div class="chips extras-chips">${EXTRAS.map((x) => `<label class="chip"><input type="checkbox" name="extras" value="${esc(x)}">${esc(x)}</label>`).join('')}</div>
    </fieldset>
    <fieldset data-pkg-field><legend>Choose your package <b class="req">*</b></legend>
      <div class="pkg-pick">${PACKAGES.map((p) => `<label class="pkg-option${p.tag === 'Sell your car faster' ? ' pkg-hot' : ''}"><input type="radio" name="package" value="${p.id}"${p.id === '1m' ? ' checked' : ''}><span class="pkg-name"><b>${p.name}</b>${p.tag ? `<small>${p.tag}</small>` : ''}<small class="muted">${p.blurb}</small></span><b class="num">${kshs(p.price)}</b></label>`).join('')}</div>
      <p class="hint" style="margin:10px 0 0">You pay by M-Pesa after saving. Your package starts when your car goes live.</p>
    </fieldset>
    <fieldset><legend>Your details</legend>
      <div class="grid-2">
        <div class="field" style="grid-column:1/-1"><span class="field-label">I am a <b class="req">*</b></span><div class="chips">${['Private seller', 'Dealer'].map((t, i) => `<label class="chip"><input type="radio" name="seller_type" value="${t}"${i ? '' : ' checked'}>${t}</label>`).join('')}</div></div>
        <label class="field"><span>Your name or dealership</span><input name="seller_name" autocomplete="name" placeholder="e.g. John or Jabali Motors"></label>
        <label class="field"><span>WhatsApp / phone number <b class="req">*</b></span><input name="phone" type="tel" inputmode="tel" autocomplete="tel" required placeholder="0712 345 678"></label>
        <label class="field" data-anon-only><span>Email address <b class="req">*</b></span><input name="email" type="email" inputmode="email" autocomplete="email" placeholder="you@example.com"></label>
      </div>
      <p class="hint">Buyers WhatsApp or call your number directly, and it's shown only while your car is live. <span data-anon-only>We email you a 6-digit code to confirm it's you, and you use the same email to manage your listing later.</span></p>
    </fieldset>
    <p class="error-msg" data-error hidden></p>
    <div class="form-actions"><button class="btn btn-primary" type="submit" data-save>Save and continue</button><a class="btn btn-ghost" href="#" data-back>Cancel</a></div>
    <p class="small muted" data-anon-only style="margin-top:12px">Already listed a car? <a href="#" data-signin-link>Sign in to manage it</a></p>
  </form>
  <div class="auth-card pay-step" data-pay-step hidden>
    <h2 style="font-size:1.4rem;margin:0 0 6px">Pay for your listing</h2>
    <p data-pay-summary style="margin:0 0 12px"></p>
    <span class="pay-label">Pay with M-Pesa Paybill</span>
    ${payHow}
    <form data-form="paystep" novalidate style="margin-top:12px">
      <label class="field"><span>M-Pesa code from your SMS</span><input name="mpesa_code" placeholder="e.g. TKL4XY7Q2B" maxlength="12" autocapitalize="characters" autocomplete="off" required class="code-input" style="letter-spacing:.15em;font-size:1.2rem"></label>
      <p class="error-msg" data-error hidden></p>
      <button class="btn btn-primary btn-block" type="submit" data-paystep-submit>I've paid: continue</button>
      <p class="small" style="margin:4px 0 0"><button class="linkish" type="button" data-paystep-back>← Edit details</button></p>
    </form>
    <div class="pay-alt">
      <span class="pay-label">Or pay online (M-Pesa or card)</span>
      <button class="btn btn-ghost btn-block" type="button" data-paystep-online>Pay online with Paystack</button>
      <p class="small muted" style="margin:0">We confirm your email first, then open Paystack's secure checkout.</p>
    </div>
  </div>
  <div class="auth-card otp-step" data-otp-step hidden>
    <h2 style="font-size:1.4rem;margin:0 0 6px">Confirm your email</h2>
    <p>We sent a 6-digit code to <b data-otp-email></b>. Enter it to save your listing. Check your spam folder if you can't see it.</p>
    <form data-form="otp" novalidate>
      <label class="field"><span>6-digit code</span><input name="code" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]*" maxlength="6" placeholder="123456" required class="code-input"></label>
      <p class="error-msg" data-error hidden></p>
      <button class="btn btn-primary btn-block" type="submit">Confirm and save listing</button>
      <p class="small" style="margin:4px 0 0"><button class="linkish" type="button" data-otp-back>← Edit details</button> · <button class="linkish" type="button" data-otp-resend>Resend code</button></p>
    </form>
  </div>
  ${modelData}
  <script type="application/json" id="place-data">${JSON.stringify(PLACES).replace(/</g, '\\u003c')}</script>
</section>
</div>${script}`;
    add(path, layout({ path, noindex: true, title: `Sell Your Car: My Account | ${site.name}`, description: 'Sign in to list your car for sale, manage your listings and mark cars as sold.', body, bar: 'none' }));
  }

  // ---------------------------------------------------------------- Admin
  add('/admin/', layout({ path: '/admin/', noindex: true, bar: 'none', title: `Admin | ${site.name}`, description: 'Marketplace admin.', body: `<div class="wrap account" data-page="admin">
<div class="account-head"><div><h1 style="font-size:1.8rem;margin:0">Marketplace admin</h1><p class="muted small" style="margin:4px 0 0">Confirm M-Pesa payments (Paybill ${pay.paybill}, account ${pay.account}) before cars go live.</p></div></div>
<p data-admin-msg class="muted"></p>
<div class="chips admin-tabs" data-admin-tabs hidden>${[['pending_review', 'To confirm'], ['active', 'Live'], ['expired', 'Expired'], ['awaiting_payment', 'Unpaid'], ['rejected', 'Rejected'], ['sold', 'Sold'], ['all', 'All']].map(([v, t], i) => `<button type="button" class="chip${i ? '' : ' on'}" data-status="${v}">${t} <span class="count" data-count="${v}"></span></button>`).join('')}</div>
<div data-admin-list class="my-list" style="margin-top:16px"></div>
<section class="order-box" data-editors hidden style="margin-top:32px">
  <h2 style="font-size:1.25rem;margin:0">Editors</h2>
  <p class="muted small" style="margin:0">Editors can approve, reject and unpublish listings. Only you (the admin) can delete listings and manage editors. They sign in at /account/ with their email.</p>
  <ul class="editor-list" data-editor-list></ul>
  <form data-form="editor" class="pay-form" novalidate><label class="field"><span>Add editor by email</span><input name="email" type="email" placeholder="editor@example.com" required></label><button class="btn btn-primary" type="submit">Add editor</button></form>
  <p class="error-msg" data-error hidden></p>
</section>
</div>${script}` }));

  // ---------------------------------------------------------------- Template for server-rendered listing pages (api/listing-page.js)
  const shell = layout({ path: '/used-cars/%%SLUG%%/', noindex: true, title: '%%TITLE%%', description: '%%DESC%%', image: '/%%IMG%%', body: `%%BODY%%${script}` })
    .replace('<meta name="robots" content="noindex, follow">', '<meta name="robots" content="index, follow, max-image-preview:large">')
    .replace('<meta property="og:type" content="website">', '<meta property="og:type" content="product">');
  add('/_shell/listing.html', shell);
}

// Home page block: latest cars from owners (filled in by market.js; hidden when there are none)
export const homeMarket = ({ I }) => `
<section class="block" data-page="home-latest" hidden><div class="wrap">
  <div class="section-head"><div><h2>Latest cars for sale in Kenya</h2><p>Listed by private sellers and dealers across Kenya. WhatsApp or call the seller directly.</p></div><a class="link-arrow" href="/used-cars/">All cars for sale →</a></div>
  <div class="car-grid" data-market-grid></div>
</div></section>
<section class="block"><div class="wrap"><div class="cta-band sell-band"><div><span class="eyebrow" style="color:#ffe6d9">Sell with us faster</span><h2>Selling your car? List it from KSh ${FROM}</h2><p>No brokers. No commission. Everything at your fingertips. Set your own price and buyers WhatsApp or call you directly.</p></div>
<div class="btns"><a class="btn btn-light" href="/sell-your-car/">${I.car} Sell your car</a><a class="btn btn-dark" href="/used-cars/">Browse cars for sale</a></div></div></div></section>`;
