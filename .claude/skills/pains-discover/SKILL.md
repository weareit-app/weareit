---
name: pains-discover
description: Sweep outside lists and surveys for human pains the catalog doesn't cover yet, with isolated research agents.
disable-model-invocation: true
---

Shared rules, layout and helper commands: `tools/pains/README.md`. Read it first.

1. **Pick the scope.** Use the scope given: one group ID, `personal`, `societal` or `all`. If none is given, ask. For a page or `all`, split it into one scope per group. Done when every scope is a known group or page (`python3 tools/pains/catalog.py sweep-new` refuses unknown ones).
2. **Start one researcher per scope.** Each is a fresh, isolated agent: an Agent tool subagent in Claude Code, a new thread in Codex. Give it only this: "Read and follow `tools/pains/briefs/discover.md`. Your scope: `<scope>`." Run researchers in parallel. Done when every researcher has replied with its run path.
3. **Check each run yourself.** Run `sweep-check` and `coverage` on every run path. A run with issues goes back to its researcher with the issue list. Done when every run reports zero issues.
4. **Report.** Give the founder one line per scope: the run path, candidates proposed and drafted, repeats skipped, and each list's coverage share against the 90% target. These are proposals only, so offer `/pains-review` next.
