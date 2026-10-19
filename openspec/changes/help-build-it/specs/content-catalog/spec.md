# Spec Delta

## ADDED Requirements

### Requirement: Asks as content
The content editor SHALL hold asks: each with a stable ID, a title, a short line saying what It needs, the ESCO skills it needs (as references with original URIs), and an open or closed state. Asks SHALL be published with the content version like other records.

#### Scenario: Publish an ask
- **WHEN** the founder approves and publishes a new ask with three needed skills
- **THEN** it appears on the Help build It page with its skills used for matching

### Requirement: Closing an ask
The founder SHALL be able to close an ask; a closed ask SHALL take no new offers and SHALL keep its ID and existing offers.

#### Scenario: Close
- **WHEN** the founder closes an ask
- **THEN** it disappears from the Help build It list and stays visible to people who offered on it

### Requirement: AI-drafted, founder-approved asks
Asks and their needed skills SHALL appear to people only after the founder approves them in the editor; drafting them with AI outside It is allowed.

#### Scenario: Unapproved draft
- **WHEN** an ask is saved in the editor but not approved
- **THEN** it does not appear on the Help build It page
