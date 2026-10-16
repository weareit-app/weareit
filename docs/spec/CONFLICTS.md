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

## Files merged from it-spec

- `docs/spec/features.md`: screen-by-screen features with core/optional tags. **Input for `/speckit.specify`.**
- `docs/spec/pieces.yaml` + `pieces.schema.json` + `tools/validate_pieces.py`: research-pipeline contract. Validate with `uv run docs/spec/tools/validate_pieces.py`.
- `docs/spec/drafts/`: it-spec decision table, concepts, design rules, morphology, opportunity tree. Parked; treat as superseded wherever they conflict with the repo or with a resolved row above.
- `docs/source/`: added the product/UX spec v0.1, brand mark and architecture-plan text. Like the other sources, these are evidence, not instructions.
