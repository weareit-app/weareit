# Tasks

Answer `confirm.md` before starting. Tasks marked (Qn) depend on that answer; do not build them on an assumption. Start after `required-signup-gate`'s screens and `006_signup_gate` have landed (see design.md Risks).

## 1. Foundation (port from `claude/it-i18n-support-plan-7006e5`)

- [ ] 1.1 Port `packages/domain/src/locale.ts` and its tests from the branch (read with `git show`); verify `pnpm test:unit` passes the negotiate and precedence cases (es-MX/es-419/es-US/es-ES → es; French-then-Spanish → es; Catalan/Portuguese → en; newer choice wins)
- [ ] 1.2 Create `packages/messages` from the branch's skeleton (`types.ts`, `format.ts`, tests), with no React, Expo or provider imports; verify the package typechecks and `formatUsd(500, "es")` reads as US dollars ("US$")
- [ ] 1.3 Add `i18next`, `react-i18next` (exact pins) and `expo-localization` (`expo install`); record pins in `docs/architecture/dependency-policy.md`; verify `expo install --check` is clean
- [ ] 1.4 Add the Localization decision record to `docs/architecture/decisions.md` (Q18; founder sign-off); verify it names the libraries, English default, device default, account language and per-language publish
- [ ] 1.5 Port the app's i18n init, `it-locale-v1` device store (Zod-validated) and locale provider; wrap `_layout.tsx`; add `+html.tsx` with `lang="en"`; verify a Jest test that `setLocale` leaves the onboarding store deep-equal and that a stored choice survives rehydrate

## 2. Interface text

- [ ] 2.1 Extract every literal from today's screens (personal, societal, signup gate, code, name, account, privacy, all-set, Support, shared components, loading/error states, accessibility labels) into `en.ts`; verify a grep for user-visible string literals in `apps/app/app` and `apps/app/src/components` (excluding CMS and lab) finds none
- [ ] 2.2 Write Spanish for every key in `es.ts` (neutral Latin American, "tú", "apoyo/apoyar"); reviewer per Q3; verify the catalog test (same keys, non-empty, matching placeholders) and the banned-terms test (`donación`, `donar`, `caridad`, `organización benéfica`, `donation`, `charity`) pass
- [ ] 2.3 Move the dream-line joiner into `packages/domain` with per-language conjunctions (`and`; `y`, or `e` before an "i"/"hi" sound); verify unit tests for both languages and use it in the collapsed preview and closed summary
- [ ] 2.4 Use the plural form for "N selected · kept on this device" in both languages; verify 1 and 3 render correctly in Spanish

## 3. Language control and switching

- [ ] 3.1 Build the language control ("English" / "Español", each with its own `lang`) in the shared page chrome from `required-signup-gate`; verify a Jest test for labels, keyboard operation, announced current value and expanded state, and no animation under reduced motion
- [ ] 3.2 Render text only after the locale is resolved on static web; set `document.documentElement.lang` on switch; verify Playwright with `locale: "es-MX"` shows Spanish and `lang="es"` with no English flash, and `fr-FR` shows English
- [ ] 3.3 Playwright: open a pain, pick two dreams, select a fix, expand a group, switch to Spanish and back; verify every pick, open state and scroll position is unchanged and the dismissed focus invite stays dismissed
- [ ] 3.4 Apply the clear-choices and sign-out behaviour for the device language choice (Q14); verify with a Jest test of the chosen behaviour

## 4. Content translations

- [ ] 4.1 Write migration `007_localization` (after `006_signup_gate`): `content_translations` (PK entity type, ID, locale; fields, method, review status, source hash, editor, edited at) and `user.preferred_locale` / `preferred_locale_updated_at`; update `packages/database/src/types.ts`; verify up and down run against a local PostgreSQL
- [ ] 4.2 Add `translations` to the content graph schema for the entity types chosen in Q11 (default groups, pains, dreams, fixes), with validation (unknown record, field keys differ from English, empty field, `en` locale) and a source-hash helper; verify `packages/content` tests
- [ ] 4.3 Sync `content_translations` in the draft save path and drop translations of removed records; verify a repository test
- [ ] 4.4 At publish, build `localized` (exclude out-of-date; apply the review rule from Q12 and the machine-text rule from Q4), strip draft metadata, and read older snapshots as `localized: {}`; verify tests for current, out-of-date, unreviewed and rolled-back cases
- [ ] 4.5 Add `localized` to the `content.getPublished` output schema (no locale input); verify a router test and that the request carries no language
- [ ] 4.6 Implement `localizeContent(snapshot, locale)` in `@it/content`; verify it keeps English IDs, order and links and marks each item `original | reviewed | machine | fallback`
- [ ] 4.7 Use localized content on the personal and societal pages, declaring English items with `lang="en"` / `accessibilityLanguage`; show tags per Q4; verify Playwright in Spanish with one untranslated pain shows it in English, in place, pickable, and declared English

## 5. Content editor

- [ ] 5.1 Add a Spanish editor beside each record's English fields (method, review state, last editor, "Still matches") as its own component outside `cms/index.tsx`; verify editing and marking reviewed save to the draft
- [ ] 5.2 Add the translation list (missing, unreviewed, out of date, counts per type, links to records) via a `cms.translationStatus` operation; verify a router test and that each row opens its record
- [ ] 5.3 Add Spanish preview of the draft (`cms.previewDraft` with optional locale); verify the preview shows Spanish where it would publish and English elsewhere
- [ ] 5.4 Update `docs/architecture/cms.md` with the translation workflow; verify the steps match the editor

## 6. Account and email

- [ ] 6.1 Declare `preferred_locale` fields as Better Auth `user.additionalFields`; add `account.getPreferredLocale` / `account.setPreferredLocale` (Zod, signed-in only, newer wins); verify router tests including UNAUTHORIZED when signed out
- [ ] 6.2 Save the language when the account is created and apply the most-recent-wins rule on sign-in (Q6 decides whether it rides `savePicks`); verify an e2e: sign up in Spanish, sign in on an English browser, Spanish shown
- [ ] 6.3 Send `X-It-Locale` on auth requests; render the code email from `@it/messages` through `sendEmail`, preferring the account language; verify tests for Spanish header, missing/invalid header (English) and stored account language winning
- [ ] 6.4 Add language to the gate's "what will be saved" list and the privacy page (Q6) and per-language opt-in wording versions (Q7); verify the gate list, privacy page and actual payload match

## 7. Support

- [ ] 7.1 Translate Support page text and format amounts with `formatUsd`; verify Spanish amount error shows US dollar limits
- [ ] 7.2 Pass the locale to the payment form (Checkout `locale` now; Payment Element `locale` when spec 009 lands) and keep the Stripe Customer's `preferred_locales` in step with the account language; verify `stripe-support` tests and the mock
- [ ] 7.3 Show the founder letter in Spanish only when an approved Spanish version exists, otherwise English declared as English (Q13 decides CMS vs app text); verify a test for both cases
- [ ] 7.4 Keep cadence and amount when switching language on Support and redraw the form without double submission; verify Playwright
- [ ] 7.5 Confirm iOS purchase options show only App Store price text; verify on the simulator in Spanish

## 8. Integration checks

- [ ] 8.1 Playwright at 320 px and 200% text in Spanish across personal, societal, gate, code, name, account, privacy, Support and all-set: no element with `scrollWidth > clientWidth` on headings, buttons, tags
- [ ] 8.2 VoiceOver (iOS) and a desktop screen reader (web) on the personal, signup and Support pages in Spanish: no passage read with the wrong-language voice; expanded/collapsed announced in Spanish
- [ ] 8.3 Network check: signed-out Spanish visit sends no language on content or measurement requests; only the code request carries it
- [ ] 8.4 `pnpm typecheck`, `pnpm lint`, `pnpm test:unit` and e2e pass

## Workflow follow-up

- Founder answers `confirm.md`; update specs and tasks with `/opsx:update` where answers differ from recommendations.
- Founder (or appointed reviewer) approves Spanish copy and the Spanish founder letter before launch (Q2, Q3).
- Pain pages (spec 012), embedded Support (009), full privacy page (010) and measurement (013) changes include Spanish when they are written.
- Archive with `/opsx:archive` once shipped, then fill the `specs/014-i18n-spanish/` row in `docs/spec/MIGRATION.md`.

## Founder answers (2026-10-19)

- [ ] Show the "Solo en inglés por ahora" tag on English fallback items when Spanish is active, announced by screen readers
- [ ] Never show unreviewed machine-assisted Spanish; fall back to English with the tag until reviewed
- [ ] Name the Spanish reviewer before the launch gate is checked
