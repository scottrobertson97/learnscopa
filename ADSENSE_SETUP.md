# AdSense setup for Learn Scopa

AdSense site: **[learnscopa.com](https://learnscopa.com/)**, live on GitHub Pages with HTTPS enforced. The owner supplied publisher ID `pub-2075641468239843`; the HTML account ID is `ca-pub-2075641468239843`. Verification metadata and the root `ads.txt` are live. Ads remain disabled while Google's review and the privacy/consent setup are outstanding.

## Account progress — October 30, 2026

- Added `learnscopa.com` to the owner's AdSense Sites list.
- Google verified ownership using the published HTML meta tag.
- Submitted the site for review. The site detail page showed **Getting ready** and **Review requested**; this is not approval.
- `https://learnscopa.com/ads.txt` returns HTTP 200 with the matching seller record. AdSense initially showed **Not found** while its separate ads.txt crawl was pending; do not remove or replace the valid file on that basis.
- Ad units, a real CMP, and the operator/privacy contact still need to be completed before enabling ad requests.
- The Ads page remained on its loading indicator and Privacy & messaging remained blank, including after a reload of each. No ad units or CMP messages were created during this setup session. Retry these account pages when Google's interface recovers; do not invent slot IDs or mark consent integration complete.

## 1. Connect the custom domain

The domain, GitHub Pages setting, HTTPS certificate, and root-path rebuild are complete; [CUSTOM_DOMAIN.md](CUSTOM_DOMAIN.md) retains the setup instructions. **learnscopa.com** is now in [AdSense](https://adsense.google.com/) under Sites. Google requires a domain without a directory path. Complete any remaining account/profile steps in your own dashboard. [Google's site URL requirements](https://support.google.com/adsense/answer/2784438)

The supplied public publisher ID is configured in source. Complete any outstanding account steps in your own AdSense dashboard; account ownership and a publisher ID are not site approval.

## 2. Verify without serving ads

Choose Google's **meta tag** verification method when available. Set `adsense.publisherId` to the supplied ID and `adsense.verificationEnabled` to `true` in `src/config/monetization.ts`. Leave `enabled` and `consentApproved` false. A valid ID then renders `google-adsense-account` metadata in the HTML; this tag loads no advertising script and makes no ad requests. [Google's connection methods](https://support.google.com/adsense/answer/7584263)

Those verification-only settings are configured for the supplied ID, published on the custom domain, and successfully verified by Google.

Use Google's actual verification result as the authority. The portfolio repository and `scottrobertson.net` root site do not need this project's publisher tag or seller record.

## 3. Put ads.txt at the domain root

The configured record in `public/ads.txt` is `google.com, pub-2075641468239843, DIRECT, f08c47fec0942fa0`. It matches the account and **https://learnscopa.com/ads.txt** returns HTTP 200. Keep this root URL accessible for Google's crawler. [Google's ads.txt guide](https://support.google.com/adsense/answer/12171612)

## 4. Prepare the privacy and consent setup

Supply the real site-operator identity and public privacy/contact email, then review the existing privacy draft for the actual deployment. Configure a real CMP in AdSense **Privacy & messaging** or select an appropriate certified provider. Google requires a certified, TCF-integrated CMP for personalized ads served to users in the EEA, UK, and Switzerland. Select applicable US privacy settings as well; do not treat one static flag as a visitor's consent. [Google's CMP requirements](https://support.google.com/adsense/answer/13554116), [Privacy & messaging](https://support.google.com/adsense/answer/10924669)

## 5. Request review, then enable placements

Publish the verification changes, use **Verify** and **Request review** in AdSense, and check Google's site status. Verification is not approval. The account may require additional steps or content review. [Google's site connection process](https://support.google.com/adsense/answer/7584263)

After approval and the real consent integration are ready, create responsive display ad units and provide their slot IDs. The existing manual placements are at article ends and the end of the rules guide. Keep Auto ads off unless its placement controls and exclusions are explicitly configured and checked, so it cannot insert ads into lessons. Set the release gates only after testing the chosen CMP's per-visitor behavior, withdrawal controls, ad loading, mobile layout, and privacy text. No ads are placed in interactive exercises by this project.

Run `npm run verify` with the new configuration, then deploy through the existing Actions workflow and check the actual published pages. Google controls approval and ad serving; this implementation does not promise either approval or earnings.
