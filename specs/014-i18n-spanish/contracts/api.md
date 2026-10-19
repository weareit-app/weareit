# Contract changes: oRPC API (`packages/api/src/contract.ts`)

All inputs/outputs are Zod-validated (constitution IV). `localeSchema = z.enum(["en", "es"])` is exported from `@it/domain/locale`.

## content.getPublished (changed output, no input)

No locale input: the client fetches every language and resolves on device (research R4).

```ts
publishedContentSchema = z.object({
  version, checksum, publishedAt,           // unchanged
  content: contentGraphSchema,               // English graph, unchanged (translations stripped)
  localized: z.record(
    localeSchema.exclude(["en"]),
    z.record(
      z.string().regex(/^(domain|pain|dream|first_action):[a-z0-9-]+$/),
      z.object({
        fields: z.record(z.string(), copySchema),
        status: z.enum(["reviewed", "machine"]),
      }).strict(),
    ),
  ),
}).strict();
```

Compatibility: snapshots published before migration 005 are read with `localized: {}`.

## account.setPreferredLocale (new, authenticated)

```ts
input:  z.object({ locale: localeSchema, chosenAt: z.string().datetime() }).strict()
output: z.object({ locale: localeSchema, updatedAt: z.string().datetime() }).strict()
```

Server keeps whichever of stored vs input timestamp is newer (FR-008) and returns the winner.

## account.getPreferredLocale (new, authenticated)

```ts
output: z.object({ locale: localeSchema.nullable(), updatedAt: z.string().datetime().nullable() }).strict()
```

## support.createCheckout (changed input)

```ts
input: z.object({ amountMinor, frequency, locale: localeSchema }).strict()
```

Passed to Stripe Checkout `locale`. The Stripe Customer's `preferred_locales` is set from the account language when signed in, otherwise from this `locale` (FR-017). Not stored for signed-out people beyond what Stripe keeps for the payment (FR-031).

## cms.* (changed graph)

`getDraft`, `saveDraft`, `previewDraft` carry `contentGraphSchema` with the new `translations` array ([data-model.md](../data-model.md)). `validateDraft` adds issues for: translation references an unknown record; translation field keys differ from the English record's; empty translated field.

New:

```ts
cms.translationStatus: oc.output(z.object({
  locale: localeSchema.exclude(["en"]),
  counts: z.record(z.enum(["domain","pain","dream","first_action"]),
            z.object({ total, missing, unreviewed, stale })),   // all z.number().int().nonnegative()
  items: z.array(z.object({ entityType, entityId, state: z.enum(["missing","unreviewed","stale"]) })),
}).strict())
```

`cms.previewDraft` accepts optional `locale` so the founder can preview in Spanish (FR-022).

## Auth requests (better-auth, not oRPC)

The app sends `X-It-Locale: en|es` on auth calls. The server validates it with `localeSchema`; invalid or missing → `en`. Used only to choose the email template (FR-016); not stored for signed-out requests.

## Measurement event (future; FR-032)

Whichever feature builds pre-signup measurement MUST include `locale: localeSchema` on coarse counts and stage-funnel events, with no identifier, and the privacy note copy (`privacy.measurement` in both catalogs) MUST mention it.
