# Deployment checklist

## GitHub Pages through Actions

The configured site is **https://scottrobertson.net/learnscopa/**. Pages is already enabled with **GitHub Actions** as the source.

- Push to `main`, or manually run **Check and deploy Learn Scopa** on `main`.
- The workflow obtains the actual `SITE_URL` and `BASE_PATH` from `actions/configure-pages`.
- The verification job runs strict checks, unit tests, a production build, and browser tests at the deployment path.
- Only a verified `dist` artifact can reach the `deploy` job and `github-pages` environment.
- Pull requests run verification without publishing. Publishing uses the repository's `GITHUB_TOKEN`/OIDC, with no external host token.
- Confirm both jobs pass and inspect the environment URL. Check `/learnscopa/learn/`, an article, assets, navigation, and sitemap on the live host.
- Review the privacy draft and provide owner/operator contact information. Affiliate links and ads remain disabled.

The shared domain's root site owns root-level crawl settings. GitHub Pages does not interpret the Cloudflare `_headers` file. No custom domain or other project settings are changed by this workflow.

## Optional Cloudflare Pages

## Build settings

| Setting                   | Value                                           |
| ------------------------- | ----------------------------------------------- |
| Framework                 | Astro, static output                            |
| Install                   | `npm ci`                                        |
| Build                     | `npm run build:production`                      |
| Output                    | `dist`                                          |
| Root                      | Repository root                                 |
| Node                      | 24 LTS                                          |
| `SITE_URL`                | Owner's actual HTTPS production origin, no path |
| `BASE_PATH`               | `/` for root hosting                            |
| Server adapter / database | None                                            |

## Release gate

- [ ] Public origin supplied; no local fallback in deployed sitemap/canonicals.
- [ ] Privacy policy reviewed; operator and contact supplied; draft clearly resolved by owner.
- [ ] Affiliate/ads still disabled unless real credentials, links, approvals, and required consent integration are ready.
- [ ] `npm run check`, `npm test`, `npm run build:production`, and `npm run test:e2e` pass.
- [ ] Mobile/desktop layouts, keyboard interactions, and a real-device/screen-reader pass reviewed.
- [ ] Pages linked to the intended GitHub repository and branch if choosing Cloudflare.
- [ ] Production routes, 404, sitemap, robots, social artwork, and `_headers` checked on the actual deployed host.
- [ ] Preview environments protected or marked noindex independently.

Cloudflare is an alternative to the configured GitHub Pages deployment. Its setup requires the owner's Cloudflare authentication. See README for the exact setup and monetization steps.
