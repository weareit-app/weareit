# Design

## Context

See proposal.md. `required-signup-gate` introduces the `privacy-page` capability with a placeholder (requirements: Public privacy page, Placeholder content matches behaviour, Services named, Age). Other changes each add something to disclose: `visit-measurement` (switched off until the privacy wording ships), `help-build-it`, `own-contributions`, `embedded-support`, `spanish-language`, `pain-pages`.

## Goals / Non-Goals

**Goals:** one page that is always true for the release it ships in; a clear way to use rights; nothing claimed that isn't true.

**Non-Goals:** self-serve deletion or export; a legal policy beyond the plain page (founder chose the plain page only for v0.1).

## Decisions

1. **Page content as sections tied to features.** The page is built from sections, each tagged with the feature it describes; a section renders only if its feature is live in the build (for example `EXPO_PUBLIC_MEASUREMENT_ENABLED`). A test fails if a live feature has no section.
2. **Copy in the app, translatable.** Text lives in the message catalogs so Spanish follows `spanish-language`; the founder approves both.
3. **Change list** as a small dated data file rendered on the page; material changes trigger a one-off email through the `sendEmail` boundary.
4. **Rights requests** handled by email; a simple log (date, type, account, outcome) kept by the founder outside the app in v0.1.
5. **Archive order.** Archive `required-signup-gate` first. Then update this change's delta to REMOVE its "Placeholder content matches behaviour" requirement (and fold "Services named" and "Age" if they duplicate), before archiving this one.

## Risks / Trade-offs

- [Page drifts from behaviour] → Sections tied to feature switches; a test compares the gate's list with the page's signup section.
- [A basis changes later] → Bases live in one section; account linking stays off until switched on deliberately.

## Open Questions

- Final wording: transfer basis for US storage, legal bases (linking especially), 16+ wording.
