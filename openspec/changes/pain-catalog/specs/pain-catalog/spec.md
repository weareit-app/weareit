# Spec Delta

## Purpose

The founder's catalog of every known human pain, shown on It's pages or not, and the agent pipeline that finds missing pains, sharpens wording and groups, records the founder's decisions and hands accepted changes to the content editor draft.

## ADDED Requirements

### Requirement: Catalog record
Each pain in the catalog SHALL have a stable ID, a short name, a first-person line, a page (`personal` or `societal`), one primary group with optional secondary groups, a status (`candidate`, `accepted`, `merged`, `retired` or `rejected`), a role (`shown` or `not-shown`), sourced evidence of how common it is, outside framework references in one shape, aliases, relations, a sensitivity tag and a decision history.

#### Scenario: Missing field
- **WHEN** a pain in the catalog has no line or no page
- **THEN** catalog validation fails and names the pain and the missing field

#### Scenario: Relations
- **WHEN** two pains are linked
- **THEN** the relation is one of `overlaps`, `broader`, `narrower`, `other-page`, `merged-into` or `split-from`, and points at an ID in the catalog

### Requirement: Seeded from the inventory
The catalog SHALL be seeded from the 125-pain inventory without changing any ID, keeping its wording, page, heading, framework references, evidence, overlaps and founder-pool area. A `current` pain becomes `accepted`, and is `shown` if it's in the editor's latest published version. A candidate the founder cut becomes `rejected`, and every other pain stays a `candidate`. After seeding, the catalog SHALL replace the inventory as the pain list that tools read.

#### Scenario: Seed keeps IDs
- **WHEN** the catalog is seeded
- **THEN** every inventory ID appears in it unchanged, and no other ID is added

### Requirement: IDs are never reused
An ID SHALL never be deleted or given to a different pain. A merged or retired pain SHALL keep its record, and looking up a merged ID SHALL return the pain it was merged into.

#### Scenario: Looking up a merged pain
- **WHEN** a tool asks for `homeless` after it was merged into `homelessness`
- **THEN** it gets `homelessness`, with a note that `homeless` was merged

#### Scenario: Reusing an ID
- **WHEN** a new candidate is given an ID that any record has ever used
- **THEN** catalog validation fails

### Requirement: Shown and not-shown pains
Only accepted pains with the role `shown` SHALL be sent toward the pages. The catalog SHALL be able to hold any number of accepted pains that aren't shown, and narrower child pains under a `broader` relation, which need no futures of their own.

#### Scenario: Accepted but not shown
- **WHEN** an accepted pain has the role `not-shown`
- **THEN** ingest never adds it to the content editor draft

### Requirement: Discovery runs on demand
Discovery SHALL be runnable for one group, one page or the whole catalog, at any time. Each sweep SHALL be saved as its own run without overwriting earlier ones, and SHALL return only candidates.

#### Scenario: Sweep of one group
- **WHEN** the founder runs discovery on Money
- **THEN** a new sweep run is saved, holding candidates such as "scams and fraud", each marked `candidate`

### Requirement: Opened sources
Every candidate SHALL cite a source that was opened during the sweep, with its URL, access date and the passage it relies on. Discovery SHALL check the six mapped frameworks, Gallup "Most Important Problem", Ipsos "What Worries the World", 211 public top-needs reports, WHO or IHME cause lists and the founder's pool, and MAY use any other public source. AI-generated registries and the founder's pool count as leads only.

#### Scenario: Lead without an opened source
- **WHEN** a candidate comes only from the founder's pool or an AI-generated registry
- **THEN** it stays in draft and can't be accepted until a source is opened, unless the founder accepts it explicitly as their own

#### Scenario: A source outside the list
- **WHEN** an agent finds a national health survey not on the list
- **THEN** it may cite it, with the same URL, date and passage rules

### Requirement: No repeats
Discovery SHALL NOT propose a candidate that matches an existing pain, an alias or a rejected candidate. The one exception is a candidate with new evidence, which SHALL be marked "new evidence". A source entry that matches an existing pain SHALL be recorded as covered by that pain.

#### Scenario: Rejected candidate found again
- **WHEN** a sweep finds the same source entry behind a candidate the founder rejected
- **THEN** it isn't proposed again, and the sweep report says it was skipped

#### Scenario: New evidence
- **WHEN** a rejected candidate now has a new source showing it's common
- **THEN** it is proposed again, marked "new evidence", with the earlier rejection shown

#### Scenario: Matches an alias
- **WHEN** a source entry matches an existing pain's alias
- **THEN** no candidate is added, and that pain is recorded as covering the entry

### Requirement: Coverage report
Each sweep SHALL produce a coverage report with one row per outside list: the share of its entries the catalog covers, and each uncovered entry by name, with its source link and a reason (out of scope, covered by a broader pain, or waiting for review). Coverage SHALL be counted per list, never summed across lists.

#### Scenario: Reading coverage
- **WHEN** the founder opens the coverage report after a full sweep
- **THEN** each list shows its covered share and its uncovered entries, each with a reason, against a target of 90%

### Requirement: Wording lint
Refine SHALL check every name and line against `docs/style/copy-style-guide.md` and SHALL flag: a line that isn't first person or is longer than one sentence; a vague line with nothing picturable; an ID, name and line that don't match; problem and area labels mixed under one heading; one-sided or loaded terms; and regional words.

#### Scenario: Mismatched ID
- **WHEN** `drinking-too-much` is named "Addiction" with the line "I can't stop something that's hurting me"
- **THEN** lint flags the mismatch

### Requirement: Graphic wording is flagged, not blocked
On a pain tagged sensitive, lint SHALL flag graphic wording as a note for the founder. It SHALL NOT count as a lint failure, and SHALL NOT stop the pain being accepted or shown.

#### Scenario: Plain wording of a hard pain
- **WHEN** a sensitive pain's line names abuse directly
- **THEN** lint adds a note for the founder, and the pain still passes lint

### Requirement: Alternative wordings
For each pain that fails lint, refine SHALL offer at most two alternative wordings, and both SHALL pass lint.

#### Scenario: Alternatives offered
- **WHEN** a line fails lint
- **THEN** the proposal holds one or two alternatives, each passing lint

### Requirement: Overlap actions
For every pair of pains that substantially overlap, refine SHALL propose merge (naming the surviving ID), split, or keep with a sharper distinction, each with a one-sentence reason. A pain that exists on both pages SHALL get a proposal to keep it as one pain or as two linked by `other-page`.

#### Scenario: Sleep and Tired
- **WHEN** refine runs on Body
- **THEN** it proposes an action for `poor-sleep` and `always-tired`, with a reason

### Requirement: Card sorts
Refine SHALL run at least three independent card sorts of the pains into groups, each without seeing the current groups or the other sorts. Where at least two sorts agree on a group other than the current one, refine SHALL propose a move and show where each sort put the pain.

#### Scenario: Two sorts disagree with the group
- **WHEN** two of three sorts put a pain under Money instead of Home
- **THEN** a move to Money is proposed, showing all three placements

### Requirement: Group balance
Refine SHALL flag groups that are much smaller or larger than the rest of their page, for the founder to rebalance. It SHALL NOT change headings itself.

#### Scenario: Small group
- **WHEN** Safety has 2 pains and the other societal groups have 6 to 13
- **THEN** refine flags Safety as small

### Requirement: Review decisions
The review page SHALL show one proposal at a time: its kind, the current value next to the proposed one, and why it was proposed. The founder SHALL be able to accept, pick an alternative, write their own wording, reject or mark "later", with an optional note. Each decision SHALL be saved as it's made and can be undone. Moving to the next proposal SHALL be a separate action.

#### Scenario: Deciding doesn't advance
- **WHEN** the founder presses the key for "accept"
- **THEN** the decision is saved and the same proposal stays on screen

#### Scenario: Filtering
- **WHEN** the founder filters by group Money and kind "reword"
- **THEN** only those proposals are shown, with how many are left

### Requirement: Ingesting decisions
Ingest SHALL apply only accepted decisions (an accepted proposal, an alternative or the founder's own wording). Each change SHALL be added to the pain's history with the date, the founder's note, what prompted it (source, lint rule or card sort) and the previous value. Rejected proposals SHALL be remembered. "Later" SHALL change nothing and return in the next review.

#### Scenario: Later
- **WHEN** the founder marks a proposal "later" and decisions are ingested
- **THEN** the catalog is unchanged, and the proposal is in the next review set

#### Scenario: Why a pain reads this way
- **WHEN** the founder opens a pain's history
- **THEN** each change shows its date, note, what prompted it and the previous value

### Requirement: Merges keep aliases and links
When a merge is accepted, the merged pain SHALL become `merged` with `merged-into` pointing at the surviving pain, and its name and line SHALL be kept as aliases of the surviving pain. In the content editor draft, a published merged pain SHALL be retired with the surviving pain as its replacement.

#### Scenario: Merge of homeless into homelessness
- **WHEN** the founder accepts the merge and decisions are ingested
- **THEN** `homeless` is `merged`, its wording is kept as aliases of `homelessness`, and if `homeless` was published, the draft retires it with `homelessness` as its replacement

### Requirement: Splits
A split SHALL keep the original ID for the closer of the two pains and give the other a new ID, linked by `split-from`.

#### Scenario: Splitting a pain
- **WHEN** the founder accepts a split of a pain into two
- **THEN** one keeps the original ID, the other gets a new ID with `split-from` pointing at it

### Requirement: Changes to pains already in the editor
Ingest SHALL write accepted wording and group changes for pains already in the content editor into its draft, with a change note naming the decisions. The catalog's name maps to the editor's title, its line to the description and its group to the domain.

#### Scenario: Reworded line
- **WHEN** the founder accepts a new line for `poor-sleep` and runs ingest
- **THEN** the editor draft has the new description for `poor-sleep`, and the change note lists the decision

### Requirement: New shown pains wait for futures
Ingest SHALL add a new pain with the role `shown` to the editor draft only once it has futures the founder approved. Until then the catalog SHALL list it as "accepted, waiting for futures".

#### Scenario: No futures yet
- **WHEN** a newly accepted shown pain has no approved futures
- **THEN** ingest leaves it out of the draft and lists it as waiting for futures

### Requirement: Ingest never publishes
Ingest SHALL only save to the content editor draft, and SHALL refuse if the draft changed since it was read. Publishing SHALL stay a separate founder action in the editor.

#### Scenario: Draft changed meanwhile
- **WHEN** the founder edits the draft in the editor while ingest is preparing its changes
- **THEN** ingest refuses to save and asks for a rerun, and nothing is overwritten

### Requirement: Heading warnings
Before saving to the draft, ingest SHALL warn the founder when a heading would have fewer than 4 or more than 8 shown pains, and SHALL NOT cut or add any pain because of it.

#### Scenario: Crowded heading
- **WHEN** accepted changes would leave People with 13 shown pains
- **THEN** ingest warns about People and saves the changes unchanged

### Requirement: Drift check
A drift check SHALL list every accepted pain whose wording or group in the content editor differs from the catalog, showing both values. It SHALL NOT change either side.

#### Scenario: Edited in the editor
- **WHEN** the founder rewords a pain directly in the editor
- **THEN** the drift check lists it with both wordings, and the founder can bring the change back into the catalog through a review proposal

### Requirement: Privacy
The pipeline SHALL NOT read anyone's picks, answers, free text or contributions, before or after signup. It SHALL use only public sources and founder material. Nothing new is kept on the device or sent before signup, and nothing new is stored after signup. The review page, decisions and notes SHALL stay private to the founder; the catalog is authored content, not personal data.

#### Scenario: Something else answers
- **WHEN** a sweep runs
- **THEN** it reads no post-signup input, not even in aggregate (deferred; it would need a decision record)

### Requirement: Honest status
Evidence of how common a pain is SHALL come from a cited source, never an invented figure. Candidates, rejected, merged and not-shown pains SHALL never reach the pages, and nothing SHALL be shown to people as accepted before the founder publishes it.

#### Scenario: No source for a figure
- **WHEN** a candidate states "affects 1 in 4 adults" without a cited passage
- **THEN** validation fails for that candidate

### Requirement: Accessibility of the review page
Every review action SHALL be reachable by keyboard. A screen reader SHALL hear each proposal's kind and the current value next to the proposed one, and how many results a filter leaves. No animated transitions are required. Status and decision SHALL be shown as text labels, never by colour alone.

#### Scenario: Keyboard only
- **WHEN** the founder reviews a set using only the keyboard
- **THEN** they can decide, add a note, undo, filter and move to the next proposal
