# possibility-generator Specification

## Purpose
Agents draft candidate onboarding content for each pain: dreams, each with fixes, built from real examples that were opened and checked, isolated agents judge them, and the founder calibrates and audits. The drafts live in Git for review only. The database and CMS stay the source of truth, and nothing is published from the generator. The tooling is in `tools/possibilities/`, run with the `possibilities-*` skills. File shapes are in `tools/possibilities/data-model.md`.

## Requirements

### Requirement: Runs per pain
The generator SHALL take a pain ID from `docs/spec/pains/pain-inventory.yaml` and SHALL write each attempt as a new run under `docs/research/possibilities/runs/<pain>/<runId>/`, without reusing or overwriting an earlier run. A repair SHALL be a new run that keeps the source run's card IDs.

#### Scenario: Unknown pain
- **WHEN** a run is started for an ID that isn't in the inventory
- **THEN** the helper refuses with a usage error, and no folder is created

### Requirement: Examples are opened and traced
Each run SHALL gather 10–20 real-world examples spanning at least 4 lenses, or SHALL give a `shortfallReason`. An example SHALL be `verified` only when its page was opened in that run, with a URL, an access date and a locator. Every number and proper noun in a fix's title or text SHALL appear in the record of the example it cites, including a place name that opens a sentence. A speculative fix SHALL name no institution.

#### Scenario: Name from a different example
- **WHEN** a fix citing Australia's age limit says "Minnesota chose a warning label"
- **THEN** lint reports `unsourced-detail` for Minnesota

### Requirement: Cards and fixes
Each card SHALL be a dream with a title that names the outcome, a first-person line, a lens, an ambition (`tonight`, `this-year` or `together`) and 2–5 fixes. Each fix SHALL have the following:
- a kind from the copy guide: feature, task, schedule, habit, practice, learn, project, group or new-group, with path reserved;
- a first step of 20 minutes or less;
- either a cited example, or `speculative: true` with a rationale.

A feature fix SHALL have status `proposed_it_feature`. A practice SHALL carry a `featureIdea`. Each pain SHALL cover at least 4 lenses and all three ambitions, with at least 3 basics tonight, at least 3 features and at least one card led by It.

#### Scenario: Dream written as an action
- **WHEN** a dream title reads "Telling my legislators I want limits on addictive app design"
- **THEN** lint reports `dream-not-outcome`

#### Scenario: Learning about someone else
- **WHEN** a learn fix is titled "Learn how one city became a large landlord"
- **THEN** lint reports `learn-about-others`, and a repair rewrites it as something the reader does, with the example in the text

### Requirement: Copy
Generated copy SHALL follow `docs/style/copy-style-guide.md`. Lint SHALL flag:
- generic, hype and boilerplate phrases;
- stacked soft modals and regional words;
- vague one-word titles and titles longer than 10 words;
- dream lines longer than one sentence, and fix text longer than three sentences;
- an ambiguous sentence-opening "it";
- feature text that isn't a pitch;
- titles that depend on knowing the example.

#### Scenario: Regional word
- **WHEN** a fix says "ask your GP"
- **THEN** lint reports a regional word

### Requirement: Isolated judging by consensus
Each run SHALL be judged by three isolated agents. A judge's only input SHALL be the helper's `judge-input`, which leaves out writer notes and provenance. Judges SHALL score whole cards, never individual fixes, on six criteria plus an honest-status check, and SHALL compare pairs among their top 8. The judgments SHALL be combined by mean scores, a majority vote on honest status, and Borda points. Selection SHALL exclude honest-status failures and pick 3–5 finalists covering at least 2 lenses, including one card led by It, plus 2 audit samples.

#### Scenario: Judge scores fixes
- **WHEN** a judgment's score keys are fix IDs instead of card IDs
- **THEN** validation fails, and that judge is rerun

### Requirement: Founder calibration and audit
Ratings pages SHALL be private Artifacts in which only the owner can write. A page SHALL show only the set's items, never the key, and SHALL accept Love, Keep or Kill with an optional reason. Pressing a rating SHALL never advance to the next card by itself, and pressing the same rating again SHALL clear it. Ingesting calibration SHALL refresh the founder style guide, quoting the founder's reasons word for word. The report SHALL state the gate result as `scale-up` or `iterate`, with the checks that failed.

#### Scenario: Undo a rating
- **WHEN** the founder presses Love on a card that is already rated Love
- **THEN** the rating is cleared, and the page stays on that card

### Requirement: Privacy
The generator SHALL use only public sources and the founder's own material. It SHALL never read people's pain choices, answers or free text, before or after signup. Rating pages and founder notes SHALL be private to the founder. Nothing generated SHALL be public by default.

#### Scenario: Run inputs
- **WHEN** a writer agent starts
- **THEN** its brief points only to repository files and the public web

### Requirement: Honest status
Every fix SHALL carry one of these statuses: `real_now`, `existing_resource`, `proposed_it_feature` or `societal_proposal`. Caveats SHALL live in the status, the example's `limits` and the `speculative` field, not in boilerplate copy. Copy SHALL never describe a proposed It feature as built. A judge SHALL fail honest status when the copy overstates the status or the example's limits, gives risky health or money advice as fact, or presents a contested policy as correct.

#### Scenario: Feature described as built
- **WHEN** a feature's text says "It matches you with neighbors"
- **THEN** lint reports `built-claim`

### Requirement: Accessibility
Rating pages SHALL meet these rules:
- **Keyboard**: every page can be used fully from the keyboard, with rating keys and an explicit Next.
- **Screen reader**: each card's pain, kind labels and current rating are announced, and the Practice note's expanded or collapsed state is announced.
- **Motion**: pages use no animation that depends on motion.
- **Colour**: ratings and kinds are shown with text labels and icons, never by colour alone.

#### Scenario: Kind without colour
- **WHEN** a fix is shown on a rating page
- **THEN** its kind appears as a text label next to its icon

## Known divergence (2026-10-19)
- The app's fix type tags (pain-explorer: Task, Habit, Takes a group, Feature) are coarser than the generator's kinds. Generated content would need a mapping, or a change to pain-explorer, before import.
- Run selection does not yet measure structure: kind accuracy, outcome framing, staying on topic, and features per card. The founder's audit found judges' Love rates on lower-ranked samples matched the finalists' (14 of 16 against 37 of 40).
- Writers have no per-pain scope note, so content can drift off topic. In one case, a de-escalation card was written for polarization.
