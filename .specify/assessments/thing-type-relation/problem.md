# Problem Definition: Thing / Type / Relation layer

- **Slug**: thing-type-relation
- **Created**: 2026-10-16
- **Inputs used**: intake.md, research.md (including founder answers), `docs/spec/pains/pain-inventory.yaml`

## Problem Statement

It is accumulating many kinds of records (85 pains, their dreams and ideas, ESCO occupations and skills, roadmap items, and later people's interests), and each kind connects to the others and to outside lists only through its own one-off links. So the same subject ("basketball", "housing", "insomnia") appearing in different places isn't recognised as the same, and every new kind of connection needs new structure. This matters now because the pains have just been mapped to six outside frameworks in six different ad-hoc formats, the Help page is bringing in ESCO, and v0.1 must not set a shape that blocks connecting everything later.

## Affected Users & Stakeholders

- **Users — visitors and members**: indirectly. Without shared subjects, It can't show related ideas across pains, or later match people with goals to people who can help ("soon" in features.md). — [research: Users & Demand]
- **Users — the founder as content editor**: maps and curates hundreds of items by hand, with each mapping in a different format. — [pain-inventory.yaml: `maps` holds oecd, whoqol, sdg, maxneef, gallup and wikidata entries, each shaped differently]
- **Users — developers and coding agents**: need one understandable way to say "this is about X" rather than learning a new link for each pair of kinds. — [intake: founder wants it relatable to developers]
- **Stakeholder — the founder**: decides the model and wants it to be formalisable in mathematics as well as practical. — [intake]
- **Stakeholder — the research pipeline** (`~/Research/research-pipeline`, `docs/spec/pieces.yaml`): would benefit from stable shared IDs. — [ASSUMPTION]

## Goals

1. One shared way to say that any record is about a Thing of some Type, connected by named Relations, with Types and Things kept on separate, stacked levels (founder, 2026-10-16).
2. The same subject from different sources (It's own, Wikidata, ESCO, the six pain frameworks) is recognised as the same, by a recorded equivalence rather than silent merging.
3. Tagging scales: an LLM can propose links, and links above a confidence threshold are used without review while the rest wait in a queue (founder, 2026-10-16), with every link recording who made it and how confident it is.
4. Existing records (pains, dreams, ideas, skills) keep their own form and gain links to Things; nothing already built has to be redone (founder, 2026-10-16).
5. It is understandable to people, workable for developers, and can be described precisely in mathematics (e.g. as an olog).
6. Privacy promises hold: nothing personal is linked before signup, and nothing personal is public by default.

## Non-Goals

- Building any of this in v0.1. v0.1 only must not block it (founder, 2026-10-16).
- Turning pains, dreams, ideas or skills into Things.
- A public graph of people, or showing anyone's links to others by default.
- Adopting a formal tool (e.g. CQL) or a separate graph database now. Either would need its own decision record.
- General automated reasoning or inference over the graph.
- Mirroring all of Wikidata; only Things It actually uses.

## Success Metrics

- Share of published content items (pains, dreams, ideas) linked to at least one Thing. (baseline: 0%; mappings exist only as free-form fields in pain-inventory.yaml)
- Precision of links used without review, measured on a regular random sample checked by the founder. (baseline: unknown; target to set in shape)
- Size of the review queue and the time items wait in it. (baseline: none)
- Number of duplicate Things for the same subject found in a sample. (baseline: unknown)
- Number of level violations, i.e. anything that is both a Type and a Thing at the same level. Target: zero, checkable automatically. (baseline: n/a)
- Adding a new kind of connection (e.g. roadmap item ↔ skill) needs no new structure, only a new Relation. (baseline: today every new pair needs its own link; qualitative)

## Cost of Inaction

It keeps adding one-off links for each pair of kinds. Outside mappings stay as free text in different formats, and the same subject stays unconnected across pains, ideas, skills and interests. Later features (matching people, starting from a dream, related ideas) each need their own connecting work, or a costly migration once the data has grown. In the short term nothing breaks: v0.1 works without it.

## Open Questions

- [NEEDS CLARIFICATION: Where do Things come from (Wikidata, ESCO, the pain frameworks, It's own), and who decides when two are equivalent?]
- [NEEDS CLARIFICATION: Can people's own data after signup (interests, skills, picks) be tagged by an LLM, and with which provider and privacy terms?]
- [NEEDS CLARIFICATION: What confidence threshold, and how often is a sample audited?]
- [NEEDS CLARIFICATION: How formal now: ologs as the design discipline only, or a written formal model (types, relations, equations) checked against the data?]
- [NEEDS CLARIFICATION: What exactly must v0.1 do to "not block" this (e.g. stable IDs on every record, outside IDs stored in one consistent shape)? To settle in shape and carry into specs 001–006.]
