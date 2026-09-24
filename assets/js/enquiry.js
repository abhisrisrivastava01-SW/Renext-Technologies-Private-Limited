/*
 * Renext enquiry forms — one honest submission path for every form.
 *
 * Usage: <form data-enquiry data-enquiry-topic="Default topic"> ... </form>
 * Field names understood: name, email, phone, company|brand, topic|subject|type, message|brief.
 *
 * Success is shown ONLY when /api/enquiry.php confirms the enquiry was stored.
 * Any other outcome shows a visible error plus a pre-filled email fallback.
 */
(function () {
  'use strict';
  var ENDPOINT = 'api/enquiry.php';
  var INBOX = 'info@renexttechnologies.com';

  function pick(form, names) {
    for (var i = 0; i < names.length; i++) {
      var el = form.elements.namedItem(names[i]);
      if (el && typeof el.value === 'string' && el.value.trim()) return el.value.trim();
    }
    return '';
  }

  function collect(form) {
    return {
      name: pick(form, ['name']),
      email: pick(form, ['email']),
      phone: pick(form, ['phone']),
      company: pick(form, ['company', 'brand']),
      topic: pick(form, ['topic', 'subject', 'type']) || form.getAttribute('data-enquiry-topic') || '',
      message: pick(form, ['message', 'brief']),
      website: pick(form, ['website']),
      page: location.pathname
    };
  }

  function mailtoFor(d) {
    var subject = 'Website enquiry' + (d.topic ? ' — ' + d.topic : '');
    var body = 'Name: ' + d.name + '\nEmail: ' + d.email + (d.phone ? '\nPhone: ' + d.phone : '') +
      (d.company ? '\nCompany / brand: ' + d.company : '') + (d.topic ? '\nTopic: ' + d.topic : '') +
      '\n\n' + d.message;
    return 'mailto:' + INBOX + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  }

  function statusBox(form) {
    var box = form.querySelector('[data-enquiry-status]');
    if (!box) {
      box = document.createElement('div');
      box.setAttribute('data-enquiry-status', '');
      box.setAttribute('role', 'status');
      box.setAttribute('aria-live', 'polite');
      box.className = 'enquiry-status';
      form.appendChild(box);
    }
    return box;
  }

  function show(box, kind, html) {
    box.className = 'enquiry-status enquiry-status--' + kind;
    box.innerHTML = html;
    box.hidden = false;
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function markFields(form, fields) {
    var map = { name: ['name'], email: ['email'], phone: ['phone'], message: ['message', 'brief'] };
    Object.keys(fields || {}).forEach(function (k) {
      (map[k] || [k]).forEach(function (n) {
        var el = form.elements.namedItem(n);
        if (el && el.setAttribute) el.setAttribute('aria-invalid', 'true');
      });
    });
  }

  function attach(form) {
    if (form.__enquiryBound) return;
    form.__enquiryBound = true;
    form.setAttribute('novalidate', '');
    var started = Date.now();

    // Honeypot (hidden from people and assistive tech).
    if (!form.elements.namedItem('website')) {
      var trap = document.createElement('div');
      trap.setAttribute('aria-hidden', 'true');
      trap.style.cssText = 'position:absolute;left:-10000px;width:1px;height:1px;overflow:hidden;';
      trap.innerHTML = '<label>Leave empty<input type="text" name="website" tabindex="-1" autocomplete="off"></label>';
      form.appendChild(trap);
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      e.stopImmediatePropagation();
      Array.prototype.forEach.call(form.querySelectorAll('[aria-invalid]'), function (el) { el.removeAttribute('aria-invalid'); });
      var box = statusBox(form);
      var d = collect(form);

      var problems = {};
      if (d.name.length < 2) problems.name = 'Please enter your name.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email)) problems.email = 'Please enter a valid email address.';
      if (d.message.length < 10) problems.message = 'Please add a few words about what you need.';
      if (Object.keys(problems).length) {
        markFields(form, problems);
        show(box, 'error', '<strong>Please check the form.</strong> ' + esc(Object.keys(problems).map(function (k) { return problems[k]; }).join(' ')));
        var first = form.querySelector('[aria-invalid="true"]');
        if (first) first.focus();
        return;
      }

      var btn = form.querySelector('button[type="submit"]');
      var label = btn ? btn.innerHTML : '';
      if (btn) { btn.disabled = true; btn.setAttribute('aria-busy', 'true'); btn.textContent = 'Sending…'; }
      show(box, 'pending', 'Sending your enquiry…');

      var payload = Object.assign({}, d, { elapsed_ms: Date.now() - started });
      var controller = 'AbortController' in window ? new AbortController() : null;
      var timer = controller ? setTimeout(function () { controller.abort(); }, 15000) : null;

      fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'same-origin',
        signal: controller ? controller.signal : undefined
      }).then(function (res) {
        return res.json().catch(function () { return { ok: false, error: 'bad_response' }; })
          .then(function (json) { return { status: res.status, json: json }; });
      }).then(function (r) {
        if (r.status === 200 && r.json && r.json.ok === true) {
          show(box, 'success', '<strong>Enquiry received.</strong> Reference ' + esc(r.json.id || '') +
            '. We will reply to ' + esc(d.email) + ' within one business day.');
          form.reset();
          started = Date.now();
          return;
        }
        if (r.status === 422 && r.json && r.json.fields) {
          markFields(form, r.json.fields);
          show(box, 'error', '<strong>Please check the form.</strong> ' + esc(Object.keys(r.json.fields).map(function (k) { return r.json.fields[k]; }).join(' ')));
          return;
        }
        throw new Error(r.status === 429 ? 'rate' : 'server');
      }).catch(function (err) {
        var why = err && err.message === 'rate'
          ? 'Too many enquiries from this connection in the last hour.'
          : 'Your enquiry was <strong>not</strong> sent — our form service did not respond.';
        show(box, 'error', why + ' Nothing was lost: <a href="' + mailtoFor(d) + '">send it by email instead</a>' +
          ' (opens your email app with the details filled in), or write to <a href="mailto:' + INBOX + '">' + INBOX + '</a>.');
      }).then(function () {
        if (timer) clearTimeout(timer);
        if (btn) { btn.disabled = false; btn.removeAttribute('aria-busy'); btn.innerHTML = label; }
      });
    }, true);
  }

  function init() {
    Array.prototype.forEach.call(document.querySelectorAll('form[data-enquiry]'), attach);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
  window.RenextEnquiry = { attach: attach };
})();
