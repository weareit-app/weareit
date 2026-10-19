# Research: Use It in English or Spanish

**Feature**: [spec.md](./spec.md) · **Plan**: [plan.md](./plan.md) · **Date**: 2026-10-17

Each item resolves a Technical Context unknown. Versions are pinned at install time per `docs/architecture/dependency-policy.md` (Expo packages via `expo install`; others exact-pinned and checked with `expo install --check`).

## R1. Interface-text library

- **Decision**: `i18next` + `react-i18next`, with typed resources (TypeScript declaration merging over the English catalog), plurals via `Intl.PluralRules`. Device languages from `expo-localization` (`getLocales()`), installed with `expo install`.
- **Rationale**: One runtime works in the Expo app (web + iOS, Hermes) and in the Node API server, which must render OTP and receipt emails (FR-016). Catalogs are plain data, so they can sit in a package with no React/Expo imports (constitution IV) and be consumed by both. No compile step or Babel macro to fit into Metro + NativeWind. Typed keys make a missing Spanish string a type/test failure, which FR-009's launch gate needs.
- **Alternatives considered**:
  - *Lingui*: smaller runtime and good extraction, but relies on Babel macros/compile step; extra risk alongside the pinned NativeWind prerelease pipeline.
  - *FormatJS / react-intl*: solid ICU support, but heavier on Hermes (polyfill decisions) and less convenient for server-side email rendering.
  - *Hand-rolled typed catalog + `Intl`*: viable with two languages, but would re-implement interpolation, plurals and React re-render on switch; not worth owning.

## R2. Where catalogs and locale logic live

- **Decision**: New package `packages/messages` (`@it/messages`): English and Spanish catalogs (`en.ts`, `es.ts`) split by namespace (`common`, `onboarding`, `support`, `signup`, `help`, `email`), plus `format.ts` helpers over `Intl` (dates, numbers, USD). Pure locale logic — the `Locale` type, `negotiateLocale(preferred: string[])` (FR-002) and `resolvePreference(device, account)` (FR-007/008) — goes in `packages/domain/src/locale.ts`. No React, Expo or provider imports in either.
- **Rationale**: App and server both need the catalogs; domain logic must be unit-testable without UI. Keeps `@it/content` about content only.
- **Alternatives considered**: catalogs inside `apps/app` (server could not render emails without importing app code); catalogs in `@it/content` (mixes product UI text with CMS-managed content, which has a different lifecycle).

## R3. How translated content is modelled and published

- **Decision**: Extend the content graph (`packages/content/src/graph-schema.ts`) with a `translations` array: one entry per `(entityType, entityId, locale)` holding the translated text fields, `method` (`human` | `machine_assisted`), `reviewStatus` (`unreviewed` | `reviewed`), `sourceHash` (hash of the English fields it was made from), `editedBy`, `editedAt`. Mirror it in a normalized `content_translations` table (migration `005_localization`), written by the same draft save that already syncs the normalized tables. The **publish** step resolves, per locale, which translations are publishable (FR-024, FR-033, safety exception) and writes a `localized` map into the immutable snapshot: `localized.es["pain:loneliness"] = { fields, status: "reviewed" | "machine" }`. Anything not in the map falls back to English.
- **Rationale**: Drafts are already a jsonb graph revision + normalized tables; translations ride the same draft/preview/publish/rollback path, so FR-023 (same items in both languages) and FR-025 (rollback restores both) hold by construction. Doing the publishability rules once at publish keeps the client dumb and makes the rule testable in one place.
- **Alternatives considered**: separate per-locale snapshots (two rows per publish; rollback and checksum coordination get harder); translated columns on each content table (`title_es`; blocks adding more languages — violates Must Not Block).

## R4. Fetch both languages, resolve on device

- **Decision**: `content.getPublished` keeps one snapshot containing English plus `localized` maps for every published language. The app resolves the active language on device with a pure `localizeContent(snapshot, locale)` in `@it/content`.
- **Rationale**: Meets FR-031 — no language signal leaves the device from content requests; switching language is instant and works offline from cache (SC-003, edge case "switch while offline"); one TanStack Query cache entry. Content set is small (Tier 1: tens of KB), so the doubled payload is acceptable. Language in measurement is then sent only through the disclosed funnel (FR-032).
- **Alternatives considered**: `getPublished({ locale })` server-side resolution (leaks language per request, refetch on switch, cache per locale).

## R5. Staleness detection (FR-033)

- **Decision**: `sourceHash` = SHA-256 of the record's English translatable fields at the time the translation was saved or confirmed. At publish, a translation whose `sourceHash` differs from the current English hash is excluded (item falls back to English). CMS action "Still matches" re-stamps the hash without editing the text.
- **Rationale**: Content-addressed, needs no revision bookkeeping, survives rollback correctly.

## R6. Safety exception (clarification 4)

- **Decision**: An item is "safety-bearing" if it is a first action with `safetyNote` set or `evidence: "candidate"` (hypothesis/caveat wording). For safety-bearing items, only `reviewStatus: "reviewed"` translations publish; otherwise the whole item falls back.
- **Rationale**: Matches the current schema fields exactly; extend the predicate if new caveat fields are added.

## R7. Language preference storage and precedence

- **Decision**: Device: a small persisted Zustand store `it-locale-v1` (same `onboardingStorage` adapter as the onboarding draft) holding `{ choice: Locale | null, chosenAt: number | null }`. Account: `user.preferredLocale` and `user.preferredLocaleUpdatedAt`, declared as better-auth `user.additionalFields` (migration `005_localization` adds columns). Semantic oRPC operation `account.setPreferredLocale`. On sign-in, the newer of device `chosenAt` and account `preferredLocaleUpdatedAt` wins and the other side is updated (FR-008).
- **Rationale**: Mirrors how the onboarding draft already persists locally and syncs after signup; no stable anonymous identity is created (choice is not an identifier and is never sent pre-signup except via the disclosed funnel).

## R8. Emails (OTP, receipts)

- **Decision**: The app sends its active locale as a validated `X-It-Locale` header on auth requests. `sendVerificationOTP` reads it from the request context (better-auth passes the request/ctx to the plugin callback); when a user exists with `preferredLocale`, that wins. Subject and body come from `@it/messages` `email` namespace. Verify at implementation that the pinned better-auth 1.7.8 `emailOTP` callback exposes the request. If it does not, read the header in a better-auth `hooks.before` middleware and stash it on the context. Do not add a separate pre-signup "set language" call: that would create server state before signup.
- **Rationale**: Pre-signup, locale is only attached to the email request the person initiated, which already carries their email address — no new identity.

## R9. Stripe and Apple

- **Decision**: Pass `locale: "es"` (or `"en"`) to `stripe.checkout.sessions.create` (`apps/api-server/src/stripe-support.ts`); set `preferred_locales` on the Stripe Customer so Stripe receipts follow the account language. `support.createCheckout` input gains `locale`. iOS: no change — StoreKit shows its localized price (FR-018); only It's own copy around it is translated.
- **Receipts when signed out**: set the Customer's `preferred_locales` from the checkout `locale` too, so one-time supporters without an account get receipts in the language they used (FR-017).
- **Note**: The current web flow is Stripe Checkout redirect, while the founder's decision is an embedded form (`docs/spec/CONFLICTS.md` C5). Both accept `locale`, so this plan holds either way.

## R10. Web `lang`, iOS spoken language, static rendering

- **Decision**: Add `apps/app/app/+html.tsx` (static `lang="en"` default) and a `LocaleProvider` effect that sets `document.documentElement.lang` on web. English-fallback items render with `lang="en"` (react-native-web passes `lang` through) and `accessibilityLanguage="en-US"` on iOS; Spanish text uses `es`. Because web output is `static`, the first paint is pre-rendered English; the provider resolves the locale before onboarding text renders (same gating pattern as the existing `ready` flag) to avoid an English flash for Spanish visitors.
- **Rationale**: Meets FR-028/029 with platform-native props; no new dependency.

## R11. Text expansion and visual checks (FR-030, SC-007)

- **Decision**: Playwright e2e (`apps/app/e2e`) runs onboarding in `es-MX` at 320 px width with 200% text zoom and asserts no element's `scrollWidth > clientWidth` on headings, buttons and cards; Jest test asserts every `es` key exists and is non-empty. Components with fixed widths (`choice-card`, buttons in `page`) get `flex-wrap`/`min-w-0` where needed.

## R12. Machine-assisted translations

- **Decision**: No machine-translation provider is integrated. The founder may paste machine-assisted text and mark `method: machine_assisted`. 
- **Rationale**: Avoids a new vendor and boundary for v0.1; the honesty requirement only needs the method recorded and shown.

## R13. Measurement (FR-032)

- **Decision**: Pre-signup measurement is not implemented in the codebase yet. This feature adds `locale` to the measurement event schema contract (see [contracts/api.md](./contracts/api.md)) and the privacy-note copy in both catalogs, so whichever feature builds measurement includes it.
