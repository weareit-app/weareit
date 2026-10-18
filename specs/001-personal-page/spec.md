# Feature Specification: Personal page — "What could be better for you?"

**Feature Branch**: `001-personal-page` (spec directory; no branch created)

**Created**: 2026-10-16

**Status**: Draft

**Input**: User description: "It v0.1 (MVP), from the go handoff in .specify/assessments/it-mvp/decision.md (Option B). Feature input: docs/spec/features.md; binding decisions: AGENTS.md and docs/architecture/decisions.md." Split by the founder into separate specs: 001 personal page (this spec), 002 societal page, 006 admin, 008 signup gate, 009 support page, 010 privacy page, 011 Help build It, 012 pain pages and entry links, and a measurement spec (not yet written; likely 013). Earlier drafts numbered signup 003, support 004 and help 005; the mapping is in `docs/spec/features.md` (founder review, 2026-10-17/18).

## What People See and Do *(mandatory, write this first)*

Matches `docs/spec/features.md` §1 (all items core).

- **Screen: Personal page, first view** - The headline "It can be better." and the question "What could be better for you?", then a short list of everyday pains grouped under plain headings (Body, Head, Money, Time, People, Doing). Each pain shows a short name and a first-person line, e.g. "Loneliness — I feel alone." A one-line note says that picks stay on this device and what little is counted, with a link to more detail. - The person can scroll, tap any pain, or go straight on to the next page without picking anything.
- **Screen: An opened pain** - The pain opens in place and asks "What does better look like?" with "Pick everything that fits." Below are several possible better futures ("dreams"), each a short name and a first-person line, e.g. "Steady — a bad month stays a bad month." The opened pain also has a "More about this" link to the pain's own page at `/p/<slug>` (spec 012) [NEEDS CLARIFICATION: every pain, or only pains in 012's outreach launch set? Open in spec 012 as N4]. - The person can pick one or more dreams, unpick them, follow the link to the pain's page, or close the pain.
- **Screen: Ideas under a picked dream** - As soon as a dream is picked, "Ideas that could help" appear underneath that dream (never mixed with other dreams' ideas). Each idea has a short title, one or two lines of explanation, and a plain-language label saying what it is: something you could do now, something that already exists, something It might build, or a bigger change for society. Things It might build and societal changes never look clickable as if they already work. - The person can select any idea as a fix they would use (and tap again to unselect it), or read a little more about it.
- **Screen: A closed pain with picks** - When the person closes a pain where they picked dreams, the picked dream names become the headline and the pain is shown smaller underneath, not replaced by a count like "2 dreams". - The person can reopen it and change anything.
- **Screen: Bottom of the page** - A clear way on to "What could be better for us?" and, before signup only, a way to clear everything picked on this device. After signup the picks are saved to the account and the device copy is cleared (spec 008), so the control is not shown. - The person moves on whenever they like; nothing is required.

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

Having picked a dream, the visitor immediately sees ideas grouped under it, each clearly labelled, and selects the ones they would use.

**Why this priority**: The ideas are what makes a picked future feel possible, and selected fixes are It's main signal of usefulness (decision.md). Equal to Story 1 in importance.

**Independent Test**: Pick a dream; ideas appear under it within a moment, every idea has one of the four labels, and any idea can be selected and unselected.

**Acceptance Scenarios**:

1. **Given** a pain with no dreams picked, **When** the person picks a dream, **Then** ideas for that dream appear under it straight away, without another tap.
2. **Given** two picked dreams, **When** the person looks at the ideas, **Then** each dream has its own group and no idea is shown in a pooled, unlabelled list.
3. **Given** any idea shown, **When** the person reads it, **Then** it says in everyday words whether it is something to do now, something that already exists, something It might build, or a societal change.
4. **Given** an idea labelled as something It might build, **When** the person views it, **Then** nothing suggests it already works, and there is no button that pretends to start it.
5. **Given** an idea, **When** the person selects it, **Then** it shows as selected; tapping again unselects it.

---

### User Story 3 - Explore several pains without losing anything (Priority: P2)

The visitor closes one pain, sees their chosen future take its place, and opens another. They can come back later, even after closing the browser, and find everything as they left it.

**Why this priority**: People rarely have one pain. Keeping their work makes the page feel like theirs, and the chosen-future headline is how "it can be better" becomes visible.

**Independent Test**: Pick dreams in two pains, close both, reload the page; both still show the chosen dreams as headlines with the pain smaller underneath.

**Acceptance Scenarios**:

1. **Given** a pain with picked dreams, **When** the person closes it, **Then** the picked dream names are the headline and the pain is smaller beneath them, never a count only.
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
- An idea that fits several dreams: it may appear under each relevant dream; selecting it is one selection, shown the same in every place.
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
- **FR-008**: Each idea MUST be selectable as a fix with one tap, and the selection MUST be undoable.
- **FR-009**: Closing a pain with picked dreams MUST show the picked dream names as the headline and the pain smaller beneath; it MUST NOT show a count instead.
- **FR-010**: Picks and selected fixes MUST be kept on the device across reloads and restarts, with no automatic expiry, until the person clears them or signs up (spec 008).
- **FR-011**: Before signup, the person MUST be able to clear all picks and selected fixes from the device, with a confirmation. The control MUST NOT be shown after signup (founder, 2026-10-17/18; see spec 010).
- **FR-012**: Only content the founder has approved MUST appear. Every pain in the launch set MUST have at least two dreams, and every dream at least two approved ideas.
- **FR-013**: The page MUST show a one-line privacy note and a short explanation of exactly what is counted, before any counting happens.
- **FR-014**: The page MUST count only which funnel stages a visit reaches plus coarse totals, never which pains, dreams or ideas were involved, and never with an identifier that outlives the visit (the visit ID is held in memory only). The list of stages is owned by the measurement spec (not yet written; likely 013), not by this spec (founder, 2026-10-17/18).
- **FR-015**: Each pick and selected fix MUST record which version of the content it was made under.
- **FR-016**: The person MUST be able to go on to the societal page at any time, with or without picks.
- **FR-017**: Ideas MUST be able to carry a source where the claim matters (e.g. a health or money tip), shown as "Read more" or similar.
- **FR-018**: Fixes selected before signup MUST stay on the device and MUST NOT be counted anywhere. Totals of selected fixes come only from people who sign up, when their picks and selected fixes are saved (founder, 2026-10-16).
- **FR-019**: The launch set MUST include "Unemployment — I can't find work" with at least these dreams: "I have a job that pays enough.", "I have a career that I care about.", "I can live well regardless of employment." (founder, 2026-10-16).
- **FR-020**: Every pain, dream and idea MUST keep a stable ID that never changes once published, and any links to outside lists (e.g. the pain frameworks, Wikidata) MUST be recorded in one consistent form: which list, its ID, its label, who added it and when (thing-type-relation decision, Phase 1).
- **FR-021**: Each opened pain MUST link to that pain's own page at `/p/<slug>` (spec 012) [NEEDS CLARIFICATION: all pains or only 012's outreach launch set; spec 012 question N4].

### Key Entities

- **Pain**: an everyday difficulty in first person, under a heading (Body, Head, Money, Time, People, Doing), in the personal or societal set.
- **Dream**: a better future for one or more pains. A pain has several dreams; a dream may belong to more than one pain, and may later exist without a pain.
- **Idea**: something that could help reach a dream, with a label (do now / already exists / It might build / change for society), a short explanation and an optional source. An idea may serve several dreams.
- **Pick**: a person's choice of a dream for a pain, with the content version. Lives on the device until signup.
- **Selected fix**: an idea under a picked dream that the person selected as one they would use, with the content version. Lives on the device until signup. Not a commitment. Earlier drafts called this an "I'd use this" mark; that wording is retired (founder, 2026-10-17/18).
- **Content version**: the published set of pains, dreams and ideas that a pick or selected fix was made under.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A first-time visitor can open a pain and pick a dream within 30 seconds of the page loading, with no instructions.
- **SC-002**: Ideas for a newly picked dream are visible in under 1 second on an ordinary phone.
- **SC-003**: 100% of ideas in the launch set carry a label, and a founder review finds zero mislabelled ideas before launch.
- **SC-004**: At launch, every personal pain in the approved set has at least 2 dreams and every dream has at least 2 approved ideas.
- **SC-005**: Picks and selected fixes survive a reload and a browser restart on the same device in 100% of tested cases.
- **SC-006**: In launch measurement, the share of visits that reach the dream-picked and idea-seen stages (as named in the measurement spec) is reported (no target; it guides what to change).
- **SC-007**: An independent review of the data sent before signup finds no pain, dream or idea content and no lasting identifier.

## It Checks *(mandatory)*

### Privacy

- **Before signup, stays on device**: every pick, every selected fix, which pains were opened, and the content version they were made under.
- **Before signup, sent** (coarse totals / stage funnel only, disclosed in UI): which funnel stages this visit reached (stage list owned by the measurement spec, not yet written; likely 013), with a visit ID held in memory for that visit only, plus coarse totals (e.g. page visits). No idea, dream or pain totals are sent before signup (FR-018).
- **After signup, stored on server**: picks and selected fixes, saved to the account with their content version (spec 008). The device copy is then cleared, and the "clear everything on this device" control is no longer shown.
- **Never public by default**: any individual's picks or selected fixes, and any total small enough to identify someone.

### Honest Status

Four everyday labels: **do now** (a real, feasible step; no specific dated events unless verified), **already exists** (a real resource or service, with a source where it matters), **It might build** (an idea for It, clearly not built yet), **change for society** (a proposal with uncertainty, never presented as something to switch on). Labels are words, not colour alone. A person can pick a future without endorsing every idea under it.

### Must Not Block

- **Personal story of your chosen futures (soon)**: picks keep their content version so a story can be made later.
- **Sharing a future or path (soon)**: picks stay private; nothing here creates a public view.
- **Starting from a dream instead of a pain (soon)**: dreams are not required to belong to a pain.
- **Matching people with goals (soon)**: picks are structured choices, not free text.
- **Native iOS (optional, later)**: the page must keep working in the iOS build of the app.

### Accessibility

- Keyboard: every pain, dream, idea, idea-selection and "More about this" control is reachable and usable by keyboard, with a visible focus outline.
- Screen reader (incl. expanded/collapsed state): pains announce whether they are open or closed; dreams announce picked or not picked; ideas announce their label; selecting an idea announces selected or not selected; new ideas appearing are announced politely.
- Reduced motion: the change from pain to chosen future is a simple fade or none at all when reduced motion is on.
- Meaning never by colour alone: picked, selected and label states all have text or icons as well as colour.
- Tap targets are large enough for touch, and text stays readable at large text sizes.

### Research Questions

- Which wording of the four idea labels do people understand without explanation?
- Do people pick more than one dream per pain when given the choice, and does that change what fixes they select?
- Does showing the chosen dream as the headline make the page feel more hopeful, or is it missed?
- What share of selected fixes are "do now" versus "It might build" versus "change for society"?

## Assumptions

- The pain list is `docs/spec/pains/pain-inventory.yaml`: 125 pains (68 personal on this page, 57 societal). 31 are current (16 personal, 15 societal: tier-1.ts plus Unemployment) and 94 are candidates mapped to outside frameworks, not yet approved. Only founder-approved pains appear (FR-012). Each is filled in with several dreams and ideas; headings are set in the content.
- In this spec, "launch set" means every pain published on this page. Spec 012 also has an outreach "launch set" (pains with detailed pain pages), which is a subset; FR-021's open question is about that subset.
- Ideas are drafted by AI from the Fix Corpus and other sources and appear only after founder approval in the content editor (decision.md).
- "Several dreams" means at least two per pain and "several ideas" at least two per dream; more is welcome.
- The societal page (002) uses the same mechanics and is specified separately.
- Signup (008) saves the picks and selected fixes made here; this spec only keeps them on the device.
- Web is the launch platform; the page must still work in the iOS build without being released there.
- A short "Something else" free-text option is not included in v0.1.
- Picks are remembered per device and browser; there is no cross-device memory before signup.
