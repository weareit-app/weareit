# Feature Specification: Entry links — land on one pain, no account

**Feature Branch**: `spec/012-entry-links` (spec directory `specs/012-entry-links`; number set by the founder, not sequential)

**Created**: 2026-10-17

**Status**: Draft (stops at founder review: no plan, no tasks, no code)

**Input**: User description: "Deep links that open the personal page (/p/<slug>) or societal page (/s/<slug>) with one pain already open. No personal data and no sharer/clicker identity in the link; arrival counts in coarse totals only. Stable, readable slugs per pain, independent of wording. Expo Router on web and iOS. Interaction with the on-device resumable draft. Custom per-topic landing pages are soon, not v0.1, and the link format must not block them. Which pains get links first is an open founder question." Source: `docs/spec/features.md` §2b (founder's words, added 2026-10-17).

All open questions are collected, with options and recommendations, in [`questions.md`](./questions.md). Each `[NEEDS CLARIFICATION]` marker below cites its question number.

## What People See and Do *(mandatory, write this first)*

Matches `docs/spec/features.md` §2b (three **core** items, one **?** item, one **✗ / soon** item).

- **Screen: Someone else's post, with a link** - A post, message or article about housing (or AI and jobs, or loneliness) includes a short, readable link such as `/p/<slug>` or `/s/<slug>` on It's web address. If the place it is posted shows link previews, the preview shows It's name and [NEEDS CLARIFICATION: a general It preview, or the pain's own name and line? (Q15)]. Nothing in the link or preview says who posted it or who will click it. - The person can tap the link.
- **Screen: Personal page, arrived by link** - The personal page ("What could be better for you?", spec 001) opens with the linked pain already open, showing its dreams, so the person sees what the post was about without hunting for it. The linked pain is [NEEDS CLARIFICATION: shown at the top of the page, or opened in its usual place with the page scrolled to it? (Q8)]. The rest of the page is the same as always: every other pain is there, the one-line privacy note is there, and nothing asks for an account. The welcome screen is [NEEDS CLARIFICATION: skipped or shown first? (Q9)]. - The person can pick dreams in the linked pain, close it, open any other pain, or go on to the societal page, exactly as in spec 001.
- **Screen: Societal page, arrived by link** - The same, for the societal page ("What could be better for us?", spec 002, not yet written) and a societal pain. - The person can do everything the societal page allows, and can reach the personal page [NEEDS CLARIFICATION: and must they visit it before signing up? (Q16)].
- **Screen: Arrived by link, already has picks on this device** - Someone who explored It before on this device follows a link. Their earlier picks and marks are all still there; the linked pain is open in addition. Nothing they picked before is changed, and nothing is picked for them. - Same as above.
- **Screen: Link to a pain that isn't there** - The link names a pain that was retired, was never published, or is mistyped. The right page opens normally with every pain closed and a short, calm note near the top, such as "That topic isn't on this page any more. Here's everything that is." [NEEDS CLARIFICATION: for a retired pain, open its replacement instead when the founder named one? (Q5)] - The person carries on as from the front door. No error page, no dead end.
- **Screen: Link with the wrong page letter** - A `/p/` link that names a societal pain (or `/s/` for a personal one). [NEEDS CLARIFICATION: open the right page with that pain open, or treat as not found? (Q7)]
- **Screen: Address bar after arriving** - The address bar shows the plain link (`/p/<slug>`), with anything a social site added to the end (tracking tags) removed. Reloading the page opens the same pain again. Opening other pains on the page [NEEDS CLARIFICATION: does not change the address, or does? (Q11)]. - The person can copy the address to pass it on; what they copy carries nothing about them.
- **Screen: Privacy page** (spec 010) - The "What we count" section says that arriving by a link is counted the same as any other visit, that It does not record which link or pain someone arrived on, and that links never identify who shared or clicked them.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - A post about housing lands on housing (Priority: P1)

The founder posts about rent in a community forum with a link to It. A reader taps it and sees the personal page with that pain open and its possible better futures in front of them, without searching a long list.

**Why this priority**: This is the whole point of §2b and the main way outreach turns into visits. Without it, a reader who came for one topic must find it among dozens of pains.

**Independent Test**: With a fresh browser, open a link for one published personal pain and one published societal pain; each opens the right page with exactly that pain open and its dreams visible, and nothing asks for an account.

**Acceptance Scenarios**:

1. **Given** a fresh device, **When** a person opens `/p/<slug>` for a published personal pain, **Then** the personal page opens with that pain open and its dreams visible, and every other pain is closed and available.
2. **Given** a fresh device, **When** a person opens `/s/<slug>` for a published societal pain, **Then** the societal page opens with that pain open (depends on spec 002).
3. **Given** a person arrived by link, **When** they pick dreams, open other pains or go on, **Then** everything works exactly as when arriving from the front door (spec 001).
4. **Given** a person arrived by link, **When** the page has opened, **Then** no dream, mark or pain has been picked on their behalf.
5. **Given** a person arrived by link, **When** they reload the page, **Then** the same pain opens again.

---

### User Story 2 - The link says nothing about who shared or clicked it (Priority: P1)

A reader worries that following a link about drinking or debt tells someone who they are, or tells It who sent it to them. Nothing in the link, the page, or what It sends identifies either person.

**Why this priority**: The privacy invariants (AGENTS.md) are non-negotiable and the founder put this in §2b as **core**. Pains can be sensitive; a link that tracked people would break trust at the first click.

**Independent Test**: Follow a link carrying added tracking tags from a social site; inspect the address bar, everything stored on the device, and everything sent. No tag, sharer or clicker identifier, or record of which pain the visit arrived on appears anywhere, and the counts sent are the same as for a front-door visit.

**Acceptance Scenarios**:

1. **Given** any link It publishes, **When** it is inspected, **Then** it contains only the page letter and the pain's slug: no personal data, no sharer or clicker identifier, no campaign or share code.
2. **Given** a link with extra tags appended by another site, **When** it is opened, **Then** the page ignores the tags, removes them from the address bar, and stores and sends none of them.
3. **Given** a visit that arrived by link, **When** everything sent before signup is inspected, **Then** it is the same coarse totals and stage funnel as any other visit, with no record of the pain, the slug, the link, or the page the person came from.
4. **Given** It's own pages, **When** the person follows any link from It to another site, **Then** It's address (and so the pain) is not passed to that site.
5. **Given** a visit that arrived by link, **When** the device storage is inspected, **Then** nothing records that the visit came by link or which link.

---

### User Story 3 - Links keep working when wording changes (Priority: P1)

The founder rewords a pain from "Poor sleep" to "Sleep". Links already posted last month still open that pain.

**Why this priority**: Posts live for years. A link that breaks when copy is improved punishes the founder for improving it. **core** in §2b.

**Independent Test**: Publish a new content version that changes a pain's name and line; the old link opens the same pain with the new wording.

**Acceptance Scenarios**:

1. **Given** a published pain with a slug, **When** its name, line, heading or order changes in a later published version, **Then** its slug and link are unchanged and still open it.
2. **Given** a published pain, **When** anyone tries to change its slug in the content editor, **Then** [NEEDS CLARIFICATION: the editor refuses, or the old slug keeps working as an alias? (Q2, Q4)].
3. **Given** a pain is retired, **When** its old link is opened, **Then** the person sees the page with a calm note (and the replacement pain if Q5 says so), never an error.
4. **Given** a retired pain's slug, **When** a new pain is created, **Then** it cannot take that slug.

---

### User Story 4 - Arriving with picks already on this device (Priority: P2)

Someone explored It last week and picked dreams under Loneliness. Today a friend sends a link about rent. They open it: rent is open, and their Loneliness picks are still there.

**Why this priority**: Pre-signup drafts are resumable and never expire (decisions.md). A link that wiped or reset them would lose people's work.

**Independent Test**: Make picks on the personal page, then open a link to a different pain on the same device; earlier picks and marks are unchanged and the linked pain is open.

**Acceptance Scenarios**:

1. **Given** picks and marks on this device, **When** a link to another pain is opened, **Then** all picks and marks are unchanged and the linked pain is open.
2. **Given** picks in the linked pain itself, **When** its link is opened, **Then** it opens showing those picks.
3. **Given** a link for the societal page and picks on the personal page, **When** it is opened, **Then** personal picks are unchanged and reachable.
4. **Given** device storage is unavailable, **When** a link is opened, **Then** the linked pain still opens for this visit and the usual "won't be remembered" note appears (spec 001).

---

### User Story 5 - A bad or old link still gets somewhere useful (Priority: P2)

A link is mistyped, cut off, or points to a pain that has since been retired. The person still lands on It, understands why the topic isn't open, and can explore.

**Why this priority**: Outreach links get mangled. A dead end costs the visit.

**Independent Test**: Open `/p/` with an unknown slug, a retired slug, an unpublished candidate pain's slug, mixed case, and a trailing slash; each lands on the right page without an error.

**Acceptance Scenarios**:

1. **Given** an unknown slug, **When** it is opened, **Then** the page opens normally with a short note and no pain open.
2. **Given** a slug for a pain that exists in the content editor but is not published, **When** it is opened, **Then** it is treated exactly like an unknown slug and reveals nothing about the draft.
3. **Given** a slug in different letter case or with a trailing slash, **When** it is opened, **Then** it opens the same pain as the plain slug.
4. **Given** a content-loading failure, **When** a link is opened, **Then** the page shows the usual message and retry (spec 001), and after a successful retry the linked pain opens.

---

### User Story 6 - The founder knows which links exist (Priority: P3)

The founder, preparing outreach, can see the link for each published pain [NEEDS CLARIFICATION: for every published pain, or only a launch set? (Q1)] and copy it.

**Why this priority**: The links are only useful if the founder can find them; but this is a convenience on top of the links themselves.

**Independent Test**: In the content editor (or a published list), find a pain and copy its link; it opens that pain.

**Acceptance Scenarios**:

1. **Given** a published pain, **When** the founder looks it up in the content editor, **Then** its slug and full link are shown and can be copied.
2. **Given** the founder's outreach list, **When** [NEEDS CLARIFICATION: launch set or all pains (Q1)], **Then** each pain in it has a working link before outreach starts.

### Edge Cases

- **Tracking tags appended by social sites** (campaign tags, click IDs): ignored, removed from the address bar, never stored or sent.
- **Mixed case, trailing slash, extra path segments**: case and trailing slash are ignored; anything after the slug is ignored [NEEDS CLARIFICATION: unless reserved for future landing pages (Q19)].
- **Linked pain is not a "main" pain** (it normally appears only under another pain's "More like this", `docs/spec/pains/pain-inventory.yaml` `main: false`): it still opens directly; it does not have to be reached through its parent.
- **Linked pain is also reachable from the other page** via "More like this": the slug belongs to one pain on one page; see Q7 for the wrong-letter case.
- **Linked pain has no dreams yet or no approved ideas**: cannot be in the published set (001 FR-012); if it slips through, it behaves as in 001's edge cases.
- **Person is signed in** (after the gate, spec 008) and follows a link: [NEEDS CLARIFICATION: open the page with their saved picks and the pain open, or something else? (Q17)].
- **Person clears the device** after arriving by link: the page stays as it is with the linked pain open, all picks cleared; the address is unchanged.
- **Shared or public computer**: the address bar and browser history show which pain was linked (the slug is readable on purpose). The page never adds more than the arrival link to history unless Q11 says otherwise.
- **iPhone**: in v0.1 the link opens It on the web in the phone's browser; whether it opens an installed It app is a research question (see Research Questions).
- **Unsafe content in a link** (very long slug, odd characters): treated as unknown; nothing from the link is shown on the page as text.
- **Link preview requests** from social sites: get only public content (no personal data exists to give), and are not counted as visits [NEEDS CLARIFICATION: confirm previews are excluded from totals (Q14)].

## Requirements *(mandatory)*

### Functional Requirements

**Opening a pain by link**

- **FR-001**: The personal page MUST open with one pain already open when reached at `/p/<slug>`, where `<slug>` is a published personal pain's slug (features.md §2b).
- **FR-002**: The societal page MUST open with one pain already open when reached at `/s/<slug>` for a published societal pain. This depends on spec 002 (not yet written) and on the societal page using the same opened-pain behaviour as spec 001.
- **FR-003**: Arriving by link MUST NOT require an account, and MUST NOT add any step before the page that arriving from the front door does not have [NEEDS CLARIFICATION: whether the welcome screen is skipped (Q9)].
- **FR-004**: The linked pain MUST be visible without scrolling on an ordinary phone, open, with its dreams showing [NEEDS CLARIFICATION: at the top of the page or in place (Q8)].
- **FR-005**: Opening a pain by link MUST NOT pick any dream, add any mark, or record the pain as chosen. The person's own actions are the only source of picks.
- **FR-006**: Everything else on the page MUST behave exactly as spec 001 (and 002) describe for a front-door visit, including the privacy note, the way on, and clearing the device.
- **FR-007**: Reloading at the link address MUST open the same pain again.

**What a link carries**

- **FR-008**: A link MUST consist only of It's address, the page letter (`p` or `s`) and the pain's slug. It MUST NOT carry personal data, a sharer or clicker identifier, a campaign or share code, or any value that differs per person, per post or per click.
- **FR-009**: Any extra parameters on an arriving link (for example tracking tags added by social sites) MUST be ignored, MUST NOT be stored or sent, and MUST be removed from the address bar so they are not passed on when the address is copied.
- **FR-010**: Arriving by link MUST be counted only as part of the coarse totals, the same as any other visit (§2b). It MUST NOT be counted or recorded as a separate kind of arrival, and It MUST NOT record which slug, pain, link, or referring site a visit arrived from — not on the device, not in what the app sends, and not in anything It keeps on its servers [NEEDS CLARIFICATION: how server and hosting request logs, which record the address requested, are kept from holding which pain a given connection asked for (Q12)].
- **FR-011**: The automatically opened pain MUST NOT distort the stage funnel [NEEDS CLARIFICATION: whether it counts as the "first pain opened" stage (Q14)]. Note: no measurement exists in code yet (`docs/roadmap/mvp.md`; spec 010); this requirement applies when it is built.
- **FR-012**: It's pages MUST NOT pass their address (and so the slug) to other sites when a person follows a link out of It, and MUST NOT load third-party resources that would receive it.
- **FR-013**: Link previews generated by other sites MUST contain only public content and nothing about any person [NEEDS CLARIFICATION: generic It preview vs the pain's name and line (Q15)].

**Slugs**

- **FR-014**: Every published pain MUST have exactly one slug: lowercase letters, digits and single hyphens, short and readable, unique across both pages. [NEEDS CLARIFICATION: whether the slug is the pain's existing stable ID or a separate field (Q2), and whether a slug names exactly one pain (Q3).]
- **FR-015**: A pain's slug MUST NOT change when its name, line, heading, order, dreams or ideas change.
- **FR-016**: Once a pain is published, its slug MUST keep opening that pain for as long as the pain is published. [NEEDS CLARIFICATION: whether a slug can ever be changed, and if so whether the old one keeps working as an alias (Q2, Q4).]
- **FR-017**: A slug that has ever been published MUST NEVER be given to a different pain, including after the original pain is retired.
- **FR-018**: The content editor MUST NOT allow a published pain's stable ID or slug to be edited in a way that breaks existing links or picks. (Today it allows editing any ID: `apps/app/app/cms/index.tsx`, `updateRecord`, field `"id"`.)
- **FR-019**: The founder MUST be able to see and copy each published pain's link in the content editor [NEEDS CLARIFICATION: which pains (Q1); who sets and approves slugs (Q4)].

**Unknown, retired and mismatched links**

- **FR-020**: A link with an unknown slug, or the slug of an unpublished pain, MUST open the named page with no pain open and a short calm note, and MUST NOT reveal whether an unpublished pain exists.
- **FR-021**: A link to a retired pain MUST open the named page with a short calm note [NEEDS CLARIFICATION: or the replacement pain the founder named (Q5)].
- **FR-022**: A link whose page letter does not match the pain's page [NEEDS CLARIFICATION: opens the correct page with that pain open, or is treated as unknown (Q7)].
- **FR-023**: Slugs MUST be matched without regard to letter case or a trailing slash.
- **FR-024**: Nothing taken from the link MUST be shown back on the page as text (only content It published).

**On-device draft**

- **FR-025**: Arriving by link MUST keep every pick and mark already on the device unchanged (decisions.md: drafts are resumable and do not expire).
- **FR-026**: If the linked pain already has picks on this device, it MUST open showing them.
- **FR-027**: Nothing about the arrival (that it was by link, which link, which pain) MUST be stored on the device beyond the address the browser itself shows [NEEDS CLARIFICATION: whether in-page opening of other pains changes the address and so the browser history (Q11)].

**Platforms**

- **FR-028**: Links MUST work on the web in every browser It supports, including phone browsers.
- **FR-029**: In the iOS build of the app, the same pages MUST be able to open with one pain open from an in-app route, so that a later decision to open links in the installed app is not blocked. Whether public links open the installed app (universal links) is a research question, not a v0.1 requirement [NEEDS CLARIFICATION: confirm v0.1 is web-only for links (Q18)].

**Not blocking what's next**

- **FR-030**: The link format MUST NOT block custom per-topic landing pages (headline, sourced context, counts of people who share the pain), which are not in v0.1 (§2b ✗ / soon). Links shared in v0.1 MUST keep working when landing pages arrive, either by continuing to open the pain or by showing the landing page with a clear way into the pain [NEEDS CLARIFICATION: same address upgraded in place, or a separate address (Q19)].
- **FR-031**: The link format MUST leave room for other link kinds later (for example a dream, when starting from a dream arrives, or a roadmap item for Help) without changing the meaning of `/p/` and `/s/` links.
- **FR-032**: Entry links MUST NOT be used as invitations. If invitations (optional in v0.1) record who invited whom, that MUST be a separate mechanism; entry links never gain an inviter identifier.
- **FR-033**: [NEEDS CLARIFICATION: whether people get a "copy link to this pain" control in v0.1, or links are for the founder's outreach only (Q20)].

### Key Entities

- **Pain** (existing, spec 001): gains a **slug**. Has a page (personal or societal; `world` in code), a stable ID that never changes once published (001 FR-020; decisions.md), and a published or retired state.
- **Slug**: the short readable name in the link. Belongs to one pain, unique across both pages, never reused. [NEEDS CLARIFICATION: same as the stable ID or separate (Q2).]
- **Slug alias** (only if Q2/Q4 choose it): an older slug that still opens its pain.
- **Retired pain**: a pain no longer published. Its slug stays reserved; it may name a replacement pain (Q5).
- **Entry link**: page letter + slug. Carries nothing else. Not stored anywhere when followed.
- **On-device draft** (existing): unchanged by arrival; no new fields.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: For every pain with a link, opening it on a phone shows that pain open with its dreams visible within 3 seconds on an ordinary mobile connection, with no extra taps.
- **SC-002**: 100% of links posted before a content change still open the same pain after the change (tested by rewording every launch-set pain in a staging version).
- **SC-003**: An independent review of the address bar, device storage, everything the app sends and what It's servers keep after following a link with added tracking tags finds no tag, no sharer or clicker identifier, and no record of the slug or pain tied to that visit.
- **SC-004**: Counts sent for a visit that arrived by link are indistinguishable from those of a front-door visit with the same actions.
- **SC-005**: Unknown, retired, unpublished, mixed-case and trailing-slash links all land on a working page in 100% of tested cases; none shows an error page.
- **SC-006**: A person with existing picks who follows a link keeps 100% of their picks and marks in tested cases.
- **SC-007**: Before outreach starts, every pain on the founder's outreach list has a working link [depends on Q1].

## It Checks *(mandatory)*

### Privacy

- **Before signup, stays on device**: the existing draft (picks, marks, content version), unchanged. The arrival link itself is held only in the browser's own address bar and history; It stores nothing about it.
- **Before signup, sent** (coarse totals / stage funnel only, disclosed in UI): the same coarse totals and stage funnel as any visit (001 FR-014). Not sent: the slug, the pain, that the visit came by link, the referring site, any tracking tags. Measurement is not yet built (`docs/roadmap/mvp.md`).
- **After signup, stored on server**: nothing new. The entry pain is not saved unless the person picked dreams in it, and then only as an ordinary pick (spec 008).
- **Never public by default**: who shared or clicked any link (It never knows); which pains anyone arrived on. Future landing-page counts of "people who share this pain" are public aggregates and need their own small-count rule when that feature is specified.
- **Where a link could still leak**: (1) request logs on It's servers or hosting record which address was requested, alongside network details (Q12); (2) the person's own browser history and address bar on a shared device; (3) the site where the link was posted already knows who posted and, often, who clicked — It cannot change that and must not add to it; (4) It's pages passing their address to other sites (FR-012). The privacy page (spec 010) MUST describe (1)–(3) honestly.

### Honest Status

N/A for new content: entry links show the existing page and its labelled ideas (spec 001). The "not found" and "retired" notes must say plainly that the topic isn't there, not pretend it is coming.

### Must Not Block

- **Custom per-topic landing pages (✗ in v0.1, soon)**: links shared in v0.1 keep working when landing pages arrive (FR-030); slugs are stable and readable enough to serve as topic names; nothing in the link format fixes the page to "pain opened and nothing else".
- **Starting from a dream instead of a pain (soon)**: the format leaves room for other link kinds (FR-031).
- **Sharing a future or path (soon)**: entry links carry no picks; a future "share my path" must be an explicit act on a separate copy and a different kind of link.
- **Invitations (optional)**: kept separate from entry links (FR-032).
- **Native iOS (optional)**: pages can open with a pain open from an in-app route (FR-029), so universal links can be added later.

### Accessibility

- Keyboard: on arrival, focus lands on the linked pain's heading so a keyboard user starts where the link pointed; every control works as in spec 001.
- Screen reader (incl. expanded/collapsed state): the linked pain is announced as open, with its name; the not-found note is announced once, politely.
- Reduced motion: any scroll to the linked pain is instant, not animated, when reduced motion is on.
- Meaning never by colour alone: the opened state and the not-found note use words, not colour alone.

### Research Questions

- Which link-sharing places (forums, social apps, messaging apps, email clients) strip, rewrite or append to links, and do readable slugs survive them?
- Do readable slugs (`/p/<slug>`) get more taps than generic links in outreach posts? (Answerable only from the posting platform's own numbers, since It does not count which link was used.)
- iOS universal links: what does opening links in an installed Expo app need (associated domains, a hosted association file, App Store build), what happens when the app is not installed, and does it change any privacy property (for example, Apple's handling of association files)?
- Expo Router on web with static output: can per-pain link previews stay current when content is published from the database without rebuilding, or do they need request-time rendering (decisions.md, Rendering)?
- Which hosting setups can serve these pages without keeping request logs that pair a pain's address with a person's network details?
- Do people arriving on one pain explore other pains, or leave after that one?  (Only answerable through the stage funnel, never per link.)

## Existing code and content (changes from what exists)

| Area | What exists today | Change this spec implies |
|---|---|---|
| Pain identity | Pains already have kebab-case string IDs, validated by `^[a-z0-9]+(?:-[a-z0-9]+)*$` in `packages/content/src/schema.ts` and `packages/content/src/graph-schema.ts`; 31 launch pains in `packages/content/src/tier-1.ts` (e.g. `poor-sleep`, `unemployment`). | Decide whether the ID is the slug (Q2). If separate, add a slug field with the same pattern. |
| Database | `content_pains.id` is a text primary key; no slug, no retired state, no alias table (`packages/database/src/migrations/001_initial_content.ts`). Domains have `scope in ('personal','world')`. Published content is an immutable JSON snapshot per version (`published_content_versions`). | Slug (or locked ID), retired state, reserved/alias slugs (Q2, Q5). |
| Content editor | `apps/app/app/cms/index.tsx` `updateRecord` lets the editor change any record's `id`, cascading to links in the draft. Nothing stops renaming a published pain's ID. | Lock ID and slug after first publish (FR-018); show and copy links (FR-019). |
| Pain inventory | `docs/spec/pains/pain-inventory.yaml`: 125 pains (31 `current`, 94 `candidate`), `id` documented as "Stable id" (`pain-inventory.md`). IDs keep earlier wording while names changed (`poor-sleep` is now "Sleep", `out-of-shape` is "Fitness") — evidence that IDs already survive rewording. `ai-and-jobs` exists (societal); there is no `housing` ID: housing is spread over `home-is-hard`, `might-lose-my-home`, `homeless`, `cold-home` (personal) and `rent-eats-everything`, `homelessness` (societal). No `retired` status. | Q2/Q3: the founder's example `/p/housing` does not match any pain ID. Spec 001's assumption of 85 pains (47/38) is out of date with this file. |
| Routes | `apps/app/app/index.tsx` (welcome, "Get started" → `/onboarding/personal`), `apps/app/app/onboarding/personal.tsx`, `world.tsx`, `futures.tsx`. No `/p/` or `/s/` routes. Personal page today lets people toggle pains as selections, then shows futures on a separate screen; spec 001's "pain opens in place" is not built yet. | New entry routes; depend on 001's opened-pain behaviour (and 002's). |
| On-device draft | `packages/domain/src/onboarding.ts` (`onboardingDraftSchema`: `personalPainIds`, `worldPainIds`, `personalDreamIds`, `worldDreamIds`, `helpInterests`, `draftUpdatedAt`); persisted by `apps/app/src/state/onboarding-store.ts` under `it-onboarding-draft-v1` (localStorage on web, `apps/app/src/storage.ts`). Pains are stored as selections. | Arrival must not add to `personalPainIds`/`worldPainIds` or any field (FR-005, FR-027). |
| App config | `apps/app/app.json`: `scheme: "weareit"` (custom scheme), `web.output: "static"`, no iOS associated domains. | Public links are web addresses; universal links are a research question (FR-029). |
| Rendering | `docs/architecture/decisions.md` → Rendering: static output first; evaluate server output for dynamic share previews; depends on hosting (open). | Q15 (previews) and Q12 (logs) depend on this. |
| Research contract | `docs/spec/pieces.yaml`: `catalog` has `retire(itemId)`; `telemetry` still names a session-scoped id (superseded by CONFLICTS C9); `invitation` is `mvp: false`. | No piece covers entry links. A new piece may be wanted (ids must stay stable; validate with `uv run docs/spec/tools/validate_pieces.py`). Not added here. |
| Measurement | Not built. | FR-010, FR-011 apply when it is. |
| Slugs anywhere | No "slug" appears in code, migrations or specs (before §2b). | — |

## Dependencies and Conflicts with Other Specs

- **001 personal page** (master): entry links open 001's "opened pain" state, which is specified but not built. 001 FR-020 (stable IDs) is the base for slugs. 001 FR-014's "first pain opened" stage is affected by the auto-opened pain (Q14). 001's privacy section lists "which pains were opened" as on-device only, which this spec keeps. 001's assumption of 85 pains is out of date (125 in the inventory).
- **002 societal page** (not written): `/s/` links depend on it. 002 should adopt the same opened-pain behaviour, slug rules and not-found note. Code calls this page `world`; the link letter `s` follows the founder's wording.
- **007 watercolor dot / loader** (branch `explore/living-loader`, read only): the loader covers content loading states and a welcome mark. A link arrival loads content before the pain can open, so the loader appears there; if the welcome screen is skipped on link arrival (Q9), the welcome mark is not seen by these visitors.
- **008 signup gate** (branch `spec/008-signup-gate`): the gate sits at the bottom of the societal page. Questions: must someone who arrived at `/s/` visit the personal page before the gate (Q16)? Does a signed-in person following a link see their saved picks (Q17)? The entry pain is not a pick and must not be sent at signup unless picked (consistent with 008 Q19 on bare pain selections). Going back from the gate should return to the page with the pain still open if it was.
- **009 support page** (branch `spec/009-support-page`): no direct interaction. Support comes after signup and is never an entry-link target in v0.1. The support return address carries a payment reference (see 010's mismatch M7); it must never be offered as a shareable link, and entry links never carry such references.
- **010 safety floor + privacy page** (branch `spec/010-safety-privacy`): the privacy page MUST say that arrival by link counts like any visit and that It does not record which link or pain, and MUST describe the remaining leaks honestly (request logs, browser history, the posting site). FR-012 (no address passed to other sites) and "no third-party trackers" align with 010 FR-004. Crisis resources should stay reachable when arriving on sensitive pains by link (no change needed if 010 puts them on every screen).
- **011 help page** (assessment on branch `assess/help-page`): no v0.1 interaction. Linking to a roadmap item later is left open by FR-031.
- **Invitations** (features.md Stages, optional): features.md says accounts may record who invited whom. Entry links must stay identifier-free; invitations, if built, are separate (FR-032).
- **features.md "Sharing a future or path" (soon)**: distinct from entry links; entry links share a topic, never a person's picks.

## Assumptions

- Links use It's main web address; the exact domain is not decided here (hosting is open, decisions.md).
- v0.1 links and pain content are English only; localised slugs are not in scope and not blocked (a slug is an identifier, not copy).
- Only published pains have working links; candidate pains in the inventory have no link until published.
- "Counts in the coarse totals like any other visit, nothing more" (§2b) means arrival by link is not distinguished from any other arrival, even without naming the pain. If the founder wants a link-vs-front-door count, that is a change needing a privacy-page update (noted in Q14).
- The link letter for the societal page is `s` (founder's example `/s/ai-and-jobs`), even though code calls it `world`.
- The founder's examples (`/p/housing`, `/s/ai-and-jobs`) illustrate the format; they are not a decision on specific slugs (Q3).
