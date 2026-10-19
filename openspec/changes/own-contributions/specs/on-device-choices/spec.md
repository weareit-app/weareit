# Spec Delta

## ADDED Requirements

### Requirement: Own contributions kept on the device
Own pains, futures and ways, with their place, position, picks and state, SHALL be kept in device storage with no expiry, validated when loaded; invalid entries SHALL be discarded without affecting the rest.

#### Scenario: Reload
- **WHEN** the person adds a future and reloads the page days later on the same device
- **THEN** the future is still there, picked, in its position

#### Scenario: One bad entry
- **WHEN** one stored own item fails validation
- **THEN** it is dropped and the other own items and picks still load

### Requirement: Clearing removes own contributions
Confirming "clear choices" SHALL also remove every own item that has not been sent for review, and the confirmation SHALL say so.

#### Scenario: Clear with own items
- **WHEN** a signed-out person with two own futures confirms clearing
- **THEN** both futures are removed from the device along with their picks

### Requirement: Own contributions survive the signup save
Saving picks to an account at signup SHALL NOT send, count or remove the person's unsent own items; they SHALL stay on the device, still marked "Only you can see this", and offer "Send for review".

#### Scenario: Just signed up
- **WHEN** a person with an unsent own pain signs up and their picks are saved
- **THEN** the own pain is still on their page, unsent, with "Send for review"
