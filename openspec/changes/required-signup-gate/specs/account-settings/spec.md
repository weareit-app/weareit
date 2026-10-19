# Spec Delta

## Purpose

The account screen where a signed-in person sees their name and email, manages how they sign in (password, passkey), and signs out.

## ADDED Requirements

### Requirement: Account screen
A signed-in person SHALL reach an account screen from a menu. It SHALL show their name and email and let them change their name.

#### Scenario: Open the account screen
- **WHEN** a signed-in person opens the menu and chooses the account screen
- **THEN** they see their name and email

### Requirement: Set or change a password
The account screen SHALL let a person add a password, or change an existing one. Passwords SHALL be at least 12 characters, SHALL have no rules about symbols or character types, and SHALL be refused if they appear in known breaches.

#### Scenario: Short password
- **WHEN** the person enters an 11-character password
- **THEN** it is refused with a message saying passwords need at least 12 characters

#### Scenario: Breached password
- **WHEN** the person enters a password that appears in known breaches
- **THEN** it is refused with a message asking for a different one

### Requirement: Add a passkey on web
On web, the account screen SHALL let a person register a passkey for signing in. On iOS this option SHALL NOT be shown.

#### Scenario: Register a passkey
- **WHEN** a person on web chooses to add a passkey and confirms with their device
- **THEN** the passkey is registered and can be used at the gate

### Requirement: Sign out
The account screen SHALL offer "Sign out". Signing out SHALL end the session and remove cached account data from the device, so the pages start empty.

#### Scenario: Sign out
- **WHEN** the person signs out
- **THEN** the personal and societal pages show no picks until they sign in again

### Requirement: Account screen accessibility
Every control on the account screen SHALL be keyboard reachable with visible focus and labelled for screen readers, and errors SHALL be announced and not shown by colour alone.

#### Scenario: Keyboard only
- **WHEN** a keyboard user tabs through the account screen
- **THEN** every control can be reached and used
