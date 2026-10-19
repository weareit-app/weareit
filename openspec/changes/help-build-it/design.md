# Design

## Context

See proposal.md. Nothing for Help exists today except the pre-signup interests screen (`apps/app/app/ways-to-help.tsx`) and `helpInterests` in the draft, both retired by `required-signup-gate`. That change also adds the account screen, signed-in menu, `/all-set` and the moment emitter; `embedded-support` decides where Support's "next" goes (whatever follows in the flow); `visit-measurement` already lists the Help stages (`help-reached`, `help-background-given`, `help-offered`, `help-skipped`) and the `help` page view; `spanish-language` covers Spanish content and the "English only for now" tag.

## Goals / Non-Goals

**Goals:** structured, reference-based Help answers; matching that never hides asks; offers people control; a founder view good enough to follow up by hand.

**Non-Goals:** people-to-people matching; automated outreach; a general admin area (006).

## Decisions

1. **Reference data in the database, not the bundle.** Import ESCO occupations, skills and the occupation → essential-skill relation (with Spanish labels) and ISCED 2011 levels and broad fields into tables (`ref_esco_occupations`, `ref_esco_skills`, `ref_esco_occupation_skills`, `ref_isced_levels`, `ref_isced_fields`) by a script, with the source version recorded. Edited labels live in an override table keyed by URI, per language, so originals stay intact. Search is server-side (prefix and trigram) to keep the app small.
2. **Person data.** `help_background_entries (user_id, kind: occupation|education, esco_uri | isced_level + isced_field, role: work|volunteer)`, `help_kept_skills (user_id, esco_uri)`, `help_notes (user_id, text ≤ 500)`, `help_offers (user_id, ask_id, state: offered|withdrawn, offered_at, followed_up_at)`. All cascade on account deletion.
3. **Asks as content.** Added to the content graph schema in `packages/content` (Zod): `{ id, title, line, neededSkills: esco_uri[], state: open|closed }`, published in the snapshot; provenance as for other records. The first asks are drafted from the retired ways-to-help items.
4. **Matching.** An ask matches when any needed skill is among the person's kept skills; matched asks are ordered by number of overlapping skills, then content order. Computed server-side from kept skills, never from the note.
5. **Semantic operations.** `help.getMine`, `help.setBackground`, `help.setKeptSkills`, `help.setNote`, `help.offer`, `help.withdraw`; founder: `helpAdmin.listOffers`, `helpAdmin.markFollowedUp`, behind the CMS admin token. Zod everywhere.
6. **Founder page** sits next to the measurement report behind the same token, as a plain table per ask.

## Risks / Trade-offs

- [Uncapped skills overwhelm people] → Grouped, 8 shown per group, "Keep all"; measure share kept (launch measure).
- [Offers nobody answers] → Honest copy, "followed up" marks and the founder page; follow-up rate is a launch measure.
- [ESCO import size] → Import only occupations, skills and the essential relation; check size before shipping.
- [Licence terms differ from the assumption] → Tasks verify ESCO and ISCED terms before shipping; adjust the notice or label edits.

## Migration Plan

Migration after `required-signup-gate`'s `006_signup_gate` (number assigned when built, after support and Spanish if they land first). No existing data.
