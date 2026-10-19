# Spec Delta

## ADDED Requirements

### Requirement: Required signup gate
After the societal page, continuing SHALL require an account. The gate SHALL ask for an email address with a "Continue" button and SHALL offer no way to continue without signing up or signing in. The personal and societal pages SHALL remain usable without an account.

#### Scenario: Continue from the societal page
- **WHEN** a signed-out person taps "Continue" or "Skip" on the societal page
- **THEN** they see the signup gate, with no "Not now"

#### Scenario: Browsing stays open
- **WHEN** a signed-out person opens the personal or societal page
- **THEN** they can open pains and pick dreams and fixes without being asked to sign up

#### Scenario: Already signed in
- **WHEN** a signed-in person continues from the societal page
- **THEN** the gate is skipped and their device picks are saved to the account

### Requirement: What will be saved
The gate SHALL list, before the person continues, exactly what signup saves: their picked dreams with the pain each was picked under, their selected fixes, and their opt-in choice. It SHALL say that nothing else on the device is sent.

#### Scenario: Reading the list
- **WHEN** the gate is shown
- **THEN** it lists picked dreams, selected fixes and the opt-in choice as the only things saved

### Requirement: Email opt-in
The gate SHALL show an opt-in checkbox for occasional update emails from It, unticked by default. It SHALL cover updates only. Its label SHALL be founder-approved copy; until then the placeholder is "Send me occasional updates about what It is building." The choice and the version of the label wording SHALL be saved with the account.

#### Scenario: Default
- **WHEN** the gate is first shown
- **THEN** the opt-in is unticked

#### Scenario: Opting in
- **WHEN** the person ticks the opt-in and signs up
- **THEN** the account records the opt-in and the wording version shown

### Requirement: Terms line
The gate SHALL show "By signing up you agree to…" with a link to the privacy page, with no checkbox.

#### Scenario: Following the link
- **WHEN** the person taps the privacy link on the gate
- **THEN** the privacy page opens and returning keeps what they entered

### Requirement: Code first
After the email is entered, It SHALL send an eight-digit code and show a code screen whose wording is the same whether or not an account exists for that email. Every new account SHALL be created by verifying a code, so its email is verified before any picks are saved.

#### Scenario: New email
- **WHEN** a new email is entered and the correct code is verified
- **THEN** an account is created with a verified email

#### Scenario: No account enumeration
- **WHEN** an email with an existing account is entered
- **THEN** the screen says the same thing it says for a new email

### Requirement: Password sign-in
The code screen SHALL offer a small "Use a password" link. A person who has set a password SHALL be able to sign in with email and password instead of a code. There SHALL be no separate password reset; a forgotten password is handled by signing in with a code.

#### Scenario: Sign in with password
- **WHEN** a person with a password taps "Use a password" and enters the correct password
- **THEN** they are signed in

#### Scenario: Forgotten password
- **WHEN** a person has forgotten their password
- **THEN** they can sign in with an emailed code instead

### Requirement: Passkey sign-in on web
On web, the email field SHALL accept the browser's own passkey suggestion, so a person with a registered passkey can sign in without a code or password. There SHALL be no extra passkey button.

#### Scenario: Saved passkey
- **WHEN** a person with a registered passkey focuses the email field on web and chooses their passkey
- **THEN** they are signed in

#### Scenario: iOS
- **WHEN** the gate is shown in the iOS app
- **THEN** sign-in is by code or password only

### Requirement: Request limits
It SHALL allow at most 5 code requests per email address per hour and SHALL limit requests per IP address. When a limit is reached, the person SHALL see "Try again in a few minutes."

#### Scenario: Too many requests
- **WHEN** a sixth code is requested for the same email within an hour
- **THEN** no code is sent and the person sees "Try again in a few minutes."

### Requirement: Required name step
Right after signup, a person whose account has no name SHALL be asked for one and SHALL NOT continue without entering it. Accounts SHALL NOT be given a placeholder name. Returning accounts that already have a name SHALL skip the step. The step SHALL carry one line, "Want a faster way back? Add a passkey or password", linking to the account screen.

#### Scenario: New account
- **WHEN** a person verifies their code for a new account
- **THEN** they are asked for their name before going on

#### Scenario: Returning account
- **WHEN** a person with a named account signs in at the gate
- **THEN** the name step is skipped

### Requirement: After signup
After the name step, the person SHALL go to the Support page and then to a "You're all set" screen.

#### Scenario: Flow after the name step
- **WHEN** a person enters their name
- **THEN** they see the Support page next

### Requirement: Saving picks fails safely
If saving picks fails after the account exists, the person SHALL stay signed in, the picks SHALL stay on the device, the app SHALL retry, and the screen SHALL say the picks are still safe on this device.

#### Scenario: Network error during save
- **WHEN** the code is verified but saving the picks fails
- **THEN** the picks remain on the device, a retry follows, and the person is told their picks are safe

### Requirement: Gate moments for measurement
The app SHALL mark the moment the gate is shown and the moment an account is created and picks saved, so the measurement change can count "reached the gate" and "signed up". This change SHALL NOT send them anywhere.

#### Scenario: Nothing sent yet
- **WHEN** the gate is shown or someone signs up
- **THEN** no measurement request is made

### Requirement: Signup privacy
Before signup, nothing from the device SHALL be sent. At signup, only picked dreams (with pain and content version), selected fixes (with content version), and the opt-in choice (with wording version) SHALL be sent. Opened or selected pains, help interests and draft timestamps SHALL NOT be sent. No account's picks SHALL be public.

#### Scenario: Payload
- **WHEN** a person signs up with selected pains but no picked dreams
- **THEN** the save contains no pains, only the (empty) picks and the opt-in

### Requirement: Signup accessibility
The gate, code and name screens SHALL be usable by keyboard with visible focus, SHALL label every field and announce errors to screen readers, SHALL not rely on colour alone for errors, and SHALL not animate when reduced motion is on.

#### Scenario: Wrong code
- **WHEN** a screen-reader user enters a wrong code
- **THEN** the error is announced and focus stays on the code field

### Requirement: Save picks to the account
After sign-in, the app SHALL send only the person's picked dreams (each with its pain), selected fixes and opt-in to the account, with the content version they were made under. The server SHALL combine them with any picks already saved on the account, keeping everything from both, and SHALL report success only once they are stored.

#### Scenario: Returning account with different picks
- **WHEN** a person with saved picks signs in on a new device that has different picks
- **THEN** the account keeps the union of both, and nothing is lost

#### Scenario: A pick that does not match its content version
- **WHEN** a save includes a pick that is not in the content version it claims
- **THEN** every other pick is saved, the unmatched pick is dropped and logged, and the save counts as confirmed

## MODIFIED Requirements

### Requirement: Email code sign-in
Entering an email and tapping "Continue" SHALL send an eight-digit code. The code SHALL expire after 10 minutes and allow at most 5 attempts, and SHALL be stored hashed. Entering the code SHALL sign the person in, creating the account if none exists. Email and password sign-in SHALL be enabled for accounts that have set a password.

#### Scenario: Wrong code too often
- **WHEN** the person enters a wrong code five times
- **THEN** the code stops working and they must request a new one

## REMOVED Requirements

### Requirement: Optional save screen
**Reason**: Signup is required after the societal page (founder decisions C4, confirmed 2026-10-19).
**Migration**: The save screen at `/save-progress` is replaced by the signup gate, code screen and name step; links to `/save-progress` go to the gate.

### Requirement: Save the draft to the account
**Reason**: Signup no longer sends the whole draft or overwrites saved picks (founder, 2026-10-17, confirmed 2026-10-19).
**Migration**: Replaced by "Save picks to the account": only picked dreams, selected fixes and the opt-in are sent, and they are combined with any picks already saved.
