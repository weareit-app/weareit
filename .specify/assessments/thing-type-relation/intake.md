# Idea Intake: Thing / Type / Relation layer

- **Slug**: thing-type-relation
- **Created**: 2026-10-16
- **Source**: founder, in conversation (2026-10-16), while reviewing spec 001 (personal page); plus a paper the founder supplied (local copy `~/Downloads/pone.0024274.pdf`)
- **Type**: new-capability

## Idea (as captured)

Founder, verbatim:

> I also think we need another concept in the database, something really fundamental like "subject" or "concept" or maybe even more basic that basically _anything_ can be tagged with by an LLM. For example, imagine "Basketball", which could be connected to an interest "Basketball"–the point is being able to use those as semantic graphs on top of everything else.

> I want this to be something that's both understandable and relatable to humans/developers, is computational, but also workable to formalize into mathematics, too.

Founder's vocabulary choice (2026-10-16, from options offered): **Thing / Type / Relation**: a particular one ("Basketball"), a kind ("a sport"), and a connection between them.

Reference supplied by the founder: Spivak, D. I. & Kent, R. E. (2012). *Ologs: A Categorical Framework for Knowledge Representation.* PLoS ONE 7(1): e24274. doi:10.1371/journal.pone.0024274 (CC BY). Abstract excerpt: "we introduce the olog, or ontology log, a category-theoretic model for knowledge representation (KR)… ologs can be aligned or connected together into a larger network using functors."

Other reference points raised in the conversation (not yet researched): Wolfram Language entities (`Entity[type, name]`, entity properties, entity classes, `Interpreter` from text to entity), Wikidata items, classes and statements, SKOS concepts (used by ESCO), ISO Topic Maps, schema.org `Thing`, upper ontologies (BFO, DOLCE), type theory (terms and types).

## Restated

Add a basic layer to It's data where any record (pains, dreams, ideas, skills, occupations, roadmap items, people's interests) can be connected to shared Things of particular Types through Relations, with tags proposed by an LLM as well as people. The result is one semantic graph across everything that people can understand, code can compute over, and mathematics can describe.

## Origin & Context

- **Raised by**: the founder (Josh Smith), 2026-10-16.
- **Trigger**: reviewing spec 001 (personal page) and realising the launch pains are incomplete and need matching to outside ontologies (now a separate session, `pain-discovery`), which led to wanting a general way to connect everything. Related context: the Help page links occupations to skills through ESCO (many-to-many), and features.md "soon" items (matching people with goals to people offering help, starting from a dream) need connections across content and people.
- **Existing related code**: `packages/content/src/graph-schema.ts` already models domains, pains, dreams, first actions, sources and provenance records with typed `entityType` / `entityId` references. Database migrations 001–004 cover content, user persistence and support payments.

## First-Glance Unknowns

- [NEEDS CLARIFICATION: Are Types themselves Things (as in Wikidata, where "sport" is also an item), or a separate level (as in ologs and type theory)?]
- [NEEDS CLARIFICATION: Do existing records (pains, dreams, ideas, skills) become Things, or stay as they are and get linked to Things?]
- [NEEDS CLARIFICATION: Where do Things come from: It's own, imported from Wikidata / ESCO / Wolfram-style sources, LLM-proposed, or all of these? How are duplicates merged?]
- [NEEDS CLARIFICATION: How is an LLM tag recorded: as a claim with source, confidence and review status, or as a fact? Who reviews?]
- [NEEDS CLARIFICATION: Can people's own data (interests, picks, skills) be linked to Things, and how does that respect the privacy invariants (nothing before signup leaves the device; nothing personal public by default)?]
- [NEEDS CLARIFICATION: Which formalism is the target: ologs and category theory, type theory, description logic (OWL), or "formalisable later"?]
- [NEEDS CLARIFICATION: Is this needed for v0.1 at all, or only something the v0.1 build must not block?]
- [NEEDS CLARIFICATION: Does adopting it change an agreed stack choice (PostgreSQL + Kysely; no graph database), which would need a decision record?]
