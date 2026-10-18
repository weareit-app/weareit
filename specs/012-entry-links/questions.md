# Questions: 012 pain pages and entry links

Founder review 2026-10-18. The first round (Q1–Q20) was written for a model the founder did not intend ("open the personal or societal list page with one pain expanded"). The founder's model: `/p/<slug>` is **a page for one pain**: the pain, its dreams and fixes to pick, then "See more pains" into the normal flow. Answers are recorded below; questions that only made sense for the old model are marked **obsolete**. New open questions are N1 and up, cited by `[NEEDS CLARIFICATION]` markers in `spec.md`.

## Open (new model)

### N1. Where do the detailed sections sit on a launch-set pain page?

- A. Pain name and line, then dreams to pick near the top; detailed sections below ("More about this").
- B. Detailed sections first, then dreams to pick.
- C. A short summary and one image at the top, dreams next, fuller detail below.

**Recommendation**: C. People arriving from a post already care about the topic; a summary plus image shows It understands it, and dreams stay within reach on a phone without scrolling past long text.

### N2. What kinds of image are allowed?

- A. Illustrations only, in It's own visual style (e.g. watercolor, sharing 007's language); no photos.
- B. Licensed or openly licensed photos with credit, plus charts.
- C. AI-generated images allowed, labelled as illustrations.
- D. A mix: illustrations (A) for mood, charts for data, real photos (B) only where documenting something; AI-generated images labelled if used.

**Recommendation**: D with a firm rule: anything that looks like evidence (a photo, a chart) must be real and sourced; illustrations must not look like documentary photos. Pain pages describe sensitive experiences, so images should not show identifiable people in distress.

### N3. Fixes on a pain page: only under picked dreams?

- A. Same as spec 001: fixes appear under a dream once it is picked.
- B. Show every dream's fixes from the start.

**Recommendation**: A. It keeps one behaviour across the pain page and the personal/societal pages, and the page stays short on a phone.

### N4. Do pains on the personal and societal pages link to their own pain pages?

- A. Yes: an opened pain on those pages has a "More about this" link to its pain page (most useful for launch-set pains with detail).
- B. No: pain pages are only for arriving by link in v0.1.

**Recommendation**: A, at least for launch-set pains, so the detailed content isn't only visible to people who arrive by link. Opening it adds that page to browser history, which is the person's own action.

## Answered (2026-10-18)

| # | Question | Answer |
|---|---|---|
| Q1 | Which pains get links first | Every published pain has a working link; the editor highlights a launch set for outreach. The launch set gets detailed content. |
| Q2 | Slug vs stable ID | Separate slug field, defaulting to the pain ID; old slugs kept as aliases. |
| Q3 | Does a slug name one pain | One slug, one pain. |
| Q4 | Who sets slugs; can they change | Founder approves in the editor at first publish; may change later; old slug kept as a permanent alias. |
| Q5 | Retired pain link | Open the replacement pain's page if one was named, otherwise a calm "not here any more" note (on the personal page). |
| Q6 | Unknown or unpublished slug | Calm note, no pain open, reveals nothing about drafts. Under the new model: the personal page opens with the note. |
| Q7 | Wrong page letter | Resolved by a single prefix: `/p/<slug>` for every pain. No `/s/`. |
| Q9 | Welcome screen on arrival | Skipped: straight to the pain page. (These visitors don't see 007's welcome mark.) |
| Q10 | Existing picks on the device | Picks on a pain page are the same on-device picks as onboarding; carried into the flow and sent at signup per 008 (picked dreams with pain and content version, selected fixes with content version). |
| Q12 | Server request logs | Keep `/p/<slug>`. Hosting requirement: drop or truncate IPs and paths where the host allows; otherwise short retention, never analysed, disclosed. |
| Q13 | Social tracking tags | Stripped from the address bar on arrival; never stored. |
| Q14 | Measurement | Counts as a normal visit only; no per-pain or per-link counts; picks count as the usual stages. The stage list belongs to a new measurement spec (not yet written). Link-preview fetches are not visits. |
| Q15 | Link previews | The pain's title and image. Needs per-page rendering; depends on the open hosting/rendering decision. |
| Q17 | Signed-in visitor | Same pain page with their saved picks; edits auto-save (008). |
| Q18 | iPhone | Web only in v0.1; universal links researched later. |
| Q19 | Landing pages: same address? | Resolved: the detailed pain page *is* the landing page, at the same `/p/<slug>`. Detailed pages are v0.1 for the launch set; no "how many people share this" counts in v0.1. |
| Q20 | Share control | Yes: "Share this topic" on pain pages; shares the pain page only, never the person's picks. |

Also decided: content for detailed pages is AI-drafted, founder-approved, stored in the CMS with sources. Terminology: **selected fixes**, never "I'd use this". The "clear everything on this device" control is pre-signup only.

## Obsolete (old list-page model)

| # | Question | Why obsolete |
|---|---|---|
| Q8 | Where the linked pain appears in the list | A link opens a page for that one pain, not the list. |
| Q11 | Does opening other pains change the address | Opening pains happens on the list pages in the normal flow; the pain page has its own address by design. |
| Q16 | Arriving at the societal page first | Every link goes to a pain page; the normal flow (pain page → personal → societal → gate) follows. |

## Notes (not questions)

- `docs/spec/pieces.yaml` is parked by the founder; no piece added.
- Spec 001 still uses "I'd use this" and assumes 85 pains; both need updating outside this branch.
- `docs/spec/features.md` §2b was rewritten on this branch at the founder's direction to match these answers.
