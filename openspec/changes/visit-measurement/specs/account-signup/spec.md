# Spec Delta

## ADDED Requirements

### Requirement: Link the visit at signup or sign-in
When signup or sign-in completes, and when a visit starts already signed in, the app SHALL send the current visit number in an authenticated request so the server links this visit to the account. Only the current visit SHALL be linked. Signup and sign-in SHALL NOT wait for or depend on this request.

#### Scenario: Signup completes
- **WHEN** a person verifies their code and their account is created
- **THEN** the app sends the current visit number to be linked to that account, and nothing about earlier visits

#### Scenario: Link request fails
- **WHEN** the link request fails
- **THEN** signup continues normally and the visit stays unlinked

### Requirement: Gate lists this visit
The gate's list of what will be saved SHALL include one line saying that the pages, pains opened and steps of this visit are saved to the account, in every release that sends measurement. Founder-approved copy SHALL replace the placeholder wording.

#### Scenario: Reading the gate list
- **WHEN** the gate is shown in a release that sends measurement
- **THEN** its list includes this visit's pages, pains opened and steps alongside picked dreams, selected fixes and the opt-in choice

#### Scenario: Release without measurement
- **WHEN** the gate is shown in a release that sends no measurement
- **THEN** the list does not mention this visit
