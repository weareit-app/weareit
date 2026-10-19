# on-device-choices Specification

## Purpose
Before signup, everything a person chooses on the personal and societal pages is kept only on their device, survives reloads, and can be cleared. This capability covers the on-device draft and what the app tells people about it.

## Requirements

### Requirement: Draft kept on the device
The app SHALL keep the onboarding draft (selected personal and societal pains, the dreams and fixes picked under each pain, help interests, and a last-updated timestamp) in device storage (browser `localStorage` on web) under the key `it-onboarding-draft-v1`, with no expiry. Stored data SHALL be validated against the draft schema when loaded; invalid data SHALL be discarded.

#### Scenario: Return later on the same device
- **WHEN** the person reloads or returns days later in the same browser
- **THEN** their selected pains and picks are still there

#### Scenario: Corrupt stored draft
- **WHEN** the stored draft fails validation
- **THEN** the app starts with an empty draft instead of crashing

### Requirement: Nothing sent before signup
The app SHALL NOT send the draft, or any count derived from it, to the server before the person signs in on the save screen. No analytics, telemetry or third-party trackers SHALL run.

#### Scenario: Browsing without an account
- **WHEN** a person selects pains and picks dreams without signing in
- **THEN** no request carries their choices

### Requirement: Clear choices
A "clear choices" control SHALL let the person remove every choice from the device after a confirmation dialog offering "Keep them" or clearing.

#### Scenario: Clear and confirm
- **WHEN** the person confirms clearing
- **THEN** all pains, dreams, fixes and help interests are removed from the device

### Requirement: On-device notice
The pages SHALL tell the person their choices are kept on this device (for example "N selected · kept on this device").

#### Scenario: Count shown
- **WHEN** the person has selected three pains
- **THEN** the page shows "3 selected · kept on this device"

## Known divergence from founder decisions (2026-10-19)
- There is no privacy page and no link to one (spec 010 direction).
- The measurement described in AGENTS.md (stage funnel, page views, opened pains) is not built.
- The clear control is shown after sign-in too, and the device copy is not cleared after saving to an account (founder: clear after a confirmed save; control pre-signup only).
- The draft still holds help interests and a timestamp, both of which the founder decided not to send at signup.
