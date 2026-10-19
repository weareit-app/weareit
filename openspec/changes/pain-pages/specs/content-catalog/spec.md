# Spec Delta

## ADDED Requirements

### Requirement: Pain slugs
Every published pain SHALL have one current slug, separate from its ID and defaulting to it: lowercase letters, digits and single hyphens, unique across all pains. Changing a pain's name, line, dreams, fixes or detailed content SHALL NOT change its slug.

#### Scenario: Default slug
- **WHEN** a new pain with ID `rent-eats-everything` is prepared for publishing
- **THEN** its slug is proposed as `rent-eats-everything`

#### Scenario: Rewording
- **WHEN** the founder rewords a published pain's name
- **THEN** its slug stays the same

#### Scenario: Invalid slug
- **WHEN** a slug contains capitals, spaces or a double hyphen
- **THEN** the content schema rejects it

### Requirement: Founder approves the slug at first publish
Publishing a pain for the first time SHALL require the founder to approve its slug in the content editor.

#### Scenario: First publish
- **WHEN** the founder publishes a version that includes a pain published for the first time
- **THEN** the editor asks them to approve that pain's slug, prefilled with its ID, before publishing

### Requirement: Old slugs are permanent aliases
The founder SHALL be able to change a published pain's slug. The old slug SHALL then be kept as a permanent alias of that pain in every later version, and SHALL NOT be removable.

#### Scenario: Slug changed
- **WHEN** the founder changes a pain's slug and publishes
- **THEN** the published version lists the old slug as an alias of that pain

### Requirement: Slugs are never reused
A slug that has ever been published, as a current slug or an alias, SHALL name only its original pain, including after that pain is retired. Publishing SHALL be refused if any pain would take another pain's current or past slug.

#### Scenario: Reusing a retired pain's slug
- **WHEN** the founder gives a new pain the slug of a retired pain
- **THEN** publishing is refused with a validation error naming the slug

### Requirement: Retiring a pain
The founder SHALL be able to retire a published pain, optionally naming a published replacement pain. A retired pain SHALL no longer appear on the personal or societal pages, and SHALL keep its ID and slugs.

#### Scenario: Retire with replacement
- **WHEN** the founder retires a pain, names a replacement and publishes
- **THEN** the pain disappears from its list page and the published version records the replacement

#### Scenario: Replacement not published
- **WHEN** the named replacement is itself retired or unpublished
- **THEN** publishing is refused with a validation error

### Requirement: Launch set
The founder SHALL be able to mark pains as part of the outreach launch set in the content editor. The editor's pain list SHALL highlight launch-set pains and show whether each has published detailed content.

#### Scenario: Preparing outreach
- **WHEN** the founder views the pain list in the editor
- **THEN** launch-set pains are highlighted with whether their detailed content is published

### Requirement: Detailed pain content
A pain SHALL be able to hold detailed content: ordered sections of plain text, images and charts, each claim, image and chart carrying its source with a date. Detailed content SHALL be drafted, approved by the founder, and published and versioned with the rest of the content.

#### Scenario: Section without a source
- **WHEN** a detailed section contains a chart or claim without a dated source
- **THEN** publishing is refused with a validation error

#### Scenario: Rolling back
- **WHEN** the founder rolls back to an earlier version
- **THEN** the detailed content of that version is what pain pages show

### Requirement: Image and chart text alternatives
Every image in detailed content SHALL have a text alternative, and every chart a short text summary and its data as text, or publishing SHALL be refused.

#### Scenario: Missing alternative
- **WHEN** a detailed section has an image with no text alternative
- **THEN** publishing is refused with a validation error

### Requirement: Links shown in the editor
For each published pain, the content editor SHALL show its current slug, its old slugs and its full link, with a control to copy the link.

#### Scenario: Copying a link
- **WHEN** the founder copies a pain's link in the editor
- **THEN** the copied text is It's address, `/p/` and the current slug, with nothing added

### Requirement: Published slug data
The published content version SHALL include, for each pain, its current slug, aliases, retired state, replacement, launch-set flag and detailed content, so the app can resolve any pain link from that version alone.

#### Scenario: Resolving an alias
- **WHEN** the app asks for the pain behind an old slug
- **THEN** the latest published version answers with that pain and its current slug
