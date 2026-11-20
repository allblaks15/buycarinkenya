/* Buy Car in Kenya – marketplace front end: browse, seller account, admin dashboard (no dependencies) */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const kes = (n) => 'KES ' + Number(n).toLocaleString('en-KE');
  const num = (v) => String(v || '').replace(/[^\d]/g, '');
  const STATUS = { awaiting_payment: 'Awaiting payment', pending_review: 'Confirming payment', active: 'Live', expired: 'Expired', sold: 'Sold', rejected: 'Needs attention' };
  const PKG = { '2w': { name: '2 weeks', price: 450 }, '1m': { name: '1 month', price: 950 }, unlimited: { name: 'Unlimited until sold', price: 1350 } };
  const day = (d) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  // Model dropdowns follow the chosen make (#model-data is generated at build time)
  const MODELS = (() => { try { return JSON.parse($('#model-data').textContent); } catch { return {}; } })();
  function fillModels(sel, make, { any = false, current = '' } = {}) {
    const list = MODELS[make] || [];
    const first = any ? '<option value="">Any model</option>' : `<option value="">${make ? 'Choose…' : 'Choose the make first'}</option>`;
    sel.innerHTML = first + list.map((m) => `<option>${esc(m)}</option>`).join('') + (any || !make ? '' : '<option value="Other">Other model</option>');
    sel.disabled = !make;
    if (current) sel.value = list.includes(current) ? current : (any ? '' : 'Other');
    if (!any && make && !list.length) sel.value = 'Other';
    return sel.value;
  }

  async function api(path, data, opts = {}) {
    const res = await fetch(path, data === undefined ? { credentials: 'same-origin', ...opts } : { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify(data), ...opts });
    const out = await res.json().catch(() => ({}));
    if (!res.ok) { const e = new Error(out.error || 'Something went wrong. Please try again.'); e.status = res.status; throw e; }
    return out;
  }
  const showErr = (box, msg) => { const el = $('[data-error]', box); if (el) { el.textContent = msg || ''; el.hidden = !msg; } };
  const busy = (btn, on, label) => { if (!btn) return; if (on) { btn.dataset.label = btn.textContent; btn.textContent = label || 'Please wait…'; } else if (btn.dataset.label) btn.textContent = btn.dataset.label; btn.disabled = on; };

  // ---------- listing card (browse + home) ----------
  const card = (l) => `<article class="car-card">
  <div class="ph"><img src="${esc(l.photos[0]?.thumb || '/assets/img/placeholder-car.svg')}" alt="${esc(`${l.title} for sale in ${l.location}`)}" width="600" height="400" loading="lazy" decoding="async"></div>
  <div class="body">
    <span class="make">${esc(l.make)}${l.body ? ' · ' + esc(l.body) : ''}</span>
    <h3><a href="${esc(l.url)}">${esc(l.title)}</a></h3>
    <div class="specs-mini">${[l.mileage != null && `${Number(l.mileage).toLocaleString('en-KE')} km`, l.fuel, l.transmission, l.condition].filter(Boolean).map((t) => `<span>${esc(t)}</span>`).join('')}${l.accident === 'Accident free' ? '<span class="ok-chip">✓ Accident free</span>' : ''}</div>
    <div class="foot"><div class="price-from"><small>Price</small><b class="num">${kes(l.price)}</b></div><div class="flags">📍 ${esc([l.estate, l.location, l.county].filter(Boolean).filter((x, i, a) => a.indexOf(x) === i).join(", "))}</div></div>
  </div>
</article>`;

  // ---------- gallery on listing pages ----------
  const main = $('[data-gallery-main]');
  if (main) $$('.thumbs button').forEach((b) => b.addEventListener('click', () => {
    main.src = b.dataset.src; main.alt = b.dataset.alt || main.alt;
    $$('.thumbs button').forEach((x) => x.setAttribute('aria-current', x === b));
  }));

  // ---------- home: latest owner listings ----------
  const home = $('[data-page="home-latest"]');
  if (home) api('/api/listings?limit=6').then((r) => { if (r.listings.length) { $('[data-market-grid]', home).innerHTML = r.listings.map(card).join(''); home.hidden = false; } }).catch(() => {});

  // ---------- browse ----------
  if ($('[data-page="browse"]')) {
    const form = $('[data-market-filters]'); const grid = $('[data-market-grid]'); const more = $('[data-market-more]');
    const count = $('[data-market-count]'); const empty = $('[data-market-empty]');
    let page = 1; let timer;
    // Keep filters in the URL so results can be shared
    const params = new URLSearchParams(location.search);
    for (const [k, v] of params) { const el = form.elements[k]; if (el && k !== 'model') { if (el.type === 'checkbox') el.checked = true; else el.value = v; } }
    fillModels(form.model, form.make.value, { any: true, current: params.get('model') || '' });
    const query = () => {
      const q = new URLSearchParams();
      for (const el of form.elements) if (el.name && el.value && (el.type !== 'checkbox' || el.checked)) q.set(el.name, el.value);
      return q;
    };
    async function load(reset) {
      if (reset) page = 1;
      const q = query(); history.replaceState(null, '', q.toString() ? `?${q}` : location.pathname);
      const [min, max] = (q.get('price') || '').split('-'); q.delete('price');
      if (min) q.set('min', min); if (max && max !== '0') q.set('max', max);
      q.set('page', page);
      try {
        const r = await api(`/api/listings?${q}`);
        if (reset) grid.innerHTML = '';
        grid.insertAdjacentHTML('beforeend', r.listings.map(card).join(''));
        count.textContent = r.total ? `${r.total.toLocaleString('en-KE')} car${r.total === 1 ? '' : 's'} for sale` : '';
        empty.hidden = r.total > 0; more.hidden = page >= r.pages;
      } catch (e) { count.textContent = e.message; }
    }
    form.addEventListener('input', (e) => { if (e.target.name === 'make') fillModels(form.model, form.make.value, { any: true }); clearTimeout(timer); timer = setTimeout(() => load(true), e.target.name === 'q' ? 350 : 0); });
    form.addEventListener('submit', (e) => { e.preventDefault(); load(true); });
    more.addEventListener('click', () => { page++; load(false); });
    load(true);
  }

  // ---------- photo resize + upload ----------
  async function resize(file, max, quality) {
    let src;
    try { src = await createImageBitmap(file, { imageOrientation: 'from-image' }); } catch {
      src = await new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => no(new Error('This photo format is not supported. Use JPG or PNG.')); i.src = URL.createObjectURL(file); });
    }
    const w = src.width || src.naturalWidth; const h = src.height || src.naturalHeight;
    const s = Math.min(1, max / Math.max(w, h));
    const c = document.createElement('canvas'); c.width = Math.round(w * s); c.height = Math.round(h * s);
    c.getContext('2d').drawImage(src, 0, 0, c.width, c.height);
    return new Promise((ok) => c.toBlob(ok, 'image/jpeg', quality));
  }
  // Photos are resized in the browser first; they are uploaded only once the seller's email is confirmed
  const prepare = async (file) => { const [big, small] = await Promise.all([resize(file, 1600, 0.82), resize(file, 520, 0.75)]); return { big, small }; };
  async function send(p) {
    const put = async (blob, kind) => {
      const r = await fetch(`/api/upload?kind=${kind}`, { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'image/jpeg' }, body: blob });
      const out = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(out.error || 'Photo upload failed. Please try again.');
      return out.url;
    };
    const [url, thumb] = await Promise.all([put(p.big, 'main'), put(p.small, 'thumb')]);
    return { url, thumb };
  }

  // ---------- seller account ----------
  const acct = $('[data-page="account"]');
  if (acct) {
    let user = null; let mine = [];
    const views = $$('[data-view]', acct);
    const show = (name) => { views.forEach((v) => { v.hidden = v.dataset.view !== name; }); window.scrollTo(0, 0); };
    const emailForm = $('[data-form="email"]', acct); const codeForm = $('[data-form="code"]', acct);
    let pendingEmail = '';

    async function sendCode(btn) {
      const email = (pendingEmail = emailForm.email.value.trim());
      showErr(emailForm, ''); showErr(codeForm, ''); busy(btn, true, 'Sending code…');
      try {
        await api('/api/auth', { action: 'request', email });
        $('[data-email]', codeForm).textContent = email; emailForm.hidden = true; codeForm.hidden = false; codeForm.code.value = ''; codeForm.code.focus();
      } catch (e) { showErr(codeForm.hidden ? emailForm : codeForm, e.message); } finally { busy(btn, false); }
    }
    emailForm.addEventListener('submit', (e) => { e.preventDefault(); sendCode(e.submitter || $('button[type=submit]', emailForm)); });
    $('[data-resend]', acct).addEventListener('click', (e) => sendCode(e.target));
    $('[data-change-email]', acct).addEventListener('click', () => { codeForm.hidden = true; emailForm.hidden = false; emailForm.email.focus(); });
    codeForm.code.addEventListener('input', () => { codeForm.code.value = num(codeForm.code.value).slice(0, 6); if (codeForm.code.value.length === 6) codeForm.requestSubmit(); });
    codeForm.addEventListener('submit', async (e) => {
      e.preventDefault(); const btn = $('button[type=submit]', codeForm); showErr(codeForm, ''); busy(btn, true, 'Signing in…');
      try { user = (await api('/api/auth', { action: 'verify', email: pendingEmail, code: codeForm.code.value })).user; await route(); } catch (err) { showErr(codeForm, err.message); } finally { busy(btn, false); }
    });
    $('[data-logout]', acct).addEventListener('click', async () => { await api('/api/auth', { action: 'logout' }).catch(() => {}); user = null; location.hash = ''; route(); });

    // Dashboard
    const list = $('[data-my-list]', acct); const payTpl = $('[data-pay-template]', acct);
    function item(l) {
      const el = document.createElement('article'); el.className = 'my-item'; el.dataset.id = l.id;
      const acts = [];
      if (l.status === 'active') acts.push(`<a class="btn btn-ghost" href="${esc(l.url)}" target="_blank">View listing</a>`, `<button class="btn btn-wa" type="button" data-act="share">Share on WhatsApp</button>`, `<button class="btn btn-dark" type="button" data-act="sold">Mark as sold</button>`);
      if (l.status === 'sold') acts.push(`<button class="btn btn-ghost" type="button" data-act="relist">Not sold? Relist</button>`);
      if (l.status !== 'sold') acts.push(`<a class="btn btn-ghost" href="#edit-${l.id}">Edit</a>`);
      if (['awaiting_payment', 'rejected', 'sold', 'expired'].includes(l.status)) acts.push(`<button class="btn btn-ghost" type="button" data-act="delete">Delete</button>`);
      el.innerHTML = `<img src="${esc(l.photos[0]?.thumb || '/assets/img/placeholder-car.svg')}" alt="" width="150" height="100">
        <div><span class="status status-${l.status}">${STATUS[l.status]}</span><h3>${esc(l.title)}</h3>
        <div class="meta"><span class="num">${kes(l.price)}</span><span>📍 ${esc([l.estate, l.location, l.county].filter(Boolean).filter((x, i, a) => a.indexOf(x) === i).join(", "))}</span><span>${esc(l.package_name)} · KSh ${l.package_price.toLocaleString('en')}</span>${l.status === 'active' ? `<span>${l.expires_at ? `Live until ${day(l.expires_at)}` : 'Live until sold'}</span>` : ''}${['active', 'sold', 'expired'].includes(l.status) ? `<span>${l.views} views</span>` : ''}</div></div>
        <div class="full">
          ${l.status === 'pending_review' ? `<p class="note small" style="margin:0">We're confirming your M-Pesa payment (code <b>${esc(l.mpesa_code)}</b>). This usually takes a few hours during business hours, and we'll email you when your car is live.</p>` : ''}
          ${l.status === 'expired' ? `<p class="note small" style="margin:0"><b>Your package ended on ${day(l.expires_at)}.</b> Buyers can no longer see this car. Choose a package and pay again to renew it.</p>` : ''}
          ${l.status === 'rejected' && l.reject_reason ? `<p class="note small" style="margin:0"><b>Not live yet:</b> ${esc(l.reject_reason)}</p>` : ''}
          <div data-pay-slot></div>
          <div class="acts">${acts.join('')}</div><p class="error-msg" data-error hidden></p>
        </div>`;
      if (['awaiting_payment', 'rejected', 'expired'].includes(l.status)) {
        const pay = payTpl.content.cloneNode(true); $('[data-pay-slot]', el).append(pay);
        const box = $('.pay-box', el); const f = $('[data-form="pay"]', el); const pick = $('[data-renew-pkg] select', el);
        // Renewals (and unpaid listings) can switch package here
        $('[data-renew-pkg]', el).hidden = false; pick.value = l.package;
        const amount = () => { const p = PKG[pick.value]; $('[data-pay-title]', box).textContent = `${l.status === 'expired' ? 'Renew' : 'Pay'}: ${p.name} package, KSh ${p.price.toLocaleString('en')}`; $('[data-pay-amount]', box).textContent = `KSh ${p.price.toLocaleString('en')}`; $('[data-pay-online]', box).textContent = `Pay KSh ${p.price.toLocaleString('en')} online with Paystack`; };
        pick.addEventListener('change', amount); amount();
        // Paystack checkout: we come back to /account/?reference=… when it is done
        $('[data-pay-online]', box).addEventListener('click', async (e) => {
          busy(e.target, true, 'Opening secure checkout…'); showErr(box, '');
          try { location.href = (await api('/api/pay', { id: l.id, package: pick.value })).url; } catch (err) { showErr(box, err.message); busy(e.target, false); }
        });
        if (l.mpesa_code && l.status !== 'expired') f.mpesa_code.value = l.mpesa_code;
        f.addEventListener('submit', async (e) => {
          e.preventDefault(); const btn = $('button', f); busy(btn, true, 'Submitting…'); showErr(box, '');
          try { await api('/api/listings', { action: 'pay', id: l.id, package: pick.value, mpesa_code: f.mpesa_code.value }); await loadMine(); } catch (err) { showErr(box, err.message); busy(btn, false); }
        });
      }
      el.addEventListener('click', async (e) => {
        const act = e.target.closest('[data-act]')?.dataset.act; if (!act) return;
        if (act === 'share') { const u = location.origin + l.url; window.open(`https://wa.me/?text=${encodeURIComponent(`${l.title} for sale, ${kes(l.price)}: ${u}`)}`, '_blank'); return; }
        if (act === 'sold' && !confirm(`Mark your ${l.title} as sold? Buyers will stop contacting you.`)) return;
        if (act === 'delete' && !confirm(`Delete your ${l.title} listing and its photos? This can't be undone.`)) return;
        busy(e.target, true);
        try { await api('/api/listings', { action: act, id: l.id }); await loadMine(); } catch (err) { showErr(el, err.message); busy(e.target, false); }
      });
      return el;
    }
    async function loadMine() {
      mine = (await api('/api/listings?mine=1')).listings;
      list.replaceChildren(...mine.map(item));
      $('[data-my-empty]', acct).hidden = mine.length > 0;
    }

    // Listing form: car details first, then seller details; new sellers confirm their email with a code on submit
    const lf = $('[data-form="listing"]', acct); const photoBox = $('[data-photos]', lf); const photoInput = $('[data-photo-input]', lf);
    const otpBox = $('[data-otp-step]', acct); const otpForm = $('[data-form="otp"]', acct);
    const payStep = $('[data-pay-step]', acct); const payForm = $('[data-form="paystep"]', acct);
    let photos = []; let editing = null; let draft = null;
    const MAX = 12;
    const store = (k, v) => { try { if (v != null) localStorage.setItem(k, v); return localStorage.getItem(k) || ''; } catch { return ''; } };
    const setAnon = () => { $$('[data-anon-only]', acct).forEach((el) => { el.hidden = !!user; }); };
    function drawPhotos() {
      photoBox.innerHTML = photos.map((p, i) => `<div class="photo-tile${p.busy ? ' busy' : ''}${p.err ? ' err' : ''}">
        <img src="${esc(p.preview || p.thumb)}" alt="Photo ${i + 1}">${i === 0 && !p.err ? '<span class="cover">Cover</span>' : ''}
        <div class="tools"><button type="button" data-move="${i}" aria-label="Move photo ${i + 1} earlier"${i === 0 ? ' disabled' : ''}>←</button><button type="button" data-remove="${i}" aria-label="Remove photo ${i + 1}">✕</button></div></div>`).join('');
      $('.photo-add', lf).hidden = photos.length >= MAX;
    }
    photoBox.addEventListener('click', (e) => {
      const m = e.target.closest('[data-move]'); const r = e.target.closest('[data-remove]');
      if (m) { const i = +m.dataset.move; [photos[i - 1], photos[i]] = [photos[i], photos[i - 1]]; drawPhotos(); }
      if (r) { photos.splice(+r.dataset.remove, 1); drawPhotos(); }
    });
    photoInput.addEventListener('change', async () => {
      const files = [...photoInput.files].slice(0, MAX - photos.length); photoInput.value = '';
      const added = files.map((f) => ({ busy: true, preview: URL.createObjectURL(f), file: f }));
      photos.push(...added); drawPhotos();
      for (const p of added) {
        try { Object.assign(p, await prepare(p.file)); if (user) Object.assign(p, await send(p)); } catch (err) { p.err = err.message; }
        p.busy = false; drawPhotos();
      }
      if (added.some((p) => p.err)) setTimeout(() => { photos = photos.filter((p) => !p.err); drawPhotos(); }, 2500);
    });
    $$('[data-money]', lf).forEach((i) => i.addEventListener('input', () => { const n = num(i.value); i.value = n ? Number(n).toLocaleString('en-KE') : ''; }));

    function fillForm(l) {
      lf.reset(); editing = l; draft = null; photos = l ? l.photos.map((p) => ({ ...p })) : [];
      lf.hidden = false; otpBox.hidden = true; payStep.hidden = true;
      $('[data-form-title]', acct).textContent = l ? `Edit ${l.title}` : 'Sell your car';
      if (l) for (const k of ['make', 'model', 'year', 'price', 'mileage', 'fuel', 'transmission', 'body', 'engine_cc', 'colour', 'condition', 'county', 'location', 'estate', 'description', 'seller_name']) {
        if (lf.elements[k] && l[k] != null) lf.elements[k].value = ['price', 'mileage'].includes(k) ? Number(l[k]).toLocaleString('en-KE') : l[k];
      }
      // A make or colour not in our lists goes into "Other"
      if (l && lf.make.value !== l.make) { lf.make.value = 'Other'; lf.make_other.value = l.make; }
      if (fillModels(lf.model, l ? lf.make.value : '', { current: l ? l.model : '' }) === 'Other' && l) lf.model_other.value = l.model;
      if (l && l.colour && lf.colour.value !== l.colour) lf.colour.value = 'Other';
      $$('input[name=extras]', lf).forEach((c) => { c.checked = !!l && (l.extras || []).includes(c.value); });
      $$('input[name=accident]', lf).forEach((r) => { r.checked = !!l && l.accident === r.value; });
      $$('input[name=package]', lf).forEach((r) => { r.checked = r.value === (l ? l.package : '1m'); });
      // Package is picked when posting; after payment it is changed through renewal instead
      $('[data-pkg-field]', lf).hidden = !!l && !['awaiting_payment', 'rejected'].includes(l.status);
      showOther(); fillTowns();
      lf.phone.value = l ? '0' + String(l.phone).slice(3) : store('bcik_phone');
      if (!l) { lf.seller_name.value = store('bcik_name'); lf.email.value = store('bcik_email'); }
      const locked = l && !['awaiting_payment', 'rejected'].includes(l.status);
      for (const k of ['make', 'make_other', 'model', 'model_other', 'year']) lf.elements[k].disabled = !!locked || (k === 'model' && !lf.make.value);
      $('[data-locked-hint]', lf).hidden = !locked;
      $('[data-save]', lf).textContent = l ? 'Save changes' : 'Continue to payment';
      setAnon(); showErr(lf, ''); drawPhotos();
    }
    const showOther = () => { $('[data-make-other]', lf).hidden = lf.make.value !== 'Other'; $('[data-model-other]', lf).hidden = lf.model.value !== 'Other'; };
    lf.make.addEventListener('change', () => { fillModels(lf.model, lf.make.value); showOther(); });
    lf.model.addEventListener('change', showOther);
    // Town / constituency suggestions follow the county (#place-data is generated at build time)
    const PLACES = (() => { try { return JSON.parse($('#place-data').textContent); } catch { return {}; } })();
    const fillTowns = () => { $('#dl-towns').innerHTML = (PLACES[lf.county.value] || Object.values(PLACES).flat()).map((t) => `<option value="${esc(t)}">`).join(''); };
    lf.county.addEventListener('change', fillTowns);
    function collect() {
      const fd = new FormData(lf);
      const data = Object.fromEntries(fd);
      data.extras = fd.getAll('extras');
      if (data.make === 'Other') data.make = String(data.make_other || '').trim();
      if (data.model === 'Other') data.model = String(data.model_other || '').trim();
      delete data.make_other; delete data.model_other;
      if (editing && lf.make.disabled) Object.assign(data, { make: editing.make, model: editing.model, year: editing.year });
      data.price = num(data.price); data.mileage = num(data.mileage); data.engine_cc = num(data.engine_cc);
      return data;
    }
    // Same rules as the server, checked before we email a code
    function check(d) {
      if (!photos.some((p) => !p.err)) return 'Add at least one photo of your car.';
      if (!String(d.make || '').trim()) return lf.make.value === 'Other' ? 'Type the make of your car.' : 'Choose the make, e.g. Toyota.';
      if (!String(d.model || '').trim()) return lf.model.value === 'Other' ? 'Type the model of your car.' : 'Choose the model.';
      if (!d.year) return 'Choose the year.';
      if (!(+d.price >= 50000)) return 'Enter a price of at least KES 50,000.';
      if (!d.county) return 'Choose the county where the car is.';
      if (!String(d.location || '').trim()) return 'Enter the town or constituency, e.g. Westlands.';
      if (!d.accident) return 'Say whether the car has been in an accident.';
      if (!$('[data-pkg-field]', lf).hidden && !d.package) return 'Choose a package.';
      if (!/^(?:254|0)?[17]\d{8}$/.test(num(d.phone))) return 'Enter a valid Kenyan phone number, e.g. 0712 345 678.';
      if (!user && !/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(String(d.email || '').trim())) return 'Enter your email address. We send a code to confirm it.';
      return '';
    }
    async function save(data) {
      for (const p of photos) if (!p.url && p.big) { p.busy = true; drawPhotos(); try { Object.assign(p, await send(p)); } finally { p.busy = false; drawPhotos(); } }
      const { payOnline, ...payload } = data;
      payload.photos = photos.filter((p) => p.url).map(({ url, thumb }) => ({ url, thumb }));
      const r = await api('/api/listings', editing ? { action: 'update', id: editing.id, ...payload } : { action: 'create', ...payload });
      draft = null;
      // Chose Paystack on the pay step: the car is saved, now open checkout
      if (payOnline && r.listing) { location.href = (await api('/api/pay', { id: r.listing.id, package: r.listing.package })).url; return; }
      if (location.hash) location.hash = ''; else await route();
    }
    const panel = (name) => { lf.hidden = name !== 'form'; payStep.hidden = name !== 'pay'; otpBox.hidden = name !== 'otp'; window.scrollTo(0, 0); };
    async function requestCode(email) {
      await api('/api/auth', { action: 'request', email });
      $('[data-otp-email]', otpBox).textContent = email;
      panel('otp'); otpForm.reset(); showErr(otpForm, ''); otpForm.code.focus();
    }
    // New cars: details -> payment -> (new sellers) email code -> saved
    function showPay() {
      const p = PKG[draft.package];
      $('[data-pay-summary]', payStep).innerHTML = `<b>${esc(p.name)} package</b> for your ${esc(`${draft.year} ${draft.make} ${draft.model}`)}: <b>KSh ${p.price.toLocaleString('en')}</b>`;
      $('[data-pay-amount]', payStep).textContent = `KSh ${p.price.toLocaleString('en')}`;
      $('[data-paystep-online]', payStep).textContent = `Pay KSh ${p.price.toLocaleString('en')} online with Paystack`;
      payForm.reset(); showErr(payForm, ''); panel('pay');
    }
    async function proceed(btn) {
      if (!user) {
        busy(btn, true, 'Sending email code…');
        try { await requestCode(draft.email.trim()); } catch (err) { showErr(payForm, err.message); } finally { busy(btn, false); }
        return;
      }
      busy(btn, true, 'Saving your listing…');
      try { await save(draft); } catch (err) { showErr(payForm, err.message); } finally { busy(btn, false); }
    }
    lf.addEventListener('submit', async (e) => {
      e.preventDefault(); showErr(lf, '');
      if (photos.some((p) => p.busy)) return showErr(lf, 'Please wait for your photos to finish.');
      const data = collect(); const problem = check(data);
      if (problem) return showErr(lf, problem);
      store('bcik_phone', data.phone); store('bcik_name', data.seller_name);
      if (!editing) { draft = data; if (!user) store('bcik_email', data.email.trim()); showPay(); return; }
      const btn = $('[data-save]', lf); busy(btn, true, 'Saving…');
      try { await save(data); } catch (err) { showErr(lf, err.message); } finally { busy(btn, false); }
    });
    payForm.addEventListener('submit', (e) => {
      e.preventDefault(); showErr(payForm, '');
      const code = payForm.mpesa_code.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
      if (!/^[A-Z0-9]{10}$/.test(code)) return showErr(payForm, 'Enter the 10-character M-Pesa code from your confirmation SMS, e.g. TKL4XY7Q2B.');
      draft.mpesa_code = code; delete draft.payOnline;
      proceed($('[data-paystep-submit]', payForm));
    });
    $('[data-paystep-online]', payStep).addEventListener('click', (e) => { showErr(payForm, ''); delete draft.mpesa_code; draft.payOnline = true; proceed(e.target); });
    $('[data-paystep-back]', payStep).addEventListener('click', () => panel('form'));
    otpForm.code.addEventListener('input', () => { otpForm.code.value = num(otpForm.code.value).slice(0, 6); if (otpForm.code.value.length === 6) otpForm.requestSubmit(); });
    otpForm.addEventListener('submit', async (e) => {
      e.preventDefault(); if (!draft) return;
      const btn = $('button[type=submit]', otpForm); showErr(otpForm, ''); busy(btn, true, 'Confirming…');
      try { user = (await api('/api/auth', { action: 'verify', email: draft.email.trim(), code: otpForm.code.value })).user; } catch (err) { showErr(otpForm, err.message); busy(btn, false); return; }
      setAnon(); busy(btn, false); busy(btn, true, 'Saving your listing…');
      try { await save(draft); } catch (err) {
        // e.g. an M-Pesa code already used: back to the payment step, otherwise back to the details
        if (/M-Pesa/.test(err.message)) { showPay(); showErr(payForm, err.message); } else { panel('form'); showErr(lf, err.message); }
      } finally { busy(btn, false); }
    });
    $('[data-otp-back]', acct).addEventListener('click', () => panel(draft && !editing ? 'pay' : 'form'));
    $('[data-otp-resend]', acct).addEventListener('click', async (e) => { busy(e.target, true, 'Sending…'); try { await requestCode(draft.email.trim()); } catch (err) { showErr(otpForm, err.message); } finally { busy(e.target, false); } });
    $('[data-signin-link]', acct).addEventListener('click', (e) => { e.preventDefault(); location.hash = ''; });
    $$('[data-back]', acct).forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); if (user) location.hash = ''; else location.href = '/sell-your-car/'; }));

    async function route() {
      if (!user) {
        try { user = (await api('/api/auth')).user; } catch { user = null; }
      }
      setAnon();
      const h = location.hash;
      if (!user) {
        if (h === '#new') { if (!draft) fillForm(null); show('form'); return; }
        show('login'); emailForm.hidden = false; codeForm.hidden = true; return;
      }
      $('[data-user-email]', acct).textContent = user.email;
      $('[data-admin-link]', acct).hidden = !user.role;
      if (h === '#new') { fillForm(null); show('form'); return; }
      if (h.startsWith('#edit-')) {
        if (!mine.length) await loadMine().catch(() => {});
        const l = mine.find((x) => String(x.id) === h.slice(6));
        if (l) { fillForm(l); show('form'); return; }
      }
      show('dashboard');
      // Back from Paystack checkout
      const ref = new URLSearchParams(location.search).get('reference') || new URLSearchParams(location.search).get('trxref');
      if (ref) {
        history.replaceState(null, '', location.pathname);
        const box = $('[data-pay-msg]', acct); box.hidden = false; box.textContent = 'Checking your payment…';
        try {
          const r = await api(`/api/pay?reference=${encodeURIComponent(ref)}`);
          box.innerHTML = r.paid ? `<b>Payment received, thank you!</b> Your ${esc(r.package)} package is active and your car is now live.` : 'We have not received your payment yet. If you completed it, refresh this page in a minute.';
        } catch (err) { box.textContent = err.message; }
      }
      try { await loadMine(); } catch (err) { if (err.status === 401) { user = null; return route(); } showErr($('[data-view="dashboard"]', acct), err.message); }
    }
    window.addEventListener('hashchange', route);
    route();
  }

  // ---------- admin / editor dashboard ----------
  const adm = $('[data-page="admin"]');
  if (adm) {
    const msg = $('[data-admin-msg]', adm); const box = $('[data-admin-list]', adm); const tabs = $('[data-admin-tabs]', adm);
    let status = 'pending_review'; let me = null;
    const fmt = (d) => d ? new Date(d).toLocaleString('en-KE', { dateStyle: 'medium', timeStyle: 'short' }) : '–';
    function row(l) {
      const el = document.createElement('article'); el.className = 'my-item admin-item';
      const acts = [];
      if (l.status !== 'active') acts.push(`<button class="btn btn-primary" type="button" data-act="approve">${l.status === 'pending_review' ? `Approve KSh ${Number(l.package_price).toLocaleString('en')} & publish` : 'Publish'}</button>`);
      if (l.status === 'pending_review') acts.push(`<button class="btn btn-ghost" type="button" data-act="reject">Reject payment</button>`);
      if (l.status === 'active') acts.push(`<a class="btn btn-ghost" href="${esc(l.url)}" target="_blank">View</a>`, `<button class="btn btn-ghost" type="button" data-act="unpublish">Unpublish</button>`);
      if (me.role === 'admin') acts.push(`<button class="btn btn-ghost" type="button" data-act="delete">Delete</button>`);
      el.innerHTML = `<img src="${esc(l.photos[0]?.thumb || '/assets/img/placeholder-car.svg')}" alt="" width="150" height="100">
        <div><span class="status status-${l.status}">${STATUS[l.status]}</span><h3>${esc(l.title)}</h3><div class="meta"><span class="num">${kes(l.price)}</span><span>📍 ${esc([l.estate, l.location, l.county].filter(Boolean).filter((x, i, a) => a.indexOf(x) === i).join(", "))}</span><span>${l.photos.length} photos</span></div></div>
        <div class="full"><dl>
          <dt>Package</dt><dd><b>${esc(l.package_name)}: KSh ${Number(l.package_price).toLocaleString('en')}</b>${l.expires_at ? ` · ends ${fmt(l.expires_at)}` : ''}</dd><dt>M-Pesa code</dt><dd><b>${esc(l.mpesa_code || '–')}</b></dd><dt>Paid at</dt><dd>${fmt(l.paid_at)}</dd>
          <dt>Seller</dt><dd>${esc(l.seller_name || '')} <a href="tel:+${esc(l.phone)}">+${esc(l.phone)}</a></dd><dt>Email</dt><dd><a href="mailto:${esc(l.user_email)}">${esc(l.user_email)}</a></dd>
          <dt>Accident</dt><dd>${esc(l.accident || '–')}</dd>${l.extras?.length ? `<dt>Extras</dt><dd>${esc(l.extras.join(', '))}</dd>` : ''}<dt>Listed</dt><dd>${fmt(l.created_at)}</dd>${l.reject_reason ? `<dt>Reason</dt><dd>${esc(l.reject_reason)}</dd>` : ''}
        </dl>${l.description ? `<details><summary class="small">Description</summary><p class="small" style="white-space:pre-line">${esc(l.description)}</p></details>` : ''}
        <div class="acts">${acts.join('')}</div><p class="error-msg" data-error hidden></p></div>`;
      el.addEventListener('click', async (e) => {
        const act = e.target.closest('[data-act]')?.dataset.act; if (!act) return;
        let reason;
        if (act === 'reject' || act === 'unpublish') { reason = prompt(act === 'reject' ? 'Reason (sent to the seller):' : 'Reason for unpublishing:', act === 'reject' ? `We could not find your KSh ${Number(l.package_price).toLocaleString('en')} M-Pesa payment for this code.` : ''); if (reason === null) return; }
        if (act === 'delete' && !confirm(`Permanently delete ${l.title} and its photos?`)) return;
        busy(e.target, true);
        try { await api('/api/admin', { action: act, id: l.id, reason }); await load(); } catch (err) { showErr(el, err.message); busy(e.target, false); }
      });
      return el;
    }
    const drawEditors = (eds) => {
      $('[data-editor-list]', adm).innerHTML = eds.length ? eds.map((x) => `<li><span>${esc(x.email)}</span><button class="linkish" type="button" data-rm-editor="${esc(x.email)}">Remove</button></li>`).join('') : '<li class="muted">No editors yet.</li>';
    };
    async function load() {
      try {
        const r = await api(`/api/admin?status=${status}`);
        me = r.me; tabs.hidden = false; msg.textContent = `Signed in as ${me.email} (${me.role}).`;
        for (const [k, v] of Object.entries(r.counts)) { const c = $(`[data-count="${k}"]`, adm); if (c) c.textContent = v; }
        box.replaceChildren(...r.listings.map(row));
        if (!r.listings.length) box.innerHTML = '<p class="muted">Nothing here right now.</p>';
        const ed = $('[data-editors]', adm); ed.hidden = me.role !== 'admin'; if (r.editors) drawEditors(r.editors);
      } catch (err) {
        msg.innerHTML = err.status === 401 ? 'Please <a href="/account/">sign in</a> with your admin or editor email first.' : esc(err.message);
      }
    }
    tabs.addEventListener('click', (e) => { const b = e.target.closest('[data-status]'); if (!b) return; status = b.dataset.status; $$('[data-status]', tabs).forEach((x) => x.classList.toggle('on', x === b)); load(); });
    const ef = $('[data-form="editor"]', adm);
    ef.addEventListener('submit', async (e) => { e.preventDefault(); showErr(ef.parentElement, ''); try { drawEditors((await api('/api/admin', { action: 'add_editor', email: ef.email.value })).editors); ef.reset(); } catch (err) { showErr(ef.parentElement, err.message); } });
    $('[data-editor-list]', adm).addEventListener('click', async (e) => { const b = e.target.closest('[data-rm-editor]'); if (!b || !confirm(`Remove editor ${b.dataset.rmEditor}?`)) return; try { drawEditors((await api('/api/admin', { action: 'remove_editor', email: b.dataset.rmEditor })).editors); } catch (err) { showErr(ef.parentElement, err.message); } });
    load();
  }
})();
