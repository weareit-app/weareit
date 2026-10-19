# Spec Delta

## ADDED Requirements

### Requirement: Published IDs never change
Once a group, pain, future or way has appeared in any published version, its ID SHALL NOT change. The content editor SHALL show that ID as read-only, with a line saying published IDs never change while wording can. A record never published SHALL keep an editable ID.

#### Scenario: Published pain
- **WHEN** the founder selects `poor-sleep`, which has been published
- **THEN** its Stable ID is shown and cannot be edited

#### Scenario: Draft-only record
- **WHEN** the founder selects a pain added since the last publish
- **THEN** its ID can be edited

### Requirement: Confirm removal of published IDs
Publishing or rolling back SHALL list every previously published ID the result would no longer contain, and SHALL go ahead only if the founder confirms each one. Unconfirmed removals SHALL be refused by the server, so a rename made outside the editor cannot slip through.

#### Scenario: Deleted dream
- **WHEN** the founder deletes a published dream and publishes
- **THEN** publishing lists that dream's ID and waits for confirmation before creating the version

#### Scenario: Rename through the API
- **WHEN** a saved draft replaces published ID `poor-sleep` with `bad-sleep` and publishing is requested without confirming the removal
- **THEN** the server refuses to publish and names `poor-sleep`

#### Scenario: Rollback
- **WHEN** the founder rolls back to a version that lacks an ID published since
- **THEN** the rollback lists that ID and needs confirmation

### Requirement: Approve first-time IDs
Publishing SHALL list the IDs being published for the first time so the founder approves them knowing they become permanent, and SHALL refuse any ID still in the editor's placeholder form (starting `new-`).

#### Scenario: Placeholder ID
- **WHEN** a draft contains a pain with the ID `new-pain-m3x9`
- **THEN** publishing is refused with an issue asking for a readable ID

#### Scenario: New ID listed
- **WHEN** the founder publishes a draft with a new future `wake-up-ready`
- **THEN** the publish step lists `wake-up-ready` as becoming permanent

### Requirement: Locked IDs privacy
The record of which IDs have been published SHALL hold only content IDs and version numbers, and no data about people or their picks.

#### Scenario: Published-ID record
- **WHEN** the set of published IDs is inspected
- **THEN** it contains only content IDs and the versions they appeared in

### Requirement: Locked ID accessibility
A locked ID field SHALL be announced to screen readers as read-only with the reason, and the removal and first-time ID lists SHALL be reachable and confirmable by keyboard with visible focus, with no meaning carried by colour alone.

#### Scenario: Screen reader on a locked ID
- **WHEN** a screen reader focuses a published record's Stable ID
- **THEN** it announces the ID, that it is read-only, and that published IDs never change
