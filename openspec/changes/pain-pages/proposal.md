# Proposal

## Why

Outreach needs somewhere to land: a post about rent should open a page about rent, not a list of 68 pains (features.md §2b). Today no pain has its own address, so a link can only point at the start of the flow. The founder decided on 2026-10-18 (spec 012 answers) that every published pain gets one page at `/p/<slug>`, and that the outreach launch set gets detailed, sourced pages in v0.1.

## What Changes

What people see and do, screen by screen (features.md §2b, all core):

- **A post with a link.** Someone shares a short readable link such as `/p/rent-eats-everything`. Where the place it is posted shows previews, the preview shows the pain's title and its image. Nothing in the link or preview says who shared it or who will tap it.
- **Pain page (basic), every published pain.** Tapping the link opens a page for that one pain straight away, with no welcome or landing step first and no account prompt. It shows the pain's name and first-person line, then its dreams to pick and the fixes for picked dreams, with their honest type labels, working exactly as an opened pain does on the personal page. Near the top, a short note says picks stay on this device. At the bottom: **See more pains** and **Share this topic**. Before signup the "clear choices" control is there too.
- **Pain page (detailed), launch set only.** The same page plus a fuller account of the pain: short plain sections, images and charts where they help, each claim and chart with a visible, dated source. AI may draft it; the founder approves it in the content editor before it appears. There are no counts of people on It who share the pain.
- **See more pains.** Goes to the personal page, then the societal page, then the signup gate, as for anyone. Whatever the person picked on the pain page is already there: they are the same on-device picks, not a copy.
- **Share this topic.** Opens the device's share options, or copies the link. Only the plain page link is shared, never the person's picks; a short line says so.
- **A link that leads nowhere.** An unknown, mistyped or unpublished slug opens the personal page with a short calm note. Nothing reveals whether an unpublished pain exists.
- **A retired pain.** Opens its replacement's page if the founder named one; otherwise the personal page with a calm "not here any more" note.
- **An old slug.** Opens the same pain page, and the address bar shows the current slug.
- **Arriving with tracking tags.** Tags that social sites add to the link are removed from the address bar on arrival and never stored or sent.
- **Signed in.** A signed-in person sees their saved picks on the pain page, and changes save to their account as on the list pages (required-signup-gate). No "clear choices" control.
- **Personal and societal pages.** An opened pain links to its own pain page (features.md §1, spec 001 FR-027). Whether every pain links or only the launch set is open (Open questions).
- **Content editor (founder).** Each pain gets a readable slug, separate from its ID and defaulting to it, approved by the founder when the pain is first published. Changing a slug keeps the old one working forever; no slug is ever reused. Pains can be retired, with an optional replacement. The editor highlights the launch set, shows each pain's link with a copy control, and holds the detailed content with its sources. Published pain IDs can no longer be renamed.
- **iPhone.** In v0.1 links open It on the web in the phone's browser.

Reversal to note: spec 012 (2026-10-18) said arriving by link counts as an ordinary visit with no per-pain counting. The measurement invariant changed on 2026-10-19 (AGENTS.md, spec 013): page views are counted per page, including each pain page by its ID. That counting belongs to the measurement change. This change specifies no counting, and keeps the part that still holds: how a visit arrived (the link, the referring site, tracking tags) is never recorded.

Out of scope:
- Measurement of pain-page views and pain opens (the measurement change, spec 013).
- The full privacy page (spec 010); this change only adds what the privacy page must say about links and hosting logs.
- Opening links in the installed iOS app (universal links); researched later.
- Counts of people who share a pain (features.md §2b ✗).
- An in-editor AI drafting tool, unless the founder asks for one (Open questions).

Must leave room for (features.md Stages):
- **Starting from a dream (soon)**: the address scheme leaves room for other link kinds without changing what `/p/` means.
- **Sharing a future or path (soon)**: Share this topic shares only the page; sharing picks stays a separate, explicit act.
- **Personal story (soon)**: pain-page picks keep their content version like all picks.
- **Invitations (optional)**: links and sharing never record who invited whom.
- **Native iOS app (optional)**: the pain page is an ordinary app route, so universal links can be added later.
- **Counts of people sharing a pain (later)**: the page leaves space for them without building them.

## Capabilities

### New Capabilities
- `pain-pages`: the single-pain page at `/p/<slug>`: arrival, basic and detailed content, picks, See more pains, Share this topic, link hygiene, unknown/retired/old-slug handling, previews, and its privacy, honest-status and accessibility rules.

### Modified Capabilities
- `content-catalog`: slugs with permanent aliases that are never reused, founder slug approval at first publish, retired pains with an optional replacement, a launch-set flag, sourced detailed content, links shown in the editor, and published IDs locked.
- `pain-explorer`: an opened pain links to its pain page.

## Impact

- App: new route `apps/app/app/p/[slug].tsx`; a shared opened-pain view extracted from `apps/app/src/components/personal/pain-explorer.tsx` so both pages behave the same; note and redirect handling on `apps/app/app/index.tsx`; share control; detailed-content rendering (text, images, charts with text alternatives).
- Content and API: `packages/content/src/schema.ts` and `graph-schema.ts` (slug, aliases, retired, replacement, launch set, detailed sections, sources); `packages/api/src/contract.ts` and `router.ts` (a semantic "resolve pain link" operation returning the pain, its current slug, a redirect, or not found).
- Database: a migration adding slugs, aliases, retirement, launch set, detailed sections and extended provenance (`packages/database/src/migrations/`).
- Content editor: `apps/app/app/cms/index.tsx` (lock published IDs, slug approval, aliases, retire, launch-set highlight, detailed content, copy link).
- Rendering and hosting: link previews need per-page output; today `apps/app/app.json` uses `web.output: "static"`. Depends on the open rendering/hosting decision in `docs/architecture/decisions.md`; may need a decision record.

## Open questions

Numbered to match `confirm.md`, where each has options and a recommendation.

1. Do all opened pains on the personal and societal pages link to their pain page, or only the launch set? (001 FR-027 / 012 N4; specs assume all)
2. Where do detailed sections sit on a launch-set page? (012 N1)
3. What kinds of image are allowed? (012 N2)
4. Fixes on a pain page appear only once a dream is picked, as on the personal page? (012 N3; specs assume yes)
5. Does locking published IDs belong in this change or a separate content change?
6. How are per-pain link previews rendered, given the static web build? (may need a decision record)
7. Is AI drafting done outside It and pasted in, or a tool inside the editor?
8. What preview image do pains without their own image use?
9. For the record: pain-page view counting reverses 012 Q14/FR-020 per the 2026-10-19 invariant; the measurement change owns it.

Final copy for every new line (calm notes, device note, share line) is written or approved by the founder; placeholders are marked.
