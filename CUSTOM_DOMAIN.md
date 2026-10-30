# Connect learnscopa.com

Target: **https://learnscopa.com/**, hosted from this repository with GitHub Pages. Until the domain is connected, the working site remains [scottrobertson.net/learnscopa/](https://scottrobertson.net/learnscopa/). The domain returned NXDOMAIN through a public DNS resolver when checked on October 30, 2026; this alone does not establish its registration status.

## DNS records

Once you own the domain, use your registrar or DNS provider to add these records. Preserve unrelated mail and verification records; replace conflicting parking/forwarding records for the web hostname.

| Type  | Name | Value                      |
| ----- | ---- | -------------------------- |
| A     | @    | 185.199.108.153            |
| A     | @    | 185.199.109.153            |
| A     | @    | 185.199.110.153            |
| A     | @    | 185.199.111.153            |
| CNAME | www  | scottrobertson97.github.io |

These are [GitHub's documented DNS values](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site). The `www` CNAME points to the account's Pages hostname, without `/learnscopa/`. If you use IPv6, configure all four AAAA values from that guide; otherwise do not leave an unrelated AAAA record directing IPv6 visitors to another server.

### Squarespace Domains

Open **Domains → learnscopa.com → DNS → DNS Settings**. Remove the **Squarespace Defaults** web-hosting preset if present, preserving mail and unrelated TXT records. Under **Custom Records**, choose **Add record** for each row in the table. Use `@` in the Name field for the four A records and `www` for the CNAME. Put the IP in **IP Address** or the hostname in **Data**, leave TTL at the default, and save each record. The CNAME value is only `scottrobertson97.github.io`, without a protocol or path. [Squarespace's web-hosting DNS guide](https://support.squarespace.com/hc/en-us/articles/31119879125645-DNS-records-for-web-hosting)

## Domain ownership and Pages settings

1. In your **GitHub account settings → Pages**, add `learnscopa.com` as a verified domain and create the exact DNS TXT challenge GitHub provides. No challenge token is invented or stored in this project. [GitHub's verification instructions](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages)
2. Coordinate the DNS change with **this repository → Settings → Pages → Custom domain**, entering `learnscopa.com`. This changes only Learn Scopa's Pages setting; no portfolio repository changes are needed. Complete both sides of the setup together, following GitHub's guide.
3. Allow GitHub to confirm DNS and issue the TLS certificate. Enable **Enforce HTTPS** when available. GitHub notes this control can take up to 24 hours to become available.
4. Run **Actions → Check and deploy Learn Scopa → Run workflow** on `main`. Changing the Pages setting does not by itself substitute for rebuilding the existing Astro artifact.

The workflow reads the real origin and base path from `actions/configure-pages`. With the custom domain configured, the site is built for `https://learnscopa.com` at `/`, including all navigation, Markdown links, scripts, fonts, canonical URLs, and sitemap entries. Before the change, it continues to build for the existing project URL. No hardcoded domain override or `CNAME` file is needed: GitHub ignores `CNAME` files for custom Actions deployments.

## Verify the live domain

- `https://learnscopa.com/` loads Learn Scopa with working styles and fonts.
- `/learn/` loads the tutorial and validates a capture.
- `/rules/`, `/articles/`, and a direct article URL load successfully.
- `/ads.txt` returns HTTP 200 and the supplied publisher's seller record.
- `/sitemap.xml`, canonical tags, and social image URLs use `learnscopa.com` without the old project prefix.
- The homepage HTML contains the verification meta tag for `ca-pub-2075641468239843`.
- An unknown route returns the custom 404 page.

## Local rehearsal

```powershell
$env:SITE_URL = 'https://learnscopa.com'
$env:BASE_PATH = '/'
npm run build:production
npm run test:e2e
```

These commands test the root-domain build locally; they do not register the domain or edit DNS. Once DNS and HTTPS are live, follow [the AdSense setup guide](ADSENSE_SETUP.md) to verify `learnscopa.com` and request review. Live ads remain disabled until approval, real slot IDs, the consent integration, and the privacy review are complete.
