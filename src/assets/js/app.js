/* Elisa Motors – front-end behaviour (no dependencies) */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const EM = window.EM || {};
  let lastFocus = null;

  // ---------- drawer / modal helpers ----------
  const openLayer = (el) => {
    lastFocus = document.activeElement;
    el.classList.add('open'); el.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const panel = el.querySelector('.modal-panel, .drawer-panel');
    if (panel) { panel.setAttribute('tabindex', '-1'); setTimeout(() => panel.focus({ preventScroll: true }), 50); }
  };
  const closeLayer = (el) => {
    el.classList.remove('open'); el.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lastFocus && lastFocus.focus();
  };
  const drawer = $('#drawer');
  $$('[data-open-drawer]').forEach((b) => b.addEventListener('click', () => { openLayer(drawer); b.setAttribute('aria-expanded', 'true'); }));
  $$('[data-close-drawer]').forEach((b) => b.addEventListener('click', () => { closeLayer(drawer); $('[data-open-drawer]')?.setAttribute('aria-expanded', 'false'); }));
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    $$('.drawer.open, .modal.open').forEach(closeLayer);
  });

  // ---------- shared: submit to email + WhatsApp ----------
  const ref = () => 'EM-' + Date.now().toString(36).slice(-4).toUpperCase() + Math.random().toString(36).slice(2, 4).toUpperCase();
  const phoneOk = (p) => /^[0-9+\s()-]{9,20}$/.test(p.trim()) && p.replace(/\D/g, '').length >= 9;
  const waUrl = (text) => `https://wa.me/${EM.wa}?text=${encodeURIComponent(text)}`;

  function send(payload, waText) {
    // Email via PHP (keepalive survives navigation to WhatsApp)
    try {
      fetch('/send-order.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), keepalive: true }).catch(() => {});
    } catch (e) { /* ignore */ }
    const url = waUrl(waText);
    const w = window.open(url, '_blank', 'noopener');
    if (!w) window.location.href = url;
    return url;
  }
  function successHtml(r, url, title) {
    return `<div class="tick"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></div>
      <h2 style="font-size:1.4rem">${title}</h2>
      <p class="muted">Your reference number is</p><div class="ref">${r}</div>
      <p>We've opened WhatsApp with your details. Just tap <b>Send</b> there. A copy has also been emailed to our sales team, and we'll reply with your free quote shortly.</p>
      <p><a class="btn btn-wa" href="${url}" target="_blank" rel="noopener">Open WhatsApp again</a></p>
      <p><a href="/cars/">Keep browsing cars →</a></p>`;
  }
  function validate(form, names) {
    let ok = true;
    names.forEach((n) => {
      const el = form.elements[n]; if (!el) return;
      const bad = n === 'phone' ? !phoneOk(el.value) : !el.value.trim();
      el.closest('.field')?.classList.toggle('invalid', bad);
      if (bad && ok) { el.focus(); ok = false; }
    });
    return ok;
  }
  const fd = (form) => Object.fromEntries(new FormData(form).entries());

  // ---------- listing filters ----------
  const filters = $('[data-filters]');
  if (filters) {
    const cards = $$('.car-grid .car-card', filters.parentElement);
    const grid = cards[0]?.parentElement;
    const countEl = $('[data-result-count]');
    const empty = $('[data-empty]');
    const sortSel = $('[data-sort]');
    const toggle = $('[data-toggle-filters]');
    const activeEl = $('[data-active-count]');
    toggle?.addEventListener('click', () => {
      const open = filters.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
    });
    // Pre-fill from URL (?make=Toyota&body=SUV&budget=1.5-3&q=prado)
    const params = new URLSearchParams(location.search);
    params.forEach((val, key) => {
      val.split(',').forEach((v) => {
        const el = $$(`[name="${key}"]`, filters).find((i) => i.type === 'checkbox' ? i.value.toLowerCase() === v.toLowerCase() : true);
        if (!el) return;
        if (el.type === 'checkbox') el.checked = true; else el.value = v;
      });
    });
    if (params.get('sort') && sortSel) sortSel.value = params.get('sort');

    const apply = () => {
      const f = new FormData(filters);
      const sel = (k) => f.getAll(k).map((x) => x.toLowerCase());
      const q = (f.get('q') || '').toString().trim().toLowerCase();
      const make = sel('make'), body = sel('body'), fuel = sel('fuel'), origin = sel('origin');
      const budget = (f.get('budget') || '').toString();
      const [bmin, bmax] = budget ? budget.split('-').map(Number) : [NaN, NaN];
      const seven = f.get('seven'), awd = f.get('awd');
      let n = 0;
      cards.forEach((c) => {
        const d = c.dataset;
        const has = (list, vals) => !vals.length || vals.some((v) => list.toLowerCase().split('|').includes(v));
        const text = `${d.name} ${d.make} ${d.body} ${d.fuel}`.toLowerCase();
        const price = +d.price;
        const show = (!q || q.split(/\s+/).every((w) => text.includes(w))) && has(d.make, make) && has(d.body, body) && has(d.fuel, fuel) && has(d.origin, origin)
          && (isNaN(bmin) || (price >= bmin && price < bmax)) && (!seven || +d.seats >= 7) && (!awd || /4wd|awd/i.test(d.drive));
        c.hidden = !show; if (show) n++;
      });
      if (countEl) countEl.textContent = n;
      if (empty) empty.hidden = n > 0;
      const active = [...f.entries()].filter(([, v]) => v).length;
      if (activeEl) activeEl.textContent = active ? `(${active})` : '';
      // sort
      const mode = sortSel?.value || 'pop';
      const key = { pop: (c) => -c.dataset.pop, 'price-asc': (c) => +c.dataset.price, 'price-desc': (c) => -c.dataset.price, name: (c) => c.dataset.name }[mode];
      [...cards].sort((a, b) => { const x = key(a), y = key(b); return x < y ? -1 : x > y ? 1 : 0; }).forEach((c) => grid.appendChild(c));
      // reflect in URL
      const u = new URLSearchParams();
      ['make', 'body', 'fuel', 'origin'].forEach((k) => { const v = f.getAll(k); if (v.length) u.set(k, v.join(',')); });
      ['q', 'budget', 'seven', 'awd'].forEach((k) => { if (f.get(k)) u.set(k, f.get(k)); });
      if (mode !== 'pop') u.set('sort', mode);
      history.replaceState(null, '', location.pathname + (u.toString() ? '?' + u : ''));
    };
    filters.addEventListener('input', apply);
    filters.addEventListener('change', apply);
    filters.addEventListener('submit', (e) => e.preventDefault());
    filters.addEventListener('reset', () => setTimeout(apply));
    sortSel?.addEventListener('change', apply);
    apply();
  }

  // ---------- car detail ----------
  const carData = $('#car-data') && JSON.parse($('#car-data').textContent);
  if (carData) {
    // gallery
    const mainImg = $('[data-gallery-main]');
    const creditLink = $('[data-credit-link]');
    $$('.thumbs button').forEach((b) => b.addEventListener('click', () => {
      mainImg.src = b.dataset.src;
      if (b.dataset.alt) mainImg.alt = b.dataset.alt;
      $$('.thumbs button').forEach((x) => x.setAttribute('aria-current', x === b));
      if (creditLink) { creditLink.textContent = b.dataset.credit; creditLink.href = b.dataset.source; }
    }));

    // variant picker
    const byId = Object.fromEntries(carData.variants.map((v) => [v.id, v]));
    // Link to the exact version page (or the model page when there is only one version)
    const carLink = (v) => carData.variants.length > 1 ? `${carData.base}${v.id}/` : carData.base;
    let current = byId[carData.defaultId] || carData.variants[0];
    const orderSelect = $('#order-variant');
    const reqLink = $('[data-request-link]');
    const setVariant = (id) => {
      current = byId[id] || current;
      const v = current;
      const map = { name: v.name, engine: v.engine, fuel: v.fuel, hp: v.hp + ' hp', trans: v.trans, drive: v.drive, economy: v.economy, note: v.note || '–', price: v.price };
      Object.entries(map).forEach(([k, val]) => $$(`[data-spec="${k}"]`).forEach((el) => (el.textContent = val)));
      $('[data-bar-price]') && ($('[data-bar-price]').textContent = v.from + '+');
      $('[data-bar-name]') && ($('[data-bar-name]').textContent = v.name);
      $('[data-sum-variant]') && ($('[data-sum-variant]').textContent = v.name);
      $('[data-sum-price]') && ($('[data-sum-price]').textContent = 'Est. ' + v.price + ' landed');
      if (orderSelect) orderSelect.value = v.id;
      const r = $(`input[name="pick-variant"][value="${v.id}"]`); if (r) r.checked = true;
      if (reqLink) reqLink.href = `/import-request/?car=${carData.slug}&variant=${encodeURIComponent(v.name)}`;
    };
    $$('input[name="pick-variant"]').forEach((r) => r.addEventListener('change', () => setVariant(r.value)));
    orderSelect?.addEventListener('change', () => setVariant(orderSelect.value));
    setVariant(current.id);

    // order modal
    const modal = $('#order-modal');
    const form = $('#order-form');
    const err = $('[data-form-error]', modal);
    $$('[data-open-order]').forEach((b) => b.addEventListener('click', () => { setVariant(current.id); openLayer(modal); }));
    $$('[data-close-modal]', modal).forEach((b) => b.addEventListener('click', () => closeLayer(modal)));
    if (location.hash === '#order') openLayer(modal); // shareable "order now" links
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      err.hidden = true;
      if (!validate(form, ['name', 'phone'])) { err.textContent = 'Please enter your name and a valid phone number.'; err.hidden = false; return; }
      const d = fd(form); const r = ref(); const v = current;
      const link = carLink(v);
      const payload = { ...d, ref: r, make: carData.make, model: carData.model, variant_name: v.name, price: v.price, page: link };
      const text = `Hi, I am interested in importing the *${carData.name} ${v.name}* with ${EM.name}.\n\n` +
        `🚗 *Car:* ${carData.name}\n🏷️ *Make:* ${carData.make}\n📋 *Model:* ${carData.model}\n🔧 *Version:* ${v.name}\n` +
        `⚙️ ${v.engine} · ${v.fuel} · ${v.hp} hp · ${v.trans} · ${v.drive}${v.note ? `\n✨ ${v.note}` : ''}\n💰 *Est. landed price:* ${v.price}\n\n` +
        `📦 *Order details*\n🌍 Import from: ${d.origin}\n📅 Year: ${d.year}\n🎨 Colour: ${d.colour}${d.notes ? `\n📝 ${d.notes}` : ''}\n\n` +
        `👤 *Name:* ${d.name}\n📞 *Phone:* ${d.phone}${d.email ? `\n✉️ *Email:* ${d.email}` : ''}${d.town ? `\n📍 *Town:* ${d.town}` : ''}\n\n` +
        `🔗 *Car link:* ${link}\n🧾 Ref: ${r}`;
      const url = send(payload, text);
      $('.order-form-wrap', modal).hidden = true;
      const s = $('[data-success]', modal); s.hidden = false;
      s.innerHTML = successHtml(r, url, 'Order sent!') + '<button class="btn btn-ghost" type="button" data-close-modal>Close</button>';
      $('[data-close-modal]', s).addEventListener('click', () => closeLayer(modal));
    });
  }

  // ---------- import request wizard ----------
  const wiz = $('#wizard');
  if (wiz) {
    const data = JSON.parse($('#wizard-data').textContent);
    const form = $('#request-form');
    const steps = $$('.step', form);
    const bars = $$('.progress div', wiz);
    const prev = $('[data-prev]', wiz), next = $('[data-next]', wiz), submit = $('[data-submit]', wiz);
    const err = $('[data-form-error]', wiz);
    const makeSel = form.elements.make, modelSel = form.elements.model, varSel = form.elements.variant;
    const other = $('[data-other-car]', form);
    let step = 0;

    const fillModels = () => {
      const m = makeSel.value;
      const list = data.makes[m] || [];
      modelSel.disabled = !m;
      modelSel.innerHTML = m ? `<option value="">Choose model…</option>${list.map((x) => `<option value="${x.model}" data-slug="${x.slug}">${x.model}</option>`).join('')}<option value="Other">Other model</option>` : '<option value="">Choose make first</option>';
      if (m === 'Other') { modelSel.innerHTML = '<option value="Other">Other</option>'; modelSel.value = 'Other'; }
      fillVariants(); toggleOther();
    };
    const fillVariants = () => {
      const x = (data.makes[makeSel.value] || []).find((i) => i.model === modelSel.value);
      varSel.innerHTML = '<option value="">Not sure / any</option>' + (x ? x.variants.map((v) => `<option>${v}</option>`).join('') : '');
      varSel.closest('.field').hidden = !x;
    };
    const toggleOther = () => { other.hidden = !(makeSel.value === 'Other' || modelSel.value === 'Other'); };
    makeSel.addEventListener('change', fillModels);
    modelSel.addEventListener('change', () => { fillVariants(); toggleOther(); });

    // prefill from ?car=slug&variant=Name
    const p = new URLSearchParams(location.search);
    if (p.get('car')) {
      for (const [mk, list] of Object.entries(data.makes)) {
        const hit = list.find((x) => x.slug === p.get('car'));
        if (hit) { makeSel.value = mk; fillModels(); modelSel.value = hit.model; fillVariants(); if (p.get('variant')) varSel.value = p.get('variant'); break; }
      }
    } else fillVariants();

    const show = (i) => {
      step = i;
      steps.forEach((s, j) => s.classList.toggle('on', j === i));
      bars.forEach((b, j) => b.classList.toggle('on', j <= i));
      prev.hidden = i === 0; next.hidden = i === steps.length - 1; submit.hidden = i !== steps.length - 1;
      err.hidden = true;
      if (i > 0) wiz.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    const stepValid = () => {
      if (step === 0) {
        const needOther = !other.hidden;
        const ok = validate(form, needOther ? ['make', 'other_car'] : ['make', 'model']);
        if (!ok) { err.textContent = needOther ? 'Please type the car you want.' : 'Please choose a make and model.'; err.hidden = false; }
        return ok;
      }
      return true;
    };
    next.addEventListener('click', () => { if (stepValid()) show(step + 1); });
    prev.addEventListener('click', () => show(step - 1));
    form.addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.target.tagName === 'INPUT' && step < steps.length - 1) { e.preventDefault(); next.click(); } });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (step < steps.length - 1) { next.click(); return; }
      if (!validate(form, ['name', 'phone'])) { err.textContent = 'Please enter your name and a valid phone number.'; err.hidden = false; return; }
      const d = fd(form); const r = ref();
      const typed = d.other_car && !other.hidden;
      const car = typed ? d.other_car : `${d.make} ${d.model}`;
      const hit = !typed && (data.makes[d.make] || []).find((x) => x.model === d.model);
      const link = hit ? `${EM.url}/cars/${hit.slug}/` : '';
      const payload = { ...d, ref: r, car, variant_name: d.variant, page: link || location.href };
      const text = `Hi, I am interested in importing the *${car}${d.variant ? ' ' + d.variant : ''}* with ${EM.name}.\n\n` +
        `🚗 *Car:* ${car}\n${typed ? '' : `🏷️ *Make:* ${d.make}\n📋 *Model:* ${d.model}\n`}🔧 *Version:* ${d.variant || 'Not sure / any'}\n⛽ *Fuel:* ${d.fuel} · ${d.transmission}\n\n` +
        `📦 *Order details*\n🌍 Import from: ${d.origin}\n📅 Year from: ${d.year}\n💰 Budget: ${d.budget}\n🛣️ Mileage: ${d.mileage}\n🎨 Colour: ${d.colour}\n⏱️ ${d.timeline}${d.notes ? `\n📝 ${d.notes}` : ''}\n\n` +
        `👤 *Name:* ${d.name}\n📞 *Phone:* ${d.phone}${d.email ? `\n✉️ *Email:* ${d.email}` : ''}${d.town ? `\n📍 *Town:* ${d.town}` : ''}\n\n` +
        `${link ? `🔗 *Car link:* ${link}\n` : ''}🧾 Ref: ${r}`;
      const url = send(payload, text);
      form.hidden = true; $('.progress', wiz).hidden = true;
      const s = $('[data-success]', wiz); s.hidden = false;
      s.innerHTML = successHtml(r, url, 'Request sent!');
      wiz.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    show(0);
  }

  // ---------- blog order forms ----------
  $$('[data-blog-order]').forEach((box) => {
    const form = $('form', box);
    const cars = JSON.parse($('script[type="application/json"]', box).textContent);
    const carSel = form.elements.car, varSel = form.elements.variant;
    const other = $('[data-other-car]', form);
    const err = $('[data-form-error]', form);
    const fill = () => {
      const c = cars.find((x) => x.slug === carSel.value);
      varSel.innerHTML = '<option value="">Not sure / any</option>' + (c ? c.variants.map((v) => `<option>${v.name} (${v.price})</option>`).join('') : '');
      varSel.closest('.field').hidden = !c;
      other.hidden = carSel.value !== 'other';
    };
    carSel.addEventListener('change', fill);
    fill();
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      err.hidden = true;
      const need = other.hidden ? ['name', 'phone'] : ['other_car', 'name', 'phone'];
      if (!validate(form, need)) { err.textContent = other.hidden ? 'Please enter your name and a valid phone number.' : 'Please type the car you want, your name and phone.'; err.hidden = false; return; }
      const d = fd(form); const r = ref();
      const c = cars.find((x) => x.slug === d.car);
      const car = c ? c.name : d.other_car;
      const link = c ? `${EM.url}/cars/${c.slug}/` : '';
      const payload = { ...d, type: 'Blog Car Order', ref: r, car, variant_name: d.variant, page: location.href };
      const text = `Hi, I am interested in importing the *${car}${d.variant ? ' ' + d.variant : ''}* with ${EM.name}.\n\n` +
        `🚗 *Car:* ${car}\n🔧 *Version:* ${d.variant || 'Not sure / any'}\n🌍 Import from: ${d.origin}\n📅 Year from: ${d.year}\n💰 Budget: ${d.budget}${d.notes ? `\n📝 ${d.notes}` : ''}\n\n` +
        `👤 *Name:* ${d.name}\n📞 *Phone:* ${d.phone}${d.email ? `\n✉️ *Email:* ${d.email}` : ''}${d.town ? `\n📍 *Town:* ${d.town}` : ''}\n\n` +
        `${link ? `🔗 *Car link:* ${link}\n` : ''}📰 Read: ${location.href}\n🧾 Ref: ${r}`;
      const url = send(payload, text);
      form.hidden = true;
      const s = $('[data-success]', box); s.hidden = false;
      s.innerHTML = successHtml(r, url, 'Order sent!');
    });
  });
})();
