# Weve's plausible fiction, mapped to It

- **Date**: 2026-10-21. Feeds [Does pain → dream → fix stay the MVP grammar?](https://github.com/weareit-app/weareit/issues/161) under the map [#156](https://github.com/weareit-app/weareit/issues/156).
- **Status**: research only, on a branch that is never merged. Nothing here is a decision. Mappings are inference unless they quote It's own docs.
- **Source**: the founder's local Weve monorepo (`~/Code/weve`), which joins `dspivak/weve-frontend` and `dspivak/weve-backend` at their `dev-david` branches. Spivak's last commit is 2026-05-01, so this is his thinking as of May 2026. Read: `frontend/docs/pf/CATEGORY_THEORY.md`, `CT_INVARIANTS.md`, `VALIDATION_SPEC.md`, the three READMEs, the prompts in `backend/app/routers/flowchart.py` and `pf.py`, the flowchart page, `CollaborationModal.tsx`, and the database schema (which the founder rebuilt from the code, so it isn't Spivak's own). The repositories have no license, so this note paraphrases and doesn't copy.

## Short answer

- **Weve's grammar is goal → nested tasks, each task a little function from inputs to outcomes.** A task is the monomial `A · y^B`: `A` is what it needs, `B` is what can happen. Tasks chain (each outcome leads to the next task or ends) and nest (a task can be elaborated into a whole sub-flowchart whose endings say which parent outcome they count as). On top sit optional extras: a chosen outcome per task (the plan), odds on outcomes, and values.
- **It maps onto It better than expected, and holds some of what pain → dream → fix lacks.** Pull is the front door. Refusal fits as a task outcome ("they said no"). What a fix needs to start is `A`. A step that depends on another is nesting. `revealParentGoal` is the why test run upward. Contingencies ("if no, then…") are the outcome tree.
- **It has no place for four things It cares about**: the frame, the person's situation as its own record, disagreement about what's good, and changing to a *different* aim. It also records no results: a chosen outcome is a plan, not what happened.
- **Two of its UX choices collide with It's privacy invariants**: a free-text chat that an LLM turns into structure, and public posts tied to their author. Before signup, It can't send personal free text off the device, and published content never reveals who contributed it.
- **Weve's two halves aren't joined yet.** The flowchart math lives on a development-only page. The social side (posts with "Key tasks" and "collaborate on a task") parses tasks from post text, and its task link is always null. So the bounty and gap-filling ideas exist only in the math, not in the product.

## 1. The math, plainly

| Weve term | Math | Plain meaning |
| --- | --- | --- |
| Task | Monomial `A · y^B` | A step with inputs `A` and possible outcomes `B` (default: success, failure) |
| Invocation | Position `a ∈ A` | The step with its inputs filled in ("buy pants, size 32, blue") |
| Outcome | Direction `b ∈ B` | What happened |
| Flowchart | Element of the free monad `free_p(1)` | A tree: each outcome leads to the next step or ends |
| Elaboration | Polynomial map `p → free_q` | Filling a gap: breaking a step into a sub-flowchart |
| `mapsTo` | The map's backward direction part | Each ending of the sub-flowchart says which outcome of the parent step it counts as ("offer declined" counts as "not hired") |
| Explode | Monad multiplication `μ` | Flatten all nesting into one tree |
| Recipe | Chosen path through `free_{p_*}` | The plan: follow the expected outcome at each step |
| Coherence | A commuting triangle | The plan through a sub-flowchart must end at the parent's expected outcome |
| Likelihood | Kan residual `p/rand` | Odds on each outcome, whole numbers summing to 100 |
| Percolation | `free_{p/rand} → (free_p)/rand` | Odds inside a sub-flowchart combine into the parent's odds: multiply along paths, add per parent outcome |
| Value, `derivedValue` | Reverse martingale | Put a value on the goal's outcomes; each inner step gets an expected value, which Weve calls a natural bounty for filling that gap |
| Further `/q` | More residuals | The stated pattern for any new annotation: a field, an operation, a combine rule (cost adds, time takes the max), a validator, an LLM operation, and a badge |

**Validation** checks 11 structural rules plus 3 for odds (endings must map to a real parent outcome, no orphan steps, the plan must be coherent, inputs must be in scope, odds must be whole, sum to 100, and be all or none). It runs at three levels: tree, plan, and full (meant for publishing, not built). Broken drafts are repaired where possible (for example, a missing ending gets mapped to the parent's first outcome) rather than rejected.

## 2. The UX

- **Flowchart page** (development only; not in the sidebar). Chat on the left ("What do you want to build?"), the story as a tree on the right. Three tone settings: terse (the default), balanced, and friendly.
- **The conversation prompt** listens first: let the person talk, acknowledge briefly, and probe only when they seem done. One question at a time, substance before logistics. Implausible things get a brief note and the talk moves on. It draws out confidence ("Have you done this before?", "What could go wrong?").
- **A second model watches the chat and edits the tree** with operations: set the goal (always from the first message), add, update, or remove a task, nest a task under another, set plausibility, reveal a parent goal, and set odds or values. It's told to extract early and refine later. A third model gives each task two or three outcomes with odds, using fixed bands (easy 80–95, doable 50–79, hard 20–49).
- **Social side**: a person writes a rough idea; an LLM polishes it into one sentence, then writes a short first-person post ending in "Key tasks:" with three to five items. Others can pick a key task and post a collaboration on it. Posts are public with their author; likes, saves, messages, and notifications exist.

## 3. Mapping to It today

| Weve | It today | Fit |
| --- | --- | --- |
| Goal (root task) | **Dream** | Close. A Weve goal can be a means; It's dream must be an end state, and its why test asks "why do you want that?" |
| `revealParentGoal` | The dream screen's **why test** | The same move, opposite use: Weve climbs to the deeper goal and keeps going; It rejects the lower one from the dream slot |
| Goal's custom outcomes `B₀` (perfect fit, acceptable, nothing found) | Nothing | A possible home for a **measure** (how you'd notice): graded endings of a dream |
| Task | **Fix** | Close, but Weve's tasks are personal plans and It's fixes are general suggestions with a kind and an honest status |
| Task inputs `A` | "Needs to start" (situation-graph rules; MVP scope note §4.4) | Close. Weve's only form of situation is what a step needs |
| Task outcomes `B` | Nothing; the Ask kind's rule never to imply a yes, and the proposed `ifNo` field | Weve holds **refusal as an outcome** of a step: "they said no" is a direction, and `ifNo` is its next step |
| Elaboration and `mapsTo` | The reserved Path kind; "needs to succeed" | Weve's nesting is what It's flat fixes lack; `mapsTo` is a clean rule for when a sub-plan counts as done |
| Recipe vs flowchart | Selected fixes | It has the plan's steps (picked fixes) but not the contingencies |
| Likelihood, plausibility | The four honest status labels; `fix-evidence-levels` | Different kinds of honesty. Weve asks "how likely is this step?"; It asks "what kind of thing is this, and what's known?" Weve's odds come from the person's confidence and an LLM's guess, with no source |
| Percolation | Nothing | A path's odds from its steps' odds |
| Value and bounty | **Support It**; Feature fixes on the roadmap | A gap with a value attached resembles a Feature fix It says it's building, with support behind it |
| Gap calling, collaboration posts | **Own contributions** (a founder review queue); Help build It | Similar intent, opposite privacy: Weve posts are public and signed; It never shows who contributed |
| Listening chat plus extraction | The pain explorer (pick pains, dreams, and fixes) | It onboards by picking, not talking |
| Validation and repair | Zod content schemas, generator lint and screens, locked content IDs | Same discipline, different objects |

## 4. Mapping to what It wants to build

Taken from `docs/spec/features.md` "soon" items and the candidate grammars in `grammar-options.md` (A to D).

- **Pull entrance** ("Starting from a dream instead of a pain", features.md; candidate C). Weve is pull-first throughout. Its "set the goal from the first message, then ask how" is a working pattern for a second front door.
- **Explicit paths and the Path kind.** Weve's nesting and `mapsTo` are a ready, tested structure: a fix made of steps, each with endings that say what they count as. Adopting the shape (not the code) would give "needs to start", "needs to succeed", and `ifNo` one home.
- **Results and revision** (candidate D). Weve stores a chosen outcome, not an actual one. In its own pattern, "what actually happened" is one more residual like the plan. That's inference, but it suggests results fit this math without a new kind of object. Changing to a *different* dream doesn't fit; only climbing to a parent goal does.
- **Measures.** A dream's graded endings (`B₀`) could hold "how you'd notice", in place of measure-shaped dreams.
- **Other people.** Weve treats them as collaborators who fill gaps, with a value that draws them in. That fits "make progress with others" and the coordination outline. It has no disagreement about the goal and no way to refuse the whole story, only a step.
- **Frame and situation.** Nothing in Weve holds them. Candidate B's frame layer would be It's own addition.

## 5. Where It should not follow Weve

- **Numeric odds.** Weve asks for and invents likelihoods. It decided on honest status labels with sources and no evidence numbers in v0.1, and on no scores in v0.1 (#174). Odds that an LLM guesses without a source would break "honesty lives in fields". Any later use would need sourced or person-given odds, kept on the device before signup.
- **Chat that sends free text to an LLM.** Before signup, personal free text stays on the device (privacy invariants). A Weve-style conversation could run only after signup with consent, or with an on-device model.
- **Public, signed contributions.** It's contributions are reviewed, and published content never reveals who contributed.
- **Repair by default.** Weve maps a broken ending to the parent's first outcome. For It's content, a silent repair could invent a claim; It's screens fail and send items back instead.

## 6. Open questions this raises

1. Should It's Path kind (after launch) adopt Weve's shape: steps with outcomes, nesting, and endings that map back?
2. Is "refusal as a step outcome" enough for It, or does It also need disagreement about the dream itself, which Weve can't hold?
3. Does a pull front door belong after launch as a chat or as picking? Chat has privacy costs before signup.
4. Should a gap's value ever be shown (a bounty), given that It says "support" and never implies a donation or a payout?
