# Questions: 009 Support page

Founder answers recorded 2026-10-18. Numbers match references in `spec.md`. Original options and recommendations are kept for the record, shortened.

## Still open

These remain as `[NEEDS CLARIFICATION]` in `spec.md`:

- **O1 (from Q13) Refund window N days**: founder decided refunds on request within N days, handled manually; N is set by the founder.
- **O2 (from Q4) Custom amount maximum**: founder left this to the plan. Today's limit is $1,000; annual presets go up to $1,000.
- **O3 (from Q18) Card-statement descriptor wording**: merchant is We Are It LLC; wording left to the plan.

To confirm in review (no marker):

- **Q16 detail**: Support funnel stages are assumed to be unlinked from the account like the other stages. The measurement spec (not yet written) owns the stage list.

## Answered

1. **Where does Support sit in the flow?** Options: after signup before Help / after Help / link only. Recommended: after signup, before Help.
   **Answer**: signup → required name step → Support → Help build It. Both Support and Help are skippable.

2. **Re-entry and pre-signup links?** (`futures.tsx`, `ways-to-help.tsx`.) Recommended: remove pre-signup links; persistent link after signup.
   **Answer**: remove pre-signup Support links. Persistent "Support It" link after signup: footer on large screens; menu or settings on mobile and when signed in.

3. **Preselection?** Recommended: preselect "once" only.
   **Answer**: preselect Monthly and $5.

4. **Presets and limits?** Recommended: founder supplies per-cadence numbers.
   **Answer**: cadence segmented control above; six preset buttons in two rows of three; custom amount field below. Monthly $3/5/10/20/50/100 (default $5); Every year $30/50/100/200/500/1,000; Once $10/20/50/100/250/500. $1 minimum. Custom maximum left to the plan (O2).

5. **Currency?** Recommended: USD only.
   **Answer**: USD only for v0.1.

6. **Payment methods?** Recommended: cards + wallets + saved details.
   **Answer**: cards, wallets (Apple Pay / Google Pay on web) and the provider's saved-details option. No bank debits.

7. **When does the form load?** Recommended: after picking cadence/amount.
   **Answer**: two-step page. The payment form loads only after the person taps Next on the amount step. The provider script loads only on the Support screen, never site-wide.

8. **Restructure the ledger now?** Recommended: yes.
   **Answer**: restructure now; provider IDs move to separate provider-reference records.

9. **More than one active recurring support per account?** Recommended: no.
   **Answer**: one active recurring support per account. Existing supporters see "Manage support". One-time support stays available.

10. **Where does page copy live?** Recommended: letter in CMS.
    **Answer**: founder letter in the CMS; short legal lines fixed in the app.

11. **Receipts?** Recommended: provider sends to the account email, prefilled and locked.
    **Answer**: as recommended. The payment provider sends receipts to the verified account email, prefilled and locked.

12. **One provider customer per account?** Recommended: yes.
    **Answer**: one Stripe customer per It account, created on first support.

13. **Refund policy?** Recommended: on request within N days, manual.
    **Answer**: refunds on request within N days, handled manually. N set by the founder (O1).

14. **Account deletion?** Recommended: cancel recurring, keep records unlinked.
    **Answer**: cancel recurring support; keep payment records unlinked from the person for accounting; disclose on the privacy page.

15. **iOS for v0.1?** Recommended: hide payment on iOS for v0.1.
    **Answer**: primary is RevenueCat once/monthly/annual (Apple subscriptions + one-time purchases), tied to the account. Research App Review guideline 3.1.2 "ongoing value" risk before building. Secondary option: link out to web Support, explaining It receives more that way, optionally showing how much more for the selected amount (Apple 15% versus Stripe fees). Where link-out is allowed (US after the Epic v. Apple ruling, other regions) is a research question. Two management paths: Apple subscriptions in iPhone settings; the payment provider's portal on web. iOS stays optional for v0.1. Every App Store purchase is tied to the account (FR-025, commit c2a9850).

16. **Support as a funnel stage?** Recommended: no.
    **Answer**: yes. Track reached / supported / skipped as funnel stages, assumed unlinked from the account like other stages (confirm in review). The stage list belongs to a new measurement spec (not yet written).

17. **Public supporters or totals?** Recommended: none in v0.1.
    **Answer**: show an aggregate public funding total in v0.1, sourced and dated, with no individual supporters.

18. **Merchant identity?**
    **Answer**: We Are It LLC. Statement descriptor wording left to the plan (O3).

19. **"Cover the fees"?** Recommended: no.
    **Answer**: no.

20. **"Not tax-deductible" line?** Recommended: yes, near confirm.
    **Answer**: yes, one plain line near the confirm button; the founder approves the wording.

21. **Where does thank-you or skip lead?** Recommended: next onboarding step.
    **Answer**: Help build It (follows from Q1).

22. **Optional extras?** Recommended: defer both.
    **Answer**: defer the in-It management view and the comparison sidebar. The funding total (Q17) stands alone.

## Notes

- Copy rule stands: "support", never "donation", "donate" or "donor", even where those words come up casually in discussion.
