# Spec Delta

## Purpose

Gives the founder a minimal queue in the content editor for pains, futures and ways that people sent for review, so each can be approved with edits, linked to existing content, or declined.

## ADDED Requirements

### Requirement: Review queue
The content editor SHALL show a Contributions queue listing every sent item not yet decided, oldest first, with its kind, name, line, type (for a way), where it was added (group, pain or future), and for a future its proposed position. It SHALL require the same founder access as the rest of the editor.

#### Scenario: New item appears
- **WHEN** a signed-in person sends a future for review
- **THEN** it appears in the founder's queue with its pain and proposed position

#### Scenario: No access
- **WHEN** someone without founder access requests the queue
- **THEN** the request is refused

### Requirement: Approve with edits
The founder SHALL be able to approve an item, editing its wording, choosing its readable ID, and for a future its position among the pain's futures. Approval SHALL add it to the draft content as an ordinary record; it SHALL become visible to others only when that draft is published.

#### Scenario: Approved but not yet published
- **WHEN** the founder approves a future and has not published
- **THEN** no one but the contributor sees it, and the contributor still sees "In review"

#### Scenario: Published
- **WHEN** the founder publishes a draft containing the approved future
- **THEN** everyone sees it in its position, and the contributor sees "Added"

### Requirement: Approved way defaults
An approved way SHALL get one of the usual types and the evidence level "Not tested yet" unless the reviewer sets another level.

#### Scenario: Default evidence
- **WHEN** the founder approves a way without changing its evidence level
- **THEN** its evidence level is "Not tested yet"

### Requirement: Link to existing content
The founder SHALL be able to resolve a sent item by linking it to an existing pain, future or way instead of publishing a copy. The contributor's item SHALL then show "Added" and their pick SHALL move to the existing record.

#### Scenario: Duplicate future
- **WHEN** the founder links a sent future to an existing future of the same pain
- **THEN** no new future is created, the contributor's pick moves to the existing one, and their item shows "Added"

### Requirement: Decline
The founder SHALL be able to decline a sent item. Nothing about it SHALL be shown to anyone but the contributor, who sees "Not added".

#### Scenario: Declined item
- **WHEN** the founder declines a sent pain
- **THEN** it leaves the queue, nobody else sees it, and the contributor sees "Not added"

### Requirement: Contributor never public
Published content SHALL NOT include, show or imply who contributed a record, or that anyone has that pain. The contributor SHALL be kept only as private provenance for review and abuse handling. A record's ID SHALL NOT be derived from its contributor.

#### Scenario: Published record
- **WHEN** anyone reads a published pain that began as a contribution
- **THEN** the published content carries no contributor name, account, email or hint of one

### Requirement: Review accessibility
Every queue control (approve, edit, link, decline, position) SHALL be reachable and usable by keyboard with visible focus, labelled for screen readers, and SHALL not rely on colour alone to show an item's state.

#### Scenario: Keyboard review
- **WHEN** the founder reviews a queue item using only the keyboard
- **THEN** they can edit, approve, link or decline it
