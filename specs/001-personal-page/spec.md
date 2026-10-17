# Feature Specification: Personal page — "What could be better for you?"

**Feature Branch**: `001-personal-page` (spec directory; no branch created)

**Created**: 2026-10-16

**Status**: Draft

**Input**: User description: "It v0.1 (MVP), from the go handoff in .specify/assessments/it-mvp/decision.md (Option B). Feature input: docs/spec/features.md; binding decisions: AGENTS.md and docs/architecture/decisions.md." Split by the founder into six specs: 001 personal page (this spec), 002 societal page, 003 signup, 004 support, 005 help, 006 admin.

## What People See and Do *(mandatory, write this first)*

Matches `docs/spec/features.md` §1 (all items core).

- **Screen: Personal page, first view** - The headline "It can be better." and the question "What could be better for you?", then a short list of everyday pains grouped under plain headings (Body, Head, Money, Time, People, Doing). Each pain shows a short name and a first-person line, e.g. "Loneliness — I feel alone." A one-line note says that picks stay on this device and what little is counted, with a link to more detail. - The person can scroll, tap any pain, or go straight on to the next page without picking anything.
- **Screen: An opened pain** - The pain opens in place and asks "What does better look like?" with "Pick everything that fits." Below are several possible better futures ("dreams"), each a short name and a first-person line, e.g. "Steady — a bad month stays a bad month." - The person can pick one or more dreams, unpick them, or close the pain.
- **Screen: Ideas under a picked dream** - As soon as a dream is picked, "Ideas that could help" appear underneath that dream (never mixed with other dreams' ideas). Each idea has a short title, one or two lines of explanation, and a plain-language label saying what it is: something you could do now, something that already exists, something It might build, or a bigger change for society. Things It might build and societal changes never look clickable as if they already work. - The person can tap "I'd use this" on any idea (and tap again to undo), or read a little more about it.
- **Screen: A closed pain with picks** - When the person closes a pain where they picked dreams, the picked dream names become the headline and the pain is shown smaller underneath, not replaced by a count like "2 dreams". - The person can reopen it and change anything.
- **Screen: Bottom of the page** - A clear way on to "What could be better for us?" and a way to clear everything picked on this device. - The person moves on whenever they like; nothing is required.

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

**Why this priority**: The ideas are what makes a picked future feel possible, and "I'd use this" marks are It's main signal of usefulness (decision.md). Equal to Story 1 in importance.

**Independent Test**: Pick a dream; ideas appear under it within a moment, every idea has one of the four labels, and "I'd use this" can be toggled.

**Acceptance Scenarios**:

1. **Given** a pain with no dreams picked, **When** the person picks a dream, **Then** ideas for that dream appear under it straight away, without another tap.
2. **Given** two picked dreams, **When** the person looks at the ideas, **Then** each dream has its own group and no idea is shown in a pooled, unlabelled list.
3. **Given** any idea shown, **When** the person reads it, **Then** it says in everyday words whether it is something to do now, something that already exists, something It might build, or a societal change.
4. **Given** an idea labelled as something It might build, **When** the person views it, **Then** nothing suggests it already works, and there is no button that pretends to start it.
5. **Given** an idea, **When** the person taps "I'd use this", **Then** it shows as marked; tapping again removes the mark.

---

### User Story 3 - Explore several pains without losing anything (Priority: P2)

The visitor closes one pain, sees their chosen future take its place, and opens another. They can come back later, even after closing the browser, and find everything as they left it.

**Why this priority**: People rarely have one pain. Keeping their work makes the page feel like theirs, and the chosen-future headline is how "it can be better" becomes visible.

**Independent Test**: Pick dreams in two pains, close both, reload the page; both still show the chosen dreams as headlines with the pain smaller underneath.

**Acceptance Scenarios**:

1. **Given** a pain with picked dreams, **When** the person closes it, **Then** the picked dream names are the headline and the pain is smaller beneath them, never a count only.
2. **Given** picks in several pains, **When** the person opens another pain, **Then** earlier picks and "I'd use this" marks are unchanged.
3. **Given** picks on this device, **When** the person returns days later on the same device and browser, **Then** all picks and marks are still there.
4. **Given** picks on this device, **When** the person chooses to clear them and confirms, **Then** all picks and marks are removed from the device.

---

### User Story 4 - Know what stays private (Priority: P2)

Before picking anything, the visitor can see in one line that their picks stay on their device, and can open a short plain explanation of the little that is counted.

**Why this priority**: Trust is a goal of v0.1 (problem.md), and the privacy promise must be stated before any data is sent (AGENTS.md).

**Independent Test**: Read the note and its explanation before interacting; confirm that what is described matches what the page actually sends.

**Acceptance Scenarios**:

1. **Given** a first visit, **When** the page loads, **Then** a one-line privacy note is visible near the top without scrolling far.
2. **Given** the explanation is opened, **When** the person reads it, **Then** it names exactly what is counted (which stages a visit reached, and coarse totals) and says that picks, marks and the pains themselves are not sent.

---

### User Story 5 - Move on freely (Priority: P3)

The visitor can go on to the societal page at any time, with or without picks.

**Why this priority**: Nothing on It may be compulsory before signup; the next page needs a clear way in.

**Independent Test**: From a fresh visit, go on without picking anything; then repeat after picking.

**Acceptance Scenarios**:

1. **Given** no picks, **When** the person chooses to go on, **Then** they reach the societal page without a warning or block.
2. **Given** picks, **When** the person goes on and later comes back, **Then** the picks are unchanged.

### Edge Cases

- A pain where every dream gets unpicked: on closing it shows as a plain pain again.
- A dream with no approved ideas yet: it cannot be in the launch set (see FR-012); if one slips through, the page says "Ideas for this are on the way" rather than showing an empty group.
- An idea that fits several dreams: it may appear under each relevant dream; its "I'd use this" mark is one mark, shown the same in every place.
- Content published after a person's picks (e.g. a dream renamed or removed): picks keep working; a removed dream drops out quietly, and nothing breaks.
- Device storage unavailable (private browsing, blocked storage): the page still works for the visit and says that picks won't be remembered after closing.
- Content fails to load: a plain message and a retry, never a blank page.
- A very small screen or large text size: everything stays readable without sideways scrolling.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The page MUST be usable without an account, and nothing on it may require one.
- **FR-002**: The page MUST show the headline "It can be better." and the question "What could be better for you?" above the pains.
- **FR-003**: The page MUST list every personal pain in the launch set, grouped under their plain headings, each with a short name and a first-person line.
- **FR-004**: Opening a pain MUST show at least two dreams, each with a short name and a first-person line, and allow any number of them to be picked or unpicked.
- **FR-005**: Picking a dream MUST show that dream's ideas under it immediately, grouped by dream.
- **FR-006**: Every idea MUST carry exactly one of four plain-language labels: do now, already exists, It might build, change for society.
- **FR-007**: Ideas labelled "It might build" or "change for society" MUST NOT offer any control that implies the thing already works.
- **FR-008**: Each idea MUST offer a one-tap "I'd use this" mark that can be undone.
- **FR-009**: Closing a pain with picked dreams MUST show the picked dream names as the headline and the pain smaller beneath; it MUST NOT show a count instead.
- **FR-010**: Picks and marks MUST be kept on the device across reloads and restarts, with no automatic expiry, until the person clears them or signs up (spec 003).
- **FR-011**: The person MUST be able to clear all picks and marks from the device, with a confirmation.
- **FR-012**: Only content the founder has approved MUST appear. Every pain in the launch set MUST have at least two dreams, and every dream at least two approved ideas.
- **FR-013**: The page MUST show a one-line privacy note and a short explanation of exactly what is counted, before any counting happens.
- **FR-014**: The page MUST count only which stages a visit reaches (page opened, first pain opened, first dream picked, first idea seen, moved on) plus coarse totals, never which pains, dreams or ideas were involved, and never with an identifier that outlives the visit.
- **FR-015**: Each pick and mark MUST record which version of the content it was made under.
- **FR-016**: The person MUST be able to go on to the societal page at any time, with or without picks.
- **FR-017**: Ideas MUST be able to carry a source where the claim matters (e.g. a health or money tip), shown as "Read more" or similar.
- **FR-018**: "I'd use this" marks made before signup MUST stay on the device and MUST NOT be counted anywhere. Totals of marks come only from people who sign up, when their picks and marks are saved (founder, 2026-10-16).
- **FR-019**: The launch set MUST include "Unemployment — I can't find work" with at least these dreams: "I have a job that pays enough.", "I have a career that I care about.", "I can live well regardless of employment." (founder, 2026-10-16).
- **FR-020**: Every pain, dream and idea MUST keep a stable ID that never changes once published, and any links to outside lists (e.g. the pain frameworks, Wikidata) MUST be recorded in one consistent form: which list, its ID, its label, who added it and when (thing-type-relation decision, Phase 1).

### Key Entities

- **Pain**: an everyday difficulty in first person, under a heading (Body, Head, Money, Time, People, Doing), in the personal or societal set.
- **Dream**: a better future for one or more pains. A pain has several dreams; a dream may belong to more than one pain, and may later exist without a pain.
- **Idea**: something that could help reach a dream, with a label (do now / already exists / It might build / change for society), a short explanation and an optional source. An idea may serve several dreams.
- **Pick**: a person's choice of a dream for a pain, with the content version. Lives on the device until signup.
- **"I'd use this" mark**: a person's interest in an idea, with the content version. Lives on the device until signup. Not a commitment.
- **Content version**: the published set of pains, dreams and ideas that a pick or mark was made under.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A first-time visitor can open a pain and pick a dream within 30 seconds of the page loading, with no instructions.
- **SC-002**: Ideas for a newly picked dream are visible in under 1 second on an ordinary phone.
- **SC-003**: 100% of ideas in the launch set carry a label, and a founder review finds zero mislabelled ideas before launch.
- **SC-004**: At launch, every personal pain in the approved set has at least 2 dreams and every dream has at least 2 approved ideas.
- **SC-005**: Picks and marks survive a reload and a browser restart on the same device in 100% of tested cases.
- **SC-006**: In launch measurement, the share of visits that reach "first dream picked" and "first idea seen" is reported (no target; it guides what to change).
- **SC-007**: An independent review of the data sent before signup finds no pain, dream or idea content and no lasting identifier.

## It Checks *(mandatory)*

### Privacy

- **Before signup, stays on device**: every pick, every "I'd use this" mark, which pains were opened, and the content version they were made under.
- **Before signup, sent** (coarse totals / stage funnel only, disclosed in UI): which stages this visit reached (page opened, first pain opened, first dream picked, first idea seen, moved on), with a visit ID held in memory for that visit only, plus coarse totals (e.g. page visits). No idea, dream or pain totals are sent before signup (FR-018).
- **After signup, stored on server**: picks and marks, saved to the account with their content version (spec 003).
- **Never public by default**: any individual's picks or marks, and any total small enough to identify someone.

### Honest Status

Four everyday labels: **do now** (a real, feasible step; no specific dated events unless verified), **already exists** (a real resource or service, with a source where it matters), **It might build** (an idea for It, clearly not built yet), **change for society** (a proposal with uncertainty, never presented as something to switch on). Labels are words, not colour alone. A person can pick a future without endorsing every idea under it.

### Must Not Block

- **Personal story of your chosen futures (soon)**: picks keep their content version so a story can be made later.
- **Sharing a future or path (soon)**: picks stay private; nothing here creates a public view.
- **Starting from a dream instead of a pain (soon)**: dreams are not required to belong to a pain.
- **Matching people with goals (soon)**: picks are structured choices, not free text.
- **Native iOS (optional, later)**: the page must keep working in the iOS build of the app.

### Accessibility

- Keyboard: every pain, dream, idea and "I'd use this" control is reachable and usable by keyboard, with a visible focus outline.
- Screen reader (incl. expanded/collapsed state): pains announce whether they are open or closed; dreams announce picked or not picked; ideas announce their label; "I'd use this" announces its state; new ideas appearing are announced politely.
- Reduced motion: the change from pain to chosen future is a simple fade or none at all when reduced motion is on.
- Meaning never by colour alone: picked, marked and label states all have text or icons as well as colour.
- Tap targets are large enough for touch, and text stays readable at large text sizes.

### Research Questions

- Which wording of the four idea labels do people understand without explanation?
- Do people pick more than one dream per pain when given the choice, and does that change what ideas they mark?
- Does showing the chosen dream as the headline make the page feel more hopeful, or is it missed?
- What share of ideas marked "I'd use this" are "do now" versus "It might build" versus "change for society"?

## Assumptions

- The approved pain list is `docs/spec/pains/pain-inventory.yaml`: 85 pains (47 personal on this page, 38 societal), the 31 earlier ones plus 54 added and mapped to six outside frameworks (founder-reviewed 2026-10-16). Each is filled in with several dreams and ideas; headings are set in the content.
- Ideas are drafted by AI from the Fix Corpus and other sources and appear only after founder approval in the content editor (decision.md).
- "Several dreams" means at least two per pain and "several ideas" at least two per dream; more is welcome.
- The societal page (002) uses the same mechanics and is specified separately.
- Signup (003) saves the picks and marks made here; this spec only keeps them on the device.
- Web is the launch platform; the page must still work in the iOS build without being released there.
- A short "Something else" free-text option is not included in v0.1.
- Picks are remembered per device and browser; there is no cross-device memory before signup.
