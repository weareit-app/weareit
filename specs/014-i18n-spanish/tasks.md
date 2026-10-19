# Tasks: Use It in English or Spanish

**Input**: Design documents from `specs/014-i18n-spanish/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/](./contracts/), [quickstart.md](./quickstart.md)

**Tests**: Included. The spec's success criteria (SC-001, SC-002, SC-004, SC-007, SC-008) and the launch gate are defined as automated checks in quickstart.md, so tests are part of done.

**Organization**: Grouped by user story (spec order). US4 (content) can start right after Foundational; US1's screens show English-fallback tags until US4 lands.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: US1–US5 from spec.md

---

## Phase 1: Setup (Shared Infrastructure)

- [X] T001 Create package `packages/messages` (`@it/messages`): `package.json` (type module, exports `./en`, `./es`, `./format`, `./types`; scripts `typecheck`, `lint` matching `packages/content/package.json`), `tsconfig.json` extending `tsconfig.base.json`, `src/`, `tests/`; no React/Expo/RN dependencies
- [X] T002 Add `i18next` and `react-i18next` exact-pinned to `packages/messages/package.json` (i18next only) and `apps/app/package.json` (both); run `pnpm install`
  _Done: `i18next`/`react-i18next` went to `apps/app` only; `@it/messages` stays plain data with no i18n runtime. The server picks a runtime in US3._
- [X] T003 Add `expo-localization` to `apps/app` with `pnpm --filter @it/app exec expo install expo-localization`; then run `expo install --check` and record the pins in `docs/architecture/dependency-policy.md`
- [X] T004 [P] Add `"packages/messages/tests/**/*.test.ts"` to `include` in `vitest.config.mts`
- [X] T005 [P] Add `"./locale": "./src/locale.ts"` to exports in `packages/domain/package.json`; add `"./localize": "./src/localize.ts"` to exports in `packages/content/package.json`; add `@it/messages` as a workspace dependency of `apps/app` and `apps/api-server`
  _Done, except the `@it/content` `./localize` export: it's deferred to T052, when `src/localize.ts` exists._

---

## Phase 2: Foundational (Blocking Prerequisites)

**⚠️ No user story work can begin until this phase is complete.**

- [X] T006 [P] Implement `packages/domain/src/locale.ts`: `SUPPORTED_LOCALES = ["en", "es"] as const`, `localeSchema = z.enum(SUPPORTED_LOCALES)`, `type Locale`, `DEFAULT_LOCALE = "en"`, `negotiateLocale(preferred: string[]): Locale` ("first entry whose primary subtag is `en` or `es` wins (`es-419`, `es-US`, `es-ES` → `es`); none → `en`"), and `resolvePreference({ device: { choice, chosenAt }, account: { locale, updatedAt } | null, deviceLanguages })` per data-model.md (signed in: newer timestamp wins; signed out with choice: choice; else negotiate)
- [X] T007 [P] Unit tests in `packages/domain/tests/locale.test.ts`: es-MX/es-419/es-US/es-ES → es; `["fr","es","en"]` → es; `["fr","en","es"]` → en; `["ca","pt"]` → en; `[]` → en; resolvePreference precedence cases incl. device newer vs account newer
- [X] T008 [P] Create `packages/messages/src/en.ts` with namespaces `common`, `onboarding`, `signup`, `support`, `help`, `email`, `privacy` (start with keys needed by `page.tsx` and `LanguageSwitch`: `common.language.label`, `common.language.en = "English"`, `common.language.es = "Español"`, `common.tag.englishOnly`, `common.tag.machine`), export `type Messages = typeof en` (deep string shape) from `packages/messages/src/types.ts`
- [X] T009 [P] Create `packages/messages/src/es.ts` typed as `DeepPartialExcept<Messages, "support.founderLetter">`-style type so every key except `support.founderLetter` is required; `common.tag.englishOnly = "Solo en inglés por ahora"`, `common.tag.machine = "Traducción automática"`
  _Done: `es` is typed `Messages` (exactly the English keys). The founder-letter exception isn't needed yet; see T025._
- [X] T010 [P] Implement `packages/messages/src/format.ts`: `formatDate(date, locale)`, `formatNumber(n, locale)`, `formatUsd(amountMinor, locale)` using `Intl`; Spanish USD must be unambiguous (e.g. "US$ 15"), English "$15"
- [X] T011 Create `apps/app/src/i18n/i18n.ts`: initialize i18next + react-i18next with `en`/`es` resources from `@it/messages`, `fallbackLng: "en"`, `returnNull: false`, TypeScript `CustomTypeOptions` resource typing from `Messages` in `apps/app/src/i18n/i18next.d.ts`
- [X] T012 Create device store `apps/app/src/i18n/locale-store.ts`: Zustand persist, name `it-locale-v1`, storage `onboardingStorage` from `apps/app/src/storage.ts`, state `{ choice: Locale | null, chosenAt: number | null }`, Zod-validated `merge`/`migrate` like `apps/app/src/state/onboarding-store.ts`, `skipHydration: true`
- [X] T013 Create `apps/app/src/i18n/locale-provider.tsx` per contracts/ui.md: rehydrate locale store, compute locale with `resolvePreference` + `getLocales()` from `expo-localization`, call `i18n.changeLanguage`, set `document.documentElement.lang` on web, expose `useLocale(): { locale, setLocale, ready }`; `setLocale` writes `choice` and `chosenAt = Date.now()` and MUST NOT touch `useOnboardingStore`
- [X] T014 Wrap the app in `LocaleProvider` inside `QueryClientProvider` in `apps/app/app/_layout.tsx`
- [X] T015 [P] Create `apps/app/app/+html.tsx` (Expo Router static HTML root) with `<html lang="en">` default
- [X] T016 Migration `packages/database/src/migrations/005_localization.ts` with `up` and `down`: (1) table `content_translations` with PK `(entity_type, entity_id, locale)`, columns `fields jsonb not null`, `method text not null` check `in ('human','machine_assisted')`, `review_status text not null` check `in ('unreviewed','reviewed')`, `source_hash text not null`, `edited_by text not null`, `edited_at timestamptz not null`, check `entity_type in ('domain','pain','dream','first_action')`, check `locale in ('es')`; (2) add to `user` `preferredLocale text null` with check `in ('en','es')` and `preferredLocaleUpdatedAt timestamptz null`; update `packages/database/src/types.ts`
  _Done: written as `005_localization.ts` and type-checks. **Not yet run against PostgreSQL** (no local database was available on 2026-10-17)._
- [X] T017 [P] Create `apps/app/src/components/translation-tag.tsx`: `<TranslationTag kind="englishOnly" | "machine" />` rendering translated text (not colour-only), `lang` set to the active locale

**Checkpoint**: `pnpm typecheck` and `pnpm test:unit` pass; app runs unchanged in English.

---

## Phase 3: User Story 1 — A Spanish speaker uses It in Spanish from the start (P1) 🎯 MVP

**Goal**: Every interface string renders in Spanish for a Spanish device; content shows English-only tags until US4.

**Independent Test**: Browser with Spanish first → open app fresh → personal and societal pages, save-progress, support-it, ways-to-help are fully Spanish except tagged content items; `<html lang="es">`.

### Tests for User Story 1

- [X] T018 [P] [US1] `packages/messages/tests/catalog.test.ts`: every `en` key exists in `es` and is a non-empty string (except `support.founderLetter`); no `es` value equals its `en` value unless allowlisted (e.g. "It"); interpolation placeholders match between `en` and `es`
  _Done: no founder-letter exception yet (no letter exists)._
- [X] T019 [P] [US1] `packages/messages/tests/banned-terms.test.ts` (FR-014, SC-008): no value in `en` or `es` matches /donaci[oó]n|donar|donation|donate|caridad|organizaci[oó]n ben[eé]fica|charity/i
- [X] T020 [P] [US1] `packages/messages/tests/format.test.ts`: `formatUsd(1500, "es")` contains "US$" and "15"; `formatUsd(1500, "en")` is "$15.00" or "$15"; date/number formatting differs by locale
- [X] T021 [P] [US1] Playwright `apps/app/e2e/i18n.spec.ts` with `test.use({ locale: "es-MX" })`: home and `/onboarding/personal` show Spanish headline/buttons, `document.documentElement.lang === "es"`; with `locale: "fr-FR"` → English

### Implementation for User Story 1

- [X] T022 [P] [US1] Move literals from `apps/app/src/components/page.tsx`, `choice-card.tsx`, `clear-draft-control.tsx`, `content-query-state.tsx`, `first-action-card.tsx` into `onboarding`/`common` namespaces of `packages/messages/src/en.ts` and use `useTranslation()`
- [X] T023 [P] [US1] Move literals from `apps/app/app/index.tsx` and `apps/app/app/onboarding/personal.tsx`, `world.tsx`, `futures.tsx` into the `onboarding` namespace (incl. "N selected · kept on this device" as a plural key) and use `t()`
- [X] T024 [P] [US1] Move literals from `apps/app/app/save-progress.tsx` into the `signup` namespace and use `t()`
- [X] T025 [P] [US1] Move literals from `apps/app/app/support-it.tsx` into the `support` namespace (founder letter as `support.founderLetter`), use `formatUsd` for amounts; when `es` lacks `support.founderLetter`, render the English letter with `<TranslationTag kind="englishOnly" />` and `lang="en"` (FR-013)
  _Done for the existing page. The Support It page has no founder letter yet, so `support.founderLetter` and its fallback come with the founder-letter work (spec 004 / FR-013)._
- [X] T026 [P] [US1] Move literals from `apps/app/app/ways-to-help.tsx` into the `help` namespace and use `t()`
- [X] T027 [P] [US1] Move honest-status and evidence labels (`candidate`/`practical`, do now / already exists / It might build / societal change) and illustration accessibility labels from `apps/app/src/content/illustrations.ts` and screens into `onboarding.status.*` / `onboarding.illustration.*` keys
  _Done: today the UI has only the evidence labels (`firstAction.candidate`/`practical`). The four honest-status labels don't exist in the app yet; add them to the catalog when they ship. Illustration labels use `common.illustrationOf`._
- [X] T028 [US1] Write reviewed Spanish for all keys in `packages/messages/src/es.ts` (neutral Latin American Spanish, informal "tú"; "apoyar/apoyo" for support), excluding `support.founderLetter` until the founder supplies approved text
- [X] T029 [US1] Until US4: render every content item with `<TranslationTag kind="englishOnly" />` and `lang="en"` when locale is `es`, via a temporary `useLocalizedContent()` in `apps/app/src/i18n/use-localized-content.ts` that returns English annotated `translation: "fallback"`
- [X] T030 [US1] Gate onboarding text rendering on `useLocale().ready` in `apps/app/src/components/page.tsx` (no English flash on static web, research R10)

**Checkpoint**: T018–T021 pass; US1 independent test passes.

---

## Phase 4: User Story 2 — Switch language without losing anything (P1)

**Goal**: Header switch on every screen; picks and state untouched; choice persists on device.

**Independent Test**: Pick dreams + mark ideas in English, switch to Español, all intact; reload → Spanish; switch back → intact.

### Tests for User Story 2

- [ ] T031 [P] [US2] Jest test `apps/app/tests/language-switch.test.tsx`: renders "English"/"Español" with their `lang`; selecting Español calls `setLocale("es")`; accessible role/value announced
- [ ] T032 [P] [US2] Jest test `apps/app/tests/locale-provider.test.tsx`: `setLocale` leaves `useOnboardingStore.getState()` deep-equal before/after (FR-005); explicit choice persists through store rehydrate; with no choice, follows mocked `getLocales()`
- [ ] T033 [P] [US2] Playwright case in `apps/app/e2e/i18n.spec.ts`: pick two pains + a dream, switch language via header, assert picks remain; reload, assert language kept; switch measured < 1 s (SC-002, SC-003)

### Implementation for User Story 2

- [ ] T034 [US2] Create `apps/app/src/components/language-switch.tsx` per contracts/ui.md (one tap opens, one tap selects; FR-003, FR-004; keyboard operable on web; no animation under reduced motion)
- [ ] T035 [US2] Add `LanguageSwitch` to the header of `apps/app/src/components/page.tsx` so it appears on every screen, including `apps/app/app/cms/index.tsx` only if CMS uses `Page` (CMS UI stays English; switch there is not required)

**Checkpoint**: US1 + US2 tests pass.

---

## Phase 5: User Story 3 — Language carries into the account and emails (P2)

**Goal**: Account stores language; precedence on sign-in; OTP email and Stripe in the chosen language.

**Independent Test**: Sign up in Spanish → Spanish code email; sign in on English browser → Spanish; switch while signed in → next email English; Stripe Checkout opens in Spanish.

### Tests for User Story 3

- [ ] T036 [P] [US3] `apps/api-server/tests/locale-email.test.ts`: OTP email subject/body Spanish when `X-It-Locale: es`; English when header missing or invalid (e.g. `xx`); stored `preferredLocale` wins for existing users
- [ ] T037 [P] [US3] `apps/api-server/tests/preferred-locale.test.ts`: `setPreferredLocale` keeps the newer of stored vs input `chosenAt` (FR-008) and returns the winner
- [ ] T038 [P] [US3] Extend `apps/api-server/tests/stripe-support.test.ts`: `createCheckout({ locale: "es" })` passes `locale: "es"` to `checkout.sessions.create`; signed-in customer gets `preferred_locales` from the account language; signed-out one-time checkout gets `preferred_locales: ["es"]` from the input `locale`

### Implementation for User Story 3

- [ ] T039 [US3] Declare `preferredLocale` / `preferredLocaleUpdatedAt` as better-auth `user.additionalFields` in `apps/api-server/src/auth.ts`
- [ ] T040 [US3] Add `account.getPreferredLocale` and `account.setPreferredLocale` to `packages/api/src/contract.ts` (schemas verbatim from contracts/api.md) and implement in `packages/api/src/router.ts` (authenticated; newer timestamp wins)
- [ ] T041 [US3] Localize OTP email in `apps/api-server/src/auth.ts`: read and Zod-validate `X-It-Locale` (invalid → `en`), prefer the user's `preferredLocale` when the account exists, render subject/body from `@it/messages` `email` namespace; if better-auth 1.7.8 does not pass the request to `sendVerificationOTP`, read the header in `hooks.before` and stash it on the context (research R8)
- [ ] T042 [US3] Send `X-It-Locale` on auth requests from `apps/app/src/auth/auth-client.ts` and `auth-client.native.ts` using the current locale
- [ ] T043 [US3] On sign-in/sign-up success in `apps/app/src/i18n/locale-provider.tsx`: call `getPreferredLocale`, apply `resolvePreference`, and push the device choice with `setPreferredLocale` when it is newer; `setLocale` while signed in calls `setPreferredLocale`
- [ ] T044 [US3] Add `locale: localeSchema` to `support.createCheckout` input in `packages/api/src/contract.ts`; pass it to Stripe Checkout `locale` and set Customer `preferred_locales` (account language when signed in, otherwise the input `locale`, so signed-out supporters' receipts match; FR-017) in `apps/api-server/src/stripe-support.ts`; send it from `apps/app/app/support-it.tsx`; mirror in `apps/api-server/src/mock-stripe.ts`
- [ ] T045 [US3] Add Spanish `email.*` strings (OTP subject/body) to `packages/messages/src/es.ts`; confirm iOS path in `apps/app/src/payments/store-purchases.native.ts` shows no converted price (FR-018)

**Checkpoint**: US3 tests pass; quickstart scenarios 5–6 pass.

---

## Phase 6: User Story 4 — The founder publishes Spanish content honestly (P2)

**Goal**: Translations in CMS with method/review/staleness; publish rules; localized snapshot; app resolves on device.

**Independent Test**: quickstart scenario 3 and 4.

### Tests for User Story 4

- [ ] T046 [P] [US4] `packages/content/tests/translations.test.ts`: graph validation rejects translations for unknown records, mismatched field keys vs the English record, empty translated fields, `locale: "en"`
- [ ] T047 [P] [US4] `packages/database/tests/publish-localized.test.ts`: publish includes reviewed human → `status: "reviewed"`; unreviewed machine → `"machine"`; stale (`sourceHash ≠ hash(current English)`) → excluded; first action with `safetyNote` or `evidence = "candidate"` and `reviewStatus ≠ reviewed` → excluded; `translations` stripped from snapshot; rollback restores `localized` with the content (FR-025)
- [ ] T048 [P] [US4] `packages/content/tests/localize.test.ts`: `localizeContent` keeps English ids, order and links; annotates `translation` as `original | reviewed | machine | fallback` and `lang`; snapshot without `localized` → all fallback for `es`

### Implementation for User Story 4

- [ ] T049 [US4] Extend `packages/content/src/graph-schema.ts` with `contentTranslationSchema` (`entityType` in `domain | pain | dream | first_action`; `entityId`; `locale` = `localeSchema` excluding `en`; `fields` limited to the type's translatable fields — domain `title`; pain/dream `title`, `description`; first action `title`, `description`, `firstStep`, `safetyNote?`; `method: human | machine_assisted`; `reviewStatus: unreviewed | reviewed`; `sourceHash` sha256 hex; `editedBy`; `editedAt` ISO) and `translations` array with the validation rules from T046; add `hashEnglishFields(entityType, record)` helper
- [ ] T050 [US4] In `packages/database/src/content-repository.ts`: sync `content_translations` in the normalized-table write path; drop translations whose record is removed; build `localized` at `publishDraftContent` with the publish rule from data-model.md and strip `translations`; `readPublishedContent` returns `localized: {}` for older snapshots
- [ ] T051 [US4] Update `publishedContentSchema` in `packages/api/src/contract.ts` with `localized` (schema verbatim from contracts/api.md); add `cms.translationStatus` and optional `locale` on `cms.previewDraft`; implement in `packages/api/src/router.ts` and `content-repository.ts`; extend `validateDraft` issues
- [ ] T052 [US4] Implement `packages/content/src/localize.ts` `localizeContent(snapshot, locale)`; replace the temporary hook body in `apps/app/src/i18n/use-localized-content.ts` with a memoized call
- [ ] T053 [US4] Use `useLocalizedContent()` in `apps/app/app/onboarding/personal.tsx`, `world.tsx`, `futures.tsx` and `apps/app/src/components/first-action-card.tsx`; render `TranslationTag` for `fallback`/`machine`; set `lang` / `accessibilityLanguage` per item
- [ ] T054 [US4] Extract a `TranslationEditor` component into `apps/app/src/components/cms/translation-editor.tsx` (English and Spanish side by side, method select, "Mark reviewed", "Still matches" which re-stamps `sourceHash`, stale warning) and use it for each record type in `apps/app/app/cms/index.tsx`
- [ ] T055 [US4] Add a translation list view to `apps/app/app/cms/index.tsx` backed by `cms.translationStatus` (counts per type for missing / unreviewed / stale, links to records; SC-005) and a "Preview in Spanish" toggle using `previewDraft({ locale: "es" })`
- [ ] T056 [US4] Update `packages/database/src/tier1-import.ts` and its test so the seed initializes `translations: []` and still publishes

**Checkpoint**: US4 tests pass; Spanish visitors see translated content with correct tags.

---

## Phase 7: User Story 5 — Screen readers and layout work in Spanish (P3)

**Goal**: Correct `lang` / spoken language; no truncation at 320 px / 200% text.

**Independent Test**: quickstart scenarios 7–8.

- [ ] T057 [P] [US5] Playwright in `apps/app/e2e/i18n.spec.ts`: viewport 320 px, root font-size 200%, `es-MX`; for every heading, button and choice card on onboarding, save-progress and support-it assert `scrollWidth <= clientWidth` and no overlap (SC-007); fallback items have `lang="en"`
- [ ] T058 [US5] Fix overflow in `apps/app/src/components/choice-card.tsx`, `page.tsx` and button rows (add `flex-wrap`, `min-w-0`, `flex-shrink`) until T057 passes
- [ ] T059 [US5] Set `accessibilityLanguage` (iOS) on Spanish text and fallback items in `apps/app/src/components/choice-card.tsx`, `first-action-card.tsx`, `translation-tag.tsx`; translate expanded/collapsed accessibility state strings
- [ ] T060 [US5] Manual VoiceOver pass on iOS Simulator for personal, societal, signup and Support It pages in Spanish; record results in `specs/014-i18n-spanish/checklists/accessibility.md` (SC-006)

---

## Phase 8: Polish & Cross-Cutting Concerns

- [ ] T061 [P] Add a "Localization" section to `docs/architecture/decisions.md` (i18next + react-i18next + expo-localization; `@it/messages`; bilingual snapshot resolved on device; preference precedence) and a line under "Decisions to preserve" in `AGENTS.md` — founder sign-off required
- [ ] T062 [P] Update `docs/architecture/cms.md` with translations, publish rules (stale, safety, machine) and the translation list; add "Use It in English or Spanish" as a cross-cutting core item in `docs/spec/features.md` — founder sign-off required
- [ ] T063 [P] Add `privacy.measurement` copy in `packages/messages/src/en.ts` and `es.ts` stating language is counted in the coarse totals and stage funnel (FR-032), and note the `locale` field requirement for the future measurement event in `docs/architecture/decisions.md`
- [ ] T064 Run `pnpm typecheck`, `pnpm lint`, `pnpm test` and every scenario in `specs/014-i18n-spanish/quickstart.md`; record results
- [ ] T065 Launch gate (SC-004): confirm `support.founderLetter` exists in `packages/messages/src/es.ts` with founder-approved text and `pnpm test:unit packages/messages` passes

---

## Dependencies & Execution Order

### Phase Dependencies

- Setup (Phase 1) → Foundational (Phase 2) → user stories.
- US1 and US4 can start in parallel after Phase 2. US2 needs US1's `Page` changes (T022, T030). US3 needs Phase 2 only (migration `005_localization` is foundational, T016). US5 needs US1 + US4 rendering.
- Polish after the stories it documents; T065 is the release gate.

### User Story Dependencies

- **US1 (P1)**: Phase 2.
- **US2 (P1)**: US1 (T022, T030).
- **US3 (P2)**: Phase 2; T043 also needs T013.
- **US4 (P2)**: Phase 2; T053 replaces T029's temporary behaviour.
- **US5 (P3)**: US1, US4.

### Within Each User Story

Tests first (they should fail), then schema/migration → repository → API → app UI.

### Parallel Opportunities

- Phase 1: T004, T005.
- Phase 2: T006–T010, T015, T017 (different files).
- US1: T018–T021 together; T022–T027 together (separate screens), then T028.
- US3 tests T036–T038 together; US4 tests T046–T048 together.
- Polish: T061–T063.

## Parallel Example: User Story 1

```text
Task: "T018 catalog completeness test in packages/messages/tests/catalog.test.ts"
Task: "T019 banned-terms test in packages/messages/tests/banned-terms.test.ts"
Task: "T020 format test in packages/messages/tests/format.test.ts"
Task: "T021 Playwright Spanish-first test in apps/app/e2e/i18n.spec.ts"

Task: "T023 extract onboarding screen literals"
Task: "T024 extract save-progress literals"
Task: "T025 extract support-it literals"
Task: "T026 extract ways-to-help literals"
```

## Implementation Strategy

### MVP First

1. Phases 1–2.
2. US1 → Spanish interface, content tagged English-only. **Stop and validate**: quickstart scenario 1.
3. US2 → switching. Demo-able bilingual interface.

### Incremental Delivery

4. US4 → Spanish content via CMS (can run alongside US1 with a second developer).
5. US3 → account, emails, Stripe.
6. US5 → accessibility hardening.
7. Polish + launch gate (founder letter, decision record).
