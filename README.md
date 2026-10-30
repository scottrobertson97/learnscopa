# Learn Scopa

A static, English-language introduction to the traditional Italian card game. Built with Astro, strict TypeScript, original SVG playing cards, and browser-only interactive lessons. No React, accounts, database, or paid runtime service.

## Run locally

Use Node 24 LTS (or a compatible Node version listed in `package.json`) and npm.

```powershell
npm ci
npm run dev
```

Open the URL Astro prints. To inspect the production output:

```powershell
npm run build
npm run preview
```

Without a configured public origin, builds are deliberately **noindex**, robots disallows indexing, and the sitemap uses `http://localhost:4321`. No production domain is invented. Set `SITE_URL` to the real HTTPS origin before a public launch. Copy `.env.example` to `.env` for local configuration; `.env` is ignored by Git. `CF_PAGES_URL` is also supported when Cloudflare supplies the actual deployment URL. An explicit `SITE_URL` takes precedence.

## What is implemented

- Responsive editorial homepage with a working capture demo.
- Three guided lessons, 22 steps: suits and ranks; captures and sweeps; scoring and primiera.
- Real rules validation, explanatory feedback, Back/Next, lesson selection, restart, keyboard controls, completion screen, and **opt-in** browser-local progress.
- Complete rules, scoring reference with a computed 40-card example, regional card guide, About, and an explicitly marked privacy draft.
- Five substantial original articles through Astro Content Collections, with related reading and Article JSON-LD.
- All 40 original illustrated cards: four suits, Ace–7, Fante, Cavallo, Re. Shared SVG rendering for static pages and exercises; face-down, selected, highlighted, disabled, and button states.
- Unique metadata, configurable canonical and social URLs, local sharing artwork, sitemap, robots, 404, self-hosted fonts, and Cloudflare static response headers.
- Centralized, disabled-by-default affiliate and AdSense integration points.

## Architecture

```text
src/lib/scopa/            Pure deck, capture, move, deal, and scoring modules
src/lib/tutorial/        Declarative lessons, validation, progress parsing, DOM controller
src/components/cards/    Original vector motifs and reusable Astro card component
src/components/tutorial/ Lesson mount surface
src/components/monetization/  Recommendation and ad-slot components
src/content/articles/    Original Markdown articles
src/content.config.ts    Typed article schema and glob loader
src/layouts/             Shared shell and handbook layout
src/pages/               Static pages, article routes, sitemap and robots endpoints
src/config/              Site identity, navigation, monetization
src/styles/global.css    Tokens, components, responsive and motion rules
tests/unit/              Rules, deal conservation, tutorial scenario and storage tests
tests/e2e/               Browser journey, accessibility, routes and viewport tests
```

Game logic has no DOM, Astro, or storage dependency. `legalCaptures` returns table-card groups; exact single matches exclude sums. `play` is immutable, validates mandatory capture, deals new hands, excludes a final-play sweep, and awards leftovers to the last capturer. `deal` rejects a three/four-king opening; `newDeal` shuffles and retries such openings. Each transition conserves cards. A full playable match UI is intentionally outside this release.

Primiera returns `null` when a suit is missing. Scoring compares the best four-suit values and awards no tied category point. `matchWinner` evaluates totals after a deal, with 11 as the default target and further play for tied leaders. These rules follow the requested standard two-player reference. Ace-takes-all, napola, and other regional additions are **not** silently mixed in. Reference: [Pagat](https://www.pagat.com/fishing/scopa.html).

Each tutorial step declares its ID, explanation, initial cards or choices, expected interaction, answer criteria, feedback, and completion action. Capture validation calls the real engine. The complete worked deal in `scenarios.ts` is a disjoint partition of all 40 cards, shared by the scoring guide and lesson. It yields 6–1, with primiera totals 81–69.

Progress uses `learn-scopa-progress-v1` only after visitors enable saving. Parsing filters obsolete IDs, clamps indices, and recomputes completion. Storage access is guarded so blocked storage cannot disable lessons. Unchecking saving deletes the stored record; restart replaces it with an empty record when saving is on. No lesson data is transmitted.

## Verification

```powershell
npm run check
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

`npm run verify` runs the check, unit tests, build, and browser suite in order. Playwright starts an Astro preview on strict port 4321 when needed. On Linux CI, install the browser's OS dependencies with `npx playwright install --with-deps chromium`. A GitHub Actions check is included; it does not deploy or push code.

The browser suite completes all three lessons at mobile and desktop sizes, rejects an illegal sum, uses keyboard selection, verifies persistence/removal/restart and blocked/corrupt storage, checks internal links and inactive monetization, scans WCAG A/AA rules with axe, and checks layouts at 320, 390, 768, and 1440 pixels. Screenshots and traces go into ignored `test-results/`; reports into `playwright-report/`. Automated scans supplement human keyboard, screen-reader, and device review; they are not a certification of accessibility.

## Deploy to Cloudflare Pages

This is an ordinary static Astro export. **No Cloudflare adapter, Worker, Functions, or database is required.**

1. Review the launch checklist below, then commit/push this source to the intended GitHub repository. This implementation does not commit or push on your behalf.
2. In Cloudflare, open **Workers & Pages → Create application → Pages → Import an existing Git repository**. Connect the repository and choose the intended production branch.
3. Set the build command to `npm run build:production`, output directory to `dist`, and root directory to this repository's root. Set `NODE_VERSION` to `24`.
4. Set production `SITE_URL` to your actual public HTTPS origin, with no path. If you do not yet have a custom domain, use the assigned Pages origin. Do not publish with the local fallback. `build:production` fails rather than accepting a missing HTTPS origin.
5. Configure preview environments separately. If previews should stay out of search, protect them using Cloudflare access settings or a deployment-specific noindex response rule; production metadata alone is not preview access control. Do not set production `SITE_URL` to a temporary preview address.
6. Deploy. Add the real custom domain in Pages if desired, then set `SITE_URL` to that final origin and rebuild.
7. Check the homepage, `/learn`, direct loads of article URLs, a missing URL, `/sitemap.xml`, `/robots.txt`, and `/images/social-card.png` on the deployed host. Verify canonicals and social images use the final origin and `_headers` took effect.

The installed dependency versions are pinned by `package-lock.json`. Cloudflare should use `npm ci`. See the [official Cloudflare Astro guide](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/) for current dashboard details. If you use a different CI build command, retain the public-origin guard.

## Amazon Associates: activation

Edit `src/config/monetization.ts`. Recommendations start as **deck categories**, with original buying advice, not unverified product endorsements. No fake buttons, IDs, images, prices, ratings, or availability claims are rendered.

1. Obtain your own approved Amazon Associates account and verified product URLs.
2. Replace each category with accurate, checked product metadata; set its `affiliateUrl` to your genuine HTTPS affiliate link. The helper accepts Amazon marketplace hosts and `amzn.to`, rejects unrelated domains, and renders nothing if the URL is missing or invalid.
3. Set `affiliate.enabled` to `true` and rebuild. The required statement, **“As an Amazon Associate I earn from qualifying purchases.”**, then appears adjacent to each configured purchase link and in the footer. Links use `sponsored nofollow noopener` and disclose the new tab.
4. Review current program requirements and the wording on every linked recommendation. Update `/privacy` for the resulting behavior. No product information is fetched or scraped from Amazon.

The owner must supply the real account and links. This source does not fabricate either. The optional `image` field supports `src`, `alt`, `width`, `height`, and a visible `licenseNote`; provide it only with suitable usage rights. The initial recommendations use text rather than unlicensed product images.

## AdSense: prepared, disabled

`adsense.enabled`, a valid `ca-pub-` ID, `consentApproved`, and a real slot ID are **all** required to render an ad. By default there is no ad script, request, empty reserved ad area, or consent banner. The existing placements are `rules-end` and `article-end`, outside exercises. Enabled areas reserve 280px to reduce layout shift; real ad behavior still needs host/device testing.

Before enabling:

1. Obtain the publisher's real account/site approval and real ad slot IDs. Check current [AdSense setup guidance](https://support.google.com/adsense/answer/7037624).
2. Choose and integrate an actual consent-management platform appropriate for your audience and Google's current consent requirements. Where required, use a Google-certified CMP. This project does **not** implement a CMP. Keep ad scripts blocked until that CMP permits them; adapt the loader in `BaseLayout.astro` and queue in `AdSlot.astro` to the CMP's documented behavior. The configuration flag is a release gate, not a substitute for per-visitor consent.
3. Review provider data practices and update the privacy policy and any required controls/disclosures. Do not claim legal compliance solely because a banner exists.
4. Create `public/ads.txt` with the exact seller record supplied by your AdSense account; do not invent a publisher record.
5. Fill `publisherId` and placement slot IDs in the central config. Only after the integration and approvals are verified, set `consentApproved` and `enabled` to `true`, rebuild, and test in the approved environment.
6. Check ad labeling, responsive sizes, consent withdrawal, layout shifts, request timing, and that no ads appear inside lessons. Adjust reserved heights to the actual formats.

For current requirements, use [Google's European regulations documentation](https://support.google.com/adsense/answer/7670013) and your account's policy notices. Owner/provider review remains necessary.

## Public-launch checklist

- [ ] Supply the real domain or Pages origin; run `npm run build:production` and inspect canonical/sitemap/social URLs.
- [ ] Review `/privacy`: identify the actual operator and privacy contact, verify host settings and retention, and replace the draft label with approved policy wording. No contact is invented in source.
- [ ] Keep affiliate/ads disabled until genuine configuration and all required approvals/reviews exist.
- [ ] Run the verification suite; review mobile and desktop screenshots, keyboard operation, and a real device/screen reader.
- [ ] Deploy through the owner's authenticated Cloudflare/GitHub accounts and perform the deployed-host checks.
- [ ] Submit the real sitemap to search tools if desired. No ranking or traffic claims are made.

## Assets and content

SVG card motifs and sharing artwork are original source in this repository. `social-card.png` is a raster export of the editable SVG. Fonts are self-hosted from `@fontsource/cormorant-garamond` and `@fontsource/dm-sans`; their licenses ship with those packages. Do not replace assets with scans of commercial decks without permission. Article author credit is the project name; no personal biography or testimonials are fabricated.

See `NEXT_STEPS.md` for future work and `DEPLOYMENT_CHECKLIST.md` for the concise release gate.
