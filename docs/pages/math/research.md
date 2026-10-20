# /math: research note

- **Created:** 2026-10-20. **Evidence confidence:** high on the outside sources (bibliographic details checked against publisher pages, DOIs and arXiv on 2026-10-20); the description of It's own formal work is limited on purpose (see below).

## What It's work touches

- **A private Lean 4 workspace (founder's, outside this repo).** It uses Mathlib and a pinned Lean toolchain. Its certification runs dated 2026-10-11 record: everything compiled, a proof checker passed, and a scan for unfinished proofs passed. — [source: the workspace's own certification summary, read locally 2026-10-20] (confidence: high that these runs exist; none on whether the results are right or important)
  - **Held back here:** the subject, theorem statements, assumptions and file names. The atlas says public detail comes "only where appropriate after review" (§4). The founder decides what's public (`questions.md` Q3–Q4).
  - Any public page should keep one distinction: a checked proof about a model is not a finding about the world.
- **Public already:** the "stacked levels" reasoning behind the content graph (types sit one level above the things in them, as with type-theory universes), in `docs/research/thing-type-relation/research.md`. That note marks its type-theory claims as general knowledge not yet cited, so it needs citations before it can be quoted.
- **The essays can show math now:** the public-essays design has a `math` block (TeX, drawn with KaTeX as MathML) with the TeX source as fallback (`openspec/changes/public-pages/design.md`).

## Key primary sources

- de Moura, L. & Ullrich, S. (2021). "The Lean 4 Theorem Prover and Programming Language." CADE-28, LNCS 12699, 625–635. https://doi.org/10.1007/978-3-030-79876-5_37 — Lean 4 as both a theorem prover and a programming language.
- The mathlib Community (2020). "The Lean Mathematical Library." CPP 2020, 367–381. https://doi.org/10.1145/3372885.3373824 — Mathlib's design and its community-run development.
- Bolan, M., Tao, T., et al. (2025). "The Equational Theories Project: Advancing Collaborative Mathematical Research at Scale." arXiv:2512.07087. https://arxiv.org/abs/2512.07087 — Settled all 22,028,942 implications among 4,694 equational laws for magmas, formalized in Lean, finished 14 April 2025. The authors present it as a pilot for machine-assisted collaborative mathematics.
- Spivak, D. I. & Kent, R. E. (2012). "Ologs: A Categorical Framework for Knowledge Representation." PLoS ONE 7(1): e24274. https://doi.org/10.1371/journal.pone.0024274 — Category theory as a knowledge-representation model close to a database schema; the basis of the content-graph note.
- Niu, N. & Spivak, D. I. (2025). *Polynomial Functors: A Mathematical Theory of Interaction.* Cambridge UP, LMS Lecture Note Series 498. Preprint arXiv:2312.00990. — Interacting systems modeled with the category Poly; relevant to `/technology`'s composition aims.

## Open questions

- Which result is ready, and is its statement understandable without the whole workspace? (`questions.md` Q2)
- What review is enough before publishing? The atlas: "Compilation of a proof is not the same as independent validation."
- Does the formal work connect to other topics here, such as `/coordination`? The founder knows.

## Sources

- Local, founder's private workspace: certification summary dated 2026-10-11 (read; only run outcomes described).
- Repo: `docs/source/We_Are_It_Website_Page_Atlas_v0.2_2026-10-16.md` §4, §6; `docs/research/thing-type-relation/research.md`; `openspec/changes/public-pages/design.md`.
- Outside sources as listed above, checked 2026-10-20.
