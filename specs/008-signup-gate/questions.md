# Open questions: 008 signup gate

For founder review. Each question matches a `[NEEDS CLARIFICATION]` marker in `spec.md` (Q numbers are cited there). Recommendations are suggestions, not decisions.

## Q1. Returning account with different picks on this device

Someone who already has an account (with saved picks) makes new picks on a fresh device and signs in at the gate. What happens?

- A. Keep the saved picks; discard the device picks.
- B. Replace the saved picks with the device picks (what the code does today: `saveUserOnboardingDraft` overwrites).
- C. Combine: keep everything from both (union).
- D. Ask the person: keep saved, use these, or combine.

**Recommendation**: C (combine) by default, silently, because picks only ever add interest and nothing is lost; D if you want people to see what happened. B risks losing work without warning.

## Q2. Do password signups confirm the email first?

- A. Yes: after choosing a password, the person enters a code sent to the email before the account is usable and picks are saved.
- B. No: account works immediately; email confirmed later (or never).
- C. Account works immediately, picks are saved, but It sends no other email until the address is confirmed.

**Recommendation**: A. It stops typos and stops someone creating an account on another person's email, and the code path already exists. Cost: password signup is no faster than code signup.

## Q3. Forgotten passwords, and passwords on code-created accounts

- A. Full reset flow in v0.1 (email a reset code or link, set a new password).
- B. No reset flow: "Forgot password? Sign in with a code instead", then optionally set a new password once signed in.
- C. B, without the option to set a password after code sign-in in v0.1.

Also: can someone who created the account by code later add a password? (Recommended: yes, once signed in.)

**Recommendation**: B. It reuses the code sign-in, covers forgotten passwords, and needs almost no new screens.

## Q4. Which method comes first on the gate?

- A. Email code is the main button; "Use a password instead" is secondary.
- B. Password is the main path; code is secondary.
- C. Both shown as equal choices.

**Recommendation**: A. It already works, has nothing to remember, and matches the one-field gate.

## Q5. Password rules

- A. Minimum 8 characters, nothing else.
- B. Minimum 12 characters, nothing else.
- C. A or B plus a check against known-breached passwords.

**Recommendation**: C with a 10–12 character minimum and no composition rules (current common guidance favours length and breach checks over symbol rules).

## Q6. Saying "you already have an account"

- A. Say it plainly ("This email already has an account. Sign in instead.").
- B. Never reveal it; always say "We sent a code to that address" and handle both cases after the code.

**Recommendation**: B for the code path (it is naturally neutral); for the password path, route "already exists" to "sign in" only after the person proves the email by code. Slight friction, no account enumeration.

## Q7. Opt-in wording and what emails it covers

What kinds of email does the checkbox cover, and what exactly does it say?

- A. "Send me occasional updates about what It is building." (roadmap / progress only)
- B. Updates plus requests to help (research, testing).
- C. Updates, help requests, and Support appeals.

**Recommendation**: B, worded by you. Keep Support appeals out of the default meaning so the box stays honest; if you want appeals, say so in the label.

## Q8. Changing the opt-in later

- A. Unsubscribe link in every email only.
- B. A setting in an account screen only.
- C. Both.
- D. Defer: v0.1 sends no non-sign-in emails yet, so build this before the first one.

**Recommendation**: A in v0.1 (needed by law anyway for any update email), B later. D is fine if no update emails go out before then.

## Q9. Where exactly is the gate, and what happens to the separate futures screen?

Today the flow is personal → world → futures (a separate screen listing dreams for chosen pains) → ways to help / Support, with optional save. Spec 001 now shows dreams inline on the personal page.

- A. Gate directly after the societal page; the separate futures screen is retired (dreams live inline on both pages).
- B. Gate after the futures screen, which stays as a summary of both pages.
- C. Gate after the societal page; futures screen becomes a post-signup "your futures" summary.

**Recommendation**: A for v0.1 (matches features.md, which has no futures screen); C is a natural home for the "personal story" later.

## Q10. Device copy after a confirmed save

- A. Clear the device copy once the save is confirmed; the account is the only copy (best on shared devices).
- B. Keep the device copy as the signed-in working copy and keep it in step with the account.
- C. Keep the device copy untouched (what happens today).

**Recommendation**: A, with signed-in pages reading picks from the account. C leaves two diverging copies and leaks picks on shared devices.

## Q11. Changing picks after signup

- A. Changes on pages 1–2 save to the account automatically.
- B. Changes save only when the person presses "save".
- C. No editing after signup in v0.1; pages 1–2 are read-only once saved.

**Recommendation**: A. It matches the one-tap feel of the pages and avoids a second "unsaved changes" state.

## Q12. Ask for a name?

- A. No name (the code currently fills "It explorer" for everyone).
- B. Optional name field on the gate.
- C. Optional name later, for example when Support or Help needs it.

**Recommendation**: A now, C later. Every extra field at a required gate costs people.

## Q13. Signing up with no picks

- A. Allowed; the gate says there is nothing to save yet.
- B. Gate asks the person to pick at least one dream first.

**Recommendation**: A. Required signup is about going further; forcing picks would push people to pick anything.

## Q14. Gate stages in the stage funnel

Add "reached the gate" and "signed up" to the per-visit stage funnel (no email, account ID or picks attached)?

- A. Yes, both.
- B. Only "reached the gate"; count signups from accounts created per day.
- C. Neither; use account totals only.

**Recommendation**: A. It is the only way to see the ~50% review line within one visit, and it fits the agreed funnel (C9). The visit ID must never be linked to the new account.

## Q15. Account and data deletion in v0.1

- A. Self-serve "delete my account and saved picks" in v0.1.
- B. By email request in v0.1, stated on the privacy page; self-serve later.
- C. Later.

Also: should this live in 008 or in 010 (privacy page)?

**Recommendation**: B in v0.1, owned by 010, with a firm response time on the privacy page. A if time allows.

## Q16. Minimum age

- A. No age question; the privacy page states a minimum age.
- B. A single "I'm at least N" checkbox on the gate.
- C. Ask for birth year.

And what N (13, 16, 18)?

**Recommendation**: A with N = 16 (covers the strictest common default for consent to data processing without a parent). Owned by 010.

## Q17. Terms / privacy acceptance

- A. A link to the privacy page on the gate is enough.
- B. "By signing up you agree to …" text with links.
- C. A required checkbox.

**Recommendation**: B. Clear without adding a second checkbox next to the opt-in, which could be confused with it.

## Q18. Decision record for passwords

An earlier draft (`docs/spec/drafts/it-spec-decisions.md` D9) asks for a decision record of the password-hash algorithm and settings, so leaving the auth library later doesn't force resets. Do you want that record, and where?

- A. Yes, a short record in `docs/architecture/decisions.md` when passwords are enabled.
- B. No; the library default is fine and documented upstream.

**Recommendation**: A. One line costs nothing and protects a future migration. (AGENTS.md requires a decision record only for stack or privacy-invariant changes; enabling passwords was already decided in C3, so this is optional.)

## Q19. Exactly what is sent at signup

Proposed list: picked dreams with the pain each was picked under and the content version; "I'd use this" marks with the content version; the opt-in choice and wording version. Today the code also sends selected pains (`personalPainIds`, `worldPainIds`), help interests and a draft timestamp.

- A. Proposed list only.
- B. Proposed list plus pains the person opened but picked no dream under.
- C. Everything on the device (today's behaviour).

**Recommendation**: A. Least data that serves the "soon" features; opened-but-not-picked pains are sensitive and add little. Help interests move to 011.

## Q20. Spec numbering

Spec 001 refers to signup as "spec 003", support as 004, help as 005, admin as 006 (from the earlier six-spec split). This round uses 008 signup, 009 support, 010 safety + privacy, 011 help, 007 loader.

- A. Keep the new numbers and update 001's references.
- B. Renumber this spec to 003.

**Recommendation**: A, and record the mapping somewhere visible (for example in `docs/spec/features.md`).
