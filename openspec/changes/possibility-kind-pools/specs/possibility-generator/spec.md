# Spec Delta

## MODIFIED Requirements

### Requirement: Runs per pain
The generator SHALL take a pain ID from the pain catalog (`docs/research/pains/catalog.json`), resolving a merged ID to the pain it was merged into, and SHALL write each attempt as a new run under `docs/research/possibilities/runs/<pain>/<runId>/`, without reusing or overwriting an earlier run. Each run SHALL record the pain name and line it used. A repair SHALL be a new run that keeps the source run's dream and fix IDs.

#### Scenario: Unknown pain
- **WHEN** a run is started for an ID that isn't in the catalog
- **THEN** the helper refuses with a usage error, and no folder is created

#### Scenario: Merged pain
- **WHEN** a run is started for `homeless` after it was merged into `homelessness`
- **THEN** the run is created for `homelessness`, and the helper says so

#### Scenario: Repair keeps IDs
- **WHEN** a repair run rewrites a fix from its source run
- **THEN** the rewritten fix keeps its ID, and its links keep their dream IDs

### Requirement: Copy
Generated copy SHALL follow `docs/style/copy-style-guide.md`. Lint SHALL flag:
- generic, hype and boilerplate phrases;
- stacked soft modals and regional words;
- vague one-word titles and titles longer than 10 words;
- dream lines longer than one sentence, and fix text longer than three sentences;
- an ambiguous sentence-opening "it";
- feature text that isn't a pitch;
- titles that depend on knowing the example;
- copy written in a method's template form, such as "When I…, I want…, so I can…" or "After I…, I will…".

#### Scenario: Regional word
- **WHEN** a fix says "ask your GP"
- **THEN** lint reports a regional word

#### Scenario: Job story in the copy
- **WHEN** a feature's text reads "When I can't sleep, I want to see my sleep pattern, so I can talk to my doctor"
- **THEN** lint reports `template-copy`

### Requirement: Isolated judging by consensus
Each run SHALL be judged by three isolated agents. A judge's only input SHALL be the helper's `judge-input`, which leaves out writer notes, kind fields and provenance. Judges SHALL score each dream together with its linked fixes, never a fix alone, on six criteria plus an honest-status check, and SHALL compare pairs among their top 8 dreams. The judgments SHALL be combined by mean scores, a majority vote on honest status, and Borda points. The combined ranking SHALL order the founder's fix review, and a dream that fails honest status SHALL be marked there.

#### Scenario: Judge scores fixes
- **WHEN** a judgment's score keys are fix IDs instead of dream IDs
- **THEN** validation fails, and that judge is rerun

#### Scenario: Shared fix in judge input
- **WHEN** one fix is linked to three dreams
- **THEN** it appears under each of the three dreams in the judge input

### Requirement: Founder calibration and audit
Ratings pages SHALL be private Artifacts in which only the owner can write. A page SHALL show only the set's items, never the key, and SHALL accept Love, Keep or Kill with an optional reason. An item SHALL be a dream with its linked fixes. Pressing a rating SHALL never advance to the next item by itself, and pressing the same rating again SHALL clear it. Ingesting calibration SHALL refresh the founder style guide, quoting the founder's reasons word for word. The report SHALL state the gate result as `scale-up` or `iterate`, with the checks that failed.

#### Scenario: Undo a rating
- **WHEN** the founder presses Love on a dream that is already rated Love
- **THEN** the rating is cleared, and the page stays on that dream

### Requirement: Privacy
The generator SHALL use only public sources and the founder's own material. It SHALL never read people's pain choices, answers or free text, before or after signup. Rating pages, review pages, their exported decisions and founder notes SHALL be private to the founder. Nothing generated SHALL be public by default, and nothing reaches the app except through the content editor.

#### Scenario: Run inputs
- **WHEN** any brief's agent starts (dreams, planner, shared fixes, a kind, screen, assembler or judge)
- **THEN** its brief points only to repository files and the public web

#### Scenario: Review page access
- **WHEN** anyone other than the founder opens a dream or fix review page
- **THEN** they cannot see or record decisions

### Requirement: Honest status
Every fix SHALL carry one of these statuses: `real_now`, `existing_resource`, `proposed_it_feature` or `societal_proposal`. Kind and status SHALL be separate: a Use a resource fix SHALL have status `existing_resource` or `real_now`, and an Ask SHALL never imply the decision-maker has agreed. Caveats SHALL live in the status, the example's `limits` and the `speculative` field, not in boilerplate copy. Copy SHALL never describe a proposed It feature as built. A judge SHALL fail honest status when the copy overstates the status or the example's limits, gives risky health or money advice as fact, or presents a contested policy as correct. Review pages SHALL show each fix's status as a text label.

#### Scenario: Feature described as built
- **WHEN** a feature's text says "It matches you with neighbors"
- **THEN** lint reports `built-claim`

#### Scenario: Resource marked as an It feature
- **WHEN** a Use a resource fix has status `proposed_it_feature`
- **THEN** validation fails

### Requirement: Accessibility
Rating and review pages SHALL meet these rules:
- **Keyboard**: every page can be used fully from the keyboard, with decision keys and an explicit Next; adding or removing a fix's linked dream works from the keyboard.
- **Screen reader**: each item's pain, kind labels, status labels, linked dreams and current decision are announced, and every expandable note's expanded or collapsed state is announced.
- **Motion**: pages use no animation that depends on motion.
- **Colour**: decisions, statuses, overlap flags and kinds are shown with text labels and icons, never by colour alone.

#### Scenario: Kind without colour
- **WHEN** a fix is shown on a rating or review page
- **THEN** its kind appears as a text label next to its icon

#### Scenario: Linking a dream by keyboard
- **WHEN** the founder tabs to a fix on the fix review page and adds a dream link
- **THEN** the link is added without a pointer, and the screen reader announces the fix's updated list of dreams

## ADDED Requirements

### Requirement: Dreams drafted from opened examples
After the run's examples are gathered, the generator SHALL draft the pain's dreams from them, before any fix. Each dream SHALL have a title naming the outcome, a first-person line, a lens and an ambition (`tonight`, `this-year` or `together`). Drafting SHALL flag pairs of dreams that may overlap, with a reason.

#### Scenario: Fixes before dreams
- **WHEN** a fix brief is started for a run with no ingested dream review
- **THEN** the helper refuses with a usage error

#### Scenario: Dream written as an action
- **WHEN** a dream title reads "Telling my legislators I want limits on addictive app design"
- **THEN** lint reports `dream-not-outcome`

### Requirement: Founder dream review
The founder SHALL review each drafted dream once, with one wording, and accept, edit or reject it. Possible overlaps SHALL be shown beside the dreams they involve. Ingesting the review SHALL record each decision, apply edits as written, and leave only accepted dreams for the fix stages.

#### Scenario: Edited dream
- **WHEN** the founder edits a dream's line and accepts it
- **THEN** later stages see the edited line, and the run records the original and the edit

#### Scenario: Overlap shown
- **WHEN** two dreams are flagged as a possible overlap
- **THEN** the review page shows the flag and its reason next to both

### Requirement: Kind plan
After dream review, one planner per pain SHALL set, for each accepted dream, the most fixes to draft of each kind, zero allowed, with a one-line reason. The planner SHALL see all accepted dreams and the run's examples together. The plan SHALL be viewable by the founder and SHALL not wait for approval.

#### Scenario: Zero for a kind
- **WHEN** the planner sets Group to 0 for a dream
- **THEN** no Group fix is drafted for that dream, and the plan states why

### Requirement: Fixes that serve several dreams
Before the per-kind briefs run, a pass over the whole pain SHALL draft fixes that serve more than one accepted dream, and SHALL propose a link from each such fix to every dream it helps.

#### Scenario: One fix, three dreams
- **WHEN** joining a tenant association helps three rent dreams
- **THEN** the run holds one fix with three proposed links, not three copies

### Requirement: Briefs per kind
One brief SHALL run for each kind the plan gives a number above zero. Each brief SHALL fill in that kind's method fields before writing the title and text, and MAY return fewer fixes than the plan's ceiling only with a `shortfallReason`. A brief SHALL never be required to reach its ceiling.

#### Scenario: Fewer than the ceiling
- **WHEN** the Habit brief finds one good habit for a dream with a ceiling of 3
- **THEN** it returns one Habit fix and a `shortfallReason`, and validation passes

#### Scenario: Missing method fields
- **WHEN** an Ask fix has no decision-maker
- **THEN** validation fails

### Requirement: Fix kinds
Each fix SHALL have exactly one kind: feature, task, schedule, habit, practice, learn, project, group, new-group, ask or resource; `path` SHALL stay reserved, and the trial kinds `leave` and `switch` SHALL be accepted only in runs marked as pilot runs. Each fix SHALL have a first step of 20 minutes or less, and either a cited example or `speculative: true` with a rationale. A feature SHALL have status `proposed_it_feature`, and a practice SHALL carry a `featureIdea`.

#### Scenario: Trial kind outside the pilot
- **WHEN** a run not marked as a pilot run contains a `switch` fix
- **THEN** validation fails

#### Scenario: Learning about someone else
- **WHEN** a learn fix is titled "Learn how one city became a large landlord"
- **THEN** lint reports `learn-about-others`, and a repair rewrites it as something the reader does, with the example in the text

### Requirement: Method fields per kind
Each kind SHALL carry fields for its method: Feature a job story; Task a next physical action; Schedule what repeats and how often; Habit a cue and a tiny behavior; Practice a situation, a move, a sign it went better and a `featureIdea`; Learn what the reader will be able to do; Project a finished thing and when it is done; Group and New group what members do; Ask a decision-maker and one request; Use a resource who runs it, who qualifies, how to reach it and what to bring.

#### Scenario: Fields never shown
- **WHEN** judge input or a review page is built
- **THEN** method fields are left out of judge input, and the review page shows them only in a collapsed note

### Requirement: Fix screen
Before assembly, every drafted fix SHALL pass lint and be screened by one isolated judge on its own. A fix that fails the screen SHALL stay in the run with the reason and SHALL not be linked by the assembler.

#### Scenario: Screened out
- **WHEN** the screen judge fails a fix as not actionable
- **THEN** the fix stays in the run marked as screened out, and it is not linked to any dream

### Requirement: Assembly
An isolated assembler, which drafts and judges nothing, SHALL propose links from screened fixes to accepted dreams, and an order of 2–5 fixes for each dream, saying how each fix helps that dream. Fixes it leaves unlinked SHALL stay in the run. It SHALL record chains of fixes that depend on each other as path candidates, with ordered fix IDs, without building paths.

#### Scenario: Unlinked fix kept
- **WHEN** the assembler leaves a screened fix unlinked
- **THEN** the fix stays in the run and appears on the fix review page

#### Scenario: Too many fixes
- **WHEN** a dream is proposed with six linked fixes
- **THEN** validation fails

### Requirement: Coverage per pain
Across a pain's accepted dreams and linked fixes, lint SHALL check that there are at least 4 lenses, all three ambitions, at least 3 basics tonight (`real_now` or `existing_resource`), and at least one dream with a Feature linked. Lint SHALL set no minimum for any kind.

#### Scenario: One Feature is enough
- **WHEN** a pain's linked fixes include exactly one Feature and meet every other coverage check
- **THEN** lint reports no coverage issue, because no kind has a minimum

#### Scenario: No Feature
- **WHEN** no dream in a pain has a Feature linked
- **THEN** lint reports `it-led-coverage`

### Requirement: Founder fix review
The founder SHALL review each fix once, in a list ordered by the judges' ranking, with its kind, status, cited example and linked dreams beside it. The founder SHALL be able to accept, edit or reject it, and to add or remove links to accepted dreams. Unlinked fixes SHALL appear after linked ones. The assembler's limit of 5 fixes per dream SHALL not apply to links the founder adds. Ingesting SHALL record each decision and the final links.

#### Scenario: Shared fix decided once
- **WHEN** a fix linked to three dreams is accepted
- **THEN** one decision is recorded, and all three links are kept

#### Scenario: Linking an unlinked fix
- **WHEN** the founder links an unlinked fix to a dream that already has five fixes
- **THEN** the link is added, the dream shows six fixes, and validation accepts it because the founder made it

### Requirement: Pilot comparison
Before the old single-writer flow is retired, the helper SHALL build a blind set comparing old and new output for each pilot pain, rated on the ratings page. The report SHALL say the new flow passes only when its ratings are at least as good, its linked fixes span more kinds, and the founder's review time is no longer. Old runs SHALL be kept as history.

#### Scenario: Blind set
- **WHEN** the comparison set is built
- **THEN** items show no sign of which flow produced them, and the key is stored apart from the set

#### Scenario: Fails on review time
- **WHEN** the new flow rates better but takes the founder longer to review
- **THEN** the report says `iterate` and names the review-time check

## REMOVED Requirements

### Requirement: Cards and fixes
**Reason**: Cards are replaced by dreams, fixes and fix–dream links, matching the content graph, so one fix can serve several dreams (founder, 2026-10-20). The "at least 3 features" minimum is dropped in favour of the kind plan's ceilings.
**Migration**: Dream fields and checks move to "Dreams drafted from opened examples"; fix fields and kinds move to "Fix kinds" and "Method fields per kind"; coverage moves to "Coverage per pain". Old card runs stay as history and are regenerated after the pilot passes.
