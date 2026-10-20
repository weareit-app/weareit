# /technology: What if capabilities could genuinely compose?

**Writer:** to decide (questions.md Q1). **Target:** about 500 words, one diagram, one status table, one worked toy example, three open questions. **Prepared:** 2026-10-20 from the atlas (§3, §8), the repo, and `research.md`.

**Guardrail (atlas):** full compositionality is a long-term research goal. The first product implements a small, ordinary version of it. Never blur the two. No benchmarks until something is measured.

## The question (1 paragraph)

Most of what could help someone reach a goal already exists: a neighbor's skill, a free room, an app, a public program. It sits in separate places that don't know about each other, so the path stays invisible. What if those pieces could be combined like building blocks, with each piece saying what it needs, what it offers and who may use it?

**You:** one moment where you saw the pieces existed but couldn't be combined (yours, not a hypothetical).

## What is known (1–2 paragraphs, sources beside each claim)

- Composition has a mathematics. Category theory studies how parts combine and when the whole behaves predictably (Fong & Spivak, *Seven Sketches*; ologs, Spivak & Kent 2012). Label: established result (the maths), not a claim it solves It's problem.
- Permissions can travel with the thing they allow: the object-capability tradition (Dennis & Van Horn 1966; Miller 2006) and newer delegated-authority formats (UCAN, ZCAP-LD, Macaroons). Label: established result for software security.
- Shared formats already let software interoperate: OpenAPI, JSON Schema, ActivityPub, Solid, and agent-tool protocols such as MCP. Label: established practice for OpenAPI, JSON Schema and ActivityPub; Solid is a Community Group draft and MCP changes quickly. Each covers part of the problem.
- The limits are real. Finding a plan from parts is computationally hard in general (Bylander 1994); distributed systems face proven trade-offs (Gilbert & Lynch 2002; Fischer, Lynch & Paterson 1985). Label: established result.

## Our present view (labelled, two parts)

1. **What It does today** (planned engineering → shipped as it lands): a status table, from `research.md` "What the repo implements". Content is a typed graph (pains, futures, ways) with sources and review status on every record; logic is separate from screens and storage; payments and email sit behind It-owned boundaries so a provider can be swapped.
2. **The direction** (speculative direction): people, skills, resources, software, commitments and permissions described in compatible ways, so a path toward a goal can be found by combining them, with permissions kept intact at every step.

**You:** how far you want to state the ambition (questions.md Q4), and in which words (Q5).

## Why it matters (the toy example)

The hand-authored example from `design.md` ("Start a free weekly guitar circle"): siloed vs composed, with its input/output trace. Marked plainly: written by hand to show the idea; there is no solver.

## What remains open (three questions)

From `design.md`: permissions that survive composition, knowing when two blocks fit, and finding paths within time and memory budgets. One links to a `/roadmap` item (Q8).

**You:** which failure you'd most like a stranger to try to prove (Q9).

## Where to pick this up

The three questions, each with the skills that help (distributed systems, formal methods, security, standards, interface design) and the contact route (Q10). Link to `/research`, `/roadmap`, `/licensing`, and the repository's architecture notes (Q3, the `/engineering` question).

**Blocks:** `diagram` (silos vs composed, design.md §2), `table` (implemented / decided / research goal), `expandable` (toy example and its trace), `evidence` cards for the two or three outside claims that carry the most weight (planning complexity, capability security).

**Sources to find:** all candidates are in `research.md` with what each published; confirm which two or three the essay actually cites. Nothing about It is measured yet, so the page has no figures.
