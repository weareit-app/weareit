# agent-steering Specification

## Purpose
Defines where the repo's guardrails, judgement rules, decision records, workflow notes, and agent skills live, what each holds, and the checks that keep them from drifting, so people and agents find each rule in exactly one place.

## Requirements

### Requirement: One steering file
The repo SHALL have one root `AGENTS.md` and no `CLAUDE.md` or `.claude/rules/`. A package SHALL get a nested `AGENTS.md` only when it has rules nothing else carries.

#### Scenario: Agent opens the repo
- **WHEN** an agent starts a session at the repo root
- **THEN** it reads `AGENTS.md` and no other steering file

### Requirement: AGENTS.md holds guardrails and pointers
`AGENTS.md` SHALL hold product intent, the binding stack lines, and the privacy invariants, plus one pointer per other doc, worded with when to read it. Anything with another home SHALL move there.

#### Scenario: OpenSpec workflow detail
- **WHEN** an agent needs the OpenSpec workflow steps
- **THEN** `AGENTS.md` points it to a file in `docs/agents/` that holds them

### Requirement: One source for the invariants
The privacy invariants SHALL be written only in `AGENTS.md`. `docs/architecture/decisions.md` SHALL record when and why each was decided or changed, link to it, and not restate it. Changing an invariant SHALL still need an entry in `decisions.md`.

#### Scenario: Invariant changes
- **WHEN** the founder changes the measurement invariant
- **THEN** `AGENTS.md` is edited and `decisions.md` gains a dated entry that links to it

### Requirement: Judgement rules in one file
Rules that review judges and no check can enforce SHALL live only in `CODING_STANDARDS.md`. `AGENTS.md` and `openspec/config.yaml` SHALL point to it instead of copying its rules. A rule a check can enforce SHALL be a check instead.

#### Scenario: Zod at boundaries
- **WHEN** an agent looks for the rule to validate untrusted input with Zod
- **THEN** it finds it in `CODING_STANDARDS.md` and only there

### Requirement: Decision records in one file
Decision records SHALL live in `docs/architecture/decisions.md`: current decisions grouped by topic and edited in place, plus a dated change log. A `docs/adr/` folder SHALL fail a check in CI and the pre-commit hook.

#### Scenario: Skill creates an ADR folder
- **WHEN** a commit adds `docs/adr/0001-something.md`
- **THEN** the check fails and points to `decisions.md`

### Requirement: Doc roles
`decisions.md` SHALL say what was decided and why. `docs/architecture/<topic>.md` SHALL say how a decided area works (setup, gotchas, versions), and its decision entry SHALL link to it. An OpenSpec design covers one change; when the change is archived, each decision that outlasts it SHALL have a `decisions.md` entry.

#### Scenario: Archiving this change
- **WHEN** this change is archived
- **THEN** every convention it set has a `decisions.md` entry

### Requirement: Skill set
`to-spec`, `implement-spec`, and `ask-matt` SHALL be removed and listed as not vendored, so a re-vendor skips them. A repo skill, `/ask-it` (Codex: `$ask-it`), started only by the founder, SHALL list every skill that stays and when to use each. Every other vendored skill SHALL stay unmodified, steered by docs.

#### Scenario: Re-vendoring
- **WHEN** the vendored skills are refreshed from upstream
- **THEN** `to-spec`, `implement-spec`, and `ask-matt` are not added back

### Requirement: Skill folders stay in step
`.claude/skills` SHALL be the source of the repo's skills. A script SHALL copy it to `.agents/skills`, skipping the generated `openspec-*` skills, and a check in CI and the pre-commit hook SHALL fail when the two differ.

#### Scenario: Skill edited in one folder
- **WHEN** a commit changes `.claude/skills/pains-review/SKILL.md` without running the copy script
- **THEN** the check fails and names the skill

### Requirement: Build path
`tasks.md` SHALL be the only progress tracker for a change. `/to-tickets` SHALL be used only to hand a task group to a parallel session or person. `/opsx:apply` SHALL drive a change, with `/implement` or `/tdd` doing the work.

#### Scenario: Parallel session
- **WHEN** a task group goes to another session
- **THEN** its issue links the tasks in `tasks.md` instead of copying them
