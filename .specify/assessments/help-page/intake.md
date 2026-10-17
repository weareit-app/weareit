# Idea Intake: Help page (features.md §5)

- **Slug**: help-page
- **Created**: 2026-10-17
- **Source**: repo paths `docs/spec/features.md` §5; `apps/app/app/ways-to-help.tsx`; `.specify/assessments/it-mvp/`; request from the orchestrating session (2026-10-17) to assess the Help page because it is ill-defined
- **Type**: exploration

## Idea (as captured)

From `docs/spec/features.md` §5:

> 5. Help: "What could you help make possible?" — ? ILL-DEFINED, needs its own design pass
>
> Founder's rough direction (2026-10-16), not settled:
> 1. ? Say your background (education, work, or whatever fits).
> 2. ? Suggest relevant skills from It's modified ESCO skills list; you confirm or adjust.
> 3. ? Recommend specific things It needs help with (curated roadmap items, not generic "idea cards"), matched to those skills.
>
> - ✔ core Skip.
> - ✗ Dropped: generic "would you use it?" idea cards. Replaced by curated roadmap items (?).
> - ? Homefront's pickers (job titles, skills, roles, interests) are inspiration only; roles and interests would be done very differently.

Related lines in the same file:

> 6. Admin — ✔ (optional) Help offers; mark as followed up. ? (optional) Interest in roadmap items (depends on Help page design).
>
> soon — Matching people with goals to people offering help — must not block: Help-page answers use structured lists (job titles, skills), not just free text.

The orchestrating request framed the assessment more broadly, asking that shaping also weigh a static FAQ, contextual help, a contact/feedback channel, merging with the safety floor / crisis resources, merging with Support It, and dropping the page from the MVP.

## Restated

The word "Help" covers two different ideas. In `features.md` §5 it means a signed-in person **offering help to It**: saying their background, confirming skills, and choosing roadmap items they'd help with. The orchestrating request also brings in the other meaning, **getting help from It** (FAQ, contact, crisis resources). This intake records both. Later stages must keep them apart.

## What already exists in code

- `apps/app/app/ways-to-help.tsx`: a pre-signup "There is room for you in this" screen. It shows five fixed interest cards (`recruiting`, `research`, `product-feedback`, `skills`, `open-to-anything`) that the person can toggle, plus links to `/onboarding/futures`, `/support-it` and `/save-progress`. The "skills" card says "We are building a way to map skills to real tasks as the roadmap grows."
- `packages/domain/src/onboarding.ts`: `helpInterestIds` enum and `onboardingDraftSchema.helpInterests` (Zod, strict).
- `apps/app/src/state/onboarding-store.ts`: `helpInterests` and `toggleHelpInterest` in the on-device draft. `apps/app/src/components/clear-draft-control.tsx` clears them.
- `apps/app/app/save-progress.tsx`, `packages/database/src/types.ts:101`, `packages/database/src/content-repository.ts:129`: help interests are saved with the draft at the email-code gate.
- No ESCO data, occupation or skill pickers, roadmap-item content type, offer record, contact consent, or admin follow-up exist yet.
- **"Get help" meaning:** there is no help, FAQ, contact, feedback, crisis or report route. The only related code is the per-first-action `safetyNote` (`apps/app/src/components/first-action-card.tsx`, edited in `apps/app/app/cms/index.tsx`) and the Stripe portal call in `apps/app/app/support-it.tsx:118` (`apiClient.support.createPortal`).
- Routes today: `apps/app/app/{index,save-progress,support-it,ways-to-help}.tsx`, `onboarding/{personal,world,futures}.tsx`, `cms/index.tsx`.

## Origin & Context

- **Raised by**: founder (rough direction, 2026-10-16, in `features.md`); assessment requested by the orchestrating session on 2026-10-17.
- **Trigger**: §5 is marked "ILL-DEFINED, needs its own design pass". The it-mvp assessment (`.specify/assessments/it-mvp/decision.md`) handed off a Help flow (background → ESCO skills → about 5–15 curated roadmap asks), but `features.md` still marks every step "?". Spec 001 lists the split as "005 help". The orchestrator has reserved spec number **011** for this assessment if it goes forward. [NEEDS CLARIFICATION: which number is canonical]

## First-Glance Unknowns

- [NEEDS CLARIFICATION: Which meaning of "Help" is §5: offering help to It, getting help from It, or both?]
- [NEEDS CLARIFICATION: What is the page for in v0.1: collecting offers to follow up, testing the skills-matching idea, showing the roadmap, or recruiting?]
- [NEEDS CLARIFICATION: Who writes the roadmap asks, how many, and where they live (CMS?)]
- [NEEDS CLARIFICATION: What "modified ESCO list" means, and what licence attribution is needed]
- [NEEDS CLARIFICATION: How much follow-up capacity the founder has, and what people are told to expect]
- [NEEDS CLARIFICATION: Does the existing pre-signup `ways-to-help` interests screen survive, merge, or go?]
- [NEEDS CLARIFICATION: Is a separate contact/FAQ/"get help" surface needed in v0.1, and which lane owns it?]
