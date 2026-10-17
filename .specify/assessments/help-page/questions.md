# Help page — questions for the founder

- **Slug**: help-page
- **Created**: 2026-10-17
- **Status**: open. None answered. The decide gate waits on Q1–Q4, Q7 and Q8 (marked **blocking**).

Each question lists options and a recommendation. The recommendation is the assessor's suggestion, not a decision.

## 1. Which meaning of "Help" is §5? (blocking)
- (a) Offering help to It: background, skills, roadmap asks (as features.md §5 reads).
- (b) Getting help from It: FAQ, contact, crisis resources.
- (c) Both on one page.
- **Recommendation: (a).** Route "getting help" needs to 009/010 and a contact link (see concept.md Part 2).

## 2. What must the Help page achieve in v0.1? (blocking)
- (a) Collect offers the founder will follow up on.
- (b) Communicate the roadmap as concrete asks.
- (c) Test whether background → skills matching works.
- (d) Collect structured skill data for later matching.
- **Recommendation: (a) + (b), with (d) as a by-product.** Defer (c).

## 3. Which shape? (blocking)
- A: full background → ESCO skills → matched asks (medium).
- B: asks first, optional structured background, no matcher (small).
- C: keep the existing interest categories (small).
- D: merge into the Support page (small, inside 009).
- E: drop from v0.1.
- **Recommendation: B.** Fall back to E if Q4 or Q8 can't be met.

## 4. Who writes the roadmap asks, how many, and where do they live? (blocking)
- (a) Founder writes 5–15 before launch, stored as CMS content with stable IDs and honest labels.
- (b) AI drafts them and the founder approves, stored in the CMS.
- (c) Hard-coded list for v0.1.
- **Recommendation: (b) or (a), stored in the CMS.** decisions.md says content is database-backed, and thing-type-relation requires stable IDs for roadmap items.

## 5. What does "say your background" cover?
- (a) ESCO occupations only.
- (b) ESCO occupations plus an education level (needs another list, e.g. ISCED).
- (c) Free text.
- (d) Structured plus an optional "none of these fit" escape.
- **Recommendation: (d) with ESCO occupations.** No free text in v0.1: it keeps the data structured and avoids the free-text crisis-prompt requirement.

## 6. Are skills suggested in v0.1, and how many?
- (a) Yes: ESCO essential skills for the chosen occupations, capped at about 10, confirm or remove.
- (b) Yes, uncapped.
- (c) No, occupations only in v0.1.
- **Recommendation: (a)** if B or A is chosen. (c) is acceptable if time is short, since occupation references alone don't block matching.

## 7. How does contact consent work? (blocking)
- (a) A separate, unticked "It may contact me about the things I offered" on the Help page.
- (b) Reuse the signup email opt-in (spec 008).
- (c) Submitting an offer implies consent.
- **Recommendation: (a).** The signup opt-in covers emails from It in general. Follow-up about a specific offer is a different purpose, and pieces.yaml (draft) requires consent before contact.

## 8. What follow-up can the founder commit to, and what do people see? (blocking)
- (a) A stated window (e.g. "within two weeks") and admin tracking.
- (b) "We'll reach out if one of these needs you now. We can't reply to everyone."
- (c) No promise, no copy.
- **Recommendation: (b)**, plus admin "followed up" marks. (c) risks the DemocracyLab trust failure.

## 9. Where does Help sit in the flow?
- (a) After Support, as features.md orders it; both skippable.
- (b) Before Support.
- (c) Offered on the Support page's skip path only.
- **Recommendation: (a).** Support is the primary goal. Check the stage funnel after launch.

## 10. What happens to the existing pre-signup interests screen (`apps/app/app/ways-to-help.tsx`, `helpInterests` in the draft schema)?
- (a) Retire it. Remove the route, and keep accepting the old draft field until saved drafts age out.
- (b) Keep it pre-signup as a teaser that leads to the post-signup Help page.
- (c) Convert its categories into the first roadmap asks.
- **Recommendation: (a) + (c).** Its "invite one person", "check one claim" and "give feedback" items read like good first asks.

## 11. Which spec number?
- (a) 011, as reserved by the current planning session.
- (b) 005, as `specs/001-personal-page/spec.md` line 9 lists ("005 help").
- **Recommendation: (a) 011**, and update the split note in spec 001 when convenient. The founder or orchestrator confirms.

## 12. Is a general contact or feedback channel needed in v0.1, and who owns it?
- (a) A contact email in a shared footer, owned by 010 (alongside privacy).
- (b) A small feedback form (new data store, spam handling).
- (c) None in v0.1.
- **Recommendation: (a).**

## 13. FAQ or contextual help?
- (a) No FAQ in v0.1. Each spec writes the inline "why we ask / what's stored" copy it needs.
- (b) A short static FAQ page.
- (c) Both.
- **Recommendation: (a).**

## 14. What does "modified ESCO list" mean, and what attribution is needed?
- (a) An unmodified subset of ESCO (filtered, not edited), with CC BY 4.0 attribution.
- (b) Edited labels and merged skills (needs a licence check and a "modified" notice).
- (c) A Homefront-derived list.
- **Recommendation: (a) for v0.1.** Read the ESCO licence page before shipping (it-mvp research flagged that it wasn't read).

## 15. What does admin see about roadmap-ask interest?
- (a) Counts per ask, plus individual offers only from people who gave contact consent.
- (b) All individual offers.
- (c) Counts only.
- **Recommendation: (a).**

## 16. Can people change or withdraw an offer later?
- (a) Yes, from their account.
- (b) Not in v0.1. Email to withdraw.
- **Recommendation: (a)** if their account has any settings view in v0.1, otherwise (b) with the contact address shown.

## 17. Should the roadmap asks be visible before signup, to communicate the roadmap?
- (a) No. Help is post-signup only.
- (b) A read-only list of asks before signup; offering needs an account.
- **Recommendation: (a) for v0.1.** This is the product intent's "communicates the roadmap" point, so the founder should decide.

## 18. What is §5 called, so it doesn't clash with crisis help (010)?
- (a) Keep "Help" for §5. 010 uses "Crisis resources" or "Urgent help". Avoid "support" here, because It reserves that word for giving money.
- (b) Rename §5 to "Help build It" or "Contribute". 010 may use "Help".
- (c) Keep both as "Help".
- **Recommendation: (b) "Help build It".** A distressed person looking for "Help" should land on crisis resources, not a skills form. This needs agreement with lane 010.
