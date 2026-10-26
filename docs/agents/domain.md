# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring the codebase.

## Before exploring, read these

- **`GLOSSARY.md`** at the repo root, or
- **`GLOSSARY-MAP.md`** at the repo root if it exists: it points at one `GLOSSARY.md` per context. Read each one relevant to the topic.
- **`docs/architecture/decisions.md`**: this repo's decision records. Read the decisions that touch the area you're about to work in. Add new decisions there, in the same style, rather than creating `docs/adr/`.
- **`AGENTS.md`**: privacy invariants and binding decisions; they win over everything else.
- **`openspec/specs/`**: what the app does today, one capability per folder.

If any of these files don't exist, **proceed silently**. Don't flag their absence; don't suggest creating them upfront. The `/domain-modeling` skill (reached via `/grill-with-docs` and `/improve-codebase-architecture`) creates them lazily when terms or decisions actually get resolved.

## File structure

This repo has one context:

```
/
├── GLOSSARY.md
├── AGENTS.md                          ← privacy invariants and binding stack lines
└── docs/
    └── architecture/
        ├── decisions.md               ← every current decision, by topic
        └── decision-log/              ← one dated file per change to those decisions
```

Decision records never go in a `docs/adr/` folder (`tools/decision-records/` fails if one appears). When a skill says to write an ADR, add or edit the topic in `docs/architecture/decisions.md` and add a dated file to `docs/architecture/decision-log/`.

## Use the glossary's vocabulary

When your output names a domain concept (in an issue title, a refactor proposal, a hypothesis, a test name), use the term as defined in `GLOSSARY.md`. Don't drift to synonyms the glossary explicitly avoids.

If the concept you need isn't in the glossary yet, that's a signal: either you're inventing language the project doesn't use (reconsider) or there's a real gap (note it for `/domain-modeling`).

## Flag decision conflicts

If your output contradicts an existing decision in `docs/architecture/decisions.md`, surface it explicitly rather than silently overriding:

> _Contradicts the hosting decision (Render, master deploys after CI), but worth reopening because…_
