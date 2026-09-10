/**
 * RENEXT TECHNOLOGIES PVT LTD — AI Studio Engine
 * Feature: "AI Add per day 100" (High-velocity 100 Ads/day Generation System)
 */

document.addEventListener('DOMContentLoaded', () => {
  initAIStudioEngine();
});

function initAIStudioEngine() {
  const generateBtn = document.getElementById('studio-generate-btn');
  const brandInput = document.getElementById('studio-brand-input');
  const productInput = document.getElementById('studio-product-input');
  const toneSelect = document.getElementById('studio-tone-select');
  const audienceInput = document.getElementById('studio-audience-input');

  const progressContainer = document.getElementById('studio-progress-container');
  const progressBar = document.getElementById('studio-progress-bar');
  const progressCount = document.getElementById('studio-progress-count');
  const progressStatus = document.getElementById('studio-progress-status');

  const adsContainer = document.getElementById('studio-ads-grid');
  const totalCountBadge = document.getElementById('studio-total-count');
  const filterPills = document.querySelectorAll('.studio-filter-pill');
  const searchInput = document.getElementById('studio-search-input');
  const exportBtn = document.getElementById('studio-export-btn');

  let generatedAds = [];
  let currentFilter = 'all';

  // Seed / Generator templates
  const platforms = ['Meta / Instagram', 'Google Search & PMax', 'LinkedIn B2B', 'TikTok & Shorts', 'X / Twitter'];
  
  const hookTemplates = [
    "Still spending hours on {product}? Here's how {brand} does it 10x faster.",
    "Stop wasting budget on outdated workflows. Meet {brand}.",
    "The #1 tool engineered for {audience} in 2026.",
    "Why leading companies are switching to {brand} this month.",
    "Tired of manual bottlenecks? Automate your {product} today.",
    "See how {brand} delivers 4.8x ROI for {audience}.",
    "This single change transformed our {product} pipeline.",
    "Are you still doing {product} the hard way? Discover {brand}.",
    "The secret high-growth brands use to scale {product}.",
    "Zero setup friction. Enterprise-grade results. Try {brand} now."
  ];

  const bodyTemplates = [
    "Scale without increasing headcount. {brand} gives your team the ultimate edge with smart automation and seamless integrations.",
    "Engineered specifically for {audience} who value precision, velocity, and measurable ROI. Backed by Renext enterprise SLA.",
    "Join over 500+ fast-growing organizations optimizing their {product} operations with 99.8% precision.",
    "Slash operational friction by 60% while boosting conversion metrics. Book your direct demo today.",
    "From concept to execution in minutes. No steep learning curves, just raw productivity for {audience}."
  ];

  const ctaTemplates = [
    "Get Started Free", "Claim Your Free Audit", "Start Free Trial", "Book a 15-Min Demo", "Unlock 100 Free Ads", "Scale With Renext", "Explore Live Platform"
  ];

  const visualPrompts = [
    "Hyper-realistic 3D neon isometric glass interface displaying live metrics and glowing charts, futuristic dark mode aesthetic.",
    "Clean minimalist studio photography of modern entrepreneurs reviewing sleek tablet dashboards with bright blue ambient lighting.",
    "Vibrant high-contrast split screen showing chaotic manual spreadsheet vs serene automated dashboard.",
    "Cinematic motion freeze frame of a creative professional smiling at a floating holographic HUD interface.",
    "Macro shot of smartphone with notification badge: '100 Ad Variations Generated Successfully'."
  ];

  function generateFull100Batch(brand, product, audience, tone) {
    const batch = [];
    for (let i = 1; i <= 100; i++) {
      const platform = platforms[i % platforms.length];
      const hookRaw = hookTemplates[(i * 3 + 7) % hookTemplates.length];
      const bodyRaw = bodyTemplates[(i * 2 + 5) % bodyTemplates.length];
      const cta = ctaTemplates[(i + 4) % ctaTemplates.length];
      const visual = visualPrompts[i % visualPrompts.length];

      const headline = hookRaw
        .replace(/{brand}/g, brand)
        .replace(/{product}/g, product)
        .replace(/{audience}/g, audience);

      const body = bodyRaw
        .replace(/{brand}/g, brand)
        .replace(/{product}/g, product)
        .replace(/{audience}/g, audience);

      // Predicted CTR calculation
      const predictedCTR = (3.4 + ((i * 17) % 35) / 10).toFixed(1) + '%';
      const adAngle = ['High Urgency', 'Social Proof', 'Pain-Relief', 'Feature Spotlight', 'Curiosity Hook', 'Comparative Edge'][i % 6];

      batch.push({
        id: i,
        platform: platform,
        angle: adAngle,
        headline: headline,
        copy: body,
        cta: cta,
        predictedCTR: predictedCTR,
        visualPrompt: visual,
        variantTag: `AD-${String(i).padStart(3, '0')}`
      });
    }
    return batch;
  }

  function renderAdsList(ads) {
    if (!adsContainer) return;
    adsContainer.innerHTML = '';

    if (ads.length === 0) {
      adsContainer.innerHTML = `
        <div class="col-span-full text-center py-12 text-slate-400">
          <p class="text-base">No ad variants match your search filter. Try another keyword.</p>
        </div>
      `;
      return;
    }

    // Render up to 50 initially or paginate
    ads.forEach((ad) => {
      const card = document.createElement('div');
      card.className = "bg-white border border-slate-200 rounded-xl p-5 hover:shadow-lg transition-all flex flex-col justify-between hover:border-blue-300 relative group";
      
      let platformBadgeColor = "bg-blue-50 text-blue-700 border-blue-200";
      if (ad.platform.includes('Instagram')) platformBadgeColor = "bg-pink-50 text-pink-700 border-pink-200";
      if (ad.platform.includes('Google')) platformBadgeColor = "bg-amber-50 text-amber-700 border-amber-200";
      if (ad.platform.includes('LinkedIn')) platformBadgeColor = "bg-sky-50 text-sky-700 border-sky-200";
      if (ad.platform.includes('TikTok')) platformBadgeColor = "bg-emerald-50 text-emerald-700 border-emerald-200";

      card.innerHTML = `
        <div>
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-bold px-2.5 py-1 rounded-full border ${platformBadgeColor}">${ad.platform}</span>
            <div class="flex items-center gap-2">
              <span class="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono font-medium">${ad.variantTag}</span>
              <span class="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">CTR: ${ad.predictedCTR}</span>
            </div>
          </div>

          <h4 class="font-bold text-slate-900 text-sm mb-2 group-hover:text-blue-600 transition-colors">${ad.headline}</h4>
          <p class="text-xs text-slate-600 mb-3 line-clamp-3 leading-relaxed">${ad.copy}</p>

          <div class="bg-slate-50 rounded-lg p-2.5 mb-3 border border-slate-100">
            <div class="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 mb-1">
              <svg class="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              AI Visual Direction:
            </div>
            <p class="text-[11px] text-slate-500 italic line-clamp-2">${ad.visualPrompt}</p>
          </div>
        </div>

        <div class="pt-2 border-t border-slate-100 flex items-center justify-between mt-2">
          <span class="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">CTA: "${ad.cta}"</span>
          <button class="copy-ad-btn text-xs font-medium text-slate-500 hover:text-blue-600 flex items-center gap-1 p-1" data-id="${ad.id}">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
            <span>Copy</span>
          </button>
        </div>
      `;

      adsContainer.appendChild(card);
    });

    // Attach copy events
    document.querySelectorAll('.copy-ad-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(btn.getAttribute('data-id'), 10);
        const item = generatedAds.find(a => a.id === id);
        if (item) {
          const textToCopy = `[${item.platform}] ${item.headline}\n\n${item.copy}\n\nCTA: ${item.cta}\nVisual Prompt: ${item.visualPrompt}`;
          navigator.clipboard.writeText(textToCopy).then(() => {
            const originalSpan = btn.querySelector('span');
            originalSpan.textContent = 'Copied!';
            btn.classList.add('text-emerald-600');
            setTimeout(() => {
              originalSpan.textContent = 'Copy';
              btn.classList.remove('text-emerald-600');
            }, 1800);
          });
        }
      });
    });
  }

  function filterAndDisplay() {
    let list = generatedAds;
    if (currentFilter !== 'all') {
      list = list.filter(ad => ad.platform.toLowerCase().includes(currentFilter.toLowerCase()));
    }

    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    if (query) {
      list = list.filter(ad => 
        ad.headline.toLowerCase().includes(query) || 
        ad.copy.toLowerCase().includes(query) ||
        ad.angle.toLowerCase().includes(query)
      );
    }

    renderAdsList(list);
  }

  // Generate Trigger
  if (generateBtn) {
    generateBtn.addEventListener('click', () => {
      const brand = brandInput && brandInput.value.trim() ? brandInput.value.trim() : "Renext Technologies";
      const product = productInput && productInput.value.trim() ? productInput.value.trim() : "Enterprise AI & Cloud Suite";
      const audience = audienceInput && audienceInput.value.trim() ? audienceInput.value.trim() : "Modern Tech Founders & CFOs";
      const tone = toneSelect ? toneSelect.value : "High Growth & Direct Response";

      generateBtn.disabled = true;
      if (progressContainer) progressContainer.classList.remove('hidden');

      let currentStep = 0;
      const totalSteps = 100;
      
      const interval = setInterval(() => {
        currentStep += 4;
        const pct = Math.min(100, currentStep);
        if (progressBar) progressBar.style.width = `${pct}%`;
        if (progressCount) progressCount.textContent = `${pct} / 100 Generated`;

        if (pct < 30 && progressStatus) progressStatus.textContent = "Analyzing audience segments & competitor hooks...";
        else if (pct < 70 && progressStatus) progressStatus.textContent = "Synthesizing cross-platform creative variations & copy...";
        else if (pct < 95 && progressStatus) progressStatus.textContent = "Calculating predicted CTR & optimizing visual diffusion prompts...";

        if (currentStep >= totalSteps) {
          clearInterval(interval);
          generateBtn.disabled = false;
          if (progressStatus) progressStatus.textContent = "✓ Batch of 100 AI Ads Ready!";
          
          generatedAds = generateFull100Batch(brand, product, audience, tone);
          if (totalCountBadge) totalCountBadge.textContent = "100 Ads Ready";
          
          filterAndDisplay();
        }
      }, 40);
    });
  }

  // Filter Pills
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => {
        p.classList.remove('bg-blue-600', 'text-white', 'shadow-sm');
        p.classList.add('bg-slate-100', 'text-slate-600');
      });
      pill.classList.remove('bg-slate-100', 'text-slate-600');
      pill.classList.add('bg-blue-600', 'text-white', 'shadow-sm');
      currentFilter = pill.getAttribute('data-filter');
      filterAndDisplay();
    });
  });

  // Search input
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      filterAndDisplay();
    });
  }

  // Export to CSV / JSON
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      if (generatedAds.length === 0) {
        alert("Please generate the 100 ads batch first!");
        return;
      }

      const csvRows = [
        ["ID", "Platform", "Angle", "Headline", "Primary Copy", "Call To Action", "Predicted CTR", "Visual Direction Prompt"]
      ];

      generatedAds.forEach(ad => {
        csvRows.push([
          ad.variantTag,
          `"${ad.platform}"`,
          `"${ad.angle}"`,
          `"${ad.headline.replace(/"/g, '""')}"`,
          `"${ad.copy.replace(/"/g, '""')}"`,
          `"${ad.cta}"`,
          `"${ad.predictedCTR}"`,
          `"${ad.visualPrompt.replace(/"/g, '""')}"`
        ]);
      });

      const csvContent = "data:text/csv;charset=utf-8," + csvRows.map(e => e.join(",")).join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `renext_ai_studio_100_ads_batch.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  // Generate initial default set for instant display
  generatedAds = generateFull100Batch("Renext Technologies", "Enterprise AI & Cloud Suite", "CFOs & Tech Leaders", "High Growth");
  filterAndDisplay();
}
