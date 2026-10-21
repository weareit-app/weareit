# Idea Research: Conditions and possibility

- **Slug**: conditions-and-possibility
- **Created**: 2026-10-20
- **Question**: In It, a person picks a pain, then dreams, then sees fixes. A person's situation decides which dreams are relevant to them and which fixes would work for them, and the same fact can be a constraint for one fix, an advantage for another, and irrelevant to a third. So a constraint looks like a relationship between a fact and a possible course of action, not a type of fact. How should It represent what is true, what someone wants to be true, and what could change what is true, so that circumstances, abilities, constraints, resources, relationships, and commitments are not five separate systems? What do David Spivak's "plausible fiction" and related compositional work, the capability approach, affordances, AI planning and goal-oriented requirements engineering, Jobs to Be Done and context-aware systems, and futures and design fiction imply?
- **Evidence confidence (overall)**: high on what Spivak's own writing and code say about plausible fiction (blog post, two talk decks, and the Weve repositories, all read in full); high on the planning, requirements, context, and capability sources (originators' papers or an entry co-written by Robeyns); medium on affordances (Gibson's book not opened; later primary papers used); low on Dunne & Raby (secondhand only). No source models a person's situation inside an app like It; every mapping to It below is this note's inference, marked as such. Nothing here decides anything; the options are inputs to the founder's next grilling round.
- **Scope**: research only. Context read: `GLOSSARY.md` (Pain, Dream, Means, Fix, Fix kind); `docs/architecture/decisions.md` ("Content graph: Thing / Type / Relation" and "Generated possibility content"); `AGENTS.md` privacy invariants; `docs/style/copy-style-guide.md`; `docs/research/dream-layer/research.md` on `origin/claude/research-dream-layer-2b6c2e` (PR #134); and the redrafted pilot dreams in `dreams.json` and `dream-screen.json` for `poor-sleep/20261020-202908`, `rent-eats-everything/20261020-202909`, and `loneliness/20261020-202910` on `origin/claude/possibilities-pilot-79a436`. All sources were opened on 2026-10-20 unless marked otherwise. Example conditions, fixes, and wordings below are illustrations written for this note, not quotes, and not verified fixes.

## Summary

- **Spivak has written about plausible fiction, and it is directly relevant, but it is not a model of a person's situation.** His own blog post (Topos Institute, 2024-08-27) defines a plausible fiction as a story that starts from the present as it is, ends in a future the author wants, stays plausible the whole way given how physics and society work, and is easy for others to pick up. Its one mechanism is collaborators recursively filling "gaps", the places where the "how" is unclear. Two later talk decks (IPAM, 2024-11-05; MIT, 2024-12-02) repeat this and sketch the math. He says plainly that he has no category-theory account yet.
- **Plausible fiction maps onto It's three things almost one to one.** "The present moment, as it is" is the person's conditions; "a future the author sees as good" is a dream; "plausible the whole way" is whether a path of fixes works from those conditions. Its consequence for It: plausibility is not a property of a fix, but of a fix taken from a particular present. The same fix can be plausible for one person and not for another.
- **Spivak's sketch of the math treats facts the way the founder suspects: their role comes from how they're wired, not from what they are.** In the talks, a plan is a Petri net: resources are wires and transitions are boxes, and a transition consumes some resources and produces others. A resource has no fixed role; it is an input to one box and an output of another. A "constraint" is then a missing input, an "advantage" an available one, and a fix's result a new output.
- **Spivak's own app, Weve, encodes plausible fiction without any separate "situation" entity.** Its code (April to May 2026) models each task as inputs and possible outcomes (a "monomial", `A · y^B`), nests tasks inside tasks to fill gaps, and puts a chosen outcome, outcome likelihoods, and a high/medium/low plausibility tag on each task. A person's situation enters only as the typed inputs a task needs. Weve is evidence that the plausible-fiction framing needs conditions only as inputs to steps, not as a separate system.
- **Polynomial functors give the most exact picture of "situation decides the options".** Niu and Spivak's book defines a position as a status one can hold and directions as the options available while holding it. In It's terms, a person's set of conditions is a position, and the fixes open to them are its directions. A condition can change what is on the menu, not just how items rank. Spivak's 2020 grant calls this context-dependent interaction.
- **Ologs give the smallest piece of category theory It needs: a relationship that isn't a function becomes its own table.** Spivak and Kent show that a relation between several types is represented as a new type whose rows each point to one item of each. "Condition C rules out fix F" is exactly such a row. The role lives in the row, not in the condition.
- **The capability approach already calls situation facts relational.** The entry co-written by Robeyns defines a conversion factor as the degree to which a person can turn a resource into a functioning, sorted into personal, social, and environmental factors. A conversion factor belongs to a pair (this resource, this achieved state), so in It it can attach to a fix–dream link, not only to a fix.
- **Affordance theory reaches the same conclusion from perception.** Chemero defines affordances as relations between an animal's abilities and features of the environment, and Stoffregen as properties of the animal-environment system. Neither is a property of the person or the world alone. Norman later argued that what design must provide are signifiers: the cues that let someone see what is possible.
- **AI planning is the oldest working version of "what is true, what's wanted, what changes it".** In STRIPS a world model is a set of statements, a goal is a statement to make true, and each operator has preconditions and add and delete lists. No statement has a role until an operator mentions it. PDDL3 adds soft goals and soft constraints with penalty weights, the planning version of "preferred but not required".
- **Requirements engineering supplies the relationship vocabulary.** i* (iStar 2.0) has goals, qualities (soft goals), tasks, and resources; contribution links typed make, help, hurt, and break; a resource "needed by" a task; and dependencies between actors. KAOS writes goals as "if current condition C, then sooner or later target T", and defines an obstacle as a condition under which a goal can't be met.
- **KAOS's resolution tactics describe the infant example exactly.** Its tactics include avoid the obstacle, mitigate it, weaken the goal, and substitute the goal. "I care for an infant at night" is an obstacle to "sleeping through the night"; showing "getting back to sleep quickly" first is goal substitution. KAOS also keeps exceptions out of the ideal goal model so it doesn't blow up combinatorially, a reason to keep dreams written for everyone and attach conditions as separate links.
- **Context research warns against fixing the list of conditions in advance.** Dourish argues that context is a relational property, not information; that it can't be delineated ahead of time; and that it arises from the activity. Adomavicius, Mobasher, Ricci, and Tuzhilin note that it is often hard to know a priori which contextual factors matter, and that context can be asked for, sensed, or inferred.
- **Jobs to Be Done says circumstances beat traits.** Christensen and colleagues argue that the circumstances in which people try to make progress matter more than buyer characteristics. For It, ask about situations ("I work nights"), not demographics (age, income bracket).
- **Futures studies separates plausible from preferable, and Spivak joins them in one story.** Voros defines plausible futures as those that could happen given current knowledge, and preferable futures as a separate, normative judgment. A dream is preferable; whether a path to it is plausible depends on the person's present. Design fiction (Bleecker) uses made things to tell stories about near futures, to provoke discussion; plausible fiction aims to be enacted.
- **The smallest model that could grow is two record types: conditions and condition links.** A condition is a first-person statement with no role. A link says what one condition does to one dream, fix, or fix–dream link: more or less relevant, required, ruled out, helped, or hindered. An optional third relation, "a fix changes a condition", turns the same records into Spivak's Petri net later without throwing anything away. All of it is shared content; a person's own conditions are only a set of IDs held on their device, and the matching can run there.

## The question in It's terms

It has three kinds of thing today: pains, dreams (desired end states, one pain each), and fixes (concrete ways to help reach a dream, linked to dreams). The founder's three things map onto them as follows. "What someone wants to be true" is a dream. "What could change what is true" is a fix. "What is true" has no home yet: that is the person's conditions.

The pilot's redrafted dreams already show why conditions matter. Sleep has `sleeping-through-the-night`, `back-to-sleep-quickly`, `sleep-at-hours-that-fit`, and `both-of-us-sleep-well`; Rent has `room-for-family`, `own-place`, and `near-what-matters`; Loneliness has `feeling-close-to-the-people-i-live-with` and `time-alone-that-doesnt-feel-lonely`. Each of these is written for everyone, yet each is clearly more relevant to some situations than others. `both-of-us-sleep-well` only makes sense with a partner; `room-for-family` with children; `feeling-close-to-the-people-i-live-with` with housemates.

The working hypothesis to test: a condition is a plain statement about a person's situation, and every role it plays (constraint, resource, ability, commitment, relationship) is a relationship between that statement and a dream or fix.

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
- **Plain words.** If "condition rules out fix" is a many-to-many fact, it gets its own table of rows (condition, fix, effect). The condition record itself says nothing about ruling anything out.

### Databases as categories and data migration (Spivak)

- **What it says.** A schema can be a small category and a database state a set-valued functor on it. A map between schemas induces three functors that move data from one schema to the other, covering projections, unions, and joins across all tables at once. — [source: Spivak, "Functorial Data Migration", arXiv:1009.1166, abstract] (confidence: high)
- **Plain words.** If the richer future schema can be mapped onto the small one (each richer table "projects" onto a smaller one), data written today migrates along that map. The minimal model should be designed as a view of the richer one, so moving up loses nothing.

### Wiring diagrams and open systems (Spivak 2013)

- **What it says.** Nestable wiring diagrams form the morphisms of an operad; the paper applies them to database queries, plug-and-play circuits, and recursion. — [source: Spivak, "The operad of wiring diagrams", arXiv:1305.0297, abstract] (confidence: high; the body was not read)
- **Plain words.** This is the formal basis for "boxes inside boxes" in the plausible-fiction talks and for Weve's nested elaborations.

### Polynomial functors and context-dependent interaction (Niu & Spivak; Spivak 2020)

- **What it says.** A polynomial functor is informally a set of positions and, for each position, a set of directions; maps between them send positions forward and directions backward, modelling two-way communication. The book's informal reading: "a position is some status that may be held", and the directions at a position are the options available while holding it. — [source: Niu & Spivak, *Polynomial Functors: A Mathematical Theory of Interaction*, arXiv:2312.00990, preface p. v and section 2.3] (confidence: high) Spivak's 2020 grant narrative proposes Poly for "context-dependent interaction": systems whose very pattern of interaction changes with their states ("a robot opening its eyes", "companies changing suppliers"). — [source: Spivak, AFOSR 2020 project narrative, "Functorial Dynamics and Interaction", abstract and objectives] (confidence: high)
- **Plain words.** Think of a person's conditions as where they stand. What they can do from there is not a fixed list scored differently, but a list that depends on where they stand. Choosing a fix changes where they stand, which changes the next list. In It: conditions can remove or add fixes, not only reorder them.

### What Spivak's work implies for It

- **(a) First-class?** Yes, but only as plain statements with no built-in role: Spivak's resources are wires that boxes consume and produce. Plausible fiction's first rule makes the present a required part of every fiction.
- **(b) Relationships.** A fix *needs* conditions (inputs), *makes* conditions true (outputs), and is *plausible or not* from a given present. Gaps are unfilled steps. A defeater is a reason a path won't work.
- **(c) Without fixing roles.** Store the relation, not the type: an olog-style link table, or Petri-net arcs (condition → fix as input; fix → condition as output).
- **(d) Testable now.** Write a few hypothetical "presents" per pain and ask, as Spivak does: from this present, is there a plausible path to each dream? Where not, name the gap. Gaps are candidate new fixes.

## 2. The capability approach (Sen, Nussbaum, Robeyns)

- **What it says.** Functionings are achieved "beings and doings" (being well nourished, traveling); capabilities are the real opportunities to achieve them, "real" meaning obstacles have been removed, not just formal rights granted; the capability set is the range a person can choose from. Whether someone can convert means (resources and public goods) into a functioning depends on conversion factors: "the degree in which a person can transform a resource into a functioning". The standard example is a bicycle: its contribution to mobility depends on the rider's physical condition and skill (personal), on norms such as whether women may ride (social), and on roads and paths (environmental). Resources are means; capabilities and functionings are the ends. The approach stresses human diversity, agency (people may choose what lowers their own well-being), and the difficulty that deprived people may lower their expectations to cope. Nussbaum proposes a list of ten central capabilities as thresholds; Sen refuses a fixed list in favor of public reasoning. Capabilities can be more or less robust depending on their conversion factors. — [source: Robeyns & Byskov, "The Capability Approach", *Stanford Encyclopedia of Philosophy*, rev. 2025-04-17, sections 2.1–2.5, 3.4] (confidence: high; Sen's and Nussbaum's books were not opened, so their positions here are as the entry reports them)
- **Mapping to It (inference).** A dream is a functioning someone wants. A fix is a means. A condition is a conversion factor or a resource. The capability is "this dream is reachable for me", meaning at least one linked fix works given my conditions. The personal/social/environmental split is useful as a tag on a condition, not as a role.
- **(a) First-class?** Yes: the whole approach exists because the same means give different people different freedoms. Minimal form: a statement plus an optional personal/social/environmental tag.
- **(b) Relationships.** A conversion factor changes how much of a dream a fix delivers. That is a property of the fix–dream link, not of the fix alone: a car-share helps "living near my work" but not "room for my family". Ruled-out is the extreme case (factor near zero).
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
- **(b) Relationships.** Precondition (required), negated precondition (ruled out), add and delete effects (what a fix changes), hard versus soft goal (a dream that must be met versus one preferred). Conflict appears when one action's effects delete another's preconditions.
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
- **When is situation data worth collecting? (inference from these sources).** Ask for a condition only when it changes what It shows: it rules out or opens fixes, or reorders dreams, across enough items to matter. Prefer a few volunteered statements over a profile. Don't infer conditions from behavior before signup (there is no stable identity to infer from, by design). Let people add a condition when it comes up ("this won't work for me because...") as Dourish's interactional view suggests, rather than a questionnaire up front.
- **(a) First-class?** Yes, but open-ended and few. A fixed context schema is what both Dourish and the recommender survey warn against.
- **(b) Relationships.** Prefilter (rules out), postfilter (reorders), modelling (changes scores). In It these are rules-out, more or less relevant, and helps or hinders.
- **(c) Without fixing roles.** Dourish's "relational property" is the founder's hypothesis stated for interaction design.
- **(d) Testable now.** Hypothetical vignettes stand in for the "same item, different contexts" ratings that real users rarely give. Measure, per condition, how many dreams and fixes it changes; low-impact conditions aren't worth asking about.

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
| Spivak: plausible fiction, Petri nets, Weve | Yes; the present is rule one. Statements, no role | Needs (input), makes true (output), plausible from a present, gap | Roles come from wiring: input to one fix, output of another | Per vignette, try to write a plausible path to each dream; list gaps |
| Spivak: ologs, data migration, Poly | Yes; a type with instances | A non-functional relation is its own table; situation decides available options | Link table of (condition, target, effect); design the small schema as a view of the large one | Check that probe records map onto a richer schema without loss |
| Capability approach | Yes; tag personal, social, or environmental | Conversion factor on a fix–dream pair; ruled out as factor near zero | Factor is defined on a pair | Every relevant dream keeps at least one working fix; watch for hiding dreams |
| Affordances | Abilities and environment features both first-class | Enables, blocks; combinations | Affordance is a property of the agent-environment pair | Does a shown reason make a reordered list read as right? |
| STRIPS and PDDL | Yes; atomic statements in a state | Requires, rules out (negated precondition), changes (add, delete), hard versus soft goal | A statement has no role until an action mentions it | Hand-run two or three fixes per pain as requires/changes from each vignette |
| KAOS and i* | Yes; the current condition C and obstacles; resources, actors | Make, help, hurt, break; needed by; obstructs; depends on | Condition in the goal's antecedent; types on links | Treat each condition as an obstacle; pick a tactic (substitute or weaken the dream, or add a fix) |
| JTBD, recommenders, Dourish | Yes, but few, open-ended, volunteered | Rules out (prefilter), reorders (postfilter), helps, hinders | Contextuality is relational and occasioned; no fixed schema | Count how many items each condition changes; drop low-impact ones |
| Futures and design fiction | Yes; plausibility is "given what is known now" | Preferable (dream) versus plausible (path given conditions) | Plausibility is a relation between path and present | Write the shortest plausible story per vignette per dream |

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
| rules out | condition → fix (or fix–dream link) | The fix doesn't work, or would harm, if this is true | Negated precondition; i* break; prefiltering |
| helps / hinders | condition → fix (or fix–dream link) | The fix works better or worse if this is true | i* help and hurt; conversion factor |
| changes (makes true / makes false) | fix → condition | Doing the fix changes the person's situation | STRIPS add and delete lists; Petri-net output |

"Opens" and "conflicts" need no link types of their own. A condition opens a fix when the fix requires it ("my partner wants better sleep too" → "take turns on night feeds"). Two fixes conflict when one changes a condition the other requires or is ruled out by. A commitment ("I care for my mother most evenings") is just a condition that rules out or hinders evening fixes.

## Options for It

Each option is a step on one path; later ones extend earlier ones rather than replacing them.

### 0. No conditions; situation expressed by the person's picks

People already pick dreams, and their picks partly reveal their situation (someone who picks `back-to-sleep-quickly` has said something). Nothing new is stored.
- *For:* no new data, no privacy question, nothing to build.
- *Against:* can't rule fixes out, so a night-shift worker sees fixes that assume day work; doesn't answer the founder's question; dreams like `both-of-us-sleep-well` stay shown to everyone.

### A. A structured probe in run files, separate from the pilot comparison

For each of the three pilot pains, write four to six hypothetical vignettes of two to four conditions each, then generate condition links against the pilot's redrafted dreams and a small set of fixes, in a defined JSON shape (the one in the next section, not free-text notes). Judge links in isolation and have the founder review a sample.
- *For:* cheap; answers the founder's question with evidence before any schema; uses no personal data; the JSON shape is the minimal model, so nothing is thrown away if it holds.
- *Against:* hypothetical vignettes are written by the same people (or models) who write the links, so they may confirm the hypothesis too easily; needs at least a few real fixes per pain, which the pilot hasn't drafted yet.
- *What it would measure:* how often one condition plays different roles across fixes (the core hypothesis); how many items each condition changes (is it worth asking?); agreement between two isolated judges on each link's effect; whether every vignette leaves at least one working fix per relevant dream (capability gaps); and whether the founder finds the per-vignette dream order right.

### B. Conditions and condition links as generator output

Add conditions and condition links to the generator's output beside dreams, fixes, and fix–dream links, still as drafts in Git for founder review, the same way dreams and fixes are reviewed today.
- *For:* matches the decision that generator output mirrors the content graph; conditions get reviewed like everything else; the app can later show "Because you ..." reasons.
- *Against:* more review load per pain; a shared list of conditions across pains (night shifts affect Sleep, Always tired, and Loneliness) wants a cross-pain catalog sooner.

### C. B plus "changes" links: fixes as transitions

Add fix → condition links (makes true, makes false). Fixes can then chain: one fix's result meets another's requirement ("apply for rental assistance" makes "I can afford a deposit" true, which "move to a cheaper place" requires).
- *For:* captures "what could change what is true"; enables the Spivak and STRIPS reading (gaps, plausible paths, defeaters); lets It suggest a first step when a fix is ruled out.
- *Against:* chains invite over-engineering; most fixes in the MVP stand alone; quality of "changes" links is harder to judge.

### D. Conditions as Things in the Thing / Type / Relation layer

Conditions become Things with Types (for example Time, Money, People, Body, Place, Rules); condition links become Relations, each a claim with who made it, confidence, and review state, as the existing decision requires.
- *For:* one shared vocabulary across pains and features; reuses the agreed claims-and-confidence machinery; supports equivalences ("I work nights" and "I work the overnight shift" recorded as equivalent, not merged).
- *Against:* that layer is explicitly post-launch; doing this early pulls it forward.

### E. A formal compositional model (Poly, operads, or a planner)

Model the situation-dependent menu exactly (positions and directions), compute plausible paths, and percolate likelihoods as Weve does.
- *For:* the most expressive; composes; directly in Spivak's line of work, so his group's tools and ideas apply.
- *Against:* far more than the MVP needs; needs likelihoods It doesn't have; would need its own decision record under `AGENTS.md`.

The evidence favors A now, designed so its records are B's records, with "changes" (C) included as an optional field so the probe can test it. That ordering is this note's inference, not a decision.

## The smallest data model

Two record types, plus one optional link kind. All of it is shared content, written in the run files during a probe and later in the database; none of it is personal.

```ts
// A statement that can be true of a person. No role.
type Condition = {
  id: string;            // stable, e.g. "works-night-shifts"
  statement: string;     // first person: "I work night shifts."
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
    | "requires" | "rules-out"              // fixes and fix–dream links
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
- **Roles live in `effect`, never in `Condition`.** "I can't afford a specialist" is the same record whether it rules out one fix and helps another (it might make a free self-guided program the better match).
- **Links can target a fix–dream link**, because a conversion factor belongs to a fix and a dream together.
- **`claim` copies the Thing / Type / Relation decision** (who made it, confidence, review state), so condition links become Relations later without changing their meaning. `Condition` becomes a Thing.
- **`FixChange` plus `requires` is a Petri net.** Requirements are a fix's input wires; changes are its output wires. Chaining, gaps, and plausible paths can be computed later from the same records.
- **The small schema is a projection of the larger one**, so a later migration maps data forward instead of rewriting it (Spivak's functorial data migration in plain terms).
- **A person's situation is not in this model.** It is a set of `Condition.id`s (and maybe some free text) held on the device. Showing the right dreams and fixes is a filter and sort over shared links, computed on the device.

Things deliberately left out: numeric strengths beyond `confidence`, probabilities on outcomes (Weve's likelihoods), condition hierarchies, negated conditions (write "I can't drive" as its own statement), and time ("for the next six months"). Each can be added as a field without changing existing records.

## Privacy implications

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

Dream IDs are the pilot's redrafted dreams. Fixes are short illustrative labels written for this note, not drafted or verified fixes. "↑" is more relevant, "↓" less relevant.

### Sleep ("I don't sleep well.")

| Condition | Link | Target |
|---|---|---|
| I care for a baby who wakes in the night. | ↑ | `back-to-sleep-quickly` |
| | ↓ | `sleeping-through-the-night`, `sleeping-until-morning` (for now) |
| | rules out | "Sleep with earplugs and a white-noise machine" (you need to hear the baby) |
| | hinders | "Keep the same wake time every day" |
| I work night shifts. | ↑ | `sleep-at-hours-that-fit`, `enough-hours-most-nights` |
| | rules out | "Get morning sunlight right after you wake" (as written for day sleepers) |
| | helps | "Black out the bedroom completely" |
| | requires (the fix needs it) | "Ask for a fixed shift pattern instead of rotating shifts" requires "I work night shifts" |
| I can't afford to see a sleep specialist. | rules out | "See a sleep doctor about insomnia therapy" |
| | helps (the better match) | "Try a self-guided insomnia therapy program" |
| My partner wants to sleep better too. | ↑ | `both-of-us-sleep-well` |
| | requires (opened) | "Take turns covering night feeds" requires this and the baby condition |

One fact, several roles: "I work night shifts" makes two dreams more relevant, rules one fix out, helps another, and is required by a third. "I care for a baby" substitutes one dream for another, KAOS-style, without rewriting either dream.

Fix changes (optional): "Take turns covering night feeds" makes "I get one unbroken stretch of sleep most nights" true, which is progress toward `enough-hours-most-nights`.

### High rent ("Rent eats everything.")

| Condition | Link | Target |
|---|---|---|
| My lease is up for renewal in the next three months. | ↑ | `predictable-rent` |
| | requires (opened) | "Ask your landlord for a two-year lease at a fixed rent" |
| My kids live with me. | ↑ | `room-for-family` |
| | ↓ | `own-place` |
| | rules out | "Rent a room in a shared house" |
| I can't move far from my job. | ↑ | `near-what-matters` |
| | rules out | "Move to a cheaper town farther out" |
| | hinders (on the fix–dream link) | "Move to a cheaper neighborhood" → `rent-leaves-room` (works only if the commute stays short) |
| My credit history is poor. | hinders | "Apply for a newer building with a credit check" |
| | helps (the better match) | "Ask about leases with a co-signer or a larger deposit" |
| I'm a member of a tenants' union. | helps | "Push for a cap on renewal increases with your neighbors" |

One fact, several roles: "My kids live with me" raises one dream, lowers another, and rules out a fix. "I can't move far from my job" rules one fix out entirely and only weakens another for one dream, which is why links sometimes need a fix–dream target.

Fix changes (optional): "Find a roommate" makes "I split rent with someone" true; that helps `rent-leaves-room` and conflicts with `own-place`, because it makes the dream's own state false.

### Loneliness ("I'm lonely.")

| Condition | Link | Target |
|---|---|---|
| I moved to a new city this year. | ↑ | `seeing-people-who-know-me-in-person`, `talking-most-days-with-someone-who-knows-me` |
| | helps | "Call an old friend on a set evening each week" |
| | hinders | "Reconnect with people from your neighborhood" |
| I work from home. | rules out | "Get lunch with coworkers once a week" |
| | helps | "Join a weekday daytime class or club" |
| I live with my partner. | ↑ | `feeling-close-to-the-people-i-live-with` |
| | ↓ | `time-alone-that-doesnt-feel-lonely` |
| Big groups make me anxious. | hinders | "Go to a large meetup" |
| | helps | "Invite one person for a walk" |
| I care for my mother most evenings. | rules out | "Join an evening sports league" |
| | requires (opened) | "Join a caregivers' support group" |

One fact, several roles: "I work from home" rules out one fix and helps another. "I care for my mother most evenings" is a commitment, and it needs no separate system: it is a condition that rules out evening fixes and opens a group that only fits caregivers.

Fix changes (optional): "Join a weekday daytime class" makes "I see the same people every week" true, which other fixes ("Ask one person from the class for coffee") require. That chain is Spivak's gap-filling at its smallest.

## Gaps and open questions

- **Spivak and individuals.** His published plausible fiction is about shared futures and collective gap-filling, not one person's circumstances. Applying it to a person's situation is this note's inference. A short question to him or to Topos could check whether he sees it that way.
- **Weve's provenance.** The design documents were committed by Spivak with an AI co-author on 2026-05-01, ported from an earlier "PlausibleFiction" prototype that isn't public. They show his project's current design, not peer-reviewed claims.
- **Not opened.** Gibson 1979 (secondhand via Norman); Sen 1985 and 1992 and Nussbaum 2011 (as reported in the Robeyns and Byskov entry); Robeyns 2017 (the publisher's PDF refused downloads); Dunne & Raby 2013 (secondary summaries); Norman 1999 (abstract only); Baltrunas et al. 2011 (metadata only); Christensen et al. 2016 (abstract only); Bleecker's PDF (essay page only); the wiring-diagrams paper's body (abstract only).
- **Untested.** Whether people want to state conditions at all before signup; whether a "Because you ..." line helps or feels intrusive; whether conditions should be asked per pain or once across pains.
- **Open design questions for the grilling round.** Should conditions ever hide a dream, or only reorder it (the adaptive-preferences risk)? Is "less relevant" worth having, or is "more relevant" enough? Should "changes" links be in the probe? Who writes conditions: the generator, the founder, or people themselves?

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
