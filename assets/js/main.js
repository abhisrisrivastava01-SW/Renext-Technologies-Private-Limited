/**
 * RENEXT TECHNOLOGIES PVT. LTD. & SPENDITWISELY
 * Main Production JavaScript Controller
 * Handles:
 *  - Ecosystem Flow Stepper
 *  - Interactive Phone Simulator & OCR Scanner
 *  - Local Kirana Discovery & Shopping Cart
 *  - Coins Wallet & Rewards System
 *  - Merchant & User Onboarding Modals
 *  - Interactive FAQ Accordion
 *  - Multi-Category Contact Inquiries
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initEcosystemStepper();
  initPhoneSimulator();
  initLocalKiranaStore();
  initCoinsWallet();
  initModals();
  initFAQAccordion();
  initContactInquiryTabs();
});

/* -------------------------------------------------------------------------- */
/* 1. Mobile Menu Toggle                                                      */
/* -------------------------------------------------------------------------- */
function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');

  if (btn && menu) {
    btn.addEventListener('click', () => {
      menu.classList.toggle('hidden');
    });

    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.add('hidden');
      });
    });
  }
}

/* -------------------------------------------------------------------------- */
/* 2. Ecosystem Flow Stepper                                                  */
/* -------------------------------------------------------------------------- */
function initEcosystemStepper() {
  const steps = document.querySelectorAll('.ecosystem-step-btn');
  const cardTitle = document.getElementById('ecosystem-step-title');
  const cardDesc = document.getElementById('ecosystem-step-desc');
  const cardBadge = document.getElementById('ecosystem-step-badge');

  const stepData = {
    1: {
      title: "1. Receipt Ingestion & Capture",
      desc: "Users upload physical paper bills, digital PDFs, or restaurant receipts. Technology/OCR extracts merchant data, itemized lines, and tax components for user review.",
      badge: "Step 1: Input"
    },
    2: {
      title: "2. Expense Categorization",
      desc: "Information is automatically categorized into Utilities, Food & Dining, Groceries, Travel, and Healthcare for structured personal records.",
      badge: "Step 2: Organization"
    },
    3: {
      title: "3. Financial Awareness & Insights",
      desc: "Users gain visual clarity into monthly spending trends, category distributions, and tax components without manual bookkeeping.",
      badge: "Step 3: Intelligence"
    },
    4: {
      title: "4. Earn Eligible Coins",
      desc: "Users receive eligible SpendItWisely promotional Coins for organizing verified receipts and maintaining active spending habits.",
      badge: "Step 4: Rewards"
    },
    5: {
      title: "5. Redeem Benefits & Offers",
      desc: "Coins unlock promotional discounts, merchant vouchers, and savings deals curated across local commerce partners.",
      badge: "Step 5: Value"
    },
    6: {
      title: "6. Smarter Local & Marketplace Shopping",
      desc: "Users discover products from local kirana partners and online suppliers, spending smarter with earned benefits.",
      badge: "Step 6: Commerce"
    }
  };

  steps.forEach(btn => {
    btn.addEventListener('click', () => {
      const stepNum = btn.getAttribute('data-step');
      steps.forEach(b => {
        b.classList.remove('bg-emerald-600', 'text-white', 'border-emerald-600');
        b.classList.add('bg-white', 'text-slate-700', 'border-slate-200');
      });
      btn.classList.remove('bg-white', 'text-slate-700', 'border-slate-200');
      btn.classList.add('bg-emerald-600', 'text-white', 'border-emerald-600');

      const data = stepData[stepNum] || stepData[1];
      if (cardTitle) cardTitle.textContent = data.title;
      if (cardDesc) cardDesc.textContent = data.desc;
      if (cardBadge) cardBadge.textContent = data.badge;
    });
  });
}

/* -------------------------------------------------------------------------- */
/* 3. Phone Simulator & OCR Scanner                                           */
/* -------------------------------------------------------------------------- */
function initPhoneSimulator() {
  const phoneScreen = document.getElementById('phone-active-image');
  const screenTabs = document.querySelectorAll('.phone-screen-tab');
  const scanOverlay = document.getElementById('phone-scan-overlay');
  const scanTriggerBtn = document.getElementById('trigger-phone-scan');
  const scanResultBanner = document.getElementById('phone-scan-result');

  const screens = {
    home: "assets/images/app-screen-home.jpg",
    bills: "assets/images/app-screen-bills.jpg",
    spend: "assets/images/app-screen-spend.jpg"
  };

  function switchScreen(key) {
    if (!phoneScreen) return;
    if (scanOverlay) scanOverlay.classList.add('hidden');
    if (scanResultBanner) scanResultBanner.classList.add('hidden');

    phoneScreen.style.opacity = '0';
    setTimeout(() => {
      phoneScreen.src = screens[key] || screens.home;
      phoneScreen.style.opacity = '1';
    }, 150);

    screenTabs.forEach(tab => {
      if (tab.getAttribute('data-screen') === key) {
        tab.classList.remove('bg-slate-100', 'text-slate-600');
        tab.classList.add('bg-emerald-600', 'text-white', 'shadow-sm');
      } else {
        tab.classList.remove('bg-emerald-600', 'text-white', 'shadow-sm');
        tab.classList.add('bg-slate-100', 'text-slate-600');
      }
    });
  }

  screenTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      switchScreen(tab.getAttribute('data-screen'));
    });
  });

  if (scanTriggerBtn) {
    scanTriggerBtn.addEventListener('click', () => {
      if (!scanOverlay) return;
      scanOverlay.classList.remove('hidden');
      if (scanResultBanner) scanResultBanner.classList.add('hidden');

      setTimeout(() => {
        scanOverlay.classList.add('hidden');
        if (scanResultBanner) {
          scanResultBanner.classList.remove('hidden');
          scanResultBanner.innerHTML = `
            <div class="bg-slate-900 text-white p-3 rounded-xl border border-emerald-500 shadow-xl text-xs space-y-1">
              <div class="flex items-center justify-between font-bold">
                <span class="text-emerald-400">✓ OCR Extracted: Sardarji ke momos</span>
                <span class="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded text-[10px]">+43 Coins</span>
              </div>
              <p class="text-[11px] text-slate-300">Amount: ₹150.00 • Category: Food & Utilities</p>
              <div class="pt-1 border-t border-slate-800 flex justify-between text-[10px] text-slate-400">
                <span>CGST: ₹1.78</span>
                <span>SGST: ₹1.78</span>
                <span class="font-bold text-slate-200">Total Tax: ₹3.57</span>
              </div>
              <p class="text-[9px] text-amber-300 pt-0.5 italic">*OCR preview extracted. User review & confirmation required.</p>
            </div>
          `;
        }
      }, 2000);
    });
  }
}

/* -------------------------------------------------------------------------- */
/* 4. Local Kirana Store & Cart Explorer                                      */
/* -------------------------------------------------------------------------- */
let cartItems = [];

function initLocalKiranaStore() {
  const storeFilters = document.querySelectorAll('.kirana-filter-btn');
  const productCards = document.querySelectorAll('.kirana-product-card');
  const cartCountBadges = document.querySelectorAll('.cart-count-badge');
  const openCartBtns = document.querySelectorAll('.open-cart-btn');

  storeFilters.forEach(btn => {
    btn.addEventListener('click', () => {
      storeFilters.forEach(b => {
        b.classList.remove('bg-emerald-600', 'text-white');
        b.classList.add('bg-slate-100', 'text-slate-600');
      });
      btn.classList.remove('bg-slate-100', 'text-slate-600');
      btn.classList.add('bg-emerald-600', 'text-white');

      const storeId = btn.getAttribute('data-store');
      productCards.forEach(card => {
        if (storeId === 'all' || card.getAttribute('data-store') === storeId) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // Add to cart buttons
  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const name = btn.getAttribute('data-name');
      const price = parseFloat(btn.getAttribute('data-price'));
      const store = btn.getAttribute('data-store-name');

      cartItems.push({ id, name, price, store });
      updateCartDisplay();

      btn.classList.add('bg-emerald-700', 'text-white');
      btn.innerHTML = `<span>✓ Added</span>`;
      setTimeout(() => {
        btn.classList.remove('bg-emerald-700', 'text-white');
        btn.innerHTML = `<i data-lucide="plus" class="w-3.5 h-3.5"></i><span>Add</span>`;
        if (window.lucide) lucide.createIcons();
      }, 1200);
    });
  });

  function updateCartDisplay() {
    cartCountBadges.forEach(badge => {
      badge.textContent = cartItems.length;
      badge.classList.remove('hidden');
    });
  }

  // Cart modal trigger
  openCartBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      renderCartModal();
    });
  });
}

function renderCartModal() {
  const modal = document.getElementById('cart-modal');
  const cartList = document.getElementById('cart-items-list');
  const cartTotal = document.getElementById('cart-total-amount');

  if (!modal || !cartList) return;

  cartList.innerHTML = '';
  if (cartItems.length === 0) {
    cartList.innerHTML = `
      <div class="text-center py-8 text-slate-400">
        <i data-lucide="shopping-bag" class="w-10 h-10 mx-auto text-slate-300 mb-2"></i>
        <p class="text-sm">Your SpendItWisely local cart is empty.</p>
        <p class="text-xs text-slate-400 mt-1">Discover items from kirana partners around you.</p>
      </div>
    `;
    if (cartTotal) cartTotal.textContent = "₹0.00";
  } else {
    let total = 0;
    cartItems.forEach((item, index) => {
      total += item.price;
      const row = document.createElement('div');
      row.className = "flex items-center justify-between py-2.5 border-b border-slate-100 text-xs";
      row.innerHTML = `
        <div>
          <strong class="text-slate-800">${item.name}</strong>
          <span class="block text-[10px] text-slate-400">${item.store} • Asset-Light Partner</span>
        </div>
        <div class="flex items-center gap-3">
          <span class="font-mono font-bold text-slate-900">₹${item.price.toFixed(2)}</span>
          <button class="remove-cart-item text-red-500 hover:text-red-700 text-xs p-1" data-index="${index}">✕</button>
        </div>
      `;
      cartList.appendChild(row);
    });

    if (cartTotal) cartTotal.textContent = `₹${total.toFixed(2)}`;

    cartList.querySelectorAll('.remove-cart-item').forEach(b => {
      b.addEventListener('click', (e) => {
        const idx = parseInt(b.getAttribute('data-index'), 10);
        cartItems.splice(idx, 1);
        document.querySelectorAll('.cart-count-badge').forEach(badge => {
          badge.textContent = cartItems.length;
        });
        renderCartModal();
      });
    });
  }

  if (window.lucide) lucide.createIcons();
  modal.classList.remove('hidden');
}

/* -------------------------------------------------------------------------- */
/* 5. Coins Wallet & Rewards System                                           */
/* -------------------------------------------------------------------------- */
function initCoinsWallet() {
  const coinBalanceEl = document.getElementById('user-coin-balance');
  const redeemBtns = document.querySelectorAll('.redeem-reward-btn');

  let currentCoins = 2450;

  redeemBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cost = parseInt(btn.getAttribute('data-cost'), 10);
      const title = btn.getAttribute('data-title');

      if (currentCoins >= cost) {
        currentCoins -= cost;
        if (coinBalanceEl) coinBalanceEl.textContent = `${currentCoins.toLocaleString('en-IN')} Coins`;
        alert(`🎉 Successfully redeemed: ${title}! Use promotional code at partner checkout. (SpendItWisely Coins are promotional reward units, not cash or crypto).`);
      } else {
        alert(`Insufficient Coins. You need ${cost} Coins for this reward. Upload more verified receipts to earn eligible Coins!`);
      }
    });
  });
}

/* -------------------------------------------------------------------------- */
/* 6. Modals (Merchant Onboarding & User Join)                               */
/* -------------------------------------------------------------------------- */
function initModals() {
  // Merchant Modal
  const merchantModal = document.getElementById('merchant-modal');
  const openMerchantBtns = document.querySelectorAll('.open-merchant-modal-btn');
  const closeMerchantBtn = document.getElementById('close-merchant-modal-btn');
  const merchantForm = document.getElementById('merchant-form');

  openMerchantBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (merchantModal) merchantModal.classList.remove('hidden');
    });
  });

  if (closeMerchantBtn && merchantModal) {
    closeMerchantBtn.addEventListener('click', () => {
      merchantModal.classList.add('hidden');
    });
  }

  if (merchantForm) {
    merchantForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert("✅ Thank you! Your merchant interest application has been received by Renext Technologies. A local partner representative will contact your store.");
      merchantForm.reset();
      if (merchantModal) merchantModal.classList.add('hidden');
    });
  }

  // User Join Modal
  const userModal = document.getElementById('user-modal');
  const openUserBtns = document.querySelectorAll('.open-user-modal-btn');
  const closeUserBtn = document.getElementById('close-user-modal-btn');
  const userForm = document.getElementById('user-join-form');

  openUserBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (userModal) userModal.classList.remove('hidden');
    });
  });

  if (closeUserBtn && userModal) {
    closeUserBtn.addEventListener('click', () => {
      userModal.classList.add('hidden');
    });
  }

  if (userForm) {
    userForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert("🎉 Welcome! You have joined the SpendItWisely early access community. We will alert you with your promotional starter Coins when onboarding opens.");
      userForm.reset();
      if (userModal) userModal.classList.add('hidden');
    });
  }

  // Cart Modal Close
  const cartModal = document.getElementById('cart-modal');
  const closeCartBtn = document.getElementById('close-cart-modal-btn');
  if (closeCartBtn && cartModal) {
    closeCartBtn.addEventListener('click', () => {
      cartModal.classList.add('hidden');
    });
  }

  // Close modals on backdrop click
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.add('hidden');
      }
    });
  });
}

/* -------------------------------------------------------------------------- */
/* 7. Interactive FAQ Accordion                                               */
/* -------------------------------------------------------------------------- */
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    if (header) {
      header.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close other items
        faqItems.forEach(other => {
          if (other !== item) {
            other.classList.remove('active');
          }
        });

        if (isActive) {
          item.classList.remove('active');
        } else {
          item.classList.add('active');
        }
      });
    }
  });
}

/* -------------------------------------------------------------------------- */
/* 8. Contact Form & Inquiry Tabs                                             */
/* -------------------------------------------------------------------------- */
function initContactInquiryTabs() {
  const tabs = document.querySelectorAll('.inquiry-tab-btn');
  const typeInput = document.getElementById('inquiry-type-input');
  const form = document.getElementById('renext-contact-form');
  const feedback = document.getElementById('contact-feedback-box');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('bg-blue-600', 'text-white');
        t.classList.add('bg-slate-100', 'text-slate-600');
      });
      tab.classList.remove('bg-slate-100', 'text-slate-600');
      tab.classList.add('bg-blue-600', 'text-white');

      const category = tab.getAttribute('data-category');
      if (typeInput) typeInput.value = category;
    });
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;

      btn.disabled = true;
      btn.innerHTML = `Sending...`;

      setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = originalText;
        form.reset();

        if (feedback) {
          feedback.classList.remove('hidden');
          setTimeout(() => feedback.classList.add('hidden'), 6000);
        } else {
          alert("Thank you! Your enquiry has been received by Renext Technologies Pvt. Ltd. Our team will contact you shortly.");
        }
      }, 1000);
    });
  }
}
