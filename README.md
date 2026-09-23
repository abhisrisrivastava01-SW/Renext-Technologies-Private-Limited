# Renext Technologies Pvt. Ltd. & SpendItWisely

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Deployed-black?logo=vercel)](https://www.renexttechnologies.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Status: Operational](https://img.shields.io/badge/Status-Operational-10B981)](https://www.renexttechnologies.com/)

> **Official repository for the corporate website of Renext Technologies Pvt. Ltd. and its flagship startup initiative, SpendItWisely.**

---

## 🌐 Overview

**Renext Technologies Pvt. Ltd.** is an Indian technology company headquartered in Rudrapur, Uttarakhand. We operate at the intersection of enterprise software automation, AI engineering pipelines, and consumer financial intelligence.

### Key Pillars
- **Enterprise Engineering**: Account Payable (AP) straight-through processing, AI creative generation (100 ads/day), cloud FinOps cost governance, and high-precision computer vision / NLP data annotation.
- **SpendItWisely (Flagship Startup)**: An integrated consumer spending-awareness and kirana rewards ecosystem combining receipt scanning, automated tax record categorization, promotional SpendCoins, and local neighborhood kirana commerce.

---

## 🚀 Live Interactive Features

This repository includes custom interactive client-side simulators built with zero external framework overhead:

1. **Cloud FinOps ROI Calculator**: Live slider calculating projected cloud bill reductions (18–32% savings) and annualised P&L impact.
2. **AP 3-Way Match Simulator**: Instant line-item reconciliation between Purchase Orders (PO), Vendor Invoices, and Goods Receipt Notes (GRN).
3. **Interactive AI Annotation Canvas**: Real-time canvas tool supporting mouse and touch bounding box annotations with automatic multi-class labeling.
4. **SpendItWisely Phone Simulator**: Interactive smartphone mockup demonstrating the live spending dashboard, receipt vault, and SpendCoins redemption catalog.

---

## 📁 Repository Structure

```text
├── index.html                  # Main editorial portal (Studio + SpendItWisely + Demos)
├── services.html               # Deep dive into enterprise systems & technical specs
├── spenditwisely.html          # Dedicated flagship startup initiative portal
├── ai-studio.html              # Ads Creative portfolio, packages, and inquiry
├── about.html                  # Company background, vision, and core team facts
├── contact.html                # Direct inquiries, enterprise consultation, kirana sign-up
├── assets/
│   ├── css/
│   │   └── styles.css          # Design tokens, atmospheric radial layers, components
│   ├── js/
│   │   ├── main.js             # Nav controller and existing interactive utilities
│   │   ├── ads-creative-portfolio.js  # Featured films and package inquiry
│   │   └── ads-creative-packages.js   # Four package groups and tier data
│   ├── media/                  # Four short featured clips and their poster images
│   └── images/                 # SVG icons, logos, and verified application screens
├── components/                 # UI component definitions (shadcn compatible)
├── .github/
│   └── workflows/
│       └── deploy.yml          # Automated GitHub Pages CI/CD workflow
├── vercel.json                 # Vercel deployment headers & caching rules
├── sitemap.xml                 # SEO sitemap
├── robots.txt                  # Search engine crawler policies
├── package.json                # Project manifest & build scripts
└── README.md                   # Repository documentation
```

---

## 🛠️ Local Development

### Option 1: Python Built-in Server (Zero Install)
```bash
# Clone the repository
git clone https://github.com/your-username/renext-technologies.git
cd renext-technologies

# Start local server
python -m http.server 8080
```
Open [http://localhost:8080](http://localhost:8080) in your browser.

### Ads Creative page

Open [http://localhost:8080/ai-studio.html](http://localhost:8080/ai-studio.html) to view the creator portfolio. The four featured clips play silently on the page and open with sound when selected. The package categories are at `#packages`; selecting any of the 12 packages fills the inquiry on the same page at `#contact`. Submitting the inquiry opens a draft in the visitor's email app; this static website does not send or store form submissions. See [CONTENT_UPDATE_GUIDE.md](CONTENT_UPDATE_GUIDE.md) for the exact files to change when replacing text, pricing, videos, the logo, or contact details.

### Option 2: Node.js / npx serve
```bash
npx serve . -l 8080
```

---

## ☁️ Deployment

### Vercel (Recommended)
This repository is configured for 1-click zero-config deployment on Vercel:
1. Import this repository into your [Vercel Dashboard](https://vercel.com/new).
2. Framework Preset: **Other** (Static HTML).
3. Root Directory: `./`
4. Click **Deploy**. Headers and caching are automatically configured via `vercel.json`.

### GitHub Pages
A GitHub Actions workflow is included in `.github/workflows/deploy.yml`. 
1. In your GitHub repository, navigate to **Settings** > **Pages**.
2. Under **Build and deployment** > **Source**, select **GitHub Actions**.
3. Pushing to the `main` branch will automatically build and publish the site.

---

## 🏢 Corporate & Contact Details

- **Company**: Renext Technologies Pvt. Ltd.
- **Registered Office**: 1069, Ward No.-5, Khera, Rudrapur, Kichha, Udham Singh Nagar – 263153, Uttarakhand, India
- **Direct Line**: [+91 95484 92221](tel:+919548492221)
- **Official Email**: [info@renexttechnologies.com](mailto:info@renexttechnologies.com)
- **Official Domain**: [https://www.renexttechnologies.com](https://www.renexttechnologies.com)

---

## 📄 License

Distributed under the [MIT License](LICENSE).
Copyright © 2026 Renext Technologies Pvt. Ltd. All rights reserved.
