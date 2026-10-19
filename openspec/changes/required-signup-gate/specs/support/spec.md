# Spec Delta

## ADDED Requirements

### Requirement: Place in the flow
The Support page SHALL be reached after the name step, and SHALL be skippable. Skipping it, or returning from a completed or cancelled payment, SHALL lead to a "You're all set" screen. No screen shown before signup SHALL link to the Support page.

#### Scenario: Skip support
- **WHEN** a newly signed-up person skips the Support page
- **THEN** they see the "You're all set" screen

#### Scenario: Before signup
- **WHEN** a signed-out person goes through the personal and societal pages
- **THEN** no link to the Support page is shown
