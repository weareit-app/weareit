# Tasks

Founder answers are in (2026-10-19, see confirm.md); "needs confirm.md item N" notes are kept for traceability. Depends on `locked-content-ids` for the published-ID lock. Groups 1–4 can start once required-signup-gate's data model (its tasks 1–2) has landed.

## 1. Content model and publishing

- [ ] 1.1 Add `slug`, `slugAliases`, `retired`, `replacementPainId`, `launchSet` and `detail` sections with sources to the pain schema in `packages/content/src/schema.ts` and `graph-schema.ts`; verify schema tests reject bad slugs, double hyphens, sections without dated sources and images without alt text
- [ ] 1.2 Write migration `007_pain_pages` (columns, `content_pain_slugs`, provenance entity type `pain_detail_section`) with a backfill of `slug = id` for published pains; update `packages/database/src/types.ts`; verify migrate up/down on a test database
- [ ] 1.3 Extend publish validation: slug uniqueness against every slug ever published, aliases kept on slug change, replacement must be published and not retired, first-publish slug approval recorded; verify repository tests for reuse, alias retention and invalid replacement

## 2. Resolving links

- [ ] 2.1 Add `content.resolvePainLink` to `packages/api/src/contract.ts` and `router.ts` with Zod input; verify router tests for current slug, alias, retired with and without replacement, unpublished pain (same as unknown), malformed slug
- [ ] 2.2 Include slug data and detailed content in `content.getPublished`; verify the snapshot test

## 3. Pain page

- [ ] 3.1 Extract the opened-pain view from `pain-explorer.tsx` into a shared component used by the list pages; verify existing pain-explorer tests and a Playwright run of the personal page still pass unchanged
- [ ] 3.2 Add `apps/app/app/p/[slug].tsx`: normalise case and trailing slash, strip query and fragment with `replace`, resolve, redirect aliases and replacements with `replace`, render the shared opened-pain view with name and first-person line; verify Playwright: tags removed from the address, old slug shows current slug, no welcome step
- [ ] 3.3 Send unknown, unpublished and retired-without-replacement slugs to the personal page with the calm note (placeholder copy), never echoing the slug; verify Playwright for a mistyped slug and `/p/<script>`
- [ ] 3.4 Add the device note and clear control (signed out only), "See more pains" to `/`, and signed-in picks via account operations; verify Playwright: picks on a societal pain's page appear on the societal page; signed-in change persists after reload
- [ ] 3.5 Add "Share this topic" (Web Share API, clipboard fallback, URL from configured origin and slug only) with its line; verify unit test that the shared URL has no query or fragment
- [ ] 3.6 Render detailed sections, images and charts with sources, text alternatives and data tables, showing nothing for missing parts (needs confirm.md items 2 and 3); verify Playwright on a launch-set fixture and a basic pain
- [ ] 3.7 Expose a "pain page shown (painId)" moment with no subscribers; verify no request is made on page load beyond content
- [ ] 3.8 Accessibility pass: focus on heading at arrival, checked and expanded states, polite announcements, calm note announced once, reduced motion; verify with keyboard-only and VoiceOver/screen-reader runs recorded in the PR

## 4. List pages

- [ ] 4.2 Add the dismissible calm note on `/` for dead-link arrivals; verify it does not show on a direct visit

## 5. Content editor

- [ ] 5.2 Add slug editing with first-publish approval, alias list, retire with replacement, launch-set toggle and highlight with detailed-content status, and copy-link; verify editor tests and a manual publish in development
- [ ] 5.3 Add detailed-content editing with sources and image upload behind the asset boundary (needs confirm.md items 3 and 7); verify an image is served from It's own origin

## 6. Privacy, previews and hosting

- [ ] 6.1 Set `Referrer-Policy: no-referrer` for web and `rel="noreferrer noopener"` on outbound links; verify response headers and a source-link click in Playwright
- [ ] 6.2 Implement per-page preview tags for `/p/<slug>` (title and image) using the chosen rendering path (needs confirm.md items 6 and 8); record the decision in `docs/architecture/decisions.md` if server output is used; verify with a curl of the page HTML and a preview debugger
- [ ] 6.3 Configure hosting logs to drop or truncate IPs and paths, or set short retention; verify by reading the host configuration and a sample log line
- [ ] 6.4 Add the links and hosting-log section to the privacy page (from required-signup-gate), describing counting only as the measurement change defines; verify text matches 6.1–6.3 behaviour

## 7. Integration checks

- [ ] 7.1 Playwright end to end: open a tagged link on a fresh browser, pick a dream and select a fix, See more pains, reach the gate, sign up; account holds those picks with content version
- [ ] 7.2 Inspect storage and every request during 7.1: no tags, referrer, link or picks before signup
- [ ] 7.3 Publish versions that reword a pain, change its slug, and retire pains with and without replacement in development; every old link lands as specified

## Workflow follow-up

- Founder answers `confirm.md` and approves placeholder copy.
- Archive with `/opsx:archive` once shipped, then fill the `specs/012-entry-links/` row in `docs/spec/MIGRATION.md` (001 FR-027 dropped: the personal and societal pages do not link to pain pages).
