# Spec Delta

## ADDED Requirements

### Requirement: Device copy cleared after a confirmed save
Once picks are confirmed saved to an account, the app SHALL remove the onboarding draft from the device. If the save is not confirmed, the draft SHALL stay on the device.

#### Scenario: Confirmed save
- **WHEN** signup succeeds and the server confirms the picks are stored
- **THEN** the draft is removed from device storage

#### Scenario: Unconfirmed save
- **WHEN** the save fails or the app closes before confirmation
- **THEN** the draft is still on the device next time

## MODIFIED Requirements

### Requirement: Draft kept on the device
The app SHALL keep the onboarding draft (selected personal and societal pains, the dreams and fixes picked under each pain, and a last-updated timestamp) in device storage (browser `localStorage` on web) under the key `it-onboarding-draft-v1`, with no expiry, until it is cleared or saved to an account. Stored data SHALL be validated against the draft schema when loaded; invalid data SHALL be discarded. Drafts stored before this change that contain help interests SHALL still load, with the help interests dropped.

#### Scenario: Return later on the same device
- **WHEN** the person reloads or returns days later in the same browser
- **THEN** their selected pains and picks are still there

#### Scenario: Corrupt stored draft
- **WHEN** the stored draft fails validation
- **THEN** the app starts with an empty draft instead of crashing

#### Scenario: Old draft with help interests
- **WHEN** a draft saved before this change includes help interests
- **THEN** the pains and picks load and the help interests are discarded

### Requirement: Clear choices
Before signup, a "clear choices" control SHALL let the person remove every choice from the device after a confirmation dialog offering "Keep them" or clearing. The control SHALL NOT be shown to a signed-in person.

#### Scenario: Clear and confirm
- **WHEN** a signed-out person confirms clearing
- **THEN** all pains, dreams and fixes are removed from the device

#### Scenario: Signed in
- **WHEN** a signed-in person views the personal or societal page
- **THEN** no clear-choices control is shown
