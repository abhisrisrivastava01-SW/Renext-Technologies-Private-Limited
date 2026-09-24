import { tabs, packages, packageById } from './ads-creative-packages.js';

const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
const tabList = document.getElementById('package-tabs');
const packageGrid = document.getElementById('package-grid');
const projectType = document.getElementById('project-type');

// Each package is available in the inquiry form even when another tab is visible.
tabs.forEach(tab => {
  const group = document.createElement('optgroup');
  group.label = tab.label;
  packages.filter(item => item.tab === tab.id).forEach(item => {
    const option = document.createElement('option');
    option.value = item.inquiry;
    option.textContent = item.name;
    group.append(option);
  });
  projectType.add(group);
});

function showTab(activeId, focus = false) {
  const active = tabs.find(tab => tab.id === activeId) || tabs[0];
  tabList.innerHTML = tabs.map((tab, index) => `<button type="button" id="tab-${escapeHtml(tab.id)}" role="tab" aria-selected="${tab.id === active.id}" aria-controls="package-grid" tabindex="${tab.id === active.id ? 0 : -1}" data-tab="${escapeHtml(tab.id)}"><span>0${index + 1}</span>${escapeHtml(tab.label)}<b aria-hidden="true">↗</b></button>`).join('');
  packageGrid.setAttribute('aria-labelledby', `tab-${active.id}`);
  document.getElementById('package-category').textContent = active.label;
  document.getElementById('package-line').textContent = active.line;
  document.getElementById('package-description').textContent = active.description;
  packageGrid.innerHTML = packages.filter(item => item.tab === active.id).map(item => `
    <article class="package-card${item.badge ? ' package-card-featured' : ''}">
      <div class="package-card-top"><span>${escapeHtml(item.cadence)}</span>${item.badge ? `<strong>${escapeHtml(item.badge)}</strong>` : ''}</div>
      <h4>${escapeHtml(item.name)}</h4><p class="package-hint">${escapeHtml(item.hint)}</p>
      <div class="package-price"><strong>${escapeHtml(item.price)}</strong><span>${escapeHtml(item.unit)}</span></div>
      ${item.setup ? `<p class="package-setup">+ ${escapeHtml(item.setup)}</p>` : ''}
      <p class="package-volume">${escapeHtml(item.volume)}</p>
      <ul>${item.features.map(feature => `<li>${escapeHtml(feature)}</li>`).join('')}</ul>
      <p class="package-foot">${escapeHtml(item.foot)}</p>
      <button class="package-select" type="button" data-package="${escapeHtml(item.id)}">Select package <span>↗</span></button>
    </article>`).join('');
  if (focus) document.getElementById(`tab-${active.id}`).focus();
}
showTab(tabs[0].id);
tabList.addEventListener('click', event => {
  const button = event.target.closest('[data-tab]');
  if (button) showTab(button.dataset.tab, true);
});
tabList.addEventListener('keydown', event => {
  if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
  event.preventDefault();
  const current = tabs.findIndex(tab => tab.id === document.activeElement.dataset.tab);
  const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (current + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
  showTab(tabs[next].id, true);
});
packageGrid.addEventListener('click', event => {
  const button = event.target.closest('[data-package]');
  if (!button) return;
  const selected = packageById(button.dataset.package);
  if (!selected) return;
  projectType.value = selected.inquiry;
  document.getElementById('project-brief').value = `I'd like to discuss ${selected.name} (${selected.cadence}).\n\nMy brand and product: \nTarget audience and market: \nCampaign goals or launch date: \nAny existing product assets or examples: `;
  document.getElementById('contact').scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
});

const films = {
  alctic: { title: 'Corporate AI UGC', src: 'assets/media/alctic.mp4', full: 'https://drive.google.com/file/d/18qCyykCpuu0uUR3BLe-Ylf9CrnBKqLNY/view' },
  lumiva: { title: 'Lumiva · Consumer product', src: 'assets/media/lumiva.mp4', full: 'https://drive.google.com/file/d/1XSZy47qLtN8R75ja89j_f4WZVWnIwuAZ/view' },
  indifi: { title: 'Indifi · Finance story', src: 'assets/media/indifi.mp4', full: 'https://drive.google.com/file/d/1zSBq7iVVcUPMG1rT9WwI4kHw-MKwodZx/view' },
  montage: { title: 'Creator · Short-form montage', src: 'assets/media/creator-montage.mp4', full: 'https://drive.google.com/file/d/1t4OPkMyDDABfcLUuY1a8g0M7AU36HZS8/view' }
};
const dialog = document.getElementById('film-dialog');
const player = dialog.querySelector('video');
const backgrounds = [...document.querySelectorAll('.film>video[data-src]')];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const saveData = navigator.connection && navigator.connection.saveData;
const visible = new Set();

// Posters render first. A preview only downloads when its tile is near the viewport,
// and never when the visitor prefers reduced motion or has Data Saver on.
const loadPreview = video => {
  if (video.dataset.loaded) return;
  video.src = video.dataset.src;
  video.dataset.loaded = '1';
};
const canAutoplay = () => !reducedMotion.matches && !saveData && !document.hidden && !dialog.open;
const syncPlayback = () => backgrounds.forEach(video => {
  if (canAutoplay() && visible.has(video)) { loadPreview(video); video.play().catch(() => {}); }
  else if (!video.paused) video.pause();
});
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.isIntersecting ? visible.add(entry.target) : visible.delete(entry.target));
    syncPlayback();
  }, { rootMargin: '200px 0px', threshold: 0.15 });
  backgrounds.forEach(video => observer.observe(video));
}
reducedMotion.addEventListener?.('change', syncPlayback);

document.querySelectorAll('[data-film]').forEach(button => button.addEventListener('click', () => {
  const film = films[button.dataset.film];
  if (!film) return;
  backgrounds.forEach(video => video.pause());
  player.src = film.src;
  player.muted = false;
  document.getElementById('dialog-title').textContent = film.title;
  document.getElementById('dialog-source').href = film.full;
  dialog.showModal();
  player.play().catch(() => {});
}));
const closeFilm = () => { player.pause(); player.removeAttribute('src'); player.load(); if (dialog.open) dialog.close(); syncPlayback(); };
dialog.querySelector('.close-film').addEventListener('click', closeFilm);
dialog.addEventListener('cancel', event => { event.preventDefault(); closeFilm(); });
dialog.addEventListener('click', event => { if (event.target === dialog) closeFilm(); });
document.addEventListener('visibilitychange', syncPlayback);

// "Book a pilot" pre-selects the pilot option. Submission itself is handled by
// assets/js/enquiry.js (real delivery, honest success/failure).
document.querySelectorAll('[data-prefill]').forEach(link => link.addEventListener('click', () => {
  projectType.value = link.dataset.prefill;
}));
