# Open questions: 012 entry links

For founder review. Q numbers are cited by the `[NEEDS CLARIFICATION]` markers in `spec.md`. Q6, Q10 and Q13 are defaults the spec already assumes; they are listed so you can overrule them. Recommendations are suggestions, not decisions.

## Q1. Which pains get links first? (features.md §2b "?")

- A. Every published pain has a working link from day one; outreach uses whichever it needs.
- B. Only a launch set matched to the outreach list gets links; other slugs act as "not found" until added.
- C. Every published pain has a working link, and the founder's editor highlights a launch set for outreach.

**Recommendation**: C. Links are nearly free once every pain has a slug (FR-014), and B makes a working page look "not found" for no privacy or cost benefit. The launch set is then a list for outreach, not a technical limit.

## Q2. Is the slug the pain's existing stable ID, or a separate field?

Pains already have readable, stable-looking IDs (`poor-sleep`, `rent-eats-everything`, `ai-and-jobs`) in `packages/content/src/tier-1.ts` and `docs/spec/pains/pain-inventory.yaml`. But your example `/p/housing` matches no ID, and some IDs carry earlier wording (`poor-sleep` is now named "Sleep").

- A. Slug = stable ID. Lock IDs once published. Simplest; links read like the IDs.
- B. Separate slug, defaulting to the ID, chosen for public reading; set once at first publish; old slugs kept as aliases if ever changed.
- C. Separate slug, never changeable, no aliases.

**Recommendation**: B. It keeps the internal ID (which picks, provenance and future Thing links depend on) independent from a public name you may want to tidy before launch (`/p/sleep` rather than `/p/poor-sleep`), while aliases guarantee old links never break. A is acceptable if you are happy with current IDs as public names.

## Q3. Does a slug always name exactly one pain?

"Housing" covers several pains (`home-is-hard`, `might-lose-my-home`, `homeless`, `cold-home`, `rent-eats-everything`, `homelessness`).

- A. One slug, one pain. A housing post links to the one pain it is about.
- B. Also allow topic slugs (e.g. `housing`) that point to one chosen pain.
- C. Topic slugs that open several pains at once.

**Recommendation**: A for v0.1, matching §2b ("one pain already open"). B can be added later as aliases if you choose Q2 B. C changes the page and belongs with landing pages (soon).

## Q4. Who sets slugs, and can they ever change?

- A. You approve each slug in the content editor at first publish; after that it never changes.
- B. You approve; it may change later, with the old one kept as an alias forever.
- C. Generated automatically from the name at first publish, never changed.

**Recommendation**: B (pairs with Q2 B). C risks awkward slugs from draft wording.

## Q5. What does a link to a retired pain do?

- A. Open the page with a calm "that topic isn't here any more" note.
- B. If you named a replacement pain when retiring it, open that; otherwise A.
- C. Show an error page.

**Recommendation**: B. Merges and splits will happen as the pain list settles (94 candidates are still under review). C is ruled out by "must not dead-end".

## Q6. Unknown or unpublished slug (default, confirm)

Spec default: open the page normally with a short calm note, no pain open, revealing nothing about unpublished drafts. Alternative: open silently with no note.

**Recommendation**: keep the note; silence makes people think the link worked and the topic is missing from It.

## Q7. Wrong page letter (`/p/` with a societal pain, or `/s/` with a personal one)

- A. Open the correct page with that pain open, and fix the address.
- B. Treat as unknown.

**Recommendation**: A. Slugs are unique across both pages, so this is unambiguous, and pains already cross pages via "More like this".

## Q8. Where does the linked pain appear?

- A. At the top of the page, open, with the full list below (the pain is not shown twice).
- B. In its usual place under its heading, open, with the page scrolled to it.

**Recommendation**: A. With up to 125 pains, B can land the person mid-page with no headline or privacy note in view. A keeps the headline, privacy note and the pain together.

## Q9. Welcome screen on link arrival

- A. Skip it; land directly on the page with the pain open.
- B. Show the welcome screen first, then the page.

**Recommendation**: A. The link's job is to land on the topic (§2b); an extra tap loses visitors. The page's own headline and privacy note already say what It is. (Note: visitors who skip it never see 007's welcome mark.)

## Q10. Existing picks on the device (default, confirm)

Spec default: everything already on the device stays; the linked pain opens in addition; nothing is picked for the person; other pains keep their state. Alternative: offer "start fresh" on arrival.

**Recommendation**: keep the default with no prompt. Clearing is always available at the bottom of the page.

## Q11. Does opening other pains change the address?

- A. No. Only the arrival link sets the address; opening pains on the page does not add entries to browser history.
- B. Yes. Every opened pain updates the address, so any opened pain can be copied as a link.

**Recommendation**: A. B writes a trail of sensitive topics (debt, drinking, grief) into the browser history on shared devices, close to the "no session history" invariant. Copying links can come from the founder's editor (or Q20).

## Q12. Server and hosting request logs

A link to `/p/drinking-too-much` is requested from It's server; ordinary hosting logs record the address with the visitor's network details. That pairs a person's connection with a sensitive pain, which the privacy invariants exist to avoid.

- A. Keep the `/p/<slug>` format; choose and configure hosting so request logs are off, or drop the path and network details, or are kept only briefly for abuse handling and never analysed. Disclose it.
- B. Change the format so the slug is never sent to the server (e.g. `/p#housing`): the browser keeps the part after `#` to itself. Breaks link previews per pain and changes your stated format.
- C. Accept standard logs and disclose them.

**Recommendation**: A. It keeps your format and previews; it becomes a hosting requirement for the hosting decision (still open in decisions.md). C would mean It holds which-pain-by-which-connection records, contradicting the spirit of §2b.

## Q13. Tracking tags added by social sites (default, confirm)

Spec default: ignore them, never store or send them, and remove them from the address bar so they aren't re-shared. Alternative: ignore but leave them in the address bar.

**Recommendation**: remove them. Leaving them means It's pages pass on another company's click identifier when people copy the address.

## Q14. Measurement on link arrival

(a) Does the automatically opened pain count as the "first pain opened" funnel stage (001 FR-014)?

- A. No; only a pain the person opens themselves counts. Other stages (first dream picked, etc.) count normally.
- B. Yes; arrival with a pain open counts as reaching that stage.

(b) Your §2b text says arrival by link counts "like any other visit, nothing more". The spec reads that as: no separate count of link arrivals, even without the pain. Do you want a single "arrived by any entry link" total (no pain, no slug)? It would tell you whether outreach brings people in, and would need a line on the privacy page.

(c) Link-preview fetches by social sites are not visits and should not be counted. Confirm.

**Recommendation**: (a) A, so the funnel still measures what people do. (b) No, keep your stated rule; the posting platforms' own numbers show outreach reach. (c) Confirm.

## Q15. What do link previews show?

- A. A general It preview (name, mark, "It can be better.") for every link.
- B. The pain's own name and line ("Sleep — I don't sleep well."), which is public content.
- C. B later; A for v0.1.

**Recommendation**: C unless request-time rendering is easy on the chosen host. Per-pain previews must stay current when content is published from the database, which static output may not do (decisions.md, Rendering). Either way, previews contain nothing about any person.

## Q16. Arriving at the societal page first

The founder decision is "signup required after the personal and societal pages". Someone arriving at `/s/<slug>` may never see the personal page.

- A. They can go to the gate from the societal page as usual; the personal page is offered but not required.
- B. They must pass through the personal page before the gate.

**Recommendation**: A. "Nothing is required" (001) and "must not block" both point this way; forcing a detour is the kind of hoop that loses people. Needs agreement with spec 008.

## Q17. A signed-in person follows a link

- A. Open the page with their saved picks and the linked pain open.
- B. Open the page as for a signed-out visitor (device picks only).
- C. Send them to wherever signed-in people normally land, ignoring the pain.

**Recommendation**: A, but this depends on what signed-in people see after the gate (spec 008), which is not settled.

## Q18. iPhone

- A. v0.1: links open the web version in the phone's browser. Universal links (opening the installed app) are researched, not built.
- B. v0.1 includes universal links for the iOS app.

**Recommendation**: A. The iOS app is optional for v0.1 and not released; universal links need an App Store build, associated domains and a hosted association file. The spec keeps in-app routes able to open a pain so B can follow.

## Q19. Future landing pages: same address or a new one?

- A. Same address: when landing pages arrive, `/p/<slug>` may show landing content above the open pain, so old links upgrade in place.
- B. New address (e.g. `/t/<slug>`); `/p/` and `/s/` links keep opening the pain.
- C. Decide later; v0.1 only promises old links keep working.

**Recommendation**: C now, with A as the likely direction, and reserve any path segment after the slug (do not ignore it silently forever) so either choice stays open. Note: landing pages' "counts of people who share the pain" will need a small-count privacy rule.

## Q20. A "copy link" control for people in v0.1?

- A. No. Links are for the founder's outreach; people can still copy the address bar.
- B. Yes: a plain "Copy link to this topic" on each opened pain, clearly about the topic, never the person's picks.

**Recommendation**: A for v0.1. B edges toward "Sharing a future or path" (soon), and people may read it as sharing their own picks. Revisit with that feature.

## Not questions (recorded so they aren't lost)

- `docs/spec/pieces.yaml` has no piece for entry links; one may be wanted for the research pipeline. Not added here (ids must stay stable).
- Spec 001's assumption of 85 pains (47 personal, 38 societal) is out of date: the inventory now lists 125 (31 current, 94 candidate).
- Code calls the societal page `world` (`scope in ('personal','world')`, `/onboarding/world`); links use `s` per the founder's example.
