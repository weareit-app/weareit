# Proposal

## Why

The explorer lets people try out possibilities, but nothing public yet explains why It exists, what is actually built, what guides it, how it uses AI, or what larger risks motivate it. The Website Page Atlas v0.2 (`docs/source/We_Are_It_Website_Page_Atlas_v0.2_2026-10-16.md`) names nine priority pages and a footer to hold them, and the founder settled the first release on 2026-10-19: the footer, five essays and a licensing page. `docs/spec/features.md` has no section for these yet; this change adds one (§9).

## What Changes

What people see:

- **Footer** (large screens, every page): four groups from the atlas: *About It* (Why · Principles · Roadmap · Risks), *Research & building* (AI; Research and Technology later), *The possibilities* (Possibility and Future later) and *Take part* (Contact; Support and Help once signed in). Below them, one line: Privacy · FAQ · Licensing · `hello@weareit.app`. A link appears only once its page is published, and a group with no published pages is hidden, so there are no "coming soon" links.
- **Menu on phones, for everyone**: on small screens the same links sit in a menu, signed in or not. Signed out it also has "Sign in"; signed in it also has Account. This extends the signed-in menu from `required-signup-gate` to signed-out phones.
- **Five essays** at `/why`, `/roadmap`, `/principles`, `/ai` and `/risks`. Each is a readable article first (around 500 words to start), with a "last updated" date, a dated list of changes, sources next to the claims they support, and plain status labels ("working hypothesis", "open question", …). Essays can include charts, graphs, tables, maths, diagrams, evidence cards, timelines and expandable sections, generated from data kept beside the text. Pages can publish one at a time; launch does not wait for them.
- **`/roadmap`** lists what It is building, from the database: roadmap items for It's work (for example "Use It in Spanish"), some connected to Feature fixes in the explorer (shown with the pains they address), plus any Feature fix not connected to an item. Each shows one of five statuses: Shipped, In Progress, Planned, Exploring, Idea, with the date it last changed and what changed. The founder edits them in the CMS.
- **Feature fixes in the explorer** show the same five statuses instead of today's two (Idea, Planned). A Shipped feature says it is available; the others still say it isn't available yet.
- **`/licensing`**: what is open today and under which license, what is planned but not yet true, and credits for outside data (ESCO, ISCED) and fonts.
- **Language**: essays are English at launch. When the app is in Spanish, each essay opens with a short Spanish note saying the page is in English for now.
- **iOS**: the essays are built for the web. In the iOS app, footer and menu links to them open the web page in an in-app browser.
- **Writing**: this change includes an outline for each essay (`outlines/`). The founder writes `/why` and `/ai` from their outlines; `/roadmap`, `/principles` and `/risks` are drafted from theirs, then rewritten and approved by the founder.

Out of scope:
- `/research`, `/technology`, `/possibility` and `/future` (next change), and the atlas's idea bank (`/math`, `/learning`, …).
- A per-page "help move it forward" ask and prefilled `/help` links (founder, 2026-10-19: not needed yet).
- "I want this" interest counts on the roadmap (features.md §6 optional "Interest in roadmap items" stays open).
- Spanish translations of the essays; Terms (stays with `required-signup-gate`); topical aliases such as `/unemployment` (pains stay at `/p/<slug>`); native iOS rendering of essays; the safety floor.

Must leave room for:
- The next four essays and later topics as top-level routes, slotting into the existing groups.
- Spanish versions of each essay alongside the English file.
- Roadmap interest counts later (roadmap items have stable IDs).
- Pages that later link to pains, futures and roadmap items by stable ID (the atlas's "connected working spaces").

## Capabilities

### New Capabilities
- `site-navigation`: the footer on large screens and the menu on small screens: groups, which links show when, and how links to web-only pages behave in the iOS app.
- `public-essays`: essay pages: how they are published, their structure (dates, change list, sources, status labels), the named blocks they can contain, the Spanish note, and authorship.
- `roadmap`: the public `/roadmap` page and the roadmap items and statuses behind it.
- `licensing-page`: the public `/licensing` page.

### Modified Capabilities
- `pain-explorer`: Feature fixes carry one of five roadmap statuses (was Idea or Planned), and the Feature explanation depends on the status.
- `measurement` (introduced by `visit-measurement`): the page-view list gains `why`, `roadmap`, `principles`, `ai`, `risks` and `licensing`.

## Impact

- App: routes `/why`, `/roadmap`, `/principles`, `/ai`, `/risks`, `/licensing`; shared footer and menu; essay renderer and block components (web).
- Content: essay files and block data under `packages/content`; the graph schema's feature statuses; a roadmap item type with Zod validation.
- Database and API: a migration for the new statuses and roadmap items; a public oRPC operation that returns the published roadmap; CMS editing for roadmap items.
- Dependencies: pinned, reviewed web libraries for charts, diagrams and maths (`docs/architecture/dependency-policy.md`); `expo-web-browser` for in-app browsing on iOS.
- Docs: features.md §9; privacy page lists the new page views (`full-privacy-page`).
- Other changes: `required-signup-gate` (its menu is extended), `embedded-support` and `help-build-it` (they add their links to this change's link list), `full-privacy-page` (its footer task 2.2 is done here), `fix-evidence-levels` (also modifies "Ways it can be better").

## Open questions

None for the founder. Answered 2026-10-19:
- The code repository will be public at launch; `/licensing` links to it.
- `/risks` starts with six areas: powerful AI without oversight, concentrated power, rising inequality, climate change, lack of coordination, and the breakdown of shared information.
- `/why` names the founder by first name (Josh).
- The candidate roadmap in `outlines/roadmap.md` is the starting set; the founder will add more. Some roadmap items are connected to Feature fixes in the explorer.
