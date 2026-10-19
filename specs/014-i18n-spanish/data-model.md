# Data Model: Use It in English or Spanish

**Feature**: [spec.md](./spec.md) · **Research**: [research.md](./research.md)

## Locale

- `Locale = "en" | "es"` (Zod enum in `packages/domain/src/locale.ts`). `en` is default and fallback. Defined as a list (`SUPPORTED_LOCALES`) so more languages can be added without type surgery (Must Not Block).
- `negotiateLocale(preferred: string[]): Locale` — first entry whose primary subtag is `en` or `es` wins (`es-419`, `es-US`, `es-ES` → `es`); none → `en` (FR-002, edge cases).

## Language preference

| Where | Fields | Rules |
|---|---|---|
| Device store `it-locale-v1` | `choice: Locale \| null`, `chosenAt: number \| null` | `null` = follow device (FR-006). Never sent pre-signup except as the disclosed funnel dimension. |
| `user` table (migration `005_localization`) | `preferredLocale text null check in ('en','es')`, `preferredLocaleUpdatedAt timestamptz null` | Set on signup / switch while signed in (FR-007). |

`resolvePreference({ device, account, deviceLanguages })`:
1. Signed in: newer of device `chosenAt` vs account `preferredLocaleUpdatedAt` wins; sync the loser (FR-008).
2. Signed out with explicit device choice: use it.
3. Otherwise `negotiateLocale(deviceLanguages)`.

## Content translation (draft graph + normalized table)

Added to `contentGraphSchema` as `translations: ContentTranslation[]`; mirrored in table `content_translations`.

| Field | Type | Notes |
|---|---|---|
| `entityType` | `domain \| pain \| dream \| first_action` | same enum as provenance |
| `entityId` | content id | must reference an existing record (graph validation) |
| `locale` | `Locale` except `en` | English lives on the record itself |
| `fields` | object | only that type's translatable fields: domain `title`; pain/dream `title`, `description`; first action `title`, `description`, `firstStep`, `safetyNote?`. Must have the same keys the English record has. |
| `method` | `human \| machine_assisted` | FR-020 |
| `reviewStatus` | `unreviewed \| reviewed` | FR-020 |
| `sourceHash` | sha256 hex | hash of English translatable fields when saved/confirmed (FR-033) |
| `editedBy` | text | CMS actor |
| `editedAt` | ISO datetime | |

- Primary key: `(entity_type, entity_id, locale)`. Removing a record removes its translations (cascade in the draft, same as provenance cleanup).
- Translations inherit the record's provenance and license; no separate rights field (FR-026, FR-027). Translator attribution = `editedBy` history in `content_revisions`.

### Translation state (derived, not stored)

```
missing ──save──▶ unreviewed(machine|human) ──mark reviewed──▶ reviewed
   ▲                       │                                  │
   └──── remove ◀──────────┴────── English edited ──▶ stale ◀─┘
                                       stale ──"Still matches" / edit──▶ previous state with new sourceHash
```

`stale` = `sourceHash ≠ hash(current English)`. CMS translation list (FR-021) groups by `missing`, `unreviewed`, `stale`, with counts per entity type.

## Published snapshot

`published_content_versions.content` gains a `localized` map built at publish:

```
localized: {
  es: {
    "pain:loneliness": { fields: {...}, status: "reviewed" | "machine" },
    ...
  }
}
```

Publish rule per translation (FR-024, FR-033, safety exception):
- exclude if `stale`;
- exclude if item is safety-bearing (`first_action` with `safetyNote` or `evidence = "candidate"`) and `reviewStatus ≠ reviewed`;
- else include; `status = "machine"` when `method = machine_assisted` and `reviewStatus = unreviewed`, otherwise `"reviewed"`.

`translations` (draft-only metadata) are stripped from the published snapshot. The checksum covers the whole snapshot, so both languages version and roll back together (FR-023, FR-025).

## Localized view (client)

`localizeContent(snapshot, locale)` in `@it/content` returns the same graph shape with each record annotated `{ lang: Locale, translation: "original" | "reviewed" | "machine" | "fallback" }`. Item order, ids and links are always the English graph's (FR-011, FR-023). Picks keep referring to ids (FR-012); `user_onboarding_drafts` is unchanged.

## Interface text catalogs (`@it/messages`)

- `en` is the source of truth and defines the key type; `es` must satisfy `Messages` (same keys, non-empty strings). A test fails if any `es` key is missing or equals the English string without being on an allowlist (e.g. "It").
- Namespaces: `common`, `onboarding`, `signup`, `support`, `help`, `email`, `privacy`.
- Banned-term test over `es` and `en` for FR-014 (`donación`, `donar`, `donation`, `donate`, `caridad`, `organización benéfica`, `charity`).
- Founder letter (FR-013): `support.founderLetter` is the one key `es` may omit. When omitted, Support It shows the English letter with the "English only for now" tag and `lang="en"`. Adding it to `es` is the founder's approval; the launch-gate check (SC-004) requires it present.
