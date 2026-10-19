# Feature Specification: Use It in English or Spanish

> **Renumbered 2026-10-19**: written as `specs/007-i18n-spanish` on branch `claude/it-i18n-support-plan-7006e5` (2026-10-17). 007 is now the watercolor dot, so this copy lives at 014. Spec Kit is retired: this folder is source material for an OpenSpec i18n change (see `docs/spec/MIGRATION.md`). The branch also holds a partial implementation (packages/messages, locale domain code, locale store/provider) to reuse; its migration `005_localization` clashes with master's `005_content_fixes`.

**Feature Branch**: `007-i18n-spanish` (spec directory; numbered 007 because 002–006 are reserved for the founder's planned v0.1 page specs)

**Created**: 2026-10-17

**Status**: Draft

**Input**: User description: "Let people use It in English or Spanish. The app follows the device/browser language by default; a person can switch language in-app at any point, including mid-onboarding, without losing picks. Before signup the choice stays on the device; after signup it's saved to the account and used for account emails (OTP, receipts). All UI copy and all published onboarding content (domains, pains, dreams, first actions, Support It, Help, signup) are available in Spanish. The CMS lets the founder author and review a Spanish version of each record, shows which records are missing a translation, and publishes per-locale snapshots; missing translations fall back to English, visibly. Dates, numbers and currency are formatted for the locale (support amounts stay USD). Web sets the document lang; screen readers get the right language." Founder choices (2026-10-17): foundation plus Spanish shipped end to end; language follows the device, with an in-app choice kept on the device before signup and saved to the account after signup.

## Clarifications

### Session 2026-10-17

- Q: Can machine-assisted Spanish that no person has reviewed be published to visitors? → A: Yes, with a visible "machine-translated" note until reviewed (founder letter excepted).
- Q: Should the active language be a dimension of pre-signup coarse counts and the stage funnel? → A: Yes, disclosed in the privacy note.
- Q: When an item's English is edited after its Spanish was published, what do Spanish visitors see until the Spanish is updated? → A: English with the "English only for now" tag.
- Q: Should safety notes and evidence/caveat wording be exempt from publishing as unreviewed machine translation? → A: Yes; they need human review, and until then the whole item falls back to English with the tag.
- Q: Is Spanish a launch gate for v0.1? → A: Core: v0.1 ships only with 100% Spanish interface text and a founder-approved Spanish letter; content may launch with English fallbacks or machine-translated notes.

## What People See and Do *(mandatory, write this first)*

Cross-cutting: applies to every page in `docs/spec/features.md` §1–6. Not yet listed there; adding it is a founder decision (see Assumptions).

- **Screen: First visit, any page** - A visitor whose phone or browser is set to Spanish sees It in Spanish from the first screen: headline, questions, pains, dreams, ideas and their honest labels, buttons and the privacy note. A visitor set to any other language sees English. - The person uses It as normal; nothing asks them to pick a language first.
- **Screen: Language switch (every page)** - A small, always-reachable control shows the current language by its own name ("English" / "Español"). - The person can switch at any time, including halfway through the personal page. The page changes language in place; opened pains, picked dreams and "I'd use this" marks stay exactly as they were.
- **Screen: Content not yet translated** - If a pain, dream or idea has no Spanish version yet, it appears in English with a short "Solo en inglés por ahora" ("English only for now") tag. If its Spanish is machine-translated and not yet reviewed, it shows a short "Traducción automática" note. - The person can still pick it; nothing is hidden because it is untranslated.
- **Screen: Sign up** - Signup screens and the email code arrive in the language the person is using. - After signup, the person's language choice is remembered on their account and used on other devices and in emails from It.
- **Screen: Support It** - The founder's letter, the amount choices and the payment form appear in the chosen language. Amounts stay in US dollars, written the way Spanish readers expect (e.g. "US$ 15"). Receipts arrive in the chosen language. - The person supports or skips as before.
- **Screen: CMS (founder only)** - Each pain, dream, idea, domain and first action shows its English text and a Spanish text side by side, plus how the Spanish was made (written by a person, or machine-assisted) and whether it has been reviewed. A list shows everything still missing or unreviewed in Spanish. - The founder writes or edits Spanish text, marks it reviewed, previews onboarding in Spanish, and publishes.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - A Spanish speaker uses It in Spanish from the start (Priority: P1)

Rosa's phone is set to Spanish. She opens It, sees "Puede ser mejor." and the personal question in Spanish, opens a pain, picks two dreams and moves on to the societal page — all in Spanish, without any setup.

**Why this priority**: This is the whole point of the feature. A Spanish-speaking visitor who meets English first is likely to leave.

**Independent Test**: Set a test device or browser to Spanish, open It fresh, complete the personal and societal pages; every visible word is Spanish except items tagged "English only for now".

**Acceptance Scenarios**:

1. **Given** a first visit from a device set to Spanish (any region, e.g. es-MX, es-US, es-ES), **When** the first page loads, **Then** all interface text and all translated content are in Spanish.
2. **Given** a first visit from a device set to a language other than English or Spanish, **When** the first page loads, **Then** It is shown in English.
3. **Given** the Spanish experience, **When** the person reaches each honest-status label (do now / already exists / It might build / societal change), **Then** the label is in Spanish and keeps the same meaning and visual distinction as in English.

---

### User Story 2 - Switch language without losing anything (Priority: P1)

Marco starts in English on a shared family laptop, realises his mother would rather read Spanish, and switches mid-way through the personal page. Everything changes to Spanish; his opened pain and picks remain.

**Why this priority**: The device language is often wrong for the person holding it (shared devices, bilingual people). Losing picks on switch would break trust.

**Independent Test**: Pick dreams and mark ideas in English, switch to Spanish, confirm every pick and mark is still there; switch back, confirm again.

**Acceptance Scenarios**:

1. **Given** picks on the personal page, **When** the person switches language, **Then** every pick, "I'd use this" mark and open/closed state is unchanged.
2. **Given** a switched language before signup, **When** the person closes and reopens It on the same device, **Then** It opens in the chosen language.
3. **Given** a person who has never switched, **When** they change their device language, **Then** It follows the new device language on next open.

---

### User Story 3 - Language carries into the account and emails (Priority: P2)

Rosa signs up in Spanish. Her email code, later emails from It, and her support receipt arrive in Spanish. When she signs in on her laptop (set to English), It opens in Spanish.

**Why this priority**: After signup, English emails or a reset to English on a new device would feel like It forgot her.

**Independent Test**: Sign up with Spanish chosen; check the code email language; sign in on a browser set to English and confirm It shows Spanish.

**Acceptance Scenarios**:

1. **Given** a person using Spanish, **When** they request a sign-up or sign-in code, **Then** the email is in Spanish.
2. **Given** a signed-up person whose saved language is Spanish, **When** they sign in on a device set to English, **Then** It shows Spanish.
3. **Given** a signed-up person, **When** they switch language in-app, **Then** the account's saved language changes and later emails use it.
4. **Given** a person supporting It in Spanish, **When** payment completes, **Then** the receipt and confirmation screen are in Spanish and the amount is in US dollars.

---

### User Story 4 - The founder publishes Spanish content honestly (Priority: P2)

The founder opens the CMS, sees 14 pains still missing Spanish, writes or reviews translations, previews onboarding in Spanish, and publishes. Some machine-assisted translations remain unreviewed.

**Why this priority**: Content is most of what people read. Without an authoring path, Spanish UI would wrap English content.

**Independent Test**: In the CMS, add Spanish text to one pain, mark it reviewed, publish; a Spanish visitor sees it; an untranslated pain shows in English with the tag.

**Acceptance Scenarios**:

1. **Given** the CMS, **When** the founder opens the translation list, **Then** it shows each record that is missing Spanish or has unreviewed Spanish, with counts.
2. **Given** a record with Spanish text, **When** the founder saves it, **Then** the CMS records how it was made (human-written or machine-assisted) and its review state.
3. **Given** a publish, **When** a Spanish visitor loads content, **Then** they get the Spanish text where it exists (with a "machine-translated" note if unreviewed machine-assisted), and English with the "English only for now" tag otherwise.
4. **Given** a record's English text changes after its Spanish was reviewed, **When** the founder views the translation list, **Then** that Spanish version is flagged as possibly out of date.

---

### User Story 5 - Screen readers and layout work in Spanish (Priority: P3)

A VoiceOver user hears Spanish text read with a Spanish voice; on web, the page declares Spanish. Longer Spanish phrases fit buttons and cards without being cut off.

**Why this priority**: Required for accessibility, but builds on stories 1–2.

**Independent Test**: Run VoiceOver (iOS) and a desktop screen reader (web) on the personal page in Spanish; check pronunciation and that no text is truncated at the smallest supported width.

**Acceptance Scenarios**:

1. **Given** Spanish is active on web, **When** the page loads, **Then** the document declares Spanish, and any "English only for now" item declares English.
2. **Given** the smallest supported screen width and the largest supported text size, **When** any screen is shown in Spanish, **Then** no label, button or heading is cut off or overlapped.

### Edge Cases

- Device set to a regional Spanish (es-419, es-US, es-ES): treated as Spanish.
- Device set to Catalan, Portuguese or another language: English (no guessing a "close" language).
- Device languages listed in order (e.g. French then Spanish): the first of English/Spanish in the person's list wins.
- Switching language while a content request is in flight or offline: the interface switches immediately; content shows the last loaded version in the new language if available, else the existing content-loading state.
- The founder edits an item's English after its Spanish was published: from the next publish, Spanish visitors see the English with the "English only for now" tag until the Spanish is updated or the founder confirms it still matches (FR-033).
- A pick saved before signup refers to a dream whose Spanish was later added or changed: the pick still matches, because picks refer to the item, not its words.
- A signed-in person's saved language differs from the language chosen on this device before sign-in: the language actively chosen most recently wins, and the account is updated.
- Person switches language on Support It after choosing an amount: the chosen amount and frequency are kept, and the payment form opens (or reloads, if embedded) in the new language; no payment is submitted twice.
- An idea with a safety note (e.g. the conditional bedroom HEPA hypothesis) has only unreviewed machine Spanish: the whole idea shows in English with the tag, never part-Spanish.
- Founder's letter on Support It has no founder-approved Spanish version: shown in English with the tag; never machine-translated without approval.

## Requirements *(mandatory)*

### Functional Requirements

**Language choice**

- **FR-001**: It MUST support exactly two languages in this release: English (default and fallback) and Spanish.
- **FR-002**: On first use, It MUST choose Spanish when the first English-or-Spanish entry in the device/browser preferred-language list is Spanish (any region), and English otherwise.
- **FR-003**: People MUST be able to switch language from every screen at any time, before and after signup, in no more than two taps/clicks from any screen.
- **FR-004**: The language control MUST name each language in that language ("English", "Español").
- **FR-005**: Switching language MUST NOT change, clear or reorder any picks, "I'd use this" marks, open/closed states, form inputs in progress, or navigation position.
- **FR-006**: Before signup, an explicit language choice MUST be stored only on the device and MUST persist across app restarts on that device. Without an explicit choice, It MUST keep following the device language.
- **FR-007**: After signup or sign-in, the person's language MUST be saved to their account, and the saved account language MUST take precedence over the device language on any device where they are signed in.
- **FR-008**: When a person who chose a language on this device before sign-in then signs in, the most recently chosen language MUST win and be saved to the account.

**Interface and content**

- **FR-009**: Every piece of interface text and every email template across the personal, societal, signup, Support It, Help and error/empty/loading states MUST be available in human-reviewed Spanish before v0.1 launches. The unreviewed-machine-translation allowance in FR-024 applies to content, not interface text.
- **FR-010**: Published onboarding content (domains, pains, dreams, first actions and their honest-status labels, safety notes and effort/evidence wording) MUST be available per language.
- **FR-011**: When a content item has no publishable Spanish version, It MUST show the English version with a visible, translated "English only for now" tag, and MUST NOT hide or reorder the item.
- **FR-012**: Picks and marks MUST refer to content items by their stable identity, never by their text, so they survive language switches and translation edits.
- **FR-013**: The Support It founder letter MUST only appear in Spanish when the founder has approved that Spanish text; otherwise it appears in English with the tag.
- **FR-014**: The wording rules MUST hold in Spanish: "support" (e.g. "apoyar", "apoyo"), never "donation" ("donación", "donar"), and It MUST NOT be described as a charity ("organización benéfica", "caridad") in either language.
- **FR-015**: Dates, times and numbers MUST be formatted for the active language. Support amounts MUST remain US dollars, labelled unambiguously as US dollars in Spanish.

**Account, email and vendors**

- **FR-016**: Sign-up and sign-in code emails, and any other email It sends, MUST use the person's active language at the time of sending (device choice before an account exists; account language after).
- **FR-017**: On web, the payment form (embedded or provider-hosted; see `docs/spec/CONFLICTS.md` C5) and its validation messages MUST appear in the active language where the payment provider supports it, and receipts MUST use the person's language — the account language when signed in, otherwise the language active at checkout.
- **FR-018**: On iOS, It MUST rely on the App Store's own localized price display and MUST NOT show a separately converted price.

**CMS and publishing**

- **FR-019**: The CMS MUST let the founder create, edit and remove a Spanish version of every translatable text field of every content record, alongside the English version.
- **FR-020**: Each Spanish version MUST record how it was made (human-written or machine-assisted), who last edited it, its review state (unreviewed / reviewed), and which English version it was translated from.
- **FR-021**: The CMS MUST list every record that is missing Spanish, has unreviewed Spanish, or has Spanish translated from an older English version, with counts per type.
- **FR-022**: The CMS MUST let the founder preview onboarding in Spanish using a draft before publishing.
- **FR-023**: Publishing MUST produce a content version per language from the same content set, so both languages refer to the same items, links and honest-status labels; a language can never add or drop items.
- **FR-024**: Any saved Spanish version MAY be published, including machine-assisted text no person has reviewed. Every unreviewed machine-assisted item MUST carry a visible, translated "machine-translated" note (e.g. "Traducción automática") wherever it is shown; the note disappears once the founder marks it reviewed. Exceptions: the Support It founder letter (FR-013), and any item with a safety note or evidence/caveat wording, whose Spanish MUST be human-reviewed before publishing; until then the whole item falls back to English with the "English only for now" tag.
- **FR-025**: Rollback MUST restore both languages together to the same prior content version.
- **FR-033**: A Spanish version translated from an older English version of the same item MUST NOT be published; that item MUST fall back to English with the "English only for now" tag. The founder MUST be able to update the Spanish or confirm it still matches the new English (e.g. after a typo fix), which makes it current again.

**Honesty, rights and provenance**

- **FR-026**: Translated content MUST keep the source record's provenance unchanged; the CMS and any public view MUST NOT imply that cited sources or evidence are in Spanish when they are not. No visitor-facing screen shows source links yet; once one does, a link to an English-only document on a Spanish screen MUST say so (e.g. "fuente en inglés").
- **FR-027**: Each translation MUST carry the same license as its source record (CC0 for knowledge-graph claims, CC BY-SA 4.0 for authored guides and prose), with translator attribution recorded where the license calls for it.

**Accessibility**

- **FR-028**: On web, each page MUST declare its active language, and any English-fallback item shown on a Spanish page MUST declare English.
- **FR-029**: On iOS, text MUST be exposed to assistive technology with its language so it is read with the matching voice.
- **FR-030**: No text in either language may be truncated, clipped or overlapped at the smallest supported screen width and largest supported text size.

**Privacy and measurement**

- **FR-031**: Before signup, the active language MAY leave the device only (a) with a request the person starts that needs it — an email code request or a support checkout — and (b) as the disclosed dimension in coarse counts and the stage funnel (FR-032). Content requests MUST NOT carry the language. The language MUST NOT be combined with any identifier, picks or other answers, and MUST NOT be stored server-side for a signed-out person.
- **FR-032**: The pre-signup coarse counts and stage funnel MUST include the active language (English or Spanish) as a dimension, and the on-page privacy note MUST say so in both languages before any data is sent. Language MUST NOT be combined with anything beyond what those measures already allow (no identifier, picks or history).

### Key Entities

- **Language**: One of English or Spanish in this release; identified by a standard language code; English is the fallback.
- **Language preference**: The person's explicit choice, if any. Before signup it exists only on the device; after signup it is an attribute of the account.
- **Content translation**: The text of one content record in one language, with how it was made, review state, editor, and the English version it was made from. Belongs to exactly one content record; shares the record's identity, links, provenance and license.
- **Published content version**: An immutable set of content with a text version per language, published and rolled back together.
- **Interface text**: Every fixed label, heading, button, message and email template, with an English and a Spanish version.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A visitor whose device is set to Spanish can complete the personal and societal pages and sign up without encountering any untagged English text (100% of interface text translated; every English-fallback content item tagged).
- **SC-002**: Switching language mid-onboarding loses 0 picks, marks or open states across 100% of tested switch points.
- **SC-003**: The page shows the new language within 1 second of switching, on a mid-range phone with content already loaded.
- **SC-004**: v0.1 does not launch until 100% of interface text and emails have reviewed Spanish and the founder letter has a founder-approved Spanish version. Onboarding content is not a launch gate: at launch, the founder can see how many items are in reviewed Spanish, machine-translated Spanish or English-only.
- **SC-005**: The CMS translation list lets the founder find every missing or out-of-date Spanish item in under 1 minute.
- **SC-006**: Screen-reader checks on iOS and web find 0 passages read with the wrong-language voice on the personal, societal, signup and Support It pages.
- **SC-007**: Visual checks at the smallest supported width find 0 truncated or overlapping labels in Spanish.
- **SC-008**: A review of every Spanish screen and email finds 0 uses of "donation"/"donar"/"donación" or charity wording.

## It Checks *(mandatory)*

### Privacy

- **Before signup, stays on device**: The explicit language choice, if any; all picks and answers (unchanged).
- **Before signup, sent**: The language only alongside an email-code request or support checkout the person starts (FR-031); never with content requests, and with no identifier, picks, location or history attached. The active language is also a dimension of the coarse counts and stage funnel (FR-032), disclosed in the privacy note.
- **After signup, stored on server**: The person's preferred language, as an account attribute.
- **Never public by default**: The person's language. It is not shown on any shared or public artifact.

### Honest Status

Honest-status labels (do now / already exists / It might build / societal change) are translated with the same meaning and visual distinction. Translations never upgrade a status (e.g. "It might build" must not read as "available"). Untranslated items say "English only for now"; unreviewed machine-assisted text carries a "machine-translated" note until reviewed (FR-024). Sources stay attributed in their original language.

### Must Not Block

- More languages, including right-to-left ones (e.g. Arabic): language is a list, not an English/Spanish switch; no layout assumes left-to-right; no text is baked into images.
- Personal story of your chosen futures (soon): picks keep stable item identity and the content version they were made under, independent of language, so a story can be generated in any language later.
- Sharing a future or path (soon): shared copies refer to items by identity so a viewer can read them in the viewer's own language.
- Matching people with goals to helpers (soon): Help-page structured lists (job titles, skills) are stored by identity with translated labels, not as free text in one language.
- Native iOS app (optional): device-language detection and spoken language work on iOS as on web.

### Accessibility

- Keyboard: the language control is reachable and operable by keyboard on web, in logical tab order, with a visible focus state.
- Screen reader (incl. expanded/collapsed state): the language control announces its current value and options in their own languages; page and fallback-item languages are declared (FR-028, FR-029); expanded/collapsed announcements are translated.
- Reduced motion: switching language does not animate content in or out when reduced motion is requested.
- Meaning never by colour alone: the "English only for now" tag is text, not just a colour or icon.

### Research Questions

- Which Spanish register and vocabulary best fits It's audience (neutral Latin American vs US Spanish), and which pain/dream terms read differently across regions?
- Are any Tier 1 pains or first actions US-specific (programs, institutions) in ways that need different examples, not just translation, for Spanish speakers?
- Which existing resources cited by first actions have official Spanish versions that should be linked instead of the English one?

## Assumptions

- Spanish copy targets neutral Latin American Spanish suitable for US Spanish speakers, using informal "tú"; regional variants are out of scope.
- Location is not used to choose language; only the device/browser language and the person's explicit choice.
- Support amounts and prices remain in US dollars only; no currency conversion.
- Illustrations contain no text, so they need no translation; their accessible descriptions are translated like other content.
- Admin/CMS screens themselves stay English-only; only the content they edit is bilingual.
- Help page (features §5) is still ill-defined; its interface text is covered by FR-009 once designed.
- Adding "Use It in English or Spanish" to `docs/spec/features.md` and a localization entry to `docs/architecture/decisions.md` is a founder decision taken at review, not by this spec.
- The founder (or someone they appoint) translates or reviews content; translation staffing is outside this spec.
