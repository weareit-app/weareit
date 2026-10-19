# Contract: app UI behaviour

## LocaleProvider (`apps/app/src/i18n/`)

- Wraps the app in `apps/app/app/_layout.tsx` inside `QueryClientProvider`.
- Exposes `useLocale(): { locale, setLocale(l), ready }`.
- `ready` becomes true after the device store rehydrates and `negotiateLocale(getLocales())` runs; onboarding screens render text only when `ready` (no English flash on static web).
- `setLocale` updates the device store (`choice`, `chosenAt = now`), calls `i18next.changeLanguage`, sets `document.documentElement.lang` on web, and, when signed in, calls `account.setPreferredLocale`. It never touches `useOnboardingStore` (FR-005).

## LanguageSwitch component

- Present in the shared `Page` header on every screen (FR-003), one tap opens, one tap selects.
- Options labelled "English" / "Español" with `lang` set to each option's language (FR-004).
- Accessible: `accessibilityRole="button"`, announces current value; keyboard operable on web; no animation under reduced motion.

## Localized content rendering

- Screens read `useLocalizedContent()` = `localizeContent(usePublishedContent().data, locale)` (memoized).
- `translation === "fallback"` → render `<TranslationTag kind="englishOnly" />` and set `lang="en"` / `accessibilityLanguage="en-US"` on that item.
- `translation === "machine"` → render `<TranslationTag kind="machine" />`.
- Tags are text, not colour-only.

## Formatting

- All dates/numbers via `@it/messages/format` (`formatDate`, `formatNumber`, `formatUsd`). `formatUsd(1500, "es")` → `"US$ 15"`-style unambiguous USD (FR-015).
