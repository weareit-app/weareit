# Spec Delta

## Purpose

A public page, reachable without an account, that tells people plainly what It keeps on their device, what it sends and stores, which other services are involved, and who It is for.

## ADDED Requirements

### Requirement: Public privacy page
It SHALL have a privacy page reachable without an account, linked from the signup gate's terms line.

#### Scenario: Signed out
- **WHEN** a signed-out person opens the privacy page
- **THEN** it loads without asking them to sign in

### Requirement: Placeholder content matches behaviour
The page SHALL say, in plain words: choices stay on the device before signup; exactly what signup sends and stores (picked dreams with their pain, selected fixes, the opt-in choice, name, email, and an optional password hash or passkey); that sign-in sessions keep the IP address and browser details until the session ends; and that it is placeholder text pending the full page. Every statement SHALL match what the app does.

#### Scenario: Signup list matches
- **WHEN** someone compares the page with the gate's "what will be saved" list
- **THEN** the two say the same thing

### Requirement: Services named
The page SHALL name the outside services involved and what each receives, including HaveIBeenPwned, which receives only the first five characters of a password's hash when a password is set, and the email provider once chosen.

#### Scenario: Password check disclosed
- **WHEN** someone reads the page
- **THEN** it says HaveIBeenPwned is used for password checks and what it receives

### Requirement: Age
The page SHALL state that It is for people 16 and over.

#### Scenario: Age line
- **WHEN** someone reads the page
- **THEN** it states the 16+ minimum
