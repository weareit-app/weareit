# Conflicts to resolve: it-spec (2026-10-16) vs existing repo records

it-spec was drafted before anyone looked at this repo. The repo's `docs/architecture/decisions.md` says it "records decisions made with the project owner". Several things marked AGREED in it-spec on 2026-10-16 contradict it. All rows were resolved by the founder on 2026-10-16 (last column). Resolutions are applied to `docs/architecture/decisions.md`, `AGENTS.md`, `docs/architecture/payments.md` and `docs/spec/features.md`.

| # | Topic | Repo record says | it-spec 2026-10-16 says | Notes | **Resolved 2026-10-16** |
|---|---|---|---|---|---|
| C1 | API layer | **oRPC**, contracts framework-independent (`decisions.md`) | D5: tRPC as transport over Zod contracts | it-spec's real ask (Zod schemas = contract) is already met by oRPC. Likely keep oRPC. | Keep oRPC. |
| C2 | SQL access | **Kysely** (+ Better Auth Kysely adapter) | D7: Drizzle | Repo already built on Kysely. | Keep Kysely. |
| C3 | Sign-in method | **Email OTP only** | D9: passwords and passwordless both | | Email code **and** password. |
| C4 | When signup happens | Only **when the person chooses to persist** their work (optional) | Required after the personal + societal pages to go further (features §3, D12) | Biggest product difference. | Signup **required** after personal + societal pages. |
| C5 | Web payment UI | **Stripe hosted Checkout** + customer portal; implemented with a local mock | D10: embedded Payment Element (web) / PaymentSheet (native) | Hosted Checkout already works here. | **Embedded** Stripe payment form on web in v0.1. |
| C6 | Donor account | Ledger stores It user ID "**when available**" (guests allowed) | D10: must be signed in to donate | | Moot: signup comes before Support, so supporters are signed in. |
| C7 | iOS payments | **RevenueCat StoreKit one-time tips**; monthly support stays on web | D10: Stripe PaymentSheet on native later | Apple rules shape this. Repo position is more specific. | One-time, monthly **and annual** on web and iOS (iOS optional for v0.1). VERIFY against App Store rules before building iOS recurring. |
| C8 | Content source | **Database-backed with a first-party CMS**; Git must not be a competing source of truth | D11: hand-authored versioned files in repo | `apps/app/app/cms/` exists. | Database + CMS. |
| C9 | Pre-signup measurement | Only **coarse aggregate counts, described in the UI**; no stable anonymous session | `telemetry` piece uses a session-scoped id; D13 own events table | it-spec version would break a repo privacy invariant. | Coarse totals **plus** a per-visit stage funnel (no pain/dream content; visit ID never stored on device). Changes a privacy invariant. |
| C10 | Invitations | Onboarding **can offer ways to invite others** | Invitations are "soon", not v0.1 | | Invitations are **optional** in v0.1. |
| C11 | Wording | "**Contribution**", never "donation" (no charity status) | features.md says "Donate" | Copy fix once decided. | Use "**support**". |
| C12 | Hosting | **Open decision** | D8: SST on AWS (DRAFT) | Not a hard conflict. Just never agreed. | Open. Lean SST on AWS if it's cheapest and easy to leave; keep app code host-neutral. |

## Open: onboarding prototype (2026-10-18) vs spec 001

The personal page now follows the Design canvas "What can be better for you?" and the 2026-10-17/18 onboarding decisions. Rows marked *applied* are in the code and spec 001 and need founder confirmation; the rest are still open.

| # | Topic | Earlier record says | Prototype / decisions say | Status |
|---|---|---|---|---|
| P1 | Idea labels | Spec 001 FR-006: do now / already exists / It might build / change for society | A type tag (Task, Habit, Takes a group, Feature), a status tag on features (Idea, Planned); evidence levels (Strong, Some, Limited, Not tested yet) are recorded but not shown in v0.1 (2026-10-19) | Applied. "Already exists" has no type of its own yet. |
| P2 | Personal headings | Body, Head, Money, Time, People, Doing; the prototype canvas used Mind, Body, Time, Money, People, Work | The pain tree's eight: Body, Mind, Money, Work, Home, Time, People, Purpose, with every inventory pain top level (no "More like this"; founder, 2026-10-18) | Applied. Five canvas-only pains are gone (always behind, dead-end job, no close friends, no one nearby, screens all day). |
| P3 | Primary button color | `docs/brand/colors.md`: tide is the main call to action | Decisions chat: federal blue (`harbor` #3D5588) for the one primary button | Applied tide, per the brand doc and the master palette. Open. |
| P4 | Fast scan | 2026-10-17: a pain can be checked without opening it | Tapping a pain or its check selects and opens it | Applied prototype. Open: the fast-scan path is gone. |
| P5 | Unpicking a future by its title | Continuity of meaning: selections survive every transition | Tapping a future's title toggles it, so a mis-tap drops the future and ways only it served | Applied prototype. Open. |
| P7 | Pains without futures | Spec 001 FR-012: every launch pain has at least two dreams | 34 of 58 personal pains and 39 of 54 societal pains have no futures yet; they show, and opening a personal one says futures aren't written yet (founder, 2026-10-18) | Applied for the prototype. Launch still needs FR-012. |
| P9 | Societal page | Tier 1: six headings (Power, Economy, Each other, Dignity, Information, Change), 15 pains, titled "What worries you in the world today?" | The pain tree's ten headings, every societal pain top level in the tree's order, titled "What could be better for us?"; the 13 pains parked for later stay off both pages | Applied (founder, 2026-10-18). |
| P8 | Landing page | A welcome screen ("Let's start the good timeline.") with Get started | The personal page is the landing page; `/onboarding/personal` redirects to `/` | Applied (founder, 2026-10-18). |
| P6 | Privacy note placement | Spec 001 FR-013: one line near the top | Prototype has no note; the page keeps "kept on this device" near the bottom | Open. |

## Files merged from it-spec

- `docs/spec/features.md`: screen-by-screen features with core/optional tags. **Input for `/speckit.specify`.**
- `docs/spec/pieces.yaml` + `pieces.schema.json` + `tools/validate_pieces.py`: research-pipeline contract. Validate with `uv run docs/spec/tools/validate_pieces.py`.
- `docs/spec/drafts/`: it-spec decision table, concepts, design rules, morphology, opportunity tree. Parked; treat as superseded wherever they conflict with the repo or with a resolved row above.
- `docs/source/`: added the product/UX spec v0.1, brand mark and architecture-plan text. Like the other sources, these are evidence, not instructions.
