# Spec Delta

## ADDED Requirements

### Requirement: Calm note on arrival from a dead link
When the personal page is opened because a pain link was unknown, unpublished or retired without replacement, it SHALL show a short calm note near the top, dismissible, and otherwise behave as usual.

#### Scenario: Note dismissed
- **WHEN** the person dismisses the note
- **THEN** it disappears and the personal page works as usual

#### Scenario: Ordinary visit
- **WHEN** the personal page is opened directly
- **THEN** no note is shown
