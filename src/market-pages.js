// Marketplace pages: owners sell their own cars. Data comes from /api/* at runtime (see api/).
export const PAYMENT = { paybill: '880100', account: '747328', amount: 995 };
const TOWNS = ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Machakos', 'Kiambu', 'Kitengela', 'Ruiru', 'Nyeri', 'Meru', 'Embu', 'Kericho', 'Kakamega', 'Kisii', 'Naivasha', 'Nanyuki', 'Malindi', 'Kitale', 'Bungoma', 'Garissa', 'Narok', 'Kajiado', 'Murang\'a', 'Kilifi', 'Voi', 'Isiolo', 'Homa Bay', 'Migori'];
const EXTRA_MAKES = ['Isuzu', 'Mitsubishi', 'Suzuki', 'Peugeot', 'Jeep', 'Hyundai', 'Kia', 'Ford', 'Chevrolet', 'Renault', 'Daihatsu', 'Hino', 'FAW', 'Tata', 'Scania', 'Mahindra'];

export function marketPages({ layout, add, site, esc, I, crumbs, faqHtml, faqLd, MAKES, BODIES, FUELS, YEAR, BUILD }) {
  const makes = [...new Set([...MAKES, ...EXTRA_MAKES])].sort();
  const opt = (arr, sel) => arr.map((x) => `<option${x === sel ? ' selected' : ''}>${esc(x)}</option>`).join('');
  const script = `<script src="/assets/js/market.js?v=${BUILD}" defer></script>`;
  const pay = PAYMENT;
  const payHow = `<ol class="pay-steps"><li>Open <b>M-Pesa</b> and choose <b>Lipa na M-Pesa</b></li><li>Choose <b>Paybill</b></li><li>Business number: <b class="num">${pay.paybill}</b></li><li>Account number: <b class="num">${pay.account}</b></li><li>Amount: <b class="num">KSh ${pay.amount.toLocaleString('en')}</b>, then enter your PIN</li></ol>`;
  const sellFaq = [
    ['How much does it cost to sell my car?', `A one-off KSh ${pay.amount.toLocaleString('en')} per car. Your listing stays live until the car is sold, with no monthly fees and no commission on the sale price.`],
    ['How do buyers contact me?', 'Buyers tap WhatsApp or Call on your listing and reach you directly. The WhatsApp message already includes a link to your car, so you know exactly which car they mean.'],
    ['Do I need a password?', 'No. Enter your email and we send you a 6-digit one-time code. Type it in and you are signed in.'],
    ['How do I pay?', `Pay with M-Pesa: Lipa na M-Pesa → Paybill → Business number ${pay.paybill} → Account number ${pay.account} → KSh ${pay.amount.toLocaleString('en')}. Then enter the M-Pesa code from your confirmation SMS on your account page.`],
    ['When does my car go live?', 'As soon as we confirm your M-Pesa payment, usually within a few hours during business hours. We email you when it is live.'],
    ['Can I change the price or photos later?', 'Yes. Edit the price, photos and description at any time from your account. You set your own price.'],
    ['What happens when I sell the car?', 'Tap “Mark as sold” on your account page. The listing shows as sold and buyers stop contacting you.'],
    ['Do you charge commission or use brokers?', 'No. There are no brokers and no commission. You deal with the buyer directly and keep the full sale price.'],
  ];

  // ---------------------------------------------------------------- Sell your car (landing)
  {
    const path = '/sell-your-car/';
    const cr = crumbs([['Home', '/'], ['Sell your car', path]]);
    const steps = [
      ['Add your car', `Upload up to 12 photos, set your own price and add the details buyers ask about.`],
      ['Confirm your email', 'Add your phone and email, then enter the 6-digit code we email you. No password.'],
      [`Pay KSh ${pay.amount} by M-Pesa`, `Paybill ${pay.paybill}, account ${pay.account}, then enter the M-Pesa code.`],
      ['Go live and get calls', 'Buyers WhatsApp or call you directly. No broker in the middle.'],
      ['Mark it as sold', 'One tap when the deal is done. That is it.'],
    ];
    const body = `<section class="block dark sell-hero"><div class="wrap">${cr.html.replace('class="crumbs"', 'class="crumbs crumbs-light"')}
  <div class="sell-hero-grid">
    <div>
      <span class="eyebrow">Sell with us faster</span>
      <h1>Sell your car in Kenya, fast and direct</h1>
      <p class="lede">No brokers. No commission. Everything at your fingertips. List your car once for <b>KSh ${pay.amount.toLocaleString('en')}</b> and it stays live until it is sold. Buyers contact you directly on WhatsApp or by phone.</p>
      <div class="btns"><a class="btn btn-primary" href="/account/#new">${I.car} Start selling</a><a class="btn btn-light" href="/used-cars/">See cars for sale</a></div>
    </div>
    <div class="price-card">
      <span class="eyebrow" style="color:var(--accent)">Seller package</span>
      <p class="price-big num">KSh ${pay.amount.toLocaleString('en')}</p>
      <p class="muted" style="margin:0 0 12px">per car · listed until sold</p>
      <ul class="feature-list">${['Unlimited time until your car is sold', 'Up to 12 photos', 'Set your own price', 'Buyers WhatsApp or call you directly', 'Edit or mark as sold anytime', 'No brokers, no commission'].map((t) => `<li>${I.check}<span>${t}</span></li>`).join('')}</ul>
      <a class="btn btn-primary btn-block" href="/account/#new">List my car</a>
    </div>
  </div>
</div></section>

<section class="block"><div class="wrap">
  <div class="section-head"><div><h2>How selling works</h2><p>Five steps, all from your phone.</p></div></div>
  <ol class="steps">${steps.map(([h, p]) => `<li><h3>${h}</h3><p>${p}</p></li>`).join('')}</ol>
</div></section>

<section class="block alt"><div class="wrap two-col">
  <div class="prose">
    <h2>Buyers reach you directly</h2>
    <p>Every listing has a <b>WhatsApp seller</b> and a <b>Call</b> button. When a buyer taps WhatsApp, the message is already written for them:</p>
    <blockquote class="wa-quote">Hi, I saw your vehicle 2018 Toyota Harrier on ${esc(site.url.replace('https://', ''))}<br>${esc(site.url)}/used-cars/…<br>Is it still available?</blockquote>
    <p>So you always know which car they are asking about, even if you sell more than one.</p>
  </div>
  <div class="order-box pay-box">
    <h2 style="font-size:1.25rem;margin:0">How to pay KSh ${pay.amount.toLocaleString('en')}</h2>
    ${payHow}
    <p class="small muted" style="margin:0">Then enter the M-Pesa code from your confirmation SMS on your account page. We confirm it and your car goes live.</p>
  </div>
</div></section>

<section class="block"><div class="wrap">
  <div class="section-head"><div><h2>Selling FAQs</h2></div></div>
  ${faqHtml(sellFaq)}
</div></section>

<section class="block"><div class="wrap"><div class="cta-band"><div><h2>Ready to sell your car?</h2><p>No brokers, no commission. KSh ${pay.amount.toLocaleString('en')} until it's sold.</p></div>
<div class="btns"><a class="btn btn-light" href="/account/#new">Start selling</a></div></div></div></section>`;
    add(path, layout({ path, title: `Sell Your Car in Kenya: No Brokers, No Commission | ${site.name}`, description: `Sell your car in Kenya directly to buyers. List it for KSh ${pay.amount.toLocaleString('en')} until it's sold, set your own price and get WhatsApp calls. No brokers, no commission.`, body, priority: 0.9, jsonld: [cr.ld, faqLd(sellFaq)] }));
  }

  // ---------------------------------------------------------------- Cars for sale (browse)
  {
    const path = '/used-cars/';
    const cr = crumbs([['Home', '/'], ['Cars for sale', path]]);
    const prices = [[0, 500000, 'Under KES 500K'], [500000, 1000000, 'KES 500K – 1M'], [1000000, 2000000, 'KES 1M – 2M'], [2000000, 3500000, 'KES 2M – 3.5M'], [3500000, 6000000, 'KES 3.5M – 6M'], [6000000, 0, 'Above KES 6M']];
    const body = `<div class="wrap">${cr.html}
<header class="page-head"><h1>Cars for sale in Kenya</h1><p>Buy directly from owners across Kenya. Every car is listed by its owner, so you call or WhatsApp the seller yourself. No brokers, no commission.</p></header>
<form class="market-filters" data-market-filters role="search">
  <label class="field"><span>Search</span><input name="q" type="search" placeholder="e.g. Harrier, Nairobi, 2018" autocomplete="off"></label>
  <label class="field"><span>Make</span><select name="make"><option value="">Any make</option>${opt(makes)}</select></label>
  <label class="field"><span>Body type</span><select name="body"><option value="">Any type</option>${opt(Object.keys(BODIES))}</select></label>
  <label class="field"><span>Fuel</span><select name="fuel"><option value="">Any fuel</option>${opt(Object.keys(FUELS))}</select></label>
  <label class="field"><span>Price</span><select name="price"><option value="">Any price</option>${prices.map(([a, b, t]) => `<option value="${a}-${b}">${t}</option>`).join('')}</select></label>
  <label class="field"><span>Sort</span><select name="sort"><option value="">Newest first</option><option value="price_asc">Price: low to high</option><option value="price_desc">Price: high to low</option><option value="year">Year: newest</option></select></label>
</form>
<p class="results-bar small muted" data-market-count aria-live="polite">Loading cars…</p>
<div class="car-grid" data-market-grid></div>
<div class="empty" data-market-empty hidden><h2 style="font-size:1.3rem">No cars match yet</h2><p class="muted">Try a different search, or be the first to list one.</p><a class="btn btn-primary" href="/sell-your-car/">Sell your car</a></div>
<p style="text-align:center;margin:24px 0 8px"><button class="btn btn-ghost" type="button" data-market-more hidden>Load more cars</button></p>
</div>
<section class="block"><div class="wrap"><div class="cta-band"><div><h2>Selling a car?</h2><p>List it for KSh ${pay.amount.toLocaleString('en')} until it's sold. Buyers contact you directly.</p></div>
<div class="btns"><a class="btn btn-light" href="/sell-your-car/">Sell with us</a></div></div></div></section>
<div data-page="browse"></div>${script}`;
    add(path, layout({ path, title: `Cars for Sale in Kenya by Owners: No Brokers | ${site.name}`, description: 'Browse used cars for sale in Kenya directly from owners in Nairobi, Mombasa, Nakuru and beyond. See photos and prices, then WhatsApp or call the seller. No brokers.', body, priority: 0.9, jsonld: [cr.ld] }));
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
  <p class="small muted" style="margin-top:20px">New here? <a href="#new">Sell a car</a>: add your car first, then confirm your email. KSh ${pay.amount.toLocaleString('en')} per car, listed until sold. <a href="/sell-your-car/">How it works</a></p>
</section>

<section data-view="dashboard" hidden>
  <div class="account-head">
    <div><h1 style="font-size:1.8rem;margin:0">My cars</h1><p class="muted small" style="margin:4px 0 0">Signed in as <b data-user-email></b> · <button class="linkish" type="button" data-logout>Sign out</button><span data-admin-link hidden> · <a href="/admin/">Admin dashboard</a></span></p></div>
    <a class="btn btn-primary" href="#new">${I.car} Sell a car</a>
  </div>
  <div data-my-list class="my-list"></div>
  <div class="empty" data-my-empty hidden><h2 style="font-size:1.3rem">You haven't listed a car yet</h2><p class="muted">Add photos, set your price and reach buyers directly for KSh ${pay.amount.toLocaleString('en')}, listed until sold.</p><a class="btn btn-primary" href="#new">Sell a car</a></div>
  <template data-pay-template><div class="pay-box">
    <b>Pay KSh ${pay.amount.toLocaleString('en')} to publish</b>
    ${payHow}
    <form data-form="pay" class="pay-form" novalidate><label class="field"><span>M-Pesa code from your SMS</span><input name="mpesa_code" placeholder="e.g. TKL4XY7Q2B" maxlength="12" autocapitalize="characters" autocomplete="off" required></label><button class="btn btn-primary" type="submit">Submit code</button></form>
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
        <label class="field"><span>Make <b class="req">*</b></span><input name="make" list="dl-makes" required placeholder="e.g. Toyota" autocomplete="off"></label>
        <label class="field"><span>Model <b class="req">*</b></span><input name="model" required placeholder="e.g. Harrier" autocomplete="off"></label>
        <label class="field"><span>Year <b class="req">*</b></span><select name="year" required><option value="">Choose…</option>${opt(years.map(String))}</select></label>
        <label class="field"><span>Price (KES) <b class="req">*</b></span><input name="price" inputmode="numeric" required placeholder="e.g. 2,450,000" autocomplete="off" data-money></label>
        <label class="field"><span>Mileage (km)</span><input name="mileage" inputmode="numeric" placeholder="e.g. 85,000" autocomplete="off" data-money></label>
        ${sel('condition', ['Locally used', 'Foreign used', 'Brand new'], 'Condition')}
        ${sel('fuel', Object.keys(FUELS), 'Fuel')}
        ${sel('transmission', ['Automatic', 'Manual'], 'Transmission')}
        ${sel('body', Object.keys(BODIES), 'Body type')}
        <label class="field"><span>Engine size (cc)</span><input name="engine_cc" inputmode="numeric" placeholder="e.g. 2000" autocomplete="off"></label>
        <label class="field"><span>Colour</span><input name="colour" placeholder="e.g. Pearl white" autocomplete="off"></label>
        <label class="field"><span>Location <b class="req">*</b></span><input name="location" list="dl-towns" required placeholder="e.g. Nairobi" autocomplete="address-level2"></label>
      </div>
      <p class="hint" data-locked-hint hidden>Make, model and year can't be changed after payment.</p>
      <label class="field" style="margin-top:14px"><span>Description</span><textarea name="description" rows="6" maxlength="4000" placeholder="Service history, features (sunroof, leather, reverse camera), number of owners, any faults, reason for selling…"></textarea></label>
    </fieldset>
    <fieldset><legend>Your details</legend>
      <div class="grid-2">
        <label class="field"><span>Your name</span><input name="seller_name" autocomplete="name" placeholder="e.g. John"></label>
        <label class="field"><span>WhatsApp / phone number <b class="req">*</b></span><input name="phone" type="tel" inputmode="tel" autocomplete="tel" required placeholder="0712 345 678"></label>
        <label class="field" data-anon-only><span>Email address <b class="req">*</b></span><input name="email" type="email" inputmode="email" autocomplete="email" placeholder="you@example.com"></label>
      </div>
      <p class="hint">Buyers WhatsApp or call your number directly, and it's shown only while your car is live. <span data-anon-only>We email you a 6-digit code to confirm it's you, and you use the same email to manage your listing later.</span></p>
    </fieldset>
    <p class="error-msg" data-error hidden></p>
    <div class="form-actions"><button class="btn btn-primary" type="submit" data-save>Save and continue</button><a class="btn btn-ghost" href="#" data-back>Cancel</a></div>
    <p class="small muted" data-anon-only style="margin-top:12px">Already listed a car? <a href="#" data-signin-link>Sign in to manage it</a></p>
  </form>
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
  <datalist id="dl-makes">${makes.map((m) => `<option value="${esc(m)}">`).join('')}</datalist>
  <datalist id="dl-towns">${TOWNS.map((t) => `<option value="${esc(t)}">`).join('')}</datalist>
</section>
</div>${script}`;
    add(path, layout({ path, noindex: true, title: `Sell Your Car: My Account | ${site.name}`, description: 'Sign in to list your car for sale, manage your listings and mark cars as sold.', body, bar: 'none' }));
  }

  // ---------------------------------------------------------------- Admin
  add('/admin/', layout({ path: '/admin/', noindex: true, bar: 'none', title: `Admin | ${site.name}`, description: 'Marketplace admin.', body: `<div class="wrap account" data-page="admin">
<div class="account-head"><div><h1 style="font-size:1.8rem;margin:0">Marketplace admin</h1><p class="muted small" style="margin:4px 0 0">Confirm M-Pesa payments (Paybill ${pay.paybill}, account ${pay.account}) before cars go live.</p></div></div>
<p data-admin-msg class="muted"></p>
<div class="chips admin-tabs" data-admin-tabs hidden>${[['pending_review', 'To confirm'], ['active', 'Live'], ['awaiting_payment', 'Unpaid'], ['rejected', 'Rejected'], ['sold', 'Sold'], ['all', 'All']].map(([v, t], i) => `<button type="button" class="chip${i ? '' : ' on'}" data-status="${v}">${t} <span class="count" data-count="${v}"></span></button>`).join('')}</div>
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
  <div class="section-head"><div><h2>Latest cars for sale by owners</h2><p>Buy directly from the owner. WhatsApp or call the seller, no broker in between.</p></div><a class="link-arrow" href="/used-cars/">All cars for sale →</a></div>
  <div class="car-grid" data-market-grid></div>
</div></section>
<section class="block"><div class="wrap"><div class="cta-band sell-band"><div><span class="eyebrow" style="color:#ffe6d9">Sell with us faster</span><h2>Selling your car? List it until it sells for KSh ${PAYMENT.amount.toLocaleString('en')}</h2><p>No brokers. No commission. Everything at your fingertips. Set your own price and buyers WhatsApp or call you directly.</p></div>
<div class="btns"><a class="btn btn-light" href="/sell-your-car/">${I.car} Sell your car</a><a class="btn btn-dark" href="/used-cars/">Browse cars for sale</a></div></div></div></section>`;
