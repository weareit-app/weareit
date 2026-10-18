# It v0.1 — features (what people see and do)

DRAFT. ✔ = founder decided · ? = open / from the unchecked draft spec · **core** = must ship · *(optional)* = if time allows.

## Spec numbers

Founder review, 2026-10-17/18: the new numbers stand. Earlier drafts (including spec 001) used 003 signup, 004 support, 005 help.

| Section below | Spec | Earlier number |
|---|---|---|
| 1. Personal | 001 personal page | — |
| 2. Societal | 002 societal page | — |
| 3. Sign up | 008 signup gate | 003 |
| 4. Support | 009 support page | 004 |
| 5. Help | 011 Help build It | 005 |
| 6. Admin | 006 admin | — |
| Privacy page | 010 privacy page | — |
| Pain pages and entry links | 012 pain pages and entry links | — |
| Stage funnel (pre-signup measurement) | measurement spec, not yet written (likely 013) | was FR-014 in 001 |

## 1. Personal: "What could be better for you?" (no account)

- ✔ **core** See a short list of everyday pains ("Unemployment — I can't find work").
- ✔ **core** Tap a pain to open it and see several possible better futures ("dreams").
- ✔ **core** Pick one or more dreams.
- ✔ **core** Ideas that could help show up under each picked dream (things to do now, things It might build, bigger societal changes), each honestly labelled.
- ✔ **core** Select the fixes you'd use with one tap ("selected fixes"; earlier drafts called these "I'd use this" marks). Totals show in admin, counted only from people who sign up.
- ✔ **core** Collapse a pain; the chosen dream becomes the headline, the pain shown small underneath.
- ✔ **core** Your picks stay on your device. Only coarse totals and a stage funnel (no picks) are sent, and the page says so. The stage list belongs to the measurement spec (not yet written; likely 013).
- ✔ **core** "Clear everything picked on this device", shown only before signup.
- ✔ **core** Each opened pain links to its own pain page at "/p/<slug>" (spec 012). ? All pains, or only the outreach launch set (012 question N4).

## 2. Societal: "What could be better for us?" (no account)

- ✔ **core** Same as personal, for society-wide problems.

## 3. Sign up (required to go further)

- ✔ **core** Email code (OTP) or email + password.
- ✔ **core** Your picks from pages 1–2 are saved to your account.
- ✔ **core** Opt-in checkbox (unticked by default) for emails from It.

## 4. Support: "It's free for you—and you're not the product."

- ✔ **core** Short honest letter from the founder, in the founder's own words (founder writes or approves the final text).
- ✔ **core** Support once, monthly or annually, with an embedded Stripe form right on the page. Wording: "support", never "donate".
- ✔ **core** Link to Stripe's hosted portal to cancel or change recurring support.
- ✔ *(optional)* Manage or cancel recurring support inside It.
- ✔ *(optional)* Comparison sidebar: big companies' revenue and staff vs It's actual funding and team, sourced and dated.
- ✔ **core** Skip without supporting.

## 5. Help: "What could you help make possible?" — ? ILL-DEFINED, needs its own design pass

Founder's rough direction (2026-10-16), not settled:

1. ? Say your background (education, work, or whatever fits).
2. ? Suggest relevant skills from It's modified ESCO skills list; you confirm or adjust.
3. ? Recommend specific things It needs help with (curated roadmap items, not generic "idea cards"), matched to those skills.

- ✔ **core** Skip.
- ✗ Dropped: generic "would you use it?" idea cards. Replaced by curated roadmap items (?).
- ? Homefront's pickers (job titles, skills, roles, interests) are inspiration only; roles and interests would be done very differently.

## 6. Admin (founder only)

- ✔ *(optional)* Totals of pains/dreams/ideas picked (never individuals).
- ✔ *(optional)* Support payments: list and totals.
- ✔ *(optional)* Help offers; mark as followed up.
- ? *(optional)* Interest in roadmap items (depends on Help page design).

## Stages

v0.1 is staged: **core** must ship; **optional** ships if time allows; **soon** isn't built yet but the early build must not get in its way.

| Stage | Feature | What the early build must not block |
|---|---|---|
| core / optional | Tagged on each item above | — |
| optional | Native iOS app (one-time, monthly, annual support; VERIFY App Store rules) | Keep the Expo app working on iOS; It's support ledger is provider-neutral so Stripe and Apple purchases land in one place |
| optional | Invitations ("two people you'd want to explore this") | Accounts can record who invited whom without exposing the inviter's picks |
| soon | Personal story of your chosen futures | Store picks with the content version they were made under, so a story can be generated later |
| soon | Sharing a future or path | Picks are private by default; sharing must be an explicit act on a separate copy |
| soon | Matching people with goals to people offering help | Help-page answers use structured lists (job titles, skills), not just free text |
| soon | Starting from a dream instead of a pain ("I want to write a novel") | Dreams can exist without a parent pain in the content model |

? Anything missing from "soon"?
