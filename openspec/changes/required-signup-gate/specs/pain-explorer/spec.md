# Spec Delta

## ADDED Requirements

### Requirement: Sign-in link when signed out
When signed out, the personal and societal pages SHALL show a small "Sign in" link at the top that opens the same email-first sign-in as the gate. Picks already on the device SHALL be combined into the account when the person signs in. The link SHALL NOT be shown when signed in.

#### Scenario: Returning person on a new device
- **WHEN** a person with an account taps "Sign in" on a new device that has some picks and signs in
- **THEN** the device's picks are combined with their saved picks

#### Scenario: Signed in
- **WHEN** a signed-in person views the personal page
- **THEN** no "Sign in" link is shown

### Requirement: Signed-in picks live in the account
For a signed-in person, the personal and societal pages SHALL show the picks saved on their account and SHALL save each change to the account automatically, with no save button.

#### Scenario: Edit after signup
- **WHEN** a signed-in person picks another dream
- **THEN** it is saved to their account without any further action

#### Scenario: Another device
- **WHEN** the same person signs in on a second device
- **THEN** they see the picks they made on the first

## MODIFIED Requirements

### Requirement: Moving on
The bottom of each page SHALL show a button reading "Skip" before any interaction and "Continue" after, linking to the next step (personal → societal → signup gate, or past the gate when already signed in), the line "Free, and you're not the product.", a count "N selected · kept on this device" (before signup), and, before signup only, the clear-choices control.

#### Scenario: Skip without choosing
- **WHEN** the person taps "Skip" on the personal page without choosing anything
- **THEN** they go to the societal page

#### Scenario: Continue from the societal page
- **WHEN** a signed-out person taps "Continue" on the societal page
- **THEN** they go to the signup gate
