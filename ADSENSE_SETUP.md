# AdSense setup for Learn Scopa

Target AdSense site: **learnscopa.com**. The current temporary hosting is [scottrobertson.net/learnscopa/](https://scottrobertson.net/learnscopa/). The owner supplied publisher ID `pub-2075641468239843`; the HTML account ID is `ca-pub-2075641468239843`. Verification metadata is enabled and `public/ads.txt` contains the seller record. Live ads and the consent integration remain disabled; Google's approval is still required.

## 1. Connect the custom domain

Follow [CUSTOM_DOMAIN.md](CUSTOM_DOMAIN.md) to connect the domain, configure GitHub Pages, provision HTTPS, and rebuild at `/`. In your own [AdSense dashboard](https://adsense.google.com/), add **learnscopa.com** under Sites. Google requires a domain without a directory path, so use the custom domain rather than the temporary `/learnscopa/` address. Complete any remaining account/profile steps in your own dashboard. [Google's site URL requirements](https://support.google.com/adsense/answer/2784438)

The supplied public publisher ID is configured in source. Complete any outstanding account steps in your own AdSense dashboard; account ownership and a publisher ID are not site approval.

## 2. Verify without serving ads

Choose Google's **meta tag** verification method when available. Set `adsense.publisherId` to the supplied ID and `adsense.verificationEnabled` to `true` in `src/config/monetization.ts`. Leave `enabled` and `consentApproved` false. A valid ID then renders `google-adsense-account` metadata in the HTML; this tag loads no advertising script and makes no ad requests. [Google's connection methods](https://support.google.com/adsense/answer/7584263)

Those verification-only settings are now configured for the supplied ID. This repository will serve the meta tag and seller record at the custom domain's root after the domain is connected and the site rebuilt.

Use Google's actual verification result as the authority. The portfolio repository and `scottrobertson.net` root site do not need this project's publisher tag or seller record.

## 3. Put ads.txt at the domain root

The configured record in `public/ads.txt` is `google.com, pub-2075641468239843, DIRECT, f08c47fec0942fa0`. Confirm it matches your AdSense dashboard and that **https://learnscopa.com/ads.txt** returns HTTP 200 after the custom domain is live. Until then, the artifact appears at `/learnscopa/ads.txt` on the temporary host; that location does not establish root-domain ads.txt for `learnscopa.com`. [Google's ads.txt guide](https://support.google.com/adsense/answer/12171612)

## 4. Prepare the privacy and consent setup

Supply the real site-operator identity and public privacy/contact email, then review the existing privacy draft for the actual deployment. Configure a real CMP in AdSense **Privacy & messaging** or select an appropriate certified provider. Google requires a certified, TCF-integrated CMP for personalized ads served to users in the EEA, UK, and Switzerland. Select applicable US privacy settings as well; do not treat one static flag as a visitor's consent. [Google's CMP requirements](https://support.google.com/adsense/answer/13554116), [Privacy & messaging](https://support.google.com/adsense/answer/10924669)

## 5. Request review, then enable placements

Publish the verification changes, use **Verify** and **Request review** in AdSense, and check Google's site status. Verification is not approval. The account may require additional steps or content review. [Google's site connection process](https://support.google.com/adsense/answer/7584263)

After approval and the real consent integration are ready, create responsive display ad units and provide their slot IDs. The existing manual placements are at article ends and the end of the rules guide. Keep Auto ads off unless its placement controls and exclusions are explicitly configured and checked, so it cannot insert ads into lessons. Set the release gates only after testing the chosen CMP's per-visitor behavior, withdrawal controls, ad loading, mobile layout, and privacy text. No ads are placed in interactive exercises by this project.

Run `npm run verify` with the new configuration, then deploy through the existing Actions workflow and check the actual published pages. Google controls approval and ad serving; this implementation does not promise either approval or earnings.
