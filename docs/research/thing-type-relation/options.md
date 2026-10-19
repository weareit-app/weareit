# Concept: Thing / Type / Relation layer

- **Slug**: thing-type-relation
- **Created**: 2026-10-16
- **Recommended option**: B — Guardrails in v0.1, then a curated core after launch

Binding founder answers (research.md): Types and Things on stacked levels, never mixed; existing records keep their form and link to Things; LLM links above a confidence threshold are used without review, the rest are queued; must not block v0.1, built after launch. Stack stays PostgreSQL + Kysely (decisions.md).

## Options

### Option A — Guardrails only
- **Sketch**: Build no layer. During v0.1, make sure every record has a stable ID, and that every outside reference (the six pain frameworks, ESCO occupations and skills, Wikidata items) is stored in one consistent shape (which list, which ID, what label, who added it) instead of free-form fields. Revisit the layer when a feature actually needs it.
- **Appetite**: small (days, folded into v0.1 work).
- **Trade-offs**: Wins: almost free, fits the one-week budget, and protects the future. Sacrifices: no shared subjects, so "basketball" in a skill and in an idea are still unrelated, and LLM tagging has nowhere to go. Risk: "later" never comes, and links keep piling up in one-off forms.
- **Rabbit holes**: agreeing on the one consistent shape for outside references; converting the pain inventory's six formats.

### Option B — Guardrails in v0.1, then a curated core after launch (recommended)
- **Sketch**: Phase 1 is Option A inside v0.1. Phase 2, after launch:
  - **Types**: a short, curated list (e.g. Sport, Occupation, Skill, Condition, Place, Policy), described as Things only at the level above, so the levels never mix.
  - **Things**: seeded only from what It actually uses: the pain frameworks' entries, ESCO occupations and skills, and the Wikidata items already mapped.
  - **Relations**: a short, named list (e.g. *is about*, *helps with*, *requires skill*). Many-to-many connections such as a person's interest become their own records that point at a Thing, as in ologs.
  - **Equivalences**: the same subject from two sources is recorded as equivalent rather than merged.
  - **Every link is a claim**: it records who or what made it, its confidence, and whether it was reviewed. An LLM proposes links to content; those above the threshold are used, the rest are queued, and a regular random sample is checked by the founder.
  - **A written olog** (types, arrows, equations) is the design document, and the data is checked against it, e.g. for zero level violations.
  - People's own data is not tagged until a separate privacy decision.
- **Appetite**: small for Phase 1 (inside v0.1); medium (a few weeks) for Phase 2.
- **Trade-offs**: Wins: meets every goal in problem.md, follows the founder's level rule and threshold choice, and grows from what It uses rather than from all of Wikidata. Sacrifices: Phase 2 is real work after launch, and a curated Type list needs ongoing judgment. Risk: the threshold may be set too low before precision is known, so start it high and lower it as audits show precision.
- **Rabbit holes**:
  - Designing the "perfect" Type list. Keep it small and add Types only when a Thing needs one.
  - Relation sprawl. Every new Relation needs a plain-language reading ("a skill *is needed for* an occupation") and a place in the olog.
  - Equivalence chains (A ≈ B ≈ C) and conflicting sources.
  - Calibrating LLM confidence. Self-reported scores may not match real precision, so measure on audits.
  - Traversal depth. If queries go many hops, PostgreSQL alone may get slow; any extension or graph database needs a decision record.

### Option C — Use Wikidata as the Thing layer
- **Sketch**: Don't keep Things in It at all. Store Wikidata IDs on records and rely on Wikidata's classes ("instance of", "subclass of") as Types and its properties as Relations. ESCO stays separate.
- **Appetite**: small to medium.
- **Trade-offs**: Wins: huge free coverage (CC0), little curation, recognisable IDs. Sacrifices: inherits Wikidata's documented class/instance disarray and mixes levels, which contradicts the founder's stacked-levels rule. Many ESCO skills and It-specific subjects aren't in Wikidata, and It depends on an outside service it can't correct quickly. The olog / formal goal is hard to meet.
- **Rabbit holes**: cleaning Wikidata's hierarchy for It's use; gaps for ESCO and It-specific subjects; keeping IDs current when Wikidata items merge.

*Do nothing* is Option A without the guardrails. It's the cheapest short-term but risks a costly migration later, so it isn't recommended.

## Recommendation

**Option B.** Phase 1 costs almost nothing in v0.1 and meets the "must not block" decision. Phase 2 delivers every goal in problem.md: one shared way to say "this is about X", equivalences across sources, LLM tagging at scale with the founder's threshold rule, existing records left intact, and a written olog that keeps it formal. It respects the stacked-levels rule that Option C breaks. It starts from Things It actually uses, so curation stays proportionate. Phase 2 should go through `/speckit-specify` as its own spec after v0.1 launches.

**What v0.1 must do (Phase 1), to carry into specs 001–006:**
1. Every record people or the founder can see (pain, dream, idea, skill, occupation, roadmap item) has a stable ID that never changes once published.
2. Outside references are stored in one consistent shape (which list, its ID, its label, who added it, when), not as free text. The pain inventory's six formats convert into this shape.
3. Help page answers (background, skills) are stored as references to ESCO entries, not free text (already in features.md "must not block").
4. Content is versioned, and picks keep their content version (already in spec 001).

## Out of Scope (for the recommended option)

- Building Phase 2 in v0.1.
- Turning pains, dreams, ideas or skills into Things.
- Tagging people's own data (interests, picks, background) by LLM, pending a separate privacy decision.
- Mirroring Wikidata or ESCO wholesale; only Things It uses.
- A separate graph database, graph extension or formal tool (e.g. CQL), unless a later decision record adopts one.
- Automated reasoning or inference beyond following links.
- Any public view of who is linked to what.

## Assumptions to Validate

- PostgreSQL handles the link-following It needs (a few hops) without a graph extension.
- An LLM's confidence can be calibrated well enough against founder audits for a threshold to mean something.
- The founder has time for a small regular audit sample (e.g. 20–50 links a week).
- A Type list of roughly 10–30 Types covers It's content for the first year.
- Most mapped subjects have stable outside IDs (Wikidata QIDs, ESCO URIs), and those IDs stay stable enough to store.
- An olog for the core (Types, Relations, equations) can be written in a page or two and kept current.
- Phase 1 adds less than half a day to v0.1.
