# Spec Delta

## ADDED Requirements

### Requirement: Way evidence for its own claim
Every way SHALL record an evidence level (Strong, Some, Limited or Not tested yet) and a note for the claim the way itself makes: that the method works, for a Task, Habit or Takes a group; that the It feature works, for a Feature. A draft with a way missing either SHALL NOT be published.

#### Scenario: Missing note
- **WHEN** the founder publishes a draft containing a way with a level but no note
- **THEN** publishing is refused with a validation issue naming that way

#### Scenario: Feature claim
- **WHEN** a Feature way is published
- **THEN** its level and note describe evidence for the It feature itself

### Requirement: Method evidence for features
A Feature way MAY also record a separate level and note for the method it builds on. This method evidence SHALL be stored apart from the feature's own level and SHALL NOT replace it.

#### Scenario: Peer check-ins
- **WHEN** the founder records "Some" for peer support as the method behind the check-ins feature
- **THEN** the feature's own level stays "Not tested yet" and the method level is stored separately

### Requirement: Evidence on a way's link to a future
Each way–future link MAY record its own level and note for the claim "this way helps this future", stored on the link and never merged into the way's own level. A link with no level SHALL be treated as not assessed.

#### Scenario: Same way, two futures
- **WHEN** a way is linked to two futures and only one link has a level
- **THEN** that link keeps its level and the other link reads as not assessed

### Requirement: Edit evidence in the editor
The content editor SHALL let the founder view and edit each way, including its type, status, linked futures, its own level and note, any method level and note, and each link's level and note, with each claim labelled by what it is about.

#### Scenario: Change a level
- **WHEN** the founder changes a way's level from "Limited" to "Some" and publishes
- **THEN** the published way records "Some" with its note

### Requirement: Evidence privacy
Evidence levels and notes SHALL be content written or approved by the founder and SHALL hold no personal data; nothing about which ways a person picked SHALL be stored with them.

#### Scenario: Published way
- **WHEN** anyone reads a published way's evidence fields
- **THEN** they contain only the level and note, and no information about people

### Requirement: Evidence editor accessibility
Every evidence control in the editor SHALL be reachable and usable by keyboard with visible focus, labelled with the claim it belongs to for screen readers, and levels SHALL be shown as words, not colour alone.

#### Scenario: Screen reader on a level
- **WHEN** a screen reader focuses a way–future link's level
- **THEN** it announces the level and that it is the evidence for that way helping that future
