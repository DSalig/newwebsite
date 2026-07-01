/* ============================================================
   PRESSD — retail storefront logic
   Vanilla JS, no build step. Handles: product grid + filtering,
   product quick-view (size/color/qty), cart (persisted),
   drop countdown, scroll reveals, count-up stats, toasts.
   ============================================================ */
(function () {
  'use strict';

  /* ---------- catalog ----------
     A finished-goods retail line: clothing + accessories.
     `art` renders a CSS graphic so the demo needs no image assets.
     `colors` = purchasable colorways; `sizes` = null for one-size accessories. */
  const APPAREL = ['S', 'M', 'L', 'XL', '2XL'];
  const PRODUCTS = [
    { id: 'p1', name: 'Concrete Bloom Tee', cat: 'tops', category: 'Heavyweight tee', price: 42, size: 'lg', tag: 'new',
      desc: 'Hand-drawn florals breaking through the pavement, screen-quality print on a 240gsm boxy-fit tee.',
      colors: [['Asphalt','#1a1a1a','#c8ff00'], ['Bone','#f4f1ea','#1a1a1a'], ['Flare','#ff5a36','#0a0a0a']],
      sizes: APPAREL, art: { bg: 'linear-gradient(135deg,#1a1a1a,#2a2a2a)', fg: '#c8ff00', text: 'CONCRETE\nBLOOM', fs: '3.4rem' } },
    { id: 'p2', name: 'Transit Line Hoodie', cat: 'fleece', category: 'Heavyweight hoodie', price: 74, size: 'std', tag: 'hot',
      desc: 'Brushed-back 400gsm fleece with a metro-line graphic. Double-lined hood, ribbed cuffs.',
      colors: [['Asphalt','#141414','#ff5a36'], ['Cobalt','#3d5afe','#f4f1ea']],
      sizes: APPAREL, art: { bg: 'linear-gradient(135deg,#141414,#1e1e1e)', fg: '#ff5a36', text: 'LINE\n06', fs: '2.6rem' } },
    { id: 'p3', name: 'Nightshift Cap', cat: 'headwear', category: '6-panel cap', price: 32, size: 'std',
      desc: 'Structured 6-panel with a curved brim and embroidered mark. Adjustable strap, one size.',
      colors: [['Midnight','#0f0f1e','#3d5afe'], ['Asphalt','#1a1a1a','#c8ff00']],
      sizes: null, art: { bg: 'linear-gradient(135deg,#0f0f1e,#1a1a3a)', fg: '#3d5afe', text: 'NIGHT\nSHIFT', fs: '1.9rem' } },
    { id: 'p4', name: 'No Signal Tee', cat: 'tops', category: 'Boxy fit tee', price: 40, size: 'std',
      desc: 'Static-glitch chest print on a heavyweight boxy tee with drop shoulders.',
      colors: [['Ink','#1c1c1c','#f4f1ea'], ['Bone','#f4f1ea','#1c1c1c']],
      sizes: APPAREL, art: { bg: 'linear-gradient(135deg,#1c1c1c,#111)', fg: '#f4f1ea', text: 'NO\nSIGNAL', fs: '2.4rem' } },
    { id: 'p5', name: 'Rooftop Riso Print', cat: 'accessories', category: 'A2 wall print', price: 28, size: 'std',
      desc: 'Two-tone riso-style giclée print, A2, shipped rolled in a rigid tube. Frame not included.',
      colors: [['Sunset','linear-gradient(135deg,#ff5a36,#c8ff00)','#0a0a0a']],
      sizes: null, art: { bg: 'linear-gradient(135deg,#ff5a36,#c8ff00)', fg: '#0a0a0a', text: 'ROOF\nTOP', fs: '2.4rem' } },
    { id: 'p6', name: 'Overpass Zip Hoodie', cat: 'fleece', category: 'Full-zip fleece', price: 82, size: 'wide',
      desc: 'Full-zip heavyweight fleece with tonal back print and YKK hardware.',
      colors: [['Asphalt','#161616','#c8ff00'], ['Bone','#e6e2d8','#161616']],
      sizes: APPAREL, art: { bg: 'linear-gradient(135deg,#161616,#242424)', fg: '#c8ff00', text: 'OVERPASS', fs: '2.2rem' } },
    { id: 'p7', name: 'Carry The Grid Tote', cat: 'accessories', category: 'Canvas tote', price: 26, size: 'std',
      desc: '16oz natural canvas tote with reinforced straps and an internal pocket.',
      colors: [['Natural','#f4f1ea','#0a0a0a']],
      sizes: null, art: { bg: 'linear-gradient(135deg,#f4f1ea,#d8d5cc)', fg: '#0a0a0a', text: 'CARRY\nTHE\nGRID', fs: '1.7rem' } },
    { id: 'p8', name: 'Beacon Beanie', cat: 'headwear', category: 'Ribbed beanie', price: 30, size: 'std',
      desc: 'Chunky ribbed cuffed beanie in soft acrylic with a woven tab.',
      colors: [['Asphalt','#1a1a1a','#ff5a36'], ['Acid','#c8ff00','#111111']],
      sizes: null, art: { bg: 'linear-gradient(135deg,#1a1a1a,#111)', fg: '#ff5a36', text: 'BEACON', fs: '1.7rem' } },
    { id: 'p9', name: 'Static Crewneck', cat: 'fleece', category: 'Heavyweight crew', price: 68, size: 'std', tag: 'new',
      desc: 'Mid-weight loopback crewneck with tonal embroidery. Relaxed fit.',
      colors: [['Bone','#e6e2d8','#1a1a1a'], ['Asphalt','#161616','#c8ff00']],
      sizes: APPAREL, art: { bg: 'linear-gradient(135deg,#20201c,#2c2c26)', fg: '#e6e2d8', text: 'STATIC', fs: '2rem' } },
    { id: 'p10', name: 'Block Party Socks', cat: 'accessories', category: 'Ribbed crew socks', price: 14, size: 'std',
      desc: 'Cushioned combed-cotton crew socks with a jacquard cuff. One pair, one size.',
      colors: [['Acid','#c8ff00','#111111'], ['Flare','#ff5a36','#0a0a0a']],
      sizes: null, art: { bg: 'linear-gradient(135deg,#c8ff00,#9ecc00)', fg: '#111111', text: 'BLOCK\nPARTY', fs: '1.5rem' } },
    { id: 'p11', name: 'Grid Phone Case', cat: 'accessories', category: 'Impact phone case', price: 24, size: 'std',
      desc: 'Slim impact-absorbing case with a matte grid print. Multiple models at checkout.',
      colors: [['Ink','#141414','#3d5afe']],
      sizes: null, art: { bg: 'linear-gradient(135deg,#141414,#222)', fg: '#3d5afe', text: 'GRID', fs: '1.8rem' } },
    { id: 'p12', name: 'Skyline Longsleeve', cat: 'tops', category: 'Long-sleeve tee', price: 48, size: 'std',
      desc: 'Heavyweight long-sleeve with sleeve-runner print and a ribbed collar.',
      colors: [['Asphalt','#1a1a1a','#f4f1ea'], ['Cobalt','#26306a','#c8ff00']],
      sizes: APPAREL, art: { bg: 'linear-gradient(135deg,#1a1a1a,#232323)', fg: '#f4f1ea', text: 'SKY\nLINE', fs: '2.2rem' } },
  ];

  const fmt = (n) => '$' + n.toFixed(2);
  const FREE_SHIP = 75;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.prototype.slice.call((r || document).querySelectorAll(s));
  const byId = (id) => PRODUCTS.find(function (p) { return p.id === id; });

  /* ---------- state ---------- */
  const STORE_KEY = 'pressd_cart_v2';
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
      ? '<span class="card__tag card__tag--' + p.tag + '">' + (p.tag === 'hot' ? 'Selling fast' : 'New in') + '</span>'
      : '';
    const glyphFs = p.size === 'lg' ? p.art.fs : '';
    return (
      '<article class="card' + sizeClass + '" data-cat="' + p.cat + '" data-id="' + p.id + '" tabindex="0" role="button" aria-label="' + p.name + ', ' + fmt(p.price) + '. View details">' +
        tagMarkup +
        '<div class="card__art" style="background:' + p.art.bg + '">' +
          '<div class="glyph" style="color:' + p.art.fg + (glyphFs ? ';font-size:' + glyphFs : '') + '">' +
            p.art.text.replace(/\n/g, '<br>') +
          '</div>' +
          '<span class="card__quick">Quick view</span>' +
        '</div>' +
        '<div class="card__body">' +
          '<div class="card__meta">' +
            '<div><div class="card__name">' + p.name + '</div>' +
            '<div class="card__cat">' + p.category + '</div></div>' +
            '<div class="card__price">' + fmt(p.price) + '</div>' +
          '</div>' +
          '<button class="card__add" data-add="' + p.id + '">' + (p.sizes ? 'Select options' : 'Add to bag') + '</button>' +
        '</div>' +
      '</article>'
    );
  }

  function renderGrid() {
    grid.innerHTML = PRODUCTS.map(cardMarkup).join('');
    $$('.card', grid).forEach(function (c, i) {
      setTimeout(function () { c.classList.add('in'); }, 50 * i);
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

  /* ---------- quick view ---------- */
  const qv = $('#qv');
  const qvOverlay = $('#qvOverlay');
  const qvState = { product: null, color: 0, size: null, qty: 1 };

  function openQuickView(p) {
    qvState.product = p;
    qvState.color = 0;
    qvState.size = p.sizes ? null : 'One size';
    qvState.qty = 1;

    $('#qvCat').textContent = p.category;
    $('#qvName').textContent = p.name;
    $('#qvPrice').textContent = fmt(p.price);
    $('#qvDesc').textContent = p.desc;

    // colors
    $('#qvColors').innerHTML = p.colors.map(function (c, i) {
      return '<button class="' + (i === 0 ? 'is-active' : '') + '" style="--sw:' + c[1] + '" data-ci="' + i + '" aria-label="' + c[0] + '"></button>';
    }).join('');
    $('#qvColorLabel').textContent = 'Colorway · ' + p.colors[0][0];

    // sizes
    const sizeField = $('#qvSizeField');
    if (p.sizes) {
      sizeField.style.display = '';
      $('#qvSizes').innerHTML = p.sizes.map(function (s) {
        return '<button data-size="' + s + '">' + s + '</button>';
      }).join('');
    } else {
      sizeField.style.display = 'none';
    }

    $('#qvQty').textContent = '1';
    updateQvArt();
    updateQvAddState();

    qv.classList.add('open');
    qvOverlay.classList.add('open');
    qv.setAttribute('aria-hidden', 'false');
  }

  function updateQvArt() {
    const p = qvState.product;
    const art = $('#qvArt');
    art.style.background = p.art.bg;
    art.innerHTML = '<div class="glyph" style="color:' + p.art.fg + '">' + p.art.text.replace(/\n/g, '<br>') + '</div>';
  }

  function updateQvAddState() {
    const p = qvState.product;
    const needsSize = !!p.sizes && !qvState.size;
    const btn = $('#qvAdd');
    btn.disabled = needsSize;
    btn.classList.toggle('is-disabled', needsSize);
    $('#qvAddPrice').textContent = needsSize ? 'select a size' : fmt(p.price * qvState.qty);
  }

  function closeQuickView() {
    qv.classList.remove('open');
    qvOverlay.classList.remove('open');
    qv.setAttribute('aria-hidden', 'true');
  }

  function bindQuickView() {
    $('#qvClose').addEventListener('click', closeQuickView);
    qvOverlay.addEventListener('click', closeQuickView);

    $('#qvColors').addEventListener('click', function (e) {
      const b = e.target.closest('button'); if (!b) return;
      $$('#qvColors button').forEach(function (x) { x.classList.remove('is-active'); });
      b.classList.add('is-active');
      qvState.color = parseInt(b.dataset.ci, 10);
      $('#qvColorLabel').textContent = 'Colorway · ' + qvState.product.colors[qvState.color][0];
    });

    $('#qvSizes').addEventListener('click', function (e) {
      const b = e.target.closest('button'); if (!b) return;
      $$('#qvSizes button').forEach(function (x) { x.classList.remove('is-active'); });
      b.classList.add('is-active');
      qvState.size = b.dataset.size;
      updateQvAddState();
    });

    $('#qvInc').addEventListener('click', function () { qvState.qty++; $('#qvQty').textContent = qvState.qty; updateQvAddState(); });
    $('#qvDec').addEventListener('click', function () { if (qvState.qty > 1) { qvState.qty--; $('#qvQty').textContent = qvState.qty; updateQvAddState(); } });

    $('#qvAdd').addEventListener('click', function () {
      const p = qvState.product;
      if (p.sizes && !qvState.size) return;
      const color = p.colors[qvState.color];
      const opt = color[0] + (qvState.size ? ' · ' + qvState.size : '');
      addToCart({
        key: p.id + ':' + color[0] + ':' + (qvState.size || 'os'),
        name: p.name,
        opt: opt,
        price: p.price,
        art: { bg: p.art.bg, fg: p.art.fg, label: p.art.text.split('\n')[0] }
      }, qvState.qty);
      closeQuickView();
      openCart();
    });
  }

  /* ---------- cart ---------- */
  const cartEl = $('#cart');
  const overlay = $('#drawerOverlay');

  function addToCart(item, qty) {
    qty = qty || 1;
    const existing = cart.find(function (c) { return c.key === item.key; });
    if (existing) existing.qty += qty;
    else cart.push(Object.assign({ qty: qty }, item));
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

    // free-shipping progress nudge
    const remain = FREE_SHIP - subtotal();
    const fs = $('#cartFreeShip');
    if (remain > 0) fs.innerHTML = '<span>Add ' + fmt(remain) + ' for free shipping</span>';
    else fs.innerHTML = '<span>◆ You unlocked free shipping</span>';
  }

  function openCart() { cartEl.classList.add('open'); overlay.classList.add('open'); cartEl.setAttribute('aria-hidden', 'false'); }
  function closeCart() { cartEl.classList.remove('open'); overlay.classList.remove('open'); cartEl.setAttribute('aria-hidden', 'true'); }

  function bindCart() {
    $('#cartBtn').addEventListener('click', openCart);
    $('#cartClose').addEventListener('click', closeCart);
    overlay.addEventListener('click', closeCart);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closeCart(); closeQuickView(); }
    });

    // card interactions (delegated): "add" button vs. card body → quick view
    grid.addEventListener('click', function (e) {
      const addBtn = e.target.closest('[data-add]');
      if (addBtn) {
        e.stopPropagation();
        const p = byId(addBtn.dataset.add);
        if (!p) return;
        if (p.sizes) { openQuickView(p); return; } // apparel needs a size
        // one-size accessory: add default color straight to cart
        const color = p.colors[0];
        addToCart({
          key: p.id + ':' + color[0] + ':os',
          name: p.name, opt: color[0],
          price: p.price,
          art: { bg: p.art.bg, fg: p.art.fg, label: p.art.text.split('\n')[0] }
        });
        addBtn.textContent = 'Added ✓';
        setTimeout(function () { addBtn.textContent = 'Add to bag'; }, 1100);
        return;
      }
      const card = e.target.closest('.card');
      if (card) { const p = byId(card.dataset.id); if (p) openQuickView(p); }
    });

    // keyboard: Enter/Space on a focused card opens quick view
    grid.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const card = e.target.closest('.card');
      if (card) { e.preventDefault(); const p = byId(card.dataset.id); if (p) openQuickView(p); }
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

  /* ---------- drop countdown ---------- */
  function bindCountdown() {
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
    const target = nextDrop();
    const base = new Date('2026-07-01T12:00:00').getTime();
    const start = performance.now();

    function tick() {
      const elapsed = performance.now() - start;
      const nowMs = base + elapsed;
      const diff = Math.max(0, target.getTime() - nowMs);
      set('days', Math.floor(diff / 864e5));
      set('hours', Math.floor((diff % 864e5) / 36e5));
      set('mins', Math.floor((diff % 36e5) / 6e4));
      set('secs', Math.floor((diff % 6e4) / 1e3));
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
    const header = $('#header');
    window.addEventListener('scroll', function () {
      header.classList.toggle('is-stuck', window.scrollY > 20);
    }, { passive: true });

    const glow = $('.cursor-glow');
    window.addEventListener('pointermove', function (e) {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    }, { passive: true });

    $('#signup').addEventListener('submit', function (e) {
      e.preventDefault();
      $('#signupNote').textContent = "You're on the list — check your inbox for 10% off.";
      e.target.reset();
    });

    $('#searchBtn').addEventListener('click', function () { toast('Search coming soon'); });
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
    bindQuickView();
    bindCart();
    bindCountdown();
    countUp();
    reveals();
    bindMisc();
    renderCart();
  });
})();
