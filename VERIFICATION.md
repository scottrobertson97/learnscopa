# MVP verification

Verified locally on October 29–30, 2026, on Windows using Node 26.3.0. GitHub Actions uses Node 24 LTS. The live publication is GitHub Pages at `https://learnscopa.com/`, with HTTPS enforced. Cloudflare Pages remains an alternative.

| Check | Result |
| --- | --- |
| Astro / strict TypeScript check | Passed |
| Vitest | 31 tests passed, including independent AdSense verification and ad-serving gates |
| Astro static production build | Passed; 14 HTML pages, including the 404, plus sitemap/robots and local assets |
| Playwright / Chromium | 16 tests passed at `SITE_URL=https://learnscopa.com`, `BASE_PATH=/` for the affiliate release; the earlier 15-test suite also passed for the temporary `/learnscopa/` host |
| axe WCAG A/AA scan | No violations in the tested main pages and live capture exercise |
| Layout | All content routes fit 320, 390, 768, and 1440px viewports without horizontal scrolling |
| Tutorial | All 22 steps completed at 390px and 1280px; wrong answers rejected; Back, keyboard selection, restart, and completion verified |
| Local progress | Opt-in behavior, resume, deletion, corrupt data, and blocked storage verified |
| Content and navigation | All 13 content routes and their internal destination URLs returned 200; unique titles/descriptions; Article JSON-LD verified |
| Amazon affiliate links | Two checked deck listings on `/cards/`, both tagged `learnscopa-20`, with adjacent paid-link disclosures, footer disclosure, new-tab notice, and sponsored/nofollow/noopener attributes; no Amazon requests before following a shopping link; button labels checked against the surrounding background |
| Display advertising | No ad slots or advertising scripts in generated pages; AdSense serving remains disabled |
| AdSense verification | Supplied publisher ID appears in metadata; matching ads.txt record is present; no advertising requests are made |
| Configured-origin build | Canonical/social image URLs, 13 sitemap entries, assets, Markdown links, and active navigation verified with the actual Pages origin and `/learnscopa/` path |
| Public build guard | Correctly refuses to build publicly without a configured HTTPS origin |
| Dependencies | Install audit reported zero vulnerabilities |

Run `npm run verify` to reproduce the source check, unit tests, build, and browser suite. Install Chromium first with `npx playwright install chromium`. Browser artifacts live in ignored `test-results/` and `playwright-report/` directories; these are excluded from TypeScript checks.

The [original remote verification run](https://github.com/scottrobertson97/learnscopa/actions/runs/40988961655) passed. That workflow initially ran checks only. It now includes an artifact upload and a dependent GitHub Pages deployment job; the Actions environment records the publication result for each subsequent commit.

The [custom-domain deployment](https://github.com/scottrobertson97/learnscopa/actions/runs/41137276095) passed on its second attempt after HTTPS was enabled. Live checks confirmed root-path pages/assets, a tutorial capture, custom-domain canonical/social/sitemap URLs, the publisher meta tag, root ads.txt, and redirects from `www` and the former project URL.

On October 30, 2026, Google verified `learnscopa.com` ownership using the published meta tag and accepted the site-review request. The site detail status was **Getting ready**, with **Review requested**. Approval is pending. The matching root ads.txt was publicly accessible even though AdSense's initial separate crawl showed **Not found**.

On October 30, 2026, the Amazon product pages for Modiano Napoletane 97/25 (`B001KPU996`) and Modiano Sicilian Scopa playing cards (`B000FH6GZQ`) were checked in the browser. Amazon SiteStripe showed the owner's `learnscopa-20` store and tracking ID. The published links use the standard direct-product URL with that tag. Product images, prices, ratings, reviews, and availability are not copied into the site. Amazon attribution and earnings are controlled by Amazon and have not been established through a purchase.

The browser suite tests Chromium, not every browser engine. Automated accessibility scans do not replace a human screen-reader and real-device review. Live display advertising remains untested and disabled because site approval, ad slot IDs, the real consent integration, and privacy review are outstanding. The privacy page describes the active outbound affiliate links but remains explicitly an owner-review draft until operator/contact details and the owner's review are complete. See `ADSENSE_SETUP.md`, `CUSTOM_DOMAIN.md`, and `DEPLOYMENT_CHECKLIST.md` for the remaining owner actions.
