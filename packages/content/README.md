# MVP content package

Product content is database-backed from the start. PostgreSQL is authoritative for domains, pains, dreams, first actions, provenance, and published versions. The current TypeScript content in this package is temporary scaffold and initial import material, not a second runtime source of truth.

The structured Tier 1 pain/future copy is CC0-1.0 content. The TypeScript schemas and functions are software under the repository's software license. Research provenance is content data; prompts describe user language and should not be mistaken for sourced empirical claims. Preserve candidate wording from `docs/source/it_mvp_tier_1_pains_and_dreams.md` when importing and editing presentation copy.

`src/schema.ts` provides Zod validation for import, publish, and API boundaries. Keep image and UI mappings in the app package; this package must stay independent of React Native and Expo.

The first-party CMS is a focused structured editor: draft content, validate IDs and relations plus provenance, preview onboarding, and publish a versioned snapshot with rollback. `src/first-actions.ts` supplies initial import material for a small set of pain-to-action links. Each action includes source, effort estimate, and whether it is practical or a candidate to investigate. The bedroom HEPA idea is conditional and presented as a hypothesis, not medical advice.

Essays for the public pages are Markdown files in `essays/`, turned into a typed module at build time; the format is in `essays/README.md`. The Markdown parser is a build-time dependency only (`essay-build/`), never exported.
