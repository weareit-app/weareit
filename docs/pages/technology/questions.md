# /technology: founder questions

**Status:** ready for a grilling round, 2026-10-20. Fifteen questions in four rounds (four, four, four, three; one `AskUserQuestion` call per round). Each option has a short label and what it means; the recommended option is first. Context: `outline.md`, `design.md`, `research.md` in this folder.

## Round 1: scope and ownership

**Q1. Writer** — Who writes the /technology essay?
1. **Drafted, then you rewrite (Recommended)** — An agent drafts from `outline.md`; you rewrite and approve, as for `/principles`. Saves your time on the parts that are mostly sourced facts.
2. **You write it** — As for `/why` and `/ai`. The ambition is personal, but this costs the most of your time.
3. **Drafted, you only approve** — Fastest; the voice may not sound like you.

**Q2. When** — When should /technology publish?
1. **After launch, with the next batch (Recommended)** — With `/research`, `/possibility` and `/future`, as the atlas orders it. Nothing about the Oct 26 launch waits on it.
2. **Before launch** — Competes with launch work for your review time.
3. **Only after /research** — /technology cites research threads, so wait until /research exists.

**Q3. /engineering** — Should /engineering be a separate page?
1. **Not yet; link to the repo (Recommended)** — /technology ends with a link to the repository's architecture notes and CONTRIBUTING.md. Make /engineering a page once there are contributor guides worth reading on the site.
2. **Separate page now** — A short page listing the stack and decisions; it duplicates `docs/architecture/` and must be kept in sync.
3. **Fold it into /technology** — One page with a "how it's built today" section; mixes the vision with documentation the atlas keeps apart.

**Q4. Ambition** — How far should the page state the ambition?
1. **Full aim, labelled speculative (Recommended)** — Say the long-term goal plainly (people, skills, resources, software, commitments and permissions that compose), labelled "speculative direction", next to what exists today.
2. **Only the near-term version** — Talk about modular software and swappable providers; leave the big aim to /future.
3. **Big aim first, limits second** — Lead with the vision and put the status table lower down; more inspiring, easier to misread as a promise.

## Round 2: the page itself

**Q5. Words** — What do we call the pieces that combine?
1. **"Building blocks" (Recommended)** — Plain, picturable, matches the atlas sketch.
2. **"Capabilities"** — Matches the page title and the security literature; more abstract for a stranger.
3. **"Pieces"** — Plainest; may sound vague.

**Q6. Toy example** — Which hand-authored example should the page use?
1. **A free weekly guitar circle (Recommended)** — Invented person, a library room, a sign-up form, neighbors, and one commitment; one step is refused by a permission. Can link from the loneliness pain's "Start a group" way.
2. **Unemployment and financial security** — Strong, but it overlaps `/possibility`, which uses that example.
3. **Your own** — **You:** a real situation where the pieces existed but couldn't be combined.

**Q7. Diagram** — How should "today's silos" and "a composed path" be shown?
1. **Two panels, no toggle (Recommended)** — Stacked on phones, side by side on wide screens; uses the existing `diagram` block twice, works with scripts off.
2. **Add a toggle to the diagram block** — What the atlas sketched; needs a new block option, more code and accessibility work.
3. **One diagram with both** — Before and after in one drawing; denser and harder to read on a phone.

**Q8. Roadmap link** — Which open engineering question links to a `/roadmap` item?
1. **Thing / Type / Relation layer (Recommended)** — Already decided and scheduled after launch, so the link points at real planned engineering.
2. **Permissions that survive composition** — The deepest question, but there is no roadmap item for it yet.
3. **None for now** — Add the link when an item exists.

## Round 3: participation and evidence

**Q9. Hardest question** — Which open question should the page most invite people to break?
1. **Permissions that survive composition (Recommended)** — Ties to the privacy invariants; security and formal-methods people can test it on paper.
2. **Knowing when two blocks fit** — Standards and data-modeling people; most practical.
3. **Finding paths within budgets** — Algorithms people; most mathematical.

**Q10. Contact** — Where do the "help with this" links go?
1. **The contact address now, /help later (Recommended)** — Works on day one; switch to a prefilled /help link when `help-build-it` ships.
2. **Wait for /help** — The page would not publish until /help can take a topic and skills.
3. **GitHub issues** — Open to anyone with a GitHub account; puts strangers in the public tracker.

**Q11. Math** — Should the page show any notation?
1. **Words only (Recommended)** — Explain composition in plain language; the math lives in `/research` threads.
2. **One small formula** — A `math` block showing that combining a step from A to B with one from B to C gives one from A to C, with a plain reading.
3. **A short typed example** — The toy example's blocks written as a code-like interface; useful to engineers, off-putting to others.

**Q12. Measurements** — What does the page say about performance?
1. **"Nothing measured yet" (Recommended)** — State it plainly in the dataful row; add runtime, memory and failure data only with reproducible inputs.
2. **Leave it out** — Say nothing until there is data.
3. **Describe what we'd measure** — List the planned measures (runtime and memory by problem size, failure modes) as planned engineering.

## Round 4: scope cuts and labels

**Q13. Picker** — The atlas sketched a small demo where the reader picks a goal and a few people, software and resources and sees them combine. Keep it?
1. **Cut it; fixed steps only (Recommended)** — The reader opens the hand-written example step by step. A picker is a small explorer inside an essay, which the public-pages design rules out, and it would look more like a working solver than it is.
2. **A few fixed choices** — Two or three preset goals, each with its own hand-written trace; more writing, still no solver, still `expandable` blocks.
3. **Build the picker later** — Ship fixed steps now and record the picker as a roadmap idea for after the essay pipeline settles.

**Q14. First version size** — How big should the first published version be?
1. **Design's start-small list (Recommended)** — Essay, two-panel diagram, status table, toy example, three open questions, two or three evidence cards. The table carries the atlas's "implemented vs research goal" guardrail.
2. **Atlas minimum** — One diagram and three open engineering questions, with the essay around them; the status table and the example come in a revision.
3. **Minimum plus the status table** — Leave out only the toy example and the evidence cards.

**Q15. Status words** — How should the page label what It has built?
1. **"Shipped" plus the essay labels (Recommended)** — "Shipped" for what is in the code (the roadmap's word), and planned engineering, open question or speculative direction for the rest, as mapped in `research.md`.
2. **Essay labels only** — Use "planned engineering" for everything not yet researched, and describe built parts in plain sentences without a label.
3. **Add "shipped" to the essay label list** — A change to the public-essays spec, so every essay can use it.
