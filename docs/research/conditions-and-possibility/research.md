# Idea Research: Conditions and possibility

- **Slug**: conditions-and-possibility
- **Created**: 2026-10-20
- **Question**: In It, a person picks a pain, then dreams, then sees fixes. A person's situation decides which dreams are relevant to them and which fixes would work for them, and the same fact can be a constraint for one fix, an advantage for another, and irrelevant to a third. So a constraint looks like a relationship between a fact and a possible course of action, not a type of fact. How should It represent what is true, what someone wants to be true, and what could change what is true, so that circumstances, abilities, constraints, resources, relationships, and commitments are not five separate systems? What do David Spivak's "plausible fiction" and related compositional work, the capability approach, affordances, AI planning and goal-oriented requirements engineering, Jobs to Be Done and context-aware systems, and futures and design fiction imply?
- **Aim** (set by the founder after the first draft): inform whether making conditions explicit improves what the generator produces, judged on discovery, organization, and applicability, with "useful, but no data model needed" an allowed answer. See "What the research is for" and "A probe design for the three pilot pains".
- **Evidence confidence (overall)**: high on what Spivak's own writing and code say about plausible fiction (blog post, two talk decks, and the Weve repositories, all read in full); high on the planning, requirements, context, and capability sources (originators' papers or an entry co-written by Robeyns); medium on affordances (Gibson's book not opened; later primary papers used); low on Dunne & Raby (secondhand only). No source models a person's situation inside an app like It; every mapping to It below is this note's inference, marked as such. Nothing here decides anything; the options are inputs to the founder's next grilling round.
- **Scope**: research only. Context read: `GLOSSARY.md` (Pain, Dream, Means, Fix, Fix kind); `docs/architecture/decisions.md` ("Content graph: Thing / Type / Relation" and "Generated possibility content"); `AGENTS.md` privacy invariants; `docs/style/copy-style-guide.md`; `docs/research/dream-layer/research.md` on `origin/claude/research-dream-layer-2b6c2e` (PR #134); and the redrafted pilot dreams in `dreams.json` and `dream-screen.json` for `poor-sleep/20261020-202908`, `rent-eats-everything/20261020-202909`, and `loneliness/20261020-202910` on `origin/claude/possibilities-pilot-79a436`. All sources were opened on 2026-10-20 unless marked otherwise. Example conditions, fixes, and wordings below are illustrations written for this note, not quotes, and not verified fixes.

## Summary

- **The decision this serves is whether making conditions explicit improves what the generator produces, not whether conditions need a data model.** The founder will judge a probe on three questions: discovery (does reasoning about situations surface dreams or fixes the ordinary generator misses?), organization (does it help decide whether two dreams stay separate or merge?), and applicability (does it improve matching or explaining fixes?). The probe must be allowed to conclude "useful, but no data model needed".
- **The literature splits cleanly on where conditions help.** Jobs to Be Done, the capability approach, KAOS obstacle analysis, and futures methods use contrasting situations mainly for discovery. Plausible fiction and KAOS give a concrete organization test. Planning, i*, affordances, and context-aware recommenders are mainly about applicability. Only planning, KAOS, and the capability approach use one shared set of situation statements across all three, which is the case where a stored structure earns its keep.
- **Plausible fiction is a method for reasoning over a range of hypothetical presents, and needs no real person.** Each plausible fiction starts from a present; different presents give different stories. Writing short fictions from deliberately contrasting situations is a discovery move. "Same good end reached by different paths" versus "different ends" is an organization test. A "defeater" story, one that shows why a path fails from some present, is an applicability note.
- **Inform, don't exclude.** Every source that handles exceptions well (KAOS above all) keeps the ideal model intact and attaches situations separately. In this note a condition makes a dream more or less relevant and can block a fix as written, but never makes a dream illegitimate or removes a fix from the catalog. This avoids repeating the pilot dream screen's over-rejection.
- **Spivak has written about plausible fiction, and it is directly relevant, but it is not a model of a person's situation.** His own blog post (Topos Institute, 2024-08-27) defines a plausible fiction as a story that starts from the present as it is, ends in a future the author wants, stays plausible the whole way given how physics and society work, and is easy for others to pick up. Its one mechanism is collaborators recursively filling "gaps", the places where the "how" is unclear. Two later talk decks (IPAM, 2024-11-05; MIT, 2024-12-02) repeat this and sketch the math. He says plainly that he has no category-theory account yet.
- **Plausible fiction maps onto It's three things almost one to one.** "The present moment, as it is" is the person's conditions; "a future the author sees as good" is a dream; "plausible the whole way" is whether a path of fixes works from those conditions. Its consequence for It: plausibility is not a property of a fix, but of a fix taken from a particular present. The same fix can be plausible for one person and not for another.
- **Spivak's sketch of the math treats facts the way the founder suspects: their role comes from how they're wired, not from what they are.** In the talks, a plan is a Petri net: resources are wires and transitions are boxes, and a transition consumes some resources and produces others. A resource has no fixed role; it is an input to one box and an output of another. A "constraint" is then a missing input, an "advantage" an available one, and a fix's result a new output.
- **Spivak's own app, Weve, encodes plausible fiction without any separate "situation" entity.** Its code (April to May 2026) models each task as inputs and possible outcomes (a "monomial", `A · y^B`), nests tasks inside tasks to fill gaps, and puts a chosen outcome, outcome likelihoods, and a high/medium/low plausibility tag on each task. A person's situation enters only as the typed inputs a task needs. Weve is evidence that the plausible-fiction framing needs conditions only as inputs to steps, not as a separate system.
- **Polynomial functors give the most exact picture of "situation decides the options".** Niu and Spivak's book defines a position as a status one can hold and directions as the options available while holding it. In It's terms, a person's set of conditions is a position, and the fixes open to them are its directions. A condition can change which options fit, not just how items rank. Spivak's 2020 grant calls this context-dependent interaction.
- **Ologs give the smallest piece of category theory It needs: a relationship that isn't a function becomes its own table.** Spivak and Kent show that a relation between several types is represented as a new type whose rows each point to one item of each. "Condition C blocks fix F" is exactly such a row. The role lives in the row, not in the condition.
- **The capability approach already calls situation facts relational.** The entry co-written by Robeyns defines a conversion factor as the degree to which a person can turn a resource into a functioning, sorted into personal, social, and environmental factors. A conversion factor belongs to a pair (this resource, this achieved state), so in It it can attach to a fix–dream link, not only to a fix.
- **Affordance theory reaches the same conclusion from perception.** Chemero defines affordances as relations between an animal's abilities and features of the environment, and Stoffregen as properties of the animal-environment system. Neither is a property of the person or the world alone. Norman later argued that what design must provide are signifiers: the cues that let someone see what is possible.
- **AI planning is the oldest working version of "what is true, what's wanted, what changes it".** In STRIPS a world model is a set of statements, a goal is a statement to make true, and each operator has preconditions and add and delete lists. No statement has a role until an operator mentions it. PDDL3 adds soft goals and soft constraints with penalty weights, the planning version of "preferred but not required".
- **Requirements engineering supplies the relationship vocabulary.** i* (iStar 2.0) has goals, qualities (soft goals), tasks, and resources; contribution links typed make, help, hurt, and break; a resource "needed by" a task; and dependencies between actors. KAOS writes goals as "if current condition C, then sooner or later target T", and defines an obstacle as a condition under which a goal can't be met.
- **KAOS's resolution tactics describe the infant example exactly.** Its tactics include avoid the obstacle, mitigate it, weaken the goal, and substitute the goal. "I care for an infant at night" is an obstacle to "sleeping through the night"; showing "getting back to sleep quickly" first is goal substitution. KAOS also keeps exceptions out of the ideal goal model so it doesn't blow up combinatorially, a reason to keep dreams written for everyone and attach conditions as separate links.
- **Context research warns against fixing the list of conditions in advance.** Dourish argues that context is a relational property, not information; that it can't be delineated ahead of time; and that it arises from the activity. Adomavicius, Mobasher, Ricci, and Tuzhilin note that it is often hard to know a priori which contextual factors matter, and that context can be asked for, sensed, or inferred.
- **Jobs to Be Done says circumstances beat traits.** Christensen and colleagues argue that the circumstances in which people try to make progress matter more than buyer characteristics. For It, ask about situations ("I work nights"), not demographics (age, income bracket).
- **Futures studies separates plausible from preferable, and Spivak joins them in one story.** Voros defines plausible futures as those that could happen given current knowledge, and preferable futures as a separate, normative judgment. A dream is preferable; whether a path to it is plausible depends on the person's present. Design fiction (Bleecker) uses made things to tell stories about near futures, to provoke discussion; plausible fiction aims to be enacted.
- **The smallest model that could grow is two record types: conditions and condition links.** A condition is a first-person statement with no role. A link says what one condition does to one dream, fix, or fix–dream link: more or less relevant, required, blocked, helped, or hindered. An optional third relation, "a fix changes a condition", turns the same records into Spivak's Petri net later without throwing anything away. All of it is shared content about a range of situations; a person's own conditions would be a separate, later question with its own permission and privacy design. Build it only if the probe shows conditions help in more than one stage; the probe design below says how to tell.

## The question in It's terms

It has three kinds of thing today: pains, dreams (desired end states, one pain each), and fixes (concrete ways to help reach a dream, linked to dreams). The founder's three things map onto them as follows. "What someone wants to be true" is a dream. "What could change what is true" is a fix. "What is true" has no home yet: that is the person's conditions.

The pilot's redrafted dreams already show why conditions matter. Sleep has `sleeping-through-the-night`, `back-to-sleep-quickly`, `sleep-at-hours-that-fit`, and `both-of-us-sleep-well`; Rent has `room-for-family`, `own-place`, and `near-what-matters`; Loneliness has `feeling-close-to-the-people-i-live-with` and `time-alone-that-doesnt-feel-lonely`. Each of these is written for everyone, yet each is clearly more relevant to some situations than others. `both-of-us-sleep-well` only makes sense with a partner; `room-for-family` with children; `feeling-close-to-the-people-i-live-with` with housemates.

The working hypothesis to test: a condition is a plain statement about a situation some people are in, and every role it plays (constraint, resource, ability, commitment, relationship) is a relationship between that statement and a dream or fix.

## What the research is for

The founder set the aim after the first draft of this note: the decision ahead is whether making conditions explicit improves what the generator produces. A small probe on the three pilot pains, separate from the pilot's old-versus-new comparison, will test it on three questions:

1. **Discovery.** Does reasoning about conditions surface meaningful dreams or fixes the ordinary generator missed? For example, Rent's "stay in my home" versus "move closer to family", or Loneliness's "many shallow conversations" versus "close friends who live far away".
2. **Organization.** Do conditions help decide whether two dreams should stay separate or be grouped (two dreams, or one dream with different fixes)?
3. **Applicability.** Do conditions improve matching or explaining fixes ("works if you share a bedroom", "won't fit night shifts")?

The readout decides placement. If conditions help only with applicability, they belong in fix generation. If they help only with discovery, the dream writer reasons through contrasting situations and nothing is stored. If they help across several stages, that is evidence for a shared, structured representation.

The founder's constraints, which the rest of this note follows:
- **Compare actual outputs, not counts of relationships.** Conditions and links count only when they change a dream, a fix, a grouping, or an explanation.
- **Keep hypothetical situations separate from facts about a person.** The generator reasons about the range of plausible situations ("some people work nights"). Learning which apply to a particular person is a later question that needs permission and privacy design.
- **Inform, don't exclude.** Conditions shape relevance, prerequisites, feasibility, and conflicts. They never make a dream illegitimate (an infant makes sleeping through the night harder, not invalid), and never permanently remove a fix ("can't afford a specialist" is a block another fix might get around).
- **Baseline limits.** The staged pilot has dreams but no fixes yet, so discovery and organization can be tested on dreams now; applicability waits for the pilot's fix stages.

Sections 1–6 below cover the sources. The sections after them answer the aim directly: each area against discovery, organization, and applicability; plausible fiction as reasoning over a range of situations; where conditions earn a shared structure; and a probe design.

## 1. David I. Spivak

### Plausible fiction: the blog post (2024)

- **What it says.** The essay, tagged "informal" and "vision", argues that people could use new media, supported by math, to make self-fulfilling prophecies that tend to solve the problems they see. It defines a plausible fiction by four criteria: it begins with the world as it is now, without distortion; it ends with a future the author wants; it follows natural laws and social dynamics throughout; and it is "memetically fit", inviting readers to take part. The word "fiction" is chosen to lighten the author's burden: it hasn't happened yet. The mechanism is a conjecture: enacting plausible fictions takes only recursively and plausibly filling the gaps. A gap is either plausibly fillable or not; one implausible gap makes the whole fiction implausible. Filling is fractal, down to bodily action ("pass the salt"), and shared among many people, with the biggest gaps filled first. To steer away from a fiction, one finds an unfillable gap or writes a "defeater" fiction. Spivak links proposals to prediction: a proposal is close to a forecast given one's needs, abilities, and the world's state. In his words, "Wanting and guessing come together in a story." He proposes applied category theory as the infrastructure but leaves the formal system as an open gap. — [source: Spivak, "Plausible fiction", Topos Institute blog, 2024-08-27] (confidence: high)
- **What it doesn't say.** It doesn't discuss an individual's personal circumstances, constraints, or abilities as data, and doesn't propose a model for them. Its examples are a dinner table, Edison's light bulb, a kitchen, a math proof, and the future of work.

### Plausible fiction: the talks (2024)

- **What they say.** "Plausible Fiction: Accounting for Actualizing Potential" (IPAM, Naturalistic Approaches to AI, 2024-11-05) and "Plausible Fiction: Tending Actualizes Potential" (MIT CEE, ACT4ED, 2024-12-02) are near-identical decks. They restate the four rules (starts from the present "with minimal distortion"; ends with a future the author sees as good, "or at least open"; plausible the whole way; memetically fit) and the one mechanism, filling gaps where the "how" is unclear. The analogy is a conjecture in math: good futures are conjectures, gap-filling is breaking a theorem into lemmas, and the fiction coming true is the proof. Potential is "what could be, if only..."; care "tends to actualize potential". — [source: Spivak, IPAM and MIT slides, slides 1–3, 20] (confidence: high)
- **The math sketch.** Slides 12–14 propose three steps, each explained here in plain words:
  - *Petri nets.* A Petri net has two kinds of thing: resources and transitions. Each transition takes some resources in and puts others out ("separate egg" takes an egg and gives a yolk and a white). Spivak draws resources as wires and transitions as boxes; a lemon-meringue pie recipe is a network of five boxes and eleven wires.
  - *Operadic gap-filling.* Each wiring diagram is a plausible fiction and each box is a gap. "Prepare pie" from crust, butter, sugar, and eggs is one box; the recipe fills it with smaller boxes ("make lemon filling"), which in turn are gaps. A box filled with no boxes is done. An *operad* is just the grammar of putting boxes inside boxes.
  - *Operad algebras.* An algebra says what can actually fill each gap (for "separate egg", the set of ways to separate an egg) and how fillings combine. Different algebras give different fillers; one example adds up minutes, so a recipe whose sub-steps are labelled 15, 10, 2, 2, and 3 minutes is labelled 22 minutes as a whole (the slide gives the numbers, not the rule; some steps presumably overlap). Spivak suggests plausible fiction might be "more general" than this but "still operadic".
  — [source: Spivak, IPAM and MIT slides, slides 12–14] (confidence: high)
- **Caveat in his own words.** Slide 10 says he doesn't have a category-theory account of potential actualization and that "This is all just plausible fiction." The ethics section proposes "sustainable care" as a working definition of good and a test for any project P: if P succeeds, is it easier to imagine good or bad futures? (slides 16–18).

### Weve: plausible fiction as software (2026)

- **What it is.** Spivak's homepage says he recently co-founded Weve, a company developing a "social manifestation tool" based on plausible fiction. The public repositories `dspivak/weve-frontend` (Next.js) and `dspivak/weve-backend` (FastAPI and Supabase) were created on 2026-04-09; on 2026-05-01 Spivak committed a "Plausible Fiction CT math layer" ported from an earlier prototype, with three design documents and a validation suite. The commit is co-authored with an AI model, so the documents are Spivak's project's own description, possibly drafted with AI help. Neither repository has a license, so this note summarizes and doesn't copy. — [source: dspivak.net; GitHub repositories and commit history] (confidence: high for what the code does)
- **What the model is.** A plausible fiction in Weve is a flowchart of tasks. Each task is a monomial `A · y^B`: `A` is the task's inputs (typed fields), `B` its possible outcomes (by default success and failure). Their example is buying pants, whose inputs are a size and a color. A flowchart is a tree: each outcome either leads to a next task or ends. Elaborating a task into a sub-flowchart fills a gap, and every ending of the sub-flowchart must say which outcome of the parent it counts as (`mapsTo`, "directions go backward"). On top of the tree sit optional extra structures, each one a "Kan residual": a chosen outcome on each task (the plan, or "recipe"), integer likelihoods on outcomes that sum to 100, and values propagated inward to give each inner task an expected value, which Weve treats as a "bounty" for whoever fills that gap. Likelihoods "percolate" outward: inner path probabilities multiply along paths and add up per parent outcome. A likelihood above 90 is labelled easy, above 5 plausible, otherwise unlikely; each task also carries a high/medium/low plausibility tag. Eleven structural invariants (plus three for likelihoods) are checked, including that a task's inputs can only use data in scope. — [source: `weve-frontend` `docs/pf/CATEGORY_THEORY.md`, `docs/pf/CT_INVARIANTS.md`, `src/lib/pf/ct/types.ts`, `src/lib/pf/ct/percolation.js`; `weve-backend` `app/schemas/flowchart.py`] (confidence: high)
- **What it implies.** Weve has goals (a root task with desired outcomes), tasks, and outcomes, but no entity for the author's situation. Situation appears as a task's inputs, as in-scope variables, and as likelihoods and plausibility on each step. That is the Petri-net reading again: a fact matters only as something a step needs or yields.

### Ologs (Spivak & Kent)

- **What it says.** An olog ("ontology log") is a category used for knowledge representation: boxes are types ("a person"), arrows are "aspects", and declared equal paths are facts. Every olog is a database schema; instances are its rows. Aspects must be functional: each thing of the source type gives exactly one thing of the target type. A relationship that isn't functional ("a father has a child") is represented by a new type `R` whose instances are tuples, with one arrow from `R` to each participating type: a subset of their combined product. Ologs of different authors can be compared and translated by functors. — [source: Spivak & Kent, "Ologs", arXiv:1102.1889 v2, sections 2.2–2.3, pp. 9–11] (confidence: high)
- **Plain words.** If "condition blocks fix" is a many-to-many fact, it gets its own table of rows (condition, fix, effect). The condition record itself says nothing about blocking anything.

### Databases as categories and data migration (Spivak)

- **What it says.** A schema can be a small category and a database state a set-valued functor on it. A map between schemas induces three functors that move data from one schema to the other, covering projections, unions, and joins across all tables at once. — [source: Spivak, "Functorial Data Migration", arXiv:1009.1166, abstract] (confidence: high)
- **Plain words.** If the richer future schema can be mapped onto the small one (each richer table "projects" onto a smaller one), data written today migrates along that map. The minimal model should be designed as a view of the richer one, so moving up loses nothing.

### Wiring diagrams and open systems (Spivak 2013)

- **What it says.** Nestable wiring diagrams form the morphisms of an operad; the paper applies them to database queries, plug-and-play circuits, and recursion. — [source: Spivak, "The operad of wiring diagrams", arXiv:1305.0297, abstract] (confidence: high; the body was not read)
- **Plain words.** This is the formal basis for "boxes inside boxes" in the plausible-fiction talks and for Weve's nested elaborations.

### Polynomial functors and context-dependent interaction (Niu & Spivak; Spivak 2020)

- **What it says.** A polynomial functor is informally a set of positions and, for each position, a set of directions; maps between them send positions forward and directions backward, modelling two-way communication. The book's informal reading: "a position is some status that may be held", and the directions at a position are the options available while holding it. — [source: Niu & Spivak, *Polynomial Functors: A Mathematical Theory of Interaction*, arXiv:2312.00990, preface p. v and section 2.3] (confidence: high) Spivak's 2020 grant narrative proposes Poly for "context-dependent interaction": systems whose very pattern of interaction changes with their states ("a robot opening its eyes", "companies changing suppliers"). — [source: Spivak, AFOSR 2020 project narrative, "Functorial Dynamics and Interaction", abstract and objectives] (confidence: high)
- **Plain words.** Think of a person's conditions as where they stand. What they can do from there is not a fixed list scored differently, but a list that depends on where they stand. Choosing a fix changes where they stand, which changes the next list. In It: conditions can change which fixes fit, not only how they rank. It can still show every fix, marking the ones that don't fit a situation as written.

### What Spivak's work implies for It

- **(a) First-class?** Yes, but only as plain statements with no built-in role: Spivak's resources are wires that boxes consume and produce. Plausible fiction's first rule makes the present a required part of every fiction.
- **(b) Relationships.** A fix *needs* conditions (inputs), *makes* conditions true (outputs), and is *plausible or not* from a given present. Gaps are unfilled steps. A defeater is a reason a path won't work.
- **(c) Without fixing roles.** Store the relation, not the type: an olog-style link table, or Petri-net arcs (condition → fix as input; fix → condition as output).
- **(d) Testable now.** Write a few hypothetical "presents" per pain and ask, as Spivak does: from this present, is there a plausible path to each dream? Where not, name the gap. Gaps are candidate new fixes.

## 2. The capability approach (Sen, Nussbaum, Robeyns)

- **What it says.** Functionings are achieved "beings and doings" (being well nourished, traveling); capabilities are the real opportunities to achieve them, "real" meaning obstacles have been removed, not just formal rights granted; the capability set is the range a person can choose from. Whether someone can convert means (resources and public goods) into a functioning depends on conversion factors: "the degree in which a person can transform a resource into a functioning". The standard example is a bicycle: its contribution to mobility depends on the rider's physical condition and skill (personal), on norms such as whether women may ride (social), and on roads and paths (environmental). Resources are means; capabilities and functionings are the ends. The approach stresses human diversity, agency (people may choose what lowers their own well-being), and the difficulty that deprived people may lower their expectations to cope. Nussbaum proposes a list of ten central capabilities as thresholds; Sen refuses a fixed list in favor of public reasoning. Capabilities can be more or less robust depending on their conversion factors. — [source: Robeyns & Byskov, "The Capability Approach", *Stanford Encyclopedia of Philosophy*, rev. 2025-04-17, sections 2.1–2.5, 3.4] (confidence: high; Sen's and Nussbaum's books were not opened, so their positions here are as the entry reports them)
- **Mapping to It (inference).** A dream is a functioning someone wants. A fix is a means. A condition is a conversion factor or a resource. The capability is "this dream is reachable for me", meaning at least one linked fix works given my conditions. The personal/social/environmental split is useful as a tag on a condition, not as a role.
- **(a) First-class?** Yes: the whole approach exists because the same means give different people different freedoms. Minimal form: a statement plus an optional personal/social/environmental tag.
- **(b) Relationships.** A conversion factor changes how much of a dream a fix delivers. That is a property of the fix–dream link, not of the fix alone: a car-share helps "living near my work" but not "room for my family". Blocked is the extreme case (factor near zero).
- **(c) Without fixing roles.** The entry itself defines the factor as a degree for a resource-functioning pair, so the role is relational by definition.
- **(d) Testable now.** For each hypothetical person, check that every dream they care about keeps at least one working fix. A dream with none is a capability gap, which is exactly the kind of thing It's "A change we'd make together" fixes exist for. Watch for adaptive preferences: conditions should reorder and annotate, and should not quietly hide dreams, or the app tells people in hard situations to want less.

## 3. Affordances (Gibson; Norman; Chemero; Stoffregen)

- **What it says.** As Norman summarizes Gibson, an affordance is a relationship between an agent and its environment: the actions a specific agent can take in a specific environment, existing whether or not anyone perceives it. Norman's design use (1988) meant *perceived* affordances; by 2008 he argued the term had been misused and that design must provide signifiers, perceivable cues, including social ones such as worn paths, that show what is possible. — [source: Norman, "Signifiers, not affordances", *Interactions* 15(6), 2008, jnd.org] (confidence: high for Norman; Gibson's 1979 book was not opened, so Gibson is secondhand via Norman) Chemero defines affordances as relations between the abilities of animals and features of the environment, real and perceivable but properties of neither alone. — [source: Chemero 2003, *Ecological Psychology*, abstract] (confidence: high) Stoffregen calls them emergent properties of the animal-environment system. — [source: Stoffregen 2003, *Ecological Psychology*, abstract] (confidence: high) Norman's 1999 paper on affordances and conventions was opened only as an abstract.
- **(a) First-class?** Abilities and environmental features are both first-class; the affordance is the relation. For It: "I can drive" and "there is no bus at night" are both conditions, and "can get to an evening group" is derived.
- **(b) Relationships.** Enables (an affordance exists) and blocks (it doesn't). Abilities and features combine: neither alone decides.
- **(c) Without fixing roles.** Chemero's and Stoffregen's definitions are exactly the founder's hypothesis: an affordance is a property of the pair, not of the person or the world.
- **(d) Testable now.** Norman's point is about display: test whether showing a reason ("Because you work nights") makes a reordered list read as right rather than arbitrary. The reason is the signifier.

## 4. Planning and goal-oriented requirements engineering

### STRIPS and PDDL

- **What it says.** STRIPS searches a space of world models for one in which a goal formula is true. A world model is a set of first-order statements (the robot is at a, box B is at b). Operators come in families with parameters, and each is described by preconditions and by the statements it adds and deletes. The planner uses means-ends analysis. — [source: Fikes & Nilsson 1971, *Artificial Intelligence* 2, pp. 189–191] (confidence: high) PDDL3 adds strong and soft goals and strong and soft constraints over the whole plan; soft ones carry violation penalties in the plan metric, so the planner prefers plans that violate fewer weighted preferences. It motivates this with problems where "goals cannot be achieved altogether". — [source: Gerevini & Long, "Preferences and Soft Constraints in PDDL3", ICAPS 2006 workshop, abstract and introduction] (confidence: high) PDDL2.1 adds time and numeric resources. — [source: Fox & Long 2003, *JAIR*, abstract] (confidence: high)
- **(a) First-class?** Yes, as statements in a state. Minimal form: atomic statements that hold or don't.
- **(b) Relationships.** Precondition (required), negated precondition (blocked), add and delete effects (what a fix changes), hard versus soft goal (a dream that must be met versus one preferred). Conflict appears when one action's effects delete another's preconditions.
- **(c) Without fixing roles.** A statement has no role until an operator mentions it, and the same statement can be one operator's precondition and another's effect. This is the cleanest prior art for "a constraint is a relationship".
- **(d) Testable now.** Encode two or three pilot fixes per pain as requires/changes, run hypothetical starting states by hand, and see which dreams become reachable. No planner is needed at this size.

### KAOS and i*

- **What it says (KAOS).** A goal model is an AND/OR graph: "why" questions give parent goals and "how" questions give subgoals. Behavioral goals take forms such as "if current condition C, then sooner or later target T" (achieve), "if C then always G" (maintain), and "if C then never B" (avoid). An obstacle to a goal is a satisfiable precondition for not meeting it; obstacles are identified, assessed for likelihood and severity, and resolved with tactics: avoid the obstacle, reduce its likelihood, mitigate it, weaken the goal, substitute the goal, restore the goal, or substitute the agent. Cailliau and van Lamsweerde argue for keeping the ideal model of normal situations visible and attaching exceptions separately, to avoid "a combinatorial blow-up of exceptional cases". — [source: van Lamsweerde & Letier 2000, *IEEE TSE*, abstract; Cailliau & van Lamsweerde, RE 2014, pp. 43–45] (confidence: high)
- **What it says (i*).** iStar 2.0 has actors and four intentional elements: goals (clear-cut), qualities (achieved to a degree; they guide the choice among alternatives), tasks, and resources. Refinement is AND or OR; in an OR refinement, a child task is a means for a goal. "NeededBy" links a resource to a task. Contribution links run from an element to a quality and are typed make, help, hurt, or break, from sufficient positive evidence to sufficient negative evidence. Dependencies link a depender, through a dependum, to a dependee: one actor relies on another for a goal, quality, task, or resource. — [source: Dalpiaz, Franch & Horkoff, *iStar 2.0 Language Guide*, arXiv:1605.07767, sections 4–6] (confidence: high) Yu's original paper frames i* as modelling stakeholder interests and how they may be "addressed, or compromised" by alternatives. — [source: Yu 1997, RE '97, abstract] (confidence: high)
- **(a) First-class?** KAOS: yes, as the current condition C inside a goal, and as obstacles. i*: resources and actors are first-class; a person's situation is spread across them.
- **(b) Relationships.** Make, help, hurt, break (to a quality); needed by (resource to task); obstructs (obstacle to goal); depends on (actor to actor). KAOS's resolution tactics are fix-generation moves.
- **(c) Without fixing roles.** KAOS puts the condition in the goal's antecedent, so the same goal applies differently by situation without rewriting the goal for each case. i* types the link, not the element.
- **(d) Testable now.** Treat each hypothetical condition as a candidate obstacle to each dream and each fix–dream link; for each obstacle, ask which tactic applies (substitute the dream, weaken it, or add a mitigating fix). "My partner wants better sleep too" is an i* dependency: it opens shared fixes and makes `both-of-us-sleep-well` relevant.

## 5. Jobs to Be Done and context in recommender and ubiquitous systems

- **What it says (JTBD).** Christensen and colleagues argue that product developers focus too much on customer profiles and correlations, and that the circumstances in which customers try to get a job done matter more than buyer characteristics. Their example is condo developers who found they were helping retirees move lives, not selling buildings. — [source: Christensen, Hall, Dillon & Duncan 2016, *Harvard Business Review*, abstract via OpenAlex] (confidence: high for the abstract; the article wasn't opened) The Christensen Institute describes JTBD as a lens on the circumstances that push people toward or away from decisions, with functional, social, and emotional dimensions; it advises learning from people who actually made the decision and expecting jobs to change as circumstances change. — [source: Christensen Institute, "Jobs to Be Done" theory page] (confidence: high)
- **What it says (context-aware recommenders).** Adomavicius, Mobasher, Ricci, and Tuzhilin classify a system's knowledge of context as fully observable, partially observable, or unobservable, and as static or dynamic; the static, fully observable case is what Dourish calls the representational view. They note it is often hard to know a priori which contextual factors matter, and that users rarely rate the same item under different contexts. Context can be asked for explicitly, sensed, or inferred from behavior. Context can be used before recommending (prefiltering), after (postfiltering), or inside the model. — [source: Adomavicius et al. 2011, *AI Magazine* 32(3), pp. 67–70] (confidence: high) Adomavicius et al. 2005 extend ratings from user and item to user, item, and context, and find the context-aware method better only in some situations, so they combine it with the plain method. — [source: *ACM Transactions on Information Systems*, abstract] (confidence: high) Baltrunas et al. 2011 on assessing which contextual factors are relevant was seen only as metadata.
- **What it says (Dourish).** Dourish names four assumptions behind "context" in systems: it is information, it can be delineated in advance, it is stable, and it is separate from the activity. He proposes the opposite on each: "contextuality is a relational property" between objects or activities; its scope is defined dynamically; it is particular to each occasion; and it arises from the activity. Context is "an achievement, rather than an observation". — [source: Dourish 2004, *Personal and Ubiquitous Computing*, author's copy, section 2] (confidence: high)
- **When is situation data worth collecting? (inference from these sources).** Use a condition only when it changes what It produces or shows: a dream, a fix, a grouping, or an explanation. Prefer a few volunteered statements over a profile. Don't infer conditions from behavior before signup (there is no stable identity to infer from, by design). Let people add a condition when it comes up ("this won't work for me because...") as Dourish's interactional view suggests, rather than a questionnaire up front.
- **(a) First-class?** Yes, but open-ended and few. A fixed context schema is what both Dourish and the recommender survey warn against.
- **(b) Relationships.** Prefilter (removes), postfilter (reorders), modelling (changes scores). In It these become blocks, more or less relevant, and helps or hinders, but It shouldn't prefilter: a blocked fix stays visible with its reason, and a dream is never hidden.
- **(c) Without fixing roles.** Dourish's "relational property" is the founder's hypothesis stated for interaction design.
- **(d) Testable now.** Hypothetical situations stand in for the "same item, different contexts" ratings that real users rarely give. A condition is worth keeping only if it changes an actual output: a dream, a fix, a grouping, or an explanation.

## 6. Futures and design: plausible, possible, preferable, and design fiction

- **What it says.** Voros's futures cone nests potential, possible (might happen, needing knowledge we don't have yet), plausible (could happen given current understanding of physical laws and social processes), probable (likely, from current trends), and projected (the business-as-usual default). Preferable futures are "normative value judgements", a separate dimension that can sit anywhere in the cone. — [source: Voros, "The Futures Cone, use and history", 2017] (confidence: high) Dunne and Raby's version (*Speculative Everything*, 2013) asks who decides what is preferable. — [source: secondary summaries only; the book was not opened] (confidence: low) Bleecker describes design fiction as making things that tell stories, bringing matters of concern into focus and inviting conversation about alternative near futures. — [source: Bleecker, "Design Fiction: A Short Essay on Design, Science, Fact and Fiction", Near Future Laboratory, 2009] (confidence: high for the essay page; the PDF wasn't read)
- **Against Spivak's term (inference).** Spivak's "plausible" means consistent with how physics and society work, like Voros's plausible, but he applies it to the whole path from now to then, not to an end state. Voros keeps plausibility and preference apart; Spivak's fiction joins them: a preferable end reached by a plausible path. Design fiction aims to provoke and question; plausible fiction aims to be filled in and enacted.
- **(a) First-class?** Yes: plausibility is always "given present knowledge", and for a person, present knowledge includes their conditions.
- **(b) Relationships.** A dream is judged preferable (by the person; the dream screen checks only that it is a well-formed end state). A path is judged plausible given conditions. These are different judgments on different records.
- **(c) Without fixing roles.** Plausibility is a relation between a path and a present, not a property of either.
- **(d) Testable now.** For each hypothetical present, write the shortest plausible fiction to one dream through linked fixes. A story that can't be written without a leap marks a gap.

## Areas against (a)–(d)

| Area | (a) Conditions first-class? Minimal form | (b) Relationships that matter | (c) How to avoid fixing roles | (d) Testable now with hypothetical situations |
|---|---|---|---|---|
| Spivak: plausible fiction, Petri nets, Weve | Yes; the present is rule one. Statements, no role | Needs (input), makes true (output), plausible from a present, gap | Roles come from wiring: input to one fix, output of another | For each hypothetical situation, try to write a plausible path to each dream; list gaps |
| Spivak: ologs, data migration, Poly | Yes; a type with instances | A non-functional relation is its own table; situation decides available options | Link table of (condition, target, effect); design the small schema as a view of the large one | Check that probe records map onto a richer schema without loss |
| Capability approach | Yes; tag personal, social, or environmental | Conversion factor on a fix–dream pair; blocked as factor near zero | Factor is defined on a pair | Every relevant dream keeps at least one working fix; watch for hiding dreams |
| Affordances | Abilities and environment features both first-class | Enables, blocks; combinations | Affordance is a property of the agent-environment pair | Does a shown reason make a reordered list read as right? |
| STRIPS and PDDL | Yes; atomic statements in a state | Requires, blocks (negated precondition), changes (add, delete), hard versus soft goal | A statement has no role until an action mentions it | Hand-run two or three fixes per pain as requires/changes from each hypothetical situation |
| KAOS and i* | Yes; the current condition C and obstacles; resources, actors | Make, help, hurt, break; needed by; obstructs; depends on | Condition in the goal's antecedent; types on links | Treat each condition as an obstacle; pick a tactic (substitute or weaken the dream, or add a fix) |
| JTBD, recommenders, Dourish | Yes, but few, open-ended, volunteered | Blocks (shown with a reason, not filtered), reorders (postfilter), helps, hinders | Contextuality is relational and occasioned; no fixed schema | Keep a condition only if it changes some dream, fix, grouping, or explanation in the probe |
| Futures and design fiction | Yes; plausibility is "given what is known now" | Preferable (dream) versus plausible (path given conditions) | Plausibility is a relation between path and present | Write the shortest plausible story per situation per dream |

## The six areas against discovery, organization, and applicability

What each area says about the founder's three questions. "Strong" means the area's own method is built for that job; "weak" means it touches it in passing; "none" means it is silent.

| Area | Discovery | Organization | Applicability |
|---|---|---|---|
| Spivak: plausible fiction, Weve | Strong: different presents give different stories and ends; gap-filling finds missing steps | Strong: same end by different paths is one goal (Weve's endings map back to one parent outcome); different ends are different goals | Strong: a "defeater" story shows why a path fails from some present; Weve's task inputs and plausibility tags |
| Spivak: ologs, Poly | None | Weak: a functor between ologs compares two ways of carving up the same subject | Strong: the situation decides which options are available (positions and directions) |
| Capability approach | Strong: attending to diverse situations surfaces dimensions that a default person misses | Strong: two dreams differ if the functionings (end states) differ; the same functioning reached under different conversion factors is one dream with different fixes | Strong: conversion factors decide how much a fix delivers for a dream |
| Affordances | Weak: Dourish's shoemaker learns to see new possibilities through practice | None | Strong: what is possible is a relation between abilities and environment; signifiers explain it |
| STRIPS and PDDL | None: planners search actions, they don't invent goals | Weak: one goal formula, many plans; soft versus hard goals | Strong: preconditions and effects |
| KAOS and i* | Strong: obstacle analysis exists to find what an over-ideal model misses; i* actor analysis finds shared goals (a partner's) | Strong: substitute or weaken a goal (a different dream) versus mitigate an obstacle (same dream, different fix); keep the ideal model separate from exceptions | Strong: make, help, hurt, break; needed by |
| JTBD, recommenders, Dourish | Strong (JTBD): circumstances reveal the real job; weak elsewhere | Weak (JTBD): group by circumstance, not by trait | Strong (recommenders): context changes rankings, though only in some situations |
| Futures and design fiction | Strong: scenarios and design fictions deliberately explore alternative futures from varied assumptions | Weak: preferable (the end) is a separate judgment from plausible (the path) | Weak: plausibility is judged given present knowledge |

Notes on the strong cells:
- **Capability approach, discovery.** The Stanford Encyclopedia of Philosophy entry says the approach widens the "informational basis" of assessment to include dimensions that matter most to some groups. It names social relations and hands-on care as dimensions that change how women's well-being is assessed. It ties this to critiques of theories built around an able-bodied, non-dependent, caregiving-free person. A dream writer that imagines only that default person will miss dreams like `both-of-us-sleep-well` or `room-for-family`.
- **KAOS, discovery and organization.** van Lamsweerde and Letier present obstacle analysis as the cure for requirements that are "too ideal" and therefore incomplete. Its tactics separate the two organization outcomes: *substitute goal* and *weaken goal* produce a different end state (a separate dream), while *mitigate obstacle* and *avoid obstacle* keep the end state and add a means (the same dream with a different fix).
- **JTBD, discovery.** The condo example: the job only became visible when the developers looked at the buyers' circumstance (leaving a home full of meaning), not their demographic.
- **Recommenders, applicability.** Adomavicius et al. (2005) found context-aware rating estimates better only in some situations and combined them with the plain method elsewhere. Context earns its place selectively, which supports judging conditions by whether they change outputs.

## Plausible fiction and a range of situations

The founder's question is whether plausible fiction bears on reasoning about a range of hypothetical situations, as opposed to modelling a specific person. From Spivak's own writing:

- **Nothing in it requires a real person.** A plausible fiction is a story. Its first rule asks it to start from the present "as it is, with minimal distortion", but the blog post's examples (the future of work, a math proof, a kitchen) start from a general present, not one individual's. Weve stores no situation; it stores goals, steps, and outcomes.
- **For a range, the first rule becomes a realism check on each hypothetical situation.** Read for It: each situation the generator reasons from should be one many people are really in, described without distortion ("some people care for a baby who wakes at night"), not an edge case invented to make a dream look good.
- **Discovery: write short fictions from contrasting presents.** Spivak's mechanism runs forward from a present to a good end. Run it from several deliberately different presents for one pain, and the good ends differ. Rent from "I've lived in this neighborhood twenty years" ends in staying put; from "my parents are getting older three hours away" it ends near family. The end states are dream candidates the ordinary writer may not produce. This is this note's application, not Spivak's.
- **Organization: same end, different paths.** Two fictions that end in the same state by different routes describe one dream with different fixes. Two fictions whose ends differ, even when they share steps, describe two dreams. Weve's structure encodes the first case: many inner endings map back to one parent outcome.
- **Applicability: defeaters and gaps.** Spivak's defeater fiction is a plausible story that shows why a path fails. From a given situation, "this fix won't work because..." is a defeater; "...but this other step gets around it" is gap-filling. That is the "inform, don't exclude" pattern: a block plus a route around it.
- **What it doesn't give.** It offers no rule for choosing which situations to consider, no measure of how common a situation is, and no data model for a person. Those come from elsewhere: the capability approach's personal, social, and environmental factors suggest how to vary situations, and JTBD suggests choosing circumstances over traits.

## Where conditions earn a shared structure, and where they don't

**A shared structure is earned when the same situation statements do work in more than one stage.** Planning (one world state feeds both goal tests and action preconditions), KAOS (the same conditions appear in goals, obstacles, and countermeasures), and the capability approach (conversion factors shape both which functionings matter and which resources deliver them) all keep one set of situation statements because they reuse it. For It, the signal would be a condition such as "I work night shifts" that changes a dream's relevance, decides a grouping, and explains a fix, and does so across several pains (Sleep, Loneliness, Always tired).

**It isn't earned when situations only help the writer think.** JTBD interviews, futures scenarios, design fiction, and plausible fiction all use situations as thinking tools and keep no situation database. Spivak's own app has no situation entity. If the probe finds that conditions help only discovery, the evidence says to put contrasting situations in the dream writer's instructions and store nothing.

**It isn't earned when situations only qualify fixes.** Weve attaches what a step needs to the step itself (its inputs). STRIPS attaches preconditions to each operator. If conditions help only applicability, fit notes on each fix ("works if you share a bedroom", "won't fit night shifts as written") are enough, with no shared table.

**Dourish and the recommender survey argue against fixing the list early either way.** Which situations matter is hard to know in advance and may change. A shared structure, if earned, should start small and stay open-ended.

## A probe design for the three pilot pains

The probe tests whether reasoning about situations changes the generator's outputs. Its dream half can run now on the pilot's redrafted dreams; its fix half waits for the pilot's fix stages. It stores situations only in its own run files, as hypothetical situations, never as facts about a person.

### Inputs

- The pilot's research brief and redrafted dreams for `poor-sleep/20261020-202908`, `rent-eats-everything/20261020-202909`, and `loneliness/20261020-202910`, **including the dreams the screen failed** (`staying-put`, `fair-rent`, `rent-builds-something`, `town-affordable`, `breathing-easily-asleep`, `someone-would-notice-if-i-went-quiet`, `friends-who-get-in-touch-with-me-first`), since the screen over-rejected.
- The pilot's `overlaps` field for each pain, as the organization baseline.
- **A situation set per pain**: 8–12 hypothetical situations, written as "some people..." statements, generated in a separate step before any dreams are written. Vary them deliberately along the capability approach's personal, social, and environmental factors and along a few common axes: time (shifts, caregiving), money, who you live with, people far away, place (tied to a job or a neighborhood), health, and rules (a lease, a visa). Include contrasting pairs on purpose: staying in a neighborhood versus family elsewhere (Rent); many acquaintances versus close friends far away (Loneliness); a baby who wakes at night versus a partner who also sleeps badly (Sleep). Each situation must pass a realism check (Spivak's first rule): it is common, and it is described plainly.

### Arms

- **Baseline.** The pilot's existing dream run (no situations). Nothing new to generate.
- **Control.** The same dream writer rerun with an instruction of the same length asking for more varied dreams, without situations. This separates "situations helped" from "asking for more helped".
- **Situated.** The same dream writer, given the situation set, writes one short plausible fiction per situation (start where they are; end where they'd want to be, still about this pain), then extracts candidate end states. The same why and swap checks apply. Situations never fail a dream.

### Discovery (runnable now)

- **Generated:** candidate dreams from the control and situated arms that don't match a baseline dream (matched by an isolated judge, with reasons).
- **Judged:** the founder sees the new candidates from both arms mixed, without labels, and marks each as meaningful and distinct (a real person in some situation would pick it, and it isn't a reworded baseline dream) or not.
- **Improvement:** the situated arm yields meaningful, distinct dreams that neither baseline nor control produced, of the kind the founder named ("stay in my home" alongside "move closer to family"; "many light conversations" alongside "close friends who live far away"). Matching the control arm's yield is no improvement.

### Organization (runnable now)

- **Generated:** for each pair in the pilot's `overlaps` field, and each near-duplicate pair the situated arm adds, the situated writer lists which situations would want one dream but not the other. If some situations want A and not B, the pair stays separate; if every situation that wants one wants the other and they differ only in route, the pair becomes one dream with different fixes. KAOS gives the labels: substitute or weaken (separate dreams) versus mitigate (same dream, different fix).
- **Judged:** the founder decides each pair without seeing the verdict, then compares.
- **Improvement:** the situated verdicts agree with the founder more often than the baseline's overlap reasons resolve the pair, or they settle pairs the founder found hard (for example `staying-put` and `near-what-matters`, or `sleeping-through-the-night` and `back-to-sleep-quickly`).

### Applicability (waits for the fix stages)

- **Generated:** for each fix, short fit notes against the same situation set, of four kinds: works if (a prerequisite), works better if, won't fit as written (with the situation), and a route around it (another fix, or a change to this one). Notes never remove a fix or a dream.
- **Judged:** the founder reads fixes with and without notes and marks each note correct or not, and whether it would change which fix a person in that situation tries first.
- **Improvement:** notes are mostly correct, change some first choices, and surface gaps: situations where a dream has no fix that fits, which become briefs for new fixes.

### Readout

| Result | Placement it supports |
|---|---|
| Situated arm beats control on discovery only | Contrasting situations go into the dream writer's instructions; nothing stored |
| Organization verdicts help, discovery doesn't | A situation pass in the overlap review; nothing stored |
| Fit notes help, dreams don't | Conditions belong in fix generation, as notes on each fix |
| Two or more stages help, with the same situations doing the work | Evidence for a shared, structured representation (the smallest data model below) |
| None help | Option 0 |

### Guard rails

- Compare outputs, not counts: a situation that changes no dream, fix, grouping, or explanation is dropped from the readout.
- Situations stay hypothetical and live only in the probe's run files.
- Situations never fail a dream and never delete a fix; the dream screen stays a separate step.
- Keep the probe apart from the pilot's old-versus-new comparison, so neither result contaminates the other.

## A common shape

Every area above, read together, suggests one shape with three record types and no role types:

- **Condition**: a first-person statement that can be true of a person ("I work night shifts"). It carries no role.
- **Dream**: what someone wants to be true. Formally a dream is also a condition, a desired one, which is how Spivak, STRIPS, and KAOS all treat goals. It doesn't need to be stored that way now.
- **Fix**: what could change what is true. In planning and Petri-net terms it has inputs (conditions it requires) and outputs (conditions it makes true, including progress toward a dream).

Roles live only on links:

| Link | From → to | Meaning | Prior art |
|---|---|---|---|
| more relevant / less relevant | condition → dream | Show this dream earlier or later for people this is true of | KAOS goal antecedent; JTBD circumstances; postfiltering |
| requires | condition → fix (or fix–dream link) | The fix only works if this is true | STRIPS precondition; i* NeededBy; Petri-net input |
| blocks | condition → fix (or fix–dream link) | The fix doesn't fit as written if this is true. It stays in the catalog, and another fix may get around the block | Negated precondition; i* break; KAOS obstacle |
| helps / hinders | condition → fix (or fix–dream link) | The fix works better or worse if this is true | i* help and hurt; conversion factor |
| changes (makes true / makes false) | fix → condition | Doing the fix changes the person's situation | STRIPS add and delete lists; Petri-net output |

"Opens" and "conflicts" need no link types of their own. A condition opens a fix when the fix requires it ("my partner wants better sleep too" → "take turns on night feeds"). Two fixes conflict when one changes a condition the other requires or is blocked by. A commitment ("I care for my mother most evenings") is just a condition that blocks or hinders evening fixes.

## Options for It

Each option is a place conditions could live. The probe's readout picks among 1, 2, and 3; options 4–6 extend 3 later.

### 0. No conditions

People already pick dreams, and their picks partly reveal their situation. Nothing new is generated or stored.
- *For:* nothing to build; no privacy question.
- *Against:* fixes that don't fit a situation get no note; dreams like `both-of-us-sleep-well` get no explanation of whom they're for.

### 1. Situations as a thinking tool for the dream writer (discovery only)

The dream writer reasons through contrasting hypothetical situations, as in the probe's situated arm, and keeps only the dreams. Situations appear in the run files as working notes of that step.
- *For:* cheapest; matches how JTBD, futures methods, and plausible fiction use situations; no new data model.
- *Against:* nothing reaches fixes or the app; organization and applicability get no help.

### 2. Fit notes on each fix (applicability only)

Each fix carries short notes: works if, works better if, won't fit as written, and a route around it. Notes are fields on the fix, like Weve's task inputs or STRIPS preconditions.
- *For:* helps people choose and gives honest limits, consistent with "honesty lives in fields"; no shared table.
- *Against:* the same situation is written again on many fixes, and dreams aren't touched.

### 3. Shared conditions and links (several stages)

Conditions become shared records, and links connect them to dreams, fixes, and fix–dream links: the smallest data model below, written as generator output and reviewed like dreams and fixes.
- *For:* one situation statement serves discovery, grouping, and fit notes, and across pains; becomes Relations in the content graph later.
- *Against:* more review per pain; only worth it if the probe shows the same situations doing work in more than one stage.

### 4. Option 3 plus "changes" links: fixes as transitions

Add fix → condition links (makes true, makes false), so fixes chain: one fix's result meets another's prerequisite.
- *For:* captures "what could change what is true"; turns "won't fit as written" into a route around it; the Spivak and STRIPS reading.
- *Against:* chains invite over-engineering; harder to judge.

### 5. Conditions as Things in the Thing / Type / Relation layer

Conditions become Things with Types; links become Relations, each a claim with who made it, confidence, and review state.
- *For:* one vocabulary across pains; reuses the agreed claims machinery.
- *Against:* that layer is post-launch.

### 6. A formal compositional model (Poly, operads, or a planner)

- *For:* most expressive; directly in Spivak's line of work.
- *Against:* far beyond the MVP's needs; needs its own decision record.

This note doesn't choose. The probe decides between 1, 2, and 3; the literature predicts help for discovery (JTBD, capability approach, KAOS, futures) and applicability (planning, i*, recommenders), with organization the least tested.

## The smallest data model

This is the model for option 3, if the probe earns it. Two record types, plus one optional link kind. All of it is shared content about a range of situations; none of it is about a particular person.

```ts
// A situation some people are in. No role.
type Condition = {
  id: string;            // stable, e.g. "works-night-shifts"
  statement: string;     // "Some people work night shifts." (a first-person form is a later UI question)
  tags?: ("personal" | "social" | "environmental")[]; // capability-approach source, optional
  painIds?: string[];    // where it has come up so far; not a restriction
};

// What one condition does to one target.
type ConditionLink = {
  id: string;
  conditionId: string;
  target:
    | { kind: "dream"; dreamId: string }
    | { kind: "fix"; fixId: string }
    | { kind: "fix-dream"; fixId: string; dreamId: string };
  effect:
    | "more-relevant" | "less-relevant"     // dreams only
    | "requires" | "blocks"              // fixes and fix–dream links
    | "helps" | "hinders";
  why: string;           // one plain sentence, for review and for a "Because ..." line
  claim: { by: string; confidence: number; review: "draft" | "approved" | "rejected" };
};

// Optional: what doing a fix changes (the Petri-net output).
type FixChange = {
  fixId: string;
  conditionId: string;
  makes: "true" | "false";
  why: string;
};
```

Why this shape:
- **Roles live in `effect`, never in `Condition`.** "I can't afford a specialist" is the same record whether it blocks one fix and helps another (it might make a free self-guided program the better match).
- **Links can target a fix–dream link**, because a conversion factor belongs to a fix and a dream together.
- **`claim` copies the Thing / Type / Relation decision** (who made it, confidence, review state), so condition links become Relations later without changing their meaning. `Condition` becomes a Thing.
- **`FixChange` plus `requires` is a Petri net.** Requirements are a fix's input wires; changes are its output wires. Chaining, gaps, and plausible paths can be computed later from the same records.
- **The small schema is a projection of the larger one**, so a later migration maps data forward instead of rewriting it (Spivak's functorial data migration in plain terms).
- **A person's situation is not in this model.** It is a set of `Condition.id`s (and maybe some free text) held on the device. Showing the right dreams and fixes is a filter and sort over shared links, computed on the device.

Things deliberately left out: numeric strengths beyond `confidence`, probabilities on outcomes (Weve's likelihoods), condition hierarchies, negated conditions (write "I can't drive" as its own statement), and time ("for the next six months"). Each can be added as a field without changing existing records.

## Privacy implications

The probe needs none of this: it reasons only about hypothetical situations. This section is about a later step, if It ever learns which situations apply to a particular person.

`AGENTS.md` sets the rules this must fit:

- **Before signup, a person's conditions are personal answers and stay on the device.** They are at least as sensitive as picks: caring for an infant, working nights, health limits, money, a partner, and immigration status can all be conditions. The model above is built for this: links are shared content shipped with each pain, and matching runs on the device, so no condition needs to leave it.
- **No stable anonymous identity.** Conditions held before signup can't be stored in a way that links visits; they live only as long as the local onboarding state does, the same as other pre-signup answers.
- **Measurement never includes conditions.** The measurement invariant already excludes picks and selected fixes before signup; conditions belong on the same side of that line. Per-page views and opened pains are allowed; "which conditions were chosen" is not, including counts that could identify a person.
- **After signup, sending conditions is a new data flow.** Syncing a person's conditions to the server, or letting an LLM infer conditions from their free text, changes what It holds. The content-graph decision already says tagging people's own data by LLM needs a separate privacy decision; storing conditions server-side would need a decision record too, under the rule for changing a privacy invariant. Until then, conditions can stay device-only even for signed-in people.
- **Collect only what changes something.** If the probe shows a condition changes few dreams or fixes, don't ask for it. Make every condition optional, editable, and removable, and never require one to see fixes.
- **Contributed conditions follow the contribution rule.** If people add their own conditions ("this is my situation"), they are treated like contributed pains, dreams, and fixes: on the device before signup, sent only on an explicit choice after, reviewed before publication, and never published with who contributed them.
- **Public artifacts never expose personal conditions.** Shared pages may show dreams and fixes; they must not reveal which conditions a person holds, by default or by inference from what is shown.
- **The UI copy must say what happens to conditions** before any of this leaves the device, as the measurement rule requires for any data sent.

## Worked examples

These are hypothetical situations from a range, written in the first person only for readability; none is a fact about a person. "Blocks" means the fix doesn't fit as written for people in that situation; it stays in the catalog, and another fix may get around it. Dream IDs are the pilot's redrafted dreams. Fixes are short illustrative labels written for this note, not drafted or verified fixes. "↑" is more relevant, "↓" less relevant.

### Sleep ("I don't sleep well.")

| Condition | Link | Target |
|---|---|---|
| I care for a baby who wakes in the night. | ↑ | `back-to-sleep-quickly` |
| | ↓ | `sleeping-through-the-night`, `sleeping-until-morning` (for now) |
| | blocks | "Sleep with earplugs and a white-noise machine" (you need to hear the baby) |
| | hinders | "Keep the same wake time every day" |
| I work night shifts. | ↑ | `sleep-at-hours-that-fit`, `enough-hours-most-nights` |
| | blocks | "Get morning sunlight right after you wake" (as written for day sleepers) |
| | helps | "Black out the bedroom completely" |
| | requires (the fix needs it) | "Ask for a fixed shift pattern instead of rotating shifts" requires "I work night shifts" |
| I can't afford to see a sleep specialist. | blocks | "See a sleep doctor about insomnia therapy" |
| | helps (the better match) | "Try a self-guided insomnia therapy program" |
| My partner wants to sleep better too. | ↑ | `both-of-us-sleep-well` |
| | requires (opened) | "Take turns covering night feeds" requires this and the baby condition |

One fact, several roles: "I work night shifts" makes two dreams more relevant, blocks one fix as written, helps another, and is required by a third. "I care for a baby" substitutes one dream for another, KAOS-style, without rewriting either dream.

Fix changes (optional): "Take turns covering night feeds" makes "I get one unbroken stretch of sleep most nights" true, which is progress toward `enough-hours-most-nights`.

### High rent ("Rent eats everything.")

| Condition | Link | Target |
|---|---|---|
| My lease is up for renewal in the next three months. | ↑ | `predictable-rent` |
| | requires (opened) | "Ask your landlord for a two-year lease at a fixed rent" |
| My kids live with me. | ↑ | `room-for-family` |
| | ↓ | `own-place` |
| | blocks | "Rent a room in a shared house" |
| I can't move far from my job. | ↑ | `near-what-matters` |
| | blocks | "Move to a cheaper town farther out" |
| | hinders (on the fix–dream link) | "Move to a cheaper neighborhood" → `rent-leaves-room` (works only if the commute stays short) |
| My credit history is poor. | hinders | "Apply for a newer building with a credit check" |
| | helps (the better match) | "Ask about leases with a co-signer or a larger deposit" |
| I'm a member of a tenants' union. | helps | "Push for a cap on renewal increases with your neighbors" |

One fact, several roles: "My kids live with me" raises one dream, lowers another, and blocks a fix. "I can't move far from my job" blocks one fix as written and only weakens another for one dream, which is why links sometimes need a fix–dream target.

Fix changes (optional): "Find a roommate" makes "I split rent with someone" true; that helps `rent-leaves-room` and conflicts with `own-place`, because it makes the dream's own state false.

### Loneliness ("I'm lonely.")

| Condition | Link | Target |
|---|---|---|
| I moved to a new city this year. | ↑ | `seeing-people-who-know-me-in-person`, `talking-most-days-with-someone-who-knows-me` |
| | helps | "Call an old friend on a set evening each week" |
| | hinders | "Reconnect with people from your neighborhood" |
| I work from home. | blocks | "Get lunch with coworkers once a week" |
| | helps | "Join a weekday daytime class or club" |
| I live with my partner. | ↑ | `feeling-close-to-the-people-i-live-with` |
| | ↓ | `time-alone-that-doesnt-feel-lonely` |
| Big groups make me anxious. | hinders | "Go to a large meetup" |
| | helps | "Invite one person for a walk" |
| I care for my mother most evenings. | blocks | "Join an evening sports league" |
| | requires (opened) | "Join a caregivers' support group" |

One fact, several roles: "I work from home" blocks one fix and helps another. "I care for my mother most evenings" is a commitment, and it needs no separate system: it is a condition that blocks evening fixes and opens a group that only fits caregivers.

Fix changes (optional): "Join a weekday daytime class" makes "I see the same people every week" true, which other fixes ("Ask one person from the class for coffee") require. That chain is Spivak's gap-filling at its smallest.

## Gaps and open questions

- **Spivak and individuals.** His published plausible fiction is about shared futures and collective gap-filling, not one person's circumstances. Applying it to a person's situation is this note's inference. A short question to him or to Topos could check whether he sees it that way.
- **Weve's provenance.** The design documents were committed by Spivak with an AI co-author on 2026-05-01, ported from an earlier "PlausibleFiction" prototype that isn't public. They show his project's current design, not peer-reviewed claims.
- **Not opened.** Gibson 1979 (secondhand via Norman); Sen 1985 and 1992 and Nussbaum 2011 (as reported in the Robeyns and Byskov entry); Robeyns 2017 (the publisher's PDF refused downloads); Dunne & Raby 2013 (secondary summaries); Norman 1999 (abstract only); Baltrunas et al. 2011 (metadata only); Christensen et al. 2016 (abstract only); Bleecker's PDF (essay page only); the wiring-diagrams paper's body (abstract only).
- **Untested.** Whether people want to state conditions at all before signup; whether a "Because you ..." line helps or feels intrusive; whether conditions should be asked per pain or once across pains.
- **Open design questions for the grilling round.** The founder's rule "inform, don't exclude" settles that conditions never hide a dream. Still open: is "less relevant" worth having, or is "more relevant" enough? Should "changes" links be in the probe? If conditions are stored, who writes them: the generator, the founder, or (much later, with consent) people themselves?
- **Probe risk.** The situated arm generates more text than the baseline, so extra dreams could come from more sampling rather than from situations; the probe design includes a same-length control arm for this reason.

## Sources

Opened on 2026-10-20 unless stated.

**Spivak and Topos**
- Spivak, "Plausible fiction", Topos Institute blog, 2024-08-27: https://topos.institute/blog/2024-08-27-plausible-fiction/
- Spivak, "Plausible Fiction: Accounting for Actualizing Potential", IPAM Naturalistic Approaches to AI, 2024-11-05 (slides, full text): https://dspivak.net/talks/pdfs/20241105-ipam-naturalisticai.pdf
- Spivak, "Plausible Fiction: Tending Actualizes Potential", MIT CEE ACT4ED, 2024-12-02 (slides, full text): https://topos.institute/people/david-spivak/202412-MIT.pdf
- IPAM abstract page for the talk: https://www.ipam.ucla.edu/abstract/?tid=20144 (opened; the abstract did not load, so not used)
- Spivak, homepage (lists Weve, books, grants): https://dspivak.net/
- Weve frontend repository (no license; code and `docs/pf/` read): https://github.com/dspivak/weve-frontend
- Weve backend repository (no license; schemas and routers read): https://github.com/dspivak/weve-backend
- Spivak & Kent, "Ologs: A Categorical Framework for Knowledge Representation", arXiv:1102.1889 v2, 2011 (full text, sections 1–3; journal version not opened): https://arxiv.org/abs/1102.1889
- Spivak, "Functorial Data Migration", arXiv:1009.1166, 2010, rev. 2013 (abstract): https://arxiv.org/abs/1009.1166
- Spivak (2013), "The operad of wiring diagrams", arXiv:1305.0297 (abstract): https://arxiv.org/abs/1305.0297
- Niu & Spivak (2023, rev. 2024), *Polynomial Functors: A Mathematical Theory of Interaction*, arXiv:2312.00990 (preface and section 2.3): https://arxiv.org/abs/2312.00990
- Spivak, AFOSR 2020 project narrative, "Functorial Dynamics and Interaction" (abstract and objectives): https://dspivak.net/grants/AFOSR2020-Topos-ContextDependence.pdf
- Spivak, AFOSR 2022 project narrative, "Structure and dynamics of working language" (abstract and objectives): https://dspivak.net/grants/AFOSR2022-Structure_and_Dynamics_of_Working_Language.pdf

**Capability approach**
- Robeyns & Byskov, "The Capability Approach", *Stanford Encyclopedia of Philosophy*, substantive revision 2025-04-17: https://plato.stanford.edu/entries/capability-approach/
- Robeyns (2017), *Wellbeing, Freedom and Social Justice*, Open Book Publishers, doi:10.11647/OBP.0130 (download refused; not opened)

**Affordances**
- Norman (2008), "Signifiers, not affordances", *Interactions* 15(6): https://jnd.org/signifiers-not-affordances/
- Norman (1999), "Affordance, conventions, and design", *Interactions*, doi:10.1145/301153.301168 (abstract via OpenAlex)
- Chemero (2003), "An Outline of a Theory of Affordances", *Ecological Psychology*, doi:10.1207/S15326969ECO1502_5 (abstract via OpenAlex)
- Stoffregen (2003), "Affordances as Properties of the Animal-Environment System", *Ecological Psychology*, doi:10.1207/S15326969ECO1502_2 (abstract via OpenAlex)
- Gibson (1979), *The Ecological Approach to Visual Perception*, chapter 8 (not opened; secondhand via Norman)

**Planning and requirements engineering**
- Fikes & Nilsson (1971), "STRIPS", *Artificial Intelligence* 2 (full text, pp. 189–191): https://ai.stanford.edu/~nilsson/OnlinePubs-Nils/PublishedPapers/strips.pdf
- Fox & Long (2003), "PDDL2.1", *JAIR*, doi:10.1613/jair.1129 (abstract via OpenAlex)
- Gerevini & Long (2006), "Preferences and Soft Constraints in PDDL3", ICAPS 2006 workshop (full text, abstract and introduction): https://artificial-intelligence.unibs.it/gerevini/papers/WS-PREF-ICAPS06.pdf
- van Lamsweerde & Letier (2000), "Handling obstacles in goal-oriented requirements engineering", *IEEE Transactions on Software Engineering*, doi:10.1109/32.879820 (abstract via OpenAlex; author copy downloaded, not read): https://webperso.info.ucl.ac.be/~avl/files/TSE-Obstacles.pdf
- Cailliau & van Lamsweerde (2014), "Integrating Exception Handling in Goal Models", RE 2014 (full text, pp. 43–45): https://webperso.info.ucl.ac.be/~avl/files/RE2014.pdf
- Dalpiaz, Franch & Horkoff (2016), *iStar 2.0 Language Guide*, arXiv:1605.07767 (full text, sections 4–6): https://arxiv.org/abs/1605.07767
- Yu (1997), "Towards modelling and reasoning support for early-phase requirements engineering", RE '97, doi:10.1109/ISRE.1997.566873 (abstract via OpenAlex)

**Jobs to Be Done and context**
- Christensen, Hall, Dillon & Duncan (2016), "Know Your Customers' 'Jobs to Be Done'", *Harvard Business Review* (abstract via OpenAlex)
- Christensen Institute, "Jobs to Be Done": https://www.christenseninstitute.org/theory/jobs-to-be-done/
- Adomavicius, Mobasher, Ricci & Tuzhilin (2011), "Context-Aware Recommender Systems", *AI Magazine* 32(3), pp. 67–80 (full text): https://ojs.aaai.org/aimagazine/index.php/aimagazine/article/view/2364
- Adomavicius, Sankaranarayanan, Sen & Tuzhilin (2005), "Incorporating contextual information in recommender systems using a multidimensional approach", *ACM Transactions on Information Systems*, doi:10.1145/1055709.1055714 (abstract via OpenAlex)
- Baltrunas, Ludwig, Peer & Ricci (2011), "Context relevance assessment and exploitation in mobile recommender systems", *Personal and Ubiquitous Computing*, doi:10.1007/s00779-011-0417-x (metadata only)
- Dourish (2004), "What we talk about when we talk about context", *Personal and Ubiquitous Computing* (author's copy, full text): https://www.dourish.com/publications/2004/PUC2004-context.pdf

**Futures and design**
- Voros (2017), "The Futures Cone, use and history": https://www.thevoroscope.com/2017/02/24/the-futures-cone-use-and-history/
- Dunne & Raby (2013), *Speculative Everything*, MIT Press (not opened; secondary summaries only)
- Bleecker (2009), "Design Fiction: A Short Essay on Design, Science, Fact and Fiction", Near Future Laboratory (essay page): https://nearfuturelaboratory.com/essays/2009/design-fiction-a-short-essay-on-design-science-fact-and-fiction/
