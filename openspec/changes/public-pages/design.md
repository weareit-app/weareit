# Design

## Context

- The web build is static (`apps/app/app.json`, `"web": {"output": "static"}`), so each essay route is pre-rendered to HTML. Nothing in the app renders Markdown today.
- `packages/content` holds the content graph schema (Zod) and must stay free of Expo, React Native and UI imports. Feature fixes already carry `featureStatus: "planned" | "idea"` (`graph-schema.ts:7`), stored as `feature_status` (migration 005) and shown by `apps/app/src/components/personal/way-row.tsx` (`statusCopy`).
- Content is edited as a CMS draft and published as a version (`content.getPublished`, `cms.getDraft`). The CMS is one screen (`apps/app/app/cms/index.tsx`) behind the bootstrap admin token.
- `required-signup-gate` adds page chrome: a "Sign in" link when signed out, a menu when signed in (task 5.1). `embedded-support` (6.1), `help-build-it` (3.4) and `full-privacy-page` (2.2) each plan to add links to it. None of them owns a footer.
- `visit-measurement` owns the page-view list (one shared list, free of UI code) and the privacy-note-before-sending rule.

## Goals / Non-Goals

**Goals:**
- One link list drives the footer and the menu; other changes only add entries.
- Essays are plain files that the founder or an agent can edit and review in git; rich blocks are data, so they can be generated and validated.
- Essay text is readable as pre-rendered HTML with scripts off.

**Non-Goals:**
- A general page builder, MDX, or essays stored in the database.
- Native iOS rendering of essays or blocks.
- Interactive explorers inside essays, interest votes, or live data feeds in blocks.

## Decisions

1. **Essay files.** Each essay is `packages/content/essays/<slug>/essay.md` with front matter (`title`, `question`, `published`, `updated`, `changes: [{date, note}]`, `sources`). Block data files sit beside it (`<block-id>.json` or `.yaml`). A build-time script in `packages/content` parses the Markdown into a small typed tree (headings, paragraphs, lists, links, emphasis, footnote-style source refs, Markdown tables, and block placeholders), validates it and every block file with Zod, and writes a generated module the app imports. The app ships no Markdown parser. *Alternatives:* MDX (rejected by the founder: it makes essays code and puts UI imports into content); storing essays in the CMS (rejected: git history is the revision record the atlas asks for).

2. **Named blocks.** A placeholder is a Markdown directive line, `::chart{id="ai-incidents"}`, naming a block type and a data file. Types: `chart` (Vega-Lite spec plus data), `diagram` (Mermaid text), `math` (TeX; inline maths uses `$…$`), `evidence` (claim, source, date, status, limitation), `timeline`, `status-board`, `expandable` (title plus nested Markdown) and `table` (Markdown table or a data file). Each type has a Zod schema; `chart` must carry `source`, `unit`, `timeframe` and `updated`, and fails the build without them (the "Data shown with its context" requirement). Vega-Lite and Mermaid are declarative text, so an agent can generate a chart or diagram as data and the build can check it. *Alternative:* a hand-rolled chart component set (less flexible, more code to maintain).

3. **Drawn in the browser (founder choice).** Charts (Vega-Lite via `vega-embed`), diagrams (Mermaid) and maths (KaTeX, MathML output so screen readers read it) are drawn on the client, web only. Each library is loaded lazily, only on an essay that uses that block type, so the drawing libraries stay out of the explorer's bundle. (The web build has one entry bundle for every route, so the block components and essay renderer themselves add a few KB to it; splitting routes into their own bundles is a later option.) The pre-rendered HTML contains each block's fallback: a table generated from the chart's data, the diagram's written description, and the TeX source. Fonts used by these libraries are self-hosted. Each library is pinned and reviewed under `docs/architecture/dependency-policy.md` (newest release at least two weeks old) and checked with `expo install --check`.

4. **Publishing.** An essay route exists only when its front matter has `published: true` *and* it is listed in the link list. The essay routes are thin Expo Router files (`app/why.tsx`, …) that render the generated essay; unpublished ones return the not-found screen. In development, `?draft` shows unpublished essays locally (stripped in production builds).

5. **Link list.** A single typed list in the app (not in `packages/content`, since it knows about sign-in state and routes) of `{ group, label, href, when: "always" | "signed-in", webOnly }`. Footer (large screens, ≥ the `md` breakpoint) and menu (small screens always; large screens when signed in) both render from it. This change takes ownership of the menu's link section from `required-signup-gate` 5.1 and extends the menu to signed-out phones; that change keeps the menu button, Account and sign-out. `full-privacy-page` 2.2 becomes "add Privacy and FAQ to the link list", and is done by this change if it lands first.

6. **iOS.** `webOnly` links call `expo-web-browser`'s `openBrowserAsync` with the production web URL (an env setting). The in-app browser has its own cookies, so a page view from it is a separate web visit. That matches the measurement rules (no link between visits before signup).

7. **Statuses.** `featureStatuses` becomes `["shipped", "in-progress", "planned", "exploring", "idea"]`. Existing `planned` and `idea` values keep their meaning, so no data rewrite is needed. A migration widens the `feature_status` column's check and adds `status_changed_on` (date) and `status_note` (text) to fixes. `statusCopy` in `way-row.tsx` gains the three new labels and details; the Feature explanation depends on whether the status is `shipped`.

8. **Roadmap items.** A new content type in the graph schema: `{ id (readable stable ID), title, line, status, statusChangedOn, statusNote, sortOrder }`, stored in a `roadmap_items` table and published and rolled back with the content version. Fixes gain a nullable `roadmapItemId`. A connected fix has no status of its own: the graph schema rejects a connected fix that carries `featureStatus`, and the explorer and API read the item's status for it. That keeps one source of truth, so the roadmap and the explorer can't disagree. An unconnected Feature fix keeps its own status, date and note. The CMS gains a Roadmap section: items (full editing, plus picking connected Feature fixes) and unconnected Feature fixes (status, date, note). Saving a status change without a note fails Zod validation. A semantic public operation `roadmap.getPublished` returns items (each with its connected fixes and their pain IDs and slugs) and unconnected Feature fixes, grouped by status, read from the published version. *Alternative:* fixes keep their own status alongside the item's, which risks the two disagreeing. `/roadmap` loads it through TanStack Query. Its introduction is an essay file (`essays/roadmap/essay.md`) rendered above the list.

9. **Measurement.** The six new page views are added to the shared page-view list from `visit-measurement`. Each public page shows the same one-line privacy note as the explorer pages, and sends its page view only once that note is on screen. If `visit-measurement` has not landed, nothing is sent and the pages still work.

10. **Licensing page.** `/licensing` is an essay file whose license table is a Markdown table (no data file needed, and it renders as a table with scripts off), with rows taken from `docs/architecture/licensing.md` and a "today or planned" column. The ESCO and ISCED credit text lives in `packages/content/src/credits.ts` and is shared with `help-build-it`'s credit (task 1.1 there); a test checks the essay repeats it word for word, so the two never disagree.

## Risks / Trade-offs

- [Browser-drawn blocks need scripts and add weight] → Lazy-load per block type, fallbacks in the static HTML, and an essay-page bundle budget checked in CI.
- [Mermaid and Vega pull in large dependency trees] → Review the trees before pinning. If either is too heavy, pre-render that type to SVG at build time behind the same block schema; the essays don't change.
- [Overlap with `fix-evidence-levels`] → Its "Feature honesty kept" scenario says "Idea or Planned" and "never looks … available". Whichever change archives second updates that scenario to the five statuses and the Shipped exception.
- [Chrome ownership spread over four changes] → Decision 5 makes this change own the link list; tasks in the other changes are rewritten to add entries to it.
- [Essays in English while the app is bilingual] → The Spanish note sets expectations. The file layout leaves room for `essay.es.md` later.
- [In-app browser loses app state] → It opens on top of the app; closing it returns to the same screen, and on-device picks are untouched.

## Migration Plan

1. Ship the status migration and the schema change with `planned` and `idea` data unchanged; deploy the API before the app.
2. Ship the link list, footer and menu with only existing pages (Privacy, FAQ, contact).
3. Publish essays one at a time by flipping `published` and listing them. Rolling back an essay means setting `published: false`; rolling back roadmap content uses content-version rollback.

## Open Questions

- The essay-page bundle budget figure: set once the libraries are measured.
  - Chart block, measured 2026-10-20 (#43) with a production `expo export --platform web`: the lazily loaded chart chunk (vega 6.4.0, vega-lite 6.4.3, vega-embed 7.3.0, plus the block's drawing code) is 1,304 KB minified, 375 KB gzipped, 303 KB brotli. It loads only on a page that has a chart, when the chart is first rendered (not when it scrolls into view); the pre-rendered table and description need none of it. The web build has one entry bundle for every route, so the essay page (#41) and the explorer share it: the chart, evidence and table components add 4.9 KB minified (1.3 KB gzipped) to it, and no Vega code (measured against #41's branch; the lab and its sample data are development-only and folded out). About 750 KB of the chunk's source is the Vega-Lite compiler; compiling each chart to a Vega spec at build time would leave only `vega` in the browser, the cheaper step before the SVG pre-rendering in Risks. Diagram and maths chunks (#44) are still to be measured.
- Per-route bundles (Expo Router async routes), tried 2026-10-20 on the throwaway branch `claude/async-routes-spike` (not for merging), set as `asyncRoutes: { web: "production", default: false }` so iOS and development are unchanged. Measured with a production `expo export --platform web` against #67's head:
  - Static rendering still pre-renders every page in full: the render bundle is built without async routes, and all 15 pages' HTML is byte-identical to the one-bundle build apart from script tags. A test page with a chart keeps its fallback table (6 rows). Each page's HTML links its route's chunk as an ordinary script, so the first load has no waterfall; navigating inside the app fetches the chunk when it is needed. The explorer loads and hydrates as before; the one hydration error (React #418) is in both builds.
  - The explorer goes from 3 scripts (5,786 KB minified, 1,072 KB gzipped) to 5 scripts (5,718 KB, 1,059 KB gzipped): 13 KB gzipped smaller, because route-only code such as the lab and Support It also moves out.
  - The catch: on SDK 57 any module used by two or more routes goes into one `__common` chunk that every page loads. With `/why` and a second page both rendering essays, the renderer and blocks landed back in `__common`, so the explorer loaded them again. It only stayed out when all essays were served by one route file (`app/[essay].tsx` with `generateStaticParams`): the essay code was then a 26 KB (7 KB gzipped) chunk that only essay pages load. That route catches every unknown top-level path in the app, so its not-found handling would need care.
  - Expo's SDK 58 docs say async routes on web are stable and on by default there, and add an experimental granular chunking mode (`experiments.chunking.mode`) that groups shared code by the routes that use it, which removes the need for one essay route.
  - Recommendation: adopt after launch, with the SDK 58 upgrade and granular chunking, and check with the same export that the essay code stays out of the explorer's scripts. Not worth doing on SDK 57: the saving is about 1% of the explorer's download, and it needs a catch-all essay route to hold. The larger cost is elsewhere: the explorer downloads about 1 MB gzipped of shared code, and that is worth its own look.
