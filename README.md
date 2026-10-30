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

Without a configured public origin, builds are deliberately **noindex**, robots disallows indexing, and the sitemap uses `http://localhost:4321`. Set `SITE_URL` to the real HTTPS origin and `BASE_PATH` to the hosting path (`/` by default). Copy `.env.example` to `.env` for local configuration; `.env` is ignored by Git. `CF_PAGES_URL` is also supported for Cloudflare. The GitHub Actions workflow obtains the real origin and base path automatically from the repository's existing Pages settings.

## What is implemented

- Responsive editorial homepage with a working capture demo.
- Three guided lessons, 22 steps: suits and ranks; captures and sweeps; scoring and primiera.
- Real rules validation, explanatory feedback, Back/Next, lesson selection, restart, keyboard controls, completion screen, and **opt-in** browser-local progress.
- Complete rules, scoring reference with a computed 40-card example, regional card guide, About, and an explicitly marked privacy draft.
- Five substantial original articles through Astro Content Collections, with related reading and Article JSON-LD.
- All 40 original illustrated cards: four suits, Ace–7, Fante, Cavallo, Re. Shared SVG rendering for static pages and exercises; face-down, selected, highlighted, disabled, and button states.
- Unique metadata, configurable canonical and social URLs, local sharing artwork, sitemap, robots, 404, self-hosted fonts, and Cloudflare static response headers.
- Centralized Amazon affiliate recommendations using the owner's `learnscopa-20` tag; AdSense serving remains disabled.

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

`npm run verify` runs the check, unit tests, build, and browser suite in order. Playwright starts an Astro preview on strict port 4321 when needed. On Linux CI, install the browser's OS dependencies with `npx playwright install --with-deps chromium`. GitHub Actions runs these checks and deploys the verified artifact on pushes to `main`; pull requests run checks without publishing.

The browser suite completes all three lessons at mobile and desktop sizes, rejects an illegal sum, uses keyboard selection, verifies persistence/removal/restart and blocked/corrupt storage, checks internal links, paid-link disclosures and Amazon tags, confirms display ads stay disabled, scans WCAG A/AA rules with axe, and checks layouts at 320, 390, 768, and 1440 pixels. Screenshots and traces go into ignored `test-results/`; reports into `playwright-report/`. Automated scans supplement human keyboard, screen-reader, and device review; they are not a certification of accessibility.

## GitHub Pages deployment through Actions

The repository's Pages settings select **GitHub Actions** and publish to **https://learnscopa.com/** with HTTPS enforced. `.github/workflows/checks.yml` builds, verifies, uploads, and publishes the site. It can also be run manually using **Actions → Check and deploy Learn Scopa → Run workflow** on `main`.

The **learnscopa.com** custom-domain cutover is complete. [The custom-domain guide](CUSTOM_DOMAIN.md) records DNS and Pages settings. The workflow automatically reads the origin and root path; `www` and the former project address redirect to the apex domain.

The `verify` job reads `origin` and `base_path` from `actions/configure-pages`, sets `SITE_URL` and `BASE_PATH`, runs the production build and browser suite at that same path, and uploads `dist` as the Pages artifact. The `deploy` job requires those checks to pass, uses the `github-pages` environment, and grants only the Pages and OIDC permissions needed to publish. Pull requests do not upload or deploy a Pages artifact. No external hosting token is required.

All navigation, original static assets, Markdown article links, tutorial completion links, canonical/social metadata, and sitemap entries honor `BASE_PATH`. Local development and an optional Cloudflare deployment continue to work at `/`. Directory links have trailing slashes for static hosts.

To reproduce the project-path deployment locally in PowerShell:

```powershell
$env:SITE_URL = 'https://scottrobertson.net'
$env:BASE_PATH = '/learnscopa/'
npm run build:production
npm run test:e2e
npm run preview
```

Open [the local project preview](http://127.0.0.1:4321/learnscopa/). Clear those process environment variables for root-path development. If the Pages domain or repository path changes, the next Actions build reads the updated Pages settings automatically. Do not add a project `CNAME` that changes the account's existing domain.

GitHub Pages does not apply Cloudflare's `_headers` file. At the custom domain, this project's `robots.txt`, sitemap, and `ads.txt` are served at the domain root. When rehearsing a project-prefix deployment, its `/learnscopa/robots.txt` does not replace a shared host's root `/robots.txt`.

## Optional Cloudflare Pages deployment

This is an ordinary static Astro export. **No Cloudflare adapter, Worker, Functions, or database is required.**

1. Review the launch checklist below. The source is already in GitHub; connect the intended repository to Cloudflare if you choose this host.
2. In Cloudflare, open **Workers & Pages → Create application → Pages → Import an existing Git repository**. Connect the repository and choose the intended production branch.
3. Set the build command to `npm run build:production`, output directory to `dist`, and root directory to this repository's root. Set `NODE_VERSION` to `24`.
4. Set production `SITE_URL` to your actual public HTTPS origin, with no path, and `BASE_PATH` to `/`. If you do not yet have a custom domain, use the assigned Pages origin. Do not publish with the local fallback. `build:production` fails rather than accepting a missing HTTPS origin.
5. Configure preview environments separately. If previews should stay out of search, protect them using Cloudflare access settings or a deployment-specific noindex response rule; production metadata alone is not preview access control. Do not set production `SITE_URL` to a temporary preview address.
6. Deploy. Add the real custom domain in Pages if desired, then set `SITE_URL` to that final origin and rebuild.
7. Check the homepage, `/learn`, direct loads of article URLs, a missing URL, `/sitemap.xml`, `/robots.txt`, and `/images/social-card.png` on the deployed host. Verify canonicals and social images use the final origin and `_headers` took effect.

The installed dependency versions are pinned by `package-lock.json`. Cloudflare should use `npm ci`. See the [official Cloudflare Astro guide](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/) for current dashboard details. If you use a different CI build command, retain the public-origin guard.

## Amazon Associates

Affiliate links are enabled in `src/config/monetization.ts` with the owner-supplied **`learnscopa-20`** tracking ID. The `/cards/` guide links to two checked Amazon.com listings:

| Recommendation | ASIN | Listing checked |
| --- | --- | --- |
| Modiano Napoletane 97/25 | `B001KPU996` | October 30, 2026 |
| Modiano Sicilian Scopa playing cards | `B000FH6GZQ` | October 30, 2026 |

The title and Neapolitan card count were checked on the Amazon product pages; Modiano's [regional-card catalogue](https://www.modiano.it/en/products/regional-cards/) documents the 40-card Sicilian pattern. Recommendations use original explanatory text, without copied seller images, prices, ratings, reviews, or availability claims. We have not personally tested these decks. Recheck listing identities before changing the recommendations.

Each direct product URL includes `?tag=learnscopa-20`. **“Paid link. As an Amazon Associate I earn from qualifying purchases.”** appears beside each purchase button; the required Associates statement also appears in the footer. Links use `sponsored nofollow noopener` and disclose the new tab. Reading a recommendation makes no Amazon request; the implementation uses ordinary outbound links without widgets or tracking pixels. The privacy page describes the active links, while its operator/contact details still require owner completion.

Maintain the declared website in the owner's Associates account and follow [Amazon's program policies](https://affiliate-program.amazon.com/help/operating/policies) and [disclosure guidance](https://affiliate-program.amazon.com/help/node/topic/GPXFHVYZMTGPUMPE). Enrollment permits Special Links while application review is pending; final acceptance and commissions are controlled by Amazon. To replace a deck, verify the listing, set its genuine HTTPS `affiliateUrl` and accurate metadata, then rebuild and test. Setting `affiliate.enabled` to `false` removes the shopping links and disclosures. The optional `image` field supports `src`, `alt`, `width`, `height`, and a visible `licenseNote`; provide it only with suitable usage rights.

## AdSense: prepared, disabled

See [the account setup guide](ADSENSE_SETUP.md). `learnscopa.com` is added and ownership verified in AdSense; site review was requested on October 30, 2026 and showed **Getting ready**. Verification metadata and `ads.txt` are live at the custom domain's root. Google approval and the privacy/consent setup are still outstanding.

Verification can precede ad serving: the owner-supplied `ca-pub-2075641468239843` is configured with `verificationEnabled: true`. `enabled` and `consentApproved` remain false. This meta tag makes no advertising requests. `public/ads.txt` contains the matching seller record for the custom domain. An ID is not an approval.

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

- [ ] Confirm the Pages deployment URL; Actions supplies its origin and path automatically. Inspect canonical/sitemap/social URLs on the deployed host.
- [ ] Review `/privacy`: identify the actual operator and privacy contact, verify host settings and retention, and replace the draft label with approved policy wording. No contact is invented in source.
- [ ] Keep affiliate/ads disabled until genuine configuration and all required approvals/reviews exist.
- [ ] Run the verification suite; review mobile and desktop screenshots, keyboard operation, and a real device/screen reader.
- [ ] Confirm the Actions deployment succeeds, then perform the deployed-host checks. Cloudflare remains an optional alternative.
- [ ] Submit the real sitemap to search tools if desired. No ranking or traffic claims are made.

## Assets and content

SVG card motifs and sharing artwork are original source in this repository. `social-card.png` is a raster export of the editable SVG. Fonts are self-hosted from `@fontsource/cormorant-garamond` and `@fontsource/dm-sans`; their licenses ship with those packages. Do not replace assets with scans of commercial decks without permission. Article author credit is the project name; no personal biography or testimonials are fabricated.

See `NEXT_STEPS.md` for future work and `DEPLOYMENT_CHECKLIST.md` for the concise release gate.
