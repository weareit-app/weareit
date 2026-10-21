# Unread Spivak sources: what they establish for the grammar question

- **Ticket**: [#161](https://github.com/weareit-app/weareit/issues/161), "Does pain → dream → fix stay the MVP grammar?", which waits on [#176](https://github.com/weareit-app/weareit/issues/176).
- **Date**: 2026-10-21.
- **Status**: research only, on a branch that is never merged. Nothing here is a decision.
- **Inputs**: the six things pain → dream → fix can't hold (`docs/research/wayfinder/grammar-options.md` on `origin/research/grammar-options`: frame, situation, pull, other people, measure, and results and revision), and the open theory question in `docs/research/model-overlap/problem-statement.md` on `claude/inquiry-problem-statement`: does anything beat an expanded-state POMDP? That rival struggled only on unforeseen distinctions, changes of aim, disagreement about what's good, and the authority of a refusal.

## How these were read

Eleven sources, all linked from dspivak.net or topos.institute. Only the URLs named in the ticket were fetched.

- **The eight PDFs** (six talk decks, two grant narratives) were downloaded to a scratch directory outside the repository and read in full with the Read tool, which returned both the extracted text and the rendered pages. Slide numbers below are the deck's own frame numbers ("n / N" in the corner). Grant page numbers are the printed page numbers.
- **The three blog posts** were read through a summarizing fetch, then checked against the raw page text for the claims used below. Anything not checked that way is marked **(unverified)**.
- No source failed to load. Nothing was crawled beyond these URLs. Papers the sources cite (for example arXiv 2602.17917 and 2503.21974) were **not** read.

Marking: **Inference** marks a reading that goes beyond what the source says. Everything else paraphrases the source. Each source gets at most one short quote.

## Summary table

| Source | What it establishes, narrowly | Bears on |
| --- | --- | --- |
| [NITMB tutorial](https://dspivak.net/talks/pdfs/20260121-nitmb-tutorial.pdf), 2026-01-21 | An introduction for biologists. An operad is interfaces plus arrangements that nest; an algebra says what fills the boxes, and partially observable Markov processes are one listed filler (slide 8) | POMDP comparison (as a component, not a rival) |
| [NITMB lightning talk](https://dspivak.net/talks/pdfs/20260123-nitmb-lightning-talk.pdf), 2026-01-23 | A one-page question. Defines answerability as listening for and accommodating consequences, and asks how it is achieved. No formal content | Results and revision; other people only as "milieu" |
| [NITMB colloquium](https://dspivak.net/talks/pdfs/20260317-nitmb-colloquium.pdf), 2026-03-17 | An essay-talk: portability lets forms compose into collectives, and accounting lets collectives coordinate. Ends with Poly coalgebras whose wiring, and possibly interfaces, change with what flows through them (slides 19–22) | Concept formation, other people, results and revision |
| [CT 2026 talk](https://dspivak.net/talks/pdfs/20260714-ct2026.pdf), 2026-07-14 | Pure category theory: certain Kan extensions are comonads and so categories (theorem, slide 8). Examples: Lawvere theories, product completions, nerves | None found |
| [AFOSR year-3 review](https://dspivak.net/talks/pdfs/20260806-afosr-review.pdf), 2026-08-06 | One compositional syntax ("arrangements" with a parameter, wiring, and a potential) compiles to gradient descent or to Hamiltonian dynamics. Coupling then discretizing equals discretizing then coupling (slide 7) | POMDP comparison (value as a potential); other people (summed potentials) |
| [Topos "Categories by Kan extension"](https://dspivak.net/talks/pdfs/20260908-topos-catsbykan.pdf), 2026-09-08 | The same talk as CT 2026 with a proof sketch added (slide 13) | None found |
| [Bayesian update post](https://topos.institute/blog/2024-08-12-poly-as-accounting-for-bayesian-update/), Libkind and Spivak, 2024-08-12 | Bayesian update written as a Poly coalgebra over a fixed hypothesis set. A datum ruled out by a certain prior yields an error (Bayesian hell), not a revision | POMDP comparison (directly); unforeseen distinctions |
| [Math and goodness](https://topos.institute/blog/2023-07-11-math-and-goodness/), Skowron, Spivak, and Corfield, 2023-07-11 | An opinion dialogue. Goodness as compositional sense-making; groups sometimes can't make sense of each other. No formal results | Disagreement about what's good; changes of value |
| [Neural wiring diagrams post](https://topos.institute/blog/2024-11-08-neural-wiring-diagrams/), 2024-11-08 | An operad of wiring diagrams with feedback, mapped into a task-delegation operad. The resulting plans don't evolve. The paper it builds on was withdrawn for an error | Other people (delegation); no refusal |
| [AFOSR 2022 grant](https://dspivak.net/grants/AFOSR2022-Structure_and_Dynamics_of_Working_Language.pdf), "Structure and dynamics of working language" | A proposal, not results. How compositional "working language" directs material change; planned work on rewiring systems, selection, behavior contracts, and language refinement | Concept formation, other people (contracts), measure |
| [AFOSR 2018 grant](https://dspivak.net/grants/AFOSR_Proposal--Agent_Interaction_II--2018.pdf), "Agent Interaction II" | A proposal, not results. Knowledge as wiring diagrams; temporal databases as sheaves; planning as proof search where beliefs are promoted or demoted by reliability, not truth | Results and revision; measure; other people (subordinate planners) |

## Per source

### 1. NITMB tutorial: "An attempt to explain category theory to biologists in 15 minutes" (2026-01-21)

**Establishes.** Category theory is presented as the math of analogy: structure kept across a change of content (slide 1). Slide 3 answers Popper's objection that a theory explaining everything explains nothing: like stem cells, the general theory does no work until it is specialized. An operad is a set of interfaces plus arrangements of interfaces inside an interface that nest (slide 5). An algebra assigns meaning by saying what can fill each box. The examples listed include partially observable Markov processes, input-output ODEs, and tensors (slide 8).

**Bears on.**
- *POMDP comparison.* Inference: in this framing a POMDP is not a rival to the categorical account. It is one kind of box the wiring diagrams compose. The claim worth testing is therefore not "operads beat POMDPs" but whether composing and rewiring many POMDP-like boxes explains something one expanded POMDP cannot.
- *The theory caution in #176.* Slide 3 concedes the generality worry the #139 note raised about its own loop, and answers it only by analogy.
- Nothing on the six missing elements, other people, or changes of aim.

### 2. NITMB lightning talk: "Achieving Answerability" (2026-01-23)

**Establishes.** One page, no formal content. A decider is something poised to break a symmetry, like a ball balanced on a hilltop. Being answerable to consequences means the decider "will listen for and accommodate" them. The talk claims the same pattern recurs in abiogenesis, metabolism, evolution, morality, and science. Answerability has a cost, a decider may dodge feedback when that is cheaper than learning, and without internal answerability the surroundings impose it. It closes with an open question: how is answerability achieved?

**Bears on.**
- *Results and revision.* This is the closest of the eleven to the "I tried it; I changed my mind" element: a decider that takes in consequences and adjusts. It is a question, not a mechanism.
- *Other people.* Morality is described as binding choice to consequence through anticipated loss of relationships. Other people appear as consequences to be answerable to. There is no term for their refusal or their authority.
- Inference: the problem statement's obligation "answerable to reasons and to people" uses the same word. This talk supports the word but not the "to people" half, which treats affected people as consequences.

### 3. NITMB colloquium: "Accounting for our inventiveness" (2026-03-17)

**Establishes.** An essay-talk followed by mathematics. The talk says its attempt to account for ourselves with category theory mostly fails (slide 16).
- Portability (the same structure in a new substrate) lets forms compose into larger collectives (slides 4 and 14).
- Accounting is what a part gives so others can coordinate with it, aimed at settlement, where nothing is left over (slide 15). Regulation means correction, and regularity is not predictability.
- Parts of a collective may frustrate each other, and a collective whose parts conflict wastes energy and won't persist (slide 14).
- "The flow reshapes the ground": a flood carves new channels, failed predictions rewire brains, and institutions reorganize after a crisis (slide 10).
- A cell's interface, its set of receptors, changes with its state (slide 11).
- Mathematics (slides 17–22): wiring diagrams as an operad, and Poly coalgebras that output interaction patterns and update on what flows through them. The resulting "rewiring diagrams" form Org. Training a neural network is given as an example. Slide 22 says interfaces can change too (a body losing a leg, a cell changing receptors) and points to arXiv 2602.17917 for details. **(unverified: that paper was not read.)**

**Bears on.**
- *Concept formation and unforeseen distinctions.* Inference: a changeable interface is the nearest thing in these sources to a formal home for a new distinction appearing. But the slides show interfaces changing among options the model already contains. Nothing here shows a distinction arising that was outside the space of admissible changes, the limit the problem statement admits up front.
- *Other people.* Conflict between parts is named only as waste that undermines persistence. Inference: that is the "refusal as a cost to route around" reading the lens prototype criticized, not a refusal with authority.
- *Results and revision.* "Settlement" and "re-settling" (slide 16) match the #139 note's settlement term. Inference: "flow reshapes the ground" is a description of revision, without an account of when a revision is warranted.

### 4. CT 2026: "Categories by Kan extension" (2026-07-14)

**Establishes.** Pure mathematics. For a parametric right adjoint functor, the density comonad is a category (slides 6–7). Theorem (slide 8): given a monad-comonad distributive law, a certain Kan extension is a comonad and hence a category. Lawvere theories, finite product completions, and nerves of categories (Δ^op) arise this way (slides 9–11). Joint in part with Brandon Shapiro (arXiv 2405.13157, not read).

**Bears on.** None of the six elements, the POMDP comparison, other people, or changes of aim. Inference: the only conceivable link is a general way to build a category of "shapes" from a notion of composition. That is too far from It's grammar to count as evidence.

### 5. AFOSR year-3 review: "Compositional dynamics in learning and mechanics" (2026-08-06)

**Establishes.**
- The talk opens with the grant's guiding question about how language does work in the physical world, and conjectures that reality's learnability has a pre-biological mathematical basis (slide 1).
- An operad Arr of "adaptive arrangements": each has interfaces (pairs of manifolds), a parameter space Q, forward and backward wiring, and a potential U (slide 6).
- Two functorial compilers into discrete dynamical systems. One is gradient descent; the other is a Hamiltonian-style phase-space step (slide 7). A monoidality condition makes coupling then discretizing the same as discretizing then coupling. Multi-stage integrators are a conjecture.
- Examples (slides 8–10): backpropagation; heat and wave equations from the same arrangement, differing only in the integrator; and energy-based feedback, where wiring a controller to a plant gives a composite potential that is the sum of the two.

**Bears on.**
- *POMDP comparison and changes of aim.* What a system "wants" enters as a scalar potential that it descends. Inference: this is the value-as-reward shape the problem statement asks a better theory to avoid. The parameter can change, but the potential that defines what counts as better is fixed by the arrangement.
- *Other people.* Inference: when two parts are joined, their potentials add (slide 10). Disagreement between parts becomes a trade-off inside one sum, and nothing in it plays the part of a refusal.
- Nothing on frame, situation, pull, or measure.

### 6. Topos seminar: "Categories by Kan extension" (2026-09-08)

**Establishes.** The same content as source 4, with two extra slides sketching the theorem's proof (slide 13).

**Bears on.** None, as for source 4.

### 7. "A polynomial account of Bayesian update" (Libkind and Spivak, 2024-08-12)

**Establishes.**
- An expository technical report. It writes Bayesian update in polynomial functors to make "its key ingredients and its assumptions" explicit. The stated purpose is negotiation: what can we negotiate about?
- Hypotheses form a fixed set H and data a set D. A prior is a lottery over H. A conditioning map renormalizes after each datum. The update is a coalgebra that, given each datum, either updates the belief state or returns an error.
- Worked example: a coin that is either fair or biased.
- If the prior is certain the coin is biased, a tails produces an error. The post calls this Bayesian hell: computing the posterior would divide by zero.
- A closing section sketches hierarchical Bayesian update and active inference. **(unverified: the details of these sketches and of the conditioning map were taken from the summarized fetch, not the raw text.)** The convergence claim is stated informally, not derived.

**Bears on.**
- *POMDP comparison.* This is the most direct of the eleven. It is Spivak's own formal account of the belief-update core a POMDP runs on, and the hypothesis set is fixed in advance. Inference: when the world presents something the prior ruled out, the account doesn't revise its hypotheses. It stops with an error. So on unforeseen distinctions, this account shares the expanded-POMDP limit rather than beating it. Inference: the error output is a precise place where a richer theory would have to say what happens next, for example extending H. The post does not say.
- *Other people, changes of aim, values.* One learner; no utility; no change of hypotheses, values, or aims.

### 8. "Dialogue on a mathematical approach to the good" (Skowron, Spivak, and Corfield, 2023-07-11)

**Establishes.**
- An opinion dialogue with no formal results.
- Part I (Skowron and Spivak): goodness is treated as compositional sense-making. People exchange senses and change each other. Sometimes a group composes a shared sense that navigates better than any member, and sometimes it can't make sense of each other's views at all. The laws of sense composition are unknown and may relate to "proper accounting". The stated aim is to categorify goodness.
- Part II (Corfield): turns to the good life and the creative work of making meaning. Proposes using applied category theory to scaffold cognitive science on well-being, including predictive processing and active inference.

**Bears on.**
- *Disagreement about what's good.* It names the case where people can't make sense of each other, but gives no mechanism, and treats goodness as things fitting together. Inference: on this view disagreement is a failure to compose, not a standing position with its own authority.
- *Changes of value.* Sense-making is described as dynamic, against Plato's fixed ideas. There is no account of how or when values change.
- *Pull.* Inference: Corfield's "making meaning" (a vocation, sustaining a community) is closer to a pull than to a pain, but it is not developed.

### 9. "Neural wiring diagrams for message passing in multiscale organizations" (2024-11-08)

**Establishes.**
- The post builds on Org_m, a task-delegation operad from "Dynamic task delegation for hierarchical agents" with Sophie Libkind. An edit notice says that paper contained an error and was taken down. The post says its own math still stands.
- An agent takes a task and returns an outcome by orchestrating subordinates step by step, and may then change how it plans later.
- The post defines operads of "recumbent" wiring diagrams, where one box fires at a time and feedback is allowed, and maps them into Org_m.
- The resulting plans have one state and do not evolve. They are pure message passing, with subordinates exchanging messages as the wiring dictates. **(unverified: details of the feedback-state construction were taken from the summarized fetch.)**

**Bears on.**
- *Other people.* A principal delegates to subordinates. Inference: subordinates are assumed to carry out their part, and there is no term for a subordinate who declines, disagrees, or holds authority over the principal. That is the same gap the lens prototype found.
- *Changes of aim.* The evolving case is taken out explicitly, and the paper that held it was withdrawn.

### 10. AFOSR 2022 grant: "Structure and dynamics of working language" (project narrative)

**Establishes.** A research proposal, so these are planned work and conjectures, not results.
- The guiding question: how a compositional symbol system (a "working language") directs material change, at every scale from DNA to organizations (pp. 6–10).
- Its examples include a signature, described as a token of people's agreement to regulate their own behavior (p. 8).
- Proposed approaches (pp. 11–19):
  - dynamic operads, whose interaction pattern changes as machines communicate (p. 12);
  - looking for a language that is refined through interaction itself, a suspicion rather than a result (p. 13);
  - selection categories for hierarchical, multi-level selection (pp. 14–15);
  - user interfaces as polynomials (p. 16);
  - factored cognition, where tasks are split and farmed out (pp. 16–17);
  - co-design with behavior contracts, so that if subordinates keep their contracts the whole keeps its own (p. 18);
  - "spec sheets" that align attractors so continuous systems compose reliably (pp. 18–19).

**Bears on.**
- *Concept formation.* Language formation and refinement is a stated aim (pp. 10 and 13), but only as a direction to search in.
- *Other people.* Signatures and behavior contracts are the nearest these sources come to commitments between people. Inference: a contract that guarantees the whole if each part keeps its promise could describe a shared fix. It says nothing about a party who never agreed, or who withdraws.
- *Measure.* Inference: a spec sheet, saying what a system expects and what it guarantees, is a possible shape for "how I'd notice it's working". It is offered for engineered systems, not people.

### 11. AFOSR 2018 grant: "A category-theoretic approach to agent interaction" (project narrative)

**Establishes.** Also a proposal.
- Knowledge as wiring-diagram "concept webs" that a human and a computer can both reason over (pp. 3–5).
- Temporal databases as sheaves on time, so that a statement's truth value is the set of intervals when it holds, not just true or false (pp. 6–8). Stated as a best guess, not yet proved.
- Planning as recursive proof search. A planner splits a goal into lemmas handed to subordinate planners. When a subordinate fails or a plan fails to execute, the planner demotes its reliance on that subordinate and belief. The proposal names the old AI mistake as "mistaking reliability for truth" (pp. 9–11). It admits that how credit should be assigned is not understood (p. 11).
- A formal likeness between learners, open economic games, and database lenses (pp. 13–15).

**Bears on.**
- *Results and revision.* This is the clearest mechanism in the eleven for "I tried it, it didn't work, I rely on that less": beliefs promoted or demoted by track record, not updated by Bayes. Inference: it is a non-Bayesian revision rule that could sit alongside the POMDP comparison. It stays a proposal.
- *Measure and situation.* Inference: truth as "when it held" fits a measure ("most nights since March") and situations that are true for a while.
- *Other people.* Subordinate planners are other agents. A refusal would register as a failure and lead to demotion. Inference: that again treats refusal as a cost, with no standing of its own.

## What this means for #161 (inference, nothing decided)

- **Refusal and disagreement stay unheld.** Across all eleven, other people appear as parts that compose, subordinates that carry out tasks, consequences to be answerable to, contracts to keep, or potentials that add. Conflict appears only as waste or failure (colloquium slide 14; 2018 grant p. 10). The goodness dialogue names the case where people can't make sense of each other, but gives no mechanism. The lens prototype's finding, that the categorical lens has no term for disagreement or refusal, still stands after these sources.
- **On the POMDP comparison, Spivak's own Bayesian account shares the rival's limit.** The 2024 post fixes the hypothesis set and returns an error, not a revision, when data contradicts a certain prior. The tutorial lists partially observable Markov processes as one thing that can fill a box. Inference: the categorical claim worth testing is not a better belief update. It is whether rewiring, and changing interfaces, across many composed boxes (colloquium slides 19–22) predicts something one expanded POMDP misses. The paper behind interface change (arXiv 2602.17917) was not read, and the delegation paper behind the "evolving planner" was withdrawn.
- **Changes of aim have no mechanism here.** In the formal work, what a system is for is a fixed potential or loss (AFOSR review slides 6–10). Changeable interfaces and demotion by reliability are the nearest ideas, and neither changes what counts as good.
- **For the grammar, results and revision get the most support, and frame, situation, and pull get none.** Answerability, settlement, and promotion and demotion by track record all describe the "I tried it; I changed my mind" element. Temporal truth values and spec sheets suggest shapes for a measure. Nothing here speaks to whether pain → dream → fix stays the front door at launch.
- **Most of this is programmatic.** Two sources are grant proposals, three are talks with essay sections, one is an opinion dialogue, and one post rests on a withdrawn paper. The formal results (CT 2026, the AFOSR review compilers) are about mathematics and physics, not people.

## Gaps

- The cited papers were not read: arXiv 2602.17917 (changing interfaces), 2503.21974 and 2405.13157 (Kan extensions, nerves), the withdrawn delegation paper, and the 2022 blog posts the grant cites.
- The three blog posts were read through a summarizing fetch. Claims used above were checked against the raw page text, except those marked (unverified).
- Talks were read as slides without the spoken part, so the decks may understate what was argued.
