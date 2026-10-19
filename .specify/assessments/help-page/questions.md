# Help build It — questions for the founder

- **Slug**: help-page
- **Created**: 2026-10-17
- **Status**: **all 18 answered by the founder, 2026-10-18.** The questions, options and assessor recommendations are kept as a record. Each "Answer" is the founder's decision.

## 1. Which meaning of "Help" is §5?
- (a) Offering help to It: background, skills, roadmap asks (as features.md §5 reads).
- (b) Getting help from It: FAQ, contact, crisis resources.
- (c) Both on one page.
- Recommendation: (a).
- **Answer: (a) offering help to It.**

## 2. What must the Help page achieve in v0.1?
- (a) Collect offers the founder will follow up on.
- (b) Communicate the roadmap as concrete asks.
- (c) Test whether background → skills matching works.
- (d) Collect structured skill data for later matching.
- Recommendation: (a) + (b), with (d) as a by-product; defer (c).
- **Answer: all four.** Asks are also not limited to the prioritised roadmap; other asks can be added.

## 3. Which shape?
- A: full background → ESCO skills → matched asks (medium).
- B: asks first, optional structured background, no matcher (small).
- C: keep the existing interest categories (small).
- D: merge into the Support page (small, inside 009).
- E: drop from v0.1.
- Recommendation: B, falling back to E.
- **Answer: A, the full flow.** The founder accepts that it is over the one-week budget.

## 4. Who writes the roadmap asks, how many, and where do they live?
- (a) Founder writes 5–15 before launch, stored in the CMS.
- (b) AI drafts them and the founder approves, stored in the CMS.
- (c) Hard-coded list for v0.1.
- Recommendation: (b) or (a), in the CMS.
- **Answer: (b).** AI drafts, founder approves, stored in the CMS with stable IDs. No number was fixed.

## 5. What does "say your background" cover?
- (a) ESCO occupations only.
- (b) ESCO occupations plus an education level.
- (c) Free text.
- (d) Structured plus a "none of these fit" escape.
- Recommendation: (d) with ESCO occupations.
- **Answer:** background covers **jobs, education, volunteer experience and other experiences**. Use structured lists where possible (ESCO, an education list), plus an **optional short free-text box**. No crisis prompt on free text.

## 6. Are skills suggested in v0.1, and how many?
- (a) ESCO essential skills, capped at about 10.
- (b) Uncapped.
- (c) No skills; occupations only.
- Recommendation: (a).
- **Answer: (b).** ESCO essential skills are suggested from the background with **no cap**. The person confirms or removes them.

## 7. How does contact consent work?
- (a) A separate, unticked consent box on the Help page.
- (b) Reuse the signup opt-in (spec 008).
- (c) Submitting an offer implies consent.
- Recommendation: (a).
- **Answer: (c).** Submitting an offer implies consent to be contacted about it, and the page must say so plainly.

## 8. What follow-up can the founder commit to, and what do people see?
- (a) A stated window and admin tracking.
- (b) Honest no-promise copy plus admin marks.
- (c) No promise, no copy.
- Recommendation: (b).
- **Answer: (b).** The copy is "We'll reach out if one of these needs you now. We can't reply to everyone.", plus admin "followed up" marks.

## 9. Where does Help sit in the flow?
- (a) After Support; both skippable.
- (b) Before Support.
- (c) Only on Support's skip path.
- Recommendation: (a).
- **Answer: (a).** The flow is signup → required name step → Support → Help build It, with Support and Help both skippable. Support's thank-you or skip leads to Help.

## 10. What happens to the existing pre-signup interests screen?
- (a) Retire it.
- (b) Keep it as a teaser.
- (c) Convert its categories into the first asks.
- Recommendation: (a) + (c).
- **Answer: (a) + (c).** Retire `apps/app/app/ways-to-help.tsx` and `helpInterests`, and reuse its items as the first asks.

## 11. Which spec number?
- (a) 011.
- (b) 005, as spec 001 line 9 lists.
- Recommendation: (a).
- **Answer: (a) 011.** The new numbers (008–012) stay. 001's references get updated, and the mapping is recorded in features.md. That work belongs to another lane or a follow-up, not this assessment.

## 12. Is a general contact or feedback channel needed, and who owns it?
- (a) A contact email in a shared footer, owned by 010.
- (b) A feedback form.
- (c) None.
- Recommendation: (a).
- **Answer: (a).** A contact email in the shared footer (in the menu on mobile and when signed in), owned by 010.

## 13. FAQ or contextual help?
- (a) Inline copy only, no FAQ.
- (b) A short static FAQ page.
- (c) Both.
- Recommendation: (a).
- **Answer: (c) both.** Each spec has inline "why we ask / what's stored" copy, plus a short static FAQ page. FAQ ownership is proposed for 010 but not yet assigned.

## 14. What does "modified ESCO list" mean, and what attribution is needed?
- (a) An unmodified subset with CC BY 4.0 attribution.
- (b) Edited labels and merged skills.
- (c) A list derived from Homefront.
- Recommendation: (a).
- **Answer: (b).** Edited labels and merged skills are allowed. This needs a licence check and a "modified from ESCO" attribution notice. Stored references keep the original ESCO URIs.

## 15. What does admin see about interest in roadmap asks?
- (a) Counts plus individual offers from people who consented.
- (b) All individual offers.
- (c) Counts only.
- Recommendation: (a).
- **Answer:** counts per ask plus individual offers. Offering already implies consent to contact (Q7), so this is in effect (a) and (b) together.

## 16. Can people change or withdraw an offer later?
- (a) Yes, from their account.
- (b) No; email to withdraw.
- Recommendation: (a) if an account view exists.
- **Answer: (a).** This needs an account view that lists the person's offers.

## 17. Should the roadmap asks be visible before signup?
- (a) No.
- (b) A read-only list before signup.
- Recommendation: (a).
- **Answer: (a).** Help is post-signup only. The roadmap is already shown before signup through the fixes people see on the pain pages.

## 18. What is §5 called?
- (a) Keep "Help".
- (b) "Help build It" or "Contribute".
- (c) Keep both as "Help".
- Recommendation: (b) "Help build It", to keep it distinct from any "get help" content.
- **Answer: "Help build It".**

## Terminology (founder, 2026-10-18, all specs)

Say "selected fixes", never "I'd use this". A person selecting a fix (an idea labelled as a possible feature) is the whole of that action.
