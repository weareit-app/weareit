# Proposal

## Why

`required-signup-gate` ships only a placeholder privacy page. Every other change adds something people need to be told about (measurement and linked visits, Help data, contributions, support providers, language, pain-page links), and AGENTS.md requires disclosure before data is sent. Old spec 010 and the founder's 2026-10-19 answers settle what the full page says (features.md: privacy, contact; 010's proposed §7 entry).

## What Changes

What people see:

- **Privacy page** (replaces the placeholder): a short plain summary, then one section per stage (before signup, at signup, after signup, supporting, helping), then rights and contact. Each section describes only what is live in that release.
- **Contents**: what stays on the device; measurement (stages, page views, pains opened; visits linked to the account after signup); the account (email, name, password or passkey, language, opt-in); saved picks and selected fixes; own contributions; Help data (background, skills, note, offers); support (Stripe, RevenueCat, the public run rate); pain-page links (tags stripped, no referrer); sessions and host logs; storage on the device and the sign-in cookie; who runs It (We Are It LLC); who It is for (16+); where data is stored (Neon, US, AWS us-east) and the transfer basis; the legal basis for each use; how long things are kept; rights and how to use them.
- **Contact**: `hello@weareit.app`, with `privacy@weareit.app` as an alias for privacy requests, in the footer (menu on small screens and when signed in).
- **FAQ page**: a short static FAQ alongside the privacy page.
- **Changes**: a "last updated" date and a dated list of changes; account holders get an email about material changes.
- No cookie banner.

Out of scope: self-serve deletion and export (by email in v0.1), the safety floor (deferred), choosing the email provider (open in `required-signup-gate`).

Must leave room for: self-serve deletion and export later; more languages (the page is translatable per `spanish-language`).

## Capabilities

### New Capabilities
- `faq-page`: a short static FAQ reachable without an account.

### Modified Capabilities
- `privacy-page`: the full page replaces the placeholder (capability introduced by `required-signup-gate`; this change adds requirements and, once that change is archived, removes its placeholder requirement).

## Impact

- App: `/privacy` content and structure, `/faq`, footer and menu links.
- Ops: an inbox for `hello@weareit.app` with the `privacy@` alias; a log of rights requests; host log settings.
- Docs: `docs/architecture/decisions.md` (retention periods, data location, legal bases).

## Open questions

- None for the founder beyond final wording: the transfer basis for US storage, the legal bases (account linking stays off at launch), and the 16+ line.
