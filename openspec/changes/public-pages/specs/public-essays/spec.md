# Spec Delta

## Purpose

Public essay pages that explain why It exists, what guides it, how it uses AI and what larger risks motivate it, written to be read without an account and kept honest about what is known and built.

## ADDED Requirements

### Requirement: First essays
It SHALL have essay pages at `/why`, `/principles`, `/ai` and `/risks`, reachable without an account. `/roadmap` is specified by the roadmap capability and SHALL use the same page layout.

#### Scenario: Signed out
- **WHEN** a signed-out person opens `/principles`
- **THEN** the essay loads without asking them to sign in

### Requirement: Published one at a time
Each essay SHALL be published on its own once the founder approves it. An unpublished essay SHALL NOT be reachable in a release (its address shows the not-found page) and SHALL NOT be linked. Launch of the rest of the app SHALL NOT wait for any essay.

#### Scenario: Not yet approved
- **WHEN** `/risks` has not been approved and someone opens `/risks`
- **THEN** they see the not-found page

### Requirement: Essay layout
Each essay SHALL show a title, a one-line question it answers, the text, a "last updated" date, and a dated list of changes. The first published version's list SHALL have one entry.

#### Scenario: Revised essay
- **WHEN** the founder revises `/ai` with a change note
- **THEN** the page shows the new "last updated" date and the note at the top of its change list, with earlier entries kept

### Requirement: Sources beside claims
A factual claim from outside It SHALL link to its source next to the claim, and each essay SHALL end with its list of sources. Other people's work SHALL be described by what they published, never as endorsement of or association with It.

#### Scenario: Cited figure
- **WHEN** an essay states a figure from a study
- **THEN** a link to that study sits next to the figure and the study is in the essay's source list

### Requirement: Status labels
Where an essay states a result, view or plan, it SHALL label it with one of: established result, replicated finding, machine-checked under stated assumptions, working hypothesis, speculative direction, open question, or planned engineering.

#### Scenario: Hypothesis
- **WHEN** an essay presents an untested idea about how people choose
- **THEN** it carries the "working hypothesis" label

### Requirement: Named blocks
Essay text SHALL be able to include named blocks: chart, graph or diagram, table, maths, evidence card (claim, source, date, status, main limitation), timeline, status board and expandable section. Each block's data SHALL be kept beside the essay text, so blocks can be generated and checked like the text.

#### Scenario: Chart in risks
- **WHEN** `/risks` includes a chart block
- **THEN** the chart is drawn from the data file beside the essay, and changing that file changes the chart

### Requirement: Data shown with its context
Every chart, figure and table of outside data SHALL show its source, unit, timeframe, population or denominator, uncertainty where known, and when it was last updated.

#### Scenario: Missing unit
- **WHEN** a chart's data has no unit or source
- **THEN** the essay is not published until they are added

### Requirement: Text without scripts
An essay's text, headings, sources and change list SHALL be readable with scripts off. A block that needs scripts SHALL show its plain fallback (a table, the formula as text, or a written description) until it is drawn.

#### Scenario: Scripts off
- **WHEN** someone opens `/risks` with scripts disabled
- **THEN** they can read the whole essay and see each chart's data as a table

### Requirement: Spanish note
Essays SHALL be in English. When the app language is Spanish, each essay SHALL open with a short Spanish note, approved by the founder, saying the page is in English for now.

#### Scenario: Spanish visitor
- **WHEN** a person using It in Spanish opens `/why`
- **THEN** a Spanish note at the top says the page is in English for now, and the essay follows in English

### Requirement: Built for the web
Essays SHALL be built for the web. The iOS app SHALL reach them through the site navigation's in-app browser, not render them natively.

#### Scenario: iOS
- **WHEN** a person in the iOS app opens Principles
- **THEN** it is the web page, shown in the in-app browser

### Requirement: Founder approval
Each essay SHALL be approved by the founder before it is published. `/why` and `/ai` SHALL be written by the founder; `/principles`, `/risks` and `/roadmap`'s text MAY be drafted from their outlines and SHALL be rewritten and approved by the founder.

#### Scenario: Drafted essay
- **WHEN** a draft of `/principles` exists but the founder has not approved it
- **THEN** it is not published

### Requirement: Essay privacy
Before signup, nothing a person picks or writes SHALL be sent because they read an essay. An essay page SHALL send only its listed page view, and only after the page's one-line privacy note has been shown. Essays SHALL NOT load outside trackers, fonts or embeds that tell a third party someone read them. Nothing about who reads an essay SHALL be public.

#### Scenario: Reading before signup
- **WHEN** a signed-out person with picks reads `/ai`
- **THEN** the only message sent is an `ai` page view, after the privacy note is on screen, and no request goes to a third party

### Requirement: Essay honest status
Essays SHALL NOT present an unbuilt feature as working, a plan as under way, a scenario as a prediction, or an aspiration (such as ownership or governance by the people who use It) as present fact. They SHALL contain no invented figures, user counts or supporter totals.

#### Scenario: Ownership
- **WHEN** `/principles` describes community ownership
- **THEN** it says this is an intention and states what is true today

### Requirement: AI disclosure
`/ai` SHALL say where AI is used in It (code, illustrations, writing drafts including these essays, research) and how each use is reviewed by a person.

#### Scenario: Drafted essays
- **WHEN** someone reads `/ai`
- **THEN** it says which essays were drafted with AI and that the founder rewrote and approved them

### Requirement: Essay accessibility
Essays SHALL use headings in order. Charts and diagrams SHALL have a text description and a table or text equivalent; maths SHALL be readable by screen readers; expandable sections SHALL announce expanded or collapsed and work by keyboard; status labels SHALL be words, never colour alone; nothing SHALL animate when reduced motion is set.

#### Scenario: Screen reader and chart
- **WHEN** a screen-reader user reaches a chart on `/risks`
- **THEN** they hear its description and can move through its data as a table
