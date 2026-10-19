# content-catalog Specification

## Purpose
Pains, dreams, fixes and their groups are database-backed content, edited in a founder-only content editor (`/cms`) and published as immutable versions that the app reads.

## Requirements

### Requirement: Published content
The API SHALL serve the latest published content version: groups (domains with scope `personal` or `world`), pains, dreams, fixes, pain–dream links and fix–dream links, each with a sort order. Published versions SHALL be immutable snapshots.

#### Scenario: App loads content
- **WHEN** the personal page loads
- **THEN** it renders the groups and pains from the latest published version

### Requirement: Founder-only editor
CMS operations (get, save, validate and preview the draft; publish; list versions; roll back) SHALL require the `CMS_ADMIN_TOKEN`; the API server SHALL refuse to start without it.

#### Scenario: Missing token
- **WHEN** a CMS operation is called without the admin token
- **THEN** it is refused

### Requirement: Publish and roll back
Publishing SHALL validate the draft graph and create a new version; the founder SHALL be able to list versions and roll back to an earlier one, each with a change note.

#### Scenario: Invalid graph
- **WHEN** the draft references a dream that does not exist
- **THEN** publishing is refused with a validation error

### Requirement: Readable stable IDs
Every pain, dream and fix SHALL have a readable kebab-case ID (for example `poor-sleep`), validated by the content schema.

#### Scenario: Bad ID
- **WHEN** a record's ID contains spaces or capitals
- **THEN** the content schema rejects it

## Known divergence from founder decisions (2026-10-19)
- The editor lets the founder rename a published record's ID, which cascades to links but breaks saved picks and any future `/p/<slug>` links; spec 001 FR-020 and decisions.md require IDs never change once published.
- There are no slugs, aliases or retired states (spec 012 direction).
- Fixes record no evidence level yet (founder 2026-10-19: record it, don't show it in v0.1).
- No review queue for people's own contributions (decided 2026-10-18; part of admin).
