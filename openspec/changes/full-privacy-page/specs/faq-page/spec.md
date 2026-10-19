# Spec Delta

## Purpose

A short static page of common questions about It, reachable without an account, next to the privacy page and contact address.

## ADDED Requirements

### Requirement: FAQ page
It SHALL have a short static FAQ page reachable without an account and linked from the footer (menu on small screens and when signed in). Its answers SHALL be founder-approved and SHALL match the privacy page.

#### Scenario: Signed out
- **WHEN** a signed-out person opens the FAQ
- **THEN** it loads without asking them to sign in

### Requirement: FAQ honest status
The FAQ SHALL not describe unbuilt features as available and SHALL say "support", never "donation".

#### Scenario: Wording
- **WHEN** someone reads the FAQ
- **THEN** it never says "donate" or "donation" and never presents a planned feature as live
