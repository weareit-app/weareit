# Questions: 010 privacy page (safety floor deferred)

First asked 2026-10-17; founder answers recorded 2026-10-18. Mismatch numbers (M1–M19) refer to `spec.md` → Code vs invariant mismatches.

## Still open

**Q33. Contact email address.** (010 owns the contact email, shown in the footer/menu.)
- A. One general address (e.g. hello@…).
- B. A separate privacy address (e.g. privacy@…) for deletion and rights requests, plus a general one.
- *Recommendation*: B; deletion requests are easier to track separately.

**Q34. Neon region** to name on the page (and, for UK/EU readers, whether data leaves the UK/EU).
- A. US region; page states data is stored in the US.
- B. EU region.
- *Recommendation*: Read the actual project region at plan time; if US, the page must say so for UK/EU readers.

**Q35. Production email provider** (open decision in `decisions.md`). The page must name it.
- *Recommendation*: Choose before launch; the page is not final until then.

**Q36. Host log retention if the host can't drop or truncate IPs/paths.**
- A. 7 days. B. 14 days. C. 30 days.
- *Recommendation*: A or B; decide with the hosting choice.

**Q37. Lawful basis per use** (GDPR/UK GDPR). Proposed:
- Account, saved picks, Help offers: performing the service the person asked for (contract).
- Update emails: consent (the opt-in).
- Contacting someone about their offer: consent (given by offering).
- Coarse totals and stage funnel: legitimate interests (no personal data, no identifier).
- Session IP/device and host logs: legitimate interests (security).
- Payment records after deletion: legal obligation (accounting).
- *Recommendation*: Adopt as proposed.

**Q38. How access, export, correction and deletion requests are verified and recorded.**
- A. Reply only to requests from the account's own email address; keep a request log (date received, date done) for N months.
- B. Ask the person to sign in and confirm.
- *Recommendation*: A for v0.1.

**Q39. Stated response time for deletion requests.**
- A. 7 days. B. 30 days (GDPR maximum is one month).
- *Recommendation*: Promise 30 days, aim faster.

**Q40. Retention period for unlinked payment records.**
- *Recommendation*: Set by the founder (with 009's refund window); the page states the period.

**Q41. Confirm owner of the static FAQ page.** Proposed: 010 (with privacy and contact). Each spec still owns its inline "why we ask / what's stored" copy.
- *Recommendation*: 010.

## Answered (2026-10-17, recorded 2026-10-18)

| Q | Question | Founder answer |
|---|---|---|
| Q1 | Confirm the candidate safety floor scope | **Crisis resources and reporting are planned for after v0.1.** 010 covers the privacy page (plus contact email and proposed FAQ). |
| Q11 | Where is the privacy page reachable? | Footer on large screens; menu/settings when signed in and on mobile/small screens; plus the one-line note on pre-signup pages and the gate/Support screens. |
| Q12 | Legal policy, data controller | Plain-language page only for v0.1, with a contact email. Data controller: We Are It LLC. |
| Q13 | Who owns the funnel stage list? | A new measurement spec (not yet written); the privacy page reads from it. |
| Q14 | Page before measurement is built | Describe only what is live; the measurement section ships with the measurement code (release check). |
| Q15 | Session IP and user agent | Keep, disclose, delete with the session. |
| Q16 | Host access logs | Hosting requirement: drop or truncate IPs and paths where the host allows; otherwise short retention, never analysed; disclosed. (Retention value still open: Q36.) |
| Q17 | Account deletion in v0.1 | By email request, with a stated response time on the privacy page; self-serve later. Owned by 010. (Response time still open: Q39.) |
| Q18 | Support records after deletion | Cancel recurring support; keep payment records unlinked from the person for accounting; disclose. (Period still open: Q40.) |
| Q19 | Support reference as sole credential (M8) | Resolved by fix branch `claude/vigorous-hawking-2ad1c8` (25ce58e): status and portal scoped to the signed-in account. Not merged. |
| Q20 | RevenueCat anonymous ID (M6) | Resolved in direction by 009 FR-013/FR-025: every support, including App Store/RevenueCat, is tied to the account. Code not yet changed. Web guest checkout removed on the fix branch (7889724). |
| Q21 | Stripe script loading | Only on the Support screen, loaded after the person taps Next on the amount step; never site-wide. |
| Q22 | Name or describe outside services | Name each one and what it receives. |
| Q23 | What the opt-in covers | Updates only; everything else is transactional. Unsubscribe link in every update email. |
| Q24 | Database host disclosure | Name Neon and its region (region value: Q34). Code stays provider-neutral. |
| Q25 | Minimum age | 16, stated on the privacy page; no age question on the gate. |
| Q26 | Local draft after signup | Device copy cleared after a confirmed save; signed-in pages read from the account. `draftUpdatedAt` is not sent (008 Q19). |
| Q27 | "Clear choices" scope | "Clear everything on this device" is pre-signup only (shared-device privacy); hidden once signed in. |
| Q28 | `pieces.yaml` mismatches (M16, M17) | **Parked** by the founder. Leave untouched; AGENTS.md wins on conflicts. Not an open question. |
| Q29 | Final copy authorship | The founder writes or approves final copy. |
| Q32 | Which laws | Write to satisfy US and UK/EU (GDPR/UK GDPR): lawful basis, rights, controller details. |

Related answers from other lanes used in the spec:
- **008 Q19**: signup sends picked dreams (with pain + content version), selected fixes (with content version), opt-in choice + wording version. Not pains, help interests or `draftUpdatedAt`.
- **Terminology**: no "I'd use this"; say "selected fixes".
- **011**: Help build It is post-signup only; stores background (jobs, education, volunteer, other experience from ESCO-based lists with edited labels, plus optional short free text), skills and offers; offering implies consent to be contacted; admin sees individual offers; people can withdraw offers. Contact email in the shared footer (menu on mobile/signed in), owned by 010; a short static FAQ page in addition to inline copy (owner proposed as 010, Q41).
- **012**: `/p/<slug>` single pain pages; no per-pain or per-link counting; tracking tags stripped and never stored; share button shares the topic only; previews show pain title and image.
- **009**: aggregate funding total shown publicly; receipts to the verified account email; one Stripe customer per account.

## Deferred notes (safety floor, not in v0.1)

These were open safety questions; with Q1 deferred they are kept only as notes for a future safety spec.

- **Q2** Region coverage for crisis resources (candidate: US, Canada, UK, Ireland + Find A Helpline). Verified numbers are kept in `spec.md` → Deferred: safety floor.
- **Q3** How region would be chosen (device settings only; never IP or location).
- **Q4** What a keyword trigger would watch.
- **Q5** Phrase list authorship and languages.
- **Q6** Prompt re-show behaviour.
- **Q7** What would be reportable.
- **Q8** Where reports would go.
- **Q9** Response promise for reports.
- **Q10** Placement of a "Need help now?" entry point (footer/menu has room).
- **Q30** Who re-verifies crisis numbers and how often.
- **Q31** "Not monitored" wording after signup.
