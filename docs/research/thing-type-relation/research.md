# Idea Research: Thing / Type / Relation layer

- **Slug**: thing-type-relation
- **Created**: 2026-10-16
- **Evidence confidence (overall)**: medium on prior art and constraints (well-documented systems and papers); low on demand (founder-stated only; no feature yet requires it).

## Users & Demand

- The founder wants a single way to connect anything (pains, dreams, ideas, skills, occupations, roadmap items, interests) to shared Things, tagged by people and LLMs. — [source: founder, intake.md] (confidence: high that it is wanted; stated, not observed)
- Concrete near-term needs that would use it:
  - The Help page suggests skills from occupations through ESCO's many-to-many occupation–skill links (founder, 2026-10-16). — [source: .specify/assessments/it-mvp/concept.md] (confidence: high)
  - Pain discovery is mapping every pain to outside frameworks with stable IDs (e.g. Wikidata QIDs). — [source: pain-discovery session brief] (confidence: high)
  - "Soon" items: matching people with goals to people offering help; starting from a dream instead of a pain. — [source: docs/spec/features.md] (confidence: high that they're planned; they are not v0.1)
- No end user has asked for this; it is infrastructure that people meet only indirectly (better matches, related ideas, "people who care about this"). — [ASSUMPTION] (confidence: medium)

## Prior Art

- **Inside It:** `packages/content/src/graph-schema.ts` already has typed references (`entityType` + `entityId`) for provenance across domains, pains, dreams and first actions, and dreams already relate many-to-many to pains. That is a small, closed version of the idea. — [source: repo] (confidence: high)
- **Wikidata:** everything is an *item* with an ID, linked by *statements*; classes are items too, connected by "instance of" (P31) and "subclass of" (P279). Several studies find "large-scale conceptual disarray": classes and instances get confused, entities are treated as both, there are subclass loops and drift along chains. They blame ambiguous "is-a" language, multi-faceted concepts, **bulk automated imports**, and contributors not attuned to the formal distinction. Fixes have lagged behind diagnosis. — [source: arxiv.org/pdf/2411.15550; arxiv.org/pdf/2511.04926; semantic-web-journal.net/node/3480] (confidence: high) *Relevance: this is the direct risk of "types are things too" plus LLM tagging at scale.*
- **Wolfram Language:** `Entity[type, name]` with properties per type; custom types via `EntityStore` (a type with entities, properties and values, or a schema from a relational database), registered with `EntityRegister`. Custom types are checked before built-in ones. Types are named domains, not entities. — [source: reference.wolfram.com/language/ref/EntityStore; reference.wolfram.com/language/guide/EntityTypes.html] (confidence: medium–high) *Relevance: a computational system that keeps Types and Things on separate levels and lets custom types sit beside imported ones.*
- **Ologs (Spivak & Kent 2012):** types are boxes labelled "a ___", arrows are single-valued and labelled with verb phrases, facts are equal paths, and ologs align through functors. An olog is "similar to a relational database schema", and instance data is a functor to sets. Many-to-many relations become their own type (a span). — [source: founder-supplied PDF, doi:10.1371/journal.pone.0024274] (confidence: high) *Relevance: a formal basis that maps straight onto relational tables, which suits PostgreSQL.*
- **Functorial data migration / CQL:** the reference implementation of Spivak's approach, from Conexus AI. It offers static guarantees of data integrity in schema mappings, but is licensed BSD-3 only for non-commercial and evaluative use; production needs a separate licence. No named production users were found. — [source: categoricaldata.net/CQL; arxiv.org/abs/1903.10579] (confidence: medium) *Relevance: the maths can be used as a design discipline without adopting the tool.*
- **In the founder's research corpus:** "A Categorical Unification for Multi-Model Data, Part I: Categorical Model and Normal Forms" (compositional-software corpus) — not yet read for this assessment. — [source: ~/Research/research-pipeline corpus manifest] (confidence: n/a)
- **Other standards** (named in intake, not researched in depth): SKOS concepts and schemes (ESCO uses them), ISO Topic Maps (topics, typed associations with roles, occurrences), schema.org `Thing`, upper ontologies BFO and DOLCE. — [source: general knowledge, ASSUMPTION until checked] (confidence: medium)

## Market & Context

- Without this layer, It can still link things with specific tables (pain ↔ dream, occupation ↔ skill, idea ↔ roadmap item). The cost is that each new kind of connection needs its own table and nothing connects across them (e.g. "Basketball" in an interest, a skill and an idea are unrelated rows). — [ASSUMPTION] (confidence: medium)
- LLM entity linking to Wikidata is active research. Early results say LLMs do "reasonably well" on long-tail entities and may complement traditional linkers (ReLiK), but no benchmark found gives a solid precision figure for LLM tagging. — [source: arxiv.org/abs/2505.03473; semantic-web-journal.net/node/3889] (confidence: low–medium) *Implication: LLM tags need review and a recorded confidence; accuracy is unproven.*

## Data & Constraints

- **Stack:** PostgreSQL with Kysely is decided; a graph database is not. The drafts list "graph DB" as a v0.1 no-go. Graph traversal can be done in PostgreSQL with recursive queries, or with the Apache AGE extension (Cypher inside Postgres), which keeps everything in one database. Claimed speed-ups for extensions are vendor taglines, not benchmarks. — [source: decisions.md; docs/spec/drafts/opportunity-tree.md; snowflake.com AGE post; pgxn.org] (confidence: medium) *Implication: an edges-style design in plain PostgreSQL is possible without a stack change; adopting AGE or a graph DB would need a decision record.*
- **Privacy:** pre-signup picks and marks stay on the device; nothing personal is public by default (AGENTS.md). Linking people's interests or picks to Things is personal data. LLM tagging of a person's own text would send it to a model provider. — [source: AGENTS.md] (confidence: high)
- **Honesty principle:** LLM-proposed links are claims, not facts. The content model already records provenance (`contentProvenanceSchema`). — [source: constitution draft; graph-schema.ts] (confidence: high)
- **Licences:** Wikidata data is CC0; ESCO and O*NET are CC BY 4.0 (founder-stated) and need attribution; CQL is not free for commercial production use. — [source: founder; categoricaldata.net] (confidence: medium; Wikidata CC0 is ASSUMPTION from general knowledge)
- **Time:** v0.1 has a one-week budget and already more content than planned. — [source: it-mvp decision.md] (confidence: high)

## Evidence Against the Idea

- **Class/instance confusion is the documented failure mode** of the closest real-world system (Wikidata), made worse by bulk automated imports. LLM tagging at scale is exactly that kind of import. — [source: Wikidata studies above]
- **No v0.1 feature needs a general layer.** The Help page needs occupation ↔ skill only, and pains need external IDs only. Both can be done with specific links now and folded into a general layer later. — [source: it-mvp concept.md; ASSUMPTION about later folding]
- **Generality is costly to get right:** a general "anything relates to anything" design is easy to start and hard to keep consistent (cf. Wikidata). The formal tools that guarantee consistency (CQL) aren't licensed for free production use. — [source: categoricaldata.net]
- **LLM tagging accuracy is unproven** and needs review effort the founder may not have. — [source: arxiv.org/abs/2505.03473]

## Founder Answers (2026-10-16, after research)

- **Existing records link to Things**: pains, dreams, ideas and skills keep their own records and gain links to Things; they do not become Things themselves.
- **LLM tags are trusted above a confidence threshold**: high-confidence tags are used without review; low-confidence ones are queued for review. (The threshold and how it's checked are still to set.)
- **Timing: must not block v0.1.** v0.1 uses specific links (occupation ↔ skill, pain ↔ outside ID) shaped to fold into the layer later; the layer is built after launch.
- **Types as Things: stacked levels.** Things sit in Types; a Type can be described as a Thing only at the level above (as with universes in type theory). One browsable graph, but levels are never mixed (founder, after the summary below).

### What the formal traditions say about Types as Things (summary given to the founder)

- **Type theory (Martin-Löf):** types are terms of a *universe* (`Nat : Type₀`), so a type is a thing, but one level up. Universes are stacked (`Type₀ : Type₁ : …`) because letting `Type : Type` makes the system inconsistent (Girard's paradox, the type-theory form of Russell's paradox). — [general knowledge; ASSUMPTION until cited]
- **HoTT:** the same stacked universes, plus *univalence*: equivalent types count as equal. Relevance: two records for the same thing from different sources (Wikidata's and ESCO's "basketball") can be identified by an explicit equivalence, rather than a merge flag. Propositions are types whose terms are evidence, which fits "a tag is a claim with evidence". — [general knowledge; ASSUMPTION until cited]
- **Category theory:** categories are objects of a bigger category (Cat), again one size level up (small vs. large). In ologs, types are objects and things are elements of an instance functor I: C → Set. The *category of elements* (Grothendieck construction) turns an instance into one graph of things where every thing sits over its type: one graph to browse, with levels kept apart. — [Spivak & Kent 2012; general knowledge]
- **Common answer:** types can be treated as things, but only at the next level up, never on the same level. Wikidata's class/instance disarray is what happens when the levels are mixed.

## Gaps & Open Questions

- [NEEDS CLARIFICATION: Which sources seed Things (Wikidata, ESCO, It's own), and how are duplicates and merges handled?]
- [NEEDS CLARIFICATION: Do LLM tags apply only to It's content, or also to people's data after signup? Which model provider, under what privacy terms?]
- [NEEDS CLARIFICATION: How much formalism is wanted now: ologs as the design discipline (types, single-valued arrows, spans for many-to-many) without new tools, or a formal tool later?]
- Not yet read: the categorical multi-model data paper in the founder's corpus; Wolfram's EntityClass and Interpreter docs; SKOS and Topic Maps specs.

## Sources

- Repo: `packages/content/src/graph-schema.ts`, `docs/architecture/decisions.md`, `AGENTS.md`, `docs/spec/features.md`, `docs/spec/drafts/opportunity-tree.md`, `.specify/assessments/it-mvp/*` (policy: local read)
- Founder-supplied: Spivak & Kent (2012), Ologs, PLoS ONE 7(1): e24274, doi:10.1371/journal.pone.0024274 (local PDF read)
- https://arxiv.org/pdf/2411.15550 (host: arxiv.org, policy: search result, not fetched)
- https://arxiv.org/pdf/2511.04926 (host: arxiv.org, policy: search result, not fetched)
- https://www.semantic-web-journal.net/node/3480 (host: www.semantic-web-journal.net, policy: search result, not fetched)
- https://reference.wolfram.com/language/ref/EntityStore (host: reference.wolfram.com, policy: search result, not fetched)
- https://reference.wolfram.com/language/guide/EntityTypes.html (host: reference.wolfram.com, policy: search result, not fetched)
- https://categoricaldata.net/CQL (host: categoricaldata.net, policy: search result, not fetched)
- https://arxiv.org/abs/1903.10579 (host: arxiv.org, policy: search result, not fetched)
- https://arxiv.org/abs/2505.03473 (host: arxiv.org, policy: search result, not fetched)
- https://www.semantic-web-journal.net/content/integrating-wikidata-entities-narrative-graphs-using-large-language-models (host: www.semantic-web-journal.net, policy: search result, not fetched)
- https://snowflake.com/en/blog/engineering/graph-queries-postgres-apache-age (host: snowflake.com, policy: search result, not fetched)
- https://pgxn.org/tag/bfs/ (host: pgxn.org, policy: search result, not fetched)
