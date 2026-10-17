# Open questions: 010 safety floor and privacy page

For founder review, 2026-10-17. Each question has options and a recommendation; the recommendation is not a decision. Mismatch numbers (M1–M18) refer to `spec.md` → Code vs invariant mismatches.

## Scope

**Q1. Confirm the candidate safety floor scope.**
- A. All four parts: crisis resources, on-device keyword trigger, "not monitored" notice, report button.
- B. Resources + "not monitored" notice in v0.1; trigger and report later.
- C. Resources + notice + report; trigger only once free-text fields exist.
- D. Defer the whole safety floor past v0.1.
- *Recommendation*: C. Resources and the notice are cheap, offline and leak nothing; v0.1 has no pre-signup free text for a trigger to watch (Q4). A report link is low-cost if Q7/Q8 are settled; otherwise B.

## Crisis resources

**Q2. Which regions do the crisis resources cover?**
- A. US only.
- B. US, Canada, UK, Ireland (verified sources in spec), plus Find A Helpline for everyone else.
- C. B plus Australia and New Zealand (needs verification).
- D. Only Find A Helpline, no in-app numbers.
- *Recommendation*: B. Also verify emergency numbers from official sources before listing them.

**Q3. How is the region chosen?**
- A. From device locale/region settings on the device; the person can switch.
- B. The person always picks.
- C. Show all regions in one list.
- *Recommendation*: A. Never IP lookup or location permission (location must stay on device).

**Q30. Who re-verifies numbers, and how often?**
- A. Founder, quarterly, with a dated checklist.
- B. Research pipeline flags changes; founder confirms.
- C. Before each release.
- *Recommendation*: A, plus C as a release checklist item; show "last checked" on the page.

## Keyword trigger

**Q4. What does the on-device keyword trigger watch?** (No pre-signup free text exists in the app today; the only text fields are email, sign-in code, and support amount.)
- A. Only future free-text fields (e.g. personal story, Help background in 011); nothing in v0.1 until such a field exists.
- B. Also surface resources when certain pains are opened or picked (e.g. `feeling-down`, `anxiety`, `unsafe-at-home`, `drinking-too-much`, `grief`), on the device.
- C. No trigger in v0.1.
- *Recommendation*: A. B is privacy-safe if fully on-device, but it changes how sensitive pains feel and may need a decision record; consider instead a static "Need help now?" link on those pains' cards (content-level, no trigger).

**Q5. Who writes and reviews the phrase list, and in which languages?**
- A. Founder drafts in English from published safe-messaging guidance; reviewed by a qualified person before launch.
- B. Adopt an existing published list (license permitting).
- C. English only, no outside review.
- *Recommendation*: A, English only for v0.1.

**Q6. Prompt behaviour after dismissal?**
- A. Don't re-show for that field during this visit.
- B. Re-show on each new match.
- C. Never re-show on this device (would need storing a flag on device).
- *Recommendation*: A (nothing stored).

## Notice and reports

**Q31. Exact "not monitored" wording, given that picks are stored on It's server after signup?**
- A. "No one at It watches what you write or pick, and It can't respond in an emergency."
- B. "It doesn't read individual answers. The founder sees only totals." (Only true if enforced by access rules.)
- C. A plus a line under "When you sign up" explaining who can technically access stored data.
- *Recommendation*: C. Honest about technical access; avoids promising "never read" without controls.

**Q7. What is reportable?**
- A. An idea/content item that is wrong, out of date or harmful.
- B. A privacy or security problem.
- C. Another person (no user-to-user content in v0.1, so likely not).
- D. A + B.
- *Recommendation*: D.

**Q8. Where do reports go, and who reads them?**
- A. Stored in It's database and shown in founder admin (006), category + item ID + optional note; linked to account only after signup.
- B. Sent by email to a founder inbox (email provider sees content).
- C. Plain "email us" mailto link (no form).
- *Recommendation*: A, never linked to picks or a visit ID. Note: a pre-signup report is an explicit, disclosed exception to "nothing sent before signup"; confirm that is acceptable (may need a decision record).

**Q9. What response does It promise?**
- A. "We read every report but may not reply."
- B. A reply within N days.
- C. No statement.
- *Recommendation*: A.

**Q10. Where do the safety entry points live?**
- A. A small "Need help now?" link in the footer of every screen.
- B. On the Help page (011) only.
- C. A + Help page and privacy page link to it.
- *Recommendation*: C. Must be reachable before signup and without the Help page.

## Privacy page

**Q11. Where is the privacy page reachable?**
- A. Footer link on every screen + the one-line note on pre-signup pages + signup and support screens.
- B. Only from the one-line note.
- *Recommendation*: A.

**Q12. Is a separate legal privacy policy needed, and who is the data controller / contact?** (Corporate form is an open decision.)
- A. Plain-language page only for v0.1, with a contact email.
- B. Plain-language page plus a lawyer-reviewed legal policy before launch.
- C. Plain-language page now; legal policy before taking payments.
- *Recommendation*: C. Payments and accounts usually trigger legal obligations; get advice.

**Q32. Which laws must the page satisfy at launch?**
- A. US only (CCPA/CPRA where applicable; COPPA via age floor).
- B. US + UK/EU (GDPR/UK GDPR: lawful basis, rights, controller).
- C. Restrict launch regions to keep scope small.
- *Recommendation*: Decide with Q2 and Q12; get advice. Not a product decision Claude should make.

**Q14. Before measurement is built (M1), what does the page say?**
- A. Describe it as planned ("Starting [date], we'll count…") and update when live.
- B. Only describe what is live; add the section when measurement ships.
- *Recommendation*: B, with a release check (FR-013) that the section ships with the measurement code. Avoids claims that aren't true yet.

**Q22. Name outside services, or describe them?** (SMTP provider is an open decision.)
- A. Name each one (e.g. Neon, Stripe, Apple/RevenueCat, the email provider) and what it receives.
- B. Describe by role ("our database host", "our email sender").
- *Recommendation*: A. Stripe and Apple are visible anyway; naming builds trust and matches "honest about what is real".

**Q24. Database host and region disclosure.**
- A. Name Neon and the region.
- B. "A cloud database provider in [region]."
- *Recommendation*: A, while keeping the code provider-neutral.

**Q15. Session IP address and user agent (M5): keep, drop, or limit?**
- A. Keep and disclose (useful for security, e.g. spotting stolen sessions).
- B. Don't store them.
- C. Store, disclose, and delete with the session.
- *Recommendation*: C.

**Q16. Server/host access logs (M14).**
- A. Keep standard host logs, short retention (e.g. 14 days), disclosed.
- B. Configure the host to drop or truncate IPs.
- *Recommendation*: B where the host allows, else A; decide with the hosting decision. Visit-level logs with IP must not become a visit history.

**Q17. Account deletion and data export in v0.1 (M10)?**
- A. Self-serve "Delete my account" in v0.1.
- B. Deletion on request by email in v0.1; self-serve later.
- C. Not in v0.1.
- *Recommendation*: A or B; the page must say which. C is hard to square with the trust goal.

**Q18. Support records after account deletion.**
- A. Keep payment records (amount, date, provider IDs) unlinked from the person, for accounting.
- B. Delete everything.
- *Recommendation*: A (likely required for accounting); disclose it.

**Q19. Support reference in URL as sole credential (M8).**
- A. Require the signed-in owner for status and portal; remove `ref` from URLs or make it non-sensitive.
- B. Keep as is.
- *Recommendation*: A, in 009.

**Q20. RevenueCat anonymous ID (M6).**
- A. Configure RevenueCat only after sign-in, with the It user ID as the app-user ID.
- B. Configure only at purchase time with an It-generated per-purchase ID.
- C. Drop iOS support for v0.1 (it is optional).
- *Recommendation*: A, in 009; disclose that RevenueCat receives the It user ID.

**Q21. Stripe embedded form (M9).**
- A. Load Stripe's script only on the support screen and disclose that Stripe receives device/fraud signals there.
- B. Load site-wide (Stripe's default recommendation for fraud).
- *Recommendation*: A.

**Q23. What does the email opt-in cover?** (008)
- A. Occasional updates about It's progress only.
- B. Updates plus requests for help/feedback.
- *Recommendation*: Decide in 008; the page quotes it.

**Q25. Minimum age.**
- A. 13+ (US COPPA floor).
- B. 16+ (common EU floor).
- C. 18+.
- *Recommendation*: Decide with Q32; pre-signup pages hold no personal data on It's side, so the age floor matters most at signup.

**Q26. Local draft after signup (M4, M15).**
- A. Keep the device copy (current behaviour) and explain both copies.
- B. Clear the device copy once saved to the account.
- *Recommendation*: A with clear explanation; also decide whether `draftUpdatedAt` needs to be sent at all.

**Q27. Does "Clear choices" also sign out or affect the account copy?**
- A. Device only (current); separate "Delete account".
- B. Offer both options in the same place.
- *Recommendation*: A, with the privacy page explaining the difference.

## Process

**Q13. Who owns the funnel stage list?**
- A. 001 FR-014 owns it; the privacy page reads from the same definition.
- B. A separate measurement spec owns it.
- *Recommendation*: A until a measurement spec exists.

**Q28. Docs mismatches in `docs/spec/pieces.yaml` (M16 `visitor-session`, M17 `telemetry`).**
- A. Amend the wording (keep ids stable), validate with `uv run docs/spec/tools/validate_pieces.py`.
- B. Leave; treat as superseded.
- *Recommendation*: A, in a separate small change.

**Q29. Final copy authorship.**
- A. Founder writes or approves final privacy and safety copy (as for the Support letter).
- B. Draft copy from this spec ships.
- *Recommendation*: A.
