# Author packet: encode a situation as a graph

You're helping test whether people can describe a situation in a structured way. There are no right answers given here and no examples to copy. Work only from this packet: don't read any files or search anything.

## The guide (one page)

**Name the intended result first.** "Apply for a subsidy", "get approved", and "have reliable childcare" are different results with different requirements. Say which one you mean before listing what it needs.

| Relationship | What it means | Test |
|---|---|---|
| **May help toward** | This fix may contribute to this dream. It's never a promise. | "If this went well, would this dream be closer?" |
| **Needs to start** | You can't begin without it. | "Could someone begin without it?" If yes, it isn't a start need. |
| **Needs to succeed** | The intended result can't happen without it. | First: "Could the intended result happen without this?" If yes, it isn't necessary as written. Then: "Does having it establish the result, or does the result still have to be observed?" It should always still have to be observed. |
| **Made of (checklist)** | The steps *are* the fix: all of them done means it's done. | "If every step is done, is there anything left to find out?" If yes, it isn't a checklist. |
| **Made of (steps toward)** | Steps that usually go into it; doing them doesn't settle the result. | "After the steps, do you still have to record what happened?" |
| **Outcome** | Something that can happen when the fix is tried: hoped for, not hoped for, or pending. Any outcome can establish something. | "What does this outcome make true, and no more than that?" |
| **Withdraws** | What a later outcome stops being true, and from which source. **A later outcome doesn't undo earlier ones unless you list what it withdraws.** | "If this person changes their mind, or this arrangement ends, what goes away, and what stays?" |
| **Fact** | Something about the person's situation: yes, no, or not checked. **One fact per thing.** | "Is this one thing, or two?" A "no" to "has proof of income and ID" means *not both*, not *neither*: write two facts. |

Carried over from the prototype:
- A dream is a desired end state, a way of living, or a real option someone wants for this pain. It isn't a means, and it isn't so broad it would fit any pain.
- Facts never remove a dream. They make it likely to matter, or harder for now.
- Nothing in the graph says a dream is reached.

## The example

The pain is **"I can't find childcare I can afford."** These are notes as someone might tell them, deliberately unstructured:

> I have a two-year-old and I work four days a week, mostly early shifts. The daycare near my work has a waiting list of about a year, and the one with space costs more than half of what I earn. My mom takes him on Tuesdays, but she's getting older and I don't know how long she can keep doing it. A friend told me about a group of parents who swap babysitting, where you earn hours by watching other people's kids, but I'd have to find time to do my share. I might qualify for a childcare subsidy, but I've never checked, and I heard you need a letter from your employer and proof of your hours. My manager said she'd "think about" letting me start later two days a week, which would let me use a cheaper place that opens at eight. Another parent at the playground mentioned sharing a nanny between two families. I'd need to find a family nearby with a kid about the same age, and we'd have to agree on the rules. What I really want is to stop worrying about it every week, to be able to keep working, and for him to be somewhere he's happy.

## What each author writes

Write it as a plain list. No code is needed.

1. **Dreams** for this pain: a title and a one-line first-person sentence for each.
2. **Facts** about the situation, one thing each, marked yes, no, or not checked, based only on what the notes say.
3. **Fixes.** For each one, write:
   - its intended result;
   - which dreams it may help toward;
   - what it needs to start, and what it needs to succeed;
   - whether it's made of steps, and whether those steps are a checklist;
   - who takes part, and in what role (does it, has to agree, decides, takes part);
   - its possible outcomes, and for each one: whether it was hoped for, and what it establishes or withdraws.
4. **Questions:** anything you couldn't decide, and why.

Don't look at anyone else's version until yours is done.

## Say how you know

For every fact, relationship, and outcome you write, mark where it comes from:
- **stated:** the notes say it;
- **assumed:** you're assuming it, and you say what the assumption is;
- **needs checking:** it matters, but nobody knows yet.

Keep these apart. An honest "needs checking" is better than a confident guess.

## Output format

Write plain Markdown with these sections, in this order:

1. `## Dreams`: a title and a one-line first-person sentence for each.
2. `## Facts`: one thing each, marked yes, no, or not checked, plus stated, assumed, or needs checking.
3. `## Fixes`: for each fix, a short block giving:
   - its intended result;
   - may help toward (which dreams);
   - needs to start, and needs to succeed;
   - made of (and whether it's a checklist);
   - who takes part, with roles;
   - its outcomes, each with hoped, unhoped, or pending, and what it establishes or withdraws.

   Mark each line stated, assumed, or needs checking.
4. `## Questions`: what you couldn't decide, and why.
5. `## Effort`: one paragraph on what was hard, what was ambiguous in the guide, and roughly how long it took.
