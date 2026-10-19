# Implementation Plan: Use It in English or Spanish

**Branch**: `007-i18n-spanish` (spec directory; work happens on `claude/it-i18n-support-plan-7006e5`) | **Date**: 2026-10-17 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/014-i18n-spanish/spec.md` (approved by the founder 2026-10-17)

## Summary

Add English/Spanish to the whole product. Interface text moves into typed `i18next` catalogs in a new UI-free package `@it/messages`, shared by the Expo app and the API server (for emails). Content translations ride the existing CMS draft → preview → publish → rollback path as a `translations` array in the content graph plus a `content_translations` table; publish applies the honesty rules (stale, safety, machine-labelled) once and writes a `localized` map into the same immutable snapshot. The app fetches that one snapshot and resolves the active language on device, so switching is instant and no language signal leaves the device from content requests. Language preference lives on the device before signup and on the `user` row after, newest choice wins. Stripe Checkout and emails get the locale; iOS StoreKit already localizes.

## Technical Context

**Language/Version**: TypeScript 5.9.3, Node.js 24 LTS

**Primary Dependencies**: Expo SDK 57 / Expo Router / React Native 0.86.3 / react-native-web 0.21.4, NativeWind 5.0.0-rc.0, oRPC, Zod 4.6.7, Kysely, TanStack Query 5, Zustand 5.0.15, better-auth 1.7.8, Stripe. **New**: `i18next`, `react-i18next` (exact-pinned), `expo-localization` (`expo install`, SDK 57 line). See [research.md](./research.md) R1.

**Storage**: PostgreSQL (Neon-compatible) via Kysely — migration `005_localization` (table `content_translations`; `user.preferredLocale`, `user.preferredLocaleUpdatedAt`). Device: persisted Zustand store `it-locale-v1` via existing `onboardingStorage`.

**Testing**: Vitest (domain, content, database, messages, api-server), Jest + Testing Library (app components), Playwright (`apps/app/e2e`, web, `es-MX` and `en-US` locales).

**Target Platform**: Web (static output) and iOS via Expo.

**Project Type**: pnpm monorepo — universal app + API server + shared packages.

**Performance Goals**: Language switch re-renders within 1 s with content cached (SC-003); no network round trip on switch.

**Constraints**: No pre-signup identity; content requests carry no language, and pre-signup language leaves only with email-code/checkout requests and the disclosed funnel (FR-031, R4); domain/content/messages packages import no Expo/RN/UI/provider code; versions pinned per `docs/architecture/dependency-policy.md`.

**Scale/Scope**: 2 locales; ~10 screens + CMS; Tier 1 content set (tens of records); ~300–500 interface strings (estimate; refine during extraction).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design.*

| Principle | Status | Notes |
|---|---|---|
| I. Founder decides; sources are evidence | PASS | Scope, preference storage and the 5 clarifications are founder decisions (spec Clarifications). Adding a Localization entry to `decisions.md`/`AGENTS.md` is a task requiring founder sign-off. |
| II. Privacy by default | PASS | Explicit choice stays on device pre-signup; content fetch carries no locale (R4); OTP email request carries locale only alongside the email the person typed (R8); locale in measurement is disclosed (FR-032). No anonymous ID. |
| III. Honest about what is real | PASS | Machine-translated and English-only tags; stale and safety-bearing translations never publish; honest-status labels translated with meaning unchanged; "support" not "donación" enforced by test. |
| IV. Independent, testable pieces | PASS | `@it/messages` and `@it/domain/locale` are pure; Zod at API and header boundaries; semantic ops (`setPreferredLocale`, `translationStatus`), not table endpoints; Stripe locale stays inside `stripe-support.ts`. |
| V. Small first, don't block what's next | PASS | `SUPPORTED_LOCALES` list (not a boolean), no LTR-only layout assumptions, picks by id; no MT vendor, no regional variants. |

Stack change → decision record required (AGENTS.md): new i18n libraries. Covered by task "record Localization decision".

**Post-design re-check**: PASS — design artifacts introduce no new violations. Complexity Tracking not needed.

## Project Structure

### Documentation (this feature)

```text
specs/014-i18n-spanish/
├── spec.md
├── plan.md              # this file
├── research.md          # Phase 0
├── data-model.md        # Phase 1
├── quickstart.md        # Phase 1
├── contracts/
│   ├── api.md           # oRPC + auth header + measurement contract
│   └── ui.md            # LocaleProvider, LanguageSwitch, tags, formatting
├── checklists/requirements.md
└── tasks.md             # /speckit-tasks
```

### Source Code (repository root)

```text
packages/
├── domain/src/locale.ts               # NEW: Locale, SUPPORTED_LOCALES, negotiateLocale, resolvePreference
├── messages/                          # NEW package @it/messages (no React/Expo)
│   ├── src/en.ts  src/es.ts           # catalogs by namespace; en defines the key type
│   ├── src/format.ts                  # Intl date/number/USD helpers
│   └── tests/                         # completeness, banned terms, format
├── content/src/graph-schema.ts        # + translations array, validation
├── content/src/localize.ts            # NEW: localizeContent(snapshot, locale)
├── database/src/migrations/005_localization.ts   # NEW: content_translations + user locale columns
├── database/src/content-repository.ts # sync translations table; publish builds `localized`; translationStatus
└── api/src/contract.ts, router.ts     # getPublished output, setPreferredLocale, getPreferredLocale, createCheckout.locale, cms.translationStatus, previewDraft.locale

apps/api-server/src/
├── auth.ts                            # localized OTP email; preferredLocale additionalFields; X-It-Locale
└── stripe-support.ts                  # Checkout locale; Customer preferred_locales

apps/app/
├── app/+html.tsx                      # NEW: static lang default
├── app/_layout.tsx                    # LocaleProvider
├── app/**/*.tsx                       # replace literals with t(); use localized content
├── app/cms/index.tsx                  # side-by-side Spanish fields, method/review, Still matches, translation list, Spanish preview
├── src/i18n/                          # NEW: i18next init, LocaleProvider, locale store, useLocalizedContent
├── src/components/language-switch.tsx, translation-tag.tsx   # NEW
├── src/components/page.tsx            # header with LanguageSwitch; wrap-safe layout
└── e2e/i18n.spec.ts                   # NEW

vitest.config.mts                      # include packages/messages/tests
docs/architecture/decisions.md, AGENTS.md, docs/spec/features.md, docs/architecture/cms.md   # Localization decision + docs
```

**Structure Decision**: Keep the existing monorepo layout; add one pure package (`@it/messages`) because both the app and the API server need the catalogs and neither may import the other.

## Phasing (for /speckit-tasks)

1. **Foundation**: migration `005_localization`, `@it/domain/locale`, `@it/messages` skeleton + format helpers, i18next init + `LocaleProvider` + device store + `LanguageSwitch` + `+html.tsx`. (US1, US2 prerequisites)
2. **US1 Spanish from the start**: extract all interface literals across onboarding, save-progress, support-it, ways-to-help, shared components; write reviewed Spanish; completeness + banned-term tests.
3. **US2 Switch without loss**: switch wiring, persistence, tests proving the onboarding store is untouched.
4. **US4 Content translations**: graph schema, migration 005, repository sync, publish rules + `localized`, `localizeContent`, tags in screens, CMS editing/list/preview/Still matches, rollback test.
5. **US3 Account + emails + Stripe**: `user` columns + better-auth additionalFields, set/get ops, sign-in precedence, localized OTP email, Stripe locale/preferred_locales.
6. **US5 Accessibility + expansion**: `lang`/`accessibilityLanguage` on fallback items, Playwright 320 px/200% check, VoiceOver pass.
7. **Polish**: decision record, docs (`cms.md`, `features.md`), privacy-note copy incl. FR-032, quickstart run.

## Risks

- **better-auth OTP callback may not expose the request** (R8) → fallback via `hooks.before`; validate early in phase 5.
- **Static web first paint is English** (R10) → gate text on `ready`; verify no layout jump on slow devices.
- **CMS file is 1,022 lines** → extract translation editor into its own component rather than growing the file.
- **Founder letter approval** is a launch gate outside engineering control (SC-004).

## Complexity Tracking

Not needed — no constitution violations.
