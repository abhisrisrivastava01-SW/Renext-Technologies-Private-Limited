# Renext website — fix report (branch `fix/site-restore-enquiry-seo`)

Date: 24 Sep 2026. Nothing pushed, nothing deployed, nothing deleted.

## 1. Confirmed faults

| # | Fault | Cause | Status |
|---|-------|-------|--------|
| F1 | Site looks broken (unstyled pages, dead Ads Creative page) | GitHub web upload on 24 Sep added the new HTML files but **not** the `assets/` folder. HTML used the new "Midnight Forge" CSS/JS; the repo still had the 10 Sep `styles.css`/`main.js`. `ai-studio.html` referenced `assets/media/*` (8 files), `ads-creative-portfolio.css/js`, `ads-creative-packages.js` — all missing. The complete set was inside `renext-ads-creative-integrated (1).zip`. | Fixed — restored from the zip, byte-identical |
| F2 | Homepage `#contactForm` said "Query Received Successfully" after `setTimeout` — no enquiry sent | Fake handler | Fixed — real endpoint |
| F3 | `contact.html` `#contact-form` alerted "Message sent!" — nothing sent (two fake handlers: inline + `main.js`) | Fake handlers | Fixed |
| F4 | `main.js` merchant / early-access forms alerted "application received" | Fake handlers (forms not on any page right now) | Removed |
| F5 | `ai-studio.html` form only opened a mail app (honest, but loses leads on phones with no mail app set up) | No backend | Fixed — real endpoint, mailto kept as fallback |
| F6 | Services demo alert: "Invoice Approved! Dispatched to Bank ERP…" | Reads like a real transaction | Relabelled "Demo only" |
| F7 | Homepage mobile horizontal scroll (54px) | ROI grid min-content | Fixed |
| F8 | Services annotation canvas 560px wide on mobile | Fixed width canvas | Fixed |
| F9 | No canonical URLs, no Open Graph, no Organization schema; demo page `background-paths.html` in sitemap | — | Fixed |
| F10 | All four portfolio videos autoplayed and downloaded on load (~1.8 MB) | `autoplay` + `preload=metadata` | Fixed — posters first, lazy playback |
| F11 | `deploy_ec2.sh` writes to **/var/www/html** (the other website) | Wrong target | Not run. Do not use. |

## 2. Files changed / added

Added
- `api/enquiry.php` — validated, rate-limited (5/hour/IP), honeypot, stores to JSONL **outside** the web root, optional email via `mail()`. Returns `ok:true` only after the write succeeds.
- `assets/js/enquiry.js` — one submit path for every `form[data-enquiry]`. Success only on server confirmation; otherwise visible error + pre-filled email fallback.
- `assets/css/enquiry.css`, `assets/css/ads-creative-cases.css`
- `.htaccess` — HTTPS + non-www 301, `/index.html` → `/`, blocks `.zip .sh .md .txt .py .tsx`, backups and configs from being served, caching, gzip.
- `assets/media/*` (8), `assets/css/ads-creative-portfolio.css`, `assets/js/ads-creative-portfolio.js`, `ads-creative-packages.js`, `ads-creative.js` — restored from zip.
- `docs/REPORT.md` (this file)

Changed
- `ai-studio.html` — case notes (brief / approach / deliverables / outcome) for all 4 films, process, pilot-sprint offer, FAQ, real form, SEO head, Service + VideoObject + FAQ + Breadcrumb schema, skip link.
- `assets/js/ads-creative-portfolio.js` — lazy previews (IntersectionObserver), respects reduced motion + Data Saver, pauses off-screen, mailto handler removed.
- `index.html`, `contact.html` — real form wiring; fake banner removed; canonical/OG; Organization + WebSite schema on home; mobile overflow fix.
- `services.html`, `about.html`, `spenditwisely.html` — canonical/OG; demo alert relabelled; canvas fix.
- `assets/css/styles.css`, `assets/js/main.js` — restored to zip version; fake form handlers removed.
- `sitemap.xml` (video sitemap entries, demo page removed), `robots.txt` (disallow `/api/`, demo page), `background-paths.html` (noindex).

## 3. Tests and results

Run locally with `php -S` + Playwright Chromium, desktop 1366px and mobile 390px.

| Test | Result |
|------|--------|
| All 6 pages: local 404s | 0 |
| JS errors | 0 on index + ai-studio. Other pages: `tailwind is not defined` **only because the sandbox blocks cdn.tailwindcss.com** — see note |
| Mobile horizontal overflow | 0 on all pages after fixes |
| Endpoint: valid POST | 200 `ok:true`, record written |
| Endpoint: invalid fields | 422 with per-field messages |
| Endpoint: honeypot filled | fake 200, **not stored** |
| Endpoint: GET | 405 |
| Endpoint: 6th post in an hour | 429, visible message |
| ai-studio / contact / home forms → success | "Enquiry received. Reference RNX-…" |
| Server returns 500 | "Your enquiry was **not** sent…" + email fallback link |
| Empty submit | field-level errors, focus moved |
| Previews on load | 0 downloaded; load only when in view |
| Reduced motion | 0 previews downloaded |
| Case "Play" buttons | open player dialog with sound |
| `php -l`, `node --check`, sitemap XML parse | pass |

Note: headless Chromium can't decode H.264, so actual playback must be checked on a real phone (step 6 below).

## 4. What I need from you

1. **Server check** (SSH):
   `php -v; apachectl -M | grep -E 'php|rewrite|headers'; grep -n AllowOverride /etc/apache2/sites-enabled/* /etc/httpd/conf.d/* 2>/dev/null`
   The endpoint needs PHP. If PHP isn't installed: `sudo apt install libapache2-mod-php` (Ubuntu) or `sudo dnf install php` (Amazon Linux). Until then, the form shows the honest error + email fallback, and it never shows a fake success.
2. **Email alerts** (optional). Enquiries are always saved to `/var/www/renexttechnologies/storage/`. To get emails too, set up `msmtp` with Amazon SES SMTP credentials (or Zoho/Google Workspace app password) **on the server**, then create `/var/www/renexttechnologies/config/enquiry.php`:
   ```php
   <?php return ['notify_to' => 'info@renexttechnologies.com', 'notify_from' => 'website@renexttechnologies.com', 'send_mail' => true];
   ```
   Never commit this file.
3. **Proof for claims** — confirm or remove (not changed, listed for your decision):
   - Home: "100+ Daily AI Ad Variants", "32% Avg Cloud Spend Recovery", "99.8% AP Matching Precision SLA", "500+ Kirana Partner Network"
   - Home: "99.9% Pipeline Uptime SLA", "99.8% workflow uptime monitoring SLA", "FinOps review typically uncovers 18–32%"
   - Services: "consistently cut monthly cloud spend by 28–42%", "30%+ FinOps Savings", "32% Cost Reduction", "99.8% QA SLA Guarantee", "99.8% precision" (AP)
   - SpendItWisely: "100K+ Users Joining Early Access List", "Reach 100K+ Digital-Savvy Customers"
   - Ads packages: "99.8% uptime target", "Most popular" badge — needs real sales behind it
   - Creator montage: "1,000,000+ views" appears inside the video — confirm it's that creator's real number
   If a number isn't backed by a signed contract, invoice or dashboard, replace it with a capability ("Built for 100 ads/day") or remove it.
4. **Portfolio status**: for Alctic/ISSPL, Lumiva, Indifi and the creator — was each **client-commissioned** or **speculative / concept**? If concept, I'll add a "Concept" label. Also confirm you have permission to show the Indifi and Lumiva names.
5. Real **uploadDate** for each film (schema currently uses 23 Sep 2026, the upload date).
6. Is the canonical host `renexttechnologies.com` (no www)? The `.htaccess` assumes yes.

## 5. Deploy and rollback plan (EC2, Apache, DocumentRoot `/var/www/renexttechnologies/public`)

Don't use `deploy_ec2.sh`. It writes to `/var/www/html`.

```bash
# 0. On your PC: review, then push the branch (your call)
git push origin fix/site-restore-enquiry-seo

# 1. On the server: backup current site
TS=$(date +%Y%m%d-%H%M%S)
sudo tar -czf /var/www/renexttechnologies/backup-$TS.tgz -C /var/www/renexttechnologies public

# 2. Storage outside web root
sudo mkdir -p /var/www/renexttechnologies/{storage,config}
sudo chown www-data:www-data /var/www/renexttechnologies/storage   # apache on Amazon Linux
sudo chmod 750 /var/www/renexttechnologies/storage

# 3. Release: fetch the branch into a temp dir, copy only web files
git clone --branch fix/site-restore-enquiry-seo --depth 1 https://github.com/abhisrisrivastava01-SW/Renext-Technologies-Private-Limited.git /tmp/renext-$TS
sudo rsync -a --delete \
  --exclude '.git' --exclude '*.zip' --exclude '*.md' --exclude 'docs/' --exclude 'deploy_ec2.sh' \
  --exclude 'b64_part*.txt' --exclude 'site_b64.txt' --exclude 'index.backup.html' --exclude 'index-standalone.html' \
  --exclude 'server.py' --exclude 'package.json' --exclude 'tsconfig.json' --exclude 'components.json' \
  --exclude 'tailwind.config.js' --exclude 'vercel.json' \
  /tmp/renext-$TS/ /var/www/renexttechnologies/public/

# 4. Apache: .htaccess needs AllowOverride All for this vhost, plus rewrite + headers
sudo a2enmod rewrite headers && sudo apachectl configtest && sudo systemctl reload apache2

# 5. Smoke test
curl -sI http://www.renexttechnologies.com | grep -i location     # → https://renexttechnologies.com/
curl -s -X POST https://renexttechnologies.com/api/enquiry.php -H 'Content-Type: application/json' \
  -d '{"name":"Deploy Test","email":"you@yourmail.com","message":"deploy smoke test","elapsed_ms":5000}'
tail -1 /var/www/renexttechnologies/storage/enquiries-*.jsonl
curl -sI https://renexttechnologies.com/renext-ads-creative-integrated%20\(1\).zip | head -1   # 403/404

# 6. Phone check: open /ai-studio.html, tap each film, send a test enquiry.
```

Rollback (≈1 minute):
```bash
sudo rm -rf /var/www/renexttechnologies/public && sudo mkdir /var/www/renexttechnologies/public
sudo tar -xzf /var/www/renexttechnologies/backup-$TS.tgz -C /var/www/renexttechnologies
sudo systemctl reload apache2
```
Stored enquiries in `storage/` are not touched by rollback.

## 6. Repository clean-up (files to delete — your decision, after deploy works)

| File | Why it's waste |
|------|----------------|
| `renext-ads-creative-integrated (1).zip` (2.4 MB) | Its contents are now in the repo |
| `b64_part1-3.txt`, `site_b64.txt` | Base64 dumps of an old homepage |
| `index.backup.html`, `index-standalone.html` | Old homepage copies (duplicate content risk if served) |
| `deploy_ec2.sh` | Targets the wrong site (`/var/www/html`) |
| `assets/js/ai-studio.js`, `assets/js/spenditwisely.js`, `assets/js/ads-creative.js` | Not loaded by any page |
| `vercel.json`, `components.json`, `tsconfig.json`, `tailwind.config.js`, `package.json` | Leftovers from a Vercel/React setup; site is static on Apache |
| `assets/images/renext-brand-board.png` (1 MB) | Not referenced by any page |

`.htaccess` already blocks most of these from being served.

## 7. Search Console and measurement checklist

1. Add a **Domain property** for `renexttechnologies.com` (DNS TXT at your registrar/Route 53).
2. Submit `https://renexttechnologies.com/sitemap.xml`.
3. URL Inspection → Request indexing: `/`, `/ai-studio.html`, `/services.html`.
4. Rich Results Test on `/ai-studio.html` (Video, FAQ, Breadcrumb) and `/` (Organization).
5. Check **Page indexing** weekly. `index.backup.html`, `index-standalone.html` and `background-paths.html` should not appear.
6. PageSpeed Insights (mobile) for `/` and `/ai-studio.html`. Target LCP < 2.5s.
7. Bing Webmaster Tools: import from GSC (it also feeds ChatGPT/Copilot search).
8. Google Business Profile for Renext (Rudrapur): category "Video production service" + "Software company", link to `/ai-studio.html`.
9. Measure: weekly count of lines in `storage/enquiries-*.jsonl`, split by `page` and `topic`. Add GA4 or Plausible later with a consent banner. The `generate_lead` event goes after `ok:true`.

Next SEO step (not done yet — needs a decision): **Tailwind Play CDN** (`cdn.tailwindcss.com`) is used on 4 pages. It isn't meant for production: it's slow and has a flash of unstyled content. Compile Tailwind to a static CSS file.

## 8. Client acquisition plan — Ads Creative

**Who to target first** (need video every week, have budget, decide fast)
1. Indian D2C brands on Shopify running Meta ads (skincare, baby, food, fashion), ₹5L+/month ad spend. Check their ads in Meta Ad Library.
2. Fintech / NBFC / lending apps that need Hindi and regional explainers (Indifi-style work is proof).
3. US/UK Shopify brands and small agencies that need UGC-style variations and would outsource the production.
4. Coaches and creators who need short-form editing (montage is proof).

**Starter offer — Pilot sprint** (now on the page)
One brief → 1 hero ad + 4 hook variations + 3 formats (9:16, 1:1, 4:5), delivered in 7 days. Suggested price: ₹35–50k India / $900–1,200 international. Credit it against month 1 of a package. Suggested prices only — set your own.

**Outreach assets**
- Cold email (D2C):
  > Subject: 3 new hooks for {Brand}'s {product} ad
  > Hi {Name} — I saw {Brand}'s current {product} ad in Meta Ad Library. The offer is strong, but the first 2 seconds are the same across versions. We make AI-assisted video ads with human editors. Here's a similar film we made: renexttechnologies.com/ai-studio.html#cases. Want 3 hook ideas for {product}, free, no call needed? — Abhishek, Renext
- LinkedIn DM (fintech): "We made an animated Hindi explainer for a small-business lending product (link). If {Company} is testing regional creatives, happy to share a 30-sec concept for your product."
- Follow-up after 4 days: send one storyboard frame made for *their* product.
- Weekly: post one case note breakdown (brief → approach → cut) on LinkedIn and Instagram.

**What the video team needs to produce**
1. 3 speculative concept ads for target brands (clearly labelled **Concept**) — one D2C, one fintech, one US UGC.
2. A 30-sec agency reel cut from the 4 films (for email and LinkedIn).
3. Hook library: 10 opening-2-second variations of one ad. Shows testing value.
4. Before/after: raw AI output vs final edit. Proves the human direction.
5. Hindi + English versions of one ad.

**Weekly targets**: 50 personalised emails/DMs, 5 free hook samples, 2 calls, 1 pilot.
