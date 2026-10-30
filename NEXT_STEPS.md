# Next steps

## Owner follow-up

- Connect the selected `learnscopa.com` domain using `CUSTOM_DOMAIN.md`, then verify the publisher tag and `/ads.txt` on that domain before requesting AdSense review. The workflow automatically builds for the Pages domain and base path.

- Confirm the GitHub Actions publication at `https://scottrobertson.net/learnscopa/`. The workflow reads the origin and project path from existing Pages settings.
- Review and approve the privacy draft, including operator identity, working privacy contact, and actual hosting practices.
- Use the README's optional Cloudflare instructions only if choosing a different host. No affiliate ID or publisher ID is supplied by this project.
- Perform a real-device and screen-reader review, then verify direct routes, metadata, response headers, and tutorial completion on the deployed host.
- Enable monetization only after obtaining the real accounts, checked product links, publisher approvals, and any required consent integration. See README.

## Full playable Scopa

Add a two-player local practice game with a transparent beginner bot as a separate project phase. Reuse the pure rules engine, legal move generation, deal state, scoring, and original card renderer. Build the match flow, 11-point score sheet, choice-of-capture UI, bot decision rules, and deterministic seeded replay tests before adding animation. Provide an explicit practice mode with explanations; do not put an opaque bot inside these guided lessons.

Extend tests to bot legality, complete match termination, interrupted-game recovery, and accessibility of the full table. Decide the product's approach to saved games separately from tutorial progress. Multiplayer, accounts, and backend hosting remain outside this MVP.

## More ways to learn

- Additional varied scenarios selected from deterministic pools, with worked explanations for each legal capture choice.
- An optional score calculator using the existing scoring functions, with duplicate-card checks and full-deck validation.
- A printable one-page rules and primiera reference.
- Human-reviewed feedback from new players and people familiar with different regional patterns.
- Audited screen-reader walkthroughs and touch-device testing as the lesson library expands.

## More Italian card games

Introduce Briscola only as a distinct, researched ruleset with its own game logic, scoring, lessons, and references. Share suit/rank models and visual components where appropriate. Do not apply Scopa capture rules or primiera to it. Consider Tressette or a separate Scopone guide after completing the next game's educational experience; avoid unused generalized engines now.

## Editorial and operational work

- Review regional terminology and examples with knowledgeable players, without making unsupported expertise claims.
- Add genuine contact details and a documented corrections process when an operator is identified.
- Revisit the five articles based on actual learner questions, not speculative search-performance claims.
- Monitor real Core Web Vitals after deployment if the owner chooses an appropriate privacy-reviewed measurement setup.
- Schedule dependency checks through the repository's chosen maintenance process. Review licenses before new imagery or fonts are added.
