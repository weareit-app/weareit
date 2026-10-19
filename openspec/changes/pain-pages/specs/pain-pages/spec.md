# Spec Delta

## Purpose

A page for one pain at `/p/<slug>`, so a link in a post lands on that pain: its dreams and fixes to pick, then a way into the normal flow, without revealing who shared or followed the link.

## ADDED Requirements

### Requirement: One page per published pain
Every published pain, personal or societal, SHALL have its own page at `/p/<slug>`, using its current slug. There SHALL be one prefix for all pains; no other prefix (such as `/s/`) SHALL exist for pains.

#### Scenario: Personal pain link
- **WHEN** someone opens `/p/<slug>` for a published personal pain
- **THEN** that pain's page opens

#### Scenario: Societal pain link
- **WHEN** someone opens `/p/<slug>` for a published societal pain
- **THEN** that pain's page opens under the same `/p/` prefix

### Requirement: Straight to the pain on arrival
Opening a pain page SHALL show that pain directly, with no welcome, landing or intro step first, and nothing on the page SHALL require an account.

#### Scenario: Fresh device
- **WHEN** a person on a device that has never visited It opens a pain link
- **THEN** the pain page is the first thing they see and no sign-up prompt appears

### Requirement: Basic pain page content
Every pain page SHALL show the pain's name and first-person line, its dreams to pick, and the fixes for picked dreams with their type and status tags, behaving exactly as an opened pain does on the personal page. Opening the page SHALL NOT pick a dream, select a fix, or select the pain.

#### Scenario: Picking on a pain page
- **WHEN** the person picks a dream on a pain page
- **THEN** the fixes for that dream appear with their tags and can be selected and unselected with one tap

#### Scenario: Nothing chosen on arrival
- **WHEN** a pain page opens
- **THEN** no dream, fix or pain is chosen on the person's behalf

### Requirement: Detailed content for the launch set
A pain page for a launch-set pain with published detailed content SHALL also show that content: short plain-language sections, with images and charts where the content includes them. Only founder-approved, published detailed content SHALL appear.

#### Scenario: Launch-set pain
- **WHEN** a launch-set pain with published detailed content is opened
- **THEN** its page shows the detailed sections as well as its dreams and fixes

#### Scenario: Unapproved draft
- **WHEN** detailed content for a pain is drafted but not yet published
- **THEN** the pain page does not show it

### Requirement: No placeholders for missing detail
A pain page SHALL show only the content that exists. A pain without detailed content, or with only part of it, SHALL show no empty sections, "coming soon" boxes or placeholders.

#### Scenario: Pain outside the launch set
- **WHEN** a pain outside the launch set is opened
- **THEN** the page shows the pain, its dreams and fixes, with no empty detail areas

### Requirement: Sources on every claim
Every factual claim, statistic, chart and image credit on a pain page SHALL show its source with a date, next to it or one tap away. Charts SHALL use only sourced outside data.

#### Scenario: Checking a chart
- **WHEN** the person looks for the source of a chart on a pain page
- **THEN** a named source with a date is shown beside it or one tap away

### Requirement: No counts of people
A pain page SHALL NOT show how many people on It share, picked or viewed the pain, or any other figure drawn from It's own visitors.

#### Scenario: Inspecting a page
- **WHEN** any pain page is inspected
- **THEN** it shows no count or share of It's visitors or accounts

### Requirement: Same picks everywhere
Picks and selected fixes made on a pain page SHALL be the same picks used by the personal and societal pages, kept with the content version, and SHALL appear there when the person reaches them. Opening a pain page SHALL leave every pick already on the device unchanged.

#### Scenario: Personal pain picks carried along
- **WHEN** the person picks a dream on a personal pain's page and then reaches the personal page
- **THEN** that pain shows with the same picks

#### Scenario: Societal pain picks carried along
- **WHEN** the person picks a dream on a societal pain's page and then reaches the societal page
- **THEN** that pain shows with the same picks

#### Scenario: Earlier picks kept
- **WHEN** a person with picks from an earlier visit opens a link to a different pain
- **THEN** all earlier picks and selected fixes are unchanged

### Requirement: Pain-page picks are saved at signup
Picks made on a pain page SHALL be sent at signup together with all other picks, in the same form the signup gate defines, and SHALL NOT be sent before signup.

#### Scenario: Sign up after a pain page
- **WHEN** a person picks a dream and selects a fix on a pain page, continues through the flow and signs up
- **THEN** the account holds that dream with its pain and that fix, with their content version

### Requirement: Signed-in visitors
A signed-in person opening a pain page SHALL see the picks and selected fixes saved on their account for that pain, and each change SHALL save to their account automatically, as on the personal and societal pages.

#### Scenario: Signed-in change
- **WHEN** a signed-in person picks another dream on a pain page
- **THEN** it is saved to their account without a save step

### Requirement: Device note and clear control
Before signup, a pain page SHALL show a short note near the top that picks stay on this device, and the "clear choices" control, which clears every choice on the device and leaves the page open. Neither SHALL be shown to a signed-in person.

#### Scenario: Clearing on a pain page
- **WHEN** a signed-out person confirms "clear choices" on a pain page
- **THEN** every choice on the device is removed and the same pain page stays open

#### Scenario: Signed in
- **WHEN** a signed-in person opens a pain page
- **THEN** no device note or clear control is shown

### Requirement: See more pains
Every pain page SHALL offer "See more pains", which opens the personal page, from where the person continues through the normal flow (personal, then societal, then the signup gate). This SHALL be the same for personal and societal pains.

#### Scenario: From a societal pain
- **WHEN** the person taps "See more pains" on a societal pain's page
- **THEN** the personal page opens

### Requirement: Share this topic
Every pain page SHALL offer "Share this topic", which shares only the page's plain link, using the device's share options where available and copying the link otherwise, with a short line saying picks are not shared.

#### Scenario: Sharing after picking
- **WHEN** a person with picks taps "Share this topic" and shares
- **THEN** what is shared is only `/p/<current slug>` on It's address, with no picks and no added parameters

#### Scenario: No share sheet
- **WHEN** the device has no share options
- **THEN** the link is copied and the page says so

### Requirement: Links carry nothing personal
Every pain link It publishes or shares SHALL consist only of It's address, `/p/` and the slug. It SHALL NOT carry personal data, a sharer or clicker identifier, a campaign or share code, or any value that differs per person, post or click.

#### Scenario: Inspecting a shared link
- **WHEN** a link produced by "Share this topic" or shown in the editor is inspected
- **THEN** it contains only It's address, `/p/` and the slug

### Requirement: Tracking tags removed
Query parameters or fragments on an arriving pain link, such as tracking tags added by social sites, SHALL be removed from the address bar on arrival and SHALL NOT be stored on the device or sent anywhere.

#### Scenario: Link with tags
- **WHEN** someone opens `/p/<slug>?utm_source=x&fbclid=abc`
- **THEN** the address bar shows `/p/<slug>` and the tags appear in no storage or request

### Requirement: How a visit arrived is not recorded
Arriving by a pain link SHALL NOT cause It to record the referring site, the link as followed, any tracking tag, or that the visit came by link. Page views and pain opens are counted only as the measurement capability defines.

#### Scenario: Arriving from a post
- **WHEN** a person follows a pain link from a social site
- **THEN** nothing It stores or sends names the referring site, the tags, or that the visit arrived by link

### Requirement: Address not passed to other sites
Pain pages SHALL NOT pass their address to other sites when a person follows a link out, such as to a source, and SHALL NOT load third-party resources that would receive the address.

#### Scenario: Opening a source
- **WHEN** the person opens a source link on a pain page
- **THEN** the source site receives no referrer naming the pain page

### Requirement: Link previews
When another site fetches a pain link for a preview, the response SHALL give the pain's title and its preview image, and nothing about any person.

#### Scenario: Pasting a link into a chat app
- **WHEN** a chat app fetches `/p/<slug>` to build a preview
- **THEN** the preview shows the pain's title and image

### Requirement: Old slugs keep working
Opening a pain's old slug SHALL open the same pain page, and the address bar SHALL show the current slug.

#### Scenario: Slug changed after a post
- **WHEN** someone opens a link with a pain's old slug
- **THEN** that pain's page opens and the address shows its current slug

### Requirement: Unknown or unpublished slug
An unknown slug, or the slug of a pain that is not published, SHALL open the personal page with a short calm note, and SHALL NOT reveal whether an unpublished pain exists.

#### Scenario: Mistyped link
- **WHEN** someone opens `/p/rent-eats-everythin`
- **THEN** the personal page opens with a calm note that the topic isn't here

#### Scenario: Draft pain
- **WHEN** someone opens the slug of a pain that exists only as a draft
- **THEN** the result is the same as for an unknown slug

### Requirement: Retired pain link
A retired pain's link SHALL open its replacement's page, with the address showing the replacement's slug, when the founder named a replacement; otherwise it SHALL open the personal page with a calm note that the topic isn't here any more.

#### Scenario: Retired with a replacement
- **WHEN** someone opens the link of a pain retired in favour of another
- **THEN** the replacement's page opens with its slug in the address

#### Scenario: Retired without a replacement
- **WHEN** someone opens the link of a pain retired with no replacement
- **THEN** the personal page opens with a calm "not here any more" note

### Requirement: Forgiving slug matching
Slugs SHALL be matched regardless of letter case and a trailing slash, and the address SHALL then show the plain current slug. Extra path segments SHALL be treated as an unknown slug. Nothing taken from the address SHALL be shown on the page as text.

#### Scenario: Capitals and trailing slash
- **WHEN** someone opens `/p/Rent-Eats-Everything/`
- **THEN** the rent pain page opens and the address shows `/p/rent-eats-everything`

#### Scenario: Odd characters
- **WHEN** someone opens `/p/<script>`
- **THEN** the personal page opens with the calm note, and the typed text is not shown

### Requirement: Web in v0.1
Pain pages and links SHALL work on the web in every browser It supports, including phone browsers. In v0.1, links SHALL open on the web. The iOS app SHALL be able to show a pain page from an in-app route, so opening links in the installed app can be added later.

#### Scenario: iPhone browser
- **WHEN** someone taps a pain link on an iPhone
- **THEN** the pain page opens on the web in the phone's browser

### Requirement: Hosting logs kept minimal
Hosting SHALL be set up so request logs drop or truncate visitors' network addresses and requested paths where the host allows. Where it does not, logs SHALL be kept only briefly, never analysed, and described on the privacy page.

#### Scenario: Host review
- **WHEN** the production hosting configuration is reviewed
- **THEN** request logs either omit or truncate addresses and paths, or their short retention is set and disclosed on the privacy page

### Requirement: Pain page privacy
Before signup, pain-page picks SHALL stay on the device; only what the AGENTS.md measurement invariant allows (owned by the measurement capability) SHALL be sent, never picks, the link or tags. After signup, pain-page picks SHALL be stored as ordinary picks. Who shared or followed a link, and which pains anyone picked, SHALL never be public.

#### Scenario: Signed-out picks
- **WHEN** a signed-out person picks dreams and fixes on a pain page
- **THEN** no request carries those picks

### Requirement: Privacy page covers links
The privacy page SHALL say that links never identify who shared or followed them, that tracking tags are removed and not kept, that how a visit arrived is not recorded, and what hosting request logs may hold and for how long. It SHALL describe pain-page counting only as the measurement capability defines it.

#### Scenario: Reading about links
- **WHEN** someone reads the privacy page
- **THEN** it explains what a pain link carries and what hosting logs keep

### Requirement: Honest status on pain pages
Fixes on a pain page SHALL carry the same type and status tags as on the personal page, so real-now actions, group efforts and proposed It features are told apart and nothing implies an unbuilt feature works. Images that illustrate SHALL NOT look like documentary evidence, and the "not here" notes SHALL say the topic is gone, not coming.

#### Scenario: Feature fix on a pain page
- **WHEN** a Feature fix appears on a pain page
- **THEN** it shows its Feature tag and roadmap status, and its explanation says it isn't available yet

### Requirement: Pain page accessibility
Every control on a pain page SHALL be keyboard reachable with visible focus, and focus SHALL start at the pain's heading on arrival. Dreams and fixes SHALL announce checked state, tags expanded state, and new fixes politely. Images SHALL have text alternatives and charts a text summary with data as text. Nothing SHALL animate under reduced motion, and meaning SHALL not rely on colour alone.

#### Scenario: Screen reader on arrival
- **WHEN** a screen-reader user opens a pain link
- **THEN** focus is on the pain's heading and it is announced

#### Scenario: Chart without sight
- **WHEN** a screen-reader user reaches a chart
- **THEN** a text summary and the chart's data are available as text

#### Scenario: Calm note announced
- **WHEN** an unknown slug opens the personal page with its note
- **THEN** the note is announced once to screen readers
