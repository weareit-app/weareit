# Open questions: 008 signup gate

For founder review. Q1–Q20 were answered by the founder in the 2026-10-17 review and written into `spec.md` on 2026-10-18. The original options are kept here as the record. Q21–Q22 are new questions raised by those answers. Items still open: **Q5 (exact length, left to plan), Q7 (label wording), Q21, Q22**.

## Answered

### Q1. Returning account with different picks on this device — ANSWERED

Options were: A keep saved · B replace with device (today's overwrite) · C combine (union) · D ask the person. Recommended C.

**Founder answer**: C. Combine silently (union). → FR-019, User Story 3.

### Q2. Do password signups confirm the email first? — ANSWERED (by the new flow)

Options were: A confirm by code first · B no confirmation · C usable immediately, confirmed later. Recommended A.

**Founder answer**: Every signup goes through the email code first, so the email is always verified before picks save. A password is added afterwards, optionally. → FR-006, FR-014.

### Q3. Forgotten passwords, and passwords on code-created accounts — ANSWERED (by the new flow)

Options were: A full reset flow · B "sign in with a code instead", then optionally set a password · C B without setting a password. Recommended B.

**Founder answer**: Forgot password = sign in with a code; no separate reset flow in v0.1. Code-created accounts can add a password or a passkey once signed in. → FR-009, FR-014.

### Q4. Which method comes first on the gate? — ANSWERED

Options were: A code main, password secondary · B password main · C equal. Recommended A.

**Founder answer**: Email first; the next screen sends a code. A small "use a password" link for people who already have one. After signup the person may optionally create a password **or register a passkey**. Passkeys are new relative to C3 and are recorded in `docs/architecture/decisions.md` (2026-10-17 entry). → What People See and Do, FR-008, FR-014.

### Q5. Password rules — ANSWERED (exact number open)

Options were: A 8 chars · B 12 chars · C length plus breached-password check. Recommended C with 10–12.

**Founder answer**: 10–12 character minimum, breached-password check, no composition rules. **Still open**: the exact minimum, left to plan. → FR-015.

### Q6. Saying "you already have an account" — ANSWERED (by the new flow)

Options were: A say it plainly · B never reveal it. Recommended B.

**Founder answer**: The code path is neutral ("we sent a code"); no account enumeration. → FR-007, FR-008, SC-005.

### Q7. Opt-in wording and what emails it covers — ANSWERED (wording open)

Options were: A updates only · B updates plus help requests · C plus Support appeals. Recommended B.

**Founder answer**: Updates only. Everything else at that point is transactional; finer-grained email permissions come later, elsewhere. **Still open**: the final label text, which the founder writes or approves. → FR-024.

### Q8. Changing the opt-in later — ANSWERED

Options were: A unsubscribe link only · B account setting only · C both · D defer. Recommended A now, B later.

**Founder answer**: Unsubscribe link in every update email in v0.1; account setting later. → FR-027.

### Q9. Where the gate sits; the separate futures screen — ANSWERED

Options were: A gate after societal page, retire futures · B gate after futures · C futures becomes a post-signup summary. Recommended A.

**Founder answer**: A. Gate directly after the societal page; retire `futures.tsx` (dreams inline on both pages). → FR-002, Changes table.

### Q10. Device copy after a confirmed save — ANSWERED

Options were: A clear it · B keep in step · C leave untouched (today). Recommended A.

**Founder answer**: A. Clear it; signed-in pages read from the account. → FR-020.

### Q11. Changing picks after signup — ANSWERED

Options were: A auto-save · B explicit save · C read-only. Recommended A.

**Founder answer**: A. Auto-save to the account. → FR-021.

### Q12. Ask for a name? — ANSWERED

Options were: A no name · B optional on the gate · C optional later. Recommended A now, C later.

**Founder answer**: Ask right after signup completes (not on the gate), and it is **required**. Drop the "It explorer" placeholder. → FR-013, "Your name" screen.

### Q13. Signing up with no picks — ANSWERED

Options were: A allowed · B require one pick. Recommended A.

**Founder answer**: A. Allowed. → User Story 1 scenario 7, Edge Cases.

### Q14. Gate stages in the stage funnel — ANSWERED

Options were: A both stages · B gate only · C neither. Recommended A.

**Founder answer**: A. Add "reached the gate" and "signed up", never linked to the account. The stage list is now owned by a new measurement spec (not yet written); this spec references it. → FR-028.

### Q15. Account and data deletion in v0.1 — ANSWERED

Options were: A self-serve · B by email request · C later. Recommended B, owned by 010.

**Founder answer**: B. By email request in v0.1 with a stated response time, on the privacy page; self-serve later. Owned by 010. → FR-030.

### Q16. Minimum age — ANSWERED

Options were: A stated on the privacy page · B gate checkbox · C birth year. Recommended A with 16.

**Founder answer**: A. 16, stated on the privacy page; no question on the gate. Owned by 010. → FR-005.

### Q17. Terms / privacy acceptance — ANSWERED

Options were: A link only · B "By signing up you agree to …" line · C checkbox. Recommended B.

**Founder answer**: B. A line with links; no checkbox. → FR-004.

### Q18. Decision record for passwords — ANSWERED

Options were: A short record in decisions.md · B none. Recommended A.

**Founder answer**: A. Short record covering password-hash settings and passkeys added to C3. Added to `docs/architecture/decisions.md` on this branch, marked as from the 2026-10-17 founder review.

### Q19. Exactly what is sent at signup — ANSWERED

Options were: A proposed list only · B plus opened pains · C everything (today). Recommended A.

**Founder answer**: A. Picked dreams (with the pain each was picked under and the content version), selected fixes (with content version), opt-in choice and wording version. Not opened or selected pains, help interests, or `draftUpdatedAt`. Terminology: there are no "I'd use this" marks; they are **selected fixes**. → FR-018, It Checks → Privacy.

### Q20. Spec numbering — ANSWERED

Options were: A keep new numbers, update 001 · B renumber to 003. Recommended A.

**Founder answer**: A. Keep the new numbers (008–012); 001's references need updating, and the mapping goes in features.md. **Follow-up** (not done on this branch, since 001 is on master): update 001's spec references and rename "I'd use this" to "selected fixes".

## Still open

### Q21. Where is the "add a password or passkey" offer?

The founder said people may optionally add a password or passkey after signup, but not where the offer appears.

- A. A skippable screen straight after the name step, before Support.
- B. Only in an account area (menu/settings), no screen in the flow.
- C. A one-line prompt on the saved/name screen that links to the account area.

**Recommendation**: C. It adds no extra step between signup and Support (the primary goal) and still makes the option visible. A costs one more screen before Support; B may mean almost nobody finds it.

### Q22. Can the gate sign people in with an existing passkey?

Once passkeys exist, a returning person might want to use theirs at the gate.

- A. Yes, through the browser's or phone's own passkey suggestion on the email field (no extra button).
- B. Yes, with a visible "Use a passkey" link next to "Use a password".
- C. No; passkeys only sign in from a separate sign-in screen, not the gate.

**Recommendation**: A. It keeps the gate to one field while letting passkey holders in with one tap, and reveals nothing about whether an account exists.

### Q5 (remaining part). Exact password minimum

10, 11 or 12 characters. Left to plan by the founder; noted here so it is not lost.

### Q7 (remaining part). Opt-in label wording

The founder writes or approves the exact text (updates only).
