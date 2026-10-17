# Decision: It MVP (v0.1)

- **Slug**: it-mvp
- **Decided**: 2026-10-16
- **Verdict**: go (founder override of the evidence gate)
- **Artifacts reviewed**: intake.md | research.md | problem.md | concept.md

## Scorecard

| Criterion | Rating | Justification |
|-----------|--------|---------------|
| Problem validity | adequate | The everyday and societal pains are common, but nobody outside the project has yet confirmed that "pains → dreams → ideas" is how people want to approach them (research: Users & Demand). |
| Evidence strength | weak | One informal tester (Hilary, positive), Homefront as prior art for the Help flow, and AI-generated drafts. No interviews, analytics or waitlist data (research). |
| Value vs. inaction | strong | Without a launch the founder has no income and no evidence, under near-term financial pressure. The build reuses a large existing scaffold (problem: Cost of Inaction; research: Prior Art). |
| Feasibility / appetite | adequate | Option B fits one week only with its fixed cut order. Content approval (about 200–250 ideas) and embedded recurring payments are the main risks; Option C is the fallback (concept). |
| Strategic fit | strong | Matches AGENTS.md product intent and every founder decision (signup gate, embedded Stripe form, "support" wording, privacy invariants, web first). |
| Risk posture | adequate | Main risks are named and each has a mitigation: cut order, signup review line at about 50% drop-off, never-cut list, web only, Stripe already verified. Unmitigated: weak demand evidence (accepted below). |

## Verdict & Rationale

The assessment rule allows **go** only when evidence strength is adequate or better. Here it is **weak**, so by the rule the verdict would be **needs-clarification**. The founder chose on 2026-10-16 to **override** this and go. The reasoning: v0.1 is itself the cheapest way to get the missing evidence. It costs about a week, the founder continues with It regardless, and the build includes the measures that answer the open questions ("I'd use this" marks, the stage funnel, signup drop-off, support conversion). Value versus inaction and strategic fit are strong, feasibility and risk are adequate, and Option B makes sure Support (the primary goal) and the learning signals ship even if the week runs short.

**Conditions of the override:**
1. **Mid-week check:** if content approval or embedded payments are clearly taking most of the week, switch to Option C (smallest version) rather than delay launch.
2. **Launch measures are mandatory:** "I'd use this" marks, the stage funnel and support conversion ship in v0.1 and are never cut.
3. **Signup review line:** if more than about half of people who finish both pages leave at signup, revisit required signup (with a decision record).
4. **Re-assess after launch:** about a month after launch, review the measures and decide what to change. Evidence is no longer "weak" once real visitors have used it.

## If needs-clarification

Not applicable (overridden; see above). Had the rule been followed, the blocking question would have been: do people outside the founder's circle find the futures and ideas useful? Revisit stage: research.

## If go — Handoff to `/speckit-specify`

- **Problem**: People feel personal and societal pains but can't put a better future or a first step into words, and writing about themselves is stressful. It needs to learn quickly whether the public values this enough to support it.
- **Chosen approach**: Option B: the full v0.1, built and launchable in the order a visitor meets it. (1) Personal and societal pages: all 30 Tier 1 pains, several dreams each, AI-drafted ideas the founder approves, honest labels, "I'd use this" marks, picks on device, stage funnel and coarse totals described on the page. (2) Required signup by email code or password, saving picks with their content version, and an unticked opt-in for emails. (3) Support: the founder's letter, embedded Stripe form for once / monthly / yearly, the Stripe portal link, and a skip option. (4) Help: pick your background, get skills suggested from ESCO's occupation-to-skill links to confirm or adjust (as in Homefront), see matching founder-curated roadmap asks (about 5–15), tick what you'd help with, skip allowed, with ESCO and O*NET CC BY 4.0 attribution. (5) Small admin: totals (never individuals), support payments, help offers marked as followed up.
- **In scope / out of scope**: In: the five steps above, web only. Optional only after all five work, cut first if late: comparison sidebar, in-app support management, invitations. Out: native iOS release and iOS payments; story, sharing, matching people, starting from a dream ("soon": the build must not block them, per features.md); publishing unapproved AI content; tracking picks before signup; "donation" or charity wording; a general CMS page builder.
- **Success metrics**: support conversion (count, once vs. recurring); Support page reach after signup; share of visitors who pick a dream and "I'd use this" marks per visitor; signup rate at the gate (review line about 50% drop-off); stage funnel; zero honesty-label errors and no reports of feeling pressured. No numeric targets; the measures guide what to change next.
- **Carried-forward open questions**:
  - Which communities and people are in the launch outreach (before launch day).
  - Whether the founder can approve about 200–250 ideas within the week (mid-week check).
  - How to cap or order ESCO skill suggestions so the list is comfortable to confirm.
  - Exact ESCO / O*NET attribution text.
  - The founder's final Support letter text.
  - NativeWind v5 pre-release: re-check before launch (decisions.md).
  - Spec-time conflicts to watch: `docs/roadmap/mvp.md` still describes OTP-only signup, hosted Checkout and iOS consumable tips; features.md and decisions.md win.
