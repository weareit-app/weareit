# Confirm: embedded-support

Answer "yes" to accept the recommendation, or name another option.

1. **Custom amount maximum** (009 O2, left to the plan). Options: (a) $1,000 per payment for every cadence; (b) $5,000; (c) a different maximum per cadence. Today's limit is $1,000 and the highest preset (annual) is $1,000. **Recommendation: (a) $1,000 for every cadence.** Is that right?

2. **Refund window** (009 O1; N set by the founder). Options: (a) build the manual refund path now (founder refunds in Stripe, It records it) and state no number of days anywhere until the founder sets N; (b) show a provisional 30 days now; (c) block launch until N is set. **Recommendation: (a).** OK?

3. **Card-statement descriptor** (009 O3; Stripe allows 5–22 characters). Options: (a) "WE ARE IT"; (b) "WE ARE IT SUPPORT"; (c) "WEAREIT.ORG"-style domain once a domain is fixed. **Recommendation: (b) "WE ARE IT SUPPORT"**, which says what the charge is for. OK?

4. **What iOS offers in this change.** Apple subscriptions (primary, 009 Q15) and the link-out to web (secondary) both wait for App Review research. Options: (a) keep one-time App Store support, now tied to the account; subscriptions and the link-out come in a later change after the research; (b) hide purchases on iOS (letter, total and skip only) until the research is done; (c) build Apple once/monthly/annual now behind a switch that stays off. **Recommendation: (a)**: one-time tips are the lowest App Review risk and keep iOS working. OK?

5. **iOS one-time amounts** (only if Q4 is (a) or (c)). Options: (a) the web Once presets as App Store products ($10, $20, $50, $100, $250, $500; no custom amount, which the App Store cannot do); (b) keep today's $5, $15, $30. **Recommendation: (a)**, so web and iOS match. OK?

6. **Support funnel stages and the account.** Spec 009 assumed Support stages were unlinked from the account; the 2026-10-19 invariant (spec 013) links the signup visit and signed-in visits, so they are linked. Options: (a) this change only emits Support shown / completed / skipped with no amount or cadence, and the measurement change sends and links them per the invariant; (b) send them from this change. **Recommendation: (a).** OK?

7. **Next screen after Support.** Spec 009 says thank-you and skip lead to Help build It; `required-signup-gate` says "You're all set" until Help build It ships. Options: (a) Support leads to whatever screen follows it in the flow ("You're all set" now, Help build It later); (b) hold this change until Help build It exists. **Recommendation: (a).** OK?

8. **Account deletion does not exist yet.** Options: (a) this change adds the Support part only (cancel active web recurring support, keep records unlinked, tested on its own) for the future deletion feature to call; (b) add account deletion to this change; (c) leave deletion handling out entirely. **Recommendation: (a).** OK?

9. **Does support that is scheduled to end block a new recurring support?** "One active recurring support" (009 Q9) needs a definition. Stripe's portal will allow cancel and card update only, so changing amount or cadence means cancelling and starting again. Options: (a) past-due counts as active (blocks a new one); cancelled-but-running-to-period-end does not block, since it will not charge again; (b) both block until the old support has fully ended. **Recommendation: (a).** OK?

10. **Funding total definition and timing.** Options: (a) all-time total of successful payments minus refunds, all providers, before provider fees, in USD, with its as-of date, shown from the first payment; (b) the same, but hidden until it passes a threshold (for example $500) so an early lone supporter's amount is not guessable; (c) net of provider fees. **Recommendation: (a)**, which is the simplest honest number. OK?

11. **Placeholder copy.** Options: (a) build with clearly marked placeholders for the letter, headline, summary sentences, state messages and the card-handling line, and ship the not-tax-deductible line once the founder approves its wording; (b) wait for final copy before building. **Recommendation: (a).** OK?
