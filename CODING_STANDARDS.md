# Coding standards

Rules that `/code-review` applies to a diff. They are judgement calls that no automated check can make. Anything a script can enforce belongs in lint, the pre-commit hook (`lefthook.yml`) or CI (`.github/workflows/ci.yml`) instead.

## Vendor claims carry their source

Every claim in the diff about an outside vendor's price, limit, default or behaviour (GitHub, Expo, Stripe, Render, Neon, Resend and so on) names its source and the date it was checked, for example "(checked 2026-10-20 against GitHub's Actions billing docs)". A claim with no source is a finding, and so is one that the cited source does not actually say. This includes claims passed on by another agent or reviewer: check them against the source before they go in.
