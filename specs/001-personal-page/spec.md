# Feature Specification: Personal page — "What could be better for you?"

**Feature Branch**: `001-personal-page` (spec directory; no branch created)

**Created**: 2026-10-16

**Status**: Draft

**Input**: User description: "It v0.1 (MVP), from the go handoff in .specify/assessments/it-mvp/decision.md (Option B). Feature input: docs/spec/features.md; binding decisions: AGENTS.md and docs/architecture/decisions.md." Split by the founder into six specs: 001 personal page (this spec), 002 societal page, 003 signup, 004 support, 005 help, 006 admin.

## What People See and Do *(mandatory, write this first)*

Matches `docs/spec/features.md` §1 (all items core).

- **Screen: Personal page, first view** - The headline "It can be better." and the question "What could be better for you?", then everyday pains grouped under collapsible headings, each with an icon and its full list of pain names (Body, Mind, Money, Work, Home, Time, People, Purpose, from the pain tree, every pain top level; see `docs/spec/CONFLICTS.md` P2). This is the landing page (P8). The headline shrinks after the first interaction. Each pain shows a short name and a first-person line, e.g. "Loneliness — I feel alone." A one-line note says that picks stay on this device and what little is counted, with a link to more detail. - The person can scroll, tap any pain, or go straight on to the next page without picking anything.
- **Screen: An opened pain** - Tapping a pain or its check selects it and opens it in place; only one pain is open at a time. It asks "What would be better?" with "Pick as many as fit." Below are several possible better futures ("dreams"), each a short name and a first-person line, e.g. "Steady — a bad month stays a bad month." - The person can pick one or more dreams, unpick them, or close the pain.
- **Screen: Ways it can be better** - As soon as one dream is picked, a single "Ways it can be better" section appears after the dreams. Each way appears once, sorted by how many of the chosen dreams it may help. Each way has a type tag (Task, Habit, Takes a group or Feature, each with a small icon) and, on features, a roadmap status tag (Idea or Planned); tapping a tag explains it. Evidence levels are kept in the content but not shown in v0.1 (founder, 2026-10-19). Features never look as if they already work (see `docs/spec/CONFLICTS.md` P1). - The person can pick any way (and tap again to undo). A button closes the pain: "Close", or "Done for now" once a way is picked.
- **Screen: A closed pain with picks** - When the person closes a pain where they picked dreams, it reads the pain's name in small capitals, then the picked dreams' first-person lines joined into one sentence as the headline, in the content's order rather than the order they were picked ("I drift off without a fight, sleep through the night, and wake up ready."); a pain's dreams are written in the order someone lives them, then "I could:" with the picked tasks, habits and group efforts, each with its type icon, and "I could use:" with any picked features and their status. Picking a way is exploring, not committing, so the summary never says "I'm going to"; a feature is listed apart because it isn't built. With no ways picked, a small yellow label says "No plan for this yet". Never a count like "2 dreams". After four or more pains are picked and two or more are unexplored, a light inline note suggests starting with about three, with no limit and no extra screen. - The person can reopen it and change anything. A collapsed group reads the same way, smaller: under its name, each pain with picked dreams shows its name in small capitals and its sentence in the reading serif, one pain at a time (never one long sentence across pains), then the group's other pains. Picked ways show only in the pain itself.
- **Screen: Adding your own** - At the end of each group, "Add a pain"; under an open pain's futures, "Add a future"; under its ways, "Add a way". Each opens a short form in place: a name and a first-person line (a future also asks where it fits among the others, with a live preview of the joined sentence; a way also asks its type). What the person adds works for them straight away like any other pick, marked "Only you can see this". It stays on this device. After signup they can choose to send it for review; until then, and until it is approved, no one else sees it (decision: Contributions, 2026-10-18). - The person can add, edit or remove their own, and choose whether to send each one.
- **Screen: Bottom of the page** - A button reading "Skip" before any interaction and "Continue" after, "Free, and you're not the product.", and, before signup only, a way to clear everything picked on this device. After signup the picks are saved to the account and the device copy is cleared (spec 008), so the control is not shown. - The person moves on whenever they like; nothing is required.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Find a better future for a pain (Priority: P1)

A visitor arrives with no account, recognises a pain ("Broke — money is always tight"), opens it and sees several different better futures ("Steady", "Comfortable", "Free"). They pick the ones that fit.

**Why this priority**: This is It's core promise and the first thing anyone does. Without it nothing else matters.

**Independent Test**: Open the page fresh, open any pain, pick two dreams; both show as picked, and nothing asks for an account, money or information first.

**Acceptance Scenarios**:

1. **Given** a first visit, **When** the page loads, **Then** the headline, the question and the list of pains are visible with no sign-in, pop-up or form in the way.
2. **Given** an opened pain, **When** the person picks two dreams, **Then** both show as picked and either can be unpicked.
3. **Given** any pain in the launch set, **When** it is opened, **Then** it shows at least two different dreams.

---

### User Story 2 - See honest ideas that could help (Priority: P1)

Having picked a dream, the visitor immediately sees ideas grouped under it, each clearly labelled, and marks the ones they would use.

**Why this priority**: The ideas are what makes a picked future feel possible, and selected fixes are It's main signal of usefulness (decision.md). Equal to Story 1 in importance.

**Independent Test**: Pick a dream; ideas appear under it within a moment, every idea has one of the four labels, and an idea can be selected as a fix and unselected.

**Acceptance Scenarios**:

1. **Given** a pain with no dreams picked, **When** the person picks a dream, **Then** ideas for that dream appear under it straight away, without another tap.
2. **Given** two picked dreams, **When** the person looks at the ideas, **Then** each dream has its own group and no idea is shown in a pooled, unlabelled list.
3. **Given** any idea shown, **When** the person reads it, **Then** it says in everyday words whether it is something to do now, something that already exists, something It might build, or a societal change.
4. **Given** an idea labelled as something It might build, **When** the person views it, **Then** nothing suggests it already works, and there is no button that pretends to start it.
5. **Given** an idea, **When** the person selects it as a fix, **Then** it shows as selected; selecting it again removes the selection.

---

### User Story 3 - Explore several pains without losing anything (Priority: P2)

The visitor closes one pain, sees their chosen future take its place, and opens another. They can come back later, even after closing the browser, and find everything as they left it.

**Why this priority**: People rarely have one pain. Keeping their work makes the page feel like theirs, and the chosen-future headline is how "it can be better" becomes visible.

**Independent Test**: Pick dreams in two pains, close both, reload the page; both still show the chosen dreams as the headline sentence with the pain's name small above it.

**Acceptance Scenarios**:

1. **Given** a pain with picked dreams, **When** the person closes it, **Then** the picked dreams' lines, joined into one sentence, are the headline and the pain's name is small above it, never a count only.
2. **Given** picks in several pains, **When** the person opens another pain, **Then** earlier picks and selected fixes are unchanged.
3. **Given** picks on this device, **When** the person returns days later on the same device and browser, **Then** all picks and selected fixes are still there.
4. **Given** picks on this device and no signup yet, **When** the person chooses to clear them and confirms, **Then** all picks and selected fixes are removed from the device.
5. **Given** the person has signed up, **When** they view the page, **Then** there is no control to clear the device.

---

### User Story 4 - Know what stays private (Priority: P2)

Before picking anything, the visitor can see in one line that their picks stay on their device, and can open a short plain explanation of the little that is counted.

**Why this priority**: Trust is a goal of v0.1 (problem.md), and the privacy promise must be stated before any data is sent (AGENTS.md).

**Independent Test**: Read the note and its explanation before interacting; confirm that what is described matches what the page actually sends.

**Acceptance Scenarios**:

1. **Given** a first visit, **When** the page loads, **Then** a one-line privacy note is visible near the top without scrolling far.
2. **Given** the explanation is opened, **When** the person reads it, **Then** it names exactly what is counted (which stages a visit reached, and coarse totals) and says that picks, selected fixes and the pains themselves are not sent.

---

### User Story 5 - Add what's missing (Priority: P2)

A visitor doesn't see their pain, or the future they want, or a way they know works. They add it in a few words, and it becomes part of their own page. After signing up, they can send it to be reviewed, so it may help others.

**Why this priority**: "We are It" means the content comes from the people using It, not only from the founder. It also shows which pains, futures and ways the launch set is missing.

**Independent Test**: Add a pain with a future and a way, close it, reload; it is still there, marked as visible only to the person. Inspect what was sent: nothing about it. Sign up, send it, and confirm it is in the CMS review queue and not on anyone else's page.

**Acceptance Scenarios**:

1. **Given** an open pain, **When** the person adds a future, **Then** it appears among the futures, picked, in the position they chose, and the closed pain's sentence includes it.
2. **Given** a contribution made before signup, **When** the page sends anything, **Then** the contribution's text is not part of it.
3. **Given** a signed-in person with a contribution, **When** they choose to send it for review, **Then** it shows "In review" to them and reaches the founder's review queue, and nobody else sees it.
4. **Given** an approved contribution, **When** anyone else sees it, **Then** nothing says or implies who contributed it.
5. **Given** a future line that isn't one first-person sentence, **When** the person tries to save it, **Then** the form explains how to write it and doesn't save it.

---

### User Story 6 - Move on freely (Priority: P3)

The visitor can go on to the societal page at any time, with or without picks.

**Why this priority**: Nothing on It may be compulsory before signup; the next page needs a clear way in.

**Independent Test**: From a fresh visit, go on without picking anything; then repeat after picking.

**Acceptance Scenarios**:

1. **Given** no picks, **When** the person chooses to go on, **Then** they reach the societal page without a warning or block.
2. **Given** picks, **When** the person goes on and later comes back, **Then** the picks are unchanged.

### Edge Cases

- A pain where every dream gets unpicked: on closing it shows as a plain pain again.
- A dream with no approved ideas yet: it cannot be in the launch set (see FR-012); if one slips through, the page says "Ideas for this are on the way" rather than showing an empty group.
- An idea that fits several dreams: it may appear under each relevant dream; selecting it as a fix is one selection, shown the same in every place.
- Content published after a person's picks (e.g. a dream renamed or removed): picks keep working; a removed dream drops out quietly, and nothing breaks.
- Device storage unavailable (private browsing, blocked storage): the page still works for the visit and says that picks won't be remembered after closing.
- Content fails to load: a plain message and a retry, never a blank page.
- A contribution that duplicates existing content: it is still accepted into the queue; the reviewer can link it to the existing pain, future or way instead of publishing a copy.
- A contribution that is rejected: the contributor keeps their own copy, marked "Not added", and nothing about it is shown to others.
- A very small screen or large text size: everything stays readable without sideways scrolling.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The page MUST be usable without an account, and nothing on it may require one.
- **FR-002**: The page MUST show the headline "It can be better." and the question "What could be better for you?" above the pains.
- **FR-003**: The page MUST list every personal pain in the launch set, grouped under their plain headings, each with a short name and a first-person line.
- **FR-004**: Opening a pain MUST show at least two dreams, each with a short name and a first-person line, and allow any number of them to be picked or unpicked.
- **FR-005**: Picking a dream MUST immediately show the pain's ways it can be better, each once, sorted by how many chosen dreams it may help.
- **FR-006**: Every way MUST show a type (task, habit, takes a group, or feature with a roadmap status). Every way MUST also record an evidence level (strong, some, limited, not tested yet) in the content, not shown in v0.1 (founder, 2026-10-19); when it is shown, evidence for a method, for its link to a future, and for an It feature are different claims and MUST NOT be conflated.
- **FR-007**: Ways typed "feature" MUST NOT offer any control that implies the feature already works.
- **FR-008**: Each way MUST offer a one-tap pick that can be undone. The full pain → dream → way path is stored, with a stable ID for each way.
- **FR-009**: Closing a pain with picked dreams MUST show the picked dreams' first-person lines, joined into one sentence, as the headline with the pain's name small above, then the picked ways ("I could:" for tasks, habits and group efforts; "I could use:" for features) or, with none, a "No plan for this yet" label; it MUST NOT show a count instead.
- **FR-010**: Picks and selected fixes MUST be kept on the device across reloads and restarts, with no automatic expiry, until the person clears them or signs up (spec 008).
- **FR-011**: Before signup, the person MUST be able to clear all picks and selected fixes from the device, with a confirmation. The control MUST NOT be shown after signup (founder, 2026-10-17/18; see spec 010).
- **FR-012**: Only content the founder has approved MUST appear. Every pain in the launch set MUST have at least two dreams, and every dream at least two approved ideas.
- **FR-013**: The page MUST show a one-line privacy note and a short explanation of exactly what is counted, before any counting happens.
- **FR-014**: The page MUST count only which stages a visit reaches (stage list owned by spec 013, measurement) plus coarse totals, never which pains, dreams or ideas were involved, and never with an identifier that outlives the visit.
- **FR-015**: Each pick and mark MUST record which version of the content it was made under.
- **FR-016**: The person MUST be able to go on to the societal page at any time, with or without picks.
- **FR-017**: Ideas MUST be able to carry a source where the claim matters (e.g. a health or money tip), shown as "Read more" or similar.
- **FR-018**: selected fixes made before signup MUST stay on the device and MUST NOT be counted anywhere. Totals of selected fixes come only from people who sign up, when their picks and selected fixes are saved (founder, 2026-10-16).
- **FR-019**: The launch set MUST include "Unemployment — I can't find work" with at least these dreams: "I have a job that pays enough.", "I have a career that I care about.", "I can live well regardless of employment." (founder, 2026-10-16).
- **FR-020**: Every pain, dream and idea MUST keep a stable ID that never changes once published, and any links to outside lists (e.g. the pain frameworks, Wikidata) MUST be recorded in one consistent form: which list, its ID, its label, who added it and when (thing-type-relation decision, Phase 1).
- **FR-021**: The person MUST be able to add their own pain (to a group), future (to a pain) and way (to a future), each with a name and a first-person line, and use it on their page straight away like published content.
- **FR-022**: Contributions MUST stay on the device before signup and MUST NOT be sent or counted. After signup each is sent only when the person explicitly chooses to send it for review.
- **FR-023**: A sent contribution MUST go into the founder's review queue and MUST NOT appear to anyone else until approved (FR-012). The contributor MUST see its state: "Only you can see this", "In review", "Added" or "Not added".
- **FR-024**: Published contributions MUST NOT show or imply who contributed them. Contributor identity is kept only as private provenance.
- **FR-025**: A pain's futures MUST have a per-pain position that sets both their order on the page and their order in the joined sentence (FR-009); a contributor chooses their future's position, and the reviewer may change it.
- **FR-026**: A future's line MUST be validated as one first-person sentence ending in a period, so that any chosen set joins with commas and "and".
- **FR-027**: Each opened pain MUST link to that pain's own page at `/p/<slug>` (spec 012) [NEEDS CLARIFICATION: all pains or only 012's outreach launch set; spec 012 question N4].

### Key Entities

- **Pain**: an everyday difficulty in first person, under a heading (Body, Head, Money, Time, People, Doing), in the personal or societal set.
- **Dream**: a better future for one or more pains. A pain has several dreams; a dream may belong to more than one pain, and may later exist without a pain.
- **Idea (way it can be better, "fix")**: something that could help reach a dream, with a type, an evidence level and note, a short explanation and an optional source. An idea may serve several dreams.
- **Pick**: a person's choice of a dream for a pain, with the content version. Lives on the device until signup.
- **Selected fix**: an idea the person selected as one they would use, with the content version. Lives on the device until signup. Not a commitment. Earlier drafts called this an "I'd use this" mark; that wording is retired (founder, 2026-10-17/18).
- **Contribution**: a pain, future or way a person wrote, with its state (on device, in review, added, not added), the place it was added (group, pain or future) and, for a future, its position. Lives on the device until the person sends it after signup; the contributor is private provenance.
- **Content version**: the published set of pains, dreams and ideas that a pick or selected fix was made under.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A first-time visitor can open a pain and pick a dream within 30 seconds of the page loading, with no instructions.
- **SC-002**: Ideas for a newly picked dream are visible in under 1 second on an ordinary phone.
- **SC-003**: 100% of ideas in the launch set carry a label, and a founder review finds zero mislabelled ideas before launch.
- **SC-004**: At launch, every personal pain in the approved set has at least 2 dreams and every dream has at least 2 approved ideas.
- **SC-005**: Picks and selected fixes survive a reload and a browser restart on the same device in 100% of tested cases.
- **SC-006**: In launch measurement, the share of visits that reach "first dream picked" and "first idea seen" is reported (no target; it guides what to change).
- **SC-007**: An independent review of the data sent before signup finds no pain, dream or idea content and no lasting identifier.

## It Checks *(mandatory)*

### Privacy

- **Before signup, stays on device**: every pick, every selected fix, which pains were opened, and the content version they were made under.
- **Before signup, sent** (coarse totals / stage funnel only, disclosed in UI): which stages this visit reached (stage list owned by spec 013, measurement), with a visit ID held in memory for that visit only, plus coarse totals (e.g. page visits). No idea, dream or pain totals are sent before signup (FR-018).
- **Before signup, stays on device**: every contribution's text, place and position.
- **After signup, stored on server**: picks and selected fixes, saved to the account with their content version (spec 008); contributions only once the person sends them for review, with the contributor as private provenance.
- **Never public by default**: any individual's picks or selected fixes, any total small enough to identify someone, and who contributed any published pain, future or way.

### Honest Status

Four everyday labels: **do now** (a real, feasible step; no specific dated events unless verified), **already exists** (a real resource or service, with a source where it matters), **It might build** (an idea for It, clearly not built yet), **change for society** (a proposal with uncertainty, never presented as something to switch on). Labels are words, not colour alone. A person can pick a future without endorsing every idea under it.

### Must Not Block

- **Personal story of your chosen futures (soon)**: picks keep their content version so a story can be made later.
- **Sharing a future or path (soon)**: picks stay private; nothing here creates a public view.
- **Starting from a dream instead of a pain (soon)**: dreams are not required to belong to a pain.
- **Matching people with goals (soon)**: picks are structured choices, not free text. Contributions are free text, but become structured content (stable IDs, links) when approved, and are never matched on before then.
- **Native iOS (optional, later)**: the page must keep working in the iOS build of the app.

### Accessibility

- Keyboard: every pain, dream, idea and fix-selection control is reachable and usable by keyboard, with a visible focus outline.
- Screen reader (incl. expanded/collapsed state): pains announce whether they are open or closed; dreams announce picked or not picked; ideas announce their label; fix selection announces its state; new ideas appearing are announced politely.
- Reduced motion: the change from pain to chosen future is a simple fade or none at all when reduced motion is on.
- Meaning never by colour alone: picked, marked and label states all have text or icons as well as colour.
- Tap targets are large enough for touch, and text stays readable at large text sizes.

### Research Questions

- Which wording of the four idea labels do people understand without explanation?
- Do people pick more than one dream per pain when given the choice, and does that change what ideas they mark?
- Does showing the chosen dream as the headline make the page feel more hopeful, or is it missed?
- What share of ideas selected as fixes are "do now" versus "It might build" versus "change for society"?

## Assumptions

- The pain list is `docs/spec/pains/pain-inventory.yaml`: 125 pains (68 personal on this page, 57 societal); 31 are marked current and 94 are candidates mapped to outside frameworks (statuses as of 2026-10-19). Only founder-approved pains appear (FR-012). Each is filled in with several dreams and ideas; headings are set in the content.
- Ideas are drafted by AI from the Fix Corpus and other sources, or contributed by people using It, and appear to others only after founder approval in the content editor (decision.md; Contributions, 2026-10-18).
- "Several dreams" means at least two per pain and "several ideas" at least two per dream; more is welcome.
- The societal page (002) uses the same mechanics and is specified separately.
- Signup (008) saves the picks and selected fixes made here; this spec only keeps them on the device.
- Spec 013 (measurement, 2026-10-19) changed the measurement privacy invariant (opened pains recorded by ID; post-signup visits linked to the account). This spec's measurement and privacy lines predate that change and are to be reconciled during the OpenSpec migration.
- Web is the launch platform; the page must still work in the iOS build without being released there.
- People can add their own pains, futures and ways in v0.1 (Contributions, 2026-10-18); the review queue itself is part of spec 006 (admin).
- Picks are remembered per device and browser; there is no cross-device memory before signup.
