# Spec Delta

## ADDED Requirements

### Requirement: Code email in the person's language
The sign-in code email SHALL be written in the account's language when the email belongs to an account that has one, and otherwise in the language active on the device when the code was requested. A missing or unknown language SHALL fall back to English.

#### Scenario: New person in Spanish
- **WHEN** a signed-out person with Spanish active requests a code for a new email
- **THEN** the code email is in Spanish

#### Scenario: Returning account on an English device
- **WHEN** a person whose account language is Spanish requests a code from a device set to English
- **THEN** the code email is in Spanish

### Requirement: Account records its language
Each account SHALL record one language (English or Spanish) and when it was last chosen. A new account SHALL start with the language active when it was created. Other emails It sends to the account SHALL use that language.

#### Scenario: Sign up in Spanish
- **WHEN** a person signs up with Spanish active
- **THEN** the new account's language is Spanish
