# Updating Renext website content

The site is static HTML. The homepage **Ads Creative** navigation item and the Ads Creative service card both open `ai-studio.html` inside the same website. The separate `chatgpt.site` portfolio URL is an owner-only review site and requires sign-in, so it is not the customer-facing navigation destination.

| What to update | File |
| --- | --- |
| Homepage headline, navigation, service cards, and homepage package copy | `index.html` |
| Ads Creative portfolio text, client-film labels, and contact form | `ai-studio.html` |
| Package names, USD prices, volumes, features, and inquiry labels | `assets/js/ads-creative-packages.js` |
| Portfolio theme, typography, mobile layouts | `assets/css/ads-creative-portfolio.css` |
| Film playback, full-film Drive links, and inquiry email recipient | `assets/js/ads-creative-portfolio.js` |
| Featured video clips and posters | `assets/media/` |
| Existing Renext R mark | `assets/images/logo-r.svg` |
| Shared Renext navigation styling on About, Services, Contact, SpendItWisely | `assets/css/styles.css` |

To change a featured video, replace its `.mp4` and `.jpg` files in `assets/media/`, or update both paths in `ai-studio.html` and the matching entry in `assets/js/ads-creative-portfolio.js`. Use only client work you are permitted to display. If a final isolated R logo is supplied, update `logo-r.svg` and the background sizing in both stylesheets; the current logo is the existing Renext vector asset.

To review locally, run `python -m http.server 8080` from the repository root, then open `http://localhost:8080/` and follow **Ads Creative**. Test the four film players, all four package tabs, package selection, mobile navigation, and the inquiry form. The inquiry prepares an email draft using `mailto:`; it does not submit to a server.

To apply these files to the private GitHub repository, copy the updated project into a review branch, compare the diff, and merge only after approval. The repository's GitHub Actions workflow publishes pushes to `main`, so keep review changes on a separate branch until the public update is approved.
