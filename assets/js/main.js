/**
 * RENEXT TECHNOLOGIES PVT. LTD. & SPENDITWISELY
 * Main JavaScript Controller — Midnight Forge Edition
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavScroll();
  initMobileMenu();
  initFAQAccordion();
  initContactForm();
});

/* ─── Nav scroll ────────────────────────────────────────────── */
function initNavScroll() {
  const nav = document.getElementById('main-nav');
  if (!nav) return;
  const handler = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', handler, { passive: true });
  handler();
}

/* ─── Mobile menu ───────────────────────────────────────────── */
function initMobileMenu() {
  // new design uses nav-toggle + mobile-drawer
  const toggle = document.getElementById('nav-toggle');
  const drawer = document.getElementById('mobile-drawer');
  if (toggle && drawer) {
    toggle.addEventListener('click', () => drawer.classList.toggle('hidden'));
    drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', () => drawer.classList.add('hidden')));
  }
  // legacy fallback
  const legacyBtn  = document.getElementById('mobile-menu-btn');
  const legacyMenu = document.getElementById('mobile-menu');
  if (legacyBtn && legacyMenu) {
    legacyBtn.addEventListener('click', () => legacyMenu.classList.toggle('hidden'));
    legacyMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => legacyMenu.classList.add('hidden')));
  }
}

/* ─── FAQ Accordion ─────────────────────────────────────────── */
function initFAQAccordion() {
  document.querySelectorAll('.faq-item').forEach(item => {
    const hdr = item.querySelector('.faq-header');
    if (!hdr) return;
    hdr.addEventListener('click', () => {
      const open = item.classList.contains('open') || item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open', 'active'));
      if (!open) item.classList.add('open', 'active');
    });
  });
}

/* ─── Contact Form ──────────────────────────────────────────── */
// Real submission lives in assets/js/enquiry.js (forms marked data-enquiry).
function initContactForm() {
  const form = document.getElementById('contact-form') || document.getElementById('renext-contact-form');
  if (form && !form.hasAttribute('data-enquiry')) form.setAttribute('data-enquiry', '');
  if (form && window.RenextEnquiry) window.RenextEnquiry.attach(form);
}

/* ─── Kirana Cart (used on SpendItWisely page) ──────────────── */
let cartItems = [];

function initKiranaStore() {
  document.querySelectorAll('.kirana-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.kirana-filter-btn').forEach(b => b.classList.remove('bg-emerald-600','text-white'));
      btn.classList.add('bg-emerald-600','text-white');
      const storeId = btn.dataset.store;
      document.querySelectorAll('.kirana-product-card').forEach(card => {
        card.classList.toggle('hidden', storeId !== 'all' && card.dataset.store !== storeId);
      });
    });
  });

  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      cartItems.push({ name: btn.dataset.name, price: parseFloat(btn.dataset.price), store: btn.dataset.storeName });
      document.querySelectorAll('.cart-count-badge').forEach(b => { b.textContent = cartItems.length; b.classList.remove('hidden'); });
      btn.classList.add('bg-emerald-700','text-white');
      btn.innerHTML = '<span>✓ Added</span>';
      setTimeout(() => { btn.classList.remove('bg-emerald-700','text-white'); btn.innerHTML = '<span>Add</span>'; }, 1200);
    });
  });

  document.querySelectorAll('.open-cart-btn').forEach(btn => btn.addEventListener('click', renderCartModal));

  const closeCart = document.getElementById('close-cart-modal-btn');
  if (closeCart) closeCart.addEventListener('click', () => document.getElementById('cart-modal')?.classList.add('hidden'));
}

function renderCartModal() {
  const modal = document.getElementById('cart-modal');
  const list  = document.getElementById('cart-items-list');
  const total = document.getElementById('cart-total-amount');
  if (!modal || !list) return;
  list.innerHTML = '';
  if (cartItems.length === 0) {
    list.innerHTML = '<p class="text-xs text-slate-400 text-center py-6">Your cart is empty.</p>';
    if (total) total.textContent = '₹0.00';
  } else {
    let sum = 0;
    cartItems.forEach((item, i) => {
      sum += item.price;
      list.innerHTML += `<div class="flex justify-between py-2 border-b border-slate-100 text-xs"><span>${item.name}<br><span class="text-slate-400 text-[10px]">${item.store}</span></span><span class="font-mono font-bold">₹${item.price.toFixed(2)}</span></div>`;
    });
    if (total) total.textContent = `₹${sum.toFixed(2)}`;
  }
  if (window.lucide) lucide.createIcons();
  modal.classList.remove('hidden');
}

/* ─── Coins / Rewards (SpendItWisely page) ──────────────────── */
function initCoinsWallet() {
  let coins = 2450;
  const display = document.getElementById('user-coin-balance');
  document.querySelectorAll('.redeem-reward-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const cost = parseInt(btn.dataset.cost, 10);
      if (coins >= cost) {
        coins -= cost;
        if (display) display.textContent = `${coins.toLocaleString('en-IN')} Coins`;
        alert(`🎉 Redeemed: ${btn.dataset.title}! (Coins are promotional rewards, not currency.)`);
      } else {
        alert(`Insufficient Coins. Earn more by uploading verified receipts.`);
      }
    });
  });
}

/* ─── Merchant / User modals ────────────────────────────────── */
function initModals() {
  ['merchant-modal','user-modal'].forEach(id => {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.addEventListener('click', e => { if (e.target === modal) modal.classList.add('hidden'); });
  });
  document.querySelectorAll('.open-merchant-modal-btn').forEach(b => b.addEventListener('click', () => document.getElementById('merchant-modal')?.classList.remove('hidden')));
  document.getElementById('close-merchant-modal-btn')?.addEventListener('click', () => document.getElementById('merchant-modal')?.classList.add('hidden'));
  document.querySelectorAll('.open-user-modal-btn').forEach(b => b.addEventListener('click', () => document.getElementById('user-modal')?.classList.remove('hidden')));
  document.getElementById('close-user-modal-btn')?.addEventListener('click', () => document.getElementById('user-modal')?.classList.add('hidden'));
  // merchant-form / user-join-form: mark with data-enquiry and load enquiry.js if these modals return.
}
