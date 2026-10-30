# MVP verification

Verified locally on October 29, 2026, on Windows using Node 26.3.0. The documented production target is Node 24 LTS on Cloudflare Pages.

| Check | Result |
| --- | --- |
| Astro / strict TypeScript check | Passed |
| Vitest | 25 tests passed |
| Astro static production build | Passed; 14 HTML pages, including the 404, plus sitemap/robots and local assets |
| Playwright / Chromium | 13 tests passed |
| axe WCAG A/AA scan | No violations in the tested main pages and live capture exercise |
| Layout | All content routes fit 320, 390, 768, and 1440px viewports without horizontal scrolling |
| Tutorial | All 22 steps completed at 390px and 1280px; wrong answers rejected; Back, keyboard selection, restart, and completion verified |
| Local progress | Opt-in behavior, resume, deletion, corrupt data, and blocked storage verified |
| Content and navigation | All 13 content routes and their internal destination URLs returned 200; unique titles/descriptions; Article JSON-LD verified |
| Monetization default | No active affiliate buttons, ad slots, or advertising scripts in generated pages |
| Configured-origin build | Canonical and social image URLs, 13 sitemap entries, and robots verified with the real local preview origin as a test configuration |
| Public build guard | Correctly refuses to build publicly without a configured HTTPS origin |
| Dependencies | Install audit reported zero vulnerabilities |

Run `npm run verify` to reproduce the source check, unit tests, build, and browser suite. Install Chromium first with `npx playwright install chromium`. Browser artifacts live in ignored `test-results/` and `playwright-report/` directories; these are excluded from TypeScript checks.

The browser suite tests Chromium, not every browser engine. Automated accessibility scans do not replace a human screen-reader and real-device review. The site has not been deployed, the remote GitHub Actions job has not been run, and live advertising/affiliate behavior has not been tested because real accounts and approved configuration were not supplied. The privacy page is explicitly an owner-review draft. See `DEPLOYMENT_CHECKLIST.md` and `README.md` for the remaining owner actions.
