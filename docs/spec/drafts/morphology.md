# Morphological grid — DRAFT

Rows are decision dimensions; **bold** = current lean (see `decisions.md`). Set-based design: keep ≥2 options alive per row until a test or deadline kills one.

| Dimension | Options |
|---|---|
| A. Client | **A1 Expo (iOS+web)** ✔ · A2 web framework (Next/Astro/Vite SPA) · A3 Expo web now, native later |
| B. API contract | **B1 Zod contracts + tRPC transport** ✔ · B2 tRPC procedures as contract · B3 OpenAPI/REST |
| C. Storage | **C1 Neon Postgres + Drizzle** · C2 other Postgres host · C3 SQLite/edge DB |
| D. Hosting | **D1 SST on AWS** · D2 Vercel/Netlify-style PaaS · D3 single container (Fly/Render) |
| E. Auth | E1 Better Auth, passwordless only · **E2 Better Auth, passwords + passwordless** ✔ · E3 hosted auth (Clerk/Auth0) |
| F. Pre-signup sync | **F1 device storage, claim on signin** · F2 server-side anonymous sessions · F3 no persistence before signup |
| G. Payments | G1 Stripe hosted Checkout · **G2 Stripe embedded (Payment Element web / PaymentSheet native), account required** ✔ · G3 donation platform (e.g. Open Collective-style) |
| H. Content | **H1 versioned files in repo** · H2 DB + admin editor · H3 headless CMS |
| I. Analytics | **I1 own events table** · I2 privacy-first SaaS · I3 none at launch |

## Incompatibilities and strains

| Pair | Mark | Why |
|---|---|---|
| B2 × A2 (non-TS later) | ✗ | tRPC procedures as contract lock out non-TS clients. |
| D1 × A1 | ~ | Expo web static export on CloudFront works; SSR does not — fine for v0.1, which needs no SSR. |
| C3 × D1 | ~ | Edge SQLite on Lambda is awkward; prefer C1/C2. |
| E3 × R6 (own identity port) | ~ | Possible, but hosted auth owns user records → door becomes one-way. |
| F3 × spec §6 | ✗ | Spec requires continuing without signup with temporary state. |
| F2 × I1 | ~ | Server anonymous sessions + own events table edges toward tracking; needs strict retention rules. |
| G2 × A1 | ~ | Payment Element is web-only; native needs PaymentSheet. Fine if the server returns a client-agnostic `clientSecret`. |
| G3 × D10 KYC concerns | ✓ | Fiscal-host platforms can carry recipient compliance — worth a look if merchant onboarding stalls. |
| H2/H3 × one-week appetite | ✗ | Editor UI is out of appetite; H1 until non-devs edit. |
| A2 × arch plan §4 | ~ | Plan assumes Expo; switching is fine only if journey logic stays a pure package. |

✔ = founder decided 2026-10-16. Current lean (A1 B1 C1 D1 E2 F1 G2 H1 I1) has no ✗ marks.
