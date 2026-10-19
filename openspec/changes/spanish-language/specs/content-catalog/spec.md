# Spec Delta

## ADDED Requirements

### Requirement: Spanish version of each record
The content editor SHALL let the founder create, edit and remove a Spanish version of every shown text field of each group, pain, dream and fix, next to the English text. A Spanish version SHALL belong to exactly one record and share its ID, links, order, provenance and license.

#### Scenario: Add Spanish to a pain
- **WHEN** the founder enters a Spanish name and line for a pain and saves the draft
- **THEN** the draft holds that Spanish version, linked to the pain's ID

#### Scenario: Missing field
- **WHEN** a Spanish version leaves a field empty that the English record has
- **THEN** draft validation reports it

### Requirement: How each translation was made
Each Spanish version SHALL record how it was made (written by a person, or machine-assisted), who last edited it and when, whether it has been reviewed, and which English text it was made from.

#### Scenario: Mark reviewed
- **WHEN** the founder marks a machine-assisted Spanish version as reviewed
- **THEN** the record shows it as machine-assisted and reviewed, with the founder as last editor

### Requirement: Out-of-date translations
When a record's English text changes after its Spanish was made, the Spanish SHALL be marked out of date and SHALL NOT be published; the record SHALL appear in English. The founder SHALL be able to edit the Spanish or confirm it still matches, which makes it current again.

#### Scenario: Typo fix in English
- **WHEN** the founder fixes a typo in a pain's English line and confirms the Spanish still matches
- **THEN** the Spanish is current again and is published with the next version

#### Scenario: Not confirmed
- **WHEN** the founder changes a dream's English line and publishes without touching its Spanish
- **THEN** Spanish visitors see that dream in English

### Requirement: Translation list
The content editor SHALL list every record whose Spanish is missing, unreviewed or out of date, with counts per record type, and SHALL let the founder open each one from the list.

#### Scenario: Find what is missing
- **WHEN** the founder opens the translation list
- **THEN** it shows, for example, "Pains: 14 missing, 3 unreviewed, 1 out of date" and each listed pain opens its editor

### Requirement: Spanish preview
The founder SHALL be able to preview the draft as a Spanish visitor would see it, before publishing.

#### Scenario: Preview in Spanish
- **WHEN** the founder previews the draft in Spanish
- **THEN** the preview shows Spanish where it would be published and English elsewhere

### Requirement: Both languages published together
Each publish SHALL produce one version holding the English content and the Spanish text that may be shown. Both languages SHALL have the same items, links, order and tags; a language SHALL NOT add or drop items. Rolling back SHALL restore both languages to the same earlier version.

#### Scenario: Roll back
- **WHEN** the founder rolls back to an earlier version
- **THEN** Spanish visitors see that version's Spanish and English visitors its English

### Requirement: Sources keep their language
Translating a record SHALL NOT change its provenance, and nothing in the editor or the app SHALL imply that a cited source is in Spanish when it is not.

#### Scenario: Translated record keeps its sources
- **WHEN** the founder adds Spanish to a fix with English-only sources
- **THEN** the fix's provenance is unchanged and still points to the English sources
