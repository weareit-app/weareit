# Tasks

Do not start until the founder has answered `confirm.md`; adjust specs first if any answer differs from its recommendation.

## 1. Per-pain order of futures

- [ ] 1.1 Add `position` to `painDreamLinks` in `packages/content/src/graph-schema.ts`, defaulting older versions to array order, and verify with content tests that an old published version parses with positions 0..n per pain
- [ ] 1.2 Add a migration adding `position` to `pain_dream_links`, backfilled per pain from current order, and read/write it in `content-repository.ts`; verify with a database test that save → read round-trips positions
- [ ] 1.3 Sort a pain's futures by position in `pain-explorer.tsx` and pass lines in that order to `joinFutureLines`; verify with a test that tap order does not change the sentence
- [ ] 1.4 Add move-up/move-down controls for a pain's futures in the CMS pain view; verify by reordering, publishing and seeing the new order on the personal page

## 2. Line rule and own-item model

- [ ] 2.1 Export `futureLineSchema` and name/line length limits from `packages/content`; verify with unit tests covering one sentence, missing period, two sentences, "?"/"!", and published lines that start "My", "We" and "Someone"
- [ ] 2.2 Add the own-item schema and a pure merge function (published graph + own items → page model with ordered futures and own flags/states) in `packages/domain`; verify with unit tests for own pain, own future placed after X, X removed in a later version, and own way ranking

## 3. On the device

- [ ] 3.1 Add an own-items store under `it-own-items-v1` in `apps/app/src/state`, validated on load with bad entries dropped; verify with a test that one invalid entry does not discard the rest
- [ ] 3.2 Make "clear choices" clear own items too and update its confirmation text; verify with a test and by hand in the browser
- [ ] 3.3 Verify with an app test that the signup save neither sends nor removes own items (depends on `required-signup-gate`)

## 4. Adding on the pages

- [ ] 4.1 Build the add/edit form (name, line, future position with live preview, way type and futures served) with labels, keyboard placement and announced errors; verify with component tests and a keyboard-only pass
- [ ] 4.2 Add "Add a pain" at the end of each group, "Add a future" under futures and "Add a way" under ways on both pages, rendering own items with their state mark; verify by adding one of each, reloading, and checking previews and summaries
- [ ] 4.3 Verify by inspecting network requests in the browser that no request carries own-item text, placement or counts before signup

## 5. Sending and review

- [ ] 5.1 Add migration and repository for `people_contributions`, and contract/router operations `contributions.send` and `contributions.listMine` (signed-in only, Zod-validated); verify with API tests, including UNAUTHORIZED when signed out
- [ ] 5.2 Add "Send for review" (signed in only) and state updates ("In review", "Added", "Not added") in the app; verify by sending an item and seeing its state change after each founder action
- [ ] 5.3 Add founder-only `cms.listContributions`, `cms.approveContribution`, `cms.linkContribution`, `cms.declineContribution`; approval writes into the draft with the revision check and defaults a way's evidence to "untested"; verify with API tests for each action and for refused access
- [ ] 5.4 Add the Contributions queue to `apps/app/app/cms/index.tsx` with keyboard-usable approve/edit/link/decline; verify by reviewing items end to end and checking the published snapshot carries no contributor field
- [ ] 5.5 Compute "Added" from the first published version containing the resolved record and move the contributor's pick to it; verify with an API test and in the app

## 6. Integration

- [ ] 6.1 Run `pnpm test` and `pnpm typecheck`, and walk the full flow on web: add before signup, sign up, send, approve, publish, see "Added" and the published record on another browser without any contributor hint

## Workflow follow-up

- After archive, update the "Known divergence" notes in `openspec/specs/pain-explorer` and `content-catalog` that say contributions and the review queue are not built.
