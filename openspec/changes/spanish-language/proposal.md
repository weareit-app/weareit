# Proposal

## Why

Many of the people It is for read Spanish first, and someone who meets a page in a language they don't read well is likely to leave. The founder approved English and Spanish end to end on 2026-10-17 (old spec 014, renumbered from 007). That spec was written before the onboarding redesign, required signup, the name step, the account screen, the privacy page, pain pages and the new Support page, so this change re-bases it on what the app does today (`openspec/specs/`) and on the in-flight `required-signup-gate` change.

## What Changes

What people see and do, screen by screen (features.md has no language item yet; adding one is open question 1):

- **First visit, any page** (features.md §1, §2, §2b): a visitor whose phone or browser lists Spanish before English sees It in Spanish from the first screen: headline, questions, group names, pains, dreams, fixes and their tags (Task, Habit, Takes a group, Feature; Idea, Planned) and the tag explanations, buttons, loading and error messages, and the on-device note. Anyone else sees English. Nothing asks them to choose first.
- **Language control, every screen**: a small control names each language in that language ("English", "Español"). Switching changes the page in place. Open pains, picked dreams, selected fixes, collapsed groups and anything half-typed stay exactly as they were. Before signup the choice is remembered on this device only.
- **Content not yet in Spanish**: a pain, dream or fix with no usable Spanish appears in English, in the same place, still pickable. Whether it also carries a visible "English only for now" tag, and whether machine-translated Spanish may be shown with a "Machine translation" note, is open question 4 (both were approved in 014 but predate the 2026-10-19 "show information only when it helps" decision).
- **Signup gate, code screen, name step** (features.md §3; from `required-signup-gate`): shown in the active language, and the emailed code arrives in it. After signup the language is kept on the account and used on other devices and in emails from It. Whether the gate's "what will be saved" list names the language is open question 6.
- **Account screen** (from `required-signup-gate`): the language control is there too (as on every screen); changing it while signed in updates the account.
- **Support page** (features.md §4): page text, amount buttons and the payment form appear in the active language. Amounts stay in US dollars, written so a Spanish reader knows they are dollars (for example "US$ 5"). Receipts follow the account's language. The founder letter appears in Spanish only once the founder approves a Spanish version.
- **Pain pages at `/p/<slug>`** (features.md §2b): shown in the active language like any other page. Whether links get a language prefix, which language link previews use, and whether Spanish slugs exist are open questions 8–9.
- **Privacy page** (from `required-signup-gate`, later spec 010): available in Spanish and says how the language choice is kept.
- **Content editor (founder only)** (features.md §6): each record shows English and Spanish side by side, records how the Spanish was made and whether it is reviewed, lists everything missing, unreviewed or out of date in Spanish with counts, previews the draft in Spanish, and publishes both languages together in one version (rollback restores both). The editor's own screens stay in English.
- **Screen readers and layout**: on web each page declares its language, and any English item on a Spanish page declares English; on iOS text is read with the matching voice. Longer Spanish text never gets cut off at the smallest width.

Out of scope: languages other than English and Spanish; regional variants (copy targets neutral Latin American Spanish with "tú", as approved in 014); choosing language by location; machine-translation services built into the editor; translating the editor itself; currency conversion; the embedded Stripe form itself (spec 009), the full privacy page (spec 010), pain pages themselves (spec 012) and measurement (spec 013), each its own change. This change makes them translatable when they land.

Must leave room for (features.md Stages): more languages, including right-to-left (language is a list, no left-to-right-only layout, no text in images); personal story of chosen futures and sharing a future or path (picks refer to items by ID, never by text, so they can be shown in any language); matching people with helpers (Help-page lists stored by ID with translated labels); starting from a dream (dream translations don't depend on a parent pain); evidence tags (Spanish evidence notes can be stored even though tags are hidden in v0.1); native iOS (device language and spoken language work on iOS); people's own contributions (approved contributions get translations like any record).

## Capabilities

### New Capabilities
- `language`: which language a person sees, how it is chosen (device default, in-app switch), where the choice is kept (device before signup, account after), English fallback, locale formatting, document and spoken language, and what about the language is sent or stored.

### Modified Capabilities
- `content-catalog`: Spanish versions of content records, how each was made and reviewed, staleness, a missing-translation list, Spanish preview, and both languages published and rolled back together.
- `pain-explorer`: published content and every label on the personal and societal pages appear in the active language with English fallback, and switching keeps picks and open state.
- `account-signup`: the code email uses the active language, and the account keeps the person's language.
- `support`: Support page text, amounts and payment form follow the active language; amounts stay US dollars; receipts follow the account language.

## Impact

- New package `packages/messages` (interface text catalogs, formatting helpers; no React or Expo imports); new `packages/domain/src/locale.ts`. Both exist on branch `claude/it-i18n-support-plan-7006e5` and can be reused (see design.md).
- App: every screen's literal text moves to catalogs; a locale provider, device store and language control in the shared page layout; `+html.tsx` for the default `lang`; localized content rendering.
- Content: translations in the content graph and a translations table; publish builds per-language text into the same snapshot; content editor gains Spanish fields, a translation list and Spanish preview.
- API and auth: published-content output gains per-language text; account operations to get and set the language; the code email reads the active language; Stripe receives the locale.
- Database: one migration (number after `required-signup-gate`'s `006_signup_gate`) adding the translations table and account language columns.
- Dependencies: `i18next`, `react-i18next`, `expo-localization`; needs a decision record in `docs/architecture/decisions.md` (stack addition).

## Open questions

All eighteen were answered by the founder on 2026-10-19; see `confirm.md`. Differs from the draft's recommendation on Q4: only the "English only for now" tag, and unreviewed machine Spanish is never shown.
