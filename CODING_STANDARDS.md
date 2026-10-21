# Coding standards

Rules that `/code-review` applies to a diff. They are judgement calls that no automated check can make. Anything a script can enforce belongs in lint, the pre-commit hook (`lefthook.yml`) or CI (`.github/workflows/ci.yml`) instead.

## Vendor claims carry their source

Every claim in the diff about an outside vendor's price, limit, default or behaviour (GitHub, Expo, Stripe, Render, Neon, Resend and so on) names its source and the date it was checked, for example "(checked 2026-10-20 against GitHub's Actions billing docs)". A claim with no source is a finding, and so is one that the cited source does not actually say. This includes claims passed on by another agent or reviewer: check them against the source before they go in. Check a claim against the section of its source that it cites; for a web page, ask WebFetch about that section by name.

## UI copy in stories, tests and fixtures is real

Text that people would read in the app, when it appears in a story, test or fixture, comes from the app or from `@it/content` (in stories, through `apps/app/src/stories/content.ts`). It is never invented for the occasion, so stories and tests show and check what people will actually read. Invented copy is a finding. Placeholder data that is not UI copy, such as an ID or a test email address, is fine.
