# Feature Specification: Pain catalog pipeline

**Feature Branch**: `codex/possibilities-pilot`

**Created**: 2026-10-19

**Status**: Draft. Superseded: to move to an OpenSpec change in we-are-it (Spec Kit retired there 2026-10-19). Keep as source material only.

**Input**: User description: "Should we also start working on a better pipeline for bringing in personal/societal pains and improving the wording, and what group they belong to? … I don't want just a one-time review pipeline, I think this is something we should treat as part of this overall workflow. Not every pain should be in onboarding, but we should try to identify every human pain we can." Expanded into a brief in this session (catalog plus onboarding view; discover, refine, review, hand-off stages).

## What People See and Do *(mandatory, write this first)*

This feature is mostly founder-facing. People using It see its result, the pain list, which `docs/spec/features.md` already covers: "See a short list of everyday pains" and "Tap a pain to open it".

- **Screen: Pain review page (founder, private)**
  - **What's on it**: one proposal at a time. Each proposal shows the pain as it is now next to the change being proposed:
    - a new pain;
    - a reworded name or line;
    - a merge or split;
    - a move to another group;
    - a cut;
    - a change to its onboarding role.
  - Each proposal also shows why it's proposed: the source, the lint finding, or the card sorts that disagreed. Overlapping pains are shown side by side.
  - **What the founder can do**: accept, pick one of the alternatives, write their own wording, reject, or mark it "later". They can add a short note and move between proposals freely. They can see how many are left and filter by group or by kind of change.
- **Screen: Coverage report (founder, read-only)**
  - **What's on it**: one row per outside list, such as OECD, WHOQOL or Gallup's most important problem. Each row shows the share of that list's entries the catalog covers, with the uncovered entries listed by name and linked to their source.
  - **What the founder can do**: open an uncovered entry and send it to discovery as a candidate.
- **Screen: Catalog view (founder, read-only)**
  - **What's on it**: every pain grouped by scope and group. Each pain shows its status (candidate, accepted, merged, retired) and onboarding role (main, "More like this", catalog only), plus its aliases and relations. Pains with generated possibility runs are marked, and so are pains whose runs need regeneration.
  - **What the founder can do**: browse, search, and open a pain's history of decisions.
- **People using It**: they see the onboarding view: the main pains under each heading, plus "More like this" under a pain. They never see candidates, merged or retired pains. Catalog-only pains stay hidden until a later surface such as search shows them.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Find pains the catalog is missing (Priority: P1)

The founder asks for a discovery sweep of an area, such as Money, or of everything. Agents check outside lists, surveys and the founder's own pain pool. They return candidate pains the catalog doesn't cover. Each candidate comes with a source that was actually opened, a draft name and line, a proposed group, and how common it is.

**Why this priority**: The goal is to identify every human pain we can. Without discovery, the catalog is just today's list of 125.

**Independent Test**: Run discovery on one group against the current catalog. Check that every candidate cites an opened source, isn't a duplicate of an existing pain or alias, and appears in the coverage report.

**Acceptance Scenarios**:

1. **Given** the current catalog, **When** discovery runs on Money, **Then** it returns candidates such as "scams and fraud" or "insurance costs", each with a source URL, the date it was opened and the passage it relies on. Each candidate is marked `candidate` and none is shown to users.
2. **Given** a candidate that matches an existing pain's alias, **When** discovery runs, **Then** it isn't added as new. Instead, the existing pain is recorded as covering that source entry.
3. **Given** discovery has run, **When** the founder opens the coverage report, **Then** each outside list shows how much the catalog covers and which named entries it doesn't.

---

### User Story 2 - Sharpen wording, overlaps and groups (Priority: P1)

Agents propose changes to existing and new pains:
- merges and splits, for pains a person couldn't choose between;
- rewording, based on lint against the copy style guide;
- group moves, where independent blind card sorts disagree with the current groups.

**Why this priority**: The founder isn't happy with some of the current wording. Overlaps such as Sleep and Tired, or Food and Hunger, make choosing harder. Settling these before the generator scales avoids regenerating possibility cards.

**Independent Test**: Run refine on the current 125 pains. It produces a lint report, a list of overlap pairs with a proposed action for each, and a grouping-disagreement report. All three are reviewable without discovery.

**Acceptance Scenarios**:

1. **Given** a pain whose id, name and line don't match (the id `drinking-too-much` is named "Addiction" with the line "I can't stop something that's hurting me"), **When** refine runs, **Then** lint flags it. Refine then proposes at most two rewordings, each passing lint.
2. **Given** two pains that substantially overlap, **When** refine runs, **Then** it proposes merge, split or keep, with a one-sentence reason. A merge names which id survives.
3. **Given** three independent card sorts, **When** at least two place a pain in a group other than its current one, **Then** refine proposes a move and shows where each sort put it.

---

### User Story 3 - Founder decides, and the catalog updates itself (Priority: P1)

The founder works through the review page. Their decisions go back into the catalog: wording changes, merges with aliases, new pains accepted, and onboarding roles set. Each decision is logged with its date and note.

**Why this priority**: The founder decides and agents only propose, so nothing changes without this step.

**Independent Test**: Make decisions on a small review set, ingest them, and check the catalog. Accepted changes are applied, rejected ones aren't, and every change appears in the decision log.

**Acceptance Scenarios**:

1. **Given** the founder accepts a merge of `homeless` into `homelessness`, **When** decisions are ingested, **Then**:
   - `homeless` is marked `merged` and points to `homelessness`;
   - its name, line and aliases are kept as aliases of `homelessness`;
   - its id still resolves, so nothing that referenced it breaks.
2. **Given** the founder marks a proposal "later", **When** decisions are ingested, **Then** the catalog is unchanged and the proposal returns in the next review.
3. **Given** decisions were ingested, **When** anyone asks why a pain reads the way it does, **Then** its decision history shows each change with its date, the founder's note and what prompted it.

---

### User Story 4 - Choose what onboarding shows (Priority: P2)

From the accepted catalog, the founder gives each pain a role: a main pain under its heading, a "More like this" pain under one or more main pains, or catalog only. Selection criteria come with the choice: how common the pain is, how distinct it is, whether It can offer real help, and balance across groups.

**Why this priority**: Not every pain belongs in onboarding. The onboarding view should come from the catalog, not be kept by hand.

**Independent Test**: Assign roles for one heading, then produce the onboarding view for that heading and compare it with the current pain tree.

**Acceptance Scenarios**:

1. **Given** accepted pains with roles, **When** the onboarding view is produced, **Then** it lists the main pains per heading and the "More like this" pains under each one. Candidates, merged and retired pains are left out.
2. **Given** a heading would go over the main-pain limit, **When** the view is produced, **Then** the founder is warned and nothing is cut automatically.

---

### User Story 5 - Changes reach the possibility generator (Priority: P2)

Accepted pains become inputs to the possibility generator (spec 003). When an accepted pain's wording changes, or it is merged or split, any possibility runs already generated for it are flagged for regeneration.

**Why this priority**: The catalog and the generator must not drift apart. Card copy that quotes an outdated pain line is a visible defect.

**Independent Test**: Change the line of a pain that has a generated run, then ask which runs need regeneration. That run is listed, with the reason.

**Acceptance Scenarios**:

1. **Given** `poor-sleep` has generated runs, **When** its line changes, **Then** those runs are listed as stale, along with the old and new line.
2. **Given** a pain was merged, **When** the generator is asked to run on the old id, **Then** it is pointed to the surviving id.

---

### User Story 6 - Rerun any time without losing decisions (Priority: P3)

Discovery and refine can be rerun whenever new sources appear, or on a schedule. A rerun doesn't propose again what the founder already rejected, unless the evidence has changed.

**Why this priority**: The catalog should keep growing. Reruns are only bearable if they don't ask the same questions twice.

**Independent Test**: Run discovery twice with no catalog change in between. The second run produces no new proposals for items the founder rejected.

**Acceptance Scenarios**:

1. **Given** the founder rejected a candidate, **When** discovery reruns and finds the same source entry, **Then** the candidate isn't proposed again, and the report notes that it was skipped.
2. **Given** a rejected candidate now has a new source showing it's common, **When** discovery reruns, **Then** it is proposed again, marked "new evidence".

### Edge Cases

- **Sensitive pains** such as abuse, self-harm or trafficking may be in the catalog. Their wording must not be graphic, and each one is tagged so a pain detail can show crisis resources first. Whether they appear in onboarding is a founder decision per pain.
- **Pains that are politically loaded** (for example "Freedoms" or "Immigration") get wording that people with different views would both recognize. Lint flags one-sided terms.
- **A pain that belongs to both scopes** (Homeless and Homelessness, Hunger and Food) can be one pain or two, linked by an `otherScope` relation. Refine proposes which.
- **Outside lists that disagree or overlap** count once per catalog pain for coverage. Coverage is measured per list, not summed.
- **A source that can't be opened** keeps the candidate in draft. It can't be accepted until the source is opened, or the founder accepts it explicitly as their own.
- **A split** keeps the original id for the closer of the two pains and gives the other a new id. Generated runs for the original are flagged for regeneration.
- **Ids stay stable.** An id is never reused for a different pain, and retired ids still resolve to their record.

## Requirements *(mandatory)*

### Functional Requirements

**Catalog**

- **FR-001**: The catalog MUST hold every known pain, whatever its onboarding role. Each pain has:
  - a stable id;
  - a short name;
  - a first-person line;
  - scope (personal or societal);
  - one primary group, plus optional secondary groups;
  - status: `candidate`, `accepted`, `merged` or `retired`;
  - onboarding role: `main`, `more-like-this` (with the main pains it appears under) or `catalog-only`;
  - evidence of how common it is, with a source;
  - mappings to the outside frameworks already used in `docs/spec/pains/pain-inventory.yaml`: OECD, WHOQOL, SDG, Max-Neef, Gallup and Wikidata;
  - aliases, meaning other ways people say it;
  - relations: overlaps, broader, narrower, other scope, merged into, split from;
  - a sensitivity tag;
  - a decision history.
- **FR-002**: The catalog MUST be seeded from the current 125-pain inventory without changing any existing id. Fields the inventory already has, such as maps, evidence, overlaps, `main` and `more_like_this_under`, are carried over.
- **FR-003**: Ids MUST never be reused or deleted. Merged and retired pains keep their record and still resolve. A merged pain resolves to the pain it was merged into.
- **FR-004**: Granularity (founder, 2026-10-19): pains shown in onboarding are one-line pains a person would recognize as their own, like today's 125. The catalog may also hold narrower child pains (like the 774-pain pool) under a `broader` relation. Children aren't required to have their own cards. They leave room for a later step that narrows down a pain before showing outcomes.

**Discover**

- **FR-005**: Discovery MUST be runnable for one group, one scope or the whole catalog, and repeatable at any time.
- **FR-006**: Discovery MUST check at least these sources:
  - the six mapped frameworks;
  - Gallup's "Most Important Problem";
  - Ipsos "What Worries the World";
  - a helpline needs taxonomy (211 / AIRS);
  - WHO or CDC burden-of-disease lists;
  - the founder's personal-pains pool;
  - the existing inventory and its source registries. Those are AI-generated, so they count as leads only (constitution I).
- **FR-007**: Every new candidate MUST cite a source that was actually opened, with its URL, the access date and the passage it relies on. A candidate without one stays in draft and cannot be accepted, unless the founder explicitly accepts it as their own.
- **FR-008**: Discovery MUST NOT propose a pain that matches an existing pain, alias or previously rejected candidate. The one exception is when new evidence is attached, in which case the proposal is marked "new evidence".
- **FR-009**: Discovery MUST produce a coverage report. For each outside list it shows the entries the catalog covers, the entries it doesn't, and the share covered.

**Refine**

- **FR-010**: Refine MUST lint every name and line against the copy style guide (`docs/style/copy-style-guide.md`), flagging:
  - lines that aren't first person;
  - vague lines with no picturable specific;
  - an id, name and line that don't match;
  - a name that mixes problem labels ("Broke") with area labels ("Savings") under one heading;
  - one-sided or loaded terms;
  - graphic wording on sensitive pains;
  - regional words;
  - lines longer than one sentence.
- **FR-011**: For each flagged pain, refine MUST offer at most two alternative wordings, and both must pass lint.
- **FR-012**: Refine MUST propose an action for every pair of pains that overlap substantially: merge (naming the surviving id), split, or keep with a sharper distinction. Each action comes with a one-sentence reason.
- **FR-013**: Refine MUST run at least three independent, blind card sorts of the catalog into groups. It reports each pain where the sorts disagree with its current group, and proposes a move where at least two sorts agree on a different group.
- **FR-014**: Refine MUST flag groups that are much smaller or larger than the rest, so the founder can rebalance headings. Today, for example, Safety has 2 pains and People has 13.

**Review and decisions**

- **FR-015**: The review page MUST let the founder do any of the following for each proposal: accept, choose an alternative, write their own wording, reject, or mark it "later", with an optional note. It saves every decision as soon as it's made and lets the founder undo it.
- **FR-016**: Ingesting decisions MUST apply accepted changes only. It records each change in the pain's history with:
  - the date;
  - the founder's note;
  - what prompted it (source, lint rule or card sort);
  - the previous value.
- **FR-017**: Merges MUST keep the merged pain's name and line as aliases of the surviving pain.

**Onboarding view**

- **FR-018**: The onboarding view (main pains per heading, plus "More like this" under each main pain) MUST be produced from the catalog, not kept separately. It includes only accepted pains.
- **FR-019**: When producing the view, the system MUST warn the founder, without changing anything, when:
  - a heading has fewer than 4 main pains;
  - a heading has more than 8 main pains;
  - a main pain has no generated possibilities.
- **FR-020**: Selection support MUST show, for each pain: how common it is (with its source), its overlaps, whether It has real or proposed help for it (from generated cards, once they exist), and its group's balance. The founder chooses the role.

**Hand-off to the generator**

- **FR-021**: The possibility generator MUST take each pain's name and line from the catalog.
- **FR-022**: When an accepted pain's name or line changes, or the pain is merged or split, the system MUST list every generated run that used the old wording as stale, with the reason.
- **FR-023**: Asking the generator to run on a merged id MUST resolve to the surviving id and say so.

**Where it lives**

- **FR-024**: Canonical home (founder, 2026-10-19): the we-are-it repo's content (`packages/content`) for now, with this pipeline reading its export (`exports/pains.json`). Eventually the database and CMS, with Git holding seed and import snapshots only.
- **FR-025**: Discovery MUST use only public, aggregate sources and founder material. Post-signup input (founder, 2026-10-19): yes, in aggregate. Counts of themes from post-signup input such as "Something else" may feed discovery, with consent wording and never individual text. This changes a privacy invariant, so it needs a decision record before it's built.

### Key Entities

- **Pain**: one human pain, with the fields in FR-001. Identified by a stable id that is never reused.
- **Group**: a heading on the personal or societal page, such as Body or Economy. It has a name, a scope and an order.
- **Source entry**: one named item in an outside list or survey, such as WHOQOL Q16 sleep or Gallup's "cost of living". It records which pain covers it, if any.
- **Proposal**: a suggested change, of one of these kinds: add, reword, merge, split, move, cut, or set role. It records what prompted it, the alternatives offered, and its status (open, accepted, rejected, later).
- **Decision**: the founder's answer to a proposal. It has a date, a note and the value it applied.
- **Generated run link**: which possibility runs used which pain wording. Used to mark runs stale.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: After the first full discovery, the catalog covers at least 90% of the entries in each mapped outside list. Each uncovered entry is listed with a reason: out of scope, covered by a broader pain, or a candidate waiting for review.
- **SC-002**: Every accepted pain passes wording lint, and none has an unresolved overlap proposal.
- **SC-003**: Every candidate shown to the founder has an opened source, with no exceptions.
- **SC-004**: The founder can review 50 proposals in under 20 minutes. That target comes from the calibration and audit rounds, which took about 1 minute per card.
- **SC-005**: A second discovery run with no new sources produces zero repeat proposals.
- **SC-006**: Producing the onboarding view, and the list of stale generator runs, needs no hand editing.
- **SC-007**: The founder's rejection rate on reworded lines falls between the first and second review rounds. That would show the lint and wording guidance are learning their taste.

## It Checks *(mandatory)*

### Privacy

- **Before signup, stays on device**: unchanged. This pipeline never reads people's pain choices, answers or free text.
- **Before signup, sent**: nothing new.
- **After signup, stored on server**: nothing new, pending the FR-025 decision.
- **Never public by default**: the review page, the decisions and the founder's notes are private to the founder. The catalog is authored content, not personal data.

### Honest Status

N/A for pains themselves. Evidence of how common a pain is must come from a cited source, never an invented statistic. Candidates are never shown to users as if they were accepted.

### Must Not Block

- **Starting from a dream instead of a pain** (soon): the catalog doesn't require every dream to have a parent pain.
- **Search over all pains** (later): catalog-only pains, aliases and relations are kept, so search can use them.
- **The "tag anything" layer** (`docs/architecture/decisions.md`): Wikidata mappings are kept in the same shape as other outside references.
- **Database-backed content and the CMS**: the Git catalog is a snapshot and import source, never a second source of truth once the CMS exists.

### Accessibility

These checks apply to the founder review page.
- **Keyboard**: every decision is reachable by keyboard, and moving to the next proposal is a separate, explicit action. Pressing a decision key never advances on its own, which was a bug the founder found on the audit page.
- **Screen reader**: proposals are announced with their kind (merge, reword…) and the current value next to the proposed one. Filters announce how many results they leave.
- **Reduced motion**: no animated transitions are required.
- **Meaning never by colour alone**: status and decision are shown as text labels as well as colour.

### Research Questions

- Which pains do people most often say are missing from the list? This needs an aggregate method that respects the privacy invariants.
- How many main pains per heading can people scan before choosing gets slower?
- Do people recognize themselves faster in a problem label ("Broke") or an area label ("Money")?
- Which outside list best predicts the pains people actually choose?

## Assumptions

- The founder's personal-pains pool (`personal_pains_hierarchy_relations_v2.csv`, 774 pains in 24 areas) is available to the pipeline. The founder will provide its current location; it is no longer in Downloads.
- Onboarding keeps the current headings for now: 8 personal and 10 societal. Refine may propose changes to the headings but never applies them without a decision.
- 4–8 main pains per heading is a soft default, matching the current tree. It warns and doesn't enforce.
- Discovery runs on demand, with a full sweep suggested once per quarter, or whenever the generator is about to scale to new pains.
- The work extends the existing possibilities extension (a new pains stage, with its own commands and the same stdlib helper style, with tests). It doesn't add a separate tool.
- Agent costs for discovery are similar to the generator's research step, roughly one research agent per group.
