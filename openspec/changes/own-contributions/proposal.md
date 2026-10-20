# Proposal

## Why

"We are It" means the pains, futures and ways come from the people using It, not only from the founder. The founder decided on 2026-10-18 that people can add their own pain, future or way in the MVP (decisions.md "Contributions"; features.md §1 and §2; spec 001 FR-021–FR-026). Today nobody can add anything (pain-explorer "Known divergence"), and there is no review queue (content-catalog "Known divergence").

## What Changes

What people see and do, screen by screen (features.md §1 "Add your own pain, future or way", §2 "Includes adding your own", §6 "Review queue"):

- **Personal and societal pages, a group**: at the end of each group, "Add a pain". It opens a short form in place: a name and a first-person line ("Night shifts — I never see daylight.").
- **An open pain, its futures**: under the futures, "Add a future". The form asks for a name and a first-person line, and where it fits among the pain's other futures, with a live preview of the joined sentence ("I drift off without a fight, sleep through the night, and wake up ready."). A line that isn't one first-person sentence ending in a period is explained and not saved.
- **An open pain, its ways**: under the ways, "Add a way", for one of the futures picked under that pain. The form asks for a name, a line and its type.
- **Using it straight away**: what the person adds appears in place and is picked, exactly like published content: it shows in the closed pain's sentence and in "I could:". It is marked "Only you can see this". The person can edit or remove it.
- **Before signup**: everything they add stays on this device. Nothing about it is sent or counted.
- **After signup, "Send for review"**: each item the person added offers "Send for review". Only that explicit choice sends it. The mark changes to "In review", then "Added" once the founder publishes it, or "Not added" if the founder declines it (the person keeps their own copy).
- **Founder's content editor, Contributions**: a minimal queue of sent items. For each: approve (editing the wording, choosing its ID and, for a future, its position), link it to an existing pain, future or way instead, or decline. Approved items enter the draft content and go public at the next publish. Published content never says who contributed it.
- **Futures order per pain**: each pain's futures have their own position, which sets their order on the page and in the joined sentence. The contributor chooses their future's position; the founder can change it in the editor.

Out of scope: the rest of the admin area (spec 006, not yet written; this change builds only the queue it needs), notifications about review decisions, sharing contributions with friends, matching on contributions, measurement of contributions after signup (the measurement change owns all measurement), and the Help page.

Must leave room for (features.md Stages): personal story of chosen futures (own items keep the content version they were placed under), sharing a future or path (contributions stay private until approved; approval publishes a separate, anonymous record), starting from a dream instead of a pain (a contributed future always has a pain here, but the stored record must not require one), explicit paths (own ways keep their pain → future placement with a stable local ID), evidence tags on ways (an approved way gets "Not tested yet" unless the reviewer sets another level).

## Capabilities

### New Capabilities

- `own-contributions`: adding your own pain, future or way on the personal and societal pages, using it straight away on the device, the visible states, and sending it for review after signup.
- `contribution-review`: the founder's queue of sent contributions in the content editor (approve with edits, link to existing, decline) and the private provenance kept for each.

### Modified Capabilities

- `content-catalog`: each pain–future link gets a position that the founder can change; approved contributions become ordinary published records with no contributor shown.
- `pain-explorer`: futures follow each pain's position on the page and in every joined sentence.
- `on-device-choices`: own contributions are kept on the device, removed by "clear choices", and not touched by the signup save.

## Impact

- Shared: `packages/content/src/graph-schema.ts` (position on pain–dream links; first-person line rule), `packages/domain` (own-contribution schema and placement helpers), `packages/api/src/contract.ts` and `router.ts` (semantic contribution and review operations), `packages/database` (migration for link positions, contributions and provenance tables).
- App: `apps/app/src/components/personal/pain-explorer.tsx`, `pain-row.tsx`, `way-row.tsx`, `future-sentence.ts` (order and own items), new add/edit form components, `apps/app/src/state/` (own-contribution store under its own device key), `apps/app/app/cms/index.tsx` (Contributions queue, futures reordering).
- No new third-party services or dependencies.

## Open questions

All answered by the founder on 2026-10-19, each as recommended; see `confirm.md`.
