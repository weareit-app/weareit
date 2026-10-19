# Quickstart: validate English/Spanish

Prerequisites: README setup (`pnpm install`, PostgreSQL running, `.env` with `DATABASE_URL`, `CMS_ADMIN_TOKEN`, `BETTER_AUTH_SECRET`). Then:

```bash
pnpm db:migrate
```

```bash
pnpm db:seed
```

```bash
pnpm dev
```

## Automated checks

```bash
pnpm typecheck
```

```bash
pnpm test
```

Expected: unit tests for `negotiateLocale`, `resolvePreference`, `localizeContent`, publish rules (stale / safety / machine), catalog completeness and banned terms all pass; Playwright `e2e/i18n.spec.ts` passes in `es-MX` and `en-US`.

## Manual scenarios (map to spec user stories)

1. **Spanish from the start (US1)**: open the web app in a browser with Spanish first in its language list. Expect Spanish headline, pains, buttons and privacy note; `<html lang="es">`. With French first and English second → English.
2. **Switch keeps picks (US2)**: pick two pains and a dream in English, switch to Español from the header, confirm picks are intact; reload → still Spanish; switch back → English, picks intact.
3. **Fallback and machine tags (US4)**: in `/cms`, give one pain human Spanish (reviewed), one machine-assisted (unreviewed), leave one missing; edit the English of a fourth after its Spanish was reviewed; give a first action with a safety note unreviewed machine Spanish. Publish. In Spanish expect: reviewed → plain Spanish; machine → "Traducción automática"; missing, stale and safety item → English with "Solo en inglés por ahora" and `lang="en"`. Click "Still matches" on the stale one, publish → Spanish returns.
4. **Rollback (FR-025)**: roll back to the previous version; both languages revert together.
5. **Account and email (US3)**: in Spanish, request a sign-in code; the development console email shows the Spanish subject/body. Sign in from a browser set to English → Spanish shown. Switch to English while signed in → next code email is English.
6. **Support (FR-015, FR-017)**: in Spanish, amounts read as US dollars; Stripe Checkout (test mode) opens in Spanish.
7. **Screen readers (US5)**: VoiceOver on iOS Simulator reads Spanish items with a Spanish voice and fallback items in English; on web, check `lang` attributes in the accessibility tree.
8. **Expansion (SC-007)**: Playwright at 320 px width, 200% text, Spanish → no clipped headings, buttons or cards.

## Launch-gate check (SC-004)

```bash
pnpm test:unit packages/messages
```

Fails if any `es` interface key is missing (including `support.founderLetter`) or a banned term appears.
