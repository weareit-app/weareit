# Author packet: encode a situation as a graph (round 2 draft)

You're helping test whether people can describe a situation in a structured way. There are no right answers given here and no examples to copy. Work only from this packet: don't read any files or search anything.

## The guide

### Each fix is one activity, with matching boundaries

Before anything else, state three things for each fix, and keep them about the same activity:

- **Beginning:** what counts as starting it.
- **Completion:** what counts as finishing it. This is its **intended result**. "Apply for a subsidy", "get approved", and "have reliable childcare" are three different activities, so pick one.
- **Downstream benefit:** what it might lead to beyond completion. That goes under *may help toward* a dream; it isn't part of the fix.

The title, the steps, and the hoped-for outcome should all describe the same activity. If the hoped-for outcome is narrower than the intended result (for example, "joined" when the result is "regularly getting care"), it's a separate step or a separate fix.

### Relationships

| Relationship | What it means | Test |
|---|---|---|
| **May help toward** | This fix may contribute to this dream. It's never a promise. | "If this went well, would this dream be closer?" |
| **Needs to start** | Required before the first step. | "Is this itself one of the steps?" If yes, it isn't a start need. "Could someone take the first step without it?" If yes, it isn't one either. |
| **Needs to succeed** | The intended result can't happen without it. | "Could the intended result happen without this?" If yes, it isn't necessary as written. Don't list the result itself here; if nothing else is necessary, write "none besides the result". |
| **Made of (checklist)** | The steps *are* the fix: all of them done completes the intended result. | "If every step is done, is the intended result itself complete?" If not, it isn't a checklist. |
| **Made of (steps toward)** | Steps that usually go into it; doing them doesn't settle the result. | "After the steps, do you still have to record what happened?" |
| **Outcome** | Something that can happen when the fix is tried. Each outcome is exactly one of: hoped for, not hoped for, or pending. Any outcome can establish something. | "What does this outcome make true, and no more than that?" |
| **Partial outcome** | When a result comes in parts (days, hours, people), an outcome for a part. | Write what each part makes true separately: "Agreed for Wednesday only" establishes "later start on Wednesday", not the other day. |
| **Points at another fix** | A need can be another fix's outcome. | Write it as "Fix N: outcome". |
| **Withdraws** | What a later outcome stops being true, and from which source. A later outcome doesn't undo earlier ones unless you list what it withdraws. | "If this person changes their mind, or this ends, what goes away, and what stays?" |

### Facts

- **One fact per thing.** A "no" to "has proof of income and ID" means *not both*, not *neither*: write two facts.
- **Each fact is yes, no, or not checked.** Don't turn silence into "no". If the notes don't say whether a day is covered, it's "not checked".
- **When there's a schedule, write one fact per day or shift:** covered by whom, not covered, or not checked.
- **An arrangement already in place is a fact,** such as "Mom looks after him on Tuesdays: yes". Don't invent an action to represent it. If something really can be done about it (for example, asking Mom how long she can continue), that's a fix.
- **When an arrangement ends, the fact becomes "no".** The graph keeps no history of facts, so say in a sentence what changed.

### Two limits of the graph to know about

- **When something a fix depended on is withdrawn, the graph doesn't update outcomes that were already recorded.** If the manager reverses a later start after the cheaper daycare has started, record a new outcome on the daycare fix as well.
- **Facts have no history,** as above.

### Dreams

- A dream is a desired end state, a way of living, or a real option someone wants for this pain. It isn't a means, and it isn't so broad it would fit any pain.
- Facts never remove a dream. They make it likely to matter, or harder for now.
- Nothing in the graph says a dream is reached.

## The example

The pain is **"I can't find childcare I can afford."** These are notes as someone might tell them, deliberately unstructured:

> I have a two-year-old and I work four days a week, mostly early shifts. The daycare near my work has a waiting list of about a year, and the one with space costs more than half of what I earn. My mom takes him on Tuesdays, but she's getting older and I don't know how long she can keep doing it. A friend told me about a group of parents who swap babysitting, where you earn hours by watching other people's kids, but I'd have to find time to do my share. I might qualify for a childcare subsidy, but I've never checked, and I heard you need a letter from your employer and proof of your hours. My manager said she'd "think about" letting me start later two days a week, which would let me use a cheaper place that opens at eight. Another parent at the playground mentioned sharing a nanny between two families. I'd need to find a family nearby with a kid about the same age, and we'd have to agree on the rules. What I really want is to stop worrying about it every week, to be able to keep working, and for him to be somewhere he's happy.

## How you know: two separate marks

For every fact and every outcome, give both of these:

- **Source:** **said** (the notes say it directly), **heard** (the notes report something secondhand, such as "I heard you need a letter"), or **inferred** (you worked it out).
- **Status:** for facts, yes, no, or not checked.

Relationships (needs, may help toward, made of) are your own proposals, so they don't need a source mark. Mark one only when it rests on a claim about the world, and give that claim's source. For example: "needs an employer letter (heard)".

## Gaps

Some connections in the notes are unresolved. You don't have to solve them. For each one you notice, write:

- what is known;
- what connection remains unresolved;
- what would help resolve it.

## Output format

Write plain Markdown with these sections, in this order:

1. `## Dreams`: a title and a one-line first-person sentence for each.
2. `## Facts`: one thing each, with its status and source.
3. `## Fixes`: for each fix, a short block giving:
   - beginning, completion (the intended result), and downstream benefit;
   - may help toward;
   - needs to start, and needs to succeed;
   - made of, and whether it's a checklist;
   - who takes part, with roles;
   - its outcomes, each with exactly one kind and a source, and what it establishes or withdraws.
4. `## Gaps`: known, unresolved, and what would help, for each gap.
5. `## Questions`: what you couldn't decide in the guide, and why.
6. `## Effort`: one paragraph on what was hard, what was ambiguous, and roughly how long it took.
