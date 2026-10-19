# account-signup Specification

## Purpose
An optional save screen (`/save-progress`) lets a person create an account with an emailed sign-in code and save their on-device exploration to it. Accounts use Better Auth on the API server.

## Requirements

### Requirement: Optional save screen
The save screen SHALL be titled "Save your exploration", say the choices have stayed on this device and to enter an email "only if you'd like to create an account and save them", and offer "Not now", which continues to `/ways-to-help` without signing up.

#### Scenario: Decline
- **WHEN** the person taps "Not now"
- **THEN** they continue without an account and their choices stay on the device

### Requirement: Email code sign-in
Entering an email and tapping "Email me a code" SHALL send an eight-digit code. The code SHALL expire after 10 minutes and allow at most 5 attempts, and SHALL be stored hashed. Entering the code and tapping "Verify and save" SHALL sign the person in, creating the account if none exists. Password sign-in SHALL be disabled.

#### Scenario: Wrong code too often
- **WHEN** the person enters a wrong code five times
- **THEN** the code stops working and they must request a new one

### Requirement: Save the draft to the account
After sign-in, the app SHALL send the whole on-device draft to `account.saveOnboarding` together with the published content version. The server SHALL reject the save if any referenced item is missing from that version, and SHALL store one draft per account, overwriting any earlier one. On success the screen SHALL say "Your account is ready" / "Your exploration is saved."; on failure it SHALL say the choices are still on this device.

#### Scenario: Second save overwrites
- **WHEN** a person who already saved signs in on another device and saves different choices
- **THEN** the account's saved draft is replaced by the new one

### Requirement: Sessions
The API server SHALL turn a valid Better Auth session into the user ID the API sees; on iOS the session SHALL be kept in secure storage.

#### Scenario: Signed-out API call
- **WHEN** `account.saveOnboarding` is called without a session
- **THEN** it fails with UNAUTHORIZED

## Known divergence from founder decisions (2026-10-19)
- Signup is optional; the founder decided it is required after the societal page (C4), with email first, a code next, and an optional password or passkey after signup (C3 plus the 2026-10-17 decision record).
- Every account is created with the placeholder name "It explorer"; the founder wants a required name step after signup.
- The save sends selected pains, help interests and `draftUpdatedAt`; the founder decided signup sends only picked dreams (with pain and content version), selected fixes and the opt-in.
- There is no email opt-in, no terms line, and the device copy is not cleared after saving.
- The session table stores IP address and user agent; the founder decided to keep them, disclose them and delete them with the session.
