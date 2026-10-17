# Decision: Thing / Type / Relation layer

- **Slug**: thing-type-relation
- **Decided**: 2026-10-16
- **Verdict**: go (Phase 1 now as v0.1 guardrails; Phase 2 specified after v0.1 launches)
- **Artifacts reviewed**: intake.md | research.md | problem.md | concept.md

## Scorecard

| Criterion | Rating | Justification |
|-----------|--------|---------------|
| Problem validity | strong | The problem is visible in the repo today: the pain inventory holds outside mappings in six different formats, the Help page adds ESCO's many-to-many occupation–skill links, and "soon" features (matching, starting from a dream) need cross-cutting connections (problem.md). |
| Evidence strength | adequate | Prior art is well documented (Wikidata's class/instance disarray studies, Wolfram's entity stores, ologs, functorial data migration). Demand is the founder's and internal rather than from end users, which suits an infrastructure decision. LLM tagging precision is unproven (research.md). |
| Value vs. inaction | adequate | Nothing breaks in the short term without it, but each new connection needs one-off structure and a later migration grows with the data. Phase 1 is nearly free, which makes the value clear for the guardrails; Phase 2's value grows as content and members grow. |
| Feasibility / appetite | strong | Phase 1 is under half a day inside v0.1; Phase 2 is a few weeks on the existing PostgreSQL stack, with no new tools (concept.md). |
| Strategic fit | strong | Follows the founder's answers (stacked levels, link-not-convert, threshold, not blocking v0.1), the constitution (honest status: links are claims with provenance; privacy by default) and the stack decisions. |
| Risk posture | adequate | Main risks are named with mitigations: level mixing (stacked levels plus an automatic check), LLM precision (threshold starts high, regular audits), Type and Relation sprawl (small curated lists, each Relation in the olog), people's data (excluded pending a privacy decision). Traversal performance is unmeasured. |

## Verdict & Rationale

**Go.** The problem is concrete and already costing effort (six mapping formats, ESCO arriving), the evidence on how such layers fail is strong enough to design around (keep levels separate; treat automated links as claims), and Option B splits the work so v0.1 pays almost nothing now while keeping the full layer possible. The founder's level rule rules out Option C (Wikidata as the layer), and Option A alone leaves the problem in place. Evidence strength is adequate, not strong: LLM tagging precision and PostgreSQL traversal at depth are unproven and must be measured in Phase 2.

## If needs-clarification

Not applicable.

## If go — Handoff to `/speckit-specify`

**Phase 1: fold into the v0.1 specs (001–006) now, not a separate spec.**
- Every record people or the founder can see (pain, dream, idea, skill, occupation, roadmap item) has a stable ID that never changes once published.
- Outside references are stored in one consistent shape (which list, its ID, its label, who added it, when). The pain inventory's six formats convert into it.
- Help page answers (background, skills) are stored as references to ESCO entries, not free text.
- Content is versioned, and picks keep their content version (already in spec 001).

**Phase 2: its own spec after v0.1 launches.**
- **Problem**: It's records connect only through one-off links and inconsistent outside mappings, so the same subject isn't recognised across pains, ideas, skills and interests, and every new connection needs new structure.
- **Chosen approach**: Option B, Phase 2:
  - a curated Type list, with Types described as Things only at the level above;
  - Things seeded from what It uses (pain frameworks, ESCO, mapped Wikidata items);
  - a short list of named Relations, with many-to-many connections as their own records;
  - equivalences rather than merges;
  - every link a claim with source, confidence and review state, where LLM links above a starting-high threshold are used and the rest queued, with a regular founder audit sample;
  - a written olog as the design document, with the data checked against it.
- **In scope / out of scope**: In: content tagging, Types, Things, Relations, equivalences, the claim record, the audit loop, the olog. Out: turning existing records into Things; tagging people's own data (pending a privacy decision); wholesale Wikidata or ESCO mirrors; a graph database, extension or formal tool without a decision record; inference; public views of who is linked to what.
- **Success metrics**: share of published content linked to at least one Thing (baseline 0%); precision of unreviewed links on audit samples; review queue size and wait; duplicate Things per sample; zero level violations; new connection kinds need only a new Relation.
- **Carried-forward open questions**:
  - Which sources seed Things, and who confirms equivalences?
  - The starting threshold value and the audit sample size and frequency.
  - Whether, and how, people's own data may be tagged after signup, and with which LLM provider (needs a privacy decision record).
  - How formal: the olog as a design document only, or a formal model checked against the data.
  - Whether PostgreSQL alone handles the link-following depth needed.

**Follow-ups outside this assessment:**
- Record the founder's Thing-layer decisions (stacked levels; link, don't convert; confidence threshold; must not block v0.1) in `docs/architecture/decisions.md`.
- Add Phase 1 items to specs 001–006 as they are written.
