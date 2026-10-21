# Authoring exercise: can people write the graph the same way?

**Prototype material, not a spec.** It goes with `situation-graph.prototype.html` on the `prototype/situation-graph` branch.

## Why

The situation graph can explain what's missing and what changed, but only if its authors make the same distinctions reliably. This exercise checks that before anyone builds more engine.

Give the same example to several authors working independently: the founder, and two or three isolated agents. Then compare their graphs. A disagreement isn't automatically a failure. Each one is one of these:

- **Ambiguous semantics:** the guide below allows two readings. Fix the guide.
- **Missing knowledge:** an author didn't know how something works. Note it as a fact to research.
- **A legitimate alternative:** two reasonable ways to break the same thing down. Keep both, and note what would decide between them.

## The guide (one page)

| Relationship | What it means | Test question |
|---|---|---|
| **May help toward** | This fix may contribute to this dream. It's never a promise. | "If this went well, would this dream be closer?" |
| **Needs to start** | You can't begin without this. | "Could someone begin without it?" If yes, it isn't a start need. |
| **Needs to succeed** | It can't work without this, but having it doesn't mean it worked. | "Could it fail even with this in place?" If no, you've written a guarantee: rethink it. |
| **Made of (checklist)** | The steps *are* the fix. All of them done means the fix is done. | "If every step is done, is there anything left to find out?" If yes, it isn't a checklist. |
| **Made of (steps toward)** | Steps that usually go into it, but doing them doesn't settle the result. | "After the steps, do you still have to record what happened?" |
| **Outcome** | Something that can happen when the fix is tried: hoped for, not hoped for, or pending. Any outcome can establish something. | "What does this outcome make true that wasn't before, and no more than that?" |
| **Establishes / withdraws** | What an outcome makes true, or stops being true, and from which source. | "If this person or thing withdraws, what goes away, and what stays?" |
| **Fact** | Something about the person's situation: yes, no, or not checked. | "Is this about the situation, or about something someone does?" |

Two rules from the prototype carry over:
- Facts never remove a dream. They make it likely to matter, or harder for now.
- Nothing in the graph says a dream is reached.

## The example

The pain is **"I can't find childcare I can afford."** These are notes as someone might tell them, deliberately unstructured:

> I have a two-year-old and I work four days a week, mostly early shifts. The daycare near my work has a waiting list of about a year, and the one with space costs more than half of what I earn. My mom takes him on Tuesdays, but she's getting older and I don't know how long she can keep doing it. A friend told me about a group of parents who swap babysitting, where you earn hours by watching other people's kids, but I'd have to find time to do my share. I might qualify for a childcare subsidy, but I've never checked, and I heard you need a letter from your employer and proof of your hours. My manager said she'd "think about" letting me start later two days a week, which would let me use a cheaper place that opens at eight. Another parent at the playground mentioned sharing a nanny between two families. I'd need to find a family nearby with a kid about the same age, and we'd have to agree on the rules. What I really want is to stop worrying about it every week, to be able to keep working, and for him to be somewhere he's happy.

## What each author writes

Write it as a plain list. No code is needed.

1. **Dreams** for this pain: a title and a one-line first-person sentence for each, using the dream rules (a desired end state for this pain; not a means; not so broad it would fit any pain).
2. **Facts** about the situation, each marked yes, no, or not checked, based only on what the notes say.
3. **Fixes.** For each one, write:
   - which dreams it may help toward;
   - what it needs to start;
   - what it needs to succeed;
   - whether it's made of steps, and whether those steps are a checklist;
   - who takes part, and in what role (does it, has to agree, decides, takes part);
   - its possible outcomes, and for each, whether it was hoped for and what it establishes or withdraws.
4. **Questions:** anything you couldn't decide, and why.

Don't look at anyone else's version until yours is done.

## How we compare

For each item, check whether the authors agreed on:
- the kind of relationship (start need, succeed need, checklist part, step, outcome, fact);
- what each outcome establishes, and nothing more;
- which dreams each fix may help toward.

Mark each disagreement as ambiguous semantics, missing knowledge, or a legitimate alternative. Three cases are likely to split authors and are worth watching:
- **The manager's "I'll think about it".** Is that a pending outcome, a fact, or nothing yet?
- **Mom on Tuesdays.** Is that a fact, an outcome already in place, or a commitment that could be withdrawn?
- **The babysitting swap.** "Find time to do my share" could be a need to start, a need to succeed, or a separate fix.

**What would count as success:** the authors agree on most relationship kinds without discussion, and every disagreement fits one of the three types, with a clear fix to the guide or a fact to look up.
