# /research: what It investigates today

- **Created:** 2026-10-20, for the `/research` page (atlas §3, §6, §8, §9).
- **Question:** what research threads does the repo actually show, what has been done on each, how mature is it, what is open, and what outside work does each build on?
- **Method:** read every file under `docs/research/`, `docs/architecture/decisions.md`, the two architecture source documents, the pain inventory and source maps, the possibility generator's README and evaluation, and the open OpenSpec changes. Outside sources were opened and checked by a research agent; each is cited by what it published. Nothing here implies that anyone cited endorses, reviewed or is connected to It.
- **Confidence:** high on what the repo contains; the status labels are suggestions for the founder to confirm.

Status labels are the atlas's: established result, replicated finding, machine-checked under stated assumptions, working hypothesis, speculative direction, open question, planned engineering.

## Summary

The repo shows five research threads tied to the product and two engineering investigations. Only one has measured results (the possibility generator's calibration and audit, rated by one person). None has formal or machine-checked work in the repo. **No mathematical, Lean or proof work exists in the repo**; if the founder has some, it lives elsewhere and is a question for them.

| # | Thread | Kind | Suggested status | Repo evidence |
| --- | --- | --- | --- | --- |
| 1 | Can an AI pipeline write dreams and fixes worth showing, and can model judges rank them? | Experiment | Working hypothesis (writing); open question (ranking) | `docs/research/possibilities/`, `tools/possibilities/` |
| 2 | Which pains are common and recognizable, and what evidence says so? | Empirical survey of sources | Working hypothesis (inventory provisionally approved) | `docs/spec/pains/`, `docs/source/MVP_Societal_Pains_Source_Registry.md`, `docs/source/it_mvp_personal_pain_source_map.md` |
| 3 | What kinds of action are there, and what evidence backs each claim a fix makes? | Question | Open question (kinds); planned engineering (evidence levels) | `docs/style/copy-style-guide.md`, `openspec/changes/fix-evidence-levels/` |
| 4 | How can anything in It link to shared Things without mixing up types and instances? | Design direction with formal grounding | Planned engineering (after launch); open question (LLM link precision) | `docs/research/thing-type-relation/`, decisions.md "Content graph" |
| 5 | Can It be built so the effort to change an idea scales with the idea, not with It's size? | Design hypothesis | Working hypothesis | `docs/source/It_Composable_Architecture_Research_and_MVP_Plan.txt` (belongs mainly on `/technology`) |
| 6 | Can a watercolor mark be drawn live, cheaply, on web and iOS? | Engineering investigation | Planned engineering, partly built | `docs/research/watercolor/`, decisions.md "Graphics" |
| 7 | How much can It learn about use without a stable identity before signup? | Engineering under a privacy rule | Planned engineering | AGENTS.md privacy invariants, `openspec/changes/visit-measurement/` |
| — | Mathematical or formal work (atlas: Lean artifacts, proof audits) | — | Unknown | Nothing in the repo. **Founder question.** |

## Thread 1: the possibility generator

**Question.** For each pain, can a pipeline of isolated AI agents write possibility cards (a dream with two to five fixes, built from real, opened examples) that the founder would show people? Can model judges pick the best ones?

**What's been done.**
- 25 runs across 17 pains (`docs/research/possibilities/runs/`), each with exemplars, cards, lint, three judges' judgments and a selection.
- A blind calibration: the founder rated 40 cards without knowing which came from the new generator. New cards: 24 of 24 Love. Old packet: 3 Love, 4 Keep, 9 Kill of 16. Founder time: 21 minutes. — `evaluations/generator-2026-10/evaluation.md`, `metrics.json`
- A fresh-pain audit: finalists 37 of 40 Love, 3 Keep; lower-ranked samples 14 of 16 Love, 1 Keep, 1 Kill. Judge top-3 agreement with the founder 8 of 8. 48 minutes. — same files
- Rough cost: about 12M agent tokens for 16 pains (estimate from agent usage reports). — `evaluation.md`

**Present view.**
- *Working hypothesis:* the pipeline writes drafts the founder rates highly. Founder: "don't overassume that because I 'loved' a lot of things that the pipeline is working perfectly now."
- *Open question:* whether three-judge ranking adds anything. Lower-ranked cards were loved about as often as finalists, so either the pool is uniformly strong or the founder's ratings reward something the judges don't rank on.

**Failed approaches (usable as the page's "one failed approach").**
- The earlier generator: 9 of 16 cards killed blind.
- Habit as a kind: of the 20 fixes labeled Habit in the audit, almost none were habits (7 were one-time settings, 6 schedules, 4 practices, 3 choices). This led to the current fix kinds in the copy guide.
- "Learn how…" fixes that only describe someone else's example; dreams written as actions instead of outcomes; topic drift.

**What's open.**
- One rater, who also wrote the rubric and style guide. No second rater, no agreement statistic.
- Structural measures (kind accuracy, outcome framing, on-topic rate, features per card) are proposed, not yet in the gate.
- Whether cheaper ranking (fewer judges) loses anything.

**Where to pick this up.** Rate the blind calibration set as a second rater (`calibration/calibration-page.html`); rerun the lint and tests (`python3 -m unittest discover -s tools/possibilities/tests`); propose a measure of judge discrimination.

## Thread 2: pain discovery

**Question.** Which personal and societal pains would people recognize as theirs, and what kind of evidence supports each?

**What's been done.**
- A pain inventory covering both pages, each pain mapped to outside frameworks with an evidence note, provisionally approved by the founder on 2026-10-16. — `docs/spec/pains/pain-inventory.md`, `.yaml`
- A societal source registry that keeps apart what people say bothers them, what researchers measure as harmful, what people want changed, and what institutions call a problem. — `MVP_Societal_Pains_Source_Registry.md`
- A personal source map from a September 2026 "adversarial coverage pass" of 80 source entries, separating source construct, plain-language gloss, prevalence evidence and product decision. — `it_mvp_personal_pain_source_map.md`

**Present view.** *Working hypothesis:* a small set of recognizable pains can sit on top of a much broader, sourced corpus, and frequency alone shouldn't decide what's shown.

**What's open.** No test yet of whether visitors recognize the pains as theirs (the visit funnel in `visit-measurement` will show only which pains are opened, by ID). Approved candidates still need dreams and fixes.

**Private pending review.** The founder's personal-pains hierarchy (`personal_pains_hierarchy_relations_v2.csv`, 774 pains in 24 areas) is referenced but not in the repo.

## Thread 3: kinds of fixes and their evidence

**Question.** What kinds of action can a fix be, and when a fix makes a claim, what evidence is it about?

**What's been done.** Nine kinds defined in the copy guide (Feature, Task, Schedule, Habit, Practice, Learn, Project, Group, New group), revised after the audit (founder, 2026-10-19). `fix-evidence-levels` proposes four levels (Strong, Some, Limited, Not tested yet) and separates three claims: the method works, this way helps this future, this It feature works.

**Present view.** *Open question* on kinds ("We need to figure this out", founder audit). *Planned engineering* for evidence levels, stored but not shown in v0.1.

**What's open.** Whether the kinds are distinct enough for raters to agree; how evidence levels are assigned and by whom.

## Thread 4: Thing / Type / Relation

**Question.** Can any record in It (pains, dreams, skills, occupations, roadmap items) link to shared Things without the class/instance confusion seen in large open knowledge bases?

**What's been done.** Prior-art research (Wikidata, Wolfram entity stores, ologs, CQL, PostgreSQL vs. Apache AGE, LLM entity linking) and a decision on 2026-10-16. — `docs/research/thing-type-relation/research.md`, decisions.md

**Present view.**
- *Planned engineering (after launch):* Things sit in Types; a Type can be described as a Thing only at the level above, never on the same level, as with universes in type theory. Every link is a claim with who made it, confidence and review state. Equivalent records from different sources are linked by a recorded equivalence, not merged.
- *Open question:* how precise LLM-proposed links are. The threshold starts high and is lowered only as founder audits of random samples show precision.

**What's open.** Which sources seed Things; whether LLM tagging ever touches people's own data (needs a separate privacy decision); how much formalism to adopt. The type-theory summary in the research note is marked "general knowledge; ASSUMPTION until cited", so the outside sources below are the first citations for it.

**Not read yet.** A categorical multi-model data paper in the founder's own research corpus (not in the repo).

## Thread 5: composable architecture

**Question.** Can It be built so the effort of changing an idea scales mainly with that idea's scope?

**What's been done.** A survey of documented extension patterns in eleven products (Retool, Bubble, Appsmith, ToolJet, Budibase, n8n, Backstage, LangGraph, Temporal, Storybook, plus Expo, tRPC, Turborepo). The repo's structure (domain and content packages free of UI imports, vendors behind It-owned boundaries) follows from it.

**Present view.** *Working hypothesis.* The document calls itself "a working proposal, not a repository audit", and its stack recommendation (tRPC, Drizzle) predates the current decisions (oRPC, Kysely), so it can't be cited as describing the repo.

**Where it belongs.** Mainly `/technology`. `/research` should link there in one line.

## Threads 6 and 7: engineering investigations

- **Watercolor dot.** Survey of watercolor simulation and pigment optics, licence checks on code that may not be copied, and a fidelity proof that found a WebGL path on web. *Planned engineering, partly built.* Strong engineering, weak fit for "what survives scrutiny"; suggested as one index row at most.
- **Measurement without identity.** A per-visit stage funnel with the visit ID in memory only, linked to an account only at signup. *Planned engineering.* The interesting research question (how much aggregate learning is possible without a stable anonymous identity) isn't written up anywhere yet.

## Should stay private pending review

- Any mathematical, Lean or formal work the founder has outside the repo, until the founder decides what is safe and ready (atlas §6: "Compilation of a proof is not the same as independent validation").
- Safety-sensitive mechanisms in the long-term composability and coordination aims (atlas §8 guardrail). The page can name the question and say detail is withheld.
- The founder's private research corpus and the 774-pain hierarchy: not in the repo; mention only with founder approval.
- Founder audit quotes: in a public repo already, but quoting them on a page is the founder's call.
- Nothing about any visitor's picks or ratings (privacy invariants).

## Outside work each thread builds on

Checked on 2026-10-20 against publisher metadata (Crossref for DOIs, arXiv abstract pages) or by opening the page, except where marked **unverified**. Each line says what the work published and why it's relevant; none implies the authors know of or support It.

**Thread 1 (generator and judges)**
- Zheng et al. (2023), "Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena", NeurIPS 2023 Datasets and Benchmarks. https://arxiv.org/abs/2306.05685 — Measured how often strong LLM judges agree with human preferences and described position, verbosity and self-enhancement biases. *Relevance:* the standard reference for checking model judges against people; It's check has one person.
- Wang et al. (2023), "Large Language Models are not Fair Evaluators", arXiv. https://arxiv.org/abs/2305.17926 — Showed an LLM judge's verdict can flip when candidate order is swapped, and proposed calibration fixes. *Relevance:* a specific bias the three-judge setup should be tested for.
- Cohen (1960), "A Coefficient of Agreement for Nominal Scales", Educational and Psychological Measurement 20(1). https://doi.org/10.1177/001316446002000104 — Defined kappa, chance-corrected agreement between two raters. *Relevance:* what a second rater would make computable.

**Thread 2 (pain discovery)**
- Gallup, "Most Important Problem" historical trends. https://news.gallup.com/poll/1675/most-important-problem.aspx — Long-running answers to the open question about the country's most important problem.
- Wlezien (2005), "On the salience of political issues: The problem with 'most important problem'", Electoral Studies 24(4), 555–579. https://doi.org/10.1016/j.electstud.2005.01.009 — Argued that answers mix how important an issue is with whether it's a problem. *Relevance:* the same distinction the societal source registry draws between kinds of evidence.
- Jennings and Wlezien (2011), "Distinguishing Between Most Important Problems and Issues?", Public Opinion Quarterly. https://doi.org/10.1093/poq/nfr025 — Compared "most important problem" with "most important issue" answers. (Metadata checked; paper not read.)
- **Unverified** (site blocked the check): OECD Better Life Index, https://www.oecdbetterlifeindex.org/, and the World Happiness Report, https://worldhappiness.report/, as wellbeing frameworks. Confirm before citing.

**Thread 4 (Thing / Type / Relation)**
- Spivak and Kent (2012), "Ologs: A Categorical Framework for Knowledge Representation", PLoS ONE 7(1): e24274. https://doi.org/10.1371/journal.pone.0024274 — Types as boxes, relations as labelled arrows, category theory as the basis.
- Vrandečić and Krötzsch (2014), "Wikidata: a free collaborative knowledgebase", CACM 57(10). https://doi.org/10.1145/2629489 — The design of Wikidata's items, properties and statements.
- Patel-Schneider and Doğan (2024), "Class Order Disorder in Wikidata and First Fixes", arXiv. https://arxiv.org/abs/2411.15550 — Measured with queries how often Wikidata breaks class-order rules (classes at several orders, mixed with instances) and made first fixes. *Relevance:* the failure stacked levels are meant to prevent.
- Zhao and Takeda (2025), "Diagnosing and Mitigating Semantic Inconsistencies in Wikidata's Classification Hierarchy", arXiv. https://arxiv.org/abs/2511.04926 — A validation method for taxonomic inconsistencies, which the authors link to loose editorial policy.
- The Univalent Foundations Program (2013), "Homotopy Type Theory: Univalent Foundations of Mathematics", IAS. https://arxiv.org/abs/1308.0729 — A type theory with a cumulative hierarchy of universes, each a type in the next. *Relevance:* the first citation for the "stacked levels" rule, which the thread's research note had marked as an assumption.

**Thread 5 (composable architecture; mainly for /technology)**
- Parnas (1972), "On the criteria to be used in decomposing systems into modules", CACM 15(12). https://doi.org/10.1145/361598.361623 — Modules should each hide a design decision likely to change.
- Spivak (2013), "The operad of wiring diagrams", arXiv. https://arxiv.org/abs/1305.0297 — A mathematical account of how systems with typed inputs and outputs plug together and nest.

**Thread 6 (watercolor)**
- Curtis, Anderson, Seims, Fleischer and Salesin (1997), "Computer-generated watercolor", SIGGRAPH '97. https://doi.org/10.1145/258734.258896 — Fluid simulation of water and pigment on paper, composited with the Kubelka–Munk model.
- Haase and Meyer (1992), "Modeling pigmented materials for realistic image synthesis", ACM TOG 11(4). https://doi.org/10.1145/146443.146452 — Kubelka–Munk pigment mixing in computer graphics.
- **Unverified** (no stable URL): Kubelka and Munk (1931), "Ein Beitrag zur Optik der Farbanstriche", Zeitschrift für technische Physik 12, 593–601.

**Thread 7 (measurement without identity)**
- Sweeney (2002), "k-anonymity: a model for protecting privacy", IJUFKS 10(5). https://doi.org/10.1142/S0218488502001648 — Each released record must be indistinguishable from at least k−1 others. *Relevance:* one basis for the atlas's "threshold-protected aggregate counts".
- Dwork, McSherry, Nissim and Smith (2006), "Calibrating Noise to Sensitivity in Private Data Analysis", TCC 2006. https://doi.org/10.1007/11681878_14 — The Laplace mechanism and the start of differential privacy.

**Formal work (if the founder has any; the atlas names Lean, Terence Tao and AI 2027)**
- The mathlib Community (2020), "The Lean mathematical library", CPP 2020. https://doi.org/10.1145/3372885.3373824 — The community library of formalized mathematics for Lean.
- de Moura and Ullrich (2021), "The Lean 4 Theorem Prover and Programming Language", CADE 28. https://doi.org/10.1007/978-3-030-79876-5_37 — Lean 4 as prover and programming language.
- Bolan, Breitner, Brox, Carlini, Carneiro et al., including Tao (2025), "The Equational Theories Project: Advancing Collaborative Mathematical Research at Scale", arXiv. https://arxiv.org/abs/2512.07087 — A large public collaboration that settled implications among equational laws on magmas, with every proof checked in Lean. *Relevance:* a worked example of the atlas's "living loop" (publish, invite, check, record). The figure of about 22 million implications came from a search snippet; read the abstract before quoting it.
- Kokotajlo, Alexander, Larsen, Lifland and Dean (2025), "AI 2027". https://ai-2027.com/ — A speculative scenario of AI development through 2027 with two endings, presented by its authors as a best guess for debate. *Relevance:* belongs on /risks or /future rather than here.

## Repo sources

- `docs/research/possibilities/evaluations/generator-2026-10/evaluation.md`, `metrics.json`; `docs/research/possibilities/runs/`; `tools/possibilities/README.md`
- `docs/spec/pains/pain-inventory.md`; `docs/source/MVP_Societal_Pains_Source_Registry.md`; `docs/source/it_mvp_personal_pain_source_map.md`
- `docs/style/copy-style-guide.md`; `openspec/changes/fix-evidence-levels/proposal.md`
- `docs/research/thing-type-relation/research.md`; `docs/architecture/decisions.md`
- `docs/source/It_Composable_Architecture_Research_and_MVP_Plan.txt`; `docs/source/IT_MVP_IMPLEMENTATION_ARCHITECTURE_v0.2.md` (§1: "Do not import long-run mathematical machinery merely because the research program anticipates it")
- `docs/research/watercolor/research.md`; `openspec/changes/visit-measurement/`
- `docs/source/We_Are_It_Website_Page_Atlas_v0.2_2026-10-16.md`
