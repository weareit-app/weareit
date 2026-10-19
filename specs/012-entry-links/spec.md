# Feature Specification: Pain pages and entry links — one page per pain, no account

**Feature Branch**: `spec/012-entry-links` (spec directory `specs/012-entry-links`; number set by the founder, not sequential)

**Created**: 2026-10-17 · **Revised**: 2026-10-18 after founder review (model changed from "list page with one pain open" to "a page for one pain")

**Status**: Draft (stops at founder review: no plan, no tasks, no code)

**Input**: `docs/spec/features.md` §2b, revised at the founder's direction on 2026-10-18, plus the founder's answers to this spec's first questions (recorded in [`questions.md`](./questions.md)). Remaining `[NEEDS CLARIFICATION]` markers cite questions numbered N1 and up in that file.

## What People See and Do *(mandatory, write this first)*

Matches `docs/spec/features.md` §2b (all items core except the ✗ line).

- **Screen: Someone's post, with a link** - A post, message or article about rent (or AI and jobs, or loneliness) includes a short readable link on It's web address, such as `/p/rent-eats-everything`. Where link previews are shown, the preview shows the pain's title and its image. Nothing in the link or preview says who posted it or who will click it. - The person can tap the link.
- **Screen: Pain page (basic)** - Every published pain, personal or societal, has one. No welcome screen first. It shows the pain's short name and first-person line, then "What does better look like?" with the pain's dreams to pick, and fixes for picked dreams, each with its plain label (do now / already exists / It might build / change for society), exactly as an opened pain works on the personal page (spec 001). The one-line privacy note is near the top. At the bottom: **See more pains**, and **Share this topic**. - The person can pick and unpick dreams, select and unselect fixes, read sources, share the page, or go on to see more pains. Nothing asks for an account.
- **Screen: Pain page (detailed, launch set)** - The same page, plus a fuller account of the pain: a few short sections of plain text with sources, and images and visualizations (for example a sourced chart of how common the pain is or how costs have changed) where they help. Every claim and chart has a visible, dated source. There are no counts of people on It who share the pain. [NEEDS CLARIFICATION: where the detailed sections sit relative to the dreams (N1); what kinds of image are allowed (N2)] - Same as above, plus reading the detail and opening sources.
- **Screen: See more pains** - Takes the person into the normal flow: the personal page (spec 001), then the societal page (spec 002), then the signup gate (spec 008). Anything picked on the pain page is already there, as the same picks. If the linked pain is on the personal page, it shows with its picks when they get there; if it is a societal pain, it shows with its picks on the societal page. - The person continues as anyone else would.
- **Screen: Share this topic** - Opens the device's share options (or copies the link where there are none). What is shared is only the pain page's plain link: never the person's picks, and never any tracking tag. A short line says so. - The person can share, copy or cancel.
- **Screen: Link that leads nowhere** - The slug is unknown, mistyped, or belongs to a pain that isn't published. The personal page opens with a short calm note near the top, such as "That topic isn't here. Here's where to start." Nothing reveals whether an unpublished pain exists. - The person carries on from the start of the flow.
- **Screen: Retired pain** - If the founder named a replacement when retiring the pain, its replacement's page opens (address updated to the replacement's slug). If not, the personal page opens with a calm "That topic isn't here any more" note. - As above.
- **Screen: Old slug** - A pain whose slug was changed: the old link opens the same pain page, and the address bar shows the current slug.
- **Screen: Signed in, following a link** - The same pain page, showing the person's saved picks and selected fixes; any change saves to their account automatically (spec 008). The pre-signup "clear everything on this device" control does not appear. - Same as above.
- **Screen: Privacy page** (spec 010) - Says that arriving by a link counts as an ordinary visit, that It does not count which link or pain anyone arrived on, that links never identify who shared or clicked them, and what hosting request logs may hold and for how long.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - A post about rent lands on rent (Priority: P1)

The founder posts about rent in a community forum with a link. A reader taps it and lands on a page about that one pain: what it is, what better could look like, and fixes they can select, without hunting through a list.

**Why this priority**: The core of §2b and the main way outreach becomes visits.

**Independent Test**: In a fresh browser, open the link for one published personal pain and one published societal pain; each opens its pain page directly with dreams to pick, with no welcome screen and no account prompt.

**Acceptance Scenarios**:

1. **Given** a fresh device, **When** a person opens `/p/<slug>` for any published pain (personal or societal), **Then** that pain's page opens directly, without the welcome screen.
2. **Given** a pain page, **When** the person picks a dream, **Then** its fixes appear with their labels, and fixes can be selected and unselected, exactly as on the personal page (spec 001) [NEEDS CLARIFICATION: confirm fixes appear only under picked dreams, as in 001 (N3)].
3. **Given** a pain page, **When** it opens, **Then** nothing is picked or selected on the person's behalf.
4. **Given** a pain page, **When** the person reloads it, **Then** the same page opens with their picks.
5. **Given** a pain page before signup, **When** it opens, **Then** the one-line privacy note is visible near the top.

---

### User Story 2 - Launch-set pages explain the pain (Priority: P1)

A reader who arrives on a launch-set pain sees a page that takes the pain seriously: short sections, sources, and an image or a chart where it helps, so they trust that It understands it before being asked to pick anything.

**Why this priority**: The founder moved detailed pages into v0.1 for the outreach launch set. Outreach links point at these pages first.

**Independent Test**: Open every launch-set pain page; each has founder-approved detailed sections, every claim and chart has a visible, dated source, and no page shows counts of people on It.

**Acceptance Scenarios**:

1. **Given** a launch-set pain, **When** its page opens, **Then** it shows detailed sections approved by the founder, with images and visualizations where the content includes them.
2. **Given** any factual claim, statistic or chart on a pain page, **When** the person looks for its source, **Then** a source with a date is shown next to it or one tap away.
3. **Given** any pain page, **When** it is inspected, **Then** it shows no count of people on It who share, picked or viewed the pain.
4. **Given** a pain not in the launch set, **When** its page opens, **Then** it shows the basic page (pain, dreams, fixes) with no empty placeholders for missing detail.
5. **Given** the content editor, **When** the founder marks a pain as part of the launch set, **Then** its detailed content can be drafted, reviewed with sources, and published like other content.

---

### User Story 3 - The link says nothing about who shared or clicked it (Priority: P1)

A reader worries that following a link about drinking or debt tells someone who they are, or tells It who sent it. Nothing in the link, the page, or what It keeps identifies either person.

**Why this priority**: AGENTS.md privacy invariants; §2b core.

**Independent Test**: Follow a link with tracking tags added by a social site; inspect the address bar, device storage, everything sent, and what It's servers keep. No tag, sharer or clicker identifier, or record of which pain the visit arrived on appears, and counts match a front-door visit.

**Acceptance Scenarios**:

1. **Given** any link It publishes or a person shares from a pain page, **When** it is inspected, **Then** it contains only It's address, `/p/` and the slug.
2. **Given** a link with tags added by another site, **When** it is opened, **Then** the tags are removed from the address bar and are never stored or sent.
3. **Given** a visit that arrived by link, **When** everything sent before signup is inspected, **Then** it is counted only as an ordinary visit, with no record of the pain, slug, link or referring site.
4. **Given** "Share this topic", **When** the person shares, **Then** only the plain page link is shared, never picks or selected fixes.
5. **Given** It's pages, **When** the person follows a link out (for example to a source), **Then** It's address (and so the pain) is not passed to that site.

---

### User Story 4 - From one pain into the whole flow (Priority: P1)

After picking a better future for rent, the reader taps "See more pains" and continues through the personal page, the societal page and the signup gate, with their rent picks carried along and saved at signup.

**Why this priority**: The pain page is a door into It, not a dead end; picks made there must count.

**Independent Test**: Pick a dream and select a fix on a pain page, tap "See more pains", walk to the gate and sign up; the saved account has exactly those picks with their pain and content version.

**Acceptance Scenarios**:

1. **Given** picks on a pain page, **When** the person taps "See more pains", **Then** the personal page opens and the picks are the same on-device picks used everywhere else.
2. **Given** picks on a societal pain's page, **When** the person reaches the societal page, **Then** that pain shows with those picks.
3. **Given** picks made on a pain page, **When** the person signs up (spec 008), **Then** they are sent with everything else: picked dreams with their pain and content version, selected fixes with content version.
4. **Given** existing picks on the device from an earlier visit, **When** a link to another pain is opened, **Then** all earlier picks and selected fixes are unchanged.
5. **Given** device storage is unavailable, **When** a pain page is used, **Then** picks work for the visit and the usual "won't be remembered" note appears (spec 001).

---

### User Story 5 - Links keep working (Priority: P2)

The founder rewords a pain, changes its slug, or retires it in favour of a better-worded one. Links posted months ago still lead somewhere sensible.

**Why this priority**: Posts live for years.

**Independent Test**: Publish versions that reword a pain, change a slug, and retire a pain with and without a replacement; old links open the same page, the current slug, the replacement, or the personal page with a note.

**Acceptance Scenarios**:

1. **Given** a pain's wording, heading or detailed content changes, **When** its link is opened, **Then** the same pain page opens with the new content.
2. **Given** a pain's slug was changed, **When** the old slug is opened, **Then** the pain page opens and the address shows the current slug.
3. **Given** a pain retired with a named replacement, **When** its link is opened, **Then** the replacement's page opens.
4. **Given** a pain retired with no replacement, **When** its link is opened, **Then** the personal page opens with a calm "not here any more" note.
5. **Given** an unknown or unpublished slug, **When** it is opened, **Then** the personal page opens with a calm note and nothing reveals whether a draft exists.
6. **Given** any slug that has ever been published (current or alias), **When** a new pain is created, **Then** it cannot take that slug.

---

### User Story 6 - Signed-in visitors (Priority: P3)

Someone who already signed up follows a link a friend posted. They see the same page with their saved picks, and anything they change saves to their account.

**Why this priority**: Fewer people at launch, but it must not break or fork their picks.

**Independent Test**: Sign in, open a pain page, change a pick; the account reflects it without a save step, and no "clear this device" control appears.

**Acceptance Scenarios**:

1. **Given** a signed-in person, **When** they open a pain page, **Then** their saved picks and selected fixes for that pain are shown.
2. **Given** a signed-in person, **When** they change a pick, **Then** it saves to their account automatically (spec 008).
3. **Given** a signed-in person, **When** they view the page, **Then** the pre-signup "clear everything on this device" control is not shown.

---

### User Story 7 - The founder finds and shares links (Priority: P3)

Preparing outreach, the founder opens the content editor, sees which pains are in the launch set, and copies their links.

**Independent Test**: In the editor, filter to the launch set and copy a link; it opens that pain's page.

**Acceptance Scenarios**:

1. **Given** a published pain, **When** the founder views it in the editor, **Then** its current slug, any old slugs, and its full link are shown and can be copied.
2. **Given** the launch set, **When** the founder views the pain list, **Then** launch-set pains are highlighted and show whether their detailed content is published.
3. **Given** a pain being published for the first time, **When** the founder publishes, **Then** they approve its slug (defaulting to the pain's ID) as part of publishing.

### Edge Cases

- **Tracking tags appended by social sites**: removed from the address bar on arrival; never stored or sent.
- **Mixed case or trailing slash**: open the same page as the plain slug, and the address shows the plain slug.
- **Extra path segments or odd characters**: treated as unknown; nothing from the link is shown on the page as text.
- **Pain normally only reachable through another pain's "More like this"** (`main: false` in the inventory): its page works like any other.
- **A pain with no approved fixes for a dream**: cannot be published (001 FR-012); if one slips through, 001's "on the way" message appears.
- **Detailed content partly missing** for a launch-set pain (for example no chart yet): the page shows what exists; no empty boxes or "coming soon" placeholders.
- **Image or chart fails to load**: the text alternative is shown; the rest of the page works.
- **Person clears the device** on a pain page (pre-signup): all picks clear; the page stays open.
- **Shared or public computer**: the address and browser history show which pain page was visited (readable on purpose). Opening other pains through the normal flow does not add pain addresses to history beyond the pages actually visited.
- **Content fails to load**: the usual message and retry (spec 001); after a retry the pain page opens.
- **Link-preview fetches by other sites**: get public content only, and are not counted as visits.
- **iPhone**: in v0.1 the link opens It on the web in the phone's browser.

## Requirements *(mandatory)*

### Functional Requirements

**Pain pages**

- **FR-001**: Every published pain, personal or societal, MUST have its own page at `/p/<slug>`. There is one prefix for all pains; there is no `/s/`.
- **FR-002**: Arriving by link MUST go straight to the pain page, without the welcome screen, and nothing on it may require an account.
- **FR-003**: Every pain page MUST show the pain's short name and first-person line, its dreams to pick, and fixes for picked dreams with their plain labels, behaving exactly as an opened pain does in spec 001 [NEEDS CLARIFICATION: N3].
- **FR-004**: Pain pages for the launch set MUST also show detailed content about the pain: short plain-language sections, and images and visualizations where they help [NEEDS CLARIFICATION: section placement (N1); image kinds (N2)].
- **FR-005**: Every factual claim, statistic, image credit and chart on a pain page MUST have a visible source with a date. Visualizations MUST use only sourced outside data.
- **FR-006**: Pain pages MUST NOT show counts of people on It who share, picked or viewed the pain (not in v0.1), or any other figure drawn from It's own visitors.
- **FR-007**: Detailed content MUST be drafted (AI drafting allowed), approved by the founder, and stored in the content editor with its sources, published and versioned like other content (decisions.md: database + CMS). Unapproved content MUST NOT appear.
- **FR-008**: Pain pages not in the launch set MUST show the basic page with no placeholders for missing detail.
- **FR-009**: Before signup, every pain page MUST show the one-line privacy note (spec 010) and the "clear everything on this device" control; after signup the clear control MUST NOT be shown.
- **FR-010**: Every pain page MUST offer **See more pains**, which leads into the normal flow: personal page → societal page → signup gate (specs 001, 002, 008).
- **FR-011**: Every pain page MUST offer **Share this topic**, which shares only the page's plain link (`/p/<slug>`), using the device's share options where available and copying the link otherwise, and says that picks are not shared.
- **FR-012**: [NEEDS CLARIFICATION: whether pains on the personal and societal pages link to their own pain pages (N4)]

**Picks**

- **FR-013**: Picks and selected fixes made on a pain page MUST be the same on-device picks used by the personal and societal pages, with the content version recorded, and MUST appear there when the person reaches them.
- **FR-014**: Picks made on a pain page MUST be sent at signup with all others, as spec 008 defines: picked dreams with their pain and content version, and selected fixes with content version.
- **FR-015**: Opening a pain page MUST NOT pick a dream, select a fix, or record the pain as chosen.
- **FR-016**: Arriving by link MUST keep every pick and selected fix already on the device unchanged.
- **FR-017**: A signed-in person MUST see their saved picks on a pain page, and changes MUST save to their account automatically (spec 008).

**What a link carries**

- **FR-018**: A link MUST consist only of It's address, `/p/` and the slug. It MUST NOT carry personal data, a sharer or clicker identifier, a campaign or share code, or any value that differs per person, post or click. Links produced by "Share this topic" follow the same rule.
- **FR-019**: Extra parameters on an arriving link (for example social tracking tags) MUST be removed from the address bar on arrival and MUST NOT be stored or sent.
- **FR-020**: Arriving by link MUST count only as an ordinary visit. It MUST NOT count or record which slug, pain, link or referring site a visit arrived from, on the device, in what the app sends, or in anything It keeps. Picks on a pain page count as the usual stages; the stage list is owned by the measurement spec (new, not yet written).
- **FR-021**: Hosting MUST be set up so request logs drop or truncate visitors' network addresses and requested paths where the host allows; where it does not, logs MUST be kept only briefly, never analysed, and disclosed on the privacy page (spec 010).
- **FR-022**: It's pages MUST NOT pass their address to other sites when a person follows a link out, and MUST NOT load third-party resources that would receive it.
- **FR-023**: Link previews MUST show the pain's title and image, and nothing about any person. Preview fetches MUST NOT be counted as visits. (Needs per-page rendering; see Dependencies.)

**Slugs**

- **FR-024**: Every published pain MUST have one current slug, separate from its stable ID and defaulting to it: lowercase letters, digits and single hyphens, short and readable, unique across all pains.
- **FR-025**: The founder MUST approve a pain's slug in the content editor when it is first published.
- **FR-026**: A slug MUST NOT change when the pain's name, line, heading, dreams, fixes or detailed content change. The founder MAY change a slug later; the old slug MUST then work permanently as an alias, opening the pain page and showing the current slug in the address.
- **FR-027**: A slug names exactly one pain. A slug that has ever been published, current or alias, MUST NEVER be given to another pain, including after retirement.
- **FR-028**: A pain's stable ID MUST NOT be editable once published (today the editor allows it: `apps/app/app/cms/index.tsx`, `updateRecord`, field `"id"`).
- **FR-029**: The content editor MUST show each pain's current slug, old slugs and full link with a copy control, and MUST highlight the outreach launch set with whether its detailed content is published.
- **FR-030**: Every published pain MUST have a working link, whether or not it is in the launch set.

**Unknown, retired and old links**

- **FR-031**: An unknown slug, or the slug of an unpublished pain, MUST open the personal page with a short calm note and MUST NOT reveal whether an unpublished pain exists.
- **FR-032**: A retired pain's link MUST open the replacement pain's page if the founder named one, otherwise the personal page with a calm "not here any more" note.
- **FR-033**: Slugs MUST be matched without regard to letter case or a trailing slash.
- **FR-034**: Nothing taken from the link MUST be shown on the page as text.

**Platforms**

- **FR-035**: Pain pages and links MUST work on the web in every browser It supports, including phone browsers. In v0.1 links open on the web only.
- **FR-036**: The iOS build MUST be able to show a pain page from an in-app route, so that opening links in an installed app (universal links, researched later) is not blocked.

**Not blocking what's next**

- **FR-037**: The link format MUST leave room for other link kinds later (for example a dream, when starting from a dream arrives) without changing what `/p/` links mean.
- **FR-038**: Entry links and "Share this topic" MUST NOT become invitations. If invitations (optional) record who invited whom, that is a separate mechanism.
- **FR-039**: Pain pages MUST leave room for counts of people who share a pain later, without building them; such counts will need their own small-count privacy rule.

### Key Entities

- **Pain** (existing, spec 001): gains a **current slug**, **old slugs (aliases)**, a **retired** state with an optional **replacement pain**, a **launch set** flag, and optional **detailed content**. Keeps its stable ID, never changed once published.
- **Slug**: the readable name in `/p/<slug>`. One current slug per pain; aliases never expire; no slug is ever reused.
- **Detailed content**: ordered sections of text, images and visualizations for one pain, each with sources and dates, founder-approved, part of the published content version.
- **Source**: where a claim, image or chart's data came from, with a date (existing provenance, extended to pain-page content).
- **Launch set**: the founder's outreach list of pains; drives editor highlighting and which pains get detailed content.
- **Pick / selected fix** (existing): unchanged; pain-page picks are the same records.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A first-time visitor following a link sees the pain's name and can pick a dream within 3 seconds on an ordinary mobile connection, with no extra taps.
- **SC-002**: 100% of launch-set pain pages have founder-approved detailed content before outreach starts, and a founder review finds every claim, image credit and chart sourced and dated.
- **SC-003**: 100% of links still open the right page (same pain, current slug, replacement or personal page with note) after rewording, slug changes and retirements in a staging version.
- **SC-004**: An independent review of the address bar, device storage, everything sent and what It's servers keep after following a link with tracking tags finds no tag, no sharer or clicker identifier, and no record of the slug or pain tied to the visit.
- **SC-005**: Picks made on a pain page appear on the personal or societal page and in the saved account after signup in 100% of tested cases.
- **SC-006**: Links shared with "Share this topic" contain only the plain page link in 100% of tested cases.
- **SC-007**: Every published pain has a working link at launch.

## It Checks *(mandatory)*

### Privacy

- **Before signup, stays on device**: picks and selected fixes made on pain pages (the same draft as the personal and societal pages). The arrival link exists only in the browser's own address bar and history; It stores nothing about it.
- **Before signup, sent** (coarse totals / stage funnel only, disclosed in UI): an ordinary visit, and the usual stages when the person picks (stage list owned by the new measurement spec). Not sent: the slug, the pain, that the visit came by link, the referring site, tracking tags. Measurement is not built yet; the privacy page describes only what is live (010).
- **After signup, stored on server**: pain-page picks as ordinary picks (spec 008); nothing about arrival.
- **Never public by default**: who shared or clicked any link (It never knows); which pains anyone arrived on or picked. No counts of people sharing a pain in v0.1.
- **Remaining leaks, disclosed on the privacy page (010)**: hosting request logs (FR-021); the browser's own history on a shared device; the site where the link was posted, which already knows who posted and often who clicked.

### Honest Status

Fixes keep 001's four labels (do now / already exists / It might build / change for society). Detailed content is factual and sourced: no fake statistics, no social proof drawn from It's visitors, no implication that an "It might build" fix exists. Images that illustrate rather than document must not look like evidence [NEEDS CLARIFICATION: N2]. The "not here" notes say plainly that the topic is gone, not that it is coming.

### Must Not Block

- **Counts of people who share a pain (not in v0.1)**: pain pages leave room for them (FR-039).
- **Starting from a dream instead of a pain (soon)**: link format leaves room for other kinds (FR-037).
- **Sharing a future or path (soon)**: "Share this topic" shares only the pain page; sharing picks must stay an explicit act on a separate copy.
- **Personal story (soon)**: picks keep their content version, including those made on pain pages.
- **Invitations (optional)**: separate from links (FR-038).
- **Native iOS (optional)**: in-app route to a pain page (FR-036).

### Accessibility

- Keyboard: every control on the pain page (dreams, fixes, sources, See more pains, Share this topic) is reachable with a visible focus outline; on arrival focus starts at the pain's heading.
- Screen reader (incl. expanded/collapsed state): dreams announce picked or not; fixes announce label and selected state; new fixes are announced politely; the not-found note is announced once.
- Images and charts: every image has a text alternative; every chart has a short text summary and its data available as text.
- Reduced motion: no animated charts or transitions when reduced motion is on.
- Meaning never by colour alone: labels, picked and selected states, and chart series use words, icons or patterns as well as colour.

### Research Questions

- Which link-sharing places strip, rewrite or append to links, and do readable slugs and previews survive them?
- Do detailed pain pages lead more visitors to pick a dream and continue into the flow than basic pages? (Answerable only through ordinary stage counts, never per pain or per link.)
- Which kinds of visualization help people feel a pain is understood without overwhelming or alarming them?
- iOS universal links: what opening links in an installed Expo app needs, what happens without the app, and whether it changes any privacy property.
- Which hosts can render per-page previews from published database content and drop or truncate IPs and paths in request logs?

## Existing code and content (changes from what exists)

| Area | What exists today | Change this spec implies |
|---|---|---|
| Pain identity | Kebab-case string IDs validated in `packages/content/src/schema.ts` and `packages/content/src/graph-schema.ts`; 31 launch pains in `packages/content/src/tier-1.ts`. No slug anywhere in the repo. | Separate slug field defaulting to the ID; aliases (FR-024–FR-027). |
| Database | `content_pains.id` text primary key; no slug, alias, retired state, replacement, launch-set flag or detailed content (`packages/database/src/migrations/001_initial_content.ts`). Provenance covers `domain`, `pain`, `dream`, `first_action` entities only. Published content is an immutable JSON snapshot per version. | Add the above; extend provenance to detailed sections, images and chart data. |
| Content editor | `apps/app/app/cms/index.tsx` `updateRecord` lets any record's `id` be edited, cascading in the draft. No slug, launch-set or rich-content editing; no image handling. | Lock IDs after publish (FR-028); slug approval and aliases; launch-set highlight; detailed content with sources (FR-007, FR-029). |
| Pain inventory | `docs/spec/pains/pain-inventory.yaml`: 125 pains (31 current, 94 candidate); IDs stable while names change (`poor-sleep` is now "Sleep"). Example slug `rent-eats-everything` exists. No retired status. | Slugs default to these IDs. Spec 001's assumption of 85 pains is out of date. |
| Routes | `apps/app/app/index.tsx` (welcome), `onboarding/personal.tsx`, `world.tsx`, `futures.tsx` (futures.tsx to be retired per the 008 answer). No `/p/` route. 001's opened-pain behaviour is not built; pains are toggled as selections. | New pain page route; See more pains → personal page. |
| On-device draft | `packages/domain/src/onboarding.ts` and `apps/app/src/state/onboarding-store.ts` (`it-onboarding-draft-v1`): pain IDs, dream IDs, help interests, timestamp. No selected fixes, no per-item content version. | Pain-page picks use this same draft (as reshaped by 001/008); arrival adds nothing. |
| App config | `apps/app/app.json`: custom scheme `weareit`, `web.output: "static"`, no iOS associated domains. | Static output alone cannot give per-page previews from published database content (FR-023). |
| Rendering/hosting | `docs/architecture/decisions.md` Rendering: static first, evaluate server output for dynamic share previews; hosting open (lean SST on AWS). | FR-021 and FR-023 become requirements on that decision. |
| Measurement | Not built. | FR-020 applies when the measurement spec is written and built. |
| pieces.yaml | Parked by the founder; left untouched. | — |

## Dependencies and Conflicts with Other Specs

- **001 personal page** (master): pain pages reuse 001's opened-pain behaviour (dreams, labelled fixes), which is not built. 001 still says "I'd use this"; the founder's terminology is **selected fixes** (001 needs updating; not done on this branch). 001's 85-pain assumption is out of date.
- **002 societal page** (not written): societal pains have pain pages too, under `/p/`. 002 must show pain-page picks for societal pains and should adopt the same fix behaviour.
- **007 watercolor dot / loader** (branch `explore/living-loader`, read only): link arrivals skip the welcome screen, so these visitors never see the welcome mark; the content loader still appears while the pain page loads. Pain-page images may want to share 007's visual language (N2).
- **008 signup gate**: pain-page picks are sent at signup like any others (picked dreams with pain and content version, selected fixes with content version). The normal flow is pain page → personal → societal → gate, so the earlier "arriving at the societal page first" question is obsolete. Signed-in visitors: saved picks shown, edits auto-save; device copy cleared after a confirmed save (008 answers).
- **009 support**: no direct interaction; Support follows signup, never reached from a pain page.
- **010 privacy page**: must say link arrival counts as an ordinary visit with no per-pain or per-link counts, disclose request-log handling (FR-021) and the remaining leaks, and describe only measurement that is live. The "clear everything on this device" control is pre-signup only (010 answer); pain pages follow that.
- **011 help**: no v0.1 interaction. The founder notes the roadmap is communicated pre-signup through the fixes people see on pain pages.
- **Measurement spec** (new, not yet numbered): owns the stage list; this spec only requires that link arrival is an ordinary visit.
- **Hosting/rendering decision** (decisions.md, open): per-page previews (FR-023) need per-page or request-time rendering; request-log handling (FR-021) is a hosting requirement.
- **Invitations** (optional): kept separate (FR-038).

## Assumptions

- Links use It's main web address; the domain is not decided here.
- v0.1 content and slugs are English only.
- Only published pains have pages; candidate pains get one when published.
- "See more pains" always goes to the personal page, including from a societal pain's page (founder: normal flow); the societal pain's picks appear when the person reaches the societal page.
- The launch set's membership and size are the founder's outreach list, a content decision made in the editor, not in this spec.
- Detailed content uses outside, sourced statistics only; nothing about It's own visitors.
- "Share this topic" uses the device's share options where present; this is a convenience, not a tracking channel.
