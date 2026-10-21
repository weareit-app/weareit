# Situation graph: verdict so far (parked 2026-10-21)

**Status: parked.** This is a prototype on the branch `prototype/situation-graph`, not merged and not a spec. Nothing in the app or the generator depends on it.

## The question

Can explicit relationships between dreams, fixes, and facts about a person's situation let It do things that writing alone can't?
- explain what's missing;
- reuse shared steps;
- say who has to take part;
- keep explanations consistent as information changes;
- all without anyone writing each answer by hand.

## What the evidence shows

**Explicit relationships can generate dependency explanations, and update them consistently when information changes.** The prototype, [`situation-graph.prototype.html`](situation-graph.prototype.html) (v3.1, with 36 self-checks in the page), does this for three pains, with:
- missing prerequisites;
- steps shared across fixes and pains;
- who has to take part;
- facts that are yes, no, or not checked;
- outcomes that establish or withdraw specific things;
- loops that are detected and named;
- honest gaps.

**Independent authors can mostly encode a new situation so the graph avoids the main overclaims.** In two rounds of agent authoring on a childcare example (records in [`authoring-round-1/`](authoring-round-1/README.md) and [`authoring-round-2/`](authoring-round-2/README.md)), the authors' graphs consistently avoided claiming that:
- a pending answer is agreement;
- eligibility is approval;
- joining something is getting care from it;
- any dream is reached.

**A small, targeted change to the authoring guide measurably helped.** Between the rounds, the guide changed in a few ways:
- each fix's beginning, completion, and downstream benefit must describe the same activity;
- existing arrangements are recorded as facts;
- unknown coverage stays unknown, one fact per day;
- partial outcomes are allowed;
- the source of a claim is marked separately from its status.

With those changes, all three authors handled "Mom stops helping", where none had before, and two of three represented a one-day approval, where none could before.

## What it doesn't show

- **That these explanations improve people's decisions** enough to justify the cost of authoring and maintaining a graph. No person has used them, and no person has authored one.
- **Anything about complete paths, lasting freedoms, or whether several actions fit together** under one budget or schedule.
- **That people can author reliably.** Every author so far has been an agent, and agreement between models is weak evidence.

## What's left open

**Authoring discipline.** In round 2, the most common error was turning a weak signal into a firm fact: "likely eligible" became eligible, "share agreed" became care is happening, and "Mom covers Tuesday" became Tuesday is a workday. Outcomes also went past the intended result, mostly when someone else decides (a subsidy office, a manager). Authoring takes 15 to 45 minutes for one situation, mostly spent deciding where one fix ends and the next begins.

**Three guide changes have clear evidence behind them**, and haven't been made:
1. A "likely" outcome can't set a fact to yes.
2. Silence doesn't become "yes", any more than it becomes "no".
3. When someone else decides, the result is "decision received", with approved and refused as its outcomes.

**Limits found in the engine**, recorded and not fixed (see [`authoring-round-2/representability.md`](authoring-round-2/representability.md)):
- a withdrawal doesn't update a dependent fix's outcome that has already been recorded;
- facts keep no history.

**The privacy design for a person's own situation** is unstarted. Any real version would hold facts about a person (their schedule, their income, their relationships), and the privacy invariants keep that on the device before signup. It needs its own decision record.

## If this is picked up again

1. Make the three guide changes above.
2. Run an authoring round with the founder as an author, alongside fresh agents, with the agents' drafts hidden until the founder's version is done.
3. Then test the value: show people the same content as plain fix cards and as graph explanations, and see which helps them say what they could try, whose agreement they need, and what's uncertain.

Research behind this work: `docs/research/dream-layer/research.md` (PR #134) and `docs/research/conditions-and-possibility/research.md` (PR #135), including David Spivak's "plausible fictions".
