---
name: possibilities-generate
description: Write sourced possibility cards for one or more pains with isolated writer agents.
disable-model-invocation: true
---

Shared rules, layout and helper commands: `tools/possibilities/README.md`. Read it first.

1. **Pick the pains.** Use the pain IDs given. If none are given, ask which ones. Each must exist in the pain catalog, `docs/research/pains/catalog.json`; a merged ID runs under the pain it was merged into. Done when every pain is a known ID.
2. **Start one writer per pain.** Each is a fresh, isolated agent: an Agent tool subagent in Claude Code, a new thread in Codex. Give it only this: "Read and follow `tools/possibilities/briefs/writer.md`. Your pain: `<pain-id>`." Run writers in parallel. Done when every writer has replied with its run path.
3. **Check each run yourself.** Run `validate` and `lint` on every run path. A run with issues goes back to its writer with the issue list. Done when every run reports zero issues.
4. **Report.** Give the founder one line per pain: the run path, the exemplars (verified out of total), the number of cards and the lint result. These are unjudged candidates, so offer `/possibilities-judge` next. Don't present them as finalists.
