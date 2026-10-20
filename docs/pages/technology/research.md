# /technology: research

Status: research notes for founder review, prepared 2026-10-20. Not page copy.
Sources opened on 2026-10-20 unless marked otherwise.

Citing a work here does not mean its authors endorse It or have any link to It. When the page cites them, it should say what they published and nothing more.

## Summary

- **Composition has a mathematics.** Category theory gives precise meanings for "combine two systems and get a system" (ologs, functorial data migration, operads of wiring diagrams). These are published, peer-reviewed results. They support the aims *fully compositional building blocks* and *combining heterogeneous information*.
- **The same literature names the catch.** Fong and Spivak treat the case where a combined system behaves in ways the parts did not show as the central topic of their first chapter, under the name "generative effects". Telecom feature interaction and contract-based design are long records of how composition breaks in practice.
- **Composing permissions safely is a solved design pattern, not a solved problem.** Capabilities (1966 onward), Miller's thesis on robust composition, Macaroons, UCAN and ZCAP give working ways to delegate and narrow authority. Several of these are drafts or community specs, not ratified standards.
- **Interoperability standards exist and are mature in places.** OpenAPI, JSON Schema, RDF, ActivityPub and Verifiable Credentials 2.0 are stable. Solid is a Community Group draft, not a W3C standard. MCP is a fast-moving vendor-originated protocol. They support *interoperable, swappable providers*.
- **Automatically finding a path to a goal is provably hard in general.** Plan existence in propositional STRIPS is PSPACE-complete (Bylander 1994). Richer planning languages can be undecidable (Erol, Nau, Subrahmanian 1995). Practical systems lean on curated recipes (HTN planning). This bounds the aim *discovering new paths to goals*.
- **Automatic service composition was tried, with mixed results.** OWL-S (2004) aimed at automatic discovery, invocation and composition. A 2003 panel talk by McIlraith listed adoption obstacles that were mostly about incentives and trust, not algorithms.
- **Distributed systems have hard limits.** FLP (1985) and CAP (conjectured 2000, proved 2002) are established impossibility results. Communication complexity (Yao 1979) shows that joint computation has a cost in bits exchanged. These support the aim *respecting practical limits*.
- **Open:** whether any of this composes at the scale of people's goals, commitments and lives. No source below claims that, and the page should not imply it.

## 1. Composition and category theory

**Spivak and Kent, "Ologs: A Categorical Framework for Knowledge Representation" (PLOS ONE, 2012).** An olog (ontology log) is a category-theoretic model for representing knowledge. Its mathematical basis lets ologs be specified and compared rigorously, and an olog can also serve as a database schema, while being meant to be easier for people to write than database definition languages. [doi:10.1371/journal.pone.0024274](https://doi.org/10.1371/journal.pone.0024274)
Relevance: the repo already uses ologs as design discipline. This is the citation for that practice.
Limit: ologs give a precise vocabulary, not automatic correctness. They say what types and relations mean, not that a model of the world is right.

**Spivak, "Functorial Data Migration" (arXiv 1009.1166, v4 2013).** Models a database schema as a small category and an instance as a set-valued functor. A mapping between schemas induces three data migration functors that move data between schemas in canonical ways, covering projections, unions and joins. [arXiv:1009.1166](https://arxiv.org/abs/1009.1166). The arXiv page lists no journal reference. DOI 10.1016/j.ic.2012.05.001 resolves to an *Information and Computation* article. I did not open the journal landing page (publisher blocked access).
Relevance: a mathematical account of moving information between differently shaped models. This supports the aim *combining heterogeneous information*.
Limit: this is about structured data with declared schemas. It does not cover informal or contested meaning.

**CQL (categoricaldata.net; GitHub CategoricalData/CQL).** An open-source tool and IDE for data tasks based on category theory. The site says it "is being commercialized by Conexus AI". The repository README states: "BSD 3 license for non-commercial use and exploratory/evaluative commercial use; contact us for other licenses." [categoricaldata.net](https://www.categoricaldata.net/), [github.com/CategoricalData/CQL](https://github.com/CategoricalData/CQL)
Relevance: evidence that functorial data migration has a working implementation.
Limit: under the stated terms, commercial use beyond evaluation needs a separate licence. That matters if It ever ships or depends on CQL. I did not read the LICENSE file itself, only the README statement.

**Fong and Spivak, "Seven Sketches in Compositionality: An Invitation to Applied Category Theory" (arXiv 1803.05316, v3 2018).** A textbook that pairs applications (databases, circuits, dynamical systems and others) with categorical structures. Chapter 1 describes compositionality as cases where "systems or relationships can be combined to form new systems or relationships". It also introduces "generative effects": the less structure an observation preserves, the more surprises appear when systems are combined. [arXiv:1803.05316](https://arxiv.org/abs/1803.05316)
Relevance: a precise statement of what "genuinely compose" can mean, and an honest name for when it fails.
Limit: it is an introductory book with simplified examples, by the authors' own description. It is not evidence that any software system composes.

**Spivak, "The operad of wiring diagrams: formalizing a graphical language for databases, recursion, and plug-and-play circuits" (arXiv 1305.0297, 2013).** Formalizes nesting wiring diagrams as an operad and applies it to relational database queries, circuits, plug-and-play devices and recursion. [arXiv:1305.0297](https://arxiv.org/abs/1305.0297)
Relevance: a formal model for "boxes with ports, wired together, nested inside bigger boxes", which is what composable building blocks look like.
Limit: a mathematical framework. It does not say which real components fit the model.

**Vagner, Spivak and Lerman, "Algebras of Open Dynamical Systems on the Operad of Wiring Diagrams" (arXiv 1408.1598, v2 2015).** Gives wiring diagrams a meaning as systems of differential equations, so a wired system's behavior follows from its parts and the wiring. [arXiv:1408.1598](https://arxiv.org/abs/1408.1598)
Relevance and limit: composition is exact here, but only for systems that fit the formalism.

**Caveat: composition fails in practice.**

- **Calder, Kolberg, Magill and Reiff-Marganiec, "Feature interaction: a critical review and considered forecast" (Computer Networks 41(1), 2003, pp. 115–141).** A review of research on feature interactions in telecom services: features that work alone but conflict when combined. It covers software engineering, formal and online detection approaches. [Glasgow eprints record](https://eprints.gla.ac.uk/2874) (abstract opened; full text not read).
  Relevance: the standard record of independently built features interfering once combined.
  Limit: telecom-specific. It shows the problem is persistent, not that it is unsolvable.
- **Jones, "Tentative Steps Toward a Development Method for Interfering Programs" (ACM TOPLAS 5(4), 1983, pp. 596–619).** Adds "rely-conditions" (what a component may assume about its environment) and "guarantee-conditions" (what it promises) to specifications of programs that run in parallel and can interfere. [doi:10.1145/69575.69577](https://doi.org/10.1145/69575.69577) (opened a course-hosted copy of the printed paper).
  Relevance: the origin of assume/guarantee thinking. To compose safely, each part must state what it relies on and what it guarantees.
  Limit: designed for program verification. The search results point to Jones's 1981 thesis as the earliest form of the idea.
- **Benveniste et al., "Contracts for System Design" (Foundations and Trends in EDA 12(2–3), 2018, pp. 124–400).** A monograph that builds a general mathematical theory of contracts for verification, refinement and synthesis, with automotive (AUTOSAR) and requirements examples. [doi:10.1561/1000000053](https://doi.org/10.1561/1000000053) (opened the ISTA repository record; publisher page blocked).
  Relevance: composition with explicit contracts is the mainstream engineering answer to feature interaction.
  Limit: I did not open the full text. The record I read does not name assume/guarantee contracts explicitly.

## 2. Capability security and permissions

**Dennis and Van Horn, "Programming Semantics for Multiprogrammed Computations" (CACM 9(3), 1966, pp. 143–155).** Defines meta-instructions for multiprogrammed systems. Each computation's "sphere of protection" is given by a list of capabilities (a C-list). [MIT Project MAC TR-23 copy](https://ftp.mirrorservice.org/sites/www.bitsavers.org/pdf/mit/lcs/tr/MIT-LCS-TR-0023.pdf) (opened the technical report; the ACM page was blocked). The CACM volume and pages come from search records.
Relevance: the origin of "capability" as an unforgeable token of authority. That is the meaning the page should use.
Limit: a 1966 operating-system design, not a web or social one.

**Saltzer and Schroeder, "The Protection of Information in Computer Systems" (1975; earlier version CACM 17(7), 1974).** Sets out design principles, including least privilege: every program and user should "operate using the least set of privileges necessary to complete the job". [UVA-hosted copy](https://www.cs.virginia.edu/~evans/cs551/saltzer/). The Proceedings of the IEEE venue comes from secondary sources. The page I opened lists the 1973 and 1974 versions and a 1975 revision.
Relevance: the principle behind giving each building block only the permissions it needs.
Limit: a principle, not a mechanism.

**Miller, "Robust Composition: Towards a Unified Approach to Access Control and Concurrency Control" (PhD dissertation, Johns Hopkins University, 2006).** The abstract says separately written programs, once composed, "may instead destructively interfere in unanticipated ways", and that this limits the scale of systems we can compose. It presents a framework, embodied in the E language and the CapDesk desktop, for allowing intended cooperation while minimizing that interference, among possibly malicious components on possibly malicious machines. [Agoric-hosted PDF](https://papers.agoric.com/assets/pdf/papers/robust-composition.pdf)
Relevance: the closest prior work to It's question, and its title is about composition. It treats authority and composition as one problem.
Limit: a research language and prototype desktop. E itself did not become widely used, and the thesis does not claim it did.

**Birgisson, Politz, Erlingsson, Taly, Vrable and Lentczner, "Macaroons: Cookies with Contextual Caveats for Decentralized Authorization in the Cloud" (NDSS 2014).** Bearer credentials built on chained HMACs, about as cheap as cookies, that allow decentralized delegation and add caveats limiting how, by whom and in what context authority is used. [NDSS page](https://ndss-symposium.org/?p=2028), doi:10.14722/ndss.2014.23212
Relevance: practical evidence that delegated, narrowed permissions can be cheap.
Limit: a bearer token. Whoever holds it can use it within its caveats.

**UCAN (User Controlled Authorization Network), spec v1.0.0 (github.com/ucan-wg/spec).** A decentralized authorization scheme. Agents identified by DIDs delegate capabilities in signed chains, each delegation may only keep or narrow authority, and chains can be verified offline. [github.com/ucan-wg/spec](https://github.com/ucan-wg/spec)
Relevance: a current, concrete design for composing permissions across services without a central server.
Limit: the spec itself says chains do not provide confinement, and revocation is a last resort. It is a community spec, not a standards-body standard.

**Authorization Capabilities (ZCAP), W3C CCG draft v0.4.0.** Defines capability documents expressed as Linked Data and signed with Linked Data Proofs, with delegation chains, caveats and invocation over HTTP. [w3c-ccg.github.io/zcap-spec](https://w3c-ccg.github.io/zcap-spec/v0.4.0/)
Relevance: an alternative to UCAN in the Linked Data world.
Limit: by its own status note, a draft being prepared for consideration as a Credentials Community Group work item. It is not a W3C standard. No date is given (v0.3 was 2022).

## 3. Interoperability standards and portable data

**OpenAPI Specification 3.2.1 (spec.openapis.org, dated 10 September 2026).** A language-agnostic way to describe HTTP APIs so that people and programs can understand a service without its source code. [spec.openapis.org/oas/latest](https://spec.openapis.org/oas/latest.html)
Relevance: the common way to describe a provider's interface so it can be swapped.
Limit: it describes the shape of calls, not their meaning or side effects.

**JSON Schema 2020-12 (json-schema.org).** The current release (previous: 2019-09). The specification page does not state its publication track. [json-schema.org/specification](https://json-schema.org/specification)
Relevance: validating data at boundaries. It already underlies Zod-style validation thinking.
Limit: structure only, no semantics.

**RDF 1.1 Concepts and Abstract Syntax (W3C Recommendation, 25 February 2014).** Represents information as subject–predicate–object triples in graphs. [w3.org/TR/rdf11-concepts](https://www.w3.org/TR/rdf11-concepts/)
Relevance: a standard model for merging information from different sources.
Limit: the 1.1 page does not mention RDF 1.2. I did not check RDF 1.2's status.

**schema.org.** A community project, founded by Google, Microsoft, Yahoo and Yandex, to "create, maintain, and promote schemas for structured data on the Internet". [schema.org/docs/about.html](https://schema.org/docs/about.html)
Relevance: a shared vocabulary that could label goals, actions and events.
Limit: shaped by search-engine needs. The about page gives no founding date.

**Solid Protocol v0.11.0 (12 May 2024).** Links several specifications that let apps reach data stored elsewhere (pods) with permissions the user grants, which keeps apps separate from data. Status: Draft Community Group Report of the W3C Solid Community Group. It is not a W3C Standard and not on the Standards Track. [solidproject.org/TR/protocol](https://solidproject.org/TR/protocol)
Relevance: the clearest published design for "your data stays yours, apps come to it".
Limit: draft status. The page must not call it a W3C standard.

**ActivityPub (W3C Recommendation, 23 January 2018; editors Christine Lemmer-Webber and Jessica Tallon).** A decentralized social networking protocol built on ActivityStreams 2.0, covering client-to-server and server-to-server federation. [w3.org/TR/activitypub](https://www.w3.org/TR/activitypub/)
Relevance: a ratified precedent for federated sharing between independent providers.
Limit: designed for social posts, not for commitments or permissions.

**Model Context Protocol, specification version 2026-07-28 (modelcontextprotocol.io).** JSON-RPC 2.0 messages between hosts, clients and servers. Servers offer resources, prompts and tools, and clients may offer elicitation. The spec says hosts must get explicit user consent before invoking any tool, that tool descriptions should be treated as untrusted unless the server is trusted, and that MCP cannot enforce these principles at the protocol level. [modelcontextprotocol.io/specification/latest](https://modelcontextprotocol.io/specification/latest)
Relevance: today's most direct interface for AI agents to use tools and data.
Limit: by its own text, security depends on implementers. The spec changes often, so cite the version date.

**Verifiable Credentials Data Model v2.0 (W3C Recommendation, 15 May 2025).** An extensible data model for tamper-evident credentials among issuers, holders and verifiers. [w3.org/TR/vc-data-model-2.0](https://www.w3.org/TR/vc-data-model-2.0/)
Relevance: a ratified way to carry claims (such as "has done X") between providers.
Limit: a data model. Trust in issuers is outside its scope.

**GDPR Article 20, right to data portability (Regulation (EU) 2016/679).** (not opened; unverified). EUR-Lex returned empty pages to my tools. Check the text before citing.

**Data Transfer Initiative (dtinit.org).** Describes itself as a nonprofit "dedicated to empowering technology users to transfer data from one service to another". It runs the open-source Data Transfer Project, which moves data directly between platforms through existing APIs. [dtinit.org](https://dtinit.org/)
Relevance: a working precedent for provider-to-provider portability.
Limit: the site does not say who founded it. Scope is data export, not live composition.

## 4. Discovering paths: planning and composition search

**Bylander, "The Computational Complexity of Propositional STRIPS Planning" (Artificial Intelligence 69, 1994).** In general it is PSPACE-complete to decide whether a planning instance has any solution. Very severe restrictions on operators and formulas are needed even to reach NP-completeness or polynomial time. [doi:10.1016/0004-3702(94)90081-7](https://doi.org/10.1016/0004-3702(94)90081-7) (opened a university-hosted preprint; publisher page blocked)
Relevance: an established bound. Fully automatic path-finding over arbitrary actions cannot be fast in general.
Limit: worst-case complexity. Many real instances are easy, and the result does not say which.

**Erol, Nau and Subrahmanian, "Complexity, decidability and undecidability results for domain-independent planning" (Artificial Intelligence 76, 1995, pp. 75–88).** Shows conditions under which planning is decidable or undecidable, and how complexity depends on function symbols, delete lists, negative preconditions, conditional effects and whether operators are fixed in advance. [UMD-hosted PDF](https://www.cs.umd.edu/~nau/papers/erol1995complexity.pdf)
Relevance: expressive action languages can make the question unanswerable, not just slow.
Limit: theory about planning languages, not about human goals.

**Nau et al., "SHOP2: An HTN Planning System" (JAIR 20, 2003).** Describes a hierarchical task network planner that received an award for distinguished performance in the 2002 International Planning Competition. [jair.org](https://www.jair.org/index.php/jair/article/view/10362)
Relevance: HTN planning builds plans by breaking a goal down through curated methods ("recipes"). That is the practical model for It's ways.
Limit: performance depends on the quality of hand-written methods. It finds paths within the recipes, not new ones outside them.

**Martin (ed.) et al., "OWL-S: Semantic Markup for Web Services" (W3C Member Submission, 22 November 2004).** Markup meant to enable automatic discovery, invocation, composition and interoperation of web services, describing each service's inputs, outputs, preconditions and effects. W3C states that publication "indicates no endorsement of its content". [w3.org/submissions/OWL-S](https://www.w3.org/submissions/OWL-S/)
Relevance: the most direct earlier attempt at "automatically compose services to reach a goal".
Limit: a member submission, never a W3C standard.

**McIlraith, "Semantic Web Services" panel slides (WWW12, 23 May 2003).** Lists obstacles. The benefits depend on wide adoption of semantic descriptions, providers have little business case to write them, the approach undercuts advertising-based sites, tools are few, and automation may reduce trust. [mit.edu-hosted PDF](https://www.mit.edu/~bgrosof/paps/talk-mcilraith-sws-panel-www2003.pdf)
Relevance: a first-hand record that the barriers were incentives, effort and trust, not just algorithms.
Limit: panel slides, not a peer-reviewed retrospective. I found no primary retrospective on why semantic web services stalled.

## 5. Practical limits: time, memory, communication, information

**Brewer, "Towards Robust Distributed Systems" (PODC keynote, 19 July 2000).** The CAP slide states that a shared-data system can have at most two of consistency, availability and tolerance to network partitions. [Berkeley-hosted slides](https://people.eecs.berkeley.edu/~brewer/cs262b-2004/PODC-keynote.pdf)
Relevance: the origin of the trade-off any distributed set of providers faces.
Limit: a conjecture in a talk, proved later under specific definitions.

**Gilbert and Lynch, "Brewer's Conjecture and the Feasibility of Consistent, Available, Partition-Tolerant Web Services" (ACM SIGACT News 33(2), 2002).** Proves that achieving all three is impossible in the asynchronous network model, and discusses solutions in the partially synchronous model. [author-hosted PDF](https://www.comp.nus.edu.sg/~gilbert/pubs/BrewersConjecture-SigAct.pdf), doi:10.1145/564585.564601
Relevance: an established result. Swappable, distributed providers cannot all be always consistent and always available.
Limit: the proof uses formal definitions that are narrower than everyday usage.

**Fischer, Lynch and Paterson, "Impossibility of Distributed Consensus with One Faulty Process" (JACM 32(2), April 1985, pp. 374–382).** In an asynchronous system, every consensus protocol may fail to terminate, even with only one faulty process. Synchronous solutions are known. [MIT-hosted PDF](https://groups.csail.mit.edu/tds/papers/Lynch/jacm85.pdf)
Relevance: agreement among independent parties has a hard limit when timing is unknown.
Limit: about deterministic protocols in fully asynchronous models. Practical systems work around it with timeouts or randomization.

**Yao, "Some Complexity Questions Related to Distributive Computing" (STOC 1979, pp. 209–213).** (not opened; unverified). Index records describe two parties, each holding an input, computing a function of both by exchanging bits, and ask for the minimum number of bits. This is the origin of communication complexity.
Relevance: combining information held by different people or providers has a measurable cost.
Limit: check the ACM DL page before citing.

## 6. Precedents

- **Unix: McIlroy, Pinson and Tague, "UNIX Time-Sharing System: Foreword" (Bell System Technical Journal 57(6), 1978, pp. 1899–1904).** States the maxims "Make each program do one thing well" and "Expect the output of every program to become the input to another, as yet unknown, program". [archive.org](https://archive.org/details/bstj57-6-1899) (opened the scanned text). This is the best-known precedent for small parts with a shared interface (text streams) composing into things nobody planned. McIlroy's 1964 pipe memo was not opened; the Bell Labs page refused access.
- **ActivityPub, OpenAPI and MCP (above)** are present-day precedents for ecosystems of independent providers sharing one interface.

## What the repo implements versus what is conjecture

Checked against the repo on 2026-10-20 (master at `8223eef`). "Decided" means recorded in `docs/architecture/decisions.md` but not found in code.

| Aim | What exists | Where | Status |
| --- | --- | --- | --- |
| Separable parts in It's own code | A modular monolith in pnpm workspaces: `packages/content` (Zod content schemas, no Expo or UI imports), `packages/domain` (pure selection and ranking logic), `packages/database` (Kysely, migrations), `packages/api` (oRPC contract kept apart from the router). I found no automated import-boundary check; the rule lives in `AGENTS.md`. | `packages/*`, `AGENTS.md` | Implemented; boundary enforcement not automated |
| A typed content graph | Domains, pains, futures (dreams), first actions and ways (fixes), with link lists (`painDreamLinks`, `fixDreamLinks`, `actionPainLinks`), validated with Zod and published as versions with rollback. | `packages/content/src/graph-schema.ts`, `docs/architecture/cms.md` | Implemented |
| Provenance on records | Each record can carry source, locator, evidence type, rights (CC0 or CC BY-SA) and review status. | `contentProvenanceSchema` in `graph-schema.ts` | Implemented |
| Combining pieces for a person | `rankWays` lists each way once across a person's chosen futures, most-connected first. This is a count over hand-made links, not a search for paths. | `packages/domain/src/onboarding.ts` | Implemented, deliberately simple |
| Swappable providers | Payments: an It-owned ledger with Stripe and RevenueCat adapters, verified and deduplicated webhooks. Email: SMTP through nodemailer, so the provider is configuration. Database: PostgreSQL through a connection string (Neon today). Images: Cloudflare R2 behind an asset boundary is decided, not found in code. | `docs/architecture/payments.md`, `apps/api-server/src/*-support.ts`, `apps/api-server/src/auth.ts` | Implemented for payments and email; images decided |
| Shared subjects across records | Thing / Type / Relation layer: stacked levels, links as claims with confidence, recorded equivalences. After launch. | `decisions.md`, `docs/research/thing-type-relation/` | Decided; planned engineering |
| Skills as references | Help answers stored as ESCO references. | `decisions.md` (Thing / Type / Relation, v0.1 guardrails) | Decided |
| Permissions that travel with data | Privacy rules are product rules (pre-signup picks stay on the device; contributions go only to a founder review queue). No permission model for algorithms or building blocks. | `AGENTS.md` privacy invariants | Not started; open question |
| People, resources, commitments as blocks | No model of offers, needs, resources or commitments. | none | Speculative direction |
| Discovering paths | None; ways are curated by hand (and drafted by the possibility generator for review). | `tools/possibilities/` | Speculative direction |
| Interoperability with outside software for people | No public API for others, no data export format. | none | Speculative direction |
| Time, memory, failure measurements | Nothing measured. | none | Nothing to report |

The source proposal `docs/source/It_Composable_Architecture_Research_and_MVP_Plan.txt` sets out a five-part replaceability experiment for the onboarding flow (swap a layout, swap a proposal algorithm, run state tests with no database, swap storage, build after each change). The packages above cover parts of it; nobody has run it as a recorded test, so the page should not claim it passed.

## Status labels this suggests

For the external knowledge only, not for It.

| Aim | Label | Basis |
|---|---|---|
| Fully compositional building blocks | Established result (the maths, for systems that fit the formalism); open question (software at large) | Operads and wiring diagrams give exact composition for systems that fit the formalism. Feature interaction shows real features break it. |
| Combining heterogeneous information | Established result (structured data with schemas); open question (informal meaning) | Functorial data migration, RDF |
| Combining skills, software and resources | Open question | OpenAPI, JSON Schema, MCP exist; composing them by meaning is not solved |
| Combining commitments | Working hypothesis | Rely/guarantee and contract theories give a model; no source applies it to personal commitments |
| Combining permissions | Established result (who may act, as a design pattern); open question (what a combined result may reveal) | Capabilities since 1966, Miller 2006, Macaroons, UCAN, ZCAP |
| Discovering new paths to goals | Established result (general case is PSPACE-complete or worse); open question (useful special cases) | Bylander 1994; Erol et al. 1995; HTN planning works within curated recipes |
| Interoperable, swappable providers | Replicated finding (it works where interfaces are standard: Unix, ActivityPub, DTP); open question beyond that | McIlraith 2003 obstacles were incentives and trust |
| Evolvable capabilities | Speculative direction | No source above shows capabilities evolving safely in open systems |
| Respecting limits of time, memory, communication, information | Established result | FLP 1985, CAP 2002, Bylander 1994; Yao 1979 (unverified) |
| Eventual large-scale use | Speculative direction | No source supports a scale claim; OWL-S is a caution |

## Sources

1. Spivak, D. I., and Kent, R. E. "Ologs: A Categorical Framework for Knowledge Representation." PLOS ONE 7(1), 2012. https://doi.org/10.1371/journal.pone.0024274. Opened.
2. Spivak, D. I. "Functorial Data Migration." arXiv:1009.1166, v4 2013. https://arxiv.org/abs/1009.1166. Opened. Journal version (Information and Computation, 2012, doi:10.1016/j.ic.2012.05.001): DOI resolves, landing page not opened.
3. CQL. https://www.categoricaldata.net/ and https://github.com/CategoricalData/CQL. Opened (README licence statement; LICENSE file not read).
4. Fong, B., and Spivak, D. I. "Seven Sketches in Compositionality: An Invitation to Applied Category Theory." arXiv:1803.05316, v3 2018. https://arxiv.org/abs/1803.05316. Opened (PDF chapter 1).
5. Spivak, D. I. "The operad of wiring diagrams." arXiv:1305.0297, 2013. https://arxiv.org/abs/1305.0297. Opened (abstract).
6. Vagner, D., Spivak, D. I., and Lerman, E. "Algebras of Open Dynamical Systems on the Operad of Wiring Diagrams." arXiv:1408.1598, 2015. https://arxiv.org/abs/1408.1598. Opened (abstract).
7. Calder, M., Kolberg, M., Magill, E. H., and Reiff-Marganiec, S. "Feature interaction: a critical review and considered forecast." Computer Networks 41(1):115–141, 2003. https://eprints.gla.ac.uk/2874. Opened (record and abstract).
8. Jones, C. B. "Tentative Steps Toward a Development Method for Interfering Programs." ACM TOPLAS 5(4):596–619, 1983. https://doi.org/10.1145/69575.69577. Opened (hosted copy of printed paper).
9. Benveniste, A., et al. "Contracts for System Design." Foundations and Trends in Electronic Design Automation 12(2–3):124–400, 2018. https://doi.org/10.1561/1000000053. Opened (ISTA record only).
10. Dennis, J. B., and Van Horn, E. C. "Programming Semantics for Multiprogrammed Computations." CACM 9(3):143–155, 1966. MIT MAC-TR-23: https://ftp.mirrorservice.org/sites/www.bitsavers.org/pdf/mit/lcs/tr/MIT-LCS-TR-0023.pdf. Opened (technical report; CACM details from search records).
11. Saltzer, J. H., and Schroeder, M. D. "The Protection of Information in Computer Systems." 1975. https://www.cs.virginia.edu/~evans/cs551/saltzer/. Opened (hosted copy; IEEE venue from secondary sources).
12. Miller, M. S. "Robust Composition: Towards a Unified Approach to Access Control and Concurrency Control." PhD dissertation, Johns Hopkins University, 2006. https://papers.agoric.com/assets/pdf/papers/robust-composition.pdf. Opened.
13. Miller, M. S., Yee, K.-P., and Shapiro, J. S. "Capability Myths Demolished." 2003. Not opened; unverified; not cited above.
14. Birgisson, A., Politz, J. G., Erlingsson, Ú., Taly, A., Vrable, M., and Lentczner, M. "Macaroons: Cookies with Contextual Caveats for Decentralized Authorization in the Cloud." NDSS 2014. https://ndss-symposium.org/?p=2028. Opened (paper page).
15. UCAN Working Group. "UCAN Specification" v1.0.0. https://github.com/ucan-wg/spec. Opened.
16. W3C Credentials Community Group. "Authorization Capabilities (ZCAP)" v0.4.0 draft. https://w3c-ccg.github.io/zcap-spec/v0.4.0/. Opened.
17. OpenAPI Initiative. "OpenAPI Specification" 3.2.1, 2026. https://spec.openapis.org/oas/latest.html. Opened.
18. JSON Schema 2020-12. https://json-schema.org/specification. Opened.
19. W3C. "RDF 1.1 Concepts and Abstract Syntax." Recommendation, 2014. https://www.w3.org/TR/rdf11-concepts/. Opened.
20. schema.org. "About." https://schema.org/docs/about.html. Opened.
21. W3C Solid Community Group. "Solid Protocol" v0.11.0, 2024. https://solidproject.org/TR/protocol. Opened.
22. Lemmer-Webber, C., and Tallon, J. (eds.). "ActivityPub." W3C Recommendation, 2018. https://www.w3.org/TR/activitypub/. Opened.
23. Model Context Protocol. Specification 2026-07-28. https://modelcontextprotocol.io/specification/latest. Opened.
24. W3C. "Verifiable Credentials Data Model v2.0." Recommendation, 2025. https://www.w3.org/TR/vc-data-model-2.0/. Opened.
25. Regulation (EU) 2016/679 (GDPR), Article 20. https://eur-lex.europa.eu/eli/reg/2016/679/oj. Not opened; unverified.
26. Data Transfer Initiative. https://dtinit.org/. Opened.
27. Bylander, T. "The Computational Complexity of Propositional STRIPS Planning." Artificial Intelligence 69, 1994. https://doi.org/10.1016/0004-3702(94)90081-7. Opened (preprint at https://ai.dmi.unibas.ch/_files/teaching/hs19/po/misc/bylander-aij1994.pdf).
28. Erol, K., Nau, D. S., and Subrahmanian, V. S. "Complexity, decidability and undecidability results for domain-independent planning." Artificial Intelligence 76:75–88, 1995. https://www.cs.umd.edu/~nau/papers/erol1995complexity.pdf. Opened.
29. Nau, D. S., Au, T. C., Ilghami, O., Kuter, U., Murdock, J. W., Wu, D., and Yaman, F. "SHOP2: An HTN Planning System." JAIR 20, 2003. https://www.jair.org/index.php/jair/article/view/10362. Opened (abstract).
30. Martin, D. (ed.), et al. "OWL-S: Semantic Markup for Web Services." W3C Member Submission, 2004. https://www.w3.org/submissions/OWL-S/. Opened.
31. McIlraith, S. "Semantic Web Services." WWW12 panel slides, 2003. https://www.mit.edu/~bgrosof/paps/talk-mcilraith-sws-panel-www2003.pdf. Opened.
32. Brewer, E. PODC 2000 keynote slides. https://people.eecs.berkeley.edu/~brewer/cs262b-2004/PODC-keynote.pdf. Opened.
33. Gilbert, S., and Lynch, N. "Brewer's Conjecture and the Feasibility of Consistent, Available, Partition-Tolerant Web Services." ACM SIGACT News 33(2), 2002. https://www.comp.nus.edu.sg/~gilbert/pubs/BrewersConjecture-SigAct.pdf. Opened.
34. Fischer, M. J., Lynch, N. A., and Paterson, M. S. "Impossibility of Distributed Consensus with One Faulty Process." JACM, 1985. https://groups.csail.mit.edu/tds/papers/Lynch/jacm85.pdf. Opened.
35. Yao, A. C. "Some Complexity Questions Related to Distributive Computing." STOC 1979, pp. 209–213. Not opened; unverified (index records only).
36. McIlroy, M. D., Pinson, E. N., and Tague, B. A. "UNIX Time-Sharing System: Foreword." BSTJ 57(6):1899–1904, 1978. https://archive.org/details/bstj57-6-1899. Opened (scanned text).
