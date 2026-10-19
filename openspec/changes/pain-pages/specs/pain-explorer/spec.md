# Spec Delta

## ADDED Requirements

### Requirement: Link to the pain page
An opened pain on the personal or societal page SHALL offer a link to that pain's own page at `/p/<current slug>`. Which pains show the link (every published pain, or only the launch set) is pending founder confirmation; until then it SHALL be shown for every published pain.

#### Scenario: Following the link
- **WHEN** the person opens a pain on the personal page and follows its pain-page link
- **THEN** that pain's page opens with the same picks

#### Scenario: Closed pain
- **WHEN** a pain is not open
- **THEN** no pain-page link is shown for it

### Requirement: Calm note on arrival from a dead link
When the personal page is opened because a pain link was unknown, unpublished or retired without replacement, it SHALL show a short calm note near the top, dismissible, and otherwise behave as usual.

#### Scenario: Note dismissed
- **WHEN** the person dismisses the note
- **THEN** it disappears and the personal page works as usual

#### Scenario: Ordinary visit
- **WHEN** the personal page is opened directly
- **THEN** no note is shown
