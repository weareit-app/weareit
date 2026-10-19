# pain-explorer Specification

## Purpose
The personal page ("What could be better for you?", the landing page at `/`) and the societal page ("What could be better for us?", `/onboarding/world`) let a person, without an account, open everyday pains, pick better futures ("dreams") under them, and pick ways it can be better ("fixes"). Both pages share one component (`PainExplorer`).

## Requirements

### Requirement: Pages and headings
The personal page SHALL be the landing page at `/`, showing the brand mark, the headline "It can be better." and the question "What could be better for you?". The societal page SHALL be at `/onboarding/world` with the question "What could be better for us?". The old `/onboarding/personal` route SHALL redirect to `/`.

#### Scenario: Old personal link
- **WHEN** someone opens `/onboarding/personal`
- **THEN** they are redirected to `/`

#### Scenario: Headline shrinks after interaction
- **WHEN** the person has selected a pain or picked anything on the personal page
- **THEN** the headline is shown smaller

### Requirement: Grouped, collapsible pains
Each page SHALL list the published pains for its scope (`personal` or `world`) under collapsible group headings in content order, each with an icon where one exists. Every group SHALL start collapsed. A collapsed group SHALL preview its pains: for each pain with picked dreams, the pain's name and one sentence joining the picked dreams' first-person lines in content order; then the names of the remaining pains.

#### Scenario: Collapsed preview with picks
- **WHEN** a group is collapsed and the person picked "I drift off without a fight." and "I wake up ready." under a pain
- **THEN** the preview shows that pain's name and "I drift off without a fight and wake up ready."

### Requirement: Opening a pain
Tapping a pain's row or check SHALL select it and open it in place; only one pain SHALL be open at a time. An open pain SHALL ask "What would be better?" with "Pick as many as fit." and list its dreams, each pickable and unpickable. Unchecking a selected pain SHALL unselect it and drop the dreams and fixes chosen under it.

#### Scenario: Open another pain
- **WHEN** a pain is open and the person opens a different pain
- **THEN** the first closes, the second opens, and earlier picks are unchanged

### Requirement: Ways it can be better
Once a dream is picked, the open pain SHALL show a "Ways it can be better" section listing the fixes linked to the picked dreams. Each fix SHALL show its title, a line of description, and a type tag: Task, Habit, Takes a group, or Feature. Features SHALL also show a roadmap status tag (Idea or Planned). Tapping a tag SHALL explain it; the Feature explanation SHALL say it isn't available yet and that choosing it tells It to build it. Each fix SHALL be pickable and unpickable with one tap.

#### Scenario: Feature honesty
- **WHEN** the person taps the tag of a Feature fix
- **THEN** the explanation says "Something It would offer. It isn't available yet; choosing it tells us to build it."

### Requirement: Closed pain summary
Closing a pain with picked dreams SHALL show the picked dreams joined into one sentence, then the picked fixes ("I could:" for tasks, habits and group efforts; "I could use:" for features with their status), or "No plan for this yet." when no fix is picked. The close button SHALL read "Done for now" when fixes are picked, otherwise "Close".

#### Scenario: No fixes picked
- **WHEN** the person closes a pain with picked dreams but no picked fixes
- **THEN** the summary reads "No plan for this yet."

### Requirement: Gentle focus invite
When four or more pains are selected and at least two selected pains with dreams have no picked dream, the page SHALL show "You've picked N. Start with about three?" with buttons to open those pains and a "Not now" dismiss for the rest of the visit.

#### Scenario: Invite dismissed
- **WHEN** the person taps "Not now"
- **THEN** the invite does not reappear during that visit

### Requirement: Moving on
The bottom of each page SHALL show a button reading "Skip" before any interaction and "Continue" after, linking to the next page (personal → societal → `/onboarding/futures`), the line "Free, and you're not the product.", a count "N selected · kept on this device", and the clear-choices control.

#### Scenario: Skip without choosing
- **WHEN** the person taps "Skip" on the personal page without choosing anything
- **THEN** they go to the societal page

### Requirement: Content loading states
While published content loads or fails, each page SHALL show the watercolor loader or an error with a retry; while saved choices load from the device it SHALL show "Loading your saved choices…".

#### Scenario: Content fails to load
- **WHEN** the published-content request fails
- **THEN** the page shows an error with a way to retry

### Requirement: Accessibility
Groups and pains SHALL expose expanded/collapsed state; pain, dream and fix checks SHALL expose checked state with the item's name as label; tags SHALL be buttons with expanded state; scrolling to keep the person's place SHALL not animate when reduced motion is on. Meaning SHALL not rely on colour alone (type and status tags carry text labels).

#### Scenario: Screen reader on a pain
- **WHEN** a screen reader focuses a pain row
- **THEN** it announces the pain's name and whether it is open

## Known divergence from founder decisions (2026-10-19)
- Fixes are called "ways" in the UI and appear in one section for the pain, not grouped under each dream as some drafts describe.
- People cannot yet add their own pain, future or way (founder decision 2026-10-18; not built).
- Each opened pain has no link to a `/p/<slug>` pain page (spec 012 direction).
- Measurement is not built; nothing about opened pains is recorded (AGENTS.md measurement invariant, spec 013).
- The clear-choices control is shown regardless of sign-in state (founder: pre-signup only).
