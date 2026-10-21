# Research: structures of inquiry, agency, and change

- **Slug**: inquiry-agency-structures
- **Created**: 2026-10-21
- **Question**: What general structures of inquiry, agency, and change are supported by existing research, and how might they explain both people's pursuit of possibilities and scientists' production of knowledge? Does the possibility model in "From Pain to Possibility" (the current sketch) rest on the right foundation?
- **Evidence confidence (overall)**: high on what the cited philosophers and theorists claim (Stanford Encyclopedia of Philosophy entries, publisher pages, and abstracts were read for most of them); medium on the empirical studies of scientists and of goal pursuit (abstracts and reviews, with known small samples in places); low on the proposed general structure, which is this note's own synthesis and has not been tested on anyone.
- **Scope**: research only. The current sketch is read as a set of hypotheses, not decisions. Nothing here changes a product decision in `AGENTS.md`. Proposals that touch personal data are written to fit the privacy invariants there (pre-signup answers stay on the device; no picks are measured before signup).
- **How claims are marked**: a plain citation means the claim was checked against the source, its abstract, its publisher page, or a Stanford Encyclopedia of Philosophy (SEP) entry during this research. "(unverified)" means it is cited from memory or only from secondary pages. "Inference:" marks this note's own reasoning.

## 1. Question and short answer

The founder asked two things. First, what do people pursuing a better life and scientists producing knowledge have in common, structurally, and where do they really differ? Second, is the current sketch's foundation (capabilities, affordances, planning, and causality, framed as getting from A to B) the right one?

**Short answer.** The sketch is right about most of what it says and too narrow about what it leaves out.

What holds up: possibility is relational (affordances and conversion factors); a desired state is not a route to it (causal recourse and interventionism); a fix's link to a dream is a claim with evidence, not a fact; collective change needs a model of who must act (shared agency and polycentric governance); and asking a person about their situation should be governed by expected value of the answer (this is experimental design under another name).

What is too narrow: the sketch treats A, B, and the measure of progress as given, and searches for transitions between them. Across pragmatism, the philosophy of scientific practice, design research, and the psychology of aspiration, the strongest shared finding is that **the problem, the end, and the way of telling whether you are getting closer are usually produced and revised inside the activity, not fixed before it.** Dewey says problems do not exist before inquiry and that ends are revised as means are explored. Schön and Dorst find that skilled practitioners spend much of their effort setting or reframing the problem. Steinle and Rheinberger show experiments that run without a theory to test and produce questions nobody could yet ask. Chang shows measurement standards being invented and improved by the same inquiry that uses them. Callard and Paul argue that some of the most important human choices are ones where the person's values are expected to change, so there is no fixed B to plan toward. Lehman and Stanley show computationally that fixed objectives can block the route to themselves.

So the A-to-B planning structure is best treated as **one mode** of a broader structure, not the structure itself. The candidate this note proposes (section 7) is a loop of situated inquiry with **revision at several levels**: a person or group in a situation meets a trouble or a pull, frames it, generates possibilities, makes moves that change the world or find something out, reads what comes back, and then revises the path, the means, the end, the frame, the measure, or themselves. Planning toward a fixed dream is what this loop looks like when the frame, the end, and the measure are held still. Exploration, discovery, measurement invention, reframing, and transformative choice are what it looks like when they are not.

This structure explains the science cases without forcing science into "undesirable state to preferred state", and it revises the account of human agency in the direction the founder suspected: people discover what they want, reframe what the problem is, and invent ways to notice progress. The structure is a hypothesis. The evidence for each part is uneven, and nothing has tested the whole.

## 2. What the current sketch assumes

Stated fairly, the sketch proposes a **possibility model** with six concepts:

- **State**: what is true now (A).
- **Desire**: what someone wants to be true or available to them (B), which may be an achieved state (a functioning) or a real freedom (a capability).
- **Intervention**: something an actor could do that may change the state.
- **Transition claim**: a claim, with evidence and uncertainty, about how an intervention changes reality.
- **Applicability**: a relation between the intervention, the situation, and the actors, so that facts like "I work nights" have no fixed role and matter only relative to a contemplated transition.
- **Path**: a composition of transitions from A toward B, with unresolved gaps that can themselves be decomposed (from Spivak's "plausible fiction", as the sketch reports it).

It adds an **actor** concept for collective fixes and a **value-of-information rule** for deciding which personal facts are worth knowing.

The implicit structure underneath is goal-directed search:

1. A is given (the pain plus relevant facts).
2. B is given (the dream picked).
3. The criterion of success is given (B reached or approached).
4. The work is to find, rank, and compose transitions from A to B.
5. Learning happens inside the transition claims (evidence and confidence), not in A, B, or the criterion.

The sketch is careful on several fronts. It warns against deterministic planning, against treating a counterfactual endpoint as an action, and against over-collecting context. It allows a dream to be a freedom, not only an end state. Its closing line, "We don't yet know the whole way there", is honest about gaps in the route. What it does not allow is a gap, or a change, in the **destination**, the **description of the starting point**, or the **yardstick**. That is the main thing this note tests.

## 3. Common operations across agency and inquiry

The operations below recur in both literatures. For each, the evidence is summarized with its strength.

### 3.1 Problematizing: noticing that something is wrong or interesting

- **Pragmatism.** Peirce's "The Fixation of Belief" (1877) says "the irritation of doubt causes a struggle to attain a state of belief", and he calls this struggle inquiry (section IV). Dewey's *Logic: The Theory of Inquiry* (1938) starts inquiry from an "indeterminate situation", a felt sense that something is amiss that persists as a guiding quality before anyone can say what the problem is (SEP, "John Dewey", section 4.3).
- **Science.** Kuhn's normal science works on puzzles, and discovery begins with anomaly, "a violated expectation" (SEP, "Thomas Kuhn", section 2; SEP, "Scientific Discovery", section 7). Kulkarni and Simon's KEKADA model of Krebs's urea-cycle work is driven by surprise: it reacts to a surprising result, delimits it, and searches for its mechanism (Kulkarni and Simon 1988).
- **Evidence on scientists.** Dunbar's in vivo studies of molecular biology labs are reported to have found that more than half of the results scientists obtained were unexpected, and that scientists first explain surprises methodologically and turn to new theory only when a pattern of surprises builds up (Dunbar 1995; Dunbar and Fugelsang 2005; numbers seen only in secondary summaries, so the figures are unverified). The design is observational, in a handful of labs, so treat it as strong on "surprise is common and central" and weak on any exact proportion.
- **Agency.** In It's terms the pain is the trouble. Inference: the pain is closer to Dewey's indeterminate situation than to a state A. "I don't sleep well" names a felt trouble, not yet a problem, and several problems can be instituted from it (falling asleep, waking, a partner's snoring, a shift schedule).
- **Not only trouble.** Curiosity and wonder also start inquiry. Oudeyer, Kaplan, and Hafner (2007) built robots driven by "learning progress" rather than by any problem, and their exploration self-organized into developmental stages. Gopnik (2020) argues that childhood is an extended period of exploration before exploitation. Inference: a model that starts only from pain will miss inquiry that starts from interest or attraction. The features list already anticipates this with "Starting from a dream instead of a pain" (`docs/spec/features.md`, "soon").

### 3.2 Framing: instituting the problem

- **Dewey.** Problems do not preexist inquiry; formulating a specific problem is a phase of inquiry (SEP, "John Dewey", section 4.3).
- **Design.** Simon (1973) argues that the boundary between well-structured and ill-structured problems is vague and that many problems usually treated as well structured are better treated as ill structured. Rittel and Webber (1973) say "wicked" social problems have no definitive formulation and no solutions in the sense of definitive answers. Schön (1983) describes professional work as "problem setting" followed by a "reflective conversation with the situation" in which the situation talks back. Dorst (2011) argues that "frame creation" is the core design practice: when neither the thing to make nor the principle by which it would work is known, designers adopt a frame ("if we look at the problem as if it were...") that makes a solution thinkable (equation details from memory, unverified).
- **Science.** Kuhn's exemplars tell a community which puzzles count and what a solution looks like (SEP, "Thomas Kuhn", section 3). Laudan (1977) treats science as solving empirical and conceptual problems, with problems defined relative to research traditions.
- **Agency.** Oettingen's mental contrasting pairs a wish with the main obstacle inside the person, which is a framing move: it changes what the person takes the problem to be. Meta-analyses find small to medium effects for mental contrasting combined with implementation intentions (g = 0.34 across 21 studies, with signs of publication bias; Wang, Wang, and Gai 2021).
- **Evidence strength.** Strong that framing matters in design and professional work (many case and protocol studies); the claim that framing is learnable and improves outcomes for laypeople has thinner direct evidence.

### 3.3 Abducing and imagining possibilities

- **Peirce.** Abduction is "the only logical operation which introduces any new idea" (CP 5.172). Its schema: a surprising fact C is observed; if A were true, C would be a matter of course; so there is reason to suspect A (CP 5.189). For Peirce it belongs to generating hypotheses, not justifying them (SEP, "Abduction", supplement "Peirce on Abduction", by Igor Douven).
- **Model-based reasoning.** Nersessian (2008) argues that new scientific concepts arise from the interplay of problem solving, contextual resources, and reasoning with constructed models that sit between a target and an analogical source. Dunbar's lab studies report frequent use of analogy, mostly close to home (unverified detail).
- **Hypothesis and experiment spaces.** Klahr and Dunbar (1988) model scientific reasoning as search in two spaces, hypotheses and experiments. Some participants generated the right rule only by generalizing from experimental results, not from memory. This is a small laboratory study (20 and 10 adults) with a toy device, so it is strong on the existence of two search routes and weak on how real scientists divide their effort.
- **Possibility studies.** Glăveanu (2020) gives a sociocultural account of "the possible" as both a precondition and an outcome of action, built on difference, position, perspective, dialogue, and culture. Kauffman (2000) names the "adjacent possible": what is one step away from the actual, which expands as the actual changes. Kauffman calls his own framework speculative.
- **Agency.** Markus and Nurius (1986) define possible selves as the selves people hope to become or fear becoming. Oyserman and colleagues report that possible selves change behavior only when they are linked to concrete strategies (Oyserman, Bybee, and Terry 2004 abstract; the 2006 school intervention details are unverified). Oettingen and Mayer (2002) found across four studies that positive expectations predicted more effort and better outcomes, while positive fantasies predicted less effort and worse outcomes, up to two years later.
- **Evidence strength.** The Oettingen result is a strong and repeated warning: vivid imagining of a good future, alone, can reduce action. Inference: It's dream lines should keep doing what the copy guide already asks (concrete, pictureable) while always sitting next to a way toward them, which the current card structure does.

### 3.4 Intervening and probing

- **Hacking.** *Representing and Intervening* (1983) argues that experimentation "has a life of its own" apart from theory and grounds entity realism in manipulation ("if you can spray them, then they are real"). Hacking also describes experiments that create phenomena rather than observe them (phrase not checked against the text; unverified).
- **Interventionism.** Woodward's account defines causation by what would happen to Y under an intervention on X, and explicitly says the account does not require human agents (SEP, "Causation and Manipulability", sections 4 and 8). Pearl's ladder separates association, intervention, and counterfactuals (Pearl 2019; Pearl and Mackenzie 2018).
- **Two kinds of action.** Kirsh and Maglio (1994) distinguish pragmatic actions, which move you closer to a goal, from epistemic actions, which uncover information that is hidden or hard to compute. Tetris players rotate pieces to see where they fit, not to place them. Later work has questioned how sharply the two separate.
- **Agency.** Inference: many good fixes are epistemic moves, not transitions toward B. "Jot down when you went to bed and got up for the next week" (the first step for insomnia therapy in `docs/style/copy-style-guide.md`) changes nothing about sleep; it produces information that changes the next decision. "Try sleeping apart for two weeks" is as much a probe as a solution. The sketch's transition claims only describe changes to the world state, so these moves have no place in it except as weak transitions.

### 3.5 Measuring and inventing ways to notice

- **Chang.** *Inventing Temperature* (2004) shows how thermometry was built without a prior standard to check it against. Chang's answer is "epistemic iteration": start from an imperfect footing, use its results to improve that footing, and repeat (Chang 2004, chapter 5; Chang's 2021 lecture abstract).
- **Rheinberger.** Experimental systems hold "epistemic things" (the objects still under investigation) and "technical objects" (stabilized tools and procedures). Yesterday's epistemic thing becomes tomorrow's technical object (Rheinberger 1997).
- **Agency.** Inference: people do the same thing. A person who cannot tell whether they sleep better invents a diary; a tenant group that cannot tell whether it is gaining power invents a measure (how many members came to the last meeting, a "structure test" in McAlevey's terms, cited in `docs/research/fix-kind-ideation/research.md`). The measure is part of the possibility, and it is often revised as the person learns what matters to them. The sketch treats "approach to B" as observable without saying by what.
- **Evidence strength.** Strong historical evidence for science. For everyday agency, self-monitoring is one of the better-supported behavior change techniques (BCT Taxonomy, Michie et al. 2013, as cited in the fix-kind research), but evidence that people **invent** measures, and that inventing them helps, is thin.

### 3.6 Coordinating with others

- **Shared agency.** Bratman's account of shared intention has each participant intend "that we J", with meshing subplans and an intention to act because of the others' intentions (SEP, "Shared Agency", by Abraham Sesshu Roth, section 2). Gilbert takes joint commitment as primitive, with obligations that only all parties can rescind (section 4).
- **Collective efficacy.** Bandura (2000) argues that groups' shared belief in their power to produce results supports commitment, resilience, and performance.
- **Commons.** Ostrom (1990) found that communities can govern shared resources without either market or state when certain design principles hold (clear boundaries, local rules, collective choice, monitoring, graduated sanctions, conflict resolution, recognition, nesting). Her 2010 Nobel lecture argues for polycentric governance.
- **Boundary objects.** Star and Griesemer (1989) show amateurs and professionals cooperating at a natural history museum through "boundary objects", things adaptable to different viewpoints yet robust enough to keep their identity across them, and through standardized methods.
- **Social epistemology.** Longino argues that objectivity in science comes from critical interaction in communities that meet four norms: venues for criticism, uptake of criticism, public standards, and tempered equality of intellectual authority (SEP, "The Social Dimensions of Scientific Knowledge", section 5). Kitcher's division of cognitive labor shows why a community benefits when some researchers pursue unlikely "maverick" approaches (same section).
- **Inference.** The sketch's actor concept captures who must act. That concept does not capture who must **agree that it worked**, or how people with different situations share a goal without sharing a frame. Boundary objects are the better model for It's shared pains and dreams: the same published dream ("Rents in my town that ordinary paychecks can cover") means different things to a renter, a landlord, and a city council member, and works across them because it is loose in the middle and firm at the edges.

### 3.7 Revising

- **Single and double loop.** Argyris and Schön (1978) define organizational learning as detecting and correcting error, and distinguish single-loop learning (change the strategy) from double-loop learning (question the governing values and assumptions that set what counts as an error).
- **Reticulated change.** Laudan (1984) argues that aims, methods, and theories justify one another in several directions, so the aims of science change over time and changing aims need not be irrational.
- **Means and ends.** Dewey held that the value of means and ends is reciprocally determined, and that "a full inquiry into the means needed to achieve the end may lead to a re-evaluation of the end itself" (SEP, "Dewey's Moral Philosophy", by Elizabeth Anderson, section 3.1). His "ends-in-view" are provisional, adopted in deliberation and revised in light of what acting on them shows (sections 2.2 to 2.4).
- **Conceptual change.** Kuhn's revolutions change which problems count and the standards for judging solutions; his later work locates incommensurability in changes of taxonomy (SEP, "Thomas Kuhn", section 4). Carey (2009) describes "Quinian bootstrapping", in which children build new concepts by using symbols first as placeholders and filling them in through analogy, thought experiment, and abduction. Critics call the mechanism imprecise.
- **Preferences.** Lichtenstein and Slovic (2006) summarize three decades of findings that preferences are often constructed during elicitation, so that choice and pricing give systematically different answers. Wilson and Gilbert (2005) find that people overestimate how intensely and how long future events will affect them (the impact bias), partly because they focus on one event and forget the rest of life.
- **Inference.** Revision at multiple levels is the clearest structural common ground between science and agency, and the clearest gap in the sketch, whose only learnable quantity is the confidence on a transition.

## 4. Genuine differences

The two cases share operations but not everything. These differences are real and should shape any model It builds.

| Dimension | Scientific inquiry | Personal and shared agency | Evidence and notes |
| --- | --- | --- | --- |
| **Aim** | Knowledge, understanding, control of phenomena. Chang's "activist realism" frames this as doing all we can to improve our knowledge of realities (Chang 2022). | A better life or a better shared world. Knowledge serves this aim. | Inference: the aims overlap (both pursue warranted belief and practical change), but the ordering differs. A scientist can succeed by learning that an idea is false; a person usually counts that as a step, not a success. |
| **Success criteria** | Public: reproducible, criticizable, judged by peers under shared standards (Longino). | First-person authority over one's own good, with public criteria only for some claims ("this program exists", "this treatment helps on average"). | The capability approach resists paternalism about what a person should value (SEP, "The Capability Approach", sections 3.2 and 3.3). |
| **Beneficiary** | Usually others, or no one in particular. | Usually oneself and people one cares about; for shared dreams, a group. | Sen's distinction between well-being freedom and agency freedom covers people pursuing ends that do not improve their own well-being (SEP, "The Capability Approach", section 2.5). |
| **Reversibility and repetition** | Experiments are designed to be repeatable and controlled; failure is cheap relative to the field. | One life, path dependent, often irreversible. You can't run your twenties twice. | Paul's transformative choices are the extreme case: you can't sample the experience before choosing it (SEP, "Transformative Experience", section 4). Inference: this favors small, reversible probes in agency even more than in science. |
| **Inquirer and object** | Mostly separate: the epistemic thing is in the lab. | The person is part of the system being changed. Their values, skills, and perceptions shift as they act. | Callard (2018) treats aspiration as the rational agency of becoming someone who has values one does not yet fully have. |
| **Value-ladenness** | Present but contested. Douglas (2009) argues that inductive risk means scientists must weigh the consequences of error. | Pervasive and legitimate. Choosing the end is the point. | Inference: in science, values mostly decide how much evidence is enough; in agency, values also decide what counts as better. |
| **Whether the goal is fixed** | Often not: exploratory experimentation runs without a theory to test (Steinle 1997). Often yes, inside normal science. | Often not: people find what they want by trying things (March 1971, unverified detail; Sarasvathy 2001). Often yes, for concrete goals. | Both cases have fixed-goal and open-goal modes. This is a shared structure, not a difference. |
| **Division of labor and instruments** | Large, specialized, with shared instruments and journals. | Small, personal, with borrowed tools. | Kitcher's division of cognitive labor has a parallel in It's "A change we'd make together" status: shared dreams need some people to try the unlikely routes. |
| **Skill at inquiry** | Trained. | Untrained; laypeople often do not keep theory and evidence apart. | Deanna Kuhn (1989) reports that children and many adults fail to separate their theories from the evidence that should test them, though later work finds this improves with practice. Inference: any feature that asks people to "test" fixes needs light, built-in structure (a start date, a thing to notice), not a demand for rigor. |

The founder's warning holds: science is not just another case of moving from an undesirable state to a preferred one. But the reverse warning also holds: personal agency is not just amateur science. People have first-person authority over their ends, can't repeat their lives, and change as they act. A shared structure has to leave room for both.

## 5. Tradition by tradition

Each tradition is assessed for what it offers, its limits, and whether it would be a better foundation than the sketch. "Better foundation" means: explains more of both cases, with fewer special additions, while staying usable for a content model.

### Pragmatism (Peirce and Dewey)

- **Offers**: inquiry as moving from an unsettled to a settled situation; problems instituted inside inquiry; abduction as the source of new ideas; ends-in-view revised with means; belief as habit (Peirce 1877, section V), so a settled result becomes a resource for the next inquiry. Joas (1996) builds a theory of "creative action" from Dewey and Mead and criticizes the means-ends model of action shared by rational and normative action theories.
- **Limits**: schematic; Dewey's five phases are not a procedure and real reasoning is less linear (SEP, "John Dewey", section 4.3). Little formal apparatus. Peirce's "settlement of opinion" (1877, section IV) can sound like comfort rather than truth.
- **Verdict**: the best **frame** for the whole. Dewey's theory of inquiry already covers both science and practical life, and was meant to. Pragmatism does not replace the sketch's mechanics; it places them inside a larger loop.

### Philosophy of scientific practice

- **Hacking**: intervention and phenomenon creation, independent of theory. Strong for "acting is a way of knowing".
- **Chang**: epistemic iteration and measurement invention; active knowledge as ability (Chang 2004; 2022). Strong for "the yardstick is built in the activity".
- **Rheinberger**: experimental systems as arrangements that produce surprises; epistemic things becoming technical objects (1997). Strong for "settled results become tools".
- **Steinle**: exploratory experimentation when no conceptual framework is available (1997). Strong for "inquiry without a target".
- **Kuhn**: puzzles inside a frame, anomalies, and frame change; problems and standards shift with the frame. Strong for the two-mode picture, contested on incommensurability.
- **Lakatos** (1970, unverified): research programmes with a protected core and a revisable belt, judged by whether they predict new facts. Offers a model of which beliefs a person might protect (identity, core values) while revising the rest.
- **Laudan**: problem solving as the unit of progress (1977); reticulated aims (1984). Useful bridge to the sketch, since It already thinks in problems (pains).
- **Nersessian**: model-based reasoning and analogy in concept creation (2008).
- **Longino and Kitcher**: social conditions for objectivity; division of labor.
- **Star and Griesemer**: boundary objects (1989).
- **Pickering**: the "mangle" of practice, a back-and-forth of material resistance and human accommodation (Pickering 1995, through secondary sources). Strong as description, weak as a model you could compute with.
- **Limits**: almost all of this is historical case study and ethnography. That work is good at showing that something happens, weaker at showing how often or under what conditions.
- **Verdict**: not a foundation by itself, but the main source of the operations the sketch is missing (exploration, measurement invention, frame change, settlement into tools, social warrant).

### Affordances (Gibson, Chemero, Rietveld and Kiverstein)

- **Offers**: possibilities for action as relations between abilities and environment (Chemero, as cited in the sketch). Rietveld and Kiverstein (2014) extend affordances to the whole "landscape" of a sociocultural form of life, and define skilled intentionality as selective openness to that landscape (through later papers that cite it).
- **Limits**: little to say about ends, about which affordances matter, or about how the landscape changes. Though Rietveld's later work treats the landscape as shaped by practice, it is a theory of perception and responsiveness, not of inquiry.
- **Verdict**: keep it, as the sketch does, for applicability. Add that the landscape changes when the person changes (new skills open new affordances) and when people build things (a new group creates affordances that did not exist). Inference: this is the affordance version of Kauffman's adjacent possible.

### Capabilities (Sen, Nussbaum, Robeyns)

- **Offers**: functionings versus capabilities; conversion factors (personal, social, environmental); agency freedom versus well-being freedom (SEP, "The Capability Approach", sections 2.1, 2.3, and 2.5). The note that people in deprivation may lower their expectations as a coping mechanism (section 1.1) matters for It: a stated dream can be shaped by what has seemed possible.
- **Limits**: an evaluative framework for comparing lives and policies, not a theory of how people discover what they value or how they act. Sen leaves the selection of capabilities to public reasoning without specifying the process (section 3.3).
- **Verdict**: keep it for the content of dreams (freedoms, not only states) and for conversion factors. Pair it with Appadurai's "capacity to aspire" (2004), which treats aspiration as a navigational capacity, built through experience of trying and seeing results, and unequally distributed. That pairing turns capability from a static space of options into something a person can expand by inquiry.

### Causal inference (Pearl, Woodward, Spirtes, Glymour, and Scheines)

- **Offers**: the difference between seeing, doing, and imagining; interventions defined by their causal features; algorithmic recourse's warning that a desired counterfactual is not an action (Karimi and colleagues, as cited in the sketch).
- **Limits**: assumes the variables are given. Causal discovery (Spirtes, Glymour, and Scheines 1993, unverified detail) can learn structure among given variables, but no causal method invents the variables. That is exactly what frame change and measurement invention do.
- **Verdict**: keep it for transition claims, as the sketch does. Causal inference is a component, not the foundation.

### Planning (STRIPS, hierarchical task networks, partially observable planning, Simon, Schön)

- **Offers**: state, goal, operators, preconditions, and effects (Fikes and Nilsson 1971, unverified detail); decomposition (hierarchical task networks, Erol, Hendler, and Nau 1994, unverified); acting under hidden state (POMDPs, Kaelbling, Littman, and Cassandra 1998). POMDPs matter here: in a POMDP an agent can choose actions **only for the information they yield**, so epistemic moves are first-class. Inference: if It wants a planning formalism at all, the partially observable one is the closer fit, because "find out more" is a legitimate action in it.
- **Limits**: all of these take the goal and the state description as given. Simon (1973) himself says most real problems are ill structured, and that well-structuredness is often imposed for a while to make progress. Suchman (1987) shows that plans work as resources for situated action, not as programs that determine it.
- **Verdict**: correct as a mode, wrong as the foundation. The sketch already avoids deterministic planning; it should also avoid fixed-goal planning as the default.

### Experimental design (Fisher, sequential and adaptive design, Bayesian optimal design, active learning)

- **Offers**: choose the next observation by its expected information gain about what you care about (Rainforth, Foster, Ivanova, and Bickford Smith 2024 review; Chaloner and Verdinelli 1995 and Lindley 1956, unverified details). Active learning chooses which labels to request (Settles 2009, unverified).
- **Link to the sketch**: the sketch's value-of-information rule for personal facts is Bayesian experimental design applied to questions. Hintikka's interrogative model (1999) makes the same move in logic: inquiry as a sequence of questions put to nature or to an informant, where strategy is what matters.
- **Limits**: assumes a fixed hypothesis space and a fixed utility. Experimental design does not say where new hypotheses or new utilities come from.
- **Verdict**: a component, and the right tool for deciding what to ask and which probe to suggest, inside a frame.

### Exploration and open-endedness

- **Offers**: Lehman and Stanley (2011) show in maze and walking tasks that searching for behavioral novelty alone, ignoring the objective, can outperform searching for the objective, because objectives can be deceptive. Their book (Stanley and Lehman 2015) generalizes this to "stepping stones" that don't resemble the goal. Human explore-exploit research finds that people use both directed exploration (a bias toward information) and random exploration (more noise), and explore more when they have more choices ahead (Wilson et al. 2014). Gopnik (2020) argues that childhood exists partly to allow broad exploration before exploitation. Oudeyer and colleagues (2007) show curiosity driven by learning progress.
- **Limits**: novelty search results are on computational benchmarks; they show that objectives **can** deceive, not how often they do in human life. Critics point out that people don't have unlimited time to try stepping stones. Explore-exploit lab tasks are tiny and well defined.
- **Verdict**: necessary to explain discovery, and a strong reason not to make "closer to B" the only measure of a good fix.

### Effectuation

- **Offers**: Sarasvathy (2001) contrasts causation (take an effect as given and choose means) with effectuation (take means as given and choose among effects they could create). Her think-aloud study of 27 expert entrepreneurs is reported to show effectual reasoning dominating early venture creation (secondary report). Later small studies give partial support, and the two logics coexist.
- **Limits**: small samples, mostly entrepreneurs.
- **Verdict**: a clean statement of a mode the sketch lacks: start from "who I am, what I know, whom I know" and see what futures those make possible. Inference: this is a good fit for It's Help page and for collective dreams, where the group's means shape which future is reachable.

### Aspiration and transformative experience (Callard, Paul, Ullmann-Margalit)

- **Offers**: Paul (2014) argues that experiences that are both epistemically and personally transformative undermine standard decision theory, because you can't know their value in advance and your preferences may change. Responses include choosing for the sake of discovering who you will become (Paul's "revelation"), Callard's proleptic reasons, and Ullmann-Margalit's suggestion to minimize discontinuity and keep an exit (SEP, "Transformative Experience", by Rebecca Chan, section 4). Callard (2018) argues that aspirants act on "proleptic reasons", reasons they know are defective versions of reasons they expect to grasp later, and that people resolve conflicts between old and new values by working to see the world in a new way, not by deciding.
- **Limits**: philosophical argument; no direct empirical tests. Critics argue Paul's challenge is weaker for small cases than for large life choices (Bykvist 2019, secondary).
- **Verdict**: required to explain a whole class of dreams (becoming a parent, a writer, an organizer) where B is only partly graspable at the start. The sketch can't represent these except as fixed B.

### Design and wicked problems (Rittel and Webber, Schön, Dorst)

- **Offers**: no definitive formulation; problem setting; frame creation.
- **Limits**: mostly descriptive and case based.
- **Verdict**: the closest existing account of It's societal pains. "Rent eats everything" is a wicked problem in the 1973 sense. The sketch's recursive gap filling is useful, but for a wicked problem the gaps are often in the formulation, not only in the route.

### Shared agency, commons, and practice theory

- **Offers**: Bratman's meshing subplans, Gilbert's joint commitment, Ostrom's design principles, Bandura's collective efficacy, and practice theory's view that practices are made of materials, competences, and meanings and change when links among them form or break (Shove, Pantzar, and Watson 2012).
- **Limits**: shared agency theory is mostly about small groups acting together; Ostrom's principles come from common-pool resources; practice theory is better at description than prescription.
- **Verdict**: keep the actor concept from the sketch and extend it. Practice theory adds a useful point: many fixes work by changing a practice (how a household sleeps, how a team messages after hours), not by moving a person from state A to state B.

### Hope, goal pursuit, and implementation intentions

- **Offers**: Snyder's hope theory (2002) splits hope into pathways thinking and agency thinking; the evidence is mostly correlational. Gollwitzer's implementation intentions ("if situation X, then I will do Y") have the strongest evidence of anything in this note (meta-analytic d = 0.65; Gollwitzer and Sheeran 2006, via the fix-kind research). Mental contrasting with implementation intentions has small to medium effects (Wang, Wang, and Gai 2021).
- **Limits**: these all assume a goal the person already holds.
- **Verdict**: they are the best-supported part of the planning mode. They say nothing about the other modes, which is consistent with the structure proposed below.

### Is there a single better foundation?

No single tradition replaces the sketch. Pragmatist inquiry, read through the philosophy of scientific practice, is the best **frame**, because it was built to cover science and everyday problem solving at once and because it puts the revision of problems and ends at the center. Affordances, capabilities, causal inference, planning, and experimental design are the right **components** inside it. Exploration research, effectuation, aspiration, and transformative experience describe the **modes** the sketch leaves out.

Active inference (the free energy framework associated with Friston) is a candidate formal unification in which actions are chosen for both pragmatic and epistemic value. Active inference is mentioned here for completeness only; it was not checked for this note, and its empirical status as a theory of human planning is contested (unverified).

## 6. Non-goal-directed modes and their human counterparts

The founder asked specifically about cases where science runs without a predefined goal. Each has a counterpart in human agency, and each needs something the sketch does not have.

| Scientific mode | What happens | Human counterpart | What the model would need |
| --- | --- | --- | --- |
| **Exploratory experimentation** (Steinle 1997; Burian 1997; Sargent 1995) | Vary conditions systematically to find stable regularities when no framework exists. | Trying things to find out what helps or what one enjoys: a new routine, a class, a group, sleeping apart for two weeks. March (1971) argued that wise choice includes finding new goals, not only pursuing given ones (secondary summary). | Fixes whose purpose is to learn, judged by what they reveal, not only by movement toward a dream. |
| **Discovery of new phenomena** (Kuhn; Dunbar; Kulkarni and Simon) | A surprise is delimited and its mechanism sought. | Noticing that the real problem was different: the trouble with sleep turns out to be the work chat, or loneliness turns out to be about being the one who always initiates. | A way to record that a pain was reframed, and to move from one framing to another. |
| **Measurement invention** (Chang 2004) | Build a standard without a prior standard, improving it iteratively. | Inventing a way to tell whether things are getting better: a diary, a count, a question to ask oneself each week. | A "how you'd notice" element for a dream or a path, which can be revised. |
| **Instrument and system building** (Rheinberger 1997; Hacking 1983) | Build an arrangement that produces surprises; stabilized results become tools. | Building a setup that makes new things possible: a weekly dinner, a tenant association, a shared calendar. Once it works it becomes a resource for other goals. | Outcomes that are capacities or settings, not end states, and that can be inputs to other paths (the sketch's Petri net picture already allows this). |
| **Conceptual change** (Kuhn; Carey 2009; Nersessian 2008) | The categories in which problems are stated change. | Reframing: "I'm lazy" becomes "I'm exhausted from shift work"; "my landlord is greedy" becomes "rent is set by a market our town could change". | Alternative framings of the same pain, offered as possibilities, not diagnoses. |
| **Aim change** (Laudan 1984) | What the field counts as success changes. | Preference formation and transformative choice: what one wants changes because of what one does (Paul 2014; Callard 2018; Lichtenstein and Slovic 2006). | Dreams treated as ends-in-view that a person can revise, with the earlier pick kept as history on the device. |
| **Novelty search** (Lehman and Stanley 2011) | Reward being different, not being closer. | Building stepping stones that don't look like the goal: learning a skill, meeting people, joining something, without knowing what it will lead to. Appadurai's capacity to aspire grows through exactly this kind of experience. | A mode where It suggests broadening moves when no route to a dream is known, instead of only exposing the gap. |

**Inference:** the human counterparts are not rare edge cases. Many of It's pains (loneliness, unemployment, burnout, not knowing what to do with one's life) are cases where the person can't yet name a reachable B, and where the most useful first move is a probe, a reframing, or a stepping stone.

## 7. A proposed general structure (hypothesis)

This section is this note's synthesis. The structure is labelled a hypothesis throughout and has not been tested.

### 7.1 The loop

**Situated inquiry with revisable ends.** An agent (a person or a group) in a situation goes through a loop:

1. **Situation.** The agent in an environment, with practices, skills, relationships, and resources. What is possible is a relation between the agent and the environment (affordances, conversion factors).
2. **Trouble or pull.** Something is felt as wrong (doubt, pain, anomaly) or as attractive (curiosity, aspiration, a surprising result). The situation is indeterminate: the problem is not yet stated.
3. **Frame.** The agent takes the trouble as a particular problem, in particular terms, with a particular sense of what better would mean and how one would notice it. Frames can be borrowed (an exemplar, someone else's story) or created.
4. **Possibilities.** Within the frame, the agent generates ends-in-view, hypotheses, and options by abduction, analogy, imagination, and other people's examples. These are adjacent possibles: one step from what is actual.
5. **Moves.** The agent acts. Moves are of three kinds:
   - **pragmatic** moves change the world toward an end in view;
   - **epistemic** moves find something out (probe, try, ask, measure);
   - **generative** moves build something new (a tool, a measure, a group, a skill) that changes what is possible next.
6. **Back-talk.** The world answers: results, surprises, resistance, other people's responses.
7. **Revision at some level.** The agent revises one or more of:
   - the **path** (try a different fix; single-loop learning);
   - the **means** they think are available (new affordances, new collaborators);
   - the **end** (the dream is revised, narrowed, or replaced; Dewey's reciprocal determination);
   - the **frame** (the problem is redescribed; double-loop learning, conceptual change);
   - the **measure** (a better way to tell whether things improve; epistemic iteration);
   - the **agent** (new values or capacities; aspiration, transformative experience).
8. **Settlement.** Some results stabilize: a habit, a routine, a group, a warranted belief, a working tool. Settled results become part of the situation for the next inquiry (Peirce's belief as habit; Rheinberger's technical objects).
9. **Coordination and warrant.** When others are involved, the loop runs across people. Their subplans must mesh, they share boundary objects rather than identical frames, and some claims need criticism from others to count as warranted.

### 7.2 Modes as settings of the loop

The modes in this table are not separate theories. They are what the same loop looks like when some levels are held fixed.

| Mode | Held fixed | Open | How moves are chosen | Science example | Agency example |
| --- | --- | --- | --- | --- | --- |
| **Planning** (the sketch) | Frame, end, measure | Path, means | Expected progress toward the end | Normal science puzzle solving | Implementation intentions for a held goal |
| **Probing** | Frame, end | Path, means, which hypothesis is true | Expected information about which route works | Bayesian adaptive design | Trying a fix for two weeks to see if it helps |
| **Exploring** | Little | End, often frame | Novelty, learning progress, means at hand | Exploratory experimentation | Effectuation; trying things to find what one wants |
| **Reframing** | End (sometimes) | Frame, measure | Persistent back-talk that the frame can't absorb | Anomaly to crisis to new concepts | "The problem isn't me, it's the schedule" |
| **Aspiring** | A partial grasp of the end | Agent, end, measure | Proleptic reasons; practices that change the agent | A new field's founders | Becoming a parent, an organizer, a writer |
| **Coordinating** | Varies | Who acts, who agrees | Meshing subplans, boundary objects, critical uptake | Division of cognitive labor | Starting a tenant association |

### 7.3 How it explains both cases

- **Science without a goal.** Exploratory experimentation, phenomenon discovery, and measurement invention are moves in the exploring and probing modes, with revision at the measure and frame levels. They are not cases of moving from an undesirable state to a preferred one. The trouble is often a pull (an interesting effect), and the outcome is a new frame or a new instrument.
- **Science with a goal.** Normal science is the planning mode inside a stable frame, with anomalies feeding back into reframing when they pile up.
- **People with a goal.** The best-supported findings in goal pursuit (implementation intentions, mental contrasting) are planning-mode techniques. Their effect sizes are what you'd expect from a tool that works when the end is already right.
- **People without a clear goal.** Possible selves, aspiration, the capacity to aspire, effectuation, and transformative choice are the exploring and aspiring modes. The Oettingen finding (fantasy without a route lowers effort) is consistent: a possibility that never connects to a move stays a fantasy.
- **Shared change.** Ostrom's communities, Star and Griesemer's museum, and Longino's critical communities are the coordinating mode, where the unit of inquiry is a group and warrant is social.

### 7.4 Evidence for the structure, and against it

- **For**: each element has independent support in at least one literature (sections 3 and 5). The multi-level revision idea appears independently in pragmatism (Dewey), organizational learning (Argyris and Schön), philosophy of science (Laudan; Kuhn), and the psychology of preference (Lichtenstein and Slovic). That independent convergence is the strongest argument for it.
- **Against**: the loop is general enough to describe almost anything, which is a weakness. The loop has no empirical test as a whole. The levels may not be separable in practice: Kirsh and Maglio's epistemic and pragmatic actions overlap, and critics say the same of Argyris and Schön's loops. A simpler alternative, "planning plus learning about transitions", may capture most of what It needs for most pains.
- **Inference**: the structure earns its place only if distinguishing modes and levels changes what It shows people. Section 8 sets out how to check that.

### 7.5 How it relates to the sketch

The sketch's six concepts survive, with three changes in status:

- **State** becomes **situation** plus **frame**: the facts plus how the trouble is taken. Several frames can share one pain.
- **Desire** becomes an **end-in-view**: still a dream, but explicitly revisable, possibly only partly grasped, and possibly a capability.
- **Transition claim** gains two siblings: **information claims** (this move will tell you something about which route works) and **capacity claims** (this move builds something that opens new routes).

And it adds two things:

- a **measure**: how the person or group would notice that things are better, which can be revised;
- **revision events**: the record that a path, end, frame, or measure changed, which is the main data of learning. Before signup this stays on the device.

## 8. Implications for It's possibility model

These are hypotheses to test, not mandates. Each comes with what would count against it. All of them are compatible with the current Pain → Dream → Fix interface; none needs a new screen to start.

**Measurement limits.** The measurement invariant in `AGENTS.md` means It does not record picks or selected fixes before signup. Tests of these hypotheses therefore have to use the possibility generator offline, founder-run interviews with people who agree to take part, or signed-up users' explicit, consented contributions. None of them should add new pre-signup measurement.

### H1. Some pains should offer more than one framing

- **Hypothesis**: for a meaningful share of pains, offering two or three framings ("Is this about falling asleep, waking up, or the hours you have to keep?") before dreams produces dreams people recognize more readily than a single flat list.
- **Connection**: the sketch's three-pain probe already contrasts situations (night shifts, infant care, a snoring partner). Inference: those contrasts are frames as much as facts.
- **Test**: in the generator, produce cards with and without an explicit framing step for the sleep, rent, and loneliness pains, and have the founder and a few interviewees judge which dreams feel like "my problem".
- **Would count against it**: interviewees consistently ignore framings or find them presumptuous, or framings mostly duplicate what the dream list already separates.

### H2. Some fixes are probes and should be written as probes

- **Hypothesis**: fixes whose main value is information (try for two weeks, keep a diary, ask one person) are better presented with what to notice than with a promised outcome, and people find them easier to start.
- **Connection**: the copy guide's first steps already include measurement moves ("Jot down when you went to bed..."). The fix-kind research's Task and Schedule kinds can carry a "what you'll find out" field without a new kind. A separate "Try" kind is a possibility, but should be tested before adding, as the fix-kind research already advises for other candidates.
- **Test**: rewrite a handful of existing fixes as probes and compare founder and interviewee judgments of clarity and willingness to try. Check against the copy guide's honesty rules: a probe must not promise a result.
- **Would count against it**: probe framings read as hedging, or people say they want a fix that promises something.

### H3. Dreams are ends-in-view and should be revisable

- **Hypothesis**: people who try fixes sometimes revise or replace their dream, and supporting that (keeping the old pick as history, offering nearby dreams) is more useful than treating the first pick as fixed.
- **Connection**: the features list keeps picks per pain → dream path with stable way IDs so order can be added later; the same structure can hold a revision history. Before signup this history lives only on the device.
- **Test**: after signup, and only with explicit consent, ask a small number of people whether their dream changed after trying something, in their own words.
- **Would count against it**: dreams are stable for nearly everyone over the time It is used, so revision support would be unused complexity.

### H4. A path can contain learning steps and stepping stones, not only transitions

- **Hypothesis**: when no credible route to a dream is known, the most useful path starts with a probe or a capacity-building step (learn a right, meet the neighbors, start a group) whose link to the dream is indirect.
- **Connection**: this extends the sketch's gap filling (Spivak) and the fix-kind research's Path fields (`goal`, `steps`, `preconditionFor`). A step could also carry `reveals` (what it would tell you) or `opens` (what it makes possible).
- **Test**: for the rent and loneliness pains, generate paths with and without stepping-stone steps and judge whether the stepping-stone versions are more believable and more doable.
- **Would count against it**: stepping-stone steps read as vague filler (the copy guide's "short but empty") more often than as real first moves.

### H5. A dream needs a way to notice progress

- **Hypothesis**: a short "how you'd notice" line for some dreams (sleeping through most nights in a week; one person reaching out first this month) makes dreams more concrete without staging scenes, and helps people tell whether a fix is working.
- **Connection**: the copy guide already wants dream lines concrete enough to picture. Chang's epistemic iteration suggests the measure should be revisable.
- **Test**: draft measures for the pilot dreams and see whether they pass the copy guide's swap and why tests better than the dream lines alone.
- **Would count against it**: measures make dreams feel clinical or like targets someone could fail, which would go against the voice in the copy guide.

### H6. Shared dreams work as boundary objects

- **Hypothesis**: a societal dream that is loose enough for people in different situations to read in their own way, and firm enough to keep its identity, gathers more of them than a precise policy target.
- **Connection**: published content never reveals who contributed it (`AGENTS.md`), which fits boundary objects: the object is shared, the readings stay private.
- **Test**: compare founder judgments of tightly specified and boundary-object versions of a few societal dreams, then compare how many people pick each version, using only post-signup totals.
- **Would count against it**: loose dreams are read as slogans (the copy guide rules these out) or invite conflicting fixes that can't sit on one card.

### H7. Asking is an experiment

- **Hypothesis**: the sketch's value-of-information rule for personal facts can be made concrete with Bayesian experimental design: ask a question only when the expected change in which dreams or fixes It shows is large enough to justify the burden. The same rule chooses which probe to suggest.
- **Connection**: this keeps the sketch's preference for not collecting a situation profile and fits the privacy invariants, because the computation can run on the device before signup.
- **Would count against it**: in the three-pain probe, almost no question changes the output enough, which would mean It needs no personal questions at all for now. The sketch already names that as a good result.

### What not to change

The research supports keeping several of the sketch's choices as they are: no separate "circumstances" table; applicability as a relation, not a property; transition claims with evidence and confidence; actors for collective fixes; and the honest gap in a path. Nothing here argues for a general planning engine, a causal model of a person's life, or any new collection of personal data.

## 9. Open questions and thin evidence

- **No direct comparison.** No study found here compares how laypeople and scientists structure open-ended inquiry in their own lives. The nearest are Klahr and Dunbar's laboratory tasks, Deanna Kuhn's work on theory and evidence, and Gopnik's developmental studies, none of which examines life goals.
- **Exploration in adult life.** Evidence that exploring without a goal leads to better life outcomes for adults is mostly anecdotal or from entrepreneurs (effectuation). Novelty search results are computational.
- **Reframing as a skill.** Strong descriptive evidence in design; little evidence that offering reframes to laypeople helps them, and some risk that it feels like being told one's problem is something else.
- **Transformative choice.** Purely philosophical. Nobody knows how often It's users face choices where their values are expected to change, or how they would want It to respond.
- **Measurement invention by laypeople.** Self-monitoring has support as a behavior change technique, but people inventing and revising their own measures has not been studied as such, as far as this research found.
- **Levels of revision.** Whether path, means, end, frame, measure, and agent revisions can be told apart reliably in people's own accounts is untested. If two raters can't agree on them, the structure is too fine for It.
- **Dunbar's numbers.** The commonly repeated "more than half of results were unexpected" figure was seen only in secondary sources.
- **Spivak's plausible fiction.** This note relies on the sketch's account of it and did not re-read the sources.
- **The founder's own corpus.** The founder's research corpus may hold sources that change these conclusions; it was not searched for this note.

## 10. Sources

Accessed 2026-10-21 unless noted. "Opened" means the page, entry, or abstract was read. "Search result" means only the search snippet or listing was seen. "(unverified)" means cited from memory or from secondary pages only.

### Repository

- `AGENTS.md`; `docs/style/copy-style-guide.md`; `docs/spec/features.md`; `docs/research/thing-type-relation/research.md`; `docs/research/fix-kind-ideation/research.md` (local read).
- The current sketch: "From Pain to Possibility: A Research Synthesis for How It Can Help Someone Get from A to B" (session scratchpad file `pain-to-possibility.md`, local read). Its citations to Spivak, Chemero, Stoffregen, Robeyns, Nussbaum, Karimi, Schölkopf and Valera, Ustun, Spangher and Liu, KAOS, i*, Adomavicius, and Lim and Dey were not re-checked here.

### Stanford Encyclopedia of Philosophy

- Anderson, E. "Dewey's Moral Philosophy." SEP, revised 2023-01-28. https://plato.stanford.edu/entries/dewey-moral/ (opened)
- "John Dewey." SEP, section 4.3. https://plato.stanford.edu/entries/dewey/ (opened)
- Douven, I. "Abduction." SEP, revised 2025-06-18, and supplement "Peirce on Abduction." https://plato.stanford.edu/entries/abduction/ ; https://plato.stanford.edu/entries/abduction/peirce.html (opened)
- "Charles Sanders Peirce." SEP, section 4. https://plato.stanford.edu/entries/peirce/ (opened)
- "Scientific Discovery." SEP, first published 2014, revised 2022-10-31 (author attribution to Jutta Schickore unverified). https://plato.stanford.edu/entries/scientific-discovery/ (opened)
- Bird, A. "Thomas Kuhn." SEP, revised 2025. https://plato.stanford.edu/entries/thomas-kuhn/ (opened)
- "Causation and Manipulability." SEP, revised 2023-05-06. https://plato.stanford.edu/entries/causation-mani/ (opened)
- "The Social Dimensions of Scientific Knowledge." SEP, revised 2025-01-24. https://plato.stanford.edu/entries/scientific-knowledge-social/ (opened)
- Roth, A. S. "Shared Agency." SEP, revised 2017-05-01. https://plato.stanford.edu/entries/shared-agency/ (opened)
- "The Capability Approach." SEP, revised 2025-04-17. https://plato.stanford.edu/entries/capability-approach/ (opened)
- Chan, R. "Transformative Experience." SEP, first published 2023-06-01. https://plato.stanford.edu/entries/transformative-experience/ (opened)

### Pragmatism and action theory

- Peirce, C. S. (1877). "The Fixation of Belief." *Popular Science Monthly* 12. https://www.peirce.org/writings/p107.html (opened)
- Peirce, C. S. *Collected Papers*, CP 5.172, 5.189 (quoted through SEP supplement).
- Dewey, J. (1938). *Logic: The Theory of Inquiry*. Henry Holt (through SEP).
- Dewey, J. (1939). *Theory of Valuation*. University of Chicago Press (through SEP).
- Joas, H. (1996). *The Creativity of Action*. University of Chicago Press. Search results, publisher and review pages.
- March, J. G. (1971). "The Technology of Foolishness." *Civiløkonomen* 18(4). Secondary summaries only (unverified).
- Argyris, C., and Schön, D. A. (1978). *Organizational Learning: A Theory of Action Perspective*. Addison-Wesley. https://infed.org/dir/chris-argyris-theories-of-action-double-loop-learning-and-organizational-learning/ (secondary, search result)
- Suchman, L. (1987). *Plans and Situated Actions*. Cambridge University Press. Xerox PARC report ISL-6 (search result): https://kuiper.mirrorservice.org/sites/www.bitsavers.org/pdf/xerox/parc/techReports/ISL-6_Plans_and_Situated_Actions.pdf

### Philosophy of scientific practice

- Hacking, I. (1983). *Representing and Intervening*. Cambridge University Press. https://en.wikipedia.org/wiki/Entity_realism ; https://physicstoday.aip.org/features/are-there-really-electrons-experiment-and-reality (secondary; page 23 or 24 for "spray them")
- Chang, H. (2004). *Inventing Temperature: Measurement and Scientific Progress*. Oxford University Press, chapter 5. https://academic.oup.com/book/5530/chapter/148476793 (abstract opened via search); https://rigor.hpsc.indiana.edu/public_lecture/ (search result)
- Chang, H. (2022). *Realism for Realistic People*. Cambridge University Press. https://www.cambridge.org/core/product/identifier/9781108635738/type/book (search result)
- Rheinberger, H.-J. (1997). *Toward a History of Epistemic Things: Synthesizing Proteins in the Test Tube*. Stanford University Press. https://en.wikipedia.org/wiki/Experimental_system (secondary); exact quotations and pages unverified.
- Steinle, F. (1997). "Entering New Fields: Exploratory Uses of Experimentation." *Philosophy of Science* 64 (Proceedings), S65–S74 (page numbers unverified). https://cambridge.org/core/journals/philosophy-of-science/article/entering-new-fields-exploratory-uses-of-experimentation/A1BF59B7198F4C380D3B5F1FAEFF9241 (abstract, search result)
- Burian, R. (1997) and Sargent, R.-M. (1995) on exploratory experimentation, as cited in Beauchemin and Staley: https://philsci-archive.pitt.edu/22567/1/BeaucheminStaley_Exploratory.pdf (search result)
- Kuhn, T. S. (1962/1970). *The Structure of Scientific Revolutions*. University of Chicago Press (through SEP).
- Lakatos, I. (1970). "Falsification and the Methodology of Scientific Research Programmes." In Lakatos and Musgrave (eds.), *Criticism and the Growth of Knowledge*. Cambridge University Press (unverified).
- Laudan, L. (1977). *Progress and Its Problems*. University of California Press. https://www.ucpress.edu/flyer/books/progress-and-its-problems/paper (search result); review: https://apcz.umk.pl/THS/article/download/ths.1991.006/13493/36124 (search result)
- Laudan, L. (1984). *Science and Values*. University of California Press. https://www.uoguelph.ca/arts/sites/uoguelph.ca.arts/files/public/FreedmanNormativeNaturalism.pdf (secondary, search result)
- Nersessian, N. J. (2008). *Creating Scientific Concepts*. MIT Press. Publisher and review listings (search result).
- Longino, H. (1990). *Science as Social Knowledge*. Princeton University Press; (2002) *The Fate of Knowledge* (through SEP).
- Kitcher, P. (1993). *The Advancement of Science*. Oxford University Press (through SEP); (2001) *Science, Truth, and Democracy* (unverified).
- Douglas, H. (2009). *Science, Policy, and the Value-Free Ideal*. University of Pittsburgh Press. https://upittpress.org/books/9780822960263/ (search result)
- Star, S. L., and Griesemer, J. R. (1989). "Institutional Ecology, 'Translations' and Boundary Objects." *Social Studies of Science* 19(3), 387–420. doi:10.1177/030631289019003001. https://courses.dubberly.com/design_theory/09._Star_Griesemer_1989.pdf (search result)
- Pickering, A. (1995). *The Mangle of Practice: Time, Agency, and Science*. University of Chicago Press. Pickering (1993), *American Journal of Sociology* 99(3), 559–589 (search result).
- Hintikka, J. (1999). *Inquiry as Inquiry: A Logic of Scientific Discovery*. Kluwer/Springer. https://link.springer.com/book/10.1007/978-94-015-9313-7 (search result)

### Cognitive studies of scientists and of reasoning

- Klahr, D., and Dunbar, K. (1988). "Dual Space Search During Scientific Reasoning." *Cognitive Science* 12(1), 1–48. https://kilthub.cmu.edu/articles/journal_contribution/Dual_space_search_during_scientific_reasoning/6614507 (abstract, search result)
- Kulkarni, D., and Simon, H. A. (1988). "The Processes of Scientific Discovery: The Strategy of Experimentation." *Cognitive Science* 12(2), 139–175. https://kilthub.cmu.edu/articles/journal_contribution/The_processes_of_scientific_discovery_the_strategy_of_experimentation/6618701 (search result)
- Dunbar, K. (1995). "How Scientists Really Reason." In Sternberg and Davidson (eds.), *The Nature of Insight*. MIT Press (unverified); Dunbar, K., and Fugelsang, J. (2005), on unexpected findings (unverified). Secondary: https://en.wikipedia.org/wiki/Role_of_chance_in_scientific_discoveries
- Kuhn, D. (1989). "Children and Adults as Intuitive Scientists." *Psychological Review* 96(4), 674–689 (secondary, search result).
- Kirsh, D., and Maglio, P. (1994). "On Distinguishing Epistemic from Pragmatic Action." *Cognitive Science* 18, 513–549. https://philarchive.org/rec/KIRODE (search result)
- Carey, S. (2009). *The Origin of Concepts*. Oxford University Press. https://academic.oup.com/book/12686 (search result)
- Thagard, P. (1992). *Conceptual Revolutions*. Princeton University Press (unverified; listed as a related account not used above).

### Design, planning, and problems

- Simon, H. A. (1973). "The Structure of Ill Structured Problems." *Artificial Intelligence* 4, 181–201 (search result).
- Rittel, H. W. J., and Webber, M. M. (1973). "Dilemmas in a General Theory of Planning." *Policy Sciences* 4(2), 155–169. https://archive.epa.gov/reg3esd1/data/web/pdf/rittel%2Bwebber%2Bdilemmas%2Bgeneral_theory_of_planning.pdf (search result)
- Schön, D. A. (1983). *The Reflective Practitioner*. Basic Books (publisher listing and reviews, search result).
- Dorst, K. (2011). "The Core of 'Design Thinking' and Its Application." *Design Studies* 32(6), 521–532. https://opus.lib.uts.edu.au/handle/10453/18751 (search result)
- Fikes, R. E., and Nilsson, N. J. (1971). "STRIPS." *Artificial Intelligence* 2, 189–208 (unverified).
- Erol, K., Hendler, J., and Nau, D. (1994). Hierarchical task network planning (unverified).
- Kaelbling, L. P., Littman, M. L., and Cassandra, A. R. (1998). "Planning and Acting in Partially Observable Stochastic Domains." *Artificial Intelligence* 101, 99–134. https://cs.brown.edu/research/pubs/techreports/reports/CS-96-08.html (search result)
- Sarasvathy, S. D. (2001). "Causation and Effectuation." *Academy of Management Review* 26(2), 243–263. Secondary: https://effectuation.org/effectuation-background-research (search result)

### Causal inference and experimental design

- Woodward, J. (2003). *Making Things Happen*. Oxford University Press (through SEP).
- Pearl, J. (2019). "The Seven Tools of Causal Inference, with Reflections on Machine Learning." *Communications of the ACM* 62(3), 54–60 (search result); Pearl, J., and Mackenzie, D. (2018). *The Book of Why*. Basic Books (secondary).
- Spirtes, P., Glymour, C., and Scheines, R. (1993). *Causation, Prediction, and Search*. Springer (unverified).
- Rainforth, T., Foster, A., Ivanova, D. R., and Bickford Smith, F. (2024). "Modern Bayesian Experimental Design." *Statistical Science* 39(1), 100–114. https://projecteuclid.org/journals/statistical-science/volume-39/issue-1/Modern-Bayesian-Experimental-Design/10.1214/23-STS915.full (search result)
- Chaloner, K., and Verdinelli, I. (1995). "Bayesian Experimental Design: A Review." *Statistical Science* 10(3) (unverified). Lindley, D. V. (1956). On the measure of information provided by an experiment (unverified). Fisher, R. A. (1935). *The Design of Experiments* (unverified). Settles, B. (2009). Active learning literature survey (unverified).

### Exploration and open-endedness

- Lehman, J., and Stanley, K. O. (2011). "Abandoning Objectives: Evolution Through the Search for Novelty Alone." *Evolutionary Computation* 19(2), 189–223. doi:10.1162/EVCO_a_00025. https://www.cs.swarthmore.edu/~meeden/cs81/f17/papers/lehman_ecj11.pdf (search result)
- Stanley, K. O., and Lehman, J. (2015). *Why Greatness Cannot Be Planned: The Myth of the Objective*. Springer (publisher unverified; reviews seen).
- Wilson, R. C., Geana, A., White, J. M., Ludvig, E. A., and Cohen, J. D. (2014). "Humans Use Directed and Random Exploration to Solve the Explore–Exploit Dilemma." *Journal of Experimental Psychology: General* 143(6), 2074–2081. https://experts.arizona.edu/en/publications/humans-use-directed-and-random-exploration-to-solve-the-explore-e/ (search result)
- Gopnik, A. (2020). "Childhood as a Solution to Explore–Exploit Tensions." *Philosophical Transactions of the Royal Society B* 375, 20190502. https://pmc.ncbi.nlm.nih.gov/articles/PMC7293160/ (search result)
- Oudeyer, P.-Y., Kaplan, F., and Hafner, V. V. (2007). "Intrinsic Motivation Systems for Autonomous Mental Development." *IEEE Transactions on Evolutionary Computation* 11(2), 265–286 (search result).
- Kauffman, S. (2000). *Investigations*. Oxford University Press (reviews, search result).

### Affordances, capabilities, aspiration, and possibility

- Rietveld, E., and Kiverstein, J. (2014). "A Rich Landscape of Affordances." *Ecological Psychology* 26(4), 325–352 (through later papers; page numbers unverified). van Dijk, L., and Rietveld, E. (2017), *Frontiers in Psychology*: https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2016.01969/full (search result)
- Gibson, J. J. (1979). *The Ecological Approach to Visual Perception* (unverified).
- Sen, A. (1999). *Development as Freedom*; Nussbaum, M. (2011). *Creating Capabilities*; Robeyns, I. (2017). *Wellbeing, Freedom and Social Justice* (through SEP and the sketch).
- Appadurai, A. (2004). "The Capacity to Aspire: Culture and the Terms of Recognition." In Rao and Walton (eds.), *Culture and Public Action*. Stanford University Press (secondary sources, search result).
- Glăveanu, V. P. (2020). *The Possible: A Sociocultural Theory*. Oxford University Press. https://academic.oup.com/book/31846 (search result)
- Callard, A. (2018). *Aspiration: The Agency of Becoming*. Oxford University Press. https://academic.oup.com/book/4936 (search result)
- Paul, L. A. (2014). *Transformative Experience*. Oxford University Press (through SEP).
- Ullmann-Margalit, E. (2006). "Big Decisions: Opting, Converting, Drifting." *Royal Institute of Philosophy Supplement* 58 (through SEP; details unverified).
- Lichtenstein, S., and Slovic, P. (eds.) (2006). *The Construction of Preference*. Cambridge University Press. doi:10.1017/CBO9780511618031 (search result)
- Wilson, T. D., and Gilbert, D. T. (2005). "Affective Forecasting: Knowing What to Want." *Current Directions in Psychological Science* 14(3), 131–134 (search result).

### Goal pursuit, hope, and possible selves

- Markus, H., and Nurius, P. (1986). "Possible Selves." *American Psychologist* 41(9), 954–969. doi:10.1037/0003-066X.41.9.954 (search result)
- Oyserman, D., Bybee, D., Terry, K., and Hart-Johnson, T. (2004). "Possible Selves as Roadmaps." *Journal of Research in Personality* 38. https://dornsife.usc.edu/daphna-oyserman/wp-content/uploads/sites/232/2023/11/possible_selves_as_roadmaps.pdf (search result); Oyserman, Bybee, and Terry (2006), *JPSP* (unverified).
- Oettingen, G., and Mayer, D. (2002). "The Motivating Function of Thinking About the Future: Expectations Versus Fantasies." *Journal of Personality and Social Psychology* 83, 1198–1212. https://www.psy.uni-hamburg.de/arbeitsbereiche/paedagogische-psychologie-und-motivation/personen/oettingen-gabriele/dokumente/oettingen-mayer-2002.pdf (search result)
- Wang, G., Wang, Y., and Gai, X. (2021). "A Meta-Analysis of the Effects of Mental Contrasting With Implementation Intentions on Goal Attainment." *Frontiers in Psychology* 12, 565202. https://pmc.ncbi.nlm.nih.gov/articles/PMC8149892/ (search result)
- Gollwitzer, P. M., and Sheeran, P. (2006). *Advances in Experimental Social Psychology* 38 (effect size as reported in `docs/research/fix-kind-ideation/research.md`).
- Snyder, C. R. (2002). "Hope Theory: Rainbows in the Mind." *Psychological Inquiry* 13(4), 249–275 (secondary, search result).

### Collective agency and practice

- Bandura, A. (2000). "Exercise of Human Agency Through Collective Efficacy." *Current Directions in Psychological Science* 9(3), 75–78. doi:10.1111/1467-8721.00064 (search result)
- Bratman, M. (2014). *Shared Agency: A Planning Theory of Acting Together*. Oxford University Press (through SEP).
- Ostrom, E. (1990). *Governing the Commons*. Cambridge University Press; Ostrom, E. (2010). "Beyond Markets and States." *American Economic Review* 100(3), 641–672. https://ostromworkshop.indiana.edu/courses-teaching/teaching-tools/ostrom-design/index.html (search result)
- Shove, E., Pantzar, M., and Watson, M. (2012). *The Dynamics of Social Practice*. Sage. doi:10.4135/9781446250655 (search result)
