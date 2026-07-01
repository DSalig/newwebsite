/* ============================================================
   PRESSD — storefront logic
   Vanilla JS, no build step. Handles: product grid + filtering,
   cart (persisted), studio customizer, drop countdown,
   scroll reveals, count-up stats, toasts.
   ============================================================ */
(function () {
  'use strict';

  /* ---------- catalog ---------- */
  // POD streetwear line. `art` is a CSS-rendered graphic so the demo
  // needs no image assets and stays fully self-contained.
  const PRODUCTS = [
    { id: 'p1', name: 'Concrete Bloom Tee', cat: 'tops', category: 'Heavyweight tee', price: 42, size: 'lg', tag: 'new',
      art: { bg: 'linear-gradient(135deg,#1a1a1a,#2a2a2a)', fg: '#c8ff00', text: 'CONCRETE\nBLOOM', fs: '3.4rem' } },
    { id: 'p2', name: 'Transit Map Hoodie', cat: 'fleece', category: 'Heavyweight hoodie', price: 74, size: 'std', tag: 'hot',
      art: { bg: 'linear-gradient(135deg,#141414,#1e1e1e)', fg: '#ff5a36', text: 'LINE\n06', fs: '2.6rem' } },
    { id: 'p3', name: 'Nightshift Cap', cat: 'headwear', category: '6-panel cap', price: 32, size: 'std',
      art: { bg: 'linear-gradient(135deg,#0f0f1e,#1a1a3a)', fg: '#3d5afe', text: 'NIGHT\nSHIFT', fs: '1.9rem' } },
    { id: 'p4', name: 'Static Signal Tee', cat: 'tops', category: 'Boxy fit tee', price: 40, size: 'std',
      art: { bg: 'linear-gradient(135deg,#1c1c1c,#111)', fg: '#f4f1ea', text: 'NO\nSIGNAL', fs: '2.4rem' } },
    { id: 'p5', name: 'Rooftop Riso Print', cat: 'print', category: 'A2 wall print', price: 28, size: 'std',
      art: { bg: 'linear-gradient(135deg,#ff5a36,#c8ff00)', fg: '#0a0a0a', text: 'ROOF\nTOP', fs: '2.4rem' } },
    { id: 'p6', name: 'Overpass Zip Hoodie', cat: 'fleece', category: 'Full-zip fleece', price: 82, size: 'wide',
      art: { bg: 'linear-gradient(135deg,#161616,#242424)', fg: '#c8ff00', text: 'OVERPASS', fs: '2.2rem' } },
    { id: 'p7', name: 'Grid Tote', cat: 'print', category: 'Canvas carry-all', price: 26, size: 'std',
      art: { bg: 'linear-gradient(135deg,#f4f1ea,#d8d5cc)', fg: '#0a0a0a', text: 'CARRY\nTHE\nGRID', fs: '1.7rem' } },
    { id: 'p8', name: 'Beacon Beanie', cat: 'headwear', category: 'Ribbed beanie', price: 30, size: 'std',
      art: { bg: 'linear-gradient(135deg,#1a1a1a,#111)', fg: '#ff5a36', text: 'BEACON', fs: '1.7rem' } },
  ];

  const SIZES = ['S', 'M', 'L', 'XL'];
  const fmt = (n) => '$' + n.toFixed(2);
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.prototype.slice.call((r || document).querySelectorAll(s));

  /* ---------- state ---------- */
  const STORE_KEY = 'pressd_cart_v1';
  let cart = load();

  function load() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || []; }
    catch (e) { return []; }
  }
  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(cart)); } catch (e) {}
  }

  /* ---------- render product grid ---------- */
  const grid = $('#productGrid');

  function cardMarkup(p) {
    const sizeClass = p.size === 'lg' ? ' card--lg' : p.size === 'wide' ? ' card--wide' : '';
    const tagMarkup = p.tag
      ? '<span class="card__tag card__tag--' + p.tag + '">' + (p.tag === 'hot' ? 'Selling fast' : 'New drop') + '</span>'
      : '';
    const glyphFs = p.size === 'lg' ? p.art.fs : '';
    return (
      '<article class="card' + sizeClass + '" data-cat="' + p.cat + '" data-id="' + p.id + '">' +
        tagMarkup +
        '<div class="card__art" style="background:' + p.art.bg + '">' +
          '<div class="glyph" style="color:' + p.art.fg + (glyphFs ? ';font-size:' + glyphFs : '') + '">' +
            p.art.text.replace(/\n/g, '<br>') +
          '</div>' +
        '</div>' +
        '<div class="card__body">' +
          '<div class="card__meta">' +
            '<div><div class="card__name">' + p.name + '</div>' +
            '<div class="card__cat">' + p.category + '</div></div>' +
            '<div class="card__price">' + fmt(p.price) + '</div>' +
          '</div>' +
          '<button class="card__add" data-add="' + p.id + '">Add to bag</button>' +
        '</div>' +
      '</article>'
    );
  }

  function renderGrid() {
    grid.innerHTML = PRODUCTS.map(cardMarkup).join('');
    // stagger the reveal
    $$('.card', grid).forEach(function (c, i) {
      setTimeout(function () { c.classList.add('in'); }, 60 * i);
    });
  }

  /* ---------- filtering ---------- */
  function bindFilters() {
    const filters = $('#filters');
    filters.addEventListener('click', function (e) {
      const chip = e.target.closest('.chip');
      if (!chip) return;
      $$('.chip', filters).forEach(function (c) {
        c.classList.remove('is-active');
        c.setAttribute('aria-selected', 'false');
      });
      chip.classList.add('is-active');
      chip.setAttribute('aria-selected', 'true');
      const f = chip.dataset.filter;
      $$('.card', grid).forEach(function (card) {
        const match = f === 'all' || card.dataset.cat === f;
        card.classList.toggle('hide', !match);
      });
    });
  }

  /* ---------- cart ---------- */
  const cartEl = $('#cart');
  const overlay = $('#drawerOverlay');

  function addToCart(item) {
    // item: {key, name, opt, price, art}
    const existing = cart.find(function (c) { return c.key === item.key; });
    if (existing) existing.qty += 1;
    else cart.push(Object.assign({ qty: 1 }, item));
    save();
    renderCart();
    bumpCount();
    toast(item.name + ' added');
  }

  function changeQty(key, delta) {
    const it = cart.find(function (c) { return c.key === key; });
    if (!it) return;
    it.qty += delta;
    if (it.qty <= 0) cart = cart.filter(function (c) { return c.key !== key; });
    save();
    renderCart();
  }

  function removeItem(key) {
    cart = cart.filter(function (c) { return c.key !== key; });
    save();
    renderCart();
  }

  function count() { return cart.reduce(function (n, c) { return n + c.qty; }, 0); }
  function subtotal() { return cart.reduce(function (n, c) { return n + c.price * c.qty; }, 0); }

  function bumpCount() {
    const el = $('#cartCount');
    const n = count();
    el.textContent = n;
    el.classList.toggle('show', n > 0);
    el.style.animation = 'none';
    void el.offsetWidth;
    el.style.animation = '';
  }

  function renderCart() {
    const items = $('#cartItems');
    const empty = $('#cartEmpty');
    const foot = $('#cartFoot');
    $('#cartHeadCount').textContent = '(' + count() + ')';
    bumpCount();

    if (!cart.length) {
      items.innerHTML = '';
      empty.style.display = 'grid';
      foot.hidden = true;
      return;
    }
    empty.style.display = 'none';
    foot.hidden = false;

    items.innerHTML = cart.map(function (c) {
      return (
        '<div class="c-item">' +
          '<div class="c-item__art" style="background:' + c.art.bg + ';color:' + c.art.fg + '">' + c.art.label + '</div>' +
          '<div>' +
            '<div class="c-item__name">' + c.name + '</div>' +
            '<div class="c-item__opt">' + c.opt + '</div>' +
            '<div class="c-item__qty">' +
              '<button data-dec="' + c.key + '" aria-label="Decrease">−</button>' +
              '<span>' + c.qty + '</span>' +
              '<button data-inc="' + c.key + '" aria-label="Increase">+</button>' +
            '</div>' +
          '</div>' +
          '<div>' +
            '<div class="c-item__price">' + fmt(c.price * c.qty) + '</div>' +
            '<button class="c-item__rm" data-rm="' + c.key + '">remove</button>' +
          '</div>' +
        '</div>'
      );
    }).join('');

    $('#cartSubtotal').textContent = fmt(subtotal());
  }

  function openCart() { cartEl.classList.add('open'); overlay.classList.add('open'); cartEl.setAttribute('aria-hidden', 'false'); }
  function closeCart() { cartEl.classList.remove('open'); overlay.classList.remove('open'); cartEl.setAttribute('aria-hidden', 'true'); }

  function bindCart() {
    $('#cartBtn').addEventListener('click', openCart);
    $('#cartClose').addEventListener('click', closeCart);
    overlay.addEventListener('click', closeCart);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeCart(); });

    // catalog "add" clicks (delegated)
    grid.addEventListener('click', function (e) {
      const btn = e.target.closest('[data-add]');
      if (!btn) return;
      const p = PRODUCTS.find(function (x) { return x.id === btn.dataset.add; });
      if (!p) return;
      const size = SIZES[Math.floor(SIZES.length / 2)]; // default M/L
      addToCart({
        key: p.id + ':' + size,
        name: p.name,
        opt: p.category + ' · ' + size,
        price: p.price,
        art: { bg: p.art.bg, fg: p.art.fg, label: p.art.text.split('\n')[0] }
      });
      btn.textContent = 'Added ✓';
      setTimeout(function () { btn.textContent = 'Add to bag'; }, 1100);
    });

    // cart qty / remove (delegated)
    $('#cartItems').addEventListener('click', function (e) {
      const inc = e.target.closest('[data-inc]');
      const dec = e.target.closest('[data-dec]');
      const rm = e.target.closest('[data-rm]');
      if (inc) changeQty(inc.dataset.inc, 1);
      else if (dec) changeQty(dec.dataset.dec, -1);
      else if (rm) removeItem(rm.dataset.rm);
    });

    $('#checkoutBtn').addEventListener('click', function () {
      if (!cart.length) return;
      toast('Demo checkout — ' + fmt(subtotal()) + ' for ' + count() + ' item(s)');
    });
  }

  /* ---------- studio customizer ---------- */
  function bindStudio() {
    const teeBody = $('#teeBody');
    const teePrint = $('#teePrint');
    const priceEl = $('#studioPrice');
    const studioPriceBig = $('#studioPrice');

    const state = {
      garment: 'Tee',
      price: 38,
      color: '#111111',
      colorName: 'Asphalt',
      ink: '#f4f1ea',
      text: 'CITY PRESSD',
      font: 'mono'
    };

    function paint() {
      teeBody.style.setProperty('--tee', state.color);
      teePrint.style.color = state.ink;
      teePrint.textContent = state.text || 'YOUR TEXT';
      priceEl.textContent = fmt(state.price);
      // legible ink on light garment
      const light = ['#f4f1ea'].indexOf(state.color) > -1;
      if (light && state.ink === '#f4f1ea') teePrint.style.color = '#111';
    }

    // garment
    $('#garmentSeg').addEventListener('click', function (e) {
      const b = e.target.closest('button'); if (!b) return;
      $$('#garmentSeg button').forEach(function (x) { x.classList.remove('is-active'); });
      b.classList.add('is-active');
      state.garment = b.dataset.garment;
      state.price = parseInt(b.dataset.price, 10);
      paint();
    });

    // colorway
    $('#swatches').addEventListener('click', function (e) {
      const b = e.target.closest('button'); if (!b) return;
      $$('#swatches button').forEach(function (x) { x.classList.remove('is-active'); });
      b.classList.add('is-active');
      state.color = b.dataset.color;
      state.colorName = b.dataset.name;
      paint();
    });

    // ink
    $('#inkSeg').addEventListener('click', function (e) {
      const b = e.target.closest('button'); if (!b) return;
      $$('#inkSeg button').forEach(function (x) { x.classList.remove('is-active'); });
      b.classList.add('is-active');
      state.ink = b.dataset.ink;
      paint();
    });

    // text
    $('#graphicInput').addEventListener('input', function (e) {
      state.text = e.target.value.toUpperCase();
      paint();
    });

    // add build to cart
    $('#studioAdd').addEventListener('click', function () {
      const label = (state.text || 'CUSTOM').split(' ')[0];
      addToCart({
        key: 'custom:' + state.garment + ':' + state.color + ':' + state.ink + ':' + state.text,
        name: 'Custom ' + state.garment,
        opt: state.colorName + ' · "' + (state.text || 'blank') + '"',
        price: state.price,
        art: { bg: state.color, fg: state.ink, label: label.slice(0, 5) }
      });
      openCart();
    });

    paint();
  }

  /* ---------- drop countdown ---------- */
  function bindCountdown() {
    // next Friday 18:00 local
    function nextDrop() {
      const now = new Date('2026-07-01T12:00:00'); // deterministic seed for demo
      const d = new Date(now);
      const day = d.getDay();
      let add = (5 - day + 7) % 7; // 5 = Friday
      if (add === 0) add = 7;
      d.setDate(d.getDate() + add);
      d.setHours(18, 0, 0, 0);
      return d;
    }
    let target = nextDrop();
    let base = new Date('2026-07-01T12:00:00').getTime();
    const start = performance.now();

    function tick() {
      // advance a synthetic clock from the seed so the timer visibly runs
      const elapsed = performance.now() - start;
      const nowMs = base + elapsed;
      let diff = Math.max(0, target.getTime() - nowMs);
      const days = Math.floor(diff / 864e5);
      const hours = Math.floor((diff % 864e5) / 36e5);
      const mins = Math.floor((diff % 36e5) / 6e4);
      const secs = Math.floor((diff % 6e4) / 1e3);
      set('days', days); set('hours', hours); set('mins', mins); set('secs', secs);
    }
    function set(k, v) {
      const el = $('[data-cd="' + k + '"]');
      if (el) el.textContent = String(v).padStart(2, '0');
    }
    tick();
    setInterval(tick, 1000);
  }

  /* ---------- count-up stats ---------- */
  function countUp() {
    const els = $$('[data-count]');
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        const el = en.target;
        const to = parseInt(el.dataset.to, 10);
        const suffix = el.dataset.suffix || '';
        if (suffix && to === 0) { el.textContent = suffix; io.unobserve(el); return; }
        let cur = 0;
        const step = Math.max(1, Math.round(to / 40));
        const t = setInterval(function () {
          cur += step;
          if (cur >= to) { cur = to; clearInterval(t); }
          el.textContent = cur + suffix;
        }, 24);
        io.unobserve(el);
      });
    }, { threshold: .5 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- scroll reveal ---------- */
  function reveals() {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: .15 });
    $$('[data-reveal], .step').forEach(function (el) { io.observe(el); });
  }

  /* ---------- misc UI ---------- */
  function bindMisc() {
    // sticky header shadow
    const header = $('#header');
    window.addEventListener('scroll', function () {
      header.classList.toggle('is-stuck', window.scrollY > 20);
    }, { passive: true });

    // cursor glow
    const glow = $('.cursor-glow');
    window.addEventListener('pointermove', function (e) {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    }, { passive: true });

    // newsletter
    $('#signup').addEventListener('submit', function (e) {
      e.preventDefault();
      const note = $('#signupNote');
      note.textContent = "You're on the list — check your inbox for the next drop.";
      e.target.reset();
    });

    // search + menu (demo affordances)
    $('#searchBtn').addEventListener('click', function () { toast('Search coming to the next drop'); });
    $('#menuToggle').addEventListener('click', function () {
      document.querySelector('#shop').scrollIntoView({ behavior: 'smooth' });
    });
  }

  /* ---------- toast ---------- */
  let toastT;
  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastT);
    toastT = setTimeout(function () { t.classList.remove('show'); }, 2400);
  }

  /* ---------- init ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    renderGrid();
    bindFilters();
    bindCart();
    bindStudio();
    bindCountdown();
    countUp();
    reveals();
    bindMisc();
    renderCart();
  });
})();
