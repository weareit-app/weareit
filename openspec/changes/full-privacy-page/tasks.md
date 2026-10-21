# Tasks

Builds after `required-signup-gate`; sections for other features ship with those features.

## 1. Page

- [ ] 1.1 Rebuild `/privacy` as summary + stage sections + rights + contact, each section tied to its feature switch
- [ ] 1.2 Write placeholder copy for every live section in the message catalogs; founder approves
- [ ] 1.3 Add "last updated", the dated change list, operator, 16+, data location, legal bases and retention
- [ ] 1.4 Test: every live feature has a section; the gate's list matches the signup section

## 2. Contact and FAQ

- [ ] 2.1 Set up `hello@weareit.app` with the `privacy@weareit.app` alias
- [ ] 2.2 Set Privacy and FAQ to published in the shared link list from `public-pages` (`apps/app/src/navigation/site-links.ts`) when `/privacy` and `/faq` ship; verify they appear in the footer and the menu (Contact is already there)
- [ ] 2.3 Build `/faq` with founder-approved answers

## 3. Operations

- [ ] 3.1 Configure the host to drop or truncate IPs and paths, or keep logs at most 14 days
- [ ] 3.2 Start the rights-request log; document the 30-day reply process
- [ ] 3.3 Record retention periods, data location and legal bases in `docs/architecture/decisions.md`

## 4. Verification

- [ ] 4.1 Accessibility pass: headings, 200% text, keyboard, screen reader
- [ ] 4.2 Compare every section with what the build actually sends and stores

## Workflow follow-up

- Founder finalises the wording for the transfer basis, legal bases and 16+ line
- After `required-signup-gate` is archived, update this delta to remove its placeholder requirement, then archive with `/opsx:archive`; fill the `specs/010-safety-privacy/` row in `docs/spec/MIGRATION.md`
