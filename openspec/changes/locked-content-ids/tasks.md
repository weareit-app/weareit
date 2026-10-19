# Tasks

Do not start until the founder has answered `confirm.md`; adjust specs first if any answer differs from its recommendation.

## 1. Server

- [ ] 1.1 Add a repository function returning every `{kind, id}` in any published version (groups, pains, dreams, ways); verify with a database test across two versions where one record was removed
- [ ] 1.2 Extend validation to return `removedPublishedIds` and `firstTimeIds` and to refuse `new-…` placeholder IDs; verify with repository tests for delete, rename, new record and placeholder cases
- [ ] 1.3 Require matching `confirmRemovedIds` and `confirmFirstTimeIds` in `cms.publishDraft` and `cms.rollback` (contract, router, repository); verify with API tests that missing, partial or stale confirmations are refused and exact ones publish

## 2. Editor

- [ ] 2.1 Return the published-ID set with `cms.getDraft` and render the Stable ID read-only (with the explanatory line and screen-reader label) for published records in `apps/app/app/cms/index.tsx`; verify by selecting a published and an unpublished pain
- [ ] 2.2 Show the removal and first-time ID lists with keyboard-usable confirmation before publish and rollback; verify by deleting a published dream, adding a new one, and publishing; then rolling back
- [ ] 2.3 Check the locked field and confirmation lists by keyboard and screen reader; verify by a manual pass recorded in the PR

## Workflow follow-up

- After archive, remove the content-catalog "Known divergence" line about renaming published IDs.
