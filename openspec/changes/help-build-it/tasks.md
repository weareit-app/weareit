# Tasks

Builds after `required-signup-gate` (account screen, menu, `/all-set`, moment emitter).

## 1. Licences and reference data

- [ ] 1.1 Write the ESCO credit and "modified" notice to CC BY 4.0's terms (ESCO is CC BY 4.0, founder 2026-10-19: modification allowed with attribution, a licence link and an indication of changes); verify ISCED 2011 reuse terms
- [ ] 1.2 Script to import ESCO occupations, skills, the essential-skill relation and Spanish labels, and ISCED levels and broad fields, recording source versions
- [ ] 1.3 Label override table per language, keyed by URI

## 2. Data and API

- [ ] 2.1 Migration: background entries, kept skills, note, offers with follow-up marks; cascade on account deletion
- [ ] 2.2 Add asks to the content graph schema (Zod) and the snapshot; editor support for title, line, needed skills, open/closed and approval
- [ ] 2.3 `help.*` operations and founder `helpAdmin.*` operations with Zod inputs; matching computed server-side
- [ ] 2.4 Tests: matching order, no-match falls back to "Other ways to help", withdrawn and closed offers, deletion removes everything, other accounts can't read Help data

## 3. Screens

- [ ] 3.1 `/help` page: background pickers (occupations with work/volunteer, education level and field), optional note with 500-character limit, ESCO and ISCED credits
- [ ] 3.2 Skill groups: first 8 per group, "Show all", "Keep all", remove, de-duplication
- [ ] 3.3 Asks: "These fit what you know" then "Other ways to help"; tick and submit; contact line before, honest follow-up line after
- [ ] 3.4 Route Support's "next" to `/help`, and Help's skip/finish to `/all-set`; set the Help entry in the shared link list from `public-pages` (`apps/app/src/navigation/site-links.ts`) to published; verify it appears in the footer and menu only when signed in
- [ ] 3.5 Account screen: "Your background" and "Your offers" sections; withdraw; closed asks marked
- [ ] 3.6 Founder page behind the admin token: counts per ask, offers with background, skills and note, "followed up" mark
- [ ] 3.7 Emit the four Help moments and the `help` page view through the existing emitter

## 4. Content

- [ ] 4.1 Draft 10 to 20 asks with their needed skills (starting from the retired ways-to-help items) for founder approval
- [ ] 4.2 Spanish versions of asks per `spanish-language`

## 5. Verification

- [ ] 5.1 Unit, router and Playwright tests pass; typecheck and lint pass
- [ ] 5.2 Keyboard and screen-reader pass on pickers, skill groups and asks
- [ ] 5.3 Privacy page lists what Help stores and that offering means It may contact you

## Workflow follow-up

- Founder approves launch asks and final copy
- Archive with `/opsx:archive` once shipped; fill the help-page row in `docs/spec/MIGRATION.md` and delete `.specify/assessments/help-page/`
