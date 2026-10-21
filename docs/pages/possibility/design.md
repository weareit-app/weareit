# /possibility: page design

How the atlas's five design dimensions (§8) would work on this page, using only the essay system in `openspec/changes/public-pages` (named blocks, static HTML, web only) and the real explorer. Nothing here is decided; open choices are in `questions.md`.

## Constraints this design keeps

- **One explorer.** The interactive part is a link into the real explorer: the unemployment pain page `/p/unemployment` (from `openspec/changes/pain-pages`; the slug defaults to the pain ID), or `/` if pain pages haven't shipped. No embedded or second explorer. `public-pages` lists "interactive explorers inside essays" as a non-goal.
- **Nothing pre-picked.** The link is the plain page address. No query string that picks a dream or fix for the reader: that would put choices on their device they didn't make, and pain pages strip query strings on arrival anyway.
- **Privacy.** The page sends only its own page view, after the one-line privacy note (`public-pages` "Essay privacy"). Reading it never sends picks, and the page reveals nothing about what anyone chose.
- **Static first.** The text, sources and every block's fallback read with scripts off.

## What has to exist first (facts from the repo, 2026-10-20)

- The Unemployment pain is in the seed content (`packages/content/src/tier-1.ts`) with **no dreams or fixes yet**. The published database may differ; check before writing. So the worked example has nothing to link to until an unemployment branch is drafted (with `/possibilities-generate`), approved and published. There are two generator runs for the related pain `ai-and-jobs` (`docs/research/possibilities/runs/ai-and-jobs/`), the latest of which drafted 14 distinct futures for that one pain (candidates, not published); none of its fixes is UBI.
- `/p/<slug>` is a proposed change, not built. The founder decided the personal and societal pages don't link to pain pages (2026-10-19); whether an essay may is not decided (`questions.md` Q6).
- Unemployment is not in the pain-page launch set as far as the repo shows, so it would get the basic pain page, not the detailed one.

## The five dimensions

| Dimension | Concrete version for this page | First version? |
| --- | --- | --- |
| **More interactive** | A link to `/p/unemployment` below the worked example, and a second link to `/` for readers whose pain is different (wording for both is the founder's; none is written here). Each alternative future in the example is an `expandable` showing its fixes, so the reader can compare futures without leaving the page. | Link: yes. Expandables: optional. |
| **More beautiful** | A `diagram` that follows the product's own visual logic: the pain small and muted on the left, three or four futures branching out, one of them ("I can live well regardless of employment") shown as the prominent card, each future ending in its three levels of fix. Same type tags and status words as the explorer. Mermaid can draw the structure; matching the product's card look may need a static SVG instead (`questions.md` Q8). The atlas's "gentle movement from muted pain to hopeful possibility" is left out of the first version on purpose: it needs motion or a custom drawing, and the static diagram carries the same order. | Yes, as a plain diagram. |
| **More meaningful** | The three fix levels for one future, as defined in `outline.md` (Real now, Something It could build, A change we'd make together). Each alternative future gets one honest tradeoff line. UBI sits next to the alternatives people propose, so it doesn't read as the answer. | Yes. |
| **Participatory / MVP link** | An invitation to name a missing future → the contribution path (people adding their own futures and ways, founder review queue, after signup only) or the contact address until that's built. Interest votes are left out: `public-pages` makes them a non-goal and they'd need their own privacy design. | Contact or contribution link only. |
| **More dataful** | One `evidence` card for the UBI trials: each trial's place, sample size, amount, duration, main finding and main limit, with source and date. The Real now fix links one specific vetted resource (an official unemployment insurance finder, to be chosen and checked). No counts of what people on It chose: the atlas suggests "privacy-thresholded aggregate interest by possibility" as optional, `public-pages` excludes live data, and `docs/spec/features.md` has only founder-only admin totals of picks (optional). It would need a minimum group size the founder hasn't set. | Evidence card: yes. |

## Named blocks

| Block | ID (suggested) | Content | Fallback (scripts off) |
| --- | --- | --- | --- |
| `diagram` | `one-pain-many-futures` | As defined in `outline.md` (worked example) | Written description of the branches |
| `evidence` | `ubi-trials` | Claim: unconditional cash trials found X on work and Y on wellbeing; source list; date; status: open question (whether unconditional cash works overall), matching `research.md`; limitation: short, not universal, financing not tested | Rendered as text already |
| `expandable` (optional) | `future-<id>` | One per alternative future: its line, two fixes, one tradeoff | Native disclosure, open by default |

No `chart` in the first version: a single chart of one trial would overstate it, and a comparison chart needs outcomes measured the same way across trials, which they weren't.

## Start small (first version)

1. The ~500-word essay from `outline.md`.
2. One `diagram` (`one-pain-many-futures`).
3. One `evidence` card (`ubi-trials`).
4. One working link into the explorer: `/p/unemployment` once it has a published branch and pain pages ship; until then, `/` with a pointer to Unemployment under Work.
5. One invitation to name a missing future (contact address for now).

Blocked on: an approved unemployment branch with at least three futures, including "I can live well regardless of employment". If that isn't ready, the page can use a pain that already has dreams (`questions.md` Q4).

## Later, only if the first version earns it

- A second worked example from the societal page, so collective futures get their own example and not only UBI.
- Starting from a dream instead of a pain ("soon" in `docs/spec/features.md`), which would let the link open at "I can live well regardless of employment" directly.

## Accessibility

Headings in order; the diagram has a full text description; expandables announce state and work by keyboard; status labels are words; no motion when reduced motion is set (`public-pages` "Essay accessibility").
