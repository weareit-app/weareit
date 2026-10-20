# /math: What have we proved, and under which assumptions?

**Writer:** founder, or drafted from this outline after the founder decides what can be public. **Target:** one research note under `/research` first (see `questions.md` Q1), about 500 words with one exact statement. **Status labels to expect:** "machine-checked under stated assumptions", "open question", "working hypothesis".

**Review gate (atlas §4, §6):** nothing from the private Lean workspace goes public until the founder has reviewed it. That covers theorem statements, assumptions, model choices, file names and the subject itself. Compiling a proof is not independent validation; say so on the page. It's fine to describe the motivating question and say that detail is held back.

## 1. The question
- **You:** the one question the formal work tries to answer, in a sentence a stranger can follow. Why it matters to a person, a society or It.

## 2. What is known
- The prior work the result builds on, cited by what each author published (see `research.md`).
- How Lean and Mathlib check a proof, in two sentences: what "the checker accepts it" means, and what it doesn't.

## 3. Our present view
- One statement in plain words, then the same statement as a `math` block.
- The assumptions, listed one per line. **You:** which assumptions carry the weight, and which you'd most expect a critic to reject.
- The status: what was checked (toolchain version, date, checker run), and that nobody outside the project has reviewed it yet.

## 4. Why it matters
- **You:** one concrete consequence. If the result holds, what decision or design in It changes?

## 5. What remains open
- What the result doesn't say: a checked proof about a model is not a finding about the world. **You:** the model's limits.
- **You:** one approach that failed or was abandoned.
- What's held back pending review, said plainly.

## 6. Where to pick this up
- "Check this statement and its assumptions" (atlas §9), with the skills needed: Lean 4, Mathlib, and the field the model comes from.
- The repository or file to read, once public. Contact: `hello@weareit.app`.

**Blocks:** one `math` block (the statement), one `evidence` card (claim, checker run and date, status, main limitation).

**Sources to find:** the papers the model draws on; the Lean 4 and Mathlib citations in `research.md`; the exact toolchain and Mathlib commit once the file is public.
