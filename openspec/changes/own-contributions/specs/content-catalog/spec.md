# Spec Delta

## ADDED Requirements

### Requirement: Per-pain order of futures
Each pain–future link SHALL carry a position within that pain. A future linked to several pains SHALL have its own position under each. Published content SHALL include these positions.

#### Scenario: Shared future
- **WHEN** a future is linked to two pains
- **THEN** it can be second under one pain and fourth under the other

### Requirement: Reorder futures in the editor
The founder SHALL be able to change the order of a pain's futures in the content editor without dragging, and the new order SHALL take effect when the draft is published.

#### Scenario: Move a future up
- **WHEN** the founder moves a pain's third future up one place and publishes
- **THEN** it is second under that pain on the page and in the joined sentence

### Requirement: Contributions become ordinary records
An approved contribution SHALL be published as an ordinary pain, future or way with a readable stable ID, the same fields as founder-written content, and no field identifying its contributor.

#### Scenario: Published shape
- **WHEN** a published version includes an approved way
- **THEN** the way has the same fields as any other way, and none of them identify a person
