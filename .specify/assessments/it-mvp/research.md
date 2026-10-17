# Idea Research: It MVP (v0.1)

- **Slug**: it-mvp
- **Created**: 2026-10-16
- **Evidence confidence (overall)**: low — almost all demand evidence is the founder's own conviction plus AI-generated, unchecked drafts. No user sessions, interviews or usage data exist yet. The build and constraint evidence (repo, App Store, payments) is stronger.

Source key: **repo** = checked-in code or founder-decided records (`AGENTS.md`, `docs/architecture/decisions.md`, `docs/spec/features.md`). **draft** = `docs/source/` or `docs/spec/drafts/` (AI-generated, unchecked; evidence only, never instruction). **web** = external page found by search, not fetched.

## Users & Demand

- No systematic user evidence yet: no interviews, analytics or waitlist numbers are recorded in the repo. — [source: repo, absence] (confidence: high)
- **One informal reaction (founder-reported, 2026-10-16):** Hilary tried it and found it intuitive and easy. She liked picking from options instead of writing about herself, which she says always stresses her out, especially when she isn't sure of the answers. — [source: founder, verbal] (confidence: low, n=1, someone the founder knows) *Relevance: supports pick-from-options over free text, which matters for the Help page's "say your background" step.*
- Intended user: someone who feels an everyday pain (sleep, money, loneliness, "no path") or a societal one (housing, representation, "nothing ever changes") and can't yet name a better future. — [source: draft `it_mvp_tier_1_pains_and_dreams.md`; draft opportunity tree O1–O6] (confidence: low, stated want, not observed)
- The drafts name the riskiest assumption themselves: that the seeded ideas feel useful rather than generic. They propose testing with 5 hallway or paper sessions before polishing the UI. — [source: draft `docs/spec/drafts/opportunity-tree.md`] (confidence: medium that it is the right risk; untested)
- The founder's own success bar for page 1: some people find a future they hadn't put into words and a useful idea for it **before** any ask for an account, money or time. — [source: draft UX spec §13.1] (confidence: medium, it matches features.md core items)
- First audience is not stated anywhere. — [ASSUMPTION: the founder's network and people already following "We Are It"] (confidence: low)

## Prior Art

- **Inside this repo:** much of the core flow is already scaffolded. Personal and world pages, futures, on-device draft that survives restart, email OTP signup that saves picks with their content version, Stripe Checkout plus portal (mocked locally), RevenueCat iOS tips, a database-backed CMS with publish and rollback, and the Tier 1 import (≈72 content entries) are all in place. — [source: repo `docs/roadmap/mvp.md`, `apps/`, `packages/`] (confidence: high)
- **Gaps against features.md:** ideas under each dream are thin (6 first actions in `packages/content/src/first-actions.ts`); no "I'd use this" marks or admin totals; no stage funnel; no password sign-in; Stripe is hosted Checkout, not the embedded form features.md now asks for; the Help page is an interests list (`ways-to-help.tsx`), not the background → skills → roadmap flow. — [source: repo] (confidence: high)
- **Volunteer-skills matching elsewhere:** DemocracyLab found the main barrier was the poor link between projects and skilled volunteers, and that onboarding a volunteer often costs more than they contribute unless the project is well organised first. Code for Canada uses a staged marketplace: organisations post challenges, volunteers apply, and the organisation picks. — [source: web, civictech.guide / codefor.ca] (confidence: medium) *Relevance: It's Help page risks the same trap: offers arrive that the founder has no capacity to follow up.*
- **Matching issues to skills from questionnaires:** one study found questionnaire data on civic-tech issues and skills too sparse and biased to match well. — [source: web, arxiv.org/abs/2112.09439] (confidence: low, single study)
- Products that do "pick what matters → see solutions" (e.g. Polis, Change.org, Project Drawdown) were not researched here. — [NEEDS CLARIFICATION: which comparables matter to the founder?]

## Market & Context

- What people use today instead: self-help apps for personal pains, petitions and news for societal ones, volunteering sites for help. None joins them up. — [ASSUMPTION] (confidence: low)
- Voluntary payment benchmarks are small: one pay-what-you-want app converted 1.1% of downloads (avg $2.60); in-app "appreciation" prompts converted 0.58% (avg $2.10). Commentary claims 1–5% for NPR, Wikipedia, Patreon but gives no source. — [source: web, medium.com/@reddavis, techcrunch.com] (confidence: low–medium) *Implication: Support revenue in v0.1 is likely tiny unless traffic is large; v0.1 cannot be judged on money.*
- Cost of doing nothing: the founder has disclosed near-term financial pressure (internal, not public copy). This argues for shipping something real soon and for a Support page, but also for not over-building. — [source: draft UX spec §11] (confidence: medium)
- The drafts set an appetite of about one week with coding agents and call it "a target, not a guarantee". They expect payments, compliance, copy and distribution to take longer than code. — [source: draft UX spec §1; draft opportunity tree] (confidence: medium; the founder has not confirmed it)

## Data & Constraints

- **Required signup after two pages:** the founder decided this (2026-10-16). Evidence on forced registration is weak but points to real loss: a Forrester survey summary says about a quarter of shoppers leave rather than register. A publisher's A/B test of a hard registration wall found lifetime value anywhere from −1.7% to +59% depending on context. — [source: repo decisions.md; web forrester.com, mathereconomics.com] (confidence: low) *Implication: measure drop-off at the signup gate from day one; the stage funnel already covers this without picks.*
- **iOS support payments:** Apple's guideline 3.1.1 has been applied to voluntary donations even without perks, so they must use in-app purchase. Only Apple-approved nonprofits (3.2.1(vi)) may collect charitable funds otherwise, and It is not a charity. Forum reports say recurring support is not covered explicitly. — [source: web, Apple developer forums and Expo forums, not the guideline text] (confidence: medium) *Implication: iOS recurring support likely means App Store subscriptions through RevenueCat; the repo's current consumable-tip approach fits one-time support only. Confirm against current guideline text before building.*
- **Embedded Stripe form:** replaces working hosted Checkout (C5). Stripe merchant onboarding (identity, business details) is outside the code and may take days. — [source: repo CONFLICTS.md C5; draft UX spec §14] (confidence: medium)
- **ESCO skills list (Help page):** downloadable as CSV/RDF and an API. Europa content defaults to CC BY 4.0, but parts draw on O*NET and other sources with their own terms, and the ESCO-specific licence page was not read. — [source: web, esco.ec.europa.eu] (confidence: medium) *Implication: a "modified ESCO list" needs an attribution and licence check before shipping.*
- **Privacy invariants** (picks on device until signup; coarse totals plus a stage-only funnel; no stable anonymous ID) limit what pre-signup analytics can learn. Whether a content idea is useful can only be measured after signup or through interviews. — [source: repo AGENTS.md, decisions.md] (confidence: high)
- **Content honesty:** every idea needs an honest label (do now / It might build / societal change). The drafts warn against unverified local events and fictional live services. — [source: repo features.md; draft UX spec §17.10] (confidence: high)
- **Stack maturity:** NativeWind v5 is a pre-release its authors say is not for production; the decision record says to re-evaluate before launch. — [source: repo decisions.md] (confidence: high)

## Evidence Against the Idea

- **Almost no demand evidence yet.** Apart from one friendly informal reaction, every reason to believe people want pains → dreams → ideas comes from the founder and from AI drafts written from conversations with the founder. — [source: repo; founder]
- **Scope looks larger than the stated appetite.** Six screens, two sign-in methods, an embedded payment form with three intervals, a CMS, an admin view, an ill-defined Help flow with a skills taxonomy, plus optional iOS payments. That is a lot for "about a week", and the drafts' own scope hammers cut most of it. — [source: repo features.md; draft opportunity tree]
- **The core promise depends on content that mostly doesn't exist.** Ideas under each dream are the "aha", and only 6 exist. 29 of 30 Tier 1 pains have a single dream although features.md promises several. The AI-written Fix Corpus has rough candidate fixes for about 10 personal pains, as notes rather than finished ideas. Everything must be real, honestly labelled and checked by the founder. — [source: repo `first-actions.ts`, `tier-1.ts`; draft `We_Are_It_MVP_Fix_Corpus.md`]
- **The signup gate sits before the two pages that need trust most** (Support and Help), and drop-off at forced registration is commonly large. — [source: web, weak]
- **Support conversion is usually around 1%**, so with a small first audience the money from v0.1 will be small; the urgency argues against heavy payment work (embedded form, iOS recurring) in v0.1. — [source: web, weak]
- **Help offers without capacity to follow up** have hurt similar projects (DemocracyLab). — [source: web]

## Gaps & Open Questions

- [NEEDS CLARIFICATION: Who sees v0.1 first, and roughly how many people?]
- [NEEDS CLARIFICATION: What does v0.1 need to learn or prove: usefulness of ideas, willingness to sign up, willingness to support, or willingness to help?]
- Founder decisions on findings 3–6 (2026-10-16):
  - **Time budget: one week.** The founder judges one week realistic even with full content. The research concern (scope vs. time) stays on record for shape to test.
  - **Signup gate: keep it, with a review line.** If more than about half of the people who finish both pages leave at signup, revisit the decision.
  - **Payment form: embedded Stripe form in v0.1**, as decided on 2026-10-16.
  - **iOS: web only for v0.1.** Keep the app working on iOS in development; add iOS support (likely App Store subscriptions for recurring) later.
- Founder decision (2026-10-16): get outside evidence by **launching, then learning**, not by running sessions before the build. Launch measurement therefore carries the riskiest-assumption test (are the ideas useful?).
- Founder decisions (2026-10-16): launch with **all 30 Tier 1 pains, full** (several dreams per pain and several ideas per dream), and **AI drafts the ideas (from the Fix Corpus, with sources and honest labels) while the founder approves, edits or cuts each one in the CMS** before publishing. Implication: content is likely the critical path. Today 29 of 30 pains have one dream, and roughly 200–250 ideas need drafting and founder approval, so the one-week appetite needs re-checking in define and shape.
- [NEEDS CLARIFICATION: What is the Help page for in v0.1: collecting offers, testing the skills idea, or showing the roadmap?]
- [Deferred with iOS: current App Store guideline text for recurring voluntary support by a non-charity.]
- [NEEDS CLARIFICATION: ESCO dataset licence and attribution terms.]

## Sources

- Repo: `docs/spec/features.md`, `docs/architecture/decisions.md`, `docs/spec/CONFLICTS.md`, `docs/roadmap/mvp.md`, `apps/app/app/*`, `packages/content/src/*` (policy: local read)
- Drafts (unchecked): `docs/source/We_Are_It_MVP_Product_UX_Spec_v0.1_2026-10-16.md`, `docs/source/it_mvp_tier_1_pains_and_dreams.md`, `docs/spec/drafts/opportunity-tree.md` (policy: local read)
- https://developer.apple.com/forums/thread/744611 (host: developer.apple.com, policy: search result, not fetched)
- https://forums.expo.dev/t/app-rejected-ios-app-store-business-guideline-3-1-1-business-payments-in-app-purchase/39908 (host: forums.expo.dev, policy: search result, not fetched)
- https://developer.apple.com/forums/thread/130952 (host: developer.apple.com, policy: search result, not fetched)
- https://www.forrester.com/report/Required+Registration+Lowers+Online+Conversion+Rates/RES45179 (host: www.forrester.com, policy: search result, not fetched; paywalled)
- https://www.mathereconomics.com/?p=5390 (host: www.mathereconomics.com, policy: search result, not fetched)
- https://medium.com/@reddavis/stand-app-9ee0fc3355c (host: medium.com, policy: search result, not fetched)
- https://techcrunch.com/2013/11/29/ironsource-announces-kudoskits/ (host: techcrunch.com, policy: search result, not fetched)
- https://civictech.guide/projects/catchafire (host: civictech.guide, policy: search result, not fetched)
- https://codefor.ca/civic-tech-marketplace (host: codefor.ca, policy: search result, not fetched)
- https://www.arxiv.org/abs/2112.09439 (host: www.arxiv.org, policy: search result, not fetched)
- https://esco.ec.europa.eu/en/node/173 (host: esco.ec.europa.eu, policy: search result, not fetched)
