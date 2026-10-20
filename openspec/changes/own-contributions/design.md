# Design

## Context

See proposal.md for why. Current state:

- Content (`packages/content/src/graph-schema.ts`): pains, dreams and fixes have readable IDs and a global `sortOrder`; `painDreamLinks` are `{painId, dreamId}` with no position. `pain-explorer.tsx` lists a pain's dreams in the order of the link array, and `future-sentence.ts` (`joinFutureLines`) joins lines in the order given. So "content order" is an accident of array order today.
- The CMS (`apps/app/app/cms/index.tsx`) edits domains, pains, dreams and first actions through one whole-graph `cms.saveDraft`; it has no ways (fixes) tab, no reordering of a pain's futures, and no queue. Access is the single `CMS_ADMIN_TOKEN`.
- The on-device draft (`packages/domain/src/onboarding.ts`, key `it-onboarding-draft-v1`) holds pains and per-pain paths of IDs only. The in-flight `required-signup-gate` change clears that draft after a confirmed save and drops picks whose IDs are not in the claimed content version.
- "Contribution" already names support payments in the database (`support_contributions`). New tables need a distinct name.
- Published lines are not all "I …" sentences: 17 start "I", 5 "My", others "We", "Someone", "The", "What". A first-person check must accept these forms or the founder's own content would fail it (confirm.md Q7).

## Goals / Non-Goals

**Goals:**

- Own items render through the same code paths as published content, so they look and behave the same apart from their state mark.
- Nothing about own items leaves the device without an explicit "Send for review" after signup.
- One explicit, per-pain position on pain–dream links drives page order and sentence order for everyone.

**Non-Goals:**

- The admin area beyond the queue (spec 006), role-based editor access, notifications, and measurement of contributions.
- Moderation tooling beyond approve/link/decline, and crisis guidance (planned for after v0.1).

## Decisions

1. **Explicit link position.** Add `position: int` to `painDreamLinks` in the content schema (default from current array order when reading older versions, so published versions stay readable) and a `position` column on `pain_dream_links` via a new migration. The app sorts a pain's dreams by it; `joinFutureLines` callers pass lines in that order. _Alternative:_ keep relying on array order; rejected because the reviewer must change positions explicitly and reorders must survive normalisation into SQL.

2. **Own items live under their own device key.** A separate store, `it-own-items-v1`, holds `{localId, kind, name, line, wayType?, place: {scope, groupId | painRef | painRef+futureRefs}, afterFutureRef?, contentVersion, picked, state, serverId?}`. `localId` is random per item, never derived from the person, never sent before signup. Keeping it apart from `it-onboarding-draft-v1` means the signup gate's "clear the draft after save" cannot delete unsent items, and the gate's pick payload never contains them. "Clear choices" clears both keys. _Alternative:_ extend the onboarding draft; rejected because it couples own items to the gate's save-and-clear lifecycle.

3. **Placement relative to published content.** A future stores "after future X (or first)" rather than an absolute number, so a later content version that inserts or removes futures still places it sensibly; if X disappears it goes last. Own parents are referenced by `localId`, published ones by ID.

4. **Merge at render time.** A pure function in `packages/domain` takes the published graph plus own items and returns the page model (groups → pains → ordered futures → ranked ways) with an `own` flag and state per item. The pain explorer renders that model; the existing pick helpers (`toggleDream`, `toggleFix`) apply to published IDs, while own items carry their own `picked` flag.

5. **Line rule in one Zod schema.** `packages/content` exports `futureLineSchema`: trimmed, starts with a capital letter or "I", ends with exactly one period, no other `.`, `!` or `?` followed by a space, contains a first-person word (I, I'm, me, my, mine, we, us, our), and a maximum length (confirm.md Q7, Q10). The form and the API both use it.

6. **Semantic operations.** In `packages/api` (Zod-validated): `contributions.send({kind, name, line, wayType?, place, position?, contentVersion, parents?})` (signed-in only), `contributions.listMine()` (states for the signed-in person), and `contributions.withdraw` only if confirm.md Q4 is accepted. Founder-only: `cms.listContributions()`, `cms.approveContribution({id, edits, recordId, position?})`, `cms.linkContribution({id, targetKind, targetId})`, `cms.declineContribution({id})`. Approve writes the new record into the CMS draft using the same draft revision checks as `saveDraft`.

7. **Storage.** New tables `people_contributions (id uuid, user_id, kind, name, line, way_type, place jsonb, position, content_version, state, sent_at, decided_at, resolved_record_id)` and nothing in the content tables points back to them. Provenance lives only on `people_contributions`; published snapshots never include `user_id`. "Added" is computed when `resolved_record_id` first appears in a published version (confirm.md Q8).

8. **After a decision.** `listMine` returns state and, for "Added", the published record ID; the app then shows the published record and moves the person's pick to it, hiding its own copy (confirm.md Q9). For "Not added", the own copy stays.

## Overlaps

- `required-signup-gate`: its on-device-choices "Device copy cleared after a confirmed save" and "Clear choices" (MODIFIED there) — this change adds separate ADDED requirements ("Own contributions survive the signup save", "Clearing removes own contributions") rather than modifying those blocks; its account-signup "Save picks to the account" drops unknown IDs, which is why own-item picks are not in that payload; its "Signed-in picks live in the account" means a signed-in page merges account picks with own items held on the device; its account-settings "Sign out" removes cached account data (see confirm.md Q2).
- Pain pages (`/p/<slug>`): a pain page reuses the pain explorer, so "Futures follow each pain's order" applies there; whether "Add your own" appears there is confirm.md Q13. An approved contributed pain needs a slug approved at first publish, which the pain-pages change owns.
- Measurement: "Own contributions privacy" forbids any counting before signup; post-signup measurement of contributions is not specified here and belongs to the measurement change.
- `fix-evidence-levels`: "Approved way defaults" sets "Not tested yet"; the evidence change owns how levels and claims are stored and edited. Approving a way needs a ways form in the editor, which the evidence change proposes adding.
- `locked-content-ids`: the reviewer chooses an approved record's ID, which locks at its first publish.

## Risks / Trade-offs

- [Unsent items only exist on one device, even after signup] → Say so in the "Only you can see this" help text; "Send for review" is the way to keep them with the account (confirm.md Q1).
- [Abuse in the queue] → Nothing is public before review; 20 sends per account per day and a decline note, both founder-approved before launch (confirm.md Q11).
- [The first-person check rejects reasonable lines] → Explain with examples in the form; founder can tune the rule in one schema.
- [Founder edits the whole graph in the CMS while approving] → Approve uses the same expected-revision check as `saveDraft`.

## Migration Plan

- Migration `00N_people_contributions`: add `position` to `pain_dream_links` (backfilled from current link order per pain) and create `people_contributions`. No production data exists.
- Older published versions without positions are read with positions from array order.
- Deploy API, then app; rollback by reverting the app (unused tables are harmless).

## Open Questions

None that can safely wait; every open founder question changes behaviour and is in proposal.md and confirm.md. The specs reflect each recommendation and must be adjusted if the founder chooses otherwise.
