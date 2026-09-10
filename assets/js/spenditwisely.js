/**
 * SPENDITWISELY — Startup Product Controller & Interactive Simulator
 * Spend Smartly with SIWSS (Smart Invoice & Wallet Savings System)
 */

document.addEventListener('DOMContentLoaded', () => {
  initPhoneSimulator();
  initTaxCalculator();
  initWaitlistForm();
});

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

  function switchScreen(screenKey) {
    if (!phoneScreen) return;
    if (scanOverlay) scanOverlay.classList.add('hidden');
    if (scanResultBanner) scanResultBanner.classList.add('hidden');

    phoneScreen.style.opacity = '0';
    setTimeout(() => {
      phoneScreen.src = screens[screenKey] || screens.home;
      phoneScreen.style.opacity = '1';
    }, 150);

    screenTabs.forEach(tab => {
      if (tab.getAttribute('data-screen') === screenKey) {
        tab.classList.remove('bg-slate-100', 'text-slate-600');
        tab.classList.add('bg-emerald-600', 'text-white', 'shadow-md');
      } else {
        tab.classList.remove('bg-emerald-600', 'text-white', 'shadow-md');
        tab.classList.add('bg-slate-100', 'text-slate-600');
      }
    });
  }

  screenTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-screen');
      switchScreen(target);
    });
  });

  // Scanner Simulation
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
            <div class="bg-emerald-500 text-white p-3 rounded-xl shadow-lg border border-emerald-400 text-xs animate-fade-in">
              <div class="flex items-center justify-between font-bold mb-1">
                <span>✓ Receipt Scanned!</span>
                <span class="bg-white/20 px-1.5 py-0.5 rounded text-[10px]">+43 Coins</span>
              </div>
              <p class="text-[11px] opacity-90">Sardarji ke momos • ₹150.0</p>
              <div class="mt-1 pt-1 border-t border-white/20 flex justify-between text-[10px]">
                <span>CGST: ₹1.78</span>
                <span>SGST: ₹1.78</span>
                <span class="font-bold">Total GST: ₹3.57</span>
              </div>
            </div>
          `;
        }
      }, 2500);
    });
  }
}

function initTaxCalculator() {
  const expenseSlider = document.getElementById('siwss-expense-slider');
  const expenseDisplay = document.getElementById('siwss-expense-display');
  const gstRateSelect = document.getElementById('siwss-gst-rate');

  const gstCreditMonthly = document.getElementById('siwss-gst-monthly');
  const taxSavingsAnnual = document.getElementById('siwss-tax-annual');
  const coinsAnnual = document.getElementById('siwss-coins-annual');

  if (!expenseSlider) return;

  function calculateTaxSavings() {
    const monthly = parseInt(expenseSlider.value, 10);
    const rate = parseFloat(gstRateSelect ? gstRateSelect.value : 18) / 100;

    // Approximate GST component inside total inclusive spend
    const gstComponent = Math.round(monthly * (rate / (1 + rate)));
    // Estimated tax deduction or business expense optimization (approx 20% effective tax bracket)
    const annualDeduction = Math.round(monthly * 12 * 0.18);
    // Rewards points earned (approx 1 coin per ₹20 spent on utility/food receipts)
    const annualCoins = Math.round((monthly * 12) / 20);

    if (expenseDisplay) expenseDisplay.textContent = `₹${monthly.toLocaleString('en-IN')}`;
    if (gstCreditMonthly) gstCreditMonthly.textContent = `₹${gstComponent.toLocaleString('en-IN')}`;
    if (taxSavingsAnnual) taxSavingsAnnual.textContent = `₹${annualDeduction.toLocaleString('en-IN')}`;
    if (coinsAnnual) coinsAnnual.textContent = `${annualCoins.toLocaleString('en-IN')} Pts`;
  }

  expenseSlider.addEventListener('input', calculateTaxSavings);
  if (gstRateSelect) gstRateSelect.addEventListener('change', calculateTaxSavings);

  calculateTaxSavings();
}

function initWaitlistForm() {
  const form = document.getElementById('spendit-waitlist-form');
  const feedback = document.getElementById('waitlist-feedback');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;

    btn.disabled = true;
    btn.innerHTML = `Joining Early Access...`;

    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = originalText;
      form.reset();

      if (feedback) {
        feedback.classList.remove('hidden');
        setTimeout(() => feedback.classList.add('hidden'), 5000);
      } else {
        alert("🎉 You're on the SpenditWisely VIP Early Access list! We'll notify you as soon as the app drops on the Play Store & App Store.");
      }
    }, 1000);
  });
}
