# Agent skills

How agents run the repo's skills. `AGENTS.md` points here.

## Manual-only skills

Skills whose `SKILL.md` sets `disable-model-invocation: true` (such as `/grill-with-docs`, `/implement`, and `/retro`) start only when the founder types them. When a flow reaches one, give the founder the exact command to type.

## Grilling

When a grilling skill (`grilling`, `grill-me`, `grill-with-docs`, wayfinder grilling tickets) puts a round to the founder, use a structured-question tool when the agent has one (Claude Code: `AskUserQuestion`). That tool takes at most four questions per call, so a bigger round goes out as several calls. Each question has 2–4 options, with the recommended one first and labelled "(Recommended)". Without such a tool, use the skill's text format. The vendored skills stay unmodified.

## Possibility content

Candidate dreams and fixes are drafted with `tools/possibilities/` through the user-invoked skills `/possibilities-generate`, `/possibilities-judge`, `/possibilities-repair` and `/possibilities-calibrate`. Rules every writer follows: `tools/possibilities/README.md`.

