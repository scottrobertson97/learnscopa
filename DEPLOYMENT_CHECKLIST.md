# Cloudflare Pages release checklist

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
| Server adapter / database | None                                            |

## Release gate

- [ ] Public origin supplied; no local fallback in deployed sitemap/canonicals.
- [ ] Privacy policy reviewed; operator and contact supplied; draft clearly resolved by owner.
- [ ] Affiliate/ads still disabled unless real credentials, links, approvals, and required consent integration are ready.
- [ ] `npm run check`, `npm test`, `npm run build:production`, and `npm run test:e2e` pass.
- [ ] Mobile/desktop layouts, keyboard interactions, and a real-device/screen-reader pass reviewed.
- [ ] Source pushed to the intended remote by the owner; Pages linked to the correct branch.
- [ ] Production routes, 404, sitemap, robots, social artwork, and `_headers` checked on the actual deployed host.
- [ ] Preview environments protected or marked noindex independently.

Public deployment is an owner action requiring the owner's Cloudflare/GitHub authentication. See README for the exact setup and monetization steps.
