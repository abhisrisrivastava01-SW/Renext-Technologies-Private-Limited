/* Ads Creative: featured films and same-page package inquiry. */
(function () {
  'use strict';

  const films = {
    alctic: { title: 'Corporate AI UGC', file: 'alctic.mp4', full: 'https://drive.google.com/file/d/18qCyykCpuu0uUR3BLe-Ylf9CrnBKqLNY/view' },
    lumiva: { title: 'Lumiva · Consumer product', file: 'lumiva.mp4', full: 'https://drive.google.com/file/d/1XSZy47qLtN8R75ja89j_f4WZVWnIwuAZ/view' },
    indifi: { title: 'Indifi · Finance story', file: 'indifi.mp4', full: 'https://drive.google.com/file/d/1zSBq7iVVcUPMG1rT9WwI4kHw-MKwodZx/view' },
    montage: { title: 'Creator · Short-form montage', file: 'creator-montage.mp4', full: 'https://drive.google.com/file/d/1t4OPkMyDDABfcLUuY1a8g0M7AU36HZS8/view' }
  };

  const dialog = document.getElementById('ads-film-dialog');
  const player = dialog.querySelector('video');
  const backgrounds = Array.from(document.querySelectorAll('.ads-film > video'));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function resumePreviews() {
    if (document.hidden || reducedMotion.matches || dialog.open) return;
    backgrounds.forEach(function (video) { video.play().catch(function () {}); });
  }

  function closeFilm() {
    player.pause();
    player.removeAttribute('src');
    player.load();
    if (dialog.open) dialog.close();
    resumePreviews();
  }

  document.querySelectorAll('[data-film]').forEach(function (button) {
    button.addEventListener('click', function () {
      const film = films[button.dataset.film];
      if (!film) return;
      backgrounds.forEach(function (video) { video.pause(); });
      player.src = 'assets/media/' + film.file;
      player.muted = false;
      document.getElementById('ads-dialog-title').textContent = film.title;
      document.getElementById('ads-dialog-source').href = film.full;
      dialog.showModal();
      player.play().catch(function () {});
    });
  });

  dialog.querySelector('.ads-film-close').addEventListener('click', closeFilm);
  dialog.addEventListener('cancel', function (event) { event.preventDefault(); closeFilm(); });
  dialog.addEventListener('click', function (event) { if (event.target === dialog) closeFilm(); });
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) backgrounds.forEach(function (video) { video.pause(); });
    else resumePreviews();
  });
  if (reducedMotion.matches) backgrounds.forEach(function (video) { video.pause(); });
  else resumePreviews();

  const packageSelect = document.getElementById('ads-project-package');
  const brief = document.getElementById('ads-project-brief');
  document.querySelectorAll('#packages a[data-package]').forEach(function (link) {
    link.addEventListener('click', function () {
      packageSelect.value = link.dataset.package;
      brief.value = 'I would like to discuss ' + link.dataset.package + '.\n\nMy brand and product: \nTarget audience and market: \nCampaign goals or launch date: \nExisting assets or examples: ';
    });
  });

  const categories = ['video', 'n8n', 'promo', 'custom'];
  const tablist = document.querySelector('#packages .scrollbar-none');
  tablist.setAttribute('role', 'tablist');
  tablist.setAttribute('aria-label', 'Production package categories');
  categories.forEach(function (category) {
    const tab = document.getElementById('stab-' + category);
    const panel = document.getElementById('sdeck-' + category);
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', panel.id);
    tab.setAttribute('aria-selected', category === 'video' ? 'true' : 'false');
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tab.id);
    tab.addEventListener('click', function () {
      categories.forEach(function (name) {
        document.getElementById('stab-' + name).setAttribute('aria-selected', name === category ? 'true' : 'false');
      });
    });
  });

  document.getElementById('ads-inquiry-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    function value(id) { return document.getElementById(id).value.trim(); }
    const subject = 'Ads Creative project inquiry — ' + value('ads-client-brand');
    const body = 'Name: ' + value('ads-client-name') + '\nWork email: ' + value('ads-client-email') +
      '\nBrand / website: ' + value('ads-client-brand') + '\nPackage: ' + value('ads-project-package') +
      '\n\nBrief:\n' + value('ads-project-brief');
    window.location.href = 'mailto:info@renexttechnologies.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  });
}());
