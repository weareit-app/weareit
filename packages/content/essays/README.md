# Essays

The public essays (`/why`, `/principles`, `/ai`, `/risks`, the `/roadmap` introduction and `/licensing`) are Markdown files in this folder, one folder per essay: `essays/<slug>/essay.md`. The slug is the page address. Spec: `openspec/changes/public-pages/` (capability `public-essays`, design decisions 1, 2 and 4).

When the site builds, `scripts/build-essays.ts` reads every essay, checks it, and writes two modules the app imports:

- `src/essays.generated.ts`: the published essays, and each essay's `published` flag.
- `src/essay-drafts.generated.ts`: the unpublished essays, used only by the development preview.

A problem in any essay (bad front matter, an unknown block, a block without its data, a reference to a source that isn't listed) stops `pnpm typecheck` and the web build, and the message names the file and line. The app never parses Markdown.

After editing an essay, run:

```bash
pnpm --filter @it/content essays
```

and commit the essay together with the regenerated modules. `pnpm lint` fails when they are out of date.

## Publishing

An essay page exists only when its front matter says `published: true` **and** its page is in the site link list (`apps/app/src/navigation/site-links.ts`); then its footer and menu link appears too. Otherwise its address shows the not-found page. Each essay is published on its own, after the founder approves it. To unpublish, set `published: false`.

In development, add `?draft` to the address (for example `http://localhost:8081/why?draft`) to see an unpublished essay. Release builds don't contain unpublished essays at all.

## Front matter

```yaml
---
title: Why It exists
question: What made this worth attempting? # the one-line question the essay answers
published: false
updated: 2026-10-20 # must be the date of the newest change
changes: # newest first; the first published version has one entry
  - date: 2026-10-20
    note: Added the timeline.
  - date: 2026-10-01
    note: First version.
sources: # shown as the source list at the end, numbered in this order
  - id: oecd-sleep # lowercase words joined by hyphens
    title: The full title of the work
    publisher: Who published it
    url: https://example.org/report
    date: 2024 # optional: a year or a date
---
```

Describe other people's work by what they published. Never present it as endorsing or being associated with It.

## Text

Essays use a small part of Markdown:

- Headings from `##` down to `####`, in order (the title is the page's only top-level heading, so don't write `#`).
- Paragraphs, `_emphasis_`, `**strong**`, and `[links](https://example.org)` to web addresses, email addresses or pages on It (`/roadmap`).
- Bulleted and numbered lists.
- Markdown tables.
- Inline maths between single dollar signs: `$E = mc^2$`.

Anything else (HTML, images, code, quotation blocks, horizontal rules, `$$` maths blocks) fails the build, so the page stays readable with scripts off and accessible.

### Sources beside claims

Put a footnote-style reference right after a claim from outside It: `Teens slept about half an hour more[^seattle-study].` The ID must be one of the `sources` in the front matter. The page shows a numbered link to the source next to the claim and lists every source at the end. Don't write footnote definitions (`[^id]: …`) in the text.

### Status labels

Where the essay states a result, view or plan, label it with `:status[…]` and one of these labels, written exactly:

- `established result`
- `replicated finding`
- `machine-checked under stated assumptions`
- `working hypothesis`
- `speculative direction`
- `open question`
- `planned engineering`

For example: `People choose more freely when they see several futures :status[working hypothesis].` The label is shown as words, never colour alone.

## Blocks

A block is a line of its own naming the block type and the data file beside the essay: `::chart{id="incidents"}` reads `incidents.json` (or `incidents.yaml`). Data files are checked against their type. Fields named `source` hold a source ID from the front matter.

Until the blocks are built (public-pages tasks 4.2–4.4), each one shows a plain "can't be shown yet" note.

| Block              | Written as                                       | Data file fields                                                                                                                                                                                                                                                                          |
| ------------------ | ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Chart              | `::chart{id="…"}`                                | `title`, `description` (read aloud and shown without scripts), `spec` (a Vega-Lite spec without data), `data` (rows), `source`, `unit`, `timeframe`, `population` (who or what the numbers count), `updated`; optional `uncertainty`. A chart missing any required field fails the build. |
| Diagram            | `::diagram{id="…"}`                              | `mermaid` (Mermaid source), `description`; optional `title`                                                                                                                                                                                                                               |
| Maths              | `::math{id="…"}`                                 | `tex`; optional `description`                                                                                                                                                                                                                                                             |
| Evidence card      | `::evidence{id="…"}`                             | `claim`, `source`, `date`, `status` (a status label), `limitation`                                                                                                                                                                                                                        |
| Timeline           | `::timeline{id="…"}`                             | `entries`: each `date` (year, month or day), `title`, optional `note`; optional `title`                                                                                                                                                                                                   |
| Status board       | `::status-board{id="…"}`                         | `items`: each `label`, `status` (a status label), optional `note`; optional `title`                                                                                                                                                                                                       |
| Table              | `::table{id="…"}`                                | `caption`, `columns` (`key`, `label`), `rows`. A table of outside data names its `source` and then needs `unit`, `timeframe`, `population` and `updated` too.                                                                                                                             |
| Expandable section | `:::expandable{title="…"}`, the text, then `:::` | No data file: the text between the lines is the section.                                                                                                                                                                                                                                  |

## Example

This essay, with the data files in `tests/essay-fixtures/every-node/`, uses every node and block type. The tests build it, so it stays correct.

```markdown
---
title: Every node
question: Does the parser accept each node type?
published: true
updated: 2026-10-20
changes:
  - date: 2026-10-20
    note: Second version.
  - date: 2026-10-01
    note: First version.
sources:
  - id: plan
    title: Public pages plan
    publisher: We Are It
    url: https://github.com/weareit-app/weareit
    date: 2026-10
---

## Text

A paragraph with _emphasis_, **strong**, a [link](https://example.org)
and a [page link](/roadmap), across two lines.

A sourced claim[^plan] and a label :status[working hypothesis]. Maths: $E = mc^2$.

### Lists

- One
- Two, with _emphasis_

1. First
2. Second

| City    | Start |
| :------ | ----: |
| Seattle |  8:45 |

## Blocks

::chart{id="incidents"}

::diagram{id="flow"}

::math{id="formula"}

::evidence{id="claim"}

::timeline{id="milestones"}

::status-board{id="board"}

::table{id="cities"}

:::expandable{title="More detail"}
Nested text.
:::
```

A chart's data file, `incidents.json`:

```json
{
  "title": "Reported incidents",
  "description": "Incidents rose from three to five.",
  "spec": { "mark": "line" },
  "data": [
    { "year": 2020, "count": 3 },
    { "year": 2021, "count": 5 }
  ],
  "source": "plan",
  "unit": "incidents",
  "timeframe": "2020–2021",
  "population": "Incidents reported to the database",
  "updated": "2026-10-01"
}
```

An evidence card's data file, `claim.yaml`:

```yaml
claim: The plan is public.
source: plan
date: "2026-10-19"
status: established result
limitation: It is a plan, not a result.
```

The other data files are in the fixture folder.
