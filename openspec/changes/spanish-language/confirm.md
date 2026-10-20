# Confirm: spanish-language

Spec 014 (approved 2026-10-17) predates the onboarding redesign, required signup, the name step, the account screen, the privacy page, pain pages, the embedded Support form and the 2026-10-19 measurement change. These are the places where it now conflicts with later decisions or is unclear. Answering "yes" to a question accepts its recommendation.

1. **Is Spanish still core for v0.1, and should it be added to `docs/spec/features.md`?** **Founder answer (2026-10-19): yes: core for v0.1, added to features.md.**
   features.md lists no language item; 014 said adding it is a founder decision.
   - A. Core for v0.1; add a "Language: English and Spanish" item to features.md.
   - B. Optional for v0.1 (ships if time allows); add it as optional.
   - C. "Soon": build only what must not be blocked (catalogs, IDs, `lang`), ship Spanish later.
     **Recommendation: A**, matching the 2026-10-17 approval ("foundation plus Spanish shipped end to end").

2. **Is 014's launch gate still wanted?** **Founder answer (2026-10-19): yes.**
   014 (clarification 5, SC-004): v0.1 launches only with 100% human-reviewed Spanish interface text and emails and a founder-approved Spanish letter; content may launch with English fallbacks.
   - A. Keep the gate as written.
   - B. Gate on interface text only; the letter may launch in English.
   - C. No gate; ship whatever Spanish is ready.
     **Recommendation: A**, unchanged from the founder's answer; only re-confirming because the letter now lives in the CMS (Q13).

3. **Who writes or reviews the Spanish interface copy?** **Founder answer (2026-10-19): yes: an appointed, named Spanish-speaking reviewer signs off; machine drafts allowed as a start.**
   The founder writes or approves all final user-facing copy (`openspec/config.yaml`). 014 FR-009 requires human-reviewed Spanish.
   - A. The founder approves Spanish copy personally.
   - B. A named Spanish-speaking reviewer the founder appoints; the founder approves the English and the reviewer's sign-off counts.
   - C. Machine draft plus founder spot-check.
     **Recommendation: B**, so Spanish review does not block on the founder; name the reviewer.

4. **Keep the "English only for now" and "Machine translation" tags?** **Founder answer (2026-10-19): B: keep "English only for now"; never show unreviewed machine Spanish; no machine tag (specs updated).**
   014 approved both tags and allowed unreviewed machine-assisted content to publish with a note. The 2026-10-19 "Showing information" decision says to show information only when it helps the decision being made.
   - A. Keep both tags and allow unreviewed machine text with a note (014 as approved).
   - B. Keep "English only for now"; never publish unreviewed machine text (so no machine tag).
   - C. No tags; English fallback items are only declared English for screen readers.
     **Recommendation: A**: the tags are honest status about the text itself, which helps a Spanish reader decide whether to trust it. The specs leave the tags out until this is answered.

5. **Language as a measurement dimension?** **Founder answer (2026-10-19): yes: no language in measurement.**
   014 FR-032 (2026-10-17): coarse counts and the stage funnel include the language. Spec 013 FR-004 and FR-022 (2026-10-19, newer, reflected in decisions.md): messages must not contain language; the only split is platform.
   - A. Follow 013: no language in measurement.
   - B. Amend 013 to add language as a second split, disclosed on the privacy page.
     **Recommendation: A** (newer decision; AGENTS.md and decisions.md win). The `language` spec's privacy requirement is written this way.

6. **Save the language at signup and list it on the gate?** **Founder answer (2026-10-19): yes: saved at signup and listed on the gate (required-signup-gate amended).**
   014 FR-007: after signup the language is saved to the account. `required-signup-gate` "What will be saved" and "Signup privacy": signup sends only picked dreams, selected fixes and the opt-in, "nothing else on the device is sent".
   - A. Save it: add "your language" to the gate's list and to the privacy page; send it with signup or right after.
   - B. Don't send the device's language; set the account language only from the first switch made while signed in (until then the device language applies).
     **Recommendation: A**. One extra line on the gate keeps the list honest and keeps 014's promise that emails use the person's language.

7. **Opt-in wording version per language?** **Founder answer (2026-10-19): yes: wording versioned per language (required-signup-gate amended).**
   `required-signup-gate` records the opt-in choice with the version of the label wording. A Spanish label is different wording.
   - A. Each language's label is its own wording version; record the version shown.
   - B. One version covers both languages.
     **Recommendation: A**, so the record shows exactly what the person agreed to.

8. **Do `/p/<slug>` links get a language prefix, and which language do link previews use?** **Founder answer (2026-10-19): yes: no prefix, English previews for v0.1.**
   012 FR-018/FR-019: a link is only It's address, `/p/` and the slug; extra parameters are stripped. Previews show the pain's title and image.
   - A. No prefix: one link per pain; the page shows the visitor's language; previews are in English.
   - B. Optional `/es/p/<slug>` that sets Spanish for that visit (and previews in Spanish), while `/p/<slug>` follows the device.
   - C. Previews follow the sharer's language via a prefix chosen by "Share this topic".
     **Recommendation: A** for v0.1 (keeps 012's link rule intact; B can be added later without breaking links).

9. **Spanish slugs for pain pages?** **Founder answer (2026-10-19): yes.**
   012: each pain has one current slug, approved at first publish, old slugs kept as aliases.
   - A. English slugs only.
   - B. An optional Spanish alias per pain (for Spanish outreach), opening the same page.
     **Recommendation: A** for v0.1; B fits 012's alias model later.

10. **Spanish first-person dream lines: gender and joining.** **Founder answer (2026-10-19): yes.**
    Dream lines are first-person sentences joined with commas and "and" (decisions.md, Contributions). Spanish adjectives often carry gender ("Me despierto listo/lista"), and "y" becomes "e" before an "i"/"hi" sound.
    - A. Write Spanish lines in gender-neutral phrasing (rephrase around adjectives); the joiner handles "y"/"e".
    - B. Use "listo/a" style forms.
    - C. Ask people their grammatical gender.
      **Recommendation: A**: no extra question, no slashes; add it to translator guidance and to the Zod/content validation notes.

11. **Which content fields need Spanish now?** **Founder answer (2026-10-19): yes.**
    014 listed domains, pains, dreams and first actions (with first step and safety note). Master now shows fixes; fixes also store `evidence`/`evidenceNote`, hidden in v0.1 (2026-10-19). First actions are legacy and appear only on the futures screen being retired.
    - A. Groups, pains, dreams, fixes (title, description); evidence notes optional; first actions not translated.
    - B. A plus required Spanish evidence notes.
    - C. Everything, including first actions.
      **Recommendation: A.**

12. **Which items need human review before Spanish is shown?** **Founder answer (2026-10-19): yes.**
    014: items with a safety note or evidence/caveat wording need reviewed Spanish; otherwise the whole item falls back to English. That rule targeted first actions' `safetyNote` and `evidence: candidate`; fixes have no safety note.
    - A. Fixes with evidence "limited" or "untested" need reviewed Spanish; everything else may use unreviewed text (if Q4 = A).
    - B. All fixes need reviewed Spanish.
    - C. Drop the rule (moot if Q4 = B).
      **Recommendation: A**, the closest match to 014's intent on today's content.

13. **Founder letter: CMS content or fixed app text?** **Founder answer (2026-10-19): already settled: CMS content (support answers, 2026-10-18/19).**
    014 kept the letter as a catalog key the founder approves. Spec 009 FR-007 (later) makes the letter CMS content.
    - A. Translate it in the CMS like other content; only a founder-reviewed Spanish version is shown.
    - B. Keep it as app text.
      **Recommendation: A**, following 009.

14. **What happens to the language choice on "clear choices" and on sign-out?** **Founder answer (2026-10-19): yes.**
    `required-signup-gate`: signing out removes cached account data so pages start empty. 014 did not cover either.
    - A. Clear choices leaves the language alone (it is not a pick); sign-out keeps the language currently shown as the device's choice.
    - B. Clear choices also resets language to the device default; sign-out reverts to the device's own earlier choice or default.
      **Recommendation: A**: language is a display preference, not personal data, and resetting it mid-screen would be jarring. On shared devices B is more private; say if that matters more.

15. **People's own contributions in two languages.** **Founder answer (2026-10-19): yes.**
    decisions.md (2026-10-18): people may add pains, futures and ways; the founder reviews and may edit before publishing.
    - A. Contributions may be in either language; the review queue shows the language; approval publishes it in that language with the other language marked missing in the translation list.
    - B. Accept contributions only in English for v0.1.
      **Recommendation: A**: needs no extra rule and fits the translation list.

16. **Pain-page detailed content in Spanish.** **Founder answer (2026-10-19): yes.**
    012: launch-set pain pages have sourced text, images and visualizations, AI-drafted and founder-approved. 014 FR-026: an English-only source on a Spanish screen must say so ("fuente en inglés").
    - A. Detail sections are translatable content like any record; images and charts carry no baked-in text; English-only sources are labelled "fuente en inglés".
    - B. Detail stays English-only in v0.1, declared as English on Spanish pages.
      **Recommendation: A**, scheduled with spec 012's change.

17. **Which emails exist to translate in v0.1?** **Founder answer (2026-10-19): yes.**
    014 named sign-in codes and receipts. Today only the code email exists; the update opt-in implies future emails.
    - A. Code email now; Stripe receipts via the account language; any later email template must ship in both languages.
    - B. Code email only.
      **Recommendation: A.**

18. **Decision record for the localization stack.** **Founder answer (2026-10-19): yes.**
    AGENTS.md: changing an agreed stack choice needs a decision record. This change adds i18next, react-i18next and expo-localization, and a "Localization" section (English default, Spanish, device default, account language, per-language publish).
    - A. Add the decision record as part of this change.
    - B. Choose a different library first.
      **Recommendation: A.**
