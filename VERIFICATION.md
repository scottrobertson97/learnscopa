# MVP verification

Verified locally on October 29, 2026, on Windows using Node 26.3.0. GitHub Actions uses Node 24 LTS. The configured publication target is GitHub Pages at `https://scottrobertson.net/learnscopa/`; Cloudflare Pages remains an alternative.

| Check | Result |
| --- | --- |
| Astro / strict TypeScript check | Passed |
| Vitest | 28 tests passed |
| Astro static production build | Passed; 14 HTML pages, including the 404, plus sitemap/robots and local assets |
| Playwright / Chromium | 14 tests passed for root hosting and 14 for the `/learnscopa/` project build |
| axe WCAG A/AA scan | No violations in the tested main pages and live capture exercise |
| Layout | All content routes fit 320, 390, 768, and 1440px viewports without horizontal scrolling |
| Tutorial | All 22 steps completed at 390px and 1280px; wrong answers rejected; Back, keyboard selection, restart, and completion verified |
| Local progress | Opt-in behavior, resume, deletion, corrupt data, and blocked storage verified |
| Content and navigation | All 13 content routes and their internal destination URLs returned 200; unique titles/descriptions; Article JSON-LD verified |
| Monetization default | No active affiliate buttons, ad slots, or advertising scripts in generated pages |
| Configured-origin build | Canonical/social image URLs, 13 sitemap entries, assets, Markdown links, and active navigation verified with the actual Pages origin and `/learnscopa/` path |
| Public build guard | Correctly refuses to build publicly without a configured HTTPS origin |
| Dependencies | Install audit reported zero vulnerabilities |

Run `npm run verify` to reproduce the source check, unit tests, build, and browser suite. Install Chromium first with `npx playwright install chromium`. Browser artifacts live in ignored `test-results/` and `playwright-report/` directories; these are excluded from TypeScript checks.

The [original remote verification run](https://github.com/scottrobertson97/learnscopa/actions/runs/40988961655) passed. That workflow initially ran checks only. It now includes an artifact upload and a dependent GitHub Pages deployment job; the Actions environment records the publication result for each subsequent commit.

The browser suite tests Chromium, not every browser engine. Automated accessibility scans do not replace a human screen-reader and real-device review. Live advertising/affiliate behavior is untested because real accounts and approved configuration were not supplied. The privacy page remains explicitly an owner-review draft. See `DEPLOYMENT_CHECKLIST.md` and `README.md` for the remaining owner actions.
