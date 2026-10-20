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

A line that ends with a hard break\
and carries on.

### Lists

- One
- Two, with _emphasis_
  - Nested under two

#### Numbered

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
