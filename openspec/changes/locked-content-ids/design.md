# Design

## Context

See proposal.md for why. Current state:

- The CMS edits one whole draft graph and saves it with `cms.saveDraft` (expected-revision check). Renaming a record's ID is client-side (`updateRecord` with `field === "id"`), cascading to `pains.domainId`, `painDreamLinks`, `fixDreamLinks`, `actionPainLinks` and `provenance` in the draft. The server sees only "old ID gone, new ID present", indistinguishable from delete-and-add.
- Records can also be deleted in the editor (`deleteSelectedRecord`). Ways (fixes) are not editable in the CMS yet; the `fix-evidence-levels` change proposes a Ways tab.
- `publishDraftContent` validates and inserts a full snapshot into `published_content_versions`; `rollbackToVersion` copies an old snapshot into the draft and publishes it.
- The content schema already enforces readable kebab-case IDs. New records get placeholder IDs `new-<kind>-<base36 time>`.
- No production data exists, so no past renames need repair.

## Goals / Non-Goals

**Goals:**

- No ID that has ever been published can change by accident, through the editor or the API.
- Keep the whole-draft editing model; no new content workflow.

**Non-Goals:**

- Slugs, aliases, retired states and replacements (pain-pages change).
- Preventing deletion altogether; deletion stays possible with explicit confirmation (confirm.md Q3).

## Decisions

1. **Published-ID set from snapshots.** Compute the set of `{kind, id}` that appear in any row of `published_content_versions` (confirm.md Q2). With few versions this is cheap; if it grows, cache it in a `published_content_ids (kind, id, first_version)` table filled at publish. _Alternative:_ only the latest version; rejected because a rollback could otherwise re-expose a renamed ID's old picks inconsistently.

2. **Lock in the editor.** `cms.getDraft` returns the published-ID set; the editor renders the ID field read-only for those IDs and blocks the rename cascade. Draft-only records stay editable.

3. **Guard on the server, not by guessing renames.** `cms.validateDraft` returns `removedPublishedIds` and `firstTimeIds`. `cms.publishDraft` and `cms.rollback` take `confirmRemovedIds` and `confirmFirstTimeIds`; the server refuses unless they exactly match what it computes (so stale confirmations fail too). A rename made outside the editor shows up as an unconfirmed removal plus a new ID. _Alternatives:_ UI lock only, rejected because the API accepts any graph; forbidding removal entirely, rejected because retiring content needs the pain-pages work first.

4. **Placeholder IDs refused at publish.** Publish validation adds an issue for any ID matching `^new-(domain|pain|dream|action|fix)-` (confirm.md Q6).

5. **Kinds covered.** Groups (domains), pains, dreams and ways (confirm.md Q1). First actions and sources keep today's behaviour.

6. **Re-adding a removed ID** is allowed and treated as the same record (confirm.md Q5); nothing can tell meaning apart, and blocking it would block rollbacks.

## Overlaps

- Pain pages (`/p/<slug>`): their slug approval at first publish sits beside "Approve first-time IDs"; both lists should appear in the same publish step. Retiring a pain (pain pages) will be the normal way to take a pain out of use instead of confirmed removal.
- `required-signup-gate`: its "Save picks to the account" drops picks whose IDs are not in the claimed content version; locked IDs keep that rare.
- `own-contributions`: an approved contribution's reviewer-chosen ID locks at first publish; its "Contributions become ordinary records" relies on this.
- `fix-evidence-levels`: its new Ways tab must use the same read-only ID field.
- Measurement: none.

## Risks / Trade-offs

- [Founder wants to fix a typo in a published ID] → Not possible by design; the slug (pain pages) and wording carry readability, and the ID stays internal.
- [Extra confirmation step at every publish with removals] → Lists only appear when something is removed or new.
- [Rollback becomes two steps when it removes IDs] → Same confirmation UI as publish.

## Migration Plan

- No migration unless the cache table in Decision 1 is needed.
- Deploy API (new optional confirmation fields accepted, then required) and app together; rollback by reverting both.
