# Tasks

Builds after `required-signup-gate` task 5.1 (menu button and Account). Essays publish one at a time; the code groups (1–6) don't wait for the writing group (7).

## 1. Link list, footer and menu

- [x] 1.1 Add the typed link list (groups, label, href, `always`/`signed-in`, `webOnly`, published flag) and verify with a unit test that empty groups are dropped and `signed-in` links are hidden when signed out
- [x] 1.2 Build the large-screen footer from the list (four groups plus the Privacy · FAQ · Licensing · email line) on every page; verify in the web preview at desktop width, signed out and signed in
- [ ] 1.3 Extend the menu to signed-out small screens with the same groups, "Sign in" when signed out and Account when signed in; verify at phone width in the web preview and in the iOS simulator
- [ ] 1.4 Accessibility: labelled navigation landmark, menu `aria-expanded`, focus in and out, Escape closes, reduced motion; verify by keyboard-only and VoiceOver passes
- [ ] 1.5 Open `webOnly` links on iOS with `expo-web-browser` (`expo install`, pinned and recorded in `dependency-policy.md`); verify in the simulator that closing returns to the same screen with picks unchanged
- [x] 1.6 Rewrite the link tasks in `full-privacy-page` (2.2), `embedded-support` (6.1) and `help-build-it` (3.4) as "add an entry to the link list"; verify with `openspec validate --all`

## 2. Essay pipeline

- [x] 2.1 Define Zod schemas for essay front matter and each block type (chart, diagram, math, evidence, timeline, status-board, expandable, table) in `packages/content`; verify with schema tests, including a chart without `unit` or `source` failing
- [x] 2.2 Write the build-time script that turns `essays/<slug>/essay.md` plus block files into a validated generated module (choose and pin a Markdown and directive parser for the script only); verify with fixture tests covering every node and block type and a failing invalid block
- [x] 2.3 Wire the script into `turbo` so the app build and `typecheck` fail on an invalid essay; verify by breaking a fixture
- [x] 2.4 Document the essay format and block types in `packages/content/essays/README.md`, with one example of each block; verify the examples build

## 3. Essay pages

- [x] 3.1 Build the shared essay layout (title, question, text, status labels, source links, source list, "last updated", change list) and the static renderer for the typed tree; verify the pre-rendered HTML from `expo export --platform web` contains the full text
- [x] 3.2 Add the routes `/why`, `/principles`, `/ai`, `/risks`, `/roadmap` (intro) and `/licensing`, showing not-found unless the essay is published and listed; verify with a test for each state (#41 adds `/why` and the shared `EssayScreen`; each other route is a one-line file added with its essay)
- [ ] 3.3 Add the Spanish note (shown when the app language is Spanish; placeholder copy for founder approval); verify by switching language in the web preview
- [ ] 3.4 Show the one-line privacy note on each public page; verify it is on screen before any measurement call (test with the measurement client mocked)

## 4. Rich blocks (web)

- [ ] 4.1 Review and pin Vega-Lite/`vega-embed`, Mermaid and KaTeX (dependency trees, licences, two-week release age) and record them in `dependency-policy.md`; verify `expo install --check` passes
- [ ] 4.2 Build the chart block with lazy loading and a generated data-table fallback; verify the fallback in the HTML with scripts off and the drawn chart in the web preview
- [ ] 4.3 Build the diagram and maths blocks (Mermaid with written description fallback; KaTeX with MathML and self-hosted fonts); verify with VoiceOver that maths is read and nothing loads from a third-party host (network log)
- [ ] 4.4 Build evidence card, timeline, status board, expandable and table blocks; verify keyboard operation and announced expanded state
  - Timeline, status board and expandable: built and tested (#45); expandable is a native `<details>` disclosure, so it opens by keyboard and announces its state with scripts off.
- [ ] 4.5 Measure the essay-page bundle, set the budget in design.md, and add a CI check; verify the explorer's bundle is unchanged

## 5. Statuses and roadmap

- [ ] 5.1 Widen `featureStatuses` to five values in `graph-schema.ts` and `fixes.ts`, add `statusChangedOn`, `statusNote` and `roadmapItemId`, and reject a connected fix that has its own status; verify schema tests and that existing content still validates
- [ ] 5.2 Add the migration (status check widened, status date and note on fixes, `roadmap_items` table, nullable `roadmap_item_id` on fixes) and the import/publish path; verify with migration and repository tests, including rollback of a content version
- [ ] 5.3 Update `statusCopy` and the Feature explanation in `way-row.tsx` and `pain-row.tsx` (Shipped says available); verify with component tests for all five statuses
- [ ] 5.4 Add `roadmap.getPublished` to the oRPC contract and router (items with connected fixes, then unconnected Feature fixes, grouped by status, with pain slugs; connected fixes take the item's status); verify with an API test against a seeded published version
- [ ] 5.5 Add a Roadmap section to the CMS: Feature fix status, date and note; full editing of items, including connecting Feature fixes; a status change requires a note; verify with a CMS test that a connected fix shows the item's status in the explorer
- [ ] 5.6 Build `/roadmap` (intro essay, status groups with explanations, items with date, note and pain links) via TanStack Query; verify in the web preview and with a screen-reader pass
- [ ] 5.7 Update `fix-evidence-levels`' "Feature honesty kept" scenario for the five statuses and the Shipped exception; verify with `openspec validate --all`

## 6. Measurement, privacy and docs

- [ ] 6.1 Add `why`, `roadmap`, `principles`, `ai`, `risks` and `licensing` to the shared page-view list; verify the "lists match" check passes
- [ ] 6.2 Add the six page views to the privacy page's list of what is counted (`full-privacy-page`); verify the same check
- [ ] 6.3 Add features.md §9 "Public pages" (footer, five essays, roadmap, licensing, the Spanish note, the out-of-scope list) and note in `docs/spec/reviews/2026-10-18-founder-answers.md` that the menu now shows on signed-out phones (2026-10-19); verify the items cite this change

## 7. Writing (founder)

- [ ] 7.1 `/why`: founder writes from `outlines/why.md`; founder approves; publish
- [ ] 7.2 `/ai`: founder writes from `outlines/ai.md`, including the register of AI use; founder approves; publish
- [ ] 7.3 `/principles`: draft from `outlines/principles.md`; founder rewrites and approves; publish
- [ ] 7.4 `/risks`: draft the six areas from `outlines/risks.md` with sourced chart data; founder rewrites and approves; publish
- [ ] 7.5 `/roadmap`: enter the candidate items from `outlines/roadmap.md` in the CMS, connect the ones that match Feature fixes, and set statuses (founder adds more later); draft the intro from `outlines/roadmap.md`; founder approves; publish
- [ ] 7.6 `/licensing`: draft from `licensing.md` with the public repository link (public at launch); founder approves; publish
- [ ] 7.7 Before each publish, run the atlas's publishing checklist (stranger can follow it; facts, hypotheses and hopes separated; sources fair; privacy and safety considered) and record the result in the essay's first change note

## 8. Integration check

- [ ] 8.1 With two essays published and the rest not: verify footer, menu, routes, not-found pages, page views and the iOS in-app browser together on web (desktop and phone widths) and in the iOS simulator

## Workflow follow-up

- Archive after `visit-measurement` and `required-signup-gate` are archived, so the `measurement` and menu requirements land on their specs.
