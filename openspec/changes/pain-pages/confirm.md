# Confirm: pain-pages

Answer each item with "yes" to accept the recommendation, or name another option. Sources: `specs/012-entry-links/questions.md` (N1–N4), `specs/001-personal-page/spec.md` FR-027, the 2026-10-18 founder answers, and AGENTS.md.

## 1. Which opened pains link to their pain page? (001 FR-027 / 012 N4)

features.md §1 already says each opened pain links to `/p/<slug>`; the open part is scope.

- A. Every published pain.
- B. Only the launch set (the pains with detailed pages).

**Recommendation: A.** Every published pain already has a working page, so one rule is simpler and nothing looks missing; the link matters most for launch-set pains but costs nothing for others. The specs currently assume A.

## 2. Where do the detailed sections sit on a launch-set page? (012 N1)

- A. Name and line, then dreams near the top; detail below ("More about this").
- B. Detail first, then dreams.
- C. Short summary and one image at the top, dreams next, fuller detail below.

**Recommendation: C.** Shows It understands the pain while keeping dreams within reach on a phone.

## 3. What kinds of image are allowed? (012 N2)

- A. Illustrations in It's own style only; no photos.
- B. Licensed or openly licensed photos with credit, plus charts.
- C. AI-generated images allowed, labelled as illustrations.
- D. Mix: illustrations for mood, charts for data, real photos only where documenting something; AI images labelled if used.

**Recommendation: D, with a firm rule:** anything that looks like evidence (a photo, a chart) must be real and sourced; illustrations must not look like documentary photos; no identifiable people in distress.

## 4. Fixes on a pain page appear only once a dream is picked? (012 N3)

- A. Yes, exactly as on the personal page.
- B. Show every dream's fixes from the start.

**Recommendation: A.** One behaviour everywhere, and a shorter page on a phone. The specs assume A ("exactly as an opened pain does on the personal page").

## 5. Does locking published IDs belong in this change?

The editor lets the founder rename a published ID today (`apps/app/app/cms/index.tsx`), which would break links and saved picks. decisions.md and 001 FR-020 already require IDs never change once published.

- A. Keep it in pain-pages (content-catalog "Published IDs are locked").
- B. Move it to a separate content change that lands first; pain-pages depends on it.

**Recommendation: A**, unless a content change is planned to start sooner; it is small and pain links are the first thing that needs it.

## 6. How are link previews (title and image) rendered?

Today the web build is fully static, so a preview fetcher cannot get a per-pain title and image from published content.

- A. Expo Router server output for `/p/<slug>` only (the path decisions.md names), with a decision record.
- B. Generate a static page for every slug and alias each time content is published (no server runtime, but publishing triggers a rebuild).
- C. Generic It preview for every link in v0.1; per-pain previews later.

**Recommendation: A**, tied to the hosting decision; B if the chosen host makes a server runtime awkward. C conflicts with the 012 Q15 answer, so only if time runs out.

## 7. How does AI drafting fit the editor?

The founder decided detailed content is AI-drafted, founder-approved and stored in the CMS with sources.

- A. Drafting happens outside It (for example with Claude), and the draft and sources are pasted or imported into the editor for review and approval.
- B. Build a "draft with AI" button in the editor.

**Recommendation: A** for v0.1: no new provider or API key in It, and approval stays the same.

## 8. Preview image for pains without one

Most pains have no image today (`apps/app/src/content/illustrations.ts`), but previews should show "the pain's title and image".

- A. Pains without their own image use one It preview image (the brand mark) with the pain's title.
- B. Every published pain must have an image before it can be published.
- C. Launch-set pains must have an image; others use A.

**Recommendation: C.** Outreach links look right, and publishing other pains is not blocked.

## 9. Pain-page view counting reversed (for the record)

Spec 012 (Q14, FR-020) said arriving by link is an ordinary visit with no per-pain counting. The 2026-10-19 measurement invariant (AGENTS.md, spec 013) counts a page view for each pain page by pain ID and each pain opened. This change follows AGENTS.md: it specifies no counting itself, leaves pain-page views to the measurement change, and keeps "how a visit arrived is never recorded" (still in decisions.md).

- A. Agreed; the measurement change owns pain-page counting, and the privacy page will say pain pages are counted by pain.
- B. Revisit the invariant (would need a new decision record).

**Recommendation: A.**
