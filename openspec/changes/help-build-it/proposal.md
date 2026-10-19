# Proposal

## Why

Signed-up people have no concrete way to offer their background, skills and time toward what It needs, and It has no structured record of who could help with what (features.md §5). The founder signed off on 2026-10-19: go on the full flow, background → suggested skills → matched asks, as a founder override of the weak-evidence rule, with the launch measures as the check.

## What Changes

What people see and do, after signup:

- **Help build It page**: comes after Support and before "You're all set", and is skippable. Signed-in people can also reach it from the menu.
- **Your background**: add jobs and volunteering from a list of occupations, education from a list of levels with an optional field of study, and an optional short note (up to 500 characters, seen only by the founder).
- **Your skills**: skills are suggested from the background, grouped under the entry that suggested each, showing the first 8 per group with "Show all". People keep a whole group or remove skills one by one; a skill suggested twice shows once.
- **Ways to help**: asks that fit the person's skills appear first under "These fit what you know", then every other open ask under "Other ways to help". The person ticks the asks they'd help with and submits.
- **Submitting**: the page says plainly that It may contact them about what they offered, and "We'll reach out if one of these needs you now. We can't reply to everyone."
- **Account screen**: new "Your background" and "Your offers" sections; offers can be changed or withdrawn, and closed asks show as closed.
- **Founder page** (behind the admin token): counts per ask, each individual offer with the person's background, skills and note, and a "followed up" mark.
- **Content editor**: asks as content (title, line, the skills each ask needs, open or closed), drafted with AI and approved by the founder.

Out of scope: matching people with people ("soon"), any public helper data, asks before signup, automated follow-up emails, crisis resources (safety floor deferred), the full privacy page and FAQ (010).

Must leave room for (features.md Stages): matching people with goals to people offering help (answers stored as ESCO references with original URIs; stable ask IDs), the Thing / Type / Relation layer (stable IDs, one shape for outside references).

## Capabilities

### New Capabilities
- `help-build-it`: the post-signup page where people give their background and skills and offer to help with asks; managing that on the account screen; the founder's view of offers.

### Modified Capabilities
- `content-catalog`: asks as founder-approved content with stable IDs, the skills each needs, and an open or closed state.

## Impact

- App: new `/help` route, menu link, account screen sections (account screen comes from `required-signup-gate`), founder page under the admin token; Support's "next" goes to Help.
- API: semantic operations for background, skills, offers, withdrawing, and the founder view; Zod-validated.
- Database: background entries, kept skills, offers, follow-up marks, asks; ESCO and ISCED reference data with attribution.
- Content: asks in the CMS (with Spanish versions per `spanish-language`).
- Dependencies: ESCO occupations and skills data; ISCED 2011 levels and broad fields. Licences verified before shipping.
- Measurement: uses the four Help stages and the `help` page view already listed in `visit-measurement`.

## Open questions

- None for the founder. Tasks include verifying ESCO's and ISCED's licence terms and the exact "modified from ESCO" notice, and the founder approving the 10 to 20 launch asks and final copy.
