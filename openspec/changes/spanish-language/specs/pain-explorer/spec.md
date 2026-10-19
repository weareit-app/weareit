# Spec Delta

## ADDED Requirements

### Requirement: Pages in the active language
The personal and societal pages SHALL show their headline, question, group names, pains, dreams, fixes, tags, tag explanations, summaries, focus invite, buttons and on-device note in the active language, using English for any content item without Spanish that may be shown.

#### Scenario: Spanish visitor
- **WHEN** a visitor with Spanish active opens the personal page
- **THEN** the headline, question and every translated group, pain and button are in Spanish

### Requirement: Joined sentences follow the language
Where picked dreams' first-person lines are joined into one sentence (collapsed group preview and closed pain summary), the join SHALL follow the active language's rules, for example "y" in Spanish instead of "and".

#### Scenario: Spanish summary
- **WHEN** a person with Spanish active closes a pain with two picked dreams
- **THEN** the summary joins their Spanish lines with "y", not "and"

### Requirement: Switching keeps the pages as they were
Switching language on the personal or societal page SHALL keep the same groups expanded, the same pain open, the same dreams picked, the same fixes selected and the scroll position, and SHALL NOT bring back a focus invite that was dismissed.

#### Scenario: Switch with a pain open
- **WHEN** a person has one pain open with a fix selected and switches to Spanish
- **THEN** the same pain stays open with the same fix selected, now in Spanish

### Requirement: Explorer accessibility in Spanish
In Spanish, group, pain, dream and fix controls SHALL announce their names and their expanded, collapsed or checked state in Spanish, and tag buttons SHALL announce their expanded state in Spanish.

#### Scenario: Screen reader on a Spanish pain
- **WHEN** a screen reader focuses an open pain while Spanish is active
- **THEN** it announces the pain's Spanish name and that it is expanded, in Spanish
