# Design

## Context

See proposal.md for why. Current state:

- The personal page is the landing page at `/`; the societal page is `/onboarding/world` (`openspec/specs/pain-explorer`). Opening a pain, picking dreams and selecting fixes all live in one component, `apps/app/src/components/personal/pain-explorer.tsx`, with `pain-row.tsx` and `way-row.tsx`. There is no `/p/` route.
- Content is a database-backed graph published as immutable JSON snapshots (`openspec/specs/content-catalog`), read by the app through `content.getPublished` (`packages/api/src/contract.ts`). `content_pains.id` is the text primary key; there are no slugs, aliases, retired state, launch-set flag or detailed content. `content_provenance` covers domains, pains, dreams and fixes only.
- The editor (`apps/app/app/cms/index.tsx`, `updateRecord("id", …)`) lets the founder rename any record's ID, cascading through the draft.
- Pain images are presentation-only mappings in the app (`apps/app/src/content/illustrations.ts`); most pains have none.
- `apps/app/app.json` sets `web.output: "static"`. `docs/architecture/decisions.md` (Rendering) says: start static, evaluate Expo Router server output for dynamic share previews; hosting is open (lean SST on AWS).
- The required-signup-gate change (in flight) adds account picks (`account.getPicks`, per-item pick operations) and auto-save for signed-in pages. This change depends on it for signed-in pain pages.
- Measurement is not built. Spec 013 / AGENTS.md (2026-10-19) count a page view per pain page by pain ID and each pain opened by ID; the measurement change owns that.

## Goals / Non-Goals

**Goals:**

- One opened-pain behaviour shared by the list pages and the pain page, so they cannot drift.
- Resolving a slug needs only the published version: current slug, alias, retired-with-replacement, or not found.
- Links stay valid forever: slugs never reused, aliases never removed, published IDs never renamed.
- No new third parties on pain pages.

**Non-Goals:**

- Sending page views or pain opens (measurement change). The pain page only exposes the moments it needs.
- Universal links on iOS.
- An AI drafting tool inside the editor (pending confirm.md item 7).

## Decisions

1. **Extract an `OpenedPain` view.** Move the open-pain body (dreams, "Ways it can be better", tags, closed summary) out of `PainExplorer` into a component both the list pages and `/p/[slug]` render, reading and writing the same draft store (`apps/app/src/state/onboarding-store.ts`) or, when signed in, the account picks from required-signup-gate. _Alternative:_ a separate pain-page implementation; rejected because "exactly as on the personal page" would drift.

2. **Slug data lives in the content graph.** Add to the pain record: `slug`, `slugAliases[]`, `retired` (boolean), `replacementPainId`, `launchSet` (boolean), and `detail` (ordered sections). Database: columns on `content_pains` plus `content_pain_slugs (slug primary key, pain_id, kind current|alias, first_published_version)`, so global uniqueness and "never reused" are enforced by a primary key that is never deleted. The publish step checks the draft against this table. _Alternative:_ derive slugs from IDs; rejected because the founder chose a separate field (012 Q2).

3. **Semantic resolve operation.** Add `content.resolvePainLink({ slug })` returning one of `{ kind: "pain", painId, slug }`, `{ kind: "redirect", slug }` (alias or replacement), or `{ kind: "notFound", reason: "unknown" | "retired" }`, computed from the latest published version. Input validated with Zod (slug pattern, max length); anything failing validation is `notFound: unknown`. The app normalises case and trailing slash before calling, and uses `router.replace` for redirects so history holds only the current slug. `unknown` covers unpublished pains, so drafts are not revealed.

4. **Detailed content is versioned content.** Sections are `{ id, kind: "text" | "image" | "chart", body or asset, alt or summary, data (chart), sources: [{ title, url, date }] }`, validated in `packages/content` with Zod and published inside the snapshot. Extend `content_provenance` entity types to `pain_detail_section`. Images are stored behind a provider-neutral asset boundary and served from It's own origin, so pain pages load no third-party resources. Charts render from the sourced data in the snapshot with a text table, not from embedded third-party widgets.

5. **Published IDs are locked by `locked-content-ids`.** This change depends on that change (founder, 2026-10-19) and adds no lock of its own; slugs may change, IDs never do.

6. **Arrival hygiene.** On load of `/p/[slug]`, the app replaces the URL with the plain path (dropping query and fragment) before anything is stored or sent. A `Referrer-Policy: no-referrer` (or `<meta name="referrer">`) is set for all web pages, and outbound links carry `rel="noreferrer noopener"`.

7. **Previews need per-page output.** The page's title and image must be in the HTML a preview fetcher receives. Recommended: Expo Router server output for `/p/[slug]` only, rendering head tags from the published version (decisions.md already names this path). Fallback: generate static `/p/<slug>` HTML for every current slug and alias at publish time. Which one depends on the hosting decision (confirm.md item 6); if server output is chosen, record it in `docs/architecture/decisions.md`.

8. **Share.** Use the Web Share API where present, else copy to clipboard; the shared URL is built from the configured site origin and current slug only, never from `window.location`.

9. **Measurement seam.** Expose a typed "pain page shown (painId)" moment from the page with no subscribers, as required-signup-gate does for the gate. Assumption to confirm with the measurement change: it uses the stable pain ID, not the slug.

## Overlaps

- **required-signup-gate**: touches `pain-explorer` (ADDED "Sign-in link", "Signed-in picks live in the account"; MODIFIED "Moving on"), `on-device-choices` ("Clear choices", "Draft kept on the device") and adds `privacy-page`. This change only ADDs to `pain-explorer` and does not modify those blocks. Its pain-pages requirements "Signed-in visitors", "Device note and clear control", "Pain-page picks are saved at signup" and "Privacy page covers links" depend on that change's account picks, clear-control rule, signup payload and privacy page. If required-signup-gate is archived first, "Privacy page covers links" could move into `privacy-page`.
- **Measurement change (spec 013, not yet written)**: will modify `on-device-choices` "Nothing sent before signup" and own page views per pain page and pain opens. Here, "How a visit arrived is not recorded" and "Pain page privacy" defer counting to it; preview fetches not counting as visits is its concern too (012 Q14). Spec 012 FR-020's "no per-pain counting" is reversed by the 2026-10-19 invariant and is not carried over.
- **Content-catalog changes (own contributions review queue, evidence levels, any separate ID-lock change)**: all ADD to `content-catalog`. "Published IDs are locked" may duplicate a separate content change; whichever lands second should drop its copy. "Readable stable IDs" (baseline) is left unmodified.

## Risks / Trade-offs

- [Server output adds a runtime to an otherwise static site] → Limit it to `/p/[slug]`; keep the fallback of publish-time static pages.
- [Retired pains with saved picks] → Picks keep their content version; retired pains simply stop appearing on list pages. Showing them to signed-in owners is left to a later change.
- [Alias chains after several renames] → Every alias points straight at its pain, never at another alias.
- [Detailed content grows the snapshot] → Acceptable for the launch set (~31 pains); revisit if the snapshot becomes slow on phones.
- [Hosts that cannot truncate logs] → The requirement allows short retention with disclosure; pick a host where possible.
- [Most pains lack an image for previews] → Pending confirm.md item 8.

## Migration Plan

- Migration `007_pain_pages` (number after required-signup-gate's `006`): new columns, `content_pain_slugs`, provenance entity type. Backfill: every currently published pain gets `slug = id` as its current slug; the founder reviews them at the next publish (012 Q4 says approval is at first publish; existing pains count as first published by this change).
- Deploy API (resolve operation, publish checks) first, then the app route, then preview rendering.
- Rollback: remove the `/p/` route; slug data stays harmlessly in the content.

## Open Questions

- Final copy for the calm notes, the device note, the share line and "See more pains" (founder writes or approves).
- Chart library choice for web and iOS (must render without third-party network calls).
