# Visible design rules — DRAFT

Baldwin & Clark: a modular system has a few **visible design rules** every module must obey; everything else is **hidden** inside modules and free to change. Goal: keep this list short. If a rule isn't needed by at least two modules, it's not a design rule.

## Visible (every module agrees)

| # | Rule | Why | Checked by |
|---|---|---|---|
| R1 | **Contracts are Zod schemas in `contracts/`**; transports (tRPC, webhooks) are generated from them. | Single contract; transport stays two-way (D4/D5). | typecheck |
| R2 | **Concepts never import each other.** Cross-concept behavior lives in synchronizations in the composition root. | Independent change (concept design). | `check:boundaries` |
| R3 | **Owner refs are opaque strings** (`session:…` / `account:…`). No concept inspects them. | Anonymous-first + claim-on-signin. | review |
| R4 | **Renderers take props and emit intents**; they never write durable state. | UI swap without logic edits (§6, §11 pass 3). | `check:boundaries` |
| R5 | **Every capability declares its kind** (§8): pure / query / authorized action / long-running / renderer. Pure ones touch no clock, network or storage. | Side-effect honesty (§13). | review + lint on imports |
| R6 | **Vendor SDKs only inside adapters**; `sst`, auth lib, payment SDK, DB driver each imported in exactly one place. | Doors stay two-way (D7–D10). | `check:boundaries` |
| R7 | **Content and consequential algorithms are versioned**; stored choices record the version they were made under. | No silent reinterpretation (§5). | schema |
| R8 | **Private by default + consent checked in the execution layer**, not by types. | Trust promises (§13 security through types alone). | sync tests |

## Hidden (deliberately not standardized)

Storage schema per concept · component styling and animation · ranking method inside `propose-ideas` · folder layout inside a feature · test tooling per package · how admin views are laid out.

## Not doing

No adapter for things with one plausible implementation and no vendor (e.g. disclosure state). No generic event bus. No shared "common" package beyond `contracts/`.
