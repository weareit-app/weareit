# What structure describes what It means, and what the MVP should shape for

- **Ticket**: [#176](https://github.com/weareit-app/weareit/issues/176), under the map [#156](https://github.com/weareit-app/weareit/issues/156). It feeds the grammar grilling ticket [#161](https://github.com/weareit-app/weareit/issues/161).
- **Date**: 2026-10-21. Launch is Mon Nov 2, 2026 ([#160](https://github.com/weareit-app/weareit/issues/160)).
- **Status**: research only, on a branch that is never merged. Nothing here is a decision. Where a line says "option", the founder chooses.
- **Question**: what structure describes what It means, and what's the smallest version of it the MVP's content and data should be shaped for?

## Short answer

- **It's own sources describe more than pain → dream → fix.** Six things a person meets, decides, or does have no place in it: a **frame** (which version of this is mine), a **situation** (what's true for me), a **pull** (something I want that isn't a pain), **other people** (who decides, who refuses, who acts with me, which futures we share), a **measure** (how I'd notice), and **results and revision** (I tried it; I changed my mind).
- **Three candidate grammars**, each adding to the one before: **B** adds a frame between pain and dream; **C** also adds a pull entrance and situations as links; **D** is the full loop, with pain → dream → fix kept as the front door. **A** is today's grammar with the rules and fields already chosen in #159 and #174.
- **Content cost rises steeply.** B mostly regroups dreams that already split by facet; C adds a record type, a probe that hasn't run, and a decision record; D adds outcome flows, privacy work, and authoring that took agents 15 to 45 minutes per situation.
- **The MVP can stay on A and still keep every later grammar open, if the signup work makes four cheap choices before it ships.** Content is already a flat graph of stable IDs and link tables, so adding frames or conditions later is additive there. The risk is in the picks. The device draft, the account tables, and the signup payload in `required-signup-gate` hard-code the pain → dream → fix path, and none of them is built yet. The four choices: a version on the payload and the draft, an upgrade step before the device discards a draft, a nullable pain on dream picks, and a fix selection that doesn't have to guess its dream.
- **Reading can't settle whether people want a frame step, come with pulls, or revise.** Each can be tested offline or with consenting participants before any grammar change, and none needs new measurement before signup.

## The candidates at a glance

| | A. Today, plus rules | B. Pain → frame → dream → fix | C. Pain or pull → frame → dream → fix, with situations | D. The full loop, pain → dream → fix as front door |
| --- | --- | --- | --- | --- |
| **Adds** | Nothing new in the grammar; scope notes, status label, rules | An optional frame layer on some pains | A pull entrance; conditions linked to dreams and fixes | Results, revision, measures, refusal, and shared action |
| **Holds that the others don't** | — | "Which version of this is mine?" and reframes, without rewording the pain | Dreams with no pain; "this fits if you…" | "I tried it", "they said no", "I changed what I want", "we're doing this together" |
| **#159 breaks it fixes** | 1, 3, 4, 6, 7 by rule or field; 2a, 2b, 2c, and 5 only as stopgaps | Adds 2a and 5; helps 4 | Adds 2b natively and fix fit; widens the entrance | Adds 2c and 8; holds refusal (class 6's "decision received") |
| **What a person sees** | Today's pages | On some pains, "Which is closest to yours?" before the dreams | A second door, "Start from something you want"; fit notes on fixes | After signup, "I tried this" and a way to change a dream |
| **Content cost** | Low; rules exist | Medium; mostly regrouping existing dreams | High; probe, condition links, a new dream definition | Highest; not ready for authoring |
| **Before Nov 2?** | Yes | Possible only as content, not a new screen | No | No |

## 1. What It means, from its own sources

Each row is something a person meets, decides, or does that It's product sources describe, and where it lives in pain → dream → fix today.

| Thing | Where It's sources say it | Where it lives today | #159 class |
| --- | --- | --- | --- |
| **Pain**, **dream**, **fix** | `AGENTS.md` product intent; `GLOSSARY.md`; `docs/spec/features.md` §1–2 | The grammar itself | — |
| **Honest status** (is this real, existing, buildable, or a change we'd make together?) | `decisions.md`, "Generated possibility content"; copy guide status labels | A field; decided, but `contentFixSchema` in `packages/content/src/graph-schema.ts` has no field for it yet | 6 |
| **Frame**: which version of this is mine, or a reframe of it | Founder audit a24 ("whether the problem is the work itself or how it is managed" is a question It should ask); `evaluation.md`'s request for a per-pain scope note (both via `pdf-breaks.md`) | Nowhere. Leaks into dreams ("Understanding which kind of putting off I'm doing"), fixes ("Ask whether…"), and pain rewording | 2a, 5 |
| **Situation**: what's true for me | `features.md` "soon": personalised fixes; the visit linked at signup "to allow personalised fixes" (`decisions.md`, Identity and privacy); conditions note | Nowhere. A rule writes checks as their first fix | 2b, 3 |
| **Pull, not only pain** | `features.md` "soon": "Starting from a dream instead of a pain ('I want to write a novel')", must-not-block "Dreams can exist without a parent pain"; the MVP product spec's "not every desire comes from a pain" (via #139 §2.1) | The schema allows a dream with no pain link; `GLOSSARY.md` defines a dream as "a desired end state for one pain" | none recorded |
| **Other people acting with me** | `AGENTS.md`: "make progress with others"; the Group and New group kinds; `docs/pages/coordination/outline.md` ("It doesn't help people coordinate yet") | Fix kinds and copy only | 7 |
| **Other people deciding or refusing** | The Ask kind's rule never to imply a yes (copy guide); situation-graph rule "when someone else decides, the result is 'decision received'" (`VERDICT.md`); the lens prototype: pain → dream → fix "has nowhere to record a disagreement or a refusal" (`problem-statement.md`) | Copy only | 6, 8 |
| **Shared futures** | `docs/pages/coordination/outline.md` (two people, different futures, one fix under both); `society/outline.md` ("without one plan for everyone"); #174 (a dream may fit neighboring pains) | `painDreamLinks` and `fixDreamLinks` already let one dream serve several pains and one fix several dreams | 3 |
| **Contributing to It** (my pain, future, or way) | `decisions.md`, "Contributions"; `openspec/changes/own-contributions` | Its own records, kinds fixed to pain, future, and way | — |
| **A measure**: how I'd notice it's better | H5 in the #139 note; measure-shaped dreams ("Seeing whether I'm wearing down or recovering") | Nowhere; a Feature fix as stopgap | 2c |
| **Results and revision** | `features.md` "soon": personal story, explicit paths; H3 and H8 in the #139 note; #174 defers revision past launch | Nowhere | 8 |

Two things the sources say the grammar already does well: pain as the front door (the deep-research report keeps it, via #139 §7.6) and several dreams per pain as a small test of coordination (`coordination/outline.md`).

## 2. Candidate grammars

### A. Today's grammar, plus rules (baseline)

What #159 and #174 already chose or proposed: end-state dreams with a value-level test, presence wording, a per-pain scope note, checks as first fixes, the four-value status label, sources per claim, and no scores or streaks (`pdf-breaks.md`; #174 resolution; `mvp-scope.md` §1–4). It is listed so the others have something to add to.

- **Leaves unheld**: the frame (stopgap: a Feature fix, "Questions It should ask", which files a question under a dream it was meant to choose between), pulls, results, and refusal.
- **Cost**: scope notes for up to 120 shown pains; everything else is generator rules.

### B. Pain → frame → dream → fix

An optional frame layer: on pains where people's versions differ, two to four frames ("Is this about falling asleep, waking up, or the hours you have to keep?", H1) come before the dreams, and each dream links to the frames it answers. Pains without frames are unchanged. This is the dream-layer note's option C (facet, then dream).

- **Holds**: frames and reframes as records, so a reframe adds a frame instead of rewording the pain.
- **Fixes**: 2a (frames leave the dream slot and the "Ask whether…" fixes); 5 (rewording churn: 94 of 120 shown lines reworded at least once, 17 runs stale, per `pdf-breaks.md`); helps 4, since the frame carries the pain's wording and the dream the presence wording (dream-layer option C).
- **What a person sees**: "Which is closest to yours?" before the dreams on some pains, and the dreams for that frame first. The rest of the pain's dreams stay visible underneath, so a frame informs and doesn't exclude (the conditions note's rule).
- **Content cost**: the dream-layer note says a facet layer "doubles the items a writer drafts and the founder reviews per pain", but also that the redrafted poor-sleep dreams "map almost one-to-one to facets". Inference: for pains like that, frames are mostly a grouping of dreams that already exist, plus 2 to 4 short lines. The founder reviews each frame once. A generator stage between research and dreams, and a screen for it.
- **Risk**: an extra tap before anything hopeful (dream-layer note); a frame can feel like being told your problem is something else (#139 §9, "Reframing as a skill").

### C. Pain or pull → frame → dream → fix, with situations as links

B, plus two things:

- **A pull entrance.** A dream can be reached without a pain ("I want to write a novel"). It needs its own definition and checks, because the why test depends on a pain (`mvp-scope.md` §4.3), and a decision record, because `GLOSSARY.md` ties a dream to a pain.
- **Situations as links, not types.** A condition ("I work nights") is a plain statement; what it does to a dream or a fix lives on a link: more or less relevant, requires, blocks, helps, hinders (the conditions note's "smallest data model"). It informs and never excludes. A person's own conditions stay on the device before signup; storing them on the server needs a decision record (conditions note, Privacy implications).

- **Fixes**: 2b natively (checks hang off the conditions they test); fix fit ("won't fit night shifts"); the curiosity entrance has no recorded break, only the "soon" row in `features.md`.
- **What a person sees**: a second door, "Start from something you want"; "Fits if you share a bedroom" notes on fixes; later, optional "Is this you?" questions answered on the device.
- **Content cost**: condition statements and links per pain, on top of B. The probe that would say whether conditions earn a structure (discovery, organization, applicability) is designed and hasn't run (conditions note, "A probe design"). Curiosity dreams need a new brief and screen.

### D. The full loop, with pain → dream → fix as the front door

The #139 note's loop (situation → trouble or pull → frame → possibilities → moves → results → revise, plus settlement and coordination), or the deep-research report's chain (orientation → aim → model → operation → consequence → revision). Both keep pain → dream → fix as what people see first and put the rest underneath (#139 §7.6).

- **Holds**: moves typed by what they do (pragmatic, epistemic, generative, holding); outcomes on two axes, "did it help" and "did I learn something" (H8); a revised dream (H3); a measure (H5); a refusal as information; groups acting together.
- **Fixes**: 2c and 8; refusal and "decision received" (class 6, situation-graph rules); the lens prototype's gaps for disagreement and refusal.
- **What a person sees**: after signup and only by choice, "I tried this" with outcomes such as helped, didn't help, couldn't (someone said no), learned something, and changed what I want (`mvp-scope.md` §2), and a way to change a dream while keeping the old one as history. Before signup, all of it stays on the device.
- **Content cost**: highest. The situation graph, the closest prototype, took agents 15 to 45 minutes per situation, and three authors disagreed on eleven points (`VERDICT.md`; `mvp-scope.md` §1). The #139 note rates its own loop as low-confidence and untested, and warns that it "is general enough to describe almost anything" (§7.4). The lens prototype found no lens with a mechanism for where a new distinction comes from (`problem-statement.md`, finding 3).
- **Theory caution**: the situated-inquiry program aims to develop the structure "without prematurely fixing It's ontology" (`~/Research/situated-inquiry/docs/research-program.md`). Its claim ledger has proved only toy results (C-001 to C-017) and lists its two descriptive claims, C-006 and C-018, as conjectures (`docs/claims/ledger.md`). Nothing there is ready to shape It's grammar.

## 3. What the MVP must design for now

Launch content can stay on grammar A. What would break under a later grammar is not the content graph but **picks saved under the old shape**: on devices, in accounts, and in the signup payload. Content is a flat graph of records with stable IDs and link tables (`contentGraphSchema`), published as versioned snapshots, with IDs locked once published (`locked-content-ids`). So adding frames, conditions, or pull entrances later means new tables and links, not moved records. The picks side is where the path is hard-coded, and none of it is built yet: `required-signup-gate` task 1.1 (the pick tables) is unchecked.

### What is hard-coded today

- **On the device**, `personalPathSchema` (`packages/domain/src/onboarding.ts`) stores `{painId, dreamIds, fixIds}` per pain. A fix pick doesn't say which dream it was picked for, and `rankWays` shows one fix once for every picked dream it serves.
- **The signup payload** is `account.savePicks({contentVersion, picks: [{scope, painId, dreamId, fixIds[]}], optIn})`, and the tables are `user_dream_picks (user_id, scope, pain_id, dream_id, content_version, picked_at)` and `user_fix_selections (user_id, scope, pain_id, dream_id, fix_id, content_version, selected_at)`, each with a unique key on its identity columns (`required-signup-gate/design.md`, decisions 1 and 2). So the server keys each fix selection by a dream that the device doesn't record. Inference: the client would have to guess it whenever a fix serves two picked dreams. `mvp-scope.md` §2 flagged the same gap.
- **The draft loader** discards data that fails the schema: "invalid data SHALL be discarded" (`required-signup-gate/specs/on-device-choices/spec.md`). A later draft shape would silently wipe pre-signup picks, which can't be recovered because they never left the device.
- **Contributions** have kinds fixed to pain, future, and way, but `place` is `jsonb` (`own-contributions/design.md`, decisions 2 and 7), so a new parent type changes only the schema that validates `place`.

### Cheap choices

| # | Choice | Kind | Lands in | Needed by | Cost now | If skipped |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | **A version on the signup payload and the device draft.** `savePicks` takes a `payloadVersion`, validated as a Zod discriminated union, so the server can accept an old client's shape after the grammar changes. | Field | `required-signup-gate` (contract) | B, C, D | One field, one test | Old clients in open tabs or on old iOS builds send a shape the server rejects or misreads |
| 2 | **Upgrade, then validate, the device draft.** Before discarding an invalid draft, try a known upgrade from each earlier version. `it-onboarding-draft-v1` is already a versioned key. | Rule | `on-device-choices` spec | B, C, D | One function, one test | A grammar change wipes every unsent pre-signup pick |
| 3 | **A fix selection that doesn't guess its dream.** Either record on the device the dream each fix was picked under, or key `user_fix_selections` by (pain, fix) and derive the dreams from `fixDreamLinks` in the pick's content version. | Field or ID rule | `onboarding.ts` and `required-signup-gate` design | A already; B and D need a reliable path | Small, while nothing is built | Fix picks saved with guessed dreams; a later "personal story" or explicit path reads them as intent |
| 4 | **The pain on a dream pick may be empty.** `user_dream_picks.pain_id` nullable (with `NULLS NOT DISTINCT` on the unique key, or a sentinel), so a dream reached from a pull or a frame can be saved without a fake pain. A later `frame_id` column is then additive. | Field | `required-signup-gate` migration | C (pull); B (frame context) | One column property | A migration that rewrites the identity key of every saved pick |
| 5 | **Dream IDs name the end state, not the pain.** No pain prefix in a dream ID, since IDs lock at first publish and a dream may fit neighboring pains (#174). The pilot's IDs already follow this (`sleeping-through-the-night`, `room-for-family`). | ID rule | Generator README; first-publish check in `locked-content-ids` | A (shared dreams), B, C | A sentence in a rule | A published dream ID that reads wrong under its second pain and can't be renamed |
| 6 | **A dream with no pain link validates and publishes.** One content-catalog test, so nobody adds a "dream needs a pain" rule by accident (`mvp-scope.md` §2). | Test | `content-catalog` | C | One scenario | The pull entrance needs a schema migration first |
| 7 | **An optional scope note per pain** ("means" and "doesn't mean"). In B, it is where the first list of frames comes from. | Field | Pain catalog record, generator brief | A (class 5), B | Writing up to 120 notes, which the generator can draft | Frames stay hidden in rewording |
| 8 | **Frames, if added, shown inline on the pain page, not as their own pages.** Measurement records page views by page and pain ID (`visit-measurement` measurement spec). Inference: a frame page view would be a pick-shaped signal sent before signup. | Rule | Later frame change | B, C | None now | A measurement spec change that edges toward sending picks |

Already in place or decided, and needed by every candidate:

- **Content version on every pick**, and every published snapshot kept (`required-signup-gate`; `locked-content-ids` design, decision 1). Together they let a later change map old picks onto new records. That map (old ID to new ID or frame) can wait until a grammar change needs it.
- **Stable, locked IDs** for domains, pains, dreams, and ways (`locked-content-ids`), and slugs kept apart from IDs (`features.md` §2b).
- **Link tables, not nesting**: `painDreamLinks` (with the per-pain `position` that `own-contributions` adds) and `fixDreamLinks`. Frames and conditions would be further link tables.
- **No scores, streaks, or measures** in v0.1, and outcome values that don't count "changed my mind" as failure (#174; `mvp-scope.md` §1).
- **The status label on every fix**: needed now under every candidate, already decided, not yet in the schema (`mvp-scope.md` recommendation 1).

Generator-only fields that cost nothing in the app and give D real examples later: `evidenceKind`, `reveals` and `decides` for checks, `needsToStart` and `needsToSucceed`, and `ifNo` on Ask fixes (`mvp-scope.md` §4).

## 4. What reading can't settle, and how to test it

The measurement invariant rules out counting picks before signup (`AGENTS.md`), so none of these can be read from launch traffic. Each test below uses the generator offline, founder-run sessions with people who agree to take part, or signed-up people's explicit choices.

| Question | Why reading can't settle it | Test that keeps the privacy invariants |
| --- | --- | --- |
| Do frames help people find their version faster, or feel presumptuous? (H1) | No source tests a facet step in a product (dream-layer note, Gaps) | Offline: generate sleep, rent, and loneliness with and without a frame stage; founder judges. Then 5 to 8 consenting participants walk through both versions in a local prototype, with no production data |
| What does a frame layer cost to write and review? | Only the poor-sleep mapping has been checked | Offline: time a frame pass on the 3 redrafted pilot pains and count how many dreams regroup cleanly |
| Do people arrive with pulls, not pains? | Only the founder's "soon" row and the MVP product spec say so | After signup, by choice: contributed futures that fit no pain, in the review queue. Consenting interviews |
| Do conditions improve dreams and fixes? | The probe is designed and hasn't run | Offline: the conditions probe on the three pilot pains (discovery and organization now; applicability after the fix stages) |
| Do people revise dreams, and what do refusals look like? (H3, H8) | Nothing has been tried yet (`pdf-breaks.md`, class 8) | After launch, after signup, opt-in: ask a few people in their own words. Before signup, any record stays on the device |
| Can the loop's levels of revision be told apart? | The #139 note lists it as untested | Offline: two coders on consented or public accounts (the situated-inquiry casebook's work, not It's) |

## Gaps

- **Unverified**: that Neon's default PostgreSQL version supports `NULLS NOT DISTINCT` (PostgreSQL 15 and later) was not checked. A sentinel value works either way.
- **Unreviewed inputs**: the #139 note, the MVP scope note, the problem statement, and the conditions note are drafts the founder hasn't reviewed. Five documents the deep-research report relies on were never found (#139 §9).
- **Cost figures are judgements.** No grammar has been timed beyond the situation graph's authoring rounds.
- **Signup design as of `f6e71b1`.** This reads `required-signup-gate` on master at that commit. No open pull request touched it on 2026-10-21 (`gh pr list`); unpushed local work wasn't checked.
