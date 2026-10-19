# Design

## Context

See proposal.md for why. Requirements are in `specs/`. Current state on master (4fad3b8):

- All interface text is literal English in `apps/app/app/**` and `apps/app/src/components/**`. There is no `+html.tsx`; web output is `static` (`apps/app/app.json`), so the first paint is pre-rendered English.
- Content is one English graph (`packages/content/src/graph-schema.ts`): domains (groups), pains, dreams, legacy `firstActions` (still in the schema and CMS; shown only on the futures screen that `required-signup-gate` retires), and `fixes` with `kind`, `featureStatus`, `evidence` and `evidenceNote`. Publish writes an immutable snapshot (`packages/database/src/content-repository.ts`, `publishDraftContent`, `rollbackToVersion`). The CMS is one 1,033-line file (`apps/app/app/cms/index.tsx`).
- The code email is hard-coded English in `apps/api-server/src/auth.ts` (`sendVerificationOTP`). `required-signup-gate` moves sending behind one `sendEmail` boundary.
- Support is hosted Checkout today; spec 009 replaces it with an embedded form and a CMS-managed founder letter.
- Migrations on master end at `005_content_fixes`; `required-signup-gate` plans `006_signup_gate`.

### Reusable work on branch `claude/it-i18n-support-plan-7006e5`

That branch (2 commits on merge base `016a221`, before the onboarding redesign) holds 014's spec and a partial implementation of its foundation and US1. Reuse, do not merge:

- `packages/messages` (`en.ts`, `es.ts`, `types.ts`, `format.ts`, tests for catalog completeness, banned terms and USD formatting). Keys follow the old screens (futures, ways-to-help, save-progress) and need re-extracting against today's screens.
- `packages/domain/src/locale.ts` (+ tests): `SUPPORTED_LOCALES`, `localeSchema`, `negotiateLocale`, `resolvePreference`. Matches the specs as written.
- `apps/app/src/i18n/` (i18next init, `locale-store.ts` persisted as `it-locale-v1`, `locale-provider.tsx`, `use-localized-content.ts`, `language-props.ts`), `translation-tag.tsx`, `content-language.tsx`, `+html.tsx`, `e2e/i18n.spec.ts`.
- **Do not reuse** its migration `packages/database/src/migrations/005_localization.ts` as numbered: it clashes with master's `005_content_fixes`. Its content (a `content_translations` table, `user.preferredLocale`, `user.preferredLocaleUpdatedAt`) moves into a new migration numbered after `006_signup_gate` (expected `007_localization`). It was never run against PostgreSQL.

## Goals / Non-Goals

**Goals:**
- One set of interface text catalogs shared by the app and the API server (emails) without either importing the other.
- Translations ride the existing draft → preview → publish → rollback path, so both languages version together by construction.
- Switching language is local and instant: no request, no state reset.

**Non-Goals:**
- A general translation-management system or machine-translation integration.
- Translating the CMS's own screens.
- Locale-specific routes (pending confirm.md Q8).

## Decisions

1. **i18next + react-i18next for interface text; `expo-localization` for device languages.** One runtime works on web, iOS (Hermes) and Node (emails); catalogs stay plain data in `@it/messages`; typed keys make a missing Spanish string a type and test failure. *Alternatives:* Lingui (needs a Babel macro alongside the pinned NativeWind pipeline), FormatJS (heavier on Hermes), hand-rolled catalog (re-implements plurals and re-render). This is a stack addition, so it needs a decision record in `docs/architecture/decisions.md` (founder sign-off).

2. **Pure locale logic in `packages/domain/src/locale.ts`; catalogs and `Intl` formatting in `packages/messages`.** No React, Expo or provider imports, per AGENTS.md. Inputs at boundaries (device store, account operation, auth header) are validated with `localeSchema` (Zod).

3. **Translations in the content graph, published into the same snapshot.** Add `translations: { entityType, entityId, locale, fields, method, reviewStatus, sourceHash, editedBy, editedAt }[]` to the draft graph and a normalized `content_translations` table, written by the existing draft save. Publish computes, once, which translations may be shown (excluding out-of-date ones, i.e. `sourceHash` ≠ hash of current English) and writes `localized: { es: { "<type>:<id>": { fields, status } } }` into the snapshot; draft-only metadata is stripped. Rollback restores `localized` with the rest. Entity types: `domain`, `pain`, `dream`, `fix` (014 had `first_action`; master now shows fixes). Whether fixes' hidden `evidenceNote`, legacy first actions, contributions, pain-page detail and the founder letter are included is confirm.md Q11, Q13, Q15, Q16. *Alternatives:* separate snapshot per language (rollback and checksum coordination get harder); `title_es` columns (blocks more languages).

4. **Fetch every language, resolve on the device.** `content.getPublished` keeps one snapshot with `localized` maps and takes no locale input; the app applies a pure `localizeContent(snapshot, locale)` (in `@it/content`) that keeps English IDs, order and links and marks each item `original | reviewed | machine | fallback`. Content requests then carry no language (Language privacy), switching needs no request, and there is one TanStack Query cache entry. The content set is small (tens of KB), so the extra payload is acceptable.

5. **Language preference: device store, then account.** Device: Zustand store `it-locale-v1` `{ choice, chosenAt }` using the same storage adapter as the draft, separate from `it-onboarding-draft-v1` so "clear choices" does not touch it unless confirm.md Q14 says otherwise. Account: `user.preferred_locale`, `user.preferred_locale_updated_at`, declared as Better Auth `user.additionalFields`. Semantic operations `account.getPreferredLocale` and `account.setPreferredLocale({ locale, chosenAt })` (server keeps the newer). On sign-in the provider applies `resolvePreference`. Whether the language also goes in `required-signup-gate`'s `account.savePicks` payload depends on confirm.md Q6; the default here is a separate `setPreferredLocale` call right after the account exists.

6. **Code email language.** The app sends `X-It-Locale: en|es` on auth requests; the server validates it (invalid or missing → `en`), prefers the account's stored language when the email has an account, and renders subject and body from `@it/messages`. Plug into `required-signup-gate`'s `sendEmail` boundary. Verify that Better Auth 1.7.8's `sendVerificationOTP` exposes the request; if not, read the header in `hooks.before`. No separate pre-signup "set language" call (would create server state before signup).

7. **Payments.** Pass the locale to whatever spec 009 builds (Stripe Payment Element `locale` for the embedded form, or Checkout `locale` while hosted Checkout remains) and set the Stripe Customer's `preferred_locales` from the account language, updating it when the account language changes. Support is shown only after signup (spec 009), so 014's signed-out receipt case no longer applies. iOS: StoreKit's localized price; only It's own text is translated.

8. **Web and iOS language declaration.** `+html.tsx` sets `lang="en"` for static output; the provider sets `document.documentElement.lang`. Fallback items get `lang="en"` on web and `accessibilityLanguage` on iOS. To avoid an English flash for Spanish visitors on static web, screens render text only after the locale is resolved (same pattern as the draft store's `ready`).

9. **Joining dream lines.** The joiner that builds "I drift off without a fight and wake up ready." moves into `packages/domain` with a per-language conjunction (`and`, `y`/`e`). Grammatical gender in Spanish first-person lines is a content question (confirm.md Q10), not code.

10. **Language control placement.** In the shared page chrome that `required-signup-gate` adds (header with "Sign in" / menu), so it appears on every screen including gate, code, name, account, privacy and all-set; and on pain pages when spec 012 lands.

## Overlaps

Requirements here touch behaviour owned by other changes or specs. All new behaviour is written as ADDED to avoid colliding with in-flight MODIFIED blocks.

- **`required-signup-gate` (in flight)**
  - `account-signup` "What will be saved" and "Signup privacy" say signup sends only picks, selected fixes and the opt-in. This change adds "Account records its language". One of the two must change before both archive (confirm.md Q6).
  - `account-signup` "Email opt-in" records a wording version; Spanish wording needs its own version (confirm.md Q7).
  - `account-signup` "Code first" / "Email code sign-in": this change's "Code email in the person's language" adds language to the same email; implementation plugs into its `sendEmail` boundary.
  - `privacy-page` (new there): "Placeholder content matches behaviour" lists what signup sends and stores; it must add the account language if Q6 is yes, and the page itself needs Spanish.
  - `account-settings` (new there): the account screen shows the language control via shared chrome; no requirement added here.
  - `pain-explorer` "Moving on" (MODIFIED there): its button and note text become catalog keys; behaviour unchanged.
  - Migration numbering: this change's migration follows `006_signup_gate`.
- **Support (spec 009, no change yet)**: founder letter becomes CMS content (009 FR-007), which conflicts with 014's catalog-key approach (confirm.md Q13); embedded form, presets per cadence and the funding total need locale formatting. This change's `support` requirements are written for either hosted or embedded payment.
- **Pain pages (spec 012, no change yet)**: `/p/<slug>` routes, slugs and link previews (confirm.md Q8, Q9); detailed sourced content and images (Q16); 012 FR-018/FR-019 forbid extra values in the link, which rules out `?lang=`.
- **Content catalog**: baseline divergences (no slugs, editable published IDs, no review queue) are untouched; translations key on record IDs, so a published ID rename would orphan translations, which is one more reason to lock IDs (spec 012 FR-028).
- **Measurement (spec 013, no change yet)**: 013 FR-004 forbids language in measurement messages and FR-022 allows only the platform split, reversing 014 FR-032. This change follows 013 and decisions.md (confirm.md Q5).
- **Contributions (decisions.md 2026-10-18, no change yet)**: people may write in either language; review-queue handling of language is confirm.md Q15.

## Risks / Trade-offs

- [Spanish copy quality and review capacity; the founder approves all copy] → Catalog completeness test blocks missing keys; who reviews is confirm.md Q3.
- [Better Auth OTP callback may not expose the request] → `hooks.before` fallback; verify first in the auth task.
- [Static web pre-renders English] → render text after locale resolution; check for layout jump.
- [Extracting ~300–500 strings while `required-signup-gate` rewrites the same screens] → do extraction after that change's screens land, or extract per screen as each lands.
- [CMS file growth] → build the translation editor and list as separate components.
- [Gendered Spanish first-person lines] → content guidance (confirm.md Q10) before translation starts.

## Migration Plan

- Migration `007_localization` (after `006_signup_gate`): `content_translations` table; `user.preferred_locale` (nullable, check `en`/`es`) and `user.preferred_locale_updated_at`. Older snapshots read with `localized: {}`. No production data, so no backfill.
- Deploy API first (new output field is additive; new account operations), then the app.
- Rollback: revert the app; the API's extra field and operations are ignored by the old app.

## Open Questions

Founder questions that change specs or tasks are in `confirm.md`. Deferrable here:

- Exact i18next, react-i18next and expo-localization versions (pinned at install per `docs/architecture/dependency-policy.md`).
- Spanish register and regional vocabulary checks (014 research question), done during copy review.
