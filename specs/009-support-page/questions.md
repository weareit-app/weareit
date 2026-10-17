# Open questions: 009 Support page

For founder review. Numbers match the `[NEEDS CLARIFICATION]` references in `spec.md`. Recommendations are suggestions only; none is decided.

1. **Where does Support sit in the flow?**
   - A: Straight after signup, before Help (features.md order 3 → 4 → 5).
   - B: After Help.
   - C: Not a step; only a link (e.g. from a menu or the end of onboarding).
   - *Recommendation*: A, with a prominent skip. It follows features.md order and the "you're not the product" message lands while the person is most engaged.

2. **How do people reach Support again, and what happens to today's pre-signup links?** (`apps/app/app/onboarding/futures.tsx`, `apps/app/app/ways-to-help.tsx` link to `/support-it` before signup.)
   - A: Remove pre-signup links; after signup, a persistent "Support It" link in the account area or footer.
   - B: Keep pre-signup links but route them to signup first.
   - C: Keep pre-signup links and allow guest support (reopens C6).
   - *Recommendation*: A. Keeps payment-provider code off pre-signup pages and avoids nudging money before signup.

3. **Is anything preselected?** (Today: $15 and "once" are preselected.)
   - A: Nothing preselected; the confirm button appears once both are chosen.
   - B: Preselect "once" only.
   - C: Preselect cadence and a middle amount (today's behaviour).
   - *Recommendation*: B. Low pressure, one less step, and avoids defaulting people into recurring charges.

4. **Preset amounts and limits per cadence?** (Today: $5 / $15 / $30 + other, $1–$1,000, monthly only.)
   - A: Same presets for all cadences.
   - B: Per-cadence presets (e.g. once $10/$25/$50, monthly $5/$10/$20, yearly $50/$100/$200).
   - C: Founder supplies exact numbers.
   - *Recommendation*: C, with B as the shape. Keep $1 minimum; reconsider the $1,000 maximum for annual.

5. **Currency.**
   - A: USD only for v0.1.
   - B: Provider-side local currency presentment.
   - *Recommendation*: A. Matches existing code; revisit after launch.

6. **Which payment methods does the embedded form offer?**
   - A: Cards only.
   - B: Cards plus wallets (Apple Pay / Google Pay on web) and the provider's saved-details option.
   - C: Also bank debits (settle over days; need "pending" handling).
   - *Recommendation*: B. Wallets reduce friction; delayed methods add states for little v0.1 gain.

7. **When does the payment form load?**
   - A: When the Support page opens.
   - B: Only after the person picks a cadence and amount (or taps "Support").
   - *Recommendation*: B. Skippers never load provider scripts or fraud signals.

8. **Restructure the ledger now?** (Today `support_contributions` carries `stripe_*`, `store_*` and `revenuecat_app_user_id` columns inline; `packages/database/src/migrations/003_support_payments.ts`.)
   - A: Move provider IDs into separate provider-reference records now, while there is no production data.
   - B: Keep inline columns for v0.1 and only add annual cadence.
   - *Recommendation*: A. No live data yet, so it is cheapest now, and decisions.md already describes "provider-neutral records and mappings".

9. **May one account hold more than one active recurring support?**
   - A: No; show manage instead of a new recurring form.
   - B: Yes, any number.
   - *Recommendation*: A. Prevents accidental double subscriptions; one-time support stays available.

10. **Where does page copy (founder letter, headings, legal lines) live?**
    - A: CMS-managed content, like onboarding content (decisions.md: database + CMS).
    - B: Fixed in the app for v0.1.
    - *Recommendation*: A for the letter, so the founder can edit without a release; B is acceptable for short legal lines.

11. **Receipts: who sends them and to which email?**
    - A: Payment provider sends receipts to the account email, prefilled and locked.
    - B: Provider sends to any email the person enters.
    - C: It sends its own receipts.
    - *Recommendation*: A. Simplest; ties records to the account; 008 must confirm the account email is verified.

12. **One payment-provider customer per It account?** (Draft D10 suggests yes.)
    - A: Yes, created on first support.
    - B: New customer per support.
    - *Recommendation*: A. Lets one management page cover all of a person's recurring support.

13. **Refund policy and wording.**
    - A: Refunds on request within N days, handled manually by the founder.
    - B: No stated policy in v0.1; handle case by case.
    - *Recommendation*: A with N set by the founder.

14. **Account deletion: what happens to support records and active recurring support?**
    - A: Cancel recurring support; keep financial records with the account link removed, for the legal retention period.
    - B: Cancel and delete everything.
    - *Recommendation*: A. Matches today's `on delete set null`; privacy page (010) must say so.

15. **iOS behaviour for v0.1** (iOS optional; C7: verify App Store rules before building recurring).
    - A: Keep existing RevenueCat one-time tips; no recurring on iOS until research is done.
    - B: Hide payment on iOS; show the letter and skip only.
    - C: Build in-app once/monthly/annual through Apple after research confirms it is allowed.
    - *Recommendation*: B for v0.1 if the iOS app ships at all, then C after the research question resolves. Avoids App Review risk blocking the iOS release.

16. **Is reaching or completing Support a funnel stage?** (Pre-signup funnel is stages only; Support is post-signup and the person is identified.)
    - A: No page-view tracking; admin sees only support records.
    - B: Add an aggregate, unlinked "reached Support / supported / skipped" count.
    - *Recommendation*: A. Support records already give totals; avoids new tracking of signed-in people.

17. **Any public mention of supporters or funding totals?**
    - A: None in v0.1.
    - B: Aggregate funding total (ties to the optional comparison sidebar).
    - *Recommendation*: A. Defer with the sidebar; must be sourced and dated if added.

18. **Merchant identity: which legal entity and statement descriptor appear on card statements?** (Corporate form is an open decision.)
    - A: Founder as sole proprietor for v0.1.
    - B: Wait for the entity.
    - *Recommendation*: Founder decision; must be settled before live mode, not before the plan.

19. **Offer "cover the processing fees"?**
    - A: No.
    - B: Optional checkbox, unticked.
    - *Recommendation*: A for v0.1. Fewer choices, no extra pressure.

20. **Should copy explicitly say support is not tax-deductible?**
    - A: Yes, one plain line near the confirm button.
    - B: Only in the FAQ or privacy/terms.
    - *Recommendation*: A, wording approved by the founder. Prevents people assuming charity status.

21. **Where does the thank-you (or skip) lead?**
    - A: The next onboarding step (likely Help, spec 011).
    - B: A home or roadmap view.
    - *Recommendation*: A; depends on Q1 and 011.

22. **Optional features: include in this spec or defer?** Manage/cancel inside It; comparison sidebar.
    - A: Defer both to after v0.1 core; this spec only leaves room.
    - B: Include the in-It management view.
    - *Recommendation*: A. The hosted management page is core and sufficient.
